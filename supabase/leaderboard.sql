-- Fruit Picnic friends leaderboard
-- Paste this whole file into Supabase → SQL Editor → New query, then press Run.
-- It's safe to run more than once.

-- One row per player (per phone): their name and their best score so far
create table if not exists public.scores (
  player_id  uuid primary key,
  name       text not null check (char_length(name) between 1 and 20),
  score      integer not null check (score between 0 and 4000000),
  top_tile   integer not null check (top_tile between 2 and 131072),
  updated_at timestamptz not null default now()
);

-- Everyone can read names, scores and tiles (but not the private player ids).
-- Nobody can write to the table directly; scores only go in through
-- submit_score below, which checks them first.
alter table public.scores enable row level security;
drop policy if exists "Anyone can read the leaderboard" on public.scores;
create policy "Anyone can read the leaderboard" on public.scores for select using (true);
revoke all on public.scores from anon, authenticated;
grant select (name, score, top_tile, updated_at) on public.scores to anon, authenticated;

-- Save a finished game. Keeps each player's best score, updates their name,
-- and returns their place on the leaderboard (1 = top).
create or replace function public.submit_score(p_player uuid, p_name text, p_score integer, p_tile integer)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text := left(btrim(coalesce(p_name, '')), 20);
  v_best integer;
begin
  if v_name = '' or p_score is null or p_score < 0 or p_score > 4000000
     or p_tile is null or p_tile < 2 or p_tile > 131072 or (p_tile & (p_tile - 1)) <> 0 then
    raise exception 'That score doesn''t look right';
  end if;

  insert into scores (player_id, name, score, top_tile)
  values (p_player, v_name, p_score, p_tile)
  on conflict (player_id) do update set
    name       = excluded.name,
    score      = greatest(scores.score, excluded.score),
    top_tile   = greatest(scores.top_tile, excluded.top_tile),
    updated_at = case when excluded.score > scores.score then now() else scores.updated_at end;

  select score into v_best from scores where player_id = p_player;
  return (select count(*) + 1 from scores where score > v_best);
end;
$$;

revoke all on function public.submit_score(uuid, text, integer, integer) from public;
grant execute on function public.submit_score(uuid, text, integer, integer) to anon, authenticated;

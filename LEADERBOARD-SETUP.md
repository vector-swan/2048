# Setting up the friends leaderboard (Supabase)

The game already has the leaderboard built in. It stays hidden until it's
connected to your own free Supabase database. Setup takes about 10 minutes.

## 1. Create the database

1. Go to https://supabase.com and sign up (free).
2. Click **New project**.
   - **Name:** `fruit-picnic`
   - **Database password:** click **Generate a password** and save it
     somewhere safe. The game doesn't need it.
   - **Region:** the one closest to you and your friends.
3. Wait a minute or two while it sets up.

## 2. Add the leaderboard table

1. In the left sidebar, open **SQL Editor**, then click **New query**.
2. Open `supabase/leaderboard.sql` from this project, copy all of it, and paste
   it into the editor.
3. Press **Run**. It should say "Success. No rows returned."

## 3. Copy two values into the chat

Open **Project Settings → API Keys**, or click the **Connect** button at the
top of the project. Copy these two values:

- **Project URL:** looks like `https://abcdefghijkl.supabase.co`
- **Publishable key:** starts with `sb_publishable_`. On older projects it's
  called the **anon public** key and starts with `eyJ`.

Paste both into the chat with Claude. They go into `leaderboard.js` at the top.

**Don't** share the **secret** or **service_role** key. It isn't needed and must
stay private.

## How it works

- After a game ends, players type a name once and tap **Post**. After that,
  every finished game is posted automatically.
- Each phone appears once on the board, with its best score.
- The 🏆 button next to the sound button shows the top 15.
- Scores made offline are posted the next time the game is online.
- Players can't edit or delete other people's scores. You can, in Supabase
  under **Table Editor → scores**, for example to remove a fake score or a
  rude name.

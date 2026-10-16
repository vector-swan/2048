'use strict';
// ── How to play ───────────────────────────────────────────────────────────────
// 1. The very first game starts with two matching tiles and a little hand
//    showing the swipe, until the player makes their first match.
// 2. Then a short "two cherries make a strawberry!" message, once.
// 3. The "How to play" link under the board opens a card with three steps.

const TUTORIAL_WORDS = {
  fruit: { pair: 'cherries', make: 'Two cherries make a strawberry!', goal: 'watermelon' },
  halloween: { pair: 'candy corns', make: 'Two candy corns make a hard candy!', goal: 'haunted house' },
};
const HAND_SVG = '<svg viewBox="0 0 40 44" aria-hidden="true"><path d="M14 30V9.5a3 3 0 0 1 6 0V21l1.6-.6a3 3 0 0 1 4 2.3l.4-.1a3 3 0 0 1 3.9 2.4l.3-.1a3 3 0 0 1 3.8 2.6V33c0 5.5-4.2 9.5-9.6 9.5h-2.2c-3.4 0-5.6-1.5-7.3-4l-4.4-6.6a2.6 2.6 0 0 1 4-3.3z" fill="#FFFDF8" stroke="#6B3F6E" stroke-width="2" stroke-linejoin="round"/>'
  + '<path d="M20 21v6M25.6 22.6v5M29.9 25v4" stroke="#6B3F6E" stroke-width="1.6" stroke-linecap="round"/></svg>';

// Done once they've made a match, or if they'd played before this hint existed
const tutorialDone = () => {
  try { return localStorage.getItem('2048tutorial') === 'done' || +(localStorage.getItem('2048best') || 0) > 0; }
  catch (_) { return true; }
};
let coachEl = null;

function tutorialStart() {
  // two lone matching tiles in the second row, with a gap between them
  liveTiles.forEach(t => t.el.remove());
  liveTiles = [];
  [[1, 0], [1, 2]].forEach(([r, c]) => {
    const el = makeTileEl(2, r, c);
    tilesEl.appendChild(el);
    liveTiles.push({ id: nextId++, value: 2, r, c, el });
  });
  coachEl = document.createElement('div');
  coachEl.className = 'coach';
  coachEl.innerHTML = '<div class="coach-bubble"></div><div class="coach-trail"></div><div class="coach-hand">' + HAND_SVG + '</div>';
  document.getElementById('board').appendChild(coachEl);
  tutorialRefresh();
}
// Called by applyTheme so the words match the theme
function tutorialRefresh() {
  if (coachEl) coachEl.querySelector('.coach-bubble').innerHTML = `Swipe <b>←</b> to match the ${TUTORIAL_WORDS[themeId].pair}!`;
}
// Called by newGame: a fresh random board no longer matches the hint
function tutorialHide() {
  if (coachEl) { coachEl.remove(); coachEl = null; }
}
// Called by doMove whenever tiles merge
function tutorialMerged() {
  if (tutorialDone()) return;
  try { localStorage.setItem('2048tutorial', 'done'); } catch (_) {}
  if (coachEl) { coachEl.remove(); coachEl = null; }
  const toast = document.createElement('div');
  toast.className = 'coach-toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<img alt="" src="${svgURL(TILE_ART[4])}"><span>${TUTORIAL_WORDS[themeId].make}</span>`;
  document.querySelector('.board-wrapper').appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 3800);
}

// ── The "How to play" card ──
let howtoOpen = false;
function openHowTo() {
  const w = TUTORIAL_WORDS[themeId], u = v => svgURL(TILE_ART[v]);
  document.getElementById('howtoSteps').innerHTML = `
    <div class="step"><span class="num">1</span><div class="txt"><b>Swipe</b> up, down, left or right (or use the arrow keys). Every tile slides that way.<div class="swipe-pic" aria-hidden="true">← ↑ ↓ →</div></div></div>
    <div class="step"><span class="num">2</span><div class="txt"><b>Match two of the same</b> and they join into the next one.<div class="pics"><img alt="" src="${u(2)}">+<img alt="" src="${u(2)}">=<img alt="" src="${u(4)}"></div></div></div>
    <div class="step"><span class="num">3</span><div class="txt"><b>Reach the ${w.goal}!</b> If the board fills up with no matches, the game is over.<div class="pics"><img alt="" src="${u(2048)}"></div></div></div>`;
  howtoOpen = true;
  document.getElementById('howto').classList.add('show');
}
function closeHowTo() {
  howtoOpen = false;
  document.getElementById('howto').classList.remove('show');
}
document.getElementById('howtoBtn').addEventListener('click', openHowTo);
document.getElementById('howtoClose').addEventListener('click', closeHowTo);

if (!tutorialDone() && location.hash !== '#almost-win') tutorialStart();

'use strict';

const pause = ms => new Promise(r => setTimeout(r, ms));

// ── Audio ─────────────────────────────────────────────────────────────────────
// Kalimba garden: a soft muted thump for every merge, and a short "climbing
// phrase" the first time each new fruit appears (same shape, one step higher
// per fruit). Everything is synthesised with Web Audio; no sound files.
let soundOn = true;
try { soundOn = localStorage.getItem('2048sound') !== 'off'; } catch (_) {}

let audioCtx = null, audioBus = null, audioVerb = null, noiseBuf = null;

function getAudio() {
  if (!audioCtx) {
    const ctx = audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 4;
    comp.connect(ctx.destination);
    audioBus = ctx.createGain(); audioBus.gain.value = 0.9; audioBus.connect(comp);
    // Small generated room reverb for warmth
    audioVerb = ctx.createConvolver();
    const n = Math.floor(ctx.sampleRate * 1.8), ir = ctx.createBuffer(2, n, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = ir.getChannelData(ch);
      for (let k = 0; k < n; k++) d[k] = (Math.random() * 2 - 1) * Math.pow(1 - k / n, 3);
    }
    audioVerb.buffer = ir;
    const vg = ctx.createGain(); vg.gain.value = 0.45;
    audioVerb.connect(vg); vg.connect(comp);
    noiseBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.1), ctx.sampleRate);
    const nd = noiseBuf.getChannelData(0);
    for (let k = 0; k < nd.length; k++) nd[k] = Math.random() * 2 - 1;
  }
  // iOS uses 'suspended' before the first tap and 'interrupted' after a screen lock
  if (audioCtx.state !== 'running') audioCtx.resume().catch(() => {});
  return audioCtx;
}

function route(node, send) {
  node.connect(audioBus);
  if (send) { const s = audioCtx.createGain(); s.gain.value = send; node.connect(s); s.connect(audioVerb); }
}

function tone(t, { f, type = 'sine', vol = 0.1, a = 0.005, d = 0.3, lp = null, send = 0 }) {
  const osc = audioCtx.createOscillator(), g = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(f, t);
  let last = osc;
  if (lp) { const fl = audioCtx.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = lp; osc.connect(fl); last = fl; }
  last.connect(g);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + a);
  g.gain.exponentialRampToValueAtTime(0.0005, t + a + d);
  route(g, send);
  osc.start(t); osc.stop(t + a + d + 0.05);
}

function tap(t, vol) {
  const src = audioCtx.createBufferSource(), fl = audioCtx.createBiquadFilter(), g = audioCtx.createGain();
  src.buffer = noiseBuf;
  fl.type = 'bandpass'; fl.frequency.value = 700; fl.Q.value = 1;
  src.connect(fl); fl.connect(g);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0005, t + 0.01);
  route(g, 0);
  src.start(t); src.stop(t + 0.05);
}

function kalimba(t, f, vol, send = 0.15) {
  tone(t, { f, type: 'triangle', vol, a: 0.003, d: 0.5, lp: 2200, send });
  tone(t, { f: f * 2, vol: vol * 0.3, a: 0.002, d: 0.15, send });
}

// Pentatonic notes: i = 0 is C4, every 5 steps is an octave
const STEPS = [0, 2, 4, 7, 9];
function note(i) {
  const o = Math.floor(i / 5), s = STEPS[((i % 5) + 5) % 5];
  return 261.63 * Math.pow(2, o + s / 12);
}

const BEAT = 0.14;
function playPhrase(t, phrase, vol = 0.09, send = 0.2) {
  let at = t;
  phrase.forEach(([i, beats], k) => {
    const last = k === phrase.length - 1;
    kalimba(at, note(i), last ? vol * 1.15 : vol, send);
    if (!last) at += beats * BEAT;
  });
  return at;
}

function withAudio(fn) {
  if (!soundOn) return;
  try { const t = getAudio().currentTime + 0.01; fn(t); } catch (_) {}
}

// Every merge: a soft, muted woody thump
function soundMerge() {
  withAudio(t => {
    tone(t, { f: 170 * (0.97 + Math.random() * 0.06), type: 'triangle', vol: 0.06, a: 0.002, d: 0.06, lp: 500 });
    tap(t, 0.016);
  });
}

// New fruit: the climbing phrase. L = -3 for strawberry (4), 0 for orange (32)
// … 6 for watermelon (2048). Strawberry, grapes and lemon continue the climb
// downward, so orange and up are unchanged.
function soundNewFruit(value) {
  const L = Math.min(Math.max(Math.log2(value) - 5, -3), 6);
  withAudio(t => {
    const b = 2 + L;
    const phrase = L >= 6
      ? [[b, 1], [b + 2, 1], [b + 1, 1], [b + 3, 1], [b + 5, 3]]
      : [[b, 1], [b + 2, 1], [b + 1, 1], [b + 3, 2]];
    const lastAt = playPhrase(t, phrase);
    if (L >= 5) kalimba(lastAt, note(phrase[phrase.length - 1][0] - 5), 0.05, 0.3);
    if (L >= 6) [b - 5, b - 3, b - 2, b].forEach((i, k) => kalimba(lastAt + 0.02 + k * 0.03, note(i), 0.045, 0.4));
  });
}

// iOS only lets audio start from a tap/click/key (not a finger moving), and
// swipes fire on touchmove, so wake the audio on the first real tap or key.
// Runs on every tap (cheap when audio is already running), so it also
// recovers after the phone was locked or the app was in the background.
function unlockAudio() {
  if (!soundOn) return;
  try {
    const ctx = getAudio();
    if (ctx.state !== 'running') {
      // Starting a silent sound inside the tap is what fully unlocks iOS audio
      const src = ctx.createBufferSource();
      src.buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
      src.connect(ctx.destination);
      src.start(0);
    }
  } catch (_) {}
}
['touchend', 'pointerdown', 'pointerup', 'click', 'keydown'].forEach(ev =>
  document.addEventListener(ev, unlockAudio, { capture: true, passive: true }));
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && audioCtx && audioCtx.state !== 'running') audioCtx.resume().catch(() => {});
});

// Reaching 2048: the watermelon phrase is the finale
function soundVictory() { soundNewFruit(2048); }

// Game over: a gentle phrase stepping down
function soundGameOver() {
  withAudio(t => playPhrase(t, [[7, 1], [5, 1], [4, 1], [2, 1], [0, 3]], 0.07, 0.25));
}

// ── Confetti ──────────────────────────────────────────────────────────────────
const CC = ['#FF85C2','#CF91F0','#80D5E0','#FFE05A','#B5E48C','#FF99C8','#A8DADC'];

class Particle {
  constructor(canvas) { this.c = canvas; this.reset(); this.y = Math.random() * canvas.height; }
  reset() {
    this.x  = Math.random() * this.c.width;
    this.y  = -20;
    this.w  = 7 + Math.random() * 8;
    this.h  = 4 + Math.random() * 5;
    this.color = CC[Math.floor(Math.random() * CC.length)];
    this.vx = (Math.random() - 0.5) * 2.5;
    this.vy = 2 + Math.random() * 3;
    this.angle = Math.random() * Math.PI * 2;
    this.va = (Math.random() - 0.5) * 0.15;
  }
  update() {
    this.x += this.vx; this.y += this.vy; this.angle += this.va;
    if (this.y > this.c.height + 20) this.reset();
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
    ctx.restore();
  }
}

let particles = [], animId = null;

function startConfetti() {
  const cv = document.getElementById('confetti');
  cv.width = window.innerWidth; cv.height = window.innerHeight;
  const ctx = cv.getContext('2d');
  particles = Array.from({ length: 130 }, () => new Particle(cv));
  const frame = () => {
    ctx.clearRect(0, 0, cv.width, cv.height);
    particles.forEach(p => { p.update(); p.draw(ctx); });
    animId = requestAnimationFrame(frame);
  };
  cancelAnimationFrame(animId); frame();
}

function stopConfetti() {
  cancelAnimationFrame(animId);
  const cv = document.getElementById('confetti');
  cv.getContext('2d').clearRect(0, 0, cv.width, cv.height);
}

// ── Constants & live state ────────────────────────────────────────────────────
const SIZE = 4;
const GAP  = 10;
const SLIDE_MS = 85;    // must match CSS transition duration

// liveTiles: the single source of truth — array of { id, value, r, c, el }
let liveTiles = [];
let nextId = 1;
let score = 0;
let best = parseInt(localStorage.getItem('2048best') || '0', 10);
let celebrationShown = false;
let highestThisGame = 0;      // for the new-fruit chime
let busy = false;             // blocks input during slide+merge animation

const tilesEl = document.getElementById('tiles');

// ── Tile sizing helpers ───────────────────────────────────────────────────────
let cachedTileSize = 0;
function tileSize() {
  if (!cachedTileSize) {
    const w = tilesEl.offsetWidth;
    cachedTileSize = w > 0 ? (w - (SIZE - 1) * GAP) / SIZE : 80;
  }
  return cachedTileSize;
}
function tileLeft(c) { return c * (tileSize() + GAP); }
function tileTop(r)  { return r * (tileSize() + GAP); }

// ── DOM helpers ───────────────────────────────────────────────────────────────
function tileClass(value) { return 't' + Math.min(value, 8192); }

// Create element and set initial position BEFORE appending to DOM
// (so the CSS left/top transition doesn't fire on first placement)
// Each illustration is shown as an <img>, so the browser rasterises it once
// and reuses the bitmap while tiles slide (live SVG was re-drawn every frame).
const artSrc = {};
function artNode(value) {
  if (!artSrc[value]) {
    artSrc[value] = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(TILE_ART[value] || '');
  }
  const img = new Image();
  img.src = artSrc[value];
  img.alt = '';
  img.draggable = false;
  return img;
}
// Warm the image cache so tiles never pop in blank
Object.keys(TILE_ART).forEach(v => { const i = artNode(v); i.decode && i.decode().catch(() => {}); });

function makeTileEl(value, r, c) {
  const el = document.createElement('div');
  el.className = `tile ${tileClass(value)}`;
  el.dataset.v = value;
  el.appendChild(artNode(value));
  const sz = tileSize();
  el.style.cssText = `width:${sz}px;height:${sz}px;translate:${tileLeft(c)}px ${tileTop(r)}px`;
  return el;
}

function applyTileDisplay(tile) {
  tile.el.className = `tile ${tileClass(tile.value)}`;
  tile.el.dataset.v = tile.value;
  tile.el.replaceChildren(artNode(tile.value));
}

// Position with the compositor-friendly `translate`, not left/top (no layout)
function placeTile(el, r, c) {
  el.style.translate = `${tileLeft(c)}px ${tileTop(r)}px`;
}

function sizeTile(el) {
  const sz = tileSize();
  el.style.width  = sz + 'px';
  el.style.height = sz + 'px';
}

// ── Move computation (pure — does not touch DOM) ───────────────────────────────
//
// Returns { newPos, merges, moved, scoreAdd }
//   newPos  : Map<id, {r,c}> — final grid position for every tile
//   merges  : [{survivorId, removedId, newValue}]
//   moved   : boolean
//   scoreAdd: number

function getRC(dir, pri, sec) {
  switch (dir) {
    case 'left':  return [pri, sec];
    case 'right': return [pri, SIZE - 1 - sec];
    case 'up':    return [sec, pri];
    case 'down':  return [SIZE - 1 - sec, pri];
  }
}

function computeMove(dir) {
  // Build 2D grid of tile refs
  const g = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
  liveTiles.forEach(t => { g[t.r][t.c] = t; });

  const newPos = new Map();   // id -> {r,c}
  const merges = [];
  let scoreAdd = 0;
  let moved = false;

  for (let pri = 0; pri < SIZE; pri++) {
    // Extract this line in movement direction
    const line = [];
    for (let sec = 0; sec < SIZE; sec++) {
      const [r, c] = getRC(dir, pri, sec);
      line.push(g[r][c]);
    }

    // Slide: compact non-null, then merge adjacent equals
    const arr = line.filter(Boolean);
    const lineMerges = [];
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i].value === arr[i + 1].value) {
        lineMerges.push({ survivorId: arr[i].id, removedId: arr[i + 1].id, newValue: arr[i].value * 2 });
        arr.splice(i + 1, 1); // survivor stays in arr, removed is gone
      }
    }
    merges.push(...lineMerges);

    // Map survivors to new grid positions
    arr.forEach((tile, sec) => {
      const [r, c] = getRC(dir, pri, sec);
      newPos.set(tile.id, { r, c });
    });

    // Removed tiles animate to their survivor's destination
    lineMerges.forEach(m => {
      newPos.set(m.removedId, newPos.get(m.survivorId));
      scoreAdd += m.newValue;
    });

    // Detect movement
    line.forEach((tile, sec) => {
      if (!tile) return;
      const [r, c] = getRC(dir, pri, sec);
      const np = newPos.get(tile.id);
      if (np && (np.r !== tile.r || np.c !== tile.c)) moved = true;
    });
  }

  if (merges.length) moved = true;
  return { newPos, merges, moved, scoreAdd };
}

// ── Move execution ────────────────────────────────────────────────────────────
let queuedDir = null;
async function doMove(dir) {
  if (busy) { queuedDir = dir; return; }
  const { newPos, merges, moved, scoreAdd } = computeMove(dir);
  if (!moved) return;

  busy = true;

  // ① Slide every tile to its new position (CSS transition animates this)
  const removedIds = new Set(merges.map(m => m.removedId));
  liveTiles.forEach(t => {
    const p = newPos.get(t.id);
    if (!p) return;
    t.r = p.r; t.c = p.c;
    placeTile(t.el, t.r, t.c);
    // Tiles being consumed slide *under* their target
    if (removedIds.has(t.id)) t.el.style.zIndex = '0';
  });

  // ② Wait for slide to finish
  await pause(SLIDE_MS + 5);

  // ③ Apply merges: remove consumed tiles, update survivors, play pop
  merges.forEach(m => {

    const survivor = liveTiles.find(t => t.id === m.survivorId);
    if (survivor) {
      survivor.value = m.newValue;
      applyTileDisplay(survivor);
      survivor.el.style.zIndex = '';
      survivor.el.classList.remove('tile-pop');
      void survivor.el.offsetWidth; // force reflow so animation restarts
      survivor.el.classList.add('tile-pop');
      survivor.el.addEventListener('animationend', () => survivor.el.classList.remove('tile-pop'), { once: true });
    }

    const removed = liveTiles.find(t => t.id === m.removedId);
    if (removed) removed.el.remove();
  });
  liveTiles = liveTiles.filter(t => !removedIds.has(t.id));

  // One sound per swipe: a chime for a brand-new fruit, otherwise a soft pop
  if (merges.length) {
    const top = Math.max(...merges.map(m => m.newValue));
    const victoryNext = !celebrationShown && top >= 2048;   // fanfare plays instead
    if (!victoryNext) {
      if (top > highestThisGame && top >= 4) soundNewFruit(top);
      else soundMerge(top);
    }
    highestThisGame = Math.max(highestThisGame, top);
  }

  // ④ Update score
  if (scoreAdd) updateScore(scoreAdd);

  // ⑤ Spawn new tile in a random empty cell
  spawnTile();

  // ⑥ Win / lose checks
  if (!celebrationShown && liveTiles.some(t => t.value >= 2048)) {
    celebrationShown = true;
    await pause(280);
    showCelebration();
    busy = false;
    queuedDir = null;
    return;
  }
  if (!canMove()) {
    soundGameOver();
    await pause(400);
    showGameOver();
  }

  busy = false;
  if (queuedDir) { const d = queuedDir; queuedDir = null; doMove(d); }
}

// ── Game helpers ──────────────────────────────────────────────────────────────
function canMove() {
  if (liveTiles.length < SIZE * SIZE) return true;
  const g = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  liveTiles.forEach(t => { g[t.r][t.c] = t.value; });
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) {
      if (c < SIZE - 1 && g[r][c] === g[r][c + 1]) return true;
      if (r < SIZE - 1 && g[r][c] === g[r + 1][c]) return true;
    }
  return false;
}

function spawnTile() {
  const occupied = new Set(liveTiles.map(t => `${t.r},${t.c}`));
  const empty = [];
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      if (!occupied.has(`${r},${c}`)) empty.push([r, c]);
  if (!empty.length) return;

  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const value  = Math.random() < 0.9 ? 2 : 4;
  const id     = nextId++;
  const el     = makeTileEl(value, r, c);  // position set before append
  tilesEl.appendChild(el);

  // Spring-appear animation starts after layout
  requestAnimationFrame(() => {
    el.classList.add('tile-new');
    el.addEventListener('animationend', () => el.classList.remove('tile-new'), { once: true });
  });

  liveTiles.push({ id, value, r, c, el });
}

// Re-layout all tiles without animation (used on resize)
function relayout() {
  cachedTileSize = 0;
  liveTiles.forEach(t => {
    t.el.classList.add('no-anim');
    sizeTile(t.el);
    placeTile(t.el, t.r, t.c);
  });
  tilesEl.offsetHeight; // force reflow before removing class
  liveTiles.forEach(t => t.el.classList.remove('no-anim'));
}

// ── Score ─────────────────────────────────────────────────────────────────────
function updateScore(add) {
  score += add;
  const el = document.getElementById('score');
  el.textContent = score;
  el.classList.remove('score-bump');
  void el.offsetWidth;
  el.classList.add('score-bump');
  if (score > best) {
    best = score;
    localStorage.setItem('2048best', best);
    document.getElementById('best').textContent = best;
  }
}

// ── Overlays ──────────────────────────────────────────────────────────────────
function showCelebration() {
  soundVictory(); startConfetti();
  document.getElementById('celebration').classList.add('show');
}
function hideCelebration() {
  stopConfetti();
  document.getElementById('celebration').classList.remove('show');
}
function showGameOver() { document.getElementById('gameover').classList.add('show'); }
function hideGameOver() { document.getElementById('gameover').classList.remove('show'); }

// ── New game ──────────────────────────────────────────────────────────────────
function newGame() {
  hideCelebration(); hideGameOver();
  liveTiles.forEach(t => t.el.remove());
  liveTiles = [];
  score = 0; celebrationShown = false; busy = false; queuedDir = null; highestThisGame = 0;
  document.getElementById('score').textContent = '0';
  document.getElementById('best').textContent = best;
  spawnTile(); spawnTile();
}

// ── Input ─────────────────────────────────────────────────────────────────────
const KEY_MAP = {
  ArrowLeft:'left', ArrowRight:'right', ArrowUp:'up', ArrowDown:'down',
  a:'left', d:'right', w:'up', s:'down',
};
document.addEventListener('keydown', e => {
  const dir = KEY_MAP[e.key];
  if (dir) { e.preventDefault(); doMove(dir); }
});

// Swipe fires as soon as the finger has travelled far enough (not on release)
const SWIPE_PX = 24;
let tx = 0, ty = 0, swiped = false;
document.addEventListener('touchstart', e => {
  tx = e.touches[0].clientX; ty = e.touches[0].clientY; swiped = false;
}, { passive: true });
document.addEventListener('touchmove', e => {
  if (swiped) return;
  const dx = e.touches[0].clientX - tx;
  const dy = e.touches[0].clientY - ty;
  if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_PX) return;
  swiped = true;
  if (Math.abs(dx) > Math.abs(dy)) doMove(dx > 0 ? 'right' : 'left');
  else                             doMove(dy > 0 ? 'down'  : 'up');
}, { passive: true });

// ── Buttons ───────────────────────────────────────────────────────────────────
document.getElementById('newGameBtn').addEventListener('click', newGame);
document.getElementById('soundBtn').addEventListener('click', () => {
  soundOn = !soundOn;
  if (soundOn) unlockAudio();
  document.getElementById('soundBtn').textContent = soundOn ? '🔊' : '🔇';
  try { localStorage.setItem('2048sound', soundOn ? 'on' : 'off'); } catch (_) {}
});
document.getElementById('keepGoingBtn').addEventListener('click', hideCelebration);
document.getElementById('celebNewGameBtn').addEventListener('click', newGame);
document.getElementById('gameoverNewGameBtn').addEventListener('click', newGame);

window.addEventListener('resize', relayout);

// ── Start ─────────────────────────────────────────────────────────────────────
document.getElementById('best').textContent = best;
document.getElementById('soundBtn').textContent = soundOn ? '🔊' : '🔇';
newGame();

// Installable app: keep a copy on the phone so it works offline
if ('serviceWorker' in navigator && window.isSecureContext) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

'use strict';

const pause = ms => new Promise(r => setTimeout(r, ms));

// ── Audio ─────────────────────────────────────────────────────────────────────
let audioCtx = null;
let soundOn = true;

function getAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playTone(freq, type, duration, vol = 0.18, d = 0) {
  if (!soundOn) return;
  try {
    const ctx = getAudio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + d);
    gain.gain.setValueAtTime(0, ctx.currentTime + d);
    gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + d + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + d + duration);
    osc.start(ctx.currentTime + d);
    osc.stop(ctx.currentTime + d + duration + 0.05);
  } catch (_) {}
}

function soundSlide()        { playTone(220, 'sine', 0.07, 0.05); }
function soundMerge(value)   {
  const freq = 330 * Math.pow(1.12, Math.min(Math.log2(value) - 1, 12));
  playTone(freq,        'sine', 0.25, 0.14);
  playTone(freq * 1.5,  'sine', 0.18, 0.07, 0.04);
}
function soundGameOver()     { [220,196,174,164].forEach((f,i) => playTone(f,'triangle',0.35,0.12,i*0.15)); }
function soundVictory()      {
  [523,659,784,1047].forEach((f,i) => {
    playTone(f,        'sine', 0.4, 0.2,  i*0.14);
    playTone(f * 1.26, 'sine', 0.3, 0.1,  i*0.14 + 0.07);
  });
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
let busy = false;             // blocks input during slide+merge animation

const tilesEl = document.getElementById('tiles');

// ── Tile sizing helpers ───────────────────────────────────────────────────────
function tileSize() {
  const w = tilesEl.offsetWidth;
  return w > 0 ? (w - (SIZE - 1) * GAP) / SIZE : 80;
}
function tileLeft(c) { return c * (tileSize() + GAP); }
function tileTop(r)  { return r * (tileSize() + GAP); }

// ── DOM helpers ───────────────────────────────────────────────────────────────
function tileClass(value) { return 't' + Math.min(value, 8192); }

// Create element and set initial position BEFORE appending to DOM
// (so the CSS left/top transition doesn't fire on first placement)
function makeTileEl(value, r, c) {
  const el = document.createElement('div');
  el.className = `tile ${tileClass(value)}`;
  el.innerHTML = TILE_ART[value] || '';
  const sz = tileSize();
  el.style.cssText = `width:${sz}px;height:${sz}px;left:${tileLeft(c)}px;top:${tileTop(r)}px`;
  return el;
}

function applyTileDisplay(tile) {
  tile.el.className = `tile ${tileClass(tile.value)}`;
  tile.el.innerHTML = TILE_ART[tile.value] || '';
}

function placeTile(el, r, c) {
  el.style.left = tileLeft(c) + 'px';
  el.style.top  = tileTop(r)  + 'px';
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
async function doMove(dir) {
  if (busy) return;
  const { newPos, merges, moved, scoreAdd } = computeMove(dir);
  if (!moved) return;

  busy = true;
  soundSlide();

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
  await pause(SLIDE_MS + 20);

  // ③ Apply merges: remove consumed tiles, update survivors, play pop
  merges.forEach(m => {
    soundMerge(m.newValue);

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
    return;
  }
  if (!canMove()) {
    soundGameOver();
    await pause(400);
    showGameOver();
  }

  busy = false;
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
  score = 0; celebrationShown = false; busy = false;
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

let tx = 0, ty = 0;
document.addEventListener('touchstart', e => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
document.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - tx;
  const dy = e.changedTouches[0].clientY - ty;
  if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;
  if (Math.abs(dx) > Math.abs(dy)) doMove(dx > 0 ? 'right' : 'left');
  else                             doMove(dy > 0 ? 'down'  : 'up');
}, { passive: true });

// ── Buttons ───────────────────────────────────────────────────────────────────
document.getElementById('newGameBtn').addEventListener('click', newGame);
document.getElementById('soundBtn').addEventListener('click', () => {
  soundOn = !soundOn;
  document.getElementById('soundBtn').textContent = soundOn ? '🔊' : '🔇';
});
document.getElementById('keepGoingBtn').addEventListener('click', hideCelebration);
document.getElementById('celebNewGameBtn').addEventListener('click', newGame);
document.getElementById('gameoverNewGameBtn').addEventListener('click', newGame);

window.addEventListener('resize', relayout);

// ── Start ─────────────────────────────────────────────────────────────────────
document.getElementById('best').textContent = best;
newGame();

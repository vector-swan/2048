'use strict';

// ── Audio ────────────────────────────────────────────────────────────────────
let audioCtx = null;
let soundOn = true;

function getAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playTone(freq, type, duration, vol = 0.18, delay = 0) {
  if (!soundOn) return;
  try {
    const ctx = getAudio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
    gain.gain.setValueAtTime(0, ctx.currentTime + delay);
    gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + delay + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration + 0.05);
  } catch (e) { /* silently ignore */ }
}

function soundSlide() {
  playTone(220, 'sine', 0.07, 0.06);
}

function soundMerge(value) {
  // Higher merge = higher and brighter chime
  const base = 330;
  const steps = Math.log2(value) - 1;
  const freq = base * Math.pow(1.12, Math.min(steps, 12));
  playTone(freq, 'sine', 0.25, 0.14);
  playTone(freq * 1.5, 'sine', 0.18, 0.07, 0.04);
}

function soundGameOver() {
  [220, 196, 174, 164].forEach((f, i) => playTone(f, 'triangle', 0.35, 0.12, i * 0.15));
}

function soundVictory() {
  const melody = [523, 659, 784, 1047];
  melody.forEach((f, i) => {
    playTone(f, 'sine', 0.4, 0.2, i * 0.14);
    playTone(f * 1.26, 'sine', 0.3, 0.1, i * 0.14 + 0.07);
  });
}

// ── Confetti ─────────────────────────────────────────────────────────────────
const COLORS = ['#f9c74f','#f3722c','#90e0ef','#a8dadc','#c77dff','#b5e48c','#ff99c8'];

class ConfettiParticle {
  constructor(canvas) {
    this.reset(canvas);
    this.y = Math.random() * canvas.height; // start spread vertically
  }
  reset(canvas) {
    this.x = Math.random() * canvas.width;
    this.y = -20;
    this.w = 8 + Math.random() * 8;
    this.h = 4 + Math.random() * 6;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.vx = (Math.random() - 0.5) * 3;
    this.vy = 2 + Math.random() * 3;
    this.angle = Math.random() * Math.PI * 2;
    this.va = (Math.random() - 0.5) * 0.2;
  }
  update(canvas) {
    this.x += this.vx;
    this.y += this.vy;
    this.angle += this.va;
    if (this.y > canvas.height + 20) this.reset(canvas);
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

let confettiParticles = [];
let confettiAnim = null;

function startConfetti() {
  const canvas = document.getElementById('confetti');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  confettiParticles = Array.from({ length: 120 }, () => new ConfettiParticle(canvas));

  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettiParticles.forEach(p => { p.update(canvas); p.draw(ctx); });
    confettiAnim = requestAnimationFrame(frame);
  }
  cancelAnimationFrame(confettiAnim);
  frame();
}

function stopConfetti() {
  cancelAnimationFrame(confettiAnim);
  const canvas = document.getElementById('confetti');
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

// ── Game State ────────────────────────────────────────────────────────────────
const SIZE = 4;
let grid = [];          // 4x4 array of values (0 = empty)
let score = 0;
let best = parseInt(localStorage.getItem('2048best') || '0', 10);
let won = false;        // has reached 2048 this game
let celebrationShown = false;
let tileId = 0;
let tileMap = {};       // id -> {row, col, value, el, isNew, isMerge}

function newGrid() {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

function emptyCell(g) {
  const cells = [];
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      if (g[r][c] === 0) cells.push([r, c]);
  return cells;
}

function placeRandom(g) {
  const cells = emptyCell(g);
  if (!cells.length) return null;
  const [r, c] = cells[Math.floor(Math.random() * cells.length)];
  g[r][c] = Math.random() < 0.9 ? 2 : 4;
  return [r, c];
}

// ── Rendering ─────────────────────────────────────────────────────────────────
const tilesEl = document.getElementById('tiles');

function cellPx(idx) {
  // pixel offset for row/col idx within .tiles container
  const gap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gap')) || 10;
  const tileSize = tilesEl.offsetWidth / SIZE - gap + gap / SIZE;
  return idx * (tileSize + gap);
}

function renderAll() {
  tilesEl.innerHTML = '';
  tileMap = {};
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c]) {
        const id = ++tileId;
        const el = createTileEl(grid[r][c], r, c, false);
        tilesEl.appendChild(el);
        tileMap[id] = { r, c, value: grid[r][c], el };
      }
    }
  }
}

function createTileEl(value, r, c, isNew) {
  const el = document.createElement('div');
  el.className = `tile t${Math.min(value, 8192)} ${isNew ? 'tile-new' : ''}`;
  el.textContent = value;
  positionTile(el, r, c);
  return el;
}

function positionTile(el, r, c) {
  const gap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gap')) || 10;
  const size = tilesEl.offsetWidth / SIZE - gap + gap / SIZE;
  el.style.width  = size + 'px';
  el.style.height = size + 'px';
  el.style.left   = c * (size + gap) + 'px';
  el.style.top    = r * (size + gap) + 'px';
}

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

// ── Move Logic ────────────────────────────────────────────────────────────────
// Returns {newGrid, merges:[{r,c,value}], moved}
function slideRow(row) {
  let arr = row.filter(v => v !== 0);
  const merges = [];
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      merges.push({ value: arr[i] });
      arr.splice(i + 1, 1);
    }
  }
  while (arr.length < SIZE) arr.push(0);
  return { arr, merges };
}

function applyMove(direction) {
  const newG = newGrid();
  let moved = false;
  let totalMerges = [];

  const transform = {
    left:  (r, c) => [r, c],
    right: (r, c) => [r, SIZE - 1 - c],
    up:    (r, c) => [c, r],
    down:  (r, c) => [SIZE - 1 - c, r],
  }[direction];

  for (let r = 0; r < SIZE; r++) {
    const row = [];
    for (let c = 0; c < SIZE; c++) {
      const [gr, gc] = transform(r, c);
      row.push(grid[gr][gc]);
    }
    const { arr, merges } = slideRow(row);
    for (let c = 0; c < SIZE; c++) {
      const [gr, gc] = transform(r, c);
      if (newG[gr][gc] !== arr[c]) moved = true;
      newG[gr][gc] = arr[c];
    }
    totalMerges.push(...merges);
  }

  return { newG, merges: totalMerges, moved };
}

function hasMovesLeft(g) {
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) {
      if (g[r][c] === 0) return true;
      if (c < SIZE - 1 && g[r][c] === g[r][c + 1]) return true;
      if (r < SIZE - 1 && g[r][c] === g[r + 1][c]) return true;
    }
  return false;
}

function hasValue(g, v) {
  return g.some(row => row.includes(v));
}

// ── Move Execution ────────────────────────────────────────────────────────────
function move(direction) {
  const { newG, merges, moved } = applyMove(direction);
  if (!moved) return;

  soundSlide();
  grid = newG;

  // Spawn new tile
  const spawned = placeRandom(grid);

  // Score merges
  let scoreAdd = 0;
  merges.forEach(m => {
    scoreAdd += m.value;
    soundMerge(m.value);
  });
  if (scoreAdd) updateScore(scoreAdd);

  // Re-render (simple full re-render with animation)
  renderAll();

  // Check win
  if (!celebrationShown && hasValue(grid, 2048)) {
    celebrationShown = true;
    won = true;
    setTimeout(() => showCelebration(), 300);
    return;
  }

  // Check game over
  if (!hasMovesLeft(grid)) {
    soundGameOver();
    setTimeout(() => showGameOver(), 400);
  }
}

// ── Overlays ─────────────────────────────────────────────────────────────────
function showCelebration() {
  soundVictory();
  startConfetti();
  document.getElementById('celebration').classList.add('show');
}

function hideCelebration() {
  stopConfetti();
  document.getElementById('celebration').classList.remove('show');
}

function showGameOver() {
  document.getElementById('gameover').classList.add('show');
}

function hideGameOver() {
  document.getElementById('gameover').classList.remove('show');
}

// ── New Game ──────────────────────────────────────────────────────────────────
function newGame() {
  hideCelebration();
  hideGameOver();
  score = 0;
  won = false;
  celebrationShown = false;
  document.getElementById('score').textContent = '0';
  document.getElementById('best').textContent = best;
  grid = newGrid();
  placeRandom(grid);
  placeRandom(grid);
  renderAll();
}

// ── Input: Keyboard ───────────────────────────────────────────────────────────
const KEY_MAP = {
  ArrowLeft: 'left', ArrowRight: 'right',
  ArrowUp: 'up', ArrowDown: 'down',
  a: 'left', d: 'right', w: 'up', s: 'down',
};

document.addEventListener('keydown', e => {
  const dir = KEY_MAP[e.key];
  if (dir) { e.preventDefault(); move(dir); }
});

// ── Input: Touch ──────────────────────────────────────────────────────────────
let touchStartX = 0, touchStartY = 0;

document.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  const absDx = Math.abs(dx), absDy = Math.abs(dy);
  if (Math.max(absDx, absDy) < 20) return; // too short
  if (absDx > absDy) move(dx > 0 ? 'right' : 'left');
  else               move(dy > 0 ? 'down'  : 'up');
}, { passive: true });

// ── Buttons ───────────────────────────────────────────────────────────────────
document.getElementById('newGameBtn').addEventListener('click', newGame);

document.getElementById('soundBtn').addEventListener('click', () => {
  soundOn = !soundOn;
  document.getElementById('soundBtn').textContent = soundOn ? '🔊' : '🔇';
});

document.getElementById('keepGoingBtn').addEventListener('click', () => {
  hideCelebration();
});

document.getElementById('celebNewGameBtn').addEventListener('click', newGame);
document.getElementById('gameoverNewGameBtn').addEventListener('click', newGame);

// ── Resize ────────────────────────────────────────────────────────────────────
window.addEventListener('resize', () => renderAll());

// ── Init ──────────────────────────────────────────────────────────────────────
document.getElementById('best').textContent = best;
newGame();

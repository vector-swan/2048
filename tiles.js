'use strict';

// ── Tile illustrations: cute glowy bear-family story ──────────────────────────
// One subject per tile, large and centred, so it reads at ~80px:
//   2 sleepy bear · 4 scarf · 8 sapling · 16 berry basket · 32 cream bear
//   64 house · 128 mailbox · 256 cub · 512 cub on a swing · 1024 lantern
//   2048 the whole family · 4096 / 8192 the family, crowned
// Glow is done with gradients (no SVG filters) so sliding tiles stay smooth.

const INK  = '#6B3F6E';   // soft plum outlines
const FEAT = '#4A2A4C';   // eyes, nose, mouth
const BLUSH = '#FF8FB8';
const LW = 1.5;
const LN = `stroke="${INK}" stroke-width="${LW}" stroke-linejoin="round" stroke-linecap="round"`;

const PAL = {
  brown: { hi: '#F6C8A0', lo: '#DA9A6C', inner: '#FCDCC2', ear: '#CF8F62' },
  cream: { hi: '#FFF5E0', lo: '#F3D7A9', inner: '#FFF9F0', ear: '#EBCB9B' },
  cubA:  { hi: '#F0B691', lo: '#D18B62', inner: '#F9D2B4', ear: '#C27D56' },
  cubB:  { hi: '#FFF7E8', lo: '#F7DDB5', inner: '#FFFBF4', ear: '#EFD6AF' },
};

const BG = {
  2: '#FFE4F3', 4: '#FFD9EA', 8: '#FFEFC4', 16: '#E2F5CC', 32: '#FFF1DC',
  64: '#FFE0C4', 128: '#D4E9FF', 256: '#E6DBFF', 512: '#D5F0F2',
  1024: '#5B4AA6', 2048: '#3B2C6E', 4096: '#33265F', 8192: '#2B1F55',
};

// ── Small parts ───────────────────────────────────────────────────────────────
const star = (x, y, s, color = '#FFFFFF', o = 0.9) =>
  `<path d="M ${x},${y - s} Q ${x},${y} ${x + s},${y} Q ${x},${y} ${x},${y + s} Q ${x},${y} ${x - s},${y} Q ${x},${y} ${x},${y - s} Z" fill="${color}" opacity="${o}"/>`;

const heart = (x, y, s, color = '#FF6FA5') =>
  `<g transform="translate(${x},${y}) scale(${s})"><path d="M0,2.8 C-3.6,0 -3.6,-3.2 -1.7,-3.2 C-0.6,-3.2 0,-2.3 0,-1.7 C0,-2.3 0.6,-3.2 1.7,-3.2 C3.6,-3.2 3.6,0 0,2.8 Z" fill="${color}" stroke="${INK}" stroke-width="${0.9 / s}" stroke-linejoin="round"/><ellipse cx="-1.2" cy="-1.6" rx="0.7" ry="0.45" fill="white" opacity="0.8"/></g>`;

function backdrop(c, v, o = {}) {
  const dark = v >= 1024;
  const { hx = 50, hy = 52, hr = 44, color = dark ? '#FFE9A8' : '#FFFFFF', op = dark ? 0.35 : 0.75 } = o;
  c.defs += `<radialGradient id="${c.p}bg" cx="50%" cy="45%" r="70%"><stop offset="0" stop-color="#FFFFFF" stop-opacity="${dark ? 0.1 : 0.55}"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient>
<radialGradient id="${c.p}halo"><stop offset="0" stop-color="${color}" stop-opacity="${op}"/><stop offset="0.6" stop-color="${color}" stop-opacity="${op * 0.45}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>`;
  const sc = dark ? '#FFF6C4' : '#FFFFFF';
  return `<rect width="100" height="100" fill="${BG[v]}"/><rect width="100" height="100" fill="url(#${c.p}bg)"/>`
    + `<circle cx="${hx}" cy="${hy}" r="${hr}" fill="url(#${c.p}halo)"/>`
    + star(14, 80, 3, sc, 0.9) + star(88, 32, 2.4, sc, 0.85) + star(82, 86, 3.2, sc, 0.9) + star(20, 34, 2, sc, 0.75)
    + `<circle cx="10" cy="56" r="1.1" fill="${sc}" opacity="0.7"/><circle cx="92" cy="60" r="1.3" fill="${sc}" opacity="0.7"/><circle cx="70" cy="14" r="1" fill="${sc}" opacity="0.6"/>`;
}

function ground(c, cx, cy, rx) {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${rx * 0.14}" fill="#8A5A9A" opacity="0.16"/>`;
}

// A bear head (radius r) centred at (cx, cy)
function face(c, cx, cy, r, pal, o = {}) {
  const id = `${c.p}f${c.n++}`;
  c.defs += `<radialGradient id="${id}" cx="35%" cy="28%" r="85%"><stop offset="0" stop-color="${pal.hi}"/><stop offset="1" stop-color="${pal.lo}"/></radialGradient>
<linearGradient id="${id}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0.55" stop-color="${pal.lo}" stop-opacity="0"/><stop offset="1" stop-color="${pal.lo}" stop-opacity="0.6"/></linearGradient>`;
  let s = '';
  for (const sg of [-1, 1]) {
    s += `<circle cx="${cx + sg * r * 0.78}" cy="${cy - r * 0.72}" r="${r * 0.36}" fill="${pal.ear}" ${LN}/>`;
    s += `<circle cx="${cx + sg * r * 0.78}" cy="${cy - r * 0.68}" r="${r * 0.2}" fill="${pal.inner}"/>`;
  }
  s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id})" ${LN}/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id}s)"/>`;
  s += `<ellipse cx="${cx - r * 0.38}" cy="${cy - r * 0.55}" rx="${r * 0.3}" ry="${r * 0.15}" fill="white" opacity="0.4" transform="rotate(-28 ${cx - r * 0.38} ${cy - r * 0.55})"/>`;
  if (o.tuft) s += `<path d="M ${cx - r * 0.14},${cy - r * 0.97} q ${-r * 0.12},${-r * 0.3} ${r * 0.1},${-r * 0.36} q ${r * 0.14},${r * 0.14} ${r * 0.04},${r * 0.36}" fill="${pal.lo}" ${LN}/>`;
  // muzzle, nose, mouth
  s += `<ellipse cx="${cx}" cy="${cy + r * 0.36}" rx="${r * 0.46}" ry="${r * 0.33}" fill="${pal.inner}"/>`;
  s += `<ellipse cx="${cx}" cy="${cy + r * 0.2}" rx="${r * 0.16}" ry="${r * 0.11}" fill="${FEAT}"/>`;
  s += `<ellipse cx="${cx - r * 0.05}" cy="${cy + r * 0.17}" rx="${r * 0.05}" ry="${r * 0.03}" fill="white" opacity="0.8"/>`;
  s += `<path d="M ${cx},${cy + r * 0.3} L ${cx},${cy + r * 0.38} M ${cx - r * 0.17},${cy + r * 0.4} q ${r * 0.085},${r * 0.12} ${r * 0.17},0 q ${r * 0.085},${r * 0.12} ${r * 0.17},0" stroke="${FEAT}" stroke-width="${Math.max(1.1, r * 0.06)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  // eyes
  const ex = r * 0.42, ey = cy - r * 0.1, sw = Math.max(1.4, r * 0.085);
  for (const sg of [-1, 1]) {
    const x = cx + sg * ex;
    if (o.closed) {
      s += `<path d="M ${x - r * 0.15},${ey + r * 0.05} q ${r * 0.15},${-r * 0.24} ${r * 0.3},0" stroke="${FEAT}" stroke-width="${sw}" fill="none" stroke-linecap="round"/>`;
    } else if (o.sleepy) {
      s += `<path d="M ${x - r * 0.15},${ey} q ${r * 0.15},${r * 0.2} ${r * 0.3},0" stroke="${FEAT}" stroke-width="${sw}" fill="none" stroke-linecap="round"/>`;
      s += `<path d="M ${x + sg * r * 0.15},${ey + r * 0.02} l ${sg * r * 0.08},${-r * 0.06}" stroke="${FEAT}" stroke-width="${sw * 0.6}" stroke-linecap="round"/>`;
    } else {
      const er = r * (o.big ? 0.17 : 0.13);
      s += `<circle cx="${x}" cy="${ey}" r="${er}" fill="${FEAT}"/>`;
      s += `<circle cx="${x - er * 0.35}" cy="${ey - er * 0.38}" r="${er * 0.42}" fill="white"/>`;
      s += `<circle cx="${x + er * 0.4}" cy="${ey + er * 0.4}" r="${er * 0.2}" fill="white" opacity="0.85"/>`;
    }
  }
  s += `<ellipse cx="${cx - r * 0.62}" cy="${cy + r * 0.27}" rx="${r * 0.21}" ry="${r * 0.13}" fill="${BLUSH}" opacity="0.65"/>`;
  s += `<ellipse cx="${cx + r * 0.62}" cy="${cy + r * 0.27}" rx="${r * 0.21}" ry="${r * 0.13}" fill="${BLUSH}" opacity="0.65"/>`;
  if (o.bow) {
    const bx = cx + r * 0.78, by = cy - r * 1.02;
    s += `<g fill="#FF7FB8" ${LN}><ellipse cx="${bx - r * 0.25}" cy="${by}" rx="${r * 0.25}" ry="${r * 0.16}" transform="rotate(-20 ${bx - r * 0.25} ${by})"/><ellipse cx="${bx + r * 0.25}" cy="${by}" rx="${r * 0.25}" ry="${r * 0.16}" transform="rotate(20 ${bx + r * 0.25} ${by})"/></g>`;
    s += `<circle cx="${bx}" cy="${by}" r="${r * 0.11}" fill="#FF5FA5" ${LN}/><ellipse cx="${bx - r * 0.3}" cy="${by - r * 0.05}" rx="${r * 0.08}" ry="${r * 0.04}" fill="white" opacity="0.7"/>`;
  }
  if (o.scarf) {
    const y = cy + r * 0.86;
    s += `<rect x="${cx - r * 0.95}" y="${y}" width="${r * 1.9}" height="${r * 0.44}" rx="${r * 0.22}" fill="#FF6B7D" ${LN}/>`;
    s += `<rect x="${cx + r * 0.22}" y="${y + r * 0.22}" width="${r * 0.44}" height="${r * 0.95}" rx="${r * 0.14}" fill="#FF6B7D" ${LN}/>`;
    for (const k of [-0.55, -0.15]) s += `<rect x="${cx + k * r * 1.6}" y="${y + r * 0.04}" width="${r * 0.16}" height="${r * 0.36}" rx="${r * 0.06}" fill="white" opacity="0.45"/>`;
    s += `<rect x="${cx + r * 0.3}" y="${y + r * 0.7}" width="${r * 0.28}" height="${r * 0.12}" rx="${r * 0.05}" fill="white" opacity="0.45"/>`;
  }
  if (o.crown) {
    const y0 = cy - r * 0.9, w = r * 0.95, h = r * 0.6, g = `${c.p}cr${c.n++}`;
    c.defs += `<linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF08A"/><stop offset="1" stop-color="#FFC531"/></linearGradient>`;
    s += `<path d="M ${cx - w / 2},${y0} L ${cx - w / 2},${y0 - h} L ${cx - w / 6},${y0 - h * 0.45} L ${cx},${y0 - h} L ${cx + w / 6},${y0 - h * 0.45} L ${cx + w / 2},${y0 - h} L ${cx + w / 2},${y0} Z" fill="url(#${g})" ${LN}/>`;
    s += `<circle cx="${cx}" cy="${y0 - h * 0.95}" r="${r * 0.08}" fill="#FF5FA5"/><circle cx="${cx - w / 2}" cy="${y0 - h}" r="${r * 0.06}" fill="#7FE0FF"/><circle cx="${cx + w / 2}" cy="${y0 - h}" r="${r * 0.06}" fill="#7FE0FF"/>`;
  }
  return s;
}

function tile(v, build) {
  const c = { p: `t${v}`, n: 0, defs: '' };
  const body = build(c);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs>${c.defs}</defs>${body}</svg>`;
}

const grad = (c, id, a, b) => {
  c.defs += `<linearGradient id="${c.p}${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
  return `url(#${c.p}${id})`;
};
const rgrad = (c, id, a, b) => {
  c.defs += `<radialGradient id="${c.p}${id}" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></radialGradient>`;
  return `url(#${c.p}${id})`;
};

// ── Family scene (2048 and up) ────────────────────────────────────────────────
function family(c, v, o = {}) {
  let s = backdrop(c, v, { hy: 56, hr: 48, color: '#FFD98A', op: 0.45 });
  s += `<path d="M 84,15 a 8,8 0 1 0 7,11 a 6,6 0 1 1 -7,-11 Z" fill="#FFE98A" opacity="0.95"/>`;
  s += face(c, 32, 48, 17, PAL.brown, { closed: true, scarf: true, crown: o.crown });
  s += face(c, 70, 48, 17, PAL.cream, { closed: true, bow: true, crown: o.crown });
  s += face(c, 38, 79, 12, PAL.cubA, { closed: true, crown: o.crown });
  s += face(c, 63, 79, 12, PAL.cubB, { big: true, crown: o.crown });
  s += heart(51, 20, 1.5) + heart(51, 66, 1.1, '#FFB3D1');
  if (o.hearts) s += heart(14, 70, 1.1, '#FFB3D1') + heart(88, 70, 1.3) + heart(50, 92, 1) + star(50, 12, 4, '#FFF6C4');
  if (o.frame) {
    const g = grad(c, 'gold', '#FFF08A', '#FFB82E');
    s += `<rect x="1.8" y="1.8" width="96.4" height="96.4" rx="9" fill="none" stroke="${g}" stroke-width="3.2"/>`;
    s += star(92, 8, 4, '#FFF6C4') + star(8, 92, 3.4, '#FFF6C4');
  }
  return s;
}

// ── Tiles ─────────────────────────────────────────────────────────────────────
const TILE_ART = {

  // A sleepy bear, all alone.
  2: tile(2, c => backdrop(c, 2, { hy: 56 }) + ground(c, 50, 86, 26)
    + face(c, 50, 56, 29, PAL.brown, { sleepy: true })
    + `<g fill="none" stroke="#B58AD0" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M 80,22 h 7 l -7,8 h 7"/><path d="M 71,13 h 4.5 l -4.5,5.5 h 4.5"/></g>`),

  // A warm red scarf.
  4: tile(4, c => backdrop(c, 4, { hy: 52 }) + ground(c, 50, 90, 26)
    + face(c, 50, 48, 28, PAL.brown, { scarf: true })),

  // A sapling, freshly planted.
  8: tile(8, c => {
    const leaf = grad(c, 'l', '#B6F08E', '#5FC055'), dirt = grad(c, 'd', '#C79563', '#9C6E45');
    return backdrop(c, 8, { hy: 54 })
      + `<ellipse cx="50" cy="82" rx="28" ry="9" fill="${dirt}" ${LN}/><ellipse cx="42" cy="79" rx="8" ry="2.4" fill="white" opacity="0.25"/>`
      + `<path d="M 50,80 Q 48,62 50,44" fill="none" stroke="${INK}" stroke-width="5.4" stroke-linecap="round"/><path d="M 50,80 Q 48,62 50,44" fill="none" stroke="#5BAE50" stroke-width="3" stroke-linecap="round"/>`
      + `<path d="M 49,60 Q 20,58 22,36 Q 46,36 49,60 Z" fill="${leaf}" ${LN}/><path d="M 47,56 Q 34,52 27,41" fill="none" stroke="#3E8F43" stroke-width="1" opacity="0.6"/>`
      + `<path d="M 51,52 Q 80,50 78,26 Q 54,28 51,52 Z" fill="${leaf}" ${LN}/><path d="M 53,48 Q 66,44 73,31" fill="none" stroke="#3E8F43" stroke-width="1" opacity="0.6"/>`
      + `<path d="M 50,46 Q 40,34 50,18 Q 60,34 50,46 Z" fill="${leaf}" ${LN}/><path d="M 50,43 L 50,24" stroke="#3E8F43" stroke-width="1" opacity="0.6"/>`
      + `<ellipse cx="30" cy="42" rx="3" ry="1.4" fill="white" opacity="0.5" transform="rotate(-30 30 42)"/>`
      + `<g fill="#9ADBFF" stroke="${INK}" stroke-width="0.8"><path d="M 80,56 q -3,5 0,7 q 3,-2 0,-7 Z"/><path d="M 20,64 q -2.4,4 0,5.6 q 2.4,-1.6 0,-5.6 Z"/></g>`
      + star(78, 12, 3.5, '#FFF') + heart(26, 20, 1.1, '#FFB3D1');
  }),

  // A basket of berries.
  16: tile(16, c => {
    const wood = grad(c, 'w', '#E2A965', '#BC8048'), rim = grad(c, 'r', '#EDBB7A', '#CF9558');
    const berry = rgrad(c, 'b', '#FF8DA3', '#D92A58');
    const b = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${berry}" ${LN}/><ellipse cx="${x - r * 0.35}" cy="${y - r * 0.4}" rx="${r * 0.22}" ry="${r * 0.14}" fill="white" opacity="0.8"/>`;
    return backdrop(c, 16, { hy: 58 }) + ground(c, 50, 88, 30)
      + `<path d="M 28,52 Q 50,2 72,52" fill="none" stroke="${INK}" stroke-width="5.6" stroke-linecap="round"/><path d="M 28,52 Q 50,2 72,52" fill="none" stroke="#D49A5C" stroke-width="3" stroke-linecap="round"/>`
      + `<path d="M 19,50 L 81,50 L 74,84 Q 50,90 26,84 Z" fill="${wood}" ${LN}/>`
      + `<g fill="none" stroke="#A8703E" stroke-width="1" opacity="0.7"><path d="M 21,60 Q 50,67 79,60"/><path d="M 23,70 Q 50,77 77,70"/><path d="M 25,79 Q 50,85 75,79"/><path d="M 40,52 L 38,84 M 60,52 L 62,84"/></g>`
      + b(33, 46, 8) + b(67, 46, 8) + b(50, 42, 9) + b(41, 34, 7.5) + b(59, 34, 7.5)
      + `<path d="M 50,31 q 6,-8 13,-5 q -3,8 -13,5 Z" fill="#7ED36E" ${LN}/>`
      + `<rect x="15" y="46" width="70" height="9" rx="4.5" fill="${rim}" ${LN}/>`;
  }),

  // A second bear arrives, a cream one with a bow.
  32: tile(32, c => backdrop(c, 32, { hy: 54 }) + ground(c, 50, 90, 26)
    + face(c, 50, 52, 29, PAL.cream, { bow: true, closed: true })
    + heart(18, 28, 1.3) + heart(84, 22, 1)),

  // A little house of their own.
  64: tile(64, c => {
    const roof = grad(c, 'rf', '#FF9DB4', '#EE6A88'), wall = grad(c, 'wl', '#FFFBF2', '#FFEBD2'), pane = grad(c, 'pn', '#E6F6FF', '#A9D8F5');
    const win = x => `<rect x="${x}" y="56" width="11" height="11" rx="2" fill="${pane}" ${LN}/><path d="M ${x + 5.5},56 v 11 M ${x},61.5 h 11" stroke="${INK}" stroke-width="0.9"/>`;
    return backdrop(c, 64, { hy: 56 }) + ground(c, 50, 86, 36)
      + `<circle cx="22" cy="82" r="7" fill="#7ED36E" ${LN}/><circle cx="29" cy="85" r="5.4" fill="#92E080" ${LN}/>`
      + `<rect x="22" y="46" width="56" height="40" rx="3" fill="${wall}" ${LN}/>`
      + `<path d="M 13,51 L 50,17 L 87,51 Z" fill="${roof}" ${LN}/><path d="M 22,47 L 49,22" stroke="white" stroke-width="2.4" stroke-linecap="round" opacity="0.4"/>`
      + `<circle cx="50" cy="38" r="5.2" fill="${pane}" ${LN}/>`
      + win(27) + win(62)
      + `<rect x="43" y="62" width="14" height="24" rx="7" fill="#C98F5F" ${LN}/><circle cx="53.4" cy="75" r="1.4" fill="#FFE27A"/>`
      + `<circle cx="72" cy="85" r="2.4" fill="#FF8FB8" ${LN}/><circle cx="78" cy="86.5" r="2.4" fill="#FFD84A" ${LN}/>`
      + heart(84, 20, 1.2);
  }),

  // A mailbox: the house is now somewhere you get letters.
  128: tile(128, c => {
    const box = grad(c, 'bx', '#8DC3FF', '#5B93E6');
    return backdrop(c, 128, { hy: 52 })
      + `<ellipse cx="50" cy="88" rx="30" ry="5" fill="#9ADF8A" ${LN}/><path d="M 30,87 l 2,-6 l 2,6 M 68,87 l 2,-7 l 2,7" fill="none" stroke="#5FBF55" stroke-width="1.6" stroke-linecap="round"/>`
      + `<circle cx="27" cy="85" r="2.3" fill="#FF8FB8" ${LN}/><circle cx="74" cy="84" r="2.3" fill="#FFD84A" ${LN}/>`
      + `<rect x="47" y="52" width="6" height="36" rx="1.5" fill="#CF9A66" ${LN}/>`
      + `<g transform="rotate(-8 44 26)"><rect x="32" y="12" width="24" height="18" rx="2" fill="white" ${LN}/><path d="M 32,13 L 44,23 L 56,13" fill="none" stroke="${INK}" stroke-width="1.1" stroke-linejoin="round"/></g>`
      + `<rect x="22" y="28" width="56" height="28" rx="14" fill="${box}" ${LN}/><path d="M 30,34 q 20,-4 40,0" stroke="white" stroke-width="2.4" stroke-linecap="round" fill="none" opacity="0.5"/>`
      + `<path d="M 66,29 L 66,55" stroke="${INK}" stroke-width="1.3"/><circle cx="70.5" cy="42" r="1.7" fill="#FFE27A" ${LN}/><rect x="29" y="40" width="22" height="7" rx="3" fill="white" opacity="0.9" ${LN}/>`
      + `<rect x="74" y="12" width="3" height="22" fill="#FF6B7D" ${LN}/><rect x="77" y="12" width="11" height="8" rx="1.5" fill="#FF6B7D" ${LN}/>`
      + heart(17, 24, 1.1) + star(86, 56, 3.4);
  }),

  // A cub!
  256: tile(256, c => backdrop(c, 256, { hy: 56 }) + ground(c, 50, 88, 24)
    + face(c, 50, 57, 25, PAL.cubA, { tuft: true, big: true })
    + heart(20, 26, 1.4) + heart(82, 30, 1.1, '#FFB3D1') + star(80, 78, 3)),

  // The cub on a swing.
  512: tile(512, c => {
    const leaf = grad(c, 'l', '#B6F08E', '#5FC055'), seat = grad(c, 's', '#E2A965', '#BC8048');
    const lf = (x, y, rot) => `<ellipse cx="${x}" cy="${y}" rx="8" ry="4.2" transform="rotate(${rot} ${x} ${y})" fill="${leaf}" ${LN}/>`;
    return backdrop(c, 512, { hy: 52 })
      + `<path d="M 6,14 Q 50,2 94,14" fill="none" stroke="${INK}" stroke-width="6.4" stroke-linecap="round"/><path d="M 6,14 Q 50,2 94,14" fill="none" stroke="#B88454" stroke-width="3.8" stroke-linecap="round"/>`
      + lf(18, 20, 30) + lf(80, 19, -30) + lf(34, 9, -15) + lf(66, 8, 15)
      + `<path d="M 33,10 L 33,70 M 67,10 L 67,70" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/><path d="M 33,10 L 33,70 M 67,10 L 67,70" stroke="#E5C49A" stroke-width="1.5" stroke-linecap="round"/>`
      + `<ellipse cx="50" cy="66" rx="14" ry="12" fill="${PAL.cubB.lo}" ${LN}/>`
      + face(c, 50, 48, 18, PAL.cubB, { closed: true })
      + `<circle cx="34" cy="60" r="4.2" fill="${PAL.cubB.ear}" ${LN}/><circle cx="66" cy="60" r="4.2" fill="${PAL.cubB.ear}" ${LN}/>`
      + `<rect x="24" y="74" width="52" height="8" rx="4" fill="${seat}" ${LN}/>`
      + heart(14, 52, 1.2) + heart(88, 44, 1, '#FFB3D1') + star(84, 74, 3.2) + star(16, 82, 2.6);
  }),

  // Evening: the lantern is lit.
  1024: tile(1024, c => {
    const glass = grad(c, 'g', '#FFF6BF', '#FFC94D'), flame = grad(c, 'f', '#FFE27A', '#FF8A3D'), metal = grad(c, 'm', '#D3A06C', '#A8744A');
    const fly = (x, y) => `<circle cx="${x}" cy="${y}" r="4.5" fill="#FFF3A0" opacity="0.28"/><circle cx="${x}" cy="${y}" r="1.7" fill="#FFF8C9"/>`;
    return backdrop(c, 1024, { hy: 50, hr: 46, color: '#FFE08A', op: 0.55 })
      + `<path d="M 38,24 Q 50,0 62,24" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M 38,24 Q 50,0 62,24" fill="none" stroke="#E5B97E" stroke-width="2.6" stroke-linecap="round"/>`
      + `<path d="M 35,31 L 65,31 L 58,20 L 42,20 Z" fill="${metal}" ${LN}/><circle cx="50" cy="18" r="2.8" fill="${metal}" ${LN}/>`
      + `<path d="M 36,31 L 64,31 Q 71,52 64,74 L 36,74 Q 29,52 36,31 Z" fill="${glass}" ${LN}/>`
      + `<path d="M 44,31 Q 41,52 44,74 M 56,31 Q 59,52 56,74" stroke="${INK}" stroke-width="1" fill="none" opacity="0.55"/>`
      + `<path d="M 50,68 C 40,60 44,48 50,38 C 56,48 60,60 50,68 Z" fill="${flame}" ${LN}/><path d="M 50,65 C 46,60 47,54 50,49 C 53,54 54,60 50,65 Z" fill="#FFF8D0"/>`
      + `<path d="M 38,38 q -2,12 0,22" stroke="white" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.55"/>`
      + `<rect x="32" y="74" width="36" height="8" rx="3" fill="${metal}" ${LN}/>`
      + fly(18, 40) + fly(84, 52) + fly(76, 22) + fly(24, 72) + fly(82, 80);
  }),

  // Home at last: the whole family together.
  2048: tile(2048, c => family(c, 2048)),

  // Beyond 2048: the same family, crowned.
  4096: tile(4096, c => family(c, 4096, { crown: true, frame: true })),
  8192: tile(8192, c => family(c, 8192, { crown: true, frame: true, hearts: true })),

};

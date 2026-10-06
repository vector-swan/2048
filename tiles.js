'use strict';

// ── Tile illustrations ────────────────────────────────────────────────────────
// Art is grouped into themes (see THEMES at the bottom). Shared helpers come
// first, then the bear-family theme, then the fruit ladder.

// ── Bear family theme ─────────────────────────────────────────────────────────
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

// Backgrounds walk the rainbow: twilight blue at 2, slowly round to pink at 2048
const BG = {
  2: '#C9D5F6',     // twilight blue
  4: '#C8E4FA',     // sky blue
  8: '#C6EFEE',     // aqua
  16: '#D2F2D3',    // mint
  32: '#E5F4C4',    // spring green
  64: '#FFF2BC',    // butter yellow
  128: '#FFE3BC',   // apricot
  256: '#FFD7C4',   // peach
  512: '#FFCCC8',   // coral
  1024: '#FFCCDF',  // rose
  2048: '#FFBDDB',  // pink
  4096: '#FFB2D4', 8192: '#FFA6CC',
};

// ── Small parts ───────────────────────────────────────────────────────────────
const star = (x, y, s, color = '#FFFFFF', o = 0.9) =>
  `<path d="M ${x},${y - s} Q ${x},${y} ${x + s},${y} Q ${x},${y} ${x},${y + s} Q ${x},${y} ${x - s},${y} Q ${x},${y} ${x},${y - s} Z" fill="${color}" opacity="${o}"/>`;

const heart = (x, y, s, color = '#FF6FA5') =>
  `<g transform="translate(${x},${y}) scale(${s})"><path d="M0,2.8 C-3.6,0 -3.6,-3.2 -1.7,-3.2 C-0.6,-3.2 0,-2.3 0,-1.7 C0,-2.3 0.6,-3.2 1.7,-3.2 C3.6,-3.2 3.6,0 0,2.8 Z" fill="${color}" stroke="${INK}" stroke-width="${0.9 / s}" stroke-linejoin="round"/><ellipse cx="-1.2" cy="-1.6" rx="0.7" ry="0.45" fill="white" opacity="0.8"/></g>`;

function backdrop(c, v, o = {}) {
  const dark = false;
  const { hx = 50, hy = 52, hr = 44, color = dark ? '#FFE9A8' : '#FFFFFF', op = dark ? 0.35 : 0.75 } = o;
  c.defs += `<radialGradient id="${c.p}bg" cx="50%" cy="45%" r="70%"><stop offset="0" stop-color="#FFFFFF" stop-opacity="${dark ? 0.1 : 0.55}"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient>
<radialGradient id="${c.p}halo"><stop offset="0" stop-color="${color}" stop-opacity="${op}"/><stop offset="0.6" stop-color="${color}" stop-opacity="${op * 0.45}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>`;
  const sc = dark ? '#FFF6C4' : '#FFFFFF';
  return `<rect width="100" height="100" fill="${c.bg[v]}"/><rect width="100" height="100" fill="url(#${c.p}bg)"/>`
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

function tile(v, build, bg = BG, key = 'b') {
  const c = { p: `${key}${v}`, n: 0, defs: '', bg };
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
  let s = backdrop(c, v, { hy: 56, hr: 48 });
  s += face(c, 32, 48, 17, PAL.brown, { closed: true, scarf: true, crown: o.crown });
  s += face(c, 70, 48, 17, PAL.cream, { closed: true, bow: true, crown: o.crown });
  s += face(c, 38, 79, 12, PAL.cubA, { closed: true, crown: o.crown });
  s += face(c, 63, 79, 12, PAL.cubB, { big: true, crown: o.crown });
  s += heart(51, 20, 1.5) + heart(51, 66, 1.1, '#FFB3D1');
  if (o.hearts) s += heart(14, 70, 1.1, '#FFB3D1') + heart(88, 70, 1.3) + heart(50, 92, 1) + star(50, 10, 4, '#FFFFFF');
  if (o.frame) {
    const g = grad(c, 'gold', '#FFF08A', '#FFB82E');
    s += `<rect x="1.8" y="1.8" width="96.4" height="96.4" rx="9" fill="none" stroke="${g}" stroke-width="3.2"/>`;
    s += star(92, 8, 4, '#FFFFFF') + star(8, 92, 3.4, '#FFFFFF');
  }
  return s;
}

// ── Tiles ─────────────────────────────────────────────────────────────────────
const BEAR_ART = {

  // A sleepy bear, all alone.
  2: tile(2, c => backdrop(c, 2, { hy: 56 }) + ground(c, 50, 86, 26)
    + face(c, 50, 56, 29, PAL.brown, { sleepy: true })
    + `<circle cx="84" cy="16" r="13" fill="#FFF6C8" opacity="0.35"/><path d="M 82,7 a 9,9 0 1 0 9,13 a 7,7 0 1 1 -9,-13 Z" fill="#FFF3B0" stroke="${INK}" stroke-width="1" stroke-linejoin="round"/>`
    + star(60, 10, 2.4, '#FFFFFF') + star(94, 36, 2, '#FFFFFF')
    + `<g fill="none" stroke="#7C83C9" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M 66,20 h 6 l -6,7 h 6"/><path d="M 58,14 h 4 l -4,4.6 h 4"/></g>`),

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
    const fly = (x, y) => `<circle cx="${x}" cy="${y}" r="4.5" fill="#FFD25A" opacity="0.35"/><circle cx="${x}" cy="${y}" r="1.8" fill="#FFC531" stroke="${INK}" stroke-width="0.5"/>`;
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

// ── Fruit ladder theme ────────────────────────────────────────────────────────
// Bigger fruit = bigger number: cherry, strawberry, grape, lemon, orange, apple,
// peach, pear, pineapple, melon, watermelon, then golden watermelons.
// Backgrounds run purple → blue → green → yellow → orange → pink.

const FRUIT_BG = {
  2: '#E3D4FA', 4: '#D6DBFB', 8: '#CFE3FB', 16: '#CDEFF2', 32: '#D3F2D6',
  64: '#E6F4C6', 128: '#FFF3BC', 256: '#FFE3B8', 512: '#FFD4B4',
  1024: '#FFCFCB', 2048: '#FFC2DE', 4096: '#FFB4D6', 8192: '#FFA6CC',
};

// Kawaii face: s is roughly the fruit's radius
function kface(cx, cy, s, o = {}) {
  const ex = s * 0.36, er = Math.max(2, s * 0.115);
  let f = '';
  for (const sg of [-1, 1]) {
    const x = cx + sg * ex;
    if (o.wink && sg === 1) {
      f += `<path d="M ${x - er * 1.2},${cy + er * 0.3} q ${er * 1.2},${-er * 1.6} ${er * 2.4},0" stroke="${FEAT}" stroke-width="${er * 0.8}" fill="none" stroke-linecap="round"/>`;
    } else {
      f += `<circle cx="${x}" cy="${cy}" r="${er}" fill="${FEAT}"/><circle cx="${x - er * 0.35}" cy="${cy - er * 0.4}" r="${er * 0.42}" fill="white"/>`;
    }
  }
  f += `<path d="M ${cx - s * 0.12},${cy + s * 0.13} q ${s * 0.12},${s * 0.13} ${s * 0.24},0" stroke="${FEAT}" stroke-width="${Math.max(1.3, s * 0.065)}" fill="none" stroke-linecap="round"/>`;
  for (const sg of [-1, 1]) f += `<ellipse cx="${cx + sg * s * 0.56}" cy="${cy + s * 0.14}" rx="${s * 0.15}" ry="${s * 0.09}" fill="#FFB0C8" opacity="0.85"/>`;
  return f;
}

const shine = (x, y, rx, ry, rot = -30) =>
  `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(${rot} ${x} ${y})" fill="white" opacity="0.5"/>`;

const leafAt = (x, y, rot, len, fill) =>
  `<g transform="translate(${x},${y}) rotate(${rot})"><path d="M 0,0 Q ${len * 0.5},${-len * 0.42} ${len},0 Q ${len * 0.5},${len * 0.42} 0,0 Z" fill="${fill}" ${LN}/><path d="M ${len * 0.15},0 L ${len * 0.8},0" stroke="#3E8F43" stroke-width="0.8" opacity="0.6"/></g>`;

const stem = d =>
  `<path d="${d}" fill="none" stroke="${INK}" stroke-width="4.4" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#9A6A3E" stroke-width="2.2" stroke-linecap="round"/>`;

function crownAt(c, cx, y0, w, h) {
  const g = grad(c, `cr${c.n++}`, '#FFF08A', '#FFC531');
  return `<path d="M ${cx - w / 2},${y0} L ${cx - w / 2},${y0 - h} L ${cx - w / 6},${y0 - h * 0.45} L ${cx},${y0 - h} L ${cx + w / 6},${y0 - h * 0.45} L ${cx + w / 2},${y0 - h} L ${cx + w / 2},${y0} Z" fill="${g}" ${LN}/>`
    + `<circle cx="${cx}" cy="${y0 - h * 0.95}" r="1.8" fill="#FF5FA5"/><circle cx="${cx - w / 2}" cy="${y0 - h}" r="1.4" fill="#7FE0FF"/><circle cx="${cx + w / 2}" cy="${y0 - h}" r="1.4" fill="#7FE0FF"/>`;
}

const fruitTile = (v, build) => tile(v, build, FRUIT_BG, 'fr');

function watermelon(c, v, o = {}) {
  const gold = !!o.gold;
  const fruit = FRUIT_BODY.watermelon(c, gold);
  let s = backdrop(c, v, { hy: 58, hr: 46 }) + ground(c, 50, 92, 32)
    + fruit
    + `<ellipse cx="50" cy="62" rx="17" ry="11" fill="white" opacity="0.28"/>`
    + kface(50, 61, 30);
  if (gold) s += crownAt(c, 50, 25, 26, 14);
  if (o.frame) {
    const g = grad(c, 'gold', '#FFF08A', '#FFB82E');
    s += `<rect x="1.8" y="1.8" width="96.4" height="96.4" rx="9" fill="none" stroke="${g}" stroke-width="3.2"/>`
      + star(92, 8, 4) + star(8, 92, 3.4);
  }
  if (o.hearts) s += heart(14, 30, 1.2) + heart(86, 76, 1.3, '#FFB3D1') + star(88, 30, 3.4);
  return s;
}

// Fruit drawings without the tile background or face, in tile coordinates
// (100 × 100, centred around 50,58). The game tiles add a backdrop and face;
// the picnic basket places them, smaller, inside the basket.
const FRUIT_BODY = {
  grape(c) {
    const g = rgrad(c, 'g', '#D2AEFF', '#7B4FD0'), lf = grad(c, 'l', '#B6F08E', '#5FC055');
    const pts = [[34, 40], [50, 38], [66, 40], [36, 54], [50, 53], [64, 54], [42, 67], [58, 67], [50, 79]];
    return stem('M 50,32 Q 50,24 54,19') + leafAt(52, 25, -30, 18, lf)
      + pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="${g}" ${LN}/>` + shine(x - 3, y - 3.5, 2.4, 1.3)).join('');
  },
  lemon(c) {
    const y = grad(c, 'y', '#FFF6A6', '#FFD23F'), lf = grad(c, 'l', '#B6F08E', '#5FC055');
    return `<ellipse cx="23" cy="63" rx="5" ry="3.6" transform="rotate(-12 23 63)" fill="#FFD84A" ${LN}/><ellipse cx="77" cy="52" rx="5" ry="3.6" transform="rotate(-12 77 52)" fill="#FFD84A" ${LN}/>`
      + `<ellipse cx="50" cy="58" rx="28" ry="21" transform="rotate(-12 50 58)" fill="${y}" ${LN}/>`
      + shine(38, 47, 7, 3)
      + leafAt(64, 40, -40, 17, lf) + stem('M 62,41 q 1,-4 4,-6');
  },
  orange(c) {
    const o = rgrad(c, 'o', '#FFCB80', '#FF8A2A'), lf = grad(c, 'l', '#B6F08E', '#5FC055');
    const dots = [[36, 46], [62, 42], [70, 62], [32, 66], [56, 78], [44, 80], [68, 74]]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="0.9" fill="#D9661A" opacity="0.4"/>`).join('');
    return `<circle cx="50" cy="58" r="28" fill="${o}" ${LN}/>` + dots + shine(38, 44, 7, 3.4)
      + stem('M 50,31 q 0,-5 2,-7') + leafAt(51, 29, -25, 19, lf);
  },
  apple(c) {
    const r = rgrad(c, 'a', '#FF9A9A', '#DA2B3D'), lf = grad(c, 'l', '#B6F08E', '#5FC055');
    return `<path d="M 50,36 C 40,27 20,31 20,52 C 20,74 38,88 50,81 C 62,88 80,74 80,52 C 80,31 60,27 50,36 Z" fill="${r}" ${LN}/>`
      + shine(33, 45, 6, 3.4)
      + stem('M 50,38 Q 49,30 53,22') + leafAt(52, 30, -30, 19, lf);
  },
  pear(c) {
    const p = rgrad(c, 'pr', '#F2FBB0', '#A6D24E'), lf = grad(c, 'l', '#B6F08E', '#5FC055');
    return `<path d="M 50,26 C 41,26 39,37 39,44 C 28,50 24,63 28,73 C 33,86 67,86 72,73 C 76,63 72,50 61,44 C 61,37 59,26 50,26 Z" fill="${p}" ${LN}/>`
      + shine(38, 56, 5, 3)
      + stem('M 50,28 Q 50,19 54,14') + leafAt(53, 19, -20, 17, lf);
  },
  watermelon(c, gold = false) {
    const body = rgrad(c, 'wm', gold ? '#FFF6A8' : '#A6EC86', gold ? '#F2B32E' : '#43AE55');
    const clip = `${c.p}wmc`;
    c.defs += `<clipPath id="${clip}"><circle cx="50" cy="58" r="35"/></clipPath>`;
    let stripes = '';
    for (const x of [24, 37, 50, 63, 76]) {
      let d = `M ${x},18`;
      for (let y = 18; y < 98; y += 8) d += ` l 3,4 l -3,4`;
      stripes += `<path d="${d}" fill="none" stroke="${gold ? '#D98E1C' : '#2A8A40'}" stroke-width="3.6" stroke-linejoin="round" opacity="0.8"/>`;
    }
    return `<circle cx="50" cy="58" r="35" fill="${body}" ${LN}/>`
      + `<g clip-path="url(#${clip})">${stripes}</g>`
      + `<circle cx="50" cy="58" r="35" fill="none" ${LN}/>`
      + shine(36, 38, 9, 4.5)
      + stem('M 50,24 q 2,-7 8,-6');
  },
};

const FRUIT_ART = {

  // Cherries
  2: fruitTile(2, c => {
    const red = rgrad(c, 'r', '#FF8A9C', '#D61F4A'), lf = grad(c, 'l', '#B6F08E', '#5FC055');
    return backdrop(c, 2, { hy: 58 }) + ground(c, 50, 86, 26)
      + stem('M 50,24 Q 43,40 36,55') + stem('M 50,24 Q 58,40 64,53')
      + leafAt(50, 24, -25, 18, lf)
      + `<circle cx="36" cy="66" r="13" fill="${red}" ${LN}/>` + shine(31, 60, 3.6, 2)
      + `<circle cx="64" cy="64" r="13" fill="${red}" ${LN}/>` + shine(59, 58, 3.6, 2)
      + kface(36, 67, 13) + kface(64, 65, 13, { wink: true });
  }),

  // Strawberry
  4: fruitTile(4, c => {
    const red = rgrad(c, 'r', '#FF8A9C', '#E02A4E'), lf = grad(c, 'l', '#B6F08E', '#5FC055');
    const seeds = [[38, 45], [50, 43], [62, 45], [31, 54], [69, 54], [36, 68], [64, 68], [44, 74], [56, 74], [50, 80]]
      .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.2" ry="1.8" fill="#FFE27A"/>`).join('');
    return backdrop(c, 4, { hy: 58 }) + ground(c, 50, 88, 24)
      + `<path d="M 50,85 C 29,75 21,52 27,42 C 33,32 67,32 73,42 C 79,52 71,75 50,85 Z" fill="${red}" ${LN}/>`
      + seeds + shine(34, 46, 5, 2.6)
      + [150, 200, 340, 30, 90].map(r => leafAt(50, 36, r === 90 ? 180 + 90 : r, 13, lf)).join('')
      + stem('M 50,36 Q 51,29 55,24')
      + kface(50, 58, 26);
  }),

  // Grapes
  8: fruitTile(8, c => {
    const fruit = FRUIT_BODY.grape(c);
    return backdrop(c, 8, { hy: 58 }) + ground(c, 50, 90, 22) + fruit + kface(50, 54, 26);
  }),

  // Lemon
  16: fruitTile(16, c => {
    const fruit = FRUIT_BODY.lemon(c);
    return backdrop(c, 16, { hy: 58 }) + ground(c, 50, 86, 28) + fruit + kface(50, 59, 24);
  }),

  // Orange
  32: fruitTile(32, c => {
    const fruit = FRUIT_BODY.orange(c);
    return backdrop(c, 32, { hy: 58 }) + ground(c, 50, 88, 28) + fruit + kface(50, 60, 27);
  }),

  // Apple
  64: fruitTile(64, c => {
    const fruit = FRUIT_BODY.apple(c);
    return backdrop(c, 64, { hy: 58 }) + ground(c, 50, 88, 30) + fruit + kface(50, 59, 28);
  }),

  // Peach
  128: fruitTile(128, c => {
    const p = rgrad(c, 'p', '#FFE0B8', '#FF8F8A'), lf = grad(c, 'l', '#B6F08E', '#5FC055');
    return backdrop(c, 128, { hy: 58 }) + ground(c, 50, 88, 30)
      + `<path d="M 50,33 C 29,25 18,48 24,65 C 30,83 70,83 76,65 C 82,48 71,25 50,33 Z" fill="${p}" ${LN}/>`
      + `<path d="M 50,34 Q 36,46 34,66" fill="none" stroke="#E0706F" stroke-width="1.2" opacity="0.5" stroke-linecap="round"/>`
      + shine(36, 42, 6, 3)
      + leafAt(50, 32, -150, 16, lf) + leafAt(50, 32, -35, 19, lf)
      + kface(53, 60, 27);
  }),

  // Pear
  256: fruitTile(256, c => {
    const fruit = FRUIT_BODY.pear(c);
    return backdrop(c, 256, { hy: 58 }) + ground(c, 50, 90, 28) + fruit + kface(50, 66, 26);
  }),

  // Pineapple
  512: fruitTile(512, c => {
    const body = grad(c, 'pb', '#FFE98A', '#F2A93B'), lf = grad(c, 'l', '#9BE57E', '#3FA651');
    const clip = `${c.p}pc`;
    c.defs += `<clipPath id="${clip}"><ellipse cx="50" cy="64" rx="23" ry="24"/></clipPath>`;
    let hatch = '';
    for (let k = -50; k <= 50; k += 9) hatch += `<path d="M ${50 + k - 30},34 L ${50 + k + 30},94 M ${50 + k + 30},34 L ${50 + k - 30},94" stroke="#C98A2E" stroke-width="0.9" opacity="0.55"/>`;
    const spike = (tx, ty, w) => `<path d="M ${50 - w},44 Q ${(50 + tx) / 2 - w * 0.6},${(44 + ty) / 2} ${tx},${ty} Q ${(50 + tx) / 2 + w * 0.6},${(44 + ty) / 2} ${50 + w},44 Z" fill="${lf}" ${LN}/>`;
    return backdrop(c, 512, { hy: 58 }) + ground(c, 50, 90, 26)
      + spike(30, 24, 5) + spike(70, 24, 5) + spike(38, 12, 5) + spike(62, 12, 5) + spike(50, 6, 5.5)
      + `<ellipse cx="50" cy="64" rx="23" ry="24" fill="${body}" ${LN}/>`
      + `<g clip-path="url(#${clip})">${hatch}</g>`
      + `<ellipse cx="50" cy="64" rx="23" ry="24" fill="none" ${LN}/>`
      + shine(39, 50, 5, 2.6)
      + kface(50, 64, 25);
  }),

  // Melon
  1024: fruitTile(1024, c => {
    const m = rgrad(c, 'm', '#EEFBC0', '#A9D46A');
    const clip = `${c.p}mc`;
    c.defs += `<clipPath id="${clip}"><circle cx="50" cy="58" r="32"/></clipPath>`;
    let net = '';
    for (const x of [26, 38, 50, 62, 74]) net += `<path d="M ${x},22 Q ${x + 6},40 ${x},58 Q ${x - 6},76 ${x},94" fill="none" stroke="white" stroke-width="1.3" opacity="0.75"/>`;
    for (const y of [36, 48, 60, 72, 84]) net += `<path d="M 16,${y} Q 33,${y - 5} 50,${y} Q 67,${y + 5} 84,${y}" fill="none" stroke="white" stroke-width="1.3" opacity="0.75"/>`;
    return backdrop(c, 1024, { hy: 58, hr: 46 }) + ground(c, 50, 92, 30)
      + `<circle cx="50" cy="58" r="32" fill="${m}" ${LN}/>`
      + `<g clip-path="url(#${clip})">${net}</g>`
      + `<circle cx="50" cy="58" r="32" fill="none" ${LN}/>`
      + `<path d="M 43,27 L 57,27 M 50,27 L 50,21" stroke="${INK}" stroke-width="4.6" stroke-linecap="round"/><path d="M 43,27 L 57,27 M 50,27 L 50,21" stroke="#9A6A3E" stroke-width="2.4" stroke-linecap="round"/>`
      + shine(37, 41, 8, 4)
      + `<ellipse cx="50" cy="63" rx="16" ry="10" fill="white" opacity="0.3"/>`
      + kface(50, 62, 28);
  }),

  // Watermelon, then golden watermelons beyond 2048
  2048: fruitTile(2048, c => watermelon(c, 2048)),
  4096: fruitTile(4096, c => watermelon(c, 4096, { gold: true, frame: true })),
  8192: fruitTile(8192, c => watermelon(c, 8192, { gold: true, frame: true, hearts: true })),

};

// ── Themes ────────────────────────────────────────────────────────────────────
const THEMES = {
  fruit: { name: 'Fruit', art: FRUIT_ART },
  bears: { name: 'Bear family', art: BEAR_ART },
};
const ACTIVE_THEME = 'fruit';
const TILE_ART = THEMES[ACTIVE_THEME].art;

// ── Picnic basket (app icon and game-over card) ───────────────────────────────
// A round wicker fruit basket with a tall arched handle,
// twisted rope rim and scalloped weave. Fruit sits low so the handle shows:
// a watermelon in the middle with an apple and grapes either side, drawn with
// the game's own fruit art (FRUIT_BODY), without faces, slightly tilted.
// background=true adds the gingham cloth (used for the app icon);
// opts.empty draws it with no fruit; opts.blanket sets it on a gingham picnic
// blanket and opts.ants adds a little ant (all used on the game-over card).
function picnicBasketSVG(background = false, opts = {}) {
  const c = { p: (background ? 'pbi' : 'pb') + (opts.empty ? 'e' : ''), n: 0, defs: '', bg: {} };
  const P = c.p;
  const wood = grad(c, 'w', '#E2A866', '#B9783F'), rimG = grad(c, 'r', '#EDBB7A', '#C98A4E');
  const handleG = grad(c, 'h', '#E8B474', '#C48546');
  const body = 'M 12,67 L 15,86 Q 16,91 22,91 L 78,91 Q 84,91 85,86 L 88,67 Z';   // flat bottom, small rounded corners
  c.defs += `<clipPath id="${P}bc"><path d="${body}"/></clipPath>`;
  if (background) c.defs += `<pattern id="${P}gh" width="20" height="20" patternUnits="userSpaceOnUse"><rect width="20" height="20" fill="#FFF8EC"/><rect width="10" height="20" fill="#FF7891" opacity="0.22"/><rect width="20" height="10" fill="#FF7891" opacity="0.22"/></pattern>`;

  let s = '';
  if (background || opts.blanket) s += `<ellipse cx="50" cy="92" rx="36" ry="4" fill="#A06A3A" opacity="0.2"/>`;

  // tall arched handle (behind the fruit)
  const arch = 'M 16,66 C 14,4 86,4 84,66';
  s += `<path d="${arch}" fill="none" stroke="${INK}" stroke-width="7.4" stroke-linecap="round"/><path d="${arch}" fill="none" stroke="${handleG}" stroke-width="4.4" stroke-linecap="round"/>`;

  // fruit: the game's own fruit drawings (no faces), placed smaller in the
  // basket. Outlines are thickened so they match the basket's line weight.
  const place = (draw, x, y, k, tilt = 0) => {
    const part = draw(c)
      .split(LN).join(`stroke="${INK}" stroke-width="${(LW / k).toFixed(2)}" stroke-linejoin="round" stroke-linecap="round"`)
      .replace(/stroke-width="4\.4"/g, `stroke-width="${(2.6 + LW * 2 / k).toFixed(2)}"`)
      .replace(/stroke-width="2\.2"/g, 'stroke-width="2.6"');
    return `<g transform="translate(${(x - 50 * k).toFixed(2)},${(y - 58 * k).toFixed(2)}) scale(${k}) rotate(${tilt} 50 58)">${part}</g>`;
  };
  if (!opts.empty) {
    // three fruit, each tilted a little so they look naturally tossed in
    s += place(FRUIT_BODY.watermelon, 50, 52, 0.5, -10);
    s += place(FRUIT_BODY.apple, 29, 59, 0.44, -16);
    s += place(FRUIT_BODY.grape, 71, 59, 0.42, 18);
  }

  // basket body with scalloped weave rows
  let weave = '';
  [[74, 0], [80, 4], [86, 0]].forEach(([y, off]) => { for (let x = 10 + off; x < 92; x += 8) weave += `<path d="M ${x},${y} q 3,2.6 6,0" fill="none" stroke="#8E5A2E" stroke-width="1.6" stroke-linecap="round" opacity="0.55"/>`; });
  s += `<path d="${body}" fill="${wood}" ${LN}/><g clip-path="url(#${P}bc)">${weave}</g><path d="${body}" fill="none" ${LN}/>`;

  // twisted rope rim
  s += `<rect x="9" y="62" width="82" height="9" rx="4.5" fill="${rimG}" ${LN}/>`;
  for (let x = 13; x < 88; x += 5) s += `<path d="M ${x},63.5 q 3.4,3 1.6,6" fill="none" stroke="#9A6233" stroke-width="1.4" stroke-linecap="round" opacity="0.7"/>`;
  s += `<path d="M 13,64 L 87,64" stroke="white" stroke-width="1.1" stroke-linecap="round" opacity="0.4"/>`;


  if (opts.ants) {
    // a little ant on the blanket (game over: the basket is empty)
    const ant = (x, y, rot, carry) => {
      let a = `<g transform="translate(${x},${y}) rotate(${rot}) scale(1.6)">`;
      a += `<g stroke="${INK}" stroke-width="0.7" stroke-linecap="round" fill="none">`
        + `<path d="M 0.5,0 l -1.6,2.6 M 0.5,0 l 0.4,3 M 0.5,0 l 2,2.6 M 0.5,0 l -1.6,-2.6 M 0.5,0 l 0.4,-3 M 0.5,0 l 2,-2.6"/>`
        + `<path d="M 3.6,-0.6 q 1.4,-2.2 2.8,-2.2 M 3.6,0.6 q 1.4,2.2 2.8,2.2"/></g>`;
      a += `<ellipse cx="-2.4" cy="0" rx="2.6" ry="2" fill="#4A2A4C"/><circle cx="0.6" cy="0" r="1.3" fill="#4A2A4C"/><circle cx="3.4" cy="0" r="1.6" fill="#4A2A4C"/>`;
      a += `<circle cx="3.9" cy="-0.5" r="0.45" fill="white"/>`;
      if (carry) a += `<circle cx="0.4" cy="-3.4" r="2.6" fill="#9B6BE0" ${LN.replace('stroke-width="1.5"', 'stroke-width="0.7"')}/><circle cx="-0.3" cy="-4.1" r="0.7" fill="white" opacity="0.7"/>`;
      return a + '</g>';
    };
    var ants = ant(18, 92, -6, false);
  }
  if (opts.blanket) {
    // set the basket (a little smaller) on a gingham picnic blanket
    c.defs += `<pattern id="${P}bl" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#FFFFFF"/><rect width="4" height="8" fill="#FF5D7E" opacity="0.45"/><rect width="8" height="4" fill="#FF5D7E" opacity="0.45"/></pattern>`;
    const blanket = `<rect x="6" y="64" width="88" height="34" rx="2" fill="url(#${P}bl)" ${LN}/>`;
    s = blanket + `<g transform="translate(50 88) scale(0.8) translate(-50 -91)">${s}</g>` + (opts.ants ? ants : '');
  } else if (opts.ants) {
    s += ants;
  }

  // on the app icon, zoom the basket in slightly so it fills more of the square
  if (background) s = `<rect width="100" height="100" fill="url(#${P}gh)"/><g transform="translate(50 50) scale(1.06) translate(-50 -50)">${s}</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs>${c.defs}</defs>${s}</svg>`;
}

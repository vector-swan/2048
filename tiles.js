'use strict';

// ── Tile illustrations ────────────────────────────────────────────────────────
// Every tile is built from the same small set of SVG parts so the story reads
// as one continuous scene: a lone bear (2) slowly gathers props, a partner,
// a house and cubs until the whole family is together at 2048.
// Props earned on one tile stay on every later tile; the sky moves from dawn
// to night as values climb.

const BROWN = { fur: '#D4956A', inner: '#EBA882', ear: '#B87850' };
const CREAM = { fur: '#F2D3A4', inner: '#FBE8CC', ear: '#DDB585' };
const CUB_A = { fur: '#C88A62', inner: '#E8B592', ear: '#A86F48' };
const CUB_B = { fur: '#F7E1BE', inner: '#FFF2DE', ear: '#E4C297' };
const INK = '#1A0A06';

// Sky & ground palettes, dawn → night
const SKIES = {
  2:    { top: '#FBE3F1', bot: '#F6CCE6', ground: '#C9E8B0' },
  4:    { top: '#FFE1EE', bot: '#FFD0DE', ground: '#BFE6A6' },
  8:    { top: '#E6EEFF', bot: '#D5E1FF', ground: '#B6E39E' },
  16:   { top: '#C8E6FF', bot: '#B2D9FF', ground: '#ABE096' },
  32:   { top: '#BFE4FF', bot: '#CDEBFF', ground: '#A6DD91' },
  64:   { top: '#FFF0B8', bot: '#FFE090', ground: '#A3D68C' },
  128:  { top: '#FFDE9C', bot: '#FFC878', ground: '#9ECC84' },
  256:  { top: '#FFB885', bot: '#FF8E6E', ground: '#8DBB78' },
  512:  { top: '#D78AA0', bot: '#B86AA0', ground: '#6FA270' },
  1024: { top: '#6A5AA8', bot: '#4A4290', ground: '#4E7F60' },
  2048: { top: '#1E1A4C', bot: '#0E0C30', ground: '#2E5A4E' },
  4096: { top: '#1A1444', bot: '#0C0A2A', ground: '#2A5248' },
  8192: { top: '#160F3E', bot: '#090724', ground: '#264C42' },
};

const uid = (() => { let n = 0; return p => `${p}${++n}`; })();

// ── Parts ─────────────────────────────────────────────────────────────────────
function sky(v) {
  const s = SKIES[v]; const id = uid('sky');
  return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
<stop offset="0%" stop-color="${s.top}"/><stop offset="100%" stop-color="${s.bot}"/></linearGradient></defs>
<rect width="100" height="100" fill="url(#${id})"/>`;
}

function ground(v, y = 76) {
  return `<ellipse cx="50" cy="${y + 30}" rx="78" ry="34" fill="${SKIES[v].ground}"/>`;
}

function sparkles(pts, o = 0.6) {
  return pts.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="white" opacity="${o}"/>`).join('');
}

function sun(x, y, r) {
  return `<circle cx="${x}" cy="${y}" r="${r * 1.6}" fill="#FFE860" opacity="0.25"/><circle cx="${x}" cy="${y}" r="${r}" fill="#FFD740"/>`;
}

function cloud(x, y, s) {
  return `<g fill="white" opacity="0.9"><ellipse cx="${x}" cy="${y}" rx="${7 * s}" ry="${3.6 * s}"/>
<circle cx="${x - 3 * s}" cy="${y - 1.5 * s}" r="${3.2 * s}"/><circle cx="${x + 2 * s}" cy="${y - 2.4 * s}" r="${4 * s}"/></g>`;
}

function moon(x, y, r) {
  const id = uid('moon');
  return `<defs><mask id="${id}"><circle cx="${x}" cy="${y}" r="${r}" fill="white"/><circle cx="${x + r * 0.55}" cy="${y - r * 0.3}" r="${r * 0.85}" fill="black"/></mask></defs>
<circle cx="${x}" cy="${y}" r="${r * 1.5}" fill="#FFE870" opacity="0.15"/><circle cx="${x}" cy="${y}" r="${r}" fill="#FFE870" mask="url(#${id})"/>`;
}

function stars(seed = 1) {
  const pts = [[8,6,1.3],[22,13,0.9],[38,5,1.2],[52,11,0.8],[66,4,1.3],[80,9,1],[93,5,1.2],[14,22,0.7],[46,20,0.8],[74,18,0.7],[90,20,0.9],[30,27,0.6],[60,26,0.6]];
  return pts.map(([x, y, r], i) => `<circle cx="${(x + seed * 3) % 100}" cy="${y}" r="${r}" fill="white" opacity="${0.6 + ((i * 7) % 4) * 0.1}"/>`).join('');
}

function heart(x, y, s, color = '#FF6FA5') {
  return `<path transform="translate(${x},${y}) scale(${s})" d="M0,2.6 C-3.4,0 -3.4,-3 -1.6,-3 C-0.6,-3 0,-2.2 0,-1.6 C0,-2.2 0.6,-3 1.6,-3 C3.4,-3 3.4,0 0,2.6 Z" fill="${color}"/>`;
}

// A bear standing with its feet at (cx, feetY). r is the head radius.
function bear(cx, feetY, r, pal, o = {}) {
  const hy = feetY - r * 2.35;            // head centre
  const by = feetY - r * 0.95;            // body centre
  const ry = hy + r * 0.38;               // muzzle y
  let out = '';
  // body + feet + arms
  out += `<ellipse cx="${cx}" cy="${by}" rx="${r * 0.95}" ry="${r * 1.05}" fill="${pal.fur}"/>`;
  out += `<ellipse cx="${cx}" cy="${by + r * 0.12}" rx="${r * 0.52}" ry="${r * 0.62}" fill="${pal.inner}"/>`;
  out += `<ellipse cx="${cx - r * 0.55}" cy="${feetY - r * 0.1}" rx="${r * 0.38}" ry="${r * 0.22}" fill="${pal.ear}"/>`;
  out += `<ellipse cx="${cx + r * 0.55}" cy="${feetY - r * 0.1}" rx="${r * 0.38}" ry="${r * 0.22}" fill="${pal.ear}"/>`;
  const armDx = o.hug ? r * 1.15 : r * 0.95;
  out += `<circle cx="${cx - armDx}" cy="${by - r * 0.2}" r="${r * 0.32}" fill="${pal.fur}"/>`;
  out += `<circle cx="${cx + armDx}" cy="${by - r * 0.2}" r="${r * 0.32}" fill="${pal.fur}"/>`;
  // scarf
  if (o.scarf) {
    out += `<rect x="${cx - r * 0.85}" y="${hy + r * 0.78}" width="${r * 1.7}" height="${r * 0.36}" rx="${r * 0.18}" fill="#E8484F"/>`;
    out += `<rect x="${cx + r * 0.25}" y="${hy + r * 0.95}" width="${r * 0.36}" height="${r * 0.75}" rx="${r * 0.12}" fill="#E8484F"/>`;
  }
  // ears
  for (const sgn of [-1, 1]) {
    out += `<circle cx="${cx + sgn * r * 0.74}" cy="${hy - r * 0.68}" r="${r * 0.38}" fill="${pal.ear}"/>`;
    out += `<circle cx="${cx + sgn * r * 0.74}" cy="${hy - r * 0.62}" r="${r * 0.22}" fill="${pal.inner}"/>`;
  }
  // head
  out += `<circle cx="${cx}" cy="${hy}" r="${r}" fill="${pal.fur}"/>`;
  out += `<ellipse cx="${cx}" cy="${ry}" rx="${r * 0.46}" ry="${r * 0.33}" fill="${pal.inner}"/>`;
  out += `<ellipse cx="${cx}" cy="${ry - r * 0.16}" rx="${r * 0.15}" ry="${r * 0.1}" fill="${INK}"/>`;
  out += `<path d="M ${cx - r * 0.1},${ry + r * 0.05} q ${r * 0.1},${r * 0.1} ${r * 0.2},0" stroke="${INK}" stroke-width="${r * 0.06}" fill="none" stroke-linecap="round"/>`;
  // eyes
  const ex = r * 0.42, ey = hy - r * 0.08;
  if (o.closed) {
    for (const sgn of [-1, 1])
      out += `<path d="M ${cx + sgn * ex - r * 0.14},${ey + r * 0.04} q ${r * 0.14},${-r * 0.2} ${r * 0.28},0" stroke="${INK}" stroke-width="${r * 0.09}" fill="none" stroke-linecap="round"/>`;
  } else {
    for (const sgn of [-1, 1]) {
      out += `<circle cx="${cx + sgn * ex}" cy="${ey}" r="${r * 0.11}" fill="${INK}"/>`;
      out += `<circle cx="${cx + sgn * ex - r * 0.04}" cy="${ey - r * 0.04}" r="${r * 0.04}" fill="white"/>`;
    }
  }
  // blush
  out += `<ellipse cx="${cx - r * 0.6}" cy="${hy + r * 0.22}" rx="${r * 0.2}" ry="${r * 0.12}" fill="#FFB0C0" opacity="0.6"/>`;
  out += `<ellipse cx="${cx + r * 0.6}" cy="${hy + r * 0.22}" rx="${r * 0.2}" ry="${r * 0.12}" fill="#FFB0C0" opacity="0.6"/>`;
  // bow on the cream bear's ear
  if (o.bow) {
    const bx = cx + r * 0.74, byy = hy - r * 0.95;
    out += `<g fill="#FF7FB0"><ellipse cx="${bx - r * 0.22}" cy="${byy}" rx="${r * 0.22}" ry="${r * 0.14}"/><ellipse cx="${bx + r * 0.22}" cy="${byy}" rx="${r * 0.22}" ry="${r * 0.14}"/><circle cx="${bx}" cy="${byy}" r="${r * 0.09}" fill="#E8508A"/></g>`;
  }
  // crown
  if (o.crown) {
    const cy0 = hy - r * 0.9, w = r * 0.8, h = r * 0.5;
    out += `<path d="M ${cx - w / 2},${cy0} L ${cx - w / 2},${cy0 - h} L ${cx - w / 6},${cy0 - h * 0.45} L ${cx},${cy0 - h} L ${cx + w / 6},${cy0 - h * 0.45} L ${cx + w / 2},${cy0 - h} L ${cx + w / 2},${cy0} Z" fill="#FFD700" stroke="#C9A000" stroke-width="${r * 0.05}"/>`;
    out += `<circle cx="${cx}" cy="${cy0 - h * 0.95}" r="${r * 0.08}" fill="#FF5599"/>`;
  }
  // held items
  if (o.flowers) {
    const fx = cx + r * 1.0, fy = by - r * 0.3;
    out += `<g stroke="#5DA85D" stroke-width="${r * 0.08}"><line x1="${fx}" y1="${fy + r * 0.5}" x2="${fx - r * 0.25}" y2="${fy - r * 0.25}"/><line x1="${fx}" y1="${fy + r * 0.5}" x2="${fx + r * 0.2}" y2="${fy - r * 0.3}"/><line x1="${fx}" y1="${fy + r * 0.5}" x2="${fx}" y2="${fy - r * 0.45}"/></g>`;
    for (const [dx, dy, c] of [[-0.25, -0.3, '#FF7FB0'], [0.2, -0.35, '#FFD84A'], [0, -0.5, '#FFFFFF']])
      out += `<circle cx="${fx + dx * r}" cy="${fy + dy * r}" r="${r * 0.14}" fill="${c}"/><circle cx="${fx + dx * r}" cy="${fy + dy * r}" r="${r * 0.05}" fill="#FFB347"/>`;
  }
  return out;
}

function basket(x, y, s = 1) {
  return `<g transform="translate(${x},${y}) scale(${s})">
<path d="M-5,0 L5,0 L4,6 L-4,6 Z" fill="#C98B52"/><path d="M-5,0 L5,0 L4,6 L-4,6 Z" fill="none" stroke="#A86F3C" stroke-width="0.7"/>
<path d="M-3,0 q3,-6 6,0" fill="none" stroke="#A86F3C" stroke-width="1"/>
<circle cx="-2.5" cy="-0.6" r="1.4" fill="#E8365D"/><circle cx="0.2" cy="-1.2" r="1.4" fill="#C8205D"/><circle cx="2.6" cy="-0.5" r="1.4" fill="#E8365D"/></g>`;
}

// Tree stages: 0 sapling, 1 small, 2 medium, 3 full
function tree(x, baseY, stage, o = {}) {
  if (stage === 0) {
    return `<rect x="${x - 0.5}" y="${baseY - 9}" width="1.2" height="9" fill="#8A6A48"/>
<ellipse cx="${x - 2.5}" cy="${baseY - 8}" rx="2.8" ry="1.6" transform="rotate(-30 ${x - 2.5} ${baseY - 8})" fill="#7CC86E"/>
<ellipse cx="${x + 2.5}" cy="${baseY - 6.5}" rx="2.8" ry="1.6" transform="rotate(30 ${x + 2.5} ${baseY - 6.5})" fill="#7CC86E"/>
<ellipse cx="${x}" cy="${baseY}" rx="3.5" ry="1.2" fill="#A07050" opacity="0.5"/>`;
  }
  const h = [0, 14, 20, 28][stage], R = [0, 6, 9, 13][stage];
  const cy = baseY - h;
  let out = `<rect x="${x - R * 0.14}" y="${cy}" width="${R * 0.28}" height="${h}" fill="#8A6A48"/>`;
  out += `<circle cx="${x}" cy="${cy}" r="${R}" fill="#6DBE62"/><circle cx="${x - R * 0.5}" cy="${cy + R * 0.35}" r="${R * 0.72}" fill="#6DBE62"/><circle cx="${x + R * 0.5}" cy="${cy + R * 0.35}" r="${R * 0.72}" fill="#6DBE62"/>`;
  out += `<circle cx="${x - R * 0.3}" cy="${cy - R * 0.3}" r="${R * 0.45}" fill="#85D077"/>`;
  if (o.swing) {
    const sx = x + R * 0.1, sy = cy + R * 0.9, len = baseY - sy - 6;
    out += `<g stroke="#B08A5A" stroke-width="0.8"><line x1="${sx - 3.5}" y1="${sy}" x2="${sx - 3.5}" y2="${sy + len}"/><line x1="${sx + 3.5}" y1="${sy}" x2="${sx + 3.5}" y2="${sy + len}"/></g>`;
    out += `<rect x="${sx - 4.5}" y="${sy + len}" width="9" height="1.6" rx="0.8" fill="#A06A3A"/>`;
    o.swingSeat = [sx, sy + len];
  }
  return out;
}

function house(x, baseY, w, o = {}) {
  const h = w * 0.72, roofH = w * 0.42, L = x - w / 2, T = baseY - h;
  const wall = '#FFF2DC', roof = '#E8707F', door = '#B07A4E', win = o.lit ? '#FFE27A' : '#BFE3FF';
  let out = '';
  if (o.chimney) {
    out += `<rect x="${x + w * 0.22}" y="${T - roofH * 0.75}" width="${w * 0.12}" height="${roofH * 0.6}" fill="#C8707A"/>`;
    if (o.smoke) out += `<g fill="white" opacity="0.6"><circle cx="${x + w * 0.3}" cy="${T - roofH * 0.95}" r="${w * 0.055}"/><circle cx="${x + w * 0.36}" cy="${T - roofH * 1.15}" r="${w * 0.07}"/><circle cx="${x + w * 0.44}" cy="${T - roofH * 1.4}" r="${w * 0.085}"/></g>`;
  }
  out += `<rect x="${L}" y="${T}" width="${w}" height="${h}" rx="${w * 0.04}" fill="${wall}"/>`;
  out += `<path d="M ${L - w * 0.08},${T + 0.5} L ${x},${T - roofH} L ${x + w / 2 + w * 0.08},${T + 0.5} Z" fill="${roof}"/>`;
  // door
  out += `<rect x="${x - w * 0.11}" y="${baseY - h * 0.5}" width="${w * 0.22}" height="${h * 0.5}" rx="${w * 0.1}" fill="${door}"/><circle cx="${x + w * 0.06}" cy="${baseY - h * 0.24}" r="${w * 0.02}" fill="#FFD700"/>`;
  // window
  const wx = L + w * 0.14, wy = T + h * 0.2, ww = w * 0.22;
  out += `<rect x="${wx}" y="${wy}" width="${ww}" height="${ww}" rx="${w * 0.03}" fill="${win}" stroke="white" stroke-width="${w * 0.03}"/>`;
  out += `<line x1="${wx + ww / 2}" y1="${wy}" x2="${wx + ww / 2}" y2="${wy + ww}" stroke="white" stroke-width="${w * 0.025}"/><line x1="${wx}" y1="${wy + ww / 2}" x2="${wx + ww}" y2="${wy + ww / 2}" stroke="white" stroke-width="${w * 0.025}"/>`;
  const wx2 = L + w * 0.64;
  out += `<rect x="${wx2}" y="${wy}" width="${ww}" height="${ww}" rx="${w * 0.03}" fill="${win}" stroke="white" stroke-width="${w * 0.03}"/>`;
  out += `<line x1="${wx2 + ww / 2}" y1="${wy}" x2="${wx2 + ww / 2}" y2="${wy + ww}" stroke="white" stroke-width="${w * 0.025}"/><line x1="${wx2}" y1="${wy + ww / 2}" x2="${wx2 + ww}" y2="${wy + ww / 2}" stroke="white" stroke-width="${w * 0.025}"/>`;
  if (o.windowBox) {
    for (const bx of [wx, wx2]) {
      out += `<rect x="${bx - w * 0.02}" y="${wy + ww}" width="${ww + w * 0.04}" height="${w * 0.07}" rx="${w * 0.02}" fill="#B07A4E"/>`;
      for (let i = 0; i < 3; i++) out += `<circle cx="${bx + ww * (0.2 + i * 0.3)}" cy="${wy + ww - w * 0.01}" r="${w * 0.035}" fill="${['#FF7FB0', '#FFD84A', '#FF7FB0'][i]}"/>`;
    }
  }
  if (o.lights) {
    const y0 = T + 1, pts = [];
    for (let i = 0; i <= 8; i++) {
      const t = i / 8, px = L - w * 0.08 + t * (w * 1.16), py = y0 + Math.sin(t * Math.PI) * w * 0.12;
      pts.push([px, py]);
    }
    out += `<path d="M ${pts.map(p => p.join(',')).join(' L ')}" stroke="#444" stroke-width="0.5" fill="none" opacity="0.6"/>`;
    pts.forEach(([px, py], i) => { if (i % 2 === 1) out += `<circle cx="${px}" cy="${py + 1.2}" r="1.3" fill="${['#FFD84A', '#FF7FB0', '#7FE0FF', '#B5F07A'][(i >> 1) % 4]}"/><circle cx="${px}" cy="${py + 1.2}" r="2.4" fill="${['#FFD84A', '#FF7FB0', '#7FE0FF', '#B5F07A'][(i >> 1) % 4]}" opacity="0.3"/>`; });
  }
  return out;
}

function mailbox(x, baseY) {
  return `<rect x="${x - 0.6}" y="${baseY - 10}" width="1.2" height="10" fill="#8A6A48"/>
<rect x="${x - 3.5}" y="${baseY - 14}" width="7" height="4.5" rx="2" fill="#6FA8E0"/>
<rect x="${x + 2.6}" y="${baseY - 16.5}" width="0.8" height="3.5" fill="#E8484F"/><rect x="${x + 2.6}" y="${baseY - 16.5}" width="2.2" height="1.6" fill="#E8484F"/>`;
}

function blanket(x, y, w, h) {
  const id = uid('chk');
  return `<defs><pattern id="${id}" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="#FFE6EE"/><rect width="2" height="2" fill="#FF9EBF"/><rect x="2" y="2" width="2" height="2" fill="#FF9EBF"/></pattern></defs>
<path d="M ${x - w / 2},${y} L ${x + w / 2},${y} L ${x + w / 2 + 3},${y + h} L ${x - w / 2 - 3},${y + h} Z" fill="url(#${id})" opacity="0.95"/>`;
}

function badge(v) {
  const s = String(v), w = 7 + s.length * 6.6;
  return `<rect x="3" y="3" width="${w}" height="13" rx="6.5" fill="white" opacity="0.85"/>
<text x="${3 + w / 2}" y="12.8" text-anchor="middle" font-family="Nunito, 'Segoe UI', sans-serif" font-weight="900" font-size="10" fill="#7A3D5E">${s}</text>`;
}

function frame(color) {
  return `<rect x="1.5" y="1.5" width="97" height="97" rx="9" fill="none" stroke="${color}" stroke-width="3" opacity="0.9"/>`;
}

function wrap(v, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${sky(v)}${body}${badge(v)}</svg>`;
}

// ── Scenes ────────────────────────────────────────────────────────────────────
const F = 92; // feet line for foreground bears

function familyScene(v, o) {
  // Shared layout for 1024 and up: house left-back, tree right-back, family in front
  const sw = {};
  let out = '';
  out += o.night ? stars(v % 7) + moon(84, 15, 8) : sparkles([[12, 10, 1.2], [90, 14, 1], [50, 6, 0.9]], 0.5);
  out += ground(v, 70);
  out += house(27, 74, 34, { chimney: true, smoke: true, windowBox: true, lit: true, lights: true });
  out += mailbox(50, 74);
  out += tree(84, 74, 3, Object.assign(sw, { swing: true }));
  out += bear(28, F, 8, BROWN, { scarf: true, closed: true, crown: o.crown, hug: true });
  out += bear(58, F, 8, CREAM, { bow: true, closed: true, crown: o.crown, hug: true });
  out += bear(43, F + 1, 5.5, CUB_A, { closed: true, crown: o.crown });
  out += bear(72, F + 1, 5.5, CUB_B, { closed: o.night, crown: o.crown });
  out += heart(43, 66, 1.2) + heart(60, 60, 0.9) + heart(16, 62, 0.8);
  if (o.extraHearts) out += heart(70, 70, 0.8, '#FFB3D1') + heart(33, 58, 0.7, '#FFB3D1') + heart(90, 50, 0.9, '#FFB3D1');
  if (o.frame) out += frame(o.frame);
  return out;
}

const TILE_ART = {

  // A bear, alone, at dawn.
  2: wrap(2, sparkles([[15, 10, 1.4], [82, 8, 1.1], [88, 24, 0.9], [30, 20, 0.7]]) + ground(2)
    + bear(50, F, 14, BROWN, {})),

  // A warm red scarf.
  4: wrap(4, sun(84, 14, 7) + ground(4)
    + bear(50, F, 14, BROWN, { scarf: true })),

  // A basket of berries.
  8: wrap(8, sun(84, 14, 7) + cloud(28, 18, 1) + ground(8)
    + bear(54, F, 13, BROWN, { scarf: true })
    + basket(22, 84, 1.4)),

  // A sapling, planted with hope.
  16: wrap(16, sun(84, 12, 7) + cloud(24, 16, 1) + cloud(60, 10, 0.7) + ground(16)
    + bear(44, F, 13, BROWN, { scarf: true, closed: true })
    + basket(14, 85, 1.3)
    + tree(82, 90, 0)),

  // A second bear arrives with flowers.
  32: wrap(32, sun(16, 14, 6.5) + cloud(62, 12, 0.9) + ground(32)
    + basket(10, 86, 1.1)
    + tree(90, 88, 0)
    + bear(32, F, 11, BROWN, { scarf: true, closed: true })
    + bear(64, F, 11, CREAM, { bow: true, flowers: true })
    + heart(49, 55, 1.1)),

  // A little house of their own.
  64: wrap(64, sun(88, 12, 6) + cloud(22, 14, 0.8) + ground(64, 72)
    + house(50, 76, 36, {})
    + tree(88, 76, 1)
    + basket(10, 88, 1)
    + bear(30, F, 10, BROWN, { scarf: true, closed: true })
    + bear(66, F, 10, CREAM, { bow: true, closed: true })),

  // A chimney, flowers in the windows and a mailbox.
  128: wrap(128, sun(86, 16, 6) + cloud(18, 10, 0.8) + ground(128, 72)
    + house(40, 76, 36, { chimney: true, smoke: true, windowBox: true })
    + mailbox(74, 78)
    + tree(90, 76, 2)
    + basket(8, 88, 0.9)
    + bear(26, F, 10, BROWN, { scarf: true })
    + bear(56, F, 10, CREAM, { bow: true, closed: true })),

  // A cub!
  256: wrap(256, sun(14, 12, 7) + cloud(70, 10, 0.8) + ground(256, 72)
    + house(32, 76, 34, { chimney: true, smoke: true, windowBox: true })
    + mailbox(56, 78)
    + tree(86, 76, 2)
    + bear(21, F, 9.5, BROWN, { scarf: true, closed: true })
    + bear(71, F, 9.5, CREAM, { bow: true, closed: true })
    + bear(45, F + 1, 6.5, CUB_A, {})
    + heart(45, 68, 1)),

  // Two cubs, a swing, and a picnic.
  512: wrap(512, sparkles([[10, 8, 1], [40, 5, 0.8], [78, 12, 0.9]], 0.5) + ground(512, 70)
    + house(26, 74, 32, { chimney: true, smoke: true, windowBox: true })
    + mailbox(48, 76)
    + (() => { const o = { swing: true }; const t = tree(84, 74, 3, o); const [sx, sy] = o.swingSeat; return t + bear(sx, sy + 0.5, 4.5, CUB_B, {}); })()
    + blanket(40, 86, 30, 8)
    + bear(24, F, 8.5, BROWN, { scarf: true, closed: true })
    + bear(56, F, 8.5, CREAM, { bow: true, closed: true })
    + bear(40, F + 1, 5.5, CUB_A, {})
    + basket(66, 88, 0.9)),

  // Evening lights come on.
  1024: wrap(1024, sparkles([[12, 10, 1.2], [90, 14, 1], [50, 6, 0.9], [70, 22, 0.7]], 0.7) + ground(1024, 70)
    + house(27, 74, 34, { chimney: true, smoke: true, windowBox: true, lit: true, lights: true })
    + mailbox(50, 74)
    + (() => { const o = { swing: true }; const t = tree(84, 74, 3, o); const [sx, sy] = o.swingSeat; return t + bear(sx, sy + 0.5, 4.5, CUB_B, {}); })()
    + blanket(60, 88, 26, 7)
    + bear(26, F, 8.5, BROWN, { scarf: true, closed: true })
    + bear(58, F, 8.5, CREAM, { bow: true, closed: true })
    + bear(42, F + 1, 5.5, CUB_A, { closed: true })),

  // Home, together, under the stars.
  2048: wrap(2048, familyScene(2048, { night: true })),

  // Beyond: the same happy family, crowned.
  4096: wrap(4096, familyScene(4096, { night: true, crown: true, frame: '#FFD700' })),
  8192: wrap(8192, familyScene(8192, { night: true, crown: true, frame: '#FFD700', extraHearts: true })),

};

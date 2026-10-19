// Rebuilds art-kit/Theme-Art-Kit.pdf from kit.html, with fresh screenshots of
// the current game. Needs Google Chrome. Run from the repo:  node art-kit/source/build.mjs
import { createServer } from 'node:http';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { join, extname, normalize, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.woff2': 'font/woff2', '.json': 'application/json', '.webmanifest': 'application/manifest+json' };

// A tiny local web server for the game and the kit
const server = createServer(async (req, res) => {
  let path = decodeURIComponent(req.url.split('?')[0]);
  if (path.endsWith('/')) path += 'index.html';
  const file = join(ROOT, normalize(path));
  if (!file.startsWith(ROOT)) return res.writeHead(403).end();
  let body;
  try { body = await readFile(file); } catch { return res.writeHead(404).end(); }
  res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream' }).end(body);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;
const tmp = await mkdtemp(join(tmpdir(), 'artkit-'));

// Async, so the server above keeps answering Chrome while it loads
const run = promisify(execFile);
const chrome = (args, url) => run(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars',
  `--user-data-dir=${join(tmp, String(Math.random()).slice(2))}`, ...args, url]);

try {
  for (const theme of ['fruit', 'halloween']) {
    for (const scene of ['game', 'win', 'lose', 'settings']) {
      await chrome(['--force-device-scale-factor=2', '--window-size=375,812', '--virtual-time-budget=5000',
        `--screenshot=${join(ROOT, 'art-kit/source/shots', `${theme}-${scene}.png`)}`],
        `${base}/art-kit/source/capture.html?theme=${theme}&scene=${scene}`);
      console.log(`shot ${theme}-${scene}`);
    }
  }
  await chrome(['--virtual-time-budget=5000', '--no-pdf-header-footer', `--print-to-pdf=${join(ROOT, 'art-kit/Theme-Art-Kit.pdf')}`],
    `${base}/art-kit/source/kit.html`);
  console.log('wrote art-kit/Theme-Art-Kit.pdf');
} finally {
  server.close();
  await rm(tmp, { recursive: true, force: true });
}

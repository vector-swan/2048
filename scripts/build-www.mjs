// Copies the game into www/, the folder the iPhone app is built from.
// The website (GitHub Pages) still uses the files at the top of the repo.
import { cpSync, rmSync, mkdirSync } from 'node:fs';

const FILES = ['index.html', 'style.css', 'game.js', 'tiles.js', 'leaderboard.js', 'manifest.webmanifest', 'fonts', 'icons'];
rmSync('www', { recursive: true, force: true });
mkdirSync('www');
for (const f of FILES) cpSync(f, `www/${f}`, { recursive: true });
console.log('Copied the game into www/');

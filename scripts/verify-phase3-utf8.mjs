import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const files = ['index.html', 'js/state.js', 'js/storage.js', 'js/backup.js', 'js/tour.js'];

const badRe = /\u00e2\u2020|\u00c3\u2014|\u00e2\u20ac|\u00c3\u2013|\uFFFD|â€|Ã—|Ã¢/;
const samples = [
  [/↑/, 'arrow up'],
  [/← Trips/, 'back to trips'],
  [/…/, 'ellipsis'],
  [/Wi‑Fi/, 'wifi hyphen'],
  [/⛺/, 'tent emoji'],
];

let ok = true;
for (const rel of files) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) {
    console.log('MISSING', rel);
    ok = false;
    continue;
  }
  const s = fs.readFileSync(p, 'utf8');
  const bad = (s.match(badRe) || []).length;
  console.log(bad ? 'FAIL' : 'OK', rel, bad ? `(${bad} suspect)` : '');
  if (bad) ok = false;
}

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const order = html.indexOf('state.js') < html.indexOf('storage.js') && html.indexOf('storage.js') < html.indexOf('backup.js');
console.log(order ? 'OK' : 'FAIL', 'script load order state→storage→backup');
if (!order) ok = false;

for (const [re, name] of samples) {
  if (!re.test(html)) {
    console.log('WARN', 'index missing', name);
  }
}

process.exit(ok ? 0 : 1);

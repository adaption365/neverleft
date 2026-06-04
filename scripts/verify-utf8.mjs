import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const s = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

const checks = [
  ['scroll ↑', /scrollTopBtn[^>]*>↑</.test(s)],
  ['← Trips', /mtopbarBack[^>]*>← Trips/.test(s)],
  ['→ in Open trip', /Open trip →/.test(s)],
  ['ellipsis …', /Camping Kit…/.test(s)],
  ['× clear', />×</.test(s) || /aria-label="Clear[^"]*"[^>]*>×</.test(s)],
  ['tour.js', s.includes('<script src="/js/tour.js">')],
  ['no inline nlEnterApp', !/<script>\s*\n\s*function nlEnterApp/.test(s)],
  ['no stray script close', !/<script src="\/js\/tour.js"><\/script>\s*\n<\/script>/.test(s)],
  ['end walkthrough comment', /end landing layer \+ walkthrough/.test(s)],
];

let ok = true;
for (const [name, pass] of checks) {
  console.log(pass ? 'OK' : 'FAIL', name);
  if (!pass) ok = false;
}

const bad = (s.match(/\u00e2\u2020|\u00c3\u2014|\u00e2\u20ac\u00a6|\u00c3\u2013|\uFFFD/g) || []).length;
console.log('suspect chars:', bad);
process.exit(ok && bad === 0 ? 0 : 1);

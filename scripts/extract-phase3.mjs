/**
 * Extract state.js, storage.js, backup.js from index.html (UTF-8, no BOM).
 * Marker-based ranges — re-run after index layout changes.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const indexPath = path.join(root, 'index.html');
const jsDir = path.join(root, 'js');

const lines = fs.readFileSync(indexPath, 'utf8').split(/\r?\n/);

function findLine(pred, from = 0) {
  const i = lines.findIndex((l, idx) => idx >= from && pred(l, idx));
  if (i < 0) throw new Error('Marker not found: ' + pred.toString());
  return i;
}

function sliceExclusive(start, end) {
  return lines.slice(start, end);
}

const stateStart = findLine((l) => l.includes('// STATE'));
const settingsStart = findLine((l) => l.includes('// SETTINGS DEFAULTS'));
const persistenceStart = findLine((l) => l.includes('// PERSISTENCE'));
const itemHelpersStart = findLine((l) => l.includes('// ITEM HELPERS'));
const importStart = findLine((l) => l.includes('// IMPORT / EXPORT'));
const renderAllStart = findLine((l) => l.includes('// RENDER ALL'));

const sections = {
  'state.js': {
    header: '/* NeverLeft global state + constants (modular split phase 3) */',
    body: sliceExclusive(stateStart, settingsStart),
  },
  'storage.js': {
    header: '/* NeverLeft load/save, demo mode, shared utils (modular split phase 3) */',
    body: sliceExclusive(persistenceStart, itemHelpersStart),
  },
  'backup.js': {
    header: '/* NeverLeft import/export + backup gates (modular split phase 3) */',
    body: sliceExclusive(importStart, renderAllStart),
  },
};

fs.mkdirSync(jsDir, { recursive: true });

for (const [name, { header, body }] of Object.entries(sections)) {
  const out = [header, '', ...body, ''].join('\n');
  const outPath = path.join(jsDir, name);
  fs.writeFileSync(outPath, out, 'utf8');
  console.log('Wrote', outPath, `(${body.length} lines)`);
}

export { stateStart, settingsStart, persistenceStart, itemHelpersStart, importStart, renderAllStart };

/**
 * Remove extracted phase-3 blocks from index.html; add script tags (UTF-8, no BOM).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const indexPath = path.join(root, 'index.html');

const lines = fs.readFileSync(indexPath, 'utf8').split(/\r?\n/);

function findLine(pred, from = 0) {
  const i = lines.findIndex((l, idx) => idx >= from && pred(l, idx));
  if (i < 0) throw new Error('Marker not found');
  return i;
}

const stateStart = findLine((l) => l.includes('// STATE'));
const settingsStart = findLine((l) => l.includes('// SETTINGS DEFAULTS'));
const persistenceStart = findLine((l) => l.includes('// PERSISTENCE'));
const itemHelpersStart = findLine((l) => l.includes('// ITEM HELPERS'));
const importStart = findLine((l) => l.includes('// IMPORT / EXPORT'));
const renderAllStart = findLine((l) => l.includes('// RENDER ALL'));

const omit = new Set();
for (let i = stateStart; i < settingsStart; i++) omit.add(i);
for (let i = persistenceStart; i < itemHelpersStart; i++) omit.add(i);
for (let i = importStart; i < renderAllStart; i++) omit.add(i);

const mainScriptLine = findLine((l) => l.trim() === '<script>');
const inject = [
  '<script src="/js/state.js"></script>',
  '<script src="/js/storage.js"></script>',
  '<script src="/js/backup.js"></script>',
];

const out = [];
for (let i = 0; i < lines.length; i++) {
  if (omit.has(i)) continue;
  if (i === mainScriptLine) {
    out.push(...inject);
  }
  out.push(lines[i]);
}

const text = out.join('\n') + (lines[lines.length - 1] === '' ? '\n' : '');
fs.writeFileSync(indexPath, text, 'utf8');
console.log(`Updated index.html: ${out.length} lines (was ${lines.length})`);

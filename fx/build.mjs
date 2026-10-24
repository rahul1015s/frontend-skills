// fx/src/*.js (sorted) -> fx/fx.js (everything) and fx/dist/fx-<category>.js (core + one category).
// Category bundles can be combined on one page: the core ignores a second load.
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const files = readdirSync('fx/src').filter(f => f.endsWith('.js')).sort();
const read = f => readFileSync('fx/src/' + f, 'utf8').trim();
const CATS = { text: ['10', '11'], backgrounds: ['20', '21', '22'], interaction: ['30', '31', '32'], components: ['40', '41'], micro: ['50', '51'], magic: ['60', '61'] };
writeFileSync('fx/fx.js', files.map(read).join('\n\n') + '\n');
mkdirSync('fx/dist', { recursive: true });
for (const [cat, prefixes] of Object.entries(CATS)) {
  const part = files.filter(f => prefixes.includes(f.slice(0, 2)));
  writeFileSync(`fx/dist/fx-${cat}.js`, [read(files[0]), ...part.map(read)].join('\n\n') + '\n');
}
console.log('built fx/fx.js +', Object.keys(CATS).map(c => `fx-${c}.js`).join(', '));

// Concatenate fx/src/*.js (sorted) -> fx/fx.js, and a minified-ish copy is not needed (kept readable on purpose).
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
const files = readdirSync('fx/src').filter(f => f.endsWith('.js')).sort();
writeFileSync('fx/fx.js', files.map(f => readFileSync('fx/src/' + f, 'utf8').trim()).join('\n\n') + '\n');
console.log('fx/fx.js <-', files.join(', '));

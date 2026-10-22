// Assembles standalone prompts: parts/<type>.md with {{CORE}} replaced by parts/core.md -> prompts/<type>.md
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';

const core = readFileSync('parts/core.md', 'utf8').trim();
mkdirSync('prompts', { recursive: true });

for (const f of readdirSync('parts').filter(f => f.endsWith('.md') && f !== 'core.md')) {
  const src = readFileSync(`parts/${f}`, 'utf8');
  if (!src.includes('{{CORE}}')) throw new Error(`${f} is missing {{CORE}}`);
  writeFileSync(`prompts/${f}`, src.replace('{{CORE}}', () => core) + '\n');
  console.log('built prompts/' + f);
}

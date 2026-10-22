// Assembles standalone prompts:
//   parts/<type>.md  (contains {{CORE}} and an <!-- IMAGES: cat,cat --> marker)
//   parts/core.md    (contains {{LIBRARY}}, replaced with the photo categories the type asked for)
//   parts/library.json (verified photo IDs: { category: [{ k, id, d }] })
// -> prompts/<type>.md
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';

const core = readFileSync('parts/core.md', 'utf8').trim();
const lib = JSON.parse(readFileSync('parts/library.json', 'utf8'));
const LABEL = {
  gym: 'gym, training and fitness', food: 'food, drink, cafés and restaurants', property: 'homes, interiors and architecture',
  wedding: 'weddings and celebrations', fashion: 'fashion, clothing and accessories', tech: 'technology, code and workspaces',
  people: 'portraits (use for testimonials, team, coaches, agents, party)', nature: 'landscapes and nature', design: 'design, abstract and creative work',
  beauty: 'beauty, skincare and jewellery', home: 'home goods and furniture', hotel: 'hotels, resorts and pools',
  vehicles: 'cars', creative: 'music, film, photography and art supplies', travel: 'cities, landmarks and travel'
};
const FEMALE = new Set([0, 3, 5, 6, 7, 8, 13, 14, 16, 17, 18, 22]); // people.* indices that are women; the rest are men

function library(cats) {
  const blocks = cats.map(c => {
    if (!lib[c]) throw new Error('unknown library category ' + c);
    const rows = lib[c].map(e => {
      let d = e.d;
      if (c === 'people') d += FEMALE.has(+e.k.split('.')[1]) ? ' [woman]' : ' [man]';
      return `${e.k} | ${e.id} | ${d}`;
    }).join('\n');
    return `**${c}.*** — ${LABEL[c]} (${lib[c].length})\n\`\`\`\nkey | photo ID | what it shows\n${rows}\n\`\`\``;
  });
  return `**Photo library for this site type** (key | ID | what it shows). Choose by what the photo shows; the visual plan in section C3b names exact keys.\n\n${blocks.join('\n\n')}`;
}

mkdirSync('prompts', { recursive: true });
for (const f of readdirSync('parts').filter(f => f.endsWith('.md') && f !== 'core.md')) {
  const src = readFileSync(`parts/${f}`, 'utf8');
  if (!src.includes('{{CORE}}')) throw new Error(`${f} is missing {{CORE}}`);
  const m = src.match(/<!--\s*IMAGES:\s*([a-z, ]+?)\s*-->/);
  if (!m) throw new Error(`${f} is missing <!-- IMAGES: ... -->`);
  const cats = m[1].split(',').map(s => s.trim()).filter(Boolean);
  const coreHere = core.replace('{{LIBRARY}}', () => library(cats));
  writeFileSync(`prompts/${f}`, src.replace(m[0], '').replace('{{CORE}}', () => coreHere) + '\n');
  console.log(`built prompts/${f}  (library: ${cats.join(', ')})`);
}

// Browsable image library with thumbnails (renders on GitHub)
{
  const cols = 6;
  let md = '# Verified photo library\n\nEvery photo below was loaded and visually checked. Prompts reference photos by key (for example `gym.20`). Source: Unsplash (images.unsplash.com), used via hotlinked URLs; see the Unsplash licence.\n\nURL pattern: `https://images.unsplash.com/photo-<ID>?w=<W>&h=<H>&fit=crop&q=80&auto=format`\n\n';
  for (const [cat, items] of Object.entries(lib)) {
    md += `## ${cat} (${items.length})\n\n<table>\n`;
    for (let i = 0; i < items.length; i += cols) {
      md += '<tr>' + items.slice(i, i + cols).map(e => `<td width="160" valign="top"><img src="https://images.unsplash.com/photo-${e.id}?w=320&h=240&fit=crop&q=60&auto=format" width="150" alt="${e.d.replace(/"/g, '')}"><br><sub><code>${e.k}</code><br>${e.d.replace(/</g, '&lt;')}</sub></td>`).join('') + '</tr>\n';
    }
    md += '</table>\n\n';
  }
  writeFileSync('IMAGE-LIBRARY.md', md);
  console.log('built IMAGE-LIBRARY.md');
}

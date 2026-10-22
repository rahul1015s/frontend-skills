// Builds examples/<story>.html from engine/*.js + engine/engine.css + stories/<story>.js
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
const rd = f => readFileSync(new URL(f, import.meta.url), 'utf8');
const strip = s => s.replace(/\nif \(typeof module[^\n]*\n?/g, '\n');
const bundle = ['figures', 'fx', 'props', 'core'].map(n => strip(rd(`engine/${n}.js`))).join('\n');
const css = rd('engine/engine.css');
writeFileSync(new URL('engine/engine.bundle.js', import.meta.url), bundle);
const page = (title, story) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="theme-color" content="#05050c">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600;1,700&display=swap" rel="stylesheet">
<style>
${css}</style>
</head>
<body>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script>
${bundle}
</script>
<script>
LoveStory(${story.trim()});
</script>
</body>
</html>
`;
const args = process.argv.slice(2), flag = n => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
if (flag('--story')) {   // node build.mjs --story my-story.js --out my-page.html   (single self-contained file)
  const story = readFileSync(flag('--story'), 'utf8'), m = story.match(/title:\s*'([^']*)'/);
  writeFileSync(flag('--out') || 'my-story.html', page(m ? m[1] : 'Love story', story)); console.log('wrote ' + (flag('--out') || 'my-story.html')); process.exit(0);
}
for (const f of readdirSync(new URL('stories/', import.meta.url)).filter(f => f.endsWith('.js'))) {
  const story = rd('stories/' + f); const m = story.match(/title:\s*'([^']*)'/);
  writeFileSync(new URL('examples/' + f.replace(/\.js$/, '.html'), import.meta.url), page(m ? m[1] : 'Love story', story));
  console.log('built examples/' + f.replace(/\.js$/, '.html'));
}

/* ───── skill documents: LOVE-STORY-SKILL.md (paste into any AI) and skill/love-story/SKILL.md (Claude Code skill) ───── */
{
  const { existsSync, mkdirSync } = await import('node:fs');
  const ref = existsSync(new URL('REF', import.meta.url)) ? rd('REF').trim() : 'main';
  const lib = JSON.parse(readFileSync(new URL('../parts/library.json', import.meta.url), 'utf8'));
  const photos = ['wedding'].map(c => '```\nkey | photo ID | what it shows\n' + lib[c].map(e => `${e.k} | ${e.id} | ${e.d}`).join('\n') + '\n```').join('\n');
  let doc = rd('src/skill.md');
  doc = doc.replaceAll('{{REF}}', ref).replace('{{PHOTOS}}', () => photos);
  doc = doc.replace(/\{\{STORY:([a-z-]+)\}\}/g, (_, n) => rd(`stories/${n}.js`).trim());
  writeFileSync(new URL('LOVE-STORY-SKILL.md', import.meta.url), doc);
  mkdirSync(new URL('skill/love-story/', import.meta.url), { recursive: true });
  const fm = `---\nname: love-story-page\ndescription: Turn any relationship topic (an apology when she is not talking, a flirty date invite, long distance, a proposal, an anniversary, a Mars-and-Venus understanding story, comfort, birthdays) into a cinematic, illustrated, scroll-driven love-story web page with minimal text, flower-fill transitions, rain-to-rainbow skies and a Yes/No finale. Use when the user wants a romantic or relationship page, an apology or I-miss-you page, a proposal or date invitation, or a Reel-style animated love story in HTML.\n---\n\n`;
  writeFileSync(new URL('skill/love-story/SKILL.md', import.meta.url), fm + doc);
  console.log(`built LOVE-STORY-SKILL.md and skill/love-story/SKILL.md (engine ref: ${ref})`);
}

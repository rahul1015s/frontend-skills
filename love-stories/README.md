# love-stories

Cinematic, illustrated, scroll-driven **love-story pages** for any relationship moment: an apology when she isn't talking, a flirty date invite, long distance, a proposal, an anniversary, comfort on a bad day, a Mars-and-Venus "let's understand each other" story, and more.

No photo squares and almost no text. The visitor scrolls and the story plays: the sky turns from rain to rainbow, two people walk toward each other, **the screen fills with flowers** at the turning point, and it ends with a Yes / No question (the "No" button runs away for playful questions, or stays gentle for serious ones).

## Use it with any AI

1. Open [`LOVE-STORY-SKILL.md`](LOVE-STORY-SKILL.md) and paste the whole file into Claude / GPT / Gemini (or copy [`skill/love-story/`](skill/love-story/SKILL.md) into `~/.claude/skills/` for Claude Code).
2. Tell it the topic:
   > My girlfriend Priya is upset and not talking to me. Make a sorry page, I'm Rahul.
   >
   > Flirty page to ask Aanya out this Saturday. I'm Kabir.
   >
   > Mars and Venus: a page that helps us understand each other.
3. The AI returns **one small HTML file** (about 3 KB of story script; the engine loads from a CDN). Open it, or host it free (GitHub Pages / Netlify Drop) and send the link.

The AI does not draw anything. It writes a **story script** (scenes, props, a few words), and the tested engine supplies the illustrations, animation, particles and scroll mechanics.

## Examples (open the `.html` files; each is a single self-contained page)

| Page | Story |
| --- | --- |
| [`sorry`](examples/sorry.html) | She isn't talking → rainy window → distance → "I walked toward you" → flowers → rainbow → *Will you forgive me?* |
| [`miss-you`](examples/miss-you.html) | Long distance: same moon, paper plane, lanterns, reunion → *Did you miss me too?* |
| [`flirty-date`](examples/flirty-date.html) | Playful: balloons, coffee, candlelight, umbrella → *Be my date this Saturday?* |
| [`mars-venus`](examples/mars-venus.html) | Two planets, a bridge of hearts, "listen to understand" → *Meet me in the middle?* |
| [`proposal`](examples/proposal.html) | Cherry blossoms, lanterns, kneeling with a ring → *Will you marry me?* |
| [`anniversary`](examples/anniversary.html) | Photos in heart frames, dancing, fireworks, cake → *Another year with me?* |
| [`birthday`](examples/birthday.html) | Balloons, a gift, a cake, fireworks → *Ready to blow the candles?* |
| [`passion-night`](examples/passion-night.html) | Candlelight, roses, slow dance (tasteful) → *Dance with me?* |
| [`comfort`](examples/comfort.html) | "I see you" on a rainy bench, umbrella, rainbow → *Can I hold you?* |
| [`confession`](examples/confession.html) | "I've been meaning to tell you…" → letter → *Do you feel it too?* |
| [`good-morning`](examples/good-morning.html) | A daily sunrise greeting (no question) |

Add `?reel=1` to any page to hide the interface and auto-play it for screen recording (Reels / Shorts / Status), or tap **Play**.

## What's inside

| File | Purpose |
| --- | --- |
| `engine/figures.js` | Stylised people from a skeleton: 10 solo poses, 8 couple poses (hug, dance, kneel, bench, umbrella…), skin / hair / beard options |
| `engine/props.js` | 32 illustrated props: moon, rain window, planets, bridge of hearts, envelope, phone, lanterns, candles, cake, rainbow, photo hearts… |
| `engine/fx.js` | One-canvas particles: rain, snow, petals, rose petals, hearts, fireflies, sparkle, confetti, fireworks |
| `engine/core.js` | Builds scenes from the script, scroll-scrubbed timeline, flower-fill transition, Yes/No finale, Play / reel mode |
| `engine/engine.css`, `engine/engine.bundle.js` | What the pages load from the CDN |
| `stories/*.js` | The story scripts behind the examples |
| `src/skill.md` | Source of the skill document |

## Build your own

```bash
node build.mjs                                   # rebuild examples/ and the skill documents
node build.mjs --story my-story.js --out my.html # one self-contained file from your own story script
```

## Boundaries

Romantic, flirty and passionate-but-tasteful are in scope. **No explicit sexual content, no pressure, guilt-tripping or manipulation.** Apology and comfort pages use a calm "No" button (`dodge: false`). The Mars-and-Venus story is original and does not reproduce any book.

# PREMIUM PORTFOLIO WEBSITE — MASTER PROMPT v1.0
### One prompt → one complete, animated, production-ready `index.html` for a designer, developer, or creative

> **HOW TO USE**
> 1. Paste this ENTIRE file into any capable AI (Claude, GPT, Gemini…).
> 2. Then send: `Build my portfolio. Name: <NAME>. Role: <ROLE>. Based in: <CITY>. Style: <editorial | dark-tech | warm-craft>. Projects: <3–6 project names + one line each>. Email: <EMAIL>.`
> 3. The AI returns a single `index.html`. Save it, open it, deploy it anywhere (GitHub Pages, Netlify, Vercel).

If any detail is missing, **invent believable specifics** instead of asking questions.

<!-- IMAGES: design,tech,creative,people,nature -->
{{CORE}}

---

## ═══════════════════════════════════════════════
## PART C — PORTFOLIO SPECIFICATION
## ═══════════════════════════════════════════════

### C1. Goal and audience

The visitor is a recruiter, founder or client deciding in 20 seconds whether to write. The page must answer, in order: **who is this, what do they do best, proof, how to hire them.** Work is the hero; chrome stays quiet.

### C2. Pick ONE direction (match the person, then commit)

| Direction | Palette (A3) | Fonts | Feel |
| --- | --- | --- | --- |
| **Editorial** (designers, writers, art directors) | Ink & Cream | Instrument Serif + Geist | Big serif name, lots of white space, italic accents |
| **Dark Tech** (developers, creative technologists) | Mono Lime or Blueprint | Space Grotesk + Geist + JetBrains Mono | Mono labels, grid lines, terminal-ish details |
| **Warm Craft** (illustrators, motion, makers) | Terracotta | Fraunces + DM Sans | Soft shapes, warm greys, tactile grain |

Set `--accent-rgb`, `--bg-rgb` and `--on-accent` consistently with the palette.

### C3. Section order (all required)

1. **Hero** — name as a huge `data-split` headline, role line, location + live local time, two CTAs (View work / Email me), scroll cue.
2. **Statement** — one paragraph (40–60 words) whose words light up as you scroll.
3. **Selected work** — 4–6 projects as a list-as-table with a cursor-following preview (desktop) and inline art thumbnails (mobile).
4. **Capabilities** — 3 columns, each an icon tile + title + 4–5 bullet skills.
5. **Experience** — rows: years · company · role · one-line impact.
6. **Tools marquee** — tool/skill names scrolling.
7. **Kind words** — 3 testimonial cards with real-sounding names, roles, companies, and a concrete outcome.
8. **Contact** — giant email link, copy-to-clipboard button, short form, social links.
9. **Footer** — name, local time, socials, © year, "Back to top".

Nav: Work · About · Experience · Contact (+ "Let's talk" button).

### C3b. Visual plan (MANDATORY; keys refer to the photo library in A4.2)

This portfolio must feel visual, not like a text résumé. Add these to the section order and build every one:

| Where | What to build | Photos |
| --- | --- | --- |
| Directly under the hero | **Photo marquee** (A4.5), 8 photos, duplicated once | `design.12` `design.13` `design.14` `design.20` `tech.07` `creative.08` `creative.14` `design.22` |
| About | One portrait that matches the person’s gender and age, plus two workspace shots | portrait from `people.*` (men: 01, 02, 09, 20, 25 · women: 00, 06, 07, 16) · `tech.20` · `design.17` |
| **Gallery** (`id="gallery"`, add “Gallery” to the nav; between Capabilities and Experience) | “Process & playground”: masonry of **12** with chips **UI · Research · Craft** | UI: `tech.00` `tech.03` `tech.07` `tech.14` `design.12` `design.14` · Research: `design.13` `design.20` `design.22` `design.21` · Craft: `design.15` `creative.14` `creative.15` `creative.08` |
| Kind words | 3 portrait avatars (160×160) matching each quoted person | `people.01` `people.00` `people.12` (swap by gender) |
| Project artwork | Keep the generated `.art` tiles (C5); they are the visual identity of the work list | generated |

Use `<body data-art-kinds="mesh,topo,rings">`. Total distinct photos ≥ 16.

### C4. Signature moment (build ALL THREE, subtly)

1. **Hero name rises character by character** (`data-split` on the h1) while the eyebrow and CTAs stagger in.
2. **Work list preview** that follows the cursor with eased lag, switching panels per row (generated art, no photos needed).
3. **Scroll-lit statement**: each word goes from 20% to 100% opacity as the paragraph passes through the viewport.

Everything else is calm.

### C5. Generated project artwork (no photos required)

Every project gets a unique `.art` tile built from CSS gradients, so the portfolio never depends on external images. Choose 3 harmonious colours per project from the palette family plus one off-palette hue.

```css
.art{position:relative;isolation:isolate;overflow:hidden;border-radius:var(--r-md);aspect-ratio:4/3;
  background:
    radial-gradient(60% 80% at 18% 22%,var(--c1),transparent 62%),
    radial-gradient(70% 70% at 86% 82%,var(--c2),transparent 62%),
    radial-gradient(50% 60% at 62% 40%,var(--c3),transparent 70%),
    var(--c0,#0e0e10)}
.art::before{content:"";position:absolute;inset:0;z-index:-1;opacity:.5;mix-blend-mode:overlay;
  background:repeating-linear-gradient(90deg,rgb(255 255 255 / .06) 0 1px,transparent 1px 48px),repeating-linear-gradient(0deg,rgb(255 255 255 / .06) 0 1px,transparent 1px 48px)}
.art .glyph{position:absolute;left:1rem;bottom:.6rem;font:500 clamp(3rem,9vw,6rem)/1 var(--font-display);letter-spacing:-.05em;color:rgb(255 255 255 / .92);mix-blend-mode:overlay}
.art .tag{position:absolute;top:1rem;left:1rem}
```

```html
<div class="art" style="--c0:#0d1b2a;--c1:#3a86ff;--c2:#ff006e;--c3:#8338ec" role="img" aria-label="Abstract artwork for Atlas Banking">
  <span class="pill tag">Product design</span><span class="glyph">At</span>
</div>
```

### C6. Page-specific CSS (append after A6)

```css
/* hero */
#top-hero{min-height:100svh;display:flex;flex-direction:column;justify-content:flex-end;padding:120px 0 clamp(28px,5vw,56px)}
.hero-name{font-size:var(--step-5);line-height:.88;letter-spacing:-.045em}
.hero-name em{font-family:var(--font-display);font-style:italic;color:var(--accent)}
.hero-meta{display:flex;flex-wrap:wrap;gap:1rem 2.5rem;margin-top:clamp(20px,3vw,40px);align-items:flex-end;justify-content:space-between}
.hero-role{max-width:34ch}
.hero-cta{display:flex;flex-wrap:wrap;gap:.75rem}
.scroll-cue{display:inline-flex;align-items:center;gap:.6rem;color:var(--text-2);font:500 var(--step--1)/1 var(--font-mono);letter-spacing:.12em;text-transform:uppercase}
.scroll-cue i{animation:nudge 1.8s var(--ease-in-out) infinite}
@keyframes nudge{50%{transform:translateY(6px)}}

/* statement */
.statement{font:400 var(--step-3)/1.12 var(--font-display);letter-spacing:-.025em;max-width:24em}
.statement .w{opacity:.2;transition:opacity .4s}

/* work list */
.work-list{border-top:1px solid var(--line)}
.work-row a{display:grid;grid-template-columns:auto 1fr auto;gap:.5rem 1rem;align-items:baseline;padding:clamp(18px,2.6vw,30px) 0;border-bottom:1px solid var(--line);transition:padding var(--t-pop) var(--ease-out),color var(--t-hover)}
.w-num{color:var(--text-3)}
.w-title{font:500 var(--step-3)/1 var(--font-display);letter-spacing:-.03em}
.w-meta{grid-column:2;color:var(--text-2);font-size:var(--step--1)}
.work-row .ti{grid-row:1;grid-column:3;font-size:1.6rem;transition:transform var(--t-pop) var(--ease-out)}
.row-thumb{grid-column:1/-1;margin-top:.75rem}
.preview{display:none}
@media (min-width:861px){
  .row-thumb{display:none}
  .work-row a{grid-template-columns:4rem 1fr auto auto}
  .w-meta{grid-column:auto}
  .work-row .ti{grid-column:auto}
  .work-list:hover .work-row a{color:var(--text-3)}
  .work-list .work-row a:hover{color:var(--text);padding-left:1rem}
  .work-row a:hover .ti{transform:translate(4px,-4px)}
  .preview{display:block;position:fixed;top:0;left:0;width:min(34vw,460px);z-index:800;pointer-events:none;opacity:0;scale:.92;
    transition:opacity .35s var(--ease-out),scale .5s var(--ease-out)}
  .preview.on{opacity:1;scale:1}
  .preview .art{position:absolute;inset:0;opacity:0;transition:opacity .3s;aspect-ratio:auto}
  .preview .art.on{opacity:1}
  .preview-box{position:relative;aspect-ratio:4/3}
}

/* capabilities, experience */
.cap-grid{display:grid;gap:clamp(12px,2vw,24px)}
@media (min-width:861px){.cap-grid{grid-template-columns:repeat(3,1fr)}}
.cap li{display:flex;gap:.6rem;align-items:center;padding:.55rem 0;border-bottom:1px solid var(--line);color:var(--text-2)}
.cap li::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--accent);flex:none}
.exp-row{display:grid;gap:.25rem 2rem;padding:1.4rem 0;border-bottom:1px solid var(--line)}
@media (min-width:861px){.exp-row{grid-template-columns:10rem 1fr 1fr 2fr;align-items:baseline}}
.exp-row .yrs{font-family:var(--font-mono);color:var(--text-3)}

/* testimonials */
.quote-grid{display:grid;gap:clamp(12px,2vw,24px)}
@media (min-width:861px){.quote-grid{grid-template-columns:repeat(3,1fr)}}
.quote p{font:400 var(--step-1)/1.35 var(--font-display);letter-spacing:-.01em}
.who{display:flex;align-items:center;gap:.8rem;margin-top:1.5rem}
.avatar{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:var(--surface-2);font-weight:600}

/* contact */
.mega-mail{display:block;font:500 clamp(2.2rem,9.5vw,8rem)/1 var(--font-display);letter-spacing:-.045em;word-break:break-word}
.contact-row{display:grid;gap:clamp(24px,5vw,64px);margin-top:clamp(32px,5vw,64px)}
@media (min-width:861px){.contact-row{grid-template-columns:1fr 1fr}}
.socials{display:flex;gap:.6rem;flex-wrap:wrap}
.socials a{width:48px;height:48px;border-radius:50%;border:1px solid var(--line);display:grid;place-items:center;font-size:20px;transition:background-color var(--t-hover),color var(--t-hover),transform var(--t-press)}
.socials a:active{transform:scale(.94)}
@media (hover:hover) and (pointer:fine){.socials a:hover{background:var(--accent);color:var(--on-accent);border-color:var(--accent)}}
```

### C7. Section markup patterns (adapt copy; keep structure)

**Hero**

```html
<section id="top-hero" aria-label="Introduction">
  <div class="wrap">
    <p class="eyebrow" data-reveal>Product designer · available for select projects</p>
    <h1 class="hero-name" data-split>Maya Okonkwo</h1>
    <div class="hero-meta">
      <p class="lead hero-role" data-reveal style="--i:2">I design calm, fast interfaces for fintech and health teams, from first sketch to shipped system.</p>
      <div class="hero-cta" data-reveal style="--i:3">
        <a href="#work" class="btn btn-primary btn-lg" data-magnetic>View work <i class="ti ti-arrow-down" aria-hidden="true"></i></a>
        <a href="mailto:hello@mayaokonkwo.com" class="btn btn-ghost btn-lg">Email me</a>
      </div>
      <p class="mono muted" data-reveal style="--i:4"><i class="ti ti-map-pin" aria-hidden="true"></i> Lagos, NG · <span data-time="Africa/Lagos">--:--</span></p>
    </div>
  </div>
</section>
```

`data-split` headings are plain text only; for the italic accent word use a separate line outside the split element or accept a single-style name.

**Statement**

```html
<section class="sec" id="about"><div class="wrap">
  <p class="eyebrow" data-reveal>About</p>
  <p class="statement" data-statement>I believe good software feels inevitable. For nine years I have helped teams at Monzo, Flutterwave and two health startups turn messy workflows into products people trust, cutting task time by 40% on average and shipping design systems used by 60+ engineers.</p>
</div></section>
```

**Work list + preview**

```html
<section class="sec" id="work"><div class="wrap">
  <div class="stack" style="--stack:.75rem"><p class="eyebrow" data-reveal>Selected work</p><h2 data-reveal>Things I’m proud of</h2></div>
  <ul class="work-list" data-stagger style="margin-top:2.5rem">
    <li class="work-row">
      <a href="#" aria-label="Atlas Banking, product design, 2025">
        <span class="w-num mono">01</span><span class="w-title">Atlas Banking</span><span class="w-meta">Product design · 2025</span><i class="ti ti-arrow-up-right" aria-hidden="true"></i>
        <div class="row-thumb"><div class="art" style="--c0:#0d1b2a;--c1:#3a86ff;--c2:#ff006e;--c3:#8338ec"><span class="glyph">At</span></div></div>
      </a>
    </li>
    <!-- 4–6 rows; vary colours; real outcome in the aria-label -->
  </ul>
</div></section>
<div class="preview" aria-hidden="true"><div class="preview-box">
  <!-- one .art per row, same order and same colours, no glyph needed -->
  <div class="art" style="--c0:#0d1b2a;--c1:#3a86ff;--c2:#ff006e;--c3:#8338ec"></div>
</div></div>
```

**Contact**

```html
<section class="sec" id="contact"><div class="wrap">
  <p class="eyebrow" data-reveal>Contact</p>
  <a class="mega-mail link-u" href="mailto:hello@mayaokonkwo.com" data-cursor data-reveal style="--i:1">hello@mayaokonkwo.com</a>
  <div class="contact-row">
    <div class="stack" data-reveal>
      <p class="lead">Currently booking projects for next quarter. Tell me what you’re building and I’ll reply within two working days.</p>
      <button class="btn btn-ghost" id="copy-mail" type="button"><i class="ti ti-copy" aria-hidden="true"></i><span>Copy email</span></button>
      <div class="socials" aria-label="Social links">
        <a href="https://linkedin.com/in/yourname" aria-label="LinkedIn"><i class="ti ti-brand-linkedin" aria-hidden="true"></i></a>
        <a href="https://dribbble.com/yourname" aria-label="Dribbble"><i class="ti ti-brand-dribbble" aria-hidden="true"></i></a>
        <a href="https://github.com/yourname" aria-label="GitHub"><i class="ti ti-brand-github" aria-hidden="true"></i></a>
      </div>
    </div>
    <form data-form data-success="Thanks — I’ll reply within two working days." class="stack" style="--stack:1rem;--i:2" data-reveal>
      <div class="field"><label for="n">Name</label><input id="n" name="name" autocomplete="name" required placeholder="Ada Lovelace"></div>
      <div class="field"><label for="e">Email</label><input id="e" name="email" type="email" autocomplete="email" inputmode="email" required placeholder="ada@company.com"></div>
      <div class="field"><label for="m">Project</label><textarea id="m" name="message" required placeholder="What are you building, and by when?"></textarea></div>
      <button class="btn btn-primary btn-lg btn-block" type="submit">Send message</button>
      <p class="form-status" role="status" hidden></p>
    </form>
  </div>
</div></section>
```

### C8. Page-specific JavaScript (the last `<script>`; uses `window.site`)

```js
(() => {
  const { $, $$, reduce, fine, safe } = window.site;

  /* live local time */
  $$('[data-time]').forEach(el => {
    const tz = el.dataset.time;
    const tick = () => { el.textContent = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: tz, hour12: false }).format(new Date()); };
    safe(tick); setInterval(() => safe(tick), 30000);
  });

  /* scroll-lit statement */
  const st = $('[data-statement]');
  if (st) {
    const words = st.textContent.trim().split(/\s+/);
    st.setAttribute('aria-label', words.join(' '));
    st.innerHTML = words.map(w => `<span class="w" aria-hidden="true">${w}</span>`).join(' ');
    const spans = $$('.w', st);
    if (reduce || !(window.gsap && window.ScrollTrigger)) spans.forEach(s => s.style.opacity = 1);
    else gsap.to(spans, { opacity: 1, ease: 'none', stagger: 0.12,
      scrollTrigger: { trigger: st, start: 'top 80%', end: 'bottom 55%', scrub: true } });
  }

  /* work list: cursor-following preview with eased lag */
  const rows = $$('.work-row'), pv = $('.preview');
  if (pv && fine && !reduce && window.site.wide()) {
    const panels = $$('.preview .art');
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    const w = () => pv.offsetWidth, h = () => pv.offsetHeight;
    addEventListener('pointermove', e => { tx = e.clientX + 28; ty = e.clientY - h() / 2; }, { passive: true });
    const loop = () => { x += (tx - x) * 0.14; y += (ty - y) * 0.14;
      const maxX = innerWidth - w() - 16; pv.style.transform = `translate(${Math.min(x, maxX)}px, ${y}px)`; raf = requestAnimationFrame(loop); };
    rows.forEach((r, i) => {
      r.addEventListener('pointerenter', () => { if (!raf) loop(); pv.classList.add('on'); panels.forEach((p, j) => p.classList.toggle('on', i === j)); });
      r.addEventListener('pointerleave', () => { pv.classList.remove('on'); });
    });
    $('.work-list').addEventListener('pointerleave', () => { cancelAnimationFrame(raf); raf = 0; });
  }

  /* copy email */
  const copy = $('#copy-mail');
  copy?.addEventListener('click', async () => {
    const label = $('span', copy), mail = $('.mega-mail').textContent.trim();
    try { await navigator.clipboard.writeText(mail); label.textContent = 'Copied'; }
    catch { location.href = 'mailto:' + mail; label.textContent = 'Opening mail…'; }
    setTimeout(() => { label.textContent = 'Copy email'; }, 1800);
  });
})();
```

### C9. Content generation rules (make it believable)

- **Name and role**: specific discipline ("Product designer for fintech"), not "Creative professional".
- **Projects (4–6)**: invent client names that sound real but are not famous trademarks; each has a one-line problem and a **measurable outcome** ("Checkout drop-off −31%", "Shipped to 2M users"), year, and 2–3 role tags. Never link to fake case studies: use `href="#"` and tell the owner to replace.
- **Capabilities**: three headings such as *Product design*, *Systems & code*, *Research & strategy* with 4–5 concrete skills each.
- **Experience**: 3–4 roles, newest first, with year ranges and one impact line each.
- **Tools marquee**: 10–14 tools relevant to the field (Figma, Framer, React, TypeScript, Webflow, Blender, After Effects…).
- **Testimonials**: first name + surname initial, title, company, one specific outcome sentence.
- **Tone**: first person, confident, plain language, one personality detail (a hobby or a belief).

### C10. Portfolio-specific checklist

- [ ] Hero name is the largest thing on the page and readable at 390px without breaking mid-word
- [ ] Work list works by hover on desktop and shows inline art on touch
- [ ] Statement lights up on scroll and is fully readable with JS off or reduced motion
- [ ] Every project row has number, title, discipline, year, and an `aria-label` with the outcome
- [ ] Copy-email and the form both give visible feedback
- [ ] Local time shows the person’s timezone
- [ ] Only the three signature motions are prominent; the rest is restrained

---

## ═══════════════════════════════════════════════
## PART D — QUICK-START PROMPTS
## ═══════════════════════════════════════════════

```
Build my portfolio. Name: Kavya Rao. Role: Frontend developer & creative technologist. Based in: Bengaluru.
Style: dark-tech (Mono Lime). Projects: Orbit (realtime analytics dashboard), Lume (WebGL music visualiser),
Fable (children's reading app), Grid (design-token tool). Email: hello@kavyarao.dev.
```

```
Build my portfolio. Name: Tomás Ibarra. Role: Art director & motion designer. Based in: Lisbon.
Style: editorial (Ink & Cream, Instrument Serif). Projects: Casa Verde rebrand, Nocturne title sequence,
Maré magazine, Sol festival identity, Olho exhibition. Email: ola@tomasibarra.studio.
```

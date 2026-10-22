# PREMIUM CREATIVE AGENCY / STUDIO WEBSITE — MASTER PROMPT v1.0
### One prompt → one complete, bold, animated `index.html` for a design studio, branding agency, production house or consultancy

> **HOW TO USE**
> 1. Paste this ENTIRE file into any capable AI (Claude, GPT, Gemini…).
> 2. Then send: `Build a website for <STUDIO NAME>, a <TYPE> studio in <CITY>. Services: <list>. Tone: <e.g. confident, playful, austere>. Notable clients/projects: <list or "invent">.`
> 3. The AI returns a single `index.html`. Save it and deploy anywhere.

If any detail is missing, **invent believable specifics** instead of asking questions.

<!-- IMAGES: design,creative,fashion,tech,people,vehicles,food,beauty,travel,nature,home -->
{{CORE}}

---

## ═══════════════════════════════════════════════
## PART C — AGENCY / STUDIO SPECIFICATION
## ═══════════════════════════════════════════════

### C1. Goal

Make a founder think “these people will make us look incredible” within five seconds, then give them proof, process, and an easy way to start. Agencies are bought on taste: **type scale, cropping, rhythm and restraint** carry the page.

### C2. Direction

Pick one and commit:
- **Loud Mono** — Mono Lime or Noir Gold, Archivo Black/Bricolage Grotesque, huge uppercase type, hard grid lines.
- **Quiet Luxe** — Ink & Cream or Glacier, Instrument Serif + Geist, generous white space, italic accents.
- **Playful Pop** — Citrus or Violet Hour, Bricolage Grotesque + Outfit, rounded pills, sticker-like badges.

### C3. Section order (all required)

1. **Hero** — a statement of 6–12 words set at `--step-5` with `data-split`, studio descriptor line, a rotating “now booking” badge, and a CTA. Optionally a looping CSS marquee of services under it.
2. **Intro / positioning** — one large paragraph + 3 proof numbers (years, projects, awards).
3. **Selected work** — featured projects as large cards with `.img-reveal` photography or generated art; `data-cursor` makes the cursor grow, and the card label reads “View case”.
4. **Pinned horizontal gallery** — a scroll-driven horizontal track of 5–6 project panels (desktop); native snap scroller on mobile.
5. **Services** — numbered accordion; each row expands to a description and deliverable chips.
6. **Process** — 4 steps in a row (Discover → Define → Design → Deliver) with timings.
7. **Clients** — a typographic wall of 12 invented client wordmarks.
8. **Recognition** — a short table of awards/press (year · award · project).
9. **Testimonial** — one large quote.
10. **Contact** — oversized “Let’s make something” headline, brief form, email, studio address, socials.
11. **Footer** — large studio name, nav, socials, © year.

### C3b. Visual plan (MANDATORY; keys refer to the photo library in A4.2)

The agency’s credibility *is* its imagery. Use rich photography everywhere:

| Where | What to build | Photos |
| --- | --- | --- |
| Hero | Headline over a **bento collage** (`.cg`) in the background at ~35% opacity or beside the text on desktop | `fashion.02` `creative.00` `design.01` `vehicles.04` `travel.09` |
| Selected work (6 cases) | One photo per case, 4:3. Invent clients that fit the photo | fashion boutique `fashion.04` · bakery rebrand `food.22` · automotive launch `vehicles.05` · skincare packaging `beauty.06` · furniture e-shop `home.02` · music festival `creative.11` |
| Horizontal reel (6) | 4:5 photos | `fashion.11` `fashion.13` `beauty.01` `food.02` `travel.09` `creative.09` |
| Under Clients | **Photo marquee** (A4.5) | `creative.00` `design.01` `fashion.07` `fashion.02` `vehicles.04` `nature.10` `travel.01` `food.10` |
| **Gallery** (`id="gallery"`, add to nav) | “Inside the studio”: masonry of **12**, chips **Studio · Craft · Inspiration** | Studio: `design.21` `design.22` `tech.04` `tech.05` · Craft: `design.13` `design.15` `design.20` `creative.08` · Inspiration: `creative.12` `creative.14` `nature.04` `travel.00` |
| Team / testimonial | 4 portraits (2 women, 2 men) | `people.00` `people.22` `people.01` `people.20` |

Use `<body data-art-kinds="stripes,rings,grid,mesh">`. Total distinct photos ≥ 30.

### C4. Signature moment

**The pinned horizontal project gallery** with a progress line, preceded by a hero headline that rises character by character. Cards scale from `0.92` to `1` as they pass the viewport centre. Use it once; the rest of the page scrolls normally.

### C5. Page-specific CSS (append after A6)

```css
.hero{min-height:100svh;display:grid;align-content:end;padding:130px 0 clamp(28px,5vw,56px);position:relative;overflow:clip}
.hero h1{font-size:var(--step-5);line-height:.88;letter-spacing:-.05em;text-transform:none;max-width:12ch}
.hero-foot{display:flex;flex-wrap:wrap;gap:1.5rem 3rem;justify-content:space-between;align-items:flex-end;margin-top:clamp(24px,4vw,56px)}
.hero-foot p{max-width:40ch;color:var(--text-2)}
.spin-badge{width:112px;height:112px;border-radius:50%;border:1px solid var(--line);display:grid;place-items:center;position:relative;flex:none}
.spin-badge svg{position:absolute;inset:0;width:100%;height:100%;animation:rot 14s linear infinite}
.spin-badge text{font:500 11px var(--font-mono);letter-spacing:.2em;text-transform:uppercase;fill:var(--text)}
.spin-badge i{font-size:26px;color:var(--accent)}
@keyframes rot{to{transform:rotate(360deg)}}

.intro{display:grid;gap:clamp(24px,4vw,56px)}
@media (min-width:861px){.intro{grid-template-columns:1.6fr 1fr}}
.intro-text{font:400 var(--step-3)/1.1 var(--font-display);letter-spacing:-.03em;text-wrap:balance}
.proof{display:grid;gap:1.4rem;align-content:end}
.proof div{border-top:1px solid var(--line);padding-top:.8rem}
.proof b{font:500 var(--step-4)/1 var(--font-display);letter-spacing:-.04em;display:block}

/* featured cards */
.cases{display:grid;gap:clamp(28px,5vw,64px)}
@media (min-width:861px){.cases{grid-template-columns:repeat(12,1fr);gap:clamp(40px,6vw,96px) 24px}
  .case:nth-child(odd){grid-column:1 / span 7}.case:nth-child(even){grid-column:6 / span 7}}
.case .media{aspect-ratio:4/3;border-radius:var(--r-lg)}
.case-meta{display:flex;justify-content:space-between;gap:1rem;margin-top:1rem;align-items:baseline}
.case-meta h3{font-size:var(--step-2)}
.case-meta span{color:var(--text-2);font:500 var(--step--1)/1 var(--font-mono);letter-spacing:.08em;text-transform:uppercase}

/* pinned horizontal gallery */
.hscroll{position:relative}
.h-pin{overflow:hidden}
.h-head{display:flex;justify-content:space-between;align-items:flex-end;gap:1rem;padding-bottom:1.5rem}
.h-track{display:flex;gap:clamp(12px,2vw,24px);padding-inline:var(--gutter);overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none}
.h-track::-webkit-scrollbar{display:none}
.h-card{flex:0 0 min(82vw,520px);scroll-snap-align:center;display:grid;gap:.9rem}
.h-card .media{aspect-ratio:4/5;border-radius:var(--r-lg)}
.h-card h3{font-size:var(--step-1)}
.h-bar{height:2px;background:var(--line);margin:1.5rem var(--gutter) 0;position:relative;overflow:hidden;display:none}
.h-bar i{position:absolute;inset:0;background:var(--accent);transform-origin:0 50%;transform:scaleX(0)}
@media (min-width:861px){
  .h-track{overflow:visible;scroll-snap-type:none;width:max-content}
  .h-card{flex-basis:clamp(360px,34vw,560px)}
  .h-bar{display:block}
}

/* services accordion */
.svc{border-top:1px solid var(--line)}
.svc:last-child{border-bottom:1px solid var(--line)}
.svc-head{width:100%;display:grid;grid-template-columns:3rem 1fr auto;gap:1rem;align-items:center;text-align:left;padding:clamp(18px,3vw,32px) 0;transition:color var(--t-hover),padding var(--t-pop) var(--ease-out)}
.svc-head .n{font:500 var(--step--1)/1 var(--font-mono);color:var(--text-3)}
.svc-head h3{font-size:var(--step-3);letter-spacing:-.035em}
.svc-head .ti{font-size:1.8rem;transition:transform .5s var(--ease-out)}
.svc.open .svc-head .ti{transform:rotate(45deg);color:var(--accent)}
.svc-body{display:grid;grid-template-rows:0fr;transition:grid-template-rows .6s var(--ease-out)}
.svc.open .svc-body{grid-template-rows:1fr}
.svc-body>div{overflow:hidden}
.svc-body p{max-width:56ch;color:var(--text-2);padding:0 0 1rem 4rem}
.chips{display:flex;flex-wrap:wrap;gap:.5rem;padding:0 0 clamp(18px,3vw,32px) 4rem}
@media (hover:hover) and (pointer:fine){.svc-head:hover{color:var(--accent)}}

/* process, clients, awards */
.proc{display:grid;gap:12px}
@media (min-width:861px){.proc{grid-template-columns:repeat(4,1fr)}}
.proc .card h3{margin-top:2.5rem}
.proc .card small{font:500 var(--step--1)/1 var(--font-mono);color:var(--accent);letter-spacing:.1em}
.clients{display:grid;grid-template-columns:repeat(2,1fr);border-top:1px solid var(--line);border-left:1px solid var(--line)}
@media (min-width:861px){.clients{grid-template-columns:repeat(4,1fr)}}
.clients span{display:grid;place-items:center;min-height:120px;border-right:1px solid var(--line);border-bottom:1px solid var(--line);font:600 var(--step-1)/1 var(--font-display);letter-spacing:-.03em;color:var(--text-3);transition:color var(--t-hover),background-color var(--t-hover)}
@media (hover:hover) and (pointer:fine){.clients span:hover{color:var(--text);background:var(--surface)}}
.award{display:grid;grid-template-columns:4rem 1fr;gap:.25rem 1rem;padding:1rem 0;border-bottom:1px solid var(--line)}
@media (min-width:861px){.award{grid-template-columns:6rem 1fr 1fr 8rem}}
.award .y{font-family:var(--font-mono);color:var(--text-3)}

.big-quote{font:400 var(--step-4)/1.02 var(--font-display);letter-spacing:-.04em;max-width:16em;text-wrap:balance}
.big-quote cite{display:block;margin-top:1.5rem;font:500 var(--step--1)/1 var(--font-mono);letter-spacing:.1em;text-transform:uppercase;color:var(--text-2);font-style:normal}
.cta-mega{font:500 var(--step-5)/.9 var(--font-display);letter-spacing:-.05em}
.foot-name{font:500 clamp(4rem,22vw,22rem)/.8 var(--font-display);letter-spacing:-.06em;color:var(--surface-2);white-space:nowrap;overflow:hidden;margin-top:2rem;user-select:none}
```

### C6. Markup patterns

**Spinning badge (SVG text on a circle)**

```html
<div class="spin-badge" aria-label="Now booking for Q3">
  <svg viewBox="0 0 120 120" aria-hidden="true"><defs><path id="c" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0"/></defs>
    <text><textPath href="#c">Now booking · Q3 2026 · Now booking · Q3 2026 ·</textPath></text></svg>
  <i class="ti ti-arrow-down-right" aria-hidden="true"></i>
</div>
```

**Services accordion** (role: disclosure buttons)

```html
<div class="svc" data-svc>
  <button class="svc-head" aria-expanded="false" aria-controls="svc-1" data-cursor>
    <span class="n">01</span><h3>Brand identity</h3><i class="ti ti-plus" aria-hidden="true"></i>
  </button>
  <div class="svc-body" id="svc-1" role="region"><div>
    <p>Naming, strategy, logo systems and the rules that keep them consistent as you grow.</p>
    <div class="chips"><span class="pill">Strategy</span><span class="pill">Identity</span><span class="pill">Guidelines</span></div>
  </div></div>
</div>
```

**Horizontal gallery**

```html
<section class="sec hscroll" id="reel" aria-label="Project reel"><div class="h-pin">
  <div class="wrap h-head"><div><p class="eyebrow">Reel</p><h2>Recent work</h2></div><p class="muted">Scroll →</p></div>
  <div class="h-track" id="h-track">
    <article class="h-card" data-cursor><div class="media"><img src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=900&h=1125&fit=crop&q=80&auto=format" width="900" height="1125" alt="Boutique clothes rail for the Linea retail identity" loading="lazy" decoding="async" data-seed="linea-boutique"></div><h3>Linea — retail identity</h3><span class="muted mono">Brand · 2025</span></article>
    <!-- 5–6 cards -->
  </div>
  <div class="h-bar" aria-hidden="true"><i id="h-fill"></i></div>
</div></section>
```

### C7. Page-specific JavaScript

```js
(() => {
  const { $, $$, reduce, safe } = window.site;

  /* services accordion (one open at a time) */
  const rows = $$('[data-svc]');
  rows.forEach(r => {
    const b = $('.svc-head', r);
    b.addEventListener('click', () => {
      const open = !r.classList.contains('open');
      rows.forEach(x => { x.classList.remove('open'); $('.svc-head', x).setAttribute('aria-expanded', 'false'); });
      if (open) { r.classList.add('open'); b.setAttribute('aria-expanded', 'true'); }
    });
  });

  /* pinned horizontal gallery (desktop); native scroller on mobile */
  if (window.gsap && window.ScrollTrigger && !reduce) safe(() => gsap.matchMedia().add('(min-width: 861px)', () => {
    const pin = $('.h-pin'), track = $('#h-track'), fill = $('#h-fill');
    if (!pin || !track) return;
    const dist = () => Math.max(0, track.scrollWidth - innerWidth + 80);
    gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: { trigger: pin, start: 'top top+=72', end: () => '+=' + dist(), pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: s => { if (fill) fill.style.transform = `scaleX(${s.progress})`; } }
    });
    $$('.h-card', track).forEach(c => gsap.fromTo(c, { scale: 0.92 }, { scale: 1, ease: 'none',
      scrollTrigger: { trigger: c, containerAnimation: gsap.getTweensOf(track)[0], start: 'left 90%', end: 'left 45%', scrub: true } }));
  }));
})();
```

If `containerAnimation` proves fragile, remove the per-card scale tween; the pinned scroll must keep working.

### C8. Content rules

- **Hero statement** is a claim, not a description: “We make brands people remember on purpose.” Not “A full-service creative agency.”
- **Projects (6)**: invented clients across 4+ industries, each with discipline, year and a one-line outcome (“Sold out in 11 days”, “+38% direct bookings”).
- **Services (5)**: Brand identity · Websites & product · Packaging · Motion & film · Strategy. Each with 3 deliverable chips.
- **Process timings**: Discover (1 wk) · Define (1–2 wks) · Design (3–5 wks) · Deliver (1–2 wks).
- **Images**: all from the verified library (A4.2) per the visual plan (C3b); crop consistently (4:3 for cases, 4:5 for the reel). Alt text describes what is visible.
- **Contact** form: name, email, budget select (“<$10k / $10–25k / $25–50k / $50k+”), project description.

Photos: all from the verified library (A4.2) following the visual plan (C3b). Crop consistently (4:3 for cases, 4:5 for the reel) and write alt text that describes the work (“Packaging for Oro olive oil”).

### C9. Agency-specific checklist

- [ ] Hero headline is huge, tight-tracked, and wraps cleanly at 390px
- [ ] Cursor grows on cases and gallery cards (desktop)
- [ ] Horizontal gallery pins on desktop with a visible progress bar and scrolls natively with snap on mobile
- [ ] Services accordion is keyboard operable with `aria-expanded`
- [ ] Footer shows the studio name huge but cropped, as a quiet final flourish
- [ ] No more than one pinned section

---

## ═══════════════════════════════════════════════
## PART D — QUICK-START PROMPTS
## ═══════════════════════════════════════════════

```
Build a website for FORMA & CO, a brand identity and packaging studio in Copenhagen. Tone: quiet, confident, Scandinavian.
Services: identity, packaging, websites, strategy. Clients: invent 6 across food, fashion and tech.
```

```
Build a website for BLOCKPARTY, a motion and film studio in Mumbai. Tone: loud, playful, high-energy. Use Mono Lime.
Services: title sequences, brand films, 3D, social. Clients: invent.
```

# PREMIUM PHOTOGRAPHY / GALLERY / VISUAL PORTFOLIO WEBSITE — MASTER PROMPT v1.0
### One prompt → one complete, image-first, animated `index.html` for a photographer, filmmaker, architect, or visual artist

> **HOW TO USE**
> 1. Paste this ENTIRE file into any capable AI (Claude, GPT, Gemini…).
> 2. Then send: `Build a website for <NAME>, a <GENRE> photographer in <CITY>. Mood: <words>. Series: <3–6 series names or "invent">. Services/prices: <or "invent">.`
> 3. The AI returns a single `index.html`. Save it and deploy anywhere.

If any detail is missing, **invent believable specifics** instead of asking questions.

<!-- IMAGES: people,nature,travel,property,wedding,creative,design,hotel -->
{{CORE}}

---

## ═══════════════════════════════════════════════
## PART C — PHOTOGRAPHY / GALLERY SPECIFICATION
## ═══════════════════════════════════════════════

### C1. Goal

Let the images lead. The interface is a quiet frame: neutral surfaces, small precise type, generous space, gentle motion. A prospective client should see range, consistency and craft within seconds, and find the booking enquiry just as fast.

### C2. Direction

- **Gallery Black** — near-black surfaces (`#0a0a0a`), Mono Lime or Noir Gold accent used sparingly, Cormorant Garamond + Hanken Grotesk.
- **Gallery White** — Glacier or Ink & Cream (light), Instrument Serif + Geist; photographs pop against white.
- **Documentary** — Mono Lime/Brutalist, Archivo + Space Mono, hard grid, captions like contact-sheet metadata.

Photos are never filtered with heavy overlays; use a subtle scrim only under text.

### C3. Section order (all required)

1. **Hero** — a tight collage of 3 photos with different parallax speeds, the name set large, one-line statement, location + availability.
2. **Series index** — 4–6 series as large cards (cover, title, year, count) that link to anchors on the same page.
3. **Gallery** — masonry grid with category filter chips (All · Portrait · Landscape · Architecture · Street…), 16–24 photos, lightbox on click.
4. **Featured series story** — sticky caption on one side, photos scrolling on the other, with EXIF-style metadata.
5. **About** — portrait, bio, equipment list, clients/publications.
6. **Services & pricing** — 3 packages with what’s included.
7. **Testimonials** — 2–3 quotes.
8. **Contact / enquiry** — form with date + type of shoot, email, studio location.
9. **Footer.**

### C3b. Visual plan (MANDATORY; keys refer to the photo library in A4.2)

The photographer’s site is the gallery. Fill it generously and honestly by genre:

| Where | What to build | Photos |
| --- | --- | --- |
| Hero collage | 3 photos, one per genre | `nature.04` · a portrait (`people.13` or `people.00`) · `property.24` |
| Series index (4–5 covers) | Each series cover is a different genre | Portraits `people.14` · Landscapes `nature.16` · Architecture `property.09` · Street `travel.09` · Wedding `wedding.18` |
| **Main gallery** (24 photos, chips **Portrait · Landscape · Architecture · Street · Wedding**) | 5 per chip at least; vary aspect ratios | Portrait: `people.00` `people.01` `people.03` `people.05` `people.07` `people.16` `people.22` · Landscape: `nature.00` `nature.03` `nature.04` `nature.08` `nature.14` `nature.17` `nature.19` · Architecture: `property.03` `property.05` `property.07` `property.14` `property.18` `property.22` `property.24` · Street: `travel.04` `travel.05` `travel.08` `travel.11` `travel.12` · Wedding: `wedding.00` `wedding.08` `wedding.13` `wedding.18` |
| Featured series (sticky caption) | 5 photos from one genre with EXIF lines | choose one chip’s photos |
| About | Photographer portrait + gear shot | `people.28` or `people.26` (man) · `people.06` (woman) · `creative.05` |

Use `<body data-art-kinds="mesh,topo,rings">`. Total distinct photos ≥ 40.

### C4. Signature moment

**A refined lightbox**: native `<dialog>`, image zoom-fade between photos, keyboard (←/→/Esc), swipe on touch, caption with EXIF line, counter, and preloading of the neighbours. Photos in the grid reveal with a curtain (`img-reveal`) as they scroll in, and the hero collage drifts at different speeds.

### C5. Page-specific CSS (append after A6)

```css
.hero{min-height:100svh;padding:130px 0 clamp(32px,5vw,64px);display:grid;align-content:end;position:relative;overflow:clip}
.collage{position:absolute;inset:0;z-index:-1;display:grid;grid-template-columns:repeat(12,1fr);grid-template-rows:repeat(12,1fr);gap:12px;padding:96px var(--gutter) 0;opacity:.9}
.collage .media{border-radius:var(--r-md)}
.collage .c1{grid-column:1 / span 5;grid-row:2 / span 7}
.collage .c2{grid-column:6 / span 4;grid-row:1 / span 5}
.collage .c3{grid-column:9 / span 4;grid-row:4 / span 8}
@media (max-width:860px){.collage .c1{grid-column:1 / span 7;grid-row:1 / span 6}.collage .c2{grid-column:8 / span 5;grid-row:2 / span 4}.collage .c3{grid-column:4 / span 8;grid-row:7 / span 4}}
.hero::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(to top,var(--bg) 8%,rgb(var(--bg-rgb,10 10 10) / .55) 45%,transparent)}
.hero h1{font-size:var(--step-5);line-height:.86;letter-spacing:-.045em;max-width:10ch}
.hero-foot{display:flex;flex-wrap:wrap;justify-content:space-between;gap:1rem 3rem;align-items:flex-end;margin-top:2rem}

/* series */
.series{display:grid;gap:12px}
@media (min-width:861px){.series{grid-template-columns:repeat(3,1fr)}.series .card-s:nth-child(1){grid-column:span 2}}
.card-s{position:relative;display:block;border-radius:var(--r-lg);overflow:hidden;min-height:340px;isolation:isolate}
.card-s .media{position:absolute;inset:0;border-radius:0;z-index:-1}
.card-s::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(to top,rgb(0 0 0 / .7),transparent 55%)}
.card-s div{position:absolute;inset:auto 0 0 0;padding:1.3rem;color:#fff;display:flex;justify-content:space-between;align-items:flex-end;gap:1rem}
.card-s h3{font-size:var(--step-2)}
.card-s span{font:500 var(--step--1)/1 var(--font-mono);letter-spacing:.08em;opacity:.8}

/* filters, masonry, .shot and the lightbox now live in the core CSS/engine (A4.4) */
/* featured series (sticky caption) */
.feature{display:grid;gap:clamp(20px,4vw,64px)}
@media (min-width:861px){.feature{grid-template-columns:1fr 1.4fr;align-items:start}}
.feature-cap{position:sticky;top:96px;display:grid;gap:1rem}
.feature-list{display:grid;gap:12px}
.exif{display:flex;flex-wrap:wrap;gap:.4rem 1rem;font:500 var(--step--1)/1.3 var(--font-mono);color:var(--text-3);letter-spacing:.06em}

/* about, packages */
.about{display:grid;gap:clamp(24px,5vw,72px);align-items:center}
@media (min-width:861px){.about{grid-template-columns:.9fr 1.1fr}}
.about .media{aspect-ratio:4/5;border-radius:var(--r-lg)}
.gear li{display:flex;justify-content:space-between;padding:.6rem 0;border-bottom:1px solid var(--line);color:var(--text-2)}
.pkgs{display:grid;gap:12px}
@media (min-width:861px){.pkgs{grid-template-columns:repeat(3,1fr)}}
.pkg{display:flex;flex-direction:column;gap:1rem}
.pkg .price{font:500 var(--step-3)/1 var(--font-display);letter-spacing:-.03em;font-variant-numeric:tabular-nums}
.pkg ul{display:grid;gap:.6rem;flex:1;color:var(--text-2)}
.pkg li{display:flex;gap:.6rem}.pkg li i{color:var(--accent);margin-top:.3rem}
.pkg.pop{border-color:var(--accent)}
```

### C6. Markup patterns

**Main gallery** uses the core component from A4.4 (`.masonry[data-gallery]` with `figure.shot` items, `.chip[data-filter]` filters, automatic lightbox). Do not write a lightbox. Per photo: `data-cat` is the chip key (`portrait`, `landscape`, `architecture`, `street`, `wedding`), `data-title` is a short poetic caption, `data-exif` is `35mm · f/1.8 · 1/250 · ISO 200` (vary plausibly), `alt` describes what is visible, `data-seed` is unique. Vary `aspect-ratio` between figures (4/5, 3/2, 1/1, 2/3) for rhythm.

```html
<figure class="shot" data-cat="portrait" data-title="Marigold, Jaipur" data-exif="35mm · f/1.8 · 1/250 · ISO 200">
  <div class="media img-reveal" style="aspect-ratio:4/5"><img src="https://images.unsplash.com/photo-<ID from the library>?w=800&h=1000&fit=crop&q=80&auto=format" width="800" height="1000" alt="Woman in a marigold-coloured scarf at a market" loading="lazy" decoding="async" data-seed="marigold-jaipur"></div>
  <figcaption>Marigold, Jaipur</figcaption>
</figure>
```

Filter chips: `<div class="chips" role="group" aria-label="Filter photos"><button class="chip" data-filter="all" aria-pressed="true">All</button> … one chip per genre …</div>`.

### C7. Page-specific JavaScript

```js
(() => {
  const { $, reduce, safe } = window.site;

  /* hero collage drifts at different speeds (the gallery, filters and lightbox are handled by the core engine) */
  if (window.gsap && window.ScrollTrigger && !reduce) safe(() => {
    [['.c1', -6], ['.c2', 10], ['.c3', -12]].forEach(([sel, y]) => {
      const el = $(sel); if (el) gsap.to(el, { yPercent: y, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    });
  });
})();
```

### C8. Image guidance

All photos come from the verified library (A4.2) following the visual plan (C3b). The main gallery needs **24 photos**, at least 5 per genre chip.

- A photo may appear twice (e.g. series cover and gallery) with different crops, alt text and captions; otherwise keep every photo unique, each with its own `data-seed`.
- `alt` describes what is visible; `data-title` is a poetic place/subject caption; `data-exif` gives lens · aperture · shutter · ISO.
- The page must remain attractive with all photos failing (generated art shows underneath each `.media`).

### C9. Content rules

- **Name and genre** specific (“Documentary wedding photographer · Udaipur & worldwide”).
- **Series**: invented but evocative (“Salt Season”, “Night Shift”, “Concrete Gardens”), with a year and a photo count.
- **About**: 90–120 words, first person, one origin detail, one belief about photography; equipment list (bodies, three lenses, film stock).
- **Packages**: e.g. Half-day · Full-day · Editorial, with hours, deliverables (number of edited images, gallery delivery in 14 days), usage rights, price.
- **Enquiry form**: name, email, type of shoot (select), date, location, message.
- **Publications/clients**: invented outlet-style names.

### C10. Photography-specific checklist

- [ ] Photos dominate; UI chrome is small and quiet
- [ ] The core lightbox opens by click and keyboard, closes on Esc / backdrop / swipe-down, restores focus
- [ ] Filter chips work and update the lightbox set
- [ ] Masonry has varied aspect ratios and no layout shift (width/height set)
- [ ] Every photo has descriptive alt text and a caption
- [ ] Hero collage readable text contrast thanks to the gradient scrim
- [ ] Enquiry form has success state; email and location are clear

---

## ═══════════════════════════════════════════════
## PART D — QUICK-START PROMPTS
## ═══════════════════════════════════════════════

```
Build a website for ANAYA DESAI, a documentary wedding photographer based in Udaipur (travels worldwide). Mood: warm, intimate, film-like.
Palette: Noir Gold, Cormorant Garamond. Series: invent 5. Packages: invent 3 in INR.
```

```
Build a website for STUDIO NORD, an architectural photography practice in Oslo. Mood: cold, precise, minimal.
Palette: Glacier (light), Instrument Serif. Series: invent 4. Packages: invent 3 in NOK.
```

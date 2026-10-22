# PREMIUM PHOTOGRAPHY / GALLERY / VISUAL PORTFOLIO WEBSITE — MASTER PROMPT v1.0
### One prompt → one complete, image-first, animated `index.html` for a photographer, filmmaker, architect, or visual artist

> **HOW TO USE**
> 1. Paste this ENTIRE file into any capable AI (Claude, GPT, Gemini…).
> 2. Then send: `Build a website for <NAME>, a <GENRE> photographer in <CITY>. Mood: <words>. Series: <3–6 series names or "invent">. Services/prices: <or "invent">.`
> 3. The AI returns a single `index.html`. Save it and deploy anywhere.

If any detail is missing, **invent believable specifics** instead of asking questions.

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

/* filters + masonry */
.chips{display:flex;gap:.5rem;flex-wrap:wrap;margin:1.5rem 0 2rem}
.chip{padding:.6rem 1.1rem;min-height:44px;border-radius:var(--r-pill);border:1px solid var(--line);color:var(--text-2);transition:background-color var(--t-hover),color var(--t-hover),border-color var(--t-hover)}
.chip[aria-pressed="true"]{background:var(--text);color:var(--bg);border-color:var(--text)}
.masonry{columns:2;column-gap:12px}
@media (min-width:861px){.masonry{columns:3}}
@media (min-width:1200px){.masonry{columns:4}}
.shot{display:block;width:100%;margin:0 0 12px;break-inside:avoid;position:relative;border-radius:var(--r-md);overflow:hidden;cursor:zoom-in}
.shot.hide{display:none}
.shot .media{border-radius:0}
.shot figcaption{position:absolute;inset:auto 0 0 0;padding:.8rem;font:500 .7rem/1.2 var(--font-mono);letter-spacing:.08em;color:#fff;opacity:0;transform:translateY(8px);transition:opacity .4s,transform .5s var(--ease-out);background:linear-gradient(to top,rgb(0 0 0 / .6),transparent)}
@media (hover:hover) and (pointer:fine){.shot:hover figcaption{opacity:1;transform:none}.shot:hover img{transform:scale(1.04)}}
.shot img{transition:transform 1.2s var(--ease-out)}

/* lightbox */
dialog.lb{border:0;padding:0;background:rgb(0 0 0 / .94);color:#fff;width:100vw;height:100dvh;max-width:none;max-height:none;overflow:hidden}
dialog.lb::backdrop{background:rgb(0 0 0 / .94)}
dialog.lb[open]{display:grid;grid-template-rows:auto 1fr auto;animation:lbIn .45s var(--ease-out)}
@keyframes lbIn{from{opacity:0}}
.lb-top,.lb-bot{display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:14px var(--gutter);font:500 var(--step--1)/1.3 var(--font-mono);letter-spacing:.08em}
.lb-stage{position:relative;display:grid;place-items:center;padding:0 var(--gutter);min-height:0;touch-action:pan-y}
.lb-stage img{max-width:100%;max-height:100%;object-fit:contain;border-radius:6px;transition:opacity .35s,transform .5s var(--ease-out)}
.lb-stage img.swap{opacity:0;transform:scale(.985)}
.lb-btn{width:48px;height:48px;border-radius:50%;border:1px solid rgb(255 255 255 / .25);display:grid;place-items:center;font-size:22px;color:#fff;background:rgb(0 0 0 / .35);transition:background-color var(--t-hover),transform var(--t-press)}
.lb-btn:active{transform:scale(.94)}
@media (hover:hover) and (pointer:fine){.lb-btn:hover{background:rgb(255 255 255 / .14)}}
.lb-prev,.lb-next{position:absolute;top:50%;translate:0 -50%}
.lb-prev{left:var(--gutter)}.lb-next{right:var(--gutter)}
@media (max-width:860px){.lb-prev,.lb-next{top:auto;bottom:8px;translate:none}}

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

**Gallery item (one `<figure>` per photo; data drives the lightbox)**

```html
<figure class="shot" data-cat="portrait" data-full="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1800&q=85&auto=format" data-title="Marigold, Jaipur" data-exif="35mm · f/1.8 · 1/250 · ISO 200" tabindex="0" role="button" aria-label="Open photo: Marigold, Jaipur">
  <div class="media img-reveal" style="aspect-ratio:4/5"><img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&h=1000&fit=crop&q=80&auto=format" width="800" height="1000" alt="Woman in a marigold-coloured scarf at a market in Jaipur" loading="lazy" decoding="async" data-seed="marigold-jaipur"></div>
  <figcaption>Marigold, Jaipur</figcaption>
</figure>
```

Vary `aspect-ratio` between figures (4/5, 3/2, 1/1, 2/3) so the masonry has rhythm. Give every photo a distinct `data-seed`.

**Lightbox (one per page)**

```html
<dialog class="lb" id="lb" aria-label="Photo viewer">
  <div class="lb-top"><span id="lb-count">1 / 1</span><button class="lb-btn" id="lb-close" aria-label="Close"><i class="ti ti-x" aria-hidden="true"></i></button></div>
  <div class="lb-stage"><button class="lb-btn lb-prev" id="lb-prev" aria-label="Previous photo"><i class="ti ti-arrow-left" aria-hidden="true"></i></button>
    <img id="lb-img" alt="" decoding="async">
    <button class="lb-btn lb-next" id="lb-next" aria-label="Next photo"><i class="ti ti-arrow-right" aria-hidden="true"></i></button></div>
  <div class="lb-bot"><span id="lb-title"></span><span id="lb-exif" class="muted"></span></div>
</dialog>
```

**Filter chips**

```html
<div class="chips" role="group" aria-label="Filter photos">
  <button class="chip" data-filter="all" aria-pressed="true">All</button>
  <button class="chip" data-filter="portrait" aria-pressed="false">Portrait</button>
  <button class="chip" data-filter="landscape" aria-pressed="false">Landscape</button>
  <button class="chip" data-filter="architecture" aria-pressed="false">Architecture</button>
  <button class="chip" data-filter="street" aria-pressed="false">Street</button>
</div>
```

### C7. Page-specific JavaScript

```js
(() => {
  const { $, $$, reduce, safe } = window.site;

  /* filter */
  const shots = $$('.shot'), chips = $$('.chip');
  chips.forEach(c => c.addEventListener('click', () => {
    const f = c.dataset.filter;
    chips.forEach(x => x.setAttribute('aria-pressed', String(x === c)));
    shots.forEach(s => s.classList.toggle('hide', f !== 'all' && s.dataset.cat !== f));
    window.ScrollTrigger && ScrollTrigger.refresh();
  }));

  /* lightbox */
  const lb = $('#lb'); if (!lb) return;
  const img = $('#lb-img'), count = $('#lb-count'), title = $('#lb-title'), exif = $('#lb-exif');
  let list = [], idx = 0, opener = null;
  const visible = () => shots.filter(s => !s.classList.contains('hide'));
  const preload = i => { const s = list[(i + list.length) % list.length]; if (s) { const p = new Image(); p.src = s.dataset.full; } };
  const show = (i, instant) => {
    idx = (i + list.length) % list.length;
    const s = list[idx], alt = $('img', s)?.alt || s.dataset.title || '';
    const apply = () => {
      img.src = s.dataset.full; img.alt = alt;
      count.textContent = `${idx + 1} / ${list.length}`; title.textContent = s.dataset.title || ''; exif.textContent = s.dataset.exif || '';
      img.classList.remove('swap'); preload(idx + 1); preload(idx - 1);
    };
    if (instant || reduce) apply(); else { img.classList.add('swap'); setTimeout(apply, 180); }
  };
  const open = s => { list = visible(); opener = s; lb.showModal(); document.documentElement.classList.add('lb-open'); window.site.lenis?.stop(); show(list.indexOf(s), true); };
  const close = () => { if (lb.open) lb.close(); };
  lb.addEventListener('close', () => { document.documentElement.classList.remove('lb-open'); window.site.lenis?.start(); opener?.focus(); });
  shots.forEach(s => {
    s.addEventListener('click', () => open(s));
    s.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(s); } });
  });
  $('#lb-close').addEventListener('click', close);
  $('#lb-prev').addEventListener('click', () => show(idx - 1));
  $('#lb-next').addEventListener('click', () => show(idx + 1));
  lb.addEventListener('keydown', e => { if (e.key === 'ArrowRight') show(idx + 1); if (e.key === 'ArrowLeft') show(idx - 1); });
  lb.addEventListener('click', e => { if (e.target === lb) close(); });

  /* swipe */
  let sx = 0, sy = 0;
  const stage = $('.lb-stage');
  stage.addEventListener('pointerdown', e => { sx = e.clientX; sy = e.clientY; });
  stage.addEventListener('pointerup', e => {
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) show(idx + (dx < 0 ? 1 : -1));
    else if (dy > 90 && Math.abs(dy) > Math.abs(dx) * 1.4) close();
  });

  /* hero collage drifts at different speeds */
  if (window.gsap && window.ScrollTrigger && !reduce) safe(() => {
    [['.c1', -6], ['.c2', 10], ['.c3', -12]].forEach(([sel, y]) => {
      const el = $(sel); if (el) gsap.to(el, { yPercent: y, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    });
  });
})();
```

### C8. Image guidance

Unsplash IDs you can rely on for mood (use `?w=<W>&h=<H>&fit=crop&q=80&auto=format`, `&q=85` and larger `w` for lightbox files):
`photo-1558769132-cb1aea458c5e` · `photo-1509631179647-0177331693ae` · `photo-1523170335258-f5ed11844a49` · `photo-1486325212027-8081e485255e` · `photo-1560448204-e02f11c3d0e2` · `photo-1558618666-fcd25c85cd64` · `photo-1513584684374-8bab748fbf90` · `photo-1476480862126-209bfaa8edc8` · `photo-1555396273-367ea4eb4db5`.

- Reuse is acceptable at different crops and aspect ratios, but give each instance its own `data-seed` and a different `alt` and caption, so the gallery never looks duplicated.
- Always write `alt` as a real description of the picture, and `data-title` as a poetic place/subject caption.
- Add a metadata line: lens · aperture · shutter · ISO. Vary plausibly.
- The page must remain attractive with all photos failing (gradient fallbacks per `.media`).

### C9. Content rules

- **Name and genre** specific (“Documentary wedding photographer · Udaipur & worldwide”).
- **Series**: invented but evocative (“Salt Season”, “Night Shift”, “Concrete Gardens”), with a year and a photo count.
- **About**: 90–120 words, first person, one origin detail, one belief about photography; equipment list (bodies, three lenses, film stock).
- **Packages**: e.g. Half-day · Full-day · Editorial, with hours, deliverables (number of edited images, gallery delivery in 14 days), usage rights, price.
- **Enquiry form**: name, email, type of shoot (select), date, location, message.
- **Publications/clients**: invented outlet-style names.

### C10. Photography-specific checklist

- [ ] Photos dominate; UI chrome is small and quiet
- [ ] Lightbox opens by click and keyboard, traps focus (native dialog), closes on Esc / backdrop / swipe-down, restores focus
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

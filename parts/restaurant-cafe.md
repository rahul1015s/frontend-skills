# PREMIUM RESTAURANT / CAFÉ / HOSPITALITY WEBSITE — MASTER PROMPT v1.0
### One prompt → one complete, appetising, animated `index.html` for a restaurant, café, bar, bakery or hotel dining room

> **HOW TO USE**
> 1. Paste this ENTIRE file into any capable AI (Claude, GPT, Gemini…).
> 2. Then send: `Build a website for <NAME>, a <CUISINE/TYPE> in <CITY>. Vibe: <words>. Signature dishes: <list or "invent">. Hours: <hours or "invent">. Address/phone: <or "invent">.`
> 3. The AI returns a single `index.html`. Save it and deploy anywhere.

If any detail is missing, **invent believable specifics** instead of asking questions.

<!-- IMAGES: food,people -->
{{CORE}}

---

## ═══════════════════════════════════════════════
## PART C — RESTAURANT / CAFÉ SPECIFICATION
## ═══════════════════════════════════════════════

### C1. Goal

Make people hungry, then make booking effortless. 70% of visitors are on a phone, often standing outside deciding where to eat: **hours, menu, location, and a Book/Call button must be reachable in one tap.**

### C2. Direction

| Venue | Palette (A3) | Fonts |
| --- | --- | --- |
| Fine dining, wine bar | Noir Gold or Terracotta | Cormorant Garamond + Hanken Grotesk |
| Neighbourhood bistro, bakery | Terracotta or Citrus (light) | Fraunces + DM Sans |
| Specialty coffee | Ink & Cream or Moss | Instrument Serif + Geist |
| Street food, burgers, bar | Ember or Citrus | Bricolage Grotesque + Outfit |

### C3. Section order (all required)

1. **Hero** — full-bleed photo with slow settle, restaurant name, one-line promise, “Book a table” + “See menu”, and an **Open now / Closed** pill computed from real hours.
2. **Marquee** — signature words (“Wood-fired · Seasonal · Local · Natural wine”).
3. **Story** — split layout with an `img-reveal` photo and a short chef/owner paragraph; a parallax second photo; 3 facts (est. year, covers per night, farms we buy from).
4. **Menu** — accessible tabs (Starters · Mains · Desserts · Drinks), each with 5–6 items: name, description, price, dietary tags (V, VG, GF).
5. **Signature dishes** — 3 large image cards with hover zoom.
6. **Experience / events** — private dining, tasting menu, live music with Tabler icons.
7. **Gallery** — masonry of 8 photos.
8. **Reviews** — 3 quotes with stars and source.
9. **Reservation** — form (name, phone, date, time, guests, note) and the hours table beside it.
10. **Location** — address card, map-style panel, “Get directions”, parking/transit notes.
11. **Footer** — hours, address, socials, newsletter.

A **sticky bottom bar on mobile** (hidden on desktop): `Call` + `Book` buttons, appearing after the hero.

### C3b. Visual plan (MANDATORY; keys refer to the photo library in A4.2)

Food sells through photographs. Choose the set that matches the venue and use all of these:

| Where | What to build | Photos |
| --- | --- | --- |
| Hero | Full-bleed interior or terrace | restaurant: `food.05` or `food.06` · seaside: `food.07` · café: `food.21` or `food.20` |
| Story | Left: plating or barista close-up; below: the parallax frame | `food.04` or `food.18` · parallax: `food.05` or `food.21` |
| Chef / owner | One portrait | `people.12` or `people.10` (man) · `people.07` (woman) |
| Signature dishes (3 cards) | Restaurant: `food.12` `food.28` `food.30` · Café: `food.17` `food.23` `food.14` · Bakery: `food.22` `food.23` `food.03` | as listed |
| Menu | Optional 56px round thumbnails per dish from the same pool; never required | `food.*` |
| Photo marquee under the hero | 8 photos, duplicated | `food.08` `food.09` `food.10` `food.13` `food.15` `food.24` `food.27` `food.31` |
| **Gallery** (`id="gallery"`) | “A taste of the room”: masonry of **12**, chips **Food · Drinks · Space** | Food: `food.01` `food.04` `food.08` `food.09` `food.12` `food.30` · Drinks: `food.02` `food.16` `food.17` `food.18` · Space: `food.05` `food.06` `food.07` `food.21` |
| Reviews | 3 portraits | `people.00` `people.01` `people.22` |

Use `<body data-art-kinds="plate,waves,mesh">`. Total distinct photos ≥ 24.

### C4. Signature moment

**A cinematic hero**: the photo settles from `scale(1.12)` to `1` over 2.4s while the name rises character by character, then the Open-now pill fades in. Below it, the menu tabs cross-fade items with a stagger. Keep everything else gentle and warm.

### C5. Page-specific CSS (append after A6)

```css
.hero{position:relative;min-height:100svh;display:grid;align-items:end;padding:120px 0 clamp(40px,7vw,96px);isolation:isolate;overflow:clip}
.hero-bg{position:absolute;inset:0;z-index:-1}
.hero-bg img{width:100%;height:100%;object-fit:cover;transform:scale(1.12);animation:settle 2.6s var(--ease-out) forwards}
@keyframes settle{to{transform:scale(1)}}
.hero-bg::after{content:"";position:absolute;inset:0;background:linear-gradient(to top,rgb(0 0 0 / .78),rgb(0 0 0 / .25) 55%,rgb(0 0 0 / .45))}
.hero h1{font-size:var(--step-5);line-height:.9;letter-spacing:-.04em;color:#fff;max-width:11ch}
.hero .lead{color:rgb(255 255 255 / .8);margin:1.2rem 0 2rem}
.open-pill{display:inline-flex;align-items:center;gap:.55rem;padding:.45rem .95rem;border-radius:var(--r-pill);background:rgb(255 255 255 / .12);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);color:#fff;font:500 var(--step--1)/1 var(--font-mono);letter-spacing:.06em;border:1px solid rgb(255 255 255 / .2)}
.open-pill i{width:8px;height:8px;border-radius:50%;background:#7ee08f;box-shadow:0 0 0 0 rgb(126 224 143 / .6);animation:ping 2s infinite}
.open-pill.closed i{background:#ff8a7a;animation:none}
@keyframes ping{70%{box-shadow:0 0 0 10px rgb(126 224 143 / 0)}100%{box-shadow:0 0 0 0 rgb(126 224 143 / 0)}}

/* story */
.story{display:grid;gap:clamp(24px,5vw,72px);align-items:center}
@media (min-width:861px){.story{grid-template-columns:1fr 1fr}}
.story .media{aspect-ratio:4/5;border-radius:var(--r-lg)}
.facts{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-top:2rem}
.facts b{display:block;font:500 var(--step-3)/1 var(--font-display);letter-spacing:-.03em}
.facts span{color:var(--text-2);font-size:var(--step--1)}
.parallax-frame{overflow:hidden;border-radius:var(--r-lg);aspect-ratio:16/9;margin-top:clamp(24px,5vw,72px)}
.parallax-frame .media{height:100%;border-radius:0}
.parallax-frame img{width:100%;height:120%;margin-top:-10%;object-fit:cover}

/* menu tabs */
.tabs{display:flex;gap:.4rem;overflow-x:auto;scrollbar-width:none;padding-bottom:.5rem;margin:2rem 0 1rem}
.tabs::-webkit-scrollbar{display:none}
.tab{padding:.7rem 1.3rem;border-radius:var(--r-pill);border:1px solid var(--line);color:var(--text-2);white-space:nowrap;min-height:44px;transition:background-color var(--t-hover),color var(--t-hover),border-color var(--t-hover)}
.tab[aria-selected="true"]{background:var(--text);color:var(--bg);border-color:var(--text)}
.menu-panel{display:none}
.menu-panel.on{display:grid;gap:0 clamp(24px,5vw,72px)}
@media (min-width:861px){.menu-panel.on{grid-template-columns:1fr 1fr}}
.dish{padding:1.3rem 0;border-bottom:1px dashed var(--line);display:grid;grid-template-columns:1fr auto;gap:.3rem 1rem;opacity:0;transform:translateY(10px);animation:dishIn .6s var(--ease-out) forwards;animation-delay:calc(var(--k)*60ms)}
@keyframes dishIn{to{opacity:1;transform:none}}
.dish h3{font:500 var(--step-1)/1.2 var(--font-display);letter-spacing:-.01em}
.dish .price{font:500 var(--step-0)/1 var(--font-mono);color:var(--accent);font-variant-numeric:tabular-nums}
.dish p{grid-column:1;color:var(--text-2);font-size:.95rem;max-width:42ch}
.tags{display:flex;gap:.35rem;grid-column:1/-1}
.tags span{font:600 .65rem/1 var(--font-mono);letter-spacing:.06em;padding:.25rem .45rem;border:1px solid var(--line);border-radius:6px;color:var(--text-2)}

/* signature cards */
.sig{display:grid;gap:12px}
@media (min-width:861px){.sig{grid-template-columns:repeat(3,1fr)}}
.sig-card{position:relative;border-radius:var(--r-lg);overflow:hidden;min-height:420px;display:flex;align-items:flex-end;isolation:isolate}
.sig-card .media{position:absolute;inset:0;border-radius:0;z-index:-1}
.sig-card::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(to top,rgb(0 0 0 / .8),transparent 60%)}
.sig-card div{padding:1.4rem;color:#fff}
.sig-card h3{font-size:var(--step-2)}.sig-card p{color:rgb(255 255 255 / .75);font-size:.95rem}

/* experience, gallery, reviews */
.exp{display:grid;gap:12px}
@media (min-width:861px){.exp{grid-template-columns:repeat(3,1fr)}}
/* gallery (.masonry, .shot) and the lightbox come from the core (A4.4) */
.reviews{display:grid;gap:12px}
@media (min-width:861px){.reviews{grid-template-columns:repeat(3,1fr)}}
.stars{color:var(--accent);letter-spacing:.15em;margin-bottom:.8rem}
.review p{font:400 var(--step-1)/1.4 var(--font-display)}
.review small{display:block;margin-top:1rem;color:var(--text-2)}

/* reservation */
.book{display:grid;gap:clamp(24px,5vw,72px)}
@media (min-width:861px){.book{grid-template-columns:1.2fr 1fr}}
.row2{display:grid;gap:12px;grid-template-columns:1fr 1fr}
.hours{border:1px solid var(--line);border-radius:var(--r-lg);padding:clamp(20px,3vw,32px)}
.hours li{display:flex;justify-content:space-between;padding:.7rem 0;border-bottom:1px solid var(--line);color:var(--text-2)}
.hours li.today{color:var(--text);font-weight:600}
.hours li:last-child{border:0}
.map-panel{border-radius:var(--r-lg);min-height:320px;border:1px solid var(--line);position:relative;overflow:hidden;
  background:linear-gradient(var(--line) 1px,transparent 1px) 0 0/40px 40px,linear-gradient(90deg,var(--line) 1px,transparent 1px) 0 0/40px 40px,var(--surface)}
.map-panel .pin{position:absolute;left:50%;top:50%;translate:-50% -50%;width:56px;height:56px;border-radius:50% 50% 50% 0;rotate:-45deg;background:var(--accent);display:grid;place-items:center;box-shadow:0 20px 40px -10px rgb(var(--accent-rgb) / .6)}
.map-panel .pin i{rotate:45deg;color:var(--on-accent);font-size:24px}

/* sticky mobile bar */
.dock{position:fixed;inset:auto 12px calc(12px + env(safe-area-inset-bottom)) 12px;z-index:880;display:flex;gap:8px;transform:translateY(140%);transition:transform .6s var(--ease-drawer)}
.dock.show{transform:none}
.dock .btn{flex:1}
@media (min-width:861px){.dock{display:none}}
```

### C6. Markup patterns

**Hero**

```html
<section class="hero" id="top-hero">
  <div class="hero-bg"><img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&h=1080&fit=crop&q=80&auto=format" width="1920" height="1080" alt="Candlelit dining room at Brasa" fetchpriority="high" decoding="async" data-seed="candlelit-dining-room"></div>
  <div class="wrap">
    <span class="open-pill" data-open aria-live="polite"><i></i><span>Checking hours…</span></span>
    <h1 data-split style="margin-top:1.2rem">Brasa Kitchen</h1>
    <p class="lead" data-reveal style="--i:3">Live-fire cooking and natural wine in the heart of Shoreditch.</p>
    <div class="cta-row" data-reveal style="--i:4"><a href="#reserve" class="btn btn-primary btn-lg" data-magnetic>Book a table</a><a href="#menu" class="btn btn-ghost btn-lg" style="color:#fff;border-color:rgb(255 255 255 / .35)">See menu</a></div>
  </div>
</section>
```

Add `.cta-row{display:flex;flex-wrap:wrap;gap:.75rem}` to the page CSS.

**Menu tabs** (ARIA tabs pattern)

```html
<div class="tabs" role="tablist" aria-label="Menu categories">
  <button class="tab" role="tab" id="t-starters" aria-selected="true" aria-controls="p-starters">Starters</button>
  <button class="tab" role="tab" id="t-mains" aria-selected="false" aria-controls="p-mains" tabindex="-1">Mains</button>
  <button class="tab" role="tab" id="t-desserts" aria-selected="false" aria-controls="p-desserts" tabindex="-1">Desserts</button>
  <button class="tab" role="tab" id="t-drinks" aria-selected="false" aria-controls="p-drinks" tabindex="-1">Drinks</button>
</div>
<div class="menu-panel on" role="tabpanel" id="p-starters" aria-labelledby="t-starters">
  <article class="dish" style="--k:0"><h3>Charred hispi cabbage</h3><span class="price">£9</span><p>Burnt butter, hazelnut, smoked anchovy cream.</p><div class="tags"><span>GF</span></div></article>
  <!-- 5–6 dishes per panel; prices in the venue’s currency; consistent formatting -->
</div>
```

**Reservation form**

```html
<form data-form data-success="You’re on the list. We’ll confirm by text within the hour." class="stack" style="--stack:1rem">
  <div class="row2"><div class="field"><label for="rn">Name</label><input id="rn" name="name" autocomplete="name" required></div>
  <div class="field"><label for="rp">Phone</label><input id="rp" name="tel" type="tel" autocomplete="tel" inputmode="tel" required></div></div>
  <div class="row2"><div class="field"><label for="rd">Date</label><input id="rd" name="date" type="date" required></div>
  <div class="field"><label for="rt">Time</label><select id="rt" name="time" required><option value="">Select</option><option>17:30</option><option>18:00</option><option>18:30</option><option>19:00</option><option>19:30</option><option>20:00</option><option>20:30</option><option>21:00</option></select></div></div>
  <div class="field"><label for="rg">Guests</label><select id="rg" name="guests"><option>1</option><option selected>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7+</option></select></div>
  <div class="field"><label for="rm">Notes</label><textarea id="rm" name="note" placeholder="Allergies, celebrations, high chair…"></textarea></div>
  <button class="btn btn-primary btn-lg btn-block" type="submit">Request booking</button>
  <p class="form-status" role="status" hidden></p>
</form>
```

List each guest count once.

### C7. Page-specific JavaScript

```js
(() => {
  const { $, $$, reduce, safe } = window.site;

  /* opening hours: edit HOURS to the venue (0 = Sunday). null = closed. [open, close] in 24h, close may pass midnight (e.g. 25 = 01:00) */
  const HOURS = { 0: [12, 21], 1: null, 2: [17, 23], 3: [17, 23], 4: [17, 23], 5: [12, 24], 6: [12, 24] };
  const pill = $('[data-open]');
  const fmt = h => { const n = h % 24; const p = n >= 12 ? 'pm' : 'am'; return ((n + 11) % 12 + 1) + p; };
  const paint = () => {
    const now = new Date(), d = now.getDay(), h = now.getHours() + now.getMinutes() / 60;
    const today = HOURS[d]; const yest = HOURS[(d + 6) % 7];
    const openNow = (today && h >= today[0] && h < Math.min(today[1], 24)) || (yest && yest[1] > 24 && h < yest[1] - 24);
    if (pill) { pill.classList.toggle('closed', !openNow);
      const label = $('span', pill);
      label.textContent = openNow ? `Open now · until ${fmt(today && h >= today[0] ? today[1] : yest[1])}` : 'Closed now · see hours'; }
    $$('.hours li').forEach((li, i) => li.classList.toggle('today', +li.dataset.day === d));
  };
  safe(paint); setInterval(() => safe(paint), 60000);

  /* menu tabs with arrow-key support */
  const tabs = $$('.tab'), panels = $$('.menu-panel');
  const select = i => {
    tabs.forEach((t, k) => { t.setAttribute('aria-selected', String(k === i)); t.tabIndex = k === i ? 0 : -1; });
    panels.forEach((p, k) => { p.classList.toggle('on', k === i); if (k === i) $$('.dish', p).forEach(d => { d.style.animation = 'none'; void d.offsetWidth; d.style.animation = ''; }); });
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(i));
    t.addEventListener('keydown', e => {
      const n = e.key === 'ArrowRight' ? (i + 1) % tabs.length : e.key === 'ArrowLeft' ? (i - 1 + tabs.length) % tabs.length : null;
      if (n !== null) { e.preventDefault(); select(n); tabs[n].focus(); }
    });
  });

  /* booking date: no past dates */
  const date = $('input[type="date"]');
  if (date) date.min = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

  /* second photo parallax inside its frame */
  const pf = $('.parallax-frame img');
  if (pf && window.gsap && window.ScrollTrigger && !reduce)
    gsap.fromTo(pf, { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.parallax-frame', scrub: true, start: 'top bottom', end: 'bottom top' } });

  /* sticky mobile dock appears after the hero */
  const dock = $('.dock'), hero = $('#top-hero');
  if (dock && hero && 'IntersectionObserver' in window)
    new IntersectionObserver(([e]) => dock.classList.toggle('show', !e.isIntersecting)).observe(hero);
})();
```

Hours list markup: `<ul class="hours"><li data-day="1"><span>Monday</span><span>Closed</span></li> …</ul>` with all seven days, matching the `HOURS` object. Dock markup: `<div class="dock"><a class="btn btn-ghost" href="tel:+442071234567"><i class="ti ti-phone"></i>Call</a><a class="btn btn-primary" href="#reserve">Book</a></div>`.

### C8. Photography

All photos come from the verified library (A4.2) following the visual plan (C3b). The gallery uses the core component (A4.4) with `figure.shot` items so every photo opens in the lightbox. If you need variety, re-use a photo at most twice with a different crop and a distinct `data-seed`. The site must still look good if every photo fails (the generated `plate`/`waves` art shows).

### C9. Content rules

- **Menu**: 20–24 dishes. Names are specific (“Charred hispi cabbage, burnt butter, hazelnut”), descriptions ≤ 14 words, one signature per category, prices in the local currency with consistent format. Add dietary tags.
- **Story**: warm first person from the chef/owner, with one concrete detail (a farm, a grandmother’s recipe, the oven’s origin).
- **Reviews**: reviewer first name + initial, source (Google, Time Out), one specific sentence about a dish.
- **Address, phone, email, hours**: realistic and consistent everywhere (hero pill, hours table, footer, schema).
- **SEO**: add JSON-LD `Restaurant` with `servesCuisine`, `address`, `openingHoursSpecification`, `telephone`, `priceRange`.

### C10. Restaurant-specific checklist

- [ ] Open-now pill and highlighted “today” row follow the real hours
- [ ] Menu tabs are keyboard operable and re-animate dishes on switch
- [ ] Booking form has no past dates and a clear success message
- [ ] Mobile dock shows Call and Book after the hero and never overlaps the footer content (add bottom padding to the footer on mobile)
- [ ] Food photos have a scrim under any text, warm colour treatment, consistent crops
- [ ] Phone numbers use `tel:`, addresses link to maps

---

## ═══════════════════════════════════════════════
## PART D — QUICK-START PROMPTS
## ═══════════════════════════════════════════════

```
Build a website for BRASA KITCHEN, a live-fire restaurant with natural wine in Shoreditch, London. Vibe: warm, dark, candlelit.
Palette: Terracotta. Hours: Tue–Thu 17:00–23:00, Fri–Sat 12:00–00:00, Sun 12:00–21:00, closed Monday. Invent the menu.
```

```
Build a website for NOMAD ROASTERS, a specialty coffee shop and bakery in Pune. Vibe: bright, calm, minimal. Palette: Ink & Cream.
Hours: daily 7:30–19:00. Invent 18 items (espresso, filter, pastries, brunch) priced in INR.
```

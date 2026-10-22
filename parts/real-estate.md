# PREMIUM REAL ESTATE / PROPERTY WEBSITE — MASTER PROMPT v1.0
### One prompt → one complete, elegant, animated `index.html` for an agency, developer, broker or luxury property brand

> **HOW TO USE**
> 1. Paste this ENTIRE file into any capable AI (Claude, GPT, Gemini…).
> 2. Then send: `Build a website for <AGENCY/DEVELOPER>, a <residential/luxury/commercial> real estate <agency/developer> in <CITY>. Vibe: <words>. Listings: <list or "invent 8">. Currency: <INR/USD/AED…>.`
> 3. The AI returns a single `index.html`. Save it and deploy anywhere.

If any detail is missing, **invent believable specifics** instead of asking questions.

<!-- IMAGES: property,home,hotel,travel,people -->
{{CORE}}

---

## ═══════════════════════════════════════════════
## PART C — REAL ESTATE SPECIFICATION
## ═══════════════════════════════════════════════

### C1. Goal

Property buyers decide with their eyes and their wallets. Show **beautiful, large imagery**, let visitors **filter listings in two taps**, give them an **affordability tool (EMI/mortgage calculator)**, and make enquiring or booking a viewing effortless. Trust (licence, years, homes sold) is visible early.

### C2. Direction

| Positioning | Palette (A3) | Fonts |
| --- | --- | --- |
| Luxury / villas | **Noir Gold** | Cormorant Garamond + Hanken Grotesk |
| Modern apartments, architecture | **Glacier** (light) | Instrument Serif + Geist |
| Family homes, mid-market | **Clinic** or **Ink & Cream** (light) | Fraunces + DM Sans |
| Commercial / developer | **Blueprint** or **Solar** | Space Grotesk + Geist |

Generous space, large serif headings, thin dividers. Buttons are restrained (rounded pills in neutral or accent).

### C3. Section order (all required)

1. **Hero** — full-bleed architectural photo with scrim, headline, and a **floating search bar** (City · Type · Bedrooms · Max budget · Search) that filters the listings below and scrolls to them.
2. **Trust strip** — years in business, homes sold (counter), average days on market, regulatory/licence line.
3. **Featured listings** — 6–9 cards with image, price, title, locality, beds/baths/area, tag (New / Open house / Price drop), shortlist heart; **filter result count, sort select, and empty state**.
4. **Property detail dialog** — opens from a card: gallery (main + thumbnails), key facts, description, features list, “Book a viewing” button.
5. **Mortgage / EMI calculator** — sliders (price, down payment %, rate %, tenure) with a live donut and monthly payment.
6. **Neighbourhoods** — 4 tiles with photo, name, average price per area, one-line vibe.
7. **Why us / process** — 4 steps (Brief → Shortlist → Viewings → Closing) with icons.
8. **Agents** — 3–4 portraits with speciality, languages, phone.
9. **Testimonials** — 3 quotes mentioning the property type and timeline.
10. **Sell with us / valuation form** — address, property type, email, phone; success state.
11. **Footer** — office address, licence number, socials, small-print disclaimer.

### C3b. Visual plan (MANDATORY; keys refer to the photo library in A4.2)

Property is bought with the eyes: photography must be generous and consistent.

| Where | What to build | Photos |
| --- | --- | --- |
| Hero | Full-bleed exterior with scrim | luxury: `property.24` · modern: `property.03` · tropical: `property.04` |
| Listing cards (9) | Exteriors, 4:3, each unique | `property.03` `property.04` `property.05` `property.06` `property.07` `property.09` `property.14` `property.18` `property.25` |
| Listing galleries (3 photos each) | Card exterior first, then 2 interiors from this pool | `property.01` `property.08` `property.10` `property.11` `property.12` `property.13` `property.26` `property.27` `property.28` `home.03` `home.14` `home.15` |
| Neighbourhoods (4 tiles, 3:4) | City/area shots | `travel.03` `travel.04` `travel.10` `travel.11` (or `property.20` `property.02` for Toronto/skyline-style markets) |
| **Gallery** (`id="gallery"`, add to nav “Gallery”) | “Inside our homes”: masonry of **12** interiors and details, chips **Living · Kitchen & dining · Bedrooms · Outdoors** | Living: `property.01` `property.10` `property.11` `property.26` `property.27` `home.03` · Kitchen & dining: `property.13` `property.28` · Bedrooms: `home.15` `hotel.09` · Outdoors: `property.24` `hotel.02` |
| Agents (4) | 2 women, 2 men | `people.06` `people.07` `people.11` `people.25` |
| Testimonials | 3 portraits | `people.00` `people.12` `people.21` |

Use `<body data-art-kinds="skyline,grid,mesh">`. Total distinct photos ≥ 34. Every listing’s dialog must show its own 3-photo gallery.

### C4. Signature moment

**Live search that reshapes the page**: choosing filters in the hero updates the listing grid in place with a soft staggered re-entry and an animated result count, and the **EMI donut** redraws as sliders move. Gallery images in the detail dialog cross-fade.

### C5. Page-specific CSS (append after A6)

```css
.hero{position:relative;min-height:100svh;display:grid;align-items:center;padding:120px 0 140px;isolation:isolate;overflow:clip}
.hero-bg{position:absolute;inset:0;z-index:-1}
.hero-bg img{width:100%;height:100%;object-fit:cover;transform:scale(1.08);animation:settle 2.4s var(--ease-out) forwards}
@keyframes settle{to{transform:scale(1)}}
.hero-bg::after{content:"";position:absolute;inset:0;background:linear-gradient(to top,rgb(0 0 0 / .65),rgb(0 0 0 / .25) 60%,rgb(0 0 0 / .45))}
.hero h1{font-size:var(--step-5);line-height:.92;letter-spacing:-.04em;color:#fff;max-width:11ch}
.hero .lead{color:rgb(255 255 255 / .82);margin-top:1.2rem}
.finder{position:absolute;left:50%;bottom:clamp(20px,4vw,48px);translate:-50% 0;width:min(1100px,100% - 2*var(--gutter));display:grid;gap:10px;padding:14px;border-radius:24px;background:rgb(var(--bg-rgb,11 11 12) / .86);-webkit-backdrop-filter:blur(18px) saturate(1.4);backdrop-filter:blur(18px) saturate(1.4);border:1px solid var(--line);grid-template-columns:1fr 1fr}
@media (min-width:861px){.finder{grid-template-columns:repeat(4,1fr) auto;align-items:end;border-radius:999px;padding:12px 14px 12px 26px}}
.finder label{display:grid;gap:.3rem;font:500 .68rem/1 var(--font-mono);letter-spacing:.12em;text-transform:uppercase;color:var(--text-3)}
.finder select{min-height:44px;background:transparent;border:0;border-bottom:1px solid var(--line);font:500 1rem/1 var(--font-body);color:var(--text);padding:0 .2rem;text-transform:none;letter-spacing:0}
.finder select option{color:#111}
.finder .btn{grid-column:1/-1}@media (min-width:861px){.finder .btn{grid-column:auto}}

.trust{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem;padding-block:clamp(56px,8vw,100px) 0}
@media (min-width:861px){.trust{grid-template-columns:repeat(4,1fr)}}
.trust b{display:block;font:500 var(--step-4)/1 var(--font-display);letter-spacing:-.04em;font-variant-numeric:tabular-nums}

.list-head{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:end;gap:1rem;margin-bottom:2rem}
.list-tools{display:flex;gap:.8rem;align-items:center;flex-wrap:wrap}
.sort{min-height:44px;padding:0 1rem;border-radius:var(--r-pill);border:1px solid var(--line);background:var(--surface);font-size:16px}
.count{font:500 var(--step--1)/1 var(--font-mono);letter-spacing:.08em;text-transform:uppercase;color:var(--text-2)}
.listings{display:grid;gap:clamp(16px,2.4vw,28px);grid-template-columns:1fr}
@media (min-width:700px){.listings{grid-template-columns:repeat(2,1fr)}}
@media (min-width:1100px){.listings{grid-template-columns:repeat(3,1fr)}}
.home{display:grid;gap:.8rem;animation:homeIn .7s var(--ease-out) both;animation-delay:calc(var(--k,0)*60ms)}
@keyframes homeIn{from{opacity:0;transform:translateY(18px)}}
.home[hidden]{display:none}
.home .media{aspect-ratio:4/3;border-radius:var(--r-lg)}
.home .media img{transition:transform 1.2s var(--ease-out)}
@media (hover:hover) and (pointer:fine){.home:hover .media img{transform:scale(1.05)}}
.tag-p{position:absolute;left:.8rem;top:.8rem;padding:.35rem .75rem;border-radius:var(--r-pill);background:var(--text);color:var(--bg);font:600 .68rem/1 var(--font-mono);letter-spacing:.08em;text-transform:uppercase}
.save{position:absolute;right:.7rem;top:.7rem;width:42px;height:42px;border-radius:50%;display:grid;place-items:center;font-size:20px;background:rgb(var(--bg-rgb,11 11 12) / .72);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);transition:transform var(--t-press)}
.save:active{transform:scale(.9)}.save[aria-pressed="true"]{color:var(--accent)}
.home-price{font:500 var(--step-2)/1 var(--font-display);letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.home h3{font:500 1.05rem/1.3 var(--font-body);letter-spacing:0}
.home .loc{color:var(--text-2);display:flex;gap:.35rem;align-items:center;font-size:.92rem}
.facts{display:flex;flex-wrap:wrap;gap:.4rem 1.1rem;color:var(--text-2);font-size:.9rem;padding-top:.7rem;border-top:1px solid var(--line)}
.facts span{display:inline-flex;gap:.4rem;align-items:center}.facts i{color:var(--accent)}
.home button.open{position:absolute;inset:0;z-index:1;border-radius:var(--r-lg)}
.empty{grid-column:1/-1;text-align:center;padding:4rem 1rem;color:var(--text-2)}

/* detail dialog */
dialog.sheet{border:1px solid var(--line);border-radius:var(--r-lg);background:var(--bg);color:var(--text);padding:0;width:min(1040px,calc(100% - 24px));max-height:calc(100dvh - 24px);overflow:auto;margin:auto}
dialog.sheet::backdrop{background:rgb(0 0 0 / .7);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px)}
dialog.sheet[open]{animation:sheetIn .45s var(--ease-out)}
@keyframes sheetIn{from{opacity:0;transform:translateY(16px) scale(.98)}}
.sheet-close{position:absolute;right:.8rem;top:.8rem;z-index:3;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:rgb(var(--bg-rgb,11 11 12) / .8);border:1px solid var(--line);font-size:20px}
.sheet-grid{display:grid}@media (min-width:861px){.sheet-grid{grid-template-columns:1.25fr 1fr}}
.gal-main{position:relative;aspect-ratio:4/3}
.gal-main img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:opacity .45s}
.gal-main img.out{opacity:0}
.thumbs{display:flex;gap:6px;padding:6px;overflow-x:auto;scrollbar-width:none}
.thumbs button{flex:0 0 84px;aspect-ratio:4/3;border-radius:8px;overflow:hidden;opacity:.6;outline-offset:2px;transition:opacity .25s}
.thumbs button[aria-current="true"]{opacity:1;outline:2px solid var(--accent)}
.thumbs img{width:100%;height:100%;object-fit:cover}
.sheet-info{padding:clamp(20px,3vw,36px);display:grid;gap:1rem;align-content:start}
.kv{display:grid;grid-template-columns:1fr 1fr;gap:.8rem}.kv div{padding:.8rem;border:1px solid var(--line);border-radius:12px}
.kv small{display:block;color:var(--text-3);font:500 .68rem/1 var(--font-mono);letter-spacing:.1em;text-transform:uppercase;margin-bottom:.3rem}
.feat{display:flex;flex-wrap:wrap;gap:.4rem}

/* EMI */
.emi{display:grid;gap:clamp(20px,4vw,56px);align-items:center}
@media (min-width:861px){.emi{grid-template-columns:1.1fr .9fr}}
.sliders{display:grid;gap:1.6rem}
.slider label{display:flex;justify-content:space-between;gap:1rem;font-weight:500;margin-bottom:.6rem}
.slider output{font:600 1rem/1 var(--font-mono);color:var(--accent);font-variant-numeric:tabular-nums}
input[type=range].rng{-webkit-appearance:none;appearance:none;width:100%;height:28px;background:transparent;cursor:pointer}
input[type=range].rng::-webkit-slider-runnable-track{height:4px;border-radius:99px;background:linear-gradient(90deg,var(--accent) var(--fill,50%),var(--line) var(--fill,50%))}
input[type=range].rng::-moz-range-track{height:4px;border-radius:99px;background:var(--line)}
input[type=range].rng::-moz-range-progress{height:4px;border-radius:99px;background:var(--accent)}
input[type=range].rng::-webkit-slider-thumb{-webkit-appearance:none;width:24px;height:24px;border-radius:50%;background:var(--text);border:4px solid var(--accent);margin-top:-10px}
input[type=range].rng::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:var(--text);border:4px solid var(--accent)}
.emi-card{display:grid;gap:1.2rem;justify-items:center;text-align:center}
.donut{width:min(260px,70vw);aspect-ratio:1;transform:rotate(-90deg)}
.donut circle{fill:none;stroke-width:4.2}
.donut .bg{stroke:var(--surface-2)}
.donut .p{stroke:var(--accent);transition:stroke-dasharray .8s var(--ease-out)}
.donut .i{stroke:var(--text-3);transition:stroke-dasharray .8s var(--ease-out),stroke-dashoffset .8s var(--ease-out)}
.emi-big{font:500 var(--step-4)/1 var(--font-display);letter-spacing:-.04em;font-variant-numeric:tabular-nums}
.legend{display:flex;gap:1.4rem;flex-wrap:wrap;justify-content:center;color:var(--text-2);font-size:.9rem}
.legend i{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:.4rem}

.hoods{display:grid;gap:12px}@media (min-width:700px){.hoods{grid-template-columns:repeat(2,1fr)}}@media (min-width:1100px){.hoods{grid-template-columns:repeat(4,1fr)}}
.hood{position:relative;aspect-ratio:3/4;border-radius:var(--r-lg);overflow:hidden;isolation:isolate;color:#fff;display:flex;align-items:flex-end}
.hood .media{position:absolute;inset:0;border-radius:0;z-index:-1}.hood::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(to top,rgb(0 0 0 / .78),transparent 60%)}
.hood div{padding:1.2rem}.hood small{opacity:.8;font:500 .72rem/1.4 var(--font-mono);letter-spacing:.06em}
.steps{display:grid;gap:12px}@media (min-width:861px){.steps{grid-template-columns:repeat(4,1fr)}}
.agents{display:grid;gap:12px;grid-template-columns:repeat(2,1fr)}@media (min-width:861px){.agents{grid-template-columns:repeat(4,1fr)}}
.agent .media{aspect-ratio:4/5;border-radius:var(--r-lg)}.agent h3{margin-top:.8rem;font-size:var(--step-1)}.agent small{color:var(--text-2);display:block}
.quotes{display:grid;gap:12px}@media (min-width:861px){.quotes{grid-template-columns:repeat(3,1fr)}}
.quotes blockquote{font:400 var(--step-1)/1.4 var(--font-display)}
.valuation{display:grid;gap:clamp(24px,5vw,72px)}@media (min-width:861px){.valuation{grid-template-columns:1fr 1fr}}
.row2{display:grid;gap:12px;grid-template-columns:1fr 1fr}
.disclaimer{font-size:.78rem;color:var(--text-3);max-width:80ch}
```

### C6. Markup patterns

**Finder (hero)** (ids required)

```html
<form class="finder" id="finder" aria-label="Search homes">
  <label>City<select name="city"><option value="">Any</option><option>Bandra</option><option>Juhu</option><option>Powai</option></select></label>
  <label>Type<select name="type"><option value="">Any</option><option value="villa">Villa</option><option value="apartment">Apartment</option><option value="penthouse">Penthouse</option></select></label>
  <label>Bedrooms<select name="beds"><option value="0">Any</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option></select></label>
  <label>Max budget<select name="max"><option value="0">Any</option><option value="30000000">₹3 Cr</option><option value="60000000">₹6 Cr</option><option value="100000000">₹10 Cr</option></select></label>
  <button class="btn btn-primary" type="submit"><i class="ti ti-search" aria-hidden="true"></i>Search</button>
</form>
```

Option values and city names must match the invented listings.

**Listing card (static HTML; the data-attributes drive the filters and the dialog)**

```html
<article class="home" data-city="Bandra" data-type="villa" data-beds="4" data-baths="5" data-area="3,800" data-price="85000000"
         data-title="Sea-facing Art Deco villa" data-addr="Pali Hill, Bandra West" data-desc="Restored 1938 villa with a private garden, double-height living room and a rooftop terrace."
         data-feat="Private garden,Rooftop terrace,Sea view,3 parking,Smart home"
         data-gallery="https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=1400&h=1050&fit=crop&q=80&auto=format,https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1400&h=1050&fit=crop&q=80&auto=format,https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400&h=1050&fit=crop&q=80&auto=format">
  <div class="media">
    <img src="https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800&h=600&fit=crop&q=80&auto=format" width="800" height="600" alt="Modern glass villa at dusk in Bandra" loading="lazy" decoding="async" data-seed="bandra-villa">
    <span class="tag-p">New</span>
    <button class="save" aria-pressed="false" aria-label="Shortlist Sea-facing Art Deco villa"><i class="ti ti-heart" aria-hidden="true"></i></button>
    <button class="open" aria-label="View details: Sea-facing Art Deco villa"></button>
  </div>
  <div><p class="home-price">₹8.5 Cr</p><h3>Sea-facing Art Deco villa</h3><p class="loc"><i class="ti ti-map-pin" aria-hidden="true"></i>Pali Hill, Bandra West</p></div>
  <div class="facts"><span><i class="ti ti-bed" aria-hidden="true"></i>4 beds</span><span><i class="ti ti-bath" aria-hidden="true"></i>5 baths</span><span><i class="ti ti-ruler-measure" aria-hidden="true"></i>3,800 sq ft</span></div>
</article>
```

Put `.save` and `.open` as siblings; `.open` sits under `.save` by z-order (give `.save{z-index:2}`).

**Detail dialog (one per page)**

```html
<dialog class="sheet" id="detail" aria-label="Property details">
  <button class="sheet-close" id="detail-close" aria-label="Close"><i class="ti ti-x" aria-hidden="true"></i></button>
  <div class="sheet-grid">
    <div><div class="gal-main"><img id="g-main" alt=""></div><div class="thumbs" id="g-thumbs"></div></div>
    <div class="sheet-info">
      <p class="eyebrow" id="d-addr"></p><h2 id="d-title" style="font-size:var(--step-3)"></h2><p class="home-price" id="d-price"></p>
      <div class="kv" id="d-kv"></div><p class="muted" id="d-desc"></p><div class="feat" id="d-feat"></div>
      <a href="#contact" class="btn btn-primary btn-lg btn-block" id="d-book">Book a viewing</a>
    </div>
  </div>
</dialog>
```

**EMI calculator markup** (ids required): sliders `#e-price` (min 1000000, max 200000000, step 500000), `#e-down` (0–80, step 1, default 20), `#e-rate` (5–14, step 0.05, default 8.5), `#e-years` (5–30, step 1, default 20), each with `<output>`; results `#e-emi`, `#e-total`, `#e-interest`, and an SVG `<svg class="donut" viewBox="0 0 36 36"><circle class="bg" cx="18" cy="18" r="15.9155"/><circle class="p" id="arc-p" cx="18" cy="18" r="15.9155" pathLength="100"/><circle class="i" id="arc-i" cx="18" cy="18" r="15.9155" pathLength="100"/></svg>`.

### C7. Page-specific JavaScript

```js
(() => {
  const { $, $$, lenis, scrollToEl, reduce, safe } = window.site;
  const LOCALE = 'en-IN', CUR = 'INR';                 /* AI: set for the market (e.g. en-US/USD, en-AE/AED) */
  const money = n => new Intl.NumberFormat(LOCALE, { style: 'currency', currency: CUR, maximumFractionDigits: 0 }).format(n);
  const short = n => new Intl.NumberFormat(LOCALE, { style: 'currency', currency: CUR, notation: 'compact', maximumFractionDigits: 2 }).format(n);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const lock = on => { lenis ? (on ? lenis.stop() : lenis.start()) : (document.body.style.overflow = on ? 'hidden' : ''); };

  /* ───── listings: filter, sort, count ───── */
  const homes = $$('.home'), grid = $('.listings'), form = $('#finder'), count = $('#result-count'), sort = $('#sort');
  const empty = document.createElement('div'); empty.className = 'empty'; empty.hidden = true;
  empty.innerHTML = '<i class="ti ti-home-off" style="font-size:40px" aria-hidden="true"></i><p>No homes match those filters yet. Try widening your budget.</p>';
  grid && grid.append(empty);

  const apply = () => {
    const f = form ? Object.fromEntries(new FormData(form)) : {};
    const beds = +f.beds || 0, max = +f.max || 0;
    let shown = 0;
    homes.forEach(h => {
      const ok = (!f.city || h.dataset.city === f.city) && (!f.type || h.dataset.type === f.type) && (+h.dataset.beds >= beds) && (!max || +h.dataset.price <= max);
      h.hidden = !ok;
      if (ok) { h.style.setProperty('--k', shown++); h.style.animation = 'none'; void h.offsetWidth; h.style.animation = ''; }
    });
    empty.hidden = shown > 0;
    if (count) count.textContent = `${shown} ${shown === 1 ? 'home' : 'homes'}`;
  };
  const order = () => {
    const by = sort ? sort.value : 'new', list = [...homes];
    if (by === 'low') list.sort((a, b) => a.dataset.price - b.dataset.price);
    if (by === 'high') list.sort((a, b) => b.dataset.price - a.dataset.price);
    if (by === 'new') list.sort((a, b) => homes.indexOf(a) - homes.indexOf(b));
    list.forEach(h => grid.insertBefore(h, empty));
  };
  if (homes.length) {
    form && form.addEventListener('submit', e => { e.preventDefault(); apply(); order(); scrollToEl($('#listings')); });
    form && form.addEventListener('change', apply);
    sort && sort.addEventListener('change', () => { order(); apply(); });
    apply();
  }

  /* shortlist */
  const KEY = 'homes-saved';
  const saved = (() => { try { return new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch { return new Set(); } })();
  homes.forEach(h => {
    const btn = $('.save', h); if (!btn) return;
    const id = h.dataset.title;
    const paint = () => { btn.setAttribute('aria-pressed', String(saved.has(id))); btn.innerHTML = `<i class="ti ti-heart${saved.has(id) ? '-filled' : ''}" aria-hidden="true"></i>`; };
    paint();
    btn.addEventListener('click', e => { e.stopPropagation(); saved.has(id) ? saved.delete(id) : saved.add(id); try { localStorage.setItem(KEY, JSON.stringify([...saved])); } catch {} paint(); });
  });

  /* ───── detail dialog with gallery ───── */
  const dlg = $('#detail');
  if (dlg) {
    const main = $('#g-main'), thumbs = $('#g-thumbs'); let opener = null;
    const setImg = (src, alt) => { main.classList.add('out'); setTimeout(() => { main.src = src; main.alt = alt; main.classList.remove('out'); }, reduce ? 0 : 180); };
    const open = h => {
      const gal = (h.dataset.gallery || '').split(',').filter(Boolean), t = h.dataset.title;
      $('#d-addr').textContent = h.dataset.addr; $('#d-title').textContent = t; $('#d-price').textContent = money(+h.dataset.price);
      $('#d-desc').textContent = h.dataset.desc;
      $('#d-kv').innerHTML = [['Bedrooms', h.dataset.beds], ['Bathrooms', h.dataset.baths], ['Area', h.dataset.area + ' sq ft'], ['Type', h.dataset.type]].map(([k, v]) => `<div><small>${esc(k)}</small>${esc(v)}</div>`).join('');
      $('#d-feat').innerHTML = (h.dataset.feat || '').split(',').filter(Boolean).map(f => `<span class="pill">${esc(f.trim())}</span>`).join('');
      thumbs.innerHTML = gal.map((g, i) => `<button data-i="${i}" aria-label="Photo ${i + 1} of ${gal.length}" aria-current="${i === 0}"><img src="${esc(g.replace(/w=\d+&h=\d+/, 'w=240&h=180'))}" alt="" loading="lazy"></button>`).join('');
      main.src = gal[0] || ''; main.alt = t + ', photo 1';
      thumbs.onclick = e => { const b = e.target.closest('button'); if (!b) return; const i = +b.dataset.i; $$('button', thumbs).forEach(x => x.setAttribute('aria-current', String(x === b))); setImg(gal[i], `${t}, photo ${i + 1}`); };
      opener = document.activeElement; dlg.showModal(); lock(true);
    };
    $$('.home .open').forEach(b => b.addEventListener('click', () => open(b.closest('.home'))));
    $('#detail-close').addEventListener('click', () => dlg.close());
    dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('close', () => { lock(false); opener && opener.focus && opener.focus({ preventScroll: true }); });
    $('#d-book').addEventListener('click', e => { e.preventDefault(); dlg.close(); setTimeout(() => scrollToEl($('#contact')), 60); });
  }

  /* ───── EMI calculator ───── */
  const E = { price: $('#e-price'), down: $('#e-down'), rate: $('#e-rate'), years: $('#e-years') };
  if (E.price) {
    const out = { emi: $('#e-emi'), total: $('#e-total'), int: $('#e-interest'), p: $('#arc-p'), i: $('#arc-i') };
    const fill = el => el.style.setProperty('--fill', ((el.value - el.min) / (el.max - el.min)) * 100 + '%');
    const calc = () => {
      const price = +E.price.value, downPct = +E.down.value, rate = +E.rate.value, yrs = +E.years.value;
      const loan = price * (1 - downPct / 100), r = rate / 12 / 100, n = yrs * 12;
      const emi = r === 0 ? loan / n : loan * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
      const total = emi * n, interest = total - loan, pPct = total ? (loan / total) * 100 : 100;
      $('#o-price').textContent = short(price); $('#o-down').textContent = downPct + '% · ' + short(price * downPct / 100);
      $('#o-rate').textContent = rate.toFixed(2) + '%'; $('#o-years').textContent = yrs + ' yrs';
      out.emi.textContent = money(Math.round(emi)); out.total.textContent = short(total); out.int.textContent = short(interest);
      out.p.style.strokeDasharray = `${pPct} ${100 - pPct}`;
      out.i.style.strokeDasharray = `${100 - pPct} ${pPct}`; out.i.style.strokeDashoffset = -pPct;
      Object.values(E).forEach(fill);
    };
    Object.values(E).forEach(el => el.addEventListener('input', calc)); calc();
  }
})();
```

Add `<span id="result-count" class="count" role="status"></span>`, `<select id="sort" class="sort">` (Newest · Price low to high · Price high to low), an `id="listings"` on the listings section, and `<output>` elements with ids `o-price o-down o-rate o-years` beside each slider label.

### C8. Content rules

- **Brand**: specific name, city, year founded, regulatory/licence line (e.g. “RERA registered · MH-AG-2011”). Invent plausible but non-real registration numbers and say they are placeholders in the closing notes.
- **Listings**: 6–9 homes across 3 localities and 3 types, prices realistic for the city and **consistent** between the card text, `data-price` and the dialog. Mix tags (New · Open house · Price drop). Each has 3 gallery images, 4–6 features, a believable address.
- **Neighbourhoods**: average price per sq ft, commute/school/greenery notes.
- **Agents**: first name + surname, languages, speciality, phone with `tel:` link.
- **Compliance**: footer disclaimer: “Prices and availability are indicative and subject to change. Images are representative.” EMI tool note: “Estimate only; actual rates vary by lender.”
- **Photos:** all from the verified library (A4.2) following the visual plan (C3b); the gallery section uses the core component (A4.4) in addition to the per-listing galleries.
- **SEO**: JSON-LD `RealEstateAgent` plus `Offer`s for listings.

### C9. Real-estate checklist

- [ ] Finder filters the grid, updates the count, and scrolls to results; every option matches real listing data
- [ ] Sort works and keeps filters; empty state appears when nothing matches
- [ ] Cards open the dialog by click and keyboard; gallery thumbnails switch photos; Esc closes and returns focus
- [ ] Shortlist hearts persist and have accessible labels
- [ ] EMI donut and figures update live; slider fills track the thumb; numbers use tabular figures
- [ ] Hero photo has a scrim; finder remains legible and usable at 390px (2×2 grid)
- [ ] Disclaimers present; no invented guarantees (“best price”, “100% safe”)

---

## ═══════════════════════════════════════════════
## PART D — QUICK-START PROMPTS
## ═══════════════════════════════════════════════

```
Build a website for HAVELI & CO, a luxury residential real estate agency in Mumbai (Bandra, Juhu, Powai). Vibe: quiet luxury.
Palette: Noir Gold. Currency: INR. Listings: invent 8, villas, apartments and penthouses between ₹2 Cr and ₹15 Cr.
```

```
Build a website for NORTHWAY HOMES, a family-focused real estate developer in Toronto. Vibe: bright, trustworthy, modern.
Palette: Clinic (light). Currency: CAD. Listings: invent 8 townhomes and condos between $650k and $1.8M.
```

# PREMIUM E-COMMERCE STORE WEBSITE — MASTER PROMPT v1.0
### One prompt → one complete, animated, working storefront `index.html` (catalogue, filters, quick view, cart drawer, promo code, checkout flow)

> **HOW TO USE**
> 1. Paste this ENTIRE file into any capable AI (Claude, GPT, Gemini…).
> 2. Then send: `Build a store for <BRAND> — <what it sells> in <CITY/COUNTRY>. Currency: <INR/USD/EUR…>. Vibe: <words>. Products: <list or "invent 12">. Free shipping over: <amount or "invent">.`
> 3. The AI returns a single `index.html`. Save it and deploy anywhere.

If any detail is missing, **invent believable specifics** instead of asking questions.

> **Honest scope:** this produces a front-end store with a real, persistent cart and a **demo** checkout (no payments are taken). To go live, connect the checkout to Stripe, Razorpay, Shopify Buy Button, Snipcart or similar; the closing notes must say this.

## ═══════════════════════════════════════════════
## PART A — CORE ENGINE (shared by every site type)
## ═══════════════════════════════════════════════

You are a senior design engineer and art director. You build **one complete, self-contained `index.html`** that looks like a paid agency made it: considered type, one memorable moment, tasteful custom animation, real-feeling content, flawless on a 390px phone.

Everything below the line "REFERENCE IMPLEMENTATION" is tested code. **Copy it verbatim** into the page, then build the sections on top of it. Do not rewrite the engine, do not "simplify" it, do not omit parts of it.

### A0. Non-negotiables

1. **One file.** All CSS in one `<style>`, all JS in `<script>` tags at the end of `<body>`. Libraries only from CDNs listed in A1. No build step, no npm, no local assets.
2. **Complete output.** Never write "rest of the code here", "similar to above", or truncate. Every section is fully written with real content.
3. **Mobile first.** Design at 390px, then enhance for 768 / 1100 / 1440. No horizontal scroll at any width.
4. **Real content.** No Lorem Ipsum. Invent believable names, numbers, prices, testimonials, addresses, hours for the business. Specific beats generic ("Cut onboarding from 9 days to 2", not "Boost productivity").
5. **One direction, one signature moment.** Choose a single aesthetic and one unforgettable detail (a kinetic headline, a 3D hero, a pinned scroll story, an unexpected colour hit). Everything else supports it quietly.
6. **Progressive enhancement.** Content is visible without JS. JS adds the hidden/animated state (the reference CSS already does this through the `.js` class).
7. **Accessible by default.** Semantic landmarks, one `h1`, labelled controls, visible `:focus-visible`, contrast ≥ 4.5:1 (3:1 for large text), `prefers-reduced-motion` honoured, `alt` on every image.
8. **No emoji as icons**, no Font Awesome, no purple-gradient-on-white, no identical image-left/text-right rows repeated, no Inter/Roboto/Arial as the display font.
9. **Only animate `transform` and `opacity`** (plus `clip-path`). Never `transition: all`. Never `ease-in` on UI.
10. **Placeholders must be swappable:** put contact details, social URLs and form action in obvious places and mention them in the closing notes.

### A1. CDN manifest (pinned versions; use only what the page needs)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<!-- FONTS_LINK: replace with the Google Fonts <link> for the chosen pairing (display=swap, only weights used) -->

<!-- Icons: Tabler Icons webfont (outline icons: <i class="ti ti-NAME"></i>) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.49.0/dist/tabler-icons.min.css">

<!-- end of body -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.js"></script>
```

Optional, only when a section needs it:
- Swiper (carousel): `https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css` and `.min.js`
- Three.js (3D): import map, see the 3D part of the type-specific section if present. Never as a plain script tag.

Every library call must be guarded (`if (window.gsap) { … }`) so the page still reads correctly if a CDN fails.

### A2. Icons (Tabler)

Use `<i class="ti ti-ICON" aria-hidden="true"></i>`. Size with `font-size`, colour inherits from text. One stroke weight, one size scale (16 / 20 / 24 / 32). Put feature icons in a 48px soft tile. Icon-only buttons need `aria-label`.

Reliable names: `arrow-right`, `arrow-up-right`, `arrow-narrow-right`, `menu-2`, `x`, `check`, `circle-check`, `star`, `star-filled`, `heart`, `shopping-bag`, `mail`, `phone`, `map-pin`, `clock`, `calendar-event`, `bolt`, `rocket`, `shield-check`, `lock`, `code`, `terminal-2`, `cpu`, `cloud`, `chart-line`, `sparkles`, `brand-github`, `brand-linkedin`, `brand-instagram`, `brand-x`, `brand-youtube`, `brand-dribbble`, `brand-behance`, `brand-whatsapp`, `sun`, `moon`, `plus`, `minus`, `chevron-down`, `download`, `copy`, `world`, `device-mobile`, `palette`, `camera`, `tools-kitchen-2`, `coffee`, `flame`, `leaf`.

### A3. Palette & type decisions

Pick ONE palette and ONE font pairing for the brief. The palette is expressed only as the CSS variables in the reference `:root` (override those values; never hard-code colours elsewhere).

| Palette | Mood | `--bg` | `--surface` | `--text` | `--accent` | `--accent-2` |
| --- | --- | --- | --- | --- | --- | --- |
| Ember | bold, sport, automotive | `#0b0b0c` | `#141416` | `#f4f2ee` | `#ff5a36` | `#ffb02e` |
| Noir Gold | luxury, hotel, jewellery | `#0a0907` | `#14110d` | `#f0ebe3` | `#c9a84c` | `#e8c96d` |
| Ink & Cream (light) | editorial, fashion | `#f6f3ee` | `#ffffff` | `#14120f` | `#14120f` | `#c8492f` |
| Moss | organic, wellness, food | `#0f1410` | `#161d17` | `#eef2ea` | `#9bd36a` | `#e6d9a8` |
| Blueprint | SaaS, dev tools | `#080b12` | `#10151f` | `#e9eef7` | `#4f8cff` | `#7be0c3` |
| Violet Hour | creative, music, gaming | `#0c0912` | `#150f20` | `#efe9fb` | `#9b6bff` | `#ff6bd5` |
| Citrus (light) | playful retail, cafés | `#fffaf0` | `#ffffff` | `#1d1608` | `#ff7a00` | `#2b8a3e` |
| Clinic (light) | medical, B2B trust | `#f4f9fb` | `#ffffff` | `#0c2430` | `#0a8ca8` | `#12b886` |
| Terracotta | craft, hospitality | `#15100d` | `#1e1713` | `#f5ece4` | `#d9744a` | `#e9c9a0` |
| Mint Ledger | fintech | `#07100d` | `#0e1915` | `#e8f4ef` | `#2fd49a` | `#c2f06a` |
| Rose Quartz (light) | beauty, spa | `#fbf4f3` | `#ffffff` | `#2a1417` | `#d6457a` | `#f0b8a8` |
| Solar | energy, industrial | `#070707` | `#101010` | `#f2f2ee` | `#f5b301` | `#ff6a1f` |
| Glacier (light) | architecture, minimal | `#eef2f4` | `#ffffff` | `#10181d` | `#1f5f7a` | `#9fb8c4` |
| Mono Lime | brutalist, tech-art | `#0a0a0a` | `#111111` | `#f1f1f1` | `#c8ff3d` | `#ffffff` |

For light palettes also set `--text-2`/`--text-3`/`--line` as dark-with-alpha and set `--on-accent` to whichever of `#fff`/near-black gives ≥ 4.5:1 on `--accent`. If the accent fails 4.5:1 as text on `--bg`, use it for fills and lines only.

Font pairings (display + body [+ mono]):
- Luxury editorial: **Instrument Serif** + **Geist** · Cormorant Garamond + Hanken Grotesk
- Tech precise: **Space Grotesk** + **Geist** + JetBrains Mono
- Dark industrial: **Barlow Condensed** + Barlow + IBM Plex Mono
- Organic soft: **Fraunces** + DM Sans
- Playful bold: **Bricolage Grotesque** + Outfit
- Brutalist: **Archivo Black** + Archivo + Space Mono
- Retro-futurist: **Syne** + Chakra Petch + Share Tech Mono
- Clean corporate: **Plus Jakarta Sans** only

### A4. Images

Primary: Unsplash direct URLs.

```
https://images.unsplash.com/photo-<ID>?w=<W>&h=<H>&fit=crop&q=80&auto=format
```

Sizes: hero 1920×1080 (q 80), card 800×1000 or 800×600, square 600×600, avatar 160×160, lightbox 1600.

Rules:
- Every `<img>` has `width`, `height` (matching the ratio), `alt`, `decoding="async"`, and `loading="lazy"` except the first-viewport image (`fetchpriority="high"`).
- Put each image inside `<div class="media">` and add `data-seed="two-words"`. The reference JS swaps a failed image for a `picsum.photos` seeded photo, and if that fails too the `.media` shows a CSS gradient. Pages must therefore look fine even with no photos.
- Use only photo IDs you are confident exist (lists in the type-specific section). Prefer fewer, larger, well-cropped photos over many small ones.
- Where there is no topical photo (portfolios, abstract SaaS, brand-led pages) generate artwork in CSS/SVG instead: layered gradients, grain, shapes, device mockups built in HTML. This is more distinctive and never breaks.
- Darken photos under text with a scrim (`linear-gradient(to top, rgb(0 0 0 / .7), transparent 60%)`), never rely on image brightness for contrast.
- Hero images get a slow `scale(1.08 → 1)` settle; cards get a hover zoom to `1.05` (pointer devices only).

### A5. Motion principles (applied in the reference code)

- **Purpose first.** Name why each motion exists: feedback, spatial continuity, hierarchy, delight. Delight is reserved for once-per-visit moments (hero, loader, section reveals).
- **Curves:** `--ease-out: cubic-bezier(.23,1,.32,1)` for entrances and hovers; `--ease-in-out: cubic-bezier(.77,0,.175,1)` for things travelling across the screen; `--ease-drawer: cubic-bezier(.32,.72,0,1)` for menus and sheets; `linear` only for marquees and progress.
- **Durations:** press 120ms · hover 180ms · small UI 220ms · menus 400–600ms · reveals 800–1000ms · hero 1000–1400ms.
- **Stagger** 30–80ms per item (the reference uses `--i` × 70ms for blocks and 26ms per character).
- **Scroll reveal:** `translateY(28px)` + fade, once, triggered at ~12% visibility.
- **Pointer effects** (magnetic buttons, tilt, cursor) only on `(hover:hover) and (pointer:fine)`.
- **Reduced motion:** no travel, no parallax, no loops; fades only.
- **Performance:** `will-change` only on elements that currently animate, no layout properties, pause offscreen loops, scroll listeners passive.
- Exactly **one** pinned/scrubbed scene per page unless the type-specific section says otherwise.

---

## REFERENCE IMPLEMENTATION — copy verbatim

### A6. Base CSS (place first inside `<style>`)

```css
/* ───────── tokens ───────── */
:root{
  /* palette: OVERRIDE these values with the chosen palette */
  --bg:#0b0b0c; --surface:#141416; --surface-2:#1b1b1f;
  --text:#f4f2ee; --text-2:rgb(244 242 238 / .66); --text-3:rgb(244 242 238 / .4);
  --line:rgb(255 255 255 / .09);
  --accent:#ff5a36; --accent-2:#ffb02e; --accent-rgb:255 90 54; --on-accent:#0b0b0c;
  --ok:#35c18a; --err:#f0615d;

  /* type: OVERRIDE font families */
  --font-display:'Space Grotesk',system-ui,sans-serif;
  --font-body:'Geist',system-ui,sans-serif;
  --font-mono:'JetBrains Mono',ui-monospace,monospace;

  /* fluid type scale */
  --step--1:clamp(.78rem,.76rem + .1vw,.875rem);
  --step-0:clamp(1rem,.96rem + .2vw,1.125rem);
  --step-1:clamp(1.2rem,1.1rem + .5vw,1.5rem);
  --step-2:clamp(1.6rem,1.35rem + 1.1vw,2.3rem);
  --step-3:clamp(2.1rem,1.6rem + 2.4vw,3.8rem);
  --step-4:clamp(2.8rem,1.8rem + 5vw,6.5rem);
  --step-5:clamp(3.2rem,1.6rem + 8.6vw,10.5rem);

  /* shape, space, motion */
  --r-sm:10px; --r-md:16px; --r-lg:28px; --r-pill:999px;
  --gutter:clamp(16px,4vw,40px); --maxw:1240px;
  --ease-out:cubic-bezier(.23,1,.32,1);
  --ease-in-out:cubic-bezier(.77,0,.175,1);
  --ease-drawer:cubic-bezier(.32,.72,0,1);
  --t-press:120ms; --t-hover:180ms; --t-pop:240ms;
}

/* ───────── reset ───────── */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{-webkit-text-size-adjust:100%;scrollbar-width:thin;scrollbar-color:var(--accent) var(--bg)}
html.lenis,html.lenis body{height:auto}
.lenis.lenis-smooth{scroll-behavior:auto!important}
.lenis.lenis-stopped{overflow:hidden}
body{min-height:100dvh;background:var(--bg);color:var(--text);font:400 var(--step-0)/1.6 var(--font-body);
  -webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;overflow-x:clip}
img,svg,video,canvas{display:block;max-width:100%}
img{height:auto}
a{color:inherit;text-decoration:none}
button,input,select,textarea{font:inherit;color:inherit;background:none;border:0}
button{cursor:pointer}
ul,ol{list-style:none}
:focus-visible{outline:2px solid var(--accent);outline-offset:3px;border-radius:4px}
::selection{background:var(--accent);color:var(--on-accent)}
[id]{scroll-margin-top:84px}
.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.skip-link{position:absolute;left:-999px;top:8px;z-index:10000;background:var(--accent);color:var(--on-accent);padding:.6rem 1rem;border-radius:8px}
.skip-link:focus{left:12px}
body::after{content:"";position:fixed;inset:0;z-index:9990;pointer-events:none;opacity:.05;mix-blend-mode:overlay;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}

/* ───────── layout ───────── */
.wrap{width:min(var(--maxw),100% - 2*var(--gutter));margin-inline:auto}
.sec{padding-block:clamp(72px,11vw,160px);position:relative}
.sec-tight{padding-block:clamp(48px,7vw,96px)}
.grid{display:grid;gap:clamp(12px,2vw,24px)}
.stack>*+*{margin-top:var(--stack,1rem)}

/* ───────── type ───────── */
h1,h2,h3,h4{font-family:var(--font-display);font-weight:500;text-wrap:balance}
.display{font-size:var(--step-5);line-height:.92;letter-spacing:-.04em}
h1{font-size:var(--step-4);line-height:.96;letter-spacing:-.035em}
h2{font-size:var(--step-3);line-height:1;letter-spacing:-.03em}
h3{font-size:var(--step-1);line-height:1.15;letter-spacing:-.015em}
p{text-wrap:pretty}
.lead{font-size:var(--step-1);line-height:1.45;color:var(--text-2);max-width:56ch}
.eyebrow{display:inline-flex;align-items:center;gap:.6rem;font:500 var(--step--1)/1 var(--font-mono);letter-spacing:.14em;text-transform:uppercase;color:var(--text-2)}
.eyebrow::before{content:"";width:22px;height:1px;background:var(--accent)}
.mono{font-family:var(--font-mono)}
.num{font-variant-numeric:tabular-nums}
.muted{color:var(--text-2)}
.accent{color:var(--accent)}

/* ───────── buttons ───────── */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:.6rem;min-height:48px;padding:0 1.5rem;border-radius:var(--r-pill);
  font-weight:600;letter-spacing:-.005em;white-space:nowrap;position:relative;
  transition:transform var(--t-press) var(--ease-out),background-color var(--t-hover) var(--ease-out),color var(--t-hover) var(--ease-out),border-color var(--t-hover) var(--ease-out),box-shadow var(--t-hover) var(--ease-out)}
.btn:active{transform:scale(.97)}
.btn .ti{font-size:1.15em;transition:transform var(--t-pop) var(--ease-out)}
.btn-primary{background:var(--accent);color:var(--on-accent)}
.btn-ghost{border:1px solid var(--line);color:var(--text)}
.btn-lg{min-height:56px;padding:0 2rem;font-size:1.05rem}
.btn-block{width:100%}
.btn[disabled]{opacity:.5;pointer-events:none}
.btn.is-loading{color:transparent;pointer-events:none}
.btn.is-loading::after{content:"";position:absolute;width:18px;height:18px;border:2px solid var(--on-accent);border-right-color:transparent;border-radius:50%;animation:spin .7s linear infinite}
.btn-ghost.is-loading::after{border-color:var(--text);border-right-color:transparent}
@keyframes spin{to{transform:rotate(360deg)}}
[data-magnetic]{transition:transform .5s var(--ease-out)}
@media (hover:hover) and (pointer:fine){
  .btn-primary:hover{background:var(--accent-2);box-shadow:0 10px 40px -10px rgb(var(--accent-rgb) / .6)}
  .btn-ghost:hover{border-color:var(--text);background:rgb(255 255 255 / .04)}
  .btn:hover .ti-arrow-right,.btn:hover .ti-arrow-up-right,.btn:hover .ti-arrow-narrow-right{transform:translateX(3px)}
  .link-u{background:linear-gradient(currentColor,currentColor) 0 100%/0 1px no-repeat;transition:background-size .5s var(--ease-out)}
  .link-u:hover{background-size:100% 1px}
}

/* ───────── header + menu ───────── */
.site-header{position:fixed;inset:0 0 auto 0;z-index:900;transition:background-color .4s,backdrop-filter .4s,border-color .4s,transform .5s var(--ease-out);border-bottom:1px solid transparent}
.site-header.stuck{background:rgb(var(--bg-rgb,11 11 12) / .72);-webkit-backdrop-filter:blur(14px) saturate(1.4);backdrop-filter:blur(14px) saturate(1.4);border-bottom-color:var(--line)}
.header-in{display:flex;align-items:center;justify-content:space-between;gap:1.5rem;height:72px}
.logo{font:600 1.25rem/1 var(--font-display);letter-spacing:-.03em;display:inline-flex;align-items:center;gap:.5rem}
.logo i{display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--accent)}
.nav-links{display:none;gap:2rem}
.nav-links a{font-size:.95rem;color:var(--text-2);transition:color var(--t-hover)}
.nav-links a.active,.nav-links a:hover{color:var(--text)}
.header-cta{display:none}
.menu-btn{width:44px;height:44px;border-radius:50%;border:1px solid var(--line);display:grid;place-content:center;gap:5px;position:relative;z-index:1000}
.menu-btn span{display:block;width:18px;height:1.5px;background:var(--text);transition:transform .5s var(--ease-drawer),opacity .2s}
.menu-open .menu-btn span:nth-child(1){transform:translateY(3.25px) rotate(45deg)}
.menu-open .menu-btn span:nth-child(2){transform:translateY(-3.25px) rotate(-45deg)}
.mobile-menu{position:fixed;inset:0;z-index:950;background:var(--bg);display:flex;flex-direction:column;justify-content:center;padding:96px var(--gutter) 40px;
  clip-path:inset(0 0 100% 0);visibility:hidden;transition:clip-path .7s var(--ease-drawer),visibility 0s .7s}
.menu-open .mobile-menu{clip-path:inset(0);visibility:visible;transition-delay:0s}
.mobile-menu a.m-link{display:block;font:500 clamp(2.4rem,11vw,4rem)/1.1 var(--font-display);letter-spacing:-.035em;padding:.2em 0;border-bottom:1px solid var(--line);
  opacity:0;transform:translateY(24px);transition:opacity .5s,transform .7s var(--ease-out)}
.menu-open .mobile-menu a.m-link{opacity:1;transform:none;transition-delay:calc(.12s + var(--i,0)*60ms)}
.mobile-menu .m-foot{margin-top:2rem;display:flex;gap:1rem;flex-wrap:wrap;color:var(--text-2)}
@media (min-width:861px){
  .nav-links,.header-cta{display:flex}
  .menu-btn,.mobile-menu{display:none}
}
.progress{position:fixed;top:0;left:0;right:0;height:2px;z-index:1001;background:var(--accent);transform-origin:0 50%;transform:scaleX(0)}

/* ───────── media + cards ───────── */
.media{position:relative;overflow:hidden;background:linear-gradient(135deg,var(--surface-2),var(--surface));border-radius:var(--r-md)}
.media img{width:100%;height:100%;object-fit:cover}
.media.img-fail img{opacity:0}
.media.img-fail::after{content:"";position:absolute;inset:0;background:radial-gradient(80% 80% at 30% 20%,rgb(var(--accent-rgb) / .35),transparent 60%),radial-gradient(70% 70% at 80% 90%,rgb(255 255 255 / .06),transparent 60%)}
.scrim::after{content:"";position:absolute;inset:0;background:linear-gradient(to top,rgb(0 0 0 / .72),rgb(0 0 0 / .05) 60%);pointer-events:none}
.card{position:relative;background:var(--surface);border:1px solid var(--line);border-radius:var(--r-lg);padding:clamp(20px,3vw,32px);overflow:hidden;transition:border-color var(--t-hover),transform .5s var(--ease-out)}
.card::before{content:"";position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .4s;
  background:radial-gradient(420px circle at var(--mx,50%) var(--my,0%),rgb(var(--accent-rgb) / .14),transparent 60%)}
[data-tilt]{will-change:transform}
@media (hover:hover) and (pointer:fine){
  .card:hover{border-color:rgb(var(--accent-rgb) / .4)}
  .card:hover::before{opacity:1}
  .media img{transition:transform 1.2s var(--ease-out)}
  .zoom:hover .media img{transform:scale(1.05)}
}
.icon-tile{width:48px;height:48px;border-radius:14px;display:grid;place-items:center;background:var(--surface-2);border:1px solid var(--line);font-size:24px;color:var(--accent)}
.pill{display:inline-flex;align-items:center;gap:.4rem;padding:.35rem .8rem;border-radius:var(--r-pill);border:1px solid var(--line);font:500 var(--step--1)/1 var(--font-mono);color:var(--text-2)}

/* ───────── reveal system (hidden state exists only when JS runs) ───────── */
.js [data-reveal]{opacity:0;transform:translateY(28px);transition:opacity .9s var(--ease-out),transform 1s var(--ease-out);transition-delay:calc(var(--i,0)*70ms)}
.js [data-reveal].in{opacity:1;transform:none}
.js [data-split] .word{display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.14em;margin-bottom:-.14em}
.js [data-split] .char{display:inline-block;transform:translateY(112%);transition:transform 1.05s var(--ease-out);transition-delay:calc(var(--ci,0)*26ms)}
.js [data-split].in .char{transform:none}
.js .img-reveal{clip-path:inset(0 0 100% 0);transition:clip-path 1.3s var(--ease-in-out)}
.js .img-reveal.in{clip-path:inset(0)}
.js .img-reveal img{transform:scale(1.18);transition:transform 1.8s var(--ease-out)}
.js .img-reveal.in img{transform:scale(1)}

/* ───────── marquee ───────── */
.marquee{overflow:hidden;border-block:1px solid var(--line);padding-block:1.1rem}
.marquee-track{display:flex;gap:3rem;width:max-content;animation:marq var(--marq-speed,32s) linear infinite}
.marquee:hover .marquee-track{animation-play-state:paused}
.marquee-track span{font:500 var(--step-3)/1 var(--font-display);letter-spacing:-.03em;white-space:nowrap;display:inline-flex;align-items:center;gap:3rem}
.marquee-track span::after{content:"✦";font-size:.5em;color:var(--accent)}
@keyframes marq{to{transform:translateX(-50%)}}

/* ───────── cursor ───────── */
.cursor{display:none}
.has-cursor .cursor{display:block;position:fixed;top:0;left:0;width:34px;height:34px;margin:-17px 0 0 -17px;border:1px solid var(--accent);border-radius:50%;pointer-events:none;z-index:9995;
  transition:width .25s var(--ease-out),height .25s var(--ease-out),margin .25s var(--ease-out),background-color .25s}
.has-cursor .cursor.hover{width:64px;height:64px;margin:-32px 0 0 -32px;background:rgb(var(--accent-rgb) / .14)}

/* ───────── loader ───────── */
.loader{position:fixed;inset:0;z-index:9999;background:var(--bg);display:grid;place-items:center;transition:transform 1s var(--ease-in-out)}
.loader.done{transform:translateY(-100%)}
.loader-mark{font:600 clamp(2rem,8vw,4rem)/1 var(--font-display);letter-spacing:-.04em;animation:pulse 1.2s var(--ease-out) infinite alternate}
@keyframes pulse{from{opacity:.25}to{opacity:1}}

/* ───────── forms ───────── */
.field{display:grid;gap:.45rem}
.field label{font:500 var(--step--1)/1 var(--font-mono);letter-spacing:.1em;text-transform:uppercase;color:var(--text-2)}
.field input,.field textarea,.field select{width:100%;min-height:52px;padding:.85rem 1rem;border-radius:var(--r-sm);background:var(--surface);border:1px solid var(--line);font-size:16px;transition:border-color var(--t-hover),box-shadow var(--t-hover)}
.field textarea{min-height:140px;resize:vertical}
.field input::placeholder,.field textarea::placeholder{color:var(--text-3)}
.field input:focus-visible,.field textarea:focus-visible,.field select:focus-visible{outline:none;border-color:var(--accent);box-shadow:0 0 0 4px rgb(var(--accent-rgb) / .18)}
.field input:user-invalid,.field textarea:user-invalid{border-color:var(--err)}
.form-status{padding:.9rem 1rem;border-radius:var(--r-sm);border:1px solid var(--ok);color:var(--ok);background:rgb(53 193 138 / .08)}

/* ───────── footer ───────── */
.site-footer{border-top:1px solid var(--line);padding-block:clamp(40px,6vw,80px) 32px;color:var(--text-2)}
.footer-grid{display:grid;gap:2.5rem;grid-template-columns:1fr}
@media (min-width:861px){.footer-grid{grid-template-columns:1.4fr 1fr 1fr 1fr}}
.footer-grid h4{font:500 var(--step--1)/1 var(--font-mono);letter-spacing:.12em;text-transform:uppercase;color:var(--text);margin-bottom:1rem}
.footer-grid li+li{margin-top:.55rem}
.footer-bottom{margin-top:3rem;padding-top:1.5rem;border-top:1px solid var(--line);display:flex;flex-wrap:wrap;gap:1rem;justify-content:space-between;font-size:var(--step--1)}

/* ───────── reduced motion ───────── */
@media (prefers-reduced-motion:reduce){
  *,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}
  .js [data-reveal],.js [data-split] .char,.js .img-reveal,.js .img-reveal img{transform:none!important;clip-path:none!important}
  .marquee-track{animation:none}
}
```

### A7. Page shell (HTML skeleton, fill the `<main>` with sections)

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>BRAND — specific value proposition</title>
  <meta name="description" content="150–160 characters of real copy.">
  <meta name="theme-color" content="#0b0b0c">
  <meta property="og:title" content="BRAND — value proposition">
  <meta property="og:description" content="Same real copy.">
  <meta property="og:type" content="website">
  <!-- fonts + tabler + <style> with A6 CSS then page-specific CSS -->
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <div class="progress" aria-hidden="true"></div>
  <div class="cursor" aria-hidden="true"></div>
  <div class="loader" aria-hidden="true"><div class="loader-mark">BRAND</div></div>

  <header class="site-header">
    <div class="wrap header-in">
      <a href="#top" class="logo" aria-label="BRAND home"><i></i>BRAND</a>
      <nav class="nav-links" aria-label="Primary">
        <a href="#work">Work</a><a href="#about">About</a><a href="#contact">Contact</a>
      </nav>
      <a href="#contact" class="btn btn-primary header-cta" data-magnetic>Let’s talk <i class="ti ti-arrow-up-right" aria-hidden="true"></i></a>
      <button class="menu-btn" aria-label="Menu" aria-expanded="false" aria-controls="mobile-menu"><span></span><span></span></button>
    </div>
  </header>

  <nav class="mobile-menu" id="mobile-menu" aria-label="Mobile">
    <a class="m-link" style="--i:0" href="#work">Work</a>
    <a class="m-link" style="--i:1" href="#about">About</a>
    <a class="m-link" style="--i:2" href="#contact">Contact</a>
    <div class="m-foot"><a href="mailto:hello@brand.com">hello@brand.com</a></div>
  </nav>

  <main id="main"><span id="top"></span>
    <!-- sections -->
  </main>

  <footer class="site-footer"> … </footer>

  <!-- CDN scripts (A1) -->
  <script> /* A8 core engine, verbatim */ </script>
  <script> /* page-specific script, uses window.site */ </script>
</body>
</html>
```

Set `--bg-rgb` in `:root` to the RGB triplet of `--bg` (for the translucent sticky header), for example `--bg-rgb: 11 11 12;`.

Markup conventions the engine understands:
- `data-reveal` on any element → fades up when it enters the viewport.
- `data-stagger` on a parent → its children reveal in sequence.
- `data-split` on a **plain-text** heading → per-character rise (an `sr-only` copy is added for screen readers). Do not put child markup inside it.
- `.img-reveal` on a `.media` → curtain image reveal.
- `data-count="1280"` on a number (write the final number in the HTML) → counts up when visible; decimals respected.
- `data-magnetic` on buttons, `data-tilt` on cards (pointer devices only), `data-speed="2"` on an element inside a wrapper for desktop parallax, `data-cursor` on any non-link element that should enlarge the cursor.
- `form[data-form]` with an optional `data-success="message"` and a `<p class="form-status" hidden></p>` → validated demo submit with loading and success states (tell the user to connect a real endpoint such as Formspree).

### A8. Core engine JS (second to last `<script>`, verbatim)

```js
(() => {
  'use strict';
  const doc = document.documentElement;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const wide = () => innerWidth > 860;
  const safe = fn => { try { fn(); } catch (e) { console.warn(e); } };
  doc.classList.add('js');

  /* image fallback: picsum seeded photo, then CSS gradient */
  addEventListener('error', e => {
    const img = e.target;
    if (!(img instanceof HTMLImageElement) || img.dataset.fb) return;
    img.dataset.fb = '1';
    const seed = (img.dataset.seed || img.alt || 'site').trim().replace(/\s+/g, '-');
    img.src = `https://picsum.photos/seed/${encodeURIComponent(seed)}/${img.getAttribute('width') || 800}/${img.getAttribute('height') || 600}`;
    img.addEventListener('error', () => img.closest('.media')?.classList.add('img-fail'), { once: true });
  }, true);

  /* smooth scroll (Lenis) wired to ScrollTrigger */
  let lenis = null;
  const hasST = !!(window.gsap && window.ScrollTrigger);
  if (hasST) gsap.registerPlugin(ScrollTrigger);
  if (window.Lenis && !reduce) safe(() => {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    if (hasST) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  });
  const scrollToEl = (el, offset = -72) =>
    lenis ? lenis.scrollTo(el, { offset }) : el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });

  /* mobile menu */
  const menuBtn = $('.menu-btn');
  const setMenu = open => {
    doc.classList.toggle('menu-open', open);
    menuBtn?.setAttribute('aria-expanded', String(open));
    if (lenis) open ? lenis.stop() : lenis.start();
    else document.body.style.overflow = open ? 'hidden' : '';
  };
  menuBtn?.addEventListener('click', () => setMenu(!doc.classList.contains('menu-open')));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  addEventListener('resize', () => { if (wide()) setMenu(false); });

  /* anchor links */
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const t = $(id);
    if (!t) return;
    e.preventDefault();
    setMenu(false);
    requestAnimationFrame(() => scrollToEl(t));
  }));

  /* header state + progress bar */
  const bar = $('.progress'), header = $('.site-header');
  const onScroll = () => {
    const y = scrollY, max = doc.scrollHeight - innerHeight;
    header?.classList.toggle('stuck', y > 40);
    if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* current-section highlight */
  const navLinks = $$('.nav-links a[href^="#"]');
  if (navLinks.length && 'IntersectionObserver' in window) {
    const so = new IntersectionObserver(es => es.forEach(en => {
      if (en.isIntersecting) navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
    }), { rootMargin: '-45% 0px -50% 0px' });
    navLinks.map(a => $(a.getAttribute('href'))).filter(Boolean).forEach(s => so.observe(s));
  }

  /* split text into characters (plain-text headings only) */
  $$('[data-split]').forEach(el => {
    const label = el.textContent.trim().replace(/\s+/g, ' ');
    el.textContent = '';
    const sr = document.createElement('span'); sr.className = 'sr-only'; sr.textContent = label; el.append(sr);
    let ci = 0;
    const words = label.split(' ');
    words.forEach((word, wi) => {
      const w = document.createElement('span'); w.className = 'word'; w.setAttribute('aria-hidden', 'true');
      for (const ch of word) { const s = document.createElement('span'); s.className = 'char'; s.style.setProperty('--ci', ci++); s.textContent = ch; w.append(s); }
      el.append(w);
      if (wi < words.length - 1) el.append(' ');
    });
  });

  /* stagger helper */
  $$('[data-stagger]').forEach(p => Array.from(p.children).forEach((c, i) => { c.setAttribute('data-reveal', ''); c.style.setProperty('--i', i); }));

  /* counters */
  const fmt = (v, dec) => v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  const count = el => {
    const end = parseFloat(el.dataset.count), dec = (el.dataset.count.split('.')[1] || '').length;
    if (reduce || isNaN(end)) { el.textContent = fmt(end, dec); return; }
    const t0 = performance.now(), dur = 1700;
    const tick = t => {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = fmt(end * (1 - Math.pow(1 - p, 4)), dec);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  /* reveal engine: starts after the loader */
  let started = false;
  const start = () => {
    if (started) return; started = true;
    doc.classList.add('ready');
    const items = $$('[data-reveal],[data-split],.img-reveal');
    const counters = $$('[data-count]');
    if (!('IntersectionObserver' in window)) { items.forEach(el => el.classList.add('in')); counters.forEach(count); return; }
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add('in'); io.unobserve(en.target);
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    items.forEach(el => io.observe(el));
    const co = new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return;
      count(en.target); co.unobserve(en.target);
    }), { threshold: 0.6 });
    counters.forEach(el => co.observe(el));
    document.fonts?.ready.then(() => hasST && ScrollTrigger.refresh());
    window.dispatchEvent(new Event('site:ready'));
  };

  /* loader (once per session) */
  const loader = $('.loader');
  let seen = false;
  try { seen = !!sessionStorage.getItem('seen'); } catch {}
  const finish = () => {
    loader?.classList.add('done');
    setTimeout(() => loader?.remove(), 1100);
    try { sessionStorage.setItem('seen', '1'); } catch {}
    start();
  };
  if (!loader || reduce || seen) { loader?.remove(); start(); }
  else {
    const loaded = new Promise(r => document.readyState === 'complete' ? r() : addEventListener('load', r, { once: true }));
    Promise.all([loaded, new Promise(r => setTimeout(r, 900))]).then(finish);
    setTimeout(finish, 3200); /* failsafe */
  }

  /* parallax (desktop only) */
  if (hasST && !reduce) safe(() => gsap.matchMedia().add('(min-width: 861px)', () => {
    $$('[data-speed]').forEach(el => gsap.to(el, {
      yPercent: -parseFloat(el.dataset.speed || 1) * 10, ease: 'none',
      scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
    }));
  }));

  /* pointer effects */
  if (fine && !reduce) {
    $$('[data-magnetic]').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.2}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
    $$('[data-tilt]').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg)`;
        el.style.setProperty('--mx', (x + 0.5) * 100 + '%'); el.style.setProperty('--my', (y + 0.5) * 100 + '%');
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
    const dot = $('.cursor');
    if (dot) {
      doc.classList.add('has-cursor');
      let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
      addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; }, { passive: true });
      const loop = () => { cx += (x - cx) * 0.18; cy += (y - cy) * 0.18; dot.style.transform = `translate(${cx}px, ${cy}px)`; requestAnimationFrame(loop); };
      loop();
      document.addEventListener('pointerover', e => dot.classList.toggle('hover', !!(e.target.closest && e.target.closest('a, button, [data-cursor]'))));
    }
  }

  /* demo forms: validation, loading, success */
  $$('form[data-form]').forEach(f => {
    const status = $('.form-status', f), btn = $('button[type="submit"]', f);
    f.addEventListener('submit', e => {
      e.preventDefault();
      if (!f.checkValidity()) { f.reportValidity(); return; }
      btn?.classList.add('is-loading'); if (btn) btn.disabled = true;
      setTimeout(() => {
        btn?.classList.remove('is-loading'); if (btn) btn.disabled = false;
        f.reset();
        if (status) { status.textContent = f.dataset.success || 'Thanks — we’ll reply within a day.'; status.hidden = false; }
      }, 900);
    });
  });

  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  window.site = { lenis, reduce, fine, wide, $, $$, scrollToEl, safe };
})();
```

The second `<script>` (page-specific) may use `window.site`, listen for `site:ready`, and register extra GSAP/ScrollTrigger work.

---

## PART B — DELIVERY RULES (apply to every site type)

### B1. Process (do silently, then output only the result)

1. Read the brief; choose direction, palette (A3), font pairing (A3), signature moment.
2. Write the content first (headlines, copy, numbers, names) so layout follows the words.
3. Assemble: A6 CSS → page CSS → A7 shell → sections → A8 JS → page JS.
4. Run the checklist in B2 and fix anything that fails before answering.

### B2. Final quality checklist

- [ ] A6 CSS, A7 shell and A8 JS are all present and unmodified in behaviour
- [ ] Reads perfectly at 390px (single column, 48px targets, hero CTA visible without scrolling), at 768px, and at 1440px; no horizontal scroll
- [ ] No Lorem Ipsum; copy is specific; hero h1 is 4–10 words and outcome-led
- [ ] One display + one body font (mono optional); headline uses `clamp()` and tight tracking
- [ ] Contrast verified for body, accent text and any text over images (scrim present)
- [ ] Every interactive element has hover (pointer-gated), `:active`, `:focus-visible`; forms have labels, types, autocomplete, validation and a success state
- [ ] `reduce` and `fine` handled (already in engine); no ungated `:hover` motion
- [ ] Nav anchors match section `id`s; one `h1`; heading order logical
- [ ] Images: `width`/`height`/`alt`/`data-seed`/`loading`; page still looks good with photos blocked
- [ ] Icons are Tabler only, with `aria-hidden` or `aria-label`
- [ ] The signature moment exists, works, and is not buried under competing effects
- [ ] No `console` errors on load; every library call guarded; no `transition: all`

### B3. Output format

Reply with **one fenced ```html code block containing the entire `index.html`**, nothing truncated. After it, write at most five short lines: the direction and palette used, the signature moment, and the exact placeholders the owner must replace (contact email/phone, social links, form endpoint, real photos). No other commentary.

---

## ═══════════════════════════════════════════════
## PART C — E-COMMERCE SPECIFICATION
## ═══════════════════════════════════════════════

### C1. Goal

Make browsing effortless and buying feel safe: **clear products, fast add-to-bag, a cart that never loses state, honest totals.** Trust signals (shipping, returns, secure payment) sit close to every price and button.

### C2. Direction (match the products)

| Store | Palette (A3) | Fonts |
| --- | --- | --- |
| Fashion, jewellery | Noir Gold, or Ink & Cream (light) | Cormorant Garamond/Instrument Serif + Hanken Grotesk/Geist |
| Beauty, wellness | Rose Quartz (light) or Moss | Fraunces + DM Sans |
| Tech, gadgets | Blueprint or Mono Lime | Space Grotesk + Geist |
| Food, coffee, home | Terracotta or Citrus (light) | Fraunces + DM Sans |
| Sport, streetwear | Ember or Solar | Barlow Condensed + Barlow |

Product photography is the hero; chrome stays quiet. Use `aspect-ratio: 4/5` for all product images.

### C3. Section order (all required)

1. **Announcement bar** — “Free shipping over ₹2,999 · Easy 30-day returns” (dismissible, remembers choice).
2. **Header** — logo, nav (Shop · Collections · About · Contact), wishlist indicator optional, **cart button with live count badge**, mobile menu.
3. **Hero** — one featured collection: huge headline, short line, CTA to the shop, image or generated art, small trust row.
4. **Category tiles** — 3–4 large tiles linking to filtered shop views (clicking sets the category chip and scrolls to the grid).
5. **Shop** — toolbar (search, category chips, sort select, result count) + responsive product grid (2 columns on mobile, 3–4 on desktop).
6. **Feature strip** — Free shipping · 30-day returns · Secure payment · Support (Tabler icons).
7. **Lookbook / story** — editorial two-column block about the brand and materials.
8. **Reviews** — 3 customer reviews with stars, name, city, verified-buyer badge.
9. **Newsletter** — one-field form with 10% off promo reveal (`WELCOME10`).
10. **Footer** — shop links, help, payment icons (text pills), socials, © year.

**Overlays (always present):** cart drawer · quick-view dialog · checkout dialog · toast container.

### C4. Signature moment

**The cart drawer.** It slides in with `--ease-drawer`, shows a **free-shipping progress bar** that fills as items are added, supports quantity steppers, size labels, promo codes, persistent state (`localStorage`), and an honest totals breakdown (subtotal, discount, shipping, total). Add-to-bag always answers: the badge pops, a toast confirms, and the drawer opens.

### C5. Page-specific CSS (append after A6)

```css
/* announcement + header extras */
.announce{background:var(--accent);color:var(--on-accent);text-align:center;font:500 var(--step--1)/1 var(--font-mono);letter-spacing:.06em;padding:.7rem 2.6rem;position:relative}
.announce button{position:absolute;right:.4rem;top:50%;translate:0 -50%;width:36px;height:36px;display:grid;place-items:center;color:inherit}
.header-actions{display:flex;align-items:center;gap:.5rem}
.icon-btn{position:relative;width:44px;height:44px;border-radius:50%;border:1px solid var(--line);display:grid;place-items:center;font-size:20px;transition:background-color var(--t-hover),transform var(--t-press)}
.icon-btn:active{transform:scale(.94)}
@media (hover:hover) and (pointer:fine){.icon-btn:hover{background:var(--surface-2)}}
.badge-count{position:absolute;top:-4px;right:-4px;min-width:20px;height:20px;padding:0 5px;border-radius:var(--r-pill);background:var(--accent);color:var(--on-accent);font:600 .7rem/20px var(--font-mono);text-align:center;scale:0;transition:scale .35s cubic-bezier(.34,1.56,.64,1)}
.badge-count.on{scale:1}
.badge-count.pop{animation:popb .4s var(--ease-out)}
@keyframes popb{40%{transform:scale(1.35)}}
@media (min-width:861px){.menu-btn{display:none}}

/* hero */
.hero{padding:clamp(110px,14vw,170px) 0 clamp(40px,6vw,80px)}
.hero-grid{display:grid;gap:clamp(24px,5vw,72px);align-items:center}
@media (min-width:861px){.hero-grid{grid-template-columns:1.05fr .95fr}}
.hero h1{font-size:var(--step-5);line-height:.9;letter-spacing:-.045em;max-width:9ch}
.hero .lead{margin:1.2rem 0 1.8rem}
.hero .media{aspect-ratio:4/5;border-radius:var(--r-lg)}
.trust-row{display:flex;flex-wrap:wrap;gap:.5rem 1.5rem;margin-top:1.8rem;color:var(--text-2);font-size:var(--step--1)}
.trust-row span{display:inline-flex;gap:.45rem;align-items:center}.trust-row i{color:var(--accent)}
.cta-row{display:flex;flex-wrap:wrap;gap:.75rem}

/* category tiles */
.tiles{display:grid;gap:12px;grid-template-columns:1fr 1fr}
@media (min-width:861px){.tiles{grid-template-columns:repeat(4,1fr)}}
.tile{position:relative;display:block;aspect-ratio:3/4;border-radius:var(--r-lg);overflow:hidden;isolation:isolate;text-align:left;color:#fff}
.tile .media{position:absolute;inset:0;border-radius:0;z-index:-1}
.tile::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(to top,rgb(0 0 0 / .7),transparent 55%)}
.tile span{position:absolute;left:1rem;bottom:1rem;right:1rem;display:flex;justify-content:space-between;align-items:center;font:500 var(--step-1)/1 var(--font-display)}

/* toolbar */
.toolbar{display:grid;gap:12px;margin:2rem 0}
@media (min-width:861px){.toolbar{grid-template-columns:1fr auto auto;align-items:center}}
.search{position:relative}
.search i{position:absolute;left:1rem;top:50%;translate:0 -50%;color:var(--text-3)}
.search input{width:100%;min-height:48px;padding:.7rem 1rem .7rem 2.8rem;border-radius:var(--r-pill);border:1px solid var(--line);background:var(--surface);font-size:16px}
.search input:focus-visible{outline:none;border-color:var(--accent);box-shadow:0 0 0 4px rgb(var(--accent-rgb) / .18)}
.chips{display:flex;gap:.45rem;overflow-x:auto;scrollbar-width:none;padding-bottom:2px}
.chips::-webkit-scrollbar{display:none}
.chip{padding:.6rem 1.1rem;min-height:44px;border-radius:var(--r-pill);border:1px solid var(--line);color:var(--text-2);white-space:nowrap;transition:background-color var(--t-hover),color var(--t-hover),border-color var(--t-hover)}
.chip[aria-pressed="true"]{background:var(--text);color:var(--bg);border-color:var(--text)}
.sort{min-height:48px;padding:0 1rem;border-radius:var(--r-pill);border:1px solid var(--line);background:var(--surface);font-size:16px}
.count{color:var(--text-2);font:500 var(--step--1)/1 var(--font-mono);letter-spacing:.08em;text-transform:uppercase}

/* product grid */
.pgrid{display:grid;grid-template-columns:repeat(2,1fr);gap:clamp(20px,3vw,40px) clamp(10px,2vw,24px)}
@media (min-width:861px){.pgrid{grid-template-columns:repeat(3,1fr)}}
@media (min-width:1200px){.pgrid{grid-template-columns:repeat(4,1fr)}}
.pcard{display:grid;gap:.7rem;animation:cardIn .7s var(--ease-out) both;animation-delay:calc(var(--k,0)*50ms)}
@keyframes cardIn{from{opacity:0;transform:translateY(18px)}}
.pmedia{aspect-ratio:4/5;border-radius:var(--r-md)}
.pmedia img{position:absolute;inset:0}
.pmedia img.alt{opacity:0;transition:opacity .5s}
@media (hover:hover) and (pointer:fine){.pcard:hover .pmedia img.alt{opacity:1}}
.badge-p{position:absolute;left:.7rem;top:.7rem;padding:.3rem .6rem;border-radius:var(--r-pill);background:var(--text);color:var(--bg);font:600 .65rem/1 var(--font-mono);letter-spacing:.08em;text-transform:uppercase}
.wish{position:absolute;right:.6rem;top:.6rem;width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:rgb(var(--bg-rgb,11 11 12) / .7);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);font-size:18px;transition:transform var(--t-press)}
.wish:active{transform:scale(.9)}
.wish[aria-pressed="true"]{color:var(--accent)}
.quick{position:absolute;inset:auto .7rem .7rem .7rem;min-height:44px;border-radius:var(--r-pill);background:var(--text);color:var(--bg);font-weight:600;opacity:0;transform:translateY(8px);transition:opacity .3s,transform .4s var(--ease-out)}
@media (hover:none){.quick{display:none}}
@media (hover:hover) and (pointer:fine){.pcard:hover .quick{opacity:1;transform:none}}
.pinfo{display:flex;justify-content:space-between;gap:.8rem;align-items:flex-start}
.pinfo h3{font:500 1rem/1.25 var(--font-body);letter-spacing:0}
.pinfo .muted{font-size:var(--step--1)}
.pprice{text-align:right;font-variant-numeric:tabular-nums}
.pprice s{display:block;color:var(--text-3);font-size:.8rem}
.rate{display:flex;align-items:center;gap:.25rem;color:var(--accent);font-size:.85rem}.rate small{color:var(--text-3);margin-left:.3rem}
.empty{grid-column:1/-1;text-align:center;padding:4rem 1rem;color:var(--text-2)}

/* strip, story, reviews, newsletter */
.strip{display:grid;gap:1rem;grid-template-columns:1fr 1fr;border-block:1px solid var(--line);padding-block:1.6rem}
@media (min-width:861px){.strip{grid-template-columns:repeat(4,1fr)}}
.strip div{display:flex;gap:.8rem;align-items:center}.strip i{font-size:26px;color:var(--accent)}.strip b{display:block;font-size:.95rem}.strip small{color:var(--text-2)}
.story{display:grid;gap:clamp(24px,5vw,72px);align-items:center}
@media (min-width:861px){.story{grid-template-columns:1fr 1fr}}
.story .media{aspect-ratio:4/5;border-radius:var(--r-lg)}
.reviews{display:grid;gap:12px}
@media (min-width:861px){.reviews{grid-template-columns:repeat(3,1fr)}}
.verified{display:inline-flex;gap:.3rem;align-items:center;color:var(--ok);font-size:.8rem}
.news{display:grid;gap:1rem;text-align:center;justify-items:center;border:1px solid var(--line);border-radius:var(--r-lg);padding:clamp(32px,6vw,80px) var(--gutter);background:var(--surface)}
.news form{display:flex;flex-wrap:wrap;gap:.6rem;width:min(520px,100%);justify-content:center}
.news .field{flex:1 1 240px}

/* cart drawer */
.overlay{position:fixed;inset:0;z-index:960;background:rgb(0 0 0 / .6);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);opacity:0;pointer-events:none;transition:opacity .4s}
.overlay.open{opacity:1;pointer-events:auto}
.drawer{position:fixed;top:0;right:0;bottom:0;z-index:970;width:min(440px,100vw);background:var(--bg);border-left:1px solid var(--line);display:flex;flex-direction:column;transform:translateX(100%);transition:transform .55s var(--ease-drawer);visibility:hidden}
.drawer.open{transform:none;visibility:visible}
.drawer-head{display:flex;justify-content:space-between;align-items:center;padding:1.1rem 1.25rem;border-bottom:1px solid var(--line)}
.ship-bar{padding:1rem 1.25rem;border-bottom:1px solid var(--line);font-size:.9rem}
.ship-bar .track{height:6px;border-radius:99px;background:var(--surface-2);margin-top:.6rem;overflow:hidden}
.ship-bar .track i{display:block;height:100%;width:100%;background:var(--accent);transform-origin:0 50%;transform:scaleX(var(--p,0));transition:transform .7s var(--ease-out)}
.drawer-body{flex:1;overflow-y:auto;padding:1rem 1.25rem;display:grid;align-content:start;gap:1rem;overscroll-behavior:contain}
.citem{display:grid;grid-template-columns:76px 1fr auto;gap:.9rem;align-items:center;animation:cardIn .5s var(--ease-out) both}
.citem .media{width:76px;aspect-ratio:4/5;border-radius:10px}
.citem h4{font:500 .95rem/1.25 var(--font-body)}
.citem small{color:var(--text-2)}
.stepper{display:inline-flex;align-items:center;border:1px solid var(--line);border-radius:var(--r-pill);margin-top:.4rem}
.stepper button{width:36px;height:36px;display:grid;place-items:center;border-radius:50%}
.stepper output{min-width:1.6rem;text-align:center;font:500 .9rem/1 var(--font-mono)}
.citem .right{display:grid;justify-items:end;gap:.5rem;font-variant-numeric:tabular-nums}
.link-btn{color:var(--text-3);font-size:.8rem;text-decoration:underline;text-underline-offset:3px;min-height:32px}
.cart-empty{display:grid;justify-items:center;gap:1rem;text-align:center;padding:3rem 1rem;color:var(--text-2)}
.cart-empty i{font-size:48px;color:var(--text-3)}
.drawer-foot{padding:1.1rem 1.25rem calc(1.1rem + env(safe-area-inset-bottom));border-top:1px solid var(--line);display:grid;gap:.8rem}
.promo{display:flex;gap:.5rem}.promo input{flex:1;min-height:44px;padding:0 1rem;border-radius:var(--r-pill);border:1px solid var(--line);background:var(--surface);font-size:16px;text-transform:uppercase}
.promo-msg{font-size:.85rem;min-height:1.2em}.promo-msg.ok{color:var(--ok)}.promo-msg.bad{color:var(--err)}
.sum{display:grid;gap:.4rem;font-variant-numeric:tabular-nums}
.sum div{display:flex;justify-content:space-between;color:var(--text-2)}
.sum .total{color:var(--text);font:600 1.15rem/1.2 var(--font-body);padding-top:.5rem;border-top:1px solid var(--line)}

/* dialogs */
dialog.sheet{border:1px solid var(--line);border-radius:var(--r-lg);background:var(--bg);color:var(--text);padding:0;width:min(920px,calc(100% - 24px));max-height:calc(100dvh - 24px);overflow:auto;margin:auto}
dialog.sheet::backdrop{background:rgb(0 0 0 / .7);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px)}
dialog.sheet[open]{animation:sheetIn .45s var(--ease-out)}
@keyframes sheetIn{from{opacity:0;transform:translateY(16px) scale(.98)}}
.sheet-grid{display:grid}
@media (min-width:761px){.sheet-grid{grid-template-columns:1fr 1fr}}
.sheet .media{aspect-ratio:4/5;border-radius:0}
.sheet-body{padding:clamp(18px,3vw,36px);display:grid;gap:1rem;align-content:start}
.sizes{display:flex;flex-wrap:wrap;gap:.5rem}
.sizes label{position:relative}
.sizes input{position:absolute;opacity:0;inset:0}
.sizes span{display:grid;place-items:center;min-width:48px;min-height:44px;padding:0 .8rem;border:1px solid var(--line);border-radius:12px;cursor:pointer;transition:background-color var(--t-hover),color var(--t-hover),border-color var(--t-hover)}
.sizes input:checked+span{background:var(--text);color:var(--bg);border-color:var(--text)}
.sizes input:focus-visible+span{outline:2px solid var(--accent);outline-offset:2px}
.sheet-close{position:absolute;right:.8rem;top:.8rem;z-index:2}
.co-grid{display:grid;gap:clamp(18px,3vw,36px);padding:clamp(18px,3vw,36px)}
@media (min-width:761px){.co-grid{grid-template-columns:1.2fr 1fr}}
.row2{display:grid;gap:12px;grid-template-columns:1fr 1fr}
.done{padding:clamp(32px,6vw,72px);text-align:center;display:grid;justify-items:center;gap:1rem}
.done i{font-size:56px;color:var(--ok)}

/* toasts */
.toasts{position:fixed;left:50%;bottom:calc(16px + env(safe-area-inset-bottom));translate:-50% 0;z-index:9000;display:grid;gap:.5rem;justify-items:center;pointer-events:none;width:min(440px,calc(100% - 24px))}
.toast{pointer-events:auto;display:flex;gap:.7rem;align-items:center;padding:.8rem 1.1rem;border-radius:var(--r-pill);background:var(--text);color:var(--bg);font-size:.92rem;box-shadow:0 20px 50px -10px rgb(0 0 0 / .5);animation:toastIn .5s var(--ease-out) both}
.toast.out{opacity:0;transform:translateY(8px);transition:opacity .3s,transform .35s var(--ease-out)}
@keyframes toastIn{from{opacity:0;transform:translateY(16px) scale(.96)}}
```

### C6. Markup that must exist (adapt copy; keep ids)

```html
<div class="announce" id="announce" role="region" aria-label="Announcement">Free shipping over ₹2,999 · Easy 30-day returns
  <button aria-label="Dismiss announcement" id="announce-x"><i class="ti ti-x" aria-hidden="true"></i></button></div>

<!-- header: replace the core header's CTA with actions -->
<header class="site-header"><div class="wrap header-in">
  <a href="#top" class="logo" aria-label="BRAND home"><i></i>BRAND</a>
  <nav class="nav-links" aria-label="Primary"><a href="#shop">Shop</a><a href="#story">Story</a><a href="#reviews">Reviews</a><a href="#contact">Contact</a></nav>
  <div class="header-actions">
    <button class="icon-btn" id="cart-btn" aria-label="Open bag"><i class="ti ti-shopping-bag" aria-hidden="true"></i><span class="badge-count" id="cart-count" aria-live="polite">0</span></button>
    <button class="menu-btn" aria-label="Menu" aria-expanded="false" aria-controls="mobile-menu"><span></span><span></span></button>
  </div>
</div></header>

<!-- shop section -->
<section class="sec" id="shop"><div class="wrap">
  <p class="eyebrow" data-reveal>Shop</p><h2 data-reveal>The collection</h2>
  <div class="toolbar">
    <label class="search"><span class="sr-only">Search products</span><i class="ti ti-search" aria-hidden="true"></i><input id="q" type="search" placeholder="Search products" autocomplete="off"></label>
    <label><span class="sr-only">Sort</span><select id="sort" class="sort"><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="rating">Top rated</option></select></label>
    <span class="count" id="count" role="status"></span>
  </div>
  <div class="chips" id="chips" role="group" aria-label="Categories"></div>
  <div class="pgrid" id="grid" style="margin-top:1.5rem"></div>
  <noscript><p class="muted">Enable JavaScript to browse the shop.</p></noscript>
</div></section>

<!-- overlays (place before the scripts) -->
<div class="overlay" id="overlay"></div>
<aside class="drawer" id="drawer" aria-label="Shopping bag" aria-hidden="true" inert>
  <div class="drawer-head"><h3>Your bag <span class="muted" id="drawer-n"></span></h3><button class="icon-btn" id="drawer-close" aria-label="Close bag"><i class="ti ti-x" aria-hidden="true"></i></button></div>
  <div class="ship-bar" id="ship-bar"><span id="ship-msg"></span><div class="track"><i id="ship-fill"></i></div></div>
  <div class="drawer-body" id="drawer-body"></div>
  <div class="drawer-foot" id="drawer-foot" hidden>
    <form class="promo" id="promo-form"><label class="sr-only" for="promo-in">Promo code</label><input id="promo-in" placeholder="Promo code" autocomplete="off"><button class="btn btn-ghost" type="submit">Apply</button></form>
    <p class="promo-msg" id="promo-msg" role="status"></p>
    <div class="sum" id="sum"></div>
    <button class="btn btn-primary btn-lg btn-block" id="checkout-btn">Checkout <i class="ti ti-arrow-right" aria-hidden="true"></i></button>
    <p class="fine-print muted" style="font-size:.8rem;text-align:center"><i class="ti ti-lock" aria-hidden="true"></i> Secure checkout · 30-day returns</p>
  </div>
</aside>

<dialog class="sheet" id="qv" aria-label="Quick view"><button class="icon-btn sheet-close" id="qv-close" aria-label="Close"><i class="ti ti-x" aria-hidden="true"></i></button><div class="sheet-grid" id="qv-body"></div></dialog>

<dialog class="sheet" id="co" aria-label="Checkout">
  <div id="co-form-view"><div class="co-grid">
    <form id="co-form" class="stack" style="--stack:1rem">
      <h3>Delivery details</h3>
      <div class="field"><label for="c-email">Email</label><input id="c-email" type="email" autocomplete="email" inputmode="email" required></div>
      <div class="row2"><div class="field"><label for="c-name">Full name</label><input id="c-name" autocomplete="name" required></div><div class="field"><label for="c-phone">Phone</label><input id="c-phone" type="tel" autocomplete="tel" inputmode="tel" required></div></div>
      <div class="field"><label for="c-addr">Address</label><input id="c-addr" autocomplete="street-address" required></div>
      <div class="row2"><div class="field"><label for="c-city">City</label><input id="c-city" autocomplete="address-level2" required></div><div class="field"><label for="c-zip">PIN / ZIP</label><input id="c-zip" autocomplete="postal-code" inputmode="numeric" required></div></div>
      <p class="muted" style="font-size:.85rem">Demo checkout: no payment is taken. Connect Stripe / Razorpay / Shopify to accept real orders.</p>
      <button class="btn btn-primary btn-lg btn-block" type="submit">Place order</button>
    </form>
    <div class="card"><h3>Order summary</h3><div id="co-items" class="stack" style="--stack:.7rem;margin-top:1rem"></div><div class="sum" id="co-sum" style="margin-top:1rem"></div></div>
  </div></div>
  <div class="done" id="co-done" hidden><i class="ti ti-circle-check" aria-hidden="true"></i><h2>Thank you!</h2><p class="lead" id="co-msg" style="text-align:center"></p><button class="btn btn-primary" id="co-ok">Continue shopping</button></div>
</dialog>

<div class="toasts" id="toasts" aria-live="polite"></div>
```

Important: cards, cart rows and dialogs are rendered by JavaScript **after** the engine's reveal observer has started, so they must NOT use `data-reveal` (they would stay invisible). They animate with the CSS `cardIn` keyframe above.

### C7. Page-specific JavaScript (the last `<script>`; replace PRODUCTS and CFG for the brand, keep the rest verbatim)

```js
(() => {
  const { $, $$, lenis, safe } = window.site;

  /* ───── configuration (AI: set for the brand) ───── */
  const CFG = { locale: 'en-IN', currency: 'INR', freeShip: 2999, shipFee: 149, promo: { WELCOME10: 0.10, FIRST15: 0.15 } };

  /* ───── catalogue (AI: write 12 products; distinct ids, real-feeling names, prices, ratings, 2 images each, sizes or [] ) ───── */
  const PRODUCTS = [
    { id: 'p1', name: 'Linen Overshirt', cat: 'Shirts', price: 3499, was: 4299, badge: 'Bestseller', rating: 4.8, reviews: 142, sizes: ['S', 'M', 'L', 'XL'],
      img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=1000&fit=crop&q=80&auto=format',
      img2: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&h=1000&fit=crop&q=80&auto=format',
      desc: 'Washed European linen with a relaxed boxy fit and corozo buttons.' },
    /* … 11 more … */
  ];

  /* ───── helpers ───── */
  const money = n => new Intl.NumberFormat(CFG.locale, { style: 'currency', currency: CFG.currency, maximumFractionDigits: 0 }).format(n);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const byId = id => PRODUCTS.find(p => p.id === id);
  const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
  const stars = r => Array.from({ length: 5 }, (_, i) => `<i class="ti ti-star${i < Math.round(r) ? '-filled' : ''}" aria-hidden="true"></i>`).join('');

  let cart = load('cart-v1', []).filter(i => byId(i.id));
  let wish = new Set(load('wish-v1', []));
  let promo = load('promo-v1', null);
  if (promo && !(promo in CFG.promo)) promo = null;
  const state = { cat: 'All', q: '', sort: 'featured' };
  let lastFocus = null;

  /* ───── toast ───── */
  const toast = (msg, icon = 'check') => {
    const el = document.createElement('div'); el.className = 'toast';
    el.innerHTML = `<i class="ti ti-${icon}" aria-hidden="true"></i><span>${esc(msg)}</span>`;
    $('#toasts').append(el);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 380); }, 2600);
  };

  /* ───── catalogue rendering ───── */
  const visible = () => {
    let list = PRODUCTS.filter(p => (state.cat === 'All' || p.cat === state.cat) && (!state.q || (p.name + ' ' + p.cat).toLowerCase().includes(state.q.toLowerCase())));
    if (state.sort === 'low') list = [...list].sort((a, b) => a.price - b.price);
    if (state.sort === 'high') list = [...list].sort((a, b) => b.price - a.price);
    if (state.sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  };
  const card = (p, i) => `
    <article class="pcard" style="--k:${i % 8}">
      <div class="pmedia media">
        <img src="${esc(p.img)}" width="800" height="1000" alt="${esc(p.name)}" loading="lazy" decoding="async" data-seed="${esc(p.id)}-a">
        ${p.img2 ? `<img class="alt" src="${esc(p.img2)}" width="800" height="1000" alt="" aria-hidden="true" loading="lazy" decoding="async" data-seed="${esc(p.id)}-b">` : ''}
        ${p.badge ? `<span class="badge-p">${esc(p.badge)}</span>` : ''}
        <button class="wish" data-wish="${esc(p.id)}" aria-pressed="${wish.has(p.id)}" aria-label="${wish.has(p.id) ? 'Remove from' : 'Add to'} wishlist: ${esc(p.name)}"><i class="ti ti-heart${wish.has(p.id) ? '-filled' : ''}" aria-hidden="true"></i></button>
        <button class="quick" data-qv="${esc(p.id)}">Quick view</button>
      </div>
      <div class="pinfo"><div><h3>${esc(p.name)}</h3><p class="muted">${esc(p.cat)}</p></div>
        <div class="pprice"><b>${money(p.price)}</b>${p.was ? `<s>${money(p.was)}</s>` : ''}</div></div>
      <div class="rate" aria-label="Rated ${p.rating} out of 5">${stars(p.rating)}<small>(${p.reviews})</small></div>
      <button class="btn btn-ghost btn-block" data-add="${esc(p.id)}">Add to bag</button>
    </article>`;
  const renderGrid = () => {
    const list = visible();
    $('#grid').innerHTML = list.length ? list.map(card).join('') : `<div class="empty"><i class="ti ti-mood-empty" style="font-size:40px"></i><p>No products match “${esc(state.q)}”.</p></div>`;
    $('#count').textContent = `${list.length} ${list.length === 1 ? 'item' : 'items'}`;
  };
  const renderChips = () => {
    const cats = ['All', ...new Set(PRODUCTS.map(p => p.cat))];
    $('#chips').innerHTML = cats.map(c => `<button class="chip" data-cat="${esc(c)}" aria-pressed="${c === state.cat}">${esc(c)}</button>`).join('');
  };
  const setCat = c => { state.cat = c; renderChips(); renderGrid(); };

  /* ───── cart maths ───── */
  const keyOf = (id, size) => id + '|' + (size || '');
  const totals = () => {
    const sub = cart.reduce((s, i) => s + byId(i.id).price * i.qty, 0);
    const disc = promo ? Math.round(sub * CFG.promo[promo]) : 0;
    const after = sub - disc;
    const ship = after === 0 ? 0 : after >= CFG.freeShip ? 0 : CFG.shipFee;
    return { sub, disc, after, ship, total: after + ship, count: cart.reduce((s, i) => s + i.qty, 0) };
  };
  const sumHTML = t => `
    <div><span>Subtotal</span><span>${money(t.sub)}</span></div>
    ${t.disc ? `<div><span>Discount (${esc(promo)})</span><span>−${money(t.disc)}</span></div>` : ''}
    <div><span>Shipping</span><span>${t.ship ? money(t.ship) : 'Free'}</span></div>
    <div class="total"><span>Total</span><span>${money(t.total)}</span></div>`;

  const persist = () => save('cart-v1', cart);
  const renderCart = () => {
    const t = totals(), badge = $('#cart-count');
    badge.textContent = t.count; badge.classList.toggle('on', t.count > 0);
    $('#drawer-n').textContent = t.count ? `(${t.count})` : '';
    const body = $('#drawer-body'), foot = $('#drawer-foot');
    if (!cart.length) {
      body.innerHTML = `<div class="cart-empty"><i class="ti ti-shopping-bag" aria-hidden="true"></i><p>Your bag is empty.</p><button class="btn btn-ghost" data-close-cart>Keep shopping</button></div>`;
      foot.hidden = true;
    } else {
      foot.hidden = false;
      body.innerHTML = cart.map(i => { const p = byId(i.id), k = keyOf(i.id, i.size); return `
        <div class="citem">
          <div class="media"><img src="${esc(p.img)}" width="152" height="190" alt="" loading="lazy" data-seed="${esc(p.id)}-a"></div>
          <div><h4>${esc(p.name)}</h4><small>${i.size ? 'Size ' + esc(i.size) + ' · ' : ''}${money(p.price)}</small>
            <div class="stepper"><button data-qty="${esc(k)}" data-d="-1" aria-label="Decrease quantity of ${esc(p.name)}"><i class="ti ti-minus" aria-hidden="true"></i></button><output>${i.qty}</output><button data-qty="${esc(k)}" data-d="1" aria-label="Increase quantity of ${esc(p.name)}"><i class="ti ti-plus" aria-hidden="true"></i></button></div></div>
          <div class="right"><b>${money(p.price * i.qty)}</b><button class="link-btn" data-remove="${esc(k)}">Remove</button></div>
        </div>`; }).join('');
      $('#sum').innerHTML = sumHTML(t);
    }
    const remaining = CFG.freeShip - t.after;
    $('#ship-msg').textContent = !cart.length ? `Free shipping on orders over ${money(CFG.freeShip)}` : remaining > 0 ? `You’re ${money(remaining)} away from free shipping` : 'You’ve unlocked free shipping';
    $('#ship-fill').style.setProperty('--p', Math.min(t.after / CFG.freeShip, 1));
    $('#promo-in').value = promo || '';
  };

  const add = (id, size, qty = 1) => {
    const k = keyOf(id, size), ex = cart.find(i => keyOf(i.id, i.size) === k);
    ex ? ex.qty += qty : cart.push({ id, size: size || '', qty });
    persist(); renderCart();
    const b = $('#cart-count'); b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
    toast(`${byId(id).name} added to bag`, 'shopping-bag');
  };
  const change = (k, d) => {
    const it = cart.find(i => keyOf(i.id, i.size) === k); if (!it) return;
    it.qty += d; if (it.qty <= 0) cart = cart.filter(i => i !== it);
    persist(); renderCart();
  };
  const remove = k => { cart = cart.filter(i => keyOf(i.id, i.size) !== k); persist(); renderCart(); };

  /* ───── drawer (focus managed, Esc to close, inert when closed) ───── */
  const drawer = $('#drawer'), overlay = $('#overlay');
  const lock = on => { lenis ? (on ? lenis.stop() : lenis.start()) : (document.body.style.overflow = on ? 'hidden' : ''); };
  const openCart = () => {
    lastFocus = document.activeElement; drawer.inert = false; drawer.setAttribute('aria-hidden', 'false');
    drawer.classList.add('open'); overlay.classList.add('open'); lock(true); $('#drawer-close').focus({ preventScroll: true });
  };
  const closeCart = () => {
    drawer.classList.remove('open'); overlay.classList.remove('open'); drawer.inert = true; drawer.setAttribute('aria-hidden', 'true');
    lock(false); lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true });
  };
  $('#cart-btn').addEventListener('click', openCart);
  $('#drawer-close').addEventListener('click', closeCart);
  overlay.addEventListener('click', closeCart);
  addEventListener('keydown', e => { if (e.key === 'Escape' && drawer.classList.contains('open')) closeCart(); });

  /* ───── promo ───── */
  $('#promo-form').addEventListener('submit', e => {
    e.preventDefault();
    const code = $('#promo-in').value.trim().toUpperCase(), msg = $('#promo-msg');
    if (code in CFG.promo) { promo = code; save('promo-v1', promo); msg.textContent = `Code ${code} applied: ${Math.round(CFG.promo[code] * 100)}% off`; msg.className = 'promo-msg ok'; renderCart(); }
    else { msg.textContent = code ? 'That code isn’t valid.' : 'Enter a code first.'; msg.className = 'promo-msg bad'; }
  });

  /* ───── quick view ───── */
  const qv = $('#qv');
  const openQV = id => {
    const p = byId(id); if (!p) return;
    $('#qv-body').innerHTML = `
      <div class="media"><img src="${esc(p.img)}" width="800" height="1000" alt="${esc(p.name)}" data-seed="${esc(p.id)}-a"></div>
      <div class="sheet-body">
        <p class="eyebrow">${esc(p.cat)}</p><h2 style="font-size:var(--step-3)">${esc(p.name)}</h2>
        <div class="rate">${stars(p.rating)}<small>${p.rating} · ${p.reviews} reviews</small></div>
        <p><b style="font-size:1.4rem">${money(p.price)}</b> ${p.was ? `<s class="muted">${money(p.was)}</s>` : ''}</p>
        <p class="muted">${esc(p.desc || '')}</p>
        ${p.sizes && p.sizes.length ? `<fieldset style="border:0"><legend class="eyebrow" style="margin-bottom:.6rem">Size</legend><div class="sizes">${p.sizes.map((s, i) => `<label><input type="radio" name="size" value="${esc(s)}" ${i === 0 ? 'checked' : ''}><span>${esc(s)}</span></label>`).join('')}</div></fieldset>` : ''}
        <div style="display:flex;gap:.6rem;flex-wrap:wrap"><button class="btn btn-primary btn-lg" style="flex:1" data-qv-add="${esc(p.id)}">Add to bag · ${money(p.price)}</button></div>
        <p class="muted" style="font-size:.85rem"><i class="ti ti-truck-delivery" aria-hidden="true"></i> Free shipping over ${money(CFG.freeShip)} · <i class="ti ti-refresh" aria-hidden="true"></i> 30-day returns</p>
      </div>`;
    lastFocus = document.activeElement; qv.showModal(); lock(true);
  };
  qv.addEventListener('close', () => { lock(false); lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true }); });
  $('#qv-close').addEventListener('click', () => qv.close());
  qv.addEventListener('click', e => { if (e.target === qv) qv.close(); });

  /* ───── delegated clicks ───── */
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-add],[data-qv],[data-wish],[data-qty],[data-remove],[data-cat],[data-qv-add],[data-close-cart],[data-shop-cat]');
    if (!t) return;
    if (t.dataset.add) { const p = byId(t.dataset.add); p.sizes && p.sizes.length > 1 ? openQV(p.id) : add(p.id, (p.sizes || [])[0] || ''); }
    else if (t.dataset.qv) openQV(t.dataset.qv);
    else if (t.dataset.qvAdd) { const s = qv.querySelector('input[name="size"]:checked'); add(t.dataset.qvAdd, s ? s.value : ''); qv.close(); openCart(); }
    else if (t.dataset.wish) {
      const id = t.dataset.wish; wish.has(id) ? wish.delete(id) : wish.add(id); save('wish-v1', [...wish]);
      t.setAttribute('aria-pressed', String(wish.has(id))); t.innerHTML = `<i class="ti ti-heart${wish.has(id) ? '-filled' : ''}" aria-hidden="true"></i>`;
      toast(wish.has(id) ? 'Saved to wishlist' : 'Removed from wishlist', 'heart');
    }
    else if (t.dataset.qty) change(t.dataset.qty, +t.dataset.d);
    else if (t.dataset.remove) remove(t.dataset.remove);
    else if (t.dataset.cat) setCat(t.dataset.cat);
    else if (t.dataset.shopCat) { setCat(t.dataset.shopCat); window.site.scrollToEl($('#shop')); }
    else if (t.hasAttribute('data-close-cart')) closeCart();
  });

  /* ───── toolbar ───── */
  let qT; $('#q').addEventListener('input', e => { clearTimeout(qT); qT = setTimeout(() => { state.q = e.target.value.trim(); renderGrid(); }, 160); });
  $('#sort').addEventListener('change', e => { state.sort = e.target.value; renderGrid(); });

  /* ───── checkout (demo) ───── */
  const co = $('#co');
  $('#checkout-btn').addEventListener('click', () => {
    if (!cart.length) return;
    const t = totals();
    $('#co-items').innerHTML = cart.map(i => { const p = byId(i.id); return `<div style="display:flex;justify-content:space-between;gap:1rem"><span>${esc(p.name)}${i.size ? ' · ' + esc(i.size) : ''} × ${i.qty}</span><span>${money(p.price * i.qty)}</span></div>`; }).join('');
    $('#co-sum').innerHTML = sumHTML(t);
    $('#co-form-view').hidden = false; $('#co-done').hidden = true;
    closeCart(); co.showModal(); lock(true);
  });
  co.addEventListener('close', () => lock(false));
  co.addEventListener('click', e => { if (e.target === co) co.close(); });
  $('#co-form').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.currentTarget; if (!f.checkValidity()) { f.reportValidity(); return; }
    const id = 'ORD-' + Math.random().toString(36).slice(2, 8).toUpperCase(), t = totals();
    $('#co-msg').textContent = `Order ${id} confirmed. A receipt for ${money(t.total)} is on its way to ${$('#c-email').value}.`;
    $('#co-form-view').hidden = true; $('#co-done').hidden = false;
    cart = []; promo = null; save('promo-v1', null); persist(); renderCart(); f.reset();
  });
  $('#co-ok').addEventListener('click', () => co.close());

  /* ───── announcement bar ───── */
  const ann = $('#announce');
  if (ann) { if (load('ann-x', false)) ann.remove(); $('#announce-x').addEventListener('click', () => { ann.remove(); save('ann-x', true); }); }

  /* ───── newsletter reveals promo ───── */
  const nl = $('#news-form');
  nl && nl.addEventListener('submit', e => { e.preventDefault(); if (!nl.checkValidity()) { nl.reportValidity(); return; } nl.reset(); toast('Subscribed. Use WELCOME10 for 10% off', 'gift'); });

  /* ───── init ───── */
  renderChips(); renderGrid(); renderCart();
})();
```

Rules for this script:
- The announcement bar sits **above** the fixed header: give the header `top` an offset only if the bar is visible, or make the bar part of normal flow and keep the header `position: fixed; top: 0` overlapping it when scrolled (acceptable); do not leave a gap.
- Category tiles use `data-shop-cat="Shirts"` so the delegated handler filters and scrolls.
- Never use inline `onclick` or unescaped template strings.
- Keep `PRODUCTS` ids unique and stable; the cart refers to them.

### C8. Content rules

- **Catalogue:** 12 products across 3–4 categories, each with a specific name (“Linen Overshirt”, not “Shirt 1”), realistic price points consistent with the brand (and `was` prices on about a third), one badge on a few (Bestseller / New / Low stock), rating 4.3–4.9, 20–400 reviews, 4–5 sizes where relevant, one-sentence material/fit description.
- **Images:** use Unsplash IDs you trust (fashion: `photo-1490481651871-ab68de25d43d`, `photo-1558769132-cb1aea458c5e`, `photo-1523170335258-f5ed11844a49`, `photo-1509631179647-0177331693ae`). Repeating an ID at a different crop is fine; give every product a distinct `data-seed` (already done by id). Tech/food/beauty stores should rely on the fallbacks and generated art rather than risky IDs.
- **Copy:** honest, no fake countdowns or invented “only 2 left” pressure; trust copy must match the config (shipping threshold, 30-day returns).
- **Policies:** footer links to Shipping, Returns, Privacy, Terms as `#` placeholders and a note to the owner to supply them.
- **SEO:** `<title>`, meta description, JSON-LD `Store` and a few `Product` entries with `offers`.

### C9. E-commerce checklist

- [ ] Cart count, drawer, totals, free-shipping bar and promo code all react to every add, change and remove
- [ ] Cart and wishlist survive a refresh (localStorage, wrapped in try/catch)
- [ ] Add-to-bag on a product with sizes opens quick view first; with one size it adds directly
- [ ] Drawer: focus moves in, `Esc` and overlay close it, focus returns, content behind is `inert`
- [ ] Dialogs (quick view, checkout) close with Esc and backdrop click; scroll is locked while open
- [ ] Product cards use `aspect-ratio`, `width`/`height`, alt text; hover swap only on pointer devices
- [ ] All user-influenced text passes through `esc()`; no inline handlers
- [ ] Empty states exist for the bag and for search with no results
- [ ] Closing notes say checkout is a demo and name the payment providers to connect

---

## ═══════════════════════════════════════════════
## PART D — QUICK-START PROMPTS
## ═══════════════════════════════════════════════

```
Build a store for THREAD & KILN — handmade linen clothing and ceramic homeware in Jaipur. Currency: INR.
Vibe: warm, earthy, calm. Palette: Terracotta. Products: invent 12. Free shipping over ₹2,999.
```

```
Build a store for VOLT — premium mechanical keyboards and desk accessories in Austin. Currency: USD.
Vibe: precise, dark, techy. Palette: Mono Lime. Products: invent 12. Free shipping over $75.
```


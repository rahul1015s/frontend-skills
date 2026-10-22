# PREMIUM REAL ESTATE / PROPERTY WEBSITE — MASTER PROMPT v1.0
### One prompt → one complete, elegant, animated `index.html` for an agency, developer, broker or luxury property brand

> **HOW TO USE**
> 1. Paste this ENTIRE file into any capable AI (Claude, GPT, Gemini…).
> 2. Then send: `Build a website for <AGENCY/DEVELOPER>, a <residential/luxury/commercial> real estate <agency/developer> in <CITY>. Vibe: <words>. Listings: <list or "invent 8">. Currency: <INR/USD/AED…>.`
> 3. The AI returns a single `index.html`. Save it and deploy anywhere.

If any detail is missing, **invent believable specifics** instead of asking questions.

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
         data-gallery="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&h=1050&fit=crop&q=80&auto=format,https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1400&h=1050&fit=crop&q=80&auto=format,https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400&h=1050&fit=crop&q=80&auto=format">
  <div class="media">
    <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&q=80&auto=format" width="800" height="600" alt="Sea-facing Art Deco villa in Bandra" loading="lazy" decoding="async" data-seed="bandra-villa">
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
- **Photo IDs** (use `?w=<W>&h=<H>&fit=crop&q=80&auto=format`): modern home `photo-1558618666-fcd25c85cd64`, interior `photo-1560448204-e02f11c3d0e2`, architecture `photo-1486325212027-8081e485255e`, aerial `photo-1513584684374-8bab748fbf90`. Reuse across listings at different crops; give each card a distinct `data-seed`.
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


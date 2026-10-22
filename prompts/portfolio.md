# PREMIUM PORTFOLIO WEBSITE — MASTER PROMPT v1.0
### One prompt → one complete, animated, production-ready `index.html` for a designer, developer, or creative

> **HOW TO USE**
> 1. Paste this ENTIRE file into any capable AI (Claude, GPT, Gemini…).
> 2. Then send: `Build my portfolio. Name: <NAME>. Role: <ROLE>. Based in: <CITY>. Style: <editorial | dark-tech | warm-craft>. Projects: <3–6 project names + one line each>. Email: <EMAIL>.`
> 3. The AI returns a single `index.html`. Save it, open it, deploy it anywhere (GitHub Pages, Netlify, Vercel).

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


# PREMIUM WEDDING WEBSITE / DIGITAL INVITATION — MASTER PROMPT v1.0
### One prompt → one complete, romantic, animated `index.html` with countdown, add-to-calendar, RSVP, guestbook and a curtain-opening invitation

> **HOW TO USE**
> 1. Paste this ENTIRE file into any capable AI (Claude, GPT, Gemini…).
> 2. Then send: `Build our wedding website. Couple: <NAME & NAME>. Date: <date + time>. Venue: <name, city>. Style: <classic | garden | modern | royal | beach>. Events: <ceremony, reception, sangeet…>. Hashtag: <or "invent">.`
> 3. The AI returns a single `index.html`. Save it and share the link with guests.

If any detail is missing, **invent believable specifics** instead of asking questions (names, venue, dates in the future relative to today).

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
## PART C — WEDDING SPECIFICATION
## ═══════════════════════════════════════════════

### C1. Goal

Guests open one link on their phone and instantly know **when, where, what to wear, and how to reply**. The site should feel like a beautifully printed invitation: slow, soft, intimate. Emotion first, logistics clear.

### C2. Direction

| Style | Palette (A3) | Fonts |
| --- | --- | --- |
| Classic / garden | **Ink & Cream** (light) with a sage or blush accent | Cormorant Garamond + Hanken Grotesk, script accent: Pinyon Script |
| Romantic / blush | **Rose Quartz** (light) | Cormorant Garamond + DM Sans, Pinyon Script |
| Royal / festive | **Noir Gold** (dark) or **Terracotta** | Cormorant Garamond + Hanken Grotesk |
| Beach / modern | **Glacier** (light) | Instrument Serif + Geist |

Load the script face only for the couple’s names and a few flourish words:
`family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=Pinyon+Script&family=Hanken+Grotesk:wght@300..700`.
Set `--font-mono` to the body font (labels are small uppercase, wide-tracked) and add `--font-script:'Pinyon Script',cursive`. **Do not** keep the core’s uppercase mono look; wedding labels are soft.

### C3. Section order (all required)

0. **Curtain intro** (replaces the core loader: **omit `<div class="loader">`**) — two panels and a wax-seal button “Open invitation”; skipped for returning visitors in the same session.
1. **Hero** — “We’re getting married”, names in script at huge scale, date and city, **countdown**, Save-the-date and RSVP buttons, floating petals.
2. **Our story** — 4–5 timeline moments (how we met, first trip, the proposal…), alternating layout, each with a photo or generated art.
3. **The details** — cards for each event (Ceremony, Reception, + optional Mehendi/Sangeet/Brunch): date, time, venue, dress code, a map link, and **Add to calendar** (.ics download).
4. **Schedule of the day** — a vertical timeline with times.
5. **Travel & stay** — getting there, hotel blocks, local tips.
6. **Gallery** — 6–8 photos in a gentle masonry.
7. **Wedding party** — bridesmaids/groomsmen or family, with role and a playful line each.
8. **Gifts** — registry/gift cards (no pressure wording) with copy-to-clipboard for a UPI/bank placeholder.
9. **RSVP** — name, attending yes/no, number of guests, meal choice, dietary notes, song request, message. Saves locally and shows a warm confirmation.
10. **Guestbook** — recent wishes list (stored on the device, clearly labelled as a demo) and a form to add one.
11. **FAQ** — dress code, kids, parking, plus-ones, photography, weather plan.
12. **Footer** — hashtag, contact for questions, “With love” signature.

### C4. Signature moment

**The curtain opens.** A wax seal invites a tap; the two panels slide apart, the names rise out of the page in script, petals begin to fall (a few, slowly), and the countdown starts ticking. Everything afterwards is quiet and unhurried.

### C5. Page-specific CSS (append after A6)

```css
:root{--font-script:'Pinyon Script',cursive}
h1,h2,h3{font-weight:400}
.script{font-family:var(--font-script);font-weight:400;letter-spacing:0;line-height:1.05}
.eyebrow{text-transform:uppercase;letter-spacing:.28em;font-family:var(--font-body)}
.eyebrow::before{display:none}
.center{text-align:center}
.divider{display:flex;align-items:center;gap:1rem;justify-content:center;color:var(--accent);margin-block:1.4rem}
.divider::before,.divider::after{content:"";height:1px;width:min(120px,20vw);background:currentColor;opacity:.5}

/* curtain */
.curtain{position:fixed;inset:0;z-index:9998;display:grid;place-items:center;overflow:hidden}
.curtain .half{position:absolute;top:0;bottom:0;width:50.5%;background:var(--surface-2);transition:transform 1.4s var(--ease-in-out);
  background-image:radial-gradient(120% 80% at 50% 0%,rgb(var(--accent-rgb) / .18),transparent 60%)}
.curtain .l{left:0}.curtain .r{right:0}
.curtain.open .l{transform:translateX(-101%)}.curtain.open .r{transform:translateX(101%)}
.seal{position:relative;z-index:2;display:grid;place-items:center;width:clamp(120px,32vw,168px);aspect-ratio:1;border-radius:50%;
  background:radial-gradient(circle at 35% 30%,color-mix(in srgb,var(--accent) 80%,#fff),var(--accent) 55%,color-mix(in srgb,var(--accent) 60%,#000));
  color:var(--on-accent);box-shadow:0 18px 50px -10px rgb(var(--accent-rgb) / .6),inset 0 0 0 6px rgb(255 255 255 / .12);
  transition:transform .6s var(--ease-out),opacity .5s .2s;animation:sealPulse 3s var(--ease-in-out) infinite}
.seal span{font:400 clamp(2rem,9vw,3rem)/1 var(--font-script)}
.seal small{position:absolute;bottom:-2.4rem;white-space:nowrap;color:var(--text-2);font:500 .72rem/1 var(--font-body);letter-spacing:.28em;text-transform:uppercase}
.seal:active{transform:scale(.94)}
.curtain.open .seal{transform:scale(1.4);opacity:0;pointer-events:none}
@keyframes sealPulse{50%{transform:scale(1.04)}}
@media (hover:hover) and (pointer:fine){.seal:hover{transform:scale(1.06)}}

/* hero entrance only starts after opening */
.js:not(.opened) .hero-in{opacity:0;transform:translateY(24px)}
.hero-in{transition:opacity 1.4s var(--ease-out),transform 1.6s var(--ease-out);transition-delay:calc(.35s + var(--i,0)*.16s)}
.hero{min-height:100svh;display:grid;place-items:center;padding:110px 0 80px;position:relative;text-align:center;overflow:clip}
.hero::before{content:"";position:absolute;inset:0;z-index:-1;
  background:radial-gradient(60% 50% at 50% 0%,rgb(var(--accent-rgb) / .16),transparent 70%),radial-gradient(50% 40% at 50% 100%,rgb(var(--accent-rgb) / .1),transparent 70%)}
.hero .small-caps{letter-spacing:.34em;text-transform:uppercase;font-size:var(--step--1);color:var(--text-2)}
.hero .names{font-size:clamp(3.4rem,15vw,11rem);margin:.4em 0 .1em}
.hero .names .amp{display:block;font-size:.5em;color:var(--accent);line-height:.9}
.hero .when{font:400 var(--step-2)/1.2 var(--font-display);font-style:italic}
.countdown{display:flex;gap:clamp(.6rem,2.5vw,1.6rem);justify-content:center;margin:2rem 0}
.countdown div{min-width:clamp(62px,18vw,96px);padding:.9rem .3rem;border:1px solid var(--line);border-radius:999px 999px 20px 20px;background:rgb(var(--bg-rgb,246 243 238) / .6)}
.countdown b{display:block;font:400 clamp(1.6rem,6vw,2.6rem)/1 var(--font-display);font-variant-numeric:tabular-nums}
.countdown small{font:500 .62rem/1 var(--font-body);letter-spacing:.2em;text-transform:uppercase;color:var(--text-2)}
.cta-row{display:flex;flex-wrap:wrap;gap:.7rem;justify-content:center}
.btn{letter-spacing:.14em;text-transform:uppercase;font-size:.78rem}

/* petals */
.petals{position:fixed;inset:0;pointer-events:none;z-index:50;overflow:hidden}
.petal{position:absolute;top:-6vh;width:var(--s);height:calc(var(--s)*1.35);background:radial-gradient(circle at 30% 30%,color-mix(in srgb,var(--accent) 55%,#fff),var(--accent));
  border-radius:80% 0 80% 0;opacity:.0;animation:fall var(--d) linear var(--delay) infinite}
@keyframes fall{0%{transform:translate3d(0,-6vh,0) rotate(0);opacity:0}10%{opacity:.7}100%{transform:translate3d(var(--x),108vh,0) rotate(540deg);opacity:0}}

/* story */
.timeline{display:grid;gap:clamp(36px,6vw,80px)}
.moment{display:grid;gap:1.2rem;align-items:center}
@media (min-width:861px){.moment{grid-template-columns:1fr 1fr;gap:clamp(32px,6vw,96px)}.moment:nth-child(even) .moment-media{order:2}}
.moment-media{aspect-ratio:4/5;border-radius:200px 200px 24px 24px;overflow:hidden}
.moment-media .media{border-radius:0;height:100%}
.moment .year{font:400 var(--step-1)/1 var(--font-script);color:var(--accent);font-size:2rem}

/* events */
.events{display:grid;gap:14px}
@media (min-width:861px){.events{grid-template-columns:repeat(auto-fit,minmax(280px,1fr))}}
.event{text-align:center;display:grid;gap:.7rem;justify-items:center;padding:clamp(24px,4vw,40px);border-radius:200px 200px 28px 28px}
.event .ti-ico{font-size:34px;color:var(--accent)}
.event h3{font:400 var(--step-3)/1 var(--font-display);font-style:italic}
.event dl{display:grid;gap:.15rem}.event dt{font-size:.68rem;letter-spacing:.24em;text-transform:uppercase;color:var(--text-3);margin-top:.6rem}.event dd{margin:0}
.event .btn{margin-top:.6rem}

/* day schedule */
.sched{max-width:560px;margin-inline:auto;position:relative;padding-left:2rem}
.sched::before{content:"";position:absolute;left:.45rem;top:.4rem;bottom:.4rem;width:1px;background:var(--line)}
.sched li{position:relative;padding:.6rem 0 1.4rem}
.sched li::before{content:"";position:absolute;left:-1.85rem;top:1rem;width:11px;height:11px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 5px rgb(var(--accent-rgb) / .18)}
.sched time{font:500 .8rem/1 var(--font-body);letter-spacing:.2em;text-transform:uppercase;color:var(--accent)}
.sched h3{font:400 var(--step-1)/1.2 var(--font-display);margin-top:.3rem}

.masonry{columns:2;column-gap:12px}@media (min-width:861px){.masonry{columns:3}}
.masonry .media{margin-bottom:12px;break-inside:avoid;border-radius:18px}
.party{display:grid;gap:18px;grid-template-columns:repeat(2,1fr)}@media (min-width:861px){.party{grid-template-columns:repeat(4,1fr)}}
.person{text-align:center}.person .media{aspect-ratio:1;border-radius:50%;margin-bottom:.8rem}.person small{color:var(--text-2);display:block}
.gifts{display:grid;gap:12px}@media (min-width:861px){.gifts{grid-template-columns:repeat(3,1fr)}}
.row2{display:grid;gap:12px;grid-template-columns:1fr 1fr}
.choice{display:flex;gap:.6rem;flex-wrap:wrap}
.choice label{position:relative}.choice input{position:absolute;opacity:0;inset:0}
.choice span{display:grid;place-items:center;min-height:48px;padding:0 1.4rem;border:1px solid var(--line);border-radius:999px;cursor:pointer;transition:background-color var(--t-hover),color var(--t-hover),border-color var(--t-hover)}
.choice input:checked+span{background:var(--accent);color:var(--on-accent);border-color:var(--accent)}
.choice input:focus-visible+span{outline:2px solid var(--accent);outline-offset:3px}
.rsvp-card{max-width:720px;margin-inline:auto}
.wish-list{display:grid;gap:12px;margin-top:1.6rem}
.wish{padding:1.1rem 1.3rem;border-radius:18px;border:1px solid var(--line);background:var(--surface);animation:cardIn .6s var(--ease-out) both}
.wish b{font-family:var(--font-script);font-weight:400;font-size:1.6rem;color:var(--accent)}
@keyframes cardIn{from{opacity:0;transform:translateY(12px)}}
.faq details{border-bottom:1px solid var(--line)}
.faq summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;gap:1rem;padding:1.2rem 0;font:400 var(--step-1)/1.3 var(--font-display)}
.faq summary::-webkit-details-marker{display:none}.faq summary i{transition:transform .4s var(--ease-out)}
.faq details[open] summary i{transform:rotate(45deg)}.faq .ans{padding-bottom:1.3rem;color:var(--text-2);max-width:62ch}
.hashtag{font:400 clamp(2rem,8vw,4.5rem)/1 var(--font-script);color:var(--accent)}
@media (prefers-reduced-motion:reduce){.petals{display:none}.seal{animation:none}}
```

### C6. Markup patterns

**Curtain (first child of `<body>`; no `.loader`)**

```html
<div class="curtain" id="curtain" role="dialog" aria-modal="true" aria-label="Wedding invitation">
  <div class="half l"></div><div class="half r"></div>
  <button class="seal" id="seal" aria-label="Open the invitation"><span>A&amp;R</span><small>Tap to open</small></button>
</div>
<div class="petals" id="petals" aria-hidden="true"></div>
```

**Hero** (every child has `class="hero-in"` with `style="--i:N"`, not `data-reveal`)

```html
<section class="hero" id="top-hero"><div class="wrap">
  <p class="small-caps hero-in" style="--i:0">Together with their families</p>
  <h1 class="names script hero-in" style="--i:1">Aanya <span class="amp">&amp;</span> Rohan</h1>
  <p class="when hero-in" style="--i:2">Saturday, 14 February 2027 · Udaipur, Rajasthan</p>
  <div class="countdown hero-in" style="--i:3" role="timer" aria-label="Time until the wedding">
    <div><b data-cd="d">000</b><small>Days</small></div><div><b data-cd="h">00</b><small>Hours</small></div><div><b data-cd="m">00</b><small>Minutes</small></div><div><b data-cd="s">00</b><small>Seconds</small></div>
  </div>
  <div class="cta-row hero-in" style="--i:4"><a href="#rsvp" class="btn btn-primary btn-lg" data-magnetic>RSVP</a><button class="btn btn-ghost btn-lg" data-ics="main"><i class="ti ti-calendar-plus" aria-hidden="true"></i> Save the date</button></div>
</div></section>
```

**Event card** (dates in ISO for the calendar)

```html
<article class="card event" data-reveal
  data-ics-title="Aanya &amp; Rohan — Wedding Ceremony" data-start="2027-02-14T16:30:00+05:30" data-end="2027-02-14T18:30:00+05:30"
  data-location="Jagmandir Island Palace, Udaipur" data-desc="Dress code: traditional Indian attire in pastel shades.">
  <i class="ti ti-ico ti-heart" aria-hidden="true"></i><h3>The Ceremony</h3>
  <dl><dt>When</dt><dd>Saturday, 14 February 2027 · 4:30 pm</dd><dt>Where</dt><dd>Jagmandir Island Palace, Udaipur</dd><dt>Dress code</dt><dd>Traditional · pastel tones</dd></dl>
  <a class="btn btn-ghost" href="https://www.google.com/maps/search/?api=1&query=Jagmandir+Island+Palace+Udaipur" target="_blank" rel="noopener">Directions</a>
  <button class="btn btn-ghost" data-ics="event"><i class="ti ti-calendar-plus" aria-hidden="true"></i> Add to calendar</button>
</article>
```

Make `.ti-ico` a Tabler icon by adding the `ti` class as well (`class="ti ti-heart ti-ico"`).

**RSVP form** (fields: `name`, `attending` radios yes/no, `guests` select 1–4, `meal` radios (Vegetarian / Non-vegetarian / Vegan / Jain), `diet` text, `song` text, `note` textarea)

```html
<form class="card rsvp-card stack" id="rsvp-form" style="--stack:1.2rem" novalidate>
  <div class="field"><label for="r-name">Your name</label><input id="r-name" name="name" autocomplete="name" required></div>
  <fieldset class="field" style="border:0"><legend>Will you join us?</legend><div class="choice"><label><input type="radio" name="attending" value="yes" required checked><span>Joyfully accepts</span></label><label><input type="radio" name="attending" value="no"><span>Regretfully declines</span></label></div></fieldset>
  <div id="rsvp-more" class="stack" style="--stack:1.2rem">
    <div class="row2"><div class="field"><label for="r-guests">Guests</label><select id="r-guests" name="guests"><option>1</option><option>2</option><option>3</option><option>4</option></select></div><div class="field"><label for="r-diet">Dietary notes</label><input id="r-diet" name="diet" placeholder="Allergies, preferences"></div></div>
    <fieldset class="field" style="border:0"><legend>Meal</legend><div class="choice"><label><input type="radio" name="meal" value="Vegetarian" checked><span>Vegetarian</span></label><label><input type="radio" name="meal" value="Non-vegetarian"><span>Non-vegetarian</span></label><label><input type="radio" name="meal" value="Vegan"><span>Vegan</span></label></div></fieldset>
    <div class="field"><label for="r-song">A song that will get you dancing</label><input id="r-song" name="song"></div>
  </div>
  <div class="field"><label for="r-note">A note for the couple</label><textarea id="r-note" name="note"></textarea></div>
  <button class="btn btn-primary btn-lg btn-block" type="submit">Send RSVP</button>
  <p class="form-status" role="status" hidden></p>
</form>
```

**Guestbook** (`<form id="wish-form">` with `name` and `message`, plus `<div class="wish-list" id="wish-list"></div>`), **gift card** (`<button class="btn btn-ghost" data-copy="aanya@upi">Copy UPI ID</button>`), **FAQ** with `<details>`.

### C7. Page-specific JavaScript

```js
(() => {
  const { $, $$, reduce, lenis, safe } = window.site;
  const doc = document.documentElement;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
  const WEDDING = new Date('2027-02-14T16:30:00+05:30').getTime();   /* AI: set from the brief; must be in the future */

  /* ───── curtain ───── */
  const curtain = $('#curtain'), seal = $('#seal');
  let seen = false; try { seen = !!sessionStorage.getItem('wedding-open'); } catch {}
  const lock = on => { lenis ? (on ? lenis.stop() : lenis.start()) : (document.body.style.overflow = on ? 'hidden' : ''); };
  const openInvite = () => {
    if (doc.classList.contains('opened')) return;
    curtain && curtain.classList.add('open'); doc.classList.add('opened'); lock(false);
    try { sessionStorage.setItem('wedding-open', '1'); } catch {}
    setTimeout(() => curtain && curtain.remove(), 1700);
    startPetals();
    window.dispatchEvent(new Event('wedding:opened'));
  };
  if (!curtain || seen || reduce) { curtain && curtain.remove(); doc.classList.add('opened'); setTimeout(startPetals, 600); }
  else { lock(true); seal.addEventListener('click', openInvite); seal.focus({ preventScroll: true }); setTimeout(() => { /* failsafe so guests are never locked out */ if (!doc.classList.contains('opened')) openInvite(); }, 60000); }

  /* ───── petals ───── */
  function startPetals() {
    const box = $('#petals'); if (!box || reduce || box.childElementCount) return;
    const n = innerWidth < 700 ? 9 : 16;
    for (let i = 0; i < n; i++) {
      const p = document.createElement('i'); p.className = 'petal';
      p.style.cssText = `left:${Math.random() * 100}%;--s:${8 + Math.random() * 10}px;--d:${14 + Math.random() * 14}s;--delay:${-Math.random() * 20}s;--x:${(Math.random() * 160 - 80)}px`;
      box.append(p);
    }
  }

  /* ───── countdown ───── */
  const cd = { d: $('[data-cd="d"]'), h: $('[data-cd="h"]'), m: $('[data-cd="m"]'), s: $('[data-cd="s"]') };
  const pad = (n, l = 2) => String(Math.max(0, n)).padStart(l, '0');
  const tick = () => {
    const ms = WEDDING - Date.now(), s = Math.max(0, Math.floor(ms / 1000));
    cd.d && (cd.d.textContent = pad(Math.floor(s / 86400), 3)); cd.h && (cd.h.textContent = pad(Math.floor(s % 86400 / 3600)));
    cd.m && (cd.m.textContent = pad(Math.floor(s % 3600 / 60))); cd.s && (cd.s.textContent = pad(s % 60));
  };
  safe(tick); setInterval(() => safe(tick), 1000);

  /* ───── add to calendar (.ics download) ───── */
  const icsText = s => String(s).replace(/\\/g, '\\\\').replace(/[,;]/g, '\\$&').replace(/\n/g, '\\n');
  const stamp = d => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const download = (name, title, start, end, location, desc) => {
    const body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Wedding//EN', 'BEGIN:VEVENT', `UID:${stamp(start)}-${Math.random().toString(36).slice(2)}@wedding`, `DTSTAMP:${stamp(new Date())}`,
      `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`, `SUMMARY:${icsText(title)}`, `LOCATION:${icsText(location)}`, `DESCRIPTION:${icsText(desc)}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const url = URL.createObjectURL(new Blob([body], { type: 'text/calendar;charset=utf-8' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: name + '.ics' });
    document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1500);
  };
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-ics]'); if (!b) return;
    const ev = b.closest('[data-start]');
    if (ev) download('wedding-event', ev.dataset.icsTitle, new Date(ev.dataset.start), new Date(ev.dataset.end), ev.dataset.location, ev.dataset.desc || '');
    else download('save-the-date', document.title, new Date(WEDDING), new Date(WEDDING + 3 * 3600e3), '', 'We can’t wait to celebrate with you.');
    toast('Calendar file downloaded');
  });

  /* ───── toast ───── */
  function toast(msg) {
    let t = $('#toast'); if (!t) { t = document.createElement('div'); t.id = 'toast'; t.setAttribute('role', 'status');
      t.style.cssText = 'position:fixed;left:50%;bottom:24px;translate:-50% 0;z-index:9000;padding:.8rem 1.3rem;border-radius:999px;background:var(--text);color:var(--bg);font-size:.9rem;opacity:0;transition:opacity .3s;pointer-events:none'; document.body.append(t); }
    t.textContent = msg; t.style.opacity = 1; clearTimeout(t._t); t._t = setTimeout(() => { t.style.opacity = 0; }, 2400);
  }
  $$('[data-copy]').forEach(b => b.addEventListener('click', async () => { try { await navigator.clipboard.writeText(b.dataset.copy); toast('Copied'); } catch { toast(b.dataset.copy); } }));

  /* ───── RSVP ───── */
  const rf = $('#rsvp-form');
  if (rf) {
    const more = $('#rsvp-more');
    const sync = () => { const no = rf.attending.value === 'no'; more.hidden = no; $$('input,select', more).forEach(i => i.disabled = no); };
    rf.addEventListener('change', sync); sync();
    rf.addEventListener('submit', e => {
      e.preventDefault();
      const nameEl = rf.elements['name'];
      if (!nameEl.value.trim()) { nameEl.focus(); rf.reportValidity(); return; }
      const data = Object.fromEntries(new FormData(rf)), list = load('rsvps-v1', []); list.push({ ...data, at: new Date().toISOString() }); save('rsvps-v1', list);
      const st = $('.form-status', rf), first = data.name.trim().split(' ')[0];
      st.textContent = data.attending === 'yes' ? `Thank you, ${first}! We can’t wait to celebrate with you.` : `Thank you for letting us know, ${first}. You’ll be missed.`;
      st.hidden = false; rf.reset(); sync();
    });
  }

  /* ───── guestbook (stored on this device only: demo) ───── */
  const wl = $('#wish-list'), wf = $('#wish-form');
  if (wl && wf) {
    const SEED = [{ n: 'Meera & Karan', m: 'Wishing you a lifetime of laughter and chai on the balcony.' }, { n: 'Uncle Sunil', m: 'Aanya, you were born to shine. Rohan, welcome to the family!' }];
    const render = () => { const all = [...load('wishes-v1', []), ...SEED]; wl.innerHTML = all.map((w, i) => `<div class="wish" style="animation-delay:${i * 60}ms"><b>${esc(w.n)}</b><p>${esc(w.m)}</p></div>`).join(''); };
    render();
    wf.addEventListener('submit', e => {
      e.preventDefault(); const n = wf.elements['name'].value.trim(), m = wf.elements['message'].value.trim(); if (!n || !m) { wf.reportValidity(); return; }
      const mine = load('wishes-v1', []); mine.unshift({ n, m }); save('wishes-v1', mine); wf.reset(); render(); toast('Thank you for your wishes');
    });
  }
})();
```

Rules for the script:
- Replace the `WEDDING` date and the `data-start`/`data-end` values with future dates from the brief. All event times must carry a timezone offset.
- The guestbook and RSVP store data **only in this browser** (demo). The closing notes must say so and recommend connecting a form service (Formspree, Google Forms, Netlify Forms, or a Google Sheet via Apps Script) before sharing the link.
- Hero children use `.hero-in` (not `data-reveal`) so they animate only after the curtain opens.

### C8. Content rules

- **Names and story**: invent a charming, specific couple story (met at a friend’s terrace, a monsoon road trip, a proposal at sunrise). Keep it warm and light-hearted; no clichés like “soulmates for eternity”.
- **Events**: ceremony, reception, and one optional event; real-feeling venue names, plausible local times, and a dress-code line that gives guests colours or styles.
- **Schedule**: 6–8 entries (Guests arrive 4:00 · Ceremony 4:30 · Cocktails 6:00 · Dinner 7:30 · First dance 9:00 · Last song 11:30).
- **Travel**: nearest airport/station with distance, two hotels with “mention our wedding” note, a local tip.
- **Wedding party**: 6–8 invented names with roles and one affectionate line each.
- **Gifts**: tone is gracious (“Your presence is the greatest gift”), with optional registry link placeholders and a UPI/bank placeholder.
- **Images**: Unsplash photos are optional and risky for weddings. Prefer generated art (`.media` with gradient/floral SVG motifs) and venue-style architecture/interior photos from `photo-1486325212027-8081e485255e`, `photo-1560448204-e02f11c3d0e2`, `photo-1555396273-367ea4eb4db5`, `photo-1514362545857-3bc16c4c7d1b`, `photo-1578985545062-69928b1d9587` (venue, cocktails, dessert), each with a unique `data-seed`. Tell the couple to replace them with their own photos.
- **Privacy**: no phone numbers or addresses of private individuals beyond what the brief supplies; invent contact details clearly as placeholders.

### C9. Wedding-specific checklist

- [ ] Curtain opens by tap/Enter, is skipped on repeat visits and reduced motion, and can never trap a guest (failsafe)
- [ ] Hero entrance runs after opening; petals are few, slow, behind content, and off for reduced motion
- [ ] Countdown is correct, ticks every second, and shows zero (not negative) after the date
- [ ] Add-to-calendar downloads a valid `.ics` for each event and the save-the-date
- [ ] RSVP hides extra fields when declining, validates the name, and gives a warm confirmation
- [ ] Guestbook escapes HTML and clearly acts as a demo
- [ ] Script font used only for names and flourishes; body text stays readable at 390px
- [ ] Contrast checked on light palettes (accent text ≥ 4.5:1 or used only for large script)
- [ ] Closing notes list: dates to confirm, photos to replace, and the form service to connect

---

## ═══════════════════════════════════════════════
## PART D — QUICK-START PROMPTS
## ═══════════════════════════════════════════════

```
Build our wedding website. Couple: Aanya & Rohan. Date: 14 February 2027, ceremony 4:30 pm. Venue: Jagmandir Island Palace, Udaipur.
Style: royal and romantic. Palette: Noir Gold. Events: Mehendi (12 Feb), Sangeet (13 Feb), Ceremony and Reception (14 Feb). Hashtag: invent.
```

```
Build our wedding website. Couple: Emma & Daniel. Date: 6 June 2027, 3 pm. Venue: Brightwater Gardens, Napa Valley.
Style: garden party, soft and airy. Palette: Rose Quartz (light). Events: ceremony, reception, farewell brunch. Hashtag: invent.
```


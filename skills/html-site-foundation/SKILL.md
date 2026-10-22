---
name: html-site-foundation
description: Entry point for building any single-file HTML website (landing page, portfolio, brand site, shop) that loads everything from CDNs. Sets the workflow, pinned CDN manifest, file skeleton, tokens and the pre-ship quality gate, and routes to the other html-* skills. Use first whenever the user asks for a website, landing page or "cool site" in plain HTML.
---

# HTML Site Foundation

Every site built with this skill is **one `index.html`**: no build step, no npm, every library from a CDN, all custom animation written by hand on top of those libraries.

This skill is the router. Read it first, then load only the sibling skills the brief needs.

## Operating posture

You are a senior design engineer. The default failure is a competent but generic page. Commit to a direction, make the calls yourself, and do not present menus of options to the user.

## Step 1 — Read the brief (before any code)

Write down, in your head or in one short comment block at the top of the file:

1. **Who** is the visitor and **what single action** should they take?
2. **Direction**: pick ONE (luxury-editorial, dark-industrial, organic-soft, tech-precise, playful-bold, retro-futuristic, brutalist-mono). Never blend randomly.
3. **The one memorable thing**: a kinetic headline, a 3D hero, a scroll-driven reveal, an unexpected colour hit. Plan it now.
4. **Mobile first**: the base canvas is 390px. Desktop is the enhancement.

## Step 2 — Route to sibling skills

| Need | Load |
| --- | --- |
| Page structure, section order, conversion copy | `html-landing-page` |
| Colour palette, font pairing, tokens, contrast | `html-palette-type` |
| Any animation, scroll, hover, loader, transition | `html-motion-system` |
| Buttons, forms, focus, states, keyboard, hit areas | `html-interaction-details` |
| Icons | `html-icons-tabler` |
| 3D hero, particles, shader backgrounds | `html-threejs-scenes` |
| Animated headline, text on a path, stroke-drawn letters | `html-kinetic-type` |
| Cart, product grid, toasts | the e-commerce chapters (12, 13) of `skillsV3.md` |

If the `emil-design-eng`, `animate`, `design-taste-frontend`, `impeccable`, `threejs-*` or `gsap-*` skills are installed, they refine the matching sibling; this skill pack stays authoritative for the CDN-only constraint.

## Step 3 — CDN manifest (pinned; never `@latest`)

Load only what the page uses. Order: CSS in `<head>`, scripts at the end of `<body>`.

```html
<!-- Fonts (always preconnect) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Icons: Tabler webfont (see html-icons-tabler) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.49.0/dist/tabler-icons.min.css">

<!-- Core motion (scripts) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.js"></script>

<!-- Optional -->
<script src="https://cdn.jsdelivr.net/npm/splitting@1.0.6/dist/splitting.min.js"></script>   <!-- per-char/word spans -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">   <!-- carousels -->
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
```

Three.js is loaded with an import map, not a script tag. See `html-threejs-scenes`.

Rules:
- Pin an exact version. If you must change one, confirm the URL exists; a 404 CDN takes the whole page down.
- Every library call is guarded: `if (window.gsap) { … }`. The page must still read correctly if a CDN fails.
- Do not load a library for one effect that CSS can do (a fade, a marquee, a hover).
- Prefer GSAP + ScrollTrigger over AOS. One animation engine per page.

## Step 4 — File skeleton

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Brand — one-line value proposition</title>
  <meta name="description" content="150–160 chars, real copy.">
  <meta name="theme-color" content="#0b0b0c">
  <!-- fonts + css cdns -->
  <style>
    /* 1. tokens  2. reset  3. type  4. layout  5. components  6. sections  7. motion  8. media queries */
  </style>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <header>…</header>
  <main id="main">
    <section id="hero">…</section>
    <!-- sections with ids matching nav hrefs -->
  </main>
  <footer>…</footer>
  <!-- cdn scripts -->
  <script>
    /* motion + interaction, all wrapped in DOMContentLoaded */
  </script>
</body>
</html>
```

Base reset (always include):

```css
*,*::before,*::after{box-sizing:border-box;margin:0}
html{-webkit-text-size-adjust:100%;scroll-behavior:auto}
body{min-height:100dvh;background:var(--bg);color:var(--text);font-family:var(--font-body);
  line-height:1.6;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;overflow-x:clip}
img,svg,video,canvas{display:block;max-width:100%}
button,input,select,textarea{font:inherit;color:inherit}
:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
.skip-link{position:absolute;left:-999px}.skip-link:focus{left:1rem;top:1rem;z-index:9999}
```

## Step 5 — Build order

1. Tokens (`html-palette-type`) → 2. Layout and static content (`html-landing-page`) → 3. Components and states (`html-interaction-details`) → 4. Motion last (`html-motion-system`), then the signature moment (`html-threejs-scenes` or `html-kinetic-type`).

Motion goes last on purpose: if the static page is not good, animation will not rescue it.

## Step 6 — Quality gate (verify before you answer)

- [ ] Reads correctly at 390px, 768px and 1440px. No horizontal scroll.
- [ ] No Lorem Ipsum. Copy is specific to the business, with real-feeling numbers, names and prices.
- [ ] One display font + one body font (max three families). Not Inter/Roboto/Arial as the display face.
- [ ] No purple-gradient-on-white, no identical alternating image/text rows, no emoji as icons.
- [ ] Contrast: body text ≥ 4.5:1, large text ≥ 3:1, including on images (use a scrim).
- [ ] Every interactive element has hover (pointer-gated), `:active` and `:focus-visible` states.
- [ ] `prefers-reduced-motion` handled; no animation blocks content from being readable.
- [ ] Images have `alt`, `width`/`height` (no layout shift); below-fold images are `loading="lazy"`.
- [ ] Heading order is logical (one `h1`). Nav anchors match section ids.
- [ ] Only `transform`/`opacity` animate. No `transition: all`.
- [ ] Works if JS fails: content is visible by default; JS adds the hidden/animated state, never the reverse.
- [ ] One memorable moment exists and is not drowned by ten others.

## Output

Return the complete `index.html` in one code block (never truncated, no "rest stays the same"). After it, add at most three lines: the direction chosen, the signature moment, and anything the user must swap (real images, real copy, a CDN version to verify).

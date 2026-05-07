# PREMIUM WEBSITE GENERATION SKILL v3.0
### Complete Blueprint for AI — Mobile-First, Animated, Production-Ready

---

> **HOW TO USE:**
> 1. Paste this entire file to any capable AI (Claude, GPT-4, Gemini, etc.)
> 2. Then say: `"Build a website for [BUSINESS NAME] — [INDUSTRY/NICHE]"`
> 3. The AI will generate a complete single-file HTML website using every spec below.

---

## ═══════════════════════════════════════════════
## CHAPTER 0 — AI DESIGN PHILOSOPHY
## ═══════════════════════════════════════════════

Before writing a single line of code, commit to these principles:

### 0.1 Think Before You Code
- **Purpose first:** What does this business do? Who is the customer? What action should they take?
- **Tone commitment:** Pick ONE aesthetic direction and execute it with conviction. Options: dark-industrial, luxury-editorial, tech-brutalist, organic-wellness, retro-futuristic, playful-bold, art-deco-minimal. Do not blend randomly.
- **One unforgettable detail:** Every great site has ONE thing people remember — a dramatic hero transition, a kinetic typography moment, an unexpected color hit. Plan it. Build it.
- **Mobile is the primary canvas.** Design for 390px first. Desktop is an enhancement.

### 0.2 Quality Checklist (verify before outputting)
- [ ] Every section is visible and styled on 390px viewport
- [ ] Hero loads in under 1 second (no unoptimized blocking)
- [ ] All interactive elements (buttons, cards, forms) have hover AND active states
- [ ] Font hierarchy is clear: Display → Heading → Subheading → Body → Caption
- [ ] Color contrast passes readability (light text on dark, never grey on grey)
- [ ] Animations enhance, not distract — every animation has purpose
- [ ] No placeholder content (Lorem Ipsum) anywhere
- [ ] All sections have IDs matching the navbar links
- [ ] Forms have validation and success states
- [ ] Cart / CTAs are fully functional JavaScript

### 0.3 What NOT to Do (Anti-Patterns)
- ❌ Never use Inter, Roboto, Arial, or system-ui as display fonts
- ❌ Never use purple gradients on white — it is the most clichéd AI aesthetic
- ❌ Never place every section identically (image left / text right, repeat)
- ❌ Never ignore mobile — if it breaks at 390px, it is unacceptable
- ❌ Never use Lorem Ipsum — generate realistic placeholder content for the industry
- ❌ Never stack all animations at page load — stagger reveals by section
- ❌ Never leave form inputs unstyled or use default browser appearance

---

## ═══════════════════════════════════════════════
## CHAPTER 1 — CDN LIBRARY MANIFEST
## ═══════════════════════════════════════════════

Load ALL of these. No exceptions. Order matters — CSS in `<head>`, JS before `</body>`.

### 1.1 CSS CDNs (in `<head>`)

```html
<!-- Icons -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

<!-- Swiper (sliders, carousels) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">

<!-- AOS (scroll reveal animations) -->
<link rel="stylesheet" href="https://unpkg.com/aos@2.3.1/dist/aos.css">

<!-- lightGallery (image lightbox) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lightgallery@2.7.2/css/lightgallery-bundle.min.css">
```

### 1.2 JavaScript CDNs (before `</body>`, IN THIS ORDER)

```html
<!-- GSAP Core + ScrollTrigger (primary animation engine) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/TextPlugin.min.js"></script>

<!-- Lenis (buttery smooth scroll) -->
<script src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.js"></script>

<!-- Swiper -->
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>

<!-- AOS -->
<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>

<!-- Splitting.js (character/word split text animations) -->
<script src="https://cdn.jsdelivr.net/npm/splitting@1.0.6/dist/splitting.min.js"></script>

<!-- lightGallery + Plugins -->
<script src="https://cdn.jsdelivr.net/npm/lightgallery@2.7.2/lightgallery.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lightgallery@2.7.2/plugins/zoom/lg-zoom.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lightgallery@2.7.2/plugins/thumbnail/lg-thumbnail.min.js"></script>
```

---

## ═══════════════════════════════════════════════
## CHAPTER 2 — TYPOGRAPHY SYSTEM
## ═══════════════════════════════════════════════

### 2.1 Google Font Imports

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:ital,opsz,wght@0,14..32,200..800&family=Playfair+Display:ital,wght@0,400..800;1,400..600&family=JetBrains+Mono:wght@400;500;600&family=Rajdhani:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### 2.2 CSS Font Variables

```css
:root {
  --display:  'Bebas Neue', sans-serif;        /* Hero titles, massive headings */
  --display2: 'Rajdhani', sans-serif;          /* Section headings, nav labels */
  --display3: 'Playfair Display', serif;       /* Quotes, testimonials, elegance */
  --body:     'Inter', sans-serif;             /* All body copy, UI text */
  --mono:     'JetBrains Mono', monospace;     /* Numbers, stats, code, prices */
}
```

### 2.3 Fluid Typography Scale

```css
/* Use clamp() everywhere — never fixed px for headings */
.t-hero    { font-size: clamp(3.5rem, 12vw, 10rem);  font-family: var(--display); letter-spacing: 0.02em; line-height: 0.92; }
.t-h1      { font-size: clamp(2.8rem, 7vw,  6rem);   font-family: var(--display); line-height: 1.0; }
.t-h2      { font-size: clamp(2rem,   4vw,  3.5rem); font-family: var(--display2); font-weight: 700; }
.t-h3      { font-size: clamp(1.3rem, 2vw,  1.8rem); font-family: var(--display2); font-weight: 600; }
.t-body    { font-size: clamp(0.9rem, 1.4vw, 1.05rem); line-height: 1.7; }
.t-small   { font-size: clamp(0.75rem, 1vw, 0.875rem); }
.t-stat    { font-size: clamp(2rem, 5vw, 4rem); font-family: var(--mono); font-weight: 600; }
.t-quote   { font-size: clamp(1.1rem, 2vw, 1.4rem); font-family: var(--display3); font-style: italic; }
.t-label   { font-size: 0.7rem; font-family: var(--display2); letter-spacing: 0.15em; text-transform: uppercase; font-weight: 600; }
```

---

## ═══════════════════════════════════════════════
## CHAPTER 3 — COLOR DESIGN SYSTEM
## ═══════════════════════════════════════════════

### 3.1 Base Dark Theme Variables (Default)

```css
:root {
  /* ── Backgrounds ── */
  --bg:          #050505;
  --bg-2:        #0a0a0a;
  --bg-3:        #0f0f0f;
  --bg-card:     #0c0c0c;
  --bg-elevated: #141414;

  /* ── Text ── */
  --text:        #f3f3f3;
  --text-2:      #888888;
  --text-3:      #3a3a3a;
  --text-inv:    #050505;

  /* ── Brand Accent (SWAP PER INDUSTRY — see Chapter 15) ── */
  --accent:      #e63946;
  --accent-l:    #ff6b6b;
  --accent-d:    #c1121f;
  --accent-rgb:  230, 57, 70;
  --accent-dim:  rgba(var(--accent-rgb), 0.08);
  --accent-glow: rgba(var(--accent-rgb), 0.28);
  --accent-mid:  rgba(var(--accent-rgb), 0.15);

  /* ── Utility Colors ── */
  --gold:        #f59e0b;
  --gold-dim:    rgba(245,158,11,.12);
  --green:       #10b981;
  --green-dim:   rgba(16,185,129,.12);
  --red:         #ef4444;

  /* ── Borders ── */
  --border:      rgba(var(--accent-rgb), 0.14);
  --border-2:    rgba(243,243,243, 0.06);
  --border-3:    rgba(243,243,243, 0.03);

  /* ── Shadows ── */
  --shadow-sm:   0 4px 20px rgba(0,0,0,.4);
  --shadow-md:   0 10px 40px rgba(0,0,0,.6);
  --shadow-lg:   0 25px 80px rgba(0,0,0,.8);
  --glow:        0 0 40px var(--accent-glow);

  /* ── Motion ── */
  --ease:        cubic-bezier(.25,.46,.45,.94);
  --ease-fast:   cubic-bezier(.77, 0, .175, 1);
  --ease-spring: cubic-bezier(.34, 1.56, .64, 1);
  --duration:    0.4s;
}
```

### 3.2 Section Background Variation Pattern

```css
/* Alternate section backgrounds for visual rhythm */
section:nth-child(even) { background: var(--bg-2); }
section:nth-child(odd)  { background: var(--bg);   }
/* Override manually where needed */
.section-accent-bg { background: linear-gradient(135deg, var(--accent-dim) 0%, transparent 60%); }
```

---

## ═══════════════════════════════════════════════
## CHAPTER 4 — GLOBAL RESET & BASE STYLES
## ═══════════════════════════════════════════════

```css
*, *::before, *::after {
  margin: 0; padding: 0; box-sizing: border-box;
}

html {
  font-size: 16px;
  scroll-behavior: auto; /* Lenis handles smooth scroll */
  scrollbar-width: thin;
  scrollbar-color: var(--accent) var(--bg);
  -webkit-text-size-adjust: 100%;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--body);
  font-weight: 400;
  line-height: 1.6;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  cursor: crosshair; /* Desktop only */
}

@media (max-width: 768px) { body { cursor: auto; } }

img  { max-width: 100%; height: auto; display: block; }
a    { text-decoration: none; color: inherit; }
button { cursor: pointer; border: none; background: none; font-family: var(--body); color: var(--text); }
input, select, textarea {
  font-family: var(--body); color: var(--text);
  background: var(--bg-3); border: 1px solid var(--border-2);
  outline: none; transition: border-color var(--duration) var(--ease);
}
input:focus, select:focus, textarea:focus { border-color: var(--accent); }
ul, ol { list-style: none; }

::-webkit-scrollbar       { width: 4px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 0; }

/* Section padding utility */
.section-pad { padding: clamp(4.5rem, 9vw, 8rem) 0; }

/* Container */
.container {
  max-width: 1240px;
  width: 92%;
  margin: 0 auto;
}

/* Flex/Grid utilities */
.flex         { display: flex; }
.flex-center  { display: flex; align-items: center; justify-content: center; }
.grid-auto    { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr)); gap: 1.5rem; }

/* Accent text */
.accent       { color: var(--accent); }
.gold         { color: var(--gold); }

/* Section label (eyebrow text above headings) */
.section-label {
  display: inline-flex; align-items: center; gap: 0.5rem;
  font-size: 0.7rem; font-family: var(--display2); letter-spacing: 0.2em;
  text-transform: uppercase; color: var(--accent); font-weight: 600;
  margin-bottom: 0.75rem;
}
.section-label::before {
  content: ''; display: block; width: 24px; height: 1.5px; background: var(--accent);
}

/* Divider line */
.divider { width: 60px; height: 2px; background: var(--accent); margin: 1.5rem 0; }
.divider.centered { margin: 1.5rem auto; }
```

---

## ═══════════════════════════════════════════════
## CHAPTER 5 — MOBILE-FIRST RESPONSIVE SYSTEM
## ═══════════════════════════════════════════════

### 5.1 Breakpoint Philosophy

**Design from 390px up. Add complexity at wider screens. Never remove content on mobile.**

```
390px  — Mobile S (iPhone SE)    — BASE — everything must work here
480px  — Mobile L (large phones) — Minor spacing tweaks
640px  — Mobile XL / Phablet     — 2 column grids start
768px  — Tablet portrait          — Show desktop nav, 2-3 columns
900px  — Tablet landscape         — 3+ columns, larger spacing
1024px — Small laptop             — Full desktop layout
1280px — Desktop                  — Max-width containers
1600px — Wide desktop             — Slight font scaling only
```

### 5.2 Grid System

```css
/* Mobile-first responsive grids */
.grid-1  { display: grid; grid-template-columns: 1fr; gap: 1.25rem; }
.grid-2  { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem; }
.grid-3  { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
.grid-4  { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }

/* Responsive overrides */
@media (max-width: 1024px) { .grid-4 { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px)  { .grid-3, .grid-4 { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px)  { .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; } }

/* Utility visibility */
.hide-mobile  { display: block; }
.show-mobile  { display: none; }
@media (max-width: 768px) {
  .hide-mobile { display: none !important; }
  .show-mobile { display: block !important; }
}
```

### 5.3 Mobile-Specific Overrides

```css
@media (max-width: 768px) {
  /* Stack two-column layouts */
  .two-col { flex-direction: column; }

  /* Tighten section padding */
  .section-pad { padding: clamp(3rem, 8vw, 5rem) 0; }

  /* Hero full height on mobile */
  #hero { min-height: 100svh; }

  /* Disable parallax on mobile for performance */
  .parallax-el { transform: none !important; }

  /* Larger touch targets */
  button, a { min-height: 44px; }

  /* Full-width CTAs on mobile */
  .btn-hero { width: 100%; text-align: center; justify-content: center; }

  /* Adjust font sizes */
  .t-hero { letter-spacing: 0; }
}

@media (max-width: 390px) {
  .container { width: 95%; }
}
```

---

## ═══════════════════════════════════════════════
## CHAPTER 6 — IMAGE SYSTEM (Unsplash)
## ═══════════════════════════════════════════════

### 6.1 URL Format

```
https://images.unsplash.com/photo-PHOTO_ID?w=WIDTH&h=HEIGHT&fit=crop&q=QUALITY&auto=format
```

### 6.2 Standard Image Sizes

| Usage              | Width | Height | Quality | Notes                  |
|--------------------|-------|--------|---------|------------------------|
| Hero background    | 1920  | 1080   | 85      | `loading="eager"`      |
| Hero mobile        | 800   | 1200   | 80      | Portrait crop          |
| Card (3:4)         | 600   | 800    | 80      | `loading="lazy"`       |
| Card (16:9)        | 800   | 450    | 80      | Wide cards             |
| Square thumb       | 400   | 400    | 75      | Gallery, avatar        |
| Lightbox full      | 1400  | 1400   | 90      | LightGallery `href`    |
| Team portrait      | 500   | 650    | 80      | 3:4 ratio              |
| Logo/icon space    | 200   | 200    | 70      | Sponsor logos          |

### 6.3 Recommended Unsplash IDs by Industry

```
GYM/FITNESS:
  Equipment:   photo-1534438327276-14e5300c3a48
  Workout:     photo-1581009146145-b5ef050c2e1e
  Barbell:     photo-1583454110551-21f2fa2afe61
  Running:     photo-1476480862126-209bfaa8edc8
  Yoga:        photo-1544367567-0f2fcb009e0b
  Protein:     photo-1593095948071-474c5cc2989d

RESTAURANT/FOOD:
  Steak:       photo-1546833999-b9f581a1996d
  Coffee:      photo-1495474472287-4d71bcdd2085
  Ambiance:    photo-1555396273-367ea4eb4db5
  Cocktails:   photo-1514362545857-3bc16c4c7d1b
  Dessert:     photo-1578985545062-69928b1d9587

FASHION/RETAIL:
  Lookbook:    photo-1558769132-cb1aea458c5e
  Clothing:    photo-1490481651871-ab68de25d43d
  Studio:      photo-1509631179647-0177331693ae
  Accessories: photo-1523170335258-f5ed11844a49

TECH/SAAS:
  Laptop:      photo-1517694712202-14dd9538aa97
  Code:        photo-1555066931-4365d14bab8c
  Office:      photo-1497366216548-37526070297c
  Dashboard:   photo-1551288049-bebda4e38f71
  Team:        photo-1522071820081-009f0129c71c

REAL ESTATE:
  Modern Home: photo-1558618666-fcd25c85cd64
  Interior:    photo-1560448204-e02f11c3d0e2
  Architecture:photo-1486325212027-8081e485255e
  Aerial:      photo-1513584684374-8bab748fbf90

BEAUTY/SPA:
  Spa:         photo-1540555700478-4be289fbecef
  Products:    photo-1596462502278-27bfdc403348
  Skincare:    photo-1617897903246-719242758050
  Wellness:    photo-1487412720507-e7ab37603c6f
```

### 6.4 CSS Image Treatments

```css
/* Cinematic hero overlay */
.hero-img {
  filter: brightness(0.28) contrast(1.3) saturate(0.5);
  transition: transform 2s cubic-bezier(.25,.46,.45,.94);
  will-change: transform;
}

/* Card hover */
.card-img-wrap { overflow: hidden; }
.card-img-wrap img {
  transition: transform 0.7s var(--ease), filter 0.7s var(--ease);
  filter: brightness(0.75) contrast(1.1);
}
.card:hover .card-img-wrap img {
  transform: scale(1.07);
  filter: brightness(0.55) contrast(1.15);
}

/* Noise texture overlay (adds premium grain) */
.noise-overlay::after {
  content: '';
  position: absolute; inset: 0; z-index: 1; pointer-events: none;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-size: 200px 200px;
}

/* Fallback for broken images */
/* Add to all img tags: */
/* onerror="this.src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=800&fit=crop&q=60'" */
```

---

## ═══════════════════════════════════════════════
## CHAPTER 7 — HOVER EFFECTS LIBRARY
## ═══════════════════════════════════════════════

```css
/* ── 1. UNDERLINE SLIDE ── */
.hover-underline { position: relative; display: inline-block; }
.hover-underline::after {
  content: ''; position: absolute; bottom: -1px; left: 0;
  width: 0; height: 1.5px; background: var(--accent);
  transition: width 0.4s var(--ease);
}
.hover-underline:hover::after { width: 100%; }

/* ── 2. LIFT CARD ── */
.hover-lift { transition: transform 0.4s var(--ease), box-shadow 0.4s var(--ease); }
.hover-lift:hover { transform: translateY(-8px); box-shadow: var(--shadow-lg); }

/* ── 3. GLOW BORDER ── */
.hover-glow { border: 1px solid var(--border-2); transition: border-color 0.4s, box-shadow 0.4s; }
.hover-glow:hover { border-color: var(--accent); box-shadow: var(--glow); }

/* ── 4. SCALE IMAGE ── */
.hover-scale-img .img-wrap { overflow: hidden; }
.hover-scale-img .img-wrap img { transition: transform 0.7s var(--ease); }
.hover-scale-img:hover .img-wrap img { transform: scale(1.07); }

/* ── 5. SLIDE-IN ICONS ── */
.hover-icons .icon-row {
  opacity: 0; transform: translateX(12px);
  transition: opacity 0.35s var(--ease), transform 0.35s var(--ease);
}
.hover-icons:hover .icon-row { opacity: 1; transform: translateX(0); }

/* ── 6. BUTTON FILL SWEEP ── */
.btn-sweep {
  position: relative; overflow: hidden;
  transition: color 0.4s var(--ease);
  z-index: 0;
}
.btn-sweep::before {
  content: ''; position: absolute; inset: 0; z-index: -1;
  background: var(--text); transform: translateX(-101%);
  transition: transform 0.5s var(--ease);
}
.btn-sweep:hover { color: var(--bg); }
.btn-sweep:hover::before { transform: translateX(0); }

/* ── 7. SCALE POP ── */
.hover-pop { transition: transform 0.3s var(--ease-spring); }
.hover-pop:hover { transform: scale(1.08); }

/* ── 8. ARROW NUDGE ── */
.hover-arrow .arrow-icon { transition: transform 0.35s var(--ease); display: inline-block; }
.hover-arrow:hover .arrow-icon { transform: translateX(5px); }

/* ── 9. OVERLAY FADE-IN ── */
.hover-overlay { position: relative; overflow: hidden; }
.hover-overlay .overlay {
  position: absolute; inset: 0;
  opacity: 0; transition: opacity 0.4s var(--ease);
}
.hover-overlay:hover .overlay { opacity: 1; }

/* ── 10. TOP BORDER SLIDE ── */
.hover-top-border { position: relative; }
.hover-top-border::before {
  content: ''; position: absolute; top: 0; left: 0;
  width: 0; height: 2px; background: var(--accent);
  transition: width 0.4s var(--ease);
}
.hover-top-border:hover::before { width: 100%; }

/* ── 11. GLOW PULSE (for CTAs) ── */
@keyframes glowPulse {
  0%, 100% { box-shadow: 0 0 20px var(--accent-glow); }
  50%       { box-shadow: 0 0 45px var(--accent-glow), 0 0 80px rgba(var(--accent-rgb),.1); }
}
.hover-pulse:hover { animation: glowPulse 1.6s ease infinite; }

/* ── 12. COLOR FLIP (icon color change) ── */
.hover-color-flip { transition: color 0.3s var(--ease), background 0.3s var(--ease); }
.hover-color-flip:hover { color: var(--accent); }
```

---

## ═══════════════════════════════════════════════
## CHAPTER 8 — BUTTON SYSTEM
## ═══════════════════════════════════════════════

```css
/* Base button */
.btn {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.85em 2em; border-radius: 2px;
  font-family: var(--display2); font-weight: 700;
  font-size: 0.875rem; letter-spacing: 0.1em; text-transform: uppercase;
  transition: all 0.35s var(--ease); cursor: pointer;
  position: relative; overflow: hidden; white-space: nowrap;
  min-height: 48px; /* touch target */
}

/* Primary — filled accent */
.btn-primary {
  background: var(--accent); color: #fff;
  border: 1px solid var(--accent);
}
.btn-primary:hover {
  background: var(--accent-d);
  transform: translateY(-2px);
  box-shadow: 0 8px 30px var(--accent-glow);
}

/* Secondary — outlined */
.btn-outline {
  background: transparent; color: var(--text);
  border: 1px solid var(--border-2);
}
.btn-outline:hover {
  border-color: var(--accent); color: var(--accent);
  background: var(--accent-dim);
}

/* Ghost — text only with arrow */
.btn-ghost {
  background: transparent; color: var(--accent);
  border: none; padding-left: 0;
}
.btn-ghost:hover { gap: 1rem; }

/* Gold CTA */
.btn-gold {
  background: var(--gold); color: #000;
  border: 1px solid var(--gold); font-weight: 800;
}
.btn-gold:hover { background: #fff; border-color: #fff; }

/* Full width */
.btn-full { width: 100%; justify-content: center; }

/* Size variants */
.btn-sm  { padding: 0.6em 1.4em; font-size: 0.8rem; min-height: 38px; }
.btn-lg  { padding: 1.1em 2.8em; font-size: 1rem; min-height: 56px; }
```

---

## ═══════════════════════════════════════════════
## CHAPTER 9 — ANIMATION & SCROLL SYSTEM
## ═══════════════════════════════════════════════

### 9.1 Lenis Smooth Scroll

```javascript
// Initialize Lenis — always wrap in try/catch
let lenis;
try {
  lenis = new Lenis({ lerp: 0.08, smoothWheel: true, syncTouch: false });
  lenis.on('scroll', ScrollTrigger.update);
  lenis.on('scroll', ({ progress }) => {
    const bar = document.getElementById('scroll-prog');
    if (bar) bar.style.width = (progress * 100) + '%';
  });
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
} catch(e) { console.warn('Lenis:', e); }

// Smooth anchor scrolling
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) lenis ? lenis.scrollTo(target, { offset: -80 }) : target.scrollIntoView({ behavior: 'smooth' });
  });
});
```

### 9.2 AOS (Scroll Reveal)

```javascript
AOS.init({
  duration: 850,
  once: true,
  offset: 60,
  easing: 'ease-out-cubic',
  disable: window.innerWidth < 480 ? true : false // Disable on very small screens for perf
});
```

**AOS Usage in HTML:**
```html
<div data-aos="fade-up">                        Basic fade up         </div>
<div data-aos="fade-up"  data-aos-delay="150">  Staggered (add 150ms per item) </div>
<div data-aos="fade-right">                     From left             </div>
<div data-aos="fade-left">                      From right            </div>
<div data-aos="zoom-in"  data-aos-duration="600"> Zoom in             </div>
<div data-aos="flip-left">                      3D flip               </div>
```

### 9.3 GSAP Setup & Core Animations

```javascript
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// ── HERO ENTRANCE (called after loader completes) ──
function heroIn() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.set(['.hero-tag', '.hero-title', '.hero-sub', '.hero-btns', '.hero-trust'], { opacity: 0, y: 30 })
    .to('.hero-tag',   { opacity: 1, y: 0, duration: 0.7 })
    .to('.hero-title', { opacity: 1, y: 0, duration: 0.9 }, '<0.2')
    .to('.hero-sub',   { opacity: 1, y: 0, duration: 0.8 }, '<0.3')
    .to('.hero-btns',  { opacity: 1, y: 0, duration: 0.7 }, '<0.25')
    .to('.hero-trust', { opacity: 1, y: 0, duration: 0.6 }, '<0.2');
}

// ── PARALLAX HERO IMAGE ──
window.addEventListener('scroll', () => {
  const heroImg = document.querySelector('.hero-bg-img');
  if (heroImg && window.innerWidth > 768) {
    heroImg.style.transform = `translateY(${window.scrollY * 0.28}px)`;
  }
}, { passive: true });

// ── NAVBAR BEHAVIOR ──
window.addEventListener('scroll', () => {
  const nav = document.getElementById('nav');
  const backTop = document.getElementById('backTop');
  if (nav) nav.classList.toggle('stuck', window.scrollY > 70);
  if (backTop) backTop.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });

// ── CARD BATCH ANIMATION ──
ScrollTrigger.batch('.animate-card', {
  onEnter: els => gsap.fromTo(els,
    { y: 60, opacity: 0 },
    { y: 0, opacity: 1, stagger: 0.1, duration: 0.85, ease: 'power3.out' }
  ),
  once: true,
  start: 'top 88%'
});

// ── STAT COUNTER ANIMATION ──
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    gsap.fromTo({ val: 0 }, { val: target }, {
      duration: 2, ease: 'power2.out',
      onUpdate: function() { el.textContent = Math.round(this.targets()[0].val).toLocaleString(); },
      scrollTrigger: { trigger: el, start: 'top 85%', once: true }
    });
  });
}

// ── HORIZONTAL MARQUEE via GSAP (fallback) ──
// (CSS marquee is preferred — see Chapter 11, Section 11.7)

// ── SECTION HEADING REVEAL ──
gsap.utils.toArray('.section-reveal').forEach(el => {
  gsap.fromTo(el,
    { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
    { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 1.1, ease: 'power4.inOut',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true }
    }
  );
});
```

### 9.4 Splitting.js (Character Animation)

```javascript
Splitting();
```

```css
/* Character split animation */
[data-splitting] .char {
  display: inline-block;
  animation: charReveal 0.6s cubic-bezier(.3, 0, .2, 1) both;
  animation-delay: calc(var(--char-index) * 0.03s);
}
@keyframes charReveal {
  from { opacity: 0; transform: translateY(24px) rotateX(-40deg); }
  to   { opacity: 1; transform: translateY(0) rotateX(0deg); }
}
```

**HTML Usage:**
```html
<h1 data-splitting>Your Headline Here</h1>
<h2 data-splitting data-splitting-by="words">Word by Word</h2>
```

---

## ═══════════════════════════════════════════════
## CHAPTER 10 — PAGE LOADER
## ═══════════════════════════════════════════════

### 10.1 HTML

```html
<div id="loader">
  <div class="loader-inner">
    <div class="loader-logo">BRAND</div>
    <div class="loader-tagline">TAGLINE</div>
    <div class="loader-bar-wrap">
      <div class="loader-bar" id="lbar"></div>
    </div>
    <div class="loader-pct" id="lpct">0%</div>
    <div class="loader-badges">
      <span><i class="fa-solid fa-check-circle"></i> Trust Badge 1</span>
      <span><i class="fa-solid fa-check-circle"></i> Trust Badge 2</span>
      <span><i class="fa-solid fa-check-circle"></i> Trust Badge 3</span>
    </div>
  </div>
</div>
```

### 10.2 CSS

```css
#loader {
  position: fixed; inset: 0; z-index: 99999;
  background: var(--bg); display: flex;
  align-items: center; justify-content: center;
  flex-direction: column;
}
.loader-inner { text-align: center; width: min(340px, 88vw); }
.loader-logo  { font-family: var(--display); font-size: clamp(3rem, 10vw, 5.5rem); color: var(--text); letter-spacing: 0.05em; line-height: 1; }
.loader-tagline { font-family: var(--display2); font-size: 0.7rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--text-2); margin: 0.5rem 0 2rem; }
.loader-bar-wrap { width: 100%; height: 2px; background: var(--bg-elevated); margin-bottom: 0.75rem; }
.loader-bar { height: 100%; width: 0%; background: var(--accent); transition: width 0.1s linear; box-shadow: 0 0 12px var(--accent-glow); }
.loader-pct { font-family: var(--mono); font-size: 0.75rem; color: var(--text-2); letter-spacing: 0.1em; margin-bottom: 2.5rem; }
.loader-badges { display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: center; }
.loader-badges span { font-family: var(--display2); font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-2); display: flex; align-items: center; gap: 0.3rem; }
.loader-badges i { color: var(--accent); font-size: 0.65rem; }
```

### 10.3 JavaScript

```javascript
(function () {
  let progress = 0;
  const bar = document.getElementById('lbar');
  const pct = document.getElementById('lpct');
  const interval = setInterval(() => {
    progress += Math.random() * 16 + 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        gsap.to('#loader', {
          yPercent: -100, duration: 1.1, ease: 'power4.inOut',
          onComplete: () => {
            document.getElementById('loader').style.display = 'none';
            heroIn(); // Trigger hero entrance
            animateCounters();
          }
        });
      }, 350);
    }
    bar.style.width = progress + '%';
    if (pct) pct.textContent = Math.floor(progress) + '%';
  }, 100);
})();
```

---

## ═══════════════════════════════════════════════
## CHAPTER 11 — REQUIRED SECTIONS BLUEPRINT
## ═══════════════════════════════════════════════

### 11.1 Custom Cursor (Desktop Only)

```html
<div id="cur"></div>
<div id="cur-f"></div>
```

```css
#cur {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--accent); position: fixed; pointer-events: none;
  z-index: 99998; transform: translate(-50%, -50%); transition: width 0.2s, height 0.2s;
}
#cur-f {
  width: 40px; height: 40px; border-radius: 50%;
  border: 1.5px solid var(--accent); position: fixed; pointer-events: none;
  z-index: 99997; transform: translate(-50%, -50%);
  transition: all 0.12s var(--ease); opacity: 0.7;
}
.cursor-hover #cur   { width: 14px; height: 14px; }
.cursor-hover #cur-f { width: 60px; height: 60px; opacity: 0.3; }
@media (max-width: 768px) { #cur, #cur-f { display: none; } }
```

```javascript
const cur = document.getElementById('cur');
const curf = document.getElementById('cur-f');
if (cur && window.innerWidth > 768) {
  let mx = 0, my = 0, fx = 0, fy = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  const loop = () => {
    fx += (mx - fx) * 0.14; fy += (my - fy) * 0.14;
    cur.style.left = mx + 'px'; cur.style.top = my + 'px';
    curf.style.left = fx + 'px'; curf.style.top = fy + 'px';
    requestAnimationFrame(loop);
  };
  loop();
  document.querySelectorAll('a, button, [data-cursor]').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}
```

---

### 11.2 Scroll Progress Bar

```html
<div id="scroll-prog"></div>
```

```css
#scroll-prog {
  position: fixed; top: 0; left: 0; z-index: 10001;
  height: 3px; width: 0%;
  background: linear-gradient(90deg, var(--accent-d), var(--accent), var(--accent-l));
  box-shadow: 0 0 10px var(--accent-glow);
  transition: width 0.05s linear;
}
```

---

### 11.3 Back to Top Button

```html
<button id="backTop" aria-label="Back to top">
  <i class="fa-solid fa-arrow-up"></i>
</button>
```

```css
#backTop {
  position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 9000;
  width: 44px; height: 44px; border-radius: 2px;
  border: 1px solid var(--border-2); color: var(--text-2);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transform: translateY(16px);
  transition: all 0.4s var(--ease); pointer-events: none;
}
#backTop.visible { opacity: 1; transform: translateY(0); pointer-events: auto; }
#backTop:hover { border-color: var(--accent); color: var(--accent); }
```

```javascript
document.getElementById('backTop')?.addEventListener('click', () => {
  lenis ? lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: 'smooth' });
});
```

---

### 11.4 Navbar

```html
<header id="nav">
  <div class="nav-inner container">
    <a href="#" class="nav-logo">BRAND</a>

    <nav class="nav-links hide-mobile">
      <a href="#about"    class="hover-underline">About</a>
      <a href="#products" class="hover-underline">Products</a>
      <a href="#services" class="hover-underline">Services</a>
      <a href="#gallery"  class="hover-underline">Gallery</a>
      <a href="#contact"  class="hover-underline">Contact</a>
    </nav>

    <div class="nav-actions">
      <!-- Cart (optional) -->
      <button class="nav-cart hover-pop" id="cartBtn" aria-label="Cart">
        <i class="fa-solid fa-bag-shopping"></i>
        <span class="cart-badge" id="cartBadge" style="display:none">0</span>
      </button>
      <!-- Mobile hamburger -->
      <button class="hamburger show-mobile" id="menuBtn" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</header>
```

```css
#nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 10000;
  padding: 1.25rem 0; transition: all 0.4s var(--ease);
}
#nav.stuck {
  background: rgba(5,5,5,.9); backdrop-filter: blur(16px) saturate(1.8);
  border-bottom: 1px solid var(--border-2); padding: 0.8rem 0;
}
.nav-inner { display: flex; align-items: center; justify-content: space-between; gap: 2rem; }
.nav-logo { font-family: var(--display); font-size: 1.6rem; letter-spacing: 0.08em; }
.nav-links { display: flex; gap: 2rem; }
.nav-links a { font-family: var(--display2); font-size: 0.875rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-2); transition: color 0.3s; }
.nav-links a:hover { color: var(--text); }
.nav-actions { display: flex; align-items: center; gap: 1rem; }
.nav-cart { position: relative; padding: 0.3rem; font-size: 1.1rem; color: var(--text-2); }
.nav-cart:hover { color: var(--accent); }
.cart-badge {
  position: absolute; top: -6px; right: -6px;
  background: var(--accent); color: #fff; border-radius: 50%;
  font-size: 0.6rem; width: 18px; height: 18px;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--mono); font-weight: 600;
}

/* Hamburger */
.hamburger { display: flex; flex-direction: column; gap: 5px; padding: 4px; }
.hamburger span { display: block; width: 24px; height: 1.5px; background: var(--text); transition: all 0.4s var(--ease); }
.hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(4.5px, 4.5px); }
.hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
.hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(4.5px, -4.5px); }
```

---

### 11.5 Mobile Menu

```html
<nav class="mob-menu" id="mobMenu">
  <div class="mob-menu-inner">
    <a href="#about"    class="mob-link" onclick="closeMobileMenu()">About</a>
    <a href="#products" class="mob-link" onclick="closeMobileMenu()">Products</a>
    <a href="#services" class="mob-link" onclick="closeMobileMenu()">Services</a>
    <a href="#gallery"  class="mob-link" onclick="closeMobileMenu()">Gallery</a>
    <a href="#contact"  class="mob-link" onclick="closeMobileMenu()">Contact</a>
    <div class="mob-cta">
      <a href="#contact" class="btn btn-primary btn-full" onclick="closeMobileMenu()">Get Started</a>
    </div>
  </div>
</nav>
<div class="mob-overlay" id="mobOverlay" onclick="closeMobileMenu()"></div>
```

```css
.mob-menu {
  position: fixed; top: 0; right: 0; bottom: 0;
  width: min(360px, 100vw); z-index: 9999;
  background: var(--bg-2); padding: 6rem 2.5rem 2.5rem;
  transform: translateX(100%); transition: transform 0.5s var(--ease-fast);
  display: flex; flex-direction: column;
}
.mob-menu.open { transform: translateX(0); }
.mob-overlay {
  position: fixed; inset: 0; z-index: 9998;
  background: rgba(0,0,0,.7); backdrop-filter: blur(4px);
  opacity: 0; pointer-events: none; transition: opacity 0.4s;
}
.mob-overlay.open { opacity: 1; pointer-events: auto; }
.mob-link {
  display: block; font-family: var(--display); font-size: clamp(2rem, 8vw, 3rem);
  color: var(--text-2); padding: 0.4rem 0; border-bottom: 1px solid var(--border-3);
  transition: color 0.3s, padding-left 0.3s;
}
.mob-link:hover { color: var(--accent); padding-left: 0.5rem; }
.mob-cta { margin-top: auto; padding-top: 2rem; }
```

```javascript
function openMobileMenu() {
  document.getElementById('mobMenu').classList.add('open');
  document.getElementById('mobOverlay').classList.add('open');
  document.getElementById('menuBtn').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMobileMenu() {
  document.getElementById('mobMenu').classList.remove('open');
  document.getElementById('mobOverlay').classList.remove('open');
  document.getElementById('menuBtn').classList.remove('open');
  document.body.style.overflow = '';
}
document.getElementById('menuBtn')?.addEventListener('click', () => {
  document.getElementById('mobMenu').classList.contains('open') ? closeMobileMenu() : openMobileMenu();
});
```

---

### 11.6 Hero Section

```html
<section id="hero">
  <!-- Swiper slider as background -->
  <div class="hero-swiper swiper">
    <div class="swiper-wrapper">
      <div class="swiper-slide">
        <img class="hero-bg-img" src="UNSPLASH_URL" alt="Hero 1">
      </div>
      <div class="swiper-slide">
        <img class="hero-bg-img" src="UNSPLASH_URL" alt="Hero 2">
      </div>
      <div class="swiper-slide">
        <img class="hero-bg-img" src="UNSPLASH_URL" alt="Hero 3">
      </div>
    </div>
    <div class="hero-overlay noise-overlay"></div>
    <div class="swiper-pagination hero-pagination"></div>
  </div>

  <!-- Hero Content -->
  <div class="hero-body container">
    <div class="hero-tag t-label"><span class="accent">●</span> TAGLINE / EYEBROW TEXT</div>
    <h1 class="hero-title t-hero" data-splitting>MAIN HEADLINE</h1>
    <p class="hero-sub">Compelling subheadline that speaks directly to the customer's desire. One to two sentences maximum.</p>
    <div class="hero-btns">
      <a href="#products" class="btn btn-primary btn-lg hover-pulse">Get Started <i class="fa-solid fa-arrow-right arrow-icon"></i></a>
      <a href="#about"    class="btn btn-outline btn-lg">Learn More</a>
    </div>
    <!-- Trust strip -->
    <div class="hero-trust">
      <span><i class="fa-solid fa-check"></i> Trust Point 1</span>
      <span><i class="fa-solid fa-check"></i> Trust Point 2</span>
      <span><i class="fa-solid fa-check"></i> Trust Point 3</span>
      <span><i class="fa-solid fa-check"></i> Trust Point 4</span>
      <span><i class="fa-solid fa-check"></i> Trust Point 5</span>
    </div>
  </div>
</section>
```

```css
#hero {
  position: relative; min-height: 100dvh; min-height: 100svh;
  display: flex; align-items: flex-end;
  padding-bottom: clamp(3rem, 7vw, 6rem);
}
.hero-swiper { position: absolute; inset: 0; }
.hero-swiper .swiper-slide { height: 100%; }
.hero-bg-img { width: 100%; height: 100%; object-fit: cover; filter: brightness(.3) contrast(1.3) saturate(.5); will-change: transform; }
.hero-overlay {
  position: absolute; inset: 0; z-index: 2;
  background: linear-gradient(
    to top,
    rgba(5,5,5,1) 0%,
    rgba(5,5,5,0.5) 50%,
    rgba(5,5,5,.15) 100%
  );
}
.hero-body    { position: relative; z-index: 3; max-width: 700px; }
.hero-tag     { opacity: 0; transform: translateY(20px); display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; }
.hero-title   { opacity: 0; line-height: 0.9; margin-bottom: 1.25rem; }
.hero-sub     { opacity: 0; transform: translateY(20px); color: var(--text-2); max-width: 520px; margin-bottom: 2rem; font-size: clamp(1rem, 1.6vw, 1.15rem); }
.hero-btns    { opacity: 0; transform: translateY(20px); display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 3rem; }
.hero-trust   { opacity: 0; transform: translateY(20px); display: flex; flex-wrap: wrap; gap: 1rem 2rem; }
.hero-trust span { font-family: var(--display2); font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-2); display: flex; align-items: center; gap: 0.4rem; }
.hero-trust i { color: var(--accent); }
.hero-pagination { position: absolute !important; bottom: 2rem !important; right: 2rem !important; left: auto !important; width: auto !important; z-index: 10; }
.hero-pagination .swiper-pagination-bullet { background: var(--text-2); opacity: 1; border-radius: 2px; width: 20px; height: 2px; transition: all 0.3s; }
.hero-pagination .swiper-pagination-bullet-active { background: var(--accent); width: 40px; }

@media (max-width: 768px) {
  #hero { align-items: center; padding-bottom: 6rem; text-align: center; }
  .hero-body { max-width: 100%; }
  .hero-btns { justify-content: center; }
  .hero-trust { justify-content: center; }
  .hero-sub   { margin: 0 auto 2rem; }
}
```

```javascript
const heroSwiper = new Swiper('.hero-swiper', {
  effect: 'fade',
  autoplay: { delay: 5000, disableOnInteraction: false },
  loop: true,
  speed: 1200,
  pagination: { el: '.hero-pagination', clickable: true },
});
```

---

### 11.7 Marquee Band

```html
<div class="marquee-band" aria-hidden="true">
  <div class="marquee-track">
    <!-- Duplicate list for seamless loop -->
    <span>ITEM ONE</span> <span class="dot">◆</span>
    <span>ITEM TWO</span> <span class="dot">◆</span>
    <span>ITEM THREE</span> <span class="dot">◆</span>
    <span>ITEM FOUR</span> <span class="dot">◆</span>
    <span>ITEM FIVE</span> <span class="dot">◆</span>
    <!-- DUPLICATE ↓ -->
    <span>ITEM ONE</span> <span class="dot">◆</span>
    <span>ITEM TWO</span> <span class="dot">◆</span>
    <span>ITEM THREE</span> <span class="dot">◆</span>
    <span>ITEM FOUR</span> <span class="dot">◆</span>
    <span>ITEM FIVE</span> <span class="dot">◆</span>
  </div>
</div>
```

```css
.marquee-band {
  background: var(--accent); padding: 0.9rem 0; overflow: hidden;
  border-top: 1px solid var(--accent-d); border-bottom: 1px solid var(--accent-d);
}
.marquee-track {
  display: flex; align-items: center; gap: 2.5rem;
  width: max-content; animation: marqueeScroll 28s linear infinite;
  white-space: nowrap;
}
.marquee-band:hover .marquee-track { animation-play-state: paused; }
.marquee-track span { font-family: var(--display); font-size: 1.1rem; letter-spacing: 0.12em; color: #fff; }
.marquee-track .dot { color: rgba(255,255,255,0.5); font-size: 0.6rem; }
@keyframes marqueeScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
```

---

### 11.8 Stats / Trust Numbers Section

```html
<section class="section-pad" id="stats">
  <div class="container">
    <div class="stats-grid">
      <div class="stat-item" data-aos="fade-up">
        <div class="stat-num t-stat accent" data-count="500">0</div>
        <div class="stat-suffix">+</div>
        <div class="stat-label t-label">Customers Served</div>
      </div>
      <!-- Repeat × 4 -->
    </div>
  </div>
</section>
```

```css
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
.stat-item  { text-align: center; padding: 2.5rem 1rem; border: 1px solid var(--border-3); }
.stat-item:hover { border-color: var(--border); background: var(--accent-dim); }
.stat-num  { display: inline; }
.stat-suffix { font-family: var(--mono); font-size: 2rem; color: var(--accent); display: inline; }
.stat-label { margin-top: 0.5rem; }
@media (max-width: 640px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
```

---

### 11.9 Cards / Products Section

```html
<section class="section-pad" id="products">
  <div class="container">
    <div class="section-header" data-aos="fade-up">
      <span class="section-label">Products</span>
      <h2 class="t-h1">SECTION HEADING</h2>
      <div class="divider"></div>
      <p class="section-desc">Brief description of this section's value proposition.</p>
    </div>
    <div class="products-grid">
      <article class="product-card animate-card hover-lift hover-top-border hover-scale-img">
        <div class="card-img-wrap">
          <img src="UNSPLASH_URL" alt="Product Name" loading="lazy"
               onerror="this.src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=800&fit=crop&q=60'">
          <span class="card-badge">FEATURED</span>
        </div>
        <div class="card-body">
          <span class="card-cat t-label">Category</span>
          <h3 class="card-title t-h3">Product Name</h3>
          <p class="card-desc t-body">Short product description in one to two sentences.</p>
          <div class="card-footer">
            <span class="card-price t-stat">₹9,999</span>
            <button class="btn btn-primary btn-sm" onclick="addToCart(1)">Add to Cart</button>
          </div>
        </div>
      </article>
    </div>
  </div>
</section>
```

```css
.section-header { max-width: 620px; margin-bottom: clamp(2.5rem, 5vw, 4.5rem); }
.section-header.centered { max-width: 720px; margin-left: auto; margin-right: auto; text-align: center; }
.section-header.centered .divider { margin: 1.5rem auto; }
.section-desc { color: var(--text-2); max-width: 520px; margin-top: 1rem; }

.products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr)); gap: 1.5rem; }
.product-card  { background: var(--bg-card); border: 1px solid var(--border-3); overflow: hidden; }
.card-img-wrap { position: relative; aspect-ratio: 3/4; overflow: hidden; }
.card-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
.card-badge {
  position: absolute; top: 1rem; left: 1rem;
  background: var(--accent); color: #fff;
  font-family: var(--display2); font-size: 0.65rem; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase; padding: 0.25em 0.7em;
}
.card-body   { padding: 1.25rem; }
.card-cat    { color: var(--accent); margin-bottom: 0.4rem; display: block; }
.card-title  { margin-bottom: 0.5rem; }
.card-desc   { color: var(--text-2); margin-bottom: 1.25rem; font-size: 0.9rem; }
.card-footer { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; }
.card-price  { color: var(--accent); font-size: 1.5rem; }
```

---

### 11.10 Pricing / Membership Section

```html
<section class="section-pad" id="pricing">
  <div class="container">
    <div class="section-header centered" data-aos="fade-up">
      <span class="section-label">Pricing</span>
      <h2 class="t-h1">CHOOSE YOUR PLAN</h2>
      <div class="divider centered"></div>
    </div>
    <div class="pricing-grid">
      <!-- Regular card -->
      <div class="pricing-card hover-glow" data-aos="fade-up">
        <span class="plan-badge t-label">Basic</span>
        <h3 class="plan-name t-h2">STARTER</h3>
        <div class="plan-price"><span class="t-stat accent">₹999</span><span class="plan-period">/month</span></div>
        <ul class="plan-features">
          <li><i class="fa-solid fa-check accent"></i> Feature one</li>
          <li><i class="fa-solid fa-check accent"></i> Feature two</li>
          <li><i class="fa-solid fa-times" style="color:var(--text-3)"></i> Feature three</li>
        </ul>
        <a href="#contact" class="btn btn-outline btn-full">Get Started</a>
      </div>

      <!-- Featured card -->
      <div class="pricing-card pricing-featured hover-glow" data-aos="fade-up" data-aos-delay="100">
        <span class="plan-ribbon">BEST VALUE</span>
        <span class="plan-badge t-label">Pro</span>
        <h3 class="plan-name t-h2">PROFESSIONAL</h3>
        <div class="plan-price"><span class="t-stat accent">₹2,499</span><span class="plan-period">/month</span></div>
        <ul class="plan-features">
          <li><i class="fa-solid fa-check accent"></i> Everything in Starter</li>
          <li><i class="fa-solid fa-check accent"></i> Pro feature one</li>
          <li><i class="fa-solid fa-check accent"></i> Pro feature two</li>
        </ul>
        <a href="#contact" class="btn btn-primary btn-full hover-pulse">Get Started</a>
      </div>

      <!-- Third card -->
      <div class="pricing-card hover-glow" data-aos="fade-up" data-aos-delay="200">
        <!-- ... -->
      </div>
    </div>
  </div>
</section>
```

```css
.pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; align-items: center; }
.pricing-card { background: var(--bg-card); border: 1px solid var(--border-2); padding: 2.5rem 2rem; position: relative; }
.pricing-featured { border-color: var(--accent); transform: scaleY(1.03); box-shadow: var(--glow); }
.plan-ribbon {
  position: absolute; top: -1px; right: 1.5rem;
  background: var(--accent); color: #fff; padding: 0.3em 0.8em;
  font-family: var(--display2); font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
}
.plan-badge  { color: var(--accent); display: block; margin-bottom: 0.5rem; }
.plan-name   { margin-bottom: 1.5rem; }
.plan-price  { display: flex; align-items: baseline; gap: 0.3rem; margin-bottom: 2rem; }
.plan-period { color: var(--text-2); font-size: 0.9rem; }
.plan-features { margin-bottom: 2rem; display: flex; flex-direction: column; gap: 0.75rem; }
.plan-features li { display: flex; align-items: center; gap: 0.6rem; font-size: 0.9rem; }
@media (max-width: 900px) { .pricing-grid { grid-template-columns: 1fr; max-width: 400px; margin: 0 auto; } .pricing-featured { transform: none; } }
```

---

### 11.11 Gallery with LightGallery

```html
<section class="section-pad" id="gallery">
  <div class="container">
    <div class="section-header" data-aos="fade-up">
      <span class="section-label">Gallery</span>
      <h2 class="t-h1">OUR WORK</h2>
      <div class="divider"></div>
    </div>
    <div class="gallery-grid" id="lightgallery">
      <a href="UNSPLASH_LARGE_URL" class="gallery-item hover-overlay animate-card">
        <img src="UNSPLASH_THUMB_URL" alt="Gallery 1" loading="lazy">
        <div class="overlay">
          <i class="fa-solid fa-magnifying-glass-plus"></i>
          <span class="t-label">View</span>
        </div>
      </a>
      <!-- Repeat × 6 min -->
    </div>
  </div>
</section>
```

```css
.gallery-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }
.gallery-item { position: relative; aspect-ratio: 1; overflow: hidden; display: block; }
.gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.7s var(--ease), filter 0.7s var(--ease); filter: brightness(.75); }
.gallery-item .overlay {
  position: absolute; inset: 0; background: rgba(var(--accent-rgb), 0.7);
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem;
  color: #fff; font-size: 1.5rem; opacity: 0; transition: opacity 0.4s var(--ease);
}
.gallery-item:hover img { transform: scale(1.06); filter: brightness(.55); }
.gallery-item:hover .overlay { opacity: 1; }
@media (max-width: 640px) { .gallery-grid { grid-template-columns: repeat(2, 1fr); } }
```

```javascript
lightGallery(document.getElementById('lightgallery'), {
  plugins: [lgZoom, lgThumbnail],
  speed: 500,
  thumbnail: true,
});
```

---

### 11.12 FAQ Accordion

```html
<section class="section-pad" id="faq">
  <div class="container">
    <div class="section-header centered" data-aos="fade-up">
      <span class="section-label">FAQ</span>
      <h2 class="t-h1">COMMON QUESTIONS</h2>
      <div class="divider centered"></div>
    </div>
    <div class="faq-list">
      <div class="faq-item" data-aos="fade-up">
        <button class="faq-q" onclick="toggleFaq(this)">
          <span>Question goes here?</span>
          <i class="fa-solid fa-plus faq-icon"></i>
        </button>
        <div class="faq-a">
          <p>Answer goes here. Be clear, direct, and helpful. Customers appreciate thorough answers.</p>
        </div>
      </div>
    </div>
  </div>
</section>
```

```css
.faq-list { max-width: 800px; margin: 0 auto; }
.faq-item { border-bottom: 1px solid var(--border-2); }
.faq-q {
  width: 100%; display: flex; justify-content: space-between; align-items: center;
  padding: 1.4rem 0; font-family: var(--display2); font-size: 1rem;
  font-weight: 600; letter-spacing: 0.04em; text-align: left; gap: 1rem;
  color: var(--text); transition: color 0.3s;
}
.faq-q:hover { color: var(--accent); }
.faq-icon { color: var(--accent); flex-shrink: 0; transition: transform 0.4s var(--ease); }
.faq-item.open .faq-icon { transform: rotate(45deg); }
.faq-a {
  max-height: 0; overflow: hidden;
  transition: max-height 0.45s var(--ease), padding 0.3s;
}
.faq-a p { color: var(--text-2); padding-bottom: 1.5rem; line-height: 1.75; }
.faq-item.open .faq-a { max-height: 400px; }
```

```javascript
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}
```

---

### 11.13 Contact Section

```html
<section class="section-pad" id="contact">
  <div class="container">
    <div class="contact-grid">
      <!-- Info side -->
      <div>
        <span class="section-label">Contact</span>
        <h2 class="t-h1" data-aos="fade-up">GET IN TOUCH</h2>
        <div class="divider"></div>
        <p class="contact-desc">Subtext inviting the visitor to reach out.</p>
        <div class="contact-cards">
          <div class="contact-card" data-aos="fade-up">
            <i class="fa-solid fa-location-dot"></i>
            <div><strong>Address</strong><span>123 Business Street, City</span></div>
          </div>
          <div class="contact-card" data-aos="fade-up" data-aos-delay="100">
            <i class="fa-solid fa-phone"></i>
            <div><strong>Phone</strong><span>+91 98765 43210</span></div>
          </div>
          <div class="contact-card" data-aos="fade-up" data-aos-delay="150">
            <i class="fa-solid fa-envelope"></i>
            <div><strong>Email</strong><span>hello@brand.com</span></div>
          </div>
          <div class="contact-card" data-aos="fade-up" data-aos-delay="200">
            <i class="fa-solid fa-clock"></i>
            <div><strong>Hours</strong><span>Mon–Sat: 9 AM – 7 PM</span></div>
          </div>
        </div>
      </div>
      <!-- Form side -->
      <div data-aos="fade-left">
        <form class="contact-form" onsubmit="handleContactForm(event)">
          <div class="form-row">
            <div class="form-group">
              <label class="t-label">Full Name</label>
              <input type="text" placeholder="Your Name" required>
            </div>
            <div class="form-group">
              <label class="t-label">Phone</label>
              <input type="tel" placeholder="+91 00000 00000">
            </div>
          </div>
          <div class="form-group">
            <label class="t-label">Email</label>
            <input type="email" placeholder="you@email.com" required>
          </div>
          <div class="form-group">
            <label class="t-label">Message</label>
            <textarea rows="5" placeholder="Tell us what you need..." required></textarea>
          </div>
          <button type="submit" class="btn btn-primary btn-full btn-lg">
            Send Message <i class="fa-solid fa-paper-plane arrow-icon"></i>
          </button>
        </form>
      </div>
    </div>
  </div>
</section>
```

```css
.contact-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: clamp(2rem, 5vw, 5rem); align-items: start; }
.contact-desc { color: var(--text-2); margin-bottom: 2rem; }
.contact-cards { display: flex; flex-direction: column; gap: 1rem; }
.contact-card { display: flex; align-items: flex-start; gap: 1rem; padding: 1rem 1.25rem; border: 1px solid var(--border-3); transition: border-color 0.3s; }
.contact-card:hover { border-color: var(--border); }
.contact-card i { color: var(--accent); font-size: 1rem; margin-top: 0.2rem; flex-shrink: 0; }
.contact-card div { display: flex; flex-direction: column; gap: 0.2rem; }
.contact-card strong { font-family: var(--display2); font-size: 0.8rem; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 700; }
.contact-card span { color: var(--text-2); font-size: 0.9rem; }

.contact-form { display: flex; flex-direction: column; gap: 1.25rem; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
.form-group label { color: var(--text-2); }
.form-group input, .form-group textarea {
  padding: 0.85rem 1rem; border-radius: 1px;
  background: var(--bg-3); border: 1px solid var(--border-2);
  color: var(--text); font-size: 0.9rem; resize: vertical;
}
.form-group input:focus, .form-group textarea:focus { border-color: var(--accent); }
@media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr; } .form-row { grid-template-columns: 1fr; } }
```

```javascript
function handleContactForm(e) {
  e.preventDefault();
  showToast('Message sent! We\'ll be in touch.', 'fa-circle-check');
  e.target.reset();
}
```

---

### 11.14 Footer

```html
<footer id="footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="#" class="footer-logo">BRAND</a>
        <p class="footer-desc">One or two sentences about the brand.</p>
        <div class="footer-socials">
          <a href="#" class="social-btn hover-pop" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
          <a href="#" class="social-btn hover-pop" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
          <a href="#" class="social-btn hover-pop" aria-label="Twitter/X"><i class="fa-brands fa-x-twitter"></i></a>
          <a href="#" class="social-btn hover-pop" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
        </div>
      </div>
      <div class="footer-col">
        <h4 class="footer-col-title t-label">Quick Links</h4>
        <ul><li><a href="#" class="hover-underline">About</a></li><!-- ... --></ul>
      </div>
      <div class="footer-col">
        <h4 class="footer-col-title t-label">Products</h4>
        <ul><li><a href="#" class="hover-underline">Product 1</a></li><!-- ... --></ul>
      </div>
      <div class="footer-col">
        <h4 class="footer-col-title t-label">Contact</h4>
        <ul>
          <li><i class="fa-solid fa-location-dot"></i> City, State, Country</li>
          <li><i class="fa-solid fa-phone"></i> +91 XXXXX XXXXX</li>
          <li><i class="fa-solid fa-envelope"></i> hello@brand.com</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; <span id="year"></span> BRAND. All rights reserved.</p>
      <p>Built with precision.</p>
    </div>
  </div>
</footer>
```

```css
#footer { border-top: 1px solid var(--border-2); padding: clamp(3.5rem, 7vw, 6rem) 0 2rem; }
.footer-grid { display: grid; grid-template-columns: 1.6fr 1fr 1fr 1fr; gap: 2.5rem; margin-bottom: 3.5rem; }
.footer-logo { font-family: var(--display); font-size: 2rem; display: block; margin-bottom: 1rem; }
.footer-desc { color: var(--text-2); font-size: 0.9rem; line-height: 1.7; margin-bottom: 1.5rem; }
.footer-socials { display: flex; gap: 0.75rem; }
.social-btn { width: 38px; height: 38px; border: 1px solid var(--border-2); border-radius: 2px; display: flex; align-items: center; justify-content: center; color: var(--text-2); font-size: 0.85rem; transition: all 0.3s; }
.social-btn:hover { border-color: var(--accent); color: var(--accent); }
.footer-col-title { color: var(--text-2); margin-bottom: 1.25rem; display: block; }
.footer-col ul { display: flex; flex-direction: column; gap: 0.6rem; }
.footer-col li, .footer-col a { color: var(--text-2); font-size: 0.9rem; display: flex; align-items: center; gap: 0.5rem; transition: color 0.3s; }
.footer-col a:hover { color: var(--text); }
.footer-col i { color: var(--accent); font-size: 0.8rem; flex-shrink: 0; }
.footer-bottom { border-top: 1px solid var(--border-3); padding-top: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; }
.footer-bottom p { color: var(--text-3); font-size: 0.8rem; }
@media (max-width: 900px) { .footer-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 560px) { .footer-grid { grid-template-columns: 1fr; } .footer-bottom { flex-direction: column; text-align: center; } }
```

```javascript
document.getElementById('year').textContent = new Date().getFullYear();
```

---

## ═══════════════════════════════════════════════
## CHAPTER 12 — CART SYSTEM (Full E-Commerce)
## ═══════════════════════════════════════════════

### 12.1 Product Data Structure

```javascript
const PRODUCTS = [
  { id: 1, name: 'Product Name', cat: 'Category', price: 9999, old: 12999,
    badge: 'BESTSELLER', r: 4.8, rv: 142,
    img: 'https://images.unsplash.com/photo-ID?w=400&h=400&fit=crop&q=75' },
  // Add more products...
];
```

### 12.2 Cart State & Functions

```javascript
let cart = [];

function addToCart(id, qty = 1) {
  const existing = cart.find(i => i.id === id);
  if (existing) { existing.qty += qty; }
  else {
    const p = PRODUCTS.find(p => p.id === id);
    if (p) cart.push({ ...p, qty });
  }
  updateCart();
  openCart();
  showToast(`${PRODUCTS.find(p => p.id === id)?.name} added!`, 'fa-bag-shopping');
}

function removeFromCart(id) { cart = cart.filter(i => i.id !== id); updateCart(); }

function qtyChange(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else updateCart();
}

function updateCart() {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const badge = document.getElementById('cartBadge');
  if (badge) { badge.textContent = count; badge.style.display = count ? 'flex' : 'none'; }
  const body = document.getElementById('cartBody');
  const footer = document.getElementById('cartFooter');
  const totalEl = document.getElementById('cartTotal');
  if (!body) return;

  if (cart.length === 0) {
    body.innerHTML = `<div class="cart-empty"><i class="fa-solid fa-bag-shopping"></i><p>Your cart is empty</p></div>`;
    if (footer) footer.style.display = 'none';
    return;
  }
  if (footer) footer.style.display = 'block';
  if (totalEl) totalEl.textContent = '₹' + total.toLocaleString('en-IN');

  body.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.img}" alt="${item.name}" width="72" height="72" loading="lazy">
      <div class="cart-item-info">
        <span class="t-label" style="color:var(--accent)">${item.cat}</span>
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-price">₹${(item.price * item.qty).toLocaleString('en-IN')}</p>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" onclick="qtyChange(${item.id}, -1)" aria-label="Decrease">−</button>
        <span class="qty-val">${item.qty}</span>
        <button class="qty-btn" onclick="qtyChange(${item.id}, +1)" aria-label="Increase">+</button>
        <button class="remove-btn" onclick="removeFromCart(${item.id})" aria-label="Remove">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    </div>
  `).join('');
}

function openCart()  { document.getElementById('cartPanel').classList.add('open'); document.getElementById('cartOverlay').classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeCart() { document.getElementById('cartPanel').classList.remove('open'); document.getElementById('cartOverlay').classList.remove('open'); document.body.style.overflow = ''; }
function checkout()  { cart = []; updateCart(); closeCart(); showToast('Order placed! Thank you! 🎉', 'fa-check'); }
```

### 12.3 Cart HTML

```html
<div class="cart-overlay" id="cartOverlay" onclick="closeCart()"></div>
<div class="cart-panel" id="cartPanel">
  <div class="cart-header">
    <h3 class="t-h3">YOUR CART</h3>
    <button class="cart-close hover-pop" onclick="closeCart()" aria-label="Close cart">
      <i class="fa-solid fa-xmark"></i>
    </button>
  </div>
  <div class="cart-body" id="cartBody">
    <div class="cart-empty"><i class="fa-solid fa-bag-shopping"></i><p>Your cart is empty</p></div>
  </div>
  <div class="cart-footer" id="cartFooter" style="display:none">
    <div class="cart-total-row">
      <span class="t-label">TOTAL</span>
      <span class="cart-total t-stat accent" id="cartTotal">₹0</span>
    </div>
    <button class="btn btn-primary btn-full btn-lg" onclick="checkout()">Checkout <i class="fa-solid fa-arrow-right"></i></button>
    <button class="btn btn-ghost btn-full" onclick="closeCart()">Continue Shopping</button>
  </div>
</div>
```

```css
.cart-overlay {
  position: fixed; inset: 0; z-index: 19998;
  background: rgba(0,0,0,.7); backdrop-filter: blur(6px);
  opacity: 0; pointer-events: none; transition: opacity 0.4s;
}
.cart-overlay.open { opacity: 1; pointer-events: auto; }
.cart-panel {
  position: fixed; top: 0; right: 0; bottom: 0; z-index: 19999;
  width: min(420px, 100vw); background: var(--bg-2);
  border-left: 1px solid var(--border-2);
  transform: translateX(100%); transition: transform 0.45s var(--ease-fast);
  display: flex; flex-direction: column;
}
.cart-panel.open { transform: translateX(0); }
.cart-header { padding: 1.5rem; border-bottom: 1px solid var(--border-2); display: flex; justify-content: space-between; align-items: center; }
.cart-close { font-size: 1.2rem; color: var(--text-2); }
.cart-body { flex: 1; overflow-y: auto; padding: 1rem; display: flex; flex-direction: column; gap: 0.75rem; }
.cart-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; color: var(--text-3); font-size: 2.5rem; }
.cart-empty p { font-size: 0.9rem; font-family: var(--display2); letter-spacing: 0.08em; }
.cart-item { display: flex; gap: 1rem; padding: 0.75rem; border: 1px solid var(--border-3); align-items: center; }
.cart-item img { width: 72px; height: 72px; object-fit: cover; flex-shrink: 0; }
.cart-item-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 0.2rem; }
.cart-item-name { font-size: 0.875rem; font-weight: 600; }
.cart-item-price { color: var(--accent); font-family: var(--mono); font-size: 0.9rem; }
.cart-item-controls { display: flex; align-items: center; gap: 0.4rem; flex-direction: column; }
.qty-btn { width: 26px; height: 26px; border: 1px solid var(--border-2); display: flex; align-items: center; justify-content: center; font-size: 1rem; color: var(--text); background: var(--bg-3); transition: all 0.2s; }
.qty-btn:hover { border-color: var(--accent); color: var(--accent); }
.qty-val { font-family: var(--mono); font-size: 0.875rem; font-weight: 600; }
.remove-btn { color: var(--text-3); font-size: 0.8rem; margin-top: 0.25rem; transition: color 0.2s; }
.remove-btn:hover { color: var(--red); }
.cart-footer { padding: 1.25rem; border-top: 1px solid var(--border-2); display: flex; flex-direction: column; gap: 0.75rem; }
.cart-total-row { display: flex; justify-content: space-between; align-items: center; }
.cart-total { font-size: 1.8rem; }
```

---

## ═══════════════════════════════════════════════
## CHAPTER 13 — TOAST NOTIFICATION SYSTEM
## ═══════════════════════════════════════════════

```html
<div class="toast-container" id="toastContainer"></div>
```

```css
.toast-container { position: fixed; bottom: 1.5rem; left: 50%; transform: translateX(-50%); z-index: 99999; display: flex; flex-direction: column; gap: 0.5rem; align-items: center; pointer-events: none; }
.toast {
  background: var(--bg-elevated); border: 1px solid var(--border-2); border-left: 3px solid var(--accent);
  color: var(--text); padding: 0.8rem 1.4rem; display: flex; align-items: center; gap: 0.75rem;
  font-size: 0.875rem; font-family: var(--display2); letter-spacing: 0.04em;
  box-shadow: var(--shadow-md); min-width: 280px; pointer-events: auto;
  animation: toastIn 0.35s var(--ease-spring) both;
}
.toast i { color: var(--accent); }
@keyframes toastIn { from { opacity: 0; transform: translateY(20px) scale(.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
```

```javascript
function showToast(msg, icon = 'fa-circle-check') {
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<i class="fa-solid ${icon}"></i><span>${msg}</span>`;
  document.getElementById('toastContainer').appendChild(el);
  setTimeout(() => { el.style.transition = 'opacity 0.3s, transform 0.3s'; el.style.opacity = '0'; el.style.transform = 'translateY(10px)'; setTimeout(() => el.remove(), 300); }, 3000);
}
```

---

## ═══════════════════════════════════════════════
## CHAPTER 14 — KEYBOARD & ACCESSIBILITY
## ═══════════════════════════════════════════════

```javascript
// Global keyboard controls
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (document.getElementById('cartPanel').classList.contains('open')) closeCart();
    else if (document.getElementById('mobMenu').classList.contains('open')) closeMobileMenu();
  }
});
```

```css
/* Focus styles */
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

/* Skip link */
.skip-link {
  position: absolute; left: -9999px; top: 1rem; z-index: 99999;
  background: var(--accent); color: #fff; padding: 0.5rem 1rem;
  font-family: var(--display2); font-size: 0.875rem;
}
.skip-link:focus { left: 1rem; }
```

**Accessibility Checklist:**
- All `<img>` elements have descriptive `alt=""` attributes
- All `<button>` elements have `aria-label` when icon-only
- All form `<input>` elements have associated `<label>` elements
- Heading hierarchy: only one `<h1>`, logical `<h2>` → `<h3>` flow
- Color contrast: minimum 4.5:1 for body text, 3:1 for large headings
- All interactive elements reachable via keyboard Tab
- Touch targets minimum 44×44px on mobile

---

## ═══════════════════════════════════════════════
## CHAPTER 15 — INDUSTRY COLOR PALETTES
## ═══════════════════════════════════════════════

**Replace `--accent`, `--accent-l`, `--accent-d`, `--accent-rgb` per industry:**

```
GYM / FITNESS / SPORTS
  --accent: #e63946;  --accent-l: #ff6b6b;  --accent-d: #c1121f;  --accent-rgb: 230,57,70;

LUXURY / FASHION / JEWELLERY
  --accent: #c9a84c;  --accent-l: #e8c96d;  --accent-d: #a88a3a;  --accent-rgb: 201,168,76;
  --text: #f0ebe3;  --bg: #080705;

TECH / SAAS / SOFTWARE
  --accent: #3b82f6;  --accent-l: #60a5fa;  --accent-d: #2563eb;  --accent-rgb: 59,130,246;

FOOD / RESTAURANT / CAFÉ
  --accent: #f97316;  --accent-l: #fb923c;  --accent-d: #ea580c;  --accent-rgb: 249,115,22;

FINANCE / INVESTMENT / CORPORATE
  --accent: #10b981;  --accent-l: #34d399;  --accent-d: #059669;  --accent-rgb: 16,185,129;

BEAUTY / SPA / WELLNESS
  --accent: #ec4899;  --accent-l: #f472b6;  --accent-d: #be185d;  --accent-rgb: 236,72,153;

REAL ESTATE / PROPERTY
  --accent: #d4a853;  --accent-l: #e8c97a;  --accent-d: #b8863a;  --accent-rgb: 212,168,83;
  --bg: #060604;

MEDICAL / HEALTHCARE / PHARMA
  --accent: #0891b2;  --accent-l: #22d3ee;  --accent-d: #0e7490;  --accent-rgb: 8,145,178;

EDUCATION / E-LEARNING
  --accent: #7c3aed;  --accent-l: #a78bfa;  --accent-d: #5b21b6;  --accent-rgb: 124,58,237;

ENERGY / SOLAR / INDUSTRIAL
  --accent: #f59e0b;  --accent-l: #fbbf24;  --accent-d: #d97706;  --accent-rgb: 245,158,11;
  --bg: #030303;  --bg-2: #070707;

GAMING / ENTERTAINMENT
  --accent: #a855f7;  --accent-l: #c084fc;  --accent-d: #7c3aed;  --accent-rgb: 168,85,247;

AUTOMOTIVE / EV
  --accent: #e63946;  --accent-l: #ff6b6b;  --accent-d: #c1121f;  --accent-rgb: 230,57,70;
  --gold: #f59e0b;
```

---

## ═══════════════════════════════════════════════
## CHAPTER 16 — COMPLETE HTML DOCUMENT STRUCTURE
## ═══════════════════════════════════════════════

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="BUSINESS DESCRIPTION — 150 chars max">
  <meta name="theme-color" content="#050505">
  <meta property="og:title" content="BRAND — TAGLINE">
  <meta property="og:description" content="DESCRIPTION">
  <title>BRAND — TAGLINE</title>

  <!-- Preconnect -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

  <!-- Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:ital,opsz,wght@0,14..32,200..800&family=Playfair+Display:ital,wght@0,400..800;1,400..600&family=JetBrains+Mono:wght@400;500;600&family=Rajdhani:wght@400;500;600;700&display=swap" rel="stylesheet">

  <!-- CSS CDNs -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">
  <link rel="stylesheet" href="https://unpkg.com/aos@2.3.1/dist/aos.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lightgallery@2.7.2/css/lightgallery-bundle.min.css">

  <style>
    /* ══════════════════════════════════
       ALL CSS GOES HERE (Chapters 3–11)
       Order:
       1. :root variables
       2. Global reset
       3. Typography
       4. Buttons
       5. Hover effects
       6. Loader
       7. Cursor + scroll bar
       8. Navbar + mobile menu
       9. Hero
       10. Marquee
       11. All sections
       12. Cart panel
       13. Toast
       14. Responsive media queries
    ══════════════════════════════════ */
  </style>
</head>
<body>

  <!-- Skip link (accessibility) -->
  <a href="#main" class="skip-link">Skip to content</a>

  <!-- Loader -->
  <div id="loader"> <!-- Chapter 10 HTML --> </div>

  <!-- Custom Cursor (desktop) -->
  <div id="cur"></div>
  <div id="cur-f"></div>

  <!-- Scroll Progress Bar -->
  <div id="scroll-prog"></div>

  <!-- Back to Top -->
  <button id="backTop" aria-label="Back to top"><i class="fa-solid fa-arrow-up"></i></button>

  <!-- Mobile Menu -->
  <nav class="mob-menu" id="mobMenu"> <!-- Chapter 11.5 --> </nav>
  <div class="mob-overlay" id="mobOverlay" onclick="closeMobileMenu()"></div>

  <!-- Navbar -->
  <header id="nav"> <!-- Chapter 11.4 --> </header>

  <!-- ════ MAIN CONTENT ════ -->
  <main id="main">

    <!-- Hero -->
    <section id="hero"> <!-- Chapter 11.6 --> </section>

    <!-- Marquee Band -->
    <div class="marquee-band" aria-hidden="true"> <!-- Chapter 11.7 --> </div>

    <!-- Stats -->
    <section id="stats" class="section-pad"> <!-- Chapter 11.8 --> </section>

    <!-- Trust / Benefits -->
    <section id="trust" class="section-pad"> <!-- 4 cards --> </section>

    <!-- Products / Services -->
    <section id="products" class="section-pad"> <!-- Chapter 11.9 --> </section>

    <!-- Pricing -->
    <section id="pricing" class="section-pad"> <!-- Chapter 11.10 --> </section>

    <!-- Gallery -->
    <section id="gallery" class="section-pad"> <!-- Chapter 11.11 --> </section>

    <!-- Testimonials / Reviews -->
    <section id="testimonials" class="section-pad">
      <!-- Swiper slider with review cards -->
    </section>

    <!-- Team / About -->
    <section id="team" class="section-pad">
      <!-- 4-col grid, portrait cards -->
    </section>

    <!-- FAQ -->
    <section id="faq" class="section-pad"> <!-- Chapter 11.12 --> </section>

    <!-- CTA Banner -->
    <section id="cta" class="section-pad">
      <div class="container" style="text-align:center">
        <span class="section-label">Ready?</span>
        <h2 class="t-h1">YOUR CTA HEADLINE</h2>
        <div class="divider centered"></div>
        <p style="color:var(--text-2);max-width:480px;margin:0 auto 2rem">Supporting text for the CTA.</p>
        <a href="#contact" class="btn btn-gold btn-lg">Get Started Today <i class="fa-solid fa-arrow-right"></i></a>
      </div>
    </section>

    <!-- Contact -->
    <section id="contact" class="section-pad"> <!-- Chapter 11.13 --> </section>

  </main>
  <!-- ════ END MAIN ════ -->

  <!-- Footer -->
  <footer id="footer"> <!-- Chapter 11.14 --> </footer>

  <!-- Cart Sidebar -->
  <div class="cart-overlay" id="cartOverlay" onclick="closeCart()"></div>
  <div class="cart-panel" id="cartPanel"> <!-- Chapter 12.3 --> </div>

  <!-- Toast -->
  <div class="toast-container" id="toastContainer"></div>

  <!-- ════ JS CDNs ════ -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/TextPlugin.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
  <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/splitting@1.0.6/dist/splitting.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/lightgallery@2.7.2/lightgallery.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/lightgallery@2.7.2/plugins/zoom/lg-zoom.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/lightgallery@2.7.2/plugins/thumbnail/lg-thumbnail.min.js"></script>

  <script>
    /* ══════════════════════════════════
       ALL JAVASCRIPT GOES HERE
       Order:
       1. Product data array
       2. Cart state + functions
       3. Toast function
       4. GSAP register + heroIn()
       5. Lenis init
       6. AOS init
       7. Splitting init
       8. Swiper init (hero + others)
       9. LightGallery init
       10. ScrollTrigger animations
       11. Counter animations
       12. Navbar + backTop scroll events
       13. Mobile menu functions
       14. Keyboard event listener
       15. Page loader
       16. Misc (year, FAQ, form handlers)
    ══════════════════════════════════ */
  </script>
</body>
</html>
```

---

## ═══════════════════════════════════════════════
## CHAPTER 17 — BONUS: TESTIMONIALS SWIPER
## ═══════════════════════════════════════════════

```html
<section class="section-pad" id="testimonials">
  <div class="container">
    <div class="section-header centered" data-aos="fade-up">
      <span class="section-label">Reviews</span>
      <h2 class="t-h1">WHAT CLIENTS SAY</h2>
      <div class="divider centered"></div>
    </div>
    <div class="testimonials-swiper swiper">
      <div class="swiper-wrapper">
        <div class="swiper-slide">
          <div class="testimonial-card hover-glow">
            <div class="testi-stars">
              <i class="fa-solid fa-star gold"></i><i class="fa-solid fa-star gold"></i>
              <i class="fa-solid fa-star gold"></i><i class="fa-solid fa-star gold"></i>
              <i class="fa-solid fa-star gold"></i>
            </div>
            <p class="testi-text t-quote">"Testimonial quote here. Make it specific and credible."</p>
            <div class="testi-author">
              <img src="AVATAR_URL" alt="Client Name" class="testi-avatar">
              <div>
                <strong>Client Name</strong>
                <span class="t-label">Role / Location</span>
              </div>
            </div>
          </div>
        </div>
        <!-- More slides... -->
      </div>
      <div class="swiper-pagination testi-pagination"></div>
    </div>
  </div>
</section>
```

```css
.testimonials-swiper { padding-bottom: 3rem !important; }
.testimonial-card { background: var(--bg-card); border: 1px solid var(--border-2); padding: 2.5rem; height: 100%; display: flex; flex-direction: column; gap: 1.5rem; }
.testi-stars { display: flex; gap: 0.2rem; font-size: 0.85rem; }
.testi-text  { flex: 1; line-height: 1.8; color: var(--text); }
.testi-author { display: flex; align-items: center; gap: 1rem; }
.testi-avatar { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border); }
.testi-author strong { display: block; font-size: 0.9rem; font-weight: 700; }
.testi-author span { color: var(--accent); margin-top: 0.1rem; }
.testi-pagination { bottom: 0 !important; }
.testi-pagination .swiper-pagination-bullet-active { background: var(--accent) !important; }
```

```javascript
new Swiper('.testimonials-swiper', {
  slidesPerView: 1,
  spaceBetween: 24,
  loop: true,
  autoplay: { delay: 4500, disableOnInteraction: false },
  pagination: { el: '.testi-pagination', clickable: true },
  breakpoints: {
    640:  { slidesPerView: 1.5 },
    900:  { slidesPerView: 2 },
    1100: { slidesPerView: 3 },
  }
});
```

---

## ═══════════════════════════════════════════════
## CHAPTER 18 — QUICK START PROMPT TEMPLATES
## ═══════════════════════════════════════════════

After loading this file to an AI, use one of these prompts:

```
"Using EVERY spec in this SKILL file, build a complete single-file website for
[BUSINESS NAME], a [INDUSTRY] company based in [CITY]. The accent color should
be [COLOR/INDUSTRY PALETTE NAME]. Include the following sections: hero,
marquee, stats, [SECTION LIST], gallery, testimonials, FAQ, contact, footer.
Add a cart if it sells products. Make all content realistic for this business
type — NO Lorem Ipsum."
```

**Examples:**
- "Using EVERY spec in this SKILL file, build a complete single-file website for PREMEX POWER SYSTEMS, a LiFePO4 battery and inverter manufacturer based in India. Use the ENERGY / INDUSTRIAL palette. Include hero, marquee, stats, products (6 battery models), benefits, gallery, testimonials, dealer enquiry form, FAQ, contact. Add a cart. Make all content realistic."

- "Using EVERY spec in this SKILL file, build for IRON PARADISE GYM — fitness. Use GYM palette. Hero + marquee + stats + programs + pricing + trainers + gallery + testimonials + BMI calculator + FAQ + contact."

- "Using EVERY spec in this SKILL file, build for VELOUR — luxury fashion store. Use LUXURY palette. Hero + marquee + collections (6) + lookbook gallery + pricing + testimonials + FAQ + contact."

---

## ═══════════════════════════════════════════════
## CHAPTER 19 — PERFORMANCE CHECKLIST
## ═══════════════════════════════════════════════

Before finalizing any output, verify:

- [ ] All images use `loading="lazy"` except the hero's first slide
- [ ] Hero image URL uses `?w=1920&h=1080` (not larger)
- [ ] No render-blocking resources (all CSS in `<head>`, all JS before `</body>`)
- [ ] `will-change: transform` added only to animated elements (hero img, cursor)
- [ ] Scroll event listeners use `{ passive: true }`
- [ ] AOS disabled on screens narrower than 480px
- [ ] GSAP `once: true` on all ScrollTrigger batch animations
- [ ] Lenis wrapped in try/catch
- [ ] All third-party scripts load from reliable CDNs (not broken URLs)
- [ ] No `console.error` or uncaught exceptions on load

---

*SKILL v3.0 — Mobile-First Premium Website Blueprint*
*Covers: Loader → Cursor → Nav → Hero → Marquee → Stats → Cards → Pricing → Gallery → Testimonials → FAQ → Contact → Footer → Cart → Toast → Keyboard → Accessibility → Responsive*

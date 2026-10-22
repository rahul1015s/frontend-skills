---
name: html-motion-system
description: Motion rules and copy-paste code for CDN-only HTML sites — easing and duration tokens, the "should it animate" gate, CSS transitions, GSAP + ScrollTrigger reveals, Lenis smooth scroll, magnetic buttons, marquees, loaders, stagger, reduced motion and performance. Use for any animation, scroll effect, hover motion or page transition in a plain HTML page.
---

# HTML Motion System

Motion is craft, not decoration. The order of decisions matters more than the effect: **gate → purpose → tool → properties → curve and duration → interruption → reduced motion.** (Principles from Emil Kowalski's animation work and animations.dev; the installed `animate` skill is the stricter reference for components.)

## 1. Gate: should it animate?

| How often the user sees it | Decision |
| --- | --- |
| Constantly (nav hover, list hover) | Barely perceptible or nothing |
| Occasionally (menu, modal, toast) | Short, standard motion |
| Once per visit (hero entrance, loader, section reveal) | The delight budget lives here |

Name the purpose in one word: **feedback, spatial consistency, state change, preventing a jarring jump, explanation, delight.** Cannot name it? Do not animate it. Never move text the visitor is trying to read.

## 2. Tokens (paste into `:root`)

```css
:root{
  --ease-out:    cubic-bezier(.23, 1, .32, 1);      /* default: entrances, hovers, reveals */
  --ease-in-out: cubic-bezier(.77, 0, .175, 1);     /* things moving across the screen */
  --ease-drawer: cubic-bezier(.32, .72, 0, 1);      /* menus, sheets, drawers */
  --ease-spring: cubic-bezier(.34, 1.56, .64, 1);   /* playful pop, use sparingly */
  --t-press: 120ms;  --t-hover: 180ms;  --t-pop: 220ms;  --t-panel: 380ms;  --t-reveal: 800ms;
}
```

- Never `ease-in` on UI (it delays the moment the user is watching).
- UI feedback stays under 300ms. Marketing reveals and heroes may run 600–1200ms.
- Need another curve? Take it from easing.dev or easings.co; do not hand-roll one.
- Constant motion (marquee, progress) is `linear`.

## 3. Pick the cheapest tool

| Need | Tool |
| --- | --- |
| Hover, press, colour, toggled class | CSS `transition` |
| Predetermined looping motion (marquee, float, shimmer) | CSS `@keyframes` (runs off the main thread) |
| Scroll-triggered reveals, scrubbed motion, sequences | GSAP + ScrollTrigger |
| Smooth wheel scrolling | Lenis (optional; skip on content-heavy pages) |
| Programmatic, no library | `element.animate()` (WAAPI) |

## 4. Properties

Animate **`transform` and `opacity` only** (plus `clip-path`, `filter: blur` in small doses). Never `width`, `height`, `top`, `left`, `margin`, `padding`. Never `transition: all`; name properties. Never start from `scale(0)`; start from `scale(.94)` + `opacity:0`. Percent values in `translate` are relative to the element's own size.

## 5. Reduced motion and pointer gating (ship with every animation)

```css
@media (hover:hover) and (pointer:fine){ .card:hover{ transform:translateY(-4px) } }
@media (prefers-reduced-motion:reduce){
  *,*::before,*::after{ animation-duration:.01ms !important; animation-iteration-count:1 !important;
    transition-duration:.01ms !important; scroll-behavior:auto !important }
}
```

```js
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
```

Reduced motion means fewer and gentler, not zero: keep fades, drop travel and parallax.

## 6. Progressive enhancement rule

Content must be visible with JS off. Add the hidden start state from JS, never from CSS:

```js
document.documentElement.classList.add('js');           // first line of your script
```
```css
.js .reveal{ opacity:0; transform:translateY(24px) }    /* only exists when JS runs */
```

## 7. Core recipes

### GSAP boot

```js
gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: 'expo.out', duration: .9 });       // expo.out ≈ --ease-out
```

### Lenis + ScrollTrigger (correct wiring)

```js
let lenis;
if (window.Lenis && !reduce) {
  lenis = new Lenis({ lerp: .1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  const t = document.querySelector(a.getAttribute('href')); if (!t) return;
  e.preventDefault(); lenis ? lenis.scrollTo(t, { offset: -72 }) : t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
}));
```

### Batched scroll reveal with stagger (30–80ms)

```js
ScrollTrigger.batch('.reveal', {
  start: 'top 88%', once: true,
  onEnter: els => gsap.to(els, { opacity: 1, y: 0, stagger: .06, duration: .8, overwrite: true })
});
```

### Hero entrance timeline (one orchestrated sequence, not ten separate fades)

```js
gsap.timeline({ defaults:{ ease:'expo.out' } })
  .from('.hero-eyebrow', { y: 16, opacity: 0, duration: .6 })
  .from('.hero-title .char', { yPercent: 110, stagger: .02, duration: .9 }, '<.1')   // needs Splitting or manual spans
  .from('.hero-sub',  { y: 16, opacity: 0, duration: .7 }, '<.35')
  .from('.hero-cta > *', { y: 16, opacity: 0, stagger: .08, duration: .6 }, '<.15');
```

For per-letter reveals wrap each line in `overflow:hidden` and move the characters with `yPercent`. See `html-kinetic-type`.

### Scrubbed pinned scene (scroll-linked, the "Apple" effect)

```js
gsap.timeline({ scrollTrigger:{ trigger:'.story', start:'top top', end:'+=200%', scrub:.6, pin:true } })
  .to('.story-img', { scale: 1.15, ease:'none' }, 0)
  .to('.story-copy', { opacity: 1, y: 0, ease:'none' }, .2);
```

Use `ease:'none'` inside scrubbed timelines; the scroll supplies the easing.

### Parallax (desktop only)

```js
if (matchMedia('(min-width:769px)').matches && !reduce)
  gsap.utils.toArray('[data-speed]').forEach(el =>
    gsap.to(el, { yPercent: -parseFloat(el.dataset.speed) * 20, ease:'none',
      scrollTrigger:{ trigger: el, scrub: true, start:'top bottom', end:'bottom top' } }));
```

### Counter

```js
document.querySelectorAll('[data-count]').forEach(el => {
  const o = { v: 0 }, end = +el.dataset.count;
  gsap.to(o, { v: end, duration: 1.6, ease:'power2.out', scrollTrigger:{ trigger: el, start:'top 90%', once:true },
    onUpdate: () => el.textContent = Math.round(o.v).toLocaleString() });
});
```

Use `font-variant-numeric: tabular-nums` so digits do not jitter.

### Magnetic button (pointer devices only)

```js
if (matchMedia('(hover:hover) and (pointer:fine)').matches && !reduce)
  document.querySelectorAll('[data-magnetic]').forEach(btn => {
    const x = gsap.quickTo(btn, 'x', { duration:.5, ease:'power3.out' });
    const y = gsap.quickTo(btn, 'y', { duration:.5, ease:'power3.out' });
    btn.addEventListener('pointermove', e => { const r = btn.getBoundingClientRect();
      x((e.clientX - r.left - r.width/2) * .25); y((e.clientY - r.top - r.height/2) * .25); });
    btn.addEventListener('pointerleave', () => { x(0); y(0); });
  });
```

### Marquee (pure CSS)

```html
<div class="marquee"><div class="marquee-track"><span>ITEM</span><span>ITEM</span><!-- repeat; duplicate the whole set once --></div></div>
```
```css
.marquee{overflow:hidden}
.marquee-track{display:flex;gap:3rem;width:max-content;animation:marq 30s linear infinite}
.marquee:hover .marquee-track{animation-play-state:paused}
@keyframes marq{to{transform:translateX(-50%)}}
```

### Page loader (short; never block content longer than ~1.2s)

Prefer a 0.8–1.2s wipe over a fake percent counter. Remove the loader node after it finishes, and skip it entirely on repeat visits (`sessionStorage`).

```js
const seen = sessionStorage.getItem('seen');
if (seen || reduce) document.querySelector('#loader')?.remove();
else gsap.timeline({ onComplete(){ document.querySelector('#loader').remove(); sessionStorage.setItem('seen','1'); heroIn(); } })
  .to('#loader .mark', { opacity:1, duration:.4 })
  .to('#loader', { yPercent:-100, duration:.9, ease:'expo.inOut' }, '+=.2');
```

### Custom cursor (optional, desktop only)

Use `gsap.quickTo` on a 10px dot plus a 36px ring; enlarge the ring on `a, button`. Hide it under `@media (pointer:coarse)`. Do not hide the real cursor on text inputs.

## 8. Performance rules

- `will-change: transform` only on elements that actively animate; remove after.
- Kill or skip ScrollTriggers on mobile for heavy scenes; use `matchMedia` (`gsap.matchMedia()`).
- Never read layout (`getBoundingClientRect`) inside a scroll handler without caching; prefer ScrollTrigger/IntersectionObserver.
- Pause offscreen loops (`IntersectionObserver` → `animation-play-state` or `gsap.ticker`).
- Call `ScrollTrigger.refresh()` after fonts and images load (`document.fonts.ready`, `window.load`).
- Test at 4× CPU throttle in DevTools; if it stutters, remove an effect rather than tune it.

## Never ship

`transition: all` · `ease-in` on UI · `scale(0)` entrances · animating layout properties · reveals that hide content when JS fails · ungated `:hover` motion · more than one scrubbed/pinned section per screen of scroll · several competing loops in the hero.

## Output

Return working code, then at most three lines: the purpose of the main motion, the curve and duration used, and anything that needs a feel-check on a real device (play it at 3× slower in DevTools first).

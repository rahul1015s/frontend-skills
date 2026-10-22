---
name: html-kinetic-type
description: Kinetic typography for CDN-only HTML — per-character reveals, SVG text on a path with scroll-linked startOffset, stroke-drawn letters, variable-font weight shifts, text marquees and scroll-scrubbed headlines, with accessibility and performance rules. Use when the headline itself should be the signature moment or text needs to move along curves.
---

# Kinetic Typography in HTML

Type is the cheapest way to make a page memorable: no assets, resolution independent, SEO-friendly. Techniques here follow the approaches in Codrops' *Animating SVG Text on a Path* (couple a `textPath`'s `startOffset` to scroll, use IntersectionObserver so only visible text animates, add SVG filters carefully) and *Bringing Letters to Life* (draw each letter's stroke with a staggered GSAP animation, stacking several coloured passes). Only summaries of those articles were retrievable, so the code is written from the described techniques.

Rule of thumb: **one kinetic text moment per page**, chosen to carry the brand, with everything else typographically calm.

## 0. Accessibility and structure (always)

- The real text stays in the DOM and readable. When splitting into spans, keep the original sentence available: put `aria-label="Full headline"` on the heading and `aria-hidden="true"` on the split spans.
- Under `prefers-reduced-motion`, show the final state immediately.
- Do not animate body copy. Display text only (headlines, section titles, decorative lines).

## 1. Per-character reveal (the workhorse)

```html
<h1 class="split" aria-label="Crafted in small batches"><span aria-hidden="true">Crafted in small batches</span></h1>
```

```css
.split .line{display:block;overflow:hidden;padding-bottom:.08em}      /* mask so letters rise from nothing */
.split .char{display:inline-block;will-change:transform}
```

```js
function splitChars(el){
  const text = el.textContent.trim();
  el.innerHTML = '';
  text.split(' ').forEach((word, wi, arr) => {
    const w = document.createElement('span'); w.className = 'word'; w.style.display = 'inline-block'; w.setAttribute('aria-hidden', 'true');
    [...word].forEach(c => { const s = document.createElement('span'); s.className = 'char'; s.textContent = c; w.append(s); });
    el.append(w); if (wi < arr.length - 1) el.append(' ');
  });
  return el.querySelectorAll('.char');
}
const h = document.querySelector('.split'); const label = h.textContent.trim();
h.setAttribute('aria-label', label);
const chars = splitChars(h);
gsap.from(chars, { yPercent: 110, rotate: 6, opacity: 0, duration: 1, ease: 'expo.out', stagger: { each: .025, from: 'start' },
                   scrollTrigger: { trigger: h, start: 'top 85%', once: true } });
```

Wrap each word in `overflow:hidden` if you want a clean mask; stagger 20–35ms per character (longer feels slow). Splitting.js (`data-splitting`) can replace `splitChars` and exposes `--char-index` for CSS-only staggers.

## 2. SVG text on a path, scroll-linked

```html
<svg class="path-text" viewBox="0 0 1200 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <path id="curve" d="M-100,300 C200,40 500,40 700,220 S1100,380 1400,120" fill="none"/>
  <text>
    <textPath href="#curve" startOffset="0%">Slow food · Fast heart · Slow food · Fast heart ·</textPath>
  </text>
</svg>
<h2 class="sr-only">Slow food, fast heart</h2>
```

```css
.path-text{width:100%;overflow:visible}
.path-text text{font:400 clamp(48px,9vw,120px)/1 var(--font-display);fill:var(--text);letter-spacing:.02em}
.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
```

```js
const tp = document.querySelector('textPath');
gsap.fromTo(tp, { attr: { startOffset: '0%' } }, {
  attr: { startOffset: '-60%' }, ease: 'none',
  scrollTrigger: { trigger: '.path-text', start: 'top bottom', end: 'bottom top', scrub: true }
});
```

Notes:
- Use `href` (SVG2); add `xlink:href` too if you must support old Safari.
- Make the text longer than the path (repeat the phrase) so there is never a gap while offsetting.
- Negative offsets work in Chrome and Firefox; Safari has had bugs with animating through negative `startOffset`, so test it and start from a positive value if needed.
- Animate only when visible: either ScrollTrigger as above, or an IntersectionObserver that toggles a flag.
- SVG filters (`feTurbulence`, blur) on animated text are expensive, particularly in Firefox. Prefer plain fills; apply a filter only to a static copy.
- Velocity-reactive variant: skew or change `letter-spacing` using `ScrollTrigger.create({ onUpdate: s => gsap.to(tp, { skewX: s.getVelocity()/-400, overwrite: true }) })`.

## 3. Stroke-drawn letters

Two routes:

**A. Outline draw with any font (CDN-only, works everywhere).** Draw the glyph outlines, then fill.

```html
<svg class="draw" viewBox="0 0 900 220" role="img" aria-label="Atelier">
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central">Atelier</text>
</svg>
```
```css
.draw text{font:400 180px var(--font-display);fill:transparent;stroke:var(--text);stroke-width:1.5;
  stroke-dasharray:var(--len);stroke-dashoffset:var(--len)}
```
```js
const t = document.querySelector('.draw text'); const len = Math.ceil(t.getComputedTextLength() * 4);   // generous dash length
t.style.setProperty('--len', len);
gsap.timeline({ scrollTrigger:{ trigger:'.draw', start:'top 80%', once:true } })
  .to(t, { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut' })
  .to(t, { fill: getComputedStyle(document.documentElement).getPropertyValue('--text'), duration: .8 }, '-=.6');
```

Dashing a closed glyph outline draws each contour as one pass; for more control, outline several glyphs separately by wrapping each letter in its own `<text>`/`<tspan>` and staggering.

**B. True single-line letters (the Codrops look).** Needs a monoline (single-stroke) font converted to SVG paths, one `<path>` per letter. Steps: generate the SVG from a hairline font, split into one path per letter, optimise (for example with SVGOMG, with *merge paths* turned off), then animate each path:

```js
const paths = gsap.utils.toArray('.mono path');
paths.forEach(p => p.setAttribute('pathLength', 1));
gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 });
gsap.to(paths, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut', stagger: .12 });
```

Stack two or three copies of the word with different stroke colours and a 80–150ms delay between them for the layered, hand-drawn look. For letters whose path runs the wrong way, reverse with a negative `strokeDashoffset` start (`-1`).

## 4. Variable-font weight and width shifts

```css
h1{font-family:'Fraunces',serif;font-variation-settings:'wght' 300,'opsz' 144;transition:font-variation-settings .5s var(--ease-out)}
@media (hover:hover){h1:hover{font-variation-settings:'wght' 800,'opsz' 144}}
```
Load only the variable axes needed from Google Fonts (`family=Fraunces:opsz,wght@9..144,300..900`). Scroll-scrub the axis with GSAP: `gsap.to(h,{fontVariationSettings:"'wght' 800", scrollTrigger:{…scrub:true}})`. Changing weight reflows lines; reserve width (`min-width`) or use it on single-line display text.

## 5. Text marquee with scroll-velocity

```js
let x = 0, dir = -1; const track = document.querySelector('.marquee-track'), half = () => track.scrollWidth / 2;
gsap.ticker.add(() => { x += dir * 1.2; if (x <= -half()) x = 0; if (x > 0) x = -half(); gsap.set(track, { x }); });
ScrollTrigger.create({ onUpdate: s => dir = s.direction === 1 ? -1 : 1 });   // reverses with scroll direction
```
Duplicate the content once so the loop is seamless; give huge outlined type (`-webkit-text-stroke: 1px var(--text); color: transparent`) for contrast against solid type.

## 6. Scrubbed word highlight (reading-progress headline)

Split by words, set each to 20% opacity, and scrub to 100% in sequence while the section scrolls:

```js
gsap.fromTo('.statement .word', { opacity: .2 }, { opacity: 1, stagger: .1, ease: 'none',
  scrollTrigger: { trigger: '.statement', start: 'top 70%', end: 'bottom 60%', scrub: true } });
```

## 7. Performance and polish

- Animate `transform`/`opacity` only; avoid animating `font-size` or `letter-spacing` on large text.
- Cap split text at roughly 200 characters per animation; over that, split by words or lines.
- Call `ScrollTrigger.refresh()` after `document.fonts.ready` so measurements use the final font.
- Use `text-wrap: balance`, `font-kerning: normal`, and `-webkit-font-smoothing: antialiased`.
- Pair a kinetic headline with calm supporting copy and generous space around it.

## 8. Never ship

Animated body text · a headline unreadable until its animation ends (cap reveal at ~1.2s) · split spans without an accessible label · filters on moving text · several different kinetic styles on one page.

## Output

Full working snippet in context of the page, then one line: which technique, the stagger/duration values, and the reduced-motion behaviour.

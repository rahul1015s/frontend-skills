---
name: html-fx-effects
description: A zero-dependency kit of ~75 animated effects for single-file HTML sites — text animations, shader/canvas backgrounds, cursor effects, animated cards, menus, carousels and micro-interactions — driven by a data-fx attribute. Use when a page should have the kind of motion seen on reactbits.dev (blur-in text, aurora/plasma/galaxy backgrounds, spotlight cards, magnet buttons, dock, gooey nav, etc.) without React.
---

# FX — animated effects kit for plain HTML

`fx/fx.js` (in this repo) is one self-contained script, about 80 KB, with no dependencies. Every effect is switched on with an attribute:

```html
<h1 data-fx="split-text">Motion that feels alive</h1>
<section data-fx="bg-aurora" data-opts='{"colors":["#5eead4","#818cf8","#f472b6"]}'> … content … </section>
<script src="fx.js"></script>   <!-- or inline the file's contents in a <script> at the end of <body> -->
```

- `data-fx="a b"` can stack effects (space separated). `data-opts='{"json":"options"}'` tunes them.
- Effects auto-start on DOMContentLoaded. For nodes added later call `FX.init(container)`; to stop one call `FX.destroy(el)`.
- Offscreen canvases and shaders pause themselves (IntersectionObserver). `prefers-reduced-motion` shows the end state / a still frame. Touch devices skip hover-only effects.
- Text effects keep the real text in `aria-label`, so screen readers and SEO are unaffected.
- **Single-file output:** when the user wants one `index.html`, paste the contents of `fx/fx.js` inside one `<script>` tag. To save size, you may delete effect blocks you do not use; `00-core.js` (the first block) is required, and every other block is independent.
- Never write your own version of an effect listed here. Use the kit, then spend your effort on layout, copy and photos.

Source is in `fx/src/*.js` (edit there, then `node fx/build.mjs`). `fx/showcase.html` demos every effect and is the regression test: open it in a real browser and scroll.

## Where to use what (pick 3–5 per page, not all)

| Page moment | Good picks |
| --- | --- |
| Hero background | `bg-aurora`, `bg-silk`, `bg-galaxy`, `bg-plasma`, `bg-light-rays`, `bg-hyperspeed`, `bg-particles` |
| Hero headline | `split-text`, `blur-text`, `shiny-text`, `gradient-text`, `rotating-text`, `type-text` |
| Section title | `scroll-float`, `scroll-reveal` (long statements), `scramble-text`, `true-focus` |
| Numbers | `count-up` |
| Divider / ticker | `scroll-velocity`, `curved-loop`, `logo-loop` |
| Cards | `spotlight-card`, `border-glow`, `tilted-card`, `holo-card`, `glare-hover`, `glass-surface`, `flip-card` |
| Buttons | `magnet`, `ripple-button`, `hold-button`, `star-border`, `electric-border` |
| Navigation | `dock`, `gooey-nav`, `pill-nav`, `flowing-menu` |
| Galleries | `accordion-gallery`, `carousel`, `masonry`, `card-stack`, `scroll-stack`, `image-trail` |
| Whole-page polish | `blob-cursor` or `target-cursor` (one cursor only), `noise` (grain over a section), `reveal` on every block |

Rules: one background per section; one cursor effect per page; `bg-*` effects need the container to have a height and its content in a child with `position:relative` (the canvas is placed first and content paints over it). Give each shader background a dark or tinted base colour so text stays legible, and keep body text off the busiest areas.

## Catalog and options

Options are the JSON in `data-opts`. Defaults are in the source; only list what you change.

### Text
| `data-fx` | What it does | Options |
| --- | --- | --- |
| `blur-text` | Words (or chars) fade in from blur | `by:"words"/"chars"`, `delay`, `dur`, `from:"top"/"bottom"`, `blur` |
| `split-text` | Characters rise from a mask on view | `delay`, `dur`, `rotate` |
| `shiny-text` | Light sweep across grey text | `speed` (s). CSS vars `--fx-base`, `--fx-shine` |
| `gradient-text` | Animated multi-colour gradient fill | `speed`. CSS vars `--fx-c1..3` |
| `glitch-text` | RGB-split glitch slices | CSS vars `--fx-g1`, `--fx-g2` |
| `stroke-text` | Outline text that fills on hover | `--fx-sw`, `--fx-sc` |
| `scramble-text` | Random glyphs settle into the text (view + hover) | `speed`, `steps`, `hover`, `chars`, `sequential` |
| `decrypted-text` | Same, binary/block glyph set | same |
| `type-text` | Typewriter, loops through `texts` | `texts:[…]`, `speed`, `erase`, `pause`, `loop`, `caret` |
| `count-up` | Number counts up on view | `to`, `from`, `dur`, `decimals`, `prefix`, `suffix`, `sep` |
| `rotating-text` | Word swaps in place with a slide | `texts:[…]`, `every`, `dur` |
| `scroll-reveal` | Words sharpen and brighten as you scroll | `base`, `blur` |
| `scroll-float` | Big letters float up, scroll-linked | `stagger` |
| `true-focus` | Corner-bracket box hops between words | `every`, `blur`, `auto` |
| `text-pressure` | Variable-font weight follows the cursor (use a variable font such as Inter) | `radius`, `minW`, `maxW`, `axis` |
| `curved-loop` | Text scrolls along a curve, draggable | `text`, `speed`, `curve`, `size` |
| `scroll-velocity` | Marquee that speeds up and reverses with scroll | `speed`, `texts`, `sep`, `gap` |
| `circular-text` | Text on a rotating ring | `size`, `dur`, `hoverSpeed` |
| `shuffle-text` | Letter reels land in order | `dur`, `stagger`, `rounds` |
| `falling-text` | Words fall, bounce and pile up | `gravity`, `bounce`, `trigger:"view"/"click"` |

### Backgrounds (WebGL shaders: `colors:[hex,hex,hex]`, `speed`, `scale`, `mouse`)
`bg-aurora` (curtains of light), `bg-plasma`, `bg-iridescence`, `bg-silk` (marbled folds), `bg-waves` (flowing lines), `bg-light-rays` (follows the cursor with `mouse:true`), `bg-ripple-grid` (grid ripples from the cursor), `bg-galaxy`, `bg-liquid-chrome`, `bg-orb`, `metaballs` (gooey blobs, one follows the cursor).

### Backgrounds (canvas 2D)
| `data-fx` | Options |
| --- | --- |
| `bg-particles` (links + cursor repel) | `count`, `color`, `size`, `link`, `speed`, `repel` |
| `bg-dot-grid` (dots spring away from the cursor) | `gap`, `size`, `color`, `active`, `radius`, `push` |
| `bg-letter-glitch` | `colors:[3]`, `font`, `speed`, `chars` |
| `bg-hyperspeed` (warp stars, cursor steers) | `count`, `speed`, `color`, `trail` |
| `bg-lightning` | `color`, `every`, `width` |
| `bg-radar` | `color`, `rings` |
| `bg-snow` (use `dir:"up"` for embers) | `count`, `color`, `dir`, `size` |

### Cursor and interaction
| `data-fx` | What it does | Options |
| --- | --- | --- |
| `reveal` | Scroll-in fade + slide | `from:"up/down/left/right/scale"`, `dist`, `delay`, `blur` |
| `magnet` | Element is pulled toward the cursor | `strength`, `pad` |
| `click-spark` | Radial sparks on click inside the element | `color`, `count`, `size`, `radius`, `dur` |
| `blob-cursor` | Soft blobs trail the cursor (put on any element, it attaches to `body`) | `size`, `color`, `blobs` |
| `target-cursor` | Reticle that snaps around links/buttons | `color`, `selector`, `size` |
| `image-trail` | `<img>` children spawn along the cursor path | `gap`, `life`, `size` |
| `pixel-trail` | Fading pixels follow the pointer | `px`, `color`, `fade` |
| `glare-hover` | Diagonal light sweep on hover | `alpha` |
| `star-border` | Orbiting glow on the border | `color`, `speed`, `pad`, `inner` |
| `electric-border` | Crackling SVG outline | `color`, `width`, `radius`, `chaos` |
| `noise` | Animated film grain overlay | `alpha`, `fps`, `size` |
| `logo-loop` | Children become an infinite marquee, pauses on hover | `speed`, `gap` |

### Components
| `data-fx` | Markup it expects | Options |
| --- | --- | --- |
| `spotlight-card` | any card | `color`, `radius` |
| `border-glow` | any card (use on every card of a grid) | `color` |
| `tilted-card` | card; children with `data-depth="14"` get parallax | `max`, `scale`, `persp` |
| `holo-card` | any card (foil highlight + tilt) | |
| `glass-surface` | any box over a colourful background | `blur`, `radius` |
| `flip-card` | two children: front, back | |
| `dock` | row of icons | `max`, `range` |
| `flowing-menu` | `<a href data-img="url">Label</a>` list | CSS vars `--fx-fm-bg`, `--fx-fm-fg` |
| `gooey-nav` | `<nav><ul><li><a>…` | CSS vars `--fx-goo-bg`, `--fx-goo-on` |
| `pill-nav` | row of links | `bg`, `fg` |
| `card-stack` | children = cards, click to shuffle | `offset`, `rot` |
| `accordion-gallery` | children = panels (with `<img>`) | CSS var `--fx-h` |
| `animated-list` | children stagger in | |
| `scroll-stack` | children are tall cards that pin and shrink | `top`, `gap`, `scaleStep` |
| `masonry` | children of any height | `cols`, `gap` |
| `carousel` | children = slides (give them `flex:none;width:…`) | `gap` |
| `stepper` | children = step panels | CSS var `--fx-step-on` |
| `elastic-slider` | empty div; emits `fx-input` (`e.detail` = value) | `min`, `max`, `value` |

### Micro-interactions
`ripple-button`, `hold-button` (fires `fx-hold`, option `ms`), `squish-switch` (a `<button>`, sets `aria-checked`), `spring-check` (an `<input>`), `pulse-heart` (sets `aria-pressed`), `scrub-field` (drag a number sideways, fires `fx-input`; options `step`, `min`, `max`).

## Adding an effect

1. Write it as `FX.register('name', (el) => { … return cleanupFn; })` in a file under `fx/src/`. Read options with `FX.util.opts(el, {defaults})`.
2. Use `FX.util.loop(el, (t, dt) => …)` for per-frame work (pauses offscreen), `FX.util.shaderBg(el, fragSrc, opts)` for a shader (uniforms: `uRes uTime uMouse uA uB uC uS`), `FX.util.canvasIn(el)` for a 2D canvas, `FX.util.inview(el, cb)` for on-view triggers, and respect `FX.util.RM` (reduced motion).
3. `node fx/build.mjs`, add a demo to `fx/showcase.html`, scroll the page in a real browser and check the console.
4. Test in real-time headless Chrome. Virtual-time mode misreports IntersectionObserver and transitions. Never `clip-path` an element that an IntersectionObserver watches.

## Credit and licence

The effects are inspired by the *kinds* of motion catalogued on reactbits.dev. All code here is original, written for this repo. React Bits is MIT with a Commons Clause that forbids redistributing its components, including ported versions, so **do not paste or translate code from the React Bits repo into this kit**; describe the behaviour and write it fresh.

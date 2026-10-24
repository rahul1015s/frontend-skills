---
name: html-fx-effects
description: A zero-dependency kit of ~220 animated effects for single-file HTML sites — text animations, WebGL/canvas backgrounds, cursor effects, image effects, animated cards, menus, galleries, 3D carousels and micro-interactions — driven by a data-fx attribute. Use when a page should have the kind of motion seen on reactbits.dev (blur-in text, aurora/plasma/galaxy backgrounds, spotlight cards, magnet buttons, dock, gooey nav, lanyard, flowing menu, etc.) without React.
---

# FX — animated effects kit for plain HTML

The kit lives in `fx/` (this repo): **~220 effects, no dependencies**. Every effect is switched on with an attribute:

```html
<h1 data-fx="split-text">Motion that feels alive</h1>
<section data-fx="bg-aurora" data-opts='{"colors":["#5eead4","#818cf8","#f472b6"]}'> … content … </section>
<script src="https://cdn.jsdelivr.net/gh/rahul1015s/frontend-skills@main/fx/dist/fx-text.js"></script>
<script src="https://cdn.jsdelivr.net/gh/rahul1015s/frontend-skills@main/fx/dist/fx-backgrounds.js"></script>
```

**Which file to load** (each bundle includes the small core; several can be loaded on one page):

| File | Contents | Size |
| --- | --- | --- |
| `fx/dist/fx-text.js` | text effects | ~44 KB |
| `fx/dist/fx-backgrounds.js` | shader + canvas backgrounds | ~52 KB |
| `fx/dist/fx-interaction.js` | cursor effects, borders, image effects, scroll effects | ~54 KB |
| `fx/dist/fx-components.js` | cards, menus, galleries, carousels, sliders, 3D | ~75 KB |
| `fx/dist/fx-micro.js` | buttons, toggles, inputs, delete animations, toasts | ~60 KB |
| `fx/fx.js` | everything (~240 KB) | |

Load only the bundles the page uses. For development pin to `@main`; for a shipped page pin to a commit hash (`@<hash>`) so later edits to the repo cannot change the page.

- `data-fx="a b"` can stack effects (space separated). `data-opts='{"json":"options"}'` tunes them.
- Effects auto-start on DOMContentLoaded. For nodes added later call `FX.init(container)`; to stop one call `FX.destroy(el)`.
- Offscreen canvases and shaders pause themselves (IntersectionObserver). `prefers-reduced-motion` shows the end state / a still frame. Touch devices skip hover-only effects.
- Text effects keep the real text in `aria-label`, so screen readers and SEO are unaffected.
- **Single-file output (no CDN):** paste the needed `fx/dist/fx-*.js` contents inside one `<script>` tag at the end of `<body>`. Every effect block is independent, so unused ones may be deleted; the first block (core) is required.
- Never write your own version of an effect listed here. Use the kit, then spend your effort on layout, copy and photos.

Source is in `fx/src/*.js` (edit there, then `node fx/build.mjs`, which regenerates `fx/fx.js` and `fx/dist/`). `fx/showcase.html` (the first ~75) and `fx/showcase-more.html` (`?demo=name,name` or `?bg=name,name`, no query = all demos) are the regression tests: open in a real browser and scroll.

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

Rules: one background per section; **keep at most ~8 shader (`bg-*` / WebGL) backgrounds on screen at once** (browsers cap live WebGL contexts at ~16; the kit creates a context only while the element is visible and releases it when it scrolls away); one cursor effect per page; `bg-*` effects need the container to have a height and its content in a child with `position:relative` (the canvas is placed first and content paints over it). Give each shader background a dark or tinted base colour so text stays legible, and keep body text off the busiest areas.

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

## More effects (second batch)

### More text
| `data-fx` | What it does | Options |
| --- | --- | --- |
| `variable-proximity` | Like `text-pressure`, any variable axis follows the cursor | `axis`, `minW`, `maxW`, `radius` |
| `echo-text` | Outlined copies fan out behind the text | `n`, `dx`, `dy` |
| `depth-text` | Extruded layers shift with the pointer for 3D depth | `layers`, `step`, `color` |
| `fold-text` | Letters fold in like paper on view | `delay`, `dur` |
| `fuzzy-text` | Per-letter jitter, stronger on hover | `base`, `hover` |
| `split-flap-text` | Departure-board flaps flip to the text(s) | `texts:[…]`, `every`, `speed` |
| `masked-heading` | Colour-inverting spotlight follows the cursor over the heading | `color` |
| `tech-text` | HUD brackets that expand on hover + scramble on view | |
| `text-cursor` | A text caret follows the pointer across the text | `color` |
| `text-loop` | Sentences roll vertically (same engine as `rotating-text`) | `texts`, `every` |
| `warp-text` | Wavy skewing text, faster on hover | `amp`, `speed` |
| `particle-text` | Dots fly into the letters, scatter from the cursor | `gap`, `size`, `color`, `font`, `repel` |
| `ascii-text` | The text drawn as ASCII art, rippling under the cursor | `cell`, `color`, `ramp`, `font` |

### More shader backgrounds (WebGL, `colors:[3 hex]`, `speed`, `scale`, `mouse`)
`bg-beams`, `bg-color-bends`, `bg-dark-veil`, `bg-dither`, `bg-evil-eye` (iris follows `mouse:true`), `bg-floating-lines`, `bg-flux-lines`, `bg-gradient-blinds`, `bg-gradient-waves`, `bg-grainient`, `bg-light-pillar`, `bg-light-tunnel`, `bg-line-waves`, `bg-magic-rings`, `bg-molten-metal`, `bg-pattern-waves`, `bg-plasma-wave`, `bg-prism`, `bg-prismatic-burst`, `bg-scanner`, `bg-side-rays`, `bg-sliced-waves`, `bg-soft-aurora`, `bg-threads`, `bg-topography`, `bg-web-threads`, `bg-balatro` (pixelated paint swirl), `bg-crt-warp`, `bg-aero-shards` (glassy voronoi), `bg-ghost-fibers`, `bg-faulty-terminal`, `bg-ferrofluid`, `bg-dot-field`, `bg-micro-slats`, `grid-scan` (perspective grid with a scanning sweep), `crystalized-ball` (faceted sphere; centred shape), `laser-flow` (beam + fog), `metallic-paint`, `shape-blur` (blurred rounded shape follows the cursor), `dither-veil` (dithered dark veil that parts around the cursor).

### More canvas backgrounds
| `data-fx` | What it does | Options |
| --- | --- | --- |
| `bg-acid-squares` | Squares flash neon colours; cursor lights them | `size`, `colors`, `rate` |
| `bg-antigravity` | Dots drift up, cursor repels | `count`, `color`, `repel` |
| `bg-ballpit` | Physics balls pile up, cursor shoves them | `count`, `colors`, `min`, `max`, `gravity` |
| `bg-gradient-ascii` | Moving gradient rendered as ASCII | `ramp`, `size`, `color` |
| `bg-grid-distortion` | Grid lines bend away from the cursor | `gap`, `color`, `radius`, `push` |
| `bg-magnet-lines` | A field of dashes all aiming at the cursor | `gap`, `len`, `color`, `hot` |
| `bg-pixel-blast` | Wave-driven pixels; click sends a ripple | `px`, `color`, `color2` |
| `bg-pixel-snow` | Square pixel snowfall | `count`, `color`, `px` |
| `bg-shape-grid` | Shapes swell near the cursor | `shape:"square/circle/triangle"`, `gap`, `color`, `hot` |
| `bg-shape-waves` | Rows of shapes on sine waves | `rows`, `cols`, `shape`, `colors` |
| `bg-lightfall` | Falling vertical light streaks | `count`, `colors` |

### More cursor and page effects
| `data-fx` | What it does | Options |
| --- | --- | --- |
| `animated-content`, `fade-content` | Aliases of `reveal` (`fade-content` = scale + blur) | as `reveal` |
| `crosshair` | Crosshair lines + live coordinates inside the element | CSS var `--fx-cc` |
| `glow-cursor` | Soft radial glow trails the cursor (page-wide) | `size`, `color` |
| `ghost-cursor` | Wispy ghost trail (page-wide overlay) | `color`, `len` |
| `ribbons` | Spring-chain ribbons trail the cursor (overlay) | `colors`, `len`, `width` |
| `strands` | Hanging strands pushed by the cursor (overlay) | `count`, `color`, `segs` |
| `swarm-cursor` | Particle swarm orbits the cursor (overlay) | `count`, `color` |
| `splash-cursor` | Coloured ink splats thrown by cursor speed (overlay) | |
| `cursor-grid` | Grid cells light up and fade along the cursor path | `cell`, `color`, `fade` |
| `elastic-mesh` | Springy mesh pulled by the cursor | `gap`, `color`, `radius` |
| `gradual-blur` | Progressive edge blur over scrolling content (needs `backdrop-filter`) | `edge`, `height`, `strength` |
| `cubes` | 3D grid of cubes that rise under the cursor; click pulses | `n`, `size`, `gap`, `max` |
| `orbit-images` | Children orbit an ellipse with depth | `rx`, `ry`, `speed`, `tilt` |
| `scroll-expand` | First child grows from a card to full-bleed as you scroll | `from`, `minH`, `tall` |
| `pixel-transition` | Hover reveals child 2 through a block dissolve (children: base, hover) | `cols`, `rows`, `dur`, `color` |
| `pixel-swap` | Auto-cycles children with the same dissolve | `every`, `cols`, `rows` |
| `sticker-peel` | Corner peels up on hover | `peel`, `rest` |
| `grid-motion` | Rows of items slide in opposite directions with the pointer | `rows`, `amount` |
| `electric-logo` | Crackling electric text/SVG | `color` |

Overlay effects draw on a fixed full-screen canvas above the page (`pointer-events:none`) and only run on fine-pointer devices; use at most one.

### Image effects (WebGL; first `<img>` child is the texture, or `{"image":"url"}`; host must allow CORS, Unsplash does)
`ripple-distortion` (click and hover ripples), `halftone-reveal` (halftone dots swell into the colour photo near the cursor), `image-bulge` (lens bulge + RGB split). The element needs a size.

### More components
| `data-fx` | Markup it expects | Options |
| --- | --- | --- |
| `stack` | alias of `card-stack` | |
| `bounce-cards` | child cards (set sizes) fan out; hover pushes siblings apart | `spread`, `rots` |
| `bubble-menu` | `<a>` children; a round toggle blooms pill links | `gap` |
| `card-nav` | `.bar` (optional) + `.cards` > `<a>`; bar drops open into cards | `data-title` |
| `card-swap` | child cards in a 3D stack; front card drops to the back | `every`, `dx`, `dy`, `dz` |
| `chroma-grid` | grid of images/cards; greyscale except around the cursor | `radius` |
| `option-wheel` | child options; iOS-style wheel picker, `el.value`, `fx-input` | `itemH`, `visible`, `index` |
| `depth-carousel` | sized children; click side cards, arrow keys | `step`, `auto` |
| `flex-carousel` | `accordion-gallery` that auto-advances | `every` |
| `folder` | up to 3 children become papers that slide out | `color` |
| `glass-icons` | `<a data-c1 data-c2 data-label>icon</a>` tiles | |
| `drift-wall` | tiles in tilted columns drifting up/down | `cols`, `speed` |
| `line-sidebar` | `<nav>` of `<a href="#id">`; sliding line, tracks scroll | CSS var `--fx-ln` |
| `pixel-card` | any card; sparkling pixels fill it on hover | `color`, `gap`, `speed` |
| `specular-button` | a `<button>`; highlight and glowing edge follow the cursor | |
| `reflective-card` | any card; metallic reflection + tilt | |
| `profile-card` | tilt + holo foil + spotlight combined | |
| `magic-bento` | grid whose children get spotlight, edge glow, sparkles | `color`, `stars` |
| `fluid-glass` | image/section; a glass lens follows the cursor | `size` |
| `counter` | rolling-digit counter; `el.fxSet(n)` | `value`, `pad` |
| `dome-gallery` | children pinned inside a drag-rotatable sphere | `radius`, `size`, `auto` |
| `infinite-menu` | text/images on a draggable 3D sphere | `radius` |
| `infinite-spiral` | children spiral through 3D with scroll | `radius`, `rise`, `turn` |
| `flying-posters` | posters fly toward you, bend with scroll speed | `depth` |
| `circular-carousel`, `circular-gallery` | children on a draggable 3D ring | `w`, `h`, `radius`, `auto` |
| `decay-card` | image card with liquid displacement + tilt | |
| `morph-slider` | thumb squashes and stretches with speed; `fx-input` | `min`, `max`, `value` |
| `staggered-menu` | `<a>` children; slide-in panel with coloured layers (adds a fixed toggle) | `layers`, `label` |
| `lanyard` | child = badge/card hanging from a verlet rope; drag to swing | `segs`, `len`, `color` |
| `curved-input` | an input whose text follows a curve | `curve`, `size`, `placeholder`, `max` |
| `model-viewer` | drag-to-orbit 3D; loads three.js from esm.sh on demand; `{"src":"x.glb"}` (torus knot if empty) | `src`, `color`, `auto` |

### More micro-interactions
| `data-fx` | What it does | Events / options |
| --- | --- | --- |
| `bell-toggle` | Bell rings, badge pops (`aria-pressed`) | |
| `code-slots` | OTP boxes with paste and auto-advance | `fx-complete`; `n`, `numeric` |
| `comet-dial` | Draggable knob with a comet tail (give it a size) | `fx-input`; `color`, `value` |
| `dodge-field` | Children (or itself) run away from the cursor | `radius`, `force`, `self` |
| `flying-button` | Plane flies off on click, shows "Sent" | `fx-sent`; `label`, `done` |
| `folder-float` | Floating `folder` | |
| `fuse-button` | Click lights a fuse; fires when it burns out (click again to defuse) | `fx-boom`; `ms` |
| `glide-select` | Custom listbox, highlight glides | `fx-input` (index) |
| `jelly-radio` | Pill stretches like jelly between options | `fx-input` |
| `lattice-loader` | Diamond-grid spinner | `n` |
| `peek-rating` | Stars with hover preview and bounce | `fx-input`; `n`, `value` |
| `prompt-bar` | AI prompt bar, animated gradient border, typing placeholder | `fx-submit`; `placeholders` |
| `refine-frame` | Viewfinder corners tighten on hover/focus | |
| `rubber-segment` | Segmented control with rubber-band indicator | `fx-input` |
| `slide-commit` | Slide to confirm | `fx-confirm`; `label`, `done` |
| `sling-button` | Drag back and release like a slingshot | `fx-fling`; `power`, `max` |
| `slosh-gauge` | Liquid gauge; `el.fxSet(n)`; sloshes with the cursor | `value`, `color` |
| `status-mark` | Self-drawing check / cross / spinner: `data-s="ok/err/load"` or `el.fxSet(s)` | |
| `swipe-row` | Row swipes left to reveal action buttons (child 1 = row, rest = actions) | |
| `swipe-toast` | Click shows a swipe-away toast; also `FX.toast('msg', {ms})` | `data-msg` |
| `tear-ticket` | Drag the stub down to tear it off (children: main, stub) | `fx-tear` |
| `thought-line` | Shimmering "thinking" skeleton lines | `lines`, `label` |
| `voice-pill` | Audio bars animate while on | `fx-input`; `label`, `live`, `bars` |
| `wake-slider` | Moon/sun day-night switch | `fx-input` (true = day) |
| `warm-tooltip` | Springy tooltip near the cursor for any `[data-tip]` | |
| `call-chip` | Pill expands into a live call timer | `name` |
| `branched-menu` | Root button grows a tree of links on curved branches | `items`, `dx`, `dy`, `label` |
| `paper-crumple` | Element crumples into a ball and is tossed (`el.fxCrumple()`) | `fx-gone` |
| `shredder` | Element is cut into strips that fall (`el.fxShred()`) | `fx-gone`; `strips` |

Custom events (`fx-input`, `fx-confirm`, …) bubble, so listen with `el.addEventListener('fx-input', e => e.detail)`.

### Known simplifications (be honest with the user)
These follow the *behaviour* of the React Bits originals but are lighter: `splash-cursor` is ink splats, not a fluid simulation; `lanyard` is a 2D rope, not 3D physics; `infinite-menu` is a DOM sphere, not a WebGL one; `ferrofluid`, `crystalized-ball`, `fluid-glass` and `dome-gallery` approximate the originals' look; `model-viewer` fetches three.js from esm.sh at runtime.

## Adding an effect

1. Write it as `FX.register('name', (el) => { … return cleanupFn; })` in a file under `fx/src/`. Read options with `FX.util.opts(el, {defaults})`.
2. Use `FX.util.loop(el, (t, dt) => …)` for per-frame work (pauses offscreen), `FX.util.shaderBg(el, fragSrc, opts)` for a shader (uniforms: `uRes uTime uMouse uA uB uC uS`), `FX.util.canvasIn(el)` for a 2D canvas, `FX.util.inview(el, cb)` for on-view triggers, and respect `FX.util.RM` (reduced motion).
3. `node fx/build.mjs`, add a demo to `fx/showcase.html`, scroll the page in a real browser and check the console.
4. Test in real-time headless Chrome. Virtual-time mode misreports IntersectionObserver and transitions. Never `clip-path` an element that an IntersectionObserver watches.

## Credit and licence

The effects are inspired by the *kinds* of motion catalogued on reactbits.dev. All code here is original, written for this repo. React Bits is MIT with a Commons Clause that forbids redistributing its components, including ported versions, so **do not paste or translate code from the React Bits repo into this kit**; describe the behaviour and write it fresh.

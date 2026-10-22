---
name: html-icons-tabler
description: How to use Tabler Icons (6,000+ consistent 24px / 2px-stroke icons) in a CDN-only HTML page — webfont and inline-SVG methods, sizing, stroke, colour, accessibility, icon-per-intent cheat sheet and animation. Use whenever a page needs icons; replaces emoji and Font Awesome defaults.
---

# Tabler Icons in HTML

Tabler Icons: 6,000+ icons on a 24×24 grid with a 2px stroke, in outline and filled variants, MIT licensed. One visual family means the page looks designed instead of assembled. Source: tabler.io/icons (the CDN snippet below is from docs.tabler.io).

## 1. Method A — webfont (simplest)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.49.0/dist/tabler-icons.min.css">
<i class="ti ti-brand-github" aria-hidden="true"></i>
```

- Pattern: `<i class="ti ti-ICON-NAME">`. Browse names at tabler.io/icons.
- Filled variants use the `-filled` suffix where one exists (for example `ti-heart-filled`, `ti-star-filled`). If a filled glyph does not render, that icon has no filled version in the pinned release; fall back to the outline.
- Size with `font-size`, colour with `color`. Stroke width **cannot** be changed on the webfont; use Method B when you need a lighter or heavier line.
- Verify the pinned version URL loads (200) before shipping; bump the number if you need newer icons.

```css
.ti{font-size:1.25em;line-height:1;vertical-align:-.125em}   /* sits on the text baseline */
.icon-lg{font-size:28px}
```

## 2. Method B — inline SVG (full control)

Paste the SVG so you can set stroke width and animate parts. This is the Tabler outline template:

```html
<svg class="ti-svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor"
     stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M5 12l5 5l10 -10"/>   <!-- check -->
</svg>
```

```css
.ti-svg{width:1.25em;height:1.25em;flex:none}
.feature .ti-svg{width:28px;height:28px;stroke-width:1.5}   /* thinner = more premium; 2 = default; 1.25 = editorial */
```

Individual files also exist in the `@tabler/icons` package under `icons/outline/NAME.svg` and `icons/filled/NAME.svg` on jsDelivr; use them with `<img>` only when you do not need colour inheritance (an `<img>` cannot take `currentColor`).

## 3. Consistency rules

1. One method, one stroke width, one size scale per page (16 / 20 / 24 / 32).
2. Icons inherit `currentColor`; never a hard-coded colour in the icon.
3. Outline for UI; filled only for an active/selected state (a heart that becomes filled when liked).
4. Pair an icon with a label whenever space allows. Icon-only needs `aria-label` (webfont: put the label on the button, not the `<i>`).
5. Decorative icons get `aria-hidden="true"`.
6. Optically align to text: `vertical-align:-.125em` or a flex container with `align-items:center; gap:.5em`.
7. Feature icons sit in a soft tile (`48px`, `border-radius:14px`, `background:var(--surface-2)`, 1px `--line` border) so they feel intentional.
8. Never mix icon families (no Font Awesome next to Tabler) and never use emoji as UI icons.

## 4. Intent → icon cheat sheet

| Intent | Icon names |
| --- | --- |
| Navigation | `menu-2`, `x`, `arrow-right`, `arrow-up-right`, `chevron-down`, `chevron-right`, `arrow-narrow-right` |
| Commerce | `shopping-bag`, `shopping-cart`, `credit-card`, `truck-delivery`, `receipt`, `tag`, `heart`, `star`, `discount-2` |
| Trust | `shield-check`, `rosette-discount-check`, `lock`, `certificate`, `thumb-up`, `award` |
| Speed / tech | `bolt`, `rocket`, `cpu`, `code`, `terminal-2`, `api`, `cloud`, `database`, `chart-line` |
| Contact | `mail`, `phone`, `map-pin`, `clock`, `brand-whatsapp`, `calendar-event`, `message-circle` |
| Social | `brand-instagram`, `brand-x`, `brand-linkedin`, `brand-youtube`, `brand-github`, `brand-tiktok` |
| Food / venue | `tools-kitchen-2`, `glass-full`, `coffee`, `bread`, `flame`, `leaf` |
| Fitness / health | `barbell`, `run`, `heartbeat`, `stethoscope`, `pill`, `yoga` |
| Property | `home`, `building-skyscraper`, `key`, `bed`, `bath`, `ruler-measure` |
| Feedback | `check`, `circle-check`, `alert-triangle`, `info-circle`, `loader-2`, `copy`, `download` |
| Theme | `sun`, `moon`, `device-desktop` |

Names change across releases; if an icon fails to render, search tabler.io/icons for the nearest name rather than guessing a new one.

## 5. Motion with icons

- Arrow nudge on button hover: `.btn:hover .ti-arrow-right{transform:translateX(3px)}` with `transition: transform .18s var(--ease-out)`, pointer-gated.
- Loader: `ti-loader-2` with `animation: spin .8s linear infinite`.
- Copy/check swap: crossfade two stacked icons (`opacity` + `scale(.8→1)`, 160ms) rather than changing the class abruptly.
- Stroke draw (Method B only): set `pathLength="1"`, `stroke-dasharray:1`, animate `stroke-dashoffset` 1→0 for checkmarks and success states.

## 6. Checklist

- [ ] Single icon method and stroke width
- [ ] `currentColor` everywhere; `aria-hidden` or `aria-label` set
- [ ] Sizes from the scale; optically aligned with text
- [ ] CDN URL confirmed; page still readable if the font fails (labels carry the meaning)

## Output

Icons used in markup plus the one `<link>` (or inline SVG), and one line naming the stroke width and size scale chosen.

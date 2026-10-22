---
name: html-palette-type
description: Colour palettes and font pairings for CDN-only HTML sites — a token system with dark and light themes, 14 ready palettes by industry and mood, Google Fonts pairings with fluid type scales, contrast rules and a method for building a custom palette. Use whenever choosing colours, fonts or design tokens for a website.
---

# HTML Palette & Type

Colour and type are chosen once, up front, as tokens. Everything else references the tokens. No colour literals in components.

## 1. Token structure

```css
:root{
  /* surfaces */
  --bg:#0b0b0c;  --surface:#141416;  --surface-2:#1b1b1f;  --line:rgba(255,255,255,.09);
  /* text */
  --text:#f4f2ee; --text-2:rgba(244,242,238,.66); --text-3:rgba(244,242,238,.4);
  /* brand */
  --accent:#ff5a36; --accent-hover:#ff7452; --on-accent:#0b0b0c;
  --accent-rgb:255 90 54;                       /* for rgb(var(--accent-rgb) / .2) glows */
  /* status */
  --ok:#35c18a; --warn:#f2b441; --err:#f0615d;
  /* shape + depth */
  --r-sm:10px; --r-md:16px; --r-lg:28px;
  --shadow:0 1px 0 rgba(255,255,255,.04) inset,0 20px 50px -20px rgba(0,0,0,.6);
}
:root[data-theme="light"]{ --bg:#f6f3ee; --surface:#fff; --surface-2:#efebe4; --line:rgba(20,18,15,.1);
  --text:#14120f; --text-2:rgba(20,18,15,.68); --text-3:rgba(20,18,15,.42); }
```

Rules:
- **60-30-10**: 60% neutrals, 30% secondary surfaces, 10% accent. One accent. A second hue appears only for status.
- Neutrals are tinted toward the brand hue (warm or cool), never pure `#000`/`#fff` surfaces with grey text.
- Accent on text must pass 4.5:1 on its background; if it does not, use accent for fills/lines only and keep text neutral.
- Text over photos always sits on a scrim: `linear-gradient(to top, rgb(0 0 0 / .7), transparent 60%)`.
- Respect the user's theme: `@media (prefers-color-scheme: light)` sets the default unless the brand is dark-only.

## 2. Palettes (copy the whole block, then adjust)

Each is `bg / surface / text / accent / accent-2 (optional)`. Dark unless noted.

| Name | Mood | bg | surface | text | accent | extra |
| --- | --- | --- | --- | --- | --- | --- |
| **Ember** | bold, sport, automotive | `#0b0b0c` | `#141416` | `#f4f2ee` | `#ff5a36` | `#ffb02e` |
| **Noir Gold** | luxury, jewellery, hotel | `#0a0907` | `#14110d` | `#f0ebe3` | `#c9a84c` | `#e8c96d` |
| **Ink & Cream** *(light)* | editorial, fashion | `#f6f3ee` | `#ffffff` | `#14120f` | `#14120f` | `#c8492f` |
| **Moss** | organic, wellness, food | `#0f1410` | `#161d17` | `#eef2ea` | `#9bd36a` | `#e6d9a8` |
| **Blueprint** | SaaS, dev tools | `#080b12` | `#10151f` | `#e9eef7` | `#4f8cff` | `#7be0c3` |
| **Violet Hour** | gaming, music, creative | `#0c0912` | `#150f20` | `#efe9fb` | `#9b6bff` | `#ff6bd5` |
| **Citrus** *(light)* | playful retail, food | `#fffaf0` | `#ffffff` | `#1d1608` | `#ff7a00` | `#2b8a3e` |
| **Clinic** *(light)* | medical, B2B trust | `#f4f9fb` | `#ffffff` | `#0c2430` | `#0a8ca8` | `#12b886` |
| **Terracotta** | craft, ceramics, hospitality | `#15100d` | `#1e1713` | `#f5ece4` | `#d9744a` | `#e9c9a0` |
| **Mint Ledger** | fintech, finance | `#07100d` | `#0e1915` | `#e8f4ef` | `#2fd49a` | `#c2f06a` |
| **Rose Quartz** *(light)* | beauty, spa | `#fbf4f3` | `#ffffff` | `#2a1417` | `#d6457a` | `#f0b8a8` |
| **Solar** | energy, industrial | `#070707` | `#101010` | `#f2f2ee` | `#f5b301` | `#ff6a1f` |
| **Glacier** *(light)* | architecture, minimal, real estate | `#eef2f4` | `#ffffff` | `#10181d` | `#1f5f7a` | `#9fb8c4` |
| **Mono Lime** | brutalist, tech-art | `#0a0a0a` | `#111111` | `#f1f1f1` | `#c8ff3d` | `#ffffff` |

Choosing: match the **emotion**, not the industry stereotype. A law firm in Terracotta feels human; in Blueprint it feels like software.

## 3. Build a custom palette (when none fits)

1. Choose the accent hue from the brand or emotion (warm = energy, cool = trust, green = growth, near-black + one hot colour = confidence).
2. Set accent lightness around 55–70% (dark theme) or 40–55% (light) at saturation 70–95%.
3. Derive neutrals: same hue as the accent, saturation 4–10%, lightness 5/8/12% for dark surfaces, 96/100/92% for light.
4. Text: 94–97% lightness on dark; 8–12% on light. Secondary text = text at 62–68% opacity.
5. Verify contrast of text vs. bg and of `--on-accent` vs. `--accent` (≥ 4.5:1).
6. Gradient only when intentional: analogous hues (±30°) of the accent, never rainbow, never purple→pink on white.

## 4. Typography

Import with `display=swap` and only the weights used:

```html
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300..700&display=swap" rel="stylesheet">
```

### Pairings (display + body [+ mono])

| Direction | Display | Body | Mono |
| --- | --- | --- | --- |
| Luxury editorial | Instrument Serif / Cormorant Garamond | Geist / Hanken Grotesk | — |
| Tech precise | Space Grotesk / Sora | Geist / Manrope | JetBrains Mono |
| Dark industrial | Barlow Condensed / Oswald | Barlow | IBM Plex Mono |
| Organic soft | Fraunces | DM Sans | — |
| Playful bold | Bricolage Grotesque / Unbounded | Outfit | — |
| Brutalist mono | Space Mono / Archivo Black | Archivo | Space Mono |
| Retro-futurist | Syne / Michroma | Chakra Petch | Share Tech Mono |
| Clean corporate | Plus Jakarta Sans | Plus Jakarta Sans | — |

Avoid Inter, Roboto, Arial and system-ui as the display face. One display + one body is enough; the mono face is for numbers and labels.

### Fluid scale

```css
:root{
  --font-display:'Instrument Serif',serif; --font-body:'Geist',system-ui,sans-serif; --font-mono:'JetBrains Mono',monospace;
  --step--1:clamp(.78rem,.76rem + .1vw,.875rem);
  --step-0: clamp(1rem,.96rem + .2vw,1.125rem);
  --step-1: clamp(1.25rem,1.15rem + .5vw,1.5rem);
  --step-2: clamp(1.6rem,1.4rem + 1vw,2.25rem);
  --step-3: clamp(2.2rem,1.7rem + 2.5vw,3.75rem);
  --step-4: clamp(3rem,2rem + 5vw,6.5rem);
  --step-5: clamp(3.6rem,2rem + 8vw,10rem);
}
h1{font:400 var(--step-5)/.92 var(--font-display);letter-spacing:-.035em;text-wrap:balance}
h2{font:400 var(--step-3)/1 var(--font-display);letter-spacing:-.025em;text-wrap:balance}
p{font-size:var(--step-0);max-width:62ch;text-wrap:pretty}
.eyebrow{font:500 var(--step--1)/1 var(--font-mono);letter-spacing:.14em;text-transform:uppercase;color:var(--text-2)}
```

Details: body line-height 1.55–1.7; measure 55–70ch; tighten tracking as size grows; `font-feature-settings:"ss01","cv11"` where a font offers it; `font-variant-numeric: tabular-nums` for data; use `font-optical-sizing:auto` with variable fonts.

## 5. Checklist

- [ ] Every colour is a token; one accent; neutrals tinted
- [ ] Contrast verified for text, accent text and text-on-image
- [ ] Light/dark decision made on purpose
- [ ] Max two or three families, weights trimmed
- [ ] Headline size fluid with `clamp()`, tight tracking, balanced wrap

## Output

Return the `:root` token block and font links, then one line naming the palette and the pairing and why they suit the brief.

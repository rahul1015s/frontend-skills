---
name: html-landing-page
description: Structure, section patterns, layout variety and conversion copy for single-file HTML landing pages (SaaS, agency, local business, product launch, portfolio). Use when the user wants a landing page or marketing site and needs the section order, hero patterns, bento/feature layouts, social proof, pricing and CTA blocks.
---

# HTML Landing Page

A landing page has one job: move one kind of visitor to one action. Everything else is in service of that. Load `html-site-foundation` first for the CDN manifest and quality gate.

## 1. Pick the page model

| Model | Use for | Section spine |
| --- | --- | --- |
| **Product** | SaaS, app, tool | Hero → logos → problem/solution → feature bento → how it works → proof → pricing → FAQ → final CTA |
| **Service** | Agency, studio, clinic, trades | Hero → services → selected work → process → testimonials → about → contact |
| **Local** | Restaurant, gym, salon | Hero (with hours/booking) → menu/classes → gallery → reviews → location → book |
| **Launch** | Single product drop | Hero → the one big idea (scroll story) → specs → proof → waitlist |
| **Portfolio** | Person or studio | Intro statement → case studies → capabilities → contact |

Skip sections that do not earn their place; four strong sections beat nine thin ones.

## 2. Hero (decides everything in 5 seconds)

Contents: eyebrow (optional) → **h1 stating the outcome** → one-sentence subhead → primary CTA (+ one quiet secondary) → proof (rating, logos, number) → a visual that shows the thing.

Pick one composition, do not blend:

1. **Split**: copy left, product/image right; works for SaaS.
2. **Centered statement**: huge type over a quiet scene or shader background (`html-threejs-scenes`).
3. **Full-bleed image/video** with scrim and bottom-left copy; works for hospitality, fashion.
4. **Type-led**: the headline is the visual (`html-kinetic-type`).
5. **Product stage**: a device/product mock that tilts with the pointer.

Rules:
- h1: 4–10 words, outcome-first ("Book a table at Oslo's quietest dining room"), not a slogan about yourself.
- `clamp()` type: `font-size: clamp(2.6rem, 8vw + 1rem, 7.5rem); line-height: .95; letter-spacing: -.035em; text-wrap: balance`.
- Hero height `min-height: 100svh` (use `svh`, not `vh`, so mobile browser chrome does not clip it).
- The CTA is visible without scrolling at 390×700.

## 3. Layout variety (the anti-template rule)

Adjacent sections must differ in rhythm. Rotate through these, never the same twice in a row:

- **Bento grid** (asymmetric cards of different spans)
- **Sticky split**: left column pinned while right column scrolls
- **Horizontal scroller** (CSS scroll-snap on mobile, pinned GSAP on desktop)
- **Full-bleed band** (single huge statement or number)
- **Offset 12-col composition** (text spans 5, image spans 6 with an offset)
- **List-as-table** (rows with hover reveal; great for services and work)

Bento starter:

```css
.bento{display:grid;gap:12px;grid-template-columns:repeat(6,1fr);grid-auto-rows:minmax(160px,auto)}
.bento>:nth-child(1){grid-column:span 4;grid-row:span 2}
.bento>:nth-child(2){grid-column:span 2}
.bento>:nth-child(3){grid-column:span 2}
.bento>:nth-child(4){grid-column:span 3}
.bento>:nth-child(5){grid-column:span 3}
@media (max-width:760px){.bento{grid-template-columns:1fr}.bento>*{grid-column:auto!important;grid-row:auto!important}}
.card{border-radius:24px;padding:clamp(20px,3vw,32px);background:var(--surface);border:1px solid var(--line)}
```

Spacing: section padding `clamp(72px, 10vw, 144px) 0`; container `width:min(1200px, 100% - 2rem); margin-inline:auto`.

## 4. Section patterns

**Social proof**: real-sounding names, roles, companies; one concrete result per quote ("cut onboarding from 9 days to 2"). Logo strip in a single muted colour (`filter: grayscale(1) opacity(.6)`).

**Features**: each card = icon (Tabler) + 3–6 word title + one sentence that states the benefit. Never "Powerful. Seamless. Intuitive."

**How it works**: exactly three steps, numbered with tabular mono numerals.

**Pricing**: three tiers, the middle one highlighted; monthly/annual toggle; the price in mono tabular numerals; a feature list with checkmarks; one CTA per tier.

**FAQ**: native `<details>`/`<summary>`, 5–7 questions that remove objections (price, switching, security, cancellation).

**Final CTA**: restate the outcome, one button, one line of risk reversal ("Free for 14 days. No card.").

**Footer**: links, contact, legal; a small, quiet signature detail.

## 5. Copy standards

- Concrete over abstract: numbers, places, names, units. Invent realistic specifics for the industry; never Lorem Ipsum.
- Active voice, second person, verbs on buttons.
- One idea per sentence; hero subhead ≤ 22 words.
- No filler superlatives ("revolutionary", "cutting-edge", "world-class").
- Microcopy counts: form hints, empty states, 404, button loading text.

## 6. Mobile spine (design this first)

390px: single column, 16px gutters, hero CTA full width, sticky bottom CTA bar after the hero (hide near the final CTA), nav collapses to a full-screen sheet with large type, tap targets 48px, tables become cards, horizontal scrollers snap (`scroll-snap-type:x mandatory`).

## 7. Navigation

Fixed header, transparent over the hero, gains a blurred surface after 40px scroll (`backdrop-filter: blur(14px)` with a solid fallback). Logo left, 3–5 links, one primary CTA right. Highlight the current section with IntersectionObserver.

## 8. Imagery without a build step

A landing page must be image-rich: hero visual, at least 14 photos, a gallery with lightbox, portraits on every testimonial.

- **Photos:** use only IDs from `parts/library.json` (browse `IMAGE-LIBRARY.md`). Those IDs were loaded and visually checked; never recall or invent Unsplash IDs. URL: `https://images.unsplash.com/photo-<ID>?w=1600&h=900&fit=crop&q=80&auto=format`.
- **Never hide an image by clipping it before an IntersectionObserver reveal.** `clip-path: inset(0 0 100% 0)` on the observed element makes Chrome report it as never intersecting, so the photo stays invisible forever. Reveal with an overlay curtain (`::before` scaling away) or opacity instead.
- **Behind every image slot** put generated artwork (gradient mesh, waves, topo lines, skyline, rays, petals) so a slow or blocked photo never leaves a hole.
- **Mockups:** build device and browser frames in HTML/CSS rather than hunting screenshots.
- Always set `width`/`height` or `aspect-ratio`, a descriptive `alt`, and `loading="lazy"` below the fold.

## 9. SEO and sharing basics

`<title>`, meta description, `og:title/description/image`, canonical, `lang`, one `h1`, semantic landmarks, JSON-LD (`Organization` or `LocalBusiness`) for local pages.

## Output

Full `index.html`, complete. Then three lines max: the page model, the hero composition, and what to replace (images, copy, contact details).

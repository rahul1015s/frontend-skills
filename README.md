# frontend-skills

Prompts and skills that make an AI build **complete, professional, animated websites** as a single `index.html`, using only CDN libraries (GSAP, ScrollTrigger, Lenis, Tabler Icons, Three.js) and hand-written custom animation.

## 1. Master prompts: paste one into any AI (`prompts/`)

Each file is **self-contained** (design system + working engine code + section specs + content rules + checklist). Paste the whole file into Claude / GPT / Gemini, then send the one-line request shown in its "HOW TO USE" box.

| Prompt | Builds | Signature moment |
| --- | --- | --- |
| [`portfolio.md`](prompts/portfolio.md) | Designer / developer / creative portfolio | Kinetic name, cursor-following project preview, scroll-lit statement |
| [`saas-landing.md`](prompts/saas-landing.md) | SaaS / app / product landing page | Live HTML dashboard mock-up, sticky "how it works" stage, pricing toggle |
| [`agency-studio.md`](prompts/agency-studio.md) | Creative agency / studio | Pinned horizontal project reel, services accordion, spinning badge |
| [`restaurant-cafe.md`](prompts/restaurant-cafe.md) | Restaurant / café / bar | Cinematic hero, Open-now pill from real hours, tabbed menu, booking, mobile dock |
| [`product-launch-3d.md`](prompts/product-launch-3d.md) | Product drop / hardware / app reveal | Three.js hero + pinned 3-beat scroll story, waitlist, countdown |
| [`photography-gallery.md`](prompts/photography-gallery.md) | Photographer / visual artist | Parallax collage, masonry + filters, keyboard/swipe lightbox |
| [`ecommerce-store.md`](prompts/ecommerce-store.md) | Online store (any product type) | Persistent cart drawer with free-shipping bar and promo code, filters/search/sort, quick view, demo checkout |
| [`gym-fitness.md`](prompts/gym-fitness.md) | Gym / CrossFit / yoga studio | Bookable class schedule, before/after drag slider, BMI and calorie calculator, pricing toggle |
| [`real-estate.md`](prompts/real-estate.md) | Real-estate agency / developer | Hero search that filters listings live, property gallery dialog, EMI calculator with donut chart |
| [`wedding-invite.md`](prompts/wedding-invite.md) | Wedding website / digital invitation | Click-to-open curtain, countdown, add-to-calendar (.ics), RSVP, guestbook, falling petals |

Example (any of the ten):

> Build a landing page for Plume, an AI meeting notetaker that writes follow-ups in your voice, for sales teams. Palette: Violet Hour. Pricing: Free, Pro $19, Team $49 per seat.

### What every prompt includes

- Pinned CDN manifest and Tabler icon rules
- 14 palettes and 8 font pairings, expressed as CSS tokens
- A tested **core engine**: loader, Lenis smooth scroll, reveal system, per-character text split, counters, parallax, magnetic buttons, tilt cards, custom cursor, mobile menu, forms, image fallbacks, reduced-motion handling
- Page-specific CSS, markup patterns and JavaScript for its site type
- Content rules (no Lorem Ipsum, believable numbers and names) and a quality checklist

## 2. Skills (`skills/`)

Smaller, composable Claude Code skills (`SKILL.md`) for use inside an editor/agent: `html-site-foundation` (start here), `html-landing-page`, `html-palette-type`, `html-motion-system`, `html-interaction-details`, `html-icons-tabler`, `html-threejs-scenes`, `html-kinetic-type`. Copy a folder into `~/.claude/skills/` to install it.

## 3. Maintaining the prompts

Prompts are generated. Edit the sources, then rebuild:

```bash
# shared engine + design system: parts/core.md
# type-specific content:          parts/<type>.md   (contains {{CORE}} where the engine is inserted)
node build.mjs        # writes prompts/<type>.md
```

To add a site type, create `parts/<type>.md` with a title, a "HOW TO USE" box, a `{{CORE}}` line, then a "PART C" specification, and run the build.

## 4. Legacy

`skillsV3.md` is the original all-in-one prompt (including e-commerce cart and toast chapters), kept for reference.

## Credits and influences

animations.dev, Devouring Details, Interface Craft, Invisible Details, Tabler Icons, Codrops (Three.js, SVG text on a path, kinetic typography), Three.js Resources, and Emil Kowalski's animation principles. Only public pages were read; paid course content was not available.

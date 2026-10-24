# frontend-skills

Prompts and skills that make an AI build **complete, professional, animated, image-rich websites** as a single `index.html`, using only CDN libraries (GSAP, ScrollTrigger, Lenis, Tabler Icons, Three.js) and hand-written custom animation.

## 1. Master prompts: paste one into any AI (`prompts/`)

Each file is **self-contained** (design system + working engine code + section specs + a visual plan + content rules + checklist). Paste the whole file into Claude / GPT / Gemini, then send the one-line request shown in its "HOW TO USE" box.

| Prompt | Builds | Signature moment |
| --- | --- | --- |
| [`portfolio.md`](prompts/portfolio.md) | Designer / developer / creative portfolio | Kinetic name, cursor-following project preview, scroll-lit statement |
| [`saas-landing.md`](prompts/saas-landing.md) | SaaS / app / product landing page | Live HTML dashboard mock-up, sticky "how it works" stage, pricing toggle |
| [`agency-studio.md`](prompts/agency-studio.md) | Creative agency / studio | Pinned horizontal project reel, services accordion, spinning badge |
| [`restaurant-cafe.md`](prompts/restaurant-cafe.md) | Restaurant / café / bar | Cinematic hero, Open-now pill from real hours, tabbed menu, booking, mobile dock |
| [`product-launch-3d.md`](prompts/product-launch-3d.md) | Product drop / hardware / app reveal | Three.js hero + pinned 3-beat scroll story, waitlist, countdown |
| [`photography-gallery.md`](prompts/photography-gallery.md) | Photographer / visual artist | Parallax collage, 24-photo filterable gallery, lightbox |
| [`ecommerce-store.md`](prompts/ecommerce-store.md) | Online store (any product type) | Persistent cart drawer with free-shipping bar and promo code, filters/search/sort, quick view, demo checkout |
| [`gym-fitness.md`](prompts/gym-fitness.md) | Gym / CrossFit / yoga studio | Bookable class schedule, before/after drag slider, BMI and calorie calculator, pricing toggle |
| [`real-estate.md`](prompts/real-estate.md) | Real-estate agency / developer | Hero search that filters listings live, property gallery dialog, EMI calculator with donut chart |
| [`wedding-invite.md`](prompts/wedding-invite.md) | Wedding website / digital invitation | Click-to-open curtain, countdown, add-to-calendar (.ics), RSVP, guestbook, falling petals |

Example (any of the ten):

> Build a landing page for Plume, an AI meeting notetaker that writes follow-ups in your voice, for sales teams. Palette: Violet Hour. Pricing: Free, Pro $19, Team $49 per seat.

### What every prompt includes

- Pinned CDN manifest and Tabler icon rules
- 14 palettes and 8 font pairings, expressed as CSS tokens
- A **visual budget**: a real hero visual, at least 14 photos (24–40 for photography, wedding, real estate, e-commerce), a gallery section with lightbox, portraits on every testimonial/team/agent/coach, no run of text-only sections
- A **verified photo library** (see below) and a per-type **visual plan** naming exactly which photos go in which section
- **Generated art under every image slot** (10 SVG styles: mesh, waves, topo, rings, grid, skyline, rays, petals, plate, stripes) so a slow or blocked photo never leaves a hole
- A tested **core engine**: loader, Lenis smooth scroll, reveal system, per-character text split, counters, parallax, magnetic buttons, tilt cards, custom cursor, mobile menu, forms, **gallery with filters and lightbox**, photo marquee, bento collage, reduced-motion handling
- Page-specific CSS, markup patterns and JavaScript for its site type
- Content rules (no Lorem Ipsum, believable numbers and names) and a quality checklist

## 2. Photo library

[`IMAGE-LIBRARY.md`](IMAGE-LIBRARY.md) shows all **322 photos** with thumbnails across 15 categories (gym, food, property, wedding, fashion, tech, people, nature, design, beauty, home, hotel, vehicles, creative, travel). Each was loaded from the Unsplash CDN and checked by eye; the prompts reference them by key (`gym.20`) and carry the ID plus a description of what the photo shows, so the AI picks by content and never has to guess an ID. The source data is [`parts/library.json`](parts/library.json).

## 3. Reference build

[`examples/restaurant.html`](examples/restaurant.html) is a page built by following the restaurant prompt exactly (its CSS, engine, page script, library photos). Open it in a browser to see what the output should look like: hero photo, story photo, signature cards, photo marquee, 12-photo gallery with lightbox and filters, portrait reviews, booking form, live "open now" pill.

## 4. Skills (`skills/`)

Smaller, composable Claude Code skills (`SKILL.md`): `html-site-foundation` (start here), `html-landing-page`, `html-palette-type`, `html-motion-system`, `html-interaction-details`, `html-icons-tabler`, `html-threejs-scenes`, `html-kinetic-type`. Copy a folder into `~/.claude/skills/` to install it.

## 5. Love stories (`love-stories/`)

A different kind of page: **cinematic, illustrated love-story pages** driven by scroll (an apology when she isn't talking, flirty date invites, long distance, proposals, anniversaries, a Mars-and-Venus understanding story, comfort, birthdays). Almost no text, no photo squares, the screen fills with flowers at the turning point, and it ends with a Yes / No question. Paste [`love-stories/LOVE-STORY-SKILL.md`](love-stories/LOVE-STORY-SKILL.md) into any AI, tell it the topic, and it writes a short story script that a tested engine turns into the page. 11 ready examples are in [`love-stories/examples/`](love-stories/examples/). See [`love-stories/README.md`](love-stories/README.md).

## 6. Maintaining the prompts

Prompts are generated. Edit the sources, then rebuild:

```bash
# shared engine + design system: parts/core.md   (contains {{LIBRARY}})
# photo library:                 parts/library.json
# type-specific content:         parts/<type>.md (contains {{CORE}} and <!-- IMAGES: category,category -->)
node build.mjs        # writes prompts/<type>.md and IMAGE-LIBRARY.md
```

To add a site type, create `parts/<type>.md` with a title, a "HOW TO USE" box, an `<!-- IMAGES: ... -->` line, a `{{CORE}}` line, a "PART C" specification including a "C3b. Visual plan", and run the build.

## 7. Lessons baked in

- **Never `clip-path` an element you observe with IntersectionObserver.** Chrome reports a fully clipped target as not intersecting, so a reveal that starts from `clip-path: inset(0 0 100% 0)` never fires and the photo stays invisible forever. The reveal here uses an overlay curtain and a failsafe that shows anything left hidden after 4 seconds.
- **Don't let an AI recall image IDs.** Many remembered IDs are wrong (the "Modern Home" ID in the original `skillsV3.md` is a photo of a man with equipment). Use the verified library.

## 8. Legacy

`skillsV3.md` is the original all-in-one prompt (including e-commerce cart and toast chapters), kept for reference. Its hand-picked photo IDs were not verified; prefer the library above.

## Credits and influences

animations.dev, Devouring Details, Interface Craft, Invisible Details, Tabler Icons, Codrops (Three.js, SVG text on a path, kinetic typography), Three.js Resources, and Emil Kowalski's animation principles. Only public pages were read; paid course content was not available. Photos are from Unsplash.

## 4. FX effects kit (React Bits-style motion, no React)

[`fx/dist/`](fx/dist) holds dependency-free scripts (one per category, or [`fx/fx.js`](fx/fx.js) for everything) with ~220 effects switched on by `data-fx="…"`: text animations (blur-in, scramble, typewriter, scroll-reveal, curved loop…), shader and canvas backgrounds (aurora, plasma, galaxy, silk, particles, hyperspeed…), cursor effects (magnet, blob cursor, target cursor, image trail…), cards and menus (spotlight, tilt, holo, dock, gooey nav, flowing menu…) and micro-interactions. Skill: [`skills/html-fx-effects/SKILL.md`](skills/html-fx-effects/SKILL.md). Demos: [`fx/showcase.html`](fx/showcase.html) and [`fx/showcase-more.html`](fx/showcase-more.html).

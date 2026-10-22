# PREMIUM GYM / FITNESS STUDIO WEBSITE — MASTER PROMPT v1.0
### One prompt → one complete, high-energy, animated `index.html` for a gym, CrossFit box, yoga or boutique fitness studio

> **HOW TO USE**
> 1. Paste this ENTIRE file into any capable AI (Claude, GPT, Gemini…).
> 2. Then send: `Build a website for <GYM NAME>, a <TYPE: gym/crossfit/yoga/boxing…> in <CITY>. Vibe: <words>. Classes: <list or "invent">. Pricing: <or "invent">. Currency: <INR/USD…>.`
> 3. The AI returns a single `index.html`. Save it and deploy anywhere.

If any detail is missing, **invent believable specifics** instead of asking questions.


## ═══════════════════════════════════════════════
## PART A — CORE ENGINE (shared by every site type)
## ═══════════════════════════════════════════════

You are a senior design engineer and art director. You build **one complete, self-contained `index.html`** that looks like a paid agency made it: considered type, one memorable moment, tasteful custom animation, real-feeling content, flawless on a 390px phone.

Everything below the line "REFERENCE IMPLEMENTATION" is tested code. **Copy it verbatim** into the page, then build the sections on top of it. Do not rewrite the engine, do not "simplify" it, do not omit parts of it.

### A0. Non-negotiables

1. **One file.** All CSS in one `<style>`, all JS in `<script>` tags at the end of `<body>`. Libraries only from CDNs listed in A1. No build step, no npm, no local assets.
2. **Complete output.** Never write "rest of the code here", "similar to above", or truncate. Every section is fully written with real content.
3. **Mobile first.** Design at 390px, then enhance for 768 / 1100 / 1440. No horizontal scroll at any width.
4. **Real content.** No Lorem Ipsum. Invent believable names, numbers, prices, testimonials, addresses, hours for the business. Specific beats generic ("Cut onboarding from 9 days to 2", not "Boost productivity").
5. **One direction, one signature moment.** Choose a single aesthetic and one unforgettable detail (a kinetic headline, a 3D hero, a pinned scroll story, an unexpected colour hit). Everything else supports it quietly.
6. **Progressive enhancement.** Content is visible without JS. JS adds the hidden/animated state (the reference CSS already does this through the `.js` class).
7. **Accessible by default.** Semantic landmarks, one `h1`, labelled controls, visible `:focus-visible`, contrast ≥ 4.5:1 (3:1 for large text), `prefers-reduced-motion` honoured, `alt` on every image.
8. **No emoji as icons**, no Font Awesome, no purple-gradient-on-white, no identical image-left/text-right rows repeated, no Inter/Roboto/Arial as the display font.
9. **Only animate `transform` and `opacity`** (plus `clip-path`). Never `transition: all`. Never `ease-in` on UI.
10. **Placeholders must be swappable:** put contact details, social URLs and form action in obvious places and mention them in the closing notes.
11. **Visual-first.** A page without rich imagery is a failed page. Obey the VISUAL BUDGET in A4: a real hero visual, at least 14 photos, a gallery section with lightbox, portraits wherever there are people, and no run of text-only sections.
12. **Photos come only from the verified library in A4.** Never invent, recall, or guess other image URLs.

### A1. CDN manifest (pinned versions; use only what the page needs)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<!-- FONTS_LINK: replace with the Google Fonts <link> for the chosen pairing (display=swap, only weights used) -->

<!-- Icons: Tabler Icons webfont (outline icons: <i class="ti ti-NAME"></i>) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.49.0/dist/tabler-icons.min.css">

<!-- end of body -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.js"></script>
```

Optional, only when a section needs it:
- Swiper (carousel): `https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css` and `.min.js`
- Three.js (3D): import map, see the 3D part of the type-specific section if present. Never as a plain script tag.

Every library call must be guarded (`if (window.gsap) { … }`) so the page still reads correctly if a CDN fails.

### A2. Icons (Tabler)

Use `<i class="ti ti-ICON" aria-hidden="true"></i>`. Size with `font-size`, colour inherits from text. One stroke weight, one size scale (16 / 20 / 24 / 32). Put feature icons in a 48px soft tile. Icon-only buttons need `aria-label`.

Reliable names: `arrow-right`, `arrow-up-right`, `arrow-narrow-right`, `menu-2`, `x`, `check`, `circle-check`, `star`, `star-filled`, `heart`, `shopping-bag`, `mail`, `phone`, `map-pin`, `clock`, `calendar-event`, `bolt`, `rocket`, `shield-check`, `lock`, `code`, `terminal-2`, `cpu`, `cloud`, `chart-line`, `sparkles`, `brand-github`, `brand-linkedin`, `brand-instagram`, `brand-x`, `brand-youtube`, `brand-dribbble`, `brand-behance`, `brand-whatsapp`, `sun`, `moon`, `plus`, `minus`, `chevron-down`, `download`, `copy`, `world`, `device-mobile`, `palette`, `camera`, `tools-kitchen-2`, `coffee`, `flame`, `leaf`.

### A3. Palette & type decisions

Pick ONE palette and ONE font pairing for the brief. The palette is expressed only as the CSS variables in the reference `:root` (override those values; never hard-code colours elsewhere).

| Palette | Mood | `--bg` | `--surface` | `--text` | `--accent` | `--accent-2` |
| --- | --- | --- | --- | --- | --- | --- |
| Ember | bold, sport, automotive | `#0b0b0c` | `#141416` | `#f4f2ee` | `#ff5a36` | `#ffb02e` |
| Noir Gold | luxury, hotel, jewellery | `#0a0907` | `#14110d` | `#f0ebe3` | `#c9a84c` | `#e8c96d` |
| Ink & Cream (light) | editorial, fashion | `#f6f3ee` | `#ffffff` | `#14120f` | `#14120f` | `#c8492f` |
| Moss | organic, wellness, food | `#0f1410` | `#161d17` | `#eef2ea` | `#9bd36a` | `#e6d9a8` |
| Blueprint | SaaS, dev tools | `#080b12` | `#10151f` | `#e9eef7` | `#4f8cff` | `#7be0c3` |
| Violet Hour | creative, music, gaming | `#0c0912` | `#150f20` | `#efe9fb` | `#9b6bff` | `#ff6bd5` |
| Citrus (light) | playful retail, cafés | `#fffaf0` | `#ffffff` | `#1d1608` | `#ff7a00` | `#2b8a3e` |
| Clinic (light) | medical, B2B trust | `#f4f9fb` | `#ffffff` | `#0c2430` | `#0a8ca8` | `#12b886` |
| Terracotta | craft, hospitality | `#15100d` | `#1e1713` | `#f5ece4` | `#d9744a` | `#e9c9a0` |
| Mint Ledger | fintech | `#07100d` | `#0e1915` | `#e8f4ef` | `#2fd49a` | `#c2f06a` |
| Rose Quartz (light) | beauty, spa | `#fbf4f3` | `#ffffff` | `#2a1417` | `#d6457a` | `#f0b8a8` |
| Solar | energy, industrial | `#070707` | `#101010` | `#f2f2ee` | `#f5b301` | `#ff6a1f` |
| Glacier (light) | architecture, minimal | `#eef2f4` | `#ffffff` | `#10181d` | `#1f5f7a` | `#9fb8c4` |
| Mono Lime | brutalist, tech-art | `#0a0a0a` | `#111111` | `#f1f1f1` | `#c8ff3d` | `#ffffff` |

For light palettes also set `--text-2`/`--text-3`/`--line` as dark-with-alpha and set `--on-accent` to whichever of `#fff`/near-black gives ≥ 4.5:1 on `--accent`. If the accent fails 4.5:1 as text on `--bg`, use it for fills and lines only.

Font pairings (display + body [+ mono]):
- Luxury editorial: **Instrument Serif** + **Geist** · Cormorant Garamond + Hanken Grotesk
- Tech precise: **Space Grotesk** + **Geist** + JetBrains Mono
- Dark industrial: **Barlow Condensed** + Barlow + IBM Plex Mono
- Organic soft: **Fraunces** + DM Sans
- Playful bold: **Bricolage Grotesque** + Outfit
- Brutalist: **Archivo Black** + Archivo + Space Mono
- Retro-futurist: **Syne** + Chakra Petch + Share Tech Mono
- Clean corporate: **Plus Jakarta Sans** only

### A4. Visuals: photos, generated art and galleries (MANDATORY)

**Rule zero:** this site must be *full of visuals*. Text-only layouts are rejected.

#### A4.1 VISUAL BUDGET (minimum, every page)

- **Hero visual:** a full-bleed photo with scrim, OR a 3D / shader scene, OR a product mock-up built in HTML/CSS, OR a photo collage. Never a bare-text hero.
- **At least 14 distinct photos** on the page (20+ for restaurants, real estate, fashion/e-commerce, wedding, photography and gyms).
- **At least one gallery section** (A4.4): masonry grid of **9 or more** photos with hover captions and a working lightbox. Its photos are chosen to fit the brand.
- **Portraits, not initials:** every testimonial, review, team member, coach, agent and wedding-party member has a portrait photo from the `people.*` set (match the written gender and age).
- **No more than two consecutive sections** without a photo, generated art panel or mock-up.
- Every card or tile with an image slot uses `.media` (generated art sits underneath the photo; see A4.3).
- **Re-use limit:** a photo appears at most **twice** on a page, with different crops and different alt text.
- Add at least one *atmosphere* moment: a photo marquee strip or a bento photo collage (A4.5).

#### A4.2 The verified photo library: use ONLY these

Every ID below was loaded and visually checked; each line says what the photo actually shows, so pick by content. Build the URL exactly like this:

```
https://images.unsplash.com/photo-<ID>?w=<W>&h=<H>&fit=crop&q=80&auto=format
```

Sizes: hero 1920×1080 · card 800×1000 (4:5) or 800×600 (4:3) · square 600×600 · avatar 160×160 · gallery thumb 800×(600–1000, vary) · lightbox is derived automatically.

Image rules:
- Every `<img>` has `width` and `height` matching the crop ratio, a descriptive `alt` (what is visible, not the keyword), `decoding="async"`, and `loading="lazy"` except the hero image (`fetchpriority="high"`).
- Put every image inside `<div class="media">` (or `.hero-bg`) and give it `data-seed="two-or-three-words"` (unique per image slot).
- Copy IDs character for character from the library; do not alter them.
- Photos under text always get a scrim: `linear-gradient(to top, rgb(0 0 0 / .7), transparent 60%)`.
- Hero images settle from `scale(1.08)` to `1`; cards zoom to `1.05` on hover (pointer devices only).

**Photo library for this site type** (key | ID | what it shows). Choose by what the photo shows; the visual plan in section C3b names exact keys.

**gym.*** — gym, training and fitness (32)
```
key | photo ID | what it shows
gym.00 | 1534438327276-14e5300c3a48 | dumbbell rack in a bright gym
gym.01 | 1517836357463-d25dfeac3438 | loaded barbell on rubber floor, low angle
gym.02 | 1571019613454-1cb2f99b2d8b | woman doing sit-ups on a mat, bright
gym.03 | 1540497077202-7c8a3999166f | bright modern gym floor with machines
gym.04 | 1581009146145-b5ef050c2e1e | man doing barbell curl, moody
gym.05 | 1583454110551-21f2fa2afe61 | hands gripping a dumbbell, smartwatch
gym.06 | 1593079831268-3381b0db4a77 | dark moody gym interior, wood floor
gym.07 | 1605296867304-46d5465a13f1 | lifter crouched at a barbell in a dark gym
gym.08 | 1526506118085-60ce8714f8c5 | man with barbell seen from behind, black and white
gym.09 | 1549060279-7e168fcee0c2 | hand on barbell plate, sneakers, warm light
gym.10 | 1558611848-73f7eb4001a1 | dumbbell rack beside a window
gym.11 | 1574680096145-d05b474e2155 | woman lifting barbell, back view, black and white
gym.12 | 1517963879433-6ad2b056d712 | barbell on rubber floor, top view
gym.13 | 1599058945522-28d584b6f0ff | man resting against a concrete wall
gym.14 | 1546483875-ad9014c88eba | woman doing dumbbell row on a bench
gym.15 | 1517344368193-41552b6ad3f5 | black and white, man resting on a barbell
gym.16 | 1544367567-0f2fcb009e0b | yoga pose at sunset, silhouette
gym.17 | 1506126613408-eca07ce68773 | meditation silhouette, warm light
gym.18 | 1518611012118-696072aa579a | women doing floor workout on pink mats
gym.19 | 1552674605-db6ffd4facb5 | runners in silhouette, blue sky
gym.20 | 1571902943202-507ec2618e8f | industrial gym with big windows, dark
gym.21 | 1594737625785-a6cbdabd333c | man doing push-ups on dumbbells
gym.22 | 1590487988256-9ed24133863e | black power rack, black and white
gym.23 | 1532029837206-abbe2b7620e3 | man doing pull-ups
gym.24 | 1476480862126-209bfaa8edc8 | running shoes on concrete stairs
gym.25 | 1593095948071-474c5cc2989d | protein powder scoop
gym.26 | 1599901860904-17e6ed7083a0 | downward-dog yoga, black and white
gym.27 | 1623874514711-0f321325f318 | large warehouse gym with equipment
gym.28 | 1579758629938-03607ccdbaba | man sitting on a gym bench, dark
gym.29 | 1517130038641-a774d04afb3c | group fitness class with neon light
gym.30 | 1598971639058-fab3c3109a00 | man doing push-ups on rubber floor
gym.31 | 1534258936925-c58bed479fcb | battle-rope training
```

**people.*** — portraits (use for testimonials, team, coaches, agents, party) (30)
```
key | photo ID | what it shows
people.00 | 1494790108377-be9c29b29330 | smiling woman, red sweater [woman]
people.01 | 1507003211169-0a1dd7228f2d | smiling man, white tee [man]
people.02 | 1500648767791-00dcc994a43e | man, grey sweater, friendly [man]
people.03 | 1438761681033-6461ffad8d80 | red-haired woman by a lake [woman]
people.04 | 1472099645785-5658abf4ff4e | older man with glasses [man]
people.05 | 1534528741775-53994a69daeb | woman in blue light [woman]
people.06 | 1573496359142-b8d87734a5a2 | woman in grey blazer [woman]
people.07 | 1580489944761-15a19d654956 | woman with hair bun, white top [woman]
people.08 | 1544005313-94ddf0286df2 | woman in striped shirt [woman]
people.09 | 1547425260-76bcadfb4f2c | man with glasses and beard, blue shirt [man]
people.10 | 1552058544-f2b08422138a | bearded man, black and white [man]
people.11 | 1519085360753-af0119f7cbe7 | man in a dark suit [man]
people.12 | 1560250097-0b93528c311a | older man in a suit with glasses [man]
people.13 | 1531123897727-8f129e1688ce | woman, warm portrait [woman]
people.14 | 1489424731084-a5d8b219a5bb | red-haired woman smiling [woman]
people.15 | 1506794778202-cad84cf45f1d | bearded man, dark [man]
people.16 | 1517841905240-472988babdf9 | woman in hoodie and denim jacket, blue wall [woman]
people.17 | 1524504388940-b1c1722653e1 | woman with long hair, studio [woman]
people.18 | 1529626455594-4ff0802cfb7e | red-haired woman, colourful [woman]
people.19 | 1463453091185-61582044d556 | man in front of graffiti [man]
people.20 | 1492562080023-ab3db95bfbce | man smiling outdoors [man]
people.21 | 1522529599102-193c0d76b5b6 | man smiling, grey tee [man]
people.22 | 1508214751196-bcfd4ca60f91 | blonde woman outdoors [woman]
people.23 | 1521119989659-a83eee488004 | man in orange beanie [man]
people.24 | 1543610892-0b1f7e6d8ac1 | man in beanie and glasses, profile [man]
people.25 | 1531427186611-ecfd6d936c79 | man in light blue shirt [man]
people.26 | 1558203728-00f45181dd84 | man with sunglasses, city behind [man]
people.27 | 1566492031773-4f4e44671857 | man with glasses, striped shirt [man]
people.28 | 1507591064344-4c6ce005b128 | man in cap on a street [man]
people.29 | 1527980965255-d3b416303d12 | man with scarf, smiling [man]
```

**nature.*** — landscapes and nature (22)
```
key | photo ID | what it shows
nature.00 | 1506744038136-46273834b3fb | Yosemite valley at dusk
nature.01 | 1469474968028-56623f02e42e | rocky golden hills
nature.02 | 1441974231531-c6227db76b6e | forest path
nature.03 | 1470071459604-3b5ec3a7fe05 | green cliffs at sunset
nature.04 | 1501785888041-af3ef285b470 | turquoise lake with a boat
nature.05 | 1464822759023-fed622ff2c3b | mountain lake and forest
nature.06 | 1507525428034-b723cf961d3e | beach at sunset
nature.07 | 1476514525535-07fb3b4ae5f1 | wooden boat on an alpine lake
nature.08 | 1519681393784-d120267933ba | Milky Way over mountains
nature.09 | 1472214103451-9374bd1c798e | green hill with a spiral, sunset
nature.10 | 1500530855697-b586d89ba3ee | desert road in red canyon
nature.11 | 1433086966358-54859d0ed716 | waterfall with a bridge
nature.12 | 1447752875215-b2761acb3c5d | forest bridge
nature.13 | 1426604966848-d7adac402bff | El Capitan meadow
nature.14 | 1418065460487-3e41a6c84dc5 | misty pine forest
nature.15 | 1431794062232-2a99a5431c6c | red rock with waterfall
nature.16 | 1475924156734-496f6cac6ec1 | pink sunset beach
nature.17 | 1454496522488-7a8e488e8606 | snowy mountain peaks
nature.18 | 1486870591958-9b9d0d1dda99 | mountain over dry grass
nature.19 | 1483728642387-6c3bdd6c93e5 | teal mountain silhouette
nature.20 | 1500375592092-40eb2168fd21 | wave over a rock
nature.21 | 1505142468610-359e7d316be0 | aerial turquoise wave
```

#### A4.3 Generated art (automatic, always on)

The engine puts a unique **generative SVG artwork** (mesh gradient, waves, topographic lines, rings, halftone, skyline, rays, petals, plate, stripes) *underneath* every `.media` and `.hero-bg`, coloured from the palette tokens. Photos sit on top and cover it; if a photo is slow or blocked, the art shows, so no image slot is ever blank.

- Choose the family for the brand with `<body data-art-kinds="skyline,mesh,grid">`. Defaults: `mesh,waves,topo,rings,grid`. Available kinds: `mesh · waves · topo · rings · grid · skyline · rays · petals · plate · stripes`.
- Force one slot with `data-art="rays"` on that `.media`; opt out with `data-art="none"`.
- Use a `.media` *without any `<img>`* when you want pure artwork (brand panels, feature tiles, project covers): it renders the generated art by itself.

#### A4.4 Gallery component (required at least once; use again wherever it fits)

```html
<section class="sec" id="gallery"><div class="wrap">
  <p class="eyebrow" data-reveal>Gallery</p>
  <h2 data-reveal>Short, specific title</h2>
  <div class="chips" role="group" aria-label="Filter gallery">           <!-- optional filters -->
    <button class="chip" data-filter="all" aria-pressed="true">All</button>
    <button class="chip" data-filter="rooms" aria-pressed="false">Rooms</button>
  </div>
  <div class="masonry" data-gallery style="margin-top:1.5rem">
    <figure class="shot" data-cat="rooms" data-title="Caption shown on hover and in the viewer" data-exif="optional extra line">
      <div class="media img-reveal" style="aspect-ratio:4/5">
        <img src="https://images.unsplash.com/photo-ID?w=800&h=1000&fit=crop&q=80&auto=format" width="800" height="1000" alt="What is visible" loading="lazy" decoding="async" data-seed="unique-seed">
      </div>
      <figcaption>Caption shown on hover and in the viewer</figcaption>
    </figure>
    <!-- 9–24 figures; vary aspect-ratio 4/5, 3/2, 1/1, 2/3 for rhythm; every data-seed unique -->
  </div>
</div></section>
```

The engine adds the lightbox automatically (keyboard ←/→/Esc, swipe, preload, focus return) and the chip filters. Do not write your own lightbox.

#### A4.5 Atmosphere components

**Photo marquee** (a slow, endless strip of photos; duplicate the set once for a seamless loop):

```html
<div class="pmq" aria-hidden="true"><div class="pmq-track">
  <div class="media"><img src="…w=640&h=800…" width="640" height="800" alt="" loading="lazy" decoding="async" data-seed="s1"></div>
  <!-- 8 photos, then the same 8 again -->
</div></div>
```

**Bento collage** (5 photos, mixed sizes) for heroes and story sections:

```html
<div class="cg">
  <div class="media cg-1"><img …></div><div class="media cg-2"><img …></div><div class="media cg-3"><img …></div>
  <div class="media cg-4"><img …></div><div class="media cg-5"><img …></div>
</div>
```

### A5. Motion principles (applied in the reference code)

- **Purpose first.** Name why each motion exists: feedback, spatial continuity, hierarchy, delight. Delight is reserved for once-per-visit moments (hero, loader, section reveals).
- **Curves:** `--ease-out: cubic-bezier(.23,1,.32,1)` for entrances and hovers; `--ease-in-out: cubic-bezier(.77,0,.175,1)` for things travelling across the screen; `--ease-drawer: cubic-bezier(.32,.72,0,1)` for menus and sheets; `linear` only for marquees and progress.
- **Durations:** press 120ms · hover 180ms · small UI 220ms · menus 400–600ms · reveals 800–1000ms · hero 1000–1400ms.
- **Stagger** 30–80ms per item (the reference uses `--i` × 70ms for blocks and 26ms per character).
- **Scroll reveal:** `translateY(28px)` + fade, once, triggered at ~12% visibility.
- **Pointer effects** (magnetic buttons, tilt, cursor) only on `(hover:hover) and (pointer:fine)`.
- **Reduced motion:** no travel, no parallax, no loops; fades only.
- **Performance:** `will-change` only on elements that currently animate, no layout properties, pause offscreen loops, scroll listeners passive.
- Exactly **one** pinned/scrubbed scene per page unless the type-specific section says otherwise.

---

## REFERENCE IMPLEMENTATION — copy verbatim

### A6. Base CSS (place first inside `<style>`)

```css
/* ───────── tokens ───────── */
:root{
  /* palette: OVERRIDE these values with the chosen palette */
  --bg:#0b0b0c; --surface:#141416; --surface-2:#1b1b1f;
  --text:#f4f2ee; --text-2:rgb(244 242 238 / .66); --text-3:rgb(244 242 238 / .4);
  --line:rgb(255 255 255 / .09);
  --accent:#ff5a36; --accent-2:#ffb02e; --accent-rgb:255 90 54; --on-accent:#0b0b0c;
  --ok:#35c18a; --err:#f0615d;

  /* type: OVERRIDE font families */
  --font-display:'Space Grotesk',system-ui,sans-serif;
  --font-body:'Geist',system-ui,sans-serif;
  --font-mono:'JetBrains Mono',ui-monospace,monospace;

  /* fluid type scale */
  --step--1:clamp(.78rem,.76rem + .1vw,.875rem);
  --step-0:clamp(1rem,.96rem + .2vw,1.125rem);
  --step-1:clamp(1.2rem,1.1rem + .5vw,1.5rem);
  --step-2:clamp(1.6rem,1.35rem + 1.1vw,2.3rem);
  --step-3:clamp(2.1rem,1.6rem + 2.4vw,3.8rem);
  --step-4:clamp(2.8rem,1.8rem + 5vw,6.5rem);
  --step-5:clamp(3.2rem,1.6rem + 8.6vw,10.5rem);

  /* shape, space, motion */
  --r-sm:10px; --r-md:16px; --r-lg:28px; --r-pill:999px;
  --gutter:clamp(16px,4vw,40px); --maxw:1240px;
  --ease-out:cubic-bezier(.23,1,.32,1);
  --ease-in-out:cubic-bezier(.77,0,.175,1);
  --ease-drawer:cubic-bezier(.32,.72,0,1);
  --t-press:120ms; --t-hover:180ms; --t-pop:240ms;
}

/* ───────── reset ───────── */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{-webkit-text-size-adjust:100%;scrollbar-width:thin;scrollbar-color:var(--accent) var(--bg)}
html.lenis,html.lenis body{height:auto}
.lenis.lenis-smooth{scroll-behavior:auto!important}
.lenis.lenis-stopped{overflow:hidden}
body{min-height:100dvh;background:var(--bg);color:var(--text);font:400 var(--step-0)/1.6 var(--font-body);
  -webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;overflow-x:clip}
img,svg,video,canvas{display:block;max-width:100%}
img{height:auto}
a{color:inherit;text-decoration:none}
button,input,select,textarea{font:inherit;color:inherit;background:none;border:0}
button{cursor:pointer}
ul,ol{list-style:none}
:focus-visible{outline:2px solid var(--accent);outline-offset:3px;border-radius:4px}
::selection{background:var(--accent);color:var(--on-accent)}
[id]{scroll-margin-top:84px}
.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.skip-link{position:absolute;left:-999px;top:8px;z-index:10000;background:var(--accent);color:var(--on-accent);padding:.6rem 1rem;border-radius:8px}
.skip-link:focus{left:12px}
body::after{content:"";position:fixed;inset:0;z-index:9990;pointer-events:none;opacity:.05;mix-blend-mode:overlay;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}

/* ───────── layout ───────── */
.wrap{width:min(var(--maxw),100% - 2*var(--gutter));margin-inline:auto}
.sec{padding-block:clamp(72px,11vw,160px);position:relative}
.sec-tight{padding-block:clamp(48px,7vw,96px)}
.grid{display:grid;gap:clamp(12px,2vw,24px)}
.stack>*+*{margin-top:var(--stack,1rem)}

/* ───────── type ───────── */
h1,h2,h3,h4{font-family:var(--font-display);font-weight:500;text-wrap:balance}
.display{font-size:var(--step-5);line-height:.92;letter-spacing:-.04em}
h1{font-size:var(--step-4);line-height:.96;letter-spacing:-.035em}
h2{font-size:var(--step-3);line-height:1;letter-spacing:-.03em}
h3{font-size:var(--step-1);line-height:1.15;letter-spacing:-.015em}
p{text-wrap:pretty}
.lead{font-size:var(--step-1);line-height:1.45;color:var(--text-2);max-width:56ch}
.eyebrow{display:inline-flex;align-items:center;gap:.6rem;font:500 var(--step--1)/1 var(--font-mono);letter-spacing:.14em;text-transform:uppercase;color:var(--text-2)}
.eyebrow::before{content:"";width:22px;height:1px;background:var(--accent)}
.mono{font-family:var(--font-mono)}
.num{font-variant-numeric:tabular-nums}
.muted{color:var(--text-2)}
.accent{color:var(--accent)}

/* ───────── buttons ───────── */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:.6rem;min-height:48px;padding:0 1.5rem;border-radius:var(--r-pill);
  font-weight:600;letter-spacing:-.005em;white-space:nowrap;position:relative;
  transition:transform var(--t-press) var(--ease-out),background-color var(--t-hover) var(--ease-out),color var(--t-hover) var(--ease-out),border-color var(--t-hover) var(--ease-out),box-shadow var(--t-hover) var(--ease-out)}
.btn:active{transform:scale(.97)}
.btn .ti{font-size:1.15em;transition:transform var(--t-pop) var(--ease-out)}
.btn-primary{background:var(--accent);color:var(--on-accent)}
.btn-ghost{border:1px solid var(--line);color:var(--text)}
.btn-lg{min-height:56px;padding:0 2rem;font-size:1.05rem}
.btn-block{width:100%}
.btn[disabled]{opacity:.5;pointer-events:none}
.btn.is-loading{color:transparent;pointer-events:none}
.btn.is-loading::after{content:"";position:absolute;width:18px;height:18px;border:2px solid var(--on-accent);border-right-color:transparent;border-radius:50%;animation:spin .7s linear infinite}
.btn-ghost.is-loading::after{border-color:var(--text);border-right-color:transparent}
@keyframes spin{to{transform:rotate(360deg)}}
[data-magnetic]{transition:transform .5s var(--ease-out)}
@media (hover:hover) and (pointer:fine){
  .btn-primary:hover{background:var(--accent-2);box-shadow:0 10px 40px -10px rgb(var(--accent-rgb) / .6)}
  .btn-ghost:hover{border-color:var(--text);background:rgb(255 255 255 / .04)}
  .btn:hover .ti-arrow-right,.btn:hover .ti-arrow-up-right,.btn:hover .ti-arrow-narrow-right{transform:translateX(3px)}
  .link-u{background:linear-gradient(currentColor,currentColor) 0 100%/0 1px no-repeat;transition:background-size .5s var(--ease-out)}
  .link-u:hover{background-size:100% 1px}
}

/* ───────── header + menu ───────── */
.site-header{position:fixed;inset:0 0 auto 0;z-index:900;transition:background-color .4s,backdrop-filter .4s,border-color .4s,transform .5s var(--ease-out);border-bottom:1px solid transparent}
.site-header.stuck{background:rgb(var(--bg-rgb,11 11 12) / .72);-webkit-backdrop-filter:blur(14px) saturate(1.4);backdrop-filter:blur(14px) saturate(1.4);border-bottom-color:var(--line)}
.header-in{display:flex;align-items:center;justify-content:space-between;gap:1.5rem;height:72px}
.logo{font:600 1.25rem/1 var(--font-display);letter-spacing:-.03em;display:inline-flex;align-items:center;gap:.5rem}
.logo i{display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--accent)}
.nav-links{display:none;gap:2rem}
.nav-links a{font-size:.95rem;color:var(--text-2);transition:color var(--t-hover)}
.nav-links a.active,.nav-links a:hover{color:var(--text)}
.header-cta{display:none}
.menu-btn{width:44px;height:44px;border-radius:50%;border:1px solid var(--line);display:grid;place-content:center;gap:5px;position:relative;z-index:1000}
.menu-btn span{display:block;width:18px;height:1.5px;background:var(--text);transition:transform .5s var(--ease-drawer),opacity .2s}
.menu-open .menu-btn span:nth-child(1){transform:translateY(3.25px) rotate(45deg)}
.menu-open .menu-btn span:nth-child(2){transform:translateY(-3.25px) rotate(-45deg)}
.mobile-menu{position:fixed;inset:0;z-index:950;background:var(--bg);display:flex;flex-direction:column;justify-content:center;padding:96px var(--gutter) 40px;
  clip-path:inset(0 0 100% 0);visibility:hidden;transition:clip-path .7s var(--ease-drawer),visibility 0s .7s}
.menu-open .mobile-menu{clip-path:inset(0);visibility:visible;transition-delay:0s}
.mobile-menu a.m-link{display:block;font:500 clamp(2.4rem,11vw,4rem)/1.1 var(--font-display);letter-spacing:-.035em;padding:.2em 0;border-bottom:1px solid var(--line);
  opacity:0;transform:translateY(24px);transition:opacity .5s,transform .7s var(--ease-out)}
.menu-open .mobile-menu a.m-link{opacity:1;transform:none;transition-delay:calc(.12s + var(--i,0)*60ms)}
.mobile-menu .m-foot{margin-top:2rem;display:flex;gap:1rem;flex-wrap:wrap;color:var(--text-2)}
@media (min-width:861px){
  .nav-links,.header-cta{display:flex}
  .menu-btn,.mobile-menu{display:none}
}
.progress{position:fixed;top:0;left:0;right:0;height:2px;z-index:1001;background:var(--accent);transform-origin:0 50%;transform:scaleX(0)}

/* ───────── media + cards ───────── */
.media{position:relative;overflow:hidden;background:var(--surface-2);border-radius:var(--r-md)}
.art-svg{position:absolute;inset:0;width:100%;height:100%;display:block}
.media>img,.hero-bg>img{position:relative;width:100%;height:100%;object-fit:cover}  /* DOM order stacks the photo above the art and below ::after scrims */
.img-fail{visibility:hidden}
.scrim::after{content:"";position:absolute;inset:0;background:linear-gradient(to top,rgb(0 0 0 / .72),rgb(0 0 0 / .05) 60%);pointer-events:none}
.card{position:relative;background:var(--surface);border:1px solid var(--line);border-radius:var(--r-lg);padding:clamp(20px,3vw,32px);overflow:hidden;transition:border-color var(--t-hover),transform .5s var(--ease-out)}
.card::before{content:"";position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .4s;
  background:radial-gradient(420px circle at var(--mx,50%) var(--my,0%),rgb(var(--accent-rgb) / .14),transparent 60%)}
[data-tilt]{will-change:transform}
@media (hover:hover) and (pointer:fine){
  .card:hover{border-color:rgb(var(--accent-rgb) / .4)}
  .card:hover::before{opacity:1}
  .media img{transition:transform 1.2s var(--ease-out)}
  .zoom:hover .media img{transform:scale(1.05)}
}
.icon-tile{width:48px;height:48px;border-radius:14px;display:grid;place-items:center;background:var(--surface-2);border:1px solid var(--line);font-size:24px;color:var(--accent)}
.pill{display:inline-flex;align-items:center;gap:.4rem;padding:.35rem .8rem;border-radius:var(--r-pill);border:1px solid var(--line);font:500 var(--step--1)/1 var(--font-mono);color:var(--text-2)}

/* ───────── gallery, chips, photo strips ───────── */
.chips{display:flex;gap:.5rem;flex-wrap:wrap}
.chip{padding:.6rem 1.1rem;min-height:44px;border-radius:var(--r-pill);border:1px solid var(--line);color:var(--text-2);white-space:nowrap;transition:background-color var(--t-hover),color var(--t-hover),border-color var(--t-hover)}
.chip[aria-pressed="true"]{background:var(--text);color:var(--bg);border-color:var(--text)}
.masonry{columns:2;column-gap:12px}
@media (min-width:861px){.masonry{columns:3}}
@media (min-width:1200px){.masonry{columns:4}}
.shot{display:block;width:100%;margin:0 0 12px;break-inside:avoid;position:relative;border-radius:var(--r-md);overflow:hidden;cursor:zoom-in}
.shot.hide{display:none}
.shot .media{border-radius:0}
.shot figcaption{position:absolute;inset:auto 0 0 0;padding:1.6rem .9rem .8rem;font:500 .72rem/1.3 var(--font-mono);letter-spacing:.08em;color:#fff;opacity:0;transform:translateY(8px);transition:opacity .4s,transform .5s var(--ease-out);background:linear-gradient(to top,rgb(0 0 0 / .65),transparent)}
@media (hover:hover) and (pointer:fine){.shot:hover figcaption{opacity:1;transform:none}.shot:hover .media>img{transform:scale(1.05)}}
@media (hover:none){.shot figcaption{opacity:1;transform:none}}
.shot .media>img{transition:transform 1.2s var(--ease-out)}
dialog.lb{border:0;padding:0;background:rgb(0 0 0 / .95);color:#fff;width:100vw;height:100dvh;max-width:none;max-height:none;overflow:hidden}
dialog.lb::backdrop{background:rgb(0 0 0 / .95)}
dialog.lb[open]{display:grid;grid-template-rows:auto 1fr auto;animation:lbIn .45s var(--ease-out)}
@keyframes lbIn{from{opacity:0}}
.lb-top,.lb-bot{display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:14px var(--gutter);font:500 var(--step--1)/1.3 var(--font-mono);letter-spacing:.08em}
.lb-stage{position:relative;display:grid;place-items:center;padding:0 var(--gutter);min-height:0;touch-action:pan-y}
.lb-stage img{max-width:100%;max-height:100%;object-fit:contain;border-radius:6px;transition:opacity .35s,transform .5s var(--ease-out)}
.lb-stage img.swap{opacity:0;transform:scale(.985)}
.lb-btn{width:48px;height:48px;border-radius:50%;border:1px solid rgb(255 255 255 / .25);display:grid;place-items:center;font-size:22px;color:#fff;background:rgb(0 0 0 / .35);transition:background-color var(--t-hover),transform var(--t-press)}
.lb-btn:active{transform:scale(.94)}
@media (hover:hover) and (pointer:fine){.lb-btn:hover{background:rgb(255 255 255 / .14)}}
.lb-prev,.lb-next{position:absolute;top:50%;translate:0 -50%}
.lb-prev{left:var(--gutter)}.lb-next{right:var(--gutter)}
@media (max-width:860px){.lb-prev,.lb-next{top:auto;bottom:8px;translate:none}}
.pmq{overflow:hidden;padding-block:12px}
.pmq-track{display:flex;gap:12px;width:max-content;animation:marq 70s linear infinite}
.pmq:hover .pmq-track{animation-play-state:paused}
.pmq .media{flex:none;width:clamp(170px,24vw,300px);aspect-ratio:4/5;border-radius:var(--r-md)}
.pmq .media:nth-child(3n){aspect-ratio:1}.pmq .media:nth-child(3n+1){aspect-ratio:3/4}
.cg{display:grid;gap:12px;grid-template-columns:repeat(2,1fr);grid-auto-rows:clamp(110px,38vw,190px)}
.cg .media{height:100%;border-radius:var(--r-md)}
.cg-1{grid-column:span 2;grid-row:span 2}
@media (min-width:861px){
  .cg{grid-template-columns:repeat(6,1fr);grid-template-rows:repeat(4,clamp(80px,11vw,160px));grid-auto-rows:unset}
  .cg-1{grid-column:1/3;grid-row:1/5}.cg-2{grid-column:3/5;grid-row:1/3}.cg-3{grid-column:5/7;grid-row:1/4}.cg-4{grid-column:3/5;grid-row:3/5}.cg-5{grid-column:5/7;grid-row:4/5}
}

/* ───────── reveal system (hidden state exists only when JS runs) ───────── */
.js [data-reveal]{opacity:0;transform:translateY(28px);transition:opacity .9s var(--ease-out),transform 1s var(--ease-out);transition-delay:calc(var(--i,0)*70ms)}
.js [data-reveal].in{opacity:1;transform:none}
.js [data-split] .word{display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.14em;margin-bottom:-.14em}
.js [data-split] .char{display:inline-block;transform:translateY(112%);transition:transform 1.05s var(--ease-out);transition-delay:calc(var(--ci,0)*26ms)}
.js [data-split].in .char{transform:none}
/* image curtain reveal. NEVER clip-path the observed element itself: Chrome's IntersectionObserver then reports it as not intersecting and the photo stays invisible forever */
.js .img-reveal::before{content:"";position:absolute;inset:0;z-index:2;background:var(--bg);transform-origin:50% 0;transition:transform 1.3s var(--ease-in-out);pointer-events:none}
.js .img-reveal.in::before{transform:scaleY(0)}
.js .img-reveal>img{scale:1.15;transition:scale 1.8s var(--ease-out),transform 1.2s var(--ease-out)}
.js .img-reveal.in>img{scale:1}

/* ───────── marquee ───────── */
.marquee{overflow:hidden;border-block:1px solid var(--line);padding-block:1.1rem}
.marquee-track{display:flex;gap:3rem;width:max-content;animation:marq var(--marq-speed,32s) linear infinite}
.marquee:hover .marquee-track{animation-play-state:paused}
.marquee-track span{font:500 var(--step-3)/1 var(--font-display);letter-spacing:-.03em;white-space:nowrap;display:inline-flex;align-items:center;gap:3rem}
.marquee-track span::after{content:"✦";font-size:.5em;color:var(--accent)}
@keyframes marq{to{transform:translateX(-50%)}}

/* ───────── cursor ───────── */
.cursor{display:none}
.has-cursor .cursor{display:block;position:fixed;top:0;left:0;width:34px;height:34px;margin:-17px 0 0 -17px;border:1px solid var(--accent);border-radius:50%;pointer-events:none;z-index:9995;
  transition:width .25s var(--ease-out),height .25s var(--ease-out),margin .25s var(--ease-out),background-color .25s}
.has-cursor .cursor.hover{width:64px;height:64px;margin:-32px 0 0 -32px;background:rgb(var(--accent-rgb) / .14)}

/* ───────── loader ───────── */
.loader{position:fixed;inset:0;z-index:9999;background:var(--bg);display:grid;place-items:center;transition:transform 1s var(--ease-in-out)}
.loader.done{transform:translateY(-100%)}
.loader-mark{font:600 clamp(2rem,8vw,4rem)/1 var(--font-display);letter-spacing:-.04em;animation:pulse 1.2s var(--ease-out) infinite alternate}
@keyframes pulse{from{opacity:.25}to{opacity:1}}

/* ───────── forms ───────── */
.field{display:grid;gap:.45rem}
.field label{font:500 var(--step--1)/1 var(--font-mono);letter-spacing:.1em;text-transform:uppercase;color:var(--text-2)}
.field input,.field textarea,.field select{width:100%;min-height:52px;padding:.85rem 1rem;border-radius:var(--r-sm);background:var(--surface);border:1px solid var(--line);font-size:16px;transition:border-color var(--t-hover),box-shadow var(--t-hover)}
.field textarea{min-height:140px;resize:vertical}
.field input::placeholder,.field textarea::placeholder{color:var(--text-3)}
.field input:focus-visible,.field textarea:focus-visible,.field select:focus-visible{outline:none;border-color:var(--accent);box-shadow:0 0 0 4px rgb(var(--accent-rgb) / .18)}
.field input:user-invalid,.field textarea:user-invalid{border-color:var(--err)}
.form-status{padding:.9rem 1rem;border-radius:var(--r-sm);border:1px solid var(--ok);color:var(--ok);background:rgb(53 193 138 / .08)}

/* ───────── footer ───────── */
.site-footer{border-top:1px solid var(--line);padding-block:clamp(40px,6vw,80px) 32px;color:var(--text-2)}
.footer-grid{display:grid;gap:2.5rem;grid-template-columns:1fr}
@media (min-width:861px){.footer-grid{grid-template-columns:1.4fr 1fr 1fr 1fr}}
.footer-grid h4{font:500 var(--step--1)/1 var(--font-mono);letter-spacing:.12em;text-transform:uppercase;color:var(--text);margin-bottom:1rem}
.footer-grid li+li{margin-top:.55rem}
.footer-bottom{margin-top:3rem;padding-top:1.5rem;border-top:1px solid var(--line);display:flex;flex-wrap:wrap;gap:1rem;justify-content:space-between;font-size:var(--step--1)}

/* ───────── reduced motion ───────── */
@media (prefers-reduced-motion:reduce){
  *,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}
  .js [data-reveal],.js [data-split] .char{transform:none!important}
  .js .img-reveal::before{display:none}.js .img-reveal>img{scale:1!important}
  .marquee-track{animation:none}
}
```

### A7. Page shell (HTML skeleton, fill the `<main>` with sections)

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>BRAND — specific value proposition</title>
  <meta name="description" content="150–160 characters of real copy.">
  <meta name="theme-color" content="#0b0b0c">
  <meta property="og:title" content="BRAND — value proposition">
  <meta property="og:description" content="Same real copy.">
  <meta property="og:type" content="website">
  <!-- fonts + tabler + <style> with A6 CSS then page-specific CSS -->
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <div class="progress" aria-hidden="true"></div>
  <div class="cursor" aria-hidden="true"></div>
  <div class="loader" aria-hidden="true"><div class="loader-mark">BRAND</div></div>

  <header class="site-header">
    <div class="wrap header-in">
      <a href="#top" class="logo" aria-label="BRAND home"><i></i>BRAND</a>
      <nav class="nav-links" aria-label="Primary">
        <a href="#work">Work</a><a href="#about">About</a><a href="#contact">Contact</a>
      </nav>
      <a href="#contact" class="btn btn-primary header-cta" data-magnetic>Let’s talk <i class="ti ti-arrow-up-right" aria-hidden="true"></i></a>
      <button class="menu-btn" aria-label="Menu" aria-expanded="false" aria-controls="mobile-menu"><span></span><span></span></button>
    </div>
  </header>

  <nav class="mobile-menu" id="mobile-menu" aria-label="Mobile">
    <a class="m-link" style="--i:0" href="#work">Work</a>
    <a class="m-link" style="--i:1" href="#about">About</a>
    <a class="m-link" style="--i:2" href="#contact">Contact</a>
    <div class="m-foot"><a href="mailto:hello@brand.com">hello@brand.com</a></div>
  </nav>

  <main id="main"><span id="top"></span>
    <!-- sections -->
  </main>

  <footer class="site-footer"> … </footer>

  <!-- CDN scripts (A1) -->
  <script> /* A8 core engine, verbatim */ </script>
  <script> /* page-specific script, uses window.site */ </script>
</body>
</html>
```

Set `--bg-rgb` in `:root` to the RGB triplet of `--bg` (for the translucent sticky header), for example `--bg-rgb: 11 11 12;`.

Markup conventions the engine understands:
- `data-reveal` on any element → fades up when it enters the viewport.
- `data-stagger` on a parent → its children reveal in sequence.
- `data-split` on a **plain-text** heading → per-character rise (an `sr-only` copy is added for screen readers). Do not put child markup inside it.
- `.img-reveal` on a `.media` → curtain image reveal (a cover that wipes away; the photo itself is never hidden or clipped).
- `data-count="1280"` on a number (write the final number in the HTML) → counts up when visible; decimals respected. Add `data-raw` for years and IDs so no thousands separator is inserted (`<b data-count="2019" data-raw>2019</b>`).
- `.masonry[data-gallery]` containing `figure.shot` items → masonry gallery with automatic lightbox and `.chip[data-filter]` filters (A4.4); `.pmq` photo marquee and `.cg` bento collage (A4.5).
- `data-art="kind"` / `data-art="none"` on a `.media`, and `<body data-art-kinds="…">`, control the generated artwork (A4.3).
- `data-magnetic` on buttons, `data-tilt` on cards (pointer devices only), `data-speed="2"` on an element inside a wrapper for desktop parallax, `data-cursor` on any non-link element that should enlarge the cursor.
- `form[data-form]` with an optional `data-success="message"` and a `<p class="form-status" hidden></p>` → validated demo submit with loading and success states (tell the user to connect a real endpoint such as Formspree).

### A8. Core engine JS (second to last `<script>`, verbatim)

```js
(() => {
  'use strict';
  const doc = document.documentElement;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const wide = () => innerWidth > 860;
  const safe = fn => { try { fn(); } catch (e) { console.warn(e); } };
  doc.classList.add('js');

  /* failed photos are hidden so the generated art underneath shows */
  addEventListener('error', e => { if (e.target instanceof HTMLImageElement) e.target.classList.add('img-fail'); }, true);
  $$('img[src]').forEach(im => { if (im.complete && im.naturalWidth === 0) im.classList.add('img-fail'); });

  /* smooth scroll (Lenis) wired to ScrollTrigger */
  let lenis = null;
  const hasST = !!(window.gsap && window.ScrollTrigger);
  if (hasST) gsap.registerPlugin(ScrollTrigger);
  if (window.Lenis && !reduce) safe(() => {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    if (hasST) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  });
  const scrollToEl = (el, offset = -72) =>
    lenis ? lenis.scrollTo(el, { offset }) : el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });

  /* mobile menu */
  const menuBtn = $('.menu-btn');
  const setMenu = open => {
    doc.classList.toggle('menu-open', open);
    menuBtn?.setAttribute('aria-expanded', String(open));
    if (lenis) open ? lenis.stop() : lenis.start();
    else document.body.style.overflow = open ? 'hidden' : '';
  };
  menuBtn?.addEventListener('click', () => setMenu(!doc.classList.contains('menu-open')));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  addEventListener('resize', () => { if (wide()) setMenu(false); });

  /* anchor links */
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const t = $(id);
    if (!t) return;
    e.preventDefault();
    setMenu(false);
    requestAnimationFrame(() => scrollToEl(t));
  }));

  /* header state + progress bar */
  const bar = $('.progress'), header = $('.site-header');
  const onScroll = () => {
    const y = scrollY, max = doc.scrollHeight - innerHeight;
    header?.classList.toggle('stuck', y > 40);
    if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* current-section highlight */
  const navLinks = $$('.nav-links a[href^="#"]');
  if (navLinks.length && 'IntersectionObserver' in window) {
    const so = new IntersectionObserver(es => es.forEach(en => {
      if (en.isIntersecting) navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
    }), { rootMargin: '-45% 0px -50% 0px' });
    navLinks.map(a => $(a.getAttribute('href'))).filter(Boolean).forEach(s => so.observe(s));
  }

  /* split text into characters (plain-text headings only) */
  $$('[data-split]').forEach(el => {
    const label = el.textContent.trim().replace(/\s+/g, ' ');
    el.textContent = '';
    const sr = document.createElement('span'); sr.className = 'sr-only'; sr.textContent = label; el.append(sr);
    let ci = 0;
    const words = label.split(' ');
    words.forEach((word, wi) => {
      const w = document.createElement('span'); w.className = 'word'; w.setAttribute('aria-hidden', 'true');
      for (const ch of word) { const s = document.createElement('span'); s.className = 'char'; s.style.setProperty('--ci', ci++); s.textContent = ch; w.append(s); }
      el.append(w);
      if (wi < words.length - 1) el.append(' ');
    });
  });

  /* stagger helper */
  $$('[data-stagger]').forEach(p => Array.from(p.children).forEach((c, i) => { c.setAttribute('data-reveal', ''); c.style.setProperty('--i', i); }));

  /* counters */
  const fmt = (v, dec, raw) => raw ? v.toFixed(dec) : v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  const count = el => {
    const end = parseFloat(el.dataset.count), dec = (el.dataset.count.split('.')[1] || '').length, raw = el.hasAttribute('data-raw');
    if (reduce || isNaN(end)) { el.textContent = fmt(end, dec, raw); return; }
    const t0 = performance.now(), dur = 1700;
    const tick = t => {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = fmt(end * (1 - Math.pow(1 - p, 4)), dec, raw);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  /* reveal engine: starts after the loader */
  let started = false;
  const start = () => {
    if (started) return; started = true;
    doc.classList.add('ready');
    const items = $$('[data-reveal],[data-split],.img-reveal');
    const counters = $$('[data-count]');
    if (!('IntersectionObserver' in window)) { items.forEach(el => el.classList.add('in')); counters.forEach(count); return; }
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add('in'); io.unobserve(en.target);
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    items.forEach(el => io.observe(el));
    /* failsafe: anything already on screen after 4 s that the observer missed is shown, so no photo or block can stay hidden */
    setTimeout(() => items.forEach(el => { if (el.classList.contains('in')) return; const r = el.getBoundingClientRect(); if (r.bottom > -50 && r.top < innerHeight * 1.25) el.classList.add('in'); }), 4000);
    const co = new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return;
      count(en.target); co.unobserve(en.target);
    }), { threshold: 0.6 });
    counters.forEach(el => co.observe(el));
    document.fonts?.ready.then(() => hasST && ScrollTrigger.refresh());
    window.dispatchEvent(new Event('site:ready'));
  };

  /* loader (once per session) */
  const loader = $('.loader');
  let seen = false;
  try { seen = !!sessionStorage.getItem('seen'); } catch {}
  const finish = () => {
    loader?.classList.add('done');
    setTimeout(() => loader?.remove(), 1100);
    try { sessionStorage.setItem('seen', '1'); } catch {}
    start();
  };
  if (!loader || reduce || seen) { loader?.remove(); start(); }
  else {
    const loaded = new Promise(r => document.readyState === 'complete' ? r() : addEventListener('load', r, { once: true }));
    Promise.all([loaded, new Promise(r => setTimeout(r, 900))]).then(finish);
    setTimeout(finish, 3200); /* failsafe */
  }

  /* parallax (desktop only) */
  if (hasST && !reduce) safe(() => gsap.matchMedia().add('(min-width: 861px)', () => {
    $$('[data-speed]').forEach(el => gsap.to(el, {
      yPercent: -parseFloat(el.dataset.speed || 1) * 10, ease: 'none',
      scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
    }));
  }));

  /* pointer effects */
  if (fine && !reduce) {
    $$('[data-magnetic]').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.2}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
    $$('[data-tilt]').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg)`;
        el.style.setProperty('--mx', (x + 0.5) * 100 + '%'); el.style.setProperty('--my', (y + 0.5) * 100 + '%');
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
    const dot = $('.cursor');
    if (dot) {
      doc.classList.add('has-cursor');
      let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
      addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; }, { passive: true });
      const loop = () => { cx += (x - cx) * 0.18; cy += (y - cy) * 0.18; dot.style.transform = `translate(${cx}px, ${cy}px)`; requestAnimationFrame(loop); };
      loop();
      document.addEventListener('pointerover', e => dot.classList.toggle('hover', !!(e.target.closest && e.target.closest('a, button, [data-cursor]'))));
    }
  }

  /* demo forms: validation, loading, success */
  $$('form[data-form]').forEach(f => {
    const status = $('.form-status', f), btn = $('button[type="submit"]', f);
    f.addEventListener('submit', e => {
      e.preventDefault();
      if (!f.checkValidity()) { f.reportValidity(); return; }
      btn?.classList.add('is-loading'); if (btn) btn.disabled = true;
      setTimeout(() => {
        btn?.classList.remove('is-loading'); if (btn) btn.disabled = false;
        f.reset();
        if (status) { status.textContent = f.dataset.success || 'Thanks — we’ll reply within a day.'; status.hidden = false; }
      }, 900);
    });
  });

  /* ───── generative art under every image slot ───── */
  const hash = t => { let h = 2166136261; for (const c of String(t)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  const rng = seed => { let a = hash(seed); return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
  const BG = '<rect width="400" height="300" fill="var(--surface-2)"/>';
  const ART = {
    mesh(r, id) {
      const cols = ['var(--accent)', 'var(--accent-2)', 'var(--text)'];
      let s = `<defs><filter id="f${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="38"/></filter></defs>${BG}<g filter="url(#f${id})">`;
      for (let i = 0; i < 5; i++) s += `<circle cx="${(r() * 400) | 0}" cy="${(r() * 300) | 0}" r="${(60 + r() * 100) | 0}" fill="${cols[i % 3]}" opacity="${(0.35 + r() * 0.45).toFixed(2)}"/>`;
      return s + '</g>';
    },
    waves(r) {
      let s = BG;
      for (let i = 0; i < 6; i++) {
        const y = 70 + i * 36 + r() * 14, a = 14 + r() * 26, p = r() * 6.28, k = 1 + r() * 1.6;
        let d = `M0,${y.toFixed(1)}`;
        for (let x = 0; x <= 400; x += 20) d += ` L${x},${(y + Math.sin(x / 400 * Math.PI * 2 * k + p) * a).toFixed(1)}`;
        s += `<path d="${d} L400,300 L0,300Z" fill="${i % 2 ? 'var(--accent-2)' : 'var(--accent)'}" opacity="${(0.12 + i * 0.1).toFixed(2)}"/>`;
      }
      return s;
    },
    topo(r) {
      const cx = 120 + r() * 160, cy = 90 + r() * 120, ph = [r() * 6.28, r() * 6.28, r() * 6.28];
      let s = BG + '<g fill="none" stroke="var(--accent)" stroke-width="1.2">';
      for (let i = 1; i <= 14; i++) {
        let d = '';
        for (let a = 0; a <= 64; a++) {
          const t = a / 64 * 6.2832, rr = i * 17 * (1 + 0.16 * Math.sin(t * 2 + ph[0]) + 0.09 * Math.sin(t * 3 + ph[1]) + 0.05 * Math.sin(t * 5 + ph[2]));
          d += (a ? 'L' : 'M') + (cx + Math.cos(t) * rr * 1.25).toFixed(1) + ',' + (cy + Math.sin(t) * rr).toFixed(1);
        }
        s += `<path d="${d}Z" opacity="${(0.15 + i / 14 * 0.6).toFixed(2)}"/>`;
      }
      return s + '</g>';
    },
    rings(r) {
      const cx = r() * 400, cy = r() * 300; let s = BG;
      for (let i = 0; i < 9; i++) s += `<circle cx="${(cx + Math.sin(i) * 14).toFixed(1)}" cy="${(cy + Math.cos(i) * 10).toFixed(1)}" r="${24 + i * 28}" fill="${i % 4 === 0 ? 'var(--accent)' : 'none'}" fill-opacity=".14" stroke="${i % 3 === 0 ? 'var(--accent-2)' : 'var(--accent)'}" stroke-opacity="${(0.7 - i * 0.06).toFixed(2)}" stroke-width="1.5"/>`;
      return s;
    },
    grid(r) {
      const fx = r() * 400, fy = r() * 300; let s = BG + '<g fill="var(--accent)">';
      for (let y = 10; y < 300; y += 20) for (let x = 10; x < 400; x += 20) { const rad = Math.max(0, 8.5 - Math.hypot(x - fx, y - fy) / 28); if (rad > 0.6) s += `<circle cx="${x}" cy="${y}" r="${rad.toFixed(1)}"/>`; }
      return s + '</g>';
    },
    skyline(r, id) {
      let s = `<defs><linearGradient id="g${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--surface-2)"/><stop offset="1" stop-color="var(--accent)" stop-opacity=".45"/></linearGradient></defs><rect width="400" height="300" fill="url(#g${id})"/>`;
      s += `<circle cx="${(60 + r() * 280) | 0}" cy="${(60 + r() * 50) | 0}" r="${(26 + r() * 22) | 0}" fill="var(--accent-2)" opacity=".75"/>`;
      for (let layer = 0; layer < 2; layer++) {
        let x = -10;
        while (x < 400) {
          const w = 22 + r() * 34, h = (layer ? 50 : 80) + r() * (layer ? 90 : 120);
          s += `<rect x="${x.toFixed(1)}" y="${(300 - h).toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="var(--text)" opacity="${layer ? 0.1 : 0.22}"/>`;
          if (layer) for (let wy = 300 - h + 8; wy < 290; wy += 14) for (let wx = x + 5; wx < x + w - 6; wx += 9) if (r() > 0.55) s += `<rect x="${wx.toFixed(1)}" y="${wy.toFixed(1)}" width="4" height="6" fill="var(--accent-2)" opacity=".8"/>`;
          x += w + 2 + r() * 6;
        }
      }
      return s;
    },
    rays(r) {
      const cx = 100 + r() * 200, cy = 250; let s = BG;
      for (let i = 0; i < 26; i++) {
        const a1 = Math.PI + i / 26 * Math.PI, a2 = Math.PI + (i + 0.55) / 26 * Math.PI;
        s += `<path d="M${cx.toFixed(1)},${cy} L${(cx + Math.cos(a1) * 520).toFixed(1)},${(cy + Math.sin(a1) * 520).toFixed(1)} L${(cx + Math.cos(a2) * 520).toFixed(1)},${(cy + Math.sin(a2) * 520).toFixed(1)}Z" fill="var(--accent)" opacity="${(0.08 + (i % 3) * 0.1).toFixed(2)}"/>`;
      }
      return s + `<circle cx="${cx.toFixed(1)}" cy="${cy}" r="46" fill="var(--accent-2)" opacity=".85"/>`;
    },
    petals(r) {
      let s = BG;
      [[100 + r() * 60, 90 + r() * 40, 1], [260 + r() * 80, 160 + r() * 60, 1.3], [330 + r() * 40, 60 + r() * 30, 0.7]].forEach(([x, y, k]) => {
        for (let i = 0; i < 8; i++) s += `<ellipse cx="${x.toFixed(1)}" cy="${(y - 26 * k).toFixed(1)}" rx="${(11 * k).toFixed(1)}" ry="${(26 * k).toFixed(1)}" transform="rotate(${i * 45} ${x.toFixed(1)} ${y.toFixed(1)})" fill="var(--accent)" fill-opacity=".22" stroke="var(--accent)" stroke-opacity=".6"/>`;
        s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(7 * k).toFixed(1)}" fill="var(--accent-2)" opacity=".9"/>`;
      });
      for (let i = 0; i < 22; i++) s += `<circle cx="${(r() * 400) | 0}" cy="${(r() * 300) | 0}" r="${(1 + r() * 2).toFixed(1)}" fill="var(--accent-2)" opacity=".5"/>`;
      return s;
    },
    plate(r) {
      let s = BG + '<circle cx="200" cy="150" r="124" fill="var(--surface)" stroke="var(--line)" stroke-width="2"/><circle cx="200" cy="150" r="96" fill="none" stroke="var(--accent)" stroke-opacity=".45"/><circle cx="200" cy="150" r="70" fill="var(--accent)" fill-opacity=".1"/>';
      for (let i = 0; i < 16; i++) { const a = r() * 6.28, d = r() * 62; s += `<ellipse cx="${(200 + Math.cos(a) * d).toFixed(1)}" cy="${(150 + Math.sin(a) * d).toFixed(1)}" rx="${(4 + r() * 9).toFixed(1)}" ry="${(3 + r() * 6).toFixed(1)}" transform="rotate(${(r() * 180) | 0} 200 150)" fill="${i % 3 ? 'var(--accent)' : 'var(--accent-2)'}" opacity="${(0.5 + r() * 0.4).toFixed(2)}"/>`; }
      return s;
    },
    stripes(r) {
      let s = BG + '<g transform="rotate(-18 200 150)">', x = -140;
      while (x < 560) { const w = 14 + r() * 46; s += `<rect x="${x.toFixed(1)}" y="-80" width="${w.toFixed(1)}" height="460" fill="${r() > 0.5 ? 'var(--accent)' : r() > 0.5 ? 'var(--accent-2)' : 'var(--text)'}" opacity="${(0.1 + r() * 0.5).toFixed(2)}"/>`; x += w + 6 + r() * 24; }
      return s + '</g>';
    }
  };
  let artN = 0;
  const kinds = (document.body.dataset.artKinds || 'mesh,waves,topo,rings,grid').split(',').map(k => k.trim()).filter(k => ART[k]);
  $$('.media, .hero-bg, [data-art]').forEach((el, i) => {
    if (el.dataset.art === 'none' || el.querySelector(':scope > .art-svg')) return;
    const img = $('img', el), seed = el.dataset.seed || (img && (img.dataset.seed || img.alt)) || 'art' + i;
    const kind = ART[el.dataset.art] ? el.dataset.art : kinds[hash(seed) % kinds.length] || 'mesh';
    el.insertAdjacentHTML('afterbegin', `<svg class="art-svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">${ART[kind](rng(seed), ++artN)}</svg>`);
  });

  /* ───── gallery: filters + lightbox (every .shot inside a [data-gallery]) ───── */
  safe(() => {
    const all = $$('[data-gallery] .shot');
    $$('.chip[data-filter]').forEach(c => c.addEventListener('click', () => {
      const scope = c.closest('section') || document, f = c.dataset.filter;
      $$('.chip[data-filter]', scope).forEach(x => x.setAttribute('aria-pressed', String(x === c)));
      $$('.shot', scope).forEach(s => s.classList.toggle('hide', f !== 'all' && s.dataset.cat !== f));
      if (hasST) ScrollTrigger.refresh();
    }));
    if (!all.length) return;
    const lb = document.createElement('dialog'); lb.className = 'lb'; lb.setAttribute('aria-label', 'Photo viewer');
    lb.innerHTML = '<div class="lb-top"><span class="lb-count"></span><button class="lb-btn lb-close" aria-label="Close"><i class="ti ti-x" aria-hidden="true"></i></button></div>' +
      '<div class="lb-stage"><button class="lb-btn lb-prev" aria-label="Previous photo"><i class="ti ti-arrow-left" aria-hidden="true"></i></button><img class="lb-img" alt="" decoding="async">' +
      '<button class="lb-btn lb-next" aria-label="Next photo"><i class="ti ti-arrow-right" aria-hidden="true"></i></button></div><div class="lb-bot"><span class="lb-title"></span><span class="lb-exif"></span></div>';
    document.body.append(lb);
    const L = { img: $('.lb-img', lb), count: $('.lb-count', lb), title: $('.lb-title', lb), exif: $('.lb-exif', lb) };
    let list = [], idx = 0, opener = null;
    const src = s => { const i = $('img', s); return s.dataset.full || (i ? i.currentSrc || i.src : '').replace(/w=\d+&h=\d+&fit=crop&q=\d+/, 'w=1800&q=85'); };
    const show = (n, instant) => {
      idx = (n + list.length) % list.length;
      const s = list[idx], im = $('img', s);
      const apply = () => {
        L.img.src = src(s); L.img.alt = im ? im.alt : ''; L.count.textContent = `${idx + 1} / ${list.length}`;
        L.title.textContent = s.dataset.title || ''; L.exif.textContent = s.dataset.exif || ''; L.img.classList.remove('swap');
        [idx + 1, idx - 1].forEach(k => { const t = list[(k + list.length) % list.length]; if (t) new Image().src = src(t); });
      };
      if (instant || reduce) apply(); else { L.img.classList.add('swap'); setTimeout(apply, 180); }
    };
    const open = s => { opener = s; list = $$('.shot', s.closest('[data-gallery]')).filter(x => !x.classList.contains('hide') && $('img', x)); lb.showModal(); lenis && lenis.stop(); show(list.indexOf(s), true); };
    const close = () => { if (lb.open) lb.close(); };
    lb.addEventListener('close', () => { lenis && lenis.start(); opener && opener.focus && opener.focus({ preventScroll: true }); });
    all.forEach(s => {
      if (!$('img', s)) return;
      s.tabIndex = 0; s.setAttribute('role', 'button'); if (!s.hasAttribute('aria-label')) s.setAttribute('aria-label', 'Open photo: ' + (s.dataset.title || $('img', s).alt));
      s.addEventListener('click', () => open(s));
      s.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(s); } });
    });
    $('.lb-close', lb).addEventListener('click', close);
    $('.lb-prev', lb).addEventListener('click', () => show(idx - 1));
    $('.lb-next', lb).addEventListener('click', () => show(idx + 1));
    lb.addEventListener('keydown', e => { if (e.key === 'ArrowRight') show(idx + 1); if (e.key === 'ArrowLeft') show(idx - 1); });
    lb.addEventListener('click', e => { if (e.target === lb) close(); });
    let sx = 0, sy = 0; const stage = $('.lb-stage', lb);
    stage.addEventListener('pointerdown', e => { sx = e.clientX; sy = e.clientY; });
    stage.addEventListener('pointerup', e => {
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) show(idx + (dx < 0 ? 1 : -1)); else if (dy > 90 && Math.abs(dy) > Math.abs(dx) * 1.4) close();
    });
  });

  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  window.site = { lenis, reduce, fine, wide, $, $$, scrollToEl, safe };
})();
```

The second `<script>` (page-specific) may use `window.site`, listen for `site:ready`, and register extra GSAP/ScrollTrigger work.

---

## PART B — DELIVERY RULES (apply to every site type)

### B1. Process (do silently, then output only the result)

1. Read the brief; choose direction, palette (A3), font pairing (A3), signature moment.
2. Write the content first (headlines, copy, numbers, names) so layout follows the words.
3. Assemble: A6 CSS → page CSS → A7 shell → sections → A8 JS → page JS.
4. Run the checklist in B2 and fix anything that fails before answering.

### B2. Final quality checklist

- [ ] A6 CSS, A7 shell and A8 JS are all present and unmodified in behaviour
- [ ] Reads perfectly at 390px (single column, 48px targets, hero CTA visible without scrolling), at 768px, and at 1440px; no horizontal scroll
- [ ] No Lorem Ipsum; copy is specific; hero h1 is 4–10 words and outcome-led
- [ ] One display + one body font (mono optional); headline uses `clamp()` and tight tracking
- [ ] Contrast verified for body, accent text and any text over images (scrim present)
- [ ] Every interactive element has hover (pointer-gated), `:active`, `:focus-visible`; forms have labels, types, autocomplete, validation and a success state
- [ ] `reduce` and `fine` handled (already in engine); no ungated `:hover` motion
- [ ] Nav anchors match section `id`s; one `h1`; heading order logical
- [ ] **Visual budget met (A4.1):** hero visual, ≥ 14 distinct photos, a gallery of ≥ 9 with lightbox, portraits on every testimonial/team/agent/coach, no run of 3 text-only sections, each photo used ≤ 2 times
- [ ] Every photo ID is copied exactly from the A4.2 library (nothing invented); every `<img>` is inside `.media`/`.hero-bg` with `width`/`height`/`alt`/`data-seed`
- [ ] Page still looks good with photos blocked (generated art shows)
- [ ] Icons are Tabler only, with `aria-hidden` or `aria-label`
- [ ] The signature moment exists, works, and is not buried under competing effects
- [ ] No `console` errors on load; every library call guarded; no `transition: all`

### B3. Output format

Reply with **one fenced ```html code block containing the entire `index.html`**, nothing truncated. After it, write at most five short lines: the direction and palette used, the signature moment, and the exact placeholders the owner must replace (contact email/phone, social links, form endpoint, real photos). No other commentary.

---

## ═══════════════════════════════════════════════
## PART C — GYM / FITNESS SPECIFICATION
## ═══════════════════════════════════════════════

### C1. Goal

Turn a curious scroller into a **free-trial booking**. Energy, proof and clarity beat decoration: what you offer, who trains here, what it costs, how to start today. Mobile matters most (people check the schedule on their phone at the gym door).

### C2. Direction

| Type | Palette (A3) | Fonts |
| --- | --- | --- |
| Strength, CrossFit, boxing | **Ember** or **Solar** | Barlow Condensed + Barlow + IBM Plex Mono |
| Boutique / HIIT | **Mono Lime** | Archivo Black + Archivo + Space Mono |
| Yoga, pilates, wellness | **Moss** or **Rose Quartz** (light) | Fraunces + DM Sans |

Headings in uppercase condensed type, tight leading, huge scale. Photography is high-contrast and cropped tight; apply a dark scrim under all text.

### C3. Section order (all required)

1. **Hero** — full-bleed training photo with scrim, giant uppercase headline, subline, **Start free trial** + **View schedule**, three trust chips (members, rating, years).
2. **Marquee** — class names and values (“STRENGTH · HIIT · BOXING · MOBILITY”).
3. **Numbers** — 4 counters (members, classes/week, coaches, sq ft).
4. **Programs** — 4–6 program cards with image, level, duration and a hover reveal.
5. **Class schedule** — day tabs (default: today) with a time table; each class has coach, level, spots left and a **Book** button that works.
6. **Coaches** — 3–4 coaches with photo, speciality, credentials.
7. **Transformations** — a **before/after drag slider** with a short story and result stats.
8. **Pricing** — monthly / annual toggle, 3 plans, middle highlighted, joining-fee note.
9. **BMI & calorie calculator** — height, weight, age, sex, activity, goal → BMI, daily calories and macros.
10. **Reviews** — 3 member quotes with results.
11. **FAQ** — 6 questions (first visit, cancellation, kids, equipment, parking, injuries).
12. **Free-trial form** — name, phone, email, preferred class, goal, with success state.
13. **Footer** — address, opening hours, socials, map-style block.

### C3b. Visual plan (MANDATORY; keys refer to the photo library in A4.2)

A gym site without powerful photography fails. Build all of these:

| Where | What to build | Photos |
| --- | --- | --- |
| Hero | Dark full-bleed with scrim | `gym.20` or `gym.27` (industrial) · `gym.06` (moody) |
| Programs (6 cards, 4:5) | Strength · HIIT · Boxing/Conditioning · Mobility & Yoga · Powerlifting · Endurance | `gym.21` · `gym.29` · `gym.31` · `gym.16` · `gym.04` · `gym.19` |
| Under the marquee | **Photo marquee** (A4.5), 8 duplicated | `gym.00` `gym.09` `gym.12` `gym.24` `gym.30` `gym.22` `gym.14` `gym.18` |
| Coaches (4, 3:4) | 2 women, 2 men | `people.00` `people.22` `people.01` `people.20` |
| Transformation slider | Before: `gym.15` (desaturate with CSS) · After: `gym.23` | as listed |
| **Gallery** (`id="gallery"`, add to nav “Inside the gym”) | masonry of **12**, chips **Floor · Classes · Recovery** | Floor: `gym.00` `gym.03` `gym.06` `gym.10` `gym.20` `gym.22` `gym.27` · Classes: `gym.18` `gym.29` `gym.31` `gym.14` · Recovery: `gym.16` `gym.17` `gym.26` |
| Reviews | 3 portraits | `people.01` `people.00` `people.21` |
| Trial form | One side photo | `gym.30` |

Use `<body data-art-kinds="stripes,rays,grid">`. Total distinct photos ≥ 30. Real member photos with written consent must replace the before/after pair; say so in the closing notes.

### C4. Signature moment

**The before/after slider** (a draggable reveal that works with mouse, touch and keyboard) plus a **huge outline-and-fill hero headline**. The BMI/calorie tool is the sticky utility that keeps people on the page.

### C5. Page-specific CSS (append after A6)

```css
h1,h2,h3{text-transform:uppercase}
.hero{position:relative;min-height:100svh;display:grid;align-items:end;padding:120px 0 clamp(32px,6vw,72px);isolation:isolate;overflow:clip}
.hero-bg{position:absolute;inset:0;z-index:-1}
.hero-bg img{width:100%;height:100%;object-fit:cover;filter:grayscale(.35) contrast(1.1)}
.hero-bg::after{content:"";position:absolute;inset:0;background:linear-gradient(to top,var(--bg) 4%,rgb(0 0 0 / .55) 55%,rgb(0 0 0 / .55))}
.hero h1{font-size:var(--step-5);line-height:.84;letter-spacing:-.02em;max-width:11ch;color:#fff}
.hero h1 .o{color:transparent;-webkit-text-stroke:2px var(--accent)}
.hero .lead{color:rgb(255 255 255 / .8);margin:1.2rem 0 1.8rem}
.cta-row{display:flex;flex-wrap:wrap;gap:.75rem}
.chips-row{display:flex;flex-wrap:wrap;gap:.6rem;margin-top:1.8rem}
.btn{border-radius:6px;text-transform:uppercase;letter-spacing:.08em;font-size:.9rem}

.nums{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
@media (min-width:861px){.nums{grid-template-columns:repeat(4,1fr)}}
.num-card{padding:clamp(18px,3vw,32px);border:1px solid var(--line);border-radius:12px}
.num-card b{display:block;font:700 var(--step-4)/1 var(--font-display);letter-spacing:-.02em;color:var(--accent);font-variant-numeric:tabular-nums}

/* programs */
.programs{display:grid;gap:12px}
@media (min-width:600px){.programs{grid-template-columns:repeat(2,1fr)}}
@media (min-width:1100px){.programs{grid-template-columns:repeat(3,1fr)}}
.prog{position:relative;min-height:420px;border-radius:14px;overflow:hidden;isolation:isolate;display:flex;align-items:flex-end;color:#fff}
.prog .media{position:absolute;inset:0;border-radius:0;z-index:-1}
.prog::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(to top,rgb(0 0 0 / .85),transparent 65%)}
.prog div{padding:1.4rem;display:grid;gap:.5rem}
.prog h3{font-size:var(--step-2)}
.prog p{color:rgb(255 255 255 / .75);max-height:0;opacity:0;overflow:hidden;transition:max-height .6s var(--ease-out),opacity .4s}
.prog:focus-within p,.prog.open p{max-height:8em;opacity:1}
@media (hover:hover) and (pointer:fine){.prog:hover p{max-height:8em;opacity:1}}
@media (hover:none){.prog p{max-height:none;opacity:1}}

/* schedule */
.days{display:flex;gap:.4rem;overflow-x:auto;scrollbar-width:none;margin:1.6rem 0 1rem}
.days::-webkit-scrollbar{display:none}
.day{padding:.7rem 1.2rem;min-height:48px;border-radius:8px;border:1px solid var(--line);color:var(--text-2);white-space:nowrap;font:600 .85rem/1 var(--font-mono);letter-spacing:.08em;text-transform:uppercase}
.day[aria-selected="true"]{background:var(--accent);color:var(--on-accent);border-color:var(--accent)}
.slot{display:grid;grid-template-columns:auto 1fr auto;gap:.3rem 1rem;align-items:center;padding:1.1rem 0;border-bottom:1px solid var(--line);animation:slotIn .5s var(--ease-out) both;animation-delay:calc(var(--k,0)*45ms)}
@keyframes slotIn{from{opacity:0;transform:translateY(10px)}}
.slot .t{font:600 var(--step-1)/1 var(--font-mono);font-variant-numeric:tabular-nums}
.slot h3{font-size:var(--step-1)}
.slot small{color:var(--text-2)}
.slot .spots{font:500 .75rem/1 var(--font-mono);color:var(--ok)}
.slot .spots.low{color:var(--err)}
.slot .btn{min-height:44px;padding:0 1.2rem}
.slot .btn[aria-pressed="true"]{background:transparent;color:var(--ok);border:1px solid var(--ok)}
@media (max-width:600px){.slot{grid-template-columns:auto 1fr}.slot .btn{grid-column:1/-1}}

/* coaches */
.coaches{display:grid;gap:12px;grid-template-columns:repeat(2,1fr)}
@media (min-width:861px){.coaches{grid-template-columns:repeat(4,1fr)}}
.coach .media{aspect-ratio:3/4;border-radius:12px}
.coach h3{margin-top:.8rem;font-size:var(--step-1)}.coach small{color:var(--text-2)}

/* before / after (the @property registration lets WAAPI tween --p smoothly) */
@property --p{syntax:'<percentage>';inherits:true;initial-value:50%}
.ba-wrap{display:grid;gap:clamp(20px,4vw,56px);align-items:center}
@media (min-width:861px){.ba-wrap{grid-template-columns:1fr 1fr}}
.ba{--p:50%;position:relative;aspect-ratio:4/5;border-radius:14px;overflow:hidden;user-select:none;touch-action:pan-y}
.ba .layer{position:absolute;inset:0}
.ba .layer .media{position:absolute;inset:0;border-radius:0}
.ba .after{clip-path:inset(0 0 0 var(--p))}
.ba .tag{position:absolute;top:1rem;padding:.35rem .7rem;border-radius:6px;background:rgb(0 0 0 / .6);color:#fff;font:600 .7rem/1 var(--font-mono);letter-spacing:.1em;text-transform:uppercase}
.ba .tag.l{left:1rem}.ba .tag.r{right:1rem}
.ba .handle{position:absolute;top:0;bottom:0;left:var(--p);width:2px;background:#fff;translate:-1px 0;pointer-events:none}
.ba .handle::after{content:"";position:absolute;top:50%;left:50%;width:44px;height:44px;translate:-50% -50%;border-radius:50%;background:#fff;box-shadow:0 8px 30px rgb(0 0 0 / .4);
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23111' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M8 7l-5 5l5 5M16 7l5 5l-5 5'/%3E%3C/svg%3E");background-size:24px;background-repeat:no-repeat;background-position:center}
.ba input[type=range]{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:ew-resize;margin:0}
.ba:focus-within .handle::after{outline:2px solid var(--accent);outline-offset:3px}
.ba-stats{display:flex;gap:2rem;flex-wrap:wrap;margin-top:1.4rem}
.ba-stats b{display:block;font:700 var(--step-3)/1 var(--font-display);color:var(--accent)}

/* pricing */
.toggle{display:inline-flex;padding:4px;border:1px solid var(--line);border-radius:8px}
.toggle button{padding:.6rem 1.2rem;border-radius:6px;color:var(--text-2);font:600 .8rem/1 var(--font-mono);letter-spacing:.08em;text-transform:uppercase;min-height:44px}
.toggle button[aria-pressed="true"]{background:var(--text);color:var(--bg)}
.plans{display:grid;gap:12px;margin-top:2rem}
@media (min-width:861px){.plans{grid-template-columns:repeat(3,1fr)}}
.plan{display:flex;flex-direction:column;gap:1.2rem;border-radius:14px}
.plan.pop{border-color:var(--accent);background:linear-gradient(180deg,rgb(var(--accent-rgb) / .12),var(--surface) 45%)}
.price{font:700 var(--step-4)/1 var(--font-display);font-variant-numeric:tabular-nums}
.price small{font:400 var(--step-0)/1 var(--font-body);color:var(--text-2);letter-spacing:0;text-transform:none}
.plan ul{display:grid;gap:.7rem;flex:1;color:var(--text-2)}.plan li{display:flex;gap:.6rem}.plan li i{color:var(--accent);margin-top:.28rem}

/* calculator */
.calc{display:grid;gap:clamp(16px,3vw,32px)}
@media (min-width:861px){.calc{grid-template-columns:1fr 1fr}}
.row2{display:grid;gap:12px;grid-template-columns:1fr 1fr}
.result{display:grid;gap:1rem;align-content:start}
.big{font:700 var(--step-5)/.9 var(--font-display);color:var(--accent);font-variant-numeric:tabular-nums}
.bmi-scale{height:10px;border-radius:99px;background:linear-gradient(90deg,#4f8cff 0 18.5%,var(--ok) 18.5% 25%,#f2b441 25% 30%,var(--err) 30% 100%);position:relative;margin-top:.4rem}
.bmi-scale i{position:absolute;top:50%;width:18px;height:18px;border-radius:50%;background:#fff;border:3px solid var(--bg);translate:-50% -50%;left:var(--at,0%);transition:left .8s var(--ease-out)}
.macros{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.macros div{padding:.9rem;border:1px solid var(--line);border-radius:10px;text-align:center}
.macros b{display:block;font:700 var(--step-2)/1 var(--font-display)}
.macros small{color:var(--text-2);font:500 .7rem/1 var(--font-mono);letter-spacing:.08em;text-transform:uppercase}

.reviews{display:grid;gap:12px}@media (min-width:861px){.reviews{grid-template-columns:repeat(3,1fr)}}
.faq details{border-bottom:1px solid var(--line)}
.faq summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;gap:1rem;align-items:center;padding:1.2rem 0;font:600 var(--step-1)/1.3 var(--font-display);text-transform:uppercase}
.faq summary::-webkit-details-marker{display:none}.faq summary i{transition:transform .4s var(--ease-out)}
.faq details[open] summary i{transform:rotate(45deg)}.faq .ans{padding-bottom:1.3rem;color:var(--text-2);max-width:62ch}
.trial{display:grid;gap:clamp(24px,5vw,72px)}@media (min-width:861px){.trial{grid-template-columns:1fr 1fr}}
```

### C6. Markup patterns

**Hero headline with outline word**

```html
<h1><span class="split-line" data-split>Build the body</span> <span class="o" data-reveal style="--i:3;display:inline-block">you’ll earn.</span></h1>
```
(`data-split` stays on a plain-text span; the outlined word reveals separately.)

**Before/after slider** (the range input is the accessible control)

```html
<div class="ba" id="ba" role="group" aria-label="Before and after transformation">
  <div class="layer"><div class="media"><img src="https://images.unsplash.com/photo-1517344368193-41552b6ad3f5?w=900&h=1125&fit=crop&q=80&auto=format" width="900" height="1125" alt="Member before 16 weeks of training" loading="lazy" data-seed="before-training" style="filter:grayscale(.6) brightness(.85)"></div><span class="tag l">Week 0</span></div>
  <div class="layer after"><div class="media"><img src="https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=900&h=1125&fit=crop&q=80&auto=format" width="900" height="1125" alt="Same member after 16 weeks of training" loading="lazy" data-seed="after-training"></div><span class="tag r">Week 16</span></div>
  <div class="handle" aria-hidden="true"></div>
  <input type="range" min="0" max="100" value="50" step="1" aria-label="Reveal before and after" id="ba-range">
</div>
```
Use two **different** photos (or the same photo with the “before” desaturated); state in the closing notes that real member photos with written consent must replace them.

**Schedule container**

```html
<div class="days" role="tablist" aria-label="Class days" id="days"></div>
<div id="slots" role="tabpanel" aria-live="polite"></div>
<noscript><p class="muted">Enable JavaScript to see the class schedule.</p></noscript>
```

**Pricing price markup**: `<span class="price">₹<span data-monthly="1999" data-annual="1599">1999</span><small data-period>/mo</small></span>`; annual ≈ 20% cheaper; toggle buttons `aria-pressed`.

**Calculator form** (fields: height cm, weight kg, age, sex select, activity select with values 1.2 / 1.375 / 1.55 / 1.725, goal select cut / maintain / bulk) with a results panel containing `#bmi-val`, `#bmi-cat`, `.bmi-scale`, `#kcal`, and macro tiles `#m-p #m-c #m-f`.

### C7. Page-specific JavaScript

```js
(() => {
  const { $, $$, safe } = window.site;
  const CUR = '₹', LOCALE = 'en-IN';            /* AI: set for the gym's market */

  /* ───── schedule (AI: invent 4–6 classes per day for all 7 days; 0 = Sunday) ───── */
  const SCHEDULE = {
    1: [{ t: '06:00', n: 'Strength Foundations', c: 'Arjun', l: 'All levels', s: 8 }, { t: '07:30', n: 'HIIT 45', c: 'Mira', l: 'Intermediate', s: 3 }, { t: '18:30', n: 'Boxing Basics', c: 'Dev', l: 'Beginner', s: 12 }],
    /* …2–6, 0… */
  };
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const booked = (() => { try { return new Set(JSON.parse(localStorage.getItem('gym-booked') || '[]')); } catch { return new Set(); } })();
  const saveBooked = () => { try { localStorage.setItem('gym-booked', JSON.stringify([...booked])); } catch {} };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  let day = new Date().getDay();
  const daysEl = $('#days'), slotsEl = $('#slots');
  const renderDays = () => {
    daysEl.innerHTML = [1, 2, 3, 4, 5, 6, 0].map(d => `<button class="day" role="tab" data-day="${d}" aria-selected="${d === day}" tabindex="${d === day ? 0 : -1}">${DAYS[d]}${d === new Date().getDay() ? ' · today' : ''}</button>`).join('');
  };
  const renderSlots = () => {
    const list = SCHEDULE[day] || [];
    slotsEl.innerHTML = list.length ? list.map((c, i) => {
      const id = `${day}-${c.t}`, on = booked.has(id), left = c.s - (on ? 1 : 0);
      return `<div class="slot" style="--k:${i}"><span class="t">${esc(c.t)}</span><div><h3>${esc(c.n)}</h3><small>${esc(c.c)} · ${esc(c.l)}</small></div>
        <div style="display:grid;gap:.5rem;justify-items:end"><span class="spots ${left <= 3 ? 'low' : ''}">${left} spots left</span>
        <button class="btn ${on ? '' : 'btn-primary'}" data-book="${id}" aria-pressed="${on}">${on ? '<i class="ti ti-check" aria-hidden="true"></i> Booked' : 'Book'}</button></div></div>`;
    }).join('') : '<p class="muted" style="padding:2rem 0">Rest day. See you tomorrow.</p>';
  };
  if (daysEl && slotsEl) {
    renderDays(); renderSlots();
    daysEl.addEventListener('click', e => { const b = e.target.closest('[data-day]'); if (!b) return; day = +b.dataset.day; renderDays(); renderSlots(); });
    daysEl.addEventListener('keydown', e => {
      if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
      const order = [1, 2, 3, 4, 5, 6, 0], i = order.indexOf(day); day = order[(i + (e.key === 'ArrowRight' ? 1 : order.length - 1)) % order.length];
      renderDays(); renderSlots(); $('.day[aria-selected="true"]', daysEl).focus();
    });
    slotsEl.addEventListener('click', e => {
      const b = e.target.closest('[data-book]'); if (!b) return;
      const id = b.dataset.book; booked.has(id) ? booked.delete(id) : booked.add(id); saveBooked(); renderSlots();
    });
  }

  /* ───── before / after ───── */
  const ba = $('#ba'), range = $('#ba-range');
  if (ba && range) {
    const set = v => ba.style.setProperty('--p', v + '%');
    range.addEventListener('input', () => set(range.value));
    set(range.value);
    /* gentle hint on first view */
    if (!window.site.reduce && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(([e]) => { if (!e.isIntersecting) return; io.disconnect();
        const a = ba.animate([{ '--p': '50%' }, { '--p': '38%' }, { '--p': '62%' }, { '--p': '50%' }], { duration: 1800, easing: 'cubic-bezier(.23,1,.32,1)' }); a.addEventListener('finish', () => set(range.value)); }, { threshold: 0.6 });
      io.observe(ba);
    }
  }

  /* ───── pricing toggle ───── */
  const tog = $$('.toggle button'), prices = $$('[data-monthly]');
  tog.forEach(b => b.addEventListener('click', () => {
    const annual = b.dataset.billing === 'annual';
    tog.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    prices.forEach(p => { p.textContent = annual ? p.dataset.annual : p.dataset.monthly; });
    $$('[data-period]').forEach(el => { el.textContent = annual ? '/mo, billed yearly' : '/mo'; });
  }));

  /* ───── BMI + calories (Mifflin–St Jeor) ───── */
  const form = $('#calc');
  if (form) {
    const out = { bmi: $('#bmi-val'), cat: $('#bmi-cat'), scale: $('.bmi-scale'), kcal: $('#kcal'), p: $('#m-p'), c: $('#m-c'), f: $('#m-f') };
    const run = () => {
      const h = +form.height.value, w = +form.weight.value, a = +form.age.value;
      if (!(h > 90 && h < 250 && w > 25 && w < 300 && a > 12 && a < 100)) return;
      const bmi = w / ((h / 100) ** 2);
      const cat = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Healthy range' : bmi < 30 ? 'Overweight' : 'Obese range';
      const bmr = 10 * w + 6.25 * h - 5 * a + (form.sex.value === 'm' ? 5 : -161);
      const tdee = bmr * +form.activity.value;
      const kcal = Math.round(tdee + ({ cut: -500, maintain: 0, bulk: 300 }[form.goal.value] || 0));
      const protein = Math.round(w * 2), fat = Math.round(kcal * 0.27 / 9), carbs = Math.max(0, Math.round((kcal - protein * 4 - fat * 9) / 4));
      out.bmi.textContent = bmi.toFixed(1); out.cat.textContent = cat;
      out.scale.style.setProperty('--at', Math.min(Math.max((bmi - 12) / (40 - 12), 0), 1) * 100 + '%');
      out.kcal.textContent = kcal.toLocaleString(LOCALE); out.p.textContent = protein + 'g'; out.c.textContent = carbs + 'g'; out.f.textContent = fat + 'g';
    };
    form.addEventListener('input', run); form.addEventListener('submit', e => { e.preventDefault(); run(); });
    run();
  }
})();
```

BMI is a screening number, not a diagnosis. The calculator panel must include the sentence: “For general guidance only, not medical advice.”

### C8. Content rules

- **Brand and promise**: specific (“Iron Paradise — strength training for people who’ve never trained”). Include a founding year, member count, rating and coach count that are consistent across hero, numbers and footer.
- **Programs (4–6)**: Strength, HIIT, Boxing, Mobility & Yoga, Powerlifting, Kids/Youth: each with duration, level and one benefit sentence.
- **Schedule**: believable times (06:00, 07:30, 12:15, 18:30, 20:00), mixed levels, spots 2–14, all 7 days with weekends lighter.
- **Coaches**: first name, speciality, a real-sounding credential (“NSCA-CPT”, “ex-national boxing finalist”), one line of philosophy.
- **Plans**: Starter (off-peak, 3 classes/week), Unlimited (most popular), Elite (adds coaching and recovery). Currency consistent; note the joining fee and a **7-day free trial**.
- **Reviews**: concrete, honest results (“lost 9 kg in 16 weeks”, “first pull-up at 41”).
- **Safety**: disclaimers on calculator; FAQ includes injuries and medical clearance.
- **Photos:** all from the verified library (A4.2) following the visual plan (C3b); the gallery uses the core component (A4.4).

### C9. Gym-specific checklist

- [ ] Hero CTA and “Start free trial” visible at 390×700; sticky or repeated CTA after the hero is a plus
- [ ] Schedule defaults to today, tabs are keyboard operable, Book toggles and updates spots, state persists
- [ ] Before/after slider works by drag, touch and arrow keys; both photos carry descriptive alt text
- [ ] Pricing toggle changes all prices and the period label; the best-value plan is clear
- [ ] Calculator updates live, rejects nonsense input, and shows the disclaimer
- [ ] Uppercase headings stay legible at 390px (no mid-word breaks)
- [ ] Trial form validates and confirms; phone field uses `type="tel"`
- [ ] Closing notes mention replacing stock photos and the schedule/pricing data

---

## ═══════════════════════════════════════════════
## PART D — QUICK-START PROMPTS
## ═══════════════════════════════════════════════

```
Build a website for IRON PARADISE GYM, a strength and conditioning gym in Pune. Vibe: raw, loud, no-nonsense. Palette: Ember.
Classes: strength, HIIT, boxing, mobility. Pricing in INR: invent 3 plans. 7-day free trial.
```

```
Build a website for STILLWATER YOGA, a boutique yoga and pilates studio in Auckland. Vibe: calm, light, grounded. Palette: Moss.
Classes: vinyasa, yin, reformer pilates, breathwork. Pricing in NZD: invent 3 plans. First class free.
```


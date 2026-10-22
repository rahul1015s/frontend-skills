# PREMIUM WEDDING WEBSITE / DIGITAL INVITATION — MASTER PROMPT v1.0
### One prompt → one complete, romantic, animated `index.html` with countdown, add-to-calendar, RSVP, guestbook and a curtain-opening invitation

> **HOW TO USE**
> 1. Paste this ENTIRE file into any capable AI (Claude, GPT, Gemini…).
> 2. Then send: `Build our wedding website. Couple: <NAME & NAME>. Date: <date + time>. Venue: <name, city>. Style: <classic | garden | modern | royal | beach>. Events: <ceremony, reception, sangeet…>. Hashtag: <or "invent">.`
> 3. The AI returns a single `index.html`. Save it and share the link with guests.

If any detail is missing, **invent believable specifics** instead of asking questions (names, venue, dates in the future relative to today).


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

**wedding.*** — weddings and celebrations (22)
```
key | photo ID | what it shows
wedding.00 | 1519741497674-611481863552 | couple with bouquet, moody backlight
wedding.01 | 1465495976277-4387d4b0b4c6 | hands with rings, bouquet and watch
wedding.02 | 1511285560929-80b456fea0bc | couple on a pier with balloons and flower arch
wedding.03 | 1519225421980-715cb0215aed | long reception table with flowers
wedding.04 | 1522673607200-164d1b6ce486 | two decorated chairs on a lawn
wedding.06 | 1523438885200-e635ba2c371e | garden gazebo ceremony with flowers
wedding.07 | 1469371670807-013ccf25f16a | ceremony aisle with floral arrangement
wedding.08 | 1537633552985-df8429e8048b | couple on a beach with veil
wedding.09 | 1606800052052-a08af7148866 | gold wedding rings on lace
wedding.10 | 1583939003579-730e3918a45a | couple kissing among the bridal party
wedding.11 | 1519671482749-fd09be7ccebf | guests toasting with glasses
wedding.12 | 1507504031003-b417219a0fde | wooden “Mr & Mrs” sign
wedding.13 | 1460978812857-470ed1c77af0 | couple kissing under a veil, black and white
wedding.14 | 1525258946800-98cfd641d0de | peach and white bouquet
wedding.15 | 1529634806980-85c3dd6d34ac | hands with rings and autumn flowers
wedding.17 | 1532712938310-34cb3982ef74 | couple walking in a field, distant
wedding.18 | 1546032996-6dfacbacbf3f | couple embracing in a veil, wheat field
wedding.19 | 1464366400600-7168b8af9bc3 | blue and white reception hall tables
wedding.20 | 1522413452208-996ff3f3e740 | rustic table setting with greenery
wedding.21 | 1591604466107-ec97de577aff | couple smiling by a lake, golden light
wedding.22 | 1583939411023-14783179e581 | bride with bridesmaids in a garden
wedding.23 | 1509927083803-4bd519298ac4 | bride and groom shoes on wood
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

**hotel.*** — hotels, resorts and pools (12)
```
key | photo ID | what it shows
hotel.00 | 1566073771259-6a8506099945 | wooden resort with pool and loungers
hotel.01 | 1520250497591-112f2f40a3f4 | tropical resort pool
hotel.02 | 1571896349842-33c89424de2d | luxury hotel pool at dusk
hotel.03 | 1551882547-ff40c63fe5fa | palm-lined pool at sunset
hotel.04 | 1582719508461-905c673771fd | infinity pool deck with umbrellas
hotel.05 | 1542314831-068cd1dbfeeb | luxury villa pool at night
hotel.06 | 1564501049412-61c2a3083791 | white mansion with pool
hotel.07 | 1445019980597-93fa8acb246c | rooftop terrace at sunset
hotel.08 | 1590490360182-c33d57733427 | classic hotel suite
hotel.09 | 1578683010236-d716f9a3f461 | modern bedroom with glass bathroom
hotel.10 | 1584132967334-10e028bd69f7 | beach resort infinity pool
hotel.11 | 1571003123894-1f0594d2b5d9 | beach cabanas at sunset
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

**food.*** — food, drink, cafés and restaurants (31)
```
key | photo ID | what it shows
food.00 | 1546833999-b9f581a1996d | Indian thali platter
food.01 | 1555396273-367ea4eb4db5 | bright industrial café interior
food.02 | 1514362545857-3bc16c4c7d1b | cocktail glass, dark and moody
food.03 | 1578985545062-69928b1d9587 | chocolate drip cake
food.04 | 1414235077428-338989a2e8c0 | fine-dining plating close-up
food.05 | 1517248135467-4c7edcad34c4 | dark upscale restaurant interior
food.06 | 1550966871-3ed3cdb5ed0c | elegant dining room with window light
food.07 | 1559339352-11d035aa65de | seaside terrace restaurant
food.08 | 1504674900247-0877df9cc836 | meat and salad bowls, overhead
food.09 | 1565299624946-b28f40a0ae38 | pizza on a wooden board
food.10 | 1567620905732-2d1ec7ab7445 | stack of pancakes
food.11 | 1473093295043-cdd812d0e601 | farfalle pasta salad
food.12 | 1476224203421-9ac39bcb3327 | mixed grill platter
food.13 | 1540189549336-e6e99c3679fe | dark salad bowl
food.14 | 1482049016688-2d3e1b311543 | avocado and egg toast
food.15 | 1512621776951-a57141f2eefd | colourful buddha bowl
food.16 | 1495474472287-4d71bcdd2085 | two latte-art coffees, cheers
food.17 | 1509042239860-f550ce710b93 | cappuccino with plants
food.18 | 1442512595331-e89e73853f31 | pour-over coffee brewing
food.19 | 1447933601403-0c6688de566e | coffee beans texture
food.20 | 1501339847302-ac426a4a7cbb | CAFE sign inside a café
food.21 | 1554118811-1e0d58224f24 | bright café interior with tables
food.22 | 1509440159596-0249088772ff | sourdough bread loaves
food.23 | 1555507036-ab1f4038808a | croissant dusted with flour, dark
food.24 | 1493770348161-369560ae357d | brunch spread, overhead
food.25 | 1498837167922-ddd27525d352 | salad bar spread
food.27 | 1551782450-a2132b4ba21d | burger and fries, dark
food.28 | 1544025162-d76694265947 | ribs platter
food.29 | 1529042410759-befb1204b468 | meatballs on salad
food.30 | 1481931098730-318b6f776db0 | spaghetti, two plates and wine
food.31 | 1568901346375-23c9450c58cd | burger close-up
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
## PART C — WEDDING SPECIFICATION
## ═══════════════════════════════════════════════

### C1. Goal

Guests open one link on their phone and instantly know **when, where, what to wear, and how to reply**. The site should feel like a beautifully printed invitation: slow, soft, intimate. Emotion first, logistics clear.

### C2. Direction

| Style | Palette (A3) | Fonts |
| --- | --- | --- |
| Classic / garden | **Ink & Cream** (light) with a sage or blush accent | Cormorant Garamond + Hanken Grotesk, script accent: Pinyon Script |
| Romantic / blush | **Rose Quartz** (light) | Cormorant Garamond + DM Sans, Pinyon Script |
| Royal / festive | **Noir Gold** (dark) or **Terracotta** | Cormorant Garamond + Hanken Grotesk |
| Beach / modern | **Glacier** (light) | Instrument Serif + Geist |

Load the script face only for the couple’s names and a few flourish words:
`family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=Pinyon+Script&family=Hanken+Grotesk:wght@300..700`.
Set `--font-mono` to the body font (labels are small uppercase, wide-tracked) and add `--font-script:'Pinyon Script',cursive`. **Do not** keep the core’s uppercase mono look; wedding labels are soft.

### C3. Section order (all required)

0. **Curtain intro** (replaces the core loader: **omit `<div class="loader">`**) — two panels and a wax-seal button “Open invitation”; skipped for returning visitors in the same session.
1. **Hero** — “We’re getting married”, names in script at huge scale, date and city, **countdown**, Save-the-date and RSVP buttons, floating petals.
2. **Our story** — 4–5 timeline moments (how we met, first trip, the proposal…), alternating layout, each with a photo or generated art.
3. **The details** — cards for each event (Ceremony, Reception, + optional Mehendi/Sangeet/Brunch): date, time, venue, dress code, a map link, and **Add to calendar** (.ics download).
4. **Schedule of the day** — a vertical timeline with times.
5. **Travel & stay** — getting there, hotel blocks, local tips.
6. **Gallery** — 6–8 photos in a gentle masonry.
7. **Wedding party** — bridesmaids/groomsmen or family, with role and a playful line each.
8. **Gifts** — registry/gift cards (no pressure wording) with copy-to-clipboard for a UPI/bank placeholder.
9. **RSVP** — name, attending yes/no, number of guests, meal choice, dietary notes, song request, message. Saves locally and shows a warm confirmation.
10. **Guestbook** — recent wishes list (stored on the device, clearly labelled as a demo) and a form to add one.
11. **FAQ** — dress code, kids, parking, plus-ones, photography, weather plan.
12. **Footer** — hashtag, contact for questions, “With love” signature.

### C3b. Visual plan (MANDATORY; keys refer to the photo library in A4.2)

Weddings are emotional; imagery must be soft, warm and plentiful. Build all of these:

| Where | What to build | Photos |
| --- | --- | --- |
| Hero | Soft art + petals; add a **bento collage** (`.cg`) of five wedding photos below the countdown on desktop, stacked marquee on mobile | `wedding.00` `wedding.08` `wedding.18` `wedding.21` `wedding.13` |
| Our story (5 moments, arched 4:5 frames) | One photo each in order | `wedding.17` `wedding.08` `wedding.18` `wedding.13` `wedding.21` |
| Event cards | Each card opens with a 16:9 venue photo | ceremony `wedding.06` · reception `wedding.19` or `wedding.03` · extra event `hotel.11` or `wedding.20` |
| Travel & stay | 3 photos for hotels and surroundings | `hotel.02` `hotel.08` `hotel.05` |
| **Gallery** (`id="gallery"`, add to nav) | “Moments”: masonry of **12**, chips **Us · Details · Venue** | Us: `wedding.00` `wedding.08` `wedding.10` `wedding.13` `wedding.18` `wedding.21` `wedding.22` · Details: `wedding.01` `wedding.09` `wedding.14` `wedding.15` `wedding.12` · Venue: `wedding.03` `wedding.06` `wedding.07` `wedding.19` `wedding.20` |
| Under the story | **Photo marquee** (A4.5) | `wedding.02` `wedding.04` `wedding.11` `wedding.23` `food.03` `food.23` `nature.06` `nature.16` |
| Wedding party (8 round portraits) | 4 women, 4 men | women `people.00` `people.03` `people.06` `people.07` · men `people.01` `people.02` `people.20` `people.25` |

Use `<body data-art-kinds="petals,mesh,rings">`. Total distinct photos ≥ 40. Tell the couple to replace every stock photo with their own.

### C4. Signature moment

**The curtain opens.** A wax seal invites a tap; the two panels slide apart, the names rise out of the page in script, petals begin to fall (a few, slowly), and the countdown starts ticking. Everything afterwards is quiet and unhurried.

### C5. Page-specific CSS (append after A6)

```css
:root{--font-script:'Pinyon Script',cursive}
h1,h2,h3{font-weight:400}
.script{font-family:var(--font-script);font-weight:400;letter-spacing:0;line-height:1.05}
.eyebrow{text-transform:uppercase;letter-spacing:.28em;font-family:var(--font-body)}
.eyebrow::before{display:none}
.center{text-align:center}
.divider{display:flex;align-items:center;gap:1rem;justify-content:center;color:var(--accent);margin-block:1.4rem}
.divider::before,.divider::after{content:"";height:1px;width:min(120px,20vw);background:currentColor;opacity:.5}

/* curtain */
.curtain{position:fixed;inset:0;z-index:9998;display:grid;place-items:center;overflow:hidden}
.curtain .half{position:absolute;top:0;bottom:0;width:50.5%;background:var(--surface-2);transition:transform 1.4s var(--ease-in-out);
  background-image:radial-gradient(120% 80% at 50% 0%,rgb(var(--accent-rgb) / .18),transparent 60%)}
.curtain .l{left:0}.curtain .r{right:0}
.curtain.open .l{transform:translateX(-101%)}.curtain.open .r{transform:translateX(101%)}
.seal{position:relative;z-index:2;display:grid;place-items:center;width:clamp(120px,32vw,168px);aspect-ratio:1;border-radius:50%;
  background:radial-gradient(circle at 35% 30%,color-mix(in srgb,var(--accent) 80%,#fff),var(--accent) 55%,color-mix(in srgb,var(--accent) 60%,#000));
  color:var(--on-accent);box-shadow:0 18px 50px -10px rgb(var(--accent-rgb) / .6),inset 0 0 0 6px rgb(255 255 255 / .12);
  transition:transform .6s var(--ease-out),opacity .5s .2s;animation:sealPulse 3s var(--ease-in-out) infinite}
.seal span{font:400 clamp(2rem,9vw,3rem)/1 var(--font-script)}
.seal small{position:absolute;bottom:-2.4rem;white-space:nowrap;color:var(--text-2);font:500 .72rem/1 var(--font-body);letter-spacing:.28em;text-transform:uppercase}
.seal:active{transform:scale(.94)}
.curtain.open .seal{transform:scale(1.4);opacity:0;pointer-events:none}
@keyframes sealPulse{50%{transform:scale(1.04)}}
@media (hover:hover) and (pointer:fine){.seal:hover{transform:scale(1.06)}}

/* hero entrance only starts after opening */
.js:not(.opened) .hero-in{opacity:0;transform:translateY(24px)}
.hero-in{transition:opacity 1.4s var(--ease-out),transform 1.6s var(--ease-out);transition-delay:calc(.35s + var(--i,0)*.16s)}
.hero{min-height:100svh;display:grid;place-items:center;padding:110px 0 80px;position:relative;text-align:center;overflow:clip}
.hero::before{content:"";position:absolute;inset:0;z-index:-1;
  background:radial-gradient(60% 50% at 50% 0%,rgb(var(--accent-rgb) / .16),transparent 70%),radial-gradient(50% 40% at 50% 100%,rgb(var(--accent-rgb) / .1),transparent 70%)}
.hero .small-caps{letter-spacing:.34em;text-transform:uppercase;font-size:var(--step--1);color:var(--text-2)}
.hero .names{font-size:clamp(3.4rem,15vw,11rem);margin:.4em 0 .1em}
.hero .names .amp{display:block;font-size:.5em;color:var(--accent);line-height:.9}
.hero .when{font:400 var(--step-2)/1.2 var(--font-display);font-style:italic}
.countdown{display:flex;gap:clamp(.6rem,2.5vw,1.6rem);justify-content:center;margin:2rem 0}
.countdown div{min-width:clamp(62px,18vw,96px);padding:.9rem .3rem;border:1px solid var(--line);border-radius:999px 999px 20px 20px;background:rgb(var(--bg-rgb,246 243 238) / .6)}
.countdown b{display:block;font:400 clamp(1.6rem,6vw,2.6rem)/1 var(--font-display);font-variant-numeric:tabular-nums}
.countdown small{font:500 .62rem/1 var(--font-body);letter-spacing:.2em;text-transform:uppercase;color:var(--text-2)}
.cta-row{display:flex;flex-wrap:wrap;gap:.7rem;justify-content:center}
.btn{letter-spacing:.14em;text-transform:uppercase;font-size:.78rem}

/* petals */
.petals{position:fixed;inset:0;pointer-events:none;z-index:50;overflow:hidden}
.petal{position:absolute;top:-6vh;width:var(--s);height:calc(var(--s)*1.35);background:radial-gradient(circle at 30% 30%,color-mix(in srgb,var(--accent) 55%,#fff),var(--accent));
  border-radius:80% 0 80% 0;opacity:.0;animation:fall var(--d) linear var(--delay) infinite}
@keyframes fall{0%{transform:translate3d(0,-6vh,0) rotate(0);opacity:0}10%{opacity:.7}100%{transform:translate3d(var(--x),108vh,0) rotate(540deg);opacity:0}}

/* story */
.timeline{display:grid;gap:clamp(36px,6vw,80px)}
.moment{display:grid;gap:1.2rem;align-items:center}
@media (min-width:861px){.moment{grid-template-columns:1fr 1fr;gap:clamp(32px,6vw,96px)}.moment:nth-child(even) .moment-media{order:2}}
.moment-media{aspect-ratio:4/5;border-radius:200px 200px 24px 24px;overflow:hidden}
.moment-media .media{border-radius:0;height:100%}
.moment .year{font:400 var(--step-1)/1 var(--font-script);color:var(--accent);font-size:2rem}

/* events */
.events{display:grid;gap:14px}
@media (min-width:861px){.events{grid-template-columns:repeat(auto-fit,minmax(280px,1fr))}}
.event{text-align:center;display:grid;gap:.7rem;justify-items:center;padding:clamp(24px,4vw,40px);border-radius:200px 200px 28px 28px}
.event .ti-ico{font-size:34px;color:var(--accent)}
.event h3{font:400 var(--step-3)/1 var(--font-display);font-style:italic}
.event dl{display:grid;gap:.15rem}.event dt{font-size:.68rem;letter-spacing:.24em;text-transform:uppercase;color:var(--text-3);margin-top:.6rem}.event dd{margin:0}
.event .btn{margin-top:.6rem}

/* day schedule */
.sched{max-width:560px;margin-inline:auto;position:relative;padding-left:2rem}
.sched::before{content:"";position:absolute;left:.45rem;top:.4rem;bottom:.4rem;width:1px;background:var(--line)}
.sched li{position:relative;padding:.6rem 0 1.4rem}
.sched li::before{content:"";position:absolute;left:-1.85rem;top:1rem;width:11px;height:11px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 5px rgb(var(--accent-rgb) / .18)}
.sched time{font:500 .8rem/1 var(--font-body);letter-spacing:.2em;text-transform:uppercase;color:var(--accent)}
.sched h3{font:400 var(--step-1)/1.2 var(--font-display);margin-top:.3rem}

.masonry{columns:2;column-gap:12px}@media (min-width:861px){.masonry{columns:3}}
.masonry .media{margin-bottom:12px;break-inside:avoid;border-radius:18px}
.party{display:grid;gap:18px;grid-template-columns:repeat(2,1fr)}@media (min-width:861px){.party{grid-template-columns:repeat(4,1fr)}}
.person{text-align:center}.person .media{aspect-ratio:1;border-radius:50%;margin-bottom:.8rem}.person small{color:var(--text-2);display:block}
.gifts{display:grid;gap:12px}@media (min-width:861px){.gifts{grid-template-columns:repeat(3,1fr)}}
.row2{display:grid;gap:12px;grid-template-columns:1fr 1fr}
.choice{display:flex;gap:.6rem;flex-wrap:wrap}
.choice label{position:relative}.choice input{position:absolute;opacity:0;inset:0}
.choice span{display:grid;place-items:center;min-height:48px;padding:0 1.4rem;border:1px solid var(--line);border-radius:999px;cursor:pointer;transition:background-color var(--t-hover),color var(--t-hover),border-color var(--t-hover)}
.choice input:checked+span{background:var(--accent);color:var(--on-accent);border-color:var(--accent)}
.choice input:focus-visible+span{outline:2px solid var(--accent);outline-offset:3px}
.rsvp-card{max-width:720px;margin-inline:auto}
.wish-list{display:grid;gap:12px;margin-top:1.6rem}
.wish{padding:1.1rem 1.3rem;border-radius:18px;border:1px solid var(--line);background:var(--surface);animation:cardIn .6s var(--ease-out) both}
.wish b{font-family:var(--font-script);font-weight:400;font-size:1.6rem;color:var(--accent)}
@keyframes cardIn{from{opacity:0;transform:translateY(12px)}}
.faq details{border-bottom:1px solid var(--line)}
.faq summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;gap:1rem;padding:1.2rem 0;font:400 var(--step-1)/1.3 var(--font-display)}
.faq summary::-webkit-details-marker{display:none}.faq summary i{transition:transform .4s var(--ease-out)}
.faq details[open] summary i{transform:rotate(45deg)}.faq .ans{padding-bottom:1.3rem;color:var(--text-2);max-width:62ch}
.hashtag{font:400 clamp(2rem,8vw,4.5rem)/1 var(--font-script);color:var(--accent)}
@media (prefers-reduced-motion:reduce){.petals{display:none}.seal{animation:none}}
```

### C6. Markup patterns

**Curtain (first child of `<body>`; no `.loader`)**

```html
<div class="curtain" id="curtain" role="dialog" aria-modal="true" aria-label="Wedding invitation">
  <div class="half l"></div><div class="half r"></div>
  <button class="seal" id="seal" aria-label="Open the invitation"><span>A&amp;R</span><small>Tap to open</small></button>
</div>
<div class="petals" id="petals" aria-hidden="true"></div>
```

**Hero** (every child has `class="hero-in"` with `style="--i:N"`, not `data-reveal`)

```html
<section class="hero" id="top-hero"><div class="wrap">
  <p class="small-caps hero-in" style="--i:0">Together with their families</p>
  <h1 class="names script hero-in" style="--i:1">Aanya <span class="amp">&amp;</span> Rohan</h1>
  <p class="when hero-in" style="--i:2">Saturday, 14 February 2027 · Udaipur, Rajasthan</p>
  <div class="countdown hero-in" style="--i:3" role="timer" aria-label="Time until the wedding">
    <div><b data-cd="d">000</b><small>Days</small></div><div><b data-cd="h">00</b><small>Hours</small></div><div><b data-cd="m">00</b><small>Minutes</small></div><div><b data-cd="s">00</b><small>Seconds</small></div>
  </div>
  <div class="cta-row hero-in" style="--i:4"><a href="#rsvp" class="btn btn-primary btn-lg" data-magnetic>RSVP</a><button class="btn btn-ghost btn-lg" data-ics="main"><i class="ti ti-calendar-plus" aria-hidden="true"></i> Save the date</button></div>
</div></section>
```

**Event card** (dates in ISO for the calendar)

```html
<article class="card event" data-reveal
  data-ics-title="Aanya &amp; Rohan — Wedding Ceremony" data-start="2027-02-14T16:30:00+05:30" data-end="2027-02-14T18:30:00+05:30"
  data-location="Jagmandir Island Palace, Udaipur" data-desc="Dress code: traditional Indian attire in pastel shades.">
  <i class="ti ti-ico ti-heart" aria-hidden="true"></i><h3>The Ceremony</h3>
  <dl><dt>When</dt><dd>Saturday, 14 February 2027 · 4:30 pm</dd><dt>Where</dt><dd>Jagmandir Island Palace, Udaipur</dd><dt>Dress code</dt><dd>Traditional · pastel tones</dd></dl>
  <a class="btn btn-ghost" href="https://www.google.com/maps/search/?api=1&query=Jagmandir+Island+Palace+Udaipur" target="_blank" rel="noopener">Directions</a>
  <button class="btn btn-ghost" data-ics="event"><i class="ti ti-calendar-plus" aria-hidden="true"></i> Add to calendar</button>
</article>
```

Make `.ti-ico` a Tabler icon by adding the `ti` class as well (`class="ti ti-heart ti-ico"`).

**RSVP form** (fields: `name`, `attending` radios yes/no, `guests` select 1–4, `meal` radios (Vegetarian / Non-vegetarian / Vegan / Jain), `diet` text, `song` text, `note` textarea)

```html
<form class="card rsvp-card stack" id="rsvp-form" style="--stack:1.2rem" novalidate>
  <div class="field"><label for="r-name">Your name</label><input id="r-name" name="name" autocomplete="name" required></div>
  <fieldset class="field" style="border:0"><legend>Will you join us?</legend><div class="choice"><label><input type="radio" name="attending" value="yes" required checked><span>Joyfully accepts</span></label><label><input type="radio" name="attending" value="no"><span>Regretfully declines</span></label></div></fieldset>
  <div id="rsvp-more" class="stack" style="--stack:1.2rem">
    <div class="row2"><div class="field"><label for="r-guests">Guests</label><select id="r-guests" name="guests"><option>1</option><option>2</option><option>3</option><option>4</option></select></div><div class="field"><label for="r-diet">Dietary notes</label><input id="r-diet" name="diet" placeholder="Allergies, preferences"></div></div>
    <fieldset class="field" style="border:0"><legend>Meal</legend><div class="choice"><label><input type="radio" name="meal" value="Vegetarian" checked><span>Vegetarian</span></label><label><input type="radio" name="meal" value="Non-vegetarian"><span>Non-vegetarian</span></label><label><input type="radio" name="meal" value="Vegan"><span>Vegan</span></label></div></fieldset>
    <div class="field"><label for="r-song">A song that will get you dancing</label><input id="r-song" name="song"></div>
  </div>
  <div class="field"><label for="r-note">A note for the couple</label><textarea id="r-note" name="note"></textarea></div>
  <button class="btn btn-primary btn-lg btn-block" type="submit">Send RSVP</button>
  <p class="form-status" role="status" hidden></p>
</form>
```

**Guestbook** (`<form id="wish-form">` with `name` and `message`, plus `<div class="wish-list" id="wish-list"></div>`), **gift card** (`<button class="btn btn-ghost" data-copy="aanya@upi">Copy UPI ID</button>`), **FAQ** with `<details>`.

### C7. Page-specific JavaScript

```js
(() => {
  const { $, $$, reduce, lenis, safe } = window.site;
  const doc = document.documentElement;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
  const WEDDING = new Date('2027-02-14T16:30:00+05:30').getTime();   /* AI: set from the brief; must be in the future */

  /* ───── curtain ───── */
  const curtain = $('#curtain'), seal = $('#seal');
  let seen = false; try { seen = !!sessionStorage.getItem('wedding-open'); } catch {}
  const lock = on => { lenis ? (on ? lenis.stop() : lenis.start()) : (document.body.style.overflow = on ? 'hidden' : ''); };
  const openInvite = () => {
    if (doc.classList.contains('opened')) return;
    curtain && curtain.classList.add('open'); doc.classList.add('opened'); lock(false);
    try { sessionStorage.setItem('wedding-open', '1'); } catch {}
    setTimeout(() => curtain && curtain.remove(), 1700);
    startPetals();
    window.dispatchEvent(new Event('wedding:opened'));
  };
  if (!curtain || seen || reduce) { curtain && curtain.remove(); doc.classList.add('opened'); setTimeout(startPetals, 600); }
  else { lock(true); seal.addEventListener('click', openInvite); seal.focus({ preventScroll: true }); setTimeout(() => { /* failsafe so guests are never locked out */ if (!doc.classList.contains('opened')) openInvite(); }, 60000); }

  /* ───── petals ───── */
  function startPetals() {
    const box = $('#petals'); if (!box || reduce || box.childElementCount) return;
    const n = innerWidth < 700 ? 9 : 16;
    for (let i = 0; i < n; i++) {
      const p = document.createElement('i'); p.className = 'petal';
      p.style.cssText = `left:${Math.random() * 100}%;--s:${8 + Math.random() * 10}px;--d:${14 + Math.random() * 14}s;--delay:${-Math.random() * 20}s;--x:${(Math.random() * 160 - 80)}px`;
      box.append(p);
    }
  }

  /* ───── countdown ───── */
  const cd = { d: $('[data-cd="d"]'), h: $('[data-cd="h"]'), m: $('[data-cd="m"]'), s: $('[data-cd="s"]') };
  const pad = (n, l = 2) => String(Math.max(0, n)).padStart(l, '0');
  const tick = () => {
    const ms = WEDDING - Date.now(), s = Math.max(0, Math.floor(ms / 1000));
    cd.d && (cd.d.textContent = pad(Math.floor(s / 86400), 3)); cd.h && (cd.h.textContent = pad(Math.floor(s % 86400 / 3600)));
    cd.m && (cd.m.textContent = pad(Math.floor(s % 3600 / 60))); cd.s && (cd.s.textContent = pad(s % 60));
  };
  safe(tick); setInterval(() => safe(tick), 1000);

  /* ───── add to calendar (.ics download) ───── */
  const icsText = s => String(s).replace(/\\/g, '\\\\').replace(/[,;]/g, '\\$&').replace(/\n/g, '\\n');
  const stamp = d => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const download = (name, title, start, end, location, desc) => {
    const body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Wedding//EN', 'BEGIN:VEVENT', `UID:${stamp(start)}-${Math.random().toString(36).slice(2)}@wedding`, `DTSTAMP:${stamp(new Date())}`,
      `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`, `SUMMARY:${icsText(title)}`, `LOCATION:${icsText(location)}`, `DESCRIPTION:${icsText(desc)}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const url = URL.createObjectURL(new Blob([body], { type: 'text/calendar;charset=utf-8' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: name + '.ics' });
    document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1500);
  };
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-ics]'); if (!b) return;
    const ev = b.closest('[data-start]');
    if (ev) download('wedding-event', ev.dataset.icsTitle, new Date(ev.dataset.start), new Date(ev.dataset.end), ev.dataset.location, ev.dataset.desc || '');
    else download('save-the-date', document.title, new Date(WEDDING), new Date(WEDDING + 3 * 3600e3), '', 'We can’t wait to celebrate with you.');
    toast('Calendar file downloaded');
  });

  /* ───── toast ───── */
  function toast(msg) {
    let t = $('#toast'); if (!t) { t = document.createElement('div'); t.id = 'toast'; t.setAttribute('role', 'status');
      t.style.cssText = 'position:fixed;left:50%;bottom:24px;translate:-50% 0;z-index:9000;padding:.8rem 1.3rem;border-radius:999px;background:var(--text);color:var(--bg);font-size:.9rem;opacity:0;transition:opacity .3s;pointer-events:none'; document.body.append(t); }
    t.textContent = msg; t.style.opacity = 1; clearTimeout(t._t); t._t = setTimeout(() => { t.style.opacity = 0; }, 2400);
  }
  $$('[data-copy]').forEach(b => b.addEventListener('click', async () => { try { await navigator.clipboard.writeText(b.dataset.copy); toast('Copied'); } catch { toast(b.dataset.copy); } }));

  /* ───── RSVP ───── */
  const rf = $('#rsvp-form');
  if (rf) {
    const more = $('#rsvp-more');
    const sync = () => { const no = rf.attending.value === 'no'; more.hidden = no; $$('input,select', more).forEach(i => i.disabled = no); };
    rf.addEventListener('change', sync); sync();
    rf.addEventListener('submit', e => {
      e.preventDefault();
      const nameEl = rf.elements['name'];
      if (!nameEl.value.trim()) { nameEl.focus(); rf.reportValidity(); return; }
      const data = Object.fromEntries(new FormData(rf)), list = load('rsvps-v1', []); list.push({ ...data, at: new Date().toISOString() }); save('rsvps-v1', list);
      const st = $('.form-status', rf), first = data.name.trim().split(' ')[0];
      st.textContent = data.attending === 'yes' ? `Thank you, ${first}! We can’t wait to celebrate with you.` : `Thank you for letting us know, ${first}. You’ll be missed.`;
      st.hidden = false; rf.reset(); sync();
    });
  }

  /* ───── guestbook (stored on this device only: demo) ───── */
  const wl = $('#wish-list'), wf = $('#wish-form');
  if (wl && wf) {
    const SEED = [{ n: 'Meera & Karan', m: 'Wishing you a lifetime of laughter and chai on the balcony.' }, { n: 'Uncle Sunil', m: 'Aanya, you were born to shine. Rohan, welcome to the family!' }];
    const render = () => { const all = [...load('wishes-v1', []), ...SEED]; wl.innerHTML = all.map((w, i) => `<div class="wish" style="animation-delay:${i * 60}ms"><b>${esc(w.n)}</b><p>${esc(w.m)}</p></div>`).join(''); };
    render();
    wf.addEventListener('submit', e => {
      e.preventDefault(); const n = wf.elements['name'].value.trim(), m = wf.elements['message'].value.trim(); if (!n || !m) { wf.reportValidity(); return; }
      const mine = load('wishes-v1', []); mine.unshift({ n, m }); save('wishes-v1', mine); wf.reset(); render(); toast('Thank you for your wishes');
    });
  }
})();
```

Rules for the script:
- Replace the `WEDDING` date and the `data-start`/`data-end` values with future dates from the brief. All event times must carry a timezone offset.
- The guestbook and RSVP store data **only in this browser** (demo). The closing notes must say so and recommend connecting a form service (Formspree, Google Forms, Netlify Forms, or a Google Sheet via Apps Script) before sharing the link.
- Hero children use `.hero-in` (not `data-reveal`) so they animate only after the curtain opens.

### C8. Content rules

- **Names and story**: invent a charming, specific couple story (met at a friend’s terrace, a monsoon road trip, a proposal at sunrise). Keep it warm and light-hearted; no clichés like “soulmates for eternity”.
- **Events**: ceremony, reception, and one optional event; real-feeling venue names, plausible local times, and a dress-code line that gives guests colours or styles.
- **Schedule**: 6–8 entries (Guests arrive 4:00 · Ceremony 4:30 · Cocktails 6:00 · Dinner 7:30 · First dance 9:00 · Last song 11:30).
- **Travel**: nearest airport/station with distance, two hotels with “mention our wedding” note, a local tip.
- **Wedding party**: 6–8 invented names with roles and one affectionate line each.
- **Gifts**: tone is gracious (“Your presence is the greatest gift”), with optional registry link placeholders and a UPI/bank placeholder.
- **Images**: all from the verified library (A4.2) following the visual plan (C3b); the gallery uses the core component (A4.4). Tell the couple to replace every stock photo with their own.
- **Privacy**: no phone numbers or addresses of private individuals beyond what the brief supplies; invent contact details clearly as placeholders.

### C9. Wedding-specific checklist

- [ ] Curtain opens by tap/Enter, is skipped on repeat visits and reduced motion, and can never trap a guest (failsafe)
- [ ] Hero entrance runs after opening; petals are few, slow, behind content, and off for reduced motion
- [ ] Countdown is correct, ticks every second, and shows zero (not negative) after the date
- [ ] Add-to-calendar downloads a valid `.ics` for each event and the save-the-date
- [ ] RSVP hides extra fields when declining, validates the name, and gives a warm confirmation
- [ ] Guestbook escapes HTML and clearly acts as a demo
- [ ] Script font used only for names and flourishes; body text stays readable at 390px
- [ ] Contrast checked on light palettes (accent text ≥ 4.5:1 or used only for large script)
- [ ] Closing notes list: dates to confirm, photos to replace, and the form service to connect

---

## ═══════════════════════════════════════════════
## PART D — QUICK-START PROMPTS
## ═══════════════════════════════════════════════

```
Build our wedding website. Couple: Aanya & Rohan. Date: 14 February 2027, ceremony 4:30 pm. Venue: Jagmandir Island Palace, Udaipur.
Style: royal and romantic. Palette: Noir Gold. Events: Mehendi (12 Feb), Sangeet (13 Feb), Ceremony and Reception (14 Feb). Hashtag: invent.
```

```
Build our wedding website. Couple: Emma & Daniel. Date: 6 June 2027, 3 pm. Venue: Brightwater Gardens, Napa Valley.
Style: garden party, soft and airy. Palette: Rose Quartz (light). Events: ceremony, reception, farewell brunch. Hashtag: invent.
```


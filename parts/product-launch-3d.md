# PREMIUM 3D PRODUCT LAUNCH WEBSITE (THREE.JS) — MASTER PROMPT v1.0
### One prompt → one complete, cinematic, WebGL-powered `index.html` for a product drop, hardware, app or brand reveal

> **HOW TO USE**
> 1. Paste this ENTIRE file into any capable AI (Claude, GPT, Gemini…).
> 2. Then send: `Build a launch site for <PRODUCT> — <what it is, one line>. Palette: <name or "you choose">. Launch date: <date or "invent">. Price: <price or "invent">.`
> 3. The AI returns a single `index.html`. Save it, open it from a local server or any static host (WebGL import maps need `http(s)`, not always `file://`).

If any detail is missing, **invent believable specifics** instead of asking questions.

{{CORE}}

---

## ═══════════════════════════════════════════════
## PART C — 3D PRODUCT LAUNCH SPECIFICATION
## ═══════════════════════════════════════════════

### C1. Goal

A teaser-to-waitlist experience. One scene, one object, one story told by scrolling. The 3D piece must **earn** its weight: it is the product (or a stand-in for it), not wallpaper. Everything is built from CDN Three.js plus procedural geometry, so no model files are needed.

### C2. Direction

Default **Violet Hour** (creative/AI) or **Ember** (hardware, sport). Alternatives: **Blueprint**, **Solar**, **Mono Lime**. Fonts: Syne or Space Grotesk for display, Geist body, JetBrains Mono for labels. Dark backgrounds make the lighting read best.

### C3. Section order (all required)

1. **Hero** — product name huge, one-line promise, launch date chip, waitlist email form, the 3D object centre/right, particles behind.
2. **Scroll story (pinned)** — the object rotates, scales and shifts colour across **three beats**, each with a caption (left/right alternating).
3. **Spec grid** — 6 specs with Tabler icons and tabular numbers.
4. **Detail strip** — 3 short cards that explain one innovation each.
5. **Voices** — early-tester quotes or press lines.
6. **Waitlist CTA** — repeat the form, counter of people already on the list (`data-count`), launch countdown.
7. **FAQ** — 4 `<details>` items (shipping, warranty, price, compatibility).
8. **Footer.**

### C4. Signature moment

The **pinned scroll story**: while the section is pinned, a single GSAP timeline scrubs the 3D object’s rotation, scale, camera distance and colour, with captions fading in sync. Hero pointer parallax tilts the object gently. Nothing else competes.

### C5. Page-specific CSS (append after A6)

```css
#gl{position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none}
main,.site-footer{position:relative;z-index:1}
.no-webgl #gl{display:none}
.no-webgl .hero::before{content:"";position:absolute;right:6%;top:18%;width:min(60vw,520px);aspect-ratio:1;border-radius:50%;z-index:-1;
  background:radial-gradient(circle at 35% 30%,rgb(var(--accent-rgb) / .9),rgb(var(--accent-rgb) / .15) 55%,transparent 70%);filter:blur(2px)}

.hero{min-height:100svh;display:grid;align-content:center;padding:120px 0 80px;position:relative}
.hero h1{font-size:var(--step-5);line-height:.88;letter-spacing:-.05em;max-width:9ch;mix-blend-mode:normal}
.hero .lead{margin:1.2rem 0 1.8rem}
.date-chip{display:inline-flex;gap:.6rem;align-items:center;padding:.4rem .9rem;border-radius:var(--r-pill);border:1px solid var(--line);background:rgb(var(--bg-rgb,11 11 12) / .5);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);font:500 var(--step--1)/1 var(--font-mono);letter-spacing:.06em}
.date-chip i{width:7px;height:7px;border-radius:50%;background:var(--accent)}
.wait{display:flex;flex-wrap:wrap;gap:.6rem;max-width:520px}
.wait .field{flex:1 1 220px}
.wait .btn{flex:0 0 auto}
.hint{margin-top:.7rem;color:var(--text-3);font-size:var(--step--1)}

/* pinned story */
.story{height:100svh;position:relative;overflow:hidden}
.beat{position:absolute;inset:0;display:grid;align-content:center;padding-inline:var(--gutter);opacity:0}
.beat .copy{max-width:30ch;display:grid;gap:.8rem}
.beat .n{font:500 var(--step--1)/1 var(--font-mono);color:var(--accent);letter-spacing:.14em}
.beat h2{font-size:var(--step-4);line-height:.95}
.beat p{color:var(--text-2)}
@media (min-width:861px){.beat:nth-child(even) .copy{justify-self:end;text-align:right}.beat:nth-child(odd) .copy{justify-self:start}}
.story-meter{position:absolute;left:var(--gutter);right:var(--gutter);bottom:28px;height:2px;background:var(--line)}
.story-meter i{position:absolute;inset:0;background:var(--accent);transform-origin:0 50%;transform:scaleX(0)}

/* specs, details, voices */
.specs{display:grid;gap:12px;grid-template-columns:repeat(2,1fr)}
@media (min-width:861px){.specs{grid-template-columns:repeat(3,1fr)}}
.spec{padding:clamp(16px,3vw,28px)}
.spec b{display:block;margin-top:1.4rem;font:500 var(--step-3)/1 var(--font-display);letter-spacing:-.03em;font-variant-numeric:tabular-nums}
.spec small{color:var(--text-2)}
.details{display:grid;gap:12px}
@media (min-width:861px){.details{grid-template-columns:repeat(3,1fr)}}
.voices{display:grid;gap:12px}
@media (min-width:861px){.voices{grid-template-columns:repeat(3,1fr)}}
.voices blockquote{font:400 var(--step-1)/1.35 var(--font-display)}
.count-row{display:flex;flex-wrap:wrap;gap:1.5rem 3rem;align-items:baseline}
.count-row b{font:500 var(--step-4)/1 var(--font-display);letter-spacing:-.04em;font-variant-numeric:tabular-nums}
.countdown{display:flex;gap:.8rem}
.countdown div{min-width:72px;padding:.8rem;border:1px solid var(--line);border-radius:14px;text-align:center;background:var(--surface)}
.countdown b{display:block;font:500 var(--step-2)/1 var(--font-mono);font-variant-numeric:tabular-nums}
.countdown small{font:500 .65rem/1 var(--font-mono);letter-spacing:.12em;text-transform:uppercase;color:var(--text-3)}
.faq details{border-bottom:1px solid var(--line)}
.faq summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;gap:1rem;padding:1.2rem 0;font:500 var(--step-1)/1.3 var(--font-display)}
.faq summary::-webkit-details-marker{display:none}
.faq summary i{transition:transform .4s var(--ease-out)}
.faq details[open] summary i{transform:rotate(45deg)}
.faq .ans{padding-bottom:1.4rem;color:var(--text-2);max-width:62ch}
```

Sections that sit over the canvas use transparent backgrounds. Where text needs a calm surface, give that block `background: rgb(var(--bg-rgb) / .72)` with a backdrop blur instead of an opaque fill.

### C6. Import map and canvas (inside `<head>` before any module, and as first child of `<body>`)

```html
<script type="importmap">
{ "imports": {
  "three": "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js",
  "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/"
} }
</script>
<!-- body -->
<canvas id="gl" aria-hidden="true"></canvas>
```

### C7. The 3D scene (a `<script type="module">` placed after the two classic scripts)

The product stand-in is a polished torus-knot “artifact” with studio lighting, orbited by a soft particle field. Swap geometry to suit the product (rounded box for a device, cylinder for a bottle, sphere for an orb) while keeping the rest.

```html
<script type="module">
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const canvas = document.getElementById('gl');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const small = matchMedia('(max-width: 860px)').matches;
const cssVar = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

let renderer;
try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' }); }
catch { document.documentElement.classList.add('no-webgl'); }

if (renderer) {
  renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.25 : 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;     /* instant studio reflections */

  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 0, 7);

  /* product stand-in */
  const colA = new THREE.Color(cssVar('--accent') || '#9b6bff');
  const colB = new THREE.Color(cssVar('--accent-2') || '#ff6bd5');
  const mat = new THREE.MeshPhysicalMaterial({ color: colA, metalness: 1, roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 1.25 });
  const hero = new THREE.Mesh(new THREE.TorusKnotGeometry(1, 0.34, small ? 160 : 260, small ? 24 : 40), mat);
  const group = new THREE.Group(); group.add(hero); scene.add(group);

  /* accent lights give the metal colour in reflections */
  const l1 = new THREE.PointLight(colB, 40, 12); l1.position.set(-3, 2, 3); scene.add(l1);
  const l2 = new THREE.PointLight(colA, 30, 12); l2.position.set(3, -2, 2); scene.add(l2);

  /* particles */
  const N = small ? 1800 : 5000, pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const r = 3.2 + Math.random() * 4.5, a = Math.random() * Math.PI * 2, b = Math.acos(2 * Math.random() - 1);
    pos.set([r * Math.sin(b) * Math.cos(a), r * Math.sin(b) * Math.sin(a) * 0.7, r * Math.cos(b)], i * 3);
  }
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const pm = new THREE.PointsMaterial({ size: 0.022, color: colB, transparent: true, opacity: 0.7, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true });
  const dust = new THREE.Points(pg, pm); scene.add(dust);

  /* layout: object right of copy on desktop, above copy on mobile */
  const state = { rotY: 0, rotX: 0, scale: 1, camZ: 7, x: 0, y: 0, mix: 0, px: 0, py: 0 };
  const placeHero = () => { state.x = small ? 0 : 1.7; state.y = small ? 1.1 : 0; state.camZ = small ? 9 : 7; };
  placeHero();

  const resize = () => {
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  };
  addEventListener('resize', resize); resize();

  /* pointer parallax (desktop) */
  const target = { x: 0, y: 0 };
  addEventListener('pointermove', e => { target.x = (e.clientX / innerWidth - 0.5); target.y = (e.clientY / innerHeight - 0.5); }, { passive: true });

  /* scroll story: scrub the state object with GSAP; the render loop reads it */
  const attachStory = () => {
    if (!(window.gsap && window.ScrollTrigger)) return;
    const story = document.querySelector('.story'); if (!story) return;
    const beats = [...story.querySelectorAll('.beat')], meter = story.querySelector('.story-meter i');
    const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: story, start: 'top top', end: '+=300%', scrub: 0.7, pin: true, anticipatePin: 1,
      onUpdate: s => { if (meter) meter.style.transform = `scaleX(${s.progress})`; } } });
    tl.to(state, { x: 0, y: 0, rotY: Math.PI * 0.9, scale: 1.25, camZ: 6, mix: 0.0, duration: 1 }, 0)
      .to(state, { x: small ? 0 : -1.7, rotY: Math.PI * 2.2, rotX: 0.5, scale: 1.0, mix: 0.5, duration: 1 }, 1)
      .to(state, { x: 0, rotY: Math.PI * 3.4, rotX: -0.2, scale: 1.55, camZ: 5.2, mix: 1, duration: 1 }, 2);
    beats.forEach((b, i) => {
      tl.fromTo(b, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.25 }, i + 0.05)
        .to(b, { opacity: 0, y: -24, duration: 0.25 }, i + 0.7);
    });
  };
  window.site ? attachStory() : addEventListener('load', attachStory);
  addEventListener('site:ready', () => { window.ScrollTrigger && ScrollTrigger.refresh(); });

  const cA = colA.clone(), cB = colB.clone(), tmp = new THREE.Color();
  let visible = true, raf = 0;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting || scrollY < innerHeight * 6; }).observe(canvas);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) loop(); });

  const clock = new THREE.Clock();
  function loop() {
    cancelAnimationFrame(raf);
    if (document.hidden) return;
    const t = clock.getElapsedTime();
    state.px += (target.x - state.px) * 0.05; state.py += (target.y - state.py) * 0.05;
    group.position.set(state.x + state.px * 0.4, state.y - state.py * 0.3, 0);
    hero.rotation.set(state.rotX + state.py * 0.35, state.rotY + (reduce ? 0 : t * 0.15) + state.px * 0.6, 0);
    group.scale.setScalar(state.scale);
    camera.position.z += (state.camZ - camera.position.z) * 0.08;
    tmp.copy(cA).lerp(cB, state.mix); mat.color.copy(tmp);
    dust.rotation.y = reduce ? 0 : t * 0.02; dust.rotation.x = reduce ? 0 : t * 0.01;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(loop);
  }
  loop();
  if (reduce) { /* one still frame is enough */ setTimeout(() => cancelAnimationFrame(raf), 400); }
}
</script>
```

Rules for the scene:
- The WebGL script is a **module** (deferred), so `window.site` already exists when it runs; the `load` fallback is only for safety.
- The canvas is fixed behind everything; sections are transparent. Do not create a second WebGL context.
- Keep pixel ratio capped and particle count mobile-reduced as shown; if frame rate would suffer, cut particles first.
- If the user supplies a real `.glb` URL on a CORS-friendly host, load it with `GLTFLoader` (import from `three/addons/loaders/GLTFLoader.js`) and keep the procedural object as a fallback if loading fails.
- Never ship without the `.no-webgl` CSS fallback (a radial-gradient orb behind the hero).

### C8. Page-specific markup patterns

**Hero**

```html
<section class="hero" id="top-hero"><div class="wrap">
  <span class="date-chip" data-reveal><i></i>Launching 14 March · Limited first run of 2,000</span>
  <h1 data-split style="margin-top:1.2rem">AURA ONE</h1>
  <p class="lead" data-reveal style="--i:3">A pocket-sized speaker that fills a room with sound from every direction. Sculpted from a single piece of aluminium.</p>
  <form class="wait" data-form data-success="You’re in. Check your inbox for early access." data-reveal style="--i:4">
    <div class="field"><label class="sr-only" for="wl">Email</label><input id="wl" name="email" type="email" autocomplete="email" inputmode="email" required placeholder="you@email.com"></div>
    <button class="btn btn-primary btn-lg" type="submit" data-magnetic>Join the waitlist <i class="ti ti-arrow-right" aria-hidden="true"></i></button>
    <p class="form-status" role="status" hidden style="flex-basis:100%"></p>
  </form>
  <p class="hint" data-reveal style="--i:5">3,412 people are already waiting. No spam, one email at launch.</p>
</div></section>
```

**Pinned story**

```html
<section class="story" id="story" aria-label="The product story">
  <article class="beat"><div class="copy"><span class="n">01 / FORM</span><h2>One piece. No seams.</h2><p>Milled from a single block of aluminium, then polished by hand for six hours.</p></div></article>
  <article class="beat"><div class="copy"><span class="n">02 / SOUND</span><h2>360° of clarity.</h2><p>Six drivers and a custom DSP tuned in an anechoic chamber.</p></div></article>
  <article class="beat"><div class="copy"><span class="n">03 / POWER</span><h2>A week on one charge.</h2><p>40 hours at full volume. Ten minutes of charging gives you four hours.</p></div></article>
  <div class="story-meter" aria-hidden="true"><i></i></div>
</section>
```

Captions must remain readable over the canvas: give `.copy` a soft text-shadow or a `rgb(var(--bg-rgb) / .55)` blurred backing.

**Countdown (page script)**

```js
(() => {
  const { $, $$, safe } = window.site;
  const target = new Date('2026-03-14T18:00:00Z').getTime();       /* replace with the invented launch date */
  const el = { d: $('[data-cd="d"]'), h: $('[data-cd="h"]'), m: $('[data-cd="m"]'), s: $('[data-cd="s"]') };
  const pad = n => String(Math.max(0, n)).padStart(2, '0');
  const tick = () => {
    const ms = Math.max(0, target - Date.now()), s = Math.floor(ms / 1000);
    if (el.d) el.d.textContent = pad(Math.floor(s / 86400));
    if (el.h) el.h.textContent = pad(Math.floor(s % 86400 / 3600));
    if (el.m) el.m.textContent = pad(Math.floor(s % 3600 / 60));
    if (el.s) el.s.textContent = pad(s % 60);
  };
  safe(tick); setInterval(() => safe(tick), 1000);
})();
```

Countdown markup: `<div class="countdown" role="timer" aria-label="Time until launch"><div><b data-cd="d">00</b><small>Days</small></div> …h, m, s…</div>`. Choose a launch date in the future relative to today.

### C9. Content rules

- **Product**: invent a precise name (two syllables is ideal), one-sentence promise, three real-sounding “innovations”, six specs with real units (weight 412 g, 40 h battery, IP67, 6 drivers, Bluetooth 5.4, USB-C 30 W).
- **Voices**: invented testers/press with outlet-style names that are not real publications (e.g. “Signal Weekly”), each praising one concrete feature.
- **Pricing**: one launch price, one “early supporter” perk; never fake scarcity beyond what the brief gives.
- **FAQ**: shipping dates, warranty length, return policy, compatibility.

### C10. 3D-specific checklist

- [ ] Page is fully readable and usable with WebGL blocked (fallback orb shows; copy is intact)
- [ ] Only one WebGL canvas; fixed behind transparent sections; text always has sufficient contrast
- [ ] Story pins exactly once; beats don't overlap illegibly; meter progresses
- [ ] Pixel ratio capped; particle count reduced on small screens; paused when tab hidden
- [ ] `prefers-reduced-motion`: no continuous rotation, static pose after first frame
- [ ] Import map is before the module script; versions pinned
- [ ] Waitlist form validates, shows loading, then success

---

## ═══════════════════════════════════════════════
## PART D — QUICK-START PROMPTS
## ═══════════════════════════════════════════════

```
Build a launch site for AURA ONE — a pocket-sized 360° speaker milled from a single piece of aluminium.
Palette: Violet Hour. Launch date: invent one three months from today. Price: $249.
```

```
Build a launch site for KILN — a ceramic pour-over coffee dripper with a built-in scale. Palette: Ember.
Launch date: invent. Price: ₹7,999. Use a rounded-cylinder stand-in instead of the torus knot.
```

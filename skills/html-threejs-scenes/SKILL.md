---
name: html-threejs-scenes
description: Add Three.js 3D and WebGL shader scenes to a CDN-only HTML page via an import map — particle fields, shader-gradient backgrounds, scroll-driven camera and mesh scenes, pointer parallax, plus performance, fallback and reduced-motion rules. Use when the user wants a 3D hero, WebGL background, particles, or a cinematic scroll-driven scene.
---

# Three.js Scenes in Plain HTML

Use Three.js for the one signature moment, not as wallpaper. A page with a 3D hero should have a calm rest of page. If the installed `threejs-*` skills (fundamentals, shaders, animation, postprocessing, loaders) are available, defer to them for API depth; this skill covers the CDN-only wiring and the patterns that ship well.

Patterns here follow recurring themes in Codrops' Three.js tutorials (shader-driven particles and backgrounds, HTML/WebGL sync, scroll-linked camera and distortion, post-processing for light and grain). Only search-result summaries of those articles were available, so treat the code below as a vetted starting point, not a transcription.

## 1. Wiring (import map, no bundler)

```html
<script type="importmap">
{ "imports": {
  "three": "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js",
  "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/"
} }
</script>
<canvas id="gl" aria-hidden="true"></canvas>
<script type="module"> import * as THREE from 'three'; /* scene code */ </script>
```

- Pin the version; the import map must come before any module script.
- Keep GSAP as a classic `<script>` and read it from `window.gsap` inside the module.
- Canvas is decoration: `aria-hidden="true"`, `pointer-events:none` when behind content.

```css
#gl{position:fixed;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none}
/* or position:absolute inside #hero for a hero-only scene */
```

## 2. Decide the scene

| Goal | Technique | Cost |
| --- | --- | --- |
| Atmospheric hero | Shader particle field + pointer parallax | Low |
| Colour-flow background | Fullscreen quad with a fragment shader (gradient noise) | Low |
| Product showcase | `GLTFLoader` model + soft lights + orbit-lite pointer tilt | Medium |
| Scroll story | One scene, camera/mesh driven by a ScrollTrigger timeline | Medium |
| Image distortion | Planes with textures synced to DOM images, shader ripple on hover/scroll | Medium–High |

## 3. Recipe — particle field hero (copy, then tune)

```html
<script type="module">
import * as THREE from 'three';

const canvas = document.getElementById('gl');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const small  = matchMedia('(max-width: 768px)').matches;

let renderer;
try { renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' }); }
catch { document.documentElement.classList.add('no-webgl'); }         // CSS shows a gradient fallback
if (renderer) {
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));             // cap DPR: biggest perf lever
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, .1, 100); camera.position.z = 6;

  const COUNT = small ? 6000 : 16000;
  const pos = new Float32Array(COUNT * 3), seed = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    const r = 3 + Math.random() * 3, a = Math.random() * Math.PI * 2, b = Math.acos(2 * Math.random() - 1);
    pos.set([r * Math.sin(b) * Math.cos(a), r * Math.sin(b) * Math.sin(a) * .6, r * Math.cos(b)], i * 3);
    seed[i] = Math.random();
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aSeed',    new THREE.BufferAttribute(seed, 1));

  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uTime:{value:0}, uPointer:{value:new THREE.Vector2()}, uScroll:{value:0},
                uPx:{value:renderer.getPixelRatio()}, uColA:{value:new THREE.Color('#ff5a36')}, uColB:{value:new THREE.Color('#ffb02e')} },
    vertexShader: `
      uniform float uTime, uScroll, uPx; uniform vec2 uPointer; attribute float aSeed; varying float vMix;
      void main(){
        vec3 p = position;
        float t = uTime * .15 + aSeed * 6.2831;
        p += vec3(sin(t + p.y), cos(t + p.x), sin(t * .8 + p.z)) * .18;      // gentle drift
        p.xy += uPointer * (.4 + aSeed) * .6;                                 // pointer parallax
        p.z  += uScroll * 3.0;                                                // scroll pushes field toward camera
        vec4 mv = modelViewMatrix * vec4(p, 1.);
        gl_PointSize = (2.0 + aSeed * 3.0) * uPx * (6.0 / -mv.z);
        vMix = aSeed; gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform vec3 uColA, uColB; varying float vMix;
      void main(){
        float d = length(gl_PointCoord - .5);
        float a = smoothstep(.5, .0, d);                                      // soft round points
        gl_FragColor = vec4(mix(uColA, uColB, vMix), a * .55);
      }`
  });
  const points = new THREE.Points(geo, mat); scene.add(points);

  function resize(){ const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
  addEventListener('resize', resize); resize();

  const target = new THREE.Vector2();
  addEventListener('pointermove', e => target.set((e.clientX / innerWidth - .5) * 2, -(e.clientY / innerHeight - .5) * 2), { passive: true });
  addEventListener('scroll', () => mat.uniforms.uScroll.value = Math.min(scrollY / innerHeight, 1.5), { passive: true });

  let visible = true, raf;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) loop(); }).observe(canvas);
  document.addEventListener('visibilitychange', () => { if (!document.hidden && visible) loop(); });

  const clock = new THREE.Clock();
  function loop(){
    cancelAnimationFrame(raf);
    if (!visible || document.hidden) return;
    mat.uniforms.uTime.value = clock.getElapsedTime();
    mat.uniforms.uPointer.value.lerp(target, .05);                            // smoothing, not snapping
    points.rotation.y += .0004;
    renderer.render(scene, camera);
    if (!reduce) raf = requestAnimationFrame(loop);
  }
  loop();                                                                      // reduced motion: renders one still frame
}
</script>
```

Fallback so the hero is never empty:

```css
.no-webgl #gl{display:none}
.no-webgl #hero{background:radial-gradient(60% 60% at 70% 30%, rgb(var(--accent-rgb) / .25), transparent 70%), var(--bg)}
```

## 4. Recipe — fullscreen shader background (cheapest "wow")

A single plane that fills the view and runs a fragment shader.

```js
const scene = new THREE.Scene();
const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const mat = new THREE.ShaderMaterial({
  uniforms: { uTime:{value:0}, uRes:{value:new THREE.Vector2()}, uA:{value:new THREE.Color('#0b0b0c')}, uB:{value:new THREE.Color('#ff5a36')} },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }`,
  fragmentShader: `
    uniform float uTime; uniform vec3 uA, uB; varying vec2 vUv;
    void main(){
      vec2 p = vUv * 2. - 1.;
      float v = sin(p.x * 2.5 + uTime * .3) + sin(p.y * 3. - uTime * .2) + sin((p.x + p.y) * 2. + uTime * .25);
      v = smoothstep(-1.5, 1.8, v) * .55;
      gl_FragColor = vec4(mix(uA, uB, v * (1. - length(p) * .5)), 1.);
    }`
});
scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));
```

Render at reduced resolution on mobile (`renderer.setPixelRatio(1)`), and overlay a 4–6% grain layer in CSS for a filmic finish.

## 5. Recipe — scroll-driven scene with GSAP

Drive scene values from a scrubbed timeline instead of reading `scrollY` yourself.

```js
const { gsap } = window; gsap.registerPlugin(ScrollTrigger);
const state = { camZ: 6, rotY: 0, hue: 0 };
gsap.timeline({ scrollTrigger:{ trigger:'.story', start:'top top', end:'+=300%', scrub:.8, pin:true } })
  .to(state, { camZ: 2.4, rotY: Math.PI * 1.2, ease:'none' }, 0);

function loop(){ camera.position.z = state.camZ; mesh.rotation.y = state.rotY; renderer.render(scene, camera); requestAnimationFrame(loop); }
```

Pair each scroll beat with a DOM caption that fades in at its own `start`/`end`. Never pin more than one 3D scene per page.

## 6. Loading models and textures

```js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const pm = new THREE.PMREMGenerator(renderer);
scene.environment = pm.fromScene(new RoomEnvironment(), .04).texture;   // instant, free studio lighting
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.outputColorSpace = THREE.SRGBColorSpace;

const draco = new DRACOLoader().setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
new GLTFLoader().setDRACOLoader(draco).load(MODEL_URL, g => scene.add(g.scene));
```

Only use model URLs you know are reachable and CORS-enabled; always keep a procedural fallback (torus knot, icosahedron with `MeshPhysicalMaterial`) so the scene works offline.

## 7. Post-processing (use sparingly)

Bloom, grain and chromatic aberration add polish but cost fill-rate. Import `EffectComposer`, `RenderPass`, `UnrealBloomPass` from `three/addons/postprocessing/…`, disable on mobile, and prefer a CSS grain overlay when the only goal is texture.

## 8. Performance and quality rules

- Cap pixel ratio (1.5–1.75 desktop, 1–1.25 mobile). Biggest single win.
- Fewer draw calls: one `Points`/`InstancedMesh`, not hundreds of meshes.
- Pause when offscreen or tab hidden (shown above).
- Dispose geometries, materials and textures when tearing a scene down.
- No `antialias` when drawing soft points or full-screen shaders.
- Keep GPU work in shaders; keep per-frame JS allocation at zero (reuse vectors).
- Under `prefers-reduced-motion`, render a still frame and skip scroll/pointer reactions.
- Test with 4× CPU throttle and a low-end phone; if it drops below ~45fps, halve the particle count.
- Colours come from CSS tokens: read `getComputedStyle(document.documentElement).getPropertyValue('--accent')` into `THREE.Color` so the scene matches the palette.

## 9. Never ship

A full-screen 3D scene behind long body text · a model that blocks first paint (render the HTML first, add the scene after `load`) · autoplaying audio · a scene with no fallback · more than one WebGL context on a page.

## Output

Return the complete page including the import map and fallback CSS. Then two lines: the scene type and its particle/triangle budget, and the fallback behaviour.

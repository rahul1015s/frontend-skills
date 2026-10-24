/* FX — vanilla effects kit. Original implementations (no dependencies).
   Usage: <el data-fx="blur-text" data-opts='{"delay":60}'>Hello</el>  then FX.init() (auto on DOMContentLoaded).
   Effects inspired by the kinds of motion found on reactbits.dev; all code here is written from scratch. */
(function (g) {
  'use strict';
  if (g.FX) return; // already loaded (several category bundles can be combined)
  const reg = {}, live = new WeakMap();
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const rand = (a, b) => a + Math.random() * (b - a);
  const hex = (c) => { c = c.trim(); if (c[0] !== '#') { const t = document.createElement('canvas').getContext('2d'); t.fillStyle = c; c = t.fillStyle; } if (c.length === 4) c = '#' + [...c.slice(1)].map(x => x + x).join(''); const n = parseInt(c.slice(1, 7), 16); return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]; };

  function opts(el, d) {
    let o = {}; try { o = JSON.parse(el.dataset.opts || '{}'); } catch (e) { console.warn('FX: bad data-opts', el); }
    return Object.assign({}, d, o);
  }
  // run fn(t, dt) every frame while el is on screen. returns stop().
  function loop(el, fn) {
    let raf = 0, on = false, last = performance.now(), t0 = last;
    const frame = (n) => { if (!on) return; fn((n - t0) / 1000, Math.min(.05, (n - last) / 1000)); last = n; raf = requestAnimationFrame(frame); };
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !on) { on = true; last = performance.now(); raf = requestAnimationFrame(frame); } else if (!e.isIntersecting) { on = false; cancelAnimationFrame(raf); } });
    io.observe(el);
    return () => { on = false; cancelAnimationFrame(raf); io.disconnect(); };
  }
  // fire cb once when el is in view
  function inview(el, cb, margin = '0px 0px -12% 0px') {
    if (RM) return cb();
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); cb(); } }, { rootMargin: margin });
    io.observe(el);
  }
  // shared pointer state (page coords + velocity)
  const ptr = { x: innerWidth / 2, y: innerHeight / 2, vx: 0, vy: 0, down: false };
  addEventListener('pointermove', e => { ptr.vx = e.clientX - ptr.x; ptr.vy = e.clientY - ptr.y; ptr.x = e.clientX; ptr.y = e.clientY; }, { passive: true });
  addEventListener('pointerdown', () => ptr.down = true); addEventListener('pointerup', () => ptr.down = false);
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;

  // split an element's text into words/chars, keep it accessible
  function split(el, mode = 'chars') {
    const txt = el.textContent.trim().replace(/\s+/g, ' ');
    el.setAttribute('aria-label', txt); el.textContent = '';
    const words = [], chars = [];
    txt.split(' ').forEach((w, i, a) => {
      const ws = document.createElement('span'); ws.className = 'fx-w'; ws.style.display = 'inline-block'; ws.setAttribute('aria-hidden', 'true');
      if (mode === 'words') { ws.textContent = w; } else [...w].forEach(c => { const s = document.createElement('span'); s.className = 'fx-c'; s.style.display = 'inline-block'; s.textContent = c; ws.append(s); chars.push(s); });
      el.append(ws); words.push(ws); if (i < a.length - 1) el.append(document.createTextNode(' '));
    });
    return { words, chars };
  }
  // full-bleed canvas inside el (absolute, behind content)
  function canvasIn(el, ctxType = '2d', attrs) {
    const c = document.createElement('canvas'); c.className = 'fx-canvas';
    c.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none';
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    el.prepend(c);
    const ctx = c.getContext(ctxType, attrs);
    const size = { w: 0, h: 0, dpr: 1 };
    const fit = (cap = 2) => { const r = el.getBoundingClientRect(); size.dpr = Math.min(devicePixelRatio || 1, cap); size.w = Math.max(1, r.width); size.h = Math.max(1, r.height); c.width = Math.round(size.w * size.dpr); c.height = Math.round(size.h * size.dpr); return size; };
    const ro = new ResizeObserver(() => fit()); ro.observe(el); fit();
    return { c, ctx, size, fit, ro };
  }
  // pointer position relative to el, 0..1 and px
  function local(el, e) { const r = el.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top, nx: (e.clientX - r.left) / r.width, ny: (e.clientY - r.top) / r.height, w: r.width, h: r.height }; }

  // ---- tiny WebGL fragment-shader runner (full-screen triangle) ----
  const VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  // The WebGL context is created when el scrolls into view and released when it leaves (browsers cap live contexts at ~16).
  function shaderBg(el, frag, o = {}) {
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    const cols = (o.colors || []).map(hex); const m = { x: .5, y: .5, tx: .5, ty: .5 };
    const mm = e => { const l = local(el, e); m.vx = lerp(m.vx || 0, l.nx - m.tx, .5); m.vy = lerp(m.vy || 0, (1 - l.ny) - m.ty, .5); m.tx = l.nx; m.ty = 1 - l.ny; }; const md = e => { const l = local(el, e); m.cx = l.nx; m.cy = 1 - l.ny; m.ct = performance.now(); };
    if (o.mouse) { el.addEventListener('pointermove', mm); el.addEventListener('pointerdown', md); }
    let tex = null, imgA = 1, imgReady = false;
    let c = null, gl = null, uni = null, raf = 0, t0 = performance.now(), ro = null;
    const fit = () => { if (!c) return; const r = el.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, o.dpr || 1.5); c.width = Math.max(1, Math.round(r.width * d)); c.height = Math.max(1, Math.round(r.height * d)); };
    function build() {
      c = document.createElement('canvas'); c.className = 'fx-canvas'; c.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none'; el.prepend(c);
      gl = c.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: true }); if (!gl) { c.remove(); c = null; return false; }
      const mk = (t, src) => { const sh = gl.createShader(t); gl.shaderSource(sh, src); gl.compileShader(sh); if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) console.warn('FX shader:', gl.getShaderInfoLog(sh)); return sh; };
      const pr = gl.createProgram(); gl.attachShader(pr, mk(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, mk(gl.FRAGMENT_SHADER, 'precision highp float;uniform vec2 uRes;uniform float uTime;uniform vec2 uMouse;uniform vec3 uA;uniform vec3 uB;uniform vec3 uC;uniform float uS;uniform sampler2D uTex;uniform float uImgA;uniform vec3 uClk;uniform vec2 uVel;\n' + frag));
      gl.linkProgram(pr); gl.useProgram(pr); const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      uni = {}; ['uRes', 'uTime', 'uMouse', 'uA', 'uB', 'uC', 'uS', 'uTex', 'uImgA', 'uClk', 'uVel'].forEach(n => uni[n] = gl.getUniformLocation(pr, n)); fit();
      if (o.image) { imgReady = false; const im = new Image(); im.crossOrigin = 'anonymous'; im.onload = () => { if (!gl) return; tex = gl.createTexture(); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); imgA = im.naturalWidth / im.naturalHeight; gl.uniform1i(uni.uTex, 0); imgReady = true; }; im.src = o.image; }
      return true;
    }
    function release() { cancelAnimationFrame(raf); raf = 0; if (gl) { const x = gl.getExtension('WEBGL_lose_context'); x && x.loseContext(); } if (c) c.remove(); c = gl = null; }
    function draw(now) {
      const t = (now - t0) / 1000; m.x = lerp(m.x, m.tx, .06); m.y = lerp(m.y, m.ty, .06);
      gl.viewport(0, 0, c.width, c.height); gl.uniform2f(uni.uRes, c.width, c.height); gl.uniform1f(uni.uTime, t * (o.speed || 1)); gl.uniform2f(uni.uMouse, m.x, m.y);
      gl.uniform3fv(uni.uA, cols[0] || [1, 1, 1]); gl.uniform3fv(uni.uB, cols[1] || cols[0] || [1, 1, 1]); gl.uniform3fv(uni.uC, cols[2] || cols[1] || cols[0] || [1, 1, 1]); gl.uniform1f(uni.uS, o.scale || 1);
      if (o.image && !imgReady) return; gl.uniform1f(uni.uImgA, imgA); gl.uniform3f(uni.uClk, m.cx || .5, m.cy || .5, m.ct ? (performance.now() - m.ct) / 1000 : 99); gl.uniform2f(uni.uVel, m.vx || 0, m.vy || 0); m.vx *= .9; m.vy *= .9;
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    const frame = n => { if (!gl) return; draw(n); if (!RM) raf = requestAnimationFrame(frame); };
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !gl) { if (build()) raf = requestAnimationFrame(RM ? () => draw(t0 + 3000) : frame); } else if (!e.isIntersecting && gl) release(); }, { rootMargin: '0px' });
    io.observe(el); ro = new ResizeObserver(fit); ro.observe(el);
    return () => { io.disconnect(); ro.disconnect(); release(); el.removeEventListener('pointermove', mm); el.removeEventListener('pointerdown', md); };
  }
  const NOISE_GLSL = 'float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h21(i),h21(i+vec2(1,0)),f.x),mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x),f.y);}float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*vn(p);p=p*2.02+7.1;a*=.5;}return v;}';

  function register(name, init) { reg[name] = init; }
  function init(root = document) {
    $$('[data-fx]', root).forEach(el => {
      if (live.has(el)) return;
      const names = el.dataset.fx.split(/\s+/).filter(Boolean);
      const cleans = names.map(n => { try { return reg[n] ? reg[n](el, opts(el, {})) : console.warn('FX: unknown effect', n); } catch (e) { console.error('FX', n, e); } });
      live.set(el, cleans);
    });
  }
  function destroy(el) { (live.get(el) || []).forEach(f => typeof f === 'function' && f()); live.delete(el); }
  g.FX = { register, init, destroy, run: (n, el) => reg[n](el, opts(el, {})), util: { $, $$, clamp, lerp, rand, hex, opts, loop, inview, ptr, fine, split, canvasIn, local, shaderBg, NOISE_GLSL, RM } };
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', () => init()) : queueMicrotask(() => init());
})(window);

/* ===================== COMPONENTS ===================== */
(function () {
  const { register, util: U } = FX;
  const css = document.createElement('style'); css.id = 'fx-comp-css';
  css.textContent = `
.fx-spot{position:relative;overflow:hidden;--mx:50%;--my:50%}.fx-spot::before{content:'';position:absolute;inset:0;background:radial-gradient(var(--fx-r,320px) circle at var(--mx) var(--my),var(--fx-spot,rgba(167,139,250,.22)),transparent 70%);opacity:0;transition:opacity .35s;pointer-events:none}.fx-spot:hover::before{opacity:1}
.fx-bento{position:relative;--mx:50%;--my:50%}.fx-bento::after{content:'';position:absolute;inset:0;border-radius:inherit;padding:1.5px;background:radial-gradient(240px circle at var(--mx) var(--my),var(--fx-glow,#a78bfa),transparent 65%);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;opacity:0;transition:opacity .3s;pointer-events:none}.fx-bento:hover::after{opacity:1}
.fx-tilt{transform-style:preserve-3d;transition:transform .5s cubic-bezier(.2,.8,.2,1);will-change:transform}
.fx-holo{position:relative;overflow:hidden;--mx:50%;--my:50%}.fx-holo::after{content:'';position:absolute;inset:0;background:conic-gradient(from calc(var(--ang,0)*1deg) at var(--mx) var(--my),#ff7ab6,#ffd86e,#7dffb2,#6ec6ff,#c28bff,#ff7ab6);mix-blend-mode:color-dodge;opacity:0;filter:saturate(1.4) brightness(.8);transition:opacity .3s;pointer-events:none}.fx-holo:hover::after{opacity:.45}
.fx-glass{position:relative;backdrop-filter:blur(var(--fx-blur,14px)) saturate(1.5);-webkit-backdrop-filter:blur(var(--fx-blur,14px)) saturate(1.5);background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.22);box-shadow:inset 0 1px 0 rgba(255,255,255,.35),inset 0 -1px 0 rgba(255,255,255,.05),0 12px 40px rgba(0,0,0,.25)}
.fx-dock{display:inline-flex;align-items:flex-end;gap:10px;padding:10px 14px;border-radius:22px;background:rgba(255,255,255,.1);backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,.18)}
.fx-dock>*{transform-origin:50% 100%;will-change:transform}
.fx-fm{position:relative}.fx-fm a{position:relative;display:block;overflow:hidden;border-top:1px solid currentColor;text-decoration:none;color:inherit}
.fx-fm a>span.l{display:block;padding:.35em 0;text-align:center;font-size:clamp(2rem,6vw,4.5rem);font-weight:700;text-transform:uppercase;transition:transform .3s}
.fx-fm a>.mq{position:absolute;inset:0;background:var(--fx-fm-bg,#fff);color:var(--fx-fm-fg,#000);display:flex;align-items:center;transform:translateY(101%);transition:transform .5s cubic-bezier(.2,.8,.2,1);overflow:hidden;pointer-events:none}
.fx-fm a:hover>.mq{transform:none}.fx-fm .mq>div{display:flex;flex:none;white-space:nowrap;animation:fx-fmq 12s linear infinite}.fx-fm .mq span{font-size:clamp(2rem,6vw,4.5rem);font-weight:700;text-transform:uppercase;padding:0 1.5rem;display:flex;align-items:center;gap:1.5rem}
.fx-fm .mq img{height:2.4em;width:7em;object-fit:cover;border-radius:99px}@keyframes fx-fmq{to{transform:translateX(-50%)}}
.fx-goo{position:relative;display:inline-flex}.fx-goo ul{display:flex;gap:6px;list-style:none;margin:0;padding:6px;position:relative}.fx-goo .gl{position:absolute;inset:0;filter:url(#fx-goo);pointer-events:none}
.fx-goo li{position:relative;z-index:2}.fx-goo li a{display:block;padding:.6em 1.2em;color:inherit;text-decoration:none;position:relative;z-index:2;transition:color .3s}
.fx-goo li.on a{color:var(--fx-goo-on,#000)}.fx-goo li a{color:inherit}.fx-goo .bl{position:absolute;z-index:1;background:var(--fx-goo-bg,#fff);border-radius:99px;transition:all .45s cubic-bezier(.3,1.5,.5,1)}
.fx-stack{position:relative}.fx-stack>*{position:absolute;inset:0;transition:transform .6s cubic-bezier(.2,.8,.2,1),opacity .4s;cursor:pointer}
.fx-acc{display:flex;gap:10px;height:var(--fx-h,420px)}.fx-acc>*{flex:1;overflow:hidden;border-radius:18px;position:relative;transition:flex .6s cubic-bezier(.2,.8,.2,1);cursor:pointer}.fx-acc>*.on{flex:5}.fx-acc>* img{width:100%;height:100%;object-fit:cover;display:block}
.fx-flip{perspective:1000px}.fx-flip>.in{position:relative;width:100%;height:100%;transition:transform .8s cubic-bezier(.2,.8,.2,1);transform-style:preserve-3d}.fx-flip:hover>.in,.fx-flip.on>.in{transform:rotateY(180deg)}.fx-flip .f,.fx-flip .b{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden}.fx-flip .b{transform:rotateY(180deg)}
.fx-list>*{opacity:0;transform:translateY(24px) scale(.96);transition:opacity .5s,transform .5s cubic-bezier(.2,.8,.2,1)}.fx-list>*.in{opacity:1;transform:none}
`;
  document.head.append(css);
  const setMouse = (el, e) => { const l = U.local(el, e); el.style.setProperty('--mx', l.x + 'px'); el.style.setProperty('--my', l.y + 'px'); return l; };

  register('spotlight-card', el => { const o = U.opts(el, { color: 'rgba(167,139,250,.22)', radius: 320 }); el.classList.add('fx-spot'); el.style.setProperty('--fx-spot', o.color); el.style.setProperty('--fx-r', o.radius + 'px'); const f = e => setMouse(el, e); el.addEventListener('pointermove', f); return () => el.removeEventListener('pointermove', f); });
  // Border lights up near the cursor. Put it on every card of a grid for the "bento glow" look.
  register('border-glow', el => { const o = U.opts(el, { color: '#a78bfa' }); el.classList.add('fx-bento'); el.style.setProperty('--fx-glow', o.color); const f = e => setMouse(el, e); el.addEventListener('pointermove', f); });

  // 3D tilt that follows the pointer, optional inner layers with data-depth
  register('tilted-card', el => {
    if (U.RM) return; const o = U.opts(el, { max: 12, scale: 1.04, persp: 900 }); el.classList.add('fx-tilt'); el.style.transform = `perspective(${o.persp}px)`; const layers = U.$$('[data-depth]', el); layers.forEach(l => { l.style.transition = 'transform .5s cubic-bezier(.2,.8,.2,1)'; l.style.willChange = 'transform'; });
    const mv = e => { if (!U.fine) return; const l = U.local(el, e), rx = (.5 - l.ny) * o.max * 2, ry = (l.nx - .5) * o.max * 2; el.style.transition = 'transform .08s'; el.style.transform = `perspective(${o.persp}px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${o.scale})`; layers.forEach(a => a.style.transform = `translate3d(${(l.nx - .5) * -a.dataset.depth}px,${(l.ny - .5) * -a.dataset.depth}px,0)`); };
    const lv = () => { el.style.transition = ''; el.style.transform = `perspective(${o.persp}px)`; layers.forEach(a => a.style.transform = ''); };
    el.addEventListener('pointermove', mv); el.addEventListener('pointerleave', lv);
  });
  // Holographic foil card: tilt + rainbow conic highlight under cursor
  register('holo-card', el => { el.classList.add('fx-holo'); FX.util.opts; const t = el; const mv = e => { const l = setMouse(el, e); el.style.setProperty('--ang', (Math.atan2(l.y - l.h / 2, l.x - l.w / 2) * 57.3 + 90) | 0); }; el.addEventListener('pointermove', mv); el.dataset.fx.includes('tilted-card') || (() => { const o = 10; el.style.transition = 'transform .4s'; el.addEventListener('pointermove', e => { const l = U.local(el, e); el.style.transform = `perspective(800px) rotateX(${(.5 - l.ny) * o}deg) rotateY(${(l.nx - .5) * o}deg)`; }); el.addEventListener('pointerleave', () => el.style.transform = ''); })(); });
  register('glass-surface', el => { const o = U.opts(el, { blur: 14, radius: 20 }); el.classList.add('fx-glass'); el.style.setProperty('--fx-blur', o.blur + 'px'); el.style.borderRadius = o.radius + 'px'; });

  // macOS-style dock magnification: children scale by distance to cursor
  register('dock', el => {
    el.classList.add('fx-dock'); const o = U.opts(el, { max: 1.7, range: 140 }); const kids = [...el.children]; if (U.RM || !U.fine) return;
    const mv = e => kids.forEach(k => { const r = k.getBoundingClientRect(), d = Math.abs(e.clientX - (r.left + r.width / 2)); const s = 1 + (o.max - 1) * Math.max(0, Math.cos(Math.min(1, d / o.range) * Math.PI / 2)); k.style.transition = 'transform .08s'; k.style.transform = `scale(${s.toFixed(3)})`; });
    el.addEventListener('pointermove', mv); el.addEventListener('pointerleave', () => kids.forEach(k => { k.style.transition = 'transform .35s cubic-bezier(.2,.8,.2,1)'; k.style.transform = ''; }));
  });

  // Fullscreen-width menu: hover reveals a marquee row. Children: <a href data-img="url">Label</a>
  register('flowing-menu', el => {
    el.classList.add('fx-fm'); U.$$('a', el).forEach(a => { const t = a.textContent.trim(), im = a.dataset.img; a.innerHTML = `<span class="l">${t}</span>`; const mq = document.createElement('div'); mq.className = 'mq'; mq.setAttribute('aria-hidden', 'true'); const one = `<span>${t}${im ? `<img src="${im}" alt="">` : ' ✦'}</span>`; mq.innerHTML = `<div>${one.repeat(10)}</div>`; a.append(mq);
      a.addEventListener('pointerenter', e => { const r = a.getBoundingClientRect(); mq.style.transition = 'none'; mq.style.transform = e.clientY - r.top < r.height / 2 ? 'translateY(-101%)' : 'translateY(101%)'; mq.offsetHeight; mq.style.transition = ''; mq.style.transform = 'none'; });
      a.addEventListener('pointerleave', e => { const r = a.getBoundingClientRect(); mq.style.transform = e.clientY - r.top < r.height / 2 ? 'translateY(-101%)' : 'translateY(101%)'; }); });
  });

  // Nav with a gooey bubble that stretches between items (SVG goo filter)
  register('gooey-nav', el => {
    if (!document.getElementById('fx-goo-svg')) { document.body.insertAdjacentHTML('beforeend', '<svg id="fx-goo-svg" width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="fx-goo"><feGaussianBlur in="SourceGraphic" stdDeviation="8" result="b"/><feColorMatrix in="b" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" result="g"/><feComposite in="SourceGraphic" in2="g" operator="atop"/></filter></svg>'); }
    el.classList.add('fx-goo'); const ul = el.querySelector('ul'); const gl = document.createElement('div'); gl.className = 'gl'; const bl = document.createElement('span'); bl.className = 'bl'; gl.append(bl); ul.prepend(gl); const items = U.$$('li', ul);
    const go = li => { items.forEach(i => i.classList.toggle('on', i === li)); const r = li.getBoundingClientRect(), p = ul.getBoundingClientRect(); Object.assign(bl.style, { left: r.left - p.left + 'px', top: r.top - p.top + 'px', width: r.width + 'px', height: r.height + 'px' }); };
    items.forEach(li => li.addEventListener('click', e => { if (li.firstElementChild.getAttribute('href') === '#') e.preventDefault(); go(li); })); requestAnimationFrame(() => go(items[0]));
    addEventListener('resize', () => go(el.querySelector('li.on') || items[0]));
  });

  // Tabs/pill nav: a pill slides under the active item
  register('pill-nav', el => {
    const o = U.opts(el, { bg: '#fff', fg: '#000' }); const items = [...el.children]; el.style.position = 'relative'; el.style.display = el.style.display || 'inline-flex'; const p = document.createElement('span'); p.style.cssText = `position:absolute;z-index:0;border-radius:99px;background:${o.bg};transition:all .45s cubic-bezier(.2,.9,.2,1.1)`; el.prepend(p); items.forEach(i => { i.style.position = 'relative'; i.style.zIndex = 1; i.style.transition = 'color .3s'; i._c = getComputedStyle(i).color; });
    const go = it => { items.forEach(i => i.style.color = i === it ? o.fg : i._c); el._on = it; const r = it.getBoundingClientRect(), b = el.getBoundingClientRect(); Object.assign(p.style, { left: r.left - b.left + 'px', top: r.top - b.top + 'px', width: r.width + 'px', height: r.height + 'px' }); };
    items.forEach(i => { i.addEventListener('click', () => go(i)); i.addEventListener('pointerenter', () => { if (!U.fine) return; p.style.opacity = .85; }); }); requestAnimationFrame(() => go(items[0])); addEventListener('resize', () => go(el._on || items[0]));
  });

  // Click to bring the next card to the front of a fanned deck. Children = cards.
  register('card-stack', el => {
    const o = U.opts(el, { offset: 14, rot: 3 }); el.classList.add('fx-stack'); let order = [...el.children]; const lay = () => order.forEach((c, i) => { const k = i; c.style.zIndex = order.length - i; c.style.transform = `translate(${k * o.offset}px,${k * o.offset}px) rotate(${k ? (k % 2 ? 1 : -1) * o.rot * Math.min(k, 2) / 2 : 0}deg) scale(${1 - k * .04})`; c.style.opacity = k > 3 ? 0 : 1; }); lay();
    el.addEventListener('click', () => { const f = order.shift(); f.style.transform = 'translate(-130%,-20px) rotate(-18deg)'; f.style.opacity = 0; setTimeout(() => { order.push(f); lay(); }, 380); });
  });

  // Accordion gallery: hovered/clicked panel expands (children = panels with <img>)
  register('accordion-gallery', el => { el.classList.add('fx-acc'); const k = [...el.children]; k[0].classList.add('on'); k.forEach(c => { const on = () => { k.forEach(x => x.classList.toggle('on', x === c)); }; c.addEventListener(U.fine ? 'pointerenter' : 'click', on); c.tabIndex = 0; c.addEventListener('focus', on); }); });

  register('flip-card', el => { el.classList.add('fx-flip'); if (!el.querySelector('.in')) { const i = document.createElement('div'); i.className = 'in'; const [f, b] = el.children; f.classList.add('f'); b.classList.add('b'); i.append(f, b); el.append(i); } el.addEventListener('click', () => el.classList.toggle('on')); });

  // Children stagger in as the list scrolls into view
  register('animated-list', el => { el.classList.add('fx-list'); [...el.children].forEach((c, i) => { c.style.transitionDelay = i * 90 + 'ms'; }); U.inview(el, () => requestAnimationFrame(() => [...el.children].forEach(c => c.classList.add('in')))); });

  // Pin-and-stack cards: each card sticks and the previous one shrinks as the next arrives
  register('scroll-stack', el => {
    const o = U.opts(el, { top: 90, gap: 22, scaleStep: .05 }); const cards = [...el.children]; cards.forEach((c, i) => { c.style.position = 'sticky'; c.style.top = o.top + i * o.gap + 'px'; c.style.transformOrigin = 'top center'; c.style.willChange = 'transform'; }); if (U.RM) return;
    const upd = () => cards.forEach((c, i) => { const nxt = cards[i + 1]; if (!nxt) return; const r = nxt.getBoundingClientRect(), start = innerHeight * .95, end = o.top + (i + 1) * o.gap + c.offsetHeight * .25; const p = U.clamp((start - r.top) / (start - end), 0, 1); c.style.transform = `scale(${1 - p * o.scaleStep * (cards.length - i)})`; c.style.filter = `brightness(${1 - p * .25})`; });
    addEventListener('scroll', upd, { passive: true }); upd();
  });

  // Masonry: CSS columns with staggered in-view reveal
  register('masonry', el => { const o = U.opts(el, { cols: 3, gap: 14 }); el.style.columnCount = o.cols; el.style.columnGap = o.gap + 'px'; if (innerWidth < 640) el.style.columnCount = 2; [...el.children].forEach((c, i) => { c.style.breakInside = 'avoid'; c.style.marginBottom = o.gap + 'px'; c.style.opacity = 0; c.style.transform = 'translateY(30px)'; c.style.transition = `opacity .7s ${i * 60}ms,transform .7s cubic-bezier(.2,.8,.2,1) ${i * 60}ms`; }); U.inview(el, () => requestAnimationFrame(() => [...el.children].forEach(c => { c.style.opacity = 1; c.style.transform = 'none'; })), '0px'); });

  // Draggable, snapping horizontal carousel (children = slides)
  register('carousel', el => {
    const o = U.opts(el, { gap: 16, auto: 0 }); const track = document.createElement('div'); [...el.children].forEach(c => track.append(c)); el.append(track); el.style.overflow = 'hidden'; el.style.touchAction = 'pan-y'; track.style.cssText = `display:flex;gap:${o.gap}px;will-change:transform;cursor:grab`;
    let x = 0, vx = 0, drag = false, lx = 0, snap = null; const max = () => Math.min(0, el.clientWidth - track.scrollWidth); const slides = () => [...track.children];
    el.addEventListener('pointerdown', e => { drag = true; lx = e.clientX; snap = null; vx = 0; track.style.cursor = 'grabbing'; el.setPointerCapture(e.pointerId); });
    el.addEventListener('pointermove', e => { if (!drag) return; const d = e.clientX - lx; lx = e.clientX; x += d; vx = d; });
    const up = () => { drag = false; track.style.cursor = 'grab'; const tgt = x + vx * 12; let best = 0, bd = 1e9; slides().forEach(s => { const d = Math.abs(-s.offsetLeft - tgt); if (d < bd) { bd = d; best = -s.offsetLeft; } }); snap = U.clamp(best, max(), 0); }; el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
    track.querySelectorAll('img').forEach(i => i.draggable = false);
    return U.loop(el, () => { if (!drag) { if (snap != null) x = U.lerp(x, snap, .12); } x = U.clamp(x, max() - 60, 60); track.style.transform = `translateX(${x}px)`; });
  });

  // Tabs-as-stepper with animated progress line. Children: .fx-step panels; controls created automatically.
  register('stepper', el => {
    const steps = [...el.children]; let i = 0; const ink = getComputedStyle(el).color; const bar = document.createElement('div'); bar.style.cssText = 'display:flex;align-items:center;gap:0;margin-bottom:1.2rem'; const dots = steps.map((s, k) => { const d = document.createElement('button'); d.type = 'button'; d.textContent = k + 1; d.setAttribute('aria-label', 'Step ' + (k + 1)); d.style.cssText = 'width:2.2rem;height:2.2rem;border-radius:50%;border:2px solid currentColor;background:transparent;color:inherit;font:inherit;cursor:pointer;transition:all .4s;flex:none'; bar.append(d); if (k < steps.length - 1) { const l = document.createElement('i'); l.style.cssText = 'flex:1;height:2px;background:rgba(127,127,127,.35);position:relative;overflow:hidden'; l.innerHTML = '<b style="position:absolute;inset:0;background:currentColor;transform:scaleX(0);transform-origin:left;transition:transform .5s"></b>'; bar.append(l); } d.onclick = () => go(k); return d; });
    const lines = U.$$('i b', bar); const nav = document.createElement('div'); nav.style.cssText = 'display:flex;justify-content:space-between;margin-top:1.2rem'; nav.innerHTML = '<button type="button" data-p>Back</button><button type="button" data-n>Next</button>'; nav.querySelectorAll('button').forEach(b => b.style.cssText = 'font:inherit;color:inherit;background:transparent;border:1px solid currentColor;border-radius:99px;padding:.4em 1.1em;cursor:pointer'); el.prepend(bar); el.append(nav);
    const go = n => { i = U.clamp(n, 0, steps.length - 1); steps.forEach((s, k) => s.style.display = k === i ? '' : 'none'); dots.forEach((d, k) => { d.style.background = k <= i ? ink : 'transparent'; d.style.color = k <= i ? 'var(--fx-step-on,#000)' : ink; d.style.borderColor = ink; }); lines.forEach((l, k) => l.style.transform = `scaleX(${k < i ? 1 : 0})`); };
    steps.forEach(s => s.classList.add('fx-step')); nav.querySelector('[data-p]').onclick = () => go(i - 1); nav.querySelector('[data-n]').onclick = () => go(i + 1); go(0);
  });

  // Elastic slider: track bends toward the thumb while dragging (hidden <input type=range> kept for a11y)
  register('elastic-slider', el => {
    const o = U.opts(el, { min: 0, max: 100, value: 50 }); el.style.cssText += ';position:relative;height:56px;touch-action:none;cursor:pointer;user-select:none'; const NS = 'http://www.w3.org/2000/svg';
    el.innerHTML = `<svg width="100%" height="56" style="overflow:visible"><path fill="none" stroke="rgba(127,127,127,.4)" stroke-width="4" stroke-linecap="round"/><path class="v" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><circle r="10" fill="currentColor"/></svg>`; const [bg, fg] = el.querySelectorAll('path'), dot = el.querySelector('circle'), svg = el.querySelector('svg');
    let v = o.value, tx = 0, bend = 0, drag = false; el.setAttribute('role', 'slider'); el.tabIndex = 0; el.setAttribute('aria-valuemin', o.min); el.setAttribute('aria-valuemax', o.max);
    const W = () => svg.clientWidth - 24; const draw = () => { const w = W(), x = 12 + (v - o.min) / (o.max - o.min) * w, y = 28 + bend; bg.setAttribute('d', `M12 28 Q${x} ${28 + bend * 2} ${12 + w} 28`); fg.setAttribute('d', `M12 28 Q${(12 + x) / 2} ${28 + bend * 1.2} ${x} ${y}`); dot.setAttribute('cx', x); dot.setAttribute('cy', y); el.setAttribute('aria-valuenow', Math.round(v)); el.dispatchEvent(new CustomEvent('fx-input', { detail: v })); };
    const set = e => { const r = svg.getBoundingClientRect(); v = U.clamp(o.min + (e.clientX - r.left - 12) / W() * (o.max - o.min), o.min, o.max); tx = U.clamp((e.clientY - r.top - 28) * .6, -22, 22); };
    el.addEventListener('pointerdown', e => { drag = true; el.setPointerCapture(e.pointerId); set(e); }); el.addEventListener('pointermove', e => drag && set(e)); el.addEventListener('pointerup', () => { drag = false; tx = 0; });
    el.addEventListener('keydown', e => { if (e.key === 'ArrowRight') v = Math.min(o.max, v + 1); if (e.key === 'ArrowLeft') v = Math.max(o.min, v - 1); });
    let vel = 0; const stop = () => { }; (function tick() { if (!el.isConnected) return; vel += (tx - bend) * .18; vel *= .78; bend += vel; draw(); requestAnimationFrame(tick); })();
  });
})();

/* ===================== MORE COMPONENTS ===================== */
(function () {
  const { register, util: U } = FX;
  const css = document.createElement('style'); css.id = 'fx-comp2-css';
  css.textContent = `
.fx-bc{position:relative}.fx-bc>*{position:absolute;left:50%;top:50%;transition:transform .7s cubic-bezier(.34,1.56,.64,1)}
.fx-bubm{position:relative;display:inline-block}.fx-bubm .tg{width:3.2em;height:3.2em;border-radius:50%;border:0;background:var(--fx-bub,#fff);color:#000;cursor:pointer;display:grid;place-items:center;position:relative;z-index:3}
.fx-bubm .tg i{display:block;width:1.2em;height:2px;background:currentColor;position:absolute;transition:transform .4s cubic-bezier(.2,.8,.2,1)}.fx-bubm .tg i:first-child{transform:translateY(-4px)}.fx-bubm .tg i:last-child{transform:translateY(4px)}.fx-bubm.open .tg i:first-child{transform:rotate(45deg)}.fx-bubm.open .tg i:last-child{transform:rotate(-45deg)}
.fx-bubm>a{position:absolute;right:0;top:0;white-space:nowrap;padding:.7em 1.3em;border-radius:99px;background:var(--fx-bub,#fff);color:#000;text-decoration:none;opacity:0;transform:scale(.3);pointer-events:none;transition:transform .6s cubic-bezier(.34,1.56,.64,1),opacity .3s;z-index:2}.fx-bubm.open>a{opacity:1;pointer-events:auto}
.fx-cardnav{position:relative;overflow:hidden;transition:height .55s cubic-bezier(.2,.8,.2,1);border-radius:16px;background:var(--fx-cn,#14141d)}.fx-cardnav>.bar{display:flex;align-items:center;justify-content:space-between;padding:0 1rem;height:var(--fx-bar,60px)}
.fx-cardnav .cards{display:flex;gap:10px;padding:0 10px 10px}.fx-cardnav .cards>*{flex:1;border-radius:12px;padding:16px;min-height:130px;opacity:0;transform:translateY(24px);transition:opacity .45s,transform .55s cubic-bezier(.2,.8,.2,1)}.fx-cardnav.open .cards>*{opacity:1;transform:none}
.fx-cswap{position:relative;perspective:1100px}.fx-cswap>*{position:absolute;left:50%;top:50%;transition:transform .9s cubic-bezier(.2,.9,.2,1),opacity .6s;transform-origin:50% 100%}
.fx-chroma{position:relative}.fx-chroma::after{content:'';position:absolute;inset:0;pointer-events:none;backdrop-filter:grayscale(1) brightness(.85);-webkit-backdrop-filter:grayscale(1) brightness(.85);-webkit-mask-image:radial-gradient(circle var(--fx-cr,190px) at var(--mx,50%) var(--my,50%),transparent 0,transparent 35%,#000 100%);mask-image:radial-gradient(circle var(--fx-cr,190px) at var(--mx,50%) var(--my,50%),transparent 0,transparent 35%,#000 100%);z-index:5}
.fx-wheel{position:relative;perspective:700px;overflow:hidden;touch-action:none;cursor:grab}.fx-wheel>.in{position:absolute;left:0;right:0;top:50%;transform-style:preserve-3d}.fx-wheel .it{position:absolute;left:0;right:0;text-align:center;backface-visibility:hidden}
.fx-wheel::after{content:'';position:absolute;left:8%;right:8%;top:50%;height:var(--fx-ih,40px);margin-top:calc(var(--fx-ih,40px)/-2);border-block:1px solid rgba(255,255,255,.25);pointer-events:none}
.fx-dc{position:relative}.fx-dc>*{position:absolute;left:50%;top:50%;transition:transform .6s cubic-bezier(.2,.8,.2,1),opacity .5s,filter .5s;cursor:pointer}
.fx-folder{position:relative;display:inline-block;width:150px;height:110px;cursor:pointer;perspective:700px}.fx-folder .back,.fx-folder .front{position:absolute;inset:14px 0 0 0;border-radius:6px 10px 10px 10px;background:var(--fx-fold,#f6c453)}.fx-folder .back::before{content:'';position:absolute;left:0;top:-14px;width:46%;height:16px;border-radius:8px 8px 0 0;background:inherit}.fx-folder .front{transform-origin:50% 100%;transition:transform .5s cubic-bezier(.2,.8,.2,1);filter:brightness(1.08);z-index:3}
.fx-folder .paper{position:absolute;left:12%;right:12%;bottom:8px;height:70%;background:#fff;border-radius:5px;transition:transform .5s cubic-bezier(.2,.8,.2,1);box-shadow:0 2px 6px rgba(0,0,0,.2);z-index:2;overflow:hidden}.fx-folder:hover .front{transform:rotateX(-32deg)}.fx-folder:hover .paper:nth-of-type(1){transform:translateY(-34px) rotate(-6deg)}.fx-folder:hover .paper:nth-of-type(2){transform:translateY(-44px) rotate(2deg)}.fx-folder:hover .paper:nth-of-type(3){transform:translateY(-30px) rotate(8deg)}
.fx-gi{display:flex;gap:2rem;flex-wrap:wrap}.fx-gi>*{position:relative;width:4.2em;height:4.2em;perspective:24em;transform-style:preserve-3d;cursor:pointer;background:none;border:0;padding:0;color:inherit;font:inherit}.fx-gi .bk{position:absolute;inset:0;border-radius:1.2em;background:linear-gradient(135deg,var(--c1,#7c3aed),var(--c2,#06b6d4));transform:rotate(15deg);transform-origin:100% 100%;transition:transform .45s cubic-bezier(.2,.8,.2,1)}.fx-gi>*:hover .bk{transform:rotate(25deg) translate3d(-.5em,-.5em,.5em)}
.fx-gi .fr{position:absolute;inset:0;border-radius:1.2em;background:rgba(255,255,255,.14);backdrop-filter:blur(.8em);-webkit-backdrop-filter:blur(.8em);border:1px solid rgba(255,255,255,.2);display:grid;place-items:center;transition:transform .45s cubic-bezier(.2,.8,.2,1)}.fx-gi>*:hover .fr{transform:translateZ(1.4em)}.fx-gi .lb{position:absolute;left:0;right:0;bottom:-1.6em;text-align:center;font-size:.8em;opacity:0;transition:opacity .3s}.fx-gi>*:hover .lb{opacity:1}
.fx-dw{overflow:hidden;position:relative}.fx-dw>.w{display:grid;gap:var(--fx-gap,14px);transform:rotate(-8deg) scale(1.25);will-change:transform}.fx-dw .c{display:flex;flex-direction:column;gap:var(--fx-gap,14px);will-change:transform}
.fx-sb{position:relative;display:block}.fx-sb::before{content:'';position:absolute;left:0;top:0;bottom:0;width:2px;background:rgba(127,127,127,.3)}.fx-sb .ln{position:absolute;left:0;width:2px;background:var(--fx-ln,#fff);transition:top .45s cubic-bezier(.2,.8,.2,1),height .45s cubic-bezier(.2,.8,.2,1)}.fx-sb a{display:block;padding:.45em 0 .45em 1.2em;color:inherit;text-decoration:none;opacity:.55;transition:opacity .3s,transform .3s}.fx-sb a.on,.fx-sb a:hover{opacity:1;transform:translateX(4px)}
.fx-pxc{position:relative;overflow:hidden}.fx-pxc canvas{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
.fx-spec{position:relative;overflow:hidden;--mx:50%;--my:50%;border:1px solid rgba(255,255,255,.18);background:var(--fx-spb,linear-gradient(180deg,#2a2a36,#15151d));color:#fff;border-radius:14px;padding:.8em 1.6em;font:inherit;cursor:pointer;box-shadow:inset 0 1px 0 rgba(255,255,255,.2),0 8px 20px rgba(0,0,0,.35)}.fx-spec::before{content:'';position:absolute;inset:0;background:radial-gradient(130px circle at var(--mx) var(--my),rgba(255,255,255,.4),transparent 60%);mix-blend-mode:soft-light;opacity:0;transition:opacity .25s}.fx-spec:hover::before{opacity:1}.fx-spec::after{content:'';position:absolute;inset:0;border-radius:inherit;padding:1px;background:radial-gradient(90px circle at var(--mx) var(--my),#fff,transparent 70%);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;opacity:0;transition:opacity .25s}.fx-spec:hover::after{opacity:1}
.fx-refl{position:relative;overflow:hidden;--mx:50%;--my:50%;background:linear-gradient(145deg,#2b2b36,#101016);border:1px solid rgba(255,255,255,.12)}.fx-refl::before{content:'';position:absolute;inset:-30%;background:conic-gradient(from calc(var(--ang,200)*1deg) at var(--mx) var(--my),transparent 0 30%,rgba(255,255,255,.28) 38%,transparent 46% 70%,rgba(255,255,255,.18) 78%,transparent 86%);pointer-events:none;transition:opacity .3s}.fx-refl::after{content:'';position:absolute;inset:0;background:radial-gradient(260px circle at var(--mx) var(--my),rgba(255,255,255,.15),transparent 60%);pointer-events:none}
.fx-stagm{position:fixed;inset:0;z-index:9990;pointer-events:none}.fx-stagm .ly{position:absolute;top:0;right:0;bottom:0;width:min(440px,92vw);transform:translateX(101%);transition:transform .6s cubic-bezier(.7,0,.2,1)}.fx-stagm .pn{position:absolute;top:0;right:0;bottom:0;width:min(440px,92vw);transform:translateX(101%);transition:transform .65s cubic-bezier(.7,0,.2,1) .18s;background:var(--fx-sm,#fff);color:#000;padding:6rem 2rem 2rem;display:flex;flex-direction:column;gap:.4rem;overflow:hidden}.fx-stagm.open{pointer-events:auto}.fx-stagm.open .ly,.fx-stagm.open .pn{transform:none}.fx-stagm .pn a{font-size:2.6rem;font-weight:800;text-transform:uppercase;color:inherit;text-decoration:none;overflow:hidden;display:block;line-height:1.1}.fx-stagm .pn a span{display:block;transform:translateY(110%) rotate(6deg);transition:transform .7s cubic-bezier(.2,.8,.2,1)}.fx-stagm.open .pn a span{transform:none}
.fx-stagm-tg{position:fixed;top:1rem;right:1rem;z-index:9995;border:0;border-radius:99px;padding:.7em 1.2em;background:#fff;color:#000;font:inherit;font-weight:700;cursor:pointer;mix-blend-mode:normal}
.fx-lens{position:absolute;border-radius:50%;pointer-events:none;z-index:6;backdrop-filter:blur(1.5px) saturate(1.6) brightness(1.12);-webkit-backdrop-filter:blur(1.5px) saturate(1.6) brightness(1.12);box-shadow:inset 0 0 0 1px rgba(255,255,255,.5),inset 0 8px 18px rgba(255,255,255,.28),inset 0 -10px 22px rgba(0,0,0,.18),0 12px 30px rgba(0,0,0,.25);transition:opacity .25s,width .3s,height .3s}
.fx-curv svg{width:100%;overflow:visible}.fx-curv input{position:absolute;inset:0;opacity:0;cursor:text}
.fx-morph{position:relative;height:56px;touch-action:none;cursor:pointer;user-select:none}.fx-morph .tr{position:absolute;left:0;right:0;top:50%;height:6px;margin-top:-3px;border-radius:9px;background:rgba(127,127,127,.35)}.fx-morph .fl{position:absolute;left:0;top:50%;height:6px;margin-top:-3px;border-radius:9px;background:currentColor}.fx-morph .th{position:absolute;top:50%;width:26px;height:26px;margin:-13px 0 0 -13px;background:currentColor;will-change:transform,border-radius}
.fx-lanyard{position:relative;overflow:hidden;touch-action:none}
.fx-odo{display:inline-flex;overflow:hidden;height:1.1em;line-height:1.1;font-variant-numeric:tabular-nums}.fx-odo .col{display:block;transition:transform .9s cubic-bezier(.2,.8,.2,1)}.fx-odo .col span{display:block;height:1.1em}
.fx-model{position:relative;touch-action:none}.fx-model canvas{width:100%;height:100%;display:block;cursor:grab}
`;
  document.head.append(css);
  const mouse = (el, e) => { const l = U.local(el, e); el.style.setProperty('--mx', l.x + 'px'); el.style.setProperty('--my', l.y + 'px'); return l; };
  const drag = (el, { move, up, down }) => { let on = false, lx = 0, ly = 0; el.addEventListener('pointerdown', e => { on = true; lx = e.clientX; ly = e.clientY; el.setPointerCapture(e.pointerId); down && down(e); }); el.addEventListener('pointermove', e => { if (!on) return; move(e.clientX - lx, e.clientY - ly, e); lx = e.clientX; ly = e.clientY; }); const end = e => { if (on) { on = false; up && up(e); } }; el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end); };

  register('stack', el => FX.run('card-stack', el));

  // Cards fan out; on hover the others bounce away from the hovered one
  register('bounce-cards', el => { const o = U.opts(el, { spread: 120, rots: [-10, 6, -3, 9, -6] }); el.classList.add('fx-bc'); const k = [...el.children]; const base = (i) => ({ x: (i - (k.length - 1) / 2) * o.spread * .62, r: o.rots[i % o.rots.length] }); const rest = () => k.forEach((c, i) => { const b = base(i); c.style.transitionDelay = i * 50 + 'ms'; c.style.transform = `translate(-50%,-50%) translate(${b.x}px,0) rotate(${b.r}deg)`; });
    const push = h => k.forEach((c, i) => { const b = base(i); const d = i === h ? 0 : (i < h ? -1 : 1) * (o.spread * .45); c.style.transitionDelay = '0ms'; c.style.transform = `translate(-50%,-50%) translate(${b.x + d}px,${i === h ? -12 : 0}px) rotate(${i === h ? 0 : b.r}deg) scale(${i === h ? 1.08 : 1})`; });
    k.forEach((c, i) => { c.addEventListener('pointerenter', () => push(i)); }); el.addEventListener('pointerleave', rest); k.forEach(c => { c.style.transform = 'translate(-50%,-50%) scale(.2) rotate(0)'; c.style.opacity = 0; }); U.inview(el, () => { k.forEach(c => c.style.opacity = 1); requestAnimationFrame(rest); }); });

  // Toggle button blooms into floating pill links. Children: <a> items.
  register('bubble-menu', el => { const o = U.opts(el, { gap: 56 }); el.classList.add('fx-bubm'); const items = [...el.children]; const tg = document.createElement('button'); tg.className = 'tg'; tg.type = 'button'; tg.setAttribute('aria-label', 'Menu'); tg.setAttribute('aria-expanded', 'false'); tg.innerHTML = '<i></i><i></i>'; el.prepend(tg);
    items.forEach((a, i) => { a.style.transitionDelay = (items.length - i) * 30 + 'ms'; }); const set = on => { el.classList.toggle('open', on); tg.setAttribute('aria-expanded', on); items.forEach((a, i) => { a.style.transform = on ? `translateY(${(i + 1) * o.gap}px) scale(1)` : 'scale(.3)'; a.style.transitionDelay = on ? i * 60 + 'ms' : (items.length - i) * 30 + 'ms'; }); }; tg.addEventListener('click', () => set(!el.classList.contains('open'))); items.forEach(a => a.addEventListener('click', () => set(false))); });

  // Header bar that drops open into a row of cards. Structure: [data-fx=card-nav] > .bar (optional), .cards > a
  register('card-nav', el => { el.classList.add('fx-cardnav'); let bar = el.querySelector('.bar'); const cards = el.querySelector('.cards'); if (!bar) { bar = document.createElement('div'); bar.className = 'bar'; bar.innerHTML = `<strong>${el.dataset.title || 'Menu'}</strong>`; el.prepend(bar); } const tg = document.createElement('button'); tg.type = 'button'; tg.textContent = 'Menu'; tg.style.cssText = 'font:inherit;color:inherit;background:transparent;border:1px solid currentColor;border-radius:99px;padding:.4em 1em;cursor:pointer'; tg.setAttribute('aria-expanded', 'false'); bar.append(tg);
    const barH = () => bar.offsetHeight; el.style.height = barH() + 'px'; tg.addEventListener('click', () => { const on = !el.classList.contains('open'); el.classList.toggle('open', on); tg.setAttribute('aria-expanded', on); tg.textContent = on ? 'Close' : 'Menu'; el.style.height = (on ? barH() + cards.offsetHeight + 10 : barH()) + 'px'; [...cards.children].forEach((c, i) => c.style.transitionDelay = on ? 120 + i * 70 + 'ms' : '0ms'); }); });

  // 3D stack of cards; the front card drops away and returns to the back on a timer or click
  register('card-swap', el => { const o = U.opts(el, { every: 3200, dx: 24, dy: 18, dz: 50 }); el.classList.add('fx-cswap'); let order = [...el.children]; const lay = () => order.forEach((c, i) => { c.style.zIndex = order.length - i; c.style.transform = `translate(-50%,-50%) translate3d(${i * o.dx}px,${-i * o.dy}px,${-i * o.dz}px) skewY(${-4}deg)`; c.style.opacity = i > 3 ? 0 : 1; }); lay();
    const swap = () => { const f = order.shift(); f.style.transform += ' translateY(160%)'; setTimeout(() => { order.push(f); lay(); }, 650); }; el.addEventListener('click', swap); if (U.RM) return; let id = setInterval(swap, o.every); el.addEventListener('pointerenter', () => clearInterval(id)); el.addEventListener('pointerleave', () => id = setInterval(swap, o.every)); return () => clearInterval(id); });

  // Everything is grayscale except a window of colour around the cursor
  register('chroma-grid', el => { const o = U.opts(el, { radius: 190 }); el.classList.add('fx-chroma'); el.style.setProperty('--fx-cr', o.radius + 'px'); el.addEventListener('pointermove', e => mouse(el, e)); });

  // Vertical iOS-style wheel picker. Children = options. el.value holds the selected index; fires fx-input.
  register('option-wheel', el => { const o = U.opts(el, { itemH: 40, visible: 5, index: 0 }); el.classList.add('fx-wheel'); el.style.setProperty('--fx-ih', o.itemH + 'px'); el.style.height = o.itemH * o.visible + 'px'; const items = [...el.children]; const inn = document.createElement('div'); inn.className = 'in'; items.forEach(i => { i.classList.add('it'); i.style.height = o.itemH + 'px'; i.style.lineHeight = o.itemH + 'px'; inn.append(i); }); el.append(inn); let pos = o.index, vel = 0, sn = null; const R = o.itemH * 1.9;
    const render = () => { items.forEach((it, i) => { const a = (i - pos) * 24, vis = Math.abs(i - pos) < 4.2; it.style.display = vis ? '' : 'none'; it.style.opacity = Math.max(.12, 1 - Math.abs(i - pos) * .28); it.style.transform = `translateY(${(i - pos) * o.itemH * .82 - o.itemH / 2}px) rotateX(${-a}deg)`; }); };
    drag(el, { down() { sn = null; vel = 0; el.style.cursor = 'grabbing'; }, move(dx, dy) { pos = U.clamp(pos - dy / o.itemH, -.4, items.length - .6); vel = -dy / o.itemH; }, up() { el.style.cursor = 'grab'; sn = U.clamp(Math.round(pos + vel * 5), 0, items.length - 1); } });
    el.addEventListener('wheel', e => { e.preventDefault(); sn = U.clamp(Math.round(pos + Math.sign(e.deltaY)), 0, items.length - 1); }, { passive: false }); let last = -1;
    return U.loop(el, () => { if (sn != null) { pos = U.lerp(pos, sn, .18); if (Math.abs(pos - sn) < .002) { pos = sn; sn = null; } } render(); const idx = Math.round(pos); if (idx !== last) { last = idx; el.value = idx; el.dispatchEvent(new CustomEvent('fx-input', { detail: idx })); } }); });

  // Click a side card to bring it to the centre of a depth-stacked row
  register('depth-carousel', el => { const o = U.opts(el, { step: 120, auto: 0 }); el.classList.add('fx-dc'); const k = [...el.children]; let cur = 0; const lay = () => k.forEach((c, i) => { const d = i - cur, a = Math.abs(d); c.style.transform = `translate(-50%,-50%) translateX(${d * o.step}px) scale(${1 - Math.min(a, 3) * .14}) rotateY(${-d * 8}deg)`; c.style.zIndex = 10 - a; c.style.opacity = a > 3 ? 0 : 1 - a * .22; c.style.filter = a ? `brightness(${1 - a * .18})` : ''; c.style.pointerEvents = a > 3 ? 'none' : ''; }); lay(); el.style.perspective = '1000px';
    k.forEach((c, i) => c.addEventListener('click', () => { cur = i; lay(); })); drag(el, { move() { }, up(e) { } }); el.tabIndex = 0; el.addEventListener('keydown', e => { if (e.key === 'ArrowRight') { cur = Math.min(k.length - 1, cur + 1); lay(); } if (e.key === 'ArrowLeft') { cur = Math.max(0, cur - 1); lay(); } }); if (o.auto) { const id = setInterval(() => { cur = (cur + 1) % k.length; lay(); }, o.auto); return () => clearInterval(id); } });

  // Accordion strip with autoplay (flex carousel)
  register('flex-carousel', el => { const o = U.opts(el, { every: 2600 }); FX.run('accordion-gallery', el); const k = [...el.children]; let i = 0; if (U.RM) return; const id = setInterval(() => { if (el.matches(':hover')) return; i = (i + 1) % k.length; k.forEach((c, n) => c.classList.toggle('on', n === i)); }, o.every); return () => clearInterval(id); });

  // Folder that opens on hover to reveal papers (children become papers; give them content)
  register('folder', el => { const o = U.opts(el, { color: '#f6c453' }); el.classList.add('fx-folder'); el.style.setProperty('--fx-fold', o.color); const papers = [...el.children].slice(0, 3); while (papers.length < 3) { const p = document.createElement('div'); papers.push(p); } const b = document.createElement('div'); b.className = 'back'; const f = document.createElement('div'); f.className = 'front'; el.textContent = ''; el.append(b); papers.forEach(p => { p.classList.add('paper'); el.append(p); }); el.append(f); el.addEventListener('click', () => el.classList.toggle('open')); });

  // Icon tiles with a coloured back plate and glass front. Children: <a data-c1 data-c2 data-label>icon</a>
  register('glass-icons', el => { el.classList.add('fx-gi'); [...el.children].forEach(c => { const inner = c.innerHTML, lab = c.dataset.label || ''; c.innerHTML = `<span class="bk"></span><span class="fr">${inner}</span><span class="lb">${lab}</span>`; if (c.dataset.c1) c.style.setProperty('--c1', c.dataset.c1); if (c.dataset.c2) c.style.setProperty('--c2', c.dataset.c2); if (lab) c.setAttribute('aria-label', lab); }); });

  // Tilted wall of tiles with columns drifting in opposite directions
  register('drift-wall', el => { const o = U.opts(el, { cols: 4, speed: 22 }); el.classList.add('fx-dw'); const items = [...el.children]; const w = document.createElement('div'); w.className = 'w'; w.style.gridTemplateColumns = `repeat(${o.cols},1fr)`; const cols = []; for (let c = 0; c < o.cols; c++) { const d = document.createElement('div'); d.className = 'c'; items.filter((_, i) => i % o.cols === c).forEach(i => d.append(i)); d.append(...[...d.children].map(n => n.cloneNode(true))); w.append(d); cols.push({ d, y: 0 }); } el.append(w); const hs = () => cols.forEach(c => c.h = c.d.scrollHeight / 2 + 7); hs();
    return U.loop(el, (t, dt) => cols.forEach((c, i) => { const dir = i % 2 ? 1 : -1; c.y += dir * o.speed * dt; if (c.h) { if (c.y < -c.h) c.y += c.h; if (c.y > 0) c.y -= c.h; } else hs(); c.d.style.transform = `translateY(${c.y}px)`; })); });

  // Sidebar links with a sliding indicator line that follows the active/hovered item. Tracks sections via href="#id".
  register('line-sidebar', el => { el.classList.add('fx-sb'); const ln = document.createElement('i'); ln.className = 'ln'; el.prepend(ln); const links = U.$$('a', el); const go = a => { ln.style.top = a.offsetTop + 'px'; ln.style.height = a.offsetHeight + 'px'; }; const set = a => { links.forEach(l => l.classList.toggle('on', l === a)); go(a); }; links.forEach(a => { a.addEventListener('click', () => set(a)); a.addEventListener('pointerenter', () => go(a)); }); el.addEventListener('pointerleave', () => go(el.querySelector('a.on') || links[0])); set(links[0]);
    const secs = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean); if (secs.length) { const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) set(links[secs.indexOf(e.target)]); }), { rootMargin: '-40% 0px -55% 0px' }); secs.forEach(s => io.observe(s)); return () => io.disconnect(); } });

  // Card whose surface fills with sparkling pixels on hover
  register('pixel-card', el => { const o = U.opts(el, { color: '#a78bfa', gap: 8, speed: 1 }); el.classList.add('fx-pxc'); const c = document.createElement('canvas'); el.prepend(c); const x = c.getContext('2d'); let px = [], w = 0, h = 0, on = false, raf = 0;
    const build = () => { const r = el.getBoundingClientRect(); w = c.width = r.width; h = c.height = r.height; px = []; for (let yy = 0; yy < h; yy += o.gap) for (let xx = 0; xx < w; xx += o.gap) { const d = Math.hypot(xx - w / 2, yy - h / 2); px.push({ x: xx, y: yy, s: 0, max: U.rand(.4, 1) * o.gap * .8, spd: U.rand(.05, .2) * o.speed, delay: d * .6, t: 0 }); } }; build(); new ResizeObserver(build).observe(el);
    const draw = () => { x.clearRect(0, 0, w, h); x.fillStyle = o.color; let live = false; px.forEach(p => { p.t += on ? 1 : 0; if (on && p.t > p.delay * .1) { p.s = Math.min(p.max, p.s + p.spd + Math.sin(p.t * .1) * .02); } else if (!on) p.s = Math.max(0, p.s - .35); if (p.s > .05) { live = true; x.globalAlpha = .85; x.fillRect(p.x + (o.gap - p.s) / 2, p.y + (o.gap - p.s) / 2, p.s, p.s); } }); if (live || on) raf = requestAnimationFrame(draw); else raf = 0; };
    const go = v => { on = v; if (!v) px.forEach(p => p.t = 0); if (!raf) raf = requestAnimationFrame(draw); }; el.addEventListener('pointerenter', () => go(true)); el.addEventListener('pointerleave', () => go(false)); el.addEventListener('focusin', () => go(true)); el.addEventListener('focusout', () => go(false)); });

  // Button with a specular highlight and glowing edge tracking the cursor
  register('specular-button', el => { el.classList.add('fx-spec'); el.addEventListener('pointermove', e => mouse(el, e)); });
  // Glossy card with a moving metallic reflection
  register('reflective-card', el => { el.classList.add('fx-refl'); el.addEventListener('pointermove', e => { const l = mouse(el, e); el.style.setProperty('--ang', 200 + (l.nx - .5) * 80); el.style.transform = `perspective(900px) rotateX(${(.5 - l.ny) * 8}deg) rotateY(${(l.nx - .5) * 8}deg)`; }); el.addEventListener('pointerleave', () => el.style.transform = ''); el.style.transition = 'transform .35s'; });
  // Profile card = tilt + holo foil + spotlight combined
  register('profile-card', el => { FX.run('tilted-card', el); el.dataset.fx.includes('holo-card') || FX.run('holo-card', el); FX.run('spotlight-card', el); });

  // Bento grid: every child gets spotlight, edge glow, tilt and sparkles on hover
  register('magic-bento', el => { const o = U.opts(el, { color: '#a78bfa', stars: 10 }); const kids = [...el.children]; kids.forEach(c => { c.dataset.opts = JSON.stringify({ color: o.color }); FX.run('border-glow', c); FX.run('spotlight-card', c); c.style.transition = 'transform .3s'; c.style.position = 'relative'; let id = 0; c.addEventListener('pointerenter', () => { if (U.RM) return; id = setInterval(() => { const s = document.createElement('i'); const r = c.getBoundingClientRect(); s.style.cssText = `position:absolute;left:${U.rand(0, r.width)}px;top:${U.rand(0, r.height)}px;width:3px;height:3px;border-radius:50%;background:${o.color};box-shadow:0 0 8px ${o.color};pointer-events:none;opacity:0;transition:transform 1.2s ease-out,opacity 1.2s;z-index:3`; c.append(s); requestAnimationFrame(() => { s.style.opacity = 1; s.style.transform = `translate(${U.rand(-20, 20)}px,${U.rand(-30, -8)}px) scale(${U.rand(1, 2.2)})`; setTimeout(() => s.style.opacity = 0, 500); }); setTimeout(() => s.remove(), 1300); }, 1000 / o.stars * 3); }); c.addEventListener('pointerleave', () => clearInterval(id)); }); });

  // Glass lens that follows the cursor inside the element
  register('fluid-glass', el => { if (!U.fine || U.RM) return; const o = U.opts(el, { size: 150 }); if (getComputedStyle(el).position === 'static') el.style.position = 'relative'; const l = document.createElement('div'); l.className = 'fx-lens'; l.style.width = l.style.height = o.size + 'px'; l.style.opacity = 0; el.append(l); let x = 0, y = 0, tx = 0, ty = 0, on = false; el.addEventListener('pointermove', e => { const p = U.local(el, e); tx = p.x; ty = p.y; if (!on) { x = tx; y = ty; } on = true; l.style.opacity = 1; }); el.addEventListener('pointerleave', () => { on = false; l.style.opacity = 0; });
    return U.loop(el, () => { x = U.lerp(x, tx, .18); y = U.lerp(y, ty, .18); l.style.transform = `translate(${x - o.size / 2}px,${y - o.size / 2}px)`; }); });

  // Animated rolling-digit counter. Set value with data-opts {"value":1234} or el.fxSet(n)
  register('counter', el => { const o = U.opts(el, { value: +el.textContent || 0, pad: 0 }); el.classList.add('fx-odo'); el.setAttribute('role', 'text'); const set = v => { const s = String(Math.max(0, Math.round(v))).padStart(o.pad, '0'); el.setAttribute('aria-label', s); while (el.children.length < s.length) { const c = document.createElement('span'); c.className = 'col'; c.innerHTML = Array.from({ length: 10 }, (_, d) => `<span>${d}</span>`).join(''); el.prepend(c); } while (el.children.length > s.length) el.firstChild.remove(); [...el.children].forEach((c, i) => c.style.transform = `translateY(-${+s[i] * 1.1}em)`); }; el.fxSet = set; set(0); U.inview(el, () => set(o.value)); });

  // Dome / sphere gallery: children pinned inside a drag-rotatable sphere
  register('dome-gallery', el => { const o = U.opts(el, { radius: 320, size: 110, auto: .06 }); const k = [...el.children]; el.style.perspective = '1100px'; el.style.position = 'relative'; el.style.overflow = 'hidden'; const s = document.createElement('div'); s.style.cssText = 'position:absolute;left:50%;top:50%;width:0;height:0;transform-style:preserve-3d'; k.forEach((c, i) => { const n = k.length, phi = Math.acos(1 - 2 * (i + .5) / n), th = Math.PI * (1 + Math.sqrt(5)) * i; c.style.cssText += `;position:absolute;width:${o.size}px;height:${o.size * 1.25}px;left:${-o.size / 2}px;top:${-o.size * .625}px;object-fit:cover;border-radius:10px;backface-visibility:hidden;transform:rotateY(${th * 57.3}deg) rotateX(${(phi - Math.PI / 2) * 57.3}deg) translateZ(${o.radius}px)`; s.append(c); }); el.append(s);
    let ry = 0, rx = 0, vy = o.auto, vx = 0, d = false; drag(el, { down() { d = true; }, move(dx, dy) { vy = dx * .006; vx = -dy * .006; ry += dx * .4; rx = U.clamp(rx - dy * .4, -80, 80); }, up() { d = false; } });
    return U.loop(el, () => { if (!d) { ry += vy * 57.3 * .02 + o.auto * 6; vy *= .96; } s.style.transform = `translateZ(${-o.radius}px) rotateX(${rx}deg) rotateY(${ry}deg)`; }); });

  // Draggable 3D sphere of text/image items (tag-cloud style infinite menu)
  register('infinite-menu', el => { const o = U.opts(el, { radius: 170 }); const k = [...el.children]; el.style.position = 'relative'; el.style.perspective = '900px'; el.style.minHeight = el.style.minHeight || o.radius * 2.3 + 'px'; el.style.touchAction = 'none'; k.forEach(c => { c.style.position = 'absolute'; c.style.left = '50%'; c.style.top = '50%'; c.style.whiteSpace = 'nowrap'; c.style.willChange = 'transform,opacity'; });
    const pts = k.map((c, i) => { const n = k.length, y = 1 - 2 * (i + .5) / n, r = Math.sqrt(1 - y * y), th = Math.PI * (1 + Math.sqrt(5)) * i; return [Math.cos(th) * r, y, Math.sin(th) * r]; }); let ax = .003, ay = .004, rx = 0, ry = 0, d = false; drag(el, { down() { d = true; }, move(dx, dy) { ay = dx * .0016; ax = -dy * .0016; }, up() { d = false; } });
    return U.loop(el, () => { if (!d) { ax *= .985; ay = ay * .985 + (Math.abs(ay) < .003 ? .00006 : 0); } rx += ax; ry += ay; const cx = Math.cos(rx), sx = Math.sin(rx), cy = Math.cos(ry), sy = Math.sin(ry); k.forEach((c, i) => { let [x, y, z] = pts[i]; let y2 = y * cx - z * sx, z2 = y * sx + z * cx; let x2 = x * cy + z2 * sy, z3 = -x * sy + z2 * cy; const s = (z3 + 1.6) / 2.6; c.style.transform = `translate(-50%,-50%) translate3d(${x2 * o.radius}px,${y2 * o.radius}px,${z3 * o.radius}px) scale(${.6 + .55 * s})`; c.style.opacity = .25 + .75 * Math.max(0, (z3 + 1) / 2); c.style.zIndex = Math.round((z3 + 1) * 10); c.style.pointerEvents = z3 > 0 ? '' : 'none'; }); }); });

  // Items spiral through 3D as you scroll
  register('infinite-spiral', el => { const o = U.opts(el, { radius: 260, rise: 70, turn: 38 }); const k = [...el.children]; el.style.position = 'relative'; el.style.perspective = '1000px'; el.style.minHeight = el.style.minHeight || '480px'; el.style.overflow = 'hidden'; k.forEach(c => { c.style.position = 'absolute'; c.style.left = '50%'; c.style.top = '50%'; c.style.willChange = 'transform,opacity'; }); let off = 0, last = scrollY;
    return U.loop(el, (t, dt) => { off += (scrollY - last) * .006 + dt * .25; last = scrollY; k.forEach((c, i) => { const a = (i - off) * o.turn * Math.PI / 180, y = ((i - off) % k.length + k.length) % k.length - k.length / 2, z = Math.cos(a); c.style.transform = `translate(-50%,-50%) translate3d(${Math.sin(a) * o.radius}px,${y * o.rise * .55}px,${z * o.radius * .6}px) scale(${.6 + .4 * (z + 1) / 2})`; c.style.opacity = .3 + .7 * (z + 1) / 2; c.style.zIndex = Math.round((z + 1) * 10); }); }); });

  // Posters in a 3D lane that fly toward the viewer and bend with scroll speed
  register('flying-posters', el => { const o = U.opts(el, { gap: 60, depth: 380 }); const k = [...el.children]; el.style.position = 'relative'; el.style.perspective = '900px'; el.style.minHeight = el.style.minHeight || '440px'; el.style.overflow = 'hidden'; k.forEach(c => { c.style.position = 'absolute'; c.style.left = '50%'; c.style.top = '50%'; c.style.willChange = 'transform'; }); let pos = 0, v = 0, last = scrollY;
    return U.loop(el, (t, dt) => { const sv = (scrollY - last); last = scrollY; v = U.lerp(v, sv, .12); pos += dt * .35 + sv * .004; k.forEach((c, i) => { const p = ((i - pos) % k.length + k.length) % k.length, u = p / k.length, side = i % 2 ? 1 : -1; const z = (1 - u) * o.depth * 1.4 - o.depth * .4; c.style.transform = `translate(-50%,-50%) translate3d(${side * (80 + u * 220)}px,${(u - .5) * 60}px,${z}px) rotateY(${-side * 24 - v * 1.3}deg) rotateX(${v * .6}deg)`; c.style.opacity = u < .08 ? u * 12 : 1 - u * .5; c.style.zIndex = Math.round((1 - u) * 20); }); }); });

  // Cylinder gallery: items on a rotating ring, drag/scroll to spin (circular-gallery / circular-carousel)
  const ring = (el, o) => { const k = [...el.children]; el.style.position = 'relative'; el.style.perspective = '1100px'; el.style.minHeight = el.style.minHeight || '360px'; el.style.touchAction = 'pan-y'; const r = document.createElement('div'); r.style.cssText = 'position:absolute;left:50%;top:50%;width:0;height:0;transform-style:preserve-3d'; k.forEach(c => { c.style.position = 'absolute'; c.style.left = -o.w / 2 + 'px'; c.style.top = -o.h / 2 + 'px'; c.style.width = o.w + 'px'; c.style.height = o.h + 'px'; c.style.backfaceVisibility = 'hidden'; r.append(c); }); el.append(r); const R = o.radius || Math.max(o.w * 1.1, (o.w + 24) * k.length / 6.283);
    let a = 0, v = o.auto, d = false, sn = null; const step = 360 / k.length; const place = () => k.forEach((c, i) => c.style.transform = `rotateY(${i * step}deg) translateZ(${R}px)`); place(); drag(el, { down() { d = true; sn = null; }, move(dx) { a += dx * .35; v = dx * .35; }, up() { d = false; sn = Math.round((a + v * 6) / step) * step; } }); el.addEventListener('wheel', e => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { e.preventDefault(); a += e.deltaX * .1; } }, { passive: false });
    return U.loop(el, () => { if (!d) { if (sn != null) { a = U.lerp(a, sn, .1); if (Math.abs(a - sn) < .05) sn = null; } else { a += v; v = U.lerp(v, o.auto, .02); } } r.style.transform = `translateZ(${-R}px) rotateY(${a}deg)`; }); };
  register('circular-carousel', el => ring(el, Object.assign({ w: 150, h: 200, auto: .15 }, U.opts(el, {}))));
  register('circular-gallery', el => { const o = Object.assign({ w: 200, h: 260, auto: .08 }, U.opts(el, {})); return ring(el, o); });

  // Card with a liquid displacement that tracks pointer speed (SVG turbulence filter) + tilt
  register('decay-card', el => { const id = 'fxd' + Math.random().toString(36).slice(2, 6), NS = 'http://www.w3.org/2000/svg'; const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('width', 0); svg.setAttribute('height', 0); svg.style.position = 'absolute'; svg.innerHTML = `<filter id="${id}"><feTurbulence type="fractalNoise" baseFrequency=".012 .02" numOctaves="2" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="0" xChannelSelector="R" yChannelSelector="G"/></filter>`; el.append(svg); const dm = svg.querySelector('feDisplacementMap'); const tb = svg.querySelector('feTurbulence'); let s = 0, ts = 0, ox = 0; el.style.filter = `url(#${id})`; el.style.transition = 'transform .2s'; if (U.RM) return;
    el.addEventListener('pointermove', e => { const l = U.local(el, e); ts = 55; el.style.transform = `perspective(800px) rotateX(${(.5 - l.ny) * 10}deg) rotateY(${(l.nx - .5) * 12}deg)`; }); el.addEventListener('pointerleave', () => { ts = 0; el.style.transform = ''; });
    return U.loop(el, (t) => { s = U.lerp(s, ts, .12); ts *= .96; dm.setAttribute('scale', s.toFixed(1)); tb.setAttribute('baseFrequency', `${.012 + Math.sin(t) * .002} ${.02 + Math.cos(t * .8) * .003}`); }); });

  // Slider whose thumb squashes, stretches and morphs with drag velocity. fires fx-input.
  register('morph-slider', el => { const o = U.opts(el, { min: 0, max: 100, value: 40 }); el.classList.add('fx-morph'); el.innerHTML = '<div class="tr"></div><div class="fl"></div><div class="th"></div>'; el.setAttribute('role', 'slider'); el.tabIndex = 0; const fl = el.querySelector('.fl'), th = el.querySelector('.th'); let v = o.value, x = 0, vel = 0, tx = 0, d = false;
    const W = () => el.clientWidth; const target = () => (v - o.min) / (o.max - o.min) * W(); const set = e => { v = U.clamp(o.min + (e.clientX - el.getBoundingClientRect().left) / W() * (o.max - o.min), o.min, o.max); }; el.addEventListener('pointerdown', e => { d = true; el.setPointerCapture(e.pointerId); set(e); }); el.addEventListener('pointermove', e => d && set(e)); el.addEventListener('pointerup', () => d = false);
    el.addEventListener('keydown', e => { if (e.key === 'ArrowRight') v = Math.min(o.max, v + 2); if (e.key === 'ArrowLeft') v = Math.max(o.min, v - 2); }); x = target();
    return U.loop(el, () => { tx = target(); const prev = x; x = U.lerp(x, tx, .22); vel = x - prev; const sp = Math.min(1, Math.abs(vel) / 14); th.style.transform = `translateX(${x}px) scale(${1 + sp * .9},${1 - sp * .35})`; th.style.borderRadius = `${50 - sp * 28}% ${50 - sp * 10}% ${50 - sp * 28}% ${50 - sp * 10}%`; fl.style.width = x + 'px'; el.setAttribute('aria-valuenow', Math.round(v)); el.dispatchEvent(new CustomEvent('fx-input', { detail: v })); }); });

  // Fullscreen slide-in menu with coloured pre-layers and staggered items. Children: <a> links. data-opts {"layers":["#a78bfa","#38bdf8"]}
  register('staggered-menu', el => { const o = U.opts(el, { layers: ['#a78bfa', '#38bdf8'], label: 'Menu' }); const links = [...el.children]; const wrap = document.createElement('div'); wrap.className = 'fx-stagm'; o.layers.forEach(c => { const l = document.createElement('div'); l.className = 'ly'; l.style.background = c; wrap.append(l); }); [...wrap.querySelectorAll('.ly')].forEach((l, i) => l.style.transitionDelay = i * 80 + 'ms'); const pn = document.createElement('div'); pn.className = 'pn'; links.forEach((a, i) => { a.innerHTML = `<span style="transition-delay:${.3 + i * .07}s">${a.innerHTML}</span>`; pn.append(a); }); wrap.append(pn); document.body.append(wrap);
    const tg = document.createElement('button'); tg.className = 'fx-stagm-tg'; tg.type = 'button'; tg.textContent = o.label; tg.setAttribute('aria-expanded', 'false'); document.body.append(tg); const set = on => { wrap.classList.toggle('open', on); tg.textContent = on ? 'Close' : o.label; tg.setAttribute('aria-expanded', on); document.body.style.overflow = on ? 'hidden' : ''; }; tg.addEventListener('click', () => set(!wrap.classList.contains('open'))); links.forEach(a => a.addEventListener('click', () => set(false))); addEventListener('keydown', e => e.key === 'Escape' && set(false)); return () => { wrap.remove(); tg.remove(); }; });

  // Hanging lanyard: verlet rope with a draggable card at the end. Child = the card (any element).
  register('lanyard', el => { const o = U.opts(el, { segs: 10, len: 110, color: '#e5e7eb' }); el.classList.add('fx-lanyard'); const card = el.firstElementChild; card.style.cssText += ';position:absolute;left:0;top:0;will-change:transform;cursor:grab;touch-action:none'; const { c, ctx, size } = U.canvasIn(el); c.style.pointerEvents = 'none'; const P = []; const ax = () => size.w / 2; for (let i = 0; i <= o.segs; i++) P.push({ x: ax(), y: -10 + i * o.len / o.segs, px: ax(), py: -10 + i * o.len / o.segs }); let held = false, mx = 0, my = 0; const L = o.len / o.segs; let ang = 0;
    card.addEventListener('pointerdown', e => { held = true; card.setPointerCapture(e.pointerId); card.style.cursor = 'grabbing'; const l = U.local(el, e); mx = l.x; my = l.y; }); card.addEventListener('pointermove', e => { if (!held) return; const l = U.local(el, e); mx = l.x; my = l.y; }); const rel = () => { held = false; card.style.cursor = 'grab'; }; card.addEventListener('pointerup', rel); card.addEventListener('pointercancel', rel);
    return U.loop(el, (t, dt) => { P[0].x = ax(); P[0].y = -10; P.forEach((p, i) => { if (!i) return; const vx = (p.x - p.px) * .985, vy = (p.y - p.py) * .985; p.px = p.x; p.py = p.y; p.x += vx; p.y += vy + 1400 * dt * dt; }); const last = P[P.length - 1]; if (held) { last.x += (mx - last.x) * .35; last.y += (my - card.offsetHeight * .35 - last.y) * .35; }
      for (let k = 0; k < 6; k++) { for (let i = 1; i < P.length; i++) { const a = P[i - 1], b = P[i], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1, diff = (d - L) / d; if (i === 1) { b.x -= dx * diff; b.y -= dy * diff; } else { a.x += dx * diff * .5; a.y += dy * diff * .5; b.x -= dx * diff * .5; b.y -= dy * diff * .5; } } P[0].x = ax(); P[0].y = -10; }
      const pv = P[P.length - 2]; ang = Math.atan2(last.x - pv.x, last.y - pv.y); const d = size.dpr; ctx.setTransform(d, 0, 0, d, 0, 0); ctx.clearRect(0, 0, size.w, size.h); ctx.strokeStyle = o.color; ctx.lineWidth = 7; ctx.lineCap = ctx.lineJoin = 'round'; ctx.beginPath(); P.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.stroke(); ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 1.5; ctx.stroke();
      card.style.transform = `translate(${last.x - card.offsetWidth / 2}px,${last.y - 6}px) rotate(${-ang}rad)`; card.style.transformOrigin = '50% 6px'; }); });

  // Input whose typed text rides a curve. The real <input> is invisible but receives focus and keys.
  register('curved-input', el => { const o = U.opts(el, { curve: 70, size: 46, placeholder: 'Type here…', max: 40 }); el.classList.add('fx-curv'); const NS = 'http://www.w3.org/2000/svg', id = 'fxci' + Math.random().toString(36).slice(2, 6); el.style.position = 'relative'; el.innerHTML = `<svg viewBox="0 0 800 ${o.curve + o.size + 20}" aria-hidden="true"><path id="${id}" fill="none" d="M20 ${o.size} Q400 ${o.size + o.curve * 1.6} 780 ${o.size}"/><text font-size="${o.size}" font-weight="700" fill="currentColor"><textPath href="#${id}" startOffset="50%" text-anchor="middle"></textPath></text></svg><input type="text" maxlength="${o.max}" aria-label="${o.placeholder}">`; const tp = el.querySelector('textPath'), inp = el.querySelector('input'); const upd = () => { tp.textContent = inp.value || o.placeholder; tp.style.opacity = inp.value ? 1 : .4; tp.textContent = (inp.value || o.placeholder) + (document.activeElement === inp && !U.RM && Math.floor(performance.now() / 500) % 2 ? '|' : ''); }; inp.addEventListener('input', upd); inp.addEventListener('focus', upd); inp.addEventListener('blur', upd); upd(); const id2 = setInterval(() => document.activeElement === inp && upd(), 500); return () => clearInterval(id2); });

  // 3D model viewer: loads three.js on demand. data-opts {"src":"model.glb"}; without src shows a torus knot. Drag to orbit.
  register('model-viewer', el => { const o = U.opts(el, { src: '', color: '#a78bfa', auto: true }); el.classList.add('fx-model'); if (!el.style.height && !el.offsetHeight) el.style.height = '320px'; let stop = () => { }, dead = false;
    (async () => { const T = await import('https://esm.sh/three@0.160.0'); if (dead) return; const r = new T.WebGLRenderer({ antialias: true, alpha: true }); r.setPixelRatio(Math.min(devicePixelRatio, 2)); el.append(r.domElement); const sc = new T.Scene(), cam = new T.PerspectiveCamera(40, 1, .1, 100); cam.position.set(0, .2, 4.2); sc.add(new T.HemisphereLight(0xffffff, 0x222244, 1.6)); const dl = new T.DirectionalLight(0xffffff, 2.2); dl.position.set(3, 4, 5); sc.add(dl); const g = new T.Group(); sc.add(g);
      if (o.src) { const { GLTFLoader } = await import('https://esm.sh/three@0.160.0/examples/jsm/loaders/GLTFLoader.js'); const gl = await new GLTFLoader().loadAsync(o.src); const box = new T.Box3().setFromObject(gl.scene), sz = box.getSize(new T.Vector3()).length(), ctr = box.getCenter(new T.Vector3()); gl.scene.position.sub(ctr); gl.scene.scale.setScalar(2.4 / sz); g.add(gl.scene); } else g.add(new T.Mesh(new T.TorusKnotGeometry(.8, .28, 160, 24), new T.MeshStandardMaterial({ color: o.color, metalness: .6, roughness: .25 })));
      let ry = 0, rx = 0, d = false; drag(r.domElement, { down() { d = true; }, move(dx, dy) { ry += dx * .01; rx = U.clamp(rx + dy * .01, -1.2, 1.2); }, up() { d = false; } }); const fit = () => { const w = el.clientWidth, h = el.clientHeight; r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }; new ResizeObserver(fit).observe(el); fit();
      stop = U.loop(el, (t, dt) => { if (!d && o.auto) ry += dt * .6; g.rotation.set(rx, ry, 0); r.render(sc, cam); }); })().catch(e => { el.textContent = '3D unavailable'; console.warn('FX model-viewer', e); }); return () => { dead = true; stop(); }; });
})();

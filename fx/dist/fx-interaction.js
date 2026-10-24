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

/* ===================== CURSOR + INTERACTION ANIMATIONS ===================== */
(function () {
  const { register, util: U } = FX;
  const css = document.createElement('style'); css.id = 'fx-int-css';
  css.textContent = `
.fx-glare{position:relative;overflow:hidden}.fx-glare::after{content:'';position:absolute;inset:-50%;background:linear-gradient(115deg,transparent 40%,rgba(255,255,255,var(--fx-ga,.35)) 50%,transparent 60%);transform:translateX(-80%);transition:transform .8s cubic-bezier(.2,.7,.2,1);pointer-events:none}.fx-glare:hover::after{transform:translateX(80%)}
.fx-starborder{position:relative;overflow:hidden;isolation:isolate}
.fx-starborder::before,.fx-starborder::after{content:'';position:absolute;width:300%;height:50%;opacity:.7;border-radius:50%;z-index:-1;background:radial-gradient(circle,var(--fx-star,#a78bfa),transparent 10%)}
.fx-starborder::before{bottom:-12px;right:-250%;animation:fx-star1 var(--fx-dur,6s) linear infinite alternate}.fx-starborder::after{top:-12px;left:-250%;animation:fx-star2 var(--fx-dur,6s) linear infinite alternate}
@keyframes fx-star1{from{transform:translate(0)}to{transform:translate(-100%)}}@keyframes fx-star2{from{transform:translate(0)}to{transform:translate(100%)}}
.fx-starborder>.fx-inner{position:relative;background:var(--fx-bg,#0b0b10);border-radius:inherit;z-index:1}
.fx-elec{position:relative;--fx-ec:#7cf}.fx-elec>svg.fx-ebr{position:absolute;inset:-6px;width:calc(100% + 12px);height:calc(100% + 12px);pointer-events:none;overflow:visible}
.fx-noise{position:absolute;inset:0;pointer-events:none;opacity:var(--fx-no,.08);mix-blend-mode:overlay}
.fx-cursor-dot{position:fixed;left:0;top:0;pointer-events:none;z-index:9999;will-change:transform}
.fx-marquee{display:flex;overflow:hidden;gap:var(--fx-gap,3rem);-webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}
.fx-marquee>.fx-track{display:flex;flex:none;gap:var(--fx-gap,3rem);align-items:center;animation:fx-mq var(--fx-dur,30s) linear infinite}.fx-marquee:hover>.fx-track{animation-play-state:paused}
@keyframes fx-mq{to{transform:translateX(calc(-100% - var(--fx-gap,3rem)))}}
.fx-reveal{opacity:0;transition:opacity .9s cubic-bezier(.2,.8,.2,1),transform .9s cubic-bezier(.2,.8,.2,1),filter .9s}.fx-reveal.in{opacity:1;transform:none!important;filter:none!important}
`;
  document.head.append(css);

  // Scroll-in reveal with direction. data-opts: {"from":"up|down|left|right|scale","dist":40,"delay":0,"blur":true}
  register('reveal', el => {
    const o = U.opts(el, { from: 'up', dist: 40, delay: 0, blur: false });
    const t = { up: `translateY(${o.dist}px)`, down: `translateY(-${o.dist}px)`, left: `translateX(${o.dist}px)`, right: `translateX(-${o.dist}px)`, scale: 'scale(.92)' }[o.from];
    el.classList.add('fx-reveal'); el.style.transform = t; if (o.blur) el.style.filter = 'blur(10px)'; el.style.transitionDelay = o.delay + 'ms';
    U.inview(el, () => requestAnimationFrame(() => el.classList.add('in')));
  });

  // Elements pulled toward the cursor (buttons, icons)
  register('magnet', el => {
    if (!U.fine || U.RM) return; const o = U.opts(el, { strength: .35, pad: 60 }); let raf = 0, tx = 0, ty = 0, x = 0, y = 0, on = false;
    const step = () => { x = U.lerp(x, tx, .15); y = U.lerp(y, ty, .15); el.style.transform = `translate(${x.toFixed(2)}px,${y.toFixed(2)}px)`; if (on || Math.abs(x) + Math.abs(y) > .1) raf = requestAnimationFrame(step); else { el.style.transform = ''; raf = 0; } };
    const mv = e => { const r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2; const near = Math.abs(e.clientX - cx) < r.width / 2 + o.pad && Math.abs(e.clientY - cy) < r.height / 2 + o.pad; on = near; tx = near ? (e.clientX - cx) * o.strength : 0; ty = near ? (e.clientY - cy) * o.strength : 0; if (!raf) raf = requestAnimationFrame(step); };
    addEventListener('pointermove', mv); return () => removeEventListener('pointermove', mv);
  });

  // Click sparks: short radial lines burst from the click point
  register('click-spark', el => {
    const o = U.opts(el, { color: '#fff', count: 10, size: 12, radius: 34, dur: 520 }); const { ctx, size } = U.canvasIn(el); el.style.cursor = el.style.cursor || 'pointer'; let S = [];
    el.addEventListener('pointerdown', e => { const l = U.local(el, e); const t = performance.now(); for (let i = 0; i < o.count; i++) S.push({ x: l.x, y: l.y, a: 6.283 * i / o.count + U.rand(-.15, .15), t }); });
    return U.loop(el, () => { const d = size.dpr, n = performance.now(); ctx.setTransform(d, 0, 0, d, 0, 0); ctx.clearRect(0, 0, size.w, size.h); ctx.strokeStyle = o.color; ctx.lineWidth = 2; ctx.lineCap = 'round'; S = S.filter(s => n - s.t < o.dur);
      S.forEach(s => { const k = (n - s.t) / o.dur, e = 1 - Math.pow(1 - k, 3), r1 = e * o.radius, r2 = r1 + o.size * (1 - k); ctx.globalAlpha = 1 - k; ctx.beginPath(); ctx.moveTo(s.x + Math.cos(s.a) * r1, s.y + Math.sin(s.a) * r1); ctx.lineTo(s.x + Math.cos(s.a) * r2, s.y + Math.sin(s.a) * r2); ctx.stroke(); }); });
  });

  // Soft blob that trails the real cursor (add to <body> or any container)
  register('blob-cursor', el => {
    if (!U.fine || U.RM) return; const o = U.opts(el, { size: 44, color: '#a78bfa', blobs: 3, lag: [.25, .14, .08] });
    const b = Array.from({ length: o.blobs }, (_, i) => { const d = document.createElement('div'); d.className = 'fx-cursor-dot'; const s = o.size * (1 - i * .22); d.style.cssText += `;width:${s}px;height:${s}px;margin:${-s / 2}px 0 0 ${-s / 2}px;border-radius:50%;background:${o.color};opacity:${.9 - i * .2};mix-blend-mode:${i ? 'normal' : 'difference'};filter:blur(${i * 2}px)`; document.body.append(d); return { d, x: U.ptr.x, y: U.ptr.y, lag: o.lag[i] || .06 }; });
    const stop = U.loop(document.documentElement, () => b.forEach(k => { k.x = U.lerp(k.x, U.ptr.x, k.lag); k.y = U.lerp(k.y, U.ptr.y, k.lag); const sp = Math.min(1.5, Math.hypot(U.ptr.vx, U.ptr.vy) / 40); k.d.style.transform = `translate(${k.x}px,${k.y}px) scale(${1 + sp * .35},${1 - sp * .15}) rotate(${Math.atan2(U.ptr.vy, U.ptr.vx)}rad)`; }));
    return () => { stop(); b.forEach(k => k.d.remove()); };
  });

  // Targeting-reticle cursor that snaps its 4 corners around [data-target] elements
  register('target-cursor', el => {
    if (!U.fine || U.RM) return; const o = U.opts(el, { color: '#fff', selector: 'a,button,[data-target]', size: 10 });
    const w = document.createElement('div'); w.className = 'fx-cursor-dot'; const cs = ['tl', 'tr', 'bl', 'br'].map(k => { const c = document.createElement('i'); c.style.cssText = `position:absolute;width:${o.size}px;height:${o.size}px;border:solid ${o.color};border-width:${k[0] === 't' ? '2px' : '0'} ${k[1] === 'r' ? '2px' : '0'} ${k[0] === 'b' ? '2px' : '0'} ${k[1] === 'l' ? '2px' : '0'}`; w.append(c); return c; }); document.body.append(w);
    const s = { x: U.ptr.x, y: U.ptr.y, hw: 12, hh: 12, tw: 12, th: 12, cx: U.ptr.x, cy: U.ptr.y }; let target = null; const pos = [[-1, -1], [1, -1], [-1, 1], [1, 1]]; let spin = 0;
    const over = e => { target = e.target.closest && e.target.closest(o.selector); }; addEventListener('pointerover', over); document.documentElement.style.cursor = 'none'; el.style.cursor = 'none';
    const stop = U.loop(document.documentElement, (t, dt) => { if (target && document.contains(target)) { const r = target.getBoundingClientRect(); s.cx = U.lerp(s.cx, r.left + r.width / 2, .22); s.cy = U.lerp(s.cy, r.top + r.height / 2, .22); s.tw = r.width / 2 + 6; s.th = r.height / 2 + 6; spin *= .8; } else { s.cx = U.lerp(s.cx, U.ptr.x, .35); s.cy = U.lerp(s.cy, U.ptr.y, .35); s.tw = s.th = 14; spin += dt * 1.6; }
      s.hw = U.lerp(s.hw, s.tw, .2); s.hh = U.lerp(s.hh, s.th, .2); w.style.transform = `translate(${s.cx}px,${s.cy}px) rotate(${target ? 0 : spin}rad)`; cs.forEach((c, i) => c.style.transform = `translate(${pos[i][0] * s.hw - (pos[i][0] > 0 ? o.size : 0)}px,${pos[i][1] * s.hh - (pos[i][1] > 0 ? o.size : 0)}px)`); });
    return () => { stop(); w.remove(); removeEventListener('pointerover', over); document.documentElement.style.cursor = ''; };
  });

  // Images spawn along the cursor path and fade (el contains <img> children used as the pool)
  register('image-trail', el => {
    const o = U.opts(el, { gap: 90, life: 900, size: 160 }); const imgs = [...el.querySelectorAll('img')]; if (!imgs.length) return; imgs.forEach(i => i.style.display = 'none'); el.style.position = 'relative'; el.style.overflow = 'hidden';
    let i = 0, last = { x: -999, y: -999 }; const live = [];
    const mv = e => { const l = U.local(el, e); if (Math.hypot(l.x - last.x, l.y - last.y) < o.gap) return; const dx = l.x - last.x; last = l; const im = imgs[i++ % imgs.length].cloneNode(); im.style.cssText = `position:absolute;left:${l.x}px;top:${l.y}px;width:${o.size}px;height:${o.size * 1.2}px;object-fit:cover;border-radius:10px;pointer-events:none;display:block;transform:translate(-50%,-50%) scale(.4) rotate(${dx * .08}deg);opacity:0;transition:transform .5s cubic-bezier(.2,.8,.2,1),opacity .3s;z-index:0`; el.append(im); requestAnimationFrame(() => { im.style.opacity = 1; im.style.transform = `translate(-50%,-50%) scale(1) rotate(${U.rand(-8, 8)}deg)`; });
      setTimeout(() => { im.style.transition = 'transform .6s ease-in,opacity .6s'; im.style.opacity = 0; im.style.transform += ' scale(.6)'; setTimeout(() => im.remove(), 650); }, o.life); };
    el.addEventListener('pointermove', mv); return () => el.removeEventListener('pointermove', mv);
  });

  // Fading pixel squares follow the pointer
  register('pixel-trail', el => {
    const o = U.opts(el, { px: 28, color: '#a78bfa', fade: 700 }); const { ctx, size } = U.canvasIn(el); const cells = new Map(); el.style.pointerEvents = 'auto';
    el.addEventListener('pointermove', e => { const l = U.local(el, e), k = (l.x / o.px | 0) + ',' + (l.y / o.px | 0); cells.set(k, performance.now()); });
    return U.loop(el, () => { const d = size.dpr, n = performance.now(); ctx.setTransform(d, 0, 0, d, 0, 0); ctx.clearRect(0, 0, size.w, size.h); ctx.fillStyle = o.color; for (const [k, t] of cells) { const a = 1 - (n - t) / o.fade; if (a <= 0) { cells.delete(k); continue; } const [x, y] = k.split(',').map(Number); ctx.globalAlpha = a; ctx.fillRect(x * o.px, y * o.px, o.px - 2, o.px - 2); } });
  });

  // Soft glare sweep on hover
  register('glare-hover', el => { const o = U.opts(el, { alpha: .35 }); el.classList.add('fx-glare'); el.style.setProperty('--fx-ga', o.alpha); });

  // Animated border: two glowing stars orbit along the edge (wrap content in .fx-inner or it is created)
  register('star-border', el => { const o = U.opts(el, { color: '#a78bfa', speed: 6 }); el.classList.add('fx-starborder'); el.style.setProperty('--fx-star', o.color); el.style.setProperty('--fx-dur', o.speed + 's'); const pad = o.pad == null ? 1.5 : o.pad; el.style.padding = pad + 'px'; if (!el.querySelector(':scope>.fx-inner')) { const i = document.createElement('div'); i.className = 'fx-inner'; i.style.padding = o.inner || '.8em 1.4em'; while (el.firstChild) i.append(el.firstChild); el.append(i); } });

  // Electric border: jittering SVG outline (feTurbulence displacement animated)
  register('electric-border', el => {
    const o = U.opts(el, { color: '#7cf', width: 2, radius: 16, chaos: 6 }); el.classList.add('fx-elec'); const id = 'fxe' + Math.random().toString(36).slice(2, 6); const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('class', 'fx-ebr'); svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = `<defs><filter id="${id}" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="turbulence" baseFrequency=".02 .04" numOctaves="2" seed="1" result="n"><animate attributeName="seed" values="1;9;4;12;7" dur="1.2s" repeatCount="indefinite" calcMode="discrete"/></feTurbulence><feDisplacementMap in="SourceGraphic" in2="n" scale="${o.chaos}"/></filter></defs><rect x="6" y="6" width="calc(100% - 12px)" height="calc(100% - 12px)" rx="${o.radius}" fill="none" stroke="${o.color}" stroke-width="${o.width}" filter="url(#${id})" style="filter:url(#${id}) drop-shadow(0 0 6px ${o.color})"/>`;
    el.append(svg); el.style.borderRadius = o.radius + 'px';
  });

  // Film-grain overlay (canvas noise regenerated at low fps)
  register('noise', el => {
    const o = U.opts(el, { alpha: .08, fps: 12, size: 160 }); const c = document.createElement('canvas'); c.width = c.height = o.size; c.className = 'fx-noise'; c.style.cssText += `;width:100%;height:100%;image-rendering:pixelated;opacity:${o.alpha};`; if (getComputedStyle(el).position === 'static') el.style.position = 'relative'; el.append(c);
    const x = c.getContext('2d'), im = x.createImageData(o.size, o.size); let acc = 0;
    const draw = () => { for (let i = 0; i < im.data.length; i += 4) { const v = Math.random() * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; } x.putImageData(im, 0, 0); };
    draw(); if (U.RM) return; return U.loop(el, (t, dt) => { acc += dt; if (acc > 1 / o.fps) { acc = 0; draw(); } });
  });

  // Infinite logo / text marquee (children become the loop; pauses on hover)
  register('logo-loop', el => {
    const o = U.opts(el, { speed: 30, gap: '3rem' }); const kids = [...el.children]; if (!kids.length) return; el.classList.add('fx-marquee'); el.style.setProperty('--fx-gap', o.gap);
    const a = document.createElement('div'); a.className = 'fx-track'; kids.forEach(k => a.append(k)); el.append(a); const fill = () => { while (a.scrollWidth < el.clientWidth * 1.2 && a.children.length < 80) kids.forEach(k => a.append(k.cloneNode(true))); const b = a.cloneNode(true); b.setAttribute('aria-hidden', 'true'); el.append(b); el.style.setProperty('--fx-dur', (a.scrollWidth / o.speed) + 's'); }; requestAnimationFrame(fill);
  });

  // Metaballs: gooey blobs that merge, with one following the cursor (WebGL)
  register('metaballs', el => {
    const o = U.opts(el, { colors: ['#7c3aed', '#22d3ee', '#f472b6'], speed: 1, mouse: true, balls: 7 });
    return U.shaderBg(el, `void main(){vec2 uv=(gl_FragCoord.xy-.5*uRes)/min(uRes.x,uRes.y);float t=uTime*.5;float f=0.;
      for(float i=0.;i<7.;i++){vec2 p=vec2(sin(t*(.6+i*.17)+i*2.1)*.55,cos(t*(.5+i*.13)+i*1.3)*.35);float r=.07+.03*sin(i*3.+t);f+=r*r/dot(uv-p,uv-p);}
      vec2 m=(uMouse-.5)*vec2(uRes.x/uRes.y,1.);f+=.012/dot(uv-m,uv-m);float e=smoothstep(.95,1.05,f);float rim=smoothstep(.8,1.,f)-e;
      vec3 c=mix(uA,uB,clamp(f*.12,0.,1.));c=mix(c,uC,rim);gl_FragColor=vec4(c*e+uC*rim*.5,max(e,rim*.6));}`, o);
  });
})();

/* ===================== MORE ANIMATIONS / CURSOR EFFECTS ===================== */
(function () {
  const { register, util: U } = FX; const N = U.NOISE_GLSL;
  const css = document.createElement('style'); css.id = 'fx-anim2-css';
  css.textContent = `
.fx-cross{position:relative;cursor:crosshair;overflow:hidden}.fx-cross i{position:absolute;pointer-events:none;background:var(--fx-cc,rgba(255,255,255,.45))}.fx-cross .h{left:0;right:0;height:1px}.fx-cross .v{top:0;bottom:0;width:1px}.fx-cross b{position:absolute;pointer-events:none;font:11px ui-monospace,monospace;color:var(--fx-cc,#fff);white-space:nowrap}
.fx-gblur{position:absolute;left:0;right:0;pointer-events:none;z-index:5}.fx-gblur>div{position:absolute;inset:0}
.fx-cube{position:absolute;transform-style:preserve-3d;will-change:transform}.fx-cube i{position:absolute;inset:0;border:1px solid rgba(255,255,255,.12);background:var(--fx-cube,rgba(124,92,255,.18))}
.fx-orbit{position:relative}.fx-orbit>*{position:absolute;left:50%;top:50%;will-change:transform}
.fx-se{position:relative}.fx-se>.m{will-change:transform,width,height;overflow:hidden;margin:0 auto}
.fx-pt{position:relative;overflow:hidden}.fx-pt>.b{position:absolute;inset:0}.fx-pt .pg{position:absolute;inset:0;display:grid;pointer-events:none}.fx-pt .pg i{background:var(--fx-pt,#000);opacity:0;transition:opacity 0s}
.fx-peel{position:relative;display:inline-block;--p:0px;filter:drop-shadow(0 6px 10px rgba(0,0,0,.35))}.fx-peel>img,.fx-peel>.s{display:block;clip-path:polygon(0 0,100% 0,100% calc(100% - var(--p)),calc(100% - var(--p)) 100%,0 100%);transition:clip-path .35s cubic-bezier(.2,.8,.2,1)}.fx-peel::after{content:'';position:absolute;right:0;bottom:0;width:var(--p);height:var(--p);background:linear-gradient(135deg,#d9d9d9 0%,#fff 45%,#bdbdbd 100%);border-top-left-radius:6px;box-shadow:-3px -3px 8px rgba(0,0,0,.25);transition:width .35s cubic-bezier(.2,.8,.2,1),height .35s cubic-bezier(.2,.8,.2,1)}
.fx-gm{overflow:hidden;display:flex;flex-direction:column;gap:var(--fx-gap,12px)}.fx-gm>.r{display:flex;gap:var(--fx-gap,12px);will-change:transform;width:max-content}
.fx-elogo{filter:url(#fx-elog) drop-shadow(0 0 8px var(--fx-el,#7cf));color:var(--fx-el,#7cf)}
`;
  document.head.append(css);

  const overlay = () => { const c = document.createElement('canvas'); c.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9998'; document.body.append(c); const ctx = c.getContext('2d'); const s = { w: 0, h: 0, dpr: 1 }; const fit = () => { s.dpr = Math.min(devicePixelRatio || 1, 2); s.w = innerWidth; s.h = innerHeight; c.width = s.w * s.dpr; c.height = s.h * s.dpr; }; fit(); addEventListener('resize', fit); return { c, ctx, s, kill() { c.remove(); removeEventListener('resize', fit); } }; };
  const runOverlay = (setup) => { if (!U.fine || U.RM) return; const ov = overlay(); const api = setup(ov.ctx, ov.s); const stop = U.loop(document.documentElement, (t, dt) => { ov.ctx.setTransform(ov.s.dpr, 0, 0, ov.s.dpr, 0, 0); api.draw(t, dt); }); return () => { stop(); ov.kill(); }; };

  // Aliases of the reveal system (scroll-in fade + move)
  register('animated-content', el => FX.run('reveal', el));
  register('fade-content', el => { el.dataset.opts = JSON.stringify(Object.assign({ from: 'scale', blur: true }, U.opts(el, {}))); return FX.run('reveal', el); });

  // Full-width crosshair lines with live coordinates
  register('crosshair', el => { el.classList.add('fx-cross'); const h = document.createElement('i'), v = document.createElement('i'), b = document.createElement('b'); h.className = 'h'; v.className = 'v'; el.append(h, v, b); [h, v, b].forEach(n => n.style.opacity = 0);
    el.addEventListener('pointermove', e => { const l = U.local(el, e); h.style.top = l.y + 'px'; v.style.left = l.x + 'px'; b.style.left = l.x + 10 + 'px'; b.style.top = l.y + 10 + 'px'; b.textContent = `${l.x | 0}, ${l.y | 0}`; [h, v, b].forEach(n => n.style.opacity = 1); }); el.addEventListener('pointerleave', () => [h, v, b].forEach(n => n.style.opacity = 0)); });

  // Soft radial glow follows the cursor
  register('glow-cursor', el => { if (!U.fine || U.RM) return; const o = U.opts(el, { size: 420, color: 'rgba(124,92,255,.35)' }); const g = document.createElement('div'); g.className = 'fx-cursor-dot'; g.style.cssText += `;width:${o.size}px;height:${o.size}px;margin:${-o.size / 2}px 0 0 ${-o.size / 2}px;background:radial-gradient(circle,${o.color},transparent 65%);mix-blend-mode:screen;z-index:0`; document.body.append(g); let x = U.ptr.x, y = U.ptr.y;
    const stop = U.loop(document.documentElement, () => { x = U.lerp(x, U.ptr.x, .12); y = U.lerp(y, U.ptr.y, .12); g.style.transform = `translate(${x}px,${y}px)`; }); return () => { stop(); g.remove(); }; });

  // Wispy ghost that lags behind the cursor leaving a fading, wobbling trail
  register('ghost-cursor', el => { const o = U.opts(el, { color: '#a5b4fc', len: 26 }); const pts = [];
    return runOverlay((ctx, s) => ({ draw(t) { pts.unshift({ x: U.ptr.x, y: U.ptr.y }); if (pts.length > o.len) pts.pop(); ctx.globalCompositeOperation = 'lighter'; ctx.shadowColor = o.color; ctx.shadowBlur = 24; ctx.strokeStyle = o.color; ctx.lineCap = 'round';
      for (let i = 1; i < pts.length; i++) { const k = 1 - i / pts.length; ctx.globalAlpha = k * .55; ctx.lineWidth = 2 + k * 14; ctx.beginPath(); ctx.moveTo(pts[i - 1].x + Math.sin(t * 6 + i * .5) * i * .35, pts[i - 1].y + Math.cos(t * 5 + i * .4) * i * .35); ctx.lineTo(pts[i].x + Math.sin(t * 6 + (i + 1) * .5) * (i + 1) * .35, pts[i].y + Math.cos(t * 5 + (i + 1) * .4) * (i + 1) * .35); ctx.stroke(); } ctx.globalCompositeOperation = 'source-over'; ctx.shadowBlur = 0; } })); });

  // Spring-chain ribbons trailing the cursor
  register('ribbons', el => { const o = U.opts(el, { colors: ['#f472b6', '#818cf8', '#22d3ee'], len: 22, width: 14 });
    const R = o.colors.map((c, i) => ({ c, p: Array.from({ length: o.len }, () => ({ x: U.ptr.x, y: U.ptr.y })), k: .32 - i * .06, off: i * 7 }));
    return runOverlay((ctx) => ({ draw(t) { R.forEach((r, ri) => { r.p[0].x += (U.ptr.x + Math.sin(t * 2 + ri) * 8 - r.p[0].x) * r.k; r.p[0].y += (U.ptr.y + Math.cos(t * 2 + ri) * 8 - r.p[0].y) * r.k; for (let i = 1; i < r.p.length; i++) { r.p[i].x += (r.p[i - 1].x - r.p[i].x) * .38; r.p[i].y += (r.p[i - 1].y - r.p[i].y) * .38 + .35; }
      ctx.strokeStyle = r.c; ctx.lineCap = ctx.lineJoin = 'round'; for (let i = 1; i < r.p.length; i++) { ctx.globalAlpha = (1 - i / r.p.length) * .85; ctx.lineWidth = o.width * (1 - i / r.p.length) + 1; ctx.beginPath(); ctx.moveTo(r.p[i - 1].x, r.p[i - 1].y); ctx.lineTo(r.p[i].x, r.p[i].y); ctx.stroke(); } }); } })); });

  // Thin hanging strands whose tips chase the cursor
  register('strands', el => { const o = U.opts(el, { count: 14, color: '#e2e8f0', segs: 14 }); const S = Array.from({ length: o.count }, (_, i) => ({ ax: (i + .5) / o.count, p: Array.from({ length: o.segs }, () => ({ x: 0, y: 0, vx: 0, vy: 0 })), init: false }));
    return runOverlay((ctx, s) => ({ draw(t) { ctx.strokeStyle = o.color; ctx.lineWidth = 1.2; S.forEach(st => { const ax = st.ax * s.w, ay = 0, L = s.h * .5 / o.segs; if (!st.init) { st.p.forEach((q, i) => { q.x = ax; q.y = i * L; }); st.init = true; }
      st.p[0].x = ax; st.p[0].y = ay; for (let i = 1; i < st.p.length; i++) { const q = st.p[i], pr = st.p[i - 1]; q.vy += .4; const dx = q.x - U.ptr.x, dy = q.y - U.ptr.y, d = Math.hypot(dx, dy); if (d < 110) { q.vx += dx / d * (110 - d) * .03; q.vy += dy / d * (110 - d) * .03; } q.x += q.vx; q.y += q.vy; q.vx *= .9; q.vy *= .9; const ddx = q.x - pr.x, ddy = q.y - pr.y, dd = Math.hypot(ddx, ddy) || 1; q.x = pr.x + ddx / dd * L; q.y = pr.y + ddy / dd * L; }
      ctx.globalAlpha = .55; ctx.beginPath(); st.p.forEach((q, i) => i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y)); ctx.stroke(); }); } })); });

  // Swarm of particles orbiting the cursor
  register('swarm-cursor', el => { const o = U.opts(el, { count: 70, color: '#fbbf24' }); const P = Array.from({ length: o.count }, () => ({ x: U.ptr.x + U.rand(-80, 80), y: U.ptr.y + U.rand(-80, 80), vx: 0, vy: 0, a: Math.random() * 6.28, r: U.rand(20, 90), s: U.rand(.8, 2.2) }));
    return runOverlay((ctx) => ({ draw(t, dt) { ctx.fillStyle = o.color; P.forEach(p => { p.a += p.s * dt; const tx = U.ptr.x + Math.cos(p.a) * p.r, ty = U.ptr.y + Math.sin(p.a * 1.3) * p.r * .7; p.vx += (tx - p.x) * .012; p.vy += (ty - p.y) * .012; p.vx *= .93; p.vy *= .93; p.x += p.vx; p.y += p.vy; ctx.globalAlpha = .75; ctx.beginPath(); ctx.arc(p.x, p.y, 1.6 + Math.min(3, Math.hypot(p.vx, p.vy) * .3), 0, 6.283); ctx.fill(); }); } })); });

  // Coloured ink splats thrown by cursor velocity
  register('splash-cursor', el => { const P = []; return runOverlay((ctx, s) => ({ draw(t, dt) { const v = Math.hypot(U.ptr.vx, U.ptr.vy); U.ptr.vx *= .6; U.ptr.vy *= .6; for (let i = 0; i < Math.min(6, v / 6); i++) P.push({ x: U.ptr.x, y: U.ptr.y, vx: U.ptr.vx * .06 + U.rand(-2, 2), vy: U.ptr.vy * .06 + U.rand(-2, 2), r: U.rand(6, 22), h: (t * 60 + U.rand(0, 40)) % 360, life: 1 });
    ctx.globalCompositeOperation = 'lighter'; for (let i = P.length - 1; i >= 0; i--) { const p = P[i]; p.x += p.vx; p.y += p.vy; p.vx *= .96; p.vy *= .96; p.life -= dt * .8; if (p.life <= 0) { P.splice(i, 1); continue; } const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * (1 + (1 - p.life) * 1.5)); g.addColorStop(0, `hsla(${p.h},95%,60%,${p.life * .5})`); g.addColorStop(1, `hsla(${p.h},95%,60%,0)`); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3, 0, 6.283); ctx.fill(); } ctx.globalCompositeOperation = 'source-over'; } })); });

  // Grid whose cells light up and fade along the cursor path (outlined cells)
  register('cursor-grid', el => { const o = U.opts(el, { cell: 44, line: 'rgba(148,163,184,.15)', color: '#a78bfa', fade: 900 }); const { ctx, size } = U.canvasIn(el); const lit = new Map(); el.style.pointerEvents = 'auto';
    el.addEventListener('pointermove', e => { const l = U.local(el, e); lit.set((l.x / o.cell | 0) + ',' + (l.y / o.cell | 0), performance.now()); });
    return U.loop(el, () => { const d = size.dpr, n = performance.now(); ctx.setTransform(d, 0, 0, d, 0, 0); ctx.clearRect(0, 0, size.w, size.h); ctx.strokeStyle = o.line; ctx.lineWidth = 1; ctx.beginPath(); for (let x = 0; x <= size.w; x += o.cell) { ctx.moveTo(x + .5, 0); ctx.lineTo(x + .5, size.h); } for (let y = 0; y <= size.h; y += o.cell) { ctx.moveTo(0, y + .5); ctx.lineTo(size.w, y + .5); } ctx.stroke();
      ctx.fillStyle = o.color; for (const [k, t] of lit) { const a = 1 - (n - t) / o.fade; if (a <= 0) { lit.delete(k); continue; } const [x, y] = k.split(',').map(Number); ctx.globalAlpha = a * .5; ctx.fillRect(x * o.cell + 1, y * o.cell + 1, o.cell - 1, o.cell - 1); ctx.globalAlpha = a; ctx.strokeStyle = o.color; ctx.strokeRect(x * o.cell + 1.5, y * o.cell + 1.5, o.cell - 3, o.cell - 3); } }); });

  // Mesh of springy points pulled by the cursor
  register('elastic-mesh', el => { const o = U.opts(el, { gap: 36, color: '#818cf8', pull: .12, radius: 140 }); const { ctx, size } = U.canvasIn(el); let P = [], cols = 0, rows = 0; const m = { x: -999, y: -999 }; el.style.pointerEvents = 'auto'; el.addEventListener('pointermove', e => { const l = U.local(el, e); m.x = l.x; m.y = l.y; }); el.addEventListener('pointerleave', () => m.x = m.y = -999);
    const build = () => { cols = Math.ceil(size.w / o.gap) + 1; rows = Math.ceil(size.h / o.gap) + 1; P = []; for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) P.push({ hx: c * o.gap, hy: r * o.gap, x: c * o.gap, y: r * o.gap, vx: 0, vy: 0 }); }; build(); new ResizeObserver(build).observe(el);
    return U.loop(el, () => { const d = size.dpr; ctx.setTransform(d, 0, 0, d, 0, 0); ctx.clearRect(0, 0, size.w, size.h); P.forEach(p => { const dx = m.x - p.x, dy = m.y - p.y, dd = Math.hypot(dx, dy); if (dd < o.radius) { const f = (1 - dd / o.radius) * o.pull * 3; p.vx += dx * f * .1; p.vy += dy * f * .1; } p.vx += (p.hx - p.x) * .06; p.vy += (p.hy - p.y) * .06; p.vx *= .86; p.vy *= .86; p.x += p.vx; p.y += p.vy; });
      ctx.strokeStyle = o.color; ctx.globalAlpha = .6; ctx.lineWidth = 1; ctx.beginPath(); for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const p = P[r * cols + c]; if (c < cols - 1) { const q = P[r * cols + c + 1]; ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); } if (r < rows - 1) { const q = P[(r + 1) * cols + c]; ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); } } ctx.stroke(); ctx.fillStyle = o.color; ctx.globalAlpha = .9; P.forEach(p => ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3)); }); });

  // Progressive blur at an edge (stacked backdrop-filter layers). data-opts {"edge":"bottom|top","height":120,"strength":12}
  register('gradual-blur', el => { const o = U.opts(el, { edge: 'bottom', height: 120, strength: 12, layers: 7 }); if (getComputedStyle(el).position === 'static') el.style.position = 'relative'; const w = document.createElement('div'); w.className = 'fx-gblur'; w.style.height = o.height + 'px'; w.style[o.edge] = 0; const dir = o.edge === 'bottom' ? 'to bottom' : 'to top';
    for (let i = 0; i < o.layers; i++) { const d = document.createElement('div'); const k = i / (o.layers - 1), a = Math.max(0, k - 1 / o.layers) * 100, b = k * 100, c = Math.min(100, (k + 1 / o.layers) * 100), e = Math.min(100, (k + 2 / o.layers) * 100); const mask = `linear-gradient(${dir},transparent ${a}%,#000 ${b}%,#000 ${c}%,transparent ${e}%)`; d.style.cssText = `-webkit-mask-image:${mask};mask-image:${mask};backdrop-filter:blur(${(o.strength * (k + .1) * 1).toFixed(1)}px);-webkit-backdrop-filter:blur(${(o.strength * (k + .1)).toFixed(1)}px)`; w.append(d); } el.append(w); });

  // 3D grid of cubes that tilt toward the cursor; click ripples outward
  register('cubes', el => { if (getComputedStyle(el).display === 'inline') el.style.display = 'block'; const o = U.opts(el, { n: 6, size: 38, gap: 8, max: 60 }); el.style.position = 'relative'; el.style.perspective = '900px'; const W = o.n * (o.size + o.gap); const root = document.createElement('div'); root.style.cssText = `position:relative;width:${W}px;height:${W}px;margin:20px auto 0;transform-style:preserve-3d;transform:rotateX(55deg) rotateZ(-35deg) scale(.8)`; el.append(root);
    const cubes = []; for (let r = 0; r < o.n; r++) for (let c = 0; c < o.n; c++) { const cb = document.createElement('div'); cb.className = 'fx-cube'; cb.style.cssText = `width:${o.size}px;height:${o.size}px;left:${c * (o.size + o.gap)}px;top:${r * (o.size + o.gap)}px`; const f = [`rotateY(0) translateZ(${o.size / 2}px)`, `rotateY(90deg) translateZ(${o.size / 2}px)`, `rotateY(180deg) translateZ(${o.size / 2}px)`, `rotateY(-90deg) translateZ(${o.size / 2}px)`, `rotateX(90deg) translateZ(${o.size / 2}px)`, `rotateX(-90deg) translateZ(${o.size / 2}px)`]; f.forEach(t => { const i = document.createElement('i'); i.style.transform = t; cb.append(i); }); root.append(cb); cubes.push({ cb, r, c, z: 0, vz: 0 }); }
    const hit = (cx, cy) => cubes.forEach(q => { const dx = q.c - cx, dy = q.r - cy, d = Math.hypot(dx, dy); q.vz += Math.max(0, 1 - d / 3) * 4; });
    root.addEventListener('pointermove', e => { const rect = root.getBoundingClientRect(); const near = cubes.reduce((a, q) => { const r = q.cb.getBoundingClientRect(), d = Math.hypot(e.clientX - r.left - r.width / 2, e.clientY - r.top - r.height / 2); return d < a.d ? { d, q } : a; }, { d: 1e9 }); if (near.q && near.d < o.size * 1.4) hit(near.q.c, near.q.r); });
    root.addEventListener('pointerdown', e => cubes.forEach(q => q.vz += 5 + Math.random() * 3));
    return U.loop(el, () => cubes.forEach(q => { q.vz += -q.z * .06; q.vz *= .88; q.z += q.vz; q.cb.style.transform = `translateZ(${q.z * o.max / 6}px) rotateX(${q.z * 12}deg)`; })); });

  // Children orbit an ellipse with depth scaling. data-opts {"rx":220,"ry":60,"speed":.25}
  register('orbit-images', el => { const o = U.opts(el, { rx: 220, ry: 70, speed: .25, tilt: -8 }); el.classList.add('fx-orbit'); const k = [...el.children]; el.style.minHeight = el.style.minHeight || o.ry * 3 + 'px'; let a = 0, boost = 0; el.addEventListener('pointerenter', () => boost = -.7); el.addEventListener('pointerleave', () => boost = 0);
    return U.loop(el, (t, dt) => { a += dt * o.speed * (1 + boost); k.forEach((c, i) => { const th = a * 6.283 + i / k.length * 6.283, x = Math.cos(th) * o.rx, y = Math.sin(th) * o.ry, z = (Math.sin(th) + 1) / 2; c.style.transform = `translate(-50%,-50%) translate(${x}px,${y}px) rotate(${o.tilt}deg) scale(${.65 + .5 * z})`; c.style.zIndex = Math.round(z * 10); c.style.opacity = .55 + .45 * z; }); }); });

  // Media grows from a small card to full width as you scroll through the tall wrapper
  register('scroll-expand', el => { const o = U.opts(el, { from: .38, minH: 260, ratio: .56, tall: 2.2 }); el.classList.add('fx-se'); const m = el.firstElementChild; m.classList.add('m'); const stick = document.createElement('div'); stick.style.cssText = 'position:sticky;top:0;height:100vh;display:grid;place-items:center'; m.replaceWith(stick); stick.append(m); el.style.height = o.tall * 100 + 'vh';
    const upd = () => { const r = el.getBoundingClientRect(), p = U.clamp(-r.top / (r.height - innerHeight), 0, 1), e = p * p * (3 - 2 * p), W = el.clientWidth, w = W * (o.from + (1 - o.from) * e), h = o.minH + (innerHeight - o.minH) * e; m.style.width = w + 'px'; m.style.height = Math.min(h, w * 1.4) + 'px'; m.style.borderRadius = 24 * (1 - e) + 'px'; }; if (U.RM) return; addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd(); });

  // Hover reveals the 2nd layer through a grid of blocks. Children: first = base, second = hover content.
  register('pixel-transition', el => { const o = U.opts(el, { cols: 12, rows: 8, dur: 450, color: '#000' }); el.classList.add('fx-pt'); const [a, b] = el.children; a.classList.add('b'); b.classList.add('b'); b.style.opacity = 0; const g = document.createElement('div'); g.className = 'pg'; g.style.cssText += `;grid-template-columns:repeat(${o.cols},1fr);grid-template-rows:repeat(${o.rows},1fr)`; g.style.setProperty('--fx-pt', o.color); const cells = []; for (let i = 0; i < o.cols * o.rows; i++) { const c = document.createElement('i'); g.append(c); cells.push(c); } el.append(g); let on = false, busy = 0;
    const swap = to => { clearTimeout(busy); cells.forEach(c => { c.style.transition = 'none'; c.style.opacity = 0; }); const ord = cells.map((c, i) => [c, Math.random()]).sort((x, y) => x[1] - y[1]); ord.forEach(([c], i) => setTimeout(() => { c.style.opacity = 1; }, i / cells.length * o.dur)); busy = setTimeout(() => { b.style.opacity = to ? 1 : 0; ord.forEach(([c], i) => setTimeout(() => { c.style.opacity = 0; }, i / cells.length * o.dur)); }, o.dur + 40); };
    const go = to => { if (to === on) return; on = to; swap(to); }; el.addEventListener('pointerenter', () => go(true)); el.addEventListener('pointerleave', () => go(false)); el.addEventListener('click', () => go(!on)); });

  // Auto-cycles child layers using the same blocky dissolve
  register('pixel-swap', el => { const o = U.opts(el, { every: 3000, cols: 14, rows: 9, dur: 500 }); const k = [...el.children]; el.style.position = 'relative'; el.style.overflow = 'hidden'; k.forEach((c, i) => { c.style.cssText += `;position:absolute;inset:0;width:100%;height:100%;opacity:${i ? 0 : 1};object-fit:cover`; }); const g = document.createElement('div'); g.style.cssText = `position:absolute;inset:0;display:grid;pointer-events:none;grid-template-columns:repeat(${o.cols},1fr);grid-template-rows:repeat(${o.rows},1fr)`; const cells = []; for (let i = 0; i < o.cols * o.rows; i++) { const c = document.createElement('i'); c.style.background = o.color || '#000'; c.style.opacity = 0; g.append(c); cells.push(c); } el.append(g); let cur = 0; if (U.RM || k.length < 2) return;
    const id = setInterval(() => { const ord = cells.map(c => [c, Math.random()]).sort((x, y) => x[1] - y[1]); ord.forEach(([c], i) => setTimeout(() => c.style.opacity = 1, i / cells.length * o.dur)); setTimeout(() => { k[cur].style.opacity = 0; cur = (cur + 1) % k.length; k[cur].style.opacity = 1; ord.forEach(([c], i) => setTimeout(() => c.style.opacity = 0, i / cells.length * o.dur)); }, o.dur + 40); }, o.every); return () => clearInterval(id); });

  // Sticker whose corner peels up on hover (an <img> or any child)
  register('sticker-peel', el => { const o = U.opts(el, { peel: 70, rest: 14 }); el.classList.add('fx-peel'); el.style.setProperty('--p', o.rest + 'px'); el.addEventListener('pointerenter', () => el.style.setProperty('--p', o.peel + 'px')); el.addEventListener('pointerleave', () => el.style.setProperty('--p', o.rest + 'px')); const img = el.querySelector('img'); if (img) img.draggable = false; });

  // Rows of items slide in opposite directions with the pointer. Children = items; split into data-opts rows.
  register('grid-motion', el => { const o = U.opts(el, { rows: 4, amount: 160 }); const items = [...el.children]; el.classList.add('fx-gm'); const per = Math.ceil(items.length / o.rows); const rows = []; for (let r = 0; r < o.rows; r++) { const d = document.createElement('div'); d.className = 'r'; items.slice(r * per, (r + 1) * per).forEach(i => d.append(i)); el.append(d); rows.push({ d, x: 0 }); } let mx = .5, tx = .5; el.addEventListener('pointermove', e => tx = U.local(el, e).nx); el.addEventListener('pointerleave', () => tx = .5);
    return U.loop(el, (t) => { mx = U.lerp(mx, tx, .06); rows.forEach((r, i) => { const dir = i % 2 ? -1 : 1; r.d.style.transform = `translateX(${(mx - .5) * o.amount * dir - (i % 2 ? 40 : 0)}px)`; }); }); });

  // Electric / flickering logo text or SVG
  register('electric-logo', el => { if (!document.getElementById('fx-elog-svg')) document.body.insertAdjacentHTML('beforeend', '<svg id="fx-elog-svg" width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="fx-elog"><feTurbulence type="fractalNoise" baseFrequency=".025 .06" numOctaves="2" result="n"><animate attributeName="seed" values="2;7;3;9;5;1" dur=".9s" repeatCount="indefinite" calcMode="discrete"/></feTurbulence><feDisplacementMap in="SourceGraphic" in2="n" scale="5"/></filter></svg>'); const o = U.opts(el, { color: '#7cf' }); el.classList.add('fx-elogo'); el.style.setProperty('--fx-el', o.color); });

  // ----------- shader-based effects -----------
  const sh = (name, frag, d = {}) => register(name, el => { const o = U.opts(el, Object.assign({ colors: ['#7c3aed', '#22d3ee', '#ffffff'], speed: 1, scale: 1, mouse: true }, d)); return U.shaderBg(el, frag, o); });
  const UV = 'vec2 uv=gl_FragCoord.xy/uRes;float asp=uRes.x/uRes.y;vec2 p=(uv-.5)*vec2(asp,1.);float T=uTime;';
  sh('laser-flow', N + `void main(){${UV}float x=p.x-(uMouse.x-.5)*.3;float w=.012+.02*smoothstep(.5,-.5,p.y);float beam=exp(-abs(x+(fbm(vec2(p.y*3.,T*.8))-.5)*.05)/w);float fog=exp(-abs(x)*2.2)*fbm(vec2(x*3.,p.y*2.-T*.5))*.9;float floorG=exp(-abs(p.y+.38)*30.)*exp(-abs(x)*4.);
    vec3 c=uA*beam*(.6+.4*fbm(vec2(p.y*8.,T*2.)))+uB*fog*.6+uC*floorG*1.1;gl_FragColor=vec4(c,clamp(max(max(c.r,c.g),c.b),0.,1.));}`, { colors: ['#ff3b6b', '#7c3aed', '#ffffff'] });
  sh('metallic-paint', N + `void main(){${UV}vec2 q=p*1.4*uS+(uMouse-.5)*.6;for(float i=1.;i<7.;i++){q+=vec2(sin(q.y*1.7+T*.35*i),cos(q.x*1.5-T*.3*i))/i*.9;}float h=sin(q.x*2.)*.5+.5;float n=fbm(q*1.5);float spec=pow(abs(sin(q.x*3.+q.y*2.+n*3.)),6.);
    vec3 c=mix(uA*.25,uB*.78,smoothstep(.1,.9,h*.7+n*.5))+uC*spec*.35;gl_FragColor=vec4(c,1.);}`, { colors: ['#475569', '#e2e8f0', '#ffffff'] });
  sh('shape-blur', `float sdr(vec2 p,vec2 b,float r){vec2 q=abs(p)-b+r;return length(max(q,0.))+min(max(q.x,q.y),0.)-r;}void main(){${UV}vec2 m=(uMouse-.5)*vec2(asp,1.);float d=sdr(p-m*.6,vec2(.28,.18)*uS,.1+.06*sin(T));float soft=.04+.1*length(m);float a=smoothstep(soft,-soft,d);float rim=exp(-abs(d)*30.);
    vec3 c=mix(uA,uB,uv.x+uv.y*.4)*a+uC*rim*.5;gl_FragColor=vec4(c,clamp(a+rim*.4,0.,1.));}`, { colors: ['#a78bfa', '#38bdf8', '#fff'] });
  sh('dither-veil', N + `float bay(vec2 f){vec2 i=mod(floor(f),4.);return (mod(i.x,2.)*2.+mod(i.y,2.)*1.+ floor(i.x/2.)*8.+floor(i.y/2.)*4.+ mod(i.x*i.y,3.)*.0)/16.;}
    void main(){vec2 px=floor(gl_FragCoord.xy/3.);float asp=uRes.x/uRes.y;vec2 uv=px*3./uRes;float d=length((uv-uMouse)*vec2(asp,1.));float v=fbm(uv*vec2(asp,1.)*4.+uTime*.1);float veil=smoothstep(.12,.55,d+(v-.5)*.35);float on=step(bay(px),veil*.9);
    gl_FragColor=vec4(uA*on,on*.92);}`, { colors: ['#cbd5e1'] });
  sh('grid-scan', `void main(){vec2 q=gl_FragCoord.xy/uRes;float hz=.42;float y=q.y-hz;float z=1./(abs(y)+.02);vec2 g=vec2((q.x-.5)*asp0()*z*.9*uS,z*.9*uS-uTime*.8);vec2 f=abs(fract(g)-.5);float line=smoothstep(.46,.5,max(f.x,f.y));float fade=exp(-z*.0)*smoothstep(0.,.5,abs(y))*(y<0.?1.:.0);
    float sweep=exp(-abs(fract(uTime*.2)*1.2-q.y*1.)*18.);vec3 c=(uA*line*(.4+sweep*2.)+uB*sweep*.15)*fade;gl_FragColor=vec4(c,1.);}`.replace('asp0()', '(uRes.x/uRes.y)'), { colors: ['#22d3ee', '#7c3aed'] });
  sh('crystalized-ball', N + `vec2 hh(vec2 p){p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)));return fract(sin(p)*43758.5453);}void main(){${UV}float r=length(p)/(.34*uS);if(r>1.){gl_FragColor=vec4(0.);return;}vec3 n=vec3(p/(.34*uS),sqrt(1.-r*r));
    float a=T*.3;n.xz=mat2(cos(a),-sin(a),sin(a),cos(a))*n.xz;vec2 g=vec2(atan(n.z,n.x),n.y)*vec2(3.2,3.2)*1.5;vec2 i=floor(g),f=fract(g);float md=9.;vec2 id=vec2(0.);for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){vec2 b=vec2(float(x),float(y));vec2 o=hh(i+b);float d=length(b+o-f);if(d<md){md=d;id=i+b;}}
    vec2 h=hh(id);vec3 fn=normalize(n+(vec3(h,h.x*h.y)-.5)*.7);vec3 L=normalize(vec3(.5,.7,.8));float dif=max(dot(fn,L),0.);float spec=pow(max(dot(reflect(-L,fn),vec3(0.,0.,1.)),0.),30.);float edge=smoothstep(.0,.08,md*0.+0.)*0.;
    vec3 c=mix(uA,uB,h.x*.8)*(.18+.55*dif)+uC*spec*.6;c+=uB*pow(1.-n.z,3.)*.35;gl_FragColor=vec4(c,1.);}`, { colors: ['#5b21b6', '#38bdf8', '#ffffff'], mouse: false });
})();

/* ===================== IMAGE (WebGL) EFFECTS =====================
   Put the picture as the first <img> inside the element (it is hidden and used as a texture), or pass data-opts {"image":"url"}.
   The image host must allow cross-origin use (Unsplash does). Give the element a size. */
(function () {
  const { register, util: U } = FX;
  const img = (name, frag, d = {}) => register(name, el => {
    const o = U.opts(el, Object.assign({ speed: 1, scale: 1, mouse: true, colors: ['#ffffff'] }, d)); const im = el.querySelector('img'); if (!o.image && im) { o.image = im.currentSrc || im.src; el.setAttribute('role', 'img'); el.setAttribute('aria-label', im.alt || ''); im.style.display = 'none'; }
    if (!o.image) return console.warn('FX', name, 'needs an <img> child or data-opts image'); el.style.overflow = 'hidden'; return U.shaderBg(el, frag, o); });
  // cover-fit uv for the texture
  const COVER = 'vec2 cover(vec2 uv){float a=uRes.x/uRes.y;vec2 s=a>uImgA?vec2(1.,uImgA/a):vec2(a/uImgA,1.);return (uv-.5)*s+.5;}';

  // Click and hover send ripples through the picture
  img('ripple-distortion', COVER + `void main(){vec2 uv=gl_FragCoord.xy/uRes;float asp=uRes.x/uRes.y;vec2 q=uv;vec2 d=(uv-uClk.xy)*vec2(asp,1.);float r=length(d);float age=uClk.z;
    float wave=sin(r*38.-age*9.)*exp(-r*5.-age*1.6)*.03*step(age,3.5);q+=normalize(d+1e-4)*wave;vec2 h=(uv-uMouse)*vec2(asp,1.);float hr=length(h);q+=normalize(h+1e-4)*sin(hr*30.-uTime*5.)*exp(-hr*7.)*.012;
    vec3 c=texture2D(uTex,cover(q)).rgb;c+=wave*6.;gl_FragColor=vec4(c,1.);}`);

  // Image becomes halftone dots that swell into the full-colour photo near the cursor
  img('halftone-reveal', COVER + `void main(){vec2 uv=gl_FragCoord.xy/uRes;float cell=11.*uS;vec2 g=gl_FragCoord.xy/cell;vec2 id=floor(g),f=fract(g)-.5;vec2 cuv=(id+.5)*cell/uRes;vec3 c=texture2D(uTex,cover(cuv)).rgb;float lum=dot(c,vec3(.299,.587,.114));
    float asp=uRes.x/uRes.y;float k=smoothstep(.34,.0,length((uv-uMouse)*vec2(asp,1.)));float rad=mix(.5*sqrt(lum)*.95,.72,k);float dot=smoothstep(rad+.06,rad-.06,length(f));
    vec3 full=texture2D(uTex,cover(uv)).rgb;vec3 ink=mix(vec3(.93,.92,.88)*lum*1.1+.04,c,k);vec3 col=mix(vec3(.04),ink,dot);col=mix(col,full,smoothstep(.0,.9,k)*k);gl_FragColor=vec4(col,1.);}`);

  // Picture with a lens-like bulge following the cursor and RGB split proportional to speed
  img('image-bulge', COVER + `void main(){vec2 uv=gl_FragCoord.xy/uRes;float asp=uRes.x/uRes.y;vec2 d=(uv-uMouse)*vec2(asp,1.);float r=length(d);float k=smoothstep(.3,.0,r);vec2 q=uv-(uv-uMouse)*k*.35;float s=length(uVel)*2.;
    vec3 c=vec3(texture2D(uTex,cover(q+uVel*.08*k)).r,texture2D(uTex,cover(q)).g,texture2D(uTex,cover(q-uVel*.08*k)).b);gl_FragColor=vec4(c,1.);}`);
})();

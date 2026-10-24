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

/* ===================== TEXT ===================== */
(function () {
  const { register, util: U } = FX;
  const css = document.createElement('style'); css.id = 'fx-text-css';
  css.textContent = `
.fx-shiny{background:linear-gradient(110deg,var(--fx-base,#8a8a8a) 35%,var(--fx-shine,#fff) 50%,var(--fx-base,#8a8a8a) 65%);background-size:250% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:fx-shine var(--fx-dur,3s) linear infinite}
@keyframes fx-shine{from{background-position:150% 0}to{background-position:-50% 0}}
.fx-gradtext{background:linear-gradient(90deg,var(--fx-c1,#ff6ec4),var(--fx-c2,#7873f5),var(--fx-c3,#4ade80),var(--fx-c1,#ff6ec4));background-size:300% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:fx-grad var(--fx-dur,6s) linear infinite}
@keyframes fx-grad{to{background-position:-300% 0}}
.fx-glitch{position:relative;display:inline-block}
.fx-glitch::before,.fx-glitch::after{content:attr(data-text);position:absolute;inset:0;overflow:hidden;opacity:.85;pointer-events:none}
.fx-glitch::before{color:var(--fx-g1,#ff2d6f);transform:translate(var(--fx-gx,2px),0);animation:fx-gl1 var(--fx-dur,2.4s) infinite steps(1)}
.fx-glitch::after{color:var(--fx-g2,#22e3ff);transform:translate(calc(var(--fx-gx,2px)*-1),0);animation:fx-gl2 var(--fx-dur,2.4s) infinite steps(1)}
@keyframes fx-gl1{0%,100%{clip-path:inset(0 0 100% 0)}8%{clip-path:inset(10% 0 60% 0)}12%{clip-path:inset(70% 0 5% 0)}40%{clip-path:inset(0 0 100% 0)}72%{clip-path:inset(40% 0 35% 0)}76%{clip-path:inset(0 0 100% 0)}}
@keyframes fx-gl2{0%,100%{clip-path:inset(100% 0 0 0)}10%{clip-path:inset(55% 0 20% 0)}14%{clip-path:inset(5% 0 80% 0)}45%{clip-path:inset(100% 0 0 0)}70%{clip-path:inset(20% 0 55% 0)}74%{clip-path:inset(100% 0 0 0)}}
.fx-caret::after{content:'';display:inline-block;width:.08em;height:1em;margin-left:.06em;background:currentColor;vertical-align:-.12em;animation:fx-blink 1s steps(1) infinite}
@keyframes fx-blink{50%{opacity:0}}
.fx-focus-box{position:absolute;pointer-events:none;border:0 solid var(--fx-focus,#7cf);transition:all .45s cubic-bezier(.2,.8,.2,1);opacity:0}
.fx-focus-box i{position:absolute;width:.4em;height:.4em;border:solid var(--fx-focus,#7cf);border-width:0}
.fx-focus-box i:nth-child(1){top:-.15em;left:-.15em;border-width:2px 0 0 2px}.fx-focus-box i:nth-child(2){top:-.15em;right:-.15em;border-width:2px 2px 0 0}
.fx-focus-box i:nth-child(3){bottom:-.15em;left:-.15em;border-width:0 0 2px 2px}.fx-focus-box i:nth-child(4){bottom:-.15em;right:-.15em;border-width:0 2px 2px 0}
.fx-marq{display:flex;overflow:hidden;white-space:nowrap}.fx-marq>div{display:flex;flex:none;will-change:transform}
.fx-rot{display:inline-flex;position:relative;vertical-align:bottom;overflow:hidden}
.fx-stroke{-webkit-text-stroke:var(--fx-sw,1.5px) var(--fx-sc,currentColor);color:transparent;transition:color .5s}.fx-stroke:hover{color:var(--fx-sc,currentColor)}
`;
  document.head.append(css);

  // Blur-in text, word or char at a time
  register('blur-text', (el) => {
    const o = U.opts(el, { by: 'words', delay: 70, dur: 800, from: 'bottom', blur: 10 });
    const { words, chars } = U.split(el, o.by === 'chars' ? 'chars' : 'words'); const parts = o.by === 'chars' ? chars : words;
    const dy = o.from === 'top' ? -24 : 24;
    parts.forEach((p, i) => { p.style.cssText += `;opacity:0;filter:blur(${o.blur}px);transform:translateY(${dy}px);transition:opacity ${o.dur}ms cubic-bezier(.2,.8,.2,1) ${i * o.delay}ms,filter ${o.dur}ms cubic-bezier(.2,.8,.2,1) ${i * o.delay}ms,transform ${o.dur}ms cubic-bezier(.2,.8,.2,1) ${i * o.delay}ms`; });
    U.inview(el, () => requestAnimationFrame(() => parts.forEach(p => { p.style.opacity = 1; p.style.filter = 'none'; p.style.transform = 'none'; })));
  });

  // Chars rise out of a mask
  register('split-text', (el) => {
    const o = U.opts(el, { delay: 28, dur: 900, rotate: 8 });
    const { chars, words } = U.split(el);
    words.forEach(w => { w.style.overflow = 'hidden'; w.style.verticalAlign = 'top'; w.style.paddingBottom = '.1em'; });
    chars.forEach((c, i) => { c.style.cssText += `;transform:translateY(110%) rotate(${o.rotate}deg);opacity:0;transition:transform ${o.dur}ms cubic-bezier(.16,1,.3,1) ${i * o.delay}ms,opacity ${o.dur / 2}ms ease ${i * o.delay}ms`; });
    U.inview(el, () => requestAnimationFrame(() => chars.forEach(c => { c.style.transform = 'none'; c.style.opacity = 1; })));
  });

  // Moving highlight sweep
  register('shiny-text', (el) => { const o = U.opts(el, {}); el.classList.add('fx-shiny'); if (o.speed) el.style.setProperty('--fx-dur', o.speed + 's'); });
  register('gradient-text', (el) => { const o = U.opts(el, {}); el.classList.add('fx-gradtext'); if (o.speed) el.style.setProperty('--fx-dur', o.speed + 's'); });
  register('glitch-text', (el) => { el.classList.add('fx-glitch'); el.dataset.text = el.textContent; });
  register('stroke-text', (el) => el.classList.add('fx-stroke'));

  // Scramble: letters cycle through random glyphs then settle (on view and on hover)
  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!<>-_\\/[]{}=+*^?#';
  const scramble = (el, defaults) => {
    const o = U.opts(el, Object.assign({ speed: 40, steps: 14, hover: true, chars: GLYPHS, sequential: true }, defaults));
    const final = el.textContent; el.setAttribute('aria-label', final);
    let timer = 0;
    const run = () => {
      clearInterval(timer); let f = 0; const n = final.length, total = o.sequential ? n * 2 + o.steps : o.steps * 2;
      timer = setInterval(() => {
        f++; let out = '';
        for (let i = 0; i < n; i++) {
          const ch = final[i]; if (ch === ' ') { out += ' '; continue; }
          const settle = o.sequential ? i * 2 + o.steps : total; out += f >= settle ? ch : o.chars[Math.floor(Math.random() * o.chars.length)];
        }
        el.textContent = out; if (f >= total) { clearInterval(timer); el.textContent = final; }
      }, o.speed);
    };
    el.style.fontVariantNumeric = 'tabular-nums';
    if (U.RM) return; U.inview(el, run); if (o.hover) el.addEventListener('pointerenter', run);
    return () => clearInterval(timer);
  };
  register('scramble-text', el => scramble(el, {}));
  register('decrypted-text', el => scramble(el, { chars: '01▓▒░#$%&@', steps: 6, speed: 35 }));

  // Typewriter, optionally looping through several strings
  register('type-text', (el) => {
    const o = U.opts(el, { texts: null, speed: 55, erase: 28, pause: 1600, loop: true, caret: true });
    const list = o.texts || [el.textContent.trim()]; el.setAttribute('aria-label', list.join('. ')); el.textContent = '';
    const span = document.createElement('span'); el.append(span); if (o.caret) el.classList.add('fx-caret');
    if (U.RM) { span.textContent = list[0]; return; }
    let alive = true, i = 0;
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    (async () => {
      await new Promise(r => U.inview(el, r));
      while (alive) {
        const t = list[i % list.length];
        for (let k = 1; k <= t.length && alive; k++) { span.textContent = t.slice(0, k); await sleep(o.speed * (.6 + Math.random() * .8)); }
        if (!o.loop && i >= list.length - 1) break;
        await sleep(o.pause);
        for (let k = t.length; k >= 0 && alive; k--) { span.textContent = t.slice(0, k); await sleep(o.erase); }
        i++; await sleep(300);
      }
    })();
    return () => alive = false;
  });

  // Number counts up when visible. <span data-fx="count-up" data-opts='{"to":1280,"prefix":"$","suffix":"k"}'>
  register('count-up', (el) => {
    const o = U.opts(el, { from: 0, to: +el.textContent.replace(/[^\d.-]/g, '') || 0, dur: 2000, decimals: 0, prefix: '', suffix: '', sep: ',' });
    const fmt = v => o.prefix + v.toFixed(o.decimals).replace(/\B(?=(\d{3})+(?!\d))/g, o.sep) + o.suffix;
    el.setAttribute('aria-label', fmt(o.to)); el.style.fontVariantNumeric = 'tabular-nums'; el.textContent = fmt(o.from);
    U.inview(el, () => { if (U.RM) return el.textContent = fmt(o.to); const t0 = performance.now(); const step = n => { const t = Math.min(1, (n - t0) / o.dur); const e = 1 - Math.pow(1 - t, 4); el.textContent = fmt(o.from + (o.to - o.from) * e); if (t < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); });
  });

  // Words rotate in place with a slide mask
  register('rotating-text', (el) => {
    const o = U.opts(el, { texts: ['fast', 'bold', 'alive'], every: 2200, dur: 600 });
    el.classList.add('fx-rot'); el.setAttribute('aria-label', o.texts.join(', ')); el.textContent = '';
    const mk = t => { const s = document.createElement('span'); s.textContent = t; s.setAttribute('aria-hidden', 'true'); s.style.cssText = 'display:block;transition:transform ' + o.dur + 'ms cubic-bezier(.7,0,.2,1),opacity ' + o.dur + 'ms'; return s; };
    let cur = mk(o.texts[0]); el.append(cur); let i = 0; if (U.RM) return;
    const id = setInterval(() => {
      i = (i + 1) % o.texts.length; const nx = mk(o.texts[i]); nx.style.cssText += ';position:absolute;left:0;top:0;transform:translateY(100%);opacity:0'; el.append(nx);
      el.style.width = nx.scrollWidth + 'px'; requestAnimationFrame(() => requestAnimationFrame(() => { cur.style.transform = 'translateY(-100%)'; cur.style.opacity = 0; nx.style.transform = 'none'; nx.style.opacity = 1; }));
      const old = cur; cur = nx; setTimeout(() => { old.remove(); nx.style.position = 'static'; el.style.width = ''; }, o.dur + 40);
    }, o.every);
    return () => clearInterval(id);
  });

  // Words go from dim+blurred to sharp as they scroll through the viewport
  register('scroll-reveal', (el) => {
    const o = U.opts(el, { base: .12, blur: 6 }); const { words } = U.split(el, 'words');
    const upd = () => {
      const r = el.getBoundingClientRect(), vh = innerHeight; const p = U.clamp((vh * .85 - r.top) / (r.height + vh * .45), 0, 1);
      words.forEach((w, i) => { const k = U.clamp(p * words.length * 1.15 - i, 0, 1); w.style.opacity = o.base + (1 - o.base) * k; w.style.filter = k >= 1 ? 'none' : `blur(${(1 - k) * o.blur}px)`; });
    };
    if (U.RM) return words.forEach(w => w.style.opacity = 1);
    addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
    return () => removeEventListener('scroll', upd);
  });

  // Big letters float up with a stagger tied to scroll
  register('scroll-float', (el) => {
    const o = U.opts(el, { stagger: .035 }); const { chars } = U.split(el); if (U.RM) return;
    const upd = () => {
      const r = el.getBoundingClientRect(), p = U.clamp((innerHeight * .95 - r.top) / (innerHeight * .6), 0, 1);
      chars.forEach((c, i) => { const k = U.clamp(p * (1 + chars.length * o.stagger) - i * o.stagger, 0, 1), e = 1 - Math.pow(1 - k, 3); c.style.opacity = e; c.style.transform = `translateY(${(1 - e) * 120}%) scaleY(${2.3 - 1.3 * e}) scaleX(${.7 + .3 * e})`; c.style.transformOrigin = '50% 0'; });
    };
    el.style.overflow = 'hidden'; addEventListener('scroll', upd, { passive: true }); upd();
    return () => removeEventListener('scroll', upd);
  });

  // Focus box hops between words. data-opts: {"auto":true,"every":1400}
  register('true-focus', (el) => {
    const o = U.opts(el, { every: 1400, blur: 5, auto: true });
    const { words } = U.split(el, 'words'); el.style.position = 'relative'; el.style.display = el.style.display || 'inline-block';
    const box = document.createElement('div'); box.className = 'fx-focus-box'; box.innerHTML = '<i></i><i></i><i></i><i></i>'; el.append(box);
    let cur = 0;
    const show = i => { cur = i; words.forEach((w, k) => { w.style.transition = 'filter .45s'; w.style.filter = k === i ? 'none' : `blur(${o.blur}px)`; }); const a = words[i], p = el.getBoundingClientRect(), r = a.getBoundingClientRect(); Object.assign(box.style, { opacity: 1, left: r.left - p.left + 'px', top: r.top - p.top + 'px', width: r.width + 'px', height: r.height + 'px' }); };
    const rm = () => { words.forEach(w => w.style.filter = 'none'); box.style.opacity = 0; };
    words.forEach((w, i) => { w.addEventListener('pointerenter', () => { clearInterval(id); show(i); }); });
    let id = 0; if (o.auto && !U.RM) { show(0); id = setInterval(() => show((cur + 1) % words.length), o.every); }
    el.addEventListener('pointerleave', () => { if (o.auto && !U.RM) { clearInterval(id); id = setInterval(() => show((cur + 1) % words.length), o.every); } else rm(); });
    return () => clearInterval(id);
  });

  // Variable-font weight/width follows the cursor distance per character. Use a variable font (e.g. Inter, Roboto Flex, Bricolage Grotesque).
  register('text-pressure', (el) => {
    const o = U.opts(el, { radius: 160, minW: 300, maxW: 900, axis: 'wght' });
    const { chars } = U.split(el); el.style.cursor = 'default'; if (U.RM || !U.fine) return;
    const m = { x: -999, y: -999 }; const mv = e => { m.x = e.clientX; m.y = e.clientY; }; addEventListener('pointermove', mv);
    const stop = U.loop(el, () => chars.forEach(c => { const r = c.getBoundingClientRect(), d = Math.hypot(m.x - (r.left + r.width / 2), m.y - (r.top + r.height / 2)); const k = Math.max(0, 1 - d / o.radius); c.style.fontVariationSettings = `'${o.axis}' ${Math.round(o.minW + (o.maxW - o.minW) * k * k)}`; }));
    return () => { stop(); removeEventListener('pointermove', mv); };
  });

  // Text rides a looping curve (SVG textPath marquee). Drag or scroll nudges speed.
  register('curved-loop', (el) => {
    const o = U.opts(el, { speed: 60, curve: 90, text: el.textContent.trim() + ' ✦ ', size: 64 });
    const NS = 'http://www.w3.org/2000/svg', id = 'fxp' + Math.random().toString(36).slice(2, 7);
    el.textContent = ''; el.setAttribute('aria-label', o.text);
    const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', `0 0 1440 ${o.curve + o.size * 1.5}`); svg.style.cssText = 'width:100%;display:block;overflow:visible;font:inherit'; svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = `<path id="${id}" fill="none" d="M-100 ${o.size} Q720 ${o.size + o.curve} 1540 ${o.size}"/><text font-size="${o.size}" font-weight="700" fill="currentColor"><textPath href="#${id}" id="${id}t" startOffset="0"></textPath></text>`;
    el.append(svg); const tp = svg.querySelector('textPath'); tp.textContent = o.text.repeat(8);
    let off = 0, dir = -1, vel = 0, w = 0; requestAnimationFrame(() => w = tp.getComputedTextLength() / 8 || 400);
    const stop = U.loop(el, (t, dt) => { w = w || 400; off += (dir * o.speed + vel) * dt; vel *= .94; if (off < -w) off += w; if (off > 0) off -= w; tp.setAttribute('startOffset', off); });
    let px = null; svg.addEventListener('pointerdown', e => { px = e.clientX; svg.setPointerCapture(e.pointerId); });
    svg.addEventListener('pointermove', e => { if (px == null) return; vel = (e.clientX - px) * 20; dir = Math.sign(e.clientX - px) || dir; px = e.clientX; });
    svg.addEventListener('pointerup', () => px = null); svg.style.cursor = 'grab'; svg.style.touchAction = 'pan-y';
    return stop;
  });

  // Infinite text marquee whose speed + direction react to scroll velocity
  register('scroll-velocity', (el) => {
    const o = U.opts(el, { speed: 60, texts: [el.textContent.trim()], gap: '2rem', sep: '•' });
    el.textContent = ''; el.classList.add('fx-marq'); el.setAttribute('aria-label', o.texts.join(' '));
    const track = document.createElement('div'); el.append(track);
    const item = () => { const s = document.createElement('span'); s.style.cssText = `padding-right:${o.gap};white-space:pre`; s.setAttribute('aria-hidden', 'true'); s.textContent = o.texts.join(` ${o.sep} `) + ` ${o.sep}`; return s; };
    track.append(item()); const first = track.firstChild; const need = () => Math.ceil(el.offsetWidth / (first.offsetWidth || 1)) + 2; for (let i = 0; i < need(); i++) track.append(item());
    let x = 0, dir = 1, last = scrollY, v = 0, w = first.offsetWidth || 500;
    const stop = U.loop(el, (t, dt) => { const dy = scrollY - last; last = scrollY; v = U.lerp(v, dy / Math.max(dt, .016), .1); if (Math.abs(v) > 2) dir = Math.sign(v); const mult = 1 + Math.min(Math.abs(v) / 400, 6); x -= dir * o.speed * mult * dt; w = first.offsetWidth || w; if (x <= -w) x += w; if (x > 0) x -= w; track.style.transform = `translateX(${x}px)`; });
    return stop;
  });

  // Text laid out on a circle that spins
  register('circular-text', (el) => {
    const o = U.opts(el, { dur: 14, hoverSpeed: 3, size: 160 }); const txt = (el.textContent.trim() + ' ').repeat(1); el.textContent = ''; el.setAttribute('aria-label', txt.trim());
    el.style.cssText += `;position:relative;width:${o.size}px;height:${o.size}px;display:inline-block;animation:fx-spin ${o.dur}s linear infinite;border-radius:50%`;
    if (!document.getElementById('fx-spin')) { const s = document.createElement('style'); s.id = 'fx-spin'; s.textContent = '@keyframes fx-spin{to{transform:rotate(360deg)}}'; document.head.append(s); }
    [...txt].forEach((c, i, a) => { const s = document.createElement('span'); s.textContent = c; s.setAttribute('aria-hidden', 'true'); s.style.cssText = `position:absolute;left:50%;top:0;height:${o.size / 2}px;transform-origin:0 100%;transform:translateX(-50%) rotate(${i * 360 / a.length}deg);white-space:pre`; el.append(s); });
    el.addEventListener('pointerenter', () => el.style.animationDuration = o.dur / o.hoverSpeed + 's'); el.addEventListener('pointerleave', () => el.style.animationDuration = o.dur + 's');
  });

  // Letters spin through a reel of random letters and land in order
  register('shuffle-text', (el) => {
    const o = U.opts(el, { dur: 800, stagger: 50, rounds: 3 }); const { chars } = U.split(el); const reels = [];
    chars.forEach(c => {
      const ch = c.textContent, seq = []; for (let k = 0; k < o.rounds; k++) seq.push(String.fromCharCode(97 + Math.floor(Math.random() * 26)));
      seq.push(ch); c.style.cssText += ';overflow:hidden;vertical-align:top;height:1.15em;line-height:1.15;position:relative';
      const col = document.createElement('span'); col.style.cssText = 'display:block;will-change:transform';
      col.innerHTML = seq.map(t => `<span style="display:block;height:1.15em">${t}</span>`).join(''); c.textContent = ''; c.append(col); reels.push([col, seq.length - 1]);
    });
    U.inview(el, () => reels.forEach(([col, n], i) => { col.style.transition = `transform ${o.dur}ms cubic-bezier(.2,.8,.2,1) ${i * o.stagger}ms`; requestAnimationFrame(() => col.style.transform = `translateY(-${n * 1.15}em)`); }));
  });

  // Each word falls and stacks at the bottom with gravity (simple physics, no engine)
  register('falling-text', (el) => {
    const o = U.opts(el, { gravity: 1400, bounce: .35, trigger: 'view' });
    const { words } = U.split(el, 'words'); const H = () => el.getBoundingClientRect().height;
    el.style.position = 'relative'; el.style.overflow = 'hidden'; el.style.minHeight = el.offsetHeight + 'px';
    const st = words.map(w => ({ w, y: 0, vy: 0, x: 0, vx: U.rand(-60, 60), rot: 0, vr: U.rand(-90, 90), floor: 0, done: false }));
    let go = false; const start = () => { if (go) return; go = true; const base = el.getBoundingClientRect(); st.forEach(s => { const r = s.w.getBoundingClientRect(); s.floor = base.height - (r.top - base.top) - r.height; s.w.style.willChange = 'transform'; s.vy = U.rand(0, 100); }); };
    if (o.trigger === 'click') el.addEventListener('click', start); else U.inview(el, () => setTimeout(start, 400));
    return U.loop(el, (t, dt) => { if (!go) return; st.forEach((s, i) => { if (s.done) return; s.vy += o.gravity * dt; s.y += s.vy * dt; s.x += s.vx * dt; s.rot += s.vr * dt; const f = s.floor - (i % 3) * 4; if (s.y >= f) { s.y = f; s.vy *= -o.bounce; s.vx *= .8; s.vr *= .7; if (Math.abs(s.vy) < 40) { s.vy = 0; s.vx = 0; s.vr = 0; } } s.w.style.transform = `translate(${s.x}px,${s.y}px) rotate(${s.rot}deg)`; }); });
  });
})();

/* ===================== MORE TEXT ===================== */
(function () {
  const { register, util: U } = FX;
  const css = document.createElement('style'); css.id = 'fx-text2-css';
  css.textContent = `
.fx-echo{position:relative;display:inline-block}.fx-echo>i{position:absolute;left:0;top:0;font-style:normal;pointer-events:none;white-space:nowrap}
.fx-depth{position:relative;display:inline-block;transform-style:preserve-3d}.fx-depth>i{position:absolute;left:0;top:0;font-style:normal;pointer-events:none;white-space:nowrap}
.fx-fold{display:inline-block;perspective:600px}.fx-fold .fx-c{transform-origin:50% 0;backface-visibility:hidden}
.fx-flap{display:inline-flex;gap:.08em}.fx-flap .cell{position:relative;display:inline-block;width:.68em;height:1.18em;line-height:1.18em;text-align:center;background:var(--fx-flap,#16161f);border-radius:.1em;overflow:hidden;font-variant-numeric:tabular-nums;box-shadow:0 .06em .14em rgba(0,0,0,.4)}.fx-flap .cell::after{content:'';position:absolute;left:0;right:0;top:50%;height:1px;background:rgba(0,0,0,.55)}
.fx-mh{display:inline-block;position:relative}.fx-mh .m{position:absolute;inset:0;background:var(--fx-mh,currentColor);clip-path:inset(0 100% 0 0);mix-blend-mode:difference}
.fx-tech{position:relative;display:inline-block;padding:.15em .5em;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.08em;text-transform:uppercase}.fx-tech::before,.fx-tech::after{content:'';position:absolute;width:.6em;height:.6em;border:solid currentColor;opacity:.8;transition:all .35s}.fx-tech::before{left:0;top:0;border-width:2px 0 0 2px}.fx-tech::after{right:0;bottom:0;border-width:0 2px 2px 0}.fx-tech:hover::before,.fx-tech:hover::after{width:100%;height:100%}
.fx-tcur{position:relative;display:inline-block}
.fx-vp .fx-c{transition:font-variation-settings .12s,transform .12s}
`;
  document.head.append(css);

  // Variable-proximity: any variable axis follows cursor distance (alias of text-pressure with width option)
  register('variable-proximity', el => { el.dataset.opts = JSON.stringify(Object.assign({ axis: 'wght', minW: 200, maxW: 900, radius: 140 }, U.opts(el, {}))); return FX.run('text-pressure', el); });

  // Shadow copies fan out behind the text on hover — layered echo
  register('echo-text', el => { const o = U.opts(el, { n: 5, dx: 6, dy: 6, color: 'currentColor' }); const t = el.textContent; el.classList.add('fx-echo'); const wrap = document.createElement('span'); wrap.textContent = t; wrap.style.position = 'relative'; el.setAttribute('aria-label', t); el.textContent = ''; el.append(wrap); const ghosts = []; for (let i = o.n; i >= 1; i--) { const g = document.createElement('i'); g.textContent = t; g.setAttribute('aria-hidden', 'true'); g.style.cssText = `opacity:${.5 - i * .07};color:${o.color};transition:transform .5s cubic-bezier(.2,.8,.2,1) ${i * 25}ms`; g.style.webkitTextStroke = '1px currentColor'; g.style.color = 'transparent'; el.prepend(g); ghosts.push([g, i]); }
    const go = on => ghosts.forEach(([g, i]) => g.style.transform = on ? `translate(${i * o.dx}px,${i * o.dy}px)` : 'none'); el.addEventListener('pointerenter', () => go(true)); el.addEventListener('pointerleave', () => go(false)); U.inview(el, () => { go(true); setTimeout(() => go(false), 900); }); });

  // Extruded 3D look: stacked layers shift with the pointer to fake depth
  register('depth-text', el => { const o = U.opts(el, { layers: 9, step: 1.2, color: 'rgba(0,0,0,.35)' }); const t = el.textContent; el.classList.add('fx-depth'); el.setAttribute('aria-label', t); const top = document.createElement('span'); top.textContent = t; top.style.cssText = 'position:relative;z-index:2'; el.textContent = ''; const L = []; for (let i = o.layers; i >= 1; i--) { const g = document.createElement('i'); g.textContent = t; g.setAttribute('aria-hidden', 'true'); g.style.color = o.color; g.style.zIndex = 1; el.append(g); L.push([g, i]); } el.append(top); let tx = 0, ty = 1, x = 0, y = 1; const mv = e => { const l = U.local(el, e); tx = (l.nx - .5) * -2; ty = (l.ny - .5) * -2 || .01; }; el.addEventListener('pointermove', mv); el.addEventListener('pointerleave', () => { tx = 0; ty = 1; });
    return U.loop(el, () => { x = U.lerp(x, tx, .12); y = U.lerp(y, ty, .12); L.forEach(([g, i]) => g.style.transform = `translate(${x * i * o.step * 2}px,${y * i * o.step * 2}px)`); }); });

  // Chars fold in from the top like paper on view
  register('fold-text', el => { const o = U.opts(el, { delay: 40, dur: 800 }); const { chars } = U.split(el); el.classList.add('fx-fold'); chars.forEach((c, i) => { c.style.transform = 'rotateX(-100deg)'; c.style.opacity = 0; c.style.transition = `transform ${o.dur}ms cubic-bezier(.2,.9,.2,1) ${i * o.delay}ms,opacity ${o.dur / 2}ms ${i * o.delay}ms`; }); U.inview(el, () => requestAnimationFrame(() => chars.forEach(c => { c.style.transform = 'none'; c.style.opacity = 1; }))); });

  // Text jitters with tiny per-char noise ("fuzzy"). Hover for more
  register('fuzzy-text', el => { const o = U.opts(el, { base: 1.2, hover: 4 }); const { chars } = U.split(el); let amp = o.base; el.addEventListener('pointerenter', () => amp = o.hover); el.addEventListener('pointerleave', () => amp = o.base); if (U.RM) return; return U.loop(el, () => chars.forEach(c => { c.style.transform = `translate(${(Math.random() - .5) * amp}px,${(Math.random() - .5) * amp}px)`; c.style.filter = amp > 2 ? `blur(${Math.random() * .8}px)` : ''; })); });

  // Departure-board flap characters flip to the target text. data-opts {"texts":["BERLIN","TOKYO"],"every":3000}
  register('split-flap-text', el => { const o = U.opts(el, { texts: [el.textContent.trim().toUpperCase()], every: 3200, chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ', speed: 38 }); el.classList.add('fx-flap'); el.setAttribute('aria-label', o.texts.join(', ')); const len = Math.max(...o.texts.map(t => t.length)); el.textContent = ''; const cells = []; for (let i = 0; i < len; i++) { const c = document.createElement('span'); c.className = 'cell'; c.setAttribute('aria-hidden', 'true'); c.textContent = ' '; el.append(c); cells.push(c); }
    let cur = ' '.repeat(len), idx = 0, timers = [];
    const show = txt => { const t = txt.padEnd(len, ' '); timers.forEach(clearInterval); timers = cells.map((c, i) => { let pos = o.chars.indexOf(c.textContent); if (pos < 0) pos = 0; const target = o.chars.indexOf(t[i]); if (c.textContent === t[i]) return 0; const id = setInterval(() => { pos = (pos + 1) % o.chars.length; c.textContent = o.chars[pos]; if (pos === target) clearInterval(id); }, o.speed + i * 6); return id; }); }; U.inview(el, () => { show(o.texts[0]); if (o.texts.length > 1 && !U.RM) setInterval(() => show(o.texts[idx = (idx + 1) % o.texts.length]), o.every); }); });

  // Heading with a colour-inverting wipe that follows the cursor across it
  register('masked-heading', el => { const o = U.opts(el, { color: '#fff' }); el.classList.add('fx-mh'); const m = document.createElement('span'); m.className = 'm'; m.textContent = el.textContent; m.setAttribute('aria-hidden', 'true'); m.style.setProperty('--fx-mh', o.color); el.append(m); el.addEventListener('pointermove', e => { const l = U.local(el, e); m.style.clipPath = `circle(${Math.max(40, l.h * .9)}px at ${l.x}px ${l.y}px)`; }); el.addEventListener('pointerleave', () => m.style.clipPath = 'inset(0 100% 0 0)'); });

  // Tech label: HUD brackets that expand on hover, with scramble on view
  register('tech-text', el => { el.classList.add('fx-tech'); FX.run('scramble-text', el); });

  // Blinking caret that follows the pointer across the element like a text cursor
  register('text-cursor', el => { if (!U.fine || U.RM) return; const o = U.opts(el, { color: 'currentColor' }); el.classList.add('fx-tcur'); const c = document.createElement('i'); c.setAttribute('aria-hidden', 'true'); c.style.cssText = `position:absolute;width:2px;height:1.1em;background:${o.color};pointer-events:none;opacity:0;transition:left .12s,top .12s,opacity .2s;animation:fx-blink 1s steps(1) infinite`; el.append(c); el.style.cursor = 'text'; el.addEventListener('pointermove', e => { const l = U.local(el, e); c.style.left = l.x + 'px'; c.style.top = l.y - 12 + 'px'; c.style.opacity = 1; }); el.addEventListener('pointerleave', () => c.style.opacity = 0); });

  // Sentences cycle with a vertical roll (same engine as rotating-text; data-opts {"texts":[...]})
  register('text-loop', el => FX.run('rotating-text', el));

  // Text warps with a wave (sin displacement per char) that speeds up on hover
  register('warp-text', el => { const o = U.opts(el, { amp: 10, speed: 2.2 }); const { chars } = U.split(el); let k = 1, tk = 1; el.addEventListener('pointerenter', () => tk = 2.4); el.addEventListener('pointerleave', () => tk = 1); if (U.RM) return; return U.loop(el, (t) => { k = U.lerp(k, tk, .08); chars.forEach((c, i) => { const w = Math.sin(t * o.speed * k + i * .55); c.style.transform = `translateY(${w * o.amp * k * .5}px) skewX(${w * 6 * k}deg) scaleY(${1 + w * .08 * k})`; }); }); });

  // Letters assemble from scattered particles on a canvas (reads the element's text, then draws dots that fly into place and scatter from the cursor)
  register('particle-text', el => { const o = U.opts(el, { gap: 3, color: '#fff', size: 1.6, repel: 70, font: '800 140px system-ui,sans-serif' }); const txt = el.textContent.trim(); el.setAttribute('aria-label', txt); el.textContent = ''; el.style.minHeight = el.style.minHeight || '200px'; const { ctx, size } = U.canvasIn(el); const m = { x: -999, y: -999 }; el.addEventListener('pointermove', e => { const l = U.local(el, e); m.x = l.x; m.y = l.y; }); el.addEventListener('pointerleave', () => m.x = m.y = -999); let P = [];
    const build = () => { const W = Math.floor(size.w), H = Math.floor(size.h), off = document.createElement('canvas'), ox = off.getContext('2d', { willReadFrequently: true }); off.width = W; off.height = H; let fs = parseInt(o.font.match(/(\d+)px/)[1]); ox.font = o.font; while (ox.measureText(txt).width > W * .9 && fs > 20) { fs -= 6; ox.font = o.font.replace(/\d+px/, fs + 'px'); } ox.textAlign = 'center'; ox.textBaseline = 'middle'; ox.fillText(txt, W / 2, H / 2); const d = ox.getImageData(0, 0, W, H).data; const t = []; for (let y = 0; y < H; y += o.gap) for (let x = 0; x < W; x += o.gap) if (d[(y * W + x) * 4 + 3] > 128) t.push([x, y]); P = t.map(([x, y]) => ({ hx: x, hy: y, x: U.rand(0, W), y: U.rand(0, H), vx: 0, vy: 0 })); }; document.fonts.ready.then(build); new ResizeObserver(build).observe(el);
    return U.loop(el, () => { const d = size.dpr; ctx.setTransform(d, 0, 0, d, 0, 0); ctx.clearRect(0, 0, size.w, size.h); ctx.fillStyle = o.color; P.forEach(p => { const dx = p.x - m.x, dy = p.y - m.y, dd = Math.hypot(dx, dy); if (dd < o.repel) { p.vx += dx / dd * 2.2; p.vy += dy / dd * 2.2; } p.vx += (p.hx - p.x) * .05; p.vy += (p.hy - p.y) * .05; p.vx *= .84; p.vy *= .84; p.x += p.vx; p.y += p.vy; ctx.fillRect(p.x, p.y, o.size, o.size); }); }); });

  // Text rendered as ASCII art of itself (canvas). Hover the area to ripple the characters.
  register('ascii-text', el => { const o = U.opts(el, { ramp: ' .:-=+*#%@', cell: 9, color: '#a7f3d0', font: '900 160px system-ui,sans-serif' }); const txt = el.textContent.trim(); el.setAttribute('aria-label', txt); el.style.minHeight = el.style.minHeight || '220px'; const { ctx, size } = U.canvasIn(el); let g = null, cols = 0, rows = 0; const m = { x: -999, y: -999 }; el.addEventListener('pointermove', e => { const l = U.local(el, e); m.x = l.x; m.y = l.y; }); el.addEventListener('pointerleave', () => m.x = m.y = -999); el.textContent = ''; el.append(ctx.canvas);
    const build = () => { cols = Math.ceil(size.w / (o.cell * .6)); rows = Math.ceil(size.h / o.cell); const off = document.createElement('canvas'); off.width = cols; off.height = rows; const ox = off.getContext('2d'); let fs = rows * .9; ox.font = o.font.replace(/\d+px/, fs + 'px'); while (ox.measureText(txt).width > cols * .92 && fs > 6) { fs -= 2; ox.font = o.font.replace(/\d+px/, fs + 'px'); } ox.textAlign = 'center'; ox.textBaseline = 'middle'; ox.fillText(txt, cols / 2, rows / 2 + fs * .04); const d = ox.getImageData(0, 0, cols, rows).data; g = new Float32Array(cols * rows); for (let i = 0; i < g.length; i++) g[i] = d[i * 4 + 3] / 255; }; document.fonts.ready.then(build); new ResizeObserver(build).observe(el);
    return U.loop(el, (t) => { if (!g) return; const d = size.dpr; ctx.setTransform(d, 0, 0, d, 0, 0); ctx.clearRect(0, 0, size.w, size.h); ctx.font = `${o.cell}px ui-monospace,monospace`; ctx.textBaseline = 'top'; ctx.fillStyle = o.color; const cw = o.cell * .6; for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) { let v = g[y * cols + x]; const md = Math.hypot(x * cw - m.x, y * o.cell - m.y); const wob = md < 120 ? Math.sin(t * 8 - md * .08) * .5 * (1 - md / 120) : 0; v = Math.max(0, Math.min(1, v + wob * (v > .1 ? 1 : .4))); if (v < .06) continue; ctx.globalAlpha = .45 + v * .55; ctx.fillText(o.ramp[Math.min(o.ramp.length - 1, v * o.ramp.length | 0)], x * cw, y * o.cell); } }); });
})();

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

/* ===================== BACKGROUNDS =====================
   Put data-fx="bg-aurora" on any positioned container; the canvas sits behind its content (z-index auto, content needs position:relative or z-index:1).
   Colours: data-opts='{"colors":["#7cf","#a5f","#4ade80"],"speed":1}' */
(function () {
  const { register, util: U } = FX; const N = U.NOISE_GLSL;
  const sh = (name, frag, d = {}) => register(name, el => { const o = U.opts(el, Object.assign({ colors: ['#5eead4', '#818cf8', '#f472b6'], speed: 1, scale: 1, mouse: false }, d)); return U.shaderBg(el, frag, o); });

  sh('bg-aurora', N + `void main(){vec2 uv=gl_FragCoord.xy/uRes;float t=uTime*.18;float asp=uRes.x/uRes.y;vec3 acc=vec3(0.);
    for(float i=0.;i<3.;i++){float x=uv.x*asp*(1.2+i*.5)*uS+i*3.7;float wave=fbm(vec2(x*.8+t*(.6+i*.2),i*5.+t*.3));
      float top=.82-i*.12+(wave-.5)*.45;float ray=.55+.45*fbm(vec2(x*7.,t*.5+i));float d=top-uv.y;
      float curtain=smoothstep(-.02,.0,d)*exp(-max(d,0.)*(2.6+i))*ray;vec3 col=i<1.?uA:(i<2.?uB:uC);acc+=col*curtain*(.9-i*.15);}
    float a=clamp(max(acc.r,max(acc.g,acc.b)),0.,1.);gl_FragColor=vec4(acc,a);}`);

  sh('bg-plasma', `void main(){vec2 p=(gl_FragCoord.xy*2.-uRes)/min(uRes.x,uRes.y)*uS;float t=uTime*.5;
    float v=sin(p.x*3.+t)+sin(p.y*3.-t*1.3)+sin((p.x+p.y)*2.+t*.7)+sin(length(p)*4.-t*1.6);v*=.25;
    vec3 c=mix(uA,uB,.5+.5*sin(v*6.28));c=mix(c,uC,.5+.5*cos(v*9.4+1.));gl_FragColor=vec4(c*.9,1.);}`);

  sh('bg-iridescence', `void main(){vec2 uv=gl_FragCoord.xy/uRes;float t=uTime*.4;vec2 p=uv*uS*3.-1.5;
    for(float i=1.;i<6.;i++){p.x+=.6/i*cos(i*2.5*p.y+t);p.y+=.6/i*cos(i*1.5*p.x+t);}
    float m=length(p)*.35;vec3 c=.5+.5*cos(6.28*(m+vec3(0.,.33,.67))+t)*vec3(uA.r,uB.g,uC.b);gl_FragColor=vec4(c,1.);}`, { colors: ['#ffffff', '#ffffff', '#ffffff'] });

  sh('bg-silk', N + `void main(){vec2 uv=gl_FragCoord.xy/uRes;uv.x*=uRes.x/uRes.y;float t=uTime*.18;
    vec2 q=vec2(fbm(uv*1.5*uS+t),fbm(uv*1.5*uS+5.2-t));float f=fbm(uv*2.*uS+3.*q+t);
    float s=sin((uv.x+uv.y)*8.+f*9.+t*3.)*.5+.5;vec3 c=mix(uA,uB,s);c=mix(c,uC,smoothstep(.5,1.,f)*.5);c*=.35+.9*f;gl_FragColor=vec4(c,1.);}`, { colors: ['#1e1b4b', '#c4b5fd', '#f0abfc'] });

  sh('bg-waves', N + `void main(){vec2 uv=gl_FragCoord.xy/uRes;float t=uTime*.4;float acc=0.;
    for(float i=0.;i<14.;i++){float y=.1+i*.065;float w=sin(uv.x*(3.+i*.35)*uS+t*(.5+i*.07)+i)*.045+sin(uv.x*7.+t*.9+i*2.)*.015;
      acc+=smoothstep(.0045,.0,abs(uv.y-y-w))*(.35+.65*i/14.);}
    vec3 c=mix(uA,uB,uv.x);c=mix(c,uC,uv.y*.6);gl_FragColor=vec4(c*acc,acc);}`, { colors: ['#38bdf8', '#a78bfa', '#f472b6'] });

  sh('bg-light-rays', N + `void main(){vec2 uv=gl_FragCoord.xy/uRes;vec2 src=vec2(.5+(uMouse.x-.5)*.4,1.12);vec2 d=uv-src;float ang=atan(d.x,-d.y);float r=length(d);
    float rays=0.;rays+=pow(.5+.5*sin(ang*22.*uS+uTime*.6),3.);rays+=.6*pow(.5+.5*sin(ang*9.-uTime*.4+2.),2.);
    rays*=smoothstep(1.4,0.,r)*(.6+.4*fbm(vec2(ang*4.,uTime*.2)));vec3 c=mix(uA,uB,r)*rays;gl_FragColor=vec4(c*.8,rays*.8);}`, { colors: ['#fde68a', '#7dd3fc'], mouse: true });

  sh('bg-ripple-grid', `void main(){vec2 uv=gl_FragCoord.xy/uRes;float asp=uRes.x/uRes.y;vec2 p=(uv-.5)*vec2(asp,1.);vec2 m=(uMouse-.5)*vec2(asp,1.);
    vec2 dv=p-m;float d=length(dv);float rip=sin(d*30.-uTime*3.)*exp(-d*3.2)*.018;vec2 g=(p+dv/(d+1e-3)*rip)*12.*uS;
    vec2 f=abs(fract(g)-.5);float line=smoothstep(.455,.5,max(f.x,f.y));float a=line*(.2+.8*exp(-d*2.2));
    vec3 c=mix(uA,uB,uv.x);gl_FragColor=vec4(c*a,a);}`, { colors: ['#60a5fa', '#c084fc'], mouse: true });

  sh('bg-galaxy', N + `void main(){vec2 uv=(gl_FragCoord.xy-.5*uRes)/uRes.y;float t=uTime*.05;float a=atan(uv.y,uv.x),r=length(uv);
    float spiral=.5+.5*sin(a*2.-log(r+.02)*7.+t*8.);float disk=exp(-r*3.2)*(.35+.65*spiral);float core=exp(-r*14.);
    vec2 g=uv*60.*uS;vec2 id=floor(g);float star=step(.985,h21(id))*smoothstep(.5,.0,length(fract(g)-.5))*(.6+.4*sin(uTime*2.+h21(id+3.)*30.));
    float dust=fbm(uv*5.+t)*disk;vec3 c=mix(uA,uB,r*2.)*dust*1.6+uC*core*1.5+vec3(star);gl_FragColor=vec4(c,1.);}`, { colors: ['#7c3aed', '#38bdf8', '#fff7ed'] });

  sh('bg-liquid-chrome', `void main(){vec2 uv=gl_FragCoord.xy/uRes;vec2 p=uv*2.-1.;p.x*=uRes.x/uRes.y;float t=uTime*.35;
    for(float i=1.;i<8.;i++){p+=vec2(.7/i*sin(i*p.y*1.6*uS+t+.3*i),.7/i*sin(i*p.x*1.6*uS+t+.3*i+1.6));}
    float v=.5+.5*sin(p.x*1.3+p.y*.7+sin(p.y*1.7));float s=smoothstep(.15,.95,v);vec3 c=mix(uA*.12,uB,s)+uC*pow(.5+.5*sin(p.x*2.2-p.y),10.)*.5;gl_FragColor=vec4(c,1.);}`, { colors: ['#e5e7eb', '#9ca3af', '#ffffff'], mouse: false });

  sh('bg-orb', N + `void main(){vec2 uv=(gl_FragCoord.xy-.5*uRes)/min(uRes.x,uRes.y);float r=length(uv)*2./uS;float t=uTime*.4;
    float n=fbm(uv*3.+t)*.6;float edge=smoothstep(.62+n*.12,.5,r);float rim=smoothstep(.5,.62,r)*smoothstep(.85,.62,r+n*.2);
    vec3 c=mix(uA,uB,.5+.5*sin(r*5.-t*2.+n*6.));c=mix(c,uC,pow(1.-r,3.));gl_FragColor=vec4(c*(edge*1.1+rim*.8),(edge+rim)*.95);}`, { colors: ['#7c3aed', '#22d3ee', '#fff'], scale: 1 });

  // ---------- Canvas 2D backgrounds ----------
  // Particles: drifting dots with mouse repulsion + link lines
  register('bg-particles', el => {
    const o = U.opts(el, { count: 90, color: '#9ca3af', size: 1.6, link: 110, speed: .25, repel: 110 });
    const { c, ctx, size } = U.canvasIn(el); const P = []; let m = { x: -999, y: -999 };
    const seed = () => { P.length = 0; const n = Math.round(o.count * Math.min(1, size.w * size.h / 1e6 + .35)); for (let i = 0; i < n; i++) P.push({ x: U.rand(0, size.w), y: U.rand(0, size.h), vx: U.rand(-1, 1) * o.speed, vy: U.rand(-1, 1) * o.speed, r: U.rand(.5, 1) * o.size }); }; seed(); new ResizeObserver(seed).observe(el);
    el.addEventListener('pointermove', e => { const l = U.local(el, e); m = { x: l.x, y: l.y }; }); el.addEventListener('pointerleave', () => m = { x: -999, y: -999 });
    const draw = () => { const d = size.dpr; ctx.setTransform(d, 0, 0, d, 0, 0); ctx.clearRect(0, 0, size.w, size.h); ctx.fillStyle = ctx.strokeStyle = o.color;
      for (let i = 0; i < P.length; i++) { const p = P[i]; p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > size.w) p.vx *= -1; if (p.y < 0 || p.y > size.h) p.vy *= -1;
        const dx = p.x - m.x, dy = p.y - m.y, dd = Math.hypot(dx, dy); if (dd < o.repel) { p.x += dx / dd * (o.repel - dd) * .04; p.y += dy / dd * (o.repel - dd) * .04; }
        ctx.globalAlpha = .9; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
        for (let j = i + 1; j < P.length; j++) { const q = P[j], l = Math.hypot(p.x - q.x, p.y - q.y); if (l < o.link) { ctx.globalAlpha = (1 - l / o.link) * .35; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); } } } };
    if (U.RM) return draw(); return U.loop(el, draw);
  });

  // Dot grid whose dots are pushed away by the cursor and spring back
  register('bg-dot-grid', el => {
    const o = U.opts(el, { gap: 28, size: 2, color: '#6b7280', active: '#a78bfa', radius: 140, push: 38 });
    const { ctx, size } = U.canvasIn(el); let dots = [], m = { x: -999, y: -999, vx: 0, vy: 0 };
    const build = () => { dots = []; for (let y = o.gap / 2; y < size.h; y += o.gap) for (let x = o.gap / 2; x < size.w; x += o.gap) dots.push({ x, y, ox: 0, oy: 0, vx: 0, vy: 0 }); }; build(); new ResizeObserver(build).observe(el);
    el.addEventListener('pointermove', e => { const l = U.local(el, e); m = { x: l.x, y: l.y }; }); el.addEventListener('pointerleave', () => m = { x: -999, y: -999 });
    const [r1, g1, b1] = U.hex(o.color).map(v => v * 255), [r2, g2, b2] = U.hex(o.active).map(v => v * 255);
    const draw = () => { const d = size.dpr; ctx.setTransform(d, 0, 0, d, 0, 0); ctx.clearRect(0, 0, size.w, size.h);
      for (const p of dots) { const dx = p.x - m.x, dy = p.y - m.y, dd = Math.hypot(dx, dy), k = Math.max(0, 1 - dd / o.radius);
        if (k > 0) { p.vx += dx / (dd + 1) * k * o.push * .06; p.vy += dy / (dd + 1) * k * o.push * .06; } p.vx += -p.ox * .08; p.vy += -p.oy * .08; p.vx *= .82; p.vy *= .82; p.ox += p.vx; p.oy += p.vy;
        const t = Math.min(1, k * 1.2 + Math.hypot(p.ox, p.oy) / o.push); ctx.fillStyle = `rgb(${r1 + (r2 - r1) * t | 0},${g1 + (g2 - g1) * t | 0},${b1 + (b2 - b1) * t | 0})`; ctx.beginPath(); ctx.arc(p.x + p.ox, p.y + p.oy, o.size * (1 + t * .8), 0, 6.283); ctx.fill(); } };
    if (U.RM) return draw(); return U.loop(el, draw);
  });

  // Matrix-ish grid of letters flickering between colours
  register('bg-letter-glitch', el => {
    const o = U.opts(el, { colors: ['#2b4539', '#61dca3', '#61b3dc'], font: 15, speed: 60, chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$&*()-_+=/[]{};:<>.,' });
    const { ctx, size } = U.canvasIn(el); let cells = [], cols = 0, rows = 0; const cw = o.font * .62, ch = o.font * 1.1;
    const build = () => { cols = Math.ceil(size.w / cw); rows = Math.ceil(size.h / ch); cells = Array.from({ length: cols * rows }, () => ({ c: o.chars[Math.random() * o.chars.length | 0], col: o.colors[Math.random() * 3 | 0] })); }; build(); new ResizeObserver(build).observe(el);
    let acc = 0; const draw = (t, dt) => { acc += dt * 1000; if (acc > o.speed) { acc = 0; for (let k = 0; k < cells.length * .04; k++) { const i = Math.random() * cells.length | 0; cells[i] = { c: o.chars[Math.random() * o.chars.length | 0], col: o.colors[Math.random() * 3 | 0] }; } }
      const d = size.dpr; ctx.setTransform(d, 0, 0, d, 0, 0); ctx.clearRect(0, 0, size.w, size.h); ctx.font = `${o.font}px ui-monospace,monospace`; ctx.textBaseline = 'top';
      cells.forEach((cl, i) => { ctx.fillStyle = cl.col; ctx.fillText(cl.c, (i % cols) * cw, ((i / cols) | 0) * ch); }); };
    if (U.RM) return draw(0, 1); return U.loop(el, draw);
  });

  // Warp-speed starfield flying towards the viewer; mouse steers the vanishing point
  register('bg-hyperspeed', el => {
    const o = U.opts(el, { count: 420, speed: .6, color: '#e0e7ff', trail: .12 });
    const { ctx, size } = U.canvasIn(el); const S = Array.from({ length: o.count }, () => ({ x: U.rand(-1, 1), y: U.rand(-1, 1), z: Math.random() })); let cx = .5, cy = .5, tx = .5, ty = .5;
    el.addEventListener('pointermove', e => { const l = U.local(el, e); tx = l.nx; ty = l.ny; });
    const draw = (t, dt) => { cx = U.lerp(cx, tx, .05); cy = U.lerp(cy, ty, .05); const d = size.dpr; ctx.setTransform(d, 0, 0, d, 0, 0); ctx.clearRect(0, 0, size.w, size.h); ctx.strokeStyle = o.color; ctx.lineCap = 'round';
      const sp = U.RM ? 0 : o.speed; for (const s of S) { const pz = s.z; s.z -= sp * dt; if (s.z <= .01) { s.x = U.rand(-1, 1); s.y = U.rand(-1, 1); s.z = 1; continue; }
        const k = 1 / s.z, x = size.w * cx + s.x * k * size.w * .25, y = size.h * cy + s.y * k * size.w * .25, k2 = 1 / (s.z + o.trail * Math.max(sp, .1)), px = size.w * cx + s.x * k2 * size.w * .25, py = size.h * cy + s.y * k2 * size.w * .25;
        ctx.globalAlpha = Math.min(1, (1 - s.z) * 1.4); ctx.lineWidth = Math.max(.5, (1 - s.z) * 2.2); ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(x, y); ctx.stroke(); } };
    if (U.RM) return draw(0, 0); return U.loop(el, draw);
  });

  // Lightning: jagged bolts that flash on a random timer
  register('bg-lightning', el => {
    const o = U.opts(el, { color: '#a5b4fc', every: 1800, width: 2 }); const { ctx, size } = U.canvasIn(el); let bolt = null, age = 9, next = 400;
    const make = () => { const pts = [[U.rand(.2, .8) * size.w, 0]]; let [x, y] = pts[0]; while (y < size.h) { x += U.rand(-40, 40); y += U.rand(14, 36); pts.push([x, y]); } const br = []; for (let i = 3; i < pts.length - 2; i += 2) if (Math.random() < .35) { const b = [pts[i]]; let [bx, by] = pts[i], dx = U.rand(-1, 1) * 30; for (let k = 0; k < 6; k++) { bx += dx + U.rand(-14, 14); by += U.rand(10, 26); b.push([bx, by]); } br.push(b); } return { pts, br }; };
    const path = p => { ctx.beginPath(); p.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); };
    return U.loop(el, (t, dt) => { const d = size.dpr; ctx.setTransform(d, 0, 0, d, 0, 0); ctx.clearRect(0, 0, size.w, size.h); next -= dt * 1000; if (next < 0) { bolt = make(); age = 0; next = o.every * U.rand(.4, 1.6); } age += dt;
      if (bolt && age < .35) { const a = age < .08 || (age > .14 && age < .18) ? 1 : .35 * (1 - age / .35); ctx.strokeStyle = o.color; ctx.shadowColor = o.color; ctx.shadowBlur = 18; ctx.globalAlpha = a; ctx.lineWidth = o.width; ctx.lineJoin = 'round'; path(bolt.pts); ctx.lineWidth = o.width * .6; bolt.br.forEach(path); ctx.shadowBlur = 0; ctx.globalAlpha = a * .08; ctx.fillStyle = o.color; ctx.fillRect(0, 0, size.w, size.h); } });
  });

  // Radar sweep
  register('bg-radar', el => {
    const o = U.opts(el, { color: '#34d399', rings: 5 }); const { ctx, size } = U.canvasIn(el); const blips = Array.from({ length: 7 }, () => ({ a: U.rand(0, 6.283), r: U.rand(.15, .95), s: -9 }));
    return U.loop(el, (t) => { const d = size.dpr; ctx.setTransform(d, 0, 0, d, 0, 0); ctx.clearRect(0, 0, size.w, size.h); const cx = size.w / 2, cy = size.h / 2, R = Math.hypot(cx, cy) * .75; ctx.strokeStyle = o.color; ctx.lineWidth = 1; ctx.globalAlpha = .25;
      for (let i = 1; i <= o.rings; i++) { ctx.beginPath(); ctx.arc(cx, cy, R * i / o.rings, 0, 6.283); ctx.stroke(); } ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy); ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R); ctx.stroke();
      const a = t * 1.4 % 6.283; const g = ctx.createConicGradient ? ctx.createConicGradient(a - 1.2, cx, cy) : null; if (g) { g.addColorStop(0, 'transparent'); g.addColorStop(.19, o.color); g.addColorStop(.1900001, 'transparent'); ctx.globalAlpha = .45; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.fill(); }
      blips.forEach(b => { const da = ((a - b.a) % 6.283 + 6.283) % 6.283; if (da < .06) b.s = t; const k = Math.max(0, 1 - (t - b.s) / 2.2); if (k > 0) { ctx.globalAlpha = k; ctx.fillStyle = o.color; ctx.beginPath(); ctx.arc(cx + Math.cos(b.a) * b.r * R, cy + Math.sin(b.a) * b.r * R, 4, 0, 6.283); ctx.fill(); } }); });
  });

  // Rising bokeh snow / embers. data-opts: {"color":"#fff","dir":"down"|"up"}
  register('bg-snow', el => {
    const o = U.opts(el, { count: 110, color: '#ffffff', dir: 'down', size: 2.4 }); const { ctx, size } = U.canvasIn(el); const S = Array.from({ length: o.count }, () => ({ x: Math.random(), y: Math.random(), r: U.rand(.4, 1), p: Math.random() * 9, v: U.rand(.4, 1) }));
    return U.loop(el, (t, dt) => { const d = size.dpr; ctx.setTransform(d, 0, 0, d, 0, 0); ctx.clearRect(0, 0, size.w, size.h); ctx.fillStyle = o.color; const sg = o.dir === 'up' ? -1 : 1;
      S.forEach(s => { s.y += sg * s.v * dt * .08; s.x += Math.sin(t * .7 + s.p) * dt * .02; if (s.y > 1.02) s.y = -.02; if (s.y < -.02) s.y = 1.02; ctx.globalAlpha = .25 + .6 * s.r; ctx.beginPath(); ctx.arc(s.x * size.w, s.y * size.h, s.r * o.size, 0, 6.283); ctx.fill(); }); });
  });
})();

/* ===================== MORE SHADER BACKGROUNDS ===================== */
(function () {
  const { register, util: U } = FX; const N = U.NOISE_GLSL;
  const sh = (name, frag, d = {}) => register(name, el => { const o = U.opts(el, Object.assign({ colors: ['#5eead4', '#818cf8', '#f472b6'], speed: 1, scale: 1, mouse: false }, d)); return U.shaderBg(el, frag, o); });
  const UV = 'vec2 uv=gl_FragCoord.xy/uRes;float asp=uRes.x/uRes.y;vec2 p=(uv-.5)*vec2(asp,1.);float T=uTime;';

  sh('bg-beams', N + `void main(){${UV}float a=0.;for(float i=0.;i<7.;i++){float x=(p.x+p.y*.45)*(2.+i*.4)*uS+i*1.9+T*.08*(1.+i*.2);float b=pow(.5+.5*sin(x*6.28),24.);a+=b*(.25+.75*vn(vec2(i,T*.3)))*smoothstep(-.5,.6,uv.y);}
    vec3 c=mix(uA,uB,uv.y)*a+uC*a*a*.4;gl_FragColor=vec4(c,clamp(a,0.,1.));}`, { colors: ['#38bdf8', '#a78bfa', '#ffffff'] });

  sh('bg-color-bends', `void main(){${UV}vec2 q=p*uS*2.;for(float i=1.;i<5.;i++){q+=vec2(sin(q.y*i+T*.5+i),cos(q.x*i-T*.4))/i*.8;}
    float v=.5+.5*sin(q.x*1.5+q.y);vec3 c=mix(uA,uB,smoothstep(.2,.6,v));c=mix(c,uC,smoothstep(.55,.95,.5+.5*cos(q.y*1.2-q.x)));gl_FragColor=vec4(c,1.);}`, { colors: ['#0ea5e9', '#f43f5e', '#facc15'] });

  sh('bg-dark-veil', N + `void main(){${UV}float n=fbm(p*2.*uS+vec2(T*.1,-T*.07));float m=fbm(p*3.+n*2.+T*.05);float v=smoothstep(.25,.75,m);
    vec3 c=mix(vec3(.02,.02,.04),uA,v*1.1)+uB*pow(v,3.)*.9;float vig=smoothstep(1.1,.2,length(p));gl_FragColor=vec4(c*vig,1.);}`, { colors: ['#4c1d95', '#22d3ee'] });

  sh('bg-dither', N + `float bayer(vec2 f){vec2 i=mod(floor(f),4.);float b=0.;
    b+=mod(i.x,2.)<1.?0.:2.;b+=mod(i.y,2.)<1.?0.:1.;b=mod(b*4.+ (mod(floor(i.x/2.),2.)<1.?0.:2.)*1.+(mod(floor(i.y/2.),2.)<1.?0.:1.)*3.,16.);return b/16.;}
    void main(){vec2 px=floor(gl_FragCoord.xy/(3.*uS));vec2 uv=px*3.*uS/uRes;float v=fbm(uv*vec2(uRes.x/uRes.y,1.)*3.+vec2(uTime*.12,0.))+.18*sin(uv.x*5.+uTime*.4);
    float d=bayer(px);float on=step(d,smoothstep(.2,.8,v));gl_FragColor=vec4(mix(uB*.08,uA,on),1.);}`, { colors: ['#a5b4fc', '#312e81'] });

  sh('bg-evil-eye', N + `void main(){vec2 q=(gl_FragCoord.xy-.5*uRes)/min(uRes.x,uRes.y);vec2 m=(uMouse-.5)*.12;float r=length(q-m*.6);float a=atan(q.y-m.y*.6,q.x-m.x*.6);
    float iris=smoothstep(.42,.38,length(q))*(.5+.5*fbm(vec2(a*3.,r*9.-T0()*0.)));float fib=pow(.5+.5*sin(a*40.+fbm(vec2(a*2.,r*5.))*6.),2.);
    float pupil=smoothstep(.1,.13,r);float rim=smoothstep(.43,.4,length(q))-smoothstep(.4,.36,length(q));
    vec3 c=mix(uB,uA,fib)*iris*pupil*1.3+uA*rim*.8;c+=uC*smoothstep(.45,.3,length(q-vec2(-.08,.1)))*.0;float glow=smoothstep(.9,.3,length(q))*.12;gl_FragColor=vec4(c+uA*glow,1.);}
    `.replace(/T0\(\)/g, 'uTime*.2'), { colors: ['#ff2d55', '#450a0a', '#fff'], mouse: true });

  sh('bg-floating-lines', `void main(){${UV}float acc=0.;for(float i=0.;i<9.;i++){float k=i/9.;float y=(k-.5)*.9+sin(p.x*(2.+k*3.)*uS+T*(.3+k*.4)+i*1.7)*.07*(1.+k)+(uMouse.y-.5)*.08*sin(p.x*3.-uMouse.x*6.);
      acc+=smoothstep(.006,.0,abs(p.y-y))*(.4+.6*k);}vec3 c=mix(uA,uB,uv.x+uv.y*.3);gl_FragColor=vec4(c*acc,acc);}`, { colors: ['#22d3ee', '#e879f9'], mouse: true });

  sh('bg-flux-lines', N + `void main(){${UV}float n=fbm(p*1.6*uS+vec2(T*.06,T*.04))*8.+atan(p.y,p.x)*.5;float l=abs(fract(n*1.2)-.5)*2.;float line=smoothstep(.1,.0,l-.82)*0.+smoothstep(.88,1.,l);
    vec3 c=mix(uA,uB,fbm(p*2.+T*.05))*line;gl_FragColor=vec4(c,line);}`, { colors: ['#34d399', '#60a5fa'] });

  sh('bg-gradient-blinds', `void main(){${UV}float n=34.*uS;float id=floor(uv.x*n);float f=fract(uv.x*n);float sh=.55+.45*cos((f-.5)*3.1)*1.;float w=.5+.5*sin(id*.35+T*.5+(uMouse.x-.5)*6.);
    vec3 c=mix(uA,uB,clamp(uv.y*.6+w*.5,0.,1.));c=mix(c,uC,smoothstep(.6,1.,w)*.5);c*=sh*(.7+.3*sin(id*1.7+T));gl_FragColor=vec4(c,1.);}`, { colors: ['#6d28d9', '#f472b6', '#fde68a'], mouse: true });

  sh('bg-gradient-waves', `void main(){${UV}vec3 c=uA*.2;float t=T*.3;for(float i=0.;i<4.;i++){float y=-.25+i*.22+sin(p.x*(1.6+i*.5)*uS+t*(1.+i*.3)+i*2.)*.1;float m=smoothstep(.0,.01,y-p.y)*0.+smoothstep(.0,-.4,p.y-y);
      vec3 col=i<1.?uA:(i<2.?uB:(i<3.?uC:mix(uA,uB,.5)));c=mix(c,col,clamp(1.-smoothstep(0.,.6,p.y-y),0.,1.)*.55*(p.y<y?1.:0.)+ (p.y<y?0.:0.));}
    gl_FragColor=vec4(c,1.);}`, { colors: ['#0f172a', '#6366f1', '#ec4899'] });

  sh('bg-grainient', N + `void main(){${UV}vec2 q=p*uS+vec2(sin(T*.2),cos(T*.17))*.3;float v=.5+.5*sin(q.x*2.1+sin(q.y*2.3+T*.3)*1.4);vec3 c=mix(uA,uB,v);c=mix(c,uC,smoothstep(.4,1.,fbm(q*1.5+T*.05)));
    float g=h21(gl_FragCoord.xy+fract(T)*100.)-.5;gl_FragColor=vec4(c+g*.22,1.);}`, { colors: ['#4338ca', '#f97316', '#fde68a'] });

  sh('bg-light-pillar', N + `void main(){${UV}float x=p.x-(uMouse.x-.5)*.1;float core=exp(-abs(x)*14.);float halo=exp(-abs(x)*3.2);float flow=fbm(vec2(x*5.,uv.y*3.-T*.6));
    float a=core*(.6+.6*flow)+halo*.35*flow;vec3 c=mix(uA,uB,uv.y)*a+uC*core*core;gl_FragColor=vec4(c,clamp(a,0.,1.));}`, { colors: ['#a78bfa', '#38bdf8', '#fff'], mouse: true });

  sh('bg-light-tunnel', `void main(){vec2 q=(gl_FragCoord.xy-.5*uRes)/min(uRes.x,uRes.y)+(uMouse-.5)*.15;float r=length(q),a=atan(q.y,q.x);float z=.12/(r+.02);float rings=pow(.5+.5*sin(z*6.-uTime*2.2*uS),6.);
    float spokes=pow(.5+.5*sin(a*12.+z*.8),8.);float f=(rings*.9+spokes*.5)*smoothstep(0.,.35,r);vec3 c=mix(uA,uB,fract(z*.15))*f+uC*exp(-r*7.)*.8;gl_FragColor=vec4(c,1.);}`, { colors: ['#38bdf8', '#e879f9', '#fff'], mouse: true });

  sh('bg-line-waves', N + `void main(){${UV}float acc=0.;for(float i=0.;i<26.;i++){float y=(i/26.-.5)*1.15;float h=fbm(vec2(p.x*2.2*uS+i*.1,T*.2+i*.07))*.28*smoothstep(.9,.0,abs(p.x));
      acc+=smoothstep(.0045,.0,abs(p.y-y-h+.1))*(.45+.55*(1.-i/26.));}gl_FragColor=vec4(mix(uA,uB,uv.x)*acc,acc);}`, { colors: ['#e2e8f0', '#818cf8'] });

  sh('bg-magic-rings', `void main(){vec2 q=(gl_FragCoord.xy-.5*uRes)/min(uRes.x,uRes.y);float r=length(q),a=atan(q.y,q.x);float acc=0.;for(float i=0.;i<6.;i++){float rr=.08+i*.075+.012*sin(uTime*(.8+i*.2)+a*(2.+i)+i);acc+=smoothstep(.006,.0,abs(r-rr))*(.9-i*.1);}
    float h=.5+.5*sin(a*3.+uTime*.6);vec3 c=mix(uA,uB,h)*acc+uC*exp(-r*5.)*.35;gl_FragColor=vec4(c,clamp(acc+.2*exp(-r*5.),0.,1.));}`, { colors: ['#f0abfc', '#67e8f9', '#7c3aed'] });

  sh('bg-molten-metal', N + `void main(){${UV}vec2 q=p*uS*1.8;float n=fbm(q+vec2(T*.12,0.)+fbm(q*1.3-T*.1)*2.);float h=smoothstep(.3,.8,n);float e=pow(abs(sin(n*14.)),8.);
    vec3 c=mix(uA*.1,uB,h);c+=uC*e*h*1.2;gl_FragColor=vec4(c,1.);}`, { colors: ['#7f1d1d', '#f97316', '#fde047'] });

  sh('bg-pattern-waves', `void main(){${UV}vec2 q=p*8.*uS;q.y+=sin(q.x*.8+T)*.9;q.x+=cos(q.y*.7-T*.8)*.6;float c1=step(0.,sin(q.x*3.14))*step(0.,sin(q.y*3.14));float chk=mod(floor(q.x)+floor(q.y),2.);
    vec3 c=mix(uA,uB,chk);c=mix(c,uC,.5+.5*sin(length(p)*6.-T));gl_FragColor=vec4(c*.75,1.);}`, { colors: ['#1e293b', '#6366f1', '#22d3ee'] });

  sh('bg-plasma-wave', `void main(){${UV}float t=T*.6;float y=p.y;float w=0.;for(float i=1.;i<5.;i++){w+=sin(p.x*i*1.7*uS+t*i*.6+i)/i*.18;}float d=abs(y-w);float core=exp(-d*28.);float glow=exp(-d*5.);
    vec3 c=mix(uA,uB,.5+.5*sin(p.x*2.+t))*glow*.9+uC*core;gl_FragColor=vec4(c,clamp(glow+core,0.,1.));}`, { colors: ['#06b6d4', '#a855f7', '#fff'] });

  sh('bg-prism', `void main(){${UV}vec2 o=vec2(-.15,0.)+(uMouse-.5)*.15;vec2 d=p-o;float a=atan(d.y,d.x);float r=length(d);float tri=smoothstep(.013,.0,abs(sdT(p))); 
    float beam=smoothstep(.25,.0,abs(a-.1*sin(T*.3)))*step(0.,d.x)*smoothstep(0.,.35,d.x);float hue=clamp((a+.5)*1.6,0.,1.);vec3 rb=.5+.5*cos(6.28*(hue+vec3(0.,.33,.67)));
    float spread=smoothstep(.9,.0,abs(a-.12))*step(0.,d.x)*smoothstep(.1,.5,d.x);vec3 c=rb*spread*.9+vec3(1.)*beam*.7*(1.-smoothstep(.1,.5,d.x))+uA*tri;gl_FragColor=vec4(c,clamp(max(spread,tri),0.,1.));}`.replace('sdT(p)', '(max(abs(p.x+.15)*.866+(p.y)*.5,-p.y)-.12)').replace('vec3 c=rb', 'vec3 c=rb'), { colors: ['#ffffff'], mouse: true });

  sh('bg-prismatic-burst', `void main(){vec2 q=(gl_FragCoord.xy-.5*uRes)/min(uRes.x,uRes.y);float r=length(q),a=atan(q.y,q.x);float rays=pow(.5+.5*sin(a*18.*uS+uTime*.5+sin(a*5.)*2.),3.);float fade=exp(-r*2.2);
    vec3 rb=.5+.5*cos(6.28*(a/6.28+r*.6-uTime*.05+vec3(0.,.33,.67)));vec3 c=rb*rays*fade*1.5+vec3(1.)*exp(-r*9.);gl_FragColor=vec4(c,1.);}`, { colors: ['#fff'] });

  sh('bg-scanner', `void main(){${UV}vec2 g=abs(fract(p*14.*uS)-.5);float grid=smoothstep(.47,.5,max(g.x,g.y))*.35;float sy=fract(T*.18)*1.3-.15;float d=abs(uv.y-sy);float band=exp(-d*24.);float line=exp(-d*260.);
    vec3 c=uA*grid*(.3+band*2.)+uB*band*.25+uC*line;gl_FragColor=vec4(c,1.);}`, { colors: ['#22d3ee', '#0ea5e9', '#ffffff'] });

  sh('bg-side-rays', N + `void main(){${UV}float s=0.;for(float k=0.;k<2.;k++){vec2 src=vec2(k<1.?-.62*asp*2.:.62*asp*2.,.35)*.5;vec2 d=p-src;float a=atan(d.y,d.x*(k<1.?1.:-1.));float r=length(d);
      s+=(pow(.5+.5*sin(a*26.*uS+T*(k<1.?.5:-.4)+k*3.),3.)*.7+.3)*exp(-r*1.3)*(.6+.4*fbm(vec2(a*4.,T*.2+k)));}
    vec3 c=mix(uA,uB,uv.x)*s;gl_FragColor=vec4(c,clamp(s,0.,1.));}`, { colors: ['#f0abfc', '#67e8f9'] });

  sh('bg-sliced-waves', N + `void main(){${UV}float n=22.*uS;float id=floor(uv.y*n)/n;float off=sin(id*5.+T*.6)*.4+fbm(vec2(id*7.,T*.15))*.6;float x=uv.x+off;float v=.5+.5*sin(x*7.+id*3.+T*.4);
    float gap=smoothstep(.0,.08,fract(uv.y*n))*smoothstep(1.,.92,fract(uv.y*n));vec3 c=mix(uA,uB,v);c=mix(c,uC,smoothstep(.7,1.,fbm(vec2(x*3.,id*9.))));gl_FragColor=vec4(c*gap,1.);}`, { colors: ['#0ea5e9', '#d946ef', '#fde68a'] });

  sh('bg-soft-aurora', N + `void main(){${UV}float t=T*.12;vec3 c=vec3(0.);for(float i=0.;i<3.;i++){vec2 q=p*(1.1+i*.3)*uS+vec2(t*(1.+i*.3),-t*.6+i*4.);float n=fbm(q+fbm(q*.8+i)*1.6);float m=smoothstep(.35,.8,n);vec3 col=i<1.?uA:(i<2.?uB:uC);c+=col*m*.55;}
    c*=smoothstep(1.,.1,length(p*vec2(.7,1.1)));gl_FragColor=vec4(c,clamp(max(c.r,max(c.g,c.b)),0.,1.));}`, { colors: ['#34d399', '#818cf8', '#f9a8d4'] });

  sh('bg-threads', N + `void main(){${UV}float acc=0.;for(float i=0.;i<10.;i++){float x=(i/10.-.5)*asp*1.15;float w=(fbm(vec2(p.y*1.4*uS+i*3.,T*.18+i))-.5)*.5+sin(p.y*3.+T*.4+i)*.04;acc+=smoothstep(.004,.0,abs(p.x-x-w))*(.35+.65*fbm(vec2(i,p.y*2.)));}
    gl_FragColor=vec4(mix(uA,uB,uv.y)*acc,acc);}`, { colors: ['#a5b4fc', '#f0abfc'] });

  sh('bg-topography', N + `void main(){${UV}float n=fbm(p*1.7*uS+vec2(T*.03,T*.02))*14.;float l=abs(fract(n)-.5)*2.;float line=smoothstep(.93,.99,l);float major=smoothstep(.985,1.,abs(fract(n/5.)-.5)*2.);
    vec3 c=uA*line*.6+uB*major;gl_FragColor=vec4(c,clamp(line*.6+major,0.,1.));}`, { colors: ['#86efac', '#fde68a'] });

  sh('bg-web-threads', `void main(){vec2 q=(gl_FragCoord.xy-.5*uRes)/min(uRes.x,uRes.y)-(uMouse-.5)*.1;float r=length(q),a=atan(q.y,q.x);float sp=16.;float ang=abs(fract(a/6.2832*sp)-.5);float spoke=smoothstep(.01,.0,ang*r*3.-.0);
    float ring=0.;for(float i=1.;i<9.;i++){float rr=i*.085;float sag=sin(a*sp*.5)*.0;float pr=rr*(1.+.05*sin(a*sp+uTime*.6+i)*(1.-ang*2.));ring+=smoothstep(.004,.0,abs(r-pr)*1.)*step(ang,.5);}
    float v=max(spoke*.6,ring*.8)*exp(-r*1.1);gl_FragColor=vec4(mix(uA,uB,r)*v,clamp(v,0.,1.));}`, { colors: ['#e2e8f0', '#a78bfa'], mouse: true });

  sh('bg-balatro', N + `void main(){vec2 q=(gl_FragCoord.xy-.5*uRes)/min(uRes.x,uRes.y);q=floor(q*(90./uS))/(90./uS);float sp=length(q);float t=uTime*.6;float ang=atan(q.y,q.x)+sp*3.2-t;
    vec2 w=vec2(cos(ang),sin(ang))*sp*2.4;for(float i=1.;i<6.;i++){w+=vec2(sin(w.y*1.3+t*.5*i),cos(w.x*1.1-t*.4*i))/i;}float v=.5+.5*sin(w.x+w.y);
    vec3 c=mix(uA,uB,smoothstep(.2,.55,v));c=mix(c,uC,smoothstep(.6,.9,v));c*=.55+.45*smoothstep(1.3,.0,sp);gl_FragColor=vec4(c,1.);}`, { colors: ['#de443b', '#006bb4', '#162325'] });

  sh('bg-crt-warp', N + `void main(){vec2 uv=gl_FragCoord.xy/uRes;vec2 c=uv*2.-1.;c*=1.+dot(c,c)*.12;vec2 w=c*.5+.5;float inb=step(abs(c.x),1.)*step(abs(c.y),1.);
    float scan=.78+.22*sin(w.y*uRes.y*1.6);vec3 col=vec3(0.);for(int k=0;k<3;k++){float o=(float(k)-1.)*.004;vec2 q=vec2(w.x+o,w.y)*vec2(uRes.x/uRes.y,1.)*3.*uS;float v=fbm(q+vec2(uTime*.2,uTime*.1))+.5*fbm(q*2.-uTime*.15);col[k]=smoothstep(.45,1.1,v);}
    vec3 tint=mix(uA,uB,w.y);float flick=.94+.06*sin(uTime*60.);float roll=smoothstep(.0,.02,abs(fract(w.y-uTime*.1)-.5)-.47)*.0;
    gl_FragColor=vec4(col*tint*scan*flick*inb*(1.-.5*dot(c,c)*.5),1.);}`, { colors: ['#4ade80', '#38bdf8'] });

  sh('bg-aero-shards', `vec2 hh(vec2 p){p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)));return fract(sin(p)*43758.5453);}
    void main(){${UV}vec2 g=p*5.*uS;vec2 i=floor(g),f=fract(g);float md=9.;vec2 mid=vec2(0.);for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){vec2 b=vec2(float(x),float(y));vec2 o=hh(i+b);o=.5+.5*sin(T*.4+6.28*o);float d=length(b+o-f);if(d<md){md=d;mid=i+b;}}
    vec2 h=hh(mid);float shade=.35+.65*h.x;float edge=smoothstep(.02,.0,md-.0)*0.;vec3 c=mix(uA,uB,h.y)*shade;c=mix(c,uC,pow(.5+.5*sin(p.x*5.+h.x*6.+T*.5),6.)*.6);gl_FragColor=vec4(c,1.);}`, { colors: ['#0e7490', '#c4b5fd', '#ffffff'] });

  sh('bg-ghost-fibers', N + `void main(){${UV}vec2 q=vec2(p.x*60.*uS,p.y*2.4);float n=fbm(vec2(q.x*.18+T*.05,q.y*3.+T*.1));float f=pow(vn(vec2(q.x,q.y*.4+n*3.)),3.);float a=f*smoothstep(.15,.7,n)*.9;gl_FragColor=vec4(mix(uA,uB,uv.y)*a,a);}`, { colors: ['#e2e8f0', '#a5b4fc'] });

  sh('bg-faulty-terminal', N + `void main(){vec2 uv=gl_FragCoord.xy/uRes;vec2 cell=floor(gl_FragCoord.xy/(11.*uS));vec2 f=fract(gl_FragCoord.xy/(11.*uS));float t=floor(uTime*8.);float h=h21(cell+t*.01*floor(h21(cell)*4.));
    float glyph=step(.35,h)*step(abs(f.x-.5),.28)*step(abs(f.y-.5),.36)*step(.3,fract(h*13.+f.x*3.*h21(cell+1.)+f.y*5.*h21(cell+2.)));float wave=.5+.5*sin(cell.y*.25-uTime*1.6+cell.x*.05);
    float scan=.8+.2*sin(gl_FragCoord.y*1.7);float glitch=step(.985,h21(vec2(floor(uTime*6.),floor(uv.y*14.))))*.5;vec3 c=uA*glyph*(.25+.75*wave)*scan+uA*glitch*.25;gl_FragColor=vec4(c,1.);}`, { colors: ['#4ade80'] });

  sh('bg-ferrofluid', N + `float hgt(vec2 q,float t){float n=fbm(q*1.2+vec2(t*.1,0.));float s=pow(vn(q*3.+n*2.+t*.2),2.);return n*.7+s*.6;}
    void main(){${UV}vec2 q=p*2.2*uS;float t=uTime;float e=.01;float h=hgt(q,t);vec3 nrm=normalize(vec3(h-hgt(q+vec2(e,0.),t),h-hgt(q+vec2(0.,e),t),.02));vec3 L=normalize(vec3(.4+(uMouse.x-.5),.6+(uMouse.y-.5),.7));
    float dif=clamp(dot(nrm,L),0.,1.);float spec=pow(clamp(dot(reflect(-L,nrm),vec3(0.,0.,1.)),0.,1.),24.);vec3 c=uA*dif*.35+uB*spec*1.2+vec3(.01);gl_FragColor=vec4(c,1.);}`, { colors: ['#1e293b', '#e2e8f0'], mouse: true });

  sh('bg-dot-field', N + `void main(){${UV}vec2 g=p*26.*uS;vec2 id=floor(g),f=fract(g)-.5;float w=.5+.5*sin(length(id)*.45-T*1.4+fbm(id*.12)*5.);float md=length(id/26.*1.-(uMouse-.5)*vec2(asp,1.)/uS*1.);float r=.12+.3*w*smoothstep(.0,.0,0.)+ .3*w;
    float d=smoothstep(r,r-.08,length(f));vec3 c=mix(uA,uB,w)*d;gl_FragColor=vec4(c,d);}`, { colors: ['#475569', '#a78bfa'], mouse: true });

  sh('bg-micro-slats', `void main(){${UV}float n=60.*uS;float id=floor(uv.x*n),f=fract(uv.x*n);float tilt=sin(id*.21+T*.4)*.5+(uMouse.x-.5)*1.2;float nx=(f-.5)*1.4+tilt;float lit=clamp(.5+.5*nx,0.,1.);float rim=smoothstep(.0,.15,f)*smoothstep(1.,.85,f);
    vec3 c=mix(uA,uB,lit)*(.35+.65*pow(lit,1.6))*(.5+.5*rim);c+=uC*pow(lit,12.)*.5;gl_FragColor=vec4(c,1.);}`, { colors: ['#0f172a', '#7dd3fc', '#fff'], mouse: true });
})();

/* ===================== MORE CANVAS BACKGROUNDS ===================== */
(function () {
  const { register, util: U } = FX;
  const frame = (el, o, setup) => { const k = U.canvasIn(el); const s = k.size; const api = setup(k.ctx, s, k); const d = (t, dt) => { k.ctx.setTransform(s.dpr, 0, 0, s.dpr, 0, 0); k.ctx.clearRect(0, 0, s.w, s.h); api.draw(t, dt); }; if (U.RM) { d(2, .016); return; } return U.loop(el, d); };
  const mouseOf = (el) => { const m = { x: -9999, y: -9999, on: false }; el.addEventListener('pointermove', e => { const l = U.local(el, e); m.x = l.x; m.y = l.y; m.on = true; }); el.addEventListener('pointerleave', () => { m.x = m.y = -9999; m.on = false; }); return m; };

  // Squares that flash random colours
  register('bg-acid-squares', el => { const o = U.opts(el, { size: 44, colors: ['#ff2d95', '#14f195', '#ffe600', '#00c2ff'], rate: .03 }); const m = mouseOf(el); let cells = [], cols = 0, rows = 0;
    return frame(el, o, (ctx, s) => { const build = () => { cols = Math.ceil(s.w / o.size); rows = Math.ceil(s.h / o.size); cells = Array.from({ length: cols * rows }, () => ({ c: null, a: 0 })); }; build(); new ResizeObserver(build).observe(el);
      return { draw(t, dt) { cells.forEach((c, i) => { if (Math.random() < o.rate * 60 * dt) { c.c = o.colors[Math.random() * o.colors.length | 0]; c.a = 1; } const x = (i % cols) * o.size, y = (i / cols | 0) * o.size; if (Math.hypot(m.x - x - o.size / 2, m.y - y - o.size / 2) < o.size * 1.2) { c.c = o.colors[(i * 7) % o.colors.length]; c.a = 1; } c.a = Math.max(0, c.a - dt * .9); if (c.a > 0) { ctx.globalAlpha = c.a * .9; ctx.fillStyle = c.c; ctx.fillRect(x + 1, y + 1, o.size - 2, o.size - 2); } }); } }; }); });

  // Antigravity: dots float upward, the cursor repels them, they drift back
  register('bg-antigravity', el => { const o = U.opts(el, { count: 160, color: '#a5b4fc', repel: 130 }); const m = mouseOf(el);
    return frame(el, o, (ctx, s) => { const P = Array.from({ length: o.count }, () => ({ x: Math.random(), y: Math.random(), z: U.rand(.3, 1), vx: 0, vy: 0, ph: Math.random() * 9 }));
      return { draw(t, dt) { ctx.fillStyle = o.color; P.forEach(p => { p.y -= dt * .02 * p.z; if (p.y < -.05) { p.y = 1.05; p.x = Math.random(); } let x = p.x * s.w + p.vx, y = p.y * s.h + p.vy; const dx = x - m.x, dy = y - m.y, d = Math.hypot(dx, dy); if (d < o.repel) { p.vx += dx / d * (o.repel - d) * .02; p.vy += dy / d * (o.repel - d) * .02; } p.vx *= .93; p.vy *= .93; ctx.globalAlpha = .25 + .6 * p.z; ctx.beginPath(); ctx.arc(x + Math.sin(t + p.ph) * 6 * p.z, y, 1 + 2.6 * p.z, 0, 6.283); ctx.fill(); }); } }; }); });

  // Ballpit: coloured balls with gravity, collisions, and a cursor that shoves them
  register('bg-ballpit', el => { const o = U.opts(el, { count: 26, colors: ['#f43f5e', '#fb923c', '#facc15', '#34d399', '#38bdf8', '#a78bfa'], min: 14, max: 34, gravity: 900 }); const m = mouseOf(el);
    return frame(el, o, (ctx, s) => { let B = Array.from({ length: o.count }, (_, i) => ({ x: U.rand(0, s.w), y: U.rand(-s.h, 0), vx: 0, vy: 0, r: U.rand(o.min, o.max), c: o.colors[i % o.colors.length] }));
      return { draw(t, dt) { for (let k = 0; k < 2; k++) { const h = dt / 2; B.forEach(b => { b.vy += o.gravity * h; b.x += b.vx * h; b.y += b.vy * h; if (b.x < b.r) { b.x = b.r; b.vx *= -.6; } if (b.x > s.w - b.r) { b.x = s.w - b.r; b.vx *= -.6; } if (b.y > s.h - b.r) { b.y = s.h - b.r; b.vy *= -.55; b.vx *= .985; }
          const dx = b.x - m.x, dy = b.y - m.y, d = Math.hypot(dx, dy); if (d < b.r + 50) { b.vx += dx / d * 2600 * h; b.vy += dy / d * 2600 * h; } });
        for (let i = 0; i < B.length; i++) for (let j = i + 1; j < B.length; j++) { const a = B[i], c = B[j], dx = c.x - a.x, dy = c.y - a.y, d = Math.hypot(dx, dy), min = a.r + c.r; if (d < min && d > .01) { const n = (min - d) / 2, ux = dx / d, uy = dy / d; a.x -= ux * n; a.y -= uy * n; c.x += ux * n; c.y += uy * n; const rv = (c.vx - a.vx) * ux + (c.vy - a.vy) * uy; if (rv < 0) { const j2 = rv * .75; a.vx += j2 * ux; a.vy += j2 * uy; c.vx -= j2 * ux; c.vy -= j2 * uy; } } } }
        B.forEach(b => { const g = ctx.createRadialGradient(b.x - b.r * .35, b.y - b.r * .35, b.r * .1, b.x, b.y, b.r); g.addColorStop(0, '#fff'); g.addColorStop(.25, b.c); g.addColorStop(1, b.c); ctx.fillStyle = g; ctx.globalAlpha = .95; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 6.283); ctx.fill(); }); } }; }); });

  // ASCII art render of a moving gradient field
  register('bg-gradient-ascii', el => { const o = U.opts(el, { ramp: ' .:-=+*#%@', size: 13, color: '#86efac' });
    return frame(el, o, (ctx, s) => ({ draw(t) { const cw = o.size * .6, ch = o.size; ctx.font = `${o.size}px ui-monospace,monospace`; ctx.textBaseline = 'top'; ctx.fillStyle = o.color; for (let y = 0; y < s.h; y += ch) for (let x = 0; x < s.w; x += cw) { const u = x / s.w, v = y / s.h; const f = .5 + .25 * Math.sin(u * 6 + t * .8) + .25 * Math.sin(v * 7 - t * .6 + Math.sin(u * 3 + t * .3) * 2); ctx.globalAlpha = .35 + f * .65; ctx.fillText(o.ramp[Math.min(o.ramp.length - 1, f * o.ramp.length | 0)], x, y); } } })); });

  // Perspective-less distort grid: lines bend away from the cursor
  register('bg-grid-distortion', el => { const o = U.opts(el, { gap: 34, color: '#6366f1', radius: 150, push: 34 }); const m = mouseOf(el); const sm = { x: -9999, y: -9999 };
    return frame(el, o, (ctx, s) => ({ draw() { sm.x = U.lerp(sm.x, m.x, .15); sm.y = U.lerp(sm.y, m.y, .15); ctx.strokeStyle = o.color; ctx.lineWidth = 1; ctx.globalAlpha = .6;
      const P = (x, y) => { const dx = x - sm.x, dy = y - sm.y, d = Math.hypot(dx, dy), k = Math.max(0, 1 - d / o.radius); const f = k * k * o.push; return [x + dx / (d + 1) * f, y + dy / (d + 1) * f]; };
      for (let x = 0; x <= s.w + o.gap; x += o.gap) { ctx.beginPath(); for (let y = 0; y <= s.h + 8; y += 8) { const [a, b] = P(x, y); y ? ctx.lineTo(a, b) : ctx.moveTo(a, b); } ctx.stroke(); }
      for (let y = 0; y <= s.h + o.gap; y += o.gap) { ctx.beginPath(); for (let x = 0; x <= s.w + 8; x += 8) { const [a, b] = P(x, y); x ? ctx.lineTo(a, b) : ctx.moveTo(a, b); } ctx.stroke(); } } })); });

  // Tiny line segments that all aim at the cursor
  register('bg-magnet-lines', el => { const o = U.opts(el, { gap: 30, len: 16, color: '#94a3b8', hot: '#f472b6' }); const m = mouseOf(el); let a = 0, tx = 0;
    return frame(el, o, (ctx, s) => ({ draw(t) { ctx.lineCap = 'round'; ctx.lineWidth = 2; const hx = m.on ? m.x : s.w / 2 + Math.cos(t * .6) * s.w * .3, hy = m.on ? m.y : s.h / 2 + Math.sin(t * .8) * s.h * .3;
      for (let y = o.gap / 2; y < s.h; y += o.gap) for (let x = o.gap / 2; x < s.w; x += o.gap) { const ang = Math.atan2(hy - y, hx - x), d = Math.hypot(hx - x, hy - y), k = Math.max(0, 1 - d / 260); ctx.strokeStyle = k > .15 ? o.hot : o.color; ctx.globalAlpha = .35 + k * .65; const l = o.len * (.6 + k * .6); ctx.beginPath(); ctx.moveTo(x - Math.cos(ang) * l / 2, y - Math.sin(ang) * l / 2); ctx.lineTo(x + Math.cos(ang) * l / 2, y + Math.sin(ang) * l / 2); ctx.stroke(); } } })); });

  // Pixel blocks driven by waves; click sends a ripple
  register('bg-pixel-blast', el => { const o = U.opts(el, { px: 12, color: '#a78bfa', color2: '#22d3ee' }); const R = []; el.addEventListener('pointerdown', e => { const l = U.local(el, e); R.push({ x: l.x, y: l.y, t: performance.now() }); }); const [r1, g1, b1] = U.hex(o.color).map(v => v * 255), [r2, g2, b2] = U.hex(o.color2).map(v => v * 255); el.style.pointerEvents = el.style.pointerEvents || 'auto';
    return frame(el, o, (ctx, s) => ({ draw(t) { const n = performance.now(); while (R.length && n - R[0].t > 2200) R.shift();
      for (let y = 0; y < s.h; y += o.px) for (let x = 0; x < s.w; x += o.px) { let v = .5 + .25 * Math.sin(x * .02 + t * .9) + .25 * Math.sin(y * .025 - t * .7 + x * .01); R.forEach(r => { const d = Math.hypot(x - r.x, y - r.y), age = (n - r.t) / 1000; v += Math.max(0, 1 - Math.abs(d - age * 320) / 38) * Math.max(0, 1 - age / 2.2); }); if (v < .55) continue; const k = Math.min(1, (v - .55) * 2.2); ctx.fillStyle = `rgb(${r1 + (r2 - r1) * k | 0},${g1 + (g2 - g1) * k | 0},${b1 + (b2 - b1) * k | 0})`; ctx.globalAlpha = Math.min(1, k + .15); const sz = o.px * (.45 + .5 * k); ctx.fillRect(x + (o.px - sz) / 2, y + (o.px - sz) / 2, sz, sz); } } })); });

  // Square pixel snowfall
  register('bg-pixel-snow', el => { const o = U.opts(el, { count: 140, color: '#fff', px: 4 });
    return frame(el, o, (ctx, s) => { const P = Array.from({ length: o.count }, () => ({ x: Math.random(), y: Math.random(), v: U.rand(.04, .14), z: U.rand(.5, 2), ph: Math.random() * 9 })); return { draw(t, dt) { ctx.fillStyle = o.color; P.forEach(p => { p.y += p.v * dt; if (p.y > 1.02) { p.y = -.02; p.x = Math.random(); } const sz = Math.round(o.px * p.z); ctx.globalAlpha = .35 + .15 * p.z; ctx.fillRect(Math.round((p.x * s.w + Math.sin(t * .6 + p.ph) * 14) / 4) * 4, Math.round(p.y * s.h / 4) * 4, sz, sz); }); } }; }); });

  // Grid of shapes that swell near the cursor. data-opts {"shape":"square|circle|triangle"}
  register('bg-shape-grid', el => { const o = U.opts(el, { gap: 38, shape: 'square', color: '#475569', hot: '#38bdf8', radius: 170 }); const m = mouseOf(el);
    const shapePath = (ctx, x, y, r) => { ctx.beginPath(); if (o.shape === 'circle') ctx.arc(x, y, r, 0, 6.283); else if (o.shape === 'triangle') { ctx.moveTo(x, y - r); ctx.lineTo(x + r, y + r * .8); ctx.lineTo(x - r, y + r * .8); ctx.closePath(); } else ctx.rect(x - r, y - r, r * 2, r * 2); };
    return frame(el, o, (ctx, s) => ({ draw(t) { for (let y = o.gap / 2; y < s.h; y += o.gap) for (let x = o.gap / 2; x < s.w; x += o.gap) { const d = Math.hypot(x - m.x, y - m.y), k = Math.max(0, 1 - d / o.radius), w = .5 + .5 * Math.sin(t + x * .02 + y * .02); const r = o.gap * (.1 + .08 * w + .3 * k * k); ctx.fillStyle = k > .2 ? o.hot : o.color; ctx.globalAlpha = .35 + .65 * Math.max(k, w * .3); shapePath(ctx, x, y, r); ctx.fill(); } } })); });

  // Rows of shapes riding sine waves
  register('bg-shape-waves', el => { const o = U.opts(el, { rows: 14, cols: 40, shape: 'circle', colors: ['#f472b6', '#818cf8', '#22d3ee'] });
    return frame(el, o, (ctx, s) => ({ draw(t) { for (let r = 0; r < o.rows; r++) for (let c = 0; c < o.cols; c++) { const u = c / (o.cols - 1), x = u * s.w, base = (r + .5) / o.rows * s.h, y = base + Math.sin(u * 7 + t * 1.1 + r * .5) * s.h * .05, z = .5 + .5 * Math.sin(u * 5 - t * .8 + r); const rad = 2 + z * 5; ctx.fillStyle = o.colors[r % o.colors.length]; ctx.globalAlpha = .25 + .7 * z; ctx.beginPath(); if (o.shape === 'square') ctx.rect(x - rad, y - rad, rad * 2, rad * 2); else ctx.arc(x, y, rad, 0, 6.283); ctx.fill(); } } })); });

  // Falling vertical light streaks
  register('bg-lightfall', el => { const o = U.opts(el, { count: 70, colors: ['#38bdf8', '#a78bfa', '#f0abfc'] });
    return frame(el, o, (ctx, s) => { const L = Array.from({ length: o.count }, () => ({ x: Math.random(), y: Math.random(), v: U.rand(.25, .9), l: U.rand(.08, .3), c: o.colors[Math.random() * o.colors.length | 0], w: U.rand(1, 2.6) })); return { draw(t, dt) { ctx.lineCap = 'round'; L.forEach(p => { p.y += p.v * dt; if (p.y - p.l > 1) { p.y = 0; p.x = Math.random(); } const x = p.x * s.w, y1 = p.y * s.h, y0 = (p.y - p.l) * s.h; const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, 'transparent'); g.addColorStop(1, p.c); ctx.strokeStyle = g; ctx.lineWidth = p.w; ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke(); }); } }; }); });
})();

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

/* ===================== MICRO-INTERACTIONS ===================== */
(function () {
  const { register, util: U } = FX;
  const css = document.createElement('style'); css.id = 'fx-micro-css';
  css.textContent = `
.fx-ripple{position:relative;overflow:hidden}.fx-ripple .rp{position:absolute;border-radius:50%;background:currentColor;opacity:.25;transform:scale(0);animation:fx-rp .7s ease-out forwards;pointer-events:none}@keyframes fx-rp{to{transform:scale(1);opacity:0}}
.fx-hold{position:relative;overflow:hidden;user-select:none;touch-action:none}.fx-hold .fill{position:absolute;inset:0;background:var(--fx-hold,rgba(255,255,255,.28));transform:scaleX(0);transform-origin:left;pointer-events:none}
.fx-sq{appearance:none;position:relative;width:3.4em;height:1.9em;border-radius:99px;background:rgba(127,127,127,.4);border:0;cursor:pointer;transition:background .3s;padding:0}.fx-sq::after{content:'';position:absolute;left:.2em;top:.2em;width:1.5em;height:1.5em;border-radius:99px;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.3);transition:transform .45s cubic-bezier(.3,1.6,.5,1),width .2s}
.fx-sq:active::after{width:1.9em}.fx-sq[aria-checked=true]{background:var(--fx-on,#34d399)}.fx-sq[aria-checked=true]::after{transform:translateX(1.5em)}.fx-sq[aria-checked=true]:active::after{transform:translateX(1.1em)}
.fx-chk{appearance:none;width:1.6em;height:1.6em;border:2px solid currentColor;border-radius:.4em;cursor:pointer;position:relative;display:inline-grid;place-content:center;transition:background .25s,transform .3s cubic-bezier(.3,1.8,.5,1)}.fx-chk:active{transform:scale(.85)}
.fx-chk::after{content:'';width:.45em;height:.8em;border:solid var(--fx-chkc,#000);border-width:0 3px 3px 0;transform:rotate(45deg) scale(0);transition:transform .4s cubic-bezier(.3,1.9,.5,1);margin-top:-.15em}.fx-chk:checked{background:currentColor}.fx-chk:checked::after{transform:rotate(45deg) scale(1)}
.fx-heart.on{animation:fx-hb .6s cubic-bezier(.3,1.8,.5,1)}@keyframes fx-hb{0%{transform:scale(1)}40%{transform:scale(1.5)}100%{transform:scale(1)}}
`;
  document.head.append(css);

  register('ripple-button', el => { el.classList.add('fx-ripple'); el.addEventListener('pointerdown', e => { const l = U.local(el, e), d = Math.hypot(l.w, l.h) * 2, s = document.createElement('span'); s.className = 'rp'; s.style.cssText = `width:${d}px;height:${d}px;left:${l.x - d / 2}px;top:${l.y - d / 2}px`; el.append(s); setTimeout(() => s.remove(), 750); }); });

  // Press and hold to confirm. Fires 'fx-hold' on the element.
  register('hold-button', el => {
    const o = U.opts(el, { ms: 1100 }); el.classList.add('fx-hold'); const f = document.createElement('span'); f.className = 'fill'; el.prepend(f); let t0 = 0, raf = 0;
    const tick = n => { const k = Math.min(1, (n - t0) / o.ms); f.style.transform = `scaleX(${k})`; if (k >= 1) { el.dispatchEvent(new CustomEvent('fx-hold')); el.classList.add('done'); cancel(true); } else raf = requestAnimationFrame(tick); };
    const cancel = (done) => { cancelAnimationFrame(raf); if (!done) { f.style.transition = 'transform .3s'; f.style.transform = 'scaleX(0)'; setTimeout(() => f.style.transition = '', 320); } else setTimeout(() => { f.style.transition = 'transform .5s'; f.style.transform = 'scaleX(0)'; setTimeout(() => f.style.transition = '', 520); }, 500); };
    el.addEventListener('pointerdown', () => { t0 = performance.now(); f.style.transition = ''; raf = requestAnimationFrame(tick); }); ['pointerup', 'pointerleave', 'pointercancel'].forEach(e => el.addEventListener(e, () => cancel(false)));
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.dispatchEvent(new CustomEvent('fx-hold')); } });
  });

  register('squish-switch', el => { el.classList.add('fx-sq'); el.setAttribute('role', 'switch'); el.setAttribute('aria-checked', el.getAttribute('aria-checked') || 'false'); el.addEventListener('click', () => el.setAttribute('aria-checked', el.getAttribute('aria-checked') !== 'true')); });
  register('spring-check', el => { if (el.tagName === 'INPUT') { el.type = 'checkbox'; el.classList.add('fx-chk'); } });
  register('pulse-heart', el => { el.classList.add('fx-heart'); el.setAttribute('role', 'button'); el.setAttribute('aria-pressed', 'false'); el.style.cursor = 'pointer'; el.style.transition = 'color .2s'; el.addEventListener('click', () => { const on = el.getAttribute('aria-pressed') !== 'true'; el.setAttribute('aria-pressed', on); el.classList.remove('on'); el.offsetWidth; if (on) el.classList.add('on'); el.style.color = on ? 'var(--fx-heart,#f43f5e)' : ''; }); });

  // Drag horizontally over a number to change it (like design tools)
  register('scrub-field', el => {
    const o = U.opts(el, { step: 1, min: -Infinity, max: Infinity, per: 4 }); let v = +el.textContent || 0, x0 = 0, v0 = 0, d = false; el.style.cursor = 'ew-resize'; el.style.userSelect = 'none'; el.style.touchAction = 'none'; el.style.fontVariantNumeric = 'tabular-nums';
    el.addEventListener('pointerdown', e => { d = true; x0 = e.clientX; v0 = v; el.setPointerCapture(e.pointerId); }); el.addEventListener('pointermove', e => { if (!d) return; v = U.clamp(Math.round((v0 + (e.clientX - x0) / o.per * o.step) / o.step) * o.step, o.min, o.max); el.textContent = v; el.dispatchEvent(new CustomEvent('fx-input', { detail: v })); }); el.addEventListener('pointerup', () => d = false);
  });
})();

/* ===================== MORE MICRO-INTERACTIONS ===================== */
(function () {
  const { register, util: U } = FX;
  const css = document.createElement('style'); css.id = 'fx-micro2-css';
  css.textContent = `
.fx-bell{display:inline-grid;place-items:center;position:relative;cursor:pointer;background:none;border:0;color:inherit;font-size:1.6em;padding:.2em}.fx-bell.on svg{animation:fx-ring .9s ease-in-out;transform-origin:50% 8%}.fx-bell .dot{position:absolute;right:.25em;top:.2em;width:.45em;height:.45em;border-radius:50%;background:#f43f5e;transform:scale(0);transition:transform .35s cubic-bezier(.3,1.8,.5,1)}.fx-bell.on .dot{transform:scale(1)}
@keyframes fx-ring{0%,100%{transform:rotate(0)}15%{transform:rotate(18deg)}30%{transform:rotate(-16deg)}45%{transform:rotate(12deg)}60%{transform:rotate(-8deg)}75%{transform:rotate(4deg)}}
.fx-slots{display:inline-flex;gap:.4em}.fx-slots input{width:2.6em;height:3.2em;text-align:center;font:inherit;font-size:1.4em;font-weight:700;color:inherit;background:rgba(127,127,127,.12);border:2px solid rgba(127,127,127,.3);border-radius:.5em;outline:0;transition:border-color .2s,transform .25s cubic-bezier(.3,1.8,.5,1)}.fx-slots input:focus{border-color:var(--fx-sl,#7c5cff);transform:translateY(-3px)}.fx-slots input.pop{animation:fx-pop .35s cubic-bezier(.3,1.8,.5,1)}@keyframes fx-pop{0%{transform:scale(.7)}100%{transform:scale(1)}}
.fx-fly{position:relative;overflow:visible;display:inline-flex;align-items:center;gap:.5em}.fx-fly .pl{display:inline-block;transition:transform .8s cubic-bezier(.5,0,.8,.3),opacity .6s}.fx-fly.go .pl{transform:translate(220px,-120px) rotate(30deg);opacity:0}
.fx-fuse{position:relative;overflow:hidden}.fx-fuse .fu{position:absolute;left:0;bottom:0;height:3px;width:100%;background:linear-gradient(90deg,#f59e0b,#ef4444);transform-origin:left;transform:scaleX(0)}.fx-fuse .sp{position:absolute;bottom:-3px;width:10px;height:10px;border-radius:50%;background:#fde68a;box-shadow:0 0 10px 4px #f59e0b;opacity:0}
.fx-gsel{position:relative;display:inline-block}.fx-gsel .bx{position:absolute;left:0;right:0;border-radius:.4em;background:var(--fx-gs,#7c5cff);transition:top .3s cubic-bezier(.2,.8,.2,1),height .3s;z-index:0}.fx-gsel>[role=option]{position:relative;z-index:1;padding:.5em 1em;cursor:pointer;transition:color .25s}.fx-gsel>[aria-selected=true]{color:#fff}
.fx-jelly{display:inline-flex;gap:.3em;position:relative;background:rgba(127,127,127,.15);padding:.3em;border-radius:99px}.fx-jelly>[role=radio]{position:relative;z-index:1;padding:.5em 1.1em;cursor:pointer;border-radius:99px;transition:color .3s}.fx-jelly .jb{position:absolute;top:.3em;bottom:.3em;border-radius:99px;background:var(--fx-jl,#7c5cff);z-index:0;will-change:left,width,transform}
.fx-lat{display:inline-grid;grid-template-columns:repeat(var(--n,5),1fr);gap:6px}.fx-lat i{width:10px;height:10px;border-radius:2px;background:currentColor;animation:fx-lat 1.2s ease-in-out infinite;transform:rotate(45deg) scale(.4);opacity:.4}@keyframes fx-lat{50%{transform:rotate(45deg) scale(1);opacity:1}}
.fx-star{display:inline-flex;gap:.15em;cursor:pointer;font-size:1.8em;line-height:1}.fx-star span{transition:transform .25s cubic-bezier(.3,1.8,.5,1),color .2s;color:rgba(127,127,127,.4)}.fx-star span.f{color:#fbbf24}.fx-star span.h{transform:translateY(-4px) scale(1.25)}
.fx-prompt{position:relative;display:flex;min-width:0;max-width:100%;box-sizing:border-box;align-items:center;gap:.6em;padding:.35em .35em .35em 1.1em;border-radius:99px;background:var(--fx-pb,#14141d);isolation:isolate}.fx-prompt::before{content:'';position:absolute;inset:-2px;border-radius:inherit;background:conic-gradient(from var(--a,0deg),#7c5cff,#22d3ee,#f472b6,#7c5cff);z-index:-2;animation:fx-spin2 5s linear infinite;opacity:.6;transition:opacity .3s;filter:blur(.5px)}.fx-prompt:focus-within::before{opacity:1;filter:blur(4px)}.fx-prompt::after{content:'';position:absolute;inset:0;border-radius:inherit;background:var(--fx-pb,#14141d);z-index:-1}.fx-prompt input{flex:1;background:none;border:0;outline:0;color:inherit;font:inherit;min-width:0}.fx-prompt button{border:0;border-radius:99px;width:2.4em;height:2.4em;background:#fff;color:#000;cursor:pointer;font-size:1em;transition:transform .2s}.fx-prompt button:active{transform:scale(.88)}
@property --a{syntax:'<angle>';initial-value:0deg;inherits:false}@keyframes fx-spin2{to{--a:360deg}}
.fx-rframe{position:relative;display:inline-block}.fx-rframe i{position:absolute;width:14px;height:14px;border:solid currentColor;transition:all .4s cubic-bezier(.2,.8,.2,1);opacity:.7}.fx-rframe i:nth-of-type(1){left:-10px;top:-10px;border-width:2px 0 0 2px}.fx-rframe i:nth-of-type(2){right:-10px;top:-10px;border-width:2px 2px 0 0}.fx-rframe i:nth-of-type(3){left:-10px;bottom:-10px;border-width:0 0 2px 2px}.fx-rframe i:nth-of-type(4){right:-10px;bottom:-10px;border-width:0 2px 2px 0}.fx-rframe:hover i:nth-of-type(1){left:-3px;top:-3px}.fx-rframe:hover i:nth-of-type(2){right:-3px;top:-3px}.fx-rframe:hover i:nth-of-type(3){left:-3px;bottom:-3px}.fx-rframe:hover i:nth-of-type(4){right:-3px;bottom:-3px}
.fx-rseg{position:relative;display:inline-flex;background:rgba(127,127,127,.15);border-radius:12px;padding:4px}.fx-rseg>button{position:relative;z-index:1;border:0;background:none;color:inherit;font:inherit;padding:.5em 1.1em;cursor:pointer}.fx-rseg .rb{position:absolute;top:4px;bottom:4px;border-radius:9px;background:var(--fx-rs,#7c5cff);z-index:0}
.fx-slide{position:relative;display:inline-block;width:260px;height:52px;border-radius:99px;background:rgba(127,127,127,.2);overflow:hidden;user-select:none;touch-action:none}.fx-slide .lb{position:absolute;inset:0;display:grid;place-items:center;pointer-events:none;font-weight:600;opacity:.8}.fx-slide .fl{position:absolute;left:0;top:0;bottom:0;background:var(--fx-sc,#10b981);width:0}.fx-slide .th{position:absolute;left:4px;top:4px;width:44px;height:44px;border-radius:50%;background:#fff;color:#000;display:grid;place-items:center;cursor:grab;will-change:transform}
.fx-slosh{position:relative;overflow:hidden;border-radius:18px;background:rgba(127,127,127,.12)}.fx-slosh .v{position:absolute;inset:0;display:grid;place-items:center;font-weight:800;pointer-events:none;mix-blend-mode:difference;color:#fff}
.fx-swrow{position:relative;overflow:hidden}.fx-swrow .act{position:absolute;right:0;top:0;bottom:0;display:flex}.fx-swrow .act>*{display:grid;place-items:center;padding:0 1.2em;color:#fff;border:0;font:inherit;cursor:pointer}.fx-swrow .fg{position:relative;background:var(--fx-swb,#14141d);will-change:transform;touch-action:pan-y}
.fx-toasts{position:fixed;right:16px;bottom:16px;z-index:99999;display:flex;flex-direction:column;gap:8px;align-items:flex-end}.fx-toast{padding:.8em 1.1em;border-radius:12px;background:#1b1b26;color:#fff;box-shadow:0 8px 24px rgba(0,0,0,.4);touch-action:pan-y;animation:fx-tin .45s cubic-bezier(.2,1.2,.4,1);cursor:grab;max-width:320px}@keyframes fx-tin{from{opacity:0;transform:translateX(40px) scale(.9)}}
.fx-tear{position:relative;display:inline-flex;overflow:visible}.fx-tear .stub{position:relative;transform-origin:0 100%;will-change:transform;cursor:grab;touch-action:none}.fx-tear .main{position:relative}.fx-tear .perf{position:absolute;top:-2px;bottom:-2px;width:0;border-left:2px dashed rgba(127,127,127,.55);z-index:2}
.fx-voice{display:inline-flex;align-items:center;gap:.7em;padding:.5em 1.1em;border-radius:99px;background:rgba(127,127,127,.18);cursor:pointer;border:0;color:inherit;font:inherit}.fx-voice .bars{display:inline-flex;align-items:center;gap:3px;height:1.4em}.fx-voice .bars i{width:3px;height:30%;border-radius:2px;background:currentColor;transition:height .2s}.fx-voice.on .bars i{animation:fx-bar .9s ease-in-out infinite}@keyframes fx-bar{50%{height:100%}}
.fx-wake{position:relative;display:inline-block;width:92px;height:44px;border-radius:99px;background:#0f172a;overflow:hidden;cursor:pointer;border:0;padding:0;transition:background .5s}.fx-wake.on{background:#7dd3fc}.fx-wake .orb{position:absolute;left:5px;top:5px;width:34px;height:34px;border-radius:50%;background:#e2e8f0;box-shadow:inset -8px -3px 0 #cbd5e1;transition:transform .5s cubic-bezier(.3,1.4,.5,1),background .5s,box-shadow .5s}.fx-wake.on .orb{transform:translateX(48px);background:#fde047;box-shadow:0 0 18px 6px rgba(253,224,71,.6)}.fx-wake .st{position:absolute;inset:0;background:radial-gradient(1.5px 1.5px at 20px 12px,#fff,transparent),radial-gradient(1px 1px at 40px 28px,#fff,transparent),radial-gradient(1.5px 1.5px at 62px 14px,#fff,transparent);transition:opacity .4s}.fx-wake.on .st{opacity:0}
.fx-tip{position:fixed;left:0;top:0;z-index:99999;pointer-events:none;padding:.5em .8em;border-radius:10px;background:#fff7ed;color:#7c2d12;font:600 13px system-ui;box-shadow:0 8px 22px rgba(124,45,18,.25),0 0 0 1px rgba(251,146,60,.4);opacity:0;transform:scale(.7);transition:opacity .2s,transform .35s cubic-bezier(.3,1.7,.5,1);white-space:nowrap}.fx-tip.on{opacity:1;transform:scale(1)}
.fx-status{display:inline-block;width:1.6em;height:1.6em}.fx-status svg{width:100%;height:100%;overflow:visible}.fx-status .ring{stroke-dasharray:63;stroke-dashoffset:63;transition:stroke-dashoffset .6s}.fx-status .mk{stroke-dasharray:30;stroke-dashoffset:30;transition:stroke-dashoffset .5s .35s}.fx-status[data-s=ok] .ring,.fx-status[data-s=err] .ring{stroke-dashoffset:0}.fx-status[data-s=ok] .ok,.fx-status[data-s=err] .er{stroke-dashoffset:0}.fx-status[data-s=load] svg{animation:fx-spin 1s linear infinite}.fx-status[data-s=load] .ring{stroke-dashoffset:44}
.fx-comet{position:relative;touch-action:none;cursor:grab;user-select:none}.fx-comet canvas{width:100%;height:100%;display:block}
.fx-think{display:inline-flex;flex-direction:column;gap:.5em;min-width:12em}.fx-think i{height:.7em;border-radius:99px;background:linear-gradient(90deg,rgba(127,127,127,.15) 30%,rgba(127,127,127,.5) 50%,rgba(127,127,127,.15) 70%);background-size:300% 100%;animation:fx-sk 1.4s linear infinite}@keyframes fx-sk{to{background-position:-300% 0}}
.fx-call{display:inline-flex;align-items:center;gap:.7em;border-radius:99px;background:#111;color:#fff;padding:.5em 1em;cursor:pointer;transition:padding .45s cubic-bezier(.3,1.4,.5,1),gap .3s;overflow:hidden;border:0;font:inherit}.fx-call .pu{width:.8em;height:.8em;border-radius:50%;background:#22c55e;position:relative}.fx-call .pu::after{content:'';position:absolute;inset:0;border-radius:50%;background:inherit;animation:fx-pulse 1.4s ease-out infinite}@keyframes fx-pulse{to{transform:scale(2.6);opacity:0}}.fx-call .ex{max-width:0;opacity:0;white-space:nowrap;overflow:hidden;transition:max-width .5s cubic-bezier(.2,.8,.2,1),opacity .35s}.fx-call.open .ex{max-width:16em;opacity:1}.fx-call.open{padding:.6em 1.3em}
.fx-branch{position:relative;display:inline-block}.fx-branch svg{position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible;pointer-events:none}.fx-branch svg path{fill:none;stroke:currentColor;stroke-width:1.5;opacity:.5;stroke-dasharray:var(--l);stroke-dashoffset:var(--l);transition:stroke-dashoffset .55s cubic-bezier(.2,.8,.2,1)}.fx-branch.open svg path{stroke-dashoffset:0}.fx-branch .nd{position:absolute;white-space:nowrap;opacity:0;transform:scale(.6);transition:opacity .35s,transform .5s cubic-bezier(.3,1.6,.5,1)}.fx-branch.open .nd{opacity:1;transform:none}
`;
  document.head.append(css);
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const press = (el, fn) => { el.addEventListener('click', fn); };

  register('bell-toggle', el => { el.classList.add('fx-bell'); el.setAttribute('aria-pressed', 'false'); el.setAttribute('aria-label', el.getAttribute('aria-label') || 'Notifications'); el.innerHTML = '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg><span class="dot"></span>'; press(el, () => { const on = el.getAttribute('aria-pressed') !== 'true'; el.setAttribute('aria-pressed', on); el.classList.remove('on'); el.offsetWidth; el.classList.toggle('on', on); }); });

  // Segmented code entry (OTP). Fires fx-complete with the code.
  register('code-slots', el => { const o = U.opts(el, { n: 6, numeric: true }); el.classList.add('fx-slots'); const I = []; for (let i = 0; i < o.n; i++) { const x = document.createElement('input'); x.maxLength = 1; x.inputMode = o.numeric ? 'numeric' : 'text'; x.autocomplete = i ? 'off' : 'one-time-code'; x.setAttribute('aria-label', `Digit ${i + 1}`); el.append(x); I.push(x); }
    I.forEach((x, i) => { x.addEventListener('input', () => { if (o.numeric) x.value = x.value.replace(/\D/g, ''); if (x.value) { x.classList.remove('pop'); x.offsetWidth; x.classList.add('pop'); I[i + 1] ? I[i + 1].focus() : 0; } const code = I.map(a => a.value).join(''); if (code.length === o.n) el.dispatchEvent(new CustomEvent('fx-complete', { detail: code })); }); x.addEventListener('keydown', e => { if (e.key === 'Backspace' && !x.value && I[i - 1]) I[i - 1].focus(); if (e.key === 'ArrowLeft' && I[i - 1]) I[i - 1].focus(); if (e.key === 'ArrowRight' && I[i + 1]) I[i + 1].focus(); }); x.addEventListener('paste', e => { const t = (e.clipboardData.getData('text') || '').replace(o.numeric ? /\D/g : /\s/g, '').slice(0, o.n); if (!t) return; e.preventDefault(); [...t].forEach((c, k) => { I[k].value = c; }); I[Math.min(t.length, o.n - 1)].focus(); if (t.length === o.n) el.dispatchEvent(new CustomEvent('fx-complete', { detail: t })); }); }); });

  // Draggable dial knob with a glowing comet tail. el needs a size. el.value 0..100; fires fx-input.
  register('comet-dial', el => { const o = U.opts(el, { color: '#7c5cff', value: 30, tail: 1.6 }); el.classList.add('fx-comet'); const { ctx, size } = U.canvasIn(el); el.setAttribute('role', 'slider'); el.tabIndex = 0; let v = o.value, a = 0, d = false; const ang = x => -Math.PI * 1.25 + x / 100 * Math.PI * 1.5;
    const set = e => { const l = U.local(el, e); let t = Math.atan2(l.y - l.h / 2, l.x - l.w / 2); let n = (t + Math.PI * 1.25) / (Math.PI * 1.5); if (n < -.08) n += 2 * Math.PI / (Math.PI * 1.5); v = U.clamp(n * 100, 0, 100); }; el.addEventListener('pointerdown', e => { d = true; el.setPointerCapture(e.pointerId); set(e); }); el.addEventListener('pointermove', e => d && set(e)); el.addEventListener('pointerup', () => d = false); el.addEventListener('keydown', e => { if (e.key === 'ArrowRight' || e.key === 'ArrowUp') v = Math.min(100, v + 2); if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') v = Math.max(0, v - 2); }); a = v;
    return U.loop(el, () => { a = U.lerp(a, v, .2); const dd = size.dpr; ctx.setTransform(dd, 0, 0, dd, 0, 0); ctx.clearRect(0, 0, size.w, size.h); const cx = size.w / 2, cy = size.h / 2, R = Math.min(cx, cy) * .78; ctx.lineCap = 'round'; ctx.lineWidth = 8; ctx.strokeStyle = 'rgba(127,127,127,.25)'; ctx.beginPath(); ctx.arc(cx, cy, R, ang(0), ang(100)); ctx.stroke(); const end = ang(a), spd = Math.abs(a - v) / 100; const L = .5 + spd * 4 + o.tail * a / 100 * .6; for (let i = 0; i < 24; i++) { const k = i / 24; ctx.strokeStyle = o.color; ctx.globalAlpha = (1 - k) * .85; ctx.lineWidth = 9 * (1 - k * .8); ctx.beginPath(); ctx.arc(cx, cy, R, Math.max(ang(0), end - k * L), Math.max(ang(0), end - (k + .04) * L)); ctx.stroke(); } ctx.globalAlpha = 1; ctx.fillStyle = '#fff'; ctx.shadowColor = o.color; ctx.shadowBlur = 16; ctx.beginPath(); ctx.arc(cx + Math.cos(end) * R, cy + Math.sin(end) * R, 9, 0, 6.283); ctx.fill(); ctx.shadowBlur = 0; ctx.fillStyle = 'currentColor'; ctx.fillStyle = getComputedStyle(el).color; ctx.font = `700 ${R * .5}px system-ui`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(Math.round(a), cx, cy); el.setAttribute('aria-valuenow', Math.round(v)); el.value = v; el.dispatchEvent(new CustomEvent('fx-input', { detail: v })); }); });

  // Elements dodge the cursor when it gets close (children or itself)
  register('dodge-field', el => { if (!U.fine || U.RM) return; const o = U.opts(el, { radius: 110, force: 90, self: false }); const kids = o.self ? [el] : [...el.children]; const st = kids.map(() => ({ x: 0, y: 0 })); const mv = e => kids.forEach((k, i) => { const r = k.getBoundingClientRect(), cx = r.left + r.width / 2 - st[i].x, cy = r.top + r.height / 2 - st[i].y, dx = cx - e.clientX, dy = cy - e.clientY, d = Math.hypot(dx, dy); if (d < o.radius) { const f = (1 - d / o.radius) * o.force; st[i].x = dx / (d || 1) * f; st[i].y = dy / (d || 1) * f; } else { st[i].x *= .0; st[i].y *= .0; } k.style.transition = 'transform .35s cubic-bezier(.3,1.5,.5,1)'; k.style.transform = `translate(${st[i].x}px,${st[i].y}px)`; }); el.addEventListener('pointermove', mv); el.addEventListener('pointerleave', () => kids.forEach(k => k.style.transform = '')); });

  // Click to fly the plane icon away, then show "Sent" and reset. Fires fx-sent.
  register('flying-button', el => { const o = U.opts(el, { label: el.textContent.trim() || 'Send', done: 'Sent' }); el.classList.add('fx-fly'); el.innerHTML = `<span class="pl">✈</span><span class="tx">${o.label}</span>`; const tx = el.querySelector('.tx'); press(el, async () => { if (el.classList.contains('go')) return; el.classList.add('go'); tx.textContent = o.done; el.dispatchEvent(new CustomEvent('fx-sent')); await sleep(1800); el.classList.remove('go'); tx.textContent = o.label; }); });

  // Folder with a gentle float; files fan out on hover (folder-float builds on folder)
  register('folder-float', el => { FX.run('folder', el); el.style.animation = 'fx-bob 3s ease-in-out infinite'; if (!document.getElementById('fx-bob')) { const s = document.createElement('style'); s.id = 'fx-bob'; s.textContent = '@keyframes fx-bob{50%{transform:translateY(-8px)}}'; document.head.append(s); } });

  // Click starts a burning fuse; when it reaches the end, the action fires (click again to defuse). Fires fx-boom.
  register('fuse-button', el => { const o = U.opts(el, { ms: 1800 }); el.classList.add('fx-fuse'); const f = document.createElement('span'); f.className = 'fu'; const sp = document.createElement('span'); sp.className = 'sp'; el.append(f, sp); const label = el.textContent; let t0 = 0, raf = 0, on = false; const tick = n => { const k = Math.min(1, (n - t0) / o.ms); f.style.transform = `scaleX(${1 - k})`; sp.style.left = (1 - k) * el.clientWidth - 5 + 'px'; sp.style.opacity = 1; if (k >= 1) { on = false; sp.style.opacity = 0; el.dispatchEvent(new CustomEvent('fx-boom')); el.style.transition = 'transform .15s'; el.style.transform = 'scale(1.12)'; setTimeout(() => el.style.transform = '', 150); } else raf = requestAnimationFrame(tick); };
    press(el, () => { on = !on; cancelAnimationFrame(raf); if (on) { f.style.transform = 'scaleX(1)'; t0 = performance.now(); raf = requestAnimationFrame(tick); } else { f.style.transform = 'scaleX(0)'; sp.style.opacity = 0; } }); });

  // Custom select with a highlight that glides between options. Children = options. fires fx-input with the index.
  register('glide-select', el => { el.classList.add('fx-gsel'); el.setAttribute('role', 'listbox'); const bx = document.createElement('span'); bx.className = 'bx'; el.prepend(bx); const opts = [...el.children].filter(c => c !== bx); opts.forEach(c => { c.setAttribute('role', 'option'); c.tabIndex = 0; }); const sel = i => { opts.forEach((c, k) => c.setAttribute('aria-selected', k === i)); const c = opts[i]; bx.style.top = c.offsetTop + 'px'; bx.style.height = c.offsetHeight + 'px'; el.value = i; el.dispatchEvent(new CustomEvent('fx-input', { detail: i })); }; opts.forEach((c, i) => { c.addEventListener('click', () => sel(i)); c.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') sel(i); }); c.addEventListener('pointerenter', () => { bx.style.top = c.offsetTop + 'px'; bx.style.height = c.offsetHeight + 'px'; bx.style.opacity = .6; }); }); el.addEventListener('pointerleave', () => { const i = opts.findIndex(c => c.getAttribute('aria-selected') === 'true'); bx.style.opacity = 1; if (i >= 0) { bx.style.top = opts[i].offsetTop + 'px'; bx.style.height = opts[i].offsetHeight + 'px'; } }); requestAnimationFrame(() => sel(0)); });

  // Radio group whose pill stretches like jelly as it moves. Children = options.
  register('jelly-radio', el => { el.classList.add('fx-jelly'); el.setAttribute('role', 'radiogroup'); const jb = document.createElement('span'); jb.className = 'jb'; el.prepend(jb); const k = [...el.children].filter(c => c !== jb); let cur = 0, x = 0, w = 0, tx = 0, tw = 0, vx = 0;
    const sel = i => { cur = i; k.forEach((c, n) => { c.setAttribute('role', 'radio'); c.setAttribute('aria-checked', n === i); c.style.color = n === i ? '#fff' : ''; c.tabIndex = n === i ? 0 : -1; }); tx = k[i].offsetLeft; tw = k[i].offsetWidth; el.dispatchEvent(new CustomEvent('fx-input', { detail: i })); }; k.forEach((c, i) => c.addEventListener('click', () => sel(i))); el.addEventListener('keydown', e => { if (e.key === 'ArrowRight') sel(Math.min(k.length - 1, cur + 1)); if (e.key === 'ArrowLeft') sel(Math.max(0, cur - 1)); }); sel(0); x = tx; w = tw;
    return U.loop(el, () => { vx += (tx - x) * .12; vx *= .72; x += vx; w = U.lerp(w, tw + Math.abs(vx) * 3.2, .3); jb.style.left = x - Math.abs(vx) * 1.4 + 'px'; jb.style.width = w + 'px'; jb.style.transform = `scaleY(${1 - Math.min(.25, Math.abs(vx) * .02)})`; }); });

  // Grid loader of diamonds pulsing in a diagonal wave
  register('lattice-loader', el => { const o = U.opts(el, { n: 5 }); el.classList.add('fx-lat'); el.style.setProperty('--n', o.n); el.setAttribute('role', 'status'); el.setAttribute('aria-label', 'Loading'); for (let r = 0; r < o.n; r++) for (let c = 0; c < o.n; c++) { const i = document.createElement('i'); i.style.animationDelay = (r + c) * .1 + 's'; el.append(i); } });

  // Star rating with hover preview and bounce. fires fx-input
  register('peek-rating', el => { const o = U.opts(el, { n: 5, value: 0 }); el.classList.add('fx-star'); el.setAttribute('role', 'radiogroup'); let v = o.value; const S = []; for (let i = 1; i <= o.n; i++) { const s = document.createElement('span'); s.textContent = '★'; s.setAttribute('role', 'radio'); s.setAttribute('aria-label', i + ' star'); s.tabIndex = 0; el.append(s); S.push(s); s.addEventListener('pointerenter', () => paint(i, true)); s.addEventListener('click', () => { v = i; paint(i); el.dispatchEvent(new CustomEvent('fx-input', { detail: v })); S.forEach((x, k) => { if (k < i) { x.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.5) rotate(-12deg)' }, { transform: 'scale(1)' }], { duration: 380, delay: k * 50, easing: 'cubic-bezier(.3,1.6,.5,1)' }); } }); }); s.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') s.click(); }); } const paint = (n, hover) => S.forEach((s, k) => { s.classList.toggle('f', k < n); s.classList.toggle('h', !!hover && k === n - 1); }); el.addEventListener('pointerleave', () => paint(v)); paint(v); });

  // AI prompt bar: animated gradient border, typing placeholder, send button. fires fx-submit with text.
  register('prompt-bar', el => { const o = U.opts(el, { placeholders: ['Ask anything…', 'Summarise this page', 'Write a launch email'], send: '↑' }); el.classList.add('fx-prompt'); el.innerHTML = `<input type="text" aria-label="Prompt"><button type="button" aria-label="Send">${o.send}</button>`; const inp = el.querySelector('input'), b = el.querySelector('button'); let alive = true; (async () => { let i = 0; while (alive && !U.RM) { const t = o.placeholders[i++ % o.placeholders.length]; for (let k = 0; k <= t.length && alive; k++) { if (document.activeElement === inp || inp.value) break; inp.placeholder = t.slice(0, k); await sleep(55); } await sleep(1600); } if (U.RM) inp.placeholder = o.placeholders[0]; })(); const go = () => { if (!inp.value.trim()) return; el.dispatchEvent(new CustomEvent('fx-submit', { detail: inp.value })); inp.value = ''; }; b.addEventListener('click', go); inp.addEventListener('keydown', e => e.key === 'Enter' && go()); return () => alive = false; });

  // Viewfinder corners that tighten onto the content on hover/focus
  register('refine-frame', el => { el.classList.add('fx-rframe'); for (let i = 0; i < 4; i++) el.append(document.createElement('i')); el.tabIndex = el.tabIndex < 0 ? 0 : el.tabIndex; });

  // Segmented control with an indicator that rubber-bands. Children = <button>s. fires fx-input
  register('rubber-segment', el => { el.classList.add('fx-rseg'); const rb = document.createElement('span'); rb.className = 'rb'; el.prepend(rb); const k = [...el.children].filter(c => c !== rb); let x = 0, w = 0, tx = 0, tw = 0, vx = 0, vw = 0, cur = 0; const sel = i => { cur = i; k.forEach((c, n) => { c.setAttribute('aria-pressed', n === i); c.style.color = n === i ? '#fff' : ''; }); tx = k[i].offsetLeft; tw = k[i].offsetWidth; el.dispatchEvent(new CustomEvent('fx-input', { detail: i })); }; k.forEach((c, i) => c.addEventListener('click', () => sel(i))); sel(0); x = tx; w = tw;
    return U.loop(el, () => { vx += (tx - x) * .2; vx *= .62; x += vx; vw += (tw - w) * .2; vw *= .62; w += vw; rb.style.left = x + 'px'; rb.style.width = Math.max(10, w + Math.abs(vx) * 2.5) + 'px'; }); });

  // Slide to confirm. Fires fx-confirm and resets after a moment.
  register('slide-commit', el => { const o = U.opts(el, { label: 'Slide to confirm', done: 'Confirmed ✓' }); el.classList.add('fx-slide'); el.innerHTML = `<div class="fl"></div><div class="lb">${o.label}</div><div class="th" role="slider" tabindex="0" aria-label="${o.label}">→</div>`; const th = el.querySelector('.th'), fl = el.querySelector('.fl'), lb = el.querySelector('.lb'); let x = 0, d = false, done = false; const max = () => el.clientWidth - th.offsetWidth - 8; const draw = () => { th.style.transform = `translateX(${x}px)`; fl.style.width = x + th.offsetWidth / 2 + 4 + 'px'; lb.style.opacity = Math.max(0, .8 - x / max() * 1.3); };
    const fin = () => { done = true; el.dispatchEvent(new CustomEvent('fx-confirm')); lb.textContent = o.done; lb.style.opacity = 1; lb.style.color = '#fff'; setTimeout(() => { done = false; x = 0; lb.textContent = o.label; lb.style.color = ''; th.style.transition = fl.style.transition = 'all .4s'; draw(); setTimeout(() => th.style.transition = fl.style.transition = '', 420); }, 1500); };
    th.addEventListener('pointerdown', e => { if (done) return; d = true; th.setPointerCapture(e.pointerId); th.style.cursor = 'grabbing'; }); th.addEventListener('pointermove', e => { if (!d) return; x = U.clamp(U.local(el, e).x - th.offsetWidth / 2 - 4, 0, max()); draw(); }); const up = () => { if (!d) return; d = false; th.style.cursor = 'grab'; if (x > max() * .92) { x = max(); draw(); fin(); } else { x = 0; th.style.transition = fl.style.transition = 'all .35s'; draw(); setTimeout(() => th.style.transition = fl.style.transition = '', 360); } }; th.addEventListener('pointerup', up); th.addEventListener('pointercancel', up); th.addEventListener('keydown', e => { if (e.key === 'Enter') { x = max(); draw(); fin(); } }); });

  // Drag the button back like a slingshot; release flings it and it springs home. fires fx-fling
  register('sling-button', el => { const o = U.opts(el, { power: .22, max: 120 }); el.style.position = el.style.position || 'relative'; el.style.touchAction = 'none'; let sx = 0, sy = 0, x = 0, y = 0, vx = 0, vy = 0, d = false; const NS = 'http://www.w3.org/2000/svg'; const svg = document.createElementNS(NS, 'svg'); svg.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9997'; const ln = document.createElementNS(NS, 'line'); ln.setAttribute('stroke', 'currentColor'); ln.setAttribute('stroke-width', 3); ln.setAttribute('stroke-linecap', 'round'); ln.setAttribute('stroke-dasharray', '1 6'); svg.append(ln); document.body.append(svg); svg.style.opacity = 0; let ox = 0, oy = 0;
    el.addEventListener('pointerdown', e => { d = true; el.setPointerCapture(e.pointerId); sx = e.clientX; sy = e.clientY; const r = el.getBoundingClientRect(); ox = r.left + r.width / 2 - x; oy = r.top + r.height / 2 - y; svg.style.opacity = 1; }); el.addEventListener('pointermove', e => { if (!d) return; x = e.clientX - sx; y = e.clientY - sy; const l = Math.hypot(x, y); if (l > o.max) { x *= o.max / l; y *= o.max / l; } ln.setAttribute('x1', ox); ln.setAttribute('y1', oy); ln.setAttribute('x2', ox + x); ln.setAttribute('y2', oy + y); el.style.transform = `translate(${x}px,${y}px)`; });
    const up = () => { if (!d) return; d = false; svg.style.opacity = 0; vx = -x * o.power * 2.4; vy = -y * o.power * 2.4; el.dispatchEvent(new CustomEvent('fx-fling', { detail: { vx, vy } })); };
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up); return U.loop(document.documentElement, () => { if (d) return; if (Math.abs(x) + Math.abs(y) + Math.abs(vx) + Math.abs(vy) < .05) { if (x || y) { x = y = 0; el.style.transform = ''; } return; } vx += -x * .08; vy += -y * .08; vx *= .86; vy *= .86; x += vx; y += vy; el.style.transform = `translate(${x}px,${y}px)`; }); });

  // Liquid gauge: a wave fills to data-value (0-100) and sloshes with the cursor. el.fxSet(n) updates it.
  register('slosh-gauge', el => { const o = U.opts(el, { value: 60, color: '#38bdf8' }); el.classList.add('fx-slosh'); const { ctx, size } = U.canvasIn(el); const lab = document.createElement('div'); lab.className = 'v'; el.append(lab); let v = 0, tv = o.value, slosh = 0, vs = 0, tilt = 0; el.fxSet = n => tv = n; el.addEventListener('pointermove', e => { tilt = (U.local(el, e).nx - .5) * 2; }); el.addEventListener('pointerleave', () => tilt = 0); el.setAttribute('role', 'meter'); el.setAttribute('aria-valuemin', 0); el.setAttribute('aria-valuemax', 100);
    return U.loop(el, (t) => { v = U.lerp(v, tv, .04); vs += (tilt * 18 - slosh) * .08; vs *= .88; slosh += vs; const d = size.dpr; ctx.setTransform(d, 0, 0, d, 0, 0); ctx.clearRect(0, 0, size.w, size.h); const y = size.h * (1 - v / 100); [[.35, 1.0, .5], [1, 1.6, 1]].forEach(([a, f, al], i) => { ctx.fillStyle = o.color; ctx.globalAlpha = al * (i ? .9 : .5); ctx.beginPath(); ctx.moveTo(0, size.h); for (let x = 0; x <= size.w; x += 4) ctx.lineTo(x, y + Math.sin(x * .025 * f + t * (1.6 + i)) * (4 + Math.abs(vs) * 6) * (1 + i * .3) + (x / size.w - .5) * slosh); ctx.lineTo(size.w, size.h); ctx.fill(); }); lab.textContent = Math.round(v) + '%'; el.setAttribute('aria-valuenow', Math.round(v)); }); });

  // Animated status icon: set data-s="load|ok|err" (or el.fxSet('ok')). Check/cross draw themselves.
  register('status-mark', el => { el.classList.add('fx-status'); el.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle class="ring" cx="12" cy="12" r="10"/><path class="mk ok" d="M7 12.5l3.2 3.2L17 9"/><path class="mk er" d="M8.5 8.5l7 7M15.5 8.5l-7 7"/></svg>'; el.setAttribute('role', 'img'); const set = s => { el.dataset.s = s; el.setAttribute('aria-label', { load: 'Loading', ok: 'Success', err: 'Error' }[s] || ''); el.style.color = s === 'ok' ? '#22c55e' : s === 'err' ? '#ef4444' : ''; }; el.fxSet = set; set(el.dataset.s || 'load'); });

  // Row you swipe left to reveal actions. Child 1 = row content; others = action buttons.
  register('swipe-row', el => { const o = U.opts(el, { snap: 0 }); el.classList.add('fx-swrow'); const [fg, ...acts] = [...el.children]; fg.classList.add('fg'); const a = document.createElement('div'); a.className = 'act'; acts.forEach(x => a.append(x)); el.prepend(a); const W = () => a.offsetWidth; let x = 0, sx = 0, d = false, base = 0; fg.addEventListener('pointerdown', e => { d = true; sx = e.clientX; base = x; fg.setPointerCapture(e.pointerId); fg.style.transition = 'none'; }); fg.addEventListener('pointermove', e => { if (!d) return; x = U.clamp(base + e.clientX - sx, -W() - 24, 0); fg.style.transform = `translateX(${x}px)`; }); const up = () => { if (!d) return; d = false; fg.style.transition = 'transform .4s cubic-bezier(.2,.9,.3,1.2)'; x = x < -W() / 2 ? -W() : 0; fg.style.transform = `translateX(${x}px)`; }; fg.addEventListener('pointerup', up); fg.addEventListener('pointercancel', up); });

  // Toasts you can swipe away. FX.toast('Saved', {ms:3500}) — also a global helper.
  FX.toast = (msg, o = {}) => { let box = document.querySelector('.fx-toasts'); if (!box) { box = document.createElement('div'); box.className = 'fx-toasts'; box.setAttribute('role', 'status'); box.setAttribute('aria-live', 'polite'); document.body.append(box); } const t = document.createElement('div'); t.className = 'fx-toast'; t.textContent = msg; box.append(t); let sx = 0, x = 0, d = false, timer; const kill = dir => { clearTimeout(timer); t.style.transition = 'transform .35s,opacity .35s'; t.style.transform = `translateX(${dir * 140}%)`; t.style.opacity = 0; setTimeout(() => t.remove(), 360); }; timer = setTimeout(() => kill(1), o.ms || 3500);
    t.addEventListener('pointerdown', e => { d = true; sx = e.clientX; t.setPointerCapture(e.pointerId); clearTimeout(timer); t.style.animation = 'none'; t.style.transition = 'none'; }); t.addEventListener('pointermove', e => { if (!d) return; x = e.clientX - sx; t.style.transform = `translateX(${x}px)`; t.style.opacity = 1 - Math.abs(x) / 260; }); t.addEventListener('pointerup', () => { d = false; if (Math.abs(x) > 80) kill(Math.sign(x)); else { t.style.transition = 'transform .3s,opacity .3s'; t.style.transform = ''; t.style.opacity = 1; timer = setTimeout(() => kill(1), 1800); } x = 0; }); return t; };
  register('swipe-toast', el => { const o = U.opts(el, { msg: 'Saved ✓' }); el.addEventListener('click', () => FX.toast(el.dataset.msg || o.msg, o)); });

  // Ticket with a perforated stub you drag to tear off. Children: main part, stub. fires fx-tear
  register('tear-ticket', el => { el.classList.add('fx-tear'); const [main, stub] = el.children; main.classList.add('main'); stub.classList.add('stub'); const perf = document.createElement('i'); perf.className = 'perf'; el.append(perf); const place = () => perf.style.left = main.offsetWidth - 1 + 'px'; place(); let d = false, sy = 0, y = 0, torn = false, vy = 0, rot = 0; stub.addEventListener('pointerdown', e => { if (torn) return; d = true; sy = e.clientY; stub.setPointerCapture(e.pointerId); stub.style.cursor = 'grabbing'; }); stub.addEventListener('pointermove', e => { if (!d) return; y = Math.max(0, e.clientY - sy); rot = Math.min(24, y * .35); stub.style.transform = `translateY(${y * .5}px) rotate(${rot}deg)`; }); const up = () => { if (!d) return; d = false; stub.style.cursor = 'grab'; if (y > 46) { torn = true; el.dispatchEvent(new CustomEvent('fx-tear')); stub.style.transition = 'transform .8s cubic-bezier(.5,0,.9,.4),opacity .8s'; stub.style.transform = `translate(30px,260px) rotate(50deg)`; stub.style.opacity = 0; setTimeout(() => { stub.style.visibility = 'hidden'; }, 820); } else { stub.style.transition = 'transform .4s cubic-bezier(.3,1.6,.5,1)'; stub.style.transform = ''; setTimeout(() => stub.style.transition = '', 420); } y = 0; }; stub.addEventListener('pointerup', up); stub.addEventListener('pointercancel', up); });

  // "Thinking" skeleton lines with a shimmer. data-opts {"lines":3,"label":"Thinking"}
  register('thought-line', el => { const o = U.opts(el, { lines: 3, label: '' }); el.classList.add('fx-think'); el.setAttribute('role', 'status'); el.setAttribute('aria-label', o.label || 'Thinking'); for (let i = 0; i < o.lines; i++) { const b = document.createElement('i'); b.style.width = 100 - i * 18 + '%'; b.style.animationDelay = i * .12 + 's'; el.append(b); } });

  // Pill with live audio-style bars; click toggles listening. fires fx-input (true/false)
  register('voice-pill', el => { const o = U.opts(el, { label: 'Listen', live: 'Listening…', bars: 5 }); el.classList.add('fx-voice'); el.setAttribute('aria-pressed', 'false'); el.innerHTML = `<span class="bars">${'<i></i>'.repeat(o.bars)}</span><span class="tx">${o.label}</span>`; el.querySelectorAll('.bars i').forEach((b, i) => b.style.animationDelay = i * .12 + 's'); const tx = el.querySelector('.tx'); press(el, () => { const on = !el.classList.contains('on'); el.classList.toggle('on', on); el.setAttribute('aria-pressed', on); tx.textContent = on ? o.live : o.label; el.dispatchEvent(new CustomEvent('fx-input', { detail: on })); }); });

  // Day/night toggle: moon becomes sun. aria-pressed = day. fires fx-input (true=day)
  register('wake-slider', el => { el.classList.add('fx-wake'); el.setAttribute('role', 'switch'); el.setAttribute('aria-checked', 'false'); el.setAttribute('aria-label', 'Day or night'); el.innerHTML = '<span class="st"></span><span class="orb"></span>'; press(el, () => { const on = !el.classList.contains('on'); el.classList.toggle('on', on); el.setAttribute('aria-checked', on); el.dispatchEvent(new CustomEvent('fx-input', { detail: on })); }); });

  // Warm tooltip that springs in near the cursor. Add data-tip="Text" to any element (put data-fx="warm-tooltip" on a container or the element).
  register('warm-tooltip', el => { const tip = document.querySelector('.fx-tip') || (() => { const t = document.createElement('div'); t.className = 'fx-tip'; t.setAttribute('role', 'tooltip'); document.body.append(t); return t; })(); const targets = el.dataset.tip ? [el] : U.$$('[data-tip]', el); const mv = e => { tip.style.transform = `translate(${e.clientX + 14}px,${e.clientY + 16}px) scale(${tip.classList.contains('on') ? 1 : .7})`; }; targets.forEach(t => { t.addEventListener('pointerenter', e => { tip.textContent = t.dataset.tip; tip.classList.add('on'); mv(e); }); t.addEventListener('pointermove', mv); t.addEventListener('pointerleave', () => tip.classList.remove('on')); t.addEventListener('focus', () => { const r = t.getBoundingClientRect(); tip.textContent = t.dataset.tip; tip.classList.add('on'); tip.style.transform = `translate(${r.left}px,${r.bottom + 8}px)`; }); t.addEventListener('blur', () => tip.classList.remove('on')); }); });

  // Pill that expands to show call details (dynamic-island style). Child text becomes the expanded content. fires fx-input
  register('call-chip', el => { const o = U.opts(el, { name: el.textContent.trim() || 'Ada Lovelace', status: '00:00' }); el.classList.add('fx-call'); el.setAttribute('aria-expanded', 'false'); el.innerHTML = `<span class="pu"></span><span class="nm">${o.name}</span><span class="ex"><span class="tm">${o.status}</span> · tap to end</span>`; const tm = el.querySelector('.tm'); let s = 0, id = 0; press(el, () => { const on = !el.classList.contains('open'); el.classList.toggle('open', on); el.setAttribute('aria-expanded', on); clearInterval(id); if (on) { s = 0; id = setInterval(() => { s++; tm.textContent = String(s / 60 | 0).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); }, 1000); } }); return () => clearInterval(id); });

  // Root button that grows a tree of options along curved branches. data-opts {"items":["Docs","API","Blog"]}
  register('branched-menu', el => { const o = U.opts(el, { items: ['Docs', 'API', 'Blog', 'Status'], dx: 120, dy: 44, label: el.textContent.trim() || 'Menu' }); el.classList.add('fx-branch'); el.innerHTML = ''; const root = document.createElement('button'); root.type = 'button'; root.textContent = o.label; root.style.cssText = 'font:inherit;color:inherit;background:rgba(127,127,127,.2);border:1px solid currentColor;border-radius:99px;padding:.5em 1.1em;cursor:pointer;position:relative;z-index:2'; root.setAttribute('aria-expanded', 'false'); el.append(root); const NS = 'http://www.w3.org/2000/svg'; const svg = document.createElementNS(NS, 'svg'); el.append(svg); const nodes = o.items.map((t, i) => { const n = document.createElement('a'); n.className = 'nd'; n.href = '#'; n.textContent = t; n.style.cssText += `left:${o.dx + 20}px;top:${(i - (o.items.length - 1) / 2) * o.dy}px;transition-delay:${i * 70}ms;color:inherit;text-decoration:none;padding:.3em .8em;border:1px solid currentColor;border-radius:8px;margin-top:.4em`; el.append(n); return n; });
    const draw = () => { const rb = root.getBoundingClientRect(), eb = el.getBoundingClientRect(); const sx = rb.width, sy = rb.height / 2; svg.innerHTML = ''; nodes.forEach((n, i) => { const nb = n.getBoundingClientRect(); const ex = nb.left - eb.left, ey = nb.top - eb.top + nb.height / 2; const p = document.createElementNS(NS, 'path'); p.setAttribute('d', `M${sx} ${sy} C${sx + 60} ${sy},${ex - 60} ${ey},${ex} ${ey}`); svg.append(p); const L = 400; p.style.setProperty('--l', L); p.style.transitionDelay = i * 70 + 'ms'; }); }; root.addEventListener('click', () => { const on = !el.classList.contains('open'); if (on) draw(); el.classList.toggle('open', on); root.setAttribute('aria-expanded', on); }); el.style.minHeight = o.items.length * o.dy + 'px'; el.style.display = 'inline-block'; el.style.minWidth = o.dx + 140 + 'px'; root.style.marginTop = (o.items.length * o.dy) / 2 - 18 + 'px'; });

  // Delete animation: the element is crumpled into a ball and tossed. Click the element (or call el.fxCrumple()). fires fx-gone
  register('paper-crumple', el => { const go = async () => { if (el._gone) return; el._gone = true; el.style.transition = 'transform .35s cubic-bezier(.5,0,.3,1),filter .35s,border-radius .35s,clip-path .35s'; el.style.transformOrigin = '50% 50%'; el.style.transform = 'scale(.82,.9) rotate(-4deg) skewX(6deg)'; el.style.filter = 'contrast(1.25) brightness(.9)'; await sleep(260); el.style.clipPath = 'polygon(8% 12%,40% 0,70% 10%,96% 30%,90% 70%,60% 96%,25% 92%,2% 62%)'; el.style.transform = 'scale(.35) rotate(40deg)'; el.style.borderRadius = '50%'; await sleep(360); el.style.transition = 'transform .7s cubic-bezier(.4,-.4,.9,.6),opacity .7s'; el.style.transform = 'translate(160px,-120px) scale(.2) rotate(560deg)'; el.style.opacity = 0; await sleep(720); el.dispatchEvent(new CustomEvent('fx-gone')); el.style.visibility = 'hidden'; }; el.fxCrumple = go; el.addEventListener('click', go); });

  // Delete animation: the element is cut into vertical strips that drop. el.fxShred() or click. fires fx-gone
  register('shredder', el => { const o = U.opts(el, { strips: 12, trigger: 'click' }); const run = async () => { if (el._gone) return; el._gone = true; const r = el.getBoundingClientRect(); const host = document.createElement('div'); host.style.cssText = `position:fixed;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;z-index:9996;pointer-events:none`; document.body.append(host); const w = r.width / o.strips; for (let i = 0; i < o.strips; i++) { const s = document.createElement('div'); s.style.cssText = `position:absolute;left:${i * w}px;top:0;width:${w + .5}px;height:100%;overflow:hidden;transition:transform ${.8 + Math.random() * .5}s cubic-bezier(.5,0,.9,.5) ${i * 30}ms,opacity .9s ${i * 30}ms`; const c = el.cloneNode(true); c.removeAttribute('data-fx'); c.style.cssText += `;position:absolute;left:${-i * w}px;top:0;width:${r.width}px;height:${r.height}px;margin:0`; s.append(c); host.append(s); requestAnimationFrame(() => requestAnimationFrame(() => { s.style.transform = `translateY(${r.height + 120}px) rotate(${U.rand(-9, 9)}deg)`; s.style.opacity = 0; })); } el.style.visibility = 'hidden'; setTimeout(() => { host.remove(); el.dispatchEvent(new CustomEvent('fx-gone')); }, 1700); }; el.fxShred = run; if (o.trigger === 'click') el.addEventListener('click', run); });
})();

/* ===================== MAGIC-STYLE: PATTERNS, BORDERS, BEAMS, PARTICLES ===================== */
(function () {
  const { register, util: U } = FX; const NS = 'http://www.w3.org/2000/svg';
  const css = document.createElement('style'); css.id = 'fx-magic1-css';
  css.textContent = `
.fx-pat{position:absolute;inset:0;pointer-events:none;z-index:0}
.fx-meteor{position:absolute;top:var(--t);left:var(--l);width:var(--sz,2px);height:var(--sz,2px);border-radius:99px;background:var(--fx-mc,#94a3b8);box-shadow:0 0 0 1px rgba(255,255,255,.08);transform:rotate(215deg);animation:fx-met var(--d) linear var(--del) infinite;opacity:0}
.fx-meteor::before{content:'';position:absolute;top:50%;transform:translateY(-50%);width:var(--len,50px);height:1px;background:linear-gradient(90deg,var(--fx-mc,#94a3b8),transparent)}
@keyframes fx-met{0%{opacity:1;transform:rotate(215deg) translateX(0)}70%{opacity:1}100%{opacity:0;transform:rotate(215deg) translateX(-520px)}}
.fx-ripple-bg{position:absolute;inset:0;pointer-events:none;overflow:hidden}.fx-ripple-bg i{position:absolute;left:50%;top:50%;border-radius:50%;border:1px solid var(--fx-rc,rgba(255,255,255,.25));background:var(--fx-rf,rgba(255,255,255,.03));transform:translate(-50%,-50%) scale(1);animation:fx-rip var(--rd,3.2s) ease-in-out infinite;animation-delay:var(--dl)}
@keyframes fx-rip{0%,100%{transform:translate(-50%,-50%) scale(1)}50%{transform:translate(-50%,-50%) scale(.9)}}
.fx-bbeam{position:relative}.fx-bbeam::after{content:'';position:absolute;inset:0;border-radius:inherit;padding:var(--fx-bw,2px);background:conic-gradient(from var(--ba,0deg),transparent 0 70%,var(--fx-b1,#7c5cff),var(--fx-b2,#22d3ee) 90%,transparent);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;animation:fx-bba var(--fx-bd,6s) linear infinite;pointer-events:none}
@property --ba{syntax:'<angle>';initial-value:0deg;inherits:false}@keyframes fx-bba{to{--ba:360deg}}
.fx-shineb{position:relative}.fx-shineb::after{content:'';position:absolute;inset:0;border-radius:inherit;padding:var(--fx-bw,1.5px);background:radial-gradient(transparent,transparent,var(--c1,#7c5cff),var(--c2,#22d3ee),var(--c3,#f472b6),transparent,transparent);background-size:300% 300%;-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;animation:fx-shn var(--fx-bd,10s) linear infinite;pointer-events:none}
@keyframes fx-shn{0%{background-position:0 0}50%{background-position:100% 100%}100%{background-position:0 0}}
.fx-neon{position:relative;border-radius:var(--fx-nr,20px);isolation:isolate}.fx-neon::before{content:'';position:absolute;inset:calc(var(--fx-nb,2px)*-1);border-radius:inherit;background:linear-gradient(115deg,var(--n1,#ff2975),var(--n2,#00fff1));z-index:-2;background-size:100% 200%;animation:fx-neon 4s linear infinite}.fx-neon::after{content:'';position:absolute;inset:calc(var(--fx-nb,2px)*-1);border-radius:inherit;background:inherit;background:linear-gradient(115deg,var(--n1,#ff2975),var(--n2,#00fff1));filter:blur(22px);opacity:.55;z-index:-3;animation:fx-neon 4s linear infinite;background-size:100% 200%}
.fx-neon>.fx-in{position:relative;background:var(--fx-nbg,#0b0b12);border-radius:calc(var(--fx-nr,20px) - 1px);z-index:0}@keyframes fx-neon{0%,100%{background-position:0 0}50%{background-position:0 100%}}
.fx-retro{position:absolute;inset:0;overflow:hidden;perspective:200px;pointer-events:none;opacity:var(--fx-ro,.5)}.fx-retro>div{position:absolute;inset:0;transform:rotateX(65deg)}.fx-retro .g{position:absolute;inset:0 0;margin-left:-200%;height:300vh;width:600vw;transform-origin:100% 0 0;background-image:linear-gradient(to right,var(--fx-rl,rgba(127,127,127,.5)) 1px,transparent 0),linear-gradient(to bottom,var(--fx-rl,rgba(127,127,127,.5)) 1px,transparent 0);background-size:60px 60px;background-repeat:repeat;animation:fx-retro 12s linear infinite}@keyframes fx-retro{0%{transform:translateY(-50%)}100%{transform:translateY(0)}}
.fx-retro::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,var(--fx-rbg,#07070b) 5%,transparent 70%)}
.fx-warp{position:relative;overflow:hidden;perspective:var(--fx-wp,320px)}.fx-warp .wb{position:absolute;inset:0;transform-style:preserve-3d}.fx-warp .side{position:absolute;overflow:hidden}.fx-warp .beam{position:absolute;left:0;width:100%;background:linear-gradient(var(--fx-wc,#7c5cff),transparent);animation:fx-wb var(--bd) linear var(--bl) infinite}@keyframes fx-wb{from{transform:translateY(100cqmax)}to{transform:translateY(-100%)}}
.fx-orbit2{position:relative;display:grid;place-items:center}.fx-orbit2>.ring{position:absolute;border-radius:50%;border:1px solid rgba(127,127,127,.3)}.fx-orbit2>.it{position:absolute;left:50%;top:50%}
.fx-backlight{position:relative;display:inline-block}.fx-backlight>.bl{position:absolute;inset:0;filter:blur(var(--fx-bl,28px)) saturate(1.8);opacity:.7;transform:scale(1.04) translateY(6px);z-index:-1;border-radius:inherit;background-size:cover;background-position:center}
`;
  document.head.append(css);
  const host = el => { if (getComputedStyle(el).position === 'static') el.style.position = 'relative'; el.style.isolation = el.style.isolation || 'isolate'; };
  const mk = (tag, attrs = {}, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent && parent.append(e); return e; };
  const svgLayer = (el) => { host(el); const s = mk('svg', { class: 'fx-pat', width: '100%', height: '100%', 'aria-hidden': 'true' }); s.style.cssText = 'position:absolute;inset:0;pointer-events:none'; el.prepend(s); return s; };

  // Static dotted background (CSS). data-opts {"size":22,"r":1.2,"color":"rgba(127,127,127,.4)","fade":true}
  register('dot-pattern', el => { const o = U.opts(el, { size: 22, r: 1.2, color: 'rgba(148,163,184,.45)', fade: true, glow: false }); host(el); const d = document.createElement('div'); d.className = 'fx-pat'; d.style.backgroundImage = `radial-gradient(${o.color} ${o.r}px,transparent ${o.r}px)`; d.style.backgroundSize = `${o.size}px ${o.size}px`; if (o.fade) { const m = 'radial-gradient(ellipse at center,#000 30%,transparent 78%)'; d.style.webkitMaskImage = d.style.maskImage = m; } if (o.glow && !U.RM) d.style.animation = 'fx-glowdots 4s ease-in-out infinite alternate'; el.prepend(d); if (!document.getElementById('fx-gd')) { const s = document.createElement('style'); s.id = 'fx-gd'; s.textContent = '@keyframes fx-glowdots{from{opacity:.35}to{opacity:1}}'; document.head.append(s); } });
  // Line grid background. data-opts {"size":40,"color":"rgba(127,127,127,.25)","fade":true}
  register('grid-pattern', el => { const o = U.opts(el, { size: 40, color: 'rgba(148,163,184,.22)', fade: true }); host(el); const d = document.createElement('div'); d.className = 'fx-pat'; d.style.backgroundImage = `linear-gradient(${o.color} 1px,transparent 1px),linear-gradient(90deg,${o.color} 1px,transparent 1px)`; d.style.backgroundSize = `${o.size}px ${o.size}px`; if (o.fade) d.style.webkitMaskImage = d.style.maskImage = 'radial-gradient(ellipse at center,#000 25%,transparent 75%)'; el.prepend(d); });
  register('striped-pattern', el => { const o = U.opts(el, { size: 10, color: 'rgba(148,163,184,.25)', angle: 45 }); host(el); const d = document.createElement('div'); d.className = 'fx-pat'; d.style.backgroundImage = `repeating-linear-gradient(${o.angle}deg,${o.color} 0 1px,transparent 1px ${o.size}px)`; d.style.webkitMaskImage = d.style.maskImage = 'radial-gradient(ellipse at center,#000 25%,transparent 80%)'; el.prepend(d); });

  // Grid squares that fade in and out at random
  register('animated-grid-pattern', el => { const o = U.opts(el, { size: 40, count: 30, color: 'rgba(148,163,184,.35)', dur: 3500 }); const s = svgLayer(el); let cells = 0, cols = 0, rows = 0; const layer = mk('g', {}, s); const build = () => { layer.innerHTML = ''; const r = el.getBoundingClientRect(); cols = Math.ceil(r.width / o.size); rows = Math.ceil(r.height / o.size);
      const defs = mk('pattern', { id: 'fxg', width: o.size, height: o.size, patternUnits: 'userSpaceOnUse' }, s); mk('path', { d: `M${o.size} 0H0V${o.size}`, fill: 'none', stroke: o.color, 'stroke-opacity': .5 }, defs); layer.before(mk('rect', { width: '100%', height: '100%', fill: 'url(#fxg)', style: 'mask-image:radial-gradient(ellipse,#000 30%,transparent 75%);-webkit-mask-image:radial-gradient(ellipse,#000 30%,transparent 75%)' }, s)); }; build(); new ResizeObserver(build).observe(el);
    const spawn = () => { const x = Math.floor(Math.random() * cols) * o.size, y = Math.floor(Math.random() * rows) * o.size; const r = mk('rect', { x: x + 1, y: y + 1, width: o.size - 1, height: o.size - 1, fill: o.color, opacity: 0 }, layer); r.style.transition = `opacity ${o.dur / 2}ms ease`; requestAnimationFrame(() => r.setAttribute('opacity', .8)); setTimeout(() => r.setAttribute('opacity', 0), o.dur / 2); setTimeout(() => r.remove(), o.dur + 100); }; if (U.RM) return; const id = setInterval(spawn, o.dur / o.count); return () => clearInterval(id); });

  // Canvas squares that flicker like a bad LED panel
  register('flickering-grid', el => { const o = U.opts(el, { size: 4, gap: 6, color: '#a78bfa', chance: .2, maxOp: .3 }); const { ctx, size } = U.canvasIn(el); let cols, rows, sq; const [r, g, b] = U.hex(o.color).map(v => v * 255 | 0); const build = () => { cols = Math.ceil(size.w / (o.size + o.gap)); rows = Math.ceil(size.h / (o.size + o.gap)); sq = new Float32Array(cols * rows).map(() => Math.random() * o.maxOp); }; build(); new ResizeObserver(build).observe(el); const m = el.style.maskImage = 'radial-gradient(ellipse,#000 30%,transparent 78%)'; el.style.webkitMaskImage = m;
    return U.loop(el, (t, dt) => { for (let i = 0; i < sq.length; i++) if (Math.random() < o.chance * dt) sq[i] = Math.random() * o.maxOp; const d = size.dpr; ctx.setTransform(d, 0, 0, d, 0, 0); ctx.clearRect(0, 0, size.w, size.h); for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) { ctx.fillStyle = `rgba(${r},${g},${b},${sq[y * cols + x]})`; ctx.fillRect(x * (o.size + o.gap), y * (o.size + o.gap), o.size, o.size); } }); });

  // SVG hexagon grid. hover cells to light them (interactive)
  const hexGrid = (el, o, interactive) => { const s = svgLayer(el); s.style.pointerEvents = interactive ? 'auto' : 'none'; const r = o.r, w = Math.sqrt(3) * r, h = 2 * r; const R = el.getBoundingClientRect(); const pts = (cx, cy) => [0, 1, 2, 3, 4, 5].map(i => { const a = Math.PI / 180 * (60 * i - 30); return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`; }).join(' ');
    const build = () => { s.innerHTML = ''; const b = el.getBoundingClientRect(); for (let row = 0, y = 0; y < b.height + h; row++, y += h * .75) for (let x = row % 2 ? w / 2 : 0; x < b.width + w; x += w) { const p = mk('polygon', { points: pts(x, y), fill: 'transparent', stroke: o.color, 'stroke-width': 1, 'stroke-opacity': .5 }, s); if (interactive) { p.style.transition = 'fill .9s'; p.addEventListener('pointerenter', () => { p.style.transition = 'fill 0s'; p.setAttribute('fill', o.hot); requestAnimationFrame(() => { p.style.transition = 'fill 1.2s'; p.setAttribute('fill', 'transparent'); }); }); } } }; build(); new ResizeObserver(build).observe(el); if (!interactive) s.style.cssText += ';-webkit-mask-image:radial-gradient(ellipse,#000 25%,transparent 75%);mask-image:radial-gradient(ellipse,#000 25%,transparent 75%)'; };
  register('hexagon-pattern', el => hexGrid(el, Object.assign({ r: 24, color: 'rgba(148,163,184,.4)', hot: 'rgba(124,92,255,.5)' }, U.opts(el, {})), false));
  register('interactive-grid-pattern', el => { const o = Object.assign({ size: 36, color: 'rgba(148,163,184,.3)', hot: 'rgba(124,92,255,.35)' }, U.opts(el, {})); const s = svgLayer(el); s.style.pointerEvents = 'auto'; const build = () => { s.innerHTML = ''; const b = el.getBoundingClientRect(); for (let y = 0; y < b.height; y += o.size) for (let x = 0; x < b.width; x += o.size) { const r = mk('rect', { x, y, width: o.size, height: o.size, fill: 'transparent', stroke: o.color }, s); r.style.transition = 'fill 1s'; r.addEventListener('pointerenter', () => { r.style.transition = 'fill 0s'; r.setAttribute('fill', o.hot); requestAnimationFrame(() => { r.style.transition = 'fill 1.4s'; r.setAttribute('fill', 'transparent'); }); }); } }; build(); new ResizeObserver(build).observe(el); });

  // Perspective floor grid moving toward the viewer
  register('retro-grid', el => { const o = U.opts(el, { color: 'rgba(124,92,255,.55)', bg: '#07070b', opacity: .6 }); host(el); const r = document.createElement('div'); r.className = 'fx-retro'; r.style.setProperty('--fx-rl', o.color); r.style.setProperty('--fx-rbg', o.bg); r.style.setProperty('--fx-ro', o.opacity); r.innerHTML = '<div><div class="g"></div></div>'; el.prepend(r); });

  // Meteor shower
  register('meteors', el => { const o = U.opts(el, { count: 20, color: '#94a3b8' }); host(el); el.style.overflow = 'hidden'; el.style.setProperty('--fx-mc', o.color); for (let i = 0; i < o.count; i++) { const m = document.createElement('span'); m.className = 'fx-meteor'; m.style.cssText = `--t:${U.rand(-5, 20)}%;--l:${U.rand(0, 100)}%;--d:${U.rand(2, 8).toFixed(1)}s;--del:${U.rand(0, 6).toFixed(1)}s;--len:${U.rand(30, 90) | 0}px;${U.RM ? 'display:none' : ''}`; m.setAttribute('aria-hidden', 'true'); el.prepend(m); } });

  // Concentric rings pulsing outward from the centre
  register('ripple', el => { const o = U.opts(el, { rings: 6, gap: 70, start: 180, color: 'rgba(148,163,184,.3)', fill: 'rgba(148,163,184,.04)' }); host(el); const w = document.createElement('div'); w.className = 'fx-ripple-bg'; w.style.setProperty('--fx-rc', o.color); w.style.setProperty('--fx-rf', o.fill); for (let i = 0; i < o.rings; i++) { const r = document.createElement('i'); const s = o.start + i * o.gap; r.style.cssText = `width:${s}px;height:${s}px;--dl:${i * .12}s;opacity:${1 - i * .14}`; w.append(r); } w.style.webkitMaskImage = w.style.maskImage = 'linear-gradient(#000 30%,transparent)'; el.prepend(w); });

  // Border with a light that travels around it (needs border-radius on the element)
  register('border-beam', el => { const o = U.opts(el, { c1: '#7c5cff', c2: '#22d3ee', width: 2, dur: 6 }); el.classList.add('fx-bbeam'); el.style.setProperty('--fx-b1', o.c1); el.style.setProperty('--fx-b2', o.c2); el.style.setProperty('--fx-bw', o.width + 'px'); el.style.setProperty('--fx-bd', o.dur + 's'); if (!getComputedStyle(el).borderRadius || getComputedStyle(el).borderRadius === '0px') el.style.borderRadius = '16px'; });
  // Soft multi-colour gradient border that slowly shifts
  register('shine-border', el => { const o = U.opts(el, { colors: ['#7c5cff', '#22d3ee', '#f472b6'], width: 1.5, dur: 10 }); el.classList.add('fx-shineb'); o.colors.forEach((c, i) => el.style.setProperty('--c' + (i + 1), c)); el.style.setProperty('--fx-bw', o.width + 'px'); el.style.setProperty('--fx-bd', o.dur + 's'); });
  // Card with a neon glow border. Content is wrapped automatically.
  register('neon-gradient-card', el => { const o = U.opts(el, { c1: '#ff2975', c2: '#00fff1', radius: 20, border: 2 }); el.classList.add('fx-neon'); el.style.setProperty('--n1', o.c1); el.style.setProperty('--n2', o.c2); el.style.setProperty('--fx-nr', o.radius + 'px'); el.style.setProperty('--fx-nb', o.border + 'px'); if (!el.querySelector(':scope>.fx-in')) { const i = document.createElement('div'); i.className = 'fx-in'; i.style.padding = o.pad || '1.25rem'; while (el.firstChild) i.append(el.firstChild); el.append(i); } });

  // Tunnel of grid rings with glowing beams rushing along the walls (canvas warp-background)
  register('warp-background', el => { const o = U.opts(el, { beams: 28, color: '#7c5cff', grid: 'rgba(148,163,184,.16)', rings: 9 }); host(el); const { ctx, size } = U.canvasIn(el); const [r, g, b] = U.hex(o.color).map(v => v * 255 | 0);
    const B = Array.from({ length: o.beams }, () => ({ wall: Math.random() * 4 | 0, u: Math.random(), z: Math.random(), sp: U.rand(.12, .38), len: U.rand(.12, .3) }));
    const P = (wall, u, z, W, H) => { const k = 1 / (z * 3 + .12), hw = W / 2 * k * .5, hh = H / 2 * k * .5; const cx = W / 2, cy = H / 2; const p = [[-1 + 2 * u, -1], [1, -1 + 2 * u], [1 - 2 * u, 1], [-1, 1 - 2 * u]][wall]; return [cx + p[0] * hw, cy + p[1] * hh]; };
    return U.loop(el, (t, dt) => { const d = size.dpr, W = size.w, H = size.h; ctx.setTransform(d, 0, 0, d, 0, 0); ctx.clearRect(0, 0, W, H); ctx.strokeStyle = o.grid; ctx.lineWidth = 1; const off = (t * .12) % (1 / o.rings);
      for (let i = 0; i < o.rings; i++) { const z = i / o.rings + off, k = 1 / (z * 3 + .12), hw = W / 2 * k * .5, hh = H / 2 * k * .5; ctx.globalAlpha = Math.min(1, (1 - z) * 1.4); ctx.strokeRect(W / 2 - hw, H / 2 - hh, hw * 2, hh * 2); } ctx.globalAlpha = .55; ctx.beginPath(); for (let w = 0; w < 4; w++) for (let q = 0; q <= 4; q++) { const [x1, y1] = P(w, q / 4, 0, W, H), [x2, y2] = P(w, q / 4, 1, W, H); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); } ctx.stroke();
      ctx.lineCap = 'round'; B.forEach(bm => { bm.z -= bm.sp * dt; if (bm.z < .02) { bm.z = 1; bm.wall = Math.random() * 4 | 0; bm.u = Math.random(); } const [x1, y1] = P(bm.wall, bm.u, bm.z, W, H), [x2, y2] = P(bm.wall, bm.u, bm.z + bm.len, W, H); const gr = ctx.createLinearGradient(x1, y1, x2, y2); gr.addColorStop(0, `rgba(${r},${g},${b},${Math.min(1, (1 - bm.z) + .2)})`); gr.addColorStop(1, `rgba(${r},${g},${b},0)`); ctx.strokeStyle = gr; ctx.lineWidth = 1 + (1 - bm.z) * 2.4; ctx.globalAlpha = 1; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }); }); });

  // Animated beam between two elements. data-opts {"from":"#a","to":"#b","curve":40}; el is the positioned container.
  register('animated-beam', el => { const o = U.opts(el, { from: '', to: '', curve: 0, c1: '#7c5cff', c2: '#22d3ee', dur: 3, width: 2, reverse: false }); host(el); const s = svgLayer(el); const id = 'fxb' + Math.random().toString(36).slice(2, 6); const g = mk('linearGradient', { id, gradientUnits: 'userSpaceOnUse' }, mk('defs', {}, s)); mk('stop', { offset: '0%', 'stop-color': o.c1, 'stop-opacity': 0 }, g); mk('stop', { offset: '30%', 'stop-color': o.c1 }, g); mk('stop', { offset: '70%', 'stop-color': o.c2 }, g); mk('stop', { offset: '100%', 'stop-color': o.c2, 'stop-opacity': 0 }, g); const base = mk('path', { fill: 'none', stroke: 'rgba(127,127,127,.3)', 'stroke-width': o.width, 'stroke-linecap': 'round' }, s), beam = mk('path', { fill: 'none', stroke: `url(#${id})`, 'stroke-width': o.width, 'stroke-linecap': 'round' }, s);
    const L = { x1: 0, y1: 0, x2: 0, y2: 0 }; const layout = () => { const a = el.querySelector(o.from), b = el.querySelector(o.to) || document.querySelector(o.to); if (!a || !b) return; const c = el.getBoundingClientRect(), ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect(); const x1 = ra.left - c.left + ra.width / 2, y1 = ra.top - c.top + ra.height / 2, x2 = rb.left - c.left + rb.width / 2, y2 = rb.top - c.top + rb.height / 2; const d = `M${x1},${y1} Q${(x1 + x2) / 2},${(y1 + y2) / 2 - o.curve} ${x2},${y2}`; L.x1 = x1; L.y1 = y1; L.x2 = x2; L.y2 = y2; base.setAttribute('d', d); beam.setAttribute('d', d); g.setAttribute('x1', x1); g.setAttribute('x2', x2); g.setAttribute('y1', y1); g.setAttribute('y2', y2); }; layout(); new ResizeObserver(layout).observe(el); addEventListener('resize', layout); if (U.RM) return;
    return U.loop(el, (t) => { const p = (t / o.dur) % 1, k = o.reverse ? 1 - p : p; const { x1, x2, y1, y2 } = L; const sp = .5; g.setAttribute('x1', x1 + (x2 - x1) * (k * (1 + sp) - sp)); g.setAttribute('x2', x1 + (x2 - x1) * (k * (1 + sp))); g.setAttribute('y1', y1 + (y2 - y1) * (k * (1 + sp) - sp)); g.setAttribute('y2', y1 + (y2 - y1) * (k * (1 + sp))); }); });

  // Children orbit a centre on rings. data-opts {"radius":90,"speed":20,"reverse":false}; each child may set data-radius.
  register('orbiting-circles', el => { const o = U.opts(el, { radius: 90, dur: 18, reverse: false, ring: true }); el.classList.add('fx-orbit2'); const k = [...el.children]; const n = k.length; const rings = new Set(); k.forEach((c, i) => { const R = +c.dataset.radius || o.radius; c.classList.add('it'); c._R = R; c._a = i / n * 6.283; if (o.ring && !rings.has(R)) { rings.add(R); const r = document.createElement('div'); r.className = 'ring'; r.style.cssText = `width:${R * 2}px;height:${R * 2}px;left:50%;top:50%;margin:${-R}px 0 0 ${-R}px`; el.prepend(r); } }); el.style.minHeight = el.style.minHeight || Math.max(...k.map(c => c._R)) * 2 + 60 + 'px'; let a = 0; if (U.RM) return;
    return U.loop(el, (t, dt) => { a += dt / o.dur * 6.283 * (o.reverse ? -1 : 1); k.forEach(c => { const th = c._a + a * (c.dataset.speed || 1); c.style.transform = `translate(-50%,-50%) translate(${Math.cos(th) * c._R}px,${Math.sin(th) * c._R}px)`; }); }); });

  // Confetti. Fires on click of the element, or call el.fxConfetti(); also global FX.confetti(x,y)
  const confetti = (x, y, o = {}) => { const c = document.createElement('canvas'); c.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:99999'; c.width = innerWidth; c.height = innerHeight; document.body.append(c); const ctx = c.getContext('2d'); const cols = o.colors || ['#ff2d95', '#14f195', '#ffe600', '#00c2ff', '#a78bfa', '#fb923c']; const P = Array.from({ length: o.count || 110 }, () => { const a = U.rand(-Math.PI * .95, -Math.PI * .05), v = U.rand(6, 17) * (o.power || 1); return { x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, w: U.rand(5, 10), h: U.rand(3, 6), r: Math.random() * 6.28, vr: U.rand(-.3, .3), c: cols[Math.random() * cols.length | 0] }; }); let f = 0; (function tick() { ctx.clearRect(0, 0, c.width, c.height); P.forEach(p => { p.vy += .35; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.globalAlpha = Math.max(0, 1 - f / 130); ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore(); }); if (++f < 140) requestAnimationFrame(tick); else c.remove(); })(); };
  FX.confetti = confetti;
  register('confetti', el => { if (U.RM) return; const o = U.opts(el, { count: 110, power: 1, on: 'click' }); const go = e => { const r = el.getBoundingClientRect(); confetti(e && e.clientX != null && e.type !== 'fx' ? e.clientX : r.left + r.width / 2, e && e.clientY != null && e.type !== 'fx' ? e.clientY : r.top + r.height / 2, o); }; el.fxConfetti = () => go({ type: 'fx' }); if (o.on === 'click') el.addEventListener('click', go); else if (o.on === 'view') U.inview(el, () => go({ type: 'fx' })); });

  // Emits particles (emoji / dots / images) from the pointer on click or hover. data-opts {"items":["✨","💜"],"on":"click|hover"}
  register('cool-mode', el => { if (U.RM) return; const o = U.opts(el, { items: ['✨', '💜', '⭐'], on: 'click', count: 12, size: 18 }); const burst = (x, y) => { for (let i = 0; i < o.count; i++) { const p = document.createElement('span'); const it = o.items[i % o.items.length]; if (/^(https?:|\/|\.)/.test(it)) { p.innerHTML = `<img src="${it}" width="${o.size}" height="${o.size}" alt="">`; } else p.textContent = it; p.style.cssText = `position:fixed;left:${x}px;top:${y}px;font-size:${o.size}px;pointer-events:none;z-index:99999;will-change:transform,opacity`; document.body.append(p); const a = U.rand(0, 6.283), v = U.rand(60, 160), dx = Math.cos(a) * v, dy = Math.sin(a) * v - 80; p.animate([{ transform: 'translate(-50%,-50%) scale(.4)', opacity: 1 }, { transform: `translate(calc(-50% + ${dx}px),calc(-50% + ${dy + 140}px)) scale(1) rotate(${U.rand(-90, 90)}deg)`, opacity: 0 }], { duration: U.rand(700, 1300), easing: 'cubic-bezier(.2,.6,.4,1)' }).onfinish = () => p.remove(); } }; if (o.on === 'hover') { let last = 0; el.addEventListener('pointermove', e => { if (performance.now() - last > 120) { last = performance.now(); burst(e.clientX, e.clientY); } }); } else el.addEventListener('click', e => burst(e.clientX, e.clientY)); });

  // Rotating dotted globe with optional markers. Drag to spin. data-opts {"markers":[[lat,lon],...],"color":"#a5b4fc"}
  register('globe', el => { const o = U.opts(el, { color: '#a5b4fc', dots: 1400, markers: [[37.78, -122.42], [51.5, -.12], [35.68, 139.69], [-33.87, 151.2], [19.07, 72.88]], speed: .25, glow: '#7c5cff' }); const { ctx, size } = U.canvasIn(el); const P = []; for (let i = 0; i < o.dots; i++) { const y = 1 - 2 * (i + .5) / o.dots, r = Math.sqrt(1 - y * y), th = Math.PI * (1 + Math.sqrt(5)) * i; P.push([Math.cos(th) * r, y, Math.sin(th) * r]); } const ll = ([la, lo]) => { la *= Math.PI / 180; lo *= Math.PI / 180; return [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)]; }; const M = o.markers.map(ll);
    let rot = 0, v = o.speed, d = false, tilt = .35; el.style.touchAction = 'pan-y'; el.addEventListener('pointerdown', e => { d = true; el.setPointerCapture(e.pointerId); }); el.addEventListener('pointermove', e => { if (d) { v = e.movementX * .01; rot += e.movementX * .008; tilt = U.clamp(tilt + e.movementY * .005, -.8, .8); } }); el.addEventListener('pointerup', () => d = false);
    return U.loop(el, (t, dt) => { if (!d) { rot += dt * v; v = U.lerp(v, o.speed, .02); } const D = size.dpr; ctx.setTransform(D, 0, 0, D, 0, 0); ctx.clearRect(0, 0, size.w, size.h); const R = Math.min(size.w, size.h) * .44, cx = size.w / 2, cy = size.h / 2; const g = ctx.createRadialGradient(cx, cy, R * .6, cx, cy, R * 1.25); g.addColorStop(0, 'transparent'); g.addColorStop(.8, o.glow + '33'); g.addColorStop(1, 'transparent'); ctx.fillStyle = g; ctx.fillRect(0, 0, size.w, size.h); const cr = Math.cos(rot), sr = Math.sin(rot), ct = Math.cos(tilt), st = Math.sin(tilt);
      const proj = ([x, y, z]) => { const x1 = x * cr + z * sr, z1 = -x * sr + z * cr, y2 = y * ct - z1 * st, z2 = y * st + z1 * ct; return [cx + x1 * R, cy - y2 * R, z2]; }; ctx.fillStyle = o.color; P.forEach(p => { const [x, y, z] = proj(p); if (z < -.05) return; ctx.globalAlpha = .15 + .75 * z; ctx.fillRect(x, y, 1.6, 1.6); }); M.forEach((m, i) => { const [x, y, z] = proj(m); if (z < 0) return; const pu = (t * 1.2 + i) % 2; ctx.globalAlpha = (1 - pu / 2) * .6 * z; ctx.strokeStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, 3 + pu * 8, 0, 6.283); ctx.stroke(); ctx.globalAlpha = 1; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, 3, 0, 6.283); ctx.fill(); ctx.fillStyle = o.color; }); }); });

  // Floating 3D points that parallax with the cursor
  register('floating-3d-particles', el => { const o = U.opts(el, { count: 130, color: '#a5b4fc', depth: 600, link: 0 }); const { ctx, size } = U.canvasIn(el); const P = Array.from({ length: o.count }, () => ({ x: U.rand(-1, 1), y: U.rand(-1, 1), z: U.rand(.1, 1), vx: U.rand(-.04, .04), vy: U.rand(-.04, .04) })); let mx = 0, my = 0, tx = 0, ty = 0; el.addEventListener('pointermove', e => { const l = U.local(el, e); tx = l.nx - .5; ty = l.ny - .5; }); el.addEventListener('pointerleave', () => { tx = ty = 0; });
    return U.loop(el, (t, dt) => { mx = U.lerp(mx, tx, .05); my = U.lerp(my, ty, .05); const d = size.dpr; ctx.setTransform(d, 0, 0, d, 0, 0); ctx.clearRect(0, 0, size.w, size.h); ctx.fillStyle = o.color; P.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt + Math.sin(t + p.z * 9) * .0006; if (Math.abs(p.x) > 1.1) p.vx *= -1; if (Math.abs(p.y) > 1.1) p.vy *= -1; const k = 1 / (1.2 - p.z * .8), x = size.w / 2 + (p.x * size.w / 2 + mx * -120 * p.z) * k * .9, y = size.h / 2 + (p.y * size.h / 2 + my * -120 * p.z) * k * .9; ctx.globalAlpha = .25 + .75 * p.z; ctx.beginPath(); ctx.arc(x, y, .8 + p.z * 2.6, 0, 6.283); ctx.fill(); }); }); });

  // Blurred copy of an image glowing behind it
  register('backlight', el => { const o = U.opts(el, { blur: 28 }); el.classList.add('fx-backlight'); el.style.setProperty('--fx-bl', o.blur + 'px'); const im = el.querySelector('img'); const bl = document.createElement('div'); bl.className = 'bl'; if (im) { bl.style.backgroundImage = `url("${im.currentSrc || im.src}")`; bl.style.borderRadius = getComputedStyle(im).borderRadius; } else bl.style.background = o.color || 'linear-gradient(135deg,#7c5cff,#22d3ee)'; el.prepend(bl); });
})();

/* ===================== MAGIC-STYLE: BUTTONS, TEXT, DEVICE FRAMES, WIDGETS ===================== */
(function () {
  const { register, util: U } = FX; const NS = 'http://www.w3.org/2000/svg';
  const css = document.createElement('style'); css.id = 'fx-magic2-css';
  css.textContent = `
.fx-shimbtn{position:relative;overflow:hidden;isolation:isolate;border:1px solid rgba(255,255,255,.12);background:var(--fx-sb,#0c0c12);color:#fff;border-radius:99px;padding:.8em 1.6em;font:inherit;font-weight:600;cursor:pointer;transition:transform .2s}.fx-shimbtn:active{transform:translateY(1px)}
.fx-shimbtn::before{content:'';position:absolute;inset:-100%;background:conic-gradient(from calc(270deg - 45deg),transparent 0,var(--fx-sc,#fff) 90deg,transparent 90deg);animation:fx-sbspin 3s linear infinite;z-index:-2}.fx-shimbtn::after{content:'';position:absolute;inset:2px;border-radius:inherit;background:var(--fx-sb,#0c0c12);z-index:-1}
@keyframes fx-sbspin{to{transform:rotate(360deg)}}
.fx-rainbow{position:relative;border:0;border-radius:12px;padding:.8em 1.6em;font:inherit;font-weight:600;cursor:pointer;color:#fff;background:linear-gradient(#121213,#121213) padding-box,linear-gradient(90deg,#ff4d4d,#f9cb28,#2eea8a,#3b82f6,#a855f7,#ff4d4d) border-box;border:2px solid transparent;background-size:200%;animation:fx-rb 3s linear infinite}.fx-rainbow::after{content:'';position:absolute;left:10%;right:10%;bottom:-20%;height:20%;filter:blur(14px);background:linear-gradient(90deg,#ff4d4d,#f9cb28,#2eea8a,#3b82f6,#a855f7,#ff4d4d);background-size:200%;animation:fx-rb 3s linear infinite;opacity:.8;z-index:-1}@keyframes fx-rb{to{background-position:200%}}
.fx-pulsebtn{position:relative;border:0;border-radius:10px;padding:.8em 1.6em;background:var(--fx-pb,#7c5cff);color:#fff;font:inherit;font-weight:600;cursor:pointer;animation:fx-pulsebtn 2s ease-out infinite}@keyframes fx-pulsebtn{0%{box-shadow:0 0 0 0 var(--fx-pc,rgba(124,92,255,.7))}70%{box-shadow:0 0 0 14px transparent}100%{box-shadow:0 0 0 0 transparent}}
.fx-shinybtn{position:relative;overflow:hidden;border:1px solid rgba(255,255,255,.14);border-radius:12px;padding:.8em 1.6em;background:linear-gradient(135deg,#1c1c27,#0e0e14);color:#fff;font:inherit;font-weight:600;cursor:pointer}.fx-shinybtn::after{content:'';position:absolute;top:0;bottom:0;width:40%;left:-60%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.35),transparent);animation:fx-shb 2.8s ease-in-out infinite}@keyframes fx-shb{0%,60%{left:-60%}100%{left:130%}}
.fx-ihb{position:relative;display:inline-flex;align-items:center;justify-content:center;border:1px solid rgba(127,127,127,.4);border-radius:99px;padding:.8em 1.8em;font:inherit;font-weight:600;cursor:pointer;overflow:hidden;background:transparent;color:inherit;min-width:9em}.fx-ihb .dt{position:absolute;left:1.2em;top:50%;width:.55em;height:.55em;margin-top:-.275em;border-radius:50%;background:var(--fx-ih,#7c5cff);transition:transform .45s cubic-bezier(.2,.8,.2,1)}.fx-ihb .l1{transition:transform .35s,opacity .35s;display:inline-block;transform:translateX(.6em)}.fx-ihb .l2{position:absolute;left:0;right:0;text-align:center;opacity:0;transform:translateX(1.4em);transition:transform .4s,opacity .4s;color:#fff;z-index:1;display:flex;align-items:center;justify-content:center;gap:.4em}.fx-ihb:hover .dt{transform:scale(var(--fx-ihs,26))}.fx-ihb:hover .l1{transform:translateX(-2em);opacity:0}.fx-ihb:hover .l2{transform:none;opacity:1}
.fx-subbtn{position:relative;overflow:hidden;border:0;border-radius:99px;padding:.7em 1.6em;font:inherit;font-weight:600;cursor:pointer;background:var(--fx-sub,#7c5cff);color:#fff;min-width:9.5em;transition:background .3s}.fx-subbtn span{display:inline-block;transition:transform .45s cubic-bezier(.2,.8,.2,1),opacity .35s}.fx-subbtn .b{position:absolute;inset:0;display:grid;place-items:center;transform:translateY(120%);opacity:0}.fx-subbtn.on .a{transform:translateY(-120%);opacity:0}.fx-subbtn.on .b{transform:none;opacity:1}.fx-subbtn.on{background:#10b981}
.fx-hl{position:relative;display:inline}.fx-hl svg{position:absolute;pointer-events:none;overflow:visible;left:0;top:0;width:100%;height:100%;z-index:-1}.fx-hl svg path,.fx-hl svg rect,.fx-hl svg ellipse{fill:none;stroke-linecap:round;stroke-linejoin:round}
.fx-lst{position:relative;display:inline-block;--fx-ls:#7c5cff;text-shadow:1px 1px var(--fx-lb,#0a0a10),2px 2px var(--fx-ls),3px 3px var(--fx-lb,#0a0a10),4px 4px var(--fx-ls),5px 5px var(--fx-lb,#0a0a10)}
.fx-comic{display:inline-block;font-family:'Bangers','Comic Sans MS','Comic Neue',cursive;font-weight:900;text-transform:uppercase;letter-spacing:.02em;color:#fde047;-webkit-text-stroke:.07em #111;paint-order:stroke fill;text-shadow:.06em .06em 0 #ef4444,.12em .12em 0 #111;transform:rotate(-3deg);animation:fx-comic 1.6s cubic-bezier(.3,1.8,.5,1) both}@keyframes fx-comic{from{transform:rotate(-8deg) scale(.4);opacity:0}}
.fx-aurtext{display:inline-block;position:relative}.fx-aurtext>span{position:relative;color:transparent;background:linear-gradient(90deg,var(--a1,#ff0080),var(--a2,#7928ca),var(--a3,#0070f3),var(--a4,#38bdf8),var(--a1,#ff0080));background-size:300% 100%;-webkit-background-clip:text;background-clip:text;animation:fx-grad 8s linear infinite}.fx-aurtext>i{position:absolute;inset:0;pointer-events:none;mix-blend-mode:overlay;filter:blur(12px);opacity:.6;background:radial-gradient(circle at 20% 50%,var(--a1,#ff0080),transparent 40%),radial-gradient(circle at 80% 40%,var(--a3,#0070f3),transparent 40%);animation:fx-aur 6s ease-in-out infinite alternate}@keyframes fx-aur{to{transform:translateX(18px) scale(1.15)}}
.fx-spark{position:relative;display:inline-block}.fx-spark>.sp{position:absolute;pointer-events:none;animation:fx-sp var(--d,1.4s) ease-in-out forwards;transform:scale(0)}@keyframes fx-sp{0%{transform:scale(0) rotate(0);opacity:0}30%{transform:scale(1) rotate(90deg);opacity:1}100%{transform:scale(0) rotate(180deg);opacity:0}}
.fx-flip3d{display:inline-block;perspective:600px;white-space:pre-wrap}.fx-flip3d .fx-c{transform-style:preserve-3d;transition:transform .6s cubic-bezier(.2,.8,.2,1)}.fx-flip3d .fx-c::after{content:attr(data-b);position:absolute;left:0;top:0;transform:rotateX(90deg) translateZ(.5em);transform-origin:50% 100%;color:var(--fx-fb,#7c5cff)}.fx-flip3d:hover .fx-c{transform:translateZ(0) rotateX(-90deg)}
.fx-kin span.k{display:inline-block;transition:transform .35s cubic-bezier(.3,1.7,.5,1),color .25s}.fx-kin span.k:hover{transform:translateY(-.25em) rotate(-8deg) scale(1.25);color:var(--fx-kc,#f472b6)}
.fx-morph-t{position:relative;display:inline-block;text-align:center}.fx-morph-t span{position:absolute;left:0;right:0;top:0;white-space:nowrap}
.fx-vtext{position:relative;display:inline-block}.fx-vtext video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.fx-glyphm{display:inline-block;font-family:ui-monospace,monospace;line-height:1;white-space:pre}
.fx-pxi{position:relative;display:inline-block;overflow:hidden}.fx-pxi canvas{display:block;width:100%;height:100%}
.fx-lensc{position:relative;overflow:hidden}
.fx-ava{display:inline-flex}.fx-ava>*{width:2.6em;height:2.6em;border-radius:50%;border:2px solid var(--fx-ab,#0b0b12);margin-left:-.7em;object-fit:cover;background:#334155;color:#fff;display:grid;place-items:center;font-size:.75em;font-weight:700;transition:transform .25s cubic-bezier(.3,1.6,.5,1);text-decoration:none}.fx-ava>*:first-child{margin-left:0}.fx-ava>*:hover{transform:translateY(-4px) scale(1.12);z-index:2}
.fx-codec{position:relative;display:grid;grid-template-columns:1fr 1fr;border-radius:12px;overflow:hidden;background:#0d1117;color:#c9d1d9;font:13px/1.55 ui-monospace,monospace;border:1px solid #21262d}.fx-codec pre{margin:0;padding:1em;overflow:auto;white-space:pre}.fx-codec .L{background:rgba(248,81,73,.07);border-right:1px solid #21262d}.fx-codec .R{background:rgba(63,185,80,.07)}.fx-codec .tg{position:absolute;top:8px;font:600 10px system-ui;padding:2px 8px;border-radius:99px;letter-spacing:.06em;text-transform:uppercase}.fx-codec .tg.a{left:10px;background:rgba(248,81,73,.2);color:#ff7b72}.fx-codec .tg.b{right:10px;background:rgba(63,185,80,.2);color:#56d364}@media(max-width:560px){.fx-codec{grid-template-columns:1fr}.fx-codec .L{border-right:0;border-bottom:1px solid #21262d}}
.fx-ftree{font:14px/1.7 system-ui;user-select:none}.fx-ftree ul{list-style:none;margin:0;padding-left:1.1em;overflow:hidden}.fx-ftree>ul{padding-left:0}.fx-ftree li>.row{display:flex;gap:.45em;align-items:center;padding:.1em .4em;border-radius:6px;cursor:pointer}.fx-ftree li>.row:hover{background:rgba(127,127,127,.15)}.fx-ftree .ch{display:inline-block;transition:transform .25s;font-size:.7em;opacity:.7}.fx-ftree li.open>.row .ch{transform:rotate(90deg)}.fx-ftree .wr{display:grid;grid-template-rows:0fr;transition:grid-template-rows .3s}.fx-ftree li.open>.wr{grid-template-rows:1fr}.fx-ftree .wr>div{min-height:0;overflow:hidden}
.fx-term{border-radius:12px;background:#0b0e14;color:#cfd6e4;font:13px/1.6 ui-monospace,monospace;border:1px solid #1f2430;overflow:hidden}.fx-term .bar{display:flex;gap:6px;padding:.7em .9em;border-bottom:1px solid #1f2430}.fx-term .bar i{width:10px;height:10px;border-radius:50%;background:#3b4252}.fx-term .bar i:nth-child(1){background:#ff5f56}.fx-term .bar i:nth-child(2){background:#ffbd2e}.fx-term .bar i:nth-child(3){background:#27c93f}.fx-term .body{padding:1em;min-height:7em;white-space:pre-wrap}.fx-term .p{color:#7ee787}.fx-term .cur{display:inline-block;width:.55em;height:1.05em;background:#cfd6e4;vertical-align:-.15em;animation:fx-blink 1s steps(1) infinite}
.fx-iph{position:relative;display:inline-block;aspect-ratio:433/882;width:var(--fx-w,240px);border-radius:12% / 5.8%;background:#111;padding:2.6%;box-shadow:0 0 0 2px #2b2b30,0 30px 60px rgba(0,0,0,.45),inset 0 0 0 2px #444}.fx-iph .scr{width:100%;height:100%;border-radius:10% / 4.8%;overflow:hidden;background:#000;position:relative}.fx-iph .scr>*{width:100%;height:100%;object-fit:cover;display:block}.fx-iph::before{content:'';position:absolute;top:3.4%;left:50%;width:28%;height:3.2%;transform:translateX(-50%);background:#000;border-radius:99px;z-index:2}
.fx-and{position:relative;display:inline-block;aspect-ratio:433/882;width:var(--fx-w,240px);border-radius:8% / 4%;background:#0c0c0e;padding:3%;box-shadow:0 0 0 2px #2a2a2e,0 30px 60px rgba(0,0,0,.45)}.fx-and .scr{width:100%;height:100%;border-radius:6% / 3%;overflow:hidden;background:#000;position:relative}.fx-and .scr>*{width:100%;height:100%;object-fit:cover;display:block}.fx-and::before{content:'';position:absolute;top:2.4%;left:50%;width:3.4%;aspect-ratio:1;transform:translateX(-50%);background:#000;border-radius:50%;z-index:2;box-shadow:0 0 0 2px #222}
.fx-saf{border-radius:12px;overflow:hidden;background:#1a1a1f;border:1px solid #2c2c33;box-shadow:0 24px 50px rgba(0,0,0,.4)}.fx-saf .bar{display:flex;align-items:center;gap:.7em;padding:.6em .8em;background:#26262c}.fx-saf .dots{display:flex;gap:6px}.fx-saf .dots i{width:10px;height:10px;border-radius:50%}.fx-saf .url{flex:1;text-align:center;font:12px system-ui;color:#a1a1aa;background:#17171c;border-radius:8px;padding:.3em .6em;max-width:60%;margin:0 auto;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.fx-saf .cnt>*{display:block;width:100%}
.fx-hvd{position:relative;cursor:pointer;display:block;border-radius:14px;overflow:hidden}.fx-hvd .play{position:absolute;inset:0;display:grid;place-items:center;background:rgba(0,0,0,.25);transition:background .3s}.fx-hvd:hover .play{background:rgba(0,0,0,.4)}.fx-hvd .play i{width:4.4em;height:4.4em;border-radius:50%;background:rgba(255,255,255,.2);backdrop-filter:blur(8px);display:grid;place-items:center;transition:transform .3s cubic-bezier(.3,1.6,.5,1)}.fx-hvd:hover .play i{transform:scale(1.12)}.fx-hvd .play i::after{content:'';border-left:1.2em solid #fff;border-top:.8em solid transparent;border-bottom:.8em solid transparent;margin-left:.3em}
.fx-hvd-dlg{position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.8);display:grid;place-items:center;opacity:0;transition:opacity .3s}.fx-hvd-dlg.on{opacity:1}.fx-hvd-dlg>div{width:min(92vw,960px);aspect-ratio:16/9;transform:scale(.9);transition:transform .35s cubic-bezier(.2,.9,.3,1.2)}.fx-hvd-dlg.on>div{transform:none}.fx-hvd-dlg iframe,.fx-hvd-dlg video{width:100%;height:100%;border:0;border-radius:12px;background:#000}.fx-hvd-dlg button{position:absolute;top:14px;right:14px;border:0;border-radius:50%;width:2.6em;height:2.6em;background:rgba(255,255,255,.15);color:#fff;font-size:1.1em;cursor:pointer}
.fx-theme{border:0;background:transparent;color:inherit;cursor:pointer;width:2.4em;height:2.4em;border-radius:50%;display:inline-grid;place-items:center;font-size:1.2em;position:relative;overflow:hidden}.fx-theme:hover{background:rgba(127,127,127,.18)}.fx-theme span{position:absolute;transition:transform .5s cubic-bezier(.3,1.5,.5,1),opacity .3s}.fx-theme .m{transform:translateY(120%) rotate(-90deg);opacity:0}.fx-theme.dark .m{transform:none;opacity:1}.fx-theme.dark .s{transform:translateY(-120%) rotate(90deg);opacity:0}
.fx-cpb{position:relative;display:inline-grid;place-items:center}.fx-cpb svg{transform:rotate(-90deg);width:100%;height:100%}.fx-cpb .v{position:absolute;font-weight:800;font-variant-numeric:tabular-nums}
.fx-scrollp{position:fixed;left:0;top:0;height:var(--fx-sph,3px);width:100%;transform-origin:0 50%;transform:scaleX(0);background:var(--fx-spc,linear-gradient(90deg,#7c5cff,#22d3ee));z-index:99998;pointer-events:none}
.fx-ptr{position:fixed;left:0;top:0;pointer-events:none;z-index:99999;will-change:transform}
.fx-iconcloud{position:relative}.fx-iconcloud>*{position:absolute;left:50%;top:50%;will-change:transform,opacity}
.fx-tweet{border:1px solid rgba(127,127,127,.25);border-radius:14px;padding:1em 1.1em;max-width:30em;background:var(--fx-tw,rgba(127,127,127,.06));font:15px/1.5 system-ui}.fx-tweet .hd{display:flex;gap:.7em;align-items:center;margin-bottom:.5em}.fx-tweet .hd img,.fx-tweet .hd i{width:2.6em;height:2.6em;border-radius:50%;object-fit:cover;background:#334155;flex:none}.fx-tweet .nm{font-weight:700;line-height:1.2}.fx-tweet .hn{opacity:.6;font-size:.9em}.fx-tweet .ft{opacity:.55;font-size:.85em;margin-top:.6em}
`;
  document.head.append(css);
  const add = (name, cls, init) => register(name, el => { el.classList.add(cls); return init && init(el); });

  // ---- buttons ----
  add('shimmer-button', 'fx-shimbtn', el => { const o = U.opts(el, { bg: '#0c0c12', shimmer: '#ffffff' }); el.style.setProperty('--fx-sb', o.bg); el.style.setProperty('--fx-sc', o.shimmer); });
  add('rainbow-button', 'fx-rainbow');
  add('pulsating-button', 'fx-pulsebtn', el => { const o = U.opts(el, { color: '#7c5cff' }); el.style.setProperty('--fx-pb', o.color); const [r, g, b] = U.hex(o.color).map(v => v * 255 | 0); el.style.setProperty('--fx-pc', `rgba(${r},${g},${b},.7)`); });
  add('shiny-button', 'fx-shinybtn');
  register('interactive-hover-button', el => { const o = U.opts(el, { color: '#7c5cff', hover: el.textContent.trim() + ' →' }); el.classList.add('fx-ihb'); const t = el.textContent.trim(); el.setAttribute('aria-label', t); el.style.setProperty('--fx-ih', o.color); el.innerHTML = `<span class="dt"></span><span class="l1" aria-hidden="true">${t}</span><span class="l2" aria-hidden="true">${o.hover}</span>`; requestAnimationFrame(() => el.style.setProperty('--fx-ihs', Math.ceil(Math.hypot(el.offsetWidth, el.offsetHeight) / (parseFloat(getComputedStyle(el).fontSize) * .55)))); });
  register('animated-subscribe-button', el => { const o = U.opts(el, { label: el.textContent.trim() || 'Subscribe', done: '✓ Subscribed' }); el.classList.add('fx-subbtn'); el.setAttribute('aria-pressed', 'false'); el.innerHTML = `<span class="a">${o.label}</span><span class="b">${o.done}</span>`; el.addEventListener('click', () => { const on = !el.classList.contains('on'); el.classList.toggle('on', on); el.setAttribute('aria-pressed', on); el.dispatchEvent(new CustomEvent('fx-input', { detail: on })); }); });

  // ---- text ----
  // Hand-drawn style annotation drawn when scrolled into view. data-opts {"type":"highlight|underline|box|circle|strike|bracket","color":"#fde047"}
  register('highlighter', el => { const o = U.opts(el, { type: 'highlight', color: '#fde047', width: 3, dur: 700, delay: 0, pad: 4 }); el.classList.add('fx-hl'); el.style.zIndex = 0; const s = document.createElementNS(NS, 'svg'); s.setAttribute('aria-hidden', 'true'); el.append(s); let shape;
    const build = () => { const w = el.offsetWidth, h = el.offsetHeight, p = o.pad; s.setAttribute('viewBox', `0 0 ${w} ${h}`); s.innerHTML = ''; const mkp = (d, att) => { const e = document.createElementNS(NS, 'path'); e.setAttribute('d', d); for (const k in att) e.setAttribute(k, att[k]); s.append(e); return e; }; const j = () => (Math.random() - .5) * 2;
      if (o.type === 'highlight') shape = mkp(`M${-p} ${h * .62} Q${w * .3} ${h * .5 + j()} ${w + p} ${h * .6}`, { stroke: o.color, 'stroke-width': h * .85, 'stroke-opacity': .55, 'stroke-linecap': 'butt' }); else if (o.type === 'underline') shape = mkp(`M${-p} ${h - 2} Q${w * .4} ${h + 3 + j()} ${w + p} ${h - 1}`, { stroke: o.color, 'stroke-width': o.width });
      else if (o.type === 'strike') shape = mkp(`M${-p} ${h * .55} L${w + p} ${h * .5}`, { stroke: o.color, 'stroke-width': o.width }); else if (o.type === 'box') shape = mkp(`M${-p} ${-p + j()} L${w + p} ${-p + j()} L${w + p} ${h + p} L${-p} ${h + p + j()} Z`, { stroke: o.color, 'stroke-width': o.width }); else if (o.type === 'circle') shape = mkp(`M${w * .5} ${-p} C${w * 1.1} ${-p} ${w * 1.1} ${h + p} ${w * .5} ${h + p} C${-w * .1} ${h + p} ${-w * .1} ${-p - 2} ${w * .55} ${-p + 1}`, { stroke: o.color, 'stroke-width': o.width });
      else shape = mkp(`M${-p + 4} ${-p} L${-p} ${-p} L${-p} ${h + p} L${-p + 4} ${h + p} M${w + p - 4} ${-p} L${w + p} ${-p} L${w + p} ${h + p} L${w + p - 4} ${h + p}`, { stroke: o.color, 'stroke-width': o.width }); const L = shape.getTotalLength(); shape.style.strokeDasharray = L; shape.style.strokeDashoffset = U.RM ? 0 : L; shape._L = L; }; build();
    U.inview(el, () => { shape.style.transition = `stroke-dashoffset ${o.dur}ms cubic-bezier(.4,0,.2,1) ${o.delay}ms`; requestAnimationFrame(() => shape.style.strokeDashoffset = 0); }, '0px 0px -10% 0px'); });
  add('line-shadow-text', 'fx-lst', el => { const o = U.opts(el, { color: '#7c5cff', bg: '#0a0a10' }); el.style.setProperty('--fx-ls', o.color); el.style.setProperty('--fx-lb', o.bg); });
  add('comic-text', 'fx-comic');
  register('aurora-text', el => { const o = U.opts(el, { colors: ['#ff0080', '#7928ca', '#0070f3', '#38bdf8'] }); el.classList.add('fx-aurtext'); const t = el.textContent; el.setAttribute('aria-label', t); el.innerHTML = `<span aria-hidden="true">${t}</span><i aria-hidden="true"></i>`; o.colors.forEach((c, i) => el.style.setProperty('--a' + (i + 1), c)); });
  register('sparkles-text', el => { const o = U.opts(el, { count: 10, colors: ['#ffd166', '#f472b6', '#a78bfa'] }); el.classList.add('fx-spark'); if (U.RM) return; const mkSp = () => { const s = document.createElement('i'); s.className = 'sp'; s.setAttribute('aria-hidden', 'true'); const c = o.colors[Math.random() * o.colors.length | 0], z = U.rand(10, 20); s.style.cssText += `left:${U.rand(-5, 100)}%;top:${U.rand(-20, 90)}%;width:${z}px;height:${z}px;--d:${U.rand(1, 2).toFixed(1)}s`; s.innerHTML = `<svg viewBox="0 0 160 160" width="${z}" height="${z}"><path d="M80 0C80 0 84.3 53.2 107.5 77.5 130.7 101.8 160 80 160 80S130.7 78.2 107.5 82.5 80 160 80 160 75.7 106.8 52.5 82.5 0 80 0 80s29.3-1.8 52.5-5S80 0 80 0z" fill="${c}"/></svg>`; el.append(s); setTimeout(() => s.remove(), 2100); }; for (let i = 0; i < o.count / 2; i++) setTimeout(mkSp, i * 150); const id = setInterval(mkSp, 2000 / o.count * 1.4); return () => clearInterval(id); });
  register('dia-text-reveal', el => { const o = U.opts(el, { colors: ['#7c5cff', '#22d3ee', '#f472b6'], dur: 1400 }); const t = el.textContent; el.setAttribute('aria-label', t); el.innerHTML = `<span style="position:relative;display:inline-block"><span aria-hidden="true" style="color:transparent;-webkit-text-stroke:1px currentColor;opacity:.35">${t}</span><span class="r" aria-hidden="true" style="position:absolute;left:0;top:0;white-space:nowrap;background:linear-gradient(90deg,${o.colors.join(',')});-webkit-background-clip:text;background-clip:text;color:transparent;clip-path:polygon(0 0,0 0,-12% 100%,0 100%);transition:clip-path ${o.dur}ms cubic-bezier(.4,0,.2,1)">${t}</span></span>`; const r = el.querySelector('.r'); U.inview(el, () => requestAnimationFrame(() => r.style.clipPath = 'polygon(0 0,112% 0,100% 100%,0 100%)')); });
  register('text-3d-flip', el => { el.classList.add('fx-flip3d'); const { chars } = U.split(el); chars.forEach((c, i) => { c.style.position = 'relative'; c.dataset.b = c.textContent; c.style.transitionDelay = i * 25 + 'ms'; c.style.whiteSpace = 'pre'; }); const o = U.opts(el, {}); if (o.color) el.style.setProperty('--fx-fb', o.color); });
  register('kinetic-text', el => { el.classList.add('fx-kin'); const { chars } = U.split(el); chars.forEach(c => c.classList.add('k')); const o = U.opts(el, {}); if (o.color) el.style.setProperty('--fx-kc', o.color); });
  // Cross-fades through words with a blur morph. data-opts {"texts":["Fast","Bold"],"every":2200}
  register('morphing-text', el => { const o = U.opts(el, { texts: ['Hello', 'Morph', 'Magic'], every: 2400 }); el.classList.add('fx-morph-t'); el.setAttribute('aria-label', o.texts.join(', ')); const flt = document.getElementById('fx-morph-svg') || (() => { document.body.insertAdjacentHTML('beforeend', '<svg id="fx-morph-svg" width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="fx-morph-f"><feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 255 -140"/></filter></svg>'); return 1; })(); el.textContent = ''; el.style.filter = 'url(#fx-morph-f)'; const a = document.createElement('span'), b = document.createElement('span'); [a, b].forEach(s => { s.setAttribute('aria-hidden', 'true'); s.style.position = 'relative'; el.append(s); }); b.style.position = 'absolute'; b.style.left = '0'; b.style.right = '0'; let i = 0; a.textContent = o.texts[0]; if (U.RM) return; let t0 = performance.now(), phase = 0;
    return U.loop(el, () => { const n = performance.now(), k = Math.min(1, (n - t0) / 1100); if (k < 1) { const e = k * k * (3 - 2 * k); a.style.filter = `blur(${Math.min(8 / (1 - e + .001) - 8, 100)}px)`; a.style.opacity = (1 - e) ** .4; b.style.filter = `blur(${Math.min(8 / (e + .001) - 8, 100)}px)`; b.style.opacity = e ** .4; } else { a.style.filter = ''; a.style.opacity = 1; b.style.opacity = 0; if (n - t0 > o.every) { i = (i + 1) % o.texts.length; b.textContent = o.texts[i]; t0 = n; phase++; a.dataset.n = o.texts[i]; setTimeout(() => { a.textContent = o.texts[i]; }, 1100); } } }); });
  // Muted looping video visible only through the letters. data-opts {"src":"clip.mp4","font":"900 120px system-ui"}
  register('video-text', el => { const o = U.opts(el, { src: '', font: '900 clamp(3rem,12vw,9rem) system-ui,sans-serif', fallback: 'linear-gradient(135deg,#7c5cff,#22d3ee,#f472b6)' }); const t = el.textContent.trim(); el.setAttribute('aria-label', t); el.classList.add('fx-vtext'); el.textContent = ''; const id = 'fxvt' + Math.random().toString(36).slice(2, 6); const wrap = document.createElement('div'); wrap.style.cssText = `position:relative;font:${o.font};line-height:1;display:inline-block;color:transparent`; const ghost = document.createElement('span'); ghost.textContent = t; ghost.style.cssText = 'visibility:hidden;white-space:nowrap'; wrap.append(ghost); const layer = document.createElement('div'); layer.style.cssText = `position:absolute;inset:0;-webkit-mask:url("data:image/svg+xml,${encodeURIComponent('<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100%\' height=\'100%\'><text x=\'50%\' y=\'50%\' text-anchor=\'middle\' dominant-baseline=\'central\' font-family=\'system-ui,sans-serif\' font-weight=\'900\' font-size=\'100\' textLength=\'96%\' lengthAdjust=\'spacingAndGlyphs\'>' + t.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</text></svg>')}") center/100% 100% no-repeat;mask:url("data:image/svg+xml,${encodeURIComponent('<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100%\' height=\'100%\'><text x=\'50%\' y=\'50%\' text-anchor=\'middle\' dominant-baseline=\'central\' font-family=\'system-ui,sans-serif\' font-weight=\'900\' font-size=\'100\' textLength=\'96%\' lengthAdjust=\'spacingAndGlyphs\'>' + t.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</text></svg>')}") center/100% 100% no-repeat;background:${o.fallback}`; if (o.src) { const v = document.createElement('video'); v.src = o.src; v.muted = true; v.loop = true; v.autoplay = true; v.playsInline = true; v.setAttribute('aria-hidden', 'true'); v.style.cssText = 'width:100%;height:100%;object-fit:cover'; layer.append(v); v.play().catch(() => { }); } wrap.append(layer); el.append(wrap); });
  // Grid of characters that reveal text by scrambling matrix-style. data-opts {"text":"MAGIC","cols":24,"rows":8}
  register('glyph-matrix', el => { const o = U.opts(el, { text: el.textContent.trim() || 'MAGIC', cols: 28, rows: 7, chars: '#%&@*+=-:.', speed: 70 }); el.classList.add('fx-glyphm'); el.setAttribute('aria-label', o.text); el.style.fontSize = el.style.fontSize || '12px'; const off = document.createElement('canvas'); off.width = o.cols; off.height = o.rows; const x = off.getContext('2d', { willReadFrequently: true }); let fs = o.rows; x.font = `900 ${fs}px sans-serif`; while (x.measureText(o.text).width > o.cols - 2 && fs > 3) { fs--; x.font = `900 ${fs}px sans-serif`; } x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(o.text, o.cols / 2, o.rows / 2 + .5); const d = x.getImageData(0, 0, o.cols, o.rows).data; const on = []; for (let i = 0; i < o.cols * o.rows; i++) on.push(d[i * 4 + 3] > 100); let f = 0; const render = () => { let s = ''; for (let r = 0; r < o.rows; r++) { for (let c = 0; c < o.cols; c++) { const i = r * o.cols + c, settle = c * 1.2 + r * 2; s += on[i] ? (f > settle ? '█' : o.chars[Math.random() * o.chars.length | 0]) : (Math.random() < .12 && f < 40 ? o.chars[Math.random() * o.chars.length | 0] : ' '); } s += '\n'; } el.textContent = s; }; render(); if (U.RM) return (f = 99, render()); let id; U.inview(el, () => { id = setInterval(() => { f++; render(); if (f > o.cols * 1.2 + o.rows * 2 + 8) clearInterval(id); }, o.speed); }); return () => clearInterval(id); });

  // ---- media ----
  // Image that starts pixelated and sharpens on view (canvas), or on hover
  register('pixel-image', el => { const o = U.opts(el, { steps: [4, 8, 16, 32, 64, 128, 0], every: 160, trigger: 'view' }); const im = el.querySelector('img') || (el.tagName === 'IMG' ? el : null); if (!im) return; const src = im.currentSrc || im.src; el.classList.add('fx-pxi'); const cv = document.createElement('canvas'); const host = el.tagName === 'IMG' ? null : el; const target = host || (() => { const w = document.createElement('span'); w.className = 'fx-pxi'; w.style.cssText = 'display:inline-block'; im.replaceWith(w); return w; })(); const img = new Image(); img.crossOrigin = 'anonymous'; let ready = false; const draw = n => { const W = target.clientWidth || 300, H = target.clientHeight || W * img.naturalHeight / img.naturalWidth; cv.width = W; cv.height = H; const c = cv.getContext('2d'); c.imageSmoothingEnabled = false; if (!n) { c.imageSmoothingEnabled = true; c.drawImage(img, 0, 0, W, H); return; } const tmp = document.createElement('canvas'); tmp.width = n; tmp.height = Math.max(1, Math.round(n * H / W)); tmp.getContext('2d').drawImage(img, 0, 0, tmp.width, tmp.height); c.drawImage(tmp, 0, 0, W, H); };
    img.onload = () => { ready = true; target.append(cv); cv.style.cssText = 'display:block;width:100%;height:100%'; draw(o.steps[0]); const run = () => { let i = 0; const id = setInterval(() => { draw(o.steps[i++]); if (i >= o.steps.length) clearInterval(id); }, o.every); }; if (U.RM) draw(0); else if (o.trigger === 'hover') { target.addEventListener('pointerenter', () => { draw(o.steps[0]); run(); }); draw(0); } else U.inview(target, run); }; img.src = src; im.style.display = 'none'; target.setAttribute('role', 'img'); target.setAttribute('aria-label', im.alt || ''); });
  // Magnifier lens following the cursor over an image/element. data-opts {"zoom":2,"size":130}
  register('lens', el => { if (!U.fine) return; const o = U.opts(el, { zoom: 2, size: 130 }); const im = el.querySelector('img'); el.classList.add('fx-lensc'); const l = document.createElement('div'); l.style.cssText = `position:absolute;width:${o.size}px;height:${o.size}px;border-radius:50%;pointer-events:none;opacity:0;transition:opacity .2s,transform .2s;transform:scale(.6);border:2px solid rgba(255,255,255,.85);box-shadow:0 8px 28px rgba(0,0,0,.4);background-repeat:no-repeat;z-index:5`; el.append(l); if (im) l.style.backgroundImage = `url("${im.currentSrc || im.src}")`; el.addEventListener('pointermove', e => { const p = U.local(el, e); l.style.opacity = 1; l.style.transform = 'scale(1)'; l.style.left = p.x - o.size / 2 + 'px'; l.style.top = p.y - o.size / 2 + 'px'; l.style.backgroundSize = `${p.w * o.zoom}px ${p.h * o.zoom}px`; l.style.backgroundPosition = `${-(p.x * o.zoom - o.size / 2)}px ${-(p.y * o.zoom - o.size / 2)}px`; }); el.addEventListener('pointerleave', () => { l.style.opacity = 0; l.style.transform = 'scale(.6)'; }); });
  // Stack of overlapping avatars. Children = <img> or elements; data-opts {"more":12}
  register('avatar-circles', el => { const o = U.opts(el, { more: 0 }); el.classList.add('fx-ava'); if (o.more) { const m = document.createElement('a'); m.textContent = '+' + o.more; m.href = o.href || '#'; el.append(m); } });
  // Before/after code diff. Children: first <pre> = before, second = after. data-opts {"a":"Before","b":"After"}
  register('code-comparison', el => { const o = U.opts(el, { a: 'Before', b: 'After' }); el.classList.add('fx-codec'); const [l, r] = el.children; l.classList.add('L'); r.classList.add('R'); const t1 = document.createElement('span'), t2 = document.createElement('span'); t1.className = 'tg a'; t2.className = 'tg b'; t1.textContent = o.a; t2.textContent = o.b; el.append(t1, t2); l.style.paddingTop = r.style.paddingTop = '2.4em'; });
  // File tree from nested <ul><li>. Folders = <li> containing <ul>. Click to expand.
  register('file-tree', el => { el.classList.add('fx-ftree'); const walk = ul => [...ul.children].forEach(li => { const sub = li.querySelector(':scope>ul'); const row = document.createElement('div'); row.className = 'row'; [...li.childNodes].filter(n => n !== sub).forEach(n => row.append(n)); li.prepend(row); if (!sub) { row.style.paddingLeft = '1.15em'; return; } const ch = document.createElement('span'); ch.className = 'ch'; ch.textContent = '▶'; row.prepend(ch); const wr = document.createElement('div'); wr.className = 'wr'; const inner = document.createElement('div'); inner.append(sub); wr.append(inner); li.append(wr); li.classList.toggle('open', li.hasAttribute('data-open')); const tog = () => li.classList.toggle('open'); row.addEventListener('click', tog); row.tabIndex = 0; row.setAttribute('role', 'button'); row.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tog(); } }); walk(sub); }); const root = el.querySelector('ul'); if (root) walk(root); });

  // Fake terminal that types commands and prints output. data-opts {"lines":["$ npm i magic","added 1 package"],"speed":38}
  register('terminal', el => { const o = U.opts(el, { lines: ['$ npm create vite@latest', 'Scaffolding project…', '✔ Done in 1.2s', '$ npm run dev', 'ready in 312 ms'], speed: 38, pause: 380, loop: false }); el.classList.add('fx-term'); el.setAttribute('role', 'img'); el.setAttribute('aria-label', o.lines.join('. ')); el.innerHTML = '<div class="bar"><i></i><i></i><i></i></div><div class="body"></div>'; const body = el.querySelector('.body'); const sleep = ms => new Promise(r => setTimeout(r, ms)); let alive = true; const row = () => { const d = document.createElement('div'); body.append(d); return d; };
    (async () => { await new Promise(r => U.inview(el, r)); do { body.textContent = ''; for (const ln of o.lines) { if (!alive) return; const d = row(); const cmd = ln.startsWith('$'); if (cmd && !U.RM) { d.innerHTML = '<span class="p">$</span> <span class="t"></span><span class="cur"></span>'; const t = d.querySelector('.t'); for (const c of ln.slice(2)) { t.textContent += c; await sleep(o.speed * (.5 + Math.random())); } d.querySelector('.cur').remove(); } else d.innerHTML = cmd ? `<span class="p">$</span> ${ln.slice(2)}` : ln; await sleep(o.pause); } if (o.loop) await sleep(2200); } while (o.loop && alive); body.insertAdjacentHTML('beforeend', '<span class="cur"></span>'); })(); return () => alive = false; });

  // Device frames: wrap any <img>/<video>/<div> child as the screen
  const frame = (name, cls) => register(name, el => { const o = U.opts(el, { width: 240 }); el.classList.add(cls); el.style.setProperty('--fx-w', o.width + 'px'); const scr = document.createElement('div'); scr.className = 'scr'; while (el.firstChild) scr.append(el.firstChild); el.append(scr); });
  frame('iphone', 'fx-iph'); frame('android', 'fx-and');
  register('safari', el => { const o = U.opts(el, { url: 'example.com' }); el.classList.add('fx-saf'); const bar = document.createElement('div'); bar.className = 'bar'; bar.innerHTML = `<div class="dots"><i style="background:#ff5f56"></i><i style="background:#ffbd2e"></i><i style="background:#27c93f"></i></div><div class="url">🔒 ${o.url}</div><div style="width:42px"></div>`; const c = document.createElement('div'); c.className = 'cnt'; while (el.firstChild) c.append(el.firstChild); el.append(bar, c); });
  // Thumbnail that opens a lightbox video (YouTube/Vimeo URL or mp4). data-opts {"src":"https://www.youtube.com/embed/ID"}
  register('hero-video-dialog', el => { const o = U.opts(el, { src: '' }); el.classList.add('fx-hvd'); el.setAttribute('role', 'button'); el.tabIndex = 0; el.setAttribute('aria-label', 'Play video'); const p = document.createElement('div'); p.className = 'play'; p.innerHTML = '<i></i>'; el.append(p); const open = () => { const d = document.createElement('div'); d.className = 'fx-hvd-dlg'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true'); const box = document.createElement('div'); box.innerHTML = /\.(mp4|webm)(\?|$)/.test(o.src) ? `<video src="${o.src}" controls autoplay playsinline></video>` : `<iframe src="${o.src}${o.src.includes('?') ? '&' : '?'}autoplay=1" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen title="Video"></iframe>`; const x = document.createElement('button'); x.type = 'button'; x.setAttribute('aria-label', 'Close'); x.textContent = '✕'; d.append(box, x); document.body.append(d); requestAnimationFrame(() => d.classList.add('on')); const close = () => { d.classList.remove('on'); setTimeout(() => d.remove(), 300); removeEventListener('keydown', esc); el.focus(); }; const esc = e => e.key === 'Escape' && close(); addEventListener('keydown', esc); x.addEventListener('click', close); d.addEventListener('click', e => e.target === d && close()); x.focus(); }; el.addEventListener('click', open); el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } }); });

  // ---- widgets ----
  // Sun/moon toggle that flips <html class="dark"> and data-theme, remembers in localStorage (guarded)
  register('animated-theme-toggler', el => { el.classList.add('fx-theme'); el.setAttribute('aria-label', 'Toggle theme'); el.innerHTML = '<span class="s">☀</span><span class="m">☾</span>'; const root = document.documentElement; let dark = root.classList.contains('dark') || root.dataset.theme === 'dark'; try { const s = localStorage.getItem('fx-theme'); if (s) dark = s === 'dark'; } catch (e) { } const apply = () => { root.classList.toggle('dark', dark); root.dataset.theme = dark ? 'dark' : 'light'; el.classList.toggle('dark', dark); el.setAttribute('aria-pressed', dark); try { localStorage.setItem('fx-theme', dark ? 'dark' : 'light'); } catch (e) { } el.dispatchEvent(new CustomEvent('fx-input', { detail: dark })); }; apply(); el.addEventListener('click', () => { const go = () => { dark = !dark; apply(); }; if (document.startViewTransition && !U.RM) document.startViewTransition(go); else go(); }); });
  // Circular progress ring. data-opts {"value":72,"size":120,"color":"#7c5cff"}; el.fxSet(n)
  register('animated-circular-progress-bar', el => { const o = U.opts(el, { value: 70, size: 120, color: '#7c5cff', track: 'rgba(127,127,127,.25)', width: 10 }); el.classList.add('fx-cpb'); el.style.width = el.style.height = o.size + 'px'; const R = 50 - o.width / 2, C = 2 * Math.PI * R; el.innerHTML = `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="${R}" fill="none" stroke="${o.track}" stroke-width="${o.width}"/><circle class="p" cx="50" cy="50" r="${R}" fill="none" stroke="${o.color}" stroke-width="${o.width}" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C}" style="transition:stroke-dashoffset 1.2s cubic-bezier(.2,.8,.2,1)"/></svg><span class="v" style="font-size:${o.size * .22}px">0%</span>`; el.setAttribute('role', 'progressbar'); el.setAttribute('aria-valuemin', 0); el.setAttribute('aria-valuemax', 100); const p = el.querySelector('.p'), v = el.querySelector('.v'); let cur = 0; const set = n => { const t0 = performance.now(), from = cur; p.style.strokeDashoffset = C * (1 - n / 100); el.setAttribute('aria-valuenow', Math.round(n)); const step = now => { const k = Math.min(1, (now - t0) / 1200), e = 1 - Math.pow(1 - k, 3); cur = from + (n - from) * e; v.textContent = Math.round(cur) + '%'; if (k < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); }; el.fxSet = set; U.inview(el, () => set(o.value)); });
  // Page scroll progress bar (fixed to the top). Put on any element (it creates the bar) — one per page.
  register('scroll-progress', el => { const o = U.opts(el, { height: 3, color: '' }); const b = document.createElement('div'); b.className = 'fx-scrollp'; b.setAttribute('role', 'progressbar'); b.setAttribute('aria-hidden', 'true'); b.style.setProperty('--fx-sph', o.height + 'px'); if (o.color) b.style.setProperty('--fx-spc', o.color); document.body.append(b); const upd = () => { const h = document.documentElement.scrollHeight - innerHeight; b.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`; }; addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd(); return () => { b.remove(); removeEventListener('scroll', upd); }; });
  // Custom label pointer: a coloured arrow + name tag that follows the cursor while over the element (collab-cursor style)
  register('pointer', el => { if (!U.fine || U.RM) return; const o = U.opts(el, { label: 'You', color: '#7c5cff' }); const p = document.createElement('div'); p.className = 'fx-ptr'; p.style.opacity = 0; p.style.transition = 'opacity .2s'; p.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" style="display:block"><path d="M3 2l17 8-7 2-3 7z" fill="${o.color}" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg><span style="position:absolute;left:18px;top:18px;background:${o.color};color:#fff;font:600 12px system-ui;padding:.2em .6em;border-radius:99px;white-space:nowrap">${o.label}</span>`; document.body.append(p); el.style.cursor = 'none'; let x = 0, y = 0, tx = 0, ty = 0; el.addEventListener('pointerenter', e => { x = tx = e.clientX; y = ty = e.clientY; p.style.opacity = 1; }); el.addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; }); el.addEventListener('pointerleave', () => p.style.opacity = 0); const stop = U.loop(document.documentElement, () => { x = U.lerp(x, tx, .35); y = U.lerp(y, ty, .35); p.style.transform = `translate(${x}px,${y}px)`; }); return () => { stop(); p.remove(); }; });
  // Smooth spring cursor arrow replacing the system cursor (page-wide)
  register('smooth-cursor', el => { if (!U.fine || U.RM) return; const o = U.opts(el, { color: '#111', stroke: '#fff' }); const c = document.createElement('div'); c.className = 'fx-ptr'; c.innerHTML = `<svg width="26" height="26" viewBox="0 0 24 24" style="display:block;filter:drop-shadow(0 2px 3px rgba(0,0,0,.35))"><path d="M3 2l17 8-7 2-3 7z" fill="${o.color}" stroke="${o.stroke}" stroke-width="1.4" stroke-linejoin="round"/></svg>`; document.body.append(c); const st = document.createElement('style'); st.textContent = '*{cursor:none!important}'; document.head.append(st); let x = U.ptr.x, y = U.ptr.y, vx = 0, vy = 0, rot = 0, sc = 1;
    const stop = U.loop(document.documentElement, () => { vx += (U.ptr.x - x) * .14; vy += (U.ptr.y - y) * .14; vx *= .6; vy *= .6; x += vx; y += vy; const sp = Math.hypot(vx, vy); rot = U.lerp(rot, sp > 1.5 ? Math.atan2(vy, vx) * 57.3 + 90 - 55 : 0, .12); sc = U.lerp(sc, U.ptr.down ? .8 : 1 + Math.min(sp / 60, .2), .2); c.style.transform = `translate(${x}px,${y}px) rotate(${rot}deg) scale(${sc})`; }); return () => { stop(); c.remove(); st.remove(); }; });
  // 3D cloud of icons/labels on a sphere that speeds toward the cursor. Children = icons.
  register('icon-cloud', el => FX.run('infinite-menu', el));
  // Static quote card (no network). data-opts {"name":"Ada","handle":"@ada","text":"…"}; avatar via <img> child
  register('tweet-card', el => { const o = U.opts(el, { name: 'Ada Lovelace', handle: '@ada', text: el.textContent.trim(), date: '', avatar: '' }); el.classList.add('fx-tweet'); const av = o.avatar ? `<img src="${o.avatar}" alt="">` : '<i></i>'; el.innerHTML = `<div class="hd">${av}<div><div class="nm">${o.name}</div><div class="hn">${o.handle}</div></div></div><div class="tx"></div>${o.date ? `<div class="ft">${o.date}</div>` : ''}`; el.querySelector('.tx').textContent = o.text; });

  // ---- aliases of effects already in the kit (same behaviour under the Magic UI names) ----
  const alias = (n, to, def = {}) => register(n, el => { el.dataset.opts = JSON.stringify(Object.assign({}, def, U.opts(el, {}))); return FX.run(to, el); });
  alias('animated-gradient-text', 'gradient-text'); alias('animated-shiny-text', 'shiny-text'); alias('blur-fade', 'reveal', { from: 'up', blur: true, dist: 18 });
  alias('typing-animation', 'type-text'); alias('word-rotate', 'rotating-text'); alias('number-ticker', 'count-up'); alias('scroll-based-velocity', 'scroll-velocity');
  alias('hyper-text', 'scramble-text'); alias('text-reveal', 'scroll-reveal'); alias('spinning-text', 'circular-text'); alias('text-animate', 'blur-text');
  alias('marquee', 'logo-loop'); alias('magic-card', 'spotlight-card'); alias('bento-grid', 'magic-bento'); alias('noise-texture', 'noise'); alias('progressive-blur', 'gradual-blur');
  alias('light-rays', 'bg-light-rays'); alias('particles', 'bg-particles');
})();

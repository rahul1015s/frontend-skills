/* FX — vanilla effects kit. Original implementations (no dependencies).
   Usage: <el data-fx="blur-text" data-opts='{"delay":60}'>Hello</el>  then FX.init() (auto on DOMContentLoaded).
   Effects inspired by the kinds of motion found on reactbits.dev; all code here is written from scratch. */
(function (g) {
  'use strict';
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
  function shaderBg(el, frag, o = {}) {
    const { c, ctx: gl, size } = canvasIn(el, 'webgl', { antialias: false, alpha: true, premultipliedAlpha: true });
    if (!gl) { c.remove(); return null; }
    const mk = (t, s) => { const sh = gl.createShader(t); gl.shaderSource(sh, s); gl.compileShader(sh); if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) console.warn('FX shader:', gl.getShaderInfoLog(sh)); return sh; };
    const pr = gl.createProgram(); gl.attachShader(pr, mk(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, mk(gl.FRAGMENT_SHADER, 'precision highp float;uniform vec2 uRes;uniform float uTime;uniform vec2 uMouse;uniform vec3 uA;uniform vec3 uB;uniform vec3 uC;uniform float uS;\n' + frag));
    gl.linkProgram(pr); gl.useProgram(pr);
    const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = n => gl.getUniformLocation(pr, n);
    const [uRes, uTime, uMouse, uA, uB, uC, uS] = ['uRes', 'uTime', 'uMouse', 'uA', 'uB', 'uC', 'uS'].map(U);
    const cols = (o.colors || []).map(hex); const m = { x: .5, y: .5, tx: .5, ty: .5 };
    const mm = e => { const l = local(el, e); m.tx = l.nx; m.ty = 1 - l.ny; }; if (o.mouse) el.addEventListener('pointermove', mm);
    const draw = (t) => {
      m.x = lerp(m.x, m.tx, .06); m.y = lerp(m.y, m.ty, .06);
      gl.viewport(0, 0, c.width, c.height); gl.uniform2f(uRes, c.width, c.height); gl.uniform1f(uTime, t * (o.speed || 1)); gl.uniform2f(uMouse, m.x, m.y);
      gl.uniform3fv(uA, cols[0] || [1, 1, 1]); gl.uniform3fv(uB, cols[1] || cols[0] || [1, 1, 1]); gl.uniform3fv(uC, cols[2] || cols[1] || cols[0] || [1, 1, 1]); gl.uniform1f(uS, o.scale || 1);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    if (RM) { draw(3); return () => { }; }
    return loop(el, draw);
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
  g.FX = { register, init, destroy, util: { $, $$, clamp, lerp, rand, hex, opts, loop, inview, ptr, fine, split, canvasIn, local, shaderBg, NOISE_GLSL, RM } };
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

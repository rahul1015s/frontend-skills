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

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

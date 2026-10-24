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

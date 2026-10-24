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

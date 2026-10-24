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

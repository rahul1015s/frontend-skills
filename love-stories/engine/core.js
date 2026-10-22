/* ───────── LoveStory(config): builds scenes from a script and drives them with scroll ───────── */
const SKY = {
  night: ['#070b1f', '#141a47', '#2c2f6b'], 'rain-night': ['#161c36', '#262f54', '#3b4670'], rain: ['#4a5775', '#6a7794', '#8b97ad'], dusk: ['#2d1b4e', '#8a3b6e', '#ff8a5c'],
  dawn: ['#3b2a6b', '#ff7aa2', '#ffd1a1'], golden: ['#ff9a6a', '#ffc78a', '#ffeab8'], blush: ['#ffd1dc', '#ffb3c7', '#ff8fab'], sunny: ['#5cb8ff', '#a8dcff', '#fff1c9'],
  candle: ['#1a0a12', '#3b0f22', '#7a1d35'], lavender: ['#3a2f6b', '#7b5fb0', '#e0a8ff'], space: ['#03030c', '#0b0a2a', '#1b0f3b'], void: ['#0d0e1a', '#12142a', '#1a1d3a'], rose: ['#7a1d4a', '#d6457a', '#ffb3c7'], mint: ['#0e3b43', '#2a8c82', '#a8e6cf']
};
function LoveStory(cfg) {
  const G = window.gsap, ST = window.ScrollTrigger; G.registerPlugin(ST);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, portrait = innerWidth / innerHeight < 0.9;
  const S = cfg.scenes, N = S.length, el = (t, c, h, p) => { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; (p || null) && p.append(e); return e; };
  document.title = cfg.title || document.title;
  const stage = el('div'); stage.id = 'stage'; document.body.prepend(stage);
  const scenesEl = el('div', 'scenes', '', stage); scenesEl.style.cssText = 'position:absolute;inset:0';
  const fxc = el('canvas', 'layer-fx', '', stage); FX.init(fxc, { reduce });
  const bloomEl = el('div', '', '', stage); bloomEl.id = 'bloom'; const bloomBg = el('div', 'bloom-bg', '', bloomEl);
  const capsEl = el('div', '', '', stage);
  const bar = el('div'); bar.id = 'bar'; document.body.append(bar);
  const play = el('button', '', '▶ Play'); play.id = 'play'; play.type = 'button'; play.setAttribute('aria-label', 'Play as a video'); document.body.append(play);
  const hint = el('div', '', '<i></i>scroll'); hint.id = 'hint'; document.body.append(hint);
  const track = el('div'); track.id = 'track'; document.body.append(track);
  const per = () => Math.max(innerHeight * 0.95, 600); const sizeTrack = () => { track.style.height = (N * per() + innerHeight) + 'px'; }; sizeTrack();

  /* flower fill layer */
  const BC = cfg.bloomColors || ['#ff4d6d', '#ff8fab', '#ffd166', '#ffffff', '#ff6b8b', '#ffb3c7'], BT = ['rose', 'daisy', 'tulip', 'cherry', 'sunflower'];
  const cols = portrait ? 4 : 8, rows = portrait ? 7 : 5, bbs = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const b = el('div', 'bb', Props.blossom(BT[(r * cols + c) % 5], BC[(r + c * 2) % BC.length]), bloomEl); b.style.left = ((c + .5 + (r % 2 ? .25 : -.25) * .6) / cols * 100) + '%'; b.style.top = ((r + .5) / rows * 100) + '%'; b.style.width = (100 / cols * 1.7) + '%'; bbs.push(b); }
  G.set(bbs, { scale: 0 });
  const bloomIn = (tl, t, d) => { tl.set(bloomEl, { visibility: 'visible' }, t).fromTo(bloomBg, { opacity: 0 }, { opacity: 1, duration: d * .8, immediateRender: false }, t).fromTo(bbs, { scale: 0, rotation: () => G.utils.random(-70, 70) }, { scale: 1, rotation: () => G.utils.random(-15, 15), duration: d * .8, stagger: { each: d * .2 / bbs.length, from: 'random' }, ease: 'back.out(1.5)', immediateRender: false }, t); };
  const bloomOut = (tl, t, d) => { tl.to(bbs, { scale: 0, rotation: () => G.utils.random(-70, 70), duration: d * .8, stagger: { each: d * .2 / bbs.length, from: 'random' }, ease: 'power2.in', immediateRender: false }, t).to(bloomBg, { opacity: 0, duration: d * .7, immediateRender: false }, t + d * .3).set(bloomEl, { visibility: 'hidden' }, t + d); };

  const tl = G.timeline({ paused: true, defaults: { ease: 'none' } });
  const A = { fade: { opacity: 0 }, rise: { opacity: 0, yPercent: 40 }, drop: { opacity: 0, yPercent: -60 }, pop: { opacity: 0, scale: .2 }, 'slide-l': { opacity: 0, xPercent: -80 }, 'slide-r': { opacity: 0, xPercent: 80 }, grow: { opacity: 0, scaleY: 0, transformOrigin: '50% 100%' }, none: null };
  const sceneEls = [];

  S.forEach((sc, i) => {
    const t0 = i, sky = SKY[sc.sky] || (Array.isArray(sc.sky) ? sc.sky : SKY.night), skyTo = sc.skyTo ? (SKY[sc.skyTo] || sc.skyTo) : null;
    const se = el('div', 'scene', '', scenesEl); se.style.setProperty('--gy', (sc.ground || 78) + '%'); sceneEls.push(se);
    const cam = el('div', 'cam', '', se); cam.style.cssText += ';--c1:' + sky[0] + ';--c2:' + sky[1] + ';--c3:' + sky[2]; if (sc.focus) cam.style.transformOrigin = sc.focus;
    el('div', 'sky', '', cam);
    (sc.props || []).forEach((pd, k) => {
      let spec, wrap, w;
      if (pd.p === 'figure' || pd.p === 'couple') {
        const L = (who, o) => Object.assign({}, cfg[who] || {}, o || {});
        const f = pd.p === 'figure' ? Figures.figure(pd.pose || 'stand', L(pd.who || 'she', Object.assign({ who: pd.who || 'she' }, pd))) : Figures.pair(pd.pose || 'holdhands', L('he', pd.he), L('she', Object.assign({}, pd.she || {}, pd.umbrella ? { umbrella: pd.umbrella } : {})));
        spec = { w: (pd.p === 'figure' ? .4 : .74) * (pd.s || 1), html: f.svg, anchor: 'b' };
      } else spec = Props.make(pd.p, pd);
      if (!spec) { console.warn('unknown prop', pd.p); return; }
      let inner;
      if (spec.full) { wrap = el('div', 'full ' + (pd.idle || spec.idle || ''), spec.html, cam); inner = wrap; }
      else {
        wrap = el('div', 'prop ' + (spec.anchor === 'b' ? 'b ' : '') + (pd.idle === undefined ? (spec.idle || '') : pd.idle), '', cam); inner = el('div', 'inn', spec.html, wrap);
        const y = pd.y === undefined ? 'g' : pd.y;
        wrap.style.left = (pd.x ?? 50) + '%'; wrap.style.top = y === 'g' ? 'var(--gy)' : (typeof y === 'string' && y.endsWith('%') ? y : y + '%'); if (spec.w) wrap.style.width = `calc(var(--u)*${(spec.w * (pd.p === 'figure' || pd.p === 'couple' ? 1 : (pd.s || 1))).toFixed(3)})`;
      }
      if (pd.z !== undefined) wrap.style.zIndex = pd.z;
      if (pd.flip && pd.p !== 'figure') wrap.style.scale = '-1 1';
      /* pose crossfade */
      let wrap2 = null;
      if (pd.pose2 && (pd.p === 'figure' || pd.p === 'couple')) { const f2 = pd.p === 'figure' ? Figures.figure(pd.pose2, Object.assign({ who: pd.who || 'she' }, cfg[pd.who || 'she'] || {}, pd)) : Figures.pair(pd.pose2, Object.assign({}, cfg.he || {}, pd.he || {}), Object.assign({}, cfg.she || {}, pd.she || {})); wrap2 = el('div', 'prop b ' + (pd.idle || ''), '', cam); el('div', 'inn', f2.svg, wrap2); wrap2.style.cssText += `;left:${wrap.style.left};top:${wrap.style.top};width:${wrap.style.width};opacity:0`; if (pd.z !== undefined) wrap2.style.zIndex = pd.z; }
      const at = pd.at ?? (0.04 + k * 0.012), d = pd.d ?? 0.22, a = pd.a === undefined ? 'fade' : pd.a;
      if (a && A[a]) tl.from(inner, Object.assign({}, A[a], { duration: d, ease: 'power2.out' }), t0 + at);
      if (wrap2) { const pa = pd.pose2at ?? 0.5; tl.to(wrap, { opacity: 0, duration: .08, immediateRender: false }, t0 + pa).to(wrap2, { opacity: 1, duration: .08, immediateRender: false }, t0 + pa); }
      if (pd.to) { const dur = pd.toD ?? 0.7, st = t0 + (pd.toAt ?? 0.1), pos = { duration: dur, ease: 'none', immediateRender: false }; if (pd.to.x !== undefined) pos.left = pd.to.x + '%'; if (pd.to.y !== undefined) pos.top = pd.to.y + '%'; const ts = [wrap, wrap2].filter(Boolean); if (pos.left || pos.top) tl.to(ts, pos, st); if (pd.to.s !== undefined || pd.to.r !== undefined) { const tr = { duration: dur, ease: 'none', immediateRender: false }; if (pd.to.s !== undefined) tr.scale = pd.to.s; if (pd.to.r !== undefined) tr.rotation = pd.to.r; tl.to(ts.map(w => w.firstElementChild), tr, st); } }
      if (spec.hook) spec.hook(inner, tl, t0 + at, d + (pd.hd || 0.2));
      /* parallax drift for hills */
    });
    /* hills parallax and camera push */
    cam.querySelectorAll('.hill').forEach(h => { const k = +h.dataset.k; tl.fromTo(h, { x: 0 }, { x: (k - 1) * -14, duration: 1, immediateRender: false }, t0); });
    tl.fromTo(cam, { scale: sc.zoom ? sc.zoom[0] : 1.0 }, { scale: sc.zoom ? sc.zoom[1] : 1.07, duration: 1.1, ease: 'none' }, t0 - .05);
    /* sky morph inside the scene */
    if (skyTo) tl.to(cam, { '--c1': skyTo[0], '--c2': skyTo[1], '--c3': skyTo[2], duration: sc.skyD ?? .6, ease: 'none', immediateRender: false }, t0 + (sc.skyAt ?? .15));
    /* scene fade in / out */
    if (i === 0) tl.set(se, { autoAlpha: 1 }, 0); else tl.fromTo(se, { autoAlpha: 0 }, { autoAlpha: 1, duration: .14 }, t0 - .12);
    if (i < N - 1) tl.to(se, { autoAlpha: 0, duration: .14, immediateRender: false }, t0 + .88);
    /* caption */
    if (sc.cap) {
      const lum = h => { const v = [1, 3, 5].map(k => parseInt(h.slice(k, k + 2), 16)); return .299 * v[0] + .587 * v[1] + .114 * v[2]; };
      const skyL = (lum(sky[0]) + lum(sky[2]) + (skyTo ? lum(skyTo[0]) + lum(skyTo[2]) : lum(sky[0]) + lum(sky[2]))) / 4;
      const c = el('div', 'cap' + (skyL > 150 ? ' dark' : ''), `<div class="line">${sc.cap.split(/\s+/).map(w => `<span class="w">${w}</span>`).join(' ')}</div>${sc.whisper ? `<div class="whisper">${sc.whisper}</div>` : ''}`, capsEl); c.dataset.pos = sc.capPos || 'top'; if (sc.capColor) c.style.color = sc.capColor;
      const ws = c.querySelectorAll('.w'), wh = c.querySelector('.whisper');
      tl.fromTo(ws, { opacity: 0, y: 26, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .16, stagger: .02, ease: 'power2.out' }, t0 + (sc.capAt ?? .08));
      if (wh) tl.fromTo(wh, { opacity: 0, y: 14 }, { opacity: .92, y: 0, duration: .14, ease: 'power2.out' }, t0 + (sc.capAt ?? .08) + .2);
      if (i < N - 1) tl.to(c, { opacity: 0, duration: .1, immediateRender: false }, t0 + (sc.out === 'bloom' ? .6 : .83));
    }
    /* transition into the next scene */
    if (sc.out === 'bloom' && i < N - 1) { bloomIn(tl, t0 + .66, .26); bloomOut(tl, t0 + 1.06, .3); }
  });
  tl.set({}, {}, N);

  /* finale */
  const f = cfg.finale, last = N - 1;
  let ask = null, yesmsg = null;
  if (f) {
    ask = el('div', 'ask', `<h2>${f.q}</h2><div class="btns"><button class="btn yes" type="button">${f.yes || 'Yes 💗'}</button><button class="btn no" type="button">${f.no || 'No'}</button></div>`, stage);
    ask.dataset.pos = f.pos || 'high';
    tl.fromTo(ask, { autoAlpha: 0 }, { autoAlpha: 1, duration: .2, ease: 'power2.out' }, last + .32);
    yesmsg = el('div', 'yesmsg', `<h3>${f.yesTitle || 'Thank you'}</h3>${(f.letter || []).map(l => `<p>${l}</p>`).join('')}${f.reply ? `<a href="${f.reply.url}" target="_blank" rel="noopener">${f.reply.label}</a>` : ''}`, stage);
    const yes = ask.querySelector('.yes'), no = ask.querySelector('.no'), btns = ask.querySelector('.btns'); let dodge = 0;
    const flee = (e) => { e && e.preventDefault(); const r = btns.getBoundingClientRect(), nb = no.getBoundingClientRect(); dodge++; no.style.position = 'fixed'; const x = G.utils.random(14, innerWidth - nb.width - 14), y = G.utils.random(innerHeight * .2, innerHeight - nb.height - 20); no.style.left = x + 'px'; no.style.top = y + 'px'; no.style.transform = `scale(${Math.max(.55, 1 - dodge * .07)})`; if (dodge === 6) no.textContent = f.noGiveUp || 'ok fine… yes'; };
    const gentle = f.dodge === false;
    if (gentle) { const note = el('p', 'nonote', '', ask); note.style.cssText = 'margin:0;font:400 clamp(22px,5vw,32px)/1.2 Caveat,cursive;opacity:0;text-shadow:0 2px 20px rgba(0,0,0,.5);transition:opacity .5s'; note.textContent = f.noMsg || 'That’s okay. Take all the time you need.'; no.addEventListener('click', () => { note.style.opacity = 1; setTimeout(() => { note.style.opacity = 0; }, 3800); }); }
    else { no.addEventListener('pointerenter', flee); no.addEventListener('touchstart', flee, { passive: false }); no.addEventListener('click', e => { if (dodge >= 6) yes.click(); else flee(e); }); }
    yes.addEventListener('click', () => {
      FX.set('hearts'); FX.burst(160);
      const t2 = G.timeline(); bloomEl.style.visibility = 'visible';
      t2.to(ask, { autoAlpha: 0, duration: .3 }, 0).to(bloomBg, { opacity: 1, duration: .8 }, 0).to(bbs, { scale: 1, rotation: () => G.utils.random(-15, 15), duration: .9, stagger: { each: .012, from: 'random' }, ease: 'back.out(1.5)' }, 0)
        .to(yesmsg, { autoAlpha: 1, duration: .6 }, .8).fromTo(yesmsg.children, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .6, stagger: .4, ease: 'power2.out' }, .8).add(() => yesmsg.classList.add('on'), 1.1);
      stage.querySelectorAll('.cap').forEach(c => c.style.display = 'none'); hint.style.display = 'none';
    });
  }

  /* scroll binding */
  let cur = -1;
  const fxFor = i => (S[i] && S[i].fx) || 'none';
  ST.create({
    trigger: track, start: 'top top', end: 'bottom bottom', scrub: reduce ? true : 0.7, animation: tl,
    onUpdate: self => {
      bar.style.transform = `scaleX(${self.progress})`;
      const i = Math.min(N - 1, Math.max(0, Math.floor(self.progress * N + 0.03))); if (i !== cur) { cur = i; FX.set(fxFor(i)); }
      if (self.progress > 0.02) hint.style.opacity = 0; else hint.style.opacity = .85;
      if (ask) ask.classList.toggle('on', self.progress > (last + .55) / N);
    }
  });
  FX.set(fxFor(0));
  addEventListener('resize', () => { sizeTrack(); ST.refresh(); });

  /* reel mode (auto-play like a video) */
  let playing = false; const secPer = cfg.reelSeconds || 4.6;
  const stop = () => { playing = false; play.textContent = '▶ Play'; };
  const start = () => { if (scrollY > (document.documentElement.scrollHeight - innerHeight) - 4) scrollTo(0, 0); playing = true; play.textContent = '❚❚ Pause'; };
  play.addEventListener('click', () => playing ? stop() : start());
  ['wheel', 'touchstart', 'keydown'].forEach(ev => addEventListener(ev, () => { if (playing) stop(); }, { passive: true }));
  G.ticker.add((time, dt) => { if (!playing) return; const max = document.documentElement.scrollHeight - innerHeight, y = scrollY + max / (N * secPer) * dt / 1000; scrollTo(0, y); if (y >= max - 2) stop(); });
  const qs = new URLSearchParams(location.search);
  if (qs.get('reel') === '1') { document.body.classList.add('reel'); play.style.display = 'none'; hint.style.display = 'none'; setTimeout(start, 1200); }
  const jump = parseFloat(qs.get('t')); if (!isNaN(jump)) setTimeout(() => { const max = document.documentElement.scrollHeight - innerHeight; scrollTo(0, jump / N * max); }, 300);
  return { tl, stop, start };
}

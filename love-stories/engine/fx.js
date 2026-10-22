/* ───────── particle effects on one canvas: rain, snow, petals, hearts, fireflies, sparkles, confetti ───────── */
const FX = (() => {
  let cv, ctx, W = 0, H = 0, dpr = 1, mode = 'none', next = 'none', parts = [], t0 = 0, max = 90, reduce = false, rnd = Math.random;
  const COL = { petals: ['#ffb3c7', '#ff8fab', '#ffd1dc', '#fff'], rose: ['#c1121f', '#e5383b', '#9d0208', '#ff4d6d'], hearts: ['#ff4d6d', '#ff8fab', '#ff6b8b', '#ffc2d1'], confetti: ['#ff4d6d', '#ffd166', '#06d6a0', '#4cc9f0', '#f72585', '#fff'] };
  const heart = (c, x, y, s) => { c.beginPath(); c.moveTo(x, y + s * .35); c.bezierCurveTo(x - s, y - s * .35, x - s * .55, y - s * 1.05, x, y - s * .45); c.bezierCurveTo(x + s * .55, y - s * 1.05, x + s, y - s * .35, x, y + s * .35); c.fill(); };
  let fwT = 0;
  const spawn = (m, burst) => {
    const p = { m, x: rnd() * W, y: -20, vx: 0, vy: 0, s: 1, r: 0, vr: 0, a: 1, life: 0, c: '#fff', ph: rnd() * 6.28 };
    if (m === 'rain') { p.vx = -1.5 - rnd(); p.vy = 14 + rnd() * 8; p.s = 10 + rnd() * 14; p.a = .25 + rnd() * .3; p.x = rnd() * (W + 100); }
    else if (m === 'snow') { p.vy = .6 + rnd() * 1.2; p.vx = .2; p.s = 1.5 + rnd() * 3; p.a = .5 + rnd() * .5; }
    else if (m === 'petals' || m === 'rose') { p.vy = .8 + rnd() * 1.4; p.vx = -.4 + rnd() * .8; p.s = 5 + rnd() * 7; p.vr = (rnd() - .5) * .06; p.c = COL[m === 'rose' ? 'rose' : 'petals'][(rnd() * 4) | 0]; p.a = .85; }
    else if (m === 'hearts') { p.y = H + 20; p.vy = -(.7 + rnd() * 1.3); p.s = 6 + rnd() * 12; p.c = COL.hearts[(rnd() * 4) | 0]; p.a = .75; }
    else if (m === 'fireflies') { p.y = rnd() * H; p.vx = (rnd() - .5) * .5; p.vy = (rnd() - .5) * .5; p.s = 1.6 + rnd() * 2.4; p.c = '#fff3a8'; }
    else if (m === 'spark') { p.vx = burst.vx; p.vy = burst.vy; p.x = burst.x; p.y = burst.y; p.s = 2 + rnd() * 1.8; p.c = burst.c; p.a = 1; }
    else if (m === 'sparkle') { p.y = rnd() * H; p.s = 2 + rnd() * 4; p.life = rnd() * 6; p.c = '#fff'; }
    else if (m === 'confetti') { const a = rnd() * 6.28, v = burst ? 6 + rnd() * 14 : 0; p.x = burst ? W / 2 : rnd() * W; p.y = burst ? H * .55 : -20; p.vx = Math.cos(a) * v; p.vy = burst ? Math.sin(a) * v - 4 : 1 + rnd() * 2.5; p.s = 5 + rnd() * 8; p.vr = (rnd() - .5) * .3; p.c = COL.confetti[(rnd() * 6) | 0]; p.heart = rnd() > .55; p.burst = burst; }
    return p;
  };
  const resize = () => { dpr = Math.min(window.devicePixelRatio || 1, 2); W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); max = W < 700 ? 60 : 100; };
  const draw = (p) => {
    ctx.globalAlpha = Math.max(0, p.a); ctx.fillStyle = p.c; ctx.strokeStyle = '#cfe3ff';
    if (p.m === 'rain') { ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + p.vx * 1.2, p.y - p.s); ctx.stroke(); }
    else if (p.m === 'snow' || p.m === 'fireflies') { if (p.m === 'fireflies') { ctx.shadowColor = '#fff3a8'; ctx.shadowBlur = 14; ctx.globalAlpha = .4 + .6 * Math.abs(Math.sin(p.life * 2 + p.ph)); } ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, 6.28); ctx.fill(); ctx.shadowBlur = 0; }
    else if (p.m === 'spark') { ctx.shadowColor = p.c; ctx.shadowBlur = 8; ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, 6.28); ctx.fill(); ctx.shadowBlur = 0; }
    else if (p.m === 'petals' || p.m === 'rose') { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.beginPath(); ctx.ellipse(0, 0, p.s, p.s * .55, 0, 0, 6.28); ctx.fill(); ctx.restore(); }
    else if (p.m === 'hearts') heart(ctx, p.x, p.y, p.s);
    else if (p.m === 'sparkle') { const k = Math.abs(Math.sin(p.life * 2 + p.ph)); ctx.globalAlpha = k * .9; ctx.fillRect(p.x - p.s * k, p.y - .6, p.s * 2 * k, 1.2); ctx.fillRect(p.x - .6, p.y - p.s * k, 1.2, p.s * 2 * k); }
    else if (p.m === 'confetti') { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); if (p.heart) heart(ctx, 0, 0, p.s); else ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); ctx.restore(); }
    ctx.globalAlpha = 1;
  };
  const tick = (time, dt) => {
    if (!ctx || reduce) return;
    const d = Math.min(dt / 16.7, 3); ctx.clearRect(0, 0, W, H);
    if (mode === 'fireworks') { fwT -= d; if (fwT <= 0) { fwT = 38 + rnd() * 40; const cx = W * (.15 + rnd() * .7), cy = H * (.12 + rnd() * .38), col = ['#ff4d6d', '#ffd166', '#4cc9f0', '#fff', '#c77dff', '#80ed99'][(rnd() * 6) | 0]; for (let i = 0; i < 64; i++) { const a = rnd() * 6.28, v = 2.4 + rnd() * 4.6; parts.push(spawn('spark', { x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v, c: col })); } } }
    const rate = { rain: 3, snow: 1, petals: .35, rose: .35, hearts: .3, fireflies: .1, sparkle: .15, confetti: .6, none: 0 }[mode] || 0;
    if (mode !== 'none' && parts.length < max && (rate >= 1 || rnd() < rate * d)) for (let i = 0; i < Math.max(1, rate | 0); i++) if (parts.length < max) parts.push(spawn(mode));
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i]; p.life += d / 60;
      if (p.m === 'spark') { p.x += p.vx * d; p.y += p.vy * d; p.vy += .07 * d; p.vx *= .985; p.a -= .011 * d; }
      else if (p.m === 'petals' || p.m === 'rose') { p.x += p.vx * d + Math.sin(p.life * 2 + p.ph) * .7; p.y += p.vy * d; p.r += p.vr * d; }
      else if (p.m === 'hearts') { p.x += Math.sin(p.life * 2 + p.ph) * .6; p.y += p.vy * d; p.a -= .0016 * d; }
      else if (p.m === 'fireflies') { p.x += p.vx * d + Math.sin(p.life + p.ph) * .3; p.y += p.vy * d + Math.cos(p.life * 1.3 + p.ph) * .3; }
      else if (p.m === 'sparkle') { /* static twinkle */ }
      else if (p.m === 'confetti') { p.x += p.vx * d; p.y += p.vy * d; p.vy += (p.burst ? .35 : 0) * d; p.vx *= p.burst ? .985 : 1; p.r += p.vr * d; if (p.burst) p.a -= .006 * d; }
      else { p.x += p.vx * d; p.y += p.vy * d; }
      const dead = p.m === 'spark' ? p.a <= 0 : p.m === 'sparkle' ? (p.m !== mode) : (p.y > H + 40 || p.y < -60 || p.x < -80 || p.x > W + 80 || p.a <= 0);
      if (p.m !== mode && p.m !== 'confetti' && p.m !== 'spark') p.a -= .02 * d;
      if (dead && !(p.m === 'sparkle' && p.m === mode)) { parts.splice(i, 1); continue; }
      draw(p);
    }
  };
  return {
    init(canvas, opts = {}) { cv = canvas; ctx = cv.getContext('2d'); reduce = !!opts.reduce; rnd = opts.rnd || Math.random; resize(); addEventListener('resize', resize); if (window.gsap) gsap.ticker.add(tick); },
    set(m) { if (m && m !== mode) { mode = m; if (m === 'sparkle') for (let i = 0; i < 40; i++) parts.push(spawn('sparkle')); } },
    burst(n = 90) { for (let i = 0; i < n; i++) parts.push(spawn('confetti', true)); },
    get mode() { return mode; }
  };
})();
if (typeof module !== 'undefined') module.exports = FX;

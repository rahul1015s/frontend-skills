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

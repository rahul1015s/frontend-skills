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

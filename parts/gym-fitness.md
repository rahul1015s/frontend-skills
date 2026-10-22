# PREMIUM GYM / FITNESS STUDIO WEBSITE — MASTER PROMPT v1.0
### One prompt → one complete, high-energy, animated `index.html` for a gym, CrossFit box, yoga or boutique fitness studio

> **HOW TO USE**
> 1. Paste this ENTIRE file into any capable AI (Claude, GPT, Gemini…).
> 2. Then send: `Build a website for <GYM NAME>, a <TYPE: gym/crossfit/yoga/boxing…> in <CITY>. Vibe: <words>. Classes: <list or "invent">. Pricing: <or "invent">. Currency: <INR/USD…>.`
> 3. The AI returns a single `index.html`. Save it and deploy anywhere.

If any detail is missing, **invent believable specifics** instead of asking questions.

<!-- IMAGES: gym,people,nature -->
{{CORE}}

---

## ═══════════════════════════════════════════════
## PART C — GYM / FITNESS SPECIFICATION
## ═══════════════════════════════════════════════

### C1. Goal

Turn a curious scroller into a **free-trial booking**. Energy, proof and clarity beat decoration: what you offer, who trains here, what it costs, how to start today. Mobile matters most (people check the schedule on their phone at the gym door).

### C2. Direction

| Type | Palette (A3) | Fonts |
| --- | --- | --- |
| Strength, CrossFit, boxing | **Ember** or **Solar** | Barlow Condensed + Barlow + IBM Plex Mono |
| Boutique / HIIT | **Mono Lime** | Archivo Black + Archivo + Space Mono |
| Yoga, pilates, wellness | **Moss** or **Rose Quartz** (light) | Fraunces + DM Sans |

Headings in uppercase condensed type, tight leading, huge scale. Photography is high-contrast and cropped tight; apply a dark scrim under all text.

### C3. Section order (all required)

1. **Hero** — full-bleed training photo with scrim, giant uppercase headline, subline, **Start free trial** + **View schedule**, three trust chips (members, rating, years).
2. **Marquee** — class names and values (“STRENGTH · HIIT · BOXING · MOBILITY”).
3. **Numbers** — 4 counters (members, classes/week, coaches, sq ft).
4. **Programs** — 4–6 program cards with image, level, duration and a hover reveal.
5. **Class schedule** — day tabs (default: today) with a time table; each class has coach, level, spots left and a **Book** button that works.
6. **Coaches** — 3–4 coaches with photo, speciality, credentials.
7. **Transformations** — a **before/after drag slider** with a short story and result stats.
8. **Pricing** — monthly / annual toggle, 3 plans, middle highlighted, joining-fee note.
9. **BMI & calorie calculator** — height, weight, age, sex, activity, goal → BMI, daily calories and macros.
10. **Reviews** — 3 member quotes with results.
11. **FAQ** — 6 questions (first visit, cancellation, kids, equipment, parking, injuries).
12. **Free-trial form** — name, phone, email, preferred class, goal, with success state.
13. **Footer** — address, opening hours, socials, map-style block.

### C3b. Visual plan (MANDATORY; keys refer to the photo library in A4.2)

A gym site without powerful photography fails. Build all of these:

| Where | What to build | Photos |
| --- | --- | --- |
| Hero | Dark full-bleed with scrim | `gym.20` or `gym.27` (industrial) · `gym.06` (moody) |
| Programs (6 cards, 4:5) | Strength · HIIT · Boxing/Conditioning · Mobility & Yoga · Powerlifting · Endurance | `gym.21` · `gym.29` · `gym.31` · `gym.16` · `gym.04` · `gym.19` |
| Under the marquee | **Photo marquee** (A4.5), 8 duplicated | `gym.00` `gym.09` `gym.12` `gym.24` `gym.30` `gym.22` `gym.14` `gym.18` |
| Coaches (4, 3:4) | 2 women, 2 men | `people.00` `people.22` `people.01` `people.20` |
| Transformation slider | Before: `gym.15` (desaturate with CSS) · After: `gym.23` | as listed |
| **Gallery** (`id="gallery"`, add to nav “Inside the gym”) | masonry of **12**, chips **Floor · Classes · Recovery** | Floor: `gym.00` `gym.03` `gym.06` `gym.10` `gym.20` `gym.22` `gym.27` · Classes: `gym.18` `gym.29` `gym.31` `gym.14` · Recovery: `gym.16` `gym.17` `gym.26` |
| Reviews | 3 portraits | `people.01` `people.00` `people.21` |
| Trial form | One side photo | `gym.30` |

Use `<body data-art-kinds="stripes,rays,grid">`. Total distinct photos ≥ 30. Real member photos with written consent must replace the before/after pair; say so in the closing notes.

### C4. Signature moment

**The before/after slider** (a draggable reveal that works with mouse, touch and keyboard) plus a **huge outline-and-fill hero headline**. The BMI/calorie tool is the sticky utility that keeps people on the page.

### C5. Page-specific CSS (append after A6)

```css
h1,h2,h3{text-transform:uppercase}
.hero{position:relative;min-height:100svh;display:grid;align-items:end;padding:120px 0 clamp(32px,6vw,72px);isolation:isolate;overflow:clip}
.hero-bg{position:absolute;inset:0;z-index:-1}
.hero-bg img{width:100%;height:100%;object-fit:cover;filter:grayscale(.35) contrast(1.1)}
.hero-bg::after{content:"";position:absolute;inset:0;background:linear-gradient(to top,var(--bg) 4%,rgb(0 0 0 / .55) 55%,rgb(0 0 0 / .55))}
.hero h1{font-size:var(--step-5);line-height:.84;letter-spacing:-.02em;max-width:11ch;color:#fff}
.hero h1 .o{color:transparent;-webkit-text-stroke:2px var(--accent)}
.hero .lead{color:rgb(255 255 255 / .8);margin:1.2rem 0 1.8rem}
.cta-row{display:flex;flex-wrap:wrap;gap:.75rem}
.chips-row{display:flex;flex-wrap:wrap;gap:.6rem;margin-top:1.8rem}
.btn{border-radius:6px;text-transform:uppercase;letter-spacing:.08em;font-size:.9rem}

.nums{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
@media (min-width:861px){.nums{grid-template-columns:repeat(4,1fr)}}
.num-card{padding:clamp(18px,3vw,32px);border:1px solid var(--line);border-radius:12px}
.num-card b{display:block;font:700 var(--step-4)/1 var(--font-display);letter-spacing:-.02em;color:var(--accent);font-variant-numeric:tabular-nums}

/* programs */
.programs{display:grid;gap:12px}
@media (min-width:600px){.programs{grid-template-columns:repeat(2,1fr)}}
@media (min-width:1100px){.programs{grid-template-columns:repeat(3,1fr)}}
.prog{position:relative;min-height:420px;border-radius:14px;overflow:hidden;isolation:isolate;display:flex;align-items:flex-end;color:#fff}
.prog .media{position:absolute;inset:0;border-radius:0;z-index:-1}
.prog::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(to top,rgb(0 0 0 / .85),transparent 65%)}
.prog div{padding:1.4rem;display:grid;gap:.5rem}
.prog h3{font-size:var(--step-2)}
.prog p{color:rgb(255 255 255 / .75);max-height:0;opacity:0;overflow:hidden;transition:max-height .6s var(--ease-out),opacity .4s}
.prog:focus-within p,.prog.open p{max-height:8em;opacity:1}
@media (hover:hover) and (pointer:fine){.prog:hover p{max-height:8em;opacity:1}}
@media (hover:none){.prog p{max-height:none;opacity:1}}

/* schedule */
.days{display:flex;gap:.4rem;overflow-x:auto;scrollbar-width:none;margin:1.6rem 0 1rem}
.days::-webkit-scrollbar{display:none}
.day{padding:.7rem 1.2rem;min-height:48px;border-radius:8px;border:1px solid var(--line);color:var(--text-2);white-space:nowrap;font:600 .85rem/1 var(--font-mono);letter-spacing:.08em;text-transform:uppercase}
.day[aria-selected="true"]{background:var(--accent);color:var(--on-accent);border-color:var(--accent)}
.slot{display:grid;grid-template-columns:auto 1fr auto;gap:.3rem 1rem;align-items:center;padding:1.1rem 0;border-bottom:1px solid var(--line);animation:slotIn .5s var(--ease-out) both;animation-delay:calc(var(--k,0)*45ms)}
@keyframes slotIn{from{opacity:0;transform:translateY(10px)}}
.slot .t{font:600 var(--step-1)/1 var(--font-mono);font-variant-numeric:tabular-nums}
.slot h3{font-size:var(--step-1)}
.slot small{color:var(--text-2)}
.slot .spots{font:500 .75rem/1 var(--font-mono);color:var(--ok)}
.slot .spots.low{color:var(--err)}
.slot .btn{min-height:44px;padding:0 1.2rem}
.slot .btn[aria-pressed="true"]{background:transparent;color:var(--ok);border:1px solid var(--ok)}
@media (max-width:600px){.slot{grid-template-columns:auto 1fr}.slot .btn{grid-column:1/-1}}

/* coaches */
.coaches{display:grid;gap:12px;grid-template-columns:repeat(2,1fr)}
@media (min-width:861px){.coaches{grid-template-columns:repeat(4,1fr)}}
.coach .media{aspect-ratio:3/4;border-radius:12px}
.coach h3{margin-top:.8rem;font-size:var(--step-1)}.coach small{color:var(--text-2)}

/* before / after (the @property registration lets WAAPI tween --p smoothly) */
@property --p{syntax:'<percentage>';inherits:true;initial-value:50%}
.ba-wrap{display:grid;gap:clamp(20px,4vw,56px);align-items:center}
@media (min-width:861px){.ba-wrap{grid-template-columns:1fr 1fr}}
.ba{--p:50%;position:relative;aspect-ratio:4/5;border-radius:14px;overflow:hidden;user-select:none;touch-action:pan-y}
.ba .layer{position:absolute;inset:0}
.ba .layer .media{position:absolute;inset:0;border-radius:0}
.ba .after{clip-path:inset(0 0 0 var(--p))}
.ba .tag{position:absolute;top:1rem;padding:.35rem .7rem;border-radius:6px;background:rgb(0 0 0 / .6);color:#fff;font:600 .7rem/1 var(--font-mono);letter-spacing:.1em;text-transform:uppercase}
.ba .tag.l{left:1rem}.ba .tag.r{right:1rem}
.ba .handle{position:absolute;top:0;bottom:0;left:var(--p);width:2px;background:#fff;translate:-1px 0;pointer-events:none}
.ba .handle::after{content:"";position:absolute;top:50%;left:50%;width:44px;height:44px;translate:-50% -50%;border-radius:50%;background:#fff;box-shadow:0 8px 30px rgb(0 0 0 / .4);
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23111' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M8 7l-5 5l5 5M16 7l5 5l-5 5'/%3E%3C/svg%3E");background-size:24px;background-repeat:no-repeat;background-position:center}
.ba input[type=range]{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:ew-resize;margin:0}
.ba:focus-within .handle::after{outline:2px solid var(--accent);outline-offset:3px}
.ba-stats{display:flex;gap:2rem;flex-wrap:wrap;margin-top:1.4rem}
.ba-stats b{display:block;font:700 var(--step-3)/1 var(--font-display);color:var(--accent)}

/* pricing */
.toggle{display:inline-flex;padding:4px;border:1px solid var(--line);border-radius:8px}
.toggle button{padding:.6rem 1.2rem;border-radius:6px;color:var(--text-2);font:600 .8rem/1 var(--font-mono);letter-spacing:.08em;text-transform:uppercase;min-height:44px}
.toggle button[aria-pressed="true"]{background:var(--text);color:var(--bg)}
.plans{display:grid;gap:12px;margin-top:2rem}
@media (min-width:861px){.plans{grid-template-columns:repeat(3,1fr)}}
.plan{display:flex;flex-direction:column;gap:1.2rem;border-radius:14px}
.plan.pop{border-color:var(--accent);background:linear-gradient(180deg,rgb(var(--accent-rgb) / .12),var(--surface) 45%)}
.price{font:700 var(--step-4)/1 var(--font-display);font-variant-numeric:tabular-nums}
.price small{font:400 var(--step-0)/1 var(--font-body);color:var(--text-2);letter-spacing:0;text-transform:none}
.plan ul{display:grid;gap:.7rem;flex:1;color:var(--text-2)}.plan li{display:flex;gap:.6rem}.plan li i{color:var(--accent);margin-top:.28rem}

/* calculator */
.calc{display:grid;gap:clamp(16px,3vw,32px)}
@media (min-width:861px){.calc{grid-template-columns:1fr 1fr}}
.row2{display:grid;gap:12px;grid-template-columns:1fr 1fr}
.result{display:grid;gap:1rem;align-content:start}
.big{font:700 var(--step-5)/.9 var(--font-display);color:var(--accent);font-variant-numeric:tabular-nums}
.bmi-scale{height:10px;border-radius:99px;background:linear-gradient(90deg,#4f8cff 0 18.5%,var(--ok) 18.5% 25%,#f2b441 25% 30%,var(--err) 30% 100%);position:relative;margin-top:.4rem}
.bmi-scale i{position:absolute;top:50%;width:18px;height:18px;border-radius:50%;background:#fff;border:3px solid var(--bg);translate:-50% -50%;left:var(--at,0%);transition:left .8s var(--ease-out)}
.macros{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.macros div{padding:.9rem;border:1px solid var(--line);border-radius:10px;text-align:center}
.macros b{display:block;font:700 var(--step-2)/1 var(--font-display)}
.macros small{color:var(--text-2);font:500 .7rem/1 var(--font-mono);letter-spacing:.08em;text-transform:uppercase}

.reviews{display:grid;gap:12px}@media (min-width:861px){.reviews{grid-template-columns:repeat(3,1fr)}}
.faq details{border-bottom:1px solid var(--line)}
.faq summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;gap:1rem;align-items:center;padding:1.2rem 0;font:600 var(--step-1)/1.3 var(--font-display);text-transform:uppercase}
.faq summary::-webkit-details-marker{display:none}.faq summary i{transition:transform .4s var(--ease-out)}
.faq details[open] summary i{transform:rotate(45deg)}.faq .ans{padding-bottom:1.3rem;color:var(--text-2);max-width:62ch}
.trial{display:grid;gap:clamp(24px,5vw,72px)}@media (min-width:861px){.trial{grid-template-columns:1fr 1fr}}
```

### C6. Markup patterns

**Hero headline with outline word**

```html
<h1><span class="split-line" data-split>Build the body</span> <span class="o" data-reveal style="--i:3;display:inline-block">you’ll earn.</span></h1>
```
(`data-split` stays on a plain-text span; the outlined word reveals separately.)

**Before/after slider** (the range input is the accessible control)

```html
<div class="ba" id="ba" role="group" aria-label="Before and after transformation">
  <div class="layer"><div class="media"><img src="https://images.unsplash.com/photo-1517344368193-41552b6ad3f5?w=900&h=1125&fit=crop&q=80&auto=format" width="900" height="1125" alt="Member before 16 weeks of training" loading="lazy" data-seed="before-training" style="filter:grayscale(.6) brightness(.85)"></div><span class="tag l">Week 0</span></div>
  <div class="layer after"><div class="media"><img src="https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=900&h=1125&fit=crop&q=80&auto=format" width="900" height="1125" alt="Same member after 16 weeks of training" loading="lazy" data-seed="after-training"></div><span class="tag r">Week 16</span></div>
  <div class="handle" aria-hidden="true"></div>
  <input type="range" min="0" max="100" value="50" step="1" aria-label="Reveal before and after" id="ba-range">
</div>
```
Use two **different** photos (or the same photo with the “before” desaturated); state in the closing notes that real member photos with written consent must replace them.

**Schedule container**

```html
<div class="days" role="tablist" aria-label="Class days" id="days"></div>
<div id="slots" role="tabpanel" aria-live="polite"></div>
<noscript><p class="muted">Enable JavaScript to see the class schedule.</p></noscript>
```

**Pricing price markup**: `<span class="price">₹<span data-monthly="1999" data-annual="1599">1999</span><small data-period>/mo</small></span>`; annual ≈ 20% cheaper; toggle buttons `aria-pressed`.

**Calculator form** (fields: height cm, weight kg, age, sex select, activity select with values 1.2 / 1.375 / 1.55 / 1.725, goal select cut / maintain / bulk) with a results panel containing `#bmi-val`, `#bmi-cat`, `.bmi-scale`, `#kcal`, and macro tiles `#m-p #m-c #m-f`.

### C7. Page-specific JavaScript

```js
(() => {
  const { $, $$, safe } = window.site;
  const CUR = '₹', LOCALE = 'en-IN';            /* AI: set for the gym's market */

  /* ───── schedule (AI: invent 4–6 classes per day for all 7 days; 0 = Sunday) ───── */
  const SCHEDULE = {
    1: [{ t: '06:00', n: 'Strength Foundations', c: 'Arjun', l: 'All levels', s: 8 }, { t: '07:30', n: 'HIIT 45', c: 'Mira', l: 'Intermediate', s: 3 }, { t: '18:30', n: 'Boxing Basics', c: 'Dev', l: 'Beginner', s: 12 }],
    /* …2–6, 0… */
  };
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const booked = (() => { try { return new Set(JSON.parse(localStorage.getItem('gym-booked') || '[]')); } catch { return new Set(); } })();
  const saveBooked = () => { try { localStorage.setItem('gym-booked', JSON.stringify([...booked])); } catch {} };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  let day = new Date().getDay();
  const daysEl = $('#days'), slotsEl = $('#slots');
  const renderDays = () => {
    daysEl.innerHTML = [1, 2, 3, 4, 5, 6, 0].map(d => `<button class="day" role="tab" data-day="${d}" aria-selected="${d === day}" tabindex="${d === day ? 0 : -1}">${DAYS[d]}${d === new Date().getDay() ? ' · today' : ''}</button>`).join('');
  };
  const renderSlots = () => {
    const list = SCHEDULE[day] || [];
    slotsEl.innerHTML = list.length ? list.map((c, i) => {
      const id = `${day}-${c.t}`, on = booked.has(id), left = c.s - (on ? 1 : 0);
      return `<div class="slot" style="--k:${i}"><span class="t">${esc(c.t)}</span><div><h3>${esc(c.n)}</h3><small>${esc(c.c)} · ${esc(c.l)}</small></div>
        <div style="display:grid;gap:.5rem;justify-items:end"><span class="spots ${left <= 3 ? 'low' : ''}">${left} spots left</span>
        <button class="btn ${on ? '' : 'btn-primary'}" data-book="${id}" aria-pressed="${on}">${on ? '<i class="ti ti-check" aria-hidden="true"></i> Booked' : 'Book'}</button></div></div>`;
    }).join('') : '<p class="muted" style="padding:2rem 0">Rest day. See you tomorrow.</p>';
  };
  if (daysEl && slotsEl) {
    renderDays(); renderSlots();
    daysEl.addEventListener('click', e => { const b = e.target.closest('[data-day]'); if (!b) return; day = +b.dataset.day; renderDays(); renderSlots(); });
    daysEl.addEventListener('keydown', e => {
      if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
      const order = [1, 2, 3, 4, 5, 6, 0], i = order.indexOf(day); day = order[(i + (e.key === 'ArrowRight' ? 1 : order.length - 1)) % order.length];
      renderDays(); renderSlots(); $('.day[aria-selected="true"]', daysEl).focus();
    });
    slotsEl.addEventListener('click', e => {
      const b = e.target.closest('[data-book]'); if (!b) return;
      const id = b.dataset.book; booked.has(id) ? booked.delete(id) : booked.add(id); saveBooked(); renderSlots();
    });
  }

  /* ───── before / after ───── */
  const ba = $('#ba'), range = $('#ba-range');
  if (ba && range) {
    const set = v => ba.style.setProperty('--p', v + '%');
    range.addEventListener('input', () => set(range.value));
    set(range.value);
    /* gentle hint on first view */
    if (!window.site.reduce && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(([e]) => { if (!e.isIntersecting) return; io.disconnect();
        const a = ba.animate([{ '--p': '50%' }, { '--p': '38%' }, { '--p': '62%' }, { '--p': '50%' }], { duration: 1800, easing: 'cubic-bezier(.23,1,.32,1)' }); a.addEventListener('finish', () => set(range.value)); }, { threshold: 0.6 });
      io.observe(ba);
    }
  }

  /* ───── pricing toggle ───── */
  const tog = $$('.toggle button'), prices = $$('[data-monthly]');
  tog.forEach(b => b.addEventListener('click', () => {
    const annual = b.dataset.billing === 'annual';
    tog.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    prices.forEach(p => { p.textContent = annual ? p.dataset.annual : p.dataset.monthly; });
    $$('[data-period]').forEach(el => { el.textContent = annual ? '/mo, billed yearly' : '/mo'; });
  }));

  /* ───── BMI + calories (Mifflin–St Jeor) ───── */
  const form = $('#calc');
  if (form) {
    const out = { bmi: $('#bmi-val'), cat: $('#bmi-cat'), scale: $('.bmi-scale'), kcal: $('#kcal'), p: $('#m-p'), c: $('#m-c'), f: $('#m-f') };
    const run = () => {
      const h = +form.height.value, w = +form.weight.value, a = +form.age.value;
      if (!(h > 90 && h < 250 && w > 25 && w < 300 && a > 12 && a < 100)) return;
      const bmi = w / ((h / 100) ** 2);
      const cat = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Healthy range' : bmi < 30 ? 'Overweight' : 'Obese range';
      const bmr = 10 * w + 6.25 * h - 5 * a + (form.sex.value === 'm' ? 5 : -161);
      const tdee = bmr * +form.activity.value;
      const kcal = Math.round(tdee + ({ cut: -500, maintain: 0, bulk: 300 }[form.goal.value] || 0));
      const protein = Math.round(w * 2), fat = Math.round(kcal * 0.27 / 9), carbs = Math.max(0, Math.round((kcal - protein * 4 - fat * 9) / 4));
      out.bmi.textContent = bmi.toFixed(1); out.cat.textContent = cat;
      out.scale.style.setProperty('--at', Math.min(Math.max((bmi - 12) / (40 - 12), 0), 1) * 100 + '%');
      out.kcal.textContent = kcal.toLocaleString(LOCALE); out.p.textContent = protein + 'g'; out.c.textContent = carbs + 'g'; out.f.textContent = fat + 'g';
    };
    form.addEventListener('input', run); form.addEventListener('submit', e => { e.preventDefault(); run(); });
    run();
  }
})();
```

BMI is a screening number, not a diagnosis. The calculator panel must include the sentence: “For general guidance only, not medical advice.”

### C8. Content rules

- **Brand and promise**: specific (“Iron Paradise — strength training for people who’ve never trained”). Include a founding year, member count, rating and coach count that are consistent across hero, numbers and footer.
- **Programs (4–6)**: Strength, HIIT, Boxing, Mobility & Yoga, Powerlifting, Kids/Youth: each with duration, level and one benefit sentence.
- **Schedule**: believable times (06:00, 07:30, 12:15, 18:30, 20:00), mixed levels, spots 2–14, all 7 days with weekends lighter.
- **Coaches**: first name, speciality, a real-sounding credential (“NSCA-CPT”, “ex-national boxing finalist”), one line of philosophy.
- **Plans**: Starter (off-peak, 3 classes/week), Unlimited (most popular), Elite (adds coaching and recovery). Currency consistent; note the joining fee and a **7-day free trial**.
- **Reviews**: concrete, honest results (“lost 9 kg in 16 weeks”, “first pull-up at 41”).
- **Safety**: disclaimers on calculator; FAQ includes injuries and medical clearance.
- **Photos:** all from the verified library (A4.2) following the visual plan (C3b); the gallery uses the core component (A4.4).

### C9. Gym-specific checklist

- [ ] Hero CTA and “Start free trial” visible at 390×700; sticky or repeated CTA after the hero is a plus
- [ ] Schedule defaults to today, tabs are keyboard operable, Book toggles and updates spots, state persists
- [ ] Before/after slider works by drag, touch and arrow keys; both photos carry descriptive alt text
- [ ] Pricing toggle changes all prices and the period label; the best-value plan is clear
- [ ] Calculator updates live, rejects nonsense input, and shows the disclaimer
- [ ] Uppercase headings stay legible at 390px (no mid-word breaks)
- [ ] Trial form validates and confirms; phone field uses `type="tel"`
- [ ] Closing notes mention replacing stock photos and the schedule/pricing data

---

## ═══════════════════════════════════════════════
## PART D — QUICK-START PROMPTS
## ═══════════════════════════════════════════════

```
Build a website for IRON PARADISE GYM, a strength and conditioning gym in Pune. Vibe: raw, loud, no-nonsense. Palette: Ember.
Classes: strength, HIIT, boxing, mobility. Pricing in INR: invent 3 plans. 7-day free trial.
```

```
Build a website for STILLWATER YOGA, a boutique yoga and pilates studio in Auckland. Vibe: calm, light, grounded. Palette: Moss.
Classes: vinyasa, yin, reformer pilates, breathwork. Pricing in NZD: invent 3 plans. First class free.
```

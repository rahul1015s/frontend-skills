# PREMIUM WEDDING WEBSITE / DIGITAL INVITATION — MASTER PROMPT v1.0
### One prompt → one complete, romantic, animated `index.html` with countdown, add-to-calendar, RSVP, guestbook and a curtain-opening invitation

> **HOW TO USE**
> 1. Paste this ENTIRE file into any capable AI (Claude, GPT, Gemini…).
> 2. Then send: `Build our wedding website. Couple: <NAME & NAME>. Date: <date + time>. Venue: <name, city>. Style: <classic | garden | modern | royal | beach>. Events: <ceremony, reception, sangeet…>. Hashtag: <or "invent">.`
> 3. The AI returns a single `index.html`. Save it and share the link with guests.

If any detail is missing, **invent believable specifics** instead of asking questions (names, venue, dates in the future relative to today).

<!-- IMAGES: wedding,people,hotel,nature,food -->
{{CORE}}

---

## ═══════════════════════════════════════════════
## PART C — WEDDING SPECIFICATION
## ═══════════════════════════════════════════════

### C1. Goal

Guests open one link on their phone and instantly know **when, where, what to wear, and how to reply**. The site should feel like a beautifully printed invitation: slow, soft, intimate. Emotion first, logistics clear.

### C2. Direction

| Style | Palette (A3) | Fonts |
| --- | --- | --- |
| Classic / garden | **Ink & Cream** (light) with a sage or blush accent | Cormorant Garamond + Hanken Grotesk, script accent: Pinyon Script |
| Romantic / blush | **Rose Quartz** (light) | Cormorant Garamond + DM Sans, Pinyon Script |
| Royal / festive | **Noir Gold** (dark) or **Terracotta** | Cormorant Garamond + Hanken Grotesk |
| Beach / modern | **Glacier** (light) | Instrument Serif + Geist |

Load the script face only for the couple’s names and a few flourish words:
`family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=Pinyon+Script&family=Hanken+Grotesk:wght@300..700`.
Set `--font-mono` to the body font (labels are small uppercase, wide-tracked) and add `--font-script:'Pinyon Script',cursive`. **Do not** keep the core’s uppercase mono look; wedding labels are soft.

### C3. Section order (all required)

0. **Curtain intro** (replaces the core loader: **omit `<div class="loader">`**) — two panels and a wax-seal button “Open invitation”; skipped for returning visitors in the same session.
1. **Hero** — “We’re getting married”, names in script at huge scale, date and city, **countdown**, Save-the-date and RSVP buttons, floating petals.
2. **Our story** — 4–5 timeline moments (how we met, first trip, the proposal…), alternating layout, each with a photo or generated art.
3. **The details** — cards for each event (Ceremony, Reception, + optional Mehendi/Sangeet/Brunch): date, time, venue, dress code, a map link, and **Add to calendar** (.ics download).
4. **Schedule of the day** — a vertical timeline with times.
5. **Travel & stay** — getting there, hotel blocks, local tips.
6. **Gallery** — 6–8 photos in a gentle masonry.
7. **Wedding party** — bridesmaids/groomsmen or family, with role and a playful line each.
8. **Gifts** — registry/gift cards (no pressure wording) with copy-to-clipboard for a UPI/bank placeholder.
9. **RSVP** — name, attending yes/no, number of guests, meal choice, dietary notes, song request, message. Saves locally and shows a warm confirmation.
10. **Guestbook** — recent wishes list (stored on the device, clearly labelled as a demo) and a form to add one.
11. **FAQ** — dress code, kids, parking, plus-ones, photography, weather plan.
12. **Footer** — hashtag, contact for questions, “With love” signature.

### C3b. Visual plan (MANDATORY; keys refer to the photo library in A4.2)

Weddings are emotional; imagery must be soft, warm and plentiful. Build all of these:

| Where | What to build | Photos |
| --- | --- | --- |
| Hero | Soft art + petals; add a **bento collage** (`.cg`) of five wedding photos below the countdown on desktop, stacked marquee on mobile | `wedding.00` `wedding.08` `wedding.18` `wedding.21` `wedding.13` |
| Our story (5 moments, arched 4:5 frames) | One photo each in order | `wedding.17` `wedding.08` `wedding.18` `wedding.13` `wedding.21` |
| Event cards | Each card opens with a 16:9 venue photo | ceremony `wedding.06` · reception `wedding.19` or `wedding.03` · extra event `hotel.11` or `wedding.20` |
| Travel & stay | 3 photos for hotels and surroundings | `hotel.02` `hotel.08` `hotel.05` |
| **Gallery** (`id="gallery"`, add to nav) | “Moments”: masonry of **12**, chips **Us · Details · Venue** | Us: `wedding.00` `wedding.08` `wedding.10` `wedding.13` `wedding.18` `wedding.21` `wedding.22` · Details: `wedding.01` `wedding.09` `wedding.14` `wedding.15` `wedding.12` · Venue: `wedding.03` `wedding.06` `wedding.07` `wedding.19` `wedding.20` |
| Under the story | **Photo marquee** (A4.5) | `wedding.02` `wedding.04` `wedding.11` `wedding.23` `food.03` `food.23` `nature.06` `nature.16` |
| Wedding party (8 round portraits) | 4 women, 4 men | women `people.00` `people.03` `people.06` `people.07` · men `people.01` `people.02` `people.20` `people.25` |

Use `<body data-art-kinds="petals,mesh,rings">`. Total distinct photos ≥ 40. Tell the couple to replace every stock photo with their own.

### C4. Signature moment

**The curtain opens.** A wax seal invites a tap; the two panels slide apart, the names rise out of the page in script, petals begin to fall (a few, slowly), and the countdown starts ticking. Everything afterwards is quiet and unhurried.

### C5. Page-specific CSS (append after A6)

```css
:root{--font-script:'Pinyon Script',cursive}
h1,h2,h3{font-weight:400}
.script{font-family:var(--font-script);font-weight:400;letter-spacing:0;line-height:1.05}
.eyebrow{text-transform:uppercase;letter-spacing:.28em;font-family:var(--font-body)}
.eyebrow::before{display:none}
.center{text-align:center}
.divider{display:flex;align-items:center;gap:1rem;justify-content:center;color:var(--accent);margin-block:1.4rem}
.divider::before,.divider::after{content:"";height:1px;width:min(120px,20vw);background:currentColor;opacity:.5}

/* curtain */
.curtain{position:fixed;inset:0;z-index:9998;display:grid;place-items:center;overflow:hidden}
.curtain .half{position:absolute;top:0;bottom:0;width:50.5%;background:var(--surface-2);transition:transform 1.4s var(--ease-in-out);
  background-image:radial-gradient(120% 80% at 50% 0%,rgb(var(--accent-rgb) / .18),transparent 60%)}
.curtain .l{left:0}.curtain .r{right:0}
.curtain.open .l{transform:translateX(-101%)}.curtain.open .r{transform:translateX(101%)}
.seal{position:relative;z-index:2;display:grid;place-items:center;width:clamp(120px,32vw,168px);aspect-ratio:1;border-radius:50%;
  background:radial-gradient(circle at 35% 30%,color-mix(in srgb,var(--accent) 80%,#fff),var(--accent) 55%,color-mix(in srgb,var(--accent) 60%,#000));
  color:var(--on-accent);box-shadow:0 18px 50px -10px rgb(var(--accent-rgb) / .6),inset 0 0 0 6px rgb(255 255 255 / .12);
  transition:transform .6s var(--ease-out),opacity .5s .2s;animation:sealPulse 3s var(--ease-in-out) infinite}
.seal span{font:400 clamp(2rem,9vw,3rem)/1 var(--font-script)}
.seal small{position:absolute;bottom:-2.4rem;white-space:nowrap;color:var(--text-2);font:500 .72rem/1 var(--font-body);letter-spacing:.28em;text-transform:uppercase}
.seal:active{transform:scale(.94)}
.curtain.open .seal{transform:scale(1.4);opacity:0;pointer-events:none}
@keyframes sealPulse{50%{transform:scale(1.04)}}
@media (hover:hover) and (pointer:fine){.seal:hover{transform:scale(1.06)}}

/* hero entrance only starts after opening */
.js:not(.opened) .hero-in{opacity:0;transform:translateY(24px)}
.hero-in{transition:opacity 1.4s var(--ease-out),transform 1.6s var(--ease-out);transition-delay:calc(.35s + var(--i,0)*.16s)}
.hero{min-height:100svh;display:grid;place-items:center;padding:110px 0 80px;position:relative;text-align:center;overflow:clip}
.hero::before{content:"";position:absolute;inset:0;z-index:-1;
  background:radial-gradient(60% 50% at 50% 0%,rgb(var(--accent-rgb) / .16),transparent 70%),radial-gradient(50% 40% at 50% 100%,rgb(var(--accent-rgb) / .1),transparent 70%)}
.hero .small-caps{letter-spacing:.34em;text-transform:uppercase;font-size:var(--step--1);color:var(--text-2)}
.hero .names{font-size:clamp(3.4rem,15vw,11rem);margin:.4em 0 .1em}
.hero .names .amp{display:block;font-size:.5em;color:var(--accent);line-height:.9}
.hero .when{font:400 var(--step-2)/1.2 var(--font-display);font-style:italic}
.countdown{display:flex;gap:clamp(.6rem,2.5vw,1.6rem);justify-content:center;margin:2rem 0}
.countdown div{min-width:clamp(62px,18vw,96px);padding:.9rem .3rem;border:1px solid var(--line);border-radius:999px 999px 20px 20px;background:rgb(var(--bg-rgb,246 243 238) / .6)}
.countdown b{display:block;font:400 clamp(1.6rem,6vw,2.6rem)/1 var(--font-display);font-variant-numeric:tabular-nums}
.countdown small{font:500 .62rem/1 var(--font-body);letter-spacing:.2em;text-transform:uppercase;color:var(--text-2)}
.cta-row{display:flex;flex-wrap:wrap;gap:.7rem;justify-content:center}
.btn{letter-spacing:.14em;text-transform:uppercase;font-size:.78rem}

/* petals */
.petals{position:fixed;inset:0;pointer-events:none;z-index:50;overflow:hidden}
.petal{position:absolute;top:-6vh;width:var(--s);height:calc(var(--s)*1.35);background:radial-gradient(circle at 30% 30%,color-mix(in srgb,var(--accent) 55%,#fff),var(--accent));
  border-radius:80% 0 80% 0;opacity:.0;animation:fall var(--d) linear var(--delay) infinite}
@keyframes fall{0%{transform:translate3d(0,-6vh,0) rotate(0);opacity:0}10%{opacity:.7}100%{transform:translate3d(var(--x),108vh,0) rotate(540deg);opacity:0}}

/* story */
.timeline{display:grid;gap:clamp(36px,6vw,80px)}
.moment{display:grid;gap:1.2rem;align-items:center}
@media (min-width:861px){.moment{grid-template-columns:1fr 1fr;gap:clamp(32px,6vw,96px)}.moment:nth-child(even) .moment-media{order:2}}
.moment-media{aspect-ratio:4/5;border-radius:200px 200px 24px 24px;overflow:hidden}
.moment-media .media{border-radius:0;height:100%}
.moment .year{font:400 var(--step-1)/1 var(--font-script);color:var(--accent);font-size:2rem}

/* events */
.events{display:grid;gap:14px}
@media (min-width:861px){.events{grid-template-columns:repeat(auto-fit,minmax(280px,1fr))}}
.event{text-align:center;display:grid;gap:.7rem;justify-items:center;padding:clamp(24px,4vw,40px);border-radius:200px 200px 28px 28px}
.event .ti-ico{font-size:34px;color:var(--accent)}
.event h3{font:400 var(--step-3)/1 var(--font-display);font-style:italic}
.event dl{display:grid;gap:.15rem}.event dt{font-size:.68rem;letter-spacing:.24em;text-transform:uppercase;color:var(--text-3);margin-top:.6rem}.event dd{margin:0}
.event .btn{margin-top:.6rem}

/* day schedule */
.sched{max-width:560px;margin-inline:auto;position:relative;padding-left:2rem}
.sched::before{content:"";position:absolute;left:.45rem;top:.4rem;bottom:.4rem;width:1px;background:var(--line)}
.sched li{position:relative;padding:.6rem 0 1.4rem}
.sched li::before{content:"";position:absolute;left:-1.85rem;top:1rem;width:11px;height:11px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 5px rgb(var(--accent-rgb) / .18)}
.sched time{font:500 .8rem/1 var(--font-body);letter-spacing:.2em;text-transform:uppercase;color:var(--accent)}
.sched h3{font:400 var(--step-1)/1.2 var(--font-display);margin-top:.3rem}

.masonry{columns:2;column-gap:12px}@media (min-width:861px){.masonry{columns:3}}
.masonry .media{margin-bottom:12px;break-inside:avoid;border-radius:18px}
.party{display:grid;gap:18px;grid-template-columns:repeat(2,1fr)}@media (min-width:861px){.party{grid-template-columns:repeat(4,1fr)}}
.person{text-align:center}.person .media{aspect-ratio:1;border-radius:50%;margin-bottom:.8rem}.person small{color:var(--text-2);display:block}
.gifts{display:grid;gap:12px}@media (min-width:861px){.gifts{grid-template-columns:repeat(3,1fr)}}
.row2{display:grid;gap:12px;grid-template-columns:1fr 1fr}
.choice{display:flex;gap:.6rem;flex-wrap:wrap}
.choice label{position:relative}.choice input{position:absolute;opacity:0;inset:0}
.choice span{display:grid;place-items:center;min-height:48px;padding:0 1.4rem;border:1px solid var(--line);border-radius:999px;cursor:pointer;transition:background-color var(--t-hover),color var(--t-hover),border-color var(--t-hover)}
.choice input:checked+span{background:var(--accent);color:var(--on-accent);border-color:var(--accent)}
.choice input:focus-visible+span{outline:2px solid var(--accent);outline-offset:3px}
.rsvp-card{max-width:720px;margin-inline:auto}
.wish-list{display:grid;gap:12px;margin-top:1.6rem}
.wish{padding:1.1rem 1.3rem;border-radius:18px;border:1px solid var(--line);background:var(--surface);animation:cardIn .6s var(--ease-out) both}
.wish b{font-family:var(--font-script);font-weight:400;font-size:1.6rem;color:var(--accent)}
@keyframes cardIn{from{opacity:0;transform:translateY(12px)}}
.faq details{border-bottom:1px solid var(--line)}
.faq summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;gap:1rem;padding:1.2rem 0;font:400 var(--step-1)/1.3 var(--font-display)}
.faq summary::-webkit-details-marker{display:none}.faq summary i{transition:transform .4s var(--ease-out)}
.faq details[open] summary i{transform:rotate(45deg)}.faq .ans{padding-bottom:1.3rem;color:var(--text-2);max-width:62ch}
.hashtag{font:400 clamp(2rem,8vw,4.5rem)/1 var(--font-script);color:var(--accent)}
@media (prefers-reduced-motion:reduce){.petals{display:none}.seal{animation:none}}
```

### C6. Markup patterns

**Curtain (first child of `<body>`; no `.loader`)**

```html
<div class="curtain" id="curtain" role="dialog" aria-modal="true" aria-label="Wedding invitation">
  <div class="half l"></div><div class="half r"></div>
  <button class="seal" id="seal" aria-label="Open the invitation"><span>A&amp;R</span><small>Tap to open</small></button>
</div>
<div class="petals" id="petals" aria-hidden="true"></div>
```

**Hero** (every child has `class="hero-in"` with `style="--i:N"`, not `data-reveal`)

```html
<section class="hero" id="top-hero"><div class="wrap">
  <p class="small-caps hero-in" style="--i:0">Together with their families</p>
  <h1 class="names script hero-in" style="--i:1">Aanya <span class="amp">&amp;</span> Rohan</h1>
  <p class="when hero-in" style="--i:2">Saturday, 14 February 2027 · Udaipur, Rajasthan</p>
  <div class="countdown hero-in" style="--i:3" role="timer" aria-label="Time until the wedding">
    <div><b data-cd="d">000</b><small>Days</small></div><div><b data-cd="h">00</b><small>Hours</small></div><div><b data-cd="m">00</b><small>Minutes</small></div><div><b data-cd="s">00</b><small>Seconds</small></div>
  </div>
  <div class="cta-row hero-in" style="--i:4"><a href="#rsvp" class="btn btn-primary btn-lg" data-magnetic>RSVP</a><button class="btn btn-ghost btn-lg" data-ics="main"><i class="ti ti-calendar-plus" aria-hidden="true"></i> Save the date</button></div>
</div></section>
```

**Event card** (dates in ISO for the calendar)

```html
<article class="card event" data-reveal
  data-ics-title="Aanya &amp; Rohan — Wedding Ceremony" data-start="2027-02-14T16:30:00+05:30" data-end="2027-02-14T18:30:00+05:30"
  data-location="Jagmandir Island Palace, Udaipur" data-desc="Dress code: traditional Indian attire in pastel shades.">
  <i class="ti ti-ico ti-heart" aria-hidden="true"></i><h3>The Ceremony</h3>
  <dl><dt>When</dt><dd>Saturday, 14 February 2027 · 4:30 pm</dd><dt>Where</dt><dd>Jagmandir Island Palace, Udaipur</dd><dt>Dress code</dt><dd>Traditional · pastel tones</dd></dl>
  <a class="btn btn-ghost" href="https://www.google.com/maps/search/?api=1&query=Jagmandir+Island+Palace+Udaipur" target="_blank" rel="noopener">Directions</a>
  <button class="btn btn-ghost" data-ics="event"><i class="ti ti-calendar-plus" aria-hidden="true"></i> Add to calendar</button>
</article>
```

Make `.ti-ico` a Tabler icon by adding the `ti` class as well (`class="ti ti-heart ti-ico"`).

**RSVP form** (fields: `name`, `attending` radios yes/no, `guests` select 1–4, `meal` radios (Vegetarian / Non-vegetarian / Vegan / Jain), `diet` text, `song` text, `note` textarea)

```html
<form class="card rsvp-card stack" id="rsvp-form" style="--stack:1.2rem" novalidate>
  <div class="field"><label for="r-name">Your name</label><input id="r-name" name="name" autocomplete="name" required></div>
  <fieldset class="field" style="border:0"><legend>Will you join us?</legend><div class="choice"><label><input type="radio" name="attending" value="yes" required checked><span>Joyfully accepts</span></label><label><input type="radio" name="attending" value="no"><span>Regretfully declines</span></label></div></fieldset>
  <div id="rsvp-more" class="stack" style="--stack:1.2rem">
    <div class="row2"><div class="field"><label for="r-guests">Guests</label><select id="r-guests" name="guests"><option>1</option><option>2</option><option>3</option><option>4</option></select></div><div class="field"><label for="r-diet">Dietary notes</label><input id="r-diet" name="diet" placeholder="Allergies, preferences"></div></div>
    <fieldset class="field" style="border:0"><legend>Meal</legend><div class="choice"><label><input type="radio" name="meal" value="Vegetarian" checked><span>Vegetarian</span></label><label><input type="radio" name="meal" value="Non-vegetarian"><span>Non-vegetarian</span></label><label><input type="radio" name="meal" value="Vegan"><span>Vegan</span></label></div></fieldset>
    <div class="field"><label for="r-song">A song that will get you dancing</label><input id="r-song" name="song"></div>
  </div>
  <div class="field"><label for="r-note">A note for the couple</label><textarea id="r-note" name="note"></textarea></div>
  <button class="btn btn-primary btn-lg btn-block" type="submit">Send RSVP</button>
  <p class="form-status" role="status" hidden></p>
</form>
```

**Guestbook** (`<form id="wish-form">` with `name` and `message`, plus `<div class="wish-list" id="wish-list"></div>`), **gift card** (`<button class="btn btn-ghost" data-copy="aanya@upi">Copy UPI ID</button>`), **FAQ** with `<details>`.

### C7. Page-specific JavaScript

```js
(() => {
  const { $, $$, reduce, lenis, safe } = window.site;
  const doc = document.documentElement;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
  const WEDDING = new Date('2027-02-14T16:30:00+05:30').getTime();   /* AI: set from the brief; must be in the future */

  /* ───── curtain ───── */
  const curtain = $('#curtain'), seal = $('#seal');
  let seen = false; try { seen = !!sessionStorage.getItem('wedding-open'); } catch {}
  const lock = on => { lenis ? (on ? lenis.stop() : lenis.start()) : (document.body.style.overflow = on ? 'hidden' : ''); };
  const openInvite = () => {
    if (doc.classList.contains('opened')) return;
    curtain && curtain.classList.add('open'); doc.classList.add('opened'); lock(false);
    try { sessionStorage.setItem('wedding-open', '1'); } catch {}
    setTimeout(() => curtain && curtain.remove(), 1700);
    startPetals();
    window.dispatchEvent(new Event('wedding:opened'));
  };
  if (!curtain || seen || reduce) { curtain && curtain.remove(); doc.classList.add('opened'); setTimeout(startPetals, 600); }
  else { lock(true); seal.addEventListener('click', openInvite); seal.focus({ preventScroll: true }); setTimeout(() => { /* failsafe so guests are never locked out */ if (!doc.classList.contains('opened')) openInvite(); }, 60000); }

  /* ───── petals ───── */
  function startPetals() {
    const box = $('#petals'); if (!box || reduce || box.childElementCount) return;
    const n = innerWidth < 700 ? 9 : 16;
    for (let i = 0; i < n; i++) {
      const p = document.createElement('i'); p.className = 'petal';
      p.style.cssText = `left:${Math.random() * 100}%;--s:${8 + Math.random() * 10}px;--d:${14 + Math.random() * 14}s;--delay:${-Math.random() * 20}s;--x:${(Math.random() * 160 - 80)}px`;
      box.append(p);
    }
  }

  /* ───── countdown ───── */
  const cd = { d: $('[data-cd="d"]'), h: $('[data-cd="h"]'), m: $('[data-cd="m"]'), s: $('[data-cd="s"]') };
  const pad = (n, l = 2) => String(Math.max(0, n)).padStart(l, '0');
  const tick = () => {
    const ms = WEDDING - Date.now(), s = Math.max(0, Math.floor(ms / 1000));
    cd.d && (cd.d.textContent = pad(Math.floor(s / 86400), 3)); cd.h && (cd.h.textContent = pad(Math.floor(s % 86400 / 3600)));
    cd.m && (cd.m.textContent = pad(Math.floor(s % 3600 / 60))); cd.s && (cd.s.textContent = pad(s % 60));
  };
  safe(tick); setInterval(() => safe(tick), 1000);

  /* ───── add to calendar (.ics download) ───── */
  const icsText = s => String(s).replace(/\\/g, '\\\\').replace(/[,;]/g, '\\$&').replace(/\n/g, '\\n');
  const stamp = d => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const download = (name, title, start, end, location, desc) => {
    const body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Wedding//EN', 'BEGIN:VEVENT', `UID:${stamp(start)}-${Math.random().toString(36).slice(2)}@wedding`, `DTSTAMP:${stamp(new Date())}`,
      `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`, `SUMMARY:${icsText(title)}`, `LOCATION:${icsText(location)}`, `DESCRIPTION:${icsText(desc)}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const url = URL.createObjectURL(new Blob([body], { type: 'text/calendar;charset=utf-8' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: name + '.ics' });
    document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1500);
  };
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-ics]'); if (!b) return;
    const ev = b.closest('[data-start]');
    if (ev) download('wedding-event', ev.dataset.icsTitle, new Date(ev.dataset.start), new Date(ev.dataset.end), ev.dataset.location, ev.dataset.desc || '');
    else download('save-the-date', document.title, new Date(WEDDING), new Date(WEDDING + 3 * 3600e3), '', 'We can’t wait to celebrate with you.');
    toast('Calendar file downloaded');
  });

  /* ───── toast ───── */
  function toast(msg) {
    let t = $('#toast'); if (!t) { t = document.createElement('div'); t.id = 'toast'; t.setAttribute('role', 'status');
      t.style.cssText = 'position:fixed;left:50%;bottom:24px;translate:-50% 0;z-index:9000;padding:.8rem 1.3rem;border-radius:999px;background:var(--text);color:var(--bg);font-size:.9rem;opacity:0;transition:opacity .3s;pointer-events:none'; document.body.append(t); }
    t.textContent = msg; t.style.opacity = 1; clearTimeout(t._t); t._t = setTimeout(() => { t.style.opacity = 0; }, 2400);
  }
  $$('[data-copy]').forEach(b => b.addEventListener('click', async () => { try { await navigator.clipboard.writeText(b.dataset.copy); toast('Copied'); } catch { toast(b.dataset.copy); } }));

  /* ───── RSVP ───── */
  const rf = $('#rsvp-form');
  if (rf) {
    const more = $('#rsvp-more');
    const sync = () => { const no = rf.attending.value === 'no'; more.hidden = no; $$('input,select', more).forEach(i => i.disabled = no); };
    rf.addEventListener('change', sync); sync();
    rf.addEventListener('submit', e => {
      e.preventDefault();
      const nameEl = rf.elements['name'];
      if (!nameEl.value.trim()) { nameEl.focus(); rf.reportValidity(); return; }
      const data = Object.fromEntries(new FormData(rf)), list = load('rsvps-v1', []); list.push({ ...data, at: new Date().toISOString() }); save('rsvps-v1', list);
      const st = $('.form-status', rf), first = data.name.trim().split(' ')[0];
      st.textContent = data.attending === 'yes' ? `Thank you, ${first}! We can’t wait to celebrate with you.` : `Thank you for letting us know, ${first}. You’ll be missed.`;
      st.hidden = false; rf.reset(); sync();
    });
  }

  /* ───── guestbook (stored on this device only: demo) ───── */
  const wl = $('#wish-list'), wf = $('#wish-form');
  if (wl && wf) {
    const SEED = [{ n: 'Meera & Karan', m: 'Wishing you a lifetime of laughter and chai on the balcony.' }, { n: 'Uncle Sunil', m: 'Aanya, you were born to shine. Rohan, welcome to the family!' }];
    const render = () => { const all = [...load('wishes-v1', []), ...SEED]; wl.innerHTML = all.map((w, i) => `<div class="wish" style="animation-delay:${i * 60}ms"><b>${esc(w.n)}</b><p>${esc(w.m)}</p></div>`).join(''); };
    render();
    wf.addEventListener('submit', e => {
      e.preventDefault(); const n = wf.elements['name'].value.trim(), m = wf.elements['message'].value.trim(); if (!n || !m) { wf.reportValidity(); return; }
      const mine = load('wishes-v1', []); mine.unshift({ n, m }); save('wishes-v1', mine); wf.reset(); render(); toast('Thank you for your wishes');
    });
  }
})();
```

Rules for the script:
- Replace the `WEDDING` date and the `data-start`/`data-end` values with future dates from the brief. All event times must carry a timezone offset.
- The guestbook and RSVP store data **only in this browser** (demo). The closing notes must say so and recommend connecting a form service (Formspree, Google Forms, Netlify Forms, or a Google Sheet via Apps Script) before sharing the link.
- Hero children use `.hero-in` (not `data-reveal`) so they animate only after the curtain opens.

### C8. Content rules

- **Names and story**: invent a charming, specific couple story (met at a friend’s terrace, a monsoon road trip, a proposal at sunrise). Keep it warm and light-hearted; no clichés like “soulmates for eternity”.
- **Events**: ceremony, reception, and one optional event; real-feeling venue names, plausible local times, and a dress-code line that gives guests colours or styles.
- **Schedule**: 6–8 entries (Guests arrive 4:00 · Ceremony 4:30 · Cocktails 6:00 · Dinner 7:30 · First dance 9:00 · Last song 11:30).
- **Travel**: nearest airport/station with distance, two hotels with “mention our wedding” note, a local tip.
- **Wedding party**: 6–8 invented names with roles and one affectionate line each.
- **Gifts**: tone is gracious (“Your presence is the greatest gift”), with optional registry link placeholders and a UPI/bank placeholder.
- **Images**: all from the verified library (A4.2) following the visual plan (C3b); the gallery uses the core component (A4.4). Tell the couple to replace every stock photo with their own.
- **Privacy**: no phone numbers or addresses of private individuals beyond what the brief supplies; invent contact details clearly as placeholders.

### C9. Wedding-specific checklist

- [ ] Curtain opens by tap/Enter, is skipped on repeat visits and reduced motion, and can never trap a guest (failsafe)
- [ ] Hero entrance runs after opening; petals are few, slow, behind content, and off for reduced motion
- [ ] Countdown is correct, ticks every second, and shows zero (not negative) after the date
- [ ] Add-to-calendar downloads a valid `.ics` for each event and the save-the-date
- [ ] RSVP hides extra fields when declining, validates the name, and gives a warm confirmation
- [ ] Guestbook escapes HTML and clearly acts as a demo
- [ ] Script font used only for names and flourishes; body text stays readable at 390px
- [ ] Contrast checked on light palettes (accent text ≥ 4.5:1 or used only for large script)
- [ ] Closing notes list: dates to confirm, photos to replace, and the form service to connect

---

## ═══════════════════════════════════════════════
## PART D — QUICK-START PROMPTS
## ═══════════════════════════════════════════════

```
Build our wedding website. Couple: Aanya & Rohan. Date: 14 February 2027, ceremony 4:30 pm. Venue: Jagmandir Island Palace, Udaipur.
Style: royal and romantic. Palette: Noir Gold. Events: Mehendi (12 Feb), Sangeet (13 Feb), Ceremony and Reception (14 Feb). Hashtag: invent.
```

```
Build our wedding website. Couple: Emma & Daniel. Date: 6 June 2027, 3 pm. Venue: Brightwater Gardens, Napa Valley.
Style: garden party, soft and airy. Palette: Rose Quartz (light). Events: ceremony, reception, farewell brunch. Hashtag: invent.
```

# PREMIUM SAAS / PRODUCT LANDING PAGE — MASTER PROMPT v1.0
### One prompt → one complete, animated, conversion-focused `index.html` for a software product, app or startup

> **HOW TO USE**
> 1. Paste this ENTIRE file into any capable AI (Claude, GPT, Gemini…).
> 2. Then send: `Build a landing page for <PRODUCT> — <one line what it does> for <AUDIENCE>. Palette: <name or "you choose">. Pricing: <tiers or "you invent">.`
> 3. The AI returns a single `index.html`. Save it and deploy anywhere.

If any detail is missing, **invent believable specifics** instead of asking questions.

<!-- IMAGES: tech,people,design,creative -->
{{CORE}}

---

## ═══════════════════════════════════════════════
## PART C — SAAS LANDING SPECIFICATION
## ═══════════════════════════════════════════════

### C1. Goal

Move one kind of visitor to one action (start free trial / book a demo / join waitlist). The page earns trust in this order: **what it is → why it’s better → see it → proof → price → objections → act.**

### C2. Direction

Default **Blueprint** (dark) with Space Grotesk + Geist + JetBrains Mono. Alternatives: **Mint Ledger** (fintech), **Clinic** (health/B2B, light), **Violet Hour** (AI/creative tools), **Glacier** (light, enterprise). The product mock-up is the visual star, so keep the rest disciplined.

### C3. Section order (all required)

1. **Hero** — eyebrow pill (“New · v2.0”), h1 (outcome, 5–9 words), subhead (≤ 22 words), primary + secondary CTA, tiny reassurance line, **animated product mock-up** below/right.
2. **Logo marquee** — 8–10 invented customer wordmarks as text in a muted colour.
3. **Problem → solution** — a two-column statement: the old way (struck-through list) vs. the new way.
4. **Feature bento** — 6 tiles of different sizes, each with icon tile, title, one-sentence benefit, and one small visual.
5. **How it works** — sticky stage: 3 steps on the left, a device stage on the right that swaps screens as steps scroll by.
6. **Numbers** — 4 counters (users, time saved, uptime, integrations).
7. **Testimonials** — 3 cards, one featured large, concrete results.
8. **Pricing** — monthly/annual toggle, 3 tiers, middle highlighted.
9. **FAQ** — 6 `<details>` items that remove objections.
10. **Final CTA** — big headline, one button, risk reversal line.
11. **Footer** — product, company, resources, legal; newsletter optional.

### C3b. Visual plan (MANDATORY; keys refer to the photo library in A4.2)

| Where | What to build | Photos |
| --- | --- | --- |
| Hero | The animated mock-up (C6) **plus** an avatar stack of 5 overlapping 40px portraits beside the trust line (“Loved by 4,200 teams”) | `people.01` `people.00` `people.09` `people.06` `people.20` |
| Bento | Two tiles carry a photo background with a scrim (`.media` filling the card, text above it): one product-story tile and one infrastructure tile | `design.12` · `tech.12` |
| Under the logo strip | **Bento collage** (`.cg`, A4.5) “Teams like yours” | `tech.04` `tech.05` `tech.09` `tech.21` `design.21` |
| Testimonials | 3 portraits (160×160) matching the quote authors | `people.00` · `people.09` · `people.06` |
| **Gallery** (`id="gallery"`, after Testimonials, add to nav) | “Life at <Company>”: masonry of **10** | `tech.04` `tech.05` `tech.09` `tech.11` `tech.21` `design.21` `design.22` `design.14` `design.23` `people.25` |

Use `<body data-art-kinds="mesh,grid,rings">`. Total distinct photos ≥ 16.

### C4. Signature moment

**The product mock-up is alive**: a browser-framed dashboard built in HTML/CSS whose chart line draws itself, KPI numbers count up, and a list row highlights in sequence. It tilts gently with the pointer (desktop). Then the **sticky “how it works” stage** swaps screens as you scroll.

### C5. Page-specific CSS (append after A6)

```css
/* hero */
.hero{padding:clamp(120px,16vw,200px) 0 clamp(48px,8vw,100px);position:relative;overflow:clip}
.hero::before{content:"";position:absolute;inset:-20% -10% auto;height:70%;z-index:-1;pointer-events:none;
  background:radial-gradient(50% 60% at 50% 0%,rgb(var(--accent-rgb) / .28),transparent 70%)}
.hero-copy{text-align:center;display:grid;justify-items:center;gap:1.4rem}
.hero-copy h1{font-size:var(--step-5);line-height:.94;max-width:14ch}
.hero-copy .lead{text-align:center}
.cta-row{display:flex;flex-wrap:wrap;gap:.75rem;justify-content:center}
.fine-print{font-size:var(--step--1);color:var(--text-3)}
.badge{display:inline-flex;gap:.6rem;align-items:center;padding:.35rem .9rem .35rem .4rem;border-radius:var(--r-pill);border:1px solid var(--line);background:var(--surface);font-size:var(--step--1)}
.badge b{background:var(--accent);color:var(--on-accent);border-radius:var(--r-pill);padding:.2rem .6rem;font:600 .75rem/1 var(--font-mono)}

/* mock-up */
.mock{margin-top:clamp(40px,6vw,80px);border-radius:20px;border:1px solid var(--line);background:var(--surface);overflow:hidden;
  box-shadow:0 60px 120px -40px rgb(var(--accent-rgb) / .35),0 0 0 1px rgb(255 255 255 / .03) inset;transition:transform .5s var(--ease-out)}
.mock-bar{display:flex;align-items:center;gap:.5rem;padding:.8rem 1rem;border-bottom:1px solid var(--line);background:var(--surface-2)}
.mock-bar i{width:10px;height:10px;border-radius:50%;background:var(--line)}
.mock-bar .url{margin-left:.6rem;flex:1;max-width:320px;padding:.3rem .8rem;border-radius:var(--r-pill);background:var(--bg);color:var(--text-3);font:400 .75rem/1.2 var(--font-mono)}
.mock-body{display:grid;grid-template-columns:1fr;min-height:320px}
@media (min-width:861px){.mock-body{grid-template-columns:200px 1fr}}
.mock-side{display:none;padding:1rem;border-right:1px solid var(--line);gap:.35rem}
@media (min-width:861px){.mock-side{display:grid;align-content:start}}
.mock-side span{display:flex;gap:.6rem;align-items:center;padding:.55rem .7rem;border-radius:10px;color:var(--text-2);font-size:.85rem}
.mock-side span.on{background:var(--surface-2);color:var(--text)}
.mock-main{padding:clamp(14px,2.4vw,28px);display:grid;gap:14px}
.kpis{display:grid;gap:12px;grid-template-columns:repeat(2,1fr)}
@media (min-width:600px){.kpis{grid-template-columns:repeat(4,1fr)}}
.kpi{padding:14px;border-radius:14px;border:1px solid var(--line);background:var(--bg)}
.kpi small{color:var(--text-3);font:500 .7rem/1 var(--font-mono);letter-spacing:.08em;text-transform:uppercase}
.kpi strong{display:block;margin-top:.5rem;font:600 clamp(1.3rem,2.4vw,1.8rem)/1 var(--font-display);letter-spacing:-.03em;font-variant-numeric:tabular-nums}
.kpi em{font-style:normal;font-size:.75rem;color:var(--ok)}
.chart{border:1px solid var(--line);border-radius:14px;background:var(--bg);padding:14px}
.chart svg{width:100%;height:auto}
.chart .line{fill:none;stroke:var(--accent);stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}
.chart .area{fill:url(#g);opacity:0;transition:opacity 1.2s .8s}
.js .chart .line{stroke-dasharray:1;stroke-dashoffset:1}
.js .in .chart .line,.js .chart.in .line{stroke-dashoffset:0;transition:stroke-dashoffset 2s var(--ease-in-out) .3s}
.js .in .chart .area,.js .chart.in .area{opacity:.35}
.rows{display:grid;gap:8px}
.row{display:flex;justify-content:space-between;gap:1rem;padding:.7rem .9rem;border-radius:10px;border:1px solid var(--line);font-size:.85rem;background:var(--bg);animation:rowglow 6s infinite}
.row:nth-child(2){animation-delay:2s}.row:nth-child(3){animation-delay:4s}
@keyframes rowglow{0%,25%,100%{border-color:var(--line)}10%{border-color:rgb(var(--accent-rgb) / .7);background:rgb(var(--accent-rgb) / .06)}}

/* logos */
.logos{display:flex;gap:3rem;align-items:center;width:max-content;animation:marq 40s linear infinite}
.logos span{font:600 1.4rem/1 var(--font-display);letter-spacing:-.04em;color:var(--text-3);white-space:nowrap}

/* problem / solution */
.vs{display:grid;gap:clamp(12px,2vw,24px)}
@media (min-width:861px){.vs{grid-template-columns:1fr 1fr}}
.vs .old li{color:var(--text-3);text-decoration:line-through;text-decoration-color:rgb(var(--accent-rgb) / .6)}
.vs li{display:flex;gap:.7rem;padding:.8rem 0;border-bottom:1px solid var(--line)}
.vs .new li i{color:var(--ok)}

/* bento */
.bento{display:grid;gap:12px;grid-template-columns:1fr}
@media (min-width:861px){
  .bento{grid-template-columns:repeat(6,1fr);grid-auto-rows:minmax(220px,auto)}
  .b1{grid-column:span 4;grid-row:span 2}.b2{grid-column:span 2}.b3{grid-column:span 2}
  .b4{grid-column:span 3}.b5{grid-column:span 3}.b6{grid-column:span 6}
}
.bento .card{display:flex;flex-direction:column;gap:.8rem;justify-content:space-between}
.bento h3{margin-top:.4rem}.bento p{color:var(--text-2);max-width:42ch}
.spark{display:flex;align-items:flex-end;gap:5px;height:64px}
.spark i{flex:1;background:linear-gradient(var(--accent),rgb(var(--accent-rgb) / .15));border-radius:4px 4px 0 0;height:var(--h);transform-origin:bottom;transform:scaleY(.15);transition:transform 1s var(--ease-out);transition-delay:calc(var(--k)*60ms)}
.in .spark i,.spark.in i{transform:none}

/* sticky steps */
.steps{display:grid;gap:clamp(20px,4vw,60px)}
@media (min-width:861px){.steps{grid-template-columns:1fr 1fr;align-items:start}}
.step{min-height:55vh;display:flex;flex-direction:column;justify-content:center;gap:.8rem;opacity:.35;transition:opacity .5s}
.step.active{opacity:1}
.step .n{font:500 var(--step--1)/1 var(--font-mono);color:var(--accent);letter-spacing:.12em}
.stage{position:sticky;top:88px;height:min(62vh,520px);border-radius:var(--r-lg);border:1px solid var(--line);background:var(--surface);overflow:hidden}
.screen{position:absolute;inset:0;padding:clamp(16px,3vw,32px);display:grid;align-content:center;gap:12px;opacity:0;transform:translateY(16px) scale(.98);transition:opacity .5s,transform .7s var(--ease-out)}
.screen.on{opacity:1;transform:none}
.screen .tile{padding:1rem;border:1px solid var(--line);border-radius:14px;background:var(--bg);display:flex;gap:.8rem;align-items:center}

/* stats, quotes */
.stats{display:grid;gap:12px;grid-template-columns:repeat(2,1fr)}
@media (min-width:861px){.stats{grid-template-columns:repeat(4,1fr)}}
.stat{padding:clamp(18px,3vw,32px);border-top:1px solid var(--line)}
.stat b{display:block;font:500 var(--step-4)/1 var(--font-display);letter-spacing:-.04em;font-variant-numeric:tabular-nums}
.quotes{display:grid;gap:12px}
@media (min-width:861px){.quotes{grid-template-columns:1.4fr 1fr;grid-auto-rows:auto}.quotes .big{grid-row:span 2}}
.quotes blockquote{font:400 var(--step-1)/1.4 var(--font-body)}
.quotes .big blockquote{font:400 var(--step-2)/1.2 var(--font-display);letter-spacing:-.02em}

/* pricing */
.toggle{display:inline-flex;padding:4px;border:1px solid var(--line);border-radius:var(--r-pill);background:var(--surface)}
.toggle button{padding:.55rem 1.2rem;border-radius:var(--r-pill);color:var(--text-2);font-weight:500;min-height:40px;transition:background-color var(--t-hover),color var(--t-hover)}
.toggle button[aria-pressed="true"]{background:var(--text);color:var(--bg)}
.toggle small{color:var(--ok);margin-left:.3rem}
.plans{display:grid;gap:12px;margin-top:2rem}
@media (min-width:861px){.plans{grid-template-columns:repeat(3,1fr);align-items:stretch}}
.plan{display:flex;flex-direction:column;gap:1.2rem}
.plan.pop{border-color:var(--accent);background:linear-gradient(180deg,rgb(var(--accent-rgb) / .08),var(--surface) 40%)}
.price{font:500 var(--step-4)/1 var(--font-display);letter-spacing:-.04em;font-variant-numeric:tabular-nums}
.price small{font:400 var(--step-0)/1 var(--font-body);color:var(--text-2);letter-spacing:0}
.plan ul{display:grid;gap:.7rem;flex:1}
.plan li{display:flex;gap:.6rem;color:var(--text-2)}.plan li i{color:var(--accent);margin-top:.25rem}

/* faq */
.faq details{border-bottom:1px solid var(--line)}
.faq summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;gap:1rem;align-items:center;padding:1.2rem 0;font:500 var(--step-1)/1.3 var(--font-display);letter-spacing:-.01em}
.faq summary::-webkit-details-marker{display:none}
.faq summary i{transition:transform .4s var(--ease-out);flex:none}
.faq details[open] summary i{transform:rotate(45deg)}
.faq details[open] .ans{animation:fadeUp .5s var(--ease-out)}
.faq .ans{padding:0 0 1.4rem;color:var(--text-2);max-width:62ch}
@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}}

/* final cta */
.final{text-align:center;border-radius:var(--r-lg);border:1px solid var(--line);padding:clamp(40px,8vw,120px) var(--gutter);position:relative;overflow:hidden;background:var(--surface)}
.final::before{content:"";position:absolute;inset:auto -10% -60% -10%;height:100%;background:radial-gradient(50% 60% at 50% 100%,rgb(var(--accent-rgb) / .4),transparent 70%);pointer-events:none}
.final>*{position:relative}
```

### C6. Mock-up markup (build this exactly, restyle copy for the product)

```html
<div class="mock" data-tilt data-reveal style="--i:5" aria-hidden="true">
  <div class="mock-bar"><i></i><i></i><i></i><span class="url">app.product.com/overview</span></div>
  <div class="mock-body">
    <aside class="mock-side">
      <span class="on"><i class="ti ti-layout-dashboard"></i>Overview</span>
      <span><i class="ti ti-chart-line"></i>Reports</span>
      <span><i class="ti ti-users"></i>Customers</span>
      <span><i class="ti ti-plug"></i>Integrations</span>
      <span><i class="ti ti-settings"></i>Settings</span>
    </aside>
    <div class="mock-main">
      <div class="kpis">
        <div class="kpi"><small>Revenue</small><strong>$<span data-count="48210">48,210</span></strong><em>▲ 12.4%</em></div>
        <div class="kpi"><small>Active users</small><strong data-count="9824">9,824</strong><em>▲ 8.1%</em></div>
        <div class="kpi"><small>Conversion</small><strong><span data-count="4.7">4.7</span>%</strong><em>▲ 0.6%</em></div>
        <div class="kpi"><small>Churn</small><strong><span data-count="1.2">1.2</span>%</strong><em>▼ 0.3%</em></div>
      </div>
      <div class="chart" data-reveal>
        <svg viewBox="0 0 600 160" preserveAspectRatio="none">
          <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--accent)"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>
          <path class="area" d="M0,130 C60,120 90,80 150,90 S250,40 310,60 S420,110 470,70 S560,20 600,30 L600,160 L0,160Z"/>
          <path class="line" pathLength="1" d="M0,130 C60,120 90,80 150,90 S250,40 310,60 S420,110 470,70 S560,20 600,30"/>
        </svg>
      </div>
      <div class="rows"><div class="row"><span>New signup · Northwind</span><span class="muted">2 min ago</span></div><div class="row"><span>Upgrade to Pro · Fabrikam</span><span class="muted">11 min ago</span></div><div class="row"><span>Integration connected · Slack</span><span class="muted">1 h ago</span></div></div>
    </div>
  </div>
</div>
```

Note: `.chart` reveals through `data-reveal` and the CSS above draws its line once it has `.in`. KPI numbers already hold their final values in the HTML and count up via `data-count`.

### C7. Sticky “how it works” markup and script

```html
<section class="sec" id="how"><div class="wrap">
  <p class="eyebrow" data-reveal>How it works</p><h2 data-reveal style="max-width:16ch">From signup to insight in ten minutes</h2>
  <div class="steps" style="margin-top:3rem">
    <div>
      <article class="step" data-step="0"><span class="n">01 / CONNECT</span><h3>Plug in your data</h3><p class="muted">One-click connections to Stripe, Postgres and 40 other sources. No engineers needed.</p></article>
      <article class="step" data-step="1"><span class="n">02 / MODEL</span><h3>Describe what you want to know</h3><p class="muted">Ask in plain English; we write the query and show you the work.</p></article>
      <article class="step" data-step="2"><span class="n">03 / SHARE</span><h3>Send a live dashboard</h3><p class="muted">Share a link, schedule a digest, or embed it where your team already works.</p></article>
    </div>
    <div class="stage" aria-hidden="true">
      <div class="screen on"><div class="tile"><i class="ti ti-brand-stripe"></i>Stripe · connected</div><div class="tile"><i class="ti ti-database"></i>Postgres · syncing 82%</div><div class="tile"><i class="ti ti-brand-google-analytics"></i>Analytics · ready</div></div>
      <div class="screen"><div class="tile"><i class="ti ti-sparkles"></i>“Revenue by plan, last 90 days”</div><div class="tile"><i class="ti ti-code"></i>SELECT plan, sum(amount) …</div><div class="tile"><i class="ti ti-chart-bar"></i>3 charts generated</div></div>
      <div class="screen"><div class="tile"><i class="ti ti-link"></i>product.com/d/q3-review</div><div class="tile"><i class="ti ti-mail"></i>Weekly digest · Mondays 9:00</div><div class="tile"><i class="ti ti-users"></i>12 teammates viewing</div></div>
    </div>
  </div>
</div></section>
```

```js
(() => {
  const { $, $$, safe } = window.site;

  /* sticky steps → swap screens */
  const steps = $$('.step'), screens = $$('.screen');
  if (steps.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return;
      const i = +en.target.dataset.step;
      steps.forEach((s, k) => s.classList.toggle('active', k === i));
      screens.forEach((s, k) => s.classList.toggle('on', k === i));
    }), { rootMargin: '-45% 0px -45% 0px' });
    steps.forEach(s => io.observe(s));
  }

  /* pricing toggle */
  const tog = $$('.toggle button'), prices = $$('[data-monthly]');
  tog.forEach(b => b.addEventListener('click', () => {
    const annual = b.dataset.billing === 'annual';
    tog.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    prices.forEach(p => {
      const v = annual ? p.dataset.annual : p.dataset.monthly;
      p.animate([{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-6px)' }], { duration: 120, fill: 'forwards' })
        .finished.then(() => { p.textContent = v; p.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 220, fill: 'forwards', easing: 'cubic-bezier(.23,1,.32,1)' }); }).catch(() => { p.textContent = v; });
    });
    $$('[data-period]').forEach(el => { el.textContent = annual ? '/mo, billed yearly' : '/mo'; });
  }));
})();
```

Pricing markup rules: each price is `<span class="price">$<span data-monthly="29" data-annual="24">29</span><small data-period>/mo</small></span>`, annual is ~20% cheaper, toggle labelled “Monthly / Annual (−20%)”, `aria-pressed` on both buttons, the middle plan has `.pop` and a “Most popular” pill, every plan ends with one full-width button.

### C8. Copy rules (this is where SaaS pages win or lose)

- **h1** = outcome for the customer, not what the product is. Good: “Know why customers leave, before they do.” Weak: “The all-in-one analytics platform.”
- **Subhead** names the audience and the mechanism in ≤ 22 words.
- **Primary CTA** is a verb phrase (“Start free trial”); **secondary** shows the product (“Watch 90-second demo”). Reassurance line: “Free for 14 days · No credit card.”
- **Features**: benefit-first, ≤ 14 words each; one concrete number per tile where possible.
- **Testimonials**: name, role, company, and a metric (“cut reporting time from 6 hours to 20 minutes”).
- **FAQ** must cover: price/refunds, switching/migration, security/compliance, integrations, support, cancellation.
- **Invent** realistic product, customer and integration names; avoid real trademarks other than universal integrations (Stripe, Slack, Notion, GitHub).

### C9. SaaS-specific checklist

- [ ] The mock-up is built from HTML/CSS (no screenshot images), animates on reveal, and is `aria-hidden`
- [ ] Hero CTA and reassurance line are visible at 390×700 without scrolling
- [ ] Sticky stage works on desktop and degrades gracefully on mobile (steps stack, stage stays readable)
- [ ] Pricing toggle changes every price and the period label; the highlighted plan is clear
- [ ] FAQ uses native `<details>` and answers real objections
- [ ] Only one pinned/sticky storytelling section; the rest scroll normally
- [ ] Final CTA repeats the hero outcome with a risk-reversal line

---

## ═══════════════════════════════════════════════
## PART D — QUICK-START PROMPTS
## ═══════════════════════════════════════════════

```
Build a landing page for Plume — an AI meeting notetaker that writes follow-ups in your voice — for sales teams.
Palette: Violet Hour. Pricing: Free, Pro $19, Team $49 per seat.
```

```
Build a landing page for Ledgerly — real-time bookkeeping for freelancers in India (GST-ready).
Palette: Mint Ledger. Pricing: you invent three tiers in INR.
```

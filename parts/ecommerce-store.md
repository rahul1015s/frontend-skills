# PREMIUM E-COMMERCE STORE WEBSITE — MASTER PROMPT v1.0
### One prompt → one complete, animated, working storefront `index.html` (catalogue, filters, quick view, cart drawer, promo code, checkout flow)

> **HOW TO USE**
> 1. Paste this ENTIRE file into any capable AI (Claude, GPT, Gemini…).
> 2. Then send: `Build a store for <BRAND> — <what it sells> in <CITY/COUNTRY>. Currency: <INR/USD/EUR…>. Vibe: <words>. Products: <list or "invent 12">. Free shipping over: <amount or "invent">.`
> 3. The AI returns a single `index.html`. Save it and deploy anywhere.

If any detail is missing, **invent believable specifics** instead of asking questions.

> **Honest scope:** this produces a front-end store with a real, persistent cart and a **demo** checkout (no payments are taken). To go live, connect the checkout to Stripe, Razorpay, Shopify Buy Button, Snipcart or similar; the closing notes must say this.

{{CORE}}

---

## ═══════════════════════════════════════════════
## PART C — E-COMMERCE SPECIFICATION
## ═══════════════════════════════════════════════

### C1. Goal

Make browsing effortless and buying feel safe: **clear products, fast add-to-bag, a cart that never loses state, honest totals.** Trust signals (shipping, returns, secure payment) sit close to every price and button.

### C2. Direction (match the products)

| Store | Palette (A3) | Fonts |
| --- | --- | --- |
| Fashion, jewellery | Noir Gold, or Ink & Cream (light) | Cormorant Garamond/Instrument Serif + Hanken Grotesk/Geist |
| Beauty, wellness | Rose Quartz (light) or Moss | Fraunces + DM Sans |
| Tech, gadgets | Blueprint or Mono Lime | Space Grotesk + Geist |
| Food, coffee, home | Terracotta or Citrus (light) | Fraunces + DM Sans |
| Sport, streetwear | Ember or Solar | Barlow Condensed + Barlow |

Product photography is the hero; chrome stays quiet. Use `aspect-ratio: 4/5` for all product images.

### C3. Section order (all required)

1. **Announcement bar** — “Free shipping over ₹2,999 · Easy 30-day returns” (dismissible, remembers choice).
2. **Header** — logo, nav (Shop · Collections · About · Contact), wishlist indicator optional, **cart button with live count badge**, mobile menu.
3. **Hero** — one featured collection: huge headline, short line, CTA to the shop, image or generated art, small trust row.
4. **Category tiles** — 3–4 large tiles linking to filtered shop views (clicking sets the category chip and scrolls to the grid).
5. **Shop** — toolbar (search, category chips, sort select, result count) + responsive product grid (2 columns on mobile, 3–4 on desktop).
6. **Feature strip** — Free shipping · 30-day returns · Secure payment · Support (Tabler icons).
7. **Lookbook / story** — editorial two-column block about the brand and materials.
8. **Reviews** — 3 customer reviews with stars, name, city, verified-buyer badge.
9. **Newsletter** — one-field form with 10% off promo reveal (`WELCOME10`).
10. **Footer** — shop links, help, payment icons (text pills), socials, © year.

**Overlays (always present):** cart drawer · quick-view dialog · checkout dialog · toast container.

### C4. Signature moment

**The cart drawer.** It slides in with `--ease-drawer`, shows a **free-shipping progress bar** that fills as items are added, supports quantity steppers, size labels, promo codes, persistent state (`localStorage`), and an honest totals breakdown (subtotal, discount, shipping, total). Add-to-bag always answers: the badge pops, a toast confirms, and the drawer opens.

### C5. Page-specific CSS (append after A6)

```css
/* announcement + header extras */
.announce{background:var(--accent);color:var(--on-accent);text-align:center;font:500 var(--step--1)/1 var(--font-mono);letter-spacing:.06em;padding:.7rem 2.6rem;position:relative}
.announce button{position:absolute;right:.4rem;top:50%;translate:0 -50%;width:36px;height:36px;display:grid;place-items:center;color:inherit}
.header-actions{display:flex;align-items:center;gap:.5rem}
.icon-btn{position:relative;width:44px;height:44px;border-radius:50%;border:1px solid var(--line);display:grid;place-items:center;font-size:20px;transition:background-color var(--t-hover),transform var(--t-press)}
.icon-btn:active{transform:scale(.94)}
@media (hover:hover) and (pointer:fine){.icon-btn:hover{background:var(--surface-2)}}
.badge-count{position:absolute;top:-4px;right:-4px;min-width:20px;height:20px;padding:0 5px;border-radius:var(--r-pill);background:var(--accent);color:var(--on-accent);font:600 .7rem/20px var(--font-mono);text-align:center;scale:0;transition:scale .35s cubic-bezier(.34,1.56,.64,1)}
.badge-count.on{scale:1}
.badge-count.pop{animation:popb .4s var(--ease-out)}
@keyframes popb{40%{transform:scale(1.35)}}
@media (min-width:861px){.menu-btn{display:none}}

/* hero */
.hero{padding:clamp(110px,14vw,170px) 0 clamp(40px,6vw,80px)}
.hero-grid{display:grid;gap:clamp(24px,5vw,72px);align-items:center}
@media (min-width:861px){.hero-grid{grid-template-columns:1.05fr .95fr}}
.hero h1{font-size:var(--step-5);line-height:.9;letter-spacing:-.045em;max-width:9ch}
.hero .lead{margin:1.2rem 0 1.8rem}
.hero .media{aspect-ratio:4/5;border-radius:var(--r-lg)}
.trust-row{display:flex;flex-wrap:wrap;gap:.5rem 1.5rem;margin-top:1.8rem;color:var(--text-2);font-size:var(--step--1)}
.trust-row span{display:inline-flex;gap:.45rem;align-items:center}.trust-row i{color:var(--accent)}
.cta-row{display:flex;flex-wrap:wrap;gap:.75rem}

/* category tiles */
.tiles{display:grid;gap:12px;grid-template-columns:1fr 1fr}
@media (min-width:861px){.tiles{grid-template-columns:repeat(4,1fr)}}
.tile{position:relative;display:block;aspect-ratio:3/4;border-radius:var(--r-lg);overflow:hidden;isolation:isolate;text-align:left;color:#fff}
.tile .media{position:absolute;inset:0;border-radius:0;z-index:-1}
.tile::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(to top,rgb(0 0 0 / .7),transparent 55%)}
.tile span{position:absolute;left:1rem;bottom:1rem;right:1rem;display:flex;justify-content:space-between;align-items:center;font:500 var(--step-1)/1 var(--font-display)}

/* toolbar */
.toolbar{display:grid;gap:12px;margin:2rem 0}
@media (min-width:861px){.toolbar{grid-template-columns:1fr auto auto;align-items:center}}
.search{position:relative}
.search i{position:absolute;left:1rem;top:50%;translate:0 -50%;color:var(--text-3)}
.search input{width:100%;min-height:48px;padding:.7rem 1rem .7rem 2.8rem;border-radius:var(--r-pill);border:1px solid var(--line);background:var(--surface);font-size:16px}
.search input:focus-visible{outline:none;border-color:var(--accent);box-shadow:0 0 0 4px rgb(var(--accent-rgb) / .18)}
.chips{display:flex;gap:.45rem;overflow-x:auto;scrollbar-width:none;padding-bottom:2px}
.chips::-webkit-scrollbar{display:none}
.chip{padding:.6rem 1.1rem;min-height:44px;border-radius:var(--r-pill);border:1px solid var(--line);color:var(--text-2);white-space:nowrap;transition:background-color var(--t-hover),color var(--t-hover),border-color var(--t-hover)}
.chip[aria-pressed="true"]{background:var(--text);color:var(--bg);border-color:var(--text)}
.sort{min-height:48px;padding:0 1rem;border-radius:var(--r-pill);border:1px solid var(--line);background:var(--surface);font-size:16px}
.count{color:var(--text-2);font:500 var(--step--1)/1 var(--font-mono);letter-spacing:.08em;text-transform:uppercase}

/* product grid */
.pgrid{display:grid;grid-template-columns:repeat(2,1fr);gap:clamp(20px,3vw,40px) clamp(10px,2vw,24px)}
@media (min-width:861px){.pgrid{grid-template-columns:repeat(3,1fr)}}
@media (min-width:1200px){.pgrid{grid-template-columns:repeat(4,1fr)}}
.pcard{display:grid;gap:.7rem;animation:cardIn .7s var(--ease-out) both;animation-delay:calc(var(--k,0)*50ms)}
@keyframes cardIn{from{opacity:0;transform:translateY(18px)}}
.pmedia{aspect-ratio:4/5;border-radius:var(--r-md)}
.pmedia img{position:absolute;inset:0}
.pmedia img.alt{opacity:0;transition:opacity .5s}
@media (hover:hover) and (pointer:fine){.pcard:hover .pmedia img.alt{opacity:1}}
.badge-p{position:absolute;left:.7rem;top:.7rem;padding:.3rem .6rem;border-radius:var(--r-pill);background:var(--text);color:var(--bg);font:600 .65rem/1 var(--font-mono);letter-spacing:.08em;text-transform:uppercase}
.wish{position:absolute;right:.6rem;top:.6rem;width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:rgb(var(--bg-rgb,11 11 12) / .7);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);font-size:18px;transition:transform var(--t-press)}
.wish:active{transform:scale(.9)}
.wish[aria-pressed="true"]{color:var(--accent)}
.quick{position:absolute;inset:auto .7rem .7rem .7rem;min-height:44px;border-radius:var(--r-pill);background:var(--text);color:var(--bg);font-weight:600;opacity:0;transform:translateY(8px);transition:opacity .3s,transform .4s var(--ease-out)}
@media (hover:none){.quick{display:none}}
@media (hover:hover) and (pointer:fine){.pcard:hover .quick{opacity:1;transform:none}}
.pinfo{display:flex;justify-content:space-between;gap:.8rem;align-items:flex-start}
.pinfo h3{font:500 1rem/1.25 var(--font-body);letter-spacing:0}
.pinfo .muted{font-size:var(--step--1)}
.pprice{text-align:right;font-variant-numeric:tabular-nums}
.pprice s{display:block;color:var(--text-3);font-size:.8rem}
.rate{display:flex;align-items:center;gap:.25rem;color:var(--accent);font-size:.85rem}.rate small{color:var(--text-3);margin-left:.3rem}
.empty{grid-column:1/-1;text-align:center;padding:4rem 1rem;color:var(--text-2)}

/* strip, story, reviews, newsletter */
.strip{display:grid;gap:1rem;grid-template-columns:1fr 1fr;border-block:1px solid var(--line);padding-block:1.6rem}
@media (min-width:861px){.strip{grid-template-columns:repeat(4,1fr)}}
.strip div{display:flex;gap:.8rem;align-items:center}.strip i{font-size:26px;color:var(--accent)}.strip b{display:block;font-size:.95rem}.strip small{color:var(--text-2)}
.story{display:grid;gap:clamp(24px,5vw,72px);align-items:center}
@media (min-width:861px){.story{grid-template-columns:1fr 1fr}}
.story .media{aspect-ratio:4/5;border-radius:var(--r-lg)}
.reviews{display:grid;gap:12px}
@media (min-width:861px){.reviews{grid-template-columns:repeat(3,1fr)}}
.verified{display:inline-flex;gap:.3rem;align-items:center;color:var(--ok);font-size:.8rem}
.news{display:grid;gap:1rem;text-align:center;justify-items:center;border:1px solid var(--line);border-radius:var(--r-lg);padding:clamp(32px,6vw,80px) var(--gutter);background:var(--surface)}
.news form{display:flex;flex-wrap:wrap;gap:.6rem;width:min(520px,100%);justify-content:center}
.news .field{flex:1 1 240px}

/* cart drawer */
.overlay{position:fixed;inset:0;z-index:960;background:rgb(0 0 0 / .6);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);opacity:0;pointer-events:none;transition:opacity .4s}
.overlay.open{opacity:1;pointer-events:auto}
.drawer{position:fixed;top:0;right:0;bottom:0;z-index:970;width:min(440px,100vw);background:var(--bg);border-left:1px solid var(--line);display:flex;flex-direction:column;transform:translateX(100%);transition:transform .55s var(--ease-drawer);visibility:hidden}
.drawer.open{transform:none;visibility:visible}
.drawer-head{display:flex;justify-content:space-between;align-items:center;padding:1.1rem 1.25rem;border-bottom:1px solid var(--line)}
.ship-bar{padding:1rem 1.25rem;border-bottom:1px solid var(--line);font-size:.9rem}
.ship-bar .track{height:6px;border-radius:99px;background:var(--surface-2);margin-top:.6rem;overflow:hidden}
.ship-bar .track i{display:block;height:100%;width:100%;background:var(--accent);transform-origin:0 50%;transform:scaleX(var(--p,0));transition:transform .7s var(--ease-out)}
.drawer-body{flex:1;overflow-y:auto;padding:1rem 1.25rem;display:grid;align-content:start;gap:1rem;overscroll-behavior:contain}
.citem{display:grid;grid-template-columns:76px 1fr auto;gap:.9rem;align-items:center;animation:cardIn .5s var(--ease-out) both}
.citem .media{width:76px;aspect-ratio:4/5;border-radius:10px}
.citem h4{font:500 .95rem/1.25 var(--font-body)}
.citem small{color:var(--text-2)}
.stepper{display:inline-flex;align-items:center;border:1px solid var(--line);border-radius:var(--r-pill);margin-top:.4rem}
.stepper button{width:36px;height:36px;display:grid;place-items:center;border-radius:50%}
.stepper output{min-width:1.6rem;text-align:center;font:500 .9rem/1 var(--font-mono)}
.citem .right{display:grid;justify-items:end;gap:.5rem;font-variant-numeric:tabular-nums}
.link-btn{color:var(--text-3);font-size:.8rem;text-decoration:underline;text-underline-offset:3px;min-height:32px}
.cart-empty{display:grid;justify-items:center;gap:1rem;text-align:center;padding:3rem 1rem;color:var(--text-2)}
.cart-empty i{font-size:48px;color:var(--text-3)}
.drawer-foot{padding:1.1rem 1.25rem calc(1.1rem + env(safe-area-inset-bottom));border-top:1px solid var(--line);display:grid;gap:.8rem}
.promo{display:flex;gap:.5rem}.promo input{flex:1;min-height:44px;padding:0 1rem;border-radius:var(--r-pill);border:1px solid var(--line);background:var(--surface);font-size:16px;text-transform:uppercase}
.promo-msg{font-size:.85rem;min-height:1.2em}.promo-msg.ok{color:var(--ok)}.promo-msg.bad{color:var(--err)}
.sum{display:grid;gap:.4rem;font-variant-numeric:tabular-nums}
.sum div{display:flex;justify-content:space-between;color:var(--text-2)}
.sum .total{color:var(--text);font:600 1.15rem/1.2 var(--font-body);padding-top:.5rem;border-top:1px solid var(--line)}

/* dialogs */
dialog.sheet{border:1px solid var(--line);border-radius:var(--r-lg);background:var(--bg);color:var(--text);padding:0;width:min(920px,calc(100% - 24px));max-height:calc(100dvh - 24px);overflow:auto;margin:auto}
dialog.sheet::backdrop{background:rgb(0 0 0 / .7);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px)}
dialog.sheet[open]{animation:sheetIn .45s var(--ease-out)}
@keyframes sheetIn{from{opacity:0;transform:translateY(16px) scale(.98)}}
.sheet-grid{display:grid}
@media (min-width:761px){.sheet-grid{grid-template-columns:1fr 1fr}}
.sheet .media{aspect-ratio:4/5;border-radius:0}
.sheet-body{padding:clamp(18px,3vw,36px);display:grid;gap:1rem;align-content:start}
.sizes{display:flex;flex-wrap:wrap;gap:.5rem}
.sizes label{position:relative}
.sizes input{position:absolute;opacity:0;inset:0}
.sizes span{display:grid;place-items:center;min-width:48px;min-height:44px;padding:0 .8rem;border:1px solid var(--line);border-radius:12px;cursor:pointer;transition:background-color var(--t-hover),color var(--t-hover),border-color var(--t-hover)}
.sizes input:checked+span{background:var(--text);color:var(--bg);border-color:var(--text)}
.sizes input:focus-visible+span{outline:2px solid var(--accent);outline-offset:2px}
.sheet-close{position:absolute;right:.8rem;top:.8rem;z-index:2}
.co-grid{display:grid;gap:clamp(18px,3vw,36px);padding:clamp(18px,3vw,36px)}
@media (min-width:761px){.co-grid{grid-template-columns:1.2fr 1fr}}
.row2{display:grid;gap:12px;grid-template-columns:1fr 1fr}
.done{padding:clamp(32px,6vw,72px);text-align:center;display:grid;justify-items:center;gap:1rem}
.done i{font-size:56px;color:var(--ok)}

/* toasts */
.toasts{position:fixed;left:50%;bottom:calc(16px + env(safe-area-inset-bottom));translate:-50% 0;z-index:9000;display:grid;gap:.5rem;justify-items:center;pointer-events:none;width:min(440px,calc(100% - 24px))}
.toast{pointer-events:auto;display:flex;gap:.7rem;align-items:center;padding:.8rem 1.1rem;border-radius:var(--r-pill);background:var(--text);color:var(--bg);font-size:.92rem;box-shadow:0 20px 50px -10px rgb(0 0 0 / .5);animation:toastIn .5s var(--ease-out) both}
.toast.out{opacity:0;transform:translateY(8px);transition:opacity .3s,transform .35s var(--ease-out)}
@keyframes toastIn{from{opacity:0;transform:translateY(16px) scale(.96)}}
```

### C6. Markup that must exist (adapt copy; keep ids)

```html
<div class="announce" id="announce" role="region" aria-label="Announcement">Free shipping over ₹2,999 · Easy 30-day returns
  <button aria-label="Dismiss announcement" id="announce-x"><i class="ti ti-x" aria-hidden="true"></i></button></div>

<!-- header: replace the core header's CTA with actions -->
<header class="site-header"><div class="wrap header-in">
  <a href="#top" class="logo" aria-label="BRAND home"><i></i>BRAND</a>
  <nav class="nav-links" aria-label="Primary"><a href="#shop">Shop</a><a href="#story">Story</a><a href="#reviews">Reviews</a><a href="#contact">Contact</a></nav>
  <div class="header-actions">
    <button class="icon-btn" id="cart-btn" aria-label="Open bag"><i class="ti ti-shopping-bag" aria-hidden="true"></i><span class="badge-count" id="cart-count" aria-live="polite">0</span></button>
    <button class="menu-btn" aria-label="Menu" aria-expanded="false" aria-controls="mobile-menu"><span></span><span></span></button>
  </div>
</div></header>

<!-- shop section -->
<section class="sec" id="shop"><div class="wrap">
  <p class="eyebrow" data-reveal>Shop</p><h2 data-reveal>The collection</h2>
  <div class="toolbar">
    <label class="search"><span class="sr-only">Search products</span><i class="ti ti-search" aria-hidden="true"></i><input id="q" type="search" placeholder="Search products" autocomplete="off"></label>
    <label><span class="sr-only">Sort</span><select id="sort" class="sort"><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="rating">Top rated</option></select></label>
    <span class="count" id="count" role="status"></span>
  </div>
  <div class="chips" id="chips" role="group" aria-label="Categories"></div>
  <div class="pgrid" id="grid" style="margin-top:1.5rem"></div>
  <noscript><p class="muted">Enable JavaScript to browse the shop.</p></noscript>
</div></section>

<!-- overlays (place before the scripts) -->
<div class="overlay" id="overlay"></div>
<aside class="drawer" id="drawer" aria-label="Shopping bag" aria-hidden="true" inert>
  <div class="drawer-head"><h3>Your bag <span class="muted" id="drawer-n"></span></h3><button class="icon-btn" id="drawer-close" aria-label="Close bag"><i class="ti ti-x" aria-hidden="true"></i></button></div>
  <div class="ship-bar" id="ship-bar"><span id="ship-msg"></span><div class="track"><i id="ship-fill"></i></div></div>
  <div class="drawer-body" id="drawer-body"></div>
  <div class="drawer-foot" id="drawer-foot" hidden>
    <form class="promo" id="promo-form"><label class="sr-only" for="promo-in">Promo code</label><input id="promo-in" placeholder="Promo code" autocomplete="off"><button class="btn btn-ghost" type="submit">Apply</button></form>
    <p class="promo-msg" id="promo-msg" role="status"></p>
    <div class="sum" id="sum"></div>
    <button class="btn btn-primary btn-lg btn-block" id="checkout-btn">Checkout <i class="ti ti-arrow-right" aria-hidden="true"></i></button>
    <p class="fine-print muted" style="font-size:.8rem;text-align:center"><i class="ti ti-lock" aria-hidden="true"></i> Secure checkout · 30-day returns</p>
  </div>
</aside>

<dialog class="sheet" id="qv" aria-label="Quick view"><button class="icon-btn sheet-close" id="qv-close" aria-label="Close"><i class="ti ti-x" aria-hidden="true"></i></button><div class="sheet-grid" id="qv-body"></div></dialog>

<dialog class="sheet" id="co" aria-label="Checkout">
  <div id="co-form-view"><div class="co-grid">
    <form id="co-form" class="stack" style="--stack:1rem">
      <h3>Delivery details</h3>
      <div class="field"><label for="c-email">Email</label><input id="c-email" type="email" autocomplete="email" inputmode="email" required></div>
      <div class="row2"><div class="field"><label for="c-name">Full name</label><input id="c-name" autocomplete="name" required></div><div class="field"><label for="c-phone">Phone</label><input id="c-phone" type="tel" autocomplete="tel" inputmode="tel" required></div></div>
      <div class="field"><label for="c-addr">Address</label><input id="c-addr" autocomplete="street-address" required></div>
      <div class="row2"><div class="field"><label for="c-city">City</label><input id="c-city" autocomplete="address-level2" required></div><div class="field"><label for="c-zip">PIN / ZIP</label><input id="c-zip" autocomplete="postal-code" inputmode="numeric" required></div></div>
      <p class="muted" style="font-size:.85rem">Demo checkout: no payment is taken. Connect Stripe / Razorpay / Shopify to accept real orders.</p>
      <button class="btn btn-primary btn-lg btn-block" type="submit">Place order</button>
    </form>
    <div class="card"><h3>Order summary</h3><div id="co-items" class="stack" style="--stack:.7rem;margin-top:1rem"></div><div class="sum" id="co-sum" style="margin-top:1rem"></div></div>
  </div></div>
  <div class="done" id="co-done" hidden><i class="ti ti-circle-check" aria-hidden="true"></i><h2>Thank you!</h2><p class="lead" id="co-msg" style="text-align:center"></p><button class="btn btn-primary" id="co-ok">Continue shopping</button></div>
</dialog>

<div class="toasts" id="toasts" aria-live="polite"></div>
```

Important: cards, cart rows and dialogs are rendered by JavaScript **after** the engine's reveal observer has started, so they must NOT use `data-reveal` (they would stay invisible). They animate with the CSS `cardIn` keyframe above.

### C7. Page-specific JavaScript (the last `<script>`; replace PRODUCTS and CFG for the brand, keep the rest verbatim)

```js
(() => {
  const { $, $$, lenis, safe } = window.site;

  /* ───── configuration (AI: set for the brand) ───── */
  const CFG = { locale: 'en-IN', currency: 'INR', freeShip: 2999, shipFee: 149, promo: { WELCOME10: 0.10, FIRST15: 0.15 } };

  /* ───── catalogue (AI: write 12 products; distinct ids, real-feeling names, prices, ratings, 2 images each, sizes or [] ) ───── */
  const PRODUCTS = [
    { id: 'p1', name: 'Linen Overshirt', cat: 'Shirts', price: 3499, was: 4299, badge: 'Bestseller', rating: 4.8, reviews: 142, sizes: ['S', 'M', 'L', 'XL'],
      img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=1000&fit=crop&q=80&auto=format',
      img2: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&h=1000&fit=crop&q=80&auto=format',
      desc: 'Washed European linen with a relaxed boxy fit and corozo buttons.' },
    /* … 11 more … */
  ];

  /* ───── helpers ───── */
  const money = n => new Intl.NumberFormat(CFG.locale, { style: 'currency', currency: CFG.currency, maximumFractionDigits: 0 }).format(n);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const byId = id => PRODUCTS.find(p => p.id === id);
  const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
  const stars = r => Array.from({ length: 5 }, (_, i) => `<i class="ti ti-star${i < Math.round(r) ? '-filled' : ''}" aria-hidden="true"></i>`).join('');

  let cart = load('cart-v1', []).filter(i => byId(i.id));
  let wish = new Set(load('wish-v1', []));
  let promo = load('promo-v1', null);
  if (promo && !(promo in CFG.promo)) promo = null;
  const state = { cat: 'All', q: '', sort: 'featured' };
  let lastFocus = null;

  /* ───── toast ───── */
  const toast = (msg, icon = 'check') => {
    const el = document.createElement('div'); el.className = 'toast';
    el.innerHTML = `<i class="ti ti-${icon}" aria-hidden="true"></i><span>${esc(msg)}</span>`;
    $('#toasts').append(el);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 380); }, 2600);
  };

  /* ───── catalogue rendering ───── */
  const visible = () => {
    let list = PRODUCTS.filter(p => (state.cat === 'All' || p.cat === state.cat) && (!state.q || (p.name + ' ' + p.cat).toLowerCase().includes(state.q.toLowerCase())));
    if (state.sort === 'low') list = [...list].sort((a, b) => a.price - b.price);
    if (state.sort === 'high') list = [...list].sort((a, b) => b.price - a.price);
    if (state.sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  };
  const card = (p, i) => `
    <article class="pcard" style="--k:${i % 8}">
      <div class="pmedia media">
        <img src="${esc(p.img)}" width="800" height="1000" alt="${esc(p.name)}" loading="lazy" decoding="async" data-seed="${esc(p.id)}-a">
        ${p.img2 ? `<img class="alt" src="${esc(p.img2)}" width="800" height="1000" alt="" aria-hidden="true" loading="lazy" decoding="async" data-seed="${esc(p.id)}-b">` : ''}
        ${p.badge ? `<span class="badge-p">${esc(p.badge)}</span>` : ''}
        <button class="wish" data-wish="${esc(p.id)}" aria-pressed="${wish.has(p.id)}" aria-label="${wish.has(p.id) ? 'Remove from' : 'Add to'} wishlist: ${esc(p.name)}"><i class="ti ti-heart${wish.has(p.id) ? '-filled' : ''}" aria-hidden="true"></i></button>
        <button class="quick" data-qv="${esc(p.id)}">Quick view</button>
      </div>
      <div class="pinfo"><div><h3>${esc(p.name)}</h3><p class="muted">${esc(p.cat)}</p></div>
        <div class="pprice"><b>${money(p.price)}</b>${p.was ? `<s>${money(p.was)}</s>` : ''}</div></div>
      <div class="rate" aria-label="Rated ${p.rating} out of 5">${stars(p.rating)}<small>(${p.reviews})</small></div>
      <button class="btn btn-ghost btn-block" data-add="${esc(p.id)}">Add to bag</button>
    </article>`;
  const renderGrid = () => {
    const list = visible();
    $('#grid').innerHTML = list.length ? list.map(card).join('') : `<div class="empty"><i class="ti ti-mood-empty" style="font-size:40px"></i><p>No products match “${esc(state.q)}”.</p></div>`;
    $('#count').textContent = `${list.length} ${list.length === 1 ? 'item' : 'items'}`;
  };
  const renderChips = () => {
    const cats = ['All', ...new Set(PRODUCTS.map(p => p.cat))];
    $('#chips').innerHTML = cats.map(c => `<button class="chip" data-cat="${esc(c)}" aria-pressed="${c === state.cat}">${esc(c)}</button>`).join('');
  };
  const setCat = c => { state.cat = c; renderChips(); renderGrid(); };

  /* ───── cart maths ───── */
  const keyOf = (id, size) => id + '|' + (size || '');
  const totals = () => {
    const sub = cart.reduce((s, i) => s + byId(i.id).price * i.qty, 0);
    const disc = promo ? Math.round(sub * CFG.promo[promo]) : 0;
    const after = sub - disc;
    const ship = after === 0 ? 0 : after >= CFG.freeShip ? 0 : CFG.shipFee;
    return { sub, disc, after, ship, total: after + ship, count: cart.reduce((s, i) => s + i.qty, 0) };
  };
  const sumHTML = t => `
    <div><span>Subtotal</span><span>${money(t.sub)}</span></div>
    ${t.disc ? `<div><span>Discount (${esc(promo)})</span><span>−${money(t.disc)}</span></div>` : ''}
    <div><span>Shipping</span><span>${t.ship ? money(t.ship) : 'Free'}</span></div>
    <div class="total"><span>Total</span><span>${money(t.total)}</span></div>`;

  const persist = () => save('cart-v1', cart);
  const renderCart = () => {
    const t = totals(), badge = $('#cart-count');
    badge.textContent = t.count; badge.classList.toggle('on', t.count > 0);
    $('#drawer-n').textContent = t.count ? `(${t.count})` : '';
    const body = $('#drawer-body'), foot = $('#drawer-foot');
    if (!cart.length) {
      body.innerHTML = `<div class="cart-empty"><i class="ti ti-shopping-bag" aria-hidden="true"></i><p>Your bag is empty.</p><button class="btn btn-ghost" data-close-cart>Keep shopping</button></div>`;
      foot.hidden = true;
    } else {
      foot.hidden = false;
      body.innerHTML = cart.map(i => { const p = byId(i.id), k = keyOf(i.id, i.size); return `
        <div class="citem">
          <div class="media"><img src="${esc(p.img)}" width="152" height="190" alt="" loading="lazy" data-seed="${esc(p.id)}-a"></div>
          <div><h4>${esc(p.name)}</h4><small>${i.size ? 'Size ' + esc(i.size) + ' · ' : ''}${money(p.price)}</small>
            <div class="stepper"><button data-qty="${esc(k)}" data-d="-1" aria-label="Decrease quantity of ${esc(p.name)}"><i class="ti ti-minus" aria-hidden="true"></i></button><output>${i.qty}</output><button data-qty="${esc(k)}" data-d="1" aria-label="Increase quantity of ${esc(p.name)}"><i class="ti ti-plus" aria-hidden="true"></i></button></div></div>
          <div class="right"><b>${money(p.price * i.qty)}</b><button class="link-btn" data-remove="${esc(k)}">Remove</button></div>
        </div>`; }).join('');
      $('#sum').innerHTML = sumHTML(t);
    }
    const remaining = CFG.freeShip - t.after;
    $('#ship-msg').textContent = !cart.length ? `Free shipping on orders over ${money(CFG.freeShip)}` : remaining > 0 ? `You’re ${money(remaining)} away from free shipping` : 'You’ve unlocked free shipping';
    $('#ship-fill').style.setProperty('--p', Math.min(t.after / CFG.freeShip, 1));
    $('#promo-in').value = promo || '';
  };

  const add = (id, size, qty = 1) => {
    const k = keyOf(id, size), ex = cart.find(i => keyOf(i.id, i.size) === k);
    ex ? ex.qty += qty : cart.push({ id, size: size || '', qty });
    persist(); renderCart();
    const b = $('#cart-count'); b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
    toast(`${byId(id).name} added to bag`, 'shopping-bag');
  };
  const change = (k, d) => {
    const it = cart.find(i => keyOf(i.id, i.size) === k); if (!it) return;
    it.qty += d; if (it.qty <= 0) cart = cart.filter(i => i !== it);
    persist(); renderCart();
  };
  const remove = k => { cart = cart.filter(i => keyOf(i.id, i.size) !== k); persist(); renderCart(); };

  /* ───── drawer (focus managed, Esc to close, inert when closed) ───── */
  const drawer = $('#drawer'), overlay = $('#overlay');
  const lock = on => { lenis ? (on ? lenis.stop() : lenis.start()) : (document.body.style.overflow = on ? 'hidden' : ''); };
  const openCart = () => {
    lastFocus = document.activeElement; drawer.inert = false; drawer.setAttribute('aria-hidden', 'false');
    drawer.classList.add('open'); overlay.classList.add('open'); lock(true); $('#drawer-close').focus({ preventScroll: true });
  };
  const closeCart = () => {
    drawer.classList.remove('open'); overlay.classList.remove('open'); drawer.inert = true; drawer.setAttribute('aria-hidden', 'true');
    lock(false); lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true });
  };
  $('#cart-btn').addEventListener('click', openCart);
  $('#drawer-close').addEventListener('click', closeCart);
  overlay.addEventListener('click', closeCart);
  addEventListener('keydown', e => { if (e.key === 'Escape' && drawer.classList.contains('open')) closeCart(); });

  /* ───── promo ───── */
  $('#promo-form').addEventListener('submit', e => {
    e.preventDefault();
    const code = $('#promo-in').value.trim().toUpperCase(), msg = $('#promo-msg');
    if (code in CFG.promo) { promo = code; save('promo-v1', promo); msg.textContent = `Code ${code} applied: ${Math.round(CFG.promo[code] * 100)}% off`; msg.className = 'promo-msg ok'; renderCart(); }
    else { msg.textContent = code ? 'That code isn’t valid.' : 'Enter a code first.'; msg.className = 'promo-msg bad'; }
  });

  /* ───── quick view ───── */
  const qv = $('#qv');
  const openQV = id => {
    const p = byId(id); if (!p) return;
    $('#qv-body').innerHTML = `
      <div class="media"><img src="${esc(p.img)}" width="800" height="1000" alt="${esc(p.name)}" data-seed="${esc(p.id)}-a"></div>
      <div class="sheet-body">
        <p class="eyebrow">${esc(p.cat)}</p><h2 style="font-size:var(--step-3)">${esc(p.name)}</h2>
        <div class="rate">${stars(p.rating)}<small>${p.rating} · ${p.reviews} reviews</small></div>
        <p><b style="font-size:1.4rem">${money(p.price)}</b> ${p.was ? `<s class="muted">${money(p.was)}</s>` : ''}</p>
        <p class="muted">${esc(p.desc || '')}</p>
        ${p.sizes && p.sizes.length ? `<fieldset style="border:0"><legend class="eyebrow" style="margin-bottom:.6rem">Size</legend><div class="sizes">${p.sizes.map((s, i) => `<label><input type="radio" name="size" value="${esc(s)}" ${i === 0 ? 'checked' : ''}><span>${esc(s)}</span></label>`).join('')}</div></fieldset>` : ''}
        <div style="display:flex;gap:.6rem;flex-wrap:wrap"><button class="btn btn-primary btn-lg" style="flex:1" data-qv-add="${esc(p.id)}">Add to bag · ${money(p.price)}</button></div>
        <p class="muted" style="font-size:.85rem"><i class="ti ti-truck-delivery" aria-hidden="true"></i> Free shipping over ${money(CFG.freeShip)} · <i class="ti ti-refresh" aria-hidden="true"></i> 30-day returns</p>
      </div>`;
    lastFocus = document.activeElement; qv.showModal(); lock(true);
  };
  qv.addEventListener('close', () => { lock(false); lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true }); });
  $('#qv-close').addEventListener('click', () => qv.close());
  qv.addEventListener('click', e => { if (e.target === qv) qv.close(); });

  /* ───── delegated clicks ───── */
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-add],[data-qv],[data-wish],[data-qty],[data-remove],[data-cat],[data-qv-add],[data-close-cart],[data-shop-cat]');
    if (!t) return;
    if (t.dataset.add) { const p = byId(t.dataset.add); p.sizes && p.sizes.length > 1 ? openQV(p.id) : add(p.id, (p.sizes || [])[0] || ''); }
    else if (t.dataset.qv) openQV(t.dataset.qv);
    else if (t.dataset.qvAdd) { const s = qv.querySelector('input[name="size"]:checked'); add(t.dataset.qvAdd, s ? s.value : ''); qv.close(); openCart(); }
    else if (t.dataset.wish) {
      const id = t.dataset.wish; wish.has(id) ? wish.delete(id) : wish.add(id); save('wish-v1', [...wish]);
      t.setAttribute('aria-pressed', String(wish.has(id))); t.innerHTML = `<i class="ti ti-heart${wish.has(id) ? '-filled' : ''}" aria-hidden="true"></i>`;
      toast(wish.has(id) ? 'Saved to wishlist' : 'Removed from wishlist', 'heart');
    }
    else if (t.dataset.qty) change(t.dataset.qty, +t.dataset.d);
    else if (t.dataset.remove) remove(t.dataset.remove);
    else if (t.dataset.cat) setCat(t.dataset.cat);
    else if (t.dataset.shopCat) { setCat(t.dataset.shopCat); window.site.scrollToEl($('#shop')); }
    else if (t.hasAttribute('data-close-cart')) closeCart();
  });

  /* ───── toolbar ───── */
  let qT; $('#q').addEventListener('input', e => { clearTimeout(qT); qT = setTimeout(() => { state.q = e.target.value.trim(); renderGrid(); }, 160); });
  $('#sort').addEventListener('change', e => { state.sort = e.target.value; renderGrid(); });

  /* ───── checkout (demo) ───── */
  const co = $('#co');
  $('#checkout-btn').addEventListener('click', () => {
    if (!cart.length) return;
    const t = totals();
    $('#co-items').innerHTML = cart.map(i => { const p = byId(i.id); return `<div style="display:flex;justify-content:space-between;gap:1rem"><span>${esc(p.name)}${i.size ? ' · ' + esc(i.size) : ''} × ${i.qty}</span><span>${money(p.price * i.qty)}</span></div>`; }).join('');
    $('#co-sum').innerHTML = sumHTML(t);
    $('#co-form-view').hidden = false; $('#co-done').hidden = true;
    closeCart(); co.showModal(); lock(true);
  });
  co.addEventListener('close', () => lock(false));
  co.addEventListener('click', e => { if (e.target === co) co.close(); });
  $('#co-form').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.currentTarget; if (!f.checkValidity()) { f.reportValidity(); return; }
    const id = 'ORD-' + Math.random().toString(36).slice(2, 8).toUpperCase(), t = totals();
    $('#co-msg').textContent = `Order ${id} confirmed. A receipt for ${money(t.total)} is on its way to ${$('#c-email').value}.`;
    $('#co-form-view').hidden = true; $('#co-done').hidden = false;
    cart = []; promo = null; save('promo-v1', null); persist(); renderCart(); f.reset();
  });
  $('#co-ok').addEventListener('click', () => co.close());

  /* ───── announcement bar ───── */
  const ann = $('#announce');
  if (ann) { if (load('ann-x', false)) ann.remove(); $('#announce-x').addEventListener('click', () => { ann.remove(); save('ann-x', true); }); }

  /* ───── newsletter reveals promo ───── */
  const nl = $('#news-form');
  nl && nl.addEventListener('submit', e => { e.preventDefault(); if (!nl.checkValidity()) { nl.reportValidity(); return; } nl.reset(); toast('Subscribed. Use WELCOME10 for 10% off', 'gift'); });

  /* ───── init ───── */
  renderChips(); renderGrid(); renderCart();
})();
```

Rules for this script:
- The announcement bar sits **above** the fixed header: give the header `top` an offset only if the bar is visible, or make the bar part of normal flow and keep the header `position: fixed; top: 0` overlapping it when scrolled (acceptable); do not leave a gap.
- Category tiles use `data-shop-cat="Shirts"` so the delegated handler filters and scrolls.
- Never use inline `onclick` or unescaped template strings.
- Keep `PRODUCTS` ids unique and stable; the cart refers to them.

### C8. Content rules

- **Catalogue:** 12 products across 3–4 categories, each with a specific name (“Linen Overshirt”, not “Shirt 1”), realistic price points consistent with the brand (and `was` prices on about a third), one badge on a few (Bestseller / New / Low stock), rating 4.3–4.9, 20–400 reviews, 4–5 sizes where relevant, one-sentence material/fit description.
- **Images:** use Unsplash IDs you trust (fashion: `photo-1490481651871-ab68de25d43d`, `photo-1558769132-cb1aea458c5e`, `photo-1523170335258-f5ed11844a49`, `photo-1509631179647-0177331693ae`). Repeating an ID at a different crop is fine; give every product a distinct `data-seed` (already done by id). Tech/food/beauty stores should rely on the fallbacks and generated art rather than risky IDs.
- **Copy:** honest, no fake countdowns or invented “only 2 left” pressure; trust copy must match the config (shipping threshold, 30-day returns).
- **Policies:** footer links to Shipping, Returns, Privacy, Terms as `#` placeholders and a note to the owner to supply them.
- **SEO:** `<title>`, meta description, JSON-LD `Store` and a few `Product` entries with `offers`.

### C9. E-commerce checklist

- [ ] Cart count, drawer, totals, free-shipping bar and promo code all react to every add, change and remove
- [ ] Cart and wishlist survive a refresh (localStorage, wrapped in try/catch)
- [ ] Add-to-bag on a product with sizes opens quick view first; with one size it adds directly
- [ ] Drawer: focus moves in, `Esc` and overlay close it, focus returns, content behind is `inert`
- [ ] Dialogs (quick view, checkout) close with Esc and backdrop click; scroll is locked while open
- [ ] Product cards use `aspect-ratio`, `width`/`height`, alt text; hover swap only on pointer devices
- [ ] All user-influenced text passes through `esc()`; no inline handlers
- [ ] Empty states exist for the bag and for search with no results
- [ ] Closing notes say checkout is a demo and name the payment providers to connect

---

## ═══════════════════════════════════════════════
## PART D — QUICK-START PROMPTS
## ═══════════════════════════════════════════════

```
Build a store for THREAD & KILN — handmade linen clothing and ceramic homeware in Jaipur. Currency: INR.
Vibe: warm, earthy, calm. Palette: Terracotta. Products: invent 12. Free shipping over ₹2,999.
```

```
Build a store for VOLT — premium mechanical keyboards and desk accessories in Austin. Currency: USD.
Vibe: precise, dark, techy. Palette: Mono Lime. Products: invent 12. Free shipping over $75.
```

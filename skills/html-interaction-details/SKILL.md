---
name: html-interaction-details
description: The small details that make a plain HTML page feel crafted — button press weight, complete state design, optical alignment, hit areas, forgiving forms, keyboard support, feedback, remembered state and copy. Use when building or polishing buttons, forms, nav, cards, menus or any interactive element.
---

# HTML Interaction Details

Great interfaces are made of details nobody consciously notices. They work the way people already assume, so people move on without thinking. These rules distil the themes taught by Devouring Details (inferring intent, state design, feedback, forgiving input, click weight, keyboard), Invisible Details (optical alignment, perceived speed, predictability) and Interface Craft (intentional, anticipatory design). Only the public outlines of those courses were available, so the concrete values below come from established practice.

## 1. Design every state

Each interactive element gets all of these, deliberately:

`default · hover (pointer only) · focus-visible · active/pressed · disabled · loading · success · error · empty`

```css
.btn{
  --h: 48px;
  min-height: var(--h); padding: 0 1.5rem; border-radius: 12px;
  background: var(--accent); color: var(--on-accent); font-weight: 600; letter-spacing: -.005em;
  transition: transform var(--t-press) var(--ease-out), background-color var(--t-hover) var(--ease-out),
              box-shadow var(--t-hover) var(--ease-out);
}
@media (hover:hover) and (pointer:fine){ .btn:hover{ background: var(--accent-hover) } }
.btn:active{ transform: scale(.97) }                       /* the weight of a click */
.btn:focus-visible{ outline: 2px solid var(--accent); outline-offset: 3px }
.btn[disabled],.btn[aria-disabled="true"]{ opacity:.45; pointer-events:none }
.btn.is-loading{ pointer-events:none; color:transparent; position:relative }
.btn.is-loading::after{ content:""; position:absolute; inset:0; margin:auto; width:18px; height:18px;
  border:2px solid currentColor; border-color:var(--on-accent) transparent; border-radius:50%; animation:spin .7s linear infinite }
@keyframes spin{to{transform:rotate(360deg)}}
```

## 2. Click weight and feedback

- Press = `scale(.96–.98)` in 100–160ms, release springs back. Never larger than `.95`.
- Every action answers within ~100ms: a state change, a toast, a changed label ("Add to bag" → "Added ✓" for 1.6s), never silence.
- Feedback is a conversation: acknowledge, show progress if it takes >400ms, then confirm or explain failure.
- Hover must not be the only way to reveal something. Touch has no hover.

## 3. Hit areas and spacing

- Minimum target 44×44px (48 on primary actions). Extend small icons with padding or a pseudo-element, not by enlarging the glyph:

```css
.icon-btn{ position:relative } .icon-btn::after{ content:""; position:absolute; inset:-8px }
```
- Gaps between adjacent targets ≥ 8px.
- Space on a scale (4, 8, 12, 16, 24, 32, 48, 64, 96). Related items are closer than unrelated items (proximity carries meaning).

## 4. Optical alignment (looks right beats measures right)

- Icons beside text: nudge so the icon's visual centre sits on the text's x-height centre (often `translateY(-1px)`).
- Play triangles, arrows and rounded shapes need an optical offset; centre by weight, not by bounding box.
- Large display type needs tighter tracking (`letter-spacing: -.02em` to `-.04em`) and line-height ≈ 1 to 1.1; small caps and labels need positive tracking (`.08–.14em`).
- Concentric radii: inner radius = outer radius − padding.
- Use `text-wrap: balance` on headings and `text-wrap: pretty` on paragraphs.
- Tabular numbers for anything that changes or aligns: `font-variant-numeric: tabular-nums`.

## 5. Forms that forgive

```html
<label class="field">
  <span>Email</span>
  <input type="email" name="email" autocomplete="email" inputmode="email" required
         placeholder="you@studio.com" aria-describedby="email-hint">
  <small id="email-hint">We reply within a day.</small>
</label>
```

- Always a visible `<label>`; placeholder is an example, not the label.
- Right `type`, `autocomplete`, `inputmode`; font-size ≥ 16px so iOS does not zoom.
- Validate on blur (and on submit), not on every keystroke. Never clear a form on error.
- Accept messy input: trim, normalise spaces, strip formatting from phone and card numbers.
- Errors are specific and tell the next step ("Enter an email like name@site.com"), placed next to the field, with `aria-invalid="true"` and `role="alert"` on the message.
- The submit button states what happens ("Send message", not "Submit"). Disable only while sending, show a spinner, then a clear success state that replaces the form or confirms in place.
- Never rely on a native `alert()`.

## 6. Keyboard and focus

- Everything reachable and operable by keyboard; tab order = visual order.
- Visible `:focus-visible` ring on all controls (never `outline:0` without a replacement).
- Menus/dialogs: trap focus while open, return focus to the trigger on close, `Esc` closes. Prefer native `<dialog>` and `<details>`.
- Toggles use `aria-expanded`/`aria-pressed`; icon-only buttons need `aria-label`.
- Skip link at the top of the page. Mobile menu locks body scroll while open.

## 7. Perceived speed

- Respond optimistically; update the UI first when the action is safe.
- Reserve space for media (`width`/`height` or `aspect-ratio`) so nothing shifts.
- Use skeletons or blurred placeholders rather than spinners for content.
- Fast where the user is acting (100–200ms), slower only where it explains or delights (600ms+).
- Do not animate things used hundreds of times a day.

## 8. Remember state

Persist harmless preferences (theme, cart, last filter, dismissed banner) in `localStorage`, wrapped in `try/catch`; restore before first paint where possible to avoid flicker.

```js
const store = { get:k=>{try{return JSON.parse(localStorage.getItem(k))}catch{return null}},
                set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}} };
```

## 9. Words are part of the interface

Verbs on buttons ("Start free trial", "Book a table"); sentence case; no "Click here"; error text is plain, never blames the user; empty states say what to do next; numbers have units and real-looking values.

## 10. Details checklist

- [ ] All eight states exist for buttons, inputs, cards, links
- [ ] Hover gated by `(hover:hover) and (pointer:fine)`
- [ ] 44px targets, 8px gaps
- [ ] Headings balanced, numbers tabular, radii concentric
- [ ] Forms labelled, typed, validated on blur, errors specific
- [ ] Keyboard path tested end to end; focus visible and returned
- [ ] Layout never shifts as content loads
- [ ] Every action has visible feedback

## Output

Return the working markup/CSS/JS. Then at most two lines naming the detail decisions that are not obvious from the code (for example the optical offset applied, or why a state was left without motion).

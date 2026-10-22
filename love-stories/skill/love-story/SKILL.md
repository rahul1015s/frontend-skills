---
name: love-story-page
description: Turn any relationship topic (an apology when she is not talking, a flirty date invite, long distance, a proposal, an anniversary, a Mars-and-Venus understanding story, comfort, birthdays) into a cinematic, illustrated, scroll-driven love-story web page with minimal text, flower-fill transitions, rain-to-rainbow skies and a Yes/No finale. Use when the user wants a romantic or relationship page, an apology or I-miss-you page, a proposal or date invitation, or a Reel-style animated love story in HTML.
---

# LOVE STORY PAGE — SKILL v1.0
### Tell any AI a relationship topic. It writes a short story script. A tested engine turns it into a cinematic, illustrated, scroll-driven web page.

> **HOW TO USE**
> 1. Paste this ENTIRE file into any capable AI (Claude, GPT, Gemini…), or install it as a Claude Code skill.
> 2. Then send the topic, for example:
>    - `My girlfriend is upset and not talking to me. Make a sorry page for Priya from Rahul.`
>    - `Flirty page to ask Aanya on a date this Saturday. I'm Kabir.`
>    - `Long-distance love page for my husband Dev, I'm Meera.`
>    - `Mars and Venus: a page that helps us understand each other.`
> 3. The AI returns **one small HTML file**. Open it on a phone or laptop, or host it free (GitHub Pages / Netlify Drop) and send the link.

You (the AI) are a **film director for tiny love stories**. You do **not** draw pictures. A tested engine already contains the illustrations (couples, rain, moon, flowers, planets, rainbow, envelope, lanterns, candles…), the animation, the particle effects and the scroll mechanics. Your job is to **write the story script**: which scenes, in what order, with which props, and the few words on screen.

If a detail is missing (names, city, small facts), invent a sweet, believable placeholder and list what to personalise in the closing notes. Never ask clarifying questions first.

---

## PART 1. WHAT THE PAGE FEELS LIKE

- A full-screen illustrated "film" on a phone-sized stage. The visitor **scrolls and the story plays**: the sky changes colour, rain turns to a rainbow, the two people walk toward each other, and at the turning point **the whole screen fills with flowers**.
- **Almost no text.** One short caption per scene (max 8 words), optionally one tiny handwritten whisper. No paragraphs, no cards, no square photos. Photos appear only inside floating **heart frames**.
- It ends with **one question** (a big Yes button and a "No" button that playfully runs away, or stays gentle in serious moments). Yes triggers hearts, a flower-fill, and a short love note with an optional reply button.
- A **Play** button auto-plays the story like a video (also `?reel=1`, which hides the interface so it can be screen-recorded for Reels/Shorts).

---

## PART 2. THE PAGE (copy exactly; change only the title and the `LoveStory({...})` object)

Everything is loaded from CDNs. The engine files are pinned to an immutable commit.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>TITLE (a warm, personal title)</title>
<meta name="theme-color" content="#05050c">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600;1,700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rahul1015s/frontend-skills@5636cf0166b2658f21292fdacfade40bc4b59290/love-stories/engine/engine.css">
</head>
<body>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/rahul1015s/frontend-skills@5636cf0166b2658f21292fdacfade40bc4b59290/love-stories/engine/engine.bundle.js"></script>
<script>
LoveStory({
  title: '…',
  scenes: [ /* PART 3 */ ],
  finale: { /* PART 3 */ }
});
</script>
</body>
</html>
```

Rules: do not add any other CSS, HTML, `<script>`, images or libraries. Do not rewrite or inline the engine. The whole page is this template plus the `LoveStory({...})` object.

---

## PART 3. THE STORY SCRIPT

### 3.1 Top level

```js
LoveStory({
  title: 'For Priya, I am sorry',     // browser tab title
  reelSeconds: 4.5,                    // seconds per scene in Play / ?reel=1 mode (3.8 – 5)
  he:  { skin: '#e0ac86', hair: '#1c1a22', top: '#3b5bdb', hairStyle: 'short', beard: false },   // defaults for every "he" figure
  she: { skin: '#f2c4a0', hair: '#2a1a1a', top: '#ff6b8b', hairStyle: 'long' },                   // defaults for every "she" figure
  bloomColors: ['#ff4d6d', '#ff8fab', '#ffd166', '#ffffff'],   // optional flower-fill palette
  scenes: [ … 6 to 10 scenes … ],
  finale: { … }                        // omit for a daily greeting that just ends
});
```

Looks: skin tones `#f2c4a0` `#e0ac86` `#c68642` `#8d5524` `#5c3a21`; `hairStyle` for she: `long` `bun` `pony` `curly`; for he: `short` `curly`; `beard: true` (or a colour) for a bearded man. Match what the user told you about themselves. **Same-sex couples:** in a `couple`, pass `he: { who: 'she' }` (two women) or `she: { who: 'he' }` (two men) and set their looks.

### 3.2 A scene

```js
{ sky: 'rain-night',            // see sky list
  skyTo: 'dawn', skyAt: .3,     // optional: the sky morphs to this colour during the scene (skyAt 0–.6)
  fx: 'rain',                   // particle effect
  cap: 'Some silences are louder than words.',   // ≤ 8 words. optional but almost every scene has one
  whisper: 'optional tiny handwritten line',      // ≤ 5 words, rarely
  capPos: 'top',                // 'top' (default for stories) | 'mid' | 'bottom'
  ground: 84,                   // % from the top where people stand (80–90). 'g' in prop y means this line
  out: 'bloom',                 // optional: the screen fills with flowers between this scene and the next
  zoom: [1, 1.07],              // optional camera push
  props: [ … ] }
```

**Skies:** `night` `rain-night` `rain` `dusk` `dawn` `golden` `blush` `sunny` `candle` `lavender` `space` `void` `rose` `mint`, or a custom `['#top', '#middle', '#bottom']`.
**fx:** `rain` `snow` `petals` `rose` (red petals) `hearts` `fireflies` `sparkle` `confetti` `fireworks` `none`.

### 3.3 Props (every prop is one object in a scene's `props` array)

Common keys: `p` (name), `x`, `y` (position as % of the screen; `y: 'g'` = the ground line; `y: '84%'` also works), `s` (scale, 1 = default), `a` (entrance: `fade` `rise` `drop` `pop` `slide-l` `slide-r` `grow` `none`), `at` (when in the scene it enters, 0–.6), `d` (entrance length), `hd` (extra draw time for animated props), `idle` (`bob` `float` `sway` `beat` or `''` for still), `flip` (mirror), `z` (stacking), `to: { x, y, s, r }` (move/scale/rotate during the scene), `toAt`, `toD`. Props are drawn in array order (later = in front).

| Prop `p` | What it is | Extra keys |
| --- | --- | --- |
| `stars` | twinkling star field | `n` (count), `h` (% of screen height covered) |
| `moon` | full or crescent moon with glow | `k: 'crescent'` |
| `sun` | sun with slowly turning rays | |
| `clouds` | drifting clouds (full width) | `y` (%), `tint`, `o` (opacity), `n` |
| `rainbow` | draws itself arc by arc | |
| `city` | skyline with glowing windows | `pal: [back, front]`, `h`, `bottom` |
| `hills` | 3 layered parallax hills (the ground) | `pal: 'night' 'day' 'dusk' 'blush' 'candle' 'dawn' 'space' 'rain' 'golden' 'mars' 'venus' 'mint'`, `hs: [h1, h2, h3]` |
| `flowers` | a row of flowers that grow | `n`, `y: '84%'`, `x1`, `x2`, `colors`, `types` |
| `blossom`, `rose` | one big flower / one long-stem rose | `type`, `color` |
| `cherry`, `pine` | trees (cherry blossom sways) | |
| `heart` | a beating heart | `color` |
| `hearts` | many hearts floating up | `n` |
| `balloons`, `lanterns` | rising balloons / glowing sky lanterns | `colors`, `n` |
| `plane` | paper plane (animate with `to`) | |
| `word` | handwritten word that writes itself | `t` (text, ≤ 14 chars), `color` |
| `envelope` | envelope opens, letter rises | |
| `phone` | phone with chat bubbles, typing dots, sent heart | |
| `window` | rainy window with curtains | `glass`, `curtain` |
| `lamp` | street lamp with soft glow | |
| `candles`, `glasses` | candles / two wine glasses that clink | |
| `gift`, `cake`, `cups` | gift (lid pops), birthday cake with candles, two coffee cups with steam | `color` (gift) |
| `planet` | mars, venus, jupiter or earth | `kind` |
| `bridge` | a bridge of hearts builds between two sides | `n` |
| `constellation` | a heart made of stars that draws itself | |
| `heartbeat` | ECG line that ends in a heart | `color` |
| `photos` | photos floating in heart frames | `imgs: [url, …]` (2–5), `spots: [0,1,2,3]` |
| `figure` | one person | `pose`, `who: 'he' \| 'she'`, `skin`, `top`, `bottom`, `hair`, `hairStyle`, `beard`, `back: true` (seen from behind), `dress: false`, `pose2` + `pose2at` (changes pose mid-scene) |
| `couple` | two people (he on the left, she on the right) | `pose`, `he: {…}`, `she: {…}`, `umbrella: '#ff4d6d'` |

**Figure poses:** `stand` `sad` `happy` `wave` `reach` `walk` `back` `sit` `sitfront` `phone`.
**Couple poses:** `apart` (back to back) `holdhands` `hug` `forehead` (foreheads touching) `dance` `kneel` (proposal with ring) `bench` (both sitting) `benchsolo` (she sits alone on the bench).

### 3.4 The finale (the ask)

```js
finale: {
  pos: 'high',                 // 'high' (default; best when people stand at the bottom) | 'mid' | 'low'
  q: 'Will you forgive me?',   // the big question, ≤ 7 words
  yes: 'Yes, my love 💗',      // the big button
  no: 'Still angry',           // the second button
  dodge: true,                 // true: playful "No" that runs away (flirty, birthday, proposal, anniversary). false: calm "No" that answers gently (apology, comfort, anything serious)
  noMsg: 'That’s okay. I’m here whenever you’re ready.',   // shown when dodge is false
  noGiveUp: 'ok… yes 💗',      // after 6 dodges the runaway button gives up (dodge true)
  yesTitle: 'Thank you, my love',
  letter: ['One short, sincere line.', 'Another short line.'],   // ≤ 2–3 lines, each ≤ 14 words
  reply: { label: 'Tell Rahul 💌', url: 'https://wa.me/910000000000?text=I%20forgive%20you%20%F0%9F%92%97' }   // optional; placeholder number, tell the user to replace it
}
```
Keep the upper-middle of the **last scene** (about 15–45% of the screen height) clear, because the question and buttons appear there; put people and ground props low and keep the last scene's `cap` short.

---

## PART 4. DIRECTION RULES (this is what makes it good)

1. **Emotional arc.** Hook the feeling in scene 1 (no preamble) → deepen it → **turning point** → repair/joy → **the ask**. 6–10 scenes. Each scene carries exactly one idea.
2. **Colour tells the story.** Sad/serious scenes: `rain-night` `rain` `void` `night` with `fx:'rain'`. After the turning point: `dawn` → `golden` → `sunny`, `fx:'petals'` or `hearts`. Use `skyTo` to turn a scene from night to dawn *while the viewer watches*.
3. **Use the flower-fill (`out:'bloom'`) at the turning point** (once or twice per story, never more). It is the signature moment.
4. **People are the story.** At least 3 scenes have a `figure` or `couple`. Show the emotion with pose: `back`/`sad`/`apart` for distance, `walk` for effort, `reach`/`wave` for reaching out, `hug`/`holdhands`/`forehead` for closeness. Move people with `to` (walking toward each other is powerful).
5. **Words.** Caption ≤ 8 words, warm, specific, in the sender's voice, in simple everyday language (match the user's language; Hinglish/Hindi/Spanish etc. is welcome if they write that way). No clichés piled up, no instructions, no explanations. One sincere line beats three pretty ones.
6. **Composition.** Keep people on the ground line (`y:'g'`), props in the sky (`y` 15–45), captions at the top. Don't stack props on top of each other; `x` between 15 and 85 so nothing is cut off on a phone. Don't put two big props in one scene.
7. **Variety.** Don't repeat the same pose, sky or props in consecutive scenes. Mix wide scenes (planets, city, rainbow) with intimate ones (a window, a bench, a letter).
8. **Photos.** If the user wants their own photos, use a `photos` prop with their image URLs. Otherwise skip photos, or use the stand-in couple photos below and tell the user to replace them.
9. **Mobile first.** The engine is already responsive; just obey rules 6–7.
10. **Tone and boundaries.** Romantic, sweet, funny, flirty, tender and even passionate are all fine. Keep it **tasteful**: candlelight, roses, slow dancing, foreheads together. **No explicit sexual content, no nudity, no guilt-tripping, pressure, manipulation or threats.** An apology page must be sincere and take responsibility; it must not blame the other person or demand forgiveness. If the situation sounds serious (abuse, safety, someone who has said they want no contact), do not build the page; say kindly that a message like this may not be welcome and suggest respecting their wishes.
11. **Personalisation notes.** In the closing message, list what to change: names, the reply number/URL, any photos, and the skin/hair looks.

---

## PART 5. SCENARIO LIBRARY (pick one, mix them, or invent a new one in the same spirit)

Each row is a beat sheet: scene → sky / fx / main props / caption idea. Adapt names and details; do not copy captions word for word.

**1. Apology: she is upset or not talking** (`dodge:false`)
night window `rain-night` rain · `window` + `figure back (she)` — "Some silences are louder than words." → `couple apart` under `lamp` — "We stood so close, and felt so far." → `phone` + `figure phone (he)` — "You typed it a hundred times." → `skyTo dawn`, `figure walk (he)` toward her, **bloom** — "So I walked toward you." → `envelope`, hearts — "Sorry isn't a word. It's a promise." → `photos` — "Remember how we used to laugh?" → `couple hug`, `cherry`, `flowers`, petals — "I'm here. I'm not going anywhere." → `rainbow` + `couple holdhands` — "After every storm, a rainbow." → constellation heart + `couple bench`, fireflies → **"Will you forgive me?"**

**2. Making up after a fight (both sides)** (`dodge:false`)
`couple apart` rain — "We both said things." → two `figure sad` far apart — "And we both hurt." → `bridge` between two `planet` — "But I'd rather build a bridge." → both `walk` toward each other, **bloom** → `couple hug` — "I'm sorry too." → `rainbow` → ask: **"Start again?"**

**3. Miss you / long distance**
two `figure`s far apart under a giant `moon` — "Same moon. Different skies." → `phone` + `heartbeat` — "Every night, I look for you." → `plane` crossing, hearts — "I would cross any sky for you." → `constellation` — "Our names are written in the stars." → `lanterns` — "I send my wishes up to you." → `walk` + `wave`, `skyTo dawn` — "And then, finally… you." → `couple hug` golden — "Home is wherever you are." → **"Did you miss me too?"** (see example)

**4. Good morning / good night (no finale needed)**
`sun` rising (use `to: {y: 24}`) over `flowers` — "Good morning, beautiful." → `cups` — "I thought of you first." → `figure happy` + `balloons` — "Today is yours. Go shine." → `rose` + `heart` — "I'm cheering for you." · *Good night:* `night` + `moon` + `stars` + `couple bench` — "Sleep well, my love." → `constellation` — "Dream of us."

**5. Flirty: asking someone out** (`dodge:true`)
`golden` `city` + `figure wave (he)` — "Hey you. Yes, you." → `balloons` + `figure happy` + `cups` — "I can't stop thinking about that smile." → dusk `couple holdhands` between two `lamp`s — "Walk with me?" → `candles` + `glasses` — "Candlelight. A table for two." → `couple forehead` + `umbrella`, rain — "And if it rains, I've got an umbrella." → **"Be my date this Saturday?"** (`yes: 'Obviously 😏'`)

**6. Confession: "I like you"** (`dodge:true`)
`sunny` `cherry` + `figure stand (he)` — "I've been meaning to tell you something…" → `heartbeat` + two figures — "Every time you smile, my heart skips." → `envelope` — "So I wrote you a letter." → `couple holdhands` golden — "Maybe we could walk together?" → **"Do you feel it too?"**

**7. Proposal** (`dodge:true`)
`sunny` `walk` — "From our very first hello…" → `couple holdhands` golden + `cherry` — "Every season, you felt like home." → `photos` — "Memories we made together." → `night` `lanterns` — "Tonight, the sky is ours." → `couple kneel` `candle` sky, sparkle — "I have one question." → **"Will you marry me?"** (`yes: 'YES 💍'`)

**8. Anniversary** (`dodge:true`)
`couple hug` dusk — "Another year. Another thousand reasons." → `photos`, **bloom** — "Every laugh. Every adventure." → `couple dance` + `city`, `fx:'fireworks'` — "You light up my whole sky." → `cake` + `gift`s, `rose` petals — "Make a wish, my love." → **"Another year with me?"**

**9. Birthday** (`dodge:true`)
`blush` `confetti` + `figure happy` + `balloons` — "Today the world celebrates you." → `gift` (lid pops), **bloom** — "A little something, just for you." → `cake`, `candle` sky — "Close your eyes. Make a wish." → `fireworks` + `couple hug` — "May every wish come true." → **"Ready to blow the candles?"**

**10. Comfort: she is sad, stressed or having a bad day** (`dodge:false`)
`rain-night` `couple benchsolo` + `lamp` — "Hey. I see you." → `figure sad` + `figure walk (he)` approaching — "You don't have to be strong alone." → `couple forehead` + `umbrella`, skyTo dusk, **bloom** — "Come here. I've got you." → `couple hug` dawn + flowers — "The storm will pass. I'll stay." → `rainbow` — "And look: a rainbow." → **"Can I hold you?"**

**11. Mars and Venus: understanding each other** (original story about different communication styles; `dodge:true` is fine)
`space` two `planet`s (mars left, venus right) — "We come from different worlds." → `hills pal:'mars'` + `figure sit (he)` — "He goes quiet to think it through." → `rose` sky + `hills pal:'venus'` + `figure reach (she)` + hearts — "She needs to talk it through." → `bridge` between planets — "Different languages. Same love." → two figures walking together, **bloom** — "Listen: to understand, not to answer." → `couple holdhands` dawn — "Two worlds. One home." → **"Meet me in the middle?"**
*(This is an original story using the familiar idea that people can communicate differently; do not quote any book.)*

**12. Passion: a romantic night (tasteful)** (`dodge:true`)
`candle` sky, `fx:'rose'`, `candles` + crescent `moon` — "Tonight is ours." → `couple dance` between two `lamp`s (she in red) — "Slow music. Warm light." → `glasses` clink, `rose` sky, **bloom** — "Only you. Only now." → `couple forehead` — "Closer." → **"Dance with me?"** (`yes: 'Take my hand 🌹'`)

**13. Thank you / appreciation**
`sunny` `figure wave` — "Thank you for being you." → `flowers` growing one by one — "You make ordinary days bloom." → `cups` + `cherry` — "For every quiet morning." → `couple hug` golden — "I'm so lucky." → **"Can I say it again tomorrow?"**

**14. Reassurance: "you're the only one"** (`dodge:false`)
`night` `figure sad (she)` far from `figure stand (he)` — "I know you're worried." → `constellation` — "Out of all the stars, you." → `heart` + `heartbeat` — "My heart only knows your name." → `couple holdhands` → **"Do you believe me?"**

**15. Growing old together**
`couple holdhands` in a city at dusk → `photos` → `couple bench` in `golden` — "Let's be old together." → **"Forever?"**

**16. Will you be my girlfriend / boyfriend** (`dodge:true`)
like #5/#6, ending **"Will you be mine?"** (`yes: 'Yes 💗'`)

**17. Surprise trip invite**
`plane` over clouds `sunny` — "Pack a bag." → `planet earth` / `city` — "I'm taking you somewhere." → `couple holdhands` + `balloons` → **"Are you in?"**

---

## PART 6. FULL EXAMPLES (study the pacing, the prop choices and the economy of words)

### Example A: apology (user: "my girlfriend Priya is upset and not talking to me; I'm Rahul")

```js
{
  title: 'For Priya, I am sorry',
  reelSeconds: 4.4,
  scenes: [
    { sky: 'rain-night', fx: 'rain', cap: 'Some silences are louder than words.', capPos: 'top', ground: 92,
      props: [{ p: 'stars', n: 30, a: 'fade' }, { p: 'clouds', y: 8, tint: '#59638a', o: .8 }, { p: 'moon', k: 'crescent', x: 82, y: 22, s: .8 },
        { p: 'window', x: 50, y: 98, s: 1.18, z: 1, a: 'rise' }, { p: 'figure', pose: 'back', who: 'she', back: true, x: 50, y: 98, s: .82, z: 2, a: 'fade', top: '#c4547a', hair: '#22161a' }] },
    { sky: 'rain-night', fx: 'rain', cap: 'We stood so close, and felt so far.', capPos: 'top', ground: 84,
      props: [{ p: 'stars', n: 20 }, { p: 'hills', pal: 'rain', hs: [30, 20, 12] }, { p: 'lamp', x: 50, y: 'g', s: 1.5, a: 'fade' },
        { p: 'couple', pose: 'apart', x: 50, y: 'g', s: 1.05, a: 'fade', toAt: .1, toD: .7 }] },
    { sky: 'void', fx: 'rain', cap: 'You typed it a hundred times.', capPos: 'top', ground: 88,
      props: [{ p: 'stars', n: 24 }, { p: 'figure', pose: 'phone', who: 'he', x: 26, y: 'g', s: 1.05, a: 'rise' }, { p: 'phone', x: 66, y: 50, s: 1.55, a: 'pop', hd: .45, d: .25 }] },
    { sky: 'rain-night', skyTo: 'dawn', skyAt: .25, skyD: .6, fx: 'rain', cap: 'So I walked toward you.', capPos: 'top', ground: 84, out: 'bloom',
      props: [{ p: 'hills', pal: 'rain', hs: [30, 20, 12] }, { p: 'figure', pose: 'walk', who: 'he', x: 6, y: 'g', s: 1.05, a: 'fade', to: { x: 60 }, toD: .8 },
        { p: 'figure', pose: 'back', who: 'she', back: true, x: 78, y: 'g', s: 1.05, a: 'fade' }] },
    { sky: 'dawn', fx: 'hearts', cap: 'Sorry isn’t a word. It’s a promise.', capPos: 'top', ground: 84,
      props: [{ p: 'clouds', y: 14, tint: '#fff2f6' }, { p: 'hills', pal: 'dawn' }, { p: 'hearts', n: 16 }, { p: 'envelope', x: 50, y: 48, s: 1.25, a: 'pop', d: .3, hd: .5 }] },
    { sky: 'blush', fx: 'petals', cap: 'Remember how we used to laugh?', capPos: 'top', ground: 84, out: 'bloom',
      props: [{ p: 'clouds', y: 8, tint: '#ffffff' }, { p: 'hills', pal: 'blush' }, { p: 'photos', imgs: ['https://images.unsplash.com/photo-1519741497674-611481863552?w=500&h=450&fit=crop&q=80&auto=format', 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=500&h=450&fit=crop&q=80&auto=format', 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=500&h=450&fit=crop&q=80&auto=format', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500&h=450&fit=crop&q=80&auto=format'], spots: [0, 1, 2, 3] }] },
    { sky: 'golden', fx: 'petals', cap: 'I’m here. I’m not going anywhere.', capPos: 'top', ground: 80,
      props: [{ p: 'sun', x: 50, y: 30, s: 1 }, { p: 'clouds', y: 18, tint: '#fff6e0', o: .7 }, { p: 'hills', pal: 'golden', hs: [34, 24, 14] }, { p: 'cherry', x: 16, y: 'g', s: 1.1 }, { p: 'cherry', x: 86, y: 'g', s: .9, flip: true },
        { p: 'flowers', n: 12, y: '83%', a: 'none', hd: .5 }, { p: 'couple', pose: 'hug', x: 50, y: '84%', s: .95, a: 'pop', d: .3 }] },
    { sky: 'sunny', fx: 'petals', cap: 'After every storm, a rainbow.', capPos: 'top', ground: 82,
      props: [{ p: 'clouds', y: 6, tint: '#ffffff' }, { p: 'rainbow', x: 50, y: 66, s: 1.1, a: 'none', d: .5, hd: .4 }, { p: 'hills', pal: 'day', hs: [30, 22, 13] }, { p: 'flowers', n: 14, y: '84%', hd: .5 }, { p: 'couple', pose: 'holdhands', x: 50, y: '85%', s: .9, a: 'rise' }] },
    { sky: 'night', fx: 'fireflies', cap: '', ground: 86,
      props: [{ p: 'stars', n: 90 }, { p: 'moon', x: 80, y: 14, s: .7 }, { p: 'constellation', x: 50, y: 25, s: 1.1, d: .5, hd: .5 }, { p: 'hills', pal: 'night', hs: [30, 20, 12] }, { p: 'couple', pose: 'bench', x: 50, y: '88%', s: .78, a: 'rise' }] }
  ],
  finale: {
    pos: 'mid', q: 'Will you forgive me?', yes: 'Yes, my love 💗', no: 'Still angry', dodge: false, noMsg: 'That’s okay. I’m here whenever you’re ready.', noGiveUp: 'ok… yes 💗',
    yesTitle: 'Thank you, my love',
    letter: ['I will never take your silence lightly again.', 'I love you more than my words can say.'],
    reply: { label: 'Tell Rahul 💌', url: 'https://wa.me/910000000000?text=I%20forgive%20you%20%F0%9F%92%97' }
  }
}
```

### Example B: flirty date invite

```js
{
  title: 'Dinner with me?',
  reelSeconds: 4.2,
  scenes: [
    { sky: 'golden', fx: 'sparkle', cap: 'Hey you. Yes, you.', capPos: 'top', ground: 86,
      props: [{ p: 'clouds', y: 10, tint: '#fff6e0' }, { p: 'city', pal: ['#e08a5b', '#c96a45'], h: 34, bottom: 15 }, { p: 'hills', pal: 'golden', hs: [18, 12, 8] }, { p: 'figure', pose: 'wave', who: 'he', x: 50, y: 'g', s: 1.2, a: 'rise' }] },
    { sky: 'blush', fx: 'hearts', cap: 'I can’t stop thinking about that smile.', capPos: 'top', ground: 84,
      props: [{ p: 'clouds', y: 8, tint: '#fff' }, { p: 'balloons', x: 24, y: 52, s: 1.3, a: 'rise' }, { p: 'hills', pal: 'blush' }, { p: 'figure', pose: 'happy', who: 'she', x: 64, y: 'g', s: 1.1, a: 'pop' }, { p: 'cups', x: 30, y: 74, s: 1, a: 'pop', at: .3 }] },
    { sky: 'dusk', fx: 'sparkle', cap: 'Walk with me?', capPos: 'top', ground: 86, out: 'bloom',
      props: [{ p: 'stars', n: 30, h: 40 }, { p: 'city', pal: ['#2a1a40', '#3a2458'], h: 36, bottom: 14 }, { p: 'hills', pal: 'dusk', hs: [20, 13, 8] }, { p: 'lamp', x: 18, y: 'g', s: 1.4 }, { p: 'lamp', x: 84, y: 'g', s: 1.4 }, { p: 'couple', pose: 'holdhands', x: 50, y: 'g', s: 1, a: 'rise', to: { x: 56 }, toD: .7 }] },
    { sky: 'candle', fx: 'rose', cap: 'Candlelight. A table for two.', capPos: 'top', ground: 88,
      props: [{ p: 'hills', pal: 'candle', hs: [20, 12, 7] }, { p: 'candles', x: 50, y: 84, s: 1.3, a: 'rise' }, { p: 'glasses', x: 50, y: 56, s: 1.2, d: .5, hd: .4 }] },
    { sky: 'rain-night', fx: 'rain', skyTo: 'dusk', skyAt: .3, cap: 'And if it rains? I’ve got an umbrella.', capPos: 'top', ground: 88,
      props: [{ p: 'stars', n: 20 }, { p: 'hills', pal: 'rain', hs: [24, 15, 9] }, { p: 'lamp', x: 20, y: 'g', s: 1.4 }, { p: 'couple', pose: 'forehead', umbrella: '#ff4d6d', x: 54, y: 'g', s: .95, a: 'rise' }] }
  ],
  finale: { pos: 'high', q: 'Be my date this Saturday?', yes: 'Obviously 😏', no: 'Let me think…', noGiveUp: 'fine, yes 😏', yesTitle: 'It’s a date!', letter: ['Wear something that makes you smile.', 'I’ll handle the rest.'], reply: { label: 'Confirm the plan 💌', url: 'https://wa.me/910000000000?text=It%27s%20a%20date%20%F0%9F%98%8F' } }
}
```

### Example C: Mars and Venus

```js
{
  title: 'Two different worlds',
  reelSeconds: 4.8,
  scenes: [
    { sky: 'space', fx: 'sparkle', cap: 'We come from different worlds.', capPos: 'top', ground: 90,
      props: [{ p: 'stars', n: 120, h: 90 }, { p: 'planet', kind: 'mars', x: 20, y: 56, s: 1.3, a: 'slide-l' }, { p: 'planet', kind: 'venus', x: 80, y: 56, s: 1.3, a: 'slide-r' }] },
    { sky: 'space', fx: 'sparkle', cap: 'He goes quiet to think it through.', capPos: 'top', ground: 80,
      props: [{ p: 'stars', n: 80, h: 90 }, { p: 'hills', pal: 'mars', hs: [34, 24, 14] }, { p: 'figure', pose: 'sit', who: 'he', x: 50, y: 'g', s: 1.1, a: 'rise' }, { p: 'planet', kind: 'mars', x: 82, y: 22, s: .7 }] },
    { sky: 'rose', fx: 'hearts', cap: 'She needs to talk it through.', capPos: 'top', ground: 80,
      props: [{ p: 'stars', n: 50, h: 50 }, { p: 'hills', pal: 'venus', hs: [34, 24, 14] }, { p: 'hearts', n: 14 }, { p: 'figure', pose: 'reach', who: 'she', x: 50, y: 'g', s: 1.1, a: 'rise' }, { p: 'planet', kind: 'venus', x: 18, y: 22, s: .7 }] },
    { sky: 'space', fx: 'sparkle', cap: 'Different languages. Same love.', capPos: 'top', ground: 90,
      props: [{ p: 'stars', n: 120, h: 90 }, { p: 'planet', kind: 'mars', x: 14, y: 60, s: 1.0 }, { p: 'planet', kind: 'venus', x: 86, y: 60, s: 1.0 }, { p: 'bridge', x: 50, y: 56, s: .8, d: .3, hd: .2 }] },
    { sky: 'lavender', fx: 'hearts', cap: 'Listen — to understand, not to answer.', capPos: 'top', ground: 84, out: 'bloom',
      props: [{ p: 'stars', n: 60 }, { p: 'hills', pal: 'dusk' }, { p: 'figure', pose: 'stand', who: 'he', x: 30, y: 'g', s: 1, a: 'rise', to: { x: 40 }, toD: .7 }, { p: 'figure', pose: 'stand', who: 'she', x: 70, y: 'g', s: 1, a: 'rise', to: { x: 60 }, toD: .7 }, { p: 'hearts', n: 10 }] },
    { sky: 'dawn', fx: 'petals', cap: 'Two worlds. One home.', capPos: 'top', ground: 82,
      props: [{ p: 'sun', x: 50, y: 26, s: .9 }, { p: 'clouds', y: 14, tint: '#fff2f6' }, { p: 'hills', pal: 'dawn' }, { p: 'flowers', n: 12, y: '84%', hd: .5 }, { p: 'couple', pose: 'holdhands', x: 50, y: '85%', s: .95, a: 'pop' }] }
  ],
  finale: { pos: 'high', q: 'Meet me in the middle?', yes: 'Always 💗', no: 'Hmm…', noGiveUp: 'ok… always 💗', yesTitle: 'Thank you for hearing me', letter: ['I will listen first.', 'I will love you, always.'], reply: { label: 'Reply 💌', url: 'https://wa.me/910000000000?text=Meet%20in%20the%20middle%20%F0%9F%92%97' } }
}
```

### Example D: proposal

```js
{
  title: 'One question',
  reelSeconds: 4.6,
  scenes: [
    { sky: 'sunny', fx: 'petals', cap: 'From our very first hello…', capPos: 'top', ground: 84,
      props: [{ p: 'clouds', y: 8, tint: '#fff' }, { p: 'hills', pal: 'day', hs: [28, 20, 12] }, { p: 'cherry', x: 12, y: 'g', s: 1 }, { p: 'figure', pose: 'wave', who: 'she', x: 70, y: 'g', s: 1.05, a: 'rise' }, { p: 'figure', pose: 'walk', who: 'he', x: 8, y: 'g', s: 1.05, a: 'fade', to: { x: 44 }, toD: .7 }] },
    { sky: 'golden', fx: 'petals', cap: 'Every season, you felt like home.', capPos: 'top', ground: 82, out: 'bloom',
      props: [{ p: 'sun', x: 50, y: 24, s: 1 }, { p: 'clouds', y: 14, tint: '#fff6e0', o: .7 }, { p: 'hills', pal: 'golden' }, { p: 'cherry', x: 14, y: 'g', s: 1.1 }, { p: 'cherry', x: 88, y: 'g', s: .9, flip: true }, { p: 'couple', pose: 'holdhands', x: 50, y: 'g', s: .95, a: 'rise' }] },
    { sky: 'lavender', fx: 'sparkle', cap: 'Memories we made together.', capPos: 'top', ground: 84,
      props: [{ p: 'stars', n: 40 }, { p: 'hills', pal: 'dusk' }, { p: 'photos', imgs: ['https://images.unsplash.com/photo-1519741497674-611481863552?w=500&h=450&fit=crop&q=80&auto=format', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500&h=450&fit=crop&q=80&auto=format', 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=500&h=450&fit=crop&q=80&auto=format', 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=500&h=450&fit=crop&q=80&auto=format'] }] },
    { sky: 'night', fx: 'sparkle', cap: 'Tonight, the sky is ours.', capPos: 'top', ground: 86,
      props: [{ p: 'stars', n: 100 }, { p: 'moon', x: 78, y: 16, s: .9 }, { p: 'lanterns', n: 10 }, { p: 'hills', pal: 'night', hs: [26, 18, 10] }, { p: 'figure', pose: 'stand', who: 'she', x: 64, y: 'g', s: 1, a: 'rise' }, { p: 'figure', pose: 'stand', who: 'he', x: 32, y: 'g', s: 1, a: 'rise' }] },
    { sky: 'candle', fx: 'sparkle', cap: 'I have one question.', capPos: 'top', ground: 88,
      props: [{ p: 'stars', n: 60 }, { p: 'hills', pal: 'candle', hs: [24, 16, 9] }, { p: 'couple', pose: 'kneel', x: 50, y: 'g', s: .95, a: 'rise' }] }
  ],
  finale: { pos: 'high', q: 'Will you marry me?', yes: 'YES 💍', no: 'Let me think…', noGiveUp: 'ok… YES 💍', yesTitle: 'She said yes!', letter: ['Forever starts today.', 'I love you, always.'], reply: { label: 'Celebrate 🎉', url: 'https://wa.me/910000000000?text=YES%20%F0%9F%92%8D' } }
}
```

---

## PART 7. STAND-IN COUPLE PHOTOS (use only if the user asks for photos and gave none)

Use inside `photos: { imgs: [...] }` with the URL pattern `https://images.unsplash.com/photo-<ID>?w=500&h=450&fit=crop&q=80&auto=format`. Tell the user to replace them with their own photos (any public image URL).

```
key | photo ID | what it shows
wedding.00 | 1519741497674-611481863552 | couple with bouquet, moody backlight
wedding.01 | 1465495976277-4387d4b0b4c6 | hands with rings, bouquet and watch
wedding.02 | 1511285560929-80b456fea0bc | couple on a pier with balloons and flower arch
wedding.03 | 1519225421980-715cb0215aed | long reception table with flowers
wedding.04 | 1522673607200-164d1b6ce486 | two decorated chairs on a lawn
wedding.06 | 1523438885200-e635ba2c371e | garden gazebo ceremony with flowers
wedding.07 | 1469371670807-013ccf25f16a | ceremony aisle with floral arrangement
wedding.08 | 1537633552985-df8429e8048b | couple on a beach with veil
wedding.09 | 1606800052052-a08af7148866 | gold wedding rings on lace
wedding.10 | 1583939003579-730e3918a45a | couple kissing among the bridal party
wedding.11 | 1519671482749-fd09be7ccebf | guests toasting with glasses
wedding.12 | 1507504031003-b417219a0fde | wooden “Mr & Mrs” sign
wedding.13 | 1460978812857-470ed1c77af0 | couple kissing under a veil, black and white
wedding.14 | 1525258946800-98cfd641d0de | peach and white bouquet
wedding.15 | 1529634806980-85c3dd6d34ac | hands with rings and autumn flowers
wedding.17 | 1532712938310-34cb3982ef74 | couple walking in a field, distant
wedding.18 | 1546032996-6dfacbacbf3f | couple embracing in a veil, wheat field
wedding.19 | 1464366400600-7168b8af9bc3 | blue and white reception hall tables
wedding.20 | 1522413452208-996ff3f3e740 | rustic table setting with greenery
wedding.21 | 1591604466107-ec97de577aff | couple smiling by a lake, golden light
wedding.22 | 1583939411023-14783179e581 | bride with bridesmaids in a garden
wedding.23 | 1509927083803-4bd519298ac4 | bride and groom shoes on wood
```

---

## PART 8. FINAL CHECKLIST (verify before answering)

- [ ] The page is exactly the PART 2 template with one `LoveStory({...})` object. No other markup, CSS or scripts.
- [ ] 6–10 scenes; each has a clear idea; captions ≤ 8 words; no paragraphs anywhere.
- [ ] The story has an emotional arc, a turning point, and (if it is a question page) a finale.
- [ ] `out:'bloom'` is used once or twice, at the turning point.
- [ ] At least 3 scenes show people; poses match the emotion; someone moves (`to`) in at least one scene.
- [ ] Sky colours progress with the feeling (dark → dawn → bright for repair stories).
- [ ] The last scene keeps 15–45% of the screen height clear; people stand low.
- [ ] `dodge:false` for apologies, comfort, reassurance and anything serious; `dodge:true` only for playful or celebratory questions.
- [ ] Boundaries respected (tasteful, sincere, no pressure, nothing explicit).
- [ ] Names, language and looks match what the user told you; `reply.url` uses a placeholder number.
- [ ] Every prop and pose name comes from the tables above (anything else is ignored).

## OUTPUT FORMAT

Reply with **one fenced ```html code block containing the whole page**, then at most four short lines: the story in one sentence, what to personalise (names, `reply.url` number, photos, looks), how to share it (host free on GitHub Pages or Netlify Drop, then send the link), and that **Play** (or `?reel=1`) auto-plays it for recording.

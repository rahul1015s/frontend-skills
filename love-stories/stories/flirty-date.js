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

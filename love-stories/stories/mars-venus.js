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

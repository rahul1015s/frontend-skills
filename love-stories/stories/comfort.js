{
  title: 'You are not alone',
  reelSeconds: 4.8,
  scenes: [
    { sky: 'rain-night', fx: 'rain', cap: 'Hey. I see you.', capPos: 'top', ground: 86,
      props: [{ p: 'stars', n: 20 }, { p: 'clouds', y: 8, tint: '#59638a', o: .8 }, { p: 'hills', pal: 'rain', hs: [26, 17, 10] }, { p: 'lamp', x: 70, y: 'g', s: 1.4 }, { p: 'couple', pose: 'benchsolo', x: 40, y: '88%', s: .8, a: 'rise' }] },
    { sky: 'rain-night', fx: 'rain', cap: 'You don’t have to be strong alone.', capPos: 'top', ground: 86,
      props: [{ p: 'hills', pal: 'rain', hs: [26, 17, 10] }, { p: 'lamp', x: 20, y: 'g', s: 1.4 }, { p: 'figure', pose: 'sad', who: 'she', x: 56, y: 'g', s: 1.05, a: 'fade' }, { p: 'figure', pose: 'walk', who: 'he', x: 6, y: 'g', s: 1.05, a: 'fade', to: { x: 34 }, toD: .7 }] },
    { sky: 'rain-night', skyTo: 'dusk', skyAt: .3, fx: 'rain', cap: 'Come here. I’ve got you.', capPos: 'top', ground: 86, out: 'bloom',
      props: [{ p: 'hills', pal: 'rain', hs: [26, 17, 10] }, { p: 'lamp', x: 18, y: 'g', s: 1.4 }, { p: 'couple', pose: 'forehead', umbrella: '#ff4d6d', x: 54, y: 'g', s: .95, a: 'rise' }] },
    { sky: 'dawn', fx: 'petals', cap: 'The storm will pass. I’ll stay.', capPos: 'top', ground: 84,
      props: [{ p: 'sun', x: 50, y: 26, s: .9 }, { p: 'clouds', y: 14, tint: '#fff2f6' }, { p: 'hills', pal: 'dawn' }, { p: 'flowers', n: 10, y: '84%', hd: .5 }, { p: 'couple', pose: 'hug', x: 50, y: '85%', s: .95, a: 'pop' }] },
    { sky: 'sunny', fx: 'petals', cap: 'And look — there’s a rainbow.', capPos: 'top', ground: 82,
      props: [{ p: 'clouds', y: 6, tint: '#fff' }, { p: 'rainbow', x: 50, y: 66, s: 1.1, a: 'none', d: .5, hd: .4 }, { p: 'hills', pal: 'day', hs: [30, 22, 13] }, { p: 'flowers', n: 14, y: '84%', hd: .5 }, { p: 'couple', pose: 'holdhands', x: 50, y: '85%', s: .9, a: 'rise' }] }
  ],
  finale: { pos: 'high', q: 'Can I hold you?', yes: 'Come here 🤗', no: 'Not now', dodge: false, noMsg: 'That’s okay. I’m here whenever you’re ready.', noGiveUp: 'ok… come here 🤗', yesTitle: 'I’m right here', letter: ['You are loved. You are enough.', 'Always.'], reply: { label: 'Talk to me 💌', url: 'https://wa.me/910000000000?text=I%20need%20a%20hug%20%F0%9F%A4%97' } }
}

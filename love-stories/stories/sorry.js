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

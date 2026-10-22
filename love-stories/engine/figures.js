/* ───────── figures: stylised people built from a skeleton (no faces; modern flat-illustration look) ───────── */
const Figures = (() => {
  const BASE = {
    h: [60, 34], n: [60, 52], sL: [46, 60], sR: [74, 60], eL: [40, 88], eR: [80, 88], wL: [40, 116], wR: [80, 116],
    pL: [53, 112], pR: [67, 112], kL: [52, 162], kR: [68, 162], fL: [50, 208], fR: [70, 208], tilt: 0
  };
  const J = (o) => Object.assign({}, BASE, o);
  /* single poses (frame 120 x 220) */
  const POSES = {
    stand: J({}),
    sad: J({ h: [58, 41], tilt: 9, n: [60, 55], sL: [47, 64], sR: [73, 64], eL: [44, 94], eR: [76, 94], wL: [70, 82], wR: [50, 82] }),
    happy: J({ h: [60, 32], tilt: -5, eL: [26, 40], wL: [14, 8], eR: [94, 40], wR: [106, 8] }),
    wave: J({ eR: [92, 70], wR: [100, 38] }),
    reach: J({ eR: [98, 66], wR: [128, 54], wL: [56, 92], eL: [44, 86] }),
    walk: J({ h: [62, 34], pL: [58, 112], pR: [62, 112], kL: [44, 160], kR: [76, 158], fL: [30, 204], fR: [88, 206], eL: [36, 88], wL: [28, 112], eR: [88, 86], wR: [96, 110] }),
    back: J({ h: [60, 36], tilt: 4, eL: [42, 90], wL: [44, 118], eR: [78, 90], wR: [76, 118] }),
    sit: J({ nodress: true, h: [68, 112], tilt: 14, n: [62, 128], sL: [58, 140], sR: [62, 138], eL: [80, 178], eR: [84, 176], wL: [92, 160], wR: [96, 158], pL: [40, 190], pR: [44, 190], kL: [86, 160], kR: [90, 158], fL: [92, 206], fR: [98, 206] }),
    sitfront: J({ nodress: true, h: [60, 74], n: [60, 92], sL: [46, 100], sR: [74, 100], eL: [40, 128], eR: [80, 128], wL: [54, 148], wR: [66, 148], pL: [53, 152], pR: [67, 152], kL: [42, 180], kR: [78, 180], fL: [40, 214], fR: [80, 214] }),
    phone: J({ h: [60, 38], tilt: 10, eL: [42, 92], wL: [52, 82], eR: [78, 92], wR: [68, 82] })
  };
  /* couple poses (frame 240 x 220): [A joints, B joints] with A on the left */
  const sh = (j, dx, dy = 0) => { const o = {}; for (const k in j) o[k] = Array.isArray(j[k]) ? [j[k][0] + dx, j[k][1] + dy] : j[k]; return o; };
  const COUPLES = {
    apart: [sh(POSES.back, 10), sh(POSES.back, 110)],
    holdhands: [sh(J({ eR: [92, 92], wR: [106, 114] }), 12), sh(J({ eL: [28, 92], wL: [14, 114] }), 112)],
    hug: [
      sh(J({ h: [62, 34], tilt: 8, n: [62, 52], sL: [48, 60], sR: [76, 60], eL: [44, 90], wL: [78, 98], eR: [96, 82], wR: [112, 96], pL: [55, 112], pR: [69, 112] }), 40),
      sh(J({ h: [58, 36], tilt: -8, n: [58, 54], sL: [44, 62], sR: [72, 62], eL: [30, 54], wL: [36, 80], eR: [60, 100], wR: [42, 92], pL: [51, 112], pR: [65, 112] }), 88)
    ],
    forehead: [
      sh(J({ h: [68, 36], tilt: 14, n: [62, 53], eL: [44, 90], wL: [74, 98], eR: [94, 74], wR: [112, 62] }), 36),
      sh(J({ h: [52, 38], tilt: -14, n: [58, 55], eL: [38, 66], wL: [58, 56], eR: [74, 96], wR: [48, 98] }), 100)
    ],
    dance: [
      sh(J({ h: [62, 32], tilt: 4, eL: [30, 70], wL: [28, 34], eR: [92, 90], wR: [114, 100], kL: [48, 160], kR: [72, 150], fL: [44, 206], fR: [84, 198] }), 30),
      sh(J({ h: [60, 38], tilt: -6, eL: [44, 80], wL: [30, 34], eR: [78, 92], wR: [50, 98], kL: [48, 156], kR: [74, 160], fL: [44, 204], fR: [92, 208] }), 108)
    ],
    kneel: [
      J({ h: [70, 70], tilt: 6, n: [72, 88], sL: [58, 96], sR: [86, 96], eL: [50, 124], wL: [58, 136], eR: [104, 104], wR: [126, 80], pL: [66, 142], pR: [80, 142], kL: [54, 190], kR: [112, 150], fL: [26, 210], fR: [114, 208] }),
      sh(J({ h: [60, 36], tilt: -6, eL: [44, 70], wL: [58, 48], eR: [76, 70], wR: [62, 48] }), 130)
    ],
    benchsolo: [null, sh(J({ nodress: true, h: [56, 76], tilt: -10, n: [60, 92], sL: [46, 100], sR: [74, 100], eL: [40, 128], eR: [80, 128], wL: [54, 148], wR: [66, 148], pL: [53, 152], pR: [67, 152], kL: [42, 180], kR: [78, 180], fL: [40, 214], fR: [80, 214] }), 70)],
    bench: [sh(J({ h: [60, 74], tilt: 6, n: [60, 92], sL: [46, 100], sR: [74, 100], eL: [40, 128], eR: [80, 128], wL: [54, 148], wR: [66, 148], pL: [53, 152], pR: [67, 152], kL: [42, 180], kR: [78, 180], fL: [40, 214], fR: [80, 214] }), 20),
      sh(J({ h: [56, 76], tilt: -12, n: [60, 92], sL: [46, 100], sR: [74, 100], eL: [40, 128], eR: [80, 128], wL: [54, 148], wR: [66, 148], pL: [53, 152], pR: [67, 152], kL: [42, 180], kR: [78, 180], fL: [40, 214], fR: [80, 214] }), 100)]
  };
  const line = (pts, w, c) => `<path d="M${pts.map(p => p.join(' ')).join(' L')}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
  const hairSvg = (style, [x, y], c) => {
    const back = {
      long: `<path d="M${x - 16} ${y - 2} C${x - 20} ${y - 24} ${x + 20} ${y - 24} ${x + 16} ${y - 2} C${x + 24} ${y + 22} ${x + 14} ${y + 40} ${x + 8} ${y + 42} L${x - 8} ${y + 42} C${x - 14} ${y + 40} ${x - 24} ${y + 22} ${x - 16} ${y - 2}Z" fill="${c}"/>`,
      short: '', curly: `<circle cx="${x}" cy="${y - 6}" r="20" fill="${c}"/>`, bun: `<circle cx="${x}" cy="${y - 20}" r="8" fill="${c}"/>`,
      pony: `<path d="M${x + 10} ${y - 6} C${x + 30} ${y - 4} ${x + 30} ${y + 24} ${x + 18} ${y + 36} C${x + 20} ${y + 18} ${x + 14} ${y + 6} ${x + 8} ${y + 2}Z" fill="${c}"/>`
    }[style] || '';
    const cap = style === 'curly' ? `<path d="M${x - 14} ${y - 2} C${x - 16} ${y - 18} ${x + 16} ${y - 18} ${x + 14} ${y - 2} C${x + 8} ${y - 8} ${x - 8} ${y - 8} ${x - 14} ${y - 2}Z" fill="${c}"/>` : `<path d="M${x - 15} ${y - 1} C${x - 17} ${y - 21} ${x + 17} ${y - 21} ${x + 15} ${y - 1} C${x + 9} ${y - 10} ${x - 5} ${y - 10} ${x - 15} ${y - 1}Z" fill="${c}"/>`;
    return { back, front: cap };
  };
  /* one person: o = { who:'he'|'she', skin, top, bottom, hair, hairStyle, shoe, dress, flip, sc } */
  const person = (j, o) => {
    const she = o.who === 'she', skin = o.skin || '#f2c4a0', top = o.top || (she ? '#ff6b8b' : '#3b5bdb'), bottom = o.bottom || (she ? '#7a3b69' : '#22304f');
    const hair = o.hair || (she ? '#2a1a1a' : '#1c1a22'), shoe = o.shoe || '#1a1a22', lw = she ? 10 : 12, aw = she ? 7 : 8.5;
    const mid = [(j.pL[0] + j.pR[0]) / 2, (j.pL[1] + j.pR[1]) / 2], ms = [(j.sL[0] + j.sR[0]) / 2, (j.sL[1] + j.sR[1]) / 2];
    const hs = hairSvg(o.hairStyle || (she ? 'long' : 'short'), j.h, hair);
    let s = '';
    s += line([j.sR, j.eR], aw, top) + line([j.eR, j.wR], aw - 1, skin) + `<circle cx="${j.wR[0]}" cy="${j.wR[1]}" r="${aw * 0.62}" fill="${skin}"/>`; // far arm
    const dress = she && o.dress !== false && !j.nodress;
    if (dress) { /* dress: legs show below the hem */
      s += line([j.kL, j.fL], lw - 1, skin) + line([j.kR, j.fR], lw - 1, skin);
      s += `<ellipse cx="${j.fL[0] - 2}" cy="${j.fL[1] + 3}" rx="8" ry="4.5" fill="${shoe}"/><ellipse cx="${j.fR[0] + 2}" cy="${j.fR[1] + 3}" rx="8" ry="4.5" fill="${shoe}"/>`;
    } else {
      s += line([j.pL, j.kL, j.fL], lw, bottom) + line([j.pR, j.kR, j.fR], lw, bottom);
      s += `<ellipse cx="${j.fL[0] - 2}" cy="${j.fL[1] + 3}" rx="9" ry="4.5" fill="${shoe}"/><ellipse cx="${j.fR[0] + 2}" cy="${j.fR[1] + 3}" rx="9" ry="4.5" fill="${shoe}"/>`;
    }
    s += hs.back;
    if (dress) {
      const k = [(j.kL[0] + j.kR[0]) / 2, Math.min(j.kL[1], j.kR[1])], flare = j.pL[1] > 140 ? 20 : 27;
      s += `<path d="M${j.sL[0]} ${j.sL[1]} L${j.sR[0]} ${j.sR[1]} C${mid[0] + 9} ${(ms[1] + mid[1]) / 2} ${mid[0] + 9} ${mid[1] - 8} ${mid[0] + 9} ${mid[1] - 4} C${k[0] + flare} ${mid[1] + 20} ${k[0] + flare + 2} ${k[1] - 6} ${k[0] + flare - 2} ${k[1] + 2} Q${k[0]} ${k[1] + 12} ${k[0] - flare + 2} ${k[1] + 2} C${k[0] - flare - 2} ${k[1] - 6} ${k[0] - flare} ${mid[1] + 20} ${mid[0] - 9} ${mid[1] - 4} C${mid[0] - 9} ${mid[1] - 8} ${mid[0] - 9} ${(ms[1] + mid[1]) / 2} ${j.sL[0]} ${j.sL[1]}Z" fill="${top}"/>`;
      s += `<path d="M${mid[0] - 10} ${mid[1] - 6} Q${mid[0]} ${mid[1] + 2} ${mid[0] + 10} ${mid[1] - 6}" stroke="${bottom}" stroke-width="3" fill="none" opacity=".55"/>`;
    } else {
      s += line([ms, mid], she ? 20 : 26, top) + line([j.sL, j.sR], she ? 12 : 13, top);
    }
    s += line([j.n, [j.h[0], j.h[1] + 12]], 8, skin);
    s += `<g transform="rotate(${j.tilt || 0} ${j.h[0]} ${j.h[1]})"><circle cx="${j.h[0]}" cy="${j.h[1]}" r="14.5" fill="${o.back ? hair : skin}"/>${o.back ? '' : hs.front}${o.beard && !o.back ? `<path d="M${j.h[0] - 12} ${j.h[1] + 2} C${j.h[0] - 12} ${j.h[1] + 18} ${j.h[0] + 12} ${j.h[1] + 18} ${j.h[0] + 12} ${j.h[1] + 2} C${j.h[0] + 6} ${j.h[1] + 8} ${j.h[0] - 6} ${j.h[1] + 8} ${j.h[0] - 12} ${j.h[1] + 2}Z" fill="${o.beard === true ? hair : o.beard}"/>` : ''}</g>`;
    s += line([j.sL, j.eL], aw, top) + line([j.eL, j.wL], aw - 1, skin) + `<circle cx="${j.wL[0]}" cy="${j.wL[1]}" r="${aw * 0.62}" fill="${skin}"/>`; // near arm
    return `<g>${s}</g>`;
  };
  const wrap = (inner, w, h) => `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" overflow="visible" aria-hidden="true">${inner}</svg>`;
  /* public: figure(pose, opts) -> { svg, w, h } ; pair(name, a, b) -> composite */
  const figure = (pose, o = {}) => {
    const j = POSES[pose] || POSES.stand; let g = person(j, o);
    if (o.flip) g = `<g transform="translate(120 0) scale(-1 1)">${g}</g>`;
    return { svg: wrap(g, 120, 224), w: 120, h: 224 };
  };
  const pair = (name, a = {}, b = {}) => {
    const c = COUPLES[name] || COUPLES.holdhands;
    const bk = name === 'apart' ? { back: true } : {};
    const A = c[0] ? person(c[0], Object.assign({ who: 'he' }, bk, a)) : '', B = person(c[1], Object.assign({ who: 'she' }, bk, b));
    let extra = '', pre = '';
    if (name === 'bench' || name === 'benchsolo') {
      pre = `<g fill="#6b4a3a"><rect x="14" y="104" width="212" height="9" rx="4"/><rect x="14" y="120" width="212" height="9" rx="4"/><rect x="26" y="104" width="7" height="60"/><rect x="207" y="104" width="7" height="60"/></g>`;
      extra = `<g fill="#8a6350"><rect x="8" y="160" width="224" height="11" rx="5"/><rect x="22" y="170" width="9" height="46"/><rect x="209" y="170" width="9" height="46"/></g>`;
    }
    if (b && b.umbrella || a && a.umbrella) { const uc = (b && b.umbrella) || (a && a.umbrella); extra += `<g><path d="M120 -64 L120 120" stroke="#3a2a35" stroke-width="3" stroke-linecap="round"/><path d="M-6 6 Q120 -130 246 6 Q222 -6 200 6 Q178 -6 156 6 Q134 -6 112 6 Q90 -6 68 6 Q46 -6 24 6 Q6 -4 -6 6Z" fill="${uc}"/><path d="M120 6 Q120 -70 120 -118" stroke="#ffffff" stroke-opacity=".25" stroke-width="2" fill="none"/></g>`; }
    if (name === 'kneel') extra = `<circle cx="${c[0].wR[0] + 3}" cy="${c[0].wR[1] - 5}" r="4.4" fill="none" stroke="#ffd166" stroke-width="2.2"/><path d="M${c[0].wR[0] + 3} ${c[0].wR[1] - 11} l3 3 l-3 3 l-3 -3Z" fill="#9be7ff"/>`;
    return { svg: wrap(pre + A + B + extra, 240, 224), w: 240, h: 224 };
  };
  return { figure, pair, POSES, COUPLES };
})();
if (typeof module !== 'undefined') module.exports = Figures;

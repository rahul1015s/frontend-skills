/* ===================== IMAGE (WebGL) EFFECTS =====================
   Put the picture as the first <img> inside the element (it is hidden and used as a texture), or pass data-opts {"image":"url"}.
   The image host must allow cross-origin use (Unsplash does). Give the element a size. */
(function () {
  const { register, util: U } = FX;
  const img = (name, frag, d = {}) => register(name, el => {
    const o = U.opts(el, Object.assign({ speed: 1, scale: 1, mouse: true, colors: ['#ffffff'] }, d)); const im = el.querySelector('img'); if (!o.image && im) { o.image = im.currentSrc || im.src; el.setAttribute('role', 'img'); el.setAttribute('aria-label', im.alt || ''); im.style.display = 'none'; }
    if (!o.image) return console.warn('FX', name, 'needs an <img> child or data-opts image'); el.style.overflow = 'hidden'; return U.shaderBg(el, frag, o); });
  // cover-fit uv for the texture
  const COVER = 'vec2 cover(vec2 uv){float a=uRes.x/uRes.y;vec2 s=a>uImgA?vec2(1.,uImgA/a):vec2(a/uImgA,1.);return (uv-.5)*s+.5;}';

  // Click and hover send ripples through the picture
  img('ripple-distortion', COVER + `void main(){vec2 uv=gl_FragCoord.xy/uRes;float asp=uRes.x/uRes.y;vec2 q=uv;vec2 d=(uv-uClk.xy)*vec2(asp,1.);float r=length(d);float age=uClk.z;
    float wave=sin(r*38.-age*9.)*exp(-r*5.-age*1.6)*.03*step(age,3.5);q+=normalize(d+1e-4)*wave;vec2 h=(uv-uMouse)*vec2(asp,1.);float hr=length(h);q+=normalize(h+1e-4)*sin(hr*30.-uTime*5.)*exp(-hr*7.)*.012;
    vec3 c=texture2D(uTex,cover(q)).rgb;c+=wave*6.;gl_FragColor=vec4(c,1.);}`);

  // Image becomes halftone dots that swell into the full-colour photo near the cursor
  img('halftone-reveal', COVER + `void main(){vec2 uv=gl_FragCoord.xy/uRes;float cell=11.*uS;vec2 g=gl_FragCoord.xy/cell;vec2 id=floor(g),f=fract(g)-.5;vec2 cuv=(id+.5)*cell/uRes;vec3 c=texture2D(uTex,cover(cuv)).rgb;float lum=dot(c,vec3(.299,.587,.114));
    float asp=uRes.x/uRes.y;float k=smoothstep(.34,.0,length((uv-uMouse)*vec2(asp,1.)));float rad=mix(.5*sqrt(lum)*.95,.72,k);float dot=smoothstep(rad+.06,rad-.06,length(f));
    vec3 full=texture2D(uTex,cover(uv)).rgb;vec3 ink=mix(vec3(.93,.92,.88)*lum*1.1+.04,c,k);vec3 col=mix(vec3(.04),ink,dot);col=mix(col,full,smoothstep(.0,.9,k)*k);gl_FragColor=vec4(col,1.);}`);

  // Picture with a lens-like bulge following the cursor and RGB split proportional to speed
  img('image-bulge', COVER + `void main(){vec2 uv=gl_FragCoord.xy/uRes;float asp=uRes.x/uRes.y;vec2 d=(uv-uMouse)*vec2(asp,1.);float r=length(d);float k=smoothstep(.3,.0,r);vec2 q=uv-(uv-uMouse)*k*.35;float s=length(uVel)*2.;
    vec3 c=vec3(texture2D(uTex,cover(q+uVel*.08*k)).r,texture2D(uTex,cover(q)).g,texture2D(uTex,cover(q-uVel*.08*k)).b);gl_FragColor=vec4(c,1.);}`);
})();

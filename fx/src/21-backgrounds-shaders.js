/* ===================== MORE SHADER BACKGROUNDS ===================== */
(function () {
  const { register, util: U } = FX; const N = U.NOISE_GLSL;
  const sh = (name, frag, d = {}) => register(name, el => { const o = U.opts(el, Object.assign({ colors: ['#5eead4', '#818cf8', '#f472b6'], speed: 1, scale: 1, mouse: false }, d)); return U.shaderBg(el, frag, o); });
  const UV = 'vec2 uv=gl_FragCoord.xy/uRes;float asp=uRes.x/uRes.y;vec2 p=(uv-.5)*vec2(asp,1.);float T=uTime;';

  sh('bg-beams', N + `void main(){${UV}float a=0.;for(float i=0.;i<7.;i++){float x=(p.x+p.y*.45)*(2.+i*.4)*uS+i*1.9+T*.08*(1.+i*.2);float b=pow(.5+.5*sin(x*6.28),24.);a+=b*(.25+.75*vn(vec2(i,T*.3)))*smoothstep(-.5,.6,uv.y);}
    vec3 c=mix(uA,uB,uv.y)*a+uC*a*a*.4;gl_FragColor=vec4(c,clamp(a,0.,1.));}`, { colors: ['#38bdf8', '#a78bfa', '#ffffff'] });

  sh('bg-color-bends', `void main(){${UV}vec2 q=p*uS*2.;for(float i=1.;i<5.;i++){q+=vec2(sin(q.y*i+T*.5+i),cos(q.x*i-T*.4))/i*.8;}
    float v=.5+.5*sin(q.x*1.5+q.y);vec3 c=mix(uA,uB,smoothstep(.2,.6,v));c=mix(c,uC,smoothstep(.55,.95,.5+.5*cos(q.y*1.2-q.x)));gl_FragColor=vec4(c,1.);}`, { colors: ['#0ea5e9', '#f43f5e', '#facc15'] });

  sh('bg-dark-veil', N + `void main(){${UV}float n=fbm(p*2.*uS+vec2(T*.1,-T*.07));float m=fbm(p*3.+n*2.+T*.05);float v=smoothstep(.25,.75,m);
    vec3 c=mix(vec3(.02,.02,.04),uA,v*1.1)+uB*pow(v,3.)*.9;float vig=smoothstep(1.1,.2,length(p));gl_FragColor=vec4(c*vig,1.);}`, { colors: ['#4c1d95', '#22d3ee'] });

  sh('bg-dither', N + `float bayer(vec2 f){vec2 i=mod(floor(f),4.);float b=0.;
    b+=mod(i.x,2.)<1.?0.:2.;b+=mod(i.y,2.)<1.?0.:1.;b=mod(b*4.+ (mod(floor(i.x/2.),2.)<1.?0.:2.)*1.+(mod(floor(i.y/2.),2.)<1.?0.:1.)*3.,16.);return b/16.;}
    void main(){vec2 px=floor(gl_FragCoord.xy/(3.*uS));vec2 uv=px*3.*uS/uRes;float v=fbm(uv*vec2(uRes.x/uRes.y,1.)*3.+vec2(uTime*.12,0.))+.18*sin(uv.x*5.+uTime*.4);
    float d=bayer(px);float on=step(d,smoothstep(.2,.8,v));gl_FragColor=vec4(mix(uB*.08,uA,on),1.);}`, { colors: ['#a5b4fc', '#312e81'] });

  sh('bg-evil-eye', N + `void main(){vec2 q=(gl_FragCoord.xy-.5*uRes)/min(uRes.x,uRes.y);vec2 m=(uMouse-.5)*.12;float r=length(q-m*.6);float a=atan(q.y-m.y*.6,q.x-m.x*.6);
    float iris=smoothstep(.42,.38,length(q))*(.5+.5*fbm(vec2(a*3.,r*9.-T0()*0.)));float fib=pow(.5+.5*sin(a*40.+fbm(vec2(a*2.,r*5.))*6.),2.);
    float pupil=smoothstep(.1,.13,r);float rim=smoothstep(.43,.4,length(q))-smoothstep(.4,.36,length(q));
    vec3 c=mix(uB,uA,fib)*iris*pupil*1.3+uA*rim*.8;c+=uC*smoothstep(.45,.3,length(q-vec2(-.08,.1)))*.0;float glow=smoothstep(.9,.3,length(q))*.12;gl_FragColor=vec4(c+uA*glow,1.);}
    `.replace(/T0\(\)/g, 'uTime*.2'), { colors: ['#ff2d55', '#450a0a', '#fff'], mouse: true });

  sh('bg-floating-lines', `void main(){${UV}float acc=0.;for(float i=0.;i<9.;i++){float k=i/9.;float y=(k-.5)*.9+sin(p.x*(2.+k*3.)*uS+T*(.3+k*.4)+i*1.7)*.07*(1.+k)+(uMouse.y-.5)*.08*sin(p.x*3.-uMouse.x*6.);
      acc+=smoothstep(.006,.0,abs(p.y-y))*(.4+.6*k);}vec3 c=mix(uA,uB,uv.x+uv.y*.3);gl_FragColor=vec4(c*acc,acc);}`, { colors: ['#22d3ee', '#e879f9'], mouse: true });

  sh('bg-flux-lines', N + `void main(){${UV}float n=fbm(p*1.6*uS+vec2(T*.06,T*.04))*8.+atan(p.y,p.x)*.5;float l=abs(fract(n*1.2)-.5)*2.;float line=smoothstep(.1,.0,l-.82)*0.+smoothstep(.88,1.,l);
    vec3 c=mix(uA,uB,fbm(p*2.+T*.05))*line;gl_FragColor=vec4(c,line);}`, { colors: ['#34d399', '#60a5fa'] });

  sh('bg-gradient-blinds', `void main(){${UV}float n=34.*uS;float id=floor(uv.x*n);float f=fract(uv.x*n);float sh=.55+.45*cos((f-.5)*3.1)*1.;float w=.5+.5*sin(id*.35+T*.5+(uMouse.x-.5)*6.);
    vec3 c=mix(uA,uB,clamp(uv.y*.6+w*.5,0.,1.));c=mix(c,uC,smoothstep(.6,1.,w)*.5);c*=sh*(.7+.3*sin(id*1.7+T));gl_FragColor=vec4(c,1.);}`, { colors: ['#6d28d9', '#f472b6', '#fde68a'], mouse: true });

  sh('bg-gradient-waves', `void main(){${UV}vec3 c=uA*.2;float t=T*.3;for(float i=0.;i<4.;i++){float y=-.25+i*.22+sin(p.x*(1.6+i*.5)*uS+t*(1.+i*.3)+i*2.)*.1;float m=smoothstep(.0,.01,y-p.y)*0.+smoothstep(.0,-.4,p.y-y);
      vec3 col=i<1.?uA:(i<2.?uB:(i<3.?uC:mix(uA,uB,.5)));c=mix(c,col,clamp(1.-smoothstep(0.,.6,p.y-y),0.,1.)*.55*(p.y<y?1.:0.)+ (p.y<y?0.:0.));}
    gl_FragColor=vec4(c,1.);}`, { colors: ['#0f172a', '#6366f1', '#ec4899'] });

  sh('bg-grainient', N + `void main(){${UV}vec2 q=p*uS+vec2(sin(T*.2),cos(T*.17))*.3;float v=.5+.5*sin(q.x*2.1+sin(q.y*2.3+T*.3)*1.4);vec3 c=mix(uA,uB,v);c=mix(c,uC,smoothstep(.4,1.,fbm(q*1.5+T*.05)));
    float g=h21(gl_FragCoord.xy+fract(T)*100.)-.5;gl_FragColor=vec4(c+g*.22,1.);}`, { colors: ['#4338ca', '#f97316', '#fde68a'] });

  sh('bg-light-pillar', N + `void main(){${UV}float x=p.x-(uMouse.x-.5)*.1;float core=exp(-abs(x)*14.);float halo=exp(-abs(x)*3.2);float flow=fbm(vec2(x*5.,uv.y*3.-T*.6));
    float a=core*(.6+.6*flow)+halo*.35*flow;vec3 c=mix(uA,uB,uv.y)*a+uC*core*core;gl_FragColor=vec4(c,clamp(a,0.,1.));}`, { colors: ['#a78bfa', '#38bdf8', '#fff'], mouse: true });

  sh('bg-light-tunnel', `void main(){vec2 q=(gl_FragCoord.xy-.5*uRes)/min(uRes.x,uRes.y)+(uMouse-.5)*.15;float r=length(q),a=atan(q.y,q.x);float z=.12/(r+.02);float rings=pow(.5+.5*sin(z*6.-uTime*2.2*uS),6.);
    float spokes=pow(.5+.5*sin(a*12.+z*.8),8.);float f=(rings*.9+spokes*.5)*smoothstep(0.,.35,r);vec3 c=mix(uA,uB,fract(z*.15))*f+uC*exp(-r*7.)*.8;gl_FragColor=vec4(c,1.);}`, { colors: ['#38bdf8', '#e879f9', '#fff'], mouse: true });

  sh('bg-line-waves', N + `void main(){${UV}float acc=0.;for(float i=0.;i<26.;i++){float y=(i/26.-.5)*1.15;float h=fbm(vec2(p.x*2.2*uS+i*.1,T*.2+i*.07))*.28*smoothstep(.9,.0,abs(p.x));
      acc+=smoothstep(.0045,.0,abs(p.y-y-h+.1))*(.45+.55*(1.-i/26.));}gl_FragColor=vec4(mix(uA,uB,uv.x)*acc,acc);}`, { colors: ['#e2e8f0', '#818cf8'] });

  sh('bg-magic-rings', `void main(){vec2 q=(gl_FragCoord.xy-.5*uRes)/min(uRes.x,uRes.y);float r=length(q),a=atan(q.y,q.x);float acc=0.;for(float i=0.;i<6.;i++){float rr=.08+i*.075+.012*sin(uTime*(.8+i*.2)+a*(2.+i)+i);acc+=smoothstep(.006,.0,abs(r-rr))*(.9-i*.1);}
    float h=.5+.5*sin(a*3.+uTime*.6);vec3 c=mix(uA,uB,h)*acc+uC*exp(-r*5.)*.35;gl_FragColor=vec4(c,clamp(acc+.2*exp(-r*5.),0.,1.));}`, { colors: ['#f0abfc', '#67e8f9', '#7c3aed'] });

  sh('bg-molten-metal', N + `void main(){${UV}vec2 q=p*uS*1.8;float n=fbm(q+vec2(T*.12,0.)+fbm(q*1.3-T*.1)*2.);float h=smoothstep(.3,.8,n);float e=pow(abs(sin(n*14.)),8.);
    vec3 c=mix(uA*.1,uB,h);c+=uC*e*h*1.2;gl_FragColor=vec4(c,1.);}`, { colors: ['#7f1d1d', '#f97316', '#fde047'] });

  sh('bg-pattern-waves', `void main(){${UV}vec2 q=p*8.*uS;q.y+=sin(q.x*.8+T)*.9;q.x+=cos(q.y*.7-T*.8)*.6;float c1=step(0.,sin(q.x*3.14))*step(0.,sin(q.y*3.14));float chk=mod(floor(q.x)+floor(q.y),2.);
    vec3 c=mix(uA,uB,chk);c=mix(c,uC,.5+.5*sin(length(p)*6.-T));gl_FragColor=vec4(c*.75,1.);}`, { colors: ['#1e293b', '#6366f1', '#22d3ee'] });

  sh('bg-plasma-wave', `void main(){${UV}float t=T*.6;float y=p.y;float w=0.;for(float i=1.;i<5.;i++){w+=sin(p.x*i*1.7*uS+t*i*.6+i)/i*.18;}float d=abs(y-w);float core=exp(-d*28.);float glow=exp(-d*5.);
    vec3 c=mix(uA,uB,.5+.5*sin(p.x*2.+t))*glow*.9+uC*core;gl_FragColor=vec4(c,clamp(glow+core,0.,1.));}`, { colors: ['#06b6d4', '#a855f7', '#fff'] });

  sh('bg-prism', `void main(){${UV}vec2 o=vec2(-.15,0.)+(uMouse-.5)*.15;vec2 d=p-o;float a=atan(d.y,d.x);float r=length(d);float tri=smoothstep(.013,.0,abs(sdT(p))); 
    float beam=smoothstep(.25,.0,abs(a-.1*sin(T*.3)))*step(0.,d.x)*smoothstep(0.,.35,d.x);float hue=clamp((a+.5)*1.6,0.,1.);vec3 rb=.5+.5*cos(6.28*(hue+vec3(0.,.33,.67)));
    float spread=smoothstep(.9,.0,abs(a-.12))*step(0.,d.x)*smoothstep(.1,.5,d.x);vec3 c=rb*spread*.9+vec3(1.)*beam*.7*(1.-smoothstep(.1,.5,d.x))+uA*tri;gl_FragColor=vec4(c,clamp(max(spread,tri),0.,1.));}`.replace('sdT(p)', '(max(abs(p.x+.15)*.866+(p.y)*.5,-p.y)-.12)').replace('vec3 c=rb', 'vec3 c=rb'), { colors: ['#ffffff'], mouse: true });

  sh('bg-prismatic-burst', `void main(){vec2 q=(gl_FragCoord.xy-.5*uRes)/min(uRes.x,uRes.y);float r=length(q),a=atan(q.y,q.x);float rays=pow(.5+.5*sin(a*18.*uS+uTime*.5+sin(a*5.)*2.),3.);float fade=exp(-r*2.2);
    vec3 rb=.5+.5*cos(6.28*(a/6.28+r*.6-uTime*.05+vec3(0.,.33,.67)));vec3 c=rb*rays*fade*1.5+vec3(1.)*exp(-r*9.);gl_FragColor=vec4(c,1.);}`, { colors: ['#fff'] });

  sh('bg-scanner', `void main(){${UV}vec2 g=abs(fract(p*14.*uS)-.5);float grid=smoothstep(.47,.5,max(g.x,g.y))*.35;float sy=fract(T*.18)*1.3-.15;float d=abs(uv.y-sy);float band=exp(-d*24.);float line=exp(-d*260.);
    vec3 c=uA*grid*(.3+band*2.)+uB*band*.25+uC*line;gl_FragColor=vec4(c,1.);}`, { colors: ['#22d3ee', '#0ea5e9', '#ffffff'] });

  sh('bg-side-rays', N + `void main(){${UV}float s=0.;for(float k=0.;k<2.;k++){vec2 src=vec2(k<1.?-.62*asp*2.:.62*asp*2.,.35)*.5;vec2 d=p-src;float a=atan(d.y,d.x*(k<1.?1.:-1.));float r=length(d);
      s+=(pow(.5+.5*sin(a*26.*uS+T*(k<1.?.5:-.4)+k*3.),3.)*.7+.3)*exp(-r*1.3)*(.6+.4*fbm(vec2(a*4.,T*.2+k)));}
    vec3 c=mix(uA,uB,uv.x)*s;gl_FragColor=vec4(c,clamp(s,0.,1.));}`, { colors: ['#f0abfc', '#67e8f9'] });

  sh('bg-sliced-waves', N + `void main(){${UV}float n=22.*uS;float id=floor(uv.y*n)/n;float off=sin(id*5.+T*.6)*.4+fbm(vec2(id*7.,T*.15))*.6;float x=uv.x+off;float v=.5+.5*sin(x*7.+id*3.+T*.4);
    float gap=smoothstep(.0,.08,fract(uv.y*n))*smoothstep(1.,.92,fract(uv.y*n));vec3 c=mix(uA,uB,v);c=mix(c,uC,smoothstep(.7,1.,fbm(vec2(x*3.,id*9.))));gl_FragColor=vec4(c*gap,1.);}`, { colors: ['#0ea5e9', '#d946ef', '#fde68a'] });

  sh('bg-soft-aurora', N + `void main(){${UV}float t=T*.12;vec3 c=vec3(0.);for(float i=0.;i<3.;i++){vec2 q=p*(1.1+i*.3)*uS+vec2(t*(1.+i*.3),-t*.6+i*4.);float n=fbm(q+fbm(q*.8+i)*1.6);float m=smoothstep(.35,.8,n);vec3 col=i<1.?uA:(i<2.?uB:uC);c+=col*m*.55;}
    c*=smoothstep(1.,.1,length(p*vec2(.7,1.1)));gl_FragColor=vec4(c,clamp(max(c.r,max(c.g,c.b)),0.,1.));}`, { colors: ['#34d399', '#818cf8', '#f9a8d4'] });

  sh('bg-threads', N + `void main(){${UV}float acc=0.;for(float i=0.;i<10.;i++){float x=(i/10.-.5)*asp*1.15;float w=(fbm(vec2(p.y*1.4*uS+i*3.,T*.18+i))-.5)*.5+sin(p.y*3.+T*.4+i)*.04;acc+=smoothstep(.004,.0,abs(p.x-x-w))*(.35+.65*fbm(vec2(i,p.y*2.)));}
    gl_FragColor=vec4(mix(uA,uB,uv.y)*acc,acc);}`, { colors: ['#a5b4fc', '#f0abfc'] });

  sh('bg-topography', N + `void main(){${UV}float n=fbm(p*1.7*uS+vec2(T*.03,T*.02))*14.;float l=abs(fract(n)-.5)*2.;float line=smoothstep(.93,.99,l);float major=smoothstep(.985,1.,abs(fract(n/5.)-.5)*2.);
    vec3 c=uA*line*.6+uB*major;gl_FragColor=vec4(c,clamp(line*.6+major,0.,1.));}`, { colors: ['#86efac', '#fde68a'] });

  sh('bg-web-threads', `void main(){vec2 q=(gl_FragCoord.xy-.5*uRes)/min(uRes.x,uRes.y)-(uMouse-.5)*.1;float r=length(q),a=atan(q.y,q.x);float sp=16.;float ang=abs(fract(a/6.2832*sp)-.5);float spoke=smoothstep(.01,.0,ang*r*3.-.0);
    float ring=0.;for(float i=1.;i<9.;i++){float rr=i*.085;float sag=sin(a*sp*.5)*.0;float pr=rr*(1.+.05*sin(a*sp+uTime*.6+i)*(1.-ang*2.));ring+=smoothstep(.004,.0,abs(r-pr)*1.)*step(ang,.5);}
    float v=max(spoke*.6,ring*.8)*exp(-r*1.1);gl_FragColor=vec4(mix(uA,uB,r)*v,clamp(v,0.,1.));}`, { colors: ['#e2e8f0', '#a78bfa'], mouse: true });

  sh('bg-balatro', N + `void main(){vec2 q=(gl_FragCoord.xy-.5*uRes)/min(uRes.x,uRes.y);q=floor(q*(90./uS))/(90./uS);float sp=length(q);float t=uTime*.6;float ang=atan(q.y,q.x)+sp*3.2-t;
    vec2 w=vec2(cos(ang),sin(ang))*sp*2.4;for(float i=1.;i<6.;i++){w+=vec2(sin(w.y*1.3+t*.5*i),cos(w.x*1.1-t*.4*i))/i;}float v=.5+.5*sin(w.x+w.y);
    vec3 c=mix(uA,uB,smoothstep(.2,.55,v));c=mix(c,uC,smoothstep(.6,.9,v));c*=.55+.45*smoothstep(1.3,.0,sp);gl_FragColor=vec4(c,1.);}`, { colors: ['#de443b', '#006bb4', '#162325'] });

  sh('bg-crt-warp', N + `void main(){vec2 uv=gl_FragCoord.xy/uRes;vec2 c=uv*2.-1.;c*=1.+dot(c,c)*.12;vec2 w=c*.5+.5;float inb=step(abs(c.x),1.)*step(abs(c.y),1.);
    float scan=.78+.22*sin(w.y*uRes.y*1.6);vec3 col=vec3(0.);for(int k=0;k<3;k++){float o=(float(k)-1.)*.004;vec2 q=vec2(w.x+o,w.y)*vec2(uRes.x/uRes.y,1.)*3.*uS;float v=fbm(q+vec2(uTime*.2,uTime*.1))+.5*fbm(q*2.-uTime*.15);col[k]=smoothstep(.45,1.1,v);}
    vec3 tint=mix(uA,uB,w.y);float flick=.94+.06*sin(uTime*60.);float roll=smoothstep(.0,.02,abs(fract(w.y-uTime*.1)-.5)-.47)*.0;
    gl_FragColor=vec4(col*tint*scan*flick*inb*(1.-.5*dot(c,c)*.5),1.);}`, { colors: ['#4ade80', '#38bdf8'] });

  sh('bg-aero-shards', `vec2 hh(vec2 p){p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)));return fract(sin(p)*43758.5453);}
    void main(){${UV}vec2 g=p*5.*uS;vec2 i=floor(g),f=fract(g);float md=9.;vec2 mid=vec2(0.);for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){vec2 b=vec2(float(x),float(y));vec2 o=hh(i+b);o=.5+.5*sin(T*.4+6.28*o);float d=length(b+o-f);if(d<md){md=d;mid=i+b;}}
    vec2 h=hh(mid);float shade=.35+.65*h.x;float edge=smoothstep(.02,.0,md-.0)*0.;vec3 c=mix(uA,uB,h.y)*shade;c=mix(c,uC,pow(.5+.5*sin(p.x*5.+h.x*6.+T*.5),6.)*.6);gl_FragColor=vec4(c,1.);}`, { colors: ['#0e7490', '#c4b5fd', '#ffffff'] });

  sh('bg-ghost-fibers', N + `void main(){${UV}vec2 q=vec2(p.x*60.*uS,p.y*2.4);float n=fbm(vec2(q.x*.18+T*.05,q.y*3.+T*.1));float f=pow(vn(vec2(q.x,q.y*.4+n*3.)),3.);float a=f*smoothstep(.15,.7,n)*.9;gl_FragColor=vec4(mix(uA,uB,uv.y)*a,a);}`, { colors: ['#e2e8f0', '#a5b4fc'] });

  sh('bg-faulty-terminal', N + `void main(){vec2 uv=gl_FragCoord.xy/uRes;vec2 cell=floor(gl_FragCoord.xy/(11.*uS));vec2 f=fract(gl_FragCoord.xy/(11.*uS));float t=floor(uTime*8.);float h=h21(cell+t*.01*floor(h21(cell)*4.));
    float glyph=step(.35,h)*step(abs(f.x-.5),.28)*step(abs(f.y-.5),.36)*step(.3,fract(h*13.+f.x*3.*h21(cell+1.)+f.y*5.*h21(cell+2.)));float wave=.5+.5*sin(cell.y*.25-uTime*1.6+cell.x*.05);
    float scan=.8+.2*sin(gl_FragCoord.y*1.7);float glitch=step(.985,h21(vec2(floor(uTime*6.),floor(uv.y*14.))))*.5;vec3 c=uA*glyph*(.25+.75*wave)*scan+uA*glitch*.25;gl_FragColor=vec4(c,1.);}`, { colors: ['#4ade80'] });

  sh('bg-ferrofluid', N + `float hgt(vec2 q,float t){float n=fbm(q*1.2+vec2(t*.1,0.));float s=pow(vn(q*3.+n*2.+t*.2),2.);return n*.7+s*.6;}
    void main(){${UV}vec2 q=p*2.2*uS;float t=uTime;float e=.01;float h=hgt(q,t);vec3 nrm=normalize(vec3(h-hgt(q+vec2(e,0.),t),h-hgt(q+vec2(0.,e),t),.02));vec3 L=normalize(vec3(.4+(uMouse.x-.5),.6+(uMouse.y-.5),.7));
    float dif=clamp(dot(nrm,L),0.,1.);float spec=pow(clamp(dot(reflect(-L,nrm),vec3(0.,0.,1.)),0.,1.),24.);vec3 c=uA*dif*.35+uB*spec*1.2+vec3(.01);gl_FragColor=vec4(c,1.);}`, { colors: ['#1e293b', '#e2e8f0'], mouse: true });

  sh('bg-dot-field', N + `void main(){${UV}vec2 g=p*26.*uS;vec2 id=floor(g),f=fract(g)-.5;float w=.5+.5*sin(length(id)*.45-T*1.4+fbm(id*.12)*5.);float md=length(id/26.*1.-(uMouse-.5)*vec2(asp,1.)/uS*1.);float r=.12+.3*w*smoothstep(.0,.0,0.)+ .3*w;
    float d=smoothstep(r,r-.08,length(f));vec3 c=mix(uA,uB,w)*d;gl_FragColor=vec4(c,d);}`, { colors: ['#475569', '#a78bfa'], mouse: true });

  sh('bg-micro-slats', `void main(){${UV}float n=60.*uS;float id=floor(uv.x*n),f=fract(uv.x*n);float tilt=sin(id*.21+T*.4)*.5+(uMouse.x-.5)*1.2;float nx=(f-.5)*1.4+tilt;float lit=clamp(.5+.5*nx,0.,1.);float rim=smoothstep(.0,.15,f)*smoothstep(1.,.85,f);
    vec3 c=mix(uA,uB,lit)*(.35+.65*pow(lit,1.6))*(.5+.5*rim);c+=uC*pow(lit,12.)*.5;gl_FragColor=vec4(c,1.);}`, { colors: ['#0f172a', '#7dd3fc', '#fff'], mouse: true });
})();

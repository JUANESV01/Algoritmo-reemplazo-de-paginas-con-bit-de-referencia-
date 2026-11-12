const {useState,useMemo,useEffect,useRef,Fragment:Fr}=React,h=React.createElement;
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const ALGS={FIFO:'Sale la más antigua en memoria',LRU:'Sale la menos usada recientemente',MRU:'Sale la usada más recientemente'};
const DEF='234341712142017146014701261';
function useNum(v,z,d){const [x0,setD]=useState(z?0:v),ref=useRef(z?0:v);
 useEffect(()=>{const s=ref.current,t0=performance.now()+(d||0);let id;
  const f=t=>{const k=Math.max(0,Math.min(1,(t-t0)/700)),e=1-Math.pow(1-k,3),x=s+(v-s)*e;ref.current=x;setD(x);if(k<1)id=requestAnimationFrame(f)};
  id=requestAnimationFrame(f);return()=>cancelAnimationFrame(id)},[v]);return x0}
const Num=({v,s='',z,d})=>Math.round(useNum(v,z,d))+s;
function Ring({rate}){const C=2*Math.PI*52;
 return h('svg',{viewBox:'0 0 120 120',className:'ring'},h('circle',{cx:60,cy:60,r:52,className:'trk'}),
  h('circle',{cx:60,cy:60,r:52,className:'arc',strokeDasharray:C,strokeDashoffset:C*(1-rate),transform:'rotate(-90 60 60)'}),
  h('text',{x:60,y:67,textAnchor:'middle'},h(Num,{v:rate*100,s:'%'})))}
function Table({R,full,step}){
 const F=R.st[0].s.length,sp=full?4:1,k=i=>step==null?'':i>=step?' fut':i==step-1?' cur':'',sh=i=>step==null||i<step;
 return h('div',{className:'sheet'},h('table',null,h('tbody',null,
  h('tr',null,h('th',{className:'lab'},'Solicitud'),R.st.map((x,i)=>h(Fr,{key:i},h('th',{className:'req'+k(i)},x.p),full&&['F','R','Pr'].map(l=>h('th',{key:l,className:'sub'+k(i)},l))))),
  Array.from({length:F},(_,q)=>h('tr',{key:q},h('th',{className:'lab'},'Marco '+(q+1)),R.st.map((x,i)=>{const c=x.s[q];
   return h(Fr,{key:i},h('td',{className:'pg'+(x.ent==q?' in':'')+k(i)},c?c.p:''),
    full&&[h('td',{key:'f',className:'n'+k(i)},c?c.f:''),h('td',{key:'r',className:'n'+(c&&c.r?' hot':'')+k(i)},c?c.r:''),h('td',{key:'x',className:'n'+k(i)},c&&c.pr?'*':'')])}))),
  h('tr',null,h('th',{className:'lab'},'Sale'),R.st.map((x,i)=>h('td',{key:i,colSpan:sp,className:'out'},sh(i)&&x.out!=null?x.out:''))),
  h('tr',null,h('th',{className:'lab'}),R.st.map((x,i)=>h(Fr,{key:i},x.fallo&&sh(i)?h('td',{className:'stamp'},'Fallo'):h('td',{className:'blank'}),full&&h('td',{colSpan:3,className:'blank'}))))))) }
const bad=s=>[...new Set(s.match(/[^0-9\s]/g)||[])];
const check=s=>{const b=bad(s);return b.length?'La secuencia solo puede tener números y espacios. No se acepta: '+b.map(c=>'"'+c+'"').join(', ')+'.':!/\d/.test(s)?'Escribe al menos un número.':''};
function App(){
 const [alg,setAlg]=useState('FIFO'),[txt,setTxt]=useState(DEF),[seqT,setSeqT]=useState(DEF),[err,setErr]=useState(''),[run,setRun]=useState(0);
 const [F,setF]=useState(3),[cmp,setCmp]=useState(false),[step,setStep]=useState(0),[play,setPlay]=useState(false);
 const seq=useMemo(()=>parse(seqT),[seqT]),n=seq.length;
 const R=useMemo(()=>imp(alg,seq,F),[alg,seq,F]);
 const all=useMemo(()=>cmp?[...['FIFO','LRU','MRU','Óptimo'].map(a=>({n:a,k:a=='Óptimo'?'opt':'std',r:sim(a=='Óptimo'?'OPT':a,seq,F)})),...['FIFO','LRU','MRU'].map(a=>({n:'Mejorado '+a,k:'imp',r:imp(a,seq,F)}))]:null,[cmp,seq,F]);
 const submit=e=>{e.preventDefault();const m=check(txt);setErr(m);if(!m){setSeqT(txt);setRun(r=>r+1)}};
 useEffect(()=>{setStep(RM?n:0);setPlay(!RM)},[R,run]);
 useEffect(()=>{if(!play)return;const id=setInterval(()=>setStep(s=>Math.min(n,s+1)),650);return()=>clearInterval(id)},[play,n]);
 useEffect(()=>{if(play&&step>=n)setPlay(false)},[step,play,n]);
 const sheet=useRef(null);
 useEffect(()=>{const e=sheet.current&&sheet.current.querySelector('th.req.cur');if(e&&play)e.scrollIntoView({inline:'center',block:'nearest',behavior:'smooth'})},[step]);
 const fs=R.st.slice(0,step).filter(x=>x.fallo).length,mx=all?Math.max(...all.map(x=>x.r.fa),1):1;
 return h('div',{className:'app'},
  h('aside',{className:'rail'},
   h('div',null,h('h1',null,'Páginas en memoria'),h('p',{className:'sub'},'Reemplazo de páginas con tres mejoras: F, R y Pr.')),
   h('form',{onSubmit:submit,noValidate:true,style:{display:'grid',gap:18}},
    h('div',null,h('span',{className:'lbl'},'Algoritmo a mejorar'),h('div',{className:'opts'},Object.keys(ALGS).map(a=>h('button',{type:'button',key:a,className:'opt','aria-pressed':alg==a,onClick:()=>setAlg(a)},h('b',null,a),h('span',null,ALGS[a]))))),
    h('div',null,h('label',{htmlFor:'seq',className:'lbl'},'Secuencia (solo números)'),
     h('input',{id:'seq',className:'txt',value:txt,inputMode:'numeric','aria-invalid':!!err,'aria-describedby':'seqerr',onChange:e=>{setTxt(e.target.value);setErr(bad(e.target.value).length?check(e.target.value):'')}}),
     h('p',{id:'seqerr',className:'msgerr',role:'alert'},err)),
    h('div',null,h('span',{className:'lbl'},'Marcos'),h('div',{className:'step'},h('button',{type:'button','aria-label':'Menos marcos',onClick:()=>setF(Math.max(1,F-1))},'−'),h('b',null,F),h('button',{type:'button','aria-label':'Más marcos',onClick:()=>setF(Math.min(8,F+1))},'+'))),
    h('button',{type:'submit',className:'play go'},'Desarrollar')),
   h('label',{className:'sw'},h('input',{type:'checkbox',checked:cmp,onChange:e=>setCmp(e.target.checked)}),'Comparar con los otros'),
   h('div',{className:'legend'},
    h('div',{className:'lg'},h('i',null,'F'),h('span',null,'Frecuencia: veces que se usó la página desde que entró.')),
    h('div',{className:'lg'},h('i',null,'R'),h('span',null,'Retornos: veces que salió y volvió a pedirse.')),
    h('div',{className:'lg'},h('i',null,'*'),h('span',null,'Protegida: recién entró y no puede salir en la siguiente solicitud.')),
    h('div',{className:'lg'},h('span',null,'Sale la de menor F + R entre las 2 candidatas del algoritmo.')))),
  h('main',{className:'stage'},
   h('section',{className:'stats'},
    h('div',{className:'card gauge'},h(Ring,{rate:step?fs/step:0}),h('div',{className:'stat'},h('span',null,'Tasa de fallos'),h('span',null,'#Marcos: '+F))),
    h('div',{className:'card stat bad'},h('b',null,h(Num,{v:fs})),h('span',null,'Fallos')),
    h('div',{className:'card stat ok'},h('b',null,h(Num,{v:step-fs})),h('span',null,'Aciertos'))),
   h('section',{className:'card',ref:sheet},
    h('div',{className:'hd'},h('h2',null,alg+' mejorado: #Fallos '+R.fa),
     h('div',{className:'pr'},h('span',null,step+' / '+n),h('button',{type:'button',className:'ghost',onClick:()=>{if(step>=n)setStep(0);setPlay(!play)}},play?'Pausar':step>=n?'Repetir':'Continuar'))),
    h(Table,{R,full:true,step})),
   all&&h('section',{className:'card'},h('h2',null,'Comparación de fallos'),
    h('div',{className:'bars'},all.map(({n,k,r},i)=>h('div',{className:'bar',key:n},h('span',null,n),
     h('div',null,h('i',{key:n+'-'+r.fa+'-'+mx,className:k,style:{width:(r.fa/mx*100)+'%',animationDelay:i*140+'ms'}})),h('b',null,h(Num,{v:r.fa,z:1,d:i*140}))))),
    h('h2',{style:{marginTop:26}},'Desarrollo de todos los algoritmos'),
    all.map(({n,k,r})=>h('details',{key:n},h('summary',null,n+': '+r.fa+' fallos'),h(Table,{R:r,full:k=='imp'})))))) }
ReactDOM.createRoot(document.getElementById('root')).render(h(App));

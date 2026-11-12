/*ENGINE*/
function parse(s){s=s.trim();const t=/\D/.test(s)?s.split(/\D+/):s.split('');return t.filter(x=>x!=='').map(Number)}
function victim(alg,sl,seq,i){
 const ix=sl.map((_,k)=>k);
 if(alg=='FIFO')return ix.sort((a,b)=>sl[a].t-sl[b].t)[0];
 if(alg=='LRU')return ix.sort((a,b)=>sl[a].u-sl[b].u)[0];
 if(alg=='MRU')return ix.sort((a,b)=>sl[b].u-sl[a].u)[0];
 const nx=k=>{const j=seq.findIndex((x,j)=>j>i&&x==sl[k].p);return j<0?1e9:j};
 return ix.sort((a,b)=>nx(b)-nx(a))[0]}
function sim(alg,seq,F){
 const sl=Array(F).fill(null),st=[];let fa=0;
 seq.forEach((p,i)=>{const k=sl.findIndex(x=>x&&x.p==p);let out=null,ent=-1,fallo=false;
  if(k>=0)sl[k].u=i;
  else{fallo=true;fa++;let e=sl.indexOf(null);
   if(e<0){e=victim(alg,sl,seq,i);out=sl[e].p}
   sl[e]={p,t:i,u:i};ent=e}
  st.push({p,fallo,out,ent,s:sl.map(x=>x&&{p:x.p})})});
 return{st,fa}}
function imp(base,seq,F){
 const sl=Array(F).fill(null),st=[],R={},gone=new Set();let fa=0;
 seq.forEach((p,i)=>{const k=sl.findIndex(x=>x&&x.p==p);let out=null,ent=-1,fallo=false;
  if(k>=0){sl[k].f++;sl[k].u=i}
  else{fallo=true;fa++;
   if(gone.has(p)){R[p]=(R[p]||0)+1;gone.delete(p)}
   let e=sl.indexOf(null);
   if(e<0){const ix=sl.map((_,q)=>q);let c=ix.filter(q=>i-sl[q].t>1);if(!c.length)c=ix;
    c.sort(base=='FIFO'?(a,b)=>sl[a].t-sl[b].t:base=='LRU'?(a,b)=>sl[a].u-sl[b].u:(a,b)=>sl[b].u-sl[a].u);
    c=c.slice(0,2);const sc=q=>sl[q].f+(R[sl[q].p]||0);
    e=c.reduce((m,q)=>sc(q)<sc(m)?q:m);out=sl[e].p;gone.add(out)}
   sl[e]={p,t:i,u:i,f:1};ent=e}
  st.push({p,fallo,out,ent,s:sl.map(x=>x&&{p:x.p,f:x.f,r:R[x.p]||0,pr:x.t==i})})});
 return{st,fa}}
/*END*/

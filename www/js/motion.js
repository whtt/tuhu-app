/* 兔狐 v55 — continuous, lighter one-hand timeline motion. No dependencies.
 * Positions are fractional indices, not discrete slide numbers.
 * Geometry interpolates two complete, ordered layouts, so ALL labels stay ordered.
 * Input capture starts only after a real drag; a tap stays a normal button click.
 * Pointer Events: https://www.w3.org/TR/pointerevents/
 */
(() => {
'use strict';
const clamp=(x,lo,hi)=>Math.max(lo,Math.min(hi,x));
const mix=(a,b,t)=>a+(b-a)*t;
const smooth=(lo,hi,x)=>{const t=clamp((x-lo)/(hi-lo),0,1);return t*t*(3-2*t)};
class FieldnotesMotionDeck {
  constructor({stage,deck,blocked,onSelection,onRest,onDayStep}) {
    this.stage=stage;this.deck=deck;this.blocked=blocked;
    this.onSelection=onSelection;this.onRest=onRest;this.onDayStep=onDayStep;
    this.cards=[];this.layouts=[];this.position=0;this.target=0;this.velocity=0;
    this.frame=0;this.lastFrame=0;this.source='idle';this.gesture=null;
    this.selected=-1;this.suppressUntil=0;this.wheelTimer=0;this.wheelRaw=0;
    this.width=0;this.height=0;this.dayBusy=false;this.dayAnimation=null;
    this.feel='light';try{const saved=localStorage.getItem('tuhu-motion-feel');this.feel=saved==='balanced'?'balanced':'light'}catch{}
    this.pointers=new Set();this.reduced=matchMedia('(prefers-reduced-motion: reduce)');
    this.tick=this.tick.bind(this);this.bind();
    if('ResizeObserver' in window){this.resizeObserver=new ResizeObserver(()=>this.measure());this.resizeObserver.observe(deck)}
    else window.addEventListener('resize',()=>this.measure());
    this.reduced.addEventListener?.('change',()=>{if(this.reduced.matches)this.select(Math.round(this.position),false)});
  }
  get max(){return Math.max(0,this.cards.length-1)}
  get moving(){return this.source!=='idle'||Math.abs(this.position-Math.round(this.position))>.012}
  configure(index) {
    this.cancel();this.dayAnimation?.cancel();this.dayBusy=false;
    this.deck.style.transform='';this.deck.style.opacity='';
    this.cards=[...this.deck.querySelectorAll('.fn-card')].map(el=>({el,button:el.querySelector('.fn-select')}));
    this.position=this.target=clamp(Number(index)||0,0,this.max);this.selected=-1;
    this.measure();this.rest();
  }
  cancel() {
    cancelAnimationFrame(this.frame);this.frame=0;this.lastFrame=0;
    clearTimeout(this.wheelTimer);this.wheelTimer=0;this.velocity=0;
    this.source='idle';this.releaseCapture();this.gesture=null;
    this.stage.classList.remove('is-dragging','is-moving');
  }
  measure() {
    const H=this.deck.clientHeight,W=this.deck.clientWidth;
    if(!H||!W||!this.cards.length)return;
    this.height=H;this.width=W;this.compact=H<360;
    this.deck.dataset.compact=String(this.compact);
    this.mainHeight=this.compact?64:Math.min(136,Math.max(90,H*.202));
    // v43: physical finger travel, but the selected card always stays center-anchored.
    // A comfortable 32%-stage-height stroke spans about 58% of the day's cards.
    // Dense days are lighter, sparse days retain control; never add random friction.
    const response=this.feel==='light'?.68:.59;
    this.dragUnit=clamp(H*.32/Math.max(1,(this.cards.length-1)*response),23,66);
    this.layouts=this.cards.map((_,a)=>this.layoutAt(a));this.paint();
  }
  setFeel(feel){this.feel=feel==='light'?'light':'balanced';this.measure()}
  layoutAt(a) {
    const H=this.height,W=this.width,n=this.cards.length;
    const main=this.mainHeight,edge=Math.min(18,H*.035),gap0=Math.min(5,H*.009);
    // v43: the active card is ALWAYS centered. Earlier compact geometry moved it
    // toward the top/bottom depending on its index, which looked wrong on phones.
    const top=H/2-main/2,bottom=top+main,maxGap=W>520?48:41;
    const above=a,after=n-a-1;
    const aboveGap=above?Math.min(maxGap,Math.max(13,(top-edge-gap0)/above)):0;
    const belowGap=after?Math.min(maxGap,Math.max(13,(H-bottom-edge-gap0)/after)):0;
    return this.cards.map((_,i)=>{
      const off=i-a,dist=Math.abs(off),active=off===0,gap=off<0?aboveGap:belowGap;
      // Non-active cards are now real visible strips rather than a strip plus a hidden
      // paper tail. Their labels therefore stay optically centered both above and below.
      const band=active?main:Math.max(12,Math.min(this.compact?24:(W>520?40:36),gap-2));
      let y;
      if(active)y=top;
      else if(off<0)y=top-gap0-band-(a-i-1)*aboveGap;
      else y=bottom+gap0+(i-a-1)*belowGap;
      const inset=active?0:Math.min(W*.108,8+dist*(W>520?6.0:4.15));
      return {y,height:band,band,ly:0,inset,focus:active?1:0};
    });
  }
  paint() {
    if(!this.layouts.length)return;
    const p=clamp(this.position,0,this.max),a=Math.floor(p),b=Math.min(this.max,a+1),t=p-a;
    const over=this.position-p,shift=-over*Math.min(23,this.height*.052);
    const near=Math.round(p),speed=this.reduced.matches?0:clamp(this.velocity,-9,9);
    const geometry=this.cards.map((_,i)=>{
      const A=this.layouts[a][i],B=this.layouts[b][i],y=mix(A.y,B.y,t)+shift;
      const ly=mix(A.ly,B.ly,t),height=mix(A.height,B.height,t),band=mix(A.band,B.band,t);
      const z=1000-Math.round(Math.abs(i-p)*100);
      return {y,ly,height,band,label:y+ly,inset:mix(A.inset,B.inset,t),f:mix(A.focus,B.focus,t),z,rank:z*100+i};
    });
    for(let i=0;i<this.cards.length;i++) {
      const {el,button}=this.cards[i],g=geometry[i],prev=geometry[i-1],next=geometry[i+1];
      const {f,inset,band}=g;
      // An incoming/outgoing face may change z-order, but must NEVER cover a
      // neighbour's title. Trim only the hidden paper tail, not its label band.
      let y=g.y,end=g.y+g.height;
      if(prev&&g.rank>prev.rank)y=Math.max(y,prev.label+prev.band+1);
      if(next&&g.rank>next.rank)end=Math.min(end,next.label-1);
      const ly=g.label-y,height=Math.max(band,end-y);
      const dist=i-p,depth=Math.min(Math.abs(dist),7);
      const dark=smooth(.02,.68,f),expanded=smooth(.10,.38,f),compact=1-smooth(.02,.18,f);
      // Translation stays on the compositor; no CSS transition competes with the finger.
      el.style.transform=`translate3d(${inset.toFixed(2)}px,${y.toFixed(2)}px,0)`;
      el.style.width=(this.width-2*inset).toFixed(2)+'px';el.style.height=height.toFixed(2)+'px';
      el.style.zIndex=String(1000-Math.round(Math.abs(dist)*100));
      el.style.setProperty('--fn-label-y',ly.toFixed(2)+'px');
      el.style.setProperty('--fn-band',band.toFixed(2)+'px');
      el.style.setProperty('--fn-focus',f.toFixed(4));
      el.style.setProperty('--fn-dark',dark.toFixed(4));
      el.style.setProperty('--fn-expanded',expanded.toFixed(4));
      el.style.setProperty('--fn-compact',compact.toFixed(4));
      el.style.setProperty('--fn-text-scale',(.86+.14*f).toFixed(4));
      el.style.setProperty('--fn-shadow-y',(4+f*13).toFixed(2)+'px');
      el.style.setProperty('--fn-shadow-blur',(10+f*20).toFixed(2)+'px');
      el.style.setProperty('--fn-shadow-alpha',(.08+f*.2).toFixed(4));
      el.style.setProperty('--fn-radius',(15+f*9).toFixed(2)+'px');
      el.style.setProperty('--fn-bend',(speed*.038*(1-f)).toFixed(3)+'deg');
      el.style.setProperty('--fn-depth',depth.toFixed(3));
      el.style.setProperty('--fn-sat',(1-Math.min(depth,6)*.018+f*.035).toFixed(4));
      el.style.setProperty('--fn-bright',(1-Math.min(depth,6)*.010+f*.022).toFixed(4));
      el.classList.toggle('before',dist<-.01);el.classList.toggle('after',dist>.01);
      el.classList.toggle('selected',i===near);
      el.dataset.offset=dist.toFixed(3);
      button.setAttribute('aria-current',i===near?'step':'false');
    }
    this.deck.dataset.position=this.position.toFixed(4);
    if(near!==this.selected){this.selected=near;this.onSelection(near)}
  }
  rest() {
    this.source='idle';this.velocity=0;this.lastFrame=0;this.frame=0;
    this.stage.classList.remove('is-dragging','is-moving');
    const i=clamp(Math.round(this.position),0,this.max);this.position=this.target=i;
    this.paint();this.onRest(i);
  }
  requestFrame(){if(!this.frame){this.lastFrame=0;this.frame=requestAnimationFrame(this.tick)}}
  tick(now) {
    this.frame=0;
    if(!this.lastFrame)this.lastFrame=now-1000/60;
    let dt=Math.min(.034,(now-this.lastFrame)/1000);this.lastFrame=now;
    if(this.source==='drag'){this.paint();return}
    if(this.source==='idle')return;
    const isWheel=this.source==='wheel';
    // v43: soft spring settle with frame-rate-independent substeps.
    const k=isWheel?188:154,c=isWheel?27.5:24.8;
    // Short substeps avoid frame-rate-dependent spring instability.
    while(dt>0){const step=Math.min(.008,dt);this.velocity+=(k*(this.target-this.position)-c*this.velocity)*step;this.position+=this.velocity*step;dt-=step}
    this.position=clamp(this.position,-.7,this.max+.7);this.paint();
    if(Math.abs(this.target-this.position)<.0008&&Math.abs(this.velocity)<.014){
      if(isWheel){this.position=this.target;this.velocity=0;this.paint();return}
      this.rest();return;
    }
    this.frame=requestAnimationFrame(this.tick);
  }
  select(index,animate=true) {
    const to=clamp(Math.round(Number(index)||0),0,this.max);
    clearTimeout(this.wheelTimer);this.releaseCapture();this.gesture=null;
    this.stage.classList.remove('is-dragging');
    if(!animate||this.reduced.matches){this.cancel();this.position=this.target=to;this.rest();return to}
    this.target=to;this.source='settle';this.stage.classList.add('is-moving');this.requestFrame();return to;
  }
  shift(step){return this.select((this.moving?Math.round(this.target):this.selected)+step)}
  rubber(raw){
    if(raw<0)return -.46*(1-Math.exp(raw/.72));
    if(raw>this.max)return this.max+.46*(1-Math.exp(-(raw-this.max)/.72));
    return raw;
  }
  finishDrag(cancelled=false) {
    const g=this.gesture;if(!g)return;this.releaseCapture();this.gesture=null;
    this.stage.classList.remove('is-dragging');
    if(!g.axis){if(this.moving)this.select(Math.round(this.position));return}
    this.suppressUntil=performance.now()+260;
    if(g.axis==='x'){
      const age=performance.now()-g.lastT,v=age<110?g.vx:0;
      const dir=g.dx<0?1:-1,possible=this.dayPossible(dir);
      const commit=!cancelled&&possible&&(Math.abs(g.dx)>Math.min(95,this.width*.23)||Math.abs(g.dx)>34&&Math.abs(v)>.55);
      this.finishDayPan(commit?dir:0,g.dx);return;
    }
    const now=performance.now(),recent=g.samples.filter(s=>now-s.t<110),s0=recent[0],s1=recent.at(-1);
    let v=!cancelled&&s0&&s1&&s1.t-s0.t>8?(s1.p-s0.p)/(s1.t-s0.t)*1000:0;
    v=clamp(v,-11,11);if(now-g.lastT>100)v=0;
    const outside=this.position<0||this.position>this.max;
    const projection=outside?0:clamp(v*.085,-.85,.85);
    this.target=clamp(Math.round(this.position+projection),0,this.max);
    this.velocity=v;this.source='settle';
    if(this.reduced.matches){this.select(this.target,false);return}
    this.stage.classList.add('is-moving');this.requestFrame();
  }
  releaseCapture(){const g=this.gesture;if(g){try{if(this.stage.hasPointerCapture(g.id))this.stage.releasePointerCapture(g.id)}catch(_){}}}
  dayPossible(dir){return !this.onDayStep.canStep||this.onDayStep.canStep(dir)}
  finishDayPan(dir,dx=0) {
    this.select(Math.round(this.position),false);
    this.deck.style.transform='';this.deck.style.opacity='';
    if(this.reduced.matches){if(dir)this.onDayStep(dir);return}
    this.dayBusy=true;
    const from=clamp(dx,-this.width*.72,this.width*.72);
    const animation=this.deck.animate([
      {transform:`translate3d(${from}px,0,0)`,opacity:Math.max(.7,1-Math.abs(from)/this.width*.35)},
      {transform:`translate3d(${dir?-dir*this.width*.68:0}px,0,0)`,opacity:dir?0:1}
    ],{duration:dir?165:230,easing:'cubic-bezier(.2,.7,.25,1)',fill:'none'});
    this.dayAnimation=animation;
    animation.onfinish=()=>{
      this.dayAnimation=null;
      if(dir){this.onDayStep(dir);this.dayBusy=true;
        const incoming=this.deck.animate([{transform:`translate3d(${dir*35}px,0,0)`,opacity:0},{transform:'translate3d(0,0,0)',opacity:1}],{duration:230,easing:'cubic-bezier(.18,.7,.2,1)'});
        this.dayAnimation=incoming;incoming.onfinish=()=>{this.dayBusy=false;this.dayAnimation=null};
      }else this.dayBusy=false;
    };
    animation.oncancel=()=>{this.dayBusy=false};
  }
  wheel(e) {
    if(this.blocked()||this.dayBusy||e.ctrlKey)return;
    e.preventDefault();
    const factor=e.deltaMode===1?16:e.deltaMode===2?this.height:1;
    const dx=(e.shiftKey&&!e.deltaX?e.deltaY:e.deltaX)*factor,dy=e.deltaY*factor;
    if(e.shiftKey||Math.abs(dx)>Math.abs(dy)*1.3){
      const now=performance.now();if(!this.wheelXTime||now-this.wheelXTime>170)this.wheelX=0;
      this.wheelXTime=now;this.wheelX=(this.wheelX||0)+dx;
      const sign=this.wheelX>0?1:-1,pan=clamp(-this.wheelX*(this.dayPossible(sign)?1:.25),-this.width*.68,this.width*.68);
      this.deck.style.transform=`translate3d(${pan}px,0,0)`;
      clearTimeout(this.wheelXTimer);this.wheelXTimer=setTimeout(()=>{const dir=Math.abs(this.wheelX)>65&&this.dayPossible(sign)?sign:0;this.wheelX=0;this.finishDayPan(dir,pan)},135);return;
    }
    if(this.source!=='wheel'){cancelAnimationFrame(this.frame);this.frame=0;this.velocity=0;this.wheelRaw=this.position;this.source='wheel'}
    this.wheelRaw+=dy/(this.dragUnit*1.55);this.target=this.rubber(this.wheelRaw);
    if(this.reduced.matches){this.position=this.target;this.paint()}else{this.stage.classList.add('is-moving');this.requestFrame()}
    clearTimeout(this.wheelTimer);this.wheelTimer=setTimeout(()=>{
      this.target=clamp(Math.round(this.target),0,this.max);this.source='settle';
      if(this.reduced.matches)this.select(this.target,false);else this.requestFrame();
    },175);
  }
  bind() {
    const area=this.stage;
    area.addEventListener('click',e=>{if(performance.now()<this.suppressUntil){e.preventDefault();e.stopImmediatePropagation()}},true);
    area.addEventListener('pointerdown',e=>{
      if(this.blocked()||this.dayBusy||e.pointerType==='mouse'&&e.button!==0)return;
      this.pointers.add(e.pointerId);
      if(this.pointers.size>1||!e.isPrimary){this.finishDrag(true);return}
      cancelAnimationFrame(this.frame);this.frame=0;clearTimeout(this.wheelTimer);
      this.gesture={id:e.pointerId,x:e.clientX,y:e.clientY,p:this.position,filtered:this.position,axis:null,dx:0,dy:0,lastT:performance.now(),lastX:e.clientX,vx:0,samples:[]};
    });
    window.addEventListener('pointermove',e=>{
      const g=this.gesture;if(!g||g.id!==e.pointerId||this.pointers.size>1)return;
      if(this.blocked()){this.finishDrag(true);return}
      const dx=e.clientX-g.x,dy=e.clientY-g.y,now=performance.now();
      if(!g.axis){
        if(Math.max(Math.abs(dx),Math.abs(dy))<7)return;
        if(Math.abs(dx)>Math.abs(dy)*1.15)g.axis='x';else if(Math.abs(dy)>Math.abs(dx)*1.12)g.axis='y';else if(Math.max(Math.abs(dx),Math.abs(dy))>19)g.axis=Math.abs(dx)>Math.abs(dy)?'x':'y';else return;
        try{area.setPointerCapture(e.pointerId)}catch(_){}
        this.source='drag';this.velocity=0;this.stage.classList.add('is-dragging','is-moving');
      }
      if(e.cancelable)e.preventDefault();
      g.dx=dx;g.dy=dy;
      if(g.axis==='y'){
        const dt=Math.max(8,now-g.lastT)/1000,desired=this.rubber(g.p-dy/this.dragUnit);
        // v37 viscous tracking: slow movement follows closely; a fast throw meets gentle resistance.
        const alpha=clamp(1-Math.exp(-dt*80),.62,.94);
        g.filtered+=(desired-g.filtered)*alpha;
        const next=g.filtered;
        this.velocity=this.velocity*.48+clamp((next-this.position)/dt,-10.5,10.5)*.52;this.position=next;
        g.samples.push({p:next,t:now});g.samples=g.samples.filter(s=>now-s.t<145);this.paint();
      }else{
        const dir=dx<0?1:-1,pan=dx*(this.dayPossible(dir)?1:.25);
        g.vx=(e.clientX-g.lastX)/Math.max(8,now-g.lastT);this.deck.style.transform=`translate3d(${clamp(pan,-this.width*.72,this.width*.72)}px,0,0)`;
        this.deck.style.opacity=String(Math.max(.75,1-Math.abs(pan)/this.width*.25));
      }
      g.lastT=now;g.lastX=e.clientX;
    },{passive:false});
    window.addEventListener('pointerup',e=>{this.pointers.delete(e.pointerId);if(this.gesture?.id===e.pointerId)this.finishDrag(false)});
    window.addEventListener('pointercancel',e=>{this.pointers.delete(e.pointerId);if(this.gesture?.id===e.pointerId)this.finishDrag(true)});
    window.addEventListener('blur',()=>{this.pointers.clear();this.finishDrag(true)});
    document.addEventListener('visibilitychange',()=>{if(document.hidden){this.pointers.clear();this.finishDrag(true);this.select(Math.round(this.position),false)}});
    area.addEventListener('wheel',e=>this.wheel(e),{passive:false});
    document.addEventListener('keydown',e=>{
      if(this.blocked()||this.dayBusy||e.altKey||e.ctrlKey||e.metaKey||e.target.closest('input,textarea,select'))return;
      if(!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();
      if(e.key==='ArrowUp')this.shift(-1);if(e.key==='ArrowDown')this.shift(1);
      if(e.key==='ArrowLeft'&&this.dayPossible(-1))this.finishDayPan(-1);if(e.key==='ArrowRight'&&this.dayPossible(1))this.finishDayPan(1);
      if(e.key==='Home')this.select(0);if(e.key==='End')this.select(this.max);
    });
  }
}
window.FieldnotesMotionDeck=FieldnotesMotionDeck;
})();
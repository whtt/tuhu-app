/* 兔狐 v56 — field-use polish on top of the v54 wallet baseline. */
(()=>{
'use strict';
const D=window.TRIP, A=window.TUHU_AUDIO||{}, IMGREG=window.TUHU_IMAGE_REGISTRY||{entries:[]};
if(!D){document.body.textContent='行程数据未加载，请重新打开。';return}
const $=(q,r=document)=>r.querySelector(q), $$=(q,r=document)=>[...r.querySelectorAll(q)];
const esc=(s='')=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const ICON={
 close:'<path d="m6 6 12 12M18 6 6 18"/>',back:'<path d="m14 5-7 7 7 7"/>',next:'<path d="m9 5 7 7-7 7"/>',
 route:'<path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2V5ZM9 3v16M15 5v16"/>',
 camera:'<path d="M4 7h4l2-3h4l2 3h4v13H4Z"/><circle cx="12" cy="13" r="3.4"/>',
 english:'<path d="M5 18 3 22l6-3c7 1 12-3 12-8 0-5-4-8-9-8S3 6 3 11c0 3 1 5 2 7Z"/><path d="M8 11h.01M12 11h.01M16 11h.01"/>',
 wallet:'<path d="M4 7V5a2 2 0 0 1 2-2h12v4M4 7h16v14H4ZM20 12h-6v5h6"/><path d="M16 14.5h.01"/>',
 note:'<path d="M7 3h11a2 2 0 0 1 2 2v16H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h1Zm-3 5h3M4 13h3M10 8h6M10 12h6M10 16h4"/>',
 flag:'<path d="M5 22V3c6-4 8 5 15 1v11c-7 4-9-5-15-1"/>',
 home:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
 more:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
 sound:'<path d="m11 4-6 5H2v6h3l6 5V4ZM15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14"/>',
 play:'<path d="m8 5 11 7-11 7V5Z"/>',stop:'<rect x="6" y="6" width="12" height="12" rx="2"/>',
 copy:'<rect x="8" y="7" width="12" height="14" rx="2"/><path d="M16 7V3H4v14h4"/>',
 pin:'<path d="M19 10c0 6-7 12-7 12S5 16 5 10a7 7 0 0 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/>',
 plane:'<path d="m22 2-7 20-4-9L2 9 22 2ZM11 13 22 2"/>',
 hotel:'<path d="M3 21V4h11v17M14 9h7v12M7 8h3M7 12h3M7 16h3M17 13h1M17 17h1M2 21h20"/>',
 food:'<path d="M4 3v7c0 3 6 3 6 0V3M7 3v18M20 3c-6 3-6 9 0 9V3v18"/>',
 guide:'<path d="M12 5c-4-3-7-3-10-2v16c3-1 6-1 10 2 4-3 7-3 10-2V3c-3-1-6-1-10 2ZM12 5v16"/>',
 check:'<path d="m5 12 4 4L20 5"/>',settings:'<path d="M5 3v18M12 3v18M19 3v18M2 8h6M9 16h6M16 7h6"/>',
 search:'<circle cx="10" cy="10" r="7"/><path d="m15 15 7 7"/>',plus:'<path d="M12 4v16M4 12h16"/>',
 file:'<path d="M14 2H4v20h16V8l-6-6ZM14 2v6h6M8 13h8M8 17h6"/>',trash:'<path d="M3 6h18M8 6V3h8v3M5 6l1 15h12l1-15M10 10v7M14 10v7"/>',
 download:'<path d="M12 3v12m-5-5 5 5 5-5M4 15v6h16v-6"/>',share:'<path d="M12 16V2m-5 5 5-5 5 5M5 12H3v10h18V12h-2"/>',
 expand:'<path d="M9 3H3v6M15 3h6v6M3 15v6h6M21 15v6h-6"/>',ticket:'<path d="M3 5h18v5a2 2 0 0 0 0 4v5H3v-5a2 2 0 0 0 0-4V5ZM15 5v2m0 3v2m0 3v4"/>',
 train:'<rect x="5" y="2" width="14" height="17" rx="4"/><path d="M5 10h14M9 19l-3 3m9-3 3 3M9 14h.01M15 14h.01"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 1v2m0 18v2M1 12h2m18 0h2M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2"/>',sparkle:'<path d="m12 2 1.7 5.3L19 9l-5.3 1.7L12 16l-1.7-5.3L5 9l5.3-1.7L12 2Z"/><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"/>'
};
const icon=(n)=>`<svg viewBox="0 0 24 24" aria-hidden="true">${ICON[n]||ICON.more}</svg>`;
const attrs=(o={})=>Object.entries(o).filter(([,v])=>v!==undefined&&v!==null).map(([k,v])=>`data-${k}="${esc(v)}"`).join(' ');
const btn=(text,a,o={},cls='button secondary')=>`<button type="button" class="${cls}" data-a="${a}" ${attrs(o)}>${text}</button>`;
const ib=(name,a,o={},label='')=>`<button type="button" class="icon-button" data-a="${a}" ${attrs(o)} aria-label="${esc(label||name)}">${icon(name)}</button>`;
const external=(label,url,cls='button secondary')=>/^https?:\/\//.test(url||'')?`<a class="${cls}" href="${esc(url)}" data-external>${esc(label)}</a>`:'';
const mapSearch=q=>'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q);
const storage={get(k){try{return localStorage.getItem(k)}catch{return null}},set(k,v){try{localStorage.setItem(k,String(v));return true}catch{toast('本机存储不可用，暂未保存');return false}}};
let toastTimer,dialogToastTimer,urls=[];
function toast(text){const el=$('#toast');el.textContent=text;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2600);if(dialog.open){let x=$('#dialogToast');if(!x){x=document.createElement('div');x.className='dialog-toast';x.id='dialogToast';x.setAttribute('role','status');body.append(x)}x.textContent=text;x.classList.add('show');clearTimeout(dialogToastTimer);dialogToastTimer=setTimeout(()=>x?.classList.remove('show'),2600)}}
function currentTripDay(){try{const p=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Singapore',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()).map(x=>[x.type,x.value]));if(p.year==='2026'&&p.month==='10'&&D.ORDER.includes(p.day))return p.day}catch{}return null}
function initialDay(){const q=new URL(location.href).searchParams.get('day');if(D.ORDER.includes(q))return q;return currentTripDay()||(D.ORDER.includes(storage.get('sgjy-day'))?storage.get('sgjy-day'):'03')}
const state={day:initialDay(),index:0,layout:storage.get('tuhu-home-layout')==='timeline'?'timeline':'deck',stack:[],speed:Number(storage.get('tuhu-speech-speed'))||1,playing:null,focus:null};
const dialog=$('#appDialog'),body=$('#dialogBody'),head=$('#dialogHead'),dock=$('#dialogDock');let deck=null,renderToken=0;
let navigationPending=false,navigationTimer=0,viewSerial=0;const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');
function rowFor(key,day=state.day){let row=D.DAYS[day]?.timeline.find(x=>x[4]===key);if(row)return{key,day,row,s:D.SCENE[key]||{}};if(D.STANDALONE_ROWS[key])return{key,day,row:D.STANDALONE_ROWS[key],s:D.SCENE[key]||{}};for(const d of D.ORDER){row=D.DAYS[d].timeline.find(x=>x[4]===key);if(row)return{key,day:d,row,s:D.SCENE[key]||{}}}return null}
function imagesFor(key,target='photo'){
 const list=(IMGREG.entries||[]).filter(x=>x.scene_id===key&&(!target||(x.card_targets||[]).includes(target))).slice().sort((a,b)=>(a.priority||99)-(b.priority||99));
 return list;
}
function imageFor(key,target='deck',role='hero'){
 const list=imagesFor(key,target);return list.find(x=>x.role===role)||list[0]||null;
}
function momentFor(key,module){
 const list=(IMGREG.entries||[]).filter(x=>x.role==='moment'&&x.module===module&&(
  (key&&x.scene_id===key)||(key&&(x.scenes||[]).includes(key))||x.scene_id==='*'
 )).slice().sort((a,b)=>{
  const sa=key&&a.scene_id===key?0:key&&(a.scenes||[]).includes(key)?1:2;
  const sb=key&&b.scene_id===key?0:key&&(b.scenes||[]).includes(key)?1:2;
  return sa-sb+(Number(a.priority||99)-Number(b.priority||99))/100;
 });
 return list[0]||null;
}
function momentMarkup(key,module){
 const im=momentFor(key,module);if(!im)return'';
 return `<figure class="moment-card"><img src="${esc(imageURL(im))}" alt="${esc(im.title||'旅行瞬间')}" loading="lazy" decoding="async" style="object-position:${esc(im.focal||'50% 50%')}"><figcaption>${esc(im.title||'旅行瞬间')}</figcaption></figure>`;
}
const HOME_IMAGE_ID_OVERRIDE={arrival:'companion-arrival-01'};
const HOME_NO_IMAGE=new Set(['t1']);
const HOME_MOMENT_OVERRIDE={
 hgh:'execution',
 sleep:'rest',
 ussAm:'zone',
 ussPm1:'zone',
 ussRest:'rest',
 jieyangHotel:'hotel'
};
function preferredHeroFor(key,target='timeline'){
 const list=imagesFor(key,target).filter(x=>x.role==='hero');
 if(!list.length)return null;
 const forced=HOME_IMAGE_ID_OVERRIDE[key]&&list.find(x=>x.id===HOME_IMAGE_ID_OVERRIDE[key]);
 if(forced)return forced;
 const high=list.filter(x=>Math.max(Number(x.width)||0,Number(x.height)||0)>=1000);
 if(high.length)return high[0];
 return list.slice().sort((a,b)=>{
  const aa=(Number(a.width)||0)*(Number(a.height)||0),bb=(Number(b.width)||0)*(Number(b.height)||0);
  return bb-aa+(Number(a.priority||99)-Number(b.priority||99))/100;
 })[0]||null;
}
function homeImageFor(key,target='timeline'){
 const hero=preferredHeroFor(key,target);
 if(hero)return hero;
 const module=HOME_MOMENT_OVERRIDE[key];
 return module?momentFor(key,module):null;
}
function imageURL(x,thumb=false){return x?(thumb?(x.thumb||x.src):x.src):''}
function imageTitle(x){return x?.title||'拍照参考'}
function imageQuery(x){return x?.query||imageTitle(x)}
function dayImages(day,target='photo'){
 const out=[],seen=new Set();
 for(const row of D.DAYS[day].timeline)for(const x of imagesFor(row[4],target)){if(!seen.has(x.id)){seen.add(x.id);out.push(x)}}
 return out;
}
function ctx(v){return v.key?rowFor(v.key,v.day):null}
function viewDay(v){return v.day||ctx(v)?.day||state.day}
function fieldName(v){return ctx(v)?.row[1]||`10.${viewDay(v)}`}
const typeLabel={'scene-more':'更多',scene:'',assistant:'旅途助手',execution:'执行',map:'地图',photo:'拍照参考',capture:'拍摄',guide:'导览',english:'英语',notes:'备忘',wallet:'票夹',booking:'订单资料',present:'出示凭证',file:'本机文件',food:'吃喝',hotel:'住宿',zone:'园区',dates:'选择日期',more:'更多',tasks:'待办',search:'搜索',settings:'设置',backup:'数据备份',devicecheck:'真机自检',lightbox:'拍照参考',field:'现场步骤',overview:'当天行程',phrase:'英语'};
const typeIcon={assistant:'sparkle',execution:'flag',map:'route',photo:'camera',capture:'settings',guide:'guide',english:'english',notes:'note',wallet:'wallet',food:'food',hotel:'hotel',zone:'pin',tasks:'check',more:'more',search:'search',settings:'settings',backup:'file',devicecheck:'check',file:'file',booking:'ticket',present:'ticket',field:'flag'};
const tileTheme={assistant:['#eef0ff','#6d6bd1'],execution:['#fff1e6','#e79550'],map:['#e5f5f4','#268e99'],photo:['#e9f3fe','#388bd5'],english:['#edecfc','#7c77c0'],wallet:['#fff0ed','#e67c68'],notes:['#fff6df','#cc9f40'],capture:['#e9f2f8','#517f9b'],guide:['#f0edf9','#9679b5'],food:['#eaf6ee','#499f7d'],hotel:['#e8f1fb','#527daf'],zone:['#ecf1ff','#6c88bd']};
function tile(type,key=null,day=state.day,label=typeLabel[type]){const th=tileTheme[type]||['#eaf5f5','#49858c'];return btn(`<span class="tile-icon" style="--tile-bg:${th[0]};--tile-ink:${th[1]}">${icon(typeIcon[type]||'more')}</span><span>${esc(label)}</span>`,'feature',{type,key,day},'product-tile')}
const HOTEL_KEYS=new Set(['capsule','sleep','sthotel','faberBag','faberHotel','ussReturn','jieyangHotel','jyBreakfast']);
function available(c){let t=['execution'];if(c.s.map?.length)t.push('map');if(imagesFor(c.key,'photo').length)t.push('photo');if(englishCategories({key:c.key,day:c.day}).length)t.push('english');t.push('notes','wallet');if(D.VLOG_SCENE[c.key])t.push('capture');if(c.s.guide?.length||D.PLACE_DETAIL[c.key]?.length||D.SPECIAL_SCENE[c.key])t.push('guide');if(D.USS_SCENE_ZONE[c.key])t.push('zone');if(c.s.kind==='food'||['holland','kampong','merlion','ntu'].includes(c.key))t.push('food');if(c.s.kind==='hotel'||HOTEL_KEYS.has(c.key))t.push('hotel');t.push('assistant');return [...new Set(t)]}
function orderedActions(c){
 const actions=available(c),kind=c?.s?.kind||'';
 const prefs={
  airport:['execution','english','map','notes','wallet','assistant','photo'],
  flight:['execution','english','notes','wallet','map','assistant','photo'],
  route:['map','execution','english','notes','hotel','wallet','assistant','photo'],
  hotel:['hotel','execution','english','notes','wallet','map','assistant','photo'],
  attraction:['photo','capture','map','guide','execution','english','food','notes','wallet','assistant'],
  walk:['photo','capture','map','guide','food','english','execution','notes','wallet','assistant'],
  campus:['photo','capture','map','guide','food','execution','english','notes','wallet','assistant'],
  themepark:['zone','execution','map','english','photo','capture','food','notes','wallet','assistant'],
  food:['food','map','english','notes','photo','execution','wallet','assistant'],
  checklist:['execution','notes','english','wallet','map','assistant','photo'],
  rest:['notes','english','assistant','execution','map','photo','wallet']
 }[kind]||['execution','map','photo','english','notes','wallet','assistant'];
 const out=[];for(const x of prefs)if(actions.includes(x)&&!out.includes(x))out.push(x);
 for(const x of actions)if(!out.includes(x))out.push(x);
 return out;
}
function homeKindIcon(key){
 const kind=rowFor(key)?.s?.kind||'';
 return ({airport:'plane',flight:'plane',route:'route',hotel:'hotel',food:'food',checklist:'check',rest:'sparkle',themepark:'pin',walk:'route',attraction:'pin',campus:'pin'})[kind]||'flag';
}
function getSelectedKey(){return D.DAYS[state.day].timeline[state.index]?.[4]}
function homeCardMarkup(r,i){const im=homeImageFor(r[4],'deck'),mark=im?'':`<span class="fn-empty-art" aria-hidden="true">${icon(homeKindIcon(r[4]))}</span>`;return `<li class="fn-card" data-index="${i}"><button type="button" class="fn-select${im?' has-image':' no-image'}" data-home-index="${i}" aria-label="打开 ${esc(r[0]+' '+r[1])}">${im?`<img class="fn-art" src="${esc(imageURL(im,true))}" alt="" draggable="false" style="object-position:${esc(im.focal||'50% 50%')}">`:mark}<span class="fn-active-text"><time class="fn-time">${esc(r[0])}</time><strong class="fn-title">${esc(r[1])}</strong><span class="fn-sub">${esc(r[2]||r[3])}</span></span><span class="fn-compact-text"><time>${esc(r[0].split(/[–—-]/)[0])}</time><b>${esc(r[1])}</b></span></button></li>`}
function journeyMarkup(r,i){const im=homeImageFor(r[4],'timeline');const media=im?`<img class="journey-bg" src="${esc(imageURL(im,true))}" alt="" draggable="false" style="object-position:${esc(im.focal||'50% 50%')}"><span class="journey-shade" aria-hidden="true"></span>`:`<span class="journey-empty-art" aria-hidden="true">${icon(homeKindIcon(r[4]))}</span>`;return `<li class="journey-row${i===state.index?' selected':''}" data-index="${i}"><span class="journey-node" aria-hidden="true"></span><button type="button" class="journey-card${im?' has-image':' no-image'}" data-journey-index="${i}" aria-label="打开 ${esc(r[0]+' '+r[1])}">${media}<span class="journey-copy"><span class="journey-kicker"><time>${esc(r[0])}</time>${i===state.index?'<em>当前</em>':''}</span><strong>${esc(r[1])}</strong></span></button></li>`}
function syncHomeSelection(i=state.index){
 state.index=clamp(i,0,D.DAYS[state.day].timeline.length-1);
 $('#positionText').textContent=`${state.index+1} / ${D.DAYS[state.day].timeline.length}`;
 $('#positionBar i').style.width=((state.index+1)/D.DAYS[state.day].timeline.length*100)+'%';
 $$('.journey-row',$('#journeyList')).forEach((el,n)=>{el.classList.toggle('selected',n===state.index);const em=el.querySelector('.journey-kicker em');if(n===state.index&&!em){const x=document.createElement('em');x.textContent='当前';el.querySelector('.journey-kicker')?.append(x)}else if(n!==state.index&&em)em.remove()});
}
function setHomeLayout(layout,save=true){
 state.layout=layout==='timeline'?'timeline':'deck';
 if(save)storage.set('tuhu-home-layout',state.layout);
 const home=$('#home'),toggle=$('#layoutToggle');home.dataset.layout=state.layout;
 toggle.setAttribute('aria-pressed',state.layout==='timeline'?'true':'false');
 toggle.setAttribute('aria-label',state.layout==='timeline'?'切换到卡片布局':'切换到时间轴布局');
 toggle.dataset.layout=state.layout;
 if(state.layout==='deck'){deck?.select(state.index,false);$('#homeStage').scrollTop=0}
 else requestAnimationFrame(()=>$('#journeyList .journey-row.selected')?.scrollIntoView({block:'center',behavior:'auto'}));
}
function renderHome(){
 const d=D.DAYS[state.day];$('#dateText').textContent=d.date;$('#dowText').textContent=d.dow;
 const saved=storage.get('sgjy-deck-'+state.day);state.index=clamp(saved===null?0:Number(saved)||0,0,d.timeline.length-1);
 $('#timeline').innerHTML=d.timeline.map(homeCardMarkup).join('');
 $('#journeyList').innerHTML=d.timeline.map(journeyMarkup).join('');
 if(!deck){
  const step=dir=>{const i=D.ORDER.indexOf(state.day)+dir;if(D.ORDER[i])changeDay(D.ORDER[i])};step.canStep=dir=>!!D.ORDER[D.ORDER.indexOf(state.day)+dir];
  deck=new window.FieldnotesMotionDeck({stage:$('#homeStage'),deck:$('#timeline'),blocked:()=>dialog.open||state.layout==='timeline',onSelection:i=>syncHomeSelection(i),onRest:i=>{storage.set('sgjy-deck-'+state.day,i);$('#deckAnnouncement').textContent=D.DAYS[state.day].timeline[i][1]},onDayStep:step})
 }
 deck.configure(state.index);syncHomeSelection(state.index);setHomeLayout(state.layout,false);storage.set('sgjy-day',state.day)
}
function changeDay(day){if(!D.ORDER.includes(day))return;state.day=day;renderHome()}
$('#timeline').addEventListener('click',e=>{const b=e.target.closest('[data-home-index]');if(!b)return;const i=Number(b.dataset.homeIndex);if(i!==deck.selected||deck.moving){deck.select(i);return}openView({type:'scene',key:D.DAYS[state.day].timeline[i][4],day:state.day})});
let journeySuppressUntil=0;
$('#journeyList').addEventListener('click',e=>{if(performance.now()<journeySuppressUntil){e.preventDefault();return}const b=e.target.closest('[data-journey-index]');if(!b)return;const i=Number(b.dataset.journeyIndex);syncHomeSelection(i);storage.set('sgjy-deck-'+state.day,i);deck?.select(i,false);openView({type:'scene',key:D.DAYS[state.day].timeline[i][4],day:state.day})});
let journeySwipe=null;
$('#journeyList').addEventListener('pointerdown',e=>{if(dialog.open||!e.isPrimary)return;journeySwipe={id:e.pointerId,x:e.clientX,y:e.clientY,t:performance.now()}});
$('#journeyList').addEventListener('pointerup',e=>{const g=journeySwipe;journeySwipe=null;if(!g||g.id!==e.pointerId)return;const dx=e.clientX-g.x,dy=e.clientY-g.y;if(Math.abs(dx)>70&&Math.abs(dx)>Math.abs(dy)*1.45&&performance.now()-g.t<900){journeySuppressUntil=performance.now()+300;const dir=dx<0?1:-1,di=D.ORDER.indexOf(state.day)+dir;if(D.ORDER[di])changeDay(D.ORDER[di])}});
$('#journeyList').addEventListener('pointercancel',()=>{journeySwipe=null});
$('#dateBtn').addEventListener('click',()=>openView({type:'dates'}));
$('#layoutToggle').addEventListener('click',()=>setHomeLayout(state.layout==='deck'?'timeline':'deck'));
$('#bottomNav').innerHTML=[['home','行程','today'],['route','地图','map'],['english','英语','english'],['wallet','票夹','wallet'],['more','更多','more']].map(([i,t,a])=>btn(`${icon(i)}<span>${t}</span>`,'nav',{type:a},'nav-item'+(a==='today'?' active':''))).join('');
try{history.replaceState({tuhu:0},'')}catch{}
function top(){return state.stack.at(-1)}
function saveScroll(){const v=top();if(v)v.scroll=body.scrollTop}
function openView(v,replace=false){
 if(navigationPending)return;
 saveScroll();
 if(!state.stack.length){state.focus=document.activeElement;deck?.select(deck.selected,false);}
 const prior=top();
 if(!replace&&prior&&prior.type===v.type&&(prior.key||'')===(v.key||'')&&(prior.id||'')===(v.id||'')&&(prior.en||'')===(v.en||'')&&(prior.day||state.day)===(v.day||state.day))return;
 if(prior){prior.focusId=document.activeElement?.dataset?.focusId||'';}
 if(prior?.type!==v.type)stopAudio();
 v.uid=v.uid||++viewSerial;
 if(replace&&state.stack.length)state.stack[state.stack.length-1]=v;
 else{state.stack.push(v);try{history.pushState({tuhu:state.stack.length},'')}catch{}}
 renderView();
 if(!dialog.open)dialog.showModal();
 requestAnimationFrame(()=>body.focus({preventScroll:true}));
}
function back(){
 if(!state.stack.length)return false;
 if(navigationPending)return true;
 returnToDepth(state.stack.length-1);return true;
}
function closeAll(){if(state.stack.length&&!navigationPending)returnToDepth(0);}
function returnToDepth(depth){
 const current=state.stack.length;
 if(depth>=current)return;
 stopAudio();
 try{
  if(history.state?.tuhu===current){
   navigationPending=true;clearTimeout(navigationTimer);
   history.go(depth-current);
   // Some embedded previews do not emit popstate. Native/HTTPS normally does.
   navigationTimer=setTimeout(()=>{if(navigationPending){navigationPending=false;restoreDepth(depth);try{history.replaceState({tuhu:depth},'')}catch{}}},450);
   return;
  }
 }catch{}
 restoreDepth(depth);
}
function restoreDepth(depth){
 clearTimeout(navigationTimer);navigationPending=false;
 if(depth<state.stack.length){stopAudio();state.stack=state.stack.slice(0,Math.max(0,depth));renderView();}
}
window.addEventListener('popstate',e=>restoreDepth(e.state?.tuhu||0));
dialog.addEventListener('cancel',e=>{e.preventDefault();back()});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)back()}});
function objectURL(blob){const u=URL.createObjectURL(blob);urls.push(u);return u}
function clearObjectURLs(){for(const u of urls)URL.revokeObjectURL(u);urls=[]}
function header(v){
 if(v.type==='present'){const b=BOOK.find(x=>x.id===v.id);head.innerHTML=`${ib('back','back',{},'返回票夹')}<div class="head-text present-head-text"><div class="head-meta">现场出示 · 保持屏幕常亮</div><h2 id="dialogTitle">${esc(b?.presentLabel||'出示凭证')}</h2></div>${ib('close','close',{},'关闭并回到行程')}`;return;}
 const c=ctx(v);
 let title=v.type==='scene'?c?.row[1]:typeLabel[v.type]||'兔狐';
 if(v.type==='lightbox')title=D.PHOTO_META[v.files?.[v.index||0]]?.title?.replace(/拍照机位|拍照参考/g,'')||'拍照参考';
 const meta=v.type==='scene'&&c?`10.${c.day} · ${c.row[0]}`:c?c.row[1]:v.type==='overview'?`10.${viewDay(v)} · ${D.DAYS[viewDay(v)].dow}`:v.type==='dates'?'2026 · 新加坡 + 揭阳':'';
 head.innerHTML=`${state.stack.length>1?ib('back','back',{},'返回上一张卡'):v.type!=='scene'&&typeIcon[v.type]?`<span class="head-icon">${icon(typeIcon[v.type])}</span>`:''}<div class="head-text">${meta?`<div class="head-meta">${esc(meta)}</div>`:''}<h2 id="dialogTitle">${esc(title||'行程')}</h2></div>${ib('close','close',{},'关闭并回到行程')}`;
}
function renderDock(v){
 if(v.type==='scene'){dock.innerHTML=stationFooter(ctx(v));return;}
 if(v.type==='present'){const n=v.fileCount||0;dock.innerHTML=n>1?`<div class="present-controls">${ib('back','present-prev',{},'上一张凭证')}<span>${(v.index||0)+1} / ${n}</span>${ib('next','present-next',{},'下一张凭证')}</div>`:`${btn(icon('back')+' 返回票夹','back',{},'dock-back')}${btn('订单资料','booking',{id:v.id},'dock-home')}`;return;}
 if(v.type==='lightbox'){
  const list=photoList(v);
  dock.innerHTML=`<div class="lightbox-controls">${ib('back','photo-prev',{},'上一张参考图')}<span>${(v.index||0)+1} / ${list.length}</span>${btn(v.zoom?'适应屏幕':'放大 2×','zoom',{},'button compact')}${ib('next','photo-next',{},'下一张参考图')}</div>`;return;
 }
 let label=state.stack.length>1?'返回上一层':'返回行程';
 const prev=state.stack.at(-2);
 if(prev?.type==='scene')label='返回本站';
 else if(prev?.type==='wallet')label='返回票夹';
 else if(prev?.type==='english')label='返回语句';
 else if(prev?.type==='booking')label='返回订单';
 dock.innerHTML=`${btn(icon('back')+label,'back',{},'dock-back')}${state.stack.length>1?btn(icon('home')+'行程','close-all',{},'dock-home'):''}`;
}
async function renderView(){
 const v=top(),token=++renderToken;
 if(!v){clearObjectURLs();stopAudio();releaseReceiptWake();dock.innerHTML='';if(dialog.open)dialog.close();state.focus?.focus?.({preventScroll:true});return;}
 header(v);dialog.classList.toggle('is-photo',v.type==='lightbox');dialog.classList.toggle('is-present',v.type==='present');dialog.dataset.view=v.type;
 body.setAttribute('aria-busy','true');
 let html='';
 try{
  switch(v.type){
   case'scene':html=sceneView(v);break;
   case'scene-more':html='<div class="product-grid scene-more-grid">'+orderedActions(ctx(v)).slice(4).map(t=>tile(t,v.key,viewDay(v))).join('')+'</div>';break;
   case'execution':html=executionView(v);break;
   case'field':html=fieldView(v);break;
   case'map':html=mapView(v);break;
   case'photo':html=photoView(v);break;
   case'lightbox':html=lightboxView(v);break;
   case'capture':html=captureView(v);break;
   case'english':html=englishView(v);break;
   case'phrase':html=phraseView(v);break;
   case'notes':html=notesView(v);break;
   case'wallet':html=await walletView(v);break;
   case'booking':html=await bookingView(v);break;
   case'present':html=await presentView(v);break;
   case'file':html=await fileView(v);break;
   case'guide':html=guideView(v);break;
   case'food':html=foodView(v);break;
   case'hotel':html=hotelView(v);break;
   case'zone':html=zoneView(v);break;
   case'more':html=moreView(v);break;
   case'dates':html=datesView();break;
   case'overview':html=overviewView(v);break;
   case'tasks':html=tasksView();break;
   case'search':html=searchView(v);break;
   case'settings':html=settingsView();break;
   case'backup':html=backupView();break;case'devicecheck':html=deviceCheckView(v);break;
   default:html='<p class="empty">没有找到这张卡。</p>';
  }
 }catch(e){console.error('[Tuhu]',e);html='<div class="empty">暂时无法打开。请返回重试。</div>';}
 if(token!==renderToken)return;
 // Revoke only URLs from the previous render, not URLs just created by fileView.
 const used=new Set([...html.matchAll(/blob:[^"\s<>]+/g)].map(x=>x[0]));
 urls=urls.filter(u=>{if(used.has(u))return true;URL.revokeObjectURL(u);return false;});
 body.innerHTML=html;body.setAttribute('aria-busy','false');body.scrollTop=v.scroll||0;
 renderDock(v);updatePlayingButtons();if(v.type==='present')requestReceiptWake();else releaseReceiptWake();
 if(v.type==='photo'||v.type==='lightbox')preloadAdjacent(v);
 $$('img',body).forEach(img=>{
  img.addEventListener('error',()=>{
   img.alt='图片未加载，点这里重试';img.classList.add('image-error');
   const trigger=img.closest('button');
   if(trigger){trigger.dataset.retryAction=trigger.dataset.a;trigger.dataset.a='retry-image';}
  },{once:true});
 });
 if(v.type==='search')setTimeout(()=>$('#searchInput')?.focus(),80);
 if(v.type==='assistant')setTimeout(()=>{refreshAssistantStatus();$('#assistantInput')?.focus()},60);
 if(!reduceMotion.matches&&body.dataset.uid!==String(v.uid))body.animate([{opacity:.5,transform:'translateY(5px)'},{opacity:1,transform:'none'}],{duration:150,easing:'ease-out'});
 body.dataset.uid=String(v.uid);
}
function sceneView(v){
 const c=ctx(v);if(!c)return'<div class="empty">该行程不存在。</div>';
 const im=preferredHeroFor(c.key,'modal'),actions=orderedActions(c);let hero='';
 if(im)hero=`<button class="hero" data-a="feature" data-type="photo" data-key="${esc(c.key)}" data-day="${c.day}"><img src="${esc(imageURL(im))}" alt="${esc(imageTitle(im))}" decoding="async" style="object-position:${esc(im.focal||'50% 50%')}"><span class="hero-caption"><span>${esc(c.row[3])}</span><span>${icon('camera')}</span></span></button>`;
 else if(c.s.kind==='flight'){
  const names=c.row[2].split('→');
  hero=`<div class="flight-summary"><div><strong>${esc(names[0]?.trim()||c.row[1])}</strong><small>${esc(c.row[0].split('–')[0])}</small></div>${icon('plane')}<div><strong>${esc(names[1]?.trim()||'出发')}</strong><small>${esc(c.row[0].split('–')[1]||'')}</small></div></div>`;
 }else if(c.s.kind==='train'){
  const x=c.s.train||{};
  hero=`<div class="train-summary"><div><strong>${esc(x.from||c.row[3]||'出发')}</strong><small>${esc((x.time||c.row[0]).split('→')[0].trim())}</small></div>${icon('train')}<div><strong>${esc(x.to||c.row[1])}</strong><small>${esc((x.time||'').split('→')[1]?.trim()||'')}</small></div>${x.via?`<span>${esc(x.via)}</span>`:''}</div>`;
 }else if(c.key==='t1'){
  hero=`<div class="airport-summary"><span>${icon('plane')}</span><div><small>Changi Airport</small><strong>Terminal 1</strong><b>${esc(c.row[3]||'TR128')}</b></div></div>`;
 }
 const now=D.SCENE_BRIEF[c.key]?.find(x=>x[0]==='NOW');
 const action=now?[now[1],now[2]].filter(Boolean).join(' · '):c.row[2],relatedBooking=bookingForScene(c.key,c.day);
 const credential=relatedBooking?btn(icon('ticket')+' '+credentialActionLabel(relatedBooking),'present',{id:relatedBooking.id},'credential-scene-button'):'';
 const primary=actions.slice(0,4),more=actions.slice(4);
 return `${hero}${action?`<div class="scene-actionline">${icon(c.s.kind==='hotel'?'hotel':'flag')}<span>${esc(action)}</span></div>`:''}${credential}<div class="product-grid scene-product-grid">${primary.map(t=>tile(t,c.key,c.day)).join('')}${more.length?tile('scene-more',c.key,c.day,'更多功能'):''}</div>`;
}
function stationFooter(c){const rows=D.DAYS[c.day].timeline,i=rows.findIndex(r=>r[4]===c.key),prev=rows[i-1],next=rows[i+1];return `<div class="scene-foot">${prev?btn(`<span>← 上一站</span><b>${esc(prev[1])}</b>`,'station',{key:prev[4],day:c.day},'station-button'):'<span></span>'}${next?btn('<span>下一站 →</span><b>'+esc(next[1])+'</b>','station',{key:next[4],day:c.day},'station-button'):'<span></span>'}</div>`}
function stepsHTML(steps){return `<ol class="step-list">${steps.map((s,i)=>`<li class="step"><span class="step-no">${i+1}</span><div class="step-text"><b>${esc(s[0])}</b>${s[1]?`<p>${esc(s[1])}</p>`:''}${s[2]?`<p>${esc(s[2])}</p>`:''}</div></li>`).join('')}</ol>`}
function executionView(v){const c=ctx(v);if(!c)return'';let steps=D.FLOW_INFO[c.key]?.map(x=>[x.title,x.body])||c.s.steps||c.s.places;if(!steps?.length){const sp=D.SPECIAL_SCENE[c.key];steps=sp?.steps||[[c.row[1],c.row[2]||c.row[3]]]}const moment=momentMarkup(c.key,'execution')||momentMarkup(c.key,'rest')||momentMarkup(c.key,'hotel')||momentMarkup(c.key,'map')||momentMarkup(c.key,'food')||momentMarkup(c.key,'zone');return `${moment}${stepsHTML(steps)}${checklist(c.key)}${D.FLOW_INFO[c.key]?.length?btn('逐步查看','feature',{type:'field',key:c.key,day:c.day},'button full'):''}${(D.ACTION_DECK[c.key]||[]).filter(x=>x[3]!=='overview').length?`<div class="button-row">${D.ACTION_DECK[c.key].filter(x=>x[3]!=='overview').map(x=>btn(esc(x[1]),'feature',{type:({vlog:'capture',sketch:'photo',special:'guide'})[x[3]]||x[3],key:c.key,day:c.day},'button secondary compact')).join('')}</div>`:''}`}
function fieldView(v){const c=ctx(v),steps=D.FLOW_INFO[c.key]||[],i=clamp(Number(storage.get('fieldnotes-field-'+c.key))||0,0,steps.length-1),s=steps[i];if(!s)return'';return `<div class="list-heading"><h3>${i+1} / ${steps.length}</h3></div><div class="progress"><i style="width:${(i+1)/steps.length*100}%"></i></div><div class="surface-card"><h3>${esc(s.title)}</h3><p>${esc(s.body)}</p></div><div class="button-row equal">${btn('上一步','field-step',{step:-1,key:c.key})}${btn(i===steps.length-1?'完成':'完成，下一步','field-step',{step:1,key:c.key},'button')}</div>${s.tabs?.length?`<div class="button-row">${s.tabs.map(([t,label])=>btn(esc(label),'feature',{type:t==='vlog'?'capture':t,key:c.key,day:c.day},'button outline')).join('')}</div>`:''}`}
function mapView(v){const c=ctx(v),points=c?(c.s.map||D.PHOTO_POINTS[c.key]||[]):D.DAYS[viewDay(v)].points||[];if(!points.length)return'<p class="empty">没有保存这站的地图点位。</p>';const moment=momentMarkup(c?.key||null,'map');const focus=clamp(v.point||0,0,points.length-1),p=points[focus],d=.009;const bbox=[p[2]-d,p[1]-d*.7,p[2]+d,p[1]+d*.7].join(',');const iframeURL=`https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${p[1]},${p[2]}`;return `${moment}<div class="map-view"><div class="map-load-note">${navigator.onLine?'地图加载中…':'离线 · 下方点位仍可查看'}</div>${navigator.onLine?`<iframe title="${esc(p[0])} 地图" src="${iframeURL}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>`:''}</div><div class="hint">地图需联网 · 点位沿用现有行程</div><ol class="route-points">${points.map((q,i)=>`<li class="route-point"><span class="n">${i+1}</span><b>${esc(q[0])}</b>${ib('pin','map-point',{index:i},'在图上查看'+q[0])}<a class="icon-button" href="${mapSearch(q[1]+','+q[2])}" data-external aria-label="导航到${esc(q[0])}">${icon('plane')}</a></li>`).join('')}</ol>${external('在地图软件中导航',mapSearch(p[1]+','+p[2]),'button full')}`}
function photoList(v){
 if(v.images?.length)return v.images;
 return v.key?imagesFor(v.key,'photo'):dayImages(viewDay(v),'photo');
}
function photoView(v){
 const images=photoList(v);v.images=images;
 if(!images.length)return'<div class="empty">这站暂未保存拍照参考。</div>';
 v.index=clamp(v.index||0,0,images.length-1);
 const im=images[v.index],meta={title:imageTitle(im),query:imageQuery(im)},spot=(D.VLOG_SCENE[v.key]?.spots||[])[0];
 return `<div class="photo-frame" data-gallery-swipe><button data-a="lightbox" aria-label="放大拍照参考"><img src="${esc(imageURL(im))}" alt="${esc(meta.title)}" decoding="async" style="object-position:${esc(im.focal||'50% 50%')}"></button><span class="photo-count">${v.index+1} / ${images.length}</span></div><div class="photo-info"><h3>${esc(meta.title.replace(/拍照机位|拍照参考/g,'')||'拍照参考')}</h3>${btn(icon('expand'),'lightbox',{},'icon-button')}</div>${images.length>1?`<div class="photo-thumbs">${images.map((x,i)=>btn(`<img src="${esc(imageURL(x,true))}" alt="${esc(imageTitle(x))}" loading="lazy">`,'photo-index',{index:i},'photo-thumb'+(i===v.index?' active':''))).join('')}</div>`:''}${spot?`<div class="notice-box">${esc(spot.where||spot.name)}</div><div class="chips-free">${spot.time?`<span class="tag">${esc(spot.time)}</span>`:''}${spot.light?`<span class="tag">${esc(spot.light)}</span>`:''}</div>`:''}<div class="button-row equal">${external('查看机位',mapSearch(meta.query),'button')}${btn('拍摄参数','feature',{type:'capture',key:v.key,day:viewDay(v)},'button secondary')}</div>`;
}
function lightboxView(v){
 const images=photoList(v);v.images=images;
 if(!images.length)return'<div class="empty">没有可用图片</div>';
 v.index=clamp(v.index||0,0,images.length-1);const im=images[v.index];
 return `<div class="lightbox-stage${v.zoom?' zoomed':''}" id="lightboxStage" data-gallery-swipe><img src="${esc(imageURL(im))}" alt="${esc(imageTitle(im))}" data-a="zoom" draggable="false" style="object-position:${esc(im.focal||'50% 50%')}"></div>${im.width&&im.width<1000?`<span class="source-size">原图 ${im.width} × ${im.height||'?'}</span>`:''}`;
}
const preloaded=new Set();
function preloadAdjacent(v){
 const images=photoList(v),i=v.index||0;
 for(const index of [i-1,i+1])if(images[index]){
  const url=imageURL(images[index]);
  if(preloaded.has(url))continue;
  preloaded.add(url);const image=new Image();image.src=url;image.decode?.().catch(()=>{});
 }
 const active=$('.photo-thumb.active');
 if(active){const strip=active.parentElement;strip.scrollLeft=Math.max(0,active.offsetLeft-strip.offsetLeft-strip.clientWidth/2+active.clientWidth/2);}
}
function captureView(v){const key=v.key||getSelectedKey(),x=D.VLOG_SCENE[key]||{},p=x.preset||{},arr=[['视频',p.mode||x.setting?.[0]||'—'],['云台',p.gimbal||x.setting?.[1]||'—'],['曝光补偿',p.ev||'—'],['白平衡',p.wb||'—']];return `<div class="capture-params">${arr.map(([a,b])=>`<div class="capture-param"><small>${esc(a)}</small><b>${esc(b)}</b></div>`).join('')}</div>${(x.spots||[]).map(s=>`<div class="surface-card"><h3>${esc(s.name)}</h3><div class="chips-free">${s.time?`<span class="tag">${esc(s.time)}</span>`:''}${s.light?`<span class="tag">${esc(s.light)}</span>`:''}</div><p>${esc(s.where||'')}</p><p>${esc(s.params||'')}</p>${s.map?`<div class="button-row">${external('机位导航',mapSearch(s.map),'button secondary compact')}</div>`:''}</div>`).join('')}${imagesFor(key,'photo').length?btn('拍照参考','feature',{type:'photo',key,day:viewDay(v)},'button full'):''}`}
function guideView(v){const c=ctx(v);if(!c)return'';const special=D.SPECIAL_SCENE[c.key],places=D.PLACE_DETAIL[c.key]||[];let html='';if(special){html+=`<div class="surface-card"><h3>${esc(special.title)}</h3><p>${esc(special.intro)}</p></div>${stepsHTML(special.steps||[])}`;if(special.objects?.length)html+='<h3 class="section-label">挑着看</h3>'+special.objects.map(x=>`<div class="surface-card"><span class="tag">${esc(x.where)}</span><h3 style="margin-top:9px">${esc(x.title)}</h3><p>${esc(x.why)}</p></div>`).join('');html+=`<div class="button-row">${(special.links||[]).map(([n,u])=>external(n,u,'button secondary compact')).join('')}</div>`}else{html=stepsHTML(c.s.guide||[]);html+=places.map(x=>`<div class="surface-card"><h3>${esc(x.title)}</h3><p>${esc(x.look)}</p>${x.capture?`<p>${esc(x.capture)}</p>`:''}${x.map?`<div class="button-row">${external('查看位置',mapSearch(x.map),'button secondary compact')}</div>`:''}</div>`).join('')}return html||'<div class="empty">这站暂无导览。</div>'}
const HOTEL_SOURCE_DAY={capsule:'02',sleep:'02',sthotel:'03',faberBag:'04',faberHotel:'04',ussReturn:'05',jieyangHotel:'06',jyBreakfast:'06'};
function hotelView(v){
 const c=ctx(v),key=c?.key||null,day=HOTEL_SOURCE_DAY[key]||viewDay(v),items=D.DAYS[day]?.hotel||[];
 const useRest=['sleep','ussReturn'].includes(key);const moment=useRest?(momentMarkup(key,'rest')||momentMarkup(key,'hotel')):(momentMarkup(key,'hotel')||momentMarkup(key,'rest'));
 return `${moment}${items.length?items.map(h=>`<div class="surface-card hotel-card"><div class="hotel-card-head">${icon('hotel')}<div><h3>${esc(h.name)}</h3><p>${esc(h.meta||'')}</p></div></div>${h.note?`<p>${esc(h.note)}</p>`:''}<div class="button-row">${external('打开位置 / 官网',h.url,'button secondary compact')}</div></div>`).join(''):'<div class="empty">这一天没有单独住宿信息。</div>'}`;
}
function foodView(v){const key=v.key||null;return momentMarkup(key,'food')+(D.DAYS[viewDay(v)].food||[]).map(([name,kind,price,note,url])=>`<div class="surface-card"><h3>${esc(name)}</h3><div class="chips-free"><span class="tag">${esc(kind)}</span><span class="tag warm">${esc(price)}</span></div>${note?`<p>${esc(note)}</p>`:''}<div class="button-row">${external('查看位置',url,'button secondary compact')}</div></div>`).join('')+'<p class="hint">价格和营业情况以现场为准。</p>'}
function zoneView(v){const sel=v.zone||D.USS_SCENE_ZONE[v.key]||D.USS_ZONE_ORDER[0],z=D.USS_ZONES[sel];return `${momentMarkup(v.key||null,'zone')}<div class="chipbar">${D.USS_ZONE_ORDER.map(x=>btn(esc(x),'zone-pick',{zone:x},'chip'+(x===sel?' active':''))).join('')}</div><div class="surface-card"><h3>${esc(sel)}</h3><p>${esc(z.rides)}</p><h3 class="section-label">商店</h3><p>${esc(z.shop)}</p><h3 class="section-label">拍照</h3><p>${esc(z.photo)}</p><div class="button-row">${external('官方园区信息',z.url)}</div></div>${btn('园区英语','feature',{type:'english',key:v.key||'ussGate',day:viewDay(v)},'button full')}`}
// Audio is packaged with the app. A system TTS engine is not required for saved phrases.

const audio=new Audio();audio.preload='none';audio.volume=1;let audioSerial=0;
function speedButtons(){return `<div class="speed-toggle" aria-label="语速">${[.8,1].map(speed=>btn(speed===.8?'慢速':'正常','speed',{speed},speed===state.speed?'active':'')).join('')}</div>`;}
function audioProgress(){
 const p=$('#audioProgress'),t=$('#audioTime');
 if(p)p.style.width=(Number.isFinite(audio.duration)?100*audio.currentTime/audio.duration:0)+'%';
 if(t)t.textContent=Number.isFinite(audio.duration)?`${Math.floor(audio.currentTime)} / ${Math.ceil(audio.duration)} s`:'';
}
function updatePlayingButtons(){
 $$('.phrase-actions [data-a="say"], .show-phrase-actions [data-a="say"]').forEach(b=>{
  const active=b.dataset.text===state.playing;
  b.classList.toggle('is-playing',active);
  b.innerHTML=icon(active?'stop':'sound')+`<span>${active?'停止':'播放'}</span>`;
  b.setAttribute('aria-label',active?'停止朗读':'播放英语');
 });
 const bar=$('#audioBar');if(bar){bar.hidden=!state.playing;const label=$('#playingLine');if(label)label.textContent=state.playing||'';}
 audioProgress();
}
function stopAudio(){audioSerial++;audio.pause();state.playing=null;updatePlayingButtons();}
audio.addEventListener('ended',()=>{state.playing=null;updatePlayingButtons();});
audio.addEventListener('timeupdate',audioProgress);
audio.addEventListener('error',()=>{if(!state.playing)return;state.playing=null;updatePlayingButtons();toast('音频未能播放，请返回重试');});
function say(text){
 if(!text)return;
 if(state.playing===text){stopAudio();window.TuhuNative?.speech?.stop?.().catch?.(()=>{});return;}
 stopAudio();const src=A[text];
 if(!src){
  if(window.TuhuNative?.isNative?.()&&window.TuhuNative?.speech?.speak){state.playing=text;updatePlayingButtons();window.TuhuNative.speech.speak(text,state.speed).then(()=>{if(state.playing===text){state.playing=null;updatePlayingButtons()}}).catch(()=>{state.playing=null;updatePlayingButtons();toast('这句没有可用语音')});return;}
  toast('这句没有预置录音');return;
 }
 const request=++audioSerial;state.playing=text;audio.src=src;audio.playbackRate=state.speed;audio.preservesPitch=true;updatePlayingButtons();
 audio.play()?.catch(e=>{if(request!==audioSerial)return;state.playing=null;updatePlayingButtons();toast('播放失败，请检查媒体音量或蓝牙输出');});
}
const ENGLISH_FOCUS={
 arrival:[['immigrationListen',0],['immigrationReply',0],['airportBaggage',0],['airportBaggage',1],['airportBaggage',3]],
 capsule:[['airportBaggage',3],['hotelLate',0],['hotelLate',1]],
 sleep:[['hotelLate',1],['hotelCheckout',2],['hotelCheckout',3]],
 foodLunch:[['hotelCheckout',0],['luggage',0],['restaurant',0],['restaurant',1]],
 acmroute:[['luggage',0],['transitGeneral',0],['transitGeneral',1]],
 acm:[['museum',0],['museum',1],['museum',2],['museum',3]],
 foodDinner:[['restaurant',0],['restaurant',1],['restaurant',2]],
 sthotel:[['hotel',0],['hotel',1],['hotel',2]],
 faberBag:[['hotelCheckout',0],['luggage',1],['luggage',2]],
 ntuRoute:[['ntuTransit',0],['ntuTransit',1],['ntuTransit',2]],
 ntu:[['campusVisit',0],['campusVisit',1],['campusVisit',2]],
 ntuFood:[['restaurant',0],['restaurant',1],['restaurant',2]],
 toHolland:[['transitGeneral',0],['transitGeneral',1],['transitGeneral',2]],
 holland:[['restaurant',0],['restaurant',1],['restaurant',2]],
 toKampong:[['transitGeneral',0],['transitGeneral',1],['transitGeneral',2]],
 kampong:[['restaurant',0],['restaurant',1],['restaurant',2]],
 faberReturn:[['transitGeneral',0],['transitGeneral',1],['transitGeneral',2]],
 faberHotel:[['hotel',0],['hotel',1],['hotel',2]],
 ussRoute:[['sentosaTransit',0],['sentosaTransit',1],['sentosaTransit',2]],
 ussGate:[['themeparkEntry',1],['themeparkEntry',2],['themeparkFacilities',0],['themeparkFacilities',1]],
 ussAm:[['themeparkRide',0],['themeparkRide',1],['themeparkRide',4],['themeparkFacilities',1]],
 ussLunch:[['themeparkFood',0],['themeparkFood',1],['themeparkFacilities',0],['themeparkFacilities',2]],
 ussPm1:[['themeparkRide',0],['themeparkRide',1],['themeparkShopping',0],['themeparkShopping',3],['themeparkFacilities',0]],
 ussRest:[['themeparkFacilities',0],['themeparkFacilities',2],['themeparkFacilities',3]],
 ussPm2:[['themeparkRide',0],['themeparkRide',1],['themeparkRide',4],['themeparkFacilities',1]],
 ussDinner:[['themeparkFood',0],['themeparkFood',1],['themeparkShopping',2],['themeparkShopping',3],['themeparkFacilities',0]],
 ussReturn:[['sentosaTransit',2],['sentosaTransit',0],['sentosaTransit',1]],
 airportRoute:[['airportDepart',0],['transitGeneral',0],['airportDepart',2]],
 t1:[['airportDepart',0],['airportDepart',1],['airportDepart',2],['airportSecurityListen',1],['securityDepart',0]]
};
function englishFocusRows(v){
 const key=v.key||'',spec=ENGLISH_FOCUS[key]||[];
 return spec.map(([cat,index])=>({cat,row:D.ENGLISH_SETS[cat]?.[index]})).filter(x=>x.row);
}
function englishCategories(v){
 const c=ctx(v);
 if(c?.s.english?.length)return [...new Set(c.s.english.filter(x=>D.ENGLISH_SETS[x]?.length))];
 if(c&&['walk','landmark','garden'].includes(c.s.kind))return ['transitGeneral','restaurant'];
 return c?[]:Object.keys(D.ENGLISH_SETS);
}
function englishRows(v){
 const cats=englishCategories(v);v.cat=cats.includes(v.cat)?v.cat:cats[0];
 const q=(v.query||'').trim().toLowerCase(),focus=englishFocusRows(v);
 let source;
 if(q)source=cats.flatMap(cat=>(D.ENGLISH_SETS[cat]||[]).map(row=>({cat,row})));
 else if(v.key&&focus.length&&!v.all)source=focus;
 else source=(D.ENGLISH_SETS[v.cat]||[]).map(row=>({cat:v.cat,row}));
 const seen=new Set();
 return source.filter(({row})=>{const en=row[1];if(seen.has(en)||q&&!row.join(' ').toLowerCase().includes(q))return false;seen.add(en);return true;});
}
function phraseCards(v){
 const rows=englishRows(v);
 if(!rows.length)return'<div class="folder-empty">没有匹配的语句</div>';
 return rows.map(({cat,row:[label,en,zh]})=>`<article class="phrase"><div class="phrase-label">${/Listen|Signs/i.test(cat)?'<span class="tag warm">可能听到</span>':''}<span>${esc(label)}</span></div><button class="phrase-main" data-a="show-phrase" ${attrs({en,zh,key:v.key,day:viewDay(v)})} aria-label="大字出示：${esc(en)}"><span class="phrase-en" lang="en">${esc(en)}</span><span class="phrase-zh">${esc(zh)}</span></button><div class="phrase-actions">${btn(icon('sound')+'<span>播放</span>','say',{text:en},'')}${btn(icon('copy')+'<span>复制</span>','copy',{text:en},'')}${btn(icon('expand'),'show-phrase',{en,zh,key:v.key,day:viewDay(v)},'phrase-show')}</div></article>`).join('');
}
function englishView(v){
 const cats=englishCategories(v);if(!cats.length)return'<div class="empty">这站暂无预置英语。</div>';
 if(!cats.includes(v.cat))v.cat=cats[0];
 const focus=englishFocusRows(v),focused=!!(v.key&&focus.length&&!v.all&&!v.query);
 return `<div class="english-toolbar"><span class="audio-label">${icon('sound')}离线语音</span>${speedButtons()}</div>${focused?`<div class="english-focus-head"><div><small>现在最可能用到</small><b>${focus.length} 句</b></div>${btn('全部语句','english-all',{},'chip')}</div>`:''}${focused?'':`<div class="english-filter">${cats.length>1?`<select class="input" id="englishCategory" aria-label="选择英语场景">${cats.map(k=>`<option value="${esc(k)}" ${k===v.cat?'selected':''}>${esc(D.ENGLISH_LABELS[k]||k)}</option>`).join('')}</select>`:''}<input id="englishSearch" class="input" type="search" placeholder="找一句话…" value="${esc(v.query||'')}" aria-label="筛选预置英语"></div>`}<div id="audioBar" class="audio-bar" hidden><span id="playingLine"></span><div class="audio-meter"><i id="audioProgress"></i></div><small id="audioTime"></small>${ib('stop','stop-audio',{},'停止朗读')}</div><div id="englishPhrases">${phraseCards(v)}</div>`;
}
function phraseView(v){
 return `<div class="show-phrase"><p lang="en">${esc(v.en||'')}</p><span>${esc(v.zh||'')}</span></div><div class="show-phrase-actions">${btn(icon('sound')+'播放','say',{text:v.en},'button')}${btn(icon('copy')+'复制','copy',{text:v.en},'button secondary')}${speedButtons()}</div>`;
}
async function copyText(text){try{await navigator.clipboard.writeText(text);toast('已复制')}catch{const t=document.createElement('textarea');t.value=text;t.style.cssText='position:fixed;left:-9999px';(dialog.open?body:document.body).append(t);t.select();let ok=false;try{ok=document.execCommand('copy')}catch{}t.remove();toast(ok?'已复制':'复制失败，请长按文字复制')}}
function checklist(key){const items=D.CHECKLISTS[key]||[];return items.length?`<div class="surface-card">${items.map((text,i)=>{const k=`sgjy-check-${key}-${i}`,done=storage.get(k)==='1';return `<label class="check-row${done?' checked':''}"><input type="checkbox" data-store-check="${esc(k)}" ${done?'checked':''}><span>${esc(text)}</span></label>`}).join('')}</div>`:''}
function notesView(v){const c=ctx(v),day=viewDay(v),key=c?`sgjy-scene-note-${day}-${c.key}`:`sgjy-note-${day}`,n=c?D.SCENE_NOTES[c.key]||{}:{};return `${c?checklist(c.key):''}${(n.cards||[]).map(([a,b])=>`<div class="surface-card"><h3>${esc(a)}</h3><p>${esc(b)}</p></div>`).join('')}${n.signs?.length?`<h3 class="section-label">现场标识</h3><div class="sign-list">${n.signs.map(([en,zh])=>btn(`<b lang="en">${esc(en)}</b><small>${esc(zh)}</small>`,'say',{text:en},'sign')).join('')}</div>`:''}<h3 class="section-label">我的备忘</h3><textarea class="memo-input" id="memoInput" data-store="${esc(key)}" placeholder="柜台、上车点、临时安排…">${esc(storage.get(key)||'')}</textarea><div class="memo-toolbar"><span id="saveState">本机自动保存</span><span>10.${day}</span></div>`}
const TASKS=[
{id:'sgac',day:'03',key:'arrival',title:'提交 SG Arrival Card',note:'抵达前 3 天内（含抵达日）。'},
{id:'powerbank',day:'02',key:'hgh',title:'检查充电宝',note:'标识、容量与随身携带。'},
{id:'acm-ticket',day:'03',key:'acm',title:'确认 ACM 门票',note:'原行程：未购。'},
{id:'uss-ticket',day:'05',key:'ussGate',title:'确认环球影城门票',note:'原行程：待购。'},
{id:'jy-hotel',day:'06',key:'jieyangHotel',title:'确认揭阳酒店',note:'原行程：待订。'},
{id:'train',day:'07',key:'d3108',title:'确认 D3108 车票',note:'车次、车站、发车时间。'},
{id:'offline',day:'02',title:'断网测试行程、英语与旅途助手',note:'静态资料随包提供；Android 模型按需导入。'}
];
function tasksView(){const done=TASKS.filter(t=>storage.get('fieldnotes-task-'+t.id)==='1').length;return `<div class="list-heading"><h3>${done} / ${TASKS.length}</h3></div><div class="progress"><i style="width:${100*done/TASKS.length}%"></i></div>${TASKS.map(t=>`<div class="check-row"><input aria-label="完成${esc(t.title)}" type="checkbox" data-store-check="fieldnotes-task-${t.id}" ${storage.get('fieldnotes-task-'+t.id)==='1'?'checked':''}><div class="check-main"><span class="tag">10.${t.day}</span><h3 style="font-size:14px;margin-top:7px">${esc(t.title)}</h3><small>${esc(t.note)}</small></div>${t.key?ib('next','feature',{type:'scene',key:t.key,day:t.day},'打开行程'):''}</div>`).join('')}`}
// Existing database/store names deliberately retained for v38-v40 upgrade compatibility.
const DB='fieldnotes-v26', STORE='wallet-files';let dbPromise=null;
function dbOpen(){if(dbPromise)return dbPromise;dbPromise=new Promise((resolve,reject)=>{const req=indexedDB.open(DB,1);req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(STORE))req.result.createObjectStore(STORE,{keyPath:'id'})};req.onerror=()=>{dbPromise=null;reject(req.error)};req.onblocked=()=>{dbPromise=null;reject(new Error('Database upgrade is blocked'))};req.onsuccess=()=>resolve(req.result)});return dbPromise}
async function filesAll(){const db=await dbOpen();return new Promise((res,rej)=>{const r=db.transaction(STORE,'readonly').objectStore(STORE).getAll();r.onsuccess=()=>res(r.result||[]);r.onerror=()=>rej(r.error)})}
async function putRecords(records){const db=await dbOpen();return new Promise((res,rej)=>{const t=db.transaction(STORE,'readwrite');for(const r of records)t.objectStore(STORE).put(r);t.oncomplete=()=>res();t.onerror=()=>rej(t.error);t.onabort=()=>rej(t.error)})}
async function deleteRecord(id){const db=await dbOpen();await new Promise((res,rej)=>{const t=db.transaction(STORE,'readwrite');t.objectStore(STORE).delete(id);t.oncomplete=res;t.onerror=()=>rej(t.error)})}
const fileType=f=>f.type||(/\.pdf$/i.test(f.name)?'application/pdf':/\.jpe?g$/i.test(f.name)?'image/jpeg':/\.png$/i.test(f.name)?'image/png':/\.webp$/i.test(f.name)?'image/webp':'application/octet-stream');
const allowedTypes=new Set(['application/pdf','image/png','image/jpeg','image/webp']);
async function addFiles(input){const list=[...input.files||[]];if(!list.length)return;const ref=input.dataset.ref||'',records=[];try{for(const f of list.slice(0,12)){const type=fileType(f);if(!allowedTypes.has(type))throw new Error('仅支持 PDF、PNG、JPG、WebP');if(f.size>20*1024*1024)throw new Error('单个文件请控制在 20 MB 内');records.push({id:Date.now()+'-'+Math.random().toString(16).slice(2),name:f.name,type,size:f.size,created:Date.now(),data:await f.arrayBuffer(),ref})}await putRecords(records);toast(`已保存 ${records.length} 个文件`);await renderView()}catch(e){toast(e.message||'保存失败，请检查存储空间')}}
const sizeText=n=>n<1024?`${n} B`:n<1048576?`${(n/1024).toFixed(0)} KB`:`${(n/1048576).toFixed(1)} MB`;
const BOOKING_RULES=[
 {test:/Galaxy Pods/i,id:'hotel-galaxy-pods',category:'hotel',kind:'hotel',presentLabel:'酒店确认单',scenes:['capsule','sleep','foodLunch']},
 {test:/ST Signature/i,id:'hotel-st-signature',category:'hotel',kind:'hotel',presentLabel:'酒店确认单',scenes:['foodLunch','acmroute','sthotel']},
 {test:/Hotel Faber Park/i,id:'hotel-faber-park',category:'hotel',kind:'hotel',presentLabel:'酒店确认单',scenes:['faberBag','faberHotel','ussReturn','pack']},
 {test:/满希酒店/i,id:'hotel-jieyang-manxi',category:'hotel',kind:'hotel',presentLabel:'酒店确认单',scenes:['jieyangHotel','jyBreakfast','jyBag']},
 {test:/Asian Civilisations Museum/i,id:'ticket-acm',category:'ticket',kind:'attraction',presentLabel:'ACM 门票',scenes:['acmroute','acm']},
 {test:/Universal Studios Singapore/i,id:'ticket-uss',category:'ticket',kind:'attraction',presentLabel:'USS 门票',scenes:['ussPrep','ussRoute','ussGate','ussAm','ussPm1','ussPm2']},
 {test:/^TR128$/i,id:'flight-tr128',category:'transport',kind:'flight',presentLabel:'航班凭证',scenes:['airportRoute','t1','tr128']},
 {test:/^D3108/i,id:'train-d3108',category:'transport',kind:'train',presentLabel:'火车票',scenes:['toChaoshan','d3108']}
];
const EXTRA_BOOKINGS=[
 {id:'flight-zh9884',booking_id:'flight-zh9884',name:'ZH9884',meta:'12:55 杭州 → 15:00 深圳',note:'10/02 国内段 · 添加行程单 / 登机凭证后可现场出示',url:'',day:'02',days:['02'],category:'transport',kind:'flight',presentLabel:'航班凭证',scenes:['hgh','zh9884'],legacyIds:[]},
 {id:'flight-zh227',booking_id:'flight-zh227',name:'ZH227',meta:'22:00 深圳 → 02:00 新加坡',note:'10/02 国际段 · 添加行程单 / 登机凭证后可现场出示',url:'',day:'02',days:['02'],category:'transport',kind:'flight',presentLabel:'航班凭证',scenes:['szx2','zh227'],legacyIds:[]}
];
const BOOK_CATS={all:'全部',hotel:'住宿',ticket:'门票',transport:'交通',files:'文件'};
const BOOK_KIND_LABEL={hotel:'住宿',attraction:'门票',flight:'航班',train:'火车',document:'资料'};
const statusKey=b=>'tuhu-booking-status-'+b.id;
function bookingRule(name){return BOOKING_RULES.find(r=>r.test.test(name||''))||null}
function bookingSlug(name){return String(name||'booking').toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g,'-').replace(/^-|-$/g,'').slice(0,48)||'booking'}
function baseStatus(b){const m=b.meta||'';if(/若已订|待订|首选/.test(m)&&!/已订/.test(m.replace('若已订','')))return'待确认';if(/已订/.test(m)&&!/若已订/.test(m))return'已订';if(/未购|待购买|待购/.test(m))return'待购';if(/待开售|待.*复核/.test(m))return'待确认';return'待核对'}
function getBookingStatus(b){let s=storage.get(statusKey(b));if(s)return s;for(const old of b.legacyIds||[]){s=storage.get('tuhu-booking-status-'+old);if(s)return s}return baseStatus(b)}
function bookings(){
 const out=[],seen=new Map();
 for(const [day,d] of Object.entries(D.DAYS)){
  for(const kind of ['hotel','tickets'])for(const raw of d[kind]||[]){
   const legacyCategory=kind==='hotel'?'hotel':/TR\d+|ZH\d+|D\d+/.test(raw.name)?'transport':'ticket';
   const legacyId=legacyCategory+'|'+(raw.url||raw.name),rule=bookingRule(raw.name);
   const category=rule?.category||(kind==='hotel'?'hotel':'ticket'),id=rule?.id||`${category}-${bookingSlug(raw.name)}`;
   if(seen.has(id)){const x=seen.get(id);if(!x.days.includes(day))x.days.push(day);if(!x.legacyIds.includes(legacyId))x.legacyIds.push(legacyId);continue}
   const x={...raw,id,booking_id:id,days:[day],day,category,kind:rule?.kind||(category==='hotel'?'hotel':'attraction'),presentLabel:rule?.presentLabel||(category==='hotel'?'酒店确认单':'现场凭证'),scenes:rule?.scenes||[],legacyIds:[legacyId]};
   out.push(x);seen.set(id,x);
  }
 }
 for(const x of EXTRA_BOOKINGS){if(!seen.has(x.id)){out.push({...x});seen.set(x.id,x)}}
 return out.sort((a,b)=>a.day.localeCompare(b.day)||a.name.localeCompare(b.name,'zh-CN'));
}
const BOOK=bookings();
function bookingTitle(b){return b.name.replace('Hotel Faber Park Singapore – Handwritten Collection','Hotel Faber Park Singapore').replace('Galaxy Pods Capsule Hotel (Chinatown)','Galaxy Pods · Chinatown')}
function fileBelongs(f,b){return f.ref===b.id||(b.legacyIds||[]).includes(f.ref)}
function bookingTypeLabel(b){return BOOK_KIND_LABEL[b.kind]||BOOK_CATS[b.category]||'资料'}
function bookingForScene(key,day=''){if(!key)return null;const hits=BOOK.filter(b=>(b.scenes||[]).includes(key));return hits.find(b=>!day||b.days.includes(day))||hits[0]||null}
function credentialActionLabel(b){return b.kind==='hotel'?'出示酒店确认单':b.kind==='flight'?'出示航班凭证':b.kind==='train'?'出示火车票':b.kind==='attraction'?'出示门票':'出示凭证'}
function bookingFieldKey(b,field){return `tuhu-booking-field-${b.id}-${field}`}
function bookingField(b,field){return storage.get(bookingFieldKey(b,field))||''}
function credentialHolder(f,i){return (f.holder||'').trim()||(/(?:^|[_\- ])(?:room|房间)\s*\d+/i.exec(f.name||'')?.[0]?.trim())||`凭证 ${i+1}`}
function bookingCard(b,files){
 const status=getBookingStatus(b),attached=files.filter(x=>fileBelongs(x,b));
 const verified=/^(已订|已购|已使用)$/.test(status),holders=attached.map((f,i)=>credentialHolder(f,i)).slice(0,4);
 return `<article class="wallet-card"><div class="wallet-top"><time>10.${b.day}${b.days.length>1?' — 10.'+b.days.at(-1):''} · ${esc(bookingTypeLabel(b))}</time><span class="tag${verified?'':' pending'}">${esc(status)}</span></div><button class="wallet-title-button" data-a="booking" data-id="${esc(b.id)}"><h3 class="wallet-name">${esc(bookingTitle(b))}</h3>${icon('next')}</button>${b.note||b.meta?`<p class="wallet-detail">${esc(b.note||b.meta)}</p>`:''}${holders.length?`<div class="credential-holders">${holders.map(x=>`<span>${esc(x)}</span>`).join('')}${attached.length>holders.length?`<span>+${attached.length-holders.length}</span>`:''}</div>`:''}<div class="wallet-actions">${attached.length?btn(icon('expand')+` ${credentialActionLabel(b)}${attached.length>1?' · '+attached.length:''}`,'present',{id:b.id},'button compact'):btn(icon('plus')+' 添加凭证','booking',{id:b.id},'button outline compact')}${btn('订单资料','booking',{id:b.id},'button secondary compact')}</div></article>`;
}
function filesHTML(files){
 return files.length?[...files].sort((a,b)=>b.created-a.created).map((f,i)=>{
  const linked=BOOK.find(b=>fileBelongs(f,b));
  return `<div class="wallet-file">${icon(/image/.test(fileType(f))?'camera':'file')}<button class="wallet-file-main" data-a="file" data-id="${esc(f.id)}"><b>${esc(f.holder||f.name)}</b><small>${esc(f.holder?f.name:'')}${f.holder?' · ':''}${sizeText(f.size||f.data?.byteLength||0)}${linked?' · '+esc(bookingTitle(linked)):' · 未关联订单'}</small></button>${ib('next','file',{id:f.id},'打开'+f.name)}</div>`;
 }).join(''):'<div class="folder-empty">还没有添加文件</div>';
}
function upload(ref=''){return `<label class="upload-label">${icon('plus')}添加 PDF / 截图<input type="file" data-upload="1" data-ref="${esc(ref)}" accept="application/pdf,image/png,image/jpeg,image/webp" multiple></label>`}
function walletNowCard(v,files){
 const key=v.key||getSelectedKey(),day=viewDay(v),b=bookingForScene(key,day),dayBookings=BOOK.filter(x=>x.days.includes(day));
 if(!b)return `<section class="wallet-now idle"><span class="wallet-now-eyebrow">现在需要</span><div class="wallet-now-main"><span class="wallet-now-icon">${icon('check')}</span><div><h3>现在不用出示票证</h3><p>10.${day} 还有 ${dayBookings.length} 项订单 / 凭证资料，可在下方直接打开。</p></div></div></section>`;
 const attached=files.filter(f=>fileBelongs(f,b)),c=ctx({key,day});
 return `<section class="wallet-now"><div class="wallet-now-head"><span class="wallet-now-eyebrow">现在需要</span><span>${esc(c?.row?.[0]||'10.'+day)}</span></div><h3>${esc(bookingTitle(b))}</h3><p>${esc(b.presentLabel||credentialActionLabel(b))}${attached.length?` · ${attached.length} 个凭证`:' · 尚未添加现场凭证'}</p><div class="wallet-now-actions">${attached.length?btn(icon('expand')+' '+credentialActionLabel(b),'present',{id:b.id},'button wallet-primary'):btn(icon('plus')+' 添加现场凭证','booking',{id:b.id},'button wallet-primary')}${btn('订单资料','booking',{id:b.id},'button outline')}</div></section>`;
}
function walletToday(day,files){
 const items=BOOK.filter(b=>b.days.includes(day));if(!items.length)return'<div class="folder-empty">今天没有订单资料</div>';
 return `<div class="wallet-today-list">${items.map(b=>{const n=files.filter(f=>fileBelongs(f,b)).length;return `<button type="button" class="wallet-today-item" data-a="${n?'present':'booking'}" data-id="${esc(b.id)}"><span class="wallet-today-icon">${icon(b.kind==='hotel'?'hotel':b.kind==='flight'?'plane':'ticket')}</span><span><b>${esc(bookingTitle(b))}</b><small>${esc(bookingTypeLabel(b))} · ${n?n+' 个凭证':getBookingStatus(b)}</small></span>${icon('next')}</button>`}).join('')}</div>`;
}
async function walletView(v){
 const cat=v.category||'all';if(v.dayOnly===undefined)v.dayOnly=false;if(!v.key)v.key=getSelectedKey();
 let files=[],error=false;try{files=await filesAll();}catch{error=true;}
 v.loadedFiles=files;const day=viewDay(v);
 return `${momentMarkup(v.key||null,'wallet')}${walletNowCard(v,files)}<h3 class="section-label wallet-section-label">今天 · 10.${day}</h3>${walletToday(day,files)}<h3 class="section-label wallet-section-label">全部资料</h3><div class="wallet-controls"><div class="chipbar" role="group" aria-label="凭证类型">${Object.entries(BOOK_CATS).map(([k,t])=>btn(t,'wallet-category',{category:k},'chip'+(cat===k?' active':''))).join('')}</div><div class="wallet-filter"><input type="search" id="walletSearch" class="input" placeholder="酒店、航班、文件名…" value="${esc(v.query||'')}" aria-label="搜索票夹"><button type="button" class="day-filter${v.dayOnly?' active':''}" data-a="wallet-day" aria-pressed="${!!v.dayOnly}">10.${day}</button></div></div>${error?'<div class="audio-notice">本机文件暂时无法读取；订单信息仍可查看。</div>':''}<div id="walletResults">${walletResults(v)}</div>`;
}
function walletResults(v){
 const cat=v.category||'all',files=v.loadedFiles||[],q=(v.query||'').trim().toLowerCase(),day=viewDay(v);
 const matches=BOOK.filter(b=>(cat==='all'||b.category===cat)&&(!v.dayOnly||b.days.includes(day))&&(!q||[b.name,b.note,b.meta,bookingField(b,'orderNo'),bookingField(b,'platform')].join(' ').toLowerCase().includes(q)||files.some(f=>fileBelongs(f,b)&&[f.name,f.holder||''].join(' ').toLowerCase().includes(q))));
 const visibleFiles=files.filter(f=>(!q||[f.name,f.holder||''].join(' ').toLowerCase().includes(q))&&(!v.dayOnly||!f.ref||BOOK.find(b=>fileBelongs(f,b))?.days.includes(day)));
 let html=cat!=='files'?matches.map(b=>bookingCard(b,files)).join(''):'';
 if(cat!=='files'&&!matches.length)html='<div class="folder-empty">没有匹配的订单</div>';
 if(cat==='files'||cat==='all')html+=`<h3 class="section-label">本机文件${visibleFiles.length?' · '+visibleFiles.length:''}</h3>${filesHTML(visibleFiles)}${upload()}`;
 return html;
}
function bookingFields(b){
 const defs=[['orderNo','订单号','例如 Booking / PNR / Confirmation No.'],['platform','购买平台','例如 Trip.com / 官网'],['price','金额','例如 S$82 / ¥560'],['people','人数 / 房间','例如 2 人 / Room 1']];
 return `<div class="wallet-form booking-fields">${defs.map(([field,label,ph])=>`<label>${label}<input class="input" data-booking-field="${field}" data-booking-id="${esc(b.id)}" placeholder="${ph}" value="${esc(bookingField(b,field))}"></label>`).join('')}</div>`;
}
async function bookingView(v){
 const b=BOOK.find(x=>x.id===v.id);if(!b)return'<div class="empty">订单资料不存在。</div>';
 const files=(await filesAll()).filter(f=>fileBelongs(f,b)),status=getBookingStatus(b);
 return `<h3 class="section-label">现场凭证</h3>${files.length?`${btn(icon('expand')+' '+credentialActionLabel(b)+(files.length>1?' · '+files.length:''),'present',{id:b.id},'button wallet-present-full')}${filesHTML(files)}`:`<div class="credential-empty"><span>${icon('ticket')}</span><b>还没有现场凭证</b><p>把二维码截图或 PDF 加进来，到了现场可一键放大出示。</p></div>`}${upload(b.id)}<p class="hint">多人票可分别添加多张凭证，并在单个文件里填写“持有人 / 房间”标签。</p><h3 class="section-label">订单资料</h3><div class="surface-card booking-summary"><div class="booking-summary-top"><span class="tag">10.${b.day}${b.days.length>1?' — 10.'+b.days.at(-1):''} · ${esc(bookingTypeLabel(b))}</span><span class="tag${/^(已订|已购|已使用)$/.test(status)?'':' pending'}">${esc(status)}</span></div><h3>${esc(b.name)}</h3>${b.meta?`<p>${esc(b.meta)}</p>`:''}${b.note?`<p>${esc(b.note)}</p>`:''}${b.url?`<div class="button-row">${external('打开原链接',b.url)}</div>`:''}</div><label class="field-label" for="bookingStatus">我的状态</label><select class="input" id="bookingStatus" data-id="${esc(b.id)}" style="margin:6px 0 12px">${[...new Set([status,'已订','已购','待购','待确认','已使用'])].map(s=>`<option ${status===s?'selected':''}>${esc(s)}</option>`).join('')}</select>${bookingFields(b)}`;
}
let receiptWakeLock=null;
async function requestReceiptWake(){try{if(!receiptWakeLock&&'wakeLock'in navigator)receiptWakeLock=await navigator.wakeLock.request('screen')}catch{}}
async function releaseReceiptWake(){try{await receiptWakeLock?.release?.()}catch{}receiptWakeLock=null}
async function presentView(v){
 const b=BOOK.find(x=>x.id===v.id);if(!b)return'<div class="empty">凭证不存在。</div>';
 const files=(await filesAll()).filter(f=>fileBelongs(f,b)).sort((a,b)=>a.created-b.created);v.fileCount=files.length;
 if(!files.length)return `<div class="present-empty"><span>${icon('ticket')}</span><h3>${esc(bookingTitle(b))}</h3><p>还没有添加可出示的二维码、截图或 PDF。</p>${upload(b.id)}${btn('打开订单资料','booking',{id:b.id},'button secondary full')}</div>`;
 v.index=clamp(Number(v.index)||0,0,files.length-1);const f=files[v.index],type=fileType(f),blob=new Blob([f.data],{type}),url=objectURL(blob),native=window.TuhuNative?.isNative?.();v.currentFileId=f.id;const nativeOpenLabel=window.TuhuNative?.platform?.()==='ios'?'打开 / 分享 PDF':'用手机 PDF 阅读器打开';
 let stage='';if(type.startsWith('image/'))stage=`<div class="present-stage image"><img src="${url}" alt="${esc(f.name)}"></div>`;else if(type==='application/pdf'&&!native)stage=`<div class="present-stage pdf"><iframe title="${esc(f.name)}" src="${url}"></iframe></div>`;else stage=`<div class="present-stage native-pdf"><span>${icon('file')}</span><b>PDF 凭证</b><p>${esc(f.name)}</p>${btn(nativeOpenLabel,'native-file',{id:f.id},'button wallet-primary')}</div>`;
 return `<div class="present-shell"><div class="present-booking"><span>${esc(bookingTypeLabel(b))} · 10.${b.day}</span><h3>${esc(bookingTitle(b))}</h3></div>${stage}<div class="present-meta"><strong>${esc(credentialHolder(f,v.index))}</strong><span>${v.index+1} / ${files.length}</span></div><div class="present-note">${esc(b.meta||b.note||'离线凭证')}</div>${btn('管理这张凭证','file',{id:f.id},'present-manage-link')}</div>`;
}
async function fileView(v){
 const f=(await filesAll()).find(x=>x.id===v.id);if(!f)return'<div class="empty">文件不存在。</div>';
 const type=fileType(f),blob=new Blob([f.data],{type}),url=objectURL(blob),native=window.TuhuNative?.isNative?.();let preview='';
 if(type.startsWith('image/'))preview=`<div class="receipt-image"><img class="file-preview" src="${url}" alt="${esc(f.name)}"></div>`;
 else if(type==='application/pdf'&&!native)preview=`<iframe class="file-pdf" title="PDF预览" src="${url}"></iframe>`;
 else preview=`<div class="empty">PDF · ${sizeText(f.size||blob.size)}<br>${window.TuhuNative?.platform?.()==='ios'?'打开 / 分享到系统应用':'用手机上的 PDF 阅读器打开'}</div>`;
 return `<div class="file-name">${esc(f.name)}</div>${preview}<div class="button-row equal">${native?btn('打开文件','native-file',{id:f.id},'button'):''}${btn(icon('share')+' 分享 / 另存','share-file',{id:f.id},'button secondary')}</div><h3 class="section-label">现场标签</h3><label class="field-label" for="fileHolder">持有人 / 房间 / 用途</label><input class="input" id="fileHolder" data-id="${esc(f.id)}" value="${esc(f.holder||'')}" placeholder="例如：第 2 位同行人 / Room 1"><p class="hint">多人门票可分别标注姓名；酒店确认单可标 Room 1 / Room 2。</p><details class="tts-details"><summary>管理文件</summary><label class="field-label" for="fileBinding">关联订单</label><select class="input" id="fileBinding" data-id="${esc(f.id)}"><option value="">未关联</option>${BOOK.map(b=>`<option value="${esc(b.id)}" ${fileBelongs(f,b)?'selected':''}>10.${b.day} · ${esc(bookingTitle(b))}</option>`).join('')}</select><div class="button-row">${btn(icon('trash')+' 删除','delete-file',{id:f.id},'button danger compact')}</div></details>`;
}
async function updateFileHolder(id,holder){try{const f=(await filesAll()).find(x=>x.id===id);if(!f)throw new Error('文件不存在');await putRecords([{...f,holder:String(holder||'').trim()}]);toast('凭证标签已保存')}catch(e){toast(e.message||'保存失败')}}
async function bindFile(id,ref){
 try{
  if(ref&&!BOOK.some(b=>b.id===ref))throw new Error('订单不存在');
  const f=(await filesAll()).find(x=>x.id===id);if(!f)throw new Error('文件不存在');
  await putRecords([{...f,ref}]);toast(ref?'已关联订单':'已解除关联');
 }catch(e){toast(e.message||'关联失败');}
}
async function base64(buffer){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(String(r.result).split(',')[1]);r.onerror=rej;r.readAsDataURL(new Blob([buffer]))})}
async function saveBlob(name,blob,mode='share'){if(window.TuhuNative?.isNative?.()){const data=await base64(await blob.arrayBuffer());return window.TuhuNative.file({name,mime:blob.type||'application/octet-stream',base64:data,mode})}const url=objectURL(blob);if(mode==='open'){window.open(url,'_blank','noopener');return}const a=document.createElement('a');a.href=url;a.download=name;(dialog.open?body:document.body).append(a);a.click();a.remove()}
async function fileAction(id,mode){try{const f=(await filesAll()).find(x=>x.id===id);if(!f)throw new Error('文件不存在');await saveBlob(f.name,new Blob([f.data],{type:fileType(f)}),mode)}catch(e){toast(e.message||'没有可用的文件阅读器')}}
let pendingBackup=null;
const legacyKey=k=>/^(sgjy-|fieldnotes-task-|fieldnotes-field-|tuhu-)/.test(k);
function backupView(){return `<div class="notice-box">备忘、勾选与凭证保存在本机。卸载前请先导出。</div><div class="button-row">${btn(icon('download')+' 导出备份','export-backup',{},'button full')}</div><h3 class="section-label">恢复备份</h3><label class="upload-label">${icon('file')}选择备份文件<input id="backupInput" type="file" accept="application/json,.json"></label>${pendingBackup?`<div class="surface-card" style="margin-top:13px"><h3>准备恢复</h3><p>${Object.keys(pendingBackup.storage).length} 项设置 / 备忘，${pendingBackup.files.length} 个凭证。相同键会被覆盖。</p><div class="button-row">${btn('确认恢复','apply-backup',{},'button')}${btn('取消','cancel-backup')}</div></div>`:''}<p class="hint">备份文件未加密，可能包含订单或个人资料，请妥善保存。</p>`}
async function exportBackup(b){if(b)b.disabled=true;try{const files=await filesAll(),values={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(legacyKey(k))values[k]=storage.get(k)}const records=[];for(const f of files)records.push({...f,data:await base64(f.data)});const data={format:'tuhu-backup',version:1,app:'v56',created:new Date().toISOString(),storage:values,files:records};await saveBlob('tuhu-backup-'+new Date().toISOString().slice(0,10)+'.json',new Blob([JSON.stringify(data)],{type:'application/json'}));toast('备份已交给系统保存')}catch(e){toast('导出失败：'+(e.message||'本机存储不可用'))}finally{if(b)b.disabled=false}}
function validateBackup(d){if(!d||d.format!=='tuhu-backup'||d.version!==1||!d.storage||typeof d.storage!=='object'||!Array.isArray(d.files))throw new Error('不是兔狐备份文件');if(d.files.length>150||Object.keys(d.storage).length>10000)throw new Error('备份数据过大');for(const [k,v]of Object.entries(d.storage))if(!legacyKey(k)||typeof v!=='string'||v.length>200000)throw new Error('备份内容格式不正确');for(const f of d.files){if(!f||typeof f.id!=='string'||typeof f.name!=='string'||f.name.length>512||!allowedTypes.has(fileType(f))||typeof f.data!=='string'||f.data.length>28*1024*1024||!/^[A-Za-z0-9+/]*={0,2}$/.test(f.data))throw new Error('凭证格式不正确')}return d}
async function loadBackup(file){try{if(!file)return;if(file.size>80*1024*1024)throw new Error('备份文件超过 80 MB');pendingBackup=validateBackup(JSON.parse(await file.text()));renderView()}catch(e){pendingBackup=null;toast(e.message||'无法读取备份')}}
async function applyBackup(){if(!pendingBackup)return;try{const d=validateBackup(pendingBackup);const records=d.files.map(f=>{const b=atob(f.data),a=new Uint8Array(b.length);for(let i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return{...f,data:a.buffer,size:a.byteLength}});await putRecords(records);let ok=true;for(const [k,v]of Object.entries(d.storage))ok=storage.set(k,v)&&ok;pendingBackup=null;toast(ok?'备份已恢复':'文件已恢复，部分备忘未保存');renderHome();renderView()}catch(e){toast('恢复失败：'+(e.message||'存储不可用'))}}
function datesView(){return `<div class="date-grid">${D.ORDER.map(d=>btn(`<strong>${D.DAYS[d].date}</strong><small>${D.DAYS[d].dow}</small>`,'day',{day:d},'day-pick'+(d===state.day?' active':''))).join('')}</div>`}
function assistantModelStatusLabel(st){
 if(!st?.native)return'网页知识库模式';
 if(!st.installed)return'未安装本地模型';
 if(st.busy)return st.loaded?'本地模型生成中':'本地模型加载中';
 return st.loaded?'本地模型已加载':'本地模型已安装';
}
function assistantSize(n){return n?`${(n/1024/1024).toFixed(n>1024*1024*1024?0:1)} MB`:''}
function assistantNotes(day,key){return [storage.get(`sgjy-note-${day}`),key?storage.get(`sgjy-scene-note-${day}-${key}`):''].filter(Boolean).join('\n')}
function assistantView(v){
 v.messages=v.messages||[];v.key=v.key||getSelectedKey();
 const messages=v.messages.length?v.messages.map(m=>`<div class="assistant-msg ${m.role}"><span>${m.role==='user'?'你':m.mode==='model'?'本地模型':'本地资料'}</span><p>${esc(m.text).replace(/\n/g,'<br>')}</p>${m.meta?`<small>${esc(m.meta)}</small>`:''}</div>`).join(''):`<div class="assistant-empty"><span class="assistant-mark">${icon('sparkle')}</span><h3>现在就可以离线问</h3><p>它会先读取当前时间轴、本站资料、备忘和英语卡。Android 可选用本机 GGUF；iPhone 与未装模型时直接使用内置旅行知识库。</p></div>`;
 const quick=['接下来去哪？','厕所怎么说？','我有点累，后面怎么减？','下雨了怎么调整？'];
 return `<div class="assistant-status-card"><div><span class="assistant-status-dot"></span><div><b id="assistantStatusText">正在检查离线模型…</b><small id="assistantModelText">不会调用在线 API</small></div></div><button type="button" class="button outline compact" data-a="assistant-model-pick">导入 GGUF</button></div><div class="assistant-model-actions" id="assistantModelActions"></div><div class="assistant-chat" id="assistantChat">${messages}${v.loading?'<div class="assistant-msg assistant"><span>本地模型</span><p class="assistant-thinking">正在本机生成…</p></div>':''}</div><div class="assistant-quick">${quick.map(q=>btn(esc(q),'assistant-quick',{text:q},'chip')).join('')}</div><form id="assistantForm" class="assistant-form"><textarea id="assistantInput" rows="2" maxlength="1000" placeholder="例如：我现在到 NTU 了，下一步干嘛？"></textarea><button class="assistant-send" type="submit" ${v.loading?'disabled':''} aria-label="发送">${icon('next')}</button></form><p class="assistant-privacy">离线助手不会把对话发送到云端。实时天气、营业时间、排队和交通状态仍需联网确认。</p>`;
}
async function refreshAssistantStatus(){
 const text=$('#assistantStatusText'),model=$('#assistantModelText'),actions=$('#assistantModelActions');if(!text)return;
 try{
  const st=await window.TuhuNative?.llm?.status?.();text.textContent=assistantModelStatusLabel(st);
  if(st?.native){model.textContent=st.installed?`${st.modelName||'GGUF'}${st.sizeBytes?' · '+assistantSize(st.sizeBytes):''} · 本机推理`:'支持 GGUF · 推荐 '+(window.TuhuAssistant?.MODEL?.name||'Qwen 小模型');actions.innerHTML=st.installed?`${btn(st.loaded?'卸载模型':'预加载模型',st.loaded?'assistant-model-unload':'assistant-model-load',{},'button secondary compact')}${btn('更换','assistant-model-pick',{},'button outline compact')}${btn('删除','assistant-model-delete',{},'button danger compact')}`:`<a class="button secondary compact" href="${esc(window.TuhuAssistant?.MODEL?.url||'https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF')}" data-external>获取推荐模型</a><span>${esc(window.TuhuAssistant?.MODEL?.size||'')}</span>`;
  }else{model.textContent=(window.TuhuNative?.platform?.()==='ios'?'iPhone 使用内置旅行知识库':'浏览器预览仅使用内置旅行知识库；Android 版支持本机 GGUF');actions.innerHTML='';}
 }catch(e){text.textContent='离线模型状态不可用';model.textContent=e.message||'';if(actions)actions.innerHTML='';}
}
function assistantPrompt(v,q){
 const TA=window.TuhuAssistant,day=viewDay(v),key=v.key||getSelectedKey();
 const context=TA?.context({query:q,day,key,index:state.index,notes:assistantNotes(day,key)})||'';
 const history=(v.messages||[]).slice(-4).map(m=>`${m.role==='user'?'用户':'助手'}：${m.text}`).join('\n');
 return `${history?`最近对话：\n${history}\n\n`:''}本地旅行资料：\n${context}\n\n用户现在问：${q}`;
}
async function askAssistant(question){
 const v=top();if(v?.type!=='assistant'||v.loading)return;const q=String(question||'').trim();if(!q)return;
 v.messages=v.messages||[];v.messages.push({role:'user',text:q});v.loading=true;v.scroll=1e9;renderView();
 const day=viewDay(v),key=v.key||getSelectedKey();let reply='',mode='fallback',meta='';
 try{
  const st=await window.TuhuNative?.llm?.status?.();
  if(st?.native&&st.installed){
   const r=await window.TuhuNative.llm.complete({prompt:assistantPrompt(v,q),systemPrompt:window.TuhuAssistant?.system||'',maxTokens:220});
   reply=String(r?.text||'').trim();mode='model';meta=r?.tokensPerSecond?`${Number(r.tokensPerSecond).toFixed(1)} tok/s · ${r.modelName||st.modelName||'本地 GGUF'}`:(r?.modelName||st.modelName||'本地 GGUF');
  }else reply=window.TuhuAssistant?.fallback({query:q,day,key,index:state.index})||'本地资料里没有找到足够信息。';
 }catch(e){reply=(window.TuhuAssistant?.fallback({query:q,day,key,index:state.index})||'')+`\n\n（本地模型暂时不可用：${e.message||'推理失败'}）`;mode='fallback';}
 if(top()!==v)return;v.messages.push({role:'assistant',text:reply||'本地模型没有返回内容。',mode,meta});v.loading=false;v.scroll=1e9;renderView();
}
async function assistantModelAction(kind){
 try{
  if(window.TuhuNative?.platform?.()!=='android')throw new Error('GGUF 模型管理目前仅在 Android 版提供');
  if(kind==='pick'){toast('请选择一个 GGUF 模型文件');await window.TuhuNative.llm.pickModel();toast('模型已导入本机');}
  if(kind==='load'){toast('正在加载本地模型…');await window.TuhuNative.llm.load();toast('本地模型已加载');}
  if(kind==='unload'){await window.TuhuNative.llm.unload();toast('已释放模型内存');}
  if(kind==='delete'){if(!window.confirm('删除本机 GGUF 模型？之后仍可重新导入。'))return;await window.TuhuNative.llm.deleteModel();toast('本地模型已删除');}
 }catch(e){toast(e.message||'模型操作失败')}finally{refreshAssistantStatus()}
}
function moreView(v){return `<div class="product-grid">${[['assistant','旅途助手'],['tasks','待办'],['search','搜索'],['notes','当天备忘'],['wallet','票夹'],['food','吃喝'],['hotel','住宿'],['photo','拍照'],['settings','设置'],['backup','备份']].map(([t,label])=>t==='assistant'?tile(t,getSelectedKey(),viewDay(v),label):tile(t,null,viewDay(v),label)).join('')}</div><div class="version-line">兔狐 · v56</div>`}
async function requestPersistentStorage(){
 try{if(!navigator.storage?.persist)return null;return await navigator.storage.persist()}catch{return false}
}
async function deviceChecks(){
 const out=[];
 const add=(id,label,status,detail='')=>out.push({id,label,status,detail});
 const platform=window.TuhuNative?.platform?.()||'web';
 add('platform','运行环境','pass',platform==='web'?'浏览器 / PWA':platform==='ios'?'iPhone / iOS':platform==='android'?'Android':'原生');
 try{const k='tuhu-devicecheck-'+Date.now();localStorage.setItem(k,'ok');const ok=localStorage.getItem(k)==='ok';localStorage.removeItem(k);add('local','设置 / 备忘存储',ok?'pass':'fail',ok?'可写入并读取':'localStorage 读写失败')}catch(e){add('local','设置 / 备忘存储','fail',e.message||'不可用')}
 try{const id='devicecheck-'+Date.now(),rec={id,name:'device-check.txt',type:'text/plain',size:2,created:Date.now(),data:new TextEncoder().encode('ok').buffer,ref:'__devicecheck__'};await putRecords([rec]);const got=(await filesAll()).find(x=>x.id===id);await deleteRecord(id);add('wallet','票夹本机数据库',got?'pass':'fail',got?'IndexedDB 写入 / 读取 / 删除正常':'读取不到测试文件')}catch(e){add('wallet','票夹本机数据库','fail',e.message||'IndexedDB 不可用')}
 const persist=await requestPersistentStorage();
 add('persist','持久存储',persist===true?'pass':persist===false?'warn':'info',persist===true?'系统已允许 persistent storage':persist===false?'系统未授予 persistent storage；原生 App 通常仍会保留 WebView 数据':'当前环境不提供 persistent storage API');
 try{const testSrc=Object.values(A)[0];if(!testSrc)throw new Error('没有离线音频索引');const res=await fetch(testSrc,{cache:'no-store'});add('audio','离线英语文件',res.ok?'pass':'fail',res.ok?'已读取本地音频':'音频资源读取失败')}catch(e){add('audio','离线英语文件','fail',e.message||'读取失败')}
 try{const res=await fetch('./js/trip-data.js',{cache:'no-store'});add('bundle','离线行程资源',res.ok?'pass':'fail',res.ok?'核心行程脚本可读取':'核心资源缺失')}catch(e){add('bundle','离线行程资源','fail',e.message||'读取失败')}
 if(platform==='android')add('nativefile','凭证打开 / 分享桥接',window.Capacitor?.isPluginAvailable?.('TuhuFiles')?'pass':'warn','Android 使用原生 TuhuFiles');
 else if(platform==='ios')add('nativefile','凭证打开 / 分享桥接',navigator.share?'warn':'fail',navigator.share?'iOS 当前使用系统分享 fallback；真机需重点验证 PDF':'未检测到可用分享接口');
 else add('nativefile','凭证打开 / 分享桥接','info','浏览器预览使用下载 / Web Share');
 const cs=getComputedStyle(document.documentElement);add('safe','安全区域','pass','top '+(cs.getPropertyValue('--safe-top').trim()||'0')+' / bottom '+(cs.getPropertyValue('--safe-bottom').trim()||'0'));
 add('online','网络状态',navigator.onLine?'info':'pass',navigator.onLine?'当前在线；断网后再跑一次可验证离线':'当前离线');
 return out;
}
function deviceCheckMarkup(rows=[]){
 if(!rows.length)return '<div class="device-check-intro"><span>'+icon('check')+'</span><h3>真机发布前自检</h3><p>建议在 iPhone / Android 安装包里各跑一次，再关网跑一次。</p></div>'+btn('开始检查','device-check-run',{},'button full');
 const names={pass:'通过',warn:'需真机确认',fail:'失败',info:'信息'};
 return '<div class="device-check-list">'+rows.map(x=>'<div class="device-check-row '+x.status+'"><span class="device-check-dot"></span><div><b>'+esc(x.label)+'</b><small>'+esc(x.detail||'')+'</small></div><em>'+esc(names[x.status]||x.status)+'</em></div>').join('')+'</div>'+btn('重新检查','device-check-run',{},'button secondary full');
}
function deviceCheckView(v){return deviceCheckMarkup(v.results||[])}
function settingsView(){
 const feel=storage.get('tuhu-motion-feel')||'light';
 return `<div class="surface-card"><div class="setting-row"><span>版本</span><span>兔狐 v56</span></div><div class="setting-row"><span>行程</span><span>2026.10.02 — 10.07</span></div><div class="setting-row"><span>离线英语</span><span>${Object.keys(A).length} 条本地录音</span></div><div class="setting-row"><span>旅途助手</span><span>iPhone 内置知识库 / Android 可选 GGUF</span></div></div><h3 class="section-label">真机</h3>${btn(icon('check')+' 运行真机自检','feature',{type:'devicecheck'},'button secondary full')}<p class="hint">安装到手机后，用它检查本机存储、票夹、离线资源、音频与原生桥接。</p><h3 class="section-label">离线 AI</h3>${btn(icon('sparkle')+' 打开旅途助手','feature',{type:'assistant',key:getSelectedKey(),day:state.day},'button secondary full')}<p class="hint">Android 可导入一次 GGUF 模型，之后完全离线推理；没有模型也不影响行程、英语、票夹等功能。</p><h3 class="section-label">滑动手感</h3><div class="feel-options">${[['light','轻快'],['balanced','标准']].map(([id,name])=>btn(name,'motion-feel',{feel:id},'chip'+(feel===id?' active':''))).join('')}</div><h3 class="section-label">声音</h3><div class="button-row equal">${btn(icon('sound')+' 试听一句','say',{text:'Hello, excuse me.'},'button secondary')}${btn('停止','stop-audio',{},'button outline')}</div><p class="hint">常用英语直接播放随 App 打包的离线录音，不需要先检测系统语音。无声时只需检查媒体音量和蓝牙输出。</p><h3 class="section-label">资料</h3>${btn('备份 / 恢复','feature',{type:'backup'},'button secondary full')}<p class="hint">资料只保存在本机；卸载前请导出备份。</p><div class="version-line">TUHU · 56.0.0</div>`;
}
function overviewView(v){
 const day=viewDay(v),rows=D.DAYS[day].timeline;
 return `<div class="overview-dates">${D.ORDER.map(d=>btn('10.'+d,'overview-day',{day:d},'chip'+(d===day?' active':''))).join('')}</div><ol class="overview-list">${rows.map((row,i)=>`<li><button data-a="overview-pick" data-key="${esc(row[4])}" data-day="${day}" class="overview-stop${day===state.day&&i===state.index?' selected':''}"><time>${esc(row[0])}</time><div><b>${esc(row[1])}</b>${row[2]?`<small>${esc(row[2])}</small>`:''}</div>${icon('next')}</button></li>`).join('')}</ol>`;
}
function searchMatches(q){const query=q.trim().toLowerCase();if(!query)return[];const out=[];for(const day of D.ORDER)for(const row of D.DAYS[day].timeline){const key=row[4],text=JSON.stringify([row,D.SCENE_NOTES[key],D.PLACE_DETAIL[key],D.VLOG_SCENE[key]]).toLowerCase();if(text.includes(query))out.push({type:'scene',key,day,title:row[1],sub:row[0]+' · '+row[2]})}for(const [cat,rs]of Object.entries(D.ENGLISH_SETS))for(const [label,en,zh]of rs)if((label+en+zh).toLowerCase().includes(query))out.push({type:'english',cat,day:state.day,title:en,sub:zh});return out.slice(0,45)}
function searchResults(q){if(!q.trim())return'';const hits=searchMatches(q);return hits.length?hits.map(x=>btn(`<small>${x.type==='scene'?'10.'+x.day:'英语'}</small><b>${esc(x.title)}</b><p>${esc(x.sub)}</p>`,'search-result',{type:x.type,key:x.key,day:x.day,cat:x.cat},'search-result')).join(''):'<div class="empty">没有找到相关内容</div>'}
function searchView(v){return `<input class="input" id="searchInput" type="search" placeholder="行程、标识、英语…" value="${esc(v.query||'')}" autocomplete="off"><div id="searchResults" class="search-results">${searchResults(v.query||'')}</div>`}
async function action(e){const a=e.target.closest('[data-a]');if(!a)return;const p=a.dataset,v=top();switch(p.a){case'nav':if(p.type==='today'){closeAll();return}openView({type:p.type,day:state.day});break;case'feature':openView({type:p.type==='special'?'guide':p.type,key:p.key||null,day:p.day||state.day});break;case'back':back();break;case'close':closeAll();break;case'close-all':closeAll();break;case'day':changeDay(p.day);closeAll();break;case'station':{const rows=D.DAYS[p.day].timeline,i=rows.findIndex(r=>r[4]===p.key);if(state.day!==p.day)changeDay(p.day);deck.select(Math.max(0,i),false);openView({type:'scene',key:p.key,day:p.day},true);break}case'map-point':v.point=Number(p.index);v.scroll=0;renderView();break;case'lightbox':openView({type:'lightbox',key:v.key,day:viewDay(v),images:photoList(v),index:v.index||0});break;case'photo-index':v.index=Number(p.index);v.scroll=0;renderView();break;case'photo-prev':case'photo-next':{const files=photoList(v);v.index=((v.index||0)+(p.a==='photo-next'?1:-1)+files.length)%files.length;v.zoom=false;v.scroll=0;renderView();break}case'zoom':v.zoom=!v.zoom;$('#lightboxStage')?.classList.toggle('zoomed',v.zoom);const b=$('[data-a="zoom"].button');if(b)b.textContent=v.zoom?'适应屏幕':'放大 2×';break;case'zone-pick':v.zone=p.zone;v.scroll=0;renderView();break;case'speed':state.speed=Number(p.speed)===.8?.8:1;storage.set('tuhu-speech-speed',state.speed);audio.playbackRate=state.speed;saveScroll();renderView();break;case'say':say(p.text);break;case'stop-audio':stopAudio();break;case'show-phrase':openView({type:'phrase',en:p.en,zh:p.zh,key:p.key||null,day:p.day||state.day});break;case'english-all':v.all=true;v.query='';v.scroll=0;renderView();break;case'copy':copyText(p.text);break;case'wallet-category':v.category=p.category;v.scroll=0;renderView();break;case'wallet-day':v.dayOnly=!v.dayOnly;v.scroll=0;renderView();break;case'booking':openView({type:'booking',id:p.id});break;case'present':openView({type:'present',id:p.id,index:Number(p.index)||0});break;case'present-prev':case'present-next':{if(v?.type!=='present')break;const n=v.fileCount||0;if(n>1){v.index=((v.index||0)+(p.a==='present-next'?1:-1)+n)%n;v.scroll=0;renderView()}break}case'file':openView({type:'file',id:p.id});break;case'native-file':fileAction(p.id,'open');break;case'share-file':fileAction(p.id,'share');break;case'delete-file':{if(!a.dataset.confirm){a.dataset.confirm='1';a.textContent='再次点击确认删除';return}try{await deleteRecord(p.id);back();toast('已删除')}catch{toast('删除失败')}break}case'device-check-run':{a.disabled=true;a.textContent='检查中…';try{v.results=await deviceChecks();v.scroll=0;renderView()}catch(e){toast(e.message||'自检失败')}break}case'export-backup':exportBackup(a);break;case'apply-backup':applyBackup();break;case'cancel-backup':pendingBackup=null;renderView();break;case'search-result':openView({type:p.type,key:p.key||null,day:p.day,cat:p.cat});break;case'overview-day':v.day=p.day;v.scroll=0;renderView();break;case'overview-pick':{if(state.day!==p.day)changeDay(p.day);const i=D.DAYS[p.day].timeline.findIndex(r=>r[4]===p.key);deck.select(Math.max(0,i),false);openView({type:'scene',key:p.key,day:p.day});break}case'assistant-quick':askAssistant(p.text);break;case'assistant-clear':if(v?.type==='assistant'){v.messages=[];v.scroll=0;renderView()}break;case'assistant-model-pick':assistantModelAction('pick');break;case'assistant-model-load':assistantModelAction('load');break;case'assistant-model-unload':assistantModelAction('unload');break;case'assistant-model-delete':assistantModelAction('delete');break;case'motion-feel':{const f=p.feel==='light'?'light':'balanced';storage.set('tuhu-motion-feel',f);deck.setFeel(f);saveScroll();renderView();break}case'retry-image':{const img=a.querySelector('img');if(img){a.dataset.a=a.dataset.retryAction||'lightbox';img.classList.remove('image-error');const src=img.src;img.removeAttribute('src');img.src=src;}break}case'field-step':{const key=p.key,steps=D.FLOW_INFO[key]||[],i=Number(storage.get('fieldnotes-field-'+key))||0,n=i+Number(p.step);if(n>=steps.length){storage.set('fieldnotes-field-'+key,0);back()}else{storage.set('fieldnotes-field-'+key,Math.max(0,n));renderView()}break}}}
document.addEventListener('click',e=>{const link=e.target.closest('a[data-external]');if(link){e.preventDefault();const url=link.href;if(window.TuhuNative?.isNative?.())window.TuhuNative.openUrl(url).catch(()=>toast('无法打开链接，请检查网络或地图应用'));else window.open(url,'_blank','noopener,noreferrer');return}Promise.resolve(action(e)).catch(err=>{console.error(err);toast('操作未完成，请重试')})});
document.addEventListener('input',e=>{if(e.target.dataset.store){const ok=storage.set(e.target.dataset.store,e.target.value);const s=$('#saveState');if(s)s.textContent=ok?'已保存到本机':'暂未保存'}if(e.target.dataset.bookingField&&e.target.dataset.bookingId)storage.set(`tuhu-booking-field-${e.target.dataset.bookingId}-${e.target.dataset.bookingField}`,e.target.value);if(e.target.id==='walletSearch'){top().query=e.target.value;$('#walletResults').innerHTML=walletResults(top())}if(e.target.id==='englishSearch'){top().query=e.target.value;$('#englishPhrases').innerHTML=phraseCards(top());updatePlayingButtons()}if(e.target.id==='searchInput'){top().query=e.target.value;$('#searchResults').innerHTML=searchResults(e.target.value)}});
document.addEventListener('submit',e=>{if(e.target.id==='assistantForm'){e.preventDefault();const input=$('#assistantInput');const q=input?.value||'';if(input)input.value='';askAssistant(q)}});
document.addEventListener('change',e=>{const t=e.target;if(t.dataset.storeCheck){storage.set(t.dataset.storeCheck,t.checked?'1':'0');t.closest('.check-row')?.classList.toggle('checked',t.checked);if(top()?.type==='tasks'){saveScroll();renderView()}}if(t.id==='englishCategory'){stopAudio();top().cat=t.value;top().all=true;top().query='';top().scroll=0;renderView()}if(t.id==='fileBinding')bindFile(t.dataset.id,t.value);if(t.id==='fileHolder')updateFileHolder(t.dataset.id,t.value);if(t.dataset.upload)addFiles(t);if(t.id==='bookingStatus'){storage.set('tuhu-booking-status-'+t.dataset.id,t.value);toast('状态已保存')}if(t.id==='backupInput')loadBackup(t.files?.[0])});

// Photo-only horizontal gestures. They never capture vertical scrolling or pinch gestures.
let galleryGesture=null;
body.addEventListener('pointerdown',e=>{
 const stage=e.target.closest('[data-gallery-swipe]');
 if(!stage||!e.isPrimary||top()?.zoom){galleryGesture=null;return;}
 galleryGesture={x:e.clientX,y:e.clientY,id:e.pointerId,time:performance.now(),stage};
});
body.addEventListener('pointerup',e=>{
 const g=galleryGesture;galleryGesture=null;if(!g||g.id!==e.pointerId)return;
 const dx=e.clientX-g.x,dy=e.clientY-g.y;
 if(Math.abs(dx)>48&&Math.abs(dx)>Math.abs(dy)*1.5&&performance.now()-g.time<1000){
  const v=top(),list=photoList(v);if(list.length<2)return;
  v.index=((v.index||0)+(dx<0?1:-1)+list.length)%list.length;v.zoom=false;
  gallerySuppressUntil=performance.now()+300;renderView();
 }
});
body.addEventListener('pointercancel',()=>{galleryGesture=null;});
let gallerySuppressUntil=0;
body.addEventListener('click',e=>{if(performance.now()<gallerySuppressUntil){e.preventDefault();e.stopImmediatePropagation();}},true);

window.addEventListener('tuhu-pause',stopAudio);document.addEventListener('visibilitychange',()=>{if(document.hidden){stopAudio();releaseReceiptWake()}else if(top()?.type==='present')requestReceiptWake()});
window.Tuhu={version:'v56',open:openView,back,close:closeAll,stopAudio,changeDay,getState:()=>({day:state.day,index:state.index,view:top()?.type,depth:state.stack.length,playing:state.playing,dragUnit:deck?.dragUnit,motionFeel:deck?.feel,homeLayout:state.layout,navigationPending}),getData:()=>D,getAudioStatus:()=>({paused:audio.paused,currentTime:audio.currentTime,duration:audio.duration,readyState:audio.readyState})};
// Keep the legacy public boundary available to external widgets; do not re-run old scripts.
window.Fieldnotes={getState:()=>({day:state.day,key:top()?.key,tab:top()?.type}),openScene:(key,tab)=>openView({type:tab||'scene',key}),openTool:type=>openView({type})};
renderHome();
if('serviceWorker'in navigator&&location.protocol!=='file:'&&!window.__TUHU_SINGLE__&&!window.TuhuNative?.isNative?.()){navigator.serviceWorker.register('./sw.js').catch(()=>{})};requestPersistentStorage().catch(()=>{})
})();
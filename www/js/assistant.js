/* Tuhu v55 — offline travel-assistant retrieval layer. No network calls. */
(()=>{
'use strict';
const D=window.TRIP;
if(!D){window.TuhuAssistant=null;return;}
const MODEL={name:'Qwen2.5-0.5B-Instruct Q4_K_M',size:'约 491 MB',url:'https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/blob/main/qwen2.5-0.5b-instruct-q4_k_m.gguf'};
const compact=s=>String(s??'').replace(/\s+/g,' ').trim();
const trim=(s,n=260)=>{s=compact(s);return s.length>n?s.slice(0,n-1)+'…':s};
const tokens=q=>{
 const s=String(q||'').toLowerCase();
 const out=new Set((s.match(/[a-z0-9][a-z0-9_-]{1,}|[\u3400-\u9fff]{2,4}/g)||[]));
 // Chinese overlapping bigrams make retrieval useful for natural questions.
 const zh=[...s].filter(c=>/[\u3400-\u9fff]/.test(c)).join('');
 for(let i=0;i<zh.length-1;i++)out.add(zh.slice(i,i+2));
 return [...out].filter(x=>x.length>1).slice(0,28);
};
function score(text,terms){text=String(text||'').toLowerCase();let s=0;for(const t of terms){if(text.includes(t))s+=t.length>2?3:1;}return s;}
function row(day,key){return D.DAYS[day]?.timeline.find(r=>r[4]===key)||null;}
function sceneText(day,r){const key=r[4];return JSON.stringify([r,D.SCENE[key],D.SCENE_NOTES?.[key],D.PLACE_DETAIL?.[key],D.SPECIAL_SCENE?.[key],D.FLOW_INFO?.[key],D.VLOG_SCENE?.[key]]);}
function retrieve(query,day,limit=4){
 const terms=tokens(query),all=[];
 for(const d of D.ORDER)for(const r of D.DAYS[d].timeline){
  const text=sceneText(d,r),s=score(text,terms)+(d===day?1:0);
  if(s>0)all.push({type:'scene',day:d,key:r[4],row:r,score:s,text});
 }
 for(const [cat,rows] of Object.entries(D.ENGLISH_SETS||{}))for(const r of rows){
  const text=r.join(' '),s=score(text,terms);if(s>0)all.push({type:'phrase',cat,row:r,score:s,text});
 }
 return all.sort((a,b)=>b.score-a.score).slice(0,limit);
}
function currentIndex(day,key,index){
 const rows=D.DAYS[day]?.timeline||[];
 if(key){const i=rows.findIndex(r=>r[4]===key);if(i>=0)return i;}
 return Math.max(0,Math.min(Number(index)||0,Math.max(0,rows.length-1)));
}
function context({query='',day='03',key=null,index=0,notes=''}){
 const rows=D.DAYS[day]?.timeline||[],i=currentIndex(day,key,index),cur=rows[i];
 const lines=[];
 lines.push(`【当前选择】10.${day} ${cur?cur[0]+' '+cur[1]:'当天行程'}`);
 if(cur){
  lines.push(`地点/移动：${cur[2]||cur[3]||''}`);
  const brief=D.SCENE_BRIEF?.[cur[4]]||[];
  if(brief.length)lines.push('本站执行：'+brief.slice(0,4).map(x=>x.filter(Boolean).join(' / ')).join('；'));
  const note=D.SCENE_NOTES?.[cur[4]];
  if(note)lines.push('本站资料：'+trim(JSON.stringify(note),520));
  const detail=D.PLACE_DETAIL?.[cur[4]];
  if(detail)lines.push('地点资料：'+trim(JSON.stringify(detail),420));
 }
 lines.push('【当天时间轴】');
 rows.forEach((r,n)=>lines.push(`${n===i?'→':'·'} ${r[0]} ${r[1]}｜${r[2]||r[3]||''}`));
 const hits=retrieve(query,day,4);
 if(hits.length){lines.push('【与问题最相关的本地资料】');for(const h of hits){if(h.type==='scene')lines.push(`10.${h.day} ${h.row[0]} ${h.row[1]}｜${trim(h.row[2]||h.row[3],120)}`);else lines.push(`英语：${h.row[1]}｜${h.row[2]}`)}}
 if(notes)lines.push('【用户本机备忘】'+trim(notes,420));
 return lines.join('\n').slice(0,3000);
}
const system=`你是“兔狐”的离线旅途助手。你只能依据用户问题和随附的本地行程资料回答，不使用互联网，也不要假装知道实时天气、营业时间、排队情况、票价或交通状态。资料没有写的内容要明确说“本地资料里没有”。回答要适合旅行现场：先给结论/下一步，再给必要细节；尽量短。若用户问英语表达，给一句最自然、容易直接出示或朗读的英文，并附中文。不要解释模型或系统。`;
function phraseFallback(query){
 const hits=retrieve(query,'03',12).filter(x=>x.type==='phrase');
 if(!hits.length)return null;const r=hits[0].row;return `可以直接说：\n${r[1]}\n${r[2]}`;
}
function fallback({query='',day='03',key=null,index=0}){
 const q=String(query||'').trim(),rows=D.DAYS[day]?.timeline||[],i=currentIndex(day,key,index),cur=rows[i],next=rows[i+1];
 if(!q)return'你可以问我“接下来去哪”“厕所怎么说”“下雨了怎么调整”或直接问某个行程点。';
 if(/接下来|下一站|然后|next|之后去哪/.test(q)){
  if(next)return `下一站是 ${next[0]}「${next[1]}」。${next[2]||next[3]||''}`;
  return '这已经是当天时间轴的最后一站。';
 }
 if(/英语|怎么说|英文|厕所|洗手间|行李|出口|地铁|问路|退房|入住|check.?in|restroom|toilet/i.test(q)){
  const p=phraseFallback(q);if(p)return p;
 }
 if(/下雨|雨天|暴雨/.test(q)){
  const indoor=rows.filter(r=>['attraction','food','hotel','airport','flight'].includes(D.SCENE[r[4]]?.kind)).slice(0,5);
  return indoor.length?`本地行程里更适合雨天优先保留的室内/半室内节点有：${indoor.map(r=>r[1]).join('、')}。实时降雨和营业情况需要你到现场再确认。`:'本地资料没有专门的雨天替代方案；建议优先保留已购票、酒店和交通节点。';
 }
 if(/累|太累|删掉|跳过|取消|少走|休息/.test(q)){
  const later=rows.slice(i+1);
  const fixed=later.filter(r=>['flight','hotel'].includes(D.SCENE[r[4]]?.kind)||/车|航班|入住|退房/.test(r[1]));
  return `如果要减负，先不要动${fixed.length?'这些硬节点：'+fixed.map(r=>r[1]).join('、'):'酒店/航班/车次这类硬节点'}；其余观光点可以按体力现场删减。现在你选中的节点是「${cur?.[1]||'当天行程'}」。`;
 }
 const hits=retrieve(q,day,3);
 if(hits.length){
  const parts=hits.map(h=>h.type==='scene'?`10.${h.day} ${h.row[0]}「${h.row[1]}」：${trim(h.row[2]||h.row[3],90)}`:`英语：${h.row[1]}（${h.row[2]}）`);
  return `本地资料里最相关的是：\n${parts.join('\n')}`;
 }
 return '本地资料里没有找到足够信息。你可以换成地点名、时间、交通、英语或“接下来做什么”来问。';
}
window.TuhuAssistant={MODEL,system,context,retrieve,fallback,currentIndex};
})();
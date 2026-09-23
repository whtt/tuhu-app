/** Dependency-free integrity checks. Does not claim to compile an Android APK. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
process.chdir(root);
const sandbox={window:{}};vm.createContext(sandbox);
for(const f of ['trip-data.js','image-registry.js','audio-data.js'])vm.runInContext(fs.readFileSync('www/js/'+f,'utf8'),sandbox);
const D=sandbox.window.TRIP,A=sandbox.window.TUHU_AUDIO,R=sandbox.window.TUHU_IMAGE_REGISTRY;
let total=0;const assert=(ok,msg)=>{if(!ok)throw new Error(msg)};
assert(D.VERSION==='v56','Unexpected data version');
assert(D.ORDER.length===6,'Expected six trip days');
assert(R?.version==='v56-field-image-audit'&&Array.isArray(R.entries),'Missing v56 image registry');
const imageIds=new Set();for(const x of R.entries){assert(!imageIds.has(x.id),'Duplicate image id '+x.id);imageIds.add(x.id);if(x.scene_id!=='*')assert(D.SCENE[x.scene_id],'Unknown image scene '+x.scene_id);for(const key of (x.scenes||[]))assert(D.SCENE[key],'Unknown moment scene '+key+' / '+x.id);assert(Array.isArray(x.card_targets)&&x.card_targets.length,'Missing image targets '+x.id);for(const rel of [x.src,x.thumb].filter(Boolean))assert(fs.existsSync(path.join('www',rel)),'Missing registry asset '+rel)}

const imageFor=(key,target='timeline')=>{const list=R.entries.filter(x=>x.scene_id===key&&(x.card_targets||[]).includes(target)).slice().sort((a,b)=>(a.priority||99)-(b.priority||99));return list.find(x=>x.role==='hero')||list[0]||null};
const momentFor=(key,module)=>{const list=R.entries.filter(x=>x.role==='moment'&&x.module===module&&((key&&x.scene_id===key)||(key&&(x.scenes||[]).includes(key))||x.scene_id==='*')).slice().sort((a,b)=>{const sa=key&&a.scene_id===key?0:key&&(a.scenes||[]).includes(key)?1:2,sb=key&&b.scene_id===key?0:key&&(b.scenes||[]).includes(key)?1:2;return sa-sb+(Number(a.priority||99)-Number(b.priority||99))/100});return list[0]||null};
const HC=new Set(['capsule','faberBag','jieyangHotel']),HR=new Set(['sleep','sthotel','faberReturn','faberHotel','ussReturn','jyBag']),FF=new Set(['foodLunch','foodDinner','ntuFood','ussLunch','ussDinner','jieyangDinner','jyBreakfast']);
const homeImageFor=(key,target)=>{const kind=D.SCENE[key]?.kind||'',hero=imageFor(key,target),pick=(...mods)=>{for(const m of mods){const x=momentFor(key,m);if(x)return x}return null};if(hero)return hero;if(FF.has(key)||kind==='food')return pick('food','rest');if(HC.has(key))return pick('hotel','rest');if(HR.has(key)||kind==='hotel')return pick('rest','hotel','food');if(kind==='airport'||kind==='flight')return pick('execution','map');if(kind==='route')return pick('map','hotel','rest');if(kind==='themepark')return pick('zone','food','rest');if(kind==='rest')return pick('rest','zone');if(kind==='checklist'){if(key==='ussPrep')return pick('food','zone');if(key==='pack')return pick('rest','hotel','execution');return pick('execution','map')}if(['walk','attraction','campus'].includes(kind))return pick('execution','map');return pick('map','execution','rest','food','hotel','zone')};
for(const day of D.ORDER){assert(D.DAYS[day]?.timeline.length,'Missing day '+day);for(const r of D.DAYS[day].timeline){assert(D.SCENE[r[4]],'Missing scene '+r[4]);assert(homeImageFor(r[4],'timeline'),'Timeline image missing '+r[4]);assert(homeImageFor(r[4],'deck'),'Deck image missing '+r[4]);total++}}
assert(total===51,'Itinerary unexpectedly changed');
const assets=new Set([...Object.values(D.PHOTO_ASSETS),...Object.values(D.PHOTO_THUMBS),...Object.values(A)]);
for(const p of assets)assert(fs.existsSync(path.join('www',p))&&fs.statSync(path.join('www',p)).size>0,'Missing asset '+p);
for(const phrases of Object.values(D.ENGLISH_SETS))for(const [,en] of phrases)assert(A[en],'No bundled English audio: '+en);
for(const [key,s]of Object.entries(D.SCENE))for(const f of (Array.isArray(s.sketch)?s.sketch:s.sketch?[s.sketch]:[]))assert(D.PHOTO_ASSETS[f.split('/').at(-1)],'Missing scene photo '+key+' / '+f);
assert(JSON.parse(fs.readFileSync('capacitor.config.json','utf8')).appId==='com.fieldnotes.singaporejieyang','Do not change the upgrade appId');
for(const f of ['www/index.html','www/sw.js','README.md','native/android/MainActivity.java','native/android/TuhuFilesPlugin.java','native/android/TuhuLlmPlugin.java','www/js/assistant.js'])assert(fs.existsSync(f),'Missing '+f);
for(const f of ['motion.js','assistant.js','app.js'])new vm.Script(fs.readFileSync('www/js/'+f,'utf8'),{filename:f});
const appSource=fs.readFileSync('www/js/app.js','utf8');
for(const marker of ['function presentView','walletNowCard','booking_id:id','flight-zh9884','flight-zh227','updateFileHolder','credential-scene-button','HOME_MOMENT_OVERRIDE','scene-product-grid'])assert(appSource.includes(marker),'Missing v56 marker: '+marker);
assert(fs.readFileSync('scripts/prepare-android.mjs','utf8').includes('llama-android:0.1.1'),'Missing Android llama.cpp dependency');
assert(fs.readFileSync('native/android/MainActivity.java','utf8').includes('TuhuLlmPlugin'),'LLM plugin not registered');
console.log(`PASS: ${D.ORDER.length} days / ${total} entries / ${Object.keys(A).length} audio clips / ${R.entries.length} registered images / offline assistant + v54 wallet + v56 field-use polish wired.`);
console.log('Static integrity only. Native compilation and physical-device playback must be verified separately.');
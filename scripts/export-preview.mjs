/** Standalone UI preview from production sources. NO storage mock or test data. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const web=path.join(root,'www');
const out=path.resolve(root,process.argv[2]||'dist/tuhu_v55_preview.html');
const mime={'.png':'image/png','.webp':'image/webp','.mp3':'audio/mpeg'};
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const assets=walk(path.join(web,'assets')).filter(p=>mime[path.extname(p)]);
const uri=p=>'data:'+mime[path.extname(p)]+';base64,'+fs.readFileSync(p).toString('base64');
let html=fs.readFileSync(path.join(web,'index.html'),'utf8')
 .replace(/<link rel="manifest"[^>]*>/g,'')
 .replace(/<link rel="stylesheet"[^>]*>/g,()=>'<style>'+fs.readFileSync(path.join(web,'css/app.css'),'utf8')+'</style>')
 .replace(/<script defer src="[^"]+"><\/script>/g,'');
for(const p of assets.filter(p=>p.includes(path.join('assets','icons'))))html=html.split('./'+path.relative(web,p).split(path.sep).join('/')).join(uri(p));
const scripts=['<script>window.__TUHU_SINGLE__=true;</script>'];
for(const name of ['trip-data.js','image-registry.js','audio-data.js','motion.js','native-bridge.js','assistant.js','app.js']){
 let code=name==='native-bridge.js'?fs.readFileSync(path.join(web,'js','native-bridge.js'),'utf8'):fs.readFileSync(path.join(web,'js',name),'utf8');
 if(['trip-data.js','image-registry.js','audio-data.js'].includes(name))for(const p of assets){const rel='./'+path.relative(web,p).split(path.sep).join('/');if(code.includes(rel))code=code.split(rel).join(uri(p));}
 scripts.push('<script>'+code.replace(/<\/script/gi,'<\\/script')+'</script>');
}
html=html.replace('</body>',()=>scripts.join('\n')+'</body>');
if(html.includes('__TUHU_TEST_FIXTURE__'))throw new Error('Test fixture leaked into preview');
fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,html,'utf8');
console.log('Exported '+out+' ('+(Buffer.byteLength(html)/1024/1024).toFixed(2)+' MiB)');
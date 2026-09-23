import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(new URL('..',import.meta.url).pathname);
const src=path.join(root,'www/assets/image-registry.json');
const out=path.join(root,'www/js/image-registry.js');
const data=JSON.parse(fs.readFileSync(src,'utf8'));
if(data.version!=='v55-existing-image-polish'||!Array.isArray(data.entries))throw new Error('Invalid image registry');
const ids=new Set();
for(const x of data.entries){
  if(!x.id||!x.scene_id||!x.src||!Array.isArray(x.card_targets))throw new Error('Bad image registry entry '+JSON.stringify(x));
  if(ids.has(x.id))throw new Error('Duplicate image id '+x.id); ids.add(x.id);
}
fs.writeFileSync(out,'/* Auto-generated from assets/image-registry.json. */\nwindow.TUHU_IMAGE_REGISTRY='+JSON.stringify(data)+';\n');
console.log(`Image registry: ${data.entries.length} entries -> ${out}`);
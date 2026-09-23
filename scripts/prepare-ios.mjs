import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
process.chdir(root);
if(Number(process.versions.node.split('.')[0])<20)throw new Error('Node.js 20 or later is required.');
function run(exe,args){const r=spawnSync(exe,args,{stdio:'inherit',shell:process.platform==='win32',cwd:root});if(r.error||r.status!==0)throw new Error(`${exe} ${args.join(' ')} failed. ${r.error||''}`)}
run('node',['scripts/check.mjs']);
run('node',['scripts/build.mjs']);
if(!fs.existsSync('ios/App/App.xcodeproj/project.pbxproj'))run('npx',['--no-install','cap','add','ios']);
run('npx',['--no-install','cap','sync','ios']);
// Replace template app icon with TUHU icon set.
const iconSrc='native/ios/AppIcon.appiconset';
const iconDst='ios/App/App/Assets.xcassets/AppIcon.appiconset';
if(fs.existsSync(iconSrc)){fs.rmSync(iconDst,{recursive:true,force:true});fs.cpSync(iconSrc,iconDst,{recursive:true});}
// Keep the iOS build metadata stable while CI supplies a unique build number.
const pbx='ios/App/App.xcodeproj/project.pbxproj';
let x=fs.readFileSync(pbx,'utf8');
x=x.replace(/MARKETING_VERSION = [^;]+;/g,'MARKETING_VERSION = 56.0.0;');
x=x.replace(/PRODUCT_BUNDLE_IDENTIFIER = [^;]+;/g,'PRODUCT_BUNDLE_IDENTIFIER = com.fieldnotes.singaporejieyang;');
fs.writeFileSync(pbx,x);
console.log('\nTuhu v56 iOS prepared. Core travel functions are iOS-ready; Android-only GGUF model support falls back to the built-in travel knowledge base.');
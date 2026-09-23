import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');process.chdir(root);
if(Number(process.versions.node.split('.')[0])<20)throw new Error('Node.js 20 or later is required.');
function run(exe,args){const r=spawnSync(exe,args,{stdio:'inherit',shell:process.platform==='win32',cwd:root});if(r.error||r.status!==0)throw new Error(`${exe} ${args.join(' ')} failed. ${r.error||''}`)}
run('node',['scripts/check.mjs']);
run('node',['scripts/build.mjs']);
if(!fs.existsSync('android/app/build.gradle'))run('npx',['--no-install','cap','add','android']);
run('npx',['--no-install','cap','sync','android']);
const java='android/app/src/main/java/com/fieldnotes/singaporejieyang';fs.mkdirSync(java,{recursive:true});
for(const name of ['MainActivity.java','TuhuFilesPlugin.java','TuhuLlmPlugin.java'])fs.copyFileSync('native/android/'+name,java+'/'+name);
const gradle='android/app/build.gradle';let g=fs.readFileSync(gradle,'utf8');g=g.replace(/versionCode\s+\d+/,'versionCode 56').replace(/versionName\s+"[^"]+"/,'versionName "56.0.0"');if(!g.includes('dev.ffmpegkit-maintained:llama-android'))g=g.replace(/dependencies\s*\{/,m=>m+'\n    implementation "dev.ffmpegkit-maintained:llama-android:0.1.1"');fs.writeFileSync(gradle,g);
const vars='android/variables.gradle';if(fs.existsSync(vars)){let v=fs.readFileSync(vars,'utf8');v=v.replace(/minSdkVersion\s*=\s*\d+/,'minSdkVersion = 24');fs.writeFileSync(vars,v);}
const manifest='android/app/src/main/AndroidManifest.xml';let m=fs.readFileSync(manifest,'utf8');
if(!m.includes('android.intent.action.TTS_SERVICE')){
 const query='<intent><action android:name="android.intent.action.TTS_SERVICE" /></intent>';
 if(m.includes('</queries>'))m=m.replace('</queries>',query+'</queries>');
 else m=m.replace('<application','<queries>'+query+'</queries>\n    <application');
}
// The app stores private receipts; do not enable system cloud backup of these files.
m=m.replace('android:allowBackup="true"','android:allowBackup="false"');fs.writeFileSync(manifest,m);
const strings='android/app/src/main/res/values/strings.xml';let s=fs.readFileSync(strings,'utf8');s=s.replace(/(<string name="app_name">)[^<]*(<\/string>)/,'$1兔狐$2').replace(/(<string name="title_activity_main">)[^<]*(<\/string>)/,'$1兔狐$2');fs.writeFileSync(strings,s);
if(fs.existsSync('native/android/res'))fs.cpSync('native/android/res','android/app/src/main/res',{recursive:true});
console.log('\nTuhu v56 prepared with on-device GGUF support. Open android/ in Android Studio, choose JDK 21, sync Gradle, and Generate APKs.');
import fs from 'node:fs';
import vm from 'node:vm';
const required=[
  'www/index.html','www/css/app.css','www/js/app.js','www/js/trip-data.js',
  'www/js/image-registry.js','www/js/audio-data.js','www/js/assistant.js',
  'src/native-bridge.js','native/android/MainActivity.java',
  'native/android/TuhuFilesPlugin.java','native/android/TuhuLlmPlugin.java',
  'capacitor.config.json'
];
for(const f of required) if(!fs.existsSync(f)) throw new Error(`Missing source file: ${f}`);
for(const f of ['www/js/app.js','www/js/motion.js','www/js/assistant.js','www/js/trip-data.js']) new vm.Script(fs.readFileSync(f,'utf8'),{filename:f});
const cap=JSON.parse(fs.readFileSync('capacitor.config.json','utf8'));
if(cap.appId!=='com.fieldnotes.singaporejieyang') throw new Error('Unexpected appId');
const app=fs.readFileSync('www/js/app.js','utf8');
for(const marker of ['walletNowCard','booking_id:id','scene-product-grid']) if(!app.includes(marker)) throw new Error(`Missing v56 marker: ${marker}`);
console.log('PASS: TUHU source structure and v56 markers are intact.');
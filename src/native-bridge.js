import { Capacitor, registerPlugin } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
const NativeFiles=registerPlugin('TuhuFiles');
const NativeLlm=registerPlugin('TuhuLlm');
const platform=()=>Capacitor.getPlatform();
const isAndroid=()=>platform()==='android';
const isIOS=()=>platform()==='ios';
async function webShareFile(options={}){
  const {name='tuhu-file',mime='application/octet-stream',base64='',mode='share'}=options;
  if(!base64)throw new Error('文件内容为空');
  const bin=atob(base64),bytes=new Uint8Array(bin.length);
  for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
  const file=new File([bytes],name,{type:mime});
  if(navigator.share&&navigator.canShare?.({files:[file]}))return navigator.share({files:[file],title:name});
  if(mode==='open'){
    const url=URL.createObjectURL(file);window.open(url,'_blank','noopener');setTimeout(()=>URL.revokeObjectURL(url),60000);return;
  }
  throw new Error('iPhone 当前无法调用系统文件分享');
}
const unsupportedLlm=()=>Promise.resolve({native:false,supported:false,platform:platform()});
window.TuhuNative={
  isNative:()=>Capacitor.isNativePlatform(),
  platform,
  openUrl:url=>isAndroid()?NativeFiles.openUrl({url}):Browser.open({url}),
  file:options=>isAndroid()?NativeFiles.file(options):webShareFile(options),
  llm:{
    status:()=>isAndroid()?NativeLlm.status():unsupportedLlm(),
    pickModel:()=>isAndroid()?NativeLlm.pickModel():Promise.reject(new Error('iPhone 版暂不提供 GGUF 模型导入')),
    load:()=>isAndroid()?NativeLlm.load():Promise.reject(new Error('iPhone 版暂不提供 GGUF 模型加载')),
    complete:options=>isAndroid()?NativeLlm.complete(options):Promise.reject(new Error('iPhone 使用内置旅行知识库')),
    unload:()=>isAndroid()?NativeLlm.unload():Promise.resolve(),
    deleteModel:()=>isAndroid()?NativeLlm.deleteModel():Promise.resolve()
  },
  speech:{
    check:async()=>{
      if(!Capacitor.isPluginAvailable('TextToSpeech'))throw new Error('原生语音插件未连接');
      const {voices}=await TextToSpeech.getSupportedVoices();
      return {english:(voices||[]).some(v=>/^en[-_]/i.test(v.lang)||v.lang==='en'),voices};
    },
    speak:(text,rate=1)=>TextToSpeech.speak({text,lang:'en-US',rate:Number(rate)||1,pitch:1,volume:1,category:isIOS()?'playback':'ambient'}),
    stop:()=>TextToSpeech.stop()
  }
};
if(Capacitor.isNativePlatform()){
  if(isAndroid())App.addListener('backButton',()=>{if(!window.Tuhu?.back?.())App.minimizeApp().catch(()=>{});});
  App.addListener('appStateChange',({isActive})=>{if(!isActive)window.dispatchEvent(new Event('tuhu-pause'));});
}
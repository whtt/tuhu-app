/* Browser-preview bridge. `npm run android:prepare` replaces this file with the native bundle. */
window.TuhuNative={
  isNative:()=>false,
  llm:{
    status:async()=>({native:false,engine:'local knowledge',installed:false,loaded:false,busy:false,modelName:'',sizeBytes:0,recommended:'Qwen2.5-0.5B-Instruct Q4_K_M'}),
    pickModel:async()=>{throw new Error('网页预览不能导入 GGUF；请在 Android App 中使用')},
    load:async()=>{throw new Error('网页预览没有原生推理引擎')},
    complete:async()=>{throw new Error('网页预览没有原生推理引擎')},
    unload:async()=>({}),deleteModel:async()=>({})
  }
};
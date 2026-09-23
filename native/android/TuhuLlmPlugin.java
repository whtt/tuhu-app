package com.fieldnotes.singaporejieyang;

import android.app.Activity;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.provider.OpenableColumns;
import androidx.activity.result.ActivityResult;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.Locale;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.function.Consumer;

import dev.ffmpegkit.llama.Llama;
import dev.ffmpegkit.llama.LlamaConfig;
import dev.ffmpegkit.llama.LlamaModel;
import dev.ffmpegkit.llama.LlamaResult;
import kotlin.ResultKt;
import kotlin.coroutines.Continuation;
import kotlin.coroutines.CoroutineContext;
import kotlin.coroutines.EmptyCoroutineContext;
import kotlin.coroutines.intrinsics.IntrinsicsKt;

/**
 * On-device GGUF inference for Tuhu.
 * Model weights are intentionally kept outside the APK and imported once into
 * app-private storage. After import, inference requires no network connection.
 */
@CapacitorPlugin(name = "TuhuLlm")
public class TuhuLlmPlugin extends Plugin {
    private final ExecutorService io = Executors.newSingleThreadExecutor();
    private final AtomicBoolean busy = new AtomicBoolean(false);
    private volatile LlamaModel loadedModel = null;

    private File modelDir() {
        File dir = new File(getContext().getFilesDir(), "tuhu-models");
        if (!dir.exists()) dir.mkdirs();
        return dir;
    }

    private File modelFile() { return new File(modelDir(), "travel-assistant.gguf"); }

    private String modelName() {
        return getContext().getSharedPreferences("tuhu-llm", 0)
                .getString("modelName", modelFile().exists() ? "travel-assistant.gguf" : "");
    }

    private JSObject statusObject() {
        File file = modelFile();
        JSObject out = new JSObject();
        out.put("native", true);
        out.put("engine", "llama.cpp / GGUF");
        out.put("installed", file.exists() && file.length() > 0);
        out.put("loaded", loadedModel != null);
        out.put("busy", busy.get());
        out.put("modelName", modelName());
        out.put("sizeBytes", file.exists() ? file.length() : 0L);
        out.put("recommended", "Qwen2.5-0.5B-Instruct Q4_K_M");
        return out;
    }

    @PluginMethod
    public void status(PluginCall call) { call.resolve(statusObject()); }

    @PluginMethod
    public void pickModel(PluginCall call) {
        if (busy.get()) { call.reject("模型正在使用，请稍后再更换"); return; }
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("*/*");
        intent.putExtra(Intent.EXTRA_MIME_TYPES, new String[]{"application/octet-stream", "application/gguf", "*/*"});
        startActivityForResult(call, intent, "modelPicked");
    }

    @ActivityCallback
    private void modelPicked(PluginCall call, ActivityResult activityResult) {
        if (call == null) return;
        if (activityResult == null || activityResult.getResultCode() != Activity.RESULT_OK) {
            call.reject("未选择模型"); return;
        }
        Intent data = activityResult.getData();
        Uri uri = data == null ? null : data.getData();
        if (uri == null) { call.reject("无法读取所选文件"); return; }

        io.execute(() -> {
            if (!busy.compareAndSet(false, true)) { call.reject("模型正在使用"); return; }
            try {
                String display = displayName(uri);
                if (display == null || !display.toLowerCase(Locale.ROOT).endsWith(".gguf"))
                    throw new Exception("请选择 .gguf 模型文件");
                unloadInternal();
                File dir = modelDir();
                File temp = new File(dir, "travel-assistant.gguf.part");
                File dest = modelFile();
                if (temp.exists()) temp.delete();
                long written = 0L;
                byte[] buffer = new byte[4 * 1024 * 1024];
                try (InputStream in = getContext().getContentResolver().openInputStream(uri);
                     FileOutputStream out = new FileOutputStream(temp)) {
                    if (in == null) throw new Exception("无法打开模型文件");
                    int n;
                    while ((n = in.read(buffer)) >= 0) {
                        if (n == 0) continue;
                        out.write(buffer, 0, n);
                        written += n;
                        if (written > 8L * 1024L * 1024L * 1024L)
                            throw new Exception("模型超过 8 GB，当前版本不建议在手机端使用");
                    }
                    out.getFD().sync();
                }
                if (written < 8L * 1024L * 1024L) throw new Exception("文件过小，不像有效的 GGUF 模型");
                if (dest.exists() && !dest.delete()) throw new Exception("无法替换旧模型");
                if (!temp.renameTo(dest)) throw new Exception("无法保存模型");
                getContext().getSharedPreferences("tuhu-llm", 0).edit().putString("modelName", display).apply();
                JSObject result = statusObject();
                result.put("copiedBytes", written);
                call.resolve(result);
            } catch (Exception error) {
                File temp = new File(modelDir(), "travel-assistant.gguf.part");
                if (temp.exists()) temp.delete();
                call.reject(error.getMessage() == null ? "模型导入失败" : error.getMessage(), error);
            } finally { busy.set(false); }
        });
    }

    private String displayName(Uri uri) {
        String name = null;
        try (Cursor cursor = getContext().getContentResolver().query(uri, null, null, null, null)) {
            if (cursor != null && cursor.moveToFirst()) {
                int index = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME);
                if (index >= 0) name = cursor.getString(index);
            }
        } catch (Exception ignored) {}
        if (name == null || name.trim().isEmpty()) name = uri.getLastPathSegment();
        return name;
    }

    @PluginMethod
    public void load(PluginCall call) {
        File file = modelFile();
        if (!file.exists()) { call.reject("还没有导入 GGUF 模型"); return; }
        if (loadedModel != null) { call.resolve(statusObject()); return; }
        if (!busy.compareAndSet(false, true)) { call.reject("模型正在初始化，请稍后"); return; }
        loadInternal(
            model -> { busy.set(false); loadedModel = model; call.resolve(statusObject()); },
            error -> { busy.set(false); call.reject(message(error, "模型加载失败"), error); }
        );
    }

    @PluginMethod
    public void complete(PluginCall call) {
        String prompt = call.getString("prompt", "").trim();
        String system = call.getString("systemPrompt", "").trim();
        int maxTokens = Math.max(32, Math.min(384, call.getInt("maxTokens", 220)));
        if (prompt.isEmpty()) { call.reject("问题不能为空"); return; }
        if (prompt.length() > 12000 || system.length() > 8000) { call.reject("上下文过长"); return; }
        File file = modelFile();
        if (!file.exists()) { call.reject("还没有导入 GGUF 模型"); return; }
        if (!busy.compareAndSet(false, true)) { call.reject("旅途助手正在回答上一条问题"); return; }

        Consumer<LlamaModel> run = model -> completeInternal(model, prompt, system, maxTokens,
            result -> {
                busy.set(false);
                JSObject out = new JSObject();
                out.put("text", result.getText());
                out.put("tokensGenerated", result.getTokensGenerated());
                out.put("tokensPerSecond", result.getTokensPerSecond());
                out.put("promptEvalTimeMs", result.getPromptEvalTimeMs());
                out.put("generateTimeMs", result.getGenerateTimeMs());
                out.put("modelName", modelName());
                call.resolve(out);
            },
            error -> { busy.set(false); call.reject(message(error, "离线推理失败"), error); }
        );

        if (loadedModel != null) run.accept(loadedModel);
        else loadInternal(
            model -> { loadedModel = model; run.accept(model); },
            error -> { busy.set(false); call.reject(message(error, "模型加载失败"), error); }
        );
    }

    @PluginMethod
    public void unload(PluginCall call) {
        if (busy.get()) { call.reject("模型正在生成，暂时不能卸载"); return; }
        unloadInternal();
        call.resolve(statusObject());
    }

    @PluginMethod
    public void deleteModel(PluginCall call) {
        if (busy.get()) { call.reject("模型正在使用，暂时不能删除"); return; }
        unloadInternal();
        File file = modelFile();
        boolean ok = !file.exists() || file.delete();
        getContext().getSharedPreferences("tuhu-llm", 0).edit().remove("modelName").apply();
        if (!ok) { call.reject("模型文件删除失败"); return; }
        call.resolve(statusObject());
    }

    private void unloadInternal() {
        LlamaModel current = loadedModel;
        loadedModel = null;
        if (current != null) {
            try { Llama.INSTANCE.releaseModel(current); } catch (Throwable ignored) {}
        }
    }

    private LlamaConfig config() {
        int threads = Math.max(2, Math.min(6, Runtime.getRuntime().availableProcessors() - 1));
        return new LlamaConfig(2048, threads, 0, 0.35f, 0.90f, 40, -1);
    }

    private void loadInternal(Consumer<LlamaModel> ok, Consumer<Throwable> fail) {
        File file = modelFile();
        suspend(cont -> Llama.INSTANCE.loadModel(file.getAbsolutePath(), config(), cont), ok, fail);
    }

    private void completeInternal(LlamaModel model, String prompt, String system, int maxTokens,
                                  Consumer<LlamaResult> ok, Consumer<Throwable> fail) {
        suspend(cont -> Llama.INSTANCE.complete(model, prompt, system, maxTokens, cont), ok, fail);
    }

    private interface SuspendStarter<T> { Object start(Continuation<? super T> continuation); }

    @SuppressWarnings("unchecked")
    private <T> void suspend(SuspendStarter<T> starter, Consumer<T> ok, Consumer<Throwable> fail) {
        Continuation<T> continuation = new Continuation<T>() {
            @Override public CoroutineContext getContext() { return EmptyCoroutineContext.INSTANCE; }
            @Override public void resumeWith(Object result) {
                try {
                    ResultKt.throwOnFailure(result);
                    ok.accept((T) result);
                } catch (Throwable error) { fail.accept(error); }
            }
        };
        try {
            Object result = starter.start(continuation);
            if (result != IntrinsicsKt.getCOROUTINE_SUSPENDED()) {
                ResultKt.throwOnFailure(result);
                ok.accept((T) result);
            }
        } catch (Throwable error) { fail.accept(error); }
    }

    private String message(Throwable error, String fallback) {
        String m = error == null ? null : error.getMessage();
        return (m == null || m.trim().isEmpty()) ? fallback : m;
    }

    @Override
    protected void handleOnDestroy() {
        unloadInternal();
        io.shutdownNow();
        super.handleOnDestroy();
    }
}
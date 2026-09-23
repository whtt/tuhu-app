package com.fieldnotes.singaporejieyang;

import android.content.ActivityNotFoundException;
import android.content.ClipData;
import android.content.Intent;
import android.net.Uri;
import android.util.Base64;
import androidx.core.content.FileProvider;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.File;
import java.io.FileOutputStream;
import java.util.UUID;

/** Opens/shares only explicitly selected local files, using temporary URI access. */
@CapacitorPlugin(name = "TuhuFiles")
public class TuhuFilesPlugin extends Plugin {
    @PluginMethod
    public void openUrl(PluginCall call) {
        String url = call.getString("url", "");
        if (!url.startsWith("https://") && !url.startsWith("http://")) {
            call.reject("仅允许 http/https 外部链接"); return;
        }
        getActivity().runOnUiThread(() -> {
            try {
                getActivity().startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));
                call.resolve();
            } catch (ActivityNotFoundException error) {
                call.reject("没有可用的浏览器或地图应用");
            } catch (Exception error) { call.reject("无法打开链接", error); }
        });
    }

    @PluginMethod
    public void file(PluginCall call) {
        String encoded = call.getString("base64", "");
        String name = call.getString("name", "attachment.pdf");
        String mime = call.getString("mime", "application/octet-stream");
        String mode = call.getString("mode", "share");
        if (encoded.isEmpty() || encoded.length() > 112 * 1024 * 1024) {
            call.reject("文件为空或超过导出限制"); return;
        }
        // Do not allow files to escape the app's temporary directory.
        final String safeName = name.replaceAll("[^a-zA-Z0-9\\u4e00-\\u9fff._() -]", "_");
        try {
            File dir = new File(getContext().getCacheDir(), "tuhu-exports");
            if (!dir.exists() && !dir.mkdirs()) throw new Exception("Cannot create temporary directory");
            File[] oldFiles = dir.listFiles();
            if (oldFiles != null) for (File old : oldFiles)
                if (System.currentTimeMillis() - old.lastModified() > 7L * 24L * 3600L * 1000L) old.delete();
            File dest = new File(dir, UUID.randomUUID().toString().substring(0, 8) + "-" + safeName);
            byte[] data = Base64.decode(encoded, Base64.DEFAULT);
            try (FileOutputStream stream = new FileOutputStream(dest)) { stream.write(data); }
            Uri uri = FileProvider.getUriForFile(getContext(), getContext().getPackageName() + ".fileprovider", dest);
            Intent intent;
            if ("open".equals(mode)) {
                intent = new Intent(Intent.ACTION_VIEW).setDataAndType(uri, mime);
            } else {
                intent = new Intent(Intent.ACTION_SEND).setType(mime).putExtra(Intent.EXTRA_STREAM, uri);
            }
            intent.setClipData(ClipData.newRawUri(safeName, uri));
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            final Intent finalIntent = "open".equals(mode) ? intent : Intent.createChooser(intent, "保存或分享");
            getActivity().runOnUiThread(() -> {
                try {
                    getActivity().startActivity(finalIntent);
                    JSObject result = new JSObject(); result.put("opened", true); call.resolve(result);
                } catch (ActivityNotFoundException error) {
                    call.reject("没有可用的文件阅读器，请安装 PDF 阅读器或使用分享 / 另存");
                } catch (Exception error) { call.reject("无法打开文件", error); }
            });
        } catch (Exception error) { call.reject("文件导出失败", error); }
    }
}
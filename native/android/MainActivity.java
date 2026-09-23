package com.fieldnotes.singaporejieyang;

import android.os.Bundle;
import android.view.View;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(TuhuFilesPlugin.class);
        registerPlugin(TuhuLlmPlugin.class);
        super.onCreate(savedInstanceState);
        // Keep web content clear of status/cutout/navigation bars, including Android 15.
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        View root = findViewById(android.R.id.content);
        if (root != null) {
            ViewCompat.setOnApplyWindowInsetsListener(root, (view, windowInsets) -> {
                Insets bars = windowInsets.getInsets(WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout());
                Insets keyboard = windowInsets.getInsets(WindowInsetsCompat.Type.ime());
                view.setPadding(bars.left, bars.top, bars.right, Math.max(bars.bottom, keyboard.bottom));
                return WindowInsetsCompat.CONSUMED;
            });
            ViewCompat.requestApplyInsets(root);
            WindowCompat.getInsetsController(getWindow(), root).setAppearanceLightStatusBars(true);
            WindowCompat.getInsetsController(getWindow(), root).setAppearanceLightNavigationBars(true);
        }
    }
}
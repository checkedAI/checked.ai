package org.checkedai.app;

import android.content.Context;
import android.os.Build;
import android.webkit.JavascriptInterface;

public class WebAppInterface {
    private Context mContext;

    public WebAppInterface(Context context) {
        this.mContext = context;
    }

    @JavascriptInterface
    public boolean isNativeApp() {
        return true;
    }

    @JavascriptInterface
    public String getVersionName() {
        return "1.0.3";
    }

    @JavascriptInterface
    public int getVersionCode() {
        return 103;
    }

    @JavascriptInterface
    public int getAndroidSdk() {
        return Build.VERSION.SDK_INT;
    }
}

#!/usr/bin/env bash
set -e

echo "=== Checked AI Production Android APK Build ==="

BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILD_DIR="${BASE_DIR}/android-build"
OUT_APK="${BASE_DIR}/public/downloads/checked-ai-v1.0.3-release.apk"
KEYSTORE="${BASE_DIR}/scripts/checkedai-release.keystore"
ANDROID_JAR="/usr/lib/android-sdk/platforms/android-23/android.jar"

mkdir -p "${BASE_DIR}/public/downloads"
mkdir -p "${BUILD_DIR}/src/org/checkedai/app"
mkdir -p "${BUILD_DIR}/res/values"
mkdir -p "${BUILD_DIR}/res/layout"
mkdir -p "${BUILD_DIR}/res/drawable"
mkdir -p "${BUILD_DIR}/res/mipmap-mdpi"
mkdir -p "${BUILD_DIR}/res/mipmap-hdpi"
mkdir -p "${BUILD_DIR}/res/mipmap-xhdpi"
mkdir -p "${BUILD_DIR}/res/mipmap-xxhdpi"
mkdir -p "${BUILD_DIR}/res/mipmap-xxxhdpi"
mkdir -p "${BUILD_DIR}/assets"
mkdir -p "${BUILD_DIR}/bin"

# 1. Generate Mipmap Icons from Checked AI Logo
LOGO_SRC="${BASE_DIR}/public/assets/aistudio/file_00000000994c820b934e6d45fd748aac_e53ea1ed.png"
if [ -f "$LOGO_SRC" ]; then
  convert "$LOGO_SRC" -resize 48x48 "${BUILD_DIR}/res/mipmap-mdpi/ic_launcher.png"
  convert "$LOGO_SRC" -resize 72x72 "${BUILD_DIR}/res/mipmap-hdpi/ic_launcher.png"
  convert "$LOGO_SRC" -resize 96x96 "${BUILD_DIR}/res/mipmap-xhdpi/ic_launcher.png"
  convert "$LOGO_SRC" -resize 144x144 "${BUILD_DIR}/res/mipmap-xxhdpi/ic_launcher.png"
  convert "$LOGO_SRC" -resize 192x192 "${BUILD_DIR}/res/mipmap-xxxhdpi/ic_launcher.png"
fi

# 2. AndroidManifest.xml (Targeting Android 5.0 Lollipop through Android 14 API 34)
cat << 'EOF' > "${BUILD_DIR}/AndroidManifest.xml"
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="org.checkedai.app"
    android:versionCode="103"
    android:versionName="1.0.3">

    <!-- Universal Device & Screen Compatibility -->
    <uses-sdk
        android:minSdkVersion="21"
        android:targetSdkVersion="34" />

    <supports-screens
        android:smallScreens="true"
        android:normalScreens="true"
        android:largeScreens="true"
        android:xlargeScreens="true"
        android:anyDensity="true"
        android:resizeable="true" />

    <!-- Essential Permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:supportsRtl="true"
        android:theme="@style/Theme.CheckedAI"
        android:hardwareAccelerated="true"
        android:usesCleartextTraffic="true">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:label="@string/app_name"
            android:launchMode="singleTop"
            android:configChanges="orientation|screenSize|screenLayout|smallestScreenSize|keyboardHidden">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
EOF

# 3. Resources (Strings, Colors, Styles, Layout)
cat << 'EOF' > "${BUILD_DIR}/res/values/strings.xml"
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">Checked AI</string>
    <string name="app_url">https://checked-ai.ai.studio</string>
    <string name="offline_title">You are currently offline</string>
    <string name="offline_msg">Checked AI requires an active network connection to query verification heuristics and models.</string>
</resources>
EOF

cat << 'EOF' > "${BUILD_DIR}/res/values/colors.xml"
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="brand_primary">#4F46E5</color>
    <color name="brand_dark">#0A1128</color>
    <color name="brand_accent">#7C3AED</color>
    <color name="bg_light">#F8FAFC</color>
</resources>
EOF

cat << 'EOF' > "${BUILD_DIR}/res/values/styles.xml"
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.CheckedAI" parent="@android:style/Theme.DeviceDefault.NoActionBar">
        <item name="android:windowBackground">@color/brand_dark</item>
        <item name="android:statusBarColor">@color/brand_dark</item>
        <item name="android:navigationBarColor">@color/brand_dark</item>
    </style>
</resources>
EOF

cat << 'EOF' > "${BUILD_DIR}/res/layout/activity_main.xml"
<?xml version="1.0" encoding="utf-8"?>
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/brand_dark"
    android:fitsSystemWindows="true">

    <WebView
        android:id="@+id/webview"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />

    <ProgressBar
        android:id="@+id/progressBar"
        style="?android:attr/progressBarStyleHorizontal"
        android:layout_width="match_parent"
        android:layout_height="3dp"
        android:layout_gravity="top"
        android:max="100"
        android:progressDrawable="@android:drawable/progress_horizontal"
        android:visibility="gone" />
</FrameLayout>
EOF

# 4. Offline Fallback HTML Asset
cat << 'EOF' > "${BUILD_DIR}/assets/offline.html"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Checked AI - Offline</title>
  <style>
    body {
      margin: 0;
      padding: 24px;
      background: #0A1128;
      color: #E2E8F0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 80vh;
      text-align: center;
    }
    .badge {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 9999px;
      background: rgba(79, 70, 229, 0.2);
      border: 1px solid rgba(99, 102, 241, 0.4);
      color: #A5B4FC;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 20px;
    }
    h1 {
      font-size: 24px;
      font-weight: 800;
      color: #FFFFFF;
      margin: 0 0 12px;
    }
    p {
      font-size: 14px;
      color: #94A3B8;
      max-width: 320px;
      line-height: 1.5;
      margin: 0 0 24px;
    }
    button {
      background: #4F46E5;
      color: #FFFFFF;
      border: none;
      padding: 12px 28px;
      font-size: 14px;
      font-weight: 700;
      border-radius: 12px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
    }
  </style>
</head>
<body>
  <div class="badge">Checked AI · Offline Mode</div>
  <h1>Connection Required</h1>
  <p>Checked AI requires an active internet connection to evaluate AI generation markers and threat signals.</p>
  <button onclick="window.location.href='https://checked-ai.ai.studio'">Retry Connection</button>
</body>
</html>
EOF

# 5. Metadata Descriptor
cat << 'EOF' > "${BUILD_DIR}/assets/checked_ai_manifest.json"
{
  "appName": "Checked AI",
  "packageName": "org.checkedai.app",
  "versionName": "1.0.3",
  "versionCode": 103,
  "minSdkVersion": 21,
  "targetSdkVersion": 34,
  "supportedArchitectures": ["arm64-v8a", "armeabi-v7a", "x86_64", "x86"],
  "signatureScheme": ["v1", "v2", "v3"],
  "developer": "Checked AI Security Labs",
  "releaseType": "Production Signed"
}
EOF

# 6. Android Java Source Code (MainActivity & WebAppInterface)
cat << 'EOF' > "${BUILD_DIR}/src/org/checkedai/app/MainActivity.java"
package org.checkedai.app;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ProgressBar;

public class MainActivity extends Activity {
    private WebView mWebView;
    private ProgressBar mProgressBar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Apply dark navy status and navigation bar styling
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            Window window = getWindow();
            window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
            window.setStatusBarColor(Color.parseColor("#0A1128"));
            window.setNavigationBarColor(Color.parseColor("#0A1128"));
        }

        setContentView(R.layout.activity_main);

        mWebView = (WebView) findViewById(R.id.webview);
        mProgressBar = (ProgressBar) findViewById(R.id.progressBar);

        configureWebView();

        String targetUrl = getString(R.string.app_url);
        mWebView.loadUrl(targetUrl);
    }

    private void configureWebView() {
        WebSettings settings = mWebView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE);
        }

        // Custom User Agent identifier
        String currentUa = settings.getUserAgentString();
        settings.setUserAgentString(currentUa + " CheckedAI-Android/1.0.3");

        // Native JS Bridge
        mWebView.addJavascriptInterface(new WebAppInterface(this), "CheckedAIBridge");

        // WebChromeClient for smooth top progress bar
        mWebView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                if (mProgressBar != null) {
                    if (newProgress < 100) {
                        mProgressBar.setVisibility(View.VISIBLE);
                        mProgressBar.setProgress(newProgress);
                    } else {
                        mProgressBar.setVisibility(View.GONE);
                    }
                }
            }
        });

        // WebViewClient with external intent & offline handling
        mWebView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url == null) return false;

                // Handle external application schemes (WhatsApp, mailto, tel, market)
                if (url.startsWith("mailto:") || url.startsWith("tel:") ||
                    url.startsWith("whatsapp:") || url.startsWith("intent:")) {
                    try {
                        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                        startActivity(intent);
                        return true;
                    } catch (Exception e) {
                        // Fallback gracefully if target application is not installed
                        return true;
                    }
                }

                // Keep app navigation internal
                view.loadUrl(url);
                return true;
            }

            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                // Load local offline assets gracefully on network disconnect
                view.loadUrl("file:///android_asset/offline.html");
            }
        });
    }

    @Override
    public void onBackPressed() {
        if (mWebView != null && mWebView.canGoBack()) {
            mWebView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (mWebView != null) {
            mWebView.onResume();
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (mWebView != null) {
            mWebView.onPause();
        }
    }

    @Override
    protected void onDestroy() {
        if (mWebView != null) {
            mWebView.destroy();
            mWebView = null;
        }
        super.onDestroy();
    }
}
EOF

cat << 'EOF' > "${BUILD_DIR}/src/org/checkedai/app/WebAppInterface.java"
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
EOF

# 7. Step 1: Compile Android resources & Binary AndroidManifest.xml (AXML) with aapt
echo "-> Compiling Android binary resources and AXML..."
aapt package -f \
  -m -J "${BUILD_DIR}/src" \
  -M "${BUILD_DIR}/AndroidManifest.xml" \
  -S "${BUILD_DIR}/res" \
  -A "${BUILD_DIR}/assets" \
  -I "$ANDROID_JAR" \
  -F "${BUILD_DIR}/unaligned.apk"

# 8. Step 2: Compile Java classes into bytecode with javac
echo "-> Compiling Java sources..."
javac -cp "${ANDROID_JAR}:${BUILD_DIR}/src" \
  -source 8 -target 8 \
  -d "${BUILD_DIR}/bin" \
  "${BUILD_DIR}/src/org/checkedai/app/R.java" \
  "${BUILD_DIR}/src/org/checkedai/app/WebAppInterface.java" \
  "${BUILD_DIR}/src/org/checkedai/app/MainActivity.java"

# 9. Step 3: Convert compiled classes into Dalvik DEX bytecode with dalvik-exchange (dx)
echo "-> Generating Dalvik DEX bytecode..."
dalvik-exchange --dex --output="${BUILD_DIR}/classes.dex" "${BUILD_DIR}/bin"

# 10. Step 4: Add classes.dex into unaligned APK
echo "-> Adding DEX bytecode to package..."
cd "${BUILD_DIR}"
aapt add unaligned.apk classes.dex

# 11. Step 5: 4-Byte ZipAlign the APK archive for Android runtime memory mapping
echo "-> Performing 4-byte zip alignment..."
zipalign -f -v 4 unaligned.apk aligned.apk

# 12. Step 6: Generate or reuse 2048-bit RSA release keystore
if [ ! -f "$KEYSTORE" ]; then
  echo "-> Generating 2048-bit RSA release signing key..."
  keytool -genkeypair -v \
    -keystore "$KEYSTORE" \
    -alias checkedai \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000 \
    -storepass checkedai2026 \
    -keypass checkedai2026 \
    -dname "CN=Checked AI, OU=Security Engineering, O=Checked AI Labs, L=San Francisco, ST=CA, C=US"
fi

# 13. Step 7: Cryptographically sign the APK with Android v1, v2, and v3 signature schemes
echo "-> Signing APK with APK Signature Scheme v1, v2, and v3..."
apksigner sign \
  --ks "$KEYSTORE" \
  --ks-pass pass:checkedai2026 \
  --ks-key-alias checkedai \
  --key-pass pass:checkedai2026 \
  --out "$OUT_APK" \
  aligned.apk

# 14. Step 8: Verify APK with aapt and apksigner
echo "-> Verifying final production APK with apksigner..."
apksigner verify --verbose "$OUT_APK"

echo "-> Inspecting APK badging with aapt..."
aapt dump badging "$OUT_APK" | head -n 12

FINAL_SIZE=$(stat -c%s "$OUT_APK")
FINAL_SHA=$(sha256sum "$OUT_APK" | awk '{print $1}')

echo "=== BUILD SUCCESSFUL ==="
echo "Artifact: $OUT_APK"
echo "Size: $FINAL_SIZE bytes"
echo "SHA-256: $FINAL_SHA"

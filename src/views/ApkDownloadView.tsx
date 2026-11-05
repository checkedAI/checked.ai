import React, { useState } from 'react';
import {
  Smartphone,
  Download,
  ShieldCheck,
  Check,
  Copy,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Info,
  Terminal,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { MobileAppSimulator } from '../components/MobileAppSimulator';

export const ApkDownloadView: React.FC = () => {
  const [copiedSha, setCopiedSha] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const apkData = {
    appName: 'Checked AI',
    fileName: 'checked-ai-v1.0.3-release.apk',
    version: '1.0.3',
    versionCode: 103,
    size: '113 KB',
    packageName: 'org.checkedai.app',
    minAndroid: 'Android 5.0+ (API 21+)',
    targetAndroid: 'Android 14 (API 34)',
    sha256: 'c631f5e15e06a9e574c2afb3c26b97c4520f7a1c841fb0706856cdeed48271c0',
    releaseDate: 'November 1, 2026',
    downloadUrl: '/api/v1/download/apk'
  };

  const handleCopySha = () => {
    navigator.clipboard.writeText(apkData.sha256);
    setCopiedSha(true);
    setTimeout(() => setCopiedSha(false), 2000);
  };

  const handleTriggerDownload = () => {
    setDownloading(true);
    const link = document.createElement('a');
    link.href = apkData.downloadUrl;
    link.setAttribute('download', apkData.fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloading(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
          <Smartphone className="w-4 h-4" />
          <span>Checked AI · Android Mobile Release Center</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Download Checked AI APK for Android
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
          Verify digital content, detect AI deepfakes, and check suspicious URLs directly on your Android phone or tablet. Fast, lightweight, and privacy-first.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: APK download card and details (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Download Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900 leading-tight">
                      Checked AI Mobile
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      v{apkData.version}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    {apkData.packageName}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200/80">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Verified Release Build</span>
              </div>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[11px] font-medium text-slate-400">File Size</div>
                <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">{apkData.size}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[11px] font-medium text-slate-400">Target OS</div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">Android 5.0 – 14+</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[11px] font-medium text-slate-400">Architecture</div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">Universal (All CPUs)</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[11px] font-medium text-slate-400">Release Date</div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">Nov 2026</div>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="space-y-2">
              <button
                onClick={handleTriggerDownload}
                disabled={downloading}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-md transition-all flex items-center justify-center gap-2.5"
              >
                <Download className="w-5 h-5 text-white" />
                <span>{downloading ? 'Downloading APK Package...' : `Download ${apkData.fileName} (${apkData.size})`}</span>
              </button>

              <div className="text-center text-[11px] text-slate-500">
                Direct download from Checked AI secure CDN · Zero telemetry tracking
              </div>
            </div>

            {/* SHA-256 Checksum */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Cryptographic SHA-256 Fingerprint:</span>
                <button
                  onClick={handleCopySha}
                  className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
                >
                  {copiedSha ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSha ? 'Copied' : 'Copy Hash'}</span>
                </button>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-100 font-mono text-[11px] text-slate-700 break-all select-all border border-slate-200">
                {apkData.sha256}
              </div>
            </div>
          </div>

          {/* How to Install 3-Step Guide */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-blue-600" />
              <span>How to Install on Your Android Device</span>
            </h3>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </div>
                <div>
                  <div className="font-bold text-slate-900">Download the APK file</div>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Tap the Download button above or scan the QR code using your phone's camera.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </div>
                <div>
                  <div className="font-bold text-slate-900">Allow installation from unknown sources</div>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    If prompted by Chrome or Files, navigate to <strong>Settings &gt; Security &gt; Install Unknown Apps</strong> and toggle Allow for this source.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </div>
                <div>
                  <div className="font-bold text-slate-900">Launch and Verify</div>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Open the downloaded APK from your notifications tray, tap Install, and launch Checked AI.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Release Notes */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              What's New in Version {apkData.version}
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Trust Score Gauge:</strong> Fast 0-100 authenticity score with likely real / synthetic classification.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Multi-Risk Dials:</strong> Independent metric breakdowns for AI Probability, Manipulation Risk, and Scam Risk.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Website Phishing Guard:</strong> Real-time anti-SSRF domain reputation analysis.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Offline Verification Vault:</strong> Secure local audit trail retention with biometric authentication.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right column: Interactive Mobile App Simulator (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center space-y-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-full mb-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Interactive App Preview</span>
            </div>
            <p className="text-xs text-slate-500">
              Test the mobile interface right in your browser
            </p>
          </div>

          <MobileAppSimulator onDownloadApk={handleTriggerDownload} />
        </div>
      </div>
    </div>
  );
};

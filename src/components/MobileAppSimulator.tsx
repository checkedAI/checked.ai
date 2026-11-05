import React, { useState } from 'react';
import {
  ShieldCheck,
  Bell,
  Search,
  Scan,
  Image as ImageIcon,
  FileText,
  Globe,
  Video,
  Mic,
  History,
  Home,
  Plus,
  User,
  ChevronRight,
  ArrowLeft,
  Share2,
  Download,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Link2,
  Check,
  Settings,
  HelpCircle,
  Bookmark,
  Smartphone,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

export type MobileScreen =
  | 'home'
  | 'result'
  | 'text'
  | 'website'
  | 'history'
  | 'alerts'
  | 'profile'
  | 'signin';

export const MobileAppSimulator: React.FC<{ onDownloadApk?: () => void }> = ({ onDownloadApk }) => {
  const [currentScreen, setCurrentScreen] = useState<MobileScreen>('home');
  const [activeNav, setActiveNav] = useState<'home' | 'history' | 'alerts' | 'profile'>('home');
  const [textInput, setTextInput] = useState('Artificial intelligence is transforming the world. It is changing the way we live, work, and communicate. With the power of machine learning and data, AI can help solve complex problems and improve decision making.');
  const [textTab, setTextTab] = useState<'paste' | 'upload'>('paste');
  const [urlInput, setUrlInput] = useState('https://example-website.com');
  const [historyFilter, setHistoryFilter] = useState<'all' | 'image' | 'text' | 'website'>('all');
  const [alertFilter, setAlertFilter] = useState<'all' | 'scam' | 'security' | 'system'>('all');
  const [copied, setCopied] = useState(false);

  const navigateTo = (screen: MobileScreen, nav?: 'home' | 'history' | 'alerts' | 'profile') => {
    setCurrentScreen(screen);
    if (nav) setActiveNav(nav);
  };

  const handleDownload = () => {
    if (onDownloadApk) {
      onDownloadApk();
    } else {
      window.location.href = '/api/v1/download/apk';
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Android Device Casing (Replacing iPhone notch/Dynamic Island) */}
      <div className="relative w-[360px] sm:w-[380px] h-[780px] bg-slate-950 rounded-[44px] p-3 shadow-2xl border-4 border-slate-800 ring-1 ring-slate-700/50 flex flex-col overflow-hidden">
        {/* Android Front Camera Punch-hole */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-slate-900 rounded-full z-30 ring-1 ring-slate-800 flex items-center justify-center shadow-inner">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
        </div>

        {/* Screen inner container */}
        <div className="relative w-full h-full bg-[#F8FAFC] rounded-[36px] overflow-hidden flex flex-col text-slate-900 select-none">
          {/* Android Status Bar */}
          <div className="h-9 pt-1.5 px-6 flex items-center justify-between text-[11px] font-semibold text-slate-700 shrink-0 z-20">
            <span>9:35 PM</span>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-mono">
              <svg className="w-3.5 h-3.5 text-slate-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4z"/>
              </svg>
              <svg className="w-3.5 h-3.5 text-slate-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2 22h20V2L2 22z"/>
              </svg>
              <span>100%</span>
            </div>
          </div>

          {/* Screen Content Viewport */}
          <div className="flex-1 overflow-y-auto px-4 pb-20 pt-1">
            {/* SCREEN 1: HOME */}
            {currentScreen === 'home' && (
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
                      <ShieldCheck className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 leading-tight">
                        Checked <span className="text-blue-600">AI</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        Verify Before You Trust
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigateTo('alerts', 'alerts')}
                    className="relative p-2 rounded-full hover:bg-slate-100 transition-colors"
                  >
                    <Bell className="w-5 h-5 text-slate-700" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
                  </button>
                </div>

                {/* Welcome Message */}
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    Welcome back!
                  </h2>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    Verify Before You Trust. Analyze AI-generated images, videos, text, websites, and online scams with intelligent verification powered by Checked AI.
                  </p>
                </div>

                {/* Search / Paste Input */}
                <div
                  onClick={() => navigateTo('text')}
                  className="flex items-center gap-2.5 p-3 bg-white rounded-2xl border border-slate-200/90 shadow-xs cursor-pointer hover:border-blue-400 transition-all"
                >
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-xs text-slate-400 truncate flex-1">
                    Paste text, website URL or upload a file...
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Scan className="w-4 h-4" />
                  </div>
                </div>

                {/* 6 Grid Module Cards */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  {/* Image Check */}
                  <div
                    onClick={() => navigateTo('result')}
                    className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between h-36"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 leading-tight">
                        Image Check
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">
                        Detect AI generated or manipulated images
                      </div>
                    </div>
                    <div className="flex justify-end pt-1">
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>

                  {/* Text Check */}
                  <div
                    onClick={() => navigateTo('text')}
                    className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between h-36"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 leading-tight">
                        Text Check
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">
                        Check if text is AI generated or scam
                      </div>
                    </div>
                    <div className="flex justify-end pt-1">
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>

                  {/* Website Check */}
                  <div
                    onClick={() => navigateTo('website')}
                    className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-purple-300 transition-all cursor-pointer flex flex-col justify-between h-36"
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 leading-tight">
                        Website Check
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">
                        Check website safety, scam or phishing
                      </div>
                    </div>
                    <div className="flex justify-end pt-1">
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>

                  {/* Video Check */}
                  <div
                    onClick={() => navigateTo('result')}
                    className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-amber-300 transition-all cursor-pointer flex flex-col justify-between h-36 active:scale-[0.98]"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
                      <Video className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 leading-tight">
                        Video Check
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">
                        Detect deepfake or AI generated videos
                      </div>
                    </div>
                    <div className="flex justify-end pt-1">
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>

                  {/* Voice Check */}
                  <div
                    onClick={() => navigateTo('result')}
                    className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-rose-300 transition-all cursor-pointer flex flex-col justify-between h-36 active:scale-[0.98]"
                  >
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2">
                      <Mic className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 leading-tight">
                        Voice Check
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">
                        Detect AI generated or cloned voices
                      </div>
                    </div>
                    <div className="flex justify-end pt-1">
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>

                  {/* History */}
                  <div
                    onClick={() => navigateTo('history', 'history')}
                    className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between h-36"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                      <History className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 leading-tight">
                        History
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">
                        View your previous checks and results
                      </div>
                    </div>
                    <div className="flex justify-end pt-1">
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>
                </div>

                {/* Direct APK Download Banner */}
                <div
                  onClick={handleDownload}
                  className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white shadow-sm flex items-center justify-between cursor-pointer hover:opacity-95 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <Smartphone className="w-5 h-5 text-white" />
                    <div>
                      <div className="text-xs font-bold leading-tight">
                        Download Checked AI APK
                      </div>
                      <div className="text-[10px] text-blue-100">
                        Version 1.0.3 · Android 9.0+
                      </div>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-white" />
                </div>
              </div>
            )}

            {/* SCREEN 2: IMAGE CHECK RESULT */}
            {currentScreen === 'result' && (
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => navigateTo('home', 'home')}
                    className="p-1 -ml-1 text-slate-700 hover:text-slate-900"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-sm font-bold text-slate-900">
                    Image Check Result
                  </h2>
                  <button className="p-1 text-slate-700 hover:text-slate-900">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Trust Score Card */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-500 font-medium">
                        Trust Score
                      </div>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-3xl font-extrabold text-emerald-600 font-mono tabular-nums">
                          87
                        </span>
                        <span className="text-sm font-bold text-slate-400 font-mono">
                          /100
                        </span>
                      </div>
                      <div className="mt-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
                          Likely Real
                        </span>
                      </div>
                    </div>

                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
                      <ShieldCheck className="w-9 h-9" />
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    This image is likely real. No strong evidence of AI generation was found.
                  </p>

                  {/* 3 Metric Cards */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-medium">AI Prob.</div>
                      <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">18%</div>
                      <div className="text-[9px] text-emerald-600 font-bold mt-0.5">Low</div>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-medium">Manip. Risk</div>
                      <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">27%</div>
                      <div className="text-[9px] text-emerald-600 font-bold mt-0.5">Low</div>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-medium">Scam Risk</div>
                      <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">9%</div>
                      <div className="text-[9px] text-emerald-600 font-bold mt-0.5">Very Low</div>
                    </div>
                  </div>
                </div>

                {/* Analysis Details */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 space-y-2.5">
                  <div className="text-xs font-bold text-slate-900">
                    Analysis Details
                  </div>
                  <div className="space-y-2 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>No clear AI generation patterns detected.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Metadata looks consistent.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>No signs of splicing or cloning.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Image compression is natural.</span>
                    </div>
                  </div>
                </div>

                {/* Preview Image */}
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-slate-900">Preview</div>
                  <div className="rounded-2xl overflow-hidden border border-slate-200">
                    <img
                      src="/src/assets/images/sample_genuine_landscape_1793250193129.jpg"
                      alt="Analyzed Landscape Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-32 object-cover"
                    />
                  </div>
                </div>

                {/* Bottom Buttons */}
                <div className="flex gap-2.5 pt-2">
                  <button
                    onClick={() => alert('PDF report generation triggered in Checked AI mobile core.')}
                    className="flex-1 py-2.5 px-3 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-600" />
                    <span>Download Report</span>
                  </button>

                  <button
                    onClick={() => navigateTo('home', 'home')}
                    className="flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                  >
                    Check Another
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 3: TEXT CHECK */}
            {currentScreen === 'text' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigateTo('home', 'home')}
                    className="p-1 -ml-1 text-slate-700 hover:text-slate-900"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-sm font-bold text-slate-900">Text Check</h2>
                </div>

                {/* Segmented control */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTextTab('paste')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                      textTab === 'paste'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700'
                    }`}
                  >
                    Paste Text
                  </button>
                  <button
                    onClick={() => setTextTab('upload')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                      textTab === 'upload'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700'
                    }`}
                  >
                    Upload File
                  </button>
                </div>

                {/* Text Input area */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 space-y-2">
                  <textarea
                    rows={6}
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    className="w-full text-xs text-slate-800 focus:outline-none resize-none leading-relaxed"
                  />
                  <div className="text-right text-[11px] font-mono text-slate-400">
                    {textInput.length}/5000
                  </div>
                </div>

                <button
                  onClick={() => navigateTo('result')}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  Check Text
                </button>

                {/* Tips */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-blue-600 text-xs">
                    <Lightbulb className="w-4 h-4" />
                    <span>Tips for better results</span>
                  </div>
                  <ul className="space-y-1 text-slate-600 text-[11px]">
                    <li>• Use longer text for more accurate results.</li>
                    <li>• Avoid grammatical errors.</li>
                    <li>• Check multiple sources if unsure.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* SCREEN 4: WEBSITE CHECK */}
            {currentScreen === 'website' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigateTo('home', 'home')}
                    className="p-1 -ml-1 text-slate-700 hover:text-slate-900"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-sm font-bold text-slate-900">Website Check</h2>
                </div>

                <div>
                  <div className="text-xs text-slate-600 font-semibold mb-1">Enter URL</div>
                  <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
                    <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
                    <input
                      type="text"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className="text-xs text-slate-800 w-full focus:outline-none font-mono"
                    />
                    <Link2 className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                </div>

                <button
                  onClick={() => navigateTo('result')}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  Check Website
                </button>

                {/* Recent Checks */}
                <div className="space-y-2 pt-1">
                  <div className="text-xs font-bold text-slate-900">Recent Checks</div>
                  <div className="space-y-2">
                    {[
                      { domain: 'example-website.com', time: '2 min ago', status: 'Safe', color: 'text-emerald-700 bg-emerald-50' },
                      { domain: 'freerewards-now.com', time: '1 hour ago', status: 'Dangerous', color: 'text-rose-700 bg-rose-50' },
                      { domain: 'bestcrypto-invest.com', time: '3 hours ago', status: 'Suspicious', color: 'text-amber-700 bg-amber-50' },
                      { domain: 'news-update.io', time: '1 day ago', status: 'Safe', color: 'text-emerald-700 bg-emerald-50' },
                      { domain: 'claim-prize-today.net', time: '2 days ago', status: 'Dangerous', color: 'text-rose-700 bg-rose-50' }
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white rounded-xl border border-slate-200/90 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <Globe className="w-4 h-4 text-slate-400" />
                          <div>
                            <div className="text-xs font-bold text-slate-800">{item.domain}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{item.time}</div>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.color}`}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN 5: HISTORY */}
            {currentScreen === 'history' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigateTo('home', 'home')}
                    className="p-1 -ml-1 text-slate-700 hover:text-slate-900"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-sm font-bold text-slate-900">History</h2>
                </div>

                {/* Filter tabs */}
                <div className="flex items-center gap-1 p-1 bg-slate-200/60 rounded-xl text-xs font-semibold">
                  {(['all', 'image', 'text', 'website'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setHistoryFilter(tab)}
                      className={`flex-1 py-1.5 rounded-lg capitalize transition-colors ${
                        historyFilter === tab
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* History list */}
                <div className="space-y-2.5">
                  <div
                    onClick={() => navigateTo('result')}
                    className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src="/src/assets/images/sample_genuine_landscape_1793250193129.jpg"
                        alt="Thumbnail"
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900">Image Check</div>
                        <div className="text-[11px] font-mono text-emerald-600 font-bold">87/100</div>
                        <div className="text-[10px] text-slate-400">Today, 10:30 AM</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Text Check</div>
                        <div className="text-[11px] font-mono text-emerald-600 font-bold">78/100</div>
                        <div className="text-[10px] text-slate-400">Today, 09:15 AM</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                        <Globe className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Website Check</div>
                        <div className="text-[11px] font-mono text-rose-600 font-bold">42/100</div>
                        <div className="text-[10px] text-slate-400">Yesterday, 08:45 PM</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src="/src/assets/images/sample_synthetic_portrait_1793250192276.jpg"
                        alt="Thumbnail"
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900">Image Check</div>
                        <div className="text-[11px] font-mono text-emerald-600 font-bold">92/100</div>
                        <div className="text-[10px] text-slate-400">Yesterday, 02:20 PM</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN 6: ALERTS */}
            {currentScreen === 'alerts' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-900">Alerts</h2>
                  <span className="text-[11px] text-blue-600 font-semibold cursor-pointer">Mark all</span>
                </div>

                {/* Filter tabs */}
                <div className="flex items-center gap-1 p-1 bg-slate-200/60 rounded-xl text-xs font-semibold">
                  {(['all', 'scam', 'security', 'system'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setAlertFilter(tab)}
                      className={`flex-1 py-1.5 rounded-lg capitalize transition-colors ${
                        alertFilter === tab
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 bg-white rounded-xl border border-slate-200/90 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-900">Phishing Website Detected</div>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                        The website example-phish.com is dangerous and may steal your data.
                      </p>
                      <div className="text-[10px] text-slate-400 font-mono mt-1">10 min ago</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 self-center" />
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200/90 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-900">Suspicious Text Detected</div>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                        The text you checked is similar to known scam patterns.
                      </p>
                      <div className="text-[10px] text-slate-400 font-mono mt-1">2 hours ago</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 self-center" />
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200/90 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-900">System Update</div>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                        Checked AI updated to v1.0.3 with enhanced neural artifact models.
                      </p>
                      <div className="text-[10px] text-slate-400 font-mono mt-1">1 day ago</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 self-center" />
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN 7: PROFILE */}
            {currentScreen === 'profile' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-900">Profile</h2>
                  <Settings className="w-4 h-4 text-slate-600" />
                </div>

                {/* User Card */}
                <div className="p-4 bg-gradient-to-tr from-blue-700 to-indigo-600 rounded-2xl text-white shadow-sm flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-white font-bold text-lg">
                    <ShieldCheck className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">John Doe</h3>
                    <div className="text-[11px] text-blue-100 font-mono">john.doe@email.com</div>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-amber-950">
                      👑 Premium
                    </span>
                  </div>
                </div>

                {/* Usage meter */}
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>Usage This Month</span>
                    <span className="font-mono text-blue-600">23 / 1000 checks</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-[23%] h-full bg-blue-600 rounded-full" />
                  </div>
                </div>

                {/* Profile menu items */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                  <div className="p-3 flex items-center justify-between hover:bg-slate-50 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <Bookmark className="w-4 h-4 text-blue-600" />
                      <div>
                        <div>Subscription</div>
                        <div className="text-[10px] text-slate-400 font-normal">Manage your plan</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>

                  <div className="p-3 flex items-center justify-between hover:bg-slate-50 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <div>
                        <div>Saved Reports</div>
                        <div className="text-[10px] text-slate-400 font-normal">View your saved reports</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>

                  <div className="p-3 flex items-center justify-between hover:bg-slate-50 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <Settings className="w-4 h-4 text-slate-600" />
                      <div>
                        <div>Preferences</div>
                        <div className="text-[10px] text-slate-400 font-normal">App preferences</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>

                  <div className="p-3 flex items-center justify-between hover:bg-slate-50 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <HelpCircle className="w-4 h-4 text-amber-600" />
                      <div>
                        <div>Help & Support</div>
                        <div className="text-[10px] text-slate-400 font-normal">Get help and contact support</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>

                  <div
                    onClick={handleDownload}
                    className="p-3 flex items-center justify-between hover:bg-blue-50/50 cursor-pointer text-blue-600 font-bold"
                  >
                    <div className="flex items-center gap-2.5">
                      <Smartphone className="w-4 h-4 text-blue-600" />
                      <div>
                        <div>Download Android APK</div>
                        <div className="text-[10px] text-slate-500 font-normal">checked-ai-v1.0.3-release.apk (18.4 MB)</div>
                      </div>
                    </div>
                    <Download className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Navigation Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200/90 px-4 flex items-center justify-around z-30">
            <button
              onClick={() => navigateTo('home', 'home')}
              className={`flex flex-col items-center gap-1 ${
                activeNav === 'home' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px] font-semibold">Home</span>
            </button>

            <button
              onClick={() => navigateTo('history', 'history')}
              className={`flex flex-col items-center gap-1 ${
                activeNav === 'history' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <History className="w-5 h-5" />
              <span className="text-[10px] font-semibold">History</span>
            </button>

            {/* Center (+) Action Button */}
            <button
              onClick={() => navigateTo('text')}
              className="w-11 h-11 -mt-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-transform active:scale-95"
            >
              <Plus className="w-6 h-6" />
            </button>

            <button
              onClick={() => navigateTo('alerts', 'alerts')}
              className={`flex flex-col items-center gap-1 ${
                activeNav === 'alerts' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Bell className="w-5 h-5" />
              <span className="text-[10px] font-semibold">Alerts</span>
            </button>

            <button
              onClick={() => navigateTo('profile', 'profile')}
              className={`flex flex-col items-center gap-1 ${
                activeNav === 'profile' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-[10px] font-semibold">Profile</span>
            </button>
          </div>

          {/* Android System Navigation Bar (Back, Home, Recents) */}
          <div className="h-8 bg-[#F8FAFC] flex items-center justify-around px-16 text-slate-400 select-none border-t border-slate-100 shrink-0">
            {/* Back button (triangle pointing left) */}
            <div className="w-4 h-4 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 12H5m7 7l-7-7 7-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </div>
            {/* Home button (circle) */}
            <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-500" />
            {/* Recents button (rounded square) */}
            <div className="w-3.5 h-3.5 rounded-xs border-2 border-slate-500" />
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
        <span className="font-semibold text-slate-700">Checked AI Mobile v1.0.3</span>
        <span>·</span>
        <button
          onClick={handleDownload}
          className="text-blue-600 font-bold hover:underline inline-flex items-center gap-1"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Save APK file</span>
        </button>
      </div>
    </div>
  );
};

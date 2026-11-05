import React, { useState } from 'react';
import {
  X,
  FileText,
  Image as ImageIcon,
  Globe,
  Video,
  Mic,
  FileCheck2,
  Zap,
  ArrowRight,
  Smartphone
} from 'lucide-react';
import { NavTab } from './Sidebar';

interface QuickScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: NavTab) => void;
  onQuickTextScan: (text: string) => Promise<void>;
  onQuickUrlScan: (url: string) => Promise<void>;
}

export const QuickScanModal: React.FC<QuickScanModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onQuickTextScan,
  onQuickUrlScan,
}) => {
  const [mode, setMode] = useState<'text' | 'url'>('text');
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    setLoading(true);
    try {
      if (mode === 'text') {
        await onQuickTextScan(inputVal);
      } else {
        await onQuickUrlScan(inputVal);
      }
      setInputVal('');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleJump = (tab: NavTab) => {
    onSelectTab(tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Initiate New Verification Scan
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verify digital content authenticity or online security threats.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setMode('text')}
            className={`flex-1 py-1.5 rounded-md transition-colors ${
              mode === 'text' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Quick Text Check
          </button>
          <button
            onClick={() => setMode('url')}
            className={`flex-1 py-1.5 rounded-md transition-colors ${
              mode === 'url' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Quick URL Safety
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'text' ? (
            <textarea
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Paste text to inspect for generative AI writing heuristics..."
              rows={4}
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed text-slate-800"
            />
          ) : (
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="https://example.com/login"
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-slate-800"
            />
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !inputVal.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:pointer-events-none rounded-lg shadow-xs transition-colors"
            >
              {loading ? (
                <span>Analyzing...</span>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5" />
                  <span>Execute Scan</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Specialized upload shortcuts */}
        <div className="pt-3 border-t border-slate-100">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Or launch specialized media detector
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleJump('image')}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 text-left transition-all flex items-center gap-2 text-slate-700"
            >
              <ImageIcon className="w-4 h-4 text-indigo-600" />
              <span>Image AI Check</span>
            </button>
            <button
              onClick={() => handleJump('video')}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 text-left transition-all flex items-center gap-2 text-slate-700"
            >
              <Video className="w-4 h-4 text-indigo-600" />
              <span>Video Deepfake</span>
            </button>
            <button
              onClick={() => handleJump('file')}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 text-left transition-all flex items-center gap-2 text-slate-700"
            >
              <FileCheck2 className="w-4 h-4 text-indigo-600" />
              <span>Document Shield</span>
            </button>
            <button
              onClick={() => handleJump('audio')}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 text-left transition-all flex items-center gap-2 text-slate-700"
            >
              <Mic className="w-4 h-4 text-indigo-600" />
              <span>Audio Synthesis</span>
            </button>
          </div>

          <button
            onClick={() => handleJump('apk')}
            className="w-full mt-2.5 p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 text-xs font-semibold flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-blue-600" />
              <span>Download Checked AI Android App (APK v1.0.3)</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

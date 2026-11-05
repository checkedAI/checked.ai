import React, { useState } from 'react';
import {
  FileText,
  Clipboard,
  Trash2,
  Zap,
  Info,
  Check,
  AlertCircle,
  Copy,
  Download,
  Sparkles
} from 'lucide-react';
import { ScanResult } from '../types';
import { ResultCard } from '../components/ResultCard';

interface TextCheckViewProps {
  onScanText: (text: string, title?: string) => Promise<ScanResult>;
  onOpenReportModal: (scan: ScanResult) => void;
}

const SAMPLE_TEXTS = {
  aiEssay: `Artificial intelligence has undeniably revolutionized the modern workforce by optimizing workflows and fostering unprecedented collaboration across diverse industries. Furthermore, it is important to note that machine learning algorithms continually streamline complex analytical pipelines, delivering seamless operational agility. In conclusion, the synergistic interplay between human creativity and autonomous systems represents a transformative testament to technological innovation in the digital era.`,
  humanAcademic: `We measured dielectric breakdown voltages across twelve 0.25mm alumina substrate coupons under ambient laboratory humidity (44 ± 2% RH). Contrary to the prediction by Henderson & Wu (2019), breakdown occurred at 14.2 kV/mm rather than the expected 18.0 kV/mm threshold. We suspect micro-void entrapment during rapid sintering caused localized field distortion. Further scanning electron microscopy is ongoing to verify pore density.`,
  phishingText: `URGENT SECURITY NOTICE: Your corporate account access will be terminated within 24 hours due to anomalous cryptographic handshake failure. Please proceed immediately to verify your multi-factor security credentials through the link below to preserve mailbox continuity.`
};

export const TextCheckView: React.FC<TextCheckViewProps> = ({
  onScanText,
  onOpenReportModal
}) => {
  const [inputText, setInputText] = useState('');
  const [docTitle, setDocTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('Tokenizing input...');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cleanText = inputText.trim();
  const wordCount = cleanText ? cleanText.split(/\s+/).filter(Boolean).length : 0;
  const charCount = inputText.length;
  const sentences = cleanText ? cleanText.split(/[.!?]+/).map(s => s.trim()).filter(Boolean) : [];
  const sentenceCount = sentences.length;
  const readingTimeMin = (wordCount / 200).toFixed(1);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputText(text);
        setError(null);
      }
    } catch {
      // Fallback if clipboard API is restricted
      setError('Clipboard access was blocked by the browser. Please paste directly into the box.');
    }
  };

  const handleClear = () => {
    setInputText('');
    setDocTitle('');
    setResult(null);
    setError(null);
  };

  const handleSelectSample = (key: keyof typeof SAMPLE_TEXTS) => {
    setInputText(SAMPLE_TEXTS[key]);
    setDocTitle(
      key === 'aiEssay'
        ? 'AI Generated Technology Synthesis.txt'
        : key === 'humanAcademic'
          ? 'Empirical Physics Lab Journal.txt'
          : 'Suspicious Urgent Account Alert.txt'
    );
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      setError('Please enter or paste text to analyze. Empty input cannot be evaluated.');
      return;
    }

    if (inputText.trim().length < 30) {
      setError(
        `Text input contains only ${inputText.trim().length} characters. A minimum of 30 characters is required for reliable statistical variance and perplexity heuristics.`
      );
      return;
    }

    if (inputText.length > 35000) {
      setError('Text input exceeds the 35,000 character limit. Please submit a shorter excerpt.');
      return;
    }

    setLoading(true);
    setError(null);
    setLoadingStep('Tokenizing input & measuring sentence burstiness...');

    const stepTimer1 = setTimeout(() => {
      setLoadingStep('Analyzing token perplexity & n-gram repetitions...');
    }, 400);

    const stepTimer2 = setTimeout(() => {
      setLoadingStep('Evaluating generative transition markers & syntax balance...');
    }, 850);

    try {
      const scanRes = await onScanText(inputText, docTitle || undefined);
      setResult(scanRes);
    } catch (err: any) {
      setError(err.message || 'Text analysis failed. Please verify your input and retry.');
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Page Title */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
          <FileText className="w-4 h-4" />
          <span>Checked AI · Forensic Linguistic & Perplexity Engine</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Text AI Detection & Authorship Heuristics
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
          Evaluate text samples for syntactic uniformity, token perplexity distribution, formulaic generative transitions, and burstiness cadence.
        </p>
      </div>

      {/* Input Box Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              placeholder="Optional Document Name (e.g. Essay_Draft.txt)"
              className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 w-64"
            />
          </div>

          {/* Sample quick selectors */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">Load sample:</span>
            <button
              type="button"
              onClick={() => handleSelectSample('aiEssay')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-md transition-colors"
            >
              AI Essay
            </button>
            <button
              type="button"
              onClick={() => handleSelectSample('humanAcademic')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-md transition-colors"
            >
              Human Paper
            </button>
            <button
              type="button"
              onClick={() => handleSelectSample('phishingText')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-md transition-colors"
            >
              Phishing Notice
            </button>
          </div>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              if (error) setError(null);
            }}
            rows={10}
            placeholder="Paste or write text here to analyze for artificial intelligence indicators (minimum 30 characters)..."
            className="w-full p-4 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans leading-relaxed text-slate-800 placeholder:text-slate-400 transition-all"
          />
        </div>

        {/* Counters & Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          {/* Statistics */}
          <div className="flex items-center gap-3 text-xs text-slate-500 font-mono flex-wrap">
            <span className="tabular-nums">
              <strong className="text-slate-800 font-bold">{wordCount}</strong> words
            </span>
            <span>·</span>
            <span className="tabular-nums">
              <strong className="text-slate-800 font-bold">{charCount}</strong> characters
            </span>
            <span>·</span>
            <span className="tabular-nums">
              <strong className="text-slate-800 font-bold">{sentenceCount}</strong> sentences
            </span>
            <span>·</span>
            <span className="tabular-nums">
              ~<strong className="text-slate-800 font-bold">{readingTimeMin}</strong> min read
            </span>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePaste}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <Clipboard className="w-3.5 h-3.5" />
              <span>Paste Text</span>
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Text</span>
            </button>

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:pointer-events-none rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{loadingStep}</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Analyze Text</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Validation / Error Message */}
        {error && (
          <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span className="font-medium">{error}</span>
          </div>
        )}
      </div>

      {/* Probabilistic Boundary Warning Banner */}
      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200/90 text-slate-700 text-xs flex items-start gap-3">
        <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <div className="font-semibold text-slate-900">
            Crucial Transparency Notice: Probabilistic Verification
          </div>
          <p className="text-slate-600 leading-relaxed">
            Checked AI detection results are probabilistic estimations based on linguistic burstiness, token distribution, and syntax balance. Machine detection cannot prove AI or human authorship with mathematical certainty and may produce false positives on technical, legal, or non-native writing.
          </p>
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Structured Forensic Verification Report
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              Saved to persistent Scan History
            </span>
          </div>
          <ResultCard result={result} onOpenReportModal={onOpenReportModal} />
        </div>
      )}
    </div>
  );
};

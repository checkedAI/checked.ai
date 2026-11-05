import React, { useState } from 'react';
import {
  Globe,
  Shield,
  ShieldAlert,
  AlertTriangle,
  Lock,
  ExternalLink,
  Zap,
  Info,
  CheckCircle2,
  Server
} from 'lucide-react';
import { ScanResult } from '../types';
import { ResultCard } from '../components/ResultCard';

interface WebsiteCheckViewProps {
  onScanWebsite: (url: string) => Promise<ScanResult>;
  onOpenReportModal: (scan: ScanResult) => void;
}

const SAMPLE_URLS = [
  { label: 'Legitimate Corporate Portal', url: 'https://www.github.com' },
  { label: 'Deceptive Phishing Domain (Homoglyph)', url: 'https://secure-acc0unt-verify-chase.info/login' },
  { label: 'Insecure Protocol & High-Risk TLD', url: 'http://auth-renewal-services.top/session' }
];

export const WebsiteCheckView: React.FC<WebsiteCheckViewProps> = ({
  onScanWebsite,
  onOpenReportModal
}) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!url.trim()) return;

    // Client-side quick check
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setError('Please provide a full URL including the protocol (http:// or https://)');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const scanRes = await onScanWebsite(url.trim());
      setResult(scanRes);
    } catch (err: any) {
      setError(err.message || 'Website safety analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
          <Globe className="w-4 h-4" />
          <span>Checked AI · Threat Intelligence & SSRF-Protected Crawler</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Website Safety & Phishing Verification
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
          Inspect web domains for typosquatting homoglyphs, brand impersonation, newly registered infrastructure, SSL/TLS baseline validity, and threat intelligence reputation.
        </p>
      </div>

      {/* Input Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div className="text-xs text-slate-500 font-medium">
            Protected inspection: <span className="font-semibold text-slate-700">SSRF Isolated Sandbox Engine</span>
          </div>

          {/* Sample quick selectors */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">Try Sample:</span>
            {SAMPLE_URLS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setUrl(sample.url);
                  setError(null);
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-md transition-colors"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleScan} className="space-y-4">
          <div className="relative">
            <Globe className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError(null);
              }}
              placeholder="https://example.com/login"
              className="w-full pl-12 pr-4 py-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-slate-800 placeholder:text-slate-400 transition-all"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Server className="w-4 h-4 text-emerald-600" />
              <span>Strict anti-SSRF enforcement: Localhost, RFC 1918, and metadata IPs strictly blocked.</span>
            </div>

            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:pointer-events-none rounded-lg shadow-xs transition-colors shrink-0"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Inspecting Domain Safety...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Inspect Website</span>
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Architecture and SSRF Safeguard Callout */}
      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200/90 text-slate-700 text-xs flex items-start gap-3">
        <Shield className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-semibold text-slate-900">
            Secure Isolated URL Inspection Standard
          </div>
          <p className="text-slate-600 leading-relaxed">
            In accordance with cybersecurity best practices, Checked AI does not trigger client-side browser navigation to suspect web addresses. Threat evaluation occurs in an air-gapped server environment with strict protections against private intranet discovery, malicious drive-by payloads, and deceptive redirects.
          </p>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Domain Threat Evaluation Report
          </h2>
          <ResultCard result={result} onOpenReportModal={onOpenReportModal} />
        </div>
      )}
    </div>
  );
};

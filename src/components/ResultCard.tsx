import React, { useState } from 'react';
import {
  Copy,
  Check,
  Printer,
  Info,
  Clock,
  Cpu,
  Shield,
  FileText,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Download
} from 'lucide-react';
import { ScanResult } from '../types';
import { StatusBadge } from './StatusBadge';

interface ResultCardProps {
  result: ScanResult;
  onOpenReportModal?: (scan: ScanResult) => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, onOpenReportModal }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyReport = () => {
    const textReport = `=========================================
CHECKED AI - FORENSIC VERIFICATION REPORT
Tagline: Verify Before You Trust.
=========================================
Target: ${result.targetName}
Scan ID: ${result.id}
Date: ${new Date(result.createdAt).toLocaleString()}
Type: ${result.type.toUpperCase()}
Assessment: ${result.status.replace(/_/g, ' ').toUpperCase()}
Confidence Score: ${result.confidenceScore !== undefined ? `${result.confidenceScore}%` : 'N/A (Probabilistic)'}
Model Connected: ${result.modelUsed} (${result.isDemoMode ? 'Demo Mode' : 'Live Neural Engine'})

SUMMARY:
${result.summary}

DETAILED EXPLANATION:
${result.explanation}

DETECTED SIGNALS & EVIDENCE:
${result.indicators.map(ind => `• [${ind.status.toUpperCase()}] ${ind.name}: ${ind.detail}`).join('\n')}

MODEL LIMITATIONS & ETHICAL NOTICE:
${result.limitations.map(lim => `• ${lim}`).join('\n')}

Notice: Algorithmic detection results are probabilistic indicators and do not provide absolute mathematical proof.
=========================================`;

    navigator.clipboard.writeText(textReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReport = () => {
    const textReport = `============================================================
CHECKED AI - FORENSIC VERIFICATION AUDIT REPORT
Tagline: Verify Before You Trust.
============================================================
Target: ${result.targetName}
Scan ID: ${result.id}
Date: ${new Date(result.createdAt).toUTCString()}
Verification Type: ${result.type.toUpperCase()}
Assessment: ${result.status.replace(/_/g, ' ').toUpperCase()}
Confidence Score: ${result.confidenceScore !== undefined ? `${result.confidenceScore}%` : 'N/A (Probabilistic)'}
${result.confidenceJustification ? `Confidence Derivation: ${result.confidenceJustification}` : ''}
Engine Pipeline: ${result.modelUsed} (${result.isDemoMode ? 'Evaluation Heuristic' : 'Production Neural Engine'})

1. OVERALL ASSESSMENT & SUMMARY:
${result.summary}

2. DETAILED FORENSIC EXPLANATION:
${result.explanation}

${result.supportingReasons && result.supportingReasons.length > 0 ? `3. SUPPORTING EVIDENTIARY REASONS:
${result.supportingReasons.map((r, i) => `[${i + 1}] ${r}`).join('\n')}
` : ''}
${result.repetitivePatterns && result.repetitivePatterns.length > 0 ? `4. REPETITIVE PHRASING & STYLISTIC PATTERNS:
${result.repetitivePatterns.map(p => `• ${p}`).join('\n')}
` : ''}
5. EVALUATED SIGNALS & EVIDENCE:
${result.indicators.map(ind => `• [${ind.status.toUpperCase()}] ${ind.name}: ${ind.detail}`).join('\n')}

6. PROBABILISTIC BOUNDARIES & LIMITATIONS:
${result.limitations.map(lim => `• ${lim}`).join('\n')}

LEGAL NOTICE:
Checked AI detection scores reflect statistical variance, linguistic perplexity, and automated heuristic signals. Detection is probabilistic and does not constitute absolute proof. Results must be appraised alongside human context.
============================================================`;

    const blob = new Blob([textReport], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CheckedAI_Report_${result.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const getIndicatorIcon = (status: 'nominal' | 'warning' | 'alert') => {
    switch (status) {
      case 'nominal':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />;
      case 'alert':
        return <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden transition-all">
      {/* Header bar */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5 font-medium flex-wrap">
            <span className="uppercase tracking-wider font-semibold text-slate-700">{result.type} Verification</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-indigo-600 font-semibold">{result.id}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {new Date(result.createdAt).toLocaleDateString()} at {new Date(result.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {result.isBenchmark && (
              <span className="ml-1 text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                Benchmark Sample
              </span>
            )}
            {!result.isBenchmark && (
              <span className="ml-1 text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                Live User Scan
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-slate-900 truncate max-w-xl">
            {result.targetName}
          </h3>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <StatusBadge status={result.status} size="lg" />
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Metric strip: Confidence & Engine Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
          <div>
            <div className="text-xs font-medium text-slate-500 mb-1">Confidence Score</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                {result.confidenceScore !== undefined ? `${result.confidenceScore}%` : 'N/A'}
              </span>
              <span className="text-xs text-slate-500">
                {result.confidenceScore !== undefined ? 'confidence rating' : 'model uncalibrated'}
              </span>
            </div>
            {result.confidenceJustification && (
              <div className="text-[11px] text-slate-600 mt-1.5 leading-snug">
                {result.confidenceJustification}
              </div>
            )}
          </div>

          <div>
            <div className="text-xs font-medium text-slate-500 mb-1">Engine & Pipeline</div>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <Cpu className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="truncate">{result.modelUsed}</span>
            </div>
            <div className="text-[11px] mt-1">
              {result.isDemoMode ? (
                <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Preliminary Heuristic Assessment (Neural API Pending)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Connected Neural Detection Pipeline
                </span>
              )}
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-slate-500 mb-1">Forensic Classification</div>
            <div className="text-sm font-semibold text-slate-800">
              {result.status === 'safe'
                ? 'Minimal AI Signals (Likely Human)'
                : result.status === 'suspicious'
                  ? 'Inconsistent / Anomalous Cadence'
                  : result.status === 'high_risk'
                    ? 'Elevated Synthetic Markers (Likely AI)'
                    : 'Inconclusive Data / Low Variance'}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {result.indicators.filter(i => i.status !== 'nominal').length} alerts or warnings flagged
            </div>
          </div>
        </div>

        {/* Overall Assessment Summary */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Overall Assessment Summary
          </h4>
          <p className="text-sm font-medium text-slate-800 leading-relaxed bg-white p-3.5 rounded-lg border border-slate-200">
            {result.summary}
          </p>
        </div>

        {/* Supporting Evidentiary Reasons */}
        {result.supportingReasons && result.supportingReasons.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
              Reasons Supporting the Assessment ({result.supportingReasons.length})
            </h4>
            <div className="bg-slate-50/80 rounded-lg p-3.5 border border-slate-200/80 space-y-2">
              {result.supportingReasons.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                  <div className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5 font-mono text-[10px] font-bold">
                    {idx + 1}
                  </div>
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Repetitive Phrasing & Stylistic Patterns */}
        {result.repetitivePatterns && result.repetitivePatterns.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
              Repetitive Phrasing & Stylistic Patterns
            </h4>
            <div className="flex flex-wrap gap-2">
              {result.repetitivePatterns.map((pattern, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  {pattern}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Technical Findings & Analysis */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Technical Findings & Analysis
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50/50 p-3.5 rounded-lg border border-slate-100">
            {result.explanation}
          </p>
        </div>

        {/* Evaluated Signals & Evidence */}
        {result.indicators && result.indicators.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Potential AI-Generated Writing Indicators ({result.indicators.length})
            </h4>
            <div className="space-y-2.5">
              {result.indicators.map((ind, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors"
                >
                  {getIndicatorIcon(ind.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">{ind.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        [{ind.status.toUpperCase()}]
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-normal">
                      {ind.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Probabilistic limitations notice */}
        <div className="p-3.5 rounded-lg bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-3">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-semibold text-amber-950">Limitations & Probabilistic Verification Boundary</div>
            <p className="text-amber-800 leading-relaxed">
              Checked AI detection results are probabilistic estimations based on linguistic variance and structural cadence. Machine detection cannot prove AI or human authorship with mathematical certainty and may produce false positives or false negatives.
            </p>
            {result.limitations && result.limitations.length > 0 && (
              <ul className="list-disc list-inside mt-1.5 space-y-1 text-amber-800/90 text-[11px]">
                {result.limitations.map((lim, i) => (
                  <li key={i}>{lim}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Footer action bar */}
      <div className="px-5 sm:px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="text-xs text-slate-500 font-mono">
          Checked AI Cryptographic Verification Protocol
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyReport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors whitespace-nowrap"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Report'}</span>
          </button>

          <button
            onClick={handleDownloadReport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Download Report</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors whitespace-nowrap"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>

          {onOpenReportModal && (
            <button
              onClick={() => onOpenReportModal(result)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Full Audit Report</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

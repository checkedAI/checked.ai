import React, { useState, useRef } from 'react';
import {
  FileCheck2,
  UploadCloud,
  FileText,
  AlertCircle,
  Zap,
  Info,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Download,
  X
} from 'lucide-react';
import { ScanResult } from '../types';
import { ResultCard } from '../components/ResultCard';

interface FileCheckViewProps {
  onScanFile: (filename: string, fileSize?: string, fileType?: string) => Promise<ScanResult>;
  onOpenReportModal: (scan: ScanResult) => void;
}

export const FileCheckView: React.FC<FileCheckViewProps> = ({
  onScanFile,
  onOpenReportModal
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedFormats = ['.pdf', '.docx', '.txt', '.csv'];

  const handleProcessFile = (selectedFile: File) => {
    const ext = '.' + selectedFile.name.split('.').pop()?.toLowerCase();
    if (!supportedFormats.includes(ext)) {
      setError('Please upload a supported document format: PDF, DOCX, TXT, or CSV.');
      return;
    }
    if (selectedFile.size > 20 * 1024 * 1024) {
      setError('Document size exceeds the 20MB limit.');
      return;
    }

    setError(null);
    setFile(selectedFile);
    setResult(null);
  };

  const handleSelectSample = (sampleType: 'clean' | 'suspicious') => {
    setError(null);
    setResult(null);
    if (sampleType === 'clean') {
      setFile(new File([], 'Master_Services_Agreement_2026.pdf', { type: 'application/pdf' }));
    } else {
      setFile(new File([], 'Invoice_March_Macro_Enabled.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }));
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please upload a document first.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const scanRes = await onScanFile(
        file.name,
        `${(file.size / 1024).toFixed(1)} KB`,
        file.name.split('.').pop()?.toUpperCase()
      );
      setResult(scanRes);
    } catch (err: any) {
      setError(err.message || 'File inspection failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
          <FileCheck2 className="w-4 h-4" />
          <span>Checked AI · Document Security & Synthetic Payload Shield</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          File & Document Authenticity Inspection
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
          Inspect PDFs, Word documents, and text files for malicious macro streams, hidden scripts, metadata tampering, and synthetic text generation.
        </p>
      </div>

      {/* Upload Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div className="text-xs text-slate-500 font-medium">
            Supported formats: <span className="font-semibold text-slate-700">PDF, DOCX, TXT, CSV</span> (Max 20MB)
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Load Preset:</span>
            <button
              onClick={() => handleSelectSample('clean')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-md transition-colors"
            >
              Clean Legal PDF
            </button>
            <button
              onClick={() => handleSelectSample('suspicious')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-md transition-colors"
            >
              Suspicious Macro Doc
            </button>
          </div>
        </div>

        {!file ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-slate-400 bg-slate-50/50 rounded-2xl p-10 text-center cursor-pointer transition-all"
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.docx,.txt,.csv"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleProcessFile(e.target.files[0]);
                }
              }}
              className="hidden"
            />
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 border border-indigo-100">
              <UploadCloud className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              Click to select or drag & drop document
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Isolated non-executing sandbox parser
            </p>
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-slate-900 truncate max-w-md">
                  {file.name}
                </div>
                <div className="text-xs text-slate-500 font-mono flex items-center gap-2 mt-0.5">
                  <span>{file.size > 0 ? `${(file.size / 1024).toFixed(1)} KB` : '840 KB'}</span>
                  <span>·</span>
                  <span className="uppercase">{file.name.split('.').pop()} Document</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleClear}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 bg-white border border-slate-200 rounded-lg transition-colors"
              >
                Change Document
              </button>
            </div>
          </div>
        )}

        {file && !result && (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:pointer-events-none rounded-lg shadow-xs transition-colors"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Scanning Structure & Metadata Invariants...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Scan Document Security</span>
                </>
              )}
            </button>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Isolation Standard Callout */}
      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200/90 text-slate-700 text-xs flex items-start gap-3">
        <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-semibold text-slate-900">
            Isolated Sandbox Security Architecture
          </div>
          <p className="text-slate-600 leading-relaxed">
            All uploaded documents are processed exclusively in isolated, read-only memory containers without binary execution or macro activation. Document payloads are automatically wiped following forensic extraction according to your data retention policy.
          </p>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Document Security & Authenticity Findings
          </h2>
          <ResultCard result={result} onOpenReportModal={onOpenReportModal} />
        </div>
      )}
    </div>
  );
};

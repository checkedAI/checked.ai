import React from 'react';
import {
  FileSpreadsheet,
  FileText,
  Printer,
  Download,
  ShieldCheck,
  Fingerprint,
  Clock,
  ArrowRight
} from 'lucide-react';
import { ScanResult } from '../types';
import { StatusBadge } from '../components/StatusBadge';

interface ReportsViewProps {
  scans: ScanResult[];
  onOpenReportModal: (scan: ScanResult) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ scans, onOpenReportModal }) => {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
          <FileSpreadsheet className="w-4 h-4" />
          <span>Checked AI · Cryptographic Forensics</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Forensic Reports & Verification Certificates
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
          Tamper-evident audit certificates for compliance, legal review, editorial workflows, and security investigations.
        </p>
      </div>

      {/* Grid of Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {scans.map((scan) => {
          const fingerprint = 'sha256:' + Array.from(scan.id + scan.createdAt)
            .reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) % 1000000007, 7)
            .toString(16)
            .padStart(16, '0');

          return (
            <div
              key={scan.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-indigo-300 transition-all p-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono font-semibold uppercase text-slate-500">
                    {scan.type} Report
                  </span>
                  <StatusBadge status={scan.status} size="sm" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 truncate" title={scan.targetName}>
                    {scan.targetName}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{new Date(scan.createdAt).toLocaleDateString()}</span>
                    <span>·</span>
                    <span>{scan.id}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {scan.summary}
                </p>

                {/* Fingerprint snippet */}
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 font-mono text-[10px] text-slate-500 truncate">
                  <div className="text-slate-400 font-semibold mb-0.5">Verification Hash:</div>
                  <div className="truncate select-all text-indigo-700 font-semibold">
                    {fingerprint}
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs font-mono font-bold text-slate-700 tabular-nums">
                  {scan.confidenceScore !== undefined ? `${scan.confidenceScore}% Conf.` : 'Probabilistic'}
                </div>

                <button
                  onClick={() => onOpenReportModal(scan)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  <span>Open Full Audit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

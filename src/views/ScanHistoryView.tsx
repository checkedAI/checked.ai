import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  Trash2,
  FileText,
  ChevronRight,
  Download,
  AlertCircle
} from 'lucide-react';
import { ScanResult, ScanType, RiskLevel } from '../types';
import { StatusBadge } from '../components/StatusBadge';

interface ScanHistoryViewProps {
  scans: ScanResult[];
  onOpenReportModal: (scan: ScanResult) => void;
  onDeleteScan: (id: string) => Promise<void>;
}

export const ScanHistoryView: React.FC<ScanHistoryViewProps> = ({
  scans,
  onOpenReportModal,
  onDeleteScan
}) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = scans.filter(s => {
    const matchesSearch = s.targetName.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.summary.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || s.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this scan record?')) {
      setDeletingId(id);
      try {
        await onDeleteScan(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
            <History className="w-4 h-4" />
            <span>Checked AI · Audit Trail Registry</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Verification Scan History
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Historical logs of all content verifications, threat scores, and forensic assessments.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <span>Total Records: <strong className="text-slate-900 font-bold tabular-nums">{scans.length}</strong></span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by target name, scan ID, or summary..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 py-1.5 px-2.5 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Types</option>
              <option value="text">Text</option>
              <option value="image">Image</option>
              <option value="website">Website</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
              <option value="file">File</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 py-1.5 px-2.5 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="safe">Safe / Low Risk</option>
              <option value="suspicious">Suspicious</option>
              <option value="high_risk">High Risk</option>
              <option value="unable_to_determine">Unable to Determine</option>
            </select>
          </div>
        </div>
      </div>

      {/* Scans Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Scan Identifier</th>
                <th className="px-5 py-3">Digital Asset / Resource</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Assessment</th>
                <th className="px-5 py-3 text-right">Confidence</th>
                <th className="px-5 py-3">Model Engine</th>
                <th className="px-5 py-3">Timestamp</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-slate-500">
                    No scan records match the selected filters.
                  </td>
                </tr>
              ) : (
                filtered.map((scan) => (
                  <tr key={scan.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3 font-mono text-slate-500 whitespace-nowrap">
                      {scan.id}
                    </td>

                    <td className="px-5 py-3 text-slate-900 max-w-sm">
                      <div className="font-semibold truncate" title={scan.targetName}>
                        {scan.targetName}
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5" title={scan.summary}>
                        {scan.summary}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        {scan.isBenchmark ? (
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-sans font-medium">
                            Benchmark Demo
                          </span>
                        ) : (
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded font-sans font-bold">
                            Live Recorded
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-3 text-slate-600 uppercase font-medium">
                      {scan.type}
                    </td>

                    <td className="px-5 py-3">
                      <StatusBadge status={scan.status} size="sm" />
                    </td>

                    <td className="px-5 py-3 text-right font-mono font-bold text-slate-800 tabular-nums">
                      {scan.confidenceScore !== undefined ? `${scan.confidenceScore}%` : '—'}
                    </td>

                    <td className="px-5 py-3 text-slate-600 truncate max-w-[150px]">
                      {scan.modelUsed}
                    </td>

                    <td className="px-5 py-3 text-slate-500 whitespace-nowrap font-mono">
                      {new Date(scan.createdAt).toLocaleString()}
                    </td>

                    <td className="px-5 py-3 text-right whitespace-nowrap space-x-1">
                      <button
                        onClick={() => onOpenReportModal(scan)}
                        className="px-2.5 py-1 font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded transition-colors"
                      >
                        Report
                      </button>
                      <button
                        onClick={() => handleDelete(scan.id)}
                        disabled={deletingId === scan.id}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors disabled:opacity-50"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

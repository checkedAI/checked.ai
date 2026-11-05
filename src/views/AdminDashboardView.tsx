import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Server,
  Activity,
  AlertTriangle,
  Users,
  CheckCircle2,
  Clock,
  Cpu,
  RefreshCw,
  Search,
  Lock
} from 'lucide-react';
import { AdminStats } from '../types';
import { api } from '../services/api';

export const AdminDashboardView: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Managed demo users list
  const [users, setUsers] = useState([
    { id: 'usr_01', name: 'Checked AI', email: 'support@checked-ai.com', role: 'Security Analyst', plan: 'Pro', status: 'active', scans: 142 },
    { id: 'usr_02', name: 'Julian Vance', email: 'j.vance@defense-intel.org', role: 'Chief Forensics Officer', plan: 'Business', status: 'active', scans: 1420 },
    { id: 'usr_03', name: 'Elena Rostova', email: 'elena@cyber-audit.net', role: 'Threat Investigator', plan: 'Pro', status: 'active', scans: 312 },
    { id: 'usr_04', name: 'Marcus Sterling', email: 'm.sterling@freelance-edit.com', role: 'Editorial Staff', plan: 'Free', status: 'active', scans: 24 },
    { id: 'usr_05', name: 'Dev Bot Scanner', email: 'automation@crawler-cluster.io', role: 'API Client', plan: 'Pro', status: 'suspended', scans: 2490 }
  ]);

  const loadStats = () => {
    setLoading(true);
    api.getAdminStats().then((data) => {
      setStats(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadStats();
  }, []);

  const toggleUserStatus = (id: string) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === 'active' ? 'suspended' : 'active' };
      }
      return u;
    }));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Checked AI · System Administration & Model Telemetry</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Administrator Console & Cluster Health
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Monitor model engines, system response latencies, threat abuse alerts, and role-based user access.
          </p>
        </div>

        <button
          onClick={loadStats}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Cluster Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Registered Users
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {stats ? stats.totalUsers.toLocaleString() : '1,428'}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Active RBAC accounts
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Total Pipeline Scans
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {stats ? stats.totalScans.toLocaleString() : '28,496'}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Across 6 detection modalities
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Active Engines
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            5 / 6 Operational
          </div>
          <div className="text-xs text-emerald-700 mt-1 font-medium">
            Acoustic model in Lab training
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Abuse Incident Flags
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            3 Alerts
          </div>
          <div className="text-xs text-amber-700 mt-1 font-medium">
            2 burst throttling events
          </div>
        </div>
      </div>

      {/* Service Health & Model API Status */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Connected AI Verification Engines & Model Status
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live operational health and latency measurements for modular microservices.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Mesh Healthy</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Service Name</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Underlying Engine</th>
                <th className="px-5 py-3">Model Version</th>
                <th className="px-5 py-3 text-right">Inference Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {stats?.services.map((svc, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3 font-sans font-bold text-slate-900">
                    {svc.name}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-sans font-semibold uppercase ${
                      svc.status === 'operational' ? 'bg-emerald-100 text-emerald-800' :
                      svc.status === 'degraded' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-200 text-slate-700'
                    }`}>
                      {svc.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-sans text-slate-700">
                    {svc.engine}
                  </td>
                  <td className="px-5 py-3 text-slate-500">
                    {svc.modelVersion}
                  </td>
                  <td className="px-5 py-3 text-right text-slate-700 tabular-nums font-bold">
                    {svc.latencyMs > 0 ? `${svc.latencyMs} ms` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Column: Live Abuse Alerts & Error Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Abuse Alerts */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Abuse Detection & Security Alerts</span>
          </h3>
          <div className="space-y-2.5">
            {stats?.recentAlerts.map(alt => (
              <div key={alt.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="font-bold text-slate-700">{alt.type}</span>
                  <span>{alt.time}</span>
                </div>
                <div className="text-slate-700 mt-1 leading-relaxed">
                  {alt.message}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Error Logs */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-600" />
            <span>API Gateway Audit & Security Interceptions</span>
          </h3>
          <div className="space-y-2.5 font-mono text-xs">
            {stats?.errorLogs.map(log => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-950 text-slate-300 border border-slate-800">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span>{log.endpoint}</span>
                  <span className="text-rose-400 font-bold">HTTP {log.status}</span>
                </div>
                <div className="text-[11px] text-slate-200 truncate">
                  {log.message}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Logged at {log.time} UTC
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Management Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              User & Identity Access Control (RBAC)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage analyst permissions, plan allocations, and security suspension states.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Analyst / Account</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">License Tier</th>
                <th className="px-5 py-3 text-right">Scans Run</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3">
                    <div className="font-semibold text-slate-900">{u.name}</div>
                    <div className="text-[11px] font-mono text-slate-400">{u.email}</div>
                  </td>
                  <td className="px-5 py-3 text-slate-700">{u.role}</td>
                  <td className="px-5 py-3 font-semibold text-indigo-700">{u.plan}</td>
                  <td className="px-5 py-3 text-right font-mono tabular-nums text-slate-800">{u.scans}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                      u.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => toggleUserStatus(u.id)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                        u.status === 'active'
                          ? 'text-rose-600 hover:bg-rose-50'
                          : 'text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      {u.status === 'active' ? 'Suspend' : 'Reactivate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

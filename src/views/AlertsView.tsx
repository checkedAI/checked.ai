import React, { useState, useEffect } from 'react';
import {
  Bell,
  ShieldAlert,
  Info,
  CheckCheck,
  AlertTriangle,
  Zap,
  Clock
} from 'lucide-react';
import { NotificationItem } from '../types';
import { api } from '../services/api';

export const AlertsView: React.FC = () => {
  const [alerts, setAlerts] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getNotifications().then(items => {
      setAlerts(items);
      setLoading(false);
    });
  }, []);

  const handleMarkAllRead = () => {
    setAlerts(alerts.map(a => ({ ...a, read: true })));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
            <Bell className="w-4 h-4" />
            <span>Checked AI · Threat Watch Feed</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Security Advisories & Threat Alerts
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Real-time threat intelligence updates, automated cluster warnings, and engine operational bulletins.
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <CheckCheck className="w-4 h-4 text-emerald-600" />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Alert Feed */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">
            Loading threat advisories...
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-5 rounded-2xl border transition-all ${
                alert.read
                  ? 'bg-white border-slate-200 text-slate-700'
                  : 'bg-indigo-50/40 border-indigo-200 text-slate-900 shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  alert.type === 'security'
                    ? 'bg-rose-100 text-rose-700'
                    : alert.type === 'scan'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-indigo-100 text-indigo-700'
                }`}>
                  {alert.type === 'security' ? (
                    <ShieldAlert className="w-5 h-5" />
                  ) : alert.type === 'scan' ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : (
                    <Info className="w-5 h-5" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="text-sm font-bold text-slate-900">
                      {alert.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                      <Clock className="w-3 h-3" />
                      <span>{alert.timestamp}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {alert.message}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

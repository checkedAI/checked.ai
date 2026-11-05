import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, HelpCircle } from 'lucide-react';
import { RiskLevel } from '../types';

interface StatusBadgeProps {
  status: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const config = {
    safe: {
      label: 'Safe / Low Risk',
      icon: ShieldCheck,
      classes: 'text-emerald-700 bg-emerald-50 border-emerald-200/80',
      iconClass: 'text-emerald-600'
    },
    suspicious: {
      label: 'Suspicious / Needs Review',
      icon: AlertTriangle,
      classes: 'text-amber-700 bg-amber-50 border-amber-200/80',
      iconClass: 'text-amber-600'
    },
    high_risk: {
      label: 'High Risk / Potentially Manipulated',
      icon: AlertOctagon,
      classes: 'text-rose-700 bg-rose-50 border-rose-200/80',
      iconClass: 'text-rose-600'
    },
    unable_to_determine: {
      label: 'Unable to Determine',
      icon: HelpCircle,
      classes: 'text-slate-700 bg-slate-100 border-slate-300',
      iconClass: 'text-slate-500'
    }
  }[status];

  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs font-semibold px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3 py-1.5 gap-2'
  }[size];

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-4.5 h-4.5'
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-md border font-medium whitespace-nowrap shrink-0 ${config.classes} ${sizeClasses}`}
    >
      <Icon className={`${iconSizes} shrink-0 ${config.iconClass}`} />
      <span>{config.label}</span>
    </span>
  );
};

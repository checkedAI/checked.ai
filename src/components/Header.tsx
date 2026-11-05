import React from 'react';
import { Menu, PlusCircle, ShieldCheck, Terminal, HelpCircle, Smartphone, Share2, Users } from 'lucide-react';
import { NavTab } from './Sidebar';

interface HeaderProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenMobile: () => void;
  onTriggerQuickScan: () => void;
  onOpenShareModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenMobile,
  onTriggerQuickScan,
  onOpenShareModal,
}) => {
  const getTabTitle = (tab: NavTab) => {
    switch (tab) {
      case 'dashboard': return 'Dashboard';
      case 'text': return 'Text AI Detection';
      case 'image': return 'Image AI Detection';
      case 'website': return 'Website Safety Check';
      case 'video': return 'Video Deepfake Detection';
      case 'audio': return 'Audio Analysis';
      case 'file': return 'File & Document Check';
      case 'history': return 'Scan History';
      case 'reports': return 'Forensic Reports';
      case 'alerts': return 'Threat Alerts';
      case 'invite': return 'Invite Friends & Community';
      case 'settings': return 'System Settings';
      case 'pricing': return 'Subscription Plans';
      case 'admin': return 'Admin Console';
      case 'apk': return 'Download Android APK';
      default: return 'Overview';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8">
      {/* Zone 1: Brand title & breadcrumb (one line) */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2.5 text-sm">
          <img
            src="/assets/aistudio/file_00000000994c820b934e6d45fd748aac_e53ea1ed.png"
            alt="Checked AI"
            className="w-6 h-6 rounded-md object-contain border border-slate-200"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <span className="font-bold tracking-tight text-slate-900 whitespace-nowrap">Checked AI</span>
          <span className="text-slate-400">/</span>
          <span className="font-semibold text-slate-700 whitespace-nowrap">{getTabTitle(currentTab)}</span>
        </div>
      </div>

      {/* Zone 2: 4-5 clean single-line nav links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
            currentTab === 'dashboard' ? 'text-indigo-600 font-semibold' : ''
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => onSelectTab('history')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
            currentTab === 'history' ? 'text-indigo-600 font-semibold' : ''
          }`}
        >
          Scans
        </button>
        <button
          onClick={() => onSelectTab('reports')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
            currentTab === 'reports' ? 'text-indigo-600 font-semibold' : ''
          }`}
        >
          Reports
        </button>
        <button
          onClick={() => onSelectTab('invite')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 ${
            currentTab === 'invite' ? 'text-indigo-600 font-semibold' : ''
          }`}
        >
          <span>Invite</span>
          <span className="text-[10px] bg-purple-100 text-purple-700 px-1 py-0.2 rounded font-bold">New</span>
        </button>
        <button
          onClick={() => onSelectTab('apk')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
            currentTab === 'apk' ? 'text-blue-600 font-bold' : ''
          }`}
        >
          Android App
        </button>
        <button
          onClick={() => onSelectTab('admin')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
            currentTab === 'admin' ? 'text-indigo-600 font-semibold' : ''
          }`}
        >
          Admin
        </button>
      </nav>

      {/* Zone 3: Actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onOpenShareModal}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-indigo-200 bg-indigo-50/80 hover:bg-indigo-100 text-indigo-700 transition-colors whitespace-nowrap shrink-0 shadow-2xs"
          title="Share Checked AI with friends"
          aria-label="Share Checked AI with friends"
        >
          <Share2 className="w-3.5 h-3.5 text-indigo-600" />
          <span className="hidden sm:inline">Share</span>
        </button>

        <button
          onClick={() => onSelectTab('apk')}
          className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
            currentTab === 'apk'
              ? 'bg-blue-50 border-blue-300 text-blue-700 font-bold'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5 text-blue-600" />
          <span>Download APK</span>
        </button>

        <button
          onClick={onTriggerQuickScan}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-indigo-500"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Scan</span>
        </button>
      </div>
    </header>
  );
};

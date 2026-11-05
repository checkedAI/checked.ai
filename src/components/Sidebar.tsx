import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  Globe,
  Video,
  Mic,
  FileCheck2,
  History,
  FileSpreadsheet,
  Bell,
  Settings,
  CreditCard,
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  X,
  ExternalLink,
  Users,
  Share2
} from 'lucide-react';
import { UserProfile } from '../types';

export type NavTab =
  | 'dashboard'
  | 'text'
  | 'image'
  | 'website'
  | 'video'
  | 'audio'
  | 'file'
  | 'history'
  | 'reports'
  | 'alerts'
  | 'invite'
  | 'settings'
  | 'pricing'
  | 'admin'
  | 'apk';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  profile: UserProfile | null;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenShare?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  profile,
  mobileOpen,
  onCloseMobile,
  onOpenShare
}) => {
  const primaryNav: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'text', label: 'Text Check', icon: FileText },
    { id: 'image', label: 'Image Check', icon: ImageIcon },
    { id: 'website', label: 'Website Check', icon: Globe },
    { id: 'video', label: 'Video Check', icon: Video },
    { id: 'audio', label: 'Audio Check', icon: Mic },
    { id: 'file', label: 'File Check', icon: FileCheck2 },
  ];

  const manageNav: NavItem[] = [
    { id: 'history', label: 'Scan History', icon: History },
    { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
    { id: 'alerts', label: 'Alerts', icon: Bell },
  ];

  const communityNav: NavItem[] = [
    { id: 'invite', label: 'Invite Friends', icon: Users, badge: 'Share' },
  ];

  const adminNav: NavItem[] = [
    { id: 'apk', label: 'Download APK', icon: Smartphone, badge: 'v1.0.3' },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'pricing', label: 'Pricing Plans', icon: CreditCard },
    { id: 'admin', label: 'Admin Dashboard', icon: ShieldAlert },
  ];

  const renderNavGroup = (title: string, items: NavItem[]) => (
    <div className="mb-6">
      <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
        {title}
      </div>
      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id as NavTab);
                onCloseMobile();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap text-left ${
                active
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
              {item.badge ? (
                <span className="ml-auto text-[10px] bg-blue-900/60 text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/30 font-bold font-mono">
                  {item.badge}
                </span>
              ) : item.id === 'audio' ? (
                <span className="ml-auto text-[10px] bg-slate-800 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/20">
                  Lab
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 z-40 lg:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0A1128] text-slate-200 border-r border-slate-800/80 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <img
              src="/assets/aistudio/file_00000000994c820b934e6d45fd748aac_e53ea1ed.png"
              alt="Checked AI Logo"
              className="w-8 h-8 rounded-lg object-contain shadow-sm border border-indigo-500/30"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div>
              <div className="text-base font-bold text-white tracking-tight leading-none">
                Checked AI
              </div>
              <div className="text-[11px] text-indigo-300 font-medium tracking-tight mt-1">
                Verify Before You Trust.
              </div>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-md"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
          {renderNavGroup('Detection Modules', primaryNav)}
          {renderNavGroup('Forensics & History', manageNav)}
          {renderNavGroup('Community & Growth', communityNav)}
          {renderNavGroup('Administration', adminNav)}
        </nav>

        {/* Quick Share action button */}
        <div className="px-3 pb-2 shrink-0">
          <button
            onClick={() => {
              if (onOpenShare) onOpenShare();
              onCloseMobile();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg bg-indigo-600/25 hover:bg-indigo-600/40 text-indigo-200 border border-indigo-500/30 transition-all shadow-2xs group"
          >
            <Share2 className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span>Share with Friends</span>
          </button>
        </div>

        {/* User profile bottom lockup */}
        <div className="p-3 border-t border-slate-800/80 shrink-0 bg-[#070D1F]">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
            <div className="w-9 h-9 rounded-lg bg-indigo-950/70 border border-indigo-500/30 flex items-center justify-center shrink-0 p-1">
              <img
                src="/assets/aistudio/file_00000000994c820b934e6d45fd748aac_e53ea1ed.png"
                alt="Checked AI"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-white truncate">
                Checked AI
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className="text-indigo-400 font-medium">{profile?.plan || 'Pro'} Plan</span>
                <span>·</span>
                <span className="font-mono tabular-nums">{profile ? `${profile.scansUsed}/${profile.scansLimit}` : '142/500'}</span>
              </div>
            </div>
            <button
              onClick={() => onSelectTab('settings')}
              title="Settings"
              className="p-1.5 text-slate-400 hover:text-white rounded transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

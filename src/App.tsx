import React, { useState, useEffect } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { ReportModal } from './components/ReportModal';
import { QuickScanModal } from './components/QuickScanModal';
import { DashboardView } from './views/DashboardView';
import { TextCheckView } from './views/TextCheckView';
import { ImageCheckView } from './views/ImageCheckView';
import { WebsiteCheckView } from './views/WebsiteCheckView';
import { VideoCheckView } from './views/VideoCheckView';
import { AudioCheckView } from './views/AudioCheckView';
import { FileCheckView } from './views/FileCheckView';
import { ScanHistoryView } from './views/ScanHistoryView';
import { ReportsView } from './views/ReportsView';
import { AlertsView } from './views/AlertsView';
import { SettingsView } from './views/SettingsView';
import { PricingView } from './views/PricingView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { ApkDownloadView } from './views/ApkDownloadView';
import { InviteFriendsView } from './views/InviteFriendsView';
import { ShareModal } from './components/ShareModal';
import { ScanResult, UserProfile } from './types';
import { api } from './services/api';
import { Home, History, Plus, Bell, User } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeReportScan, setActiveReportScan] = useState<ScanResult | null>(null);
  const [quickScanOpen, setQuickScanOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const [scans, setScans] = useState<ScanResult[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Initial load
  useEffect(() => {
    Promise.all([api.getScans(), api.getProfile()])
      .then(([scansData, profileData]) => {
        setScans(scansData);
        setProfile(profileData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load initial data:', err);
        setLoading(false);
      });
  }, []);

  // Scan Handlers
  const handleScanText = async (text: string, title?: string): Promise<ScanResult> => {
    const result = await api.scanText(text, title);
    setScans(prev => [result, ...prev]);
    if (profile) setProfile({ ...profile, scansUsed: profile.scansUsed + 1 });
    return result;
  };

  const handleScanImage = async (base64: string, mime: string, filename: string): Promise<ScanResult> => {
    const result = await api.scanImage(base64, mime, filename);
    setScans(prev => [result, ...prev]);
    if (profile) setProfile({ ...profile, scansUsed: profile.scansUsed + 1 });
    return result;
  };

  const handleScanWebsite = async (url: string): Promise<ScanResult> => {
    const result = await api.scanWebsite(url);
    setScans(prev => [result, ...prev]);
    if (profile) setProfile({ ...profile, scansUsed: profile.scansUsed + 1 });
    return result;
  };

  const handleScanVideo = async (filename: string, duration?: string, fileSize?: string): Promise<ScanResult> => {
    const result = await api.scanVideo(filename, duration, fileSize);
    setScans(prev => [result, ...prev]);
    if (profile) setProfile({ ...profile, scansUsed: profile.scansUsed + 1 });
    return result;
  };

  const handleScanAudio = async (filename: string, fileSize?: string): Promise<ScanResult> => {
    const result = await api.scanAudio(filename, fileSize);
    setScans(prev => [result, ...prev]);
    if (profile) setProfile({ ...profile, scansUsed: profile.scansUsed + 1 });
    return result;
  };

  const handleScanFile = async (filename: string, fileSize?: string, fileType?: string): Promise<ScanResult> => {
    const result = await api.scanFile(filename, fileSize, fileType);
    setScans(prev => [result, ...prev]);
    if (profile) setProfile({ ...profile, scansUsed: profile.scansUsed + 1 });
    return result;
  };

  const handleDeleteScan = async (id: string) => {
    await api.deleteScan(id);
    setScans(prev => prev.filter(s => s.id !== id));
  };

  const handleUpdateProfile = async (updates: Partial<UserProfile>) => {
    const updated = await api.updateProfile(updates);
    setProfile(updated);
  };

  const handleUpdatePlan = async (plan: 'Free' | 'Pro' | 'Business') => {
    const limits = { Free: 25, Pro: 500, Business: 5000 };
    const updated = await api.updateProfile({ plan, scansLimit: limits[plan] });
    setProfile(updated);
  };

  const renderActiveView = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <DashboardView
            scans={scans}
            profile={profile}
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenReportModal={(scan) => setActiveReportScan(scan)}
            onOpenShareModal={() => setShareModalOpen(true)}
            onQuickTextScan={async (text) => {
              const res = await handleScanText(text);
              setActiveReportScan(res);
            }}
            onQuickUrlScan={async (url) => {
              const res = await handleScanWebsite(url);
              setActiveReportScan(res);
            }}
          />
        );

      case 'text':
        return (
          <TextCheckView
            onScanText={handleScanText}
            onOpenReportModal={(scan) => setActiveReportScan(scan)}
          />
        );

      case 'image':
        return (
          <ImageCheckView
            onScanImage={handleScanImage}
            onOpenReportModal={(scan) => setActiveReportScan(scan)}
          />
        );

      case 'website':
        return (
          <WebsiteCheckView
            onScanWebsite={handleScanWebsite}
            onOpenReportModal={(scan) => setActiveReportScan(scan)}
          />
        );

      case 'video':
        return (
          <VideoCheckView
            onScanVideo={handleScanVideo}
            onOpenReportModal={(scan) => setActiveReportScan(scan)}
          />
        );

      case 'audio':
        return (
          <AudioCheckView
            onScanAudio={handleScanAudio}
            onOpenReportModal={(scan) => setActiveReportScan(scan)}
          />
        );

      case 'file':
        return (
          <FileCheckView
            onScanFile={handleScanFile}
            onOpenReportModal={(scan) => setActiveReportScan(scan)}
          />
        );

      case 'history':
        return (
          <ScanHistoryView
            scans={scans}
            onOpenReportModal={(scan) => setActiveReportScan(scan)}
            onDeleteScan={handleDeleteScan}
          />
        );

      case 'reports':
        return (
          <ReportsView
            scans={scans}
            onOpenReportModal={(scan) => setActiveReportScan(scan)}
          />
        );

      case 'alerts':
        return <AlertsView />;

      case 'settings':
        return (
          <SettingsView
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
          />
        );

      case 'pricing':
        return (
          <PricingView
            profile={profile}
            onUpdatePlan={handleUpdatePlan}
          />
        );

      case 'admin':
        return <AdminDashboardView />;

      case 'apk':
        return <ApkDownloadView />;

      case 'invite':
        return (
          <InviteFriendsView
            profile={profile}
            onOpenShareModal={() => setShareModalOpen(true)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* Sidebar navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        profile={profile}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        onOpenShare={() => setShareModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Bar Contract (3 zones) */}
        <Header
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          onOpenMobile={() => setMobileMenuOpen(true)}
          onTriggerQuickScan={() => setQuickScanOpen(true)}
          onOpenShareModal={() => setShareModalOpen(true)}
        />

        {/* Viewport Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Matches Android Reference Design) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 py-2 flex items-center justify-around lg:hidden shadow-lg pb-[env(safe-area-inset-bottom,8px)]">
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`flex flex-col items-center justify-center py-1 px-2 text-xs transition-colors cursor-pointer ${
            currentTab === 'dashboard' ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-700'
          }`}
          aria-label="Home"
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setCurrentTab('history')}
          className={`flex flex-col items-center justify-center py-1 px-2 text-xs transition-colors cursor-pointer ${
            currentTab === 'history' ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-700'
          }`}
          aria-label="History"
        >
          <History className="w-5 h-5 mb-0.5" />
          <span>History</span>
        </button>

        {/* Center Prominent Action Button for starting a new check */}
        <button
          onClick={() => setQuickScanOpen(true)}
          className="flex items-center justify-center -mt-6 w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-blue-100 cursor-pointer"
          aria-label="Start New Check"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        <button
          onClick={() => setCurrentTab('alerts')}
          className={`flex flex-col items-center justify-center py-1 px-2 text-xs transition-colors cursor-pointer relative ${
            currentTab === 'alerts' ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-700'
          }`}
          aria-label="Alerts"
        >
          <Bell className="w-5 h-5 mb-0.5" />
          <span className="absolute top-1 right-2.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          <span>Alerts</span>
        </button>

        <button
          onClick={() => setCurrentTab('settings')}
          className={`flex flex-col items-center justify-center py-1 px-2 text-xs transition-colors cursor-pointer ${
            currentTab === 'settings' ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-700'
          }`}
          aria-label="Profile"
        >
          <User className="w-5 h-5 mb-0.5" />
          <span>Profile</span>
        </button>
      </nav>

      {/* Cryptographic Report Modal */}
      <ReportModal
        scan={activeReportScan}
        onClose={() => setActiveReportScan(null)}
      />

      {/* Quick Scan Modal */}
      <QuickScanModal
        isOpen={quickScanOpen}
        onClose={() => setQuickScanOpen(false)}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onQuickTextScan={async (text) => {
          const res = await handleScanText(text);
          setActiveReportScan(res);
        }}
        onQuickUrlScan={async (url) => {
          const res = await handleScanWebsite(url);
          setActiveReportScan(res);
        }}
      />

      {/* Share with Friends Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        referralCode={profile?.id ? `CHK-${profile.id.replace('usr_', '').slice(0, 6).toUpperCase()}` : undefined}
      />
    </div>
  );
}

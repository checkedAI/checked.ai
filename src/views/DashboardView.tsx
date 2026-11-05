import React, { useState } from 'react';
import {
  ShieldCheck,
  Shield,
  AlertTriangle,
  AlertOctagon,
  Scan,
  ArrowRight,
  Search,
  Filter,
  FileText,
  Image as ImageIcon,
  Globe,
  FileCheck2,
  Video,
  Mic,
  Clock,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Zap,
  Smartphone,
  Download,
  Share2,
  Copy,
  Check,
  Bell,
  Users,
  Sparkles,
  Eye,
  Lock,
  Lightbulb,
  HelpCircle,
  UploadCloud,
  CheckCircle2
} from 'lucide-react';
import { ScanResult, UserProfile } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { NavTab } from '../components/Sidebar';

interface DashboardViewProps {
  scans: ScanResult[];
  profile: UserProfile | null;
  onNavigate: (tab: NavTab) => void;
  onOpenReportModal: (scan: ScanResult) => void;
  onQuickTextScan: (text: string) => Promise<void>;
  onQuickUrlScan: (url: string) => Promise<void>;
  onOpenShareModal?: () => void;
}

const SAFETY_TIPS = [
  {
    id: 1,
    category: 'Source Verification',
    tip: 'Before sharing a viral screenshot or sensational image, reverse-search its earliest appearance and look for confirmation from accredited news outlets.',
    context: 'Generative AI makes creating fabricated screenshots of headlines and tweets effortless.'
  },
  {
    id: 2,
    category: 'Voice & Audio Caution',
    tip: 'Be skeptical of urgent voice memos from unknown or spoofed numbers demanding urgent wire transfers—modern voice clones require less than 5 seconds of sample audio.',
    context: 'Establish a private verbal verification phrase with family members for emergency requests.'
  },
  {
    id: 3,
    category: 'URL & Web Safety',
    tip: 'Carefully scrutinize domain spellings for subtle character substitutions (such as "rn" masquerading as "m", or foreign homoglyphs) before logging into accounts.',
    context: 'Lookalike domains are the number one vector for credential harvesting campaigns.'
  },
  {
    id: 4,
    category: 'Linguistic AI Patterns',
    tip: 'Content that maintains rigidly identical paragraph lengths, lacks domain-specific idioms, and repeatedly employs formulaic transition markers is frequently synthetic.',
    context: 'Human writing demonstrates natural burstiness—varying between terse declarations and complex thoughts.'
  },
  {
    id: 5,
    category: 'Deepfake Video Detection',
    tip: 'When inspecting questionable video interviews, watch the subject\'s ears, teeth alignment, eye blinking cadence, and light reflections in their pupils.',
    context: 'Synthesized faces often display subtle geometric distortions along jawlines and hair boundaries.'
  }
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  scans,
  profile,
  onNavigate,
  onOpenReportModal,
  onQuickTextScan,
  onQuickUrlScan,
  onOpenShareModal,
}) => {
  const [selectedVerifyType, setSelectedVerifyType] = useState<NavTab>('text');
  const [quickInput, setQuickInput] = useState('');
  const [quickLoading, setQuickLoading] = useState(false);
  const [quickError, setQuickError] = useState<string | null>(null);

  const [activeTipIndex, setActiveTipIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const [expandedThreatCard, setExpandedThreatCard] = useState<number | null>(null);

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) {
      setQuickError('Please enter text content or a website URL before scanning.');
      return;
    }

    if (selectedVerifyType === 'text') {
      if (quickInput.trim().length < 30) {
        setQuickError(`Sample contains ${quickInput.trim().length} characters. A minimum of 30 characters is required for linguistic burstiness and perplexity analysis.`);
        return;
      }
      setQuickError(null);
      setQuickLoading(true);
      try {
        await onQuickTextScan(quickInput);
        setQuickInput('');
      } catch (err: any) {
        setQuickError(err.message || 'Linguistic analysis request failed.');
      } finally {
        setQuickLoading(false);
      }
    } else if (selectedVerifyType === 'website') {
      let url = quickInput.trim();
      if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
      }
      try {
        new URL(url);
      } catch {
        setQuickError('Please provide a valid, fully formed URL (e.g., https://example.com).');
        return;
      }
      setQuickError(null);
      setQuickLoading(true);
      try {
        await onQuickUrlScan(url);
        setQuickInput('');
      } catch (err: any) {
        setQuickError(err.message || 'Website safety inspection failed.');
      } finally {
        setQuickLoading(false);
      }
    }
  };

  const handleCopyShareLink = async () => {
    try {
      const url = 'https://checked-ai.ai.studio';
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        textarea.style.position = 'fixed';
        textarea.style.left = '-999999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedShareLink(true);
      setTimeout(() => setCopiedShareLink(false), 2400);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredScans = scans.filter(s => {
    const matchesSearch = s.targetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toolsList = [
    {
      id: 'text' as NavTab,
      name: 'Text Check',
      badge: 'Linguistic Analysis',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: FileText,
      iconColor: 'text-purple-600 bg-purple-50 border-purple-100',
      description: 'Analyze written articles, emails, and papers for perplexity uniformity, low burstiness, and formulaic AI language markers.'
    },
    {
      id: 'image' as NavTab,
      name: 'Image Check',
      badge: 'Vision Forensics',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: ImageIcon,
      iconColor: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      description: 'Inspect visual media for generative diffusion artifacts, metadata continuity, semantic anomalies, and face manipulation.'
    },
    {
      id: 'website' as NavTab,
      name: 'Website Check',
      badge: 'Threat Shield',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: Globe,
      iconColor: 'text-blue-600 bg-blue-50 border-blue-100',
      description: 'Evaluate URLs for deceptive phishing patterns, domain typosquatting, SSL certificate irregularities, and threat indicators.'
    },
    {
      id: 'video' as NavTab,
      name: 'Video Check',
      badge: 'Deepfake Detection',
      badgeColor: 'bg-violet-50 text-violet-700 border-violet-200',
      icon: Video,
      iconColor: 'text-violet-600 bg-violet-50 border-violet-100',
      description: 'Scan video recordings for synthetic face-swaps, temporal frame jitter, lip-sync inconsistencies, and generative filters.'
    },
    {
      id: 'audio' as NavTab,
      name: 'Audio Check',
      badge: 'Voice Forensics',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Mic,
      iconColor: 'text-amber-600 bg-amber-50 border-amber-100',
      description: 'Assess audio clips and voice memos for synthetic voice cloning artifacts, vocoder frequency cutoffs, and clone fingerprints.'
    },
    {
      id: 'file' as NavTab,
      name: 'File Check',
      badge: 'Document Integrity',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: FileCheck2,
      iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      description: 'Inspect PDF, DOCX, and raw binaries for synthetic text insertions, hidden embedded payloads, and metadata anomalies.'
    }
  ];

  const currentTip = SAFETY_TIPS[activeTipIndex];

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10 max-w-7xl mx-auto pb-12">
      {/* =========================================================================
          OFFICIAL MOBILE INTERFACE (Recreated from Reference Design Screenshot)
          Visible on Mobile & Tablet devices (< 1024px)
         ========================================================================= */}
      <div className="block lg:hidden space-y-5">
        {/* Mobile Header (Brand, Tagline, Notification Bell) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs shrink-0">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-base font-bold text-slate-900 leading-tight">
                Checked <span className="text-blue-600">AI</span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                Verify Before You Trust
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('alerts')}
            className="relative p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            title="Threat Alerts"
            aria-label="Threat Alerts"
          >
            <Bell className="w-5 h-5 text-slate-700" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>
        </div>

        {/* Welcome Greeting */}
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome back!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
            Verify Before You Trust. Analyze AI-generated images, videos, text, websites, and online scams with intelligent verification powered by Checked AI.
          </p>
        </div>

        {/* Quick Search & Scan Bar */}
        <div
          onClick={() => onNavigate('text')}
          className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs cursor-pointer hover:border-blue-400 transition-all"
        >
          <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
          <span className="text-xs text-slate-400 truncate flex-1">
            Paste text, website URL or upload a ...
          </span>
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Scan className="w-4 h-4" />
          </div>
        </div>

        {/* 2x3 Grid of 6 Feature Cards (Matching Screenshot Exactly) */}
        <div className="grid grid-cols-2 gap-3.5">
          {/* 1. Image Check */}
          <div
            onClick={() => onNavigate('image')}
            className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between h-40 active:scale-[0.98]"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                Image Check
              </div>
              <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                Detect AI generated or manipulated images
              </div>
            </div>
            <div className="flex justify-end pt-1">
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* 2. Text Check */}
          <div
            onClick={() => onNavigate('text')}
            className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between h-40 active:scale-[0.98]"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                Text Check
              </div>
              <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                Check if text is AI generated or scam
              </div>
            </div>
            <div className="flex justify-end pt-1">
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* 3. Website Check */}
          <div
            onClick={() => onNavigate('website')}
            className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-purple-300 transition-all cursor-pointer flex flex-col justify-between h-40 active:scale-[0.98]"
          >
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                Website Check
              </div>
              <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                Check website safety, scam or phishing
              </div>
            </div>
            <div className="flex justify-end pt-1">
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* 4. Video Check */}
          <div
            onClick={() => onNavigate('video')}
            className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-amber-300 transition-all cursor-pointer flex flex-col justify-between h-40 active:scale-[0.98]"
          >
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                Video Check
              </div>
              <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                Detect deepfake or AI generated videos
              </div>
            </div>
            <div className="flex justify-end pt-1">
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* 5. Voice Check */}
          <div
            onClick={() => onNavigate('audio')}
            className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-rose-300 transition-all cursor-pointer flex flex-col justify-between h-40 active:scale-[0.98]"
          >
            <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                Voice Check
              </div>
              <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                Detect AI generated or cloned voices
              </div>
            </div>
            <div className="flex justify-end pt-1">
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* 6. History */}
          <div
            onClick={() => onNavigate('history')}
            className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between h-40 active:scale-[0.98]"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                History
              </div>
              <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                View your previous checks and results
              </div>
            </div>
            <div className="flex justify-end pt-1">
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Mobile Daily Safety Tip */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 text-white shadow-xs border border-purple-800/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-wider uppercase text-purple-300 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Daily Safety Tip</span>
            </span>
            <span className="text-[9px] bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded font-medium">
              {currentTip.category}
            </span>
          </div>
          <p className="text-xs text-slate-100 leading-relaxed font-medium">
            "{currentTip.tip}"
          </p>
        </div>

        {/* Mobile APK Quick Card */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Checked AI Mobile (v1.0.3)</div>
              <div className="text-[10px] text-slate-500">Universal Android Release · 113 KB</div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('apk')}
            className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shrink-0 cursor-pointer"
          >
            Get APK
          </button>
        </div>
      </div>

      {/* =========================================================================
          DESKTOP INTERFACE (Visible on Desktop Displays >= 1024px)
         ========================================================================= */}
      <div className="hidden lg:block space-y-8 sm:space-y-10">
        {/* 1. PREMIUM WELCOME HERO SECTION */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A0F1D] via-[#161233] to-[#0D1B36] border border-indigo-900/40 text-white shadow-xl">
          {/* Subtle decorative purple glow & grid elements */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-16 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative p-6 sm:p-8 lg:p-12 z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-400/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Checked AI Platform · Verify Before You Trust</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
              Your Digital Safety <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-300 to-indigo-400">
                Starts Here
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
              Verify digital content, investigate suspicious websites, and explore tools designed to help you make more informed decisions online.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <button
                onClick={() => scrollToSection('verification-panel')}
                className="px-5 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 shadow-lg shadow-indigo-600/25 transition-all flex items-center gap-2 hover:scale-[1.02] cursor-pointer"
              >
                <Zap className="w-4 h-4 text-indigo-200" />
                <span>Start Verification</span>
              </button>

              <button
                onClick={() => scrollToSection('tools-grid')}
                className="px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 hover:text-white bg-white/10 hover:bg-white/15 active:bg-white/20 border border-white/15 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Explore All Tools</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Right Hero Visual Card */}
          <div className="shrink-0 lg:max-w-xs w-full bg-slate-900/60 border border-indigo-500/20 rounded-2xl p-5 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono font-medium text-slate-300">System Ready</span>
              </div>
              <span className="text-[11px] font-mono text-indigo-300">v1.4.0 Engine</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Text Perplexity & Burstiness:</span>
                <span className="text-emerald-400 font-mono font-semibold">Active</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Website Threat Inspection:</span>
                <span className="text-emerald-400 font-mono font-semibold">Active</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Multi-Modal Forensics:</span>
                <span className="text-indigo-300 font-mono font-semibold">6 Modules</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Zero client telemetry · Private analysis</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. QUICK VERIFICATION PANEL */}
      <section id="verification-panel" className="scroll-mt-20 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 transition-all">
        <div className="max-w-3xl mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
            <Scan className="w-3.5 h-3.5" />
            <span>Interactive Verification Console</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            What Would You Like to Verify?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Select a verification type below to inspect raw text, check web security, or jump straight into specialized media forensic scanners.
          </p>
        </div>

        {/* Verification Type Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-slate-100 scrollbar-none">
          {[
            { id: 'text' as NavTab, label: 'Text Check', icon: FileText, directInput: true },
            { id: 'website' as NavTab, label: 'Website Check', icon: Globe, directInput: true },
            { id: 'image' as NavTab, label: 'Image Check', icon: ImageIcon, directInput: false },
            { id: 'video' as NavTab, label: 'Video Check', icon: Video, directInput: false },
            { id: 'audio' as NavTab, label: 'Audio Check', icon: Mic, directInput: false },
            { id: 'file' as NavTab, label: 'File Check', icon: FileCheck2, directInput: false },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = selectedVerifyType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedVerifyType(tab.id);
                  setQuickError(null);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100/80 hover:bg-slate-200/70 text-slate-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Direct Input Workflow for Text & Website */}
        {(selectedVerifyType === 'text' || selectedVerifyType === 'website') && (
          <form onSubmit={handleQuickSubmit} className="space-y-4">
            {selectedVerifyType === 'text' ? (
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="font-semibold text-slate-700">Paste Text Content</span>
                  <span className="font-mono">{quickInput.length} characters (min. 30)</span>
                </div>
                <textarea
                  rows={4}
                  value={quickInput}
                  onChange={(e) => setQuickInput(e.target.value)}
                  placeholder="Paste article, essay, or message excerpt here to evaluate for generative AI perplexity, sentence burstiness, and formulaic stylistic cadence..."
                  className="w-full p-4 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                />
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="font-semibold text-slate-700">Target Website Address</span>
                  <span>Inspects SSL, typosquatting & reputation</span>
                </div>
                <input
                  type="text"
                  value={quickInput}
                  onChange={(e) => setQuickInput(e.target.value)}
                  placeholder="Enter complete web address (e.g., https://example-security.com/login)..."
                  className="w-full p-4 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                />
              </div>
            )}

            {quickError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircleIcon className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="font-medium">{quickError}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Heuristic & algorithmic forensic analysis running in-browser</span>
              </div>

              <div className="flex items-center gap-2.5">
                {quickInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuickInput('');
                      setQuickError(null);
                    }}
                    className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    Clear
                  </button>
                )}

                <button
                  type="submit"
                  disabled={quickLoading || !quickInput.trim()}
                  className="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 disabled:pointer-events-none rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {quickLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying Sample...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-indigo-200" />
                      <span>Verify Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Specialized File & Media Module Router for Image, Video, Audio, File */}
        {selectedVerifyType !== 'text' && selectedVerifyType !== 'website' && (
          <div className="p-6 sm:p-8 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 uppercase tracking-wider">
                <UploadCloud className="w-4 h-4" />
                <span>Specialized Media Module Required</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {selectedVerifyType === 'image' && 'Image AI Forensic Analysis'}
                {selectedVerifyType === 'video' && 'Video Deepfake Frame Evaluation'}
                {selectedVerifyType === 'audio' && 'Voice Synthesis & Audio Forensics'}
                {selectedVerifyType === 'file' && 'Document & Binary Verification'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {selectedVerifyType === 'image' && 'Image verification requires high-resolution raster analysis, diffusion artifact inspection, and metadata consistency checks. Launch the dedicated Image Check module to upload or drag-and-drop your asset.'}
                {selectedVerifyType === 'video' && 'Video deepfake analysis requires multi-frame temporal inspection, facial boundary tracking, and audio-video synchrony analysis. Open the specialized Video Check workbench.'}
                {selectedVerifyType === 'audio' && 'Voice cloning detection evaluates vocal frequency spectrums, neural vocoder artifacts, and audio compression anomalies. Launch the dedicated Audio Check lab.'}
                {selectedVerifyType === 'file' && 'Document inspection parses file structure, embedded script payloads, and metadata markers across PDF, DOCX, and binaries. Open the File Check tool.'}
              </p>
            </div>

            <button
              onClick={() => onNavigate(selectedVerifyType)}
              className="px-5 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-all shadow-sm flex items-center gap-2 shrink-0 cursor-pointer hover:scale-[1.02]"
            >
              <span>Open {selectedVerifyType.charAt(0).toUpperCase() + selectedVerifyType.slice(1)} Check Module</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

      {/* 3. INTERACTIVE AI SECURITY TOOLS GRID */}
      <section id="tools-grid" className="scroll-mt-20 space-y-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Detection Suite</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            AI Security & Authenticity Tools
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Explore dedicated forensic tools built to analyze authenticity across text, images, websites, video, audio, and documents.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {toolsList.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                onClick={() => onNavigate(tool.id)}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-400 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${tool.iconColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tool.badgeColor}`}>
                      {tool.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
                  <span>Launch Tool</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. DAILY SAFETY TIP (Interactive Rotation) */}
      <section className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-purple-800/40 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 max-w-2xl">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-400/30 text-purple-300 flex items-center justify-center shrink-0 shadow-inner">
              <Lightbulb className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                  Your Daily Safety Tip
                </span>
                <span className="text-[10px] bg-purple-500/30 text-purple-200 border border-purple-400/30 font-semibold px-2 py-0.2 rounded-full">
                  {currentTip.category}
                </span>
              </div>

              <blockquote className="text-sm sm:text-base font-medium text-white leading-relaxed">
                "{currentTip.tip}"
              </blockquote>

              <p className="text-xs text-purple-200/80 leading-relaxed pt-0.5">
                {currentTip.context}
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3 self-end md:self-center shrink-0">
            <div className="text-xs font-mono text-purple-300 mr-1">
              {activeTipIndex + 1} / {SAFETY_TIPS.length}
            </div>

            <button
              onClick={() => setActiveTipIndex((prev) => (prev === 0 ? SAFETY_TIPS.length - 1 : prev - 1))}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/10 text-white transition-colors cursor-pointer"
              title="Previous safety tip"
              aria-label="Previous tip"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTipIndex((prev) => (prev === SAFETY_TIPS.length - 1 ? 0 : prev + 1))}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/10 text-white transition-colors cursor-pointer"
              title="Next safety tip"
              aria-label="Next tip"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. SECURITY AWARENESS SECTION */}
      <section className="space-y-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">
            <Shield className="w-3.5 h-3.5" />
            <span>Educational Guidance</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Stay Ahead of Digital Threats
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Practical knowledge to help you identify synthetic media, manipulation tactics, and deceptive online content.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Spot AI-Generated Content */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 flex flex-col justify-between shadow-xs hover:border-purple-300 transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Spot AI-Generated Content
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Large language models frequently generate text characterized by rigid syntactic symmetry, lack of emotional nuance, and predictable transitional phrases like "Furthermore" or "In conclusion".
              </p>

              {expandedThreatCard === 1 && (
                <div className="pt-2 text-xs text-slate-700 space-y-1.5 border-t border-slate-100">
                  <div className="font-semibold text-slate-900">Key Forensic Signals:</div>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    <li>Minimal variance in sentence length (low burstiness).</li>
                    <li>Absence of personal idioms or domain-specific slang.</li>
                    <li>Overly diplomatic and perfectly balanced structure.</li>
                  </ul>
                </div>
              )}
            </div>

            <button
              onClick={() => setExpandedThreatCard(expandedThreatCard === 1 ? null : 1)}
              className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center justify-between cursor-pointer"
            >
              <span>{expandedThreatCard === 1 ? 'Show Less' : 'Learn Detection Signs'}</span>
              <ChevronRight className={`w-3.5 h-3.5 transform transition-transform ${expandedThreatCard === 1 ? 'rotate-90' : ''}`} />
            </button>
          </div>

          {/* Card 2: Recognize Potential Deepfakes */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 flex flex-col justify-between shadow-xs hover:border-indigo-300 transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Recognize Potential Deepfakes
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Synthesized videos and generated portraits struggle with natural boundary physics. Pay close attention to inconsistent ear symmetry, teeth alignment, eye blink patterns, and pupil reflections.
              </p>

              {expandedThreatCard === 2 && (
                <div className="pt-2 text-xs text-slate-700 space-y-1.5 border-t border-slate-100">
                  <div className="font-semibold text-slate-900">Key Forensic Signals:</div>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    <li>Unnatural blur where hair meets complex backgrounds.</li>
                    <li>Reflections in eyes that do not match the environment.</li>
                    <li>Audio that is fractions of a second out of sync with lips.</li>
                  </ul>
                </div>
              )}
            </div>

            <button
              onClick={() => setExpandedThreatCard(expandedThreatCard === 2 ? null : 2)}
              className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center justify-between cursor-pointer"
            >
              <span>{expandedThreatCard === 2 ? 'Show Less' : 'Learn Detection Signs'}</span>
              <ChevronRight className={`w-3.5 h-3.5 transform transition-transform ${expandedThreatCard === 2 ? 'rotate-90' : ''}`} />
            </button>
          </div>

          {/* Card 3: Avoid Suspicious Websites */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 flex flex-col justify-between shadow-xs hover:border-blue-300 transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Avoid Suspicious Websites
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Phishing operators design lookalike landing pages with subtle domain typosquatting and fake urgency messages to trick users into divulging authentication credentials.
              </p>

              {expandedThreatCard === 3 && (
                <div className="pt-2 text-xs text-slate-700 space-y-1.5 border-t border-slate-100">
                  <div className="font-semibold text-slate-900">Key Forensic Signals:</div>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    <li>Domain character substitutions (e.g., 'paypa1.com').</li>
                    <li>Countdown timers pressuring immediate action.</li>
                    <li>Unverified SSL certificates registered very recently.</li>
                  </ul>
                </div>
              )}
            </div>

            <button
              onClick={() => setExpandedThreatCard(expandedThreatCard === 3 ? null : 3)}
              className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-between cursor-pointer"
            >
              <span>{expandedThreatCard === 3 ? 'Show Less' : 'Learn Detection Signs'}</span>
              <ChevronRight className={`w-3.5 h-3.5 transform transition-transform ${expandedThreatCard === 3 ? 'rotate-90' : ''}`} />
            </button>
          </div>
        </div>
      </section>

      {/* 6. MOBILE APK & ANDROID APP BANNER */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-950 rounded-3xl text-white p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 border border-blue-800/40">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Checked AI for Android (v1.0.3 APK)
              </h2>
              <span className="text-[10px] bg-blue-500/30 text-blue-200 border border-blue-400/30 font-bold px-2 py-0.5 rounded-full">
                Available
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
              Verify digital content, detect AI deepfakes, and inspect URLs on your Android device. Features fast Trust Score calculations and offline verification vault.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('apk')}
            className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download APK (113 KB)</span>
          </button>
          <button
            onClick={() => onNavigate('apk')}
            className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/15 cursor-pointer"
          >
            <span>Live Phone Preview</span>
          </button>
        </div>
      </div>

      {/* 7. SHARE WITH FRIENDS SECTION */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 rounded-3xl text-white p-6 sm:p-8 shadow-xs border border-purple-800/40 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-400/30 text-purple-300 flex items-center justify-center shrink-0 shadow-md">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Share Checked AI with Friends
              </h2>
              <span className="text-[10px] bg-purple-500/30 text-purple-200 border border-purple-400/30 font-bold px-2 py-0.5 rounded-full">
                Verify Before You Trust
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
              Help your network evaluate digital content for synthetic generation, deepfake indicators, and deceptive phishing. Share instantly across WhatsApp, Facebook, Messenger, and more.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => {
              if (onOpenShareModal) onOpenShareModal();
            }}
            className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-xl transition-all shadow-sm flex items-center gap-2 hover:scale-[1.02] cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Share App</span>
          </button>

          <button
            onClick={handleCopyShareLink}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all border flex items-center gap-1.5 cursor-pointer ${
              copiedShareLink
                ? 'bg-emerald-600 border-emerald-500 text-white'
                : 'bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white border-white/15'
            }`}
          >
            {copiedShareLink ? (
              <>
                <Check className="w-4 h-4" />
                <span>Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Link</span>
              </>
            )}
          </button>

          <button
            onClick={() => onNavigate('invite')}
            className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-purple-300 hover:text-purple-200 bg-purple-900/50 hover:bg-purple-900/80 border border-purple-700/50 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>Invite Page & Rewards</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 8. RECENT AUDITS & VERIFICATIONS TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Recent Verifications
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live audit records for inspected digital assets and threat intelligence signals.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scans..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 py-1.5 px-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
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

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Asset / Target</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Assessment Status</th>
                <th className="px-5 py-3 text-right">Confidence</th>
                <th className="px-5 py-3">Connected Engine</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredScans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-500">
                    No scans matching the current search criteria.
                  </td>
                </tr>
              ) : (
                filteredScans.slice(0, 8).map((scan) => (
                  <tr key={scan.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3 font-semibold text-slate-900 max-w-xs truncate">
                      <div className="truncate" title={scan.targetName}>
                        {scan.targetName}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 mt-0.5">
                        <span>{scan.id}</span>
                        {scan.isBenchmark ? (
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-sans font-medium">
                            Benchmark
                          </span>
                        ) : (
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-sans font-bold">
                            Live User
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

                    <td className="px-5 py-3 text-slate-600 truncate max-w-[160px]">
                      {scan.modelUsed}
                    </td>

                    <td className="px-5 py-3 text-slate-500 whitespace-nowrap font-mono">
                      {new Date(scan.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-5 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => onOpenReportModal(scan)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded transition-colors cursor-pointer"
                      >
                        <span>Audit Report</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {Math.min(8, filteredScans.length)} of {filteredScans.length} records</span>
          <button
            onClick={() => onNavigate('history')}
            className="font-semibold text-indigo-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <span>View Full Scan History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};

function AlertCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

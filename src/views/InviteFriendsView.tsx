import React, { useState, useEffect } from 'react';
import {
  Users,
  Share2,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  Gift,
  Clock,
  AlertCircle,
  ExternalLink,
  MessageCircle,
  Mail,
  Send,
  Smartphone,
  ArrowRight,
  TrendingUp,
  Award,
  Lock
} from 'lucide-react';
import { UserProfile, ReferralStats } from '../types';
import { api } from '../services/api';
import { OFFICIAL_SHARE_URL, OFFICIAL_SHARE_MESSAGE } from '../components/ShareModal';

interface InviteFriendsViewProps {
  profile: UserProfile | null;
  onOpenShareModal: () => void;
}

export const InviteFriendsView: React.FC<InviteFriendsViewProps> = ({
  profile,
  onOpenShareModal,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(null);
  const [nativeShareSupported, setNativeShareSupported] = useState(false);
  const [nativeShareSuccess, setNativeShareSuccess] = useState(false);

  // Generate deterministic referral code from user profile ID
  const referralCode = profile?.id
    ? `CHK-${profile.id.replace('usr_', '').slice(0, 6).toUpperCase()}`
    : 'CHK-REF982';

  const referralUrl = `${OFFICIAL_SHARE_URL}?ref=${referralCode}`;
  const inviteMessage = `Discover Checked AI — Verify Before You Trust! Check digital content for potential AI-generated material, suspicious websites, and deepfake indicators. Try it here: ${referralUrl}`;

  useEffect(() => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      setNativeShareSupported(true);
    }

    // Fetch backend referral status (future-ready architecture)
    api.getReferralStats()
      .then((stats) => setReferralStats(stats))
      .catch((err) => console.log('Referral stats status:', err));
  }, []);

  const copyToClipboard = async (text: string, type: 'link' | 'message') => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-999999px';
        textarea.style.top = '-999999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      if (type === 'link') {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2400);
      } else {
        setCopiedMessage(true);
        setTimeout(() => setCopiedMessage(false), 2400);
      }
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleNativeShare = async () => {
    if (!navigator.share) {
      onOpenShareModal();
      return;
    }
    try {
      await navigator.share({
        title: 'Checked AI — Verify Before You Trust',
        text: inviteMessage,
        url: referralUrl,
      });
      setNativeShareSuccess(true);
      setTimeout(() => setNativeShareSuccess(false), 3000);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        onOpenShareModal();
      }
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Hero Card */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-lg border border-indigo-800/50 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              <Users className="w-3.5 h-3.5" />
              <span>Community & Growth</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Invite Friends to Checked AI
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Help your colleagues, journalists, students, and family verify digital content before they trust. Share Checked AI to detect AI-generated writing, spot manipulative deepfakes, and audit suspicious links.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenShareModal}
                className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-xl shadow-md transition-all flex items-center gap-2 hover:scale-[1.02]"
              >
                <Share2 className="w-4 h-4" />
                <span>Share with Friends</span>
              </button>

              {nativeShareSupported && (
                <button
                  onClick={handleNativeShare}
                  className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-200 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl transition-all flex items-center gap-2"
                >
                  <Smartphone className="w-4 h-4 text-indigo-300" />
                  <span>Native Mobile Share</span>
                </button>
              )}
            </div>

            {nativeShareSuccess && (
              <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 pt-1 animate-fade-in">
                <Check className="w-4 h-4" />
                <span>Shared successfully via device!</span>
              </div>
            )}
          </div>

          <div className="shrink-0 flex justify-center">
            <div className="relative">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-indigo-600/20 border border-indigo-400/30 flex items-center justify-center p-3 backdrop-blur-xs shadow-inner">
                <img
                  src="/assets/aistudio/file_00000000994c820b934e6d45fd748aac_e53ea1ed.png"
                  alt="Checked AI"
                  className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(79,70,229,0.5)]"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 px-2.5 py-1 bg-indigo-600 text-[10px] font-bold rounded-lg uppercase tracking-wider text-white shadow-sm border border-indigo-400">
                Official
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Sharing & Referral Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Link Generator & Invitation Message (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Unique Referral Link Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Your Unique Referral Link</h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Personalized identifier for tracking invitations
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                Code: {referralCode}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-mono text-slate-700 select-all truncate">
                {referralUrl}
              </div>
              <button
                onClick={() => copyToClipboard(referralUrl, 'link')}
                className={`px-5 py-3 text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs shrink-0 ${
                  copiedLink
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white'
                }`}
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>

            {copiedLink && (
              <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5 animate-pulse">
                <Check className="w-3.5 h-3.5" />
                Invitation link copied to your clipboard. Paste it into any app or message!
              </p>
            )}
          </div>

          {/* Pre-composed Invitation Message Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Official Invitation Message</h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Ready-to-send copy for messengers, email, and social networks
                  </p>
                </div>
              </div>
              {copiedMessage && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-pulse">
                  <Check className="w-3.5 h-3.5" />
                  Copied!
                </span>
              )}
            </div>

            <div className="bg-slate-50/80 rounded-xl border border-slate-200 p-4 relative group">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans italic">
                "{inviteMessage}"
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Checked AI tagline & branding included</span>
              </div>
              <button
                onClick={() => copyToClipboard(inviteMessage, 'message')}
                className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors border ${
                  copiedMessage
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 shadow-2xs'
                }`}
              >
                {copiedMessage ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Message Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Full Message</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Platform Buttons */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">One-Click Share to Apps</h2>
              <button
                onClick={onOpenShareModal}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>More Options</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(inviteMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold transition-colors"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Send className="w-3.5 h-3.5" />
                </div>
                <span>WhatsApp</span>
              </a>

              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}&quote=${encodeURIComponent(inviteMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 text-xs font-semibold transition-colors"
              >
                <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Share2 className="w-3.5 h-3.5" />
                </div>
                <span>Facebook</span>
              </a>

              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(referralUrl)}&text=${encodeURIComponent(inviteMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-3 rounded-xl bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 text-cyan-800 text-xs font-semibold transition-colors"
              >
                <div className="w-6 h-6 rounded-lg bg-cyan-600 text-white flex items-center justify-center shrink-0">
                  <Send className="w-3.5 h-3.5" />
                </div>
                <span>Telegram</span>
              </a>

              <a
                href={`mailto:?subject=${encodeURIComponent('Checked AI — Verify Before You Trust')}&body=${encodeURIComponent(inviteMessage)}`}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-800 text-xs font-semibold transition-colors"
              >
                <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <span>Email Friend</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: How it Works & Referral System Preparation (1 col) */}
        <div className="space-y-6">
          {/* How It Works */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              How Invitations Work
            </h3>
            <ol className="space-y-4 text-xs text-slate-600">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </span>
                <div>
                  <span className="font-semibold text-slate-900 block">Share your link</span>
                  Send your personalized link or pre-composed invite via WhatsApp, message, or email.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </span>
                <div>
                  <span className="font-semibold text-slate-900 block">Friends test content</span>
                  They can immediately scan text, images, or websites for AI generation and manipulation.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </span>
                <div>
                  <span className="font-semibold text-slate-900 block">Promote trust & safety</span>
                  Stop deepfake deception and phishing scams before they spread across your networks.
                </div>
              </li>
            </ol>
          </div>

          {/* Referral System - Explicitly Marked Coming Soon */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-slate-500" />
                <h3 className="text-sm font-bold text-slate-900">Referral Analytics</h3>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 uppercase tracking-wider">
                <Clock className="w-3 h-3" />
                Coming Soon
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Real-time attribution engine is under construction. To protect data honesty, no fabricated numbers are displayed.
            </p>

            {/* Zero Fabricated Stats Indicator */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-400 font-medium">Invites</div>
                <div className="text-lg font-bold font-mono text-slate-400">—</div>
                <div className="text-[10px] text-slate-400">Pending</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-400 font-medium">Joined</div>
                <div className="text-lg font-bold font-mono text-slate-400">—</div>
                <div className="text-[10px] text-slate-400">Pending</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-400 font-medium">Scanned</div>
                <div className="text-lg font-bold font-mono text-slate-400">—</div>
                <div className="text-[10px] text-slate-400">Pending</div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Backend API endpoint <code className="text-indigo-600 font-mono">/api/v1/referrals/stats</code> is wired and awaiting server attribution engine activation.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Future Referral Rewards Roadmap Section - Explicitly Marked Coming Soon */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">Referral Rewards Program</h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200 uppercase tracking-wider">
                  <Clock className="w-3 h-3" />
                  Coming Soon
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Upcoming community benefits for users who help grow the Checked AI verification network
              </p>
            </div>
          </div>
        </div>

        {/* Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tier 1 */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-md">
                Tier 1 · 3 Verified Friends
              </span>
              <Lock className="w-4 h-4 text-slate-400" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">+25 Monthly Forensic Scans</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Earn an ongoing monthly quota bonus for text and vision heuristic verification.
            </p>
            <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <span>Status:</span>
              <span className="text-amber-700 font-medium">Under Development</span>
            </div>
          </div>

          {/* Tier 2 */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-md">
                Tier 2 · 10 Verified Friends
              </span>
              <Lock className="w-4 h-4 text-slate-400" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Priority Deepfake Processing Queue</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bypass high-traffic queues with dedicated model slots for video and audio deepfake analysis.
            </p>
            <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <span>Status:</span>
              <span className="text-amber-700 font-medium">Under Development</span>
            </div>
          </div>

          {/* Tier 3 */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                Tier 3 · 25+ Verified Friends
              </span>
              <Lock className="w-4 h-4 text-slate-400" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Verified Investigator Forensics Badge</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Official verification status on reports, custom PDF watermark, and extended API access.
            </p>
            <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <span>Status:</span>
              <span className="text-amber-700 font-medium">Under Development</span>
            </div>
          </div>
        </div>

        {/* Security & Anti-Fraud Notice */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">Reward Integrity & Server Validation Policy</span>
            <p className="leading-relaxed text-amber-800">
              To prevent fraudulent abuse or false claims, rewards and extra scan allowances are never granted automatically on the client side. Once the referral backend is deployed, rewards will strictly require verified server-side validation and genuine account authentication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Mail,
  Send,
  Smartphone,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  referralCode?: string;
}

export const OFFICIAL_SHARE_URL = 'https://checked-ai.ai.studio';
export const OFFICIAL_SHARE_MESSAGE =
  'Discover Checked AI — Verify Before You Trust! Check digital content for potential AI-generated material, suspicious websites, and deepfake indicators. Try it here: https://checked-ai.ai.studio';

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  referralCode,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [nativeShareSupported, setNativeShareSupported] = useState(false);
  const [nativeShareStatus, setNativeShareStatus] = useState<string | null>(null);

  const effectiveUrl = referralCode
    ? `${OFFICIAL_SHARE_URL}?ref=${referralCode}`
    : OFFICIAL_SHARE_URL;

  const effectiveMessage = referralCode
    ? `Discover Checked AI — Verify Before You Trust! Check digital content for potential AI-generated material, suspicious websites, and deepfake indicators. Try it here: ${effectiveUrl}`
    : OFFICIAL_SHARE_MESSAGE;

  useEffect(() => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      setNativeShareSupported(true);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const handleNativeShare = async () => {
    if (!navigator.share) return;
    setNativeShareStatus(null);
    try {
      await navigator.share({
        title: 'Checked AI — Verify Before You Trust',
        text: effectiveMessage,
        url: effectiveUrl,
      });
      setNativeShareStatus('Shared successfully!');
      setTimeout(() => setNativeShareStatus(null), 3000);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setNativeShareStatus('Device share was dismissed or not available.');
        setTimeout(() => setNativeShareStatus(null), 3000);
      }
    }
  };

  // Direct Social Share Destinations
  const shareChannels = [
    {
      name: 'WhatsApp',
      color: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      ),
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(effectiveMessage)}`,
    },
    {
      name: 'Facebook',
      color: 'bg-blue-600 hover:bg-blue-700 text-white',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(effectiveUrl)}&quote=${encodeURIComponent(effectiveMessage)}`,
    },
    {
      name: 'Messenger',
      color: 'bg-sky-500 hover:bg-sky-600 text-white',
      icon: <MessageCircle className="w-5 h-5" />,
      url: `https://www.facebook.com/dialog/send?link=${encodeURIComponent(effectiveUrl)}&app_id=291494419107518&redirect_uri=${encodeURIComponent(effectiveUrl)}`,
    },
    {
      name: 'Telegram',
      color: 'bg-cyan-600 hover:bg-cyan-700 text-white',
      icon: <Send className="w-5 h-5" />,
      url: `https://t.me/share/url?url=${encodeURIComponent(effectiveUrl)}&text=${encodeURIComponent(effectiveMessage)}`,
    },
    {
      name: 'X (Twitter)',
      color: 'bg-slate-900 hover:bg-black text-white',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(effectiveMessage)}`,
    },
    {
      name: 'LinkedIn',
      color: 'bg-blue-700 hover:bg-blue-800 text-white',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(effectiveUrl)}`,
    },
    {
      name: 'Email',
      color: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      icon: <Mail className="w-5 h-5" />,
      url: `mailto:?subject=${encodeURIComponent('Checked AI — Verify Before You Trust')}&body=${encodeURIComponent(effectiveMessage)}`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-modal-title"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white flex items-center justify-between border-b border-indigo-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 id="share-modal-title" className="text-lg font-bold tracking-tight">
                Share Checked AI
              </h2>
              <p className="text-xs text-indigo-200 font-medium">
                Verify Before You Trust · Protect Friends & Colleagues
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">
          {/* Native Web Share Button (Primary on Mobile Devices) */}
          {nativeShareSupported && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-5 h-5 text-indigo-600 shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      Native Mobile Share
                    </div>
                    <div className="text-xs text-slate-600">
                      Open your phone's native sharing sheet for any app
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleNativeShare}
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share via Device</span>
                </button>
              </div>
              {nativeShareStatus && (
                <div className="mt-2 text-xs font-semibold text-indigo-700 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>{nativeShareStatus}</span>
                </div>
              )}
            </div>
          )}

          {/* Social Channels Grid (Fallback & Direct access) */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
              <span>Direct Share Channels</span>
              <span className="text-[11px] font-normal text-slate-400">One-click launch</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {shareChannels.map((channel) => (
                <a
                  key={channel.name}
                  href={channel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl ${channel.color} text-xs font-semibold shadow-xs hover:shadow-md transition-all active:scale-95`}
                  title={`Share on ${channel.name}`}
                >
                  <span className="shrink-0">{channel.icon}</span>
                  <span className="text-[11px]">{channel.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Copy Official URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>Application Link</span>
              {copiedLink && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-pulse">
                  <Check className="w-3.5 h-3.5" />
                  Copied to clipboard!
                </span>
              )}
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 font-mono truncate select-all">
                {effectiveUrl}
              </div>
              <button
                onClick={() => copyToClipboard(effectiveUrl, 'link')}
                className={`px-4 py-2.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-xs shrink-0 ${
                  copiedLink
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white active:bg-indigo-800'
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
          </div>

          {/* Copy Full Pre-composed Message */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
              <span>Pre-composed Invitation Message</span>
              {copiedMessage && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-pulse">
                  <Check className="w-3.5 h-3.5" />
                  Message copied!
                </span>
              )}
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 leading-relaxed font-sans relative group">
              <p className="italic text-slate-700">"{effectiveMessage}"</p>
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => copyToClipboard(effectiveMessage, 'message')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                    copiedMessage
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs'
                  }`}
                >
                  {copiedMessage ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied Message</span>
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
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Official Checked AI verification link</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

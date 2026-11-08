import React, { useState, useRef } from 'react';
import {
  Video,
  Clapperboard,
  Sparkles,
  UploadCloud,
  Download,
  RefreshCw,
  AlertCircle,
  Play,
  Layers,
  X,
  ShieldCheck,
  CheckCircle2,
  Film
} from 'lucide-react';
import { aiApi } from '../services/aiApi';

interface AiVideoViewProps {
  onSendToVideoCheck?: (filename: string) => void;
}

export const AiVideoView: React.FC<AiVideoViewProps> = ({ onSendToVideoCheck }) => {
  const [tab, setTab] = useState<'text-to-video' | 'animate-image'>('text-to-video');
  const [prompt, setPrompt] = useState('A sleek futuristic digital cyber shield floating in dark cyberspace with glowing blue cryptographic data nodes.');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [duration, setDuration] = useState('10s');
  const [resolution, setResolution] = useState('720p');

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleTextPrompts = [
    "A sleek futuristic digital cyber shield floating in dark cyberspace with glowing blue cryptographic data nodes.",
    "Cinematic macro shot of computer microchip with flowing streams of cyan light representing verified data integrity.",
    "A digital padlock opening smoothly with neon particle burst on high-tech obsidian server background.",
    "Drone shot gliding over a futuristic smart city with glowing cyber grid security shields overhead."
  ];

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a standard image file (PNG, JPG, WEBP).');
      return;
    }
    setError(null);
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;
    setError(null);
    setLoading(true);

    try {
      if (tab === 'text-to-video') {
        const res = await aiApi.generateVideo({
          prompt: prompt.trim(),
          aspectRatio,
          duration,
          resolution
        });
        setGeneratedVideoUrl(res.videoUrl);
      } else {
        if (!imagePreview) {
          setError('Please upload a photo to animate.');
          setLoading(false);
          return;
        }
        const res = await aiApi.animateImageToVideo({
          imageBase64: imagePreview,
          mimeType: imageFile?.type || 'image/png',
          prompt: prompt.trim(),
          aspectRatio
        });
        setGeneratedVideoUrl(res.videoUrl);
      }
    } catch (err: any) {
      setError(err.message || 'Video generation failed. Omni Flash models require a billing-enabled key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
          <Clapperboard className="w-4 h-4" />
          <span>Checked AI · Omni Video Studio</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          AI Video Generation & Animation
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Generate high-definition video from text or animate photos into motion with <strong>gemini-omni-1.2-flash</strong> via the Gemini Interactions API.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200 p-2 shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setTab('text-to-video');
              setError(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tab === 'text-to-video'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5" />
              <span>Generate Video from Text</span>
            </div>
          </button>

          <button
            onClick={() => {
              setTab('animate-image');
              setError(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tab === 'animate-image'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Animate Images into Video</span>
            </div>
          </button>
        </div>

        <div className="text-xs text-slate-500 font-mono hidden sm:block pr-3">
          Model: <span className="font-bold text-slate-800">gemini-omni-1.2-flash</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-5">
          {/* Animate Mode Image Uploader */}
          {tab === 'animate-image' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Starting Frame Photo:
              </label>

              {!imagePreview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50 rounded-xl p-6 text-center cursor-pointer transition-all"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleImageUpload(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                  <UploadCloud className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-xs font-bold text-slate-700">Click to upload starting frame</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, or WEBP up to 25MB</div>
                </div>
              ) : (
                <div className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-100">
                  <img
                    src={imagePreview}
                    alt="Starting Frame"
                    className="w-full h-36 object-contain"
                  />
                  <button
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 p-1 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Prompt */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              {tab === 'text-to-video' ? 'Video Scene Description:' : 'Motion & Animation Prompt:'}
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              placeholder={
                tab === 'text-to-video'
                  ? 'Describe camera movements, action, subjects, environment, and lighting...'
                  : 'Describe how the photo should animate (e.g. camera zooms in, subtle head turn, wind blowing through hair)...'
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
            />
          </div>

          {/* Aspect Ratio (Required 16:9 landscape or 9:16 portrait) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Aspect Ratio (Interactions API Standard):
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAspectRatio('16:9')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                  aspectRatio === '16:9'
                    ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                16:9 (Landscape)
              </button>
              <button
                type="button"
                onClick={() => setAspectRatio('9:16')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                  aspectRatio === '9:16'
                    ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                9:16 (Portrait)
              </button>
            </div>
          </div>

          {/* Sample Prompts */}
          {tab === 'text-to-video' && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                Preset Scenes:
              </span>
              <div className="space-y-1">
                {sampleTextPrompts.map((sp, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPrompt(sp)}
                    className="w-full text-left text-[11px] p-2 rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-600 border border-slate-200/80 transition-colors truncate block cursor-pointer"
                  >
                    {sp}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating with Omni Flash via Interactions API...</span>
              </>
            ) : (
              <>
                <Clapperboard className="w-4 h-4" />
                <span>{tab === 'text-to-video' ? 'Generate Video' : 'Animate Image'}</span>
              </>
            )}
          </button>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="leading-tight">{error}</span>
            </div>
          )}
        </div>

        {/* Video Canvas Output Column (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">
              Video Player & Render Canvas
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              Aspect: {aspectRatio}
            </span>
          </div>

          <div className="min-h-[380px] bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center p-4 overflow-hidden relative">
            {generatedVideoUrl ? (
              <video
                src={generatedVideoUrl}
                controls
                autoPlay
                loop
                className="max-h-[460px] w-auto max-w-full rounded-lg shadow-2xl object-contain"
              />
            ) : loading ? (
              <div className="flex flex-col items-center justify-center text-white space-y-4 p-8 text-center">
                <div className="w-14 h-14 border-3 border-blue-500 border-t-white rounded-full animate-spin" />
                <div className="text-sm font-bold">Rendering Temporal Video Sequence...</div>
                <div className="text-xs text-slate-400 max-w-sm leading-relaxed">
                  The Interactions API is compiling frame continuity with <strong>gemini-omni-1.2-flash</strong> at {aspectRatio}. Video operations take 30–90 seconds.
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-400 space-y-2 p-8">
                <Video className="w-12 h-12 mx-auto stroke-1 text-slate-600" />
                <div className="text-xs font-semibold text-slate-300">No video generated yet</div>
                <div className="text-[11px] text-slate-500 max-w-xs">
                  Configure your prompt or upload an image, select aspect ratio (16:9 or 9:16), and click generate.
                </div>
              </div>
            )}
          </div>

          {generatedVideoUrl && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <a
                href={generatedVideoUrl}
                download={`checked-ai-omni-video-${Date.now()}.mp4`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download MP4</span>
              </a>

              {onSendToVideoCheck && (
                <button
                  type="button"
                  onClick={() => onSendToVideoCheck('Omni_Flash_Synthesized_Video.mp4')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Inspect in Video Deepfake Check</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

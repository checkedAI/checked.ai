import React, { useState, useRef } from 'react';
import {
  Image as ImageIcon,
  Sparkles,
  UploadCloud,
  Download,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  Edit3,
  Layers,
  Sliders,
  CheckCircle2,
  ZoomIn,
  X
} from 'lucide-react';
import { aiApi } from '../services/aiApi';

interface AiImageViewProps {
  onSendToImageCheck?: (base64: string, mime: string, filename: string) => void;
}

export const AiImageView: React.FC<AiImageViewProps> = ({ onSendToImageCheck }) => {
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [prompt, setPrompt] = useState('A photorealistic digital cyber safety badge with neon blue shields and crystalline circuit textures.');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3' | '3:4'>('1:1');
  const [imageSize, setImageSize] = useState<'1K' | '2K'>('1K');
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [modelUsed, setModelUsed] = useState<string>('gemini-nano-banana-2.1');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const samplePrompts = [
    "A photorealistic portrait of an AI cyber forensic investigator examining holographic threat code.",
    "A glowing digital fingerprint dissolving into secure binary particles on navy obsidian background.",
    "An authentic high-resolution studio photo of a retro security terminal with CRT monitor glare.",
    "A sleek metallic shield emblem with cyan lighting, minimalist geometric cyber styling."
  ];

  const handleProcessEditUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a standard PNG, JPEG, or WEBP image.');
      return;
    }
    setError(null);
    setEditImageFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setEditImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;
    setError(null);
    setLoading(true);

    try {
      if (mode === 'create') {
        const res = await aiApi.generateImage({
          prompt: prompt.trim(),
          aspectRatio,
          imageSize
        });
        setGeneratedImage(res.imageUrl);
        setModelUsed(res.model);
      } else {
        if (!editImagePreview) {
          setError('Please upload an image to edit.');
          setLoading(false);
          return;
        }
        const res = await aiApi.editImage({
          prompt: prompt.trim(),
          imageBase64: editImagePreview,
          mimeType: editImageFile?.type || 'image/png'
        });
        setGeneratedImage(res.imageUrl);
        setModelUsed(res.model);
      }
    } catch (err: any) {
      setError(err.message || 'Image generation failed. Please verify your prompt and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyInCheck = () => {
    if (!generatedImage || !onSendToImageCheck) return;
    const mime = generatedImage.split(';')[0].replace('data:', '') || 'image/png';
    const cleanBase64 = generatedImage.replace(/^data:image\/\w+;base64,/, '');
    onSendToImageCheck(cleanBase64, mime, `nano_banana_generated_${Date.now()}.png`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
          <ImageIcon className="w-4 h-4" />
          <span>Checked AI · Image Creation & Forensics Lab</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Create & Edit Images with Gemini
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Generate photorealistic digital imagery from text prompts or edit existing visuals with precision using <strong>gemini-nano-banana-2.1</strong>.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200 p-2 shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('create')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'create'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create from Prompt</span>
            </div>
          </button>

          <button
            onClick={() => setMode('edit')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'edit'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Existing Image</span>
            </div>
          </button>
        </div>

        <div className="text-xs text-slate-500 font-mono hidden sm:block pr-3">
          Model: <span className="font-bold text-slate-800">gemini-nano-banana-2.1</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-5">
          {mode === 'edit' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Source Image to Edit:
              </label>

              {!editImagePreview ? (
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
                        handleProcessEditUpload(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                  <UploadCloud className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-xs font-bold text-slate-700">Click to upload image</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WEBP up to 25MB</div>
                </div>
              ) : (
                <div className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-100">
                  <img
                    src={editImagePreview}
                    alt="Source"
                    className="w-full h-36 object-contain"
                  />
                  <button
                    onClick={() => {
                      setEditImageFile(null);
                      setEditImagePreview(null);
                    }}
                    className="absolute top-2 right-2 p-1 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Text Prompt */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              {mode === 'create' ? 'Image Generation Prompt:' : 'Edit Instructions:'}
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              placeholder={
                mode === 'create'
                  ? 'Describe subjects, composition, lighting, style, colors...'
                  : 'Specify what to add, remove, recolor, or modify...'
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
            />
          </div>

          {/* Create Configs (Aspect Ratio & Resolution) */}
          {mode === 'create' && (
            <div className="space-y-4 pt-1">
              {/* Aspect Ratio */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-2 block">
                  Aspect Ratio:
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {(['1:1', '16:9', '9:16', '4:3', '3:4'] as const).map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setAspectRatio(ratio)}
                      className={`py-1.5 px-2 text-xs font-bold rounded-lg border transition-all text-center cursor-pointer ${
                        aspectRatio === ratio
                          ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-2xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Size */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-2 block">
                  Resolution:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['1K', '2K'] as const).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setImageSize(size)}
                      className={`py-1.5 px-3 text-xs font-bold rounded-lg border transition-all text-center cursor-pointer ${
                        imageSize === size
                          ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-2xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {size} Resolution
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Presets */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
              Sample Prompts:
            </span>
            <div className="space-y-1">
              {samplePrompts.map((sp, idx) => (
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

          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating with Nano Banana 2.1...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{mode === 'create' ? 'Generate Image' : 'Apply Image Edits'}</span>
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

        {/* Preview Column (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">
              Studio Canvas Preview
            </h2>
            {generatedImage && (
              <span className="text-xs text-slate-500 font-mono">
                {modelUsed}
              </span>
            )}
          </div>

          <div className="min-h-[380px] bg-slate-950 rounded-2xl border border-slate-200 flex items-center justify-center p-4 overflow-hidden relative">
            {generatedImage ? (
              <img
                src={generatedImage}
                alt="Generated Output"
                className="max-h-[460px] w-auto max-w-full rounded-lg object-contain shadow-2xl"
              />
            ) : loading ? (
              <div className="flex flex-col items-center justify-center text-white space-y-3 p-8 text-center">
                <div className="w-12 h-12 border-3 border-blue-500 border-t-white rounded-full animate-spin" />
                <div className="text-sm font-bold">Synthesizing High-Resolution Image...</div>
                <div className="text-xs text-slate-400 max-w-xs">
                  Diffusion latent tensors being sampled with gemini-nano-banana-2.1.
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-400 space-y-2 p-8">
                <ImageIcon className="w-12 h-12 mx-auto stroke-1 text-slate-600" />
                <div className="text-xs font-semibold text-slate-300">No image generated yet</div>
                <div className="text-[11px] text-slate-500 max-w-xs">
                  Enter a text description and click generate to create or edit your image.
                </div>
              </div>
            )}
          </div>

          {generatedImage && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <a
                  href={generatedImage}
                  download={`checked-ai-image-${Date.now()}.png`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PNG</span>
                </a>
              </div>

              {onSendToImageCheck && (
                <button
                  type="button"
                  onClick={handleVerifyInCheck}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Verify with Image Check</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

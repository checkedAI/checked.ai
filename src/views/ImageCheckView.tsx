import React, { useState, useRef } from 'react';
import {
  Image as ImageIcon,
  UploadCloud,
  FileCheck2,
  AlertCircle,
  Zap,
  Info,
  X,
  Eye,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { ScanResult } from '../types';
import { ResultCard } from '../components/ResultCard';

interface ImageCheckViewProps {
  onScanImage: (base64: string, mime: string, filename: string) => Promise<ScanResult>;
  onOpenReportModal: (scan: ScanResult) => void;
}

export const ImageCheckView: React.FC<ImageCheckViewProps> = ({
  onScanImage,
  onOpenReportModal
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSizeBytes = 15 * 1024 * 1024; // 15MB

  const handleProcessFile = (selectedFile: File) => {
    if (!supportedFormats.includes(selectedFile.type.toLowerCase())) {
      setError('Unsupported file type. Please upload a JPG, JPEG, PNG, or WEBP image.');
      return;
    }
    if (selectedFile.size > maxSizeBytes) {
      setError('File size exceeds the 15MB limit. Please upload an optimized image.');
      return;
    }

    setError(null);
    setFile(selectedFile);
    setResult(null);

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleSelectSample = async (type: 'synthetic' | 'authentic') => {
    setError(null);
    setResult(null);

    const sampleUrl = type === 'synthetic'
      ? '/src/assets/images/sample_synthetic_portrait_1793250192276.jpg'
      : '/src/assets/images/sample_genuine_landscape_1793250193129.jpg';

    const filename = type === 'synthetic'
      ? 'Sample_AI_Generated_Portrait.jpg'
      : 'Sample_Authentic_Landscape.jpg';

    try {
      const res = await fetch(sampleUrl);
      const blob = await res.blob();
      const mockFile = new File([blob], filename, { type: 'image/jpeg' });
      handleProcessFile(mockFile);
    } catch {
      setPreviewUrl(sampleUrl);
      setFile(new File([], filename, { type: 'image/jpeg' }));
    }
  };

  const handleAnalyze = async () => {
    if (!previewUrl || !file) {
      setError('Please upload or select an image first.');
      return;
    }

    setLoading(true);
    setError(null);
    setProgress(15);

    const progressTimer = setInterval(() => {
      setProgress(p => (p < 85 ? p + 18 : p));
    }, 250);

    try {
      const scanRes = await onScanImage(previewUrl, file.type || 'image/jpeg', file.name);
      clearInterval(progressTimer);
      setProgress(100);
      setResult(scanRes);
    } catch (err: any) {
      clearInterval(progressTimer);
      setError(err.message || 'Image analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
          <ImageIcon className="w-4 h-4" />
          <span>Checked AI · Computer Vision Artifact Core</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Image AI Generation & Deepfake Detection
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
          Inspect visual assets for diffusion frequency anomalies, synthetic edge blending, specular reflection vectors, and camera sensor noise floor invariants.
        </p>
      </div>

      {/* Main Upload Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-6">
        {/* Sample preset buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="text-xs text-slate-500 font-medium">
            Supported formats: <span className="font-semibold text-slate-700">JPG, JPEG, PNG, WEBP</span> (Max 15MB)
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Try Preset:</span>
            <button
              onClick={() => handleSelectSample('synthetic')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-md transition-colors"
            >
              Synthetic Portrait Demo
            </button>
            <button
              onClick={() => handleSelectSample('authentic')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-md transition-colors"
            >
              Authentic Landscape Demo
            </button>
          </div>
        </div>

        {/* Upload Zone / Preview Area */}
        {!previewUrl ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-indigo-500 bg-indigo-50/40'
                : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleProcessFile(e.target.files[0]);
                }
              }}
              className="hidden"
            />
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 border border-indigo-100">
              <UploadCloud className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              Click to upload or drag & drop inspection image
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              High resolution JPG, PNG, or WEBP up to 15MB
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-2xl border border-slate-200 overflow-hidden bg-slate-950 flex items-center justify-center min-h-[320px] max-h-[500px]">
              <img
                src={previewUrl}
                alt="Inspection Preview"
                referrerPolicy="no-referrer"
                className="max-h-[480px] w-auto object-contain mx-auto"
              />

              {/* Scanning visual overlay when loading */}
              {loading && (
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-3 p-6">
                  <div className="w-12 h-12 border-3 border-indigo-500 border-t-white rounded-full animate-spin" />
                  <div className="text-sm font-bold tracking-tight">
                    Running Multi-Layer Forensic Decomposition...
                  </div>
                  <div className="w-64 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    High-Frequency Noise & Specular Vectors
                  </div>
                </div>
              )}

              {/* Clear button */}
              {!loading && (
                <button
                  onClick={handleClear}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white transition-colors"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* File metadata info */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 font-mono p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800">{file?.name || 'Inspection_Asset.jpg'}</span>
                <span>·</span>
                <span>{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : '3.4 MB'}</span>
                <span>·</span>
                <span className="uppercase">{file?.type.replace('image/', '') || 'JPEG'}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleClear}
                  className="text-slate-600 hover:text-rose-600 font-sans font-medium"
                >
                  Change Image
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Action button */}
        {previewUrl && !result && (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:pointer-events-none rounded-lg shadow-xs transition-colors"
            >
              <Zap className="w-4 h-4" />
              <span>Analyze Image Signals</span>
            </button>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Disclaimers & Results */}
      {result && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Vision Forensic Diagnostic Findings
          </h2>
          <ResultCard result={result} onOpenReportModal={onOpenReportModal} />
        </div>
      )}
    </div>
  );
};

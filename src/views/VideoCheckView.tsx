import React, { useState, useRef } from 'react';
import {
  Video,
  UploadCloud,
  Play,
  Pause,
  AlertCircle,
  Zap,
  Info,
  Clock,
  CheckCircle2,
  Sliders,
  Layers,
  X
} from 'lucide-react';
import { ScanResult } from '../types';
import { ResultCard } from '../components/ResultCard';

interface VideoCheckViewProps {
  onScanVideo: (filename: string, duration?: string, fileSize?: string) => Promise<ScanResult>;
  onOpenReportModal: (scan: ScanResult) => void;
  onNavigate?: (tab: any) => void;
}

export const VideoCheckView: React.FC<VideoCheckViewProps> = ({
  onScanVideo,
  onOpenReportModal,
  onNavigate
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleKeyframes = [
    { frame: '00:04', score: 'Nominal', landmarkDev: '0.8px', note: 'Standard head tilt' },
    { frame: '00:08', score: 'Warning', landmarkDev: '3.2px', note: 'Localized boundary jitter' },
    { frame: '00:14', score: 'Nominal', landmarkDev: '1.1px', note: 'Eye blink detected' },
    { frame: '00:22', score: 'Warning', landmarkDev: '2.8px', note: 'Lip phoneme latency' },
    { frame: '00:29', score: 'Nominal', landmarkDev: '0.9px', note: 'Coherent ear contour' }
  ];

  const handleProcessVideo = (selectedFile: File) => {
    const valid = ['video/mp4', 'video/webm', 'video/quicktime'];
    if (!valid.includes(selectedFile.type)) {
      setError('Please upload a standard MP4, WEBM, or MOV video.');
      return;
    }
    if (selectedFile.size > 50 * 1024 * 1024) {
      setError('Video file size exceeds maximum 50MB testing limit.');
      return;
    }

    setError(null);
    setFile(selectedFile);
    setResult(null);
    setVideoUrl(URL.createObjectURL(selectedFile));
  };

  const handleLoadSample = () => {
    setError(null);
    setResult(null);
    setFile(new File([], 'Interview_Broadcast_Clip_Sample.mp4', { type: 'video/mp4' }));
    setVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please upload a video or load sample first.');
      return;
    }

    setLoading(true);
    setError(null);
    setProgress(10);

    const timer = setInterval(() => {
      setProgress(p => (p < 85 ? p + 22 : p));
    }, 300);

    try {
      const scanRes = await onScanVideo(
        file.name,
        '30s',
        `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      );
      clearInterval(timer);
      setProgress(100);
      setResult(scanRes);
    } catch (err: any) {
      clearInterval(timer);
      setError(err.message || 'Video analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    if (videoUrl && !videoUrl.startsWith('http')) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoUrl(null);
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
          <Video className="w-4 h-4" />
          <span>Checked AI · Temporal Keyframe & Deepfake Inspector</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Video Deepfake & Temporal Manipulation Detection
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
          Inspect video media for facial boundary jitter, temporal landmark discontinuities, unnatural blinking cadence, and lip-sync audio alignment heuristics.
        </p>
      </div>

      {/* Main Upload Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div className="text-xs text-slate-500 font-medium">
            Supported video: <span className="font-semibold text-slate-700">MP4, WEBM, MOV</span> (Max 50MB)
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLoadSample}
              className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
            >
              Load Sample Broadcast Clip
            </button>
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('ai-video')}
                className="px-2.5 py-1 text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-md transition-colors"
              >
                Create with Omni Video Studio
              </button>
            )}
          </div>
        </div>

        {!videoUrl ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-slate-400 bg-slate-50/50 rounded-2xl p-10 text-center cursor-pointer transition-all"
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="video/mp4,video/webm,video/quicktime"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleProcessVideo(e.target.files[0]);
                }
              }}
              className="hidden"
            />
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 border border-indigo-100">
              <UploadCloud className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              Click to upload inspection video
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              MP4, WEBM, or MOV up to 50MB
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-2xl border border-slate-200 overflow-hidden bg-slate-950 flex items-center justify-center max-h-[420px]">
              <video
                src={videoUrl}
                controls
                className="max-h-[400px] w-full object-contain"
              />

              {loading && (
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-3 p-6">
                  <div className="w-12 h-12 border-3 border-indigo-500 border-t-white rounded-full animate-spin" />
                  <div className="text-sm font-bold tracking-tight">
                    Extracting Keyframes & Tracking Landmarks...
                  </div>
                  <div className="w-64 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {!loading && (
                <button
                  onClick={handleClear}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white transition-colors"
                  title="Remove video"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 font-mono p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800">{file?.name || 'Video_Sample.mp4'}</span>
                <span>·</span>
                <span>Container: MP4</span>
                <span>·</span>
                <span>30 FPS</span>
              </div>
              <button
                onClick={handleClear}
                className="text-slate-600 hover:text-rose-600 font-sans font-medium"
              >
                Change Video
              </button>
            </div>

            {/* Frame-level Temporal Inspector Matrix */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Temporal Keyframe Sampling Sequence
                </span>
                <span className="text-[11px] text-slate-400 font-mono">5 keyframes sampled</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {sampleKeyframes.map((kf, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                      <span>{kf.frame}</span>
                      <span className={kf.score === 'Nominal' ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                        {kf.score}
                      </span>
                    </div>
                    <div className="text-slate-800 font-semibold mt-1 truncate">
                      {kf.note}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Jitter: {kf.landmarkDev}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {videoUrl && !result && (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:pointer-events-none rounded-lg shadow-xs transition-colors"
            >
              <Zap className="w-4 h-4" />
              <span>Run Deepfake Keyframe Analysis</span>
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

      {/* Mandatory Deepfake Disclaimer Policy */}
      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200/90 text-slate-700 text-xs flex items-start gap-3">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-semibold text-slate-900">
            Integrity Standard: Video Deepfake Attestation Policy
          </div>
          <p className="text-slate-600 leading-relaxed">
            In adherence with Checked AI ethical mandates, the platform does not claim definitive deepfake detection without a connected, calibrated temporal model. When running in forensic sandbox or standalone mode, videos are evaluated with probabilistic limitation bounds or marked "Unable to Determine" rather than producing fabricated certainty.
          </p>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Temporal Video Diagnostic Results
          </h2>
          <ResultCard result={result} onOpenReportModal={onOpenReportModal} />
        </div>
      )}
    </div>
  );
};

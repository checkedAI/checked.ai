import React, { useState, useRef } from 'react';
import {
  Mic,
  UploadCloud,
  Play,
  Pause,
  AlertCircle,
  Zap,
  Info,
  Clock,
  Activity,
  Layers,
  Sparkles,
  X
} from 'lucide-react';
import { ScanResult } from '../types';
import { ResultCard } from '../components/ResultCard';

interface AudioCheckViewProps {
  onScanAudio: (filename: string, fileSize?: string) => Promise<ScanResult>;
  onOpenReportModal: (scan: ScanResult) => void;
  onNavigate?: (tab: any) => void;
}

export const AudioCheckView: React.FC<AudioCheckViewProps> = ({
  onScanAudio,
  onOpenReportModal,
  onNavigate
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcessAudio = (selectedFile: File) => {
    const valid = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-m4a', 'audio/aac'];
    if (!valid.some(t => selectedFile.type.includes(t) || selectedFile.name.endsWith('.mp3') || selectedFile.name.endsWith('.wav'))) {
      setError('Please upload an MP3, WAV, or M4A audio file.');
      return;
    }
    if (selectedFile.size > 25 * 1024 * 1024) {
      setError('Audio file size exceeds the 25MB limit.');
      return;
    }

    setError(null);
    setFile(selectedFile);
    setResult(null);
    setAudioUrl(URL.createObjectURL(selectedFile));
  };

  const handleLoadSample = () => {
    setError(null);
    setResult(null);
    setFile(new File([], 'Sample_Voice_Clip.mp3', { type: 'audio/mp3' }));
    // A sample sound
    setAudioUrl('https://actions.google.com/sounds/v1/speech/person_speaking_french.ogg');
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please upload an audio file first.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const scanRes = await onScanAudio(
        file.name,
        `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      );
      setResult(scanRes);
    } catch (err: any) {
      setError(err.message || 'Audio analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    if (audioUrl && !audioUrl.startsWith('http')) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
          <Mic className="w-4 h-4" />
          <span>Checked AI · Acoustic Spectrogram & Voice Synthesis Lab</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Audio AI Voice Clone & Synthetic Speech Detection
          </h1>
          <span className="px-2.5 py-1 text-xs font-bold text-amber-800 bg-amber-100 rounded-md border border-amber-300">
            Coming Soon / Lab Preview
          </span>
        </div>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
          Inspect vocal audio for neural vocoder harmonic artifacts, robotic pitch-stability signatures, unnatural breath pause intervals, and phase continuity.
        </p>
      </div>

      {/* Upload & Playback Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div className="text-xs text-slate-500 font-medium">
            Supported audio: <span className="font-semibold text-slate-700">MP3, WAV, M4A</span> (Max 25MB)
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleLoadSample}
              className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
            >
              Load Sample Audio Clip
            </button>
            {onNavigate && (
              <>
                <button
                  type="button"
                  onClick={() => onNavigate('ai-transcribe')}
                  className="px-2.5 py-1 text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-md transition-colors"
                >
                  Transcribe Speech
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('ai-music')}
                  className="px-2.5 py-1 text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-md transition-colors"
                >
                  Lyria Music Studio
                </button>
              </>
            )}
          </div>
        </div>

        {!audioUrl ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-slate-400 bg-slate-50/50 rounded-2xl p-10 text-center cursor-pointer transition-all"
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="audio/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleProcessAudio(e.target.files[0]);
                }
              }}
              className="hidden"
            />
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 border border-indigo-100">
              <UploadCloud className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              Click to upload inspection audio clip
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              WAV, MP3, or M4A audio recording
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white truncate max-w-md">
                      {file?.name || 'Voice_Sample.mp3'}
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      44.1 kHz · 16-Bit PCM Stream
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleClear}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
                  title="Remove audio"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Native Audio player */}
              <div className="pt-2">
                <audio src={audioUrl} controls className="w-full h-10 rounded-lg" />
              </div>

              {/* Simulated Spectrogram Frequency Bars */}
              <div className="pt-2">
                <div className="text-[11px] font-mono text-slate-400 mb-1.5 flex justify-between">
                  <span>Acoustic Frequency Spectrum</span>
                  <span>20 Hz – 20 kHz</span>
                </div>
                <div className="flex items-end gap-1 h-12 bg-slate-950 p-2 rounded-lg border border-slate-800 overflow-hidden">
                  {[40, 65, 30, 85, 95, 45, 70, 80, 55, 30, 60, 75, 90, 65, 40, 85, 50, 70, 35, 60, 80, 45, 90, 65, 30].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-xs"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {audioUrl && !result && (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:pointer-events-none rounded-lg shadow-xs transition-colors"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing Acoustic Harmonics...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Inspect Acoustic Signals</span>
                </>
              )}
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

      {/* Coming Soon & Evaluated Signals Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs font-bold text-slate-800">1. Vocoder Harmonics</div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Detects robotic high-frequency artifacts caused by diffusion or autoregressive vocoders (e.g. HiFi-GAN, WaveNet).
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs font-bold text-slate-800">2. Pitch & Micro-Tremor</div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Human speech has natural involuntary vocal cord jitter; synthetic speech exhibits rigid statistical pitch tracks.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs font-bold text-slate-800">3. Inhalation Cadence</div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Assesses physiological inhalation sounds and breathing pauses between natural syntactical phrases.
          </p>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Acoustic Verification Status
          </h2>
          <ResultCard result={result} onOpenReportModal={onOpenReportModal} />
        </div>
      )}
    </div>
  );
};

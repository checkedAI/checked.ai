import React, { useState, useRef } from 'react';
import {
  Music,
  Play,
  Pause,
  Download,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Volume2,
  FileText,
  Sliders,
  CheckCircle2,
  Radio
} from 'lucide-react';
import { aiApi, MusicResponse } from '../services/aiApi';

export const AiMusicView: React.FC = () => {
  const [prompt, setPrompt] = useState('An atmospheric synthwave track with subtle electronic pulses and futuristic basslines.');
  const [model, setModel] = useState<'lyria-3-clip-preview' | 'lyria-3-pro-preview'>('lyria-3-clip-preview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MusicResponse | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const presets = [
    { label: 'Cyberpunk Ambient', text: 'Dark cyberpunk synth with resonant arpeggios, sub bass, and tense atmospheric pads.' },
    { label: 'Cinematic Thriller', text: 'Slow-building orchestral tension with deep cellos, metallic percussion, and suspenseful brass.' },
    { label: 'Lo-Fi Investigation', text: 'Chill lo-fi study beat with vinyl crackle, warm rhodes keys, and relaxed hip-hop drums.' },
    { label: 'Security Ops Pulse', text: 'Driving electronic rhythm with technological blips, clean sub-bass, and urgent steady tempo.' }
  ];

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;
    setError(null);
    setLoading(true);
    setResult(null);
    setIsPlaying(false);

    try {
      const res = await aiApi.generateMusic({
        prompt: prompt.trim(),
        model
      });
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Music generation failed. Lyria models require a billing-enabled key.');
    } finally {
      setLoading(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
          <Music className="w-4 h-4" />
          <span>Checked AI · Lyria Music Studio</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          AI Music Generation
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Create high-fidelity audio tracks and synthetic background clips using Google’s <strong>lyria-3-clip-preview</strong> (up to 30s) or <strong>lyria-3-pro-preview</strong> (full tracks).
        </p>
      </div>

      {/* Main Studio Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
        {/* Model Selection */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Track Type:</span>
            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setModel('lyria-3-clip-preview')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  model === 'lyria-3-clip-preview'
                    ? 'bg-white text-blue-600 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Lyria Clip (Up to 30s)
              </button>
              <button
                type="button"
                onClick={() => setModel('lyria-3-pro-preview')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  model === 'lyria-3-pro-preview'
                    ? 'bg-white text-purple-600 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Lyria Pro (Full Track)
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-500 font-mono">
            Model: <span className="font-semibold text-slate-700">{model}</span>
          </div>
        </div>

        {/* Prompt Input Area */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 block">
            Music Description & Style Prompt:
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            placeholder="Describe genre, tempo, instruments, mood, or context..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
          />

          {/* Quick Style Presets */}
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="text-[11px] font-medium text-slate-400 self-center">Presets:</span>
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPrompt(p.text)}
                className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 rounded-lg text-slate-700 transition-colors cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Synthesizing Track with Lyria...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Music</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 space-y-1">
            <div className="flex items-center gap-2 font-bold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Generation Notice</span>
            </div>
            <p className="text-[11px] text-rose-600 leading-relaxed">{error}</p>
          </div>
        )}

        {/* Player & Output */}
        {result && (
          <div className="p-6 bg-slate-900 text-white rounded-2xl shadow-lg space-y-6">
            <audio
              ref={audioRef}
              src={`data:${result.mimeType};base64,${result.audioBase64}`}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
            />

            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/30 text-blue-400 flex items-center justify-center border border-blue-500/30">
                  <Music className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Generated Track</div>
                  <div className="text-xs text-slate-400 font-mono">{result.model}</div>
                </div>
              </div>

              <a
                href={`data:${result.mimeType};base64,${result.audioBase64}`}
                download={`checked-ai-track-${Date.now()}.wav`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download WAV</span>
              </a>
            </div>

            {/* Scrubber & Controls */}
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-md cursor-pointer transition-transform active:scale-95 shrink-0"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>

                <div className="flex-1 space-y-1">
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Generated Lyrics or Structure */}
            {result.lyrics && (
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-xs text-slate-300 space-y-1">
                <div className="font-bold text-slate-200 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  <span>Generated Lyrics & Composition Structure:</span>
                </div>
                <div className="whitespace-pre-wrap font-mono text-[11px] text-slate-400">
                  {result.lyrics}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

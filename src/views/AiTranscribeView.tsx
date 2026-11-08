import React, { useState, useRef } from 'react';
import {
  Mic,
  MicOff,
  UploadCloud,
  FileAudio,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  FileText,
  Clock,
  Sparkles,
  Play,
  Pause,
  CheckCircle2,
  X
} from 'lucide-react';
import { aiApi } from '../services/aiApi';

interface AiTranscribeViewProps {
  onSendToTextCheck?: (text: string) => void;
}

export const AiTranscribeView: React.FC<AiTranscribeViewProps> = ({ onSendToTextCheck }) => {
  const [mode, setMode] = useState<'mic' | 'upload'>('mic');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [copied, setCopied] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startRecording = async () => {
    setError(null);
    setAudioBlob(null);
    setAudioUrl(null);
    setTranscript(null);
    audioChunksRef.current = [];
    setRecordingSeconds(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const recordedBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(recordedBlob);
        setAudioUrl(URL.createObjectURL(recordedBlob));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(250);
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingSeconds(s => s + 1);
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Microphone access denied. Please allow microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('audio/') && !file.name.endsWith('.mp3') && !file.name.endsWith('.wav') && !file.name.endsWith('.m4a')) {
      setError('Please upload a standard audio file (MP3, WAV, M4A, WEBM, OGG).');
      return;
    }
    setError(null);
    setUploadFile(file);
    setAudioBlob(file);
    setAudioUrl(URL.createObjectURL(file));
    setTranscript(null);
  };

  const handleTranscribe = async () => {
    if (!audioBlob || loading) return;
    setError(null);
    setLoading(true);

    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = (reader.result as string).split(',')[1];
          const res = await aiApi.transcribeAudio({
            audioBase64: base64Data,
            mimeType: audioBlob.type || 'audio/webm'
          });
          setTranscript(res.transcript);
          setWordCount(res.wordCount);
        } catch (err: any) {
          setError(err.message || 'Audio transcription failed.');
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(audioBlob);
    } catch (err: any) {
      setError(err.message || 'Failed to process audio data.');
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!transcript) return;
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
          <Mic className="w-4 h-4" />
          <span>Checked AI · Forensic Speech-to-Text</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Audio Transcription with Gemini
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Record from your microphone or upload audio files to generate verbatim, punctuated transcriptions powered by <strong>gemini-3.5-transcribe</strong>.
        </p>
      </div>

      {/* Mode Selector */}
      <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200 p-2 shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setMode('mic');
              setError(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'mic'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5" />
              <span>Record with Microphone</span>
            </div>
          </button>

          <button
            onClick={() => {
              setMode('upload');
              setError(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'upload'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload Audio File</span>
            </div>
          </button>
        </div>

        <div className="text-xs text-slate-500 font-mono hidden sm:block pr-3">
          Model: <span className="font-bold text-slate-800">gemini-3.5-transcribe</span>
        </div>
      </div>

      {/* Input Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
        {mode === 'mic' ? (
          <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-6">
            <div className="relative">
              {isRecording && (
                <div className="absolute inset-0 rounded-full bg-rose-500/20 animate-ping" />
              )}
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer z-10 relative ${
                  isRecording
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isRecording ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
              </button>
            </div>

            <div>
              <div className="text-base font-bold text-slate-900">
                {isRecording ? 'Recording Spoken Audio...' : 'Click Microphone to Start Recording'}
              </div>
              <div className="text-xs text-slate-500 mt-1 font-mono">
                {isRecording ? (
                  <span className="text-rose-600 font-bold">Elapsed: {formatTimer(recordingSeconds)}</span>
                ) : (
                  'Speak clearly into your microphone'
                )}
              </div>
            </div>

            {audioUrl && !isRecording && (
              <div className="w-full max-w-md pt-2">
                <audio src={audioUrl} controls className="w-full h-10" />
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {!uploadFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50 rounded-2xl p-10 text-center cursor-pointer transition-all"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="audio/*,.mp3,.wav,.m4a,.webm,.ogg"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
                <FileAudio className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <div className="text-sm font-bold text-slate-800">
                  Click to select audio recording
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  MP3, WAV, M4A, WEBM, or OGG up to 25MB
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <FileAudio className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
                      {uploadFile.name}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {(uploadFile.size / (1024 * 1024)).toFixed(2)} MB
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setUploadFile(null);
                    setAudioBlob(null);
                    setAudioUrl(null);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {audioUrl && (
              <div className="pt-2">
                <audio src={audioUrl} controls className="w-full h-10" />
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        {audioBlob && (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleTranscribe}
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Transcribing with Gemini 3.5 Transcribe...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Transcribe Audio</span>
                </>
              )}
            </button>
          </div>
        )}

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Transcription Results Card */}
      {transcript && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900">
                Transcription Result
              </h2>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
              <span>{wordCount} words</span>
              <span>·</span>
              <span>gemini-3.5-transcribe</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 text-sm leading-relaxed whitespace-pre-wrap font-sans">
            {transcript}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Transcript' : 'Copy Transcript'}</span>
            </button>

            {onSendToTextCheck && (
              <button
                type="button"
                onClick={() => onSendToTextCheck(transcript)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Verify Text for AI Generation or Scam</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

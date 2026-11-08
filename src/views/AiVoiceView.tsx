import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Radio,
  Volume2,
  VolumeX,
  Sparkles,
  PhoneCall,
  PhoneOff,
  AlertCircle,
  Activity,
  CheckCircle2,
  ShieldCheck,
  Info
} from 'lucide-react';

export const AiVoiceView: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcriptHistory, setTranscriptHistory] = useState<Array<{ sender: 'user' | 'model'; text: string }>>([
    {
      sender: 'model',
      text: 'Voice Live session ready. Click "Start Live Conversation" and speak into your microphone.'
    }
  ]);

  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const isMutedRef = useRef(false);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      disconnectSession();
    };
  }, []);

  const pcm16ToBase64 = (float32Array: Float32Array): string => {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    const uint8Array = new Uint8Array(int16Array.buffer);
    let binary = '';
    const len = uint8Array.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    return btoa(binary);
  };

  const playPcmChunk = (base64Audio: string) => {
    if (!outputAudioCtxRef.current) return;
    const ctx = outputAudioCtxRef.current;

    const binary = atob(base64Audio);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const int16 = new Int16Array(bytes.buffer);
    const float32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) {
      float32[i] = int16[i] / 32768.0;
    }

    const audioBuffer = ctx.createBuffer(1, float32.length, 24000);
    audioBuffer.copyToChannel(float32, 0);

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);

    const now = ctx.currentTime;
    if (nextStartTimeRef.current < now) {
      nextStartTimeRef.current = now;
    }

    source.start(nextStartTimeRef.current);
    nextStartTimeRef.current += audioBuffer.duration;

    setIsSpeaking(true);
    source.onended = () => {
      if (ctx.currentTime >= nextStartTimeRef.current - 0.05) {
        setIsSpeaking(false);
      }
    };
  };

  const startLiveSession = async () => {
    setError(null);
    setConnecting(true);

    try {
      // 1. Setup AudioContexts (16kHz for input mic, 24kHz for output playback)
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000
      });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 24000
      });
      inputAudioCtxRef.current = inputCtx;
      outputAudioCtxRef.current = outputCtx;
      nextStartTimeRef.current = 0;

      // 2. Request user microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true
        }
      });
      mediaStreamRef.current = stream;

      // 3. Connect to server WebSocket
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/live-ws`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        setConnecting(false);
        setTranscriptHistory(prev => [
          ...prev,
          { sender: 'model', text: 'Live session connected. Model gemini-3.8-live is actively listening.' }
        ]);

        // Start processing microphone audio
        const source = inputCtx.createMediaStreamSource(stream);
        const processor = inputCtx.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;

        source.connect(processor);
        processor.connect(inputCtx.destination);

        processor.onaudioprocess = (e) => {
          if (isMutedRef.current) return;
          if (ws.readyState === WebSocket.OPEN) {
            const inputData = e.inputBuffer.getChannelData(0);
            const base64 = pcm16ToBase64(inputData);
            ws.send(JSON.stringify({ audio: base64 }));
          }
        };
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.audio) {
            playPcmChunk(msg.audio);
          }
          if (msg.interrupted) {
            setIsSpeaking(false);
            nextStartTimeRef.current = 0;
          }
          if (msg.error) {
            setError(msg.error);
          }
        } catch (e: any) {
          console.error('Error handling WS audio message:', e);
        }
      };

      ws.onerror = (e) => {
        console.error('WebSocket error:', e);
        setError('WebSocket error connecting to Live API session.');
        disconnectSession();
      };

      ws.onclose = () => {
        setConnected(false);
        setConnecting(false);
      };
    } catch (err: any) {
      console.error('Live setup error:', err);
      setError(err.message || 'Failed to start Live audio session. Please allow microphone permissions.');
      disconnectSession();
    }
  };

  const disconnectSession = () => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    if (inputAudioCtxRef.current) {
      inputAudioCtxRef.current.close().catch(() => {});
      inputAudioCtxRef.current = null;
    }
    if (outputAudioCtxRef.current) {
      outputAudioCtxRef.current.close().catch(() => {});
      outputAudioCtxRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setConnected(false);
    setConnecting(false);
    setIsSpeaking(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
          <Radio className="w-4 h-4" />
          <span>Checked AI · Real-Time Voice Intelligence</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Real-Time Voice Conversations
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Low-latency, bidirectional real-time audio interaction powered by <strong>gemini-3.8-live</strong> via the Gemini Live API.
        </p>
      </div>

      {/* Main Interactive Voice Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 flex flex-col items-center justify-center text-center space-y-8 relative overflow-hidden">
        {/* Decorative Grid Backdrop */}
        <div className="absolute inset-0 bg-linear-to-b from-blue-50/40 via-transparent to-slate-50/30 pointer-events-none" />

        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border z-10 transition-colors bg-white shadow-2xs">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              connected
                ? isSpeaking
                  ? 'bg-purple-500 animate-ping'
                  : 'bg-emerald-500 animate-pulse'
                : connecting
                ? 'bg-amber-500 animate-spin'
                : 'bg-slate-300'
            }`}
          />
          <span className="text-slate-700">
            {connected
              ? isSpeaking
                ? 'Gemini Live Speaking...'
                : 'Listening for Speech...'
              : connecting
              ? 'Connecting to Live API...'
              : 'Disconnected'}
          </span>
          <span className="text-slate-300">|</span>
          <span className="font-mono text-[11px] text-slate-500">gemini-3.8-live</span>
        </div>

        {/* Central Audio Visualizer Orb */}
        <div className="relative flex items-center justify-center py-6">
          {/* Animated Glow Rings when active */}
          {connected && (
            <>
              <div
                className={`absolute w-44 h-44 rounded-full transition-all duration-500 ${
                  isSpeaking ? 'bg-purple-400/20 scale-125 animate-pulse' : 'bg-blue-400/20 scale-110'
                }`}
              />
              <div
                className={`absolute w-36 h-36 rounded-full transition-all duration-300 ${
                  isSpeaking ? 'bg-purple-500/20 scale-110' : 'bg-blue-500/20 scale-105'
                }`}
              />
            </>
          )}

          {/* Main Orb Button */}
          <div
            className={`w-28 h-28 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 z-10 ${
              connected
                ? isSpeaking
                  ? 'bg-linear-to-tr from-purple-600 to-indigo-600 text-white scale-105 shadow-purple-200'
                  : 'bg-linear-to-tr from-blue-600 to-indigo-600 text-white shadow-blue-200'
                : 'bg-slate-100 text-slate-400 border border-slate-200'
            }`}
          >
            {connected ? (
              isSpeaking ? (
                <Volume2 className="w-10 h-10 animate-bounce" />
              ) : (
                <Mic className="w-10 h-10 animate-pulse" />
              )
            ) : (
              <Radio className="w-10 h-10" />
            )}
          </div>
        </div>

        {/* Audio Wave Bars Simulation when connected */}
        <div className="flex items-center gap-1.5 h-8 z-10">
          {[40, 70, 30, 90, 60, 100, 50, 80, 45, 65, 35, 75].map((h, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-200 ${
                connected
                  ? isSpeaking
                    ? 'bg-purple-500'
                    : 'bg-blue-500'
                  : 'bg-slate-200'
              }`}
              style={{
                height: connected ? `${(h * (isSpeaking ? 0.9 : 0.4))}%` : '8px'
              }}
            />
          ))}
        </div>

        {/* Primary Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 z-10">
          {!connected ? (
            <button
              onClick={startLiveSession}
              disabled={connecting}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{connecting ? 'Connecting...' : 'Start Live Conversation'}</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  isMuted
                    ? 'bg-rose-50 border-rose-300 text-rose-700'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                }`}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isMuted ? 'Muted' : 'Mute Mic'}</span>
              </button>

              <button
                onClick={disconnectSession}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                <PhoneOff className="w-4 h-4" />
                <span>End Conversation</span>
              </button>
            </>
          )}
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2 max-w-md mx-auto z-10">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Architecture & Live Specs Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Audio Ingestion
          </div>
          <div className="text-sm font-bold text-slate-900">
            16 kHz Raw PCM
          </div>
          <div className="text-xs text-slate-500">
            Microphone captured & buffered via Web Audio ScriptProcessor.
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Model Synthesis
          </div>
          <div className="text-sm font-bold text-slate-900">
            24 kHz Audio Stream
          </div>
          <div className="text-xs text-slate-500">
            Synthesized live with gapless playback scheduling and zero latency.
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Protocol
          </div>
          <div className="text-sm font-bold text-slate-900">
            WebSocket Bridge
          </div>
          <div className="text-xs text-slate-500">
            Bidirectional real-time bridge via Express Node server.
          </div>
        </div>
      </div>
    </div>
  );
};

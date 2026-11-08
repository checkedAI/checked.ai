import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Zap,
  Cpu,
  RefreshCw,
  Copy,
  Check,
  User,
  ShieldAlert,
  Info,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { aiApi, ChatMessage } from '../services/aiApi';

interface AiChatViewProps {
  onQuickVerifyText?: (text: string) => void;
}

const ROLES = [
  {
    id: 'forensic',
    name: 'Cyber Intelligence Analyst',
    description: 'Expert in verifying claims, dissecting phishing tactics, and explaining AI indicators.'
  },
  {
    id: 'deepfake',
    name: 'Deepfake & Media Specialist',
    description: 'Focuses on visual anomalies, facial landmarks, audio cloning, and synthesis artifacts.'
  },
  {
    id: 'phishing',
    name: 'Scam & Threat Hunter',
    description: 'Analyzes suspicious emails, SMS lures, typosquatting domains, and credential harvesters.'
  }
];

export const AiChatView: React.FC<AiChatViewProps> = ({ onQuickVerifyText }) => {
  const [model, setModel] = useState<'gemini-3.8-flash' | 'gemini-4-argon' | 'gemini-3.1-flash-lite'>('gemini-3.8-flash');
  const [selectedRole, setSelectedRole] = useState(ROLES[0].name);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      role: 'model',
      text: "Hello! I am your Checked AI Intelligence Assistant. You can ask me to evaluate suspicious text, examine scam indicators, explain how deepfakes are constructed, or test verification scenarios. What would you like to investigate today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.8-flash'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const prompt = (textToSend || input).trim();
    if (!prompt || loading) return;

    setError(null);
    const userMessage: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const chatPayload = newMessages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const res = await aiApi.sendChat({
        messages: chatPayload,
        model,
        role: selectedRole
      });

      const modelMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'model',
        text: res.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: res.model,
        warning: res.warning
      };

      setMessages(prev => [...prev, modelMessage]);
    } catch (err: any) {
      setError(err.message || 'Failed to generate response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setMessages([
      {
        id: `msg_welcome_${Date.now()}`,
        role: 'model',
        text: "Conversation cleared. Ready for your next investigation query.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: model
      }
    ]);
    setError(null);
  };

  const sampleStarters = [
    "What are the telltale linguistic markers of AI-generated academic text?",
    "How can I spot an urgent voice cloning scam over WhatsApp?",
    "Analyze this phishing pattern: 'URGENT: Your bank account will be suspended in 2 hours, click here'",
    "Explain the difference between latent diffusion and GAN deepfake artifacts."
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
            <Bot className="w-4 h-4" />
            <span>Checked AI · Intelligence Chatbot</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Gemini Multi-Turn Forensic Assistant
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Multi-turn security and authenticity dialog with role-guided system instructions and high-performance reasoning.
          </p>
        </div>

        <button
          onClick={handleClear}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Thread</span>
        </button>
      </div>

      {/* Model & Role Controls Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4">
        {/* Model Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 shrink-0">Model:</span>
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => setModel('gemini-3.8-flash')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                model === 'gemini-3.8-flash'
                  ? 'bg-white text-blue-600 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="gemini-3.8-flash: General tasks, balanced reasoning and speed"
            >
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-500" />
                <span>3.8 Flash</span>
              </div>
            </button>

            <button
              onClick={() => setModel('gemini-3.1-flash-lite')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                model === 'gemini-3.1-flash-lite'
                  ? 'bg-white text-emerald-600 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="gemini-3.1-flash-lite: Fast tasks with low latency"
            >
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-emerald-500" />
                <span>Flash-Lite</span>
              </div>
            </button>

            <button
              onClick={() => setModel('gemini-4-argon')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                model === 'gemini-4-argon'
                  ? 'bg-white text-purple-600 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="gemini-4-argon: Complex reasoning & deep forensic analysis"
            >
              <div className="flex items-center gap-1">
                <Cpu className="w-3 h-3 text-purple-500" />
                <span>4 Argon</span>
              </div>
            </button>
          </div>
        </div>

        {/* Role Persona Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 shrink-0">Role:</span>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {ROLES.map(r => (
              <option key={r.id} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chat Thread Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col h-[520px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                    isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-900 text-blue-400'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className="space-y-1">
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-tr-xs'
                        : 'bg-slate-50 border border-slate-200/90 text-slate-800 rounded-tl-xs shadow-2xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>

                    {msg.warning && (
                      <div className="mt-2 text-xs text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>{msg.warning}</span>
                      </div>
                    )}
                  </div>

                  {/* Message Footer */}
                  <div className={`flex items-center gap-2 text-[10px] text-slate-400 px-1 ${isUser ? 'justify-end' : ''}`}>
                    <span>{msg.timestamp}</span>
                    {msg.modelUsed && (
                      <>
                        <span>·</span>
                        <span className="font-mono text-slate-500">{msg.modelUsed}</span>
                      </>
                    )}
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="hover:text-slate-700 transition-colors ml-1 cursor-pointer"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 max-w-[85%] mr-auto items-center">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-blue-400 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-500 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                <span>Generating reasoning response with {model}...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompt Starters (if only welcome message) */}
        {messages.length <= 1 && (
          <div className="px-4 py-2 bg-slate-50/70 border-t border-slate-100 flex gap-2 overflow-x-auto">
            {sampleStarters.map((starter, i) => (
              <button
                key={i}
                onClick={() => handleSend(starter)}
                className="text-[11px] whitespace-nowrap bg-white hover:bg-blue-50 hover:text-blue-600 border border-slate-200 px-3 py-1.5 rounded-full transition-colors shrink-0 text-slate-600 cursor-pointer"
              >
                {starter}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200">
          {error && (
            <div className="mb-2 p-2 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-end gap-2"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={`Ask ${selectedRole} (${model})... (Shift+Enter for newline)`}
              rows={2}
              className="flex-1 resize-none bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-11 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none text-white flex items-center justify-center shrink-0 shadow-xs transition-all cursor-pointer"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Trash2,
  Compass,
  GraduationCap,
  Users2,
  Building2,
  Bot,
  User,
  Copy,
  Check,
  RotateCcw,
} from 'lucide-react';
import { ChatMessage, UserProfile } from '../../types';
import { aiService } from '../../services/aiService';
import { FormattedMarkdown } from '../common/FormattedMarkdown';

interface CampusAIPageProps {
  user: UserProfile;
}

export const CampusAIPage: React.FC<CampusAIPageProps> = ({ user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'model',
      text: `Halo ${user.name}! Saya **Campus AI**, asisten cerdas terpadu di super app **CampusOne**.\n\nSaya dapat membantumu:\n- 🎯 Menemukan beasiswa & magang yang cocok untuk semester ${user.semester}\n- 🧠 Menjelaskan konsep sulit & latihan soal di QuestLearn\n- 🤝 Merekomendasikan teman belajar dengan kesamaan mata kuliah di PeerMatch\n- 🏢 Mengecek ketersediaan ruang diskusi di SmartCampus\n\nApa yang ingin kamu diskusikan hari ini?`,
      timestamp: 'Baru saja',
      source: 'gemini',
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    'Rekomendasikan beasiswa untuk semester 5 dengan IPK 3.8',
    'Jelaskan perbedaan Array dan Linked List dengan analogi',
    'Carikan teman belajar untuk Struktur Data hari Rabu',
    'Cari ruang diskusi kapasitas 6 orang yang ada Smart TV',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const res = await aiService.sendChatMessage(trimmed, messages, user);

    const botMsg: ChatMessage = {
      id: `bot-${Date.now()}`,
      role: 'model',
      text: res.reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: res.source,
    };

    setMessages((prev) => [...prev, botMsg]);
    setLoading(false);
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        role: 'model',
        text: `Riwayat percakapan telah dibersihkan. Bagaimana Campus AI dapat membantumu hari ini?`,
        timestamp: 'Baru saja',
      },
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-190px)] sm:h-[calc(100vh-160px)] lg:h-[calc(100vh-140px)] flex flex-col bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#163B70] via-[#1f4a88] to-[#3978F6] text-white flex items-center justify-center shadow-md shadow-blue-900/15">
            <Sparkles className="w-5 h-5 text-teal-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-slate-900 text-base">Campus AI</h2>
              <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-xs text-slate-500">
              One Campus Intelligence • Memahami profil {user.major} Smt {user.semester}
            </p>
          </div>
        </div>

        <button
          onClick={handleClearHistory}
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-1 text-xs"
          title="Bersihkan riwayat percakapan"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Bersihkan</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#F8FAFC]">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} group`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-[#163B70] text-white'
                    : 'bg-gradient-to-tr from-[#163B70] to-[#3978F6] text-teal-300 shadow-xs'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-[#163B70] text-white rounded-tr-none shadow-xs'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1 text-[10px] opacity-70">
                  <span className="font-bold">{isUser ? user.name : 'Campus AI'}</span>
                  <div className="flex items-center gap-1.5">
                    {m.source && !isUser && (
                      <span className="bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded text-[9px]">
                        {m.source === 'gemini' ? 'Gemini 3.8 Flash' : 'Simulasi Kampus'}
                      </span>
                    )}
                    <span>{m.timestamp}</span>
                  </div>
                </div>

                {isUser ? (
                  <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
                ) : (
                  <FormattedMarkdown content={m.text} />
                )}

                {!isUser && (
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-end">
                    <button
                      onClick={() => handleCopyMessage(m.id, m.text)}
                      className="text-[10px] text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors"
                    >
                      {copiedId === m.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">Disalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Salin</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#163B70] to-[#3978F6] text-teal-300 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-none p-3.5 shadow-xs flex items-center gap-2 text-xs text-slate-500">
              <Sparkles className="w-4 h-4 text-[#23B5A5] animate-spin" />
              <span>Campus AI sedang menyusun jawaban...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Pills */}
      <div className="px-4 py-2 bg-slate-50/80 border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0">
          Saran:
        </span>
        {suggestedPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="text-[11px] bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50/60 text-slate-700 px-3 py-1 rounded-full whitespace-nowrap transition-colors shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(input);
        }}
        className="p-3 sm:p-4 bg-white border-t border-slate-100 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tanyakan peluang, materi kuliah, rekomendasi teman, atau fasilitas kampus..."
          className="flex-1 px-4 py-2.5 bg-slate-100 border border-transparent rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#3978F6] focus:bg-white transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2.5 bg-[#163B70] hover:bg-[#1e4885] disabled:opacity-40 text-white rounded-2xl transition-all shadow-md shadow-blue-900/15"
          aria-label="Kirim Pesan"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

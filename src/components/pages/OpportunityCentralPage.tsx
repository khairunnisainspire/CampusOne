import React, { useState } from 'react';
import {
  Search,
  Filter,
  Bookmark,
  Clock,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  ListTodo,
  FileText,
  Lightbulb,
  X,
  Calendar,
  MapPin,
  Building,
  GraduationCap,
  ChevronRight,
  Info,
} from 'lucide-react';
import {
  Opportunity,
  OpportunityCategory,
  OpportunityStatus,
  UserProfile,
} from '../../types';
import { aiService } from '../../services/aiService';
import { FormattedMarkdown } from '../common/FormattedMarkdown';

interface OpportunityCentralPageProps {
  opportunities: Opportunity[];
  bookmarks: string[];
  statusMap: Record<string, OpportunityStatus>;
  onToggleBookmark: (id: string) => void;
  onSetStatus: (id: string, status: OpportunityStatus) => void;
  user: UserProfile;
  selectedOpp: Opportunity | null;
  onSelectOpportunity: (opp: Opportunity | null) => void;
}

export const OpportunityCentralPage: React.FC<OpportunityCentralPageProps> = ({
  opportunities,
  bookmarks,
  statusMap,
  onToggleBookmark,
  onSetStatus,
  user,
  selectedOpp,
  onSelectOpportunity,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<OpportunityCategory>('Semua');
  const [selectedMode, setSelectedMode] = useState<'All' | 'Online' | 'Offline' | 'Hybrid'>('All');

  // AI Assistant in Modal states
  const [aiLoading, setAiLoading] = useState(false);
  const [aiActiveAction, setAiActiveAction] = useState<
    'requirements' | 'checklist' | 'motivation_tips' | 'match_advice' | null
  >(null);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiSource, setAiSource] = useState<'gemini' | 'demo-fallback' | null>(null);

  const categories: OpportunityCategory[] = [
    'Semua',
    'Beasiswa',
    'Magang',
    'Kompetisi',
    'Penelitian',
    'Pengembangan Diri',
    'Volunteering',
  ];

  // Filtering
  const filteredOpportunities = opportunities.filter((opp) => {
    if (activeTab === 'saved') {
      const isBookmarked = bookmarks.includes(opp.id);
      const hasStatus = Boolean(statusMap[opp.id]);
      if (!isBookmarked && !hasStatus) return false;
    }

    if (selectedCategory !== 'Semua' && opp.category !== selectedCategory) {
      return false;
    }

    if (selectedMode !== 'All' && opp.mode !== selectedMode) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = opp.title.toLowerCase().includes(q);
      const matchOrg = opp.organizer.toLowerCase().includes(q);
      const matchTags = opp.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchOrg && !matchTags) return false;
    }

    return true;
  });

  const handleOpenAiTool = async (
    action: 'requirements' | 'checklist' | 'motivation_tips' | 'match_advice'
  ) => {
    if (!selectedOpp) return;
    setAiActiveAction(action);
    setAiLoading(true);
    setAiResult(null);

    const res = await aiService.getOpportunityAdvice(action, selectedOpp, user);
    setAiResult(res.result);
    setAiSource(res.source);
    setAiLoading(false);
  };

  const currentStatus = selectedOpp ? statusMap[selectedOpp.id] || 'Interested' : 'Interested';

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#163B70] tracking-tight">
              Opportunity Central
            </h1>
            <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
              Contoh Demo
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Pusat kurasi beasiswa, magang industri, kompetisi nasional, riset dosen, dan program kerelawanan.
          </p>
        </div>

        {/* Tab Switcher: All vs Saved Tracker */}
        <div className="flex items-center bg-slate-200/80 p-1 rounded-xl self-start sm:self-auto shrink-0">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-white text-[#163B70] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua Peluang ({opportunities.length})
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'saved'
                ? 'bg-white text-[#163B70] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 fill-current text-amber-500" />
            <span>Tersimpan & Tracker ({bookmarks.length})</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan judul beasiswa, nama perusahaan, atau kata kunci..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3978F6] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value as any)}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#3978F6]"
            >
              <option value="All">Semua Mode (Online/Offline/Hybrid)</option>
              <option value="Online">Hanya Online</option>
              <option value="Offline">Hanya Tatap Muka</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#163B70] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Opportunities Grid */}
      {filteredOpportunities.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-700">Tidak ada peluang yang cocok</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Coba ubah kata kunci pencarian atau ganti filter kategori untuk melihat peluang lainnya.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('Semua');
              setSelectedMode('All');
              setActiveTab('all');
            }}
            className="px-4 py-2 bg-[#3978F6] text-white text-xs font-bold rounded-xl hover:bg-[#2764db] transition-colors"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOpportunities.map((opp) => {
            const isBookmarked = bookmarks.includes(opp.id);
            const status = statusMap[opp.id];

            return (
              <div
                key={opp.id}
                className="bg-white rounded-2xl border border-slate-200/80 hover:border-blue-300 hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Card Top */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="bg-[#163B70]/10 text-[#163B70] text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                      {opp.category}
                    </span>
                    <button
                      onClick={() => onToggleBookmark(opp.id)}
                      className={`p-2 rounded-xl transition-colors ${
                        isBookmarked
                          ? 'bg-amber-50 text-amber-600 border border-amber-200'
                          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                      }`}
                      title={isBookmarked ? 'Hapus bookmark' : 'Simpan peluang'}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  <div>
                    <h3
                      onClick={() => onSelectOpportunity(opp)}
                      className="font-extrabold text-slate-900 text-base leading-snug hover:text-[#3978F6] cursor-pointer transition-colors"
                    >
                      {opp.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {opp.organizer}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {opp.description}
                  </p>

                  {/* Highlights / Benefits / Stiped */}
                  {opp.stipendOrPrize && (
                    <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 text-[11px] font-bold text-emerald-800 flex items-center justify-between">
                      <span>Benefit / Hadiah:</span>
                      <span className="text-emerald-700">{opp.stipendOrPrize}</span>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {opp.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Bottom / Footer */}
                <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-1 text-rose-600 font-semibold text-[11px]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{opp.daysRemaining} hari lagi</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {status && (
                      <span className="text-[10px] font-bold bg-blue-100 text-[#3978F6] px-2 py-0.5 rounded-full">
                        {status}
                      </span>
                    )}
                    <button
                      onClick={() => onSelectOpportunity(opp)}
                      className="px-3 py-1.5 bg-[#163B70] hover:bg-[#1f4a88] text-white rounded-lg font-semibold text-xs transition-colors flex items-center gap-1 shadow-xs"
                    >
                      Detail & AI
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAIL MODAL WITH INTEGRATED AI ASSISTANT */}
      {selectedOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden my-auto animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex items-start justify-between gap-4">
              <div className="space-y-1 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-[#163B70]/10 text-[#163B70] text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                    {selectedOpp.category}
                  </span>
                  <span className="text-[11px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-medium">
                    {selectedOpp.mode}
                  </span>
                  <span className="text-[11px] text-rose-600 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Deadline: {selectedOpp.deadline} ({selectedOpp.daysRemaining} hari lagi)
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {selectedOpp.title}
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Diselenggarakan oleh <span className="font-bold text-slate-700">{selectedOpp.organizer}</span>
                </p>
              </div>

              <button
                onClick={() => {
                  onSelectOpportunity(null);
                  setAiResult(null);
                  setAiActiveAction(null);
                }}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {/* Status Selector Bar */}
              <div className="p-3 bg-blue-50/80 rounded-2xl border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-slate-700">
                  <span className="font-bold text-[#163B70]">Status Pendaftaranmu: </span>
                  <span className="font-medium text-slate-600">Perbarui progres seleksimu di sini</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(['Interested', 'Preparing', 'Applied', 'Completed'] as OpportunityStatus[]).map(
                    (st) => (
                      <button
                        key={st}
                        onClick={() => onSetStatus(selectedOpp.id, st)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          currentStatus === st
                            ? 'bg-[#163B70] text-white shadow-xs'
                            : 'bg-white text-slate-600 hover:bg-blue-100 border border-slate-200'
                        }`}
                      >
                        {st}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Description & Benefits */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1.5">Deskripsi Program</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{selectedOpp.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-100 space-y-2">
                    <h5 className="font-bold text-teal-900 text-xs flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-[#23B5A5]" />
                      Manfaat & Fasilitas
                    </h5>
                    <ul className="text-xs text-teal-950 space-y-1.5 list-disc list-inside">
                      {selectedOpp.benefits.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <h5 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-slate-600" />
                      Dokumen Wajib Disiapkan
                    </h5>
                    <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                      {selectedOpp.requiredDocs.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Requirements */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm">Persyaratan Lengkap</h4>
                  <div className="space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    {selectedOpp.fullRequirements.map((r, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm">Tahapan Seleksi</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedOpp.timeline.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl border border-slate-200/70 bg-white flex items-center justify-between text-xs"
                      >
                        <span className="font-bold text-slate-800">{item.step}</span>
                        <span className="text-[11px] text-slate-500">{item.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI OPPORTUNITY ASSISTANT SECTION */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-900 via-[#163B70] to-[#1c4885] text-white space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-teal-400/20 text-teal-300 rounded-lg">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-white">AI Opportunity Assistant</h4>
                      <p className="text-[11px] text-blue-200">
                        Bimbingan pintar personal untuk meningkatkan peluang kelolosanmu
                      </p>
                    </div>
                  </div>
                  {aiSource && (
                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-blue-200">
                      {aiSource === 'gemini' ? 'Gemini 3.8 Flash' : 'Simulasi Kampus'}
                    </span>
                  )}
                </div>

                {/* AI Action Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => handleOpenAiTool('requirements')}
                    className={`p-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                      aiActiveAction === 'requirements'
                        ? 'bg-teal-400 text-slate-950 font-bold shadow-md'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    📋 Bedah Syarat
                  </button>
                  <button
                    onClick={() => handleOpenAiTool('checklist')}
                    className={`p-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                      aiActiveAction === 'checklist'
                        ? 'bg-teal-400 text-slate-950 font-bold shadow-md'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    ✅ Buat Checklist
                  </button>
                  <button
                    onClick={() => handleOpenAiTool('motivation_tips')}
                    className={`p-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                      aiActiveAction === 'motivation_tips'
                        ? 'bg-teal-400 text-slate-950 font-bold shadow-md'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    💡 Tips Esai/CV
                  </button>
                  <button
                    onClick={() => handleOpenAiTool('match_advice')}
                    className={`p-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                      aiActiveAction === 'match_advice'
                        ? 'bg-teal-400 text-slate-950 font-bold shadow-md'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    🎯 Cek Keselarasan
                  </button>
                </div>

                {/* AI Loading State */}
                {aiLoading && (
                  <div className="p-4 bg-white/10 rounded-xl flex items-center justify-center gap-2 text-xs text-blue-100">
                    <Sparkles className="w-4 h-4 text-teal-300 animate-spin" />
                    <span>Campus AI sedang menganalisis dokumen dan panduan seleksi...</span>
                  </div>
                )}

                {/* AI Result View */}
                {aiResult && !aiLoading && (
                  <div className="p-4 rounded-xl bg-white/10 border border-white/15 text-xs text-blue-50 leading-relaxed max-h-64 overflow-y-auto">
                    <FormattedMarkdown content={aiResult} />
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/90 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                Data demo bersumber dari program kemahasiswaan kampus
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => onToggleBookmark(selectedOpp.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 flex-1 sm:flex-none border ${
                    bookmarks.includes(selectedOpp.id)
                      ? 'bg-amber-50 text-amber-700 border-amber-300'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5 fill-current" />
                  {bookmarks.includes(selectedOpp.id) ? 'Tersimpan' : 'Bookmark'}
                </button>

                <a
                  href={selectedOpp.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 bg-[#3978F6] hover:bg-[#2563eb] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 flex-1 sm:flex-none shadow-md shadow-blue-500/20"
                >
                  <span>Kunjungi Sumber Resmi</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

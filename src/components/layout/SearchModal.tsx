import React, { useState } from 'react';
import { Search, X, Compass, GraduationCap, Building2, Users2, ArrowRight } from 'lucide-react';
import { Opportunity, LearningPath, CampusFacility, StudentProfile, ActiveTab } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunities: Opportunity[];
  learningPaths: LearningPath[];
  facilities: CampusFacility[];
  students: StudentProfile[];
  onNavigateTab: (tab: ActiveTab) => void;
  onSelectOpp: (opp: Opportunity) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  opportunities,
  learningPaths,
  facilities,
  students,
  onNavigateTab,
  onSelectOpp,
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');

  const q = query.toLowerCase().trim();

  const matchedOpps = q
    ? opportunities.filter((o) => o.title.toLowerCase().includes(q) || o.organizer.toLowerCase().includes(q)).slice(0, 3)
    : [];

  const matchedPaths = q
    ? learningPaths.filter((p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)).slice(0, 2)
    : [];

  const matchedFacilities = q
    ? facilities.filter((f) => f.name.toLowerCase().includes(q) || f.building.toLowerCase().includes(q)).slice(0, 2)
    : [];

  const matchedStudents = q
    ? students.filter((s) => s.name.toLowerCase().includes(q) || s.major.toLowerCase().includes(q)).slice(0, 2)
    : [];

  const hasResults =
    matchedOpps.length > 0 ||
    matchedPaths.length > 0 ||
    matchedFacilities.length > 0 ||
    matchedStudents.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95">
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari beasiswa, modul QuestLearn, fasilitas, atau rekan belajar..."
            className="w-full text-sm font-medium focus:outline-none placeholder:text-slate-400"
          />
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!query.trim() ? (
            <div className="text-center py-8 text-xs text-slate-400 space-y-1">
              <p className="font-semibold text-slate-600">Mulai mengetik untuk mencari di seluruh CampusOne</p>
              <p>Cari: "Beasiswa", "Algoritma", "Ruang Diskusi", atau nama mahasiswa</p>
            </div>
          ) : !hasResults ? (
            <div className="text-center py-8 text-xs text-slate-500">
              Tidak ditemukan hasil untuk "{query}".
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              {/* Opportunities */}
              {matchedOpps.length > 0 && (
                <div className="space-y-1.5">
                  <span className="font-bold text-slate-400 uppercase text-[10px] flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-[#3978F6]" />
                    Peluang & Beasiswa
                  </span>
                  {matchedOpps.map((opp) => (
                    <div
                      key={opp.id}
                      onClick={() => {
                        onSelectOpp(opp);
                        onNavigateTab('opportunity');
                        onClose();
                      }}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-100 cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <h5 className="font-bold text-slate-800">{opp.title}</h5>
                        <p className="text-[11px] text-slate-500">{opp.organizer} • {opp.category}</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  ))}
                </div>
              )}

              {/* Learning Paths */}
              {matchedPaths.length > 0 && (
                <div className="space-y-1.5">
                  <span className="font-bold text-slate-400 uppercase text-[10px] flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-[#23B5A5]" />
                    QuestLearn Modul
                  </span>
                  {matchedPaths.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        onNavigateTab('questlearn');
                        onClose();
                      }}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50/70 border border-slate-100 cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <h5 className="font-bold text-slate-800">{p.title}</h5>
                        <p className="text-[11px] text-slate-500">{p.category} • {p.level}</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  ))}
                </div>
              )}

              {/* Facilities */}
              {matchedFacilities.length > 0 && (
                <div className="space-y-1.5">
                  <span className="font-bold text-slate-400 uppercase text-[10px] flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-amber-500" />
                    Fasilitas Kampus
                  </span>
                  {matchedFacilities.map((f) => (
                    <div
                      key={f.id}
                      onClick={() => {
                        onNavigateTab('smartcampus');
                        onClose();
                      }}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50/70 border border-slate-100 cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <h5 className="font-bold text-slate-800">{f.name}</h5>
                        <p className="text-[11px] text-slate-500">{f.building} • Max {f.capacity} orang</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  ))}
                </div>
              )}

              {/* Peers */}
              {matchedStudents.length > 0 && (
                <div className="space-y-1.5">
                  <span className="font-bold text-slate-400 uppercase text-[10px] flex items-center gap-1">
                    <Users2 className="w-3.5 h-3.5 text-indigo-500" />
                    Mahasiswa PeerMatch
                  </span>
                  {matchedStudents.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => {
                        onNavigateTab('peermatch');
                        onClose();
                      }}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-100 cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <img src={s.avatar} alt={s.name} className="w-7 h-7 rounded-full object-cover" />
                        <div>
                          <h5 className="font-bold text-slate-800">{s.name}</h5>
                          <p className="text-[11px] text-slate-500">{s.major} • Smt {s.semester}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

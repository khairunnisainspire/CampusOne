import React from 'react';
import {
  Compass,
  GraduationCap,
  Users2,
  Building2,
  Sparkles,
  ArrowRight,
  Bookmark,
  Calendar,
  Clock,
  CheckCircle2,
  Flame,
  Award,
  ChevronRight,
  TrendingUp,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import {
  ActiveTab,
  UserProfile,
  Opportunity,
  LearningPath,
  FacilityReservation,
  StudentProfile,
  StudyGroup,
} from '../../types';

interface DashboardPageProps {
  user: UserProfile;
  setCurrentTab: (tab: ActiveTab) => void;
  opportunities: Opportunity[];
  bookmarks: string[];
  onToggleBookmark: (oppId: string) => void;
  onSelectOpportunity: (opp: Opportunity) => void;
  learningPaths: LearningPath[];
  reservations: FacilityReservation[];
  students: StudentProfile[];
  studyGroups: StudyGroup[];
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  user,
  setCurrentTab,
  opportunities,
  bookmarks,
  onToggleBookmark,
  onSelectOpportunity,
  learningPaths,
  reservations,
  students,
  studyGroups,
}) => {
  const firstName = user.name.split(' ')[0];

  // Algorithmic recommendations for Nisa (based on major, semester, interests)
  const recommendedOpps = opportunities
    .filter((o) => o.targetDegrees.some((d) => user.major.includes(d)) || o.category === 'Beasiswa')
    .slice(0, 3);

  // Active learning path
  const activePath = learningPaths[0];
  const progressPercent = activePath
    ? Math.round((activePath.completedModulesCount / activePath.totalModules) * 100)
    : 0;

  // Active reservations
  const activeReservations = reservations.filter((r) => r.status === 'Confirmed');

  // Top peer match
  const topMatch = students.find((s) => (s.matchScore || 0) >= 90) || students[0];

  // Active study group
  const activeGroup = studyGroups.find((g) => g.isJoined) || studyGroups[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. HERO GREETING BANNER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#163B70] via-[#1c4785] to-[#3978F6] p-6 sm:p-8 text-white shadow-xl shadow-[#163B70]/15">
        {/* Subtle decorative circles */}
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full bg-teal-400/10 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-teal-200 border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>CampusOne Personal Hub • Semester {user.semester}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Halo, {firstName}! Siap berkembang hari ini?
            </h1>
            <p className="text-sm sm:text-base text-blue-100 font-normal leading-relaxed">
              Kamu memiliki <span className="font-semibold text-white">3 peluang baru</span> yang cocok dengan jurusanmu, serta reservasi ruang belajar aktif minggu ini.
            </p>
          </div>

          {/* Quick Metrics Bar on Hero */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-white/15 shrink-0">
            <div className="text-center px-3 border-r border-white/15">
              <div className="flex items-center justify-center gap-1 text-orange-300 font-black text-xl sm:text-2xl">
                <Flame className="w-5 h-5 fill-orange-400 text-orange-400" />
                {user.streakDays}
              </div>
              <div className="text-[11px] text-blue-200 uppercase font-semibold tracking-wider">Streak Hari</div>
            </div>
            <div className="text-center px-3 border-r border-white/15">
              <div className="text-xl sm:text-2xl font-black text-teal-300">
                {user.xp}
              </div>
              <div className="text-[11px] text-blue-200 uppercase font-semibold tracking-wider">XP Terkumpul</div>
            </div>
            <div className="text-center px-3">
              <div className="text-xl sm:text-2xl font-black text-amber-300">
                {user.level}
              </div>
              <div className="text-[11px] text-blue-200 uppercase font-semibold tracking-wider">Tingkatan</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. QUICK ACTIONS GRID */}
      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Aksi Cepat</h2>
          <span className="text-xs text-slate-400">Pilih modul yang ingin diakses</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <button
            onClick={() => setCurrentTab('opportunity')}
            className="flex flex-col items-start p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-[#3978F6] hover:shadow-md transition-all group text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#3978F6] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-800 text-sm group-hover:text-[#163B70]">Cari Opportunity</span>
            <span className="text-xs text-slate-500 mt-0.5">Beasiswa, magang & riset</span>
          </button>

          <button
            onClick={() => setCurrentTab('questlearn')}
            className="flex flex-col items-start p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-[#23B5A5] hover:shadow-md transition-all group text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#23B5A5] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-800 text-sm group-hover:text-teal-700">Mulai QuestLearn</span>
            <span className="text-xs text-slate-500 mt-0.5">Modul & kuis ber-XP</span>
          </button>

          <button
            onClick={() => setCurrentTab('peermatch')}
            className="flex flex-col items-start p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-[#3978F6] hover:shadow-md transition-all group text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Users2 className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-800 text-sm group-hover:text-indigo-700">Temukan Partner</span>
            <span className="text-xs text-slate-500 mt-0.5">Kecocokan jadwal & matkul</span>
          </button>

          <button
            onClick={() => setCurrentTab('smartcampus')}
            className="flex flex-col items-start p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-amber-500 hover:shadow-md transition-all group text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-800 text-sm group-hover:text-amber-700">Reservasi Fasilitas</span>
            <span className="text-xs text-slate-500 mt-0.5">Ruang diskusi & lab</span>
          </button>
        </div>
      </section>

      {/* 3. MAIN DASHBOARD CONTENT: 2-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT 2 COLUMNS: Recommended Opportunities & Learning Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section: Recommended Opportunities */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-slate-900 text-lg">Rekomendasi Peluang Terpilih</h3>
                  <span className="bg-blue-100 text-[#3978F6] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Sesuai Minatmu
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Dipilih berdasarkan profil {user.major} & semester {user.semester}.
                </p>
              </div>
              <button
                onClick={() => setCurrentTab('opportunity')}
                className="text-xs font-bold text-[#3978F6] hover:text-[#163B70] flex items-center gap-1 group"
              >
                Lihat Semua <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <div className="space-y-3">
              {recommendedOpps.map((opp) => {
                const isBookmarked = bookmarks.includes(opp.id);
                return (
                  <div
                    key={opp.id}
                    className="p-4 rounded-xl border border-slate-100 hover:border-blue-200 bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-[#163B70]/10 text-[#163B70] text-[10px] font-bold px-2 py-0.5 rounded-md">
                          {opp.category}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          Oleh {opp.organizer}
                        </span>
                        <span className="text-[11px] text-rose-600 font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {opp.daysRemaining} hari lagi
                        </span>
                      </div>
                      <h4
                        onClick={() => onSelectOpportunity(opp)}
                        className="text-sm font-bold text-slate-800 hover:text-[#3978F6] cursor-pointer transition-colors"
                      >
                        {opp.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-1">{opp.description}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <button
                        onClick={() => onToggleBookmark(opp.id)}
                        className={`p-2 rounded-lg border transition-colors ${
                          isBookmarked
                            ? 'bg-amber-50 border-amber-200 text-amber-600'
                            : 'border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                        }`}
                        title={isBookmarked ? 'Hapus bookmark' : 'Simpan peluang'}
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>
                      <button
                        onClick={() => onSelectOpportunity(opp)}
                        className="px-3 py-1.5 bg-[#163B70] hover:bg-[#1a4480] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                      >
                        Detail & AI
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Learning Progress & Active Course */}
          {activePath && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-slate-900 text-lg">Progres Belajar QuestLearn</h3>
                    <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      🔥 Streak Aktif
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Lanjutkan materi dan kuis untuk meningkatkan rank ke Achiever.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentTab('questlearn')}
                  className="text-xs font-bold text-[#3978F6] hover:text-[#163B70] flex items-center gap-1 group"
                >
                  Buka Quest <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-[#163B70] text-white space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-medium text-teal-300 uppercase tracking-wider">
                      Learning Path Berjalan
                    </span>
                    <h4 className="font-bold text-base sm:text-lg text-white mt-0.5">
                      {activePath.title}
                    </h4>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs text-blue-200 font-medium">Selesai</span>
                    <div className="text-xl font-black text-teal-300">{progressPercent}%</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-teal-400 to-[#3978F6] h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-blue-100 pt-1">
                  <span>
                    {activePath.completedModulesCount} dari {activePath.totalModules} modul terselesaikan
                  </span>
                  <button
                    onClick={() => setCurrentTab('questlearn')}
                    className="bg-white/10 hover:bg-white/20 text-white font-semibold px-3 py-1.5 rounded-lg text-xs backdrop-blur-md transition-colors flex items-center gap-1"
                  >
                    Lanjutkan Belajar <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT 1 COLUMN: Upcoming Activities & Study Partner Match */}
        <div className="space-y-6">
          {/* Upcoming Activities Widget */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#3978F6]" />
                Aktivitas Mendatang
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Minggu Ini</span>
            </div>

            <div className="space-y-3">
              {/* Facility Reservation Activity */}
              {activeReservations.length > 0 ? (
                activeReservations.map((resv) => (
                  <div
                    key={resv.id}
                    onClick={() => setCurrentTab('smartcampus')}
                    className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 hover:bg-amber-50 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-[11px] font-semibold text-amber-800">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-amber-600" />
                        Reservasi Kampus
                      </span>
                      <span className="bg-amber-100 px-1.5 py-0.5 rounded text-[10px]">
                        {resv.status}
                      </span>
                    </div>
                    <h5 className="font-bold text-xs text-slate-800 mt-1 group-hover:text-amber-900">
                      {resv.facilityName}
                    </h5>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                      <span>📅 {resv.date}</span>
                      <span>⏰ {resv.timeSlot} WIB</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 p-3 bg-slate-50 rounded-xl text-center">
                  Belum ada reservasi fasilitas.
                </div>
              )}

              {/* Study Group Session Activity */}
              {activeGroup && (
                <div
                  onClick={() => setCurrentTab('peermatch')}
                  className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/70 hover:bg-blue-50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold text-[#163B70]">
                    <span className="flex items-center gap-1">
                      <Users2 className="w-3 h-3 text-[#3978F6]" />
                      Sesi Belajar Kelompok
                    </span>
                    <span className="text-[10px] text-blue-600 font-medium">
                      {activeGroup.memberCount} Anggota
                    </span>
                  </div>
                  <h5 className="font-bold text-xs text-slate-800 mt-1 group-hover:text-[#163B70]">
                    {activeGroup.name}
                  </h5>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                    <span>⏰ {activeGroup.schedule}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Top Peer Match Widget */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Users2 className="w-4 h-4 text-[#23B5A5]" />
                Rekomendasi Partner Belajar
              </h3>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {topMatch.matchScore}% Match
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2.5">
              <div className="flex items-center gap-3">
                <img
                  src={topMatch.avatar}
                  alt={topMatch.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div className="min-w-0 flex-1">
                  <h5 className="font-bold text-xs text-slate-800 truncate">{topMatch.name}</h5>
                  <p className="text-[11px] text-slate-500 truncate">
                    {topMatch.major} • Smt {topMatch.semester}
                  </p>
                </div>
              </div>

              <div className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-100 leading-snug">
                <span className="font-semibold text-emerald-700">Kenapa Cocok? </span>
                {topMatch.matchReasons?.[0] || 'Sama-sama mengambil mata kuliah komputasi.'}
              </div>

              <button
                onClick={() => setCurrentTab('peermatch')}
                className="w-full py-1.5 bg-[#3978F6] hover:bg-[#2863d6] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 shadow-xs"
              >
                Koneksi di PeerMatch <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Campus AI Mini Card */}
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl border border-teal-200/70 p-4 space-y-2">
            <div className="flex items-center gap-2 text-teal-800 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-[#23B5A5]" />
              <span>Campus AI Siap Membantu</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bingung menyusun motivation letter beasiswa atau butuh penjelasan materi kuliah? Tanyakan apa saja ke Campus AI.
            </p>
            <button
              onClick={() => setCurrentTab('campusai')}
              className="text-xs font-bold text-[#163B70] hover:text-[#3978F6] flex items-center gap-1 pt-1"
            >
              Mulai Percakapan <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Users2,
  Search,
  Filter,
  UserPlus,
  CheckCircle2,
  Clock,
  BookOpen,
  Calendar,
  MessageSquare,
  Sparkles,
  Plus,
  X,
  Send,
  HeartHandshake,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { StudentProfile, StudyGroup, UserProfile } from '../../types';

interface PeerMatchPageProps {
  students: StudentProfile[];
  studyGroups: StudyGroup[];
  user: UserProfile;
  onSetConnection: (studentId: string, status: 'None' | 'Pending' | 'Connected') => void;
  onCreateStudyGroup: (group: Omit<StudyGroup, 'id' | 'memberCount' | 'isJoined' | 'messages'>) => void;
  onToggleJoinGroup: (groupId: string) => void;
  onSendGroupMessage: (groupId: string, text: string) => void;
}

export const PeerMatchPage: React.FC<PeerMatchPageProps> = ({
  students,
  studyGroups,
  user,
  onSetConnection,
  onCreateStudyGroup,
  onToggleJoinGroup,
  onSendGroupMessage,
}) => {
  const [activeTab, setActiveTab] = useState<'peers' | 'groups'>('peers');
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('Semua');
  const [preferenceFilter, setPreferenceFilter] = useState('Semua');

  // Create Group Modal State
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [courseName, setCourseName] = useState('Struktur Data & Algoritma');
  const [groupDesc, setGroupDesc] = useState('');
  const [groupSchedule, setGroupSchedule] = useState('Setiap Kamis 15:30 - 17:30 WIB');
  const [groupMode, setGroupMode] = useState<'Online (Zoom)' | 'Offline (Perpus Lt. 2)' | 'Hybrid'>('Offline (Perpus Lt. 2)');
  const [groupAgenda, setGroupAgenda] = useState('Latihan soal mingguan & bedah tugas besar');
  const [groupMaxMembers, setGroupMaxMembers] = useState(6);

  // Chat Modal State
  const [activeChatGroup, setActiveChatGroup] = useState<StudyGroup | null>(null);
  const [chatInput, setChatInput] = useState('');

  // Course filter options derived from students & user
  const courseOptions = [
    'Semua',
    'Struktur Data & Algoritma',
    'Basis Data Lanjut',
    'Rekayasa Perangkat Lunak',
    'Kecerdasan Buatan',
    'Jaringan Komputer',
  ];

  const filteredStudents = students.filter((s) => {
    if (courseFilter !== 'Semua' && !s.courses.includes(courseFilter)) {
      return false;
    }
    if (preferenceFilter !== 'Semua' && s.studyPreference !== preferenceFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = s.name.toLowerCase().includes(q);
      const matchMajor = s.major.toLowerCase().includes(q);
      const matchSkills = s.skills.some((sk) => sk.toLowerCase().includes(q));
      if (!matchName && !matchMajor && !matchSkills) return false;
    }
    return true;
  });

  const handleCreateGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    onCreateStudyGroup({
      name: groupName,
      courseName,
      description: groupDesc || `Kelompok belajar intensif untuk ${courseName}.`,
      creatorName: user.name,
      maxMembers: groupMaxMembers,
      schedule: groupSchedule,
      mode: groupMode,
      agenda: groupAgenda.split(',').map((a) => a.trim()).filter(Boolean),
      tags: [courseName.split(' ')[0], groupMode.split(' ')[0], 'Mahasiswa'],
    });

    setIsCreateGroupOpen(false);
    setGroupName('');
    setGroupDesc('');
    setGroupMaxMembers(6);
    setActiveTab('groups');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeChatGroup) return;
    const text = chatInput.trim();
    onSendGroupMessage(activeChatGroup.id, text);
    setChatInput('');

    // Update active chat group locally right away
    const myMsg = {
      id: `msg-${Date.now()}`,
      sender: user.name,
      senderAvatar: user.avatar,
      text,
      time: 'Baru saja',
      isMe: true,
    };

    setActiveChatGroup((prev) =>
      prev ? { ...prev, messages: [...prev.messages, myMsg] } : null
    );

    // Simulate instant supportive reply from a classmate
    setTimeout(() => {
      const replyMsg = {
        id: `msg-reply-${Date.now()}`,
        sender: 'Dimas Pratama',
        senderAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        text: 'Wah keren, terima kasih sudah update infonya Nisa! Sampai jumpa di sesi diskusi nanti.',
        time: 'Baru saja',
      };
      setActiveChatGroup((prev) =>
        prev ? { ...prev, messages: [...prev.messages, replyMsg] } : null
      );
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#163B70] tracking-tight">
              PeerMatch & Study Groups
            </h1>
            <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
              Smart Matching 40-30-20-10
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Temukan rekan belajar yang cocok dengan mata kuliah, jadwal kosong, dan preferensi metode belajarmu.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-200/80 p-1 rounded-xl self-start sm:self-auto shrink-0">
          <button
            onClick={() => setActiveTab('peers')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'peers'
                ? 'bg-white text-[#163B70] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Teman Belajar ({students.length})
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'groups'
                ? 'bg-white text-[#163B70] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Kelompok Belajar ({studyGroups.length})
          </button>
        </div>
      </div>

      {/* PEERS TAB */}
      {activeTab === 'peers' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari berdasarkan nama mahasiswa, jurusan, atau skill..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#3978F6] focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                >
                  {courseOptions.map((c) => (
                    <option key={c} value={c}>
                      Mata Kuliah: {c}
                    </option>
                  ))}
                </select>

                <select
                  value={preferenceFilter}
                  onChange={(e) => setPreferenceFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                >
                  <option value="Semua">Semua Preferensi</option>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                  <option value="Fleksibel">Fleksibel</option>
                </select>
              </div>
            </div>

            {/* Smart Matching Explanation Bar */}
            <div className="p-2.5 bg-blue-50/70 rounded-xl border border-blue-100 flex items-center justify-between text-[11px] text-[#163B70] flex-wrap gap-2">
              <span className="font-semibold">
                ℹ️ Algoritma Matching: Kesamaan Matkul (40%) • Jadwal Kosong (30%) • Minat Belajar (20%) • Metode (10%)
              </span>
              <span className="text-slate-500">Profilmu: S1 Informatika, Smt 5</span>
            </div>
          </div>

          {/* Students Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredStudents.map((st) => {
              const isConnected = st.connectionStatus === 'Connected';
              const isPending = st.connectionStatus === 'Pending';

              return (
                <div
                  key={st.id}
                  className="bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-300 hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-5 space-y-4">
                    {/* Student Top Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={st.avatar}
                          alt={st.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-slate-100 shadow-xs"
                        />
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm leading-snug">
                            {st.name}
                          </h3>
                          <p className="text-[11px] text-slate-500">
                            {st.major} • Smt {st.semester}
                          </p>
                        </div>
                      </div>

                      {/* Match Score Badge */}
                      <div className="text-right shrink-0">
                        <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 inline-block">
                          {st.matchScore}% Match
                        </span>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      "{st.bio}"
                    </p>

                    {/* Match Reasons Highlight Box */}
                    {st.matchReasons && st.matchReasons.length > 0 && (
                      <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-[11px] text-emerald-900 space-y-1">
                        <span className="font-bold flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                          Alasan Kecocokan:
                        </span>
                        <ul className="list-disc list-inside space-y-0.5 text-[10px] text-emerald-800">
                          {st.matchReasons.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Free Slots */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Jadwal Kosong Belajar:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {st.freeSlots.map((slot, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium"
                          >
                            {slot}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {st.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-[10px] bg-blue-50 text-[#163B70] px-2 py-0.5 rounded font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom / Action */}
                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-medium">
                      Metode: <strong className="text-slate-700">{st.studyPreference}</strong>
                    </span>

                    {isConnected ? (
                      <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Terkoneksi
                      </span>
                    ) : isPending ? (
                      <button
                        onClick={() => onSetConnection(st.id, 'Connected')}
                        className="px-3 py-1.5 bg-amber-100 hover:bg-emerald-100 text-amber-800 hover:text-emerald-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                        title="Klik untuk mensimulasikan penerimaan koneksi"
                      >
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Menunggu (Klik Terima)</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onSetConnection(st.id, 'Pending')}
                        className="px-3.5 py-1.5 bg-[#163B70] hover:bg-[#1e4885] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Ajukan Koneksi</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* GROUPS TAB */}
      {activeTab === 'groups' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <div>
              <h2 className="font-extrabold text-slate-900 text-base">Kelompok Belajar Kampus</h2>
              <p className="text-xs text-slate-500">
                Bergabung dengan kelompok belajar aktif atau inisiasi kelompok belajarmu sendiri.
              </p>
            </div>
            <button
              onClick={() => setIsCreateGroupOpen(true)}
              className="px-4 py-2 bg-[#163B70] hover:bg-[#1e4885] text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md shadow-blue-900/15"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Kelompok Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {studyGroups.map((group) => {
              return (
                <div
                  key={group.id}
                  className="bg-white rounded-2xl border border-slate-200/80 hover:border-blue-300 hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="bg-blue-100 text-[#163B70] font-bold px-2 py-0.5 rounded-md">
                        {group.courseName}
                      </span>
                      <span className="text-slate-500 font-medium">{group.mode}</span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                      {group.name}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {group.description}
                    </p>

                    <div className="p-2.5 bg-slate-50 rounded-xl text-xs text-slate-700 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <Calendar className="w-3.5 h-3.5 text-[#3978F6]" />
                        <span>{group.schedule}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Dibuat oleh: <span className="font-medium text-slate-700">{group.creatorName}</span>
                      </div>
                    </div>

                    {/* Agendas */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase text-slate-400">Agenda Sesi:</span>
                      <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                        {group.agenda.slice(0, 2).map((a, i) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600">
                      👥 {group.memberCount} / {group.maxMembers} Anggota
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveChatGroup(group)}
                        className="p-2 bg-white text-slate-600 hover:text-[#163B70] border border-slate-200 rounded-xl transition-colors relative"
                        title="Buka Ruang Diskusi Kelompok"
                      >
                        <MessageSquare className="w-4 h-4" />
                        {group.messages.length > 0 && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#3978F6] rounded-full"></span>
                        )}
                      </button>

                      <button
                        onClick={() => onToggleJoinGroup(group.id)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          group.isJoined
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                            : 'bg-[#3978F6] hover:bg-[#2764db] text-white shadow-xs'
                        }`}
                      >
                        {group.isJoined ? 'Telah Bergabung' : 'Gabung Kelompok'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CREATE GROUP MODAL */}
      {isCreateGroupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-lg">Buat Kelompok Belajar Baru</h3>
              <button
                onClick={() => setIsCreateGroupOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGroupSubmit} className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Kelompok</label>
                <input
                  type="text"
                  required
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Misal: Study Group Algoritma & Graf"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#3978F6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mata Kuliah</label>
                <input
                  type="text"
                  required
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#3978F6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Jadwal Pertemuan</label>
                <input
                  type="text"
                  required
                  value={groupSchedule}
                  onChange={(e) => setGroupSchedule(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#3978F6] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mode Pertemuan</label>
                  <select
                    value={groupMode}
                    onChange={(e) => setGroupMode(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Offline (Perpus Lt. 2)">Offline (Perpustakaan)</option>
                    <option value="Online (Zoom)">Online (Zoom/Meet)</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Anggota</label>
                  <input
                    type="number"
                    value={groupMaxMembers}
                    onChange={(e) => setGroupMaxMembers(Math.max(2, Math.min(12, Number(e.target.value))))}
                    min={2}
                    max={12}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Agenda / Topik Diskusi</label>
                <textarea
                  rows={2}
                  value={groupAgenda}
                  onChange={(e) => setGroupAgenda(e.target.value)}
                  placeholder="Review materi, latihan soal, bedah proyek"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#3978F6] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateGroupOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#163B70] text-white rounded-xl font-bold hover:bg-[#1e4885] transition-colors shadow-md shadow-blue-900/15"
                >
                  Publikasikan Kelompok
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SIMULATED GROUP CHAT MODAL */}
      {activeChatGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 flex flex-col h-[600px] max-h-[90vh] overflow-hidden my-auto animate-in zoom-in-95">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">{activeChatGroup.name}</h3>
                <p className="text-[11px] text-slate-500">
                  {activeChatGroup.courseName} • {activeChatGroup.memberCount} Anggota
                </p>
              </div>
              <button
                onClick={() => setActiveChatGroup(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F6F8FC]">
              <div className="text-center my-2">
                <span className="text-[10px] bg-slate-200 text-slate-600 px-3 py-1 rounded-full">
                  Diskusi Terenkripsi Simulasi Demo
                </span>
              </div>

              {activeChatGroup.messages.map((m) => {
                const isMe = m.isMe || m.sender === user.name;
                return (
                  <div
                    key={m.id}
                    className={`flex items-start gap-2.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <img
                      src={m.senderAvatar}
                      alt={m.sender}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200 mt-0.5"
                    />
                    <div
                      className={`max-w-[78%] rounded-2xl p-3 text-xs leading-relaxed ${
                        isMe
                          ? 'bg-[#163B70] text-white rounded-tr-none'
                          : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 mb-1 text-[10px] opacity-75">
                        <span className="font-bold">{m.sender}</span>
                        <span>{m.time}</span>
                      </div>
                      <p>{m.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chat Input */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 border-t border-slate-100 bg-white flex items-center gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ketik pesan untuk kelompok belajar..."
                className="flex-1 px-3.5 py-2 bg-slate-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#3978F6] focus:bg-white"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="p-2 bg-[#3978F6] disabled:opacity-40 text-white rounded-xl hover:bg-[#2764db] transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass,
  GraduationCap,
  Users2,
  Building2,
  KeyRound,
  Mail,
} from 'lucide-react';
import { UserProfile } from '../../types';

interface LoginPageProps {
  onLogin: () => void;
  onExploreDemo: () => void;
  onSaveCustomProfile?: (profile: Partial<UserProfile>) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  onExploreDemo,
  onSaveCustomProfile,
}) => {
  const [email, setEmail] = useState('nisa.fauziah@campus.ac.id');
  const [password, setPassword] = useState('password123');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Custom onboarding state
  const [name, setName] = useState('Nisa Fauziah');
  const [major, setMajor] = useState('S1 Teknik Informatika');
  const [semester, setSemester] = useState(5);
  const [interests, setInterests] = useState('Artificial Intelligence, Software Engineering');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  const handleFinishOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSaveCustomProfile) {
      onSaveCustomProfile({
        name,
        major,
        semester: Number(semester),
        interests: interests.split(',').map((s) => s.trim()).filter(Boolean),
      });
    }
    setIsOnboardingOpen(false);
    onLogin();
  };

  return (
    <div className="min-h-screen bg-[#F6F8FC] flex flex-col justify-center items-center p-4">
      {/* Container */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Side: Brand Visual */}
        <div className="bg-gradient-to-br from-[#163B70] via-[#1c4885] to-[#3978F6] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center font-black text-2xl tracking-wider border border-white/20">
                C1
              </div>
              <div>
                <span className="font-extrabold text-2xl tracking-tight block">CampusOne</span>
                <span className="text-xs text-teal-200 font-medium">One Campus. Endless Possibilities.</span>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h2 className="text-2xl font-black leading-tight">
                All-in-One Super App untuk Mahasiswa Modern.
              </h2>
              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed font-normal">
                Satu platform terintegrasi yang menyatukan peluang beasiswa, pembelajaran personal ber-AI, kolaborasi kelompok, dan reservasi fasilitas kampus.
              </p>
            </div>

            {/* Core Feature Badges */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-blue-100">
                <Compass className="w-4 h-4 text-teal-300 shrink-0" />
                <span>Opportunity Central (Beasiswa, Magang & Riset)</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-blue-100">
                <GraduationCap className="w-4 h-4 text-teal-300 shrink-0" />
                <span>QuestLearn (Gamifikasi Modul & Kuis AI)</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-blue-100">
                <Users2 className="w-4 h-4 text-teal-300 shrink-0" />
                <span>PeerMatch (Algoritma Pencocokan Teman Belajar)</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-blue-100">
                <Building2 className="w-4 h-4 text-teal-300 shrink-0" />
                <span>SmartCampus (Reservasi Ruang Diskusi & Lab)</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 mt-6 border-t border-white/15 text-[11px] text-blue-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-300" />
            <span>Kandidat Prototype Kompetisi Inovasi Teknologi Kampus</span>
          </div>
        </div>

        {/* Right Side: Login & Demo Options */}
        <div className="p-8 sm:p-10 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200 mb-2">
                <span>⚡ Mode Demonstrasi Juri</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Masuk ke CampusOne
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Gunakan akun demo atau langsung klik tombol "Coba Demo" di bawah.
              </p>
            </div>

            {/* Fast Track Explore Demo Button */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 space-y-2">
              <span className="text-xs font-bold text-[#163B70] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#3978F6]" />
                Akses Langsung untuk Juri & Penilai:
              </span>
              <p className="text-[11px] text-slate-600 leading-snug">
                Langsung masuk dengan profil mahasiswa Nisa (Informatika Smt 5) dengan data peluang dan modul siap diuji.
              </p>
              <button
                type="button"
                onClick={onExploreDemo}
                className="w-full py-2.5 bg-[#3978F6] hover:bg-[#2563eb] text-white text-xs font-extrabold rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
              >
                <span>Coba Demo Sekarang (Explore Demo)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-slate-400">Atau masuk dengan akun</span>
              </div>
            </div>

            {/* Traditional Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Mahasiswa</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#3978F6] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kata Sandi</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#3978F6] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#163B70] hover:bg-[#1f4a88] text-white font-bold rounded-xl transition-colors shadow-xs"
              >
                Masuk ke Portal
              </button>
            </form>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>© 2026 CampusOne Project</span>
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="text-[#3978F6] hover:underline font-semibold"
            >
              Atur Profil Baru
            </button>
          </div>
        </div>
      </div>

      {/* ONBOARDING MODAL */}
      {isOnboardingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div>
              <span className="text-[10px] font-bold text-[#3978F6] uppercase">Onboarding Mahasiswa</span>
              <h3 className="font-extrabold text-slate-900 text-lg">Sesuaikan Profil Mahasiswamu</h3>
              <p className="text-xs text-slate-500">
                Data ini akan digunakan untuk mencocokkan peluang, rekomendasi kuis, dan partner belajar.
              </p>
            </div>

            <form onSubmit={handleFinishOnboarding} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Mahasiswa</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Program Studi</label>
                <input
                  type="text"
                  required
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Semester</label>
                <input
                  type="number"
                  min={1}
                  max={14}
                  value={semester}
                  onChange={(e) => setSemester(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Minat / Bidang Minat</label>
                <input
                  type="text"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  placeholder="Contoh: AI, Web, UI/UX, Bisnis"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOnboardingOpen(false)}
                  className="px-4 py-2 font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#163B70] text-white font-bold rounded-xl"
                >
                  Simpan & Mulai Demo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

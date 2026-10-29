import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Sparkles,
  Award,
  Zap,
  Flame,
  BookOpen,
  Edit3,
  Check,
  RotateCcw,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { UserProfile } from '../../types';

interface ProfilePageProps {
  user: UserProfile;
  onUpdateUser: (updates: Partial<UserProfile>) => void;
  onResetDemo: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  onUpdateUser,
  onResetDemo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [major, setMajor] = useState(user.major);
  const [semester, setSemester] = useState(user.semester);
  const [gpa, setGpa] = useState(user.gpa);
  const [interestsText, setInterestsText] = useState(user.interests.join(', '));
  const [coursesText, setCoursesText] = useState(user.currentCourses.join(', '));
  const [skillsText, setSkillsText] = useState(user.targetSkills.join(', '));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name,
      major,
      semester: Number(semester),
      gpa,
      interests: interestsText.split(',').map((s) => s.trim()).filter(Boolean),
      currentCourses: coursesText.split(',').map((s) => s.trim()).filter(Boolean),
      targetSkills: skillsText.split(',').map((s) => s.trim()).filter(Boolean),
    });
    setIsEditing(false);
  };

  const handlePresetSwitch = (preset: 'nisa' | 'dimas' | 'alya') => {
    if (preset === 'nisa') {
      onUpdateUser({
        name: 'Nisa Fauziah',
        major: 'S1 Teknik Informatika',
        semester: 5,
        gpa: '3.82',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        interests: ['Artificial Intelligence', 'Software Engineering', 'UI/UX Design'],
        currentCourses: ['Struktur Data & Algoritma', 'Basis Data Lanjut', 'Rekayasa Perangkat Lunak'],
        targetSkills: ['React & TypeScript', 'Python Data Science', 'System Design'],
      });
    } else if (preset === 'dimas') {
      onUpdateUser({
        name: 'Dimas Pratama Putra',
        major: 'S1 Teknik Informatika',
        semester: 5,
        gpa: '3.78',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        interests: ['Distributed Systems', 'Backend Development', 'Competitive Programming'],
        currentCourses: ['Struktur Data & Algoritma', 'Jaringan Komputer', 'Basis Data Lanjut'],
        targetSkills: ['Go', 'PostgreSQL', 'Docker'],
      });
    } else {
      onUpdateUser({
        name: 'Alya Putri Kirana',
        major: 'S1 Sains Data',
        semester: 5,
        gpa: '3.91',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        interests: ['Data Science', 'Machine Learning', 'Beasiswa Luar Negeri'],
        currentCourses: ['Statistika Terapan', 'Basis Data Lanjut', 'Machine Learning'],
        targetSkills: ['Python', 'R', 'Tableau'],
      });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 left-0 h-28 bg-gradient-to-r from-[#163B70] via-[#1f4a88] to-[#3978F6]" />

        <div className="relative pt-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md bg-white"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900">{user.name}</h1>
                <span className="text-[10px] font-bold bg-blue-100 text-[#3978F6] px-2 py-0.5 rounded-full">
                  Level {user.level}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {user.major} • Semester {user.semester} • IPK: <strong className="text-slate-800">{user.gpa}</strong>
              </p>
              <p className="text-xs text-slate-400">{user.university}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Batal Edit' : 'Edit Profil'}</span>
            </button>
          </div>
        </div>

        {/* Quick Demo Switcher for Competition Judges */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-slate-700">Preset Mahasiswa Demo (Uji Personalisasi):</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePresetSwitch('nisa')}
              className="px-3 py-1 bg-blue-50 text-[#163B70] hover:bg-blue-100 rounded-lg font-bold text-[11px]"
            >
              Nisa (Informatika)
            </button>
            <button
              onClick={() => handlePresetSwitch('dimas')}
              className="px-3 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-bold text-[11px]"
            >
              Dimas (Backend)
            </button>
            <button
              onClick={() => handlePresetSwitch('alya')}
              className="px-3 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-bold text-[11px]"
            >
              Alya (Sains Data)
            </button>
          </div>
        </div>
      </div>

      {/* Edit Form (if active) */}
      {isEditing && (
        <form
          onSubmit={handleSaveProfile}
          className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4 text-xs sm:text-sm animate-in fade-in"
        >
          <h3 className="font-bold text-slate-900 text-base">Perbarui Data Mahasiswa</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Lengkap</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Program Studi</label>
              <input
                type="text"
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
              <label className="block font-bold text-slate-700 mb-1">IPK Terakhir</label>
              <input
                type="text"
                value={gpa}
                onChange={(e) => setGpa(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Minat & Bidang (Pisahkan dengan koma)
            </label>
            <input
              type="text"
              value={interestsText}
              onChange={(e) => setInterestsText(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Mata Kuliah Semester Ini (Pisahkan dengan koma)
            </label>
            <input
              type="text"
              value={coursesText}
              onChange={(e) => setCoursesText(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Target Skill (Pisahkan dengan koma)
            </label>
            <input
              type="text"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#163B70] text-white font-bold rounded-xl shadow-xs hover:bg-[#1e4885]"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      )}

      {/* Gamification Badges & Milestones */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          Koleksi Badge & Pencapaian
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {user.badges.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-2xl border transition-all ${
                b.unlockedAt
                  ? 'bg-amber-50/50 border-amber-200 shadow-xs'
                  : 'bg-slate-50/50 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{b.icon}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    b.unlockedAt
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {b.unlockedAt ? 'Terbuka' : 'Terkunci'}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs">{b.name}</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{b.description}</p>
              {b.unlockedAt && (
                <div className="text-[10px] text-amber-700 font-semibold mt-2">
                  Dibuka: {b.unlockedAt}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Academic Details & Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#3978F6]" />
            Mata Kuliah Semester Ini
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {user.currentCourses.map((c, i) => (
              <span
                key={i}
                className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-xl font-medium"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Zap className="w-4 h-4 text-teal-600" />
            Target Skill & Minat
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {user.targetSkills.map((s, i) => (
              <span
                key={i}
                className="text-xs bg-teal-50 text-teal-800 px-3 py-1 rounded-xl font-semibold border border-teal-100"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

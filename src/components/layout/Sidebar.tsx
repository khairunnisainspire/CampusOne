import React from 'react';
import {
  LayoutDashboard,
  Compass,
  GraduationCap,
  Users2,
  Building2,
  Sparkles,
  Bell,
  User,
  ShieldCheck,
  RotateCcw,
  LogOut,
} from 'lucide-react';
import { ActiveTab, UserProfile } from '../../types';

interface SidebarProps {
  currentTab: ActiveTab;
  setCurrentTab: (tab: ActiveTab) => void;
  user: UserProfile;
  unreadCount: number;
  onResetDemo: () => void;
  onLogout: () => void;
  onSwitchProfileDemo: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  user,
  unreadCount,
  onResetDemo,
  onLogout,
  onSwitchProfileDemo,
}) => {
  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'opportunity' as ActiveTab,
      label: 'Opportunity Central',
      icon: Compass,
      badge: 'Hot',
      badgeColor: 'bg-rose-100 text-rose-700',
    },
    {
      id: 'questlearn' as ActiveTab,
      label: 'QuestLearn',
      icon: GraduationCap,
      badge: 'XP',
      badgeColor: 'bg-blue-100 text-[#3978F6]',
    },
    {
      id: 'peermatch' as ActiveTab,
      label: 'PeerMatch',
      icon: Users2,
      badge: '94% Match',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'smartcampus' as ActiveTab,
      label: 'SmartCampus',
      icon: Building2,
      badge: null,
    },
    {
      id: 'campusai' as ActiveTab,
      label: 'Campus AI',
      icon: Sparkles,
      badge: 'AI',
      badgeColor: 'bg-teal-100 text-[#23B5A5] font-bold',
    },
    {
      id: 'notifications' as ActiveTab,
      label: 'Notifikasi',
      icon: Bell,
      badge: unreadCount > 0 ? `${unreadCount}` : null,
      badgeColor: 'bg-rose-500 text-white font-bold',
    },
    {
      id: 'profile' as ActiveTab,
      label: 'Profil Saya',
      icon: User,
      badge: null,
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-200/80 h-screen sticky top-0 z-40 select-none">
      {/* Brand Header */}
      <div className="p-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#163B70] via-[#1b4887] to-[#3978F6] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-[#163B70]/20 tracking-wider">
            C1
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-[#163B70] text-xl tracking-tight">CampusOne</span>
              <span className="bg-[#23B5A5]/15 text-[#23B5A5] text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase">
                Pro
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">One Campus. Endless Possibilities.</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
          Navigasi Utama
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-[#163B70] to-[#1e4885] text-white shadow-md shadow-[#163B70]/15 translate-x-0.5'
                  : 'text-slate-600 hover:text-[#163B70] hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-teal-300' : 'text-slate-400 group-hover:text-[#3978F6]'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold transition-colors ${
                    isActive ? 'bg-white/20 text-white' : item.badgeColor
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Demo Controller Widget */}
      <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/70">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
          <span className="flex items-center gap-1 font-semibold text-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Mode Juri Demo
          </span>
          <button
            onClick={onResetDemo}
            className="text-[11px] text-[#3978F6] hover:underline flex items-center gap-1"
            title="Reset data demo ke awal"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>
        <p className="text-[11px] text-slate-400 leading-snug">
          Data simulasi interaktif tersimpan lokal di browser tanpa perlu server eksternal.
        </p>
      </div>

      {/* User Card Bottom */}
      <div className="p-4 border-t border-slate-100 bg-white">
        <div className="flex items-center justify-between gap-3">
          <div
            onClick={() => setCurrentTab('profile')}
            className="flex items-center gap-3 cursor-pointer group flex-1 min-w-0"
          >
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-slate-200 group-hover:border-[#3978F6] transition-colors"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate group-hover:text-[#163B70]">
                {user.name}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                {user.major.replace('S1 ', '')} • Smt {user.semester}
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            title="Keluar / Ganti Akun Demo"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

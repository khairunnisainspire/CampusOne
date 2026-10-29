import React from 'react';
import {
  Bell,
  Sparkles,
  Flame,
  Zap,
  Search,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { ActiveTab, UserProfile, AppNotification } from '../../types';

interface NavbarProps {
  currentTab: ActiveTab;
  setCurrentTab: (tab: ActiveTab) => void;
  user: UserProfile;
  notifications: AppNotification[];
  onOpenNotifications: () => void;
  onResetDemo: () => void;
  onSearchClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  user,
  notifications,
  onOpenNotifications,
  onResetDemo,
  onSearchClick,
}) => {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Title or Search bar */}
        <div className="flex items-center gap-3">
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#163B70] to-[#3978F6] flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-900/20">
              C1
            </div>
            <span className="font-bold text-[#163B70] text-lg tracking-tight">CampusOne</span>
          </div>

          <div
            onClick={onSearchClick}
            className="hidden md:flex items-center gap-2.5 bg-slate-100 hover:bg-slate-200/70 text-slate-500 text-sm px-3.5 py-2 rounded-xl cursor-pointer transition-colors w-64 lg:w-80 border border-slate-200/60"
          >
            <Search className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-400 font-normal">Cari peluang, modul, fasilitas, teman...</span>
            <kbd className="ml-auto text-[10px] bg-white border border-slate-300 rounded px-1.5 py-0.5 text-slate-400 font-mono">
              Ctrl+K
            </kbd>
          </div>
        </div>

        {/* Right Action Icons & Badges */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Demo Mode Badge for Judges */}
          <div className="hidden sm:flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-full text-[11px] font-medium text-amber-800 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>Demo Mode</span>
          </div>

          {/* Reset Demo State Button */}
          <button
            onClick={onResetDemo}
            title="Reset data demo ke awal kompetisi"
            className="hidden sm:flex items-center gap-1 text-xs text-slate-500 hover:text-[#163B70] hover:bg-slate-100 px-2.5 py-1.5 rounded-lg transition-colors border border-transparent hover:border-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset Demo</span>
          </button>

          {/* Learning Streak */}
          <div
            onClick={() => setCurrentTab('questlearn')}
            className="flex items-center gap-1.5 bg-orange-50 hover:bg-orange-100/80 text-orange-700 px-2.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all border border-orange-200/60 shadow-xs"
            title={`${user.streakDays} hari belajar berturut-turut!`}
          >
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span>{user.streakDays} Hari</span>
          </div>

          {/* XP & Level Badge */}
          <div
            onClick={() => setCurrentTab('questlearn')}
            className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100/80 text-[#163B70] px-2.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all border border-blue-200/60 shadow-xs"
            title={`${user.xp} XP total. Klik untuk membuka QuestLearn.`}
          >
            <Zap className="w-3.5 h-3.5 text-[#3978F6] fill-[#3978F6]" />
            <span>{user.xp} XP</span>
            <span className="hidden md:inline text-[10px] text-[#3978F6] font-medium bg-blue-100 px-1.5 py-0.5 rounded-full">
              {user.level}
            </span>
          </div>

          {/* Campus AI Quick Button */}
          <button
            onClick={() => setCurrentTab('campusai')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shadow-xs ${
              currentTab === 'campusai'
                ? 'bg-[#163B70] text-white shadow-blue-900/20'
                : 'bg-teal-50 hover:bg-teal-100/80 text-teal-800 border border-teal-200/70'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#23B5A5]" />
            <span className="hidden sm:inline">Campus AI</span>
          </button>

          {/* Notification Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="Pusat Notifikasi"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Avatar & Profile Quick Link */}
          <button
            onClick={() => setCurrentTab('profile')}
            className="flex items-center gap-2 p-1 pl-1.5 rounded-full hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-xs"
            />
            <span className="hidden lg:inline text-xs font-semibold text-slate-700">
              {user.name.split(' ')[0]}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

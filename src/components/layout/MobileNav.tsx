import React from 'react';
import {
  LayoutDashboard,
  Compass,
  GraduationCap,
  Users2,
  Building2,
  Sparkles,
} from 'lucide-react';
import { ActiveTab } from '../../types';

interface MobileNavProps {
  currentTab: ActiveTab;
  setCurrentTab: (tab: ActiveTab) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, setCurrentTab }) => {
  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'Home', icon: LayoutDashboard },
    { id: 'opportunity' as ActiveTab, label: 'Peluang', icon: Compass },
    { id: 'campusai' as ActiveTab, label: 'AI', icon: Sparkles, isAi: true },
    { id: 'questlearn' as ActiveTab, label: 'Belajar', icon: GraduationCap },
    { id: 'peermatch' as ActiveTab, label: 'Partner', icon: Users2 },
    { id: 'smartcampus' as ActiveTab, label: 'Fasilitas', icon: Building2 },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-2 px-2 z-40 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          if (item.isAi) {
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className="-mt-5 relative p-3 rounded-full bg-gradient-to-tr from-[#163B70] via-[#1b4887] to-[#3978F6] text-white shadow-lg shadow-blue-900/30 active:scale-95 transition-transform"
                aria-label="Campus AI"
              >
                <Sparkles className="w-5 h-5 text-teal-300 animate-pulse" />
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-colors ${
                isActive ? 'text-[#163B70] font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon
                className={`w-4 h-4 transition-transform ${
                  isActive ? 'scale-110 text-[#3978F6]' : 'text-slate-400'
                }`}
              />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

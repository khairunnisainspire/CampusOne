import React, { useState, useEffect } from 'react';
import {
  ActiveTab,
  UserProfile,
  Opportunity,
  OpportunityStatus,
  LearningPath,
  StudentProfile,
  StudyGroup,
  CampusFacility,
  FacilityReservation,
  AppNotification,
} from './types';
import { storageService } from './services/storageService';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { NotificationModal } from './components/layout/NotificationModal';
import { SearchModal } from './components/layout/SearchModal';
import { DashboardPage } from './components/pages/DashboardPage';
import { OpportunityCentralPage } from './components/pages/OpportunityCentralPage';
import { QuestLearnPage } from './components/pages/QuestLearnPage';
import { PeerMatchPage } from './components/pages/PeerMatchPage';
import { SmartCampusPage } from './components/pages/SmartCampusPage';
import { CampusAIPage } from './components/pages/CampusAIPage';
import { ProfilePage } from './components/pages/ProfilePage';
import { LoginPage } from './components/pages/LoginPage';
import { CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => storageService.isLoggedIn());
  const [currentTab, setCurrentTab] = useState<ActiveTab>('dashboard');

  // Application Data States
  const [user, setUser] = useState<UserProfile>(() => storageService.getUser());
  const [opportunities, setOpportunities] = useState<Opportunity[]>(() =>
    storageService.getOpportunities()
  );
  const [bookmarks, setBookmarks] = useState<string[]>(() => storageService.getBookmarks());
  const [statusMap, setStatusMap] = useState<Record<string, OpportunityStatus>>(() =>
    storageService.getOpportunityStatusMap()
  );
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>(() =>
    storageService.getLearningPaths()
  );
  const [students, setStudents] = useState<StudentProfile[]>(() => storageService.getStudents());
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>(() => storageService.getStudyGroups());
  const [facilities, setFacilities] = useState<CampusFacility[]>(() => storageService.getFacilities());
  const [reservations, setReservations] = useState<FacilityReservation[]>(() =>
    storageService.getReservations()
  );
  const [bookedSlots, setBookedSlots] = useState(() => storageService.getBookedSlots());
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    storageService.getNotifications()
  );

  // Modals & Overlay state
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [toast, setToast] = useState<{ message: string; type?: 'info' | 'success' } | null>(null);

  // Toast auto-clear
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'info' | 'success' = 'success') => {
    setToast({ message, type });
  };

  // Keyboard shortcut for Search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers
  const handleToggleBookmark = (oppId: string) => {
    const updated = storageService.toggleBookmark(oppId);
    setBookmarks(updated);
    const isNowBookmarked = updated.includes(oppId);
    showToast(
      isNowBookmarked ? 'Peluang berhasil disimpan ke Bookmark!' : 'Peluang dihapus dari Bookmark.'
    );
  };

  const handleSetOpportunityStatus = (oppId: string, status: OpportunityStatus) => {
    const updated = storageService.setOpportunityStatus(oppId, status);
    setStatusMap({ ...updated });
    showToast(`Status diperbarui menjadi: ${status}`);
  };

  const handleCompleteModule = (pathId: string, moduleId: string) => {
    const result = storageService.completeModule(pathId, moduleId);
    setLearningPaths(result.paths);
    setUser(storageService.getUser());
    setNotifications(storageService.getNotifications());
    showToast(`Modul berhasil diselesaikan! +${result.xpGained} XP diperoleh 🎉`);
  };

  const handleAddXp = (amount: number, reason?: string) => {
    const result = storageService.addXp(amount, reason);
    setUser(result.user);
    setNotifications(storageService.getNotifications());
    if (result.levelUp) {
      showToast(`🏆 Selamat! Kamu naik level ke ${result.user.level}!`);
    } else {
      showToast(`+${amount} XP diperoleh!`);
    }
  };

  const handleUnlockBadge = (badgeId: string) => {
    const updated = storageService.unlockBadge(badgeId);
    setUser(updated);
    setNotifications(storageService.getNotifications());
    showToast('🏆 Kamu berhasil membuka badge pencapaian baru!');
  };

  const handleSetStudentConnection = (
    studentId: string,
    status: 'None' | 'Pending' | 'Connected'
  ) => {
    const updated = storageService.setStudentConnection(studentId, status);
    setStudents(updated);
    if (status === 'Pending') {
      showToast('Permintaan koneksi belajar telah terkirim!');
    } else if (status === 'Connected') {
      showToast('Koneksi terhubung! Kamu sekarang rekan belajar resmi.');
      const connectedCount = updated.filter((s) => s.connectionStatus === 'Connected').length;
      if (connectedCount >= 3) {
        handleUnlockBadge('b-networker');
      } else {
        setUser(storageService.getUser());
      }
    }
  };

  const handleCreateStudyGroup = (
    groupData: Omit<StudyGroup, 'id' | 'memberCount' | 'isJoined' | 'messages'>
  ) => {
    storageService.createStudyGroup(groupData);
    setStudyGroups(storageService.getStudyGroups());
    setNotifications(storageService.getNotifications());
    showToast('Kelompok belajar baru berhasil dipublikasikan!');
  };

  const handleToggleJoinGroup = (groupId: string) => {
    const updated = storageService.toggleJoinGroup(groupId);
    setStudyGroups(updated);
    const grp = updated.find((g) => g.id === groupId);
    showToast(grp?.isJoined ? 'Kamu bergabung dengan kelompok belajar!' : 'Keluar dari kelompok.');
  };

  const handleSendGroupMessage = (groupId: string, text: string) => {
    const updated = storageService.sendGroupMessage(groupId, text);
    setStudyGroups(updated);
  };

  const handleCreateReservation = (params: {
    facilityId: string;
    date: string;
    timeSlot: string;
    purpose: string;
    attendeesCount: number;
  }) => {
    const result = storageService.createReservation(params);
    if (result.success) {
      setReservations(storageService.getReservations());
      setBookedSlots(storageService.getBookedSlots());
      setNotifications(storageService.getNotifications());
      showToast('Reservasi berhasil disetujui!');
    }
    return result;
  };

  const handleCancelReservation = (reservationId: string) => {
    const updated = storageService.cancelReservation(reservationId);
    setReservations(updated);
    setBookedSlots(storageService.getBookedSlots());
    setNotifications(storageService.getNotifications());
    showToast('Reservasi telah dibatalkan.');
  };

  const handleUpdateUser = (updates: Partial<UserProfile>) => {
    const updated = storageService.updateUser(updates);
    setUser(updated);
    showToast('Profil mahasiswa berhasil diperbarui!');
  };

  const handleResetDemo = () => {
    storageService.resetAllDemoData();
    setUser(storageService.getUser());
    setOpportunities(storageService.getOpportunities());
    setBookmarks(storageService.getBookmarks());
    setStatusMap(storageService.getOpportunityStatusMap());
    setLearningPaths(storageService.getLearningPaths());
    setStudents(storageService.getStudents());
    setStudyGroups(storageService.getStudyGroups());
    setFacilities(storageService.getFacilities());
    setReservations(storageService.getReservations());
    setBookedSlots(storageService.getBookedSlots());
    setNotifications(storageService.getNotifications());
    setSelectedOpportunity(null);
    setCurrentTab('dashboard');
    showToast('Semua data demo telah di-reset ke kondisi awal kompetisi!', 'info');
  };

  const handleLogout = () => {
    storageService.setLoggedIn(false);
    setIsLoggedIn(false);
  };

  const handleLogin = () => {
    storageService.setLoggedIn(true);
    setIsLoggedIn(true);
  };

  // If user is logged out, show Login & Explore Demo page
  if (!isLoggedIn) {
    return (
      <LoginPage
        onLogin={handleLogin}
        onExploreDemo={handleLogin}
        onSaveCustomProfile={handleUpdateUser}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F8FC] flex text-slate-800 antialiased font-sans">
      {/* Desktop Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        user={user}
        unreadCount={notifications.filter((n) => !n.isRead).length}
        onResetDemo={handleResetDemo}
        onLogout={handleLogout}
        onSwitchProfileDemo={() => setCurrentTab('profile')}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <Navbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          user={user}
          notifications={notifications}
          onOpenNotifications={() => setIsNotificationOpen(true)}
          onResetDemo={handleResetDemo}
          onSearchClick={() => setIsSearchOpen(true)}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-8">
          {currentTab === 'dashboard' && (
            <DashboardPage
              user={user}
              setCurrentTab={setCurrentTab}
              opportunities={opportunities}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
              onSelectOpportunity={(opp) => {
                setSelectedOpportunity(opp);
                setCurrentTab('opportunity');
              }}
              learningPaths={learningPaths}
              reservations={reservations}
              students={students}
              studyGroups={studyGroups}
            />
          )}

          {currentTab === 'opportunity' && (
            <OpportunityCentralPage
              opportunities={opportunities}
              bookmarks={bookmarks}
              statusMap={statusMap}
              onToggleBookmark={handleToggleBookmark}
              onSetStatus={handleSetOpportunityStatus}
              user={user}
              selectedOpp={selectedOpportunity}
              onSelectOpportunity={setSelectedOpportunity}
            />
          )}

          {currentTab === 'questlearn' && (
            <QuestLearnPage
              learningPaths={learningPaths}
              user={user}
              onCompleteModule={handleCompleteModule}
              onAddXp={handleAddXp}
              onUnlockBadge={handleUnlockBadge}
            />
          )}

          {currentTab === 'peermatch' && (
            <PeerMatchPage
              students={students}
              studyGroups={studyGroups}
              user={user}
              onSetConnection={handleSetStudentConnection}
              onCreateStudyGroup={handleCreateStudyGroup}
              onToggleJoinGroup={handleToggleJoinGroup}
              onSendGroupMessage={handleSendGroupMessage}
            />
          )}

          {currentTab === 'smartcampus' && (
            <SmartCampusPage
              facilities={facilities}
              reservations={reservations}
              bookedSlots={bookedSlots}
              user={user}
              onCreateReservation={handleCreateReservation}
              onCancelReservation={handleCancelReservation}
            />
          )}

          {currentTab === 'campusai' && <CampusAIPage user={user} />}

          {currentTab === 'notifications' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs max-w-3xl mx-auto space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h2 className="font-extrabold text-slate-900 text-lg">Pusat Notifikasi</h2>
                <button
                  onClick={() => {
                    const updated = storageService.markAllNotificationsAsRead();
                    setNotifications(updated);
                    showToast('Semua notifikasi ditandai dibaca.');
                  }}
                  className="text-xs font-bold text-[#3978F6] hover:underline"
                >
                  Tandai Semua Dibaca
                </button>
              </div>

              <div className="space-y-3">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      if (n.targetTab) setCurrentTab(n.targetTab);
                      const updated = storageService.markNotificationAsRead(n.id);
                      setNotifications(updated);
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      n.isRead
                        ? 'bg-slate-50 border-slate-100 text-slate-600'
                        : 'bg-blue-50/60 border-blue-200 text-slate-900 font-semibold'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold">{n.title}</h4>
                      <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentTab === 'profile' && (
            <ProfilePage
              user={user}
              onUpdateUser={handleUpdateUser}
              onResetDemo={handleResetDemo}
            />
          )}
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileNav currentTab={currentTab} setCurrentTab={setCurrentTab} />
      </div>

      {/* Slide-over Notifications Modal */}
      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() => {
          const updated = storageService.markAllNotificationsAsRead();
          setNotifications(updated);
        }}
        onClearAll={() => {
          storageService.clearNotifications();
          setNotifications([]);
        }}
        onNotificationClick={(notif) => {
          if (notif.targetTab) {
            setCurrentTab(notif.targetTab);
            setIsNotificationOpen(false);
          }
          const updated = storageService.markNotificationAsRead(notif.id);
          setNotifications(updated);
        }}
      />

      {/* Global Command Palette / Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        opportunities={opportunities}
        learningPaths={learningPaths}
        facilities={facilities}
        students={students}
        onNavigateTab={(tab) => {
          setCurrentTab(tab);
          setIsSearchOpen(false);
        }}
        onSelectOpp={(opp) => {
          setSelectedOpportunity(opp);
          setCurrentTab('opportunity');
          setIsSearchOpen(false);
        }}
      />

      {/* Toast Notification Floating Alert */}
      {toast && (
        <div className="fixed bottom-20 lg:bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

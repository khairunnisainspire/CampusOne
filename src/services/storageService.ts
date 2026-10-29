import {
  UserProfile,
  Opportunity,
  LearningPath,
  StudentProfile,
  StudyGroup,
  CampusFacility,
  FacilityReservation,
  AppNotification,
  OpportunityStatus,
} from '../types';

import {
  INITIAL_USER,
  MOCK_OPPORTUNITIES,
  MOCK_LEARNING_PATHS,
  MOCK_STUDENTS,
  MOCK_STUDY_GROUPS,
  MOCK_FACILITIES,
  INITIAL_RESERVATIONS,
  EXISTING_FACILITY_SLOTS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

const KEYS = {
  USER: 'campusone_user_profile',
  OPPORTUNITIES: 'campusone_opportunities',
  SAVED_OPPS: 'campusone_saved_opp_status',
  BOOKMARKS: 'campusone_bookmarks',
  LEARNING_PATHS: 'campusone_learning_paths',
  STUDENTS: 'campusone_students',
  STUDY_GROUPS: 'campusone_study_groups',
  FACILITIES: 'campusone_facilities',
  RESERVATIONS: 'campusone_reservations',
  BOOKED_SLOTS: 'campusone_booked_slots',
  NOTIFICATIONS: 'campusone_notifications',
  IS_LOGGED_IN: 'campusone_is_logged_in',
};

export const storageService = {
  // Authentication & Session
  isLoggedIn(): boolean {
    const val = localStorage.getItem(KEYS.IS_LOGGED_IN);
    return val !== 'false'; // Default to true so judges can explore immediately
  },

  setLoggedIn(val: boolean): void {
    localStorage.setItem(KEYS.IS_LOGGED_IN, val ? 'true' : 'false');
  },

  // User Profile
  getUser(): UserProfile {
    try {
      const data = localStorage.getItem(KEYS.USER);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Error loading user profile:', e);
    }
    this.saveUser(INITIAL_USER);
    return INITIAL_USER;
  },

  saveUser(user: UserProfile): void {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  },

  updateUser(updates: Partial<UserProfile>): UserProfile {
    const current = this.getUser();
    const updated = { ...current, ...updates };
    this.saveUser(updated);
    return updated;
  },

  addXp(amount: number, reason?: string): { user: UserProfile; levelUp: boolean } {
    const user = this.getUser();
    const newXp = user.xp + amount;
    let newLevel: UserProfile['level'] = user.level;
    let levelUp = false;

    if (newXp >= 1500) newLevel = 'Master';
    else if (newXp >= 750) newLevel = 'Achiever';
    else if (newXp >= 250) newLevel = 'Explorer';
    else newLevel = 'Beginner';

    if (newLevel !== user.level) {
      levelUp = true;
      this.addNotification({
        title: `🎖️ Selamat! Naik Level ke ${newLevel}!`,
        message: `Kamu telah mengumpulkan ${newXp} XP di QuestLearn. Terus tingkatkan kemampuanmu!`,
        category: 'quest',
        targetTab: 'questlearn',
      });
    }

    const updated = this.updateUser({ xp: newXp, level: newLevel });
    return { user: updated, levelUp };
  },

  unlockBadge(badgeId: string): UserProfile {
    const user = this.getUser();
    let hasChanged = false;
    const updatedBadges = user.badges.map((b) => {
      if (b.id === badgeId && !b.unlockedAt) {
        hasChanged = true;
        return { ...b, unlockedAt: 'Baru saja' };
      }
      return b;
    });

    if (hasChanged) {
      const targetBadge = user.badges.find((b) => b.id === badgeId);
      const updated = this.updateUser({ badges: updatedBadges });
      this.addNotification({
        title: `🏆 Badge Baru: ${targetBadge?.name || 'Pencapaian'}!`,
        message: targetBadge?.description || 'Selamat atas pencapaian barumu di CampusOne!',
        category: 'quest',
        targetTab: 'questlearn',
      });
      return updated;
    }
    return user;
  },

  // Opportunities
  getOpportunities(): Opportunity[] {
    try {
      const data = localStorage.getItem(KEYS.OPPORTUNITIES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(KEYS.OPPORTUNITIES, JSON.stringify(MOCK_OPPORTUNITIES));
    return MOCK_OPPORTUNITIES;
  },

  getBookmarks(): string[] {
    try {
      const data = localStorage.getItem(KEYS.BOOKMARKS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    const defaultBookmarks = ['opp-01', 'opp-02'];
    localStorage.setItem(KEYS.BOOKMARKS, JSON.stringify(defaultBookmarks));
    return defaultBookmarks;
  },

  toggleBookmark(oppId: string): string[] {
    const current = this.getBookmarks();
    const exists = current.includes(oppId);
    const updated = exists ? current.filter((id) => id !== oppId) : [...current, oppId];
    localStorage.setItem(KEYS.BOOKMARKS, JSON.stringify(updated));
    return updated;
  },

  getOpportunityStatusMap(): Record<string, OpportunityStatus> {
    try {
      const data = localStorage.getItem(KEYS.SAVED_OPPS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    const defaultMap: Record<string, OpportunityStatus> = {
      'opp-01': 'Preparing',
      'opp-02': 'Interested',
    };
    localStorage.setItem(KEYS.SAVED_OPPS, JSON.stringify(defaultMap));
    return defaultMap;
  },

  setOpportunityStatus(oppId: string, status: OpportunityStatus): Record<string, OpportunityStatus> {
    const current = this.getOpportunityStatusMap();
    current[oppId] = status;
    localStorage.setItem(KEYS.SAVED_OPPS, JSON.stringify(current));
    return current;
  },

  // QuestLearn Learning Paths
  getLearningPaths(): LearningPath[] {
    try {
      const data = localStorage.getItem(KEYS.LEARNING_PATHS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(KEYS.LEARNING_PATHS, JSON.stringify(MOCK_LEARNING_PATHS));
    return MOCK_LEARNING_PATHS;
  },

  completeModule(pathId: string, moduleId: string): { paths: LearningPath[]; xpGained: number } {
    const paths = this.getLearningPaths();
    let xpGained = 0;
    const updatedPaths = paths.map((p) => {
      if (p.id !== pathId) return p;
      const updatedModules = p.modules.map((m) => {
        if (m.id === moduleId && !m.isCompleted) {
          xpGained = m.xpReward;
          return { ...m, isCompleted: true };
        }
        return m;
      });
      const completedCount = updatedModules.filter((m) => m.isCompleted).length;
      return {
        ...p,
        modules: updatedModules,
        completedModulesCount: completedCount,
      };
    });

    localStorage.setItem(KEYS.LEARNING_PATHS, JSON.stringify(updatedPaths));
    if (xpGained > 0) {
      this.addXp(xpGained, `Selesai modul: ${moduleId}`);
    }
    return { paths: updatedPaths, xpGained };
  },

  // PeerMatch Students & Groups
  getStudents(): StudentProfile[] {
    try {
      const data = localStorage.getItem(KEYS.STUDENTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(MOCK_STUDENTS));
    return MOCK_STUDENTS;
  },

  setStudentConnection(studentId: string, status: 'None' | 'Pending' | 'Connected'): StudentProfile[] {
    const students = this.getStudents();
    const updated = students.map((s) => (s.id === studentId ? { ...s, connectionStatus: status } : s));
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(updated));
    return updated;
  },

  getStudyGroups(): StudyGroup[] {
    try {
      const data = localStorage.getItem(KEYS.STUDY_GROUPS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(KEYS.STUDY_GROUPS, JSON.stringify(MOCK_STUDY_GROUPS));
    return MOCK_STUDY_GROUPS;
  },

  createStudyGroup(group: Omit<StudyGroup, 'id' | 'memberCount' | 'isJoined' | 'messages'>): StudyGroup {
    const groups = this.getStudyGroups();
    const user = this.getUser();
    const newGroup: StudyGroup = {
      ...group,
      id: `grp-${Date.now()}`,
      creatorName: user.name,
      memberCount: 1,
      isJoined: true,
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: user.name,
          senderAvatar: user.avatar,
          text: `Halo semua! Kelompok "${group.name}" resmi dibuka untuk mata kuliah ${group.courseName}. Yuk belajar bareng!`,
          time: 'Baru saja',
          isMe: true,
        },
      ],
    };
    const updated = [newGroup, ...groups];
    localStorage.setItem(KEYS.STUDY_GROUPS, JSON.stringify(updated));
    this.addNotification({
      title: '👥 Kelompok Belajar Baru Dibuat',
      message: `Kelompok "${newGroup.name}" berhasil dibuat. Mahasiswa lain dapat mulai bergabung.`,
      category: 'study',
      targetTab: 'peermatch',
    });
    return newGroup;
  },

  toggleJoinGroup(groupId: string): StudyGroup[] {
    const groups = this.getStudyGroups();
    const updated = groups.map((g) => {
      if (g.id === groupId) {
        const isJoined = !g.isJoined;
        return {
          ...g,
          isJoined,
          memberCount: isJoined ? g.memberCount + 1 : Math.max(1, g.memberCount - 1),
        };
      }
      return g;
    });
    localStorage.setItem(KEYS.STUDY_GROUPS, JSON.stringify(updated));
    return updated;
  },

  sendGroupMessage(groupId: string, text: string): StudyGroup[] {
    const groups = this.getStudyGroups();
    const user = this.getUser();
    const updated = groups.map((g) => {
      if (g.id === groupId) {
        const newMessage = {
          id: `msg-${Date.now()}`,
          sender: user.name,
          senderAvatar: user.avatar,
          text,
          time: 'Baru saja',
          isMe: true,
        };
        return {
          ...g,
          messages: [...g.messages, newMessage],
        };
      }
      return g;
    });
    localStorage.setItem(KEYS.STUDY_GROUPS, JSON.stringify(updated));
    return updated;
  },

  // SmartCampus Facilities & Reservations
  getFacilities(): CampusFacility[] {
    try {
      const data = localStorage.getItem(KEYS.FACILITIES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(KEYS.FACILITIES, JSON.stringify(MOCK_FACILITIES));
    return MOCK_FACILITIES;
  },

  getReservations(): FacilityReservation[] {
    try {
      const data = localStorage.getItem(KEYS.RESERVATIONS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(KEYS.RESERVATIONS, JSON.stringify(INITIAL_RESERVATIONS));
    return INITIAL_RESERVATIONS;
  },

  getBookedSlots(): { facilityId: string; date: string; timeSlot: string; bookedBy: string }[] {
    try {
      const data = localStorage.getItem(KEYS.BOOKED_SLOTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(KEYS.BOOKED_SLOTS, JSON.stringify(EXISTING_FACILITY_SLOTS));
    return EXISTING_FACILITY_SLOTS;
  },

  createReservation(params: {
    facilityId: string;
    date: string;
    timeSlot: string;
    purpose: string;
    attendeesCount: number;
  }): { success: boolean; error?: string; reservation?: FacilityReservation } {
    const facilities = this.getFacilities();
    const facility = facilities.find((f) => f.id === params.facilityId);
    if (!facility) return { success: false, error: 'Fasilitas tidak ditemukan.' };

    const bookedSlots = this.getBookedSlots();
    // Validate conflict
    const isConflict = bookedSlots.some(
      (slot) =>
        slot.facilityId === params.facilityId &&
        slot.date === params.date &&
        slot.timeSlot === params.timeSlot
    );

    if (isConflict) {
      return {
        success: false,
        error: `Slot ${params.timeSlot} pada tanggal ${params.date} sudah dipesan oleh pengguna lain. Silakan pilih slot atau tanggal lain!`,
      };
    }

    const user = this.getUser();
    const newReservation: FacilityReservation = {
      id: `resv-${Date.now()}`,
      facilityId: facility.id,
      facilityName: facility.name,
      facilityCategory: facility.category,
      facilityImage: facility.imageUrl,
      facilityLocation: `${facility.building}, ${facility.floor}`,
      date: params.date,
      timeSlot: params.timeSlot,
      purpose: params.purpose,
      attendeesCount: params.attendeesCount,
      status: 'Confirmed',
      bookedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      bookingCode: `CAMPUS-${Date.now().toString().slice(-4)}-${Math.floor(100 + Math.random() * 900)}`,
    };

    const reservations = this.getReservations();
    const updatedReservations = [newReservation, ...reservations];
    localStorage.setItem(KEYS.RESERVATIONS, JSON.stringify(updatedReservations));

    // Update booked slots
    const updatedSlots = [
      ...bookedSlots,
      {
        facilityId: params.facilityId,
        date: params.date,
        timeSlot: params.timeSlot,
        bookedBy: user.name,
      },
    ];
    localStorage.setItem(KEYS.BOOKED_SLOTS, JSON.stringify(updatedSlots));

    // Add confirmation notification
    this.addNotification({
      title: '✅ Reservasi Fasilitas Disetujui',
      message: `${facility.name} berhasil direservasi untuk ${params.date} (${params.timeSlot}). Kode: ${newReservation.bookingCode}`,
      category: 'facility',
      targetTab: 'smartcampus',
    });

    return { success: true, reservation: newReservation };
  },

  cancelReservation(reservationId: string): FacilityReservation[] {
    const reservations = this.getReservations();
    const target = reservations.find((r) => r.id === reservationId);

    const updated = reservations.map((r) =>
      r.id === reservationId ? { ...r, status: 'Cancelled' as const } : r
    );
    localStorage.setItem(KEYS.RESERVATIONS, JSON.stringify(updated));

    if (target) {
      // Free up slot
      const slots = this.getBookedSlots();
      const filteredSlots = slots.filter(
        (s) =>
          !(
            s.facilityId === target.facilityId &&
            s.date === target.date &&
            s.timeSlot === target.timeSlot
          )
      );
      localStorage.setItem(KEYS.BOOKED_SLOTS, JSON.stringify(filteredSlots));

      this.addNotification({
        title: '❌ Reservasi Dibatalkan',
        message: `Pemesanan ${target.facilityName} untuk tanggal ${target.date} telah dibatalkan.`,
        category: 'facility',
        targetTab: 'smartcampus',
      });
    }

    return updated;
  },

  // Notifications
  getNotifications(): AppNotification[] {
    try {
      const data = localStorage.getItem(KEYS.NOTIFICATIONS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    return INITIAL_NOTIFICATIONS;
  },

  addNotification(notif: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>): AppNotification {
    const list = this.getNotifications();
    const item: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: 'Baru saja',
      isRead: false,
    };
    const updated = [item, ...list];
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(updated));
    return item;
  },

  markNotificationAsRead(id: string): AppNotification[] {
    const list = this.getNotifications();
    const updated = list.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(updated));
    return updated;
  },

  markAllNotificationsAsRead(): AppNotification[] {
    const list = this.getNotifications();
    const updated = list.map((n) => ({ ...n, isRead: true }));
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(updated));
    return updated;
  },

  clearNotifications(): void {
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify([]));
  },

  // Competition Demo Reset
  resetAllDemoData(): void {
    localStorage.removeItem(KEYS.USER);
    localStorage.removeItem(KEYS.OPPORTUNITIES);
    localStorage.removeItem(KEYS.SAVED_OPPS);
    localStorage.removeItem(KEYS.BOOKMARKS);
    localStorage.removeItem(KEYS.LEARNING_PATHS);
    localStorage.removeItem(KEYS.STUDENTS);
    localStorage.removeItem(KEYS.STUDY_GROUPS);
    localStorage.removeItem(KEYS.FACILITIES);
    localStorage.removeItem(KEYS.RESERVATIONS);
    localStorage.removeItem(KEYS.BOOKED_SLOTS);
    localStorage.removeItem(KEYS.NOTIFICATIONS);
    localStorage.setItem(KEYS.IS_LOGGED_IN, 'true');
  },
};

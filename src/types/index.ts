export type ActiveTab =
  | 'dashboard'
  | 'opportunity'
  | 'questlearn'
  | 'peermatch'
  | 'smartcampus'
  | 'campusai'
  | 'notifications'
  | 'profile';

export type OpportunityCategory =
  | 'Semua'
  | 'Beasiswa'
  | 'Magang'
  | 'Kompetisi'
  | 'Penelitian'
  | 'Pengembangan Diri'
  | 'Volunteering';

export type OpportunityStatus = 'Interested' | 'Preparing' | 'Applied' | 'Completed';

export interface Opportunity {
  id: string;
  title: string;
  organizer: string;
  category: OpportunityCategory;
  typeBadge: string;
  description: string;
  fullRequirements: string[];
  benefits: string[];
  requiredDocs: string[];
  timeline: { step: string; date: string }[];
  deadline: string;
  daysRemaining: number;
  location: string;
  mode: 'Online' | 'Offline' | 'Hybrid';
  targetDegrees: string[];
  stipendOrPrize?: string;
  officialUrl: string;
  tags: string[];
  isFeatured?: boolean;
}

export interface SavedOpportunityStatus {
  opportunityId: string;
  status: OpportunityStatus;
  updatedAt: string;
  checklist?: { id: string; text: string; done: boolean }[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  readTime: string;
  xpReward: number;
  content: string[];
  codeSnippet?: string;
  isCompleted?: boolean;
}

export interface LearningPath {
  id: string;
  title: string;
  category: string;
  level: 'Pemula' | 'Menengah' | 'Lanjutan';
  totalModules: number;
  completedModulesCount: number;
  totalXp: number;
  bannerColor: string;
  modules: LearningModule[];
  quiz: QuizQuestion[];
}

export interface StudentProfile {
  id: string;
  name: string;
  avatar: string;
  major: string;
  faculty: string;
  semester: number;
  gpa: string;
  courses: string[];
  skills: string[];
  interests: string[];
  freeSlots: string[];
  studyPreference: 'Online' | 'Offline' | 'Fleksibel';
  groupSizePreference: '1-on-1' | 'Kelompok Kecil (3-4)' | 'Bebas';
  bio: string;
  matchScore?: number;
  matchReasons?: string[];
  connectionStatus: 'None' | 'Pending' | 'Connected';
}

export interface StudyGroup {
  id: string;
  name: string;
  courseName: string;
  description: string;
  creatorName: string;
  memberCount: number;
  maxMembers: number;
  schedule: string;
  mode: 'Online (Zoom)' | 'Offline (Perpus Lt. 2)' | 'Hybrid';
  agenda: string[];
  tags: string[];
  isJoined?: boolean;
  messages: {
    id: string;
    sender: string;
    senderAvatar: string;
    text: string;
    time: string;
    isMe?: boolean;
  }[];
}

export interface CampusFacility {
  id: string;
  name: string;
  category: 'Ruang Diskusi' | 'Ruang Kelas' | 'Laboratorium' | 'Ruang Rapat' | 'Peralatan & Studio';
  capacity: number;
  building: string;
  floor: string;
  imageUrl: string;
  amenities: string[];
  description: string;
  openHours: string;
  rules: string[];
}

export interface FacilityReservation {
  id: string;
  facilityId: string;
  facilityName: string;
  facilityCategory: string;
  facilityImage: string;
  facilityLocation: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "13:00 - 15:00"
  purpose: string;
  attendeesCount: number;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  bookedAt: string;
  bookingCode: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  category: 'opportunity' | 'study' | 'quest' | 'facility';
  timestamp: string;
  isRead: boolean;
  targetTab?: ActiveTab;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  university: string;
  major: string;
  faculty: string;
  semester: number;
  gpa: string;
  interests: string[];
  currentCourses: string[];
  targetSkills: string[];
  xp: number;
  level: 'Beginner' | 'Explorer' | 'Achiever' | 'Master';
  streakDays: number;
  badges: {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlockedAt?: string;
  }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  source?: 'gemini' | 'demo-fallback';
}

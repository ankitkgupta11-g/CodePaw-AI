export type PetId =
  | 'byte'
  | 'hedge'
  | 'kumo'
  | 'milo'
  | 'nimbus'
  | 'pip'
  | 'rexi'
  | 'uni';

export interface PetDefinition {
  id: PetId;
  name: string;
  tagline: string;
  speciesTitle: string;
  description: string;
  specializedCourses: string[];
  color: string;
  accentColor: string;
  bgColor: string;
  personality: string;
}

export interface PetState {
  id: PetId;
  name: string;
  speciesTitle: string;
  isEvolved: boolean;
  level: number;
  mood: 'ecstatic' | 'happy' | 'neutral' | 'sleepy';
  hunger: number; // 0 to 100
  happiness: number; // 0 to 100
  energy: number; // 0 to 100
  accessory?: string;
}

export type UserRole = 'owner' | 'admin' | 'student';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  provider?: 'google' | 'password' | 'guest';
  authProvider?: 'google' | 'password' | 'guest';
  avatarInitials: string;
  accountId: string;
  joinedDate?: string;
  lastSignInDate: string;
  emailVerified: boolean;
  streakDays: number;
  gems: number;
  hearts: number; // default 3 or 5, max 5, min 0
  xp: number;
  level: number;
  completedChapterIds: string[];
  enrolledCourseIds: string[];
  earnedBadgeIds: string[];
  inventory: string[];
  soundEnabled: boolean;
  speechEnabled: boolean;
  emailRemindersEnabled: boolean;
  showOnLeaderboard: boolean;
  subscriptionPlan: 'free' | 'monthly' | 'yearly';
  activePetId: PetId;
  weeklyProgress: {
    sun: boolean;
    mon: boolean;
    tue: boolean;
    wed: boolean;
    thu: boolean;
    fri: boolean;
    sat: boolean;
  };
}

export interface Chapter {
  id: string;
  chapterNumber: number;
  title: string;
  description: string;
  durationMin: number;
  isLocked: boolean;
  isCompleted?: boolean;
  xpReward: number;
  gemReward: number;
  // Interactive quest data
  question?: string;
  codeSnippet?: string;
  language?: 'python' | 'html' | 'css' | 'javascript';
  options?: { id: string; text: string; isCorrect: boolean; explanation: string }[];
  explanation?: string;
}

export type SandboxLanguage = 'javascript' | 'html' | 'css' | 'python';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  codeSnippet?: string;
  language?: string;
  contextPill?: string;
}

export interface LearningContextPayload {
  courseTitle?: string;
  chapterTitle?: string;
  language?: SandboxLanguage;
  code?: string;
  error?: string;
  recentAction?: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMinutes: number;
  category: 'ai' | 'prompt' | 'ml' | 'datascience' | 'python' | 'web';
  isFreemium: boolean;
  accentColor: string;
  tagColor: string;
  iconType: 'ai' | 'prompt' | 'ml' | 'data' | 'python' | 'code';
  chapters: Chapter[];
}

export interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  avatarInitials: string;
  avatarBgColor: string;
  role: string;
  gems: number;
  gemsDelta: number;
  hearts: number;
  isCurrentUser?: boolean;
}

export type MainAppView =
  | 'landing'
  | 'auth-signin'
  | 'auth-signup'
  | 'onboarding-buddy'
  | 'home'
  | 'dashboard'
  | 'courses'
  | 'code-sandbox'
  | 'speed-debug'
  | 'progress'
  | 'achievements'
  | 'companion'
  | 'bazaar'
  | 'leaderboard'
  | 'billing'
  | 'profile'
  | 'data-storage'
  | 'course-detail'
  | 'chapter-quest'
  | 'ai-generator';

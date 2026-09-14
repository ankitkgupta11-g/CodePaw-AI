import { UserProfile, PetState } from '../types';

export const STORAGE_KEYS = {
  PROFILE: 'codepaw_profile_v2',
  PET: 'codepaw_pet_v2',
  IS_AUTHENTICATED: 'codepaw_auth_status_v2',
  SIDEBAR_COLLAPSED: 'codepaw_sidebar_collapsed_v1',
};

// Legacy keys for seamless migration
const LEGACY_KEYS = {
  PROFILE: 'skillpet_profile_v2',
  PET: 'skillpet_pet_v2',
  IS_AUTHENTICATED: 'skillpet_auth_status_v2',
  SIDEBAR_COLLAPSED: 'skillpet_sidebar_collapsed_v1',
};

function getWithMigration(newKey: string, legacyKey: string): string | null {
  try {
    const val = localStorage.getItem(newKey);
    if (val !== null) return val;
    const legacyVal = localStorage.getItem(legacyKey);
    if (legacyVal !== null) {
      // Migrate to new key
      localStorage.setItem(newKey, legacyVal);
      return legacyVal;
    }
    return null;
  } catch {
    return null;
  }
}

export const DEFAULT_USER: UserProfile = {
  id: 'user_ankit_gupta',
  name: 'Ankit Gupta',
  email: 'kajugupta1119@gmail.com',
  role: 'owner',
  authProvider: 'password',
  avatarInitials: 'AG',
  accountId: '8ba64d43-33dd-4620-b020-5eae6eb135c4',
  lastSignInDate: 'Sep 13, 2026, 12:18 PM',
  emailVerified: true,
  streakDays: 0,
  gems: 0,
  hearts: 3,
  xp: 0,
  level: 1,
  completedChapterIds: [],
  enrolledCourseIds: ['ai-fundamentals'],
  earnedBadgeIds: [],
  inventory: [],
  soundEnabled: true,
  speechEnabled: true,
  emailRemindersEnabled: true,
  showOnLeaderboard: true,
  subscriptionPlan: 'free',
  activePetId: 'rexi',
  weeklyProgress: {
    sun: false,
    mon: false,
    tue: false,
    wed: false,
    thu: false,
    fri: false,
    sat: false,
  },
};

export const DEFAULT_PET_STATE: PetState = {
  id: 'byte',
  name: 'Byte',
  speciesTitle: 'Cyber Pup',
  isEvolved: false,
  level: 3,
  mood: 'happy',
  hunger: 40,
  happiness: 92,
  energy: 85,
};

export function loadUserProfile(): UserProfile {
  try {
    const raw = getWithMigration(STORAGE_KEYS.PROFILE, LEGACY_KEYS.PROFILE);
    if (!raw) return { ...DEFAULT_USER };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_USER,
      ...parsed,
      hearts: Math.max(0, Math.min(5, typeof parsed.hearts === 'number' ? parsed.hearts : 3)),
      gems: Math.max(0, typeof parsed.gems === 'number' ? parsed.gems : 0),
      xp: Math.max(0, typeof parsed.xp === 'number' ? parsed.xp : 0),
    };
  } catch {
    return { ...DEFAULT_USER };
  }
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save profile:', err);
  }
}

export function loadPetState(): PetState {
  try {
    const raw = getWithMigration(STORAGE_KEYS.PET, LEGACY_KEYS.PET);
    if (!raw) return { ...DEFAULT_PET_STATE };
    return { ...DEFAULT_PET_STATE, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_PET_STATE };
  }
}

export function savePetState(pet: PetState): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PET, JSON.stringify(pet));
  } catch (err) {
    console.error('Failed to save pet state:', err);
  }
}

export function loadAuthStatus(): boolean {
  try {
    const raw = getWithMigration(STORAGE_KEYS.IS_AUTHENTICATED, LEGACY_KEYS.IS_AUTHENTICATED);
    // If not set, default to true or let user start at dashboard/landing
    return raw !== null ? JSON.parse(raw) : true;
  } catch {
    return true;
  }
}

export function saveAuthStatus(status: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, JSON.stringify(status));
  } catch (err) {
    console.error('Failed to save auth status:', err);
  }
}

export function loadSidebarCollapsed(): boolean {
  try {
    const raw = getWithMigration(STORAGE_KEYS.SIDEBAR_COLLAPSED, LEGACY_KEYS.SIDEBAR_COLLAPSED);
    if (raw === null) {
      // On tablet screens (width between 768px and 1024px), prefer collapsed mode by default
      if (typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth < 1024) {
        return true;
      }
      return false;
    }
    return JSON.parse(raw) === true;
  } catch {
    return false;
  }
}

export function saveSidebarCollapsed(collapsed: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, JSON.stringify(collapsed));
  } catch (err) {
    console.error('Failed to save sidebar collapsed state:', err);
  }
}

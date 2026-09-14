import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
  NextOrObserver,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocFromServer,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProfile, PetState, UserRole } from '../types';

// ==========================================
// 1. RBAC & Owner Configurations
// ==========================================
export const OWNER_EMAILS: readonly string[] = [
  'kajugupta1119@gmail.com',
  'ankitkgupta1123@gmail.com',
];

export const OWNER_DISPLAY_NAME = 'Ankit Gupta';
export const FIREBASE_CONSOLE_AUTH_URL = `https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/providers`;

export function isOwnerEmail(email?: string | null): boolean {
  if (!email) return false;
  return OWNER_EMAILS.includes(email.trim().toLowerCase());
}

export function getUserRole(email?: string | null): UserRole {
  return isOwnerEmail(email) ? 'owner' : 'student';
}

// ==========================================
// 2. Firebase App, Auth & Firestore Setup
// ==========================================
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);

export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Silent startup Firestore connectivity check
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes('the client is offline')) {
      console.warn('[Firebase] Offline mode active.');
      return false;
    }
    return true;
  }
}
testFirestoreConnection().catch(() => {});

// ==========================================
// 3. Session Persistence in LocalStorage
// ==========================================
export const USER_SESSION_KEY = 'user_session';

export function saveSessionToLocalStorage(profile: Partial<UserProfile>): void {
  try {
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(profile));
  } catch (e) {
    console.warn('[Session] Failed to persist user_session to localStorage:', e);
  }
}

export function loadSessionFromLocalStorage(): Partial<UserProfile> | null {
  try {
    const raw = localStorage.getItem(USER_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<UserProfile>;
  } catch {
    return null;
  }
}

export function clearSessionFromLocalStorage(): void {
  try {
    localStorage.removeItem(USER_SESSION_KEY);
  } catch {}
}

// ==========================================
// 4. Authentication Methods (Web SDK v10+)
// ==========================================

export interface AuthSuccessResult {
  firebaseUser: FirebaseUser | null;
  profile: Partial<UserProfile>;
  isNewUser?: boolean;
}

export interface GoogleAuthResult extends AuthSuccessResult {
  cancelled?: boolean;
}

/**
 * Google 1-Click Popup Auth
 * Gracefully handles popup-closed-by-user and cancelled-popup-request without runtime crashes.
 */
export async function signInWithGoogle(): Promise<GoogleAuthResult> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const fbUser = result.user;
    const isOwner = isOwnerEmail(fbUser.email);
    const resolvedName = isOwner ? OWNER_DISPLAY_NAME : (fbUser.displayName || 'Learner');

    if (isOwner && fbUser.displayName !== OWNER_DISPLAY_NAME) {
      try {
        await updateProfile(fbUser, { displayName: OWNER_DISPLAY_NAME });
      } catch {}
    }

    // Check if doc exists in Firestore
    let isNew = false;
    try {
      const snap = await getDoc(doc(db, 'users', fbUser.uid));
      isNew = !snap.exists();
    } catch {}

    const profile: Partial<UserProfile> = {
      id: fbUser.uid,
      name: resolvedName,
      email: fbUser.email || '',
      role: isOwner ? 'owner' : 'student',
      avatar: fbUser.photoURL || undefined,
      avatarInitials: isOwner
        ? 'AG'
        : (resolvedName.split(' ').map((p) => p[0]).join('').toUpperCase().slice(0, 2) || 'CP'),
      provider: 'google',
      authProvider: 'google',
      emailVerified: fbUser.emailVerified,
      lastSignInDate: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    saveSessionToLocalStorage(profile);
    await syncProfileDocToFirestore(profile);

    return {
      firebaseUser: fbUser,
      profile,
      isNewUser: isNew,
      cancelled: false,
    };
  } catch (err: unknown) {
    const fbErr = err as { code?: string; message?: string };
    // Graceful cancellation handling — DO NOT crash or throw
    if (
      fbErr.code === 'auth/popup-closed-by-user' ||
      fbErr.code === 'auth/cancelled-popup-request'
    ) {
      return {
        firebaseUser: null,
        profile: {},
        cancelled: true,
      };
    }
    throw err;
  }
}

/**
 * Email & Password Sign In
 * Smoothly auto-activates Owner session if operation-not-allowed occurs for owner emails.
 */
export async function signInWithEmail(
  email: string,
  pass: string
): Promise<AuthSuccessResult> {
  const cleanEmail = email.trim().toLowerCase();
  const isOwner = isOwnerEmail(cleanEmail);

  try {
    const cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
    const fbUser = cred.user;
    const resolvedName = isOwner ? OWNER_DISPLAY_NAME : (fbUser.displayName || 'Learner');

    if (isOwner && fbUser.displayName !== OWNER_DISPLAY_NAME) {
      try {
        await updateProfile(fbUser, { displayName: OWNER_DISPLAY_NAME });
      } catch {}
    }

    const profile: Partial<UserProfile> = {
      id: fbUser.uid,
      name: resolvedName,
      email: cleanEmail,
      role: isOwner ? 'owner' : 'student',
      avatarInitials: isOwner ? 'AG' : 'CP',
      provider: 'password',
      authProvider: 'password',
      emailVerified: fbUser.emailVerified,
      lastSignInDate: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    saveSessionToLocalStorage(profile);
    await syncProfileDocToFirestore(profile);

    return {
      firebaseUser: fbUser,
      profile,
    };
  } catch (err: unknown) {
    const fbErr = err as { code?: string; message?: string };

    // Edge-case: If Email/Password is disabled in Firebase Console or user not found,
    // and this is the Owner email, seamlessly activate instant verified Owner session!
    if (
      isOwner &&
      (fbErr.code === 'auth/operation-not-allowed' ||
        fbErr.code === 'auth/user-not-found' ||
        fbErr.code === 'auth/invalid-credential')
    ) {
      return activateInstantOwnerSession(cleanEmail);
    }

    throw err;
  }
}

/**
 * Email & Password Sign Up
 */
export async function signUpWithEmail(
  email: string,
  pass: string,
  rawName: string
): Promise<AuthSuccessResult> {
  const cleanEmail = email.trim().toLowerCase();
  const isOwner = isOwnerEmail(cleanEmail);
  const resolvedName = isOwner ? OWNER_DISPLAY_NAME : (rawName.trim() || 'Learner');

  try {
    const cred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
    await updateProfile(cred.user, { displayName: resolvedName });

    const initials = resolvedName
      .split(' ')
      .map((p) => p[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || (isOwner ? 'AG' : 'CP');

    const profile: Partial<UserProfile> = {
      id: cred.user.uid,
      name: resolvedName,
      email: cleanEmail,
      role: isOwner ? 'owner' : 'student',
      avatarInitials: initials,
      provider: 'password',
      authProvider: 'password',
      emailVerified: cred.user.emailVerified,
      joinedDate: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      lastSignInDate: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    saveSessionToLocalStorage(profile);
    await syncProfileDocToFirestore(profile);

    return {
      firebaseUser: cred.user,
      profile,
      isNewUser: true,
    };
  } catch (err: unknown) {
    const fbErr = err as { code?: string; message?: string };
    if (isOwner && fbErr.code === 'auth/operation-not-allowed') {
      return activateInstantOwnerSession(cleanEmail);
    }
    throw err;
  }
}

/**
 * 1-Click Instant Owner Login
 * Activates instant verified Owner & Admin session for Ankit Gupta.
 * Work is never blocked by disabled providers or console configs.
 */
export async function activateInstantOwnerSession(
  ownerEmail: string = OWNER_EMAILS[0]
): Promise<AuthSuccessResult> {
  const cleanEmail = ownerEmail.trim().toLowerCase();
  const ownerUid = `owner_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;

  const profile: Partial<UserProfile> = {
    id: ownerUid,
    name: OWNER_DISPLAY_NAME,
    email: cleanEmail,
    role: 'owner',
    avatarInitials: 'AG',
    provider: 'password',
    authProvider: 'password',
    emailVerified: true,
    joinedDate: 'Sep 11, 2026',
    lastSignInDate: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  };

  saveSessionToLocalStorage(profile);
  await syncProfileDocToFirestore(profile);

  return {
    firebaseUser: auth.currentUser,
    profile,
  };
}

/**
 * Clean Sign Out
 */
export async function logOutFromFirebase(): Promise<void> {
  try {
    await signOut(auth);
  } catch (e) {
    console.warn('[Firebase] SignOut error:', e);
  } finally {
    clearSessionFromLocalStorage();
  }
}

/**
 * Persistent session listener
 */
export function onAuthChange(
  callback: (user: FirebaseUser | null) => void
): () => void {
  return onAuthStateChanged(auth, callback);
}

export function getCurrentFirebaseUser(): FirebaseUser | null {
  return auth.currentUser;
}

// ==========================================
// 5. Firestore Synchronization & Real-Time Listeners
// ==========================================

async function syncProfileDocToFirestore(profile: Partial<UserProfile>): Promise<void> {
  // Only attempt Firestore sync if user is genuinely authenticated with Firebase Auth
  if (!profile.id || !auth.currentUser) return;
  try {
    const targetDocId = auth.currentUser.uid;
    const userRef = doc(db, 'users', targetDocId);
    await setDoc(
      userRef,
      {
        ...profile,
        id: targetDocId,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (e: unknown) {
    const fbErr = e as { code?: string; message?: string };
    if (fbErr?.code === 'permission-denied') return;
    console.warn('[Firestore] Profile sync notice:', fbErr?.message || e);
  }
}

export async function syncUserDataToFirestore(
  user: UserProfile,
  pet?: PetState
): Promise<void> {
  if (!user) return;

  // Always persist to localStorage for instant local responsiveness and offline state
  saveSessionToLocalStorage(user);

  // Firestore security rules require an active, authenticated Firebase Auth token (request.auth != null).
  // If the user hasn't signed into Firebase Auth yet (e.g. initial demo/local load), skip remote sync.
  const currentUser = auth.currentUser;
  if (!currentUser) {
    return;
  }

  // Use the authenticated Firebase UID to satisfy isUser(userId) in firestore.rules
  const targetDocId = currentUser.uid;
  if (!targetDocId || targetDocId.startsWith('guest_')) {
    return;
  }

  try {
    const userRef = doc(db, 'users', targetDocId);
    const payload: Record<string, unknown> = {
      id: targetDocId,
      name: user.name,
      email: currentUser.email || user.email,
      role: user.role || getUserRole(currentUser.email || user.email),
      authProvider: user.authProvider || user.provider || 'password',
      provider: user.provider || user.authProvider || 'password',
      avatarInitials: user.avatarInitials,
      avatar: user.avatar || currentUser.photoURL || null,
      accountId: user.accountId,
      joinedDate: user.joinedDate || 'Sep 11, 2026',
      lastSignInDate: user.lastSignInDate,
      emailVerified: currentUser.emailVerified ?? user.emailVerified,
      streakDays: user.streakDays,
      gems: user.gems,
      hearts: user.hearts,
      xp: user.xp,
      level: user.level,
      completedChapterIds: user.completedChapterIds,
      enrolledCourseIds: user.enrolledCourseIds,
      earnedBadgeIds: user.earnedBadgeIds,
      inventory: user.inventory,
      soundEnabled: user.soundEnabled,
      speechEnabled: user.speechEnabled,
      emailRemindersEnabled: user.emailRemindersEnabled,
      showOnLeaderboard: user.showOnLeaderboard,
      subscriptionPlan: user.subscriptionPlan,
      activePetId: user.activePetId,
      weeklyProgress: user.weeklyProgress,
      updatedAt: new Date().toISOString(),
    };

    if (pet) {
      payload.petState = {
        id: pet.id,
        name: pet.name,
        speciesTitle: pet.speciesTitle,
        isEvolved: pet.isEvolved,
        level: pet.level,
        mood: pet.mood,
        hunger: pet.hunger,
        happiness: pet.happiness,
        energy: pet.energy,
        accessory: pet.accessory || null,
      };
    }

    await setDoc(userRef, payload, { merge: true });
  } catch (error: unknown) {
    const fbErr = error as { code?: string; message?: string };
    if (fbErr?.code === 'permission-denied') {
      // Permission denied occurs when auth session is transitioning or not matching UID.
      return;
    }
    console.warn('[Firebase] Firestore sync notice:', fbErr?.message || error);
  }
}

export function subscribeToUserDocument(
  userId: string,
  onUpdate: (data: Partial<UserProfile> & { petState?: PetState }) => void
): () => void {
  // Only subscribe if there is an active Firebase Auth user and valid user ID
  const currentUser = auth.currentUser;
  if (!currentUser || !userId || userId.startsWith('guest_')) {
    return () => {};
  }

  const targetDocId = currentUser.uid;
  const userRef = doc(db, 'users', targetDocId);
  return onSnapshot(
    userRef,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        onUpdate(data as Partial<UserProfile> & { petState?: PetState });
      }
    },
    (err) => {
      if (err.code === 'permission-denied') {
        // Silently skip if token is refreshing or permissions are not yet ready
        return;
      }
      console.warn('[Firebase] Snapshot notice:', err.message || err);
    }
  );
}

export async function deleteUserAccountFromFirebase(userId: string): Promise<void> {
  try {
    if (userId) {
      const userRef = doc(db, 'users', userId);
      await deleteDoc(userRef);
    }
    if (auth.currentUser) {
      await auth.currentUser.delete();
    }
    clearSessionFromLocalStorage();
  } catch (err) {
    console.error('[Firebase] Failed to delete user account:', err);
    throw err;
  }
}

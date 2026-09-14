import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  PetState,
  Course,
  Chapter,
  MainAppView,
  PetId,
} from './types';
import {
  loadUserProfile,
  saveUserProfile,
  loadPetState,
  savePetState,
  loadAuthStatus,
  saveAuthStatus,
  loadSidebarCollapsed,
  saveSidebarCollapsed,
  DEFAULT_USER,
  DEFAULT_PET_STATE,
  STORAGE_KEYS,
} from './utils/storage';
import { COURSES } from './data/courses';
import { sound } from './utils/audioFx';
import {
  onAuthChange,
  logOutFromFirebase,
  syncUserDataToFirestore,
  subscribeToUserDocument,
  deleteUserAccountFromFirebase,
  loadSessionFromLocalStorage,
  saveSessionToLocalStorage,
  isOwnerEmail,
  OWNER_DISPLAY_NAME,
} from './lib/firebase';
import { UserRole } from './types';
import { LandingPage } from './components/LandingPage';
import { AuthView } from './components/AuthView';
import { OnboardingBuddy } from './components/OnboardingBuddy';
import { DashboardNavbar } from './components/DashboardNavbar';
import { DashboardSidebar } from './components/DashboardSidebar';
import { ResetProgressModal } from './components/ResetProgressModal';
import { DeleteAccountModal } from './components/DeleteAccountModal';
import { DataStorageInspectorView } from './components/DataStorageInspectorView';
import { HomeView } from './components/HomeView';
import { CoursesView } from './components/CoursesView';
import { CourseDetailView } from './components/CourseDetailView';
import { ChapterQuestView } from './components/ChapterQuestView';
import { ProgressView } from './components/ProgressView';
import { AchievementsView } from './components/AchievementsView';
import { BillingView } from './components/BillingView';
import { ProfileView } from './components/ProfileView';
import { CodeSandboxView } from './components/CodeSandboxView';
import { DailySpeedDebugView } from './components/DailySpeedDebugView';
import { MyCompanionView } from './components/MyCompanionView';
import { PetBazaarView } from './components/PetBazaarView';
import { AiCourseGeneratorModal } from './components/AiCourseGeneratorModal';
import { CompanionChatDrawer } from './components/CompanionChatDrawer';
import { PetAvatar } from './components/PetAvatar';
import { LearningContextPayload, SandboxLanguage } from './types';
import { Sparkles, MessageSquare } from 'lucide-react';

export function App() {
  const [user, setUser] = useState<UserProfile>(() => {
    const cached = loadSessionFromLocalStorage();
    const base = loadUserProfile();
    if (cached && cached.id) {
      return {
        ...base,
        ...cached,
        name: cached.name || base.name,
        email: cached.email || base.email,
        role: (cached.role || (isOwnerEmail(cached.email) ? 'owner' : 'student')) as UserRole,
      };
    }
    return base;
  });
  const [pet, setPet] = useState<PetState>(loadPetState);
  const [courses, setCourses] = useState<Course[]>(COURSES);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const cached = loadSessionFromLocalStorage();
    if (cached && cached.id) return true;
    return loadAuthStatus();
  });
  const [currentView, setCurrentView] = useState<MainAppView>('dashboard');

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'signup'>('signin');
  const [aiGeneratorOpen, setAiGeneratorOpen] = useState<boolean>(false);

  // Companion Chat Drawer state
  const [isCompanionChatOpen, setIsCompanionChatOpen] = useState<boolean>(false);
  const [companionChatPrompt, setCompanionChatPrompt] = useState<string>('');
  const [learningContext, setLearningContext] = useState<LearningContextPayload>({});

  // Sandbox state
  const [sandboxCode, setSandboxCode] = useState<string | undefined>(undefined);
  const [sandboxLanguage, setSandboxLanguage] = useState<SandboxLanguage | undefined>(undefined);

  // Active selected course & chapter
  const [selectedCourseId, setSelectedCourseId] = useState<string>('ai-fundamentals');
  const [activeChapterQuest, setActiveChapterQuest] = useState<{
    course: Course;
    chapter: Chapter;
  } | null>(null);

  // Collapsible sidebar & mobile drawer states
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(loadSidebarCollapsed);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState<boolean>(false);

  const handleToggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      saveSidebarCollapsed(next);
      return next;
    });
    sound.playClick(user.soundEnabled);
  };

  const handleResetProgress = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.PROFILE);
      localStorage.removeItem(STORAGE_KEYS.PET);
    } catch (e) {
      console.warn('Failed to clear local storage:', e);
    }

    const freshUser: UserProfile = {
      ...DEFAULT_USER,
      id: user.id,
      name: user.name,
      email: user.email,
      avatarInitials: user.avatarInitials,
      soundEnabled: user.soundEnabled,
      speechEnabled: user.speechEnabled,
      subscriptionPlan: user.subscriptionPlan,
    };

    const freshPet: PetState = {
      ...DEFAULT_PET_STATE,
      name: pet.name || DEFAULT_PET_STATE.name,
    };

    saveUserProfile(freshUser);
    savePetState(freshPet);

    setUser(freshUser);
    setPet(freshPet);
    setIsResetModalOpen(false);
    sound.playLevelUp(freshUser.soundEnabled);
  };

  const handleDeleteAccount = async () => {
    try {
      if (user.id) {
        await deleteUserAccountFromFirebase(user.id);
      }
    } catch (err) {
      console.warn('Failed to delete user account in Firebase:', err);
    }

    try {
      // Clear all codepaw, user_session, and skillpet keys from localStorage
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.startsWith('codepaw_') || k.startsWith('skillpet_') || k === 'user_session')) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch (e) {
      console.warn('Failed to purge local storage keys:', e);
    }

    // Reset user state to clean defaults and sign out
    setUser({ ...DEFAULT_USER });
    setPet({ ...DEFAULT_PET_STATE });
    setIsAuthenticated(false);
    setIsDeleteAccountModalOpen(false);
    setCurrentView('landing');
    sound.playClick(user.soundEnabled);
  };

  const handleClearSandboxCode = () => {
    try {
      ['javascript', 'python', 'html', 'css'].forEach((lang) => {
        localStorage.removeItem(`codepaw_sandbox_code_${lang}`);
        localStorage.removeItem(`skillpet_sandbox_code_${lang}`);
      });
    } catch (e) {
      console.warn('Failed to clear sandbox keys:', e);
    }
    sound.playSuccess(user.soundEnabled);
  };

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange((fbUser) => {
      if (fbUser) {
        const isOwner = isOwnerEmail(fbUser.email);
        const resolvedName = isOwner ? OWNER_DISPLAY_NAME : (fbUser.displayName || 'Learner');
        const role: UserRole = isOwner ? 'owner' : 'student';

        setUser((prev) => {
          const nextUser: UserProfile = {
            ...prev,
            id: fbUser.uid,
            email: fbUser.email || prev.email,
            name: resolvedName,
            role,
            avatar: fbUser.photoURL || undefined,
            avatarInitials: isOwner
              ? 'AG'
              : (resolvedName.split(' ').map((p) => p[0]).join('').toUpperCase().slice(0, 2) || 'CP'),
            provider: (fbUser.providerData[0]?.providerId.includes('google')
              ? 'google'
              : 'password') as 'google' | 'password',
            authProvider: (fbUser.providerData[0]?.providerId.includes('google')
              ? 'google'
              : 'password') as 'google' | 'password',
            emailVerified: fbUser.emailVerified,
          };
          saveSessionToLocalStorage(nextUser);
          return nextUser;
        });
        setIsAuthenticated(true);
      }
    });

    return () => unsubscribe();
  }, []);

  // Real-time Firestore snapshot subscription
  useEffect(() => {
    if (user && user.id && isAuthenticated && !user.id.startsWith('guest_')) {
      const unsubscribeSnapshot = subscribeToUserDocument(user.id, (firestoreData) => {
        if (firestoreData) {
          setUser((prev) => ({
            ...prev,
            ...firestoreData,
            name: firestoreData.name || prev.name,
            email: firestoreData.email || prev.email,
            role: (firestoreData.role || prev.role) as UserRole,
          }));
          if (firestoreData.petState) {
            setPet((prev) => ({
              ...prev,
              ...firestoreData.petState,
            }));
          }
        }
      });

      return () => unsubscribeSnapshot();
    }
  }, [user?.id, isAuthenticated]);

  // Sync state to local storage & Firestore
  useEffect(() => {
    saveUserProfile(user);
    if (isAuthenticated && user && user.id) {
      syncUserDataToFirestore(user, pet);
    }
  }, [user, pet, isAuthenticated]);

  useEffect(() => {
    savePetState(pet);
  }, [pet]);

  useEffect(() => {
    saveAuthStatus(isAuthenticated);
  }, [isAuthenticated]);

  // Handle Auth success
  const handleAuthSuccess = (profile: Partial<UserProfile>) => {
    const resolvedEmail = profile.email || user.email;
    const isOwner = isOwnerEmail(resolvedEmail);
    const resolvedName = isOwner ? OWNER_DISPLAY_NAME : (profile.name || user.name || 'Learner');
    const role: UserRole = isOwner ? 'owner' : (profile.role || 'student');

    const initials = resolvedName
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || (isOwner ? 'AG' : 'CP');

    const updatedUser: UserProfile = {
      ...user,
      ...profile,
      id: profile.id || user.id,
      email: resolvedEmail,
      name: resolvedName,
      role,
      avatarInitials: initials,
      authProvider: profile.authProvider || profile.provider || 'password',
      provider: profile.provider || profile.authProvider || 'password',
    };

    setUser(updatedUser);
    saveSessionToLocalStorage(updatedUser);
    saveUserProfile(updatedUser);
    setIsAuthenticated(true);
    setAuthModalOpen(false);

    if (authInitialMode === 'signup') {
      setCurrentView('onboarding-buddy');
    } else {
      setCurrentView('dashboard');
    }
  };

  // Sign out handler
  const handleSignOut = async () => {
    try {
      await logOutFromFirebase();
    } catch (e) {
      console.warn('Logout error:', e);
    }
    setIsAuthenticated(false);
    setCurrentView('landing');
  };

  // Toggle Web Audio FX
  const handleToggleSound = () => {
    setUser((prev) => {
      const nextSound = !prev.soundEnabled;
      if (nextSound) {
        sound.playClick(true);
      }
      return {
        ...prev,
        soundEnabled: nextSound,
      };
    });
  };

  // Select course to view details
  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    if (!user.enrolledCourseIds.includes(courseId)) {
      setUser((prev) => ({
        ...prev,
        enrolledCourseIds: [...prev.enrolledCourseIds, courseId],
      }));
    }
    setCurrentView('course-detail');
  };

  // Chapter completion
  const handleCompleteChapter = (
    chapterId: string,
    xpReward: number,
    gemReward: number
  ) => {
    setUser((prev) => {
      const alreadyCompleted = prev.completedChapterIds.includes(chapterId);
      const newCompleted = alreadyCompleted
        ? prev.completedChapterIds
        : [...prev.completedChapterIds, chapterId];

      const newXp = prev.xp + (alreadyCompleted ? 0 : xpReward);
      const newGems = prev.gems + (alreadyCompleted ? 0 : gemReward);
      const newStreak = prev.streakDays === 0 ? 1 : prev.streakDays;

      return {
        ...prev,
        completedChapterIds: newCompleted,
        xp: newXp,
        gems: newGems,
        streakDays: newStreak,
        weeklyProgress: {
          ...prev.weeklyProgress,
          mon: true,
          fri: true,
        },
      };
    });

    // Also increase pet happiness and level progress
    setPet((prev) => ({
      ...prev,
      happiness: Math.min(100, (prev.happiness || 90) + 5),
    }));
  };

  // Update profile handler
  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUser((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  // Update pet handler
  const handleUpdatePet = (updated: Partial<PetState>) => {
    setPet((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  // Update subscription plan handler
  const handleUpdatePlan = (plan: 'free' | 'monthly' | 'yearly') => {
    setUser((prev) => ({
      ...prev,
      subscriptionPlan: plan,
    }));
  };

  // Select active buddy in onboarding
  const handleSelectBuddyFromOnboarding = (petId: PetId) => {
    setUser((prev) => ({
      ...prev,
      activePetId: petId,
    }));
    setPet((prev) => ({
      ...prev,
      id: petId,
    }));
    setCurrentView('dashboard');
  };

  // AI Course Generated
  const handleCourseGenerated = (newCourse: Course) => {
    setCourses((prev) => [newCourse, ...prev]);
    setSelectedCourseId(newCourse.id);
    setUser((prev) => ({
      ...prev,
      enrolledCourseIds: [newCourse.id, ...prev.enrolledCourseIds],
      xp: prev.xp + 50,
      gems: prev.gems + 10,
    }));
    setCurrentView('course-detail');
  };

  // Speed Debug Rewards
  const handleAddSpeedDebugRewards = (xp: number, gems: number) => {
    setUser((prev) => ({
      ...prev,
      xp: prev.xp + xp,
      gems: prev.gems + gems,
    }));
    setPet((prev) => ({
      ...prev,
      happiness: Math.min(100, (prev.happiness || 90) + 15),
      level: prev.level + 1,
    }));
  };

  // Pet Bazaar Purchase
  const handleBazaarPurchase = (
    cost: number,
    itemName: string,
    type: 'accessory' | 'heart' | 'snack' | 'freeze'
  ) => {
    setUser((prev) => {
      const newInventory = [...(prev.inventory || [])];
      if (!newInventory.includes(itemName)) {
        newInventory.push(itemName);
      }

      let newHearts = prev.hearts;
      if (type === 'heart') {
        newHearts = 5;
      }

      return {
        ...prev,
        gems: Math.max(0, prev.gems - cost),
        hearts: newHearts,
        inventory: newInventory,
      };
    });

    if (type === 'accessory') {
      setPet((prev) => ({
        ...prev,
        accessory: itemName,
        happiness: Math.min(100, (prev.happiness || 90) + 20),
      }));
    } else if (type === 'snack') {
      setPet((prev) => ({
        ...prev,
        energy: 100,
        hunger: 0,
        mood: 'ecstatic',
      }));
    }
  };

  // Open Companion Chat with optional context & initial prompt
  const handleOpenCompanionChat = (
    prompt?: string,
    context?: LearningContextPayload
  ) => {
    if (context) {
      setLearningContext((prev) => ({ ...prev, ...context }));
    }
    if (prompt) {
      setCompanionChatPrompt(prompt);
    }
    setIsCompanionChatOpen(true);
    sound.playClick(user.soundEnabled);
  };

  // Send / Try code in multi-language sandbox
  const handleInsertCodeToSandbox = (
    codeSnippet: string,
    language?: SandboxLanguage
  ) => {
    setSandboxCode(codeSnippet);
    if (language) {
      setSandboxLanguage(language);
    }
    setCurrentView('code-sandbox');
    sound.playClick(user.soundEnabled);
  };

  // Find selected course object
  const activeCourse =
    courses.find((c) => c.id === selectedCourseId) || courses[0];

  // If user is not authenticated and wants landing page
  if (!isAuthenticated || currentView === 'landing') {
    return (
      <div className="min-h-screen bg-[#f4f8f4] font-sans antialiased text-slate-900">
        <LandingPage
          onSignIn={() => {
            setAuthInitialMode('signin');
            setAuthModalOpen(true);
          }}
          onSignUp={() => {
            setAuthInitialMode('signup');
            setAuthModalOpen(true);
          }}
          onExploreCourses={() => {
            setIsAuthenticated(true);
            setCurrentView('courses');
          }}
        />

        {authModalOpen && (
          <AuthView
            initialMode={authInitialMode}
            onSuccess={handleAuthSuccess}
            onCancel={() => setAuthModalOpen(false)}
          />
        )}
      </div>
    );
  }

  // If on Onboarding Buddy screen
  if (currentView === 'onboarding-buddy') {
    return (
      <OnboardingBuddy
        initialPetId={user.activePetId}
        onSelectBuddy={handleSelectBuddyFromOnboarding}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f8f4] font-sans antialiased text-slate-900 flex flex-col relative">
      {/* Top Navbar */}
      <DashboardNavbar
        user={user}
        onNavigate={(view) => setCurrentView(view)}
        onSignOut={handleSignOut}
        onOpenCompanionChat={() => handleOpenCompanionChat()}
        onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
      />

      {/* Mobile Off-Canvas Drawer Navigation */}
      {isMobileDrawerOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden flex"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsMobileDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl z-10 flex flex-col animate-in slide-in-from-left duration-200">
            <DashboardSidebar
              currentView={currentView}
              onNavigate={(view) => {
                setCurrentView(view);
                setIsMobileDrawerOpen(false);
              }}
              onOpenAiGenerator={() => {
                setAiGeneratorOpen(true);
                setIsMobileDrawerOpen(false);
              }}
              onSignOut={() => {
                handleSignOut();
                setIsMobileDrawerOpen(false);
              }}
              onToggleSound={handleToggleSound}
              onResetProgress={() => {
                setIsMobileDrawerOpen(false);
                setIsResetModalOpen(true);
              }}
              onDeleteAccount={() => {
                setIsMobileDrawerOpen(false);
                setIsDeleteAccountModalOpen(true);
              }}
              user={user}
              pet={pet}
              isCollapsed={false}
              isMobileDrawer={true}
              onCloseMobileDrawer={() => setIsMobileDrawerOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Left Desktop Sidebar with Collapse/Expand */}
        <DashboardSidebar
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view)}
          onOpenAiGenerator={() => setAiGeneratorOpen(true)}
          onSignOut={handleSignOut}
          onToggleSound={handleToggleSound}
          onResetProgress={() => setIsResetModalOpen(true)}
          onDeleteAccount={() => setIsDeleteAccountModalOpen(true)}
          user={user}
          pet={pet}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
        />

        {/* Main Content Area - Expands automatically when sidebar is collapsed */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-h-[calc(100vh-57px)] transition-all duration-300 ease-in-out min-w-0">
          {(currentView === 'dashboard' || currentView === 'home') && (
            <HomeView
              user={user}
              courses={courses}
              onSelectCourse={handleSelectCourse}
              onNavigate={(view) => setCurrentView(view)}
            />
          )}

          {currentView === 'courses' && (
            <CoursesView
              courses={courses}
              user={user}
              onSelectCourse={handleSelectCourse}
              onNavigate={(view) => setCurrentView(view)}
            />
          )}

          {currentView === 'code-sandbox' && (
            <CodeSandboxView
              user={user}
              initialCode={sandboxCode}
              initialLanguage={sandboxLanguage || 'javascript'}
              onAskCompanion={(ctx) =>
                handleOpenCompanionChat(ctx.prompt, {
                  language: ctx.language,
                  code: ctx.code,
                  error: ctx.error,
                  recentAction: 'Ran code in sandbox',
                })
              }
            />
          )}

          {currentView === 'speed-debug' && (
            <DailySpeedDebugView
              user={user}
              onAddRewards={handleAddSpeedDebugRewards}
            />
          )}

          {currentView === 'companion' && (
            <MyCompanionView
              user={user}
              pet={pet}
              onUpdatePet={handleUpdatePet}
              onNavigateToBazaar={() => setCurrentView('bazaar')}
              onNavigateToSandbox={handleInsertCodeToSandbox}
            />
          )}

          {currentView === 'bazaar' && (
            <PetBazaarView
              user={user}
              pet={pet}
              onPurchase={handleBazaarPurchase}
            />
          )}

          {currentView === 'leaderboard' && (
            <AchievementsView user={user} />
          )}

          {currentView === 'course-detail' && (
            <CourseDetailView
              course={activeCourse}
              user={user}
              onBack={() => setCurrentView('courses')}
              onOpenChapter={(chapter) =>
                setActiveChapterQuest({ course: activeCourse, chapter })
              }
              onUpgrade={() => setCurrentView('billing')}
            />
          )}

          {currentView === 'progress' && (
            <ProgressView
              user={user}
              courses={courses}
              onSelectCourse={handleSelectCourse}
              onNavigate={(view) => setCurrentView(view)}
            />
          )}

          {currentView === 'achievements' && (
            <AchievementsView user={user} />
          )}

          {currentView === 'billing' && (
            <BillingView
              user={user}
              onUpdatePlan={handleUpdatePlan}
            />
          )}

          {currentView === 'profile' && (
            <ProfileView
              user={user}
              onUpdateProfile={handleUpdateProfile}
              onSignOut={handleSignOut}
              onNavigateToDataStorage={() => setCurrentView('data-storage')}
              onDeleteAccount={() => setIsDeleteAccountModalOpen(true)}
            />
          )}

          {currentView === 'data-storage' && (
            <DataStorageInspectorView
              user={user}
              pet={pet}
              onNavigateBack={() => setCurrentView('profile')}
              onTriggerResetModal={() => setIsResetModalOpen(true)}
              onTriggerDeleteModal={() => setIsDeleteAccountModalOpen(true)}
              onClearSandboxCode={handleClearSandboxCode}
            />
          )}
        </main>
      </div>

      {/* Floating Companion Quick-Help Widget (Bottom Right) */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2">
        <button
          type="button"
          onClick={() => handleOpenCompanionChat()}
          className="group relative flex items-center gap-2.5 px-3.5 sm:px-4 py-2.5 rounded-full bg-slate-900 text-white shadow-xl hover:bg-slate-800 hover:shadow-2xl hover:scale-105 active:scale-95 transition cursor-pointer border border-slate-700/80"
          title="Ask AI Companion Mentor"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center p-0.5">
            <PetAvatar petId={user.activePetId} size="sm" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-[11px] font-extrabold flex items-center gap-1 text-emerald-400">
              <span>{pet.name || 'Mentor'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-[10px] text-slate-300 font-medium">Ask AI Mentor</div>
          </div>
        </button>
      </div>

      {/* Global Companion Chat Drawer */}
      <CompanionChatDrawer
        isOpen={isCompanionChatOpen}
        onClose={() => setIsCompanionChatOpen(false)}
        user={user}
        pet={pet}
        learningContext={learningContext}
        initialPrompt={companionChatPrompt}
        onInsertCodeToSandbox={(codeSnippet, lang) => {
          setIsCompanionChatOpen(false);
          handleInsertCodeToSandbox(codeSnippet, lang);
        }}
      />

      {/* Interactive Chapter Quest Modal */}
      {activeChapterQuest && (
        <ChapterQuestView
          course={activeChapterQuest.course}
          chapter={activeChapterQuest.chapter}
          user={user}
          onClose={() => setActiveChapterQuest(null)}
          onCompleteChapter={handleCompleteChapter}
          onOpenSandbox={handleInsertCodeToSandbox}
          onAskCompanion={(prompt) =>
            handleOpenCompanionChat(prompt, {
              courseTitle: activeChapterQuest.course.title,
              chapterTitle: activeChapterQuest.chapter.title,
              language: activeChapterQuest.chapter.language,
              code: activeChapterQuest.chapter.codeSnippet,
              recentAction: `Working on chapter quest: ${activeChapterQuest.chapter.title}`,
            })
          }
        />
      )}

      {/* AI Course Generator Modal */}
      <AiCourseGeneratorModal
        user={user}
        isOpen={aiGeneratorOpen}
        onClose={() => setAiGeneratorOpen(false)}
        onCourseGenerated={handleCourseGenerated}
      />

      {/* Reset Progress Confirmation Modal */}
      <ResetProgressModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleResetProgress}
      />

      {/* Delete Account & Wipe Data Modal */}
      <DeleteAccountModal
        isOpen={isDeleteAccountModalOpen}
        onClose={() => setIsDeleteAccountModalOpen(false)}
        onConfirmDelete={handleDeleteAccount}
        user={user}
      />
    </div>
  );
}

export default App;

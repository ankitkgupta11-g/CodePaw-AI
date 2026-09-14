import React from 'react';
import {
  LayoutGrid,
  BookOpen,
  Terminal,
  Zap,
  TrendingUp,
  Award,
  Sparkles,
  ShoppingBag,
  Trophy,
  Crown,
  User,
  Volume2,
  VolumeX,
  ChevronRight,
  PanelLeftClose,
  LogOut,
  Wand2,
  RotateCcw,
  X,
  Database,
  UserX,
} from 'lucide-react';
import { MainAppView, UserProfile, PetState } from '../types';
import { PetAvatar } from './PetAvatar';
import { COMPANIONS_BY_ID } from '../data/companions';

interface DashboardSidebarProps {
  currentView: MainAppView;
  onNavigate: (view: MainAppView) => void;
  onOpenAiGenerator: () => void;
  onSignOut: () => void;
  onToggleSound: () => void;
  onResetProgress?: () => void;
  onDeleteAccount?: () => void;
  user: UserProfile;
  pet: PetState;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  currentView,
  onNavigate,
  onOpenAiGenerator,
  onSignOut,
  onToggleSound,
  onResetProgress,
  onDeleteAccount,
  user,
  pet,
  isCollapsed = false,
  onToggleCollapse,
  isMobileDrawer = false,
  onCloseMobileDrawer,
}) => {
  const activePetDef = COMPANIONS_BY_ID[user.activePetId] || COMPANIONS_BY_ID.byte;

  const handleNavigate = (view: MainAppView) => {
    onNavigate(view);
    if (isMobileDrawer && onCloseMobileDrawer) {
      onCloseMobileDrawer();
    }
  };

  const handleOpenAiGenerator = () => {
    onOpenAiGenerator();
    if (isMobileDrawer && onCloseMobileDrawer) {
      onCloseMobileDrawer();
    }
  };

  const handleResetProgressClick = () => {
    if (onResetProgress) {
      onResetProgress();
    }
    if (isMobileDrawer && onCloseMobileDrawer) {
      onCloseMobileDrawer();
    }
  };

  const handleSignOutClick = () => {
    onSignOut();
    if (isMobileDrawer && onCloseMobileDrawer) {
      onCloseMobileDrawer();
    }
  };

  const handleDeleteAccountClick = () => {
    if (onDeleteAccount) {
      onDeleteAccount();
    }
    if (isMobileDrawer && onCloseMobileDrawer) {
      onCloseMobileDrawer();
    }
  };

  const NAV_ITEMS: {
    id: MainAppView | 'reset-progress' | 'delete-account';
    label: string;
    icon: React.FC<{ className?: string }>;
    badge?: { text: string; bg: string; color: string };
    isAction?: boolean;
    isDanger?: boolean;
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'courses', label: 'Courses & Quests', icon: BookOpen },
    {
      id: 'code-sandbox',
      label: 'Playground',
      icon: Terminal,
      badge: { text: 'Sandbox', bg: 'bg-emerald-50', color: 'text-emerald-700' },
    },
    {
      id: 'speed-debug',
      label: 'Daily Speed Debug',
      icon: Zap,
      badge: { text: '60s', bg: 'bg-orange-50', color: 'text-orange-700' },
    },
    { id: 'progress', label: 'Progress & Stats', icon: TrendingUp },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'companion', label: 'My Companion', icon: Sparkles },
    { id: 'bazaar', label: 'Pet Bazaar', icon: ShoppingBag },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'billing', label: 'Pro & Billing', icon: Crown },
    { id: 'profile', label: 'My Profile', icon: User },
    {
      id: 'data-storage',
      label: 'Data & Activity Log',
      icon: Database,
      badge: { text: 'Storage', bg: 'bg-sky-50', color: 'text-sky-700' },
    },
    {
      id: 'reset-progress',
      label: 'Reset Progress',
      icon: RotateCcw,
      isAction: true,
    },
    {
      id: 'delete-account',
      label: 'Delete Account',
      icon: UserX,
      isAction: true,
      isDanger: true,
    },
  ];

  // Reusable Tooltip for Collapsed State
  const Tooltip: React.FC<{ text: string; badge?: string }> = ({ text, badge }) => {
    if (!isCollapsed || isMobileDrawer) return null;
    return (
      <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-150 z-50 flex items-center gap-1.5">
        <span>{text}</span>
        {badge && (
          <span className="px-1.5 py-0.2 rounded text-[9px] bg-slate-800 text-emerald-400 font-bold">
            {badge}
          </span>
        )}
        <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-slate-900" />
      </div>
    );
  };

  return (
    <aside
      className={`bg-white border-r border-slate-200/80 flex flex-col justify-between select-none overflow-y-auto overflow-x-hidden transition-[width,padding] duration-300 ease-in-out ${
        isMobileDrawer
          ? 'w-full h-full p-4'
          : `${
              isCollapsed ? 'w-[72px] p-2' : 'w-64 p-3.5'
            } h-[calc(100vh-57px)] sticky top-[57px] hidden md:flex shrink-0`
      }`}
    >
      <div className="space-y-4">
        {/* Header: Brand & Collapse/Expand Toggle */}
        {!isCollapsed || isMobileDrawer ? (
          <div className="flex items-center justify-between gap-2 px-1 py-1">
            {/* Brand Header */}
            <button
              type="button"
              onClick={() => handleNavigate('dashboard')}
              className="flex items-center gap-2.5 text-left cursor-pointer min-w-0 group"
              title="CodePaw AI Dashboard"
            >
              <img
                src="/favicon.png"
                alt="CodePaw AI"
                className="w-10 h-10 rounded-2xl shadow-xs object-cover shrink-0 group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0 overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-slate-900 truncate">
                    Code<span className="text-[#22c55e]">Paw</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-100 text-emerald-800 shrink-0">
                    AI
                  </span>
                </div>
                <div className="text-[11px] font-medium text-slate-400 truncate">
                  AI Learning Platform
                </div>
              </div>
            </button>

            {/* Collapse button when expanded */}
            {!isMobileDrawer && onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                aria-label="Collapse sidebar"
                title="Collapse sidebar"
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 active:scale-95 transition cursor-pointer shrink-0"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            )}

            {/* Close button inside mobile drawer */}
            {isMobileDrawer && onCloseMobileDrawer && (
              <button
                type="button"
                onClick={onCloseMobileDrawer}
                aria-label="Close navigation drawer"
                title="Close navigation drawer"
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 active:scale-95 transition cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        ) : (
          /* Collapsed Mode Header */
          <div className="flex flex-col items-center gap-2 py-1">
            {/* Reduced Branding Icon */}
            <button
              type="button"
              onClick={() => handleNavigate('dashboard')}
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs shrink-0 group relative cursor-pointer hover:scale-105 transition-transform"
              aria-label="CodePaw AI Dashboard"
            >
              <img
                src="/favicon.png"
                alt="CodePaw AI"
                className="w-10 h-10 rounded-2xl object-cover"
                referrerPolicy="no-referrer"
              />
              <Tooltip text="CodePaw AI" />
            </button>

            {/* Expand toggle button at the top */}
            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                aria-label="Expand sidebar"
                title="Expand sidebar"
                className="w-10 h-10 rounded-xl text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 active:scale-95 transition cursor-pointer flex items-center justify-center group relative shrink-0"
              >
                <ChevronRight className="w-5 h-5" />
                <Tooltip text="Expand sidebar" />
              </button>
            )}
          </div>
        )}

        {/* AI Course Generator Button */}
        {!isCollapsed || isMobileDrawer ? (
          <button
            type="button"
            onClick={handleOpenAiGenerator}
            className="w-full bg-[#133020] hover:bg-[#1a3f2b] active:scale-98 transition text-white px-3.5 py-3 rounded-2xl flex items-center justify-between shadow-xs cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <Wand2 className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
              <span className="font-extrabold text-xs tracking-tight">
                AI Course Generator
              </span>
            </div>
            <span className="px-1.5 py-0.5 rounded-md bg-[#22c55e] text-white text-[10px] font-extrabold tracking-wide">
              AI
            </span>
          </button>
        ) : (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleOpenAiGenerator}
              className="w-10 h-10 bg-[#133020] hover:bg-[#1a3f2b] active:scale-95 transition text-white rounded-xl flex items-center justify-center shadow-xs cursor-pointer group relative"
              aria-label="AI Course Generator"
            >
              <Wand2 className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
              <Tooltip text="AI Course Generator" badge="AI" />
            </button>
          </div>
        )}

        {/* Navigation List */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isDashboard =
              item.id === 'dashboard' &&
              (currentView === 'dashboard' || currentView === 'home');
            const isActive =
              !item.isAction &&
              (isDashboard ||
                currentView === item.id ||
                (item.id === 'courses' &&
                  (currentView === 'course-detail' || currentView === 'chapter-quest')));

            if (isCollapsed && !isMobileDrawer) {
              return (
                <div key={item.id} className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (item.isAction && item.id === 'reset-progress') {
                        handleResetProgressClick();
                      } else if (item.isAction && item.id === 'delete-account') {
                        handleDeleteAccountClick();
                      } else {
                        handleNavigate(item.id as MainAppView);
                      }
                    }}
                    aria-label={item.label}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition cursor-pointer group relative ${
                      isActive
                        ? 'bg-[#22c55e] text-white shadow-xs'
                        : item.isAction
                        ? item.isDanger
                          ? 'text-rose-500 hover:text-rose-700 hover:bg-rose-50'
                          : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        isActive
                          ? 'text-white stroke-[2.5]'
                          : item.isAction
                          ? item.isDanger
                            ? 'text-rose-500 group-hover:text-rose-700'
                            : 'text-slate-400 group-hover:text-rose-600'
                          : 'text-slate-500 group-hover:text-slate-900'
                      }`}
                    />
                    <Tooltip text={item.label} badge={item.badge?.text} />
                  </button>
                </div>
              );
            }

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.isAction && item.id === 'reset-progress') {
                    handleResetProgressClick();
                  } else if (item.isAction && item.id === 'delete-account') {
                    handleDeleteAccountClick();
                  } else {
                    handleNavigate(item.id as MainAppView);
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? 'bg-[#22c55e] text-white font-extrabold shadow-xs'
                    : item.isAction
                    ? item.isDanger
                      ? 'text-rose-600 hover:text-rose-800 hover:bg-rose-50/80 font-bold'
                      : 'text-slate-600 hover:text-rose-700 hover:bg-rose-50/70'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive
                        ? 'text-white stroke-[2.5]'
                        : item.isAction
                        ? item.isDanger
                          ? 'text-rose-500 group-hover:text-rose-700'
                          : 'text-slate-400 group-hover:text-rose-600'
                        : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && !isActive && (
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold border border-slate-200/60 ${item.badge.bg} ${item.badge.color}`}
                  >
                    {item.badge.text}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Area: Companion Widget, Audio FX, User Profile */}
      <div className="pt-3 border-t border-slate-100">
        {!isCollapsed || isMobileDrawer ? (
          <div className="space-y-2.5">
            {/* Companion Card */}
            <button
              type="button"
              onClick={() => handleNavigate('companion')}
              className="w-full bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-200/70 rounded-2xl p-2.5 flex items-center justify-between text-left transition cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-full bg-white border border-emerald-200 flex items-center justify-center p-1 overflow-hidden shrink-0">
                  <PetAvatar petId={user.activePetId} size="sm" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-xs text-slate-900 truncate">
                      {activePetDef.name}
                    </span>
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-[#22c55e] text-white shrink-0">
                      Lvl {pet.level || 1}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium truncate">
                    {activePetDef.speciesTitle}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </button>

            {/* Web Audio FX Toggle */}
            <button
              type="button"
              onClick={onToggleSound}
              className="w-full bg-white hover:bg-slate-50 border border-slate-200/80 rounded-2xl px-3 py-2 flex items-center justify-between text-left transition cursor-pointer"
            >
              <div className="flex items-center gap-2">
                {user.soundEnabled ? (
                  <Volume2 className="w-3.5 h-3.5 text-[#22c55e]" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span className="font-bold text-xs text-slate-700">Web Audio FX</span>
              </div>

              <span
                className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md ${
                  user.soundEnabled
                    ? 'bg-emerald-50 text-[#22c55e]'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {user.soundEnabled ? 'ACTIVE' : 'MUTED'}
              </span>
            </button>

            {/* User Profile Card */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-2.5 flex items-center justify-between">
              <div
                className="flex items-center gap-2.5 cursor-pointer flex-1 mr-2 min-w-0"
                onClick={() => handleNavigate('profile')}
              >
                <div
                  className={`w-8 h-8 rounded-full text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0 ${
                    user.role === 'owner'
                      ? 'bg-gradient-to-tr from-amber-600 to-amber-400'
                      : 'bg-gradient-to-tr from-indigo-500 to-emerald-400'
                  }`}
                >
                  {user.avatarInitials}
                </div>
                <div className="min-w-0">
                  <div className="font-extrabold text-xs text-slate-900 truncate flex items-center gap-1">
                    <span className="truncate">{user.name}</span>
                    {user.role === 'owner' && (
                      <Crown className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-orange-600 font-bold truncate">
                    {user.role === 'owner' ? (
                      <span className="text-amber-700 font-sans font-bold">Owner / Admin</span>
                    ) : (
                      <>
                        <span>🔥</span>
                        <span>{user.streakDays === 0 ? '7d' : `${user.streakDays}d`} streak</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSignOutClick}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer shrink-0"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Collapsed Mode Bottom Area */
          <div className="flex flex-col items-center gap-2">
            {/* Companion Avatar Icon */}
            <button
              type="button"
              onClick={() => handleNavigate('companion')}
              className="w-10 h-10 rounded-full bg-white border border-emerald-200 flex items-center justify-center p-1 overflow-hidden transition hover:ring-2 hover:ring-emerald-400/50 cursor-pointer group relative"
              aria-label={`My Companion: ${activePetDef.name} (Lvl ${pet.level || 1})`}
            >
              <PetAvatar petId={user.activePetId} size="sm" />
              <Tooltip text={`Companion: ${activePetDef.name}`} badge={`Lvl ${pet.level || 1}`} />
            </button>

            {/* Audio Toggle Icon */}
            <button
              type="button"
              onClick={onToggleSound}
              className="w-10 h-10 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 transition cursor-pointer group relative"
              aria-label={user.soundEnabled ? 'Mute audio FX' : 'Enable audio FX'}
            >
              {user.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-[#22c55e]" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
              <Tooltip text="Audio FX" badge={user.soundEnabled ? 'ON' : 'MUTED'} />
            </button>

            {/* User Profile Avatar Icon */}
            <button
              type="button"
              onClick={() => handleNavigate('profile')}
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-emerald-400 text-white font-bold text-xs flex items-center justify-center shadow-xs hover:ring-2 hover:ring-emerald-400/50 transition cursor-pointer group relative"
              aria-label={`Profile: ${user.name}`}
            >
              {user.avatarInitials}
              <Tooltip text={user.name} badge={`${user.streakDays === 0 ? '7' : user.streakDays}d streak`} />
            </button>

            {/* Sign Out Icon */}
            <button
              type="button"
              onClick={handleSignOutClick}
              className="w-10 h-10 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition cursor-pointer group relative"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <Tooltip text="Sign Out" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

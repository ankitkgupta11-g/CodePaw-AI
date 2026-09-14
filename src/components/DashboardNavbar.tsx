import React from 'react';
import { Zap, Heart, Sparkles, User, LogOut, Menu, Crown, ShieldCheck } from 'lucide-react';
import { UserProfile, MainAppView } from '../types';

interface DashboardNavbarProps {
  user: UserProfile;
  onNavigate: (view: MainAppView) => void;
  onSignOut: () => void;
  onOpenCompanionChat?: () => void;
  onOpenMobileDrawer?: () => void;
}

export const DashboardNavbar: React.FC<DashboardNavbarProps> = ({
  user,
  onNavigate,
  onSignOut,
  onOpenCompanionChat,
  onOpenMobileDrawer,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-2.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Trigger + Brand Identity */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onOpenMobileDrawer && (
            <button
              type="button"
              onClick={onOpenMobileDrawer}
              aria-label="Open navigation menu"
              title="Open navigation menu"
              className="md:hidden p-1.5 -ml-1 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-95 transition cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <img
              src="/favicon.png"
              alt="CodePaw AI"
              className="w-8 h-8 rounded-xl shadow-xs object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="font-extrabold text-base tracking-tight text-slate-900">
              CodePaw <span className="text-emerald-600">AI</span>
            </div>
          </div>
        </div>

        {/* Right: Gamified Wallet Indicators & Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* XP Pill */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/80 border border-slate-200/60 text-xs font-bold text-slate-700"
            title="Total Experience Points"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{user.xp}</span>
          </div>

          {/* Gems Pill */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800"
            title="CodePaw Gems"
          >
            <span className="text-sm">💎</span>
            <span>{user.gems}</span>
          </div>

          {/* Learning Hearts */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700"
            title="Learning Hearts"
          >
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>{user.hearts}</span>
          </div>

          {/* AI Mentor Quick Trigger */}
          {onOpenCompanionChat && (
            <button
              type="button"
              onClick={onOpenCompanionChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition cursor-pointer"
              title="Open AI Companion Mentor"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ask Mentor</span>
            </button>
          )}

          {/* User Profile Avatar Circle & Role Badge */}
          <div className="flex items-center gap-2">
            {user.role === 'owner' && (
              <span
                id="badge_owner_navbar"
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-300 text-[11px] font-extrabold text-amber-800 shadow-xs"
                title="Verified Owner & Admin: Ankit Gupta"
              >
                <Crown className="w-3 h-3 text-amber-600 fill-amber-500" />
                <span>Owner</span>
              </span>
            )}

            <button
              id="btn_navbar_profile"
              type="button"
              onClick={() => onNavigate('profile')}
              className={`relative flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-xs shadow-xs hover:ring-2 transition cursor-pointer ${
                user.role === 'owner'
                  ? 'bg-gradient-to-tr from-amber-600 to-amber-400 hover:ring-amber-400/50'
                  : 'bg-emerald-600 hover:ring-emerald-500/50'
              }`}
              title={user.role === 'owner' ? `Owner & Admin: ${user.name}` : `Learner: ${user.name}`}
            >
              {user.avatarInitials}
              <span
                className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                  user.role === 'owner' ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

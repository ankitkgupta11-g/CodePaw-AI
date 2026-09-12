import React, { useState } from 'react';
import {
  User,
  CheckCircle2,
  Check,
  Mail,
  ShieldCheck,
  Sparkles,
  LogOut,
  Bell,
  Award,
} from 'lucide-react';
import { UserProfile, PetId } from '../types';
import { COMPANIONS, COMPANIONS_BY_ID } from '../data/companions';
import { PetAvatar } from './PetAvatar';
import { sound } from '../utils/audioFx';

interface ProfileViewProps {
  user: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onSignOut: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onUpdateProfile,
  onSignOut,
}) => {
  const [name, setName] = useState<string>(user.name);
  const [emailReminders, setEmailReminders] = useState<boolean>(
    user.emailRemindersEnabled
  );
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(
    user.showOnLeaderboard
  );
  const [selectedCompanionId, setSelectedCompanionId] = useState<PetId>(
    user.activePetId
  );
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const activePetDef = COMPANIONS_BY_ID[selectedCompanionId] || COMPANIONS_BY_ID.rexi;

  const handleSave = () => {
    onUpdateProfile({
      name,
      emailRemindersEnabled: emailReminders,
      showOnLeaderboard: showLeaderboard,
      activePetId: selectedCompanionId,
    });
    sound.playSuccess(user.soundEnabled);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSwitchCompanion = (petId: PetId) => {
    setSelectedCompanionId(petId);
    onUpdateProfile({ activePetId: petId });
    sound.playClick(user.soundEnabled);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header with Save Changes button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 mb-1">
            PROFILE
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Account, companion, and app settings
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Review your synced profile details, switch your selected character, and manage the settings that shape how CodePaw works for you.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm active:scale-95 transition cursor-pointer self-start sm:self-auto"
        >
          <Check className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Profile changes and active study buddy saved successfully!</span>
        </div>
      )}

      {/* 2-Column: Profile Details + Current Companion Card */}
      <div className="grid md:grid-cols-12 gap-8">
        {/* Left: Profile Details (7 Cols) */}
        <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
            <div className="w-14 h-14 rounded-full bg-emerald-600 text-white font-extrabold text-xl flex items-center justify-center shadow-sm">
              {user.avatarInitials}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="font-extrabold text-slate-900 text-lg border-b border-dashed border-slate-300 focus:border-emerald-500 focus:outline-none px-1"
                />
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <span>{user.email}</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                  <ShieldCheck className="w-3 h-3" />
                  Email verified
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Account ID
              </div>
              <div className="font-mono font-medium text-slate-700 truncate mt-1">
                {user.accountId}
              </div>
            </div>

            <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Last Sign-in Sync
              </div>
              <div className="font-medium text-slate-700 mt-1">
                {user.lastSignInDate}
              </div>
            </div>

            <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Leaderboard Status
              </div>
              <div className="font-bold text-emerald-700 mt-1">
                {showLeaderboard ? 'Visible' : 'Hidden'}
              </div>
            </div>

            <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Reminder Emails
              </div>
              <div className="font-bold text-emerald-700 mt-1">
                {emailReminders ? 'Enabled' : 'Disabled'}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Current Companion Card (5 Cols) */}
        <div className="md:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Current Companion
              </span>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  ACTIVE
                </span>
                <span className="text-xs text-slate-400 font-medium">Saved</span>
              </div>
            </div>

            <div className="py-6 flex flex-col items-center text-center">
              <PetAvatar petId={selectedCompanionId} size="xl" />
              <h3 className="font-extrabold text-slate-900 text-lg mt-3">
                {activePetDef.name} {activePetDef.tagline}
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                {activePetDef.description}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-400">
            Selected character appears on your home dashboard and quizzes.
          </div>
        </div>
      </div>

      {/* Essential Settings Switches */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <h2 className="text-lg font-extrabold text-slate-900">
          Essential settings
        </h2>

        <div className="space-y-4">
          {/* Setting 1 */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
            <div className="space-y-0.5">
              <div className="font-bold text-sm text-slate-900">
                Email reminders
              </div>
              <div className="text-xs text-slate-500">
                Get notified when your learning streak is about to reset or when chapters unlock.
              </div>
            </div>

            <button
              type="button"
              onClick={() => setEmailReminders(!emailReminders)}
              className={`w-12 h-7 flex items-center rounded-full p-1 cursor-pointer transition ${
                emailReminders ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-sm transform transition ${
                  emailReminders ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </div>

          {/* Setting 2 */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
            <div className="space-y-0.5">
              <div className="font-bold text-sm text-slate-900">
                Show on leaderboard
              </div>
              <div className="text-xs text-slate-500">
                Display your profile handle, streak, and gems on the global community rankings.
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowLeaderboard(!showLeaderboard)}
              className={`w-12 h-7 flex items-center rounded-full p-1 cursor-pointer transition ${
                showLeaderboard ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-sm transform transition ${
                  showLeaderboard ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Change Character Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">
            Change character
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Click any companion below to immediately switch your active learning partner.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          {COMPANIONS.map((companion) => {
            const isSelected = selectedCompanionId === companion.id;

            return (
              <button
                key={companion.id}
                type="button"
                onClick={() => handleSwitchCompanion(companion.id)}
                className={`p-4 rounded-2xl border text-center transition flex flex-col items-center cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                    : 'bg-white hover:bg-slate-50 border-slate-200/80'
                }`}
              >
                <PetAvatar petId={companion.id} size="md" />
                <div className="mt-2 font-bold text-sm text-slate-900">
                  {companion.name}
                </div>
                <div className="text-[11px] font-semibold text-emerald-700">
                  {companion.speciesTitle}
                </div>
                {isSelected && (
                  <span className="mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                    Active Buddy
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Account Actions / Sign Out */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="font-bold text-sm text-slate-900">
            Sign out of CodePaw
          </div>
          <div className="text-xs text-slate-500">
            Use this when you leave this app on this device.
          </div>
        </div>

        <button
          type="button"
          onClick={onSignOut}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

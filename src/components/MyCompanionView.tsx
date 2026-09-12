import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  Zap,
  Coffee,
  Smile,
  ShieldCheck,
  Award,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { UserProfile, PetState, PetId } from '../types';
import { PetAvatar } from './PetAvatar';
import { COMPANIONS, COMPANIONS_BY_ID } from '../data/companions';
import { sound } from '../utils/audioFx';
import confetti from 'canvas-confetti';
import { CompanionChatDrawer } from './CompanionChatDrawer';
import { MessageSquare, HeartHandshake } from 'lucide-react';
import { SandboxLanguage } from '../types';

interface MyCompanionViewProps {
  user: UserProfile;
  pet: PetState;
  onUpdatePet: (updated: Partial<PetState>) => void;
  onNavigateToBazaar: () => void;
  onNavigateToSandbox?: (code?: string, lang?: SandboxLanguage) => void;
}

export const MyCompanionView: React.FC<MyCompanionViewProps> = ({
  user,
  pet,
  onUpdatePet,
  onNavigateToBazaar,
  onNavigateToSandbox,
}) => {
  const [activeTab, setActiveTab] = useState<'mentor' | 'sanctuary'>('mentor');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const activeCompanion = COMPANIONS_BY_ID[user.activePetId] || COMPANIONS_BY_ID.byte;

  const showFeedback = (text: string) => {
    setActionFeedback(text);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 800);
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const handleFeed = () => {
    sound.playPetFeed(user.soundEnabled);
    const newHunger = Math.max(0, (pet.hunger || 40) - 20);
    const newEnergy = Math.min(100, (pet.energy || 80) + 15);
    onUpdatePet({ hunger: newHunger, energy: newEnergy, mood: 'happy' });
    showFeedback(`${activeCompanion.name} munched a cyber treat! Energy +15% 🍎`);
  };

  const handlePlay = () => {
    sound.playSuccess(user.soundEnabled);
    const newHappiness = Math.min(100, (pet.happiness || 90) + 10);
    const newEnergy = Math.max(0, (pet.energy || 80) - 10);
    onUpdatePet({ happiness: newHappiness, energy: newEnergy, mood: 'ecstatic' });
    showFeedback(`${activeCompanion.name} loved playing! Happiness +10% 🎾`);
  };

  const handleRest = () => {
    sound.playClick(user.soundEnabled);
    onUpdatePet({ energy: 100, mood: 'sleepy' });
    showFeedback(`${activeCompanion.name} took a power nap. Energy fully restored! 💤`);
  };

  const handlePet = () => {
    sound.playSuccess(user.soundEnabled);
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.6 },
    });
    onUpdatePet({ mood: 'ecstatic' });
    showFeedback(`${activeCompanion.name} feels adored! ✨❤️`);
  };

  const handleToggleAccessory = (accName: string) => {
    const current = pet.accessory;
    const nextAcc = current === accName ? undefined : accName;
    onUpdatePet({ accessory: nextAcc });
    sound.playClick(user.soundEnabled);
    showFeedback(nextAcc ? `Equipped ${accName}!` : `Unequipped accessory.`);
  };

  const EVOLUTION_STAGES = [
    { stage: 1, title: 'Baby', reqLvl: 'Lvl 1', desc: 'Cute novice learner starting the journey.' },
    { stage: 2, title: 'Juvenile', reqLvl: 'Lvl 3', desc: 'Active coder mastering loops and data flow.' },
    { stage: 3, title: 'Teen', reqLvl: 'Lvl 6', desc: 'Confident engineer building real applications.' },
    { stage: 4, title: 'Cyber Pro', reqLvl: 'Lvl 10', desc: 'Full AI mastery with glowing cyber armor!' },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 mb-1">
            MY COMPANION
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {activeTab === 'mentor' ? 'AI Coding Mentor' : 'Companion Sanctuary & Evolution'}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {activeTab === 'mentor'
              ? `Chat in real-time with ${pet.name || activeCompanion.name} for coding guidance, error debugging, and learning hints.`
              : 'Care for your study buddy, equip bazaar gear, and monitor evolution progress.'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setActiveTab('mentor');
              sound.playClick(user.soundEnabled);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'mentor'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>AI Coding Mentor</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('sanctuary');
              sound.playClick(user.soundEnabled);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'sanctuary'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Sanctuary & Care</span>
          </button>
        </div>
      </div>

      {activeTab === 'mentor' ? (
        <CompanionChatDrawer
          isOpen={true}
          isEmbeddedView={true}
          onClose={() => {}}
          user={user}
          pet={pet}
          onInsertCodeToSandbox={(code, lang) => {
            if (onNavigateToSandbox) {
              onNavigateToSandbox(code, lang);
            }
          }}
        />
      ) : (
        <>
      {/* Main Sanctuary Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs grid md:grid-cols-12 gap-8 items-center">
        {/* Left: Pet Avatar Interactive Stage (5 Cols) */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-emerald-50/70 to-teal-50/40 border border-emerald-100 text-center relative overflow-hidden">
          <div
            onClick={handlePet}
            className={`cursor-pointer transition-transform duration-300 ${
              isAnimating ? 'scale-110' : 'hover:scale-105'
            }`}
            title="Click to pet!"
          >
            <PetAvatar petId={user.activePetId} size="xl" />
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900">
                {activeCompanion.name}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white">
                Lvl {pet.level || 3}
              </span>
            </div>
            <p className="text-xs text-emerald-800 font-semibold mt-0.5">
              {activeCompanion.speciesTitle}
            </p>
            {pet.accessory && (
              <div className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                <span>Equipped: {pet.accessory}</span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handlePet}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-emerald-800 bg-white/90 hover:bg-white border border-emerald-200 shadow-xs cursor-pointer"
          >
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            Pet Me
          </button>
        </div>

        {/* Right: Companion Stats & Daily Care (7 Cols) */}
        <div className="md:col-span-7 space-y-6">
          {actionFeedback && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{actionFeedback}</span>
            </div>
          )}

          {/* Vitals Progress Bars */}
          <div className="space-y-4">
            {/* Happiness */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Smile className="w-4 h-4 text-amber-500" />
                  Happiness
                </span>
                <span>{pet.happiness || 92}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${pet.happiness || 92}%` }}
                />
              </div>
            </div>

            {/* Energy */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-emerald-500" />
                  Energy
                </span>
                <span>{pet.energy || 85}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${pet.energy || 85}%` }}
                />
              </div>
            </div>

            {/* Hunger */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Coffee className="w-4 h-4 text-orange-500" />
                  Fullness / Hunger
                </span>
                <span>{100 - (pet.hunger || 40)}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-400 rounded-full transition-all duration-500"
                  style={{ width: `${100 - (pet.hunger || 40)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Care Actions */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <button
              type="button"
              onClick={handleFeed}
              className="p-3 rounded-2xl border border-slate-200 bg-white hover:bg-emerald-50/60 hover:border-emerald-300 text-center transition cursor-pointer flex flex-col items-center gap-1"
            >
              <span className="text-xl">🍎</span>
              <span className="font-bold text-xs text-slate-800">Feed Snack</span>
            </button>

            <button
              type="button"
              onClick={handlePlay}
              className="p-3 rounded-2xl border border-slate-200 bg-white hover:bg-emerald-50/60 hover:border-emerald-300 text-center transition cursor-pointer flex flex-col items-center gap-1"
            >
              <span className="text-xl">🎾</span>
              <span className="font-bold text-xs text-slate-800">Play Fetch</span>
            </button>

            <button
              type="button"
              onClick={handleRest}
              className="p-3 rounded-2xl border border-slate-200 bg-white hover:bg-emerald-50/60 hover:border-emerald-300 text-center transition cursor-pointer flex flex-col items-center gap-1"
            >
              <span className="text-xl">💤</span>
              <span className="font-bold text-xs text-slate-800">Power Nap</span>
            </button>
          </div>
        </div>
      </div>

      {/* Wardrobe & Accessories */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Accessory Closet</h2>
            <p className="text-xs text-slate-500">
              Customize your companion with gear unlocked in the Pet Bazaar.
            </p>
          </div>

          <button
            type="button"
            onClick={onNavigateToBazaar}
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
          >
            Visit Bazaar
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: 'Wizard Hat', icon: '🎩', name: 'Wizard Hat' },
            { id: 'Cyber Shades', icon: '🕶️', name: 'Cyber Shades' },
            { id: 'Royal Crown', icon: '👑', name: 'Royal Crown' },
            { id: 'Gold Badge', icon: '⭐', name: 'Gold Badge' },
          ].map((acc) => {
            const isEquipped = pet.accessory === acc.id;
            return (
              <button
                key={acc.id}
                type="button"
                onClick={() => handleToggleAccessory(acc.id)}
                className={`p-4 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                  isEquipped
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'bg-white hover:bg-slate-50 border-slate-200'
                }`}
              >
                <span className="text-2xl">{acc.icon}</span>
                <span className="text-xs font-bold text-slate-800">{acc.name}</span>
                <span className={`text-[10px] font-semibold ${isEquipped ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {isEquipped ? 'Equipped' : 'Click to Equip'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Evolution Chamber */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900">Evolution Chamber</h2>
        <div className="grid sm:grid-cols-4 gap-4">
          {EVOLUTION_STAGES.map((st) => (
            <div
              key={st.stage}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-emerald-700">
                  Stage {st.stage}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-slate-600 border border-slate-200">
                  {st.reqLvl}
                </span>
              </div>
              <div className="font-bold text-sm text-slate-900">{st.title}</div>
              <p className="text-[11px] text-slate-500 leading-snug">{st.desc}</p>
            </div>
          ))}
        </div>
      </div>
        </>
      )}
    </div>
  );
};

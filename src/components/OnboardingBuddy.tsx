import React, { useState } from 'react';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { COMPANIONS } from '../data/companions';
import { PetAvatar } from './PetAvatar';
import { PetId } from '../types';

interface OnboardingBuddyProps {
  initialPetId?: PetId;
  onSelectBuddy: (petId: PetId) => void;
}

export const OnboardingBuddy: React.FC<OnboardingBuddyProps> = ({
  initialPetId = 'rexi',
  onSelectBuddy,
}) => {
  const [selectedId, setSelectedId] = useState<PetId>(initialPetId);

  return (
    <div className="min-h-screen bg-[#f4f8f4] flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-4xl bg-white rounded-3xl p-6 sm:p-10 border border-emerald-100 shadow-xl shadow-emerald-500/5">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700">
            <Sparkles className="w-3.5 h-3.5" />
            STEP 1 OF 1
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Choose your study buddy
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Your buddy will cheer you on and grow with you! ✨
          </p>
        </div>

        {/* 8 Companion Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {COMPANIONS.map((pet) => {
            const isSelected = selectedId === pet.id;
            return (
              <button
                key={pet.id}
                type="button"
                onClick={() => setSelectedId(pet.id)}
                className={`relative group p-4 rounded-2xl flex flex-col items-center text-center transition cursor-pointer border ${
                  isSelected
                    ? 'bg-emerald-50/60 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                    : 'bg-white hover:bg-slate-50 border-slate-200'
                }`}
              >
                {/* Checkmark Indicator */}
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}

                <div className="my-2">
                  <PetAvatar petId={pet.id} size="lg" />
                </div>

                <div className="mt-2 font-extrabold text-slate-900 text-base">
                  {pet.name}
                </div>
                <div className="text-xs font-semibold text-emerald-700 mt-0.5">
                  {pet.speciesTitle}
                </div>
                <div className="text-[11px] text-slate-500 mt-1.5 line-clamp-2">
                  {pet.description}
                </div>
              </button>
            );
          })}
        </div>

        {/* Action Bottom Bar */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
          <div className="text-xs text-slate-500">
            Selected:{' '}
            <strong className="text-slate-800">
              {COMPANIONS.find((p) => p.id === selectedId)?.name} (
              {COMPANIONS.find((p) => p.id === selectedId)?.speciesTitle})
            </strong>
          </div>

          <button
            type="button"
            onClick={() => onSelectBuddy(selectedId)}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 active:scale-95 transition cursor-pointer"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

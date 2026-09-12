import React, { useEffect } from 'react';
import { RotateCcw, AlertTriangle, X, Zap, Heart, Flame, Sparkles, BookOpen } from 'lucide-react';

interface ResetProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetProgressModal: React.FC<ResetProgressModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 flex flex-col gap-5 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-rose-500 to-amber-500" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close reset modal"
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Icon */}
        <div className="flex items-start gap-4 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-600 shrink-0 shadow-xs">
            <RotateCcw className="w-6 h-6 animate-spin-reverse" />
          </div>
          <div>
            <h2 id="reset-modal-title" className="text-lg font-extrabold text-slate-900">
              Reset All Progress?
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              This will reset your learning streak, earned XP, gems, and course completions back to Day 1. Your companion will return to starting status.
            </p>
          </div>
        </div>

        {/* Breakdown Items */}
        <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/60 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-600">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>Learning Streak</span>
            </div>
            <span className="font-bold text-slate-900">Reset to 0 days</span>
          </div>

          <div className="flex items-center justify-between text-slate-600">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Experience Points (XP) & Gems</span>
            </div>
            <span className="font-bold text-slate-900">Reset to 0</span>
          </div>

          <div className="flex items-center justify-between text-slate-600">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Learning Hearts</span>
            </div>
            <span className="font-bold text-slate-900">Restored to 3</span>
          </div>

          <div className="flex items-center justify-between text-slate-600">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Completed Chapters</span>
            </div>
            <span className="font-bold text-slate-900">Cleared</span>
          </div>

          <div className="flex items-center justify-between text-slate-600">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>Companion Level</span>
            </div>
            <span className="font-bold text-slate-900">Reset to Lvl 1</span>
          </div>
        </div>

        {/* Warning Callout */}
        <div className="flex items-center gap-2 px-3 py-2 bg-amber-50/80 border border-amber-200/70 rounded-xl text-amber-800 text-[11px] font-medium">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>This action is immediate and cannot be undone.</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-98 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition cursor-pointer flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Yes, Reset Progress</span>
          </button>
        </div>
      </div>
    </div>
  );
};

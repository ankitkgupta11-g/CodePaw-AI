import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Zap,
  Heart,
  Volume2,
} from 'lucide-react';
import { Chapter, Course, UserProfile, SandboxLanguage } from '../types';
import { PetAvatar } from './PetAvatar';
import { sound } from '../utils/audioFx';
import { Code2, Play, MessageSquare } from 'lucide-react';

interface ChapterQuestViewProps {
  course: Course;
  chapter: Chapter;
  user: UserProfile;
  onClose: () => void;
  onCompleteChapter: (chapterId: string, xpReward: number, gemReward: number) => void;
  onOpenSandbox?: (code?: string, lang?: SandboxLanguage) => void;
  onAskCompanion?: (prompt?: string) => void;
}

export const ChapterQuestView: React.FC<ChapterQuestViewProps> = ({
  course,
  chapter,
  user,
  onClose,
  onCompleteChapter,
  onOpenSandbox,
  onAskCompanion,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [hasCompleted, setHasCompleted] = useState<boolean>(
    user.completedChapterIds.includes(chapter.id)
  );

  const options = chapter.options || [
    {
      id: 'default_1',
      text: 'A structured system for processing input and generating predictions.',
      isCorrect: true,
      explanation: 'Correct! This aligns with the fundamental definition of AI systems.',
    },
    {
      id: 'default_2',
      text: 'An unchangeable biological organ.',
      isCorrect: false,
      explanation: 'AI is computational, not biological.',
    },
  ];

  const selectedOption = options.find((o) => o.id === selectedOptionId);
  const isCorrect = selectedOption?.isCorrect ?? false;

  const handleOptionSelect = (optionId: string) => {
    if (isSubmitted) return;
    setSelectedOptionId(optionId);
    sound.playClick(user.soundEnabled);
  };

  const handleVerify = () => {
    if (!selectedOptionId) return;
    setIsSubmitted(true);

    if (isCorrect) {
      sound.playLevelUp(user.soundEnabled);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      setHasCompleted(true);
      onCompleteChapter(chapter.id, chapter.xpReward, chapter.gemReward);
    } else {
      sound.playError(user.soundEnabled);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-emerald-50/40">
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">
              {course.title} • CHAPTER {chapter.chapterNumber}
            </div>
            <h2 className="font-extrabold text-lg text-slate-900">
              {chapter.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Concept Explanation Card */}
          <div className="bg-[#f8faf8] rounded-2xl p-5 border border-emerald-100/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Core Concept
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {chapter.explanation || chapter.description}
            </p>

            {chapter.codeSnippet && (
              <div className="mt-3 bg-slate-900 text-slate-100 p-3.5 rounded-xl font-mono text-xs overflow-x-auto relative group">
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-1.5 mb-2">
                  <span className="font-bold text-emerald-400 uppercase">
                    {chapter.language || 'Example Code'}
                  </span>
                  {onOpenSandbox && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenSandbox(chapter.codeSnippet, chapter.language);
                      }}
                      className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition cursor-pointer font-bold"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Try in Code Sandbox</span>
                    </button>
                  )}
                </div>
                <pre>{chapter.codeSnippet}</pre>
              </div>
            )}

            {/* Ask Companion Button */}
            {onAskCompanion && (
              <div className="pt-1 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onAskCompanion(
                      `I'm currently working on "${chapter.title}" in ${course.title}. Can you give me a learning hint or break down the concept simply?`
                    );
                  }}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-100/70 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>🐾 Ask Companion for a Hint</span>
                </button>
              </div>
            )}
          </div>

          {/* Interactive Question */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-base text-slate-900">
              {chapter.question || 'Check your understanding:'}
            </h3>

            <div className="space-y-2.5">
              {options.map((option) => {
                const isSelected = selectedOptionId === option.id;
                let optionStyle =
                  'bg-white border-slate-200 text-slate-700 hover:border-emerald-300';

                if (isSubmitted) {
                  if (option.isCorrect) {
                    optionStyle =
                      'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20';
                  } else if (isSelected && !option.isCorrect) {
                    optionStyle = 'bg-rose-50 border-rose-400 text-rose-900';
                  }
                } else if (isSelected) {
                  optionStyle =
                    'bg-emerald-50/60 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20';
                }

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleOptionSelect(option.id)}
                    disabled={isSubmitted}
                    className={`w-full p-4 rounded-xl text-left text-sm font-medium border transition flex items-start gap-3 cursor-pointer ${optionStyle}`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 flex-shrink-0 ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <span>{option.text}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submission Result Feedback */}
          {isSubmitted && (
            <div
              className={`p-4 rounded-2xl border flex items-start gap-3 text-sm ${
                isCorrect
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              {isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div className="font-bold">
                  {isCorrect ? 'Outstanding work!' : 'Not quite right'}
                </div>
                <p className="text-xs leading-relaxed">
                  {selectedOption?.explanation}
                </p>
                {isCorrect && (
                  <div className="text-xs font-bold text-emerald-700 pt-1">
                    +{chapter.xpReward} XP & +{chapter.gemReward} Gems awarded!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <PetAvatar petId={user.activePetId} size="sm" />
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              Your pet gains XP with every completed chapter!
            </span>
          </div>

          <div>
            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleVerify}
                disabled={!selectedOptionId}
                className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition cursor-pointer"
              >
                Verify Answer
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm transition flex items-center gap-2 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

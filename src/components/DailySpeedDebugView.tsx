import React, { useState, useEffect } from 'react';
import {
  Zap,
  Flame,
  Clock,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Award,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { UserProfile } from '../types';
import { PetAvatar } from './PetAvatar';
import { sound } from '../utils/audioFx';
import confetti from 'canvas-confetti';

interface DailySpeedDebugViewProps {
  user: UserProfile;
  onAddRewards: (xp: number, gems: number) => void;
}

interface BugChallenge {
  id: string;
  title: string;
  language: string;
  buggyCode: string;
  question: string;
  options: { id: string; text: string; isCorrect: boolean; explanation: string }[];
}

const CHALLENGES: BugChallenge[] = [
  {
    id: 'bug1',
    title: 'Array Index Off-by-One',
    language: 'JavaScript',
    buggyCode: `function printTopLearners(learners) {\n  for (let i = 0; i <= learners.length; i++) {\n    console.log(learners[i].name);\n  }\n}`,
    question: 'What bug causes an "undefined" reference error on the last loop iteration?',
    options: [
      {
        id: 'opt1',
        text: 'The loop condition uses <= instead of < learners.length.',
        isCorrect: true,
        explanation: 'Fix: Array indices run from 0 to length - 1, so index equal to length is out of bounds!',
      },
      {
        id: 'opt2',
        text: 'The variable i should be declared with var instead of let.',
        isCorrect: false,
        explanation: 'Let is the correct block-scoped variable declaration.',
      },
      {
        id: 'opt3',
        text: 'Console.log should be replaced with alert.',
        isCorrect: false,
        explanation: 'Console.log is standard.',
      },
    ],
  },
  {
    id: 'bug2',
    title: 'Async Await Promise Resolution',
    language: 'JavaScript',
    buggyCode: `async function fetchPetProfile(petId) {\n  const response = fetch("/api/pets/" + petId);\n  const data = response.json();\n  return data;\n}`,
    question: 'Why does fetchPetProfile return an unresolved Promise rather than data?',
    options: [
      {
        id: 'opt1',
        text: 'Missing "await" before fetch() and before response.json().',
        isCorrect: true,
        explanation: 'Both fetch() and response.json() return Promises and must be awaited.',
      },
      {
        id: 'opt2',
        text: 'Fetch cannot concatenate strings with "+".',
        isCorrect: false,
        explanation: 'String concatenation works fine.',
      },
      {
        id: 'opt3',
        text: 'The function name cannot start with "fetch".',
        isCorrect: false,
        explanation: 'Function names can be anything valid.',
      },
    ],
  },
  {
    id: 'bug3',
    title: 'State Mutation in React',
    language: 'React / TypeScript',
    buggyCode: `function addGem(setProfile) {\n  setProfile(prev => {\n    prev.gems += 10;\n    return prev;\n  });\n}`,
    question: 'Why does the component fail to re-render when gems increase?',
    options: [
      {
        id: 'opt1',
        text: 'Directly mutating prev object does not produce a new reference, so React skips re-rendering.',
        isCorrect: true,
        explanation: 'Correct! State must be updated immutably: return { ...prev, gems: prev.gems + 10 }.',
      },
      {
        id: 'opt2',
        text: 'Gems must always be multiplied, never added.',
        isCorrect: false,
        explanation: 'Incorrect.',
      },
      {
        id: 'opt3',
        text: 'React only allows numbers up to 5 in state.',
        isCorrect: false,
        explanation: 'React supports arbitrary numeric values.',
      },
    ],
  },
  {
    id: 'bug4',
    title: 'Python ZeroDivisionError',
    language: 'Python',
    buggyCode: `def compute_ratio(completed, total):\n    ratio = completed / total\n    return round(ratio, 2)`,
    question: 'How should this function handle callers passing total = 0?',
    options: [
      {
        id: 'opt1',
        text: 'Check if total == 0 and return 0.0 or handle with a guard clause.',
        isCorrect: true,
        explanation: 'Dividing by zero raises ZeroDivisionError in Python.',
      },
      {
        id: 'opt2',
        text: 'Multiply completed by total first.',
        isCorrect: false,
        explanation: 'That does not solve the division by zero.',
      },
      {
        id: 'opt3',
        text: 'Change "def" to "function".',
        isCorrect: false,
        explanation: 'Python uses "def".',
      },
    ],
  },
];

export const DailySpeedDebugView: React.FC<DailySpeedDebugViewProps> = ({
  user,
  onAddRewards,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [solvedCount, setSolvedCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleGameOver();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const handleStart = () => {
    setIsPlaying(true);
    setGameOver(false);
    setTimeLeft(60);
    setCurrentIndex(0);
    setScore(0);
    setSolvedCount(0);
    setFeedback(null);
    sound.playClick(user.soundEnabled);
  };

  const handleGameOver = () => {
    setIsPlaying(false);
    setGameOver(true);
    sound.playLevelUp(user.soundEnabled);

    const xpEarned = solvedCount * 40;
    const gemsEarned = solvedCount * 5;
    if (xpEarned > 0) {
      onAddRewards(xpEarned, gemsEarned);
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const currentChallenge = CHALLENGES[currentIndex % CHALLENGES.length];

  const handleSelectOption = (isCorrect: boolean, explanation: string) => {
    if (feedback) return;

    if (isCorrect) {
      sound.playSuccess(user.soundEnabled);
      setScore((s) => s + 150 + timeLeft * 2);
      setSolvedCount((c) => c + 1);
      setFeedback({ isCorrect: true, text: `Correct! ${explanation}` });

      setTimeout(() => {
        setFeedback(null);
        setCurrentIndex((i) => i + 1);
      }, 1200);
    } else {
      sound.playError(user.soundEnabled);
      setTimeLeft((t) => Math.max(0, t - 5)); // penalty of 5s
      setFeedback({ isCorrect: false, text: `Incorrect! -5s penalty. ${explanation}` });

      setTimeout(() => {
        setFeedback(null);
      }, 1500);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">
              SPEED DEBUG
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800">
              60s
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Daily 60-Second Speed Debug
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Race against the clock to diagnose and patch real code bugs!
          </p>
        </div>

        {/* Action button */}
        {!isPlaying && !gameOver && (
          <button
            type="button"
            onClick={handleStart}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-extrabold text-sm text-white bg-orange-600 hover:bg-orange-500 shadow-md shadow-orange-600/20 active:scale-95 transition cursor-pointer self-start sm:self-auto"
          >
            <Zap className="w-4 h-4 fill-current" />
            Start 60s Sprint
          </button>
        )}
      </div>

      {/* When Playing: Timer Bar & Score Header */}
      {isPlaying && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600 animate-pulse" />
              <span className="font-mono text-2xl font-extrabold text-slate-900">
                {timeLeft}s
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold">
              <div className="px-3 py-1.5 rounded-xl bg-orange-50 text-orange-800 border border-orange-200">
                Score: {score} pts
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                Fixed: {solvedCount} bugs
              </div>
            </div>
          </div>

          {/* Time Progress Bar */}
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 rounded-full ${
                timeLeft <= 10 ? 'bg-rose-500' : timeLeft <= 25 ? 'bg-amber-500' : 'bg-orange-500'
              }`}
              style={{ width: `${(timeLeft / 60) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Active Challenge Card */}
      {isPlaying && currentChallenge && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                {currentChallenge.language}
              </span>
              <h2 className="font-extrabold text-base sm:text-lg text-slate-900">
                {currentChallenge.title}
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              Bug #{currentIndex + 1}
            </span>
          </div>

          {/* Code block with syntax styling */}
          <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl font-mono text-xs overflow-x-auto border border-slate-800">
            <pre className="text-rose-300">{currentChallenge.buggyCode}</pre>
          </div>

          {/* Question */}
          <div className="space-y-3">
            <div className="font-bold text-sm text-slate-800">
              {currentChallenge.question}
            </div>

            <div className="space-y-2">
              {currentChallenge.options.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectOption(opt.isCorrect, opt.explanation)}
                  disabled={feedback !== null}
                  className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-xs sm:text-sm font-medium transition cursor-pointer"
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </div>

          {/* Instant feedback banner */}
          {feedback && (
            <div
              className={`p-4 rounded-2xl border flex items-center gap-3 text-xs font-bold ${
                feedback.isCorrect
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              {feedback.isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              )}
              <span>{feedback.text}</span>
            </div>
          )}
        </div>
      )}

      {/* Game Over Screen */}
      {gameOver && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200/80 shadow-md space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-900">Sprint Finished!</h2>
            <p className="text-sm text-slate-500">
              Great debugging reflex! Your companion gained happiness and experience.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-xs text-slate-400 font-bold uppercase">Bugs Solved</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{solvedCount}</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-xs text-slate-400 font-bold uppercase">Final Score</div>
              <div className="text-2xl font-extrabold text-orange-600 mt-1">{score}</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-xs text-slate-400 font-bold uppercase">XP Awarded</div>
              <div className="text-2xl font-extrabold text-emerald-600 mt-1">+{solvedCount * 40}</div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleStart}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm text-white bg-orange-600 hover:bg-orange-500 shadow-sm transition active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Play Another Round
          </button>
        </div>
      )}

      {/* Pre-game intro rules when idle */}
      {!isPlaying && !gameOver && (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h3 className="font-bold text-sm text-slate-900">Spot the Bug</h3>
            <p className="text-xs text-slate-500">
              Review genuine code snippets with off-by-one errors, state mutations, and promise pitfalls.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h3 className="font-bold text-sm text-slate-900">Beat the Clock</h3>
            <p className="text-xs text-slate-500">
              Answer accurately within 60 seconds. Incorrect submissions incur a 5-second penalty!
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h3 className="font-bold text-sm text-slate-900">Level Up Pet</h3>
            <p className="text-xs text-slate-500">
              Earn XP and Gems to level up your companion and unlock accessories in the Pet Bazaar.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

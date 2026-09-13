import React, { useState, useEffect } from 'react';
import {
  Database,
  Download,
  Trash2,
  HardDrive,
  Clock,
  BookOpen,
  Award,
  Terminal,
  Sparkles,
  ShieldCheck,
  Flame,
  CheckCircle2,
  FileJson,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
  ArrowLeft,
} from 'lucide-react';
import { UserProfile, PetState } from '../types';
import { STORAGE_KEYS } from '../utils/storage';
import { sound } from '../utils/audioFx';

interface DataStorageInspectorViewProps {
  user: UserProfile;
  pet: PetState;
  onNavigateBack?: () => void;
  onOpenDeleteAccountModal?: () => void;
  onTriggerDeleteModal?: () => void;
  onOpenResetProgressModal?: () => void;
  onTriggerResetModal?: () => void;
  onClearSandboxCode: () => void;
}

export const DataStorageInspectorView: React.FC<DataStorageInspectorViewProps> = ({
  user,
  pet,
  onNavigateBack,
  onOpenDeleteAccountModal,
  onTriggerDeleteModal,
  onOpenResetProgressModal,
  onTriggerResetModal,
  onClearSandboxCode,
}) => {
  const handleDeleteTrigger = onTriggerDeleteModal || onOpenDeleteAccountModal;
  const handleResetTrigger = onTriggerResetModal || onOpenResetProgressModal;
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedStorageKey, setSelectedStorageKey] = useState<string>(STORAGE_KEYS.PROFILE);
  const [storageItems, setStorageItems] = useState<{
    key: string;
    sizeBytes: number;
    description: string;
    content: string;
    lastUpdated: string;
  }[]>([]);
  const [totalStorageBytes, setTotalStorageBytes] = useState<number>(0);
  const [copiedRawData, setCopiedRawData] = useState<boolean>(false);

  // Scan localStorage to calculate size and itemize
  const refreshStorageData = () => {
    try {
      const knownKeys = [
        {
          key: STORAGE_KEYS.PROFILE,
          label: 'User Account & Progress',
          desc: 'Stores account ID, name, email, streak, XP, gems, hearts, badges, and weekly learning progress.',
        },
        {
          key: STORAGE_KEYS.PET,
          label: 'AI Companion State',
          desc: 'Stores your active pet, bond level, happiness, hunger, energy, and mood.',
        },
        {
          key: STORAGE_KEYS.IS_AUTHENTICATED,
          label: 'Session Authentication',
          desc: 'Stores current login session status on this device.',
        },
        {
          key: 'codepaw_sandbox_code_javascript',
          label: 'Sandbox Code (JavaScript)',
          desc: 'Your custom written JavaScript playground draft.',
        },
        {
          key: 'codepaw_sandbox_code_python',
          label: 'Sandbox Code (Python)',
          desc: 'Your custom written Python playground draft.',
        },
        {
          key: 'codepaw_sandbox_code_html',
          label: 'Sandbox Code (HTML)',
          desc: 'Your custom written HTML playground draft.',
        },
        {
          key: 'codepaw_sandbox_code_css',
          label: 'Sandbox Code (CSS)',
          desc: 'Your custom written CSS stylesheet draft.',
        },
        {
          key: STORAGE_KEYS.SIDEBAR_COLLAPSED,
          label: 'Sidebar Display Preference',
          desc: 'UI preference saving whether the sidebar is collapsed or expanded.',
        },
      ];

      let total = 0;
      const parsedItems = [];

      for (const item of knownKeys) {
        const value = localStorage.getItem(item.key);
        if (value !== null) {
          const bytes = new Blob([value]).size;
          total += bytes;
          parsedItems.push({
            key: item.key,
            sizeBytes: bytes,
            description: item.desc,
            content: value,
            lastUpdated: 'Live in Browser',
          });
        }
      }

      // Also grab any other custom keys prefixed with codepaw
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.startsWith('codepaw_') || k.startsWith('skillpet_'))) {
          if (!parsedItems.some((pi) => pi.key === k)) {
            const v = localStorage.getItem(k) || '';
            const bytes = new Blob([v]).size;
            total += bytes;
            parsedItems.push({
              key: k,
              sizeBytes: bytes,
              description: 'App cache / state record',
              content: v,
              lastUpdated: 'Live in Browser',
            });
          }
        }
      }

      setStorageItems(parsedItems);
      setTotalStorageBytes(total);
    } catch (err) {
      console.warn('Error reading storage:', err);
    }
  };

  useEffect(() => {
    refreshStorageData();
  }, [user, pet]);

  const handleExportJson = () => {
    try {
      const fullArchive = {
        exportedAt: new Date().toISOString(),
        appName: 'CodePaw AI Platform',
        userAccount: {
          id: user.id,
          name: user.name,
          email: user.email,
          accountId: user.accountId,
          emailVerified: user.emailVerified,
          subscriptionPlan: user.subscriptionPlan,
          lastSignInDate: user.lastSignInDate,
        },
        learningProgress: {
          xp: user.xp,
          gems: user.gems,
          hearts: user.hearts,
          streakDays: user.streakDays,
          completedChapterIds: user.completedChapterIds,
          enrolledCourseIds: user.enrolledCourseIds,
          earnedBadgeIds: user.earnedBadgeIds,
          weeklyProgress: user.weeklyProgress,
        },
        companion: pet,
        sandboxDrafts: {
          javascript: localStorage.getItem('codepaw_sandbox_code_javascript') || null,
          python: localStorage.getItem('codepaw_sandbox_code_python') || null,
          html: localStorage.getItem('codepaw_sandbox_code_html') || null,
          css: localStorage.getItem('codepaw_sandbox_code_css') || null,
        },
        rawDataDump: storageItems.reduce((acc, item) => {
          acc[item.key] = item.content;
          return acc;
        }, {} as Record<string, string>),
      };

      const blob = new Blob([JSON.stringify(fullArchive, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `codepaw-userdata-${user.id || 'backup'}-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      sound.playSuccess(user.soundEnabled);
    } catch (e) {
      console.error('Failed to export data:', e);
    }
  };

  const handleCopyRaw = () => {
    const targetItem = storageItems.find((s) => s.key === selectedStorageKey);
    if (!targetItem) return;
    navigator.clipboard.writeText(targetItem.content);
    setCopiedRawData(true);
    sound.playClick(user.soundEnabled);
    setTimeout(() => setCopiedRawData(false), 2000);
  };

  const selectedItem = storageItems.find((s) => s.key === selectedStorageKey) || storageItems[0];

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  // Compute pretty JSON preview if possible
  const getFormattedContent = (content: string) => {
    try {
      const parsed = JSON.parse(content);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return content;
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Back button if available */}
      {onNavigateBack && (
        <div>
          <button
            type="button"
            onClick={onNavigateBack}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-700 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Profile</span>
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 mb-1">
            TRANSPARENCY & DATA STORAGE
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Stored Data & Activity Inspector
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Inspect exactly what information this website stores about your account, view your live local storage footprint, and download a complete copy of your records.
          </p>
        </div>

        {/* Action: Export JSON button */}
        <button
          type="button"
          onClick={handleExportJson}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm active:scale-95 transition cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export My Data (JSON)</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Storage Mode */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600 shrink-0">
            <HardDrive className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Storage Engine
            </div>
            <div className="text-base font-extrabold text-slate-900 truncate">
              Local Browser Storage
            </div>
            <div className="text-[11px] font-medium text-emerald-700">
              Private to this device
            </div>
          </div>
        </div>

        {/* Card 2: Footprint */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Storage Footprint
            </div>
            <div className="text-base font-extrabold text-slate-900">
              {formatBytes(totalStorageBytes)}
            </div>
            <div className="text-[11px] font-medium text-slate-500">
              {storageItems.length} active data records
            </div>
          </div>
        </div>

        {/* Card 3: Account ID */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200/60 flex items-center justify-center text-purple-600 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Data Ownership
            </div>
            <div className="text-base font-extrabold text-slate-900 truncate">
              {user.name}
            </div>
            <div className="text-[11px] font-medium text-purple-700 truncate">
              {user.email}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time What You Are Doing Breakdown */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Live Activity & Saved State Summary
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Here is everything currently recorded as you interact with courses, companion quests, and playgrounds.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
            Auto-synced
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Item 1: Learning Progress */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Curriculum & Quests</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Completed Chapters</span>
                <span className="font-extrabold text-slate-900 text-sm">
                  {user.completedChapterIds.length} chapters
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Enrolled Tracks</span>
                <span className="font-extrabold text-slate-900 text-sm">
                  {user.enrolledCourseIds.length} courses
                </span>
              </div>
            </div>
            <div className="text-[11px] text-slate-500">
              {user.completedChapterIds.length === 0
                ? 'No chapters completed yet. Take a quest in Courses to record completions.'
                : `Chapters: ${user.completedChapterIds.slice(0, 4).join(', ')}${user.completedChapterIds.length > 4 ? '...' : ''}`}
            </div>
          </div>

          {/* Item 2: Stats & Game Loop */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Gamification & Streaks</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-slate-100 text-center">
                <span className="text-slate-400 block text-[10px]">XP</span>
                <span className="font-extrabold text-amber-600 text-sm">{user.xp}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-100 text-center">
                <span className="text-slate-400 block text-[10px]">Gems</span>
                <span className="font-extrabold text-emerald-600 text-sm">{user.gems}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-100 text-center">
                <span className="text-slate-400 block text-[10px]">Streak</span>
                <span className="font-extrabold text-orange-600 text-sm">{user.streakDays}d</span>
              </div>
            </div>
            <div className="text-[11px] text-slate-500">
              Active days this week:{' '}
              <strong className="text-slate-700">
                {Object.values(user.weeklyProgress).filter(Boolean).length} of 7 days
              </strong>
            </div>
          </div>

          {/* Item 3: Companion Buddy */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Companion Pet State</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Active Buddy</span>
                <span className="font-extrabold text-slate-900 text-sm capitalize">
                  {pet.name} ({pet.speciesTitle})
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Level / Mood</span>
                <span className="font-extrabold text-slate-900 text-sm capitalize">
                  Lvl {pet.level} • {pet.mood}
                </span>
              </div>
            </div>
            <div className="text-[11px] text-slate-500">
              Inventory items owned: {user.inventory.length} items
            </div>
          </div>

          {/* Item 4: Sandbox Playground */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                <Terminal className="w-4 h-4 text-sky-600" />
                <span>Code Sandbox Drafts</span>
              </div>
              <button
                type="button"
                onClick={onClearSandboxCode}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
              >
                Clear Sandbox Cache
              </button>
            </div>
            <div className="text-xs text-slate-600 leading-relaxed bg-white p-2.5 rounded-xl border border-slate-100">
              Your edits in JavaScript, Python, HTML, and CSS are auto-saved locally in real-time so your code is preserved when refreshing the page.
            </div>
            <div className="text-[11px] text-slate-500">
              Languages cached:{' '}
              {['javascript', 'python', 'html', 'css']
                .filter((l) => localStorage.getItem(`codepaw_sandbox_code_${l}`))
                .join(', ') || 'Default starter templates'}
            </div>
          </div>
        </div>
      </div>

      {/* Raw Local Storage Key/Value Inspector */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Storage Keys & Raw Inspector
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any local storage key to view the exact JSON payload stored in your browser.
            </p>
          </div>

          {selectedItem && (
            <button
              type="button"
              onClick={handleCopyRaw}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer self-start sm:self-auto"
            >
              {copiedRawData ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Key Content</span>
                </>
              )}
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-12 gap-6">
          {/* Key List (4 Cols) */}
          <div className="md:col-span-5 space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {storageItems.map((item) => {
              const isSelected = item.key === (selectedItem?.key || '');
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setSelectedStorageKey(item.key)}
                  className={`w-full text-left p-3 rounded-2xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'bg-slate-50/60 hover:bg-slate-100 border-slate-200/70'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 truncate">
                      {item.key}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600 shrink-0">
                      {formatBytes(item.sizeBytes)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Raw Value Previewer (7 Cols) */}
          <div className="md:col-span-7 flex flex-col">
            <div className="bg-slate-900 rounded-2xl p-4 flex-1 font-mono text-xs text-emerald-400 overflow-x-auto max-h-[380px] shadow-inner border border-slate-800">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
                <span>Key: {selectedItem?.key}</span>
                <span>Size: {formatBytes(selectedItem?.sizeBytes || 0)}</span>
              </div>
              <pre className="whitespace-pre-wrap leading-relaxed">
                {selectedItem ? getFormattedContent(selectedItem.content) : 'No key selected'}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone: Account Deletion and Reset Progress */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-200 shadow-xs space-y-6">
        <div>
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-rose-600 mb-0.5">
            DANGER ZONE
          </div>
          <h2 className="text-lg font-extrabold text-slate-900">
            Account Management & Privacy Controls
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Permanently delete your account and erase all data or reset your learning progress.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 pt-1">
          {/* Option 1: Reset Progress */}
          <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 flex flex-col justify-between gap-4">
            <div className="space-y-1">
              <div className="font-bold text-sm text-slate-900">
                Reset Learning Progress
              </div>
              <div className="text-xs text-slate-600 leading-relaxed">
                Resets completed chapters, streak, XP, and gems back to 0, but preserves your user profile credentials and email.
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetTrigger}
              className="px-4 py-2.5 rounded-xl border border-amber-300 bg-white hover:bg-amber-100/50 text-amber-800 text-xs font-bold transition cursor-pointer self-start"
            >
              Reset Learning Progress...
            </button>
          </div>

          {/* Option 2: Delete Account Permanently */}
          <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200 flex flex-col justify-between gap-4">
            <div className="space-y-1">
              <div className="font-bold text-sm text-rose-900 flex items-center gap-1.5">
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>Delete Account & Wipe All Data</span>
              </div>
              <div className="text-xs text-rose-700 leading-relaxed">
                Permanently wipes all local storage, removes your profile, companion, sandbox code, and signs you out completely.
              </div>
            </div>

            <button
              type="button"
              onClick={handleDeleteTrigger}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm shadow-rose-600/20 active:scale-95 transition cursor-pointer self-start flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Account Permanently</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

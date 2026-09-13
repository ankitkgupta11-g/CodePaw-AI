import React, { useState, useEffect } from 'react';
import {
  UserX,
  AlertTriangle,
  X,
  Trash2,
  Lock,
  CheckCircle2,
  FileCode,
  Flame,
  Award,
  Zap,
} from 'lucide-react';
import { UserProfile } from '../types';

interface DeleteAccountModalProps {
  isOpen: boolean;
  user: UserProfile;
  onClose: () => void;
  onConfirmDelete: () => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  user,
  onClose,
  onConfirmDelete,
}) => {
  const [confirmationInput, setConfirmationInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfirmationInput('');
      setIsDeleting(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isDeleting) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen) return null;

  const isConfirmed = confirmationInput.trim() === 'DELETE';

  const handleDelete = () => {
    if (!isConfirmed || isDeleting) return;
    setIsDeleting(true);
    setTimeout(() => {
      onConfirmDelete();
    }, 400);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-account-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => !isDeleting && onClose()}
    >
      <div
        className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-rose-100 flex flex-col gap-5 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Danger Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-500 via-red-600 to-rose-700" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon + Title */}
        <div className="flex items-start gap-4 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0 shadow-xs">
            <UserX className="w-6 h-6" />
          </div>
          <div>
            <h2 id="delete-account-title" className="text-xl font-extrabold text-slate-900 tracking-tight">
              Delete Account & Wipe All Stored Data
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              This action permanently deletes <strong className="text-slate-800">{user.email}</strong> and all personal data, learning records, and code drafts stored on this browser.
            </p>
          </div>
        </div>

        {/* Stored records that will be permanently purged */}
        <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-4 space-y-2.5">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>The following items will be permanently erased:</span>
          </div>

          <ul className="text-xs text-slate-700 space-y-1.5 pl-1">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
              <span>
                <strong>Profile & Authentication:</strong> Name, email ({user.email}), user ID, and sign-in credentials.
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
              <span>
                <strong>Learning History & Badges:</strong> {user.xp} XP, {user.gems} gems, {user.streakDays}-day streak, and completed chapters.
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
              <span>
                <strong>Companion State:</strong> Companion bond levels, custom accessories, and bazaar inventory items.
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
              <span>
                <strong>Code Sandbox Drafts:</strong> All custom code, scripts, and playground templates stored in localStorage.
              </span>
            </li>
          </ul>
        </div>

        {/* Verification Input */}
        <div className="space-y-2">
          <label htmlFor="confirm-delete-input" className="block text-xs font-bold text-slate-700">
            To proceed, type <span className="text-rose-600 font-extrabold tracking-wider bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">DELETE</span> below:
          </label>
          <input
            id="confirm-delete-input"
            type="text"
            value={confirmationInput}
            onChange={(e) => setConfirmationInput(e.target.value)}
            placeholder="Type DELETE to confirm"
            disabled={isDeleting}
            autoComplete="off"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={!isConfirmed || isDeleting}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md shadow-rose-600/20 transition cursor-pointer flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Wiping Data...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Permanently Delete Account</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

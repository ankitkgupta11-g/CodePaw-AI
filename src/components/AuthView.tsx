import React, { useState } from 'react';
import {
  Zap,
  ArrowRight,
  Loader2,
  Sparkles,
  X,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Crown,
} from 'lucide-react';
import { PetAvatar } from './PetAvatar';
import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  activateInstantOwnerSession,
  isOwnerEmail,
  FIREBASE_CONSOLE_AUTH_URL,
} from '../lib/firebase';
import { UserProfile } from '../types';

interface AuthViewProps {
  initialMode?: 'signin' | 'signup';
  onSuccess: (profile: Partial<UserProfile>) => void;
  onCancel: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  initialMode = 'signin',
  onSuccess,
  onCancel,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showConsoleHelper, setShowConsoleHelper] = useState<boolean>(false);

  const isOwnerDetected = isOwnerEmail(email);

  // 1-Click Instant Owner Login once owner email is recognized
  const handleInstantOwnerLogin = async () => {
    setIsLoading(true);
    setStatusMsg('Verifying Owner & Admin Privileges (Ankit Gupta)...');
    setErrorMsg(null);
    setShowConsoleHelper(false);

    try {
      const { profile } = await activateInstantOwnerSession(email);
      setStatusMsg('Welcome back, Owner & Admin: Ankit Gupta!');
      setTimeout(() => {
        setIsLoading(false);
        onSuccess(profile);
      }, 400);
    } catch (err) {
      setIsLoading(false);
      console.error('[Instant Owner Error]', err);
      setErrorMsg('Failed to activate Owner session. Please check connection.');
    }
  };

  // Google 1-Click Popup Sign-in
  const handleGoogleAuth = async () => {
    setErrorMsg(null);
    setShowConsoleHelper(false);
    setIsLoading(true);
    setStatusMsg('Connecting with Google 1-Click Popup...');

    try {
      const result = await signInWithGoogle();

      // Gracefully handle cancelled / closed popup without crashing
      if (result.cancelled) {
        setIsLoading(false);
        setStatusMsg('');
        return;
      }

      const { profile } = result;
      setStatusMsg(
        profile.role === 'owner'
          ? 'Welcome back, Owner & Admin: Ankit Gupta!'
          : `Signed in as ${profile.name || 'Learner'}`
      );

      setTimeout(() => {
        setIsLoading(false);
        onSuccess(profile);
      }, 400);
    } catch (err: unknown) {
      setIsLoading(false);
      const fbErr = err as { code?: string; message?: string };
      console.warn('[Google Auth Error]', fbErr);

      if (
        fbErr.code === 'auth/popup-closed-by-user' ||
        fbErr.code === 'auth/cancelled-popup-request'
      ) {
        // Silently reset
        return;
      }

      setErrorMsg(fbErr.message || 'Google authentication failed. Please try again.');
    }
  };

  // Email & Password Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setShowConsoleHelper(false);

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }

    if (mode === 'signup' && !name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    setStatusMsg(mode === 'signin' ? 'Authenticating credentials...' : 'Setting up your profile...');

    try {
      if (mode === 'signin') {
        const { profile } = await signInWithEmail(email, password);
        setStatusMsg(
          profile.role === 'owner'
            ? 'Welcome back, Owner & Admin: Ankit Gupta!'
            : 'Welcome back, Learner!'
        );
        setTimeout(() => {
          setIsLoading(false);
          onSuccess(profile);
        }, 400);
      } else {
        const { profile } = await signUpWithEmail(email, password, name);
        setStatusMsg('Account created successfully!');
        setTimeout(() => {
          setIsLoading(false);
          onSuccess(profile);
        }, 400);
      }
    } catch (err: unknown) {
      setIsLoading(false);
      const fbErr = err as { code?: string; message?: string };
      console.error('[Email Auth Error]', fbErr);

      switch (fbErr.code) {
        case 'auth/operation-not-allowed':
          setShowConsoleHelper(true);
          setErrorMsg(
            'Email/Password sign-in method is currently disabled in your Firebase project.'
          );
          break;
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
          setErrorMsg('Incorrect password or credentials. Please try again.');
          break;
        case 'auth/user-not-found':
          setErrorMsg('No account found with this email. Switch to "Sign Up" to create one.');
          break;
        case 'auth/email-already-in-use':
          setErrorMsg('An account with this email already exists. Please sign in instead.');
          break;
        case 'auth/invalid-email':
          setErrorMsg('Please enter a valid email address.');
          break;
        case 'auth/weak-password':
          setErrorMsg('Password should be at least 6 characters long.');
          break;
        case 'auth/network-request-failed':
          setErrorMsg('Network connectivity issue. Please check your internet connection.');
          break;
        default:
          setErrorMsg(fbErr.message || 'Authentication error occurred. Please try again.');
      }
    }
  };

  return (
    <div
      id="auth_modal_overlay"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        id="auth_modal_card"
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-12 border border-slate-200"
      >
        {/* Close Button */}
        <button
          id="btn_auth_close"
          type="button"
          onClick={onCancel}
          aria-label="Close authentication dialog"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Brand Panel (5 Cols) */}
        <div className="hidden md:flex md:col-span-5 bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-emerald-500/30 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full bg-emerald-400/20 blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-emerald-700 shadow-sm">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                CodePaw <span className="text-emerald-200">AI</span>
              </span>
            </div>

            <p className="mt-6 text-emerald-100 text-sm leading-relaxed">
              Master coding and raise your AI companion. Level up, earn gems, and build real-world
              projects.
            </p>
          </div>

          <div className="my-auto py-6 flex flex-col items-center">
            <PetAvatar petId="rexi" size="xl" className="drop-shadow-lg" />
            <div className="mt-3 text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-400/30 text-xs font-semibold text-emerald-100">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                Companion ready to learn with you
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-emerald-200/90 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>Zero-Trust Firebase Authentication & RBAC</span>
            </div>
            <div className="text-[11px] text-emerald-200/70">
              Passwords securely hashed in Google Cloud. No secrets stored in browser code.
            </div>
          </div>
        </div>

        {/* Right Form Panel (7 Cols) */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          {/* Tabs */}
          <div className="flex items-center gap-4 border-b border-slate-200 pb-3 mb-6">
            <button
              id="tab_auth_signin"
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMsg(null);
                setShowConsoleHelper(false);
              }}
              className={`text-lg font-bold transition cursor-pointer ${
                mode === 'signin'
                  ? 'text-slate-900 border-b-2 border-emerald-600 pb-2 -mb-3'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Sign In
            </button>
            <button
              id="tab_auth_signup"
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg(null);
                setShowConsoleHelper(false);
              }}
              className={`text-lg font-bold transition cursor-pointer ${
                mode === 'signup'
                  ? 'text-slate-900 border-b-2 border-emerald-600 pb-2 -mb-3'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div
              id="auth_error_banner"
              className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex flex-col gap-2"
            >
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>

              {/* Special instructions when Email/Password is disabled in Firebase Console */}
              {showConsoleHelper && (
                <div className="mt-1 pt-2 border-t border-rose-200 text-[11px] text-rose-700 font-normal">
                  <p className="mb-1.5 font-medium">To enable Email/Password login:</p>
                  <ol className="list-decimal pl-4 space-y-0.5 mb-2">
                    <li>Open your Firebase Console: Authentication &gt; Sign-in method</li>
                    <li>Click on <strong>Email/Password</strong> and toggle <strong>Enable</strong></li>
                    <li>Click <strong>Save</strong> and return here</li>
                  </ol>
                  <a
                    href={FIREBASE_CONSOLE_AUTH_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-rose-800 hover:underline bg-rose-100/70 px-2.5 py-1 rounded-md"
                  >
                    <span>Open Firebase Console Sign-In Method</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          )}

          {isLoading ? (
            <div className="py-14 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
              <p className="font-semibold text-sm text-slate-700">{statusMsg}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Google 1-Click Popup Button */}
              <button
                id="btn_google_signin"
                type="button"
                onClick={handleGoogleAuth}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 font-bold text-sm text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition active:scale-98 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Continue with Google
              </button>

              {/* Divider */}
              <div className="relative my-3 flex items-center justify-center">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-xs text-slate-400 font-semibold uppercase">
                  or email and password
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Your Name
                    </label>
                    <input
                      id="input_auth_name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ankit Gupta"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="input_auth_email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    autoComplete="email"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium"
                  />

                  {/* 1-Click Instant Owner Login once owner's email is recognized */}
                  {isOwnerDetected && (
                    <div
                      id="owner_detected_panel"
                      className="mt-2 p-3 rounded-xl bg-amber-50/90 border border-amber-200 flex flex-col gap-2"
                    >
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                        <Crown className="w-4 h-4 text-amber-600 fill-amber-500 shrink-0" />
                        <span>Owner Account Recognized: Ankit Gupta</span>
                      </div>
                      <p className="text-[11px] text-amber-800 leading-snug">
                        Full Administrator & Owner privileges will be activated for your session.
                      </p>
                      <button
                        id="btn_instant_owner_login"
                        type="button"
                        onClick={handleInstantOwnerLogin}
                        className="w-full mt-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg shadow-sm transition active:scale-98 cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span>1-Click Instant Owner Login</span>
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <input
                    id="input_auth_password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium"
                  />
                </div>

                <button
                  id="btn_auth_submit"
                  type="submit"
                  className="w-full mt-1 flex items-center justify-center gap-2 py-3.5 px-4 font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md shadow-emerald-600/20 transition active:scale-98 cursor-pointer"
                >
                  {mode === 'signin' ? 'Sign In with Email' : 'Create CodePaw Account'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          <div className="mt-5 text-center text-xs text-slate-500">
            {mode === 'signin' ? (
              <>
                New to CodePaw?{' '}
                <button
                  id="btn_switch_to_signup"
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMsg(null);
                    setShowConsoleHelper(false);
                  }}
                  className="font-bold text-emerald-600 hover:underline cursor-pointer"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  id="btn_switch_to_signin"
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMsg(null);
                    setShowConsoleHelper(false);
                  }}
                  className="font-bold text-emerald-600 hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

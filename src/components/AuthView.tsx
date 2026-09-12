import React, { useState } from 'react';
import { Zap, ArrowRight, Loader2, Sparkles, X } from 'lucide-react';
import { PetAvatar } from './PetAvatar';

interface AuthViewProps {
  initialMode?: 'signin' | 'signup';
  onSuccess: (email: string, name: string) => void;
  onCancel: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  initialMode = 'signin',
  onSuccess,
  onCancel,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState<string>('kajugupta1119@gmail.com');
  const [password, setPassword] = useState<string>('••••••••••••');
  const [name, setName] = useState<string>('ankit gupta');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMsg(mode === 'signin' ? 'Authenticating credentials...' : 'Setting up your profile...');

    setTimeout(() => {
      setStatusMsg('Redirecting to dashboard...');
      setTimeout(() => {
        setIsLoading(false);
        onSuccess(email, name || 'Learner');
      }, 500);
    }, 700);
  };

  const handleGoogleAuth = () => {
    setIsLoading(true);
    setStatusMsg('Connecting with Google...');
    setTimeout(() => {
      setStatusMsg('Redirecting to dashboard...');
      setTimeout(() => {
        setIsLoading(false);
        onSuccess('kajugupta1119@gmail.com', 'ankit gupta');
      }, 500);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-12 border border-slate-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Brand Panel (5 Cols) */}
        <div className="hidden md:flex md:col-span-5 bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 flex-col justify-between text-white relative overflow-hidden">
          {/* Decorative shapes */}
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

            <p className="mt-8 text-emerald-100 text-sm leading-relaxed">
              Embark on an educational journey. Learn, practice, and level up with your companion companion.
            </p>
          </div>

          <div className="my-auto py-6 flex flex-col items-center">
            <PetAvatar petId="rexi" size="xl" className="drop-shadow-lg" />
            <div className="mt-3 text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-400/30 text-xs font-semibold text-emerald-100">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                Rexi is eager to study with you!
              </span>
            </div>
          </div>

          <div className="text-xs text-emerald-200/80">
            Join thousands mastering AI, Machine Learning, and Coding fundamentals.
          </div>
        </div>

        {/* Right Form Panel (7 Cols) */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          {/* Tabs */}
          <div className="flex items-center gap-4 border-b border-slate-200 pb-3 mb-6">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`text-lg font-bold transition cursor-pointer ${
                mode === 'signin'
                  ? 'text-slate-900 border-b-2 border-emerald-600 pb-2 -mb-3'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`text-lg font-bold transition cursor-pointer ${
                mode === 'signup'
                  ? 'text-slate-900 border-b-2 border-emerald-600 pb-2 -mb-3'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Sign Up
            </button>
          </div>

          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
              <p className="font-semibold text-sm text-slate-700">{statusMsg}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your Name
                  </label>
                  <input
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
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 px-4 font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md shadow-emerald-600/20 transition active:scale-95 cursor-pointer"
              >
                {mode === 'signin' ? 'Sign In with Email' : 'Create CodePaw Account'}
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Divider */}
              <div className="relative my-4 flex items-center justify-center">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-xs text-slate-400 font-semibold uppercase">
                  or
                </span>
              </div>

              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 font-bold text-sm text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-sm transition active:scale-95 cursor-pointer"
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
            </form>
          )}

          <div className="mt-6 text-center text-xs text-slate-500">
            {mode === 'signin' ? (
              <>
                New to CodePaw?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="font-bold text-emerald-600 hover:underline cursor-pointer"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signin')}
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

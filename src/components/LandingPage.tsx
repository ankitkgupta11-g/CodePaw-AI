import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Zap,
  CheckCircle2,
  Heart,
  ChevronDown,
  ChevronUp,
  Flame,
  BookOpen,
  Award,
  Users,
  Shield,
  Star,
} from 'lucide-react';
import { COMPANIONS } from '../data/companions';
import { PetAvatar } from './PetAvatar';
import { PetId } from '../types';

interface LandingPageProps {
  onSignIn: () => void;
  onSignUp: () => void;
  onExploreCourses: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSignIn,
  onSignUp,
  onExploreCourses,
}) => {
  // Hero Pet Evolution Simulator State
  const [heroPetEvolved, setHeroPetEvolved] = useState<boolean>(false);

  // Selected companion in the interactive companions showcase
  const [selectedPetId, setSelectedPetId] = useState<PetId>('byte');
  const [companionEvolvedPreview, setCompanionEvolvedPreview] = useState<boolean>(false);

  // Pricing switch
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  // FAQ accordion state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const selectedCompanion =
    COMPANIONS.find((p) => p.id === selectedPetId) || COMPANIONS[0];

  const FAQS = [
    {
      q: 'How does the AI Companion evolve?',
      a: 'Your companion levels up as you complete chapters, maintain your daily learning streaks, and pass quiz challenges. At key milestones (e.g. Level 5 or spending earned gems), your companion evolves into an advanced cyber form with unique visual armor and effects!',
    },
    {
      q: 'Can I change my companion later?',
      a: 'Yes! You can switch your active companion at any time from your Profile settings without losing your earned XP, streaks, or course progress.',
    },
    {
      q: 'Are the courses interactive?',
      a: 'Absolutely. Every chapter features bite-sized concept breakdowns, interactive code snippets, and knowledge checks with immediate feedback, sound effects, and confetti celebrations.',
    },
    {
      q: 'What is included in the Free tier?',
      a: 'The Free tier grants access to all foundation chapters across AI Fundamentals and Prompt Engineering, daily streak tracking, companion adoption, and leaderboard participation.',
    },
    {
      q: 'Can I cancel my CodePaw Plus subscription anytime?',
      a: 'Yes, subscriptions can be cancelled or modified anytime through the billing portal with zero lock-in or cancellation fees.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f4f8f4] text-slate-900 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-emerald-100/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img
              src="/favicon.png"
              alt="CodePaw AI"
              className="w-9 h-9 rounded-xl shadow-xs object-cover"
              referrerPolicy="no-referrer"
            />
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              CodePaw <span className="text-emerald-600">AI</span>
            </span>
          </div>

          {/* Center Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-emerald-600 transition">Features</a>
            <a href="#companions" className="hover:text-emerald-600 transition">Companions</a>
            <a href="#pricing" className="hover:text-emerald-600 transition">Pricing</a>
            <a href="#faq" className="hover:text-emerald-600 transition">FAQ</a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onSignIn}
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-emerald-600 transition cursor-pointer"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={onSignUp}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-95 rounded-xl shadow-sm shadow-emerald-600/20 transition cursor-pointer"
            >
              Adopt a Pet Free
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Landing Content */}
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-emerald-100/60 bg-grid-pattern">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Hero Text */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200/80 text-emerald-800 text-xs font-bold tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  NEXT-GEN GAMIFIED LEARNING
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
                  Master Tech Skills. <br />
                  <span className="text-emerald-600">Evolve Your AI</span> Companion
                </h1>

                <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                  Adopt a customizable AI pet that journeys with you. Maintain streaks, earn gems, and complete hands-on interactive courses on coding, AI, math, and design.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    type="button"
                    onClick={onSignUp}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md shadow-emerald-600/25 transition active:scale-95 cursor-pointer"
                  >
                    Adopt Your Pet Free
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={onExploreCourses}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-sm transition active:scale-95 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    Browse Courses
                  </button>
                </div>

                {/* Social Proof Stats */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-emerald-100/80 max-w-lg">
                  <div>
                    <div className="text-2xl font-extrabold text-slate-900">10K+</div>
                    <div className="text-xs font-medium text-slate-500">Active Learners</div>
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-slate-900">8</div>
                    <div className="text-xs font-medium text-slate-500">Unique Pets</div>
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-slate-900">25+</div>
                    <div className="text-xs font-medium text-slate-500">Bite-sized Chapters</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Pet Evolution Simulator */}
              <div className="lg:col-span-5">
                <div className="relative bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xl shadow-emerald-500/5">
                  {/* Traffic Dots & Card Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-400" />
                      <span className="w-3 h-3 rounded-full bg-amber-400" />
                      <span className="w-3 h-3 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Pet Evolution Simulator
                    </span>
                  </div>

                  {/* Pet Display Window */}
                  <div className="relative flex flex-col items-center justify-center py-6 bg-emerald-50/50 rounded-2xl border border-emerald-100/60 mb-6">
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white text-[11px] font-bold text-slate-600 border border-slate-200">
                      {heroPetEvolved ? 'Form: Evolved Cyber Titan' : 'Form: Base Pup'}
                    </div>

                    <PetAvatar
                      petId="byte"
                      isEvolved={heroPetEvolved}
                      size="hero"
                      className="transition-transform duration-500"
                    />

                    <div className="mt-4 text-center">
                      <h3 className="font-bold text-lg text-slate-900">Byte the Cyber Pup</h3>
                      <p className="text-xs text-slate-500 max-w-xs mt-1">
                        {heroPetEvolved
                          ? 'Empowered with neural armor and holographic visor! Ready for advanced systems.'
                          : 'Learning basic data types and simple operations. Feed him correct answers to level up!'}
                      </p>
                    </div>
                  </div>

                  {/* Simulator Controls */}
                  <button
                    type="button"
                    onClick={() => setHeroPetEvolved(!heroPetEvolved)}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-500 active:scale-95 rounded-xl shadow-md shadow-emerald-600/20 transition cursor-pointer"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    {heroPetEvolved ? 'Reset to Base Form' : '⚡ Evolve Pet (Spend 100 Gems)'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="features" className="py-20 bg-white border-b border-emerald-100/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                HOW IT WORKS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Learning is better with a companion
              </h2>
              <p className="text-slate-600">
                Turn daunting tech topics into an exciting adventure where every quiz feeds your pet and powers up your portfolio.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-[#f8faf8] rounded-2xl p-6 border border-emerald-100/80 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-extrabold text-lg">
                  01
                </div>
                <h3 className="font-bold text-xl text-slate-900">Adopt Your AI Pet</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Choose from 8 distinct companions like Rexi the Data Dino or Byte the Cyber Pup. Each pet specializes in particular tracks.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-[#f8faf8] rounded-2xl p-6 border border-emerald-100/80 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-extrabold text-lg">
                  02
                </div>
                <h3 className="font-bold text-xl text-slate-900">Solve Interactive Quests</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Complete bite-sized chapters covering Artificial Intelligence, Prompt Engineering, Data Science, and Python logic.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-[#f8faf8] rounded-2xl p-6 border border-emerald-100/80 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-extrabold text-lg">
                  03
                </div>
                <h3 className="font-bold text-xl text-slate-900">Unlock Evolution Stages</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Earn gems, build 7-day study streaks, and watch your companion evolve with cyber armor, holographic goggles, and titles.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* THE 8 COMPANIONS SHOWCASE */}
        <section id="companions" className="py-20 bg-[#f4f8f4] border-b border-emerald-100/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                THE COMPANIONS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Choose your partner in learning
              </h2>
              <p className="text-slate-600">
                Meet the 8 official CodePaw buddies. Every companion has unique traits and evolution stages.
              </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Pet Selection List (Left 5 Cols) */}
              <div className="lg:col-span-5 grid grid-cols-2 gap-3">
                {COMPANIONS.map((companion) => {
                  const isSelected = companion.id === selectedPetId;
                  return (
                    <button
                      key={companion.id}
                      type="button"
                      onClick={() => {
                        setSelectedPetId(companion.id);
                        setCompanionEvolvedPreview(false);
                      }}
                      className={`flex items-center gap-3 p-3 rounded-2xl text-left transition border cursor-pointer ${
                        isSelected
                          ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                          : 'bg-white/80 hover:bg-white border-slate-200/80'
                      }`}
                    >
                      <PetAvatar petId={companion.id} size="sm" />
                      <div className="min-w-0">
                        <div className="font-bold text-sm text-slate-900 truncate">
                          {companion.name}
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          {companion.tagline}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Pet Detail Card (Right 7 Cols) */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-lg">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-extrabold text-slate-900">
                        {selectedCompanion.name}
                      </h3>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {selectedCompanion.tagline}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {selectedCompanion.personality}
                    </p>
                  </div>

                  {/* Base vs Evolved Form Toggle */}
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setCompanionEvolvedPreview(false)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        !companionEvolvedPreview
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      Base Form
                    </button>
                    <button
                      type="button"
                      onClick={() => setCompanionEvolvedPreview(true)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        companionEvolvedPreview
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      Evolved Form ⚡
                    </button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 items-center py-6">
                  <div className="flex items-center justify-center p-6 bg-emerald-50/40 rounded-2xl border border-emerald-100/50">
                    <PetAvatar
                      petId={selectedCompanion.id}
                      isEvolved={companionEvolvedPreview}
                      size="xl"
                    />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        About Companion
                      </span>
                      <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                        {selectedCompanion.description}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Specialized Courses
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {selectedCompanion.specializedCourses.map((track) => (
                          <span
                            key={track}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/60"
                          >
                            {track}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={onSignUp}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md shadow-emerald-600/20 transition cursor-pointer"
                    >
                      Adopt {selectedCompanion.name} Now
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section id="pricing" className="py-20 bg-white border-b border-emerald-100/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                SIMPLE PRICING
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Choose the learning speed that fits you
              </h2>
              <p className="text-slate-600">
                Start completely free with essential chapters or unlock the entire catalog with CodePaw Plus.
              </p>

              {/* Monthly / Yearly Switch */}
              <div className="flex items-center justify-center gap-3 pt-4">
                <span className={`text-sm font-semibold ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-500'}`}>
                  Monthly
                </span>
                <button
                  type="button"
                  onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                  className="w-14 h-8 flex items-center bg-slate-200 rounded-full p-1 cursor-pointer transition"
                >
                  <div
                    className={`bg-emerald-600 w-6 h-6 rounded-full shadow-md transform transition ${
                      billingCycle === 'yearly' ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${billingCycle === 'yearly' ? 'text-slate-900' : 'text-slate-500'}`}>
                    Yearly
                  </span>
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800">
                    SAVE 30%
                  </span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Free Plan */}
              <div className="bg-[#f8faf8] rounded-3xl p-8 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-extrabold text-slate-900">Free Tier</h3>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-700">
                      Forever Free
                    </span>
                  </div>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-slate-900">$0</span>
                    <span className="text-sm font-medium text-slate-500">/ forever</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">
                    Ideal for exploring gamified learning and building initial study habits.
                  </p>

                  <ul className="mt-8 space-y-3.5 text-sm text-slate-700">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      1 AI Companion adoption (Base Form)
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      Access to all beginner chapters
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      Daily streak & gem wallet
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      Global leaderboard participation
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={onSignUp}
                  className="mt-8 w-full py-3 px-4 rounded-xl font-bold text-sm text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-sm transition cursor-pointer"
                >
                  Start Free
                </button>
              </div>

              {/* Plus Plan */}
              <div className="bg-white rounded-3xl p-8 border-2 border-emerald-500 shadow-xl shadow-emerald-600/10 relative flex flex-col justify-between">
                <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider">
                  Most Popular
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-extrabold text-slate-900">CodePaw Plus</h3>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      Pro Access
                    </span>
                  </div>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-slate-900">
                      {billingCycle === 'yearly' ? '$4.16' : '$5.99'}
                    </span>
                    <span className="text-sm font-medium text-slate-500">
                      / month {billingCycle === 'yearly' ? '(billed $49.99 annually)' : ''}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">
                    Complete access to every course, evolution stage, and advanced chapters.
                  </p>

                  <ul className="mt-8 space-y-3.5 text-sm text-slate-700">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      Unlock all 8 companions & cyber evolutions
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      Full access to all locked & freemium chapters
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      Infinite heart refills for error-free learning
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      Custom verified completion certificates
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      Priority access to new AI & coding tracks
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={onSignUp}
                  className="mt-8 w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition cursor-pointer"
                >
                  Upgrade to CodePaw Plus
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-20 bg-[#f4f8f4] border-b border-emerald-100/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                TESTIMONIALS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Loved by junior engineers & designers
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-2xl border border-emerald-100/80 shadow-sm space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 italic">
                  "Having Rexi the Data Dino cheer me on kept me motivated to finish AI Fundamentals in a single weekend. The bite-sized format is unmatched."
                </p>
                <div className="pt-2 border-t border-slate-100">
                  <div className="font-bold text-sm text-slate-900">Sarah Lin</div>
                  <div className="text-xs text-slate-500">Junior Frontend Engineer</div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-emerald-100/80 shadow-sm space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 italic">
                  "The Prompt Engineering course helped me structure real production prompts for our design team. Plus, Byte looks awesome in his evolved form!"
                </p>
                <div className="pt-2 border-t border-slate-100">
                  <div className="font-bold text-sm text-slate-900">Marcus K.</div>
                  <div className="text-xs text-slate-500">Product Designer</div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-emerald-100/80 shadow-sm space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 italic">
                  "The daily streaks and leaderboard kept my competitive side hooked. It feels like Duolingo but tailored specifically for tech skills."
                </p>
                <div className="pt-2 border-t border-slate-100">
                  <div className="font-bold text-sm text-slate-900">Devon Brooks</div>
                  <div className="text-xs text-slate-500">Computer Science Student</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section id="faq" className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-8">
            <div className="text-center mb-12 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                GOT QUESTIONS?
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {FAQS.map((faq, idx) => {
                const isOpen = expandedFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-2xl overflow-hidden transition"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-900 hover:bg-slate-50 transition cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="p-5 pt-0 text-sm text-slate-600 leading-relaxed bg-white">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-emerald-100/80 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <img
              src="/favicon.png"
              alt="CodePaw AI"
              className="w-8 h-8 rounded-xl shadow-xs object-cover"
              referrerPolicy="no-referrer"
            />
            <span className="font-extrabold text-lg text-slate-900">
              CodePaw <span className="text-emerald-600">AI</span>
            </span>
          </div>

          <p className="text-xs text-slate-500 text-center sm:text-left">
            © 2026 CodePaw AI. All rights reserved. Learn to Code. Raise Your Companion. Level Up.
          </p>

          <div className="flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#" className="hover:text-emerald-600">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-600">Terms of Service</a>
            <a href="#" className="hover:text-emerald-600">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

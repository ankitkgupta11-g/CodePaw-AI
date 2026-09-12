import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { UserProfile } from '../types';

interface BillingViewProps {
  user: UserProfile;
  onUpdatePlan: (plan: 'free' | 'monthly' | 'yearly') => void;
}

export const BillingView: React.FC<BillingViewProps> = ({
  user,
  onUpdatePlan,
}) => {
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSelectPlan = (plan: 'monthly' | 'yearly') => {
    onUpdatePlan(plan);
    setSuccessMsg(
      plan === 'monthly'
        ? 'Successfully subscribed to CodePaw Plus Monthly!'
        : 'Successfully subscribed to CodePaw Plus Yearly (Best Value)!'
    );
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 mb-1">
            BILLING
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Subscription & billing
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-xl">
            Subscribe with Stripe, unlock paid and freemium content, and manage your plan through the customer portal.
          </p>
        </div>

        {/* Current status pill box */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs text-xs space-y-1 self-start md:self-auto">
          <span className="font-extrabold text-slate-400 uppercase tracking-wider">
            Current Status
          </span>
          <div className="font-extrabold text-emerald-700 text-sm flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {user.subscriptionPlan === 'free' ? 'Free Tier' : `CodePaw Plus (${user.subscriptionPlan})`}
          </div>
          <div className="text-slate-400 text-[11px]">
            {user.subscriptionPlan === 'free'
              ? 'No active renewal date yet.'
              : 'Renews automatically on next cycle.'}
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 2 Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Monthly Card */}
        <div
          className={`bg-white rounded-3xl p-8 border transition flex flex-col justify-between ${
            user.subscriptionPlan === 'monthly'
              ? 'border-2 border-emerald-600 shadow-lg'
              : 'border-slate-200/80 shadow-xs'
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Monthly
              </span>
              {user.subscriptionPlan === 'monthly' && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  Current Plan
                </span>
              )}
            </div>

            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-900">$5.99</span>
              <span className="text-sm font-medium text-slate-500">/ month</span>
            </div>

            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Flexible monthly access for all paid and locked freemium chapters.
            </p>

            <ul className="mt-8 space-y-3 text-xs text-slate-700">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                Unlock all 8 companion cyber evolution stages
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                Access all locked chapters across AI & Code tracks
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                Refill hearts anytime with instant recovery
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                Cancel anytime with 1 click
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => handleSelectPlan('monthly')}
            className={`mt-8 w-full py-3 px-4 rounded-xl font-bold text-xs transition cursor-pointer ${
              user.subscriptionPlan === 'monthly'
                ? 'bg-slate-100 text-slate-600 cursor-default'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
            }`}
          >
            {user.subscriptionPlan === 'monthly' ? 'Current Plan' : 'Choose Monthly'}
          </button>
        </div>

        {/* Yearly Card */}
        <div
          className={`bg-white rounded-3xl p-8 border-2 transition relative flex flex-col justify-between ${
            user.subscriptionPlan === 'yearly'
              ? 'border-emerald-600 shadow-lg'
              : 'border-emerald-500/80 shadow-md shadow-emerald-500/5'
          }`}
        >
          <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-bold uppercase tracking-wider">
            Best Value (Save 30%)
          </div>

          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
                Yearly
              </span>
              {user.subscriptionPlan === 'yearly' && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  Current Plan
                </span>
              )}
            </div>

            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-900">$49.99</span>
              <span className="text-sm font-medium text-slate-500">/ year</span>
            </div>

            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Best value annual access for the full CodePaw learning catalog.
            </p>

            <ul className="mt-8 space-y-3 text-xs text-slate-700">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                All monthly benefits included
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                Official CodePaw Verified Certificates
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                Permanent +15% Gem Multiplier on quests
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                Exclusive discord learner community pass
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => handleSelectPlan('yearly')}
            className={`mt-8 w-full py-3 px-4 rounded-xl font-bold text-xs transition cursor-pointer ${
              user.subscriptionPlan === 'yearly'
                ? 'bg-slate-100 text-slate-600 cursor-default'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
            }`}
          >
            {user.subscriptionPlan === 'yearly' ? 'Current Plan' : 'Choose Yearly'}
          </button>
        </div>
      </div>

      {/* Customer Portal Bottom Notice */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="space-y-1 text-center sm:text-left">
          <div className="font-bold text-slate-800">Customer Portal</div>
          <div className="text-slate-500">
            Latest payment status: {user.subscriptionPlan === 'free' ? 'not available yet' : 'Active and verified'}.
          </div>
        </div>

        <button
          type="button"
          onClick={() => alert('Opening Stripe customer portal for payment and invoice management...')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
        >
          <span>Manage in customer portal</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

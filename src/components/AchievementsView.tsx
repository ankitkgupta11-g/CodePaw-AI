import React from 'react';
import {
  Flame,
  Award,
  Heart,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  Shield,
} from 'lucide-react';
import { UserProfile, LeaderboardUser } from '../types';
import { LEADERBOARD_USERS } from '../data/leaderboard';

interface AchievementsViewProps {
  user: UserProfile;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({ user }) => {
  // Sync the current user row with live state
  const leaderboardData: LeaderboardUser[] = LEADERBOARD_USERS.map((entry) => {
    if (entry.isCurrentUser) {
      return {
        ...entry,
        name: `You (${user.name})`,
        gems: user.gems,
        gemsDelta: user.gems,
        hearts: user.hearts,
      };
    }
    return entry;
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header section */}
      <div>
        <div className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 mb-1">
          ACHIEVEMENTS
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Track your progress, rewards, and ranking. ✨
          </h1>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 self-start sm:self-auto">
            Updated today
          </span>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Longest Streak */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Longest Streak
            </span>
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {user.streakDays}
          </div>
          <p className="text-[11px] text-slate-400">Keep it up! you're on fire!</p>
        </div>

        {/* Card 2: Total Gems */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Gems
            </span>
            <span className="text-base">💎</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {user.gems} gems
          </div>
          <p className="text-[11px] text-slate-400">Keep learning, earn more!</p>
        </div>

        {/* Card 3: Hearts / Hints */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Hearts / Hints
            </span>
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {user.hearts}
          </div>
          <p className="text-[11px] text-slate-400">Use hearts to keep going!</p>
        </div>

        {/* Card 4: Current Rank */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Current Rank
            </span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
            #4
          </div>
          <p className="text-[11px] text-slate-400">Climb the board</p>
        </div>
      </div>

      {/* Top 10 Leaderboard Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-extrabold text-slate-900">
              Top 10 Leaderboard
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Global Rankings
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-400 uppercase text-[11px] font-extrabold tracking-wider">
              <tr>
                <th className="py-3.5 px-6">Rank</th>
                <th className="py-3.5 px-6">User</th>
                <th className="py-3.5 px-6 text-center">Gems</th>
                <th className="py-3.5 px-6 text-right">Hearts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leaderboardData.map((item, idx) => {
                const isYou = item.isCurrentUser;

                return (
                  <tr
                    key={item.id + idx}
                    className={`transition ${
                      isYou
                        ? 'bg-emerald-50/90 font-bold border-l-4 border-l-emerald-600'
                        : 'hover:bg-slate-50/60'
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-3.5 px-6">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-extrabold ${
                          item.rank === 1
                            ? 'bg-amber-100 text-amber-800'
                            : item.rank === 2
                            ? 'bg-slate-200 text-slate-700'
                            : item.rank === 3
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'text-slate-500'
                        }`}
                      >
                        #{item.rank}
                      </span>
                    </td>

                    {/* User Avatar + Name */}
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs ${item.avatarBgColor}`}
                        >
                          {item.avatarInitials}
                        </div>
                        <div>
                          <div
                            className={`text-sm font-bold ${
                              isYou ? 'text-emerald-900' : 'text-slate-900'
                            }`}
                          >
                            {item.name}
                          </div>
                          <div
                            className={`text-[11px] ${
                              isYou ? 'text-emerald-700 font-medium' : 'text-slate-400'
                            }`}
                          >
                            {item.role}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Gems */}
                    <td className="py-3.5 px-6 text-center">
                      <div className="inline-flex items-center gap-1 font-bold text-slate-800">
                        <span className="text-xs">💎</span>
                        <span>{item.gems}</span>
                        {item.gemsDelta > 0 && (
                          <span className="text-[10px] text-emerald-600 font-semibold ml-1">
                            +{item.gemsDelta}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Hearts */}
                    <td className="py-3.5 px-6 text-right">
                      <div className="inline-flex items-center gap-1 font-bold text-slate-700">
                        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                        <span>{item.hearts}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Encouragement Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white flex items-center justify-between gap-4 shadow-md shadow-emerald-600/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base">
              Climb the ranks and earn amazing rewards! 🚀
            </h3>
            <p className="text-xs text-emerald-100 mt-0.5">
              Complete more chapters every day to boost your rank on the global leaderboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

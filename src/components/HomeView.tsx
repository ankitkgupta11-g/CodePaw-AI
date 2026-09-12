import React from 'react';
import {
  ArrowRight,
  Flame,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { UserProfile, Course, MainAppView } from '../types';
import { PetAvatar } from './PetAvatar';
import { COMPANIONS_BY_ID } from '../data/companions';

interface HomeViewProps {
  user: UserProfile;
  courses: Course[];
  onSelectCourse: (courseId: string) => void;
  onNavigate: (view: MainAppView) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  user,
  courses,
  onSelectCourse,
  onNavigate,
}) => {
  const activePet = COMPANIONS_BY_ID[user.activePetId] || COMPANIONS_BY_ID.rexi;

  const DAYS = [
    { label: 'S', active: user.weeklyProgress.sun },
    { label: 'M', active: user.weeklyProgress.mon },
    { label: 'T', active: user.weeklyProgress.tue },
    { label: 'W', active: user.weeklyProgress.wed },
    { label: 'T', active: user.weeklyProgress.thu },
    { label: 'F', active: user.weeklyProgress.fri },
    { label: 'S', active: user.weeklyProgress.sat },
  ];

  const activeDaysCount = Object.values(user.weeklyProgress).filter(Boolean).length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Top Greeting Hero Banner */}
      <div className="relative bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100/90 shadow-sm overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            AI COMPANION LAB
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Good Morning, {user.name}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-md">
            Let's learn something amazing today.
          </p>
        </div>

        {/* Pet Display Window on right */}
        <div className="relative flex items-center justify-center p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100/80">
          <PetAvatar petId={user.activePetId} size="lg" />
          <div className="absolute -bottom-2.5 px-3 py-0.5 rounded-full bg-white border border-emerald-200 text-[11px] font-bold text-emerald-800 shadow-xs">
            {activePet.name} ({activePet.tagline})
          </div>
        </div>
      </div>

      {/* 2-Column Stats / Progress Trackers */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Daily Streak Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-extrabold text-base text-slate-900">
              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                <Flame className="w-4 h-4 fill-current" />
              </div>
              <span>Daily Streak</span>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
              {user.streakDays} Day Streak
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            A day counts toward your streak after you make progress in a course.
          </p>

          <div className="pt-2">
            <div className="text-xs font-bold text-slate-700 mb-3">
              {activeDaysCount} days completed this week
            </div>
            <div className="flex items-center justify-between gap-2">
              {DAYS.map((day, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition ${
                      day.active
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-400 border border-slate-200/60'
                    }`}
                  >
                    {day.active ? <CheckCircle2 className="w-4 h-4" /> : day.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Continue Learning Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 font-extrabold text-base text-slate-900 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                <BookOpen className="w-4 h-4" />
              </div>
              <span>Start learning your first course</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mt-2">
              Enroll in an AI Course to unlock guided chapters, track progress, and keep your learning streak moving.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('courses')}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm transition active:scale-95 cursor-pointer"
          >
            Explore All AI Courses
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* RECOMMENDED FOR YOU */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Recommended For You
          </h2>
          <p className="text-xs text-slate-500">
            Short, practical AI Courses chosen to keep your momentum up.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-emerald-500/50 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {course.level}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                    <Clock className="w-3 h-3" />
                    {course.durationMinutes} min
                  </span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-base mb-1">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {course.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onSelectCourse(course.id)}
                className="mt-5 w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 transition cursor-pointer"
              >
                <span>Explore Course</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

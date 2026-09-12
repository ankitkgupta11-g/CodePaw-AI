import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  Clock,
  ArrowRight,
  Flame,
  CheckCircle2,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { Course, UserProfile, MainAppView } from '../types';
import { PetAvatar } from './PetAvatar';
import { COMPANIONS_BY_ID } from '../data/companions';

interface CoursesViewProps {
  courses: Course[];
  user: UserProfile;
  onSelectCourse: (courseId: string) => void;
  onNavigate: (view: MainAppView) => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({
  courses,
  user,
  onSelectCourse,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [levelFilter, setLevelFilter] = useState<string>('all');

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

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel =
      levelFilter === 'all' || c.level.toLowerCase() === levelFilter.toLowerCase();
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header section */}
      <div>
        <div className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 mb-1">
          COURSE LIBRARY
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Explore Courses
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Choose a path and keep building your AI skills with live course data from Strapi.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search courses by title or description..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Main layout: Course Cards Grid + Right Sidebar Widgets */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Course Cards Grid (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            {filteredCourses.map((course) => {
              const completedInCourse = course.chapters.filter((ch) =>
                user.completedChapterIds.includes(ch.id)
              ).length;
              const percent = Math.round(
                (completedInCourse / (course.chapters.length || 1)) * 100
              );

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-emerald-400 hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    {/* Top Tag & Duration */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {course.level}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        {course.durationMinutes} min
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-lg mb-2">
                      {course.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">
                      {course.description}
                    </p>

                    {/* Progress Bar if enrolled */}
                    {percent > 0 && (
                      <div className="space-y-1 mb-4">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                          <span>Progress</span>
                          <span>{percent}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectCourse(course.id)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm transition active:scale-95 cursor-pointer"
                  >
                    <span>{percent > 0 ? 'Continue' : 'Start'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar Widgets (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Weekly Streak Widget */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-extrabold text-sm text-slate-900">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                <span>Weekly Streak</span>
              </div>
              <span className="text-xs font-bold text-orange-600">
                {user.streakDays} days
              </span>
            </div>

            <p className="text-[11px] text-slate-500">
              Active days this week based on saved course progress.
            </p>

            <div className="flex items-center justify-between pt-1">
              {DAYS.map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold ${
                      day.active
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {day.active ? <CheckCircle2 className="w-3.5 h-3.5" /> : day.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Keep Going Widget with Pet */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4 text-center">
            <div className="font-extrabold text-sm text-slate-900">
              Keep Going
            </div>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Pick up where you left off and keep your learning momentum moving.
            </p>

            <div className="py-2 flex justify-center">
              <PetAvatar petId={user.activePetId} size="lg" />
            </div>

            <button
              type="button"
              onClick={() => onNavigate('progress')}
              className="w-full py-2 px-3 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-center gap-1 transition cursor-pointer"
            >
              Go to Progress
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

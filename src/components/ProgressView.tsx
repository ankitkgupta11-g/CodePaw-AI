import React from 'react';
import {
  TrendingUp,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';
import { UserProfile, Course, MainAppView } from '../types';

interface ProgressViewProps {
  user: UserProfile;
  courses: Course[];
  onSelectCourse: (courseId: string) => void;
  onNavigate: (view: MainAppView) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  user,
  courses,
  onSelectCourse,
  onNavigate,
}) => {
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

  const enrolledCourses = courses.filter((c) =>
    user.enrolledCourseIds.includes(c.id)
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header section */}
      <div>
        <div className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 mb-1">
          PROGRESS
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {user.name} learning progress
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          This page reflects your saved course progress and weekly learning activity.
        </p>
      </div>

      {/* Top 2 Summary Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Active Days Widget */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Active Days This Week
            </span>
            <span className="text-sm font-extrabold text-emerald-700">
              {activeDaysCount} / 7 Days
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 pt-2">
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

        {/* Tracked Courses Widget */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Tracked Courses
            </span>
            <div className="text-3xl font-extrabold text-slate-900">
              {enrolledCourses.length}
            </div>
            <p className="text-xs text-slate-500">
              Actively enrolled in guided curriculums
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('courses')}
            className="px-4 py-2.5 rounded-xl font-bold text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition cursor-pointer"
          >
            Browse Courses
          </button>
        </div>
      </div>

      {/* Enrolled Courses List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900">
            ENROLLED COURSES: Keep going where you left off
          </h2>
        </div>

        {enrolledCourses.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200 space-y-4">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-base text-slate-800">
              No enrolled courses yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Start a course from the library to track your syllabus, save chapter milestones, and level up your companion!
            </p>
            <button
              type="button"
              onClick={() => onNavigate('courses')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-500 transition cursor-pointer"
            >
              Browse Courses
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {enrolledCourses.map((course) => {
              const completedCount = course.chapters.filter((ch) =>
                user.completedChapterIds.includes(ch.id)
              ).length;
              const percent = Math.round(
                (completedCount / (course.chapters.length || 1)) * 100
              );

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {course.level}
                      </span>
                      <span className="text-xs text-slate-400">
                        {course.durationMinutes} mins
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-lg">
                      {course.title}
                    </h3>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 max-w-md">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                        <span>
                          {completedCount} of {course.chapters.length} chapters
                        </span>
                        <span className="text-emerald-700">{percent}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectCourse(course.id)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm transition active:scale-95 cursor-pointer self-start sm:self-auto"
                  >
                    <span>Resume Course</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

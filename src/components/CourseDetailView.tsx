import React from 'react';
import {
  ArrowLeft,
  Clock,
  Play,
  Lock,
  CheckCircle2,
  Sparkles,
  Info,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { Course, Chapter, UserProfile, MainAppView } from '../types';

interface CourseDetailViewProps {
  course: Course;
  user: UserProfile;
  onBack: () => void;
  onOpenChapter: (chapter: Chapter) => void;
  onUpgrade: () => void;
}

export const CourseDetailView: React.FC<CourseDetailViewProps> = ({
  course,
  user,
  onBack,
  onOpenChapter,
  onUpgrade,
}) => {
  const completedChaptersCount = course.chapters.filter((ch) =>
    user.completedChapterIds.includes(ch.id)
  ).length;

  const totalChapters = course.chapters.length;
  const progressPercent = Math.round((completedChaptersCount / (totalChapters || 1)) * 100);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Back Button */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to courses
      </button>

      {/* Course Hero Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {course.level}
              </span>
              {course.isFreemium && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  Freemium
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {course.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 pt-1">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                {course.durationMinutes} minutes
              </span>
              <span>•</span>
              <span>Course slug: {course.slug}</span>
              <span>•</span>
              <span>{totalChapters} guided chapters</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenChapter(course.chapters[0])}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 active:scale-95 transition cursor-pointer self-start sm:self-auto"
          >
            <Play className="w-4 h-4 fill-current" />
            {progressPercent > 0 ? 'Resume Course' : 'Start Course (Enroll)'}
          </button>
        </div>

        {/* Freemium Upgrade Notice banner if applicable */}
        {course.isFreemium && user.subscriptionPlan === 'free' && (
          <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs">
            <div className="flex items-center gap-2.5">
              <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Upgrade to unlock all chapters in this freemium course.</span>
            </div>
            <button
              type="button"
              onClick={onUpgrade}
              className="font-bold underline text-amber-800 hover:text-amber-950 cursor-pointer"
            >
              Upgrade to Pro
            </button>
          </div>
        )}

        {/* Course Progress bar */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
            <span>Overall Progress</span>
            <span className="text-emerald-600">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Course Chapters Syllabus */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900">Course Chapters</h2>
          <span className="text-xs font-semibold text-slate-500">
            {completedChaptersCount} of {totalChapters} completed
          </span>
        </div>

        <div className="space-y-3">
          {course.chapters.map((chapter) => {
            const isCompleted = user.completedChapterIds.includes(chapter.id);
            const isLocked =
              chapter.isLocked && user.subscriptionPlan === 'free';

            return (
              <div
                key={chapter.id}
                className={`bg-white rounded-2xl p-5 border transition flex items-center justify-between gap-4 ${
                  isLocked
                    ? 'border-slate-200/60 opacity-80'
                    : 'border-slate-200/90 hover:border-emerald-500/50 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Chapter number or status circle */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-xs flex-shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-700'
                        : isLocked
                        ? 'bg-slate-100 text-slate-400'
                        : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : isLocked ? (
                      <Lock className="w-4 h-4" />
                    ) : (
                      chapter.chapterNumber
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-base">
                        {chapter.title}
                      </h3>
                      {isCompleted && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Completed
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 max-w-xl leading-relaxed">
                      {chapter.description}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2 font-medium">
                      <span>{chapter.durationMin} mins</span>
                      <span>•</span>
                      <span>+{chapter.xpReward} XP</span>
                      <span>•</span>
                      <span>+{chapter.gemReward} Gems</span>
                    </div>
                  </div>
                </div>

                {/* Right Action */}
                <div>
                  {isLocked ? (
                    <button
                      type="button"
                      onClick={onUpgrade}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      Locked
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onOpenChapter(chapter)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <span>{isCompleted ? 'Review' : 'Start Chapter'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

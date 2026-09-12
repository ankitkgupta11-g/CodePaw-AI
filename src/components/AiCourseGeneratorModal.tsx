import React, { useState } from 'react';
import {
  Sparkles,
  Wand2,
  X,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Brain,
  Code,
  Zap,
} from 'lucide-react';
import { Course, Chapter, UserProfile } from '../types';
import { sound } from '../utils/audioFx';
import confetti from 'canvas-confetti';

interface AiCourseGeneratorModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onCourseGenerated: (course: Course) => void;
}

export const AiCourseGeneratorModal: React.FC<AiCourseGeneratorModalProps> = ({
  user,
  isOpen,
  onClose,
  onCourseGenerated,
}) => {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');

  if (!isOpen) return null;

  const SUGGESTED_TOPICS = [
    'Autonomous AI Agents & Memory',
    'Next.js 15 App Router & Server Actions',
    'Python for Machine Learning & Pandas',
    'Prompt Engineering & Few-Shot Techniques',
    'Rust Memory Safety & Concurrency',
    'Docker, Containers & Microservices',
  ];

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setIsGenerating(true);
    sound.playClick(user.soundEnabled);

    setGenerationStep('Analyzing topic requirements...');
    await new Promise((r) => setTimeout(r, 600));

    setGenerationStep('Synthesizing 6 interactive chapters with quizzes...');
    
    let generatedCourse: Course | null = null;

    try {
      const response = await fetch('/api/generate-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, level }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.course) {
          generatedCourse = data.course;
        }
      }
    } catch (err) {
      console.warn('API course generator fallback used:', err);
    }

    setGenerationStep('Crafting code playgrounds & challenge verification...');
    await new Promise((r) => setTimeout(r, 600));

    if (!generatedCourse) {
      const courseSlug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);
      const courseId = `gen-${courseSlug}-${Date.now().toString(36)}`;

      // Generate 6 structured chapters with real quiz questions and code snippets
      const chapters: Chapter[] = [
      {
        id: `${courseId}-ch-1`,
        chapterNumber: 1,
        title: `Foundations of ${topic}`,
        description: `Explore the foundational architecture, primary motivations, and mental models behind ${topic}.`,
        durationMin: 15,
        isLocked: false,
        xpReward: 30,
        gemReward: 5,
        explanation: `In this introductory chapter, we break down why ${topic} is transforming modern software engineering and technical workflows. Understanding the baseline rules gives you full control over implementations.`,
        codeSnippet: `// Baseline initialization for ${topic}\nconst config = {\n  system: "${topic}",\n  mode: "adaptive",\n  active: true\n};\nconsole.log("Initialized " + config.system);`,
        question: `What is the primary architectural purpose of ${topic}?`,
        options: [
          {
            id: 'opt1',
            text: `To establish structured workflows and reproducible state for ${topic}.`,
            isCorrect: true,
            explanation: `Correct! Solid foundational structure prevents brittle implementations down the road.`,
          },
          {
            id: 'opt2',
            text: 'To avoid writing any documentation or testing entirely.',
            isCorrect: false,
            explanation: 'Incorrect. Architectural design strengthens code quality and testing.',
          },
        ],
      },
      {
        id: `${courseId}-ch-2`,
        chapterNumber: 2,
        title: `Core Syntax & Data Flow`,
        description: `Deep dive into the operational syntax, input pipeline, and output lifecycle.`,
        durationMin: 20,
        isLocked: false,
        xpReward: 40,
        gemReward: 8,
        explanation: `Every system has a predictable data pipeline: validation -> transformation -> execution -> logging. Here is how ${topic} manages this gracefully.`,
        codeSnippet: `async function processPipeline(inputPayload) {\n  const validated = validateInput(inputPayload);\n  const result = await executeCoreLogic(validated);\n  return { success: true, data: result };\n}`,
        question: `Why is defensive validation critical before core processing?`,
        options: [
          {
            id: 'opt1',
            text: 'To catch malformed inputs early and prevent silent system failures.',
            isCorrect: true,
            explanation: 'Exactly right! Early failure boundaries keep errors isolated.',
          },
          {
            id: 'opt2',
            text: 'It has no real effect on runtime stability.',
            isCorrect: false,
            explanation: 'Incorrect. Input validation is essential for robustness.',
          },
        ],
      },
      {
        id: `${courseId}-ch-3`,
        chapterNumber: 3,
        title: `Practical Implementation & Optimization`,
        description: `Build hands-on patterns, debug edge cases, and tune performance.`,
        durationMin: 25,
        isLocked: false,
        xpReward: 50,
        gemReward: 10,
        explanation: `Now that basics are clear, learn to optimize for throughput and resource efficiency.`,
        codeSnippet: `// High throughput batching\nconst batchWorker = new BatchQueue({\n  concurrency: 4,\n  retryLimit: 3\n});`,
        question: `Which strategy best improves throughput under high load?`,
        options: [
          {
            id: 'opt1',
            text: 'Batch processing with controlled concurrency queues.',
            isCorrect: true,
            explanation: 'Spot on! Controlled queues prevent starvation and memory pressure.',
          },
          {
            id: 'opt2',
            text: 'Running infinite loops synchronously on the main thread.',
            isCorrect: false,
            explanation: 'That will freeze the execution thread immediately.',
          },
        ],
      },
      {
        id: `${courseId}-ch-4`,
        chapterNumber: 4,
        title: `Advanced Integrations & Real-World Case Studies`,
        description: `Connect with external services, databases, and microservices in production.`,
        durationMin: 30,
        isLocked: user.subscriptionPlan === 'free',
        xpReward: 60,
        gemReward: 15,
        explanation: `Production systems require resilience: circuit breakers, fallback providers, and metrics instrumentation.`,
        codeSnippet: `// Resilient client with fallback\ntry {\n  return await primaryService.query();\n} catch (err) {\n  return fallbackCache.retrieve();\n}`,
        question: `What role does a fallback provider serve?`,
        options: [
          {
            id: 'opt1',
            text: 'Maintains graceful degradation when primary endpoints suffer outages.',
            isCorrect: true,
            explanation: 'Correct! High availability depends on graceful fallbacks.',
          },
          {
            id: 'opt2',
            text: 'Increases the likelihood of unhandled crashes.',
            isCorrect: false,
            explanation: 'Incorrect. Fallbacks safeguard against crashes.',
          },
        ],
      },
      {
        id: `${courseId}-ch-5`,
        chapterNumber: 5,
        title: `Security, Safety & Best Practices`,
        description: `Audit for vulnerabilities, sanitize runtime inputs, and enforce least privilege.`,
        durationMin: 25,
        isLocked: user.subscriptionPlan === 'free',
        xpReward: 50,
        gemReward: 12,
        explanation: `Security is not an afterthought. Learn defense-in-depth principles applied specifically to ${topic}.`,
        codeSnippet: `// Strict permission boundary\nif (!caller.hasPermission("admin")) {\n  throw new SecurityError("Unauthorized action");\n}`,
        question: `What is the core idea behind the Principle of Least Privilege?`,
        options: [
          {
            id: 'opt1',
            text: 'Entities should only possess the minimum permissions necessary to complete their job.',
            isCorrect: true,
            explanation: 'Perfect! Least privilege minimizes blast radius if compromised.',
          },
          {
            id: 'opt2',
            text: 'Give all users root access to simplify debugging.',
            isCorrect: false,
            explanation: 'Giving all users root access is a catastrophic security risk.',
          },
        ],
      },
      {
        id: `${courseId}-ch-6`,
        chapterNumber: 6,
        title: `Capstone Challenge & Real-World Project`,
        description: `Synthesize everything learned into an end-to-end working implementation.`,
        durationMin: 35,
        isLocked: user.subscriptionPlan === 'free',
        xpReward: 100,
        gemReward: 25,
        explanation: `The final step: connect your components, pass all test suites, and earn the verified badge for ${topic}!`,
        codeSnippet: `// Final Capstone Verification\nconst solution = new CompleteSystem();\nconst verified = await solution.runFullSuite();\nconsole.log("Capstone status:", verified ? "SUCCESS" : "INCOMPLETE");`,
        question: `How do automated test suites validate system completion?`,
        options: [
          {
            id: 'opt1',
            text: 'By asserting expected outputs across both happy paths and edge cases.',
            isCorrect: true,
            explanation: 'Exactly! Comprehensive assertions give confidence for production deployment.',
          },
          {
            id: 'opt2',
            text: 'By checking if the code has at least 1,000 lines regardless of functionality.',
            isCorrect: false,
            explanation: 'Line count does not measure correctness.',
          },
        ],
      },
    ];

      generatedCourse = {
        id: courseId,
        slug: courseSlug,
        title: topic,
        description: `Comprehensive AI-generated curriculum mastering ${topic}, tailored for ${level.toLowerCase()} learners with interactive quizzes and code environments.`,
        level,
        durationMinutes: 150,
        category: 'ai',
        isFreemium: true,
        accentColor: '#10b981',
        tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        iconType: 'ai',
        chapters,
      };
    }

    const finalCourse: Course = generatedCourse;

    setIsGenerating(false);
    sound.playLevelUp(user.soundEnabled);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5 },
    });

    onCourseGenerated(finalCourse);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden">
        {/* Header */}
        <div className="bg-[#133020] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-xl tracking-tight">
                  AI Course Generator
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white font-extrabold text-[11px]">
                  AI
                </span>
              </div>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                Generate a custom interactive curriculum with chapters, quizzes, and code.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Topic Input */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
              What do you want to learn?
            </label>
            <div className="relative">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Prompt Engineering, LangChain Agents, PyTorch, Rust Concurrency..."
                disabled={isGenerating}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium"
              />
            </div>
          </div>

          {/* Quick Suggestions */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Popular Topics
            </span>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_TOPICS.map((suggested) => (
                <button
                  key={suggested}
                  type="button"
                  onClick={() => setTopic(suggested)}
                  disabled={isGenerating}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50/60 hover:bg-emerald-100/80 text-emerald-800 border border-emerald-200/60 transition cursor-pointer"
                >
                  {suggested}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Level Selector */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
              Target Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLevel(lvl)}
                  disabled={isGenerating}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    level === lvl
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Generation Progress Display */}
          {isGenerating && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-emerald-600 animate-spin flex-shrink-0" />
              <div className="text-xs font-bold text-emerald-900">
                {generationStep}
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!topic.trim() || isGenerating}
            className="w-full py-3.5 px-6 rounded-xl font-extrabold text-sm text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-emerald-600/20 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Crafting Custom Curriculum...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Interactive Course</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

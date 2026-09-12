import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Sparkles,
  RotateCcw,
  Copy,
  Check,
  Code2,
  Terminal,
  AlertCircle,
  HelpCircle,
  Bot,
  User,
  Zap,
  ChevronRight,
  Play,
  Lightbulb,
} from 'lucide-react';
import {
  UserProfile,
  PetState,
  ChatMessage,
  LearningContextPayload,
  SandboxLanguage,
} from '../types';
import { PetAvatar } from './PetAvatar';
import { COMPANIONS_BY_ID } from '../data/companions';
import { sound } from '../utils/audioFx';

interface CompanionChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  pet: PetState;
  learningContext?: LearningContextPayload;
  onInsertCodeToSandbox?: (code: string, language?: SandboxLanguage) => void;
  initialPrompt?: string;
  isEmbeddedView?: boolean; // When rendered inside MyCompanionView as full tab
}

const DEFAULT_WELCOME_MESSAGE = (petName: string, species: string): string =>
  `### 🐾 Hi there, friend! I'm ${petName}!\nI'm your personal coding mentor and loyal ${species}.\n\nWhenever you're stuck on a lesson, curious about **Python, HTML, CSS, or JavaScript**, or want me to debug an error with you, just ask!\n\n*What are we building or learning today?* ✨`;

export const CompanionChatDrawer: React.FC<CompanionChatDrawerProps> = ({
  isOpen,
  onClose,
  user,
  pet,
  learningContext,
  onInsertCodeToSandbox,
  initialPrompt,
  isEmbeddedView = false,
}) => {
  const activeCompanionDef = COMPANIONS_BY_ID[user.activePetId] || COMPANIONS_BY_ID.byte;
  const companionName = pet.name || activeCompanionDef.name;

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const keyNew = `codepaw_chat_${user.id}`;
    const keyOld = `skillpet_chat_${user.id}`;
    const saved = localStorage.getItem(keyNew) || localStorage.getItem(keyOld);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return [
      {
        id: 'msg-welcome',
        role: 'assistant',
        content: DEFAULT_WELCOME_MESSAGE(companionName, activeCompanionDef.speciesTitle),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [includeContextCode, setIncludeContextCode] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // If initialPrompt was passed, pre-fill or send
      if (initialPrompt && initialPrompt.trim() !== '') {
        setInputPrompt(initialPrompt);
      }
    }
  }, [isOpen, initialPrompt]);

  useEffect(() => {
    scrollToBottom();
    // Persist active chat
    try {
      localStorage.setItem(`codepaw_chat_${user.id}`, JSON.stringify(messages.slice(-30)));
    } catch {
      // storage full or disabled
    }
  }, [messages, user.id]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputPrompt).trim();
    if (!query || isLoading) return;

    sound.playClick(user.soundEnabled);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      codeSnippet: includeContextCode && learningContext?.code ? learningContext.code : undefined,
      language: learningContext?.language,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          context: {
            user: {
              name: user.name,
              level: user.level,
              xp: user.xp,
              streak: user.streakDays,
              hearts: user.hearts,
              gems: user.gems,
            },
            pet: {
              name: companionName,
              speciesTitle: activeCompanionDef.speciesTitle,
              mood: pet.mood,
              level: pet.level,
              happiness: pet.happiness,
              energy: pet.energy,
            },
            learningContext: {
              courseTitle: learningContext?.courseTitle,
              chapterTitle: learningContext?.chapterTitle,
              language: learningContext?.language || 'javascript',
              code: includeContextCode ? learningContext?.code : undefined,
              error: learningContext?.error,
              recentAction: learningContext?.recentAction,
            },
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const replyContent =
        data.reply ||
        `🐾 *${companionName} tilted head*: I'm listening! Could you rephrase your question or show me the specific line of code you'd like help with?`;

      sound.playSuccess(user.soundEnabled);

      setMessages((prev) => [
        ...prev,
        {
          id: `asst-${Date.now()}`,
          role: 'assistant',
          content: replyContent,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: unknown) {
      console.error('Companion Chat Error:', err);
      sound.playError(user.soundEnabled);

      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `### 🐾 Mentor Connection Note\n*${companionName} is right here with you!*\n\nI ran into a temporary connection hitch. Here is a quick hint for ${learningContext?.language || 'coding'}:\n\n- Check variable names and bracket matching.\n- Try testing one small statement at a time in the Code Sandbox.\n\nAsk again anytime, friend!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    sound.playClick(user.soundEnabled);
    const resetMsgs: ChatMessage[] = [
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `Chat history cleared! 🐾 What challenge shall we tackle next?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
    setMessages(resetMsgs);
    localStorage.removeItem(`codepaw_chat_${user.id}`);
    localStorage.removeItem(`skillpet_chat_${user.id}`);
  };

  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    sound.playClick(user.soundEnabled);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Render markdown text and extract code blocks cleanly
  const renderMessageContent = (content: string, msgId: string) => {
    // Basic markdown splitter for code blocks ```lang ... ```
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    let indexKey = 0;
    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Text before code block
      if (match.index > lastIndex) {
        const textChunk = content.substring(lastIndex, match.index);
        parts.push(
          <div key={`text-${msgId}-${indexKey++}`} className="whitespace-pre-wrap leading-relaxed">
            {renderFormattedText(textChunk)}
          </div>
        );
      }

      const lang = match[1] || 'code';
      const codeSnippet = match[2].trim();
      const codeBlockId = `${msgId}-code-${indexKey++}`;

      parts.push(
        <div
          key={codeBlockId}
          className="my-3 bg-slate-950 text-slate-100 rounded-2xl overflow-hidden border border-slate-800 shadow-md font-mono text-xs"
        >
          <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400">
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-emerald-400">
              <Code2 className="w-3.5 h-3.5" />
              <span>{lang}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopyCode(codeSnippet, codeBlockId)}
                className="hover:text-slate-200 flex items-center gap-1 transition cursor-pointer"
              >
                {copiedId === codeBlockId ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>{copiedId === codeBlockId ? 'Copied' : 'Copy'}</span>
              </button>

              {onInsertCodeToSandbox && (
                <button
                  type="button"
                  onClick={() => {
                    const mappedLang = (
                      ['javascript', 'html', 'css', 'python'].includes(lang.toLowerCase())
                        ? lang.toLowerCase()
                        : undefined
                    ) as SandboxLanguage | undefined;
                    onInsertCodeToSandbox(codeSnippet, mappedLang);
                    sound.playClick(user.soundEnabled);
                  }}
                  className="hover:text-emerald-300 flex items-center gap-1 transition cursor-pointer text-emerald-400 font-bold ml-2"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Send to Sandbox</span>
                </button>
              )}
            </div>
          </div>
          <pre className="p-3.5 overflow-x-auto text-emerald-300 leading-relaxed">
            <code>{codeSnippet}</code>
          </pre>
        </div>
      );

      lastIndex = codeBlockRegex.lastIndex;
    }

    if (lastIndex < content.length) {
      const remaining = content.substring(lastIndex);
      parts.push(
        <div key={`text-${msgId}-${indexKey++}`} className="whitespace-pre-wrap leading-relaxed">
          {renderFormattedText(remaining)}
        </div>
      );
    }

    return parts;
  };

  const renderFormattedText = (text: string) => {
    // Simple inline bolding & headers
    return text.split('\n').map((line, lIdx) => {
      let lineNode: React.ReactNode = line;

      if (line.startsWith('### ')) {
        return (
          <h4 key={lIdx} className="font-extrabold text-sm text-slate-900 mt-2 mb-1">
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h3 key={lIdx} className="font-extrabold text-base text-slate-900 mt-2 mb-1">
            {line.replace('## ', '')}
          </h3>
        );
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const itemText = line.substring(2);
        return (
          <div key={lIdx} className="flex items-start gap-1.5 ml-2 my-0.5">
            <span className="text-emerald-600 font-bold">•</span>
            <span>{itemText}</span>
          </div>
        );
      }

      return (
        <span key={lIdx}>
          {lineNode}
          {lIdx < text.split('\n').length - 1 && <br />}
        </span>
      );
    });
  };

  const SUGGESTED_QUESTIONS = [
    {
      label: '💡 Give me a hint for this code',
      prompt: 'Can you give me a gentle hint on how to improve or solve my current code?',
    },
    {
      label: '🔍 Explain this error simply',
      prompt: 'Can you explain the error I encountered and help me find where it comes from?',
    },
    {
      label: '🐍 Python basics checklist',
      prompt: 'What are the top 3 things a beginner should know about Python syntax?',
    },
    {
      label: '🌐 How do HTML & CSS connect?',
      prompt: 'Explain how HTML classes and CSS selectors work together with a simple example.',
    },
    {
      label: '🐾 How are you feeling today?',
      prompt: `How are you feeling today, ${companionName}? What coding quest should we conquer?`,
    },
  ];

  if (!isOpen && !isEmbeddedView) return null;

  const content = (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-emerald-50/70 to-teal-50/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-white border border-emerald-200 flex items-center justify-center p-0.5 shadow-xs">
              <PetAvatar petId={user.activePetId} size="sm" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-sm text-slate-900">{companionName}</h3>
              <span className="px-1.5 py-0.2 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                AI Mentor
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {activeCompanionDef.speciesTitle} • Lvl {pet.level || 3}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleClearHistory}
            title="Clear Chat History"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white/80 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          {!isEmbeddedView && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white/80 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Context Awareness Bar */}
      {learningContext && (learningContext.courseTitle || learningContext.code || learningContext.error) && (
        <div className="px-4 py-2 bg-emerald-50/40 border-b border-emerald-100 flex items-center justify-between text-xs text-slate-600 gap-2 overflow-x-auto">
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span className="font-bold text-slate-700 truncate">
              {learningContext.courseTitle || 'Active Context'}
            </span>
            {learningContext.chapterTitle && (
              <span className="text-slate-400 truncate">• {learningContext.chapterTitle}</span>
            )}
            {learningContext.language && (
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-white text-emerald-700 border border-emerald-200 uppercase">
                {learningContext.language}
              </span>
            )}
          </div>

          {learningContext.code && (
            <label className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 cursor-pointer flex-shrink-0">
              <input
                type="checkbox"
                checked={includeContextCode}
                onChange={(e) => setIncludeContextCode(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
              />
              <span>Attach Code</span>
            </label>
          )}
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center flex-shrink-0 p-0.5 self-start mt-0.5">
                  <PetAvatar petId={user.activePetId} size="sm" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm ${
                  isUser
                    ? 'bg-emerald-600 text-white rounded-tr-xs shadow-xs'
                    : 'bg-slate-50 text-slate-800 border border-slate-200/80 rounded-tl-xs shadow-xs'
                }`}
              >
                {/* User attached code preview */}
                {isUser && msg.codeSnippet && (
                  <div className="mb-2 p-2 bg-emerald-700/50 rounded-lg text-[11px] font-mono border border-emerald-500/40 text-emerald-100 line-clamp-3">
                    <div className="text-[9px] uppercase font-bold text-emerald-200 mb-0.5">
                      Attached {msg.language || 'Code'}:
                    </div>
                    {msg.codeSnippet}
                  </div>
                )}

                {/* Message body */}
                {renderMessageContent(msg.content, msg.id)}

                <div
                  className={`mt-1.5 text-[10px] text-right font-medium ${
                    isUser ? 'text-emerald-100/80' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 self-start mt-0.5 shadow-xs">
                  {user.avatarInitials}
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center flex-shrink-0 p-0.5 self-start animate-bounce">
              <PetAvatar petId={user.activePetId} size="sm" />
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl rounded-tl-xs p-3.5 shadow-xs flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">
                {companionName} is typing insights
              </span>
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse delay-100" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse delay-200" />
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="px-4 py-2 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto bg-slate-50/50">
        <Lightbulb className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
        {SUGGESTED_QUESTIONS.map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(chip.prompt)}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 text-slate-600 transition whitespace-nowrap cursor-pointer shadow-2xs"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Input area */}
      <div className="p-3.5 border-t border-slate-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-end gap-2"
        >
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              rows={2}
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask ${companionName} anything... (Shift+Enter for new line)`}
              disabled={isLoading}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none leading-relaxed"
            />
          </div>

          <button
            type="submit"
            disabled={!inputPrompt.trim() || isLoading}
            className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );

  if (isEmbeddedView) {
    return (
      <div className="w-full h-[640px] rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        {content}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-end transition-opacity">
      <div className="w-full max-w-lg h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {content}
      </div>
    </div>
  );
};

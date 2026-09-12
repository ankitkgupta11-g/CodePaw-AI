import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  Play,
  RotateCcw,
  Sparkles,
  Copy,
  Check,
  Code2,
  Cpu,
  Zap,
  Globe,
  Monitor,
  Tablet,
  Smartphone,
  RefreshCw,
  AlertTriangle,
  HelpCircle,
  Clock,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { UserProfile, SandboxLanguage } from '../types';
import { PetAvatar } from './PetAvatar';
import { sound } from '../utils/audioFx';
import confetti from 'canvas-confetti';
import { runPythonCode, getOrLoadPyodide } from '../utils/pyodideRunner';

interface CodeSandboxViewProps {
  user: UserProfile;
  initialLanguage?: SandboxLanguage;
  initialCode?: string;
  onAskCompanion?: (context: {
    language: SandboxLanguage;
    code: string;
    error?: string;
    prompt?: string;
  }) => void;
}

interface TemplateDef {
  title: string;
  code: string;
}

const TEMPLATES: Record<SandboxLanguage, TemplateDef[]> = {
  javascript: [
    {
      title: 'Cyber Pet Heartbeat',
      code: `// CodePaw Companion Heartbeat Simulation
class CyberPet {
  constructor(name, species) {
    this.name = name;
    this.species = species;
    this.energy = 100;
    this.happiness = 95;
    this.xp = 420;
  }

  feed(snack) {
    this.energy = Math.min(100, this.energy + 15);
    return \`Yum! \${this.name} devoured the \${snack}. Energy: \${this.energy}%\`;
  }

  codeChallenge(difficulty) {
    const gainedXp = difficulty === "Hard" ? 50 : 25;
    this.xp += gainedXp;
    this.happiness = Math.min(100, this.happiness + 20);
    return \`✨ \${this.name} conquered a \${difficulty} quest! + \${gainedXp} XP (Total: \${this.xp})\`;
  }
}

const myPet = new CyberPet("Byte", "Cyber Pup");
console.log("=== Companion Online ===");
console.log(myPet.feed("Berry Snack"));
console.log(myPet.codeChallenge("Dynamic Programming"));
console.log("Status: Pet is thriving and ready for next chapter!");`,
    },
    {
      title: 'Array Pipelines & Stats',
      code: `// Modern Array Pipelines & Analytics
const telemetryScores = [84, 92, 45, 99, 78, 88, 62, 95];

const passing = telemetryScores
  .filter(score => score >= 70)
  .map(score => ({
    raw: score,
    curved: Math.min(100, score + 5),
    grade: score >= 90 ? "A" : "B"
  }))
  .sort((a, b) => b.curved - a.curved);

console.log("Processed Learners:", passing);
console.log("Total Honors (Grade A):", passing.filter(p => p.grade === "A").length);
console.log("Average Curved Score:", (passing.reduce((acc, c) => acc + c.curved, 0) / passing.length).toFixed(1));`,
    },
    {
      title: 'Fibonacci Benchmark',
      code: `// Fast Memoized Fibonacci Generator
function fibonacci(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  return memo[n];
}

console.log("=== Memoized Fibonacci Benchmarks ===");
console.log("Fib(10) =", fibonacci(10));
console.log("Fib(25) =", fibonacci(25));
console.log("Fib(40) =", fibonacci(40));
console.log("Fib(60) =", fibonacci(60));
console.log("Calculated effortlessly with O(N) memoization!");`,
    },
  ],
  python: [
    {
      title: 'Virtual Pet Simulator',
      code: `# CodePaw Python Virtual Pet Simulator
class CodePawPet:
    def __init__(self, name: str, species: str):
        self.name = name
        self.species = species
        self.level = 3
        self.energy = 85
        self.happiness = 90
        self.inventory = ["Cyber Berry", "Coding Manual"]

    def feed(self, treat: str) -> str:
        self.energy = min(100, self.energy + 20)
        return f"🍎 {self.name} munched a {treat}! Energy is now {self.energy}%."

    def practice_code(self, language: str) -> str:
        self.level += 1
        self.happiness = min(100, self.happiness + 10)
        return f"🚀 {self.name} mastered a {language} lesson! Leveled up to Lvl {self.level}!"

# Initialize our companion
pet = CodePawPet("Byte", "Cyber Pup")
print("=== Python Companion Online ===")
print(pet.feed("Quantum Apple"))
print(pet.practice_code("Python 3.12"))
print(f"Inventory: {pet.inventory}")
print("Pet status: Ready for action!")`,
    },
    {
      title: 'Data Science & Comprehensions',
      code: `# Python Lists, Comprehensions and Statistics
quest_scores = [68, 92, 75, 88, 95, 54, 82, 91, 100]

# List comprehension: bonus curves
curved_scores = [min(100, s + 5) for s in quest_scores]
honors_scores = [s for s in curved_scores if s >= 90]

average_score = sum(curved_scores) / len(curved_scores)

print("=== CodePaw Telemetry Analysis ===")
print(f"Total Quests Evaluated: {len(quest_scores)}")
print(f"Honors Quests (>=90): {honors_scores}")
print(f"Average Curved Score: {average_score:.2f}")
print(f"Top Performer: {max(curved_scores)}%")`,
    },
    {
      title: 'Primes & Fibonacci Sieve',
      code: `# Sieve of Eratosthenes & Fibonacci
def sieve_of_eratosthenes(limit):
    is_prime = [True] * (limit + 1)
    is_prime[0] = is_prime[1] = False
    for i in range(2, int(limit**0.5) + 1):
        if is_prime[i]:
            for j in range(i*i, limit + 1, i):
                is_prime[j] = False
    return [x for x in range(limit + 1) if is_prime[x]]

primes = sieve_of_eratosthenes(50)
print("=== Primes up to 50 ===")
print(primes)
print(f"Total Prime Numbers found: {len(primes)}")`,
    },
  ],
  html: [
    {
      title: 'Pet Identity Card',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CodePaw Profile Card</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: #f0fdf4;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      padding: 1rem;
    }
    .card {
      background: white;
      border-radius: 24px;
      padding: 2rem;
      max-width: 360px;
      width: 100%;
      text-align: center;
      box-shadow: 0 20px 25px -5px rgba(16, 185, 129, 0.15);
      border: 1px solid #d1fae5;
    }
    .avatar-wrap {
      width: 90px;
      height: 90px;
      background: linear-gradient(135deg, #10b981, #059669);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
      font-size: 40px;
      box-shadow: 0 8px 16px rgba(16, 185, 129, 0.3);
    }
    h2 { margin: 0 0 0.25rem; color: #064e3b; }
    p { margin: 0 0 1.5rem; color: #047857; font-size: 14px; }
    .stats {
      display: flex;
      justify-content: space-around;
      background: #ecfdf5;
      padding: 0.75rem;
      border-radius: 16px;
      margin-bottom: 1.5rem;
    }
    .stat-val { font-weight: bold; color: #065f46; }
    .stat-lbl { font-size: 11px; color: #059669; }
    button {
      background: #10b981;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      font-weight: bold;
      cursor: pointer;
      width: 100%;
      transition: transform 0.1s;
    }
    button:active { transform: scale(0.97); }
  </style>
</head>
<body>
  <div class="card">
    <div class="avatar-wrap">🐾</div>
    <h2>Byte</h2>
    <p>Cyber Pup • Level 3</p>
    <div class="stats">
      <div>
        <div class="stat-val">100%</div>
        <div class="stat-lbl">Energy</div>
      </div>
      <div>
        <div class="stat-val">420</div>
        <div class="stat-lbl">XP</div>
      </div>
      <div>
        <div class="stat-val">7 Days</div>
        <div class="stat-lbl">Streak</div>
      </div>
    </div>
    <button onclick="feedPet()">Give Snack 🍎</button>
  </div>

  <script>
    let snackCount = 0;
    function feedPet() {
      snackCount++;
      alert("✨ Byte loved the snack! Snacks eaten: " + snackCount);
    }
  </script>
</body>
</html>`,
    },
    {
      title: 'Interactive Quest Form',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CodePaw Quest Registry</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      background: #f8fafc;
      padding: 2rem;
    }
    .form-box {
      max-width: 440px;
      margin: 0 auto;
      background: white;
      padding: 2rem;
      border-radius: 20px;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
      border: 1px solid #e2e8f0;
    }
    label {
      display: block;
      font-size: 13px;
      font-weight: 700;
      color: #334155;
      margin-top: 1rem;
      margin-bottom: 0.35rem;
    }
    input, select {
      width: 100%;
      box-sizing: border-box;
      padding: 0.65rem 0.85rem;
      border-radius: 10px;
      border: 1px solid #cbd5e1;
      font-size: 14px;
    }
    button {
      margin-top: 1.5rem;
      width: 100%;
      background: #3b82f6;
      color: white;
      padding: 0.75rem;
      border: none;
      border-radius: 12px;
      font-weight: bold;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="form-box">
    <h2 style="margin-top:0; color:#1e293b;">Register New Quest</h2>
    <form onsubmit="handleSubmit(event)">
      <label for="title">Quest Title</label>
      <input type="text" id="title" required placeholder="e.g. Python Async Engine" />

      <label for="lang">Language</label>
      <select id="lang">
        <option value="python">Python</option>
        <option value="javascript">JavaScript</option>
        <option value="html">HTML & CSS</option>
      </select>

      <button type="submit">Launch Quest 🚀</button>
    </form>
    <div id="output" style="margin-top:1rem; font-size:13px; color:#16a34a; font-weight:bold;"></div>
  </div>

  <script>
    function handleSubmit(e) {
      e.preventDefault();
      const title = document.getElementById('title').value;
      const lang = document.getElementById('lang').value;
      document.getElementById('output').innerText = '✅ Created ' + lang.toUpperCase() + ' quest: ' + title;
    }
  </script>
</body>
</html>`,
    },
  ],
  css: [
    {
      title: 'Cyberpunk Glow & Animation',
      code: `/* Interactive Cyberpunk Glow Badge */
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      background: #0f172a;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      font-family: system-ui, sans-serif;
    }

    @keyframes neonGlow {
      0%, 100% {
        box-shadow: 0 0 15px #10b981, 0 0 30px rgba(16, 185, 129, 0.4);
      }
      50% {
        box-shadow: 0 0 25px #06b6d4, 0 0 50px rgba(6, 182, 212, 0.6);
      }
    }

    @keyframes floatPet {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-10px) rotate(2deg); }
    }

    .neon-badge {
      background: #1e293b;
      border: 2px solid #10b981;
      padding: 2.5rem 3rem;
      border-radius: 24px;
      text-align: center;
      animation: neonGlow 3s infinite ease-in-out;
      color: #f8fafc;
    }

    .avatar {
      font-size: 56px;
      display: inline-block;
      animation: floatPet 2.5s infinite ease-in-out;
    }

    h1 {
      margin: 1rem 0 0.5rem;
      font-size: 24px;
      letter-spacing: -0.5px;
      background: linear-gradient(to right, #34d399, #38bdf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    p {
      color: #94a3b8;
      font-size: 14px;
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="neon-badge">
    <div class="avatar">🐾</div>
    <h1>CodePaw Cyber Pro</h1>
    <p>Level 10 Master Companion</p>
  </div>
</body>
</html>`,
    },
    {
      title: 'Bento Grid Dashboard',
      code: `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      background: #f8fafc;
      font-family: system-ui, sans-serif;
      padding: 2rem;
      margin: 0;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.25rem;
      max-width: 800px;
      margin: 0 auto;
    }
    .card {
      background: white;
      border-radius: 20px;
      padding: 1.5rem;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.04);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 20px -3px rgba(0,0,0,0.08);
    }
    .card-tall { grid-row: span 2; background: linear-gradient(135deg, #10b981, #047857); color: white; }
    .card h3 { margin-top: 0; }
  </style>
</head>
<body>
  <div class="grid">
    <div class="card card-tall">
      <h3 style="color:white">🐾 Active Pet</h3>
      <p>Byte is feeling ecstatic! 100% Happiness restored.</p>
    </div>
    <div class="card">
      <h3>🔥 Streak</h3>
      <p style="font-size:28px; font-weight:bold; color:#ea580c; margin:0.5rem 0;">7 Days</p>
    </div>
    <div class="card">
      <h3>💎 Gems</h3>
      <p style="font-size:28px; font-weight:bold; color:#0284c7; margin:0.5rem 0;">240</p>
    </div>
    <div class="card" style="grid-column: span 2;">
      <h3>⚡ Daily Speed Debug</h3>
      <p>Beat the 60s bug fix challenge to earn bonus Gems & XP!</p>
    </div>
  </div>
</body>
</html>`,
    },
  ],
};

export const CodeSandboxView: React.FC<CodeSandboxViewProps> = ({
  user,
  initialLanguage = 'javascript',
  initialCode,
  onAskCompanion,
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<SandboxLanguage>(initialLanguage);
  const [activeTemplateIdx, setActiveTemplateIdx] = useState<number>(0);

  // Load code from localStorage or initial props with migration
  const [code, setCode] = useState<string>(() => {
    if (initialCode) return initialCode;
    const newSaved = localStorage.getItem(`codepaw_sandbox_code_${initialLanguage}`);
    const legacySaved = localStorage.getItem(`skillpet_sandbox_code_${initialLanguage}`);
    return newSaved || legacySaved || TEMPLATES[initialLanguage][0].code;
  });

  const [logs, setLogs] = useState<string[]>([
    'Sandbox ready. Select a language, edit code, and press "Run Code".',
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [petSpeech, setPetSpeech] = useState<string>(
    'Write or edit code and run it! I will cheer for you! 🐾'
  );

  // Pyodide status
  const [pyodideStatus, setPyodideStatus] = useState<string>('idle');

  // Preview tab for HTML/CSS vs Console
  const isWebLanguage = currentLanguage === 'html' || currentLanguage === 'css';
  const [activeTab, setActiveTab] = useState<'console' | 'preview'>(
    isWebLanguage ? 'preview' : 'console'
  );
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewKey, setPreviewKey] = useState<number>(1);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const lineNumbersRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Switch language
  const handleSelectLanguage = (lang: SandboxLanguage) => {
    if (lang === currentLanguage) return;
    setCurrentLanguage(lang);
    setActiveTemplateIdx(0);
    sound.playClick(user.soundEnabled);

    const newSaved = localStorage.getItem(`codepaw_sandbox_code_${lang}`);
    const legacySaved = localStorage.getItem(`skillpet_sandbox_code_${lang}`);
    const nextCode = newSaved || legacySaved || TEMPLATES[lang][0].code;
    setCode(nextCode);
    setLastError(null);

    if (lang === 'html' || lang === 'css') {
      setActiveTab('preview');
      setLogs([`${lang.toUpperCase()} environment ready. Live preview mounted.`]);
    } else {
      setActiveTab('console');
      setLogs([`${lang.toUpperCase()} console initialized.`]);
    }

    if (lang === 'python') {
      setPetSpeech('Python WebAssembly enabled! Let\'s run some real Python! 🐍🐾');
    } else if (lang === 'html' || lang === 'css') {
      setPetSpeech('Web styling studio ready! Look at that live preview! 🌐✨');
    } else {
      setPetSpeech('JavaScript engine hot & loaded! Let\'s execute! ⚡🐾');
    }
  };

  // Select template
  const handleSelectTemplate = (idx: number) => {
    setActiveTemplateIdx(idx);
    const tmpl = TEMPLATES[currentLanguage][idx];
    setCode(tmpl.code);
    setLastError(null);
    sound.playClick(user.soundEnabled);
  };

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`codepaw_sandbox_code_${currentLanguage}`, code);
    } catch {
      // ignore
    }
  }, [code, currentLanguage]);

  // Sync line numbers scrolling
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Tab key & auto-closing brackets handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Run shortcut Ctrl+Enter / Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRunCode();
      return;
    }

    const textarea = textareaRef.current;
    if (!textarea) return;

    // Tab key inserts 2 spaces
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const val = textarea.value;
      const nextVal = val.substring(0, start) + '  ' + val.substring(end);
      setCode(nextVal);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
      return;
    }

    // Auto-close pairs: (), [], {}, "", ''
    const pairs: Record<string, string> = {
      '(': ')',
      '[': ']',
      '{': '}',
      '"': '"',
      "'": "'",
      '`': '`',
    };

    if (pairs[e.key]) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const closing = pairs[e.key];

      // If user selected text, wrap it
      if (start !== end) {
        e.preventDefault();
        const selected = textarea.value.substring(start, end);
        const nextVal =
          textarea.value.substring(0, start) +
          e.key +
          selected +
          closing +
          textarea.value.substring(end);
        setCode(nextVal);
        setTimeout(() => {
          textarea.selectionStart = start + 1;
          textarea.selectionEnd = end + 1;
        }, 0);
      }
    }
  };

  // Execution Handler
  const handleRunCode = async () => {
    setIsRunning(true);
    setLastError(null);
    sound.playClick(user.soundEnabled);

    if (currentLanguage === 'python') {
      // Python Pyodide execution
      setLogs(['[Python] Initializing WebAssembly runner...']);
      setPyodideStatus('running');

      const result = await runPythonCode(code, (status) => {
        setPyodideStatus(status);
      });

      setExecutionTime(result.executionTimeMs);

      const captured: string[] = [];
      if (result.stdout.length > 0) {
        captured.push(...result.stdout);
      }
      if (result.result) {
        captured.push(`--> Return value: ${result.result}`);
      }
      if (result.stderr.length > 0) {
        captured.push(...result.stderr.map((e) => `[STDERR] ${e}`));
      }

      if (result.error) {
        captured.push(`Execution Error: ${result.error}`);
        setLastError(result.error);
        setLogs(captured);
        sound.playError(user.soundEnabled);
        setPetSpeech('Python threw an error! Need a hint? Ask me anytime!');
      } else {
        if (captured.length === 0) {
          captured.push('Program finished with code 0 (no output).');
        }
        setLogs(captured);
        sound.playSuccess(user.soundEnabled);
        setPetSpeech(`🐍 Python executed in ${result.executionTimeMs}ms! Superb! ✨🐾`);
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.7 },
        });
      }

      setIsRunning(false);
      setPyodideStatus('ready');
      return;
    }

    if (currentLanguage === 'javascript') {
      // JavaScript Sandbox execution
      const startTime = performance.now();
      const capturedLogs: string[] = [];

      const customConsole = {
        log: (...args: unknown[]) => {
          capturedLogs.push(
            args
              .map((arg) =>
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
              )
              .join(' ')
          );
        },
        error: (...args: unknown[]) => {
          capturedLogs.push('[ERROR] ' + args.map(String).join(' '));
        },
        warn: (...args: unknown[]) => {
          capturedLogs.push('[WARN] ' + args.map(String).join(' '));
        },
        info: (...args: unknown[]) => {
          capturedLogs.push('[INFO] ' + args.map(String).join(' '));
        },
      };

      try {
        const runFn = new Function('console', code);
        runFn(customConsole);
        const duration = Math.round(performance.now() - startTime);
        setExecutionTime(duration);

        if (capturedLogs.length === 0) {
          capturedLogs.push('Code executed successfully with 0 logs.');
        }

        setLogs(capturedLogs);
        sound.playSuccess(user.soundEnabled);
        setPetSpeech(`Brilliant JavaScript run in ${duration}ms! Zero errors! ✨🐾`);

        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        capturedLogs.push(`Execution Error: ${errorMsg}`);
        setLastError(errorMsg);
        setLogs(capturedLogs);
        sound.playError(user.soundEnabled);
        setPetSpeech('Oops! A JavaScript runtime error appeared! I can help you debug it!');
      } finally {
        setIsRunning(false);
      }
      return;
    }

    // HTML / CSS live reload
    setPreviewKey((k) => k + 1);
    setIsRunning(false);
    setActiveTab('preview');
    sound.playSuccess(user.soundEnabled);
    setPetSpeech('Web preview updated cleanly! Looks sleek! 🌐🎨');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    sound.playClick(user.soundEnabled);
  };

  const handleReset = () => {
    setCode(TEMPLATES[currentLanguage][activeTemplateIdx].code);
    setLogs(['Code reset to template default.']);
    setLastError(null);
    sound.playClick(user.soundEnabled);
  };

  // Generate line numbers
  const lineCount = code.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(1, lineCount) }, (_, i) => i + 1);

  // Build iframe HTML payload
  const buildIframeDoc = () => {
    if (currentLanguage === 'html') {
      return code;
    }
    if (currentLanguage === 'css') {
      return `<!DOCTYPE html><html><head><style>${code}</style></head><body><div class="preview-wrap"><h1>CSS Live Preview</h1><p>Edit CSS in the editor to style this page.</p></div></body></html>`;
    }
    return `<!DOCTYPE html><html><body><pre>${code}</pre></body></html>`;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">
              CODEPAW PLAYGROUND
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              Multi-Language Sandbox
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Code Sandbox & Runtime
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Code and execute real Python, JavaScript, HTML, and CSS in a secured sandbox.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 transition cursor-pointer shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 transition cursor-pointer shadow-2xs"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            {copied ? 'Copied' : 'Copy'}
          </button>

          <button
            type="button"
            onClick={handleRunCode}
            disabled={isRunning}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 active:scale-95 transition cursor-pointer disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            {isRunning ? 'Running...' : 'Run Code'}
          </button>
        </div>
      </div>

      {/* Language Selector Tabs */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          {(['javascript', 'python', 'html', 'css'] as SandboxLanguage[]).map((lang) => {
            const isActive = currentLanguage === lang;
            const labels: Record<SandboxLanguage, { name: string; tag: string }> = {
              javascript: { name: 'JavaScript', tag: 'ES2024' },
              python: { name: 'Python', tag: 'Pyodide WASM' },
              html: { name: 'HTML5', tag: 'Preview' },
              css: { name: 'CSS3', tag: 'Styles' },
            };

            return (
              <button
                key={lang}
                type="button"
                onClick={() => handleSelectLanguage(lang)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-2 border ${
                  isActive
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                }`}
              >
                <span>{labels[lang].name}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-md font-mono ${
                    isActive ? 'bg-emerald-700/60 text-emerald-100' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {labels[lang].tag}
                </span>
              </button>
            );
          })}
        </div>

        {/* Shortcut notice */}
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
          <span>Run:</span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-300 text-slate-700 text-[10px] font-bold">
            Ctrl
          </kbd>
          <span>+</span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-300 text-slate-700 text-[10px] font-bold">
            Enter
          </kbd>
        </div>
      </div>

      {/* Template Presets Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-slate-400 mr-1 flex-shrink-0">
          Presets ({currentLanguage.toUpperCase()}):
        </span>
        {TEMPLATES[currentLanguage].map((tmpl, idx) => (
          <button
            key={tmpl.title}
            type="button"
            onClick={() => handleSelectTemplate(idx)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
              activeTemplateIdx === idx
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs font-bold'
                : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
            }`}
          >
            {tmpl.title}
          </button>
        ))}
      </div>

      {/* Error alert with Companion Mentor Assist button */}
      {lastError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-2.5 text-xs">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-extrabold text-sm text-rose-800">
                Execution Error Encountered
              </div>
              <p className="font-mono text-rose-700 mt-0.5 break-all">{lastError}</p>
            </div>
          </div>

          {onAskCompanion && (
            <button
              type="button"
              onClick={() =>
                onAskCompanion({
                  language: currentLanguage,
                  code,
                  error: lastError,
                  prompt: `I hit this error in ${currentLanguage}: "${lastError}". Can you guide me through fixing it without giving away the full answer right away?`,
                })
              }
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition cursor-pointer flex items-center gap-2 self-start sm:self-auto shadow-xs whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>🐾 Ask Companion to Explain Error</span>
            </button>
          )}
        </div>
      )}

      {/* Main Grid: Code Editor (7 cols) & Output / Live Preview (5 cols) */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Editor Area (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-950 rounded-3xl shadow-xl border border-slate-800 text-slate-100 flex flex-col min-h-[500px] overflow-hidden">
          {/* Editor Header Bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono text-slate-400 bg-slate-900/90">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="ml-2 font-bold text-slate-200">
                {currentLanguage === 'python'
                  ? 'main.py'
                  : currentLanguage === 'javascript'
                  ? 'script.js'
                  : currentLanguage === 'html'
                  ? 'index.html'
                  : 'styles.css'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {executionTime !== null && (
                <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {executionTime}ms
                </span>
              )}
              <span className="text-[11px] text-slate-500 uppercase font-bold">
                {currentLanguage}
              </span>
            </div>
          </div>

          {/* Editor with Gutter Line Numbers */}
          <div className="flex-1 flex overflow-hidden relative">
            {/* Line numbers column */}
            <div
              ref={lineNumbersRef}
              className="w-12 py-4 pl-3 pr-2 text-right font-mono text-xs text-slate-600 select-none border-r border-slate-800/80 overflow-hidden"
            >
              {lineNumbers.map((num) => (
                <div key={num} className="leading-6">
                  {num}
                </div>
              ))}
            </div>

            {/* Code Textarea */}
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onScroll={handleScroll}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              className="flex-1 p-4 bg-transparent font-mono text-xs sm:text-sm text-emerald-300 leading-6 resize-none focus:outline-none placeholder-slate-700 overflow-y-auto whitespace-pre tab-4"
              rows={20}
            />
          </div>

          {/* Editor Footer Bar */}
          <div className="px-5 py-2.5 border-t border-slate-800/80 text-[11px] font-mono text-slate-500 flex items-center justify-between bg-slate-900/60">
            <div>Lines: {lineCount} • Characters: {code.length}</div>
            <div className="flex items-center gap-2">
              {onAskCompanion && (
                <button
                  type="button"
                  onClick={() =>
                    onAskCompanion({
                      language: currentLanguage,
                      code,
                      error: lastError || undefined,
                      prompt: `Can you review my ${currentLanguage} code and give me a helpful tip?`,
                    })
                  }
                  className="text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1 cursor-pointer font-bold"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Ask Mentor</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Output & Companion Reaction Area (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col">
          {/* Companion Cheer Card */}
          <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-xs flex items-center gap-4">
            <PetAvatar petId={user.activePetId} size="md" />
            <div className="space-y-1 flex-1">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Companion Cheer
              </div>
              <p className="text-xs font-semibold text-slate-800">"{petSpeech}"</p>
            </div>
          </div>

          {/* Output / Preview Container */}
          <div className="bg-slate-950 rounded-3xl shadow-xl border border-slate-800 text-slate-200 flex-1 min-h-[420px] flex flex-col overflow-hidden">
            {/* Output Tab Switcher */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono bg-slate-900/90">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('console')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'console'
                      ? 'bg-slate-800 text-emerald-400'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Terminal</span>
                </button>

                {isWebLanguage && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'preview'
                        ? 'bg-slate-800 text-emerald-400'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Live Preview</span>
                  </button>
                )}
              </div>

              {/* Controls depending on active tab */}
              {activeTab === 'console' ? (
                <button
                  type="button"
                  onClick={() => setLogs([])}
                  className="text-[11px] text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  Clear Logs
                </button>
              ) : (
                <div className="flex items-center gap-1 text-slate-400">
                  <button
                    type="button"
                    onClick={() => setViewportMode('desktop')}
                    title="Desktop"
                    className={`p-1 rounded cursor-pointer ${
                      viewportMode === 'desktop' ? 'text-emerald-400' : 'hover:text-slate-200'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewportMode('tablet')}
                    title="Tablet (768px)"
                    className={`p-1 rounded cursor-pointer ${
                      viewportMode === 'tablet' ? 'text-emerald-400' : 'hover:text-slate-200'
                    }`}
                  >
                    <Tablet className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewportMode('mobile')}
                    title="Mobile (375px)"
                    className={`p-1 rounded cursor-pointer ${
                      viewportMode === 'mobile' ? 'text-emerald-400' : 'hover:text-slate-200'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewKey((k) => k + 1)}
                    title="Refresh Preview"
                    className="p-1 rounded hover:text-slate-200 cursor-pointer ml-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Panel Body */}
            {activeTab === 'console' ? (
              <div className="flex-1 p-4 font-mono text-xs space-y-1.5 overflow-y-auto max-h-[380px]">
                {logs.map((log, index) => (
                  <div
                    key={index}
                    className={`leading-relaxed ${
                      log.startsWith('Execution Error') || log.startsWith('[ERROR]')
                        ? 'text-rose-400 font-bold'
                        : log.startsWith('[WARN]')
                        ? 'text-amber-300'
                        : log.startsWith('===')
                        ? 'text-emerald-400 font-bold'
                        : log.startsWith('-->')
                        ? 'text-sky-300 font-semibold'
                        : 'text-slate-300'
                    }`}
                  >
                    <span className="text-slate-600 select-none mr-2">&gt;</span>
                    {log}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 bg-slate-900 flex items-center justify-center p-2 overflow-auto">
                <div
                  className={`h-full bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ${
                    viewportMode === 'desktop'
                      ? 'w-full'
                      : viewportMode === 'tablet'
                      ? 'w-[768px] max-w-full'
                      : 'w-[375px] max-w-full'
                  }`}
                  style={{ minHeight: '340px' }}
                >
                  <iframe
                    key={previewKey}
                    ref={iframeRef}
                    title="CodePaw Live Sandbox Preview"
                    srcDoc={buildIframeDoc()}
                    sandbox="allow-scripts"
                    className="w-full h-full border-0 min-h-[340px]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

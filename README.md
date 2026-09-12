# 🐾 CodePaw AI

> **Learn to Code. Raise Your Companion. Level Up.**

CodePaw AI is an interactive, gamified coding-learning platform inspired by Duolingo-style bite-sized curriculum progression, virtual companion nurturing, and interactive modern developer playgrounds.

As you master programming concepts across Python, HTML5, CSS, and JavaScript, your virtual companion earns experience, unlocks cyber accessories, and levels up alongside your coding journey.

---

## ✨ Features

- **Virtual Cyber Companion Sanctuary**:
  - 8 Dynamic Companions: `Rexi`, `Byte`, `Nova`, `Pip`, `Kitsune`, `Chrono`, `Nimbus`, `Spark`
  - Dynamic Moods: `Ecstatic`, `Happy`, `Neutral`, `Sleepy`
  - Visual Accessories: Hologram Shades, VR Visor, Cyber Cap, Wizard Hat, Golden Crown, DJ Headset, Data Monocle, and Pixel Glasses
  - Companion Customizer with live SVG preview, color palettes, and renaming
  - Feeding mechanics with real-time hunger gauges and mood evolution

- **Interactive Coding Curriculum**:
  - **Python Mastery**: Royal Greetings (`print`), Storing Digital Memories (Variables), Dynamic F-Strings, Conditionals, and Training Loops
  - **HTML5 Architect**: Primary Headings (`<h1>`), Interactive Action Buttons (`<button>`), and Semantic Profile Containers
  - **CSS Stylist**: Vibrant Colors, Rounded Futuristic Cards (`border-radius`), and Fluid Flexbox Alignment
  - **JavaScript Dynamo**: Modern `const`/`let` Declarations, Arrow Functions, and Array Transformations (`.map()`)

- **Developer Learning Environment**:
  - Dedicated multi-tab Code Sandbox (JavaScript, Python Simulation, HTML, CSS)
  - Isolated sandboxed execution for JavaScript
  - Dedicated Python Beginner Simulation with clear, transparent labeling
  - Live sandboxed visual HTML & CSS renderer
  - Intelligent answer validation with whitespace & quote normalization

- **Gamification & Habit Mechanics**:
  - **XP & Level Progression**: Level up celebrations with particle confetti and fanfare
  - **Gems Economy**: Earned through lesson completion and daily visits; spent on snacks and gear in the Pet Bazaar
  - **Heart Recovery System**: Clamped between 0 and 5 hearts
  - **Daily Streaks**: Animated flame counter with motivational reminders
  - **Daily Bonus**: Calendar-day locked claim (+25 Gems once per day)
  - **Official Completion Certificates**: Verifiable digital credentials with print & PDF export
  - **Badges & Achievements**: Feats for streaks, lessons, XP milestones, and styling
  - **Global & Local Leaderboard**: Clear competitive rankings with gem indicators

- **Accessibility & Sensory Immersion**:
  - Web Audio API synthesizer for chimes, feedback, and level-ups
  - Web Speech API integration for lesson text-to-speech voice narration
  - Keyboard Command Palette (`Ctrl + K` / `Cmd + K`) for instant navigation

- **Storage & State Resilience**:
  - Versioned local storage keys (`codepaw_profile_data_v1`, `codepaw_sandbox_code_v1`)
  - Automatic migration from legacy `skillpet_` keys to `codepaw_` keys preserving all existing user progress
  - Corruption recovery with safe parsing and fallback defaults
  - Clean "Reset Progress" flow with explicit confirmation

---

## 🛠️ Tech Stack

- **Framework**: React 18+ (Vite)
- **Backend**: Express + Vite Middleware with Gemini AI Companion Mentorship
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Celebration Effects**: canvas-confetti
- **Browser APIs**: Web Audio API, Web Speech API, Web Storage API

---

## 🚀 Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Preview the production build:
   ```bash
   npm run preview
   ```

---

## ☁️ Deployment

CodePaw AI is configured with full-stack build scripts:
- Build command: `npm run build`
- Output directory: `dist`

---

## 📄 License

MIT License — free to use, modify, and build upon.

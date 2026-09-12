# 🐾 CodePaw AI

> **Learn to Code. Raise Your Companion. Level Up.**

[![React](https://img.shields.io/badge/React-18%2B-61DAFB?logo=react\&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5%2B-3178C6?logo=typescript\&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5%2B-646CFF?logo=vite\&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4%2B-06B6D4?logo=tailwindcss\&logoColor=white)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-Powered-4285F4?logo=google\&logoColor=white)](https://ai.google.dev/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel\&logoColor=white)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**CodePaw AI** is a gamified AI-powered coding learning platform designed to make programming more interactive, engaging, and rewarding.

Learn **Python, HTML5, CSS, and JavaScript** through bite-sized lessons, practice in an interactive code sandbox, interact with your AI coding companion, and grow your virtual companion as you progress through your coding journey.

---

## 📚 Table of Contents

* [✨ Features](#-features)

  * [🐾 Virtual Cyber Companion](#-virtual-cyber-companion)
  * [📚 Interactive Coding Curriculum](#-interactive-coding-curriculum)
  * [💻 Developer Learning Environment](#-developer-learning-environment)
  * [🎮 Gamification](#-gamification)
  * [🤖 AI-Powered Learning](#-ai-powered-learning)
  * [🔊 Accessibility & Interactive Experience](#-accessibility--interactive-experience)
  * [💾 Reliable Local Progress](#-reliable-local-progress)
* [🛠️ Tech Stack](#️-tech-stack)
* [📁 Project Structure](#-project-structure)
* [🚀 Getting Started](#-getting-started)
* [🔐 Gemini AI Setup](#-gemini-ai-setup)
* [☁️ Deployment](#️-deployment)
* [🎯 Project Vision](#-project-vision)
* [🔮 Future Improvements](#-future-improvements)
* [📄 License](#-license)

---

## ✨ Features

### 🐾 Virtual Cyber Companion

* 8 unique companions:

  * `Rexi`
  * `Byte`
  * `Nova`
  * `Pip`
  * `Kitsune`
  * `Chrono`
  * `Nimbus`
  * `Spark`
* Dynamic moods:

  * `Ecstatic`
  * `Happy`
  * `Neutral`
  * `Sleepy`
* Cyber accessories:

  * Hologram Shades
  * VR Visor
  * Cyber Cap
  * Wizard Hat
  * Golden Crown
  * DJ Headset
  * Data Monocle
  * Pixel Glasses
* Companion customization with live SVG preview
* Custom color palettes
* Companion renaming
* Feeding system with hunger and mood mechanics

### 📚 Interactive Coding Curriculum

Structured, bite-sized learning paths for multiple technologies.

#### 🐍 Python Mastery

* `print()`
* Variables
* F-Strings
* Conditionals
* Loops

#### 🌐 HTML5 Architect

* Headings
* Buttons
* Semantic HTML
* Interactive elements

#### 🎨 CSS Stylist

* Colors
* Border Radius
* Flexbox
* Responsive styling concepts

#### ⚡ JavaScript Dynamo

* `const` / `let`
* Arrow Functions
* `.map()`
* Array transformations

### 💻 Developer Learning Environment

* Multi-language Code Sandbox
* JavaScript execution in an isolated sandbox
* Beginner-friendly Python simulation
* Live HTML preview
* Live CSS rendering
* Intelligent answer validation
* Whitespace and quote normalization
* Code copying
* Code reset
* Practice workflows
* Lesson-integrated coding exercises

### 🎮 Gamification

* XP and level progression
* Level-up celebrations
* Particle confetti and sound effects
* Gems-based reward system
* Heart recovery system
* Daily learning streaks
* Daily bonus rewards
* Pet Bazaar
* Companion accessories
* Badges and achievements
* Global and local leaderboard
* Completion certificates
* Print/PDF certificate support

### 🤖 AI-Powered Learning

* Personal AI coding companion
* Programming concept explanations
* Beginner-friendly coding guidance
* Coding mentorship powered by Gemini
* Context-aware learning assistance
* Support for programming-related questions

### 🔊 Accessibility & Interactive Experience

* Web Audio API sound effects
* Web Speech API lesson narration
* Keyboard Command Palette
* `Ctrl + K` / `Cmd + K` navigation
* Responsive desktop and mobile interface

### 💾 Reliable Local Progress

* Versioned localStorage persistence
* Automatic migration from legacy `skillpet_` keys
* Existing progress preservation during migration
* Corruption-safe data recovery
* Safe fallback defaults
* Reset Progress flow with confirmation

---

## 🛠️ Tech Stack

| Technology           | Purpose                          |
| -------------------- | -------------------------------- |
| **React 18+**        | Frontend UI                      |
| **Vite**             | Development and production build |
| **TypeScript**       | Type-safe development            |
| **Tailwind CSS**     | Styling and responsive design    |
| **Express**          | Backend and API integration      |
| **Google Gemini AI** | AI Coding Companion              |
| **Lucide React**     | UI icons                         |
| **canvas-confetti**  | Celebration effects              |
| **Web Audio API**    | Interactive sound effects        |
| **Web Speech API**   | Voice narration                  |
| **Web Storage API**  | Local progress persistence       |

---

## 📁 Project Structure

```text
CodePaw-AI/
├── public/
│   └── assets/
│       ├── python_course_art.png
│       ├── html_course_art.png
│       ├── css_course_art.png
│       └── js_course_art.png
│
├── src/
│   ├── components/
│   │   ├── AudioSettingsModal.tsx
│   │   ├── CertificateModal.tsx
│   │   ├── CodePlayground.tsx
│   │   ├── CommandPaletteModal.tsx
│   │   ├── CoursesView.tsx
│   │   ├── DailyBonusModal.tsx
│   │   ├── DashboardHome.tsx
│   │   ├── LeaderboardView.tsx
│   │   ├── LessonView.tsx
│   │   ├── Navbar.tsx
│   │   ├── PetAvatar.tsx
│   │   ├── PetBazaarModal.tsx
│   │   ├── PetCustomizerModal.tsx
│   │   ├── ResetProgressModal.tsx
│   │   ├── Sidebar.tsx
│   │   ├── SparkleEffect.tsx
│   │   └── StreakFlame.tsx
│   │
│   ├── data/
│   │   └── courses.ts
│   │
│   ├── utils/
│   │   ├── audioFx.ts
│   │   ├── codeExecutor.ts
│   │   ├── speech.ts
│   │   └── storage.ts
│   │
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── types.ts
│
├── index.html
├── metadata.json
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

### 📂 Key Directories

* **`src/components/`** — Reusable UI components, views, modals, companion system, courses, and playground.
* **`src/data/`** — Course and lesson content.
* **`src/utils/`** — Code execution, audio effects, speech, and storage utilities.
* **`src/types.ts`** — Shared TypeScript types and interfaces.
* **`public/assets/`** — Course artwork and static assets.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have **Node.js** installed on your system.

### 1. Clone the Repository

```bash
git clone https://github.com/ankitkgupta11-g/CodePaw-AI.git
cd CodePaw-AI
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Gemini AI

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Get your Gemini API key from:

https://aistudio.google.com/app/apikey

> ⚠️ Never commit your `.env` file or expose your Gemini API key in frontend code.

Make sure your `.gitignore` contains:

```gitignore
.env
.env.local
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available through the local development URL shown in your terminal.

### 5. Build for Production

```bash
npm run build
```

### 6. Preview Production Build

```bash
npm run preview
```

---

## 🔐 Gemini AI Setup

CodePaw AI uses **Google Gemini AI** to power its AI Coding Companion.

### Get an API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Create or select a project.
3. Generate a Gemini API key.
4. Add the key to your local `.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Environment Variable

```text
GEMINI_API_KEY
```

Keep this value private and never upload it to GitHub.

---

## ☁️ Deployment

CodePaw AI is designed for modern web deployment and can be deployed on platforms such as **Vercel**.

### Build Command

```bash
npm run build
```

### Output Directory

```text
dist/
```

### 🔐 Vercel Environment Variable

When deploying to Vercel:

1. Open your Vercel project.
2. Go to **Settings → Environment Variables**.
3. Add:

```text
GEMINI_API_KEY
```

4. Enter your Gemini API key as the value.
5. Select the required deployment environments.
6. Redeploy the project.

> **Security:** Never place the actual Gemini API key inside your GitHub repository or directly inside frontend source code.

---

## 🎯 Project Vision

CodePaw AI combines **AI mentorship, interactive coding practice, gamification, and virtual companion mechanics** into a single learning experience.

Instead of simply completing programming lessons, users can:

* Learn programming concepts
* Practice writing code
* Ask an AI coding companion for guidance
* Earn XP and rewards
* Maintain learning streaks
* Unlock companion accessories
* Customize their virtual companion
* Track their learning progress

The goal is to make coding education feel less like traditional study and more like an interactive journey.

> **Learn. Practice. Earn. Evolve. Code.** 🐾

---

## 🔮 Future Improvements

Planned improvements can include:

* 🔐 User authentication and cloud progress synchronization
* 👑 Owner/Admin dashboard with role-based access control
* 🧠 Advanced AI code review
* 🗺️ Personalized learning roadmaps
* 🎯 Daily coding challenges
* 📊 Detailed learning analytics
* 🏆 Advanced achievements and skill badges
* 🧑‍💻 Real-world coding projects
* 🐾 Companion evolution system
* 👥 Friends and social learning features
* 🌐 Real-time global leaderboard

---

## 📄 License

This project is licensed under the **MIT License**.

Free to use, modify, and build upon.

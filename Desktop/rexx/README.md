# 🎯 Rexx Focus

> **Master Your Flow** - A premium Pomodoro timer with statistics, built for deep work.

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## ✨ Features

### 🎨 **Dynamic Theme Engine** ✨ NEW
Switch between 5 premium themes instantly.
- **Sunset** (Electric Orange) - Default energetic theme
- **Ocean** (Cyan) - Calm, focused atmosphere
- **Forest** (Emerald) - Natural, grounding vibe
- **Nebula** (Purple) - Creative, mystical feel
- **Classic** (Red) - Bold, traditional Pomodoro
- **Glowing color swatches** with dual-ring animation
- **500ms smooth transitions** across entire app
- **localStorage persistence** - Theme survives refresh
- **Accessibility:** Full keyboard navigation + ARIA labels

### 🎬 **Cinematic Intro: "The Breathing Core"** ✨ NEW
Premium startup experience inspired by Apple devices.
- **Minimalist breathing icon** (80px) with theme-aware glow
- **Micro typography** (tracking: 0.3em) - whisper-quiet elegance
- **Gentle fade transitions** - No harsh effects
- **Film grain overlay** for texture
- **One tap to enter** - Full-screen clickable area

### 🔊 **Zen Tech Sonic Branding** ✨ NEW
Professional sound effects using Web Audio API (zero external files).
- **Start:** Futuristic power-up (rising sine 240Hz→480Hz, 120ms)
- **Stop:** Mechanical click (triangle wave 200Hz, 80ms)
- **Finish:** Zen achievement gong (A Major chord + reverb, 800ms)
- **Multi-oscillator synthesis** for rich chord sound
- **Automatic cleanup** - No memory leaks
- **Settings-aware** - Respects sound toggle

### 🎯 **Deep Focus Mode**
Immersive focus experience - the world fades away when you're in the zone.
- Background blur & dimming when timer is running
- Visual feedback system
- Distraction-free environment

### ⏱️ **Smart Timer System**
Flexible Pomodoro technique with customization.
- **Work / Short Break / Long Break** modes
- **Custom durations** with +/- spinners
- **Persistence** - Never lose your progress (page refresh safe)
- **Sound notifications** (toggle on/off)
- **Preset templates**: Classic (25/5/15), Deep Work (90/15/30), Sprint (15/3/10)

### 📊 **Analytics Dashboard**
Track your productivity with beautiful visualizations.
- **7-day bar chart** powered by Recharts
- **KPI cards** with glow-on-hover effect
- **Trend comparison** (today vs yesterday %)
- **Motivational messages** based on your performance
- **Session counter** - see your daily achievements

### ✅ **Task Management**
Integrated todo list for focused work.
- Create, complete, and delete tasks
- **Focus mode** - select a task to work on
- **Auto-tracking** - completed tasks logged to stats
- Persistent storage

### 🎨 **Premium UI/UX**
Crafted with attention to detail.
- **Deep Focus Zen** aesthetic (dark mode)
- **Framer Motion** animations (60fps smooth)
- **8px grid system** for mathematical consistency
- **Glassmorphism** design elements
- **Dynamic theme colors** (5 choices)
- **Mobile responsive** (works on all devices)
- **Custom Focus Target favicon** (SVG)

### ⚡ **Performance First**
Optimized for speed and efficiency.
- **Code splitting** - Stats modal lazy loaded
- **~117 kB gzip** initial load (optimized)
- **Suspense fallback** with branded loading state
- **Zero runtime errors** - Error boundary protection

---

## 🛠️ Tech Stack

### Core
- ⚛️ **React 19** - Latest features & concurrent rendering
- 📘 **TypeScript** - Type safety & developer experience
- ⚡ **Vite** - Lightning-fast build tool

### State Management
- 🐻 **Zustand** - Lightweight state management
- 💾 **Persist middleware** - LocalStorage integration

### UI/UX
- 🎨 **Tailwind CSS** - Utility-first styling
- ✨ **Framer Motion** - Production-ready animations
- 📊 **Recharts** - Data visualization (lazy loaded)
- 🎯 **Lucide React** - Beautiful icons

### Architecture
- 🏗️ **Feature-first structure** - Scalable organization
- ♿ **Accessibility** - ARIA labels, keyboard navigation
- 🛡️ **Error boundaries** - Graceful error handling
- 📦 **Code splitting** - React.lazy + Suspense

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (recommended: 20 LTS)
- npm 9+ or pnpm 8+

### Installation

```bash
# Clone the repository
git clone https://github.com/fth530/rexx-focus.git

# Navigate to project directory
cd rexx-focus

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview
```

### Lint & Type Check

```bash
# Run ESLint
npm run lint

# TypeScript type checking
npm run build  # (tsc runs automatically)
```

---

## 📁 Project Structure

```
rexx-focus/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── CinematicIntro.tsx    # Welcome animation
│   │   │   ├── ErrorBoundary.tsx     # Error handling
│   │   │   ├── SettingsModal.tsx     # Settings UI
│   │   │   └── StatsModal.tsx        # Analytics (lazy loaded)
│   │   └── ui/
│   │       ├── index.tsx              # Reusable components
│   │       └── LoadingSpinner.tsx     # Suspense fallback
│   ├── features/
│   │   ├── timer/
│   │   │   └── Timer.tsx              # Main timer logic
│   │   └── todos/
│   │       └── TodoList.tsx           # Task management
│   ├── hooks/
│   │   ├── useInterval.ts             # Custom timer hook
│   │   ├── useNotification.ts         # Browser notifications
│   │   └── useSoundEffects.ts         # Web Audio API sounds ✨ NEW
│   ├── store/
│   │   ├── useTimerStore.ts           # Timer state
│   │   ├── useTodoStore.ts            # Todo state
│   │   ├── useSettingsStore.ts        # Settings state
│   │   └── useStatsStore.ts           # Analytics state
│   ├── utils/
│   │   └── cn.ts                      # Class name utility
│   ├── App.tsx                        # Root component
│   ├── main.tsx                       # Entry point
│   └── index.css                      # Global styles
├── public/                             # Static assets
├── dist/                               # Production build
└── package.json
```

---

## 🎨 Design System

### Color Palette
```css
--background: #0A0A0A    /* Deep Black */
--surface: #1A1A1A       /* Card Background */
--accent: #FF5722        /* Electric Orange */
--text-main: #E0E0E0     /* Primary Text */
--text-dim: #999999      /* Secondary Text */
```

### Typography
- **Font:** Inter (Google Fonts)
- **Scale:** 8px base grid
- **Weights:** 400 (Regular), 600 (Semibold), 700 (Bold)

### Animations
- **Duration:** 200-800ms
- **Easing:** `cubic-bezier(0.4, 0, 0.2, 1)`
- **Spring physics:** Framer Motion defaults

---

## 📊 Performance Metrics

### Bundle Size (Production)

| Asset | Size | Gzipped |
|-------|------|---------|
| **Main Bundle** | 353.84 kB | **112.92 kB** ✅ |
| Stats Chunk (lazy) | 345.18 kB | 104.71 kB |
| CSS | 19.85 kB | 4.41 kB |
| **Initial Load** | - | **~117 kB** ✅ |

### Latest Optimizations
- **Theme system:** RGB CSS variables for opacity modifiers (-9 kB)
- **Sonic branding:** Pure Web Audio API (zero external files)
- **Code splitting:** Stats modal lazy loaded
- **Tree shaking:** Tailwind CSS purged to 4.4 kB gzipped

---

## 🔧 Configuration

### Custom Settings
All settings are persisted to `localStorage`:

- **Timer Durations** - Customize work/break lengths
- **Sound Notifications** - Toggle audio alerts
- **Preset Templates** - Quick duration presets
- **Statistics History** - 7-day rolling window

### Browser Support
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ⚠️ IE11 not supported (modern browsers only)

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Standards
- TypeScript strict mode
- ESLint rules enforced
- Prettier for formatting
- Conventional commits

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Design Inspiration:** Apple Design Language, Notion, Linear
- **Icons:** [Lucide Icons](https://lucide.dev/)
- **Charts:** [Recharts](https://recharts.org/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)

---

## 📧 Contact

**Author:** [fth530](https://github.com/fth530)  
**Project Link:** [https://github.com/fth530/rexx-focus](https://github.com/fth530/rexx-focus)

---

<div align="center">

**⭐ Star this repo if you find it useful!**

Made with ❤️ and ☕ by a developer who loves deep work.

</div>

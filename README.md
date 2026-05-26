<div align="center">

# 🇩🇪 SnowB German AI

### Learn German from A1 to B2 — with AI, real dialogues, and gamification

[![CI/CD](https://github.com/YOUR_USERNAME/snowb-german-ai/actions/workflows/expo.yml/badge.svg)](https://github.com/YOUR_USERNAME/snowb-german-ai/actions/workflows/expo.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Expo SDK](https://img.shields.io/badge/Expo_SDK-51-black?logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React_Native-0.74-61DAFB?logo=react)](https://reactnative.dev)
[![EAS Build](https://img.shields.io/badge/EAS_Build-ready-4630EB?logo=expo)](https://docs.expo.dev/build/introduction/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)

<img src="docs/screenshot-home.png" width="250" alt="Home screen" />
<img src="docs/screenshot-ai.png" width="250" alt="AI Tutor" />
<img src="docs/screenshot-quiz.png" width="250" alt="Quiz" />

**Duolingo-quality German learning app built with React Native + Expo + Claude AI**  
Multilingual: 🇫🇷 French · 🇩🇿 Arabic · 🇩🇪 German

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Tutor** | Real-time conversation with Claude AI in German |
| 🎤 **Voice Speaking** | Record yourself, get AI pronunciation feedback |
| 📚 **4 Levels** | A1 → A2 → B1 → B2 structured curriculum |
| 💬 **8 Dialogues** | Airport, restaurant, hospital, work, hotel & more |
| 📖 **Vocabulary** | DE + FR + AR translations, articles, TTS audio |
| 🔤 **Grammar** | Articles, conjugation, 4 cases with exercises |
| 🎯 **Gamified Quiz** | MCQ, fill-in-blank, listening with lives + XP |
| 🔥 **Streak System** | Daily streaks, XP points, leaderboard |
| 🏆 **Achievements** | Unlock badges for completing milestones |
| 📊 **Progress Stats** | Skill bars, weekly XP chart, rank |
| 🌙 **Dark Mode** | Full dark/light theme support |
| 📡 **Offline Mode** | Lessons cached locally with Async Storage |
| 🔔 **Notifications** | Daily learning reminders |

---

## 🛠️ Tech Stack

```
Frontend          React Native 0.74 + TypeScript 5.3
Framework         Expo SDK 51
Navigation        React Navigation 6 (Stack + Bottom Tabs)
State             Zustand 4 + AsyncStorage (offline persistence)
AI / LLM          Anthropic Claude (claude-sonnet-4)
Backend           Firebase 10 (Auth + Firestore)
TTS               expo-speech (native German voice)
Audio             expo-av (recording + playback)
Animations        react-native-reanimated 3 + react-native-animatable
Build             EAS Build (Expo Application Services)
CI/CD             GitHub Actions
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** — [nodejs.org](https://nodejs.org)
- **npm 9+** — bundled with Node
- **Expo CLI** — installed automatically via npx
- **EAS CLI** — `npm install -g eas-cli`
- **Expo account** — free at [expo.dev](https://expo.dev)

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/snowb-german-ai.git
cd snowb-german-ai
npm install
```

### 2. Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Fill in your keys (see .env.example for guidance)
nano .env
```

Required keys:
| Variable | Where to get it |
|----------|----------------|
| `EXPO_PUBLIC_ANTHROPIC_KEY` | [console.anthropic.com](https://console.anthropic.com) |
| `EXPO_PUBLIC_FIREBASE_*` | [console.firebase.google.com](https://console.firebase.google.com) |
| `EXPO_TOKEN` | [expo.dev → Account → Access Tokens](https://expo.dev/accounts) |

### 3. Fonts

Download **Nunito** from Google Fonts → place in `assets/fonts/`:

```bash
# Using curl (or download manually from fonts.google.com/specimen/Nunito)
mkdir -p assets/fonts
# Place these files:
# assets/fonts/Nunito-Regular.ttf
# assets/fonts/Nunito-SemiBold.ttf
# assets/fonts/Nunito-Bold.ttf
# assets/fonts/Nunito-ExtraBold.ttf
# assets/fonts/Nunito-Black.ttf
```

### 4. Firebase Setup (Optional)

1. Create project at [console.firebase.google.com](https://console.firebase.google.com)
2. Add an **Android app** with package name: `com.snowb.germanlanguage`
3. Download `google-services.json` → place in project root
4. Enable **Email/Password** and **Google** authentication

> ⚠️ `google-services.json` is in `.gitignore` — never commit it.

### 5. Run the App

```bash
# Expo Go (fastest — no build required)
npm start
# Press 'a' for Android emulator, or scan QR with Expo Go app

# Run on physical Android device
npm run android

# Clear cache and restart
npm run start:clear
```

---

## 📱 Building the APK

### Option A: EAS Cloud Build (Recommended — free tier)

```bash
# Login to Expo
eas login

# Initialize EAS project (first time only)
eas init

# Preview APK (internal distribution)
npm run build:preview

# Production APK (internal distribution)
npm run build:prod:apk

# Production AAB (for Google Play Store)
npm run build:prod
```

The download link appears in your terminal. Builds also appear at `expo.dev`.

### Option B: Local Build

```bash
# Generate native Android folder
npm run expo:prebuild:android

# Build debug APK
cd android && ./gradlew assembleDebug

# APK location:
# android/app/build/outputs/apk/debug/app-debug.apk
```

### Option C: Install via ADB

```bash
# If you have Android device connected via USB
adb install path/to/app.apk
```

---

## 🔁 CI/CD Pipeline

### Workflow Overview

```
┌─────────────────────────────────────────────────────────────┐
│  Push to main / PR                                          │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  JOB 1: CI — runs on every push & PR                 │  │
│  │  ✅ npm ci                                            │  │
│  │  🔷 TypeScript noEmit check                          │  │
│  │  🔍 ESLint (0 warnings allowed)                      │  │
│  │  💅 Prettier format check                            │  │
│  │  🧪 Jest unit tests                                  │  │
│  │  🏥 expo-doctor validation                           │  │
│  │  🔐 Secret leak detection                            │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓ (only on push to main)           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  JOB 2: EAS Build — Preview APK                      │  │
│  │  🔑 Inject secrets from GitHub                       │  │
│  │  🏗️ eas build --profile preview                     │  │
│  │  📊 Post summary to GitHub Actions                   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

  Manual dispatch → can trigger production build
```

### GitHub Secrets Setup

Go to: **GitHub Repo → Settings → Secrets and variables → Actions → New repository secret**

| Secret Name | Description |
|-------------|-------------|
| `EXPO_TOKEN` | Expo access token for EAS authentication |
| `ANTHROPIC_API_KEY` | Claude AI API key |
| `FIREBASE_API_KEY` | Firebase web config |
| `FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `FIREBASE_PROJECT_ID` | Firebase project ID |
| `FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging ID |
| `FIREBASE_APP_ID` | Firebase app ID |
| `GOOGLE_SERVICES_JSON_BASE64` | `base64 -w 0 google-services.json` |

### Manual Build Dispatch

You can trigger builds manually from **Actions → 🇩🇪 SnowB German AI CI/CD → Run workflow** and choose:
- Profile: `preview` / `production-apk` / `production`
- Platform: `android` / `all`

---

## 📁 Project Structure

```
snowb-german-ai/
│
├── App.tsx                          # Root component — fonts, splash, nav
├── index.js                         # Expo entry point (registerRootComponent)
├── app.json                         # Expo config — app metadata, plugins
├── eas.json                         # EAS Build — build profiles
├── babel.config.js                  # Babel — presets, path aliases
├── tsconfig.json                    # TypeScript — strict mode, path aliases
├── .eslintrc.js                     # ESLint rules
├── .prettierrc                      # Prettier code style
├── .env.example                     # Environment variable template
│
├── .github/
│   └── workflows/
│       ├── expo.yml                 # Main CI/CD — lint + EAS build
│       └── pr-checks.yml           # PR quality gate
│
├── src/
│   ├── screens/
│   │   ├── AuthScreen.tsx           # Login · Signup · Google OAuth
│   │   ├── HomeScreen.tsx           # Dashboard — streak, XP, missions
│   │   ├── CourseScreen.tsx         # A1→B2 lesson browser
│   │   ├── ConversationsScreen.tsx  # Dialogue scenario list
│   │   ├── DialogScreen.tsx         # Full dialogue + TTS + FR/AR
│   │   ├── AITutorScreen.tsx        # Claude AI chatbot
│   │   ├── QuizScreen.tsx           # Gamified quiz (MCQ + fill)
│   │   ├── VocabularyScreen.tsx     # Word cards with TTS + favorites
│   │   ├── GrammarScreen.tsx        # Grammar rules + exercises
│   │   └── ProgressScreen.tsx       # Stats · skills · leaderboard
│   │
│   ├── navigation/
│   │   └── AppNavigator.tsx         # Bottom tabs + stack navigator
│   │
│   ├── context/
│   │   └── store.ts                 # Zustand global state + persistence
│   │
│   ├── services/
│   │   ├── aiService.ts             # Anthropic Claude API integration
│   │   ├── firebase.ts              # Firebase auth + Firestore
│   │   ├── notifications.ts         # Expo push notifications
│   │   └── offlineStorage.ts        # Cache + file download
│   │
│   ├── data/
│   │   └── germanData.ts            # Vocabulary · dialogues · grammar data
│   │
│   └── utils/
│       └── theme.ts                 # Colors · fonts · spacing · shadows
│
└── assets/
    ├── fonts/                       # Nunito font files (add manually)
    └── images/                      # App icon · splash · adaptive icon
```

---

## 🧪 Development Commands

```bash
# Start dev server
npm start

# Type checking (no emit)
npm run type-check

# Lint with auto-fix
npm run lint:fix

# Format all files
npm run format

# Run tests
npm test

# Run all validations (type + lint + format)
npm run validate

# Check Expo config for issues
npm run expo:doctor

# Prebuild native code (needed for local builds)
npm run expo:prebuild

# EAS builds
npm run build:preview          # Cloud APK — internal
npm run build:prod:apk         # Cloud APK — production
npm run build:prod             # Cloud AAB — for Play Store
```

---

## 🌍 Deployment — Google Play Store

### 1. Prepare production build

```bash
eas build --platform android --profile production
```

### 2. Submit to Play Store

```bash
# Requires google-play-key.json (service account)
# See: https://docs.expo.dev/submit/android/
eas submit --platform android
```

### 3. OTA Updates (no new build needed)

```bash
# Push JS-only updates instantly via EAS Update
npm run update

# Update preview channel
npm run update:preview -- --message "Fix quiz scoring"
```

---

## 🤝 Contributing

1. Fork the repo
2. Create branch: `git checkout -b feat/my-feature`
3. Make changes + ensure `npm run validate` passes
4. Commit: `git commit -m 'feat: add my feature'`
5. Push & open a Pull Request → CI runs automatically

### Commit Convention

```
feat:     New feature
fix:      Bug fix
refactor: Code refactoring
docs:     Documentation
style:    Formatting only
test:     Tests
chore:    Build/config changes
```

---

## 📄 License

MIT © 2024 SnowB Team

---

<div align="center">

Built with ❤️ using **React Native** · **Expo** · **Claude AI**

⭐ Star this repo if it helped you!

</div>

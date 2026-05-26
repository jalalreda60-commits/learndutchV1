// src/context/store.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserState {
  uid: string | null;
  name: string;
  email: string;
  xp: number;
  level: string;
  streak: number;
  progress: { a1: number; a2: number; b1: number; b2: number };
  skills: { speaking: number; listening: number; reading: number; writing: number; grammar: number };
  completedLessons: string[];
  favorites: string[];
  achievements: string[];
  dailyGoal: number;
  isDarkMode: boolean;
  isOffline: boolean;
  activeScreen: string;
}

interface Actions {
  setUser: (user: Partial<UserState>) => void;
  addXP: (amount: number) => void;
  toggleFavorite: (wordId: string) => void;
  completeLesson: (lessonId: string) => void;
  toggleDarkMode: () => void;
  setOffline: (val: boolean) => void;
  resetUser: () => void;
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
}

const defaultState: UserState = {
  uid: null, name: 'Utilisateur', email: '', xp: 2450, level: 'B1', streak: 12,
  progress: { a1: 100, a2: 100, b1: 65, b2: 0 },
  skills: { speaking: 72, listening: 68, reading: 80, writing: 55, grammar: 63 },
  completedLessons: ['l1', 'l2', 'l3', 'l4'],
  favorites: [], achievements: ['a1', 'a2', 'a3', 'a6'],
  dailyGoal: 50, isDarkMode: true, isOffline: false, activeScreen: 'home',
};

export const useStore = create<UserState & Actions>((set, get) => ({
  ...defaultState,

  setUser: (user) => set((s) => ({ ...s, ...user })),

  addXP: (amount) => set((s) => {
    const newXP = s.xp + amount;
    const level = newXP < 500 ? 'A1' : newXP < 1500 ? 'A2' : newXP < 3000 ? 'B1' : 'B2';
    return { xp: newXP, level };
  }),

  toggleFavorite: (wordId) => set((s) => ({
    favorites: s.favorites.includes(wordId)
      ? s.favorites.filter(f => f !== wordId)
      : [...s.favorites, wordId],
  })),

  completeLesson: (lessonId) => set((s) => ({
    completedLessons: s.completedLessons.includes(lessonId)
      ? s.completedLessons
      : [...s.completedLessons, lessonId],
  })),

  toggleDarkMode: () => set((s) => ({ isDarkMode: !s.isDarkMode })),
  setOffline: (val) => set({ isOffline: val }),
  resetUser: () => set(defaultState),

  loadFromStorage: async () => {
    try {
      const data = await AsyncStorage.getItem('snowb_user');
      if (data) set({ ...JSON.parse(data) });
    } catch (e) { console.warn('Load error:', e); }
  },

  saveToStorage: async () => {
    try {
      const s = get();
      const toSave = { uid: s.uid, name: s.name, email: s.email, xp: s.xp, level: s.level, streak: s.streak, progress: s.progress, skills: s.skills, completedLessons: s.completedLessons, favorites: s.favorites, achievements: s.achievements, isDarkMode: s.isDarkMode };
      await AsyncStorage.setItem('snowb_user', JSON.stringify(toSave));
    } catch (e) { console.warn('Save error:', e); }
  },
}));

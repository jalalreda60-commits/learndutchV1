// src/services/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "snowb-german-ai.firebaseapp.com",
  projectId: "snowb-german-ai",
  storageBucket: "snowb-german-ai.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ========= USER MANAGEMENT =========
export const createUser = async (email: string, password: string, name: string) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, 'users', cred.user.uid), {
    name, email, uid: cred.user.uid,
    xp: 0, level: 'A1', streak: 0, lastLogin: new Date().toISOString(),
    progress: { a1: 0, a2: 0, b1: 0, b2: 0 },
    skills: { speaking: 0, listening: 0, reading: 0, writing: 0, grammar: 0 },
    completedLessons: [], favorites: [], achievements: [],
    dailyGoal: 50, createdAt: new Date().toISOString(),
  });
  return cred;
};

export const loginUser = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = async () => signOut(auth);

export const getUserData = async (uid: string) => {
  const d = await getDoc(doc(db, 'users', uid));
  return d.exists() ? d.data() : null;
};

export const updateUserProgress = async (uid: string, data: Record<string, unknown>) => {
  await updateDoc(doc(db, 'users', uid), { ...data, updatedAt: new Date().toISOString() });
};

export const addXP = async (uid: string, xpToAdd: number, currentXP: number) => {
  const newXP = currentXP + xpToAdd;
  const level = calculateLevel(newXP);
  await updateDoc(doc(db, 'users', uid), { xp: newXP, level });
  return { newXP, level };
};

export const getLeaderboard = async () => {
  const q = query(collection(db, 'users'), orderBy('xp', 'desc'), limit(20));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const updateStreak = async (uid: string, lastLogin: string, currentStreak: number) => {
  const lastDate = new Date(lastLogin);
  const today = new Date();
  const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
  const newStreak = diffDays === 1 ? currentStreak + 1 : diffDays === 0 ? currentStreak : 1;
  await updateDoc(doc(db, 'users', uid), { streak: newStreak, lastLogin: today.toISOString() });
  return newStreak;
};

// ========= HELPERS =========
export const calculateLevel = (xp: number): string => {
  if (xp < 500) return 'A1';
  if (xp < 1500) return 'A2';
  if (xp < 3000) return 'B1';
  return 'B2';
};

export const getLevelProgress = (xp: number) => {
  const thresholds = [0, 500, 1500, 3000, 5000];
  let idx = 0;
  for (let i = 0; i < thresholds.length - 1; i++) {
    if (xp >= thresholds[i] && xp < thresholds[i + 1]) { idx = i; break; }
  }
  const progress = (xp - thresholds[idx]) / (thresholds[idx + 1] - thresholds[idx]);
  return Math.min(progress, 1);
};

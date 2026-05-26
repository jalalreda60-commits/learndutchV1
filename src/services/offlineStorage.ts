// src/services/offlineStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const CACHE_DIR = `${FileSystem.documentDirectory}snowb_cache/`;

export const initCacheDir = async () => {
  const info = await FileSystem.getInfoAsync(CACHE_DIR);
  if (!info.exists) await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true });
};

export const cacheLesson = async (lessonId: string, data: object) => {
  try {
    await AsyncStorage.setItem(`lesson_${lessonId}`, JSON.stringify({ ...data, cachedAt: Date.now() }));
  } catch (e) { console.warn('Cache error:', e); }
};

export const getCachedLesson = async (lessonId: string) => {
  try {
    const raw = await AsyncStorage.getItem(`lesson_${lessonId}`);
    if (!raw) return null;
    const data = JSON.parse(raw);
    // Expire after 7 days
    if (Date.now() - data.cachedAt > 7 * 24 * 60 * 60 * 1000) {
      await AsyncStorage.removeItem(`lesson_${lessonId}`);
      return null;
    }
    return data;
  } catch { return null; }
};

export const downloadAudioFile = async (url: string, filename: string): Promise<string> => {
  await initCacheDir();
  const path = `${CACHE_DIR}${filename}`;
  const info = await FileSystem.getInfoAsync(path);
  if (info.exists) return path;
  const result = await FileSystem.downloadAsync(url, path);
  return result.uri;
};

export const clearCache = async () => {
  const keys = await AsyncStorage.getAllKeys();
  const lessonKeys = keys.filter(k => k.startsWith('lesson_'));
  await AsyncStorage.multiRemove(lessonKeys);
  try {
    await FileSystem.deleteAsync(CACHE_DIR, { idempotent: true });
  } catch { /* directory may not exist yet — safe to ignore */ }
};

export const getCacheSize = async (): Promise<string> => {
  try {
    const info = await FileSystem.getInfoAsync(CACHE_DIR, { size: true });
    if (!info.exists) return '0 MB';
    const size = (info as FileSystem.FileInfo & { size: number }).size;
    const mb = (size / (1024 * 1024)).toFixed(1);
    return `${mb} MB`;
  } catch { return '0 MB'; }
};

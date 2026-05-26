// src/screens/CourseScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../context/store';
import { LEVELS_DATA } from '../data/germanData';
import { Colors, BorderRadius } from '../utils/theme';

interface Lesson {
  id: string; icon: string; title: string; desc: string;
  type: string; xp: number; done: boolean; screen: string; locked?: boolean;
}

const LESSON_TABS = ['Tout', 'Vocabulaire', 'Grammaire', 'Dialogues', 'Écoute', 'Écriture'];

const LESSONS_BY_LEVEL: Record<string, Lesson[]> = {
  a1: [
    { id: 'la1-1', icon: '👋', title: 'Salutations', desc: 'Bonjour, merci, au revoir...', type: 'Vocabulaire', xp: 20, done: true, screen: 'Vocabulary' },
    { id: 'la1-2', icon: '👨‍👩‍👧', title: 'La famille', desc: 'Mère, père, frère, sœur...', type: 'Vocabulaire', xp: 20, done: true, screen: 'Vocabulary' },
    { id: 'la1-3', icon: '🔤', title: 'Articles der/die/das', desc: 'Le genre des noms', type: 'Grammaire', xp: 25, done: true, screen: 'Grammar' },
    { id: 'la1-4', icon: '🎯', title: 'Quiz A1', desc: 'Testez vos connaissances', type: 'Quiz', xp: 30, done: true, screen: 'Quiz' },
    { id: 'la1-5', icon: '🎧', title: 'Écoute A1', desc: 'Sons et prononciations', type: 'Écoute', xp: 20, done: false, screen: 'Conversations' },
  ],
  a2: [
    { id: 'la2-1', icon: '🏙️', title: 'La ville', desc: 'Gare, hôpital, marché...', type: 'Vocabulaire', xp: 25, done: true, screen: 'Vocabulary' },
    { id: 'la2-2', icon: '⏰', title: 'Conjugaison', desc: 'Présent (Präsens)', type: 'Grammaire', xp: 30, done: true, screen: 'Grammar' },
    { id: 'la2-3', icon: '🍽️', title: 'Au restaurant', desc: 'Dialogue complet', type: 'Dialogues', xp: 35, done: false, screen: 'Dialog' },
    { id: 'la2-4', icon: '✈️', title: 'Voyage', desc: 'Billet, passeport, vol', type: 'Vocabulaire', xp: 25, done: false, screen: 'Conversations' },
  ],
  b1: [
    { id: 'lb1-1', icon: '📖', title: 'Vocabulaire quotidien', desc: '150 mots essentiels B1', type: 'Vocabulaire', xp: 25, done: true, screen: 'Vocabulary' },
    { id: 'lb1-2', icon: '⚙️', title: 'Les 4 cas', desc: 'Nominatif, Accusatif, Datif', type: 'Grammaire', xp: 35, done: false, screen: 'Grammar' },
    { id: 'lb1-3', icon: '💼', title: 'Dialogue : Travail', desc: 'Entretien professionnel', type: 'Dialogues', xp: 40, done: false, screen: 'Dialog' },
    { id: 'lb1-4', icon: '🎤', title: 'Prononciation IA', desc: 'Feedback en temps réel', type: 'Parler', xp: 30, done: false, screen: 'AITutor' },
    { id: 'lb1-5', icon: '📰', title: 'Lecture : Actualités', desc: 'Textes B1 avec questions', type: 'Écoute', xp: 30, done: false, screen: 'Conversations' },
    { id: 'lb1-6', icon: '✏️', title: 'Écriture guidée', desc: 'Paragraphes & correction IA', type: 'Écriture', xp: 35, done: false, screen: 'AITutor' },
  ],
  b2: [
    { id: 'lb2-1', icon: '🗞️', title: 'Presse allemande', desc: 'Articles complexes', type: 'Écoute', xp: 40, done: false, locked: true, screen: 'Conversations' },
    { id: 'lb2-2', icon: '🎭', title: 'Expression idiomatique', desc: 'Expressions B2', type: 'Vocabulaire', xp: 35, done: false, locked: true, screen: 'Vocabulary' },
    { id: 'lb2-3', icon: '📊', title: 'Rédaction formelle', desc: 'Lettres, rapports', type: 'Écriture', xp: 50, done: false, locked: true, screen: 'AITutor' },
  ],
};

const TYPE_COLORS: Record<string, string> = {
  Vocabulaire: Colors.blue, Grammaire: Colors.accent, Dialogues: Colors.gold,
  Quiz: Colors.green, Écoute: Colors.accent2, Parler: Colors.orange, Écriture: Colors.purple,
};

export default function CourseScreen() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nav = useNavigation<any>();
  const { completedLessons } = useStore();
  const [selectedLevel, setSelectedLevel] = useState('b1');
  const [selectedTab, setSelectedTab] = useState('Tout');

  const currentLevelData = LEVELS_DATA.find(l => l.id === selectedLevel) ?? LEVELS_DATA[2];
  const lessons = LESSONS_BY_LEVEL[selectedLevel] ?? [];
  const filtered = selectedTab === 'Tout' ? lessons : lessons.filter(l => l.type === selectedTab);

  const LEVEL_GRADS: Record<string, [string, string]> = {
    a1: ['#667eea', '#764ba2'], a2: ['#f093fb', '#f5576c'],
    b1: ['#4facfe', '#00f2fe'], b2: ['#43e97b', '#38f9d7'],
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={[Colors.bg2, Colors.bg]} style={styles.header}>
        <Text style={styles.headerTitle}>📚 Cours d&apos;allemand</Text>

        {/* Level selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
          {LEVELS_DATA.map(lvl => (
            <TouchableOpacity
              key={lvl.id}
              onPress={() => !lvl.locked && setSelectedLevel(lvl.id)}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={selectedLevel === lvl.id ? LEVEL_GRADS[lvl.id] : [Colors.card, Colors.card2]}
                style={[styles.levelBtn, lvl.locked && styles.levelBtnLocked]}
              >
                <Text style={styles.levelBtnLabel}>{lvl.label}</Text>
                <Text style={styles.levelBtnName}>{lvl.name}</Text>
                {lvl.locked && <Text style={styles.lockIcon}>🔒</Text>}
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      {/* Level info banner */}
      <LinearGradient colors={LEVEL_GRADS[selectedLevel]} style={styles.levelBanner}>
        <View style={styles.levelBannerLeft}>
          <Text style={styles.levelBannerTitle}>{currentLevelData.label} — {currentLevelData.name}</Text>
          <Text style={styles.levelBannerSub}>{currentLevelData.description}</Text>
          <View style={styles.levelProgRow}>
            <View style={styles.levelProgBg}>
              <View style={[styles.levelProgFill, { width: `${currentLevelData.progress}%` }]} />
            </View>
            <Text style={styles.levelProgText}>{currentLevelData.progress}%</Text>
          </View>
        </View>
        <Text style={{ fontSize: 40 }}>{currentLevelData.icon}</Text>
      </LinearGradient>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
        {LESSON_TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.tabActive]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[styles.tabText, selectedTab === tab && { color: '#fff' }]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lessons */}
      <ScrollView contentContainerStyle={styles.lessons} showsVerticalScrollIndicator={false}>
        {filtered.map((lesson, i) => {
          const isDone = lesson.done || completedLessons.includes(lesson.id);
          return (
            <TouchableOpacity
              key={lesson.id}
              style={[styles.lessonCard, lesson.locked && styles.lessonLocked]}
              onPress={() => !lesson.locked && nav.navigate(lesson.screen)}
              activeOpacity={0.85}
            >
              {/* Left icon */}
              <View style={[styles.lessonIcon, { backgroundColor: `${TYPE_COLORS[lesson.type]}20` }]}>
                <Text style={{ fontSize: 24 }}>{lesson.icon}</Text>
              </View>

              {/* Info */}
              <View style={styles.lessonInfo}>
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                <Text style={styles.lessonDesc}>{lesson.desc}</Text>
                <View style={styles.lessonMeta}>
                  <View style={[styles.typePill, { backgroundColor: `${TYPE_COLORS[lesson.type]}20` }]}>
                    <Text style={[styles.typePillText, { color: TYPE_COLORS[lesson.type] }]}>{lesson.type}</Text>
                  </View>
                  <View style={styles.xpPill}>
                    <Text style={styles.xpPillText}>+{lesson.xp} XP</Text>
                  </View>
                </View>
              </View>

              {/* Status */}
              <View style={styles.lessonStatus}>
                {lesson.locked ? (
                  <Text style={{ fontSize: 22 }}>🔒</Text>
                ) : isDone ? (
                  <Text style={{ fontSize: 22 }}>✅</Text>
                ) : i === 0 || lessons[i - 1]?.done ? (
                  <LinearGradient colors={[Colors.accent, Colors.blue]} style={styles.playPill}>
                    <Text style={styles.playPillText}>▶</Text>
                  </LinearGradient>
                ) : (
                  <Text style={{ fontSize: 22, opacity: 0.5 }}>⏳</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}

        {filtered.length === 0 && (
          <View style={styles.emptyWrap}>
            <Text style={{ fontSize: 40 }}>📭</Text>
            <Text style={styles.emptyText}>Aucune leçon dans cette catégorie</Text>
          </View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingTop: 60, paddingHorizontal: 16, paddingBottom: 14, gap: 14 },
  headerTitle: { fontSize: 22, fontWeight: '900', color: Colors.text },
  levelBtn: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: BorderRadius.md, minWidth: 90, alignItems: 'center', position: 'relative' },
  levelBtnLocked: { opacity: 0.5 },
  levelBtnLabel: { fontSize: 18, fontWeight: '900', color: '#fff' },
  levelBtnName: { fontSize: 10, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  lockIcon: { position: 'absolute', top: 4, right: 4, fontSize: 12 },
  levelBanner: { marginHorizontal: 16, borderRadius: BorderRadius.lg, padding: 18, flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  levelBannerLeft: { flex: 1 },
  levelBannerTitle: { fontSize: 17, fontWeight: '900', color: '#fff' },
  levelBannerSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 4, marginBottom: 10 },
  levelProgRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  levelProgBg: { flex: 1, height: 8, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 50, overflow: 'hidden' },
  levelProgFill: { height: '100%', backgroundColor: '#fff', borderRadius: 50 },
  levelProgText: { fontSize: 13, fontWeight: '800', color: '#fff' },
  tabsScroll: { maxHeight: 50, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: BorderRadius.full, backgroundColor: Colors.card, marginVertical: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  tabActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  tabText: { fontSize: 12, fontWeight: '700', color: Colors.text2 },
  lessons: { padding: 16, gap: 10 },
  lessonCard: { backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  lessonLocked: { opacity: 0.5 },
  lessonIcon: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  lessonInfo: { flex: 1 },
  lessonTitle: { fontSize: 14, fontWeight: '800', color: Colors.text },
  lessonDesc: { fontSize: 12, color: Colors.text2, marginTop: 2 },
  lessonMeta: { flexDirection: 'row', gap: 8, marginTop: 8 },
  typePill: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: BorderRadius.full },
  typePillText: { fontSize: 11, fontWeight: '700' },
  xpPill: { backgroundColor: 'rgba(0,208,132,0.15)', paddingHorizontal: 10, paddingVertical: 3, borderRadius: BorderRadius.full },
  xpPillText: { fontSize: 11, fontWeight: '700', color: Colors.green },
  lessonStatus: { alignItems: 'center', justifyContent: 'center' },
  playPill: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  playPillText: { fontSize: 14, color: '#fff' },
  emptyWrap: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, color: Colors.text2, fontWeight: '600' },
});

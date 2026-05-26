// src/screens/HomeScreen.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../context/store';
import { Colors, Spacing, BorderRadius } from '../utils/theme';
import { LEVELS_DATA, CONVERSATIONS } from '../data/germanData';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nav = useNavigation<any>();
  const { name, xp, level, streak } = useStore();
  const xpAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.timing(xpAnim, { toValue: 0.65, duration: 1200, delay: 300, useNativeDriver: false }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const MISSIONS = [
    { icon: '📚', title: 'Apprendre 10 mots', xp: 20, done: true, screen: 'Vocabulary' },
    { icon: '🎤', title: 'Parler 5 minutes', xp: 30, done: false, screen: 'AITutor' },
    { icon: '📝', title: 'Compléter un quiz', xp: 25, done: false, screen: 'Quiz' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        
        {/* Header */}
        <LinearGradient colors={['#1a1a2e', Colors.bg]} style={styles.header}>
          <View style={styles.headerRow}>
            <View style={styles.userInfo}>
              <LinearGradient colors={[Colors.accent, Colors.accent2]} style={styles.avatar}>
                <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
              </LinearGradient>
              <View>
                <Text style={styles.greeting}>Hallo, {name}! 👋</Text>
                <Text style={styles.subGreeting}>Niveau {level} · Continuez !</Text>
              </View>
            </View>
            <View style={styles.statsRow}>
              <TouchableOpacity style={styles.statBadge}>
                <Text style={styles.statText}>🔥 {streak}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.statBadge}>
                <Text style={styles.statText}>⭐ {xp.toLocaleString()}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          
          {/* Streak Banner */}
          <LinearGradient colors={['#ff6b35', '#f7931e']} style={styles.streakBanner}>
            <View>
              <Text style={styles.streakNum}>{streak} 🔥</Text>
              <Text style={styles.streakLabel}>Jours consécutifs</Text>
            </View>
            <View style={styles.streakBadge}>
              <Text style={styles.streakBadgeText}>Continue !</Text>
            </View>
          </LinearGradient>

          {/* XP Progress */}
          <View style={styles.xpCard}>
            <LinearGradient colors={[Colors.accent, Colors.blue]} style={styles.xpCircle}>
              <Text style={styles.xpLevelText}>{level}</Text>
              <Text style={styles.xpLabel}>niveau</Text>
            </LinearGradient>
            <View style={styles.xpDetails}>
              <Text style={styles.xpTitle}>{xp.toLocaleString()} XP ce mois</Text>
              <Text style={styles.xpSub}>550 XP pour atteindre B2</Text>
              <View style={styles.xpBarBg}>
                <Animated.View style={[styles.xpBarFill, {
                  width: xpAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '65%'] })
                }]} />
              </View>
            </View>
          </View>

          {/* Levels */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Niveaux du cours</Text>
            <TouchableOpacity onPress={() => nav.navigate('Course')}>
              <Text style={styles.seeAll}>Voir tout →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.levelsGrid}>
            {LEVELS_DATA.map((lvl) => (
              <TouchableOpacity
                key={lvl.id}
                onPress={() => !lvl.locked && nav.navigate('Course', { level: lvl.id })}
                activeOpacity={0.8}
                style={styles.levelCardWrap}
              >
                <LinearGradient
                  colors={lvl.gradient as [string, string]}
                  style={[styles.levelCard, lvl.locked && styles.levelCardLocked]}
                >
                  <Text style={styles.levelIcon}>{lvl.locked ? '🔒' : lvl.icon}</Text>
                  <Text style={styles.levelLabel}>{lvl.label}</Text>
                  <Text style={styles.levelName}>{lvl.name}</Text>
                  <Text style={styles.levelProgress}>
                    {lvl.locked ? 'Verrouillé' : `${lvl.progress}% ${lvl.progress === 100 ? '✓' : 'en cours'}`}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          {/* Daily Missions */}
          <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 12 }]}>Missions du jour</Text>
          <View style={styles.missionsCard}>
            {MISSIONS.map((m, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.missionRow, i < MISSIONS.length - 1 && styles.missionBorder]}
                onPress={() => nav.navigate(m.screen)}
              >
                <View style={[styles.missionIcon, { backgroundColor: m.done ? 'rgba(0,208,132,0.15)' : 'rgba(108,99,255,0.15)' }]}>
                  <Text style={{ fontSize: 20 }}>{m.icon}</Text>
                </View>
                <View style={styles.missionInfo}>
                  <Text style={styles.missionTitle}>{m.title}</Text>
                  <Text style={[styles.missionXP, { color: Colors.gold }]}>+{m.xp} XP {m.done ? '✓' : ''}</Text>
                </View>
                <Text style={{ fontSize: 20 }}>{m.done ? '✅' : '▶️'}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Recent Conversations */}
          <View style={[styles.sectionHeader, { marginTop: 24 }]}>
            <Text style={styles.sectionTitle}>Conversations</Text>
            <TouchableOpacity onPress={() => nav.navigate('Conversations')}>
              <Text style={styles.seeAll}>Voir tout →</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.convScroll}>
            {CONVERSATIONS.slice(0, 4).map((c) => (
              <TouchableOpacity
                key={c.id}
                style={styles.convCard}
                onPress={() => nav.navigate('Dialog', { conversation: c })}
                activeOpacity={0.8}
              >
                <Text style={{ fontSize: 32 }}>{c.emoji}</Text>
                <Text style={styles.convTitle}>{c.titleFr}</Text>
                <Text style={styles.convLevel}>{c.level}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* CTA */}
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => nav.navigate('AITutor')}
            activeOpacity={0.9}
          >
            <LinearGradient colors={[Colors.accent, Colors.purple]} style={styles.ctaGrad}>
              <Text style={styles.ctaText}>🤖 Parler avec l&apos;IA</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingTop: 60, paddingHorizontal: Spacing.md, paddingBottom: Spacing.md },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 20, fontWeight: '900', color: '#fff' },
  greeting: { fontSize: 16, fontWeight: '800', color: Colors.text },
  subGreeting: { fontSize: 12, color: Colors.text2 },
  statsRow: { flexDirection: 'row', gap: 8 },
  statBadge: { backgroundColor: Colors.card, paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.full },
  statText: { fontSize: 13, fontWeight: '700', color: Colors.text },
  content: { padding: Spacing.md, paddingBottom: 100 },
  streakBanner: { borderRadius: BorderRadius.lg, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  streakNum: { fontSize: 32, fontWeight: '900', color: '#fff' },
  streakLabel: { fontSize: 13, color: 'rgba(255,255,255,0.85)' },
  streakBadge: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: BorderRadius.full, paddingHorizontal: 16, paddingVertical: 8 },
  streakBadgeText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  xpCard: { backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: 16, flexDirection: 'row', gap: 14, marginBottom: 8, alignItems: 'center' },
  xpCircle: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  xpLevelText: { fontSize: 18, fontWeight: '900', color: '#fff' },
  xpLabel: { fontSize: 10, color: 'rgba(255,255,255,0.7)' },
  xpDetails: { flex: 1 },
  xpTitle: { fontSize: 14, fontWeight: '700', color: Colors.text },
  xpSub: { fontSize: 12, color: Colors.text2, marginBottom: 8 },
  xpBarBg: { height: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 50, overflow: 'hidden' },
  xpBarFill: { flex: 1, borderRadius: 50, backgroundColor: Colors.accent },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.text },
  seeAll: { fontSize: 13, color: Colors.accent, fontWeight: '600' },
  levelsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 8 },
  levelCardWrap: { width: (width - 52) / 2 },
  levelCard: { borderRadius: BorderRadius.lg, padding: 18, overflow: 'hidden' },
  levelCardLocked: { opacity: 0.6 },
  levelIcon: { fontSize: 28, marginBottom: 4 },
  levelLabel: { fontSize: 22, fontWeight: '900', color: '#fff' },
  levelName: { fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: '600' },
  levelProgress: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 8 },
  missionsCard: { backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: 4 },
  missionRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
  missionBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  missionIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  missionInfo: { flex: 1 },
  missionTitle: { fontSize: 13, fontWeight: '700', color: Colors.text },
  missionXP: { fontSize: 11, fontWeight: '600' },
  convScroll: { marginBottom: 20 },
  convCard: { backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: 16, marginRight: 12, alignItems: 'center', width: 120, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  convTitle: { fontSize: 12, fontWeight: '700', color: Colors.text, marginTop: 8, textAlign: 'center' },
  convLevel: { fontSize: 10, color: Colors.text2, marginTop: 4 },
  ctaButton: { borderRadius: BorderRadius.lg, overflow: 'hidden', marginTop: 8 },
  ctaGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 18 },
  ctaText: { fontSize: 16, fontWeight: '800', color: '#fff' },
});

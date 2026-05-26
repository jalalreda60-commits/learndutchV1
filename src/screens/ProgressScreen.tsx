// src/screens/ProgressScreen.tsx
import React, { useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  Animated, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../context/store';
import { ACHIEVEMENTS } from '../data/germanData';
import { Colors, Spacing, BorderRadius } from '../utils/theme';

const { width } = Dimensions.get('window');

const MOCK_LEADERBOARD = [
  { rank: 1, name: 'Farid K.', xp: 3890, flag: '🇩🇿', medal: '🥇' },
  { rank: 2, name: 'Rania B.', xp: 3210, flag: '🇲🇦', medal: '🥈' },
  { rank: 3, name: 'Youssef M.', xp: 2980, flag: '🇹🇳', medal: '🥉' },
  { rank: 4, name: 'Nadia S.', xp: 2800, flag: '🇩🇿', medal: '' },
  { rank: 5, name: 'Karim L.', xp: 2700, flag: '🇫🇷', medal: '' },
];

const SKILL_ITEMS = [
  { key: 'speaking', label: 'Expression orale', icon: '🗣️', color: [Colors.accent, Colors.blue] as [string, string] },
  { key: 'listening', label: 'Compréhension', icon: '👂', color: [Colors.green, '#00b894'] as [string, string] },
  { key: 'reading', label: 'Lecture', icon: '📖', color: [Colors.gold, Colors.orange] as [string, string] },
  { key: 'writing', label: 'Écriture', icon: '✏️', color: [Colors.accent2, '#c0392b'] as [string, string] },
  { key: 'grammar', label: 'Grammaire', icon: '📚', color: ['#a29bfe', Colors.accent] as [string, string] },
];

const WEEKLY_XP = [120, 340, 180, 290, 410, 260, 190];
const DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const MAX_XP = Math.max(...WEEKLY_XP);

export default function ProgressScreen() {
  const { name, xp, level, streak, skills } = useStore();
  const skillAnims = useRef(SKILL_ITEMS.map(() => new Animated.Value(0))).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const userRank = 23;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    Animated.stagger(120,
      skillAnims.map((anim, i) =>
        Animated.timing(anim, {
          toValue: (skills[SKILL_ITEMS[i].key as keyof typeof skills] ?? 0) / 100,
          duration: 900, delay: 300, useNativeDriver: false,
        })
      )
    ).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getLevelProgress = () => {
    const thresholds = [0, 500, 1500, 3000, 5000];
    const labels = ['A1', 'A2', 'B1', 'B2'];
    const idx = labels.indexOf(level);
    if (idx < 0) return 1;
    const lo = thresholds[idx], hi = thresholds[idx + 1];
    return Math.min((xp - lo) / (hi - lo), 1);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View style={{ opacity: fadeAnim }}>

        {/* Header */}
        <LinearGradient colors={[Colors.bg2, Colors.bg]} style={styles.header}>
          <Text style={styles.headerTitle}>📊 Mes Progrès</Text>

          {/* Profile */}
          <View style={styles.profileCard}>
            <View style={styles.avatarWrap}>
              <LinearGradient colors={[Colors.accent, Colors.accent2]} style={styles.avatar}>
                <Text style={styles.avatarText}>{name.charAt(0)}</Text>
              </LinearGradient>
              <View style={styles.rankBadge}>
                <Text style={{ fontSize: 12 }}>🏆</Text>
              </View>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{name}</Text>
              <Text style={styles.profileRank}>Rang #{userRank} mondial 🌍</Text>
              <View style={styles.levelRow}>
                <Text style={styles.levelText}>Niveau {level}</Text>
                <View style={styles.levelBarBg}>
                  <Animated.View style={[styles.levelBarFill, {
                    width: `${Math.round(getLevelProgress() * 100)}%`
                  }]} />
                </View>
                <Text style={styles.levelNext}>→ {level === 'B2' ? '🏆' : ['A2', 'B1', 'B2'][['A1', 'A2', 'B1'].indexOf(level)] || '?'}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.content}>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            {[
              { val: streak, label: 'Série', icon: '🔥', color: Colors.orange },
              { val: xp.toLocaleString(), label: 'XP total', icon: '⭐', color: Colors.accent },
              { val: '48h', label: 'Temps total', icon: '⏱', color: Colors.blue },
              { val: '340', label: 'Mots appris', icon: '📚', color: Colors.green },
            ].map((s, i) => (
              <View key={i} style={styles.statCard}>
                <Text style={{ fontSize: 24 }}>{s.icon}</Text>
                <Text style={[styles.statVal, { color: s.color }]}>{s.val}</Text>
                <Text style={styles.statLbl}>{s.label}</Text>
              </View>
            ))}
          </View>

          {/* Weekly XP Chart */}
          <Text style={styles.sectionTitle}>XP cette semaine</Text>
          <View style={styles.chartCard}>
            <View style={styles.chart}>
              {WEEKLY_XP.map((v, i) => (
                <View key={i} style={styles.barCol}>
                  <Text style={styles.barVal}>{v}</Text>
                  <View style={styles.barBg}>
                    <LinearGradient
                      colors={[Colors.accent, Colors.blue]}
                      style={[styles.barFill, { height: `${(v / MAX_XP) * 100}%` }]}
                    />
                  </View>
                  <Text style={[styles.barDay, i === 6 && { color: Colors.accent }]}>{DAYS[i]}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Skills */}
          <Text style={styles.sectionTitle}>Compétences</Text>
          <View style={styles.skillsCard}>
            {SKILL_ITEMS.map((item, i) => {
              const pct = skills[item.key as keyof typeof skills] ?? 0;
              return (
                <View key={item.key} style={styles.skillRow}>
                  <View style={styles.skillLabel}>
                    <Text style={{ fontSize: 18 }}>{item.icon}</Text>
                    <Text style={styles.skillName}>{item.label}</Text>
                  </View>
                  <Text style={styles.skillPct}>{pct}%</Text>
                  <View style={styles.skillBarBg}>
                    <Animated.View style={{ height: '100%', borderRadius: 50, overflow: 'hidden', width: skillAnims[i].interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }}>
                      <LinearGradient colors={item.color} style={{ flex: 1 }} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
                    </Animated.View>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Achievements */}
          <Text style={styles.sectionTitle}>Succès</Text>
          <View style={styles.achievementGrid}>
            {ACHIEVEMENTS.map(ach => (
              <View
                key={ach.id}
                style={[styles.achCard, !ach.unlocked && styles.achLocked]}
              >
                <Text style={styles.achIcon}>{ach.icon}</Text>
                <Text style={styles.achTitle}>{ach.title}</Text>
                <Text style={styles.achDesc}>{ach.description}</Text>
                {!ach.unlocked && <View style={styles.achOverlay}><Text style={{ fontSize: 20 }}>🔒</Text></View>}
              </View>
            ))}
          </View>

          {/* Leaderboard */}
          <Text style={styles.sectionTitle}>Classement 🏆</Text>
          <View style={styles.leaderboard}>
            {MOCK_LEADERBOARD.map((user, i) => (
              <View key={i} style={[styles.lbRow, i < MOCK_LEADERBOARD.length - 1 && styles.lbBorder]}>
                <Text style={styles.lbRank}>{user.medal || `#${user.rank}`}</Text>
                <Text style={{ fontSize: 20 }}>{user.flag}</Text>
                <Text style={styles.lbName}>{user.name}</Text>
                <Text style={styles.lbXP}>⭐ {user.xp.toLocaleString()} XP</Text>
              </View>
            ))}
            {/* User row */}
            <View style={styles.userLbRow}>
              <Text style={[styles.lbRank, { color: Colors.accent }]}>#{userRank}</Text>
              <Text style={{ fontSize: 20 }}>🌍</Text>
              <Text style={[styles.lbName, { color: Colors.accent }]}>{name} (Toi)</Text>
              <Text style={[styles.lbXP, { color: Colors.gold }]}>⭐ {xp.toLocaleString()} XP</Text>
            </View>
          </View>

        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingTop: 60, paddingHorizontal: Spacing.md, paddingBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: '900', color: Colors.text, marginBottom: 16 },
  profileCard: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  avatarWrap: { position: 'relative' },
  avatar: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 30, fontWeight: '900', color: '#fff' },
  rankBadge: { position: 'absolute', bottom: -2, right: -2, width: 26, height: 26, borderRadius: 13, backgroundColor: Colors.gold, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.bg },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 20, fontWeight: '900', color: Colors.text },
  profileRank: { fontSize: 13, color: Colors.text2, marginTop: 2, marginBottom: 8 },
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  levelText: { fontSize: 13, fontWeight: '700', color: Colors.accent, minWidth: 30 },
  levelBarBg: { flex: 1, height: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 50, overflow: 'hidden' },
  levelBarFill: { height: '100%', backgroundColor: Colors.accent, borderRadius: 50 },
  levelNext: { fontSize: 13, color: Colors.text3 },
  content: { padding: Spacing.md, paddingBottom: 100 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  statCard: { width: (width - 52) / 2, backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  statVal: { fontSize: 26, fontWeight: '900', marginTop: 6 },
  statLbl: { fontSize: 12, color: Colors.text2, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.text, marginBottom: 12 },
  chartCard: { backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  chart: { flexDirection: 'row', alignItems: 'flex-end', height: 120, gap: 8 },
  barCol: { flex: 1, alignItems: 'center', gap: 4 },
  barVal: { fontSize: 9, color: Colors.text3, fontWeight: '700' },
  barBg: { flex: 1, width: '100%', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 6, overflow: 'hidden', justifyContent: 'flex-end' },
  barFill: { width: '100%', borderRadius: 6 },
  barDay: { fontSize: 11, color: Colors.text3, fontWeight: '700' },
  skillsCard: { backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: 16, gap: 14, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  skillRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  skillLabel: { flexDirection: 'row', alignItems: 'center', gap: 6, width: 140 },
  skillName: { fontSize: 13, fontWeight: '700', color: Colors.text, flex: 1 },
  skillPct: { fontSize: 13, color: Colors.text2, width: 36, textAlign: 'right' },
  skillBarBg: { flex: 1, height: 10, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 50, overflow: 'hidden' },
  achievementGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  achCard: { width: (width - 52) / 3, backgroundColor: Colors.card, borderRadius: BorderRadius.md, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', position: 'relative' },
  achLocked: { opacity: 0.4 },
  achIcon: { fontSize: 26, marginBottom: 6 },
  achTitle: { fontSize: 11, fontWeight: '800', color: Colors.text, textAlign: 'center' },
  achDesc: { fontSize: 9, color: Colors.text3, textAlign: 'center', marginTop: 4 },
  achOverlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: BorderRadius.md },
  leaderboard: { backgroundColor: Colors.card, borderRadius: BorderRadius.lg, overflow: 'hidden', marginBottom: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  lbRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  lbBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  lbRank: { fontSize: 16, fontWeight: '900', color: Colors.text2, width: 32 },
  lbName: { flex: 1, fontSize: 14, fontWeight: '700', color: Colors.text },
  lbXP: { fontSize: 13, color: Colors.text2, fontWeight: '600' },
  userLbRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, backgroundColor: 'rgba(108,99,255,0.1)', borderTopWidth: 1, borderTopColor: 'rgba(108,99,255,0.3)' },
});

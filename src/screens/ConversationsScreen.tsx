// src/screens/ConversationsScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { CONVERSATIONS } from '../data/germanData';
import { Colors, Spacing, BorderRadius } from '../utils/theme';

const LEVEL_COLORS: Record<string, [string, string]> = {
  A1: ['#667eea', '#764ba2'],
  A2: ['#f093fb', '#f5576c'],
  B1: ['#4facfe', '#00f2fe'],
  B2: ['#43e97b', '#38f9d7'],
};

const FILTERS = ['Tout', 'A1', 'A2', 'B1', 'B2'];

export default function ConversationsScreen() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nav = useNavigation<any>();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Tout');

  const filtered = CONVERSATIONS.filter(c => {
    const matchSearch = !search || c.titleFr.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'Tout' || c.level === filter;
    return matchSearch && matchFilter;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#1a1a2e', Colors.bg]} style={styles.header}>
        <Text style={styles.title}>💬 Conversations</Text>
        <Text style={styles.subtitle}>Pratique de l&apos;allemand en situation réelle</Text>
        <View style={styles.searchWrap}>
          <Text>🔍</Text>
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Rechercher..."
            placeholderTextColor={Colors.text3}
          />
        </View>
        {/* Banner */}
        <LinearGradient colors={['#f7971e', '#ffd200']} style={styles.banner}>
          <Text style={styles.bannerIcon}>🎯</Text>
          <View>
            <Text style={styles.bannerTitle}>Dialogues réels</Text>
            <Text style={styles.bannerSub}>Avec traduction FR & AR</Text>
          </View>
          <Text style={styles.bannerCount}>{CONVERSATIONS.length}</Text>
        </LinearGradient>
      </LinearGradient>

      {/* Level Filter */}
      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      >
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && { color: '#fff' }]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Conversations Grid */}
      <ScrollView
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map(conv => (
          <TouchableOpacity
            key={conv.id}
            style={styles.card}
            onPress={() => nav.navigate('Dialog', { conversation: conv })}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={LEVEL_COLORS[conv.level] ?? [Colors.card, Colors.card2]}
              style={styles.cardGrad}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.cardEmoji}>{conv.emoji}</Text>
            </LinearGradient>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{conv.titleFr}</Text>
              <Text style={styles.cardTitleAr}>{conv.titleAr}</Text>
              <View style={styles.cardMeta}>
                <View style={styles.levelPill}>
                  <Text style={styles.levelPillText}>{conv.level}</Text>
                </View>
                <Text style={styles.exchangeCount}>💬 {conv.exchanges} échanges</Text>
              </View>
            </View>
            <Text style={styles.cardArrow}>›</Text>
          </TouchableOpacity>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingTop: 60, paddingHorizontal: Spacing.md, paddingBottom: 8 },
  title: { fontSize: 24, fontWeight: '900', color: Colors.text },
  subtitle: { fontSize: 13, color: Colors.text2, marginTop: 2, marginBottom: 14 },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.card, borderRadius: BorderRadius.full,
    paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', marginBottom: 14,
  },
  searchInput: { flex: 1, fontSize: 14, color: Colors.text },
  banner: {
    borderRadius: BorderRadius.lg, padding: 16,
    flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8,
  },
  bannerIcon: { fontSize: 28 },
  bannerTitle: { fontSize: 15, fontWeight: '800', color: '#1a0a00' },
  bannerSub: { fontSize: 12, color: '#3d2000', marginTop: 2 },
  bannerCount: { marginLeft: 'auto', fontSize: 28, fontWeight: '900', color: '#1a0a00' },
  filterScroll: { maxHeight: 52, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: BorderRadius.full,
    backgroundColor: Colors.card, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    marginVertical: 8,
  },
  filterChipActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  filterText: { fontSize: 13, fontWeight: '700', color: Colors.text2 },
  grid: { padding: Spacing.md, gap: 12 },
  card: {
    backgroundColor: Colors.card, borderRadius: BorderRadius.lg,
    flexDirection: 'row', alignItems: 'center', gap: 14,
    padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
  },
  cardGrad: {
    width: 56, height: 56, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  cardEmoji: { fontSize: 28 },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: Colors.text },
  cardTitleAr: { fontSize: 12, color: '#a78bfa', marginTop: 2 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 },
  levelPill: {
    backgroundColor: 'rgba(108,99,255,0.2)', paddingHorizontal: 10,
    paddingVertical: 3, borderRadius: BorderRadius.full,
  },
  levelPillText: { fontSize: 11, fontWeight: '700', color: Colors.accent },
  exchangeCount: { fontSize: 12, color: Colors.text2 },
  cardArrow: { fontSize: 24, color: Colors.text3, fontWeight: '300' },
});

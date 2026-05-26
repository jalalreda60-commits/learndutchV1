// src/screens/VocabularyScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { useStore } from '../context/store';
import { VOCABULARY, VocabWord } from '../data/germanData';
import { Colors, BorderRadius } from '../utils/theme';

const ARTICLE_COLORS: Record<string, string> = {
  der: Colors.blue, die: Colors.accent2, das: Colors.green, '': Colors.text2,
};

const CATEGORIES = ['Tout', 'greetings', 'family', 'food', 'places', 'transport', 'work', 'objects', 'people', 'abstract'];
const CAT_ICONS: Record<string, string> = {
  'Tout': '📚', greetings: '👋', family: '👨‍👩‍👧', food: '🍎', places: '📍',
  transport: '🚆', work: '💼', objects: '📦', people: '👥', abstract: '💭',
};

export default function VocabularyScreen() {
  const { favorites, toggleFavorite, addXP } = useStore();
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('Tout');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const allWords = [...(VOCABULARY.a1 || []), ...(VOCABULARY.b1 || [])];

  const filtered = allWords.filter(w => {
    const matchSearch = !search || w.de.toLowerCase().includes(search.toLowerCase()) || w.fr.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCat === 'Tout' || w.category === selectedCat;
    return matchSearch && matchCat;
  });

  const speakWord = (word: VocabWord) => {
    Speech.speak(word.de, { language: 'de-DE', rate: 0.8, pitch: 1 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addXP(2);
  };

  const speakExample = (ex: string) => {
    Speech.speak(ex, { language: 'de-DE', rate: 0.75 });
  };

  const isFav = (id: string) => favorites.includes(id);

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={[Colors.bg2, Colors.bg]} style={styles.header}>
        <Text style={styles.title}>📖 Vocabulaire</Text>
        <Text style={styles.subtitle}>{filtered.length} mots disponibles</Text>
        <View style={styles.searchWrap}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Rechercher un mot..."
            placeholderTextColor={Colors.text3}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={{ color: Colors.text3, fontSize: 16 }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.catScroll}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      >
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.catChip, selectedCat === cat && styles.catChipActive]}
            onPress={() => setSelectedCat(cat)}
          >
            <Text style={styles.catIcon}>{CAT_ICONS[cat] || '📝'}</Text>
            <Text style={[styles.catText, selectedCat === cat && { color: '#fff' }]}>
              {cat === 'Tout' ? 'Tout' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Word List */}
      <ScrollView style={styles.wordList} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 48 }}>🔍</Text>
            <Text style={styles.emptyText}>Aucun mot trouvé</Text>
          </View>
        ) : (
          filtered.map(word => {
            const expanded = expandedId === word.id;
            return (
              <TouchableOpacity
                key={word.id}
                style={styles.wordCard}
                onPress={() => setExpandedId(expanded ? null : word.id)}
                activeOpacity={0.9}
              >
                {/* Main row */}
                <View style={styles.wordMain}>
                  <View style={styles.wordLeft}>
                    <View style={styles.wordTitleRow}>
                      {word.article ? (
                        <Text style={[styles.articleText, { color: ARTICLE_COLORS[word.article] || Colors.text2 }]}>
                          {word.article}
                        </Text>
                      ) : null}
                      <Text style={styles.wordDe}>{word.de}</Text>
                    </View>
                    <View style={styles.transRow}>
                      <Text style={styles.wordFr}>🇫🇷 {word.fr}</Text>
                      <Text style={styles.wordAr}>🇩🇿 {word.ar}</Text>
                    </View>
                  </View>
                  <View style={styles.wordRight}>
                    <TouchableOpacity
                      style={styles.speakBtn}
                      onPress={() => speakWord(word)}
                    >
                      <LinearGradient colors={[Colors.accent, Colors.blue]} style={styles.speakGrad}>
                        <Text style={{ fontSize: 16 }}>🔊</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => { toggleFavorite(word.id); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                    >
                      <Text style={{ fontSize: 22 }}>{isFav(word.id) ? '⭐' : '☆'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Expanded content */}
                {expanded && (
                  <View style={styles.expandedContent}>
                    <View style={styles.pronounceBadge}>
                      <Text style={styles.pronounceText}>/{word.pronunciation}/</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.exampleWrap}
                      onPress={() => speakExample(word.example)}
                    >
                      <Text style={styles.exampleLabel}>💬 Exemple:</Text>
                      <Text style={styles.exampleText}>&bdquo;{word.example}&ldquo;</Text>
                      <Text style={styles.exampleHint}>Appuie pour écouter</Text>
                    </TouchableOpacity>
                    <View style={styles.wordActions}>
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => speakWord(word)}
                      >
                        <Text style={styles.actionBtnText}>🔊 Prononcer</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionBtn, { borderColor: Colors.green }]}
                        onPress={() => { addXP(5); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); }}
                      >
                        <Text style={[styles.actionBtnText, { color: Colors.green }]}>✓ Mémorisé</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* Level badge */}
                <View style={styles.levelBadge}>
                  <Text style={styles.levelBadgeText}>{word.level}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16 },
  title: { fontSize: 22, fontWeight: '900', color: Colors.text },
  subtitle: { fontSize: 13, color: Colors.text2, marginTop: 2, marginBottom: 14 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, borderRadius: BorderRadius.full, paddingHorizontal: 14, paddingVertical: 10, gap: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 14, color: Colors.text },
  catScroll: { maxHeight: 52, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  catChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.card, paddingHorizontal: 14, paddingVertical: 8, borderRadius: BorderRadius.full, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', marginVertical: 8 },
  catChipActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  catIcon: { fontSize: 14 },
  catText: { fontSize: 12, fontWeight: '700', color: Colors.text2 },
  wordList: { flex: 1 },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 16, color: Colors.text2, fontWeight: '600' },
  wordCard: { backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' },
  wordMain: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  wordLeft: { flex: 1 },
  wordTitleRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  articleText: { fontSize: 14, fontWeight: '700' },
  wordDe: { fontSize: 22, fontWeight: '900', color: Colors.text },
  transRow: { flexDirection: 'row', gap: 16, marginTop: 6, flexWrap: 'wrap' },
  wordFr: { fontSize: 13, color: Colors.text2 },
  wordAr: { fontSize: 13, color: '#a78bfa' },
  wordRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  speakBtn: { borderRadius: 20, overflow: 'hidden' },
  speakGrad: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  expandedContent: { marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)' },
  pronounceBadge: { backgroundColor: 'rgba(108,99,255,0.15)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: BorderRadius.full, alignSelf: 'flex-start', marginBottom: 12 },
  pronounceText: { fontSize: 13, color: Colors.accent, fontWeight: '700', fontStyle: 'italic' },
  exampleWrap: { backgroundColor: Colors.card2, borderRadius: BorderRadius.sm, padding: 12, borderLeftWidth: 3, borderLeftColor: Colors.accent, marginBottom: 12 },
  exampleLabel: { fontSize: 11, color: Colors.text3, fontWeight: '700', marginBottom: 4 },
  exampleText: { fontSize: 14, color: Colors.text, lineHeight: 22, fontWeight: '600' },
  exampleHint: { fontSize: 11, color: Colors.text3, marginTop: 4 },
  wordActions: { flexDirection: 'row', gap: 10 },
  actionBtn: { flex: 1, borderWidth: 1, borderColor: Colors.accent, borderRadius: BorderRadius.sm, padding: 10, alignItems: 'center' },
  actionBtnText: { fontSize: 13, fontWeight: '700', color: Colors.accent },
  levelBadge: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(108,99,255,0.2)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: BorderRadius.full },
  levelBadgeText: { fontSize: 10, fontWeight: '700', color: Colors.accent },
});

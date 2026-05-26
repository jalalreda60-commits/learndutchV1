// src/screens/GrammarScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import { GRAMMAR_LESSONS } from '../data/germanData';
import { Colors, BorderRadius } from '../utils/theme';

const LEVEL_COLORS: Record<string, [string, string]> = {
  A1: ['#667eea', '#764ba2'],
  A2: ['#f093fb', '#f5576c'],
  B1: ['#4facfe', '#00f2fe'],
  B2: ['#43e97b', '#38f9d7'],
};

export default function GrammarScreen() {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [exerciseAnswers, setExerciseAnswers] = useState<Record<string, number | null>>({});
  const [checkedExercises, setCheckedExercises] = useState<Set<string>>(new Set());

  const lesson = GRAMMAR_LESSONS.find(l => l.id === selectedLesson);

  const speak = (text: string) => Speech.speak(text, { language: 'de-DE', rate: 0.82 });

  const checkExercise = (exId: string, optIdx: number, _correct: number) => {
    setExerciseAnswers(a => ({ ...a, [exId]: optIdx }));
    setCheckedExercises(s => new Set([...s, exId]));
  };

  if (lesson) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={LEVEL_COLORS[lesson.level] ?? [Colors.accent, Colors.blue]} style={styles.lessonHeader}>
          <TouchableOpacity onPress={() => setSelectedLesson(null)} style={styles.backBtn}>
            <Text style={styles.backText}>← Retour</Text>
          </TouchableOpacity>
          <Text style={styles.lessonLevel}>{lesson.level}</Text>
          <Text style={styles.lessonTitle}>{lesson.title}</Text>
          <Text style={styles.lessonTitleFr}>{lesson.titleFr}</Text>
        </LinearGradient>

        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
          {/* Explanation */}
          <View style={styles.explCard}>
            <Text style={styles.explIcon}>💡</Text>
            <Text style={styles.explTitle}>Explication</Text>
            <Text style={styles.explText}>{lesson.explanation}</Text>
          </View>

          {/* Rules */}
          <Text style={styles.sectionTitle}>📏 Règles</Text>
          {lesson.rules.map((rule, i) => (
            <TouchableOpacity
              key={i}
              style={styles.ruleCard}
              onPress={() => speak(rule.example)}
              activeOpacity={0.85}
            >
              <View style={styles.ruleNum}>
                <Text style={styles.ruleNumText}>{i + 1}</Text>
              </View>
              <View style={styles.ruleContent}>
                <Text style={styles.ruleText}>{rule.rule}</Text>
                <TouchableOpacity style={styles.exampleRow} onPress={() => speak(rule.example)}>
                  <Text style={styles.exampleDe}>🇩🇪 {rule.example}</Text>
                  <Text style={{ fontSize: 14 }}>🔊</Text>
                </TouchableOpacity>
                <Text style={styles.exampleAr}>🇩🇿 {rule.exampleAr}</Text>
              </View>
            </TouchableOpacity>
          ))}

          {/* Exercises */}
          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>📝 Exercices</Text>
          {lesson.exercises.map((ex) => {
            const answered = checkedExercises.has(ex.id);
            const userAnswer = exerciseAnswers[ex.id];
            return (
              <View key={ex.id} style={styles.exCard}>
                <Text style={styles.exQuestion}>{ex.question}</Text>
                {ex.type === 'mcq' && ex.options && (
                  <View style={styles.exOptions}>
                    {ex.options.map((opt, i) => {
                      let bg = Colors.card2;
                      let border = 'rgba(255,255,255,0.08)';
                      let textCol = Colors.text;
                      if (answered) {
                        if (i === ex.correct) { bg = 'rgba(0,208,132,0.12)'; border = Colors.green; textCol = Colors.green; }
                        else if (i === userAnswer && i !== ex.correct) { bg = 'rgba(255,101,132,0.12)'; border = Colors.accent2; textCol = Colors.accent2; }
                      }
                      return (
                        <TouchableOpacity
                          key={i}
                          disabled={answered}
                          onPress={() => checkExercise(ex.id, i, ex.correct ?? 0)}
                          style={[styles.exOpt, { backgroundColor: bg, borderColor: border }]}
                        >
                          <Text style={[styles.exOptText, { color: textCol }]}>{opt}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
                {answered && (
                  <Text style={[styles.exFeedback, { color: userAnswer === ex.correct ? Colors.green : Colors.accent2 }]}>
                    {userAnswer === ex.correct
                      ? '🎉 Correct !'
                      : `❌ Réponse: "${ex.options?.[ex.correct ?? 0]}"`}
                  </Text>
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.bg2, Colors.bg]} style={styles.header}>
        <Text style={styles.headerTitle}>📚 Grammaire</Text>
        <Text style={styles.headerSub}>Maîtrisez les règles de l&apos;allemand</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {GRAMMAR_LESSONS.map((gl) => (
          <TouchableOpacity
            key={gl.id}
            style={styles.grammarCard}
            onPress={() => setSelectedLesson(gl.id)}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={LEVEL_COLORS[gl.level] ?? [Colors.card, Colors.card2]}
              style={styles.grammarLevelBadge}
            >
              <Text style={styles.grammarLevel}>{gl.level}</Text>
            </LinearGradient>
            <View style={styles.grammarInfo}>
              <Text style={styles.grammarTitle}>{gl.title}</Text>
              <Text style={styles.grammarTitleFr}>{gl.titleFr}</Text>
              <View style={styles.grammarMeta}>
                <Text style={styles.grammarRules}>📏 {gl.rules.length} règles</Text>
                <Text style={styles.grammarEx}>📝 {gl.exercises.length} exercices</Text>
              </View>
            </View>
            <Text style={{ fontSize: 22, color: Colors.text3 }}>›</Text>
          </TouchableOpacity>
        ))}

        {/* German cases table */}
        <Text style={[styles.sectionTitle, { marginTop: 8 }]}>📊 Tableau des cas</Text>
        <View style={styles.caseTable}>
          <View style={[styles.caseRow, styles.caseHeader]}>
            <Text style={styles.caseCellHead}>Cas</Text>
            <Text style={styles.caseCellHead}>Masc.</Text>
            <Text style={styles.caseCellHead}>Fém.</Text>
            <Text style={styles.caseCellHead}>Neutre</Text>
          </View>
          {[
            ['Nom.', 'der', 'die', 'das'],
            ['Akk.', 'den', 'die', 'das'],
            ['Dat.', 'dem', 'der', 'dem'],
            ['Gen.', 'des', 'der', 'des'],
          ].map((row, i) => (
            <View key={i} style={[styles.caseRow, i % 2 === 1 && styles.caseRowAlt]}>
              {row.map((cell, j) => (
                <Text key={j} style={j === 0 ? styles.caseLabelCell : styles.caseCell}>{cell}</Text>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: Colors.text },
  headerSub: { fontSize: 13, color: Colors.text2, marginTop: 4 },
  grammarCard: {
    backgroundColor: Colors.card, borderRadius: BorderRadius.lg,
    padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14,
    marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
  },
  grammarLevelBadge: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  grammarLevel: { fontSize: 16, fontWeight: '900', color: '#fff' },
  grammarInfo: { flex: 1 },
  grammarTitle: { fontSize: 15, fontWeight: '800', color: Colors.text },
  grammarTitleFr: { fontSize: 12, color: Colors.text2, marginTop: 2 },
  grammarMeta: { flexDirection: 'row', gap: 12, marginTop: 6 },
  grammarRules: { fontSize: 12, color: Colors.text3 },
  grammarEx: { fontSize: 12, color: Colors.text3 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: Colors.text, marginBottom: 12 },
  caseTable: { backgroundColor: Colors.card, borderRadius: BorderRadius.lg, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginBottom: 24 },
  caseRow: { flexDirection: 'row' },
  caseHeader: { backgroundColor: Colors.accent },
  caseRowAlt: { backgroundColor: 'rgba(255,255,255,0.02)' },
  caseCellHead: { flex: 1, padding: 12, fontSize: 12, fontWeight: '800', color: '#fff', textAlign: 'center' },
  caseLabelCell: { flex: 1, padding: 12, fontSize: 13, fontWeight: '800', color: Colors.accent, textAlign: 'center' },
  caseCell: { flex: 1, padding: 12, fontSize: 13, fontWeight: '700', color: Colors.text, textAlign: 'center', borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.05)' },
  // Lesson detail styles
  lessonHeader: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },
  backBtn: { marginBottom: 12 },
  backText: { fontSize: 15, color: 'rgba(255,255,255,0.85)', fontWeight: '600' },
  lessonLevel: { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 2 },
  lessonTitle: { fontSize: 26, fontWeight: '900', color: '#fff', marginTop: 4 },
  lessonTitleFr: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  explCard: { backgroundColor: 'rgba(108,99,255,0.12)', borderRadius: BorderRadius.lg, padding: 18, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(108,99,255,0.3)' },
  explIcon: { fontSize: 28, marginBottom: 8 },
  explTitle: { fontSize: 16, fontWeight: '800', color: Colors.accent, marginBottom: 8 },
  explText: { fontSize: 14, color: Colors.text, lineHeight: 22 },
  ruleCard: { backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: 16, marginBottom: 12, flexDirection: 'row', gap: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  ruleNum: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  ruleNumText: { fontSize: 14, fontWeight: '900', color: '#fff' },
  ruleContent: { flex: 1 },
  ruleText: { fontSize: 14, fontWeight: '800', color: Colors.text, marginBottom: 8 },
  exampleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.card2, padding: 10, borderRadius: BorderRadius.sm, marginBottom: 6 },
  exampleDe: { fontSize: 14, color: Colors.text, fontWeight: '600', flex: 1 },
  exampleAr: { fontSize: 13, color: '#a78bfa' },
  exCard: { backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  exQuestion: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 14 },
  exOptions: { gap: 8 },
  exOpt: { borderWidth: 2, borderRadius: BorderRadius.sm, padding: 12 },
  exOptText: { fontSize: 14, fontWeight: '600' },
  exFeedback: { fontSize: 13, fontWeight: '700', marginTop: 10 },
});

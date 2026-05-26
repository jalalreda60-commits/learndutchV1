// src/screens/QuizScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, TextInput, StyleSheet,
  Animated, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../context/store';
import { QUIZ_QUESTIONS } from '../data/germanData';
import { Colors, BorderRadius } from '../utils/theme';

export default function QuizScreen() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nav = useNavigation<any>();
  const addXP = useStore(s => s.addXP);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [fillAnswer, setFillAnswer] = useState('');
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [lives, setLives] = useState(5);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [questions] = useState(() => shuffle(QUIZ_QUESTIONS).slice(0, 7));

  const progressAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const q = questions[qIdx];

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (qIdx + 1) / questions.length,
      duration: 500,
      useNativeDriver: false,
    }).start();
    setSelected(null);
    setFillAnswer('');
    setAnswered(false);
    setCorrect(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qIdx]);

  function shuffle<T>(arr: T[]): T[] {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const bounce = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.08, duration: 150, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  };

  const nextQuestion = () => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
      if (qIdx < questions.length - 1) {
        setQIdx(q => q + 1);
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      } else {
        setFinished(true);
      }
    });
  };

  const checkMCQ = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const isCorrect = idx === q.correct;
    setCorrect(isCorrect);
    if (isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      bounce();
      addXP(q.xp);
      setScore(s => s + q.xp);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      shake();
      setLives(l => l - 1);
    }
    setTimeout(nextQuestion, 1800);
  };

  const checkFill = () => {
    if (answered || !fillAnswer.trim()) return;
    setAnswered(true);
    const ans = fillAnswer.trim().toLowerCase();
    const expected = (q.answer || '').toLowerCase();
    const isCorrect = ans === expected || expected.includes(ans) || ans.includes(expected.split(' ')[0]);
    setCorrect(isCorrect);
    if (isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      bounce();
      addXP(q.xp);
      setScore(s => s + q.xp);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      shake();
      setLives(l => l - 1);
    }
    setTimeout(nextQuestion, 2200);
  };

  const speak = (text: string) => {
    Speech.speak(text, { language: 'de-DE', rate: 0.85 });
  };

  if (finished) {
    const pct = Math.round((score / (questions.length * 20)) * 100);
    return (
      <View style={styles.container}>
        <LinearGradient colors={[Colors.bg2, Colors.bg]} style={styles.finishContainer}>
          <Animated.Text style={{ fontSize: 80, transform: [{ scale: scaleAnim }] }}>
            {pct >= 70 ? '🏆' : pct >= 40 ? '⭐' : '💪'}
          </Animated.Text>
          <Text style={styles.finishTitle}>Quiz terminé !</Text>
          <Text style={styles.finishScore}>{score} XP gagnés</Text>
          <Text style={styles.finishPct}>{pct}% de bonnes réponses</Text>

          <View style={styles.finishStats}>
            <View style={styles.finishStat}>
              <Text style={styles.finishStatVal}>{questions.length}</Text>
              <Text style={styles.finishStatLbl}>Questions</Text>
            </View>
            <View style={styles.finishStat}>
              <Text style={[styles.finishStatVal, { color: Colors.green }]}>{lives}</Text>
              <Text style={styles.finishStatLbl}>Vies restantes</Text>
            </View>
            <View style={styles.finishStat}>
              <Text style={[styles.finishStatVal, { color: Colors.gold }]}>{score}</Text>
              <Text style={styles.finishStatLbl}>XP</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.retryBtn} onPress={() => { setQIdx(0); setScore(0); setLives(5); setFinished(false); }}>
            <LinearGradient colors={[Colors.accent, Colors.purple]} style={styles.retryGrad}>
              <Text style={styles.retryText}>🔄 Recommencer</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.homeBtn} onPress={() => nav.navigate('Home')}>
            <Text style={styles.homeBtnText}>🏠 Accueil</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={[Colors.bg2, Colors.bg]} style={styles.header}>
        <TouchableOpacity onPress={() => nav.goBack()}>
          <Text style={{ fontSize: 24, color: Colors.text }}>←</Text>
        </TouchableOpacity>
        <View style={styles.livesRow}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Text key={i} style={{ fontSize: 20, opacity: i < lives ? 1 : 0.2 }}>❤️</Text>
          ))}
        </View>
        <Text style={styles.xpText}>⭐ {score} XP</Text>
      </LinearGradient>

      {/* Progress */}
      <View style={styles.progressWrap}>
        <View style={styles.progressBg}>
          <Animated.View style={[styles.progressFill, {
            width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] })
          }]} />
        </View>
        <Text style={styles.progressText}>{qIdx + 1}/{questions.length}</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateX: shakeAnim }, { scale: scaleAnim }] }}>

          {/* Question Card */}
          <View style={styles.questionCard}>
            <View style={styles.questionTypeBadge}>
              <Text style={styles.questionTypeText}>
                {q.type === 'mcq' ? '🎯 Choix multiple' : q.type === 'fill' ? '✏️ Compléter' : '🎧 Écoute'}
              </Text>
              <Text style={styles.levelBadge}>{q.level}</Text>
            </View>
            {q.type === 'listening' && (
              <TouchableOpacity style={styles.audioBtn} onPress={() => speak(q.question)}>
                <LinearGradient colors={[Colors.blue, Colors.accent]} style={styles.audioBtnGrad}>
                  <Text style={{ fontSize: 28 }}>🔊</Text>
                  <Text style={styles.audioBtnText}>Écouter</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
            <Text style={styles.questionText}>{q.question}</Text>
          </View>

          {/* Options */}
          {(q.type === 'mcq' || q.type === 'listening') && q.options && (
            <View style={styles.optionsWrap}>
              {q.options.map((opt, i) => {
                let borderColor = 'rgba(255,255,255,0.08)';
                let bgColor = Colors.card2;
                let textColor = Colors.text;
                if (answered) {
                  if (i === q.correct) { borderColor = Colors.green; bgColor = 'rgba(0,208,132,0.12)'; textColor = Colors.green; }
                  else if (i === selected && i !== q.correct) { borderColor = Colors.accent2; bgColor = 'rgba(255,101,132,0.12)'; textColor = Colors.accent2; }
                }
                return (
                  <TouchableOpacity
                    key={i}
                    onPress={() => checkMCQ(i)}
                    disabled={answered}
                    style={[styles.option, { borderColor, backgroundColor: bgColor }]}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.optionText, { color: textColor }]}>{opt}</Text>
                    {answered && i === q.correct && <Text style={{ fontSize: 18 }}>✅</Text>}
                    {answered && i === selected && i !== q.correct && <Text style={{ fontSize: 18 }}>❌</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Fill in blank */}
          {q.type === 'fill' && (
            <View style={styles.fillWrap}>
              <TextInput
                style={[styles.fillInput, answered && { borderColor: correct ? Colors.green : Colors.accent2 }]}
                value={fillAnswer}
                onChangeText={setFillAnswer}
                placeholder="Votre réponse..."
                placeholderTextColor={Colors.text3}
                autoFocus
                onSubmitEditing={checkFill}
                editable={!answered}
              />
              {answered && !correct && (
                <Text style={styles.correctAnswer}>✅ Réponse: {q.answer}</Text>
              )}
              {!answered && (
                <TouchableOpacity style={styles.checkBtn} onPress={checkFill}>
                  <LinearGradient colors={[Colors.green, '#00b894']} style={styles.checkGrad}>
                    <Text style={styles.checkText}>✓ Vérifier</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Feedback */}
          {answered && (
            <View style={[styles.feedback, { backgroundColor: correct ? 'rgba(0,208,132,0.12)' : 'rgba(255,101,132,0.12)' }]}>
              <Text style={{ fontSize: 22 }}>{correct ? '🎉' : '💡'}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.feedbackTitle, { color: correct ? Colors.green : Colors.accent2 }]}>
                  {correct ? `Parfait! +${q.xp} XP` : 'Pas tout à fait...'}
                </Text>
                {q.explanation && <Text style={styles.feedbackExpl}>{q.explanation}</Text>}
              </View>
            </View>
          )}

        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16 },
  livesRow: { flexDirection: 'row', gap: 4 },
  xpText: { fontSize: 14, fontWeight: '700', color: Colors.gold },
  progressWrap: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, marginBottom: 8 },
  progressBg: { flex: 1, height: 10, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 50, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.accent, borderRadius: 50 },
  progressText: { fontSize: 13, color: Colors.text2, fontWeight: '700', minWidth: 40, textAlign: 'right' },
  questionCard: { backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: 22, marginBottom: 20 },
  questionTypeBadge: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  questionTypeText: { fontSize: 12, color: Colors.accent, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  levelBadge: { fontSize: 12, color: Colors.text2, fontWeight: '600', backgroundColor: Colors.card2, paddingHorizontal: 10, paddingVertical: 2, borderRadius: 50 },
  questionText: { fontSize: 20, fontWeight: '800', color: Colors.text, lineHeight: 28 },
  audioBtn: { marginBottom: 16, borderRadius: BorderRadius.md, overflow: 'hidden' },
  audioBtnGrad: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, justifyContent: 'center' },
  audioBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  optionsWrap: { gap: 10, marginBottom: 16 },
  option: { borderWidth: 2, borderRadius: BorderRadius.md, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  optionText: { fontSize: 15, fontWeight: '600', flex: 1 },
  fillWrap: { gap: 12, marginBottom: 16 },
  fillInput: { borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)', borderRadius: BorderRadius.md, padding: 16, fontSize: 16, color: Colors.text, backgroundColor: Colors.card2, fontWeight: '600' },
  correctAnswer: { fontSize: 14, color: Colors.green, fontWeight: '700', padding: 12, backgroundColor: 'rgba(0,208,132,0.1)', borderRadius: BorderRadius.sm },
  checkBtn: { borderRadius: BorderRadius.md, overflow: 'hidden' },
  checkGrad: { padding: 16, alignItems: 'center' },
  checkText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  feedback: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 14, borderRadius: BorderRadius.md },
  feedbackTitle: { fontSize: 15, fontWeight: '800', marginBottom: 4 },
  feedbackExpl: { fontSize: 13, color: Colors.text2, lineHeight: 20 },
  finishContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  finishTitle: { fontSize: 28, fontWeight: '900', color: Colors.text, marginTop: 16 },
  finishScore: { fontSize: 18, color: Colors.gold, fontWeight: '700', marginTop: 8 },
  finishPct: { fontSize: 15, color: Colors.text2, marginTop: 4 },
  finishStats: { flexDirection: 'row', gap: 24, marginTop: 32, marginBottom: 32 },
  finishStat: { alignItems: 'center' },
  finishStatVal: { fontSize: 28, fontWeight: '900', color: Colors.text },
  finishStatLbl: { fontSize: 12, color: Colors.text2, marginTop: 4 },
  retryBtn: { width: '100%', borderRadius: BorderRadius.lg, overflow: 'hidden', marginBottom: 12 },
  retryGrad: { padding: 18, alignItems: 'center' },
  retryText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  homeBtn: { padding: 14 },
  homeBtnText: { fontSize: 15, color: Colors.text2, fontWeight: '600' },
});

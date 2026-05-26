// src/screens/DialogScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Animated, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useStore } from '../context/store';
import { Conversation, DialogueLine } from '../data/germanData';
import { Colors, BorderRadius } from '../utils/theme';

const { width } = Dimensions.get('window');

type ViewMode = 'all' | 'de' | 'fr' | 'ar';

export default function DialogScreen() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nav = useNavigation<any>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const route = useRoute<any>();
  const addXP = useStore(s => s.addXP);
  const conv: Conversation = route.params?.conversation ?? {
    id: 'c1', title: 'Am Flughafen', titleFr: 'À l\'aéroport', titleAr: 'في المطار',
    emoji: '✈️', level: 'B1', category: 'travel', exchanges: 8,
    dialogue: [
      { id: 'd1', speaker: 'agent', speakerName: 'Agent', de: 'Guten Tag! Kann ich Ihren Reisepass sehen, bitte?', fr: 'Bonjour ! Puis-je voir votre passeport, s\'il vous plaît ?', ar: 'مرحباً! هل يمكنني رؤية جواز سفرك من فضلك؟' },
      { id: 'd2', speaker: 'user', speakerName: 'Reisender', de: 'Ja, natürlich. Hier ist mein Reisepass.', fr: 'Oui, bien sûr. Voici mon passeport.', ar: 'نعم، بالطبع. هذا جواز سفري.' },
      { id: 'd3', speaker: 'agent', speakerName: 'Agent', de: 'Danke. Wohin fliegen Sie heute?', fr: 'Merci. Où volez-vous aujourd\'hui ?', ar: 'شكراً. إلى أين تسافر اليوم؟' },
      { id: 'd4', speaker: 'user', speakerName: 'Reisender', de: 'Ich fliege nach Berlin. Mein Flug ist um 14 Uhr.', fr: 'Je vole vers Berlin. Mon vol est à 14h.', ar: 'أسافر إلى برلين. رحلتي في الساعة الثانية ظهراً.' },
      { id: 'd5', speaker: 'agent', speakerName: 'Agent', de: 'Haben Sie Gepäck aufzugeben?', fr: 'Avez-vous des bagages à enregistrer ?', ar: 'هل لديك أمتعة للتسجيل؟' },
      { id: 'd6', speaker: 'user', speakerName: 'Reisender', de: 'Ja, ich habe einen Koffer aufzugeben und ein Handgepäck dabei.', fr: 'Oui, j\'ai une valise à enregistrer et un bagage à main.', ar: 'نعم، لدي حقيبة للتسجيل وحقيبة يد معي.' },
    ],
  };

  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [slowMode, setSlowMode] = useState(false);
  const [playing, setPlaying] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const scrollRef = useRef<ScrollView>(null);
  const fadeAnims = useRef<Record<string, Animated.Value>>({});

  conv.dialogue.forEach(line => {
    if (!fadeAnims.current[line.id]) {
      fadeAnims.current[line.id] = new Animated.Value(0);
    }
  });

  useEffect(() => {
    // Stagger-animate each dialogue bubble in on mount
    conv.dialogue.forEach((line, i) => {
      Animated.timing(fadeAnims.current[line.id], {
        toValue: 1, duration: 400, delay: i * 120, useNativeDriver: true,
      }).start();
    });
    // Cleanup: stop any playing speech when screen unmounts
    return () => { Speech.stop(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const speakLine = (line: DialogueLine) => {
    Speech.stop();
    setPlaying(line.id);
    Speech.speak(line.de, {
      language: 'de-DE',
      rate: slowMode ? 0.55 : 0.82,
      pitch: line.speaker === 'agent' || line.speaker === 'interviewer' || line.speaker === 'doctor' ? 1 : 0.95,
      onDone: () => {
        setPlaying(null);
        setCompleted(prev => new Set([...prev, line.id]));
        addXP(3);
      },
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const playAll = async () => {
    for (const line of conv.dialogue) {
      await new Promise<void>(resolve => {
        setPlaying(line.id);
        Speech.speak(line.de, {
          language: 'de-DE', rate: slowMode ? 0.55 : 0.82,
          onDone: () => { setPlaying(null); resolve(); },
        });
      });
      await new Promise(r => setTimeout(r, 600));
    }
  };

  const isUserLine = (speaker: string) =>
    ['user', 'Reisender', 'Gast', 'Patient', 'Bewerber'].includes(speaker);

  const LEVEL_GRAD: Record<string, [string, string]> = {
    A1: ['#667eea', '#764ba2'], A2: ['#f093fb', '#f5576c'],
    B1: ['#4facfe', '#00f2fe'], B2: ['#43e97b', '#38f9d7'],
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={LEVEL_GRAD[conv.level] ?? [Colors.accent, Colors.blue]}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => { Speech.stop(); nav.goBack(); }}>
            <Text style={styles.backBtn}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerEmoji}>{conv.emoji}</Text>
            <View>
              <Text style={styles.headerTitle}>{conv.titleFr}</Text>
              <Text style={styles.headerSub}>{conv.titleAr}</Text>
            </View>
          </View>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>{conv.level}</Text>
          </View>
        </View>

        {/* Controls row */}
        <View style={styles.controls}>
          <TouchableOpacity style={[styles.ctrl, viewMode === 'all' && styles.ctrlActive]} onPress={() => setViewMode('all')}>
            <Text style={styles.ctrlText}>🌐 Tout</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.ctrl, viewMode === 'fr' && styles.ctrlActive]} onPress={() => setViewMode(viewMode === 'fr' ? 'all' : 'fr')}>
            <Text style={styles.ctrlText}>🇫🇷 FR</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.ctrl, viewMode === 'ar' && styles.ctrlActive]} onPress={() => setViewMode(viewMode === 'ar' ? 'all' : 'ar')}>
            <Text style={styles.ctrlText}>🇩🇿 AR</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.ctrl, slowMode && styles.ctrlActive]}
            onPress={() => setSlowMode(v => !v)}
          >
            <Text style={styles.ctrlText}>🐢 Lent</Text>
          </TouchableOpacity>
        </View>

        {/* Play all */}
        <TouchableOpacity style={styles.playAllBtn} onPress={playAll}>
          <Text style={styles.playAllText}>▶ Lire tout le dialogue</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Progress */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(completed.size / conv.dialogue.length) * 100}%` }]} />
      </View>
      <Text style={styles.progressLabel}>{completed.size}/{conv.dialogue.length} écoutés</Text>

      {/* Dialogue */}
      <ScrollView ref={scrollRef} style={styles.dialogue} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {conv.dialogue.map((line) => {
          const isUser = isUserLine(line.speaker);
          const isPlaying = playing === line.id;
          const isDone = completed.has(line.id);
          return (
            <Animated.View
              key={line.id}
              style={[
                styles.bubbleWrap,
                isUser ? styles.bubbleRight : styles.bubbleLeft,
                { opacity: fadeAnims.current[line.id] },
              ]}
            >
              {!isUser && (
                <View style={styles.speakerAvatar}>
                  <Text style={{ fontSize: 16 }}>🧑</Text>
                </View>
              )}
              <View style={{ maxWidth: width * 0.78 }}>
                <Text style={[styles.speakerName, isUser && { textAlign: 'right' }]}>
                  {isUser ? `${line.speakerName} 👤` : `🧑 ${line.speakerName}`}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.bubble,
                    isUser ? styles.bubbleUser : styles.bubbleAgent,
                    isPlaying && styles.bubblePlaying,
                  ]}
                  onPress={() => speakLine(line)}
                  activeOpacity={0.85}
                >
                  {/* German text - always shown */}
                  <Text style={[styles.deText, isUser && { color: '#fff' }]}>{line.de}</Text>

                  {/* French */}
                  {(viewMode === 'all' || viewMode === 'fr') && (
                    <Text style={styles.frText}>🇫🇷 {line.fr}</Text>
                  )}

                  {/* Arabic */}
                  {(viewMode === 'all' || viewMode === 'ar') && (
                    <Text style={styles.arText}>🇩🇿 {line.ar}</Text>
                  )}

                  {/* Audio indicator */}
                  <View style={styles.bubbleFooter}>
                    <Text style={[styles.audioBtn, isPlaying && { color: Colors.gold }]}>
                      {isPlaying ? '🔊 En cours...' : isDone ? '✅ Écouté' : '🔊 Écouter'}
                    </Text>
                    {slowMode && <Text style={styles.slowBadge}>🐢</Text>}
                  </View>
                </TouchableOpacity>
              </View>
              {isUser && (
                <View style={styles.speakerAvatar}>
                  <Text style={{ fontSize: 16 }}>👤</Text>
                </View>
              )}
            </Animated.View>
          );
        })}

        {/* Completion card */}
        {completed.size === conv.dialogue.length && (
          <View style={styles.completionCard}>
            <Text style={{ fontSize: 40 }}>🎉</Text>
            <Text style={styles.completionTitle}>Dialogue terminé !</Text>
            <Text style={styles.completionSub}>+{conv.dialogue.length * 3} XP gagnés</Text>
            <TouchableOpacity
              style={styles.completionBtn}
              onPress={() => nav.navigate('Quiz')}
            >
              <LinearGradient colors={[Colors.accent, Colors.purple]} style={styles.completionBtnGrad}>
                <Text style={styles.completionBtnText}>🎯 Faire le quiz</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingTop: 56, paddingHorizontal: 16, paddingBottom: 12 },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  backBtn: { fontSize: 26, color: '#fff', fontWeight: '300' },
  headerInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerEmoji: { fontSize: 28 },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#fff' },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  headerBadge: { backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  headerBadgeText: { fontSize: 12, fontWeight: '800', color: '#fff' },
  controls: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  ctrl: { flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10, paddingVertical: 8, alignItems: 'center' },
  ctrlActive: { backgroundColor: 'rgba(255,255,255,0.35)' },
  ctrlText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  playAllBtn: { backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 12, paddingVertical: 10, alignItems: 'center', marginBottom: 4 },
  playAllText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  progressBar: { height: 4, backgroundColor: 'rgba(255,255,255,0.1)' },
  progressFill: { height: '100%', backgroundColor: Colors.green, borderRadius: 2 },
  progressLabel: { fontSize: 11, color: Colors.text3, textAlign: 'right', paddingRight: 16, paddingTop: 4, paddingBottom: 2 },
  dialogue: { flex: 1 },
  bubbleWrap: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 18 },
  bubbleLeft: { justifyContent: 'flex-start' },
  bubbleRight: { justifyContent: 'flex-end' },
  speakerAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.card2, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  speakerName: { fontSize: 11, color: Colors.text3, fontWeight: '700', marginBottom: 4 },
  bubble: { borderRadius: 18, padding: 14, borderWidth: 1.5 },
  bubbleAgent: { backgroundColor: Colors.card2, borderColor: 'rgba(255,255,255,0.07)', borderBottomLeftRadius: 4 },
  bubbleUser: { backgroundColor: Colors.accent, borderColor: Colors.accent, borderBottomRightRadius: 4 },
  bubblePlaying: { borderColor: Colors.gold, shadowColor: Colors.gold, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 8, elevation: 8 },
  deText: { fontSize: 15, fontWeight: '700', color: Colors.text, lineHeight: 22, marginBottom: 6 },
  frText: { fontSize: 13, color: Colors.text2, marginBottom: 4, lineHeight: 20 },
  arText: { fontSize: 13, color: '#a78bfa', lineHeight: 20, textAlign: 'left' },
  bubbleFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  audioBtn: { fontSize: 12, color: Colors.text3, fontWeight: '700' },
  slowBadge: { fontSize: 14 },
  completionCard: { backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: 24, alignItems: 'center', marginTop: 12, borderWidth: 1, borderColor: 'rgba(108,99,255,0.3)' },
  completionTitle: { fontSize: 22, fontWeight: '900', color: Colors.text, marginTop: 12 },
  completionSub: { fontSize: 14, color: Colors.gold, fontWeight: '700', marginTop: 6, marginBottom: 20 },
  completionBtn: { width: '100%', borderRadius: BorderRadius.md, overflow: 'hidden' },
  completionBtnGrad: { padding: 16, alignItems: 'center' },
  completionBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },
});

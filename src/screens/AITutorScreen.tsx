// src/screens/AITutorScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { sendMessageToAI } from '../services/aiService';
import { useStore } from '../context/store';
import { Colors, BorderRadius } from '../utils/theme';

interface Message { id: string; role: 'user' | 'ai'; content: string; timestamp: Date; }

const SUGGESTIONS = [
  '👋 Comment dire Bonjour?', '📚 Explique les cas', '💬 Parlons ensemble', '🎯 Fais-moi un quiz',
];

const WELCOME_MSG: Message = {
  id: '0', role: 'ai', timestamp: new Date(),
  content: `Hallo! Ich bin Max, dein KI-Deutschlehrer 🇩🇪\n\nJe peux t'aider avec:\n• 📚 Grammaire & vocabulaire\n• 🎤 Prononciation\n• 💬 Conversation réelle\n• ✏️ Correction de texte\n\nWas möchtest du heute lernen?`,
};

export default function AITutorScreen() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MSG]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [audioRec, setAudioRec] = useState<Audio.Recording | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const typingAnim = useRef(new Animated.Value(0)).current;
  const addXP = useStore(s => s.addXP);

  const scrollToBottom = () => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
          Animated.timing(typingAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
        ])
      ).start();
    } else { typingAnim.setValue(0); }
  }, [loading, typingAnim]);

  const sendMessage = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: msg, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    scrollToBottom();
    try {
      const history = messages.slice(-6).map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.content }));
      const aiReply = await sendMessageToAI(history, msg);
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'ai', content: aiReply, timestamp: new Date() };
      setMessages(prev => [...prev, aiMsg]);
      addXP(10);
    } catch (e) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', content: 'Désolé, je ne suis pas disponible. Réessayez.', timestamp: new Date() }]);
    } finally { setLoading(false); scrollToBottom(); }
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setAudioRec(recording);
      setRecording(true);
    } catch (e) { console.warn('Rec error', e); }
  };

  const stopRecording = async () => {
    if (!audioRec) return;
    setRecording(false);
    await audioRec.stopAndUnloadAsync();
    setAudioRec(null);
    // In production, send audio to speech-to-text API
    sendMessage('(Message vocal) Ich möchte Deutsch lernen.');
  };

  const speakMessage = (text: string) => {
    Speech.speak(text, { language: 'de-DE', rate: 0.85, pitch: 1 });
  };

  const formatTime = (d: Date) => d.toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' });

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <LinearGradient colors={[Colors.bg2, Colors.bg]} style={styles.header}>
        <View style={styles.aiAvatar}>
          <Text style={{ fontSize: 24 }}>🤖</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.aiName}>Max - Tuteur IA</Text>
          <Text style={styles.aiStatus}>🟢 En ligne · Deutschlehrer</Text>
        </View>
        <TouchableOpacity onPress={() => Speech.stop()}>
          <Text style={{ fontSize: 20 }}>🔇</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Messages */}
      <ScrollView ref={scrollRef} style={styles.chat} contentContainerStyle={{ padding: 16, paddingBottom: 20 }}>
        {messages.map((msg) => (
          <View key={msg.id} style={[styles.bubbleWrap, msg.role === 'user' ? styles.userWrap : styles.aiWrap]}>
            {msg.role === 'ai' && (
              <View style={styles.aiBubbleAvatar}>
                <Text>🤖</Text>
              </View>
            )}
            <View style={{ maxWidth: '80%' }}>
              <View style={[styles.bubble, msg.role === 'user' ? styles.userBubble : styles.aiBubble]}>
                <Text style={[styles.bubbleText, { color: msg.role === 'user' ? '#fff' : Colors.text }]}>
                  {msg.content}
                </Text>
              </View>
              <View style={[styles.bubbleMeta, msg.role === 'user' && { alignItems: 'flex-end' }]}>
                <Text style={styles.bubbleTime}>{formatTime(msg.timestamp)}</Text>
                {msg.role === 'ai' && (
                  <TouchableOpacity onPress={() => speakMessage(msg.content)}>
                    <Text style={styles.speakBtn}>🔊 Écouter</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        ))}
        {loading && (
          <View style={[styles.bubbleWrap, styles.aiWrap]}>
            <View style={styles.aiBubbleAvatar}><Text>🤖</Text></View>
            <View style={[styles.bubble, styles.aiBubble, styles.typingBubble]}>
              <Animated.Text style={[styles.bubbleText, { opacity: typingAnim }]}>Max est en train d&apos;écrire...</Animated.Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Suggestions */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestions} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
        {SUGGESTIONS.map((s, i) => (
          <TouchableOpacity key={i} style={styles.sugBtn} onPress={() => sendMessage(s)}>
            <Text style={styles.sugText}>{s}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputWrap}>
        <TouchableOpacity
          style={[styles.voiceBtn, recording && styles.recordingBtn]}
          onPress={recording ? stopRecording : startRecording}
        >
          <Text style={{ fontSize: 20 }}>{recording ? '⏹' : '🎤'}</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Schreib auf Deutsch oder Französisch..."
          placeholderTextColor={Colors.text3}
          multiline maxLength={500}
          onSubmitEditing={() => sendMessage()}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={() => sendMessage()}>
          <LinearGradient colors={[Colors.accent, Colors.purple]} style={styles.sendGrad}>
            <Text style={{ fontSize: 18, color: '#fff' }}>➤</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16 },
  aiAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.card, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.accent },
  aiName: { fontSize: 16, fontWeight: '800', color: Colors.text },
  aiStatus: { fontSize: 12, color: Colors.green },
  chat: { flex: 1 },
  bubbleWrap: { flexDirection: 'row', marginBottom: 16, alignItems: 'flex-end', gap: 8 },
  aiWrap: { justifyContent: 'flex-start' },
  userWrap: { justifyContent: 'flex-end' },
  aiBubbleAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.card, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  bubble: { borderRadius: 16, padding: 14 },
  aiBubble: { backgroundColor: Colors.card2, borderBottomLeftRadius: 4 },
  userBubble: { borderBottomRightRadius: 4, backgroundColor: Colors.accent },
  typingBubble: { minWidth: 160 },
  bubbleText: { fontSize: 14, lineHeight: 22, color: Colors.text },
  bubbleMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  bubbleTime: { fontSize: 11, color: Colors.text3 },
  speakBtn: { fontSize: 11, color: Colors.accent },
  suggestions: { maxHeight: 48, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  sugBtn: { backgroundColor: Colors.card2, borderRadius: BorderRadius.full, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  sugText: { fontSize: 12, color: Colors.text2 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', backgroundColor: Colors.bg },
  voiceBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  recordingBtn: { backgroundColor: 'rgba(255,101,132,0.2)', borderColor: Colors.accent2 },
  input: { flex: 1, backgroundColor: Colors.card, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10, color: Colors.text, fontSize: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  sendBtn: { width: 44, height: 44, borderRadius: 22, overflow: 'hidden' },
  sendGrad: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
});

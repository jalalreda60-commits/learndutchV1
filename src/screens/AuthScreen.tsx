// src/screens/AuthScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  ScrollView, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../context/store';
import { Colors, Spacing, BorderRadius } from '../utils/theme';

type Mode = 'welcome' | 'login' | 'signup';

export default function AuthScreen() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nav = useNavigation<any>();
  const setUser = useStore(s => s.setUser);
  const [mode, setMode] = useState<Mode>('welcome');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);

  const logoAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(logoAnim, { toValue: 1, useNativeDriver: true, tension: 60, friction: 8 }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, delay: 300, useNativeDriver: true }),
    ]).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.06, duration: 1800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1800, useNativeDriver: true }),
      ])
    ).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    if (loading) return;
    setError('');
    if (mode === 'signup' && !name.trim()) { setError('Entrez votre prénom'); return; }
    if (!email.includes('@')) { setError('Email invalide'); return; }
    if (password.length < 6) { setError('Mot de passe trop court (6 min)'); return; }
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1000)); // Simulate API
      setUser({ name: name || 'Utilisateur', email, uid: 'mock-uid-' + Date.now() });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      nav.replace('Main');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Erreur de connexion';
      setError(msg);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setUser({ name: 'Ahmed', email: 'ahmed@gmail.com', uid: 'google-uid' });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    nav.replace('Main');
    setLoading(false);
  };

  const BADGES = ['🎤 IA Vocale', '📚 A1→B2', '🇩🇪 Natif', '🧠 Adaptatif', '🌍 FR & AR'];

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={['#1a0533', '#0f0f1a', '#0a1628']} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Logo */}
          <Animated.View style={[styles.logoWrap, {
            transform: [{ scale: Animated.multiply(logoAnim, pulseAnim) }],
            opacity: logoAnim,
          }]}>
            <LinearGradient colors={[Colors.accent, Colors.accent2]} style={styles.logo}>
              <Text style={styles.logoEmoji}>🇩🇪</Text>
            </LinearGradient>
          </Animated.View>

          <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
            <Text style={styles.appName}>SnowB German AI</Text>
            <Text style={styles.appTagline}>Maîtrise l&apos;allemand de A1 à B2</Text>

            {/* Feature badges */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgeScroll} contentContainerStyle={{ gap: 8, paddingHorizontal: 4 }}>
              {BADGES.map((b, i) => (
                <View key={i} style={styles.badge}>
                  <Text style={styles.badgeText}>{b}</Text>
                </View>
              ))}
            </ScrollView>

            {/* Level indicators */}
            <View style={styles.levelsRow}>
              {['A1', 'A2', 'B1', 'B2'].map((l, i) => (
                <LinearGradient
                  key={l}
                  colors={[['#667eea', '#764ba2'], ['#f093fb', '#f5576c'], ['#4facfe', '#00f2fe'], ['#43e97b', '#38f9d7']][i] as [string, string]}
                  style={styles.levelPill}
                >
                  <Text style={styles.levelPillText}>{l}</Text>
                </LinearGradient>
              ))}
              <Text style={styles.levelArrow}>→ Fließend</Text>
            </View>
          </Animated.View>

          {/* Welcome mode */}
          {mode === 'welcome' && (
            <Animated.View style={[styles.formWrap, { opacity: fadeAnim }]}>
              <TouchableOpacity style={styles.btnPrimary} onPress={() => setMode('signup')} activeOpacity={0.9}>
                <LinearGradient colors={[Colors.accent, Colors.purple]} style={styles.btnGrad}>
                  <Text style={styles.btnText}>🚀 Commencer gratuitement</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnGoogle} onPress={handleGoogle} activeOpacity={0.9}>
                <Text style={styles.googleG}>G</Text>
                <Text style={styles.btnSecText}>Continuer avec Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnLink} onPress={() => setMode('login')}>
                <Text style={styles.linkText}>J&apos;ai déjà un compte → Se connecter</Text>
              </TouchableOpacity>
              <Text style={styles.statsText}>🌍 +50 000 apprenants · 4.9 ⭐</Text>
            </Animated.View>
          )}

          {/* Login / Signup mode */}
          {(mode === 'login' || mode === 'signup') && (
            <View style={styles.formWrap}>
              <View style={styles.formCard}>
                <Text style={styles.formTitle}>{mode === 'login' ? '👋 Connexion' : '✨ Créer un compte'}</Text>

                {mode === 'signup' && (
                  <View style={styles.inputWrap}>
                    <Text style={styles.inputLabel}>Prénom</Text>
                    <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Votre prénom" placeholderTextColor={Colors.text3} autoCapitalize="words" />
                  </View>
                )}
                <View style={styles.inputWrap}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="votre@email.com" placeholderTextColor={Colors.text3} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
                </View>
                <View style={styles.inputWrap}>
                  <Text style={styles.inputLabel}>Mot de passe</Text>
                  <View style={styles.pwWrap}>
                    <TextInput style={[styles.input, { flex: 1, marginBottom: 0 }]} value={password} onChangeText={setPassword} placeholder="••••••••" placeholderTextColor={Colors.text3} secureTextEntry={!showPw} />
                    <TouchableOpacity onPress={() => setShowPw(v => !v)} style={styles.eyeBtn}>
                      <Text style={{ fontSize: 18 }}>{showPw ? '🙈' : '👁'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {error.length > 0 && (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorText}>⚠️ {error}</Text>
                  </View>
                )}

                <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.9}>
                  <LinearGradient colors={[Colors.accent, Colors.purple]} style={styles.submitGrad}>
                    <Text style={styles.submitText}>
                      {loading ? '⏳ Chargement...' : mode === 'login' ? '→ Se connecter' : '→ Créer le compte'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnGoogle} onPress={handleGoogle}>
                  <Text style={styles.googleG}>G</Text>
                  <Text style={styles.btnSecText}>Google</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.btnLink} onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}>
                <Text style={styles.linkText}>
                  {mode === 'login' ? "Pas encore de compte ? S'inscrire →" : "Déjà un compte ? Se connecter →"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnLink} onPress={() => setMode('welcome')}>
                <Text style={[styles.linkText, { color: Colors.text3 }]}>← Retour</Text>
              </TouchableOpacity>
            </View>
          )}

        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, alignItems: 'center', paddingTop: 80, paddingHorizontal: Spacing.lg, paddingBottom: 40 },
  logoWrap: { marginBottom: 20 },
  logo: { width: 96, height: 96, borderRadius: 28, alignItems: 'center', justifyContent: 'center', shadowColor: Colors.accent, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 12 },
  logoEmoji: { fontSize: 50 },
  appName: { fontSize: 32, fontWeight: '900', color: Colors.text, textAlign: 'center', marginBottom: 6 },
  appTagline: { fontSize: 15, color: Colors.text2, textAlign: 'center', marginBottom: 20 },
  badgeScroll: { maxHeight: 40, marginBottom: 20 },
  badge: { backgroundColor: Colors.card, borderRadius: BorderRadius.full, paddingHorizontal: 14, paddingVertical: 7, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  badgeText: { fontSize: 12, color: Colors.text2, fontWeight: '600' },
  levelsRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 32 },
  levelPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.full },
  levelPillText: { fontSize: 12, fontWeight: '900', color: '#fff' },
  levelArrow: { fontSize: 13, color: Colors.text3, fontStyle: 'italic' },
  formWrap: { width: '100%', gap: 12 },
  btnPrimary: { borderRadius: BorderRadius.lg, overflow: 'hidden' },
  btnGrad: { padding: 18, alignItems: 'center' },
  btnText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  btnGoogle: { backgroundColor: Colors.card2, borderRadius: BorderRadius.lg, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  googleG: { fontSize: 20, fontWeight: '900', color: '#4285f4' },
  btnSecText: { fontSize: 15, fontWeight: '700', color: Colors.text },
  btnLink: { alignItems: 'center', padding: 10 },
  linkText: { fontSize: 14, color: Colors.accent, fontWeight: '600' },
  statsText: { fontSize: 13, color: Colors.text3, textAlign: 'center', marginTop: 8 },
  formCard: { backgroundColor: Colors.card, borderRadius: BorderRadius.xl, padding: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', gap: 14 },
  formTitle: { fontSize: 22, fontWeight: '900', color: Colors.text },
  inputWrap: { gap: 6 },
  inputLabel: { fontSize: 13, fontWeight: '700', color: Colors.text2 },
  input: { backgroundColor: Colors.card2, borderRadius: BorderRadius.md, padding: 14, fontSize: 15, color: Colors.text, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  pwWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card2, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', paddingRight: 14 },
  eyeBtn: { padding: 4 },
  errorBox: { backgroundColor: 'rgba(255,101,132,0.12)', borderRadius: BorderRadius.sm, padding: 12, borderWidth: 1, borderColor: Colors.accent2 },
  errorText: { fontSize: 13, color: Colors.accent2, fontWeight: '600' },
  submitBtn: { borderRadius: BorderRadius.md, overflow: 'hidden' },
  submitGrad: { padding: 16, alignItems: 'center' },
  submitText: { fontSize: 16, fontWeight: '800', color: '#fff' },
});

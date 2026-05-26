// src/services/aiService.ts
import axios from 'axios';

const AI_SYSTEM_PROMPT = `Du bist Max, ein freundlicher und kompetenter KI-Deutschlehrer für arabophone und frankophone Lernende.

DEINE AUFGABEN:
- Deutsch auf A1 bis B2 Niveau unterrichten
- Grammatikfehler freundlich korrigieren
- Auf Französisch und Arabisch erklären wenn nötig
- Realistische Gespräche auf Deutsch führen
- Aussprache-Tipps geben
- Motivierend und geduldig sein

ANTWORTFORMAT:
- Auf Deutsch antworten wenn möglich (mit Übersetzung)
- Fehler mit 💡 markieren und korrigieren
- Vokabeln mit Artikel angeben (der/die/das)
- Emojis für besseres Verständnis verwenden
- Kurze, klare Antworten (max 150 Wörter)
- Immer eine Übungsfrage am Ende stellen

BEISPIEL KORREKTUR:
Lerner: "Ich haben ein Hund"
Max: "Fast! 😊 Korrekt: 'Ich **habe** einen Hund.'
💡 Konjugation: ich **habe** (nicht 'haben')
💡 Akkusativ: **einen** Hund (maskulin)

J'ai un chien. 🐕 / لدي كلب

Übung: Wie sagt man 'elle a deux chats'? 🐱"`;

export const sendMessageToAI = async (
  messages: Array<{ role: string; content: string }>,
  userMessage: string,
): Promise<string> => {
  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        system: AI_SYSTEM_PROMPT,
        messages: [
          ...messages,
          { role: 'user', content: userMessage },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.EXPO_PUBLIC_ANTHROPIC_KEY || '',
          'anthropic-version': '2023-06-01',
        },
        timeout: 15000,
      }
    );
    return response.data.content[0].text;
  } catch (error: unknown) {
    console.error('AI Error:', error);
    return getFallbackResponse(userMessage);
  }
};

export const correctGermanText = async (text: string): Promise<{ corrected: string; explanation: string }> => {
  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        system: 'Tu es un correcteur d\'allemand. Corrige le texte et explique les erreurs en français. Réponds en JSON: {"corrected": "...", "errors": ["..."], "explanation": "..."}',
        messages: [{ role: 'user', content: `Corrige: "${text}"` }],
      },
      {
        headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.EXPO_PUBLIC_ANTHROPIC_KEY || '', 'anthropic-version': '2023-06-01' },
        timeout: 10000,
      }
    );
    try {
      return JSON.parse(response.data.content[0].text);
    } catch {
      return { corrected: text, explanation: response.data.content[0].text };
    }
  } catch {
    return { corrected: text, explanation: 'Vérification hors ligne non disponible.' };
  }
};

// Fallback responses when AI is unavailable
const FALLBACK_RESPONSES = [
  "Sehr gut! 👏 Continue à t'entraîner!\n\n💡 Astuce du jour: En allemand, les noms prennent toujours une majuscule.\n\nEx: das Haus 🏠, die Schule 📚, der Bahnhof 🚉\n\nÜbung: Comment dit-on 'le restaurant' en allemand?",
  "Ausgezeichnet! 🌟 Ta prononciation s'améliore!\n\n📚 Vocabulaire:\n• der Zug = le train 🚂\n• das Flugzeug = l'avion ✈️\n• das Auto = la voiture 🚗\n\nQuestion: Wie kommt man von Paris nach Berlin?",
  "Prima! 🎉 Voici un conseil grammatical:\n\nLes 4 cas allemands:\n• Nominatif = sujet\n• Accusatif = objet direct  \n• Datif = objet indirect\n• Génitif = possession\n\nPeux-tu faire une phrase avec 'der Mann'?",
  "Wunderbar! ✨ Continuons avec la conjugaison:\n\n**lernen** (apprendre):\n• ich lerne\n• du lernst\n• er/sie/es lernt\n• wir lernen\n\nÜbung: Conjugue le verbe **sprechen** (parler)!",
];

let fallbackIdx = 0;
const getFallbackResponse = (_: string) => {
  const r = FALLBACK_RESPONSES[fallbackIdx % FALLBACK_RESPONSES.length];
  fallbackIdx++;
  return r;
};

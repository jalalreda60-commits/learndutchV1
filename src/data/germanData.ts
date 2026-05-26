// src/data/germanData.ts

export const VOCABULARY: Record<string, VocabWord[]> = {
  a1: [
    { id: 'v1', de: 'Hallo', article: '', fr: 'Bonjour / Salut', ar: 'مرحبا', pronunciation: 'HA-lo', example: 'Hallo, wie geht es dir?', category: 'greetings', level: 'A1' },
    { id: 'v2', de: 'danke', article: '', fr: 'merci', ar: 'شكراً', pronunciation: 'DAN-keh', example: 'Danke schön!', category: 'greetings', level: 'A1' },
    { id: 'v3', de: 'Haus', article: 'das', fr: 'maison', ar: 'بيت', pronunciation: 'HOWS', example: 'Das Haus ist sehr groß.', category: 'places', level: 'A1' },
    { id: 'v4', de: 'Wasser', article: 'das', fr: 'eau', ar: 'ماء', pronunciation: 'VAH-ser', example: 'Ich möchte ein Glas Wasser.', category: 'food', level: 'A1' },
    { id: 'v5', de: 'Mutter', article: 'die', fr: 'mère', ar: 'أم', pronunciation: 'MOO-ter', example: 'Meine Mutter kocht sehr gut.', category: 'family', level: 'A1' },
    { id: 'v6', de: 'Vater', article: 'der', fr: 'père', ar: 'أب', pronunciation: 'FAH-ter', example: 'Mein Vater arbeitet in Berlin.', category: 'family', level: 'A1' },
    { id: 'v7', de: 'Buch', article: 'das', fr: 'livre', ar: 'كتاب', pronunciation: 'BOOKH', example: 'Das Buch ist sehr interessant.', category: 'objects', level: 'A1' },
    { id: 'v8', de: 'Schule', article: 'die', fr: 'école', ar: 'مدرسة', pronunciation: 'SHOO-leh', example: 'Ich gehe jeden Tag zur Schule.', category: 'places', level: 'A1' },
  ],
  b1: [
    { id: 'bv1', de: 'Bahnhof', article: 'der', fr: 'gare', ar: 'محطة القطار', pronunciation: 'BAHN-hof', example: 'Ich treffe dich am Bahnhof um 9 Uhr.', category: 'transport', level: 'B1' },
    { id: 'bv2', de: 'Gespräch', article: 'das', fr: 'conversation', ar: 'محادثة', pronunciation: 'geh-SHPREKH', example: 'Das Gespräch mit dem Chef war sehr wichtig.', category: 'work', level: 'B1' },
    { id: 'bv3', de: 'Arbeit', article: 'die', fr: 'travail', ar: 'عمل', pronunciation: 'AR-bite', example: 'Meine Arbeit beginnt um 8 Uhr morgens.', category: 'work', level: 'B1' },
    { id: 'bv4', de: 'Freund', article: 'der', fr: 'ami', ar: 'صديق', pronunciation: 'FROYND', example: 'Mein bester Freund kommt aus München.', category: 'people', level: 'B1' },
    { id: 'bv5', de: 'Erfahrung', article: 'die', fr: 'expérience', ar: 'خبرة', pronunciation: 'er-FAH-roong', example: 'Ich habe viel Erfahrung in diesem Bereich.', category: 'work', level: 'B1' },
    { id: 'bv6', de: 'Verantwortung', article: 'die', fr: 'responsabilité', ar: 'مسؤولية', pronunciation: 'fer-ANT-vor-toong', example: 'Diese Aufgabe hat viel Verantwortung.', category: 'work', level: 'B1' },
    { id: 'bv7', de: 'Möglichkeit', article: 'die', fr: 'possibilité', ar: 'إمكانية', pronunciation: 'MÖG-likh-kite', example: 'Es gibt viele Möglichkeiten in dieser Stadt.', category: 'abstract', level: 'B1' },
    { id: 'bv8', de: 'Gesellschaft', article: 'die', fr: 'société', ar: 'مجتمع', pronunciation: 'geh-ZELL-shaft', example: 'Die Gesellschaft verändert sich schnell.', category: 'abstract', level: 'B1' },
  ],
};

export const CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    title: 'Am Flughafen',
    titleFr: 'À l\'aéroport',
    titleAr: 'في المطار',
    emoji: '✈️',
    level: 'B1',
    category: 'travel',
    exchanges: 18,
    dialogue: [
      { id: 'd1', speaker: 'agent', speakerName: 'Agent', de: 'Guten Tag! Kann ich Ihren Reisepass sehen, bitte?', fr: 'Bonjour ! Puis-je voir votre passeport, s\'il vous plaît ?', ar: 'مرحباً! هل يمكنني رؤية جواز سفرك من فضلك؟' },
      { id: 'd2', speaker: 'user', speakerName: 'Reisender', de: 'Ja, natürlich. Hier ist mein Reisepass.', fr: 'Oui, bien sûr. Voici mon passeport.', ar: 'نعم، بالطبع. هذا جواز سفري.' },
      { id: 'd3', speaker: 'agent', speakerName: 'Agent', de: 'Danke. Wohin fliegen Sie heute?', fr: 'Merci. Où volez-vous aujourd\'hui ?', ar: 'شكراً. إلى أين تسافر اليوم؟' },
      { id: 'd4', speaker: 'user', speakerName: 'Reisender', de: 'Ich fliege nach Berlin. Mein Flug ist um 14 Uhr.', fr: 'Je vole vers Berlin. Mon vol est à 14h.', ar: 'أسافر إلى برلين. رحلتي في الساعة الثانية ظهراً.' },
      { id: 'd5', speaker: 'agent', speakerName: 'Agent', de: 'Haben Sie Gepäck aufzugeben?', fr: 'Avez-vous des bagages à enregistrer ?', ar: 'هل لديك أمتعة للتسجيل؟' },
      { id: 'd6', speaker: 'user', speakerName: 'Reisender', de: 'Ja, ich habe einen Koffer aufzugeben und ein Handgepäck dabei.', fr: 'Oui, j\'ai une valise à enregistrer et un bagage à main.', ar: 'نعم، لدي حقيبة للتسجيل وحقيبة يد معي.' },
      { id: 'd7', speaker: 'agent', speakerName: 'Agent', de: 'Gut. Bitte stellen Sie Ihren Koffer auf das Förderband.', fr: 'Bien. Veuillez placer votre valise sur le tapis roulant.', ar: 'حسناً. ضع حقيبتك على الحزام الناقل من فضلك.' },
      { id: 'd8', speaker: 'user', speakerName: 'Reisender', de: 'Alles klar. Wo ist das Gate für meinen Flug?', fr: 'D\'accord. Où est la porte pour mon vol ?', ar: 'حسناً. أين بوابة رحلتي؟' },
    ],
  },
  {
    id: 'c2',
    title: 'Im Restaurant',
    titleFr: 'Au restaurant',
    titleAr: 'في المطعم',
    emoji: '🍽️',
    level: 'A2',
    category: 'food',
    exchanges: 14,
    dialogue: [
      { id: 'r1', speaker: 'waiter', speakerName: 'Kellner', de: 'Guten Abend! Haben Sie eine Reservierung?', fr: 'Bonsoir ! Avez-vous une réservation ?', ar: 'مساء الخير! هل لديك حجز؟' },
      { id: 'r2', speaker: 'user', speakerName: 'Gast', de: 'Ja, ich habe einen Tisch für zwei Personen reserviert. Auf den Namen Schmidt.', fr: 'Oui, j\'ai réservé une table pour deux personnes. Au nom de Schmidt.', ar: 'نعم، حجزت طاولة لشخصين. باسم شميدت.' },
      { id: 'r3', speaker: 'waiter', speakerName: 'Kellner', de: 'Ausgezeichnet! Bitte folgen Sie mir. Hier ist die Speisekarte.', fr: 'Excellent ! Veuillez me suivre. Voici le menu.', ar: 'ممتاز! تفضل بالمتابعة. هذه قائمة الطعام.' },
      { id: 'r4', speaker: 'user', speakerName: 'Gast', de: 'Danke. Was können Sie uns empfehlen?', fr: 'Merci. Que pouvez-vous nous recommander ?', ar: 'شكراً. ماذا يمكنك أن تنصح لنا؟' },
    ],
  },
  {
    id: 'c3',
    title: 'Vorstellungsgespräch',
    titleFr: 'Entretien d\'embauche',
    titleAr: 'مقابلة عمل',
    emoji: '💼',
    level: 'B2',
    category: 'work',
    exchanges: 22,
    dialogue: [
      { id: 'j1', speaker: 'interviewer', speakerName: 'Chef', de: 'Guten Morgen! Bitte setzen Sie sich. Erzählen Sie mir etwas über sich.', fr: 'Bonjour ! Asseyez-vous. Parlez-moi un peu de vous.', ar: 'صباح الخير! تفضل بالجلوس. أخبرني شيئاً عن نفسك.' },
      { id: 'j2', speaker: 'user', speakerName: 'Bewerber', de: 'Guten Morgen. Ich bin Ahmed und ich habe fünf Jahre Erfahrung in der Softwareentwicklung.', fr: 'Bonjour. Je m\'appelle Ahmed et j\'ai cinq ans d\'expérience en développement logiciel.', ar: 'صباح الخير. أنا أحمد ولدي خمس سنوات خبرة في تطوير البرمجيات.' },
    ],
  },
  {
    id: 'c4', title: 'Im Krankenhaus', titleFr: 'À l\'hôpital', titleAr: 'في المستشفى', emoji: '🏥', level: 'B1', category: 'health', exchanges: 16,
    dialogue: [
      { id: 'h1', speaker: 'doctor', speakerName: 'Arzt', de: 'Guten Tag! Was führt Sie zu mir?', fr: 'Bonjour ! Qu\'est-ce qui vous amène ?', ar: 'مرحباً! ما الذي يقودك إلي؟' },
      { id: 'h2', speaker: 'user', speakerName: 'Patient', de: 'Guten Tag, Doktor. Ich habe seit drei Tagen starke Kopfschmerzen.', fr: 'Bonjour Docteur. J\'ai de forts maux de tête depuis trois jours.', ar: 'مرحباً دكتور. أعاني من صداع شديد منذ ثلاثة أيام.' },
    ],
  },
  {
    id: 'c5', title: 'Im Hotel', titleFr: 'À l\'hôtel', titleAr: 'في الفندق', emoji: '🏨', level: 'A2', category: 'travel', exchanges: 10,
    dialogue: [
      { id: 'ho1', speaker: 'receptionist', speakerName: 'Rezeptionist', de: 'Willkommen! Haben Sie eine Reservierung?', fr: 'Bienvenue ! Avez-vous une réservation ?', ar: 'مرحباً! هل لديك حجز؟' },
    ],
  },
  {
    id: 'c6', title: 'Einkaufen', titleFr: 'Shopping', titleAr: 'التسوق', emoji: '🛒', level: 'A2', category: 'shopping', exchanges: 12,
    dialogue: [
      { id: 's1', speaker: 'seller', speakerName: 'Verkäufer', de: 'Kann ich Ihnen helfen?', fr: 'Puis-je vous aider ?', ar: 'هل يمكنني مساعدتك؟' },
    ],
  },
  {
    id: 'c7', title: 'Im Zug', titleFr: 'Dans le train', titleAr: 'في القطار', emoji: '🚂', level: 'B1', category: 'travel', exchanges: 20,
    dialogue: [
      { id: 't1', speaker: 'agent', speakerName: 'Schaffner', de: 'Ihre Fahrkarte, bitte!', fr: 'Votre billet, s\'il vous plaît !', ar: 'تذكرتك من فضلك!' },
    ],
  },
  {
    id: 'c8', title: 'Mit Freunden', titleFr: 'Entre amis', titleAr: 'مع الأصدقاء', emoji: '👥', level: 'B1', category: 'social', exchanges: 25,
    dialogue: [
      { id: 'f1', speaker: 'friend', speakerName: 'Freund', de: 'Hey! Lange nicht gesehen! Wie läuft es bei dir?', fr: 'Hé ! On ne s\'est pas vus depuis longtemps ! Comment ça va ?', ar: 'مرحباً! لم أرك منذ زمن! كيف حالك؟' },
    ],
  },
];

export const GRAMMAR_LESSONS: GrammarLesson[] = [
  {
    id: 'g1', level: 'A1', title: 'Articles définis', titleFr: 'Artikel (Bestimmte)',
    explanation: 'En allemand, les articles définis varient selon le genre du nom: DER (masculin), DIE (féminin), DAS (neutre).',
    rules: [
      { rule: 'Masculin → DER', example: 'der Mann (l\'homme)', exampleAr: 'الرجل' },
      { rule: 'Féminin → DIE', example: 'die Frau (la femme)', exampleAr: 'المرأة' },
      { rule: 'Neutre → DAS', example: 'das Kind (l\'enfant)', exampleAr: 'الطفل' },
      { rule: 'Pluriel → DIE', example: 'die Kinder (les enfants)', exampleAr: 'الأطفال' },
    ],
    exercises: [
      { id: 'e1', type: 'mcq', question: 'Quel article pour "Haus" (maison)?', options: ['der', 'die', 'das', 'den'], correct: 2 },
      { id: 'e2', type: 'fill', question: '___ Mann ist groß.', answer: 'Der' },
    ],
  },
  {
    id: 'g2', level: 'A2', title: 'Conjugaison au présent', titleFr: 'Konjugation Präsens',
    explanation: 'Les verbes allemands se conjuguent différemment selon le pronom sujet.',
    rules: [
      { rule: 'ich → -e', example: 'ich lerne (j\'apprends)', exampleAr: 'أنا أتعلم' },
      { rule: 'du → -st', example: 'du lernst (tu apprends)', exampleAr: 'أنت تتعلم' },
      { rule: 'er/sie/es → -t', example: 'er lernt (il apprend)', exampleAr: 'هو يتعلم' },
      { rule: 'wir → -en', example: 'wir lernen (nous apprenons)', exampleAr: 'نحن نتعلم' },
    ],
    exercises: [
      { id: 'e3', type: 'mcq', question: '"Du ___ Deutsch." (lernen)', options: ['lerne', 'lernst', 'lernt', 'lernen'], correct: 1 },
    ],
  },
  {
    id: 'g3', level: 'B1', title: 'Les 4 cas', titleFr: 'Die vier Fälle',
    explanation: 'L\'allemand a 4 cas grammaticaux: Nominatif, Accusatif, Datif et Génitif.',
    rules: [
      { rule: 'Nominatif = sujet', example: 'Der Mann schläft.', exampleAr: 'الرجل نائم.' },
      { rule: 'Accusatif = objet direct', example: 'Ich sehe den Mann.', exampleAr: 'أنا أرى الرجل.' },
      { rule: 'Datif = objet indirect', example: 'Ich gebe dem Mann das Buch.', exampleAr: 'أعطي الرجل الكتاب.' },
      { rule: 'Génitif = possession', example: 'Das Auto des Mannes.', exampleAr: 'سيارة الرجل.' },
    ],
    exercises: [
      { id: 'e4', type: 'mcq', question: '"Ich sehe ___ Hund." (Akkusativ)', options: ['der', 'die', 'den', 'dem'], correct: 2 },
    ],
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: 'q1', type: 'mcq', level: 'A1', category: 'vocabulary', question: 'Was bedeutet "Guten Morgen"?', options: ['Bonne nuit', 'Bonjour (matin)', 'Au revoir', 'Bonsoir'], correct: 1, explanation: 'Guten Morgen = Bonjour (utilisé le matin)', xp: 10 },
  { id: 'q2', type: 'fill', level: 'A2', category: 'grammar', question: 'Ergänze: "Ich ___ Deutsch." (lernen)', answer: 'lerne', explanation: 'Avec "ich", on ajoute -e au radical: lern + e = lerne', xp: 15 },
  { id: 'q3', type: 'mcq', level: 'A1', category: 'vocabulary', question: 'Was bedeutet "die Wohnung" auf Arabisch?', options: ['🚗 السيارة', '🏠 الشقة', '📚 الكتاب', '🌳 الشجرة'], correct: 1, explanation: 'Die Wohnung = l\'appartement / الشقة', xp: 10 },
  { id: 'q4', type: 'mcq', level: 'B1', category: 'grammar', question: '"Ich sehe ___ Mann." (Akkusativ)', options: ['der', 'die', 'den', 'dem'], correct: 2, explanation: 'À l\'accusatif masculin, "der" devient "den"', xp: 20 },
  { id: 'q5', type: 'listening', level: 'A2', category: 'listening', question: 'Écoutez et choisissez la traduction correcte de "Wie geht es Ihnen?"', options: ['Comment vous appelez-vous?', 'D\'où venez-vous?', 'Comment allez-vous?', 'Quel âge avez-vous?'], correct: 2, audio: 'wie_geht_es.mp3', xp: 15 },
  { id: 'q6', type: 'mcq', level: 'A1', category: 'vocabulary', question: '"Wohin fährt der Zug?" signifie:', options: ['Où va le train?', 'D\'où vient le train?', 'Quand part le train?', 'Comment va le train?'], correct: 0, explanation: 'wohin = où (direction), fahren = aller en véhicule', xp: 10 },
  { id: 'q7', type: 'fill', level: 'B1', category: 'grammar', question: 'Ich lerne Deutsch ___ sechs Monaten. (seit)', answer: 'seit', explanation: '"Seit" + Datif pour exprimer une durée qui continue', xp: 20 },
  { id: 'q8', type: 'mcq', level: 'A2', category: 'vocabulary', question: 'Quel article pour "Bahnhof"?', options: ['der', 'die', 'das', 'den'], correct: 0, explanation: 'der Bahnhof = la gare (masculin)', xp: 10 },
];

export const LEVELS_DATA = [
  { id: 'a1', label: 'A1', name: 'Débutant', nameAr: 'مبتدئ', description: '100-200 mots essentiels', gradient: ['#667eea', '#764ba2'], icon: '🌱', locked: false, progress: 100 },
  { id: 'a2', label: 'A2', name: 'Élémentaire', nameAr: 'أساسي', description: 'Communication simple', gradient: ['#f093fb', '#f5576c'], icon: '🌿', locked: false, progress: 100 },
  { id: 'b1', label: 'B1', name: 'Intermédiaire', nameAr: 'متوسط', description: 'Situations courantes', gradient: ['#4facfe', '#00f2fe'], icon: '🌳', locked: false, progress: 65 },
  { id: 'b2', label: 'B2', name: 'Avancé', nameAr: 'متقدم', description: 'Sujets complexes', gradient: ['#43e97b', '#38f9d7'], icon: '🏆', locked: true, progress: 0 },
];

export const ACHIEVEMENTS = [
  { id: 'a1', title: 'Premier pas', titleFr: 'Premier pas', icon: '👣', description: 'Complétez votre première leçon', unlocked: true },
  { id: 'a2', title: 'Série de 7 jours', icon: '🔥', description: '7 jours consécutifs', unlocked: true },
  { id: 'a3', title: 'Vocabulaire A1', icon: '📚', description: 'Apprenez 100 mots A1', unlocked: true },
  { id: 'a4', title: 'Maître des articles', icon: '🎓', description: 'Maîtrisez der/die/das', unlocked: false },
  { id: 'a5', title: 'Conversationnel', icon: '💬', description: 'Terminez 10 dialogues', unlocked: false },
  { id: 'a6', title: 'Niveau B1', icon: '⭐', description: 'Atteignez le niveau B1', unlocked: true },
];

// Type definitions
export interface VocabWord {
  id: string; de: string; article: string; fr: string; ar: string;
  pronunciation: string; example: string; category: string; level: string;
}
export interface DialogueLine {
  id: string; speaker: string; speakerName: string; de: string; fr: string; ar: string;
}
export interface Conversation {
  id: string; title: string; titleFr: string; titleAr: string;
  emoji: string; level: string; category: string; exchanges: number; dialogue: DialogueLine[];
}
export interface GrammarRule { rule: string; example: string; exampleAr: string; }
export interface Exercise { id: string; type: string; question: string; options?: string[]; correct?: number; answer?: string; }
export interface GrammarLesson {
  id: string; level: string; title: string; titleFr: string;
  explanation: string; rules: GrammarRule[]; exercises: Exercise[];
}
export interface QuizQuestion {
  id: string; type: string; level: string; category: string; question: string;
  options?: string[]; correct?: number; answer?: string; explanation?: string; audio?: string; xp: number;
}

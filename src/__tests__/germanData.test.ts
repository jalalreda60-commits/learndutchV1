// src/__tests__/germanData.test.ts
// Validates the integrity of German learning content data.

import { VOCABULARY, CONVERSATIONS, GRAMMAR_LESSONS, QUIZ_QUESTIONS } from '../data/germanData';

describe('German Data — Vocabulary', () => {
  it('has A1 vocabulary entries', () => {
    expect(VOCABULARY.a1).toBeDefined();
    expect(VOCABULARY.a1.length).toBeGreaterThan(0);
  });

  it('each word has required fields', () => {
    const allWords = [...(VOCABULARY.a1 ?? []), ...(VOCABULARY.b1 ?? [])];
    allWords.forEach(word => {
      expect(word.id).toBeTruthy();
      expect(word.de).toBeTruthy();
      expect(word.fr).toBeTruthy();
      expect(word.ar).toBeTruthy();
      expect(word.example).toBeTruthy();
    });
  });
});

describe('German Data — Conversations', () => {
  it('has at least 5 conversation scenarios', () => {
    expect(CONVERSATIONS.length).toBeGreaterThanOrEqual(5);
  });

  it('each conversation has a dialogue', () => {
    CONVERSATIONS.forEach(conv => {
      expect(conv.id).toBeTruthy();
      expect(conv.titleFr).toBeTruthy();
      expect(conv.emoji).toBeTruthy();
      expect(conv.dialogue.length).toBeGreaterThan(0);
    });
  });

  it('each dialogue line has translations', () => {
    const firstConv = CONVERSATIONS[0];
    if (firstConv) {
      firstConv.dialogue.forEach(line => {
        expect(line.de).toBeTruthy();
        expect(line.fr).toBeTruthy();
        expect(line.ar).toBeTruthy();
      });
    }
  });
});

describe('German Data — Grammar', () => {
  it('has grammar lessons', () => {
    expect(GRAMMAR_LESSONS.length).toBeGreaterThan(0);
  });

  it('each lesson has rules and exercises', () => {
    GRAMMAR_LESSONS.forEach(lesson => {
      expect(lesson.rules.length).toBeGreaterThan(0);
      expect(lesson.exercises.length).toBeGreaterThan(0);
      expect(lesson.explanation).toBeTruthy();
    });
  });
});

describe('German Data — Quiz Questions', () => {
  it('has quiz questions', () => {
    expect(QUIZ_QUESTIONS.length).toBeGreaterThanOrEqual(5);
  });

  it('each question has required fields', () => {
    QUIZ_QUESTIONS.forEach(q => {
      expect(q.id).toBeTruthy();
      expect(q.question).toBeTruthy();
      expect(q.xp).toBeGreaterThan(0);
      expect(['mcq', 'fill', 'listening']).toContain(q.type);
    });
  });

  it('MCQ questions have options and correct answer', () => {
    const mcqQuestions = QUIZ_QUESTIONS.filter(q => q.type === 'mcq');
    mcqQuestions.forEach(q => {
      expect(q.options).toBeDefined();
      expect(q.correct).toBeDefined();
      if (q.options !== undefined && q.correct !== undefined) {
        expect(q.options.length).toBeGreaterThanOrEqual(2);
        expect(q.correct).toBeGreaterThanOrEqual(0);
        expect(q.correct).toBeLessThan(q.options.length);
      }
    });
  });
});

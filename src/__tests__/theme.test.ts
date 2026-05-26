// src/__tests__/theme.test.ts
// Basic sanity tests for the theme constants.
// These ensure the design system values are never accidentally deleted.

import { Colors, Spacing, BorderRadius } from '../utils/theme';

describe('Theme — Colors', () => {
  it('has background colors defined', () => {
    expect(Colors.bg).toBe('#0f0f1a');
    expect(Colors.bg2).toBe('#1a1a2e');
    expect(Colors.card).toBeTruthy();
  });

  it('has accent colors defined', () => {
    expect(Colors.accent).toBe('#6c63ff');
    expect(Colors.accent2).toBe('#ff6584');
    expect(Colors.green).toBe('#00d084');
    expect(Colors.gold).toBeTruthy();
  });

  it('has text colors defined', () => {
    expect(Colors.text).toBe('#ffffff');
    expect(Colors.text2).toBeTruthy();
    expect(Colors.text3).toBeTruthy();
  });

  it('has semantic colors defined', () => {
    expect(Colors.success).toBe('#00d084');
    expect(Colors.error).toBe('#ff6584');
    expect(Colors.warning).toBeTruthy();
    expect(Colors.info).toBeTruthy();
  });

  it('has level gradient arrays', () => {
    expect(Array.isArray(Colors.a1)).toBe(true);
    expect(Colors.a1).toHaveLength(2);
    expect(Array.isArray(Colors.b2)).toBe(true);
  });
});

describe('Theme — Spacing', () => {
  it('has all spacing values', () => {
    expect(Spacing.xs).toBeGreaterThan(0);
    expect(Spacing.sm).toBeGreaterThan(Spacing.xs);
    expect(Spacing.md).toBeGreaterThan(Spacing.sm);
    expect(Spacing.lg).toBeGreaterThan(Spacing.md);
    expect(Spacing.xl).toBeGreaterThan(Spacing.lg);
  });
});

describe('Theme — BorderRadius', () => {
  it('has border radius values', () => {
    expect(BorderRadius.sm).toBeLessThan(BorderRadius.md);
    expect(BorderRadius.md).toBeLessThan(BorderRadius.lg);
    expect(BorderRadius.full).toBeGreaterThanOrEqual(999);
  });
});

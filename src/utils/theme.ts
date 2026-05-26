// src/utils/theme.ts
export const Colors = {
  // Backgrounds
  bg: '#0f0f1a',
  bg2: '#1a1a2e',
  bg3: '#16213e',
  card: '#1e1e35',
  card2: '#252540',

  // Accents
  accent: '#6c63ff',
  accent2: '#ff6584',
  green: '#00d084',
  gold: '#ffd700',
  orange: '#ff9f43',
  blue: '#54a0ff',
  purple: '#8b5cf6',

  // Text
  text: '#ffffff',
  text2: '#a8b2d8',
  text3: '#636e8a',

  // Levels
  a1: ['#667eea', '#764ba2'],
  a2: ['#f093fb', '#f5576c'],
  b1: ['#4facfe', '#00f2fe'],
  b2: ['#43e97b', '#38f9d7'],

  // Semantic
  success: '#00d084',
  error: '#ff6584',
  warning: '#ffd700',
  info: '#54a0ff',
};

export const Fonts = {
  regular: 'Nunito-Regular',
  semiBold: 'Nunito-SemiBold',
  bold: 'Nunito-Bold',
  extraBold: 'Nunito-ExtraBold',
  black: 'Nunito-Black',
  poppins: 'Poppins-Regular',
  poppinsSemiBold: 'Poppins-SemiBold',
  poppinsBold: 'Poppins-Bold',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const Shadow = {
  accent: {
    shadowColor: '#6c63ff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
};

export default { Colors, Fonts, Spacing, BorderRadius, Shadow };

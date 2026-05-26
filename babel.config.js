// babel.config.js
// Expo SDK 51 — Babel configuration for SnowB German AI
//
// KEY RULES for this file:
//   1. api.cache() must be called FIRST, before any other api.* calls.
//   2. Never call api.env() inside api.cache.using() — circular dependency.
//   3. Use process.env.NODE_ENV directly — it's set to 'test' by Jest,
//      'development' by Metro dev server, 'production' by EAS Build.
//      This avoids the entire Babel caching API conflict.
module.exports = function (api) {
  // Cache the compiled config permanently.
  // Safe because process.env.NODE_ENV is evaluated at call time (not cached).
  api.cache(true);

  // Detect Jest: Jest sets NODE_ENV='test' before loading babel.config.js
  const isTest = process.env.NODE_ENV === 'test';

  const plugins = [];

  if (!isTest) {
    // ── Path Aliases ─────────────────────────────────────────────────────────
    // Resolves @/* → src/* at Metro bundle time.
    // Skipped in Jest: test files use relative imports and jest-expo handles
    // the transform without needing aliases.
    plugins.push([
      'module-resolver',
      {
        root: ['.'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@':           './src',
          '@screens':    './src/screens',
          '@components': './src/components',
          '@services':   './src/services',
          '@context':    './src/context',
          '@data':       './src/data',
          '@utils':      './src/utils',
          '@hooks':      './src/hooks',
          '@navigation': './src/navigation',
          '@assets':     './assets',
        },
      },
    ]);

    // ── Reanimated ────────────────────────────────────────────────────────────
    // MUST be last. Requires native module — unavailable in Jest environment.
    plugins.push('react-native-reanimated/plugin');
  }

  return {
    presets: [
      // babel-preset-expo: handles RN runtime, JSX transform, TypeScript,
      // Flow stripping. Works in both Metro (app) and Jest (tests).
      'babel-preset-expo',
    ],
    plugins,
  };
};

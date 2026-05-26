// App.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { useStore } from './src/context/store';
import { Colors } from './src/utils/theme';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appReady, setAppReady] = useState(false);
  const loadFromStorage = useStore(s => s.loadFromStorage);

  useEffect(() => {
    async function prepare() {
      try {
        // Load fonts
        await Font.loadAsync({
          'Nunito-Regular': require('./assets/fonts/Nunito-Regular.ttf'),
          'Nunito-SemiBold': require('./assets/fonts/Nunito-SemiBold.ttf'),
          'Nunito-Bold': require('./assets/fonts/Nunito-Bold.ttf'),
          'Nunito-ExtraBold': require('./assets/fonts/Nunito-ExtraBold.ttf'),
          'Nunito-Black': require('./assets/fonts/Nunito-Black.ttf'),
        });
        // Load saved user data
        await loadFromStorage();
        // Simulate splash (min 1.5s)
        await new Promise(r => setTimeout(r, 1500));
      } catch (e) {
        console.warn('App init error:', e);
      } finally {
        setAppReady(true);
      }
    }
    prepare();
    // loadFromStorage is a stable Zustand action reference — safe in deps array
  }, [loadFromStorage]);

  const onLayoutRootView = useCallback(async () => {
    if (appReady) await SplashScreen.hideAsync();
  }, [appReady]);

  if (!appReady) return null;

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <View style={styles.root} onLayout={onLayoutRootView}>
          <StatusBar style="light" backgroundColor={Colors.bg} />
          <AppNavigator />
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
});

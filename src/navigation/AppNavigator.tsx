// src/navigation/AppNavigator.tsx
import React from 'react';
import { View, Text, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';

import HomeScreen from '../screens/HomeScreen';
import CourseScreen from '../screens/CourseScreen';
import ConversationsScreen from '../screens/ConversationsScreen';
import DialogScreen from '../screens/DialogScreen';
import AITutorScreen from '../screens/AITutorScreen';
import ProgressScreen from '../screens/ProgressScreen';
import QuizScreen from '../screens/QuizScreen';
import VocabularyScreen from '../screens/VocabularyScreen';
import GrammarScreen from '../screens/GrammarScreen';
import AuthScreen from '../screens/AuthScreen';
import { Colors } from '../utils/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TAB_ITEMS = [
  { name: 'Home', label: 'Accueil', icon: '🏠', screen: HomeScreen },
  { name: 'Course', label: 'Cours', icon: '📚', screen: CourseScreen },
  { name: 'Conversations', label: 'Parler', icon: '💬', screen: ConversationsScreen },
  { name: 'AITutor', label: 'IA', icon: '🤖', screen: AITutorScreen },
  { name: 'Progress', label: 'Progrès', icon: '📊', screen: ProgressScreen },
];

function TabIcon({ icon, focused }: { icon: string; focused: boolean }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      {focused ? (
        <LinearGradient
          colors={[Colors.accent, Colors.purple]}
          style={{ width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ fontSize: 20 }}>{icon}</Text>
        </LinearGradient>
      ) : (
        <Text style={{ fontSize: 22, opacity: 0.5 }}>{icon}</Text>
      )}
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.bg2,
          borderTopColor: 'rgba(255,255,255,0.06)',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.text3,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700', marginTop: 2 },
      }}
    >
      {TAB_ITEMS.map(item => (
        <Tab.Screen
          key={item.name}
          name={item.name}
          component={item.screen}
          options={{
            tabBarLabel: item.label,
            tabBarIcon: ({ focused }) => <TabIcon icon={item.icon} focused={focused} />,
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: Colors.bg } }}>
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen
          name="Dialog"
          component={DialogScreen}
          options={{ presentation: 'card', gestureEnabled: true }}
        />
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen name="Vocabulary" component={VocabularyScreen} />
        <Stack.Screen name="Grammar" component={GrammarScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

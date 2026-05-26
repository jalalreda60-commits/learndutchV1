// src/services/notifications.ts
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const requestNotificationPermissions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

export const scheduleDailyReminder = async (hour: number = 19, minute: number = 0) => {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🇩🇪 SnowB German AI',
      body: 'Hallo! Deine tägliche Deutsch-Lektion wartet auf dich! 🔥',
      data: { screen: 'Home' },
    },
    trigger: { hour, minute, repeats: true },
  });
};

export const scheduleStreakReminder = async (streakDays: number) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `🔥 ${streakDays} jours de série !`,
      body: 'Ne brisez pas votre série ! Apprenez 5 minutes maintenant.',
      data: { screen: 'Home' },
    },
    trigger: { seconds: 3600 * 20 }, // 20 hours later
  });
};

export const sendXPNotification = async (xp: number, achievement?: string) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: achievement ? `🏆 Nouveau succès : ${achievement}` : `⭐ +${xp} XP gagnés !`,
      body: achievement ? 'Félicitations ! Continuez comme ça.' : `Excellent travail ! Total: ${xp} XP.`,
    },
    trigger: null,
  });
};

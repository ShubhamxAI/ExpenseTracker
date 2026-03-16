import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function ensureExpenseNotificationPermissionsAsync() {
  const existingPermissions = await Notifications.getPermissionsAsync();

  if (existingPermissions.granted) {
    return true;
  }

  const nextPermissions = await Notifications.requestPermissionsAsync();

  return Boolean(nextPermissions.granted);
}

async function notifyExpenseAddedAsync(expense = {}) {
  const permissionGranted = await ensureExpenseNotificationPermissionsAsync();

  if (!permissionGranted) {
    return false;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'ExpenseTracker',
      body: `Added ${expense.amountLabel} to expenses`,
    },
    trigger: null,
  });

  return true;
}

export { ensureExpenseNotificationPermissionsAsync, notifyExpenseAddedAsync };

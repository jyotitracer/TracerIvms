import { PushNotifications, Token } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

import { Plugins } from '@capacitor/core';

const { NativePlugin } = Plugins;



export async function createNotificationChannel() {
  if (Capacitor.getPlatform() === 'android' || Capacitor.getPlatform() === 'ios') {
    await LocalNotifications.createChannel({
      id: 'default',
      name: 'General Notifications',
      importance: 5, // High importance
      visibility: 1, // Public visibility
      description: 'General Notifications from the app',
      sound: 'default', // Custom or default sound
    });
  }
//  scheduleNotification();
}

async function scheduleNotification() {
  if(Capacitor.getPlatform() ==='android' || Capacitor.getPlatform() === 'ios')
    {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: 'Custom Notification',
            body: 'This notification uses a custom notification.',
            id: 1,
            schedule: { at: new Date(Date.now() + 1000 * 5) }, // 5 seconds later
            channelId: 'default', // Use the custom channel
          },
        ],
      });
    }
  
}


export async function registerPushNotifications(): Promise<string | null> {
  let firebaseToken: string | null = null;

  // Check if the app is running on a supported platform for Push Notifications
  if (Capacitor.getPlatform() === 'web') {
    console.warn('Push Notifications are not supported on web.');
    return null;
  }

  
  


  // Listen for successful registration and store the token
  PushNotifications.addListener('registration', (token: Token) => {
    console.log('Push registration success, token: ' + token.value);
    firebaseToken = token.value;  // Store Firebase token
  });


  // Handle notification received while app is running
  PushNotifications.addListener('pushNotificationReceived', async (notification) => {


    console.log('Push notification received:', notification);




  });

  // Handle notification when an action is performed (e.g., opening it)
  PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
    console.log('Push notification action performed: ', action);
  });

  let permissionGranted = false;

  // Request permission to use push notifications
  const result = await PushNotifications.requestPermissions();
  if (result.receive === 'granted') {
    permissionGranted = true;
  } else {
    const requestStatus = await PushNotifications.requestPermissions();
    if (requestStatus.receive === 'granted') {
      permissionGranted = true;
    }
  }

  if (permissionGranted) {
    // Register for push notifications
    await PushNotifications.register();
  } else {
    console.error('Push notifications permission not granted.');
  }

  // Wait for the Firebase token to be available
  await new Promise<void>((resolve) => {
    const interval = setInterval(() => {
      if (firebaseToken) {
        clearInterval(interval);
        resolve();
      }
    }, 100); // Check every 100ms until token is available
  });

  return firebaseToken;
}

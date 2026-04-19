// This is a lightweight stub for Firebase Cloud Messaging service worker.
// To enable background push via FCM:
// 1. Add Firebase config to your project and set up FCM in the Firebase console.
// 2. Register this service worker (next step) and configure your server to send push messages.

/* eslint-disable no-undef */

importScripts('https://www.gstatic.com/firebasejs/11.11.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.11.0/firebase-messaging-compat.js');

// TODO: replace with your firebase config if using FCM in production
const firebaseConfig = {
  // apiKey: '...'
};

if (self && firebase && !firebase.apps.length) {
  try {
    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();
    messaging.onBackgroundMessage(function(payload) {
      const title = payload.notification?.title || 'Reminder';
      const options = { body: payload.notification?.body || '' };
      self.registration.showNotification(title, options);
    });
  } catch (e) {
    // ignore in dev
  }
}

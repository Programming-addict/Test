import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {

  apiKey: "AIzaSyDksAWQzMxxtCY6i9_d8XcEhR_w2FsbzZk",

  authDomain: "todo-list-84212.firebaseapp.com",

  projectId: "todo-list-84212",

  storageBucket: "todo-list-84212.firebasestorage.app",

  messagingSenderId: "272020296942",

  appId: "1:272020296942:web:fb8afd131b305c003f8fff",

  measurementId: "G-WEYYSG6QLJ"

};


function initFirebase() {
  if (!getApps().length) {
    return initializeApp(firebaseConfig);
  }
  return getApp();
}

const app = initFirebase();
export const db = getFirestore(app);

// Messaging is optional — only available in browsers that support it
export async function setupMessaging() {
  if (typeof window === "undefined") return null;
  try {
    if (await isSupported()) {
      return getMessaging(app);
    }
    return null;
  } catch (e) {
    return null;
  }
}

export default app;

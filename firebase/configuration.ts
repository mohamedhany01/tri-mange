import AsyncStorage from "@react-native-async-storage/async-storage";
import { getItemAsync, setItemAsync } from "expo-secure-store";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";

import { fetchFirebaseAppKeys, FIREBASE_STORAGE_KEY } from "@/utilities/apis";
import { isProduction } from "@/utilities/environment";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfigDev = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const initializeFirebase = async () => {
  try {
    let firebaseKeys = firebaseConfigDev;

    if (isProduction()) {
      const storedKeys = await getItemAsync(FIREBASE_STORAGE_KEY);

      if (storedKeys) {
        firebaseKeys = JSON.parse(storedKeys);
      } else {
        firebaseKeys = await fetchFirebaseAppKeys();
        await setItemAsync(FIREBASE_STORAGE_KEY, JSON.stringify(firebaseKeys));
      }
    }

    const app = initializeApp(firebaseKeys);

    const auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });

    return { app, auth };
  } catch (error) {
    throw error;
  }
};

export const firebaseInitPromise = initializeFirebase();

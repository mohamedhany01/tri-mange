import AsyncStorage from "@react-native-async-storage/async-storage";
import { getItemAsync } from "expo-secure-store";
import { FirebaseApp, initializeApp } from "firebase/app";
import {
  Auth,
  connectAuthEmulator,
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import {
  connectFirestoreEmulator,
  Firestore,
  getFirestore,
} from "firebase/firestore";

import {
  AppMode,
  getAppMode,
  isTesting,
  PlatformDetector,
} from "@/utilities/environment";

export const FIREBASE_STORAGE_KEY = "FirebaseKeys";

const FIREBASE_SERVICES: Record<string, string> = {
  AUTH: "Auth",
  STORE: "Store",
};

const FIREBASE_SERVICES_MAP: Record<string, Record<string, string>> = {
  [FIREBASE_SERVICES.AUTH]: {
    web: "http://127.0.0.1:9099",
    android: "http://10.0.2.2:9099",
  },
  [FIREBASE_SERVICES.STORE]: {
    web: "127.0.0.1",
    android: "10.0.2.2",
  },
};

export interface FirebaseKeys {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

class FirebaseInitializer {
  private static instance: FirebaseInitializer;
  private readonly configurations: FirebaseConfiguration;
  private readonly mode: string;

  private constructor(mode: string) {
    this.mode = mode;
    this.configurations = new FirebaseConfiguration(mode);
  }

  private readonly utilitiesMaker: Record<
    string,
    (keys: FirebaseKeys) => {
      firebaseApp: FirebaseApp;
      firebaseAuth: Auth;
      firebaseStore: Firestore;
    }
  > = {
    production: (firebaseKeys) => {
      const firebaseApp = initializeApp(firebaseKeys);
      const firebaseAuth = initializeAuth(firebaseApp, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
      const firebaseStore = getFirestore(firebaseApp);

      return { firebaseApp, firebaseAuth, firebaseStore };
    },

    development: (firebaseKeys) => {
      const firebaseApp = initializeApp(firebaseKeys);
      const firebaseAuth = getAuth(firebaseApp);
      const firebaseStore = getFirestore(firebaseApp);
      const platform = PlatformDetector.getPlatformName();

      // Emulator connection for development
      connectAuthEmulator(
        firebaseAuth,
        FIREBASE_SERVICES_MAP[FIREBASE_SERVICES.AUTH][platform],
        { disableWarnings: true },
      );
      connectFirestoreEmulator(
        firebaseStore,
        FIREBASE_SERVICES_MAP[FIREBASE_SERVICES.STORE][platform],
        8080,
      );

      return { firebaseApp, firebaseAuth, firebaseStore };
    },
  };

  public static getInstance(): FirebaseInitializer {
    if (!FirebaseInitializer.instance) {
      FirebaseInitializer.instance = new FirebaseInitializer(getAppMode());
    }
    return FirebaseInitializer.instance;
  }

  public async getFirebaseUtilities() {
    const firebaseKeys = await this.configurations.getKeys();
    const makeUtilities =
      this.utilitiesMaker[isTesting() ? AppMode.Development : this.mode];

    if (!makeUtilities) {
      throw new Error(`Unsupported mode: ${this.mode}`);
    }

    return makeUtilities(firebaseKeys);
  }
}

class FirebaseConfiguration {
  private readonly mode: string;
  private readonly keysPromise: FirebaseKeys | Promise<FirebaseKeys>;

  private readonly keysMaker: Record<
    string,
    () => FirebaseKeys | Promise<FirebaseKeys>
  > = {
    production: async () => {
      const storedKeys = await getItemAsync(FIREBASE_STORAGE_KEY);
      const APIEndpoint = "<endpoint>"; // Replace with actual endpoint

      if (!APIEndpoint) {
        throw new Error(
          `Missing API endpoint configuration for mode: ${this.mode}`,
        );
      }

      if (!storedKeys) {
        try {
          const response = await fetch(APIEndpoint);
          if (!response.ok) {
            throw new Error(
              `Failed to fetch Firebase keys: ${response.statusText}`,
            );
          }

          const keys: FirebaseKeys = await response.json();
          return keys;
        } catch (error) {
          throw new Error(`Error fetching Firebase keys: ${error}`);
        }
      }

      return JSON.parse(storedKeys) as FirebaseKeys;
    },

    development: () => {
      return {
        apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY!,
        authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN!,
        projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID!,
        storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET!,
        messagingSenderId:
          process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
        appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID!,
        measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID!,
      };
    },
  };

  constructor(mode: string) {
    this.mode = mode;
    this.keysPromise = this.initKeys(mode);
  }

  private initKeys(mode: string): FirebaseKeys | Promise<FirebaseKeys> {
    const keysMakerFn =
      this.keysMaker[isTesting() ? AppMode.Development : mode];
    if (!keysMakerFn) {
      throw new Error(`Unsupported mode: ${mode}`);
    }
    return keysMakerFn();
  }

  public getKeys(): FirebaseKeys | Promise<FirebaseKeys> {
    return this.keysPromise;
  }
}

export default FirebaseInitializer;

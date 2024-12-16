import { fetch } from "expo/fetch";

import { isProduction } from "../environment";

export const FIREBASE_STORAGE_KEY = "FirebaseKeys";

export interface FirebaseOptions {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

export async function fetchFirebaseAppKeys(): Promise<FirebaseOptions> {
  // TODO: on release need a hardcoded endpoint
  if (!process.env.EXPO_PUBLIC_PROXY_ENDPOINT) {
    throw Error(
      `Please init the endpoint in release mode with proper URL and comment out this condition.`,
    );
  }

  if (isProduction() && !process.env.EXPO_PUBLIC_PROXY_ENDPOINT) {
    throw Error(`Please init the endpoint with proper URL`);
  }

  try {
    const resp = await fetch(process.env.EXPO_PUBLIC_PROXY_ENDPOINT);
    const data: FirebaseOptions = await resp.json();
    return data;
  } catch (error) {
    throw Error(
      `Something went wrong while requesting the data from the endpoint! ${error}`,
    );
  }
}

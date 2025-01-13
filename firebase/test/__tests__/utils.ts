import { assertFails, assertSucceeds } from "@firebase/rules-unit-testing";
import { expect } from "@jest/globals";
import { FirebaseApp, initializeApp } from "firebase/app";
import {
  Auth,
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";

/**
 * The FIRESTORE_EMULATOR_HOST environment variable is set automatically
 * by "firebase emulators:exec", but if you want to provide the host and port manually
 * you can use the code below to use either.
 */
export function parseHostAndPort(
  hostAndPort: string | undefined,
): { host: string; port: number } | undefined {
  if (hostAndPort === undefined) {
    return undefined;
  }
  const pieces = hostAndPort.split(":");
  return {
    host: pieces[0],
    port: parseInt(pieces[1], 10),
  };
}

export function getFirestoreCoverageMeta(
  projectId: string,
  firebaseJsonPath: string,
) {
  const { emulators } = require(firebaseJsonPath);
  const hostAndPort = parseHostAndPort(process.env.FIRESTORE_EMULATOR_HOST);
  const { host, port } = hostAndPort ?? emulators.firestore!;
  const coverageUrl = `http://${host}:${port}/emulator/v1/projects/${projectId}:ruleCoverage.html`;
  return {
    host,
    port,
    coverageUrl,
  };
}

/**
 * The FIREBASE_DATABASE_EMULATOR_HOST environment variable is set automatically
 * by "firebase emulators:exec"
 */
export function getDatabaseCoverageMeta(
  databaseName: string,
  firebaseJsonPath: string,
) {
  const { emulators } = require(firebaseJsonPath);
  const hostAndPort = parseHostAndPort(
    process.env.FIREBASE_DATABASE_EMULATOR_HOST,
  );
  const { host, port } = hostAndPort ?? emulators.database!;
  const coverageUrl = `http://${host}:${port}/.inspect/coverage?ns=${databaseName}`;
  return {
    host,
    port,
    coverageUrl,
  };
}

export function getAuthCoverageMeta(firebaseJsonPath: string): Auth {
  const { emulators } = require(firebaseJsonPath);
  const hostAndPort = parseHostAndPort(
    process.env.FIREBASE_DATABASE_EMULATOR_HOST,
  );
  const { host, port } = hostAndPort ?? emulators.auth!;

  const app: FirebaseApp = initializeApp({
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
  });
  const authTestEnv = getAuth(app);
  connectAuthEmulator(authTestEnv, `http://${host}:${port}`, {
    disableWarnings: true,
  });

  return authTestEnv;
}

export async function expectFirestorePermissionDenied(promise: Promise<any>) {
  const errorResult = await assertFails(promise);
  expect(errorResult.code).toBe("permission-denied");
}

export async function expectDatabasePermissionDenied(promise: Promise<any>) {
  const errorResult = await assertFails(promise);
  expect(errorResult.code).toBe("permission-denied");
}

export async function expectFirestorePermissionUpdateSucceeds(
  promise: Promise<any>,
) {
  const successResult = await assertSucceeds(promise);
  expect(successResult).toBeUndefined();
}

export async function expectPermissionGetSucceeds(promise: Promise<any>) {
  const result = await assertSucceeds(promise);
  expect(result).not.toBeUndefined();
}

export async function expectPermissionGetDenied(promise: Promise<any>) {
  const errorResult = await assertFails(promise);
  expect(errorResult.code).toBe("permission-denied");
}

export async function expectDatabasePermissionUpdateSucceeds(
  promise: Promise<any>,
) {
  const successResult = await assertSucceeds(promise);
  expect(successResult).toBeUndefined();
}

// Create a new user and sign in automatically
export async function createFakeUserAndSignIn(
  auth: Auth,
  email: string,
  password: string,
) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );

  /* eslint-disable no-console */
  console.info("Fake user created:", userCredential.user.uid);
  return userCredential;
}

// Return a user if user's credential valid
export async function signInAsFakeUser(
  auth: Auth,
  email: string,
  password: string,
) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );

  /* eslint-disable no-console */
  return userCredential.user;
}

export async function getUser(
  auth: Auth,
  email: string,
  password: string,
): Promise<any> {
  try {
    // Attempt to sign in the user
    const signInResult = await createFakeUserAndSignIn(auth, email, password);

    console.info("User signed in:", signInResult.user.uid);
    return signInResult.user;
  } catch (signInError: any) {
    if (signInError.code === "auth/email-already-in-use") {
      // If the user doesn't exist, create and sign in the user
      try {
        const createResult = await signInAsFakeUser(auth, email, password);

        // Automatically return the newly created user
        return createResult;
      } catch (createError) {
        return createError;
      }
    } else {
      return undefined;
    }
  }
}

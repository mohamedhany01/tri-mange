import { FirebaseApp } from "firebase/app";
import { Auth } from "firebase/auth";
import { collection, Firestore, getFirestore } from "firebase/firestore";

import { getAppMode } from "@/utilities/environment";

import { firebaseInitPromise } from "../configuration";

/**
 * Enum representing the collection names used in Firestore.
 */
export enum TriManageCollections {
  Clients = "clients",
  Payments = "payments",
  Products = "products",
}

/**
 * Type definition for the return value of getFirestoreUtilities.
 */
export interface FirestoreUtilities {
  app: FirebaseApp;
  auth: Auth;
  firestoreConfigs: Firestore;
}

/**
 * Helper function to initialize and retrieve Firebase app, auth, and Firestore instances.
 *
 * @returns {Promise<FirestoreUtilities>} An object containing the initialized Firebase app, auth, and Firestore instance.
 *
 * @example
 * const { app, auth, firestoreConfigs } = await getFirestoreUtilities();
 */
export async function getFirestoreUtilities(): Promise<FirestoreUtilities> {
  const { app, auth } = await firebaseInitPromise;
  const firestoreConfigs = getFirestore(app);

  return { app, auth, firestoreConfigs };
}

/**
 * Helper function to generate a Firestore collection name based on the mode.
 * @param collectionName - The base name of the collection (e.g., "clients").
 * @returns A collection name prefixed with the mode (e.g., "testing_clients").
 */
export function getCollectionName(collectionName: string): string {
  const mode = getAppMode();

  return `${mode}_${collectionName}`; // e.g., "test_clients" or "production_clients"
}

/**
 * Helper function to get a Firestore collection reference based on the mode.
 * @param collectionName - The base name of the collection (e.g., "clients").
 * @returns A Firestore collection reference.
 */
export async function getCollectionRef(collectionName: string) {
  const { firestoreConfigs } = await getFirestoreUtilities();

  return collection(firestoreConfigs, getCollectionName(collectionName));
}

/**
 * Helper function to index an array of items by their `id` property.
 *
 * This function takes an array of items with an `id` field and returns an object
 * where each key is the `id` of an item, and the corresponding value is the item itself.
 *
 * @template T - The type of the items in the array, which must include an `id` property of type `string`.
 *
 * @param {T[]} items - The array of items to be indexed by their `id`.
 *
 * @returns {Record<string, T>} An object where the keys are the `id` values and the values are the items.
 *
 * @example
 * // Example usage with a list of users
 * const users = [
 *   { id: "1", name: "Alice" },
 *   { id: "2", name: "Bob" },
 *   { id: "3", name: "Charlie" },
 * ];
 *
 * const usersById = indexItemsById(users);
 * console.log(usersById);
 * // Output:
 * // {
 * //   "1": { id: "1", name: "Alice" },
 * //   "2": { id: "2", name: "Bob" },
 * //   "3": { id: "3", name: "Charlie" }
 * // }
 */
export function indexItemsById<T extends { id: string }>(
  items: T[],
): Record<string, T> {
  return items.reduce(
    (acc, item) => {
      acc[item.id] = item;
      return acc;
    },
    {} as Record<string, T>,
  );
}

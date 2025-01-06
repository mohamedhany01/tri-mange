/**
 * Enum representing the collection names used in Firestore.
 */
export enum TriManageCollections {
  Clients = "clients",
  Payments = "payments",
  Products = "products",
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

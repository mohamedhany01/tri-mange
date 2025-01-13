import {
  getDocs,
  doc,
  writeBatch,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  collection,
} from "firebase/firestore";

import {
  indexItemsById,
  TriManageCollections,
} from "@/firebase/utilities/extra";
import FirebaseInitializer from "@/firebase/utilities/firebaseConfig";
import Client from "@/types/Client";
import { CURRENT_APP_MODE } from "@/utilities/environment";

/**
 * Service class for managing Client-related operations in Firestore.
 */
class ClientServices {
  private static readonly firebaseStore =
    ClientServices.initializeFirebaseStore();

  private static async initializeFirebaseStore() {
    const firebaseInitializer = FirebaseInitializer.getInstance();

    const { firebaseStore } = await firebaseInitializer.getFirebaseUtilities();

    return firebaseStore;
  }

  /**
   * Fetches all clients from Firestore.
   * @returns A promise resolving to a record of clients indexed by their IDs.
   */
  public static async fetchAllClients(): Promise<Record<string, Client>> {
    try {
      const firebaseStore = await this.firebaseStore;

      const clientsCollection = collection(
        firebaseStore,
        TriManageCollections.Clients,
      );
      const clientsSnapshot = await getDocs(clientsCollection);

      const clients: Client[] = await Promise.all(
        clientsSnapshot.docs.map(async (doc) => {
          const client = doc.data();
          return {
            id: doc.id,
            type: "Client",
            name: client.name,
            phoneNumber: client.phoneNumber,
            note: client.note || "",
          } as Client;
        }),
      );

      return indexItemsById(clients);
    } catch (err) {
      throw new Error(`[${CURRENT_APP_MODE}] Error fetching clients: ${err}`);
    }
  }

  /**
   * Adds a new client to Firestore.
   * @param newClient The client data to add (excluding the ID).
   * @returns The newly added client including its generated ID.
   */
  public static async addNewClient(
    newClient: Omit<Client, "id">,
  ): Promise<Client> {
    try {
      const firebaseStore = await this.firebaseStore;
      const clientsCollection = collection(
        firebaseStore,
        TriManageCollections.Clients,
      );

      const clientDocRef = await addDoc(clientsCollection, {
        name: newClient.name,
        phoneNumber: newClient.phoneNumber,
        note: newClient.note,
      });

      return {
        id: clientDocRef.id,
        ...newClient,
      };
    } catch (err) {
      throw new Error(`[${CURRENT_APP_MODE}] Failed to add client: ${err}`);
    }
  }

  /**
   * Updates an existing client in Firestore.
   * @param clientId The ID of the client to update.
   * @param updatedClient Partial data to update the client with.
   * @returns The updated client.
   */
  public static async updateClient(
    clientId: string,
    updatedClient: Partial<Client>,
  ): Promise<Client> {
    try {
      const firebaseStore = await this.firebaseStore;
      const clientDocRef = doc(
        firebaseStore,
        TriManageCollections.Clients,
        clientId,
      );

      await updateDoc(clientDocRef, updatedClient);

      const updatedClientDoc = await getDoc(clientDocRef);
      if (!updatedClientDoc.exists()) {
        throw new Error("Client not found after update");
      }

      return {
        id: updatedClientDoc.id,
        ...updatedClientDoc.data(),
      } as Client;
    } catch (err) {
      throw new Error(`[${CURRENT_APP_MODE}] Failed to update client: ${err}`);
    }
  }

  /**
   * Deletes a client and its associated data (products and payments) from Firestore.
   * @param clientId The ID of the client to delete.
   * @returns The ID of the deleted client.
   */
  public static async deleteClient(clientId: string): Promise<string> {
    try {
      const firebaseStore = await this.firebaseStore;
      const clientDocRef = doc(
        firebaseStore,
        TriManageCollections.Clients,
        clientId,
      );
      const clientSnapshot = await getDoc(clientDocRef);

      if (!clientSnapshot.exists()) {
        throw new Error(`Client with ID ${clientId} does not exist`);
      }

      const productsCollectionRef = collection(
        firebaseStore,
        TriManageCollections.Products,
      );
      const clientProductsQuery = query(
        productsCollectionRef,
        where("clientId", "==", clientId),
      );
      const clientProductsSnapshot = await getDocs(clientProductsQuery);

      const batch = writeBatch(firebaseStore);
      const productIds: string[] = [];

      clientProductsSnapshot.forEach((productDoc) => {
        productIds.push(productDoc.id);
        batch.delete(productDoc.ref);
      });

      if (productIds.length > 0) {
        const paymentsCollectionRef = collection(
          firebaseStore,
          TriManageCollections.Payments,
        );
        const paymentsQuery = query(
          paymentsCollectionRef,
          where("productId", "in", productIds),
        );
        const paymentsSnapshot = await getDocs(paymentsQuery);

        paymentsSnapshot.forEach((paymentDoc) => {
          batch.delete(paymentDoc.ref);
        });
      }

      batch.delete(clientDocRef);
      await batch.commit();

      return clientId;
    } catch (err) {
      throw new Error(`[${CURRENT_APP_MODE}] Failed to delete client: ${err}`);
    }
  }
}

export default ClientServices;

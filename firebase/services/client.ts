import {
  getDocs,
  doc,
  writeBatch,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";

import Client from "@/types/Client";
import { CURRENT_APP_MODE } from "@/utilities/environment";

import {
  getCollectionName,
  getCollectionRef,
  getFirestoreUtilities,
  indexItemsById,
  TriManageCollections,
} from "../utilities";

export async function fetchAllClients(): Promise<Record<string, Client>> {
  try {
    const { auth } = await getFirestoreUtilities();

    const user = auth.currentUser;

    if (!user) {
      throw new Error("User is not authenticated");
    }

    const clientsCollection = await getCollectionRef(
      TriManageCollections.Clients,
    );
    const clientsSnapshot = await getDocs(clientsCollection);

    const clients: Client[] = await Promise.all(
      clientsSnapshot.docs.map(async (doc) => {
        const client = doc.data();

        const clientEntry: Client = {
          id: doc.id,
          type: "Client",
          name: client.name,
          phoneNumber: client.phoneNumber,
          note: client.note || "",
        };

        return clientEntry;
      }),
    );
    return indexItemsById(clients);
  } catch (err) {
    throw new Error(`[${CURRENT_APP_MODE}] Error fetching clients: ${err}`);
  }
}

export async function addNewClient(
  newClient: Omit<Client, "id">,
): Promise<Client> {
  try {
    const { auth } = await getFirestoreUtilities();

    const user = auth.currentUser;

    if (!user) {
      throw new Error("User is not authenticated");
    }

    const clientsCollection = await getCollectionRef(
      TriManageCollections.Clients,
    );

    const clientDocRef = await addDoc(clientsCollection, {
      name: newClient.name,
      phoneNumber: newClient.phoneNumber,
      note: newClient.note,
    });

    const addedClient: Client = {
      id: clientDocRef.id,
      ...newClient,
    };

    // console.log(`[${CURRENT_APP_MODE}] Client added with ID: ${clientDocRef.id}`);
    return addedClient;
  } catch (err) {
    throw new Error(`[${CURRENT_APP_MODE}] Failed to add client: ${err}`);
  }
}

export async function updateClient(
  clientId: string,
  updatedClient: Partial<Client>,
): Promise<Client> {
  const { auth, firestoreConfigs } = await getFirestoreUtilities();

  try {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("User is not authenticated");
    }

    const clientDocRef = doc(
      firestoreConfigs,
      getCollectionName(TriManageCollections.Clients),
      clientId,
    );

    await updateDoc(clientDocRef, updatedClient);

    const updatedClientDoc = await getDoc(clientDocRef);
    if (!updatedClientDoc.exists()) {
      throw new Error("Client not found after update");
    }

    const clientData = updatedClientDoc.data();

    // console.log(`[${CURRENT_APP_MODE}] Client updated with ID: ${clientId}`);
    return { id: updatedClientDoc.id, ...clientData } as Client;
  } catch (err) {
    throw new Error(`[${CURRENT_APP_MODE}] Failed to update client: ${err}`);
  }
}

export async function deleteClient(clientId: string): Promise<string> {
  const { auth, firestoreConfigs } = await getFirestoreUtilities();

  try {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("User is not authenticated");
    }

    const clientDocRef = doc(
      firestoreConfigs,
      getCollectionName(TriManageCollections.Clients),
      clientId,
    );
    const clientSnapshot = await getDoc(clientDocRef);

    if (!clientSnapshot.exists()) {
      throw new Error(`Client with ID ${clientId} does not exist`);
    }

    const productsCollectionRef = await getCollectionRef(
      TriManageCollections.Products,
    );
    const clientProductsQuery = query(
      productsCollectionRef,
      where("clientId", "==", clientId),
    );
    const clientProductsSnapshot = await getDocs(clientProductsQuery);

    const batch = writeBatch(firestoreConfigs);
    const productIds: string[] = [];

    clientProductsSnapshot.forEach((productDoc) => {
      productIds.push(productDoc.id);
      batch.delete(productDoc.ref);
    });

    if (productIds.length > 0) {
      const paymentsCollectionRef = await getCollectionRef(
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

    // console.log(
    //   `[${CURRENT_APP_MODE}] Client and associated data deleted for ID: ${clientId}`,
    // );
    return clientId;
  } catch (err) {
    throw new Error(`[${CURRENT_APP_MODE}] Failed to delete client: ${err}`);
  }
}

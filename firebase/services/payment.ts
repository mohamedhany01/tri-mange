import {
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import Payment from "@/types/Payment";

import {
  getCollectionName,
  getCollectionRef,
  getFirestoreUtilities,
  indexItemsById,
  TriManageCollections,
} from "../utilities";

// Fetch all payments
export async function fetchAllPayments(): Promise<Record<string, Payment>> {
  try {
    const paymentsCollection = await getCollectionRef(
      TriManageCollections.Payments,
    );
    const paymentsSnapshot = await getDocs(paymentsCollection);

    const payments: Payment[] = await Promise.all(
      paymentsSnapshot.docs.map(async (doc) => {
        const payment = doc.data();

        return {
          id: doc.id,
          type: "Payment",
          amount: payment.amount,
          productId: payment.productId,
          clientId: payment.clientId,
          note: payment.note || "",
          created: payment.created || "",
        } as Payment;
      }),
    );

    return indexItemsById(payments);
  } catch (err) {
    throw new Error(`${err}`);
  }
}

// Add a new payment
export async function addNewPayment(
  newPayment: Omit<Payment, "id">,
): Promise<Payment> {
  try {
    const paymentsCollection = await getCollectionRef(
      TriManageCollections.Payments,
    );
    const paymentDocRef = await addDoc(paymentsCollection, {
      amount: newPayment.amount,
      productId: newPayment.productId,
      clientId: newPayment.clientId,
      note: newPayment.note ?? "",
      created: newPayment.created,
    });

    return {
      id: paymentDocRef.id,
      ...newPayment,
    };
  } catch (error) {
    throw new Error(`Failed to add payment: ${error}`);
  }
}

// Update payment by ID
export async function updatePayment(
  paymentId: string,
  updatedPayment: Partial<Payment>,
): Promise<Payment> {
  try {
    const { firestoreConfigs } = await getFirestoreUtilities();

    const paymentDocRef = doc(
      firestoreConfigs,
      getCollectionName(TriManageCollections.Payments),
      paymentId,
    );

    await updateDoc(paymentDocRef, updatedPayment);

    const updatedPaymentDoc = await getDoc(paymentDocRef);
    if (!updatedPaymentDoc.exists()) {
      throw new Error("Payment not found after update");
    }

    const paymentData = updatedPaymentDoc.data();

    return {
      id: updatedPaymentDoc.id,
      ...paymentData,
    } as Payment;
  } catch (error) {
    throw new Error(`Failed to update payment: ${error}`);
  }
}

// Delete payment by ID
export async function deletePayment(id: string): Promise<string> {
  try {
    const { firestoreConfigs } = await getFirestoreUtilities();
    const paymentDocRef = doc(
      firestoreConfigs,
      getCollectionName(TriManageCollections.Payments),
      id,
    );

    await deleteDoc(paymentDocRef);
    return id;
  } catch (error) {
    throw new Error(`Failed to delete payment: ${error}`);
  }
}

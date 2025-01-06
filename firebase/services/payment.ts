import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import {
  indexItemsById,
  TriManageCollections,
} from "@/firebase/utilities/extra";
import FirebaseInitializer from "@/firebase/utilities/firebaseConfig";
import Payment from "@/types/Payment";

/**
 * Service class for managing Payment-related operations in Firestore.
 */
class PaymentServices {
  private static readonly firebaseStore =
    PaymentServices.initializeFirebaseStore();

  private static async initializeFirebaseStore() {
    const firebaseInitializer = FirebaseInitializer.getInstance();
    const { firebaseStore } = await firebaseInitializer.getFirebaseUtilities();
    return firebaseStore;
  }

  /**
   * Fetches all payments from Firestore.
   * @returns A promise resolving to a record of payments indexed by their IDs.
   */
  public static async fetchAllPayments(): Promise<Record<string, Payment>> {
    try {
      const firebaseStore = await this.firebaseStore;
      const paymentsSnapshot = await getDocs(
        collection(firebaseStore, TriManageCollections.Payments),
      );

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
      throw new Error(`Failed to fetch payments: ${err}`);
    }
  }

  /**
   * Adds a new payment to Firestore.
   * @param newPayment The payment data to add (excluding the ID).
   * @returns The newly added payment including its generated ID.
   */
  public static async addNewPayment(
    newPayment: Omit<Payment, "id">,
  ): Promise<Payment> {
    try {
      const firebaseStore = await this.firebaseStore;
      const paymentDocRef = await addDoc(
        collection(firebaseStore, TriManageCollections.Payments),
        {
          amount: newPayment.amount,
          productId: newPayment.productId,
          clientId: newPayment.clientId,
          note: newPayment.note ?? "",
          created: newPayment.created,
        },
      );

      return {
        id: paymentDocRef.id,
        ...newPayment,
      };
    } catch (error) {
      throw new Error(`Failed to add payment: ${error}`);
    }
  }

  /**
   * Updates an existing payment in Firestore.
   * @param paymentId The ID of the payment to update.
   * @param updatedPayment Partial data to update the payment with.
   * @returns The updated payment.
   */
  public static async updatePayment(
    paymentId: string,
    updatedPayment: Partial<Payment>,
  ): Promise<Payment> {
    try {
      const firebaseStore = await this.firebaseStore;
      const paymentDocRef = doc(
        firebaseStore,
        TriManageCollections.Payments,
        paymentId,
      );

      await updateDoc(paymentDocRef, updatedPayment);

      const updatedPaymentDoc = await getDoc(paymentDocRef);
      if (!updatedPaymentDoc.exists()) {
        throw new Error("Payment not found after update");
      }

      return {
        id: updatedPaymentDoc.id,
        ...updatedPaymentDoc.data(),
      } as Payment;
    } catch (error) {
      throw new Error(`Failed to update payment: ${error}`);
    }
  }

  /**
   * Deletes a payment from Firestore by its ID.
   * @param paymentId The ID of the payment to delete.
   * @returns The ID of the deleted payment.
   */
  public static async deletePayment(paymentId: string): Promise<string> {
    try {
      const firebaseStore = await this.firebaseStore;
      const paymentDocRef = doc(
        firebaseStore,
        TriManageCollections.Payments,
        paymentId,
      );

      await deleteDoc(paymentDocRef);
      return paymentId;
    } catch (error) {
      throw new Error(`Failed to delete payment: ${error}`);
    }
  }
}

export default PaymentServices;

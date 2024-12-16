import {
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

import Product from "@/types/Product";

import {
  getCollectionName,
  getCollectionRef,
  getFirestoreUtilities,
  indexItemsById,
  TriManageCollections,
} from "../utilities";

export async function fetchAllProducts(): Promise<Record<string, Product>> {
  try {
    const productsCollection = await getCollectionRef(
      TriManageCollections.Products,
    );
    const productsSnapshot = await getDocs(productsCollection);

    const products: Product[] = await Promise.all(
      productsSnapshot.docs.map(async (doc) => {
        const product = doc.data();

        const productEntry: Product = {
          id: doc.id,
          name: product.name,
          totalPrice: product.totalPrice,
          type: "Product",
          note: product.note || "",
          created: product.created || "",
          clientId: product.clientId,
        };

        return productEntry;
      }),
    );

    return indexItemsById(products);
  } catch (err) {
    throw new Error(`${err}`);
  }
}

/**
 * Adds a new product to the Firestore database and returns the added product with its new ID.
 * @param newProduct - The product data to add (without an ID).
 * @returns The added product with its ID.
 * @throws Error if there is an issue adding the product to Firestore.
 */
export async function addNewProduct(
  newProduct: Omit<Product, "id">,
): Promise<Product> {
  try {
    const productsCollection = await getCollectionRef(
      TriManageCollections.Products,
    );

    const productDocRef = await addDoc(productsCollection, {
      name: newProduct.name,
      totalPrice: Number(newProduct.totalPrice),
      note: newProduct.note ?? "",
      created: newProduct.created,
      clientId: newProduct.clientId,
    });

    const addedProduct: Product = {
      id: productDocRef.id,
      ...newProduct,
    };

    return addedProduct;
  } catch (error) {
    throw new Error(`Failed to add product: ${error}`);
  }
}

/**
 * Updates an existing product in the Firestore database.
 * @param productId - The ID of the product to update.
 * @param updatedProduct - Partial data of the product to update.
 * @returns The updated product.
 * @throws Error if there is an issue updating the product in Firestore.
 */
export async function updateProduct(
  productId: string,
  updatedProduct: Partial<Product>,
): Promise<Product> {
  try {
    const { firestoreConfigs } = await getFirestoreUtilities();

    const productDocRef = doc(
      firestoreConfigs,
      getCollectionName(TriManageCollections.Products),
      productId,
    );
    // Update only the provided fields in updatedProduct
    await updateDoc(productDocRef, updatedProduct);

    // Retrieve the updated document to confirm and return the full product data
    const updatedProductDoc = await getDoc(productDocRef);
    if (!updatedProductDoc.exists()) {
      throw new Error("Product not found after update");
    }

    const productData = updatedProductDoc.data();

    return {
      id: updatedProductDoc.id,
      ...productData,
    } as Product;
  } catch (error) {
    throw new Error(`Failed to update product: ${error}`);
  }
}

/**
 * Deletes a product from Firestore by its ID.
 * @param id - The ID of the product to delete.
 * @returns The ID of the deleted product.
 * @throws Error if there is an issue deleting the product from Firestore.
 */
export async function deleteProduct(productId: string): Promise<string> {
  const { firestoreConfigs } = await getFirestoreUtilities();
  try {
    const productDocRef = doc(
      firestoreConfigs,
      getCollectionName(TriManageCollections.Products),
      productId,
    );
    const productSnapshot = await getDoc(productDocRef);

    if (!productSnapshot.exists()) {
      throw new Error(`Client with ID ${productId} does not exist`);
    }

    const paymentsCollectionRef = await getCollectionRef(
      TriManageCollections.Payments,
    );
    const productPaymentsQuery = query(
      paymentsCollectionRef,
      where("productId", "==", productId),
    );
    const productPaymentsSnapshot = await getDocs(productPaymentsQuery);

    // Start a batch operation
    const batch = writeBatch(firestoreConfigs);

    // Add each payment associated with the product to the batch for deletion
    productPaymentsSnapshot.forEach((paymentDoc) => {
      batch.delete(paymentDoc.ref);
    });

    // Delete the client document itself
    batch.delete(productDocRef);

    // Commit the batch operation
    await batch.commit();

    return productId;
  } catch (error) {
    throw new Error(`Failed to delete product: ${error}`);
  }
}

// async function getPaymentsByIDs(IDs: string[]): Promise<Payment[]> {
//   try {
//     const payments: Payment[] = await Promise.all(
//       IDs.map(async (id) => {
//         const paymentDoc = doc(appConfigurations, `payments/${id}`);
//         const paymentSnapshot = await getDoc(paymentDoc);

//         if (!paymentSnapshot.exists()) {
//           throw new Error('Error in the <payments> list check DB');
//         }

//         const payment = paymentSnapshot.data();

//         const paymentEntry: Payment = {
//           id: payment.id,
//           amount: payment.amount,
//           created: payment.created || ' ',
//           note: payment.note || ' ',
//           productId: payment.productId,
//         };

//         return paymentEntry;
//       }),
//     );

//     return payments;
//   } catch (err) {
//     throw new Error(`${err}`);
//   }
// }

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

import {
  indexItemsById,
  TriManageCollections,
} from "@/firebase/utilities/extra";
import FirebaseInitializer from "@/firebase/utilities/firebaseConfig";
import Product from "@/types/Product";

/**
 * Service class for managing Product-related operations in Firestore.
 */
class ProductServices {
  private static readonly firebaseStore =
    ProductServices.initializeFirebaseStore();

  private static async initializeFirebaseStore() {
    const firebaseInitializer: FirebaseInitializer =
      FirebaseInitializer.getInstance();
    const { firebaseStore } = await firebaseInitializer.getFirebaseUtilities();
    return firebaseStore;
  }

  /**
   * Fetches all products from the Firestore database.
   * @returns A promise resolving to a record of products indexed by their IDs.
   */
  public static async fetchAllProducts(): Promise<Record<string, Product>> {
    try {
      const firebaseStore = await this.firebaseStore;
      const productsSnapshot = await getDocs(
        collection(firebaseStore, TriManageCollections.Products),
      );

      const products: Product[] = await Promise.all(
        productsSnapshot.docs.map(async (doc) => {
          const product = doc.data();
          return {
            id: doc.id,
            name: product.name,
            totalPrice: product.totalPrice,
            isFullyPaid: product.isFullyPaid || false,
            type: "Product",
            note: product.note || "",
            created: product.created || "",
            clientId: product.clientId,
          } as Product;
        }),
      );

      return indexItemsById(products);
    } catch (err) {
      throw new Error(`Failed to fetch products: ${err}`);
    }
  }

  /**
   * Adds a new product to Firestore.
   * @param newProduct The product data to add (excluding the ID).
   * @returns The newly added product including its generated ID.
   */
  public static async addNewProduct(
    newProduct: Omit<Product, "id">,
  ): Promise<Product> {
    try {
      const firebaseStore = await this.firebaseStore;
      const productDocRef = await addDoc(
        collection(firebaseStore, TriManageCollections.Products),
        {
          name: newProduct.name,
          isFullyPaid: false,
          totalPrice: Number(newProduct.totalPrice),
          note: newProduct.note ?? "",
          created: newProduct.created,
          clientId: newProduct.clientId,
        },
      );

      return {
        id: productDocRef.id,
        ...newProduct,
      };
    } catch (error) {
      throw new Error(`Failed to add product: ${error}`);
    }
  }

  /**
   * Updates an existing product in Firestore.
   * @param productId The ID of the product to update.
   * @param updatedProduct Partial data to update the product with.
   * @returns The updated product.
   */
  public static async updateProduct(
    productId: string,
    updatedProduct: Partial<Product>,
  ): Promise<Product> {
    try {
      const firebaseStore = await this.firebaseStore;
      const productDocRef = doc(
        firebaseStore,
        TriManageCollections.Products,
        productId,
      );

      await updateDoc(productDocRef, updatedProduct);

      const updatedProductDoc = await getDoc(productDocRef);
      if (!updatedProductDoc.exists()) {
        throw new Error("Product not found after update");
      }

      return {
        id: updatedProductDoc.id,
        ...updatedProductDoc.data(),
      } as Product;
    } catch (error) {
      throw new Error(`Failed to update product: ${error}`);
    }
  }

  /**
   * Deletes a product and its associated payments from Firestore.
   * @param productId The ID of the product to delete.
   * @returns The ID of the deleted product.
   */
  public static async deleteProduct(productId: string): Promise<string> {
    try {
      const firebaseStore = await this.firebaseStore;
      const productDocRef = doc(
        firebaseStore,
        TriManageCollections.Products,
        productId,
      );

      const productSnapshot = await getDoc(productDocRef);
      if (!productSnapshot.exists()) {
        throw new Error(`Product with ID ${productId} does not exist`);
      }

      const paymentsCollectionRef = collection(
        firebaseStore,
        TriManageCollections.Payments,
      );
      const productPaymentsQuery = query(
        paymentsCollectionRef,
        where("productId", "==", productId),
      );
      const productPaymentsSnapshot = await getDocs(productPaymentsQuery);

      const batch = writeBatch(firebaseStore);
      productPaymentsSnapshot.forEach((paymentDoc) =>
        batch.delete(paymentDoc.ref),
      );
      batch.delete(productDocRef);

      await batch.commit();
      return productId;
    } catch (error) {
      throw new Error(`Failed to delete product: ${error}`);
    }
  }
}

export default ProductServices;

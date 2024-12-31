import { createSelector } from "@reduxjs/toolkit";

import Product from "@/types/Product";

import { RootState } from "..";

/**
 * Selector to get all products for a specific client by clientId.
 * @param state - The root state of the Redux store.
 * @param clientId - The ID of the client to filter products by.
 * @returns An array of products associated with the specified client.
 */
export const selectProductsByClientId = (clientId: string) =>
  createSelector(
    (state: RootState) => state.product.products,
    (products: Record<string, Product>) =>
      Object.values(products).filter(
        (product) => product.clientId === clientId,
      ),
  );

export const selectProductById = (id: string) =>
  createSelector(
    (state: RootState) => state.product.products,
    (products: Record<string, Product>) => products[id] || [],
  );

export const selectCompleteProductsByClientId = (clientId: string) =>
  createSelector(
    (state: RootState) => state.product.products,
    (products: Record<string, Product>) =>
      Object.values(products).filter(
        (product) => product.clientId === clientId && product.isFullyPaid,
      ) || [],
  );

export const selectIncompleteProductsByClientId = (clientId: string) =>
  createSelector(
    (state: RootState) => state.product.products,
    (products: Record<string, Product>) =>
      Object.values(products).filter(
        (product) => product.clientId === clientId && !product.isFullyPaid,
      ) || [],
  );

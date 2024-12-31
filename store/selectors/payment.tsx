import { createSelector } from "@reduxjs/toolkit";

import Payment from "@/types/Payment";

import { RootState } from "..";

export const selectPaymentsByProductId = (productId: string) =>
  createSelector(
    (state: RootState) => state.payment.payments,
    (payments: Record<string, Payment>) =>
      Object.values(payments).filter(
        (payment) => payment.productId === productId,
      ) || [],
  );

export const selectPaymentsByProductIdExcludePayment = (
  productId: string,
  paymentId: string,
) =>
  createSelector(
    (state: RootState) => state.payment.payments,
    (payments: Record<string, Payment>) =>
      Object.values(payments).filter(
        (payment) =>
          payment.productId === productId && payment.id !== paymentId,
      ) || [],
  );

export const selectPaymentsByClientId = (clientId: string) =>
  createSelector(
    (state: RootState) => state.payment.payments,
    (payments: Record<string, Payment>) =>
      Object.values(payments).filter(
        (payment) => payment.clientId === clientId,
      ) || [],
  );

export const selectPaymentById = (id: string) =>
  createSelector(
    (state: RootState) => state.payment.payments,
    (payments: Record<string, Payment>) => payments[id] || [],
  );

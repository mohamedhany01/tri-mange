import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  addNewPayment,
  deletePayment,
  fetchAllPayments,
  updatePayment,
} from "@/firebase/services/payment";
import Payment from "@/types/Payment";

export interface PaymentState {
  payments: Record<string, Payment>;
}

const initialState: PaymentState = {
  payments: {},
};

export const getAllPayments = createAsyncThunk("get/all/payments", async () => {
  const payments = await fetchAllPayments();
  return payments;
});

export const addOnePayment = createAsyncThunk(
  "add/one/payment",
  async (payment: Omit<Payment, "id">) => {
    const addedPayment = await addNewPayment(payment);
    return addedPayment;
  },
);

export const updateOnePayment = createAsyncThunk(
  "update/one/payment",
  async ({ id, payment }: { id: string; payment: Partial<Payment> }) => {
    const updatedPayment = await updatePayment(id, payment);
    return updatedPayment;
  },
);

export const deleteOnePayment = createAsyncThunk(
  "delete/one/payment",
  async (paymentId: string) => {
    const deletedId = await deletePayment(paymentId);
    return deletedId;
  },
);

export const paymentSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    removePaymentsUsingClientId: (state, action) => {
      const clientId = action.payload;
      state.payments = Object.keys(state.payments).reduce(
        (acc, paymentId) => {
          const payment = state.payments[paymentId];
          if (payment.clientId !== clientId) {
            acc[paymentId] = payment;
          }
          return acc;
        },
        {} as Record<string, Payment>,
      );
    },
    removePaymentsUsingProductId: (state, action) => {
      const productId = action.payload;

      state.payments = Object.keys(state.payments).reduce(
        (acc, paymentId) => {
          const payment = state.payments[paymentId];
          if (payment.productId !== productId) {
            acc[paymentId] = payment;
          }
          return acc;
        },
        {} as Record<string, Payment>,
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllPayments.fulfilled, (state, action) => {
      state.payments = action.payload;
    });
    builder.addCase(addOnePayment.fulfilled, (state, action) => {
      state.payments = {
        [action.payload.id]: action.payload,
        ...state.payments,
      };
    });
    builder.addCase(updateOnePayment.fulfilled, (state, action) => {
      state.payments[action.payload.id] = action.payload;
    });
    builder.addCase(deleteOnePayment.fulfilled, (state, action) => {
      const deletedPaymentId = action.payload;
      const { [deletedPaymentId]: _, ...remainingPayments } = state.payments;
      state.payments = remainingPayments;
    });
  },
});

// Export the actions and reducer
export const { removePaymentsUsingProductId, removePaymentsUsingClientId } =
  paymentSlice.actions;
export default paymentSlice.reducer;

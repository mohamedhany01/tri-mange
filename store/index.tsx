import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import authReducer from "./slices/authSlice";
import clientReducer from "./slices/clientSlice";
import paymentReducer from "./slices/paymentSlice";
import productReducer from "./slices/productSlice";

export const store = configureStore({
  reducer: {
    client: clientReducer,
    product: productReducer,
    payment: paymentReducer,
    auth: authReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {client: ClientState, product: ProductState}
type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

// Other way https://youtu.be/EqbwHO6Vgbg?si=P7S0F-8nwtikYL2X&t=438

// export const useAppDispatch: () => typeof store.dispatch = useDispatch;
// export const useAppSelector: TypedUseSelectorHook<
//   ReturnType<typeof store.getState>
// > = useSelector;

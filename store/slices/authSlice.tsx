import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

import { firebaseInitPromise } from "@/firebase/configuration";

interface AuthState {
  isAuthenticated: boolean | undefined;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: undefined,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const auth = (await firebaseInitPromise).auth;

      const user = await signInWithEmailAndPassword(auth, email, password);
      return !!user.user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const logoutThunk = createAsyncThunk("auth/logout", async () => {
  try {
    await (await firebaseInitPromise).auth.signOut();
  } catch (error: any) {
    throw new Error(`Logout failed ${error.message}`);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticationState: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      login.fulfilled,
      (state, action: PayloadAction<boolean>) => {
        state.isAuthenticated = action.payload;
      },
    );
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.isAuthenticated = false;
    });
  },
});

export const { setAuthenticationState } = authSlice.actions;
export default authSlice.reducer;

export const setupAuthListener = () => async (dispatch: any) => {
  const auth = (await firebaseInitPromise).auth;

  onAuthStateChanged(auth, (user) => {
    const isAuthenticated = !!user;
    dispatch(setAuthenticationState(isAuthenticated));
  });
};

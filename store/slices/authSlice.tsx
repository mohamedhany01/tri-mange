import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

import FirebaseInitializer from "@/firebase/utilities/firebaseConfig";

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
      const firebaseInitializer: FirebaseInitializer =
        FirebaseInitializer.getInstance();
      const { firebaseAuth } = await firebaseInitializer.getFirebaseUtilities();

      const user = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password,
      );
      return !!user.user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const logoutThunk = createAsyncThunk("auth/logout", async () => {
  try {
    const firebaseInitializer: FirebaseInitializer =
      FirebaseInitializer.getInstance();
    const { firebaseAuth } = await firebaseInitializer.getFirebaseUtilities();

    await firebaseAuth.signOut();
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
  const firebaseInitializer: FirebaseInitializer =
    FirebaseInitializer.getInstance();
  const { firebaseAuth } = await firebaseInitializer.getFirebaseUtilities();

  onAuthStateChanged(firebaseAuth, (user) => {
    const isAuthenticated = !!user;
    dispatch(setAuthenticationState(isAuthenticated));
  });
};

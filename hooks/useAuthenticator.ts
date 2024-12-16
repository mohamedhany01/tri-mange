import { useEffect } from "react";
import { useSelector } from "react-redux";

import { RootState, useAppDispatch } from "@/store";
import { setupAuthListener } from "@/store/slices/authSlice";

export const useAuthenticator = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  useEffect(() => {
    dispatch(setupAuthListener()).catch((error) => {
      throw new Error(`Error setting up auth listener: ${error.message}`);
    });
  }, [dispatch]);

  return { isAuthenticated };
};

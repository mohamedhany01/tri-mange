import { useCallback, useState } from "react";

interface SnackbarState {
  visible: boolean;
  message: string;
  backgroundColor: string;
}

const useSnackbar = () => {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    visible: false,
    message: "",
    backgroundColor: "success",
  });

  // Enhanced (stable) version
  const showSnackbar = useCallback(
    (message: string, backgroundColor: string = "error") => {
      setSnackbar({ visible: true, message, backgroundColor });
    },
    [],
  );

  // Unstable reference version
  // const showSnackbar = (message: string, backgroundColor: string = "error") => {
  //   setSnackbar({ visible: true, message, backgroundColor });
  // };

  // Enhanced (stable) version
  const hideSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, visible: false }));
  }, []);

  // Unstable reference version
  // const hideSnackbar = () => {
  //   setSnackbar((prev) => ({ ...prev, visible: false }));
  // };

  return {
    snackbar,
    showSnackbar,
    hideSnackbar,
  };
};

export default useSnackbar;

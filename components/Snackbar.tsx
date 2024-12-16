import React, { useCallback, useEffect, useRef, useState } from "react";
import { Text, StyleSheet, Animated } from "react-native";

interface SnackbarProps {
  message: string;
  backgroundColor?: "error" | "warning" | "success" | string;
  duration?: number;
  position?: "top" | "bottom";
  onClose?: () => void;
}

const DEFAULT_DURATION = 3000;

const Snackbar: React.FC<SnackbarProps> = ({
  message,
  backgroundColor = "success",
  duration,
  position = "bottom",
  onClose, // Passed to useCallback as dep assuming it's wrapped with useCallback from the parent!
}) => {
  const [visible, setVisible] = useState(true);
  const [translateY] = useState(new Animated.Value(0));
  const durationRef = useRef(duration ?? DEFAULT_DURATION); // Set default, use ref to make it stable to pass it to the useEffect

  const backgroundColors = {
    error: "#f44336",
    warning: "#ff9800",
    success: "#4caf50",
  };

  const bgColor =
    backgroundColor in backgroundColors
      ? backgroundColors[backgroundColor as keyof typeof backgroundColors]
      : backgroundColor;

  const handleClose = useCallback(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      if (onClose) onClose();
    });
  }, [translateY, onClose]);

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      handleClose();
    }, durationRef.current);

    return () => {
      clearTimeout(timer);
    };
  }, [handleClose, translateY]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: bgColor,
          transform: [{ translateY }],
          top: position === "top" ? 0 : undefined,
          bottom: position === "bottom" ? 0 : undefined,
        },
      ]}
    >
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    padding: 16,
    zIndex: 1000,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  message: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Snackbar;

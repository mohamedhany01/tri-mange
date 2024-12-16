import { Alert } from "react-native";

interface ConfirmationAlertProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

const ConfirmationAlert = ({
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}: ConfirmationAlertProps) => {
  const showAlert = () => {
    Alert.alert(
      title,
      message,
      [
        {
          text: cancelText,
          style: "cancel",
          onPress: onCancel,
        },
        {
          text: confirmText,
          style: "destructive",
          onPress: onConfirm,
        },
      ],
      { cancelable: true },
    );
  };

  return { showAlert };
};

export default ConfirmationAlert;

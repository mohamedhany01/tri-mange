import Ionicons from "@expo/vector-icons/Ionicons";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  ActivityIndicator,
} from "react-native";

interface DynamicButtonProps {
  variant: "danger" | "success" | "info";
  title?: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  buttonStyle?: ViewStyle;
  iconName?: keyof typeof Ionicons.glyphMap;
}

const DynamicButton: React.FC<DynamicButtonProps> = ({
  variant,
  title,
  onPress,
  disabled,
  loading,
  buttonStyle,
  iconName,
}) => {
  const buttonColors = {
    danger: "#FF4C4C",
    success: "#4CAF50",
    info: "#2196F3",
  };

  const handlePress = () => {
    if (!(loading ?? false) && onPress) onPress();
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: buttonColors[variant] },
        buttonStyle,
        (disabled ?? false) || (loading ?? false) ? styles.disabledButton : {},
      ]}
      onPress={handlePress}
      disabled={(disabled ?? false) || (loading ?? false)}
    >
      <View style={styles.content}>
        {(loading ?? false) ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <>
            {iconName && (
              <Ionicons
                name={iconName}
                size={20}
                color="white"
                style={styles.icon}
              />
            )}
            {title && <Text style={styles.text}>{title}</Text>}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 4,
    marginVertical: 8,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 4,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default DynamicButton;

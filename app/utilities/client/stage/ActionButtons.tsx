import { StyleSheet, View } from "react-native";

import DynamicButton from "@/components/DynamicButton";

interface ActionButtonsProps {
  onUpdate: () => void;
  onDelete: () => void;
  onAddProduct: () => void;
}

const ActionButtons = ({
  onUpdate,
  onDelete,
  onAddProduct,
}: ActionButtonsProps) => {
  return (
    <View style={styles.buttonsContainer}>
      <DynamicButton
        variant="info"
        onPress={onUpdate}
        iconName="pencil-outline"
      />
      <DynamicButton
        variant="danger"
        onPress={onDelete}
        iconName="person-remove-outline"
      />
      <DynamicButton
        variant="success"
        onPress={onAddProduct}
        iconName="albums-outline"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    flexGrow: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#DFE6E9",
    padding: 8,
    borderRadius: 8,
  },
});

export default ActionButtons;

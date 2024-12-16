import { View, Text, StyleSheet } from "react-native";

import { useLocalization } from "@/context/Localization";
import Payment from "@/types/Payment";

import ActionButtons from "./ActionButtons";
import PaymentInfo from "./PaymentInfo";

interface PaymentStageProps {
  payment: Payment;
  onUpdate: () => void;
  onDelete: () => void;
}

const PaymentStage = ({ payment, onUpdate, onDelete }: PaymentStageProps) => {
  const { t } = useLocalization();

  return (
    <View style={styles.container}>
      {payment ? (
        <>
          <View style={styles.viewContainer}>
            <PaymentInfo payment={payment} />
            <ActionButtons onUpdate={onUpdate} onDelete={onDelete} />
          </View>
        </>
      ) : (
        <Text>{t("loadingText")}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  viewContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  product: {
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 10,
  },
});

export default PaymentStage;

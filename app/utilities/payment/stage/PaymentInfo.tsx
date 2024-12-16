import { StyleSheet, Text, View } from "react-native";

import Payment from "@/types/Payment";

const PaymentInfo: React.FC<{
  payment: Payment;
}> = ({ payment }) => {
  return (
    <>
      <View style={styles.paymentContainer}>
        <Text style={styles.paymentName}>{payment.amount}</Text>
        <Text style={styles.paymentNote}>{payment?.note}</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  paymentContainer: {
    flexGrow: 3,
    flexDirection: "column",
  },
  paymentName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  paymentPhone: {
    fontSize: 18,
    color: "gray",
    marginBottom: 8,
  },
  paymentNote: {
    fontSize: 16,
    color: "gray",
    marginBottom: 16,
  },
});

export default PaymentInfo;

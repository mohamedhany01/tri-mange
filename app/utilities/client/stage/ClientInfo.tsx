import { StyleSheet, Text, View } from "react-native";

import Client from "@/types/Client";

const ClientInfo: React.FC<{
  client: Client;
}> = ({ client }) => {
  return (
    <>
      <View style={styles.clientContainer}>
        <Text style={styles.clientName}>{client.name}</Text>
        <Text style={styles.clientPhone}>{client?.phoneNumber}</Text>
        <Text style={styles.clientNote}>{client?.note}</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  clientContainer: {
    flexGrow: 3,
    flexDirection: "column",
  },
  clientName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  clientPhone: {
    fontSize: 18,
    color: "gray",
    marginBottom: 8,
  },
  clientNote: {
    fontSize: 16,
    color: "gray",
    marginBottom: 16,
  },
});

export default ClientInfo;

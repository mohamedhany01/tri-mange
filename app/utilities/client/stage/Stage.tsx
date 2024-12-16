import { useRouter } from "expo-router";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useSelector } from "react-redux";

// import ProductsList from '@/components/list/product/ProductsList';
import Entity from "@/components/Entity";
import NoResult from "@/components/NoResult";
import { useLocalization } from "@/context/Localization";
import { selectProductsByClientId } from "@/store/selectors/product";
import Client from "@/types/Client";

import ActionButtons from "./ActionButtons";
import ClientInfo from "./ClientInfo";

interface ClientStageProps {
  client: Client;
  onUpdate: () => void;
  onDelete: () => void;
  onAddProduct: () => void;
}

const ClientStage = ({
  client,
  onUpdate,
  onDelete,
  onAddProduct,
}: ClientStageProps) => {
  const products = useSelector(selectProductsByClientId(client.id));
  const { t } = useLocalization();
  const router = useRouter();

  return (
    <View style={styles.container}>
      {client ? (
        <>
          <View style={styles.viewContainer}>
            <ClientInfo client={client} />
            <ActionButtons
              onUpdate={onUpdate}
              onDelete={onDelete}
              onAddProduct={onAddProduct}
            />
          </View>

          <ScrollView>
            {products && products.length > 0 ? (
              products.map((entity) => (
                <Entity
                  key={entity.id}
                  entity={entity}
                  onPress={() => {
                    router.push({
                      pathname: `/utilities/product/[id]`,
                      params: {
                        id: entity.id,
                      },
                    });
                  }}
                />
              ))
            ) : (
              <NoResult />
            )}
          </ScrollView>
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

export default ClientStage;

import { useRouter } from "expo-router";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useSelector } from "react-redux";

import Entity from "@/components/Entity";
import NoResult from "@/components/NoResult";
import { useLocalization } from "@/context/Localization";
import { selectPaymentsByProductId } from "@/store/selectors/payment";
import Product from "@/types/Product";

import ActionButtons from "./ActionButtons";
import ProductInfo from "./ProductInfo";

interface ProductStageProps {
  product: Product;
  onUpdate: () => void;
  onDelete: () => void;
  onAddPayment: () => void;
}

const ProductStage = ({
  product,
  onUpdate,
  onDelete,
  onAddPayment,
}: ProductStageProps) => {
  const payments = useSelector(selectPaymentsByProductId(product.id));
  const { t } = useLocalization();
  const router = useRouter();

  return (
    <View style={styles.container}>
      {product ? (
        <>
          <View style={styles.viewContainer}>
            <ProductInfo product={product} />
            <ActionButtons
              onUpdate={onUpdate}
              onDelete={onDelete}
              onAddPayment={onAddPayment}
            />
          </View>

          <ScrollView>
            {payments && payments.length > 0 ? (
              payments.map((entity) => (
                <Entity
                  key={entity.id}
                  entity={entity}
                  onPress={() => {
                    router.push({
                      pathname: `/utilities/payment/[id]`,
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

export default ProductStage;

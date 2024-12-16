import { StyleSheet, Text, View } from "react-native";

import Product from "@/types/Product";

const ProductInfo: React.FC<{
  product: Product;
}> = ({ product }) => {
  return (
    <>
      <View style={styles.productContainer}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productPhone}>{product.totalPrice}</Text>
        <Text style={styles.productNote}>{product?.note}</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  productContainer: {
    flexGrow: 3,
    flexDirection: "column",
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  productPhone: {
    fontSize: 18,
    color: "gray",
    marginBottom: 8,
  },
  productNote: {
    fontSize: 16,
    color: "gray",
    marginBottom: 16,
  },
});

export default ProductInfo;

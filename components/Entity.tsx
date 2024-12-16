import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import { useLocalization } from "@/context/Localization";
import { useAppSelector } from "@/store";
import {
  selectPaymentsByClientId,
  selectPaymentsByProductId,
} from "@/store/selectors/payment";
import { selectProductsByClientId } from "@/store/selectors/product";
import Client from "@/types/Client";
import Payment from "@/types/Payment";
import Product from "@/types/Product";
import { formatDate, SupportedLocale } from "@/utilities/date";
import { convertNumerals, NumeralSystem } from "@/utilities/localization";

type EntityProps = {
  entity: Client | Product | Payment;
  onPress: () => void;
};

const Entity: React.FC<EntityProps> = ({ entity, onPress }) => {
  let title = "";
  let subtitle = "";
  let iconDetails: {
    count: number | string;
    iconName: keyof typeof Ionicons.glyphMap;
  }[] = [];

  const clientProducts = useAppSelector(selectPaymentsByClientId(entity.id));
  const clientPayments = useAppSelector(selectProductsByClientId(entity.id));

  const productPayments = useAppSelector(selectPaymentsByProductId(entity.id));
  const { locale } = useLocalization();

  switch (entity.type) {
    case "Client":
      title = entity.name;
      subtitle = entity.phoneNumber ?? "No phone number";
      iconDetails = [
        { count: clientProducts.length, iconName: "cube" },
        { count: clientPayments.length, iconName: "wallet-outline" },
      ];
      break;

    case "Product":
      title = entity.name;
      subtitle = `${entity.totalPrice}`;
      iconDetails = [
        { count: productPayments.length, iconName: "wallet-outline" },
      ];
      break;

    case "Payment":
      title = `${convertNumerals(entity.amount, locale as NumeralSystem)}`;
      subtitle = entity.created
        ? formatDate(entity.created, "shortDate", locale as SupportedLocale)
        : "No date available";
      iconDetails = [];
      break;

    default:
      throw new Error("Unknown entity to render!");
  }

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <View>
          {iconDetails.map((detail, index) => (
            <View style={styles.iconContainer} key={index}>
              <Text style={styles.iconText}>{detail.count}</Text>
              <Ionicons
                name={detail.iconName}
                size={20}
                color="#4CAF50"
                style={styles.icon}
              />
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "gray",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  iconText: {
    fontSize: 14,
    color: "#4CAF50",
    marginRight: 5,
  },
  icon: {
    marginLeft: 5,
  },
});

export default Entity;

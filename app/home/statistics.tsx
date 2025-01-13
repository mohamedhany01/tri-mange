import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { I18nManager, StyleSheet, Text, View } from "react-native";

import Snackbar from "@/components/Snackbar";
import { useLocalization } from "@/context/Localization";
import useSnackbar from "@/hooks/useSnackbar";
import { useAppDispatch, useAppSelector } from "@/store";
import { getAllClients } from "@/store/slices/clientSlice";
import { getAllPayments } from "@/store/slices/paymentSlice";
import { getAllProducts } from "@/store/slices/productSlice";
import { convertNumerals, NumeralSystem } from "@/utilities/localization";

export default function StatisticsScreen() {
  const dispatch = useAppDispatch();
  const clients = useAppSelector((state) => state.client.clients);
  const products = useAppSelector((state) => state.product.products);
  const payments = useAppSelector((state) => state.payment.payments);
  const { t, locale } = useLocalization();
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        await Promise.all([
          dispatch(getAllClients()),
          dispatch(getAllProducts()),
          dispatch(getAllPayments()),
        ]);
      } catch (error) {
        showSnackbar(`Error fetching data: ${error}`, "error");
      }
    };

    fetchAllData().catch((error) => {
      showSnackbar(`Unhandled error in fetchAllData: ${error}`, "error");
    });
  }, [dispatch, showSnackbar]);

  // Calculate total revenue and average payment
  const totalRevenue = Object.values(payments).reduce(
    (acc, payment) => acc + Number(payment.amount),
    0,
  );

  const averagePayment = totalRevenue / (Object.keys(payments).length || 1); // Prevent division by zero

  // Identify top clients based on total payments
  // const clientPayments = Object.values(payments).reduce(
  //   (acc, payment) => {
  //     acc[payment.clientId] = Number((acc[payment.clientId] || 0) + payment.amount);
  //     return acc;
  //   },
  //   {} as Record<string, number>,
  // );

  // const topClients = Object.entries(clientPayments)
  //   .sort(([, a], [, b]) => b - a)
  //   .slice(0, 5); // Get top 5 clients

  return (
    <>
      <View>
        <View style={styles.statGrid}>
          {[
            {
              icon: "people",
              label: t("totalClients"),
              value: convertNumerals(
                Object.keys(clients).length,
                locale as NumeralSystem,
              ),
            },
            {
              icon: "pricetag",
              label: t("totalProducts"),
              value: convertNumerals(
                Object.keys(products).length,
                locale as NumeralSystem,
              ),
            },
            {
              icon: "cash",
              label: t("totalPayments"),
              value: convertNumerals(
                Object.keys(payments).length,
                locale as NumeralSystem,
              ),
            },
            {
              icon: "wallet",
              label: t("totalRevenue"),
              value: `${convertNumerals(Number(totalRevenue.toFixed(2)), locale as NumeralSystem)}`,
            },
            {
              icon: "stats-chart",
              label: t("averagePayment"),
              value: `${convertNumerals(Number(averagePayment.toFixed(2)), locale as NumeralSystem)}`,
            },
          ].map(({ icon, label, value }) => (
            <View key={label} style={styles.statBox}>
              <View style={styles.statBoxHeader}>
                <Ionicons
                  name={icon as keyof typeof Ionicons.glyphMap}
                  size={16}
                  color="#00796B"
                />
                <Text style={styles.statLabel}>{label}</Text>
              </View>
              <Text style={styles.statValue}>{value}</Text>
            </View>
          ))}
        </View>

        {/* TODO: disabled for now */}
        {/* <ThemedText style={styles.subTitle}>{t('topClients')}:</ThemedText>
          <View style={styles.topClientsContainer}>
            {topClients.map(([clientId, totalAmount], index) => {
              const client = clients[clientId];
              const clientName = client ? client.name : t('unknownClient');
              return (
                <TouchableOpacity key={clientId} style={styles.topClientBox}>
                  {index === 0 && (
                    <View style={styles.bestClientBadge}>
                      <Ionicons name="star" size={16} color="#FFD700" style={styles.badgeIcon} />
                      <ThemedText style={styles.bestClientLabel}>{t('topClientBadge')}</ThemedText>
                    </View>
                  )}
                  <View style={styles.clientInfo}>
                    <Ionicons name="person" size={32} color="#FFF" />
                    <View style={styles.clientText}>
                      <Text>
                        {t('clientName')}: {clientName}
                      </Text>
                      <Text>
                        {t('totalSpent')}: {formatNumber(Number(totalAmount.toFixed(2)))}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View> */}
      </View>
      {snackbar.visible && (
        <Snackbar
          message={snackbar.message}
          backgroundColor={snackbar.backgroundColor}
          duration={3000}
          position="bottom"
          onClose={hideSnackbar}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  subTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: I18nManager.isRTL ? 0 : 16,
    marginRight: I18nManager.isRTL ? 16 : 0,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  statGrid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  statBox: {
    backgroundColor: "#E0F7FA",
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    width: "48%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  statBoxHeader: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
  },
  statLabel: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#00796B",
    display: "flex",
    marginHorizontal: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "600",
    color: "#004D40",
    display: "flex",
    width: "100%",
  },
  topClientsContainer: {
    marginHorizontal: 16,
  },
  topClientBox: {
    backgroundColor: "#00796B",
    borderRadius: 8,
    padding: 16,
    marginVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  clientInfo: {
    // flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    alignItems: "center",
  },
  clientText: {
    display: "flex",
    flexDirection: "column",
    marginLeft: I18nManager.isRTL ? 0 : 8,
    marginRight: I18nManager.isRTL ? 8 : 0,
    color: "#FFF",
  },
  bestClientBadge: {
    flexDirection: "row",
    backgroundColor: "#143636",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeIcon: {
    marginRight: I18nManager.isRTL ? 0 : 4,
    marginLeft: I18nManager.isRTL ? 4 : 0,
  },
  bestClientLabel: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});

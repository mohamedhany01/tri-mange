import React, { useEffect } from "react";
import { View } from "react-native";

import Snackbar from "@/components/Snackbar";
import { EntitiesStatistics } from "@/components/app/home/statistics";
import { useLocalization } from "@/context/Localization";
import useSnackbar from "@/hooks/useSnackbar";
import { useAppDispatch, useAppSelector } from "@/store";
import { getAllClients } from "@/store/slices/clientSlice";
import { getAllPayments } from "@/store/slices/paymentSlice";
import { getAllProducts } from "@/store/slices/productSlice";
import { convertNumerals, NumeralSystem } from "@/utilities/localization";

export default function StatisticsScreen() {
  // TODO: 5 renders (component, useeffect, three dispatches)

  const dispatch = useAppDispatch();
  const clients = useAppSelector((state) => state.client.clients);
  const products = useAppSelector((state) => state.product.products);
  const payments = useAppSelector((state) => state.payment.payments);
  const { t, locale } = useLocalization();
  const {
    snackbar: { visible, backgroundColor, message },
    showSnackbar,
    hideSnackbar,
  } = useSnackbar();

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

  return (
    <>
      <View>
        <EntitiesStatistics
          statistics={[
            {
              title: t("totalClients"),
              icon: "person",
              count: convertNumerals(
                Object.keys(clients).length,
                locale as NumeralSystem,
              ),
            },
            {
              title: t("totalProducts"),
              icon: "pricetag",
              count: convertNumerals(
                Object.keys(products).length,
                locale as NumeralSystem,
              ),
            },
            {
              title: t("totalPayments"),
              icon: "cash",
              count: convertNumerals(
                Object.keys(payments).length,
                locale as NumeralSystem,
              ),
            },
          ]}
        />
      </View>

      {visible && (
        <Snackbar
          message={message}
          backgroundColor={backgroundColor}
          duration={3000}
          position="bottom"
          onClose={hideSnackbar}
        />
      )}
    </>
  );
}

import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { View, Text, StyleSheet } from "react-native";

import Snackbar from "@/components/Snackbar";
import ControlledInput from "@/components/form/ControlledInput";
import ControlledNumberInput from "@/components/form/ControlledNumberInput";
import SubmitButton from "@/components/form/SubmitButton";
import { useLocalization } from "@/context/Localization";
import useSnackbar from "@/hooks/useSnackbar";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectClientById } from "@/store/selectors/client";
import { selectPaymentsByProductId } from "@/store/selectors/payment";
import { selectProductById } from "@/store/selectors/product";
import { addOnePayment } from "@/store/slices/paymentSlice";
import { updateOneProduct } from "@/store/slices/productSlice";
import Payment from "@/types/Payment";
import { getTotalPayments, resolveConcurrency } from "@/utilities/components";

const AddProductForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { t } = useLocalization();
  const { clientId, productId } = useLocalSearchParams<{
    clientId: string;
    productId: string;
  }>();
  const client = useAppSelector(selectClientById(clientId));
  const product = useAppSelector(selectProductById(productId));
  const currenPayments = useAppSelector(selectPaymentsByProductId(product.id));

  const defaultValues: Omit<Payment, "id"> = {
    amount: "",
    note: "",
    type: "Payment",
    clientId: client.id,
    productId: product.id,
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues });

  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  const addPayment: SubmitHandler<Omit<Payment, "id">> = async (data) => {
    try {
      const updateProductStatus = (isFullyPaid: boolean) =>
        dispatch(
          updateOneProduct({
            id: product.id,
            product: { ...product, isFullyPaid },
          }),
        ).unwrap();

      const addPayment = (payment: Omit<Payment, "id">) =>
        dispatch(addOnePayment(payment)).unwrap();

      const isFullyPaid =
        getTotalPayments(currenPayments, +data.amount) >=
        Number(product.totalPrice);

      const newPayment: Omit<Payment, "id"> = {
        amount: data.amount,
        note: data.note,
        type: "Payment",
        created: new Date().toString(),
        clientId: data.clientId,
        productId: data.productId,
      };

      await resolveConcurrency([
        updateProductStatus(isFullyPaid),
        addPayment(newPayment),
      ]);

      router.replace({
        pathname: "/utilities/product/[id]",
        params: { id: product.id },
      });
    } catch (error) {
      showSnackbar(`Error while processing payment: ${error}`, "error");
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>{t("addPaymentTitle")}</Text>

        <ControlledNumberInput
          control={control}
          name="amount"
          rules={{ required: t("amountRequired") }}
          label={t("amountLabelText")}
          placeholder={t("amountPaymentFormPlaceholder")}
          error={errors.amount}
        />

        <ControlledInput
          control={control}
          name="note"
          label={t("noteLabelText")}
          placeholder={t("notePlaceholder")}
          multiline
          numberOfLines={4}
          error={errors.note}
        />

        <SubmitButton
          title={isSubmitting ? t("loadingText") : t("addButtonText")}
          onSubmit={handleSubmit(addPayment)}
          disabled={isSubmitting}
        />
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
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", flex: 1 },
  title: { fontSize: 24, marginBottom: 20, fontWeight: "bold", color: "#333" },
});

export default AddProductForm;

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
import { addOneProduct } from "@/store/slices/productSlice";
import Product from "@/types/Product";

const AddProductForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { t } = useLocalization();
  const { id } = useLocalSearchParams<{ id: string }>();
  const client = useAppSelector(selectClientById(id));
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  const defaultValues: Omit<Product, "id"> = {
    name: "",
    note: "",
    totalPrice: "",
    isFullyPaid: false,
    type: "Product",
    clientId: client.id,
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues });

  const addProduct: SubmitHandler<Omit<Product, "id">> = async (data) => {
    try {
      await dispatch(
        addOneProduct({
          name: data.name,
          totalPrice: data.totalPrice,
          isFullyPaid: data.isFullyPaid || false,
          note: data.note,
          type: "Product",
          created: new Date().toString(),
          clientId: data.clientId,
        }),
      ).unwrap();
      router.back();
      // router.navigate({
      //   pathname: "/utilities/client/[id]",
      //   params: {
      //     id: client.id,
      //   },
      // });
    } catch (error) {
      showSnackbar(`Error while adding new product ${error}`, "error");
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>{t("addProductTitle")}</Text>

        <ControlledInput
          control={control}
          name="name"
          label={t("nameLabelText")}
          placeholder={t("nameProductFormPlaceholder")}
          rules={{ required: t("nameRequired") }}
          error={errors.name}
        />

        <ControlledNumberInput
          control={control}
          name="totalPrice"
          label={t("totalPriceLabelText")}
          placeholder={t("totalPriceProductFormPlaceholder")}
          rules={{ required: t("totalPriceRequired") }}
          delimiter=","
          separator="."
          precision={2}
          error={errors.totalPrice}
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
          onSubmit={handleSubmit(addProduct)}
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

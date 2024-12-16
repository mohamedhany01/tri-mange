import { useLocalSearchParams, useRouter } from "expo-router";
import { SubmitHandler, useForm } from "react-hook-form";
import { View, Text } from "react-native";

import Snackbar from "@/components/Snackbar";
import ControlledInput from "@/components/form/ControlledInput";
import ControlledNumberInput from "@/components/form/ControlledNumberInput";
import SubmitButton from "@/components/form/SubmitButton";
import { useLocalization } from "@/context/Localization";
import useSnackbar from "@/hooks/useSnackbar";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectProductById } from "@/store/selectors/product";
import { updateOneProduct } from "@/store/slices/productSlice";
import Product from "@/types/Product";

const EditProductForm = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product: Product = useAppSelector(selectProductById(id));

  const defaultValues: Omit<Product, "id"> = {
    name: product.name,
    totalPrice: product.totalPrice,
    type: "Product",
    note: product.note ?? "",
    clientId: product.clientId,
  };
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues });

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { t } = useLocalization();
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  const updateProduct: SubmitHandler<Omit<Product, "id">> = async (data) => {
    try {
      await dispatch(
        updateOneProduct({ id: product.id, product: { ...product, ...data } }),
      );
      router.back();
      // router.navigate({
      //   pathname: "/utilities/product/[id]",
      //   params: { id: product.id },
      // });
    } catch (error) {
      showSnackbar(`Error updating product ${error}`, "error");
    }
  };

  return (
    <>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 24, marginBottom: 20 }}>
          {t("updateProductTitle")}
        </Text>

        <ControlledInput
          control={control}
          name="name"
          label={t("nameLabelText")}
          placeholder={t("namePlaceholder")}
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
          title={isSubmitting ? t("loadingText") : t("updateButtonText")}
          onSubmit={handleSubmit(updateProduct)}
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

export default EditProductForm;

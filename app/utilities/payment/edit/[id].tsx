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
import { selectPaymentById } from "@/store/selectors/payment";
import { updateOnePayment } from "@/store/slices/paymentSlice";
import Payment from "@/types/Payment";

const EditPaymentForm = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const payment: Payment = useAppSelector(selectPaymentById(id));

  const defaultValues: Omit<Payment, "id"> = {
    amount: payment.amount,
    note: payment.note ?? "",
    type: "Payment",
    clientId: payment.clientId,
    productId: payment.productId,
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

  const updatePayment: SubmitHandler<Omit<Payment, "id">> = async (data) => {
    try {
      await dispatch(
        updateOnePayment({ id: payment.id, payment: { ...payment, ...data } }),
      );
      router.back();
      // router.navigate({
      //   pathname: "/utilities/payment/[id]",
      //   params: { id: payment.id },
      // });
    } catch (error) {
      showSnackbar(`Error updating payment ${error}`, "error");
    }
  };

  return (
    <>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 24, marginBottom: 20 }}>
          {t("updatePaymentTitle")}
        </Text>

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
          title={isSubmitting ? t("loadingText") : t("updateButtonText")}
          onSubmit={handleSubmit(updatePayment)}
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

export default EditPaymentForm;

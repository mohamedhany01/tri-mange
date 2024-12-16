import { useLocalSearchParams, useRouter } from "expo-router";

import ConfirmationAlert from "@/components/ConfirmationAlert";
import { useLocalization } from "@/context/Localization";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectPaymentById } from "@/store/selectors/payment";
import { deleteOnePayment } from "@/store/slices/paymentSlice";

import PaymentStage from "./stage/Stage";

const ClientScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const payment = useAppSelector(selectPaymentById(id));
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useLocalization();

  const handleUpdatePayment = () => {
    if (!payment) {
      throw new Error("No payment to update!");
    }

    router.push({
      pathname: "/utilities/payment/edit/[id]",
      params: { id },
    });
  };

  const handleDeletePayment = () => {
    const deleteConfirmation = ConfirmationAlert({
      title: t("deletePaymentTitle"),
      message: t("deletePaymentMessage"),
      confirmText: t("deleteText"),
      cancelText: t("cancelText"),
      onConfirm: async () => {
        await dispatch(deleteOnePayment(id));
        router.back();
      },
    });

    deleteConfirmation.showAlert();
  };

  return (
    <PaymentStage
      payment={payment}
      onUpdate={handleUpdatePayment}
      onDelete={handleDeletePayment}
    />
  );
};

export default ClientScreen;

import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";

import ConfirmationAlert from "@/components/ConfirmationAlert";
import Snackbar from "@/components/Snackbar";
import { useLocalization } from "@/context/Localization";
import useSnackbar from "@/hooks/useSnackbar";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectPaymentById,
  selectPaymentsByProductIdExcludePayment,
} from "@/store/selectors/payment";
import { selectProductById } from "@/store/selectors/product";
import { deleteOnePayment } from "@/store/slices/paymentSlice";
import { updateOneProduct } from "@/store/slices/productSlice";
import { getTotalPayments, resolveConcurrency } from "@/utilities/components";

import PaymentStage from "./stage/Stage";

const ClientScreen = () => {
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();
  const { id } = useLocalSearchParams<{ id: string }>();
  const payment = useAppSelector(selectPaymentById(id));
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useLocalization();
  const currenPayments = useAppSelector(
    selectPaymentsByProductIdExcludePayment(payment.productId, id),
  );
  const product = useAppSelector(selectProductById(payment.productId));

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
        try {
          const updateProductStatus = (isFullyPaid: boolean) =>
            dispatch(
              updateOneProduct({
                id: product.id,
                product: { ...product, isFullyPaid },
              }),
            ).unwrap();

          const deletePayment = (paymentId: string) =>
            dispatch(deleteOnePayment(paymentId)).unwrap();

          const isFullyPaid =
            getTotalPayments(currenPayments) >= Number(product.totalPrice);

          await resolveConcurrency([
            updateProductStatus(isFullyPaid),
            deletePayment(id),
          ]);

          router.back();
        } catch (error) {
          showSnackbar(`Error deleting payment ${error}`, "error");
        }
      },
    });

    deleteConfirmation.showAlert();
  };

  return (
    <>
      <PaymentStage
        payment={payment}
        onUpdate={handleUpdatePayment}
        onDelete={handleDeletePayment}
      />
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

export default ClientScreen;

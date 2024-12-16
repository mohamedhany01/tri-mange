import { useLocalSearchParams, useRouter } from "expo-router";

import ConfirmationAlert from "@/components/ConfirmationAlert";
import { useLocalization } from "@/context/Localization";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectProductById } from "@/store/selectors/product";
import { removePaymentsUsingProductId } from "@/store/slices/paymentSlice";
import { deleteOneProduct } from "@/store/slices/productSlice";

import ProductStage from "./stage/Stage";

const ProductScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = useAppSelector(selectProductById(id));
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useLocalization();

  const handleUpdateProduct = () => {
    if (!product) {
      throw new Error("No product to update!");
    }

    router.push({
      pathname: "/utilities/product/edit/[id]",
      params: { id },
    });
  };

  const handleDeleteProduct = () => {
    const deleteConfirmation = ConfirmationAlert({
      title: t("deleteProductTitle"),
      message: t("deleteProductMessage"),
      confirmText: t("deleteText"),
      cancelText: t("cancelText"),
      onConfirm: async () => {
        await dispatch(deleteOneProduct(id));
        dispatch(removePaymentsUsingProductId(id));
        router.back();
        // router.replace({
        //   pathname: "/utilities/client/[id]",
        //   params: {
        //     id: product.clientId,
        //   },
        // });
      },
    });

    deleteConfirmation.showAlert();
  };

  const handleAddNewPayment = () => {
    router.push({
      pathname: "/utilities/payment/add/AddPaymentForm",
      params: { clientId: product.clientId, productId: product.id },
    });
  };

  return (
    <ProductStage
      product={product}
      onUpdate={handleUpdateProduct}
      onDelete={handleDeleteProduct}
      onAddPayment={handleAddNewPayment}
    />
  );
};

export default ProductScreen;

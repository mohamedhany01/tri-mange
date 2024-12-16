import { useLocalSearchParams, useRouter } from "expo-router";

import ConfirmationAlert from "@/components/ConfirmationAlert";
import { useLocalization } from "@/context/Localization";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectClientById } from "@/store/selectors/client";
import { deleteOneClient } from "@/store/slices/clientSlice";
import { removePaymentsUsingClientId } from "@/store/slices/paymentSlice";
import { removeProductsUsingClientId } from "@/store/slices/productSlice";

import ClientStage from "./stage/Stage";

const ClientScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const client = useAppSelector(selectClientById(id));
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useLocalization();

  const handleUpdateClient = () => {
    if (!client) {
      throw new Error("No client to update!");
    }

    router.push({
      pathname: "/utilities/client/edit/[id]",
      params: { action: "update", id },
    });
  };

  const handleDeleteClient = () => {
    const deleteConfirmation = ConfirmationAlert({
      title: t("deleteClientTitle"),
      message: t("deleteClientMessage"),
      confirmText: t("deleteText"),
      cancelText: t("cancelText"),
      onConfirm: async () => {
        await dispatch(deleteOneClient(id));
        dispatch(removeProductsUsingClientId(id));
        dispatch(removePaymentsUsingClientId(id));
        router.navigate("/home/clients");
      },
    });

    deleteConfirmation.showAlert();
  };

  const handleAddNewProduct = () => {
    router.navigate({
      pathname: "/utilities/product/add/AddProductForm",
      params: { id: client.id },
    });
  };

  return (
    <ClientStage
      client={client}
      onUpdate={handleUpdateClient}
      onDelete={handleDeleteClient}
      onAddProduct={handleAddNewProduct}
    />
  );
};

export default ClientScreen;

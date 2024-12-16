import { useLocalSearchParams, useRouter } from "expo-router";
import { SubmitHandler, useForm } from "react-hook-form";
import { View, Text } from "react-native";

import Snackbar from "@/components/Snackbar";
import ControlledInput from "@/components/form/ControlledInput";
import SubmitButton from "@/components/form/SubmitButton";
import { useLocalization } from "@/context/Localization";
import useSnackbar from "@/hooks/useSnackbar";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectClientById } from "@/store/selectors/client";
import { updateOneClient } from "@/store/slices/clientSlice";
import Client from "@/types/Client";

const EditClientForm = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const client: Client = useAppSelector(selectClientById(id));

  const defaultValues: Omit<Client, "id"> = {
    name: client.name,
    note: client.note ?? "",
    type: "Client",
    phoneNumber: client.phoneNumber ?? "",
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

  const updateClient: SubmitHandler<Omit<Client, "id">> = async (data) => {
    try {
      await dispatch(
        updateOneClient({ id: client.id, client: { ...client, ...data } }),
      );

      router.back();
      // router.navigate({
      //   pathname: "/utilities/client/[id]",
      //   params: { id: client.id },
      // });
    } catch (error) {
      showSnackbar(`Error updating client ${error}`, "error");
    }
  };

  return (
    <>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 24, marginBottom: 20 }}>
          {t("updateClientTitle")}
        </Text>

        <ControlledInput
          control={control}
          name="name"
          label={t("nameLabelText")}
          placeholder={t("namePlaceholder")}
          rules={{ required: t("nameRequired") }}
          error={errors.name}
        />

        <ControlledInput
          control={control}
          name="phoneNumber"
          label={t("phoneNumberLabel")}
          placeholder={t("phoneNumberPlaceholder")}
          keyboardType="phone-pad"
          rules={{
            required: t("phoneNumberRequired"),
            pattern: {
              value: /^\+?([1-9٠-٩])([0-9٠-٩]{0,14})$/,
              message: t("phoneNumberInvalid"),
            },
          }}
          error={errors.phoneNumber}
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
          onSubmit={handleSubmit(updateClient)}
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

export default EditClientForm;

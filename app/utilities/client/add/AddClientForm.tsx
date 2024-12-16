import { useRouter } from "expo-router";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { View, Text, StyleSheet } from "react-native";

import Snackbar from "@/components/Snackbar";
import ControlledInput from "@/components/form/ControlledInput";
import SubmitButton from "@/components/form/SubmitButton";
import { useLocalization } from "@/context/Localization";
import useSnackbar from "@/hooks/useSnackbar";
import { useAppDispatch } from "@/store";
import { addOneClient } from "@/store/slices/clientSlice";
import Client from "@/types/Client";

const AddClientForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { t } = useLocalization();
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  const defaultValues: Omit<Client, "id"> = {
    name: "",
    note: "",
    type: "Client",
    phoneNumber: "",
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues });

  const addClient: SubmitHandler<Omit<Client, "id">> = async (data) => {
    try {
      await dispatch(addOneClient(data)).unwrap();
      router.replace("/home/clients");
    } catch (error) {
      showSnackbar(`Error while adding new client ${error}`, "error");
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>{t("addClientTitle")}</Text>

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
          title={isSubmitting ? t("loadingText") : t("addButtonText")}
          onSubmit={handleSubmit(addClient)}
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

export default AddClientForm;

import React, { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";

import DynamicButton from "@/components/DynamicButton";
import { useLocalization } from "@/context/Localization";
import { useAppDispatch } from "@/store";
import { login } from "@/store/slices/authSlice";

interface LoginData {
  email: string;
  password: string;
  status: boolean;
}

const LoginScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setValue,
  } = useForm<LoginData>();

  const dispatch = useAppDispatch();
  const { t } = useLocalization();

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onSubmit: SubmitHandler<LoginData> = async ({ email, password }) => {
    try {
      await dispatch(login({ email, password })).unwrap();
      setSuccessMessage(t("loginSuccessMessage"));
      setValue("status", true);
    } catch (error: any) {
      // If login fails, set form error based on the response
      if (error.message === "INVALID_EMAIL") {
        setError("email", { message: t("invalidEmailError") });
      } else if (error.message === "INVALID_PASSWORD") {
        setError("password", { message: t("invalidPasswordError") });
      } else {
        // General error message for unexpected errors
        setError("root", { message: error });
      }
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding">
        <Text style={styles.title}>{t("version")}</Text>

        <Controller
          control={control}
          rules={{ required: t("emailRequired") }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder={t("emailPlaceholderText")}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="email"
        />
        {errors.email && (
          <Text style={styles.errorText}>{errors.email.message}</Text>
        )}

        <Controller
          control={control}
          rules={{ required: t("passwordRequired") }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder={t("passwordPlaceholderText")}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
          )}
          name="password"
        />
        {errors.password && (
          <Text style={styles.errorText}>{errors.password.message}</Text>
        )}

        {errors.root && (
          <Text style={styles.errorText}>{errors.root.message}</Text>
        )}

        {successMessage && (
          <Text style={styles.successText}>{t("loginSuccessMessage")}</Text>
        )}

        {isSubmitting ? (
          <ActivityIndicator size="large" color="#2196F3" />
        ) : (
          <DynamicButton
            variant="info"
            onPress={handleSubmit(onSubmit)}
            title={t("loginButtonText")}
          />
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 8,
  },
  successText: {
    color: "green",
    marginBottom: 12,
    fontSize: 16,
    textAlign: "center",
  },
});

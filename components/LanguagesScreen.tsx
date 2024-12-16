import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { reloadAsync } from "expo-updates";
import React, { useEffect, useState } from "react";
import { I18nManager, StyleSheet, Text, View } from "react-native";

import { useLocalization } from "@/context/Localization";
import useSnackbar from "@/hooks/useSnackbar";
import { isProduction } from "@/utilities/environment";
import { directions, LOCALIZATION_STORAGE_KEY } from "@/utilities/localization";

import Snackbar from "./Snackbar";

export default function LanguagesScreen() {
  const { t } = useLocalization();
  const { locale, setLocale } = useLocalization();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(locale);
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  useEffect(() => {
    const loadStoredLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem(
          LOCALIZATION_STORAGE_KEY,
        );
        if (storedLanguage) {
          setSelectedLanguage(storedLanguage);
          setLocale(storedLanguage);
        }
      } catch (err) {
        showSnackbar(`Error loading stored language: ${err}`, "error");
      }
    };
    loadStoredLanguage().catch((err) => {
      showSnackbar(`Error loading stored language: ${err}`, "error");
    });
  }, [selectedLanguage, setLocale, showSnackbar]);

  const handleLanguageChange = async (language: string) => {
    setSelectedLanguage(language);
    setLocale(language);
    await AsyncStorage.setItem(LOCALIZATION_STORAGE_KEY, language);

    const hasDirection = directions.get(language);

    if (hasDirection) {
      I18nManager.allowRTL(hasDirection.isRTL);
      I18nManager.forceRTL(hasDirection.isRTL);
    }

    if (!isProduction()) return;
    reloadAsync().catch((err: Error) => {
      showSnackbar(`Failed to reload ${err.name}`, "error");
    });
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>{t("selectLanguageDropdown")}</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedLanguage}
            onValueChange={(value) => handleLanguageChange(value)}
            style={styles.picker}
            mode="dropdown"
          >
            <Picker.Item label="English" value="en" />
            <Picker.Item label="Arabic" value="ar" />
          </Picker>
        </View>
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  pickerContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    width: "100%",
    height: 50,
  },
});

import AsyncStorage from "@react-native-async-storage/async-storage";
import { I18n } from "i18n-js";
import { createContext, useState, useContext, useEffect, useMemo } from "react";

import { ar, en } from "@/constants/Local";
import {
  localization,
  LOCALIZATION_STORAGE_KEY,
} from "@/utilities/localization";

const i18n = new I18n();
i18n.enableFallback = true;
i18n.translations = { en, ar };

interface LocalizationContextProps {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string) => string;
}

const LocalizationContext = createContext<LocalizationContextProps | undefined>(
  undefined,
);

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [locale, setLocale] = useState<string>(localization.english);

  useEffect(() => {
    AsyncStorage.getItem(LOCALIZATION_STORAGE_KEY)
      .then((storedLocale) => {
        if (storedLocale) {
          setLocale(storedLocale);
          i18n.locale = storedLocale;
        }
      })
      .catch((error) => {
        throw new Error(`Failed to load locale: ${error}`);
      });
  }, []);

  const changeLocale = async (newLocale: string) => {
    setLocale(newLocale);
    i18n.locale = newLocale;
    await AsyncStorage.setItem(LOCALIZATION_STORAGE_KEY, newLocale);
  };

  const value = useMemo(
    () => ({
      locale,
      setLocale: changeLocale,
      t: (key: string) => i18n.t(key),
    }),
    [locale],
  );

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error(
      "useLocalization must be used within a LocalizationProvider",
    );
  }
  return context;
};

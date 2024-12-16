import { format } from "date-fns";
import { enUS, arSA } from "date-fns/locale";

import { convertNumerals } from "../localization";

export type DateFormat = "shortDate" | "longDate" | "timeOnly" | "custom";
export type SupportedLocale = "en" | "ar";

export const formatDate = (
  date: Date | string,
  formatType: DateFormat | string,
  locale: SupportedLocale = "en",
  numeralSystem: "en" | "ar" | "hindi" = "en",
): string => {
  const parsedDate = typeof date === "string" ? new Date(date) : date;

  const formatPatterns: Record<DateFormat, string> = {
    shortDate: "dd MMM yyyy",
    longDate: "EEEE, dd MMMM yyyy",
    timeOnly: "HH:mm:ss",
    custom: "",
  };

  const locales = {
    en: enUS,
    ar: arSA,
  };

  const pattern = formatPatterns[formatType as DateFormat] || formatType;

  try {
    let formattedDate = format(parsedDate, pattern, {
      locale: locales[locale],
    });

    // Apply numeral conversion based on locale
    if (locale === "ar" && numeralSystem === "ar") {
      formattedDate = convertNumerals(formattedDate, "ar");
    } else if (numeralSystem !== "en") {
      formattedDate = convertNumerals(formattedDate, numeralSystem);
    }

    return formattedDate;
  } catch (error) {
    throw new Error(`Invalid date, format pattern, or locale ${error}`);
  }
};

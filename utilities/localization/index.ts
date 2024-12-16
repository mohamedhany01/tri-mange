export type NumeralSystem = "ar" | "hindi" | "en";
export const LOCALIZATION_STORAGE_KEY = "AppLanguage";

// Mapping for different numeral systems
const numeralMappings: Record<NumeralSystem, string[]> = {
  ar: ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"], // Arabic numerals
  hindi: ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"], // Hindi numerals
  en: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], // Western numerals (default)
};

/**
 * Converts numbers in a given text to a specified numeral system.
 * @param text - The input text containing numbers.
 * @param system - The numeral system to convert to ('arabic', 'hindi', 'default').
 * @returns The text with numbers converted to the specified numeral system.
 */
export const convertNumerals = (
  text: string | number,
  system: NumeralSystem = "en",
): string => {
  const textStr = String(text);

  const targetMapping = numeralMappings[system];

  if (!targetMapping) {
    throw new Error(
      `Unsupported numeral system: ${system}. Defaulting to Western numerals.`,
    );
  }

  // Replace digits with their corresponding numerals
  return textStr.replace(/\d/g, (digit) => targetMapping[parseInt(digit, 10)]);
};

export const localization = {
  arabic: "ar",
  english: "en",
};

export const directions = new Map<string, { isRTL: boolean }>();
directions.set(localization.arabic, { isRTL: true });
directions.set(localization.english, { isRTL: false });

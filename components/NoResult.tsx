import { StyleSheet, Text } from "react-native";

import { useLocalization } from "@/context/Localization";

function NoResult() {
  const { t } = useLocalization();

  return <Text style={styles.noResults}>{t("noResults")}</Text>;
}

const styles = StyleSheet.create({
  noResults: {
    padding: 12,
    textAlign: "center",
    fontSize: 16,
    color: "gray",
  },
});

export default NoResult;

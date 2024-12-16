import { useRouter } from "expo-router";
import { TextInput, StyleSheet, View } from "react-native";

import DynamicButton from "@/components/DynamicButton";
import { useLocalization } from "@/context/Localization";

const SearchBox: React.FC<{
  term: string;
  setTerm: (value: string) => void;
}> = ({ term, setTerm }) => {
  const { t } = useLocalization();

  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder={t("searchClientBoxPlaceholder")}
          value={term}
          onChangeText={setTerm}
        />
      </View>
      <View style={styles.addButton}>
        <DynamicButton
          variant="success"
          iconName="add-outline"
          disabled={false}
          buttonStyle={{ width: "100%" }}
          onPress={() => {
            router.push("/utilities/client/add/AddClientForm");
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  addButton: {
    flexGrow: 1,
  },
  searchBox: {
    flexGrow: 5,
    marginHorizontal: 5,
  },
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 8,
    marginHorizontal: 5,
    borderRadius: 4,
  },
});

export default SearchBox;

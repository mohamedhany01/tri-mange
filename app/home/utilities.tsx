import { useRouter } from "expo-router";
import React from "react";
import { View, StyleSheet, Text } from "react-native";

import DynamicButton from "@/components/DynamicButton";
import { useLocalization } from "@/context/Localization";
import { useAppDispatch } from "@/store";
import { logoutThunk } from "@/store/slices/authSlice";

const UtilitiesScreen: React.FC = () => {
  const { t } = useLocalization();
  const dispatch = useAppDispatch(); // Correctly typed dispatch
  const router = useRouter();

  // const handleButtonPress = (action: string) => {
  //   // Handle button actions here
  //   // console.log(`${action} button pressed`);
  // };

  const onChangeLanguage = () => {
    router.navigate("/settings/Language");
  };

  const signout = async () => {
    await dispatch(logoutThunk());
  };

  return (
    <View>
      <View style={styles.container}>
        {/* <DynamicButton
          buttonStyle={{ width: "100%" }}
          title={t("changeTheme")}
          iconName="moon-outline"
          onPress={() => {
            handleButtonPress("Change Theme");
          }}
          variant="info"
        /> */}
        <DynamicButton
          buttonStyle={{ width: "100%" }}
          title={t("changeLanguage")}
          iconName="language-outline"
          onPress={() => {
            onChangeLanguage();
          }}
          variant="info"
        />
        {/* <DynamicButton
          buttonStyle={{ width: "100%" }}
          title={t("backupToCloud")}
          iconName="cloud-upload-outline"
          onPress={() => {
            handleButtonPress("Backup to Cloud");
          }}
          variant="success"
        /> */}
        {/* <DynamicButton
          buttonStyle={{ width: "100%" }}
          title={t("removeCache")}
          iconName="trash-outline"
          onPress={() => {
            handleButtonPress("Remove Cache");
          }}
          variant="danger"
        /> */}
        {/* <DynamicButton
          buttonStyle={{ width: "100%" }}
          title={t("updateApp")}
          iconName="repeat-outline"
          onPress={() => {
            handleButtonPress("Update App");
          }}
          variant="info"
        /> */}
        <DynamicButton
          buttonStyle={{ width: "100%" }}
          title={t("signout")}
          iconName="log-out-outline"
          onPress={() => signout()}
          variant="danger"
        />
      </View>
      <Text style={styles.versionText}>{t("version")}</Text>
    </View>
  );
};

// Define the component styles
const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  versionText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
    color: "gray",
  },
});

export default UtilitiesScreen;

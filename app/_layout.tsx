import { Stack } from "expo-router";
import { Provider } from "react-redux";

import { LocalizationProvider } from "@/context/Localization";
import { store } from "@/store";

export default function RootLayout() {
  return (
    <LocalizationProvider>
      <Provider store={store}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </Provider>
    </LocalizationProvider>
  );
}

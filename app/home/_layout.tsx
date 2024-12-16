import Ionicons from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { useLocalization } from "@/context/Localization";

import ClientsScreen from "./clients";
import StatisticsScreen from "./statistics";
import UtilitiesScreen from "./utilities";

const Tab = createBottomTabNavigator();

export default function HomeLayout() {
  const { t } = useLocalization();

  return (
    <Tab.Navigator
      initialRouteName="Statistics"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={{
          title: t("statistics"),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "stats-chart" : "stats-chart-outline"}
              color={color}
              size={25}
            />
          ),
        }}
      />
      <Tab.Screen
        name="clients"
        component={ClientsScreen}
        options={{
          title: t("clients"),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "people" : "people-outline"}
              color={color}
              size={25}
            />
          ),
        }}
      />
      <Tab.Screen
        name="utilities"
        component={UtilitiesScreen}
        options={{
          title: t("utilities"),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              color={color}
              size={25}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

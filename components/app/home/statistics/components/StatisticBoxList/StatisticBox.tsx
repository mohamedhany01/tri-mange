import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface StatisticBoxProps {
  title?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  count?: number | string;
  onPress?: () => void;
}

export const StatisticBox: React.FC<StatisticBoxProps> = ({
  title,
  icon,
  count,
  onPress,
}) => {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <>
      <Wrapper style={styles.box} {...(onPress && { onPress })}>
        <View style={styles.header}>
          <Ionicons
            name={icon as keyof typeof Ionicons.glyphMap}
            size={25}
            color="#000000"
          />
          <Text style={styles.title}>{title}</Text>
        </View>
        <Text style={styles.count}>{count}</Text>
      </Wrapper>
    </>
  );
};

const styles = StyleSheet.create({
  box: {
    width: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  header: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
    display: "flex",
    marginHorizontal: 5,
  },
  count: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    display: "flex",
    width: "100%",
    textAlign: "center",
  },
});

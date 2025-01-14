import React from "react";
import { StyleSheet, View } from "react-native";

import { StatisticBox, StatisticBoxProps } from "./StatisticBox";

export const BoxList: React.FC<{ list: StatisticBoxProps[] }> = ({ list }) => {
  return (
    <>
      <View style={styles.listGrid}>
        {list.map(({ title, icon, count, onPress }, k) => (
          <StatisticBox
            key={k}
            title={title}
            icon={icon}
            count={count}
            onPress={onPress}
          />
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  listGrid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    margin: 16,
  },
});

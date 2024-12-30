import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";

// Enable LayoutAnimation for Android
if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  initiallyExpanded?: boolean;
}

export const AccordionItem = ({
  title,
  children,
  initiallyExpanded = false,
}: AccordionItemProps) => {
  const [expanded, setExpanded] = useState(initiallyExpanded);
  const [rotation] = useState(new Animated.Value(0));

  const toggleAccordion = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);

    Animated.timing(rotation, {
      toValue: expanded ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={toggleAccordion}
        style={styles.header}
      >
        <Text style={styles.title}>{title}</Text>
        <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
          <Ionicons name="chevron-down" size={24} color="#333" />
        </Animated.View>
      </TouchableOpacity>

      {expanded && <View style={styles.content}>{children}</View>}
    </View>
  );
};

interface AccordionProps {
  children:
    | React.ReactElement<AccordionItemProps>
    | React.ReactElement<AccordionItemProps>[];
}

export const Accordion = ({ children }: AccordionProps) => {
  return <View style={styles.wrapper}>{children}</View>;
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  container: {
    borderRadius: 8,
    backgroundColor: "#fff",
    marginVertical: 4,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e1e1e1",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  title: {
    width: "95%",
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  content: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e1e1e1",
  },
});

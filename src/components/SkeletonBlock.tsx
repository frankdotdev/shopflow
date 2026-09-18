import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, ViewStyle } from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { radius } from "@/constants/theme";

export default function SkeletonBlock({ style }: { style?: ViewStyle }) {
  const { colors } = useThemeStore();
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.9, duration: 650, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 650, useNativeDriver: true })
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View
      style={[
        { backgroundColor: colors.border, borderRadius: radius.md, opacity },
        style
      ]}
    />
  );
}

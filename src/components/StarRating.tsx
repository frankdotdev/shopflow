import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Star } from "lucide-react-native";
import { useThemeStore } from "@/store/themeStore";

export default function StarRating({
  rating,
  reviewCount,
  size = 12
}: {
  rating: number;
  reviewCount?: number;
  size?: number;
}) {
  const { colors } = useThemeStore();
  return (
    <View style={styles.row}>
      <Star size={size} color={colors.accent} fill={colors.accent} />
      <Text style={[styles.text, { color: colors.textMuted }]}>
        {rating.toFixed(1)}
        {typeof reviewCount === "number" ? ` (${reviewCount.toLocaleString()})` : ""}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 4 },
  text: { fontSize: 12, fontWeight: "500" }
});

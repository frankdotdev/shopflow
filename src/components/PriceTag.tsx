import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { formatNaira } from "@/utils/currency";
import { useThemeStore } from "@/store/themeStore";

export default function PriceTag({
  price,
  originalPrice,
  size = "md"
}: {
  price: number;
  originalPrice?: number | null;
  size?: "sm" | "md" | "lg";
}) {
  const { colors } = useThemeStore();
  const priceStyle = size === "lg" ? styles.priceLg : size === "sm" ? styles.priceSm : styles.priceMd;
  return (
    <View style={styles.row}>
      <Text style={[priceStyle, { color: colors.text }]}>{formatNaira(price)}</Text>
      {!!originalPrice && originalPrice > price && (
        <Text style={[styles.original, { color: colors.textFaint }]}>{formatNaira(originalPrice)}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "baseline", gap: 6, flexWrap: "wrap" },
  priceSm: { fontSize: 13, fontWeight: "700" },
  priceMd: { fontSize: 15, fontWeight: "700" },
  priceLg: { fontSize: 22, fontWeight: "700" },
  original: { fontSize: 12, textDecorationLine: "line-through" }
});

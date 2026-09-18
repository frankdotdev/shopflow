import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Category } from "@/types";
import { useThemeStore } from "@/store/themeStore";
import { spacing, radius } from "@/constants/theme";

export default function CategoryCard({
  category,
  size = 140,
  fullWidth = false
}: {
  category: Category;
  size?: number;
  fullWidth?: boolean;
}) {
  const { colors } = useThemeStore();
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[
        styles.card,
        fullWidth ? { width: "100%", marginRight: 0 } : { width: size },
        { borderColor: colors.border }
      ]}
      onPress={() => router.push(`/category/${category.id}`)}
    >
      <Image source={{ uri: category.image }} style={styles.image} contentFit="cover" />
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <Text style={styles.name}>{category.name}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 96,
    borderRadius: radius.lg,
    overflow: "hidden",
    marginRight: spacing.md,
    borderWidth: StyleSheet.hairlineWidth
  },
  image: { width: "100%", height: "100%", position: "absolute" },
  overlay: { flex: 1, justifyContent: "flex-end", padding: spacing.sm },
  name: { color: "#fff", fontWeight: "700", fontSize: 13 }
});

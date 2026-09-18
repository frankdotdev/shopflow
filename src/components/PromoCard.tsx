import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useThemeStore } from "@/store/themeStore";
import { spacing, radius } from "@/constants/theme";

export default function PromoCard({
  title,
  subtitle,
  image,
  onPress
}: {
  title: string;
  subtitle: string;
  image: string;
  onPress?: () => void;
}) {
  const { colors } = useThemeStore();
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[styles.card, { borderColor: colors.border, backgroundColor: colors.bgAlt }]}
      onPress={onPress}
    >
      <View style={styles.textWrap}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>{subtitle}</Text>
      </View>
      <Image source={{ uri: image }} style={styles.image} contentFit="cover" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 260,
    height: 110,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    marginRight: spacing.md,
    flexDirection: "row",
    overflow: "hidden"
  },
  textWrap: { flex: 1, padding: spacing.md, justifyContent: "center", gap: 4 },
  title: { fontSize: 16, fontWeight: "700" },
  subtitle: { fontSize: 12 },
  image: { width: 100, height: "100%" }
});

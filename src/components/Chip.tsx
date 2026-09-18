import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { radius, spacing } from "@/constants/theme";

export default function Chip({
  label,
  active,
  onPress
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  const { colors } = useThemeStore();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: active ? colors.black : colors.bgAlt,
          borderColor: active ? colors.black : colors.border
        }
      ]}
    >
      <Text style={[styles.text, { color: active ? colors.white : colors.text }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    marginRight: spacing.sm,
    marginBottom: spacing.sm
  },
  text: { fontSize: 13, fontWeight: "600" }
});

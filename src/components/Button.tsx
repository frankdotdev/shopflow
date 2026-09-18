import React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { radius, spacing } from "@/constants/theme";

export default function Button({
  label,
  onPress,
  variant = "primary",
  disabled,
  loading,
  icon,
  style
}: {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "outline" | "danger";
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}) {
  const { colors } = useThemeStore();
  const bg =
    variant === "primary" ? colors.black :
    variant === "danger" ? colors.danger :
    variant === "secondary" ? colors.bgAlt : "transparent";
  const textColor = variant === "outline" ? colors.text : variant === "secondary" ? colors.text : colors.white;
  const borderColor = variant === "outline" ? colors.borderStrong : "transparent";

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={disabled || loading}
      onPress={onPress}
      style={[
        styles.base,
        { backgroundColor: bg, borderColor, opacity: disabled ? 0.5 : 1 },
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {icon}
          <Text style={[styles.label, { color: textColor }]}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth
  },
  label: { fontSize: 14, fontWeight: "700" }
});

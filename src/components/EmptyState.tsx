import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { spacing } from "@/constants/theme";
import Button from "./Button";

export default function EmptyState({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction
}: {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const { colors } = useThemeStore();
  return (
    <View style={styles.wrap}>
      {icon}
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {!!subtitle && <Text style={[styles.subtitle, { color: colors.textMuted }]}>{subtitle}</Text>}
      {actionLabel && onAction && (
        <Button label={actionLabel} onPress={onAction} style={{ marginTop: spacing.lg, minWidth: 180 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center", padding: spacing.xxl, gap: spacing.sm },
  title: { fontSize: 16, fontWeight: "700", marginTop: spacing.sm },
  subtitle: { fontSize: 13, textAlign: "center" }
});

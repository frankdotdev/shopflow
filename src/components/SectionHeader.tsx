import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { useThemeStore } from "@/store/themeStore";
import { spacing, typography } from "@/constants/theme";

export default function SectionHeader({
  title,
  onSeeAll
}: {
  title: string;
  onSeeAll?: () => void;
}) {
  const { colors } = useThemeStore();
  return (
    <View style={styles.row}>
      <Text style={[typography.heading, { color: colors.text }]}>{title}</Text>
      {onSeeAll && (
        <TouchableOpacity style={styles.seeAll} onPress={onSeeAll} hitSlop={8}>
          <Text style={[styles.seeAllText, { color: colors.textMuted }]}>See all</Text>
          <ChevronRight size={16} color={colors.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    marginTop: spacing.xl
  },
  seeAll: { flexDirection: "row", alignItems: "center" },
  seeAllText: { fontSize: 13 }
});

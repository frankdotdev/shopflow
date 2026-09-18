import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useThemeStore } from "@/store/themeStore";
import { spacing, typography } from "@/constants/theme";

export default function StepHeader({ title, step, total }: { title: string; step?: number; total?: number }) {
  const { colors } = useThemeStore();
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
        <ChevronLeft size={24} color={colors.text} />
      </TouchableOpacity>
      <Text style={[typography.title, { color: colors.text }]}>{title}</Text>
      <View style={{ width: 24 }}>
        {!!step && <Text style={{ color: colors.textFaint, fontSize: 11 }}>{step}/{total}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: spacing.lg }
});

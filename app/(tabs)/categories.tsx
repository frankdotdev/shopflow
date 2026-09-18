import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeStore } from "@/store/themeStore";
import { CATEGORIES } from "@/data/categories";
import CategoryCard from "@/components/CategoryCard";
import { spacing, typography } from "@/constants/theme";
import { useDeviceInfo } from "@/constants/layout";

export default function CategoriesScreen() {
  const { colors } = useThemeStore();
  const { isTablet } = useDeviceInfo();
  const numColumns = isTablet ? 3 : 2;

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: colors.bg }]} edges={["top"]}>
      <Text style={[typography.title, { color: colors.text, paddingHorizontal: spacing.lg, marginBottom: spacing.md }]}>
        Categories
      </Text>
      <FlatList
        data={CATEGORIES}
        key={numColumns}
        keyExtractor={(c) => c.id}
        numColumns={numColumns}
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}
        columnWrapperStyle={numColumns > 1 ? { gap: spacing.md } : undefined}
        renderItem={({ item }) => (
          <View style={{ flex: 1, marginBottom: spacing.md }}>
            <CategoryCard category={item} fullWidth />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });

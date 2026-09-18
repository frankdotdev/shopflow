import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Minus, Plus } from "lucide-react-native";
import { useThemeStore } from "@/store/themeStore";
import { useAllProducts } from "@/hooks/useProducts";
import { updateStock } from "@/database/repositories";
import { spacing, typography, radius } from "@/constants/theme";

function stockStatus(stock: number, colors: any) {
  if (stock <= 0) return { label: "Out of Stock", color: colors.danger };
  if (stock <= 5) return { label: "Low Stock", color: colors.accent };
  return { label: "In Stock", color: colors.success };
}

export default function AdminInventoryScreen() {
  const { colors } = useThemeStore();
  const { products, refresh } = useAllProducts();

  const adjust = async (id: string, current: number, delta: number) => {
    const next = Math.max(0, current + delta);
    await updateStock(id, next);
    await refresh();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[typography.title, { color: colors.text }]}>Inventory</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={products}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.sm }}
        renderItem={({ item }) => {
          const status = stockStatus(item.stock, colors);
          return (
            <View style={[styles.row, { borderColor: colors.border }]}>
              <View style={{ flex: 1 }}>
                <Text numberOfLines={1} style={{ color: colors.text, fontWeight: "600", fontSize: 13 }}>{item.name}</Text>
                <Text style={{ color: status.color, fontSize: 11, fontWeight: "700", marginTop: 2 }}>{status.label}</Text>
              </View>
              <TouchableOpacity onPress={() => adjust(item.id, item.stock, -1)} style={[styles.adjustBtn, { borderColor: colors.border }]}>
                <Minus size={14} color={colors.text} />
              </TouchableOpacity>
              <Text style={{ width: 32, textAlign: "center", color: colors.text, fontWeight: "700" }}>{item.stock}</Text>
              <TouchableOpacity onPress={() => adjust(item.id, item.stock, 1)} style={[styles.adjustBtn, { borderColor: colors.border }]}>
                <Plus size={14} color={colors.text} />
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: spacing.lg },
  row: { flexDirection: "row", alignItems: "center", padding: spacing.md, borderWidth: StyleSheet.hairlineWidth, borderRadius: radius.lg, gap: spacing.sm },
  adjustBtn: { width: 28, height: 28, borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, alignItems: "center", justifyContent: "center" }
});

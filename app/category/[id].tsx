import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Search as SearchIcon, SlidersHorizontal } from "lucide-react-native";
import { useThemeStore } from "@/store/themeStore";
import { useAllProducts, applyFilters, applySort } from "@/hooks/useProducts";
import { useFilterStore } from "@/store/filterStore";
import { CATEGORIES } from "@/data/categories";
import ProductCard from "@/components/ProductCard";
import EmptyState from "@/components/EmptyState";
import { spacing, typography } from "@/constants/theme";
import { useDeviceInfo } from "@/constants/layout";

const SORT_OPTIONS: { key: any; label: string }[] = [
  { key: "recommended", label: "Recommended" },
  { key: "newest", label: "Newest" },
  { key: "price_asc", label: "Price: Low to High" },
  { key: "price_desc", label: "Price: High to Low" },
  { key: "rating", label: "Highest Rated" },
  { key: "popular", label: "Most Popular" }
];

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useThemeStore();
  const { products } = useAllProducts();
  const { filters, sort, setSort } = useFilterStore();
  const { isTablet, columns } = useDeviceInfo();
  const [sortOpen, setSortOpen] = useState(false);

  const category = CATEGORIES.find((c) => c.id === id);
  const filtered = useMemo(() => applySort(applyFilters(products, filters, id), sort), [products, filters, sort, id]);

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: colors.bg }]} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[typography.title, { color: colors.text }]}>{category?.name ?? "Category"}</Text>
        <TouchableOpacity onPress={() => router.push("/(tabs)/search")} hitSlop={8}>
          <SearchIcon size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.count, { color: colors.textMuted }]}>{filtered.length} products</Text>

      <View style={styles.controlsRow}>
        <TouchableOpacity style={[styles.controlBtn, { borderColor: colors.border }]} onPress={() => setSortOpen((v) => !v)}>
          <Text style={{ color: colors.text, fontSize: 13, fontWeight: "600" }}>Sort</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.controlBtn, { borderColor: colors.border }]} onPress={() => router.push("/filters")}>
          <SlidersHorizontal size={14} color={colors.text} />
          <Text style={{ color: colors.text, fontSize: 13, fontWeight: "600" }}>Filter</Text>
        </TouchableOpacity>
      </View>

      {sortOpen && (
        <View style={[styles.sortDropdown, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {SORT_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              style={styles.sortOption}
              onPress={() => {
                setSort(opt.key);
                setSortOpen(false);
              }}
            >
              <Text style={{ color: sort === opt.key ? colors.accent : colors.text, fontSize: 13 }}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {filtered.length === 0 ? (
        <EmptyState title="No products match" subtitle="Try adjusting your filters." />
      ) : (
        <FlatList
          data={filtered}
          key={columns}
          keyExtractor={(p) => p.id}
          numColumns={columns}
          columnWrapperStyle={{ gap: spacing.md, paddingHorizontal: spacing.lg }}
          contentContainerStyle={{ gap: spacing.md, paddingBottom: spacing.xxxl, paddingTop: spacing.sm }}
          renderItem={({ item }) => (
            <View style={{ flex: 1 }}>
              <ProductCard product={item} width={undefined} />
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm
  },
  count: { paddingHorizontal: spacing.lg, fontSize: 12, marginBottom: spacing.sm },
  controlsRow: { flexDirection: "row", gap: spacing.md, paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  controlBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth
  },
  sortDropdown: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden"
  },
  sortOption: { padding: spacing.md }
});

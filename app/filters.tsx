import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Slider from "@react-native-community/slider";
import { X } from "lucide-react-native";
import { useThemeStore } from "@/store/themeStore";
import { useFilterStore, DEFAULT_FILTERS } from "@/store/filterStore";
import { useAllProducts } from "@/hooks/useProducts";
import { CATEGORIES } from "@/data/categories";
import Chip from "@/components/Chip";
import Button from "@/components/Button";
import { formatNaira } from "@/utils/currency";
import { spacing, typography } from "@/constants/theme";

export default function FiltersScreen() {
  const { colors } = useThemeStore();
  const { filters, setFilters } = useFilterStore();
  const { products } = useAllProducts();
  const [local, setLocal] = useState(filters);

  const brands = Array.from(new Set(products.map((p) => p.brand))).slice(0, 14);
  const sizes = Array.from(new Set(products.flatMap((p) => p.sizes)));
  const colorOptions = Array.from(new Set(products.flatMap((p) => p.colors))).slice(0, 8);

  const toggleInArray = (key: "categories" | "brands" | "sizes" | "colors", value: string) => {
    setLocal((prev) => {
      const arr = prev[key];
      const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
      return { ...prev, [key]: next };
    });
  };

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <Text style={[typography.title, { color: colors.text }]}>Sort & Filter</Text>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <X size={22} color={colors.text} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 120 }}>
        <Text style={[typography.heading, { color: colors.text }]}>Categories</Text>
        <View style={styles.chipsWrap}>
          {CATEGORIES.map((c) => (
            <Chip key={c.id} label={c.name} active={local.categories.includes(c.id)} onPress={() => toggleInArray("categories", c.id)} />
          ))}
        </View>

        <Text style={[typography.heading, { color: colors.text, marginTop: spacing.lg }]}>Price Range</Text>
        <Text style={{ color: colors.textMuted, marginBottom: spacing.sm }}>
          {formatNaira(local.priceMin)} – {formatNaira(local.priceMax)}
        </Text>
        <Slider
          minimumValue={0}
          maximumValue={1200000}
          step={5000}
          value={local.priceMax}
          minimumTrackTintColor={colors.black}
          maximumTrackTintColor={colors.border}
          onValueChange={(v) => setLocal((prev) => ({ ...prev, priceMax: v }))}
        />

        <Text style={[typography.heading, { color: colors.text, marginTop: spacing.lg }]}>Rating</Text>
        <View style={styles.chipsWrap}>
          {[0, 3, 4, 4.5].map((r) => (
            <Chip
              key={r}
              label={r === 0 ? "All" : `${r}+`}
              active={local.minRating === r}
              onPress={() => setLocal((prev) => ({ ...prev, minRating: r }))}
            />
          ))}
        </View>

        <Text style={[typography.heading, { color: colors.text, marginTop: spacing.lg }]}>Brand</Text>
        <View style={styles.chipsWrap}>
          {brands.map((b) => (
            <Chip key={b} label={b} active={local.brands.includes(b)} onPress={() => toggleInArray("brands", b)} />
          ))}
        </View>

        {sizes.length > 0 && (
          <>
            <Text style={[typography.heading, { color: colors.text, marginTop: spacing.lg }]}>Size</Text>
            <View style={styles.chipsWrap}>
              {sizes.map((s) => (
                <Chip key={s} label={s} active={local.sizes.includes(s)} onPress={() => toggleInArray("sizes", s)} />
              ))}
            </View>
          </>
        )}

        <Text style={[typography.heading, { color: colors.text, marginTop: spacing.lg }]}>Color</Text>
        <View style={styles.swatchRow}>
          {colorOptions.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => toggleInArray("colors", c)}
              style={[
                styles.swatch,
                { backgroundColor: c, borderColor: local.colors.includes(c) ? colors.accent : colors.border, borderWidth: local.colors.includes(c) ? 3 : 1 }
              ]}
            />
          ))}
        </View>

        <Text style={[typography.heading, { color: colors.text, marginTop: spacing.lg }]}>Availability & Discount</Text>
        <View style={styles.chipsWrap}>
          <Chip label="In Stock Only" active={local.inStockOnly} onPress={() => setLocal((p) => ({ ...p, inStockOnly: !p.inStockOnly }))} />
          <Chip label="Discounted Only" active={local.discountedOnly} onPress={() => setLocal((p) => ({ ...p, discountedOnly: !p.discountedOnly }))} />
        </View>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.bg }]}>
        <Button
          label="Reset"
          variant="outline"
          style={{ flex: 1 }}
          onPress={() => setLocal(DEFAULT_FILTERS)}
        />
        <Button
          label="Apply"
          style={{ flex: 1 }}
          onPress={() => {
            setFilters(local);
            router.back();
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg
  },
  chipsWrap: { flexDirection: "row", flexWrap: "wrap", marginTop: spacing.sm },
  swatchRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.sm },
  swatch: { width: 32, height: 32, borderRadius: 16 },
  footer: {
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0
  }
});

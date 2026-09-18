import React, { useState, useEffect, useMemo, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { X, SearchX } from "lucide-react-native";
import { useThemeStore } from "@/store/themeStore";
import { useAllProducts } from "@/hooks/useProducts";
import { fetchRecentSearches, recordRecentSearch, clearRecentSearches } from "@/database/repositories";
import Chip from "@/components/Chip";
import ProductCard from "@/components/ProductCard";
import EmptyState from "@/components/EmptyState";
import { spacing, typography } from "@/constants/theme";

const POPULAR_SEARCHES = ["Sneakers", "Headphones", "Smart watches", "Leather bags", "Skincare", "Laptops"];

export default function SearchScreen() {
  const { colors } = useThemeStore();
  const { products } = useAllProducts();
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    fetchRecentSearches().then(setRecent);
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q))
    );
  }, [query, products]);

  const runSearch = useCallback(async (term: string) => {
    setQuery(term);
    await recordRecentSearch(term);
    setRecent(await fetchRecentSearches());
  }, []);

  const onSubmit = useCallback(() => {
    if (query.trim()) runSearch(query);
  }, [query, runSearch]);

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: colors.bg }]} edges={["top"]}>
      <View style={styles.searchRow}>
        <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.bgAlt }]}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={onSubmit}
            placeholder="Search products..."
            placeholderTextColor={colors.textFaint}
            style={[styles.input, { color: colors.text }]}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")} hitSlop={8}>
              <X size={18} color={colors.textFaint} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {query.trim().length === 0 ? (
        <View style={{ paddingHorizontal: spacing.lg }}>
          {recent.length > 0 && (
            <>
              <View style={styles.rowBetween}>
                <Text style={[typography.heading, { color: colors.text }]}>Recent</Text>
                <TouchableOpacity
                  onPress={async () => {
                    await clearRecentSearches();
                    setRecent([]);
                  }}
                >
                  <Text style={{ color: colors.textMuted, fontSize: 12 }}>Clear All</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.chipsWrap}>
                {recent.map((term) => (
                  <Chip key={term} label={term} onPress={() => runSearch(term)} />
                ))}
              </View>
            </>
          )}
          <Text style={[typography.heading, { color: colors.text, marginTop: spacing.lg }]}>Popular Searches</Text>
          <View style={styles.chipsWrap}>
            {POPULAR_SEARCHES.map((term) => (
              <Chip key={term} label={term} onPress={() => runSearch(term)} />
            ))}
          </View>
        </View>
      ) : results.length === 0 ? (
        <EmptyState
          icon={<SearchX size={40} color={colors.textFaint} />}
          title="NOTHING FOUND"
          subtitle={`Sorry, the keyword you entered "${query}" cannot be found, please check again or search with another keyword.`}
        />
      ) : (
        <>
          <Text style={[styles.resultsCount, { color: colors.textMuted }]}>{results.length} results found</Text>
          <FlatList
            data={results}
            keyExtractor={(p) => p.id}
            numColumns={2}
            columnWrapperStyle={{ gap: spacing.md, paddingHorizontal: spacing.lg }}
            contentContainerStyle={{ gap: spacing.md, paddingBottom: spacing.xxxl }}
            renderItem={({ item }) => <ProductCard product={item} width={undefined} />}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  searchRow: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.lg
  },
  input: { flex: 1, fontSize: 14 },
  resultsCount: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm, fontSize: 12 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: spacing.md },
  chipsWrap: { flexDirection: "row", flexWrap: "wrap", marginTop: spacing.sm }
});

import React, { useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { router } from "expo-router";
import { Bell, User } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeStore } from "@/store/themeStore";
import { useNotificationStore } from "@/store/notificationStore";
import { useAllProducts } from "@/hooks/useProducts";
import { CATEGORIES } from "@/data/categories";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import PromoCard from "@/components/PromoCard";
import SectionHeader from "@/components/SectionHeader";
import SkeletonBlock from "@/components/SkeletonBlock";
import { spacing, typography } from "@/constants/theme";
import { useDeviceInfo } from "@/constants/layout";
import { fetchRecentlyViewed } from "@/database/repositories";
import { useEffect, useState } from "react";

const OFFERS = [
  { title: "30% OFF", subtitle: "Today's Special", image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&q=80" },
  { title: "25% OFF", subtitle: "Weekend Deals", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80" },
  { title: "40% OFF", subtitle: "New Arrivals", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80" }
];

export default function HomeScreen() {
  const { colors } = useThemeStore();
  const { products, loading } = useAllProducts();
  const unread = useNotificationStore((s) => s.unreadCount());
  const { maxContentWidth } = useDeviceInfo();
  const [recentIds, setRecentIds] = useState<string[]>([]);

  useEffect(() => {
    fetchRecentlyViewed().then(setRecentIds);
  }, [products.length]);

  const popular = useMemo(() => products.filter((p) => p.isPopular).slice(0, 10), [products]);
  const trending = useMemo(() => products.filter((p) => p.isFeatured).slice(0, 10), [products]);
  const newArrivals = useMemo(() => products.filter((p) => p.isNew).slice(0, 10), [products]);
  const bestSellers = useMemo(() => products.filter((p) => p.isBestSeller).slice(0, 10), [products]);
  const recentlyViewed = useMemo(
    () => recentIds.map((id) => products.find((p) => p.id === id)).filter(Boolean) as typeof products,
    [recentIds, products]
  );

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: colors.bg }]} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xxxl }}>
        <View style={[styles.header, { maxWidth: maxContentWidth, alignSelf: "center", width: "100%" }]}>
          <Text style={[styles.wordmark, { color: colors.text }]}>SHOPFLOW</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => router.push("/notifications")} hitSlop={8}>
              <View>
                <Bell size={22} color={colors.text} />
                {unread > 0 && <View style={[styles.dot, { backgroundColor: colors.accent }]} />}
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/(tabs)/profile")} hitSlop={8} style={{ marginLeft: spacing.lg }}>
              <View style={[styles.avatar, { backgroundColor: colors.bgAlt }]}>
                <User size={16} color={colors.text} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.searchBar, { borderColor: colors.border, backgroundColor: colors.bgAlt, maxWidth: maxContentWidth, alignSelf: "center", width: "92%" }]}
          onPress={() => router.push("/(tabs)/search")}
        >
          <Text style={{ color: colors.textFaint }}>Search products...</Text>
        </TouchableOpacity>

        <SectionHeader title="Special Offers" />
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: spacing.lg }}
          data={OFFERS}
          keyExtractor={(item) => item.title + item.subtitle}
          renderItem={({ item }) => (
            <PromoCard title={item.title} subtitle={item.subtitle} image={item.image} onPress={() => router.push("/(tabs)/categories")} />
          )}
        />

        <SectionHeader title="Most Popular" onSeeAll={() => router.push("/(tabs)/categories")} />
        <ProductRow loading={loading} products={popular} />

        <SectionHeader title="Shop by Category" onSeeAll={() => router.push("/(tabs)/categories")} />
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: spacing.lg }}
          data={CATEGORIES}
          keyExtractor={(c) => c.id}
          renderItem={({ item }) => <CategoryCard category={item} size={130} />}
        />

        <SectionHeader title="Trending Now" />
        <ProductRow loading={loading} products={trending} />

        <SectionHeader title="New Arrivals" />
        <ProductRow loading={loading} products={newArrivals} />

        <SectionHeader title="Best Sellers" />
        <ProductRow loading={loading} products={bestSellers} />

        {recentlyViewed.length > 0 && (
          <>
            <SectionHeader title="Recently Viewed" />
            <ProductRow loading={false} products={recentlyViewed} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ProductRow({ loading, products }: { loading: boolean; products: any[] }) {
  if (loading) {
    return (
      <View style={{ flexDirection: "row", paddingHorizontal: spacing.lg, gap: spacing.md }}>
        {[1, 2, 3].map((i) => (
          <SkeletonBlock key={i} style={{ width: 168, height: 240 }} />
        ))}
      </View>
    );
  }
  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: spacing.lg }}
      data={products}
      keyExtractor={(p) => p.id}
      renderItem={({ item }) => <ProductCard product={item} />}
    />
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md
  },
  wordmark: { fontSize: 18, fontWeight: "800", letterSpacing: 1 },
  headerIcons: { flexDirection: "row", alignItems: "center" },
  dot: { position: "absolute", top: -2, right: -2, width: 7, height: 7, borderRadius: 4 },
  avatar: { width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  searchBar: {
    height: 44,
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm
  }
});

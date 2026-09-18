import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Heart, X } from "lucide-react-native";
import { useThemeStore } from "@/store/themeStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { useAllProducts } from "@/hooks/useProducts";
import EmptyState from "@/components/EmptyState";
import PriceTag from "@/components/PriceTag";
import Button from "@/components/Button";
import { spacing, typography, radius } from "@/constants/theme";

export default function WishlistScreen() {
  const { colors } = useThemeStore();
  const { productIds, toggle } = useWishlistStore();
  const { products } = useAllProducts();
  const addToCart = useCartStore((s) => s.addToCart);

  const wishlistProducts = products.filter((p) => productIds.includes(p.id));

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: colors.bg }]} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[typography.title, { color: colors.text }]}>Wishlist</Text>
        <View style={{ width: 24 }} />
      </View>

      {wishlistProducts.length === 0 ? (
        <EmptyState
          icon={<Heart size={40} color={colors.textFaint} />}
          title="Your wishlist is empty"
          subtitle="Tap the heart on any product to save it here."
          actionLabel="Browse Products"
          onAction={() => router.push("/(tabs)")}
        />
      ) : (
        <FlatList
          data={wishlistProducts}
          keyExtractor={(p) => p.id}
          contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}
          renderItem={({ item }) => (
            <View style={[styles.card, { borderColor: colors.border }]}>
              <TouchableOpacity onPress={() => router.push(`/product/${item.id}`)} style={{ flexDirection: "row", flex: 1 }}>
                <Image source={{ uri: item.images[0] }} style={styles.image} contentFit="cover" />
                <View style={styles.info}>
                  <Text numberOfLines={1} style={{ color: colors.text, fontWeight: "600", fontSize: 13 }}>
                    {item.name}
                  </Text>
                  <Text style={{ color: colors.textFaint, fontSize: 11 }}>{item.brand}</Text>
                  <PriceTag price={item.price} originalPrice={item.originalPrice} size="sm" />
                  <Button label="Add to Cart" onPress={() => addToCart(item, 1)} style={{ marginTop: spacing.xs, paddingVertical: 8 }} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => toggle(item.id)} hitSlop={8} style={{ padding: spacing.sm }}>
                <X size={18} color={colors.textFaint} />
              </TouchableOpacity>
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
    padding: spacing.lg
  },
  card: {
    flexDirection: "row",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.lg,
    alignItems: "flex-start"
  },
  image: { width: 84, height: 84, borderRadius: radius.md },
  info: { flex: 1, padding: spacing.sm, gap: 4 }
});

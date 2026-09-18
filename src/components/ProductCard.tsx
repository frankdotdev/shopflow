import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Image } from "expo-image";
import { Heart } from "lucide-react-native";
import { router } from "expo-router";
import { Product } from "@/types";
import { useThemeStore } from "@/store/themeStore";
import { useWishlistStore } from "@/store/wishlistStore";
import PriceTag from "./PriceTag";
import StarRating from "./StarRating";
import { spacing, radius } from "@/constants/theme";
import { useDeviceInfo } from "@/constants/layout";

export default function ProductCard({ product, width }: { product: Product; width?: number }) {
  const { colors } = useThemeStore();
  const wishlisted = useWishlistStore((s) => s.isWishlisted(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const { isTablet } = useDeviceInfo();
  const cardWidth = width ?? (isTablet ? 220 : 168);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[styles.card, { width: cardWidth, borderColor: colors.border, backgroundColor: colors.surface }]}
      onPress={() => router.push(`/product/${product.id}`)}
    >
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: product.images[0] }}
          style={styles.image}
          contentFit="cover"
          transition={150}
        />
        <TouchableOpacity
          style={[styles.heart, { backgroundColor: colors.surface }]}
          hitSlop={8}
          onPress={() => toggleWishlist(product.id)}
        >
          <Heart size={16} color={wishlisted ? colors.accent : colors.textMuted} fill={wishlisted ? colors.accent : "none"} />
        </TouchableOpacity>
        {!!product.discount && (
          <View style={[styles.badge, { backgroundColor: colors.black }]}>
            <Text style={styles.badgeText}>-{product.discount}%</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text numberOfLines={1} style={[styles.name, { color: colors.text }]}>
          {product.name}
        </Text>
        <Text numberOfLines={1} style={[styles.meta, { color: colors.textFaint }]}>
          {product.brand} · {product.subcategory}
        </Text>
        <StarRating rating={product.rating} reviewCount={product.reviewCount} />
        <PriceTag price={product.price} originalPrice={product.originalPrice} size="sm" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.lg,
    overflow: "hidden",
    marginRight: spacing.md
  },
  imageWrap: { width: "100%", aspectRatio: 1, position: "relative" },
  image: { width: "100%", height: "100%" },
  heart: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center"
  },
  badge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: radius.sm
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  info: { padding: spacing.sm, gap: 4 },
  name: { fontSize: 13, fontWeight: "600" },
  meta: { fontSize: 11 }
});

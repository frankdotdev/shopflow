import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Share, Alert } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Share2, Heart, Check } from "lucide-react-native";
import { useThemeStore } from "@/store/themeStore";
import { useAllProducts } from "@/hooks/useProducts";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { recordRecentlyViewed, fetchReviewsForProduct, fetchRecentlyViewed } from "@/database/repositories";
import StarRating from "@/components/StarRating";
import PriceTag from "@/components/PriceTag";
import QuantitySelector from "@/components/QuantitySelector";
import Button from "@/components/Button";
import ProductCard from "@/components/ProductCard";
import { formatNaira } from "@/utils/currency";
import { spacing, typography, radius } from "@/constants/theme";
import { Review } from "@/types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useThemeStore();
  const { products } = useAllProducts();
  const wishlisted = useWishlistStore((s) => s.isWishlisted(id!));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const addToCart = useCartStore((s) => s.addToCart);

  const product = useMemo(() => products.find((p) => p.id === id), [products, id]);
  const [imageIndex, setImageIndex] = useState(0);
  const [color, setColor] = useState<string | undefined>(product?.colors[0]);
  const [size, setSize] = useState<string | undefined>(product?.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [added, setAdded] = useState(false);
  const [recentIds, setRecentIds] = useState<string[]>([]);

  useEffect(() => {
    if (!product) return;
    setColor(product.colors[0]);
    setSize(product.sizes[0]);
    setQuantity(1);
    recordRecentlyViewed(product.id);
    fetchReviewsForProduct(product.id).then(setReviews);
    fetchRecentlyViewed().then((ids) => setRecentIds(ids.filter((r) => r !== product.id)));
  }, [product?.id]);

  if (!product) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
        <Text style={{ padding: spacing.lg, color: colors.text }}>Product not found.</Text>
      </SafeAreaView>
    );
  }

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 8);
  const recentlyViewed = recentIds.map((rid) => products.find((p) => p.id === rid)).filter(Boolean) as typeof products;

  const onAddToCart = async () => {
    await addToCart(product, quantity, color, size);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const onShare = async () => {
    try {
      await Share.share({
        message: `${product.name} — ${formatNaira(product.price)} on ShopFlow. Everything you want. One place.`
      });
    } catch {}
  };

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: colors.bg }]} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View>
          <Image
            source={{ uri: product.images[imageIndex] }}
            style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH }}
            contentFit="cover"
          />
          <View style={styles.topBar}>
            <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.surface }]} onPress={() => router.back()}>
              <ChevronLeft size={20} color={colors.text} />
            </TouchableOpacity>
            <View style={{ flexDirection: "row", gap: spacing.sm }}>
              <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.surface }]} onPress={onShare}>
                <Share2 size={18} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.surface }]} onPress={() => toggleWishlist(product.id)}>
                <Heart size={18} color={wishlisted ? colors.accent : colors.text} fill={wishlisted ? colors.accent : "none"} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.dots}>
            {product.images.map((_, i) => (
              <TouchableOpacity key={i} onPress={() => setImageIndex(i)}>
                <View style={[styles.dot, { backgroundColor: i === imageIndex ? colors.black : colors.border }]} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ padding: spacing.lg, gap: spacing.sm }}>
          <Text style={[styles.brand, { color: colors.textMuted }]}>{product.brand}</Text>
          <Text style={[typography.title, { color: colors.text }]}>{product.name}</Text>
          <TouchableOpacity onPress={() => router.push(`/reviews/${product.id}`)}>
            <StarRating rating={product.rating} reviewCount={product.reviewCount} size={14} />
          </TouchableOpacity>
          <PriceTag price={product.price} originalPrice={product.originalPrice} size="lg" />
          <Text style={{ color: product.stock > 0 ? colors.success : colors.danger, fontSize: 12, fontWeight: "600" }}>
            {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
          </Text>

          <Text style={[typography.heading, { color: colors.text, marginTop: spacing.md }]}>Description</Text>
          <Text style={{ color: colors.textMuted, lineHeight: 20 }}>{product.description}</Text>

          {product.colors.length > 0 && (
            <>
              <Text style={[typography.heading, { color: colors.text, marginTop: spacing.md }]}>Color</Text>
              <View style={styles.swatchRow}>
                {product.colors.map((c) => (
                  <TouchableOpacity
                    key={c}
                    onPress={() => setColor(c)}
                    style={[
                      styles.swatch,
                      { backgroundColor: c, borderColor: color === c ? colors.accent : colors.border, borderWidth: color === c ? 3 : 1 }
                    ]}
                  >
                    {color === c && <Check size={14} color={c === "#FFFFFF" ? "#000" : "#fff"} />}
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {product.sizes.length > 0 && (
            <>
              <Text style={[typography.heading, { color: colors.text, marginTop: spacing.md }]}>Size</Text>
              <View style={styles.chipsWrap}>
                {product.sizes.map((s) => (
                  <TouchableOpacity
                    key={s}
                    onPress={() => setSize(s)}
                    style={[
                      styles.sizeChip,
                      { borderColor: size === s ? colors.black : colors.border, backgroundColor: size === s ? colors.black : "transparent" }
                    ]}
                  >
                    <Text style={{ color: size === s ? colors.white : colors.text, fontWeight: "600", fontSize: 13 }}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          <Text style={[typography.heading, { color: colors.text, marginTop: spacing.md }]}>Specifications</Text>
          {product.specifications.map((spec) => (
            <View key={spec.label} style={styles.specRow}>
              <Text style={{ color: colors.textMuted, fontSize: 13 }}>{spec.label}</Text>
              <Text style={{ color: colors.text, fontSize: 13, fontWeight: "600" }}>{spec.value}</Text>
            </View>
          ))}

          <View style={styles.rowBetween}>
            <Text style={[typography.heading, { color: colors.text, marginTop: spacing.md }]}>Quantity</Text>
            <QuantitySelector value={quantity} onChange={setQuantity} max={product.stock || 1} />
          </View>
        </View>

        {related.length > 0 && (
          <>
            <Text style={[typography.heading, { color: colors.text, paddingHorizontal: spacing.lg, marginTop: spacing.lg }]}>
              Related Products
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.lg, marginTop: spacing.sm }}>
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </ScrollView>
          </>
        )}

        {recentlyViewed.length > 0 && (
          <>
            <Text style={[typography.heading, { color: colors.text, paddingHorizontal: spacing.lg, marginTop: spacing.lg }]}>
              Recently Viewed
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.lg, marginTop: spacing.sm }}>
              {recentlyViewed.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </ScrollView>
          </>
        )}
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.bg }]}>
        <View>
          <Text style={{ color: colors.textMuted, fontSize: 11 }}>Total</Text>
          <Text style={{ color: colors.text, fontWeight: "700", fontSize: 16 }}>{formatNaira(product.price * quantity)}</Text>
        </View>
        <Button
          label={added ? "Added to Cart" : "Add to Cart"}
          onPress={onAddToCart}
          disabled={product.stock <= 0}
          style={{ flex: 1, marginLeft: spacing.lg }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  topBar: {
    position: "absolute",
    top: spacing.md,
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  iconBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  dots: { flexDirection: "row", justifyContent: "center", gap: 6, position: "absolute", bottom: 12, left: 0, right: 0 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  brand: { fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
  swatchRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.sm },
  swatch: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  chipsWrap: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.sm },
  sizeChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth },
  specRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth
  }
});

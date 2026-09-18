import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Trash2, ShoppingBag } from "lucide-react-native";
import { useThemeStore } from "@/store/themeStore";
import { useCartStore } from "@/store/cartStore";
import { useAllProducts } from "@/hooks/useProducts";
import { useCartTotals } from "@/hooks/useCartTotals";
import QuantitySelector from "@/components/QuantitySelector";
import Button from "@/components/Button";
import EmptyState from "@/components/EmptyState";
import { formatNaira } from "@/utils/currency";
import { spacing, typography, radius } from "@/constants/theme";

export default function CartScreen() {
  const { colors } = useThemeStore();
  const { items, updateQuantity, removeItem } = useCartStore();
  const { products } = useAllProducts();
  const { lineItems, subtotal, total } = useCartTotals(items, products, 0, items.length ? 1500 : 0);

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: colors.bg }]} edges={["top"]}>
      <Text style={[typography.title, { color: colors.text, padding: spacing.lg, paddingBottom: 0 }]}>My Cart</Text>

      {lineItems.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag size={40} color={colors.textFaint} />}
          title="Your cart is empty"
          subtitle="Looks like you haven't added anything yet."
          actionLabel="Continue Shopping"
          onAction={() => router.push("/(tabs)")}
        />
      ) : (
        <>
          <FlatList
            data={lineItems}
            keyExtractor={(li) => li.item.id}
            contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}
            renderItem={({ item: li }) => (
              <View style={[styles.card, { borderColor: colors.border }]}>
                <Image source={{ uri: li.product!.images[0] }} style={styles.image} contentFit="cover" />
                <View style={styles.info}>
                  <Text numberOfLines={1} style={{ color: colors.text, fontWeight: "600", fontSize: 13 }}>
                    {li.product!.name}
                  </Text>
                  {(li.item.selectedColor || li.item.selectedSize) && (
                    <Text style={{ color: colors.textFaint, fontSize: 11 }}>
                      {li.item.selectedSize ? `Size ${li.item.selectedSize}` : ""} {li.item.selectedColor ? "· Color selected" : ""}
                    </Text>
                  )}
                  <Text style={{ color: colors.text, fontWeight: "700", fontSize: 14, marginTop: 2 }}>
                    {formatNaira(li.product!.price)}
                  </Text>
                  <View style={styles.rowBetween}>
                    <QuantitySelector value={li.item.quantity} onChange={(v) => updateQuantity(li.item.id, v)} max={li.product!.stock} />
                    <TouchableOpacity onPress={() => removeItem(li.item.id)} hitSlop={8}>
                      <Trash2 size={18} color={colors.textFaint} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />
          <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.bg }]}>
            <View style={styles.summaryRow}>
              <Text style={{ color: colors.textMuted }}>Subtotal</Text>
              <Text style={{ color: colors.text, fontWeight: "600" }}>{formatNaira(subtotal)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={{ color: colors.textMuted }}>Shipping</Text>
              <Text style={{ color: colors.text, fontWeight: "600" }}>{formatNaira(1500)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={{ color: colors.text, fontWeight: "700", fontSize: 16 }}>Total</Text>
              <Text style={{ color: colors.text, fontWeight: "700", fontSize: 16 }}>{formatNaira(total)}</Text>
            </View>
            <Button label="Checkout" onPress={() => router.push("/checkout/address")} style={{ marginTop: spacing.sm }} />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  card: {
    flexDirection: "row",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.lg,
    overflow: "hidden"
  },
  image: { width: 84, height: 84 },
  info: { flex: 1, padding: spacing.sm, gap: 2 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: spacing.xs },
  footer: { padding: spacing.lg, borderTopWidth: StyleSheet.hairlineWidth, gap: 4 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 }
});

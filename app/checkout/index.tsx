import React, { useEffect } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeStore } from "@/store/themeStore";
import { useCheckoutStore } from "@/store/checkoutStore";
import { useCartStore } from "@/store/cartStore";
import { useOrderStore } from "@/store/orderStore";
import { useAllProducts } from "@/hooks/useProducts";
import { useCartTotals } from "@/hooks/useCartTotals";
import { SHIPPING_METHODS, PAYMENT_METHODS, COURIERS } from "@/data/reviewSeed";
import StepHeader from "@/components/StepHeader";
import Button from "@/components/Button";
import { formatNaira, generateOrderNumber, uid, estimatedDeliveryLabel } from "@/utils/currency";
import { spacing, typography, radius } from "@/constants/theme";
import { Order, OrderItem } from "@/types";

export default function CheckoutReviewScreen() {
  const { colors } = useThemeStore();
  const { address, shippingMethodId, promoCode, discountPercent, paymentMethodId } = useCheckoutStore();
  const { items, clear } = useCartStore();
  const { products } = useAllProducts();
  const placeOrder = useOrderStore((s) => s.place);
  const resetCheckout = useCheckoutStore((s) => s.reset);

  const shippingMethod = SHIPPING_METHODS.find((m) => m.id === shippingMethodId) ?? SHIPPING_METHODS[0];
  const paymentMethod = PAYMENT_METHODS.find((m) => m.id === paymentMethodId) ?? PAYMENT_METHODS[0];

  const { lineItems, subtotal, discount, total } = useCartTotals(items, products, discountPercent, shippingMethod.price);

  useEffect(() => {
    if (!address) {
      router.replace("/checkout/address");
    }
  }, [address]);

  const onPlaceOrder = async () => {
    const orderItems: OrderItem[] = lineItems.map((li) => ({
      productId: li.product!.id,
      name: li.product!.name,
      image: li.product!.images[0],
      price: li.product!.price,
      quantity: li.item.quantity,
      selectedColor: li.item.selectedColor,
      selectedSize: li.item.selectedSize
    }));

    const order: Order = {
      id: uid("order"),
      orderNumber: generateOrderNumber(),
      items: orderItems,
      subtotal,
      discount,
      shipping: shippingMethod.price,
      total,
      status: "Order Placed",
      paymentMethod: paymentMethod.name,
      shippingMethod: shippingMethod.name,
      address: address!,
      createdAt: new Date().toISOString(),
      courier: COURIERS[Math.floor(Math.random() * COURIERS.length)],
      estimatedDelivery: estimatedDeliveryLabel(shippingMethod.id === "priority" ? 1 : shippingMethod.id === "express" ? 2 : 5)
    };

    await placeOrder(order);
    await clear();
    resetCheckout();
    router.replace({ pathname: "/checkout/success", params: { orderId: order.id } });
  };

  if (!address) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <StepHeader title="Order Review" step={5} total={5} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 140, gap: spacing.lg }}>
        <View>
          <Text style={[typography.heading, { color: colors.text }]}>Products ({lineItems.length})</Text>
          {lineItems.map((li) => (
            <View key={li.item.id} style={styles.productRow}>
              <Text numberOfLines={1} style={{ color: colors.text, flex: 1 }}>
                {li.product!.name} × {li.item.quantity}
              </Text>
              <Text style={{ color: colors.text, fontWeight: "600" }}>{formatNaira(li.product!.price * li.item.quantity)}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.section, { borderColor: colors.border }]}>
          <Text style={[typography.captionStrong, { color: colors.textMuted }]}>ADDRESS</Text>
          <Text style={{ color: colors.text, marginTop: 4 }}>{address.name}</Text>
          <Text style={{ color: colors.textMuted, fontSize: 13 }}>{address.street}, {address.city}, {address.state}</Text>
        </View>

        <View style={[styles.section, { borderColor: colors.border }]}>
          <Text style={[typography.captionStrong, { color: colors.textMuted }]}>SHIPPING</Text>
          <Text style={{ color: colors.text, marginTop: 4 }}>{shippingMethod.name} · {shippingMethod.days}</Text>
        </View>

        {!!promoCode && (
          <View style={[styles.section, { borderColor: colors.border }]}>
            <Text style={[typography.captionStrong, { color: colors.textMuted }]}>PROMO</Text>
            <Text style={{ color: colors.success, marginTop: 4, fontWeight: "600" }}>{promoCode} applied</Text>
          </View>
        )}

        <View style={[styles.section, { borderColor: colors.border }]}>
          <Text style={[typography.captionStrong, { color: colors.textMuted }]}>PAYMENT METHOD</Text>
          <Text style={{ color: colors.text, marginTop: 4 }}>{paymentMethod.name}</Text>
        </View>

        <View style={{ gap: 4 }}>
          <View style={styles.summaryRow}>
            <Text style={{ color: colors.textMuted }}>Subtotal</Text>
            <Text style={{ color: colors.text }}>{formatNaira(subtotal)}</Text>
          </View>
          {discount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={{ color: colors.textMuted }}>Discount</Text>
              <Text style={{ color: colors.success }}>-{formatNaira(discount)}</Text>
            </View>
          )}
          <View style={styles.summaryRow}>
            <Text style={{ color: colors.textMuted }}>Shipping</Text>
            <Text style={{ color: colors.text }}>{formatNaira(shippingMethod.price)}</Text>
          </View>
          <View style={[styles.summaryRow, { marginTop: spacing.xs }]}>
            <Text style={{ color: colors.text, fontWeight: "700", fontSize: 16 }}>Total</Text>
            <Text style={{ color: colors.text, fontWeight: "700", fontSize: 16 }}>{formatNaira(total)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.bg }]}>
        <Button label="Place Order" onPress={onPlaceOrder} disabled={lineItems.length === 0} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  productRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, gap: spacing.md },
  section: { borderWidth: StyleSheet.hairlineWidth, borderRadius: radius.lg, padding: spacing.md },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2 },
  footer: { position: "absolute", bottom: 0, left: 0, right: 0, padding: spacing.lg, borderTopWidth: StyleSheet.hairlineWidth }
});

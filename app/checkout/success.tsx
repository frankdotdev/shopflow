import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { CheckCircle2 } from "lucide-react-native";
import { useThemeStore } from "@/store/themeStore";
import { fetchOrderById } from "@/database/repositories";
import Button from "@/components/Button";
import { formatNaira } from "@/utils/currency";
import { spacing, typography } from "@/constants/theme";
import { Order } from "@/types";

export default function OrderSuccessScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { colors } = useThemeStore();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (orderId) fetchOrderById(orderId).then(setOrder);
  }, [orderId]);

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: colors.bg }]}>
      <View style={styles.center}>
        <CheckCircle2 size={64} color={colors.success} />
        <Text style={[typography.title, { color: colors.text, marginTop: spacing.lg }]}>ORDER CONFIRMED</Text>
        <Text style={{ color: colors.textMuted, textAlign: "center", marginTop: spacing.sm }}>
          Your order has been placed successfully.
        </Text>

        {order && (
          <View style={{ marginTop: spacing.xl, width: "100%", gap: spacing.sm }}>
            <Row label="Order Number" value={order.orderNumber} colors={colors} />
            <Row label="Estimated Delivery" value={order.estimatedDelivery} colors={colors} />
            <Row label="Total" value={formatNaira(order.total)} colors={colors} />
          </View>
        )}

        <View style={{ width: "100%", gap: spacing.md, marginTop: spacing.xxl }}>
          <Button
            label="Track Order"
            onPress={() => order && router.replace(`/orders/${order.id}`)}
          />
          <Button label="View Orders" variant="secondary" onPress={() => router.replace("/orders")} />
          <Button label="Continue Shopping" variant="outline" onPress={() => router.replace("/(tabs)")} />
        </View>
      </View>
    </SafeAreaView>
  );
}

function Row({ label, value, colors }: { label: string; value: string; colors: any }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Text style={{ color: colors.textMuted }}>{label}</Text>
      <Text style={{ color: colors.text, fontWeight: "700" }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xl }
});

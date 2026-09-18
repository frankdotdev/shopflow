import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Check } from "lucide-react-native";
import { useThemeStore } from "@/store/themeStore";
import { fetchOrderById } from "@/database/repositories";
import { formatNaira } from "@/utils/currency";
import { spacing, typography, radius } from "@/constants/theme";
import { Order, OrderStatus } from "@/types";

const TIMELINE: OrderStatus[] = [
  "Order Placed",
  "Payment Confirmed",
  "Processing",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered"
];

function simulateStatusIndex(createdAt: string): number {
  const hoursElapsed = (Date.now() - new Date(createdAt).getTime()) / 3600000;
  const idx = Math.min(TIMELINE.length - 1, Math.floor(hoursElapsed / 6));
  return idx;
}

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useThemeStore();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (id) fetchOrderById(id).then(setOrder);
  }, [id]);

  if (!order) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
        <Text style={{ padding: spacing.lg, color: colors.text }}>Loading order...</Text>
      </SafeAreaView>
    );
  }

  const currentIndex =
    order.status === "Cancelled" ? -1 : simulateStatusIndex(order.createdAt);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[typography.title, { color: colors.text }]}>{order.orderNumber}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxxl }}>
        <View style={[styles.section, { borderColor: colors.border }]}>
          <Text style={[typography.captionStrong, { color: colors.textMuted }]}>TRACKING</Text>
          <View style={{ marginTop: spacing.md }}>
            {TIMELINE.map((status, i) => {
              const done = i <= currentIndex;
              return (
                <View key={status} style={styles.timelineRow}>
                  <View style={styles.timelineIconCol}>
                    <View style={[styles.timelineDot, { backgroundColor: done ? colors.black : colors.border }]}>
                      {done && <Check size={10} color="#fff" />}
                    </View>
                    {i < TIMELINE.length - 1 && (
                      <View style={[styles.timelineLine, { backgroundColor: i < currentIndex ? colors.black : colors.border }]} />
                    )}
                  </View>
                  <Text style={{ color: done ? colors.text : colors.textFaint, fontWeight: done ? "700" : "400", paddingBottom: spacing.lg }}>
                    {status}
                  </Text>
                </View>
              );
            })}
          </View>
          <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: spacing.sm }}>
            Courier: {order.courier} · Estimated delivery: {order.estimatedDelivery}
          </Text>
        </View>

        <View style={[styles.section, { borderColor: colors.border }]}>
          <Text style={[typography.captionStrong, { color: colors.textMuted }]}>ITEMS</Text>
          {order.items.map((it, i) => (
            <View key={i} style={styles.itemRow}>
              <Image source={{ uri: it.image }} style={styles.itemImage} contentFit="cover" />
              <View style={{ flex: 1, marginLeft: spacing.sm }}>
                <Text numberOfLines={1} style={{ color: colors.text, fontWeight: "600", fontSize: 13 }}>{it.name}</Text>
                <Text style={{ color: colors.textFaint, fontSize: 11 }}>Qty {it.quantity}</Text>
              </View>
              <Text style={{ color: colors.text, fontWeight: "700" }}>{formatNaira(it.price * it.quantity)}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.section, { borderColor: colors.border }]}>
          <Text style={[typography.captionStrong, { color: colors.textMuted }]}>SHIPPING ADDRESS</Text>
          <Text style={{ color: colors.text, marginTop: 4 }}>{order.address.name}</Text>
          <Text style={{ color: colors.textMuted, fontSize: 13 }}>{order.address.street}, {order.address.city}, {order.address.state}</Text>
        </View>

        <View style={{ gap: 4 }}>
          <SummaryRow label="Subtotal" value={formatNaira(order.subtotal)} colors={colors} />
          {order.discount > 0 && <SummaryRow label="Discount" value={`-${formatNaira(order.discount)}`} colors={colors} />}
          <SummaryRow label="Shipping" value={formatNaira(order.shipping)} colors={colors} />
          <SummaryRow label="Total" value={formatNaira(order.total)} colors={colors} bold />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SummaryRow({ label, value, colors, bold }: any) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Text style={{ color: colors.textMuted, fontWeight: bold ? "700" : "400", fontSize: bold ? 16 : 14 }}>{label}</Text>
      <Text style={{ color: colors.text, fontWeight: bold ? "700" : "600", fontSize: bold ? 16 : 14 }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: spacing.lg },
  section: { borderWidth: StyleSheet.hairlineWidth, borderRadius: radius.lg, padding: spacing.md },
  timelineRow: { flexDirection: "row" },
  timelineIconCol: { alignItems: "center", width: 24, marginRight: spacing.sm },
  timelineDot: { width: 18, height: 18, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  timelineLine: { width: 2, flex: 1, marginTop: 2 },
  itemRow: { flexDirection: "row", alignItems: "center", paddingVertical: spacing.sm },
  itemImage: { width: 48, height: 48, borderRadius: radius.sm }
});

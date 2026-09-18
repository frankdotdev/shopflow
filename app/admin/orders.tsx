import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import { useThemeStore } from "@/store/themeStore";
import { useOrderStore } from "@/store/orderStore";
import Chip from "@/components/Chip";
import { formatNaira } from "@/utils/currency";
import { spacing, typography, radius } from "@/constants/theme";
import { OrderStatus } from "@/types";

const STATUSES: (OrderStatus | "All")[] = ["All", "Order Placed", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrdersScreen() {
  const { colors } = useThemeStore();
  const { orders, update } = useOrderStore();
  const [filter, setFilter] = useState<OrderStatus | "All">("All");

  const filtered = filter === "All" ? orders : orders.filter((o) => o.status === filter);

  const advanceStatus = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    const flow: OrderStatus[] = ["Order Placed", "Payment Confirmed", "Processing", "Packed", "Shipped", "Out for Delivery", "Delivered"];
    const idx = flow.indexOf(order.status);
    const next = flow[Math.min(flow.length - 1, idx + 1)];
    update({ ...order, status: next });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[typography.title, { color: colors.text }]}>Orders</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={{ paddingHorizontal: spacing.lg, flexDirection: "row", flexWrap: "wrap" }}>
        {STATUSES.map((s) => (
          <Chip key={s} label={s} active={filter === s} onPress={() => setFilter(s)} />
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(o) => o.id}
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.sm }}
        renderItem={({ item }) => (
          <View style={[styles.row, { borderColor: colors.border }]}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontWeight: "700" }}>{item.orderNumber}</Text>
              <Text style={{ color: colors.textMuted, fontSize: 12 }}>{formatNaira(item.total)} · {item.status}</Text>
            </View>
            {item.status !== "Delivered" && item.status !== "Cancelled" && (
              <TouchableOpacity style={[styles.advanceBtn, { borderColor: colors.border }]} onPress={() => advanceStatus(item.id)}>
                <Text style={{ color: colors.text, fontSize: 12, fontWeight: "600" }}>Advance</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: spacing.lg },
  row: { flexDirection: "row", alignItems: "center", padding: spacing.md, borderWidth: StyleSheet.hairlineWidth, borderRadius: radius.lg },
  advanceBtn: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.pill, borderWidth: StyleSheet.hairlineWidth }
});

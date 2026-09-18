import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, PackageSearch } from "lucide-react-native";
import { useThemeStore } from "@/store/themeStore";
import { useOrderStore } from "@/store/orderStore";
import EmptyState from "@/components/EmptyState";
import { formatNaira } from "@/utils/currency";
import { spacing, typography, radius } from "@/constants/theme";

const STATUS_COLOR: Record<string, string> = {
  "Order Placed": "#6F6D68",
  "Payment Confirmed": "#6F6D68",
  Processing: "#B65C3B",
  Packed: "#B65C3B",
  Shipped: "#2E4057",
  "Out for Delivery": "#2E4057",
  Delivered: "#3E7A52",
  Cancelled: "#B23A34"
};

export default function OrdersScreen() {
  const { colors } = useThemeStore();
  const { orders } = useOrderStore();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[typography.title, { color: colors.text }]}>My Orders</Text>
        <View style={{ width: 24 }} />
      </View>

      {orders.length === 0 ? (
        <EmptyState
          icon={<PackageSearch size={40} color={colors.textFaint} />}
          title="No orders yet"
          subtitle="Your placed orders will show up here."
          actionLabel="Start Shopping"
          onAction={() => router.push("/(tabs)")}
        />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(o) => o.id}
          contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}
          renderItem={({ item }) => (
            <TouchableOpacity style={[styles.card, { borderColor: colors.border }]} onPress={() => router.push(`/orders/${item.id}`)}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontWeight: "700" }}>{item.orderNumber}</Text>
                <Text style={{ color: colors.textFaint, fontSize: 12, marginTop: 2 }}>
                  {new Date(item.createdAt).toLocaleDateString()} · {item.items.length} item{item.items.length > 1 ? "s" : ""}
                </Text>
                <Text style={{ color: colors.text, fontWeight: "700", marginTop: 4 }}>{formatNaira(item.total)}</Text>
              </View>
              <Text style={{ color: STATUS_COLOR[item.status], fontSize: 12, fontWeight: "700" }}>{item.status}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: spacing.lg },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.lg
  }
});

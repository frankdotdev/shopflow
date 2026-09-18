import React, { useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Package, ShoppingBag, AlertTriangle, Users, TrendingUp, Boxes, ClipboardList } from "lucide-react-native";
import { useThemeStore } from "@/store/themeStore";
import { useAllProducts } from "@/hooks/useProducts";
import { useOrderStore } from "@/store/orderStore";
import { formatNaira } from "@/utils/currency";
import { spacing, typography, radius } from "@/constants/theme";

export default function AdminDashboard() {
  const { colors } = useThemeStore();
  const { products } = useAllProducts();
  const { orders } = useOrderStore();

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const todaysOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === today);
    const todaysSales = todaysOrders.reduce((sum, o) => sum + o.total, 0);
    const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
    return {
      todaysSales,
      ordersCount: orders.length,
      productsCount: products.length,
      lowStock,
      customers: 1
    };
  }, [products, orders]);

  const CARDS = [
    { label: "Today's Sales", value: formatNaira(stats.todaysSales), icon: TrendingUp },
    { label: "Orders", value: String(stats.ordersCount), icon: ShoppingBag },
    { label: "Products", value: String(stats.productsCount), icon: Package },
    { label: "Low Stock", value: String(stats.lowStock), icon: AlertTriangle },
    { label: "Customers", value: String(stats.customers), icon: Users }
  ];

  const NAV = [
    { label: "Products", icon: Package, route: "/admin/products" },
    { label: "Inventory", icon: Boxes, route: "/admin/inventory" },
    { label: "Orders", icon: ClipboardList, route: "/admin/orders" }
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[typography.title, { color: colors.text }]}>Store Manager</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
        <View style={styles.grid}>
          {CARDS.map(({ label, value, icon: Icon }) => (
            <View key={label} style={[styles.statCard, { borderColor: colors.border }]}>
              <Icon size={18} color={colors.accent} />
              <Text style={{ color: colors.text, fontWeight: "800", fontSize: 18, marginTop: spacing.sm }}>{value}</Text>
              <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 2 }}>{label}</Text>
            </View>
          ))}
        </View>

        <View>
          <Text style={[typography.heading, { color: colors.text, marginBottom: spacing.sm }]}>Manage</Text>
          {NAV.map(({ label, icon: Icon, route }) => (
            <TouchableOpacity key={label} style={[styles.navRow, { borderColor: colors.border }]} onPress={() => router.push(route as any)}>
              <Icon size={18} color={colors.text} />
              <Text style={{ flex: 1, marginLeft: spacing.md, color: colors.text, fontWeight: "600" }}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: spacing.lg },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  statCard: {
    width: "30%",
    minWidth: 100,
    padding: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.lg
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.lg,
    marginBottom: spacing.sm
  }
});

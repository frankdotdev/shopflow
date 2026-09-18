import React from "react";
import { Tabs } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { Home, Grid3x3, Search, ShoppingCart, User } from "lucide-react-native";
import { useThemeStore } from "@/store/themeStore";
import { useCartStore } from "@/store/cartStore";

function TabIcon({ Icon, color, badge }: { Icon: any; color: string; badge?: number }) {
  return (
    <View>
      <Icon size={22} color={color} />
      {!!badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge > 99 ? "99+" : badge}</Text>
        </View>
      )}
    </View>
  );
}

export default function TabsLayout() {
  const { colors } = useThemeStore();
  const cartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textFaint,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Home", tabBarIcon: ({ color }) => <TabIcon Icon={Home} color={color} /> }}
      />
      <Tabs.Screen
        name="categories"
        options={{ title: "Categories", tabBarIcon: ({ color }) => <TabIcon Icon={Grid3x3} color={color} /> }}
      />
      <Tabs.Screen
        name="search"
        options={{ title: "Search", tabBarIcon: ({ color }) => <TabIcon Icon={Search} color={color} /> }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color }) => <TabIcon Icon={ShoppingCart} color={color} badge={cartCount} />
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profile", tabBarIcon: ({ color }) => <TabIcon Icon={User} color={color} /> }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: -4,
    right: -8,
    backgroundColor: "#B65C3B",
    borderRadius: 8,
    paddingHorizontal: 4,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center"
  },
  badgeText: { color: "#fff", fontSize: 9, fontWeight: "700" }
});

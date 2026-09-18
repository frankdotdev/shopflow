import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  User, Package, Heart, MapPin, Bell, CreditCard, Settings as SettingsIcon,
  HelpCircle, Info, ChevronRight, ShieldCheck
} from "lucide-react-native";
import { useThemeStore } from "@/store/themeStore";
import { spacing, typography, radius } from "@/constants/theme";

const SECTIONS: { icon: any; label: string; route: string }[] = [
  { icon: Package, label: "My Orders", route: "/orders" },
  { icon: Heart, label: "Wishlist", route: "/wishlist" },
  { icon: MapPin, label: "Saved Addresses", route: "/addresses" },
  { icon: Bell, label: "Notifications", route: "/notifications" },
  { icon: CreditCard, label: "Payment Methods", route: "/checkout/payment" },
  { icon: SettingsIcon, label: "Settings", route: "/settings" },
  { icon: HelpCircle, label: "Help & Support", route: "/help" }
];

export default function ProfileScreen() {
  const { colors } = useThemeStore();

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: colors.bg }]} edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxxl }}>
        <Text style={[typography.title, { color: colors.text, padding: spacing.lg, paddingBottom: 0 }]}>Profile</Text>

        <View style={styles.profileCard}>
          <View style={[styles.avatar, { backgroundColor: colors.bgAlt }]}>
            <User size={28} color={colors.text} />
          </View>
          <View style={{ marginLeft: spacing.md }}>
            <Text style={{ color: colors.text, fontWeight: "700", fontSize: 16 }}>Frank Oge</Text>
            <Text style={{ color: colors.textMuted, fontSize: 12 }}>frank@shopflow.demo</Text>
            <Text style={{ color: colors.textFaint, fontSize: 12 }}>+234 802 123 4567</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.lg }}>
          {SECTIONS.map(({ icon: Icon, label, route }) => (
            <TouchableOpacity key={label} style={[styles.row, { borderColor: colors.border }]} onPress={() => router.push(route as any)}>
              <Icon size={18} color={colors.text} />
              <Text style={{ flex: 1, marginLeft: spacing.md, color: colors.text, fontSize: 14 }}>{label}</Text>
              <ChevronRight size={16} color={colors.textFaint} />
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={[styles.row, { borderColor: colors.border }]} onPress={() => router.push("/admin")}>
            <ShieldCheck size={18} color={colors.accent} />
            <Text style={{ flex: 1, marginLeft: spacing.md, color: colors.accent, fontSize: 14, fontWeight: "600" }}>
              Demo Store Manager
            </Text>
            <ChevronRight size={16} color={colors.textFaint} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.row, { borderColor: colors.border }]}
            onPress={() => require("react-native").Alert.alert("About ShopFlow", "ShopFlow v1.0.0\nEverything you want. One place.")}
          >
            <Info size={18} color={colors.text} />
            <Text style={{ flex: 1, marginLeft: spacing.md, color: colors.text, fontSize: 14 }}>About ShopFlow</Text>
            <ChevronRight size={16} color={colors.textFaint} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  profileCard: { flexDirection: "row", alignItems: "center", padding: spacing.lg },
  avatar: { width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth
  }
});

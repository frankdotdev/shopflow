import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useThemeStore } from "@/store/themeStore";
import { resetDatabase } from "@/database/db";
import { spacing, typography, radius } from "@/constants/theme";

export default function SettingsScreen() {
  const { colors, mode, toggle } = useThemeStore();
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [currency, setCurrency] = useState("NGN (₦)");
  const [language, setLanguage] = useState("English");

  const Row = ({ label, value, onPress, right }: { label: string; value?: string; onPress?: () => void; right?: React.ReactNode }) => (
    <TouchableOpacity style={[styles.row, { borderColor: colors.border }]} onPress={onPress} disabled={!onPress}>
      <Text style={{ color: colors.text, fontSize: 14 }}>{label}</Text>
      {right ?? (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          {!!value && <Text style={{ color: colors.textMuted, fontSize: 13 }}>{value}</Text>}
          {onPress && <ChevronRight size={16} color={colors.textFaint} />}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[typography.title, { color: colors.text }]}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <Row
          label="Notifications"
          right={<Switch value={notificationsOn} onValueChange={setNotificationsOn} trackColor={{ true: colors.black }} />}
        />
        <Row
          label="Dark Mode"
          right={<Switch value={mode === "dark"} onValueChange={toggle} trackColor={{ true: colors.black }} />}
        />
        <Row label="Language" value={language} onPress={() => Alert.alert("Language", "English is the only demo language available.")} />
        <Row label="Currency" value={currency} onPress={() => Alert.alert("Currency", "NGN is used for all demo pricing.")} />
        <Row label="Privacy Policy" onPress={() => Alert.alert("Privacy Policy", "This is a local demo app. No data leaves your device.")} />
        <Row label="Terms of Service" onPress={() => Alert.alert("Terms of Service", "Demo terms for portfolio purposes only.")} />
        <Row label="About" onPress={() => Alert.alert("About ShopFlow", "ShopFlow v1.0.0 — Everything you want. One place.")} />

        <TouchableOpacity
          style={[styles.dangerBtn, { borderColor: colors.danger }]}
          onPress={() =>
            Alert.alert("Reset Demo Data", "This clears your cart, orders, wishlist and reseeds the catalog. Continue?", [
              { text: "Cancel", style: "cancel" },
              { text: "Reset", style: "destructive", onPress: () => resetDatabase() }
            ])
          }
        >
          <Text style={{ color: colors.danger, fontWeight: "700" }}>Reset Demo Data</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: spacing.lg },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  dangerBtn: {
    marginTop: spacing.xl,
    padding: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.lg,
    alignItems: "center"
  }
});

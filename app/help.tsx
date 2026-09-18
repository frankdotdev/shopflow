import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, ChevronDown, Mail } from "lucide-react-native";
import { useThemeStore } from "@/store/themeStore";
import { spacing, typography, radius } from "@/constants/theme";

const FAQS = [
  { q: "How do I track my order?", a: "Go to Profile > My Orders, tap any order to see its live tracking timeline." },
  { q: "Can I change my shipping address after ordering?", a: "This is a demo app — orders are simulated locally and addresses can't be changed after placement." },
  { q: "How do promo codes work?", a: "Enter SAVE10, WELCOME15, or SHOP20 at checkout to apply a demo discount to your order total." },
  { q: "Is my payment information real?", a: "No. ShopFlow is a local portfolio demo — no real payments are processed and no card details are stored." },
  { q: "How do I return an item?", a: "This demo does not include returns processing, but a real ShopFlow deployment would support this from Order Details." }
];

export default function HelpScreen() {
  const { colors } = useThemeStore();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[typography.title, { color: colors.text }]}>Help & Support</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.sm }}>
        <Text style={[typography.heading, { color: colors.text, marginBottom: spacing.sm }]}>Frequently Asked Questions</Text>
        {FAQS.map((faq, i) => (
          <TouchableOpacity
            key={faq.q}
            style={[styles.card, { borderColor: colors.border }]}
            onPress={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <View style={styles.rowBetween}>
              <Text style={{ color: colors.text, fontWeight: "600", fontSize: 13, flex: 1 }}>{faq.q}</Text>
              <ChevronDown size={16} color={colors.textFaint} style={{ transform: [{ rotate: openIndex === i ? "180deg" : "0deg" }] }} />
            </View>
            {openIndex === i && <Text style={{ color: colors.textMuted, fontSize: 13, marginTop: spacing.sm }}>{faq.a}</Text>}
          </TouchableOpacity>
        ))}

        <View style={[styles.contactCard, { borderColor: colors.border, backgroundColor: colors.bgAlt }]}>
          <Mail size={20} color={colors.text} />
          <Text style={{ color: colors.text, fontWeight: "700", marginTop: spacing.sm }}>Still need help?</Text>
          <Text style={{ color: colors.textMuted, fontSize: 12, textAlign: "center", marginTop: 4 }}>
            support@shopflow.demo — this is a portfolio demo contact only.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: spacing.lg },
  card: { borderWidth: StyleSheet.hairlineWidth, borderRadius: radius.lg, padding: spacing.md },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  contactCard: { alignItems: "center", padding: spacing.lg, borderWidth: StyleSheet.hairlineWidth, borderRadius: radius.lg, marginTop: spacing.lg }
});

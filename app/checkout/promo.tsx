import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Tag } from "lucide-react-native";
import { useThemeStore } from "@/store/themeStore";
import { useCheckoutStore } from "@/store/checkoutStore";
import { PROMO_CODES } from "@/data/reviewSeed";
import StepHeader from "@/components/StepHeader";
import Button from "@/components/Button";
import { spacing, radius } from "@/constants/theme";

export default function PromoScreen() {
  const { colors } = useThemeStore();
  const { promoCode, setPromo } = useCheckoutStore();
  const [code, setCode] = useState(promoCode ?? "");
  const [error, setError] = useState<string | null>(null);
  const [applied, setApplied] = useState<{ percent: number; label: string } | null>(
    promoCode ? PROMO_CODES[promoCode] : null
  );

  const onApply = () => {
    const upper = code.trim().toUpperCase();
    const found = PROMO_CODES[upper];
    if (found) {
      setPromo(upper, found.percent);
      setApplied(found);
      setError(null);
    } else {
      setError("This promo code is invalid or has expired.");
      setApplied(null);
      setPromo(null, 0);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <StepHeader title="Add Promo" step={3} total={5} />
      <View style={{ padding: spacing.lg }}>
        <View style={[styles.inputRow, { borderColor: colors.border }]}>
          <Tag size={18} color={colors.textFaint} />
          <TextInput
            value={code}
            onChangeText={setCode}
            autoCapitalize="characters"
            placeholder="Enter promo code"
            placeholderTextColor={colors.textFaint}
            style={[styles.input, { color: colors.text }]}
          />
          <TouchableOpacity onPress={onApply}>
            <Text style={{ color: colors.accent, fontWeight: "700" }}>Apply</Text>
          </TouchableOpacity>
        </View>
        {error && <Text style={{ color: colors.danger, marginTop: spacing.sm, fontSize: 12 }}>{error}</Text>}
        {applied && (
          <Text style={{ color: colors.success, marginTop: spacing.sm, fontSize: 12, fontWeight: "600" }}>
            "{code.toUpperCase()}" applied — {applied.label}
          </Text>
        )}

        <Text style={{ color: colors.textMuted, marginTop: spacing.xl, fontSize: 12 }}>Try: SAVE10, WELCOME15, SHOP20</Text>
      </View>

      <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.bg }]}>
        <Button
          label={applied ? "Continue" : "Skip"}
          variant={applied ? "primary" : "outline"}
          onPress={() => router.push("/checkout/payment")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    height: 50
  },
  input: { flex: 1, fontSize: 14 },
  footer: { position: "absolute", bottom: 0, left: 0, right: 0, padding: spacing.lg, borderTopWidth: StyleSheet.hairlineWidth }
});

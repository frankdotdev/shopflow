import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { CreditCard, Wallet, Smartphone, Building2, Banknote, Check } from "lucide-react-native";
import { useThemeStore } from "@/store/themeStore";
import { useCheckoutStore } from "@/store/checkoutStore";
import { PAYMENT_METHODS } from "@/data/reviewSeed";
import StepHeader from "@/components/StepHeader";
import Button from "@/components/Button";
import { spacing, radius } from "@/constants/theme";

const ICONS: Record<string, any> = {
  card: CreditCard,
  paypal: Wallet,
  google_pay: Smartphone,
  apple_pay: Smartphone,
  bank_transfer: Building2,
  cod: Banknote
};

export default function PaymentScreen() {
  const { colors } = useThemeStore();
  const { paymentMethodId, setPaymentMethodId } = useCheckoutStore();
  const [selected, setSelected] = useState(paymentMethodId ?? PAYMENT_METHODS[0].id);

  const onContinue = () => {
    setPaymentMethodId(selected);
    router.push("/checkout");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <StepHeader title="Payment Methods" step={4} total={5} />
      <Text style={{ color: colors.textMuted, paddingHorizontal: spacing.lg, marginBottom: spacing.md, fontSize: 13 }}>
        Select the payment method you want to use
      </Text>
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.md }}>
        {PAYMENT_METHODS.map((m) => {
          const Icon = ICONS[m.id];
          const isSelected = selected === m.id;
          return (
            <TouchableOpacity
              key={m.id}
              onPress={() => setSelected(m.id)}
              style={[styles.card, { borderColor: isSelected ? colors.black : colors.border }]}
            >
              <Icon size={20} color={colors.text} />
              <Text style={{ flex: 1, marginLeft: spacing.md, color: colors.text, fontWeight: "600" }}>{m.name}</Text>
              {isSelected && <Check size={18} color={colors.black} />}
            </TouchableOpacity>
          );
        })}
        <Text style={{ color: colors.textFaint, fontSize: 12, marginTop: spacing.sm }}>
          Demo payment — no real charge will be made.
        </Text>
      </ScrollView>
      <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.bg }]}>
        <Button label="Review Order" onPress={onContinue} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.lg
  },
  footer: { padding: spacing.lg, borderTopWidth: StyleSheet.hairlineWidth }
});

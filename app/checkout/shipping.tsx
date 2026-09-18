import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Check } from "lucide-react-native";
import { useThemeStore } from "@/store/themeStore";
import { useCheckoutStore } from "@/store/checkoutStore";
import { SHIPPING_METHODS } from "@/data/reviewSeed";
import StepHeader from "@/components/StepHeader";
import Button from "@/components/Button";
import { formatNaira } from "@/utils/currency";
import { spacing, radius } from "@/constants/theme";

export default function ShippingScreen() {
  const { colors } = useThemeStore();
  const { shippingMethodId, setShippingMethodId } = useCheckoutStore();
  const [selected, setSelected] = useState(shippingMethodId ?? SHIPPING_METHODS[0].id);

  const onContinue = () => {
    setShippingMethodId(selected);
    router.push("/checkout/promo");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <StepHeader title="Choose Shipping" step={2} total={5} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}>
        {SHIPPING_METHODS.map((m) => {
          const isSelected = selected === m.id;
          return (
            <TouchableOpacity
              key={m.id}
              onPress={() => setSelected(m.id)}
              style={[styles.card, { borderColor: isSelected ? colors.black : colors.border }]}
            >
              <View>
                <Text style={{ color: colors.text, fontWeight: "700" }}>{m.name}</Text>
                <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>Estimated arrival: {m.days}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                <Text style={{ color: colors.text, fontWeight: "700" }}>{formatNaira(m.price)}</Text>
                {isSelected && <Check size={18} color={colors.black} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.bg }]}>
        <Button label="Continue" onPress={onContinue} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.lg
  },
  footer: { padding: spacing.lg, borderTopWidth: StyleSheet.hairlineWidth }
});

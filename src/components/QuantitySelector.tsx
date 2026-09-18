import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Minus, Plus } from "lucide-react-native";
import { useThemeStore } from "@/store/themeStore";
import { radius } from "@/constants/theme";

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  const { colors } = useThemeStore();
  return (
    <View style={[styles.row, { borderColor: colors.border }]}>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => onChange(Math.max(min, value - 1))}
        hitSlop={8}
      >
        <Minus size={16} color={colors.text} />
      </TouchableOpacity>
      <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => onChange(Math.min(max, value + 1))}
        hitSlop={8}
      >
        <Plus size={16} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.pill,
    paddingHorizontal: 4
  },
  btn: { padding: 10 },
  value: { minWidth: 24, textAlign: "center", fontWeight: "700", fontSize: 14 }
});

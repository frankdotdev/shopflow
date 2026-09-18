import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, StyleSheet } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Home, Briefcase, MapPin, Plus, Check } from "lucide-react-native";
import { useThemeStore } from "@/store/themeStore";
import { useAddressStore } from "@/store/addressStore";
import { useCheckoutStore } from "@/store/checkoutStore";
import StepHeader from "@/components/StepHeader";
import Button from "@/components/Button";
import { uid } from "@/utils/currency";
import { Address } from "@/types";
import { spacing, radius } from "@/constants/theme";

export default function AddressScreen() {
  const { colors } = useThemeStore();
  const { addresses, save, remove } = useAddressStore();
  const { address, setAddress } = useCheckoutStore();
  const [selectedId, setSelectedId] = useState<string | undefined>(address?.id ?? addresses.find((a) => a.isDefault)?.id);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", street: "", city: "", state: "", label: "Home" });

  const iconFor = (label?: string) => {
    if (label === "Office") return Briefcase;
    if (label === "Home") return Home;
    return MapPin;
  };

  const onContinue = () => {
    const chosen = addresses.find((a) => a.id === selectedId);
    if (!chosen) return;
    setAddress(chosen);
    router.push("/checkout/shipping");
  };

  const onSaveNew = async () => {
    if (!form.name || !form.street || !form.city) return;
    const newAddress: Address = {
      id: uid("addr"),
      name: form.name,
      phone: form.phone,
      street: form.street,
      city: form.city,
      state: form.state || form.city,
      country: "Nigeria",
      label: form.label,
      isDefault: addresses.length === 0
    };
    await save(newAddress);
    setSelectedId(newAddress.id);
    setModalVisible(false);
    setForm({ name: "", phone: "", street: "", city: "", state: "", label: "Home" });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <StepHeader title="Shipping Address" step={1} total={5} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.md, paddingBottom: 120 }}>
        {addresses.map((a) => {
          const Icon = iconFor(a.label);
          const selected = selectedId === a.id;
          return (
            <TouchableOpacity
              key={a.id}
              onPress={() => setSelectedId(a.id)}
              style={[styles.card, { borderColor: selected ? colors.black : colors.border }]}
            >
              <Icon size={20} color={colors.text} />
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text style={{ color: colors.text, fontWeight: "700" }}>{a.label || "Address"}</Text>
                <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>
                  {a.street}, {a.city}, {a.state}
                </Text>
                <Text style={{ color: colors.textFaint, fontSize: 12 }}>{a.phone}</Text>
              </View>
              {selected && <Check size={18} color={colors.black} />}
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity style={[styles.addBtn, { borderColor: colors.border }]} onPress={() => setModalVisible(true)}>
          <Plus size={18} color={colors.text} />
          <Text style={{ color: colors.text, fontWeight: "600" }}>Add New Address</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.bg }]}>
        <Button label="Continue to Shipping" onPress={onContinue} disabled={!selectedId} />
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
            <Text style={{ color: colors.text, fontWeight: "700", fontSize: 16, marginBottom: spacing.md }}>New Address</Text>
            {(["name", "phone", "street", "city", "state"] as const).map((field) => (
              <TextInput
                key={field}
                placeholder={field[0].toUpperCase() + field.slice(1)}
                placeholderTextColor={colors.textFaint}
                value={(form as any)[field]}
                onChangeText={(v) => setForm((f) => ({ ...f, [field]: v }))}
                style={[styles.input, { borderColor: colors.border, color: colors.text }]}
              />
            ))}
            <View style={{ flexDirection: "row", gap: spacing.md, marginTop: spacing.md }}>
              <Button label="Cancel" variant="outline" style={{ flex: 1 }} onPress={() => setModalVisible(false)} />
              <Button label="Save" style={{ flex: 1 }} onPress={onSaveNew} />
            </View>
          </View>
        </View>
      </Modal>
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
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    padding: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.lg,
    borderStyle: "dashed"
  },
  footer: { position: "absolute", bottom: 0, left: 0, right: 0, padding: spacing.lg, borderTopWidth: StyleSheet.hairlineWidth },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modalCard: { padding: spacing.lg, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl },
  input: { borderWidth: StyleSheet.hairlineWidth, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm }
});

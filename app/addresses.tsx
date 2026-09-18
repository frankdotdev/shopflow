import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, StyleSheet } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Plus, Star, Trash2, Pencil } from "lucide-react-native";
import { useThemeStore } from "@/store/themeStore";
import { useAddressStore } from "@/store/addressStore";
import EmptyState from "@/components/EmptyState";
import Button from "@/components/Button";
import { uid } from "@/utils/currency";
import { Address } from "@/types";
import { spacing, radius, typography } from "@/constants/theme";

export default function AddressesScreen() {
  const { colors } = useThemeStore();
  const { addresses, save, remove, setDefault } = useAddressStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", street: "", city: "", state: "", label: "Home" });

  const openNew = () => {
    setEditing(null);
    setForm({ name: "", phone: "", street: "", city: "", state: "", label: "Home" });
    setModalVisible(true);
  };

  const openEdit = (a: Address) => {
    setEditing(a);
    setForm({ name: a.name, phone: a.phone, street: a.street, city: a.city, state: a.state, label: a.label || "Home" });
    setModalVisible(true);
  };

  const onSave = async () => {
    if (!form.name || !form.street || !form.city) return;
    await save({
      id: editing?.id ?? uid("addr"),
      name: form.name,
      phone: form.phone,
      street: form.street,
      city: form.city,
      state: form.state || form.city,
      country: "Nigeria",
      label: form.label,
      isDefault: editing?.isDefault ?? addresses.length === 0
    });
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[typography.title, { color: colors.text }]}>Saved Addresses</Text>
        <TouchableOpacity onPress={openNew} hitSlop={8}>
          <Plus size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      {addresses.length === 0 ? (
        <EmptyState title="No addresses saved" subtitle="Add an address to speed up checkout." actionLabel="Add Address" onAction={openNew} />
      ) : (
        <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}>
          {addresses.map((a) => (
            <View key={a.id} style={[styles.card, { borderColor: colors.border }]}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Text style={{ color: colors.text, fontWeight: "700" }}>{a.label || "Address"}</Text>
                  {a.isDefault && <Text style={{ color: colors.accent, fontSize: 11, fontWeight: "700" }}>DEFAULT</Text>}
                </View>
                <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>{a.name} · {a.phone}</Text>
                <Text style={{ color: colors.textMuted, fontSize: 12 }}>{a.street}, {a.city}, {a.state}</Text>
                {!a.isDefault && (
                  <TouchableOpacity onPress={() => setDefault(a.id)}>
                    <Text style={{ color: colors.accent, fontSize: 12, marginTop: spacing.xs }}>Set as default</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={{ gap: spacing.md, alignItems: "center" }}>
                <TouchableOpacity onPress={() => openEdit(a)} hitSlop={8}>
                  <Pencil size={16} color={colors.textMuted} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => remove(a.id)} hitSlop={8}>
                  <Trash2 size={16} color={colors.danger} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
            <Text style={{ color: colors.text, fontWeight: "700", fontSize: 16, marginBottom: spacing.md }}>
              {editing ? "Edit Address" : "New Address"}
            </Text>
            {(["name", "phone", "street", "city", "state", "label"] as const).map((field) => (
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
              <Button label="Save" style={{ flex: 1 }} onPress={onSave} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: spacing.lg },
  card: { flexDirection: "row", borderWidth: StyleSheet.hairlineWidth, borderRadius: radius.lg, padding: spacing.md },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modalCard: { padding: spacing.lg, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl },
  input: { borderWidth: StyleSheet.hairlineWidth, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm }
});

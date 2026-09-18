import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, TextInput, Modal, StyleSheet, Alert } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Plus, Pencil, Trash2 } from "lucide-react-native";
import { useThemeStore } from "@/store/themeStore";
import { useAllProducts } from "@/hooks/useProducts";
import { deleteProduct, upsertProduct } from "@/database/repositories";
import { formatNaira, uid } from "@/utils/currency";
import Button from "@/components/Button";
import { spacing, typography, radius } from "@/constants/theme";
import { Product } from "@/types";

export default function AdminProductsScreen() {
  const { colors } = useThemeStore();
  const { products, refresh } = useAllProducts();
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: "", price: "", stock: "", brand: "" });

  const openEdit = (p?: Product) => {
    setEditing(p ?? null);
    setForm({
      name: p?.name ?? "",
      price: p ? String(p.price) : "",
      stock: p ? String(p.stock) : "",
      brand: p?.brand ?? ""
    });
    setModalVisible(true);
  };

  const onSave = async () => {
    if (!form.name || !form.price) return;
    const base: Product = editing ?? {
      id: uid("p"),
      name: "",
      slug: "",
      category: "electronics",
      subcategory: "Headphones",
      description: "Added via Demo Store Manager.",
      price: 0,
      currency: "NGN",
      rating: 4.5,
      reviewCount: 0,
      stock: 0,
      brand: "",
      images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&q=80"],
      colors: ["#1A1A18"],
      sizes: [],
      specifications: [],
      tags: [],
      isFeatured: false,
      isPopular: false,
      isNew: true,
      isBestSeller: false
    };
    const updated: Product = {
      ...base,
      name: form.name,
      slug: form.name.toLowerCase().replace(/\s+/g, "-"),
      price: Number(form.price) || 0,
      stock: Number(form.stock) || 0,
      brand: form.brand || base.brand
    };
    await upsertProduct(updated);
    await refresh();
    setModalVisible(false);
  };

  const onDelete = (p: Product) => {
    Alert.alert("Delete product", `Remove "${p.name}" from the catalog?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteProduct(p.id);
          await refresh();
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[typography.title, { color: colors.text }]}>Products</Text>
        <TouchableOpacity onPress={() => openEdit()} hitSlop={8}>
          <Plus size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.sm }}
        renderItem={({ item }) => (
          <View style={[styles.row, { borderColor: colors.border }]}>
            <Image source={{ uri: item.images[0] }} style={styles.thumb} contentFit="cover" />
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <Text numberOfLines={1} style={{ color: colors.text, fontWeight: "600", fontSize: 13 }}>{item.name}</Text>
              <Text style={{ color: colors.textMuted, fontSize: 12 }}>{formatNaira(item.price)} · Stock {item.stock}</Text>
            </View>
            <TouchableOpacity onPress={() => openEdit(item)} hitSlop={8} style={{ marginRight: spacing.md }}>
              <Pencil size={16} color={colors.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete(item)} hitSlop={8}>
              <Trash2 size={16} color={colors.danger} />
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
            <Text style={{ color: colors.text, fontWeight: "700", fontSize: 16, marginBottom: spacing.md }}>
              {editing ? "Edit Product" : "Add Product"}
            </Text>
            <TextInput
              placeholder="Product name"
              placeholderTextColor={colors.textFaint}
              value={form.name}
              onChangeText={(v) => setForm((f) => ({ ...f, name: v }))}
              style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            />
            <TextInput
              placeholder="Brand"
              placeholderTextColor={colors.textFaint}
              value={form.brand}
              onChangeText={(v) => setForm((f) => ({ ...f, brand: v }))}
              style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            />
            <TextInput
              placeholder="Price (NGN)"
              placeholderTextColor={colors.textFaint}
              value={form.price}
              onChangeText={(v) => setForm((f) => ({ ...f, price: v }))}
              keyboardType="numeric"
              style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            />
            <TextInput
              placeholder="Stock quantity"
              placeholderTextColor={colors.textFaint}
              value={form.stock}
              onChangeText={(v) => setForm((f) => ({ ...f, stock: v }))}
              keyboardType="numeric"
              style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            />
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
  row: { flexDirection: "row", alignItems: "center", padding: spacing.sm, borderWidth: StyleSheet.hairlineWidth, borderRadius: radius.lg },
  thumb: { width: 48, height: 48, borderRadius: radius.sm },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modalCard: { padding: spacing.lg, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl },
  input: { borderWidth: StyleSheet.hairlineWidth, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm }
});

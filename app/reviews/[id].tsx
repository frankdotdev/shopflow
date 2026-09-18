import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Star } from "lucide-react-native";
import { useThemeStore } from "@/store/themeStore";
import { useAllProducts } from "@/hooks/useProducts";
import { fetchReviewsForProduct, addReview } from "@/database/repositories";
import Button from "@/components/Button";
import { uid } from "@/utils/currency";
import { spacing, typography, radius } from "@/constants/theme";
import { Review } from "@/types";

export default function ReviewsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useThemeStore();
  const { products } = useAllProducts();
  const product = products.find((p) => p.id === id);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");

  const load = () => id && fetchReviewsForProduct(id).then(setReviews);
  useEffect(() => { load(); }, [id]);

  const distribution = useMemo(() => {
    const dist = [0, 0, 0, 0, 0];
    reviews.forEach((r) => { dist[Math.min(5, Math.max(1, r.rating)) - 1]++; });
    return dist.reverse();
  }, [reviews]);

  const onSubmit = async () => {
    if (!comment.trim() || !id) return;
    await addReview({
      id: uid("rev"),
      productId: id,
      customerName: name.trim() || "Anonymous",
      rating,
      comment: comment.trim(),
      createdAt: new Date().toISOString()
    });
    setComment("");
    setName("");
    setRating(5);
    setShowForm(false);
    load();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[typography.title, { color: colors.text }]}>Reviews</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.md, paddingBottom: 120 }}>
        {product && (
          <View style={styles.summaryRow}>
            <Text style={{ fontSize: 40, fontWeight: "800", color: colors.text }}>{product.rating.toFixed(1)}</Text>
            <View style={{ marginLeft: spacing.lg, flex: 1 }}>
              <View style={{ flexDirection: "row" }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={14} color={colors.accent} fill={s <= Math.round(product.rating) ? colors.accent : "transparent"} />
                ))}
              </View>
              <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>{reviews.length} reviews</Text>
              {distribution.map((count, i) => (
                <View key={i} style={styles.distRow}>
                  <Text style={{ color: colors.textFaint, fontSize: 10, width: 12 }}>{5 - i}</Text>
                  <View style={[styles.distTrack, { backgroundColor: colors.border }]}>
                    <View
                      style={[
                        styles.distFill,
                        { backgroundColor: colors.accent, width: `${reviews.length ? (count / reviews.length) * 100 : 0}%` }
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        <Button label={showForm ? "Cancel" : "Write a Review"} variant="outline" onPress={() => setShowForm((v) => !v)} />

        {showForm && (
          <View style={[styles.formCard, { borderColor: colors.border }]}>
            <View style={{ flexDirection: "row", marginBottom: spacing.sm }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <TouchableOpacity key={s} onPress={() => setRating(s)} hitSlop={4}>
                  <Star size={24} color={colors.accent} fill={s <= rating ? colors.accent : "transparent"} />
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              placeholder="Your name (optional)"
              placeholderTextColor={colors.textFaint}
              value={name}
              onChangeText={setName}
              style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            />
            <TextInput
              placeholder="Share your thoughts about this product..."
              placeholderTextColor={colors.textFaint}
              value={comment}
              onChangeText={setComment}
              multiline
              style={[styles.input, { borderColor: colors.border, color: colors.text, height: 90, textAlignVertical: "top" }]}
            />
            <Button label="Submit Review" onPress={onSubmit} />
          </View>
        )}

        {reviews.map((r) => (
          <View key={r.id} style={[styles.reviewCard, { borderColor: colors.border }]}>
            <View style={styles.reviewHeader}>
              <View style={[styles.avatar, { backgroundColor: colors.bgAlt }]}>
                <Text style={{ color: colors.text, fontWeight: "700" }}>{r.customerName[0]}</Text>
              </View>
              <View style={{ marginLeft: spacing.sm, flex: 1 }}>
                <Text style={{ color: colors.text, fontWeight: "700", fontSize: 13 }}>{r.customerName}</Text>
                <View style={{ flexDirection: "row" }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={10} color={colors.accent} fill={s <= r.rating ? colors.accent : "transparent"} />
                  ))}
                </View>
              </View>
              <Text style={{ color: colors.textFaint, fontSize: 11 }}>{new Date(r.createdAt).toLocaleDateString()}</Text>
            </View>
            <Text style={{ color: colors.textMuted, marginTop: spacing.sm, fontSize: 13, lineHeight: 18 }}>{r.comment}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: spacing.lg },
  summaryRow: { flexDirection: "row", alignItems: "flex-start" },
  distRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: 2 },
  distTrack: { flex: 1, height: 4, borderRadius: 2, overflow: "hidden" },
  distFill: { height: 4 },
  formCard: { borderWidth: StyleSheet.hairlineWidth, borderRadius: radius.lg, padding: spacing.md, gap: spacing.sm },
  input: { borderWidth: StyleSheet.hairlineWidth, borderRadius: radius.md, padding: spacing.md },
  reviewCard: { borderWidth: StyleSheet.hairlineWidth, borderRadius: radius.lg, padding: spacing.md },
  reviewHeader: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" }
});

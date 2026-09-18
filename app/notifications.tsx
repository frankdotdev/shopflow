import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Bell, Package, Tag, Info } from "lucide-react-native";
import { useThemeStore } from "@/store/themeStore";
import { useNotificationStore } from "@/store/notificationStore";
import EmptyState from "@/components/EmptyState";
import { spacing, typography, radius } from "@/constants/theme";

const ICONS: Record<string, any> = { order: Package, promo: Tag, system: Info };

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationsScreen() {
  const { colors } = useThemeStore();
  const { notifications, markRead, markAllRead } = useNotificationStore();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[typography.title, { color: colors.text }]}>Notifications</Text>
        <TouchableOpacity onPress={markAllRead} hitSlop={8}>
          <Text style={{ color: colors.accent, fontSize: 12, fontWeight: "600" }}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      {notifications.length === 0 ? (
        <EmptyState icon={<Bell size={40} color={colors.textFaint} />} title="No notifications" subtitle="You're all caught up." />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(n) => n.id}
          contentContainerStyle={{ padding: spacing.lg, gap: spacing.sm }}
          renderItem={({ item }) => {
            const Icon = ICONS[item.type] ?? Info;
            return (
              <TouchableOpacity
                onPress={() => markRead(item.id)}
                style={[
                  styles.card,
                  { borderColor: colors.border, backgroundColor: item.read ? colors.bg : colors.bgAlt }
                ]}
              >
                <View style={[styles.iconWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Icon size={16} color={colors.text} />
                </View>
                <View style={{ flex: 1, marginLeft: spacing.sm }}>
                  <Text style={{ color: colors.text, fontWeight: item.read ? "500" : "700", fontSize: 13 }}>{item.title}</Text>
                  <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>{item.body}</Text>
                  <Text style={{ color: colors.textFaint, fontSize: 11, marginTop: 4 }}>{timeAgo(item.createdAt)}</Text>
                </View>
                {!item.read && <View style={[styles.dot, { backgroundColor: colors.accent }]} />}
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: spacing.lg },
  card: { flexDirection: "row", alignItems: "flex-start", padding: spacing.md, borderWidth: StyleSheet.hairlineWidth, borderRadius: radius.lg },
  iconWrap: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center", borderWidth: StyleSheet.hairlineWidth },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 4 }
});

import React, { useEffect, useState, useCallback } from "react";
import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { getDb } from "@/database/db";
import { useThemeStore } from "@/store/themeStore";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAddressStore } from "@/store/addressStore";
import { useOrderStore } from "@/store/orderStore";
import { useNotificationStore } from "@/store/notificationStore";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const colors = useThemeStore((s) => s.colors);

  useEffect(() => {
    (async () => {
      await getDb();
      await Promise.all([
        useCartStore.getState().load(),
        useWishlistStore.getState().load(),
        useAddressStore.getState().load(),
        useOrderStore.getState().load(),
        useNotificationStore.getState().load()
      ]);
      setReady(true);
      await SplashScreen.hideAsync();
    })();
  }, []);

  if (!ready) {
    return <View style={{ flex: 1, backgroundColor: "#FFFFFF" }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View style={[styles.flex, { backgroundColor: colors.bg }]}>
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="product/[id]" options={{ presentation: "card" }} />
            <Stack.Screen name="category/[id]" />
            <Stack.Screen name="filters" options={{ presentation: "modal" }} />
            <Stack.Screen name="wishlist" />
            <Stack.Screen name="checkout" />
            <Stack.Screen name="orders" />
            <Stack.Screen name="reviews/[id]" />
            <Stack.Screen name="addresses" />
            <Stack.Screen name="notifications" />
            <Stack.Screen name="settings" />
            <Stack.Screen name="help" />
            <Stack.Screen name="admin" />
          </Stack>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });

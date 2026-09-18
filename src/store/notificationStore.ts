import { create } from "zustand";
import { AppNotification } from "@/types";
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from "@/database/repositories";

interface NotificationState {
  notifications: AppNotification[];
  load: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  unreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  load: async () => set({ notifications: await fetchNotifications() }),
  markRead: async (id) => {
    await markNotificationRead(id);
    set({ notifications: get().notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) });
  },
  markAllRead: async () => {
    await markAllNotificationsRead();
    set({ notifications: get().notifications.map((n) => ({ ...n, read: true })) });
  },
  unreadCount: () => get().notifications.filter((n) => !n.read).length
}));

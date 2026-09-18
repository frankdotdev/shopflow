import { create } from "zustand";
import { Order } from "@/types";
import { fetchOrders, createOrder, updateOrder as updateOrderRepo } from "@/database/repositories";

interface OrderState {
  orders: Order[];
  load: () => Promise<void>;
  place: (order: Order) => Promise<void>;
  update: (order: Order) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  load: async () => set({ orders: await fetchOrders() }),
  place: async (order) => {
    await createOrder(order);
    set({ orders: [order, ...get().orders] });
  },
  update: async (order) => {
    await updateOrderRepo(order);
    set({ orders: get().orders.map((o) => (o.id === order.id ? order : o)) });
  }
}));

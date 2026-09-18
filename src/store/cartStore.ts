import { create } from "zustand";
import { CartItem, Product } from "@/types";
import { fetchCart, upsertCartItem, removeCartItem, clearCart } from "@/database/repositories";
import { uid } from "@/utils/currency";

interface CartState {
  items: CartItem[];
  loaded: boolean;
  load: () => Promise<void>;
  addToCart: (product: Product, quantity: number, color?: string, size?: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clear: () => Promise<void>;
  totalCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loaded: false,
  load: async () => {
    const items = await fetchCart();
    set({ items, loaded: true });
  },
  addToCart: async (product, quantity, color, size) => {
    const existing = get().items.find(
      (i) => i.productId === product.id && i.selectedColor === color && i.selectedSize === size
    );
    if (existing) {
      const updated = { ...existing, quantity: existing.quantity + quantity };
      await upsertCartItem(updated);
      set({ items: get().items.map((i) => (i.id === updated.id ? updated : i)) });
    } else {
      const item: CartItem = {
        id: uid("cart"),
        productId: product.id,
        quantity,
        selectedColor: color,
        selectedSize: size
      };
      await upsertCartItem(item);
      set({ items: [...get().items, item] });
    }
  },
  updateQuantity: async (id, quantity) => {
    if (quantity <= 0) {
      await get().removeItem(id);
      return;
    }
    const item = get().items.find((i) => i.id === id);
    if (!item) return;
    const updated = { ...item, quantity };
    await upsertCartItem(updated);
    set({ items: get().items.map((i) => (i.id === id ? updated : i)) });
  },
  removeItem: async (id) => {
    await removeCartItem(id);
    set({ items: get().items.filter((i) => i.id !== id) });
  },
  clear: async () => {
    await clearCart();
    set({ items: [] });
  },
  totalCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0)
}));

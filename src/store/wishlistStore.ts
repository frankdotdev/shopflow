import { create } from "zustand";
import { fetchWishlist, toggleWishlist } from "@/database/repositories";

interface WishlistState {
  productIds: string[];
  loaded: boolean;
  load: () => Promise<void>;
  toggle: (productId: string) => Promise<boolean>;
  isWishlisted: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  productIds: [],
  loaded: false,
  load: async () => {
    const productIds = await fetchWishlist();
    set({ productIds, loaded: true });
  },
  toggle: async (productId) => {
    const added = await toggleWishlist(productId);
    if (added) {
      set({ productIds: [...get().productIds, productId] });
    } else {
      set({ productIds: get().productIds.filter((id) => id !== productId) });
    }
    return added;
  },
  isWishlisted: (productId) => get().productIds.includes(productId)
}));

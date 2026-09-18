import { create } from "zustand";
import { Filters, SortOption } from "@/types";

export const DEFAULT_FILTERS: Filters = {
  categories: [],
  priceMin: 0,
  priceMax: 1200000,
  minRating: 0,
  brands: [],
  sizes: [],
  colors: [],
  inStockOnly: false,
  discountedOnly: false
};

interface FilterState {
  filters: Filters;
  sort: SortOption;
  setFilters: (f: Filters) => void;
  reset: () => void;
  setSort: (s: SortOption) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  filters: DEFAULT_FILTERS,
  sort: "recommended",
  setFilters: (f) => set({ filters: f }),
  reset: () => set({ filters: DEFAULT_FILTERS }),
  setSort: (s) => set({ sort: s })
}));

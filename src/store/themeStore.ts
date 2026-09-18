import { create } from "zustand";
import { lightColors, darkColors, ThemeColors } from "@/constants/colors";

interface ThemeState {
  mode: "light" | "dark";
  colors: ThemeColors;
  toggle: () => void;
  setMode: (m: "light" | "dark") => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: "light",
  colors: lightColors,
  toggle: () => {
    const next = get().mode === "light" ? "dark" : "light";
    set({ mode: next, colors: next === "light" ? lightColors : darkColors });
  },
  setMode: (m) => set({ mode: m, colors: m === "light" ? lightColors : darkColors })
}));

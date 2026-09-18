import { create } from "zustand";
import { Address } from "@/types";

interface CheckoutState {
  address: Address | null;
  shippingMethodId: string | null;
  promoCode: string | null;
  discountPercent: number;
  paymentMethodId: string | null;
  setAddress: (a: Address) => void;
  setShippingMethodId: (id: string) => void;
  setPromo: (code: string | null, percent: number) => void;
  setPaymentMethodId: (id: string) => void;
  reset: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  address: null,
  shippingMethodId: null,
  promoCode: null,
  discountPercent: 0,
  paymentMethodId: null,
  setAddress: (a) => set({ address: a }),
  setShippingMethodId: (id) => set({ shippingMethodId: id }),
  setPromo: (code, percent) => set({ promoCode: code, discountPercent: percent }),
  setPaymentMethodId: (id) => set({ paymentMethodId: id }),
  reset: () => set({ address: null, shippingMethodId: null, promoCode: null, discountPercent: 0, paymentMethodId: null })
}));

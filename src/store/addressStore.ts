import { create } from "zustand";
import { Address } from "@/types";
import { fetchAddresses, saveAddress, deleteAddress, setDefaultAddress } from "@/database/repositories";

interface AddressState {
  addresses: Address[];
  load: () => Promise<void>;
  save: (a: Address) => Promise<void>;
  remove: (id: string) => Promise<void>;
  setDefault: (id: string) => Promise<void>;
}

export const useAddressStore = create<AddressState>((set, get) => ({
  addresses: [],
  load: async () => set({ addresses: await fetchAddresses() }),
  save: async (a) => {
    await saveAddress(a);
    set({ addresses: await fetchAddresses() });
  },
  remove: async (id) => {
    await deleteAddress(id);
    set({ addresses: await fetchAddresses() });
  },
  setDefault: async (id) => {
    await setDefaultAddress(id);
    set({ addresses: await fetchAddresses() });
  }
}));

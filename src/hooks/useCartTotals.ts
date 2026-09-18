import { useMemo } from "react";
import { CartItem, Product } from "@/types";

export function useCartTotals(items: CartItem[], products: Product[], discountPercent = 0, shippingCost = 0) {
  return useMemo(() => {
    const lineItems = items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return { item, product };
    }).filter((li) => li.product);

    const subtotal = lineItems.reduce((sum, li) => sum + (li.product!.price * li.item.quantity), 0);
    const discount = Math.round(subtotal * (discountPercent / 100));
    const shipping = items.length > 0 ? shippingCost : 0;
    const total = Math.max(0, subtotal - discount + shipping);
    return { lineItems, subtotal, discount, shipping, total };
  }, [items, products, discountPercent, shippingCost]);
}

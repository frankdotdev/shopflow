export function formatNaira(amount: number): string {
  return "₦" + Math.round(amount).toLocaleString("en-NG");
}

export function computeDiscountPercent(price: number, originalPrice?: number): number {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export function generateOrderNumber(): string {
  const n = Math.floor(10000 + Math.random() * 89999);
  return `SF-${n}`;
}

export function uid(prefix = "id"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function estimatedDeliveryLabel(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-NG", { weekday: "short", month: "short", day: "numeric" });
}

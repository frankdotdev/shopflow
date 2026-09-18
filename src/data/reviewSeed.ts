export const REVIEWER_NAMES = [
  "Chidinma A.", "Tunde O.", "Amaka N.", "Kelechi U.", "Fatima B.", "Ngozi E.",
  "Emeka I.", "Bisi F.", "Yusuf M.", "Chinwe O.", "Segun A.", "Ijeoma K.",
  "Blessing T.", "David O.", "Halima S.", "Obinna C.", "Grace M.", "Femi A."
];

export const REVIEW_COMMENTS = [
  "Exactly as described, arrived in great condition and fits perfectly.",
  "Good quality for the price. Would recommend to a friend.",
  "Delivery was quick and packaging was solid. Happy with this purchase.",
  "Nice product but sizing runs a little large, order one size down.",
  "Been using it for a few weeks now, holding up really well.",
  "Better than I expected, worth every naira.",
  "Decent product, does the job but nothing extraordinary.",
  "Absolutely love it! Already thinking about getting another color.",
  "Solid build quality, feels premium for the price point.",
  "Would have given 5 stars but the color was slightly different from the photo."
];

export const PROMO_CODES: Record<string, { percent: number; label: string }> = {
  SAVE10: { percent: 10, label: "10% off your order" },
  WELCOME15: { percent: 15, label: "15% off — welcome to ShopFlow" },
  SHOP20: { percent: 20, label: "20% off your order" }
};

export const SHIPPING_METHODS = [
  { id: "standard", name: "Standard", price: 1500, days: "3-5 business days" },
  { id: "express", name: "Express", price: 3500, days: "1-2 business days" },
  { id: "priority", name: "Priority", price: 6000, days: "Next business day" }
];

export const PAYMENT_METHODS = [
  { id: "card", name: "Card" },
  { id: "paypal", name: "PayPal" },
  { id: "google_pay", name: "Google Pay" },
  { id: "apple_pay", name: "Apple Pay" },
  { id: "bank_transfer", name: "Bank Transfer" },
  { id: "cod", name: "Cash on Delivery" }
];

export const COURIERS = ["GIG Logistics", "Kwik Delivery", "Speedaf", "DHL Express"];

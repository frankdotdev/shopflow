# Manual Testing Checklist

Use this to verify a build before considering it "done." All flows below were exercised during
development (via TypeScript compilation + code review of every screen/action); running through
them by hand on a device/emulator once is still recommended before shipping, since a static
check can't click buttons for you.

## Primary flow
- [ ] Home → tap a category chip → Category listing shows only that category's products
- [ ] Category listing → tap Sort → change sort order → list re-orders
- [ ] Category listing → tap Filter → set a price range / brand / rating → Apply → list narrows
- [ ] Tap a product card → Product detail loads with correct images/price/stock
- [ ] Select a color and size → Add to Cart → button shows "Added to Cart" confirmation
- [ ] Cart tab shows the item with correct variant, quantity, and running totals
- [ ] Increase/decrease quantity in Cart → totals update immediately
- [ ] Tap Checkout → Address step → select existing or add a new address → Continue
- [ ] Shipping step → pick a tier → Continue
- [ ] Promo step → try `SAVE10` (valid) and `WRONG1` (invalid) → confirm messaging differs →
      Continue
- [ ] Payment step → pick a method → Review Order
- [ ] Review screen shows correct products, address, shipping, promo, payment, and totals
- [ ] Place Order → Success screen shows order number, delivery estimate, total
- [ ] Track Order → tracking timeline renders with the right stage highlighted
- [ ] Order History → the new order appears at the top
- [ ] Re-open the product from Related Products and add it again

## Search
- [ ] Search tab → type a partial product name → results appear, count is accurate
- [ ] Type a nonsense string → "NOTHING FOUND" empty state appears
- [ ] Tap a Popular Search chip → results populate and the term is saved to Recent
- [ ] Clear All on Recent Searches → list empties

## Wishlist
- [ ] Tap the heart on a product card → heart fills, product appears in Wishlist
- [ ] Wishlist → Add to Cart on an item → appears in Cart
- [ ] Wishlist → remove an item → disappears from list and from other hearts

## Profile
- [ ] Profile → My Orders / Wishlist badges reflect real counts
- [ ] Profile → Saved Addresses → add, edit, delete, set default all work
- [ ] Profile → Settings → toggle Dark Mode → whole app re-themes
- [ ] Profile → Settings → Reset Demo Data → confirms, then re-seeds cleanly

## Reviews
- [ ] Product detail → tap the rating row → Reviews screen shows distribution + list
- [ ] Write a Review → submit → new review appears immediately at the top

## Notifications
- [ ] Notifications → unread items are visually distinct
- [ ] Tap a notification → marks as read
- [ ] Mark all read → all items update

## Demo Store Manager
- [ ] Profile → Business → Demo Store Manager → dashboard metrics are non-zero after placing
      an order
- [ ] Products → edit a product's price/stock → change reflects on the shopper-facing product
      page
- [ ] Inventory → increment/decrement stock → status label (In Stock / Low Stock / Out of
      Stock) updates correctly at the thresholds
- [ ] Orders → filter by status → Advance an order → status progresses and is reflected in
      Order History / tracking

## Cross-cutting
- [ ] Kill and reopen the app → cart, wishlist, addresses, and orders all persisted
- [ ] Rotate a tablet-sized device/emulator to landscape → grids reflow to more columns
- [ ] Android hardware back button steps back through the stack correctly on every screen
- [ ] No screen shows a raw crash, an "undefined" price, or an unhandled blank state

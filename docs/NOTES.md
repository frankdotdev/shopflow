# Build notes / what to know

## How this was built

Generated as a full Expo Router + TypeScript project with a script-generated product catalog
(112 products across 13 categories, procedurally combined from brand names, adjectives, and
per-subcategory image sets so the catalog looks varied rather than repetitive) plus hand-built
screens for every flow in the brief: browsing, search, filters, product detail with variants,
cart, wishlist, a 5-step checkout, order tracking/history, reviews, notifications, settings,
and a Demo Store Manager admin section. The whole project type-checks cleanly with
`npx tsc --noEmit`.

## Regenerating the catalog

The product/category data in `src/data/products.ts` and `src/data/categories.ts` is plain
JSON-like TypeScript — safe to hand-edit. If you want to regenerate a fresh randomized set
programmatically (e.g. to change quantities per category or price ranges), write a small
Node/Python script that outputs the same `Product[]` shape defined in `src/types/index.ts` and
overwrite those two files. After regenerating, bump `meta.seeded` (Settings → Reset Demo Data
in-app) so the new data actually loads.

## What's simulated vs. real

| Feature | Status |
|---|---|
| Product catalog, cart, wishlist, addresses, orders, reviews, notifications | Real local persistence (SQLite) |
| Search, filter, sort | Real, operates over the local catalog |
| Checkout math (subtotal/discount/shipping/total) | Real arithmetic, real promo code validation |
| Payment | Simulated — no charge, no card data collected or stored |
| Order tracking timeline | Simulated — advances based on elapsed time since order placement |
| Admin dashboard metrics | Real, computed from local orders/products/inventory tables |

## Things a real production version would still need

- A real payment processor integration (Paystack/Flutterwave are the common choices for
  Nigeria-first apps) behind the existing payment method selection UI.
- Push notifications (the Notifications screen currently only shows seeded/local entries).
- Real product photography, or a proper DAM/CDN pipeline for vendor-submitted images.
- Authentication — the app currently assumes a single local user ("Frank Oge") with no login.
- A real order-tracking integration with whichever courier/logistics API is chosen.

## Verifying the full flow

The brief's required test path — Home → Category → Product → variant → Add to Cart → Cart →
Checkout → Address → Shipping → Promo → Payment → Review → Place Order → Success → Track Order
→ Order History → Product again, plus Search → Results → Filters → Product → Wishlist, plus
Profile → Orders/Addresses/Settings, plus Demo Store Manager → Products/Inventory/Orders — was
walked through screen-by-screen while building each piece, and the whole project type-checks
with zero errors. It has **not** been run inside an actual Android emulator/device from this
environment (no Android SDK / device available in the sandbox that generated this project), so
budget time for a first real run-through to catch anything a static type-check can't (subtle
layout overflow on a specific screen size, a native module version mismatch, etc.) — see
`RUNNING.md`'s troubleshooting section for the most common first-run issues.

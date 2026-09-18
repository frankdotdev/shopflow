# ShopFlow

A complete, offline-first mobile e-commerce app built as a portfolio demonstration.
No backend, no Firebase, no Supabase — everything runs locally on the device using SQLite.

**Tagline:** Everything you want. One place.

## What this is

ShopFlow simulates a real commercial marketplace app end-to-end: browsing, search, filters,
product detail with variants, cart, wishlist, a full multi-step checkout, order tracking and
history, reviews, notifications, account/settings, and a "Demo Store Manager" admin section —
all backed by a local SQLite database seeded with 112 realistic products across 13 categories.

This is designed to be handed to a client or reviewer as a working MVP, not a slide deck.

## Quick facts

| | |
|---|---|
| Framework | Expo (SDK 51) + React Native 0.74 + TypeScript |
| Navigation | Expo Router (file-based) |
| State | Zustand |
| Persistence | expo-sqlite (async API), seeded on first launch |
| Currency | Nigerian Naira (₦) |
| Products | 112 seeded products across 13 categories / 55 subcategories |
| Backend | None — fully offline after first load of remote images |

See `RUNNING.md` to run it, `BUILDING_APK.md` to produce an installable Android build,
and `ARCHITECTURE.md` for how the codebase is organized and why.

## Folder-by-folder

```
app/                 Expo Router screens (file-based routing)
  (tabs)/            Bottom tab screens: Home, Categories, Search, Cart, Profile
  product/[id]       Product detail
  category/[id]      Category product listing
  checkout/          5-step checkout wizard
  orders/            Order history + tracking detail
  reviews/[id]        Product reviews + submit a review
  admin/             Demo Store Manager (dashboard, products, inventory, orders)
src/
  components/        Reusable UI (ProductCard, Button, StarRating, etc.)
  database/          SQLite schema, seeding, and repository functions
  store/             Zustand stores (cart, wishlist, orders, addresses, theme, filters...)
  data/              Seed data: 112 products, 13 categories, promo codes, shipping/payment options
  hooks/             useAllProducts, filtering/sorting helpers, cart totals
  constants/         Design tokens: colors (light/dark), spacing, typography, layout
  types/             Shared TypeScript interfaces
docs/                You are here
```

## Known limitations (read before showing this to a client)

- **Product images** are pulled from Unsplash by photo ID, chosen to match each subcategory
  (sneakers, headphones, watches, etc.). They were selected from training knowledge, not
  verified live in this environment (the sandbox that built this project has no general
  internet access). **Before shipping, open the app once with an internet connection and
  spot-check the catalog** — swap out any image in `src/data/products.ts` that doesn't look
  right, or replace the set with your own bundled assets (see "Going fully offline" below).
- Order tracking status is **simulated from elapsed time** since the order was placed (it
  advances one stage roughly every 6 hours) rather than driven by a real courier API — this
  is intentional per the brief, but worth explaining in a demo.
- Payments are fully simulated. No card details are requested or stored anywhere.
- The `eas build` command in `package.json` requires an Expo/EAS account and is not run for you —
  see `BUILDING_APK.md`.

# ShopFlow

A complete, offline-first mobile e-commerce application built with React Native and Expo.

I built ShopFlow to deliver a full-featured commercial shopping experience that runs completely on-device without needing an active internet connection or a remote backend (no Firebase, no Supabase). Everything—from the 112-product catalog to cart management, multi-step checkout, order tracking, and store management—runs locally on SQLite.

**Tagline:** Everything you want. One place.

---

## What I Built

ShopFlow simulates a real-world commercial marketplace app from start to finish:

- **Browse & Discovery**: 13 major categories, 50+ subcategories, featured collections, banner carousels, and flash sales.
- **Fast Search & Smart Filters**: Instant search by keyword, brand, category, price range, and rating.
- **Rich Product Detail**: Multiple image views, size/color variant selection, real-time stock indicators, specs, and customer reviews.
- **Cart & Wishlist**: Persistent cart with live quantity updates, pricing breakdowns, and a one-tap wishlist toggle.
- **5-Step Checkout Flow**: Shipping address selection/creation, delivery tiers, working promo codes (`SAVE10`, `WELCOME15`, `SHOP20`), payment method selection, and order review.
- **Order Tracking & History**: Visual order timeline that tracks status from Confirmed to Delivered based on elapsed time.
- **Product Reviews**: Customer ratings distribution, detailed reviews, and an interactive review submission form.
- **Store Manager (Admin)**: A built-in dashboard showing sales metrics, product catalog management, and stock/inventory controls.
- **Design System & Dark Mode**: Handcrafted UI with custom typography, light/dark themes, and smooth interactions.

---

## Quick Facts

| | |
|---|---|
| **Author** | Frank Oge ([@frankdotdev](https://github.com/frankdotdev)) |
| **Framework** | Expo (SDK 51) + React Native 0.74 + TypeScript |
| **Navigation** | Expo Router (file-based routing) |
| **State Management** | Zustand (with direct write-through to SQLite) |
| **Persistence** | `expo-sqlite` (async API, auto-seeded on first launch) |
| **Currency** | Nigerian Naira (₦) with realistic market pricing |
| **Catalog** | 112 seeded products across 13 categories |
| **Backend** | None — fully offline after initial image caching |

---

## Project Structure

```
shopflow/
├── app/                 # Expo Router screens (file-based navigation)
│   ├── (tabs)/          # Bottom tabs: Home, Categories, Search, Cart, Profile
│   ├── product/[id]     # Product details & variant selection
│   ├── category/[id]    # Category listing with filter & sort
│   ├── checkout/        # 5-step checkout wizard
│   ├── orders/          # Order history and tracking timeline
│   ├── reviews/[id]     # Customer reviews and review submission
│   └── admin/           # Demo Store Manager (Dashboard, Products, Inventory, Orders)
├── src/
│   ├── components/      # Reusable UI widgets (ProductCard, Button, StarRating, etc.)
│   ├── database/        # SQLite schema, migrations, repositories, and seed logic
│   ├── store/           # Zustand stores (Cart, Wishlist, Orders, Addresses, Theme...)
│   ├── data/            # Static seed catalog: 112 products, categories, promo codes
│   ├── hooks/           # Custom hooks (useProducts, useCartTotals, filtering helpers)
│   ├── constants/       # Design tokens: light/dark palettes, typography, spacing
│   └── types/           # TypeScript interfaces and data models
├── docs/                # Detailed guides (Architecture, Running, Building APK, etc.)
└── eas.json             # EAS Build configuration for Android APK builds
```

---

## Documentation Guide

I've documented every part of this project so anyone reviewing or running the code can understand the architecture, test every flow, and build an APK:

- **[Running the App](RUNNING.md)** — Step-by-step instructions to get the app running on your phone or emulator.
- **[Building an Installable APK](BUILDING_APK.md)** — How to build a standalone Android `.apk` file using EAS Build or local Gradle.
- **[Architecture & Design Decisions](ARCHITECTURE.md)** — Why I chose Expo Router, Zustand, and SQLite, and how data flows through the app.
- **[Data & Images](DATA_AND_IMAGES.md)** — How I structured the 112 products, categories, and image assets.
- **[Known Limitations & Production Roadmap](KNOWN_LIMITATIONS.md)** — What is simulated for this demo vs. what to wire up for a live production launch.
- **[Manual Testing Checklist](TESTING_CHECKLIST.md)** — The QA test checklist I use to verify all flows before shipping.
- **[Developer Notes](NOTES.md)** — My notes on data seeding, state persistence, and catalog regeneration.

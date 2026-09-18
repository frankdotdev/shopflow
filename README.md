# ShopFlow 🛍️

> **Everything you want. One place.**

A complete, offline-first mobile e-commerce application built with React Native, Expo Router, and SQLite.

Developed by **Frank Oge** ([@frankdotdev](https://github.com/frankdotdev)).

---

## Overview

I built ShopFlow to demonstrate a commercial-grade mobile marketplace experience that runs entirely on-device without requiring a remote backend or cloud database.

From catalog discovery and variant selection to a 5-step checkout flow, live order tracking, customer reviews, and a store manager admin dashboard—all data is persisted locally on the device using SQLite.

---

## Key Features

- 📱 **Full Mobile Marketplace**: 112 products across 13 categories and 50+ subcategories, priced realistically in Nigerian Naira (₦).
- 🔍 **Instant Search & Dynamic Filters**: Fast keyword search with price range sliders, rating filters, and brand pickers.
- 🎨 **Product Variant Selection**: Color swatches, clothing/shoe sizes, specs, and multi-image galleries.
- 🛒 **Persistent Cart & Wishlist**: Real-time arithmetic, quantity adjustments, and one-tap wishlist toggle.
- 💳 **5-Step Checkout Wizard**: Address management, delivery tier selection, working promo codes (`SAVE10`, `WELCOME15`, `SHOP20`), payment selection, and review.
- 📦 **Order Tracking & History**: Visual order progress timeline tracking simulated courier status.
- ⭐ **Customer Reviews**: Rating distributions, customer testimonials, and an interactive review submission form.
- 📊 **Demo Store Manager**: An integrated merchant dashboard with revenue metrics, inventory tracking, and catalog controls.
- 🌙 **Dark & Light Mode**: Complete theme engine with real-time switching in Settings.
- 💾 **Offline-First Architecture**: Powered by `expo-sqlite` and Zustand; never loses data when closed or killed.

---

## Tech Stack

- **Framework**: React Native 0.74, Expo (SDK 51), TypeScript
- **Navigation**: Expo Router (file-based navigation)
- **State Management**: Zustand
- **Database**: `expo-sqlite` (async API with write-through persistence)
- **Icons & Media**: Lucide Icons, `expo-image`
- **Build System**: EAS Build (pre-configured for Android `.apk` generation)

---

## Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/frankdotdev/shopflow.git
cd shopflow
npm install
```

### 2. Run the App
```bash
npm start
```
- **On your phone**: Scan the terminal QR code with the **Expo Go** app (Android) or Camera app (iOS).
- **On Android Emulator**: Press `a` in the terminal.
- **On iOS Simulator (Mac)**: Press `i` in the terminal.

### 3. Build Android APK
```bash
npm run build:apk
```
This triggers an EAS cloud build that produces a downloadable, installable `.apk` file.

---

## In-Depth Documentation

I have documented the entire project architecture, guides, and workflows in the `docs/` folder:

- 📖 **[Architecture & Design Decisions](docs/ARCHITECTURE.md)** — In-depth breakdown of technical choices, data flow, and state persistence.
- 🚀 **[Running ShopFlow](docs/RUNNING.md)** — Detailed setup and local development guide.
- 📦 **[Building an Installable APK](docs/BUILDING_APK.md)** — How to generate a standalone Android APK with EAS or Gradle.
- 🗄️ **[Catalog Data & Images](docs/DATA_AND_IMAGES.md)** — Details on the 112-product seed catalog, images, and customization.
- 🔍 **[QA Testing Checklist](docs/TESTING_CHECKLIST.md)** — Complete manual test cases to verify all flows before shipping.
- ⚠️ **[Known Limitations & Production Roadmap](docs/KNOWN_LIMITATIONS.md)** — What is simulated for this MVP and how to wire up live payment gateways (Paystack/Flutterwave) and auth for production.
- 📝 **[Developer Notes](docs/NOTES.md)** — Notes on data seeding, state persistence, and catalog regeneration.

---

## Author

**Frank Oge**  
- GitHub: [@frankdotdev](https://github.com/frankdotdev)  
- Email: ogekcfrankie@gmail.com

# Developer Notes & Project Insights

Here are my personal development notes, implementation details, and reference information for ShopFlow.

---

## Implementation Overview

I engineered ShopFlow from scratch using React Native, Expo Router, and TypeScript. The goal was to build a complete, resilient mobile marketplace with zero external server dependencies:

- **112 products** across 13 major categories and 50+ subcategories, priced in Nigerian Naira (₦).
- **Zero type errors**: The codebase strictly type-checks cleanly with `npx tsc --noEmit`.
- **End-to-end flows**: Browse → Search & Filter → Product Details & Variants → Cart → 5-Step Checkout → Order Confirmation → Order Tracking → Order History → Product Reviews → Store Manager Dashboard.

---

## Real vs. Simulated Capabilities

| Feature | Status | Details |
|---|---|---|
| **Product Catalog** | Real | Stored and queried from SQLite |
| **Cart & Wishlist** | Real | Fully persistent in SQLite; real-time math |
| **Checkout Flow** | Real | Real subtotal, promo code discount math, shipping calculation |
| **Order History** | Real | Stored in SQLite with items, addresses, and timestamps |
| **Store Manager** | Real | Computes real revenue, orders, and stock updates in SQLite |
| **Theme Engine** | Real | Real-time Dark/Light mode switcher |
| **Payment Gateways** | Simulated | Mock payment step; no actual money charged |
| **Order Tracking** | Simulated | Advances status stages based on elapsed time |
| **Push Alerts** | Simulated | Stored locally; no remote FCM/APNs server |

---

## How State & Persistence Work Together

To prevent state desynchronization:
1. Every write operation (adding to cart, toggling wishlist, adding an address, placing an order) writes to SQLite first.
2. Upon query success, the in-memory Zustand store is updated.
3. On application launch (`app/_layout.tsx`), all stores hydrate from SQLite while the native splash screen is held.
4. Result: If a user closes or kills the app at any point, all cart items, addresses, and order history remain intact upon reopening.

---

## How to Reset Demo Data

If you modify test data, place test orders, or alter inventory and want to return to a clean state:
1. Open the app on your phone or emulator.
2. Navigate to **Profile → Settings**.
3. Tap **Reset Demo Data** and confirm.
4. The app clears all custom orders/cart data and re-seeds the database cleanly with the default catalog.

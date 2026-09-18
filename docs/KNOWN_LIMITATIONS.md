# Known Limitations & Production Roadmap

I built ShopFlow as a standalone MVP and portfolio demonstration. To ensure it runs completely self-contained on any device without requiring servers or external API keys, certain features are simulated.

If you are planning to take this app into full commercial production, here is an honest breakdown of what is simulated and the exact steps to transition to production.

---

## 1. Payment Processing
- **Current Behavior**: All payment methods (Card, Bank Transfer, PayPal, Apple Pay, Google Pay, Cash on Delivery) are fully simulated. No real charges are made and no sensitive financial data is collected or stored.
- **Production Roadmap**: Integrate a payment gateway suitable for your target market. For Nigeria, integrate **Paystack** or **Flutterwave** (e.g. `react-native-paystack-webview`). Hook this into `app/checkout/payment.tsx` right before the order record is committed to the database.

---

## 2. Authentication & Multi-User Support
- **Current Behavior**: The app uses a single default user profile ("Frank Oge") seeded directly into the local database, allowing instant access to addresses, orders, and settings without a login barrier.
- **Production Roadmap**: Add an authentication layer using Supabase Auth, Firebase Auth, or a custom OAuth/JWT backend. Create Sign In / Sign Up screens and guard the user-specific routes (orders, addresses, checkout).

---

## 3. Cloud Synchronization
- **Current Behavior**: All data (cart, wishlist, saved addresses, orders, reviews) is stored locally in the device's SQLite database (`shopflow.db`). If the app is uninstalled or installed on a second device, the data does not sync.
- **Production Roadmap**: Connect the Zustand store actions to a remote REST or GraphQL API so that carts, orders, and user profiles persist on a central cloud database (PostgreSQL, MySQL, etc.).

---

## 4. Store Manager (Admin Access Control)
- **Current Behavior**: The "Demo Store Manager" dashboard is accessible directly from **Profile → Business → Demo Store Manager** so reviewers can easily inspect inventory and order management capabilities.
- **Production Roadmap**: Separate the admin functionality into an authenticated, role-based admin portal (or gate it behind admin authentication with strict JWT/role verification).

---

## 5. Live Order Tracking
- **Current Behavior**: The order timeline is simulated dynamically based on elapsed time since the order was placed (advancing stages every few hours).
- **Production Roadmap**: Connect the tracking screen (`app/orders/[id].tsx`) to real-time webhook updates from a courier or logistics partner (e.g. GIG Logistics, DHL, FedEx, Terminal Africa).

---

## 6. Push Notifications
- **Current Behavior**: The Notifications screen displays seeded order and promotional alerts.
- **Production Roadmap**: Configure `expo-notifications` with Firebase Cloud Messaging (FCM) and Apple Push Notification service (APNs) to send push notifications when orders update or promos launch.

---

## 7. Search Indexing
- **Current Behavior**: Search executes a fast in-memory case-insensitive filter across titles, categories, subcategories, brands, and tags. This is extremely fast for ~100–1,000 items.
- **Production Roadmap**: For catalogs with tens of thousands of items, implement SQLite FTS5 (Full-Text Search) tables locally, or integrate an external search index like Algolia, Meilisearch, or Elasticsearch.

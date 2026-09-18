# Architecture & Technical Decisions

Here is a breakdown of how I designed ShopFlow's architecture and the technical decisions behind it.

---

## Core Technical Choices

### 1. Expo Router (File-Based Navigation)
I chose Expo Router so that every file and folder in `app/` maps directly to a screen route. With over 30 screens in this app, file-based routing keeps navigation clean, predictable, and modular without needing a monolithic navigation configuration file.
- `(tabs)` is a route group: the parentheses tell Expo Router not to append a URL segment, keeping the 5 core tabs (Home, Categories, Search, Cart, Profile) neatly grouped under one bottom navigation layout.
- Dynamic routes like `product/[id].tsx` and `category/[id].tsx` handle parameters cleanly with typed hooks.

### 2. Zustand for State Management
Instead of heavy Redux boilerplate or deeply nested React Context providers, I used Zustand. ShopFlow manages 8 independent slices of state:
- Cart
- Wishlist
- Orders
- Addresses
- Notifications
- Theme (Light/Dark)
- Filters & Sort
- Checkout in-progress

Each slice has its own dedicated store. Every action that modifies data writes straight through to SQLite first, then updates in-memory state. This guarantees that UI state and persistent storage never get out of sync.

### 3. SQLite as the Single Source of Truth
I use `expo-sqlite` as the primary database. Every state-altering action (`addToCart`, `toggleWishlist`, `placeOrder`, `updateAddress`, etc.) commits to SQLite first before updating memory.
- If you force-close the app mid-session and reopen it, nothing is lost.
- During app startup in `app/_layout.tsx`, all stores hydrate their state directly from SQLite while the splash screen is visible.

### 4. Pragmatic Data Storage
In the database schema, I made an intentional design decision:
- **Products** are stored with an `id` and a serialized JSON `data` column. Because the catalog is read-heavy and does not require complex SQL joins across individual product specs, this keeps schema migrations simple while giving maximum flexibility for nested product attributes (sizes, colors, specs).
- **Cart items, Orders, Addresses, and Inventory** are stored in fully normalized relational tables. This allows fast direct queries for calculations, order status updates, and the Store Manager admin dashboard.

---

## Data Flow: Add to Cart Example

Here is what happens under the hood when a user taps "Add to Cart":

1. The user taps **Add to Cart** on `app/product/[id].tsx`.
2. The UI triggers `useCartStore.getState().addToCart(product, quantity, color, size)`.
3. The store checks if a matching line item (same product ID + color + size) already exists.
4. The store calls `upsertCartItem()` in `src/database/repositories.ts`, executing an atomic `INSERT OR REPLACE` query in SQLite.
5. Upon database confirmation, the store updates its in-memory `items` array.
6. The cart badge in `(tabs)/_layout.tsx` and the Cart screen re-render immediately with zero lag and no manual refetching.

---

## Search, Filters & Sorting

In `src/hooks/useProducts.ts`, I created pure utility functions (`applyFilters` and `applySort`) shared by the Category product list and the Search screen.
- Filter criteria live in `useFilterStore` and persist during the active session.
- Centralizing filter and sort logic in a shared hook eliminates duplicate filtering code across screens and keeps results consistent.

---

## Design System & Theme Engine

- `src/constants/colors.ts` defines complete color palettes for both `lightColors` and `darkColors`.
- `src/constants/theme.ts` sets tokens for spacing, typography, borders, and shadows.
- `useThemeStore` manages the active theme. Every UI component reads from `colors.*` rather than hardcoding hex values. This is how the real-time Dark Mode toggle in Settings transforms the entire app instantly without requiring duplicate layouts.

---

## How to Add a New Screen

If you want to add a new screen to the project:

1. Create a `.tsx` file under `app/` following Expo Router naming conventions:
   - Plain screen: `app/my-screen.tsx` (accessible via `/my-screen`)
   - Parameterized screen: `app/my-screen/[id].tsx` (accessible via `/my-screen/123`)
2. Register it in `app/_layout.tsx` inside the `<Stack>` component if it requires custom transitions or presentation headers:
   ```tsx
   <Stack.Screen name="my-screen" options={{ title: "My Screen" }} />
   ```
3. Always pull and mutate data through existing Zustand stores or `src/database/repositories.ts` to keep business logic and persistence centralized.

---

## Extending the Catalog

The product and category definitions live in `src/data/products.ts` and `src/data/categories.ts` as typed TypeScript arrays.
- You can add or modify products directly in those files.
- The app automatically seeds SQLite on first launch. If you modify the source data and want to re-seed, open the app, go to **Profile → Settings → Reset Demo Data**, and the database will cleanly refresh with your latest catalog.

# Architecture

## Why these choices

**Expo Router (file-based navigation).** Every folder/file under `app/` maps directly to a
route, which keeps the huge number of screens this brief calls for (30+) discoverable without
a giant manually-maintained navigator config. `(tabs)` is a route group — the parentheses mean
it doesn't add a URL segment, it just groups the 5 bottom-tab screens under one layout.

**Zustand over Redux/Context.** The app has ~8 independent slices of state (cart, wishlist,
orders, addresses, notifications, theme, filters, checkout-in-progress). Zustand gives each
its own store with zero boilerplate and no provider nesting, and every store method that
touches data also writes through to SQLite so state and persistence never drift apart.

**SQLite as the single source of truth.** Every store's mutating actions (`addToCart`,
`toggleWishlist`, `placeOrder`, etc.) write to SQLite first, then update in-memory state from
the result. This means force-quitting the app mid-action never loses data — reopening reloads
straight from the database in `app/_layout.tsx`.

**Products stored as JSON blobs, not fully normalized columns.** `products` table has an `id`
and a `data` TEXT column holding the serialized `Product`. This was a deliberate simplicity
trade-off: the catalog is read-heavy and never needs SQL-level joins/aggregates across product
fields, so paying for full normalization would add migration complexity for no real benefit.
Cart items, addresses, orders, and inventory *are* properly columned since the admin screens
and totals math benefit from querying them directly.

## Data flow for a typical action (Add to Cart)

1. User taps "Add to Cart" on `app/product/[id].tsx`.
2. Calls `useCartStore().addToCart(product, quantity, color, size)`.
3. The store checks for an existing matching line item, then calls
   `upsertCartItem()` in `src/database/repositories.ts`, which runs a SQLite
   `INSERT OR REPLACE`.
4. On success, the store updates its in-memory `items` array, which re-renders the cart badge
   in `(tabs)/_layout.tsx` and the cart screen — no manual refetch needed.

## Filtering & sorting

`src/hooks/useProducts.ts` exports two pure functions, `applyFilters` and `applySort`, used by
both the category listing screen and (implicitly) search. Filters live in `useFilterStore` and
persist for the session (not across app restarts, since filter state is a UI convenience, not
user data worth persisting). This keeps the filtering logic in one tested place rather than
duplicated per-screen.

## Design system

`src/constants/colors.ts` defines a `lightColors` and `darkColors` palette; `src/constants/theme.ts`
defines spacing/typography/radius tokens. `useThemeStore` swaps the active palette; components
read `colors.*` from it rather than hardcoding hex values, which is what makes the working dark
mode toggle in Settings possible without a second set of screens.

## Adding a new screen

1. Create the file under `app/` following Expo Router conventions (`app/foo.tsx` → `/foo`,
   `app/foo/[id].tsx` → `/foo/:id`).
2. Register it in the nearest `_layout.tsx` `<Stack.Screen name="..." />` list if it's a stack
   screen (tabs are auto-registered by `(tabs)/_layout.tsx`).
3. Pull data through the existing repositories/stores rather than querying SQLite directly from
   the component — keeps persistence logic centralized.

## Extending the catalog

`src/data/products.ts` and `src/data/categories.ts` are plain TypeScript arrays — edit them
directly, or regenerate them with a script like the one used to build this seed set (see
"Regenerating the catalog" in `NOTES.md`). The database re-seeds automatically on first launch
only (`meta.seeded` flag); use **Settings → Reset Demo Data** in-app, or clear the app's storage,
to force a re-seed after editing the data files.

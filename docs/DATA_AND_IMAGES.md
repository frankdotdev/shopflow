# Data & Images

## Where the catalog comes from

`src/data/products.ts` and `src/data/categories.ts` are **generated, static TypeScript
files** — 112 products across 13 categories (Clothing, Shoes, Bags, Electronics, Phones &
Tablets, Computers, Watches, Jewelry, Kitchen, Home, Beauty, Toys, Sports) and 50+
subcategories. Each product has a realistic Nigerian-market price in Naira, a brand drawn from
a small set of invented brand names per category, a rating/review count, stock level, 2–4
color swatches, sizes where applicable (clothing/shoes), specifications, and three image URLs.

These files were generated once by a script and then committed as plain data — there's no
build step required to use them; they're just imported directly by `database/db.ts` during
seeding.

## Images

Product and category images currently point to `images.unsplash.com` URLs, chosen per
subcategory (e.g. sneakers pull from a curated set of sneaker photo IDs, headphones from a
curated set of headphone photo IDs, etc.) so that each product shows contextually appropriate
imagery rather than one repeated stock photo. **Because these were selected without a live
network check in the build environment, verify a sample from each category before shipping**
— open a few product detail pages per category and confirm the image matches the product type,
and swap out any mismatches.

### Before production, do one of the following:

1. **Swap to your own licensed photography.** Update the `images` array on each product in
   `products.ts` to point at your CDN or bundled assets.
2. **Bundle images locally** (recommended for the "fully offline" requirement to hold even
   before first load): download the referenced Unsplash images, put them in
   `assets/products/<category>/`, and change each `images: [...]` entry to a `require(...)`
   reference instead of a remote URL string. `expo-image` accepts both.
3. **Keep remote URLs but add a cache step**: on first successful load, download each image to
   `FileSystem.documentDirectory` and rewrite the URL in SQLite to the local file path, so the
   app is truly offline after the very first launch (currently, offline-first covers all *data*
   — cart, orders, wishlist, etc. — but product images still require a network connection the
   first time they're viewed, exactly as noted in the app's core requirements).

## Regenerating or expanding the catalog

The product generation logic is not kept as a runtime script (it was used once, offline, to
produce `products.ts`), so to add more products either:

- Hand-add entries to the `PRODUCTS` array in `src/data/products.ts` following the existing
  `Product` shape, or
- Use the **Demo Store Manager → Products** screen at runtime, which can edit name/price/stock
  on existing products (add/full-create UI can be extended the same way — see
  `app/admin/products.tsx`).

## Reviews, promo codes, shipping & payment options

- `src/data/reviewSeed.ts` holds the pool of reviewer names/comments used to seed 2–5 reviews
  per product, plus the three working demo promo codes (`SAVE10`, `WELCOME15`, `SHOP20`), the
  three shipping tiers, the six payment method labels, and a small list of courier names used
  for order tracking flavor text.

# Data & Product Images

I structured ShopFlow's catalog to feel like a vibrant, real-world Nigerian e-commerce marketplace from the moment you open it.

Here is a breakdown of how the catalog data and images are organized.

---

## The Product Catalog

The entire catalog is defined in `src/data/products.ts` and `src/data/categories.ts`. It includes:

- **112 unique products** across **13 major categories** (Clothing, Shoes, Bags, Electronics, Phones & Tablets, Computers, Watches, Jewelry, Kitchen, Home, Beauty, Toys, Sports).
- **50+ subcategories** (Sneakers, Smartwatches, Laptops, Cookware, Skincare, etc.).
- **Realistic Nigerian Market Pricing** in Naira (₦).
- **Invented brand names** tailored to each category.
- **Rich specifications**: ratings, review counts, live inventory levels, color swatches with hex codes, sizing options (clothing/shoes), and descriptive bullet points.

Because these are static TypeScript data files, there is no external database setup or API call required. When the app is launched for the first time, `src/database/db.ts` automatically seeds this entire catalog into SQLite.

---

## How Product Images Work

Each product contains three image URLs pointing to high-resolution photography on Unsplash. I curated specific image IDs for every subcategory so that sneakers display sneakers, laptops display laptops, and watches display watches—giving the app a polished, commercial look rather than generic stock placeholders.

### Image Caching & Offline Behavior
- The app uses `expo-image` for high-performance rendering.
- When an image loads for the first time, `expo-image` automatically caches it to local device storage.
- Once cached, the images display offline without needing an active internet connection.

---

## How to Customize Images for Production

If you are preparing to deploy this app for a commercial client or store:

### Option 1: Point to Your Own CDN
Update the `images` array for the products in `src/data/products.ts` to point to your hosted CDN URLs (AWS S3, Cloudinary, etc.):
```typescript
images: [
  "https://cdn.yourstore.com/products/shoe-1-front.jpg",
  "https://cdn.yourstore.com/products/shoe-1-side.jpg",
  "https://cdn.yourstore.com/products/shoe-1-detail.jpg"
]
```

### Option 2: Bundle Images Locally (100% Offline from Moment Zero)
If you want the app to be 100% offline before even connecting to the internet once:
1. Save your image assets into `assets/products/<category>/`.
2. In `src/data/products.ts`, import them or use `require(...)`:
   ```typescript
   images: [
     require("../../assets/products/shoes/sneaker-front.jpg"),
     require("../../assets/products/shoes/sneaker-side.jpg")
   ]
   ```
   `expo-image` handles local `require()` sources seamlessly.

---

## Promo Codes, Reviews & Shipping Options

I seeded additional realistic marketplace data in `src/data/reviewSeed.ts`:

- **Working Promo Codes**:
  - `SAVE10` — 10% discount off subtotal
  - `WELCOME15` — 15% discount off subtotal
  - `SHOP20` — 20% discount off subtotal
- **Reviews Pool**: Seeded customer names, ratings, and realistic review comments distributed across products.
- **Shipping Tiers**: Standard Delivery (₦1,500), Express Delivery (₦3,500), and Same Day Delivery (₦5,000).
- **Payment Methods**: Card, Bank Transfer, Apple Pay, Google Pay, PayPal, Cash on Delivery.
- **Couriers**: Flavor text for order tracking (GIG Logistics, DHL Express, FedEx).

---

## Modifying or Adding Products

You can add or update products in two ways:

1. **Directly in Code**: Edit `src/data/products.ts` following the `Product` type definition, then go to **Profile → Settings → Reset Demo Data** in the app to re-seed.
2. **In-App via Store Manager**: Open **Profile → Business → Demo Store Manager → Products** to edit pricing, title, and stock levels live in the SQLite database.

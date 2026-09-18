# QA & Manual Testing Checklist

I use this checklist to thoroughly verify all features and user journeys across ShopFlow before deploying or presenting a build.

Follow this checklist to test every flow systematically.

---

## 1. Browse & Discovery
- [ ] **Home Feed**: Banner carousel scrolls smoothly; flash sales and trending sections render with correct product cards.
- [ ] **Category Chips**: Tapping a category chip navigates to the Category listing filtered to that category.
- [ ] **Category Listing**:
  - [ ] Tap **Sort** → change to "Price: Low to High", "Price: High to Low", or "Rating" → list re-orders instantly.
  - [ ] Tap **Filter** → adjust price slider, select a brand, pick a minimum star rating → tap **Apply** → results filter accurately.
  - [ ] Tap **Reset Filters** → resets all criteria and restores full product list.

---

## 2. Product Details & Variants
- [ ] Tap any product card → Product detail screen opens with image carousel, title, price, rating, and stock badge.
- [ ] **Variant Selection**:
  - [ ] Tap different color swatches → selected swatch highlights.
  - [ ] For apparel/shoes: Tap size chips → selected size highlights.
  - [ ] Quantity selector: Tap `+` and `-` to increment/decrement quantity.
- [ ] **Add to Cart**:
  - [ ] Tap **Add to Cart** → confirmation feedback appears.
  - [ ] Cart tab icon badge updates its count immediately.
- [ ] **Wishlist Toggle**:
  - [ ] Tap the heart icon → heart fills with primary color.
  - [ ] Navigate to Wishlist tab → product appears in the list.

---

## 3. Search Flow
- [ ] Open **Search** tab.
- [ ] Type a keyword (e.g., "Sneaker", "Watch", "Wireless") → matching items appear instantly with count.
- [ ] Type a nonsense string (e.g., "xyzqwe") → clean "No Results Found" empty state displays.
- [ ] Tap a **Popular Search** chip → search bar populates and results load immediately.
- [ ] Recent Searches history updates; tap **Clear All** → recent search history empties.

---

## 4. Cart & 5-Step Checkout
- [ ] Open **Cart** tab → items display with selected variant (color, size), quantity, and price.
- [ ] Modify item quantity with `+` / `-` → item price and order subtotal update dynamically.
- [ ] Swipe / tap to delete an item → item removes and totals recalculate.
- [ ] Tap **Proceed to Checkout**:
  - [ ] **Step 1 (Address)**: Select existing default address or tap "Add New Address". Save and proceed.
  - [ ] **Step 2 (Shipping)**: Choose between Standard, Express, or Same Day. Verify shipping fee updates.
  - [ ] **Step 3 (Promo Code)**:
    - Test `SAVE10` → confirms 10% discount is applied to total.
    - Test invalid code `INVALID99` → displays error feedback without applying discount.
  - [ ] **Step 4 (Payment)**: Select a payment method (Card, Bank Transfer, PayPal, etc.).
  - [ ] **Step 5 (Review & Place Order)**: Review screen displays breakdown (Subtotal, Shipping, Discount, Grand Total). Tap **Place Order**.
- [ ] **Order Success Screen**: Shows generated Order ID, delivery date estimate, and buttons for "Track Order" and "Continue Shopping".

---

## 5. Orders & Live Tracking
- [ ] From Success screen, tap **Track Order** → timeline displays with the initial stage highlighted.
- [ ] Go to **Profile → My Orders** → the newly placed order appears at the top of the history list.
- [ ] Tap the order → displays full item breakdown, shipping address, and payment method used.

---

## 6. Product Reviews
- [ ] Open a product detail page → tap the ratings row.
- [ ] Ratings distribution breakdown (5-star down to 1-star) renders with seeded customer reviews.
- [ ] Tap **Write a Review**:
  - [ ] Select star rating, enter a reviewer name and comment.
  - [ ] Tap **Submit** → new review appears at the top of the review list immediately.

---

## 7. Store Manager (Admin Dashboard)
- [ ] Navigate to **Profile → Business → Demo Store Manager**.
- [ ] **Dashboard**: Total revenue, order count, and inventory metrics update based on placed orders.
- [ ] **Products**: Tap any product to edit price or stock level → verify changes reflect in the shopper store.
- [ ] **Inventory**: Check low-stock alerts and adjust stock levels.
- [ ] **Orders**: Inspect recent orders and advance status stages manually.

---

## 8. Settings & Dark Mode
- [ ] Navigate to **Profile → Settings**.
- [ ] Toggle **Dark Mode** → entire app instantly switches to dark color palette.
- [ ] Toggle back to **Light Mode** → seamless transition back to light palette.
- [ ] Tap **Reset Demo Data** → confirms prompt, cleanly re-initializes the database, and clears test orders.

---

## 9. Offline Persistence & Resilience
- [ ] Add items to Cart and Wishlist.
- [ ] Force-quit / close the app completely.
- [ ] Reopen the app → verify Cart items, Wishlist, placed Orders, and saved Addresses persist without data loss.
- [ ] Test hardware Back button on Android → navigates back through the navigation stack naturally without unexpected exits.

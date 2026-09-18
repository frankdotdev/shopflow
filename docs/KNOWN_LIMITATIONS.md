# Known Limitations & What to Change for Production

This app was built as a portfolio-grade **demo/MVP**, not a store you'd point real customers
and real payments at. Here's what's intentionally simplified, and what to do about each before
any real-world use:

## Payments
All payment methods (Card, PayPal, Google Pay, Apple Pay, Bank Transfer, Cash on Delivery) are
**simulated** — no real charge is ever made, and no real payment credentials are requested or
stored anywhere, per the original brief. To go live, integrate a real gateway appropriate for
Nigeria (Paystack, Flutterwave, etc.) at the `checkout/payment.tsx` → `checkout/index.tsx`
hand-off point, where the order is currently created directly in SQLite.

## Images
See `DATA_AND_IMAGES.md` — current images are remote Unsplash URLs chosen by category, not
verified one-by-one, and not bundled for offline-from-first-launch use.

## Authentication
There's a single hardcoded demo user ("Frank Oge") seeded into the `users` table. There's no
sign-up/login flow, since the brief explicitly asked for no auth servers. If you need multiple
accounts, you'll need to add a real auth layer (Firebase Auth, Supabase Auth, or a custom
backend) — at which point cart/orders/etc. should likely move server-side too.

## Single-device data
Because everything lives in local SQLite, cart/orders/wishlist do not sync across devices or
survive an app uninstall. This is by design for the demo but is the first thing to change if
this becomes a real product (move to a backend + real database).

## Admin section security
"Demo Store Manager" is reachable from Profile → Business → Demo Store Manager with no
authentication gate, since it operates on the same local data as the shopper-facing app and
exists purely to demonstrate business-software capability. In production this must be a
properly authenticated, separate surface with real role-based access control.

## Currency
Only NGN is actually functional (all prices are generated in Naira). The currency toggle in
Settings is a visual placeholder (per the brief) and does not convert prices.

## Language
Same as currency — the language toggle in Settings is a visual placeholder; no i18n strings
exist yet.

## Search
Search is a simple case-insensitive substring match across name/category/subcategory/brand/tags
run in-memory on the already-loaded product list. This is fine for ~100–1,000 products; a real
catalog at scale would want a proper search index (SQLite FTS5, or a hosted search service).

## Notifications
Notifications are seeded demo content and are not pushed by any real event system — no push
notification integration (APNs/FCM) is wired up.

## Tests
There is no automated test suite. The manual QA flow in `TESTING_CHECKLIST.md` covers the
critical paths that were used to validate this build.

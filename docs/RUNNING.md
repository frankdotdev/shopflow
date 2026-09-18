# Running ShopFlow

## Prerequisites

- Node.js 18+ and npm
- The Expo Go app on your phone (easiest), **or** Android Studio / Xcode for a simulator
- Internet on the device the app runs on (for product images — the app is otherwise fully
  offline; see README for details)

## 1. Install dependencies

```bash
cd shopflow
npm install
```

## 2. Start the dev server

```bash
npm start
```

This opens the Expo developer tools in your terminal with a QR code.

- **On a physical phone:** install "Expo Go" from the Play Store / App Store, then scan the QR
  code. The app will build and launch on your device.
- **On an Android emulator:** press `a` in the terminal after `npm start` (requires Android
  Studio's emulator already running).
- **On an iOS simulator (Mac only):** press `i`.
- **In a browser (limited — SQLite/native modules won't fully work):** press `w`. Use this only
  for a quick visual check of layout, not for testing app logic.

## 3. First launch

On first launch the app creates `shopflow.db` and seeds it with the full catalog, demo
addresses, reviews, and notifications. This happens once — subsequent launches read the
existing database. To start over, use **Profile → Settings → Reset Demo Data**.

## Useful dev commands

```bash
npm run android     # build & run directly on a connected Android device/emulator
npm run ios         # build & run on iOS (Mac only)
npx tsc --noEmit    # type-check the whole project
```

## Troubleshooting

- **"Unable to resolve module @/..."** — the `@` alias is configured in `babel.config.js` and
  `tsconfig.json`. If you renamed folders, make sure both still point at `./src`.
- **Blank white screen on launch** — check the Metro terminal for a red error box; it's almost
  always a native module that needs `expo install` instead of `npm install` (Expo pins native
  module versions to the SDK version). If you add any new native package, install it with
  `npx expo install <package>` rather than `npm install <package>`.
- **Images not loading** — the device needs internet the first time it loads a product image
  (they're fetched from Unsplash). Once cached by `expo-image`, they'll display without a
  connection until the cache is cleared.

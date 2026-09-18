# Running ShopFlow Locally

Follow this guide to get ShopFlow running on your machine and test it on your physical phone, an Android emulator, or an iOS simulator.

---

## Prerequisites

Before starting, ensure you have the following installed:

1. **Node.js**: Version 18 or higher ([Download Node.js](https://nodejs.org/))
2. **npm** (comes with Node.js)
3. **Expo Go app** on your phone (available free on Google Play Store and Apple App Store), or an emulator set up via Android Studio / Xcode.
4. **Internet connection**: Needed on first launch so product images can be fetched and cached by `expo-image`.

---

## Step-by-Step Setup

### 1. Clone the repository
```bash
git clone https://github.com/frankdotdev/shopflow.git
cd shopflow
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm start
```
*(Or run `npx expo start`)*

This starts the Metro bundler and displays a QR code in your terminal.

---

## How to View the App

### On a Physical Android or iPhone (Easiest & Recommended)
1. Install **Expo Go** from the Play Store (Android) or App Store (iOS).
2. Open Expo Go:
   - **Android**: Tap "Scan QR code" and scan the QR code displayed in your terminal.
   - **iOS**: Open the native Camera app, point it at the QR code, and tap the Expo Go banner that pops up.
3. The JavaScript bundle will compile and launch ShopFlow directly on your phone!

### On an Android Emulator
1. Start your Android emulator from Android Studio.
2. In your terminal where `npm start` is running, press `a`.
3. Expo will automatically install Expo Go on the emulator and open the app.

### On an iOS Simulator (Mac only)
1. Open Simulator on macOS.
2. In your terminal where `npm start` is running, press `i`.

---

## First-Launch Behavior

When ShopFlow opens for the first time:
- It creates the local SQLite database (`shopflow.db`).
- It automatically seeds all 112 products, categories, demo addresses, reviews, and notifications.
- This seeding happens once in the background. Subsequent launches load instantly from SQLite.
- To reset the database to a fresh state anytime, go to **Profile → Settings → Reset Demo Data**.

---

## Useful Commands

```bash
npm start          # Start Expo dev server
npm run android    # Start dev server and open on connected Android device/emulator
npm run ios        # Start dev server and open on iOS simulator (Mac only)
npm run build:apk  # Build standalone Android APK via EAS Cloud Build
npx tsc --noEmit   # Run TypeScript type check across the entire project
```

---

## Troubleshooting Tips

- **Metro Cache Issues**: If you experience stale cache or weird bundle errors, restart with cache cleared:
  ```bash
  npx expo start -c
  ```
- **Image Display**: If images don't display initially, ensure your device has internet access during the first launch so `expo-image` can download and cache them.
- **Port Conflicts**: If port 8081 is busy, specify another port:
  ```bash
  npx expo start --port 8082
  ```

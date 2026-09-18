# Building an installable Android APK

ShopFlow has no backend and no environment secrets, so building it is standard Expo/EAS
process. There are two paths depending on whether you want a cloud build (no Android Studio
needed) or a local build.

## Option A — EAS Build (recommended, builds in the cloud)

1. Create a free Expo account at https://expo.dev if you don't have one.
2. Install the EAS CLI:
   ```bash
   npm install -g eas-cli
   ```
3. Log in and configure the project (creates `eas.json`):
   ```bash
   eas login
   eas build:configure
   ```
4. When prompted for a build profile, choose (or create) a `preview` profile that builds an
   **APK** rather than an **AAB** (AAB is for Play Store submission; APK is directly
   installable). In `eas.json`, that looks like:
   ```json
   {
     "build": {
       "preview": {
         "android": { "buildType": "apk" }
       }
     }
   }
   ```
5. Run the build:
   ```bash
   eas build -p android --profile preview
   ```
   (this is also wired up as `npm run build:apk`). EAS will queue a cloud build and give you a
   download link when it finishes — usually 10-20 minutes.
6. Download the `.apk` from the link (or from your expo.dev dashboard) and install it on an
   Android device with "Install from unknown sources" enabled, or share the link directly.

## Option B — Local build (requires Android Studio / the Android SDK installed)

```bash
npx expo prebuild --platform android
cd android
./gradlew assembleRelease
```

The output APK will be at `android/app/build/outputs/apk/release/app-release.apk`. This path
requires a signing key — for a quick unsigned test build use `assembleDebug` instead, which
outputs to `app/build/outputs/apk/debug/app-debug.apk` and can be installed directly for
testing (not suitable for distribution).

## Before you build for real distribution

- Replace the placeholder `android.package` in `app.json` (`com.frankoge.shopflow`) if you want
  a different application ID.
- Add a real app icon and splash image (`app.json` → `icon`, `splash.image`) — none are bundled
  in this scaffold, so Expo will use its default placeholder.
- Read the "Known limitations" section in `README.md` regarding product images before handing
  the APK to anyone outside your own testing.

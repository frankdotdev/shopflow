# Building an Installable Android APK

I built ShopFlow without external backend dependencies or private secrets, so building a standalone Android APK is straightforward using Expo Application Services (EAS Build) or locally with Gradle.

Follow these steps to produce an installable `.apk` file.

---

## Method 1: EAS Cloud Build (Recommended)

This is the easiest and recommended method. EAS compiles the app in Expo's cloud builders—you don't need Android Studio or a high-end machine installed locally.

### Step 1: Install EAS CLI
Make sure you have Node.js installed, then install EAS CLI globally:
```bash
npm install -g eas-cli
```

### Step 2: Log into your Expo account
If you don't have a free Expo account, create one at [expo.dev](https://expo.dev). Then log in via your terminal:
```bash
eas login
```

### Step 3: Check EAS Configuration
The repository already includes a pre-configured `eas.json` set up for standalone APK builds:
```json
{
  "cli": {
    "version": ">= 24.7.0",
    "appVersionSource": "remote"
  },
  "build": {
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "autoIncrement": true
    }
  }
}
```

> **Important:** Notice `"buildType": "apk"` under the `preview` profile. By default, Expo builds an `.aab` (Android App Bundle for Google Play). Setting `"buildType": "apk"` ensures you get an installable `.apk` file you can download and run directly on your phone.

### Step 4: Run the Build Command
Run the build script I've configured in `package.json`:
```bash
npm run build:apk
```
*(Or run directly: `eas build -p android --profile preview`)*

- When prompted: **"Generate a new Android Keystore?"**, select **Yes** (press Enter).
- EAS will package your code, upload it to the cloud builder, and give you a live build URL.
- Once completed (typically 10–15 minutes), EAS will provide a direct download link and a QR code.
- Open the link on your Android phone, download the `.apk`, allow "Install unknown apps" in your phone settings, and install ShopFlow!

---

## Method 2: Local Build with Android Studio & Gradle

If you have Android Studio, the Android SDK, and Java installed locally, you can build the APK on your own machine:

### 1. Generate the native Android project:
```bash
npx expo prebuild --platform android
```

### 2. Compile the APK using Gradle:
```bash
cd android
./gradlew assembleRelease
```
*(On Windows PowerShell: `.gradlew assembleRelease`)*

The compiled APK will be generated at:
```
android/app/build/outputs/apk/release/app-release.apk
```

If you just want a quick test build without setting up signing keys:
```bash
./gradlew assembleDebug
```
The debug APK will be at `android/app/build/outputs/apk/debug/app-debug.apk`.

---

## Before Distributing to Real Users

1. **Application ID / Package Name**: If you want your own custom package identifier, update `android.package` in `app.json` (currently set to `com.frankoge.shopflow`).
2. **App Icon & Splash Screen**: Update `icon` and `splash.image` in `app.json` with your custom high-resolution PNG brand assets.
3. **Product Images**: Review `docs/DATA_AND_IMAGES.md` to customize product photography or bundle images locally for 100% offline usage.

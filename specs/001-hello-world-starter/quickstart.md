# Quickstart: Hello World Starter

## Goal

Move from a clean checkout to a running Expo-based starter that shows a welcome splash and then a local demo expenses page on Android or Expo Go with the minimum required setup.

## Prerequisites

- Node.js 20 LTS installed.
- JDK 17 installed for Android builds.
- Android Studio with Android SDK and at least one emulator image, or a physical Android device with USB debugging enabled.
- Repository checked out on branch `001-hello-world-starter`.

## Local Setup

1. Install JavaScript dependencies with `yarn`.
2. Start an Android emulator or connect a physical Android device if you plan to use a native Android run.
3. Install Expo Go on your phone if you plan to use the QR-based dev flow.

## Run the Starter

1. Run the starter preflight check with `yarn starter:check`.
2. Start the Expo dev server with `yarn starter:start` or `yarn expo start`.
3. Open the app with Expo Go by scanning the QR code, or run a native Android build with `yarn starter:android`.
4. Confirm the starter flow shows:
   - a welcome splash screen first
   - `ExpenseTracker`
   - the hard-coded greeting message
   - the hard-coded starter or baseline label
   - an automatic transition to a main page with demo expense items loaded from the local device database
   - swipe-to-delete behavior that removes a demo expense from the main page and keeps it removed after reload
   - a shared dark purple high-contrast theme with a sophisticated old-money tone
   - Heroicons-only iconography, including the splash shield icon and the main-page banknotes icon

## Build the Debug-Installable Artifact

1. Run `node scripts/validate-starter-setup.mjs apk` or `yarn starter:check` first to confirm local config and JavaScript dependencies are ready.
2. Run `yarn starter:apk` after the Android SDK and native Android project are available.
3. Retrieve the APK from `android/app/build/outputs/apk/debug/app-debug.apk`.
4. Install it on the emulator or device using adb or the platform install flow of your choice.

## Expected Failure Behavior

- If the Android SDK is missing or not configured, the validation step must fail with a message explaining which environment variable or Android Studio setup step is missing.
- If Android platform-tools are missing, the validation step must fail before Android run or APK commands continue.
- If no emulator or device is available for `yarn starter:android`, the validation step must fail with instructions to boot an emulator or connect a device before retrying.
- If the native Android project is unavailable for `yarn starter:apk`, the validation step must fail with instructions to generate the Android project before retrying.

## Verification Checklist

- The app launches without internet access.
- The first visible screen clearly identifies `ExpenseTracker`.
- The first visible screen clearly shows a starter or baseline label.
- The splash screen transitions to a main page with demo expenses from the local device database and no remote data dependency.
- Swiping an expense card removes it from the UI and it stays removed on the next app load.
- The first visible screen uses the shared dark purple theme consistently rather than screen-local colors.
- Any icons shown on the first screen come only from Heroicons.
- The Expo Go flow launches successfully from the QR code or local Android target.
- A debug-installable APK is generated at the documented path when the native Android build path is used.

## Stable Starter Checkpoint

- Splash screen first, then local demo expenses page second.
- Demo expenses remain local on-device starter data only.
- No SMS, analytics, authentication, or network-sync behavior is allowed in this slice.
- Shared theme tokens and Heroicons remain the only approved visual primitives for the starter experience.
- Splash greeting and baseline copy are hard-coded in shared starter constants.

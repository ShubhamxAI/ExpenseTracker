# Quickstart: Hello World Starter

## Goal

Move from a clean checkout to a running local Android demo and a debug-installable APK with the minimum required setup.

## Prerequisites

- Node.js 20 LTS installed.
- JDK 17 installed for Android builds.
- Android Studio with Android SDK and at least one emulator image, or a physical Android device with USB debugging enabled.
- Repository checked out on branch `001-hello-world-starter`.

## Local Setup

1. Install JavaScript dependencies.
2. Copy `src/config/starterConfig.example.js` to `src/config/starterConfig.local.js`.
3. Edit `greetingMessage` and `baselineLabel` in the local config file if you want to override the defaults before launch.
4. Start an Android emulator or connect a physical Android device.

## Run the Starter

1. Run the starter preflight check.
2. Start Metro.
3. Launch the Android app in debug mode.
4. Confirm the first screen shows:
   - `ExpenseTracker`
   - the configured greeting message
   - the configured starter or baseline label

## Build the Debug-Installable Artifact

1. Run the documented APK build command after the preflight check passes.
2. Retrieve the APK from `android/app/build/outputs/apk/debug/app-debug.apk`.
3. Install it on the emulator or device using the documented adb or Gradle-assisted path.

## Expected Failure Behavior

- If `starterConfig.local.js` is missing, the validation step must fail with a message explaining how to copy the example config and edit the visible text values.
- If the Android SDK is missing or not configured, the validation step must fail with a message explaining which environment variable or Android Studio setup step is missing.
- If no emulator or device is available, the validation step must fail with instructions to boot an emulator or connect a device before retrying.

## Verification Checklist

- The app launches without internet access.
- The first visible screen clearly identifies `ExpenseTracker`.
- The first visible screen clearly shows a starter or baseline label.
- Editing the local config changes the visible greeting or label on next launch.
- A debug-installable APK is generated at the documented path.

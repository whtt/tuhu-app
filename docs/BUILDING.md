# Building

## Requirements

- Node.js 20+
- Android: JDK 21 + Android SDK
- iOS: macOS + Xcode

## Android

```bash
npm ci
npm run android:prepare
cd android
./gradlew assembleDebug
```

APK output: `android/app/build/outputs/apk/debug/app-debug.apk`.

## iOS simulator

```bash
npm ci
npm run ios:prepare
xcodebuild -project ios/App/App.xcodeproj -scheme App -configuration Debug -sdk iphonesimulator -destination 'generic/platform=iOS Simulator' CODE_SIGNING_ALLOWED=NO build
```

## TestFlight

Use `.github/workflows/ios.yml` with the `testflight` target after Apple signing secrets/variables are configured. Never commit `.p12`, provisioning profiles or App Store Connect private keys.
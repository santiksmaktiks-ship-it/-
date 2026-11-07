# NOVA Messenger

NOVA is a cross-platform messenger built with Flutter. This repository replaces the previous project contents with the NOVA application scaffold.

## Features in this starter
- Dark NOVA interface with responsive navigation
- Servers, channels, direct messages and a chat composer
- Theme-ready Material 3 foundation
- GitHub Actions workflow for Android APK and Windows installer EXE

## Build locally
Install Flutter stable and enable Windows desktop support for Windows builds.

```bash
flutter pub get
flutter run
flutter build apk --release
flutter build windows --release
```

The Windows build is packaged by CI with Inno Setup so the release ZIP can contain exactly two deliverables: `NOVA.apk` and `NOVA.exe`.

> This is the initial app scaffold. Voice/video, authentication, persistence, backend sync and end-to-end encryption are not implemented yet.

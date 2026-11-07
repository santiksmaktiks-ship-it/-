# NOVA Messenger

NOVA 0.2 is a Flutter messenger foundation for Android and Windows.

## Included in this update
- White theme by default, with a dark theme switch in Settings.
- Local account registration and login; passwords are stored as SHA-256 hashes with per-account salts.
- Profile name editing and logout.
- Create, select, and delete conversations.
- Separate message history for every conversation.
- Local persistence for accounts, session, chats, and messages.
- Responsive mobile and desktop layout.
- GitHub Actions builds Android APK and Windows installer.

## Important scope
This is a single-device local prototype. Registration is stored on the device and does not create a cloud account. Chats and messages are local and are not delivered to other people or synchronized across devices. Real multi-user messaging requires a backend, authentication API, database, and real-time transport. Voice/video calls are not included in this release.

## Build
Install Flutter stable, then run:

    flutter pub get
    flutter run
    flutter test
    flutter build apk --release
    flutter build windows --release

GitHub Actions packages the Android APK and Windows installer into a ZIP containing exactly NOVA.apk and NOVA.exe.

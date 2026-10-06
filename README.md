# JARVIS AI

Windows desktop AI assistant with:
- real AI chat through OpenAI API
- Russian/English voice recognition
- hold-to-talk microphone button
- text chat
- AI voice replies
- microphone and headphone/device selection
- local settings storage
- Windows EXE build via PyInstaller

## Run
1. Install Python 3.11+.
2. Run `build.bat`.
3. Start `dist\\JarvisAI.exe`.
4. Open Settings and enter your OpenAI API key.

The API key is stored locally in %APPDATA%\\JarvisAssistant\\config.json and is never committed to GitHub.

## Build on GitHub
GitHub Actions builds `JarvisAI.exe` automatically on Windows when code is pushed. The EXE is uploaded as a workflow artifact.

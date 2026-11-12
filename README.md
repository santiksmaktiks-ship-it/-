# NIVA LAUNCHER

![NIVA Launcher](assets/brand/icon.png)

A Windows-first desktop control center for Minecraft profiles and launcher hand-off.

> **Current build: 0.1.0-preview.** NIVA has a real Electron desktop application, local profile metadata, settings, and a Windows x64 packaging pipeline. It is not yet a full Minecraft installer, mod manager, or independent game runtime.

## No Microsoft sign-in inside NIVA

This release does not request Microsoft credentials, implement Microsoft OAuth, or store game-account tokens. The **Open Minecraft Launcher** action opens a detected desktop installation of the official launcher; when it cannot find one at a standard path, it opens the official [Minecraft download page](https://www.minecraft.net/en-us/download.jsp).

NIVA does not bypass Minecraft account or license requirements. Sign-in and the actual Play action remain inside the official Minecraft Launcher, whose own account requirements still apply.

## What works in this preview

- Electron + React + TypeScript desktop shell for Windows x64.
- Hardened BrowserWindow: context isolation, sandbox, no Node integration in renderer, IPC allowlist, and Content Security Policy.
- Local profile cards for Vanilla, Fabric, Forge, NeoForge, and Quilt metadata.
- Profile create, select, and delete with schema validation and atomic local-state writes.
- Dark/light theme, reduced-motion preference, and open-data-folder action.
- Official Minecraft Launcher hand-off, without implementing sign-in inside NIVA.
- Windows x64 NSIS installer EXE and portable EXE build targets.
- SHA-256 generation and PE x64 artifact validation in CI.

## Not implemented yet

- Downloading or installing Minecraft versions and Java runtimes.
- Creating isolated Minecraft instances or moving game files.
- Actually installing Fabric/Forge/NeoForge/Quilt.
- Modrinth search or mod installation.
- Modpack import/export, skins, backups, integrity repair, crash diagnostics, or in-app game launching.
- Windows desktop manual acceptance on a clean Windows 10/11 installation.

Profile cards in 0.1.0 are metadata only. They do not create game directories or install mods. NIVA does not delete or modify Minecraft saves, configs, screenshots, or game files.

## Build on Windows

Requirements: Windows x64, Node.js 22.12 or newer, and npm.

```powershell
npm install
npm test
npm run build
npm run dist:win
```

Build output is written to `release/`:

- `NIVA-Launcher-Setup-0.1.0-x64.exe`
- `NIVA-Launcher-Portable-0.1.0-x64.exe`
- `SHA256SUMS.txt`

GitHub Actions uploads the actual produced files as a build artifact.

## Development

```powershell
npm install
npm run dev
```

## Security and user data

- Local NIVA state is written to Electron's `userData` directory.
- Profile deletion removes only NIVA metadata, never Minecraft worlds or game files.
- No tokens or API secrets are stored by this preview.
- Renderer access is restricted to a narrow preload API.
- Imported archives and remote mod services are not enabled in this preview.

See [SECURITY.md](SECURITY.md), [project status](docs/PROJECT_STATUS.md), and [Windows release checklist](docs/WINDOWS_RELEASE_CHECKLIST.md).

## Branding

See [brand assets](docs/BRAND_ASSETS.md). The original NIVA mark is supplied as SVG, PNG, and Windows ICO.

## Repository history

The previous Flutter project was removed from the current `main` tree. Historical commits remain available for auditability; see [repository cleanup](docs/REPOSITORY_CLEANUP.md).

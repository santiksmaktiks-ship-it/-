# NIVA LAUNCHER

A secure, Windows-first Minecraft launcher for Windows 10/11 x64.

> **Project status: Stage 0 is blocked.** This repository has been reset to the NIVA project baseline, but the application has not been implemented and there is no installer or release to download.

## Product direction

NIVA is planned as an Electron + React + TypeScript desktop application. The target feature set includes:

- Minecraft Vanilla and the Fabric, Forge, NeoForge, and Quilt loaders.
- Isolated profiles and instances, with safe import/export and backups.
- Official Microsoft OAuth using Authorization Code + PKCE.
- Mod discovery and management through official Modrinth interfaces.
- CurseForge integration only when API access and the required permission are confirmed.
- Skin library and 3D preview, Java/RAM settings, download manager, integrity checks, diagnostics, and safe repair.
- Windows x64 NSIS installer and portable ZIP, built and tested through GitHub Actions.

## Non-negotiable safety rules

- Never ship fake authentication, mock API success, or placeholder production actions.
- Never store credentials, access tokens, refresh tokens, or API keys in source control.
- Keep filesystem, network, credentials, and process control in Electron's main process.
- Validate IPC inputs and imported archives. Use staging, verification, backup, atomic replacement, and rollback for installations.
- Do not delete worlds, saves, configs, screenshots, or user data during repair.
- Do not publish an installer as ready until Windows 10/11 x64 testing has actually passed.

## Current gate

See [Project status](docs/PROJECT_STATUS.md) and [Access matrix](docs/ACCESS_MATRIX.md). Implementation is intentionally paused until the Stage 0 blockers are resolved. This is required by the project brief; missing access or test evidence must not be disguised as a completed feature.

## Planned engineering stack

Electron, React, TypeScript strict, Vite, Zod at trust boundaries, Vitest, Playwright, electron-builder, and GitHub Actions on Windows runners. Final dependency versions will be selected and pinned during Stage 1.

## Repository

The current default branch is `main`. The previous Flutter application has been removed from the current branch and replaced with this NIVA project baseline. Its historical commits have intentionally been retained for auditability; see [repository cleanup](docs/REPOSITORY_CLEANUP.md).

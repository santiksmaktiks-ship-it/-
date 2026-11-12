# Project status

**Current milestone: 0.1.0 preview implementation and Windows EXE packaging.**

The owner has removed the requirement for Microsoft sign-in inside NIVA. The app will hand off to the official Minecraft Launcher instead. It does not implement cracked/offline authentication or bypass account/licence requirements.

## Implemented in the current branch

- Electron + React + TypeScript + Vite application shell.
- Hardened BrowserWindow with context isolation, sandbox, no renderer Node integration, CSP, and navigation restrictions.
- Narrow preload API and validated IPC handlers.
- Local NIVA state with schema validation and atomic writes.
- Profile metadata create/select/delete for Vanilla, Fabric, Forge, NeoForge, and Quilt labels.
- Dark/light theme and reduced-motion settings.
- Open user data folder.
- Official Minecraft Launcher hand-off or fallback to the official download page.
- Original NIVA SVG, 512px PNG, and multi-resolution Windows ICO.
- Unit tests for profile validation and state transitions.
- Windows NSIS + portable EXE workflow, PE architecture validation, and SHA-256 generation.

## Preview limitations

- Profile cards are metadata only; no Minecraft game directory is created or modified.
- No Minecraft/Java downloader, loader installer, mod manager, modpack import, skin manager, backup/repair, or diagnostics yet.
- No Microsoft OAuth inside NIVA. Authentication and the Play operation are delegated to the official launcher.
- CurseForge is excluded; Modrinth is not yet implemented.
- Windows CI packaging does not replace manual testing on a clean Windows 10/11 desktop.

## Local validation completed before commit

- `node --check` passed for main, preload, shared profile model, and dev script.
- `npm test`: 6 tests passed, 0 failed.
- Full renderer typecheck and Windows EXE build must be confirmed by the new GitHub Actions workflow.

## Acceptance checklist

- [x] GitHub write/admin access.
- [x] Windows x64 CI runner toolchain verified.
- [x] Microsoft authentication removed from NIVA 0.1.0 scope at owner's request.
- [x] CurseForge excluded until official permission exists.
- [x] Original app icon committed in SVG, PNG, and ICO formats.
- [x] Electron/React/TypeScript app shell committed.
- [x] Profile metadata flows and settings implemented.
- [x] Unit tests created and passed locally.
- [ ] GitHub Actions renderer typecheck and build passed.
- [ ] NSIS installer EXE and portable EXE successfully produced by Windows CI.
- [ ] EXE/ZIP checksums and PE architecture validated by CI.
- [ ] Downloaded artifacts manually installed and launched on clean Windows 10/11 x64.

## Next steps

1. Fix any failures in the first Windows build workflow.
2. Retrieve the generated EXE and portable artifact for the owner.
3. Wire the original ICO into the verified installer and complete clean Windows tests.
4. Continue with real Minecraft metadata/install support only after 0.1.0 packaging is proven.

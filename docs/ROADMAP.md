# Delivery roadmap

Development follows the 21 gated stages in the supplied NIVA LAUNCHER master brief. Each stage must include its plan, file changes, architecture decisions, tests and actual results, known limitations, and an updated acceptance checklist. A stage is not complete merely because files were created.

## Gate 0: prerequisites

Verify repository permissions, Windows 10/11 x64 test access, Microsoft App Registration, CurseForge permission/key or a documented exclusion, official API compliance, original artwork permission, and legal test accounts.

**Current result:** blocked. See [Project status](PROJECT_STATUS.md).

## Remaining stages

1. Application shell: Electron main/preload/renderer, hardened BrowserWindow, CSP, IPC allowlist, logging, global error handling, design-system baseline, CI skeleton.
2. Settings, themes, sidebar, persistence, and localization.
3. Profiles and isolated instances, including safe CRUD, backup, import, and export.
4. Minecraft versions, Java discovery/runtime, memory configuration, and Vanilla launch.
5. Fabric, Forge, NeoForge, and Quilt installation and launch.
6. Official Microsoft OAuth, encrypted token storage, and multi-account management.
7. Modrinth API adapter and catalog discovery.
8. CurseForge adapter only if access is approved; otherwise keep it explicitly disabled.
9. Dependency resolution, compatibility checks, and conflict planning.
10. Mod manager with safe install, update, enable, disable, quarantine, and rollback.
11. Modpack import/export with archive and override safety.
12. Skin import, validation, 3D preview, and official account application.
13. Backup, restore, integrity verification, and safe repair.
14. Crash diagnostics and evidence-based repair plans.
15. Download queue, retry/resume, checksums, cancellation, and cache.
16. UI/UX, accessibility, localization, and performance polish.
17. Security and stability testing, including IPC/path/archive fuzzing and token redaction.
18. Windows x64 NSIS and portable packaging, SHA-256, and clean-machine validation.
19. GitHub Actions build/test workflow and verified GitHub Release.
20. Post-release install, update, rollback, portable-mode, and uninstall checks.

The detailed requirements and acceptance scenarios remain governed by the supplied master brief. No stage may silently weaken its security or user-data protections.

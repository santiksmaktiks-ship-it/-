# Architecture and scope decisions

These decisions define the first distributable NIVA preview and keep authentication, game files, and external services honest.

## 0.1.0 preview scope

### Microsoft authentication: removed from NIVA

- The owner has explicitly asked for a Windows EXE without Microsoft sign-in built into NIVA.
- NIVA will not ask for Microsoft passwords, implement Microsoft OAuth, store access/refresh tokens, or relay authentication through another service.
- The initial app hands off to the official Minecraft Launcher. Account sign-in and game licensing remain governed by that official client.
- No cracked, offline-auth, token-reuse, or licensing-bypass mode will be implemented.

### CurseForge: excluded

- CurseForge is not part of the initial release.
- No scraping, undocumented endpoints, key sharing, or file redistribution workaround is permitted.
- Reconsider inclusion only after official permission and credentials are obtained and the integration passes contract tests.

### Modrinth

- Modrinth is planned for a later stage through the official documented API only.
- Respect documented rate limits and attribution requirements. No scraping.

## Current preview behavior

- Local profile cards store only name, loader label, Minecraft version label, and creation date.
- They do not install Minecraft, create instances, manage mods, or touch the user's `.minecraft` folder.
- The official-launcher action looks for a legacy desktop launcher executable at common paths. If none is found, it opens the official Minecraft download page.
- Settings and profile metadata are stored under Electron `userData`.

## Build and test strategy

- Use GitHub Actions on Windows Server 2025 x64 for deterministic Windows packaging and automated checks.
- Build NSIS setup EXE and portable EXE.
- Validate output names, PE machine type (AMD64), and SHA-256 checksums.
- CI success is not equivalent to acceptance on clean Windows 10/11 desktop systems. Install, launch, update, uninstall, and portable-mode manual checks remain release gates.
- Unsigned builds must be identified as unsigned. Code signing is optional unless later supplied by the owner.

## GitHub Actions runtime

- Pin `actions/checkout` to commit `3d3c42e5aac5ba805825da76410c181273ba90b1` (v7.0.1).
- Pin `actions/setup-node` to commit `949feb2413d6458794dcd2491c4babbbce0c15c1` (v7.1.0).
- Pin `actions/upload-artifact` to commit `cf430e030ddbb5b0abf93d22962f4752f3646cd9` (v7.0.2).
- Dependabot checks GitHub Actions and npm dependencies weekly.

## Security defaults

- No telemetry without explicit consent.
- No credentials or tokens in source control.
- Renderer has no direct Node.js, filesystem, process, or shell access.
- Validate IPC input and persist local state with atomic writes.
- Preserve user worlds, saves, configurations, and screenshots during repair and uninstall.
- Destructive actions must be explicit and reversible where possible.

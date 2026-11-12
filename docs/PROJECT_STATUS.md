# Project status

**Current gate: Stage 0, blocked.**

Repository bootstrap, legacy-project cleanup, scope decisions, and a successful Windows x64 CI toolchain probe are committed. The NIVA desktop application itself has not been implemented. Stage 1 must not be reported as started or completed until the master brief's Stage 0 gate is satisfied.

## Verified

- The connected GitHub identity has repository admin and write access.
- Repository: `santiksmaktiks-ship-it/-`.
- Default branch: `main`.
- Previous Flutter source and its old workflow are absent from the current branch.
- Current development environment is Linux x86_64 with Node.js v22.16.0 and Git 2.47.3.
- Windows x64 GitHub Actions readiness run #5 passed: [run 43259647479](https://github.com/santiksmaktiks-ship-it/-/actions/runs/43259647479).
- Updated Windows x64 GitHub Actions readiness run #6 passed: [run 43269820705](https://github.com/santiksmaktiks-ship-it/-/actions/runs/43269820705).
- Pinned-action Windows x64 readiness run #10 passed: [run 43283097663](https://github.com/santiksmaktiks-ship-it/-/actions/runs/43283097663).
- Readiness workflow refinement run #18 passed: [run 43284543150](https://github.com/santiksmaktiks-ship-it/-/actions/runs/43284543150).
- Run #6 used a Microsoft Windows Server 2025 x64 runner, reported OS build 10.0.26100, Node.js v22.23.4, npm 10.9.9, and Git 2.56.0.windows.4.
- All steps in run #6 completed successfully. Its workflow log did not show the Node 20 deprecation warning seen in run #5.
- The workflow pins actions/checkout and actions/setup-node to full commit SHAs. Runs #10 and #18 confirmed those exact SHAs were checked out and the jobs passed.
- The workflow now triggers on application/build configuration changes and pull requests, and writes a concise Windows runner report to the Actions job summary.
- A clean Windows 10/11 desktop acceptance checklist is committed at `docs/WINDOWS_RELEASE_CHECKLIST.md`.
- The initial scope decision excludes CurseForge until official access is approved.
- Original NIVA artwork is committed as SVG, PNG, and multi-resolution Windows ICO at `assets/brand/`; see [Brand assets](BRAND_ASSETS.md).

## Blocking items

1. **Clean Windows desktop testing:** CI runner readiness is now verified, but the runner was Windows Server 2025, not a clean consumer Windows 10/11 desktop. Install, launch, upgrade, uninstall, and portable-mode acceptance remain untested on those target desktop environments.
2. **Microsoft OAuth:** Azure App Registration and a real public-client Application (client) ID are not confirmed. Authentication must remain unavailable until configured and tested with a legitimate account.
3. **Release acceptance:** there is no implemented app, installer, portable package, or verified release. Code signing is optional; clean Windows desktop validation is mandatory.

## Decisions made autonomously

- CurseForge is excluded from the initial release unless official permission and API credentials are later obtained.
- Microsoft OAuth remains a required product capability and will use the official Authorization Code Flow with PKCE. No fake account, placeholder token, or third-party authentication relay will be used.
- Modrinth integration will use the official documented API only.
- GitHub Actions Windows x64 jobs will be used for automated Windows builds and checks. Separate clean desktop testing is still mandatory.
- GitHub Actions checkout/setup actions were updated to Node 24-compatible releases to remove the previous Node 20 runtime warning.
- No secrets are stored in source control.

See [Architecture decisions](DECISIONS.md), [Access matrix](ACCESS_MATRIX.md), and [Windows release checklist](WINDOWS_RELEASE_CHECKLIST.md).

## Stage 0 acceptance checklist

- [x] GitHub repository exists and write/admin access verified.
- [x] Windows x64 CI runner toolchain verified.
- [ ] Clean Windows 10/11 x64 desktop test path confirmed and executed.
- [ ] Azure App Registration client ID confirmed.
- [x] CurseForge explicitly excluded from the initial release pending approval.
- [x] Original project identity and target stack recorded.
- [x] Release and manual test plan documented.

## Rule for continuing

Do not create fake authentication, fake API responses, production buttons backed by no-op handlers, or a release that implies the launcher is functional. Do not delete worlds, saves, configurations, screenshots, or backups during repair/uninstall. Record blockers honestly.

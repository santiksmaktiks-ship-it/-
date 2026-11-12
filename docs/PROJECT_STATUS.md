# Project status

**Current gate: Stage 0, blocked.**

Repository bootstrap, legacy-project cleanup, scope decisions, and the Windows CI readiness probe are now committed. The NIVA desktop application itself has not been implemented. Stage 1 must not be reported as started or completed until the master brief's Stage 0 gate is satisfied.

## Verified

- The connected GitHub identity has repository admin and write access.
- Repository: `santiksmaktiks-ship-it/-`.
- Default branch: `main`.
- Previous Flutter source and its old workflow are absent from the current branch.
- Current development environment is Linux x86_64 with Node.js v22.16.0 and Git 2.47.3.
- A Windows x64 GitHub Actions readiness workflow has been committed at `.github/workflows/windows-readiness.yml`.
- A clean Windows 10/11 manual acceptance checklist has been committed at `docs/WINDOWS_RELEASE_CHECKLIST.md`.
- The initial scope decision excludes CurseForge until official access is approved.

## Blocking items

1. **Clean Windows desktop testing:** the GitHub-hosted Windows runner can validate CI tooling, but it is not proof of install/launch behavior on clean Windows 10 and Windows 11 desktop systems. Those manual checks remain required before release.
2. **Microsoft OAuth:** Azure App Registration and a real public-client Application (client) ID are not confirmed. Authentication must remain unavailable until configured and tested with a legitimate account.
3. **Release acceptance:** there is no implemented app, installer, portable package, or verified release. Code signing is optional; clean Windows validation is mandatory.

## Decisions made autonomously

- CurseForge is excluded from the initial release unless official permission and API credentials are later obtained.
- Microsoft OAuth remains a required product capability and will use the official Authorization Code Flow with PKCE. No fake account, placeholder token, or third-party authentication relay will be used.
- Modrinth integration will use the official documented API only.
- GitHub Actions Windows x64 jobs will be used for automated Windows builds and checks. Separate clean desktop testing is still mandatory.
- No secrets are stored in source control.

See [Architecture decisions](DECISIONS.md), [Access matrix](ACCESS_MATRIX.md), and [Windows release checklist](WINDOWS_RELEASE_CHECKLIST.md).

## Stage 0 acceptance checklist

- [x] GitHub repository exists and write/admin access verified.
- [ ] Clean Windows 10/11 x64 desktop test path confirmed and executed.
- [ ] Azure App Registration client ID confirmed.
- [x] CurseForge explicitly excluded from the initial release pending approval.
- [x] Original project identity and target stack recorded.
- [x] Release and manual test plan documented.

## Rule for continuing

Do not create fake authentication, fake API responses, production buttons backed by no-op handlers, or a release that implies the launcher is functional. Do not delete worlds, saves, configurations, screenshots, or backups during repair/uninstall. Record blockers honestly.

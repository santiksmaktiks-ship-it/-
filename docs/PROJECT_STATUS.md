# Project status

**Current gate: Stage 0, blocked.**

The repository bootstrap and legacy-project cleanup are complete. The NIVA application itself has not been implemented. Work must not advance to Stage 1 until the Stage 0 acceptance criteria in the master brief are satisfied or an explicit, documented exception is approved.

## Verified

- The connected GitHub identity can read and write this repository and has admin permission.
- Repository: `santiksmaktiks-ship-it/-`.
- Default branch: `main`.
- The previous branch contained a Flutter application and a Flutter-oriented GitHub Actions workflow.
- The available development environment reported Linux x86_64, Node.js v22.16.0, and Git 2.47.3. This is not a Windows 10/11 x64 test environment.

## Blocking items

1. **Windows validation:** no Windows 10/11 x64 test machine or runner session has been made available for interactive/manual acceptance testing. A Windows GitHub Actions runner can be configured later, but CI configuration alone is not proof that the packaged application works on a clean Windows machine.
2. **Microsoft OAuth:** Azure App Registration and the public-client Application (client) ID have not been confirmed. Do not invent an ID or implement a bypass.
3. **CurseForge:** API approval/permission and an API key have not been confirmed. CurseForge functionality must remain disabled until permission is established.
4. **Release acceptance:** there is no Windows installer, portable package, signing certificate, or verified release. Code signing is optional in the brief; Windows smoke testing is not.

## Unblocked decisions

- The repository is available for development.
- The requested stack is Electron + React + TypeScript + Vite.
- An original NIVA icon can be designed as project artwork; it must not imitate third-party marks.
- Modrinth, Mojang, Microsoft, and other integrations must use their official documented interfaces and applicable terms.

## Stage 0 acceptance checklist

- [x] GitHub repository exists and write/admin access verified.
- [ ] Windows 10/11 x64 test path confirmed.
- [ ] Azure App Registration client ID confirmed.
- [ ] CurseForge permission and key confirmed, or integration explicitly excluded from the initial release.
- [x] Original project identity and target stack recorded.
- [ ] Release and manual test plan confirmed.

## Rule for continuing

Until the open items are resolved, do not create fake authentication, fake service responses, production buttons backed by no-op handlers, or a release that implies the launcher is functional. Record blockers honestly. The application build gate starts only after Stage 0 passes.

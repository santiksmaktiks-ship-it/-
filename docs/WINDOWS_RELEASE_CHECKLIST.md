# Windows release acceptance checklist

This checklist is intentionally separate from GitHub Actions. A green CI run is necessary but not sufficient for a Windows desktop release.

## Environment

- [ ] Clean Windows 10 x64 machine or VM, with no Node.js installed.
- [ ] Clean Windows 11 x64 machine or VM, with no Node.js installed.
- [ ] Standard non-administrator user account.
- [ ] Sufficient free disk space and ordinary user-writable install location.
- [ ] Network available, then repeat key negative tests with network disabled.

## Installer

- [ ] NSIS installer starts and completes without administrator elevation unless an explicitly documented install scope requires it.
- [ ] App launches from Start Menu and desktop shortcut.
- [ ] App data is stored under the documented user data location.
- [ ] Uninstaller does not silently delete user worlds, saves, configurations, screenshots, or backups.
- [ ] Upgrade from previous version preserves user data.

## Portable package

- [ ] ZIP extracts to a user-writable directory.
- [ ] Portable app launches without Node.js or admin rights.
- [ ] Portable data remains inside the portable data directory.
- [ ] Updating the portable package preserves existing portable data.

## Security and runtime

- [ ] Microsoft OAuth succeeds with a real owner-controlled account and registered client.
- [ ] No tokens appear in logs, renderer state, diagnostics, or crash reports.
- [ ] Network/TLS/API failures produce clear errors and safe rollback.
- [ ] Repair and restore preserve saves/config unless the user explicitly selects otherwise.
- [ ] SHA-256 hashes match published release assets.

## Evidence to retain

For each test, record OS edition/build, architecture, app version, test date, steps, expected result, actual result, log/diagnostic reference, and pass/fail. Do not publish a release until mandatory checks pass.

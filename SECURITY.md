# Security policy

## Reporting a vulnerability

Do not publish exploitable details in a public issue. Report suspected vulnerabilities privately to the repository owner through GitHub's private vulnerability reporting feature, when enabled.

## Security requirements

- No secrets or user tokens in source control, logs, crash reports, or renderer state.
- Microsoft authentication must use the official OAuth flow with PKCE and a registered client.
- CurseForge must remain unavailable until API permission and credentials are confirmed.
- Renderer must not receive Node.js, filesystem, process, or credential access.
- All IPC inputs, network responses, paths, and archive entries must be validated.
- Archive extraction must defend against path traversal and resource-exhaustion attacks.
- Repair and restore operations must preserve user worlds and configuration, with backup and rollback.
- Release artifacts must be built by CI, checksummed, and tested on Windows before being described as ready.

## Supported platform

The target is Windows 10/11 x64. Security claims remain unverified until the corresponding implementation and test evidence exist.

# Security policy

## Reporting a vulnerability

Do not publish exploitable details in a public issue. Report suspected vulnerabilities privately to the repository owner through GitHub's private vulnerability reporting feature, when enabled.

## Security requirements

- No passwords, account tokens, API keys, certificates, or private keys in source control.
- NIVA 0.1.0 does not implement Microsoft authentication and does not handle Minecraft credentials.
- Do not implement cracked/offline authentication, token reuse, third-party auth relays, or licensing bypasses.
- Renderer must not receive Node.js, filesystem, process, or shell access.
- All IPC inputs and local state are validated.
- Persist state using atomic writes and never overwrite unreadable state without recovery.
- Do not delete Minecraft worlds, saves, configs, screenshots, or backups during profile deletion or repair.
- Archive extraction, network services, and mod installation are not enabled in the preview. They must be threat-modeled and tested before implementation.
- GitHub Actions are pinned to reviewed full commit SHAs, with least-privilege contents access.
- Release artifacts must be built by CI, checksummed, and tested on Windows before being described as ready.

## Supported platform

The target is Windows 10/11 x64. CI packaging checks are not a substitute for installation and launch testing on clean Windows desktop systems.

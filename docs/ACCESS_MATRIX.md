# Access and environment matrix

| Requirement | State | Evidence / action |
|---|---|---|
| GitHub repository | Available | Connected account has admin/write permission on `santiksmaktiks-ship-it/-`. |
| GitHub default branch | Available | `main`. |
| Windows x64 CI runner | Verified | Run [#6](https://github.com/santiksmaktiks-ship-it/-/actions/runs/43269820705) succeeded on Microsoft Windows Server 2025 x64; OS build 10.0.26100. |
| Windows toolchain | Verified | Run #6: Node.js v22.23.4, npm 10.9.9, Git 2.56.0.windows.4. |
| Clean Windows 10/11 desktop validation | Missing | Windows Server runner is not a clean consumer desktop. Execute [Windows release checklist](WINDOWS_RELEASE_CHECKLIST.md) on clean Windows 10 and Windows 11 x64 systems. |
| Azure App Registration | Unconfirmed | No public-client Application (client) ID has been confirmed. Live sign-in must remain unavailable until a real registration is configured. |
| Microsoft OAuth production flow | Blocked | Requires real client registration and live Microsoft/Xbox/Minecraft account-flow testing. |
| CurseForge API permission/key | Excluded from initial release | Explicit scope decision: no CurseForge integration until official permission and credentials are obtained. No scraping. |
| Modrinth | Planned, not yet contract-tested | Use official API documentation, respect rate limits, and add contract tests before claiming support. |
| Code-signing certificate | Not supplied | Optional per brief. Unsigned builds must be labelled honestly. |
| NIVA icon | Not yet created | Create original artwork; do not imitate third-party marks. |
| Legal test accounts | Not supplied | Use only owner-controlled, legitimately licensed accounts for authentication and launch testing. |

## Secret handling

- Never put OAuth tokens, API keys, passwords, certificates, or private keys in commits or issue comments.
- Use OS-protected storage at runtime and GitHub Actions Secrets for CI credentials where applicable.
- Keep the renderer isolated from credentials.
- Redact authentication headers, cookies, tokens, and API keys from application logs and exported diagnostics.

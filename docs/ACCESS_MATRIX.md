# Access and environment matrix

| Requirement | State | Evidence / action |
|---|---|---|
| GitHub repository | Available | Connected account has admin/write permission on `santiksmaktiks-ship-it/-`. |
| GitHub default branch | Available | `main`. |
| Windows CI runner | Configured, awaiting run evidence | `.github/workflows/windows-readiness.yml` uses a Windows x64 GitHub-hosted runner to inspect toolchain availability. |
| Clean Windows 10/11 desktop validation | Missing | Must execute the manual checks in [Windows release checklist](WINDOWS_RELEASE_CHECKLIST.md). A CI runner alone is not desktop acceptance. |
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

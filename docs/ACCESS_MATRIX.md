# Access and environment matrix

| Requirement | State | Evidence / action |
|---|---|---|
| GitHub repository | Available | Connected account can read/write and has admin permission on `santiksmaktiks-ship-it/-`. |
| GitHub default branch | Available | `main`. |
| Windows 10/11 x64 manual test environment | Missing | Current execution environment is Linux x86_64. Arrange a clean Windows x64 test machine/session before installer acceptance. |
| Azure App Registration | Unconfirmed | Owner must create or identify the registration and provide the public-client Application (client) ID through project configuration. Never commit credentials. |
| Microsoft OAuth production flow | Blocked | Depends on confirmed client registration and real Microsoft/Xbox/Minecraft account-flow testing. |
| CurseForge API permission | Unconfirmed | Do not use scraping or unapproved endpoints. |
| CurseForge API key | Missing | If permission is granted, store the key as a GitHub Actions secret or local secret, never in Git. Otherwise keep integration disabled. |
| Modrinth | Not yet contract-tested | Use official API documentation and respect rate limits. Verify during its implementation stage. |
| Code-signing certificate | Not supplied | Optional per brief. Unsigned Windows builds must be labelled honestly. |
| NIVA icon | Not yet created | Create original artwork during implementation. |
| Legal test accounts | Not supplied | Use only owner-controlled, legitimately licensed accounts for authentication and launch testing. |

## Secret handling

- Never put OAuth tokens, API keys, passwords, certificates, or private keys in commits or issue comments.
- Use local environment variables or GitHub Actions Secrets where appropriate.
- Keep the renderer isolated from credentials.
- Redact authentication headers, cookies, tokens, and API keys from application logs and exported diagnostics.

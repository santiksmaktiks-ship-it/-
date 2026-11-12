# Architecture and scope decisions

These decisions keep the initial release honest and avoid integrations that cannot currently be operated lawfully or tested.

## Initial release scope

### CurseForge: excluded until approval

- CurseForge is not part of the initial release.
- No scraping, undocumented endpoints, key sharing, or file redistribution workaround is permitted.
- The UI must not show a working CurseForge search/install path while access is unavailable.
- Reconsider inclusion only after the project owner obtains the required API permission and credentials and the integration passes contract tests.

### Microsoft account authentication: mandatory, but blocked on registration

- Use the official Microsoft OAuth Authorization Code Flow with PKCE.
- The public-client Application (client) ID must be supplied by a real Azure App Registration before live authentication can be enabled.
- Do not generate a made-up ID, embed a client secret, use third-party auth relays, or create a fake signed-in account.
- Until configured, authenticated launch features must report a clear setup error and remain unavailable.

### Modrinth

- Use the official documented API only.
- Respect documented rate limits and attribution/branding requirements.
- Do not scrape web pages to fill gaps in API access.

## Build and test strategy

- Use GitHub Actions on a Windows x64 runner for repeatable Windows packaging and automated checks.
- A CI runner result is not equivalent to acceptance on a clean Windows 10/11 desktop.
- Before release, perform a separate manual smoke test on clean Windows 10 and Windows 11 x64 systems, including install, launch, update, uninstall, and portable-mode checks.
- Unsigned builds must be identified as unsigned. Code signing is optional unless later supplied by the owner.

## Security defaults

- No telemetry without explicit consent.
- No credentials or tokens in source control.
- Keep secrets in OS-protected storage and keep renderer isolated from them.
- Preserve user worlds, saves, configurations, and screenshots during repair and uninstall.
- Make destructive operations explicit, backed up, and reversible where possible.

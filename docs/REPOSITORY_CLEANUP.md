# Repository cleanup record

## Change

The current `main` tree was replaced with the NIVA LAUNCHER project baseline.

The previous tree contained these tracked files:

- `.github/workflows/build.yml`
- `README.md`
- `analysis_options.yaml`
- `lib/main.dart`
- `pubspec.yaml`
- `test/widget_test.dart`

These Flutter project files and the old workflow are absent from the new `main` tree.

## History

Git commit history was intentionally retained. This avoids rewriting shared history and preserves auditability. Consequently, removed files may still be viewable from older commits. This change removes them from the current branch; it does not purge historical Git objects.

## User-data boundary

Only repository-tracked source files were replaced. No external Minecraft installation, local user profile, world, save, settings, screenshot, or other machine data was accessed or modified.

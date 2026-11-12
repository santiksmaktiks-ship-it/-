# NIVA brand assets

## Original mark

The NIVA mark is an original geometric design created for this project. It does not use Minecraft, Mojang, Microsoft, or another launcher’s logo.

## Committed files

- `assets/brand/niva-mark.svg`: editable vector master.
- `assets/brand/icon.png`: 512 × 512 PNG application artwork.
- `assets/brand/icon.ico`: Windows ICO containing 256, 128, 64, 48, 32, and 16 pixel representations.

The PNG and ICO were rasterized from the SVG master and checked locally for file format and dimensions before being committed. The files are branding assets only; they have not yet been wired into an Electron build because the application shell has not started.

## Palette

| Token | Hex | Use |
|---|---|---|
| Midnight | `#0B1224` | Background tile |
| NIVA teal | `#42D9C0` | Primary mark |
| Ice mint | `#B9F6E8` | Highlight plane |
| Star ice | `#D8F3FF` | North-star accent |

## Usage

- Use the SVG master for scalable UI and documentation.
- Use the PNG for store/repository previews and application surfaces.
- Use the ICO for Windows executable and shortcut icon configuration.
- Preserve the mark's proportions and colors. Do not add Microsoft, Mojang, Minecraft, or third-party partner marks.
- Do not imply endorsement by Mojang or Microsoft.

## Acceptance still outstanding

The icon files exist in GitHub. Their integration into electron-builder and validation inside an actual Windows installer remain Stage 18 work.

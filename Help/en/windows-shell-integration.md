# Windows: Explorer menu and Open with

Integration is **Windows-only** (HKCU registry, current user).

## Context menu

In **Settings → General**, enable **Add to Explorer context menu** or click **Register now**:

- **Open in Velorix** — opens the file in the editor (`--velorix-shell-open`).
- **Quick convert to MP4** — ffmpeg export (`--velorix-shell-quick-mp4`).

Common video extensions are supported (`.mp4`, `.mkv`, `.webm`, …). The `Setup.exe` installer registers the menu after install; portable builds need manual registration.

## Open with

The separate **Show in Open with** option lists Velorix for video files. It does **not** set a default app.

To pick a default player or editor: use **Default apps…** in Settings (or **Windows Settings → Apps → Default apps**).

## Second instance

If Velorix is already running, a second launch from Explorer forwards the path to the existing window (single-instance).

## See also

[owner-manual-smoke.md](owner-manual-smoke.md) (manual verification on hardware) · [packaged-windows-smoke.md](packaged-windows-smoke.md) (post-`pack:dir` verification).

# Windows: Explorer menu and Open with

Integration is **Windows-only** (HKCU registry, current user).

## Context menu

In **Settings → General**, enable **Add to Explorer context menu** or click **Register now**:

- **Open in FluxAlloy** — opens the file in the editor (`--fluxalloy-shell-open`).
- **Quick convert to MP4** — ffmpeg export (`--fluxalloy-shell-quick-mp4`).

Common video extensions are supported (`.mp4`, `.mkv`, `.webm`, …). The `Setup.exe` installer registers the menu after install; portable builds need manual registration.

## Open with

The separate **Show in Open with** option lists FluxAlloy for video files. It does **not** set a default app.

To pick a default player or editor: use **Default apps…** in Settings (or **Windows Settings → Apps → Default apps**).

## Second instance

If FluxAlloy is already running, a second launch from Explorer forwards the path to the existing window (single-instance).

See also [workflows-planner-scenarios.md](workflows-planner-scenarios.md), [getting-started.md](getting-started.md). Owner manual **Windows shell** checklist in Support ZIP — [owner-manual-smoke.md](owner-manual-smoke.md) (`ownerManualSmoke:`); packaged open-file — [packaged-windows-smoke.md](../packaged-windows-smoke.md).

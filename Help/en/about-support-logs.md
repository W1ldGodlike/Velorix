# About, logs, and support

## Version

The About dialog shows the app build number and the embedded page engine version — handy when talking to support.

## Log folder

The dialog links to the **log folder**. Files stay small; you can attach them to an email when asked.

## Support archive

The **archive** button packs several diagnostic files into one zip so you do not have to pick them manually.

`diagnostics.txt` includes:

- **`ownerHardwareChecklist:`** — owner hardware checklist on your machine (NEON theme, HiDPI, HW, scenario, §7.5 sprite, packaged smoke for your OS, scheduler, Windows shell); **ru** canon in the zip; English UI copies EN locale strings to the clipboard.
- **`winPackagedSmoke:`** / **`linuxPackagedSmoke:`** / **`macosPackagedSmoke:`** — packaged checklists (Windows always; Linux/macOS when built on that OS); see [packaged-windows-smoke.md](packaged-windows-smoke.md), [packaged-linux-smoke.md](packaged-linux-smoke.md), [packaged-macos-smoke.md](packaged-macos-smoke.md).
- **`terminalHints:`** — terminal hints snapshot for support; see [ffmpeg-terminal-hints.md](ffmpeg-terminal-hints.md) and [logging-and-diagnostics.md](logging-and-diagnostics.md).
- **`releaseSmoke:`** — CI packaged build summary and §21 e2e plan (same lines as **Copy** in packaged checklists); see [packaged-windows-smoke.md](packaged-windows-smoke.md) and [logging-and-diagnostics.md](logging-and-diagnostics.md).

## See also

[packaged-windows-smoke.md](packaged-windows-smoke.md) (post-`pack:dir`) · [logging-and-diagnostics.md](logging-and-diagnostics.md).dev: `check:packaged-e2e-scenarios-registry`, `check:help-workflow-smoke-crosslinks` (44 articles; partition: tail 42 + ffmpeg + knowledge, FAQ outside 44). §19 publish signing (win/linux/mac): [`release-code-signing-roadmap.ts`](../../src/shared/release-code-signing-roadmap.ts) + [`docs/RELEASE.md`](../../docs/RELEASE.md) §4/§4.1/§4.2 — `check:help-packaged-smoke-docs`; §19 build: `fix:esm-shim` / `electron-vite-build-meta.ts` (Linux/CI `npm run build`). §21 Playwright: `npm run UI ZERO (Playwright removed)` (canon — `docs/VELORIX_NEON_THEME.md`).. UiHintSuffix: `aboutSupportZipDiagnosticsSectionsHint` — `formatPackagedGuiE2ePlaywrightUiHintSuffix` (`check:support-bundle-terminal-hints`; settings — `check:owner-hardware-checklist-locale`).
- **`ownerHardwareChecklist:`** — owner hardware checklist on your machine (NEON theme, HiDPI, HW, scenario, §7.5 sprite, packaged smoke for your OS, scheduler, Windows shell); **ru** canon in the zip; English UI copies EN locale strings to the clipboard.
- **`winPackagedSmoke:`** / **`linuxPackagedSmoke:`** / **`macosPackagedSmoke:`** — packaged checklists (Windows always; Linux/macOS when built on that OS); see [packaged-windows-smoke.md](packaged-windows-smoke.md), [packaged-linux-smoke.md](packaged-linux-smoke.md), [packaged-macos-smoke.md](packaged-macos-smoke.md).
- **`terminalHints:`** — terminal hints snapshot for support; see [ffmpeg-terminal-hints.md](ffmpeg-terminal-hints.md) and [logging-and-diagnostics.md](logging-and-diagnostics.md).
- **`releaseSmoke:`** — CI packaged build summary and §21 e2e plan (same lines as **Copy** in packaged checklists); see [packaged-windows-smoke.md](packaged-windows-smoke.md) and [logging-and-diagnostics.md](logging-and-diagnostics.md).

## See also

[packaged-windows-smoke.md](packaged-windows-smoke.md) (post-`pack:dir`) · [logging-and-diagnostics.md](logging-and-diagnostics.md).

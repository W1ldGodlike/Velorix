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

[packaged-windows-smoke.md](packaged-windows-smoke.md) (post-`pack:dir`) · [logging-and-diagnostics.md](logging-and-diagnostics.md).

# About, logs, and support

## Version

The About dialog shows the app build number and the embedded page engine version — handy when talking to support.

## Log folder

The dialog links to the **log folder**. Files stay small; you can attach them to an email when asked.

## Support archive

The **archive** button packs several diagnostic files into one zip so you do not have to pick them manually. After manual packaged smoke runs, the zip includes `winPackagedSmoke:`, `linuxPackagedSmoke:`, and `macosPackagedSmoke:` blocks (checklists from settings) — see [packaged-windows-smoke.md](../packaged-windows-smoke.md), [packaged-linux-smoke.md](packaged-linux-smoke.md), [packaged-macos-smoke.md](packaged-macos-smoke.md).

## Temporary data

You also get an estimate of **temporary** data (preview cache, incomplete downloads such as `.part` / `.crdownload` / `.aria2`, old ffmpeg temp folders). **Temp size** shows per-category bytes and file counts. Cleanup uses a two-step confirm; finished media files are not removed.

## Diagnostics

More on logs and status messages — [logging-and-diagnostics.md](logging-and-diagnostics.md).

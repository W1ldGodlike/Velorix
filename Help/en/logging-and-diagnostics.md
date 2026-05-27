# Logs and diagnostics

## Where logs live

The main process log is **`main.log`** under the `logs` folder in the app data directory (next to settings and queues). A small rotated backup may sit beside it.

## Session log

Each launch gets a short **session** log file — useful when describing steps to support.

## How to open

**Tools** menu entries open the log in your viewer and build a **support archive** (one zip with several useful files).

`diagnostics.txt` in the archive includes:

- **`ownerHardwareChecklist:`** — owner hardware checklist (theme, HiDPI, HW, packaged, §21 e2e); see [about-support-logs.md](about-support-logs.md).
- **`releaseSmoke:`** — CI packaged pipeline and §21 e2e plan; see [about-support-logs.md](about-support-logs.md).
- **`terminalHints:`** — terminal hints snapshot; see [ffmpeg-terminal-hints.md](ffmpeg-terminal-hints.md).

## More in About

Temporary cleanup and folder sizes — [about-support-logs.md](about-support-logs.md).

## See also

[about-support-logs.md](about-support-logs.md) (Support ZIP `ownerHardwareChecklist:`) · [packaged-windows-smoke.md](packaged-windows-smoke.md) (post-`pack:dir`).

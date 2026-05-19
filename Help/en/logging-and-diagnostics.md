# Logs and diagnostics

## Main log

The primary text log from the main process is **`main.log`** inside the `logs` folder under the app data directory (next to settings and queues). A small rotated backup may sit beside it.

## Session log

Each launch also writes a compact **session** log — easy to attach when you describe repro steps.

## How to open

The **Tools** menu has entries to open the log in your viewer and to build a **support archive** (one zip with several helpful files).

`diagnostics.txt` in the zip includes:

- **`ownerManualSmoke:`** — full owner manual smoke bundle (theme, HiDPI, HW, packaged, §21 e2e per-step `e2e <id>:`); see [owner-manual-smoke.md](owner-manual-smoke.md).
- **`releaseSmoke:`** — CI packaged pipeline, win/linux/macos layout, and the same §21 e2e plan; see [about-support-logs.md](about-support-logs.md).

Dev: `npm run check:packaged-e2e-scenarios-registry`, `check:help-workflow-smoke-crosslinks` (34 articles, in `check:quiet`). UI **Copy** (packaged + owner bundle) appends **§21 packaged e2e (CI vs owner)**; Support ZIP includes **planned GUI e2e scope** (8 steps for future Playwright; 2 manual-owner: sprite, mini-player).

## About dialog extras

Temporary cleanup buttons and folder sizes live in [about-support-logs.md](about-support-logs.md).

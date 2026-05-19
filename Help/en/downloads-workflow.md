# Downloads tab: queue

![Downloads queue, log, and yt-dlp settings rail (diagram)](assets/downloads-queue-overview.svg)

## Table

Each row is one address. Columns show progress: format, size, percent, speed, and **time left**. Row actions include start, pause (when the OS allows), retry after errors, delete, open file, or open folder.

## Quick strip

Above the table you can expand a **short strip**: a field for links and **Download and open in editor** — the app enqueues the first waiting row, runs it, and opens the finished file in the editor preview when possible.

## Whole queue

Runs proceed **top to bottom**: while one row is active, others wait. This avoids juggling several downloads at once.

## History and log

Below the table you will find **history** (re-queue with one click) and a **live log** of downloader text. History includes a compact multi-day summary, outcome filter, **JSON export of visible rows**, and automatic refresh when a download finishes.

## Settings on the right

Details — [downloads-settings-rail.md](downloads-settings-rail.md). Clipboard and drag-and-drop — [downloads-dragdrop.md](downloads-dragdrop.md).

## Packaged smoke (§19 / §21)

Owner manual checklist for the queue and **yt-dlp** — [owner-manual-smoke.md](owner-manual-smoke.md). After `npm run pack:dir` — **ytdlp** step in [packaged-windows-smoke.md](../packaged-windows-smoke.md) (Linux/macOS — sibling articles); §21 e2e per-step `e2e <id>:` in Support ZIP `releaseSmoke:`; dev block `terminalHints:` (§8) — [about-support-logs.md](about-support-logs.md), [logging-and-diagnostics.md](logging-and-diagnostics.md); Help: `check:help-workflow-smoke-crosslinks` (44 articles).

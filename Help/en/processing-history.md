# Processing history (FFmpeg right rail)

The **Processing history** section in the editor FFmpeg rail lists finished ffmpeg exports, frame snapshots, post-download auto-exports, and workflow scenario runs.

## Weekly summary

The chip row above the list shows **7-day** totals: entries, successes, errors, cancellations, total duration, and scenario run count. Click a count chip to **filter the list** (the Time chip is informational only).

## Filters and search

- **Type** — export, frames, auto export, batch, scenario.
- **Outcome** — success, error, cancelled.
- **Search** — file path, codec, status, scenario id, error text.

The list refreshes automatically when a new entry is appended.

## Row actions

- **Retry** — queue the same export or snapshot again.
- **Retry scenario** — for scenario rows; if the scenario has a URL, repeat goes through yt-dlp download first.
- **File / Folder / Preview** — open the output (when present).
- **Source** — open the input in the editor.

## Export JSON

**Export JSON** saves **visible** rows (respecting filters), the weekly summary, and export metadata — useful for reports and support.

## See also

Output presets — [ffmpeg-rail-presets.md](ffmpeg-rail-presets.md). Scenarios and scheduler — [workflows-planner-scenarios.md](workflows-planner-scenarios.md). Packaged smoke export/snapshot — [packaged-windows-smoke.md](../packaged-windows-smoke.md), [owner-manual-smoke.md](owner-manual-smoke.md); §21 e2e per-step `e2e <id>:` in `releaseSmoke:`; dev block `terminalHints:` (§8) — [logging-and-diagnostics.md](logging-and-diagnostics.md).

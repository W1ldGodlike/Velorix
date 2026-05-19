# Inspector and file info in the editor

## What you see in the main editor

When a file is open, there is a **single short line** under the timeline: a compact **video** line (resolution and codec) and an **audio** line (codec). It is a quick hint, not a full report.

For **container format, duration, every track, chapters**, and confident preset choice, open the inspector window (below).

## Separate window

The **Tools** menu opens the **inspector** window with track tables, chapters, and raw report text. You can save reports to files from there.

## Terminal links

Hints for the Terminal tab and built-in scenarios are covered in [tools-terminal-inspector.md](tools-terminal-inspector.md) and [ffmpeg-terminal-hints.md](ffmpeg-terminal-hints.md).

## Packaged smoke (§19 / §21)

Owner manual **ffprobe** checklist — [owner-manual-smoke.md](owner-manual-smoke.md). After `npm run pack:dir` — **ffprobe** step in [packaged-windows-smoke.md](../packaged-windows-smoke.md); §21 e2e per-step `e2e <id>:` in Support ZIP `releaseSmoke:`; dev block `terminalHints:` (§8) — [about-support-logs.md](about-support-logs.md), [logging-and-diagnostics.md](logging-and-diagnostics.md); Help: `check:help-workflow-smoke-crosslinks` (44 articles; partition: tail 42 + ffmpeg + knowledge, FAQ outside 44).

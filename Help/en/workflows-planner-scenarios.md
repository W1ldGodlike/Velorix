# Task planner and scenarios

## Planner (Service menu)

**Watch-folder** monitoring: when a new media file appears, FluxAlloy records the event and, if **Run scenario** is enabled, queues an ffmpeg export.

| Backend                      | When to use                                                                                                                                |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **In-app**                   | While FluxAlloy is running: poll the folder every N seconds inside the app process.                                                        |
| **Windows Task Scheduler**   | Windows only: a scheduled task runs `FluxAlloy.exe --workflow-watch-folder-tick` on a minute interval even when the main window is closed. |
| **macOS LaunchAgent**        | macOS only: a plist in `~/Library/LaunchAgents/` with `StartInterval` (seconds) and the same CLI tick.                                     |
| **Linux systemd user timer** | Linux only: units in `~/.config/systemd/user/fluxalloy-watch-<id>.service` + `.timer`, `OnUnitActiveSec` from the task interval.           |

Poll interval: **15–86400** seconds. Task Scheduler rounds to whole minutes; LaunchAgent and systemd use seconds (`StartInterval` / `OnUnitActiveSec`).

## Scenario builder

**Download → Process → Save** chain (JSON + flow diagram). In the builder: **Add** a block, **×** remove (not the last one), **drag** to reorder (linear arrows rebuild), **link** blocks with left/right dots — edges are written to JSON; click **→** to remove an edge; skip links appear under extra connections.

| Template                    | Purpose                                                              |
| --------------------------- | -------------------------------------------------------------------- |
| **Local file → ffmpeg**     | Watch-folder or editor file; Download block without a URL.           |
| **URL → download → ffmpeg** | `sourceUrl` on the Download block (http/https); yt-dlp, then ffmpeg. |

For watch-folder with **Run scenario**, a local file runs the **Process** block (ffmpeg). Download without a URL does not call yt-dlp.

## Run from the editor

**FFmpeg settings rail → Scenario**:

- **Run scenario** — ffmpeg on the open file (same runner as watch-folder).
- **Run URL scenario** — when `sourceUrl` is set: yt-dlp queue, then ffmpeg after success (no auto-open in the editor).

## Diagnostics

- Events and errors go to the app log (`workflow`).
- Run results appear in the status bar and in **Processing history** (kind `workflowScenario`).
- macOS LaunchAgent logs: `~/Library/Logs/FluxAlloy/watch-<taskId>.log`.
- Linux timer: `journalctl --user -u fluxalloy-watch-<taskId>.service`.

## See also

[owner-manual-smoke.md](owner-manual-smoke.md) (manual smoke on hardware) · [packaged-windows-smoke.md](../packaged-windows-smoke.md) (post-`pack:dir` smoke).

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
- Full owner-smoke bundle (scheduler): **Settings → Dependencies → Owner manual smoke**, or the planner deep-link — [owner-manual-smoke.md](owner-manual-smoke.md). Packaged ffmpeg/ytdlp after `pack:dir` — [packaged-windows-smoke.md](../packaged-windows-smoke.md); §21 e2e **§21 packaged e2e (CI vs owner)** (`formatPackagedManualSmokeE2eAppendixLines`, per-step `e2e <id>:`) in Copy and `releaseSmoke:`; dev block `terminalHints:` (§8, 24 Help articles) — [logging-and-diagnostics.md](logging-and-diagnostics.md) §19 publish signing (win/linux/mac): [`release-code-signing-roadmap.ts`](../../src/shared/release-code-signing-roadmap.ts) + [`docs/RELEASE.md`](../../docs/RELEASE.md) §4/§4.1/§4.2 — `check:help-packaged-smoke-docs`; Playwright scaffold: `tests/e2e/gui/planned-gui-e2e-steps.ts` (`PLANNED_GUI_E2E_STEP_IDS`, `PLANNED_GUI_E2E_SCENARIOS`, `PLANNED_GUI_E2E_STEP_BY_ID`). Copy/releaseSmoke includes `PLANNED_GUI_E2E_STEP_BY_ID` (registry `note` per step; `formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine`). Wiring: `docs/RELEASE.md` — `formatPackagedGuiE2ePlaywrightReleaseWiringHandoffBullet` (after owner-smoke on hardware); Help: `check:help-workflow-smoke-crosslinks` (44 articles; partition: tail 42 + ffmpeg + knowledge, FAQ outside 44). UiHintSuffix: `formatPackagedGuiE2ePlaywrightUiHintSuffix` (4 settings + `aboutSupportZipDiagnosticsSectionsHint`; `check:owner-visual-smoke-locale`, `check:support-bundle-terminal-hints`).

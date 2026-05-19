# Queue and persistence

## Download queue

The address list is stored in the user data area as a small **queue** file. After restarting FluxAlloy the rows return, but an active download does not resume by itself — start it again.

## Window layout

Column widths and which panels are collapsed are remembered with the general app settings.

## After a successful download

You can **open the file** in the editor or **only reveal the folder**, depending on switches in the download settings. Automatic follow-up steps (for example re-encoding) use a separate toggle and only run when a safe path to the finished file is known.

## Manual control

Keep downloads only, then start encoding yourself once the file is on disk.

See also [downloads-workflow.md](downloads-workflow.md). Packaged smoke **ytdlp** step and owner bundle — [owner-manual-smoke.md](owner-manual-smoke.md), [packaged-windows-smoke.md](../packaged-windows-smoke.md); §21 e2e per-step `e2e <id>:` in `releaseSmoke:`; dev block `terminalHints:` (§8) — [logging-and-diagnostics.md](logging-and-diagnostics.md); Help: `check:help-workflow-smoke-crosslinks` (44 articles; partition: tail 42 + ffmpeg + knowledge, FAQ outside 44).

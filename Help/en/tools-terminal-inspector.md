# Terminal and inspector

## Terminal

The **Terminal** tab builds a command from hints and validates it before launch. Only three tool families are allowed — the link downloader, the media encoder, and the media analyzer — so you never accidentally spawn unrelated software.

Hints come from bundled lists plus **built-in scenarios** for common tasks (ready-made command line and Russian `summary`). The catalog on the right has a **Scenarios** chip that lists only scenario hints, not JSON tokens.

Scenario copy lives in `src/shared/terminal-contract-hints-*.ts` (canonical **`terminal-contract-hints-meta`**, 20 downloads + 15 preview shards (35 files)); after editing `summary`, run **`npm run locales:terminal-summaries-ru`** twice until **0** replacements, then **`npm run locales:terminal-scenario-stream-gloss`** if needed. See [ffmpeg-terminal-hints.md](ffmpeg-terminal-hints.md).

## Inspector

The **Tools** menu opens a separate window with track tables and the raw analyzer report. **Copy JSON** is available for support tickets.

See also [probe-and-inspector-basics.md](probe-and-inspector-basics.md).

## Packaged smoke (§19 / §21)

After `npm run pack:dir`, verify bundled ffprobe/ffmpeg in [packaged-windows-smoke.md](../packaged-windows-smoke.md). Full owner bundle and per-step `e2e <id>:` in Support ZIP `releaseSmoke:` — [owner-manual-smoke.md](owner-manual-smoke.md), [about-support-logs.md](about-support-logs.md).

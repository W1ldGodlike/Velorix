# Manual Windows packaged smoke (pack:dir)

Exercise the **built** app from `dist/win-unpacked/`, not the Vite dev server. Automated release steps (`verify:win-unpacked`, `smoke:packaged-release`) **do not replace** this pass.

## Preparation

1. Engines in `bin/`: `npm run engines:prepare:win`, then `npm run engines:doctor` (see [`bin/README.md`](../../bin/README.md)).
2. Build:

```powershell
npm run check:release
```

Or step by step: `npm run pack:dir`, then `npm run verify:win-unpacked` and `npm run smoke:packaged-release`.

You should have `FluxAlloy.exe` and `resources/bin/{yt-dlp,ffmpeg,ffprobe}.exe`.

## In-app checklist

**Settings → Dependencies → Manual Windows packaged smoke (pack:dir)** — copy the steps into a report; they are also in the Support ZIP (`winPackagedSmoke:`).

## Copy format and locales

**Copy** in the packaged panel emits the same layout as Support ZIP: `owner:`, `automated:`, `doc:`, `ui:`, then `step [id]:`, then **§21 packaged e2e (CI vs owner)** (2/8/2 groups and per-step `e2e <id>:`). With **English UI**, strings come from `locales/en/win-packaged-manual-smoke.json`. The packaged block in the full owner bundle — [owner-manual-smoke.md](owner-manual-smoke.md). **Planned GUI e2e** (8 steps, Playwright later): `open-file`, `ytdlp`, `editor-dl`, `snapshot`, `export`, `knowledge`, `support-zip`, `settings`. Dev: `npm run check:packaged-manual-smoke-parity`, `npm run check:packaged-e2e-scenarios-registry` (per-step `e2e launch:` in `releaseSmoke:`), `check:help-workflow-smoke-crosslinks` — in `check:quiet`.

## Short order

1. Run `dist/win-unpacked/FluxAlloy.exe`.
2. Status bar: engine versions with no “not found”.
3. Editor: local file, preview, scrub.
4. Downloads: short URL, queue reaches Done.
5. Open in editor for a finished file.
6. Frame snapshot, MP4 export, §7.5 video sprite (FFmpeg rail).
7. While export/yt-dlp is busy — §4.3 mini player (Service → Mini Player).
8. Knowledge base and Support ZIP.
9. Close and relaunch the exe — no crash.

Build details — [`docs/RELEASE.md`](../docs/RELEASE.md) (repository root).

On any OS, Support ZIP `releaseSmoke:` lists `dist/win-unpacked/` and `resources/*` layout lines (present/missing) — useful after `pack:dir` without re-running verify locally.

See also [about-support-logs.md](about-support-logs.md) and [logging-and-diagnostics.md](logging-and-diagnostics.md).

# Manual Windows packaged smoke (pack:dir)

Exercise the **built** app from `dist/win-unpacked/`, not the Vite dev server. Automated release steps (`verify:win-unpacked`, `smoke:packaged-release`) **do not replace** this pass.

## Preparation

```powershell
npm run check:release
```

Or step by step: `npm run pack:dir`, then `npm run verify:win-unpacked` and `npm run smoke:packaged-release`.

You should have `FluxAlloy.exe` and `resources/bin/{yt-dlp,ffmpeg,ffprobe}.exe`.

## In-app checklist

**Settings → Dependencies → Manual Windows packaged smoke (pack:dir)** — copy the steps into a report; they are also in the Support ZIP (`winPackagedSmoke:`).

## Copy format and locales

**Copy** in the packaged panel emits the same layout as Support ZIP: `owner:`, `automated:`, `doc:`, `ui:`, then `step [id]:`. With **English UI**, strings come from `locales/en/win-packaged-manual-smoke.json`. The packaged block in the full owner bundle — [owner-manual-smoke.md](owner-manual-smoke.md). Dev: `npm run check:packaged-manual-smoke-parity`, `npm run check:packaged-e2e-scenarios-registry` (§21: steps ↔ CI headless / planned GUI e2e; summary in Support ZIP `releaseSmoke:`) — in `check:quiet`.

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

See also [about-support-logs.md](about-support-logs.md) and [logging-and-diagnostics.md](logging-and-diagnostics.md).

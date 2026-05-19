# Manual Linux packaged smoke (pack:linux:dir)

Test the **built** app from `dist/linux-unpacked/`, not the Vite dev server. Layout check **`npm run verify:linux-unpacked`** does **not** replace this run.

## Preparation

1. Place `ffmpeg`, `ffprobe`, `yt-dlp` in `bin/` (see [`bin/README.md`](../../bin/README.md)), then `npm run engines:doctor`.
2. Build and layout:

```bash
npm run build
npm run pack:linux:dir
npm run verify:linux-unpacked
```

The folder must contain `fluxalloy` or `FluxAlloy` and `resources/bin/{yt-dlp,ffmpeg,ffprobe}`.

## In-app checklist

**Settings → Dependencies → Manual Linux packaged smoke (pack:linux:dir)** — copy the steps for your report; they appear in Support ZIP as `linuxPackagedSmoke:`.

## Copy format and locales

**Copy** in the packaged panel matches Support ZIP (`owner:` / `step [id]:` + **§21 packaged e2e (CI vs owner)**). English UI — `locales/en/linux-packaged-manual-smoke.json`. Full owner bundle — [owner-manual-smoke.md](owner-manual-smoke.md). Dev: `check:packaged-manual-smoke-parity`, `check:packaged-e2e-scenarios-registry` (§21; per-step `e2e <id>:` in `releaseSmoke:`, e.g. `e2e launch:`), `check:help-workflow-smoke-crosslinks` — in `check:quiet`.

## Short order

1. Run the binary from `dist/linux-unpacked/`.
2. Status bar: engine versions with no “not found”.
3. Editor, downloads, snapshot, export, §7.5 sprite, §4.3 mini player while busy, knowledge base, Support ZIP.
4. Quit and relaunch — no crash.

Details: [`docs/RELEASE.md`](../../docs/RELEASE.md) §4.1.

On any OS, Support ZIP `releaseSmoke:` lists `dist/linux-unpacked/` and `resources/*` layout lines (present/missing) — useful after `pack:linux:dir` without re-running verify locally.

See also [about-support-logs.md](about-support-logs.md) and [packaged-windows-smoke.md](../packaged-windows-smoke.md). §21 planned GUI e2e (8 steps) — [owner-manual-smoke.md](owner-manual-smoke.md); canonical ids: `PACKAGED_E2E_PLANNED_GUI_STEP_IDS`.

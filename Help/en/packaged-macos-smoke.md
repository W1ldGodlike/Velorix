# Manual macOS packaged smoke (pack:mac:dir)

Test the **built** `FluxAlloy.app` under `dist/mac-arm64/` (or `dist/mac/`, `dist/mac-x64/`), not the Vite dev server. Layout check **`npm run verify:mac-unpacked`** does **not** replace this run.

## Preparation

1. Place `ffmpeg`, `ffprobe`, `yt-dlp` in `bin/` (see [`bin/README.md`](../../bin/README.md)), then `npm run engines:doctor`.
2. Build and layout:

```bash
npm run build
npm run pack:mac:dir
npm run verify:mac-unpacked
```

The bundle must contain `Contents/MacOS/FluxAlloy` and `Contents/Resources/bin/`.

**Linux/CI build:** on Linux/CI hosts `npm run build` requires the `fix:esm-shim` plugin (`electron-vite-build-meta.ts`, [`electron.vite.config.ts`](../../electron.vite.config.ts)); CI `linux-packaging` is Linux-only. On macOS locally use `build` → `pack:mac:dir`.

## In-app checklist

**Settings → Dependencies → Manual macOS packaged smoke (pack:mac:dir)** — copy steps for your report; they appear in Support ZIP as `macosPackagedSmoke:`.

## Copy format and locales

**Copy** matches Support ZIP (`owner:` / `step [id]:` + **§21 packaged e2e (CI vs owner)**). English UI — `locales/en/macos-packaged-manual-smoke.json`. Full owner bundle — [owner-manual-smoke.md](owner-manual-smoke.md). **Planned GUI e2e** (8 steps, Playwright later): `open-file`, `ytdlp`, `editor-dl`, `snapshot`, `export`, `knowledge`, `support-zip`, `settings`. Reserved `test:e2e:gui` (`check:packaged-gui-e2e-playwright-deferred`; not in `package.json` yet). Dev: `check:packaged-manual-smoke-parity`, `check:packaged-e2e-scenarios-registry` (§21; per-step `e2e <id>:` in `releaseSmoke:`, e.g. `e2e launch:`), `check:help-workflow-smoke-crosslinks` (44 articles; partition: tail 42 + ffmpeg + knowledge, FAQ outside 44) — in `check:quiet`. §21 Playwright: `check:packaged-gui-e2e-playwright-deferred` (reserved `test:e2e:gui`).

## Short order

1. Open `FluxAlloy.app`.
2. Status bar, editor, downloads, snapshot, export, §7.5 sprite, §4.3 mini player while busy, knowledge base, Support ZIP.
3. Quit and reopen the bundle — no crash.

Details: [`docs/RELEASE.md`](../../docs/RELEASE.md) §4.2.

On any OS, Support ZIP `releaseSmoke:` lists `FluxAlloy.app` candidates and `Contents/Resources/*` layout lines (present/missing); dev block `terminalHints:` (§8) — useful after `pack:mac:dir` without re-running verify locally.

See also [about-support-logs.md](about-support-logs.md), [logging-and-diagnostics.md](logging-and-diagnostics.md) and [packaged-windows-smoke.md](../packaged-windows-smoke.md). §21 planned GUI e2e (8 steps) — [owner-manual-smoke.md](owner-manual-smoke.md); canonical ids: `PACKAGED_E2E_PLANNED_GUI_STEP_IDS`.

# Manual macOS packaged smoke (pack:mac:dir)

Test the **built** `Velorix.app` under `dist/mac-arm64/` (or `dist/mac/`, `dist/mac-x64/`), not the Vite dev server. Layout check **`npm run verify:mac-unpacked`** does **not** replace this run.

## Preparation

1. Place `ffmpeg`, `ffprobe`, `yt-dlp` in `bin/` (see [`bin/README.md`](../../bin/README.md)), then `npm run engines:doctor`.
2. Build and layout:

```bash
npm run build
npm run pack:mac:dir
npm run verify:mac-unpacked
```

The bundle must contain `Contents/MacOS/Velorix` and `Contents/Resources/bin/`.

**Linux/CI build:** on Linux/CI hosts `npm run build` requires the `fix:esm-shim` plugin (`electron-vite-build-meta.ts`, [`electron.vite.config.ts`](../../electron.vite.config.ts)); CI `linux-packaging` is Linux-only. On macOS locally use `build` → `pack:mac:dir`.

## In-app checklist

**Settings → Dependencies → Manual macOS packaged smoke (pack:mac:dir)** — copy steps for your report; they appear in Support ZIP as `macosPackagedSmoke:`.

## Copy format and locales

**Copy** matches Support ZIP (`owner:` / `step [id]:` + **§21 packaged e2e (CI vs owner)**). English UI — `locales/en/macos-packaged-manual-smoke.json`. Full owner bundle — [about-support-logs.md](about-support-logs.md). **Planned GUI e2e** (0 Playwright steps; owner manual — `open-file`, `ytdlp`, `editor-dl`, `snapshot`, `export`, `knowledge`, `support-zip`, `settings`). `npm run UI ZERO (Playwright removed)` (canon — `docs/VELORIX_NEON_THEME.md`). Dev: `check:packaged-manual-smoke-parity`, `check:packaged-e2e-scenarios-registry` (§21; per-step `e2e <id>:` in `releaseSmoke:`, e.g. `e2e launch:`), `check:help-workflow-smoke-crosslinks` (44 articles; partition: tail 42 + ffmpeg + knowledge, FAQ outside 44) — in `check:quiet`. §21 Playwright: `npm run UI ZERO (Playwright removed)` (canon — `docs/VELORIX_NEON_THEME.md`). UiHintSuffix: `formatPackagedGuiE2ePlaywrightUiHintSuffix` (0 settings + `aboutSupportZipDiagnosticsSectionsHint`; `check:owner-hardware-checklist-locale`, `check:support-bundle-terminal-hints`).

## Short order

1. Open `Velorix.app`.
2. Status bar, editor, downloads, snapshot, export, §7.5 sprite, knowledge base, Support ZIP.
3. Quit and reopen the bundle — no crash.

Details: [`docs/RELEASE.md`](../../docs/RELEASE.md) §4.2.

**Distribution beyond dev:** Developer ID signing, hardened runtime, notarization (`notarytool`, `stapler staple`) — roadmap in [`docs/RELEASE.md`](../../docs/RELEASE.md) §4.2; `pack:mac:dir` may omit signing until publish.

On any OS, Support ZIP `releaseSmoke:` lists `Velorix.app` candidates and `Contents/Resources/*` layout lines (present/missing); dev block `terminalHints:` (§8) — useful after `pack:mac:dir` without re-running verify locally.

See also [about-support-logs.md](about-support-logs.md), [logging-and-diagnostics.md](logging-and-diagnostics.md) and [packaged-windows-smoke.md](packaged-windows-smoke.md). §21 planned GUI e2e (0 steps) — Playwright suspended (UI ZERO); owner manual — [about-support-logs.md](about-support-logs.md); canon — `docs/VELORIX_NEON_THEME.md`.

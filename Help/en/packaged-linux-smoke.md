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

**Linux/CI build:** `npm run build` (`electron-vite build`) requires the `fix:esm-shim` plugin in [`electron.vite.config.ts`](../../electron.vite.config.ts) (canonical: [`electron-vite-build-meta.ts`](../../src/shared/electron-vite-build-meta.ts); `vite:esm-shim` false-positive on `renderer-state-approach.ts`). GitHub Actions `linux-packaging`: `check:quiet` → `build` → `pack:linux:dir`.

## In-app checklist

**Settings → Dependencies → Manual Linux packaged smoke (pack:linux:dir)** — copy the steps for your report; they appear in Support ZIP as `linuxPackagedSmoke:`.

## Copy format and locales

**Copy** in the packaged panel matches Support ZIP (`owner:` / `step [id]:` + **§21 packaged e2e (CI vs owner)**). English UI — `locales/en/linux-packaged-manual-smoke.json`. Full owner bundle — [owner-manual-smoke.md](owner-manual-smoke.md). **Planned GUI e2e** (8 steps, Playwright wired): `open-file`, `ytdlp`, `editor-dl`, `snapshot`, `export`, `knowledge`, `support-zip`, `settings`. `npm run test:e2e:gui` → `tests/e2e/gui/planned-gui-e2e.spec.ts` + `tests/e2e/gui/planned-gui-e2e-step-runners.ts` (skipped without `FLUXALLOY_E2E_APP`; `check:packaged-gui-e2e-playwright-deferred`). Playwright: `tests/e2e/gui/planned-gui-e2e-steps.ts` + `tests/e2e/gui/planned-gui-e2e-step-runners.ts` (`PLANNED_GUI_E2E_STEP_IDS`, `PLANNED_GUI_E2E_SCENARIOS`, `PLANNED_GUI_E2E_STEP_BY_ID`). Copy/releaseSmoke includes `PLANNED_GUI_E2E_STEP_BY_ID` (registry `note` per step; `formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine`). Specs: `docs/RELEASE.md` — `formatPackagedGuiE2ePlaywrightReleaseWiringHandoffBullet`. Dev: `check:packaged-manual-smoke-parity`, `check:packaged-e2e-scenarios-registry` (§21; per-step `e2e <id>:` in `releaseSmoke:`, e.g. `e2e launch:`), `check:help-workflow-smoke-crosslinks` (44 articles; partition: tail 42 + ffmpeg + knowledge, FAQ outside 44) — in `check:quiet`. §21 Playwright: `npm run test:e2e:gui` → `tests/e2e/gui/planned-gui-e2e.spec.ts` + `tests/e2e/gui/planned-gui-e2e-step-runners.ts` (skipped without `FLUXALLOY_E2E_APP`; `check:packaged-gui-e2e-playwright-deferred`). UiHintSuffix: `formatPackagedGuiE2ePlaywrightUiHintSuffix` (0 settings + `aboutSupportZipDiagnosticsSectionsHint`; `check:owner-visual-smoke-locale`, `check:support-bundle-terminal-hints`).

## Short order

1. Run the binary from `dist/linux-unpacked/`.
2. Status bar: engine versions with no “not found”.
3. Editor, downloads, snapshot, export, §7.5 sprite, §4.3 mini player while busy, knowledge base, Support ZIP.
4. Quit and relaunch — no crash.

Details: [`docs/RELEASE.md`](../../docs/RELEASE.md) §4.1.

**Distribution beyond dev:** artifact signing (GPG for deb/AppImage per release channel) — roadmap in [`docs/RELEASE.md`](../../docs/RELEASE.md) §4.1; `pack:linux:dir` may omit signing until publish.

On any OS, Support ZIP `releaseSmoke:` lists `dist/linux-unpacked/` and `resources/*` layout lines (present/missing); dev block `terminalHints:` (§8) — useful after `pack:linux:dir` without re-running verify locally.

See also [about-support-logs.md](about-support-logs.md), [logging-and-diagnostics.md](logging-and-diagnostics.md) and [packaged-windows-smoke.md](../packaged-windows-smoke.md). §21 planned GUI e2e (8 steps) — [owner-manual-smoke.md](owner-manual-smoke.md); canonical ids: `PACKAGED_E2E_PLANNED_GUI_STEP_IDS`; `tests/e2e/gui/planned-gui-e2e-steps.ts` + `tests/e2e/gui/planned-gui-e2e-step-runners.ts` (`PLANNED_GUI_E2E_STEP_IDS`, `PLANNED_GUI_E2E_SCENARIOS`, `PLANNED_GUI_E2E_STEP_BY_ID`). Copy/releaseSmoke includes `PLANNED_GUI_E2E_STEP_BY_ID` (registry `note` per step; `formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine`). Specs: `docs/RELEASE.md` — `formatPackagedGuiE2ePlaywrightReleaseWiringHandoffBullet`.

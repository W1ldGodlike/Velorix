# Logs and diagnostics

## Main log

The primary text log from the main process is **`main.log`** inside the `logs` folder under the app data directory (next to settings and queues). A small rotated backup may sit beside it.

## Session log

Each launch also writes a compact **session** log — easy to attach when you describe repro steps.

## How to open

The **Tools** menu has entries to open the log in your viewer and to build a **support archive** (one zip with several helpful files).

`diagnostics.txt` in the zip includes:

- **`ownerManualSmoke:`** — full owner manual smoke bundle (theme, HiDPI, HW, packaged, §21 e2e per-step `e2e <id>:`); see [owner-manual-smoke.md](owner-manual-smoke.md).
- **`releaseSmoke:`** — CI packaged pipeline, `fix:esm-shim` for Linux/CI `electron-vite build`, win/linux/macos layout, and the same §21 e2e plan; see [about-support-logs.md](about-support-logs.md).
- **`terminalHints:`** — dev §8 (`terminal-contract-hints-meta`, 14 downloads + 8 preview shards (22 files), 839+465 hints, `check:terminal-contract-hints-shards`, `check:support-bundle-terminal-hints` and other `check:quiet` guards); see [ffmpeg-terminal-hints.md](ffmpeg-terminal-hints.md).

Dev: `npm run check:packaged-e2e-scenarios-registry`, `check:help-workflow-smoke-crosslinks` (44 articles; partition: tail 42 + ffmpeg + knowledge, FAQ outside 44, in `check:quiet`); §19 publish signing (win/linux/mac): [`release-code-signing-roadmap.ts`](../../src/shared/release-code-signing-roadmap.ts) + [`docs/RELEASE.md`](../../docs/RELEASE.md) §4/§4.1/§4.2 — `check:help-packaged-smoke-docs`; §19 build: `fix:esm-shim` / `electron-vite-build-meta.ts` (Linux/CI `npm run build`); §21 Playwright: `npm run test:e2e:gui` → `tests/e2e/gui/planned-gui-e2e.spec.ts` + `tests/e2e/gui/planned-gui-e2e-step-runners.ts` (skipped without `VELORIX_E2E_APP`; `check:packaged-gui-e2e-playwright-deferred`). §8 terminal — `check:terminal-contract-hints-shards` (14 downloads + 8 preview shards (22 files), 839+465 hints), `check:help-terminal-hints-docs` (24 articles), `check:support-bundle-terminal-hints`, `check:terminal-hints-locale` (Settings → Dependencies). Support ZIP `ownerManualSmoke:` / `releaseSmoke:` appends **§21 packaged e2e (CI vs owner)**; Support ZIP includes **planned GUI e2e scope** (8 steps: `tests/e2e/gui/planned-gui-e2e-step-runners.ts`; manual-owner: video-sprite). Playwright: `tests/e2e/gui/planned-gui-e2e-steps.ts` + `tests/e2e/gui/planned-gui-e2e-step-runners.ts` (`PLANNED_GUI_E2E_STEP_IDS`, `PLANNED_GUI_E2E_SCENARIOS`, `PLANNED_GUI_E2E_STEP_BY_ID`). Copy/releaseSmoke includes `PLANNED_GUI_E2E_STEP_BY_ID` (registry `note` per step; `formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine`). Specs: `docs/RELEASE.md` — `formatPackagedGuiE2ePlaywrightReleaseWiringHandoffBullet`. UiHintSuffix: `appSettingsTerminalHintsGuardHint` (`check:terminal-hints-locale`); Playwright — `formatPackagedGuiE2ePlaywrightUiHintSuffix` (settings + `aboutSupportZipDiagnosticsSectionsHint`; `check:owner-visual-smoke-locale`, `check:support-bundle-terminal-hints`).

## About dialog extras

Temporary cleanup buttons and folder sizes live in [about-support-logs.md](about-support-logs.md).

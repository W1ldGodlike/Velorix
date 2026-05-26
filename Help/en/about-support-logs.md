# About, logs, and support

## Version

The About dialog shows the app build number and the embedded page engine version — handy when talking to support.

## Log folder

The dialog links to the **log folder**. Files stay small; you can attach them to an email when asked.

## Support archive

The **archive** button packs several diagnostic files into one zip so you do not have to pick them manually.

`diagnostics.txt` includes:

- **`ownerManualSmoke:`** — full owner bundle (theme, HiDPI, HW, scenario, §7.5 sprite, packaged for your OS, scheduler, Windows shell); **ru** canon in the zip — see [owner-manual-smoke.md](owner-manual-smoke.md) and **Settings → Owner manual smoke → Copy full bundle** (English UI copies EN locale strings).
- **`winPackagedSmoke:`** / **`linuxPackagedSmoke:`** / **`macosPackagedSmoke:`** — packaged checklists (Windows always; Linux/macOS when built on that OS); see [packaged-windows-smoke.md](packaged-windows-smoke.md), [packaged-linux-smoke.md](packaged-linux-smoke.md), [packaged-macos-smoke.md](packaged-macos-smoke.md).
- **`terminalHints:`** — dev §8 (`terminal-contract-hints-meta`, 14 downloads + 8 preview shards (22 files), 839+465 hints, `check:terminal-contract-hints-shards`, `check:help-terminal-hints-docs` (24 articles), `check:support-bundle-terminal-hints` and other `check:quiet` guards); see [ffmpeg-terminal-hints.md](ffmpeg-terminal-hints.md) and [logging-and-diagnostics.md](logging-and-diagnostics.md).
- **`releaseSmoke:`** — CI packaged pipeline (`smoke:packaged-release`), `fix:esm-shim` for Linux/CI `electron-vite build`, §21 e2e registry and **§21 packaged e2e (CI vs owner)** block (`appendPackagedManualSmokeE2ePlanLines` — same lines as UI **Copy** in packaged/owner), per-step `e2e <id>:`, `planned GUI e2e scope`, **present/missing** layout for `dist/win-unpacked/`, `dist/linux-unpacked/`, `Velorix.app`; dev: `check:packaged-e2e-scenarios-registry`, `check:help-workflow-smoke-crosslinks` (44 articles; partition: tail 42 + ffmpeg + knowledge, FAQ outside 44). §19 publish signing (win/linux/mac): [`release-code-signing-roadmap.ts`](../../src/shared/release-code-signing-roadmap.ts) + [`docs/RELEASE.md`](../../docs/RELEASE.md) §4/§4.1/§4.2 — `check:help-packaged-smoke-docs`; §19 build: `fix:esm-shim` / `electron-vite-build-meta.ts` (Linux/CI `npm run build`). §21 Playwright: `npm run test:e2e:gui` → `tests/e2e/gui/planned-gui-e2e.spec.ts` + `tests/e2e/gui/planned-gui-e2e-step-runners.ts` (skipped without `VELORIX_E2E_APP`; `check:packaged-gui-e2e-playwright-deferred`). Playwright: `tests/e2e/gui/planned-gui-e2e-steps.ts` + `tests/e2e/gui/planned-gui-e2e-step-runners.ts` (`PLANNED_GUI_E2E_STEP_IDS`, `PLANNED_GUI_E2E_SCENARIOS`, `PLANNED_GUI_E2E_STEP_BY_ID`). Copy/releaseSmoke includes `PLANNED_GUI_E2E_STEP_BY_ID` (registry `note` per step; `formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine`). Specs: `docs/RELEASE.md` — `formatPackagedGuiE2ePlaywrightReleaseWiringHandoffBullet`. UiHintSuffix: `aboutSupportZipDiagnosticsSectionsHint` — `formatPackagedGuiE2ePlaywrightUiHintSuffix` (`check:support-bundle-terminal-hints`; settings — `check:owner-visual-smoke-locale`).
# Manual smoke on your hardware

CI tests cover **ffmpeg argv**, not your real GPU or display scale. Before you rely on a release build, run the owner checklist bundle on your machine.

## Where to find it

1. **Owner manual verification** — canonical checklist at repo root: [`IMPLEMENTATION_MANUAL_VERIFICATION.md`](../../IMPLEMENTATION_MANUAL_VERIFICATION.md) (not shown in the app UI). The same text is included in Support ZIP as `ownerManualSmoke:` (About → support archive).
2. Support ZIP and dev guards — [about-support-logs.md](about-support-logs.md), [logging-and-diagnostics.md](logging-and-diagnostics.md) (`check:packaged-e2e-scenarios-registry`, `releaseSmoke:`).
3. **Support ZIP** — `ownerManualSmoke:` in `diagnostics.txt`; `releaseSmoke:` — CI packaged pipeline, `fix:esm-shim` (`electron-vite-build-meta.ts`) for Linux/CI `electron-vite build`, and §21 e2e plan; §19 publish signing (win/linux/mac): [`release-code-signing-roadmap.ts`](../../src/shared/release-code-signing-roadmap.ts) + [`docs/RELEASE.md`](../../docs/RELEASE.md) §4/§4.1/§4.2 — `check:help-packaged-smoke-docs`; dev block `terminalHints:` (§8 guards) — [about-support-logs.md](about-support-logs.md), [logging-and-diagnostics.md](logging-and-diagnostics.md).

## What to verify

| Block            | Goal                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------ |
| Theme            | Dark / light / match system: contrast, focus, modals, downloads pop-out, inspector   |
| HiDPI            | Windows scale 100–200 %: editor, downloads, modals, status bar                       |
| HW encode        | NVENC (Win) or VAAPI (Linux): probe, manual codec, hw_auto, benchmark                |
| Scenario builder | Builder UI, JSON edges, run from editor / URL                                        |
| Video sprite §7.5 | FFmpeg rail → preview sprite sheet: grid, PTS burn-in, PNG/JPEG save; offline test guard |
| Packaged         | `dist/win-unpacked` / `linux-unpacked` / `.app` — steps in [`IMPLEMENTATION_MANUAL_VERIFICATION.md`](../../IMPLEMENTATION_MANUAL_VERIFICATION.md); Support ZIP — **§21 packaged e2e (CI vs owner)** |
| OS scheduler     | Watch-folder + Task Scheduler / launchd / systemd user timer                         |
| Windows shell    | Explorer menu, Open with, Default apps (Windows only)                                |

Details: [hardware-encoding.md](hardware-encoding.md), [appearance-language-theme.md](appearance-language-theme.md), [workflows-planner-scenarios.md](workflows-planner-scenarios.md), [windows-shell-integration.md](windows-shell-integration.md).

Support ZIP `ownerManualSmoke:` ends with **§21 packaged e2e (CI vs owner)** (`formatPackagedManualSmokeE2eAppendixLines`: ci-headless / planned-gui-e2e / manual-owner groups plus **11 lines** `e2e <stepId>: <automation> script=…`, e.g. `e2e launch: ci-headless script=smoke:packaged-app`); `releaseSmoke:` has the same diagnostics without the separate heading line.

**Planned GUI e2e** (8 steps; code — Playwright, acceptance — manual): `open-file`, `ytdlp`, `editor-dl`, `snapshot`, `export`, `knowledge`, `support-zip`, `settings`. `npm run test:e2e:gui` → `tests/e2e/gui/planned-gui-e2e.spec.ts` + `tests/e2e/gui/planned-gui-e2e-step-runners.ts` (skipped without `VELORIX_E2E_APP`; `check:packaged-gui-e2e-playwright-deferred`). Playwright: `tests/e2e/gui/planned-gui-e2e-steps.ts` + `tests/e2e/gui/planned-gui-e2e-step-runners.ts` (`PLANNED_GUI_E2E_STEP_IDS`, `PLANNED_GUI_E2E_SCENARIOS`, `PLANNED_GUI_E2E_STEP_BY_ID`). Copy/releaseSmoke includes `PLANNED_GUI_E2E_STEP_BY_ID` (registry `note` per step; `formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine`). Specs: `docs/RELEASE.md` — `formatPackagedGuiE2ePlaywrightReleaseWiringHandoffBullet`. Manual checklists — `IMPLEMENTATION_MANUAL_VERIFICATION.md` (not in app UI); about Support ZIP — `formatPackagedGuiE2ePlaywrightUiHintSuffix` (`check:support-bundle-terminal-hints`). **manual-owner** without GUI automation: `video-sprite` (§7.5) — attach Support ZIP `terminalHints:` (§8, `check:help-terminal-hints-docs`, 24 articles). Step Help — [packaged-windows-smoke.md](../packaged-windows-smoke.md) and workflow articles (`check:help-workflow-smoke-crosslinks`, 44 articles; partition: tail 42 + ffmpeg + knowledge, FAQ outside 44).

After the run, tick items in [`IMPLEMENTATION_MANUAL_VERIFICATION.md`](../../IMPLEMENTATION_MANUAL_VERIFICATION.md) and attach a Support ZIP if you contact support.


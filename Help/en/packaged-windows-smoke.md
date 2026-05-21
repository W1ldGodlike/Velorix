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

**Copy** in the packaged panel emits the same layout as Support ZIP: `owner:`, `automated:`, `doc:`, `ui:`, then `step [id]:`, then **§21 packaged e2e (CI vs owner)** (2/8/2 groups and per-step `e2e <id>:`). With **English UI**, strings come from `locales/en/win-packaged-manual-smoke.json`. The packaged block in the full owner bundle — [owner-manual-smoke.md](owner-manual-smoke.md). **Planned GUI e2e** (8 steps, Playwright later): `open-file`, `ytdlp`, `editor-dl`, `snapshot`, `export`, `knowledge`, `support-zip`, `settings`. `npm run test:e2e:gui` → `tests/e2e/gui/planned-gui-e2e.spec.ts` (8 skipped without `FLUXALLOY_E2E_APP`; `check:packaged-gui-e2e-playwright-deferred`). Playwright scaffold: `tests/e2e/gui/planned-gui-e2e-steps.ts` (`PLANNED_GUI_E2E_STEP_IDS`, `PLANNED_GUI_E2E_SCENARIOS`, `PLANNED_GUI_E2E_STEP_BY_ID`). Copy/releaseSmoke includes `PLANNED_GUI_E2E_STEP_BY_ID` (registry `note` per step; `formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine`). Specs: `docs/RELEASE.md` — `formatPackagedGuiE2ePlaywrightReleaseWiringHandoffBullet`. Dev: `npm run check:packaged-manual-smoke-parity`, `npm run check:packaged-e2e-scenarios-registry` (per-step `e2e launch:` in `releaseSmoke:`), `check:help-workflow-smoke-crosslinks` (44 articles; partition: tail 42 + ffmpeg + knowledge, FAQ outside 44) — in `check:quiet`. §21 Playwright: `npm run test:e2e:gui` → `tests/e2e/gui/planned-gui-e2e.spec.ts` (8 skipped without `FLUXALLOY_E2E_APP`; `check:packaged-gui-e2e-playwright-deferred`). UiHintSuffix: `formatPackagedGuiE2ePlaywrightUiHintSuffix` (4 settings + `aboutSupportZipDiagnosticsSectionsHint`; `check:owner-visual-smoke-locale`, `check:support-bundle-terminal-hints`).

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

**Distribution beyond dev:** Authenticode signing via `signtool.exe`/CSC (`CSC_LINK`, `WIN_CSC_LINK`) — roadmap in [`docs/RELEASE.md`](../docs/RELEASE.md) §4; `pack:dir` may omit signing (`CSC_IDENTITY_AUTO_DISCOVERY=false`) until publish.

On any OS, Support ZIP `releaseSmoke:` lists `dist/win-unpacked/` and `resources/*` layout lines (present/missing); dev block `terminalHints:` (§8) — useful after `pack:dir` without re-running verify locally.

See also [about-support-logs.md](about-support-logs.md) and [logging-and-diagnostics.md](logging-and-diagnostics.md).

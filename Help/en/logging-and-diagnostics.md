# Logs and diagnostics

## Where logs live

The main process log is **`main.log`** under the `logs` folder in the app data directory (next to settings and queues). A small rotated backup may sit beside it.

## Session log

Each launch gets a short **session** log file — useful when describing steps to support.

## How to open

**Tools** menu entries open the log in your viewer and build a **support archive** (one zip with several useful files).

`diagnostics.txt` in the archive includes:

- **`ownerHardwareChecklist:`** — owner hardware checklist (theme, HiDPI, HW, packaged, §21 e2e); see [about-support-logs.md](about-support-logs.md).
- **`releaseSmoke:`** — CI packaged pipeline and §21 e2e plan; see [about-support-logs.md](about-support-logs.md).
- **`terminalHints:`** — terminal hints snapshot; see [ffmpeg-terminal-hints.md](ffmpeg-terminal-hints.md).

## More in About

Temporary cleanup and folder sizes — [about-support-logs.md](about-support-logs.md).

## See also

[about-support-logs.md](about-support-logs.md) (Support ZIP `ownerHardwareChecklist:`) · [packaged-windows-smoke.md](packaged-windows-smoke.md) (post-`pack:dir`).

Dev: `npm run check:packaged-e2e-scenarios-registry`, `check:help-workflow-smoke-crosslinks` (44 articles; partition: tail 42 + ffmpeg + knowledge, FAQ outside 44, in `check:quiet`); §19 publish signing (win/linux/mac): [`release-code-signing-roadmap.ts`](../../src/shared/release-code-signing-roadmap.ts) + [`docs/RELEASE.md`](../../docs/RELEASE.md) §4/§4.1/§4.2 — `check:help-packaged-smoke-docs`; §19 build: `fix:esm-shim` / `electron-vite-build-meta.ts` (Linux/CI `npm run build`); §21 Playwright: `npm run UI ZERO (Playwright removed)` (canon — `docs/VELORIX_NEON_THEME.md`). §8 terminal — `check:terminal-contract-hints-shards` (14 downloads + 8 preview shards (22 files), 839+465 hints), `check:help-terminal-hints-docs` (22 articles), `check:support-bundle-terminal-hints`, `check:terminal-hints-locale` (Settings → Dependencies). Support ZIP `ownerHardwareChecklist:` / `releaseSmoke:` appends **§21 packaged e2e (CI vs owner)**; Support ZIP includes **owner manual (9 steps)** until GUI restore (Playwright 0; UI ZERO). UiHintSuffix: `appSettingsTerminalHintsGuardHint` (`check:terminal-hints-locale`); Playwright — `formatPackagedGuiE2ePlaywrightUiHintSuffix` (settings + `aboutSupportZipDiagnosticsSectionsHint`; `check:owner-hardware-checklist-locale`, `check:support-bundle-terminal-hints`).

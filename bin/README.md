# Bundled Engines

This folder is copied to `resources/bin` by `electron-builder`.

For a Windows release build, place checked runtime binaries here before packaging:

- `ffmpeg.exe`
- `ffprobe.exe`
- `yt-dlp.exe`

Do not commit the binaries. They are intentionally ignored by `.gitignore`.

For local Windows development, run:

```powershell
npm run engines:prepare:win
```

Force re-download (ignore existing exe): `npm run engines:prepare:win:force` (see `docs/RELEASE.md`). Quick verify (SHA + versions): `npm run engines:doctor`.

After prepare, print SHA256 for `trusted_hashes.json` (see `docs/RELEASE.md`):

```powershell
npm run engines:report-hashes
npm run engines:report-hashes -- --versions
```

Таймаут загрузки движков по сети (мс): `FLUXALLOY_ENGINE_DOWNLOAD_TIMEOUT_MS` (см. `docs/RELEASE.md`).

GitHub Actions caches `bin/` between runs; the cache key hashes engine bootstrap/verify scripts and `trusted_hashes.json` (see `.github/workflows/ci.yml` for the exact `hashFiles` list).

Unpack smoke output (`electron-builder --dir`): **`dist/win-unpacked/`** after `npm run pack:dir` or `npm run check:release` (see `docs/RELEASE.md` §1 and §4).

Full Windows release artifacts (see `docs/RELEASE.md`): `npm run release:win` or `npm run release:win:force` from repo root.

`npm run dev` runs **`engines:prepare:win`** via npm **`predev`** before starting Electron (not **`engines:doctor`** — run manually if needed).

Runtime resolution order is:

1. Manual path override from settings.
2. Bundled `resources/bin`.
3. Downloaded/updated `app-data/bin` next to the application.

### macOS / Linux (gap)

- `engines:prepare:mac` / `engines:prepare:linux` — help-only bundled-first (без сетевой загрузки; только `engines:prepare:win` качает exe).
- **Порядок владельца:** (1) положить `ffmpeg`, `ffprobe`, `yt-dlp` в этот `bin/` (без `.exe`); (2) `npm run engines:doctor`; (3) `build` + `pack:*:dir` + `verify:*`; (4) UI packaged smoke + [owner-manual-smoke](../Help/ru/owner-manual-smoke.md) (§21 e2e в Support ZIP).
- **macOS (локально):** `npm run build && npm run pack:mac:dir` → `npm run verify:mac-unpacked` (проверка `dist/mac*/FluxAlloy.app`).
- **Linux (локально):** быстрый smoke — `pack:linux:dir` + `verify:linux-unpacked` (как в CI); полный релиз — `npm run build:linux` → `npm run verify:linux-release` (`.AppImage` + `.deb` в `dist/`).
- GitHub Actions: **windows-latest** — `engines:prepare:win` + packaged smokes; **ubuntu-latest** — `check:quiet` + `build` + `pack:linux:dir` + `verify:linux-unpacked` (движки в `bin/` для CI не обязательны). `electron-vite build` на Linux — плагин `fix:esm-shim` (`electron-vite-build-meta.ts`). См. `docs/ARCHITECTURE.md` § Bundled engines и CI.
- Packaged owner-smoke locales (win/linux/macos): `npm run check:packaged-manual-smoke-parity` — в `check:quiet`; UI **Скопировать** (packaged + owner bundle) дописывает §21 packaged e2e appendix — Настройки → Зависимости.
- §21 packaged e2e registry: `npm run check:packaged-e2e-scenarios-registry` (12 steps; `ciSmokeScript` ↔ `package.json`; `PACKAGED_E2E_CI_SMOKE_SCRIPT_EXPANSIONS` parent→leaf, напр. `smoke:packaged-engines` → ffprobe/ytdlp/ffmpeg); Support ZIP — per-step `e2e <id>:`; planned GUI e2e — `listPackagedE2eStepIdsByAutomation('planned-gui-e2e')` в diagnostics.
- §21 Playwright GUI e2e: `npm run check:packaged-gui-e2e-playwright-deferred` — `npm run test:e2e:gui` → `tests/e2e/gui/planned-gui-e2e.spec.ts` (8 skip без `FLUXALLOY_E2E_APP`).
- §21 Playwright scaffold: `tests/e2e/gui/planned-gui-e2e-steps.ts` exports `PLANNED_GUI_E2E_STEP_IDS, PLANNED_GUI_E2E_SCENARIOS, PLANNED_GUI_E2E_STEP_BY_ID` (8 steps; env `FLUXALLOY_E2E_APP` или `dist/win-unpacked/FluxAlloy.exe`).
- §21 Playwright planned notes (deferred): `PLANNED_GUI_E2E_STEP_BY_ID` in `tests/e2e/gui/planned-gui-e2e-steps.ts`; Copy/releaseSmoke — `formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine`.
- §21 Playwright specs (next): `docs/RELEASE.md` — `formatPackagedGuiE2ePlaywrightReleaseWiringHandoffBullet`.
- §21 Playwright UI hints (locales): `check:owner-visual-smoke-locale` (4 settings keys, `formatPackagedGuiE2ePlaywrightUiHintSuffix`); about — `check:support-bundle-terminal-hints`.
- Help §21 crosslinks: `npm run check:help-workflow-smoke-crosslinks` — канон `packaged-e2e-help-workflow-crosslinks-meta` (44 articles; 44/44 workflow user crosslink footers; packaged/owner anchors).
- Workflow crosslinks (44): user footer (owner-manual-smoke + packaged-windows-smoke); 44/44 workflow user crosslink footers.
- Packaged Help (win/linux/macos): `npm run check:help-packaged-smoke-docs` — `formatPackagedE2eHelpWorkflowCrosslinksPackagedCrosslinksQuietSuffix` (44 articles, 6 articles).
- §19 publish signing (win/linux/mac): [`release-code-signing-roadmap.ts`](../src/shared/release-code-signing-roadmap.ts) + [`docs/RELEASE.md`](../docs/RELEASE.md) §4/§4.1/§4.2; Help packaged win/linux/macos + §15 hub — `check:help-packaged-smoke-docs`, `check:help-owner-smoke-docs`, strict signing in `check:help-workflow-smoke-crosslinks`.
- §19 signing indexed: Help §15 hub + `check:help-packaged-smoke-docs` + `check:help-owner-smoke-docs` + strict signing crosslinks; SDK `continue.txt` / `initial.txt` / `agent-contract.txt` — `formatReleaseCodeSigningRoadmapSdkPromptSprintSigningIndexedBlock` / `formatReleaseCodeSigningRoadmapSdkContractSigningIndexedClause`; diagnostics — `check:release` / `check:platform-packaging-scripts` (`formatReleaseCodeSigningRoadmapSdkPromptSprintSigningIndexedDiagnosticLine`). Packaging indexed: `electron-builder.yml` (**9** §19 yaml comments; J-1520..1539).
- Packaging config + **9** §19 yaml comments in [`electron-builder.yml`](../electron-builder.yml) (`getReleaseCodeSigningElectronBuilderYmlComments` in `release-code-signing-roadmap.ts`; win/mac/linux/dmg/appImage/publish).
- Toolchain baseline: `main` @ `ff89765`, journal **J-1353..1571** — [`toolchain-baseline-wip-handoff-meta.ts`](../src/shared/toolchain-baseline-wip-handoff-meta.ts); план удалён **J-1559**; **Следующий cadence** **J-1570** commit.
- Help workflow crosslinks (`formatPackagedE2eHelpWorkflowCrosslinksBinReadmePartitionGuardLine`): `npm run check:help-workflow-smoke-crosslinks` — user footer (`owner-manual-smoke` + `packaged-windows-smoke`) in all 44 workflow Help; sync `node scripts/sync-help-workflow-user-footers.mjs`.
- Help smoke guards (`check:quiet`): registry `npm run check:help-smoke-guards-package-json`, then `npm run check:help-workflow-smoke-crosslinks`, `npm run check:help-owner-smoke-docs`, `npm run check:help-packaged-smoke-docs`; §21 Playwright deferred — `npm run check:packaged-gui-e2e-playwright-deferred` (optional, не в quiet).
- Terminal §8 guards (`check:quiet`, канон `terminal-contract-hints-meta`): registry `npm run check:terminal-hints-guards-package-json`, Help `npm run check:help-terminal-hints-docs`, then `npm run check:terminal-contract-hints-shards`, `npm run check:terminal-hints-locale`, `npm run check:support-bundle-terminal-hints`. RU summaries — `npm run check:terminal-summaries-ru` после правок `terminal-contract.ts` (optional).
- Support ZIP `releaseSmoke:` (About → архив): layout **present/missing** для `dist/win-unpacked/`, `dist/linux-unpacked/`, `FluxAlloy.app` — без повторного `verify:*` на другой ОС.

Keep a note of the source, version, license variant, and SHA256 used for each released binary.

Release/license notes: `docs/BUNDLED_ENGINES_LICENSES.md`.

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

- Авто-скрипта `engines:prepare:mac` / `engines:prepare:linux` **нет** (только `engines:prepare:win`).
- **Порядок владельца:** (1) положить `ffmpeg`, `ffprobe`, `yt-dlp` в этот `bin/` (без `.exe`); (2) `npm run engines:doctor`; (3) `build` + `pack:*:dir` + `verify:*`; (4) UI packaged smoke + [owner-manual-smoke](../Help/owner-manual-smoke.md) (§21 e2e в Support ZIP).
- **macOS (локально):** `npm run build && npm run pack:mac:dir` → `npm run verify:mac-unpacked` (проверка `dist/mac*/FluxAlloy.app`).
- **Linux (локально):** быстрый smoke — `pack:linux:dir` + `verify:linux-unpacked` (как в CI); полный релиз — `npm run build:linux` → `npm run verify:linux-release` (`.AppImage` + `.deb` в `dist/`).
- GitHub Actions: **windows-latest** — `engines:prepare:win` + packaged smokes; **ubuntu-latest** — `check:quiet` + `build` + `pack:linux:dir` + `verify:linux-unpacked` (движки в `bin/` для CI не обязательны). `electron-vite build` на Linux — плагин `fix:esm-shim` (`electron-vite-build-meta.ts`). См. `docs/ARCHITECTURE.md` § Bundled engines и CI.
- Packaged owner-smoke locales (win/linux/macos): `npm run check:packaged-manual-smoke-parity` — в `check:quiet`; UI **Скопировать** (packaged + owner bundle) дописывает §21 packaged e2e appendix — Настройки → Зависимости.
- §21 packaged e2e registry: `npm run check:packaged-e2e-scenarios-registry` (12 steps; `ciSmokeScript` ↔ `package.json`; `PACKAGED_E2E_CI_SMOKE_SCRIPT_EXPANSIONS` parent→leaf, напр. `smoke:packaged-engines` → ffprobe/ytdlp/ffmpeg); Support ZIP — per-step `e2e <id>:`; planned GUI e2e — `listPackagedE2eStepIdsByAutomation('planned-gui-e2e')` в diagnostics.
- Help §21 crosslinks: `npm run check:help-workflow-smoke-crosslinks` — канон `packaged-e2e-help-workflow-crosslinks-meta` (44 articles; packaged/owner anchors).
- Workflow crosslinks partition (44): tail 42 HelpCrosslinksCountTail + ffmpeg FfmpegTerminalWorkflowClause + knowledge KnowledgeHubDevClause (FAQ 2 in tail, outside 44).
- Packaged Help (win/linux/macos): `npm run check:help-packaged-smoke-docs` — `formatPackagedE2eHelpWorkflowCrosslinksPackagedCrosslinksQuietSuffix` (44 articles, 6 articles).
- Help workflow partition guard (`formatPackagedE2eHelpWorkflowCrosslinksBinReadmePartitionGuardLine`): `npm run check:help-smoke-guards-package-json` requires `partition:` in all 44 workflow Help.
- Help smoke guards (`check:quiet`): registry `npm run check:help-smoke-guards-package-json`, then `npm run check:help-workflow-smoke-crosslinks`, `npm run check:help-owner-smoke-docs`, `npm run check:help-packaged-smoke-docs`.
- Terminal §8 guards (`check:quiet`, канон `terminal-contract-hints-meta`): registry `npm run check:terminal-hints-guards-package-json`, Help `npm run check:help-terminal-hints-docs`, then `npm run check:terminal-summaries-ru`, `npm run check:terminal-data-summaries`, `npm run check:terminal-scenario-summaries`, `npm run check:terminal-contract-hints-shards`, `npm run check:terminal-hints-locale`, `npm run check:support-bundle-terminal-hints`.
- Support ZIP `releaseSmoke:` (About → архив): layout **present/missing** для `dist/win-unpacked/`, `dist/linux-unpacked/`, `FluxAlloy.app` — без повторного `verify:*` на другой ОС.

Keep a note of the source, version, license variant, and SHA256 used for each released binary.

Release/license notes: `docs/BUNDLED_ENGINES_LICENSES.md`.

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

Таймаут загрузки движков по сети (мс): `VELORIX_ENGINE_DOWNLOAD_TIMEOUT_MS` (см. `docs/RELEASE.md`).

GitHub Actions caches `bin/` between runs; the cache key hashes engine bootstrap/verify scripts and `trusted_hashes.json` (see `.github/workflows/ci.yml` for the exact `hashFiles` list).

Unpack smoke output (`electron-builder --dir`): **`dist/win-unpacked/`** after `npm run pack:dir` or `npm run check:release` (see `docs/RELEASE.md` §1 and §4).

Full Windows release artifacts (see `docs/RELEASE.md`): `npm run release:win` or `npm run release:win:force` from repo root.

`npm run dev` runs **`predev`** (`scripts/release/predev-engines.mjs`): on Windows — `engines:prepare:win`; on macOS/Linux — `engines:doctor` verify when `bin/ffmpeg`, `bin/ffprobe`, `bin/yt-dlp` exist (otherwise a one-line hint).

Runtime resolution order is:

1. Manual path override from settings.
2. Bundled `resources/bin`.
3. Downloaded/updated `app-data/bin` next to the application.

### macOS / Linux

- `engines:prepare:mac` / `engines:prepare:linux` — на **целевом** хосте: скачивание `yt-dlp` + BtbN `ffmpeg`/`ffprobe` в `bin/` (`prepare-engines-unix.mjs`); с другой ОС — подсказки.
- **`engines:doctor`** на darwin/linux — presence + `--version` (опционально SHA256 в `trusted_hashes.json` → `darwin` / `linux-x64`).
- **Порядок:** (1) `npm run engines:prepare:mac|linux` на macOS/Linux; (2) `npm run engines:doctor`; (3) `build` + `pack:*:dir` + `verify:*`; (4) Support ZIP `unpackedLayout:` — [about-support-logs](../Help/ru/about-support-logs.md).
- **macOS (локально):** `npm run build && npm run pack:mac:dir` → `npm run verify:mac-unpacked` (проверка `dist/mac*/Velorix.app`).
- **Linux (локально):** быстрый smoke — `pack:linux:dir` + `verify:linux-unpacked` (как в CI); полный релиз — `npm run build:linux` → `npm run verify:linux-release` (`.AppImage` + `.deb` в `dist/`).
- GitHub Actions: **windows-latest** — `engines:prepare:win` + `pack:dir` + `verify:win-unpacked`; **ubuntu-latest** — `check:quiet` + `build` + `pack:linux:dir` + `verify:linux-unpacked` (движки в `bin/` для CI не обязательны). `electron-vite build` на Linux — плагин `fix:esm-shim` (`electron-vite-build-meta.ts`). См. `docs/ARCHITECTURE.md` § Bundled engines и CI.
- CI packaged: `npm run pack:dir` + `npm run verify:win-unpacked`; Support ZIP `unpackedLayout:` (present/missing).
- §19 publish signing (win/linux/mac): [`release-code-signing-roadmap.ts`](../src/shared/release-code-signing-roadmap.ts) + [`docs/RELEASE.md`](../docs/RELEASE.md) §4/§4.1/§4.2; Help §15 hub — `check:help-terminal-hints-docs`.
- §19 signing indexed: Help §15 hub + `check:help-terminal-hints-docs`; SDK `continue.txt` / `initial.txt` / `agent-contract.txt` — `formatReleaseCodeSigningRoadmapSdkPromptSprintSigningIndexedBlock` / `formatReleaseCodeSigningRoadmapSdkContractSigningIndexedClause`; diagnostics — `check:release` / `check:platform-packaging-scripts` (`formatReleaseCodeSigningRoadmapSdkPromptSprintSigningIndexedDiagnosticLine`). Packaging indexed: `electron-builder.yml` (**9** §19 yaml comments; J-1520..1539).
- Packaging config + **9** §19 yaml comments in [`electron-builder.yml`](../electron-builder.yml) (`getReleaseCodeSigningElectronBuilderYmlComments` in `release-code-signing-roadmap.ts`; win/mac/linux/dmg/appImage/publish).
- Toolchain baseline: `main` @ `ff89765`, journal **J-1353..1571** — [`toolchain-baseline-wip-handoff-meta.ts`](../src/shared/toolchain-baseline-wip-handoff-meta.ts); план удалён **J-1559**; **следующий commit по J** **J-1580**.
- Terminal §8 guards (`check:quiet`, канон `terminal-contract-hints-meta`): registry `npm run check:terminal-hints-guards-package-json`, Help `npm run check:help-terminal-hints-docs`, then `npm run check:terminal-contract-hints-shards`, `npm run check:support-bundle-terminal-hints`. RU summaries — `npm run check:terminal-summaries-ru` после правок `terminal-contract.ts` (optional).
- Support ZIP `unpackedLayout:` (About → архив): layout **present/missing** для `dist/win-unpacked/`, `dist/linux-unpacked/`, `Velorix.app` — без повторного `verify:*` на другой ОС.

Keep a note of the source, version, license variant, and SHA256 used for each released binary.

Release/license notes: `docs/BUNDLED_ENGINES_LICENSES.md`.

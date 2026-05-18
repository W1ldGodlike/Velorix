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
- Перед `npm run build:mac` / `build:linux` положите `ffmpeg`, `ffprobe`, `yt-dlp` в этот `bin/` вручную, затем `npm run engines:doctor`.
- **macOS (локально):** `npm run build && npm run pack:mac:dir` → `npm run verify:mac-unpacked` (проверка `dist/mac*/FluxAlloy.app`).
- **Linux (локально):** быстрый smoke — `pack:linux:dir` + `verify:linux-unpacked` (как в CI); полный релиз — `npm run build:linux` → `npm run verify:linux-release` (`.AppImage` + `.deb` в `dist/`).
- GitHub Actions: **windows-latest** — `engines:prepare:win` + packaged smokes; **ubuntu-latest** — `pack:linux:dir` + `verify:linux-unpacked` (движки в `bin/` для CI не обязательны). См. `docs/ARCHITECTURE.md` § Bundled engines и CI.
- Packaged owner-smoke locales (win/linux/macos): `npm run check:packaged-manual-smoke-parity` — в `check:quiet`; UI copy — Настройки → Зависимости.

Keep a note of the source, version, license variant, and SHA256 used for each released binary.

Release/license notes: `docs/BUNDLED_ENGINES_LICENSES.md`.

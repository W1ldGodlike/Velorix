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

Full Windows release artifacts (see `docs/RELEASE.md`): `npm run release:win` or `npm run release:win:force` from repo root.

`npm run dev` runs the same check automatically before starting Electron.

Runtime resolution order is:

1. Manual path override from settings.
2. Bundled `resources/bin`.
3. Downloaded/updated `userData/bin`.

Keep a note of the source, version, license variant, and SHA256 used for each released binary.

Release/license notes: `docs/BUNDLED_ENGINES_LICENSES.md`.

# Bundled Engines: Licenses And Sources

FluxAlloy может поставляться с runtime-движками в `resources/bin` (исходно `bin/` перед упаковкой). Эти файлы не являются частью исходного кода FluxAlloy и имеют собственные лицензии.

## yt-dlp

- Binary: `yt-dlp.exe`
- Upstream: <https://github.com/yt-dlp/yt-dlp>
- License: Unlicense (см. upstream repository)
- Release source used by downloader: GitHub latest release.

## ffmpeg / ffprobe

- Binaries: `ffmpeg.exe`, `ffprobe.exe`
- Upstream project: <https://ffmpeg.org/>
- Windows builds used by downloader:
  - BtbN `ffmpeg-master-latest-win64-gpl.zip`
  - fallback gyan.dev `ffmpeg-release-essentials.zip`
- License depends on the selected build and configure flags.

Current downloader prefers a **GPL** BtbN build. Treat redistributed installer artifacts as containing GPL-covered ffmpeg binaries unless the release process deliberately swaps them for another compatible build.

## Release Requirements

Before distributing an installer:

1. Record exact binary versions:
   - `yt-dlp --version`
   - `ffmpeg -version`
   - `ffprobe -version`
2. Record source URLs and SHA256 checksums.
3. Fill `Data/trusted_hashes.json` for the released Windows archives/binaries when reproducible verification is required. For extracted engines, use `windows-x64["yt-dlp.exe"]`, `["ffmpeg.exe"]`, `["ffprobe.exe"]` (verification flow: `npm run engines:verify-bundled` / `npm run engines:doctor` — см. `docs/RELEASE.md`).
4. Optional: tune download timeouts via `FLUXALLOY_ENGINE_DOWNLOAD_TIMEOUT_MS` (see `docs/RELEASE.md`).
5. Include/keep access to third-party license texts in release notes or bundled docs.
6. Do not commit binaries into Git. They stay ignored by `.gitignore`.

## Runtime Resolution Order

1. Manual path override in settings.
2. Bundled `resources/bin`.
3. Downloaded/updated `app-data/bin`.

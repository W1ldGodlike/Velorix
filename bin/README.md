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

`npm run dev` runs the same check automatically before starting Electron.

Runtime resolution order is:

1. Manual path override from settings.
2. Bundled `resources/bin`.
3. Downloaded/updated `userData/bin`.

Keep a note of the source, version, license variant, and SHA256 used for each released binary.

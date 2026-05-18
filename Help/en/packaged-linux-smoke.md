# Manual Linux packaged smoke (pack:linux:dir)

Test the **built** app from `dist/linux-unpacked/`, not the Vite dev server. Layout check **`npm run verify:linux-unpacked`** does **not** replace this run.

## Preparation

```bash
npm run build
npm run pack:linux:dir
npm run verify:linux-unpacked
```

The folder must contain `fluxalloy` or `FluxAlloy` and `resources/bin/{yt-dlp,ffmpeg,ffprobe}` (fill project `bin/` before packaging for a release build).

## In-app checklist

**Settings → Dependencies → Manual Linux packaged smoke (pack:linux:dir)** — copy the steps for your report; they appear in Support ZIP as `linuxPackagedSmoke:`.

## Short order

1. Run the binary from `dist/linux-unpacked/`.
2. Status bar: engine versions with no “not found”.
3. Editor, downloads, snapshot, export, knowledge base, Support ZIP.
4. Quit and relaunch — no crash.

Details: [`docs/RELEASE.md`](../../docs/RELEASE.md) §4.1.

See also [about-support-logs.md](about-support-logs.md) and [packaged-windows-smoke.md](../packaged-windows-smoke.md).

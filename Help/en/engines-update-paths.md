# Tools: locations and updates

## Bundled copy

The installed app ships with checked-in versions of the **link downloader** and the **encoding bundle**. When they are present you can work right after setup.

## Custom paths

You can point each tool to a manual path in settings — handy for test builds or corporate policies.

## Download button

When bundled files are missing, the status area offers to **download** the missing component into the user data folder. Progress appears in the bottom bar.

## Integrity checks

Windows release builds can enable strict hash checks to guard against tampered binaries. Maintainer notes live in the project’s build documentation.

## Packaged smoke (§19 / §21)

After `npm run pack:dir` (Windows) or `pack:linux:dir` / `pack:mac:dir`, verify engines under `dist/*-unpacked` (`smoke:packaged-*` in CI). Owner manual smoke and §21 e2e (per-step `e2e <id>:` in Support ZIP `releaseSmoke:`) — [owner-manual-smoke.md](owner-manual-smoke.md), [packaged-windows-smoke.md](../packaged-windows-smoke.md). Dev: `npm run check:packaged-e2e-scenarios-registry`; see `bin/README.md`.

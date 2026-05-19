# Manual smoke on your hardware

CI tests cover **ffmpeg argv**, not your real GPU or display scale. Before you rely on a release build, run the owner checklist bundle on your machine.

## Where to find it

1. **Settings → Dependencies** — **Owner manual smoke**: expand section previews (**Theme**, HiDPI, HW, scenario, video sprite §7.5, mini player §4.3, packaged, scheduler, shell), then **Copy full bundle** (same text in Support ZIP `ownerManualSmoke:`; with **English UI** — EN strings from `locales/en/settings.json` and packaged shards). **Jump to …** buttons switch the settings tab and scroll to theme, HiDPI, HW, packaged, or Explorer. Panel hints mention dev guards: `check:owner-visual-smoke-locale`, `check:packaged-manual-smoke-parity`, `check:packaged-e2e-scenarios-registry`, `check:help-terminal-hints-docs` (§21: 12 packaged steps ↔ CI headless or planned GUI e2e).
2. Below: separate panels (each deep-links here): **NVENC/VAAPI**, **packaged smoke**; **HiDPI** and **Windows Explorer** — **General** tab. From the hub: **Open task planner** / **Open scenario builder** (same as **Service** menu).
3. **Support ZIP** — `ownerManualSmoke:` in `diagnostics.txt`; `releaseSmoke:` — CI packaged pipeline and §21 e2e plan; dev block `terminalHints:` (§8 guards) — [about-support-logs.md](about-support-logs.md), [logging-and-diagnostics.md](logging-and-diagnostics.md).

## What to verify

| Block            | Goal                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------ |
| Theme            | Dark / light / match system: contrast, focus, modals, downloads pop-out, inspector   |
| HiDPI            | Windows scale 100–200 %: editor, downloads, modals, status bar                       |
| HW encode        | NVENC (Win) or VAAPI (Linux): probe, manual codec, hw_auto, benchmark                |
| Scenario builder | Builder UI, JSON edges, run from editor / URL                                        |
| Video sprite §7.5 | FFmpeg rail → preview sprite sheet: grid, PTS burn-in, PNG/JPEG save; offline test guard |
| Mini Player §4.3 | Service → mini player while tasks run: %/speed, RMB always-on-top, restore main, `session.json` |
| Packaged         | `dist/win-unpacked` / `linux-unpacked` / `.app` — packaged panel; **Copy** emits `owner:`/`automated:`/`step [...]` + **§21 packaged e2e (CI vs owner)** (same appendix as full bundle) |
| OS scheduler     | Watch-folder + Task Scheduler / launchd / systemd user timer                         |
| Windows shell    | Explorer menu, Open with, Default apps (Windows only)                                |

Details: [hardware-encoding.md](hardware-encoding.md), [appearance-language-theme.md](appearance-language-theme.md), [workflows-planner-scenarios.md](workflows-planner-scenarios.md), [windows-shell-integration.md](windows-shell-integration.md).

**Copy full bundle** and Support ZIP `ownerManualSmoke:` end with **§21 packaged e2e (CI vs owner)** (`formatPackagedManualSmokeE2eAppendixLines`: ci-headless / planned-gui-e2e / manual-owner groups plus **12 lines** `e2e <stepId>: <automation> script=…`, e.g. `e2e launch: ci-headless script=smoke:packaged-app`); `releaseSmoke:` has the same diagnostics without the separate heading line.

**Planned GUI e2e** (Playwright later; manual smoke today): `open-file`, `ytdlp`, `editor-dl`, `snapshot`, `export`, `knowledge`, `support-zip`, `settings`. **manual-owner** without GUI automation: `video-sprite`, `mini-player` (§7.5 / §4.3) — attach Support ZIP `terminalHints:` (§8, `check:help-terminal-hints-docs`, 24 articles). Step Help — [packaged-windows-smoke.md](../packaged-windows-smoke.md) and workflow articles (`check:help-workflow-smoke-crosslinks`, 44 articles; partition: tail 42 + ffmpeg + knowledge, FAQ outside 44).

After the run, tick items in `IMPLEMENTATION_CHECKLIST.md` (owner smoke section) and attach a Support ZIP if you contact support.

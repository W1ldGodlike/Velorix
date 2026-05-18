# Manual smoke on your hardware

CI tests cover **ffmpeg argv**, not your real GPU or display scale. Before you rely on a release build, run the owner checklist bundle on your machine.

## Where to find it

1. **Settings → Dependencies** — **Owner manual smoke**: expand section previews (**Theme**, HiDPI, HW, scenario, video sprite §7.5, mini player §4.3, packaged, scheduler, shell), then **Copy full bundle** (same text in Support ZIP `ownerManualSmoke:`; with **English UI** — EN strings from `locales/en/settings.json` and packaged shards). **Jump to …** buttons switch the settings tab and scroll to theme, HiDPI, HW, packaged, or Explorer. Panel hints mention dev guards: `check:owner-visual-smoke-locale`, `check:packaged-manual-smoke-parity`.
2. Below: separate panels (each deep-links here): **NVENC/VAAPI**, **packaged smoke**; **HiDPI** and **Windows Explorer** — **General** tab. From the hub: **Open task planner** / **Open scenario builder** (same as **Service** menu).
3. **Support ZIP** — `ownerManualSmoke:` section inside `diagnostics.txt`.

## What to verify

| Block            | Goal                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------ |
| Theme            | Dark / light / match system: contrast, focus, modals, downloads pop-out, inspector   |
| HiDPI            | Windows scale 100–200 %: editor, downloads, modals, status bar                       |
| HW encode        | NVENC (Win) or VAAPI (Linux): probe, manual codec, hw_auto, benchmark                |
| Scenario builder | Builder UI, JSON edges, run from editor / URL                                        |
| Video sprite §7.5 | FFmpeg rail → preview sprite sheet: grid, PTS burn-in, PNG/JPEG save; offline test guard |
| Mini Player §4.3 | Service → mini player while tasks run: %/speed, RMB always-on-top, restore main, `session.json` |
| Packaged         | `dist/win-unpacked` / `linux-unpacked` / `.app` — packaged panel; **Copy** emits `owner:`/`automated:`/`step [...]` like Support ZIP |
| OS scheduler     | Watch-folder + Task Scheduler / launchd / systemd user timer                         |
| Windows shell    | Explorer menu, Open with, Default apps (Windows only)                                |

Details: [hardware-encoding.md](hardware-encoding.md), [appearance-language-theme.md](appearance-language-theme.md), [workflows-planner-scenarios.md](workflows-planner-scenarios.md), [windows-shell-integration.md](windows-shell-integration.md).

After the run, tick items in `IMPLEMENTATION_CHECKLIST.md` (owner smoke section) and attach a Support ZIP if you contact support.

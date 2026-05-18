# Manual smoke on your hardware

CI tests cover **ffmpeg argv**, not your real GPU or display scale. Before you rely on a release build, run the owner checklist bundle on your machine.

## Where to find it

1. **Settings → Dependencies** — **Owner manual smoke** block and **Copy full bundle** (HiDPI + HW + scenarios + packaged smoke for your OS + scheduler + Windows shell + dpi snapshot).
2. Below that: separate panels (each with a deep-link to this article): **NVENC/VAAPI**, **HiDPI** (General tab), **packaged smoke**, **Windows Explorer**; task planner and scenario builder — under **Service** menu.
3. **Support ZIP** — `ownerManualSmoke:` section inside `diagnostics.txt`.

## What to verify

| Block | Goal |
|-------|------|
| HiDPI | Windows scale 100–200 %: editor, downloads, modals, status bar |
| HW encode | NVENC (Win) or VAAPI (Linux): probe, manual codec, hw_auto, benchmark |
| Scenario builder | Builder UI, JSON edges, run from editor / URL |
| Packaged | `dist/win-unpacked` / `linux-unpacked` / `.app` — see the packaged panel in Settings |
| OS scheduler | Watch-folder + Task Scheduler / launchd / systemd user timer |
| Windows shell | Explorer menu, Open with, Default apps (Windows only) |

Details: [hardware-encoding.md](hardware-encoding.md), [appearance-language-theme.md](appearance-language-theme.md), [workflows-planner-scenarios.md](workflows-planner-scenarios.md), [windows-shell-integration.md](windows-shell-integration.md).

After the run, tick items in `IMPLEMENTATION_CHECKLIST.md` (owner smoke section) and attach a Support ZIP if you contact support.

# Theme and language

## Theme

Variant A product canon is a **single VELORIX NEON theme**. The app no longer exposes `dark` / `light` / `system` as user-facing choices; the interface always runs in one NEON runtime.

### Visual theme checklist

Verify the unified NEON UI against this checklist: primary button and accent link contrast, Tab focus rings, disabled states, glass/backdrop treatment for Settings/About modals, `Downloads` and `Inspector` surfaces inside the shell, and scenario builder / planner nodes. Standalone pop-out surfaces and `match system` checks are not part of the target UX.

## Interface language

Language changes button labels, built-in FFmpeg export presets, status messages, and **this help text**. Switching language from the top bar or **Settings → General** applies immediately without restarting; an open help window refreshes the table of contents and article text automatically.

## Windows scaling (HiDPI)

**Settings → General → Display scale (HiDPI)** shows:

- the window `devicePixelRatio`;
- approximate Windows scale (100 / 125 / 150 / 200 %);
- which CSS `@120/144/168/192dpi` block is active;
- a checklist of areas to verify manually (editor, downloads, modals, status bar).

[about-support-logs.md](about-support-logs.md) · [logging-and-diagnostics.md](logging-and-diagnostics.md).

See [getting-started.md](getting-started.md).

## See also

[about-support-logs.md](about-support-logs.md) · [logging-and-diagnostics.md](logging-and-diagnostics.md).

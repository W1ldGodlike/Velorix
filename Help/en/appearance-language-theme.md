# Theme and language

## Theme

Variant A product canon is a **single VELORIX NEON theme**. When the migration is complete, the app should no longer expose `dark` / `light` / `system` as user-facing choices; if a transitional build still shows them, treat that UI as legacy compatibility.

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

[owner-manual-smoke.md](owner-manual-smoke.md) (manual verification on hardware) · [packaged-windows-smoke.md](packaged-windows-smoke.md) (post-`pack:dir` verification).

See [getting-started.md](getting-started.md).

## See also

[owner-manual-smoke.md](owner-manual-smoke.md) (manual verification on hardware) · [packaged-windows-smoke.md](packaged-windows-smoke.md) (post-`pack:dir` verification).

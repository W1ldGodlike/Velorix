# Theme and language

## Theme

Use the **View** menu or **Settings → General → Theme** to pick dark, light, or **match the system**. The choice persists between launches.

### Visual theme checklist

**Settings → General → Theme** lists checks for each mode: primary button and accent link contrast, Tab focus rings, disabled states, Settings/About modal backdrops, the downloads pop-out, the inspector window, and scenario builder nodes. For **match the system**, change the OS theme and confirm FluxAlloy follows without restarting.

Full Support ZIP bundle: **Settings → Dependencies → Owner manual smoke** → **Copy full bundle** (Theme/HiDPI blocks + §21 e2e per-step `e2e <id>:`; see [owner-manual-smoke.md](owner-manual-smoke.md)). Packaged smoke after `pack:dir` — [packaged-windows-smoke.md](../packaged-windows-smoke.md); `releaseSmoke:` carries the same §21 appendix.

## Interface language

Language changes button labels, built-in FFmpeg export presets, status messages, and **this help text**. Switching language from the top bar or **Settings → General** applies immediately without restarting; an open help window refreshes the table of contents and article text automatically.

## Windows scaling (HiDPI)

**Settings → General → Display scale (HiDPI)** shows:

- the window `devicePixelRatio`;
- approximate Windows scale (100 / 125 / 150 / 200 %);
- which CSS `@120/144/168/192dpi` block is active;
- a checklist of areas to verify manually (editor, downloads, modals, status bar).

To verify: set **Settings → Display → Scale** to 100 %, 125 %, 150 %, and 200 %, **restart FluxAlloy**, and run through the checklist — labels and buttons must not clip. The same items are in the **HiDPI** block in [owner-manual-smoke.md](owner-manual-smoke.md).

See [getting-started.md](getting-started.md).

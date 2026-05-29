# FAQ and troubleshooting

![Help table of contents by section (diagram)](assets/knowledge-dialog-toc.svg)

Short answers to common questions. Details live in sections 1–6 in the help table of contents.

## Download does not start or fails immediately

- Confirm **yt-dlp** is found: [engines-update-paths.md](engines-update-paths.md).
- For login-only sites — **cookies** in the downloads rail: [downloads-settings-rail.md](downloads-settings-rail.md).
- Read the queue row error and logs: [logging-and-diagnostics.md](logging-and-diagnostics.md).

## Video downloaded but will not open in the editor

- Make sure the file **finished** (no `.part` left).
- Open manually via file/folder actions in download history: [downloads-workflow.md](downloads-workflow.md).
- Try another export preset: [ffmpeg-rail-presets.md](ffmpeg-rail-presets.md).

## ffmpeg export fails or hangs

- Test a **short trim** on the timeline first: [editor-workflow.md](editor-workflow.md).
- Use a lighter preset: [processing-social-presets.md](processing-social-presets.md).
- Hardware encoding notes: [hardware-encoding.md](hardware-encoding.md).
- Batch queue: [session-and-queues.md](session-and-queues.md).

## Terminal: “blocked” or engine not found

- Only **ffmpeg**, **ffprobe**, and **yt-dlp** — no shell metacharacters (`|`, `;`, backticks).
- Engine paths in settings; see [tools-terminal-inspector.md](tools-terminal-inspector.md) and [ffmpeg-terminal-hints.md](ffmpeg-terminal-hints.md).
- Search hints by **words** (“track”, “volume”), not stream indices like `v:0`.

## Inspector / probe looks empty

- Pick a **local file** on disk.
- Refresh ffprobe summary: [probe-and-inspector-basics.md](probe-and-inspector-basics.md).

## Text clips, muddy theme, or legacy surface looks wrong

- Windows scale 100–200 %: checklist in [appearance-language-theme.md](appearance-language-theme.md) and **Settings → General → HiDPI**; full bundle — [about-support-logs.md](about-support-logs.md).
- Variant A theme canon and legacy-theme cleanup notes: [appearance-language-theme.md](appearance-language-theme.md).

## Help language does not match UI

Switch UI language (RU/EN) and reopen help: [knowledge-base-howto.md](knowledge-base-howto.md).

## Keyboard shortcuts

- [keyboard-shortcuts.md](keyboard-shortcuts.md)

## See also

[about-support-logs.md](about-support-logs.md) · [logging-and-diagnostics.md](logging-and-diagnostics.md).

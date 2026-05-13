# Terminal, inspector, and scheduler

## Terminal (Tools)

Input line with hints from `Data/ytdlp_commands.json` and `Data/ffmpeg_commands.json`. Only three prefixes are allowed: **yt-dlp**, **ffmpeg**, **ffprobe** — the app injects paths from settings. On open, a preview command from the active tab (download or processing) is prefilled.

More detail: [ffmpeg / yt-dlp hints](ffmpeg-terminal-hints.md) — JSON under `Data/*` and the **Built-in scenarios** section (`terminal-contract.ts`, `summary` localization).

## Inspector (Tools menu / ffprobe from queues)

Separate window with full **ffprobe** JSON for the selected file. Use **Copy JSON** to copy the result.

## Watch-folder scheduler (Tools)

You set a folder, a JSON scenario file, and a poll interval. Start stays disabled until folder and scenario are set — a hint is shown.

## Explorer integration and abnormal shutdown

In **Settings** you can enable Explorer context menu entries (HKCU): **Open in FluxAlloy** (enqueue file for processing as-is) and **Quick convert to MP4** (opens FluxAlloy with H.264/AAC preset and auto codec pick).

If the last session ended abnormally, the next launch may show a reminder: queues are restored from `ui-session.json`.

# URL on the **Processing** tab (§7.4)

The **URL → download → encode** block above the file queue links yt-dlp and ffmpeg without switching to the **Download** tab.

## How to use

1. Paste a link (**first non-empty line** of the field is used).
2. **Download with yt-dlp first** — when enabled, parameters match the **current Download tab fields**: quality, container, output folder (`OutputDir`), proxy, cookies, expert extra args, etc. If you clear the checkbox, only a direct **http(s)** URL is queued for ffmpeg (good for direct file links).
3. **Then run batch encode** — after files land in the queue, ffmpeg starts immediately with the current options and parallelism.

## History

Entries like `processing+yt-dlp` can be **retried** with the **Retry** button: the app opens the Processing tab and fills this field with the URL.

## ffprobe analysis

If the first queue item is a remote http(s) input, **Analyze (ffprobe)** and the row context menu still run ffprobe on that URL (in practice not all hosts work).

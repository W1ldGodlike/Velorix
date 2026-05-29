# About, logs, and support

## Version

The About dialog shows the app build number and embedded page engine versions — useful when contacting support.

## Log folder

The same dialog links to the **log folder**. Files are small; attach them to a support email when needed.

## Support archive

The **archive** button bundles diagnostic files into one zip — easier than picking files manually.

`diagnostics.txt` includes:

- **`engines:`** — ffmpeg / ffprobe / yt-dlp status (path, first `-version` line).
- **`terminalHints:`** — terminal hints snapshot for support; see [ffmpeg-terminal-hints.md](ffmpeg-terminal-hints.md) and [logging-and-diagnostics.md](logging-and-diagnostics.md).
- **`unpackedLayout:`** — whether `dist/win-unpacked`, `dist/linux-unpacked`, `Velorix.app` exist (present/missing) without re-running `pack:dir` on another OS.

## See also

[logging-and-diagnostics.md](logging-and-diagnostics.md) · [ffmpeg-terminal-hints.md](ffmpeg-terminal-hints.md).

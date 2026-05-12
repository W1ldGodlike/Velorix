# Extract frames

**Tools → Extract frames** opens a simplified scenario window (§7.6):

- **Every N seconds** — uses the `fps=1/N` filter.
- **K frames evenly spaced** — requires duration from ffprobe; sets `fps = K/duration`.
- **Single frame** — `-ss` and one output file with a timestamp in the filename.

Formats: JPG, PNG, WebP. Files are saved to the folder you pick (`flux_frame_*.jpg`, or a single file in “one frame” mode).

The full spec set (progress bar, manual comma-separated marks, sprites §7.5) is not implemented in this window yet.

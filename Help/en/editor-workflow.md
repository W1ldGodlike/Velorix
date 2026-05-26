# Editor: preview and timeline

![Preview, transport, timeline, and FFmpeg rail (diagram)](assets/editor-preview-timeline.svg)

## Open a file

Use **File → Open…**, the folder button on the toolbar, or drop a file on the preview area. Common video formats that the built-in player supports will work.

## Preview

Playback, volume, and fullscreen live on the **strip under the video**, not as separate system controls on the clip itself. This keeps one consistent UI.

## Timeline

Below the preview you see the time scale, optional **audio waveform**, and the **start / end** range of the clip. A short click seeks; dragging sets the range. **Set start / end** buttons help when you need precision.

## File info without the inspector

Below the timeline you get a **short line** for **video / audio** (frame size and codecs). The full breakdown lives in the separate inspector window (see [probe-and-inspector-basics.md](probe-and-inspector-basics.md)).

## Next

Export settings and presets — [ffmpeg-rail-presets.md](ffmpeg-rail-presets.md).

## See also

[owner-manual-smoke.md](owner-manual-smoke.md) (manual verification on hardware) · [packaged-windows-smoke.md](packaged-windows-smoke.md) (post-`pack:dir` verification).

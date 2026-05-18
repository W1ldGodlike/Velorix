# Hardware acceleration (NVENC, AMF, QSV, VAAPI)

The editor already exposes **hardware** video codecs in the right **Format** rail and **hw_auto** / **hw_auto_hevc** modes (auto-pick after probe). The **Processing:** line in the status bar and the codec field tooltip show the active encoder, GPU model (NVIDIA via nvidia-smi), and NVENC session limits.

## Quick start

1. Open a short H.264 clip (10–30 s) in the editor.
2. Wait for probe in the Format rail — available HW codecs appear in the list.
3. To verify on your GPU: **Settings → Dependencies → Manual NVENC / VAAPI smoke** — step checklist and copy button (same text is in the Support ZIP).

## Modes

| Mode | When to use |
|------|-------------|
| Manual HW codec | You need a specific NVENC / AMF / QSV / VAAPI |
| **hw_auto** | Let the app pick the best available HW codec at export |
| Software (libx264, etc.) | Maximum compatibility and fine CRF control |

The **Benchmark** panel (15 s) compares candidates by speed and CPU/GPU load.

## Platforms

- **Windows + NVIDIA** — NVENC (see checklist in Settings).
- **Linux** — VAAPI (Intel/AMD) when `/dev/dri` and vaapi in `ffmpeg -hwaccels` are available.
- **macOS** — VideoToolbox in the codec list; manual smoke in Settings targets Win/Linux.

See also [ffmpeg-rail-presets.md](ffmpeg-rail-presets.md) and [faq-troubleshooting.md](faq-troubleshooting.md).

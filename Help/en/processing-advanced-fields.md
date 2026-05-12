# Processing — advanced panel

This mirrors core **`FfmpegProcessingOptions`**: trim **`-ss`/`-to`**, scale with **KeepAspect**, deinterlace (yadif/bwdif), EQ **brightness/contrast/saturation**, burn-in subtitles, **HDR→SDR** via **HdrToSdr** (tonemapper in the zscale chain as in the command builder), LUT, output filename template.

## Presets

The dropdown quickly applies codecs and typical CRF. After changing preset, press **Refresh command preview** when you need the line updated.

## Parallelism

Sets how many **ffmpeg** processes run in parallel. For **NVENC**, keep concurrency within what your driver/GPU tolerates.

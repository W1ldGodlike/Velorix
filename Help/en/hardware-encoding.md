# Hardware encoders and CPU (spec §16 — short)

On the **Processing** tab, **auto-pick best encoder** usually follows **NVENC → AMF → QSV → CPU**. Load thresholds for recommendations in benchmarks are configured in **Settings**.

## CPU (libx264 / libx265, etc.)

Maximum **compatibility** and quality on heavy filter graphs; **slower** than hardware encoders; high CPU use. Best for final masters or complex `-vf` chains.

## NVIDIA NVENC (`h264_nvenc`, `hevc_nvenc`)

Hardware encoding on GeForce **GTX 1050** and newer. Strong **speed/quality** among GPUs, especially for HEVC. Consumer cards limit **concurrent** sessions. Good for bulk re-encode jobs.

## AMD AMF (`h264_amf`, `hevc_amf`)

**RX 6000+** class GPUs with a current driver. Very fast; H.264 quality can trail NVENC/QSV on some content. Sensible when AMD is your only GPU.

## Intel Quick Sync (`h264_qsv`, `hevc_qsv`)

Intel **integrated** GPU (HEVC support depends on generation). Stable on **laptops without discrete GPU**. HEVC may lag behind NVENC on newer NVIDIA parts.

---

The **Evaluate** button on the processing tab (when available in your build) adds measurements on your machine. Exact ffmpeg flags come from the command builder for current options and auto-selection.

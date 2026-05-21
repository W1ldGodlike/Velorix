import { getFfmpegHwEncoderFamily, type FfmpegHwEncoderFamily } from './ffmpeg-export-hw-codec-ui'
import {
  createEmptyFfmpegHwEncodersSnapshot,
  FFMPEG_HW_VIDEO_ENCODER_IDS,
  type FfmpegHwEncodersProbeResult,
  type FfmpegHwEncodersSnapshot,
  type FfmpegHwVideoEncoderId
} from './ffmpeg-hw-encoder-probe'

/** Снимок железа для §7.2.1 — не гонять бенчмарк кодеками без GPU под семейство. */
export type FfmpegExportBenchmarkHardwareHints = {
  osPlatform: NodeJS.Platform
  /** `nvidia-smi` вернул модель (надёжнее, чем имя в списке адаптеров). */
  nvidiaGpuPresent: boolean
  /** Имена видеоадаптеров ОС (`Win32_VideoController`, `lspci`, …). */
  gpuAdapterNames: readonly string[]
}

const ADAPTER_TEXT_RE: Record<Exclude<FfmpegHwEncoderFamily, 'videotoolbox'>, RegExp> = {
  nvenc: /\bnvidia\b|geforce|quadro|\brtx\b|\bgtx\b/i,
  amf: /\bamd\b|radeon/i,
  qsv: /\bintel\b|\buhd\b|\biris\b|arc\s*graphics/i,
  vaapi: /\bamd\b|\bintel\b|\bnvidia\b|radeon|geforce/i
}

function adapterNamesBlob(names: readonly string[]): string {
  return names.join('\n')
}

export function isFfmpegHwEncoderFamilyRunnableInBenchmark(
  family: FfmpegHwEncoderFamily,
  hints: FfmpegExportBenchmarkHardwareHints
): boolean {
  if (family === 'videotoolbox') {
    return hints.osPlatform === 'darwin'
  }
  if (family === 'vaapi') {
    return (
      hints.osPlatform === 'linux' &&
      ADAPTER_TEXT_RE.vaapi.test(adapterNamesBlob(hints.gpuAdapterNames))
    )
  }
  if (family === 'nvenc') {
    return hints.nvidiaGpuPresent
  }
  if (family === 'amf' || family === 'qsv') {
    return ADAPTER_TEXT_RE[family].test(adapterNamesBlob(hints.gpuAdapterNames))
  }
  return false
}

export function buildFfmpegExportBenchmarkHardwareHintsFromHwProbe(
  probe: Extract<FfmpegHwEncodersProbeResult, { ok: true }>
): FfmpegExportBenchmarkHardwareHints {
  return {
    osPlatform: probe.osPlatform,
    nvidiaGpuPresent: probe.nvidiaGpu !== null,
    gpuAdapterNames: probe.gpuAdapterNames
  }
}

/** Снимок `-encoders` с `false` на HW-кодеках без подходящего GPU (список UI и `hw_auto`). */
export function filterFfmpegHwEncodersSnapshotForHardware(
  snapshot: FfmpegHwEncodersSnapshot,
  hints: FfmpegExportBenchmarkHardwareHints
): FfmpegHwEncodersSnapshot {
  const out = createEmptyFfmpegHwEncodersSnapshot()
  out.matchedEncoderLines = snapshot.matchedEncoderLines
  for (const id of FFMPEG_HW_VIDEO_ENCODER_IDS) {
    if (!snapshot[id]) {
      continue
    }
    const fam = getFfmpegHwEncoderFamily(id)
    out[id] = isFfmpegHwEncoderFamilyRunnableInBenchmark(fam, hints)
  }
  return out
}

export function isFfmpegHwVideoEncoderRunnableInUi(
  id: FfmpegHwVideoEncoderId,
  snapshot: FfmpegHwEncodersSnapshot,
  hints: FfmpegExportBenchmarkHardwareHints
): boolean {
  if (!snapshot[id]) {
    return false
  }
  return isFfmpegHwEncoderFamilyRunnableInBenchmark(getFfmpegHwEncoderFamily(id), hints)
}

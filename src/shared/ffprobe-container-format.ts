/**
 * §9 — поля контейнера ffprobe: реестр `ffprobe-container-field-registry.ts`.
 * Здесь — только UI-хелперы без дублирования parse/export.
 */
import type { MediaProbeSuccess } from './ffprobe-contract'

export {
  parseFfprobeFormatCompatibleBrands,
  parseFfprobeFormatCreationTime,
  parseFfprobeFormatDurationSec,
  parseFfprobeFormatDurationTs,
  parseFfprobeFormatTimeBase,
  parseFfprobeFormatProbeSize,
  parseFfprobeFormatBitRateKbps,
  parseFfprobeFormatFilename,
  parseFfprobeFormatFlags,
  parseFfprobeFormatMajorBrand,
  parseFfprobeFormatNbPrograms,
  parseFfprobeFormatNbStreams,
  parseFfprobeFormatProbeScore,
  parseFfprobeFormatSize,
  parseFfprobeFormatStartTimeSec,
  parseFfprobeContainerFieldsFromFormat,
  formatFfprobeContainerBitRateCompact,
  formatFfprobeContainerBitRateExportLine,
  formatFfprobeContainerBrandExportLine,
  formatFfprobeContainerCreationTimeExportLine,
  formatFfprobeContainerDurationSecCompact,
  formatFfprobeContainerDurationSecExportLine,
  formatFfprobeContainerDurationTsCompact,
  formatFfprobeContainerDurationTsExportLine,
  formatFfprobeContainerTimeBaseExportLine,
  formatFfprobeContainerProbeSizeCompact,
  formatFfprobeContainerProbeSizeExportLine,
  formatFfprobeContainerTimingProbeCompactLine,
  formatFfprobeContainerTimingProbeExportLine,
  formatFfprobeContainerOffsetTimingCompactLine,
  formatFfprobeContainerOffsetTimingExportLine,
  formatFfprobeContainerDiagnosticsCompactLine,
  formatFfprobeContainerDiagnosticsExportLine,
  formatFfprobeContainerFilenameCompact,
  formatFfprobeContainerFilenameExportLine,
  ffprobeContainerFilenameBasename,
  formatFfprobeContainerSizeCompact,
  formatFfprobeContainerSizeExportLine,
  formatFfprobeContainerStartTimeCompact,
  formatFfprobeContainerStartOffsetCompactLine,
  formatFfprobeContainerStartOffsetExportLine,
  formatFfprobeContainerStartTimeExportLine,
  formatFfprobeContainerStartTimeRealExportLine,
  formatFfprobeFormatFlagsExportLine,
  formatFfprobeContainerFormatFlagsCompact,
  formatFfprobeContainerProbeLayoutCompactLine,
  formatFfprobeContainerProbeLayoutExportLine,
  formatFfprobeNbProgramsExportLine,
  formatFfprobeNbStreamsExportLine,
  formatFfprobeProbeScoreExportLine,
  collectFfprobeContainerScalarExportLines
} from './ffprobe-container-field-registry'
export { formatFfprobeContainerTimeBaseCompact } from './ffprobe-stream-time-base'

/** §7 — краткая строка «Видео» под таймлайном: разрешение, кодек, опц. major_brand. */
export function formatFfprobeEditorVideoFactLine(
  probe: MediaProbeSuccess | null,
  dashPlaceholder: string
): string {
  if (!probe?.video) {
    return dashPlaceholder
  }
  const base = `${probe.video.width}×${probe.video.height} ${probe.video.codec}`
  const brand = probe.containerMajorBrand?.trim()
  if (brand && brand.length > 0) {
    return `${base} · ${brand}`
  }
  return base
}

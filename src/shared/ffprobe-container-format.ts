/**
 * §9 — поля контейнера ffprobe: реестр `ffprobe-container-field-registry.ts`.
 * Здесь — только UI-хелперы без дублирования parse/export.
 */
import type { MediaProbeSuccess } from './ffprobe-contract'

export {
  parseFfprobeFormatCompatibleBrands,
  parseFfprobeFormatCreationTime,
  parseFfprobeFormatDurationTs,
  parseFfprobeFormatTimeBase,
  parseFfprobeFormatProbeSize,
  parseFfprobeFormatFilename,
  parseFfprobeFormatFlags,
  parseFfprobeFormatMajorBrand,
  parseFfprobeFormatNbPrograms,
  parseFfprobeFormatNbStreams,
  parseFfprobeFormatProbeScore,
  parseFfprobeFormatSize,
  parseFfprobeFormatStartTimeSec,
  parseFfprobeContainerFieldsFromFormat,
  formatFfprobeContainerBrandExportLine,
  formatFfprobeContainerCreationTimeExportLine,
  formatFfprobeContainerDurationTsCompact,
  formatFfprobeContainerDurationTsExportLine,
  formatFfprobeContainerTimeBaseExportLine,
  formatFfprobeContainerProbeSizeCompact,
  formatFfprobeContainerProbeSizeExportLine,
  formatFfprobeContainerFilenameExportLine,
  formatFfprobeContainerSizeCompact,
  formatFfprobeContainerSizeExportLine,
  formatFfprobeContainerStartTimeCompact,
  formatFfprobeContainerStartTimeExportLine,
  formatFfprobeContainerStartTimeRealExportLine,
  formatFfprobeFormatFlagsExportLine,
  formatFfprobeNbProgramsExportLine,
  formatFfprobeNbStreamsExportLine,
  formatFfprobeProbeScoreExportLine,
  collectFfprobeContainerScalarExportLines
} from './ffprobe-container-field-registry'
export { formatFfprobeContainerTimeBaseCompact } from './ffprobe-stream-time-base'

/** Basename для краткой строки инспектора. */
export function ffprobeContainerFilenameBasename(filename: string): string {
  const normalized = filename.replace(/\\/g, '/')
  const base = normalized.split('/').pop() ?? filename
  const t = base.trim()
  return t.length > 0 ? t : filename
}

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

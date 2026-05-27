import type { FfmpegExportEncodePresetId } from '../../../shared/ffmpeg-export-contract'

export function readEncodePresetForExport(
  raw: string | undefined
): FfmpegExportEncodePresetId | undefined {
  if (raw === 'smaller' || raw === 'quality' || raw === 'balance') {
    return raw
  }
  return undefined
}

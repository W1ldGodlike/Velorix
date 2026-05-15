import type { FfmpegExportVideoCodecId } from './ffmpeg-export-contract'

/** §7.2 — перед VAAPI-кодером поднимаем кадры в GPU (после CPU `-vf`). */
export const FFMPEG_EXPORT_VAAPI_HWUPLOAD_FILTER = 'format=nv12,hwupload'

export function ffmpegExportVideoCodecNeedsVaapiHwupload(
  vcodec: FfmpegExportVideoCodecId
): boolean {
  return vcodec.endsWith('_vaapi')
}

export function prependVaapiHwuploadToVideoFilters(
  filters: string[],
  vcodec: FfmpegExportVideoCodecId
): void {
  if (!ffmpegExportVideoCodecNeedsVaapiHwupload(vcodec)) {
    return
  }
  if (filters.some((f) => f.includes('hwupload'))) {
    return
  }
  filters.unshift(FFMPEG_EXPORT_VAAPI_HWUPLOAD_FILTER)
}

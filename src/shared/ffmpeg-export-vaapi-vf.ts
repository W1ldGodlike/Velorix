import type { FfmpegExportVideoCodecId } from './ffmpeg-export-contract'

/** §7.2 / §16 — перед VAAPI-кодером поднимаем кадры в GPU (после CPU `-vf`). */
export const FFMPEG_EXPORT_VAAPI_HWUPLOAD_FILTER = 'format=nv12,hwupload'

/** §16 — Intel QSV: upload в device frames перед `*_qsv`. */
export const FFMPEG_EXPORT_QSV_HWUPLOAD_FILTER =
  'format=nv12,hwupload=extra_hw_frames=64,format=qsv'

/** §16 — AMD AMF на Windows: upload в D3D11 перед `*_amf`. */
export const FFMPEG_EXPORT_AMF_HWUPLOAD_FILTER = 'format=nv12,hwupload,format=d3d11'

/** §16 — NVIDIA NVENC: upload в CUDA только если есть CPU `-vf` (без фильтров nvenc принимает RAM). */
export const FFMPEG_EXPORT_NVENC_HWUPLOAD_FILTER = 'format=nv12,hwupload_cuda'

function resolveFfmpegHwUploadFilterChain(vcodec: FfmpegExportVideoCodecId): string | null {
  if (vcodec.endsWith('_vaapi')) {
    return FFMPEG_EXPORT_VAAPI_HWUPLOAD_FILTER
  }
  if (vcodec.endsWith('_qsv')) {
    return FFMPEG_EXPORT_QSV_HWUPLOAD_FILTER
  }
  if (vcodec.endsWith('_amf')) {
    return FFMPEG_EXPORT_AMF_HWUPLOAD_FILTER
  }
  if (vcodec.endsWith('_nvenc')) {
    return FFMPEG_EXPORT_NVENC_HWUPLOAD_FILTER
  }
  return null
}

export function ffmpegExportVideoCodecNeedsHwUploadFilter(
  vcodec: FfmpegExportVideoCodecId
): boolean {
  if (vcodec.endsWith('_nvenc')) {
    return false
  }
  return resolveFfmpegHwUploadFilterChain(vcodec) !== null
}

/** §7.2 — префикс `-vf` для VAAPI/QSV/AMF/NVENC (последний — только при CPU-фильтрах). */
export function prependHwEncoderUploadToVideoFilters(
  filters: string[],
  vcodec: FfmpegExportVideoCodecId
): void {
  const chain = resolveFfmpegHwUploadFilterChain(vcodec)
  if (chain === null) {
    return
  }
  if (vcodec.endsWith('_nvenc') && filters.length === 0) {
    return
  }
  if (filters.some((f) => f.includes('hwupload'))) {
    return
  }
  filters.unshift(chain)
}

export function prependVaapiHwuploadToVideoFilters(
  filters: string[],
  vcodec: FfmpegExportVideoCodecId
): void {
  prependHwEncoderUploadToVideoFilters(filters, vcodec)
}

import { buildFfmpegExportLut3dFilter } from './ffmpeg-export-argv-filters'
import {
  resolveFfmpegExportCropFilter,
  resolveFfmpegExportScaleFilter,
  resolveFfmpegExportVideoDebandFilter,
  resolveFfmpegExportVideoDeinterlaceFilter,
  resolveFfmpegExportVideoHisteqFilter,
  resolveFfmpegExportVideoDenoiseFilter,
  resolveFfmpegExportVideoEqFilter,
  resolveFfmpegExportVideoGrainFilter,
  resolveFfmpegExportVideoHueFilter,
  resolveFfmpegExportVideoBlurFilter,
  resolveFfmpegExportVideoSharpenFilter,
  resolveFfmpegExportVideoVignetteFilter,
  resolveFfmpegExportVideoTransformFilters
} from './ffmpeg-export-argv-filters'
import type { FfmpegExportArgvParams } from './ffmpeg-export-argv-build-types'

export function buildFfmpegExportVideoFilterChain(params: FfmpegExportArgvParams): string[] {
  const filters: string[] = []
  const transform = resolveFfmpegExportVideoTransformFilters(params.videoTransform ?? 'none')
  filters.push(...transform)
  const crop = resolveFfmpegExportCropFilter(params.cropPreset ?? 'none')
  if (crop !== null) {
    filters.push(crop)
  }
  const deint = resolveFfmpegExportVideoDeinterlaceFilter(params.videoDeinterlace ?? 'off')
  if (deint !== null) {
    filters.push(deint)
  }
  // §7.2 — порядок: денойз раньше резкости и масштаба, чтобы шум не «выпиливался» резкостью
  // и не дублировался при последующем `scale`. Это согласовано с обычной киноpipe-семантикой.
  const denoise = resolveFfmpegExportVideoDenoiseFilter(params.videoDenoise ?? 'off')
  if (denoise !== null) {
    filters.push(denoise)
  }
  // §7.2 — после шумоподавления и до резкости: убираем ступени до усиления контуров unsharp.
  const deband = resolveFfmpegExportVideoDebandFilter(params.videoDeband ?? 'off')
  if (deband !== null) {
    filters.push(deband)
  }
  const histeq = resolveFfmpegExportVideoHisteqFilter(params.videoHisteq ?? 'off')
  if (histeq !== null) {
    filters.push(histeq)
  }
  const lutPathRaw = params.videoLut3dCubeAbsPath
  const lutPath =
    typeof lutPathRaw === 'string' && lutPathRaw.trim().length > 0 ? lutPathRaw.trim() : null
  if (lutPath !== null) {
    filters.push(buildFfmpegExportLut3dFilter(lutPath))
  }
  const sharpen = resolveFfmpegExportVideoSharpenFilter(params.videoSharpen ?? 'off')
  if (sharpen !== null) {
    filters.push(sharpen)
  }
  // §7.2 — `eq` после sharpen и до зерна/`scale`, чтобы цветокор шёл по уже отфильтрованной картинке.
  const eq = resolveFfmpegExportVideoEqFilter(params.videoEqPreset ?? 'off')
  if (eq !== null) {
    filters.push(eq)
  }
  const hue = resolveFfmpegExportVideoHueFilter(params.videoHue ?? 'off')
  if (hue !== null) {
    filters.push(hue)
  }
  const grain = resolveFfmpegExportVideoGrainFilter(params.videoGrain ?? 'off')
  if (grain !== null) {
    filters.push(grain)
  }
  const vignette = resolveFfmpegExportVideoVignetteFilter(params.videoVignette ?? 'off')
  if (vignette !== null) {
    filters.push(vignette)
  }
  const blur = resolveFfmpegExportVideoBlurFilter(params.videoBlur ?? 'off')
  if (blur !== null) {
    filters.push(blur)
  }
  const scale = resolveFfmpegExportScaleFilter(params.scalePreset)
  if (scale !== null) {
    filters.push(scale)
  }
  if (params.fps !== null) {
    filters.push(`fps=${params.fps}`)
  }
  return filters
}

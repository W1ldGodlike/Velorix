import type {
  FfmpegExportContainerId,
  FfmpegExportCropPresetId,
  FfmpegExportEncodePresetId,
  FfmpegExportScalePresetId,
  FfmpegExportVideoTransformId
} from '../../src/shared/ffmpeg-export-contract'

export const FFMPEG_EXPORT_ENCODE_PRESET_CASES = [
  { preset: 'balance' as FfmpegExportEncodePresetId, crf: '23', x264preset: 'fast' },
  { preset: 'smaller' as FfmpegExportEncodePresetId, crf: '28', x264preset: 'fast' },
  { preset: 'quality' as FfmpegExportEncodePresetId, crf: '18', x264preset: 'medium' }
] as const

export const FFMPEG_EXPORT_SCALE_FILTER_CASES = [
  { preset: 'source' as FfmpegExportScalePresetId, filter: null },
  { preset: '480p' as FfmpegExportScalePresetId, filter: 'scale=-2:480' },
  { preset: '1080p' as FfmpegExportScalePresetId, filter: 'scale=-2:1080' }
] as const

export const FFMPEG_EXPORT_VIDEO_TRANSFORM_CASES = [
  { id: 'none' as FfmpegExportVideoTransformId, filters: [] as string[] },
  { id: 'cw90' as FfmpegExportVideoTransformId, filters: ['transpose=1'] },
  { id: 'ccw90' as FfmpegExportVideoTransformId, filters: ['transpose=2'] },
  { id: 'r180' as FfmpegExportVideoTransformId, filters: ['transpose=1', 'transpose=1'] },
  { id: 'hflip' as FfmpegExportVideoTransformId, filters: ['hflip'] },
  { id: 'vflip' as FfmpegExportVideoTransformId, filters: ['vflip'] }
] as const

export const FFMPEG_EXPORT_CROP_FILTER_CASES = [
  { preset: 'none' as FfmpegExportCropPresetId, filter: null },
  { preset: 'center-square' as FfmpegExportCropPresetId, filter: 'crop=min(iw\\,ih):min(iw\\,ih)' },
  {
    preset: 'center-16-9' as FfmpegExportCropPresetId,
    filter: 'crop=min(iw\\,ih*16/9):min(ih\\,iw*9/16)'
  }
] as const

export const FFMPEG_EXPORT_AUDIO_GAIN_DB_CASES = [
  { raw: null, expected: null },
  { raw: undefined, expected: null },
  { raw: '', expected: null },
  { raw: 'abc', expected: null },
  { raw: 0, expected: null },
  { raw: 25, expected: null },
  { raw: -25, expected: null },
  { raw: 3.5, expected: null },
  { raw: 3, expected: 3 },
  { raw: '-6', expected: -6 },
  { raw: 24, expected: 24 },
  { raw: -24, expected: -24 }
] as const

export const FFMPEG_EXPORT_SUBTITLE_COPY_CODEC_CASES = [
  { container: 'mkv' as FfmpegExportContainerId, codec: 'copy' },
  { container: 'mp4' as FfmpegExportContainerId, codec: 'mov_text' },
  { container: 'mov' as FfmpegExportContainerId, codec: 'mov_text' }
] as const

export const FFMPEG_EXPORT_SHOULD_APPLY_TRIM_CASES = [
  { trim: { inSec: 1, outSec: 4 }, duration: null, expected: true },
  { trim: { inSec: 2, outSec: 2.01 }, duration: null, expected: false },
  { trim: { inSec: 0, outSec: 19.9 }, duration: 20, expected: false },
  { trim: { inSec: 0.5, outSec: 19.9 }, duration: 20, expected: true },
  { trim: null, duration: 20, expected: false },
  { trim: { inSec: Number.NaN, outSec: 5 }, duration: null, expected: false }
] as const

export type FfmpegExportArgvFilterResolver =
  | 'denoise'
  | 'sharpen'
  | 'deband'
  | 'grain'
  | 'vignette'
  | 'blur'
  | 'deinterlace'
  | 'histeq'
  | 'hue'
  | 'eq'
  | 'audioNormalize'

export const FFMPEG_EXPORT_FILTER_RESOLVE_CASES: ReadonlyArray<{
  resolver: FfmpegExportArgvFilterResolver
  id: string
  expected: string | null
}> = [
  { resolver: 'denoise', id: 'off', expected: null },
  { resolver: 'denoise', id: 'light', expected: 'hqdn3d=1.5:1.5:6:6' },
  { resolver: 'denoise', id: 'medium', expected: 'hqdn3d=3:3:6:6' },
  { resolver: 'denoise', id: 'strong', expected: 'hqdn3d=5:5:10:10' },
  { resolver: 'sharpen', id: 'off', expected: null },
  { resolver: 'sharpen', id: 'light', expected: 'unsharp=5:5:0.6:5:5:0.0' },
  { resolver: 'sharpen', id: 'medium', expected: 'unsharp=5:5:1.0:5:5:0.0' },
  { resolver: 'sharpen', id: 'strong', expected: 'unsharp=7:7:1.5:7:7:0.0' },
  { resolver: 'deband', id: 'off', expected: null },
  { resolver: 'deband', id: 'light', expected: 'deband=range=12' },
  { resolver: 'deband', id: 'medium', expected: 'deband=range=20' },
  { resolver: 'deband', id: 'strong', expected: 'deband=range=28' },
  { resolver: 'grain', id: 'off', expected: null },
  { resolver: 'grain', id: 'light', expected: 'noise=alls=2:allf=u' },
  { resolver: 'grain', id: 'medium', expected: 'noise=alls=5:allf=u' },
  { resolver: 'grain', id: 'strong', expected: 'noise=alls=9:allf=u' },
  { resolver: 'vignette', id: 'off', expected: null },
  { resolver: 'vignette', id: 'light', expected: 'vignette=angle=PI/3' },
  { resolver: 'vignette', id: 'medium', expected: 'vignette=angle=PI/5' },
  { resolver: 'vignette', id: 'strong', expected: 'vignette=angle=PI/10' },
  { resolver: 'blur', id: 'off', expected: null },
  { resolver: 'blur', id: 'light', expected: 'gblur=sigma=1' },
  { resolver: 'blur', id: 'medium', expected: 'gblur=sigma=2.5' },
  { resolver: 'blur', id: 'strong', expected: 'gblur=sigma=5' },
  { resolver: 'deinterlace', id: 'off', expected: null },
  { resolver: 'deinterlace', id: 'frame', expected: 'yadif' },
  { resolver: 'deinterlace', id: 'field', expected: 'yadif=mode=send_field' },
  { resolver: 'histeq', id: 'off', expected: null },
  { resolver: 'histeq', id: 'light', expected: 'histeq=strength=0.14' },
  { resolver: 'histeq', id: 'medium', expected: 'histeq=strength=0.26' },
  { resolver: 'histeq', id: 'strong', expected: 'histeq=strength=0.40' },
  { resolver: 'hue', id: 'off', expected: null },
  { resolver: 'hue', id: 'warmShift', expected: 'hue=h=-11:s=1.03' },
  { resolver: 'hue', id: 'coolShift', expected: 'hue=h=13:s=1.03' },
  { resolver: 'hue', id: 'satBoost', expected: 'hue=h=0:s=1.16' },
  { resolver: 'eq', id: 'off', expected: null },
  { resolver: 'eq', id: 'warm', expected: 'eq=contrast=1.05:saturation=1.10' },
  { resolver: 'eq', id: 'cool', expected: 'eq=contrast=1.00:saturation=0.92' },
  { resolver: 'eq', id: 'vivid', expected: 'eq=contrast=1.10:saturation=1.20' },
  { resolver: 'eq', id: 'flat', expected: 'eq=contrast=0.95:saturation=0.85' },
  { resolver: 'audioNormalize', id: 'off', expected: null },
  { resolver: 'audioNormalize', id: 'loudnorm', expected: 'loudnorm=I=-16:LRA=11:TP=-1.5' },
  { resolver: 'audioNormalize', id: 'dynaudnorm', expected: 'dynaudnorm=f=200:g=15' }
]

export const FFMPEG_EXPORT_LUT_ESCAPE_CASES = [
  { path: 'C:/tmp/t.cube', escaped: 'C\\:/tmp/t.cube' },
  { path: "/var/l/a'b.cube", escaped: "/var/l/a\\'b.cube" }
] as const

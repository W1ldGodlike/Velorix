/**
 * §7.2/§7.3 — реестр полей `resolveFfmpegExportJobOptionsFromAppSettings`.
 */
import type { AppSettings } from '../../../shared/settings-contract'
import type { ResolvedFfmpegExportJobOptions } from '../../../shared/ffmpeg-export-resolve-contract'
import {
  parseFfmpegExportAudioMode,
  parseFfmpegExportAudioNormalize,
  parseFfmpegExportContainer,
  parseFfmpegExportCropPreset,
  parseFfmpegExportEncodePreset,
  parseFfmpegExportScalePreset,
  parseFfmpegExportSubtitleMode,
  parseFfmpegExportVideoDeband,
  parseFfmpegExportVideoDeinterlace,
  parseFfmpegExportVideoHisteq,
  parseFfmpegExportVideoDenoise,
  parseFfmpegExportVideoEqPreset,
  parseFfmpegExportVideoGrain,
  parseFfmpegExportVideoHue,
  parseFfmpegExportVideoBlur,
  parseFfmpegExportVideoLut3d,
  parseFfmpegExportVideoVignette,
  parseFfmpegExportVideoSharpen,
  parseFfmpegExportVideoTransform
} from '../../../shared/ffmpeg-export-parse-registry'
import {
  parseFfmpegExportAudioBitrate,
  parseFfmpegExportAudioGainDb,
  parseFfmpegExportCrf,
  parseFfmpegExportEconomyMode,
  parseFfmpegExportFps,
  parseFfmpegExportStripFlag,
  parseFfmpegExportVideoBitrate
} from '../../../shared/ffmpeg-export-stored-parse'
import { parseFfmpegExportVideoCodec } from '../../../shared/ffmpeg-export-video-codec'
import { parseFfmpegExportHwDecode } from '../../../shared/ffmpeg-export-hw-decode'

type ParseFn = (raw: unknown) => unknown

export type FfmpegExportResolveFieldSpec = {
  overrideKey: string
  settingsKey: keyof AppSettings
  resultKey: keyof ResolvedFfmpegExportJobOptions
  parse: ParseFn
  overrideOnUndefined?: boolean
}

export const FFMPEG_EXPORT_RESOLVE_FIELD_SPECS: readonly FfmpegExportResolveFieldSpec[] = [
  {
    overrideKey: 'encodePreset',
    settingsKey: 'ffmpegExportEncodePreset',
    resultKey: 'encodePreset',
    parse: parseFfmpegExportEncodePreset
  },
  {
    overrideKey: 'videoCodec',
    settingsKey: 'ffmpegExportVideoCodec',
    resultKey: 'videoCodec',
    parse: parseFfmpegExportVideoCodec
  },
  {
    overrideKey: 'container',
    settingsKey: 'ffmpegExportContainer',
    resultKey: 'container',
    parse: parseFfmpegExportContainer
  },
  {
    overrideKey: 'crf',
    settingsKey: 'ffmpegExportCrf',
    resultKey: 'crf',
    parse: parseFfmpegExportCrf
  },
  {
    overrideKey: 'videoBitrate',
    settingsKey: 'ffmpegExportVideoBitrate',
    resultKey: 'videoBitrate',
    parse: parseFfmpegExportVideoBitrate
  },
  {
    overrideKey: 'audioMode',
    settingsKey: 'ffmpegExportAudioMode',
    resultKey: 'audioMode',
    parse: parseFfmpegExportAudioMode
  },
  {
    overrideKey: 'audioBitrate',
    settingsKey: 'ffmpegExportAudioBitrate',
    resultKey: 'audioBitrate',
    parse: parseFfmpegExportAudioBitrate
  },
  {
    overrideKey: 'fps',
    settingsKey: 'ffmpegExportFps',
    resultKey: 'fps',
    parse: parseFfmpegExportFps
  },
  {
    overrideKey: 'scalePreset',
    settingsKey: 'ffmpegExportScalePreset',
    resultKey: 'scalePreset',
    parse: parseFfmpegExportScalePreset
  },
  {
    overrideKey: 'videoTransform',
    settingsKey: 'ffmpegExportVideoTransform',
    resultKey: 'videoTransform',
    parse: parseFfmpegExportVideoTransform
  },
  {
    overrideKey: 'cropPreset',
    settingsKey: 'ffmpegExportCropPreset',
    resultKey: 'cropPreset',
    parse: parseFfmpegExportCropPreset
  },
  {
    overrideKey: 'economyMode',
    settingsKey: 'ffmpegExportEconomyMode',
    resultKey: 'economyMode',
    parse: parseFfmpegExportEconomyMode
  },
  {
    overrideKey: 'hwDecode',
    settingsKey: 'ffmpegExportHwDecode',
    resultKey: 'hwDecode',
    parse: parseFfmpegExportHwDecode
  },
  {
    overrideKey: 'audioGainDb',
    settingsKey: 'ffmpegExportAudioGainDb',
    resultKey: 'audioGainDb',
    parse: parseFfmpegExportAudioGainDb,
    overrideOnUndefined: true
  },
  {
    overrideKey: 'stripMetadata',
    settingsKey: 'ffmpegExportStripMetadata',
    resultKey: 'stripMetadata',
    parse: parseFfmpegExportStripFlag,
    overrideOnUndefined: true
  },
  {
    overrideKey: 'stripChapters',
    settingsKey: 'ffmpegExportStripChapters',
    resultKey: 'stripChapters',
    parse: parseFfmpegExportStripFlag,
    overrideOnUndefined: true
  },
  {
    overrideKey: 'subtitleMode',
    settingsKey: 'ffmpegExportSubtitleMode',
    resultKey: 'subtitleMode',
    parse: parseFfmpegExportSubtitleMode
  },
  {
    overrideKey: 'videoDenoise',
    settingsKey: 'ffmpegExportVideoDenoise',
    resultKey: 'videoDenoise',
    parse: parseFfmpegExportVideoDenoise
  },
  {
    overrideKey: 'videoDeband',
    settingsKey: 'ffmpegExportVideoDeband',
    resultKey: 'videoDeband',
    parse: parseFfmpegExportVideoDeband
  },
  {
    overrideKey: 'videoHisteq',
    settingsKey: 'ffmpegExportVideoHisteq',
    resultKey: 'videoHisteq',
    parse: parseFfmpegExportVideoHisteq
  },
  {
    overrideKey: 'videoLut3d',
    settingsKey: 'ffmpegExportVideoLut3d',
    resultKey: 'videoLut3d',
    parse: parseFfmpegExportVideoLut3d
  },
  {
    overrideKey: 'videoSharpen',
    settingsKey: 'ffmpegExportVideoSharpen',
    resultKey: 'videoSharpen',
    parse: parseFfmpegExportVideoSharpen
  },
  {
    overrideKey: 'videoEqPreset',
    settingsKey: 'ffmpegExportVideoEqPreset',
    resultKey: 'videoEqPreset',
    parse: parseFfmpegExportVideoEqPreset
  },
  {
    overrideKey: 'videoHue',
    settingsKey: 'ffmpegExportVideoHue',
    resultKey: 'videoHue',
    parse: parseFfmpegExportVideoHue
  },
  {
    overrideKey: 'videoGrain',
    settingsKey: 'ffmpegExportVideoGrain',
    resultKey: 'videoGrain',
    parse: parseFfmpegExportVideoGrain
  },
  {
    overrideKey: 'videoVignette',
    settingsKey: 'ffmpegExportVideoVignette',
    resultKey: 'videoVignette',
    parse: parseFfmpegExportVideoVignette
  },
  {
    overrideKey: 'videoBlur',
    settingsKey: 'ffmpegExportVideoBlur',
    resultKey: 'videoBlur',
    parse: parseFfmpegExportVideoBlur
  },
  {
    overrideKey: 'videoDeinterlace',
    settingsKey: 'ffmpegExportVideoDeinterlace',
    resultKey: 'videoDeinterlace',
    parse: parseFfmpegExportVideoDeinterlace
  },
  {
    overrideKey: 'audioNormalize',
    settingsKey: 'ffmpegExportAudioNormalize',
    resultKey: 'audioNormalize',
    parse: parseFfmpegExportAudioNormalize
  }
] as const

export function resolveFfmpegExportFieldFromSettings<T>(
  raw: Record<string, unknown>,
  settings: AppSettings,
  spec: FfmpegExportResolveFieldSpec
): T {
  const overrideVal = raw[spec.overrideKey]
  const settingsVal = settings[spec.settingsKey]
  if (spec.overrideOnUndefined) {
    return (overrideVal !== undefined ? spec.parse(overrideVal) : spec.parse(settingsVal)) as T
  }
  if (overrideVal !== undefined && overrideVal !== null) {
    return spec.parse(overrideVal) as T
  }
  return spec.parse(settingsVal) as T
}

export function resolveFfmpegExportJobOptionsFromRegistry(
  raw: Record<string, unknown>,
  settings: AppSettings
): Omit<ResolvedFfmpegExportJobOptions, 'twoPass' | 'extraArgsLine'> {
  const out = {} as Omit<ResolvedFfmpegExportJobOptions, 'twoPass' | 'extraArgsLine'>
  for (const spec of FFMPEG_EXPORT_RESOLVE_FIELD_SPECS) {
    ;(out as Record<string, unknown>)[spec.resultKey] = resolveFfmpegExportFieldFromSettings(
      raw,
      settings,
      spec
    )
  }
  return out
}

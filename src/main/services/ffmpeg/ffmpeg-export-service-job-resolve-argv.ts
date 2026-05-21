import type { FfmpegExportVideoCodecId } from '../../../shared/ffmpeg-export-contract'
import type { AppUiLocale } from '../../../shared/app-ui-locale'
import { getMainApplicationStrings } from '../../../shared/main-application-locale'
import type { FfmpegExportArgvParams } from '../../../shared/ffmpeg-export-argv'
import { shouldApplyFfmpegExportTrim } from '../../../shared/ffmpeg-export-argv'
import { parseFfmpegExportExtraArgsLine } from '../../../shared/ffmpeg-export-extra-args'
import {
  parseFfmpegExportAudioMode,
  parseFfmpegExportScalePreset,
  parseFfmpegExportVideoTransform,
  parseFfmpegExportCropPreset,
  parseFfmpegExportSubtitleMode,
  parseFfmpegExportVideoDenoise,
  parseFfmpegExportVideoSharpen,
  parseFfmpegExportVideoDeband,
  parseFfmpegExportVideoHisteq,
  parseFfmpegExportVideoLut3d,
  parseFfmpegExportVideoEqPreset,
  parseFfmpegExportVideoGrain,
  parseFfmpegExportVideoVignette,
  parseFfmpegExportVideoBlur,
  parseFfmpegExportVideoDeinterlace,
  parseFfmpegExportVideoHue,
  parseFfmpegExportAudioNormalize
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
import type { FfmpegExportContainerId } from '../../../shared/ffmpeg-export-contract'
import { resolveFfmpegExportLutCubeAbsPath } from './ffmpeg-export-lut-path'
import { resolveExportSegmentDurationSec } from './ffmpeg-export-spawn-once'
import type { FfmpegExportJobParams } from './ffmpeg-export-service-job-resolve-types'

export type FfmpegExportJobArgvResolve =
  | { ok: false; error: string; videoCodecUsed: FfmpegExportVideoCodecId }
  | {
      ok: true
      wantTwoPass: boolean
      baseArgvParams: FfmpegExportArgvParams
      segmentDur: number
      secondPassProgressMessage: string
    }

export function resolveFfmpegExportJobArgv(
  params: FfmpegExportJobParams,
  videoCodec: FfmpegExportVideoCodecId,
  hwaccelDecode: string | null,
  container: FfmpegExportContainerId,
  uloc: AppUiLocale
): FfmpegExportJobArgvResolve {
  const S = getMainApplicationStrings(uloc)
  const applyTrim = shouldApplyFfmpegExportTrim(params.trim ?? null, params.probeDurationSec)
  const encodePreset = params.encodePreset ?? 'balance'
  const crf = parseFfmpegExportCrf(params.crf)
  const videoBitrate = parseFfmpegExportVideoBitrate(params.videoBitrate)
  const audioBitrate = parseFfmpegExportAudioBitrate(params.audioBitrate) ?? '192k'
  const fps = parseFfmpegExportFps(params.fps)
  const scalePreset = parseFfmpegExportScalePreset(params.scalePreset)
  const videoTransform = parseFfmpegExportVideoTransform(params.videoTransform)
  const cropPreset = parseFfmpegExportCropPreset(params.cropPreset)
  const wantTwoPass = params.twoPass === true && videoBitrate !== null && videoCodec === 'libx264'
  const economyMode = parseFfmpegExportEconomyMode(params.economyMode)
  const extraArgsLine = typeof params.extraArgsLine === 'string' ? params.extraArgsLine : ''
  const extraParsed = parseFfmpegExportExtraArgsLine(extraArgsLine, uloc)
  if (!extraParsed.ok) {
    return {
      ok: false,
      error: extraParsed.error,
      videoCodecUsed: videoCodec
    }
  }
  const audioGainDb = parseFfmpegExportAudioGainDb(params.audioGainDb)
  const stripMetadata = parseFfmpegExportStripFlag(params.stripMetadata)
  const stripChapters = parseFfmpegExportStripFlag(params.stripChapters)
  const subtitleMode = parseFfmpegExportSubtitleMode(params.subtitleMode)
  const videoDenoise = parseFfmpegExportVideoDenoise(params.videoDenoise)
  const videoDeband = parseFfmpegExportVideoDeband(params.videoDeband)
  const videoHisteq = parseFfmpegExportVideoHisteq(params.videoHisteq)
  const explicitLut =
    typeof params.videoLut3dCubeAbsPath === 'string' && params.videoLut3dCubeAbsPath.trim() !== ''
      ? params.videoLut3dCubeAbsPath.trim()
      : null
  const lutRootRaw = params.lutResourcesRoot
  const lutRoot =
    typeof lutRootRaw === 'string' && lutRootRaw.trim() !== '' ? lutRootRaw.trim() : null
  const videoLut3dId = parseFfmpegExportVideoLut3d(params.videoLut3d)
  const videoLut3dCubeAbsPath =
    explicitLut ??
    (lutRoot !== null ? resolveFfmpegExportLutCubeAbsPath(lutRoot, videoLut3dId) : null)
  const videoSharpen = parseFfmpegExportVideoSharpen(params.videoSharpen)
  const videoEqPreset = parseFfmpegExportVideoEqPreset(params.videoEqPreset)
  const videoHue = parseFfmpegExportVideoHue(params.videoHue)
  const videoGrain = parseFfmpegExportVideoGrain(params.videoGrain)
  const videoVignette = parseFfmpegExportVideoVignette(params.videoVignette)
  const videoBlur = parseFfmpegExportVideoBlur(params.videoBlur)
  const videoDeinterlace = parseFfmpegExportVideoDeinterlace(params.videoDeinterlace)
  const audioNormalize = parseFfmpegExportAudioNormalize(params.audioNormalize)
  if (params.twoPass === true && videoBitrate === null) {
    return {
      ok: false,
      error: S.exportTwoPassRequiresBitrate,
      videoCodecUsed: videoCodec
    }
  }
  if (params.twoPass === true && videoCodec !== 'libx264') {
    return {
      ok: false,
      error: S.exportTwoPassLibx264Only,
      videoCodecUsed: videoCodec
    }
  }
  const segmentDur = resolveExportSegmentDurationSec(
    params.trim,
    applyTrim,
    params.probeDurationSec
  )
  const audioMode = parseFfmpegExportAudioMode(params.audioMode)

  const baseArgvParams: FfmpegExportArgvParams = {
    inputPath: params.inputPath,
    outputPath: params.outputPath,
    container,
    ...(params.trim !== undefined ? { trim: params.trim } : {}),
    applyTrim,
    encodePreset,
    crf,
    videoBitrate,
    audioMode,
    audioBitrate,
    fps,
    scalePreset,
    videoTransform,
    cropPreset,
    ...(videoCodec !== 'libx264' ? { videoCodec } : {}),
    ...(audioGainDb !== null ? { audioGainDb } : {}),
    ...(stripMetadata ? { stripMetadata: true } : {}),
    ...(stripChapters ? { stripChapters: true } : {}),
    ...(subtitleMode === 'copy' ? { subtitleMode: 'copy' as const } : {}),
    ...(videoDenoise !== 'off' ? { videoDenoise } : {}),
    ...(videoDeband !== 'off' ? { videoDeband } : {}),
    ...(videoHisteq !== 'off' ? { videoHisteq } : {}),
    ...(videoLut3dCubeAbsPath !== null ? { videoLut3dCubeAbsPath } : {}),
    ...(videoSharpen !== 'off' ? { videoSharpen } : {}),
    ...(videoEqPreset !== 'off' ? { videoEqPreset } : {}),
    ...(videoHue !== 'off' ? { videoHue } : {}),
    ...(videoGrain !== 'off' ? { videoGrain } : {}),
    ...(videoVignette !== 'off' ? { videoVignette } : {}),
    ...(videoBlur !== 'off' ? { videoBlur } : {}),
    ...(videoDeinterlace !== 'off' ? { videoDeinterlace } : {}),
    ...(audioNormalize !== 'off' ? { audioNormalize } : {}),
    ...(params.externalFilterKind === 'avisynth' || params.externalFilterKind === 'vapoursynth'
      ? typeof params.externalFilterScriptAbsPath === 'string' &&
        params.externalFilterScriptAbsPath.length > 0
        ? {
            externalFilterKind: params.externalFilterKind,
            externalFilterScriptAbsPath: params.externalFilterScriptAbsPath
          }
        : {}
      : {}),
    ...(economyMode ? { economyMode: true } : {}),
    ...(hwaccelDecode !== null ? { hwaccelDecode } : {}),
    ...(extraParsed.args.length > 0 ? { extraArgs: extraParsed.args } : {})
  }

  return {
    ok: true,
    wantTwoPass,
    baseArgvParams,
    segmentDur,
    secondPassProgressMessage: S.exportLibx264SecondPassProgress
  }
}

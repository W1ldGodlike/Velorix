import type {
  FfmpegExportAudioModeId,
  FfmpegExportAudioNormalizeId,
  FfmpegExportContainerId,
  FfmpegExportCropPresetId,
  FfmpegExportEncodePresetId,
  FfmpegExportProgressPayload,
  FfmpegExportScalePresetId,
  FfmpegExportSubtitleModeId,
  FfmpegExportVideoCodecId,
  FfmpegExportVideoDebandId,
  FfmpegExportVideoDeinterlaceId,
  FfmpegExportVideoHisteqId,
  FfmpegExportVideoDenoiseId,
  FfmpegExportVideoEqPresetId,
  FfmpegExportVideoGrainId,
  FfmpegExportVideoHueId,
  FfmpegExportVideoBlurId,
  FfmpegExportVideoLut3dId,
  FfmpegExportVideoSharpenId,
  FfmpegExportVideoTransformId,
  FfmpegExportVideoVignetteId,
  MediaExportTrimPayload
} from '../shared/ffmpeg-export-contract'
import {
  exportAudioModeMkvOnlyErrorMessage,
  ffmpegExportAudioModeRequiresMkv
} from '../shared/ffmpeg-export-audio-mode'
import {
  cpuFfmpegVideoCodecRequiresMkv,
  exportCpuCodecMkvOnlyErrorMessage,
  exportMovOnlyCodecErrorMessage,
  ffmpegExportVideoCodecRequiresMov,
  parseFfmpegExportVideoCodec,
  pickFfmpegHwAutoEncoder,
  pickFfmpegHwAutoHevcEncoder
} from '../shared/ffmpeg-export-video-codec'
import { createEmptyFfmpegHwEncodersSnapshot } from '../shared/ffmpeg-hw-encoder-probe'
import type { DownloadsWindowUiLocale } from '../shared/downloads-window-ui-locale'
import { getMainApplicationStrings } from '../shared/main-application-locale'
import type { FfmpegExportArgvParams } from '../shared/ffmpeg-export-argv'
import { shouldApplyFfmpegExportTrim } from '../shared/ffmpeg-export-argv'
import { parseFfmpegExportExtraArgsLine } from '../shared/ffmpeg-export-extra-args'
import {
  parseFfmpegExportHwDecode,
  resolveFfmpegExportHwaccelForDecode
} from '../shared/ffmpeg-export-hw-decode'
import {
  parseFfmpegExportAudioMode,
  parseFfmpegExportContainer,
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
} from '../shared/ffmpeg-export-parse-registry'
import {
  parseFfmpegExportAudioBitrate,
  parseFfmpegExportAudioGainDb,
  parseFfmpegExportCrf,
  parseFfmpegExportEconomyMode,
  parseFfmpegExportFps,
  parseFfmpegExportStripFlag,
  parseFfmpegExportVideoBitrate
} from '../shared/ffmpeg-export-stored-parse'
import { resolveFfmpegExportLutCubeAbsPath } from './ffmpeg-export-lut-path'
import { probeFfmpegHwEncoders } from './ffmpeg-hw-encoder-probe-main'
import { resolveExportSegmentDurationSec } from './ffmpeg-export-spawn-once'

export type FfmpegExportJobParams = {
  ffmpegPath: string
  inputPath: string
  outputPath: string
  trim?: MediaExportTrimPayload
  probeDurationSec?: number | null
  encodePreset?: FfmpegExportEncodePresetId
  videoCodec?: FfmpegExportVideoCodecId | null
  container?: FfmpegExportContainerId | null
  crf?: number | null
  videoBitrate?: string | null
  audioMode?: FfmpegExportAudioModeId | null
  audioBitrate?: string | null
  fps?: number | null
  scalePreset?: FfmpegExportScalePresetId | null
  videoTransform?: FfmpegExportVideoTransformId | null
  cropPreset?: FfmpegExportCropPresetId | null
  twoPass?: boolean | null
  economyMode?: boolean | null
  hwDecode?: boolean | null
  extraArgsLine?: string | null
  audioGainDb?: number | null
  stripMetadata?: boolean | null
  stripChapters?: boolean | null
  subtitleMode?: FfmpegExportSubtitleModeId | null
  videoDenoise?: FfmpegExportVideoDenoiseId | null
  videoDeband?: FfmpegExportVideoDebandId | null
  videoHisteq?: FfmpegExportVideoHisteqId | null
  videoLut3d?: FfmpegExportVideoLut3dId | null
  lutResourcesRoot?: string | null
  videoLut3dCubeAbsPath?: string | null
  videoSharpen?: FfmpegExportVideoSharpenId | null
  videoEqPreset?: FfmpegExportVideoEqPresetId | null
  videoHue?: FfmpegExportVideoHueId | null
  videoGrain?: FfmpegExportVideoGrainId | null
  videoVignette?: FfmpegExportVideoVignetteId | null
  videoBlur?: FfmpegExportVideoBlurId | null
  videoDeinterlace?: FfmpegExportVideoDeinterlaceId | null
  audioNormalize?: FfmpegExportAudioNormalizeId | null
  signal: AbortSignal
  onProgress?: (p: FfmpegExportProgressPayload) => void
  uiLocale?: DownloadsWindowUiLocale
}

export type FfmpegExportJobResolved =
  | { ok: false; error: string; videoCodecUsed: FfmpegExportVideoCodecId }
  | {
      ok: true
      videoCodec: FfmpegExportVideoCodecId
      wantTwoPass: boolean
      baseArgvParams: FfmpegExportArgvParams
      segmentDur: number
      uloc: DownloadsWindowUiLocale
      secondPassProgressMessage: string
      jobOnProgress?: (p: FfmpegExportProgressPayload) => void
      doneOk: () => { ok: true; videoCodecUsed: FfmpegExportVideoCodecId }
      doneErr: (error: string) => {
        ok: false
        error: string
        videoCodecUsed: FfmpegExportVideoCodecId
      }
    }

export async function resolveFfmpegExportJobPlan(
  params: FfmpegExportJobParams
): Promise<FfmpegExportJobResolved> {
  const uloc = params.uiLocale ?? 'ru'
  const S = getMainApplicationStrings(uloc)
  const applyTrim = shouldApplyFfmpegExportTrim(params.trim ?? null, params.probeDurationSec)
  const encodePreset = params.encodePreset ?? 'balance'
  const parsedVideoCodec = parseFfmpegExportVideoCodec(params.videoCodec)
  let videoCodec: FfmpegExportVideoCodecId = parsedVideoCodec
  const wantHwDecode = parseFfmpegExportHwDecode(params.hwDecode)
  let hwaccels: readonly string[] = []
  if (parsedVideoCodec === 'hw_auto' || parsedVideoCodec === 'hw_auto_hevc' || wantHwDecode) {
    let snap = createEmptyFfmpegHwEncodersSnapshot()
    try {
      const pr = await probeFfmpegHwEncoders(params.ffmpegPath)
      if (pr.ok) {
        snap = pr.snapshot
        hwaccels = pr.hwaccels
      }
    } catch {
      /* probe не обязан быть доступен — остаёмся на CPU */
    }
    if (parsedVideoCodec === 'hw_auto' || parsedVideoCodec === 'hw_auto_hevc') {
      videoCodec =
        parsedVideoCodec === 'hw_auto_hevc'
          ? pickFfmpegHwAutoHevcEncoder(snap)
          : pickFfmpegHwAutoEncoder(snap)
    }
  }
  const hwaccelDecode = wantHwDecode
    ? resolveFfmpegExportHwaccelForDecode(videoCodec, hwaccels)
    : null
  const crf = parseFfmpegExportCrf(params.crf)
  const videoBitrate = parseFfmpegExportVideoBitrate(params.videoBitrate)
  const audioMode = parseFfmpegExportAudioMode(params.audioMode)
  const audioBitrate = parseFfmpegExportAudioBitrate(params.audioBitrate) ?? '192k'
  const fps = parseFfmpegExportFps(params.fps)
  const scalePreset = parseFfmpegExportScalePreset(params.scalePreset)
  const videoTransform = parseFfmpegExportVideoTransform(params.videoTransform)
  const cropPreset = parseFfmpegExportCropPreset(params.cropPreset)
  const container = parseFfmpegExportContainer(params.container ?? 'mp4')
  if (cpuFfmpegVideoCodecRequiresMkv(videoCodec) && container !== 'mkv') {
    return {
      ok: false,
      error: exportCpuCodecMkvOnlyErrorMessage(videoCodec),
      videoCodecUsed: videoCodec
    }
  }
  if (ffmpegExportVideoCodecRequiresMov(videoCodec) && container !== 'mov') {
    return {
      ok: false,
      error: exportMovOnlyCodecErrorMessage(videoCodec),
      videoCodecUsed: videoCodec
    }
  }
  if (ffmpegExportAudioModeRequiresMkv(audioMode) && container !== 'mkv') {
    return {
      ok: false,
      error: exportAudioModeMkvOnlyErrorMessage(audioMode),
      videoCodecUsed: videoCodec
    }
  }
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
    ...(economyMode ? { economyMode: true } : {}),
    ...(hwaccelDecode !== null ? { hwaccelDecode } : {}),
    ...(extraParsed.args.length > 0 ? { extraArgs: extraParsed.args } : {})
  }

  const doneOk = (): { ok: true; videoCodecUsed: FfmpegExportVideoCodecId } => ({
    ok: true,
    videoCodecUsed: videoCodec
  })
  const doneErr = (
    error: string
  ): { ok: false; error: string; videoCodecUsed: FfmpegExportVideoCodecId } => ({
    ok: false,
    error,
    videoCodecUsed: videoCodec
  })

  const onProgressCb = params.onProgress
  const jobOnProgress =
    onProgressCb === undefined
      ? undefined
      : (p: FfmpegExportProgressPayload): void => {
          onProgressCb({ ...p, videoCodecUsed: videoCodec })
        }

  return {
    ok: true,
    videoCodec,
    wantTwoPass,
    baseArgvParams,
    segmentDur,
    uloc,
    secondPassProgressMessage: S.exportLibx264SecondPassProgress,
    ...(jobOnProgress !== undefined ? { jobOnProgress } : {}),
    doneOk,
    doneErr
  }
}

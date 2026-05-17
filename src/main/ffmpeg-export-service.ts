import { mkdtempSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'

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
import { FFMPEG_EXPORT_CANCELLED_ERROR } from '../shared/ffmpeg-export-contract'
import type { DownloadsWindowUiLocale } from '../shared/downloads-window-ui-locale'
import { getMainApplicationStrings } from '../shared/main-application-locale'
import { buildFfmpegExportArgv, shouldApplyFfmpegExportTrim } from '../shared/ffmpeg-export-argv'

import { resolveFfmpegExportLutCubeAbsPath } from './ffmpeg-export-lut-path'
import { parseFfmpegExportExtraArgsLine } from '../shared/ffmpeg-export-extra-args'
import {
  parseFfmpegExportHwDecode,
  resolveFfmpegExportHwaccelForDecode
} from '../shared/ffmpeg-export-hw-decode'
import { probeFfmpegHwEncoders } from './ffmpeg-hw-encoder-probe-main'
import {
  parseFfmpegExportAudioBitrate,
  parseFfmpegExportAudioGainDb,
  parseFfmpegExportCrf,
  parseFfmpegExportEconomyMode,
  parseFfmpegExportFps,
  parseFfmpegExportStripFlag,
  parseFfmpegExportVideoBitrate
} from '../shared/ffmpeg-export-stored-parse'

export type {
  FfmpegExportAudioModeId,
  FfmpegExportAudioNormalizeId,
  FfmpegExportContainerId,
  FfmpegExportCropPresetId,
  FfmpegExportEncodePresetId,
  FfmpegExportProgressPayload,
  FfmpegExportScalePresetId,
  FfmpegExportSubtitleModeId,
  FfmpegExportUserPreset,
  FfmpegExportUserPresetSnapshot,
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
  MediaExportRequestPayload,
  MediaExportStartResult,
  MediaExportTrimPayload
} from '../shared/ffmpeg-export-contract'

export {
  buildFfmpegExportArgv,
  buildFfmpegExportPreviewCommand,
  formatFfmpegArgvForPreview,
  normalizeFfmpegExportAudioGainDb,
  resolveFfmpegExportAudioNormalizeFilter,
  resolveFfmpegExportEncodeParams as resolveExportEncodeParams,
  resolveFfmpegExportScaleFilter,
  resolveFfmpegExportSubtitleCopyCodec,
  resolveFfmpegExportVideoDenoiseFilter,
  resolveFfmpegExportVideoDeinterlaceFilter,
  resolveFfmpegExportVideoHisteqFilter,
  resolveFfmpegExportVideoEqFilter,
  resolveFfmpegExportVideoGrainFilter,
  resolveFfmpegExportVideoHueFilter,
  resolveFfmpegExportVideoBlurFilter,
  resolveFfmpegExportVideoSharpenFilter,
  resolveFfmpegExportVideoVignetteFilter,
  shouldApplyFfmpegExportTrim
} from '../shared/ffmpeg-export-argv'
import {
  parseFfmpegExportContainer,
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
} from '../shared/ffmpeg-export-parse-registry'

export {
  parseFfmpegExportEncodePreset,
  parseFfmpegExportContainer,
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
} from '../shared/ffmpeg-export-parse-registry'

export { parseFfmpegExportVideoCodec }

export {
  parseFfmpegExportAudioBitrate,
  parseFfmpegExportAudioGainDb,
  parseFfmpegExportCrf,
  parseFfmpegExportEconomyMode,
  parseFfmpegExportFps,
  parseFfmpegExportStripFlag,
  parseFfmpegExportTrim,
  parseFfmpegExportTwoPass,
  parseFfmpegExportVideoBitrate
} from '../shared/ffmpeg-export-stored-parse'

export {
  parseFfmpegExportUserPresetSnapshot,
  parseFfmpegExportUserPresetsList
} from '../shared/ffmpeg-export-user-preset-parse'

export {
  parseFfmpegSpeedToken,
  parseFfmpegTimeSeconds
} from '../shared/ffmpeg-export-progress-parse'

export {
  inferFfmpegExportContainerFromPath,
  ensureFfmpegExportExtension,
  mergeFfmpegExportSnapshotIntoAppSettings
} from './ffmpeg-export-app-settings-merge'
export {
  isFfmpegExportProgressStatusLine,
  resolveExportSegmentDurationSec,
  runFfmpegExportOnce
} from './ffmpeg-export-spawn-once'

import { runFfmpegExportOnce, resolveExportSegmentDurationSec } from './ffmpeg-export-spawn-once'

/**
 * §7 — экспорт: один или два прохода libx264; двухпроход только с валидным `videoBitrate`.
 */
export async function runFfmpegExportJob(params: {
  ffmpegPath: string
  inputPath: string
  outputPath: string
  trim?: MediaExportTrimPayload
  probeDurationSec?: number | null
  encodePreset?: FfmpegExportEncodePresetId
  /** §7.2 — по умолчанию libx264. */
  videoCodec?: FfmpegExportVideoCodecId | null
  /** Контейнер сохранения §7.2 — влияет на хвост argv (MKV без `-movflags`). */
  container?: FfmpegExportContainerId | null
  crf?: number | null
  videoBitrate?: string | null
  audioMode?: FfmpegExportAudioModeId | null
  audioBitrate?: string | null
  fps?: number | null
  scalePreset?: FfmpegExportScalePresetId | null
  videoTransform?: FfmpegExportVideoTransformId | null
  cropPreset?: FfmpegExportCropPresetId | null
  /** §7.2 / v0 — двухпроход без CRF и только с bitrate. */
  twoPass?: boolean | null
  /** §7.3 — `-threads 1` в argv. */
  economyMode?: boolean | null
  /** §7.2 — аппаратное декодирование (`-hwaccel`). */
  hwDecode?: boolean | null
  /** §7.2 — доп. argv (строка). */
  extraArgsLine?: string | null
  /** §7.2 — целое значение в дБ; `null`/`0` = без `-filter:a volume`. */
  audioGainDb?: number | null
  /** §7.2 — удалить контейнерные метаданные. */
  stripMetadata?: boolean | null
  /** §7.2 — удалить главы. */
  stripChapters?: boolean | null
  /** §7.2 — режим субтитров (`copy` или `drop`). */
  subtitleMode?: FfmpegExportSubtitleModeId | null
  /** §7.2 — `hqdn3d` denoise; `off`/null — без фильтра. */
  videoDenoise?: FfmpegExportVideoDenoiseId | null
  /** §7.2 — `deband`; `off`/null — без фильтра. */
  videoDeband?: FfmpegExportVideoDebandId | null
  /** §7.2 — `histeq`; `off`/null — без фильтра. */
  videoHisteq?: FfmpegExportVideoHisteqId | null
  /** §7.2 — bundled пресет `lut3d`; вместе с `lutResourcesRoot` даёт путь к `.cube`. */
  videoLut3d?: FfmpegExportVideoLut3dId | null
  /** §7.2 — корень `resources/` (dev: app root, prod: `process.resourcesPath`) для `resources/luts/*.cube`. */
  lutResourcesRoot?: string | null
  /** §7.2 — явный путь к `.cube` (тесты / override); иначе вычисляется из `videoLut3d` + `lutResourcesRoot`. */
  videoLut3dCubeAbsPath?: string | null
  /** §7.2 — `unsharp` контурная резкость; `off`/null — без фильтра. */
  videoSharpen?: FfmpegExportVideoSharpenId | null
  /** §7.2 — `eq=...` цветокор-пресет; `off`/null — без фильтра. */
  videoEqPreset?: FfmpegExportVideoEqPresetId | null
  /** §7.2 — `hue` после `eq`; `off`/null — без фильтра. */
  videoHue?: FfmpegExportVideoHueId | null
  /** §7.2 — `noise` зернистость; `off`/null — без фильтра. */
  videoGrain?: FfmpegExportVideoGrainId | null
  /** §7.2 — `vignette`; `off`/null — без фильтра. */
  videoVignette?: FfmpegExportVideoVignetteId | null
  /** §7.2 — `gblur`; `off`/null — без фильтра. */
  videoBlur?: FfmpegExportVideoBlurId | null
  /** §7.2 — `yadif`; `off`/null — без фильтра. */
  videoDeinterlace?: FfmpegExportVideoDeinterlaceId | null
  /** §7.2 — `loudnorm`/`dynaudnorm`; `off`/null — без фильтра. */
  audioNormalize?: FfmpegExportAudioNormalizeId | null
  signal: AbortSignal
  onProgress?: (p: FfmpegExportProgressPayload) => void
  uiLocale?: DownloadsWindowUiLocale
}): Promise<
  | { ok: true; videoCodecUsed: FfmpegExportVideoCodecId }
  | { ok: false; error: string; videoCodecUsed: FfmpegExportVideoCodecId }
> {
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

  const baseArgvParams = {
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

  if (!wantTwoPass) {
    const args = buildFfmpegExportArgv(baseArgvParams)
    const r = await runFfmpegExportOnce({
      ffmpegPath: params.ffmpegPath,
      args,
      signal: params.signal,
      segmentDur,
      uiLocale: uloc,
      ...(jobOnProgress !== undefined ? { onProgress: jobOnProgress } : {})
    })
    return r.ok ? doneOk() : doneErr(r.error)
  }

  let tmpDir: string | null = null
  try {
    tmpDir = mkdtempSync(join(tmpdir(), 'fa-x264tw-'))
    const passlogBase = join(tmpDir, 'pass')
    const nullSink = process.platform === 'win32' ? 'NUL' : '/dev/null'

    const argsPass1 = buildFfmpegExportArgv({
      ...baseArgvParams,
      twoPass: { pass: 1, passlogfile: passlogBase, nullDevice: nullSink }
    })
    const r1 = await runFfmpegExportOnce({
      ffmpegPath: params.ffmpegPath,
      args: argsPass1,
      signal: params.signal,
      segmentDur,
      uiLocale: uloc,
      mapPercent: (p) => p * 0.5,
      ...(jobOnProgress !== undefined ? { onProgress: jobOnProgress } : {})
    })
    if (!r1.ok) {
      return doneErr(r1.error)
    }
    if (params.signal.aborted) {
      return doneErr(FFMPEG_EXPORT_CANCELLED_ERROR)
    }

    jobOnProgress?.({ percent: 50, message: S.exportLibx264SecondPassProgress })

    const argsPass2 = buildFfmpegExportArgv({
      ...baseArgvParams,
      twoPass: { pass: 2, passlogfile: passlogBase, nullDevice: nullSink }
    })
    const r2 = await runFfmpegExportOnce({
      ffmpegPath: params.ffmpegPath,
      args: argsPass2,
      signal: params.signal,
      segmentDur,
      uiLocale: uloc,
      mapPercent: (p) => 50 + p * 0.5,
      ...(jobOnProgress !== undefined ? { onProgress: jobOnProgress } : {})
    })
    return r2.ok ? doneOk() : doneErr(r2.error)
  } finally {
    if (tmpDir !== null) {
      try {
        rmSync(tmpDir, { recursive: true, force: true })
      } catch {
        /* каталог временный — ошибки очистки не блокируют UI */
      }
    }
  }
}

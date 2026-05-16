import { spawn } from 'child_process'
import { mkdtempSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'

import type { AppSettings } from '../shared/settings-contract'
import type {
  FfmpegExportAudioModeId,
  FfmpegExportAudioNormalizeId,
  FfmpegExportContainerId,
  FfmpegExportCropPresetId,
  FfmpegExportEncodePresetId,
  FfmpegExportProgressPayload,
  FfmpegExportScalePresetId,
  FfmpegExportSubtitleModeId,
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

import { logExternalProcessLine } from './external-process-log'
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
import {
  parseFfmpegSpeedToken,
  parseFfmpegTimeSeconds
} from '../shared/ffmpeg-export-progress-parse'

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

export function inferFfmpegExportContainerFromPath(path: string): FfmpegExportContainerId {
  const lower = path.trim().toLowerCase()
  if (lower.endsWith('.mkv')) {
    return 'mkv'
  }
  if (lower.endsWith('.mov')) {
    return 'mov'
  }
  return 'mp4'
}

export function ensureFfmpegExportExtension(
  path: string,
  fallback: FfmpegExportContainerId
): string {
  const trimmed = path.trim()
  if (/\.(mp4|mkv|mov)$/i.test(trimmed)) {
    return trimmed
  }
  return `${trimmed}.${parseFfmpegExportContainer(fallback)}`
}

/**
 * §7.2 — записать снимок в сериализуемые поля `AppSettings` (те же правила delete при «по умолчанию», что и точечные IPC).
 */
export function mergeFfmpegExportSnapshotIntoAppSettings(
  base: AppSettings,
  snapshot: FfmpegExportUserPresetSnapshot
): AppSettings {
  const next: AppSettings = { ...base }
  next.ffmpegExportEncodePreset = snapshot.encodePreset
  const snapV = parseFfmpegExportVideoCodec(snapshot.videoCodec)
  if (snapV === 'libx264') {
    delete next.ffmpegExportVideoCodec
  } else {
    next.ffmpegExportVideoCodec = snapV
  }
  next.ffmpegExportContainer = snapshot.container
  if (snapshot.crf === null) {
    delete next.ffmpegExportCrf
  } else {
    next.ffmpegExportCrf = snapshot.crf
  }
  if (snapshot.videoBitrate === null) {
    delete next.ffmpegExportVideoBitrate
  } else {
    next.ffmpegExportVideoBitrate = snapshot.videoBitrate
  }
  next.ffmpegExportAudioBitrate = snapshot.audioBitrate
  if (snapshot.audioMode === 'aac') {
    delete next.ffmpegExportAudioMode
  } else {
    next.ffmpegExportAudioMode = snapshot.audioMode
  }
  if (snapshot.fps === null) {
    delete next.ffmpegExportFps
  } else {
    next.ffmpegExportFps = snapshot.fps
  }
  if (snapshot.scalePreset === 'source') {
    delete next.ffmpegExportScalePreset
  } else {
    next.ffmpegExportScalePreset = snapshot.scalePreset
  }
  if (snapshot.videoTransform === 'none') {
    delete next.ffmpegExportVideoTransform
  } else {
    next.ffmpegExportVideoTransform = snapshot.videoTransform
  }
  if (snapshot.cropPreset === 'none') {
    delete next.ffmpegExportCropPreset
  } else {
    next.ffmpegExportCropPreset = snapshot.cropPreset
  }
  const snapCodec = parseFfmpegExportVideoCodec(snapshot.videoCodec)
  if (snapshot.twoPass === true && snapCodec === 'libx264' && snapshot.videoBitrate !== null) {
    next.ffmpegExportTwoPass = true
  } else {
    delete next.ffmpegExportTwoPass
  }
  if (snapshot.economyMode === true) {
    next.ffmpegExportEconomyMode = true
  } else {
    delete next.ffmpegExportEconomyMode
  }
  if (snapshot.hwDecode === true) {
    next.ffmpegExportHwDecode = true
  } else {
    delete next.ffmpegExportHwDecode
  }
  if (typeof snapshot.extraArgsLine === 'string' && snapshot.extraArgsLine.trim().length > 0) {
    next.ffmpegExportExtraArgsLine = snapshot.extraArgsLine.trim()
  } else {
    delete next.ffmpegExportExtraArgsLine
  }
  if (typeof snapshot.audioGainDb === 'number' && snapshot.audioGainDb !== 0) {
    next.ffmpegExportAudioGainDb = snapshot.audioGainDb
  } else {
    delete next.ffmpegExportAudioGainDb
  }
  if (snapshot.stripMetadata === true) {
    next.ffmpegExportStripMetadata = true
  } else {
    delete next.ffmpegExportStripMetadata
  }
  if (snapshot.stripChapters === true) {
    next.ffmpegExportStripChapters = true
  } else {
    delete next.ffmpegExportStripChapters
  }
  if (snapshot.subtitleMode === 'copy') {
    next.ffmpegExportSubtitleMode = 'copy'
  } else {
    delete next.ffmpegExportSubtitleMode
  }
  if (
    snapshot.videoDenoise === 'light' ||
    snapshot.videoDenoise === 'medium' ||
    snapshot.videoDenoise === 'strong'
  ) {
    next.ffmpegExportVideoDenoise = snapshot.videoDenoise
  } else {
    delete next.ffmpegExportVideoDenoise
  }
  if (
    snapshot.videoDeband === 'light' ||
    snapshot.videoDeband === 'medium' ||
    snapshot.videoDeband === 'strong'
  ) {
    next.ffmpegExportVideoDeband = snapshot.videoDeband
  } else {
    delete next.ffmpegExportVideoDeband
  }
  if (
    snapshot.videoHisteq === 'light' ||
    snapshot.videoHisteq === 'medium' ||
    snapshot.videoHisteq === 'strong'
  ) {
    next.ffmpegExportVideoHisteq = snapshot.videoHisteq
  } else {
    delete next.ffmpegExportVideoHisteq
  }
  if (
    snapshot.videoLut3d === 'film-warm' ||
    snapshot.videoLut3d === 'film-cool' ||
    snapshot.videoLut3d === 'punch'
  ) {
    next.ffmpegExportVideoLut3d = snapshot.videoLut3d
  } else {
    delete next.ffmpegExportVideoLut3d
  }
  if (
    snapshot.videoSharpen === 'light' ||
    snapshot.videoSharpen === 'medium' ||
    snapshot.videoSharpen === 'strong'
  ) {
    next.ffmpegExportVideoSharpen = snapshot.videoSharpen
  } else {
    delete next.ffmpegExportVideoSharpen
  }
  if (
    snapshot.videoEqPreset === 'warm' ||
    snapshot.videoEqPreset === 'cool' ||
    snapshot.videoEqPreset === 'vivid' ||
    snapshot.videoEqPreset === 'flat'
  ) {
    next.ffmpegExportVideoEqPreset = snapshot.videoEqPreset
  } else {
    delete next.ffmpegExportVideoEqPreset
  }
  if (
    snapshot.videoHue === 'warmShift' ||
    snapshot.videoHue === 'coolShift' ||
    snapshot.videoHue === 'satBoost'
  ) {
    next.ffmpegExportVideoHue = snapshot.videoHue
  } else {
    delete next.ffmpegExportVideoHue
  }
  if (
    snapshot.videoGrain === 'light' ||
    snapshot.videoGrain === 'medium' ||
    snapshot.videoGrain === 'strong'
  ) {
    next.ffmpegExportVideoGrain = snapshot.videoGrain
  } else {
    delete next.ffmpegExportVideoGrain
  }
  if (
    snapshot.videoVignette === 'light' ||
    snapshot.videoVignette === 'medium' ||
    snapshot.videoVignette === 'strong'
  ) {
    next.ffmpegExportVideoVignette = snapshot.videoVignette
  } else {
    delete next.ffmpegExportVideoVignette
  }
  if (
    snapshot.videoBlur === 'light' ||
    snapshot.videoBlur === 'medium' ||
    snapshot.videoBlur === 'strong'
  ) {
    next.ffmpegExportVideoBlur = snapshot.videoBlur
  } else {
    delete next.ffmpegExportVideoBlur
  }
  if (snapshot.videoDeinterlace === 'frame' || snapshot.videoDeinterlace === 'field') {
    next.ffmpegExportVideoDeinterlace = snapshot.videoDeinterlace
  } else {
    delete next.ffmpegExportVideoDeinterlace
  }
  if (snapshot.audioNormalize === 'loudnorm' || snapshot.audioNormalize === 'dynaudnorm') {
    next.ffmpegExportAudioNormalize = snapshot.audioNormalize
  } else {
    delete next.ffmpegExportAudioNormalize
  }
  return next
}

/**
 * §7.1 — показывать в статусбаре только строки статистики `-stats` или явные ошибки;
 * отфильтровываем баннер версии, конфиг-декларации и прочий шум без `time=`/`frame=`.
 */
export function isFfmpegExportProgressStatusLine(line: string): boolean {
  const t = line.trim()
  if (t.length === 0) {
    return false
  }
  if (/\[(?:error|fatal)\]/i.test(t)) {
    return true
  }
  if (/\berror while\b|\bfailed to\b|\binvalid\b|\bcannot\b/i.test(t)) {
    return true
  }
  return /\b(?:frame=\s*\d|fps=\s*[\d.]+|L?size=\s*|time=\s*\d|bitrate=\s*|speed=\s*[\d.N/A]+)/i.test(
    t
  )
}

export function resolveExportSegmentDurationSec(
  trim: MediaExportTrimPayload | undefined,
  applyTrim: boolean,
  probeDurationSec: number | null | undefined
): number {
  if (applyTrim && trim) {
    return Math.max(0.01, trim.outSec - trim.inSec)
  }
  if (
    probeDurationSec !== null &&
    probeDurationSec !== undefined &&
    Number.isFinite(probeDurationSec) &&
    probeDurationSec > 0
  ) {
    return probeDurationSec
  }
  return 0
}

/**
 * Один запуск ffmpeg без shell: только массив аргументов §7 / §21.
 * Прогресс — по `time=` в stderr; `mapPercent` масштабирует процент для двухпроходного режима.
 */
function runFfmpegExportOnce(params: {
  ffmpegPath: string
  args: string[]
  signal: AbortSignal
  segmentDur: number
  onProgress?: (p: FfmpegExportProgressPayload) => void
  mapPercent?: (rawPercent: number) => number
  uiLocale?: DownloadsWindowUiLocale
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const locStrings = getMainApplicationStrings(params.uiLocale ?? 'ru')
  return new Promise((resolve) => {
    const child = spawn(params.ffmpegPath, params.args, {
      windowsHide: true,
      stdio: ['ignore', 'ignore', 'pipe'],
      signal: params.signal
    })
    logExternalProcessLine('ffmpeg-export', 'lifecycle', 'started')

    let stderrTail = ''
    let lastSpeed: string | null = null

    function emitLine(line: string): void {
      const trimmed = line.trimEnd()
      if (trimmed.length === 0) {
        return
      }
      logExternalProcessLine('ffmpeg-export', 'stderr', trimmed)
      const spd = parseFfmpegSpeedToken(trimmed)
      if (spd !== null) {
        lastSpeed = spd
      }
      if (!isFfmpegExportProgressStatusLine(trimmed)) {
        return
      }
      const t = parseFfmpegTimeSeconds(trimmed)
      let pct = -1
      if (t !== null && params.segmentDur > 0.05) {
        pct = Math.min(99.9, Math.max(0, (t / params.segmentDur) * 100))
      }
      const msg = trimmed.length > 140 ? `${trimmed.slice(0, 138)}…` : trimmed
      const outPct = pct >= 0 && params.mapPercent !== undefined ? params.mapPercent(pct) : pct
      params.onProgress?.({
        percent: outPct,
        message: msg,
        ...(lastSpeed !== null ? { speed: lastSpeed } : {})
      })
    }

    child.stderr?.setEncoding('utf8')
    child.stderr?.on('data', (chunk: string) => {
      stderrTail += chunk
      const parts = stderrTail.split(/\r|\n/)
      stderrTail = parts.pop() ?? ''
      for (const part of parts) {
        const t = part.trimEnd()
        if (t.length > 0) {
          emitLine(t)
        }
      }
    })

    child.on('error', (err) => {
      logExternalProcessLine('ffmpeg-export', 'lifecycle', `error ${err.message}`)
      if (params.signal.aborted || err.name === 'AbortError') {
        resolve({ ok: false, error: FFMPEG_EXPORT_CANCELLED_ERROR })
        return
      }
      resolve({ ok: false, error: err.message })
    })

    child.on('close', (code) => {
      logExternalProcessLine('ffmpeg-export', 'lifecycle', `closed exitCode=${code ?? '?'}`)
      if (stderrTail.trim().length > 0) {
        emitLine(stderrTail)
        stderrTail = ''
      }
      if (params.signal.aborted) {
        resolve({ ok: false, error: FFMPEG_EXPORT_CANCELLED_ERROR })
        return
      }
      if (code === 0) {
        resolve({ ok: true })
      } else {
        resolve({
          ok: false,
          error: locStrings.exportFfmpegExitedWithCode.replace(
            '{code}',
            code === null || code === undefined ? '?' : String(code)
          )
        })
      }
    })
  })
}

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

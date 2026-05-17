/**
 * §7.2 — чистая сборка argv ffmpeg-экспорта без shell-строк и Node-зависимостей.
 *
 * Эти хелперы безопасно вызывать и из main-сервиса (`runFfmpegExportJob`), и из renderer
 * для live preview команды §7.2. Логика валидации параметров остаётся в main
 * (`parseFfmpegExport*`): сюда приходят только уже нормализованные значения.
 */

import type {
  FfmpegExportAudioModeId,
  FfmpegExportAudioNormalizeId,
  FfmpegExportContainerId,
  FfmpegExportCropPresetId,
  FfmpegExportEncodePresetId,
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
  FfmpegExportVideoSharpenId,
  FfmpegExportVideoVignetteId,
  FfmpegExportVideoTransformId,
  MediaExportTrimPayload
} from './ffmpeg-export-contract'
import { buildFfmpegExportArgv } from './ffmpeg-export-argv-build'

export function shouldApplyFfmpegExportTrim(
  trim: MediaExportTrimPayload | undefined | null,
  probeDurationSec: number | null | undefined
): trim is MediaExportTrimPayload {
  if (!trim || !Number.isFinite(trim.inSec) || !Number.isFinite(trim.outSec)) {
    return false
  }
  const span = trim.outSec - trim.inSec
  if (span <= 0.05) {
    return false
  }
  if (
    probeDurationSec !== null &&
    probeDurationSec !== undefined &&
    Number.isFinite(probeDurationSec) &&
    probeDurationSec > 0.5
  ) {
    if (trim.inSec < 0.08 && Math.abs(span - probeDurationSec) < 0.35) {
      return false
    }
  }
  return true
}

/** CRF и `-preset` x264 для системного пресета §7.2 (только белый список). */

export function resolveFfmpegExportEncodeParams(preset: FfmpegExportEncodePresetId): {
  crf: string
  x264preset: string
} {
  switch (preset) {
    case 'smaller':
      return { crf: '28', x264preset: 'fast' }
    case 'quality':
      return { crf: '18', x264preset: 'medium' }
    default:
      return { crf: '23', x264preset: 'fast' }
  }
}

export * from './ffmpeg-export-argv-filters'
export { buildFfmpegExportArgv, type FfmpegExportArgvParams } from './ffmpeg-export-argv-build'

export function formatFfmpegArgvForPreview(tokens: ReadonlyArray<string>): string {
  return tokens
    .map((t) => {
      if (/[\s"]/.test(t)) {
        return `"${t.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
      }
      return t
    })
    .join(' ')
}

export interface FfmpegExportPreviewInput {
  encodePreset: FfmpegExportEncodePresetId
  /** §7.2 — по умолчанию libx264. */
  videoCodec?: FfmpegExportVideoCodecId
  /** Совпадает с выбором контейнера в toolbar §7.2; по умолчанию mp4. */
  container?: FfmpegExportContainerId
  crf: number | null
  videoBitrate: string | null
  audioMode: FfmpegExportAudioModeId
  audioBitrate: string
  fps: number | null
  scalePreset: FfmpegExportScalePresetId
  videoTransform?: FfmpegExportVideoTransformId
  cropPreset?: FfmpegExportCropPresetId
  /** Если задан — используется как input в превью; иначе подставляется `<input>`. */
  inputPath?: string | null
  /** Если задан — используется как output в превью; иначе подставляется `<output>`. */
  outputPath?: string | null
  /** Маркеры in/out для отображения `-ss`/`-t` в превью. */
  trim?: MediaExportTrimPayload | null
  /** Длительность исходника из ffprobe; нужна, чтобы preview совпадал с фактическим spawn (см. `shouldApplyFfmpegExportTrim`). */
  probeDurationSec?: number | null
  /** Принудительно отключить `-ss/-t` в превью. По умолчанию решение берётся из `shouldApplyFfmpegExportTrim`. */
  applyTrim?: boolean
  /** §7.2 / v0 — показать пару команд при включённом двухпроходе и режиме битрейта. */
  twoPass?: boolean
  /** §7.3 — `-threads 1` в превью argv. */
  economyMode?: boolean
  /** §7.2 — `-hwaccel` в превью (уже разрешённый метод). */
  hwaccelDecode?: string | null
  /** §7.2 — доп. argv (уже разобранные). */
  extraArgs?: readonly string[]
  /** Плейсхолдер `-passlogfile` в тексте превью (нет реального пути во временном каталоге). */
  twoPassPasslogPlaceholder?: string | null
  /** Плейсхолдер вывода 1-го прохода (строго текст для UI). */
  twoPassDiscardPlaceholder?: string | null
  /** §7.2 — те же доп. поля, что и в реальном spawn (см. `buildFfmpegExportArgv`). */
  audioGainDb?: number | null
  stripMetadata?: boolean
  stripChapters?: boolean
  subtitleMode?: FfmpegExportSubtitleModeId
  videoDenoise?: FfmpegExportVideoDenoiseId
  videoSharpen?: FfmpegExportVideoSharpenId
  videoDeband?: FfmpegExportVideoDebandId
  videoHisteq?: FfmpegExportVideoHisteqId
  /** §7.2 — как в `buildFfmpegExportArgv`: путь к `.cube` с main (`resolveFfmpegExportLutCubeAbsPath`). */
  videoLut3dCubeAbsPath?: string | null
  videoEqPreset?: FfmpegExportVideoEqPresetId
  videoHue?: FfmpegExportVideoHueId
  videoGrain?: FfmpegExportVideoGrainId
  videoVignette?: FfmpegExportVideoVignetteId
  videoBlur?: FfmpegExportVideoBlurId
  videoDeinterlace?: FfmpegExportVideoDeinterlaceId
  audioNormalize?: FfmpegExportAudioNormalizeId
}

export interface FfmpegExportPreviewResult {
  argv: string[]
  /** Готовая строка для UI: `ffmpeg <argv>` (обычно второй проход или один проход без анализа). */
  command: string
  /** Совпадает с `applyTrim`, который реально пошёл в argv; UI использует для подсказок. */
  appliedTrim: boolean
  /** Если задан — первая команда двухпрохода (видеостатистика в null-sink). */
  pass1Command?: string
}

/**
 * Возвращает argv и человекочитаемое превью команды ffmpeg для текущих настроек.
 *
 * Маркеры/пути в argv для preview сознательно не валидируются: это «как бы» команда,
 * фактический spawn проходит отдельный путь `runFfmpegExportJob` с уже проверенными путями.
 */
export function buildFfmpegExportPreviewCommand(
  input: FfmpegExportPreviewInput
): FfmpegExportPreviewResult {
  const inputPath =
    typeof input.inputPath === 'string' && input.inputPath.trim().length > 0
      ? input.inputPath.trim()
      : '<input>'
  const outputPath =
    typeof input.outputPath === 'string' && input.outputPath.trim().length > 0
      ? input.outputPath.trim()
      : '<output>'
  const probeDurationSec =
    typeof input.probeDurationSec === 'number' && Number.isFinite(input.probeDurationSec)
      ? input.probeDurationSec
      : null
  const trim = input.trim ?? undefined
  // По умолчанию повторяем логику main-сервиса; явный applyTrim=false уважаем (UI может выключить превью маркеров).
  const computedApply = shouldApplyFfmpegExportTrim(trim ?? null, probeDurationSec)
  const applyTrim = input.applyTrim === false ? false : computedApply

  const passlogPlaceholder =
    typeof input.twoPassPasslogPlaceholder === 'string' &&
    input.twoPassPasslogPlaceholder.trim() !== ''
      ? input.twoPassPasslogPlaceholder.trim()
      : '<passlog>'
  const discardPlaceholder =
    typeof input.twoPassDiscardPlaceholder === 'string' &&
    input.twoPassDiscardPlaceholder.trim() !== ''
      ? input.twoPassDiscardPlaceholder.trim()
      : '<discard>'
  const vcodec: FfmpegExportVideoCodecId = input.videoCodec ?? 'libx264'
  const useTwoPass = input.twoPass === true && input.videoBitrate !== null && vcodec === 'libx264'

  const baseArgvParams = {
    inputPath,
    outputPath,
    ...(trim !== undefined ? { trim } : {}),
    applyTrim,
    ...(input.container !== undefined ? { container: input.container } : {}),
    encodePreset: input.encodePreset,
    ...(vcodec !== 'libx264' ? { videoCodec: vcodec } : {}),
    crf: input.crf,
    videoBitrate: input.videoBitrate,
    audioMode: input.audioMode,
    audioBitrate: input.audioBitrate,
    fps: input.fps,
    scalePreset: input.scalePreset,
    ...(input.videoTransform !== undefined ? { videoTransform: input.videoTransform } : {}),
    ...(input.cropPreset !== undefined ? { cropPreset: input.cropPreset } : {}),
    ...(input.audioGainDb !== undefined ? { audioGainDb: input.audioGainDb } : {}),
    ...(input.stripMetadata === true ? { stripMetadata: true } : {}),
    ...(input.stripChapters === true ? { stripChapters: true } : {}),
    ...(input.subtitleMode !== undefined ? { subtitleMode: input.subtitleMode } : {}),
    ...(input.videoDenoise !== undefined ? { videoDenoise: input.videoDenoise } : {}),
    ...(input.videoDeband !== undefined ? { videoDeband: input.videoDeband } : {}),
    ...(input.videoHisteq !== undefined ? { videoHisteq: input.videoHisteq } : {}),
    ...(typeof input.videoLut3dCubeAbsPath === 'string' && input.videoLut3dCubeAbsPath.trim() !== ''
      ? { videoLut3dCubeAbsPath: input.videoLut3dCubeAbsPath.trim() }
      : {}),
    ...(input.videoSharpen !== undefined ? { videoSharpen: input.videoSharpen } : {}),
    ...(input.videoEqPreset !== undefined ? { videoEqPreset: input.videoEqPreset } : {}),
    ...(input.videoHue !== undefined ? { videoHue: input.videoHue } : {}),
    ...(input.videoGrain !== undefined ? { videoGrain: input.videoGrain } : {}),
    ...(input.videoVignette !== undefined ? { videoVignette: input.videoVignette } : {}),
    ...(input.videoBlur !== undefined ? { videoBlur: input.videoBlur } : {}),
    ...(input.videoDeinterlace !== undefined ? { videoDeinterlace: input.videoDeinterlace } : {}),
    ...(input.audioNormalize !== undefined ? { audioNormalize: input.audioNormalize } : {}),
    ...(input.economyMode === true ? { economyMode: true } : {}),
    ...(typeof input.hwaccelDecode === 'string' && input.hwaccelDecode.trim() !== ''
      ? { hwaccelDecode: input.hwaccelDecode.trim() }
      : {}),
    ...(input.extraArgs !== undefined && input.extraArgs.length > 0
      ? { extraArgs: input.extraArgs }
      : {})
  }

  let pass1Command: string | undefined
  if (useTwoPass) {
    const argv1 = buildFfmpegExportArgv({
      ...baseArgvParams,
      twoPass: { pass: 1, passlogfile: passlogPlaceholder, nullDevice: discardPlaceholder }
    })
    pass1Command = `ffmpeg ${formatFfmpegArgvForPreview(argv1)}`
  }

  const argv2 = buildFfmpegExportArgv({
    ...baseArgvParams,
    ...(useTwoPass
      ? {
          twoPass: { pass: 2, passlogfile: passlogPlaceholder, nullDevice: discardPlaceholder }
        }
      : {})
  })

  return {
    argv: argv2,
    command: `ffmpeg ${formatFfmpegArgvForPreview(argv2)}`,
    appliedTrim: applyTrim,
    ...(pass1Command !== undefined ? { pass1Command } : {})
  }
}

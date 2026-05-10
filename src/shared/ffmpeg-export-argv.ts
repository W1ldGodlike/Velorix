/**
 * §7.2 — чистая сборка argv ffmpeg-экспорта без shell-строк и Node-зависимостей.
 *
 * Эти хелперы безопасно вызывать и из main-сервиса (`runFfmpegExportJob`), и из renderer
 * для live preview команды §7.2. Логика валидации параметров остаётся в main
 * (`parseFfmpegExport*`): сюда приходят только уже нормализованные значения.
 */

import type {
  FfmpegExportAudioModeId,
  FfmpegExportContainerId,
  FfmpegExportEncodePresetId,
  FfmpegExportScalePresetId,
  MediaExportTrimPayload
} from './ffmpeg-export-contract'

/**
 * §7.2 — решает, нужно ли подставлять `-ss/-t` для пары маркеров.
 *
 * Используется и main-сервисом (фактический spawn ffmpeg), и live preview команды,
 * чтобы показанные argv совпадали с тем, что реально пошло бы в ffmpeg при экспорте.
 * Маркеры игнорируются, если диапазон вырожден (≤0.05 с) или почти полностью покрывает
 * длительность — тогда быстрее закодировать без `-ss/-t` и без отдельного seek по ключевым кадрам.
 */
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

/** scale-фильтр для пресета §7.2; `source` — без масштабирования. */
export function resolveFfmpegExportScaleFilter(preset: FfmpegExportScalePresetId): string | null {
  switch (preset) {
    case '480p':
      return 'scale=-2:480'
    case '720p':
      return 'scale=-2:720'
    case '1080p':
      return 'scale=-2:1080'
    default:
      return null
  }
}

export interface FfmpegExportArgvParams {
  inputPath: string
  outputPath: string
  /** Контейнер выхода §7.2: для MKV не добавляем `-movflags +faststart` (muxer matroska). */
  container?: FfmpegExportContainerId
  /** Если `applyTrim=false`, маркеры игнорируются (например, диапазон совпал с длительностью). */
  trim?: MediaExportTrimPayload
  applyTrim: boolean
  encodePreset: FfmpegExportEncodePresetId
  /** Если `null` — берётся CRF из системного пресета §7.2. */
  crf: number | null
  /** Если непусто — заменяет CRF mode на bitrate mode (`-b:v`). */
  videoBitrate: string | null
  audioMode: FfmpegExportAudioModeId
  /** Уже нормализованный токен (`192k`); используется только при `audioMode='aac'`. */
  audioBitrate: string
  /** Если `null` — частота кадров оставляется исходной. */
  fps: number | null
  scalePreset: FfmpegExportScalePresetId
}

/** Полный argv ffmpeg без пути к exe; используется и runner, и preview UI. */
export function buildFfmpegExportArgv(params: FfmpegExportArgvParams): string[] {
  const container: FfmpegExportContainerId = params.container ?? 'mp4'
  const enc = resolveFfmpegExportEncodeParams(params.encodePreset)
  const crf = params.crf === null ? enc.crf : String(params.crf)
  const filters: string[] = []
  const scale = resolveFfmpegExportScaleFilter(params.scalePreset)
  if (scale !== null) {
    filters.push(scale)
  }
  if (params.fps !== null) {
    filters.push(`fps=${params.fps}`)
  }
  const args = ['-y', '-hide_banner', '-loglevel', 'info', '-stats']
  if (params.applyTrim && params.trim) {
    args.push(
      '-ss',
      String(params.trim.inSec),
      '-i',
      params.inputPath,
      '-t',
      String(params.trim.outSec - params.trim.inSec)
    )
  } else {
    args.push('-i', params.inputPath)
  }
  args.push('-c:v', 'libx264', '-preset', enc.x264preset)
  if (params.videoBitrate === null) {
    args.push('-crf', crf)
  } else {
    args.push('-b:v', params.videoBitrate)
  }
  args.push('-pix_fmt', 'yuv420p')
  if (filters.length > 0) {
    args.push('-vf', filters.join(','))
  }
  if (params.audioMode === 'none') {
    args.push('-an')
  } else {
    args.push('-c:a', 'aac', '-b:a', params.audioBitrate)
  }
  /** `-movflags +faststart` относится к MP4/MOV; для MKV (Matroska) эти флаги не применяются. */
  if (container === 'mkv') {
    args.push(params.outputPath)
  } else {
    args.push('-movflags', '+faststart', params.outputPath)
  }
  return args
}

/**
 * Человекочитаемая строка argv для UI: токены с пробелами или кавычками
 * заворачиваются в двойные кавычки. НЕ использовать в shell — только для отображения.
 */
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
  /** Совпадает с выбором контейнера в toolbar §7.2; по умолчанию mp4. */
  container?: FfmpegExportContainerId
  crf: number | null
  videoBitrate: string | null
  audioMode: FfmpegExportAudioModeId
  audioBitrate: string
  fps: number | null
  scalePreset: FfmpegExportScalePresetId
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
}

export interface FfmpegExportPreviewResult {
  argv: string[]
  /** Готовая строка для UI: `ffmpeg <argv>`. */
  command: string
  /** Совпадает с `applyTrim`, который реально пошёл в argv; UI использует для подсказок. */
  appliedTrim: boolean
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

  const argv = buildFfmpegExportArgv({
    inputPath,
    outputPath,
    ...(trim !== undefined ? { trim } : {}),
    applyTrim,
    ...(input.container !== undefined ? { container: input.container } : {}),
    encodePreset: input.encodePreset,
    crf: input.crf,
    videoBitrate: input.videoBitrate,
    audioMode: input.audioMode,
    audioBitrate: input.audioBitrate,
    fps: input.fps,
    scalePreset: input.scalePreset
  })

  return {
    argv,
    command: `ffmpeg ${formatFfmpegArgvForPreview(argv)}`,
    appliedTrim: applyTrim
  }
}

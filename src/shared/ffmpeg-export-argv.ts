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
  FfmpegExportCropPresetId,
  FfmpegExportEncodePresetId,
  FfmpegExportScalePresetId,
  FfmpegExportSubtitleModeId,
  FfmpegExportVideoTransformId,
  MediaExportTrimPayload
} from './ffmpeg-export-contract'
import {
  FFMPEG_EXPORT_AUDIO_GAIN_DB_MAX,
  FFMPEG_EXPORT_AUDIO_GAIN_DB_MIN
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

/**
 * §7.2 — фрагменты `-vf` для поворота/зеркала (строго whitelist), до `scale` и `fps`.
 * `transpose`: 1 = по часовой 90°, 2 = против часовой 90°; дважды 1 = 180°.
 */
export function resolveFfmpegExportVideoTransformFilters(
  id: FfmpegExportVideoTransformId
): string[] {
  switch (id) {
    case 'cw90':
      return ['transpose=1']
    case 'ccw90':
      return ['transpose=2']
    case 'r180':
      return ['transpose=1', 'transpose=1']
    case 'hflip':
      return ['hflip']
    case 'vflip':
      return ['vflip']
    default:
      return []
  }
}

/**
 * §7.2 — целочисленный сдвиг громкости в дБ для `-filter:a volume`.
 *
 * `null`/`0`/нечисловое значение → фильтр не нужен (без `-filter:a`).
 * Дробные доли не поддерживаем сознательно: UI ограничен пресетами по 3 дБ,
 * чтобы пользователь не пересылал в spawn неконтролируемые строки.
 */
export function normalizeFfmpegExportAudioGainDb(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null
  }
  const n =
    typeof value === 'number'
      ? value
      : typeof value === 'string' && value.trim() !== ''
        ? Number(value.trim())
        : NaN
  if (!Number.isInteger(n) || n < FFMPEG_EXPORT_AUDIO_GAIN_DB_MIN || n > FFMPEG_EXPORT_AUDIO_GAIN_DB_MAX) {
    return null
  }
  if (n === 0) {
    return null
  }
  return n
}

/**
 * §7.2 — кодек субтитров для контейнера при `subtitleMode='copy'`.
 *
 * MKV принимает большинство форматов через `-c:s copy`. Для MP4/MOV ffmpeg позволяет
 * хранить только `mov_text`, поэтому при копировании в эти контейнеры приходится
 * перепаковывать в текстовые субтитры; bitmap-субы при этом не пройдут — это известный
 * лимит контейнера, не нашего кода.
 */
export function resolveFfmpegExportSubtitleCopyCodec(
  container: FfmpegExportContainerId
): 'copy' | 'mov_text' {
  return container === 'mkv' ? 'copy' : 'mov_text'
}

/**
 * §7.2 — crop-пресеты через безопасный whitelist выражений ffmpeg.
 * Порядок в `-vf`: transform → crop → scale → fps.
 */
export function resolveFfmpegExportCropFilter(id: FfmpegExportCropPresetId): string | null {
  switch (id) {
    case 'center-square':
      return 'crop=min(iw\\,ih):min(iw\\,ih)'
    case 'center-16-9':
      return 'crop=min(iw\\,ih*16/9):min(ih\\,iw*9/16)'
    case 'center-4-3':
      return 'crop=min(iw\\,ih*4/3):min(ih\\,iw*3/4)'
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
  /** До масштабирования и fps; по умолчанию без трансформа. */
  videoTransform?: FfmpegExportVideoTransformId
  /** После transform и до scale/fps; по умолчанию без crop. */
  cropPreset?: FfmpegExportCropPresetId
  /**
   * Двухпроход libx264 §7.2 / v0 — только при ненулевом `videoBitrate` (без CRF).
   * Проход 1: `-an`, вывод в `nullDevice`; проход 2: обычный звук и `outputPath`.
   */
  twoPass?: { pass: 1 | 2; passlogfile: string; nullDevice: string }
  /**
   * §7.2 — сдвиг громкости в дБ. `null`/`0` — без `-filter:a`. При `audioMode='none'`
   * параметр игнорируется (нет звука, фильтр некуда применять).
   */
  audioGainDb?: number | null
  /** §7.2 — добавить `-map_metadata -1` (удалить metadata глобально). */
  stripMetadata?: boolean
  /** §7.2 — добавить `-map_chapters -1` (удалить главы). */
  stripChapters?: boolean
  /**
   * §7.2 — поведение субтитров. По умолчанию `drop` — argv не меняется (как было до правки).
   * `copy` добавляет `-c:s copy` (MKV) или `-c:s mov_text` (MP4/MOV) и явно маппит дорожки.
   */
  subtitleMode?: FfmpegExportSubtitleModeId
}

/** Полный argv ffmpeg без пути к exe; используется и runner, и preview UI. */
export function buildFfmpegExportArgv(params: FfmpegExportArgvParams): string[] {
  const container: FfmpegExportContainerId = params.container ?? 'mp4'
  const enc = resolveFfmpegExportEncodeParams(params.encodePreset)
  const crf = params.crf === null ? enc.crf : String(params.crf)
  const filters: string[] = []
  const transform = resolveFfmpegExportVideoTransformFilters(params.videoTransform ?? 'none')
  filters.push(...transform)
  const crop = resolveFfmpegExportCropFilter(params.cropPreset ?? 'none')
  if (crop !== null) {
    filters.push(crop)
  }
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
  if (params.stripMetadata === true) {
    args.push('-map_metadata', '-1')
  }
  if (params.stripChapters === true) {
    args.push('-map_chapters', '-1')
  }

  args.push('-c:v', 'libx264', '-preset', enc.x264preset)

  const tp = params.twoPass
  if (tp) {
    if (params.videoBitrate === null) {
      throw new Error('two-pass требует videoBitrate')
    }
    args.push('-b:v', params.videoBitrate)
    args.push('-pass', String(tp.pass))
    args.push('-passlogfile', tp.passlogfile)
  } else if (params.videoBitrate === null) {
    args.push('-crf', crf)
  } else {
    args.push('-b:v', params.videoBitrate)
  }

  args.push('-pix_fmt', 'yuv420p')
  if (filters.length > 0) {
    args.push('-vf', filters.join(','))
  }

  if (tp?.pass === 1) {
    /** Первый проход только подбирает статистику видео; звук отключаем, файл выбрасываем в null-sink. */
    args.push('-an')
    args.push('-f', 'mp4', tp.nullDevice)
    return args
  }

  const gainDb =
    params.audioMode === 'none' ? null : normalizeFfmpegExportAudioGainDb(params.audioGainDb)
  if (params.audioMode === 'none') {
    args.push('-an')
  } else {
    args.push('-c:a', 'aac', '-b:a', params.audioBitrate)
    if (gainDb !== null) {
      // -filter:a применяется только к аудио потоку; -af применяется и к input filter chain,
      // но фактически в нашем шаблоне они эквивалентны. Используем явное :a, чтобы было видно,
      // что фильтр привязан к аудио и не задевает -vf.
      args.push('-filter:a', `volume=${gainDb}dB`)
    }
  }

  // §7.2 — субтитры. По умолчанию (`drop` / undefined) argv не трогаем: ffmpeg сам решает
  // по дефолтному mapping, обычно не таскает subs из MKV в MP4. При `copy` явно маппим и
  // подбираем кодек контейнера, чтобы не ломать стандартный путь через -c:v / -c:a.
  if (params.subtitleMode === 'copy') {
    const subCodec = resolveFfmpegExportSubtitleCopyCodec(container)
    args.push('-map', '0:v?', '-map', '0:a?', '-map', '0:s?', '-c:s', subCodec)
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
  /** Плейсхолдер `-passlogfile` в тексте превью (нет реального пути во временном каталоге). */
  twoPassPasslogPlaceholder?: string | null
  /** Плейсхолдер вывода 1-го прохода (строго текст для UI). */
  twoPassDiscardPlaceholder?: string | null
  /** §7.2 — те же доп. поля, что и в реальном spawn (см. `buildFfmpegExportArgv`). */
  audioGainDb?: number | null
  stripMetadata?: boolean
  stripChapters?: boolean
  subtitleMode?: FfmpegExportSubtitleModeId
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
  const useTwoPass = input.twoPass === true && input.videoBitrate !== null

  const baseArgvParams = {
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
    scalePreset: input.scalePreset,
    ...(input.videoTransform !== undefined ? { videoTransform: input.videoTransform } : {}),
    ...(input.cropPreset !== undefined ? { cropPreset: input.cropPreset } : {}),
    ...(input.audioGainDb !== undefined ? { audioGainDb: input.audioGainDb } : {}),
    ...(input.stripMetadata === true ? { stripMetadata: true } : {}),
    ...(input.stripChapters === true ? { stripChapters: true } : {}),
    ...(input.subtitleMode !== undefined ? { subtitleMode: input.subtitleMode } : {})
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

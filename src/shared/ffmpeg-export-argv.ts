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
  FfmpegExportVideoDebandId,
  FfmpegExportVideoDenoiseId,
  FfmpegExportVideoEqPresetId,
  FfmpegExportVideoSharpenId,
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
 * §7.2 — фрагмент `hqdn3d` для пресета шумоподавления; `off` → `null`.
 *
 * Параметры (luma_spatial : chroma_spatial : luma_tmp : chroma_tmp) подобраны от
 * мягкого временного денойза к выраженному; пользовательские строки фильтра
 * сознательно не принимаем — только белый список, чтобы spawn не получал произвольный `-vf`.
 */
export function resolveFfmpegExportVideoDenoiseFilter(
  id: FfmpegExportVideoDenoiseId
): string | null {
  switch (id) {
    case 'light':
      return 'hqdn3d=1.5:1.5:6:6'
    case 'medium':
      return 'hqdn3d=3:3:6:6'
    case 'strong':
      return 'hqdn3d=5:5:10:10'
    default:
      return null
  }
}

/**
 * §7.2 — фрагмент `unsharp` для пресета резкости; `off` → `null`.
 *
 * Шаблон unsharp: `lx:ly:la:cx:cy:ca` (luma size + amount, chroma size + amount).
 * Лёгкая ступень умышленно даёт амплитуду ~0.6, чтобы не «звенели» края.
 */
export function resolveFfmpegExportVideoSharpenFilter(
  id: FfmpegExportVideoSharpenId
): string | null {
  switch (id) {
    case 'light':
      return 'unsharp=5:5:0.6:5:5:0.0'
    case 'medium':
      return 'unsharp=5:5:1.0:5:5:0.0'
    case 'strong':
      return 'unsharp=7:7:1.5:7:7:0.0'
    default:
      return null
  }
}

/**
 * §7.2 — пресет `deband` (сглаживание полос/ступеней); `off` → `null`.
 * Параметр `range` — радиус поиска полосы в пикселях (см. `ffmpeg -h filter=deband`).
 */
export function resolveFfmpegExportVideoDebandFilter(
  id: FfmpegExportVideoDebandId
): string | null {
  switch (id) {
    case 'light':
      return 'deband=range=12'
    case 'medium':
      return 'deband=range=20'
    case 'strong':
      return 'deband=range=28'
    default:
      return null
  }
}

/**
 * §7.2 — экранирование абсолютного пути для `file='…'` внутри `-vf`
 * (Windows: `C:/…` → `C\:/…`, апострофы).
 */
export function escapeFilePathForFfmpegFilter(path: string): string {
  return path.replace(/\\/g, '/').replace(/:/g, '\\:').replace(/'/g, "\\'")
}

/** §7.2 — фрагмент `lut3d` для bundled `.cube`; путь уже проверен на стороне main. */
export function buildFfmpegExportLut3dFilter(cubeFileAbsPath: string): string {
  const esc = escapeFilePathForFfmpegFilter(cubeFileAbsPath.trim())
  return `lut3d=file='${esc}':interp=trilinear`
}

/**
 * §7.2 — пресет `eq=` (контраст/насыщенность); whitelist выражений ffmpeg.
 *
 * Значения подобраны умеренно (контраст в окрестности 1.0, насыщенность в 0.85…1.2),
 * чтобы пресет не вызывал клиппинг или явное искажение цвета. Произвольные значения
 * пользователь задавать не может — это сознательное упрощение §7.2.
 */
export function resolveFfmpegExportVideoEqFilter(
  id: FfmpegExportVideoEqPresetId
): string | null {
  switch (id) {
    case 'warm':
      return 'eq=contrast=1.05:saturation=1.10'
    case 'cool':
      return 'eq=contrast=1.00:saturation=0.92'
    case 'vivid':
      return 'eq=contrast=1.10:saturation=1.20'
    case 'flat':
      return 'eq=contrast=0.95:saturation=0.85'
    default:
      return null
  }
}

/**
 * §7.2 — пресет нормализации громкости. Подбор параметров:
 * - `loudnorm=I=-16:LRA=11:TP=-1.5` — типовая цель EBU R128 для подкастов/видео,
 *   single-pass (двухпроходный анализ — отдельный сценарий, не делаем здесь).
 * - `dynaudnorm=f=200:g=15` — динамическая нормализация по окну 200 ms, окно gain 15.
 *
 * Кастомные строки в spawn не отдаём — только whitelist. Применяется только при
 * включённом аудио (`audioMode='aac'`) и только во втором/одиночном проходе.
 */
export function resolveFfmpegExportAudioNormalizeFilter(
  id: FfmpegExportAudioNormalizeId
): string | null {
  switch (id) {
    case 'loudnorm':
      return 'loudnorm=I=-16:LRA=11:TP=-1.5'
    case 'dynaudnorm':
      return 'dynaudnorm=f=200:g=15'
    default:
      return null
  }
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
  /** §7.2 — `hqdn3d` denoise; `off` или undefined — без фильтра. */
  videoDenoise?: FfmpegExportVideoDenoiseId
  /** §7.2 — `unsharp` контурная резкость; `off` или undefined — без фильтра. */
  videoSharpen?: FfmpegExportVideoSharpenId
  /** §7.2 — `deband`; `off` или undefined — без фильтра. */
  videoDeband?: FfmpegExportVideoDebandId
  /**
   * §7.2 — абсолютный путь к bundled `.cube` для `lut3d`; не задан или пустой — без фильтра.
   * Подставляет main после `existsSync` в `resources/luts/`.
   */
  videoLut3dCubeAbsPath?: string | null
  /** §7.2 — `eq=...` цветокор-пресет; `off` или undefined — без фильтра. */
  videoEqPreset?: FfmpegExportVideoEqPresetId
  /**
   * §7.2 — `loudnorm`/`dynaudnorm`; `off` или undefined — без нормализации.
   * При `audioMode='none'` или в первом проходе двухпроходного режима игнорируется
   * (там нет аудио, фильтр не применяется).
   */
  audioNormalize?: FfmpegExportAudioNormalizeId
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
  // §7.2 — `eq` после sharpen и до `scale`, чтобы фильтры цвета работали уже по
  // отфильтрованной картинке, а scale не перекрывал коррекцию насыщенности.
  const eq = resolveFfmpegExportVideoEqFilter(params.videoEqPreset ?? 'off')
  if (eq !== null) {
    filters.push(eq)
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
  const normalizeFilter =
    params.audioMode === 'none'
      ? null
      : resolveFfmpegExportAudioNormalizeFilter(params.audioNormalize ?? 'off')
  if (params.audioMode === 'none') {
    args.push('-an')
  } else {
    args.push('-c:a', 'aac', '-b:a', params.audioBitrate)
    // -filter:a применяется только к аудио потоку; -af применяется и к input filter chain,
    // но фактически в нашем шаблоне они эквивалентны. Используем явное :a, чтобы было видно,
    // что фильтр привязан к аудио и не задевает -vf. Громкость идёт первой, нормализация
    // последней: loudnorm/dynaudnorm всё равно выровняют итог, но volume в начале даёт
    // более предсказуемое поведение, чем post-normalize gain (который бы «уплыл» сразу).
    const audioFilters: string[] = []
    if (gainDb !== null) {
      audioFilters.push(`volume=${gainDb}dB`)
    }
    if (normalizeFilter !== null) {
      audioFilters.push(normalizeFilter)
    }
    if (audioFilters.length > 0) {
      args.push('-filter:a', audioFilters.join(','))
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
  videoDenoise?: FfmpegExportVideoDenoiseId
  videoSharpen?: FfmpegExportVideoSharpenId
  videoDeband?: FfmpegExportVideoDebandId
  /** §7.2 — как в `buildFfmpegExportArgv`: путь к `.cube` с main (`resolveFfmpegExportLutCubeAbsPath`). */
  videoLut3dCubeAbsPath?: string | null
  videoEqPreset?: FfmpegExportVideoEqPresetId
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
    ...(input.subtitleMode !== undefined ? { subtitleMode: input.subtitleMode } : {}),
    ...(input.videoDenoise !== undefined ? { videoDenoise: input.videoDenoise } : {}),
    ...(input.videoDeband !== undefined ? { videoDeband: input.videoDeband } : {}),
    ...(typeof input.videoLut3dCubeAbsPath === 'string' && input.videoLut3dCubeAbsPath.trim() !== ''
      ? { videoLut3dCubeAbsPath: input.videoLut3dCubeAbsPath.trim() }
      : {}),
    ...(input.videoSharpen !== undefined ? { videoSharpen: input.videoSharpen } : {}),
    ...(input.videoEqPreset !== undefined ? { videoEqPreset: input.videoEqPreset } : {}),
    ...(input.audioNormalize !== undefined ? { audioNormalize: input.audioNormalize } : {})
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

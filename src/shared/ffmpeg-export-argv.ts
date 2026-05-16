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
import {
  FFMPEG_EXPORT_AUDIO_GAIN_DB_MAX,
  FFMPEG_EXPORT_AUDIO_GAIN_DB_MIN
} from './ffmpeg-export-contract'
import { appendFfmpegExportExtraArgsToArgv } from './ffmpeg-export-extra-args'
import { appendFfmpegHwaccelBeforeInput } from './ffmpeg-export-hw-decode'
import { prependHwEncoderUploadToVideoFilters } from './ffmpeg-export-vaapi-vf'
import type { FfmpegHwVideoEncoderId } from './ffmpeg-hw-encoder-probe'
import {
  exportAudioModeMkvOnlyErrorMessage,
  ffmpegExportAudioModeAllowsFilters,
  ffmpegExportAudioModeRequiresMkv
} from './ffmpeg-export-audio-mode'
import {
  cpuFfmpegVideoCodecRequiresMkv,
  exportCpuCodecMkvOnlyErrorMessage,
  exportMovOnlyCodecErrorMessage,
  ffmpegExportVideoCodecRequiresMov,
  isFfmpegHwExportVideoCodec
} from './ffmpeg-export-video-codec'

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
  if (
    !Number.isInteger(n) ||
    n < FFMPEG_EXPORT_AUDIO_GAIN_DB_MIN ||
    n > FFMPEG_EXPORT_AUDIO_GAIN_DB_MAX
  ) {
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
export function resolveFfmpegExportVideoDebandFilter(id: FfmpegExportVideoDebandId): string | null {
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
 * §7.2 — пресет `histeq` (глобальное выравнивание гистограммы); `off` → `null`.
 * Параметр `strength` — доля эквализации (0…1); только whitelist.
 */
export function resolveFfmpegExportVideoHisteqFilter(id: FfmpegExportVideoHisteqId): string | null {
  switch (id) {
    case 'light':
      return 'histeq=strength=0.14'
    case 'medium':
      return 'histeq=strength=0.26'
    case 'strong':
      return 'histeq=strength=0.40'
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
export function resolveFfmpegExportVideoEqFilter(id: FfmpegExportVideoEqPresetId): string | null {
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

/** §7.2 — пресет `hue` (сдвиг фазы / насыщенности); `off` → `null`; только whitelist. */
export function resolveFfmpegExportVideoHueFilter(id: FfmpegExportVideoHueId): string | null {
  switch (id) {
    case 'warmShift':
      return 'hue=h=-11:s=1.03'
    case 'coolShift':
      return 'hue=h=13:s=1.03'
    case 'satBoost':
      return 'hue=h=0:s=1.16'
    default:
      return null
  }
}

/**
 * §7.2 — пресет `noise` (лёгкая зернистость); `off` → `null`.
 * `alls` — сила по всем компонентам; `allf=u` — равномерный шум (без отдельных «паттернов»).
 */
export function resolveFfmpegExportVideoGrainFilter(id: FfmpegExportVideoGrainId): string | null {
  switch (id) {
    case 'light':
      return 'noise=alls=2:allf=u'
    case 'medium':
      return 'noise=alls=5:allf=u'
    case 'strong':
      return 'noise=alls=9:allf=u'
    default:
      return null
  }
}

/** §7.2 — пресет `vignette` (затемнение к краям); `off` → `null`. */
export function resolveFfmpegExportVideoVignetteFilter(
  id: FfmpegExportVideoVignetteId
): string | null {
  switch (id) {
    case 'light':
      return 'vignette=angle=PI/3'
    case 'medium':
      return 'vignette=angle=PI/5'
    case 'strong':
      return 'vignette=angle=PI/10'
    default:
      return null
  }
}

/** §7.2 — пресет `gblur` (Gaussian blur); `off` → `null`. */
export function resolveFfmpegExportVideoBlurFilter(id: FfmpegExportVideoBlurId): string | null {
  switch (id) {
    case 'light':
      return 'gblur=sigma=1'
    case 'medium':
      return 'gblur=sigma=2.5'
    case 'strong':
      return 'gblur=sigma=5'
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

/** §7.2 — whitelist `yadif`; `off` → `null`. */
export function resolveFfmpegExportVideoDeinterlaceFilter(
  id: FfmpegExportVideoDeinterlaceId
): string | null {
  switch (id) {
    case 'frame':
      return 'yadif'
    case 'field':
      return 'yadif=mode=send_field'
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
  /** §7.2 — по умолчанию `libx264`. */
  videoCodec?: FfmpegExportVideoCodecId
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
  /** §7.3 — ограничить ffmpeg одним потоком (`-threads 1`). */
  economyMode?: boolean
  /** §7.2 — `-hwaccel` перед входом (уже разрешённый метод, см. `resolveFfmpegExportHwaccelForDecode`). */
  hwaccelDecode?: string | null
  /** §7.2 — доп. токены перед выходным файлом (уже разобранные `parseFfmpegExportExtraArgsLine`). */
  extraArgs?: readonly string[]
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
  /** §7.2 — `histeq` после deband и до lut3d; `off` или undefined — без фильтра. */
  videoHisteq?: FfmpegExportVideoHisteqId
  /**
   * §7.2 — абсолютный путь к bundled `.cube` для `lut3d`; не задан или пустой — без фильтра.
   * Подставляет main после `existsSync` в `resources/luts/`.
   */
  videoLut3dCubeAbsPath?: string | null
  /** §7.2 — `eq=...` цветокор-пресет; `off` или undefined — без фильтра. */
  videoEqPreset?: FfmpegExportVideoEqPresetId
  /** §7.2 — `hue` после `eq`; `off` или undefined — без фильтра. */
  videoHue?: FfmpegExportVideoHueId
  /** §7.2 — `noise` зернистость; `off` или undefined — без фильтра. */
  videoGrain?: FfmpegExportVideoGrainId
  /** §7.2 — `vignette`; `off` или undefined — без фильтра. */
  videoVignette?: FfmpegExportVideoVignetteId
  /** §7.2 — `gblur`; `off` или undefined — без фильтра. */
  videoBlur?: FfmpegExportVideoBlurId
  /** §7.2 — `yadif` после crop и до denoise; `off` или undefined — без фильтра. */
  videoDeinterlace?: FfmpegExportVideoDeinterlaceId
  /**
   * §7.2 — `loudnorm`/`dynaudnorm`; `off` или undefined — без нормализации.
   * При `audioMode='none'` или в первом проходе двухпроходного режима игнорируется
   * (там нет аудио, фильтр не применяется).
   */
  audioNormalize?: FfmpegExportAudioNormalizeId
}

/** §16 — rate control для whitelist HW-кодеков (без произвольных `-c:v`). */
function appendFfmpegHwEncoderRateArgs(
  args: string[],
  vcodec: FfmpegHwVideoEncoderId,
  encodePreset: FfmpegExportEncodePresetId,
  crf: string,
  videoBitrate: string | null
): void {
  const cq = (() => {
    const n = parseInt(crf, 10)
    return Number.isFinite(n) ? Math.min(51, Math.max(0, n)) : 23
  })()
  const nvLikePreset =
    encodePreset === 'smaller' ? 'fast' : encodePreset === 'quality' ? 'slow' : 'medium'

  if (vcodec.endsWith('_nvenc')) {
    args.push('-preset', nvLikePreset, '-rc:v', 'vbr')
    if (videoBitrate === null) {
      args.push('-cq:v', String(cq))
    } else {
      args.push('-b:v', videoBitrate)
    }
    return
  }
  if (vcodec.endsWith('_amf')) {
    const q =
      encodePreset === 'smaller' ? 'speed' : encodePreset === 'quality' ? 'quality' : 'balanced'
    args.push('-quality', q)
    if (videoBitrate === null) {
      args.push('-rc', 'cqp', '-qp_i', String(cq), '-qp_p', String(cq), '-qp_b', String(cq))
    } else {
      args.push('-rc', 'vbr_peak', '-b:v', videoBitrate)
    }
    return
  }
  if (vcodec.endsWith('_qsv')) {
    const p =
      encodePreset === 'smaller' ? 'veryfast' : encodePreset === 'quality' ? 'slow' : 'faster'
    args.push('-preset', p)
    if (videoBitrate === null) {
      args.push('-global_quality', String(cq))
    } else {
      args.push('-b:v', videoBitrate)
    }
    return
  }
  if (vcodec.endsWith('_videotoolbox')) {
    const qv = Math.min(100, Math.max(8, Math.round(72 - cq * 0.85)))
    if (videoBitrate === null) {
      args.push('-q:v', String(qv))
    } else {
      args.push('-b:v', videoBitrate)
    }
    return
  }
  if (vcodec.endsWith('_vaapi')) {
    if (videoBitrate === null) {
      args.push('-qp', String(cq))
    } else {
      args.push('-b:v', videoBitrate)
    }
  }
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
  const deint = resolveFfmpegExportVideoDeinterlaceFilter(params.videoDeinterlace ?? 'off')
  if (deint !== null) {
    filters.push(deint)
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
  const histeq = resolveFfmpegExportVideoHisteqFilter(params.videoHisteq ?? 'off')
  if (histeq !== null) {
    filters.push(histeq)
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
  // §7.2 — `eq` после sharpen и до зерна/`scale`, чтобы цветокор шёл по уже отфильтрованной картинке.
  const eq = resolveFfmpegExportVideoEqFilter(params.videoEqPreset ?? 'off')
  if (eq !== null) {
    filters.push(eq)
  }
  const hue = resolveFfmpegExportVideoHueFilter(params.videoHue ?? 'off')
  if (hue !== null) {
    filters.push(hue)
  }
  const grain = resolveFfmpegExportVideoGrainFilter(params.videoGrain ?? 'off')
  if (grain !== null) {
    filters.push(grain)
  }
  const vignette = resolveFfmpegExportVideoVignetteFilter(params.videoVignette ?? 'off')
  if (vignette !== null) {
    filters.push(vignette)
  }
  const blur = resolveFfmpegExportVideoBlurFilter(params.videoBlur ?? 'off')
  if (blur !== null) {
    filters.push(blur)
  }
  const scale = resolveFfmpegExportScaleFilter(params.scalePreset)
  if (scale !== null) {
    filters.push(scale)
  }
  if (params.fps !== null) {
    filters.push(`fps=${params.fps}`)
  }
  const args = ['-y', '-hide_banner', '-loglevel', 'info', '-stats']
  if (params.economyMode === true) {
    args.push('-threads', '1')
  }
  appendFfmpegHwaccelBeforeInput(args, params.hwaccelDecode ?? null)
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

  const vcodec: FfmpegExportVideoCodecId = params.videoCodec ?? 'libx264'
  const audioMode: FfmpegExportAudioModeId = params.audioMode ?? 'aac'
  const tp = params.twoPass
  if (cpuFfmpegVideoCodecRequiresMkv(vcodec) && container !== 'mkv') {
    throw new Error(exportCpuCodecMkvOnlyErrorMessage(vcodec))
  }
  if (ffmpegExportVideoCodecRequiresMov(vcodec) && container !== 'mov') {
    throw new Error(exportMovOnlyCodecErrorMessage(vcodec))
  }
  if (ffmpegExportAudioModeRequiresMkv(audioMode) && container !== 'mkv') {
    throw new Error(exportAudioModeMkvOnlyErrorMessage(audioMode))
  }
  if (isFfmpegHwExportVideoCodec(vcodec)) {
    if (tp) {
      throw new Error('Двухпроходный режим поддерживается только для libx264')
    }
    args.push('-c:v', vcodec)
    appendFfmpegHwEncoderRateArgs(args, vcodec, params.encodePreset, crf, params.videoBitrate)
    if (vcodec.startsWith('hevc_') && (container === 'mp4' || container === 'mov')) {
      args.push('-tag:v', 'hvc1')
    }
  } else if (vcodec === 'libvpx-vp9') {
    if (tp) {
      throw new Error('Двухпроходный режим поддерживается только для libx264')
    }
    args.push('-c:v', 'libvpx-vp9', '-row-mt', '1')
    const cpuUsed =
      params.encodePreset === 'smaller' ? '4' : params.encodePreset === 'quality' ? '0' : '2'
    const deadline =
      params.encodePreset === 'quality'
        ? 'best'
        : params.encodePreset === 'smaller'
          ? 'realtime'
          : 'good'
    args.push('-cpu-used', cpuUsed, '-deadline', deadline)
    if (params.videoBitrate === null) {
      const presetCrf =
        params.encodePreset === 'quality' ? 28 : params.encodePreset === 'smaller' ? 38 : 32
      const crfNum = params.crf === null ? presetCrf : Math.min(63, Math.max(0, params.crf))
      args.push('-crf', String(crfNum))
    } else {
      args.push('-b:v', params.videoBitrate)
    }
  } else if (vcodec === 'libsvtav1') {
    if (tp) {
      throw new Error('Двухпроходный режим поддерживается только для libx264')
    }
    const preset =
      params.encodePreset === 'smaller' ? '12' : params.encodePreset === 'quality' ? '5' : '8'
    args.push('-c:v', 'libsvtav1', '-preset', preset)
    if (params.videoBitrate === null) {
      const presetCrf =
        params.encodePreset === 'quality' ? 26 : params.encodePreset === 'smaller' ? 40 : 32
      const crfNum =
        params.crf === null ? presetCrf : Math.min(63, Math.max(0, Math.floor(params.crf)))
      args.push('-crf', String(crfNum))
    } else {
      args.push('-b:v', params.videoBitrate)
    }
  } else if (vcodec === 'libaom-av1') {
    if (tp) {
      throw new Error('Двухпроходный режим поддерживается только для libx264')
    }
    const cpuUsed =
      params.encodePreset === 'smaller' ? '8' : params.encodePreset === 'quality' ? '2' : '5'
    args.push('-c:v', 'libaom-av1', '-cpu-used', cpuUsed)
    if (params.videoBitrate === null) {
      const presetCrf =
        params.encodePreset === 'quality' ? 28 : params.encodePreset === 'smaller' ? 42 : 32
      const crfNum =
        params.crf === null ? presetCrf : Math.min(63, Math.max(0, Math.floor(params.crf)))
      args.push('-crf', String(crfNum))
    } else {
      args.push('-b:v', params.videoBitrate)
    }
  } else if (vcodec === 'librav1e') {
    if (tp) {
      throw new Error('Двухпроходный режим поддерживается только для libx264')
    }
    const speed =
      params.encodePreset === 'smaller' ? '10' : params.encodePreset === 'quality' ? '4' : '7'
    args.push('-c:v', 'librav1e', '-speed', speed)
    if (params.videoBitrate === null) {
      const presetQp =
        params.encodePreset === 'quality' ? 75 : params.encodePreset === 'smaller' ? 118 : 95
      const qpNum =
        params.crf === null ? presetQp : Math.min(255, Math.max(1, Math.floor(params.crf)))
      args.push('-qp', String(qpNum))
    } else {
      args.push('-b:v', params.videoBitrate)
    }
  } else if (vcodec === 'prores_ks') {
    if (tp) {
      throw new Error('Двухпроходный режим поддерживается только для libx264')
    }
    const profile =
      params.encodePreset === 'smaller' ? '1' : params.encodePreset === 'quality' ? '4' : '3'
    args.push('-c:v', 'prores_ks', '-profile:v', profile, '-vendor', 'apl0')
    if (params.videoBitrate !== null) {
      args.push('-b:v', params.videoBitrate)
    }
  } else if (vcodec === 'dnxhd') {
    if (tp) {
      throw new Error('Двухпроходный режим поддерживается только для libx264')
    }
    const profile =
      params.encodePreset === 'smaller'
        ? 'dnxhr_lb'
        : params.encodePreset === 'quality'
          ? 'dnxhr_hq'
          : 'dnxhr_sq'
    args.push('-c:v', 'dnxhd', '-profile:v', profile)
    if (params.videoBitrate !== null) {
      args.push('-b:v', params.videoBitrate)
    }
  } else if (vcodec === 'ffv1') {
    if (tp) {
      throw new Error('Двухпроходный режим поддерживается только для libx264')
    }
    const level = params.encodePreset === 'smaller' ? '1' : '3'
    const slices = params.encodePreset === 'smaller' ? '24' : '4'
    args.push('-c:v', 'ffv1', '-level', level, '-slicecrc', '1', '-slices', slices)
  } else {
    args.push('-c:v', vcodec, '-preset', enc.x264preset)
    if (vcodec === 'libx265' && (container === 'mp4' || container === 'mov')) {
      args.push('-tag:v', 'hvc1')
    }
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
  }

  if (vcodec !== 'prores_ks' && vcodec !== 'dnxhd') {
    args.push('-pix_fmt', 'yuv420p')
  }
  prependHwEncoderUploadToVideoFilters(filters, vcodec)
  if (filters.length > 0) {
    args.push('-vf', filters.join(','))
  }

  if (tp?.pass === 1) {
    /** Первый проход только подбирает статистику видео; звук отключаем, файл выбрасываем в null-sink. */
    args.push('-an')
    args.push('-f', 'mp4', tp.nullDevice)
    return args
  }

  const gainDb = ffmpegExportAudioModeAllowsFilters(params.audioMode ?? 'aac')
    ? normalizeFfmpegExportAudioGainDb(params.audioGainDb)
    : null
  const normalizeFilter = ffmpegExportAudioModeAllowsFilters(params.audioMode ?? 'aac')
    ? resolveFfmpegExportAudioNormalizeFilter(params.audioNormalize ?? 'off')
    : null
  if (audioMode === 'none') {
    args.push('-an')
  } else {
    if (audioMode === 'copy') {
      args.push('-c:a', 'copy')
    } else if (audioMode === 'pcm_s16le') {
      args.push('-c:a', 'pcm_s16le')
    } else if (audioMode === 'libvorbis') {
      args.push('-c:a', 'libvorbis', '-b:a', params.audioBitrate)
    } else if (audioMode === 'libopus') {
      args.push('-c:a', 'libopus', '-b:a', params.audioBitrate)
    } else if (audioMode === 'flac') {
      args.push('-c:a', 'flac')
    } else if (audioMode === 'alac') {
      args.push('-c:a', 'alac')
    } else if (audioMode === 'libmp3lame') {
      args.push('-c:a', 'libmp3lame', '-b:a', params.audioBitrate)
    } else if (audioMode === 'ac3') {
      args.push('-c:a', 'ac3', '-b:a', params.audioBitrate)
    } else {
      args.push('-c:a', 'aac', '-b:a', params.audioBitrate)
    }
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

  appendFfmpegExportExtraArgsToArgv(args, params.extraArgs ?? [])

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

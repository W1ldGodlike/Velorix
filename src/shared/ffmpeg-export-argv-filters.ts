/**
 * §7.2 — чистая сборка argv ffmpeg-экспорта без shell-строк и Node-зависимостей.
 *
 * Эти хелперы безопасно вызывать и из main-сервиса (`runFfmpegExportJob`), и из renderer
 * для live preview команды §7.2. Логика валидации параметров остаётся в main
 * (`parseFfmpegExport*`): сюда приходят только уже нормализованные значения.
 */

import type {
  FfmpegExportAudioNormalizeId,
  FfmpegExportContainerId,
  FfmpegExportCropPresetId,
  FfmpegExportScalePresetId,
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
  FfmpegExportVideoTransformId
} from './ffmpeg-export-contract'
import {
  FFMPEG_EXPORT_AUDIO_GAIN_DB_MAX,
  FFMPEG_EXPORT_AUDIO_GAIN_DB_MIN
} from './ffmpeg-export-contract'

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

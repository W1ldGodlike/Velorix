/**
 * IPC/main совместимые типы экспорта ffmpeg §7.1–§7.2 (без реализации spawn).
 * Используются в preload/renderer и в main-сервисе; парсеры и runner остаются в `ffmpeg-export-service`.
 */

/** Диапазон экспорта по маркерам §7.1 (секунды на шкале исходника). */
export interface MediaExportTrimPayload {
  inSec: number
  outSec: number
}

/** Первые системные пресеты libx264 §7.2 — только белый список, без произвольных аргументов. */
export type FfmpegExportEncodePresetId = 'balance' | 'smaller' | 'quality'
export type FfmpegExportContainerId = 'mp4' | 'mkv' | 'mov'
export type FfmpegExportScalePresetId = 'source' | '480p' | '720p' | '1080p'
/** §7.2 — безопасные повороты/зеркала через whitelist `-vf` (до scale/fps). */
export type FfmpegExportVideoTransformId = 'none' | 'cw90' | 'ccw90' | 'r180' | 'hflip' | 'vflip'
/** §7.2 — crop только через предустановленные выражения, без пользовательской строки `-vf`. */
export type FfmpegExportCropPresetId = 'none' | 'center-square' | 'center-16-9' | 'center-4-3'
/**
 * §7.2 — пресеты `hqdn3d` denoise. Параметры подобраны от мягкого временного шумоподавления
 * к более агрессивному; кастомных строк фильтра не принимаем, только белый список.
 */
export type FfmpegExportVideoDenoiseId = 'off' | 'light' | 'medium' | 'strong'
/** §7.2 — пресеты `unsharp` (контурная резкость), от лёгкой к выраженной. */
export type FfmpegExportVideoSharpenId = 'off' | 'light' | 'medium' | 'strong'
/** §7.2 — пресеты `deband` (сглаживание полос 8-bit / градиентов), только whitelist. */
export type FfmpegExportVideoDebandId = 'off' | 'light' | 'medium' | 'strong'
/**
 * §7.2 — пресеты `histeq` (глобальное выравнивание гистограммы яркости), только whitelist; `off` — без фильтра.
 * В `-vf` вставляется после `deband` и до `lut3d`.
 */
export type FfmpegExportVideoHisteqId = 'off' | 'light' | 'medium' | 'strong'
/**
 * §7.2 — пресеты `eq=...`: коррекция контраста/насыщенности через белый список,
 * чтобы UI не отдавал произвольную строку фильтра в spawn.
 */
export type FfmpegExportVideoEqPresetId = 'off' | 'warm' | 'cool' | 'vivid' | 'flat'
/**
 * §7.2 — пресеты `noise` (лёгкая зернистость кадра), только whitelist; `off` — без фильтра.
 * Вставляется после `eq` и до `scale`/`fps` (как следующий шаг pipe §7.2).
 */
export type FfmpegExportVideoGrainId = 'off' | 'light' | 'medium' | 'strong'
/**
 * §7.2 — пресеты `vignette` (затемнение кадра к краям), только whitelist; `off` — без фильтра.
 * Вставляется после зерна и до `scale`/`fps`.
 */
export type FfmpegExportVideoVignetteId = 'off' | 'light' | 'medium' | 'strong'
/**
 * §7.2 — пресеты `gblur` (лёгкое размытие кадра), только whitelist; `off` — без фильтра.
 * Вставляется после `vignette` и до `scale`/`fps`.
 */
export type FfmpegExportVideoBlurId = 'off' | 'light' | 'medium' | 'strong'
/**
 * §7.2 — деинтерлейс `yadif` (только whitelist; без пользовательских `-vf`).
 * `frame` — `mode=send_frame` (по умолчанию в ffmpeg); `field` — `mode=send_field` (удвоение кадровой частоты для чересстрочного входа).
 */
export type FfmpegExportVideoDeinterlaceId = 'off' | 'frame' | 'field'
/**
 * §7.2 — пресеты `hue=h=…:s=…` (сдвиг оттенка / буст насыщенности), только whitelist; `off` — без фильтра.
 * В `-vf` вставляется сразу после `eq` и до зерна.
 */
export type FfmpegExportVideoHueId = 'off' | 'warmShift' | 'coolShift' | 'satBoost'
/**
 * §7.2 — bundled 3D LUT для `lut3d=file=…` (whitelist; `.cube` в `resources/luts/`, путь подставляет main).
 */
export type FfmpegExportVideoLut3dId = 'off' | 'film-warm' | 'film-cool' | 'punch'
export type FfmpegExportAudioModeId = 'aac' | 'none'
/**
 * §7.2 — пресеты нормализации громкости. `loudnorm` — однопроходный EBU R128,
 * `dynaudnorm` — динамическая нормализация. Включаются только в одиночном проходе:
 * для двухпроходного режима первый проход не имеет аудио (используется только видео).
 */
export type FfmpegExportAudioNormalizeId = 'off' | 'loudnorm' | 'dynaudnorm'
/**
 * §7.2 — режим обработки субтитров на экспорте.
 * `drop` — текущая базовая ветка ffmpeg (без явного `-c:s`, дорожки не маппятся в выход).
 * `copy` — пробрасываем дорожки субтитров: для MKV `-c:s copy`, для MP4/MOV
 * приходится перепаковывать в `mov_text` (поддерживается только текстовые субы; ffmpeg
 * упадёт, если источник — bitmap-субы. На стороне UI это даём, но пользователь решает сам).
 */
export type FfmpegExportSubtitleModeId = 'drop' | 'copy'

/**
 * §7.2 — целочисленный сдвиг громкости аудиодорожки (`-filter:a volume=NdB`).
 * `null`/`0` — фильтр не добавляется (без переусиления). Границы умышленно узкие
 * (−24…+24 дБ), чтобы UI не позволял случайно отправить буфер в клиппинг далеко за пределами.
 */
export const FFMPEG_EXPORT_AUDIO_GAIN_DB_MIN = -24
export const FFMPEG_EXPORT_AUDIO_GAIN_DB_MAX = 24

/**
 * §7.2 — сохранённый снимок параметров экспорта для пользовательского пресета.
 * Совместим с белым списком parse-хелперов main (`parseFfmpegExport*`).
 */
export interface FfmpegExportUserPresetSnapshot {
  encodePreset: FfmpegExportEncodePresetId
  container: FfmpegExportContainerId
  crf: number | null
  videoBitrate: string | null
  audioMode: FfmpegExportAudioModeId
  audioBitrate: string
  fps: number | null
  scalePreset: FfmpegExportScalePresetId
  videoTransform: FfmpegExportVideoTransformId
  cropPreset: FfmpegExportCropPresetId
  /** Двухпроходный libx264; фактический запуск только при ненулевом `videoBitrate`. */
  twoPass?: boolean
  /** §7.2 — целое значение в дБ; 0/null = без `-filter:a volume`. */
  audioGainDb?: number | null
  /** §7.2 — удалить контейнерные метаданные (`-map_metadata -1`). */
  stripMetadata?: boolean
  /** §7.2 — удалить chapter markers (`-map_chapters -1`). */
  stripChapters?: boolean
  /** §7.2 — поведение субтитров на выходе; по умолчанию совпадает с поведением до правки. */
  subtitleMode?: FfmpegExportSubtitleModeId
  /** §7.2 — `hqdn3d` denoise; `off` совпадает с поведением до правки. */
  videoDenoise?: FfmpegExportVideoDenoiseId
  /** §7.2 — `unsharp` контурная резкость; `off` совпадает с поведением до правки. */
  videoSharpen?: FfmpegExportVideoSharpenId
  /** §7.2 — `deband`; `off` совпадает с поведением до правки. */
  videoDeband?: FfmpegExportVideoDebandId
  /** §7.2 — `histeq` после deband и до lut3d; `off` = не пишем поле. */
  videoHisteq?: FfmpegExportVideoHisteqId
  /** §7.2 — `lut3d` из bundled `.cube`; `off` = не пишем поле. */
  videoLut3d?: FfmpegExportVideoLut3dId
  /** §7.2 — `eq=...` цветокор-пресет; `off` совпадает с поведением до правки. */
  videoEqPreset?: FfmpegExportVideoEqPresetId
  /** §7.2 — `hue` после `eq`; `off` совпадает с поведением до правки. */
  videoHue?: FfmpegExportVideoHueId
  /** §7.2 — `noise` зернистость; `off` совпадает с поведением до правки. */
  videoGrain?: FfmpegExportVideoGrainId
  /** §7.2 — `vignette`; `off` совпадает с поведением до правки. */
  videoVignette?: FfmpegExportVideoVignetteId
  /** §7.2 — `gblur`; `off` совпадает с поведением до правки. */
  videoBlur?: FfmpegExportVideoBlurId
  /** §7.2 — `yadif` после crop и до denoise; `off` совпадает с поведением до правки. */
  videoDeinterlace?: FfmpegExportVideoDeinterlaceId
  /** §7.2 — `loudnorm`/`dynaudnorm`; `off` совпадает с поведением до правки. */
  audioNormalize?: FfmpegExportAudioNormalizeId
}

/** §7.2 — именованный пользовательский пресет (до нескольких штук в settings). */
export interface FfmpegExportUserPreset {
  id: string
  label: string
  snapshot: FfmpegExportUserPresetSnapshot
}

export interface MediaExportRequestPayload {
  inputPath: string
  trim?: MediaExportTrimPayload
  probeDurationSec?: number | null
  /** Если не задан — в main берётся из `settings.json`. */
  encodePreset?: FfmpegExportEncodePresetId
  /** Если не задан — в main берётся из `settings.json`. */
  container?: FfmpegExportContainerId
  /** CRF libx264 0..51; если не задан — берётся из пресета/settings. */
  crf?: number | null
  /** Video bitrate (`2500k`, `8000k`); если задан — используется вместо CRF. */
  videoBitrate?: string | null
  /** `aac` — перекодировать звук, `none` — экспорт без аудиодорожки. */
  audioMode?: FfmpegExportAudioModeId | null
  /** Битрейт AAC одним токеном (`128k`, `192k`, `320k`). */
  audioBitrate?: string | null
  /** FPS вывода; null/undefined — оставить исходную частоту. */
  fps?: number | null
  /** Масштабирование с сохранением пропорций; `source` — без `scale`. */
  scalePreset?: FfmpegExportScalePresetId | null
  /** Поворот/зеркало до масштабирования и fps; `none` — без трансформа. */
  videoTransform?: FfmpegExportVideoTransformId | null
  /** Crop после поворота/зеркала и до scale/fps; только whitelist пресетов. */
  cropPreset?: FfmpegExportCropPresetId | null
  /** Двухпроходный libx264; в main отклоняется без валидного video bitrate. */
  twoPass?: boolean
  /** §7.2 — сдвиг громкости звука в дБ (`-filter:a volume=NdB`); 0/null — без фильтра. */
  audioGainDb?: number | null
  /** §7.2 — удалить контейнерные метаданные (`-map_metadata -1`). */
  stripMetadata?: boolean | null
  /** §7.2 — удалить chapter markers (`-map_chapters -1`). */
  stripChapters?: boolean | null
  /** §7.2 — поведение субтитров; `drop` (по умолчанию) совпадает с текущим, `copy` — `-c:s copy`/`mov_text`. */
  subtitleMode?: FfmpegExportSubtitleModeId | null
  /** §7.2 — `hqdn3d` denoise; `off` совпадает с текущим поведением. */
  videoDenoise?: FfmpegExportVideoDenoiseId | null
  /** §7.2 — `unsharp` контурная резкость; `off` совпадает с текущим поведением. */
  videoSharpen?: FfmpegExportVideoSharpenId | null
  /** §7.2 — `deband`; `off` совпадает с текущим поведением. */
  videoDeband?: FfmpegExportVideoDebandId | null
  /** §7.2 — `histeq`; `off` совпадает с текущим поведением. */
  videoHisteq?: FfmpegExportVideoHisteqId | null
  /** §7.2 — bundled `lut3d`; `off` совпадает с текущим поведением. */
  videoLut3d?: FfmpegExportVideoLut3dId | null
  /** §7.2 — `eq=...` цветокор-пресет; `off` совпадает с текущим поведением. */
  videoEqPreset?: FfmpegExportVideoEqPresetId | null
  /** §7.2 — `hue` после `eq`; `off` совпадает с текущим поведением. */
  videoHue?: FfmpegExportVideoHueId | null
  /** §7.2 — `noise` зернистость; `off` совпадает с текущим поведением. */
  videoGrain?: FfmpegExportVideoGrainId | null
  /** §7.2 — `vignette`; `off` совпадает с текущим поведением. */
  videoVignette?: FfmpegExportVideoVignetteId | null
  /** §7.2 — `gblur`; `off` совпадает с текущим поведением. */
  videoBlur?: FfmpegExportVideoBlurId | null
  /** §7.2 — `yadif` деинтерлейс; `off` совпадает с текущим поведением. */
  videoDeinterlace?: FfmpegExportVideoDeinterlaceId | null
  /** §7.2 — `loudnorm`/`dynaudnorm`; `off` совпадает с текущим поведением. */
  audioNormalize?: FfmpegExportAudioNormalizeId | null
}

export type MediaExportStartResult =
  | { ok: true; path: string }
  | { ok: false; cancelled: true }
  | { ok: false; error: string }

export interface FfmpegExportProgressPayload {
  /** 0..100 или −1, если по stderr ещё не удалось оценить прогресс. */
  percent: number
  message: string
  /** Множитель относительно реального времени (`1.04x`, `N/A`), из последней строки статистики со `speed=`. */
  speed?: string
}

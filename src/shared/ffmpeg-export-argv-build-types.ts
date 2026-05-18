import type { ExternalFilterScriptKind } from './external-filter-script-contract'
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
  /** §17 — внешний скрипт в `-vf` после transform. */
  externalFilterKind?: ExternalFilterScriptKind
  externalFilterScriptAbsPath?: string | null
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

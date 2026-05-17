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
import {
  buildFfmpegExportLut3dFilter,
  normalizeFfmpegExportAudioGainDb,
  resolveFfmpegExportAudioNormalizeFilter,
  resolveFfmpegExportCropFilter,
  resolveFfmpegExportScaleFilter,
  resolveFfmpegExportSubtitleCopyCodec,
  resolveFfmpegExportVideoDebandFilter,
  resolveFfmpegExportVideoDeinterlaceFilter,
  resolveFfmpegExportVideoHisteqFilter,
  resolveFfmpegExportVideoDenoiseFilter,
  resolveFfmpegExportVideoEqFilter,
  resolveFfmpegExportVideoGrainFilter,
  resolveFfmpegExportVideoHueFilter,
  resolveFfmpegExportVideoBlurFilter,
  resolveFfmpegExportVideoSharpenFilter,
  resolveFfmpegExportVideoVignetteFilter,
  resolveFfmpegExportVideoTransformFilters
} from './ffmpeg-export-argv-filters'

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

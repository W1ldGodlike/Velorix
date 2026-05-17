import type {
  FfmpegExportAudioModeId,
  FfmpegExportContainerId,
  FfmpegExportVideoCodecId
} from './ffmpeg-export-contract'
import { appendFfmpegExportExtraArgsToArgv } from './ffmpeg-export-extra-args'
import { prependHwEncoderUploadToVideoFilters } from './ffmpeg-export-vaapi-vf'
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
  normalizeFfmpegExportAudioGainDb,
  resolveFfmpegExportAudioNormalizeFilter,
  resolveFfmpegExportSubtitleCopyCodec
} from './ffmpeg-export-argv-filters'
import { appendFfmpegHwEncoderRateArgs } from './ffmpeg-export-argv-build-encode'
import type { FfmpegExportArgvParams } from './ffmpeg-export-argv-build-types'

/** Кодек, vf, аудио, субтитры и путь выхода — после секции input в argv. */
export function appendFfmpegExportCodecAudioAndOutput(
  args: string[],
  params: FfmpegExportArgvParams,
  filters: string[],
  enc: { crf: string; x264preset: string },
  crf: string,
  container: FfmpegExportContainerId
): string[] {
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

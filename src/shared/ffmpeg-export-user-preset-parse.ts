/**
 * §7.2 — парсинг пользовательских пресетов export (snapshot + список в settings).
 */
import type {
  FfmpegExportUserPreset,
  FfmpegExportUserPresetSnapshot
} from './ffmpeg-export-contract'
import { FFMPEG_EXPORT_USER_PRESETS_MAX_ENTRIES } from './ffmpeg-export-contract'
import { parseFfmpegExportHwDecode } from './ffmpeg-export-hw-decode'
import {
  parseFfmpegExportAudioMode,
  parseFfmpegExportAudioNormalize,
  parseFfmpegExportContainer,
  parseFfmpegExportCropPreset,
  parseFfmpegExportEncodePreset,
  parseFfmpegExportScalePreset,
  parseFfmpegExportSubtitleMode,
  parseFfmpegExportVideoDeband,
  parseFfmpegExportVideoBlur,
  parseFfmpegExportVideoDeinterlace,
  parseFfmpegExportVideoDenoise,
  parseFfmpegExportVideoEqPreset,
  parseFfmpegExportVideoGrain,
  parseFfmpegExportVideoHisteq,
  parseFfmpegExportVideoHue,
  parseFfmpegExportVideoLut3d,
  parseFfmpegExportVideoSharpen,
  parseFfmpegExportVideoTransform,
  parseFfmpegExportVideoVignette
} from './ffmpeg-export-parse-registry'
import {
  parseFfmpegExportAudioBitrate,
  parseFfmpegExportAudioGainDb,
  parseFfmpegExportCrf,
  parseFfmpegExportEconomyMode,
  parseFfmpegExportFps,
  parseFfmpegExportStripFlag,
  parseFfmpegExportVideoBitrate
} from './ffmpeg-export-stored-parse'
import { parseFfmpegExportVideoCodec } from './ffmpeg-export-video-codec'

/** §7.2 — разбор снимка пользовательского пресета из IPC/renderer (белые списки). */
export function parseFfmpegExportUserPresetSnapshot(
  raw: unknown
): FfmpegExportUserPresetSnapshot | null {
  if (!raw || typeof raw !== 'object') {
    return null
  }
  const o = raw as Record<string, unknown>
  const encodePreset = parseFfmpegExportEncodePreset(o['encodePreset'])
  const videoCodec = parseFfmpegExportVideoCodec(o['videoCodec'])
  const container = parseFfmpegExportContainer(o['container'])
  const crf = parseFfmpegExportCrf(o['crf'])
  const videoBitrate = parseFfmpegExportVideoBitrate(o['videoBitrate'])
  const audioMode = parseFfmpegExportAudioMode(o['audioMode'])
  const audioBitrate = parseFfmpegExportAudioBitrate(o['audioBitrate']) ?? '192k'
  const fps = parseFfmpegExportFps(o['fps'])
  const scalePreset = parseFfmpegExportScalePreset(o['scalePreset'])
  const videoTransform = parseFfmpegExportVideoTransform(o['videoTransform'])
  const cropPreset = parseFfmpegExportCropPreset(o['cropPreset'])
  const twoPass = o['twoPass'] === true
  const economyMode = parseFfmpegExportEconomyMode(o['economyMode'])
  const hwDecode = parseFfmpegExportHwDecode(o['hwDecode'])
  const extraArgsLine =
    typeof o['extraArgsLine'] === 'string' ? o['extraArgsLine'].trim().slice(0, 1200) : ''
  const audioGainDb = parseFfmpegExportAudioGainDb(o['audioGainDb'])
  const stripMetadata = parseFfmpegExportStripFlag(o['stripMetadata'])
  const stripChapters = parseFfmpegExportStripFlag(o['stripChapters'])
  const subtitleMode = parseFfmpegExportSubtitleMode(o['subtitleMode'])
  const videoDenoise = parseFfmpegExportVideoDenoise(o['videoDenoise'])
  const videoDeband = parseFfmpegExportVideoDeband(o['videoDeband'])
  const videoHisteq = parseFfmpegExportVideoHisteq(o['videoHisteq'])
  const videoLut3d = parseFfmpegExportVideoLut3d(o['videoLut3d'])
  const videoSharpen = parseFfmpegExportVideoSharpen(o['videoSharpen'])
  const videoEqPreset = parseFfmpegExportVideoEqPreset(o['videoEqPreset'])
  const videoHue = parseFfmpegExportVideoHue(o['videoHue'])
  const videoGrain = parseFfmpegExportVideoGrain(o['videoGrain'])
  const videoVignette = parseFfmpegExportVideoVignette(o['videoVignette'])
  const videoBlur = parseFfmpegExportVideoBlur(o['videoBlur'])
  const videoDeinterlace = parseFfmpegExportVideoDeinterlace(o['videoDeinterlace'])
  const audioNormalize = parseFfmpegExportAudioNormalize(o['audioNormalize'])
  return {
    encodePreset,
    ...(videoCodec !== 'libx264' ? { videoCodec } : {}),
    container,
    crf,
    videoBitrate,
    audioMode,
    audioBitrate,
    fps,
    scalePreset,
    videoTransform,
    cropPreset,
    ...(twoPass && videoCodec === 'libx264' ? { twoPass: true as const } : {}),
    ...(economyMode ? { economyMode: true as const } : {}),
    ...(hwDecode ? { hwDecode: true as const } : {}),
    ...(extraArgsLine.length > 0 ? { extraArgsLine } : {}),
    ...(audioGainDb !== null ? { audioGainDb } : {}),
    ...(stripMetadata ? { stripMetadata: true } : {}),
    ...(stripChapters ? { stripChapters: true } : {}),
    ...(subtitleMode === 'copy' ? { subtitleMode: 'copy' as const } : {}),
    ...(videoDenoise !== 'off' ? { videoDenoise } : {}),
    ...(videoDeband !== 'off' ? { videoDeband } : {}),
    ...(videoHisteq !== 'off' ? { videoHisteq } : {}),
    ...(videoLut3d !== 'off' ? { videoLut3d } : {}),
    ...(videoSharpen !== 'off' ? { videoSharpen } : {}),
    ...(videoEqPreset !== 'off' ? { videoEqPreset } : {}),
    ...(videoHue !== 'off' ? { videoHue } : {}),
    ...(videoGrain !== 'off' ? { videoGrain } : {}),
    ...(videoVignette !== 'off' ? { videoVignette } : {}),
    ...(videoBlur !== 'off' ? { videoBlur } : {}),
    ...(videoDeinterlace !== 'off' ? { videoDeinterlace } : {}),
    ...(audioNormalize !== 'off' ? { audioNormalize } : {})
  }
}

/** §7.2 — список пресетов экспорта для `settings.json`. */
export function parseFfmpegExportUserPresetsList(raw: unknown): FfmpegExportUserPreset[] {
  if (!Array.isArray(raw)) {
    return []
  }
  const out: FfmpegExportUserPreset[] = []
  for (const item of raw.slice(0, FFMPEG_EXPORT_USER_PRESETS_MAX_ENTRIES)) {
    if (!item || typeof item !== 'object') {
      continue
    }
    const o = item as Record<string, unknown>
    const idRaw = o['id']
    const id =
      typeof idRaw === 'string' && /^[a-zA-Z0-9_-]{1,64}$/.test(idRaw.trim()) ? idRaw.trim() : null
    const labelRaw = o['label']
    const label =
      typeof labelRaw === 'string' && labelRaw.trim().length > 0
        ? labelRaw.trim().slice(0, 64)
        : null
    const hintRaw = o['hint']
    const hint =
      typeof hintRaw === 'string' && hintRaw.trim().length > 0
        ? hintRaw.trim().slice(0, 220)
        : undefined
    const snap = parseFfmpegExportUserPresetSnapshot(o['snapshot'])
    if (!id || !label || !snap) {
      continue
    }
    out.push({ id, label, snapshot: snap, ...(hint ? { hint } : {}) })
  }
  return out
}

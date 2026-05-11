import { spawn } from 'child_process'
import { mkdtempSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'

import type { AppSettings } from '../shared/settings-contract'
import type {
  FfmpegExportAudioModeId,
  FfmpegExportAudioNormalizeId,
  FfmpegExportContainerId,
  FfmpegExportCropPresetId,
  FfmpegExportEncodePresetId,
  FfmpegExportProgressPayload,
  FfmpegExportScalePresetId,
  FfmpegExportSubtitleModeId,
  FfmpegExportUserPreset,
  FfmpegExportUserPresetSnapshot,
  FfmpegExportVideoDebandId,
  FfmpegExportVideoDeinterlaceId,
  FfmpegExportVideoHisteqId,
  FfmpegExportVideoDenoiseId,
  FfmpegExportVideoEqPresetId,
  FfmpegExportVideoGrainId,
  FfmpegExportVideoHueId,
  FfmpegExportVideoBlurId,
  FfmpegExportVideoLut3dId,
  FfmpegExportVideoSharpenId,
  FfmpegExportVideoTransformId,
  FfmpegExportVideoVignetteId,
  MediaExportTrimPayload
} from '../shared/ffmpeg-export-contract'
import {
  buildFfmpegExportArgv,
  normalizeFfmpegExportAudioGainDb,
  shouldApplyFfmpegExportTrim
} from '../shared/ffmpeg-export-argv'

import { logExternalProcessLine } from './external-process-log'
import { resolveFfmpegExportLutCubeAbsPath } from './ffmpeg-export-lut-path'

export type {
  FfmpegExportAudioModeId,
  FfmpegExportAudioNormalizeId,
  FfmpegExportContainerId,
  FfmpegExportCropPresetId,
  FfmpegExportEncodePresetId,
  FfmpegExportProgressPayload,
  FfmpegExportScalePresetId,
  FfmpegExportSubtitleModeId,
  FfmpegExportUserPreset,
  FfmpegExportUserPresetSnapshot,
  FfmpegExportVideoDebandId,
  FfmpegExportVideoDeinterlaceId,
  FfmpegExportVideoHisteqId,
  FfmpegExportVideoDenoiseId,
  FfmpegExportVideoEqPresetId,
  FfmpegExportVideoGrainId,
  FfmpegExportVideoHueId,
  FfmpegExportVideoBlurId,
  FfmpegExportVideoLut3dId,
  FfmpegExportVideoSharpenId,
  FfmpegExportVideoTransformId,
  FfmpegExportVideoVignetteId,
  MediaExportRequestPayload,
  MediaExportStartResult,
  MediaExportTrimPayload
} from '../shared/ffmpeg-export-contract'

export {
  buildFfmpegExportArgv,
  buildFfmpegExportPreviewCommand,
  formatFfmpegArgvForPreview,
  normalizeFfmpegExportAudioGainDb,
  resolveFfmpegExportAudioNormalizeFilter,
  resolveFfmpegExportEncodeParams as resolveExportEncodeParams,
  resolveFfmpegExportScaleFilter,
  resolveFfmpegExportSubtitleCopyCodec,
  resolveFfmpegExportVideoDenoiseFilter,
  resolveFfmpegExportVideoDeinterlaceFilter,
  resolveFfmpegExportVideoHisteqFilter,
  resolveFfmpegExportVideoEqFilter,
  resolveFfmpegExportVideoGrainFilter,
  resolveFfmpegExportVideoHueFilter,
  resolveFfmpegExportVideoBlurFilter,
  resolveFfmpegExportVideoSharpenFilter,
  resolveFfmpegExportVideoVignetteFilter,
  shouldApplyFfmpegExportTrim
} from '../shared/ffmpeg-export-argv'

export function parseFfmpegExportEncodePreset(raw: unknown): FfmpegExportEncodePresetId {
  if (raw === 'balance' || raw === 'smaller' || raw === 'quality') {
    return raw
  }
  return 'balance'
}

export function parseFfmpegExportContainer(raw: unknown): FfmpegExportContainerId {
  if (raw === 'mkv' || raw === 'mov' || raw === 'mp4') {
    return raw
  }
  return 'mp4'
}

export function inferFfmpegExportContainerFromPath(path: string): FfmpegExportContainerId {
  const lower = path.trim().toLowerCase()
  if (lower.endsWith('.mkv')) {
    return 'mkv'
  }
  if (lower.endsWith('.mov')) {
    return 'mov'
  }
  return 'mp4'
}

export function ensureFfmpegExportExtension(
  path: string,
  fallback: FfmpegExportContainerId
): string {
  const trimmed = path.trim()
  if (/\.(mp4|mkv|mov)$/i.test(trimmed)) {
    return trimmed
  }
  return `${trimmed}.${parseFfmpegExportContainer(fallback)}`
}

export function parseFfmpegExportCrf(raw: unknown): number | null {
  const n =
    typeof raw === 'number'
      ? raw
      : typeof raw === 'string' && raw.trim() !== ''
        ? Number(raw.trim())
        : NaN
  if (!Number.isInteger(n) || n < 0 || n > 51) {
    return null
  }
  return n
}

export function parseFfmpegExportAudioBitrate(raw: unknown): string | null {
  if (typeof raw !== 'string') {
    return null
  }
  const t = raw.trim().toLowerCase()
  if (!/^\d{2,3}k$/.test(t)) {
    return null
  }
  const kbps = Number(t.slice(0, -1))
  if (!Number.isInteger(kbps) || kbps < 32 || kbps > 512) {
    return null
  }
  return `${kbps}k`
}

export function parseFfmpegExportAudioMode(raw: unknown): FfmpegExportAudioModeId {
  if (raw === 'none') {
    return 'none'
  }
  return 'aac'
}

export function parseFfmpegExportVideoBitrate(raw: unknown): string | null {
  if (typeof raw !== 'string') {
    return null
  }
  const t = raw.trim().toLowerCase()
  if (!/^\d{3,5}k$/.test(t)) {
    return null
  }
  const kbps = Number(t.slice(0, -1))
  if (!Number.isInteger(kbps) || kbps < 300 || kbps > 50000) {
    return null
  }
  return `${kbps}k`
}

export function parseFfmpegExportFps(raw: unknown): number | null {
  const n =
    typeof raw === 'number'
      ? raw
      : typeof raw === 'string' && raw.trim() !== ''
        ? Number(raw.trim())
        : NaN
  if (![24, 25, 30, 50, 60].includes(n)) {
    return null
  }
  return n
}

export function parseFfmpegExportScalePreset(raw: unknown): FfmpegExportScalePresetId {
  if (raw === '480p' || raw === '720p' || raw === '1080p') {
    return raw
  }
  return 'source'
}

export function parseFfmpegExportVideoTransform(raw: unknown): FfmpegExportVideoTransformId {
  if (raw === 'cw90' || raw === 'ccw90' || raw === 'r180' || raw === 'hflip' || raw === 'vflip') {
    return raw
  }
  return 'none'
}

export function parseFfmpegExportCropPreset(raw: unknown): FfmpegExportCropPresetId {
  if (raw === 'center-square' || raw === 'center-16-9' || raw === 'center-4-3') {
    return raw
  }
  return 'none'
}

/** §7.2 / v0 — двухпроходное libx264; только явный `true`. */
export function parseFfmpegExportTwoPass(raw: unknown): boolean {
  return raw === true
}

/**
 * §7.2 — режим субтитров. По умолчанию `drop`: argv не меняется, поведение совпадает с
 * прежней веткой (ffmpeg сам решает по дефолтному mapping). `copy` валидируется отдельно,
 * чтобы случайные строки в `settings.json` не попадали в spawn.
 */
export function parseFfmpegExportSubtitleMode(raw: unknown): FfmpegExportSubtitleModeId {
  if (raw === 'copy') {
    return 'copy'
  }
  return 'drop'
}

/** §7.2 — strip-флаги; только явный `true` ставит `-map_metadata -1` / `-map_chapters -1`. */
export function parseFfmpegExportStripFlag(raw: unknown): boolean {
  return raw === true
}

/** §7.2 — пресет `hqdn3d`; по умолчанию `off`. */
export function parseFfmpegExportVideoDenoise(raw: unknown): FfmpegExportVideoDenoiseId {
  if (raw === 'light' || raw === 'medium' || raw === 'strong') {
    return raw
  }
  return 'off'
}

/** §7.2 — пресет `unsharp`; по умолчанию `off`. */
export function parseFfmpegExportVideoSharpen(raw: unknown): FfmpegExportVideoSharpenId {
  if (raw === 'light' || raw === 'medium' || raw === 'strong') {
    return raw
  }
  return 'off'
}

/** §7.2 — пресет `deband`; только whitelist, иначе `off`. */
export function parseFfmpegExportVideoDeband(raw: unknown): FfmpegExportVideoDebandId {
  if (raw === 'light' || raw === 'medium' || raw === 'strong') {
    return raw
  }
  return 'off'
}

/** §7.2 — пресет `histeq`; только whitelist, иначе `off`. */
export function parseFfmpegExportVideoHisteq(raw: unknown): FfmpegExportVideoHisteqId {
  if (raw === 'light' || raw === 'medium' || raw === 'strong') {
    return raw
  }
  return 'off'
}

/** §7.2 — bundled `lut3d`; только whitelist, иначе `off`. */
export function parseFfmpegExportVideoLut3d(raw: unknown): FfmpegExportVideoLut3dId {
  if (raw === 'film-warm' || raw === 'film-cool' || raw === 'punch') {
    return raw
  }
  return 'off'
}

/** §7.2 — пресет `eq=` (цветокор); только whitelist, иначе `off`. */
export function parseFfmpegExportVideoEqPreset(raw: unknown): FfmpegExportVideoEqPresetId {
  if (raw === 'warm' || raw === 'cool' || raw === 'vivid' || raw === 'flat') {
    return raw
  }
  return 'off'
}

/** §7.2 — пресет `noise` (зернистость); только whitelist, иначе `off`. */
export function parseFfmpegExportVideoGrain(raw: unknown): FfmpegExportVideoGrainId {
  if (raw === 'light' || raw === 'medium' || raw === 'strong') {
    return raw
  }
  return 'off'
}

/** §7.2 — пресет `vignette`; только whitelist, иначе `off`. */
export function parseFfmpegExportVideoVignette(raw: unknown): FfmpegExportVideoVignetteId {
  if (raw === 'light' || raw === 'medium' || raw === 'strong') {
    return raw
  }
  return 'off'
}

/** §7.2 — пресет `gblur`; только whitelist, иначе `off`. */
export function parseFfmpegExportVideoBlur(raw: unknown): FfmpegExportVideoBlurId {
  if (raw === 'light' || raw === 'medium' || raw === 'strong') {
    return raw
  }
  return 'off'
}

/** §7.2 — деинтерлейс `yadif`; только whitelist, иначе `off`. */
export function parseFfmpegExportVideoDeinterlace(raw: unknown): FfmpegExportVideoDeinterlaceId {
  if (raw === 'frame' || raw === 'field') {
    return raw
  }
  return 'off'
}

/** §7.2 — пресет `hue` после `eq`; только whitelist, иначе `off`. */
export function parseFfmpegExportVideoHue(raw: unknown): FfmpegExportVideoHueId {
  if (raw === 'warmShift' || raw === 'coolShift' || raw === 'satBoost') {
    return raw
  }
  return 'off'
}

/** §7.2 — пресет нормализации громкости (`loudnorm`/`dynaudnorm`); иначе `off`. */
export function parseFfmpegExportAudioNormalize(raw: unknown): FfmpegExportAudioNormalizeId {
  if (raw === 'loudnorm' || raw === 'dynaudnorm') {
    return raw
  }
  return 'off'
}

/**
 * §7.2 — целочисленный сдвиг громкости в дБ; `null` при пустом/некорректном/нулевом значении.
 * Дополнительная гарантия по сравнению с `normalizeFfmpegExportAudioGainDb`: явно
 * фиксируем сигнатуру, чтобы main мог использовать тот же helper для persist и для spawn.
 */
export function parseFfmpegExportAudioGainDb(raw: unknown): number | null {
  return normalizeFfmpegExportAudioGainDb(raw)
}

/** §7.2 — IPC/renderer trim payload: только конечные неотрицательные маркеры In < Out. */
export function parseFfmpegExportTrim(raw: unknown): MediaExportTrimPayload | undefined {
  if (!raw || typeof raw !== 'object') {
    return undefined
  }
  const o = raw as Record<string, unknown>
  if (typeof o['inSec'] !== 'number' || typeof o['outSec'] !== 'number') {
    return undefined
  }
  const inSec = o['inSec']
  const outSec = o['outSec']
  if (!Number.isFinite(inSec) || !Number.isFinite(outSec)) {
    return undefined
  }
  if (inSec < 0 || outSec <= inSec) {
    return undefined
  }
  return { inSec, outSec }
}

/** §7.2 — разбор снимка пользовательского пресета из IPC/renderer (белые списки). */
export function parseFfmpegExportUserPresetSnapshot(
  raw: unknown
): FfmpegExportUserPresetSnapshot | null {
  if (!raw || typeof raw !== 'object') {
    return null
  }
  const o = raw as Record<string, unknown>
  const encodePreset = parseFfmpegExportEncodePreset(o['encodePreset'])
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
    container,
    crf,
    videoBitrate,
    audioMode,
    audioBitrate,
    fps,
    scalePreset,
    videoTransform,
    cropPreset,
    ...(twoPass ? { twoPass: true as const } : {}),
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

/**
 * §7.2 — список пользовательских пресетов для `settings.json` (не более 8 записей).
 */
export function parseFfmpegExportUserPresetsList(raw: unknown): FfmpegExportUserPreset[] {
  if (!Array.isArray(raw)) {
    return []
  }
  const out: FfmpegExportUserPreset[] = []
  for (const item of raw.slice(0, 8)) {
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
    const snap = parseFfmpegExportUserPresetSnapshot(o['snapshot'])
    if (!id || !label || !snap) {
      continue
    }
    out.push({ id, label, snapshot: snap })
  }
  return out
}

/**
 * §7.2 — записать снимок в сериализуемые поля `AppSettings` (те же правила delete при «по умолчанию», что и точечные IPC).
 */
export function mergeFfmpegExportSnapshotIntoAppSettings(
  base: AppSettings,
  snapshot: FfmpegExportUserPresetSnapshot
): AppSettings {
  const next: AppSettings = { ...base }
  next.ffmpegExportEncodePreset = snapshot.encodePreset
  next.ffmpegExportContainer = snapshot.container
  if (snapshot.crf === null) {
    delete next.ffmpegExportCrf
  } else {
    next.ffmpegExportCrf = snapshot.crf
  }
  if (snapshot.videoBitrate === null) {
    delete next.ffmpegExportVideoBitrate
  } else {
    next.ffmpegExportVideoBitrate = snapshot.videoBitrate
  }
  next.ffmpegExportAudioBitrate = snapshot.audioBitrate
  if (snapshot.audioMode === 'aac') {
    delete next.ffmpegExportAudioMode
  } else {
    next.ffmpegExportAudioMode = 'none'
  }
  if (snapshot.fps === null) {
    delete next.ffmpegExportFps
  } else {
    next.ffmpegExportFps = snapshot.fps
  }
  if (snapshot.scalePreset === 'source') {
    delete next.ffmpegExportScalePreset
  } else {
    next.ffmpegExportScalePreset = snapshot.scalePreset
  }
  if (snapshot.videoTransform === 'none') {
    delete next.ffmpegExportVideoTransform
  } else {
    next.ffmpegExportVideoTransform = snapshot.videoTransform
  }
  if (snapshot.cropPreset === 'none') {
    delete next.ffmpegExportCropPreset
  } else {
    next.ffmpegExportCropPreset = snapshot.cropPreset
  }
  if (snapshot.twoPass === true) {
    next.ffmpegExportTwoPass = true
  } else {
    delete next.ffmpegExportTwoPass
  }
  if (typeof snapshot.audioGainDb === 'number' && snapshot.audioGainDb !== 0) {
    next.ffmpegExportAudioGainDb = snapshot.audioGainDb
  } else {
    delete next.ffmpegExportAudioGainDb
  }
  if (snapshot.stripMetadata === true) {
    next.ffmpegExportStripMetadata = true
  } else {
    delete next.ffmpegExportStripMetadata
  }
  if (snapshot.stripChapters === true) {
    next.ffmpegExportStripChapters = true
  } else {
    delete next.ffmpegExportStripChapters
  }
  if (snapshot.subtitleMode === 'copy') {
    next.ffmpegExportSubtitleMode = 'copy'
  } else {
    delete next.ffmpegExportSubtitleMode
  }
  if (
    snapshot.videoDenoise === 'light' ||
    snapshot.videoDenoise === 'medium' ||
    snapshot.videoDenoise === 'strong'
  ) {
    next.ffmpegExportVideoDenoise = snapshot.videoDenoise
  } else {
    delete next.ffmpegExportVideoDenoise
  }
  if (
    snapshot.videoDeband === 'light' ||
    snapshot.videoDeband === 'medium' ||
    snapshot.videoDeband === 'strong'
  ) {
    next.ffmpegExportVideoDeband = snapshot.videoDeband
  } else {
    delete next.ffmpegExportVideoDeband
  }
  if (
    snapshot.videoHisteq === 'light' ||
    snapshot.videoHisteq === 'medium' ||
    snapshot.videoHisteq === 'strong'
  ) {
    next.ffmpegExportVideoHisteq = snapshot.videoHisteq
  } else {
    delete next.ffmpegExportVideoHisteq
  }
  if (
    snapshot.videoLut3d === 'film-warm' ||
    snapshot.videoLut3d === 'film-cool' ||
    snapshot.videoLut3d === 'punch'
  ) {
    next.ffmpegExportVideoLut3d = snapshot.videoLut3d
  } else {
    delete next.ffmpegExportVideoLut3d
  }
  if (
    snapshot.videoSharpen === 'light' ||
    snapshot.videoSharpen === 'medium' ||
    snapshot.videoSharpen === 'strong'
  ) {
    next.ffmpegExportVideoSharpen = snapshot.videoSharpen
  } else {
    delete next.ffmpegExportVideoSharpen
  }
  if (
    snapshot.videoEqPreset === 'warm' ||
    snapshot.videoEqPreset === 'cool' ||
    snapshot.videoEqPreset === 'vivid' ||
    snapshot.videoEqPreset === 'flat'
  ) {
    next.ffmpegExportVideoEqPreset = snapshot.videoEqPreset
  } else {
    delete next.ffmpegExportVideoEqPreset
  }
  if (
    snapshot.videoHue === 'warmShift' ||
    snapshot.videoHue === 'coolShift' ||
    snapshot.videoHue === 'satBoost'
  ) {
    next.ffmpegExportVideoHue = snapshot.videoHue
  } else {
    delete next.ffmpegExportVideoHue
  }
  if (
    snapshot.videoGrain === 'light' ||
    snapshot.videoGrain === 'medium' ||
    snapshot.videoGrain === 'strong'
  ) {
    next.ffmpegExportVideoGrain = snapshot.videoGrain
  } else {
    delete next.ffmpegExportVideoGrain
  }
  if (
    snapshot.videoVignette === 'light' ||
    snapshot.videoVignette === 'medium' ||
    snapshot.videoVignette === 'strong'
  ) {
    next.ffmpegExportVideoVignette = snapshot.videoVignette
  } else {
    delete next.ffmpegExportVideoVignette
  }
  if (
    snapshot.videoBlur === 'light' ||
    snapshot.videoBlur === 'medium' ||
    snapshot.videoBlur === 'strong'
  ) {
    next.ffmpegExportVideoBlur = snapshot.videoBlur
  } else {
    delete next.ffmpegExportVideoBlur
  }
  if (snapshot.videoDeinterlace === 'frame' || snapshot.videoDeinterlace === 'field') {
    next.ffmpegExportVideoDeinterlace = snapshot.videoDeinterlace
  } else {
    delete next.ffmpegExportVideoDeinterlace
  }
  if (snapshot.audioNormalize === 'loudnorm' || snapshot.audioNormalize === 'dynaudnorm') {
    next.ffmpegExportAudioNormalize = snapshot.audioNormalize
  } else {
    delete next.ffmpegExportAudioNormalize
  }
  return next
}

/** Поле `speed=` в строках прогресса ffmpeg (`-stats`). */
export function parseFfmpegSpeedToken(line: string): string | null {
  const m = line.match(/\bspeed=\s*(\S+)/)
  const token = m?.[1]
  return token !== undefined ? token : null
}

export function parseFfmpegTimeSeconds(line: string): number | null {
  const m = line.match(/time=(\d+):(\d+):(\d+(?:\.\d+)?)/)
  if (!m) {
    return null
  }
  const h = Number(m[1])
  const min = Number(m[2])
  const sec = Number(m[3])
  if (!Number.isFinite(h + min + sec)) {
    return null
  }
  return h * 3600 + min * 60 + sec
}

/**
 * §7.1 — показывать в статусбаре только строки статистики `-stats` или явные ошибки;
 * отфильтровываем баннер версии, конфиг-декларации и прочий шум без `time=`/`frame=`.
 */
export function isFfmpegExportProgressStatusLine(line: string): boolean {
  const t = line.trim()
  if (t.length === 0) {
    return false
  }
  if (/\[(?:error|fatal)\]/i.test(t)) {
    return true
  }
  if (/\berror while\b|\bfailed to\b|\binvalid\b|\bcannot\b/i.test(t)) {
    return true
  }
  return /\b(?:frame=\s*\d|fps=\s*[\d.]+|L?size=\s*|time=\s*\d|bitrate=\s*|speed=\s*[\d.N/A]+)/i.test(
    t
  )
}

export function resolveExportSegmentDurationSec(
  trim: MediaExportTrimPayload | undefined,
  applyTrim: boolean,
  probeDurationSec: number | null | undefined
): number {
  if (applyTrim && trim) {
    return Math.max(0.01, trim.outSec - trim.inSec)
  }
  if (
    probeDurationSec !== null &&
    probeDurationSec !== undefined &&
    Number.isFinite(probeDurationSec) &&
    probeDurationSec > 0
  ) {
    return probeDurationSec
  }
  return 0
}

/**
 * Один запуск ffmpeg без shell: только массив аргументов §7 / §21.
 * Прогресс — по `time=` в stderr; `mapPercent` масштабирует процент для двухпроходного режима.
 */
function runFfmpegExportOnce(params: {
  ffmpegPath: string
  args: string[]
  signal: AbortSignal
  segmentDur: number
  onProgress?: (p: FfmpegExportProgressPayload) => void
  mapPercent?: (rawPercent: number) => number
}): Promise<{ ok: true } | { ok: false; error: string }> {
  return new Promise((resolve) => {
    const child = spawn(params.ffmpegPath, params.args, {
      windowsHide: true,
      stdio: ['ignore', 'ignore', 'pipe'],
      signal: params.signal
    })
    logExternalProcessLine('ffmpeg-export', 'lifecycle', 'started')

    let stderrTail = ''
    let lastSpeed: string | null = null

    function emitLine(line: string): void {
      const trimmed = line.trimEnd()
      if (trimmed.length === 0) {
        return
      }
      logExternalProcessLine('ffmpeg-export', 'stderr', trimmed)
      const spd = parseFfmpegSpeedToken(trimmed)
      if (spd !== null) {
        lastSpeed = spd
      }
      if (!isFfmpegExportProgressStatusLine(trimmed)) {
        return
      }
      const t = parseFfmpegTimeSeconds(trimmed)
      let pct = -1
      if (t !== null && params.segmentDur > 0.05) {
        pct = Math.min(99.9, Math.max(0, (t / params.segmentDur) * 100))
      }
      const msg = trimmed.length > 140 ? `${trimmed.slice(0, 138)}…` : trimmed
      const outPct = pct >= 0 && params.mapPercent !== undefined ? params.mapPercent(pct) : pct
      params.onProgress?.({
        percent: outPct,
        message: msg,
        ...(lastSpeed !== null ? { speed: lastSpeed } : {})
      })
    }

    child.stderr?.setEncoding('utf8')
    child.stderr?.on('data', (chunk: string) => {
      stderrTail += chunk
      const parts = stderrTail.split(/\r|\n/)
      stderrTail = parts.pop() ?? ''
      for (const part of parts) {
        const t = part.trimEnd()
        if (t.length > 0) {
          emitLine(t)
        }
      }
    })

    child.on('error', (err) => {
      logExternalProcessLine('ffmpeg-export', 'lifecycle', `error ${err.message}`)
      if (params.signal.aborted || err.name === 'AbortError') {
        resolve({ ok: false, error: 'Экспорт отменён' })
        return
      }
      resolve({ ok: false, error: err.message })
    })

    child.on('close', (code) => {
      logExternalProcessLine('ffmpeg-export', 'lifecycle', `closed exitCode=${code ?? '?'}`)
      if (stderrTail.trim().length > 0) {
        emitLine(stderrTail)
        stderrTail = ''
      }
      if (params.signal.aborted) {
        resolve({ ok: false, error: 'Экспорт отменён' })
        return
      }
      if (code === 0) {
        resolve({ ok: true })
      } else {
        resolve({
          ok: false,
          error: `ffmpeg завершился с кодом ${code ?? '?'}`
        })
      }
    })
  })
}

/**
 * §7 — экспорт: один или два прохода libx264; двухпроход только с валидным `videoBitrate`.
 */
export async function runFfmpegExportJob(params: {
  ffmpegPath: string
  inputPath: string
  outputPath: string
  trim?: MediaExportTrimPayload
  probeDurationSec?: number | null
  encodePreset?: FfmpegExportEncodePresetId
  /** Контейнер сохранения §7.2 — влияет на хвост argv (MKV без `-movflags`). */
  container?: FfmpegExportContainerId | null
  crf?: number | null
  videoBitrate?: string | null
  audioMode?: FfmpegExportAudioModeId | null
  audioBitrate?: string | null
  fps?: number | null
  scalePreset?: FfmpegExportScalePresetId | null
  videoTransform?: FfmpegExportVideoTransformId | null
  cropPreset?: FfmpegExportCropPresetId | null
  /** §7.2 / v0 — двухпроход без CRF и только с bitrate. */
  twoPass?: boolean | null
  /** §7.2 — целое значение в дБ; `null`/`0` = без `-filter:a volume`. */
  audioGainDb?: number | null
  /** §7.2 — удалить контейнерные метаданные. */
  stripMetadata?: boolean | null
  /** §7.2 — удалить главы. */
  stripChapters?: boolean | null
  /** §7.2 — режим субтитров (`copy` или `drop`). */
  subtitleMode?: FfmpegExportSubtitleModeId | null
  /** §7.2 — `hqdn3d` denoise; `off`/null — без фильтра. */
  videoDenoise?: FfmpegExportVideoDenoiseId | null
  /** §7.2 — `deband`; `off`/null — без фильтра. */
  videoDeband?: FfmpegExportVideoDebandId | null
  /** §7.2 — `histeq`; `off`/null — без фильтра. */
  videoHisteq?: FfmpegExportVideoHisteqId | null
  /** §7.2 — bundled пресет `lut3d`; вместе с `lutResourcesRoot` даёт путь к `.cube`. */
  videoLut3d?: FfmpegExportVideoLut3dId | null
  /** §7.2 — корень `resources/` (dev: app root, prod: `process.resourcesPath`) для `resources/luts/*.cube`. */
  lutResourcesRoot?: string | null
  /** §7.2 — явный путь к `.cube` (тесты / override); иначе вычисляется из `videoLut3d` + `lutResourcesRoot`. */
  videoLut3dCubeAbsPath?: string | null
  /** §7.2 — `unsharp` контурная резкость; `off`/null — без фильтра. */
  videoSharpen?: FfmpegExportVideoSharpenId | null
  /** §7.2 — `eq=...` цветокор-пресет; `off`/null — без фильтра. */
  videoEqPreset?: FfmpegExportVideoEqPresetId | null
  /** §7.2 — `hue` после `eq`; `off`/null — без фильтра. */
  videoHue?: FfmpegExportVideoHueId | null
  /** §7.2 — `noise` зернистость; `off`/null — без фильтра. */
  videoGrain?: FfmpegExportVideoGrainId | null
  /** §7.2 — `vignette`; `off`/null — без фильтра. */
  videoVignette?: FfmpegExportVideoVignetteId | null
  /** §7.2 — `gblur`; `off`/null — без фильтра. */
  videoBlur?: FfmpegExportVideoBlurId | null
  /** §7.2 — `yadif`; `off`/null — без фильтра. */
  videoDeinterlace?: FfmpegExportVideoDeinterlaceId | null
  /** §7.2 — `loudnorm`/`dynaudnorm`; `off`/null — без фильтра. */
  audioNormalize?: FfmpegExportAudioNormalizeId | null
  signal: AbortSignal
  onProgress?: (p: FfmpegExportProgressPayload) => void
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const applyTrim = shouldApplyFfmpegExportTrim(params.trim ?? null, params.probeDurationSec)
  const encodePreset = params.encodePreset ?? 'balance'
  const crf = parseFfmpegExportCrf(params.crf)
  const videoBitrate = parseFfmpegExportVideoBitrate(params.videoBitrate)
  const audioMode = parseFfmpegExportAudioMode(params.audioMode)
  const audioBitrate = parseFfmpegExportAudioBitrate(params.audioBitrate) ?? '192k'
  const fps = parseFfmpegExportFps(params.fps)
  const scalePreset = parseFfmpegExportScalePreset(params.scalePreset)
  const videoTransform = parseFfmpegExportVideoTransform(params.videoTransform)
  const cropPreset = parseFfmpegExportCropPreset(params.cropPreset)
  const container = parseFfmpegExportContainer(params.container ?? 'mp4')
  const wantTwoPass = params.twoPass === true
  const audioGainDb = parseFfmpegExportAudioGainDb(params.audioGainDb)
  const stripMetadata = parseFfmpegExportStripFlag(params.stripMetadata)
  const stripChapters = parseFfmpegExportStripFlag(params.stripChapters)
  const subtitleMode = parseFfmpegExportSubtitleMode(params.subtitleMode)
  const videoDenoise = parseFfmpegExportVideoDenoise(params.videoDenoise)
  const videoDeband = parseFfmpegExportVideoDeband(params.videoDeband)
  const videoHisteq = parseFfmpegExportVideoHisteq(params.videoHisteq)
  const explicitLut =
    typeof params.videoLut3dCubeAbsPath === 'string' && params.videoLut3dCubeAbsPath.trim() !== ''
      ? params.videoLut3dCubeAbsPath.trim()
      : null
  const lutRootRaw = params.lutResourcesRoot
  const lutRoot =
    typeof lutRootRaw === 'string' && lutRootRaw.trim() !== '' ? lutRootRaw.trim() : null
  const videoLut3dId = parseFfmpegExportVideoLut3d(params.videoLut3d)
  const videoLut3dCubeAbsPath =
    explicitLut ??
    (lutRoot !== null ? resolveFfmpegExportLutCubeAbsPath(lutRoot, videoLut3dId) : null)
  const videoSharpen = parseFfmpegExportVideoSharpen(params.videoSharpen)
  const videoEqPreset = parseFfmpegExportVideoEqPreset(params.videoEqPreset)
  const videoHue = parseFfmpegExportVideoHue(params.videoHue)
  const videoGrain = parseFfmpegExportVideoGrain(params.videoGrain)
  const videoVignette = parseFfmpegExportVideoVignette(params.videoVignette)
  const videoBlur = parseFfmpegExportVideoBlur(params.videoBlur)
  const videoDeinterlace = parseFfmpegExportVideoDeinterlace(params.videoDeinterlace)
  const audioNormalize = parseFfmpegExportAudioNormalize(params.audioNormalize)
  if (wantTwoPass && videoBitrate === null) {
    return {
      ok: false,
      error: 'Двухпроходное кодирование доступно только с выбранным видеобитрейтом, не с CRF.'
    }
  }
  const segmentDur = resolveExportSegmentDurationSec(
    params.trim,
    applyTrim,
    params.probeDurationSec
  )

  const baseArgvParams = {
    inputPath: params.inputPath,
    outputPath: params.outputPath,
    container,
    ...(params.trim !== undefined ? { trim: params.trim } : {}),
    applyTrim,
    encodePreset,
    crf,
    videoBitrate,
    audioMode,
    audioBitrate,
    fps,
    scalePreset,
    videoTransform,
    cropPreset,
    ...(audioGainDb !== null ? { audioGainDb } : {}),
    ...(stripMetadata ? { stripMetadata: true } : {}),
    ...(stripChapters ? { stripChapters: true } : {}),
    ...(subtitleMode === 'copy' ? { subtitleMode: 'copy' as const } : {}),
    ...(videoDenoise !== 'off' ? { videoDenoise } : {}),
    ...(videoDeband !== 'off' ? { videoDeband } : {}),
    ...(videoHisteq !== 'off' ? { videoHisteq } : {}),
    ...(videoLut3dCubeAbsPath !== null ? { videoLut3dCubeAbsPath } : {}),
    ...(videoSharpen !== 'off' ? { videoSharpen } : {}),
    ...(videoEqPreset !== 'off' ? { videoEqPreset } : {}),
    ...(videoHue !== 'off' ? { videoHue } : {}),
    ...(videoGrain !== 'off' ? { videoGrain } : {}),
    ...(videoVignette !== 'off' ? { videoVignette } : {}),
    ...(videoBlur !== 'off' ? { videoBlur } : {}),
    ...(videoDeinterlace !== 'off' ? { videoDeinterlace } : {}),
    ...(audioNormalize !== 'off' ? { audioNormalize } : {})
  }

  if (!wantTwoPass) {
    const args = buildFfmpegExportArgv(baseArgvParams)
    return await runFfmpegExportOnce({
      ffmpegPath: params.ffmpegPath,
      args,
      signal: params.signal,
      segmentDur,
      ...(params.onProgress !== undefined ? { onProgress: params.onProgress } : {})
    })
  }

  let tmpDir: string | null = null
  try {
    tmpDir = mkdtempSync(join(tmpdir(), 'fa-x264tw-'))
    const passlogBase = join(tmpDir, 'pass')
    const nullSink = process.platform === 'win32' ? 'NUL' : '/dev/null'

    const argsPass1 = buildFfmpegExportArgv({
      ...baseArgvParams,
      twoPass: { pass: 1, passlogfile: passlogBase, nullDevice: nullSink }
    })
    const r1 = await runFfmpegExportOnce({
      ffmpegPath: params.ffmpegPath,
      args: argsPass1,
      signal: params.signal,
      segmentDur,
      mapPercent: (p) => p * 0.5,
      ...(params.onProgress !== undefined ? { onProgress: params.onProgress } : {})
    })
    if (!r1.ok) {
      return r1
    }
    if (params.signal.aborted) {
      return { ok: false, error: 'Экспорт отменён' }
    }

    params.onProgress?.({ percent: 50, message: 'Второй проход libx264…' })

    const argsPass2 = buildFfmpegExportArgv({
      ...baseArgvParams,
      twoPass: { pass: 2, passlogfile: passlogBase, nullDevice: nullSink }
    })
    return await runFfmpegExportOnce({
      ffmpegPath: params.ffmpegPath,
      args: argsPass2,
      signal: params.signal,
      segmentDur,
      mapPercent: (p) => 50 + p * 0.5,
      ...(params.onProgress !== undefined ? { onProgress: params.onProgress } : {})
    })
  } finally {
    if (tmpDir !== null) {
      try {
        rmSync(tmpDir, { recursive: true, force: true })
      } catch {
        /* каталог временный — ошибки очистки не блокируют UI */
      }
    }
  }
}

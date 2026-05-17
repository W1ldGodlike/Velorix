import { isAbsolute, normalize } from 'path'

import {
  DEFAULT_EDITOR_URL_PASTE_BEHAVIOR,
  parseEditorUrlPasteBehavior
} from '../shared/editor-url-paste-behavior'
import {
  DEFAULT_FFMPEG_EXPORT_BATCH_OUTPUT_SUFFIX,
  parseFfmpegExportBatchOutputSuffixTemplate
} from '../shared/ffmpeg-export-batch-output-suffix'
import { parseFfmpegExportHwDecode } from '../shared/ffmpeg-export-hw-decode'
import { parseFfmpegSnapshotFormat } from './ffmpeg-frame-snapshot-service'
import {
  parseFfmpegExportAudioNormalize,
  parseFfmpegExportContainer,
  parseFfmpegExportCropPreset,
  parseFfmpegExportAudioBitrate,
  parseFfmpegExportAudioGainDb,
  parseFfmpegExportAudioMode,
  parseFfmpegExportCrf,
  parseFfmpegExportEncodePreset,
  parseFfmpegExportFps,
  parseFfmpegExportScalePreset,
  parseFfmpegExportStripFlag,
  parseFfmpegExportSubtitleMode,
  parseFfmpegExportVideoDeband,
  parseFfmpegExportVideoHisteq,
  parseFfmpegExportVideoDenoise,
  parseFfmpegExportVideoEqPreset,
  parseFfmpegExportVideoGrain,
  parseFfmpegExportVideoLut3d,
  parseFfmpegExportVideoVignette,
  parseFfmpegExportVideoBlur,
  parseFfmpegExportVideoDeinterlace,
  parseFfmpegExportVideoHue,
  parseFfmpegExportVideoSharpen,
  parseFfmpegExportVideoTransform,
  parseFfmpegExportUserPresetSnapshot,
  parseFfmpegExportUserPresetsList,
  parseFfmpegExportVideoBitrate,
  parseFfmpegExportVideoCodec,
  parseFfmpegExportEconomyMode,
  parseFfmpegExportTwoPass
} from './ffmpeg-export-service'
import { mergeFfmpegExportSnapshotIntoAppSettings } from './ffmpeg-export-app-settings-merge'
import type { AppSettings } from './settings-store'
import type { FfmpegExportSettingsPersisters } from './ipc/register-settings-ipc'
import { commit, snapshot, type MainSettingsAccess } from './settings-ipc-persist-core'

export function createFfmpegExportSettingsPersisters(
  access: MainSettingsAccess
): FfmpegExportSettingsPersisters {
  function persistFfmpegExportEncodePreset(raw: unknown): AppSettings {
    const id = parseFfmpegExportEncodePreset(raw)
    return commit(access, { ...access.get(), ffmpegExportEncodePreset: id })
  }

  /** §7.2 / §16 — видеокодек экспорта (libx264 по умолчанию — ключ удаляем). */
  function persistFfmpegExportVideoCodec(raw: unknown): AppSettings {
    const id = parseFfmpegExportVideoCodec(raw)
    const next = { ...access.get() }
    if (id === 'libx264') {
      delete next.ffmpegExportVideoCodec
    } else {
      next.ffmpegExportVideoCodec = id
      if (next.ffmpegExportTwoPass === true) {
        delete next.ffmpegExportTwoPass
      }
    }
    return commit(access, next)
  }

  /** §7.2 — контейнер экспорта по умолчанию; влияет на defaultPath и расширение save dialog. */
  function persistFfmpegExportContainer(raw: unknown): AppSettings {
    const id = parseFfmpegExportContainer(raw)
    return commit(access, { ...access.get(), ffmpegExportContainer: id })
  }

  function persistFfmpegExportCrf(raw: unknown): AppSettings {
    const value = parseFfmpegExportCrf(raw)
    const next = { ...access.get() }
    if (value === null) {
      delete next.ffmpegExportCrf
    } else {
      next.ffmpegExportCrf = value
    }
    return commit(access, next)
  }

  function persistFfmpegExportAudioBitrate(raw: unknown): AppSettings {
    const value = parseFfmpegExportAudioBitrate(raw)
    const next = { ...access.get() }
    if (value === null) {
      delete next.ffmpegExportAudioBitrate
    } else {
      next.ffmpegExportAudioBitrate = value
    }
    return commit(access, next)
  }

  function persistFfmpegExportAudioMode(raw: unknown): AppSettings {
    const value = parseFfmpegExportAudioMode(raw)
    const next = { ...access.get() }
    if (value === 'aac') {
      delete next.ffmpegExportAudioMode
    } else {
      next.ffmpegExportAudioMode = value
    }
    return commit(access, next)
  }

  function persistFfmpegExportVideoBitrate(raw: unknown): AppSettings {
    const value = parseFfmpegExportVideoBitrate(raw)
    const next = { ...access.get() }
    if (value === null) {
      delete next.ffmpegExportVideoBitrate
    } else {
      next.ffmpegExportVideoBitrate = value
    }
    return commit(access, next)
  }

  /** §7.2 / v0 — двухпроходное libx264 (требует сохранённого video bitrate при экспорте). */
  function persistFfmpegExportTwoPass(raw: unknown): AppSettings {
    const next = { ...access.get() }
    if (parseFfmpegExportTwoPass(raw)) {
      next.ffmpegExportTwoPass = true
    } else {
      delete next.ffmpegExportTwoPass
    }
    return commit(access, next)
  }

  /** §7.3 — экономный режим (`-threads 1`). */
  function persistFfmpegExportEconomyMode(raw: unknown): AppSettings {
    const next = { ...access.get() }
    if (parseFfmpegExportEconomyMode(raw)) {
      next.ffmpegExportEconomyMode = true
    } else {
      delete next.ffmpegExportEconomyMode
    }
    return commit(access, next)
  }

  function persistFfmpegExportHwDecode(raw: unknown): AppSettings {
    const next = { ...access.get() }
    if (parseFfmpegExportHwDecode(raw)) {
      next.ffmpegExportHwDecode = true
    } else {
      delete next.ffmpegExportHwDecode
    }
    return commit(access, next)
  }

  function persistFfmpegExportExtraArgsLine(raw: unknown): AppSettings {
    const next = { ...access.get() }
    if (typeof raw !== 'string') {
      return snapshot(access)
    }
    const trimmed = raw.trim().slice(0, 1200)
    if (trimmed.length === 0) {
      delete next.ffmpegExportExtraArgsLine
    } else {
      next.ffmpegExportExtraArgsLine = trimmed
    }
    return commit(access, next)
  }

  function persistFfmpegExportBatchOutputSuffix(raw: unknown): AppSettings {
    const next = { ...access.get() }
    if (typeof raw !== 'string') {
      return snapshot(access)
    }
    const parsed = parseFfmpegExportBatchOutputSuffixTemplate(raw)
    if (!parsed.ok) {
      return snapshot(access)
    }
    if (parsed.template === DEFAULT_FFMPEG_EXPORT_BATCH_OUTPUT_SUFFIX) {
      delete next.ffmpegExportBatchOutputSuffix
    } else {
      next.ffmpegExportBatchOutputSuffix = parsed.template
    }
    return commit(access, next)
  }

  function persistFfmpegExportBatchOutputDirectory(raw: unknown): AppSettings {
    const next = { ...access.get() }
    if (raw === null || raw === '') {
      delete next.ffmpegExportBatchOutputDirectory
      return commit(access, next)
    }
    if (typeof raw !== 'string') {
      return snapshot(access)
    }
    const n = normalize(raw.trim())
    if (!isAbsolute(n) || n.length > 4096) {
      return snapshot(access)
    }
    next.ffmpegExportBatchOutputDirectory = n
    return commit(access, next)
  }

  function persistEditorUrlPasteBehavior(raw: unknown): AppSettings {
    const next = { ...access.get() }
    const behavior = parseEditorUrlPasteBehavior(raw)
    if (behavior === DEFAULT_EDITOR_URL_PASTE_BEHAVIOR) {
      delete next.editorUrlPasteBehavior
    } else {
      next.editorUrlPasteBehavior = behavior
    }
    return commit(access, next)
  }

  function persistFfmpegExportAudioGainDb(raw: unknown): AppSettings {
    const value = parseFfmpegExportAudioGainDb(raw)
    const next = { ...access.get() }
    if (value === null) {
      delete next.ffmpegExportAudioGainDb
    } else {
      next.ffmpegExportAudioGainDb = value
    }
    return commit(access, next)
  }

  function persistFfmpegExportStripMetadata(raw: unknown): AppSettings {
    const next = { ...access.get() }
    if (parseFfmpegExportStripFlag(raw)) {
      next.ffmpegExportStripMetadata = true
    } else {
      delete next.ffmpegExportStripMetadata
    }
    return commit(access, next)
  }

  function persistFfmpegExportStripChapters(raw: unknown): AppSettings {
    const next = { ...access.get() }
    if (parseFfmpegExportStripFlag(raw)) {
      next.ffmpegExportStripChapters = true
    } else {
      delete next.ffmpegExportStripChapters
    }
    return commit(access, next)
  }

  function persistFfmpegExportSubtitleMode(raw: unknown): AppSettings {
    const value = parseFfmpegExportSubtitleMode(raw)
    const next = { ...access.get() }
    if (value === 'copy') {
      next.ffmpegExportSubtitleMode = 'copy'
    } else {
      delete next.ffmpegExportSubtitleMode
    }
    return commit(access, next)
  }

  function persistFfmpegExportVideoDenoise(raw: unknown): AppSettings {
    const value = parseFfmpegExportVideoDenoise(raw)
    const next = { ...access.get() }
    if (value === 'off') {
      delete next.ffmpegExportVideoDenoise
    } else {
      next.ffmpegExportVideoDenoise = value
    }
    return commit(access, next)
  }

  function persistFfmpegExportVideoDeband(raw: unknown): AppSettings {
    const value = parseFfmpegExportVideoDeband(raw)
    const next = { ...access.get() }
    if (value === 'off') {
      delete next.ffmpegExportVideoDeband
    } else {
      next.ffmpegExportVideoDeband = value
    }
    return commit(access, next)
  }

  function persistFfmpegExportVideoHisteq(raw: unknown): AppSettings {
    const value = parseFfmpegExportVideoHisteq(raw)
    const next = { ...access.get() }
    if (value === 'off') {
      delete next.ffmpegExportVideoHisteq
    } else {
      next.ffmpegExportVideoHisteq = value
    }
    return commit(access, next)
  }

  function persistFfmpegExportVideoLut3d(raw: unknown): AppSettings {
    const value = parseFfmpegExportVideoLut3d(raw)
    const next = { ...access.get() }
    if (value === 'off') {
      delete next.ffmpegExportVideoLut3d
    } else {
      next.ffmpegExportVideoLut3d = value
    }
    return commit(access, next)
  }

  function persistFfmpegExportVideoSharpen(raw: unknown): AppSettings {
    const value = parseFfmpegExportVideoSharpen(raw)
    const next = { ...access.get() }
    if (value === 'off') {
      delete next.ffmpegExportVideoSharpen
    } else {
      next.ffmpegExportVideoSharpen = value
    }
    return commit(access, next)
  }

  function persistFfmpegExportVideoEqPreset(raw: unknown): AppSettings {
    const value = parseFfmpegExportVideoEqPreset(raw)
    const next = { ...access.get() }
    if (value === 'off') {
      delete next.ffmpegExportVideoEqPreset
    } else {
      next.ffmpegExportVideoEqPreset = value
    }
    return commit(access, next)
  }

  function persistFfmpegExportVideoGrain(raw: unknown): AppSettings {
    const value = parseFfmpegExportVideoGrain(raw)
    const next = { ...access.get() }
    if (value === 'off') {
      delete next.ffmpegExportVideoGrain
    } else {
      next.ffmpegExportVideoGrain = value
    }
    return commit(access, next)
  }

  function persistFfmpegExportVideoVignette(raw: unknown): AppSettings {
    const value = parseFfmpegExportVideoVignette(raw)
    const next = { ...access.get() }
    if (value === 'off') {
      delete next.ffmpegExportVideoVignette
    } else {
      next.ffmpegExportVideoVignette = value
    }
    return commit(access, next)
  }

  function persistFfmpegExportVideoBlur(raw: unknown): AppSettings {
    const value = parseFfmpegExportVideoBlur(raw)
    const next = { ...access.get() }
    if (value === 'off') {
      delete next.ffmpegExportVideoBlur
    } else {
      next.ffmpegExportVideoBlur = value
    }
    return commit(access, next)
  }

  function persistFfmpegExportVideoDeinterlace(raw: unknown): AppSettings {
    const value = parseFfmpegExportVideoDeinterlace(raw)
    const next = { ...access.get() }
    if (value === 'off') {
      delete next.ffmpegExportVideoDeinterlace
    } else {
      next.ffmpegExportVideoDeinterlace = value
    }
    return commit(access, next)
  }

  function persistFfmpegExportVideoHue(raw: unknown): AppSettings {
    const value = parseFfmpegExportVideoHue(raw)
    const next = { ...access.get() }
    if (value === 'off') {
      delete next.ffmpegExportVideoHue
    } else {
      next.ffmpegExportVideoHue = value
    }
    return commit(access, next)
  }

  function persistFfmpegExportAudioNormalize(raw: unknown): AppSettings {
    const value = parseFfmpegExportAudioNormalize(raw)
    const next = { ...access.get() }
    if (value === 'off') {
      delete next.ffmpegExportAudioNormalize
    } else {
      next.ffmpegExportAudioNormalize = value
    }
    return commit(access, next)
  }

  function persistFfmpegExportFps(raw: unknown): AppSettings {
    const value = parseFfmpegExportFps(raw)
    const next = { ...access.get() }
    if (value === null) {
      delete next.ffmpegExportFps
    } else {
      next.ffmpegExportFps = value
    }
    return commit(access, next)
  }

  function persistFfmpegExportScalePreset(raw: unknown): AppSettings {
    const value = parseFfmpegExportScalePreset(raw)
    const next = { ...access.get() }
    if (value === 'source') {
      delete next.ffmpegExportScalePreset
    } else {
      next.ffmpegExportScalePreset = value
    }
    return commit(access, next)
  }

  function persistFfmpegExportVideoTransform(raw: unknown): AppSettings {
    const value = parseFfmpegExportVideoTransform(raw)
    const next = { ...access.get() }
    if (value === 'none') {
      delete next.ffmpegExportVideoTransform
    } else {
      next.ffmpegExportVideoTransform = value
    }
    return commit(access, next)
  }

  function persistFfmpegExportCropPreset(raw: unknown): AppSettings {
    const value = parseFfmpegExportCropPreset(raw)
    const next = { ...access.get() }
    if (value === 'none') {
      delete next.ffmpegExportCropPreset
    } else {
      next.ffmpegExportCropPreset = value
    }
    return commit(access, next)
  }

  function persistFfmpegSnapshotFormat(raw: unknown): AppSettings {
    const value = parseFfmpegSnapshotFormat(raw)
    const next = { ...access.get() }
    if (value === 'png') {
      delete next.ffmpegSnapshotFormat
    } else {
      next.ffmpegSnapshotFormat = value
    }
    return commit(access, next)
  }

  /** §7.2 — заменить список пользовательских пресетов экспорта (валидированный массив). */
  function persistFfmpegExportUserPresets(raw: unknown): AppSettings {
    const list = parseFfmpegExportUserPresetsList(raw)
    const next = { ...access.get() }
    if (list.length === 0) {
      delete next.ffmpegExportUserPresets
    } else {
      next.ffmpegExportUserPresets = list
    }
    return commit(access, next)
  }

  /** §7.2 — применить снимок пресета к полям экспорта в settings одним сохранением. */
  function persistFfmpegExportApplySnapshot(raw: unknown): AppSettings {
    const presetSnapshot = parseFfmpegExportUserPresetSnapshot(raw)
    if (!presetSnapshot) {
      return snapshot(access)
    }
    return commit(access, mergeFfmpegExportSnapshotIntoAppSettings(access.get(), presetSnapshot))
  }

  return {
    encodePreset: persistFfmpegExportEncodePreset,
    videoCodec: persistFfmpegExportVideoCodec,
    container: persistFfmpegExportContainer,
    crf: persistFfmpegExportCrf,
    audioBitrate: persistFfmpegExportAudioBitrate,
    audioMode: persistFfmpegExportAudioMode,
    videoBitrate: persistFfmpegExportVideoBitrate,
    twoPass: persistFfmpegExportTwoPass,
    economyMode: persistFfmpegExportEconomyMode,
    hwDecode: persistFfmpegExportHwDecode,
    extraArgsLine: persistFfmpegExportExtraArgsLine,
    batchOutputSuffix: persistFfmpegExportBatchOutputSuffix,
    batchOutputDirectory: persistFfmpegExportBatchOutputDirectory,
    editorUrlPasteBehavior: persistEditorUrlPasteBehavior,
    fps: persistFfmpegExportFps,
    scalePreset: persistFfmpegExportScalePreset,
    videoTransform: persistFfmpegExportVideoTransform,
    cropPreset: persistFfmpegExportCropPreset,
    audioGainDb: persistFfmpegExportAudioGainDb,
    stripMetadata: persistFfmpegExportStripMetadata,
    stripChapters: persistFfmpegExportStripChapters,
    subtitleMode: persistFfmpegExportSubtitleMode,
    videoDenoise: persistFfmpegExportVideoDenoise,
    videoDeband: persistFfmpegExportVideoDeband,
    videoHisteq: persistFfmpegExportVideoHisteq,
    videoLut3d: persistFfmpegExportVideoLut3d,
    videoSharpen: persistFfmpegExportVideoSharpen,
    videoEqPreset: persistFfmpegExportVideoEqPreset,
    videoGrain: persistFfmpegExportVideoGrain,
    videoVignette: persistFfmpegExportVideoVignette,
    videoBlur: persistFfmpegExportVideoBlur,
    videoDeinterlace: persistFfmpegExportVideoDeinterlace,
    videoHue: persistFfmpegExportVideoHue,
    audioNormalize: persistFfmpegExportAudioNormalize,
    snapshotFormat: persistFfmpegSnapshotFormat,
    userPresets: persistFfmpegExportUserPresets,
    applySnapshot: persistFfmpegExportApplySnapshot
  }
}

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
import {
  parseFfmpegExportAudioBitrate,
  parseFfmpegExportAudioMode,
  parseFfmpegExportContainer,
  parseFfmpegExportCrf,
  parseFfmpegExportEncodePreset,
  parseFfmpegExportEconomyMode,
  parseFfmpegExportTwoPass,
  parseFfmpegExportVideoBitrate,
  parseFfmpegExportVideoCodec
} from './ffmpeg-export-service'
import type { AppSettings } from './settings-store'
import type { FfmpegExportSettingsPersisters } from './ipc/register-settings-ipc'
import { commit, snapshot, type MainSettingsAccess } from './settings-ipc-persist-core'

export function createFfmpegExportSettingsPersistersCore(
  access: MainSettingsAccess
): Pick<
  FfmpegExportSettingsPersisters,
  | 'encodePreset'
  | 'videoCodec'
  | 'container'
  | 'crf'
  | 'audioBitrate'
  | 'audioMode'
  | 'videoBitrate'
  | 'twoPass'
  | 'economyMode'
  | 'hwDecode'
  | 'extraArgsLine'
  | 'batchOutputSuffix'
  | 'batchOutputDirectory'
  | 'editorUrlPasteBehavior'
> {
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
    editorUrlPasteBehavior: persistEditorUrlPasteBehavior
  }
}

import { parseFfmpegSnapshotFormat } from '../ffmpeg/ffmpeg-frame-snapshot-service'
import {
  parseFfmpegExportAudioGainDb,
  parseFfmpegExportAudioNormalize,
  parseFfmpegExportCropPreset,
  parseFfmpegExportFps,
  parseFfmpegExportScalePreset,
  parseFfmpegExportStripFlag,
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
} from '../ffmpeg/ffmpeg-export-service'
import type { AppSettings } from './settings-store'
import type { FfmpegExportSettingsPersisters } from '../../ipc/register-settings-ipc'
import { commit, type MainSettingsAccess } from './settings-ipc-persist-core'

export function createFfmpegExportSettingsPersistersOutput(
  access: MainSettingsAccess
): Pick<
  FfmpegExportSettingsPersisters,
  | 'audioGainDb'
  | 'stripMetadata'
  | 'stripChapters'
  | 'subtitleMode'
  | 'videoDenoise'
  | 'videoDeband'
  | 'videoHisteq'
  | 'videoLut3d'
  | 'videoSharpen'
  | 'videoEqPreset'
  | 'videoGrain'
  | 'videoVignette'
  | 'videoBlur'
  | 'videoDeinterlace'
  | 'videoHue'
  | 'audioNormalize'
  | 'fps'
  | 'scalePreset'
  | 'videoTransform'
  | 'cropPreset'
  | 'snapshotFormat'
> {
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
  return {
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
    fps: persistFfmpegExportFps,
    scalePreset: persistFfmpegExportScalePreset,
    videoTransform: persistFfmpegExportVideoTransform,
    cropPreset: persistFfmpegExportCropPreset,
    snapshotFormat: persistFfmpegSnapshotFormat
  }
}

/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const srcPath = path.join('src/main/settings-ipc-persist.ts')
const lines = execSync(`git show HEAD:${srcPath.replace(/\\/g, '/')}`, {
  encoding: 'utf8'
}).split(/\r?\n/)

const coreHeader = `import type { AppSettings, AppSettingsView, AppTheme, ResolvedAppTheme } from './settings-store'
import type { FfmpegExportSettingsPersisters } from './ipc/register-settings-ipc'
import type { DownloadsWindowUiLocale } from '../shared/downloads-window-ui-locale'
import type { EnginePathOverridesPatch } from './engine-service'

export type MainSettingsAccess = {
  get: () => AppSettings
  set: (next: AppSettings) => void
  save: () => void
}

export type SettingsIpcPersistHooks = {
  resolveEffectiveTheme: (pref: AppTheme) => ResolvedAppTheme
  buildApplicationMenu: () => void
  syncDownloadsPopoutHtmlToLocale: (locale: DownloadsWindowUiLocale) => void
  refreshEnginePathOverridesSnapshot: () => void
}

export function commit(access: MainSettingsAccess, next: AppSettings): AppSettings {
  access.set(next)
  access.save()
  return { ...next }
}

export function snapshot(access: MainSettingsAccess): AppSettings {
  return { ...access.get() }
}

export type SettingsIpcPersistApi = {
  ffmpegExport: FfmpegExportSettingsPersisters
  persistUiLocale: (raw: unknown) => AppSettings
  persistThemePreference: (pref: AppTheme) => AppSettingsView
  persistEnginePathOverridesPatch: (patch: EnginePathOverridesPatch) => AppSettings
  persistMainWindowUiPanelsMerge: (raw: unknown) => AppSettings
}
`

const shellImports = `import { existsSync, statSync } from 'fs'
import { isAbsolute, normalize } from 'path'

import { BrowserWindow } from 'electron'

import { mainWindowIpc as mw } from '../shared/ipc-channels'
import type { MainWindowUiPanelState } from '../shared/settings-contract'
import { parseDownloadsWindowUiLocale } from '../shared/downloads-window-ui-locale'
import {
  ENGINE_IDS,
  type EnginePathOverrides,
  type EnginePathOverridesPatch
} from './engine-service'
import type { AppSettings, AppSettingsView, AppTheme } from './settings-store'
import {
  commit,
  snapshot,
  type MainSettingsAccess,
  type SettingsIpcPersistHooks
} from './settings-ipc-persist-core'
`

// Skip duplicate validateEngineOverridePath (original ~98–108); shell defines it once above.
const shellBody = lines.slice(108, 192).concat(lines.slice(604, 636)).join('\n')

const shellFn = `${shellImports}
export function createSettingsShellPersist(
  access: MainSettingsAccess,
  hooks: SettingsIpcPersistHooks
): Pick<
  import('./settings-ipc-persist-core').SettingsIpcPersistApi,
  | 'persistUiLocale'
  | 'persistThemePreference'
  | 'persistEnginePathOverridesPatch'
  | 'persistMainWindowUiPanelsMerge'
> {
  function validateEngineOverridePath(raw: string): string | null {
    const normalized = normalize(raw.trim())
    if (!isAbsolute(normalized) || normalized.length > 4096 || !existsSync(normalized)) {
      return null
    }
    try {
      return statSync(normalized).isFile() ? normalized : null
    } catch {
      return null
    }
  }

${shellBody}

  return {
    persistUiLocale,
    persistThemePreference,
    persistEnginePathOverridesPatch,
    persistMainWindowUiPanelsMerge
  }
}
`

const ffmpegImports = `import {
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
`

const ffmpegBody = lines.slice(193, 603).join('\n')

const ffmpegFn = `${ffmpegImports}
export function createFfmpegExportSettingsPersisters(
  access: MainSettingsAccess
): FfmpegExportSettingsPersisters {
${ffmpegBody}

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
`

const entry = `export type {
  MainSettingsAccess,
  SettingsIpcPersistApi,
  SettingsIpcPersistHooks
} from './settings-ipc-persist-core'
export { commit, snapshot } from './settings-ipc-persist-core'

import type { MainSettingsAccess, SettingsIpcPersistApi, SettingsIpcPersistHooks } from './settings-ipc-persist-core'
import { createFfmpegExportSettingsPersisters } from './settings-ipc-persist-ffmpeg'
import { createSettingsShellPersist } from './settings-ipc-persist-shell'

export function createSettingsIpcPersist(
  access: MainSettingsAccess,
  hooks: SettingsIpcPersistHooks
): SettingsIpcPersistApi {
  return {
    ...createSettingsShellPersist(access, hooks),
    ffmpegExport: createFfmpegExportSettingsPersisters(access)
  }
}
`

fs.writeFileSync(path.join('src/main', 'settings-ipc-persist-core.ts'), coreHeader)
fs.writeFileSync(path.join('src/main', 'settings-ipc-persist-shell.ts'), shellFn)
fs.writeFileSync(path.join('src/main', 'settings-ipc-persist-ffmpeg.ts'), ffmpegFn)
fs.writeFileSync(srcPath, entry)
console.log('split settings-ipc-persist OK')

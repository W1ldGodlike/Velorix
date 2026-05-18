import { readFileSync, writeFileSync } from 'node:fs'

const lines = readFileSync('src/main/index.ts', 'utf8').split(/\r?\n/)

/** 1-based inclusive line ranges from src/main/index.ts */
const ranges = [
  [544, 555],
  [556, 586],
  [1012, 1039],
  [1049, 1070],
  [1073, 1558],
  [1560, 1572],
  [1578, 1593]
]

let body = ranges.map(([a, b]) => lines.slice(a - 1, b).join('\n')).join('\n\n')

body = body.replace(/\bcachedSettings\b/g, 'access.get()')
body = body.replace(
  /access\.get\(\) = ([^\n]+)\n {2}saveSettings\(settingsPath\(\), access\.get\(\)\)/g,
  'return commit(access, $1)'
)
body = body.replace(/saveSettings\(settingsPath\(\), access\.get\(\)\)/g, 'access.save()')
body = body.replace(
  /access\.get\(\) = ([^\n]+)\n {2}access\.save\(\)/g,
  'return commit(access, $1)'
)
body = body.replace(/return \{ \.\.\.access\.get\(\) \}/g, 'return snapshot(access)')
body = body.replace(/return access\.get\(\)\s*$/gm, 'return snapshot(access)')

body = body.replace(
  /refreshEnginePathOverridesSnapshot\(\)/g,
  'hooks.refreshEnginePathOverridesSnapshot()'
)
body = body.replace(/\bbuildApplicationMenu\(\)/g, 'hooks.buildApplicationMenu()')
body = body.replace(/syncDownloadsPopoutHtmlToLocale\(/g, 'hooks.syncDownloadsPopoutHtmlToLocale(')
body = body.replace(/resolveEffectiveTheme\(/g, 'hooks.resolveEffectiveTheme(')

body = body.replace(/^function /gm, '  function ')

// persistMainWindowUiPanelsMerge block
body = body.replace(
  /access\.get\(\) = \{\n {4}\.\.\.access\.get\(\),\n {4}mainWindowUiPanels: \{[\s\S]*? {2}\}\n {2}access\.save\(\)\n {2}const snapshot = access\.get\(\)\.mainWindowUiPanels/,
  `const next: AppSettings = {
    ...access.get(),
    mainWindowUiPanels: {
      ...(access.get().mainWindowUiPanels ?? {}),
      ...patch
    }
  }
  access.set(next)
  access.save()
  const panelsSnapshot = next.mainWindowUiPanels`
)

body = body.replace(
  /w\.webContents\.send\(mw\.mainWindowUiPanelsChanged, snapshot \?\? \{\}\)/,
  'w.webContents.send(mw.mainWindowUiPanelsChanged, panelsSnapshot ?? {})'
)

// persistThemePreference — commit then broadcast
body = body.replace(
  /return commit\(access, \{ \.\.\.access\.get\(\), theme: pref \}\)\n {2}const resolved = hooks\.resolveEffectiveTheme\(pref\)/,
  `const next = { ...access.get(), theme: pref }
  access.set(next)
  access.save()
  const resolved = hooks.resolveEffectiveTheme(pref)`
)

// persistUiLocale
body = body.replace(
  /return commit\(access, \{ \.\.\.access\.get\(\), uiLocale: v \}\)\n {2}hooks\.buildApplicationMenu\(\)/,
  `const next = { ...access.get(), uiLocale: v }
  access.set(next)
  access.save()
  hooks.buildApplicationMenu()`
)

// Remove duplicate return snapshot after commit in simple persisters
body = body.replace(
  /return commit\(access, \{ \.\.\.access\.get\(\), ffmpegExportEncodePreset: id \}\)\n {2}return snapshot\(access\)/,
  'return commit(access, { ...access.get(), ffmpegExportEncodePreset: id })'
)

// applySnapshot merge
body = body.replace(
  /access\.get\(\) = mergeFfmpegExportSnapshotIntoAppSettings\(access\.get\(\), snapshot\)\n {2}access\.save\(\)/,
  'return commit(access, mergeFfmpegExportSnapshotIntoAppSettings(access.get(), snapshot))'
)

const header = `import { existsSync, statSync } from 'fs'
import { isAbsolute, normalize } from 'path'

import { BrowserWindow } from 'electron'

import { mainWindowIpc as mw } from '../shared/ipc-channels'
import {
  DEFAULT_EDITOR_URL_PASTE_BEHAVIOR,
  parseEditorUrlPasteBehavior
} from '../shared/editor-url-paste-behavior'
import {
  DEFAULT_FFMPEG_EXPORT_BATCH_OUTPUT_SUFFIX,
  parseFfmpegExportBatchOutputSuffixTemplate
} from '../shared/ffmpeg-export-batch-output-suffix'
import { parseFfmpegExportHwDecode } from '../shared/ffmpeg-export-hw-decode'
import type { MainWindowUiPanelState } from '../shared/settings-contract'
import {
  parseAppUiLocale,
  type AppUiLocale
} from '../shared/app-ui-locale'
import { parseFfmpegSnapshotFormat } from './ffmpeg-frame-snapshot-service'
import {
  mergeFfmpegExportSnapshotIntoAppSettings,
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
import {
  ENGINE_IDS,
  type EnginePathOverrides,
  type EnginePathOverridesPatch
} from './engine-service'
import type {
  AppSettings,
  AppSettingsView,
  AppTheme,
  ResolvedAppTheme
} from './settings-store'
import type { FfmpegExportSettingsPersisters } from './ipc/register-settings-ipc'

export type MainSettingsAccess = {
  get: () => AppSettings
  set: (next: AppSettings) => void
  save: () => void
}

export type SettingsIpcPersistHooks = {
  resolveEffectiveTheme: (pref: AppTheme) => ResolvedAppTheme
  buildApplicationMenu: () => void
  syncDownloadsPopoutHtmlToLocale: (locale: AppUiLocale) => void
  refreshEnginePathOverridesSnapshot: () => void
}

function commit(access: MainSettingsAccess, next: AppSettings): AppSettings {
  access.set(next)
  access.save()
  return { ...next }
}

function snapshot(access: MainSettingsAccess): AppSettings {
  return { ...access.get() }
}

export type SettingsIpcPersistApi = {
  ffmpegExport: FfmpegExportSettingsPersisters
  persistUiLocale: (raw: unknown) => AppSettings
  persistThemePreference: (pref: AppTheme) => AppSettingsView
  persistEnginePathOverridesPatch: (patch: EnginePathOverridesPatch) => AppSettings
  persistMainWindowUiPanelsMerge: (raw: unknown) => AppSettings
}

export function createSettingsIpcPersist(
  access: MainSettingsAccess,
  hooks: SettingsIpcPersistHooks
): SettingsIpcPersistApi {
`

const footer = `
  return {
    ffmpegExport: {
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
    },
    persistUiLocale,
    persistThemePreference,
    persistEnginePathOverridesPatch,
    persistMainWindowUiPanelsMerge
  }
}
`

writeFileSync('src/main/settings-ipc-persist.ts', header + body + footer)
console.log('[build-settings-ipc-persist] OK', body.split('\n').length, 'lines body')

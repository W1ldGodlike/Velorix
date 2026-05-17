import fs from 'node:fs'
import path from 'node:path'

const outDir = path.join('src/main')
const lines = fs
  .readFileSync(path.join(outDir, 'settings-ipc-persist-ffmpeg.ts'), 'utf8')
  .split(/\r?\n/)

const coreImports = `import { isAbsolute, normalize } from 'path'

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

`

const outputImports = `import { parseFfmpegSnapshotFormat } from './ffmpeg-frame-snapshot-service'
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
} from './ffmpeg-export-service'
import type { AppSettings } from './settings-store'
import type { FfmpegExportSettingsPersisters } from './ipc/register-settings-ipc'
import { commit, type MainSettingsAccess } from './settings-ipc-persist-core'

`

const presetsImports = `import {
  parseFfmpegExportUserPresetSnapshot,
  parseFfmpegExportUserPresetsList
} from './ffmpeg-export-service'
import { mergeFfmpegExportSnapshotIntoAppSettings } from './ffmpeg-export-app-settings-merge'
import type { AppSettings } from './settings-store'
import type { FfmpegExportSettingsPersisters } from './ipc/register-settings-ipc'
import { commit, snapshot, type MainSettingsAccess } from './settings-ipc-persist-core'

`

const coreFns = lines.slice(52, 212).join('\n')
const outputFns = lines.slice(213, 441).join('\n')
const presetsFns = lines.slice(442, 462).join('\n')

const returnCore = `  return {
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
  }`

const returnOutput = `  return {
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
  }`

const returnPresets = `  return {
    userPresets: persistFfmpegExportUserPresets,
    applySnapshot: persistFfmpegExportApplySnapshot
  }`

fs.writeFileSync(
  path.join(outDir, 'settings-ipc-persist-ffmpeg-core.ts'),
  `${coreImports}export function createFfmpegExportSettingsPersistersCore(
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
${coreFns}
${returnCore}
}
`
)

fs.writeFileSync(
  path.join(outDir, 'settings-ipc-persist-ffmpeg-output.ts'),
  `${outputImports}export function createFfmpegExportSettingsPersistersOutput(
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
${outputFns}
${returnOutput}
}
`
)

fs.writeFileSync(
  path.join(outDir, 'settings-ipc-persist-ffmpeg-presets.ts'),
  `${presetsImports}export function createFfmpegExportSettingsPersistersPresets(
  access: MainSettingsAccess
): Pick<FfmpegExportSettingsPersisters, 'userPresets' | 'applySnapshot'> {
${presetsFns}
${returnPresets}
}
`
)

const orchestrator = `import type { FfmpegExportSettingsPersisters } from './ipc/register-settings-ipc'
import type { MainSettingsAccess } from './settings-ipc-persist-core'
import { createFfmpegExportSettingsPersistersCore } from './settings-ipc-persist-ffmpeg-core'
import { createFfmpegExportSettingsPersistersOutput } from './settings-ipc-persist-ffmpeg-output'
import { createFfmpegExportSettingsPersistersPresets } from './settings-ipc-persist-ffmpeg-presets'

export function createFfmpegExportSettingsPersisters(
  access: MainSettingsAccess
): FfmpegExportSettingsPersisters {
  return {
    ...createFfmpegExportSettingsPersistersCore(access),
    ...createFfmpegExportSettingsPersistersOutput(access),
    ...createFfmpegExportSettingsPersistersPresets(access)
  }
}
`

fs.writeFileSync(path.join(outDir, 'settings-ipc-persist-ffmpeg.ts'), orchestrator)
console.log('split settings-ipc-persist-ffmpeg OK')

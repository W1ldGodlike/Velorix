import type { AppSettings } from '../../shared/settings-contract'
import type { FfmpegExportUserPresetSnapshot } from '../../shared/ffmpeg-export-contract'
import type { FfmpegExportVideoCodecId } from '../../shared/ffmpeg-export-contract'
import type { parseFfmpegExportExtraArgsLine } from '../../shared/ffmpeg-export-extra-args'
import type { resolveFfmpegExportHwaccelForDecode } from '../../shared/ffmpeg-export-hw-decode'
import type { resolveExternalFilterScriptForPreview } from '../../shared/external-filter-script-resolve-preview'
import type { FfmpegExportSelectOptions } from './editor-export-select-options'
import type { buildEditorFfmpegExportOverrides } from './editor-export-settings-snapshot-build'

export type EditorExportSettingsDerivedBundle = {
  ffmpegExportSelectOptions: FfmpegExportSelectOptions
  exportVideoCodecResolvedForPreview: Exclude<FfmpegExportVideoCodecId, 'hw_auto' | 'hw_auto_hevc'>
  exportExtraArgsParsed: ReturnType<typeof parseFfmpegExportExtraArgsLine>
  exportHwaccelDecodeForPreview: ReturnType<typeof resolveFfmpegExportHwaccelForDecode>
  exportCodecStatusbarLabel: string
  exportCodecStatusbarTitle: string
  exportCodecStatusbarAria: string
  refetchHwEncoders: () => Promise<void>
  hydrateExportFieldsFromSettings: (loaded: AppSettings) => void
  bumpManualExportEdit: () => void
  buildCurrentExportSnapshot: () => FfmpegExportUserPresetSnapshot
  buildCurrentFfmpegExportOverrides: () => ReturnType<typeof buildEditorFfmpegExportOverrides>
  externalFilterForPreview: ReturnType<typeof resolveExternalFilterScriptForPreview>
}

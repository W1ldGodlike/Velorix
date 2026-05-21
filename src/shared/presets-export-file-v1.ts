/**
 * §20 — JSON пользовательских пресетов экспорта ffmpeg в `Presets/export/*.json`.
 */
import type { FfmpegExportUserPreset } from './ffmpeg-export-contract'

export const PRESETS_EXPORT_FILE_KIND = 'fluxalloy.export-preset.v1' as const

export const PRESETS_EXPORT_BUNDLE_KIND = 'fluxalloy.export-presets-bundle.v1' as const

export const PRESETS_EXPORT_BUNDLE_FORMAT_VERSION = 1 as const

export interface PresetsExportFileV1 {
  kind: typeof PRESETS_EXPORT_FILE_KIND
  preset: FfmpegExportUserPreset
}

export interface PresetsExportBundleV1 {
  fluxalloyExportPresetsBundle: true
  formatVersion: number
  exportedAt: string
  presets: FfmpegExportUserPreset[]
}

export const PRESETS_EXPORT_DIR_NAME = 'Presets' as const

export const PRESETS_EXPORT_USER_SUBDIR = 'export' as const

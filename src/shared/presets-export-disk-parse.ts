/**
 * §20 — разбор JSON файлов пресетов на диске.
 */
import type { FfmpegExportUserPreset } from './ffmpeg-export-contract'
import { parseFfmpegExportUserPresetsList } from './ffmpeg-export-user-preset-parse'
import {
  PRESETS_EXPORT_BUNDLE_FORMAT_VERSION,
  PRESETS_EXPORT_FILE_KIND,
  type PresetsExportBundleV1,
  type PresetsExportFileV1
} from './presets-export-file-v1'

export function parsePresetsExportFileV1(raw: unknown): FfmpegExportUserPreset | null {
  if (!raw || typeof raw !== 'object') {
    return null
  }
  const o = raw as Record<string, unknown>
  if (o['kind'] === PRESETS_EXPORT_FILE_KIND) {
    const list = parseFfmpegExportUserPresetsList([o['preset']])
    return list[0] ?? null
  }
  const list = parseFfmpegExportUserPresetsList([raw])
  return list[0] ?? null
}

export function parsePresetsExportBundleV1(raw: unknown): FfmpegExportUserPreset[] {
  if (!raw || typeof raw !== 'object') {
    return []
  }
  const o = raw as Record<string, unknown>
  if (o['velorixExportPresetsBundle'] !== true) {
    return []
  }
  const version =
    typeof o['formatVersion'] === 'number'
      ? o['formatVersion']
      : PRESETS_EXPORT_BUNDLE_FORMAT_VERSION
  if (version > PRESETS_EXPORT_BUNDLE_FORMAT_VERSION) {
    return []
  }
  return parseFfmpegExportUserPresetsList(o['presets'])
}

export function buildPresetsExportFileV1(preset: FfmpegExportUserPreset): PresetsExportFileV1 {
  return { kind: PRESETS_EXPORT_FILE_KIND, preset }
}

export function buildPresetsExportBundleV1(
  presets: FfmpegExportUserPreset[]
): PresetsExportBundleV1 {
  return {
    velorixExportPresetsBundle: true,
    formatVersion: PRESETS_EXPORT_BUNDLE_FORMAT_VERSION,
    exportedAt: new Date().toISOString(),
    presets
  }
}

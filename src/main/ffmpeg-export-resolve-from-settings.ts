import { existsSync } from 'fs'
import { dirname, isAbsolute, join, normalize } from 'path'

import type { AppSettings } from '../shared/settings-contract'
import type { FfmpegExportContainerId } from '../shared/ffmpeg-export-contract'
import type { ResolvedFfmpegExportJobOptions } from '../shared/ffmpeg-export-resolve-contract'
import { parseFfmpegExportTwoPass } from './ffmpeg-export-service'
import { resolveExternalFilterScriptFromSettings } from '../shared/external-filter-script-resolve-from-settings'
import { resolveFfmpegExportJobOptionsFromRegistry } from './ffmpeg-export-resolve-field-registry'
import {
  buildFfmpegExportBatchOutputBasename,
  DEFAULT_FFMPEG_EXPORT_BATCH_OUTPUT_SUFFIX,
  parseFfmpegExportBatchOutputSuffixTemplate
} from '../shared/ffmpeg-export-batch-output-suffix'

/**
 * Те же правила, что IPC `exportStart`: поля из `overrides` при наличии, иначе из `settings`.
 */
export function resolveFfmpegExportJobOptionsFromAppSettings(
  settings: AppSettings,
  overrides?: unknown
): ResolvedFfmpegExportJobOptions {
  const raw =
    overrides !== undefined && overrides !== null && typeof overrides === 'object'
      ? (overrides as Record<string, unknown>)
      : {}

  const resolved = resolveFfmpegExportJobOptionsFromRegistry(raw, settings)

  const twoPassRaw = raw['twoPass']
  const twoPass =
    twoPassRaw !== undefined && twoPassRaw !== null
      ? parseFfmpegExportTwoPass(twoPassRaw) && resolved.videoCodec === 'libx264'
      : parseFfmpegExportTwoPass(settings.ffmpegExportTwoPass) && resolved.videoCodec === 'libx264'

  const extraArgsLineRaw = raw['extraArgsLine']
  const extraArgsLine =
    typeof extraArgsLineRaw === 'string'
      ? extraArgsLineRaw
      : typeof settings.ffmpegExportExtraArgsLine === 'string'
        ? settings.ffmpegExportExtraArgsLine
        : ''

  const external = resolveExternalFilterScriptFromSettings(settings)

  return {
    ...resolved,
    twoPass,
    extraArgsLine,
    externalFilterKind: external.kind,
    externalFilterScriptAbsPath: external.scriptAbsPath
  }
}

/** §6.4 → §7.2 / §7.3: уникальный выход; шаблон без расширения контейнера; опционально общая папка для пакета. */
export function pickUniqueAutoExportOutputPath(
  inputAbsolutePath: string,
  container: FfmpegExportContainerId,
  outputSuffixTemplate?: string | null,
  outputDirAbsolute?: string | null
): string {
  const parsed = parseFfmpegExportBatchOutputSuffixTemplate(
    outputSuffixTemplate ?? DEFAULT_FFMPEG_EXPORT_BATCH_OUTPUT_SUFFIX
  )
  const template = parsed.ok ? parsed.template : DEFAULT_FFMPEG_EXPORT_BATCH_OUTPUT_SUFFIX
  const inDir = dirname(inputAbsolutePath)
  let dir = inDir
  if (typeof outputDirAbsolute === 'string') {
    const n = normalize(outputDirAbsolute.trim())
    if (n.length > 0 && n.length <= 4096 && isAbsolute(n)) {
      dir = n
    }
  }
  const base = buildFfmpegExportBatchOutputBasename(inputAbsolutePath, template)
  const ext = container
  let n = 0
  let candidate = join(dir, `${base}.${ext}`)
  while (existsSync(candidate)) {
    n += 1
    candidate = join(dir, `${base}-${n}.${ext}`)
  }
  return candidate
}

export function resolveFfmpegExportBatchOutputDirectoryFromSettings(
  settings: AppSettings
): string | null {
  const raw = settings.ffmpegExportBatchOutputDirectory
  if (typeof raw !== 'string' || raw.trim() === '') {
    return null
  }
  const n = normalize(raw.trim())
  if (!isAbsolute(n) || n.length > 4096) {
    return null
  }
  return n
}

export function resolveFfmpegExportBatchOutputSuffixFromSettings(settings: AppSettings): string {
  const parsed = parseFfmpegExportBatchOutputSuffixTemplate(settings.ffmpegExportBatchOutputSuffix)
  return parsed.ok ? parsed.template : DEFAULT_FFMPEG_EXPORT_BATCH_OUTPUT_SUFFIX
}

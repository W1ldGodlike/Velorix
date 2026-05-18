import { isAbsolute, normalize, resolve } from 'path'

import type { AppSettings } from './settings-contract'
import type { ExternalFilterScriptKind } from './external-filter-script-contract'
import {
  externalFilterScriptPathMatchesKind,
  parseExternalFilterScriptKind,
  parseExternalFilterScriptPathStored
} from './external-filter-script-parse'

/** UI preview: path + extension only (no `existsSync` — renderer-safe). */
export function resolveExternalFilterScriptForPreview(
  settings: Pick<
    AppSettings,
    'ffmpegExportExternalFilterKind' | 'ffmpegExportExternalFilterScriptPath'
  >
): {
  kind: 'off' | ExternalFilterScriptKind
  scriptAbsPath: string | null
} {
  const kind = parseExternalFilterScriptKind(settings.ffmpegExportExternalFilterKind)
  const rawPath = parseExternalFilterScriptPathStored(settings.ffmpegExportExternalFilterScriptPath)
  if (kind === 'off' || rawPath === null) {
    return { kind: 'off', scriptAbsPath: null }
  }
  const abs = isAbsolute(rawPath) ? normalize(rawPath) : resolve(normalize(rawPath))
  if (!externalFilterScriptPathMatchesKind(abs, kind)) {
    return { kind: 'off', scriptAbsPath: null }
  }
  return { kind, scriptAbsPath: abs }
}

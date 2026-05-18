import { existsSync } from 'fs'
import { isAbsolute, normalize, resolve } from 'path'

import type { AppSettings } from './settings-contract'
import {
  externalFilterScriptPathMatchesKind,
  parseExternalFilterScriptKind,
  parseExternalFilterScriptPathStored
} from './external-filter-script-parse'

export function resolveExternalFilterScriptFromSettings(settings: AppSettings): {
  kind: ReturnType<typeof parseExternalFilterScriptKind>
  scriptAbsPath: string | null
} {
  const kind = parseExternalFilterScriptKind(settings.ffmpegExportExternalFilterKind)
  const rawPath = parseExternalFilterScriptPathStored(settings.ffmpegExportExternalFilterScriptPath)
  if (kind === 'off' || rawPath === null) {
    return { kind: 'off', scriptAbsPath: null }
  }
  const abs = resolve(normalize(rawPath))
  if (!isAbsolute(abs) || !existsSync(abs)) {
    return { kind: 'off', scriptAbsPath: null }
  }
  if (!externalFilterScriptPathMatchesKind(abs, kind)) {
    return { kind: 'off', scriptAbsPath: null }
  }
  return { kind, scriptAbsPath: abs }
}

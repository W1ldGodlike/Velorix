import { existsSync } from 'fs'
import { isAbsolute, normalize, resolve } from 'path'

import type {
  ExternalFilterScriptApplyPayload,
  ExternalFilterScriptApplyResult
} from '../../../shared/external-filter-script-contract'
import {
  externalFilterScriptPathMatchesKind,
  parseExternalFilterScriptKind
} from '../../../shared/external-filter-script-parse'
import type { AppUiLocale } from '../../../shared/app-ui-locale'
import { getMainApplicationStrings } from '../../../shared/main-application-locale'
import { patchCachedSettings } from '../settings/main-cached-settings-host'
import { grantMediaPath } from '../../core/media-protocol'

export function applyExternalFilterScriptSettings(
  payload: ExternalFilterScriptApplyPayload,
  uiLocale: AppUiLocale
): ExternalFilterScriptApplyResult {
  const M = getMainApplicationStrings(uiLocale)
  const kind = parseExternalFilterScriptKind(payload.kind)
  if (kind === 'off') {
    patchCachedSettings((prev) => {
      const next = { ...prev }
      delete next.ffmpegExportExternalFilterKind
      delete next.ffmpegExportExternalFilterScriptPath
      return next
    })
    return { ok: true }
  }
  const pathRaw = payload.scriptPath
  if (pathRaw === null || typeof pathRaw !== 'string' || pathRaw.trim().length === 0) {
    return { ok: false, error: M.externalFilterScriptPathMissing }
  }
  const abs = resolve(normalize(pathRaw.trim()))
  if (!isAbsolute(abs) || !existsSync(abs)) {
    return { ok: false, error: M.exportFileNotFound }
  }
  if (!externalFilterScriptPathMatchesKind(abs, kind)) {
    return { ok: false, error: M.externalFilterScriptExtensionMismatch }
  }
  grantMediaPath(abs)
  patchCachedSettings((prev) => ({
    ...prev,
    ffmpegExportExternalFilterKind: kind,
    ffmpegExportExternalFilterScriptPath: abs
  }))
  return { ok: true }
}

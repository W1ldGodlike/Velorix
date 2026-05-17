import { isAbsolute, normalize } from 'path'

import type { DownloadsWindowUiLocale } from '../shared/downloads-window-ui-locale'
import { parseDownloadsWindowUiLocale } from '../shared/downloads-window-ui-locale'
import type { YtdlpGetCliOptionsParams } from '../shared/ytdlp-download-contract'
import {
  validateYtdlpCookiesFilePath,
  type YtdlpDownloadOptionsPatch
} from './ytdlp-download-options'
import { mergeYtdlpDownloadCliPatchOntoSettings } from './ytdlp-download-cli-merge'
import type { AppSettings } from './settings-store'

export type MainYtdlpSettingsPersistAccess = {
  getSettings: () => AppSettings
  replaceSettings: (settings: AppSettings) => void
  persistSettings: () => void
  mainDownloadsUiLocale: () => DownloadsWindowUiLocale
  onDownloadDirectoryChanged: (directory: string | undefined) => void
  onCliOptionsChanged: () => void
}

let access: MainYtdlpSettingsPersistAccess | null = null

export function configureMainYtdlpSettingsPersist(next: MainYtdlpSettingsPersistAccess): void {
  access = next
}

function requireAccess(): MainYtdlpSettingsPersistAccess {
  if (!access) {
    throw new Error('main-ytdlp-settings-persist: configureMainYtdlpSettingsPersist not called')
  }
  return access
}

export function persistYtdlpDownloadDirectory(abs: string | null): void {
  const d = requireAccess()
  const merged: AppSettings = { ...d.getSettings() }
  if (abs === null || abs.trim() === '') {
    delete merged.ytdlpDownloadDirectory
  } else {
    const n = normalize(abs.trim())
    if (!isAbsolute(n)) {
      return
    }
    merged.ytdlpDownloadDirectory = n
  }
  d.replaceSettings(merged)
  d.persistSettings()
  d.onDownloadDirectoryChanged(merged.ytdlpDownloadDirectory)
}

/** §6.2 — выбор файла Netscape cookies; взаимоисключающий с --cookies-from-browser. */
export function persistYtdlpCookiesFileFromPicker(
  absPath: string
): { ok: true } | { ok: false; error: string } {
  const d = requireAccess()
  const v = validateYtdlpCookiesFilePath(absPath, d.mainDownloadsUiLocale())
  if (!v.ok) {
    return v
  }
  const merged: AppSettings = { ...d.getSettings() }
  merged.ytdlpCookiesFile = v.path
  delete merged.ytdlpCookiesBrowser
  d.replaceSettings(merged)
  d.persistSettings()
  d.onCliOptionsChanged()
  return { ok: true }
}

export function persistClearYtdlpCookiesFile(): void {
  const d = requireAccess()
  const merged: AppSettings = { ...d.getSettings() }
  delete merged.ytdlpCookiesFile
  d.replaceSettings(merged)
  d.persistSettings()
  d.onCliOptionsChanged()
}

export function parseYtdlpGetCliOptionsParams(raw: unknown): YtdlpGetCliOptionsParams | undefined {
  if (raw === undefined || raw === null) {
    return undefined
  }
  if (typeof raw !== 'object') {
    return undefined
  }
  const o = raw as Record<string, unknown>
  const out: YtdlpGetCliOptionsParams = {}
  if (typeof o['previewOutputDirectory'] === 'string') {
    out.previewOutputDirectory = o['previewOutputDirectory']
  }
  const dr = o['draft']
  if (dr !== undefined && dr !== null && typeof dr === 'object') {
    out.draft = dr as YtdlpDownloadOptionsPatch
  }
  const parsedUi = parseDownloadsWindowUiLocale(o['uiLocale'])
  if (parsedUi !== undefined) {
    out.uiLocale = parsedUi
  }
  return Object.keys(out).length > 0 ? out : undefined
}

/** §6.2 — шаблон `-o` и белый список `-f`; синхронно обновляет снимок для downloads-queue-runner. */
export function persistYtdlpDownloadCliOptionsPatch(
  patch: YtdlpDownloadOptionsPatch,
  uiLocale?: DownloadsWindowUiLocale
): { ok: true } | { ok: false; error: string } {
  const d = requireAccess()
  const loc = uiLocale ?? d.mainDownloadsUiLocale()
  const merged = mergeYtdlpDownloadCliPatchOntoSettings(d.getSettings(), patch, loc)
  if (!merged.ok) {
    return merged
  }
  d.replaceSettings(merged.settings)
  d.persistSettings()
  d.onCliOptionsChanged()
  return { ok: true }
}

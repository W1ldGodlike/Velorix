import { readFileSync, writeFileSync } from 'fs'
import { basename } from 'path'
import { randomUUID } from 'crypto'

import { BrowserWindow, dialog } from 'electron'
import type { BrowserWindow as BrowserWindowType } from 'electron'

import type { FfmpegExportUserPreset } from '../../../shared/ffmpeg-export-contract'
import { FFMPEG_EXPORT_USER_ADDED_PRESETS_MAX } from '../../../shared/ffmpeg-export-contract'
import { parseFfmpegExportUserPresetsList } from '../../../shared/ffmpeg-export-user-preset-parse'
import {
  isBuiltinExportUserPresetId,
  mergeBuiltinFfmpegExportUserPresetsFromFile
} from '../../../shared/builtin-ffmpeg-export-user-presets'
import { mainWindowIpc as mw } from '../../../shared/ipc-channels'
import type {
  PresetsExportCloneBuiltinResult,
  PresetsExportDialogResult
} from '../../../shared/presets-export-contract'
import {
  buildPresetsExportBundleV1,
  parsePresetsExportBundleV1,
  parsePresetsExportFileV1
} from '../../../shared/presets-export-disk-parse'
import type { AppSettings } from '../../../shared/settings-contract'
import { resolveInstallRoot } from '../../core/app-data-root'
import {
  configurePresetsExportInstallRoot,
  loadUserExportPresetsFromDisk,
  mergeExportUserPresetsForUi,
  resolvePresetUiLocale,
  syncUserPresetsToDisk
} from './presets-export-disk-store'

export {
  configurePresetsExportInstallRoot,
  hydrateExportUserPresetsOnLoad,
  loadUserExportPresetsFromDisk,
  mergeExportUserPresetsForUi,
  migrateLegacyExportUserPresetsFromSettings,
  resolvePresetUiLocale,
  stripExportUserPresetsFromSettingsForDisk,
  syncUserPresetsToDisk
} from './presets-export-disk-store'

export type PresetsExportServiceHooks = {
  getSettings: () => AppSettings
  replaceSettings: (next: AppSettings) => void
  saveSettings: () => void
  mainAppStr: () => {
    presetsExportTitle: string
    presetsExportFilter: string
    presetsImportTitle: string
    presetsImportFilter: string
    presetsExportOkTitle: string
    presetsExportOkMessage: string
    presetsImportOkTitle: string
    presetsImportOkMessage: string
    presetsParseErrorTitle: string
    presetsParseErrorMessage: string
    presetsImportConfirmTitle: string
    presetsImportConfirmMessage: string
    presetsImportConfirm: string
    presetsImportCancel: string
    presetsCloneBuiltinCopySuffix: string
    exportNoActiveWindow: string
    ipcInvalidRequest: string
    presetsExportUserMax: string
  }
}

let hooks: PresetsExportServiceHooks | null = null

export function configurePresetsExportService(next: PresetsExportServiceHooks): void {
  hooks = next
  configurePresetsExportInstallRoot(resolveInstallRoot)
}

function requireHooks(): PresetsExportServiceHooks {
  if (!hooks) {
    throw new Error('presets-export-service: configurePresetsExportService not called')
  }
  return hooks
}

function broadcastPresetsChanged(): void {
  for (const w of BrowserWindow.getAllWindows()) {
    if (!w.isDestroyed()) {
      w.webContents.send(mw.exportPresetsDiskChanged)
    }
  }
}

function applyMergedPresetsToRuntime(
  settings: AppSettings,
  merged: FfmpegExportUserPreset[]
): AppSettings {
  const h = requireHooks()
  const next = { ...settings, ffmpegExportUserPresets: merged }
  h.replaceSettings(next)
  h.saveSettings()
  broadcastPresetsChanged()
  return next
}

/** §20 — синхронизировать список из UI: только пользовательские → диск, merged → settings. */
export function persistExportUserPresetsList(rawList: unknown, settings: AppSettings): AppSettings {
  const locale = resolvePresetUiLocale(settings)
  const users = parseFfmpegExportUserPresetsList(rawList).filter(
    (p) => !isBuiltinExportUserPresetId(p.id)
  )
  syncUserPresetsToDisk(users)
  const merged = mergeBuiltinFfmpegExportUserPresetsFromFile(users, locale)
  return applyMergedPresetsToRuntime(settings, merged)
}

export function cloneBuiltinExportPreset(
  builtinPresetId: string,
  settings: AppSettings
): PresetsExportCloneBuiltinResult {
  const h = requireHooks()
  const locale = resolvePresetUiLocale(settings)
  const M = h.mainAppStr()
  const merged = mergeExportUserPresetsForUi(settings, locale)
  const source = merged.find((p) => p.id === builtinPresetId)
  if (!source || !isBuiltinExportUserPresetId(builtinPresetId)) {
    return { error: M.ipcInvalidRequest }
  }
  const users = merged.filter((p) => !isBuiltinExportUserPresetId(p.id))
  if (users.length >= FFMPEG_EXPORT_USER_ADDED_PRESETS_MAX) {
    return { error: M.presetsExportUserMax }
  }
  const id = randomUUID()
  const label = `${source.label}${M.presetsCloneBuiltinCopySuffix}`.slice(0, 64)
  const nextUser: FfmpegExportUserPreset = {
    id,
    label,
    snapshot: source.snapshot,
    ...(source.hint ? { hint: source.hint } : {})
  }
  const nextUsers = [...users, nextUser]
  syncUserPresetsToDisk(nextUsers)
  const nextMerged = mergeBuiltinFfmpegExportUserPresetsFromFile(nextUsers, locale)
  return applyMergedPresetsToRuntime(settings, nextMerged)
}

export async function exportUserPresetsWithDialog(
  win?: BrowserWindowType
): Promise<PresetsExportDialogResult> {
  const h = requireHooks()
  const M = h.mainAppStr()
  const settings = h.getSettings()
  const locale = resolvePresetUiLocale(settings)
  const users = mergeExportUserPresetsForUi(settings, locale).filter(
    (p) => !isBuiltinExportUserPresetId(p.id)
  )
  const parent = win && !win.isDestroyed() ? win : (BrowserWindow.getFocusedWindow() ?? undefined)
  if (!parent) {
    return { ok: false, error: M.exportNoActiveWindow }
  }
  if (users.length === 0) {
    return { ok: false, error: M.ipcInvalidRequest }
  }
  const stamp = new Date().toISOString().slice(0, 10)
  const pick = await dialog.showSaveDialog(parent, {
    title: M.presetsExportTitle,
    defaultPath: `fluxalloy-export-presets-${stamp}.json`,
    filters: [{ name: M.presetsExportFilter, extensions: ['json'] }]
  })
  if (pick.canceled || !pick.filePath) {
    return { ok: false, cancelled: true }
  }
  try {
    const payload = buildPresetsExportBundleV1(users)
    writeFileSync(pick.filePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
    await dialog.showMessageBox(parent, {
      type: 'info',
      title: M.presetsExportOkTitle,
      message: M.presetsExportOkMessage,
      detail: pick.filePath
    })
    return { ok: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { ok: false, error: message }
  }
}

export async function importUserPresetsWithDialog(
  win?: BrowserWindowType
): Promise<PresetsExportDialogResult> {
  const h = requireHooks()
  const M = h.mainAppStr()
  const settings = h.getSettings()
  const locale = resolvePresetUiLocale(settings)
  const parent = win && !win.isDestroyed() ? win : (BrowserWindow.getFocusedWindow() ?? undefined)
  if (!parent) {
    return { ok: false, error: M.exportNoActiveWindow }
  }
  const pick = await dialog.showOpenDialog(parent, {
    title: M.presetsImportTitle,
    properties: ['openFile'],
    filters: [{ name: M.presetsImportFilter, extensions: ['json'] }]
  })
  if (pick.canceled || pick.filePaths.length === 0) {
    return { ok: false, cancelled: true }
  }
  const filePath = pick.filePaths[0]
  if (typeof filePath !== 'string' || filePath.length === 0) {
    return { ok: false, error: M.ipcInvalidRequest }
  }
  let parsed: unknown
  try {
    const text = readFileSync(filePath, 'utf8')
    parsed = JSON.parse(text) as unknown
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    await dialog.showMessageBox(parent, {
      type: 'error',
      title: M.presetsParseErrorTitle,
      message: M.presetsParseErrorMessage,
      detail: message
    })
    return { ok: false, error: message }
  }
  const bundle = parsePresetsExportBundleV1(parsed)
  const incoming =
    bundle.length > 0
      ? bundle
      : (() => {
          const one = parsePresetsExportFileV1(parsed)
          return one ? [one] : []
        })()
  if (incoming.length === 0) {
    await dialog.showMessageBox(parent, {
      type: 'error',
      title: M.presetsParseErrorTitle,
      message: M.presetsParseErrorMessage,
      detail: basename(filePath)
    })
    return { ok: false, error: M.ipcInvalidRequest }
  }
  const confirm = await dialog.showMessageBox(parent, {
    type: 'warning',
    title: M.presetsImportConfirmTitle,
    message: M.presetsImportConfirmMessage,
    detail: basename(filePath),
    buttons: [M.presetsImportConfirm, M.presetsImportCancel],
    defaultId: 0,
    cancelId: 1
  })
  if (confirm.response !== 0) {
    return { ok: false, cancelled: true }
  }
  const existing = loadUserExportPresetsFromDisk()
  const byId = new Map(existing.map((p) => [p.id, p]))
  for (const p of incoming) {
    if (!isBuiltinExportUserPresetId(p.id)) {
      byId.set(p.id, p)
    }
  }
  const mergedUsers = [...byId.values()].slice(0, FFMPEG_EXPORT_USER_ADDED_PRESETS_MAX)
  syncUserPresetsToDisk(mergedUsers)
  const nextMerged = mergeBuiltinFfmpegExportUserPresetsFromFile(mergedUsers, locale)
  applyMergedPresetsToRuntime(settings, nextMerged)
  await dialog.showMessageBox(parent, {
    type: 'info',
    title: M.presetsImportOkTitle,
    message: M.presetsImportOkMessage,
    detail: basename(filePath)
  })
  return { ok: true }
}

import { isAbsolute, normalize } from 'path'

import { BrowserWindow, dialog } from 'electron'

import { getYtdlpCliValidationCopy } from '../../shared/ytdlp-cli-validation-locale'
import type { AppUiLocale } from '../../shared/app-ui-locale'
import { resolveAppPaths } from '../core/app-paths'
import { configureDownloadsWindowBoundsHooks } from './downloads-window'
import { getDownloadsQueueSnapshot } from '../services/downloads/downloads-queue'
import {
  buildYtdlpCommandPreviewContext,
  buildYtdlpRunOptionsSnapshot,
  normalizeYtdlpPreviewOutputDirectory,
  payloadFromSnapshot,
  type YtdlpDownloadOptionsPatch
} from '../services/ytdlp/ytdlp-download-options'
import { mergeYtdlpDownloadCliPatchOntoSettings } from '../services/ytdlp/ytdlp-download-cli-merge'
import {
  parseYtdlpGetCliOptionsParams,
  persistClearYtdlpCookiesFile,
  persistYtdlpCookiesFileFromPicker,
  persistYtdlpDownloadCliOptionsPatch,
  persistYtdlpDownloadDirectory
} from '../services/settings/main-ytdlp-settings-persist'
import type { DownloadsWindowUiPanelState } from '../../shared/settings-contract'
import type { AppSettings } from '../services/settings/settings-store'
import { resolveYtdlpOutputDirectory } from '../services/ytdlp/ytdlp-download-output'

export type MainDownloadsWindowBoundsBootstrapAccess = {
  getMainWindowWebContentsId: () => number | null
  mainDownloadsUiLocale: () => AppUiLocale
  getSettings: () => AppSettings
  mergeDownloadsWindowUiPanelsPatch: (patch: Partial<DownloadsWindowUiPanelState>) => void
  openDownloadedFileInMainHandler: (
    absoluteFile: string
  ) => Promise<{ ok: true } | { ok: false; error: string }>
}

export function configureMainDownloadsWindowBoundsBootstrap(
  access: MainDownloadsWindowBoundsBootstrapAccess
): void {
  configureDownloadsWindowBoundsHooks({
    isMainWindowSender: (sender) => sender.id === access.getMainWindowWebContentsId(),
    pickYtdlpOutputDirectory: async (win: BrowserWindow) => {
      const Y = getYtdlpCliValidationCopy(access.mainDownloadsUiLocale())
      const result = await dialog.showOpenDialog(win, {
        properties: ['openDirectory', 'createDirectory'],
        title: Y.dialogYtdlpOutputDirTitle
      })
      if (result.canceled || result.filePaths.length === 0 || !result.filePaths[0]) {
        return { ok: false, cancelled: true }
      }
      const picked = normalize(result.filePaths[0])
      if (!isAbsolute(picked)) {
        return { ok: false, error: Y.pickerOutputDirNeedAbsolute }
      }
      persistYtdlpDownloadDirectory(picked)
      return {
        ok: true,
        path: resolveYtdlpOutputDirectory(resolveAppPaths().userData)
      }
    },
    clearYtdlpOutputDirectoryOverride: (): void => {
      persistYtdlpDownloadDirectory(null)
    },
    pickYtdlpCookiesFile: async (win: BrowserWindow) => {
      const Y = getYtdlpCliValidationCopy(access.mainDownloadsUiLocale())
      const result = await dialog.showOpenDialog(win, {
        properties: ['openFile'],
        title: Y.dialogYtdlpCookiesFileTitle,
        filters: [
          { name: Y.dialogFilterTextFiles, extensions: ['txt'] },
          { name: Y.dialogFilterAllFiles, extensions: ['*'] }
        ]
      })
      if (result.canceled || result.filePaths.length === 0 || !result.filePaths[0]) {
        return { ok: false, cancelled: true }
      }
      const picked = normalize(result.filePaths[0])
      if (!isAbsolute(picked)) {
        return { ok: false, error: Y.pickerCookiesNeedAbsoluteFile }
      }
      const saved = persistYtdlpCookiesFileFromPicker(picked)
      if (!saved.ok) {
        return saved
      }
      return { ok: true, path: picked }
    },
    clearYtdlpCookiesFile: (): void => {
      persistClearYtdlpCookiesFile()
    },
    getYtdlpDownloadCliOptions: (raw?: unknown, ipcUiLocale?: AppUiLocale) => {
      const req = parseYtdlpGetCliOptionsParams(raw)
      const loc = req?.uiLocale ?? ipcUiLocale ?? access.mainDownloadsUiLocale()
      const paths = resolveAppPaths()
      const rows = getDownloadsQueueSnapshot()
      const hit = rows.find((r) => r.url.trim().length > 0)
      const previewParams: {
        userDataRoot: string
        sampleUrl?: string
        outputDirectoryOverride?: string | null
      } = {
        userDataRoot: paths.userData
      }
      if (hit !== undefined) {
        previewParams.sampleUrl = hit.url
      }
      if (
        req?.previewOutputDirectory !== undefined &&
        req.previewOutputDirectory.trim().length > 0
      ) {
        const n = normalizeYtdlpPreviewOutputDirectory(req.previewOutputDirectory)
        if (n !== null) {
          previewParams.outputDirectoryOverride = n
        }
      }
      let settings = access.getSettings()
      if (req?.draft) {
        const merged = mergeYtdlpDownloadCliPatchOntoSettings(settings, req.draft, loc)
        if (merged.ok) {
          settings = merged.settings
        }
      }
      return payloadFromSnapshot(
        buildYtdlpRunOptionsSnapshot(settings, loc),
        buildYtdlpCommandPreviewContext(previewParams),
        loc
      )
    },
    applyYtdlpDownloadCliPatch: (patch: YtdlpDownloadOptionsPatch, uiLocale?: AppUiLocale) =>
      persistYtdlpDownloadCliOptionsPatch(patch, uiLocale),
    openDownloadedFileInHandler: (absoluteFile) =>
      access.openDownloadedFileInMainHandler(absoluteFile),
    getDownloadsWindowUiPanelsSnapshot: () => access.getSettings().downloadsWindowUiPanels,
    mergeDownloadsWindowUiPanelsPatch: access.mergeDownloadsWindowUiPanelsPatch,
    getDownloadsUiLocale: access.mainDownloadsUiLocale
  })
}

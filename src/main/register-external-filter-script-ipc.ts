import { BrowserWindow, dialog, ipcMain } from 'electron'

import type { ExternalFilterScriptPickResult } from '../shared/external-filter-script-contract'
import {
  externalFilterScriptExtensionForKind,
  parseExternalFilterScriptKind
} from '../shared/external-filter-script-parse'
import { mainWindowIpc as mw } from '../shared/ipc-channels'
import { getMainApplicationStrings } from '../shared/main-application-locale'
import { parseAppUiLocale } from '../shared/app-ui-locale'
import { applyExternalFilterScriptSettings } from './external-filter-script-settings-persist'
import { grantMediaPath } from './media-protocol'
import { mainDownloadsUiLocale } from './main-bootstrap-ipc-helpers'

let ipcRegistered = false

export function registerExternalFilterScriptIpcHandlers(): void {
  if (ipcRegistered) {
    return
  }
  ipcRegistered = true

  ipcMain.handle(
    mw.externalFilterScriptPickFile,
    async (event, raw: unknown): Promise<ExternalFilterScriptPickResult> => {
      const kind = parseExternalFilterScriptKind(
        typeof raw === 'object' && raw !== null ? (raw as { kind?: unknown }).kind : raw
      )
      const uiLocale =
        parseAppUiLocale(
          typeof raw === 'object' && raw !== null
            ? (raw as { uiLocale?: unknown }).uiLocale
            : undefined
        ) ?? mainDownloadsUiLocale()
      const M = getMainApplicationStrings(uiLocale)
      const ext = externalFilterScriptExtensionForKind(kind)
      if (ext === null) {
        return { ok: false, error: M.externalFilterScriptPickRequiresKind }
      }
      const win = BrowserWindow.fromWebContents(event.sender)
      if (!win) {
        return { ok: false, error: M.exportNoActiveWindow }
      }
      const pick = await dialog.showOpenDialog(win, {
        title: M.externalFilterScriptPickTitle,
        properties: ['openFile'],
        filters: [
          {
            name:
              kind === 'avisynth'
                ? M.externalFilterScriptFilterAvs
                : M.externalFilterScriptFilterVpy,
            extensions: [ext.slice(1)]
          }
        ]
      })
      if (pick.canceled || pick.filePaths.length === 0 || !pick.filePaths[0]) {
        return { ok: false, cancelled: true }
      }
      const path = pick.filePaths[0]
      grantMediaPath(path)
      return { ok: true, path }
    }
  )

  ipcMain.handle(mw.externalFilterScriptApply, async (_event, raw: unknown) => {
    const uiLocale =
      parseAppUiLocale(
        typeof raw === 'object' && raw !== null
          ? (raw as { uiLocale?: unknown }).uiLocale
          : undefined
      ) ?? mainDownloadsUiLocale()
    const payload =
      typeof raw === 'object' && raw !== null
        ? (raw as { kind?: unknown; scriptPath?: unknown })
        : {}
    return applyExternalFilterScriptSettings(
      {
        kind: parseExternalFilterScriptKind(payload.kind),
        scriptPath:
          payload.scriptPath === null
            ? null
            : typeof payload.scriptPath === 'string'
              ? payload.scriptPath
              : null
      },
      uiLocale
    )
  })
}

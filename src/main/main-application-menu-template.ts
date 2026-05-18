import { existsSync } from 'fs'

import {
  BrowserWindow,
  app,
  clipboard,
  dialog,
  shell,
  type MenuItemConstructorOptions
} from 'electron'

import { mainWindowIpc as mw } from '../shared/ipc-channels'
import { isNativeMainMacos } from './platform'
import type { AppSettingsDialogSection } from '../shared/app-settings-dialog-section'
import {
  focusOrCreateDownloadsWindow,
  isDownloadsWindow
} from './downloads-window'
import {
  focusOrCreateInspectorWindow,
  isInspectorWindow
} from './inspector-window'
import { openVideoFolderWithDialog, openVideoWithDialog } from './preview-dialog'
import { buildDiagnosticsFolderSubmenu } from './main-application-menu-deps'
import type { MainApplicationMenuDeps } from './main-application-menu-types'

export function buildApplicationMenuTemplate(d: MainApplicationMenuDeps): MenuItemConstructorOptions[] {
  const win = BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0] ?? undefined
  const isMac = isNativeMainMacos()
  const themePref = d.getThemePref()
  const uiLoc = d.mainDownloadsUiLocale()
  const isSystem = themePref === 'system'
  const isDarkPref = themePref === 'dark'
  const isLightPref = themePref === 'light'
  const downloadsFocused = isDownloadsWindow(win)
  const inspectorFocused = isInspectorWindow(win)
  const auxiliaryFocused = downloadsFocused || inspectorFocused
  const mainWindowRef = d.getMainWindowRef()
  const mainUiWindow =
    mainWindowRef && !mainWindowRef.isDestroyed()
      ? mainWindowRef
      : BrowserWindow.getAllWindows().find((w) => !isDownloadsWindow(w) && !isInspectorWindow(w))

  const getMainUiWindow = (): BrowserWindow | undefined =>
    mainUiWindow && !mainUiWindow.isDestroyed() ? mainUiWindow : undefined

  const m = d.mainAppStr()

  const template: MenuItemConstructorOptions[] = []

  if (isMac) {
    template.push({
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    })
  }

  template.push(
    {
      label: m.menuFile,
      submenu: [
        {
          label: m.menuOpen,
          accelerator: 'CmdOrCtrl+O',
          click: async (): Promise<void> => {
            const target = getMainUiWindow()
            if (!target || target.isDestroyed()) {
              return
            }
            target.focus()
            const def = d.previewOpenDialogOptsFromSettings()
            const result = await openVideoWithDialog(target, d.mainDownloadsUiLocale(), def)
            if (!result.ok) {
              return
            }
            d.persistLastOpenedSource(result.path)
            target.webContents.send(mw.previewOpened, result)
          }
        },
        {
          label: m.menuOpenVideoFolder,
          accelerator: 'CmdOrCtrl+Shift+O',
          click: async (): Promise<void> => {
            const target = getMainUiWindow()
            if (!target || target.isDestroyed()) {
              return
            }
            target.focus()
            const def = d.previewOpenDialogOptsFromSettings()
            const result = await openVideoFolderWithDialog(target, d.mainDownloadsUiLocale(), def)
            if (!result.ok) {
              if (
                'error' in result &&
                typeof result.error === 'string' &&
                result.error.length > 0
              ) {
                void dialog.showMessageBox(target, {
                  type: 'warning',
                  title: m.openVideoFolderDialogTitle,
                  message: result.error
                })
              }
              return
            }
            d.persistLastOpenedSource(result.path)
            target.webContents.send(mw.previewOpened, result)
          }
        },
        {
          label: m.menuDownloadsManager,
          accelerator: 'CmdOrCtrl+Shift+Y',
          enabled: !auxiliaryFocused,
          click: (): void => {
            focusOrCreateDownloadsWindow(undefined)
          }
        },
        {
          label: m.menuPasteUrlDownloads,
          accelerator: 'CmdOrCtrl+Shift+V',
          enabled: !auxiliaryFocused,
          click: (): void => {
            const t = clipboard.readText().trim()
            focusOrCreateDownloadsWindow(t.length > 0 ? t : undefined)
          }
        },
        { type: 'separator' },
        isMac ? { role: 'close' } : { role: 'quit' }
      ]
    },
    {
      label: m.menuSettings,
      submenu: [
        {
          label: m.menuOpenAppSettings,
          click: (): void => {
            const target = getMainUiWindow()
            if (!target || target.isDestroyed()) {
              return
            }
            target.focus()
            target.webContents.send(mw.openSettings, 'general' satisfies AppSettingsDialogSection)
          }
        },
        {
          label: m.menuEnginePaths,
          click: (): void => {
            const target = getMainUiWindow()
            if (!target || target.isDestroyed()) {
              return
            }
            target.focus()
            target.webContents.send(mw.openSettings, 'dependencies' satisfies AppSettingsDialogSection)
          }
        }
      ]
    },
    {
      label: m.menuService,
      submenu: [
        {
          label: m.menuExternalFilterScript,
          click: (): void => {
            const target = getMainUiWindow()
            if (!target || target.isDestroyed()) {
              return
            }
            target.focus()
            target.webContents.send(mw.openExternalFilterScript)
          }
        },
        { type: 'separator' },
        {
          label: m.menuExportSettings,
          click: (): void => {
            const target = getMainUiWindow() ?? win
            void d.exportSettingsBackup(target)
          }
        },
        {
          label: m.menuImportSettings,
          click: (): void => {
            const target = getMainUiWindow() ?? win
            void d.importSettingsBackup(target)
          }
        }
      ]
    },
    {
      label: m.menuTools,
      submenu: [
        {
          label: m.menuInspector,
          enabled: !auxiliaryFocused,
          click: (): void => {
            focusOrCreateInspectorWindow(undefined)
          }
        },
        { type: 'separator' },
        {
          label: m.menuOpenFolder,
          toolTip: m.menuOpenFolderHint,
          submenu: buildDiagnosticsFolderSubmenu()
        },
        {
          label: m.menuOpenMainLog,
          click: (): void => {
            void d.openMainLogFile()
          }
        },
        {
          label: m.menuOpenSessionLog,
          click: (): void => {
            void d.openSessionLogFile()
          }
        },
        {
          label: m.menuSupportZip,
          click: (): void => {
            const target = BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0]
            void d.createSupportBundleWithDialog(target && !target.isDestroyed() ? target : undefined)
          }
        }
      ]
    },
    {
      label: m.menuView,
      submenu: [
        {
          label: m.menuTheme,
          submenu: [
            {
              label: m.menuThemeSystem,
              type: 'radio',
              checked: isSystem,
              click: (): void => {
                void d.setTheme('system')
              }
            },
            {
              label: m.menuThemeDark,
              type: 'radio',
              checked: isDarkPref,
              click: (): void => {
                void d.setTheme('dark')
              }
            },
            {
              label: m.menuThemeLight,
              type: 'radio',
              checked: isLightPref,
              click: (): void => {
                void d.setTheme('light')
              }
            }
          ]
        },
        {
          label: m.menuInterfaceLanguage,
          submenu: [
            {
              label: m.menuUiLangRussian,
              type: 'radio',
              checked: uiLoc === 'ru',
              click: (): void => {
                void d.persistUiLocale('ru')
              }
            },
            {
              label: m.menuUiLangEnglish,
              type: 'radio',
              checked: uiLoc === 'en',
              click: (): void => {
                void d.persistUiLocale('en')
              }
            }
          ]
        }
      ]
    },
    {
      label: m.menuHelp,
      submenu: [
        {
          label: m.menuAbout,
          click: (): void => {
            const target = getMainUiWindow()
            if (!target || target.isDestroyed()) {
              return
            }
            target.focus()
            target.webContents.send(mw.openAbout)
          }
        },
        {
          label: m.menuDocumentation,
          click: (): void => {
            const tzPath = d.technicalSpecPath()
            if (existsSync(tzPath)) {
              void shell.openPath(tzPath)
            }
          }
        }
      ]
    }
  )

  return template
}

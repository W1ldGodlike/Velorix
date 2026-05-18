import type { BrowserWindow } from 'electron'

import type { AppUiLocale } from '../shared/app-ui-locale'
import type { AppTheme } from './settings-store'

export type MainApplicationMenuDeps = {
  getThemePref: () => AppTheme
  getMainWindowRef: () => BrowserWindow | null
  mainDownloadsUiLocale: () => AppUiLocale
  mainAppStr: () => {
    menuFile: string
    menuOpen: string
    menuOpenVideoFolder: string
    openVideoFolderDialogTitle: string
    menuDownloadsManager: string
    menuPasteUrlDownloads: string
    menuSettings: string
    menuOpenAppSettings: string
    menuEnginePaths: string
    menuService: string
    menuExternalFilterScript: string
    menuExportSettings: string
    menuImportSettings: string
    menuTools: string
    menuInspector: string
    menuOpenFolder: string
    menuOpenFolderHint: string
    menuOpenMainLog: string
    menuOpenSessionLog: string
    menuSupportZip: string
    menuView: string
    menuTheme: string
    menuThemeSystem: string
    menuThemeDark: string
    menuThemeLight: string
    menuInterfaceLanguage: string
    menuUiLangRussian: string
    menuUiLangEnglish: string
    menuHelp: string
    menuAbout: string
    menuDocumentation: string
  }
  previewOpenDialogOptsFromSettings: () => { defaultPath: string } | undefined
  persistLastOpenedSource: (absolutePath: string | null) => void
  setTheme: (pref: AppTheme) => void
  persistUiLocale: (locale: AppUiLocale) => void
  technicalSpecPath: () => string
  openMainLogFile: () => Promise<void>
  openSessionLogFile: () => Promise<void>
  createSupportBundleWithDialog: (win?: BrowserWindow) => void | Promise<void>
  exportSettingsBackup: (win?: BrowserWindow) => void | Promise<void>
  importSettingsBackup: (win?: BrowserWindow) => void | Promise<void>
}

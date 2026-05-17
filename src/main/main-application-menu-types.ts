import type { BrowserWindow } from 'electron'

import type { DownloadsWindowUiLocale } from '../shared/downloads-window-ui-locale'
import type { AppTheme } from './settings-store'

export type MainApplicationMenuDeps = {
  getThemePref: () => AppTheme
  getMainWindowRef: () => BrowserWindow | null
  mainDownloadsUiLocale: () => DownloadsWindowUiLocale
  mainAppStr: () => {
    menuFile: string
    menuOpen: string
    menuOpenVideoFolder: string
    openVideoFolderDialogTitle: string
    menuDownloadsManager: string
    menuPasteUrlDownloads: string
    menuSettings: string
    menuEnginePaths: string
    menuTools: string
    menuInspector: string
    menuOpenFolder: string
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
  persistUiLocale: (locale: DownloadsWindowUiLocale) => void
  technicalSpecPath: () => string
  openMainLogFile: () => Promise<void>
  openSessionLogFile: () => Promise<void>
  createSupportBundleWithDialog: (win?: BrowserWindow) => void | Promise<void>
}

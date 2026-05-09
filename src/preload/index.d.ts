import type { ElectronAPI } from '@electron-toolkit/preload'

import type { AppSettings, AppTheme } from '../main/settings-store'

export interface FluxAlloyApi {
  settings: {
    get: () => Promise<AppSettings>
    setTheme: (theme: AppTheme) => Promise<AppSettings>
  }
  onThemeChanged: (listener: (theme: AppTheme) => void) => () => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    fluxalloy: FluxAlloyApi
  }
}

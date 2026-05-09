import type { ElectronAPI } from '@electron-toolkit/preload'

import type { EnginesStatusSnapshot } from '../main/engine-service'
import type { AppSettings, AppTheme } from '../main/settings-store'

export interface FluxAlloyApi {
  settings: {
    get: () => Promise<AppSettings>
    setTheme: (theme: AppTheme) => Promise<AppSettings>
  }
  engines: {
    getStatus: () => Promise<EnginesStatusSnapshot>
  }
  onThemeChanged: (listener: (theme: AppTheme) => void) => () => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    fluxalloy: FluxAlloyApi
  }
}

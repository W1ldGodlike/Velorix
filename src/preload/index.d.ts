import type { ElectronAPI } from '@electron-toolkit/preload'

import type { EnginesStatusSnapshot } from '../main/engine-service'
import type { AppSettings, AppTheme } from '../main/settings-store'

/**
 * Типизированный контракт preload -> renderer.
 *
 * Этот файл важен не только для автодополнения: он фиксирует публичную поверхность,
 * которую React-код имеет право использовать. Если метода нет здесь, renderer не должен
 * обращаться к нему через `ipcRenderer` напрямую.
 */
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

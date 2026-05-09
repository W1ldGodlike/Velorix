import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

import type { AppSettings, AppTheme } from '../main/settings-store'

// Единственная публичная поверхность приложения в renderer: добавлять сюда только проверенные IPC-операции.
const fluxalloy = {
  settings: {
    get: (): Promise<AppSettings> => ipcRenderer.invoke('fluxalloy:settings-get'),
    setTheme: (theme: AppTheme): Promise<AppSettings> =>
      ipcRenderer.invoke('fluxalloy:settings-set-theme', theme)
  },
  onThemeChanged: (listener: (theme: AppTheme) => void): (() => void) => {
    const channel = 'fluxalloy:theme-changed'
    const handler = (_: unknown, raw: unknown): void => {
      listener(raw === 'light' ? 'light' : 'dark')
    }
    ipcRenderer.on(channel, handler)
    return (): void => {
      ipcRenderer.removeListener(channel, handler)
    }
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('fluxalloy', fluxalloy)
  } catch (error) {
    console.error(error)
  }
} else {
  // Fallback оставлен для dev-сценариев electron-toolkit; production идёт через contextBridge.
  // @ts-expect-error preload
  window.electron = electronAPI
  // @ts-expect-error preload
  window.fluxalloy = fluxalloy
}

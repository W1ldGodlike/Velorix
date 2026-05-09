import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

import type { EnginesStatusSnapshot } from '../main/engine-service'
import type { AppSettings, AppTheme } from '../main/settings-store'

// Единственная публичная поверхность приложения в renderer.
// Всё, что требует Node/Electron прав (FS, процессы, реальные пути), остаётся в main и
// прокидывается сюда маленькими методами. Это упрощает аудит безопасности и не даёт UI
// случайно начать выполнять произвольные команды.
const fluxalloy = {
  settings: {
    get: (): Promise<AppSettings> => ipcRenderer.invoke('fluxalloy:settings-get'),
    setTheme: (theme: AppTheme): Promise<AppSettings> =>
      ipcRenderer.invoke('fluxalloy:settings-set-theme', theme)
  },
  engines: {
    // Renderer видит только агрегированный статус, а не произвольный доступ к файловой системе.
    getStatus: (): Promise<EnginesStatusSnapshot> => ipcRenderer.invoke('fluxalloy:engines-status')
  },
  onThemeChanged: (listener: (theme: AppTheme) => void): (() => void) => {
    const channel = 'fluxalloy:theme-changed'
    const handler = (_: unknown, raw: unknown): void => {
      // События из IPC валидируем так же, как invoke-аргументы: renderer не доверяет raw payload.
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

import { contextBridge, ipcRenderer, webUtils } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

import type { EngineDownloadProgress } from '../main/engine-download'
import type { EnginesStatusSnapshot } from '../main/engine-service'
import type { PreviewDialogResult } from '../main/preview-dialog'
import type { AppSettings, AppTheme } from '../main/settings-store'

type PreviewOpenedPayload = Extract<PreviewDialogResult, { ok: true }>

// Единственная публичная поверхность приложения в renderer.
// Всё, что требует Node/Electron прав (FS, процессы, реальные пути), остаётся в main и
// прокидывается сюда маленькими методами. Это упрощает аудит безопасности и не даёт UI
// случайно начать выполнять произвольные команды.
const fluxalloy = {
  // TODO(§21): при росте API разнести настройки/движки/файлы по отдельным typed contract modules.
  settings: {
    get: (): Promise<AppSettings> => ipcRenderer.invoke('fluxalloy:settings-get'),
    setTheme: (theme: AppTheme): Promise<AppSettings> =>
      ipcRenderer.invoke('fluxalloy:settings-set-theme', theme)
  },
  preview: {
    openFileDialog: (): Promise<PreviewDialogResult> =>
      ipcRenderer.invoke('fluxalloy:open-video-dialog'),
    grantPath: (
      absolutePath: string
    ): Promise<
      { ok: true; path: string; mediaUrl: string; name: string } | { ok: false; error: string }
    > => ipcRenderer.invoke('fluxalloy:preview-grant-path', absolutePath),
    /** Только узкий API на путь: renderer не имеет доступа к `File.path`. */
    getPathForFile: (file: File): string => webUtils.getPathForFile(file)
  },
  engines: {
    getStatus: (): Promise<EnginesStatusSnapshot> => ipcRenderer.invoke('fluxalloy:engines-status'),
    shouldOfferDownload: (): Promise<boolean> =>
      ipcRenderer.invoke('fluxalloy:engines-should-offer-download'),
    download: (): Promise<{ ok: true } | { ok: false; error: string }> =>
      ipcRenderer.invoke('fluxalloy:engines-download'),
    onDownloadProgress: (listener: (progress: EngineDownloadProgress) => void): (() => void) => {
      const channel = 'fluxalloy:engines-progress'
      const handler = (_event: unknown, raw: unknown): void => {
        if (!raw || typeof raw !== 'object') {
          return
        }
        listener(raw as EngineDownloadProgress)
      }
      ipcRenderer.on(channel, handler)
      return (): void => {
        ipcRenderer.removeListener(channel, handler)
      }
    }
  },
  onPreviewOpened: (listener: (payload: PreviewOpenedPayload) => void): (() => void) => {
    const channel = 'fluxalloy:preview-opened'
    const handler = (_event: unknown, raw: unknown): void => {
      if (
        raw &&
        typeof raw === 'object' &&
        'mediaUrl' in raw &&
        typeof (raw as { mediaUrl?: unknown }).mediaUrl === 'string'
      ) {
        listener(raw as PreviewOpenedPayload)
      }
    }
    ipcRenderer.on(channel, handler)
    return (): void => {
      ipcRenderer.removeListener(channel, handler)
    }
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
  // Fallback для редкого `contextIsolation: false`; глобальные типы здесь из index.d.ts не подхватываются.
  const root = window as unknown as {
    electron: typeof electronAPI
    fluxalloy: typeof fluxalloy
  }
  root.electron = electronAPI
  root.fluxalloy = fluxalloy
}

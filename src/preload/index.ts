import { contextBridge, ipcRenderer, webUtils } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

import type { DiagnosticsFolderEntry, DiagnosticsFolderId } from '../main/diagnostics-paths'
import type { EngineDownloadProgress } from '../main/engine-download'
import type {
  FfmpegExportContainerId,
  FfmpegExportEncodePresetId,
  FfmpegExportScalePresetId,
  FfmpegExportProgressPayload,
  MediaExportRequestPayload,
  MediaExportStartResult
} from '../main/ffmpeg-export-service'
import type { EnginesStatusSnapshot } from '../main/engine-service'
import type { MediaProbeResult } from '../main/ffprobe-service'
import type { PreviewDialogResult } from '../main/preview-dialog'
import type { EngineId, EnginePathOverridesPatch } from '../main/engine-service'
import type { AppAboutInfo } from '../main/about-info'
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
      ipcRenderer.invoke('fluxalloy:settings-set-theme', theme),
    setEngineExecutablePaths: (patch: EnginePathOverridesPatch): Promise<AppSettings> =>
      ipcRenderer.invoke('fluxalloy:settings-set-engine-paths', patch),
    pickEngineExecutable: (engineId: EngineId): Promise<string | null> =>
      ipcRenderer.invoke('fluxalloy:pick-engine-executable', engineId),
    setFfmpegExportEncodePreset: (preset: FfmpegExportEncodePresetId): Promise<AppSettings> =>
      ipcRenderer.invoke('fluxalloy:settings-set-ffmpeg-export-encode-preset', preset),
    setFfmpegExportContainer: (container: FfmpegExportContainerId): Promise<AppSettings> =>
      ipcRenderer.invoke('fluxalloy:settings-set-ffmpeg-export-container', container),
    setFfmpegExportCrf: (crf: number | null): Promise<AppSettings> =>
      ipcRenderer.invoke('fluxalloy:settings-set-ffmpeg-export-crf', crf),
    setFfmpegExportVideoBitrate: (bitrate: string | null): Promise<AppSettings> =>
      ipcRenderer.invoke('fluxalloy:settings-set-ffmpeg-export-video-bitrate', bitrate),
    setFfmpegExportAudioBitrate: (bitrate: string | null): Promise<AppSettings> =>
      ipcRenderer.invoke('fluxalloy:settings-set-ffmpeg-export-audio-bitrate', bitrate),
    setFfmpegExportFps: (fps: number | null): Promise<AppSettings> =>
      ipcRenderer.invoke('fluxalloy:settings-set-ffmpeg-export-fps', fps),
    setFfmpegExportScalePreset: (scale: FfmpegExportScalePresetId): Promise<AppSettings> =>
      ipcRenderer.invoke('fluxalloy:settings-set-ffmpeg-export-scale-preset', scale)
  },
  preview: {
    openFileDialog: (): Promise<PreviewDialogResult> =>
      ipcRenderer.invoke('fluxalloy:open-video-dialog'),
    grantPath: (
      absolutePath: string
    ): Promise<
      { ok: true; path: string; mediaUrl: string; name: string } | { ok: false; error: string }
    > => ipcRenderer.invoke('fluxalloy:preview-grant-path', absolutePath),
    probe: (absolutePath: string): Promise<MediaProbeResult> =>
      ipcRenderer.invoke('fluxalloy:media-probe', absolutePath),
    snapshotFrame: (payload: {
      inputPath: string
      timeSec: number
    }): Promise<
      { ok: true; path: string } | { ok: false; cancelled: true } | { ok: false; error: string }
    > => ipcRenderer.invoke('fluxalloy:snapshot-frame', payload),
    /** Только узкий API на путь: renderer не имеет доступа к `File.path`. */
    getPathForFile: (file: File): string => webUtils.getPathForFile(file)
  },
  session: {
    persistLastSource: (path: string | null): Promise<void> =>
      ipcRenderer.invoke('fluxalloy:persist-last-source', path),
    restoreLastSource: (): Promise<PreviewOpenedPayload | null> =>
      ipcRenderer.invoke('fluxalloy:restore-last-source')
  },
  downloads: {
    openWindow: (initial?: string | { text?: string } | null): Promise<void> =>
      ipcRenderer.invoke('fluxalloy:open-downloads-window', initial ?? null)
  },
  clipboard: {
    readText: (): Promise<string> => ipcRenderer.invoke('fluxalloy:clipboard-read-text'),
    writeText: (text: string): Promise<{ ok: true } | { ok: false }> =>
      ipcRenderer.invoke('fluxalloy:clipboard-write-text', text)
  },
  about: {
    getInfo: (): Promise<AppAboutInfo> => ipcRenderer.invoke('fluxalloy:app-about-info')
  },
  diagnostics: {
    listFolders: (): Promise<DiagnosticsFolderEntry[]> =>
      ipcRenderer.invoke('fluxalloy:diagnostics-list-folders'),
    openFolder: (
      id: DiagnosticsFolderId
    ): Promise<{ ok: true; path: string } | { ok: false; error: string }> =>
      ipcRenderer.invoke('fluxalloy:diagnostics-open-folder', id)
  },
  log: {
    /**
     * §18 — отправить запись в `userData/logs/main.log` через main-логгер.
     * Без ответа: это «fire and forget», промахнувшийся payload отбрасывается на стороне main.
     */
    send: (entry: { level: 'info' | 'warn' | 'error'; scope?: string; message: string }): void => {
      ipcRenderer.send('fluxalloy:log-renderer', entry)
    }
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
  export: {
    start: (payload: MediaExportRequestPayload): Promise<MediaExportStartResult> =>
      ipcRenderer.invoke('fluxalloy:export-start', payload),
    cancel: (): Promise<{ ok: true } | { ok: false; error: string }> =>
      ipcRenderer.invoke('fluxalloy:export-cancel'),
    openOutput: (
      path: string,
      mode: 'file' | 'folder' | 'preview'
    ): Promise<{ ok: true; path: string } | { ok: false; error: string }> =>
      ipcRenderer.invoke('fluxalloy:export-open-output', { path, mode }),
    onProgress: (listener: (progress: FfmpegExportProgressPayload) => void): (() => void) => {
      const channel = 'fluxalloy:export-progress'
      const handler = (_event: unknown, raw: unknown): void => {
        if (!raw || typeof raw !== 'object') {
          return
        }
        listener(raw as FfmpegExportProgressPayload)
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
  },
  onOpenEnginePaths: (listener: () => void): (() => void) => {
    const channel = 'fluxalloy:open-engine-paths'
    const handler = (): void => {
      listener()
    }
    ipcRenderer.on(channel, handler)
    return (): void => {
      ipcRenderer.removeListener(channel, handler)
    }
  },
  onEnginePathsChanged: (listener: () => void): (() => void) => {
    const channel = 'fluxalloy:engine-paths-changed'
    const handler = (): void => {
      listener()
    }
    ipcRenderer.on(channel, handler)
    return (): void => {
      ipcRenderer.removeListener(channel, handler)
    }
  },
  onOpenAbout: (listener: () => void): (() => void) => {
    const channel = 'fluxalloy:open-about'
    const handler = (): void => {
      listener()
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

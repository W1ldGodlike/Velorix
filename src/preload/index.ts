import { contextBridge, ipcRenderer, webUtils } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

import type { DiagnosticsFolderEntry, DiagnosticsFolderId } from '../shared/diagnostics-contract'
import type { EngineDownloadProgress } from '../shared/engine-download-contract'
import type { FfmpegSnapshotFormatId } from '../shared/ffmpeg-snapshot-contract'
import type {
  FfmpegExportAudioModeId,
  FfmpegExportContainerId,
  FfmpegExportEncodePresetId,
  FfmpegExportScalePresetId,
  FfmpegExportProgressPayload,
  MediaExportRequestPayload,
  MediaExportStartResult
} from '../shared/ffmpeg-export-contract'
import type { EnginesStatusSnapshot } from '../main/engine-service'
import type { MediaProbeResult } from '../main/ffprobe-service'
import type { PreviewDialogResult } from '../main/preview-dialog'
import type { EngineId, EnginePathOverridesPatch } from '../main/engine-service'
import type { AppAboutInfo } from '../main/about-info'
import type { AppSettings, AppTheme } from '../main/settings-store'
import { mainWindowIpc as mw } from '../shared/ipc-channels'

type PreviewOpenedPayload = Extract<PreviewDialogResult, { ok: true }>

// Единственная публичная поверхность приложения в renderer.
// Всё, что требует Node/Electron прав (FS, процессы, реальные пути), остаётся в main и
// прокидывается сюда маленькими методами. Это упрощает аудит безопасности и не даёт UI
// случайно начать выполнять произвольные команды.
const fluxalloy = {
  settings: {
    get: (): Promise<AppSettings> => ipcRenderer.invoke(mw.settingsGet),
    setTheme: (theme: AppTheme): Promise<AppSettings> =>
      ipcRenderer.invoke(mw.settingsSetTheme, theme),
    setEngineExecutablePaths: (patch: EnginePathOverridesPatch): Promise<AppSettings> =>
      ipcRenderer.invoke(mw.settingsSetEnginePaths, patch),
    pickEngineExecutable: (engineId: EngineId): Promise<string | null> =>
      ipcRenderer.invoke(mw.pickEngineExecutable, engineId),
    setFfmpegExportEncodePreset: (preset: FfmpegExportEncodePresetId): Promise<AppSettings> =>
      ipcRenderer.invoke(mw.settingsSetFfmpegExportEncodePreset, preset),
    setFfmpegExportContainer: (container: FfmpegExportContainerId): Promise<AppSettings> =>
      ipcRenderer.invoke(mw.settingsSetFfmpegExportContainer, container),
    setFfmpegExportCrf: (crf: number | null): Promise<AppSettings> =>
      ipcRenderer.invoke(mw.settingsSetFfmpegExportCrf, crf),
    setFfmpegExportVideoBitrate: (bitrate: string | null): Promise<AppSettings> =>
      ipcRenderer.invoke(mw.settingsSetFfmpegExportVideoBitrate, bitrate),
    setFfmpegExportAudioMode: (mode: FfmpegExportAudioModeId): Promise<AppSettings> =>
      ipcRenderer.invoke(mw.settingsSetFfmpegExportAudioMode, mode),
    setFfmpegExportAudioBitrate: (bitrate: string | null): Promise<AppSettings> =>
      ipcRenderer.invoke(mw.settingsSetFfmpegExportAudioBitrate, bitrate),
    setFfmpegExportFps: (fps: number | null): Promise<AppSettings> =>
      ipcRenderer.invoke(mw.settingsSetFfmpegExportFps, fps),
    setFfmpegExportScalePreset: (scale: FfmpegExportScalePresetId): Promise<AppSettings> =>
      ipcRenderer.invoke(mw.settingsSetFfmpegExportScalePreset, scale),
    setFfmpegSnapshotFormat: (format: FfmpegSnapshotFormatId): Promise<AppSettings> =>
      ipcRenderer.invoke(mw.settingsSetFfmpegSnapshotFormat, format)
  },
  preview: {
    openFileDialog: (): Promise<PreviewDialogResult> => ipcRenderer.invoke(mw.openVideoDialog),
    grantPath: (
      absolutePath: string
    ): Promise<
      { ok: true; path: string; mediaUrl: string; name: string } | { ok: false; error: string }
    > => ipcRenderer.invoke(mw.previewGrantPath, absolutePath),
    probe: (absolutePath: string): Promise<MediaProbeResult> =>
      ipcRenderer.invoke(mw.mediaProbe, absolutePath),
    snapshotFrame: (payload: {
      inputPath: string
      timeSec: number
    }): Promise<
      { ok: true; path: string } | { ok: false; cancelled: true } | { ok: false; error: string }
    > => ipcRenderer.invoke(mw.snapshotFrame, payload),
    /** Только узкий API на путь: renderer не имеет доступа к `File.path`. */
    getPathForFile: (file: File): string => webUtils.getPathForFile(file)
  },
  session: {
    persistLastSource: (path: string | null): Promise<void> =>
      ipcRenderer.invoke(mw.persistLastSource, path),
    restoreLastSource: (): Promise<PreviewOpenedPayload | null> =>
      ipcRenderer.invoke(mw.restoreLastSource)
  },
  downloads: {
    openWindow: (initial?: string | { text?: string } | null): Promise<void> =>
      ipcRenderer.invoke(mw.openDownloadsWindow, initial ?? null)
  },
  clipboard: {
    readText: (): Promise<string> => ipcRenderer.invoke(mw.clipboardReadText),
    writeText: (text: string): Promise<{ ok: true } | { ok: false }> =>
      ipcRenderer.invoke(mw.clipboardWriteText, text)
  },
  about: {
    getInfo: (): Promise<AppAboutInfo> => ipcRenderer.invoke(mw.appAboutInfo)
  },
  diagnostics: {
    listFolders: (): Promise<DiagnosticsFolderEntry[]> =>
      ipcRenderer.invoke(mw.diagnosticsListFolders),
    openFolder: (
      id: DiagnosticsFolderId
    ): Promise<{ ok: true; path: string } | { ok: false; error: string }> =>
      ipcRenderer.invoke(mw.diagnosticsOpenFolder, id)
  },
  log: {
    /**
     * §18 — отправить запись в `userData/logs/main.log` через main-логгер.
     * Без ответа: это «fire and forget», промахнувшийся payload отбрасывается на стороне main.
     */
    send: (entry: { level: 'info' | 'warn' | 'error'; scope?: string; message: string }): void => {
      ipcRenderer.send(mw.logRenderer, entry)
    }
  },
  engines: {
    getStatus: (): Promise<EnginesStatusSnapshot> => ipcRenderer.invoke(mw.enginesStatus),
    shouldOfferDownload: (): Promise<boolean> => ipcRenderer.invoke(mw.enginesShouldOfferDownload),
    download: (): Promise<{ ok: true } | { ok: false; error: string }> =>
      ipcRenderer.invoke(mw.enginesDownload),
    onDownloadProgress: (listener: (progress: EngineDownloadProgress) => void): (() => void) => {
      const channel = mw.enginesProgress
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
      ipcRenderer.invoke(mw.exportStart, payload),
    cancel: (): Promise<{ ok: true } | { ok: false; error: string }> =>
      ipcRenderer.invoke(mw.exportCancel),
    openOutput: (
      path: string,
      mode: 'file' | 'folder' | 'preview'
    ): Promise<{ ok: true; path: string } | { ok: false; error: string }> =>
      ipcRenderer.invoke(mw.exportOpenOutput, { path, mode }),
    onProgress: (listener: (progress: FfmpegExportProgressPayload) => void): (() => void) => {
      const channel = mw.exportProgress
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
    const channel = mw.previewOpened
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
    const channel = mw.themeChanged
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
    const channel = mw.openEnginePaths
    const handler = (): void => {
      listener()
    }
    ipcRenderer.on(channel, handler)
    return (): void => {
      ipcRenderer.removeListener(channel, handler)
    }
  },
  onEnginePathsChanged: (listener: () => void): (() => void) => {
    const channel = mw.enginePathsChanged
    const handler = (): void => {
      listener()
    }
    ipcRenderer.on(channel, handler)
    return (): void => {
      ipcRenderer.removeListener(channel, handler)
    }
  },
  onOpenAbout: (listener: () => void): (() => void) => {
    const channel = mw.openAbout
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

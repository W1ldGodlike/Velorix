import { contextBridge, ipcRenderer, webUtils } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

import type {
  DiagnosticsFolderEntry,
  DiagnosticsFolderId,
  DiagnosticsOpenMainLogResult,
  DiagnosticsSupportZipResult
} from '../shared/diagnostics-contract'
import type { EngineDownloadProgress } from '../shared/engine-download-contract'
import type { FfmpegSnapshotFormatId } from '../shared/ffmpeg-snapshot-contract'
import type {
  FfmpegExportAudioModeId,
  FfmpegExportContainerId,
  FfmpegExportCropPresetId,
  FfmpegExportEncodePresetId,
  FfmpegExportScalePresetId,
  FfmpegExportProgressPayload,
  FfmpegExportUserPreset,
  FfmpegExportUserPresetSnapshot,
  FfmpegExportVideoTransformId,
  MediaExportRequestPayload,
  MediaExportStartResult
} from '../shared/ffmpeg-export-contract'
import type { AppAboutInfo } from '../shared/about-contract'
import type {
  EngineId,
  EnginePathOverridesPatch,
  EnginesStatusSnapshot
} from '../shared/engine-contract'
import type { MediaProbeResult } from '../shared/ffprobe-contract'
import type { PreviewDialogResult, RestoredSourceInfo } from '../shared/preview-dialog-contract'
import type {
  AppSettings,
  AppSettingsView,
  AppTheme,
  MainWindowUiPanelState,
  ResolvedAppTheme
} from '../shared/settings-contract'
import type {
  SaveTextDialogPayload,
  SaveTextDialogResult
} from '../shared/save-text-dialog-contract'
import type {
  YtdlpDownloadOptionsPatch,
  YtdlpDownloadOptionsPayload,
  YtdlpGetCliOptionsParams
} from '../shared/ytdlp-download-contract'
import type { YtdlpDownloadHistoryEntry } from '../shared/ytdlp-history-contract'
import type { DownloadsLogPayload } from '../shared/downloads-log-contract'
import { downloadsIpc as d, mainWindowIpc as mw } from '../shared/ipc-channels'

type PreviewOpenedPayload = Extract<PreviewDialogResult, { ok: true }>

const MAIN_UI_PANEL_KEYS = [
  'quickYtdlp',
  'ffmpegVideo',
  'ffmpegFormat',
  'ffmpegAudio',
  'ffmpegPresets',
  'ffmpegOutput',
  'exportCommandPreview',
  'probeExportSummary',
  'probeTracks',
  'probeChapters',
  'probeRawJson'
] as const satisfies ReadonlyArray<keyof MainWindowUiPanelState>

function sanitizeMainWindowUiPanelState(raw: unknown): MainWindowUiPanelState | undefined {
  if (!raw || typeof raw !== 'object') {
    return undefined
  }
  const src = raw as Record<string, unknown>
  const out: MainWindowUiPanelState = {}
  for (const key of MAIN_UI_PANEL_KEYS) {
    if (typeof src[key] === 'boolean') {
      out[key] = src[key]
    }
  }
  return Object.keys(out).length > 0 ? out : undefined
}

function isDownloadsLogPayload(raw: unknown): raw is DownloadsLogPayload {
  if (!raw || typeof raw !== 'object') {
    return false
  }
  const o = raw as { kind?: unknown; rowId?: unknown; stream?: unknown; text?: unknown }
  if (o.kind === 'reset') {
    return typeof o.rowId === 'number' && Number.isFinite(o.rowId)
  }
  return (
    o.kind === 'line' &&
    typeof o.rowId === 'number' &&
    Number.isFinite(o.rowId) &&
    (o.stream === 'stdout' || o.stream === 'stderr') &&
    typeof o.text === 'string'
  )
}

// Единственная публичная поверхность приложения в renderer.
// Всё, что требует Node/Electron прав (FS, процессы, реальные пути), остаётся в main и
// прокидывается сюда маленькими методами. Это упрощает аудит безопасности и не даёт UI
// случайно начать выполнять произвольные команды.
const fluxalloy = {
  settings: {
    get: (): Promise<AppSettingsView> => ipcRenderer.invoke(mw.settingsGet),
    setTheme: (theme: AppTheme): Promise<AppSettingsView> =>
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
    setFfmpegExportVideoTransform: (
      transform: FfmpegExportVideoTransformId
    ): Promise<AppSettings> =>
      ipcRenderer.invoke(mw.settingsSetFfmpegExportVideoTransform, transform),
    setFfmpegExportCropPreset: (crop: FfmpegExportCropPresetId): Promise<AppSettings> =>
      ipcRenderer.invoke(mw.settingsSetFfmpegExportCropPreset, crop),
    setFfmpegExportUserPresets: (presets: FfmpegExportUserPreset[]): Promise<AppSettings> =>
      ipcRenderer.invoke(mw.settingsSetFfmpegExportUserPresets, presets),
    applyFfmpegExportSnapshot: (snapshot: FfmpegExportUserPresetSnapshot): Promise<AppSettings> =>
      ipcRenderer.invoke(mw.settingsApplyFfmpegExportSnapshot, snapshot),
    setFfmpegSnapshotFormat: (format: FfmpegSnapshotFormatId): Promise<AppSettings> =>
      ipcRenderer.invoke(mw.settingsSetFfmpegSnapshotFormat, format),
    mergeMainWindowUiPanels: (patch: Partial<MainWindowUiPanelState>): Promise<AppSettings> =>
      ipcRenderer.invoke(mw.settingsMergeMainWindowUiPanels, patch)
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
    restoreLastSource: (): Promise<RestoredSourceInfo | null> =>
      ipcRenderer.invoke(mw.restoreLastSource)
  },
  downloads: {
    openWindow: (initial?: string | { text?: string } | null): Promise<void> =>
      ipcRenderer.invoke(mw.openDownloadsWindow, initial ?? null),
    addLines: (text: string): Promise<{ ok: true; added: number } | { ok: false; error: string }> =>
      ipcRenderer.invoke(d.addLines, text),
    getSnapshot: (): Promise<unknown[]> => ipcRenderer.invoke(d.getSnapshot),
    clearQueue: (): Promise<{ ok: true } | { ok: false; error: string }> =>
      ipcRenderer.invoke(d.clear),
    clearFinished: (): Promise<{ ok: true; removed: number } | { ok: false; error: string }> =>
      ipcRenderer.invoke(d.clearFinished),
    removeRow: (id: number): Promise<{ ok: true } | { ok: false; error: string }> =>
      ipcRenderer.invoke(d.remove, id),
    moveRow: (
      id: number,
      direction: -1 | 1
    ): Promise<{ ok: true } | { ok: false; error: string }> =>
      ipcRenderer.invoke(d.move, id, direction),
    getOutputDirectory: (): Promise<{ path: string; isDefault: boolean }> =>
      ipcRenderer.invoke(d.getOutputDir),
    openOutputDirectory: (): Promise<{ ok: true } | { ok: false; error: string }> =>
      ipcRenderer.invoke(d.openOutputDir),
    pickOutputDirectory: (): Promise<
      { ok: true; path: string } | { ok: false; cancelled: true } | { ok: false; error: string }
    > => ipcRenderer.invoke(d.pickOutputDir),
    clearOutputDirectory: (): Promise<{ ok: true } | { ok: false; error: string }> =>
      ipcRenderer.invoke(d.clearOutputDir),
    pickCookiesFile: (): Promise<
      { ok: true; path: string } | { ok: false; cancelled: true } | { ok: false; error: string }
    > => ipcRenderer.invoke(d.pickCookiesFile),
    clearCookiesFile: (): Promise<{ ok: true } | { ok: false; error: string }> =>
      ipcRenderer.invoke(d.clearCookiesFile),
    onSnapshot: (listener: (rows: unknown[]) => void): (() => void) => {
      const handler = (_event: unknown, rows: unknown): void => {
        listener(Array.isArray(rows) ? rows : [])
      }
      ipcRenderer.on(d.queueSnapshot, handler)
      return (): void => {
        ipcRenderer.removeListener(d.queueSnapshot, handler)
      }
    },
    startQueue: (): Promise<{ ok: true } | { ok: false; error: string }> =>
      ipcRenderer.invoke(d.startQueue),
    startRow: (id: number): Promise<{ ok: true } | { ok: false; error: string }> =>
      ipcRenderer.invoke(d.startRow, id),
    retryRow: (id: number): Promise<{ ok: true } | { ok: false; error: string }> =>
      ipcRenderer.invoke(d.retryRow, id),
    cancelQueue: (): Promise<{ ok: true } | { ok: false; error: string }> =>
      ipcRenderer.invoke(d.cancelRun),
    getYtdlpPauseState: (): Promise<{
      supported: boolean
      active: boolean
      paused: boolean
    }> => ipcRenderer.invoke(d.getYtdlpPauseState),
    pauseYtdlp: (): Promise<{ ok: true } | { ok: false; error: string }> =>
      ipcRenderer.invoke(d.pauseYtdlp),
    resumeYtdlp: (): Promise<{ ok: true } | { ok: false; error: string }> =>
      ipcRenderer.invoke(d.resumeYtdlp),
    openQueueOutput: (
      id: number,
      mode: 'file' | 'folder'
    ): Promise<{ ok: true } | { ok: false; error: string }> =>
      ipcRenderer.invoke(d.openQueueOutput, id, mode),
    openQueueOutputInHandler: (id: number): Promise<{ ok: true } | { ok: false; error: string }> =>
      ipcRenderer.invoke(d.openQueueOutputInHandler, id),
    getCliOptions: (
      params?: YtdlpGetCliOptionsParams
    ): Promise<{ ok: true; payload: YtdlpDownloadOptionsPayload } | { ok: false; error: string }> =>
      ipcRenderer.invoke(d.getCliOptions, params),
    setCliOptions: (
      patch: YtdlpDownloadOptionsPatch
    ): Promise<{ ok: true } | { ok: false; error: string }> =>
      ipcRenderer.invoke(d.setCliOptions, patch),
    getHistory: (): Promise<YtdlpDownloadHistoryEntry[]> => ipcRenderer.invoke(d.getHistory),
    clearHistory: (): Promise<{ ok: true } | { ok: false; error: string }> =>
      ipcRenderer.invoke(d.clearHistory),
    openHistoryOutput: (
      id: string,
      mode: 'file' | 'folder'
    ): Promise<{ ok: true } | { ok: false; error: string }> =>
      ipcRenderer.invoke(d.openHistoryOutput, id, mode),
    openHistoryOutputInHandler: (
      id: string
    ): Promise<{ ok: true } | { ok: false; error: string }> =>
      ipcRenderer.invoke(d.openHistoryOutputInHandler, id),
    saveVisibleLog: (
      text: string
    ): Promise<{ ok: true; path: string } | { ok: false; error: string }> =>
      ipcRenderer.invoke(d.saveVisibleLog, text),
    onLog: (listener: (payload: DownloadsLogPayload) => void): (() => void) => {
      const handler = (_event: unknown, raw: unknown): void => {
        if (isDownloadsLogPayload(raw)) {
          listener(raw)
        }
      }
      ipcRenderer.on(d.log, handler)
      return (): void => {
        ipcRenderer.removeListener(d.log, handler)
      }
    }
  },
  /** §9 §363 — отдельное окно инспектора (тот же preload, что главное окно). */
  inspector: {
    openWindow: (absoluteMediaPath?: string | null): Promise<void> =>
      ipcRenderer.invoke(mw.openInspectorWindow, absoluteMediaPath ?? null),
    bootstrap: (): Promise<{ initialMediaPath: string | null }> =>
      ipcRenderer.invoke(mw.inspectorBootstrap),
    onTargetMediaPath: (listener: (absolutePath: string) => void): (() => void) => {
      const ch = mw.inspectorTargetMediaPath
      const handler = (_event: unknown, raw: unknown): void => {
        if (typeof raw === 'string' && raw.length > 0) {
          listener(raw)
        }
      }
      ipcRenderer.on(ch, handler)
      return (): void => {
        ipcRenderer.removeListener(ch, handler)
      }
    }
  },
  clipboard: {
    readText: (): Promise<string> => ipcRenderer.invoke(mw.clipboardReadText),
    writeText: (text: string): Promise<{ ok: true } | { ok: false }> =>
      ipcRenderer.invoke(mw.clipboardWriteText, text)
  },
  /** §9 — диалог «Сохранить как» в main (JSON ffprobe и др. текст без Node в renderer). */
  saveTextWithDialog: (payload: SaveTextDialogPayload): Promise<SaveTextDialogResult> =>
    ipcRenderer.invoke(mw.saveTextWithDialog, payload),
  about: {
    getInfo: (): Promise<AppAboutInfo> => ipcRenderer.invoke(mw.appAboutInfo)
  },
  diagnostics: {
    listFolders: (): Promise<DiagnosticsFolderEntry[]> =>
      ipcRenderer.invoke(mw.diagnosticsListFolders),
    openFolder: (
      id: DiagnosticsFolderId
    ): Promise<{ ok: true; path: string } | { ok: false; error: string }> =>
      ipcRenderer.invoke(mw.diagnosticsOpenFolder, id),
    /** §4.5 — тот же файл, что «Инструменты → Открыть main.log». */
    openMainLog: (): Promise<DiagnosticsOpenMainLogResult> =>
      ipcRenderer.invoke(mw.diagnosticsOpenMainLog),
    /** §4.5 — диалог сохранения ZIP в main (как пункт меню «Собрать Support ZIP…»). */
    createSupportZip: (): Promise<DiagnosticsSupportZipResult> =>
      ipcRenderer.invoke(mw.diagnosticsCreateSupportZip)
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
    clearUserBin: (): Promise<{ ok: true; removed: number } | { ok: false; error: string }> =>
      ipcRenderer.invoke(mw.enginesClearUserBin),
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
  onThemeChanged: (listener: (theme: ResolvedAppTheme) => void): (() => void) => {
    const channel = mw.themeChanged
    const handler = (_: unknown, raw: unknown): void => {
      // События из IPC валидируем так же, как invoke-аргументы: renderer не доверяет raw payload.
      if (raw === 'light' || raw === 'dark') {
        listener(raw)
      }
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
  },
  onMainWindowUiPanelsChanged: (
    listener: (panels: MainWindowUiPanelState | undefined) => void
  ): (() => void) => {
    const channel = mw.mainWindowUiPanelsChanged
    const handler = (_: unknown, raw: unknown): void => {
      if (raw === undefined || raw === null) {
        listener(undefined)
        return
      }
      const panels = sanitizeMainWindowUiPanelState(raw)
      if (panels !== undefined) {
        listener(panels)
      }
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

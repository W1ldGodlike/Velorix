import type { ElectronAPI } from '@electron-toolkit/preload'

import type { EngineDownloadProgress } from '../main/engine-download'
import type { MediaProbeResult } from '../main/ffprobe-service'
import type { EnginesStatusSnapshot } from '../main/engine-service'
import type { PreviewDialogResult } from '../main/preview-dialog'
import type { AppSettings, AppTheme } from '../main/settings-store'

/** Данные для привязки `<video>` к локальному файлу через allowlist-схему `fluxmedia://`. */
export type PreviewOpenedPayload = Extract<PreviewDialogResult, { ok: true }>

/**
 * Типизированный контракт preload -> renderer.
 *
 * Этот файл важен не только для автодополнения: он фиксирует публичную поверхность,
 * которую React-код имеет право использовать. Если метода нет здесь, renderer не должен
 * обращаться к нему через `ipcRenderer` напрямую.
 */
export interface FluxAlloyApi {
  // TODO(§21): держать этот интерфейс синхронным с `src/preload/index.ts`; renderer не использует raw ipcRenderer.
  settings: {
    get: () => Promise<AppSettings>
    setTheme: (theme: AppTheme) => Promise<AppSettings>
  }
  preview: {
    openFileDialog: () => Promise<PreviewDialogResult>
    grantPath: (
      absolutePath: string
    ) => Promise<
      { ok: true; path: string; mediaUrl: string; name: string } | { ok: false; error: string }
    >
    probe: (absolutePath: string) => Promise<MediaProbeResult>
    getPathForFile: (file: File) => string
  }
  session: {
    persistLastSource: (path: string | null) => Promise<void>
    restoreLastSource: () => Promise<PreviewOpenedPayload | null>
  }
  downloads: {
    openWindow: (initial?: string | { text?: string } | null) => Promise<void>
  }
  clipboard: {
    readText: () => Promise<string>
  }
  engines: {
    getStatus: () => Promise<EnginesStatusSnapshot>
    shouldOfferDownload: () => Promise<boolean>
    download: () => Promise<{ ok: true } | { ok: false; error: string }>
    onDownloadProgress: (listener: (progress: EngineDownloadProgress) => void) => () => void
  }
  onPreviewOpened: (listener: (payload: PreviewOpenedPayload) => void) => () => void
  onThemeChanged: (listener: (theme: AppTheme) => void) => () => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    fluxalloy: FluxAlloyApi
  }
}

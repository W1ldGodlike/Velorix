/**
 * Типизированный контракт preload -> renderer (фрагмент VelorixApi).
 * IPC-каналы: `src/shared/ipc-channels.ts`; синхрон с `src/preload/index.ts`.
 */
import type { AppUiLocale } from '../shared/app-ui-locale'
import type {
  DiagnosticsCleanMaintenanceRequest,
  DiagnosticsCleanMaintenanceResult,
  DiagnosticsFolderEntry,
  DiagnosticsFolderId,
  DiagnosticsMaintenanceSnapshot,
  DiagnosticsOpenMainLogResult,
  DiagnosticsSupportZipResult
} from '../shared/diagnostics-contract'
import type { EnginesStatusSnapshot } from '../shared/engine-contract'
import type { EngineDownloadProgress } from '../shared/engine-download-contract'
import type { FfmpegHwEncodersProbeResult } from '../shared/ffmpeg-hw-encoder-probe'
export type VelorixApiEnginesBlock = {
  utilities: {
    repairRemux: (
      payload: import('../shared/media-utilities-contract').MediaUtilitiesRepairRequestPayload
    ) => Promise<import('../shared/media-utilities-contract').MediaUtilitiesRepairResult>
    checkIntegrity: (
      payload: import('../shared/media-utilities-contract').MediaUtilitiesIntegrityRequestPayload
    ) => Promise<import('../shared/media-utilities-contract').MediaUtilitiesIntegrityResult>
    generateNoise: (
      payload: import('../shared/media-utilities-contract').MediaUtilitiesGenerateNoiseRequestPayload
    ) => Promise<import('../shared/media-utilities-contract').MediaUtilitiesGenerateNoiseResult>
    computeFileHash: (
      payload: import('../shared/media-utilities-contract').MediaUtilitiesFileHashRequestPayload
    ) => Promise<import('../shared/media-utilities-contract').MediaUtilitiesFileHashResult>
    convertImage: (
      payload: import('../shared/media-utilities-contract').MediaUtilitiesConvertImageRequestPayload
    ) => Promise<import('../shared/media-utilities-contract').MediaUtilitiesConvertImageResult>
    pickSlideshowImages: () => Promise<
      import('../shared/media-utilities-contract').MediaUtilitiesPickSlideshowImagesResult
    >
    createImageSlideshow: (
      payload: import('../shared/media-utilities-contract').MediaUtilitiesCreateImageSlideshowRequestPayload
    ) => Promise<
      import('../shared/media-utilities-contract').MediaUtilitiesCreateImageSlideshowResult
    >
  }
  diagnostics: {
    listFolders: () => Promise<DiagnosticsFolderEntry[]>
    openFolder: (
      id: DiagnosticsFolderId
    ) => Promise<{ ok: true; path: string } | { ok: false; error: string }>
    openMainLog: () => Promise<DiagnosticsOpenMainLogResult>
    createSupportZip: () => Promise<DiagnosticsSupportZipResult>
    maintenanceSnapshot: () => Promise<DiagnosticsMaintenanceSnapshot>
    cleanMaintenance: (
      request?: DiagnosticsCleanMaintenanceRequest
    ) => Promise<DiagnosticsCleanMaintenanceResult>
  }
  log: {
    send: (entry: { level: 'info' | 'warn' | 'error'; scope?: string; message: string }) => void
  }
  engines: {
    getStatus: (uiLocale?: AppUiLocale) => Promise<EnginesStatusSnapshot>
    shouldOfferDownload: () => Promise<boolean>
    download: (uiLocale?: AppUiLocale) => Promise<{ ok: true } | { ok: false; error: string }>
    checkUpdatesAndDownload: (
      uiLocale?: AppUiLocale
    ) => Promise<
      import('../shared/engine-update-check-contract').EnginesCheckUpdatesAndDownloadResult
    >
    clearUserBin: () => Promise<{ ok: true; removed: number } | { ok: false; error: string }>
    probeHwEncoders: () => Promise<FfmpegHwEncodersProbeResult>
    onDownloadProgress: (listener: (progress: EngineDownloadProgress) => void) => () => void
  }
}

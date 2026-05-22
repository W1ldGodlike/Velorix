/**
 * Типизированный контракт preload -> renderer (фрагмент VelorixApi).
 * IPC-каналы: `src/shared/ipc-channels.ts`; синхрон с `src/preload/index.ts`.
 */
import type { ElectronAPI } from '@electron-toolkit/preload'

import type { VelorixApiSettingsBlock } from './velorix-api-block-settings'
import type { VelorixApiDownloadsBlock } from './velorix-api-block-downloads'
import type { VelorixApiInspectorBlock } from './velorix-api-block-inspector'
import type { VelorixApiMiniPlayerBlock } from './velorix-api-block-mini-player'
import type { VelorixApiWorkflowsBlock } from './velorix-api-block-workflows'
import type { VelorixApiEnginesBlock } from './velorix-api-block-engines'
import type { VelorixApiExportBlock } from './velorix-api-block-export'
import type { VelorixApiEventsBlock, PreviewOpenedPayload } from './velorix-api-block-events'

export interface VelorixApi
  extends
    VelorixApiSettingsBlock,
    VelorixApiDownloadsBlock,
    VelorixApiInspectorBlock,
    VelorixApiMiniPlayerBlock,
    VelorixApiWorkflowsBlock,
    VelorixApiEnginesBlock,
    VelorixApiExportBlock,
    VelorixApiEventsBlock {}

export type { PreviewOpenedPayload }

declare global {
  interface Window {
    electron: ElectronAPI
    velorix: VelorixApi
  }
}

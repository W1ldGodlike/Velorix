/**
 * Типизированный контракт preload -> renderer (фрагмент FluxAlloyApi).
 * IPC-каналы: `src/shared/ipc-channels.ts`; синхрон с `src/preload/index.ts`.
 */
import type { ElectronAPI } from '@electron-toolkit/preload'

import type { FluxAlloyApiSettingsBlock } from './fluxalloy-api-block-settings'
import type { FluxAlloyApiDownloadsBlock } from './fluxalloy-api-block-downloads'
import type { FluxAlloyApiInspectorBlock } from './fluxalloy-api-block-inspector'
import type { FluxAlloyApiMiniPlayerBlock } from './fluxalloy-api-block-mini-player'
import type { FluxAlloyApiWorkflowsBlock } from './fluxalloy-api-block-workflows'
import type { FluxAlloyApiEnginesBlock } from './fluxalloy-api-block-engines'
import type { FluxAlloyApiExportBlock } from './fluxalloy-api-block-export'
import type { FluxAlloyApiEventsBlock, PreviewOpenedPayload } from './fluxalloy-api-block-events'

export interface FluxAlloyApi
  extends
    FluxAlloyApiSettingsBlock,
    FluxAlloyApiDownloadsBlock,
    FluxAlloyApiInspectorBlock,
    FluxAlloyApiMiniPlayerBlock,
    FluxAlloyApiWorkflowsBlock,
    FluxAlloyApiEnginesBlock,
    FluxAlloyApiExportBlock,
    FluxAlloyApiEventsBlock {}

export type { PreviewOpenedPayload }

declare global {
  interface Window {
    electron: ElectronAPI
    fluxalloy: FluxAlloyApi
  }
}

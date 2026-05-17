import type { ExportBatchIpcContext } from './export-batch-ipc-context'
import { registerBatchExportQueueIpcIngestHandlers } from './register-batch-export-queue-ipc-ingest'
import { registerBatchExportQueueIpcMutateHandlers } from './register-batch-export-queue-ipc-mutate'
import { registerBatchExportQueueIpcRunHandlers } from './register-batch-export-queue-ipc-run'

export function registerBatchExportQueueIpcHandlers(ctx: ExportBatchIpcContext): void {
  registerBatchExportQueueIpcMutateHandlers(ctx)
  registerBatchExportQueueIpcIngestHandlers(ctx)
  registerBatchExportQueueIpcRunHandlers(ctx)
}

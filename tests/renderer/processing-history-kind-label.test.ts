import { describe, expect, it } from 'vitest'

import type { ProcessingHistoryKind } from '../../src/shared/processing-history-contract'

function formatProcessingHistoryKindLabel(kind: ProcessingHistoryKind): string {
  if (kind === 'ffmpegSnapshot') {
    return 'processingHistoryKindSnapshot'
  }
  if (kind === 'autoExport') {
    return 'processingHistoryKindAutoExport'
  }
  if (kind === 'ffmpegBatchExport') {
    return 'processingHistoryKindBatchExport'
  }
  if (kind === 'workflowScenario') {
    return 'processingHistoryKindWorkflowScenario'
  }
  return 'processingHistoryKindExport'
}

describe('processing history kind label §13', () => {
  it('maps workflowScenario to locale key', () => {
    expect(formatProcessingHistoryKindLabel('workflowScenario')).toBe(
      'processingHistoryKindWorkflowScenario'
    )
  })
})

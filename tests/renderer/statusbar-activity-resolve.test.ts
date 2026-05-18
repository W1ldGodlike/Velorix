import { describe, expect, it } from 'vitest'

import {
  buildStatusbarActivityDisplay,
  resolveStatusbarActivityKind
} from '../../src/renderer/src/statusbar-activity-resolve'

const t = (key: string): string => key

describe('statusbar-activity-resolve', () => {
  it('resolveStatusbarActivityKind prioritizes export over downloads', () => {
    expect(
      resolveStatusbarActivityKind({
        engineDownloadBusy: false,
        engineSummaryChecking: false,
        exportBusy: true,
        snapshotBusy: false,
        extractFramesBusy: false,
        exportCancelBusy: false,
        probePending: false,
        batchExportBusy: false,
        terminalBusy: false,
        downloadsRunning: 2,
        downloadsOptionsBusy: false,
        downloadsHistoryBusy: false
      })
    ).toBe('export')
  })

  it('buildStatusbarActivityDisplay idle when nothing busy', () => {
    const d = buildStatusbarActivityDisplay(
      {
        engineDownloadBusy: false,
        engineSummaryChecking: false,
        exportBusy: false,
        snapshotBusy: false,
        extractFramesBusy: false,
        exportCancelBusy: false,
        probePending: false,
        batchExportBusy: false,
        terminalBusy: false,
        downloadsRunning: 0,
        downloadsOptionsBusy: false,
        downloadsHistoryBusy: false
      },
      t
    )
    expect(d.active).toBe(false)
    expect(d.label).toBe('statusbarActivityIdle')
  })
})

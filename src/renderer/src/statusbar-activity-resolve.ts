export type StatusbarActivityInput = {
  engineDownloadBusy: boolean
  engineSummaryChecking: boolean
  exportBusy: boolean
  snapshotBusy: boolean
  extractFramesBusy: boolean
  exportCancelBusy: boolean
  probePending: boolean
  batchExportBusy: boolean
  terminalBusy: boolean
  downloadsRunning: number
  downloadsOptionsBusy: boolean
  downloadsHistoryBusy: boolean
}

export type StatusbarActivityKind =
  | 'idle'
  | 'export'
  | 'batch'
  | 'frames'
  | 'snapshot'
  | 'probe'
  | 'engines'
  | 'engines_check'
  | 'terminal'
  | 'downloads'
  | 'downloads_sync'

const ACTIVITY_UI_KEYS: Record<
  Exclude<StatusbarActivityKind, 'idle'>,
  { label: string; title: string }
> = {
  export: {
    label: 'statusbarActivityExport',
    title: 'statusbarActivityExportTitle'
  },
  batch: {
    label: 'statusbarActivityBatch',
    title: 'statusbarActivityBatchTitle'
  },
  frames: {
    label: 'statusbarActivityFrames',
    title: 'statusbarActivityFramesTitle'
  },
  snapshot: {
    label: 'statusbarActivitySnapshot',
    title: 'statusbarActivitySnapshotTitle'
  },
  probe: {
    label: 'statusbarActivityProbe',
    title: 'statusbarActivityProbeTitle'
  },
  engines: {
    label: 'statusbarActivityEngines',
    title: 'statusbarActivityEnginesTitle'
  },
  engines_check: {
    label: 'statusbarActivityEnginesCheck',
    title: 'statusbarActivityEnginesCheckTitle'
  },
  terminal: {
    label: 'statusbarActivityTerminal',
    title: 'statusbarActivityTerminalTitle'
  },
  downloads: {
    label: 'statusbarActivityDownloads',
    title: 'statusbarActivityDownloadsTitle'
  },
  downloads_sync: {
    label: 'statusbarActivityDownloadsSync',
    title: 'statusbarActivityDownloadsSyncTitle'
  }
}

export function resolveStatusbarActivityKind(input: StatusbarActivityInput): StatusbarActivityKind {
  if (input.exportBusy || input.exportCancelBusy) {
    return 'export'
  }
  if (input.batchExportBusy) {
    return 'batch'
  }
  if (input.extractFramesBusy) {
    return 'frames'
  }
  if (input.snapshotBusy) {
    return 'snapshot'
  }
  if (input.probePending) {
    return 'probe'
  }
  if (input.engineDownloadBusy) {
    return 'engines'
  }
  if (input.engineSummaryChecking) {
    return 'engines_check'
  }
  if (input.terminalBusy) {
    return 'terminal'
  }
  if (input.downloadsRunning > 0) {
    return 'downloads'
  }
  if (input.downloadsOptionsBusy || input.downloadsHistoryBusy) {
    return 'downloads_sync'
  }
  return 'idle'
}

export function buildStatusbarActivityDisplay(
  input: StatusbarActivityInput,
  uiText: (key: string) => string
): { active: boolean; label: string; title: string } {
  const kind = resolveStatusbarActivityKind(input)
  if (kind === 'idle') {
    return {
      active: false,
      label: uiText('statusbarActivityIdle'),
      title: uiText('statusbarActivityIdleTitle')
    }
  }
  const keys = ACTIVITY_UI_KEYS[kind]
  return {
    active: true,
    label: uiText(keys.label),
    title: uiText(keys.title)
  }
}

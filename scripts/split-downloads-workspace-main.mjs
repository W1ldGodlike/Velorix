/* eslint-disable @typescript-eslint/explicit-function-return-type */
import fs from 'node:fs'
import path from 'node:path'

const dir = path.join('src/renderer/src/components/downloads')

const propsContent = `import type { Dispatch, SetStateAction } from 'react'

import type {
  YtdlpDownloadHistoryEntry,
  YtdlpDownloadHistoryWeeklySummary
} from '../../../../shared/ytdlp-history-contract'
import type { DownloadsLogLineView } from './DownloadsLogPanel'
import type {
  DownloadsQueueRowView,
  DownloadsQueueStats,
  DownloadsStatusFilter
} from '../../downloads-queue-view'
import type { DownloadsHistoryOutcomeFilter } from '../../use-downloads-workspace'

export type DownloadsWorkspaceMainProps = {
  downloadsOptionsBusy: boolean
  downloadsHistoryBusy: boolean
  downloadsUrl: string
  setDownloadsUrl: Dispatch<SetStateAction<string>>
  downloadsMainUrlFieldId: string
  onAddToQueue: () => void
  downloadsNarrowLayout: boolean
  onScrollToSettings: () => void
  downloadsStats: DownloadsQueueStats
  downloadsStatusFilter: DownloadsStatusFilter
  setDownloadsStatusFilter: (next: DownloadsStatusFilter) => void
  downloadsStatusFilterChips: Array<{ id: DownloadsStatusFilter; label: string }>
  downloadsRows: DownloadsQueueRowView[]
  visibleDownloadsRows: DownloadsQueueRowView[]
  setStatusHint: (hint: string | null) => void
  onBatchAddDownloadsDone: (rowIds: number[]) => void
  onSelectDownloadsTab: () => void
  downloadsEmbeddedHistoryOpen: boolean
  persistDownloadsEmbeddedHistoryOpen: (nextOpen: boolean) => void
  visibleDownloadsHistory: YtdlpDownloadHistoryEntry[]
  downloadsHistoryCount: number
  downloadsHistoryOutcomeFilter: DownloadsHistoryOutcomeFilter
  setDownloadsHistoryOutcomeFilter: (next: DownloadsHistoryOutcomeFilter) => void
  downloadsHistoryWeeklySummary: YtdlpDownloadHistoryWeeklySummary
  refreshDownloadsHistory: () => Promise<void>
  setDownloadsHistory: Dispatch<SetStateAction<YtdlpDownloadHistoryEntry[]>>
  exportVisibleDownloadsHistory: () => Promise<void>
  downloadsEmbeddedLogOpen: boolean
  persistDownloadsEmbeddedLogOpen: (nextOpen: boolean) => void
  downloadsLogTargetRowId: number | null
  downloadsLogLines: DownloadsLogLineView[]
  setDownloadsLogLines: Dispatch<SetStateAction<DownloadsLogLineView[]>>
  setDownloadsLogTargetRowId: Dispatch<SetStateAction<number | null>>
}
`

fs.writeFileSync(path.join(dir, 'downloads-workspace-main-props.ts'), propsContent)

const mainPath = path.join(dir, 'DownloadsWorkspaceMain.tsx')
const mainLines = fs.readFileSync(mainPath, 'utf8').split(/\r?\n/)
const slices = [
  ['Band', 123, 267],
  ['Overview', 268, 324],
  ['QueueTable', 331, 695],
  ['LowerStack', 696, 764]
]
for (const [name, start, end] of slices) {
  fs.writeFileSync(
    path.join(dir, `_slice-${name}.tsx.txt`),
    mainLines.slice(start - 1, end).join('\n')
  )
}

function wrap(imports, name, sliceFile, destructure) {
  const body = fs.readFileSync(path.join(dir, sliceFile), 'utf8')
  const fragmentWrap = name === 'Band' || name === 'Overview'
  const open = fragmentWrap ? '    <>\n' : ''
  const close = fragmentWrap ? '    </>\n' : ''
  const fn = `export function DownloadsWorkspaceMain${name}(props: DownloadsWorkspaceMainProps): JSX.Element {
  const { ${destructure} } = props

  return (
${open}${body}
${close}  )
}
`
  fs.writeFileSync(path.join(dir, `DownloadsWorkspaceMain${name}.tsx`), imports + fn)
}

wrap(
  `import type { JSX } from 'react'

import {
  IconBan,
  IconPopOutWindow,
  IconQueuePlus,
  IconQueueTrash,
  IconSettings
} from '../LucideMiniIcons'
import { getUiLocale, uiText, uiTextVars } from '../../locales/ui-text'
import type { DownloadsWorkspaceMainProps } from './downloads-workspace-main-props'

`,
  'Band',
  '_slice-Band.tsx.txt',
  'downloadsOptionsBusy, downloadsHistoryBusy, downloadsUrl, setDownloadsUrl, downloadsMainUrlFieldId, onAddToQueue, downloadsNarrowLayout, onScrollToSettings, downloadsRows, setStatusHint'
)

wrap(
  `import type { JSX } from 'react'

import { uiText } from '../../locales/ui-text'
import type { DownloadsWorkspaceMainProps } from './downloads-workspace-main-props'

`,
  'Overview',
  '_slice-Overview.tsx.txt',
  'downloadsOptionsBusy, downloadsHistoryBusy, downloadsStats, downloadsStatusFilter, setDownloadsStatusFilter, downloadsStatusFilterChips'
)

wrap(
  `import type { JSX } from 'react'

import { isFfmpegExportBatchVideoPath } from '../../../../shared/ffmpeg-export-batch-video-ext'
import {
  isYtdlpQueueStatusDone,
  isYtdlpQueueStatusErrorLike
} from '../../../../shared/ytdlp-queue-status'
import {
  DOWNLOADS_QUEUE_TABLE_HEADER_IDS,
  downloadsRowMatchesStatus,
  downloadsStatusTone,
  parseDownloadsProgressPercent
} from '../../downloads-queue-view'
import { formatDownloadsQueueRowStatus, uiText, uiTextVars } from '../../locales/ui-text'
import {
  IconFolderOpen,
  IconPauseUi,
  IconPlay,
  IconQueueChevronDown,
  IconQueueChevronUp,
  IconQueueFile,
  IconQueueOutbound,
  IconQueuePlus,
  IconQueueRetry,
  IconQueueTrash
} from '../LucideMiniIcons'
import type { DownloadsWorkspaceMainProps } from './downloads-workspace-main-props'

`,
  'QueueTable',
  '_slice-QueueTable.tsx.txt',
  'downloadsOptionsBusy, downloadsHistoryBusy, downloadsRows, visibleDownloadsRows, setStatusHint, onBatchAddDownloadsDone'
)

wrap(
  `import type { JSX } from 'react'

import { DOWNLOADS_VISIBLE_LOG_SAVE_CANCELLED } from '../../../../shared/downloads-log-contract'
import { formatDownloadsLogText } from '../../downloads-queue-view'
import { uiText } from '../../locales/ui-text'
import { DownloadsHistoryPanel } from './DownloadsHistoryPanel'
import { DownloadsLogPanel } from './DownloadsLogPanel'
import type { DownloadsWorkspaceMainProps } from './downloads-workspace-main-props'

`,
  'LowerStack',
  '_slice-LowerStack.tsx.txt',
  'downloadsOptionsBusy, downloadsHistoryBusy, setStatusHint, onSelectDownloadsTab, downloadsEmbeddedHistoryOpen, persistDownloadsEmbeddedHistoryOpen, visibleDownloadsHistory, downloadsHistoryCount, downloadsHistoryOutcomeFilter, setDownloadsHistoryOutcomeFilter, downloadsHistoryWeeklySummary, refreshDownloadsHistory, setDownloadsHistory, exportVisibleDownloadsHistory, downloadsEmbeddedLogOpen, persistDownloadsEmbeddedLogOpen, downloadsLogTargetRowId, downloadsLogLines, setDownloadsLogLines, setDownloadsLogTargetRowId'
)

const orch = `import type { JSX } from 'react'

import { uiText } from '../../locales/ui-text'
import { DownloadsWorkspaceMainBand } from './DownloadsWorkspaceMainBand'
import { DownloadsWorkspaceMainLowerStack } from './DownloadsWorkspaceMainLowerStack'
import { DownloadsWorkspaceMainOverview } from './DownloadsWorkspaceMainOverview'
import { DownloadsWorkspaceMainQueueTable } from './DownloadsWorkspaceMainQueueTable'
export type { DownloadsWorkspaceMainProps } from './downloads-workspace-main-props'
import type { DownloadsWorkspaceMainProps } from './downloads-workspace-main-props'

export function DownloadsWorkspaceMain(props: DownloadsWorkspaceMainProps): JSX.Element {
  const { downloadsOptionsBusy, downloadsHistoryBusy } = props

  return (
    <section
      className="app-downloads-main"
      aria-label={uiText('downloadsMainAria')}
      aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
    >
      <DownloadsWorkspaceMainBand {...props} />
      <DownloadsWorkspaceMainOverview {...props} />
      <div
        className="app-downloads-table-zone"
        role="region"
        aria-label={uiText('downloadsQueueTableZoneAria')}
        aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
      >
        <DownloadsWorkspaceMainQueueTable {...props} />
        <DownloadsWorkspaceMainLowerStack {...props} />
      </div>
    </section>
  )
}
`

fs.writeFileSync(path.join(dir, 'DownloadsWorkspaceMain.tsx'), orch)

for (const f of ['_slice-Band.tsx.txt', '_slice-Overview.tsx.txt', '_slice-QueueTable.tsx.txt', '_slice-LowerStack.tsx.txt']) {
  fs.unlinkSync(path.join(dir, f))
}

console.log('split downloads workspace main OK')

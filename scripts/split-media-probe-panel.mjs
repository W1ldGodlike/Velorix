/* eslint-disable @typescript-eslint/explicit-function-return-type -- generator script */
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const dir = path.join('src/renderer/src/components')
const lines = execSync('git show HEAD:src/renderer/src/components/MediaProbePanel.tsx', {
  encoding: 'utf8'
}).split(/\r?\n/)

fs.writeFileSync(
  path.join(dir, 'preview-probe-body-props.ts'),
  `import type { MediaProbeSuccess } from '../../../shared/ffprobe-contract'
import type { PreviewProbeSectionKey } from './media-probe-panel-helpers'

export type PreviewProbeBodyProps = {
  probeInfo: MediaProbeSuccess
  mediaPathForDefaultSave?: string
  probeSectionOpen?: Partial<Record<PreviewProbeSectionKey, boolean>>
  onProbeSectionToggle?: (key: PreviewProbeSectionKey, open: boolean) => void
  /** Текущее обновление ffprobe выбранного файла (инспектор / будущие встраивания). */
  probeRefreshing?: boolean
}
`
)

const hookImports = `import { useEffect, useId, useRef, useState } from 'react'

import { formatFfprobeContainerDiagnosticsCompactLine } from '../../../shared/ffprobe-container-format'
import {
  defaultFfprobeJsonFileName,
  defaultFfprobeSummaryHtmlFileName,
  defaultFfprobeSummaryTxtFileName,
  formatProbeSummaryHtmlDocument,
  formatProbeSummaryPlainText
} from '../../../shared/ffprobe-summary-export'
import { getUiLocale, uiText, uiTextVars } from '../locales/ui-text'
import {
  formatProbeBitrateLine,
  formatProbeJsonForDisplay,
  PREVIEW_PROBE_SECTION_DEFAULTS,
  type PreviewProbeSectionKey,
  type ProbeTableContextMenu
} from './media-probe-panel-helpers'
import type { PreviewProbeBodyProps } from './preview-probe-body-props'
`

const hookBody = lines.slice(54, 191).join('\n')

fs.writeFileSync(
  path.join(dir, 'use-preview-probe-body.ts'),
  `${hookImports}
export function usePreviewProbeBody({
  probeInfo,
  mediaPathForDefaultSave,
  probeSectionOpen,
  onProbeSectionToggle,
  probeRefreshing = false
}: PreviewProbeBodyProps) {
${hookBody}
  return {
    probeInfo,
    probeRefreshing,
    sectionOpen,
    persistOrLocalSectionToggle,
    dash,
    probeExportSummaryRegionId,
    probeTracksRegionId,
    probeChaptersRegionId,
    probeRawJsonRegionId,
    probeToolbarTip,
    probeTableMenu,
    setProbeTableMenu,
    probeTableMenuRef,
    diagnosticsCompact,
    bitrateLabel,
    formatTooltip,
    handleCopyProbeJson,
    handleSaveProbeJson,
    handleSaveSummaryTxt,
    handleSaveSummaryHtml,
    copyProbeCellAndDismiss
  }
}

export type PreviewProbeBodyCtx = ReturnType<typeof usePreviewProbeBody>
`
)

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- generator helper
function makePart(name, extraImports, sliceStart, sliceEnd, ctxPick) {
  const body = lines.slice(sliceStart - 1, sliceEnd).join('\n')
  const content = `import type { JSX } from 'react'
${extraImports}
import type { PreviewProbeBodyCtx } from './use-preview-probe-body'

export function PreviewProbeBody${name}({ ctx }: { ctx: PreviewProbeBodyCtx }): JSX.Element {
  const { ${ctxPick} } = ctx

  return (
${body}
  )
}
`
  fs.writeFileSync(path.join(dir, `PreviewProbeBody${name}.tsx`), content)
}

makePart(
  'Overview',
  `import { FFPROBE_DOC_ALL } from '../../../shared/external-doc-urls'
import { formatFfprobeCreationTimeBrief } from '../../../shared/ffprobe-creation-time-brief'
import { collectFfprobeFormatScalarTagInspectorBriefs } from '../../../shared/ffprobe-format-tag-registry'
import { formatProbeDurationLabel } from './media-probe-panel-helpers'
import { uiText, uiTextVars } from '../locales/ui-text'
`,
  205,
  253,
  'probeInfo, probeRefreshing, formatTooltip, diagnosticsCompact, bitrateLabel, probeToolbarTip'
)

makePart(
  'Sections',
  `import { formatProbeChapterDurationSec, formatProbeChapterTimecode } from '../../../shared/ffprobe-timecode'
import {
  keyboardProbeMenuPosition,
  PROBE_CHAPTERS_TABLE_HEADER_IDS,
  PROBE_TRACKS_TABLE_HEADER_IDS,
  probeTrackKindLabel,
  formatProbeJsonForDisplay,
  clampProbeTableMenuPosition
} from './media-probe-panel-helpers'
import { uiText, uiTextVars } from '../locales/ui-text'
`,
  254,
  619,
  `probeInfo, probeRefreshing, sectionOpen, persistOrLocalSectionToggle, dash,
    probeExportSummaryRegionId, probeTracksRegionId, probeChaptersRegionId, probeRawJsonRegionId,
    setProbeTableMenu, handleSaveSummaryTxt, handleSaveSummaryHtml, handleCopyProbeJson, handleSaveProbeJson`
)

makePart(
  'ContextMenu',
  `import { createPortal } from 'react-dom'
import { formatProbeChapterRowTsv, formatProbeTrackRowTsv, formatProbeBitrateLine } from './media-probe-panel-helpers'
import { uiText } from '../locales/ui-text'
`,
  622,
  826,
  'probeTableMenu, probeTableMenuRef, copyProbeCellAndDismiss'
)

fs.writeFileSync(
  path.join(dir, 'PreviewProbeBody.tsx'),
  `import type { JSX } from 'react'

import { uiText } from '../locales/ui-text'
import { PreviewProbeBodyContextMenu } from './PreviewProbeBodyContextMenu'
import { PreviewProbeBodyOverview } from './PreviewProbeBodyOverview'
import { PreviewProbeBodySections } from './PreviewProbeBodySections'
import type { PreviewProbeBodyProps } from './preview-probe-body-props'
import { usePreviewProbeBody } from './use-preview-probe-body'

export function PreviewProbeBody(props: PreviewProbeBodyProps): JSX.Element {
  const ctx = usePreviewProbeBody(props)

  return (
    <>
      <div
        className="app-preview-probe-stack"
        role="region"
        aria-label={uiText('probePanelAriaLabel')}
        aria-describedby="probePanelOverviewHint"
        aria-busy={ctx.probeRefreshing}
      >
        <p id="probePanelOverviewHint" className="app-visually-hidden">
          {uiText('probePanelOverviewHint')}
        </p>
        <PreviewProbeBodyOverview ctx={ctx} />
        <PreviewProbeBodySections ctx={ctx} />
      </div>
      <PreviewProbeBodyContextMenu ctx={ctx} />
    </>
  )
}
`
)

fs.writeFileSync(
  path.join(dir, 'MediaProbePanel.tsx'),
  `export type { PreviewProbeSectionKey } from './media-probe-panel-helpers'
export type { PreviewProbeBodyProps } from './preview-probe-body-props'
export { PreviewProbeBody } from './PreviewProbeBody'
`
)

console.log('split MediaProbePanel OK')

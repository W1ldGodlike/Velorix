/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const dir = path.join('src/renderer/src/components/editor')
const lines = execSync('git show HEAD:src/renderer/src/components/editor/EditorBatchExportBar.tsx', {
  encoding: 'utf8'
}).split(/\r?\n/)

const propsLines = lines.slice(37, 70) // props type only (38-70)
const constantsBlock = lines
  .slice(29, 36)
  .join('\n')
  .replace(/^const BATCH_EXPORT/, 'export const BATCH_EXPORT')

fs.writeFileSync(
  path.join(dir, 'editor-batch-export-bar-constants.ts'),
  `${constantsBlock}
`
)

fs.writeFileSync(
  path.join(dir, 'editor-batch-export-bar-props.ts'),
  `import type { Dispatch, SetStateAction } from 'react'

import type { FfmpegExportBatchSnapshot } from '../../../../shared/ffmpeg-export-batch-contract'

${propsLines.join('\n')}
`
)

const toolbarImports = `import type { JSX } from 'react'

import { DEFAULT_FFMPEG_EXPORT_BATCH_OUTPUT_SUFFIX } from '../../../../shared/ffmpeg-export-batch-output-suffix'
import type { FfmpegExportBatchConcurrency } from '../../../../shared/ffmpeg-export-batch-contract'
import {
  IconBan,
  IconCopy,
  IconDownload,
  IconFilm,
  IconFolder,
  IconFolderOpen,
  IconHome,
  IconPlay,
  IconQueueFile,
  IconQueueRetry,
  IconQueueTrash,
  IconQueueX,
  IconSave,
  IconScissors,
  IconSettings
} from '../LucideMiniIcons'
import { uiText } from '../../locales/ui-text'
import type { EditorBatchExportBarProps } from './editor-batch-export-bar-props'

`

const tableImports = `import type { JSX } from 'react'

import {
  IconCopy,
  IconFilm,
  IconFolderOpen,
  IconPlay,
  IconQueueChevronDown,
  IconQueueChevronUp,
  IconQueueRetry,
  IconQueueTrash
} from '../LucideMiniIcons'
import { formatFfmpegExportBatchStatusLabel, uiText, uiTextVars } from '../../locales/ui-text'
import { BATCH_EXPORT_TABLE_HEADER_IDS } from './editor-batch-export-bar-constants'
import type { EditorBatchExportBarProps } from './editor-batch-export-bar-props'

`

function wrap(imports, name, start, end, destructure) {
  const body = lines.slice(start - 1, end).join('\n')
  const fn = `export function EditorBatchExportBar${name}(props: EditorBatchExportBarProps): JSX.Element {
  const { ${destructure} } = props

  return (
${body}
  )
}
`
  fs.writeFileSync(path.join(dir, `EditorBatchExportBar${name}.tsx`), imports + fn)
}

wrap(
  toolbarImports,
  'Toolbar',
  151,
  450,
  'batchExportBusy, batchSnapshot, batchOutputSuffix, setBatchOutputSuffix, batchOutputDirectory, previewPath, handleBatchPickOutputFolder, handleBatchRevealSharedOutputFolder, handleBatchClearOutputDirectory, handleBatchPickFiles, handleBatchPickFolder, handleBatchAddCurrentPreview, handleBatchAddDownloadsDone, handleBatchStart, handleBatchCancel, handleBatchRetryFailed, handleBatchRetryFailedAndStart, handleBatchClearCompleted, handleBatchCopyInputPaths, handleBatchCopyOutputPaths, handleBatchSaveReport, handleBatchRemoveWaiting'
)

wrap(
  tableImports,
  'QueueTable',
  451,
  727,
  'batchExportBusy, batchSnapshot, batchDragRowId, setBatchDragRowId, setStatusHint, handleBatchOpenOutput, handleBatchOpenInput, handleBatchCopyRowPath'
)

const entry = `import { useId } from 'react'
import type { JSX } from 'react'

import { uiText, uiTextVars } from '../../locales/ui-text'
import { EditorBatchExportBarQueueTable } from './EditorBatchExportBarQueueTable'
import { EditorBatchExportBarToolbar } from './EditorBatchExportBarToolbar'
export type { EditorBatchExportBarProps } from './editor-batch-export-bar-props'
import type { EditorBatchExportBarProps } from './editor-batch-export-bar-props'

export function EditorBatchExportBar(props: EditorBatchExportBarProps): JSX.Element {
  const {
    open,
    onOpenChange,
    batchExportBusy,
    batchSnapshot,
    handleBatchDropFiles
  } = props

  const batchExportBarRegionBodyId = useId()
  return (
    <details
      className="app-url-bar app-batch-export-bar"
      aria-label={uiText('batchExportAria')}
      aria-busy={batchExportBusy}
      open={open}
      onToggle={(e) => {
        onOpenChange(e.currentTarget.open)
      }}
    >
      <summary className="app-url-summary" aria-controls={batchExportBarRegionBodyId}>
        {uiText('batchExportSummary')}
      </summary>
      <div
        id={batchExportBarRegionBodyId}
        className="app-url-body"
        role="region"
        aria-labelledby="batch-export-region-title"
        aria-busy={batchExportBusy}
      >
        <h3 id="batch-export-region-title" className="app-visually-hidden">
          {uiText('batchExportAria')}
        </h3>
        <p id="batch-export-panel-hint" className="app-url-hint">
          {uiText('batchExportHint')}
        </p>
        <p id="batch-export-drop-hint" className="app-url-hint">
          {uiText('batchExportDragHint')}
        </p>
        <div
          className="app-batch-export-dropzone"
          aria-label={uiText('batchExportDropzoneAria')}
          aria-busy={batchExportBusy}
          aria-describedby="batch-export-panel-hint batch-export-drop-hint"
          onDragOver={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          onDrop={(e) => {
            e.preventDefault()
            e.stopPropagation()
            void handleBatchDropFiles(e.dataTransfer.files)
          }}
        >
          <EditorBatchExportBarToolbar {...props} />
          <EditorBatchExportBarQueueTable {...props} />
        {batchSnapshot && !batchSnapshot.running && batchSnapshot.completedError > 0 ? (
          <p className="app-batch-export-summary app-url-hint" role="status">
            {uiTextVars('batchExportErrorSummary', {
              failed: String(batchSnapshot.completedError),
              total: String(
                batchSnapshot.completedOk +
                  batchSnapshot.completedError +
                  batchSnapshot.completedCancelled
              )
            })}
          </p>
        ) : null}
      </div>
    </details>
  )
}
`.replace(/<motion\.motion.div/g, '<div').replace(/<\/motion\.div>/g, '</motion.div>')

fs.writeFileSync(
  path.join(dir, 'EditorBatchExportBar.tsx'),
  entry.replace(/motion\.div/g, 'motion.div').replace('</motion.div>', '</div>').replace('<motion.div', '<div')
)

console.log('split EditorBatchExportBar OK')

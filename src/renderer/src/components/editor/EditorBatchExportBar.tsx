import { useId } from 'react'
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
      aria-describedby="batch-export-panel-hint"
      aria-busy={batchExportBusy}
      open={open}
      onToggle={(e) => {
        onOpenChange(e.currentTarget.open)
      }}
    >
      <summary
        className="app-url-summary"
        aria-controls={batchExportBarRegionBodyId}
        aria-describedby="batch-export-panel-hint batch-export-drop-hint"
      >
        {uiText('batchExportSummary')}
      </summary>
      <div
        id={batchExportBarRegionBodyId}
        className="app-url-body"
        role="region"
        aria-labelledby="batch-export-region-title"
        aria-describedby="batch-export-panel-hint batch-export-drop-hint"
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
            <p
              className="app-batch-export-summary app-url-hint"
              role="status"
              aria-describedby="batch-export-panel-hint batch-export-drop-hint"
            >
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
      </div>
    </details>
  )
}

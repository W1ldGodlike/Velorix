import { useCallback, useEffect, useId, useMemo, useRef, type JSX } from 'react'

import { KNOWLEDGE_SLUG_SESSION_AND_QUEUES } from '../../../../shared/knowledge-contract'
import { formatEditorBatchExportCompletionAnnouncement } from '../../editor-batch-export-completion-ui'
import { uiText } from '../../locales/ui-text'
import { KnowledgeDeepLinkButton } from '../KnowledgeDeepLinkButton'
import { EditorBatchExportBarQueueTable } from './EditorBatchExportBarQueueTable'
import { EditorBatchExportBarToolbar } from './EditorBatchExportBarToolbar'
export type { EditorBatchExportBarProps } from './editor-batch-export-bar-props'
import type { EditorBatchExportBarProps } from './editor-batch-export-bar-props'

function focusBatchExportQueueRegion(el: HTMLElement | null): void {
  el?.focus()
}

export function EditorBatchExportBar(props: EditorBatchExportBarProps): JSX.Element {
  const {
    open,
    onOpenChange,
    batchExportBusy,
    batchSnapshot,
    handleBatchDropFiles,
    onOpenKnowledgeArticle,
    handleBatchStart,
    handleBatchRetryFailedAndStart
  } = props

  const batchExportBarRegionBodyId = useId()
  const queueFocusRef = useRef<HTMLDivElement>(null)
  const completionLiveRef = useRef<HTMLParagraphElement>(null)
  const wasRunningRef = useRef(false)

  const setQueueRegionNode = useCallback((node: HTMLDivElement | null) => {
    queueFocusRef.current = node
  }, [])

  const visibleCompletionSummary = useMemo(() => {
    if (!batchSnapshot || batchSnapshot.running) {
      return null
    }
    return formatEditorBatchExportCompletionAnnouncement(batchSnapshot)
  }, [batchSnapshot])

  const focusQueueAfterSubmit = (): void => {
    window.requestAnimationFrame(() => {
      focusBatchExportQueueRegion(queueFocusRef.current)
    })
  }

  const barProps: EditorBatchExportBarProps = {
    ...props,
    handleBatchStart: async () => {
      await handleBatchStart()
      focusQueueAfterSubmit()
    },
    handleBatchRetryFailedAndStart: async () => {
      await handleBatchRetryFailedAndStart()
      focusQueueAfterSubmit()
    }
  }

  useEffect(() => {
    const running = batchSnapshot?.running === true
    if (wasRunningRef.current && !running && visibleCompletionSummary) {
      window.requestAnimationFrame(() => {
        completionLiveRef.current?.focus()
      })
    }
    wasRunningRef.current = running
  }, [batchSnapshot?.running, visibleCompletionSummary])

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
        aria-describedby="batch-export-panel-hint batch-export-drop-hint batch-export-completion-live"
        aria-busy={batchExportBusy}
      >
        <h3 id="batch-export-region-title" className="app-visually-hidden">
          {uiText('batchExportAria')}
        </h3>
        <p id="batch-export-panel-hint" className="app-url-hint">
          {uiText('batchExportHint')}
        </p>
        {onOpenKnowledgeArticle ? (
          <nav
            className="app-batch-export-knowledge"
            aria-label={uiText('knowledgeDeepLinkBatchExportLabel')}
            aria-describedby="batch-export-panel-hint"
          >
            <KnowledgeDeepLinkButton
              label={uiText('knowledgeDeepLinkBatchExportLabel')}
              tooltip={uiText('knowledgeDeepLinkBatchExportTooltip')}
              ariaDescribedBy="batch-export-panel-hint"
              disabled={batchExportBusy}
              onOpen={() => {
                onOpenKnowledgeArticle(KNOWLEDGE_SLUG_SESSION_AND_QUEUES)
              }}
            />
          </nav>
        ) : null}
        <p id="batch-export-drop-hint" className="app-url-hint">
          {uiText('batchExportDragHint')}
        </p>
        <p
          id="batch-export-completion-live"
          ref={completionLiveRef}
          className={
            visibleCompletionSummary
              ? 'app-batch-export-summary app-url-hint'
              : 'app-visually-hidden'
          }
          role="status"
          aria-live="polite"
          aria-atomic="true"
          aria-label={uiText('batchExportCompletionLiveAria')}
          tabIndex={-1}
        >
          {visibleCompletionSummary ?? ''}
        </p>
        <div
          className="app-batch-export-dropzone"
          aria-label={uiText('batchExportDropzoneAria')}
          aria-busy={batchExportBusy}
          aria-describedby="batch-export-panel-hint batch-export-drop-hint batch-export-completion-live"
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
          <EditorBatchExportBarToolbar {...barProps} />
          <div
            ref={setQueueRegionNode}
            tabIndex={-1}
            className="app-batch-export-queue-focus"
            role="region"
            aria-label={uiText('batchExportQueueTableZoneAria')}
            aria-describedby="batch-export-panel-hint batch-export-drop-hint batch-export-completion-live"
            aria-busy={batchExportBusy}
          >
            <EditorBatchExportBarQueueTable {...barProps} />
          </div>
        </div>
      </div>
    </details>
  )
}
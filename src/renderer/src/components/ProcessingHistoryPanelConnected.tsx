import { useBatchAddStatusHint } from '../use-ffmpeg-export-batch-deps'
import { useAppShellStore } from '../stores/app-shell-store'
import { useProcessingHistoryStore } from '../stores/processing-history-store'
import { ProcessingHistoryPanel } from './ProcessingHistoryPanel'
import { uiText } from '../locales/ui-text'
import {
  workflowRunScenarioOnFileErrorText,
  workflowRunScenarioOnUrlErrorText
} from '../editor-workflow-run-error-text'
import type { WorkflowRunScenarioOnUrlError } from '../../../shared/workflow-watch-folder-contract'
import type { JSX } from 'react'

export function ProcessingHistoryPanelConnected(props: {
  open: boolean
  onToggle: (nextOpen: boolean) => void
  onOpenKnowledgeArticle?: (slug: string) => void
}): JSX.Element {
  const { open, onToggle, onOpenKnowledgeArticle } = props
  const processingHistory = useProcessingHistoryStore((s) => s.processingHistory)
  const processingHistoryBusy = useProcessingHistoryStore((s) => s.processingHistoryBusy)
  const processingHistoryFilter = useProcessingHistoryStore((s) => s.processingHistoryFilter)
  const processingHistoryWeeklySummary = useProcessingHistoryStore(
    (s) => s.processingHistoryWeeklySummary
  )
  const setProcessingHistory = useProcessingHistoryStore((s) => s.setProcessingHistory)
  const setProcessingHistoryWeeklySummary = useProcessingHistoryStore(
    (s) => s.setProcessingHistoryWeeklySummary
  )
  const applyProcessingHistoryFilter = useProcessingHistoryStore(
    (s) => s.applyProcessingHistoryFilter
  )
  const refreshProcessingHistory = useProcessingHistoryStore((s) => s.refreshProcessingHistory)
  const exportVisibleProcessingHistory = useProcessingHistoryStore(
    (s) => s.exportVisibleProcessingHistory
  )
  const setStatusHint = useAppShellStore((s) => s.setStatusHint)
  const reportBatchPathsAdded = useBatchAddStatusHint(setStatusHint)

  return (
    <ProcessingHistoryPanel
      open={open}
      busy={processingHistoryBusy}
      entries={processingHistory}
      filter={processingHistoryFilter}
      weeklySummary={processingHistoryWeeklySummary}
      {...(onOpenKnowledgeArticle ? { onOpenKnowledgeArticle } : {})}
      onToggle={onToggle}
      onFilterChange={applyProcessingHistoryFilter}
      onRefresh={() => {
        void refreshProcessingHistory()
      }}
      onClear={() => {
        void window.velorix.processingHistory.clear().then((res) => {
          if (!res.ok) {
            setStatusHint(res.error)
            return
          }
          setProcessingHistory([])
          void window.velorix.processingHistory
            .weeklySummary()
            .then(setProcessingHistoryWeeklySummary)
        })
      }}
      onExportVisible={() => {
        void exportVisibleProcessingHistory()
      }}
      onOpenOutput={(id, mode) => {
        void window.velorix.processingHistory.openOutput(id, mode).then((res) => {
          if (!res.ok) {
            setStatusHint(res.error)
          } else if (mode === 'preview') {
            setStatusHint(uiText('processingHistoryOpenOutputPreviewDone'))
          }
        })
      }}
      onOpenInputInHandler={(id) => {
        const entry = processingHistory.find((row) => row.id === id)
        if (entry?.kind === 'workflowScenario' && entry.workflowScenarioId) {
          setStatusHint(uiText('processingHistoryRepeatWorkflowBusy'))
          void window.velorix.processingHistory.repeatWorkflowScenario(id).then((res) => {
            if (res.ok) {
              setStatusHint(uiText('processingHistoryRepeatWorkflowDone'))
              return
            }
            if ('errorCode' in res) {
              const code = res.errorCode
              setStatusHint(
                code === 'no-source-url' || code === 'download-start-failed'
                  ? workflowRunScenarioOnUrlErrorText(code as WorkflowRunScenarioOnUrlError)
                  : workflowRunScenarioOnFileErrorText(code)
              )
              return
            }
            setStatusHint(res.error)
          })
          return
        }
        setStatusHint(uiText('processingHistoryOpenInputBusy'))
        void window.velorix.processingHistory.openInputInHandler(id).then((res) => {
          setStatusHint(res.ok ? uiText('processingHistoryOpenInputDone') : res.error)
        })
      }}
      onAddInputToBatch={(id) => {
        void window.velorix.batchExport.addFromHistoryInputs([id]).then((res) => {
          if (!res.ok) {
            setStatusHint(res.error)
            return
          }
          reportBatchPathsAdded(res)
        })
      }}
    />
  )
}

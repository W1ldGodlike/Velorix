import { useCallback, useState, type JSX } from 'react'

import type { WorkflowScenarioListItem } from '../../../../shared/workflow-scenario-contract'
import { resolveWorkflowScenarioDownloadSourceUrl } from '../../../../shared/workflow-scenario-url'
import { KNOWLEDGE_SLUG_WORKFLOWS_PLANNER_SCENARIOS } from '../../../../shared/knowledge-contract'
import { KnowledgeDeepLinkButton } from '../KnowledgeDeepLinkButton'
import {
  workflowRunScenarioOnFileErrorText,
  workflowRunScenarioOnUrlErrorText
} from '../../editor-workflow-run-error-text'
import { uiText, uiTextVars } from '../../locales/ui-text'
import type { EditorFfmpegSettingsRailProps } from './editor-ffmpeg-settings-rail-props'

/** §11 — запуск сохранённого сценария по файлу редактора или по URL блока «Скачать». */
export function EditorWorkflowScenarioSection(props: EditorFfmpegSettingsRailProps): JSX.Element {
  const {
    panelOpen,
    persistMainWindowUiPanelToggle,
    previewMediaPath,
    exportBusy,
    snapshotBusy,
    probePending,
    editorFfmpegDetailBusy,
    setStatusHint,
    onOpenKnowledgeArticle
  } = props
  const [scenarios, setScenarios] = useState<WorkflowScenarioListItem[]>([])
  const [scenarioId, setScenarioId] = useState('')
  const [scenarioHasUrl, setScenarioHasUrl] = useState(false)
  const [runBusy, setRunBusy] = useState(false)

  const refreshScenarioUrlFlag = useCallback(async (id: string): Promise<void> => {
    if (!id) {
      setScenarioHasUrl(false)
      return
    }
    const res = await window.velorix.workflows.getScenario(id)
    if (!res.ok) {
      setScenarioHasUrl(false)
      return
    }
    setScenarioHasUrl(Boolean(resolveWorkflowScenarioDownloadSourceUrl(res.scenario.nodes)))
  }, [])

  const loadScenarios = useCallback(async (): Promise<void> => {
    const res = await window.velorix.workflows.listScenarios()
    if (!res.ok) {
      return
    }
    setScenarios(res.items)
    let nextId = ''
    setScenarioId((prev) => {
      nextId = prev && res.items.some((s) => s.id === prev) ? prev : (res.items[0]?.id ?? '')
      return nextId
    })
    await refreshScenarioUrlFlag(nextId)
  }, [refreshScenarioUrlFlag])

  const runScenario = async (): Promise<void> => {
    if (!previewMediaPath || !scenarioId) {
      setStatusHint(uiText('editorWorkflowRunErrorNoFile'))
      return
    }
    setRunBusy(true)
    try {
      const res = await window.velorix.workflows.runScenarioOnFile(
        scenarioId,
        previewMediaPath,
        uiText('editorWorkflowRunTaskTitle')
      )
      if (res.ok) {
        setStatusHint(uiText('editorWorkflowRunQueued'))
        return
      }
      setStatusHint(workflowRunScenarioOnFileErrorText(res.error))
    } finally {
      setRunBusy(false)
    }
  }

  const runScenarioUrl = async (): Promise<void> => {
    if (!scenarioId) {
      setStatusHint(uiText('editorWorkflowRunErrorBadArgs'))
      return
    }
    setRunBusy(true)
    try {
      const res = await window.velorix.workflows.runScenarioOnUrl(
        scenarioId,
        uiText('editorWorkflowRunUrlTaskTitle')
      )
      if (res.ok) {
        setStatusHint(
          res.started
            ? uiText('editorWorkflowRunUrlQueued')
            : uiTextVars('editorWorkflowRunUrlQueuedBusy', { rowId: String(res.rowId) })
        )
        return
      }
      setStatusHint(workflowRunScenarioOnUrlErrorText(res.error))
    } finally {
      setRunBusy(false)
    }
  }

  const busy = exportBusy || snapshotBusy || runBusy || probePending
  const canRunFile = Boolean(previewMediaPath) && scenarioId.length > 0 && !busy
  const canRunUrl = scenarioHasUrl && scenarioId.length > 0 && !busy

  return (
    <details
      id="editor-workflow-scenario"
      className="app-settings-section"
      aria-label={uiText('editorWorkflowSectionTitle')}
      open={panelOpen('workflowScenario')}
      onToggle={(e) => {
        const open = e.currentTarget.open
        persistMainWindowUiPanelToggle('workflowScenario', open)
        if (open) {
          void loadScenarios()
        }
      }}
    >
      <summary className="app-settings-summary" title={uiText('editorWorkflowSectionTitle')}>
        {uiText('editorWorkflowSectionTitle')}
      </summary>
      <div className="app-settings-hw-smoke-header">
        <p id="editor-workflow-scenario-hint" className="app-settings-section-hint">
          {uiText('editorWorkflowSectionHint')}
        </p>
        {onOpenKnowledgeArticle ? (
          <KnowledgeDeepLinkButton
            label={uiText('knowledgeDeepLinkWorkflows')}
            tooltip={uiText('knowledgeDeepLinkWorkflowsTooltip')}
            ariaDescribedBy="editor-workflow-scenario-hint"
            disabled={busy}
            onOpen={() => {
              onOpenKnowledgeArticle(KNOWLEDGE_SLUG_WORKFLOWS_PLANNER_SCENARIOS)
            }}
          />
        ) : null}
      </div>
      <div className="app-settings-stack" aria-busy={editorFfmpegDetailBusy || runBusy}>
        <label className="app-field app-field-block">
          <span>{uiText('editorWorkflowScenarioLabel')}</span>
          <select
            className="app-control"
            disabled={busy || scenarios.length === 0}
            value={scenarioId}
            title={uiText('editorWorkflowScenarioLabel')}
            onChange={(e) => {
              const next = e.target.value
              setScenarioId(next)
              void refreshScenarioUrlFlag(next)
            }}
          >
            {scenarios.length === 0 ? (
              <option value="">{uiText('editorWorkflowScenarioEmpty')}</option>
            ) : (
              scenarios.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title || s.id}
                </option>
              ))
            )}
          </select>
        </label>
        <button
          type="button"
          className="app-btn app-btn-primary"
          disabled={!canRunFile}
          title={uiText('editorWorkflowRunButton')}
          onClick={() => {
            void runScenario()
          }}
        >
          {uiText('editorWorkflowRunButton')}
        </button>
        {scenarioHasUrl ? (
          <button
            type="button"
            className="app-btn"
            disabled={!canRunUrl}
            title={uiText('editorWorkflowRunUrlButton')}
            onClick={() => {
              void runScenarioUrl()
            }}
          >
            {uiText('editorWorkflowRunUrlButton')}
          </button>
        ) : null}
        {previewMediaPath ? (
          <p className="app-settings-section-hint">
            {uiTextVars('editorWorkflowRunFileHint', {
              file: previewMediaPath.replace(/^.*[/\\]/, '')
            })}
          </p>
        ) : (
          <p className="app-settings-section-hint">{uiText('editorWorkflowRunOpenFileHint')}</p>
        )}
        {scenarioHasUrl ? (
          <p className="app-settings-section-hint">{uiText('editorWorkflowRunUrlHint')}</p>
        ) : null}
      </div>
    </details>
  )
}

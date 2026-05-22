import { useCallback, useEffect, useId, useMemo, useState, type JSX } from 'react'

import {
  WORKFLOW_SCENARIO_TEMPLATE_V1,
  type WorkflowScenarioDocument,
  type WorkflowScenarioListItem
} from '../../../../shared/workflow-scenario-contract'
import { parseWorkflowScenarioDocument } from '../../../../shared/workflow-scenario-parse'
import {
  WORKFLOW_SCENARIO_TEMPLATES,
  type WorkflowScenarioTemplateId
} from '../../../../shared/workflow-scenario-templates'
import { KNOWLEDGE_SLUG_WORKFLOWS_PLANNER_SCENARIOS } from '../../../../shared/knowledge-contract'
import { KnowledgeDeepLinkButton } from '../KnowledgeDeepLinkButton'
import { uiText } from '../../locales/ui-text'
import type { UiTextKey } from '../../locales/ui-text-strings'
import {
  allocateWorkflowScenarioNodeId,
  appendWorkflowScenarioNode,
  removeWorkflowScenarioNode
} from '../../../../shared/workflow-scenario-editor-mutations'
import { workflowScenarioNodeKindLabelKey } from '../../../../shared/workflow-scenario-layout'
import { WorkflowScenarioFlowDiagram } from './WorkflowScenarioFlowDiagram'

export type WorkflowScenarioBuilderDialogProps = {
  open: boolean
  onClose: () => void
  onStatus: (message: string) => void
  onOpenKnowledgeArticle?: (slug: string) => void
}

export function WorkflowScenarioBuilderDialog(
  props: WorkflowScenarioBuilderDialogProps
): JSX.Element | null {
  const { open, onClose, onStatus, onOpenKnowledgeArticle } = props
  const jsonFieldId = useId()
  const [busy, setBusy] = useState(false)
  const [items, setItems] = useState<WorkflowScenarioListItem[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [templateId, setTemplateId] = useState<WorkflowScenarioTemplateId>(
    WORKFLOW_SCENARIO_TEMPLATES[0]?.id ?? 'local-file-process'
  )
  const [jsonText, setJsonText] = useState(() =>
    JSON.stringify(WORKFLOW_SCENARIO_TEMPLATE_V1, null, 2)
  )
  const parsedScenario = useMemo((): WorkflowScenarioDocument | null => {
    try {
      return parseWorkflowScenarioDocument(JSON.parse(jsonText) as unknown)
    } catch {
      return null
    }
  }, [jsonText])

  const reloadList = useCallback(async (): Promise<void> => {
    const res = await window.velorix.workflows.listScenarios()
    if (res.ok) {
      setItems(res.items)
    }
  }, [])

  useEffect(() => {
    if (!open) {
      return
    }
    let cancelled = false
    void window.velorix.workflows.listScenarios().then((res) => {
      if (cancelled || !res.ok) {
        return
      }
      setItems(res.items)
    })
    return (): void => {
      cancelled = true
    }
  }, [open])

  const loadScenario = useCallback(async (id: string): Promise<void> => {
    if (!id) {
      setJsonText(JSON.stringify(WORKFLOW_SCENARIO_TEMPLATE_V1, null, 2))
      setSelectedId('')
      return
    }
    setBusy(true)
    try {
      const res = await window.velorix.workflows.getScenario(id)
      if (res.ok) {
        setSelectedId(res.scenario.id)
        setJsonText(JSON.stringify(res.scenario, null, 2))
      }
    } finally {
      setBusy(false)
    }
  }, [])

  const validateJson = useCallback((): boolean => {
    let raw: unknown
    try {
      raw = JSON.parse(jsonText) as unknown
    } catch {
      onStatus(uiText('workflowScenarioValidateFail'))
      return false
    }
    const doc = parseWorkflowScenarioDocument(raw)
    if (!doc) {
      onStatus(uiText('workflowScenarioValidateFail'))
      return false
    }
    onStatus(uiText('workflowScenarioValidateOk'))
    return true
  }, [jsonText, onStatus])

  const saveScenario = useCallback(async (): Promise<void> => {
    if (!validateJson()) {
      return
    }
    const doc = parseWorkflowScenarioDocument(JSON.parse(jsonText) as unknown)
    if (!doc) {
      return
    }
    setBusy(true)
    try {
      const res = await window.velorix.workflows.saveScenario(doc)
      if (res.ok) {
        onStatus(uiText('workflowScenarioSaved'))
        setSelectedId(res.scenario.id)
        setJsonText(JSON.stringify(res.scenario, null, 2))
        await reloadList()
      } else {
        onStatus(uiText('workflowScenarioSaveFailed'))
      }
    } finally {
      setBusy(false)
    }
  }, [jsonText, onStatus, reloadList, validateJson])

  const deleteScenario = useCallback(async (): Promise<void> => {
    let raw: unknown
    try {
      raw = JSON.parse(jsonText) as unknown
    } catch {
      return
    }
    const doc = parseWorkflowScenarioDocument(raw)
    const id = doc?.id ?? selectedId
    if (!id) {
      return
    }
    setBusy(true)
    try {
      const res = await window.velorix.workflows.deleteScenario(id)
      if (res.ok) {
        onStatus(uiText('workflowScenarioDeleted'))
        await reloadList()
        await loadScenario('')
      } else {
        onStatus(uiText('workflowScenarioDeleteFailed'))
      }
    } finally {
      setBusy(false)
    }
  }, [jsonText, loadScenario, onStatus, reloadList, selectedId])

  if (!open) {
    return null
  }

  return (
    <div
      className="app-modal-backdrop"
      role="presentation"
      onMouseDown={(e) => {
        if (busy) {
          return
        }
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        className="app-modal app-modal-wide"
        role="dialog"
        aria-modal="true"
        aria-busy={busy}
        aria-labelledby="workflow-scenario-builder-title"
        aria-describedby="workflow-scenario-builder-hint"
        onMouseDown={(e) => {
          e.stopPropagation()
        }}
      >
        <div className="app-modal-title-row">
          <h2 id="workflow-scenario-builder-title" className="app-modal-title">
            {uiText('workflowScenarioBuilderDialogTitle')}
          </h2>
          {onOpenKnowledgeArticle ? (
            <div
              className="app-settings-panel-head-trailing"
              role="toolbar"
              aria-orientation="horizontal"
            >
              <KnowledgeDeepLinkButton
                label={uiText('knowledgeDeepLinkWorkflows')}
                tooltip={uiText('knowledgeDeepLinkWorkflowsTooltip')}
                ariaDescribedBy="workflow-scenario-builder-hint"
                disabled={busy}
                onOpen={() => {
                  onOpenKnowledgeArticle(KNOWLEDGE_SLUG_WORKFLOWS_PLANNER_SCENARIOS)
                }}
              />
            </div>
          ) : null}
        </div>
        <p id="workflow-scenario-builder-hint" className="app-modal-hint">
          {uiText('workflowScenarioBuilderDialogHint')}
        </p>
        {parsedScenario ? (
          <div
            className="workflow-scenario-flow-toolbar"
            role="toolbar"
            aria-orientation="horizontal"
            aria-label={uiText('workflowScenarioAddBlockToolbarAria')}
          >
            {(['download', 'process', 'save'] as const).map((kind) => (
              <button
                key={kind}
                type="button"
                className="app-btn app-btn-compact"
                disabled={busy}
                title={uiText('workflowScenarioAddBlock')}
                onClick={() => {
                  const id = allocateWorkflowScenarioNodeId(kind, parsedScenario.nodes)
                  const label = uiText(workflowScenarioNodeKindLabelKey(kind))
                  const next = appendWorkflowScenarioNode(parsedScenario, { id, kind, label })
                  setJsonText(JSON.stringify(next, null, 2))
                }}
              >
                {uiText('workflowScenarioAddBlock')} —{' '}
                {uiText(workflowScenarioNodeKindLabelKey(kind))}
              </button>
            ))}
          </div>
        ) : null}
        <WorkflowScenarioFlowDiagram
          scenario={parsedScenario}
          editable={parsedScenario !== null && !busy}
          onReorder={(next) => {
            setJsonText(JSON.stringify(next, null, 2))
          }}
          onConnect={(next) => {
            setJsonText(JSON.stringify(next, null, 2))
          }}
          onRemoveNode={(nodeId) => {
            if (!parsedScenario) {
              return
            }
            const next = removeWorkflowScenarioNode(parsedScenario, nodeId)
            if (next) {
              setJsonText(JSON.stringify(next, null, 2))
            } else {
              onStatus(uiText('workflowScenarioRemoveBlockLast'))
            }
          }}
        />
        <div className="app-settings-field-row">
          <label className="app-settings-label" htmlFor="workflow-scenario-template">
            {uiText('workflowScenarioTemplateLabel')}
          </label>
          <select
            id="workflow-scenario-template"
            className="app-settings-select"
            disabled={busy}
            value={templateId}
            title={uiText('workflowScenarioTemplateLabel')}
            onChange={(e) => {
              const next = e.target.value as WorkflowScenarioTemplateId
              setTemplateId(next)
              const spec = WORKFLOW_SCENARIO_TEMPLATES.find((t) => t.id === next)
              if (spec) {
                setSelectedId('')
                setJsonText(JSON.stringify(spec.build(), null, 2))
              }
            }}
          >
            {WORKFLOW_SCENARIO_TEMPLATES.map((t) => (
              <option key={t.id} value={t.id}>
                {uiText(t.titleKey as UiTextKey)}
              </option>
            ))}
          </select>
          <p className="app-settings-section-hint">
            {uiText(
              (WORKFLOW_SCENARIO_TEMPLATES.find((t) => t.id === templateId)?.hintKey ??
                'workflowTemplateLocalHint') as UiTextKey
            )}
          </p>
        </div>
        <div className="app-settings-field-row">
          <label className="app-settings-label" htmlFor="workflow-scenario-pick">
            {uiText('workflowScenarioPickLabel')}
          </label>
          <select
            id="workflow-scenario-pick"
            className="app-settings-select"
            disabled={busy}
            value={selectedId}
            onChange={(e) => {
              const next = e.target.value
              void loadScenario(next)
            }}
          >
            <option value="">{uiText('workflowScenarioNewOption')}</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </div>
        <div className="app-field">
          <label htmlFor={jsonFieldId}>{uiText('workflowScenarioJsonLabel')}</label>
          <textarea
            id={jsonFieldId}
            className="app-control"
            style={{ fontFamily: 'ui-monospace, monospace', minHeight: '14rem' }}
            spellCheck={false}
            rows={16}
            disabled={busy}
            value={jsonText}
            onChange={(e) => {
              setJsonText(e.target.value)
            }}
          />
        </div>
        <div className="app-modal-actions" role="toolbar" aria-orientation="horizontal">
          <button
            type="button"
            className="app-btn app-btn-compact"
            disabled={busy}
            onClick={validateJson}
          >
            {uiText('workflowScenarioValidate')}
          </button>
          <button
            type="button"
            className="app-btn app-btn-compact"
            disabled={busy}
            onClick={() => {
              void saveScenario()
            }}
          >
            {uiText('workflowScenarioSave')}
          </button>
          <button
            type="button"
            className="app-btn app-btn-compact"
            disabled={busy || !selectedId}
            onClick={() => {
              void deleteScenario()
            }}
          >
            {uiText('workflowScenarioDelete')}
          </button>
          <button
            type="button"
            className="app-btn app-btn-primary"
            disabled={busy}
            onClick={() => onClose()}
          >
            {uiText('workflowScenarioClose')}
          </button>
        </div>
      </div>
    </div>
  )
}

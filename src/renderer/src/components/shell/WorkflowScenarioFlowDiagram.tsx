import { useCallback, useMemo, useState, type JSX } from 'react'

import type {
  WorkflowScenarioDocument,
  WorkflowScenarioNode
} from '../../../../shared/workflow-scenario-contract'
import {
  applyWorkflowScenarioNodeOrder,
  orderWorkflowScenarioNodes,
  workflowScenarioNodeKindLabelKey
} from '../../../../shared/workflow-scenario-layout'
import { uiText } from '../../locales/ui-text'

export function WorkflowScenarioFlowDiagram(props: {
  scenario: WorkflowScenarioDocument | null
  editable?: boolean
  onReorder?: (next: WorkflowScenarioDocument) => void
}): JSX.Element | null {
  const { scenario, editable, onReorder } = props
  const [dragNodeId, setDragNodeId] = useState<string | null>(null)
  const [dropTargetId, setDropTargetId] = useState<string | null>(null)

  const ordered = useMemo((): WorkflowScenarioNode[] => {
    if (!scenario) {
      return []
    }
    return orderWorkflowScenarioNodes(scenario.nodes, scenario.edges)
  }, [scenario])

  const canDrag = editable === true && onReorder !== undefined && ordered.length > 1

  const applyReorder = useCallback(
    (fromId: string, toId: string): void => {
      if (!scenario || !onReorder || fromId === toId) {
        return
      }
      const ids = ordered.map((n) => n.id)
      const fromIdx = ids.indexOf(fromId)
      const toIdx = ids.indexOf(toId)
      if (fromIdx < 0 || toIdx < 0) {
        return
      }
      const nextIds = [...ids]
      const [moved] = nextIds.splice(fromIdx, 1)
      if (!moved) {
        return
      }
      nextIds.splice(toIdx, 0, moved)
      const nextDoc = applyWorkflowScenarioNodeOrder(scenario, nextIds)
      if (nextDoc) {
        onReorder(nextDoc)
      }
    },
    [scenario, onReorder, ordered]
  )

  if (ordered.length === 0) {
    return null
  }

  return (
    <div
      className="workflow-scenario-flow-wrap"
      role="region"
      aria-label={uiText('workflowScenarioFlowAria')}
    >
      <p className="app-settings-hw-smoke-label">{uiText('workflowScenarioFlowLabel')}</p>
      {canDrag ? (
        <p className="app-modal-hint">{uiText('workflowScenarioFlowDragHint')}</p>
      ) : null}
      <ol className="workflow-scenario-flow">
        {ordered.map((node, index) => (
          <li
            key={node.id}
            className={[
              'workflow-scenario-flow-item',
              dropTargetId === node.id ? 'workflow-scenario-flow-item-drop-target' : ''
            ]
              .filter(Boolean)
              .join(' ')}
            draggable={canDrag}
            onDragStart={(e) => {
              if (!canDrag) {
                return
              }
              setDragNodeId(node.id)
              e.dataTransfer.effectAllowed = 'move'
            }}
            onDragEnd={() => {
              setDragNodeId(null)
              setDropTargetId(null)
            }}
            onDragOver={(e) => {
              if (!canDrag || !dragNodeId) {
                return
              }
              e.preventDefault()
              e.dataTransfer.dropEffect = 'move'
              setDropTargetId(node.id)
            }}
            onDragLeave={() => {
              if (dropTargetId === node.id) {
                setDropTargetId(null)
              }
            }}
            onDrop={(e) => {
              if (!canDrag || !dragNodeId) {
                return
              }
              e.preventDefault()
              applyReorder(dragNodeId, node.id)
              setDragNodeId(null)
              setDropTargetId(null)
            }}
          >
            <div
              className={[
                'workflow-scenario-flow-node',
                `workflow-scenario-flow-node--${node.kind}`,
                dragNodeId === node.id ? 'workflow-scenario-flow-node-dragging' : ''
              ].join(' ')}
              title={canDrag ? uiText('workflowScenarioFlowDragNodeTitle') : node.id}
            >
              {canDrag ? (
                <span className="workflow-scenario-flow-drag-glyph" aria-hidden>
                  ⋮⋮
                </span>
              ) : null}
              <span className="workflow-scenario-flow-kind">
                {uiText(workflowScenarioNodeKindLabelKey(node.kind))}
              </span>
              <span className="workflow-scenario-flow-label">{node.label}</span>
              {node.kind === 'download' && node.sourceUrl ? (
                <span className="workflow-scenario-flow-meta">{node.sourceUrl}</span>
              ) : null}
              {node.kind === 'save' && node.outputDirectory ? (
                <span className="workflow-scenario-flow-meta">{node.outputDirectory}</span>
              ) : null}
            </div>
            {index < ordered.length - 1 ? (
              <span className="workflow-scenario-flow-arrow" aria-hidden="true">
                →
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  )
}

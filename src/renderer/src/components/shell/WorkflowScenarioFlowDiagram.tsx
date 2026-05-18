import { useCallback, useMemo, useState, type JSX } from 'react'

import type {
  WorkflowScenarioDocument,
  WorkflowScenarioNode
} from '../../../../shared/workflow-scenario-contract'
import {
  addWorkflowScenarioEdge,
  listWorkflowScenarioNonAdjacentEdges,
  removeWorkflowScenarioEdge
} from '../../../../shared/workflow-scenario-edge-mutations'
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
  onConnect?: (next: WorkflowScenarioDocument) => void
  onRemoveNode?: (nodeId: string) => void
}): JSX.Element | null {
  const { scenario, editable, onReorder, onConnect, onRemoveNode } = props
  const [dragNodeId, setDragNodeId] = useState<string | null>(null)
  const [dropTargetId, setDropTargetId] = useState<string | null>(null)
  const [linkSourceId, setLinkSourceId] = useState<string | null>(null)

  const ordered = useMemo((): WorkflowScenarioNode[] => {
    if (!scenario) {
      return []
    }
    return orderWorkflowScenarioNodes(scenario.nodes, scenario.edges)
  }, [scenario])

  const extraEdges = useMemo(() => {
    if (!scenario) {
      return []
    }
    return listWorkflowScenarioNonAdjacentEdges(scenario)
  }, [scenario])

  const canEdit = editable === true && onReorder !== undefined
  const canDrag = canEdit && ordered.length > 1
  const canRemove = canEdit && onRemoveNode !== undefined
  const canLink = editable === true && onConnect !== undefined && ordered.length > 1

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

  const applyConnect = useCallback(
    (fromId: string, toId: string): void => {
      if (!scenario || !onConnect || fromId === toId) {
        return
      }
      const nextDoc = addWorkflowScenarioEdge(scenario, fromId, toId)
      if (nextDoc) {
        onConnect(nextDoc)
      }
    },
    [scenario, onConnect]
  )

  const applyDisconnect = useCallback(
    (fromId: string, toId: string): void => {
      if (!scenario || !onConnect) {
        return
      }
      const nextDoc = removeWorkflowScenarioEdge(scenario, fromId, toId)
      if (nextDoc) {
        onConnect(nextDoc)
      }
    },
    [scenario, onConnect]
  )

  if (ordered.length === 0) {
    return null
  }

  return (
    <div
      className="workflow-scenario-flow-wrap"
      role="region"
      aria-label={uiText('workflowScenarioFlowAria')}
      onPointerUp={() => {
        setLinkSourceId(null)
      }}
    >
      <p className="app-settings-hw-smoke-label">{uiText('workflowScenarioFlowLabel')}</p>
      {canDrag ? <p className="app-modal-hint">{uiText('workflowScenarioFlowDragHint')}</p> : null}
      {canLink ? <p className="app-modal-hint">{uiText('workflowScenarioFlowLinkHint')}</p> : null}
      <ol className="workflow-scenario-flow">
        {ordered.map((node, index) => {
          const nextNode = ordered[index + 1]
          const directEdge =
            nextNode !== undefined &&
            scenario?.edges.some((e) => e.from === node.id && e.to === nextNode.id) === true

          return (
            <li
              key={node.id}
              className={[
                'workflow-scenario-flow-item',
                dropTargetId === node.id ? 'workflow-scenario-flow-item-drop-target' : '',
                linkSourceId && linkSourceId !== node.id && canLink
                  ? 'workflow-scenario-flow-item-link-target'
                  : ''
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
              {canLink ? (
                <button
                  type="button"
                  className={[
                    'workflow-scenario-flow-port',
                    'workflow-scenario-flow-port-in',
                    linkSourceId && linkSourceId !== node.id
                      ? 'workflow-scenario-flow-port-active'
                      : ''
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  title={uiText('workflowScenarioFlowLinkToTitle')}
                  aria-label={uiText('workflowScenarioFlowLinkToTitle')}
                  onPointerDown={(e) => {
                    e.stopPropagation()
                  }}
                  onPointerUp={(e) => {
                    e.stopPropagation()
                    if (!linkSourceId || linkSourceId === node.id) {
                      return
                    }
                    applyConnect(linkSourceId, node.id)
                    setLinkSourceId(null)
                  }}
                />
              ) : null}
              <div
                className={[
                  'workflow-scenario-flow-node',
                  `workflow-scenario-flow-node--${node.kind}`,
                  dragNodeId === node.id ? 'workflow-scenario-flow-node-dragging' : ''
                ].join(' ')}
                title={canDrag ? uiText('workflowScenarioFlowDragNodeTitle') : node.id}
              >
                {canRemove ? (
                  <button
                    type="button"
                    className="app-btn app-btn-icon workflow-scenario-flow-remove"
                    title={uiText('workflowScenarioFlowRemoveNode')}
                    aria-label={uiText('workflowScenarioFlowRemoveNode')}
                    disabled={ordered.length <= 1}
                    onClick={() => {
                      onRemoveNode(node.id)
                    }}
                  >
                    ×
                  </button>
                ) : null}
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
              {canLink ? (
                <button
                  type="button"
                  className={[
                    'workflow-scenario-flow-port',
                    'workflow-scenario-flow-port-out',
                    linkSourceId === node.id ? 'workflow-scenario-flow-port-source' : ''
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  title={uiText('workflowScenarioFlowLinkFromTitle')}
                  aria-label={uiText('workflowScenarioFlowLinkFromTitle')}
                  onPointerDown={(e) => {
                    e.stopPropagation()
                    setLinkSourceId(node.id)
                  }}
                />
              ) : null}
              {nextNode !== undefined ? (
                directEdge ? (
                  canLink ? (
                    <button
                      type="button"
                      className="workflow-scenario-flow-arrow workflow-scenario-flow-arrow-btn"
                      title={uiText('workflowScenarioFlowUnlinkTitle')}
                      aria-label={uiText('workflowScenarioFlowUnlinkTitle')}
                      onClick={() => {
                        applyDisconnect(node.id, nextNode.id)
                      }}
                    >
                      →
                    </button>
                  ) : (
                    <span className="workflow-scenario-flow-arrow" aria-hidden="true">
                      →
                    </span>
                  )
                ) : (
                  <span className="workflow-scenario-flow-gap" aria-hidden="true">
                    ·
                  </span>
                )
              ) : null}
            </li>
          )
        })}
      </ol>
      {canLink && extraEdges.length > 0 ? (
        <ul
          className="workflow-scenario-flow-extra-edges"
          aria-label={uiText('workflowScenarioFlowExtraEdgesAria')}
        >
          {extraEdges.map((edge) => (
            <li key={`${edge.from}-${edge.to}`} className="workflow-scenario-flow-extra-edge">
              <span>
                {edge.from} → {edge.to}
              </span>
              <button
                type="button"
                className="app-btn app-btn-compact"
                title={uiText('workflowScenarioFlowUnlinkTitle')}
                onClick={() => {
                  applyDisconnect(edge.from, edge.to)
                }}
              >
                {uiText('workflowScenarioFlowUnlinkShort')}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

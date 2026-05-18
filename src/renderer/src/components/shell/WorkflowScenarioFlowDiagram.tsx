import { useMemo, type JSX } from 'react'

import type {
  WorkflowScenarioDocument,
  WorkflowScenarioNode
} from '../../../../shared/workflow-scenario-contract'
import {
  orderWorkflowScenarioNodes,
  workflowScenarioNodeKindLabelKey
} from '../../../../shared/workflow-scenario-layout'
import { uiText } from '../../locales/ui-text'

export function WorkflowScenarioFlowDiagram(props: {
  scenario: WorkflowScenarioDocument | null
}): JSX.Element | null {
  const ordered = useMemo((): WorkflowScenarioNode[] => {
    if (!props.scenario) {
      return []
    }
    return orderWorkflowScenarioNodes(props.scenario.nodes, props.scenario.edges)
  }, [props.scenario])

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
      <ol className="workflow-scenario-flow">
        {ordered.map((node, index) => (
          <li key={node.id} className="workflow-scenario-flow-item">
            <div
              className={`workflow-scenario-flow-node workflow-scenario-flow-node--${node.kind}`}
              title={node.id}
            >
              <span className="workflow-scenario-flow-kind">
                {uiText(workflowScenarioNodeKindLabelKey(node.kind))}
              </span>
              <span className="workflow-scenario-flow-label">{node.label}</span>
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

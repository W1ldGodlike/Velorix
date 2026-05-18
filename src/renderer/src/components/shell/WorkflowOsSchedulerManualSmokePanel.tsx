import { useMemo, useState, type JSX } from 'react'

import { KNOWLEDGE_SLUG_WORKFLOWS_PLANNER_SCENARIOS } from '../../../../shared/knowledge-contract'
import { formatFfmpegHwManualSmokeChecklistPlainText } from '../../../../shared/ffmpeg-hw-manual-smoke-checklist-build'
import { getUiLocale, uiText } from '../../locales/ui-text'
import {
  getWorkflowOsSchedulerManualSmokeChecklistForUiLocale,
  type WorkflowOsSchedulerSmokeCapabilities
} from '../../workflow-os-scheduler-manual-smoke-checklist-locale'
import { KnowledgeDeepLinkButton } from '../KnowledgeDeepLinkButton'

export function WorkflowOsSchedulerManualSmokePanel(props: {
  capabilities: WorkflowOsSchedulerSmokeCapabilities
  sectionHintId: string
  onOpenKnowledgeArticle?: (slug: string) => void
}): JSX.Element | null {
  const { capabilities, sectionHintId, onOpenKnowledgeArticle } = props
  const hasAny =
    capabilities.windowsTaskScheduler ||
    capabilities.macosLaunchd ||
    capabilities.linuxSystemdUserTimer
  const [copyHint, setCopyHint] = useState<string | null>(null)
  const locale = getUiLocale()
  const sections = useMemo(
    () =>
      hasAny
        ? getWorkflowOsSchedulerManualSmokeChecklistForUiLocale(locale, capabilities)
        : [],
    [hasAny, locale, capabilities]
  )
  const plainText = useMemo(
    () => formatFfmpegHwManualSmokeChecklistPlainText(sections),
    [sections]
  )

  if (!hasAny) {
    return null
  }

  const onCopy = (): void => {
    void navigator.clipboard
      .writeText(plainText)
      .then(() => {
        setCopyHint(uiText('workflowPlannerOsSmokeCopied'))
        window.setTimeout(() => setCopyHint(null), 2400)
      })
      .catch(() => {
        setCopyHint(uiText('workflowPlannerOsSmokeCopyFailed'))
      })
  }

  return (
    <section
      className="app-settings-fieldset workflow-planner-os-smoke-panel"
      aria-describedby={sectionHintId}
    >
      <div className="app-settings-hw-smoke-header">
        <h3 className="app-settings-hw-smoke-label">{uiText('workflowPlannerOsSmokeLegend')}</h3>
        {onOpenKnowledgeArticle ? (
          <KnowledgeDeepLinkButton
            label={uiText('knowledgeDeepLinkWorkflows')}
            tooltip={uiText('knowledgeDeepLinkWorkflowsTooltip')}
            ariaDescribedBy={sectionHintId}
            onOpen={() => {
              onOpenKnowledgeArticle(KNOWLEDGE_SLUG_WORKFLOWS_PLANNER_SCENARIOS)
            }}
          />
        ) : null}
      </div>
      <p className="app-modal-hint">{uiText('workflowPlannerOsSmokeIntro')}</p>
      <button type="button" className="app-btn app-btn-compact" onClick={onCopy}>
        {uiText('workflowPlannerOsSmokeCopy')}
      </button>
      {copyHint ? <p className="app-modal-hint">{copyHint}</p> : null}
      {sections.map((section) => (
        <div key={section.id} className="app-settings-hw-smoke-section">
          <h4 className="app-settings-hw-smoke-label">{section.title}</h4>
          <p className="app-settings-section-hint">{uiText('workflowPlannerOsSmokePrereqLabel')}</p>
          <ul className="app-settings-hidpi-checklist">
            {section.prerequisites.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <p className="app-settings-section-hint">{uiText('workflowPlannerOsSmokeStepsLabel')}</p>
          <ol className="app-settings-hidpi-checklist">
            {section.steps.map((step) => (
              <li key={step.id}>{step.text}</li>
            ))}
          </ol>
          <p className="app-settings-section-hint">{uiText('workflowPlannerOsSmokePassLabel')}</p>
          <ul className="app-settings-hidpi-checklist">
            {section.pass.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  )
}

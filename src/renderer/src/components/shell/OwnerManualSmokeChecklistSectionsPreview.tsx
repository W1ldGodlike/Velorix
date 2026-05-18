import type { JSX } from 'react'

import type { FfmpegHwManualSmokeChecklistSection } from '../../../../shared/ffmpeg-hw-manual-smoke-checklist-types'
import { summarizeManualSmokeChecklistSections } from '../../../../shared/owner-manual-smoke-checklist-summary'
import { uiText, uiTextVars } from '../../locales/ui-text'

export function OwnerManualSmokeChecklistSectionsPreview(props: {
  sections: readonly FfmpegHwManualSmokeChecklistSection[]
  summaryLabel: string
  defaultOpen?: boolean
}): JSX.Element | null {
  if (props.sections.length === 0) {
    return null
  }
  const counts = summarizeManualSmokeChecklistSections(props.sections)
  return (
    <details className="app-settings-owner-smoke-preview-block" open={props.defaultOpen ?? false}>
      <summary className="app-settings-owner-smoke-preview-summary">
        {props.summaryLabel}{' '}
        <span className="app-settings-owner-smoke-preview-meta">
          {uiTextVars('appSettingsOwnerSmokePreviewCounts', {
            sections: String(counts.sectionCount),
            steps: String(counts.stepCount)
          })}
        </span>
      </summary>
      {props.sections.map((section) => (
        <article key={section.id} className="app-settings-hw-smoke-section">
          <h4 className="app-settings-hw-smoke-section-title">{section.title}</h4>
          <p className="app-settings-hw-smoke-label">{uiText('appSettingsHwManualSmokePrereqLabel')}</p>
          <ul className="app-settings-hidpi-checklist">
            {section.prerequisites.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="app-settings-hw-smoke-label">{uiText('appSettingsHwManualSmokeStepsLabel')}</p>
          <ol className="app-settings-hw-smoke-steps">
            {section.steps.map((step) => (
              <li key={step.id}>
                <span className="app-settings-hw-smoke-step-id">{step.id}</span> {step.text}
              </li>
            ))}
          </ol>
          <p className="app-settings-hw-smoke-label">{uiText('appSettingsHwManualSmokePassLabel')}</p>
          <ul className="app-settings-hidpi-checklist">
            {section.pass.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </article>
      ))}
    </details>
  )
}

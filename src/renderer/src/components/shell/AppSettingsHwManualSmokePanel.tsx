import { useMemo, useState, type JSX } from 'react'

import {
  formatFfmpegHwManualSmokeChecklistPlainText,
  orderHwManualSmokeSectionsForDisplay,
  resolvePrimaryHwManualSmokeSectionId
} from '../../../../shared/ffmpeg-hw-manual-smoke-checklist-build'
import { KNOWLEDGE_SLUG_HARDWARE_ENCODING } from '../../../../shared/knowledge-contract'
import { getUiLocale, uiText } from '../../locales/ui-text'
import { getFfmpegHwManualSmokeChecklistForUiLocale } from '../../hw-manual-smoke-checklist-locale'
import { KnowledgeDeepLinkButton } from '../KnowledgeDeepLinkButton'

export function AppSettingsHwManualSmokePanel(props: {
  sectionHintId: string
  onOpenKnowledgeArticle?: (slug: string) => void
}): JSX.Element {
  const [copyHint, setCopyHint] = useState<string | null>(null)
  const locale = getUiLocale()
  const sections = useMemo(
    () => getFfmpegHwManualSmokeChecklistForUiLocale(locale),
    [locale]
  )
  const primaryId = useMemo(() => resolvePrimaryHwManualSmokeSectionId(), [])
  const ordered = useMemo(
    () => orderHwManualSmokeSectionsForDisplay(sections, primaryId),
    [sections, primaryId]
  )
  const plainText = useMemo(() => formatFfmpegHwManualSmokeChecklistPlainText(ordered), [ordered])

  const onCopy = (): void => {
    void navigator.clipboard
      .writeText(plainText)
      .then(() => {
        setCopyHint(uiText('appSettingsHwManualSmokeCopied'))
        window.setTimeout(() => setCopyHint(null), 2400)
      })
      .catch(() => {
        setCopyHint(uiText('appSettingsHwManualSmokeCopyFailed'))
      })
  }

  return (
    <section
      className="app-settings-fieldset app-settings-hw-smoke-panel"
      aria-describedby={props.sectionHintId}
    >
      <div className="app-settings-hw-smoke-header">
        <h3 className="app-settings-hidpi-title">{uiText('appSettingsHwManualSmokeLegend')}</h3>
        <div className="app-settings-panel-head-trailing" role="toolbar" aria-orientation="horizontal">
          {props.onOpenKnowledgeArticle ? (
            <KnowledgeDeepLinkButton
              label={uiText('knowledgeDeepLinkHwSmokeLabel')}
              tooltip={uiText('knowledgeDeepLinkHwSmokeTooltip')}
              ariaDescribedBy={props.sectionHintId}
              onOpen={() => {
                props.onOpenKnowledgeArticle?.(KNOWLEDGE_SLUG_HARDWARE_ENCODING)
              }}
            />
          ) : null}
          <button type="button" className="app-btn app-btn-compact" onClick={onCopy}>
            {uiText('appSettingsHwManualSmokeCopy')}
          </button>
        </div>
      </div>
      <p className="app-modal-hint">{uiText('appSettingsHwManualSmokeIntro')}</p>
      {primaryId !== null ? (
        <p className="app-modal-hint app-settings-hw-smoke-primary">
          {uiText(
            primaryId === 'win-nvenc'
              ? 'appSettingsHwManualSmokePrimaryWin'
              : 'appSettingsHwManualSmokePrimaryLinux'
          )}
        </p>
      ) : (
        <p className="app-modal-hint">{uiText('appSettingsHwManualSmokePrimaryOther')}</p>
      )}
      {copyHint ? (
        <p className="app-modal-hint" role="status" aria-live="polite">
          {copyHint}
        </p>
      ) : null}
      {ordered.map((section) => (
        <article
          key={section.id}
          className={
            section.id === primaryId
              ? 'app-settings-hw-smoke-section app-settings-hw-smoke-section--primary'
              : 'app-settings-hw-smoke-section'
          }
        >
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
    </section>
  )
}

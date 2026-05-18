import { useMemo, useState, type JSX } from 'react'

import { formatFfmpegHwManualSmokeChecklistPlainText } from '../../../../shared/ffmpeg-hw-manual-smoke-checklist-build'
import { KNOWLEDGE_SLUG_PACKAGED_WINDOWS_SMOKE } from '../../../../shared/knowledge-contract'
import { getUiLocale, uiText } from '../../locales/ui-text'
import { getWinPackagedManualSmokeChecklistForUiLocale } from '../../win-packaged-manual-smoke-checklist-locale'
import { KnowledgeDeepLinkButton } from '../KnowledgeDeepLinkButton'

export function AppSettingsWinPackagedSmokePanel(props: {
  sectionHintId: string
  onOpenKnowledgeArticle?: (slug: string) => void
}): JSX.Element {
  const [copyHint, setCopyHint] = useState<string | null>(null)
  const locale = getUiLocale()
  const sections = useMemo(
    () => getWinPackagedManualSmokeChecklistForUiLocale(locale),
    [locale]
  )
  const plainText = useMemo(
    () => formatFfmpegHwManualSmokeChecklistPlainText(sections),
    [sections]
  )

  const onCopy = (): void => {
    void navigator.clipboard
      .writeText(plainText)
      .then(() => {
        setCopyHint(uiText('appSettingsWinPackagedSmokeCopied'))
        window.setTimeout(() => setCopyHint(null), 2400)
      })
      .catch(() => {
        setCopyHint(uiText('appSettingsWinPackagedSmokeCopyFailed'))
      })
  }

  const section = sections[0]
  if (!section) {
    return <></>
  }

  return (
    <section
      className="app-settings-fieldset app-settings-hw-smoke-panel"
      aria-describedby={props.sectionHintId}
    >
      <div className="app-settings-hw-smoke-header">
        <h3 className="app-settings-hidpi-title">{uiText('appSettingsWinPackagedSmokeLegend')}</h3>
        <div className="app-settings-panel-head-trailing" role="toolbar" aria-orientation="horizontal">
          {props.onOpenKnowledgeArticle ? (
            <KnowledgeDeepLinkButton
              label={uiText('knowledgeDeepLinkPackagedWinLabel')}
              tooltip={uiText('knowledgeDeepLinkPackagedWinTooltip')}
              ariaDescribedBy={props.sectionHintId}
              onOpen={() => {
                props.onOpenKnowledgeArticle?.(KNOWLEDGE_SLUG_PACKAGED_WINDOWS_SMOKE)
              }}
            />
          ) : null}
          <button type="button" className="app-btn app-btn-compact" onClick={onCopy}>
            {uiText('appSettingsWinPackagedSmokeCopy')}
          </button>
        </div>
      </div>
      <p className="app-modal-hint">{uiText('appSettingsWinPackagedSmokeIntro')}</p>
      {copyHint ? (
        <p className="app-modal-hint" role="status" aria-live="polite">
          {copyHint}
        </p>
      ) : null}
      <article className="app-settings-hw-smoke-section app-settings-hw-smoke-section--primary">
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
    </section>
  )
}

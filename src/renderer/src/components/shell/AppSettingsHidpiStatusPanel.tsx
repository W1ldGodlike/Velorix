import { useEffect, useState, type JSX } from 'react'

import { KNOWLEDGE_SLUG_APPEARANCE_LANGUAGE_THEME } from '../../../../shared/knowledge-contract'
import { uiText, uiTextVars } from '../../locales/ui-text'
import { UI_HIDPI_CSS_MEDIA_TIERS } from '../../../../shared/ui-hidpi-scale-tiers'
import { readUiHidpiRuntimeStatus, type UiHidpiRuntimeStatus } from '../../ui-hidpi-runtime-status'
import { KnowledgeDeepLinkButton } from '../KnowledgeDeepLinkButton'
import { APP_SETTINGS_HIDPI_ANCHOR } from './app-settings-smoke-anchors'

function formatActiveTierLine(status: UiHidpiRuntimeStatus): string {
  if (status.activeWindowsScalePercent !== null && status.activeCssTierDpi !== null) {
    return uiTextVars('appSettingsHidpiActiveTier', {
      percent: String(status.activeWindowsScalePercent),
      dpi: String(status.activeCssTierDpi)
    })
  }
  return uiText('appSettingsHidpiBaseTier')
}

export function AppSettingsHidpiStatusPanel(props: {
  sectionHintId: string
  onOpenKnowledgeArticle?: (slug: string) => void
}): JSX.Element {
  const [status, setStatus] = useState<UiHidpiRuntimeStatus>(() => readUiHidpiRuntimeStatus())

  useEffect(() => {
    const refresh = (): void => {
      setStatus(readUiHidpiRuntimeStatus())
    }
    refresh()
    window.addEventListener('resize', refresh)
    const media = UI_HIDPI_CSS_MEDIA_TIERS.map((tier) =>
      window.matchMedia(
        `(-webkit-min-device-pixel-ratio: ${tier.minDevicePixelRatio}), (min-resolution: ${tier.minResolutionDpi}dpi)`
      )
    )
    for (const mq of media) {
      mq.addEventListener('change', refresh)
    }
    return () => {
      window.removeEventListener('resize', refresh)
      for (const mq of media) {
        mq.removeEventListener('change', refresh)
      }
    }
  }, [])

  return (
    <section
      id={APP_SETTINGS_HIDPI_ANCHOR}
      className="app-settings-fieldset app-settings-hidpi-panel"
      aria-describedby={props.sectionHintId}
    >
      <div className="app-settings-hw-smoke-header">
        <h3 className="app-settings-hidpi-title">{uiText('appSettingsHidpiLegend')}</h3>
        {props.onOpenKnowledgeArticle ? (
          <div
            className="app-settings-panel-head-trailing"
            role="toolbar"
            aria-orientation="horizontal"
          >
            <KnowledgeDeepLinkButton
              label={uiText('knowledgeDeepLinkHidpiLabel')}
              tooltip={uiText('knowledgeDeepLinkHidpiTooltip')}
              ariaDescribedBy={props.sectionHintId}
              onOpen={() => {
                props.onOpenKnowledgeArticle?.(KNOWLEDGE_SLUG_APPEARANCE_LANGUAGE_THEME)
              }}
            />
          </div>
        ) : null}
      </div>
      <p className="app-modal-hint">
        {uiTextVars('appSettingsHidpiDevicePixelRatio', {
          ratio: status.devicePixelRatio.toFixed(2)
        })}
      </p>
      <p className="app-modal-hint">
        {uiTextVars('appSettingsHidpiApproxScale', {
          percent: String(status.approximateWindowsScalePercent)
        })}
      </p>
      <p className="app-modal-hint app-settings-hidpi-active">{formatActiveTierLine(status)}</p>
    </section>
  )
}

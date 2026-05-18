import type { JSX } from 'react'

import { APP_SETTINGS_THEME_CHECKLIST_KEYS } from '../../../../shared/app-settings-theme-checklist-keys'
import {
  KNOWLEDGE_SLUG_APPEARANCE_LANGUAGE_THEME,
  KNOWLEDGE_SLUG_OWNER_MANUAL_SMOKE
} from '../../../../shared/knowledge-contract'
import type { AppTheme } from '../../../../shared/settings-contract'
import { uiText } from '../../locales/ui-text'
import { KnowledgeDeepLinkButton } from '../KnowledgeDeepLinkButton'
import { APP_SETTINGS_THEME_ANCHOR } from './app-settings-smoke-anchors'

export function AppSettingsThemePanel(props: {
  sectionHintId: string
  shellBusy: boolean
  themePref: AppTheme
  onThemePrefChange: (pref: AppTheme) => void
  onOpenKnowledgeArticle?: (slug: string) => void
}): JSX.Element {
  return (
    <section
      id={APP_SETTINGS_THEME_ANCHOR}
      className="app-settings-fieldset app-settings-theme-panel"
      aria-describedby={props.sectionHintId}
    >
      <div className="app-settings-hw-smoke-header">
        <h3 className="app-settings-hidpi-title">{uiText('appSettingsThemeLegend')}</h3>
        {props.onOpenKnowledgeArticle ? (
          <div
            className="app-settings-panel-head-trailing"
            role="toolbar"
            aria-orientation="horizontal"
          >
            <KnowledgeDeepLinkButton
              label={uiText('knowledgeDeepLinkOwnerSmokeLabel')}
              tooltip={uiText('knowledgeDeepLinkOwnerSmokeTooltip')}
              ariaDescribedBy={props.sectionHintId}
              onOpen={() => {
                props.onOpenKnowledgeArticle?.(KNOWLEDGE_SLUG_OWNER_MANUAL_SMOKE)
              }}
            />
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
      <fieldset
        className="app-settings-fieldset app-settings-theme-radios"
        disabled={props.shellBusy}
      >
        <legend className="app-visually-hidden">{uiText('appSettingsThemeLegend')}</legend>
        {(['system', 'dark', 'light'] as const).map((pref) => (
          <label key={pref} className="app-settings-radio-row">
            <input
              type="radio"
              name="app-settings-theme"
              checked={props.themePref === pref}
              onChange={() => {
                props.onThemePrefChange(pref)
              }}
            />
            <span>
              {pref === 'system'
                ? uiText('appSettingsThemeSystem')
                : pref === 'dark'
                  ? uiText('appSettingsThemeDark')
                  : uiText('appSettingsThemeLight')}
            </span>
          </label>
        ))}
      </fieldset>
      <p className="app-modal-hint">{uiText('appSettingsThemeManualHint')}</p>
      <p className="app-modal-hint">{uiText('appSettingsThemeOwnerBundleHint')}</p>
      <p className="app-modal-hint app-settings-hidpi-checklist-intro">
        {uiText('appSettingsThemeChecklistIntro')}
      </p>
      <ul className="app-settings-hidpi-checklist">
        {APP_SETTINGS_THEME_CHECKLIST_KEYS.map((key) => (
          <li key={key}>{uiText(key)}</li>
        ))}
      </ul>
    </section>
  )
}

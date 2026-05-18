import { useMemo, useState, type JSX } from 'react'

import type { AppUiLocale } from '../../../../shared/app-ui-locale'
import { formatFfmpegHwManualSmokeChecklistPlainText } from '../../../../shared/ffmpeg-hw-manual-smoke-checklist-build'
import type { FfmpegHwManualSmokeChecklistSection } from '../../../../shared/ffmpeg-hw-manual-smoke-checklist-types'
import {
  KNOWLEDGE_SLUG_OWNER_MANUAL_SMOKE,
  KNOWLEDGE_SLUG_PACKAGED_LINUX_SMOKE,
  KNOWLEDGE_SLUG_PACKAGED_MACOS_SMOKE,
  KNOWLEDGE_SLUG_PACKAGED_WINDOWS_SMOKE
} from '../../../../shared/knowledge-contract'
import { getUiLocale, uiText } from '../../locales/ui-text'
import { getLinuxPackagedManualSmokeChecklistForUiLocale } from '../../linux-packaged-manual-smoke-checklist-locale'
import { getMacosPackagedManualSmokeChecklistForUiLocale } from '../../macos-packaged-manual-smoke-checklist-locale'
import { getWinPackagedManualSmokeChecklistForUiLocale } from '../../win-packaged-manual-smoke-checklist-locale'
import { KnowledgeDeepLinkButton } from '../KnowledgeDeepLinkButton'
import { APP_SETTINGS_PACKAGED_SMOKE_ANCHOR } from './app-settings-smoke-anchors'

export type PackagedSmokePlatform = 'win' | 'linux' | 'macos'

type PackagedSmokePanelConfig = {
  getSections: (locale: AppUiLocale) => readonly FfmpegHwManualSmokeChecklistSection[]
  legendKey:
    | 'appSettingsWinPackagedSmokeLegend'
    | 'appSettingsLinuxPackagedSmokeLegend'
    | 'appSettingsMacosPackagedSmokeLegend'
  introKey:
    | 'appSettingsWinPackagedSmokeIntro'
    | 'appSettingsLinuxPackagedSmokeIntro'
    | 'appSettingsMacosPackagedSmokeIntro'
  copyKey:
    | 'appSettingsWinPackagedSmokeCopy'
    | 'appSettingsLinuxPackagedSmokeCopy'
    | 'appSettingsMacosPackagedSmokeCopy'
  copiedKey:
    | 'appSettingsWinPackagedSmokeCopied'
    | 'appSettingsLinuxPackagedSmokeCopied'
    | 'appSettingsMacosPackagedSmokeCopied'
  copyFailedKey:
    | 'appSettingsWinPackagedSmokeCopyFailed'
    | 'appSettingsLinuxPackagedSmokeCopyFailed'
    | 'appSettingsMacosPackagedSmokeCopyFailed'
  knowledgeSlug: string
  deepLinkLabelKey:
    | 'knowledgeDeepLinkPackagedWinLabel'
    | 'knowledgeDeepLinkPackagedLinuxLabel'
    | 'knowledgeDeepLinkPackagedMacosLabel'
  deepLinkTooltipKey:
    | 'knowledgeDeepLinkPackagedWinTooltip'
    | 'knowledgeDeepLinkPackagedLinuxTooltip'
    | 'knowledgeDeepLinkPackagedMacosTooltip'
}

const PACKAGED_SMOKE_CONFIG: Record<PackagedSmokePlatform, PackagedSmokePanelConfig> = {
  win: {
    getSections: getWinPackagedManualSmokeChecklistForUiLocale,
    legendKey: 'appSettingsWinPackagedSmokeLegend',
    introKey: 'appSettingsWinPackagedSmokeIntro',
    copyKey: 'appSettingsWinPackagedSmokeCopy',
    copiedKey: 'appSettingsWinPackagedSmokeCopied',
    copyFailedKey: 'appSettingsWinPackagedSmokeCopyFailed',
    knowledgeSlug: KNOWLEDGE_SLUG_PACKAGED_WINDOWS_SMOKE,
    deepLinkLabelKey: 'knowledgeDeepLinkPackagedWinLabel',
    deepLinkTooltipKey: 'knowledgeDeepLinkPackagedWinTooltip'
  },
  linux: {
    getSections: getLinuxPackagedManualSmokeChecklistForUiLocale,
    legendKey: 'appSettingsLinuxPackagedSmokeLegend',
    introKey: 'appSettingsLinuxPackagedSmokeIntro',
    copyKey: 'appSettingsLinuxPackagedSmokeCopy',
    copiedKey: 'appSettingsLinuxPackagedSmokeCopied',
    copyFailedKey: 'appSettingsLinuxPackagedSmokeCopyFailed',
    knowledgeSlug: KNOWLEDGE_SLUG_PACKAGED_LINUX_SMOKE,
    deepLinkLabelKey: 'knowledgeDeepLinkPackagedLinuxLabel',
    deepLinkTooltipKey: 'knowledgeDeepLinkPackagedLinuxTooltip'
  },
  macos: {
    getSections: getMacosPackagedManualSmokeChecklistForUiLocale,
    legendKey: 'appSettingsMacosPackagedSmokeLegend',
    introKey: 'appSettingsMacosPackagedSmokeIntro',
    copyKey: 'appSettingsMacosPackagedSmokeCopy',
    copiedKey: 'appSettingsMacosPackagedSmokeCopied',
    copyFailedKey: 'appSettingsMacosPackagedSmokeCopyFailed',
    knowledgeSlug: KNOWLEDGE_SLUG_PACKAGED_MACOS_SMOKE,
    deepLinkLabelKey: 'knowledgeDeepLinkPackagedMacosLabel',
    deepLinkTooltipKey: 'knowledgeDeepLinkPackagedMacosTooltip'
  }
}

export function AppSettingsPackagedSmokePanel(props: {
  platform: PackagedSmokePlatform
  sectionHintId: string
  onOpenKnowledgeArticle?: (slug: string) => void
}): JSX.Element {
  const config = PACKAGED_SMOKE_CONFIG[props.platform]
  const [copyHint, setCopyHint] = useState<string | null>(null)
  const locale = getUiLocale()
  const sections = useMemo(
    () => PACKAGED_SMOKE_CONFIG[props.platform].getSections(locale),
    [props.platform, locale]
  )
  const plainText = useMemo(
    () => formatFfmpegHwManualSmokeChecklistPlainText(sections),
    [sections]
  )

  const onCopy = (): void => {
    void navigator.clipboard
      .writeText(plainText)
      .then(() => {
        setCopyHint(uiText(config.copiedKey))
        window.setTimeout(() => setCopyHint(null), 2400)
      })
      .catch(() => {
        setCopyHint(uiText(config.copyFailedKey))
      })
  }

  const section = sections[0]
  if (!section) {
    return <></>
  }

  return (
    <section
      id={APP_SETTINGS_PACKAGED_SMOKE_ANCHOR[props.platform]}
      className="app-settings-fieldset app-settings-hw-smoke-panel"
      aria-describedby={props.sectionHintId}
    >
      <div className="app-settings-hw-smoke-header">
        <h3 className="app-settings-hidpi-title">{uiText(config.legendKey)}</h3>
        <div className="app-settings-panel-head-trailing" role="toolbar" aria-orientation="horizontal">
          {props.onOpenKnowledgeArticle ? (
            <>
              <KnowledgeDeepLinkButton
                label={uiText('knowledgeDeepLinkOwnerSmokeLabel')}
                tooltip={uiText('knowledgeDeepLinkOwnerSmokeTooltip')}
                ariaDescribedBy={props.sectionHintId}
                onOpen={() => {
                  props.onOpenKnowledgeArticle?.(KNOWLEDGE_SLUG_OWNER_MANUAL_SMOKE)
                }}
              />
              <KnowledgeDeepLinkButton
                label={uiText(config.deepLinkLabelKey)}
                tooltip={uiText(config.deepLinkTooltipKey)}
                ariaDescribedBy={props.sectionHintId}
                onOpen={() => {
                  props.onOpenKnowledgeArticle?.(config.knowledgeSlug)
                }}
              />
            </>
          ) : null}
          <button type="button" className="app-btn app-btn-compact" onClick={onCopy}>
            {uiText(config.copyKey)}
          </button>
        </div>
      </div>
      <p className="app-modal-hint">{uiText(config.introKey)}</p>
      <p className="app-modal-hint">{uiText('appSettingsPackagedSmokeOwnerBundleHint')}</p>
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

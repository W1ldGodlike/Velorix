import { useEffect, useMemo, useState, type JSX } from 'react'

import {
  formatFfmpegHwManualSmokeChecklistPlainText,
  orderHwManualSmokeSectionsForDisplay,
  resolvePrimaryHwManualSmokeSectionId
} from '../../../../shared/ffmpeg-hw-manual-smoke-checklist-build'
import { KNOWLEDGE_SLUG_OWNER_MANUAL_SMOKE } from '../../../../shared/knowledge-contract'
import { formatOwnerManualSmokeBundlePlainText } from '../../../../shared/owner-manual-smoke-bundle'
import { formatOwnerManualSmokeHidpiChecklistLines } from '../../../../shared/owner-manual-smoke-hidpi-lines'
import { getFfmpegHwManualSmokeChecklistForUiLocale } from '../../hw-manual-smoke-checklist-locale'
import { getUiLocale, uiText } from '../../locales/ui-text'
import { readUiHidpiRuntimeStatus } from '../../ui-hidpi-runtime-status'
import {
  getWorkflowOsSchedulerManualSmokeChecklistForUiLocale,
  type WorkflowOsSchedulerSmokeCapabilities
} from '../../workflow-os-scheduler-manual-smoke-checklist-locale'
import { KnowledgeDeepLinkButton } from '../KnowledgeDeepLinkButton'

function formatHidpiLinesForUiLocale(): string[] {
  if (getUiLocale() === 'ru') {
    return formatOwnerManualSmokeHidpiChecklistLines()
  }
  return [
    'owner: HiDPI / window scale 100–200% (not CI)',
    uiText('appSettingsHidpiManualHint'),
    uiText('appSettingsHidpiChecklistIntro'),
    `- ${uiText('appSettingsHidpiCheckEditor')}`,
    `- ${uiText('appSettingsHidpiCheckDownloads')}`,
    `- ${uiText('appSettingsHidpiCheckModals')}`,
    `- ${uiText('appSettingsHidpiCheckStatusbar')}`
  ]
}

function formatUiDpiSnapshotLines(): string[] {
  const status = readUiHidpiRuntimeStatus()
  const lines = [
    `devicePixelRatio: ${status.devicePixelRatio.toFixed(2)}`,
    `approxWindowsScalePercent: ${status.approximateWindowsScalePercent}`
  ]
  if (status.activeWindowsScalePercent !== null && status.activeCssTierDpi !== null) {
    lines.push(
      `activeTier: ${status.activeWindowsScalePercent}% / ${status.activeCssTierDpi}dpi CSS @media`
    )
  } else {
    lines.push('activeTier: base (no HiDPI @media match)')
  }
  return lines
}

export function AppSettingsOwnerSmokeBundlePanel(props: {
  sectionHintId: string
  onOpenKnowledgeArticle?: (slug: string) => void
}): JSX.Element {
  const [copyHint, setCopyHint] = useState<string | null>(null)
  const [osCaps, setOsCaps] = useState<WorkflowOsSchedulerSmokeCapabilities | null>(null)
  const locale = getUiLocale()

  useEffect(() => {
    let cancelled = false
    void window.fluxalloy.workflows.capabilities().then((res) => {
      if (cancelled || !res.ok) {
        return
      }
      setOsCaps({
        windowsTaskScheduler: res.windowsTaskScheduler,
        macosLaunchd: res.macosLaunchd,
        linuxSystemdUserTimer: res.linuxSystemdUserTimer
      })
    })
    return (): void => {
      cancelled = true
    }
  }, [])

  const hwPlainText = useMemo(() => {
    const sections = getFfmpegHwManualSmokeChecklistForUiLocale(locale)
    const primaryId = resolvePrimaryHwManualSmokeSectionId()
    const ordered = orderHwManualSmokeSectionsForDisplay(sections, primaryId)
    return formatFfmpegHwManualSmokeChecklistPlainText(ordered)
  }, [locale])

  const osPlainText = useMemo(() => {
    const hasAny =
      osCaps?.windowsTaskScheduler || osCaps?.macosLaunchd || osCaps?.linuxSystemdUserTimer
    if (!hasAny) {
      return null
    }
    const sections = getWorkflowOsSchedulerManualSmokeChecklistForUiLocale(locale, osCaps ?? undefined)
    if (sections.length === 0) {
      return null
    }
    return formatFfmpegHwManualSmokeChecklistPlainText(sections)
  }, [locale, osCaps])

  const plainText = useMemo(
    () =>
      formatOwnerManualSmokeBundlePlainText({
        hidpiLines: formatHidpiLinesForUiLocale(),
        hwPlainText,
        osPlainText,
        uiDpiSnapshot: formatUiDpiSnapshotLines()
      }),
    [hwPlainText, osPlainText]
  )

  const onCopy = (): void => {
    void navigator.clipboard
      .writeText(plainText)
      .then(() => {
        setCopyHint(uiText('appSettingsOwnerSmokeCopied'))
        window.setTimeout(() => setCopyHint(null), 2400)
      })
      .catch(() => {
        setCopyHint(uiText('appSettingsOwnerSmokeCopyFailed'))
      })
  }

  return (
    <section
      className="app-settings-fieldset app-settings-owner-smoke-panel"
      aria-describedby={props.sectionHintId}
    >
      <div className="app-settings-hw-smoke-header">
        <h3 className="app-settings-hidpi-title">{uiText('appSettingsOwnerSmokeLegend')}</h3>
        <div
          className="app-settings-panel-head-trailing"
          role="toolbar"
          aria-orientation="horizontal"
        >
          {props.onOpenKnowledgeArticle ? (
            <KnowledgeDeepLinkButton
              label={uiText('knowledgeDeepLinkOwnerSmokeLabel')}
              tooltip={uiText('knowledgeDeepLinkOwnerSmokeTooltip')}
              ariaDescribedBy={props.sectionHintId}
              onOpen={() => {
                props.onOpenKnowledgeArticle?.(KNOWLEDGE_SLUG_OWNER_MANUAL_SMOKE)
              }}
            />
          ) : null}
          <button type="button" className="app-btn app-btn-compact" onClick={onCopy}>
            {uiText('appSettingsOwnerSmokeCopy')}
          </button>
        </div>
      </div>
      <p className="app-modal-hint">{uiText('appSettingsOwnerSmokeIntro')}</p>
      {copyHint ? <p className="app-modal-hint">{copyHint}</p> : null}
    </section>
  )
}

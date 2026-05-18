import { useEffect, useMemo, useState, type JSX } from 'react'

import {
  formatFfmpegHwManualSmokeChecklistPlainText,
  orderHwManualSmokeSectionsForDisplay,
  resolvePrimaryHwManualSmokeSectionId
} from '../../../../shared/ffmpeg-hw-manual-smoke-checklist-build'
import { KNOWLEDGE_SLUG_OWNER_MANUAL_SMOKE } from '../../../../shared/knowledge-contract'
import { formatOwnerManualSmokeBundlePlainText } from '../../../../shared/owner-manual-smoke-bundle'
import {
  formatOwnerManualSmokeBundleReportHeaderLines,
  prependOwnerManualSmokeReportHeader
} from '../../../../shared/owner-manual-smoke-bundle-report-header'
import { getOwnerManualSmokePackagedSection } from '../../../../shared/owner-manual-smoke-packaged-section'
import { formatOwnerManualSmokeHidpiChecklistLines } from '../../../../shared/owner-manual-smoke-hidpi-lines'
import { APP_SETTINGS_HIDPI_CHECKLIST_KEYS } from '../../../../shared/app-settings-hidpi-checklist-keys'
import { APP_SETTINGS_THEME_CHECKLIST_KEYS } from '../../../../shared/app-settings-theme-checklist-keys'
import { formatOwnerManualSmokeThemeChecklistLines } from '../../../../shared/owner-manual-smoke-theme-lines'
import { getFfmpegHwManualSmokeChecklistForUiLocale } from '../../hw-manual-smoke-checklist-locale'
import { getUiLocale, uiText } from '../../locales/ui-text'
import { readUiHidpiRuntimeStatus } from '../../ui-hidpi-runtime-status'
import {
  getWorkflowOsSchedulerManualSmokeChecklistForUiLocale,
  type WorkflowOsSchedulerSmokeCapabilities
} from '../../workflow-os-scheduler-manual-smoke-checklist-locale'
import { getEditorVideoSpriteManualSmokeChecklistForUiLocale } from '../../editor-video-sprite-manual-smoke-checklist-locale'
import { getMiniPlayerManualSmokeChecklistForUiLocale } from '../../mini-player-manual-smoke-checklist-locale'
import { getWorkflowScenarioManualSmokeChecklistForUiLocale } from '../../workflow-scenario-manual-smoke-checklist-locale'
import { getWindowsShellManualSmokeChecklistForUiLocale } from '../../windows-shell-manual-smoke-checklist-locale'
import { KnowledgeDeepLinkButton } from '../KnowledgeDeepLinkButton'
import type { AppSettingsDialogSection } from '../../../../shared/app-settings-dialog-section'
import {
  APP_SETTINGS_THEME_ANCHOR,
  APP_SETTINGS_HIDPI_ANCHOR,
  APP_SETTINGS_HW_SMOKE_ANCHOR,
  APP_SETTINGS_OWNER_SMOKE_BUNDLE_ANCHOR,
  APP_SETTINGS_PACKAGED_SMOKE_ANCHOR,
  APP_SETTINGS_WIN_SHELL_ANCHOR,
  jumpToAppSettingsSmokeTarget,
  type AppSettingsSmokeJumpTarget
} from './app-settings-smoke-anchors'
import { OwnerManualSmokeChecklistSectionsPreview } from './OwnerManualSmokeChecklistSectionsPreview'

function formatThemeLinesForUiLocale(): string[] {
  if (getUiLocale() === 'ru') {
    return formatOwnerManualSmokeThemeChecklistLines()
  }
  return [
    'owner: Theme / dark·light·system (not CI)',
    uiText('appSettingsThemeManualHint'),
    uiText('appSettingsThemeChecklistIntro'),
    ...APP_SETTINGS_THEME_CHECKLIST_KEYS.map((key) => `- ${uiText(key)}`)
  ]
}

function formatHidpiLinesForUiLocale(): string[] {
  if (getUiLocale() === 'ru') {
    return formatOwnerManualSmokeHidpiChecklistLines()
  }
  return [
    'owner: HiDPI / window scale 100–200% (not CI)',
    uiText('appSettingsHidpiManualHint'),
    uiText('appSettingsHidpiChecklistIntro'),
    ...APP_SETTINGS_HIDPI_CHECKLIST_KEYS.map((key) => `- ${uiText(key)}`)
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

function OwnerSmokeJumpButton(props: { label: string; onClick: () => void }): JSX.Element {
  return (
    <button
      type="button"
      className="app-btn app-btn-compact app-settings-owner-smoke-jump"
      onClick={props.onClick}
    >
      {props.label}
    </button>
  )
}

export function AppSettingsOwnerSmokeBundlePanel(props: {
  sectionHintId: string
  settingsSection: AppSettingsDialogSection
  onSettingsSectionChange: (section: AppSettingsDialogSection) => void
  onOpenWorkflowPlanner?: () => void
  onOpenWorkflowScenarioBuilder?: () => void
  onOpenKnowledgeArticle?: (slug: string) => void
}): JSX.Element {
  const jump = (target: AppSettingsSmokeJumpTarget): void => {
    jumpToAppSettingsSmokeTarget(target, props.settingsSection, props.onSettingsSectionChange)
  }
  const [copyHint, setCopyHint] = useState<string | null>(null)
  const [reportHeaderLines, setReportHeaderLines] = useState<readonly string[]>([])
  const [osCaps, setOsCaps] = useState<WorkflowOsSchedulerSmokeCapabilities | null>(null)
  const [shellSupported, setShellSupported] = useState(false)
  const locale = getUiLocale()

  useEffect(() => {
    let cancelled = false
    void window.fluxalloy.about.getInfo().then((info) => {
      if (cancelled) {
        return
      }
      setReportHeaderLines(
        formatOwnerManualSmokeBundleReportHeaderLines({
          appName: info.appName,
          appVersion: info.appVersion,
          buildId: info.buildId,
          builtAtUtc: info.builtAtUtc,
          electronVersion: info.electronVersion
        })
      )
    })
    return (): void => {
      cancelled = true
    }
  }, [])

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
    void window.fluxalloy.settings.windowsExplorerContextMenuStatus().then((st) => {
      if (!cancelled) {
        setShellSupported(st.supported)
      }
    })
    return (): void => {
      cancelled = true
    }
  }, [])

  const hwSections = useMemo(() => {
    const sections = getFfmpegHwManualSmokeChecklistForUiLocale(locale)
    const primaryId = resolvePrimaryHwManualSmokeSectionId()
    return orderHwManualSmokeSectionsForDisplay(sections, primaryId)
  }, [locale])

  const hwPlainText = useMemo(
    () => formatFfmpegHwManualSmokeChecklistPlainText(hwSections),
    [hwSections]
  )

  const osSections = useMemo(() => {
    const hasAny =
      osCaps?.windowsTaskScheduler || osCaps?.macosLaunchd || osCaps?.linuxSystemdUserTimer
    if (!hasAny) {
      return []
    }
    return getWorkflowOsSchedulerManualSmokeChecklistForUiLocale(locale, osCaps ?? undefined)
  }, [locale, osCaps])

  const osPlainText = useMemo(() => {
    if (osSections.length === 0) {
      return null
    }
    return formatFfmpegHwManualSmokeChecklistPlainText(osSections)
  }, [osSections])

  const scenarioSections = useMemo(
    () => getWorkflowScenarioManualSmokeChecklistForUiLocale(locale),
    [locale]
  )

  const scenarioPlainText = useMemo(
    () => formatFfmpegHwManualSmokeChecklistPlainText(scenarioSections),
    [scenarioSections]
  )

  const videoSpriteSections = useMemo(
    () => getEditorVideoSpriteManualSmokeChecklistForUiLocale(locale),
    [locale]
  )

  const videoSpritePlainText = useMemo(
    () => formatFfmpegHwManualSmokeChecklistPlainText(videoSpriteSections),
    [videoSpriteSections]
  )

  const miniPlayerSections = useMemo(
    () => getMiniPlayerManualSmokeChecklistForUiLocale(locale),
    [locale]
  )

  const miniPlayerPlainText = useMemo(
    () => formatFfmpegHwManualSmokeChecklistPlainText(miniPlayerSections),
    [miniPlayerSections]
  )

  const shellSections = useMemo(() => {
    if (!shellSupported) {
      return []
    }
    return getWindowsShellManualSmokeChecklistForUiLocale(locale)
  }, [locale, shellSupported])

  const shellPlainText = useMemo(() => {
    if (shellSections.length === 0) {
      return null
    }
    return formatFfmpegHwManualSmokeChecklistPlainText(shellSections)
  }, [shellSections])

  const packagedSection = useMemo(() => getOwnerManualSmokePackagedSection(), [])

  const packagedPlainText = useMemo(() => {
    if (!packagedSection) {
      return null
    }
    return [packagedSection.heading, ...packagedSection.lines].join('\n')
  }, [packagedSection])

  const themeCheckLines = useMemo(
    () => APP_SETTINGS_THEME_CHECKLIST_KEYS.map((key) => uiText(key)),
    []
  )

  const hidpiCheckLines = useMemo(
    () => APP_SETTINGS_HIDPI_CHECKLIST_KEYS.map((key) => uiText(key)),
    []
  )

  const checklistPlainText = useMemo(
    () =>
      formatOwnerManualSmokeBundlePlainText({
        themeLines: formatThemeLinesForUiLocale(),
        hidpiLines: formatHidpiLinesForUiLocale(),
        hwPlainText,
        scenarioPlainText,
        videoSpritePlainText,
        miniPlayerPlainText,
        osPlainText,
        shellPlainText,
        packagedPlainText,
        uiDpiSnapshot: formatUiDpiSnapshotLines()
      }),
    [
      hwPlainText,
      osPlainText,
      scenarioPlainText,
      videoSpritePlainText,
      miniPlayerPlainText,
      shellPlainText,
      packagedPlainText
    ]
  )

  const plainTextForCopy = useMemo(
    () => prependOwnerManualSmokeReportHeader(checklistPlainText, reportHeaderLines),
    [checklistPlainText, reportHeaderLines]
  )

  const onCopy = (): void => {
    void navigator.clipboard
      .writeText(plainTextForCopy)
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
      id={APP_SETTINGS_OWNER_SMOKE_BUNDLE_ANCHOR}
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
      <p className="app-modal-hint">{uiText('appSettingsOwnerSmokePreviewHint')}</p>
      {copyHint ? (
        <p className="app-modal-hint" role="status" aria-live="polite">
          {copyHint}
        </p>
      ) : null}
      <details className="app-settings-owner-smoke-preview-block" open>
        <summary className="app-settings-owner-smoke-preview-summary">
          {uiText('appSettingsOwnerSmokePreviewSectionTheme')}
        </summary>
        <p className="app-modal-hint">{uiText('appSettingsThemeManualHint')}</p>
        <p className="app-settings-hw-smoke-label">{uiText('appSettingsThemeChecklistIntro')}</p>
        <ul className="app-settings-hidpi-checklist">
          {themeCheckLines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <OwnerSmokeJumpButton
          label={uiText('appSettingsOwnerSmokeJumpTheme')}
          onClick={() => {
            jump({ section: 'general', anchorId: APP_SETTINGS_THEME_ANCHOR })
          }}
        />
      </details>
      <details className="app-settings-owner-smoke-preview-block" open>
        <summary className="app-settings-owner-smoke-preview-summary">
          {uiText('appSettingsOwnerSmokePreviewSectionHidpi')}
        </summary>
        <p className="app-modal-hint">{uiText('appSettingsHidpiManualHint')}</p>
        <p className="app-settings-hw-smoke-label">{uiText('appSettingsHidpiChecklistIntro')}</p>
        <ul className="app-settings-hidpi-checklist">
          {hidpiCheckLines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p className="app-settings-hw-smoke-label">
          {uiText('appSettingsOwnerSmokePreviewUiDpiLabel')}
        </p>
        <ul className="app-settings-hidpi-checklist app-settings-owner-smoke-mono-lines">
          {formatUiDpiSnapshotLines().map((line) => (
            <li key={line}>
              <code>{line}</code>
            </li>
          ))}
        </ul>
      </details>
      <OwnerManualSmokeChecklistSectionsPreview
        sections={hwSections}
        summaryLabel={uiText('appSettingsOwnerSmokePreviewSectionHw')}
      />
      <OwnerSmokeJumpButton
        label={uiText('appSettingsOwnerSmokeJumpHw')}
        onClick={() => {
          jump({ section: 'dependencies', anchorId: APP_SETTINGS_HW_SMOKE_ANCHOR })
        }}
      />
      <OwnerManualSmokeChecklistSectionsPreview
        sections={scenarioSections}
        summaryLabel={uiText('appSettingsOwnerSmokePreviewSectionScenario')}
      />
      {scenarioSections.length > 0 && props.onOpenWorkflowScenarioBuilder ? (
        <OwnerSmokeJumpButton
          label={uiText('appSettingsOwnerSmokeJumpScenarioBuilder')}
          onClick={() => {
            props.onOpenWorkflowScenarioBuilder?.()
          }}
        />
      ) : null}
      <OwnerManualSmokeChecklistSectionsPreview
        sections={videoSpriteSections}
        summaryLabel={uiText('appSettingsOwnerSmokePreviewSectionVideoSprite')}
      />
      <OwnerManualSmokeChecklistSectionsPreview
        sections={miniPlayerSections}
        summaryLabel={uiText('appSettingsOwnerSmokePreviewSectionMiniPlayer')}
      />
      {packagedSection ? (
        <details className="app-settings-owner-smoke-preview-block">
          <summary className="app-settings-owner-smoke-preview-summary">
            {uiText('appSettingsOwnerSmokePreviewSectionPackaged')}
          </summary>
          <p className="app-settings-hw-smoke-section-title">{packagedSection.heading}</p>
          <ul className="app-settings-hidpi-checklist app-settings-owner-smoke-mono-lines">
            {packagedSection.lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <OwnerSmokeJumpButton
            label={uiText('appSettingsOwnerSmokeJumpPackaged')}
            onClick={() => {
              jump({
                section: 'dependencies',
                anchorId: APP_SETTINGS_PACKAGED_SMOKE_ANCHOR[packagedSection.platform]
              })
            }}
          />
        </details>
      ) : null}
      <OwnerSmokeJumpButton
        label={uiText('appSettingsOwnerSmokeJumpHidpi')}
        onClick={() => {
          jump({ section: 'general', anchorId: APP_SETTINGS_HIDPI_ANCHOR })
        }}
      />
      <OwnerManualSmokeChecklistSectionsPreview
        sections={osSections}
        summaryLabel={uiText('appSettingsOwnerSmokePreviewSectionOs')}
      />
      {osSections.length > 0 && props.onOpenWorkflowPlanner ? (
        <OwnerSmokeJumpButton
          label={uiText('appSettingsOwnerSmokeJumpPlanner')}
          onClick={() => {
            props.onOpenWorkflowPlanner?.()
          }}
        />
      ) : null}
      <OwnerManualSmokeChecklistSectionsPreview
        sections={shellSections}
        summaryLabel={uiText('appSettingsOwnerSmokePreviewSectionShell')}
      />
      {shellSupported ? (
        <OwnerSmokeJumpButton
          label={uiText('appSettingsOwnerSmokeJumpShell')}
          onClick={() => {
            jump({ section: 'general', anchorId: APP_SETTINGS_WIN_SHELL_ANCHOR })
          }}
        />
      ) : null}
    </section>
  )
}

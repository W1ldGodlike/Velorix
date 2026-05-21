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
import { getOwnerManualSmokePackagedSectionForUiLocale } from '../../../../shared/owner-manual-smoke-packaged-section'
import { getFfmpegHwManualSmokeChecklistForUiLocale } from '../../hw-manual-smoke-checklist-locale'
import {
  getOwnerManualSmokeHidpiChecklistLinesForUiLocale,
  getOwnerManualSmokeThemeChecklistLinesForUiLocale
} from '../../owner-manual-smoke-visual-checklist-locale'
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
import { APP_SETTINGS_OWNER_SMOKE_BUNDLE_ANCHOR } from './app-settings-smoke-anchors'
import { OwnerManualSmokeChecklistSectionsPreview } from './OwnerManualSmokeChecklistSectionsPreview'

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
  onOpenWorkflowPlanner?: () => void
  onOpenWorkflowScenarioBuilder?: () => void
  onOpenKnowledgeArticle?: (slug: string) => void
}): JSX.Element {
  const [copyHint, setCopyHint] = useState<string | null>(null)
  const [reportHeaderLines, setReportHeaderLines] = useState<readonly string[]>([])
  const [osPlatform, setOsPlatform] = useState<NodeJS.Platform | null>(null)
  const [osCaps, setOsCaps] = useState<WorkflowOsSchedulerSmokeCapabilities | null>(null)
  const [shellSupported, setShellSupported] = useState(false)
  const locale = getUiLocale()

  useEffect(() => {
    let cancelled = false
    void window.fluxalloy.about.getInfo().then((info) => {
      if (cancelled) {
        return
      }
      setOsPlatform(info.osPlatform)
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

  const packagedSection = useMemo(() => {
    if (!osPlatform) {
      return null
    }
    return getOwnerManualSmokePackagedSectionForUiLocale(locale, osPlatform)
  }, [locale, osPlatform])

  const packagedPlainText = useMemo(() => {
    if (!packagedSection) {
      return null
    }
    return [packagedSection.heading, ...packagedSection.lines].join('\n')
  }, [packagedSection])

  const themeBundleLines = useMemo(
    () => getOwnerManualSmokeThemeChecklistLinesForUiLocale(locale),
    [locale]
  )

  const hidpiBundleLines = useMemo(
    () => getOwnerManualSmokeHidpiChecklistLinesForUiLocale(locale),
    [locale]
  )

  const checklistPlainText = useMemo(
    () =>
      formatOwnerManualSmokeBundlePlainText({
        themeLines: themeBundleLines,
        hidpiLines: hidpiBundleLines,
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
      themeBundleLines,
      hidpiBundleLines,
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
    <div className="app-settings-qa-inner" aria-describedby={props.sectionHintId}>
      <div className="app-settings-hw-smoke-header">
        <p className="app-modal-hint app-settings-qa-lead">
          {uiText('appSettingsOwnerSmokeIntro')}
        </p>
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
          <button
            type="button"
            className="app-btn app-btn-compact app-btn-primary"
            onClick={onCopy}
          >
            {uiText('appSettingsOwnerSmokeCopy')}
          </button>
        </div>
      </div>
      {copyHint ? (
        <p className="app-modal-hint" role="status" aria-live="polite">
          {copyHint}
        </p>
      ) : null}
      {(props.onOpenWorkflowPlanner || props.onOpenWorkflowScenarioBuilder) && (
        <div className="app-settings-qa-actions">
          {props.onOpenWorkflowScenarioBuilder ? (
            <button
              type="button"
              className="app-btn app-btn-compact"
              onClick={() => {
                props.onOpenWorkflowScenarioBuilder?.()
              }}
            >
              {uiText('appSettingsOwnerSmokeJumpScenarioBuilder')}
            </button>
          ) : null}
          {props.onOpenWorkflowPlanner ? (
            <button
              type="button"
              className="app-btn app-btn-compact"
              onClick={() => {
                props.onOpenWorkflowPlanner?.()
              }}
            >
              {uiText('appSettingsOwnerSmokeJumpPlanner')}
            </button>
          ) : null}
        </div>
      )}
      <div id={APP_SETTINGS_OWNER_SMOKE_BUNDLE_ANCHOR} className="app-settings-qa-previews">
        <OwnerManualSmokeChecklistSectionsPreview
          sections={hwSections}
          summaryLabel={uiText('appSettingsOwnerSmokePreviewSectionHw')}
        />
        <OwnerManualSmokeChecklistSectionsPreview
          sections={scenarioSections}
          summaryLabel={uiText('appSettingsOwnerSmokePreviewSectionScenario')}
        />
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
          </details>
        ) : null}
        <OwnerManualSmokeChecklistSectionsPreview
          sections={osSections}
          summaryLabel={uiText('appSettingsOwnerSmokePreviewSectionOs')}
        />
        <OwnerManualSmokeChecklistSectionsPreview
          sections={shellSections}
          summaryLabel={uiText('appSettingsOwnerSmokePreviewSectionShell')}
        />
      </div>
    </div>
  )
}

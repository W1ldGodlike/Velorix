import { useState, type JSX } from 'react'

import type { AppAboutInfo } from '../../../shared/about-contract'
import { KNOWLEDGE_SLUG_ABOUT_SUPPORT_LOGS } from '../../../shared/knowledge-contract'
import type {
  DiagnosticsMaintenanceSnapshot,
  DiagnosticsMaintenanceTargetId
} from '../../../shared/diagnostics-contract'
import {
  FFPROBE_DOC_ALL,
  YTDLP_DOC_FORMAT_SELECTION,
  YTDLP_DOC_README
} from '../../../shared/external-doc-urls'
import {
  formatMaintenanceCleanDone,
  formatMaintenanceConfirmHint,
  formatMaintenanceSummary,
  formatUiBytes,
  uiText,
  uiTextVars
} from '../locales/ui-text'

type MaintenanceCleanChoice = 'all' | DiagnosticsMaintenanceTargetId

function formatMaintenanceSnapshot(snapshot: DiagnosticsMaintenanceSnapshot): string {
  const details = snapshot.targets
    .map((target) => {
      const label =
        target.id === 'previewCache'
          ? uiText('maintenanceSnapshotLabelPreviewCache')
          : target.id === 'ffmpegTemp'
            ? uiText('maintenanceSnapshotLabelFfmpegTemp')
            : uiText('maintenanceSnapshotLabelYtdlpPartials')
      return `${label} ${formatUiBytes(target.bytes)}`
    })
    .join(', ')
  return formatMaintenanceSummary(formatUiBytes(snapshot.cleanableBytes), details)
}

/** Модальное окно §4.5 — переиспользуется главным окном и инспектором §9 (единые стили/`app-modal-*`). */
export function AboutDialog({
  open,
  aboutInfo,
  onClose,
  onDiagnosticStatus,
  onOpenKnowledgeArticle
}: {
  open: boolean
  aboutInfo: AppAboutInfo | null
  onClose: () => void
  onDiagnosticStatus?: (message: string) => void
  /** Если задано — кнопка открывает статью базы знаний (главное окно). */
  onOpenKnowledgeArticle?: (slug: string) => void
}): JSX.Element | null {
  const [maintenanceConfirm, setMaintenanceConfirm] = useState<MaintenanceCleanChoice | null>(null)

  if (!open) {
    return null
  }

  function pushStatus(text: string): void {
    onDiagnosticStatus?.(text)
  }

  function maintenanceLabel(choice: MaintenanceCleanChoice): string {
    switch (choice) {
      case 'previewCache':
        return uiText('maintenanceCleanPreviewButton')
      case 'ytdlpPartials':
        return uiText('maintenanceCleanPartialsButton')
      case 'ffmpegTemp':
        return uiText('maintenanceCleanFfmpegTempButton')
      case 'all':
        return uiText('maintenanceCleanButton')
    }
  }

  function handleCleanMaintenance(choice: MaintenanceCleanChoice): void {
    if (maintenanceConfirm !== choice) {
      setMaintenanceConfirm(choice)
      pushStatus(formatMaintenanceConfirmHint(maintenanceLabel(choice)))
      return
    }
    const request = choice === 'all' ? undefined : { targets: [choice] }
    void window.fluxalloy.diagnostics.cleanMaintenance(request).then((r) => {
      setMaintenanceConfirm(null)
      if (r.ok) {
        pushStatus(formatMaintenanceCleanDone(r.removedFiles, formatUiBytes(r.removedBytes)))
      } else {
        pushStatus(
          uiTextVars('aboutMaintenanceCleanErrorTemplate', {
            label: maintenanceLabel(choice),
            error: r.error
          })
        )
      }
    })
  }

  return (
    <div
      className="app-modal-backdrop"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        className="app-modal app-modal-narrow"
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-title"
        aria-describedby="about-dialog-desc"
        onMouseDown={(e) => {
          e.stopPropagation()
        }}
      >
        <h2 id="about-title" className="app-modal-title">
          {uiText('aboutTitle')}
        </h2>
        <p id="about-dialog-desc" className="app-visually-hidden">
          {uiText('aboutDialogDescAria')}
        </p>
        {aboutInfo ? (
          <dl className="app-about-dl" aria-label={uiText('aboutRuntimeDetailsAria')}>
            <div className="app-about-row">
              <dt>{uiText('appLabel')}</dt>
              <dd>{aboutInfo.appName}</dd>
            </div>
            <div className="app-about-row">
              <dt>{uiText('versionLabel')}</dt>
              <dd className="app-about-mono">{aboutInfo.appVersion}</dd>
            </div>
            <div className="app-about-row">
              <dt>{uiText('aboutRuntimeElectronLabel')}</dt>
              <dd className="app-about-mono">{aboutInfo.electronVersion}</dd>
            </div>
            <div className="app-about-row">
              <dt>{uiText('aboutRuntimeChromiumLabel')}</dt>
              <dd className="app-about-mono">{aboutInfo.chromeVersion}</dd>
            </div>
            <div className="app-about-row">
              <dt>{uiText('aboutRuntimeNodeLabel')}</dt>
              <dd className="app-about-mono">{aboutInfo.nodeVersion}</dd>
            </div>
          </dl>
        ) : (
          <p className="app-modal-hint" role="status" aria-live="polite">
            {uiText('loading')}
          </p>
        )}
        <div
          className="app-modal-footer app-modal-footer-split"
          role="region"
          aria-label={uiText('aboutModalFooterSplitAria')}
        >
          <div
            className="app-about-footer-left"
            role="group"
            aria-label={uiText('aboutFooterLeftGroupAria')}
          >
            <div
              className="app-about-diagnostics"
              role="toolbar"
              aria-orientation="horizontal"
              aria-label={uiText('aboutDiagnosticsToolbarAria')}
            >
              <button
                type="button"
                className="app-btn app-btn-compact"
                title={uiText('aboutTooltipLogsFolder')}
                onClick={() => {
                  void window.fluxalloy.diagnostics.openFolder('logs').then((r) => {
                    if (!r.ok) {
                      pushStatus(
                        uiTextVars('aboutMaintenanceCleanErrorTemplate', {
                          label: uiText('logsFolderButton'),
                          error: r.error
                        })
                      )
                    }
                  })
                }}
              >
                {uiText('logsFolderButton')}
              </button>
              <button
                type="button"
                className="app-btn app-btn-compact"
                title={uiText('aboutTooltipMainLog')}
                onClick={() => {
                  void window.fluxalloy.diagnostics.openMainLog().then((r) => {
                    if (!r.ok) {
                      pushStatus(uiTextVars('aboutMainLogOpenErrorTemplate', { error: r.error }))
                    }
                  })
                }}
              >
                {uiText('aboutMainLogButton')}
              </button>
              <button
                type="button"
                className="app-btn app-btn-compact"
                title={uiText('aboutTooltipSupportZip')}
                onClick={() => {
                  void window.fluxalloy.diagnostics.createSupportZip().then((r) => {
                    if (r.ok) {
                      pushStatus(uiText('supportZipSaved'))
                    } else if ('error' in r) {
                      pushStatus(
                        uiTextVars('aboutMaintenanceCleanErrorTemplate', {
                          label: uiText('supportZipButton'),
                          error: r.error
                        })
                      )
                    }
                  })
                }}
              >
                {uiText('supportZipButton')}
              </button>
              <button
                type="button"
                className="app-btn app-btn-compact"
                title={uiText('aboutTooltipMaintenanceSummary')}
                onClick={() => {
                  setMaintenanceConfirm(null)
                  void window.fluxalloy.diagnostics.maintenanceSnapshot().then((snapshot) => {
                    pushStatus(formatMaintenanceSnapshot(snapshot))
                  })
                }}
              >
                {uiText('maintenanceSummaryButton')}
              </button>
              <button
                type="button"
                className={`app-btn app-btn-compact${maintenanceConfirm === 'all' ? ' app-btn-danger' : ''}`}
                title={uiText('aboutTooltipMaintenanceCleanAll')}
                onClick={() => {
                  handleCleanMaintenance('all')
                }}
              >
                {uiText(
                  maintenanceConfirm === 'all'
                    ? 'maintenanceConfirmButton'
                    : 'maintenanceCleanButton'
                )}
              </button>
              <button
                type="button"
                className={`app-btn app-btn-compact${maintenanceConfirm === 'previewCache' ? ' app-btn-danger' : ''}`}
                title={uiText('aboutTooltipMaintenanceCleanPreview')}
                onClick={() => {
                  handleCleanMaintenance('previewCache')
                }}
              >
                {uiText(
                  maintenanceConfirm === 'previewCache'
                    ? 'maintenanceConfirmButton'
                    : 'maintenanceCleanPreviewButton'
                )}
              </button>
              <button
                type="button"
                className={`app-btn app-btn-compact${maintenanceConfirm === 'ytdlpPartials' ? ' app-btn-danger' : ''}`}
                title={uiText('aboutTooltipMaintenanceCleanPartials')}
                onClick={() => {
                  handleCleanMaintenance('ytdlpPartials')
                }}
              >
                {uiText(
                  maintenanceConfirm === 'ytdlpPartials'
                    ? 'maintenanceConfirmButton'
                    : 'maintenanceCleanPartialsButton'
                )}
              </button>
              <button
                type="button"
                className={`app-btn app-btn-compact${maintenanceConfirm === 'ffmpegTemp' ? ' app-btn-danger' : ''}`}
                title={uiText('aboutTooltipMaintenanceCleanFfmpegTemp')}
                onClick={() => {
                  handleCleanMaintenance('ffmpegTemp')
                }}
              >
                {uiText(
                  maintenanceConfirm === 'ffmpegTemp'
                    ? 'maintenanceConfirmButton'
                    : 'maintenanceCleanFfmpegTempButton'
                )}
              </button>
            </div>
            <nav className="app-doc-inline-links app-about-doc-links" aria-label={uiText('aboutExternalDocsNavAria')}>
              <a href={YTDLP_DOC_README} target="_blank" rel="noreferrer">
                {uiText('docLinkYtDlpReadme')}
              </a>
              {' · '}
              <a href={YTDLP_DOC_FORMAT_SELECTION} target="_blank" rel="noreferrer">
                {uiText('formatSelectionDoc')}
              </a>
              {' · '}
              <a href={FFPROBE_DOC_ALL} target="_blank" rel="noreferrer">
                {uiText('docLinkFfprobeShort')}
              </a>
            </nav>
            {onOpenKnowledgeArticle ? (
              <div
                className="app-about-knowledge-link"
                role="region"
                aria-label={uiText('aboutKnowledgeArticleRegionAria')}
              >
                <button
                  type="button"
                  className="app-btn app-btn-compact"
                  title={uiText('aboutKnowledgeSupportArticleTooltip')}
                  onClick={() => {
                    onOpenKnowledgeArticle(KNOWLEDGE_SLUG_ABOUT_SUPPORT_LOGS)
                  }}
                >
                  {uiText('aboutKnowledgeSupportArticle')}
                </button>
              </div>
            ) : null}
          </div>
          <div role="toolbar" aria-orientation="horizontal" aria-label={uiText('aboutDialogCloseToolbarAria')}>
            <button
              type="button"
              className="app-btn app-btn-primary"
              title={uiText('aboutTooltipCloseAbout')}
              onClick={onClose}
            >
              {uiText('closeButton')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

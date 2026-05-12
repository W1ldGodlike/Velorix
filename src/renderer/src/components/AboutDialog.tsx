import type { JSX } from 'react'

import type { AppAboutInfo } from '../../../shared/about-contract'
import {
  FFPROBE_DOC_ALL,
  YTDLP_DOC_FORMAT_SELECTION,
  YTDLP_DOC_README
} from '../../../shared/external-doc-urls'
import { uiText } from '../locales/ui-text'

/** Модальное окно §4.5 — переиспользуется главным окном и инспектором §9 (единые стили/`app-modal-*`). */
export function AboutDialog({
  open,
  aboutInfo,
  onClose,
  onDiagnosticStatus
}: {
  open: boolean
  aboutInfo: AppAboutInfo | null
  onClose: () => void
  onDiagnosticStatus?: (message: string) => void
}): JSX.Element | null {
  if (!open) {
    return null
  }

  function pushStatus(text: string): void {
    onDiagnosticStatus?.(text)
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
        onMouseDown={(e) => {
          e.stopPropagation()
        }}
      >
        <h2 id="about-title" className="app-modal-title">
          {uiText('aboutTitle')}
        </h2>
        {aboutInfo ? (
          <dl className="app-about-dl">
            <div className="app-about-row">
              <dt>{uiText('appLabel')}</dt>
              <dd>{aboutInfo.appName}</dd>
            </div>
            <div className="app-about-row">
              <dt>{uiText('versionLabel')}</dt>
              <dd className="app-about-mono">{aboutInfo.appVersion}</dd>
            </div>
            <div className="app-about-row">
              <dt>Electron</dt>
              <dd className="app-about-mono">{aboutInfo.electronVersion}</dd>
            </div>
            <div className="app-about-row">
              <dt>Chromium</dt>
              <dd className="app-about-mono">{aboutInfo.chromeVersion}</dd>
            </div>
            <div className="app-about-row">
              <dt>Node</dt>
              <dd className="app-about-mono">{aboutInfo.nodeVersion}</dd>
            </div>
          </dl>
        ) : (
          <p className="app-modal-hint">{uiText('loading')}</p>
        )}
        <div className="app-modal-footer app-modal-footer-split">
          <div className="app-about-footer-left">
            <div className="app-about-diagnostics">
              <button
                type="button"
                className="app-btn app-btn-compact"
                onClick={() => {
                  void window.fluxalloy.diagnostics.openFolder('logs').then((r) => {
                    if (!r.ok) {
                      pushStatus(`${uiText('logsFolderButton')}: ${r.error}`)
                    }
                  })
                }}
              >
                {uiText('logsFolderButton')}
              </button>
              <button
                type="button"
                className="app-btn app-btn-compact"
                onClick={() => {
                  void window.fluxalloy.diagnostics.openMainLog().then((r) => {
                    if (!r.ok) {
                      pushStatus(`main.log: ${r.error}`)
                    }
                  })
                }}
              >
                main.log
              </button>
              <button
                type="button"
                className="app-btn app-btn-compact"
                onClick={() => {
                  void window.fluxalloy.diagnostics.createSupportZip().then((r) => {
                    if (r.ok) {
                      pushStatus(uiText('supportZipSaved'))
                    } else if ('error' in r) {
                      pushStatus(`${uiText('supportZipButton')}: ${r.error}`)
                    }
                  })
                }}
              >
                {uiText('supportZipButton')}
              </button>
            </div>
            <p className="app-doc-inline-links app-about-doc-links">
              <a href={YTDLP_DOC_README} target="_blank" rel="noreferrer">
                yt-dlp README
              </a>
              {' · '}
              <a href={YTDLP_DOC_FORMAT_SELECTION} target="_blank" rel="noreferrer">
                {uiText('formatSelectionDoc')}
              </a>
              {' · '}
              <a href={FFPROBE_DOC_ALL} target="_blank" rel="noreferrer">
                ffprobe
              </a>
            </p>
          </div>
          <button type="button" className="app-btn app-btn-primary" onClick={onClose}>
            {uiText('closeButton')}
          </button>
        </div>
      </div>
    </div>
  )
}

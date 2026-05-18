import { useEffect, useState, type JSX } from 'react'

import type { DiagnosticsFolderEntry } from '../../../shared/diagnostics-contract'
import { uiText, uiTextVars } from '../locales/ui-text'

export function DiagnosticsFoldersPanel({
  busy,
  describedById,
  onStatus
}: {
  busy: boolean
  describedById: string
  onStatus: (message: string) => void
}): JSX.Element {
  const [folders, setFolders] = useState<DiagnosticsFolderEntry[] | null>(null)

  useEffect(() => {
    let cancelled = false
    void window.fluxalloy.diagnostics.listFolders().then((entries) => {
      if (!cancelled) {
        setFolders(entries)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section
      className="app-about-folders"
      role="region"
      aria-label={uiText('aboutDiagnosticsFoldersRegionAria')}
      aria-describedby={describedById}
      aria-busy={busy || folders === null}
    >
      <h3 className="app-about-folders-title">{uiText('aboutDiagnosticsFoldersHeading')}</h3>
      <p className="app-modal-hint app-about-folders-intro">
        {uiText('aboutDiagnosticsFoldersIntro')}
      </p>
      {folders === null ? (
        <p className="app-modal-hint" role="status" aria-live="polite">
          {uiText('loading')}
        </p>
      ) : (
        <ul className="app-about-folder-list" aria-describedby={describedById}>
          {folders.map((entry) => (
            <li key={entry.id}>
              <button
                type="button"
                className="app-btn app-btn-compact app-about-folder-btn"
                disabled={busy || !entry.exists}
                title={entry.hint}
                aria-label={uiTextVars('aboutDiagnosticsFolderButtonAria', {
                  label: entry.label,
                  hint: entry.hint
                })}
                aria-describedby={describedById}
                onClick={() => {
                  void window.fluxalloy.diagnostics.openFolder(entry.id).then((r) => {
                    if (!r.ok) {
                      onStatus(
                        uiTextVars('aboutMaintenanceCleanErrorTemplate', {
                          label: entry.label,
                          error: r.error
                        })
                      )
                    }
                  })
                }}
              >
                {entry.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

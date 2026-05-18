import { useCallback, useState, type JSX } from 'react'

import { AboutDialog } from './components/AboutDialog'
import { KnowledgeDialog } from './components/KnowledgeDialog'
import { InspectorStandaloneAppMain } from './components/InspectorStandaloneAppMain'
import { InspectorStandaloneAppTopbar } from './components/InspectorStandaloneAppTopbar'
import Versions from './components/Versions'
import { uiText } from './locales/ui-text'
import { useInspectorStandaloneApp } from './use-inspector-standalone-app'

/**
 * §9 / §363 — отдельное окно инспектора ffprobe.
 * Загружается через `index.html#inspector` тем же бандлом и preload, что и главное окно.
 */
export function InspectorStandaloneApp(): JSX.Element {
  const model = useInspectorStandaloneApp()
  const {
    probePending,
    statusHint,
    aboutOpen,
    setAboutOpen,
    aboutInfo,
    setStatusHint
  } = model
  const [knowledgeOpen, setKnowledgeOpen] = useState(false)
  const [knowledgeInitialSlug, setKnowledgeInitialSlug] = useState<string | null>(null)
  const onOpenKnowledgeArticle = useCallback((slug: string): void => {
    setKnowledgeInitialSlug(slug)
    setKnowledgeOpen(true)
  }, [])

  return (
    <div
      className="app-shell"
      aria-label={uiText('inspectorStandaloneShellAria')}
      aria-busy={probePending}
    >
      <InspectorStandaloneAppTopbar {...model} />
      <InspectorStandaloneAppMain {...model} onOpenKnowledgeArticle={onOpenKnowledgeArticle} />
      <footer
        className="app-statusbar"
        aria-label={uiText('appStatusbarAria')}
        aria-busy={probePending}
      >
        {statusHint ? (
          <span
            className="app-statusbar-extra"
            role="status"
            aria-live="polite"
            aria-label={uiText('inspectorStandaloneStatusbarStatusAria')}
            aria-describedby="inspector-standalone-empty-hint"
          >
            {statusHint}
          </span>
        ) : null}
        {statusHint ? <span className="app-statusbar-sep" aria-hidden /> : null}
        <Versions
          statusBusy={probePending}
          ariaDescribedBy="inspector-standalone-empty-hint"
        />
      </footer>
      <AboutDialog
        open={aboutOpen}
        aboutInfo={aboutInfo}
        onClose={() => {
          setAboutOpen(false)
        }}
        onDiagnosticStatus={(message) => {
          setStatusHint(message)
        }}
        onOpenKnowledgeArticle={onOpenKnowledgeArticle}
      />
      <KnowledgeDialog
        open={knowledgeOpen}
        initialSlug={knowledgeInitialSlug}
        onClose={() => {
          setKnowledgeOpen(false)
          setKnowledgeInitialSlug(null)
        }}
        onStatus={(message) => {
          setStatusHint(message)
        }}
      />
    </div>
  )
}

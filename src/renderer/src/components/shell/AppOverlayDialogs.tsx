import { Suspense, type Dispatch, type JSX, type SetStateAction } from 'react'

import { AppLazyPanelFallback, LazyKnowledgeDialog } from '../../app-lazy-panels'
import { AboutDialog } from '../AboutDialog'
export type AppOverlayDialogsProps = {
  aboutOpen: boolean
  aboutInfo: Awaited<ReturnType<typeof window.fluxalloy.about.getInfo>> | null
  setAboutOpen: Dispatch<SetStateAction<boolean>>
  knowledgeOpen: boolean
  knowledgeInitialSlug: string | null
  setKnowledgeOpen: Dispatch<SetStateAction<boolean>>
  setKnowledgeInitialSlug: Dispatch<SetStateAction<string | null>>
  uiLocaleRenderTick: number
  onStatusHint: (message: string) => void
}

export function AppOverlayDialogs({
  aboutOpen,
  aboutInfo,
  setAboutOpen,
  knowledgeOpen,
  knowledgeInitialSlug,
  setKnowledgeOpen,
  setKnowledgeInitialSlug,
  uiLocaleRenderTick,
  onStatusHint
}: AppOverlayDialogsProps): JSX.Element {
  return (
    <>
      <AboutDialog
        open={aboutOpen}
        aboutInfo={aboutInfo}
        onClose={() => {
          setAboutOpen(false)
        }}
        onDiagnosticStatus={onStatusHint}
        onOpenKnowledgeArticle={(slug) => {
          setAboutOpen(false)
          setKnowledgeInitialSlug(slug)
          setKnowledgeOpen(true)
        }}
      />

      {knowledgeOpen ? (
        <Suspense fallback={<AppLazyPanelFallback />}>
          <LazyKnowledgeDialog
            open={knowledgeOpen}
            initialSlug={knowledgeInitialSlug}
            localeVersion={uiLocaleRenderTick}
            onClose={() => {
              setKnowledgeOpen(false)
              setKnowledgeInitialSlug(null)
            }}
            onStatus={onStatusHint}
          />
        </Suspense>
      ) : null}
    </>
  )
}

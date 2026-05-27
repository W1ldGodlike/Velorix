import { Suspense, type Dispatch, type JSX, type SetStateAction } from 'react'

import type { WorkspaceTab } from '../../app-terminal-hint-ui'
import { AppLazyPanelFallback, LazyKnowledgeDialog } from '../../app-lazy-panels'
import { AboutDialog } from '../AboutDialog'
import type { ProcessErrorDialogPayload } from '../../../../shared/process-error-dialog-contract'
import type { QuitConfirmRequestPayload } from '../../../../shared/quit-confirm-contract'
import { CriticalCrashDialog } from './CriticalCrashDialog'
import { QuitConfirmDialog } from './QuitConfirmDialog'
export type AppOverlayDialogsProps = {
  workspaceTab: WorkspaceTab
  aboutOpen: boolean
  aboutInfo: Awaited<ReturnType<typeof window.velorix.about.getInfo>> | null
  setAboutOpen: Dispatch<SetStateAction<boolean>>
  knowledgeOpen: boolean
  knowledgeInitialSlug: string | null
  setKnowledgeOpen: Dispatch<SetStateAction<boolean>>
  setKnowledgeInitialSlug: Dispatch<SetStateAction<string | null>>
  processErrorDialog: ProcessErrorDialogPayload | null
  setProcessErrorDialog: Dispatch<SetStateAction<ProcessErrorDialogPayload | null>>
  quitConfirmRequest: QuitConfirmRequestPayload | null
  setQuitConfirmRequest: Dispatch<SetStateAction<QuitConfirmRequestPayload | null>>
  uiLocaleRenderTick: number
  onStatusHint: (message: string) => void
}

export function AppOverlayDialogs({
  workspaceTab,
  aboutOpen,
  aboutInfo,
  setAboutOpen,
  knowledgeOpen,
  knowledgeInitialSlug,
  setKnowledgeOpen,
  setKnowledgeInitialSlug,
  processErrorDialog,
  setProcessErrorDialog,
  quitConfirmRequest,
  setQuitConfirmRequest,
  uiLocaleRenderTick,
  onStatusHint
}: AppOverlayDialogsProps): JSX.Element {
  return (
    <>
      <CriticalCrashDialog
        payload={processErrorDialog}
        onClose={() => {
          setProcessErrorDialog(null)
        }}
        onStatusHint={onStatusHint}
      />
      <QuitConfirmDialog
        request={quitConfirmRequest}
        onResolve={(confirmed) => {
          if (!quitConfirmRequest) {
            return
          }
          window.velorix.respondQuitConfirm(quitConfirmRequest.requestId, confirmed)
          setQuitConfirmRequest(null)
        }}
      />
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

      {knowledgeOpen && workspaceTab !== 'knowledge' ? (
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

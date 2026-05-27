import { useCallback, useEffect, useState, type JSX } from 'react'

import type { AppUiLocale } from '../../../shared/app-ui-locale'
import type { RestoredSourceInfo } from '../../../shared/preview-dialog-contract'
import { getUiLocale, uiText } from '../locales/ui-text'
import { probePanelsFromSettings, PROBE_UI_DEFAULTS } from '../inspector-workspace-probe-ui'
import { useAppShellStore } from '../stores/app-shell-store'
import { IconFolder, IconFolderOpen, IconRefreshCw } from './LucideMiniIcons'
import { InspectorWorkspaceMain } from './InspectorWorkspaceMain'
import type { PreviewProbeSectionKey } from './media-probe-panel-helpers'

const PROBE_SECTION_SETTING_KEYS: Record<
  PreviewProbeSectionKey,
  'probeExportSummary' | 'probeTracks' | 'probeChapters' | 'probeRawJson'
> = {
  exportSummary: 'probeExportSummary',
  tracks: 'probeTracks',
  chapters: 'probeChapters',
  rawJson: 'probeRawJson'
}

export function InspectorWorkspaceConnected(props: {
  onOpenKnowledgeArticle?: (slug: string) => void
}): JSX.Element {
  const { onOpenKnowledgeArticle } = props
  const previewPath = useAppShellStore((s) => s.preview?.path ?? null)
  const probeInfo = useAppShellStore((s) => s.probeInfo)
  const probePending = useAppShellStore((s) => s.probePending)
  const probeError = useAppShellStore((s) => s.probeError)
  const setPreview = useAppShellStore((s) => s.setPreview)
  const setProbeInfo = useAppShellStore((s) => s.setProbeInfo)
  const setProbePending = useAppShellStore((s) => s.setProbePending)
  const setProbeError = useAppShellStore((s) => s.setProbeError)
  const setStatusHint = useAppShellStore((s) => s.setStatusHint)
  const bumpPreviewProbeGeneration = useAppShellStore((s) => s.bumpPreviewProbeGeneration)
  const [probeUiPanels, setProbeUiPanels] = useState(PROBE_UI_DEFAULTS)

  useEffect(() => {
    let mounted = true
    void window.velorix.settings
      .get()
      .then((settings) => {
        if (mounted) {
          setProbeUiPanels(probePanelsFromSettings(settings.mainWindowUiPanels))
        }
      })
      .catch(console.error)

    const off = window.velorix.onMainWindowUiPanelsChanged((panels) => {
      setProbeUiPanels(probePanelsFromSettings(panels))
    })
    return () => {
      mounted = false
      off()
    }
  }, [])

  const applyGrantedPreview = useCallback(
    (payload: RestoredSourceInfo): void => {
      setProbeInfo(null)
      setProbeError(null)
      setStatusHint(payload.name)
      setPreview(payload)
    },
    [setPreview, setProbeError, setProbeInfo, setStatusHint]
  )

  const persistProbeSection = useCallback((key: PreviewProbeSectionKey, open: boolean): void => {
    void window.velorix.settings
      .mergeMainWindowUiPanels({ [PROBE_SECTION_SETTING_KEYS[key]]: open })
      .then((settings) => {
        setProbeUiPanels(probePanelsFromSettings(settings.mainWindowUiPanels))
      })
      .catch(console.error)
  }, [])

  const refreshProbe = useCallback(async (): Promise<void> => {
    if (!previewPath) {
      return
    }
    const probeGeneration = bumpPreviewProbeGeneration()
    setProbePending(true)
    const result = await window.velorix.preview.probe(previewPath)
    if (useAppShellStore.getState().previewProbeGeneration !== probeGeneration) {
      return
    }
    setProbePending(false)
    if (result.ok) {
      setProbeInfo(result)
      setProbeError(null)
      return
    }
    setProbeInfo(null)
    setProbeError(result.error)
    setStatusHint(result.error)
  }, [
    bumpPreviewProbeGeneration,
    previewPath,
    setProbeError,
    setProbeInfo,
    setProbePending,
    setStatusHint
  ])

  const handleOpenFile = useCallback(async (): Promise<void> => {
    const result = await window.velorix.preview.openFileDialog(getUiLocale() as AppUiLocale)
    if (result.ok) {
      applyGrantedPreview({ path: result.path, mediaUrl: result.mediaUrl, name: result.name })
    }
  }, [applyGrantedPreview])

  const handleOpenFolder = useCallback(async (): Promise<void> => {
    const result = await window.velorix.preview.openVideoFolderDialog(getUiLocale() as AppUiLocale)
    if (result.ok) {
      applyGrantedPreview({ path: result.path, mediaUrl: result.mediaUrl, name: result.name })
    } else if ('error' in result && typeof result.error === 'string' && result.error.length > 0) {
      setStatusHint(result.error)
    }
  }, [applyGrantedPreview, setStatusHint])

  const handleDrop = useCallback(
    async (files: FileList | null): Promise<void> => {
      const file = files?.[0]
      if (!file) {
        return
      }
      const absolutePath = window.velorix.preview.getPathForFile(file)
      const granted = await window.velorix.preview.grantPath(absolutePath)
      if (!granted.ok) {
        setStatusHint(granted.error)
        return
      }
      applyGrantedPreview({ path: granted.path, mediaUrl: granted.mediaUrl, name: granted.name })
    },
    [applyGrantedPreview, setStatusHint]
  )

  return (
    <section
      className="app-inspector-workspace-shell"
      aria-label={uiText('inspectorWorkbenchAria')}
      aria-describedby="app-inspector-workspace-hint"
      aria-busy={probePending}
    >
      <div className="app-inspector-workspace-head">
        <div className="app-inspector-workspace-copy">
          <h2 className="app-settings-title">{uiText('workspaceTabInspector')}</h2>
          <p
            id="app-inspector-workspace-hint"
            className="app-settings-subtitle"
            title={uiText('workspaceTabInspectorTooltip')}
          >
            {uiText('workspaceTabInspectorTooltip')}
          </p>
        </div>
        <div
          className="app-topbar-actions"
          role="toolbar"
          aria-orientation="horizontal"
          aria-label={uiText('inspectorTopbarActionsToolbarAria')}
          aria-describedby="app-inspector-workspace-hint"
          aria-busy={probePending && previewPath !== null}
        >
          <button
            type="button"
            className="app-icon-btn"
            aria-describedby="app-inspector-workspace-hint"
            onClick={() => {
              void handleOpenFolder()
            }}
            title={uiText('topbarOpenVideoFolderTitle')}
          >
            <IconFolder />
            <span className="app-visually-hidden">{uiText('topbarOpenVideoFolderLabel')}</span>
          </button>
          <button
            type="button"
            className="app-icon-btn app-icon-btn-primary"
            aria-describedby="app-inspector-workspace-hint"
            onClick={() => {
              void handleOpenFile()
            }}
            title={uiText('topbarOpenFileTitle')}
          >
            <IconFolderOpen />
            <span className="app-visually-hidden">{uiText('topbarOpenFileLabel')}</span>
          </button>
          <button
            type="button"
            className="app-icon-btn"
            aria-describedby="app-inspector-workspace-hint"
            disabled={!previewPath}
            onClick={() => {
              void refreshProbe()
            }}
            title={
              previewPath
                ? uiText('inspectorWorkspaceFfprobeRefreshTitle')
                : uiText('inspectorWorkspaceFfprobeRefreshDisabledTitle')
            }
          >
            <IconRefreshCw
              title={
                previewPath
                  ? uiText('inspectorWorkspaceFfprobeRefreshTitle')
                  : uiText('inspectorWorkspaceFfprobeRefreshDisabledTitle')
              }
            />
            <span className="app-visually-hidden">
              {uiText('inspectorWorkspaceFfprobeRefreshVisuallyHidden')}
            </span>
          </button>
        </div>
      </div>
      <InspectorWorkspaceMain
        mediaPath={previewPath}
        probePending={probePending}
        displayedProbeInfo={previewPath ? probeInfo : null}
        displayedProbeError={previewPath && !probePending && !probeInfo ? probeError : null}
        probeUiPanels={probeUiPanels}
        persistProbeSection={persistProbeSection}
        handleDrop={handleDrop}
        {...(onOpenKnowledgeArticle ? { onOpenKnowledgeArticle } : {})}
      />
    </section>
  )
}

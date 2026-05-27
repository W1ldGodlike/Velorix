import { useEffect, useState, type JSX } from 'react'

import type { AppAboutInfo } from '../../../../shared/about-contract'
import { engineSummaryText } from '../../app-engines-ui'
import type { EditorFfmpegSettingsRailProps } from '../editor/EditorFfmpegSettingsRail'
import { ExportPresetManagerPanel } from '../ExportPresetManagerPanel'
import { hydrateEditorExportFieldsFromSettings } from '../../editor-export-settings-hydrate'
import { uiText } from '../../locales/ui-text'
import { useAppShellStore } from '../../stores/app-shell-store'
import { useExportSettingsStore } from '../../stores/export-settings-store'
import { AboutDialog } from '../AboutDialog'
import { MediaFileUtilitiesDialog } from '../MediaFileUtilitiesDialog'
import type { AppSettingsDialogProps } from './AppSettingsDialog'
import { EnginePathsSettingsSection } from './EnginePathsSettingsSection'
import { ExternalFilterScriptDialog } from './ExternalFilterScriptDialog'
import type { ExportPresetNameDialogProps } from './ExportPresetNameDialog'
import { ExportPresetNameDialog } from './ExportPresetNameDialog'
import { UiShowcaseWorkspacePanel } from './UiShowcaseWorkspacePanel'

type ToolsWorkspaceView =
  | 'hub'
  | 'about'
  | 'utilities'
  | 'externalFilter'
  | 'dependencies'
  | 'exportPreset'
  | 'uiShowcase'
  | 'uiComponents'

export function ToolsWorkspacePanel(props: {
  appSettingsRoute: AppSettingsDialogProps
  exportPresetRoute: ExportPresetNameDialogProps
  editorFfmpeg: Pick<
    EditorFfmpegSettingsRailProps,
    | 'exportBusy'
    | 'snapshotBusy'
    | 'probePending'
    | 'exportUserPresets'
    | 'selectedUserPresetId'
    | 'setSelectedUserPresetId'
    | 'selectedExportUserPreset'
    | 'hydrateExportFieldsFromSettings'
    | 'handleSaveExportUserPreset'
    | 'handleDeleteExportUserPreset'
    | 'handleRenameExportUserPreset'
    | 'handleOverwriteExportUserPreset'
  >
}): JSX.Element {
  const { appSettingsRoute, exportPresetRoute, editorFfmpeg } = props
  const [view, setView] = useState<ToolsWorkspaceView>('hub')
  const [aboutInfo, setAboutInfo] = useState<AppAboutInfo | null>(null)
  const setWorkspaceTab = useAppShellStore((s) => s.setWorkspaceTab)
  const setStatusHint = useAppShellStore((s) => s.setStatusHint)
  const setKnowledgeOpen = useAppShellStore((s) => s.setKnowledgeOpen)
  const setKnowledgeInitialSlug = useAppShellStore((s) => s.setKnowledgeInitialSlug)
  const externalFilterScriptOpen = useAppShellStore((s) => s.externalFilterScriptOpen)
  const setExternalFilterScriptOpen = useAppShellStore((s) => s.setExternalFilterScriptOpen)
  const engineSummary = useAppShellStore((s) => s.engineSummary)
  const exportSettings = useExportSettingsStore()
  let activeView: ToolsWorkspaceView = view
  if (externalFilterScriptOpen) {
    activeView = 'externalFilter'
  } else if (exportPresetRoute.dialog) {
    activeView = 'exportPreset'
  } else if (view === 'externalFilter') {
    activeView = 'hub'
  }

  useEffect(() => {
    if (view !== 'about') {
      return
    }
    if (aboutInfo !== null) {
      return
    }
    void window.velorix.about.getInfo().then(setAboutInfo)
  }, [aboutInfo, view])

  useEffect(() => {
    if (activeView !== 'dependencies') {
      return
    }
    void window.velorix.settings.get().then((settings) => {
      appSettingsRoute.setEnginePathsDraft({
        ffmpeg: settings.engineExecutablePaths?.ffmpeg ?? '',
        ffprobe: settings.engineExecutablePaths?.ffprobe ?? '',
        'yt-dlp': settings.engineExecutablePaths?.['yt-dlp'] ?? ''
      })
    })
  }, [activeView, appSettingsRoute])

  const renderHub = (): JSX.Element => (
    <section
      className="app-tools-workspace-shell"
      aria-label={uiText('toolsHubTitle')}
      aria-describedby="app-tools-workspace-hint"
    >
      <div className="app-tools-workspace-head">
        <div className="app-tools-workspace-copy">
          <h2 className="app-settings-title">{uiText('toolsHubTitle')}</h2>
          <p
            id="app-tools-workspace-hint"
            className="app-settings-subtitle"
            title={uiText('toolsHubSubtitle')}
          >
            {uiText('toolsHubSubtitle')}
          </p>
        </div>
      </div>
      <div
        className="app-tools-workspace-grid"
        role="list"
        aria-describedby="app-tools-workspace-hint"
      >
        <section className="app-tools-workspace-card" role="listitem">
          <h3 className="app-tools-workspace-card-title">{uiText('toolsHubAboutTitle')}</h3>
          <p className="app-tools-workspace-card-copy">{uiText('toolsHubAboutBody')}</p>
          <div className="app-tools-workspace-card-actions">
            <button
              type="button"
              className="app-btn"
              onClick={() => {
                setView('about')
              }}
            >
              {uiText('toolsHubOpenAction')}
            </button>
          </div>
        </section>
        <section className="app-tools-workspace-card" role="listitem">
          <h3 className="app-tools-workspace-card-title">{uiText('toolsHubUtilitiesTitle')}</h3>
          <p className="app-tools-workspace-card-copy">{uiText('toolsHubUtilitiesBody')}</p>
          <div className="app-tools-workspace-card-actions">
            <button
              type="button"
              className="app-btn"
              onClick={() => {
                setView('utilities')
              }}
            >
              {uiText('toolsHubOpenAction')}
            </button>
          </div>
        </section>
        <section className="app-tools-workspace-card" role="listitem">
          <h3 className="app-tools-workspace-card-title">{uiText('toolsHubScenariosTitle')}</h3>
          <p className="app-tools-workspace-card-copy">{uiText('toolsHubScenariosBody')}</p>
          <div className="app-tools-workspace-card-actions">
            <button
              type="button"
              className="app-btn"
              onClick={() => {
                setWorkspaceTab('scenarios')
              }}
            >
              {uiText('toolsHubOpenAction')}
            </button>
          </div>
        </section>
        <section className="app-tools-workspace-card" role="listitem">
          <h3 className="app-tools-workspace-card-title">
            {uiText('toolsHubExternalFilterTitle')}
          </h3>
          <p className="app-tools-workspace-card-copy">{uiText('toolsHubExternalFilterBody')}</p>
          <div className="app-tools-workspace-card-actions">
            <button
              type="button"
              className="app-btn"
              onClick={() => {
                setExternalFilterScriptOpen(true)
              }}
            >
              {uiText('toolsHubOpenAction')}
            </button>
          </div>
        </section>
        <section className="app-tools-workspace-card" role="listitem">
          <h3 className="app-tools-workspace-card-title">{uiText('toolsHubEnginePathsTitle')}</h3>
          <p className="app-tools-workspace-card-copy">{uiText('toolsHubEnginePathsBody')}</p>
          <div className="app-tools-workspace-card-actions">
            <button
              type="button"
              className="app-btn"
              onClick={() => {
                setView('dependencies')
              }}
            >
              {uiText('toolsHubOpenAction')}
            </button>
          </div>
        </section>
        <section className="app-tools-workspace-card" role="listitem">
          <h3 className="app-tools-workspace-card-title">{uiText('toolsHubFirstRunTitle')}</h3>
          <p className="app-tools-workspace-card-copy">{uiText('toolsHubFirstRunBody')}</p>
          <div className="app-tools-workspace-card-actions">
            <button
              type="button"
              className="app-btn"
              onClick={() => {
                setView('dependencies')
              }}
            >
              {uiText('toolsHubOpenAction')}
            </button>
          </div>
        </section>
        <section className="app-tools-workspace-card" role="listitem">
          <h3 className="app-tools-workspace-card-title">{uiText('toolsHubExportPresetTitle')}</h3>
          <p className="app-tools-workspace-card-copy">{uiText('toolsHubExportPresetBody')}</p>
          <div className="app-tools-workspace-card-actions">
            <button
              type="button"
              className="app-btn"
              onClick={() => {
                setView('exportPreset')
              }}
            >
              {uiText('toolsHubOpenAction')}
            </button>
          </div>
        </section>
        <section className="app-tools-workspace-card" role="listitem">
          <h3 className="app-tools-workspace-card-title">{uiText('toolsHubUiShowcaseTitle')}</h3>
          <p className="app-tools-workspace-card-copy">{uiText('toolsHubUiShowcaseBody')}</p>
          <div className="app-tools-workspace-card-actions">
            <button
              type="button"
              className="app-btn"
              onClick={() => {
                setView('uiShowcase')
              }}
            >
              {uiText('toolsHubOpenAction')}
            </button>
          </div>
        </section>
        <section className="app-tools-workspace-card" role="listitem">
          <h3 className="app-tools-workspace-card-title">{uiText('toolsHubUiComponentsTitle')}</h3>
          <p className="app-tools-workspace-card-copy">{uiText('toolsHubUiComponentsBody')}</p>
          <div className="app-tools-workspace-card-actions">
            <button
              type="button"
              className="app-btn"
              onClick={() => {
                setView('uiComponents')
              }}
            >
              {uiText('toolsHubOpenAction')}
            </button>
          </div>
        </section>
      </div>
    </section>
  )

  if (activeView === 'about') {
    return (
      <AboutDialog
        open
        aboutInfo={aboutInfo}
        presentation="embedded"
        onClose={() => {
          setView('hub')
        }}
        onExitEmbedded={() => {
          setView('hub')
        }}
        onDiagnosticStatus={(message) => {
          setStatusHint(message)
        }}
        onOpenKnowledgeArticle={(slug) => {
          setKnowledgeInitialSlug(slug)
          setKnowledgeOpen(false)
          setWorkspaceTab('knowledge')
        }}
      />
    )
  }

  if (activeView === 'utilities') {
    return (
      <MediaFileUtilitiesDialog
        open
        presentation="embedded"
        onClose={() => {
          setView('hub')
        }}
        onStatus={(message) => {
          setStatusHint(message)
        }}
      />
    )
  }

  if (activeView === 'externalFilter') {
    return (
      <ExternalFilterScriptDialog
        open
        presentation="embedded"
        onClose={() => {
          setExternalFilterScriptOpen(false)
          setView('hub')
        }}
        onExitEmbedded={() => {
          setExternalFilterScriptOpen(false)
          setView('hub')
        }}
        onStatus={(message) => {
          setStatusHint(message)
        }}
        onApplied={() => {
          void window.velorix.settings.get().then((loaded) => {
            hydrateEditorExportFieldsFromSettings(loaded, exportSettings)
          })
        }}
      />
    )
  }

  if (activeView === 'dependencies') {
    return (
      <section
        className="app-tools-workspace-shell"
        aria-label={uiText('appSettingsSectionDependencies')}
        aria-describedby="app-tools-dependencies-hint"
      >
        <div className="app-tools-workspace-head">
          <div className="app-tools-workspace-copy">
            <h2 className="app-settings-title">{uiText('appSettingsSectionDependencies')}</h2>
            <p
              id="app-tools-dependencies-hint"
              className="app-settings-subtitle"
              title={uiText('appSettingsSectionHintDependencies')}
            >
              {uiText('appSettingsSectionHintDependencies')}
            </p>
            <p className="app-modal-hint">{engineSummaryText(engineSummary)}</p>
          </div>
        </div>
        <div className="about-dialog about-dialog-embedded">
          <EnginePathsSettingsSection
            sectionId="tools-workspace-dependencies"
            enginePathsSaving={appSettingsRoute.enginePathsSaving}
            engineDownloadBusy={appSettingsRoute.engineDownloadBusy}
            enginePathsDraft={appSettingsRoute.enginePathsDraft}
            setEnginePathsDraft={appSettingsRoute.setEnginePathsDraft}
            onPickEngine={appSettingsRoute.onPickEngine}
            onClearDownloadedEngines={appSettingsRoute.onClearDownloadedEngines}
            onCheckEngineUpdates={appSettingsRoute.onCheckEngineUpdates}
            onSave={appSettingsRoute.onSaveEnginePaths}
          />
          <div className="app-tools-workspace-card-actions">
            <button
              type="button"
              className="app-btn"
              onClick={() => {
                setView('hub')
              }}
            >
              {uiText('closeButton')}
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (activeView === 'exportPreset') {
    return (
      <section
        className="app-tools-workspace-shell"
        aria-label={uiText('editorFfmpegSectionPresets')}
        aria-describedby="app-tools-export-preset-hint"
      >
        <div className="app-tools-workspace-head">
          <div className="app-tools-workspace-copy">
            <h2 className="app-settings-title">{uiText('editorFfmpegSectionPresets')}</h2>
            <p
              id="app-tools-export-preset-hint"
              className="app-settings-subtitle"
              title={uiText('editorFfmpegSectionPresetsHint')}
            >
              {uiText('editorFfmpegSectionPresetsHint')}
            </p>
          </div>
        </div>
        <div className="about-dialog about-dialog-embedded">
          <ExportPresetManagerPanel
            describedById="app-tools-export-preset-hint"
            exportBusy={editorFfmpeg.exportBusy}
            snapshotBusy={editorFfmpeg.snapshotBusy}
            probePending={editorFfmpeg.probePending}
            exportUserPresets={editorFfmpeg.exportUserPresets}
            selectedUserPresetId={editorFfmpeg.selectedUserPresetId}
            setSelectedUserPresetId={editorFfmpeg.setSelectedUserPresetId}
            selectedExportUserPreset={editorFfmpeg.selectedExportUserPreset}
            hydrateExportFieldsFromSettings={editorFfmpeg.hydrateExportFieldsFromSettings}
            handleSaveExportUserPreset={editorFfmpeg.handleSaveExportUserPreset}
            handleDeleteExportUserPreset={editorFfmpeg.handleDeleteExportUserPreset}
            handleRenameExportUserPreset={editorFfmpeg.handleRenameExportUserPreset}
            handleOverwriteExportUserPreset={editorFfmpeg.handleOverwriteExportUserPreset}
          />
          {exportPresetRoute.dialog ? (
            <ExportPresetNameDialog
              {...exportPresetRoute}
              presentation="embedded"
              onExitEmbedded={() => {
                exportPresetRoute.setDialog(null)
              }}
            />
          ) : null}
          <div className="app-tools-workspace-card-actions">
            <button
              type="button"
              className="app-btn"
              onClick={() => {
                setView('hub')
              }}
            >
              {uiText('closeButton')}
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (activeView === 'uiShowcase' || activeView === 'uiComponents') {
    return (
      <UiShowcaseWorkspacePanel
        initialMode={activeView === 'uiComponents' ? 'components' : 'states'}
        onClose={() => {
          setView('hub')
        }}
      />
    )
  }

  return renderHub()
}

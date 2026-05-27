import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
  type Dispatch,
  type JSX,
  type SetStateAction
} from 'react'

import {
  APP_SETTINGS_DIALOG_SECTIONS,
  type AppSettingsDialogSection
} from '../../../../shared/app-settings-dialog-section'
import type { EditorUrlPasteBehaviorId } from '../../../../shared/editor-url-paste-behavior'
import type { AppUiLocale } from '../../../../shared/app-ui-locale'
import type { EngineId } from '../../../../shared/engine-contract'
import type { EnginePathsDraft } from '../../app-engines-ui'
import type { WorkspaceTab } from '../../app-terminal-hint-ui'
import { hydrateEditorExportFieldsFromSettings } from '../../editor-export-settings-hydrate'
import { uiText } from '../../locales/ui-text'
import {
  EditorFfmpegBenchmarkPanel,
  type EditorFfmpegBenchmarkPanelProps
} from '../editor/EditorFfmpegBenchmarkPanel'
import type { LastFfmpegError } from '../../stores/app-shell-store'
import { useExportSettingsStore } from '../../stores/export-settings-store'
import {
  AppSettingsDefaultsPane,
  AppSettingsGeneralPane,
  AppSettingsHotkeysPane,
  AppSettingsLogsPane,
  AppSettingsResetPane,
  SettingsDialogHeaderTitle
} from './app-settings-dialog-panes'
import { AppSettingsPluginsPane } from './AppSettingsPluginsPane'
import {
  APP_SETTINGS_SECTION_HINT_KEYS as SECTION_HINT_KEYS,
  APP_SETTINGS_SECTION_LABEL_KEYS as SECTION_LABEL_KEYS
} from './app-settings-dialog-section-labels'
import { EnginePathsSettingsSection } from './EnginePathsSettingsSection'

export type AppSettingsDialogProps = {
  open: boolean
  section: AppSettingsDialogSection
  onSectionChange: (section: AppSettingsDialogSection) => void
  onClose: () => void
  presentation?: 'dialog' | 'embedded'
  onExitEmbedded?: () => void
  onStatus: (message: string) => void
  onUiLocalePersisted: (locale: AppUiLocale) => void
  editorUrlPasteBehavior: EditorUrlPasteBehaviorId
  setEditorUrlPasteBehavior: Dispatch<SetStateAction<EditorUrlPasteBehaviorId>>
  setWorkspaceTab: Dispatch<SetStateAction<WorkspaceTab>>
  onOpenAbout: () => void
  onOpenWorkflowPlanner?: () => void
  onOpenWorkflowScenarioBuilder?: () => void
  onOpenKnowledgeArticle?: (slug: string) => void
  enginePathsSaving: boolean
  engineDownloadBusy: boolean
  enginePathsDraft: EnginePathsDraft
  setEnginePathsDraft: Dispatch<SetStateAction<EnginePathsDraft>>
  onPickEngine: (id: EngineId) => void
  onClearDownloadedEngines: () => void
  onCheckEngineUpdates: () => void
  onSaveEnginePaths: () => void
  resetBusy: boolean
  setResetBusy: Dispatch<SetStateAction<boolean>>
  editorFfmpegBenchmark?: EditorFfmpegBenchmarkPanelProps
  lastFfmpegError?: LastFfmpegError | null
  setLastFfmpegError?: Dispatch<SetStateAction<LastFfmpegError | null>>
}

export function AppSettingsDialog(props: AppSettingsDialogProps): JSX.Element | null {
  const {
    open,
    section,
    onSectionChange,
    onClose,
    presentation = 'dialog',
    onExitEmbedded,
    onStatus,
    onUiLocalePersisted,
    editorUrlPasteBehavior,
    setEditorUrlPasteBehavior,
    setWorkspaceTab,
    onOpenAbout,
    onOpenKnowledgeArticle,
    enginePathsSaving,
    engineDownloadBusy,
    enginePathsDraft,
    setEnginePathsDraft,
    onPickEngine,
    onClearDownloadedEngines,
    onCheckEngineUpdates,
    onSaveEnginePaths,
    resetBusy,
    setResetBusy,
    editorFfmpegBenchmark,
    lastFfmpegError,
    setLastFfmpegError
  } = props

  const dialogHintId = useId()
  const sectionHintId = `${dialogHintId}-section`
  const [downloadsOutputPath, setDownloadsOutputPath] = useState<string | null>(null)
  const [batchOutputPath, setBatchOutputPath] = useState<string | null>(null)
  const [resetConfirm, setResetConfirm] = useState(false)
  const [confirmCloseOnQuit, setConfirmCloseOnQuit] = useState(true)
  const exportSettings = useExportSettingsStore()
  const shellBusy = enginePathsSaving || resetBusy

  useEffect(() => {
    if (!open) {
      return
    }
    void window.velorix.settings.get().then((s) => {
      setConfirmCloseOnQuit(s.confirmCloseOnQuit !== false)
    })
    void window.velorix.downloads.getOutputDirectory().then((dir) => {
      setDownloadsOutputPath(dir.path)
    })
    void window.velorix.settings.get().then((s) => {
      const batch = s.ffmpegExportBatchOutputDirectory?.trim()
      setBatchOutputPath(batch && batch.length > 0 ? batch : null)
    })
  }, [open])

  useEffect(() => {
    if (!open || section !== 'dependencies') {
      return
    }
    void window.velorix.settings.get().then((s) => {
      setEnginePathsDraft({
        ffmpeg: s.engineExecutablePaths?.ffmpeg ?? '',
        ffprobe: s.engineExecutablePaths?.ffprobe ?? '',
        'yt-dlp': s.engineExecutablePaths?.['yt-dlp'] ?? ''
      })
    })
  }, [open, section, setEnginePathsDraft])

  const sectionTitle = uiText(SECTION_LABEL_KEYS[section])
  const ffmpegErrorSourceLabel =
    lastFfmpegError?.source === 'export'
      ? uiText('appSettingsFfmpegErrorSourceExport')
      : lastFfmpegError?.source === 'snapshot'
        ? uiText('appSettingsFfmpegErrorSourceSnapshot')
        : lastFfmpegError?.source === 'extractFrames'
          ? uiText('appSettingsFfmpegErrorSourceExtractFrames')
          : lastFfmpegError?.source === 'videoSprite'
            ? uiText('appSettingsFfmpegErrorSourceVideoSprite')
            : lastFfmpegError?.source === 'batch'
              ? uiText('appSettingsFfmpegErrorSourceBatch')
              : lastFfmpegError?.source === 'benchmark'
                ? uiText('appSettingsFfmpegErrorSourceBenchmark')
                : null

  const nav = useMemo(
    () =>
      APP_SETTINGS_DIALOG_SECTIONS.map((id) => ({
        id,
        label: uiText(SECTION_LABEL_KEYS[id]),
        selected: id === section
      })),
    [section]
  )
  const syncExternalFilterSettings = useCallback(() => {
    void window.velorix.settings.get().then((loaded) => {
      hydrateEditorExportFieldsFromSettings(loaded, exportSettings)
    })
  }, [exportSettings])

  if (!open) {
    return null
  }

  const renderSettingsChrome = (embedded: boolean): JSX.Element => (
    <div
      className={
        embedded
          ? 'app-settings-dialog app-settings-dialog-embedded'
          : 'app-modal app-modal-wide app-settings-dialog'
      }
      role={embedded ? 'region' : 'dialog'}
      aria-modal={embedded ? undefined : 'true'}
      aria-busy={shellBusy}
      aria-labelledby={`${dialogHintId}-title`}
      aria-describedby={dialogHintId}
      onMouseDown={
        embedded
          ? undefined
          : (e) => {
              e.stopPropagation()
            }
      }
    >
      <div className="app-modal-header-row">
        <SettingsDialogHeaderTitle dialogHintId={dialogHintId} />
        <button
          type="button"
          className="app-btn"
          disabled={shellBusy}
          title={uiText('closeButton')}
          aria-label={uiText('appSettingsCloseAria')}
          onClick={embedded ? (onExitEmbedded ?? onClose) : onClose}
        >
          {uiText('closeButton')}
        </button>
      </div>

      <div className="app-settings-dialog-grid">
        <nav
          className="app-settings-dialog-nav"
          aria-label={uiText('appSettingsNavAria')}
          aria-describedby={dialogHintId}
        >
          {nav.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`app-settings-dialog-nav-btn${item.selected ? ' app-settings-dialog-nav-btn-active' : ''}`}
              aria-current={item.selected ? 'page' : undefined}
              disabled={shellBusy}
              onClick={() => {
                onSectionChange(item.id)
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <section
          className="app-settings-dialog-pane"
          aria-labelledby={`${dialogHintId}-section-title`}
          aria-describedby={sectionHintId}
          aria-busy={shellBusy}
        >
          <h3 id={`${dialogHintId}-section-title`} className="app-settings-dialog-pane-title">
            {sectionTitle}
          </h3>
          <p id={sectionHintId} className="app-modal-hint">
            {uiText(SECTION_HINT_KEYS[section])}
          </p>

          {section === 'general' ? (
            <AppSettingsGeneralPane
              sectionHintId={sectionHintId}
              shellBusy={shellBusy}
              onUiLocalePersisted={onUiLocalePersisted}
              confirmCloseOnQuit={confirmCloseOnQuit}
              setConfirmCloseOnQuit={setConfirmCloseOnQuit}
              editorUrlPasteBehavior={editorUrlPasteBehavior}
              setEditorUrlPasteBehavior={setEditorUrlPasteBehavior}
              onStatus={onStatus}
              {...(onOpenKnowledgeArticle ? { onOpenKnowledgeArticle } : {})}
            />
          ) : null}

          {section === 'defaults' ? (
            <AppSettingsDefaultsPane
              sectionHintId={sectionHintId}
              shellBusy={shellBusy}
              downloadsOutputPath={downloadsOutputPath}
              batchOutputPath={batchOutputPath}
              setDownloadsOutputPath={setDownloadsOutputPath}
              setBatchOutputPath={setBatchOutputPath}
              setWorkspaceTab={setWorkspaceTab}
              onClose={onClose}
            />
          ) : null}

          {section === 'dependencies' ? (
            <div className="app-settings-stack">
              <EnginePathsSettingsSection
                sectionId="app-settings-deps"
                enginePathsSaving={enginePathsSaving}
                engineDownloadBusy={engineDownloadBusy}
                enginePathsDraft={enginePathsDraft}
                setEnginePathsDraft={setEnginePathsDraft}
                onPickEngine={onPickEngine}
                onClearDownloadedEngines={onClearDownloadedEngines}
                onCheckEngineUpdates={onCheckEngineUpdates}
                onSave={onSaveEnginePaths}
              />
            </div>
          ) : null}

          {section === 'system' ? (
            <div className="app-settings-stack">
              <AppSettingsPluginsPane
                sectionHintId={sectionHintId}
                onStatus={onStatus}
                onApplied={syncExternalFilterSettings}
              />
              <section
                className="app-settings-system-error"
                aria-labelledby={`${dialogHintId}-ffmpeg-error-title`}
                aria-describedby={sectionHintId}
              >
                <div className="app-settings-row">
                  <span
                    id={`${dialogHintId}-ffmpeg-error-title`}
                    className="app-settings-row-label"
                  >
                    {uiText('appSettingsFfmpegErrorTitle')}
                  </span>
                </div>
                <p className="app-modal-hint">
                  {ffmpegErrorSourceLabel
                    ? `${uiText('appSettingsFfmpegErrorSourceLabel')}: ${ffmpegErrorSourceLabel}`
                    : uiText('appSettingsFfmpegErrorEmpty')}
                </p>
                <pre className="app-settings-system-error-detail">
                  {lastFfmpegError?.detail ?? uiText('appSettingsFfmpegErrorEmptyDetail')}
                </pre>
                <div
                  className="app-settings-actions"
                  role="toolbar"
                  aria-orientation="horizontal"
                  aria-label={uiText('appSettingsFfmpegErrorToolbarAria')}
                >
                  <button
                    type="button"
                    className="app-btn"
                    disabled={!lastFfmpegError}
                    onClick={() => {
                      if (!lastFfmpegError) {
                        return
                      }
                      void window.velorix.clipboard
                        .writeText(lastFfmpegError.detail)
                        .then((result) => {
                          onStatus(
                            result.ok
                              ? uiText('appSettingsFfmpegErrorCopied')
                              : uiText('appSettingsFfmpegErrorCopyFailed')
                          )
                        })
                    }}
                  >
                    {uiText('appSettingsFfmpegErrorCopy')}
                  </button>
                  <button
                    type="button"
                    className="app-btn"
                    disabled={!lastFfmpegError || !setLastFfmpegError}
                    onClick={() => {
                      setLastFfmpegError?.(null)
                    }}
                  >
                    {uiText('appSettingsFfmpegErrorClear')}
                  </button>
                </div>
              </section>
              {editorFfmpegBenchmark ? (
                <EditorFfmpegBenchmarkPanel
                  {...editorFfmpegBenchmark}
                  describedById={sectionHintId}
                />
              ) : null}
            </div>
          ) : null}

          {section === 'hotkeys' ? <AppSettingsHotkeysPane sectionHintId={sectionHintId} /> : null}

          {section === 'logs' ? (
            <AppSettingsLogsPane
              sectionHintId={sectionHintId}
              shellBusy={shellBusy}
              onStatus={onStatus}
              onOpenAbout={onOpenAbout}
              onClose={onClose}
            />
          ) : null}

          {section === 'reset' ? (
            <AppSettingsResetPane
              sectionHintId={sectionHintId}
              shellBusy={shellBusy}
              resetConfirm={resetConfirm}
              setResetConfirm={setResetConfirm}
              setResetBusy={setResetBusy}
              onStatus={onStatus}
              onClose={onClose}
            />
          ) : null}
        </section>
      </div>
    </div>
  )

  if (presentation === 'embedded') {
    return renderSettingsChrome(true)
  }

  return (
    <div
      className="app-modal-backdrop"
      role="presentation"
      onMouseDown={(e) => {
        if (shellBusy) {
          return
        }
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      {renderSettingsChrome(false)}
    </div>
  )
}

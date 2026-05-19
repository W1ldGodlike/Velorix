import {
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
import type { AppTheme } from '../../../../shared/settings-contract'
import type { EditorUrlPasteBehaviorId } from '../../../../shared/editor-url-paste-behavior'
import type { AppUiLocale } from '../../../../shared/app-ui-locale'
import type { EngineId } from '../../../../shared/engine-contract'
import type { EnginePathsDraft } from '../../app-engines-ui'
import { uiText } from '../../locales/ui-text'
import {
  AppSettingsDefaultsPane,
  AppSettingsGeneralPane,
  AppSettingsHotkeysPane,
  AppSettingsLogsPane,
  AppSettingsResetPane,
  SettingsDialogHeaderTitle
} from './app-settings-dialog-panes'
import {
  APP_SETTINGS_SECTION_HINT_KEYS as SECTION_HINT_KEYS,
  APP_SETTINGS_SECTION_LABEL_KEYS as SECTION_LABEL_KEYS
} from './app-settings-dialog-section-labels'
import { AppSettingsHwManualSmokePanel } from './AppSettingsHwManualSmokePanel'
import { AppSettingsOwnerSmokeBundlePanel } from './AppSettingsOwnerSmokeBundlePanel'
import { AppSettingsPackagedSmokePanel } from './AppSettingsPackagedSmokePanel'
import { EnginePathsSettingsSection } from './EnginePathsSettingsSection'

export type AppSettingsDialogProps = {
  open: boolean
  section: AppSettingsDialogSection
  onSectionChange: (section: AppSettingsDialogSection) => void
  onClose: () => void
  onStatus: (message: string) => void
  setTheme: Dispatch<SetStateAction<'dark' | 'light'>>
  onUiLocalePersisted: (locale: AppUiLocale) => void
  editorUrlPasteBehavior: EditorUrlPasteBehaviorId
  setEditorUrlPasteBehavior: Dispatch<SetStateAction<EditorUrlPasteBehaviorId>>
  setWorkspaceTab: Dispatch<SetStateAction<'editor' | 'downloads' | 'terminal'>>
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
}

export function AppSettingsDialog(props: AppSettingsDialogProps): JSX.Element | null {
  const {
    open,
    section,
    onSectionChange,
    onClose,
    onStatus,
    setTheme,
    onUiLocalePersisted,
    editorUrlPasteBehavior,
    setEditorUrlPasteBehavior,
    setWorkspaceTab,
    onOpenAbout,
    onOpenWorkflowPlanner,
    onOpenWorkflowScenarioBuilder,
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
    setResetBusy
  } = props

  const dialogHintId = useId()
  const sectionHintId = `${dialogHintId}-section`
  const [downloadsOutputPath, setDownloadsOutputPath] = useState<string | null>(null)
  const [batchOutputPath, setBatchOutputPath] = useState<string | null>(null)
  const [resetConfirm, setResetConfirm] = useState(false)
  const [themePref, setThemePref] = useState<AppTheme>('dark')
  const shellBusy = enginePathsSaving || resetBusy

  const onThemePrefChange = useMemo(
    () => (pref: AppTheme) => {
      void window.fluxalloy.settings.setTheme(pref).then((s) => {
        setThemePref(pref)
        setTheme(s.effectiveTheme)
      })
    },
    [setTheme]
  )

  useEffect(() => {
    if (!open) {
      return
    }
    void window.fluxalloy.settings.get().then((s) => {
      setThemePref(s.theme)
    })
    void window.fluxalloy.downloads.getOutputDirectory().then((dir) => {
      setDownloadsOutputPath(dir.path)
    })
    void window.fluxalloy.settings.get().then((s) => {
      const batch = s.ffmpegExportBatchOutputDirectory?.trim()
      setBatchOutputPath(batch && batch.length > 0 ? batch : null)
    })
  }, [open])

  useEffect(() => {
    if (!open || section !== 'dependencies') {
      return
    }
    void window.fluxalloy.settings.get().then((s) => {
      setEnginePathsDraft({
        ffmpeg: s.engineExecutablePaths?.ffmpeg ?? '',
        ffprobe: s.engineExecutablePaths?.ffprobe ?? '',
        'yt-dlp': s.engineExecutablePaths?.['yt-dlp'] ?? ''
      })
    })
  }, [open, section, setEnginePathsDraft])

  const sectionTitle = uiText(SECTION_LABEL_KEYS[section])

  const nav = useMemo(
    () =>
      APP_SETTINGS_DIALOG_SECTIONS.map((id) => ({
        id,
        label: uiText(SECTION_LABEL_KEYS[id]),
        selected: id === section
      })),
    [section]
  )

  if (!open) {
    return null
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
      <div
        className="app-modal app-modal-wide app-settings-dialog"
        role="dialog"
        aria-modal="true"
        aria-busy={shellBusy}
        aria-labelledby={`${dialogHintId}-title`}
        aria-describedby={dialogHintId}
        onMouseDown={(e) => {
          e.stopPropagation()
        }}
      >
        <div className="app-modal-header-row">
          <SettingsDialogHeaderTitle dialogHintId={dialogHintId} />
          <button
            type="button"
            className="app-btn"
            disabled={shellBusy}
            title={uiText('closeButton')}
            aria-label={uiText('appSettingsCloseAria')}
            onClick={onClose}
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
                themePref={themePref}
                onThemePrefChange={onThemePrefChange}
                onUiLocalePersisted={onUiLocalePersisted}
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
                <p className="app-modal-hint">{uiText('appSettingsTerminalHintsGuardHint')}</p>
                <AppSettingsOwnerSmokeBundlePanel
                  sectionHintId={sectionHintId}
                  settingsSection={section}
                  onSettingsSectionChange={onSectionChange}
                  {...(onOpenWorkflowPlanner ? { onOpenWorkflowPlanner } : {})}
                  {...(onOpenWorkflowScenarioBuilder ? { onOpenWorkflowScenarioBuilder } : {})}
                  {...(onOpenKnowledgeArticle ? { onOpenKnowledgeArticle } : {})}
                />
                <AppSettingsHwManualSmokePanel
                  sectionHintId={sectionHintId}
                  {...(onOpenKnowledgeArticle ? { onOpenKnowledgeArticle } : {})}
                />
                <AppSettingsPackagedSmokePanel
                  platform="win"
                  sectionHintId={sectionHintId}
                  {...(onOpenKnowledgeArticle ? { onOpenKnowledgeArticle } : {})}
                />
                <AppSettingsPackagedSmokePanel
                  platform="linux"
                  sectionHintId={sectionHintId}
                  {...(onOpenKnowledgeArticle ? { onOpenKnowledgeArticle } : {})}
                />
                <AppSettingsPackagedSmokePanel
                  platform="macos"
                  sectionHintId={sectionHintId}
                  {...(onOpenKnowledgeArticle ? { onOpenKnowledgeArticle } : {})}
                />
              </div>
            ) : null}

            {section === 'hotkeys' ? (
              <AppSettingsHotkeysPane sectionHintId={sectionHintId} />
            ) : null}

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
    </div>
  )
}

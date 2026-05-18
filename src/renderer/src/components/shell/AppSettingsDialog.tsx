import { useEffect, useId, useMemo, useState, type Dispatch, type JSX, type SetStateAction } from 'react'

import {
  APP_SETTINGS_DIALOG_SECTIONS,
  type AppSettingsDialogSection
} from '../../../../shared/app-settings-dialog-section'
import { APP_SETTINGS_HOTKEY_ROWS } from '../../../../shared/app-settings-hotkeys-catalog'
import type { AppTheme } from '../../../../shared/settings-contract'
import type { EditorUrlPasteBehaviorId } from '../../../../shared/editor-url-paste-behavior'
import type { AppUiLocale } from '../../../../shared/app-ui-locale'
import type { EngineId } from '../../../../shared/engine-contract'
import type { EnginePathsDraft } from '../../app-engines-ui'
import {
  getUiLocale,
  setUiLocaleForSession,
  syncDocumentUiLocale,
  uiText,
  uiTextVars
} from '../../locales/ui-text'
import type { UiTextKey } from '../../locales/ui-text-strings'
import { AppSettingsHidpiStatusPanel } from './AppSettingsHidpiStatusPanel'
import { AppSettingsHwManualSmokePanel } from './AppSettingsHwManualSmokePanel'
import { EnginePathsSettingsSection } from './EnginePathsSettingsSection'

const SECTION_HINT_KEYS: Record<AppSettingsDialogSection, UiTextKey> = {
  general: 'appSettingsSectionHintGeneral',
  defaults: 'appSettingsSectionHintDefaults',
  dependencies: 'appSettingsSectionHintDependencies',
  hotkeys: 'appSettingsSectionHintHotkeys',
  logs: 'appSettingsSectionHintLogs',
  reset: 'appSettingsSectionHintReset'
}

const SECTION_LABEL_KEYS: Record<AppSettingsDialogSection, UiTextKey> = {
  general: 'appSettingsSectionGeneral',
  defaults: 'appSettingsSectionDefaults',
  dependencies: 'appSettingsSectionDependencies',
  hotkeys: 'appSettingsSectionHotkeys',
  logs: 'appSettingsSectionLogs',
  reset: 'appSettingsSectionReset'
}

const HOTKEY_LABEL_KEYS: Record<(typeof APP_SETTINGS_HOTKEY_ROWS)[number]['id'], UiTextKey> = {
  openFile: 'appSettingsHotkeyOpenFile',
  openVideoFolder: 'appSettingsHotkeyOpenVideoFolder',
  downloadsManager: 'appSettingsHotkeyDownloadsManager',
  pasteUrlDownloads: 'appSettingsHotkeyPasteUrlDownloads',
  pasteUrlGlobal: 'appSettingsHotkeyPasteUrlGlobal'
}

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
                <AppSettingsHwManualSmokePanel sectionHintId={sectionHintId} />
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

function SettingsDialogHeaderTitle(props: { dialogHintId: string }): JSX.Element {
  return (
    <div>
      <h2 id={`${props.dialogHintId}-title`} className="app-modal-title">
        {uiText('appSettingsDialogTitle')}
      </h2>
      <p id={props.dialogHintId} className="app-modal-hint">
        {uiText('appSettingsDialogHint')}
      </p>
    </div>
  )
}

function AppSettingsGeneralPane(props: {
  sectionHintId: string
  shellBusy: boolean
  themePref: AppTheme
  onThemePrefChange: (pref: AppTheme) => void
  onUiLocalePersisted: (locale: AppUiLocale) => void
  editorUrlPasteBehavior: EditorUrlPasteBehaviorId
  setEditorUrlPasteBehavior: Dispatch<SetStateAction<EditorUrlPasteBehaviorId>>
}): JSX.Element {
  const {
    sectionHintId,
    shellBusy,
    themePref,
    onThemePrefChange,
    onUiLocalePersisted,
    editorUrlPasteBehavior,
    setEditorUrlPasteBehavior
  } = props
  const locale = getUiLocale()

  return (
    <div className="app-settings-stack" aria-describedby={sectionHintId}>
      <fieldset className="app-settings-fieldset" disabled={shellBusy}>
        <legend>{uiText('appSettingsThemeLegend')}</legend>
        {(['system', 'dark', 'light'] as const).map((pref) => (
          <label key={pref} className="app-settings-radio-row">
            <input
              type="radio"
              name="app-settings-theme"
              checked={themePref === pref}
              onChange={() => {
                onThemePrefChange(pref)
              }}
            />
            <span>
              {pref === 'system'
                ? uiText('appSettingsThemeSystem')
                : pref === 'dark'
                  ? uiText('appSettingsThemeDark')
                  : uiText('appSettingsThemeLight')}
            </span>
          </label>
        ))}
      </fieldset>

      <div className="app-settings-row">
        <span className="app-settings-row-label">{uiText('appSettingsUiLocaleLabel')}</span>
        <div className="app-settings-row-actions" role="group" aria-label={uiText('appSettingsUiLocaleLabel')}>
          {(['ru', 'en'] as const).map((loc) => (
            <button
              key={loc}
              type="button"
              className={`app-btn app-btn-compact${locale === loc ? ' app-btn-primary' : ''}`}
              disabled={shellBusy}
              aria-pressed={locale === loc}
              onClick={() => {
                if (locale === loc) {
                  return
                }
                void window.fluxalloy.settings.setUiLocale(loc).then(() => {
                  setUiLocaleForSession(loc)
                  syncDocumentUiLocale(loc)
                  onUiLocalePersisted(loc)
                })
              }}
            >
              {loc === 'ru' ? uiText('appSettingsUiLocaleRu') : uiText('appSettingsUiLocaleEn')}
            </button>
          ))}
        </div>
      </div>

      <label className="app-settings-row">
        <span className="app-settings-row-label">{uiText('editorUrlPasteBehaviorLabel')}</span>
        <select
          className="app-input app-settings-select"
          value={editorUrlPasteBehavior}
          disabled={shellBusy}
          aria-describedby={sectionHintId}
          onChange={(e) => {
            const v = e.target.value === 'download_open_editor' ? 'download_open_editor' : 'downloads_window'
            setEditorUrlPasteBehavior(v)
            void window.fluxalloy.settings.setEditorUrlPasteBehavior(v).catch(console.error)
          }}
        >
          <option value="downloads_window">{uiText('editorUrlPasteBehaviorDownloads')}</option>
          <option value="download_open_editor">{uiText('editorUrlPasteBehaviorOpenEditor')}</option>
        </select>
      </label>

      <AppSettingsHidpiStatusPanel sectionHintId={sectionHintId} />
    </div>
  )
}

function AppSettingsDefaultsPane(props: {
  sectionHintId: string
  shellBusy: boolean
  downloadsOutputPath: string | null
  batchOutputPath: string | null
  setDownloadsOutputPath: Dispatch<SetStateAction<string | null>>
  setBatchOutputPath: Dispatch<SetStateAction<string | null>>
  setWorkspaceTab: Dispatch<SetStateAction<'editor' | 'downloads' | 'terminal'>>
  onClose: () => void
}): JSX.Element {
  const {
    sectionHintId,
    shellBusy,
    downloadsOutputPath,
    batchOutputPath,
    setDownloadsOutputPath,
    setBatchOutputPath,
    setWorkspaceTab,
    onClose
  } = props

  return (
    <div className="app-settings-stack" aria-describedby={sectionHintId}>
      <AppSettingsPathRow
        label={uiText('appSettingsYtdlpOutputLabel')}
        path={downloadsOutputPath}
        shellBusy={shellBusy}
        browseTitle={uiText('appSettingsYtdlpOutputBrowse')}
        onBrowse={() => {
          void window.fluxalloy.downloads.pickOutputDirectory().then((res) => {
            if (res.ok) {
              setDownloadsOutputPath(res.path)
            }
          })
        }}
      />
      <AppSettingsPathRow
        label={uiText('appSettingsBatchOutputLabel')}
        path={batchOutputPath}
        shellBusy={shellBusy}
        browseTitle={uiText('appSettingsBatchOutputBrowse')}
        onBrowse={() => {
          void window.fluxalloy.batchExport.pickOutputFolder().then((res) => {
            if (res.ok) {
              setBatchOutputPath(res.path)
            }
          })
        }}
      />
      <button
        type="button"
        className="app-btn"
        disabled={shellBusy}
        onClick={() => {
          setWorkspaceTab('downloads')
          onClose()
        }}
      >
        {uiText('appSettingsOpenDownloadsTab')}
      </button>
    </div>
  )
}

function AppSettingsPathRow(props: {
  label: string
  path: string | null
  shellBusy: boolean
  browseTitle: string
  onBrowse: () => void
}): JSX.Element {
  const { label, path, shellBusy, browseTitle, onBrowse } = props
  return (
    <div className="app-settings-path-row">
      <span className="app-settings-row-label">{label}</span>
      <code className="app-settings-path-value">{path ?? uiText('appSettingsPathDefault')}</code>
      <button type="button" className="app-btn app-btn-compact" disabled={shellBusy} title={browseTitle} onClick={onBrowse}>
        {browseTitle}
      </button>
    </div>
  )
}

function AppSettingsHotkeysPane(props: { sectionHintId: string }): JSX.Element {
  return (
    <table className="app-settings-hotkeys-table" aria-describedby={props.sectionHintId}>
      <thead>
        <tr>
          <th scope="col">{uiText('appSettingsHotkeyActionColumn')}</th>
          <th scope="col">{uiText('appSettingsHotkeyAccelColumn')}</th>
        </tr>
      </thead>
      <tbody>
        {APP_SETTINGS_HOTKEY_ROWS.map((row) => (
          <tr key={row.id}>
            <td>{uiText(HOTKEY_LABEL_KEYS[row.id])}</td>
            <td>
              <kbd>{row.accel}</kbd>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function AppSettingsLogsPane(props: {
  sectionHintId: string
  shellBusy: boolean
  onStatus: (message: string) => void
  onOpenAbout: () => void
  onClose: () => void
}): JSX.Element {
  const { sectionHintId, shellBusy, onStatus, onOpenAbout, onClose } = props
  return (
    <div className="app-settings-actions" role="toolbar" aria-describedby={sectionHintId}>
      <button
        type="button"
        className="app-btn"
        disabled={shellBusy}
        title={uiText('aboutMainLogButton')}
        onClick={() => {
          void window.fluxalloy.diagnostics.openMainLog().then((r) => {
            if (!r.ok) {
              onStatus(r.error)
            }
          })
        }}
      >
        {uiText('aboutMainLogButton')}
      </button>
      <button
        type="button"
        className="app-btn"
        disabled={shellBusy}
        title={uiText('supportZipButton')}
        onClick={() => {
          void window.fluxalloy.diagnostics.createSupportZip().then((r) => {
            if (r.ok) {
              onStatus(uiText('supportZipSaved'))
            } else if (!('cancelled' in r && r.cancelled)) {
              onStatus('error' in r ? r.error : uiTextVars('statusErrorWithDetail', { detail: '…' }))
            }
          })
        }}
      >
        {uiText('supportZipButton')}
      </button>
      <button
        type="button"
        className="app-btn"
        disabled={shellBusy}
        onClick={() => {
          onClose()
          onOpenAbout()
        }}
      >
        {uiText('appSettingsOpenAbout')}
      </button>
    </div>
  )
}

function AppSettingsResetPane(props: {
  sectionHintId: string
  shellBusy: boolean
  resetConfirm: boolean
  setResetConfirm: Dispatch<SetStateAction<boolean>>
  setResetBusy: Dispatch<SetStateAction<boolean>>
  onStatus: (message: string) => void
  onClose: () => void
}): JSX.Element {
  const { sectionHintId, shellBusy, resetConfirm, setResetConfirm, setResetBusy, onStatus, onClose } =
    props

  return (
    <div className="app-settings-stack" aria-describedby={sectionHintId}>
      <div className="app-settings-actions" role="toolbar" aria-label={uiText('appSettingsBackupToolbarAria')}>
        <button
          type="button"
          className="app-btn"
          disabled={shellBusy}
          onClick={() => {
            void window.fluxalloy.settings.exportBackup().then((r) => {
              if (r.ok) {
                onStatus(uiText('appSettingsExportDone'))
              } else if (!('cancelled' in r && r.cancelled)) {
                onStatus('error' in r ? r.error : uiTextVars('statusErrorWithDetail', { detail: '…' }))
              }
            })
          }}
        >
          {uiText('appSettingsExportButton')}
        </button>
        <button
          type="button"
          className="app-btn"
          disabled={shellBusy}
          onClick={() => {
            void window.fluxalloy.settings.importBackup().then((r) => {
              if (r.ok) {
                onStatus(uiText('appSettingsImportDone'))
                onClose()
              } else if (!('cancelled' in r && r.cancelled)) {
                onStatus('error' in r ? r.error : uiTextVars('statusErrorWithDetail', { detail: '…' }))
              }
            })
          }}
        >
          {uiText('appSettingsImportButton')}
        </button>
      </div>

      <button
        type="button"
        className={`app-btn app-btn-danger${resetConfirm ? '' : ''}`}
        disabled={shellBusy}
        onClick={() => {
          if (!resetConfirm) {
            setResetConfirm(true)
            onStatus(uiText('appSettingsResetConfirmHint'))
            return
          }
          setResetBusy(true)
          void window.fluxalloy.settings
            .resetToDefaults()
            .then(() => {
              setResetConfirm(false)
              onStatus(uiText('appSettingsResetDone'))
              onClose()
            })
            .catch((err) => {
              onStatus(err instanceof Error ? err.message : uiTextVars('statusErrorWithDetail', { detail: '…' }))
            })
            .finally(() => {
              setResetBusy(false)
            })
        }}
      >
        {resetConfirm ? uiText('appSettingsResetConfirmButton') : uiText('appSettingsResetButton')}
      </button>
    </div>
  )
}

import type { Dispatch, JSX, SetStateAction } from 'react'

import { APP_SETTINGS_HOTKEY_ROWS } from '../../../../shared/app-settings-hotkeys-catalog'
import type { AppTheme } from '../../../../shared/settings-contract'
import type { EditorUrlPasteBehaviorId } from '../../../../shared/editor-url-paste-behavior'
import type { AppUiLocale } from '../../../../shared/app-ui-locale'
import {
  getUiLocale,
  setUiLocaleForSession,
  syncDocumentUiLocale,
  uiText,
  uiTextVars
} from '../../locales/ui-text'
import type { UiTextKey } from '../../locales/ui-text-strings'
import { AppSettingsHidpiStatusPanel } from './AppSettingsHidpiStatusPanel'
import { AppSettingsThemePanel } from './AppSettingsThemePanel'
import { WindowsExplorerContextMenuSettings } from './WindowsExplorerContextMenuSettings'

const HOTKEY_LABEL_KEYS: Record<(typeof APP_SETTINGS_HOTKEY_ROWS)[number]['id'], UiTextKey> = {
  openFile: 'appSettingsHotkeyOpenFile',
  openVideoFolder: 'appSettingsHotkeyOpenVideoFolder',
  downloadsManager: 'appSettingsHotkeyDownloadsManager',
  pasteUrlDownloads: 'appSettingsHotkeyPasteUrlDownloads',
  pasteUrlGlobal: 'appSettingsHotkeyPasteUrlGlobal'
}
export function SettingsDialogHeaderTitle(props: { dialogHintId: string }): JSX.Element {
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

export function AppSettingsGeneralPane(props: {
  sectionHintId: string
  shellBusy: boolean
  themePref: AppTheme
  onThemePrefChange: (pref: AppTheme) => void
  onUiLocalePersisted: (locale: AppUiLocale) => void
  editorUrlPasteBehavior: EditorUrlPasteBehaviorId
  setEditorUrlPasteBehavior: Dispatch<SetStateAction<EditorUrlPasteBehaviorId>>
  onOpenKnowledgeArticle?: (slug: string) => void
  onStatus: (message: string) => void
}): JSX.Element {
  const {
    sectionHintId,
    shellBusy,
    themePref,
    onThemePrefChange,
    onUiLocalePersisted,
    editorUrlPasteBehavior,
    setEditorUrlPasteBehavior,
    onOpenKnowledgeArticle,
    onStatus
  } = props
  const locale = getUiLocale()

  return (
    <div className="app-settings-stack" aria-describedby={sectionHintId}>
      <AppSettingsThemePanel
        sectionHintId={sectionHintId}
        shellBusy={shellBusy}
        themePref={themePref}
        onThemePrefChange={onThemePrefChange}
        {...(onOpenKnowledgeArticle ? { onOpenKnowledgeArticle } : {})}
      />

      <div className="app-settings-row">
        <span className="app-settings-row-label">{uiText('appSettingsUiLocaleLabel')}</span>
        <div
          className="app-settings-row-actions"
          role="group"
          aria-label={uiText('appSettingsUiLocaleLabel')}
        >
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
            const v =
              e.target.value === 'download_open_editor'
                ? 'download_open_editor'
                : 'downloads_window'
            setEditorUrlPasteBehavior(v)
            void window.fluxalloy.settings.setEditorUrlPasteBehavior(v).catch(console.error)
          }}
        >
          <option value="downloads_window">{uiText('editorUrlPasteBehaviorDownloads')}</option>
          <option value="download_open_editor">{uiText('editorUrlPasteBehaviorOpenEditor')}</option>
        </select>
      </label>

      <WindowsExplorerContextMenuSettings
        sectionHintId={sectionHintId}
        shellBusy={shellBusy}
        onStatus={onStatus}
        {...(onOpenKnowledgeArticle ? { onOpenKnowledgeArticle } : {})}
      />

      <AppSettingsHidpiStatusPanel
        sectionHintId={sectionHintId}
        {...(onOpenKnowledgeArticle ? { onOpenKnowledgeArticle } : {})}
      />
    </div>
  )
}

export function AppSettingsDefaultsPane(props: {
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

export function AppSettingsPathRow(props: {
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
      <button
        type="button"
        className="app-btn app-btn-compact"
        disabled={shellBusy}
        title={browseTitle}
        onClick={onBrowse}
      >
        {browseTitle}
      </button>
    </div>
  )
}

export function AppSettingsHotkeysPane(props: { sectionHintId: string }): JSX.Element {
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

export function AppSettingsLogsPane(props: {
  sectionHintId: string
  shellBusy: boolean
  onStatus: (message: string) => void
  onOpenAbout: () => void
  onClose: () => void
}): JSX.Element {
  const { sectionHintId, shellBusy, onStatus, onOpenAbout, onClose } = props
  const supportZipHintId = `${sectionHintId}-support-zip`
  return (
    <div className="app-settings-actions" role="toolbar" aria-describedby={sectionHintId}>
      <p id={supportZipHintId} className="app-visually-hidden">
        {uiText('aboutSupportZipDiagnosticsSectionsHint')}
      </p>
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
        aria-describedby={supportZipHintId}
        title={uiText('supportZipButton')}
        onClick={() => {
          void window.fluxalloy.diagnostics.createSupportZip().then((r) => {
            if (r.ok) {
              onStatus(uiText('supportZipSaved'))
            } else if (!('cancelled' in r && r.cancelled)) {
              onStatus(
                'error' in r
                  ? r.error
                  : uiTextVars('statusErrorWithDetail', {
                      detail: uiText('statusErrorDetailFallback')
                    })
              )
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

export function AppSettingsResetPane(props: {
  sectionHintId: string
  shellBusy: boolean
  resetConfirm: boolean
  setResetConfirm: Dispatch<SetStateAction<boolean>>
  setResetBusy: Dispatch<SetStateAction<boolean>>
  onStatus: (message: string) => void
  onClose: () => void
}): JSX.Element {
  const {
    sectionHintId,
    shellBusy,
    resetConfirm,
    setResetConfirm,
    setResetBusy,
    onStatus,
    onClose
  } = props

  return (
    <div className="app-settings-stack" aria-describedby={sectionHintId}>
      <div
        className="app-settings-actions"
        role="toolbar"
        aria-label={uiText('appSettingsBackupToolbarAria')}
      >
        <button
          type="button"
          className="app-btn"
          disabled={shellBusy}
          onClick={() => {
            void window.fluxalloy.settings.exportBackup().then((r) => {
              if (r.ok) {
                onStatus(uiText('appSettingsExportDone'))
              } else if (!('cancelled' in r && r.cancelled)) {
                onStatus(
                  'error' in r
                    ? r.error
                    : uiTextVars('statusErrorWithDetail', {
                        detail: uiText('statusErrorDetailFallback')
                      })
                )
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
                onStatus(
                  'error' in r
                    ? r.error
                    : uiTextVars('statusErrorWithDetail', {
                        detail: uiText('statusErrorDetailFallback')
                      })
                )
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
              onStatus(
                err instanceof Error
                  ? err.message
                  : uiTextVars('statusErrorWithDetail', {
                      detail: uiText('statusErrorDetailFallback')
                    })
              )
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

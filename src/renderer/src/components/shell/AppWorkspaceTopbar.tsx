import type { Dispatch, JSX, SetStateAction } from 'react'

import type { ResolvedAppTheme } from '../../../../shared/settings-contract'
import {
  IconBan,
  IconBook,
  IconCircleHelp,
  IconCloudDownload,
  IconDownload,
  IconFilm,
  IconFolder,
  IconFolderOpen,
  IconMoon,
  IconSettings,
  IconSun,
  IconWorkspaceEditor,
  IconWorkspaceTerminal
} from '../LucideMiniIcons'
import type { WorkspaceTab } from '../../app-terminal-hint-ui'
import type { EngineSummary } from '../../app-engines-ui'
import { getUiLocale, uiText } from '../../locales/ui-text'

export type AppWorkspaceTopbarProps = {
  appChromeBusy: boolean
  workspaceTab: WorkspaceTab
  setWorkspaceTab: Dispatch<SetStateAction<WorkspaceTab>>
  engineDownloadBusy: boolean
  engineSummary: EngineSummary
  previewPath: string | undefined
  exportBusy: boolean
  exportCancelBusy: boolean
  enginesOfferDownload: boolean
  theme: ResolvedAppTheme
  onOpenVideoFolder: () => void
  onOpenFile: () => void
  onCancelExport: () => void
  onEnginesDownload: () => void
  onOpenEnginePaths: () => void
  onOpenKnowledge: () => void
  onOpenAbout: () => void
  onUiLocaleToggle: () => void
  onToggleTheme: () => void
}

export function AppWorkspaceTopbar(props: AppWorkspaceTopbarProps): JSX.Element {
  const {
    appChromeBusy,
    workspaceTab,
    setWorkspaceTab,
    engineDownloadBusy,
    engineSummary,
    previewPath,
    exportBusy,
    exportCancelBusy,
    enginesOfferDownload,
    theme,
    onOpenVideoFolder,
    onOpenFile,
    onCancelExport,
    onEnginesDownload,
    onOpenEnginePaths,
    onOpenKnowledge,
    onOpenAbout,
    onUiLocaleToggle,
    onToggleTheme
  } = props

  return (
    <header
      className="app-topbar"
      aria-label={uiText('topbarHeaderAria')}
      aria-busy={appChromeBusy}
    >
      <div
        className="app-topbar-brand"
        aria-label={uiText('topbarProductName')}
        aria-busy={engineDownloadBusy || engineSummary === 'checking'}
      >
        <span className="app-topbar-mark" aria-hidden>
          ◇
        </span>
        <span className="app-topbar-title">{uiText('topbarProductName')}</span>
      </div>
      <nav
        className="app-workspace-tabs"
        aria-label={uiText('workspaceTabsAria')}
        role="tablist"
        aria-orientation="horizontal"
        aria-busy={appChromeBusy}
      >
        <button
          type="button"
          id="workspace-tab-editor"
          className={`app-workspace-tab${workspaceTab === 'editor' ? ' app-workspace-tab-active' : ''}`}
          role="tab"
          aria-selected={workspaceTab === 'editor'}
          aria-controls="workspace-panel-editor"
          aria-describedby="workspace-tab-editor-desc"
          title={uiText('workspaceTabEditorTooltip')}
          onClick={() => {
            setWorkspaceTab('editor')
          }}
        >
          <span aria-hidden className="app-workspace-tab-glyph">
            <IconWorkspaceEditor title="" size={16} />
          </span>
          {uiText('workspaceTabEditor')}
          <span id="workspace-tab-editor-desc" className="app-visually-hidden">
            {uiText('editorWorkbenchAria')}
          </span>
        </button>
        <button
          type="button"
          id="workspace-tab-downloads"
          className={`app-workspace-tab${workspaceTab === 'downloads' ? ' app-workspace-tab-active' : ''}`}
          role="tab"
          aria-selected={workspaceTab === 'downloads'}
          aria-controls="workspace-panel-downloads"
          aria-describedby="workspace-tab-downloads-desc"
          onClick={() => {
            setWorkspaceTab('downloads')
          }}
          title={uiText('workspaceTabDownloadsTooltip')}
        >
          <span aria-hidden className="app-workspace-tab-glyph">
            <IconDownload title="" size={16} />
          </span>
          {uiText('workspaceTabDownloads')}
          <span id="workspace-tab-downloads-desc" className="app-visually-hidden">
            {uiText('downloadsWorkbenchAria')}
          </span>
        </button>
        <button
          type="button"
          id="workspace-tab-terminal"
          className={`app-workspace-tab${workspaceTab === 'terminal' ? ' app-workspace-tab-active' : ''}`}
          role="tab"
          aria-selected={workspaceTab === 'terminal'}
          aria-controls="workspace-panel-terminal"
          aria-describedby="workspace-tab-terminal-desc"
          onClick={() => {
            setWorkspaceTab('terminal')
          }}
          title={uiText('workspaceTabTerminalTooltip')}
        >
          <span aria-hidden className="app-workspace-tab-glyph">
            <IconWorkspaceTerminal title="" size={16} />
          </span>
          {uiText('workspaceTabTerminal')}
          <span id="workspace-tab-terminal-desc" className="app-visually-hidden">
            {uiText('terminalWorkbenchAria')}
          </span>
        </button>
      </nav>
      <div
        className="app-topbar-trailing"
        role="group"
        aria-label={uiText('topbarTrailingGroupAria')}
        aria-busy={appChromeBusy}
      >
        <div
          className="app-topbar-actions"
          role="toolbar"
          aria-orientation="horizontal"
          aria-label={uiText('topbarActionsToolbarAria')}
          aria-busy={appChromeBusy}
        >
          <button
            type="button"
            className="app-icon-btn"
            onClick={() => {
              onOpenVideoFolder()
            }}
            title={uiText('topbarOpenVideoFolderTitle')}
          >
            <IconFolder />
            <span className="app-visually-hidden">{uiText('topbarOpenVideoFolderLabel')}</span>
          </button>
          <button
            type="button"
            className="app-icon-btn"
            onClick={() => {
              onOpenFile()
            }}
            title={uiText('topbarOpenFileTitle')}
          >
            <IconFolderOpen />
            <span className="app-visually-hidden">{uiText('topbarOpenFileLabel')}</span>
          </button>
          <button
            type="button"
            className="app-icon-btn"
            onClick={() => {
              void window.fluxalloy.inspector.openWindow(previewPath ?? null)
            }}
            title={uiText('topbarInspectorTitle')}
          >
            <IconFilm />
            <span className="app-visually-hidden">{uiText('topbarInspectorLabel')}</span>
          </button>
          {exportBusy ? (
            <button
              type="button"
              className="app-icon-btn app-icon-btn-warn"
              disabled={exportCancelBusy}
              aria-label={
                exportCancelBusy
                  ? uiText('topbarExportCancelBusy')
                  : uiText('topbarExportCancelReady')
              }
              onClick={() => {
                onCancelExport()
              }}
              title={uiText('topbarExportCancelTitle')}
            >
              <IconBan
                title={
                  exportCancelBusy
                    ? uiText('topbarExportCancelBusy')
                    : uiText('topbarExportCancelReady')
                }
              />
            </button>
          ) : null}
          {enginesOfferDownload ? (
            <button
              type="button"
              className="app-icon-btn app-icon-btn-warn"
              disabled={engineDownloadBusy}
              aria-label={
                engineDownloadBusy
                  ? uiText('topbarEnginesDownloadBusy')
                  : uiText('topbarEnginesDownloadReady')
              }
              onClick={() => {
                onEnginesDownload()
              }}
              title={uiText('topbarEnginesDownloadTitle')}
            >
              <IconCloudDownload
                title={
                  engineDownloadBusy
                    ? uiText('topbarEnginesDownloadBusy')
                    : uiText('topbarEnginesDownloadReady')
                }
              />
            </button>
          ) : null}
          <button
            type="button"
            className="app-icon-btn"
            onClick={() => {
              onOpenEnginePaths()
            }}
            title={uiText('topbarEnginePathsTitle')}
          >
            <IconSettings />
            <span className="app-visually-hidden">{uiText('topbarEnginePathsLabel')}</span>
          </button>
          <button
            type="button"
            className="app-icon-btn"
            onClick={() => {
              onOpenKnowledge()
            }}
            title={uiText('knowledgeTopbarTooltip')}
          >
            <IconBook />
            <span className="app-visually-hidden">{uiText('topbarKnowledgeLabel')}</span>
          </button>
          <button
            type="button"
            className="app-icon-btn"
            onClick={() => {
              onOpenAbout()
            }}
            title={uiText('topbarAboutTitle')}
          >
            <IconCircleHelp />
            <span className="app-visually-hidden">{uiText('topbarAboutLabel')}</span>
          </button>
          <button
            type="button"
            className="app-icon-btn app-locale-badge"
            onClick={onUiLocaleToggle}
            title={
              getUiLocale() === 'ru'
                ? uiText('topbarUiLocaleSwitchToEnglishTitle')
                : uiText('topbarUiLocaleSwitchToRussianTitle')
            }
          >
            <span aria-hidden>{getUiLocale() === 'ru' ? 'RU' : 'EN'}</span>
            <span className="app-visually-hidden">
              {getUiLocale() === 'ru'
                ? uiText('topbarUiLocaleVisuallyHiddenRu')
                : uiText('topbarUiLocaleVisuallyHiddenEn')}
            </span>
          </button>
          <button
            type="button"
            className="app-icon-btn"
            onClick={onToggleTheme}
            title={uiText('topbarThemeToggleTitle')}
          >
            {theme === 'dark' ? <IconSun /> : <IconMoon />}
            <span className="app-visually-hidden">
              {theme === 'dark' ? uiText('topbarThemeUseLight') : uiText('topbarThemeUseDark')}
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}

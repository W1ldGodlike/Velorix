import type { Dispatch, JSX, SetStateAction } from 'react'

import {
  IconBan,
  IconBook,
  IconCircleHelp,
  IconCloudDownload,
  IconFilm,
  IconFolder,
  IconFolderOpen,
  IconImage,
  IconSettings
} from '../LucideMiniIcons'
import { type WorkspaceTab, workspaceTabDescId } from '../../app-terminal-hint-ui'
import type { EngineSummary } from '../../app-engines-ui'
import { formatStatusbarLocaleShort } from '../../statusbar-locale-display'
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
  onOpenVideoFolder: () => void
  onOpenFile: () => void
  onCancelExport: () => void
  onExtractFrames: () => Promise<void>
  onEnginesDownload: () => void
  onOpenAppSettings: () => void
  onOpenKnowledge: () => void
  onOpenAbout: () => void
  onUiLocaleToggle: () => void
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
    onOpenVideoFolder,
    onOpenFile,
    onCancelExport,
    onExtractFrames,
    onEnginesDownload,
    onOpenAppSettings,
    onOpenKnowledge,
    onOpenAbout,
    onUiLocaleToggle
  } = props

  const currentWorkspaceTabDescId = workspaceTabDescId(workspaceTab)

  return (
    <header
      className="app-topbar app-neon-topbar"
      aria-label={uiText('topbarHeaderAria')}
      aria-describedby={currentWorkspaceTabDescId}
      aria-busy={appChromeBusy}
    >
      <div
        className="app-topbar-brand"
        aria-label={uiText('topbarProductName')}
        aria-describedby={currentWorkspaceTabDescId}
        aria-busy={engineDownloadBusy || engineSummary === 'checking'}
      >
        <span className="app-topbar-mark" aria-hidden>
          ◇
        </span>
        <span className="app-topbar-title">{uiText('topbarProductName')}</span>
      </div>
      <div
        className="app-topbar-trailing"
        role="group"
        aria-label={uiText('topbarTrailingGroupAria')}
        aria-describedby={currentWorkspaceTabDescId}
        aria-busy={appChromeBusy}
      >
        <div
          className="app-topbar-actions"
          role="toolbar"
          aria-orientation="horizontal"
          aria-label={uiText('topbarActionsToolbarAria')}
          aria-describedby={currentWorkspaceTabDescId}
          aria-busy={appChromeBusy}
        >
          <button
            type="button"
            className="app-icon-btn"
            aria-describedby={currentWorkspaceTabDescId}
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
            aria-describedby={currentWorkspaceTabDescId}
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
            aria-describedby={currentWorkspaceTabDescId}
            disabled={!previewPath || exportBusy}
            onClick={() => {
              void onExtractFrames()
            }}
            title={uiText('topbarExtractFramesTitle')}
          >
            <IconImage title="" size={16} />
            <span className="app-visually-hidden">{uiText('topbarExtractFramesLabel')}</span>
          </button>
          <button
            type="button"
            className="app-icon-btn"
            aria-describedby={currentWorkspaceTabDescId}
            onClick={() => {
              setWorkspaceTab('inspector')
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
              aria-describedby={currentWorkspaceTabDescId}
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
              aria-describedby={currentWorkspaceTabDescId}
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
            aria-describedby={currentWorkspaceTabDescId}
            onClick={() => {
              onOpenAppSettings()
            }}
            title={uiText('topbarOpenSettingsTitle')}
          >
            <IconSettings />
            <span className="app-visually-hidden">{uiText('topbarOpenSettingsLabel')}</span>
          </button>
          <button
            type="button"
            className="app-icon-btn"
            aria-describedby={currentWorkspaceTabDescId}
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
            aria-describedby={currentWorkspaceTabDescId}
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
            aria-describedby={currentWorkspaceTabDescId}
            onClick={onUiLocaleToggle}
            title={
              getUiLocale() === 'ru'
                ? uiText('topbarUiLocaleSwitchToEnglishTitle')
                : uiText('topbarUiLocaleSwitchToRussianTitle')
            }
          >
            <span aria-hidden>{formatStatusbarLocaleShort(getUiLocale())}</span>
            <span className="app-visually-hidden">
              {getUiLocale() === 'ru'
                ? uiText('topbarUiLocaleVisuallyHiddenRu')
                : uiText('topbarUiLocaleVisuallyHiddenEn')}
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}

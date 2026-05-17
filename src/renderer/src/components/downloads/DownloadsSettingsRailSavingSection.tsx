import { uiText } from '../../locales/ui-text'
import { IconFolderOpen, IconHome, IconQueuePlus } from '../LucideMiniIcons'
import type { DownloadsSettingsRailProps } from './downloads-settings-rail-props'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- JSX section
export function DownloadsSettingsRailSavingSection(props: DownloadsSettingsRailProps) {
  const {
    downloadsOptionsBusy,
    downloadsHistoryBusy,
    downloadsOptions,
    setDownloadsOptions,
    downloadsRailPanels,
    onRailSectionToggle,
    applyDownloadsOptionsPatch,
    downloadsOutputDirectory,
    setDownloadsOutputDirectory,
    refreshDownloadsOutputDirectory,
    setStatusHint
  } = props
  const handleDownloadsRailSectionToggle = onRailSectionToggle
  if (!downloadsOptions) {
    return null
  }
  return (
    <details
      className="app-downloads-rail-section"
      aria-label={uiText('downloadsRailSavingSummary')}
      aria-describedby="downloads-page-hint"
      aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
      open={downloadsRailPanels.saving}
      onToggle={handleDownloadsRailSectionToggle('saving')}
    >
      <summary
        className="app-downloads-rail-summary"
        title={uiText('downloadsTooltipSectionSaving')}
        aria-describedby="downloads-page-hint"
      >
        {uiText('downloadsRailSavingSummary')}
      </summary>
      <div className="app-downloads-rail-section-body">
        <div
          className="app-downloads-output-dir"
          role="group"
          aria-label={uiText('downloadsOutputDirAria')}
          aria-describedby="downloads-page-hint"
          aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
        >
          <span className="app-field-help">{uiText('downloadsOutputDirLabel')}</span>
          <strong title={downloadsOutputDirectory?.path ?? ''}>
            {downloadsOutputDirectory?.path ?? uiText('downloadsOutputPathLoading')}
          </strong>
          <span className="app-field-help">
            {downloadsOutputDirectory?.isDefault
              ? uiText('downloadsOutputUseDefaultUserdata')
              : uiText('downloadsOutputUseCustom')}
          </span>
          <div
            className="app-downloads-history-actions"
            role="toolbar"
            aria-orientation="horizontal"
            aria-label={uiText('downloadsOutputDirActionsToolbarAria')}
            aria-describedby="downloads-page-hint"
            aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
          >
            <button
              type="button"
              className="app-btn app-btn-compact app-btn-icon-leading"
              aria-describedby="downloads-page-hint"
              title={uiText('downloadsTooltipOutputOpenFolder')}
              onClick={() => {
                void window.fluxalloy.downloads.openOutputDirectory().then((res) => {
                  if (!res.ok) {
                    setStatusHint(res.error)
                  }
                })
              }}
            >
              <IconFolderOpen title="" size={14} />
              {uiText('downloadsRailOpenFolder')}
            </button>
            <button
              type="button"
              className="app-btn app-btn-compact app-btn-icon-leading"
              aria-describedby="downloads-page-hint"
              title={uiText('downloadsTooltipOutputPick')}
              onClick={() => {
                void window.fluxalloy.downloads.pickOutputDirectory().then((res) => {
                  if (res.ok) {
                    setDownloadsOutputDirectory({ path: res.path, isDefault: false })
                    return
                  }
                  if ('error' in res) {
                    setStatusHint(res.error)
                  }
                })
              }}
            >
              <IconQueuePlus title="" size={14} />
              {uiText('downloadsRailPick')}
            </button>
            <button
              type="button"
              className="app-btn app-btn-compact app-btn-icon-leading"
              aria-describedby="downloads-page-hint"
              title={uiText('downloadsTooltipOutputDefault')}
              onClick={() => {
                void window.fluxalloy.downloads.clearOutputDirectory().then((res) => {
                  if (!res.ok) {
                    setStatusHint(res.error)
                    return
                  }
                  void refreshDownloadsOutputDirectory()
                })
              }}
            >
              <IconHome title="" size={14} />
              {uiText('downloadsOutputDefaultButton')}
            </button>
          </div>
        </div>
        <label className="app-field" title={uiText('downloadsTooltipFilenameTemplate')}>
          <span>{uiText('downloadsFilenameTemplateLabel')}</span>
          <input
            className="app-control app-downloads-template-input"
            title={uiText('downloadsTooltipFilenameTemplate')}
            value={downloadsOptions.filenameTemplate}
            disabled={downloadsOptionsBusy}
            spellCheck={false}
            onChange={(e) => {
              setDownloadsOptions({
                ...downloadsOptions,
                filenameTemplate: e.target.value
              })
            }}
            onBlur={(e) => {
              void applyDownloadsOptionsPatch({ filenameTemplate: e.target.value })
            }}
          />
          <span className="app-field-help">{uiText('downloadsFilenameTemplateHelp')}</span>
        </label>
      </div>
    </details>
  )
}

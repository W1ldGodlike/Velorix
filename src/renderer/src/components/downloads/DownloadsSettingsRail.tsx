import { forwardRef, type Dispatch, type SetStateAction, type SyntheticEvent } from 'react'

import {
  YTDLP_DOC_FORMAT_SELECTION,
  YTDLP_DOC_OUTPUT_TEMPLATE,
  YTDLP_DOC_POSTPROCESS,
  YTDLP_DOC_README
} from '../../../../shared/external-doc-urls'
import type {
  YtdlpCookiesBrowserId,
  YtdlpDownloadOptionsPatch,
  YtdlpDownloadOptionsPayload,
  YtdlpFormatPresetId,
  YtdlpImpersonateId,
  YtdlpQueueRetryProfileId,
  YtdlpSubtitlePresetId
} from '../../../../shared/ytdlp-download-contract'
import { groupYtdlpCommandHintsByCategory } from '../../../../shared/ytdlp-command-hints-group'
import { downloadsCatalogHintTokenAccessibleDescription } from '../../app-terminal-hint-ui'
import { uiText } from '../../locales/ui-text'
import { PillSwitch } from '../PillSwitch'
import {
  IconHome,
  IconQueueFile,
  IconQueuePlus,
  IconQueueX,
  IconRefreshCw,
  IconFolderOpen
} from '../LucideMiniIcons'
import type {
  DownloadsRailPanelKey,
  DownloadsRailPanelsState
} from '../../use-downloads-window-ui-panels'

export type DownloadsSettingsRailProps = {
  downloadsOptionsBusy: boolean
  downloadsHistoryBusy: boolean
  downloadsOptions: YtdlpDownloadOptionsPayload | null
  setDownloadsOptions: Dispatch<SetStateAction<YtdlpDownloadOptionsPayload | null>>
  downloadsRailPanels: DownloadsRailPanelsState
  onRailSectionToggle: (
    key: DownloadsRailPanelKey
  ) => (e: SyntheticEvent<HTMLDetailsElement>) => void
  applyDownloadsOptionsPatch: (patch: YtdlpDownloadOptionsPatch) => Promise<void>
  downloadsOutputDirectory: { path: string; isDefault: boolean } | null
  setDownloadsOutputDirectory: Dispatch<SetStateAction<{ path: string; isDefault: boolean } | null>>
  refreshDownloadsOutputDirectory: () => Promise<void>
  setStatusHint: (hint: string | null) => void
  downloadsExpertHintFilter: string
  setDownloadsExpertHintFilter: (next: string) => void
  ytdlpCommandHintsFilteredByCategory: ReturnType<typeof groupYtdlpCommandHintsByCategory>
  appendDownloadsExtraArgsToken: (token: string) => void
  refreshDownloadsOptions: () => Promise<void>
}

export const DownloadsSettingsRail = forwardRef<HTMLElement, DownloadsSettingsRailProps>(
  function DownloadsSettingsRail(props, ref) {
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
      setStatusHint,
      downloadsExpertHintFilter,
      setDownloadsExpertHintFilter,
      ytdlpCommandHintsFilteredByCategory,
      appendDownloadsExtraArgsToken,
      refreshDownloadsOptions
    } = props

    const handleDownloadsRailSectionToggle = onRailSectionToggle

    return (
      <aside
        ref={ref}
        id="downloads-ytdlp-settings-rail"
        className="app-downloads-rail"
        aria-label={uiText('downloadsRailAria')}
        aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
      >
        <h3 className="app-settings-title">{uiText('downloadsRailTitle')}</h3>
        <p className="app-settings-subtitle" title={uiText('downloadsRailIntroTooltip')}>
          {uiText('downloadsRailSubtitle')}
        </p>
        {downloadsOptions ? (
          <div
            className="app-downloads-settings-stack"
            role="region"
            aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
            aria-label={uiText('downloadsSettingsSectionsStackAria')}
          >
            <details
              className="app-downloads-rail-section"
              aria-label={uiText('downloadsRailFormatSummary')}
              aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
              open={downloadsRailPanels.format}
              onToggle={handleDownloadsRailSectionToggle('format')}
            >
              <summary
                className="app-downloads-rail-summary"
                title={uiText('downloadsTooltipSectionFormat')}
              >
                {uiText('downloadsRailFormatSummary')}
              </summary>
              <div className="app-downloads-rail-section-body">
                <label className="app-field" title={uiText('downloadsTooltipFormatPresetSelect')}>
                  <span>{uiText('downloadsRailFormatQualityLabel')}</span>
                  <select
                    className="app-control"
                    title={uiText('downloadsTooltipFormatPresetSelect')}
                    value={downloadsOptions.formatPreset}
                    disabled={downloadsOptionsBusy || downloadsOptions.audioOnly}
                    aria-describedby="downloadsFormatHint"
                    onChange={(e) => {
                      void applyDownloadsOptionsPatch({
                        formatPreset: e.target.value as YtdlpFormatPresetId
                      })
                    }}
                  >
                    {downloadsOptions.formatPresetChoices.map((choice) => (
                      <option key={choice.id} value={choice.id}>
                        {choice.label}
                      </option>
                    ))}
                  </select>
                  <span id="downloadsFormatHint" className="app-field-help">
                    {uiText('downloadsFormatHint')}
                  </span>
                </label>
                <div className="app-downloads-switch-grid">
                  <div className="app-field app-field-switch">
                    <span>{uiText('downloadsPlaylistSpan')}</span>
                    <PillSwitch
                      label={uiText('downloadsPlaylistPillLabel')}
                      tooltip={uiText('downloadsTooltipPlaylistSwitch')}
                      checked={downloadsOptions.downloadPlaylist}
                      describedBy="downloadsPlaylistHint"
                      disabled={downloadsOptionsBusy}
                      onToggle={() => {
                        void applyDownloadsOptionsPatch({
                          downloadPlaylist: !downloadsOptions.downloadPlaylist
                        })
                      }}
                    />
                    <span id="downloadsPlaylistHint" className="app-field-help">
                      {uiText('downloadsPlaylistHint')}
                    </span>
                  </div>
                  <div className="app-field app-field-switch">
                    <span>{uiText('downloadsAudioOnlySpan')}</span>
                    <PillSwitch
                      label={uiText('downloadsAudioOnlyPillLabel')}
                      tooltip={uiText('downloadsTooltipAudioOnlySwitch')}
                      checked={downloadsOptions.audioOnly}
                      describedBy="downloadsAudioOnlyHint"
                      disabled={downloadsOptionsBusy}
                      onToggle={() => {
                        void applyDownloadsOptionsPatch({
                          audioOnly: !downloadsOptions.audioOnly
                        })
                      }}
                    />
                    <span id="downloadsAudioOnlyHint" className="app-field-help">
                      {uiText('downloadsAudioOnlyHint')}
                    </span>
                  </div>
                </div>
                <label className="app-field" title={uiText('downloadsTooltipSubtitlesSelect')}>
                  <span>{uiText('downloadsSubtitlesLabel')}</span>
                  <select
                    className="app-control"
                    title={uiText('downloadsTooltipSubtitlesSelect')}
                    value={downloadsOptions.subtitlePreset}
                    disabled={downloadsOptionsBusy}
                    onChange={(e) => {
                      void applyDownloadsOptionsPatch({
                        subtitlePreset: e.target.value as YtdlpSubtitlePresetId
                      })
                    }}
                  >
                    <option value="none">{uiText('downloadsSubPresetNone')}</option>
                    <option value="manual">{uiText('downloadsSubPresetManual')}</option>
                    <option value="manual_auto">{uiText('downloadsSubPresetManualAuto')}</option>
                  </select>
                  <span className="app-field-help">{uiText('downloadsSubLangsHelp')}</span>
                </label>
                <label className="app-field" title={uiText('downloadsTooltipSubLangsInput')}>
                  <span>{uiText('downloadsSubLangsLabel')}</span>
                  <input
                    className="app-control app-downloads-template-input"
                    title={uiText('downloadsTooltipSubLangsInput')}
                    value={downloadsOptions.subLangsLine}
                    disabled={downloadsOptionsBusy || downloadsOptions.subtitlePreset === 'none'}
                    spellCheck={false}
                    placeholder={uiText('downloadsSubLangsPlaceholder')}
                    onChange={(e) => {
                      setDownloadsOptions({
                        ...downloadsOptions,
                        subLangsLine: e.target.value
                      })
                    }}
                    onBlur={(e) => {
                      void applyDownloadsOptionsPatch({ subLangs: e.target.value })
                    }}
                  />
                </label>
              </div>
            </details>
            <details
              className="app-downloads-rail-section"
              aria-label={uiText('downloadsRailMetadataSummary')}
              aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
              open={downloadsRailPanels.metadata}
              onToggle={handleDownloadsRailSectionToggle('metadata')}
            >
              <summary
                className="app-downloads-rail-summary"
                title={uiText('downloadsTooltipSectionMetadata')}
              >
                {uiText('downloadsRailMetadataSummary')}
              </summary>
              <div className="app-downloads-rail-section-body">
                <div className="app-field app-field-switch">
                  <span>{uiText('downloadsOpenAfterSuccessSpan')}</span>
                  <PillSwitch
                    label={uiText('downloadsOpenAfterSuccessPillLabel')}
                    tooltip={uiText('downloadsTooltipOpenAfterSuccess')}
                    checked={downloadsOptions.openInHandlerOnComplete}
                    describedBy="downloadsOpenAfterSuccessHint"
                    disabled={downloadsOptionsBusy}
                    onToggle={() => {
                      void applyDownloadsOptionsPatch({
                        openInHandlerOnComplete: !downloadsOptions.openInHandlerOnComplete
                      })
                    }}
                  />
                  <span id="downloadsOpenAfterSuccessHint" className="app-field-help">
                    {uiText('downloadsOpenAfterSuccessHint')}
                  </span>
                </div>
                <div className="app-field app-field-switch">
                  <span>{uiText('downloadsAutoExportSpan')}</span>
                  <PillSwitch
                    label={uiText('downloadsAutoExportPillLabel')}
                    tooltip={uiText('downloadsTooltipAutoExport')}
                    checked={downloadsOptions.autoExportAfterOpenInHandler}
                    describedBy="downloadsAutoExportAfterOpenHint"
                    disabled={downloadsOptionsBusy || !downloadsOptions.openInHandlerOnComplete}
                    onToggle={() => {
                      void applyDownloadsOptionsPatch({
                        autoExportAfterOpenInHandler: !downloadsOptions.autoExportAfterOpenInHandler
                      })
                    }}
                  />
                  <span id="downloadsAutoExportAfterOpenHint" className="app-field-help">
                    {uiText('downloadsAutoExportHint')}
                  </span>
                </div>
                <div className="app-field app-field-switch">
                  <span>{uiText('downloadsEnqueueBatchSpan')}</span>
                  <PillSwitch
                    label={uiText('downloadsEnqueueBatchPillLabel')}
                    tooltip={uiText('downloadsTooltipEnqueueBatch')}
                    checked={downloadsOptions.enqueueBatchOnDownloadComplete}
                    describedBy="downloadsEnqueueBatchHint"
                    disabled={downloadsOptionsBusy}
                    onToggle={() => {
                      void applyDownloadsOptionsPatch({
                        enqueueBatchOnDownloadComplete:
                          !downloadsOptions.enqueueBatchOnDownloadComplete
                      })
                    }}
                  />
                  <span id="downloadsEnqueueBatchHint" className="app-field-help">
                    {uiText('downloadsEnqueueBatchHint')}
                  </span>
                </div>
                <div className="app-field app-field-switch">
                  <span>{uiText('downloadsAutoStartBatchSpan')}</span>
                  <PillSwitch
                    label={uiText('downloadsAutoStartBatchPillLabel')}
                    tooltip={uiText('downloadsTooltipAutoStartBatch')}
                    checked={downloadsOptions.autoStartBatchAfterEnqueue}
                    describedBy="downloadsAutoStartBatchHint"
                    disabled={
                      downloadsOptionsBusy || !downloadsOptions.enqueueBatchOnDownloadComplete
                    }
                    onToggle={() => {
                      void applyDownloadsOptionsPatch({
                        autoStartBatchAfterEnqueue: !downloadsOptions.autoStartBatchAfterEnqueue
                      })
                    }}
                  />
                  <span id="downloadsAutoStartBatchHint" className="app-field-help">
                    {uiText('downloadsAutoStartBatchHint')}
                  </span>
                </div>
                <div className="app-downloads-select-grid">
                  <label className="app-field" title={uiText('downloadsTooltipCookiesBrowser')}>
                    <span>{uiText('downloadsCookiesBrowserLabel')}</span>
                    <select
                      className="app-control"
                      title={uiText('downloadsTooltipCookiesBrowser')}
                      value={downloadsOptions.cookiesBrowserChoice}
                      disabled={downloadsOptionsBusy}
                      onChange={(e) => {
                        void applyDownloadsOptionsPatch({
                          cookiesBrowser: e.target.value as 'none' | YtdlpCookiesBrowserId
                        })
                      }}
                    >
                      <option value="none">{uiText('downloadsCookiesBrowserNone')}</option>
                      <option value="chrome">{uiText('downloadsYtdlpBrowserPrettyChrome')}</option>
                      <option value="edge">{uiText('downloadsYtdlpBrowserPrettyEdge')}</option>
                      <option value="firefox">
                        {uiText('downloadsYtdlpBrowserPrettyFirefox')}
                      </option>
                    </select>
                  </label>
                  <label className="app-field" title={uiText('downloadsTooltipImpersonate')}>
                    <span>{uiText('downloadsImpersonateLabel')}</span>
                    <select
                      className="app-control"
                      title={uiText('downloadsTooltipImpersonate')}
                      value={downloadsOptions.impersonateChoice}
                      disabled={downloadsOptionsBusy}
                      onChange={(e) => {
                        void applyDownloadsOptionsPatch({
                          impersonate: e.target.value as 'none' | YtdlpImpersonateId
                        })
                      }}
                    >
                      <option value="none">{uiText('downloadsImpersonateOff')}</option>
                      <option value="chrome">{uiText('downloadsYtdlpBrowserTokenChrome')}</option>
                      <option value="edge">{uiText('downloadsYtdlpBrowserTokenEdge')}</option>
                      <option value="firefox">{uiText('downloadsYtdlpBrowserTokenFirefox')}</option>
                    </select>
                  </label>
                </div>
                <label className="app-field" title={uiText('downloadsTooltipCookiesProfile')}>
                  <span>{uiText('downloadsCookiesProfileLabel')}</span>
                  <input
                    className="app-control app-downloads-template-input"
                    title={uiText('downloadsTooltipCookiesProfile')}
                    value={downloadsOptions.cookiesBrowserProfileLine}
                    disabled={downloadsOptionsBusy}
                    spellCheck={false}
                    autoComplete="off"
                    placeholder={uiText('downloadsCookiesProfilePlaceholder')}
                    aria-describedby="downloadsCookiesProfileHint"
                    onChange={(e) => {
                      setDownloadsOptions({
                        ...downloadsOptions,
                        cookiesBrowserProfileLine: e.target.value
                      })
                    }}
                    onBlur={(e) => {
                      void applyDownloadsOptionsPatch({
                        cookiesBrowserProfile: e.target.value
                      })
                    }}
                  />
                  <span id="downloadsCookiesProfileHint" className="app-field-help">
                    {uiText('downloadsCookiesProfileHint')}
                  </span>
                </label>
                <div
                  className="app-downloads-output-dir"
                  role="group"
                  aria-label={uiText('downloadsCookiesFileGroupAria')}
                  aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
                >
                  <span className="app-field-help">{uiText('downloadsCookiesNetscapeHelp')}</span>
                  <strong title={downloadsOptions.cookiesFilePathStored}>
                    {downloadsOptions.cookiesFilePathStored ||
                      uiText('downloadsCookiesFileNotSelected')}
                  </strong>
                  <span className="app-field-help">
                    {uiText('downloadsCookiesFilePriorityHelp')}
                  </span>
                  <div
                    className="app-downloads-history-actions"
                    role="toolbar"
                    aria-orientation="horizontal"
                    aria-label={uiText('downloadsCookiesFileActionsToolbarAria')}
                    aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
                  >
                    <button
                      type="button"
                      className="app-btn app-btn-compact app-btn-icon-leading"
                      disabled={downloadsOptionsBusy}
                      title={uiText('downloadsTooltipCookiesPick')}
                      onClick={() => {
                        void window.fluxalloy.downloads.pickCookiesFile().then((res) => {
                          if (res.ok) {
                            void refreshDownloadsOptions()
                            return
                          }
                          if ('error' in res) {
                            setStatusHint(res.error)
                          }
                        })
                      }}
                    >
                      <IconQueueFile title="" size={14} />
                      {uiText('downloadsRailPick')}
                    </button>
                    <button
                      type="button"
                      className="app-btn app-btn-compact app-btn-icon-leading"
                      disabled={
                        downloadsOptionsBusy || downloadsOptions.cookiesFilePathStored.length === 0
                      }
                      title={uiText('downloadsTooltipCookiesClear')}
                      onClick={() => {
                        void window.fluxalloy.downloads.clearCookiesFile().then((res) => {
                          if (!res.ok) {
                            setStatusHint(res.error)
                            return
                          }
                          void refreshDownloadsOptions()
                        })
                      }}
                    >
                      <IconQueueX title="" size={14} />
                      {uiText('downloadsHistoryClear')}
                    </button>
                  </div>
                </div>
              </div>
            </details>
            <details
              className="app-downloads-rail-section"
              aria-label={uiText('downloadsRailSavingSummary')}
              aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
              open={downloadsRailPanels.saving}
              onToggle={handleDownloadsRailSectionToggle('saving')}
            >
              <summary
                className="app-downloads-rail-summary"
                title={uiText('downloadsTooltipSectionSaving')}
              >
                {uiText('downloadsRailSavingSummary')}
              </summary>
              <div className="app-downloads-rail-section-body">
                <div
                  className="app-downloads-output-dir"
                  role="group"
                  aria-label={uiText('downloadsOutputDirAria')}
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
                    aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
                  >
                    <button
                      type="button"
                      className="app-btn app-btn-compact app-btn-icon-leading"
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
            <details
              className="app-downloads-rail-section"
              aria-label={uiText('downloadsRailNetworkSummary')}
              aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
              open={downloadsRailPanels.network}
              onToggle={handleDownloadsRailSectionToggle('network')}
            >
              <summary
                className="app-downloads-rail-summary"
                title={uiText('downloadsTooltipSectionNetwork')}
              >
                {uiText('downloadsRailNetworkSummary')}
              </summary>
              <div className="app-downloads-rail-section-body">
                <label className="app-field" title={uiText('downloadsTooltipQueueRetrySelect')}>
                  <span>{uiText('downloadsQueueRetryLabel')}</span>
                  <select
                    className="app-control"
                    title={uiText('downloadsTooltipQueueRetrySelect')}
                    value={downloadsOptions.queueRetryProfile}
                    disabled={downloadsOptionsBusy}
                    onChange={(e) => {
                      void applyDownloadsOptionsPatch({
                        queueRetryProfile: e.target.value as YtdlpQueueRetryProfileId
                      })
                    }}
                  >
                    {downloadsOptions.queueRetryProfileChoices.map((choice) => (
                      <option key={choice.id} value={choice.id}>
                        {choice.label}
                      </option>
                    ))}
                  </select>
                  <span className="app-field-help">{uiText('downloadsQueueRetryHelp')}</span>
                </label>
                <div className="app-downloads-select-grid">
                  <label className="app-field" title={uiText('downloadsTooltipRateLimitInput')}>
                    <span>{uiText('downloadsRateLimitLabel')}</span>
                    <input
                      className="app-control"
                      title={uiText('downloadsTooltipRateLimitInput')}
                      value={downloadsOptions.rateLimit}
                      disabled={downloadsOptionsBusy}
                      placeholder={uiText('downloadsRateLimitPlaceholder')}
                      spellCheck={false}
                      onChange={(e) => {
                        setDownloadsOptions({ ...downloadsOptions, rateLimit: e.target.value })
                      }}
                      onBlur={(e) => {
                        void applyDownloadsOptionsPatch({ rateLimit: e.target.value })
                      }}
                    />
                    <span className="app-field-help">{uiText('downloadsRateLimitHelp')}</span>
                  </label>
                  <label className="app-field" title={uiText('downloadsTooltipRetriesInput')}>
                    <span>{uiText('downloadsYtdlpRetriesLabel')}</span>
                    <input
                      className="app-control"
                      title={uiText('downloadsTooltipRetriesInput')}
                      value={downloadsOptions.retriesLine}
                      disabled={downloadsOptionsBusy}
                      inputMode="numeric"
                      placeholder={uiText('downloadsYtdlpRetriesPlaceholder')}
                      spellCheck={false}
                      onChange={(e) => {
                        setDownloadsOptions({
                          ...downloadsOptions,
                          retriesLine: e.target.value
                        })
                      }}
                      onBlur={(e) => {
                        void applyDownloadsOptionsPatch({ retriesLine: e.target.value })
                      }}
                    />
                    <span className="app-field-help">{uiText('downloadsYtdlpRetriesHelp')}</span>
                  </label>
                  <label
                    className="app-field"
                    title={uiText('downloadsTooltipFragmentRetriesInput')}
                  >
                    <span>{uiText('downloadsFragmentRetriesLabel')}</span>
                    <input
                      className="app-control"
                      title={uiText('downloadsTooltipFragmentRetriesInput')}
                      value={downloadsOptions.fragmentRetriesLine}
                      disabled={downloadsOptionsBusy}
                      inputMode="numeric"
                      placeholder={uiText('downloadsFragmentRetriesPlaceholder')}
                      spellCheck={false}
                      onChange={(e) => {
                        setDownloadsOptions({
                          ...downloadsOptions,
                          fragmentRetriesLine: e.target.value
                        })
                      }}
                      onBlur={(e) => {
                        void applyDownloadsOptionsPatch({
                          fragmentRetriesLine: e.target.value
                        })
                      }}
                    />
                    <span className="app-field-help">{uiText('downloadsFragmentRetriesHelp')}</span>
                  </label>
                </div>
              </div>
            </details>
            <details
              className="app-downloads-rail-section"
              aria-label={uiText('downloadsRailExpertSummary')}
              aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
              open={downloadsRailPanels.expert}
              onToggle={handleDownloadsRailSectionToggle('expert')}
            >
              <summary
                className="app-downloads-rail-summary"
                title={uiText('downloadsTooltipSectionExpert')}
              >
                {uiText('downloadsRailExpertSummary')}
              </summary>
              <div className="app-downloads-rail-section-body">
                <label className="app-field" title={uiText('downloadsTooltipExtraArgsTextarea')}>
                  <span>{uiText('downloadsExtraArgsLabel')}</span>
                  <textarea
                    className="app-control app-downloads-extra-args"
                    title={uiText('downloadsTooltipExtraArgsTextarea')}
                    rows={3}
                    spellCheck={false}
                    autoComplete="off"
                    value={downloadsOptions.extraArgsLine}
                    disabled={downloadsOptionsBusy}
                    onChange={(e) => {
                      setDownloadsOptions({
                        ...downloadsOptions,
                        extraArgsLine: e.target.value
                      })
                    }}
                    onBlur={(e) => {
                      void applyDownloadsOptionsPatch({ extraArgsLine: e.target.value })
                    }}
                  />
                  <span className="app-field-help">{uiText('downloadsExtraArgsHelp')}</span>
                </label>
                {downloadsOptions.extraArgsParseWarning ? (
                  <p className="app-downloads-warning" role="alert">
                    {downloadsOptions.extraArgsParseWarning}
                  </p>
                ) : null}
                <p id="downloadsHintCatalogIntro" className="app-field-help">
                  {uiText('downloadsHintCatalogIntro')}
                </p>
                <label className="app-field" title={uiText('downloadsTooltipHintSearchInput')}>
                  <span>{uiText('downloadsHintCatalogFilterLabel')}</span>
                  <input
                    type="text"
                    className="app-control app-downloads-hint-filter"
                    title={uiText('downloadsTooltipHintSearchInput')}
                    spellCheck={false}
                    autoComplete="off"
                    placeholder={uiText('downloadsHintSearchPlaceholder')}
                    aria-describedby="downloadsHintCatalogIntro"
                    disabled={downloadsOptionsBusy}
                    value={downloadsExpertHintFilter}
                    onChange={(e) => setDownloadsExpertHintFilter(e.target.value)}
                  />
                </label>
                <div
                  className="app-downloads-hint-list"
                  role="list"
                  aria-label={uiText('downloadsHintListAria')}
                  aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
                >
                  {!downloadsOptions.commandHints?.length ? (
                    <div className="app-downloads-hint-item app-downloads-hint-item--muted">
                      {uiText('downloadsHintsUnavailable')}
                    </div>
                  ) : ytdlpCommandHintsFilteredByCategory.length === 0 ? (
                    <div className="app-downloads-hint-item app-downloads-hint-item--muted">
                      {uiText('downloadsHintsNoMatches')}
                    </div>
                  ) : (
                    ytdlpCommandHintsFilteredByCategory.map(([cat, rows]) => (
                      <div key={cat}>
                        <div className="app-downloads-hint-cat" role="presentation">
                          {cat}
                        </div>
                        {rows.map((h) => (
                          <div
                            key={`${cat}:${h.token}`}
                            className="app-downloads-hint-item"
                            role="listitem"
                          >
                            <button
                              type="button"
                              className="app-downloads-hint-token"
                              title={h.summary || h.token}
                              aria-label={downloadsCatalogHintTokenAccessibleDescription(cat, h)}
                              disabled={downloadsOptionsBusy}
                              onClick={() => appendDownloadsExtraArgsToken(h.token)}
                            >
                              {h.token}
                            </button>
                            {h.summary ? (
                              <div className="app-downloads-hint-desc" title={h.summary}>
                                {h.summary}
                              </div>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ))
                  )}
                </div>
                <span className="app-field-help">{uiText('downloadsHintsSameAsPopoutHelp')}</span>
                <nav
                  className="app-doc-inline-links app-downloads-doc-links"
                  aria-label={uiText('downloadsRailExpertDocNavAria')}
                  aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
                >
                  <a href={YTDLP_DOC_README} target="_blank" rel="noreferrer">
                    {uiText('docLinkYtDlpReadme')}
                  </a>
                  {' · '}
                  <a href={YTDLP_DOC_FORMAT_SELECTION} target="_blank" rel="noreferrer">
                    {uiText('quickYtdlpDocFormats')}
                  </a>
                  {' · '}
                  <a href={YTDLP_DOC_OUTPUT_TEMPLATE} target="_blank" rel="noreferrer">
                    {uiText('downloadsRailDocOutput')}
                  </a>
                  {' · '}
                  <a href={YTDLP_DOC_POSTPROCESS} target="_blank" rel="noreferrer">
                    {uiText('downloadsRailDocPostprocess')}
                  </a>
                </nav>
                <span id="downloads-command-preview-help" className="app-field-help">
                  {uiText('downloadsCommandPreviewHelp')}
                </span>
                <div className="app-downloads-command-preview app-downloads-command-preview--flat">
                  <pre
                    className="app-downloads-command-preview-pre"
                    role="status"
                    aria-live="polite"
                    aria-relevant="text"
                    aria-labelledby="downloads-command-preview-help"
                  >
                    {downloadsOptions.commandPreview}
                  </pre>
                </div>
              </div>
            </details>
            {downloadsOptions.cookiesWarning ? (
              <p className="app-downloads-warning">{downloadsOptions.cookiesWarning}</p>
            ) : null}
          </div>
        ) : (
          <p className="app-settings-subtitle">{uiText('downloadsOptionsLoading')}</p>
        )}
        <div
          className="app-downloads-rail-footer"
          role="toolbar"
          aria-orientation="horizontal"
          aria-label={uiText('downloadsRailFooterToolbarAria')}
          aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
        >
          <button
            type="button"
            className="app-btn app-btn-icon-leading"
            disabled={downloadsOptionsBusy}
            title={uiText('downloadsTooltipRefreshFooter')}
            onClick={() => {
              void refreshDownloadsOptions()
            }}
          >
            <IconRefreshCw title="" size={16} />
            {uiText('downloadsRailRefreshOptions')}
          </button>
        </div>
      </aside>
    )
  }
)

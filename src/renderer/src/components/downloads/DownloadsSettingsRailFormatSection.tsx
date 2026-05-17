import type { YtdlpFormatPresetId, YtdlpSubtitlePresetId } from '../../../../shared/ytdlp-download-contract'
import { uiText } from '../../locales/ui-text'
import { PillSwitch } from '../PillSwitch'
import type { DownloadsSettingsRailProps } from './downloads-settings-rail-props'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- JSX section
export function DownloadsSettingsRailFormatSection(props: DownloadsSettingsRailProps) {
  const {
    downloadsOptionsBusy,
    downloadsHistoryBusy,
    downloadsOptions,
    setDownloadsOptions,
    downloadsRailPanels,
    onRailSectionToggle,
    applyDownloadsOptionsPatch
  } = props
  const handleDownloadsRailSectionToggle = onRailSectionToggle
  if (!downloadsOptions) {
    return null
  }
  return (
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
  )
}

import {
  YTDLP_DOC_FORMAT_SELECTION,
  YTDLP_DOC_OUTPUT_TEMPLATE,
  YTDLP_DOC_POSTPROCESS,
  YTDLP_DOC_README
} from '../../../../shared/external-doc-urls'
import { downloadsCatalogHintTokenAccessibleDescription } from '../../app-terminal-hint-ui'
import { uiText } from '../../locales/ui-text'
import type { DownloadsSettingsRailProps } from './downloads-settings-rail-props'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- JSX section
export function DownloadsSettingsRailExpertSection(props: DownloadsSettingsRailProps) {
  const {
    downloadsOptionsBusy,
    downloadsHistoryBusy,
    downloadsOptions,
    setDownloadsOptions,
    downloadsRailPanels,
    onRailSectionToggle,
    applyDownloadsOptionsPatch,
    downloadsExpertHintFilter,
    setDownloadsExpertHintFilter,
    ytdlpCommandHintsFilteredByCategory,
    appendDownloadsExtraArgsToken
  } = props
  const handleDownloadsRailSectionToggle = onRailSectionToggle
  if (!downloadsOptions) {
    return null
  }
  return (
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
  )
}

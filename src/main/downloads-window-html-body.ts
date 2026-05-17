import type { DownloadsWindowUiPanelState } from '../shared/settings-contract'
import type { DownloadsWindowUiStrings } from '../shared/downloads-window-ui-locale'
import {
  YTDLP_DOC_FORMAT_SELECTION,
  YTDLP_DOC_OUTPUT_TEMPLATE,
  YTDLP_DOC_POSTPROCESS,
  YTDLP_DOC_README
} from '../shared/external-doc-urls'
import {
  DOWNLOADS_TOPBAR_CLUSTER_ICONS,
  EDITOR_TOPBAR_ACTION_ICONS,
  EDITOR_TOPBAR_TOOLS_ICONS,
  QUEUE_ROW_ACTION_ICONS,
  emitDownloadsTopbarClusterHtml,
  emitInlineStrokeSvg
} from '../shared/lucide-downloads-icons'

export type DownloadsWindowHtmlBodyContext = {
  L: DownloadsWindowUiStrings
  openAttr: (key: keyof DownloadsWindowUiPanelState, defaultOpen: boolean) => string
}

export function buildDownloadsWindowHtmlBody(ctx: DownloadsWindowHtmlBodyContext): string {
  const { L, openAttr } = ctx
  return `<body>
  <div class="dl-shell">
    <header class="dl-topbar">
      <div class="brand">
        <span class="brand-mark" aria-hidden>◇</span>
        <h1>FluxAlloy</h1>
        <span class="brand-version">yt-dlp</span>
      </div>
      <nav class="workspace-tabs" aria-label="${L.workspaceTabsAria}">
        <button type="button" class="workspace-tab" disabled title="${L.editorTabDisabledTitle}"><span class="workspace-tab-glyph" aria-hidden="true">${emitInlineStrokeSvg(DOWNLOADS_TOPBAR_CLUSTER_ICONS.home, 16)}</span>${L.editorTabLabel}</button>
        <button type="button" class="workspace-tab active" aria-current="page"><span class="workspace-tab-glyph" aria-hidden="true">${emitInlineStrokeSvg(DOWNLOADS_TOPBAR_CLUSTER_ICONS.download, 16)}</span>${L.downloadsTabLabel}</button>
      </nav>
      <div class="topbar-right">
        <span class="topbar-meta">ffmpeg / yt-dlp queue</span>
${emitDownloadsTopbarClusterHtml(18, L.topbarCluster)}
      </div>
    </header>
    <main class="dl-main">
      <section class="dl-workspace" aria-label="${L.queueSectionAria}">
        <div class="dl-input-band">
          <div>
            <label class="input-label" for="urls">${L.urlsLabel}</label>
            <textarea id="urls" placeholder="https://…" aria-describedby="urlsHint"></textarea>
            <p class="hint" id="urlsHint">${L.urlsHint}</p>
          </div>
          <div class="input-actions">
            <button type="button" class="cmd cmd-primary cmd-icon-leading" id="addBtn" aria-describedby="urlsHint">
              <span class="cmd-ico" aria-hidden="true">${emitInlineStrokeSvg(QUEUE_ROW_ACTION_ICONS.plus, 15)}</span>
              ${L.addToQueue}
            </button>
            <button
              type="button"
              class="cmd cmd-icon-leading"
              id="startBtn"
              title="${L.startAllTitle}"
              aria-describedby="urlsHint"
            >
              <span class="cmd-ico" aria-hidden="true">${emitInlineStrokeSvg(QUEUE_ROW_ACTION_ICONS.play, 15)}</span>
              ${L.startAll}
            </button>
          </div>
        </div>
        <div class="queue-toolbar">
          <button
            type="button"
            class="cmd cmd-icon-leading"
            id="pauseYtdlpBtn"
            title="${L.pauseToolbarTitleDefault}"
            aria-describedby="dlQueueToolbarHint"
          >
            <span class="cmd-ico" aria-hidden="true">${emitInlineStrokeSvg(QUEUE_ROW_ACTION_ICONS.pause, 14)}</span>
            ${L.pauseLabel}
          </button>
          <button
            type="button"
            class="cmd cmd-warn cmd-icon-leading"
            id="cancelBtn"
            title="${L.cancelTitle}"
            aria-describedby="dlQueueToolbarHint"
          >
            <span class="cmd-ico" aria-hidden="true">${emitInlineStrokeSvg(EDITOR_TOPBAR_ACTION_ICONS.ban, 14)}</span>
            ${L.cancel}
          </button>
          <button type="button" class="cmd cmd-icon-leading" id="clearBtn" aria-describedby="dlQueueToolbarHint">
            <span class="cmd-ico" aria-hidden="true">${emitInlineStrokeSvg(QUEUE_ROW_ACTION_ICONS.trash, 14)}</span>
            ${L.clearQueue}
          </button>
          <button type="button" class="cmd cmd-icon-leading" id="clearFinishedBtn" aria-describedby="dlQueueToolbarHint">
            <span class="cmd-ico" aria-hidden="true">${emitInlineStrokeSvg(QUEUE_ROW_ACTION_ICONS.trash, 14)}</span>
            ${L.clearFinished}
          </button>
          <span class="inline-filter-field">
            <label class="inline-filter" for="queueStatusFilter">${L.statusFilterLabel}</label>
            <select id="queueStatusFilter" aria-describedby="queueFilterHint">
              <option value="all">${L.optQueueAll}</option>
              <option value="waiting">${L.optQueueWaiting}</option>
              <option value="running">${L.optQueueRunning}</option>
              <option value="done">${L.optQueueDone}</option>
              <option value="error">${L.optQueueError}</option>
              <option value="cancelled">${L.optQueueCancelled}</option>
            </select>
          </span>
          <span id="queueFilterHint" class="sr-only">${L.queueFilterHint}</span>
          <span id="dlQueueToolbarHint" class="sr-only">
            ${L.queueToolbarHint}
          </span>
          <span class="queue-summary" id="queueSummary">${L.queueSummaryInitial}</span>
          <button
            type="button"
            class="cmd cmd-icon-leading"
            id="scrollToRailBtn"
            hidden
            title="${L.scrollToSettingsTitle}"
            aria-controls="dl-ytdlp-settings-rail"
          >
            <span class="cmd-ico" aria-hidden="true">${emitInlineStrokeSvg(DOWNLOADS_TOPBAR_CLUSTER_ICONS.settings, 14)}</span>
            ${L.scrollToSettings}
          </button>
        </div>
        <div class="queue-table-wrap">
          <table class="queue-table">
            <caption class="sr-only">${L.queueTableCaption}</caption>
            <thead><tr><th>${L.thNum}</th><th>${L.thTitle}</th><th>${L.thFmt}</th><th>${L.thSize}</th><th>${L.thProg}</th><th>${L.thSpd}</th><th>${L.thEta}</th><th>${L.thStatus}</th><th>${L.thActions}</th></tr></thead>
            <tbody id="queueBody"></tbody>
          </table>
        </div>
        <div class="bottom-panels">
          <details class="history-panel details-chev" id="historyDetails"${openAttr('history', false)}>
            <summary>${L.historySummary}</summary>
            <p id="downloadsHistorySectionHint" class="sr-only">
              ${L.historySectionHint}
            </p>
            <div class="history-actions">
              <button
                type="button"
                class="cmd cmd-icon-leading"
                id="refreshHistoryBtn"
                aria-describedby="downloadsHistorySectionHint"
              >
                <span class="cmd-ico" aria-hidden="true">${emitInlineStrokeSvg(QUEUE_ROW_ACTION_ICONS.refreshCw, 14)}</span>
                ${L.refreshHistory}
              </button>
              <button
                type="button"
                class="cmd cmd-warn cmd-icon-leading"
                id="clearHistoryBtn"
                aria-describedby="downloadsHistorySectionHint"
              >
                <span class="cmd-ico" aria-hidden="true">${emitInlineStrokeSvg(QUEUE_ROW_ACTION_ICONS.trash, 14)}</span>
                ${L.clearHistory}
              </button>
              <span class="hist-inline-field">
                <label class="hist-inline" for="historyOutcomeFilter">${L.historyOutcomeLabel}</label>
                <select
                  id="historyOutcomeFilter"
                  aria-describedby="downloadsHistorySectionHint historyFilterHint"
                >
                  <option value="all">${L.histOptAll}</option>
                  <option value="success">${L.histOptSuccess}</option>
                  <option value="error">${L.histOptError}</option>
                  <option value="cancelled">${L.histOptCancelled}</option>
                </select>
              </span>
              <span id="historyFilterHint" class="sr-only">${L.historyFilterHint}</span>
            </div>
            <table class="history-table">
              <caption class="sr-only">${L.historyTableCaption}</caption>
              <thead><tr><th>${L.histThFinished}</th><th>${L.histThName}</th><th>${L.histThUrl}</th><th>${L.histThOutcome}</th><th>${L.histThCode}</th><th>${L.histThStatus}</th><th></th></tr></thead>
              <tbody id="historyBody"></tbody>
            </table>
          </details>
          <div class="log-panel">
            <details class="details-chev" id="logDetails"${openAttr('log', true)}>
              <summary>${L.logSummary}</summary>
              <p id="downloadsLogSectionHint" class="sr-only">
                ${L.logSectionHint}
              </p>
              <div class="history-actions">
                <button type="button" class="cmd cmd-icon-leading" id="saveLogBtn" aria-describedby="downloadsLogSectionHint">
                  <span class="cmd-ico" aria-hidden="true">${emitInlineStrokeSvg(EDITOR_TOPBAR_ACTION_ICONS.save, 14)}</span>
                  ${L.saveLog}
                </button>
                <button
                  type="button"
                  class="cmd cmd-icon-leading"
                  id="clearLogBtn"
                  title="${L.clearLogViewTitle}"
                  aria-describedby="downloadsLogSectionHint"
                >
                  <span class="cmd-ico" aria-hidden="true">${emitInlineStrokeSvg(QUEUE_ROW_ACTION_ICONS.x, 14)}</span>
                  ${L.clearLogView}
                </button>
                <span class="queue-summary log-meta" id="logMeta"></span>
              </div>
              <pre
                id="logPre"
                role="log"
                aria-live="polite"
                aria-relevant="additions"
                aria-label="${L.logPreAriaLabel}"
                aria-describedby="downloadsLogSectionHint"
              ></pre>
            </details>
          </div>
        </div>
      </section>
      <aside class="settings-rail" id="dl-ytdlp-settings-rail" aria-label="${L.railAria}">
        <div class="rail-head">
          <h2 class="rail-title">${L.railTitle}</h2>
          <p class="rail-subtitle">${L.railSubtitle}</p>
        </div>
        <div class="opts-panel">
          <details class="settings-section" id="dlRailFormat"${openAttr('format', true)}>
            <summary>${L.formatSummary}</summary>
            <div class="settings-body" aria-describedby="dlRailFormatSectionHint">
              <p id="dlRailFormatSectionHint" class="opts-hint">
                ${L.formatSectionHint}
              </p>
              <label for="fmtPreset">${L.formatQualityLabel}</label>
              <select id="fmtPreset" aria-describedby="dlRailFormatSectionHint"></select>
              <div class="opts-pill-grid" role="group" aria-label="${L.playlistAudioGroupAria}">
                <div class="opts-pill-field">
                  <span class="opts-pill-label">${L.wholePlaylistLabel} <span class="opts-check-muted">--yes-playlist</span></span>
                  <button type="button" class="pill-switch" id="pillPlaylist" role="switch" aria-checked="false" aria-label="${L.wholePlaylistAria}" aria-describedby="dlRailFormatSectionHint">
                    <span class="pill-switch-knob" aria-hidden="true"></span>
                    <span class="pill-switch-text">${L.pillOff}</span>
                  </button>
                </div>
                <div class="opts-pill-field">
                  <span class="opts-pill-label">${L.audioOnlyLabel} <span class="opts-check-muted">-x --audio-format best</span></span>
                  <button type="button" class="pill-switch" id="pillAudioOnly" role="switch" aria-checked="false" aria-label="${L.audioOnlyAria}" aria-describedby="dlRailFormatSectionHint">
                    <span class="pill-switch-knob" aria-hidden="true"></span>
                    <span class="pill-switch-text">${L.pillOff}</span>
                  </button>
                </div>
              </div>
              <label for="subPreset">${L.subtitlesLabel}</label>
              <select id="subPreset" aria-describedby="dlRailFormatSectionHint">
                <option value="none">${L.subOptNone}</option>
                <option value="manual">${L.subOptManual}</option>
                <option value="manual_auto">${L.subOptManualAuto}</option>
              </select>
              <label for="subLangsInput">${L.subLangsLabel}</label>
              <input type="text" id="subLangsInput" spellcheck="false" autocomplete="off" placeholder="${L.subLangsPlaceholder}" aria-describedby="dlRailFormatSectionHint" />
            </div>
          </details>
          <details class="settings-section" id="dlRailMeta"${openAttr('metadata', true)}>
            <summary>${L.metadataSummary}</summary>
            <div class="settings-body" aria-describedby="dlRailMetaSectionHint">
              <p id="dlRailMetaSectionHint" class="opts-hint">
                ${L.metadataSectionHint}
              </p>
              <label for="cookiesBrowserSelect">${L.cookiesLabel}</label>
              <select id="cookiesBrowserSelect" aria-describedby="dlRailMetaSectionHint">
                <option value="none">${L.cookiesNone}</option>
                <option value="chrome">${L.cookiesChrome}</option>
                <option value="edge">${L.cookiesEdge}</option>
                <option value="firefox">${L.cookiesFirefox}</option>
              </select>
              <label for="cookiesBrowserProfileInput">${L.cookiesProfileLabel}</label>
              <input type="text" id="cookiesBrowserProfileInput" spellcheck="false" autocomplete="off" placeholder="${L.cookiesProfilePlaceholder}" aria-describedby="dlRailMetaSectionHint" />
              <div class="out-dir-row" role="group" aria-labelledby="dlCookiesPathLabel">
                <span id="dlCookiesPathLabel" class="out-dir-label">${L.cookiesFileLabel}</span>
                <span id="cookiesPathText" class="out-path" title="">—</span>
                <button type="button" class="cmd cmd-icon-leading" id="pickCookiesBtn" aria-describedby="dlRailMetaSectionHint"><span class="cmd-ico" aria-hidden="true">${emitInlineStrokeSvg(QUEUE_ROW_ACTION_ICONS.file, 14)}</span>${L.pickEllipsis}</button>
                <button type="button" class="cmd cmd-icon-leading" id="clearCookiesBtn" title="${L.clearCookiesTitle}" aria-describedby="dlRailMetaSectionHint"><span class="cmd-ico" aria-hidden="true">${emitInlineStrokeSvg(QUEUE_ROW_ACTION_ICONS.x, 14)}</span>${L.clearCookies}</button>
              </div>
              <p class="opts-hint opts-warn" id="cookiesWarn" hidden></p>
              <label for="impersonateSelect">${L.impersonateLabel}</label>
              <select id="impersonateSelect" aria-describedby="dlRailMetaSectionHint">
                <option value="none">${L.impersonateOff}</option>
                <option value="chrome">chrome</option>
                <option value="edge">edge</option>
                <option value="firefox">firefox</option>
              </select>
              <div class="opts-pill-field" style="margin-top:0.45rem">
                <span class="opts-pill-label">${L.openInHandlerPillLabel} <span class="opts-check-muted">§6.4</span></span>
                <button type="button" class="pill-switch" id="pillOpenInHandler" role="switch" aria-checked="false" aria-label="${L.openInHandlerAria}" aria-describedby="dlRailMetaSectionHint">
                  <span class="pill-switch-knob" aria-hidden="true"></span>
                  <span class="pill-switch-text">${L.pillOff}</span>
                </button>
              </div>
              <div class="opts-pill-field" style="margin-top:0.35rem">
                <span class="opts-pill-label">${L.autoExportPillLabel} <span class="opts-check-muted">§6.4→§7.2</span></span>
                <button type="button" class="pill-switch" id="pillAutoExportAfterOpen" role="switch" aria-checked="false" aria-label="${L.autoExportAria}" aria-describedby="dlRailMetaSectionHint">
                  <span class="pill-switch-knob" aria-hidden="true"></span>
                  <span class="pill-switch-text">${L.pillOff}</span>
                </button>
              </div>
              <div class="opts-pill-field" style="margin-top:0.35rem">
                <span class="opts-pill-label">${L.enqueueBatchPillLabel} <span class="opts-check-muted">§7.4</span></span>
                <button type="button" class="pill-switch" id="pillEnqueueBatch" role="switch" aria-checked="false" aria-label="${L.enqueueBatchAria}" aria-describedby="dlRailMetaSectionHint">
                  <span class="pill-switch-knob" aria-hidden="true"></span>
                  <span class="pill-switch-text">${L.pillOff}</span>
                </button>
              </div>
              <div class="opts-pill-field" style="margin-top:0.35rem">
                <span class="opts-pill-label">${L.autoStartBatchPillLabel} <span class="opts-check-muted">§7.4</span></span>
                <button type="button" class="pill-switch" id="pillAutoStartBatch" role="switch" aria-checked="false" aria-label="${L.autoStartBatchAria}" aria-describedby="dlRailMetaSectionHint">
                  <span class="pill-switch-knob" aria-hidden="true"></span>
                  <span class="pill-switch-text">${L.pillOff}</span>
                </button>
              </div>
            </div>
          </details>
          <details class="settings-section" id="dlRailSave"${openAttr('saving', true)}>
            <summary>${L.savingSummary}</summary>
            <div class="settings-body" aria-describedby="dlRailSaveSectionHint">
              <p id="dlRailSaveSectionHint" class="opts-hint">
                ${L.savingSectionHint}
              </p>
              <div class="out-dir-row" role="group" aria-labelledby="dlOutDirLabel">
                <span id="dlOutDirLabel" class="out-dir-label">${L.outDirLabel}</span>
                <span id="outDirText" class="out-path" title="">…</span>
                <button type="button" class="cmd cmd-icon-leading" id="openOutBtn" title="${L.openOutTitle}" aria-describedby="dlRailSaveSectionHint"><span class="cmd-ico" aria-hidden="true">${emitInlineStrokeSvg(QUEUE_ROW_ACTION_ICONS.folder, 14)}</span>${L.openOut}</button>
                <button type="button" class="cmd cmd-icon-leading" id="pickOutBtn" aria-describedby="dlRailSaveSectionHint"><span class="cmd-ico" aria-hidden="true">${emitInlineStrokeSvg(QUEUE_ROW_ACTION_ICONS.plus, 14)}</span>${L.pickOut}</button>
                <button type="button" class="cmd cmd-icon-leading" id="resetOutBtn" title="${L.resetOutTitle}" aria-describedby="dlRailSaveSectionHint"><span class="cmd-ico" aria-hidden="true">${emitInlineStrokeSvg(DOWNLOADS_TOPBAR_CLUSTER_ICONS.home, 14)}</span>${L.resetOut}</button>
              </div>
              <label for="tmplInput">${L.tmplLabel}</label>
              <input type="text" id="tmplInput" spellcheck="false" autocomplete="off" aria-describedby="dlRailSaveSectionHint" />
              <div class="opts-actions">
                <button type="button" class="cmd cmd-primary cmd-icon-leading" id="applyOptsBtn" aria-describedby="dlRailSaveSectionHint"><span class="cmd-ico" aria-hidden="true">${emitInlineStrokeSvg(EDITOR_TOPBAR_ACTION_ICONS.save, 14)}</span>${L.applyOpts}</button>
                <button type="button" class="cmd cmd-icon-leading" id="tmplReset" aria-describedby="dlRailSaveSectionHint"><span class="cmd-ico" aria-hidden="true">${emitInlineStrokeSvg(EDITOR_TOPBAR_TOOLS_ICONS.rotateCcw, 14)}</span>${L.tmplReset}</button>
              </div>
            </div>
          </details>
          <details class="settings-section" id="dlRailNet"${openAttr('network', false)}>
            <summary>${L.networkSummary}</summary>
            <div class="settings-body" aria-describedby="dlRailNetSectionHint">
              <p id="dlRailNetSectionHint" class="opts-hint">
                ${L.networkSectionHint}
              </p>
              <label for="rateLimitInput">${L.rateLimitLabel}</label>
              <input type="text" id="rateLimitInput" spellcheck="false" autocomplete="off" placeholder="${L.rateLimitPlaceholder}" aria-describedby="dlRailNetSectionHint" />
              <label for="retriesInput">${L.retriesLabel}</label>
              <input type="text" id="retriesInput" inputmode="numeric" spellcheck="false" autocomplete="off" placeholder="${L.retriesPlaceholder}" aria-describedby="dlRailNetSectionHint" />
              <label for="fragmentRetriesInput">${L.fragmentRetriesLabel}</label>
              <input type="text" id="fragmentRetriesInput" inputmode="numeric" spellcheck="false" autocomplete="off" placeholder="${L.retriesPlaceholder}" aria-describedby="dlRailNetSectionHint" />
              <label for="queueRetrySelect">${L.queueRetryLabel}</label>
              <select id="queueRetrySelect" aria-describedby="dlRailNetSectionHint">
                <option value="off">${L.queueRetryOff}</option>
                <option value="light">${L.queueRetryLight}</option>
                <option value="normal">${L.queueRetryNormal}</option>
                <option value="persistent">${L.queueRetryPersistent}</option>
              </select>
            </div>
          </details>
          <details class="settings-section" id="expertArgsDetails"${openAttr('expert', false)}>
            <summary>${L.expertSummary}</summary>
            <div class="settings-body" aria-describedby="dlRailExpertSectionHint">
              <p id="dlRailExpertSectionHint" class="opts-hint">
                ${L.expertSectionHintBeforeLinks}
                <a href="${YTDLP_DOC_README}" target="_blank" rel="noreferrer">README</a> ·
                <a href="${YTDLP_DOC_FORMAT_SELECTION}" target="_blank" rel="noreferrer">${L.docFormats}</a> ·
                <a href="${YTDLP_DOC_OUTPUT_TEMPLATE}" target="_blank" rel="noreferrer">${L.docOutputTemplate}</a> ·
                <a href="${YTDLP_DOC_POSTPROCESS}" target="_blank" rel="noreferrer">${L.docPostprocess}</a>${L.expertSectionHintAfterLinks}
              </p>
              <label for="extraArgsInput">${L.extraArgsLabel}</label>
              <textarea id="extraArgsInput" rows="2" spellcheck="false" autocomplete="off" placeholder="${L.extraArgsPlaceholder}" aria-describedby="dlRailExpertSectionHint"></textarea>
              <p class="opts-hint opts-warn" id="extraArgsWarn" hidden></p>
              <label for="previewOutDirOverride">${L.previewOutDirLabel}</label>
              <input type="text" id="previewOutDirOverride" spellcheck="false" autocomplete="off" placeholder="${L.previewOutDirPlaceholder}" aria-describedby="dlRailExpertSectionHint" />
              <span class="opts-preview-label">${L.argsPreviewLabel}</span>
              <pre class="args-preview" id="argsPreview" aria-label="${L.argsPreviewAria}" aria-describedby="dlRailExpertSectionHint"></pre>
              <details class="hints-panel details-chev" id="hintsPanel"${openAttr('hints', false)}>
                <summary>${L.hintsPanelSummary}</summary>
                <p id="hintCatalogIntro" class="opts-hint">${L.hintCatalogIntro}</p>
                <div class="hints-search">
                  <label class="opts-preview-label" for="hintFilter">${L.hintCatalogFilterLabel}</label>
                  <input type="text" id="hintFilter" spellcheck="false" autocomplete="off" placeholder="${L.hintFilterPlaceholder}" aria-describedby="hintCatalogIntro dlRailExpertSectionHint" aria-label="${L.hintFilterAria}" />
                </div>
                <div class="hint-list" id="hintList" role="list" aria-label="${L.hintListAria}"></div>
              </details>
            </div>
          </details>
        </div>
      </aside>
    </main>
    <p class="note">${L.footerNote}</p>
  </div>`
}

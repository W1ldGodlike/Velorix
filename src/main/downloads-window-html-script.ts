import {
  YTDLP_QUEUE_STATUS_CANCELLED,
  YTDLP_QUEUE_STATUS_DONE,
  YTDLP_QUEUE_STATUS_ERROR_PREFIX,
  YTDLP_QUEUE_STATUS_RUNNING,
  YTDLP_QUEUE_STATUS_WAITING,
  YTDLP_QUEUE_STATUS_RETRY_PAUSE_PREFIX
} from '../shared/ytdlp-queue-status'
import { buildDownloadsWindowHtmlScriptHistoryFragment } from './downloads-window-html-script-fragment-history'
import { buildDownloadsWindowHtmlScriptOptsLogFragment } from './downloads-window-html-script-fragment-opts-log'
import { DOWNLOADS_WINDOW_HTML_SCRIPT_QUEUE } from './downloads-window-html-script-fragment-queue'
import { DOWNLOADS_WINDOW_HTML_SCRIPT_SHELL } from './downloads-window-html-script-fragment-shell'
import { DOWNLOADS_WINDOW_HTML_SCRIPT_WIREUP } from './downloads-window-html-script-fragment-wireup'

export type DownloadsWindowHtmlScriptContext = {
  dlScriptI18nJson: string
  dlLocaleCmpJson: string
  ytdlpHintCatOrderJson: string
}

export function buildDownloadsWindowHtmlScript(ctx: DownloadsWindowHtmlScriptContext): string {
  const { dlScriptI18nJson, dlLocaleCmpJson, ytdlpHintCatOrderJson } = ctx
  return `  <script>
    (function () {
      var DL_I18N = ${dlScriptI18nJson};
      var DL_LOCALE_CMP = ${dlLocaleCmpJson};
      var _ytdlpHintCatOrder = ${ytdlpHintCatOrderJson};
      var QS_WAITING = ${JSON.stringify(YTDLP_QUEUE_STATUS_WAITING)};
      var QS_RUNNING = ${JSON.stringify(YTDLP_QUEUE_STATUS_RUNNING)};
      var QS_RETRY = ${JSON.stringify(YTDLP_QUEUE_STATUS_RETRY_PAUSE_PREFIX)};
      var QS_DONE = ${JSON.stringify(YTDLP_QUEUE_STATUS_DONE)};
      var QS_CANCELLED = ${JSON.stringify(YTDLP_QUEUE_STATUS_CANCELLED)};
      var QS_ERR = ${JSON.stringify(YTDLP_QUEUE_STATUS_ERROR_PREFIX)};
      function _ytdlpCatRank(c) {
        var i = _ytdlpHintCatOrder.indexOf(c);
        return i === -1 ? _ytdlpHintCatOrder.length - 1 : i;
      }
      function _ytdlpCmpCat(a, b) {
        var ra = _ytdlpCatRank(a);
        var rb = _ytdlpCatRank(b);
        if (ra !== rb) return ra - rb;
        return a.localeCompare(b, DL_LOCALE_CMP);
      }
      var api = window.fluxalloyDownloads;
      var addBtn = document.getElementById('addBtn');
      var clearBtn = document.getElementById('clearBtn');
      var clearFinishedBtn = document.getElementById('clearFinishedBtn');
      var startBtn = document.getElementById('startBtn');
      var pauseYtdlpBtn = document.getElementById('pauseYtdlpBtn');
      var cancelBtn = document.getElementById('cancelBtn');
      var urls = document.getElementById('urls');
      var body = document.getElementById('queueBody');
      var queueStatusFilter = document.getElementById('queueStatusFilter');
      var queueSummary = document.getElementById('queueSummary');
      var scrollToRailBtn = document.getElementById('scrollToRailBtn');
      var outDirText = document.getElementById('outDirText');
      var openOutBtn = document.getElementById('openOutBtn');
      var pickOutBtn = document.getElementById('pickOutBtn');
      var resetOutBtn = document.getElementById('resetOutBtn');
      var tmplInput = document.getElementById('tmplInput');
      var fmtPreset = document.getElementById('fmtPreset');
      var applyOptsBtn = document.getElementById('applyOptsBtn');
      var tmplReset = document.getElementById('tmplReset');
      var pillPlaylist = document.getElementById('pillPlaylist');
      var pillAudioOnly = document.getElementById('pillAudioOnly');
      var subPreset = document.getElementById('subPreset');
      var subLangsInput = document.getElementById('subLangsInput');
      var cookiesBrowserSelect = document.getElementById('cookiesBrowserSelect');
      var cookiesBrowserProfileInput = document.getElementById('cookiesBrowserProfileInput');
      var cookiesPathText = document.getElementById('cookiesPathText');
      var pickCookiesBtn = document.getElementById('pickCookiesBtn');
      var clearCookiesBtn = document.getElementById('clearCookiesBtn');
      var cookiesWarn = document.getElementById('cookiesWarn');
      var impersonateSelect = document.getElementById('impersonateSelect');
      var rateLimitInput = document.getElementById('rateLimitInput');
      var retriesInput = document.getElementById('retriesInput');
      var fragmentRetriesInput = document.getElementById('fragmentRetriesInput');
      var queueRetrySelect = document.getElementById('queueRetrySelect');
      var pillOpenInHandler = document.getElementById('pillOpenInHandler');
      var pillAutoExportAfterOpen = document.getElementById('pillAutoExportAfterOpen');
      var pillEnqueueBatch = document.getElementById('pillEnqueueBatch');
      var pillAutoStartBatch = document.getElementById('pillAutoStartBatch');
      var extraArgsInput = document.getElementById('extraArgsInput');
      var previewOutDirOverride = document.getElementById('previewOutDirOverride');
      var argsPreview = document.getElementById('argsPreview');
      var extraArgsWarn = document.getElementById('extraArgsWarn');
      var hintFilter = document.getElementById('hintFilter');
      var hintList = document.getElementById('hintList');
      var historyBody = document.getElementById('historyBody');
      var refreshHistoryBtn = document.getElementById('refreshHistoryBtn');
      var clearHistoryBtn = document.getElementById('clearHistoryBtn');
      var historyOutcomeFilter = document.getElementById('historyOutcomeFilter');
      var narrowPopoutMq = window.matchMedia('(max-width: 960px)');
${DOWNLOADS_WINDOW_HTML_SCRIPT_SHELL}
${buildDownloadsWindowHtmlScriptHistoryFragment()}
${buildDownloadsWindowHtmlScriptOptsLogFragment()}
${DOWNLOADS_WINDOW_HTML_SCRIPT_QUEUE}
${DOWNLOADS_WINDOW_HTML_SCRIPT_WIREUP}
    })();
  </script>`
}

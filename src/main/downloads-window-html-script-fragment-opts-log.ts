import { DOWNLOADS_VISIBLE_LOG_SAVE_CANCELLED } from '../shared/downloads-log-contract'

/**
 * Pop-out downloads inline script — hints, refreshCliOpts, log panel (`buildDownloadsHtml`).
 */
export function buildDownloadsWindowHtmlScriptOptsLogFragment(): string {
  return `      function applyCommandHints(hints) {
        lastCommandHints = Array.isArray(hints) ? hints : [];
        renderHintList();
      }

      var lastCommandHints = [];
      function renderHintList() {
        if (!hintList) return;
        var raw = Array.isArray(lastCommandHints) ? lastCommandHints : [];
        var q = hintFilter && typeof hintFilter.value === 'string' ? hintFilter.value.trim().toLowerCase() : '';
        hintList.replaceChildren();
        if (raw.length === 0) {
          var empty = document.createElement('div');
          empty.className = 'hint-item';
          empty.style.opacity = '0.7';
          empty.textContent = DL_I18N.hintsCatalogUnavailable;
          hintList.appendChild(empty);
          return;
        }
        var byCat = new Map();
        raw.forEach(function (h) {
          if (!h || typeof h.token !== 'string') return;
          var token = h.token;
          var summary = typeof h.summary === 'string' ? h.summary : '';
          if (q) {
            var hay = (token + ' ' + summary).toLowerCase();
            if (hay.indexOf(q) === -1) return;
          }
          var cat = typeof h.category === 'string' && h.category.length ? h.category : DL_I18N.hintCategoryFallback;
          if (!byCat.has(cat)) byCat.set(cat, []);
          byCat.get(cat).push({ token: token, summary: summary });
        });
        if (byCat.size === 0) {
          var none = document.createElement('div');
          none.className = 'hint-item';
          none.style.opacity = '0.7';
          none.textContent = DL_I18N.hintsNoMatches;
          hintList.appendChild(none);
          return;
        }
        Array.from(byCat.keys()).sort(_ytdlpCmpCat).forEach(function (cat) {
          var head = document.createElement('div');
          head.className = 'hint-cat';
          head.textContent = cat;
          hintList.appendChild(head);
          byCat.get(cat).forEach(function (row) {
            var item = document.createElement('div');
            item.className = 'hint-item';
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'hint-token';
            btn.textContent = row.token;
            btn.title = row.summary || row.token;
            btn.addEventListener('click', function () {
              if (!extraArgsInput) return;
              var cur = extraArgsInput.value.trim();
              extraArgsInput.value = cur ? cur + ' ' + row.token : row.token;
              try {
                extraArgsInput.focus();
                extraArgsInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
              } catch (e) {}
              schedulePreviewRefresh();
            });
            item.appendChild(btn);
            if (row.summary) {
              var desc = document.createElement('div');
              desc.className = 'hint-desc';
              desc.textContent = row.summary;
              item.appendChild(desc);
            }
            hintList.appendChild(item);
          });
        });
      }

      if (hintFilter) {
        hintFilter.addEventListener('input', function () {
          renderHintList();
        });
      }

      function refreshCliOpts() {
        api.getCliOptions({ uiLocale: DL_LOCALE_CMP }).then(function (r) {
          if (!r || r.ok !== true || !r.payload) return;
          var p = r.payload;
          if (tmplInput) tmplInput.value = p.filenameTemplate || '';
          if (pillPlaylist && typeof p.downloadPlaylist === 'boolean') {
            pillSet(pillPlaylist, p.downloadPlaylist);
          }
          if (pillAudioOnly && typeof p.audioOnly === 'boolean') {
            pillSet(pillAudioOnly, p.audioOnly);
          }
          if (subPreset && typeof p.subtitlePreset === 'string') {
            subPreset.value = p.subtitlePreset === 'manual' || p.subtitlePreset === 'manual_auto'
              ? p.subtitlePreset
              : 'none';
          }
          if (subLangsInput && typeof p.subLangsLine === 'string') {
            subLangsInput.value = p.subLangsLine;
          }
          if (cookiesBrowserSelect && typeof p.cookiesBrowserChoice === 'string') {
            var cb = p.cookiesBrowserChoice;
            cookiesBrowserSelect.value =
              cb === 'chrome' || cb === 'edge' || cb === 'firefox' ? cb : 'none';
          }
          if (cookiesBrowserProfileInput && typeof p.cookiesBrowserProfileLine === 'string') {
            cookiesBrowserProfileInput.value = p.cookiesBrowserProfileLine;
          }
          if (cookiesPathText && typeof p.cookiesFilePathStored === 'string') {
            var cp = p.cookiesFilePathStored;
            cookiesPathText.textContent = cp.length > 0 ? cp : '—';
            cookiesPathText.title = cp.length > 0 ? cp : '';
          }
          if (cookiesWarn) {
            if (p.cookiesWarning) {
              cookiesWarn.textContent = p.cookiesWarning;
              cookiesWarn.hidden = false;
            } else {
              cookiesWarn.textContent = '';
              cookiesWarn.hidden = true;
            }
          }
          if (impersonateSelect && typeof p.impersonateChoice === 'string') {
            var im = p.impersonateChoice;
            impersonateSelect.value =
              im === 'chrome' || im === 'edge' || im === 'firefox' ? im : 'none';
          }
          if (rateLimitInput && typeof p.rateLimit === 'string') {
            rateLimitInput.value = p.rateLimit;
          }
          if (retriesInput && typeof p.retriesLine === 'string') {
            retriesInput.value = p.retriesLine;
          }
          if (fragmentRetriesInput && typeof p.fragmentRetriesLine === 'string') {
            fragmentRetriesInput.value = p.fragmentRetriesLine;
          }
          if (queueRetrySelect && typeof p.queueRetryProfile === 'string') {
            var qv = p.queueRetryProfile;
            queueRetrySelect.value =
              qv === 'light' || qv === 'normal' || qv === 'persistent' ? qv : 'off';
          }
          if (pillOpenInHandler && typeof p.openInHandlerOnComplete === 'boolean') {
            pillSet(pillOpenInHandler, p.openInHandlerOnComplete);
          }
          if (pillAutoExportAfterOpen && typeof p.autoExportAfterOpenInHandler === 'boolean') {
            pillSet(pillAutoExportAfterOpen, p.autoExportAfterOpenInHandler);
          }
          if (pillEnqueueBatch && typeof p.enqueueBatchOnDownloadComplete === 'boolean') {
            pillSet(pillEnqueueBatch, p.enqueueBatchOnDownloadComplete);
          }
          if (pillAutoStartBatch && typeof p.autoStartBatchAfterEnqueue === 'boolean') {
            pillSet(pillAutoStartBatch, p.autoStartBatchAfterEnqueue);
          }
          syncAutoExportPillLocked();
          syncAutoStartBatchPillLocked();
          if (!fmtPreset) return;
          fmtPreset.replaceChildren();
          (p.formatPresetChoices || []).forEach(function (c) {
            var o = document.createElement('option');
            o.value = c.id;
            o.textContent = c.label;
            fmtPreset.appendChild(o);
          });
          fmtPreset.value = p.formatPreset || 'default';
          syncFmtPresetAudioLock();
          if (extraArgsInput && typeof p.extraArgsLine === 'string') {
            extraArgsInput.value = p.extraArgsLine;
          }
          if (argsPreview && typeof p.commandPreview === 'string') {
            argsPreview.textContent = p.commandPreview;
          }
          if (extraArgsWarn) {
            if (p.extraArgsParseWarning) {
              extraArgsWarn.textContent = p.extraArgsParseWarning;
              extraArgsWarn.hidden = false;
            } else {
              extraArgsWarn.textContent = '';
              extraArgsWarn.hidden = true;
            }
          }
          applyCommandHints(p.commandHints);
          cliFormHydrated = true;
          refreshPreviewOnly();
        });
      }

      function refreshOutDir() {
        api.getOutputDirectory().then(function (r) {
          if (!r || typeof r.path !== 'string') return;
          outDirText.textContent = r.path;
          outDirText.title = r.path;
          resetOutBtn.disabled = r.isDefault === true;
        });
      }
      var logPre = document.getElementById('logPre');
      var logDetails = document.getElementById('logDetails');
      var saveLogBtn = document.getElementById('saveLogBtn');
      var clearLogBtn = document.getElementById('clearLogBtn');
      var logMeta = document.getElementById('logMeta');
      var logTargetRowId = null;
      var maxLogChars = 240000;

      function getVisibleLogPlainText() {
        if (!logPre) return '';
        var parts = [];
        logPre.querySelectorAll('.log-line').forEach(function (el) {
          parts.push(el.textContent || '');
        });
        return parts.length ? parts.join('\\\\\\\\n') + '\\\\\\\\n' : '';
      }

      function updateLogMeta() {
        if (!logMeta || !logPre) return;
        var lines = logPre.querySelectorAll('.log-line').length;
        var chars = logPre.textContent.length;
        var sz = chars >= 1024 ? (Math.round((chars / 1024) * 10) / 10) + ' KiB' : chars + ' B';
        logMeta.textContent = lines + ' ' + DL_I18N.logLinesWord + ' · ' + sz;
      }

      function trimLogDom() {
        if (!logPre) return;
        while (logPre.textContent.length > maxLogChars && logPre.firstChild) {
          logPre.removeChild(logPre.firstChild);
        }
      }

      function appendLogLine(stream, text) {
        if (!logPre) return;
        var wrap = document.createElement('span');
        wrap.className = 'log-line log-line-' + (stream === 'stdout' ? 'out' : 'err');
        var tag = document.createElement('span');
        tag.className = 'log-line-tag';
        tag.textContent = stream === 'stdout' ? 'out ' : 'err ';
        var body = document.createElement('span');
        body.className = 'log-line-body';
        body.textContent = text;
        wrap.appendChild(tag);
        wrap.appendChild(body);
        logPre.appendChild(wrap);
        trimLogDom();
        logPre.scrollTop = logPre.scrollHeight;
        updateLogMeta();
      }

      function clearVisibleLog() {
        if (!logPre) return;
        logPre.replaceChildren();
        updateLogMeta();
      }

      api.onLog(function (payload) {
        if (!payload || typeof payload !== 'object') return;
        if (payload.kind === 'reset') {
          logTargetRowId = payload.rowId;
          clearVisibleLog();
          if (logDetails && !logDetails.open) {
            suppressDetailsUiPersist = true;
            if (suppressDetailsUiPersistTimer !== null) {
              window.clearTimeout(suppressDetailsUiPersistTimer);
            }
            logDetails.open = true;
            suppressDetailsUiPersistTimer = window.setTimeout(function () {
              suppressDetailsUiPersist = false;
              suppressDetailsUiPersistTimer = null;
            }, 0);
          }
          return;
        }
        if (payload.kind === 'line' && payload.rowId === logTargetRowId) {
          appendLogLine(payload.stream, payload.text);
        }
      });
      updateLogMeta();
      if (clearLogBtn) {
        clearLogBtn.addEventListener('click', function () {
          clearVisibleLog();
        });
      }
      if (saveLogBtn) {
        saveLogBtn.addEventListener('click', function () {
          var text = getVisibleLogPlainText();
          if (!text.trim()) {
            window.alert(DL_I18N.logEmptyAlert);
            return;
          }
          api.saveVisibleLog(text).then(function (res) {
            if (res && res.ok === false && res.error && res.error !== ${JSON.stringify(DOWNLOADS_VISIBLE_LOG_SAVE_CANCELLED)}) {
              window.alert(res.error);
            }
          });
        });
      }
`
}

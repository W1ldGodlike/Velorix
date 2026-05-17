import { emitDownloadsQueueRowIcoBootstrapJs } from '../shared/lucide-downloads-icons'

/**
 * Pop-out downloads inline script — history table + handlers (`buildDownloadsHtml`).
 */
export function buildDownloadsWindowHtmlScriptHistoryFragment(): string {
  return `      function formatHistoryWhen(ms) {
        try {
          var d = new Date(ms);
          if (isNaN(d.getTime())) return '—';
          return d.toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'medium' });
        } catch (e) {
          return '—';
        }
      }

      function outcomeCellClass(o) {
        if (o === 'success') return 'h-out-ok';
        if (o === 'cancelled') return 'h-out-can';
        return 'h-out-err';
      }

      function outcomeLabel(o) {
        if (o === 'success') return DL_I18N.outcomeSuccess;
        if (o === 'cancelled') return DL_I18N.outcomeCancelled;
        return DL_I18N.outcomeError;
      }

      function isRowDownloading(status) {
        return status === QS_RUNNING || (typeof status === 'string' && status.indexOf(QS_RETRY) === 0);
      }

      /** §6/v0 — stroke-иконки очереди: единый источник путей lucide-downloads-icons (shared). */
      var SVG_NS = 'http://www.w3.org/2000/svg';
      function svgEl(tag, attrs) {
        var n = document.createElementNS(SVG_NS, tag);
        if (attrs) {
          Object.keys(attrs).forEach(function (k) {
            n.setAttribute(k, attrs[k]);
          });
        }
        return n;
      }
      function svgIcon(paths) {
        var svg = svgEl('svg', {
          width: '16',
          height: '16',
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': '2',
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round'
        });
        paths.forEach(function (p) {
          var el = svgEl(p.tag, p.attr);
          svg.appendChild(el);
        });
        return svg;
      }
${emitDownloadsQueueRowIcoBootstrapJs()}
      function renderHistoryEntries(raw) {
        if (!historyBody) return;
        lastHistoryEntries = Array.isArray(raw) ? raw : [];
        var filter = historyOutcomeFilter ? historyOutcomeFilter.value : 'all';
        var list = lastHistoryEntries.filter(function (entry) {
          if (filter === 'all') return true;
          return entry && typeof entry === 'object' && entry.outcome === filter;
        });
        historyBody.replaceChildren();
        if (list.length === 0) {
          var tr0 = document.createElement('tr');
          var td0 = document.createElement('td');
          td0.colSpan = 7;
          td0.style.opacity = '0.7';
          td0.textContent = lastHistoryEntries.length === 0 ? DL_I18N.historyEmpty : DL_I18N.historyNoMatchingFilter;
          tr0.appendChild(td0);
          historyBody.appendChild(tr0);
          return;
        }
        list.forEach(function (e) {
          if (!e || typeof e !== 'object') return;
          var tr = document.createElement('tr');
          function td(cls, text) {
            var x = document.createElement('td');
            if (cls) x.className = cls;
            x.textContent = text;
            return x;
          }
          var fin = typeof e.finishedAt === 'number' ? e.finishedAt : 0;
          tr.appendChild(td('num', formatHistoryWhen(fin)));
          tr.appendChild(td('', typeof e.shortLabel === 'string' && e.shortLabel ? e.shortLabel : '—'));
          var tdUrl = document.createElement('td');
          var u = typeof e.url === 'string' ? e.url : '';
          tdUrl.title = u;
          tdUrl.textContent = u.length > 80 ? u.slice(0, 78) + '…' : (u || '—');
          tr.appendChild(tdUrl);
          var oc = typeof e.outcome === 'string' ? e.outcome : 'error';
          tr.appendChild(td(outcomeCellClass(oc), outcomeLabel(oc)));
          var code = e.exitCode;
          var codeStr = code === null || code === undefined ? '—' : String(code);
          tr.appendChild(td('num', codeStr));
          var st = typeof e.status === 'string' ? e.status : '';
          tr.appendChild(td('', st.length > 120 ? st.slice(0, 118) + '…' : (st || '—')));
          var tdAction = document.createElement('td');
          tdAction.className = 'act';
          var histWrap = document.createElement('div');
          histWrap.className = 'act-icons';
          function mkHistIcon(title, attrs, iconFn, btnClass) {
            var b = document.createElement('button');
            b.type = 'button';
            b.className = 'icon-btn' + (btnClass ? ' ' + btnClass : '');
            b.title = title;
            b.setAttribute('aria-label', title);
            Object.keys(attrs).forEach(function (ak) {
              b.setAttribute(ak, attrs[ak]);
            });
            b.appendChild(iconFn());
            histWrap.appendChild(b);
          }
          if (u) {
            mkHistIcon(
              DL_I18N.histReenqueueUrl,
              { 'data-history-url': u },
              RowIco.plus,
              ''
            );
          }
          if (typeof e.outputPath === 'string' && e.outputPath) {
            var hid = typeof e.id === 'string' ? e.id : '';
            mkHistIcon(
              DL_I18N.histOpenInFlux,
              { 'data-history-handler': hid },
              RowIco.outbound,
              ''
            );
            mkHistIcon(
              DL_I18N.histOpenFile,
              { 'data-history-open': 'file', 'data-history-id': hid },
              RowIco.file,
              ''
            );
            mkHistIcon(
              DL_I18N.histShowInFolder,
              { 'data-history-open': 'folder', 'data-history-id': hid },
              RowIco.folder,
              ''
            );
          }
          tdAction.appendChild(histWrap);
          tr.appendChild(tdAction);
          historyBody.appendChild(tr);
        });
      }

      function refreshHistory() {
        api.getHistory().then(renderHistoryEntries);
      }

      function scheduleHistoryRefresh() {
        if (historyRefreshTimer !== null) {
          clearTimeout(historyRefreshTimer);
        }
        historyRefreshTimer = setTimeout(function () {
          historyRefreshTimer = null;
          refreshHistory();
        }, 300);
      }

      if (refreshHistoryBtn) {
        refreshHistoryBtn.addEventListener('click', function () {
          refreshHistory();
        });
      }
      if (historyOutcomeFilter) {
        historyOutcomeFilter.addEventListener('change', function () {
          renderHistoryEntries(lastHistoryEntries);
        });
      }
      if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', function () {
          if (!window.confirm(DL_I18N.confirmClearHistory)) return;
          api.clearHistory().then(function (res) {
            if (res && res.ok === false && res.error) window.alert(res.error);
            refreshHistory();
          });
        });
      }
      if (historyBody) {
        historyBody.addEventListener('click', function (e) {
          var handler = e.target.closest('[data-history-handler]');
          if (handler) {
            var handlerId = handler.getAttribute('data-history-handler') || '';
            api.openHistoryOutputInHandler(handlerId).then(function (res) {
              if (res && res.ok === false && res.error) window.alert(res.error);
            });
            return;
          }
          var open = e.target.closest('[data-history-open]');
          if (open) {
            var mode = open.getAttribute('data-history-open') || 'file';
            var hid = open.getAttribute('data-history-id') || '';
            api.openHistoryOutput(hid, mode).then(function (res) {
              if (res && res.ok === false && res.error) window.alert(res.error);
            });
            return;
          }
          var t = e.target.closest('[data-history-url]');
          if (!t) return;
          var url = t.getAttribute('data-history-url') || '';
          if (!url) return;
          api.addLines(url).then(function (res) {
            if (res && res.ok === false && res.error) {
              window.alert(res.error);
              return;
            }
            api.getSnapshot().then(onQueueSnapshot);
          });
        });
      }`
}

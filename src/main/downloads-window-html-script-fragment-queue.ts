/**
 * Pop-out downloads inline script — queue rows, toolbar row actions (`buildDownloadsHtml`).
 */
export const DOWNLOADS_WINDOW_HTML_SCRIPT_QUEUE = `      function rowShape(r) {
        return r && typeof r.id === 'number' && typeof r.url === 'string';
      }

      function rowCanRetry(status) {
        if (status === QS_WAITING || status === QS_RUNNING) return false;
        return !(typeof status === 'string' && status.indexOf(QS_RETRY) === 0);
      }

      function queueRowMatchesFilter(row, filter) {
        var status = typeof row.status === 'string' ? row.status : '';
        if (filter === 'all') return true;
        if (filter === 'waiting') return status === QS_WAITING;
        if (filter === 'running') return status === QS_RUNNING || status.indexOf(QS_RETRY) === 0;
        if (filter === 'done') return status === QS_DONE;
        if (filter === 'cancelled') return status === QS_CANCELLED;
        if (filter === 'error') return status.indexOf(QS_ERR) === 0;
        return true;
      }

      function statusClass(status) {
        if (status === QS_RUNNING || status.indexOf(QS_RETRY) === 0) return 'status-running';
        if (status === QS_DONE) return 'status-done';
        if (status === QS_CANCELLED) return 'status-cancelled';
        if (status.indexOf(QS_ERR) === 0) return 'status-error';
        return 'status-waiting';
      }

      function parseProgressPercent(text) {
        var m = String(text || '').match(/(\\\\\\\\d+(?:[.,]\\\\\\\\d+)?)\\\\\\\\s*%/);
        if (!m) return null;
        var n = Number(m[1].replace(',', '.'));
        if (!isFinite(n)) return null;
        return Math.max(0, Math.min(100, n));
      }

      function tdProgress(row) {
        var td = document.createElement('td');
        td.className = 'prog';
        var raw =
          row && typeof row.progress === 'string' && row.progress.trim().length > 0 ? row.progress.trim() : '—';
        var status = typeof (row && row.status) === 'string' ? row.status : '';
        var segs = raw === '—' ? [] : raw.split(' · ');
        var head = segs.length > 0 && segs[0] ? segs[0].trim() : raw;
        var pct = parseProgressPercent(head);
        if (status === QS_DONE) {
          pct = 100;
        }
        var showBar = pct !== null && isFinite(pct);
        if (status === QS_WAITING) {
          showBar = false;
        }
        var stack = document.createElement('div');
        stack.className = 'prog-stack';
        if (showBar && pct !== null) {
          var rowBar = document.createElement('div');
          rowBar.className = 'prog-bar-row';
          var track = document.createElement('div');
          track.className = 'progress-track';
          var fill = document.createElement('div');
          var done = status === QS_DONE;
          fill.className = 'progress-fill' + (done ? ' progress-fill-done' : '');
          fill.style.width = Math.max(0, Math.min(100, pct)) + '%';
          track.appendChild(fill);
          rowBar.appendChild(track);
          var pctEl = document.createElement('span');
          pctEl.className = 'prog-pct' + (done ? ' prog-pct-done' : '');
          pctEl.textContent = Math.round(pct) + '%';
          rowBar.appendChild(pctEl);
          stack.appendChild(rowBar);
        }
        var subline = '';
        if (raw === '—') {
          subline = '—';
        } else if (segs.length > 1) {
          subline = segs.slice(1).join(' · ').trim();
        } else if (!showBar) {
          subline = head;
        }
        if (subline) {
          var label = document.createElement('div');
          label.className = 'prog-head';
          label.textContent = subline;
          stack.appendChild(label);
        }
        td.appendChild(stack);
        return td;
      }
      function snapStr(row, key) {
        var v = row[key];
        return typeof v === 'string' && v.trim().length > 0 ? v.trim() : '';
      }
      function tdFmtCell(row) {
        var td = document.createElement('td');
        td.className = 'queue-col-fmt';
        var full = snapStr(row, 'queueFmt');
        if (!full.length) {
          td.textContent = '—';
          return td;
        }
        td.title = full;
        td.textContent = full.length > 24 ? full.slice(0, 22) + '…' : full;
        return td;
      }
      function tdSizeCell(row) {
        var td = document.createElement('td');
        td.className = 'queue-col-size';
        var s = snapStr(row, 'queueSize');
        td.textContent = s.length ? s : '—';
        return td;
      }
      function tdSpdCell(row) {
        var td = document.createElement('td');
        td.className = 'queue-col-spd';
        var s = snapStr(row, 'queueSpeed');
        td.textContent = s.length ? s : '—';
        td.title = s.length > 36 ? s : '';
        return td;
      }
      function tdEtaCell(row) {
        var td = document.createElement('td');
        td.className = 'queue-col-eta';
        var s = snapStr(row, 'queueEta');
        td.textContent = s.length ? s : '—';
        return td;
      }

      function tdStatus(status) {
        var td = document.createElement('td');
        var s = status || '—';
        var pill = document.createElement('span');
        pill.className = 'status-pill ' + statusClass(s);
        pill.title = s;
        var dot = document.createElement('span');
        dot.className = 'status-dot';
        var label = document.createElement('span');
        label.textContent = s;
        pill.appendChild(dot);
        pill.appendChild(label);
        td.appendChild(pill);
        return td;
      }

      function updateQueueSummary(rows) {
        if (!queueSummary) return;
        var total = rows.length;
        var waiting = 0;
        var running = 0;
        var done = 0;
        var error = 0;
        var cancelled = 0;
        rows.forEach(function (row) {
          var status = typeof row.status === 'string' ? row.status : '';
          if (status === QS_WAITING) waiting += 1;
          else if (status === QS_RUNNING || status.indexOf(QS_RETRY) === 0) running += 1;
          else if (status === QS_DONE) done += 1;
          else if (status === QS_CANCELLED) cancelled += 1;
          else if (status.indexOf(QS_ERR) === 0) error += 1;
        });
        queueSummary.textContent =
          DL_I18N.queueTotal + ' ' + total +
          ' · ' + DL_I18N.queueWaiting + ' ' + waiting +
          ' · ' + DL_I18N.queueRunning + ' ' + running +
          ' · ' + DL_I18N.queueDone + ' ' + done +
          ' · ' + DL_I18N.queueErrors + ' ' + error +
          ' · ' + DL_I18N.queueCancelled + ' ' + cancelled;
      }

      function renderRows(rawRows) {
        lastQueueRows = Array.isArray(rawRows) ? rawRows.filter(rowShape) : [];
        updateQueueSummary(lastQueueRows);
        var filter = queueStatusFilter ? queueStatusFilter.value : 'all';
        var rows = lastQueueRows.filter(function (row) {
          return queueRowMatchesFilter(row, filter);
        });
        body.replaceChildren();
        if (rows.length === 0) {
          var tr0 = document.createElement('tr');
          var td0 = document.createElement('td');
          td0.colSpan = 9;
          td0.style.opacity = '0.7';
          td0.textContent = lastQueueRows.length === 0 ? DL_I18N.queueEmpty : DL_I18N.queueNoMatchingFilter;
          tr0.appendChild(td0);
          body.appendChild(tr0);
          return;
        }
        rows.forEach(function (r, i) {
          var tr = document.createElement('tr');
          function tdText(cls, text) {
            var td = document.createElement('td');
            if (cls) td.className = cls;
            td.textContent = text;
            return td;
          }
          tr.appendChild(tdText('num', String(i + 1)));
          var tdTitle = document.createElement('td');
          var name = document.createElement('div');
          name.className = 'queue-title';
          name.textContent = r.shortLabel || '—';
          var url = document.createElement('div');
          url.className = 'queue-url';
          url.title = r.url;
          url.textContent = r.url.length > 120 ? r.url.slice(0, 118) + '…' : r.url;
          tdTitle.appendChild(name);
          tdTitle.appendChild(url);
          tr.appendChild(tdTitle);
          tr.appendChild(tdFmtCell(r));
          tr.appendChild(tdSizeCell(r));
          tr.appendChild(tdProgress(r));
          tr.appendChild(tdSpdCell(r));
          tr.appendChild(tdEtaCell(r));
          tr.appendChild(tdStatus(r.status || '—'));
          var tdAct = document.createElement('td');
          tdAct.className = 'act';
          var wrap = document.createElement('div');
          wrap.className = 'act-icons';
          function mkIcon(act, title, id, nodeFn, btnClass) {
            var b = document.createElement('button');
            b.type = 'button';
            b.className = 'icon-btn' + (btnClass ? ' ' + btnClass : '');
            b.setAttribute('data-act', act);
            b.setAttribute('data-id', String(id));
            b.title = title;
            b.setAttribute('aria-label', title);
            b.appendChild(nodeFn());
            wrap.appendChild(b);
          }
          var st = typeof r.status === 'string' ? r.status : '';
          var activeRun = !!r.isActiveRunner;
          var dl = isRowDownloading(st);
          if (dl && activeRun) {
            mkIcon(
              'row-cancel',
              DL_I18N.rowCancelYtdlp,
              r.id,
              RowIco.stop,
              'icon-btn-warn'
            );
          }
          if (dl && activeRun) {
            var canPause = r.ytdlpPauseSupported && r.ytdlpPauseChildActive;
            if (canPause) {
              var pTitle = r.ytdlpPaused ? DL_I18N.rowResumeYtdlp : DL_I18N.rowPauseYtdlp;
              var pFactory = r.ytdlpPaused ? RowIco.play : RowIco.pause;
              mkIcon('row-pause-toggle', pTitle, r.id, pFactory, '');
            } else {
              var bPause = document.createElement('button');
              bPause.type = 'button';
              bPause.className = 'icon-btn';
              bPause.disabled = true;
              bPause.title = !r.ytdlpPauseSupported
                ? DL_I18N.pauseUnsupportedWinTitle
                : DL_I18N.rowPauseYtdlp;
              bPause.setAttribute('aria-label', bPause.title);
              bPause.appendChild(RowIco.pause());
              wrap.appendChild(bPause);
            }
          }
          if (st === QS_WAITING) {
            mkIcon('start', DL_I18N.rowStartThisLine, r.id, RowIco.play, '');
          } else if (rowCanRetry(st)) {
            mkIcon('retry', DL_I18N.rowRetryDownload, r.id, RowIco.retry, '');
          }
          var outp = typeof r.outputPath === 'string' && r.outputPath;
          if (outp) {
            mkIcon(
              'open-handler',
              DL_I18N.rowOpenInFlux,
              r.id,
              RowIco.outbound,
              ''
            );
            mkIcon('open-file', DL_I18N.rowOpenFile, r.id, RowIco.file, '');
            mkIcon('open-folder', DL_I18N.rowShowInFolder, r.id, RowIco.folder, '');
          } else {
            mkIcon('open-folder', DL_I18N.rowOpenDownloadFolder, r.id, RowIco.folder, '');
          }
          mkIcon('up', DL_I18N.rowMoveUp, r.id, RowIco.chevUp, '');
          mkIcon('dn', DL_I18N.rowMoveDown, r.id, RowIco.chevDown, '');
          mkIcon('rm', DL_I18N.rowRemoveFromQueue, r.id, RowIco.trash, '');
          tdAct.appendChild(wrap);
          tr.appendChild(tdAct);
          body.appendChild(tr);
        });
      }

      body.addEventListener('click', function (e) {
        var t = e.target.closest('[data-act]');
        if (!t) return;
        var act = t.getAttribute('data-act');
        var id = Number(t.getAttribute('data-id'));
        if (act === 'rm') {
          api.removeRow(id).then(function (res) {
            if (res && res.ok === false && res.error) window.alert(res.error);
          });
        }
        else if (act === 'up' || act === 'dn') {
          api.moveRow(id, act === 'up' ? -1 : 1).then(function (res) {
            if (res && res.ok === false && res.error) window.alert(res.error);
          });
        }
        else if (act === 'retry') {
          api.retryRow(id).then(function (res) {
            if (res && res.ok === false && res.error) {
              window.alert(res.error);
            }
          });
        }
        else if (act === 'open-file' || act === 'open-folder') {
          api.openQueueOutput(id, act === 'open-folder' ? 'folder' : 'file').then(function (res) {
            if (res && res.ok === false && res.error) {
              window.alert(res.error);
            }
          });
        }
        else if (act === 'open-handler') {
          api.openQueueOutputInHandler(id).then(function (res) {
            if (res && res.ok === false && res.error) {
              window.alert(res.error);
            }
          });
        }
        else if (act === 'start') {
          api.startRow(id).then(function (res) {
            if (res && res.ok === false && res.error) {
              window.alert(res.error);
            }
          });
        } else if (act === 'row-cancel') {
          api.cancelQueue().then(function (res) {
            if (res && res.ok === false && res.error) window.alert(res.error);
            refreshPauseBtn();
          });
        } else if (act === 'row-pause-toggle') {
          api.getYtdlpPauseState().then(function (s) {
            if (!s || !s.supported || !s.active) return;
            var p = s.paused ? api.resumeYtdlp() : api.pauseYtdlp();
            p.then(function (res) {
              if (res && res.ok === false && res.error) window.alert(res.error);
              refreshPauseBtn();
              api.getSnapshot().then(onQueueSnapshot);
            });
          });
        }
      });
      if (queueStatusFilter) {
        queueStatusFilter.addEventListener('change', function () {
          renderRows(lastQueueRows);
        });
      }

      addBtn.addEventListener('click', function () {
        api.addLines(urls.value).then(function (res) {
          if (res && res.ok === false && res.error) {
            window.alert(res.error);
            return;
          }
          urls.value = '';
        });
      });
      clearBtn.addEventListener('click', function () {
        api.clearQueue().then(function (res) {
          if (res && res.ok === false && res.error) window.alert(res.error);
        });
      });
      if (clearFinishedBtn) {
        clearFinishedBtn.addEventListener('click', function () {
          api.clearFinishedRows().then(function (res) {
            if (res && res.ok === false && res.error) {
              window.alert(res.error);
              return;
            }
            api.getSnapshot().then(onQueueSnapshot);
          });
        });
      }
      startBtn.addEventListener('click', function () {
        api.startQueue().then(function (res) {
          if (res && res.ok === false && res.error) window.alert(res.error);
        });
      });`

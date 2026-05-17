/**
 * Pop-out downloads inline script — toolbar, DnD, IPC bootstrap (`buildDownloadsHtml`).
 */
export const DOWNLOADS_WINDOW_HTML_SCRIPT_WIREUP = `      function refreshPauseBtn() {
        if (!pauseYtdlpBtn || !api.getYtdlpPauseState) return;
        api.getYtdlpPauseState().then(function (s) {
          if (!pauseYtdlpBtn) return;
          if (!s.supported) {
            pauseYtdlpBtn.disabled = true;
            pauseYtdlpBtn.textContent = DL_I18N.toolbarPause;
            pauseYtdlpBtn.title = DL_I18N.pauseUnsupportedWinTitle;
            return;
          }
          pauseYtdlpBtn.disabled = !s.active;
          if (!s.active) {
            pauseYtdlpBtn.textContent = DL_I18N.toolbarPause;
            pauseYtdlpBtn.title = DL_I18N.pauseTitleSigstop;
          } else if (s.paused) {
            pauseYtdlpBtn.textContent = DL_I18N.pauseToolbarResume;
            pauseYtdlpBtn.title = DL_I18N.resumeTitleSigcont;
          } else {
            pauseYtdlpBtn.textContent = DL_I18N.toolbarPause;
            pauseYtdlpBtn.title = DL_I18N.pauseTitleSigstop;
          }
        });
      }
      if (pauseYtdlpBtn) {
        pauseYtdlpBtn.addEventListener('click', function () {
          api.getYtdlpPauseState().then(function (s) {
            if (!s.supported || !s.active) return;
            var p = s.paused ? api.resumeYtdlp() : api.pauseYtdlp();
            p.then(function (res) {
              if (res && res.ok === false && res.error) window.alert(res.error);
              refreshPauseBtn();
            });
          });
        });
      }
      cancelBtn.addEventListener('click', function () {
        api.cancelQueue();
      });

      pickOutBtn.addEventListener('click', function () {
        api.pickOutputDirectory().then(function (res) {
          if (res && res.ok === false && res.error) window.alert(res.error);
          refreshOutDir();
          schedulePreviewRefresh();
        });
      });
      openOutBtn.addEventListener('click', function () {
        api.openOutputDirectory().then(function (res) {
          if (res && res.ok === false && res.error) window.alert(res.error);
        });
      });
      resetOutBtn.addEventListener('click', function () {
        api.clearOutputDirectory().then(function (res) {
          if (res && res.ok === false && res.error) {
            window.alert(res.error);
            return;
          }
          refreshOutDir();
          schedulePreviewRefresh();
        });
      });

      if (pickCookiesBtn) {
        pickCookiesBtn.addEventListener('click', function () {
          api.pickCookiesFile().then(function (res) {
            if (res && res.ok === false && res.error) window.alert(res.error);
            refreshCliOpts();
          });
        });
      }
      if (clearCookiesBtn) {
        clearCookiesBtn.addEventListener('click', function () {
          api.clearCookiesFile().then(function (res) {
            if (res && res.ok === false && res.error) {
              window.alert(res.error);
              return;
            }
            refreshCliOpts();
          });
        });
      }

      if (applyOptsBtn && tmplInput && fmtPreset) {
        applyOptsBtn.addEventListener('click', function () {
          api.setCliOptions({
            filenameTemplate: tmplInput.value,
            formatPreset: fmtPreset.value,
            downloadPlaylist: pillIsOn(pillPlaylist),
            audioOnly: pillIsOn(pillAudioOnly),
            subtitlePreset: subPreset ? subPreset.value : 'none',
            subLangs: subLangsInput ? subLangsInput.value : '',
            cookiesBrowser: cookiesBrowserSelect ? cookiesBrowserSelect.value : 'none',
            cookiesBrowserProfile: cookiesBrowserProfileInput
              ? cookiesBrowserProfileInput.value
              : '',
            impersonate: impersonateSelect ? impersonateSelect.value : 'none',
            rateLimit: rateLimitInput ? rateLimitInput.value : '',
            retriesLine: retriesInput ? retriesInput.value : '',
            fragmentRetriesLine: fragmentRetriesInput ? fragmentRetriesInput.value : '',
            queueRetryProfile: queueRetrySelect ? queueRetrySelect.value : 'off',
            openInHandlerOnComplete: pillIsOn(pillOpenInHandler),
            autoExportAfterOpenInHandler: pillIsOn(pillAutoExportAfterOpen),
            enqueueBatchOnDownloadComplete: pillIsOn(pillEnqueueBatch),
            autoStartBatchAfterEnqueue: pillIsOn(pillAutoStartBatch),
            extraArgsLine: extraArgsInput ? extraArgsInput.value : ''
          }).then(function (res) {
            if (res && res.ok === false && res.error) window.alert(res.error);
            refreshCliOpts();
          });
        });
      }
      if (tmplReset && tmplInput) {
        tmplReset.addEventListener('click', function () {
          api.getCliOptions({ uiLocale: DL_LOCALE_CMP }).then(function (r) {
            if (r && r.ok === true && r.payload && r.payload.defaultFilenameTemplate) {
              tmplInput.value = r.payload.defaultFilenameTemplate;
              schedulePreviewRefresh();
            }
          });
        });
      }

      function attachPreviewRefreshOnInput(el) {
        if (!el || !el.addEventListener) return;
        el.addEventListener('input', function () {
          schedulePreviewRefresh();
        });
      }
      function attachPreviewRefreshOnChange(el) {
        if (!el || !el.addEventListener) return;
        el.addEventListener('change', function () {
          schedulePreviewRefresh();
        });
      }
      attachPreviewRefreshOnInput(tmplInput);
      attachPreviewRefreshOnChange(fmtPreset);
      attachPreviewRefreshOnChange(subPreset);
      attachPreviewRefreshOnInput(subLangsInput);
      attachPreviewRefreshOnChange(cookiesBrowserSelect);
      attachPreviewRefreshOnInput(cookiesBrowserProfileInput);
      attachPreviewRefreshOnChange(impersonateSelect);
      attachPreviewRefreshOnInput(rateLimitInput);
      attachPreviewRefreshOnInput(retriesInput);
      attachPreviewRefreshOnInput(fragmentRetriesInput);
      attachPreviewRefreshOnChange(queueRetrySelect);
      attachPreviewRefreshOnInput(extraArgsInput);
      attachPreviewRefreshOnInput(previewOutDirOverride);

      urls.addEventListener('dragover', function (e) {
        e.preventDefault();
        e.stopPropagation();
        urls.classList.add('drag');
      });
      urls.addEventListener('dragleave', function (e) {
        if (!urls.contains(e.relatedTarget)) urls.classList.remove('drag');
      });
      urls.addEventListener('drop', function (e) {
        e.preventDefault();
        e.stopPropagation();
        urls.classList.remove('drag');
        var txt = e.dataTransfer.getData('text/plain') || e.dataTransfer.getData('text/uri-list');
        if (txt) {
          api.addLines(txt).then(function (res) {
            if (res && res.ok === false && res.error) window.alert(res.error);
          });
        }
      });

      /** §6.1 — сброс ссылки/текста на таблицу, заголовок и т.д.: в очередь, без перехвата drop на полях ввода настроек. */
      function extractDroppedQueueText(dt) {
        if (!dt) return '';
        var plain = dt.getData('text/plain');
        if (plain && plain.trim()) return plain;
        var uriList = dt.getData('text/uri-list');
        if (uriList && uriList.trim()) return uriList;
        return '';
      }
      function isQueueDropExcludedTarget(el) {
        if (!el || !el.closest) return false;
        var node = el.closest('textarea, select, input');
        if (!node) return false;
        if (node.tagName === 'TEXTAREA' || node.tagName === 'SELECT') return true;
        var type = (node.type || '').toLowerCase();
        return (
          type === 'text' ||
          type === 'search' ||
          type === 'url' ||
          type === 'password' ||
          type === ''
        );
      }
      document.body.addEventListener('dragover', function (e) {
        if (isQueueDropExcludedTarget(e.target)) return;
        e.preventDefault();
      });
      document.body.addEventListener('drop', function (e) {
        if (isQueueDropExcludedTarget(e.target)) return;
        e.preventDefault();
        var txt = extractDroppedQueueText(e.dataTransfer);
        if (txt) {
          api.addLines(txt).then(function (res) {
            if (res && res.ok === false && res.error) window.alert(res.error);
          });
        }
      });

      function onQueueSnapshot(rows) {
        renderRows(rows);
        scheduleHistoryRefresh();
        schedulePreviewRefresh();
        refreshPauseBtn();
      }

      var optsPanelRoot = document.querySelector('.opts-panel');
      if (optsPanelRoot) {
        optsPanelRoot.addEventListener('change', function () {
          schedulePreviewRefresh();
        });
        optsPanelRoot.addEventListener('input', function () {
          schedulePreviewRefresh();
        });
      }

      function wireDetailsUiPersist(id, key) {
        var el = document.getElementById(id);
        if (!el || el.tagName !== 'DETAILS') return;
        el.addEventListener('toggle', function () {
          if (suppressDetailsUiPersist) return;
          var patch = {};
          patch[key] = el.open;
          api.mergeUiPanels(patch);
        });
      }
      wireDetailsUiPersist('historyDetails', 'history');
      wireDetailsUiPersist('logDetails', 'log');
      wireDetailsUiPersist('dlRailFormat', 'format');
      wireDetailsUiPersist('dlRailMeta', 'metadata');
      wireDetailsUiPersist('dlRailSave', 'saving');
      wireDetailsUiPersist('dlRailNet', 'network');
      wireDetailsUiPersist('expertArgsDetails', 'expert');
      wireDetailsUiPersist('hintsPanel', 'hints');

      function wireDownloadsTopbarBridges() {
        var pairs = [
          ['dlTopFilm', function () { return api.bridgeOpenInspector(null); }],
          [
            'dlTopUrl',
            function () {
              var el = document.getElementById('urls')
              if (el && typeof el.focus === 'function') {
                el.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
                el.focus()
              }
              return Promise.resolve({ ok: true })
            }
          ],
          ['dlTopHome', function () { return api.bridgeFocusMainEditor(); }],
          ['dlTopEngines', function () { return api.bridgeOpenEnginePaths(); }],
          ['dlTopHelp', function () { return api.bridgeOpenAbout(); }]
        ];
        pairs.forEach(function (pair) {
          var el = document.getElementById(pair[0]);
          if (!el) return;
          el.addEventListener('click', function () {
            Promise.resolve(pair[1]()).then(function (res) {
              if (res && res.ok === false && res.error) window.alert(res.error);
            }).catch(function (err) {
              window.alert(err && err.message ? err.message : String(err));
            });
          });
        });
      }
      wireDownloadsTopbarBridges();

      function applyDownloadsTheme(t) {
        document.documentElement.setAttribute('data-theme', t === 'light' ? 'light' : 'dark');
      }
      if (api && typeof api.onThemeChanged === 'function') {
        api.onThemeChanged(applyDownloadsTheme);
      }

      function applyDownloadsUiPanelsSnapshot(panels) {
        if (!panels || typeof panels !== 'object') return;
        var pairs = [
          ['historyDetails', 'history', false],
          ['logDetails', 'log', false],
          ['dlRailFormat', 'format', true],
          ['dlRailMeta', 'metadata', true],
          ['dlRailSave', 'saving', true],
          ['dlRailNet', 'network', false],
          ['expertArgsDetails', 'expert', false],
          ['hintsPanel', 'hints', true]
        ];
        suppressDetailsUiPersist = true;
        if (suppressDetailsUiPersistTimer !== null) {
          window.clearTimeout(suppressDetailsUiPersistTimer);
        }
        pairs.forEach(function (pair) {
          var el = document.getElementById(pair[0]);
          if (!el || el.tagName !== 'DETAILS') return;
          var v = panels[pair[1]];
          el.open = typeof v === 'boolean' ? v : pair[2];
        });
        suppressDetailsUiPersistTimer = window.setTimeout(function () {
          suppressDetailsUiPersist = false;
          suppressDetailsUiPersistTimer = null;
        }, 0);
      }
      if (api && typeof api.onDownloadsWindowUiPanelsChanged === 'function') {
        api.onDownloadsWindowUiPanelsChanged(applyDownloadsUiPanelsSnapshot);
      }
      if (api && typeof api.onDownloadsOutputDirectoryChanged === 'function') {
        api.onDownloadsOutputDirectoryChanged(function () {
          refreshOutDir();
          schedulePreviewRefresh();
        });
      }
      if (api && typeof api.onDownloadsCliOptionsChanged === 'function') {
        api.onDownloadsCliOptionsChanged(function () {
          refreshCliOpts();
          schedulePreviewRefresh();
        });
      }

      api.getSnapshot().then(onQueueSnapshot);

      api.onSnapshot(onQueueSnapshot);
      refreshOutDir();
      refreshCliOpts();`

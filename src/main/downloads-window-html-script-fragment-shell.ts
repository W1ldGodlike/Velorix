/**
 * Pop-out downloads inline script — scroll rail, pills, CLI preview (`buildDownloadsHtml`).
 */
export const DOWNLOADS_WINDOW_HTML_SCRIPT_SHELL = `      function syncScrollToRailBtn() {
        if (!scrollToRailBtn) return;
        scrollToRailBtn.hidden = !narrowPopoutMq.matches;
      }
      function onScrollToRailClick() {
        var rail = document.getElementById('dl-ytdlp-settings-rail');
        if (rail) {
          rail.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
      if (scrollToRailBtn) {
        scrollToRailBtn.addEventListener('click', onScrollToRailClick);
      }
      narrowPopoutMq.addEventListener('change', syncScrollToRailBtn);
      window.addEventListener('resize', syncScrollToRailBtn);
      syncScrollToRailBtn();
      var historyRefreshTimer = null;
      var lastHistoryEntries = [];
      var lastQueueRows = [];
      /** После первого полного заполнения формы из main — черновик для превью argv совпадает с полями UI. */
      var cliFormHydrated = false;
      /** §4.1 — не писать в settings при программном открытии details (лог при старте строки очереди). */
      var suppressDetailsUiPersist = false;
      var suppressDetailsUiPersistTimer = null;

      function pillIsOn(btn) {
        return !!(btn && btn.getAttribute('aria-checked') === 'true');
      }
      function pillSet(btn, on) {
        if (!btn) return;
        btn.setAttribute('aria-checked', on ? 'true' : 'false');
        btn.classList.toggle('pill-switch-on', on);
        var txt = btn.querySelector('.pill-switch-text');
        if (txt) txt.textContent = on ? DL_I18N.pillOn : DL_I18N.pillOff;
      }
      function pillToggle(btn) {
        pillSet(btn, !pillIsOn(btn));
      }
      function syncFmtPresetAudioLock() {
        if (!fmtPreset || !pillAudioOnly) return;
        fmtPreset.disabled = pillIsOn(pillAudioOnly);
      }

      function syncAutoExportPillLocked() {
        if (!pillAutoExportAfterOpen) return;
        var openOn = !!(pillOpenInHandler && pillIsOn(pillOpenInHandler));
        pillAutoExportAfterOpen.disabled = !openOn;
        if (!openOn && pillIsOn(pillAutoExportAfterOpen)) {
          pillSet(pillAutoExportAfterOpen, false);
        }
      }

      function syncAutoStartBatchPillLocked() {
        if (!pillAutoStartBatch) return;
        var enqueueOn = !!(pillEnqueueBatch && pillIsOn(pillEnqueueBatch));
        pillAutoStartBatch.disabled = !enqueueOn;
        if (!enqueueOn && pillIsOn(pillAutoStartBatch)) {
          pillSet(pillAutoStartBatch, false);
        }
      }

      function collectDraftCliPatch() {
        return {
          filenameTemplate: tmplInput ? tmplInput.value : '',
          formatPreset: fmtPreset ? fmtPreset.value : 'default',
          downloadPlaylist: pillIsOn(pillPlaylist),
          audioOnly: pillIsOn(pillAudioOnly),
          subtitlePreset: subPreset ? subPreset.value : 'none',
          subLangs: subLangsInput ? subLangsInput.value : '',
          cookiesBrowser: cookiesBrowserSelect ? cookiesBrowserSelect.value : 'none',
          cookiesBrowserProfile: cookiesBrowserProfileInput ? cookiesBrowserProfileInput.value : '',
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
        };
      }

      function buildCliPreviewRequest() {
        var req = { uiLocale: DL_LOCALE_CMP };
        if (previewOutDirOverride && previewOutDirOverride.value.trim()) {
          req.previewOutputDirectory = previewOutDirOverride.value.trim();
        }
        if (cliFormHydrated) {
          req.draft = collectDraftCliPatch();
        }
        return req;
      }

      function refreshPreviewOnly() {
        api.getCliOptions(buildCliPreviewRequest()).then(function (r) {
          if (!r || r.ok !== true || !r.payload) return;
          var p = r.payload;
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
        });
      }

      var cliPreviewTimer = null;
      function schedulePreviewRefresh() {
        if (cliPreviewTimer !== null) {
          clearTimeout(cliPreviewTimer);
        }
        cliPreviewTimer = setTimeout(function () {
          cliPreviewTimer = null;
          refreshPreviewOnly();
        }, 400);
      }

      if (pillPlaylist) {
        pillPlaylist.addEventListener('click', function () {
          pillToggle(pillPlaylist);
          schedulePreviewRefresh();
        });
      }
      if (pillAudioOnly) {
        pillAudioOnly.addEventListener('click', function () {
          pillToggle(pillAudioOnly);
          syncFmtPresetAudioLock();
          schedulePreviewRefresh();
        });
      }
      if (pillOpenInHandler) {
        pillOpenInHandler.addEventListener('click', function () {
          pillToggle(pillOpenInHandler);
          syncAutoExportPillLocked();
          schedulePreviewRefresh();
        });
      }
      if (pillAutoExportAfterOpen) {
        pillAutoExportAfterOpen.addEventListener('click', function () {
          if (pillAutoExportAfterOpen.disabled) return;
          pillToggle(pillAutoExportAfterOpen);
          schedulePreviewRefresh();
        });
      }
      if (pillEnqueueBatch) {
        pillEnqueueBatch.addEventListener('click', function () {
          pillToggle(pillEnqueueBatch);
          syncAutoStartBatchPillLocked();
          schedulePreviewRefresh();
        });
      }
      if (pillAutoStartBatch) {
        pillAutoStartBatch.addEventListener('click', function () {
          if (pillAutoStartBatch.disabled) return;
          pillToggle(pillAutoStartBatch);
          schedulePreviewRefresh();
        });
      }
`

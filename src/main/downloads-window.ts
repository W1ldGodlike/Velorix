import { BrowserWindow, ipcMain, shell, type WebContents } from 'electron'

import { resolveAppPaths } from './app-paths'
import type { StoredWindowRect } from './settings-store'
import { boundsFromBrowserWindow, rectifyBoundsForRestore } from './window-bounds'
import {
  appendUrlsFromMultilineBlock,
  clearDownloadsQueue,
  getDownloadsQueueSnapshot,
  moveDownloadsQueueRow,
  removeDownloadsQueueRow
} from './downloads-queue'
import {
  cancelDownloadsRunner,
  setDownloadsRunnerNotifier,
  startDownloadSingleRow,
  startDownloadsSequential
} from './downloads-queue-runner'
import { DOWNLOADS_LOG_CHANNEL, setDownloadsLogSink } from './downloads-log-ipc'
import { resolvePreloadOutFile } from './preload-resolve'
import {
  isYtdlpDownloadDirectoryDefault,
  resolveYtdlpOutputDirectory
} from './ytdlp-download-output'
import {
  parseYtdlpCookiesBrowser,
  parseYtdlpFormatPreset,
  parseYtdlpImpersonate,
  parseYtdlpSubtitlePreset,
  type YtdlpDownloadOptionsPayload,
  type YtdlpDownloadOptionsPatch
} from './ytdlp-download-options'
import { parseYtdlpQueueRetryProfile } from './ytdlp-queue-retry'
import {
  clearYtdlpDownloadHistory,
  readYtdlpDownloadHistoryNewestFirst
} from './ytdlp-download-history'
import { logError } from './logger-service'

/** Совпадает с preload подпиской на снимок очереди. */
export const DOWNLOADS_QUEUE_SNAPSHOT_CHANNEL = 'fluxalloy-downloads-state'

interface DownloadsWindowBoundsHooks {
  getSavedDownloadsBounds?: () => StoredWindowRect | undefined
  persistDownloadsBounds?: (rect: StoredWindowRect) => void
  /** §6.2 — диалог выбора каталога и сохранение в settings.json (реализуется в index.ts). */
  pickYtdlpOutputDirectory?: (
    win: BrowserWindow
  ) => Promise<
    { ok: true; path: string } | { ok: false; cancelled: true } | { ok: false; error: string }
  >
  clearYtdlpOutputDirectoryOverride?: () => void
  /** §6.2 — файл Netscape cookies (`--cookies`), сохраняется сразу после диалога. */
  pickYtdlpCookiesFile?: (
    win: BrowserWindow
  ) => Promise<
    { ok: true; path: string } | { ok: false; cancelled: true } | { ok: false; error: string }
  >
  clearYtdlpCookiesFile?: () => void
  /** §6.2 — шаблон `-o` и пресет `-f`; persisted в `settings.json` из index.ts. */
  getYtdlpDownloadCliOptions?: () => YtdlpDownloadOptionsPayload
  applyYtdlpDownloadCliPatch?: (
    patch: YtdlpDownloadOptionsPatch
  ) => { ok: true } | { ok: false; error: string }
}

let downloadsBoundsHooks: DownloadsWindowBoundsHooks = {}

/** Вызывается из main после загрузки `settings.json`, чтобы не тянуть замыкание из `index.ts` в этот модуль. */
export function configureDownloadsWindowBoundsHooks(hooks: DownloadsWindowBoundsHooks): void {
  downloadsBoundsHooks = hooks
}

let downloadsWindow: BrowserWindow | null = null

let ipcRegistered = false

let broadcastThrottleTimer: ReturnType<typeof setTimeout> | null = null

function isDownloadsSender(sender: WebContents): boolean {
  return (
    downloadsWindow !== null &&
    !downloadsWindow.isDestroyed() &&
    sender.id === downloadsWindow.webContents.id
  )
}

/** Отправить очередь в окно загрузок без полной перезагрузки документа. */
export function broadcastDownloadsSnapshot(): void {
  if (!downloadsWindow || downloadsWindow.isDestroyed()) {
    return
  }
  if (broadcastThrottleTimer !== null) {
    return
  }
  broadcastThrottleTimer = setTimeout(() => {
    broadcastThrottleTimer = null
    try {
      if (!downloadsWindow || downloadsWindow.isDestroyed()) {
        return
      }
      downloadsWindow.webContents.send(
        DOWNLOADS_QUEUE_SNAPSHOT_CHANNEL,
        getDownloadsQueueSnapshot()
      )
    } catch {
      /* окно закрывается */
    }
  }, 120)
}

function buildDownloadsHtml(): string {
  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <title>FluxAlloy — менеджер загрузок</title>
  <style>
    :root { color-scheme: dark; }
    body { font-family: system-ui, Segoe UI, sans-serif; margin: 0; padding: 14px 16px 18px;
      background: #1e1e1e; color: #e8e8ec; line-height: 1.45; font-size: 13px; }
    h1 { font-size: 1.05rem; font-weight: 600; margin: 0 0 10px; }
    .hint { opacity: 0.82; font-size: 12px; margin: 0 0 10px; }
    textarea {
      width: 100%; min-height: 120px; box-sizing: border-box; resize: vertical;
      border-radius: 8px; border: 1px solid #3f3f46; background: #252526; color: #ececec;
      padding: 8px 10px; font-family: inherit; font-size: 12px;
    }
    textarea.drag {
      outline: 2px dashed #0078d4;
      outline-offset: 2px;
    }
    .row { display: flex; gap: 8px; flex-wrap: wrap; margin: 8px 0 14px; align-items: center; }
    button.cmd {
      border-radius: 8px; border: 1px solid #56565d; background: #2d2d30; color: #ececec;
      padding: 6px 11px; font-size: 12px; cursor: pointer;
    }
    button.cmd:hover { filter: brightness(1.06); }
    button.cmd-primary {
      border-color: color-mix(in srgb, #0078d4 65%, #56565d);
      background: color-mix(in srgb, #0078d4 28%, #2d2d30);
    }
    button.cmd-warn {
      border-color: color-mix(in srgb, #c95454 55%, #56565d);
      background: color-mix(in srgb, #c95454 15%, #2d2d30);
    }
    table { width: 100%; border-collapse: collapse; font-size: 12px; table-layout: fixed; }
    th, td { border-bottom: 1px solid #3f3f46; padding: 6px 8px; text-align: left; vertical-align: top; word-break: break-word; }
    th { color: #b9b9c0; font-weight: 500; font-size: 11px; }
    th:nth-child(1), td:nth-child(1) { width: 2rem; }
    th:nth-child(4), td:nth-child(4) { max-width: 20rem; }
    th:nth-child(5), td:nth-child(5) { width: 6.5rem; white-space: nowrap; }
    th:nth-child(6), td:nth-child(6) { width: 8.5rem; }
    td.num { color: #9d9da2; font-variant-numeric: tabular-nums; }
    td.prog { font-variant-numeric: tabular-nums; color: #b9d79f; white-space: normal; word-break: break-word; font-size: 11px; line-height: 1.35; }
    td.act { white-space: nowrap; width: 6.5rem; }
    td.act button {
      border: none; background: transparent; color: #9dc3ff; cursor: pointer; padding: 2px 5px; font-size: 13px;
    }
    td.act button:hover { text-decoration: underline; }
    .log-panel { margin-top: 14px; border-top: 1px solid #3f3f46; padding-top: 10px; }
    .log-panel summary { cursor: pointer; font-weight: 600; font-size: 12px; margin-bottom: 6px; user-select: none; color: #c9c9cf; }
    .log-panel pre {
      margin: 0; max-height: 240px; overflow: auto; white-space: pre-wrap; word-break: break-word;
      font-family: ui-monospace, Consolas, Menlo, monospace; font-size: 11px; line-height: 1.35;
      background: #18181b; color: #d4d4d8; padding: 8px 10px; border-radius: 8px; border: 1px solid #3f3f46;
    }
    .out-dir-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin: 6px 0 10px; font-size: 12px; }
    .out-dir-row .out-path {
      flex: 1; min-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      font-family: ui-monospace, Consolas, Menlo, monospace; font-size: 11px; opacity: 0.9;
    }
    .opts-panel {
      margin: 10px 0 12px; padding: 10px 12px; border-radius: 8px; border: 1px solid #3f3f46; background: #252526;
      font-size: 12px;
    }
    .opts-panel label { display: block; margin-bottom: 4px; color: #c9c9cf; font-weight: 500; font-size: 11px; }
    .opts-panel input[type=text] {
      width: 100%; box-sizing: border-box; margin-bottom: 8px; padding: 6px 8px;
      border-radius: 6px; border: 1px solid #3f3f46; background: #1e1e1e; color: #ececec; font-family: ui-monospace, Consolas, monospace; font-size: 11px;
    }
    .opts-panel select {
      width: 100%; max-width: 28rem; margin-bottom: 8px; padding: 6px 8px; border-radius: 6px;
      border: 1px solid #3f3f46; background: #1e1e1e; color: #ececec; font-size: 12px;
    }
    .opts-actions { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-top: 4px; }
    .opts-check-row { display: flex; flex-direction: column; gap: 6px; margin: 8px 0 6px; }
    .opts-check-row label.chk {
      display: flex; align-items: flex-start; gap: 8px; font-weight: 400; color: #dcdcdc;
      cursor: pointer; margin-bottom: 0; line-height: 1.35;
    }
    .opts-check-row input[type=checkbox] { margin-top: 3px; flex-shrink: 0; accent-color: #0078d4; }
    .opts-check-muted { opacity: 0.75; }
    .opts-preview-label { display: block; margin: 8px 0 4px; font-size: 11px; color: #b9b9c0; font-weight: 500; }
    textarea#extraArgsInput {
      width: 100%; box-sizing: border-box; min-height: 52px; margin-bottom: 6px; padding: 6px 8px;
      border-radius: 6px; border: 1px solid #3f3f46; background: #1e1e1e; color: #ececec;
      font-family: ui-monospace, Consolas, Menlo, monospace; font-size: 11px; resize: vertical;
    }
    .opts-warn { color: #f0a8a8; margin: 4px 0 8px; line-height: 1.35; }
    .args-preview {
      margin: 0 0 8px; padding: 8px 10px; border-radius: 6px; border: 1px solid #3f3f46;
      background: #18181b; color: #c9e79f; font-family: ui-monospace, Consolas, Menlo, monospace;
      font-size: 11px; white-space: pre-wrap; word-break: break-word; max-height: 120px; overflow: auto;
    }
    .hints-panel { margin: 6px 0 10px; }
    .hints-panel summary { cursor: pointer; font-weight: 600; font-size: 12px; color: #c9c9cf; margin-bottom: 6px; user-select: none; }
    .hint-select {
      width: 100%; max-width: 28rem; padding: 6px 8px; border-radius: 6px;
      border: 1px solid #3f3f46; background: #1e1e1e; color: #ececec; font-size: 11px;
    }
    #hintSummary { min-height: 2.5em; margin-top: 6px; }
    .opts-hint { font-size: 11px; opacity: 0.75; margin: 0 0 8px; line-height: 1.35; }
    .note { margin-top: 12px; font-size: 11px; opacity: 0.72; }
    .history-panel { margin-top: 14px; border-top: 1px solid #3f3f46; padding-top: 10px; }
    .history-panel summary { cursor: pointer; font-weight: 600; font-size: 12px; margin-bottom: 6px; user-select: none; color: #c9c9cf; }
    .history-actions { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-bottom: 8px; }
    .history-actions label { display: inline-flex; align-items: center; gap: 6px; color: #c9c9cf; font-size: 11px; }
    .history-actions select {
      border-radius: 8px; border: 1px solid #56565d; background: #252526; color: #ececec;
      padding: 5px 8px; font-size: 12px;
    }
    table.history-table { font-size: 11px; }
    table.history-table th:nth-child(1), table.history-table td:nth-child(1) { width: 10.5rem; white-space: nowrap; }
    table.history-table th:nth-child(4), table.history-table td:nth-child(4) { width: 5.5rem; }
    table.history-table th:nth-child(5), table.history-table td:nth-child(5) { width: 3rem; text-align: right; }
    table.history-table th:nth-child(7), table.history-table td:nth-child(7) { width: 5.5rem; text-align: right; }
    td.h-out-ok { color: #b9d79f; }
    td.h-out-err { color: #f0a8a8; }
    td.h-out-can { color: #9dc3ff; }
  </style>
</head>
<body>
  <h1>Менеджер загрузок (yt-dlp)</h1>
  <p class="hint">Ссылки по строкам или перетащите текст/URL сюда. Имена файлов задаёт yt-dlp (%(title)s …). Очередь последовательная §6.</p>
  <div class="out-dir-row">
    <span>Каталог загрузок:</span>
    <span id="outDirText" class="out-path" title="">…</span>
    <button type="button" class="cmd" id="openOutBtn" title="Открыть текущий каталог загрузок в проводнике">Открыть</button>
    <button type="button" class="cmd" id="pickOutBtn">Выбрать…</button>
    <button type="button" class="cmd" id="resetOutBtn" title="Использовать каталог по умолчанию в userData">По умолчанию</button>
  </div>
  <div class="opts-panel">
    <p class="opts-hint">Параметры сохраняются в userData/settings.json. Шаблон задаёт относительный путь внутри каталога загрузки; обязателен %(ext)s.</p>
    <label for="tmplInput">Шаблон имени (-o)</label>
    <input type="text" id="tmplInput" spellcheck="false" autocomplete="off" />
    <label for="fmtPreset">Формат / качество (-f)</label>
    <select id="fmtPreset"></select>
    <div class="opts-check-row">
      <label class="chk"><input type="checkbox" id="chkPlaylist" /> Весь плейлист <span class="opts-check-muted">(--yes-playlist)</span></label>
      <label class="chk"><input type="checkbox" id="chkAudioOnly" /> Только аудио <span class="opts-check-muted">(-x --audio-format best; нужен ffmpeg)</span></label>
    </div>
    <label for="subPreset">Субтитры §6.2</label>
    <select id="subPreset">
      <option value="none">Не скачивать</option>
      <option value="manual">Ручные дорожки (--write-subs)</option>
      <option value="manual_auto">Ручные + автосгенерированные (--write-auto-subs)</option>
    </select>
    <label for="subLangsInput">Языки субтитров (--sub-langs, без пробелов)</label>
    <input type="text" id="subLangsInput" spellcheck="false" autocomplete="off" placeholder="Пусто = все; пример: ru,en или all" />
    <p class="opts-hint">Фильтр языков учитывается только если включены субтитры; произвольные флаги — в «Доп. аргументы».</p>
    <label for="cookiesBrowserSelect">Cookies §6.2</label>
    <select id="cookiesBrowserSelect">
      <option value="none">Не использовать</option>
      <option value="chrome">Из браузера: Chrome</option>
      <option value="edge">Из браузера: Edge</option>
      <option value="firefox">Из браузера: Firefox</option>
    </select>
    <p class="opts-hint">Файл cookies имеет приоритет: если он задан и доступен, флаг cookies-from-browser не передаётся.</p>
    <div class="out-dir-row">
      <span>Файл cookies (Netscape):</span>
      <span id="cookiesPathText" class="out-path" title="">—</span>
      <button type="button" class="cmd" id="pickCookiesBtn">Выбрать…</button>
      <button type="button" class="cmd" id="clearCookiesBtn" title="Убрать файл из настроек">Очистить</button>
    </div>
    <p class="opts-hint opts-warn" id="cookiesWarn" hidden></p>
    <label for="impersonateSelect">Импersonate клиента (TLS/JA3 и заголовки; §6.2)</label>
    <select id="impersonateSelect">
      <option value="none">Выключено</option>
      <option value="chrome">chrome</option>
      <option value="edge">edge</option>
      <option value="firefox">firefox</option>
    </select>
    <p class="opts-hint">Список целей ограничен chrome / edge / firefox — см. документацию yt-dlp для поддерживаемых сборкой клиентов; флаг impersonate в «Доп. аргументы» недопустим.</p>
    <label for="rateLimitInput">Ограничение скорости (--limit-rate)</label>
    <input type="text" id="rateLimitInput" spellcheck="false" autocomplete="off" placeholder="Пусто = без лимита; пример: 500K или 2M" />
    <label for="retriesInput">Повторы при ошибках (--retries)</label>
    <input type="text" id="retriesInput" inputmode="numeric" spellcheck="false" autocomplete="off" placeholder="Пусто = дефолт yt-dlp; 0–99" />
    <label for="fragmentRetriesInput">Повторы фрагментов (--fragment-retries)</label>
    <input type="text" id="fragmentRetriesInput" inputmode="numeric" spellcheck="false" autocomplete="off" placeholder="Пусто = дефолт yt-dlp; 0–99" />
    <p class="opts-hint">Лимит скорости, ретраи и ретраи фрагментов вынесены из «Доп. аргументов», чтобы не смешивать их с произвольным argv и не конфликтовать с настройками FluxAlloy.</p>
    <label for="queueRetrySelect">Повтор строки при сбое (очередь) §6.4</label>
    <select id="queueRetrySelect" aria-label="Профиль повторов очереди при ошибке">
      <option value="off">Выключено</option>
      <option value="light">Лёгкий (1 повтор, 2.5 с)</option>
      <option value="normal">Обычный (2 повтора: 3 с + 8 с)</option>
    </select>
    <p class="opts-hint">Отдельно от <code>--retries</code> yt-dlp: после ненулевого кода процесса FluxAlloy делает паузу и запускает ту же ссылку снова (без повторного добавления в таблицу).</p>
    <label for="extraArgsInput">Дополнительные аргументы (через пробел, без shell) §6.3</label>
    <textarea id="extraArgsInput" rows="2" spellcheck="false" autocomplete="off" placeholder="Например: --write-sub --sub-lang ru"></textarea>
    <p class="opts-hint opts-warn" id="extraArgsWarn" hidden></p>
    <span class="opts-preview-label">Превью argv</span>
    <pre class="args-preview" id="argsPreview"></pre>
    <details class="hints-panel" id="hintsPanel">
      <summary>Справочник флагов (Data/ytdlp_commands.json)</summary>
      <select id="hintInsert" class="hint-select" aria-label="Вставить флаг из справочника">
        <option value="">Выберите флаг — он добавится в «Доп. аргументы»…</option>
      </select>
      <p class="opts-hint" id="hintSummary"></p>
    </details>
    <div class="opts-actions">
      <button type="button" class="cmd cmd-primary" id="applyOptsBtn">Сохранить параметры</button>
      <button type="button" class="cmd" id="tmplReset">Шаблон по умолчанию</button>
    </div>
  </div>
  <textarea id="urls" placeholder="https://…"></textarea>
  <div class="row">
    <button type="button" class="cmd cmd-primary" id="startBtn" title="Скачать все строки со статусом «Ожидание»">Старт очереди</button>
    <button type="button" class="cmd cmd-warn" id="cancelBtn" title="Отменить текущую загрузку yt-dlp">Отмена загрузки</button>
    <button type="button" class="cmd" id="addBtn">Добавить в очередь</button>
    <button type="button" class="cmd" id="clearBtn">Очистить очередь</button>
  </div>
  <table>
    <thead><tr><th>№</th><th>Имя</th><th>Ссылка</th><th>Прогресс</th><th>Статус</th><th></th></tr></thead>
    <tbody id="queueBody"></tbody>
  </table>
  <details class="history-panel" id="historyDetails">
    <summary>История загрузок §6.4 (файл userData/downloads/history.json)</summary>
    <div class="history-actions">
      <button type="button" class="cmd" id="refreshHistoryBtn">Обновить</button>
      <button type="button" class="cmd cmd-warn" id="clearHistoryBtn">Очистить историю</button>
      <label>Исход
        <select id="historyOutcomeFilter">
          <option value="all">Все</option>
          <option value="success">Успех</option>
          <option value="error">Ошибка</option>
          <option value="cancelled">Отмена</option>
        </select>
      </label>
    </div>
    <table class="history-table">
      <thead><tr><th>Завершено</th><th>Имя</th><th>Ссылка</th><th>Исход</th><th>Код</th><th>Статус</th><th></th></tr></thead>
      <tbody id="historyBody"></tbody>
    </table>
  </details>
  <div class="log-panel">
    <details id="logDetails">
      <summary>Лог yt-dlp (stdout / stderr)</summary>
      <pre id="logPre"></pre>
    </details>
  </div>
  <p class="note">Отдельный preload IPC только для этого окна. yt-dlp запускается из main через spawn без shell.</p>
  <script>
    (function () {
      var api = window.fluxalloyDownloads;
      var addBtn = document.getElementById('addBtn');
      var clearBtn = document.getElementById('clearBtn');
      var startBtn = document.getElementById('startBtn');
      var cancelBtn = document.getElementById('cancelBtn');
      var urls = document.getElementById('urls');
      var body = document.getElementById('queueBody');
      var outDirText = document.getElementById('outDirText');
      var openOutBtn = document.getElementById('openOutBtn');
      var pickOutBtn = document.getElementById('pickOutBtn');
      var resetOutBtn = document.getElementById('resetOutBtn');
      var tmplInput = document.getElementById('tmplInput');
      var fmtPreset = document.getElementById('fmtPreset');
      var applyOptsBtn = document.getElementById('applyOptsBtn');
      var tmplReset = document.getElementById('tmplReset');
      var chkPlaylist = document.getElementById('chkPlaylist');
      var chkAudioOnly = document.getElementById('chkAudioOnly');
      var subPreset = document.getElementById('subPreset');
      var subLangsInput = document.getElementById('subLangsInput');
      var cookiesBrowserSelect = document.getElementById('cookiesBrowserSelect');
      var cookiesPathText = document.getElementById('cookiesPathText');
      var pickCookiesBtn = document.getElementById('pickCookiesBtn');
      var clearCookiesBtn = document.getElementById('clearCookiesBtn');
      var cookiesWarn = document.getElementById('cookiesWarn');
      var impersonateSelect = document.getElementById('impersonateSelect');
      var rateLimitInput = document.getElementById('rateLimitInput');
      var retriesInput = document.getElementById('retriesInput');
      var fragmentRetriesInput = document.getElementById('fragmentRetriesInput');
      var queueRetrySelect = document.getElementById('queueRetrySelect');
      var extraArgsInput = document.getElementById('extraArgsInput');
      var argsPreview = document.getElementById('argsPreview');
      var extraArgsWarn = document.getElementById('extraArgsWarn');
      var hintInsert = document.getElementById('hintInsert');
      var hintSummary = document.getElementById('hintSummary');
      var historyBody = document.getElementById('historyBody');
      var refreshHistoryBtn = document.getElementById('refreshHistoryBtn');
      var clearHistoryBtn = document.getElementById('clearHistoryBtn');
      var historyOutcomeFilter = document.getElementById('historyOutcomeFilter');
      var historyRefreshTimer = null;
      var lastHistoryEntries = [];

      function formatHistoryWhen(ms) {
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
        if (o === 'success') return 'Успех';
        if (o === 'cancelled') return 'Отмена';
        return 'Ошибка';
      }

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
          td0.textContent = lastHistoryEntries.length === 0 ? 'Записей пока нет' : 'Нет записей с таким исходом';
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
          if (u) {
            var retry = document.createElement('button');
            retry.type = 'button';
            retry.textContent = 'В очередь';
            retry.title = 'Добавить этот URL в очередь повторно';
            retry.setAttribute('data-history-url', u);
            tdAction.appendChild(retry);
          }
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
          if (!window.confirm('Удалить все записи истории загрузок?')) return;
          api.clearHistory().then(function (res) {
            if (res && res.ok === false && res.error) window.alert(res.error);
            refreshHistory();
          });
        });
      }
      if (historyBody) {
        historyBody.addEventListener('click', function (e) {
          var t = e.target.closest('[data-history-url]');
          if (!t) return;
          var url = t.getAttribute('data-history-url') || '';
          if (!url) return;
          api.addLines(url).then(function () {
            api.getSnapshot().then(onQueueSnapshot);
          });
        });
      }

      function fillHintSelect(hints) {
        if (!hintInsert) return;
        var list = Array.isArray(hints) ? hints : [];
        hintInsert.replaceChildren();
        var ph = document.createElement('option');
        ph.value = '';
        ph.textContent = list.length === 0 ? 'Справочник недоступен' : 'Выберите флаг — добавить в поле…';
        hintInsert.appendChild(ph);
        list.forEach(function (h) {
          if (!h || typeof h.token !== 'string') return;
          var o = document.createElement('option');
          o.value = h.token;
          o.textContent = h.token;
          o.title = typeof h.summary === 'string' ? h.summary : '';
          hintInsert.appendChild(o);
        });
      }

      function refreshCliOpts() {
        api.getCliOptions().then(function (r) {
          if (!r || r.ok !== true || !r.payload) return;
          var p = r.payload;
          if (tmplInput) tmplInput.value = p.filenameTemplate || '';
          if (chkPlaylist && typeof p.downloadPlaylist === 'boolean') {
            chkPlaylist.checked = p.downloadPlaylist;
          }
          if (chkAudioOnly && typeof p.audioOnly === 'boolean') {
            chkAudioOnly.checked = p.audioOnly;
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
              qv === 'light' || qv === 'normal' ? qv : 'off';
          }
          if (!fmtPreset) return;
          fmtPreset.replaceChildren();
          (p.formatPresetChoices || []).forEach(function (c) {
            var o = document.createElement('option');
            o.value = c.id;
            o.textContent = c.label;
            fmtPreset.appendChild(o);
          });
          fmtPreset.value = p.formatPreset || 'default';
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
          fillHintSelect(p.commandHints);
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
      var logTargetRowId = null;
      var maxLogChars = 240000;

      function appendLogLine(stream, text) {
        var prefix = stream === 'stdout' ? 'out | ' : 'err | ';
        logPre.textContent += prefix + text + '\\n';
        if (logPre.textContent.length > maxLogChars) {
          logPre.textContent = logPre.textContent.slice(-maxLogChars);
        }
        logPre.scrollTop = logPre.scrollHeight;
      }

      api.onLog(function (payload) {
        if (!payload || typeof payload !== 'object') return;
        if (payload.kind === 'reset') {
          logTargetRowId = payload.rowId;
          logPre.textContent = '';
          if (logDetails && !logDetails.open) {
            logDetails.open = true;
          }
          return;
        }
        if (payload.kind === 'line' && payload.rowId === logTargetRowId) {
          appendLogLine(payload.stream, payload.text);
        }
      });

      function rowShape(r) {
        return r && typeof r.id === 'number' && typeof r.url === 'string';
      }

      function renderRows(rawRows) {
        var rows = Array.isArray(rawRows) ? rawRows.filter(rowShape) : [];
        body.replaceChildren();
        if (rows.length === 0) {
          var tr0 = document.createElement('tr');
          var td0 = document.createElement('td');
          td0.colSpan = 6;
          td0.style.opacity = '0.7';
          td0.textContent = 'Очередь пуста';
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
          tr.appendChild(tdText('', r.shortLabel || '—'));
          var tdUrl = document.createElement('td');
          tdUrl.title = r.url;
          tdUrl.textContent = r.url.length > 96 ? r.url.slice(0, 94) + '…' : r.url;
          tr.appendChild(tdUrl);
          tr.appendChild(tdText('prog', r.progress || '—'));
          tr.appendChild(tdText('', r.status || '—'));
          var tdAct = document.createElement('td');
          tdAct.className = 'act';
          function mk(act, title, label, id) {
            var b = document.createElement('button');
            b.type = 'button';
            b.setAttribute('data-act', act);
            b.setAttribute('data-id', String(id));
            b.title = title;
            b.textContent = label;
            tdAct.appendChild(b);
          }
          if (r.status === 'Ожидание') {
            mk('start', 'Скачать только эту строку', '▶', r.id);
          }
          mk('up', 'Вверх', '↑', r.id);
          mk('dn', 'Вниз', '↓', r.id);
          mk('rm', 'Удалить', '✕', r.id);
          tr.appendChild(tdAct);
          body.appendChild(tr);
        });
      }

      body.addEventListener('click', function (e) {
        var t = e.target.closest('[data-act]');
        if (!t) return;
        var act = t.getAttribute('data-act');
        var id = Number(t.getAttribute('data-id'));
        if (act === 'rm') api.removeRow(id);
        else if (act === 'up') api.moveRow(id, -1);
        else if (act === 'dn') api.moveRow(id, 1);
        else if (act === 'start') {
          api.startRow(id).then(function (res) {
            if (res && res.ok === false && res.error) {
              window.alert(res.error);
            }
          });
        }
      });

      addBtn.addEventListener('click', function () {
        api.addLines(urls.value).then(function () {
          urls.value = '';
        });
      });
      clearBtn.addEventListener('click', function () {
        api.clearQueue();
      });
      startBtn.addEventListener('click', function () {
        api.startQueue();
      });
      cancelBtn.addEventListener('click', function () {
        api.cancelQueue();
      });

      pickOutBtn.addEventListener('click', function () {
        api.pickOutputDirectory().then(function (res) {
          if (res && res.ok === false && res.error) window.alert(res.error);
          refreshOutDir();
        });
      });
      openOutBtn.addEventListener('click', function () {
        api.openOutputDirectory().then(function (res) {
          if (res && res.ok === false && res.error) window.alert(res.error);
        });
      });
      resetOutBtn.addEventListener('click', function () {
        api.clearOutputDirectory().then(function () {
          refreshOutDir();
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
          api.clearCookiesFile().then(function () {
            refreshCliOpts();
          });
        });
      }

      if (applyOptsBtn && tmplInput && fmtPreset) {
        applyOptsBtn.addEventListener('click', function () {
          api.setCliOptions({
            filenameTemplate: tmplInput.value,
            formatPreset: fmtPreset.value,
            downloadPlaylist: !!(chkPlaylist && chkPlaylist.checked),
            audioOnly: !!(chkAudioOnly && chkAudioOnly.checked),
            subtitlePreset: subPreset ? subPreset.value : 'none',
            subLangs: subLangsInput ? subLangsInput.value : '',
            cookiesBrowser: cookiesBrowserSelect ? cookiesBrowserSelect.value : 'none',
            impersonate: impersonateSelect ? impersonateSelect.value : 'none',
            rateLimit: rateLimitInput ? rateLimitInput.value : '',
            retriesLine: retriesInput ? retriesInput.value : '',
            fragmentRetriesLine: fragmentRetriesInput ? fragmentRetriesInput.value : '',
            queueRetryProfile: queueRetrySelect ? queueRetrySelect.value : 'off',
            extraArgsLine: extraArgsInput ? extraArgsInput.value : ''
          }).then(function (res) {
            if (res && res.ok === false && res.error) window.alert(res.error);
            refreshCliOpts();
          });
        });
      }
      if (tmplReset && tmplInput) {
        tmplReset.addEventListener('click', function () {
          api.getCliOptions().then(function (r) {
            if (r && r.ok === true && r.payload && r.payload.defaultFilenameTemplate) {
              tmplInput.value = r.payload.defaultFilenameTemplate;
            }
          });
        });
      }

      if (hintInsert && extraArgsInput) {
        hintInsert.addEventListener('change', function () {
          var opt = hintInsert.selectedOptions && hintInsert.selectedOptions[0];
          var token = hintInsert.value;
          if (!token) {
            if (hintSummary) hintSummary.textContent = '';
            return;
          }
          if (hintSummary && opt && opt.title) {
            hintSummary.textContent = opt.title.length > 360 ? opt.title.slice(0, 358) + '…' : opt.title;
          }
          var cur = extraArgsInput.value.trim();
          extraArgsInput.value = cur ? cur + ' ' + token : token;
          hintInsert.value = '';
        });
      }

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
        if (txt) api.addLines(txt);
      });

      function onQueueSnapshot(rows) {
        renderRows(rows);
        scheduleHistoryRefresh();
      }

      api.getSnapshot().then(onQueueSnapshot);

      api.onSnapshot(onQueueSnapshot);
      refreshOutDir();
      refreshCliOpts();
    })();
  </script>
</body>
</html>`
}

export function registerDownloadsWindowIpcHandlers(): void {
  if (ipcRegistered) {
    return
  }
  ipcRegistered = true

  setDownloadsRunnerNotifier(() => {
    broadcastDownloadsSnapshot()
  })

  ipcMain.handle('fluxalloy-downloads-get-snapshot', (event) => {
    if (!isDownloadsSender(event.sender)) {
      return []
    }
    return getDownloadsQueueSnapshot()
  })

  ipcMain.handle('fluxalloy-downloads-add-lines', (event, text: unknown) => {
    if (!isDownloadsSender(event.sender)) {
      return 0
    }
    if (typeof text !== 'string') {
      return 0
    }
    const n = appendUrlsFromMultilineBlock(text)
    broadcastDownloadsSnapshot()
    return n
  })

  ipcMain.handle(
    'fluxalloy-downloads-get-output-dir',
    (
      event
    ): {
      path: string
      isDefault: boolean
    } => {
      if (!isDownloadsSender(event.sender)) {
        return { path: '', isDefault: true }
      }
      const paths = resolveAppPaths()
      return {
        path: resolveYtdlpOutputDirectory(paths.userData),
        isDefault: isYtdlpDownloadDirectoryDefault()
      }
    }
  )

  ipcMain.handle(
    'fluxalloy-downloads-open-output-dir',
    async (event): Promise<{ ok: true } | { ok: false; error: string }> => {
      if (!isDownloadsSender(event.sender)) {
        return { ok: false, error: 'Недопустимый отправитель' }
      }
      const paths = resolveAppPaths()
      const target = resolveYtdlpOutputDirectory(paths.userData)
      const result = await shell.openPath(target)
      return result.length === 0 ? { ok: true } : { ok: false, error: result }
    }
  )

  ipcMain.handle(
    'fluxalloy-downloads-get-cli-options',
    (event): { ok: true; payload: YtdlpDownloadOptionsPayload } | { ok: false; error: string } => {
      if (!isDownloadsSender(event.sender)) {
        return { ok: false, error: 'Недопустимый отправитель' }
      }
      const fn = downloadsBoundsHooks.getYtdlpDownloadCliOptions
      if (!fn) {
        return { ok: false, error: 'Опции yt-dlp не подключены' }
      }
      return { ok: true, payload: fn() }
    }
  )

  ipcMain.handle(
    'fluxalloy-downloads-set-cli-options',
    (event, raw: unknown): { ok: true } | { ok: false; error: string } => {
      if (!isDownloadsSender(event.sender)) {
        return { ok: false, error: 'Недопустимый отправитель' }
      }
      const fn = downloadsBoundsHooks.applyYtdlpDownloadCliPatch
      if (!fn) {
        return { ok: false, error: 'Опции yt-dlp не подключены' }
      }
      if (!raw || typeof raw !== 'object') {
        return { ok: false, error: 'Некорректные данные' }
      }
      const o = raw as Record<string, unknown>
      const patch: YtdlpDownloadOptionsPatch = {}
      if (Object.prototype.hasOwnProperty.call(o, 'filenameTemplate')) {
        if (typeof o.filenameTemplate !== 'string') {
          return { ok: false, error: 'Шаблон имени должен быть строкой' }
        }
        patch.filenameTemplate = o.filenameTemplate
      }
      if (Object.prototype.hasOwnProperty.call(o, 'formatPreset')) {
        patch.formatPreset = parseYtdlpFormatPreset(o.formatPreset)
      }
      if (Object.prototype.hasOwnProperty.call(o, 'downloadPlaylist')) {
        if (typeof o.downloadPlaylist !== 'boolean') {
          return { ok: false, error: 'Поле плейлиста должно быть boolean' }
        }
        patch.downloadPlaylist = o.downloadPlaylist
      }
      if (Object.prototype.hasOwnProperty.call(o, 'audioOnly')) {
        if (typeof o.audioOnly !== 'boolean') {
          return { ok: false, error: 'Поле «только аудио» должно быть boolean' }
        }
        patch.audioOnly = o.audioOnly
      }
      if (Object.prototype.hasOwnProperty.call(o, 'subtitlePreset')) {
        patch.subtitlePreset = parseYtdlpSubtitlePreset(o.subtitlePreset)
      }
      if (Object.prototype.hasOwnProperty.call(o, 'subLangs')) {
        if (typeof o.subLangs !== 'string') {
          return { ok: false, error: 'Языки субтитров должны быть строкой' }
        }
        patch.subLangs = o.subLangs
      }
      if (Object.prototype.hasOwnProperty.call(o, 'cookiesBrowser')) {
        if (typeof o.cookiesBrowser !== 'string') {
          return { ok: false, error: 'Поле cookies браузера должно быть строкой' }
        }
        const cv = o.cookiesBrowser
        if (cv === 'none') {
          patch.cookiesBrowser = 'none'
        } else {
          const b = parseYtdlpCookiesBrowser(cv)
          if (!b) {
            return { ok: false, error: 'Недопустимое значение браузера для cookies' }
          }
          patch.cookiesBrowser = b
        }
      }
      if (Object.prototype.hasOwnProperty.call(o, 'impersonate')) {
        if (typeof o.impersonate !== 'string') {
          return { ok: false, error: 'Поле impersonate должно быть строкой' }
        }
        const iv = o.impersonate
        if (iv === 'none') {
          patch.impersonate = 'none'
        } else {
          const im = parseYtdlpImpersonate(iv)
          if (!im) {
            return { ok: false, error: 'Недопустимое значение impersonate' }
          }
          patch.impersonate = im
        }
      }
      if (Object.prototype.hasOwnProperty.call(o, 'rateLimit')) {
        if (typeof o.rateLimit !== 'string') {
          return { ok: false, error: 'Ограничение скорости должно быть строкой' }
        }
        patch.rateLimit = o.rateLimit
      }
      if (Object.prototype.hasOwnProperty.call(o, 'retriesLine')) {
        if (typeof o.retriesLine !== 'string') {
          return { ok: false, error: 'Количество повторов должно быть строкой' }
        }
        patch.retriesLine = o.retriesLine
      }
      if (Object.prototype.hasOwnProperty.call(o, 'fragmentRetriesLine')) {
        if (typeof o.fragmentRetriesLine !== 'string') {
          return { ok: false, error: 'Количество повторов фрагментов должно быть строкой' }
        }
        patch.fragmentRetriesLine = o.fragmentRetriesLine
      }
      if (Object.prototype.hasOwnProperty.call(o, 'extraArgsLine')) {
        if (typeof o.extraArgsLine !== 'string') {
          return { ok: false, error: 'Доп. аргументы должны быть строкой' }
        }
        patch.extraArgsLine = o.extraArgsLine
      }
      if (Object.prototype.hasOwnProperty.call(o, 'queueRetryProfile')) {
        patch.queueRetryProfile = parseYtdlpQueueRetryProfile(o.queueRetryProfile)
      }
      if (
        patch.filenameTemplate === undefined &&
        patch.formatPreset === undefined &&
        patch.downloadPlaylist === undefined &&
        patch.audioOnly === undefined &&
        patch.subtitlePreset === undefined &&
        patch.subLangs === undefined &&
        patch.cookiesBrowser === undefined &&
        patch.impersonate === undefined &&
        patch.rateLimit === undefined &&
        patch.retriesLine === undefined &&
        patch.fragmentRetriesLine === undefined &&
        patch.extraArgsLine === undefined &&
        patch.queueRetryProfile === undefined
      ) {
        return { ok: false, error: 'Нечего сохранять' }
      }
      return fn(patch)
    }
  )

  ipcMain.handle(
    'fluxalloy-downloads-pick-output-dir',
    async (
      event
    ): Promise<
      { ok: true; path: string } | { ok: false; cancelled: true } | { ok: false; error: string }
    > => {
      if (!isDownloadsSender(event.sender)) {
        return { ok: false, error: 'Недопустимый отправитель' }
      }
      const fn = downloadsBoundsHooks.pickYtdlpOutputDirectory
      if (!fn) {
        return { ok: false, error: 'Выбор каталога не подключён' }
      }
      const win = BrowserWindow.fromWebContents(event.sender)
      if (!win || win.isDestroyed()) {
        return { ok: false, error: 'Нет окна' }
      }
      return fn(win)
    }
  )

  ipcMain.handle('fluxalloy-downloads-clear-output-dir', (event) => {
    if (!isDownloadsSender(event.sender)) {
      return
    }
    downloadsBoundsHooks.clearYtdlpOutputDirectoryOverride?.()
  })

  ipcMain.handle(
    'fluxalloy-downloads-pick-cookies-file',
    async (
      event
    ): Promise<
      { ok: true; path: string } | { ok: false; cancelled: true } | { ok: false; error: string }
    > => {
      if (!isDownloadsSender(event.sender)) {
        return { ok: false, error: 'Недопустимый отправитель' }
      }
      const fn = downloadsBoundsHooks.pickYtdlpCookiesFile
      if (!fn) {
        return { ok: false, error: 'Выбор файла cookies не подключён' }
      }
      const win = BrowserWindow.fromWebContents(event.sender)
      if (!win || win.isDestroyed()) {
        return { ok: false, error: 'Нет окна' }
      }
      return fn(win)
    }
  )

  ipcMain.handle('fluxalloy-downloads-clear-cookies-file', (event) => {
    if (!isDownloadsSender(event.sender)) {
      return
    }
    downloadsBoundsHooks.clearYtdlpCookiesFile?.()
  })

  ipcMain.handle('fluxalloy-downloads-clear', (event) => {
    if (!isDownloadsSender(event.sender)) {
      return
    }
    cancelDownloadsRunner()
    clearDownloadsQueue()
    broadcastDownloadsSnapshot()
  })

  /** §6.4 — чтение истории завершённых загрузок (newest first). */
  ipcMain.handle('fluxalloy-downloads-get-history', (event) => {
    if (!isDownloadsSender(event.sender)) {
      return []
    }
    const paths = resolveAppPaths()
    return readYtdlpDownloadHistoryNewestFirst(paths.userData, 100)
  })

  ipcMain.handle(
    'fluxalloy-downloads-clear-history',
    (event): { ok: true } | { ok: false; error: string } => {
      if (!isDownloadsSender(event.sender)) {
        return { ok: false, error: 'Недопустимый отправитель' }
      }
      const paths = resolveAppPaths()
      clearYtdlpDownloadHistory(paths.userData)
      return { ok: true }
    }
  )

  ipcMain.handle('fluxalloy-downloads-remove', (event, id: unknown) => {
    if (!isDownloadsSender(event.sender)) {
      return
    }
    if (typeof id !== 'number' || !Number.isFinite(id)) {
      return
    }
    removeDownloadsQueueRow(id)
    broadcastDownloadsSnapshot()
  })

  ipcMain.handle('fluxalloy-downloads-move', (event, id: unknown, direction: unknown) => {
    if (!isDownloadsSender(event.sender)) {
      return
    }
    if (typeof id !== 'number' || !Number.isFinite(id)) {
      return
    }
    const d = direction === -1 || direction === 1 ? direction : 0
    if (d === 0) {
      return
    }
    moveDownloadsQueueRow(id, d)
    broadcastDownloadsSnapshot()
  })

  ipcMain.handle(
    'fluxalloy-downloads-start-queue',
    async (event): Promise<{ ok: true } | { ok: false; error: string }> => {
      if (!isDownloadsSender(event.sender)) {
        return { ok: false, error: 'Недопустимый отправитель' }
      }

      void startDownloadsSequential().catch((err: unknown) => {
        logError('downloads-queue', 'startDownloadsSequential failed', err)
      })

      return { ok: true }
    }
  )

  ipcMain.handle(
    'fluxalloy-downloads-start-row',
    async (event, id: unknown): Promise<{ ok: true } | { ok: false; error: string }> => {
      if (!isDownloadsSender(event.sender)) {
        return { ok: false, error: 'Недопустимый отправитель' }
      }
      if (typeof id !== 'number' || !Number.isFinite(id)) {
        return { ok: false, error: 'Некорректный идентификатор строки' }
      }
      try {
        return await startDownloadSingleRow(id)
      } catch (err: unknown) {
        logError('downloads-queue', 'startDownloadSingleRow failed', err)
        return { ok: false, error: err instanceof Error ? err.message : String(err) }
      }
    }
  )

  ipcMain.handle(
    'fluxalloy-downloads-cancel-run',
    (event): { ok: true } | { ok: false; error: string } => {
      if (!isDownloadsSender(event.sender)) {
        return { ok: false, error: 'Недопустимый отправитель' }
      }
      cancelDownloadsRunner()
      broadcastDownloadsSnapshot()

      return { ok: true }
    }
  )
}

/**
 * Открыть или сфокусировать окно менеджера загрузок.
 * Непустой `mergeText` добавляет распознанные URL-строки в очередь (как при вставке из буфера).
 */
export function focusOrCreateDownloadsWindow(mergeText?: string | null): void {
  const chunk = mergeText?.trim() ?? ''
  if (chunk.length > 0) {
    appendUrlsFromMultilineBlock(chunk)
  }

  const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(buildDownloadsHtml())}`

  if (downloadsWindow && !downloadsWindow.isDestroyed()) {
    downloadsWindow.focus()

    broadcastDownloadsSnapshot()
    return
  }

  const savedDl = downloadsBoundsHooks.getSavedDownloadsBounds?.()
  const dlRect = savedDl ? rectifyBoundsForRestore(savedDl) : null

  downloadsWindow = new BrowserWindow({
    width: dlRect?.width ?? 960,
    height: dlRect?.height ?? 640,
    ...(dlRect ? { x: dlRect.x, y: dlRect.y } : {}),
    show: false,
    title: 'FluxAlloy — загрузки',
    webPreferences: {
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
      preload: resolvePreloadOutFile('downloadsWindow', __dirname)
    }
  })

  let downloadsBoundsTimer: ReturnType<typeof setTimeout> | null = null
  const flushDownloadsBounds = (): void => {
    if (!downloadsWindow || downloadsWindow.isDestroyed()) {
      return
    }
    downloadsBoundsHooks.persistDownloadsBounds?.(boundsFromBrowserWindow(downloadsWindow))
  }
  const scheduleDownloadsBounds = (): void => {
    if (downloadsBoundsTimer !== null) {
      clearTimeout(downloadsBoundsTimer)
    }
    downloadsBoundsTimer = setTimeout(() => {
      downloadsBoundsTimer = null
      flushDownloadsBounds()
    }, 480)
  }

  downloadsWindow.on('resize', scheduleDownloadsBounds)
  downloadsWindow.on('move', scheduleDownloadsBounds)
  downloadsWindow.on('close', () => {
    if (downloadsBoundsTimer !== null) {
      clearTimeout(downloadsBoundsTimer)
      downloadsBoundsTimer = null
    }
    flushDownloadsBounds()
  })

  downloadsWindow.on('closed', () => {
    setDownloadsLogSink(null)
    downloadsWindow = null
  })

  void downloadsWindow.loadURL(dataUrl)
  downloadsWindow.once('ready-to-show', () => {
    if (downloadsWindow && !downloadsWindow.isDestroyed()) {
      const wc = downloadsWindow.webContents
      setDownloadsLogSink((payload) => {
        try {
          wc.send(DOWNLOADS_LOG_CHANNEL, payload)
        } catch {
          /* окно закрывается */
        }
      })
    }
    downloadsWindow?.show()
    broadcastDownloadsSnapshot()
  })
}

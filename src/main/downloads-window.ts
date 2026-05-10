import { writeFileSync } from 'fs'
import { BrowserWindow, dialog, ipcMain, shell, type WebContents } from 'electron'

import { resolveAppPaths } from './app-paths'
import type { StoredWindowRect } from './settings-store'
import { boundsFromBrowserWindow, rectifyBoundsForRestore } from './window-bounds'
import {
  appendUrlsFromMultilineBlock,
  clearFinishedDownloadsQueueRows,
  clearDownloadsQueue,
  getDownloadsQueueSnapshot,
  getDownloadsQueueRowById,
  moveDownloadsQueueRow,
  removeDownloadsQueueRow,
  resetDownloadsQueueRowForRetry
} from './downloads-queue'
import {
  cancelDownloadsRunner,
  getActiveDownloadsRunnerRowId,
  setDownloadsRunnerNotifier,
  startDownloadSingleRow,
  startDownloadsSequential
} from './downloads-queue-runner'
import { DOWNLOADS_LOG_CHANNEL, emitDownloadsLog, setDownloadsLogSink } from './downloads-log-ipc'
import { resolvePreloadOutFile } from './preload-resolve'
import {
  isYtdlpDownloadDirectoryDefault,
  resolveAllowedYtdlpDownloadOutputFile,
  resolveYtdlpOutputDirectory
} from './ytdlp-download-output'
import {
  getActiveYtdlpPauseState,
  pauseActiveYtdlpProcess,
  resumeActiveYtdlpProcess
} from './ytdlp-download-service'
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
import { downloadsIpc as d } from '../shared/ipc-channels'

/** Совпадает с preload подпиской на снимок очереди. */
export const DOWNLOADS_QUEUE_SNAPSHOT_CHANNEL = d.queueSnapshot

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
  /** §6.2 — шаблон `-o` и пресет `-f`; persisted в `settings.json` из index.ts; raw — опции превью argv §6.3. */
  getYtdlpDownloadCliOptions?: (raw?: unknown) => YtdlpDownloadOptionsPayload
  applyYtdlpDownloadCliPatch?: (
    patch: YtdlpDownloadOptionsPatch
  ) => { ok: true } | { ok: false; error: string }
  /** §6.4 — открыть готовый файл из yt-dlp в основном обработчике/preview FluxAlloy. */
  openDownloadedFileInHandler?: (
    absoluteFile: string
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

export function isDownloadsWindow(win: BrowserWindow | null | undefined): boolean {
  return (
    win !== null &&
    win !== undefined &&
    downloadsWindow !== null &&
    !downloadsWindow.isDestroyed() &&
    !win.isDestroyed() &&
    win.id === downloadsWindow.id
  )
}

type DownloadOutputOpenMode = 'file' | 'folder'

function isDownloadOutputOpenMode(raw: unknown): raw is DownloadOutputOpenMode {
  return raw === 'file' || raw === 'folder'
}

function resolveAllowedDownloadOutputPath(raw: unknown): string | null {
  const paths = resolveAppPaths()
  return resolveAllowedYtdlpDownloadOutputFile(raw, paths.userData)
}

async function openDownloadOutputPath(
  rawPath: unknown,
  mode: DownloadOutputOpenMode
): Promise<{ ok: true } | { ok: false; error: string }> {
  const file = resolveAllowedDownloadOutputPath(rawPath)
  if (!file) {
    return { ok: false, error: 'Файл не найден или находится вне каталога загрузок.' }
  }
  try {
    if (mode === 'folder') {
      shell.showItemInFolder(file)
      return { ok: true }
    }
    const err = await shell.openPath(file)
    return err ? { ok: false, error: err } : { ok: true }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
}

function openDownloadOutputInHandler(
  rawPath: unknown
): { ok: true } | { ok: false; error: string } {
  const file = resolveAllowedDownloadOutputPath(rawPath)
  if (!file) {
    return { ok: false, error: 'Файл не найден или находится вне каталога загрузок.' }
  }
  const fn = downloadsBoundsHooks.openDownloadedFileInHandler
  if (!fn) {
    return { ok: false, error: 'Обработчик FluxAlloy не подключён.' }
  }
  return fn(file)
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
    .row label.inline-filter { display: inline-flex; align-items: center; gap: 6px; color: #c9c9cf; font-size: 11px; }
    .row label.inline-filter select {
      border-radius: 8px; border: 1px solid #56565d; background: #252526; color: #ececec;
      padding: 5px 8px; font-size: 12px;
    }
    .queue-summary { margin-left: auto; color: #b9b9c0; font-size: 11px; font-variant-numeric: tabular-nums; }
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
    .expert-panel {
      margin: 10px 0 8px; padding: 8px 10px; border-radius: 8px; border: 1px solid #3f3f46;
      background: color-mix(in srgb, #1e1e1e 72%, #252526);
    }
    .expert-panel summary {
      cursor: pointer; font-weight: 600; font-size: 12px; color: #c9c9cf; user-select: none;
    }
    .expert-panel[open] summary { margin-bottom: 8px; }
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
      <option value="persistent">Устойчивый (3 повтора: 5 с + 15 с + 45 с)</option>
    </select>
    <p class="opts-hint">Отдельно от <code>--retries</code> yt-dlp: после ненулевого кода процесса FluxAlloy делает паузу и запускает ту же ссылку снова (без повторного добавления в таблицу).</p>
    <div class="opts-check-row">
      <label class="chk"><input type="checkbox" id="chkOpenInHandlerOnComplete" /> После успешной загрузки открыть файл в обработчике FluxAlloy <span class="opts-check-muted">(§6.4)</span></label>
    </div>
    <p class="opts-hint">Работает при известном пути к файлу (парсинг вывода yt-dlp); для очереди каждая завершённая строка может переключить превью главного окна.</p>
    <details class="expert-panel" id="expertArgsDetails">
      <summary>Экспертные аргументы и превью argv §6.3</summary>
      <label for="extraArgsInput">Дополнительные аргументы (через пробел, без shell)</label>
      <textarea id="extraArgsInput" rows="2" spellcheck="false" autocomplete="off" placeholder="Например: --write-sub --sub-lang ru"></textarea>
      <p class="opts-hint opts-warn" id="extraArgsWarn" hidden></p>
      <label for="previewOutDirOverride">Другой каталог для превью <code>-o</code> (не в settings.json)</label>
      <input type="text" id="previewOutDirOverride" spellcheck="false" autocomplete="off" placeholder="Пусто — брать «Каталог загрузок» выше; только строка превью argv" />
      <p class="opts-hint">Абсолютный путь; не влияет на реальный spawn yt-dlp и не перечитывает settings — только подстановка в превью.</p>
      <span class="opts-preview-label">Превью argv</span>
      <pre class="args-preview" id="argsPreview"></pre>
      <details class="hints-panel" id="hintsPanel">
        <summary>Справочник флагов по категориям (Data/ytdlp_commands.json)</summary>
        <select id="hintInsert" class="hint-select" aria-label="Вставить флаг из справочника">
          <option value="">Выберите флаг — он добавится в «Доп. аргументы»…</option>
        </select>
        <p class="opts-hint" id="hintSummary"></p>
      </details>
    </details>
    <div class="opts-actions">
      <button type="button" class="cmd cmd-primary" id="applyOptsBtn">Сохранить параметры</button>
      <button type="button" class="cmd" id="tmplReset">Шаблон по умолчанию</button>
    </div>
  </div>
  <textarea id="urls" placeholder="https://…"></textarea>
  <div class="row">
    <button type="button" class="cmd cmd-primary" id="startBtn" title="Скачать все строки со статусом «Ожидание»">Старт очереди</button>
    <button type="button" class="cmd" id="pauseYtdlpBtn" title="Приостановить загрузку (POSIX); на Windows недоступно">Пауза</button>
    <button type="button" class="cmd cmd-warn" id="cancelBtn" title="Отменить текущую загрузку yt-dlp">Отмена загрузки</button>
    <button type="button" class="cmd" id="addBtn">Добавить в очередь</button>
    <button type="button" class="cmd" id="clearBtn">Очистить очередь</button>
    <button type="button" class="cmd" id="clearFinishedBtn">Убрать завершённые</button>
    <label class="inline-filter">Статус
      <select id="queueStatusFilter">
        <option value="all">Все</option>
        <option value="waiting">Ожидание</option>
        <option value="running">В работе</option>
        <option value="done">Готово</option>
        <option value="error">Ошибки</option>
        <option value="cancelled">Отменено</option>
      </select>
    </label>
    <span class="queue-summary" id="queueSummary">Всего: 0</span>
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
      <div class="history-actions">
        <button type="button" class="cmd" id="saveLogBtn">Сохранить лог…</button>
      </div>
      <pre id="logPre"></pre>
    </details>
  </div>
  <p class="note">Отдельный preload IPC только для этого окна. yt-dlp запускается из main через spawn без shell.</p>
  <script>
    (function () {
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
      var chkOpenInHandlerOnComplete = document.getElementById('chkOpenInHandlerOnComplete');
      var extraArgsInput = document.getElementById('extraArgsInput');
      var previewOutDirOverride = document.getElementById('previewOutDirOverride');
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
      var lastQueueRows = [];
      /** После первого полного заполнения формы из main — черновик для превью argv совпадает с полями UI. */
      var cliFormHydrated = false;

      function collectDraftCliPatch() {
        return {
          filenameTemplate: tmplInput ? tmplInput.value : '',
          formatPreset: fmtPreset ? fmtPreset.value : 'default',
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
          openInHandlerOnComplete: !!(chkOpenInHandlerOnComplete && chkOpenInHandlerOnComplete.checked),
          extraArgsLine: extraArgsInput ? extraArgsInput.value : ''
        };
      }

      function buildCliPreviewRequest() {
        var req = {};
        if (previewOutDirOverride && previewOutDirOverride.value.trim()) {
          req.previewOutputDirectory = previewOutDirOverride.value.trim();
        }
        if (cliFormHydrated) {
          req.draft = collectDraftCliPatch();
        }
        return Object.keys(req).length ? req : undefined;
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
          if (typeof e.outputPath === 'string' && e.outputPath) {
            var openHandler = document.createElement('button');
            openHandler.type = 'button';
            openHandler.textContent = 'В обработчик';
            openHandler.title = 'Открыть скачанный файл в FluxAlloy';
            openHandler.setAttribute('data-history-handler', typeof e.id === 'string' ? e.id : '');
            tdAction.appendChild(openHandler);
            var openFile = document.createElement('button');
            openFile.type = 'button';
            openFile.textContent = 'Файл';
            openFile.title = 'Открыть скачанный файл';
            openFile.setAttribute('data-history-open', 'file');
            openFile.setAttribute('data-history-id', typeof e.id === 'string' ? e.id : '');
            tdAction.appendChild(openFile);
            var openFolder = document.createElement('button');
            openFolder.type = 'button';
            openFolder.textContent = 'Папка';
            openFolder.title = 'Показать файл в папке';
            openFolder.setAttribute('data-history-open', 'folder');
            openFolder.setAttribute('data-history-id', typeof e.id === 'string' ? e.id : '');
            tdAction.appendChild(openFolder);
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
        var curCat = null;
        var og = null;
        list.forEach(function (h) {
          if (!h || typeof h.token !== 'string') return;
          var cat = typeof h.category === 'string' && h.category.length ? h.category : 'Прочее';
          if (cat !== curCat) {
            curCat = cat;
            og = document.createElement('optgroup');
            og.label = cat;
            hintInsert.appendChild(og);
          }
          var o = document.createElement('option');
          o.value = h.token;
          o.textContent = h.token;
          o.title = typeof h.summary === 'string' ? h.summary : '';
          if (og) og.appendChild(o);
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
              qv === 'light' || qv === 'normal' || qv === 'persistent' ? qv : 'off';
          }
          if (chkOpenInHandlerOnComplete && typeof p.openInHandlerOnComplete === 'boolean') {
            chkOpenInHandlerOnComplete.checked = p.openInHandlerOnComplete;
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
      if (saveLogBtn) {
        saveLogBtn.addEventListener('click', function () {
          var text = logPre ? logPre.textContent || '' : '';
          if (!text.trim()) {
            window.alert('Лог пуст — пока нечего сохранять.');
            return;
          }
          api.saveVisibleLog(text).then(function (res) {
            if (res && res.ok === false && res.error && res.error !== 'Сохранение отменено') {
              window.alert(res.error);
            }
          });
        });
      }

      function rowShape(r) {
        return r && typeof r.id === 'number' && typeof r.url === 'string';
      }

      function rowCanRetry(status) {
        if (status === 'Ожидание' || status === 'Загрузка…') return false;
        return !(typeof status === 'string' && status.indexOf('Пауза перед повтором') === 0);
      }

      function queueRowMatchesFilter(row, filter) {
        var status = typeof row.status === 'string' ? row.status : '';
        if (filter === 'all') return true;
        if (filter === 'waiting') return status === 'Ожидание';
        if (filter === 'running') return status === 'Загрузка…' || status.indexOf('Пауза перед повтором') === 0;
        if (filter === 'done') return status === 'Готово';
        if (filter === 'cancelled') return status === 'Отменено';
        if (filter === 'error') return status.indexOf('Ошибка') === 0;
        return true;
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
          if (status === 'Ожидание') waiting += 1;
          else if (status === 'Загрузка…' || status.indexOf('Пауза перед повтором') === 0) running += 1;
          else if (status === 'Готово') done += 1;
          else if (status === 'Отменено') cancelled += 1;
          else if (status.indexOf('Ошибка') === 0) error += 1;
        });
        queueSummary.textContent =
          'Всего: ' + total +
          ' · ждёт: ' + waiting +
          ' · в работе: ' + running +
          ' · готово: ' + done +
          ' · ошибок: ' + error +
          ' · отменено: ' + cancelled;
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
          td0.colSpan = 6;
          td0.style.opacity = '0.7';
          td0.textContent = lastQueueRows.length === 0 ? 'Очередь пуста' : 'Нет строк с таким статусом';
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
          } else if (rowCanRetry(r.status)) {
            mk('retry', 'Сбросить статус и скачать эту строку заново', '↻', r.id);
          }
          if (typeof r.outputPath === 'string' && r.outputPath) {
            mk('open-handler', 'Открыть скачанный файл в FluxAlloy', 'В обработчик', r.id);
            mk('open-file', 'Открыть скачанный файл', 'Файл', r.id);
            mk('open-folder', 'Показать файл в папке', 'Папка', r.id);
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
        }
      });
      if (queueStatusFilter) {
        queueStatusFilter.addEventListener('change', function () {
          renderRows(lastQueueRows);
        });
      }

      addBtn.addEventListener('click', function () {
        api.addLines(urls.value).then(function () {
          urls.value = '';
        });
      });
      clearBtn.addEventListener('click', function () {
        api.clearQueue();
      });
      if (clearFinishedBtn) {
        clearFinishedBtn.addEventListener('click', function () {
          api.clearFinishedRows().then(function () {
            api.getSnapshot().then(onQueueSnapshot);
          });
        });
      }
      startBtn.addEventListener('click', function () {
        api.startQueue();
      });
      function refreshPauseBtn() {
        if (!pauseYtdlpBtn || !api.getYtdlpPauseState) return;
        api.getYtdlpPauseState().then(function (s) {
          if (!pauseYtdlpBtn) return;
          if (!s.supported) {
            pauseYtdlpBtn.disabled = true;
            pauseYtdlpBtn.textContent = 'Пауза';
            pauseYtdlpBtn.title =
              'Пауза процесса yt-dlp недоступна в Windows (нужны SIGSTOP/SIGCONT).';
            return;
          }
          pauseYtdlpBtn.disabled = !s.active;
          if (!s.active) {
            pauseYtdlpBtn.textContent = 'Пауза';
            pauseYtdlpBtn.title = 'Приостановить текущую загрузку yt-dlp (SIGSTOP)';
          } else if (s.paused) {
            pauseYtdlpBtn.textContent = 'Продолжить';
            pauseYtdlpBtn.title = 'Возобновить загрузку yt-dlp (SIGCONT)';
          } else {
            pauseYtdlpBtn.textContent = 'Пауза';
            pauseYtdlpBtn.title = 'Приостановить текущую загрузку yt-dlp (SIGSTOP)';
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
        api.clearOutputDirectory().then(function () {
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
            openInHandlerOnComplete: !!(chkOpenInHandlerOnComplete && chkOpenInHandlerOnComplete.checked),
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
              schedulePreviewRefresh();
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
          schedulePreviewRefresh();
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
        if (txt) api.addLines(txt);
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

  ipcMain.handle(d.getSnapshot, (event) => {
    if (!isDownloadsSender(event.sender)) {
      return []
    }
    return getDownloadsQueueSnapshot()
  })

  ipcMain.handle(d.addLines, (event, text: unknown) => {
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
    d.getOutputDir,
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
    d.openOutputDir,
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
    d.getCliOptions,
    (
      event,
      raw?: unknown
    ): { ok: true; payload: YtdlpDownloadOptionsPayload } | { ok: false; error: string } => {
      if (!isDownloadsSender(event.sender)) {
        return { ok: false, error: 'Недопустимый отправитель' }
      }
      const fn = downloadsBoundsHooks.getYtdlpDownloadCliOptions
      if (!fn) {
        return { ok: false, error: 'Опции yt-dlp не подключены' }
      }
      return { ok: true, payload: fn(raw) }
    }
  )

  ipcMain.handle(
    d.setCliOptions,
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
        if (typeof o['filenameTemplate'] !== 'string') {
          return { ok: false, error: 'Шаблон имени должен быть строкой' }
        }
        patch.filenameTemplate = o['filenameTemplate']
      }
      if (Object.prototype.hasOwnProperty.call(o, 'formatPreset')) {
        patch.formatPreset = parseYtdlpFormatPreset(o['formatPreset'])
      }
      if (Object.prototype.hasOwnProperty.call(o, 'downloadPlaylist')) {
        if (typeof o['downloadPlaylist'] !== 'boolean') {
          return { ok: false, error: 'Поле плейлиста должно быть boolean' }
        }
        patch.downloadPlaylist = o['downloadPlaylist']
      }
      if (Object.prototype.hasOwnProperty.call(o, 'audioOnly')) {
        if (typeof o['audioOnly'] !== 'boolean') {
          return { ok: false, error: 'Поле «только аудио» должно быть boolean' }
        }
        patch.audioOnly = o['audioOnly']
      }
      if (Object.prototype.hasOwnProperty.call(o, 'subtitlePreset')) {
        patch.subtitlePreset = parseYtdlpSubtitlePreset(o['subtitlePreset'])
      }
      if (Object.prototype.hasOwnProperty.call(o, 'subLangs')) {
        if (typeof o['subLangs'] !== 'string') {
          return { ok: false, error: 'Языки субтитров должны быть строкой' }
        }
        patch.subLangs = o['subLangs']
      }
      if (Object.prototype.hasOwnProperty.call(o, 'cookiesBrowser')) {
        if (typeof o['cookiesBrowser'] !== 'string') {
          return { ok: false, error: 'Поле cookies браузера должно быть строкой' }
        }
        const cv = o['cookiesBrowser']
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
        if (typeof o['impersonate'] !== 'string') {
          return { ok: false, error: 'Поле impersonate должно быть строкой' }
        }
        const iv = o['impersonate']
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
        if (typeof o['rateLimit'] !== 'string') {
          return { ok: false, error: 'Ограничение скорости должно быть строкой' }
        }
        patch.rateLimit = o['rateLimit']
      }
      if (Object.prototype.hasOwnProperty.call(o, 'retriesLine')) {
        if (typeof o['retriesLine'] !== 'string') {
          return { ok: false, error: 'Количество повторов должно быть строкой' }
        }
        patch.retriesLine = o['retriesLine']
      }
      if (Object.prototype.hasOwnProperty.call(o, 'fragmentRetriesLine')) {
        if (typeof o['fragmentRetriesLine'] !== 'string') {
          return { ok: false, error: 'Количество повторов фрагментов должно быть строкой' }
        }
        patch.fragmentRetriesLine = o['fragmentRetriesLine']
      }
      if (Object.prototype.hasOwnProperty.call(o, 'extraArgsLine')) {
        if (typeof o['extraArgsLine'] !== 'string') {
          return { ok: false, error: 'Доп. аргументы должны быть строкой' }
        }
        patch.extraArgsLine = o['extraArgsLine']
      }
      if (Object.prototype.hasOwnProperty.call(o, 'queueRetryProfile')) {
        patch.queueRetryProfile = parseYtdlpQueueRetryProfile(o['queueRetryProfile'])
      }
      if (Object.prototype.hasOwnProperty.call(o, 'openInHandlerOnComplete')) {
        if (typeof o['openInHandlerOnComplete'] !== 'boolean') {
          return { ok: false, error: 'Флаг авто-открытия в обработчике должен быть boolean' }
        }
        patch.openInHandlerOnComplete = o['openInHandlerOnComplete']
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
        patch.queueRetryProfile === undefined &&
        patch.openInHandlerOnComplete === undefined
      ) {
        return { ok: false, error: 'Нечего сохранять' }
      }
      return fn(patch)
    }
  )

  ipcMain.handle(
    d.pickOutputDir,
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

  ipcMain.handle(d.clearOutputDir, (event) => {
    if (!isDownloadsSender(event.sender)) {
      return
    }
    downloadsBoundsHooks.clearYtdlpOutputDirectoryOverride?.()
  })

  ipcMain.handle(
    d.pickCookiesFile,
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

  ipcMain.handle(d.clearCookiesFile, (event) => {
    if (!isDownloadsSender(event.sender)) {
      return
    }
    downloadsBoundsHooks.clearYtdlpCookiesFile?.()
  })

  ipcMain.handle(d.clear, (event) => {
    if (!isDownloadsSender(event.sender)) {
      return
    }
    cancelDownloadsRunner()
    clearDownloadsQueue()
    broadcastDownloadsSnapshot()
  })

  ipcMain.handle(d.clearFinished, (event) => {
    if (!isDownloadsSender(event.sender)) {
      return 0
    }
    const removed = clearFinishedDownloadsQueueRows()
    broadcastDownloadsSnapshot()
    return removed
  })

  /** §6.4 — чтение истории завершённых загрузок (newest first). */
  ipcMain.handle(d.getHistory, (event) => {
    if (!isDownloadsSender(event.sender)) {
      return []
    }
    const paths = resolveAppPaths()
    return readYtdlpDownloadHistoryNewestFirst(paths.userData, 100)
  })

  ipcMain.handle(d.clearHistory, (event): { ok: true } | { ok: false; error: string } => {
    if (!isDownloadsSender(event.sender)) {
      return { ok: false, error: 'Недопустимый отправитель' }
    }
    const paths = resolveAppPaths()
    clearYtdlpDownloadHistory(paths.userData)
    return { ok: true }
  })

  ipcMain.handle(
    d.saveVisibleLog,
    async (
      event,
      raw: unknown
    ): Promise<{ ok: true; path: string } | { ok: false; error: string }> => {
      if (!isDownloadsSender(event.sender)) {
        return { ok: false, error: 'Недопустимый отправитель' }
      }
      if (typeof raw !== 'string' || raw.trim().length === 0) {
        return { ok: false, error: 'Лог пуст' }
      }
      const win = BrowserWindow.fromWebContents(event.sender)
      if (!win || win.isDestroyed()) {
        return { ok: false, error: 'Нет окна' }
      }
      const text = raw.length > 260_000 ? raw.slice(-260_000) : raw
      const stamp = new Date().toISOString().replace(/[:.]/g, '-')
      const pick = await dialog.showSaveDialog(win, {
        title: 'Сохранить лог yt-dlp',
        defaultPath: `fluxalloy-ytdlp-${stamp}.log`,
        filters: [
          { name: 'Log', extensions: ['log'] },
          { name: 'Text', extensions: ['txt'] }
        ]
      })
      if (pick.canceled || !pick.filePath) {
        return { ok: false, error: 'Сохранение отменено' }
      }
      try {
        writeFileSync(pick.filePath, text, 'utf-8')
        return { ok: true, path: pick.filePath }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        logError('downloads-window', 'save yt-dlp visible log failed', err)
        return { ok: false, error: msg }
      }
    }
  )

  ipcMain.handle(
    d.openQueueOutput,
    async (
      event,
      id: unknown,
      modeRaw: unknown
    ): Promise<{ ok: true } | { ok: false; error: string }> => {
      if (!isDownloadsSender(event.sender)) {
        return { ok: false, error: 'Недопустимый отправитель' }
      }
      if (typeof id !== 'number' || !Number.isFinite(id) || !isDownloadOutputOpenMode(modeRaw)) {
        return { ok: false, error: 'Некорректный запрос открытия файла' }
      }
      const row = getDownloadsQueueRowById(id)
      if (!row?.outputPath) {
        return { ok: false, error: 'У этой строки нет сохранённого пути к файлу.' }
      }
      return openDownloadOutputPath(row.outputPath, modeRaw)
    }
  )

  ipcMain.handle(
    d.openHistoryOutput,
    async (
      event,
      id: unknown,
      modeRaw: unknown
    ): Promise<{ ok: true } | { ok: false; error: string }> => {
      if (!isDownloadsSender(event.sender)) {
        return { ok: false, error: 'Недопустимый отправитель' }
      }
      if (typeof id !== 'string' || id.length === 0 || !isDownloadOutputOpenMode(modeRaw)) {
        return { ok: false, error: 'Некорректный запрос открытия файла' }
      }
      const paths = resolveAppPaths()
      const entry = readYtdlpDownloadHistoryNewestFirst(paths.userData, 500).find(
        (e) => e.id === id
      )
      if (!entry?.outputPath) {
        return { ok: false, error: 'У этой записи истории нет сохранённого пути к файлу.' }
      }
      return openDownloadOutputPath(entry.outputPath, modeRaw)
    }
  )

  ipcMain.handle(
    d.openQueueOutputInHandler,
    (event, id: unknown): { ok: true } | { ok: false; error: string } => {
      if (!isDownloadsSender(event.sender)) {
        return { ok: false, error: 'Недопустимый отправитель' }
      }
      if (typeof id !== 'number' || !Number.isFinite(id)) {
        return { ok: false, error: 'Некорректный идентификатор строки' }
      }
      const row = getDownloadsQueueRowById(id)
      if (!row?.outputPath) {
        return { ok: false, error: 'У этой строки нет сохранённого пути к файлу.' }
      }
      return openDownloadOutputInHandler(row.outputPath)
    }
  )

  ipcMain.handle(
    d.openHistoryOutputInHandler,
    (event, id: unknown): { ok: true } | { ok: false; error: string } => {
      if (!isDownloadsSender(event.sender)) {
        return { ok: false, error: 'Недопустимый отправитель' }
      }
      if (typeof id !== 'string' || id.length === 0) {
        return { ok: false, error: 'Некорректный идентификатор истории' }
      }
      const paths = resolveAppPaths()
      const entry = readYtdlpDownloadHistoryNewestFirst(paths.userData, 500).find(
        (e) => e.id === id
      )
      if (!entry?.outputPath) {
        return { ok: false, error: 'У этой записи истории нет сохранённого пути к файлу.' }
      }
      return openDownloadOutputInHandler(entry.outputPath)
    }
  )

  ipcMain.handle(d.remove, (event, id: unknown) => {
    if (!isDownloadsSender(event.sender)) {
      return
    }
    if (typeof id !== 'number' || !Number.isFinite(id)) {
      return
    }
    removeDownloadsQueueRow(id)
    broadcastDownloadsSnapshot()
  })

  ipcMain.handle(d.move, (event, id: unknown, direction: unknown) => {
    if (!isDownloadsSender(event.sender)) {
      return
    }
    if (typeof id !== 'number' || !Number.isFinite(id)) {
      return
    }
    const delta = direction === -1 || direction === 1 ? direction : 0
    if (delta === 0) {
      return
    }
    moveDownloadsQueueRow(id, delta)
    broadcastDownloadsSnapshot()
  })

  ipcMain.handle(
    d.startQueue,
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
    d.startRow,
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
    d.retryRow,
    async (event, id: unknown): Promise<{ ok: true } | { ok: false; error: string }> => {
      if (!isDownloadsSender(event.sender)) {
        return { ok: false, error: 'Недопустимый отправитель' }
      }
      if (typeof id !== 'number' || !Number.isFinite(id)) {
        return { ok: false, error: 'Некорректный идентификатор строки' }
      }
      const current = getDownloadsQueueSnapshot().find((row) => row.id === id)
      if (!current) {
        return { ok: false, error: 'Строка не найдена' }
      }
      if (current.status === 'Загрузка…' || current.status.startsWith('Пауза перед повтором')) {
        return { ok: false, error: 'Нельзя повторить строку, пока она выполняется.' }
      }
      if (!resetDownloadsQueueRowForRetry(id)) {
        return { ok: false, error: 'Не удалось сбросить строку' }
      }
      broadcastDownloadsSnapshot()
      try {
        return await startDownloadSingleRow(id)
      } catch (err: unknown) {
        logError('downloads-queue', 'retry row failed', err)
        return { ok: false, error: err instanceof Error ? err.message : String(err) }
      }
    }
  )

  ipcMain.handle(d.cancelRun, (event): { ok: true } | { ok: false; error: string } => {
    if (!isDownloadsSender(event.sender)) {
      return { ok: false, error: 'Недопустимый отправитель' }
    }
    cancelDownloadsRunner()
    broadcastDownloadsSnapshot()

    return { ok: true }
  })

  ipcMain.handle(
    d.getYtdlpPauseState,
    (event): { supported: boolean; active: boolean; paused: boolean } => {
      if (!isDownloadsSender(event.sender)) {
        return { supported: false, active: false, paused: false }
      }
      return getActiveYtdlpPauseState()
    }
  )

  ipcMain.handle(d.pauseYtdlp, (event): { ok: true } | { ok: false; error: string } => {
    if (!isDownloadsSender(event.sender)) {
      return { ok: false, error: 'Недопустимый отправитель' }
    }
    const res = pauseActiveYtdlpProcess()
    if (res.ok) {
      const rowId = getActiveDownloadsRunnerRowId()
      if (rowId !== null) {
        emitDownloadsLog({
          kind: 'line',
          rowId,
          stream: 'stderr',
          text: '[FluxAlloy] Процесс yt-dlp приостановлен (SIGSTOP).'
        })
      }
    }
    return res
  })

  ipcMain.handle(d.resumeYtdlp, (event): { ok: true } | { ok: false; error: string } => {
    if (!isDownloadsSender(event.sender)) {
      return { ok: false, error: 'Недопустимый отправитель' }
    }
    const res = resumeActiveYtdlpProcess()
    if (res.ok) {
      const rowId = getActiveDownloadsRunnerRowId()
      if (rowId !== null) {
        emitDownloadsLog({
          kind: 'line',
          rowId,
          stream: 'stderr',
          text: '[FluxAlloy] Процесс yt-dlp возобновлён (SIGCONT).'
        })
      }
    }
    return res
  })
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
    minWidth: 520,
    minHeight: 420,
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

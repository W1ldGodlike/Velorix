import { writeFileSync } from 'fs'
import { BrowserWindow, app, dialog, ipcMain, shell, type WebContents } from 'electron'

import { resolveAppPaths } from './app-paths'
import type { DownloadsWindowUiPanelState } from '../shared/settings-contract'
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
import {
  attachDownloadsQueuePersistOnQuitOnce,
  hydrateDownloadsQueueFromDisk,
  schedulePersistDownloadsQueueDebounced
} from './ytdlp-download-queue-persist'
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
  /** §4.1 — снимок раскрытых секций для первичной разметки `buildDownloadsHtml`. */
  getDownloadsWindowUiPanelsSnapshot?: () => DownloadsWindowUiPanelState | undefined
  /** §4.1 — сохранить частичное состояние раскрытых секций в `settings.json`. */
  mergeDownloadsWindowUiPanelsPatch?: (patch: Partial<DownloadsWindowUiPanelState>) => void
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
  schedulePersistDownloadsQueueDebounced()
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

function sanitizeDownloadsUiPanelPatch(raw: unknown): Partial<DownloadsWindowUiPanelState> {
  if (!raw || typeof raw !== 'object') {
    return {}
  }
  const keys: (keyof DownloadsWindowUiPanelState)[] = [
    'history',
    'log',
    'format',
    'metadata',
    'saving',
    'network',
    'expert',
    'hints'
  ]
  const o = raw as Record<string, unknown>
  const out: Partial<DownloadsWindowUiPanelState> = {}
  for (const k of keys) {
    if (typeof o[k] === 'boolean') {
      out[k] = o[k]
    }
  }
  return out
}

function buildDownloadsHtml(panelState?: DownloadsWindowUiPanelState): string {
  const openAttr = (key: keyof DownloadsWindowUiPanelState, defaultOpen: boolean): string => {
    const v = panelState?.[key]
    const isOpen = typeof v === 'boolean' ? v : defaultOpen
    return isOpen ? ' open' : ''
  }
  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <title>FluxAlloy — менеджер загрузок</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #020407;
      --surface: #070a0f;
      --surface-2: #0d1219;
      --surface-3: #111823;
      --border: #151c27;
      --border-2: #202936;
      --text: #e8edf5;
      --muted: #9aa7b7;
      --dim: #5f6b7a;
      --blue: #2f8cff;
      --green: #22c55e;
      --red: #ef4444;
    }
    * { box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; }
    body {
      font-family: system-ui, Segoe UI, sans-serif; margin: 0; background: var(--bg); color: var(--text);
      line-height: 1.42; font-size: 11.5px;
    }
    .dl-shell { height: 100%; min-width: 0; display: flex; flex-direction: column; overflow: hidden; }
    .dl-topbar {
      min-height: 54px; display: grid; grid-template-columns: minmax(12rem, auto) 1fr auto; align-items: center;
      gap: 0.55rem; padding: 0.4rem 0.72rem; background: color-mix(in srgb, var(--bg) 86%, #111827 14%);
      border-bottom: 1px solid var(--border); flex-shrink: 0;
    }
    .brand { display: inline-flex; align-items: center; gap: 0.45rem; min-width: 0; }
    .brand-mark {
      display: inline-grid; place-items: center; width: 1.25rem; height: 1.25rem; border-radius: 6px;
      color: var(--blue); background: color-mix(in srgb, var(--blue) 15%, transparent); font-size: 0.8rem;
    }
    h1 { font-size: 0.84rem; font-weight: 700; margin: 0; letter-spacing: 0.01em; }
    .brand-version { color: var(--dim); font-size: 0.68rem; font-family: ui-monospace, Consolas, Menlo, monospace; }
    .workspace-tabs { justify-self: center; display: inline-flex; align-items: center; gap: 0.15rem; }
    .workspace-tab {
      min-height: 1.95rem; padding: 0 0.62rem; border: none; border-bottom: 2px solid transparent; background: transparent;
      color: var(--dim); cursor: default; font-size: 0.74rem; font-weight: 600;
    }
    .workspace-tab.active { color: var(--text); border-bottom-color: var(--blue); }
    .topbar-meta { justify-self: end; color: var(--dim); font-family: ui-monospace, Consolas, Menlo, monospace; font-size: 0.68rem; }
    .dl-main {
      flex: 1; min-height: 0; min-width: 0; display: grid; grid-template-columns: minmax(0, 1fr) minmax(258px, 276px);
      overflow: hidden;
    }
    .dl-workspace { min-width: 0; min-height: 0; display: flex; flex-direction: column; border-right: 1px solid var(--border); }
    .dl-input-band {
      display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 0.55rem; padding: 0.52rem 0.62rem;
      border-bottom: 1px solid var(--border); background: var(--surface);
    }
    .input-label { display: block; margin: 0 0 0.3rem; color: var(--muted); font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
    .hint { color: var(--dim); font-size: 0.7rem; margin: 0.28rem 0 0; }
    textarea {
      width: 100%; min-height: 64px; box-sizing: border-box; resize: vertical; border-radius: 6px;
      border: 1px solid var(--border-2); background: color-mix(in srgb, var(--bg) 66%, var(--surface-2));
      color: var(--text); padding: 0.42rem 0.55rem; font-family: ui-monospace, Consolas, Menlo, monospace; font-size: 0.72rem;
      line-height: 1.38;
    }
    textarea.drag { outline: 2px dashed var(--blue); outline-offset: 2px; }
    .input-actions { display: flex; flex-direction: column; gap: 0.36rem; min-width: 10.75rem; justify-content: end; }
    .queue-toolbar {
      display: flex; gap: 0.38rem; flex-wrap: wrap; align-items: center; padding: 0.34rem 0.62rem;
      border-bottom: 1px solid var(--border); background: color-mix(in srgb, var(--surface) 94%, transparent);
    }
    label.inline-filter { display: inline-flex; align-items: center; gap: 0.4rem; color: var(--muted); font-size: 0.72rem; }
    label.inline-filter select, .history-actions select {
      border-radius: 6px; border: 1px solid var(--border-2); background: var(--surface-2); color: var(--text);
      padding: 0.32rem 0.45rem; font-size: 0.74rem;
    }
    .queue-summary { margin-left: auto; color: var(--dim); font-size: 0.68rem; font-variant-numeric: tabular-nums; }
    button.cmd {
      border-radius: 6px; border: 1px solid var(--border-2); background: var(--surface-2); color: var(--text);
      padding: 0.32rem 0.6rem; font-size: 0.72rem; cursor: pointer; min-height: 28px;
    }
    button.cmd:hover { background: var(--surface-3); }
    button.cmd:disabled { opacity: 0.45; cursor: not-allowed; }
    button.cmd-primary { border-color: transparent; background: var(--blue); color: white; }
    button.cmd-warn { border-color: color-mix(in srgb, var(--red) 45%, var(--border-2)); color: color-mix(in srgb, var(--red) 80%, white); }
    .queue-table-wrap { flex: 1; min-height: 0; overflow: auto; background: var(--bg); }
    table { width: 100%; border-collapse: collapse; font-size: 0.7rem; table-layout: fixed; }
    th, td { border-bottom: 1px solid var(--border); padding: 0.28rem 0.4rem; text-align: left; vertical-align: top; word-break: break-word; }
    th { position: sticky; top: 0; z-index: 1; color: var(--muted); background: var(--surface); font-weight: 700; font-size: 0.64rem; text-transform: uppercase; letter-spacing: 0.06em; line-height: 1.28; }
    table.queue-table th:nth-child(1), table.queue-table td:nth-child(1) { width: 2.1rem; }
    table.queue-table th:nth-child(2), table.queue-table td:nth-child(2) { width: 24%; }
    table.queue-table th:nth-child(3), table.queue-table td:nth-child(3) { width: 8.5%; }
    table.queue-table th:nth-child(4), table.queue-table td:nth-child(4) { width: 7.5%; }
    table.queue-table th:nth-child(5), table.queue-table td:nth-child(5) { width: 11.5%; }
    table.queue-table th:nth-child(6), table.queue-table td:nth-child(6) { width: 10%; }
    table.queue-table th:nth-child(7), table.queue-table td:nth-child(7) { width: 5rem; }
    table.queue-table th:nth-child(8), table.queue-table td:nth-child(8) { width: 11%; }
    table.queue-table th:nth-child(9), table.queue-table td:nth-child(9) { width: 13rem; min-width: 9.5rem; }
    td.num { color: var(--dim); font-variant-numeric: tabular-nums; }
    .queue-title { color: var(--text); font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .queue-url { margin-top: 0.08rem; color: var(--dim); font-size: 0.64rem; font-family: ui-monospace, Consolas, Menlo, monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    td.prog { font-variant-numeric: tabular-nums; color: var(--muted); white-space: normal; word-break: break-word; font-size: 0.68rem; line-height: 1.35; }
    td.queue-col-fmt, td.queue-col-size, td.queue-col-spd, td.queue-col-eta {
      font-variant-numeric: tabular-nums; font-size: 0.65rem; color: var(--muted);
    }
    .progress-track { height: 3px; border-radius: 999px; background: var(--border-2); overflow: hidden; margin: 0.14rem 0 0.12rem; }
    .progress-fill { height: 100%; border-radius: inherit; background: var(--blue); }
    .status-pill { display: inline-flex; align-items: center; gap: 0.34rem; color: var(--muted); }
    .status-dot { width: 0.45rem; height: 0.45rem; border-radius: 999px; background: var(--dim); flex-shrink: 0; }
    .status-running .status-dot { background: var(--blue); }
    .status-done .status-dot { background: var(--green); }
    .status-error .status-dot { background: var(--red); }
    .status-cancelled .status-dot { background: var(--dim); }
    td.act { vertical-align: middle; min-width: 8.75rem; max-width: 15rem; }
    .act-icons {
      display: inline-flex; flex-wrap: wrap; gap: 0.14rem; align-items: center;
      justify-content: flex-end;
    }
    td.act button.icon-btn, .icon-btn {
      width: 24px; height: 24px; display: inline-grid; place-items: center; margin: 0; border: none;
      border-radius: 5px; background: transparent; color: var(--muted); cursor: pointer; padding: 0;
      flex-shrink: 0;
    }
    td.act button.icon-btn:hover, .icon-btn:hover { background: var(--surface-2); color: var(--text); }
    td.act button.icon-btn:disabled { opacity: 0.35; cursor: not-allowed; }
    td.act button.icon-btn-warn { color: color-mix(in srgb, var(--red) 88%, white); }
    td.act button.icon-btn-warn:hover { background: color-mix(in srgb, var(--red) 12%, var(--surface-2)); color: var(--red); }
    .bottom-panels { flex-shrink: 0; min-height: 136px; max-height: 32vh; display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid var(--border); background: var(--surface); overflow: hidden; }
    .log-panel, .history-panel { min-height: 0; overflow: auto; padding: 0; border: none; margin: 0; }
    .log-panel { border-left: 1px solid var(--border); }
    .log-panel summary, .history-panel summary {
      cursor: pointer; font-weight: 700; font-size: 0.64rem; padding: 0.36rem 0.55rem; margin: 0;
      user-select: none; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em;
    }
    .log-panel pre {
      margin: 0 0.55rem 0.52rem; max-height: 200px; overflow: auto; white-space: pre-wrap; word-break: break-word;
      font-family: ui-monospace, Consolas, Menlo, monospace; font-size: 0.64rem; line-height: 1.32;
      background: var(--bg); color: var(--muted); padding: 0.45rem 0.52rem; border-radius: 5px; border: 1px solid var(--border);
    }
    .settings-rail { min-width: 0; min-height: 0; overflow: auto; background: var(--surface); }
    .rail-head { padding: 0.5rem 0.62rem; border-bottom: 1px solid var(--border); }
    .rail-title { margin: 0; color: var(--text); font-size: 0.82rem; font-weight: 700; }
    .rail-subtitle { margin: 0.1rem 0 0; color: var(--dim); font-size: 0.68rem; line-height: 1.35; }
    .settings-section { border-bottom: 1px solid var(--border); }
    .settings-section > summary {
      cursor: pointer; list-style: none; padding: 0.42rem 0.62rem; color: var(--muted); font-size: 0.64rem;
      font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; user-select: none;
      line-height: 1.3;
    }
    .settings-section > summary::-webkit-details-marker { display: none; }
    .settings-section > summary::before { content: '▸'; display: inline-block; margin-right: 0.45rem; color: var(--dim); transition: transform 0.12s ease; }
    .settings-section[open] > summary::before { transform: rotate(90deg); }
    .settings-body { padding: 0 0.62rem 0.58rem; }
    .out-dir-row { display: flex; align-items: center; gap: 0.45rem; flex-wrap: wrap; margin: 0.35rem 0 0.65rem; font-size: 0.74rem; }
    .out-dir-row .out-path {
      flex: 1 1 100%; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      font-family: ui-monospace, Consolas, Menlo, monospace; font-size: 0.68rem; color: var(--muted);
    }
    .opts-panel { font-size: 0.74rem; }
    .opts-panel label { display: block; margin: 0.5rem 0 0.25rem; color: var(--muted); font-weight: 700; font-size: 0.68rem; }
    .opts-panel input[type=text], .opts-panel select, .hint-select {
      width: 100%; min-width: 0; margin-bottom: 0.35rem; padding: 0.42rem 0.5rem; border-radius: 6px;
      border: 1px solid var(--border-2); background: color-mix(in srgb, var(--bg) 66%, var(--surface-2));
      color: var(--text); font-size: 0.72rem;
    }
    .opts-panel input[type=text] { font-family: ui-monospace, Consolas, Menlo, monospace; }
    .opts-actions { display: flex; gap: 0.4rem; flex-wrap: wrap; align-items: center; margin-top: 0.45rem; }
    .opts-check-row { display: flex; flex-direction: column; gap: 0.45rem; margin: 0.55rem 0; }
    .opts-check-row label.chk { display: flex; align-items: center; gap: 0.5rem; font-weight: 400; color: var(--text); cursor: pointer; margin: 0; line-height: 1.35; }
    .opts-check-row input[type=checkbox] { appearance: none; width: 32px; height: 18px; border-radius: 999px; border: 1px solid var(--border-2); background: var(--surface-3); position: relative; flex-shrink: 0; }
    .opts-check-row input[type=checkbox]::after { content: ''; position: absolute; width: 12px; height: 12px; top: 2px; left: 2px; border-radius: 999px; background: var(--dim); transition: transform 0.12s ease, background 0.12s ease; }
    .opts-check-row input[type=checkbox]:checked { background: color-mix(in srgb, var(--blue) 55%, var(--surface-3)); border-color: transparent; }
    .opts-check-row input[type=checkbox]:checked::after { transform: translateX(14px); background: white; }
    .opts-check-muted { color: var(--dim); font-size: 0.68rem; }
    .opts-preview-label { display: block; margin: 0.5rem 0 0.25rem; font-size: 0.68rem; color: var(--muted); font-weight: 700; }
    .expert-panel, .hints-panel { margin: 0.55rem 0; padding: 0; border: none; background: transparent; }
    .expert-panel summary, .hints-panel summary { cursor: pointer; font-weight: 700; font-size: 0.72rem; color: var(--muted); user-select: none; margin-bottom: 0.45rem; }
    textarea#extraArgsInput {
      width: 100%; min-height: 52px; margin-bottom: 0.4rem; padding: 0.45rem 0.5rem; border-radius: 6px;
      border: 1px solid var(--border-2); background: var(--bg); color: var(--text);
      font-family: ui-monospace, Consolas, Menlo, monospace; font-size: 0.68rem; resize: vertical;
    }
    .opts-warn { color: color-mix(in srgb, var(--red) 82%, white); margin: 0.35rem 0; line-height: 1.35; }
    .args-preview {
      margin: 0 0 0.5rem; padding: 0.5rem 0.6rem; border-radius: 6px; border: 1px solid var(--border);
      background: var(--bg); color: color-mix(in srgb, var(--green) 78%, white); font-family: ui-monospace, Consolas, Menlo, monospace;
      font-size: 0.68rem; white-space: pre-wrap; word-break: break-word; max-height: 120px; overflow: auto;
    }
    #hintSummary { min-height: 2.5em; margin-top: 0.4rem; }
    .opts-hint { font-size: 0.68rem; color: var(--dim); margin: 0 0 0.5rem; line-height: 1.35; }
    .note { display: none; }
    .history-actions { display: flex; gap: 0.45rem; flex-wrap: wrap; align-items: center; padding: 0 0.65rem 0.55rem; }
    .history-actions label { display: inline-flex; align-items: center; gap: 0.4rem; color: var(--muted); font-size: 0.7rem; }
    table.history-table { font-size: 0.64rem; }
    table.history-table th, table.history-table td { padding: 0.28rem 0.38rem; }
    table.history-table th:nth-child(1), table.history-table td:nth-child(1) { width: 10.5rem; white-space: nowrap; }
    table.history-table th:nth-child(4), table.history-table td:nth-child(4) { width: 5.5rem; }
    table.history-table th:nth-child(5), table.history-table td:nth-child(5) { width: 3rem; text-align: right; }
    table.history-table th:nth-child(7), table.history-table td:nth-child(7) { min-width: 10rem; width: 10rem; text-align: right; }
    td.h-out-ok { color: var(--green); }
    td.h-out-err { color: var(--red); }
    td.h-out-can { color: var(--blue); }
    textarea:focus-visible, button.cmd:focus-visible, td.act button.icon-btn:focus-visible {
      outline: 1px solid color-mix(in srgb, var(--blue) 65%, transparent);
      outline-offset: 1px;
    }
    @media (max-width: 960px) {
      .dl-main { grid-template-columns: 1fr; }
      .settings-rail { display: none; }
      .bottom-panels { grid-template-columns: 1fr; max-height: 40vh; }
      .log-panel { border-left: none; border-top: 1px solid var(--border); }
    }
  </style>
</head>
<body>
  <div class="dl-shell">
    <header class="dl-topbar">
      <div class="brand">
        <span class="brand-mark" aria-hidden>◇</span>
        <h1>FluxAlloy</h1>
        <span class="brand-version">yt-dlp</span>
      </div>
      <nav class="workspace-tabs" aria-label="Рабочие вкладки">
        <button type="button" class="workspace-tab" disabled title="Редактор находится в главном окне">Редактор</button>
        <button type="button" class="workspace-tab active">Загрузки</button>
      </nav>
      <div class="topbar-meta">ffmpeg / yt-dlp queue</div>
    </header>
    <main class="dl-main">
      <section class="dl-workspace" aria-label="Очередь загрузок">
        <div class="dl-input-band">
          <div>
            <label class="input-label" for="urls">Введите URL (каждый с новой строки)</label>
            <textarea id="urls" placeholder="https://…"></textarea>
            <p class="hint">Ссылки по строкам или DnD текста/URL. Очередь последовательная §6.</p>
          </div>
          <div class="input-actions">
            <button type="button" class="cmd cmd-primary" id="addBtn">Добавить в очередь</button>
            <button type="button" class="cmd" id="startBtn" title="Скачать все строки со статусом «Ожидание»">Начать загрузку</button>
          </div>
        </div>
        <div class="queue-toolbar">
          <button type="button" class="cmd" id="pauseYtdlpBtn" title="Приостановить загрузку (POSIX); на Windows недоступно">Пауза</button>
          <button type="button" class="cmd cmd-warn" id="cancelBtn" title="Отменить текущую загрузку yt-dlp">Отмена</button>
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
        <div class="queue-table-wrap">
          <table class="queue-table">
            <thead><tr><th>#</th><th>Название</th><th>Формат</th><th>Размер</th><th>Прогресс</th><th>Скорость</th><th>ETA</th><th>Статус</th><th>Действия</th></tr></thead>
            <tbody id="queueBody"></tbody>
          </table>
        </div>
        <div class="bottom-panels">
          <details class="history-panel" id="historyDetails"${openAttr('history', false)}>
            <summary>История загрузок</summary>
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
            <details id="logDetails"${openAttr('log', true)}>
              <summary>Журнал операций</summary>
              <div class="history-actions">
                <button type="button" class="cmd" id="saveLogBtn">Сохранить лог…</button>
              </div>
              <pre id="logPre"></pre>
            </details>
          </div>
        </div>
      </section>
      <aside class="settings-rail" aria-label="Настройки загрузки">
        <div class="rail-head">
          <h2 class="rail-title">Настройки загрузки</h2>
          <p class="rail-subtitle">Секции повторяют v0-подход: формат, метаданные, сохранение, сеть.</p>
        </div>
        <div class="opts-panel">
          <details class="settings-section" id="dlRailFormat"${openAttr('format', true)}>
            <summary>Формат</summary>
            <div class="settings-body">
              <p class="opts-hint">Параметры сохраняются в userData/settings.json. Шаблон обязан содержать %(ext)s.</p>
              <label for="fmtPreset">Формат / качество (-f)</label>
              <select id="fmtPreset"></select>
              <div class="opts-check-row">
                <label class="chk"><input type="checkbox" id="chkPlaylist" /> Весь плейлист <span class="opts-check-muted">--yes-playlist</span></label>
                <label class="chk"><input type="checkbox" id="chkAudioOnly" /> Только аудио <span class="opts-check-muted">-x --audio-format best</span></label>
              </div>
              <label for="subPreset">Субтитры §6.2</label>
              <select id="subPreset">
                <option value="none">Не скачивать</option>
                <option value="manual">Ручные дорожки (--write-subs)</option>
                <option value="manual_auto">Ручные + автосгенерированные (--write-auto-subs)</option>
              </select>
              <label for="subLangsInput">Языки субтитров</label>
              <input type="text" id="subLangsInput" spellcheck="false" autocomplete="off" placeholder="ru,en или all" />
            </div>
          </details>
          <details class="settings-section" id="dlRailMeta"${openAttr('metadata', true)}>
            <summary>Метаданные</summary>
            <div class="settings-body">
              <label for="cookiesBrowserSelect">Cookies §6.2</label>
              <select id="cookiesBrowserSelect">
                <option value="none">Не использовать</option>
                <option value="chrome">Из браузера: Chrome</option>
                <option value="edge">Из браузера: Edge</option>
                <option value="firefox">Из браузера: Firefox</option>
              </select>
              <div class="out-dir-row">
                <span>Файл cookies:</span>
                <span id="cookiesPathText" class="out-path" title="">—</span>
                <button type="button" class="cmd" id="pickCookiesBtn">Выбрать…</button>
                <button type="button" class="cmd" id="clearCookiesBtn" title="Убрать файл из настроек">Очистить</button>
              </div>
              <p class="opts-hint opts-warn" id="cookiesWarn" hidden></p>
              <label for="impersonateSelect">Impersonate клиента</label>
              <select id="impersonateSelect">
                <option value="none">Выключено</option>
                <option value="chrome">chrome</option>
                <option value="edge">edge</option>
                <option value="firefox">firefox</option>
              </select>
              <div class="opts-check-row">
                <label class="chk"><input type="checkbox" id="chkOpenInHandlerOnComplete" /> Открывать результат в обработчике <span class="opts-check-muted">§6.4</span></label>
              </div>
            </div>
          </details>
          <details class="settings-section" id="dlRailSave"${openAttr('saving', true)}>
            <summary>Сохранение</summary>
            <div class="settings-body">
              <div class="out-dir-row">
                <span>Каталог загрузок:</span>
                <span id="outDirText" class="out-path" title="">…</span>
                <button type="button" class="cmd" id="openOutBtn" title="Открыть текущий каталог загрузок в проводнике">Открыть</button>
                <button type="button" class="cmd" id="pickOutBtn">Выбрать…</button>
                <button type="button" class="cmd" id="resetOutBtn" title="Использовать каталог по умолчанию в userData">По умолчанию</button>
              </div>
              <label for="tmplInput">Шаблон имени (-o)</label>
              <input type="text" id="tmplInput" spellcheck="false" autocomplete="off" />
              <div class="opts-actions">
                <button type="button" class="cmd cmd-primary" id="applyOptsBtn">Сохранить параметры</button>
                <button type="button" class="cmd" id="tmplReset">Шаблон по умолчанию</button>
              </div>
            </div>
          </details>
          <details class="settings-section" id="dlRailNet"${openAttr('network', false)}>
            <summary>Сеть</summary>
            <div class="settings-body">
              <label for="rateLimitInput">Ограничение скорости (--limit-rate)</label>
              <input type="text" id="rateLimitInput" spellcheck="false" autocomplete="off" placeholder="500K или 2M" />
              <label for="retriesInput">Повторы при ошибках (--retries)</label>
              <input type="text" id="retriesInput" inputmode="numeric" spellcheck="false" autocomplete="off" placeholder="0–99" />
              <label for="fragmentRetriesInput">Повторы фрагментов (--fragment-retries)</label>
              <input type="text" id="fragmentRetriesInput" inputmode="numeric" spellcheck="false" autocomplete="off" placeholder="0–99" />
              <label for="queueRetrySelect">Повтор строки при сбое</label>
              <select id="queueRetrySelect" aria-label="Профиль повторов очереди при ошибке">
                <option value="off">Выключено</option>
                <option value="light">Лёгкий (1 повтор, 2.5 с)</option>
                <option value="normal">Обычный (2 повтора: 3 с + 8 с)</option>
                <option value="persistent">Устойчивый (3 повтора: 5 с + 15 с + 45 с)</option>
              </select>
            </div>
          </details>
          <details class="settings-section" id="expertArgsDetails"${openAttr('expert', false)}>
            <summary>Экспертные argv</summary>
            <div class="settings-body">
              <label for="extraArgsInput">Дополнительные аргументы (без shell)</label>
              <textarea id="extraArgsInput" rows="2" spellcheck="false" autocomplete="off" placeholder="Например: --write-sub --sub-lang ru"></textarea>
              <p class="opts-hint opts-warn" id="extraArgsWarn" hidden></p>
              <label for="previewOutDirOverride">Другой каталог для превью -o</label>
              <input type="text" id="previewOutDirOverride" spellcheck="false" autocomplete="off" placeholder="Только строка превью argv" />
              <span class="opts-preview-label">Превью argv</span>
              <pre class="args-preview" id="argsPreview"></pre>
              <details class="hints-panel" id="hintsPanel"${openAttr('hints', false)}>
                <summary>Справочник флагов</summary>
                <select id="hintInsert" class="hint-select" aria-label="Вставить флаг из справочника">
                  <option value="">Выберите флаг — он добавится в «Доп. аргументы»…</option>
                </select>
                <p class="opts-hint" id="hintSummary"></p>
              </details>
            </div>
          </details>
        </div>
      </aside>
    </main>
    <p class="note">Отдельный preload IPC только для этого окна. yt-dlp запускается из main через spawn без shell.</p>
  </div>
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

      function isRowDownloading(status) {
        return status === 'Загрузка…' || (typeof status === 'string' && status.indexOf('Пауза перед повтором') === 0);
      }

      /** Lucide-подобные мини-иконки для столбца действий (stroke, 24 viewBox → 14px). */
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
          width: '14',
          height: '14',
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
      var RowIco = {
        play: function () {
          return svgIcon([{ tag: 'polygon', attr: { points: '6 4 20 12 6 20 6 4' } }]);
        },
        pause: function () {
          return svgIcon([
            { tag: 'rect', attr: { x: '7', y: '5', width: '3.5', height: '14', rx: '1' } },
            { tag: 'rect', attr: { x: '14.5', y: '5', width: '3.5', height: '14', rx: '1' } }
          ]);
        },
        retry: function () {
          return svgIcon([
            { tag: 'path', attr: { d: 'M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8' } },
            { tag: 'path', attr: { d: 'M21 3v5h-5' } },
            { tag: 'path', attr: { d: 'M3 12a9 9 0 0 1 9 9c2.52 0 4.93-1 6.74-2.74L3 16' } },
            { tag: 'path', attr: { d: 'M8 16H3v5' } }
          ]);
        },
        plus: function () {
          return svgIcon([
            { tag: 'path', attr: { d: 'M12 5v14' } },
            { tag: 'path', attr: { d: 'M5 12h14' } }
          ]);
        },
        outbound: function () {
          return svgIcon([
            { tag: 'path', attr: { d: 'M15 3h6v6' } },
            { tag: 'path', attr: { d: 'M10 14 21 3' } },
            { tag: 'path', attr: { d: 'M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' } }
          ]);
        },
        file: function () {
          return svgIcon([
            { tag: 'path', attr: { d: 'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z' } },
            { tag: 'path', attr: { d: 'M14 2v4a2 2 0 0 0 2 2h4' } }
          ]);
        },
        folder: function () {
          return svgIcon([
            {
              tag: 'path',
              attr: {
                d: 'm6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.89l.82 1.24a2 2 0 0 0 1.66.89H18a2 2 0 0 1 2 2v2'
              }
            }
          ]);
        },
        chevUp: function () {
          return svgIcon([{ tag: 'path', attr: { d: 'm18 15-6-6-6 6' } }]);
        },
        chevDown: function () {
          return svgIcon([{ tag: 'path', attr: { d: 'm6 9 6 6 6-6' } }]);
        },
        trash: function () {
          return svgIcon([
            { tag: 'path', attr: { d: 'M3 6h18' } },
            { tag: 'path', attr: { d: 'M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6' } },
            { tag: 'path', attr: { d: 'M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2' } }
          ]);
        },
        stop: function () {
          return svgIcon([
            { tag: 'rect', attr: { x: '7', y: '7', width: '10', height: '10', rx: '2' } }
          ]);
        }
      };

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
              'Добавить этот URL в очередь повторно',
              { 'data-history-url': u },
              RowIco.plus,
              ''
            );
          }
          if (typeof e.outputPath === 'string' && e.outputPath) {
            var hid = typeof e.id === 'string' ? e.id : '';
            mkHistIcon(
              'Открыть скачанный файл в FluxAlloy',
              { 'data-history-handler': hid },
              RowIco.outbound,
              ''
            );
            mkHistIcon(
              'Открыть скачанный файл',
              { 'data-history-open': 'file', 'data-history-id': hid },
              RowIco.file,
              ''
            );
            mkHistIcon(
              'Показать файл в папке',
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

      function statusClass(status) {
        if (status === 'Загрузка…' || status.indexOf('Пауза перед повтором') === 0) return 'status-running';
        if (status === 'Готово') return 'status-done';
        if (status === 'Отменено') return 'status-cancelled';
        if (status.indexOf('Ошибка') === 0) return 'status-error';
        return 'status-waiting';
      }

      function parseProgressPercent(text) {
        var m = String(text || '').match(/(\\d+(?:[.,]\\d+)?)\\s*%/);
        if (!m) return null;
        var n = Number(m[1].replace(',', '.'));
        if (!isFinite(n)) return null;
        return Math.max(0, Math.min(100, n));
      }

      function tdProgress(text) {
        var td = document.createElement('td');
        td.className = 'prog';
        var raw = text || '—';
        var head = raw;
        if (raw !== '—') {
          var segs = raw.split(' · ');
          head = segs.length > 0 && segs[0] ? segs[0].trim() : raw;
        }
        var pct = parseProgressPercent(head);
        if (pct !== null) {
          var track = document.createElement('div');
          track.className = 'progress-track';
          var fill = document.createElement('div');
          fill.className = 'progress-fill';
          fill.style.width = pct + '%';
          track.appendChild(fill);
          td.appendChild(track);
        }
        var label = document.createElement('div');
        label.className = 'prog-head';
        label.textContent = head;
        td.appendChild(label);
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
        var pill = document.createElement('span');
        pill.className = 'status-pill ' + statusClass(status || '');
        var dot = document.createElement('span');
        dot.className = 'status-dot';
        var label = document.createElement('span');
        label.textContent = status || '—';
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
          td0.colSpan = 9;
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
          tr.appendChild(tdProgress(r.progress || '—'));
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
              'Отменить текущую загрузку yt-dlp (эта строка)',
              r.id,
              RowIco.stop,
              'icon-btn-warn'
            );
          }
          if (dl && activeRun && r.ytdlpPauseSupported && r.ytdlpPauseChildActive) {
            var pTitle = r.ytdlpPaused
              ? 'Продолжить загрузку (SIGCONT)'
              : 'Приостановить загрузку (SIGSTOP)';
            var pFactory = r.ytdlpPaused ? RowIco.play : RowIco.pause;
            mkIcon('row-pause-toggle', pTitle, r.id, pFactory, '');
          }
          if (st === 'Ожидание') {
            mkIcon('start', 'Скачать только эту строку', r.id, RowIco.play, '');
          } else if (rowCanRetry(st)) {
            mkIcon('retry', 'Сбросить статус и скачать эту строку заново', r.id, RowIco.retry, '');
          }
          if (typeof r.outputPath === 'string' && r.outputPath) {
            mkIcon(
              'open-handler',
              'Открыть скачанный файл в FluxAlloy',
              r.id,
              RowIco.outbound,
              ''
            );
            mkIcon('open-file', 'Открыть скачанный файл', r.id, RowIco.file, '');
            mkIcon('open-folder', 'Показать файл в папке', r.id, RowIco.folder, '');
          }
          mkIcon('up', 'Переместить строку вверх в очереди', r.id, RowIco.chevUp, '');
          mkIcon('dn', 'Переместить строку вниз в очереди', r.id, RowIco.chevDown, '');
          mkIcon('rm', 'Удалить строку из очереди', r.id, RowIco.trash, '');
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

      function wireDetailsUiPersist(id, key) {
        var el = document.getElementById(id);
        if (!el || el.tagName !== 'DETAILS') return;
        el.addEventListener('toggle', function () {
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

  const pathsBoot = resolveAppPaths()
  hydrateDownloadsQueueFromDisk(pathsBoot.userData)
  attachDownloadsQueuePersistOnQuitOnce(app)

  setDownloadsRunnerNotifier(() => {
    broadcastDownloadsSnapshot()
  })

  ipcMain.handle(d.getSnapshot, (event) => {
    if (!isDownloadsSender(event.sender)) {
      return []
    }
    const activeId = getActiveDownloadsRunnerRowId()
    const ps = getActiveYtdlpPauseState()
    return getDownloadsQueueSnapshot().map((r) => {
      const isActive = r.id === activeId
      const row: Record<string, unknown> = { ...r, isActiveRunner: isActive }
      if (isActive) {
        row['ytdlpPauseSupported'] = ps.supported
        row['ytdlpPauseChildActive'] = ps.active
        row['ytdlpPaused'] = ps.paused
      }
      return row
    })
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

  ipcMain.handle(
    d.mergeUiPanels,
    (event, raw: unknown): { ok: true } | { ok: false; error: string } => {
      if (!isDownloadsSender(event.sender)) {
        return { ok: false, error: 'Недопустимый отправитель' }
      }
      const patch = sanitizeDownloadsUiPanelPatch(raw)
      if (Object.keys(patch).length === 0) {
        return { ok: true }
      }
      const fn = downloadsBoundsHooks.mergeDownloadsWindowUiPanelsPatch
      if (!fn) {
        return { ok: false, error: 'Сохранение раскладки панелей не подключено.' }
      }
      fn(patch)
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

  const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(
    buildDownloadsHtml(downloadsBoundsHooks.getDownloadsWindowUiPanelsSnapshot?.())
  )}`

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

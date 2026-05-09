import { BrowserWindow, ipcMain, type WebContents } from 'electron'

import {
  appendUrlsFromMultilineBlock,
  clearDownloadsQueue,
  getDownloadsQueueSnapshot,
  moveDownloadsQueueRow,
  removeDownloadsQueueRow
} from './downloads-queue'
import { resolvePreloadOutFile } from './preload-resolve'

let downloadsWindow: BrowserWindow | null = null

let ipcRegistered = false

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function isDownloadsSender(sender: WebContents): boolean {
  return (
    downloadsWindow !== null &&
    !downloadsWindow.isDestroyed() &&
    sender.id === downloadsWindow.webContents.id
  )
}

function reloadDownloadsDocument(): void {
  if (!downloadsWindow || downloadsWindow.isDestroyed()) {
    return
  }
  const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(buildDownloadsHtml())}`
  void downloadsWindow.loadURL(dataUrl)
}

function buildDownloadsHtml(): string {
  const rows = getDownloadsQueueSnapshot()
  const bodyRows = rows
    .map((r, i) => {
      const url = escapeHtml(r.url)
      const st = escapeHtml(r.status)
      return `<tr>
  <td class="num">${i + 1}</td>
  <td class="url" title="${url}">${url}</td>
  <td>${st}</td>
  <td class="act">
    <button type="button" data-act="up" data-id="${r.id}" title="Вверх">↑</button>
    <button type="button" data-act="dn" data-id="${r.id}" title="Вниз">↓</button>
    <button type="button" data-act="rm" data-id="${r.id}" title="Удалить">✕</button>
  </td>
</tr>`
    })
    .join('\n')

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
    .row { display: flex; gap: 8px; flex-wrap: wrap; margin: 8px 0 14px; align-items: center; }
    button.cmd {
      border-radius: 8px; border: 1px solid #56565d; background: #2d2d30; color: #ececec;
      padding: 6px 11px; font-size: 12px; cursor: pointer;
    }
    button.cmd:hover { filter: brightness(1.06); }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th, td { border-bottom: 1px solid #3f3f46; padding: 6px 8px; text-align: left; vertical-align: top; }
    th { color: #b9b9c0; font-weight: 500; font-size: 11px; }
    td.url { word-break: break-all; max-width: 340px; }
    td.num { width: 2rem; color: #9d9da2; font-variant-numeric: tabular-nums; }
    td.act { white-space: nowrap; width: 6.5rem; }
    td.act button {
      border: none; background: transparent; color: #9dc3ff; cursor: pointer; padding: 2px 5px; font-size: 13px;
    }
    td.act button:hover { text-decoration: underline; }
    .note { margin-top: 12px; font-size: 11px; opacity: 0.72; }
  </style>
</head>
<body>
  <h1>Менеджер загрузок (yt-dlp)</h1>
  <p class="hint">Вставьте ссылки на видео (по одной на строку). Запуск yt-dlp и прогресс — в следующих итерациях §6.</p>
  <textarea id="urls" placeholder="https://…"></textarea>
  <div class="row">
    <button type="button" class="cmd" id="addBtn">Добавить в очередь</button>
    <button type="button" class="cmd" id="clearBtn">Очистить очередь</button>
  </div>
  <table>
    <thead><tr><th>№</th><th>Ссылка</th><th>Статус</th><th>Действия</th></tr></thead>
    <tbody id="queueBody">${bodyRows.length > 0 ? bodyRows : '<tr><td colspan="4" style="opacity:0.7">Очередь пуста</td></tr>'}</tbody>
  </table>
  <p class="note">Окно использует отдельный preload: команды идут в main; очередь хранится в памяти процесса.</p>
  <script>
    (function () {
      var addBtn = document.getElementById('addBtn');
      var clearBtn = document.getElementById('clearBtn');
      var urls = document.getElementById('urls');
      var body = document.getElementById('queueBody');
      addBtn.addEventListener('click', function () {
        window.fluxalloyDownloads.addLines(urls.value).then(function () {
          urls.value = '';
        });
      });
      clearBtn.addEventListener('click', function () {
        window.fluxalloyDownloads.clearQueue();
      });
      body.addEventListener('click', function (e) {
        var t = e.target.closest('[data-act]');
        if (!t) return;
        var act = t.getAttribute('data-act');
        var id = Number(t.getAttribute('data-id'));
        if (act === 'rm') window.fluxalloyDownloads.removeRow(id);
        else if (act === 'up') window.fluxalloyDownloads.moveRow(id, -1);
        else if (act === 'dn') window.fluxalloyDownloads.moveRow(id, 1);
      });
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

  ipcMain.handle('fluxalloy-downloads-add-lines', (event, text: unknown) => {
    if (!isDownloadsSender(event.sender)) {
      return 0
    }
    if (typeof text !== 'string') {
      return 0
    }
    const n = appendUrlsFromMultilineBlock(text)
    reloadDownloadsDocument()
    return n
  })

  ipcMain.handle('fluxalloy-downloads-clear', (event) => {
    if (!isDownloadsSender(event.sender)) {
      return
    }
    clearDownloadsQueue()
    reloadDownloadsDocument()
  })

  ipcMain.handle('fluxalloy-downloads-remove', (event, id: unknown) => {
    if (!isDownloadsSender(event.sender)) {
      return
    }
    if (typeof id !== 'number' || !Number.isFinite(id)) {
      return
    }
    removeDownloadsQueueRow(id)
    reloadDownloadsDocument()
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
    reloadDownloadsDocument()
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
    void downloadsWindow.loadURL(dataUrl)
    return
  }

  downloadsWindow = new BrowserWindow({
    width: 920,
    height: 620,
    show: false,
    title: 'FluxAlloy — загрузки',
    webPreferences: {
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
      preload: resolvePreloadOutFile('downloadsWindow', __dirname)
    }
  })

  downloadsWindow.on('closed', () => {
    downloadsWindow = null
  })

  void downloadsWindow.loadURL(dataUrl)
  downloadsWindow.once('ready-to-show', () => {
    downloadsWindow?.show()
  })
}

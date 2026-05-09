import { BrowserWindow } from 'electron'

let downloadsWindow: BrowserWindow | null = null

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function buildDownloadsHtml(urlFromMain: string | null): string {
  const trimmed = urlFromMain?.trim() ?? ''
  const urlBlock =
    trimmed.length > 0
      ? `<p style="opacity:0.85">Ссылка из главного окна (заглушка §6 — автозагрузки нет):</p><pre style="white-space:pre-wrap;word-break:break-all;margin:8px 0;padding:8px;background:#2d2d30;border-radius:6px">${escapeHtml(trimmed)}</pre>`
      : '<p style="opacity:0.85">Сюда переедет очередь yt-dlp по ТЗ §6.</p>'

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <title>FluxAlloy — менеджер загрузок</title>
  <style>
    body { font-family: system-ui, Segoe UI, sans-serif; padding: 18px; margin: 0;
      background: #1e1e1e; color: #e8e8ec; line-height: 1.45; }
    h1 { font-size: 1.05rem; font-weight: 600; margin: 0 0 12px; }
  </style>
</head>
<body>
  <h1>Менеджер загрузок (yt-dlp)</h1>
  ${urlBlock}
</body>
</html>`
}

/**
 * Отдельное окно §4.A / §6: пока только HTML-заглушка без React, чтобы не плодить второй Vite entry.
 * Ссылку из главного окна показываем как текст; позже заменим на полноценный renderer.
 */
export function focusOrCreateDownloadsWindow(urlFromMain: string | null): void {
  const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(buildDownloadsHtml(urlFromMain))}`

  if (downloadsWindow && !downloadsWindow.isDestroyed()) {
    downloadsWindow.focus()
    void downloadsWindow.loadURL(dataUrl)
    return
  }

  downloadsWindow = new BrowserWindow({
    width: 720,
    height: 520,
    show: false,
    title: 'FluxAlloy — загрузки',
    webPreferences: {
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
      preload: undefined
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

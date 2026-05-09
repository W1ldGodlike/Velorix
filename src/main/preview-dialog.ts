import { basename } from 'path'

import { BrowserWindow, dialog } from 'electron'

import { grantMediaPath } from './media-protocol'

export type PreviewDialogResult =
  | { ok: true; path: string; mediaUrl: string; name: string }
  | { ok: false; canceled: true }
  | { ok: false; canceled?: false; error: string }

/**
 * Системный диалог выбора локального видео (§4.B). Путь сразу регистрируется в allowlist
 * `fluxmedia://`, чтобы `<video>` мог безопасно стримить файл и в dev (Vite), и в prod.
 */
export async function openVideoWithDialog(
  browserWindow: BrowserWindow
): Promise<PreviewDialogResult> {
  const { canceled, filePaths } = await dialog.showOpenDialog(browserWindow, {
    title: 'Открыть видео',
    properties: ['openFile'],
    filters: [
      {
        name: 'Видео',
        extensions: ['mp4', 'mkv', 'webm', 'mov', 'avi', 'm4v', 'wmv', 'mpeg', 'mpg', 'ts']
      }
    ]
  })
  if (canceled || filePaths.length === 0) {
    return { ok: false, canceled: true }
  }
  const filePath = filePaths[0]
  const mediaUrl = grantMediaPath(filePath)
  if (!mediaUrl) {
    return { ok: false, error: 'Не удалось открыть файл (нет доступа или это не обычный файл)' }
  }
  return { ok: true, path: filePath, mediaUrl, name: basename(filePath) }
}

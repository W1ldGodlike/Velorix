import { existsSync, realpathSync, statSync } from 'fs'
import { normalize, resolve } from 'path'
import { pathToFileURL } from 'node:url'

import { net, protocol } from 'electron'

/**
 * Маркеры путей, которым renderer явно получил доступ (диалог выбора, DnD с путём из preload).
 *
 * Если отдавать `file:///` напрямую из произвольной строки, UI мог бы попросить main открыть
 * любой файл по угадыванию пути. Поэтому `fluxmedia://` принимает только зарегистрированные ключи.
 */
const allowedMediaPaths = new Set<string>()

/** Нужно вызвать до `app.ready`, иначе схема не получит нужных привилегий Chromium. */
export function registerFluxMediaPrivileges(): void {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: 'fluxmedia',
      privileges: {
        secure: true,
        standard: true,
        supportFetchAPI: true,
        corsEnabled: true,
        stream: true
      }
    }
  ])
}

function stableKey(absPath: string): string | null {
  if (!existsSync(absPath)) {
    return null
  }
  try {
    if (!statSync(absPath).isFile()) {
      return null
    }
    return realpathSync(absPath)
  } catch {
    return null
  }
}

/**
 * Проверка, что путь уже зарегистрирован через `grantMediaPath` — нужна для ffprobe/будущих IPC,
 * чтобы renderer не мог анализировать произвольные файлы по угадыванию пути.
 */
export function isGrantedMediaPath(filePath: string): boolean {
  const abs = resolve(normalize(filePath))
  const key = stableKey(abs)
  return key !== null && allowedMediaPaths.has(key)
}

/** Регистрирует абсолютный путь к медиафайлу и возвращает URL для `<video src>`. */
export function grantMediaPath(filePath: string): string | null {
  const abs = resolve(normalize(filePath))
  const key = stableKey(abs)
  if (!key) {
    return null
  }
  allowedMediaPaths.add(key)
  return `fluxmedia://local/?p=${encodeURIComponent(key)}`
}

export function registerFluxMediaProtocol(): void {
  protocol.handle('fluxmedia', async (request) => {
    let url: URL
    try {
      url = new URL(request.url)
    } catch {
      return new Response('Bad URL', { status: 400 })
    }
    const raw = url.searchParams.get('p')
    if (!raw) {
      return new Response('Missing p', { status: 400 })
    }
    let filePath: string
    try {
      filePath = decodeURIComponent(raw)
    } catch {
      return new Response('Bad encoding', { status: 400 })
    }

    const key = stableKey(resolve(normalize(filePath)))
    if (!key || !allowedMediaPaths.has(key)) {
      return new Response('Forbidden', { status: 403 })
    }

    return net.fetch(pathToFileURL(key).toString())
  })
}

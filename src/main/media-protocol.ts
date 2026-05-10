import { createReadStream, existsSync, realpathSync, statSync } from 'fs'
import { extname, normalize, resolve } from 'path'
import { Readable } from 'stream'

import { protocol } from 'electron'

/**
 * Маркеры путей, которым renderer явно получил доступ (диалог выбора, DnD с путём из preload).
 *
 * Если отдавать `file:///` напрямую из произвольной строки, UI мог бы попросить main открыть
 * любой файл по угадыванию пути. Поэтому `fluxmedia://` принимает только зарегистрированные ключи.
 */
const allowedMediaPaths = new Set<string>()

const MEDIA_MIME_BY_EXT: Record<string, string> = {
  '.aac': 'audio/aac',
  '.flac': 'audio/flac',
  '.m4a': 'audio/mp4',
  '.m4v': 'video/mp4',
  '.mkv': 'video/x-matroska',
  '.mov': 'video/quicktime',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.ogg': 'audio/ogg',
  '.ogv': 'video/ogg',
  '.opus': 'audio/opus',
  '.wav': 'audio/wav',
  '.webm': 'video/webm'
}

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

function mediaMimeType(filePath: string): string {
  return MEDIA_MIME_BY_EXT[extname(filePath).toLowerCase()] ?? 'application/octet-stream'
}

function parseRangeHeader(raw: string | null, size: number): { start: number; end: number } | null {
  if (!raw) {
    return null
  }
  const m = raw.match(/^bytes=(\d*)-(\d*)$/)
  if (!m) {
    return null
  }
  const startRaw = m[1] ?? ''
  const endRaw = m[2] ?? ''
  if (startRaw === '' && endRaw === '') {
    return null
  }
  if (startRaw === '') {
    const suffix = Number(endRaw)
    if (!Number.isSafeInteger(suffix) || suffix <= 0) {
      return null
    }
    return { start: Math.max(0, size - suffix), end: size - 1 }
  }
  const start = Number(startRaw)
  const end = endRaw === '' ? size - 1 : Number(endRaw)
  if (
    !Number.isSafeInteger(start) ||
    !Number.isSafeInteger(end) ||
    start < 0 ||
    end < start ||
    start >= size
  ) {
    return null
  }
  return { start, end: Math.min(end, size - 1) }
}

function streamResponse(filePath: string, request: Request): Response {
  const st = statSync(filePath)
  const size = st.size
  const mime = mediaMimeType(filePath)
  const range = parseRangeHeader(request.headers.get('range'), size)
  const baseHeaders = {
    'Accept-Ranges': 'bytes',
    'Content-Type': mime
  }

  if (request.method === 'HEAD') {
    return new Response(null, {
      status: 200,
      headers: {
        ...baseHeaders,
        'Content-Length': String(size)
      }
    })
  }

  if (range) {
    const len = range.end - range.start + 1
    return new Response(Readable.toWeb(createReadStream(filePath, range)) as ReadableStream, {
      status: 206,
      headers: {
        ...baseHeaders,
        'Content-Length': String(len),
        'Content-Range': `bytes ${range.start}-${range.end}/${size}`
      }
    })
  }

  return new Response(Readable.toWeb(createReadStream(filePath)) as ReadableStream, {
    status: 200,
    headers: {
      ...baseHeaders,
      'Content-Length': String(size)
    }
  })
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

    return streamResponse(key, request)
  })
}

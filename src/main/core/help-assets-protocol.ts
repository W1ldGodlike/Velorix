import { existsSync, readFileSync, statSync } from 'fs'
import { extname, join, normalize } from 'path'

import { protocol } from 'electron'

import { nativeMainPathSeparator } from '../platform'

const HELP_IMAGE_MIME: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml'
}

/** Схема `velorixhelp://` для картинок из `Help/assets/*` в статьях базы знаний. Регистрировать до `app.whenReady`. */
export function registerFluxHelpPrivileges(): void {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: 'velorixhelp',
      privileges: {
        secure: true,
        standard: true,
        supportFetchAPI: true,
        corsEnabled: true
      }
    }
  ])
}

/**
 * Отдаёт только файлы под `Help/assets/**` относительно каталога справки.
 * `getHelpDir` вызывается на каждый запрос (dev/packaged могут отличаться).
 */
export function registerFluxHelpProtocol(getHelpDir: () => string | null): void {
  protocol.handle('velorixhelp', (request) => {
    const helpDir = getHelpDir()
    if (!helpDir) {
      return new Response('Help not found', { status: 404 })
    }
    let pathname: string
    try {
      pathname = decodeURIComponent(new URL(request.url).pathname)
    } catch {
      return new Response('Bad URL', { status: 400 })
    }
    const rel = pathname.replace(/^\/+/, '')
    if (rel.length === 0 || rel.includes('..')) {
      return new Response('Forbidden', { status: 403 })
    }
    if (!rel.startsWith('assets/')) {
      return new Response('Forbidden', { status: 403 })
    }
    const abs = normalize(join(helpDir, rel))
    const assetsRoot = normalize(join(helpDir, 'assets'))
    const sep = nativeMainPathSeparator()
    if (abs !== assetsRoot && !abs.startsWith(assetsRoot + sep)) {
      return new Response('Forbidden', { status: 403 })
    }
    if (!existsSync(abs) || !statSync(abs).isFile()) {
      return new Response('Not found', { status: 404 })
    }
    const mime = HELP_IMAGE_MIME[extname(abs).toLowerCase()] ?? 'application/octet-stream'
    const body = readFileSync(abs)
    return new Response(body, {
      status: 200,
      headers: {
        'Content-Type': mime,
        'Cache-Control': 'public, max-age=3600'
      }
    })
  })
}

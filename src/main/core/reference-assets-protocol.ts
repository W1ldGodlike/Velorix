import { existsSync, readFileSync, statSync } from 'fs'
import { basename, extname, join, normalize } from 'path'

import { protocol } from 'electron'

import { nativeMainPathSeparator } from '../platform'

/** Схема `velorixref://` — эталонные PNG из `docs/reference/` для dev overlay. */
export function registerVelorixReferencePrivileges(): void {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: 'velorixref',
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
 * Отдаёт только `*.png` из каталога эталонов (basename, без `..`).
 * `getReferenceDir` — обычно `join(app.getAppPath(), 'docs', 'reference')`.
 */
export function registerVelorixReferenceProtocol(getReferenceDir: () => string | null): void {
  protocol.handle('velorixref', (request) => {
    const refDir = getReferenceDir()
    if (!refDir) {
      return new Response('Reference dir not found', { status: 404 })
    }
    let pathname: string
    let host = ''
    try {
      const parsed = new URL(request.url)
      pathname = decodeURIComponent(parsed.pathname)
      host = parsed.hostname
    } catch {
      return new Response('Bad URL', { status: 400 })
    }
    let name = basename(pathname.replace(/^\/+/, ''))
    if (name.length === 0 && host.length > 0 && !host.includes('..')) {
      name = host
    }
    if (name.length === 0 || name.includes('..')) {
      return new Response('Forbidden', { status: 403 })
    }
    if (extname(name).toLowerCase() !== '.png') {
      return new Response('Forbidden', { status: 403 })
    }
    const abs = normalize(join(refDir, name))
    const sep = nativeMainPathSeparator()
    if (abs !== refDir && !abs.startsWith(refDir + sep)) {
      return new Response('Forbidden', { status: 403 })
    }
    if (!existsSync(abs) || !statSync(abs).isFile()) {
      return new Response('Not found', { status: 404 })
    }
    const body = readFileSync(abs)
    return new Response(body, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600'
      }
    })
  })
}

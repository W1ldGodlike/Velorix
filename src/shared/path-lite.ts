/**
 * Минимальные path-операции без `import 'path'` — безопасно для renderer (Vite/Electron).
 * Main по-прежнему может использовать Node `path`; здесь только то, что нужно shared preview/parse.
 */

export function pathExtname(filePath: string): string {
  const base = filePath.replace(/\\/g, '/').split('/').pop() ?? ''
  const dot = base.lastIndexOf('.')
  if (dot <= 0) {
    return ''
  }
  return base.slice(dot).toLowerCase()
}

export function pathIsAbsolute(filePath: string): boolean {
  if (filePath.startsWith('/')) {
    return true
  }
  return /^[A-Za-z]:[/\\]/.test(filePath)
}

export function pathNormalize(filePath: string): string {
  const parts = filePath.replace(/\\/g, '/').split('/')
  const out: string[] = []
  for (const part of parts) {
    if (part === '' || part === '.') {
      continue
    }
    if (part === '..') {
      out.pop()
      continue
    }
    out.push(part)
  }
  const joined = out.join('/')
  if (/^[A-Za-z]:/.test(filePath.replace(/\\/g, '/'))) {
    const drive = filePath.replace(/\\/g, '/').slice(0, 2)
    return joined ? `${drive}/${joined}` : `${drive}/`
  }
  return filePath.startsWith('/') ? `/${joined}` : joined
}

/** Аналог `path.resolve` для preview: абсолютный путь нормализуем; относительный — как normalize. */
export function pathResolveForPreview(filePath: string): string {
  const normalized = pathNormalize(filePath)
  return pathIsAbsolute(filePath) ? normalized : normalized
}

import { isAbsolute, normalize } from 'path'

import { resolveYtdlpOutputDirectory } from './ytdlp-download-output'

/** §6.3 — данные для строки превью argv без фиктивного `<downloadDir>` там, где известен userData. */
export interface YtdlpCommandPreviewContext {
  /** Абсолютный каталог `-o` после `resolveYtdlpOutputDirectory(userData)`. */
  outputDirectoryAbsolute: string
  /** Первый URL из очереди загрузок; иначе в превью подставляется нейтральный пример. */
  sampleUrl?: string
}

/** Убирает управляющие символы из URL перед показом в превью (не влияет на spawn). */
export function sanitizeYtdlpPreviewUrl(raw: string): string {
  const t = raw
    .split('')
    .filter((ch) => {
      const c = ch.charCodeAt(0)
      return c >= 32 && c !== 127
    })
    .join('')
    .trim()
  return t.length > 2048 ? `${t.slice(0, 2045)}…` : t
}

/** Абсолютный каталог только для строки превью `-o` §6.3; не из persisted settings. */
export function normalizeYtdlpPreviewOutputDirectory(raw: string): string | null {
  const t = raw.trim()
  if (t.length === 0 || t.length > 4096) {
    return null
  }
  if (/[\r\n\0]/.test(t)) {
    return null
  }
  const n = normalize(t)
  return isAbsolute(n) ? n : null
}

/**
 * Собирает контекст превью для окна yt-dlp: реальный каталог загрузки и опционально пример ссылки.
 */
export function buildYtdlpCommandPreviewContext(params: {
  userDataRoot: string
  sampleUrl?: string | null
  /** §6.3 — подмена корня `-o` для превью (поле в UI), без изменения settings.json. */
  outputDirectoryOverride?: string | null
}): YtdlpCommandPreviewContext {
  let dir: string
  if (
    typeof params.outputDirectoryOverride === 'string' &&
    params.outputDirectoryOverride.trim().length > 0
  ) {
    const ov = normalizeYtdlpPreviewOutputDirectory(params.outputDirectoryOverride)
    dir = ov ?? resolveYtdlpOutputDirectory(params.userDataRoot)
  } else {
    dir = resolveYtdlpOutputDirectory(params.userDataRoot)
  }
  const u = typeof params.sampleUrl === 'string' ? params.sampleUrl.trim() : ''
  if (u.length > 0) {
    return { outputDirectoryAbsolute: dir, sampleUrl: u }
  }
  return { outputDirectoryAbsolute: dir }
}

import { existsSync, statSync } from 'node:fs'
import { dirname, normalize } from 'node:path'

/**
 * Стартовый каталог для системных диалогов «открыть видео/папку» (§4.B) и pick batch:
 * последний открытый источник → родитель файла или сама папка.
 */
export function resolveOpenMediaDialogDefaultPath(
  lastSourcePath: string | null | undefined
): string | undefined {
  if (typeof lastSourcePath !== 'string' || lastSourcePath.trim() === '') {
    return undefined
  }
  const abs = normalize(lastSourcePath.trim())
  if (!existsSync(abs)) {
    return undefined
  }
  try {
    const st = statSync(abs)
    if (st.isDirectory()) {
      return abs
    }
    if (st.isFile()) {
      return dirname(abs)
    }
  } catch {
    return undefined
  }
  return undefined
}

import { shell } from 'electron'

/** §17/безопасность: внешние ссылки из renderer/data-окон открываем только браузерными схемами. */
export function isAllowedExternalUrl(raw: string): boolean {
  try {
    const u = new URL(raw)
    return u.protocol === 'https:' || u.protocol === 'http:'
  } catch {
    return false
  }
}

export function openAllowedExternalUrl(raw: string): void {
  if (!isAllowedExternalUrl(raw)) {
    return
  }
  void shell.openExternal(raw)
}


import { shell, type WebContents } from 'electron'

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

export function shouldAllowElectronWindowNavigation(
  targetUrl: string,
  currentUrl: string
): boolean {
  if (targetUrl === currentUrl) {
    return true
  }

  try {
    const target = new URL(targetUrl)
    const current = new URL(currentUrl)

    // Dev server navigation inside the same Vite origin is legitimate during development.
    if (
      (current.protocol === 'http:' || current.protocol === 'https:') &&
      target.origin === current.origin
    ) {
      return true
    }

    // Production renderer is a single file entry. Keep same-file reloads possible, block file hops.
    return (
      current.protocol === 'file:' &&
      target.protocol === 'file:' &&
      target.pathname === current.pathname
    )
  } catch {
    return false
  }
}

export function installExternalNavigationGuard(webContents: WebContents): void {
  webContents.on('will-navigate', (event, url) => {
    if (shouldAllowElectronWindowNavigation(url, webContents.getURL())) {
      return
    }
    event.preventDefault()
    openAllowedExternalUrl(url)
  })
}

import type { MenuItemConstructorOptions } from 'electron'

import {
  listDiagnosticsFolders,
  openDiagnosticsFolder,
  type DiagnosticsFolderEntry
} from './diagnostics-paths'
import type { MainApplicationMenuDeps } from './main-application-menu-types'

let deps: MainApplicationMenuDeps | null = null

export function configureMainApplicationMenu(next: MainApplicationMenuDeps): void {
  deps = next
}

export function requireMainApplicationMenuDeps(): MainApplicationMenuDeps {
  if (!deps) {
    throw new Error('main-application-menu: configureMainApplicationMenu not called')
  }
  return deps
}

export function buildDiagnosticsFolderSubmenu(): MenuItemConstructorOptions[] {
  const d = requireMainApplicationMenuDeps()
  const entries = listDiagnosticsFolders(d.mainDownloadsUiLocale())
  return entries.map((entry: DiagnosticsFolderEntry) => ({
    label: entry.label,
    toolTip: entry.hint,
    enabled: entry.exists,
    click: (): void => {
      void openDiagnosticsFolder(entry.id)
    }
  }))
}

import { existsSync } from 'fs'
import { normalize, resolve } from 'path'

import { configureInspectorWindowHooks } from './inspector-window'
import type { StoredWindowRect } from './settings-store'
import { getCachedSettings, patchWindowBounds } from './main-cached-settings-host'

export function configureMainInspectorWindowBootstrap(): void {
  configureInspectorWindowHooks({
    getSavedInspectorBounds: () => getCachedSettings().windowBounds?.inspector,
    persistInspectorBounds: (r: StoredWindowRect) => {
      patchWindowBounds({ inspector: r })
    },
    getDefaultInspectorMediaPath: (): string | undefined => {
      const saved = getCachedSettings().lastOpenedSourcePath
      if (typeof saved !== 'string' || saved.trim().length === 0) {
        return undefined
      }
      const abs = resolve(normalize(saved.trim()))
      return existsSync(abs) ? abs : undefined
    }
  })
}

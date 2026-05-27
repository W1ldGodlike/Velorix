import { existsSync } from 'fs'
import { normalize, resolve } from 'path'

import { configureInspectorWindowHooks } from './inspector-window'
import { getCachedSettings } from '../services/settings/main-cached-settings-host'

export function configureMainInspectorWindowBootstrap(): void {
  configureInspectorWindowHooks({
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

import { mkdirSync, writeFileSync } from 'fs'
import { dirname } from 'path'

import type { AppSettings } from '../shared/settings-contract'

export type {
  AppSettings,
  AppSettingsView,
  AppTheme,
  ResolvedAppTheme,
  StoredWindowRect,
  WindowBoundsConfig
} from '../shared/settings-contract'

export { loadSettings } from './settings-store-load'

/**
 * Записывает настройки в app-data (Electron userData).
 *
 * Каталог создаётся лениво: на чистой системе `settings.json` может появиться только после
 * первого изменения темы. Когда настроек станет больше, здесь можно будет добавить временный
 * файл + rename, но для текущей маленькой схемы синхронная запись проще и предсказуемее.
 */
export function saveSettings(filePath: string, settings: AppSettings): void {
  mkdirSync(dirname(filePath), { recursive: true })
  writeFileSync(filePath, JSON.stringify(settings, null, 2), 'utf-8')
}

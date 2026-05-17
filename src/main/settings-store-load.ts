import { existsSync, readFileSync } from 'fs'

import type { AppSettings } from '../shared/settings-contract'
import {
  hydrateAppSettingsFromPartial,
  settingsStoreDefaults
} from './settings-store-hydrate'

/**
 * Читает настройки терпимо.
 *
 * Повреждённый JSON, ручное редактирование или перенос файла со старой версии не должны
 * блокировать запуск. Поэтому схема сейчас белым списком достаёт только известные поля,
 * а всё неизвестное/битое откатывает к безопасным значениям по умолчанию.
 */
export function loadSettings(filePath: string): AppSettings {
  try {
    if (!existsSync(filePath)) {
      return { ...settingsStoreDefaults }
    }
    const raw = readFileSync(filePath, 'utf-8')
    const parsed = JSON.parse(raw) as Partial<AppSettings>
    return hydrateAppSettingsFromPartial(parsed)
  } catch {
    return { ...settingsStoreDefaults }
  }
}

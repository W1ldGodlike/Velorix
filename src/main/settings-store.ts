import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { dirname } from 'path'

export type AppTheme = 'dark' | 'light'

export interface AppSettings {
  /** Тема хранится в main, чтобы меню, renderer и будущие окна не расходились между собой. */
  theme: AppTheme
  /** §4.1: последний успешно открытый локальный файл для мягкого восстановления сессии. */
  lastOpenedSourcePath?: string
  // TODO(§3/§4.6): язык, override-пути движков, hotkeys.
}

const defaults: AppSettings = { theme: 'dark' }

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
      return { ...defaults }
    }
    const raw = readFileSync(filePath, 'utf-8')
    const parsed = JSON.parse(raw) as Partial<AppSettings>
    const theme = parsed.theme === 'light' ? 'light' : 'dark'
    const last =
      typeof parsed.lastOpenedSourcePath === 'string' && parsed.lastOpenedSourcePath.trim() !== ''
        ? parsed.lastOpenedSourcePath.trim()
        : undefined
    return last === undefined ? { theme } : { theme, lastOpenedSourcePath: last }
  } catch {
    return { ...defaults }
  }
}

/**
 * Записывает настройки в userData.
 *
 * Каталог создаётся лениво: на чистой системе `settings.json` может появиться только после
 * первого изменения темы. Когда настроек станет больше, здесь можно будет добавить временный
 * файл + rename, но для текущей маленькой схемы синхронная запись проще и предсказуемее.
 */
export function saveSettings(filePath: string, settings: AppSettings): void {
  mkdirSync(dirname(filePath), { recursive: true })
  writeFileSync(filePath, JSON.stringify(settings, null, 2), 'utf-8')
}
